/* eslint-disable no-console */
// ===== Generate subject — korak 3 generatora predmeta =====
// Usage:
//   node scripts/generate-subject.js <subjectId> [--topic <id>] [--limit N] [--math] [--dry]
//
// Čita tmp/<subjectId>/topics.json (iz build-topics.js) i za SVAKU temu zove Anthropic
// API (model iz .env GENERATOR_MODEL, default claude-sonnet-4-6) sa strogim schema-promptom
// + few-shot primjerom. Model vraća SAMO sadržaj (flashcards/quiz/fillBlanks/learn); skripta
// deterministički dodaje name/icon/color i sprema tmp/<subjectId>/draft.json.
//
//   --topic <id>  generiraj samo jednu temu (jeftin test)
//   --limit N     prvih N tema
//   --math        ubaci KaTeX upute (kvantitativni predmeti)
//   --dry         složi prompt i ispiši ga, BEZ poziva na API (0 troška)
//
// Bulk drafting ovdje ide na JEFTIN model (ne Opus). Izlaz se NE commita (tmp/ gitignored);
// brick 4 (assemble-subject.js) ga pretvara u data/<subjectId>/*.js, a brick 1
// (validate-content.js) je završni zaštitar.

const fs = require('fs');
const path = require('path');

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

// --- icon/color paleta (deterministički po indeksu kategorije) -------------------
const PALETTE = [
  ['fa-book-open', '#3b82f6'], ['fa-lightbulb', '#f59e0b'], ['fa-chart-line', '#10b981'],
  ['fa-compass', '#14b8a6'], ['fa-cubes', '#8b5cf6'], ['fa-gears', '#ef4444'],
  ['fa-flask', '#ec4899'], ['fa-globe', '#0ea5e9'], ['fa-scale-balanced', '#6366f1'],
  ['fa-layer-group', '#f43f5e'], ['fa-seedling', '#22c55e'], ['fa-bullseye', '#eab308'],
];

// Structured-output alat: model PUNI ovu shemu, a Anthropic API jamči valjan objekt
// (content[].input je već parsiran) → nestaje cijela klasa "unescaped quote → nevaljan JSON"
// bugova, presudno za sadržaj prepun navodnika (Chicago citati, Boolean "" operatori).
const CONTENT_TOOL = {
  name: 'emit_study_content',
  description: 'Return study content (flashcards, quiz, fillBlanks, learn) for one topic.',
  input_schema: {
    type: 'object',
    properties: {
      flashcards: {
        type: 'array',
        items: { type: 'object', properties: { question: { type: 'string' }, answer: { type: 'string' }, explanation: { type: 'string' } }, required: ['question', 'answer'] }
      },
      quiz: {
        type: 'array',
        items: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' } }, correct: { type: 'integer', description: '0-based index of the correct option' } }, required: ['question', 'options', 'correct'] }
      },
      fillBlanks: {
        type: 'array',
        items: { type: 'object', properties: { sentence: { type: 'string', description: 'MUST contain the literal blank "_______"' }, answer: { type: 'string' }, hint: { type: 'string' } }, required: ['sentence', 'answer'] }
      },
      learn: { type: 'object', properties: { content: { type: 'string', description: 'REQUIRED. A substantial 350–600 word textbook-style HTML article (multiple <h3> sections, <p>, <ul>/<li>, <strong>). Never empty or short.' } }, required: ['content'] }
    },
    required: ['flashcards', 'quiz', 'fillBlanks', 'learn']
  }
};

function buildPrompt(topic, math) {
  const mathRules = math
    ? 'This is a QUANTITATIVE subject. For math use KaTeX delimiters: inline \\( ... \\) and display \\[ ... \\]. '
      + 'NEVER use a single $ as a math delimiter. Write currency as "EUR 25" (not "$25"). Show worked steps in learn.content.'
    : 'Write currency as "EUR 25"; do NOT use a single $ as a math delimiter.';
  return [
    `Topic title: "${topic.title}"`,
    `This content belongs to the "${topic.lesson}" lesson.`,
    '',
    'Call the emit_study_content tool with content for this topic. Requirements:',
    '- Base EVERY fact ONLY on the SOURCE TEXT below. Do NOT invent facts not supported by it.',
    '- Produce 10–14 flashcards, 8–12 quiz questions, 6–10 fillBlanks.',
    '- learn.content is the MOST IMPORTANT field: a substantial 350–600 word textbook-style HTML article '
      + '(several <h3> sections with <p>, <ul>/<li>, <strong>): definition, intuition, key points, common pitfalls. '
      + 'NEVER leave learn.content empty or one line — it must read like a textbook chapter.',
    '- quiz: "correct" is the 0-based INDEX of the correct option; distractors must be plausible.',
    '- EVERY fillBlank "sentence" MUST contain the literal blank "_______".',
    '- Language: English.',
    '- ' + mathRules,
    '',
    'SOURCE TEXT:',
    '"""',
    topic.text,
    '"""'
  ].join('\n');
}

async function callModel(prompt, model, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 16000,        // bogata kategorija (14fc+12quiz+10fill+learn) ne smije se odsjeći
      temperature: 0.3,         // nisko = vjernije izvoru, manje halucinacija
      tools: [CONTENT_TOOL],
      tool_choice: { type: 'tool', name: 'emit_study_content' },  // PRISILI strukturirani izlaz
      system: 'You are a meticulous study-content author for a flashcards/quiz/fill/learn platform '
        + '(FMTU Opatija, Hospitality Management), grounded strictly in the provided source text.',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error('API ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  // Odsiječen odgovor = nepotpun tool-input; jasna greška umjesto tihog faila
  if (data.stop_reason === 'max_tokens') throw new Error('odgovor odsiječen na max_tokens — tema prevelika, povećaj limit ili podijeli temu');
  const block = (data.content || []).find((b) => b.type === 'tool_use');
  if (!block || !block.input) throw new Error('nema tool_use bloka u odgovoru');
  return { obj: block.input, usage: data.usage || {}, raw: JSON.stringify(data) };
}

// tool_use ponekad vrati ugniježđeno polje (npr. learn) kao JSON-string umjesto objekta
// → parsiraj ga natrag. Ako nije string, vrati kako jest (ili fallback ako je prazno).
function coerce(v, fallback) {
  if (typeof v === 'string') { try { return JSON.parse(v); } catch (_) { return fallback; } }
  return v == null ? fallback : v;
}

// Laka strukturna provjera (kanonski validator je validate-content.js u brick 4)
function sanity(key, cat) {
  const problems = [];
  for (const k of ['flashcards', 'quiz', 'fillBlanks', 'learn']) if (!(k in cat)) problems.push('nedostaje ' + k);
  if (Array.isArray(cat.quiz)) cat.quiz.forEach((q, i) => {
    if (!Array.isArray(q.options) || q.options.length < 2) problems.push(`quiz[${i}] options`);
    else if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) problems.push(`quiz[${i}] correct OOB`);
  });
  if (Array.isArray(cat.fillBlanks)) cat.fillBlanks.forEach((b, i) => { if (!String(b.sentence || '').includes('_______')) problems.push(`fillBlank[${i}] nema _______`); });
  if (!cat.learn || !cat.learn.content) problems.push('learn.content prazno');
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const subjectId = args[0];
  if (!subjectId || subjectId.startsWith('--')) { console.error('Usage: node scripts/generate-subject.js <subjectId> [--topic id] [--limit N] [--math] [--dry]'); process.exit(1); }
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] || true) : null; };
  const onlyTopic = opt('--topic');
  const limit = opt('--limit') ? Number(opt('--limit')) : 0;
  const math = args.includes('--math');
  const dry = args.includes('--dry');

  const topicsFile = path.join(ROOT, 'tmp', subjectId, 'topics.json');
  if (!fs.existsSync(topicsFile)) { console.error('Nema ' + path.relative(ROOT, topicsFile) + ' — pokreni build-topics.js prvo.'); process.exit(1); }
  const { topics } = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));

  let work = topics;
  if (onlyTopic && typeof onlyTopic === 'string') work = topics.filter((t) => t.id === onlyTopic);
  if (limit) work = work.slice(0, limit);
  if (!work.length) { console.error('Nema tema za generirati (provjeri --topic/--limit).'); process.exit(1); }

  const model = process.env.GENERATOR_MODEL || 'claude-sonnet-4-6';
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!dry && !apiKey) { console.error('Nema ANTHROPIC_API_KEY u .env'); process.exit(1); }

  if (dry) {
    console.log('=== DRY: prompt za "' + work[0].id + '" (' + (math ? 'math' : 'text') + ') ===\n');
    console.log(buildPrompt(work[0], math));
    return;
  }

  const draftFile = path.join(ROOT, 'tmp', subjectId, 'draft.json');
  const draft = fs.existsSync(draftFile) ? JSON.parse(fs.readFileSync(draftFile, 'utf8')) : { subjectId, model, generatedAt: new Date().toISOString(), lessons: {} };
  let totalIn = 0, totalOut = 0, totalProblems = 0;

  for (let i = 0; i < work.length; i++) {
    const topic = work[i];
    process.stdout.write(`[${i + 1}/${work.length}] ${topic.id} (${topic.lesson}) … `);
    // tool_use nekad vrati learn kao string ili prazno (nedeterministički, češće kad je zadnji
    // u shemi nakon velikih nizova) → coerce + retry dok learn.content ne bude pun.
    const [icon, color] = PALETTE[i % PALETTE.length];
    let cat = null, lastRaw = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const prompt = buildPrompt(topic, math) + (attempt > 1 ? '\n\nIMPORTANT: learn.content MUST be a full 350–600 word HTML article — do not leave it empty.' : '');
        const { obj, usage, raw } = await callModel(prompt, model, apiKey);
        totalIn += usage.input_tokens || 0; totalOut += usage.output_tokens || 0;
        lastRaw = raw;
        let learn = coerce(obj.learn, { content: '' });
        if (typeof learn === 'string') learn = { content: learn };        // learn stigao kao goli HTML-string
        if (!learn || typeof learn !== 'object') learn = { content: '' };
        const cand = {
          name: topic.title, icon, color,
          flashcards: coerce(obj.flashcards, []),
          quiz: coerce(obj.quiz, []),
          fillBlanks: coerce(obj.fillBlanks, []),
          learn
        };
        if (!cand.learn.content || cand.learn.content.length < 200) throw new Error('learn.content prazno/prekratko');
        if (!cand.flashcards.length) throw new Error('nema flashcards');
        cat = cand;
        break;
      } catch (e) {
        if (attempt === 3) {
          console.log('✗ ' + e.message);
          // spremi sirovi odgovor za dijagnozu (tmp/ je gitignored)
          try { fs.writeFileSync(path.join(ROOT, 'tmp', subjectId, 'failed-' + topic.id + '.txt'), lastRaw); } catch (_) { /* ignore */ }
        }
      }
    }
    if (!cat) { totalProblems++; continue; }

    const full = cat;
    const problems = sanity(topic.id, full);
    draft.lessons[topic.lesson] = draft.lessons[topic.lesson] || {};
    draft.lessons[topic.lesson][topic.id] = full;
    console.log(`fc=${full.flashcards.length} quiz=${full.quiz.length} fill=${full.fillBlanks.length}` + (problems.length ? ' ⚠ ' + problems.join('; ') : ' ✓'));
    if (problems.length) totalProblems++;
  }

  fs.writeFileSync(draftFile, JSON.stringify(draft, null, 2));
  const cost = (totalIn / 1e6) * 3 + (totalOut / 1e6) * 15; // Sonnet ~$3/$15 po M tokena (gruba procjena)
  console.log(`\nTokeni: in=${totalIn} out=${totalOut} (~$${cost.toFixed(3)}). Problema: ${totalProblems}.`);
  console.log('✅ Draft: ' + path.relative(ROOT, draftFile));
  // Eksplicitan izlaz: preduhitri undici/libuv socket-teardown assertion na Windowsu
  // ("UV_HANDLE_CLOSING") koja inače baci lažni nonzero exit nakon urednog završetka.
  process.exit(totalProblems ? 1 : 0);
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
