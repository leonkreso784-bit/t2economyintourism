/* eslint-disable no-console */
// ===== Translate subject → HRVATSKI (HRV program; vidi docs/HRV_PLAN.md) =====
// Usage:
//   node scripts/translate-subject.js <subjectId> [--limit N] [--file m1|m2] [--dry]
//
// Učita EN predmet iz catalog-a (vm window-shim), prevede SAMO string-polja iz bijelog
// popisa (name, flashcards q/a/expl, quiz q/options/expl, fillBlanks sentence/answer/hint,
// learn.content) preko Anthropic API-ja (tool_use), a SVE OSTALO (ključevi kategorija,
// icon/color, quiz.correct, `_______` token, HTML tagovi, KaTeX formule, brojevi)
// rekonstruira deterministički u JS-u → struktura se NE može pomaknuti.
//
// Izlaz: data/<subjectId>-hr/{midterm-1,midterm-2,final}.js (window var = camel(id)+Hr+{M1,M2,Final}).
// final.js = Object.assign({}, HrM1, HrM2 [, {examPractice: <prevedeno>}]) — extra kategorije
// (one u EN finalu kojih NEMA u M1∪M2, npr. examPractice) prevode se zasebno, midtermi se NE prevode dvaput.
//
//   --limit N   prevede samo prvih N kategorija po datoteci (jeftin pilot-test)
//   --file m1   prevede samo midterm-1 (ili m2)
//   --dry       ispiše plan + broj string-slotova, BEZ poziva na API (0 troška)
//
// .env: ANTHROPIC_API_KEY (korisnikov ključ; isti obrazac kao generator). NE dira engine ni EN sadržaj.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

// --- .env loader (bez ovisnosti) -------------------------------------------------
function loadEnv() {
  const p = path.join(ROOT, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

// --- vm window-shim (isti obrazac kao migrate-content.js / validate-content.js) ---
function loadWindowVars(scripts) {
  const sandbox = { window: {}, console, Math, Object, Array, JSON, String, Number, Boolean, Date };
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const rel of scripts) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) throw new Error('datoteka ne postoji: ' + rel);
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: rel });
  }
  return sandbox.window;
}

// --- camelCase id + uloga → HR var ------------------------------------------------
function camel(id) { return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }
function hrVar(id, role) { return camel(id) + 'Hr' + role; } // role ∈ M1 | M2 | Final

// --- Slot-izvlačenje: skupi SVE prevodive stringove iz jedne KATEGORIJE ------------
// Vraća { slots:[{path, text}] } gdje path je niz ključeva/indeksa za upis natrag.
// Striktan bijeli popis (ne blind walk) → ništa van popisa se ne dira.
function collectSlots(cat, catKey) {
  const slots = [];
  const add = (p, text) => { if (typeof text === 'string' && text.trim() !== '') slots.push({ path: p, text }); };
  add([catKey, 'name'], cat.name);
  (cat.flashcards || []).forEach((f, i) => {
    add([catKey, 'flashcards', i, 'question'], f.question);
    add([catKey, 'flashcards', i, 'answer'], f.answer);
    add([catKey, 'flashcards', i, 'explanation'], f.explanation);
  });
  (cat.quiz || []).forEach((q, i) => {
    add([catKey, 'quiz', i, 'question'], q.question);
    (q.options || []).forEach((o, j) => add([catKey, 'quiz', i, 'options', j], o));
    add([catKey, 'quiz', i, 'explanation'], q.explanation);
  });
  (cat.fillBlanks || []).forEach((b, i) => {
    add([catKey, 'fillBlanks', i, 'sentence'], b.sentence);
    add([catKey, 'fillBlanks', i, 'answer'], b.answer);
    add([catKey, 'fillBlanks', i, 'hint'], b.hint);
  });
  if (cat.learn && typeof cat.learn.content === 'string') add([catKey, 'learn', 'content'], cat.learn.content);
  return slots;
}

function setByPath(obj, p, val) {
  let o = obj;
  for (let i = 0; i < p.length - 1; i++) o = o[p[i]];
  o[p[p.length - 1]] = val;
}

// --- struktura-mjere za verifikaciju ---------------------------------------------
function countShape(catObj) {
  let fc = 0, quiz = 0, fill = 0;
  for (const k of Object.keys(catObj)) {
    const c = catObj[k];
    fc += (c.flashcards || []).length;
    quiz += (c.quiz || []).length;
    fill += (c.fillBlanks || []).length;
  }
  return { cats: Object.keys(catObj).length, fc, quiz, fill };
}
const katexCount = (s) => ({
  open1: (s.match(/\\\(/g) || []).length, close1: (s.match(/\\\)/g) || []).length,
  open2: (s.match(/\\\[/g) || []).length, close2: (s.match(/\\\]/g) || []).length,
  dd: (s.match(/\$\$/g) || []).length
});
const tagCount = (s) => (s.match(/<[^>]+>/g) || []).length;

// --- Anthropic API: prevedi batch slotova ----------------------------------------
const TRANSLATE_TOOL = {
  name: 'emit_translations',
  description: 'Return Croatian (hr-HR) translations for the given numbered source strings.',
  input_schema: {
    type: 'object',
    properties: {
      translations: {
        type: 'array',
        items: { type: 'object', properties: { i: { type: 'integer' }, t: { type: 'string' } }, required: ['i', 't'] }
      }
    },
    required: ['translations']
  }
};

function buildPrompt(batch) {
  return [
    'Translate each source string below into Croatian (hr-HR), formal academic/textbook register,',
    'as used in a Croatian university hospitality-management course. Call emit_translations with one',
    '{ i, t } per input id. STRICT RULES — preserve EXACTLY, do not translate or alter:',
    '- HTML tags, attributes and entities (e.g. <h3>, <ul>, <li>, <strong>, &amp;, &nbsp;) — translate only the visible text between tags.',
    '- The literal blank token "_______" (seven underscores) — keep it exactly, in the same place in the sentence.',
    '- KaTeX math: anything inside \\( ... \\), \\[ ... \\] or $$ ... $$ — keep the delimiters and the formula verbatim.',
    '- Numbers, units, currency (e.g. "EUR 25"), dates, code/identifiers and proper nouns (people, brands, standards like "Chicago Manual of Style").',
    '- Do NOT add, remove, merge or reorder items. Return one translation per id. Keep newlines (\\n) where present.',
    '- Natural, fluent Croatian — not word-for-word; correct terminology for the field.',
    '',
    'Each source string is given on its own as [id] ⟦text⟧. Return the translation for every id.',
    '',
    ...batch.map((b) => `[${b.i}] ⟦${b.text}⟧`)
  ].join('\n');
}

async function callModel(prompt, model, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model, max_tokens: 16000, temperature: 0.2,
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: 'tool', name: 'emit_translations' },
      system: 'You are a professional EN→HR (Croatian) translator for university study materials. '
        + 'You translate meaning faithfully while preserving all markup, math and structure verbatim.',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error('API ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  if (data.stop_reason === 'max_tokens') throw new Error('odgovor odsiječen na max_tokens — smanji batch');
  const block = (data.content || []).find((b) => b.type === 'tool_use');
  if (!block || !block.input) throw new Error('nema tool_use bloka');
  return { list: parseTranslations(block.input.translations), usage: data.usage || {}, stop: data.stop_reason, rawInput: block.input };
}

// Model OBIČNO vrati `translations` kao array, ali ČESTO kao ručno-serijaliziran JSON-STRING
// s neispravnim escapeom navodnika (npr. unutar prijevoda) → JSON.parse pukne. Robustno:
//  1) ako je već array → vrati;
//  2) probaj JSON.parse;
//  3) salvage: izvuci svaki { "i":N, "t":"…" } regexom čija je granica `"}` + (`,{` ili `]`) —
//     to je gotovo nemoguće da se pojavi unutar prevedene proze, pa toleriramo navodnike u tekstu.
function unescapeJsonStr(s) {
  return s
    .replace(/\\\\/g, ' ')   // privremeno zaštiti escapeani backslash
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '')
    .replace(/\\"/g, '"').replace(/\\\//g, '/')
    .replace(/ /g, '\\');
}
function parseTranslations(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return [];
  try { const a = JSON.parse(raw); if (Array.isArray(a)) return a; } catch (_) { /* salvage dolje */ }
  const out = [];
  const re = /\{\s*"i"\s*:\s*(\d+)\s*,\s*"t"\s*:\s*"([\s\S]*?)"\s*\}\s*(?=,\s*\{|\]\s*$|\]\s*,|$)/g;
  let m;
  while ((m = re.exec(raw)) !== null) out.push({ i: Number(m[1]), t: unescapeJsonStr(m[2]) });
  return out;
}

// Prevedi sve slotove (s globalnim indeksom i), batchano po proračunu znakova; retry za nedostajuće.
async function translateSlots(allSlots, model, apiKey, stat) {
  const MAX_CHARS = 2500, MAX_ITEMS = 12;
  const out = new Array(allSlots.length).fill(null);
  // pripremi batcheve
  const batches = [];
  let cur = [], curChars = 0;
  allSlots.forEach((s, i) => {
    if (cur.length && (curChars + s.text.length > MAX_CHARS || cur.length >= MAX_ITEMS)) { batches.push(cur); cur = []; curChars = 0; }
    cur.push({ i, text: s.text }); curChars += s.text.length;
  });
  if (cur.length) batches.push(cur);

  for (let b = 0; b < batches.length; b++) {
    let batch = batches[b];
    process.stdout.write(`  batch ${b + 1}/${batches.length} (${batch.length} slotova) … `);
    for (let attempt = 1; attempt <= 3 && batch.length; attempt++) {
      let r;
      try { r = await callModel(buildPrompt(batch), model, apiKey); }
      catch (e) { process.stdout.write(`[${e.message.slice(0, 40)}] `); if (attempt < 3) continue; throw e; }
      stat.in += r.usage.input_tokens || 0; stat.out += r.usage.output_tokens || 0;
      for (const tr of r.list) { if (Number.isInteger(tr.i) && typeof tr.t === 'string' && out[tr.i] == null) out[tr.i] = tr.t; }
      batch = batch.filter((x) => out[x.i] == null); // ostali nedostajući → retry
      if (batch.length && attempt < 3) process.stdout.write(`retry(${batch.length}) `);
    }
    console.log(batch.length ? `⚠ ${batch.length} nedostaje` : '✓');
  }
  const missing = out.filter((x) => x == null).length;
  if (missing) throw new Error(missing + ' slotova nije prevedeno nakon retryja');
  return out;
}

// --- serijalizacija u valjan JS data-fajl (JSON.stringify = bajt-točan escaping) --
function emitFile(outPath, varName, obj, header) {
  const body = '// ' + header + '\n'
    + '// Auto-generirano: scripts/translate-subject.js (HRV program — docs/HRV_PLAN.md). NE uređuj ručno; ponovno prevedi izvor.\n\n'
    + 'const ' + varName + ' = ' + JSON.stringify(obj, null, 2) + ';\n\n'
    + "if (typeof window !== 'undefined') { window." + varName + ' = ' + varName + '; }\n'
    + "if (typeof module !== 'undefined' && module.exports) { module.exports = " + varName + '; }\n';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body);
}

function emitFinal(outPath, finalVar, m1Var, m2Var, hasExtra, header) {
  let assign = 'Object.assign(\n    {},\n'
    + "    (typeof window !== 'undefined' && window." + m1Var + ') ? window.' + m1Var + ' : {},\n'
    + "    (typeof window !== 'undefined' && window." + m2Var + ') ? window.' + m2Var + ' : {}';
  if (hasExtra) assign += ',\n    { examPractice: ' + finalVar + 'ExamPractice }';
  assign += '\n  )';
  const extraConst = hasExtra
    ? 'const ' + finalVar + 'ExamPractice = __EXAMPRACTICE__;\n\n' : '';
  const body = '// ' + header + '\n'
    + '// Auto-generirano: scripts/translate-subject.js (HRV program). Spaja HR M1 + M2'
    + (hasExtra ? ' + prevedeni examPractice' : '') + '. MORA se učitati POSLIJE midterm-1/2.\n\n'
    + extraConst
    + 'const ' + finalVar + ' = ' + assign + ';\n\n'
    + "if (typeof window !== 'undefined') { window." + finalVar + ' = ' + finalVar + '; }\n';
  return body; // examPractice ubacuje pozivatelj (treba prevedeni objekt)
}

async function main() {
  const args = process.argv.slice(2);
  const subjectId = args[0];
  if (!subjectId || subjectId.startsWith('--')) { console.error('Usage: node scripts/translate-subject.js <subjectId> [--limit N] [--file m1|m2] [--dry]'); process.exit(1); }
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? (args[i + 1] || true) : null; };
  const limit = opt('--limit') ? Number(opt('--limit')) : 0;
  const onlyFile = opt('--file');
  const dry = args.includes('--dry');

  const s = SokratCatalog.getSubject(subjectId);
  if (!s || !s.content || !s.content.scripts) { console.error('Nepoznat predmet ili nema content.scripts: ' + subjectId); process.exit(2); }

  const m1Key = s.content.resolve['first-midterm'] || s.content.resolve['midterm-1'];
  const m2Key = s.content.resolve['second-midterm'] || s.content.resolve['midterm-2'];
  const finalKey = s.content.resolve['final'];
  if (!m1Key || !m2Key) { console.error('Predmet nema first/second-midterm var u resolve — zasad podržavam samo K1/K2/final predmete.'); process.exit(2); }

  const win = loadWindowVars(s.content.scripts);
  const m1 = win[m1Key], m2 = win[m2Key], finalObj = finalKey ? win[finalKey] : null;
  if (!m1 || !m2) { console.error('M1/M2 nisu na window-u.'); process.exit(2); }

  // extra = kategorije u finalu kojih NEMA u M1∪M2 (npr. examPractice) → prevode se zasebno
  const baseKeys = new Set([...Object.keys(m1), ...Object.keys(m2)]);
  const extraKeys = finalObj ? Object.keys(finalObj).filter((k) => !baseKeys.has(k)) : [];

  const outId = subjectId + '-hr';
  const v1 = hrVar(subjectId, 'M1'), v2 = hrVar(subjectId, 'M2'), vF = hrVar(subjectId, 'Final');

  // sastavi posao po datotekama
  const jobs = [];
  if (onlyFile !== 'm2') jobs.push({ role: 'M1', key: m1Key, obj: m1, outVar: v1, out: `data/${outId}/midterm-1.js` });
  if (onlyFile !== 'm1') jobs.push({ role: 'M2', key: m2Key, obj: m2, outVar: v2, out: `data/${outId}/midterm-2.js` });

  // DRY: samo izmjeri
  let grand = 0;
  for (const j of jobs) {
    let cats = Object.keys(j.obj); if (limit) cats = cats.slice(0, limit);
    let n = 0; for (const ck of cats) n += collectSlots(j.obj[ck], ck).length;
    console.log(`${j.role} (${j.outVar}): ${cats.length} kat. → ${n} string-slotova`);
    grand += n;
  }
  if (extraKeys.length) {
    let n = 0; for (const ck of extraKeys) n += collectSlots(finalObj[ck], ck).length;
    console.log(`Final extra (${extraKeys.join(', ')}): ${n} slotova`);
    grand += n;
  } else if (finalKey) {
    console.log('Final: čisti Object.assign(M1,M2) — 0 dodatnih za prijevod.');
  }
  console.log(`UKUPNO: ${grand} slotova. Procjena ~$${((grand * 60 / 1e6) * 3 + (grand * 80 / 1e6) * 15).toFixed(2)} (gruba).`);

  if (dry) { console.log('\nDRY — ništa nije prevedeno ni zapisano.'); return; }

  const model = process.env.GENERATOR_MODEL || 'claude-sonnet-4-6';
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.error('Nema ANTHROPIC_API_KEY u .env'); process.exit(1); }
  const stat = { in: 0, out: 0 };

  // --- prevedi svaku data-datoteku (M1, M2) -------------------------------------
  for (const j of jobs) {
    console.log(`\n=== Prevodim ${j.role} → ${j.out} ===`);
    let cats = Object.keys(j.obj); if (limit) cats = cats.slice(0, limit);
    const subset = {}; for (const ck of cats) subset[ck] = JSON.parse(JSON.stringify(j.obj[ck])); // duboka kopija (samo podaci)
    const slots = []; for (const ck of cats) collectSlots(subset[ck], ck).forEach((sl) => slots.push(sl));
    const translated = await translateSlots(slots, model, apiKey, stat);
    slots.forEach((sl, i) => setByPath(subset, sl.path, translated[i]));

    // verifikacija EN-podskup ↔ HR
    const before = countShape((function () { const o = {}; for (const ck of cats) o[ck] = j.obj[ck]; return o; })());
    const after = countShape(subset);
    const problems = [];
    if (before.cats !== after.cats || before.fc !== after.fc || before.quiz !== after.quiz || before.fill !== after.fill)
      problems.push(`shape mismatch EN ${JSON.stringify(before)} vs HR ${JSON.stringify(after)}`);
    for (const ck of cats) {
      (subset[ck].fillBlanks || []).forEach((b, i) => { if (!String(b.sentence).includes('_______')) problems.push(`${ck}.fill[${i}] izgubio _______`); });
      (subset[ck].quiz || []).forEach((q, i) => { if (q.options.length !== j.obj[ck].quiz[i].options.length) problems.push(`${ck}.quiz[${i}] options len`); });
      // KaTeX + HTML balans na learn.content
      if (subset[ck].learn && subset[ck].learn.content) {
        const a = katexCount(j.obj[ck].learn.content), c = katexCount(subset[ck].learn.content);
        if (JSON.stringify(a) !== JSON.stringify(c)) problems.push(`${ck}.learn KaTeX balans EN ${JSON.stringify(a)} vs HR ${JSON.stringify(c)}`);
        if (tagCount(j.obj[ck].learn.content) !== tagCount(subset[ck].learn.content)) problems.push(`${ck}.learn HTML tag count`);
      }
    }
    if (problems.length) { console.error('  ✗ PROBLEMI:\n   - ' + problems.join('\n   - ')); process.exit(3); }
    console.log(`  ✓ verifikacija OK (kat ${after.cats}, fc ${after.fc}, quiz ${after.quiz}, fill ${after.fill})`);

    const fullObj = limit ? subset : subset; // (limit: zapisujemo samo podskup — za pilot-test)
    emitFile(path.join(ROOT, j.out), j.outVar, fullObj, `${s.name} (HR) — ${j.role}`);
    console.log('  ✅ zapisano ' + j.out);
  }

  // --- final.js (merge + eventualni prevedeni examPractice) ----------------------
  if (finalKey && onlyFile == null && !limit) {
    let extraObj = null;
    if (extraKeys.length) {
      console.log(`\n=== Prevodim Final extra (${extraKeys.join(', ')}) ===`);
      const subset = {}; for (const ck of extraKeys) subset[ck] = JSON.parse(JSON.stringify(finalObj[ck]));
      const slots = []; for (const ck of extraKeys) collectSlots(subset[ck], ck).forEach((sl) => slots.push(sl));
      const translated = await translateSlots(slots, model, apiKey, stat);
      slots.forEach((sl, i) => setByPath(subset, sl.path, translated[i]));
      // examPractice je obično jedan ključ; uzmi ga
      extraObj = subset[extraKeys[0]];
    }
    let body = emitFinal(null, vF, v1, v2, !!(extraObj), `${s.name} (HR) — Final`);
    body = body.replace('__EXAMPRACTICE__', extraObj ? JSON.stringify(extraObj, null, 2) : '{}');
    fs.mkdirSync(path.join(ROOT, 'data', outId), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'data', outId, 'final.js'), body);
    console.log('  ✅ zapisano data/' + outId + '/final.js');
  }

  const cost = (stat.in / 1e6) * 3 + (stat.out / 1e6) * 15;
  console.log(`\nTokeni: in=${stat.in} out=${stat.out} (~$${cost.toFixed(3)}).`);
  console.log('✅ Prijevod gotov. Dalje: dodaj HR program+subject u catalog (Cigla 4), bump cache, verify + Playwright.');
  process.exit(0);
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
