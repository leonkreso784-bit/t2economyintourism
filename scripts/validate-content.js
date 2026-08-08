/* eslint-disable no-console */
// ===== Content schema validator =====
// Pokreni:  node scripts/validate-content.js [subjectId]
//   - bez argumenta: validira SVE predmete iz catalog-a
//   - sa subjectId:  validira samo taj predmet (npr. `node scripts/validate-content.js statistics`)
//
// Deterministička provjera SADRŽAJA (ne katalog-strukture — to radi verify-catalog.js):
// svaka kategorija mora poštovati docs/architecture/CONTENT_SCHEMA.md (name/icon/color + valjani
// flashcards/quiz/fillBlanks/learn), quiz `correct` mora biti valjan indeks, fillBlank
// mora imati prazninu, KaTeX delimiteri moraju biti uravnoteženi (currency-safe).
//
// Ovo je zaštitar generatora predmeta: pokreće se na svaki generirani predmet PRIJE
// nego sadržaj uđe u repo. 0 troška, hard-fail na greškama.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

let errors = 0;
let warnings = 0;
const fail = (m) => { console.error('  ✗ ' + m); errors++; };
const warn = (m) => { console.warn('  ! ' + m); warnings++; };

// --- Učitaj data-skriptu kroz vm s window shimom (radi za stare i nove datoteke) ---
const sandboxCache = {};
function loadWindowVars(scripts) {
  const key = scripts.join('|');
  if (sandboxCache[key]) return sandboxCache[key];
  const sandbox = { window: {}, console, Math, Object, Array, JSON, String, Number, Boolean, Date };
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const rel of scripts) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { fail(`datoteka ne postoji: ${rel}`); continue; }
    try {
      vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: rel });
    } catch (e) {
      fail(`greška pri izvršavanju ${rel}: ${e.message}`);
    }
  }
  sandboxCache[key] = sandbox.window;
  return sandbox.window;
}

const isNonEmptyStr = (v) => typeof v === 'string' && v.trim().length > 0;
const HEX = /^#[0-9a-fA-F]{6}$/;
const CAMEL = /^[a-z][a-zA-Z0-9]*$/;

// Standard duljine kartice (CONTENT_SCHEMA §Standard duljine, Leon 2026-07-15): kartica = KRATKA
// definicija, detalj ide u learn. SOFT gate — surface-a dug, NE ruši build (warnings ne mijenjaju exit).
//
// M5a: pragovi se NE prepisuju ovdje. Editor i validator moraju govoriti isti broj — kad su bili
// dvije kopije, jedna je neizbježno odlutala (ADR-027, povod BUG-023). Politika živi u
// `js/card-limits.js`; učitava se istim shim-obrascem kojim je unit testovi učitavaju.
const cardLimitsWin = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'js', 'card-limits.js'), 'utf8'))(cardLimitsWin);
const CARD_LIMITS = cardLimitsWin.SokratCardLimits;
const CARD_ANSWER_SOFT_MAX = CARD_LIMITS.SOFT;   // 200 — jezgra definicije
const CARD_ANSWER_HARD_MAX = CARD_LIMITS.HARD;   // 500 — tvrdi strop editora
const CARD_EXPL_SOFT_MAX = 250;     // nijansa/mnemonik, ne odlagalište skripte

// M5a: raspodjela duljina odgovora — BROJKA, NE GATE. Retroaktivni gate na 200 srušio bi
// 46 % kataloga, pa se trend samo mjeri; zatezanje ide kroz M5b (skratiti pa tek onda maxLength).
const BUCKETS = [100, 200, 300, 500, Infinity];
const bucketLabel = (i) => (i === 0 ? `≤${BUCKETS[0]}` :
  (BUCKETS[i] === Infinity ? `>${BUCKETS[i - 1]}` : `${BUCKETS[i - 1] + 1}–${BUCKETS[i]}`));
const newHistogram = () => BUCKETS.map(() => 0);
function addToHistogram(hist, len) {
  for (let i = 0; i < BUCKETS.length; i++) {
    if (len <= BUCKETS[i]) { hist[i]++; return; }
  }
}

// --- KaTeX currency-safety: delimiteri moraju biti uravnoteženi -------------------
// (?<!\\) lookbehind: ignoriraj \\( \\[ itd. — dvostruka kosa crta je LaTeX prijelom
// retka (npr. "\\\\[2pt]" unutar aligned), NE display-math delimiter.
function checkKatex(where, text) {
  if (typeof text !== 'string') return;
  const cInlineOpen = (text.match(/(?<!\\)\\\(/g) || []).length;
  const cInlineClose = (text.match(/(?<!\\)\\\)/g) || []).length;
  const cBlockOpen = (text.match(/(?<!\\)\\\[/g) || []).length;
  const cBlockClose = (text.match(/(?<!\\)\\\]/g) || []).length;
  const cDouble = (text.match(/\$\$/g) || []).length;
  if (cInlineOpen !== cInlineClose) fail(`${where}: neuravnoteženi \\( ${cInlineOpen} vs \\) ${cInlineClose}`);
  if (cBlockOpen !== cBlockClose) fail(`${where}: neuravnoteženi \\[ ${cBlockOpen} vs \\] ${cBlockClose}`);
  if (cDouble % 2 !== 0) fail(`${where}: neparan broj $$ delimitera (${cDouble})`);
}

// --- Learn-blokovi (schema v2): semanticka provjera POVRH JSON Scheme -------------
// Schema (subject-content.schema.json) provjerava OBLIK/tipove/polja; ovdje dodajemo
// semantiku: poznat tip + KaTeX-balans na inline prozi (currency-safe, kao v1 content).
// Ugovor 1:1 prati js/blocks-renderer.js (9 tipova, inline = string ILI runs).
const BLOCK_TYPES = { heading: 1, paragraph: 1, list: 1, callout: 1, image: 1, video: 1, table: 1, formula: 1, 'legacy-html': 1 };

// inline = string ILI runs [{text,b?,i?,color?,href?}] → KaTeX-balans na prozi
function checkInline(where, x) {
  if (typeof x === 'string') { checkKatex(where, x); return; }
  if (Array.isArray(x)) x.forEach((run, i) => {
    if (run && typeof run === 'object' && typeof run.text === 'string') checkKatex(`${where}.run[${i}]`, run.text);
  });
}

function validateBlocks(where, blocks) {
  blocks.forEach((b, i) => {
    const w = `${where}.block[${i}]`;
    if (!b || typeof b !== 'object') { fail(`${w} nije objekt`); return; }
    if (!BLOCK_TYPES[b.type]) { fail(`${w} nepoznat tip bloka "${b.type}"`); return; }
    switch (b.type) {
      case 'heading':
      case 'paragraph':
        checkInline(`${w}.text`, b.text);
        break;
      case 'callout':
        checkInline(`${w}.text`, b.text);
        if (b.title != null) checkKatex(`${w}.title`, b.title);
        break;
      case 'list':
        if (Array.isArray(b.items)) b.items.forEach((it, j) => checkInline(`${w}.items[${j}]`, it));
        break;
      case 'image':
        if (b.caption != null) checkInline(`${w}.caption`, b.caption);
        break;
      case 'table':
        if (Array.isArray(b.header)) b.header.forEach((c, j) => checkInline(`${w}.header[${j}]`, c));
        if (Array.isArray(b.rows)) b.rows.forEach((row, r) => {
          if (Array.isArray(row)) row.forEach((c, cc) => checkInline(`${w}.rows[${r}][${cc}]`, c));
        });
        break;
      // video/formula/legacy-html: KaTeX-balans se NE primjenjuje
      //   (formula.tex je RAW tex → renderer dodaje \[ \]; legacy-html → DOMPurify; video = ID)
    }
  });
}

// --- Validacija jedne kategorije --------------------------------------------------
function validateCategory(subjId, lessonId, key, cat, counts) {
  const at = `[${subjId}/${lessonId}/${key}]`;
  if (!CAMEL.test(key)) warn(`${at} ključ nije čisti camelCase`);
  if (typeof cat !== 'object' || cat === null) { fail(`${at} kategorija nije objekt`); return; }

  if (!isNonEmptyStr(cat.name)) fail(`${at} nedostaje/prazno "name"`);
  if (!isNonEmptyStr(cat.icon)) fail(`${at} nedostaje/prazno "icon"`);
  else if (!cat.icon.startsWith('fa-')) warn(`${at} icon "${cat.icon}" ne počinje s "fa-"`);
  if (!isNonEmptyStr(cat.color)) fail(`${at} nedostaje "color"`);
  else if (!HEX.test(cat.color)) fail(`${at} color "${cat.color}" nije #rrggbb hex`);

  const hasFc = Array.isArray(cat.flashcards) && cat.flashcards.length;
  const hasQz = Array.isArray(cat.quiz) && cat.quiz.length;
  const hasFb = Array.isArray(cat.fillBlanks) && cat.fillBlanks.length;
  const hasLn = cat.learn && typeof cat.learn === 'object';
  if (!hasFc && !hasQz && !hasFb && !hasLn) fail(`${at} kategorija nema nijedan sadržaj (flashcards/quiz/fillBlanks/learn)`);

  // Flashcards
  if (cat.flashcards !== undefined) {
    if (!Array.isArray(cat.flashcards)) fail(`${at} flashcards nije polje`);
    else cat.flashcards.forEach((f, i) => {
      const w = `${at} flashcard[${i}]`;
      if (!isNonEmptyStr(f.question)) fail(`${w} nedostaje "question"`);
      if (!isNonEmptyStr(f.answer)) fail(`${w} nedostaje "answer"`);
      if (f.explanation !== undefined && typeof f.explanation !== 'string') fail(`${w} "explanation" nije string`);
      checkKatex(w + '.question', f.question); checkKatex(w + '.answer', f.answer); checkKatex(w + '.explanation', f.explanation);
      counts.fc++;
      // Soft standard duljine (ne ruši build): kartica = kratka definicija, detalj → learn.
      if (typeof f.answer === 'string') {
        counts.ansLenSum += f.answer.length;
        addToHistogram(counts.ansHist, f.answer.length);
        if (f.answer.length > CARD_ANSWER_HARD_MAX) counts.overHard.push(`${w} answer=${f.answer.length} znak · ${f.question ? f.question.slice(0, 50) : ''}`);
        if (f.answer.length > CARD_ANSWER_SOFT_MAX) counts.longAns.push(`${w} answer=${f.answer.length} znak · ${f.question ? f.question.slice(0, 50) : ''}`);
      }
      if (typeof f.explanation === 'string' && f.explanation.length > CARD_EXPL_SOFT_MAX) counts.longExpl.push(`${w} explanation=${f.explanation.length} znak`);
    });
  }
  // Quiz
  if (cat.quiz !== undefined) {
    if (!Array.isArray(cat.quiz)) fail(`${at} quiz nije polje`);
    else cat.quiz.forEach((q, i) => {
      const w = `${at} quiz[${i}]`;
      if (!isNonEmptyStr(q.question)) fail(`${w} nedostaje "question"`);
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) fail(`${w} "options" mora imati 2–6 stavki`);
      else {
        q.options.forEach((o, j) => { if (!isNonEmptyStr(o)) fail(`${w} option[${j}] prazna`); checkKatex(`${w}.option[${j}]`, o); });
        if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length)
          fail(`${w} "correct"=${q.correct} izvan raspona 0..${q.options.length - 1}`);
      }
      checkKatex(w + '.question', q.question);
      counts.qz++;
    });
  }
  // FillBlanks
  if (cat.fillBlanks !== undefined) {
    if (!Array.isArray(cat.fillBlanks)) fail(`${at} fillBlanks nije polje`);
    else cat.fillBlanks.forEach((b, i) => {
      const w = `${at} fillBlank[${i}]`;
      if (!isNonEmptyStr(b.sentence)) fail(`${w} nedostaje "sentence"`);
      else if (!b.sentence.includes('_______')) fail(`${w} "sentence" nema prazninu (_______)`);
      if (!isNonEmptyStr(b.answer)) fail(`${w} nedostaje "answer"`);
      if (b.hint !== undefined && typeof b.hint !== 'string') fail(`${w} "hint" nije string`);
      checkKatex(w + '.sentence', b.sentence); checkKatex(w + '.answer', b.answer);
      counts.fb++;
    });
  }
  // Learn (dual-mode: v1 "content" HTML-string ILI v2 "blocks" niz)
  if (cat.learn !== undefined) {
    if (typeof cat.learn !== 'object' || cat.learn === null) fail(`${at} learn nije objekt`);
    else {
      const hasBlocks = Array.isArray(cat.learn.blocks);
      if (hasBlocks) {
        validateBlocks(`${at}.learn`, cat.learn.blocks);
      } else if (!isNonEmptyStr(cat.learn.content)) {
        fail(`${at} learn: nema ni "content" (v1) ni "blocks" (v2)`);
      }
      if (!hasBlocks && typeof cat.learn.content === 'string') checkKatex(at + '.learn.content', cat.learn.content);
      // image je opcionalan; undefined / null / '' = "nema slike" (legitimne konvencije)
      if (cat.learn.image != null && typeof cat.learn.image !== 'string') fail(`${at} learn.image nije string`);
      counts.ln++;
    }
  }
}

// --- Glavna petlja ----------------------------------------------------------------
const onlyId = process.argv[2];
const subjects = SOKRAT_CATALOG.subjects.filter((s) => !onlyId || s.id === onlyId);
if (onlyId && !subjects.length) { console.error(`Nepoznat subjectId "${onlyId}".`); process.exit(2); }

/** M5a: skupna raspodjela duljina preko svih provjerenih predmeta. */
const TOTAL = { fc: 0, hist: newHistogram(), overHard: [] };

console.log(`\nValidiram sadržaj: ${subjects.length} predmet(a)${onlyId ? ' (' + onlyId + ')' : ''}...\n`);

for (const s of subjects) {
  const scripts = (s.content && s.content.scripts) || [];
  if (!scripts.length) { console.log(`[${s.id}] nema content.scripts (coming soon) — preskačem`); continue; }
  const win = loadWindowVars(scripts);
  const counts = { fc: 0, qz: 0, fb: 0, ln: 0, ansLenSum: 0, longAns: [], longExpl: [], overHard: [], ansHist: newHistogram() };
  let cats = 0;

  for (const lesson of (s.lessons || [])) {
    const varName = SokratCatalog.resolveDataVar(s.id, lesson.id);
    if (!varName) continue; // coming soon
    const data = win[varName];
    if (!data || typeof data !== 'object') { fail(`[${s.id}/${lesson.id}] var "${varName}" nije učitan na window`); continue; }
    for (const key of Object.keys(data)) {
      validateCategory(s.id, lesson.id, key, data[key], counts);
      cats++;
    }
  }
  console.log(`[${s.id}] kategorija=${cats} · fc=${counts.fc} quiz=${counts.qz} fill=${counts.fb} learn=${counts.ln}`);

  // Soft standard duljine kartica (CONTENT_SCHEMA §Standard duljine) — sažetak po predmetu;
  // detaljan popis samo kad ciljaš JEDAN predmet (autor tada aktivno popravlja taj predmet).
  const nLong = counts.longAns.length;
  if (nLong || counts.longExpl.length) {
    const pct = counts.fc ? Math.round((nLong / counts.fc) * 100) : 0;
    const avg = counts.fc ? Math.round(counts.ansLenSum / counts.fc) : 0;
    warn(`[${s.id}] ${nLong}/${counts.fc} kartica answer > ${CARD_ANSWER_SOFT_MAX} znak (${pct}%, prosjek ${avg})`
       + (counts.longExpl.length ? ` · ${counts.longExpl.length} explanation > ${CARD_EXPL_SOFT_MAX}` : '')
       + ' — CONTENT_SCHEMA §Standard duljine');
    if (onlyId) {
      counts.longAns.slice(0, 40).forEach((m) => console.warn('        · ' + m));
      if (nLong > 40) console.warn(`        · … i još ${nLong - 40}`);
    }
  }

  // M5a: skupi za završnu raspodjelu + zapamti tko probija TVRDI strop (to su kartice koje
  // M5b mora skratiti PRIJE nego `maxLength: 500` uđe u shemu — obrnut redoslijed ruši CI).
  TOTAL.fc += counts.fc;
  counts.ansHist.forEach((n, i) => { TOTAL.hist[i] += n; });
  counts.overHard.forEach((m) => TOTAL.overHard.push(`[${s.id}] ${m}`));
}

// ===== M5a — raspodjela duljina odgovora (BROJKA, NE GATE) =====
// Postoji da se vidi TREND: sprječava li vođenje u editoru daljnji rast. Nikad ne mijenja exit —
// tvrdi gate na zatečenom katalogu srušio bi gotovo pola sadržaja (BACKLOG M5).
if (TOTAL.fc) {
  console.log('\n---------- duljina odgovora (kartice) ----------');
  const width = 34;
  TOTAL.hist.forEach((n, i) => {
    const pct = (n / TOTAL.fc) * 100;
    const bar = '█'.repeat(Math.round((pct / 100) * width));
    const flag = (BUCKETS[i] === Infinity) ? '  ⟵ preko stropa ' + CARD_ANSWER_HARD_MAX : '';
    console.log(`  ${bucketLabel(i).padStart(8)} znak  ${String(n).padStart(5)}  ${pct.toFixed(1).padStart(5)}%  ${bar}${flag}`);
  });
  console.log(`  ukupno ${TOTAL.fc} kartica · standard ≤${CARD_ANSWER_SOFT_MAX} · strop editora ${CARD_ANSWER_HARD_MAX}`);
  if (TOTAL.overHard.length) {
    console.log(`\n  ⚠ ${TOTAL.overHard.length} kartica probija TVRDI strop — M5b ih mora skratiti PRIJE`);
    console.log(`     nego \`maxLength: ${CARD_ANSWER_HARD_MAX}\` uđe u schema/subject-content.schema.json:`);
    TOTAL.overHard.slice(0, 25).forEach((m) => console.log('     · ' + m));
    if (TOTAL.overHard.length > 25) console.log(`     · … i još ${TOTAL.overHard.length - 25}`);
  }
}

console.log('\n================ REZULTAT ================');
console.log(`Greške: ${errors} · Upozorenja: ${warnings}`);
if (errors === 0) {
  console.log('✅ Sadržaj poštuje shemu (CONTENT_SCHEMA.md).');
  process.exit(0);
} else {
  console.log('❌ Sadržajne greške — popravi prije commita.');
  process.exit(1);
}
