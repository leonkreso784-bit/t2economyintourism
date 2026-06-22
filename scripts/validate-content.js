/* eslint-disable no-console */
// ===== Content schema validator =====
// Pokreni:  node scripts/validate-content.js [subjectId]
//   - bez argumenta: validira SVE predmete iz catalog-a
//   - sa subjectId:  validira samo taj predmet (npr. `node scripts/validate-content.js statistics`)
//
// Deterministička provjera SADRŽAJA (ne katalog-strukture — to radi verify-catalog.js):
// svaka kategorija mora poštovati docs/CONTENT_SCHEMA.md (name/icon/color + valjani
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
  // Learn
  if (cat.learn !== undefined) {
    if (typeof cat.learn !== 'object' || cat.learn === null) fail(`${at} learn nije objekt`);
    else {
      if (!isNonEmptyStr(cat.learn.content)) fail(`${at} learn.content nedostaje/prazno`);
      // image je opcionalan; undefined / null / '' = "nema slike" (legitimne konvencije)
      if (cat.learn.image != null && typeof cat.learn.image !== 'string') fail(`${at} learn.image nije string`);
      checkKatex(at + '.learn.content', cat.learn.content);
      counts.ln++;
    }
  }
}

// --- Glavna petlja ----------------------------------------------------------------
const onlyId = process.argv[2];
const subjects = SOKRAT_CATALOG.subjects.filter((s) => !onlyId || s.id === onlyId);
if (onlyId && !subjects.length) { console.error(`Nepoznat subjectId "${onlyId}".`); process.exit(2); }

console.log(`\nValidiram sadržaj: ${subjects.length} predmet(a)${onlyId ? ' (' + onlyId + ')' : ''}...\n`);

for (const s of subjects) {
  const scripts = (s.content && s.content.scripts) || [];
  if (!scripts.length) { console.log(`[${s.id}] nema content.scripts (coming soon) — preskačem`); continue; }
  const win = loadWindowVars(scripts);
  const counts = { fc: 0, qz: 0, fb: 0, ln: 0 };
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
