// compute-stats.js — izračunaj stvaran ukupan broj pitanja iz sadržaja (FOUNDATION_PLAN F1, brick 1C.4).
// Generira data/landing-stats.js (window.SOKRAT_STATS) → landing hero broj prati katalog umjesto hardkodiranog "400+".
//
// Pokreni: `npm run stats` (ili node scripts/compute-stats.js). Regeneriraj nakon izmjene sadržaja predmeta.
// Broji flashcards + quiz + fillBlanks. Po predmetu uzima FINAL lekciju (= Object.assign M1+M2+examPractice → bez
// dvostrukog brojanja); ako predmet nema 'final', zbraja sve lekcije. Samo PRIMARY (EN) program — prijevodi se ne broje.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PRIMARY_PROGRAM = 'hospitality-management';
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

// Učitaj data-skripte kroz vm s window shimom (isti obrazac kao validate-content.js).
function loadWindowVars(scripts) {
  const sandbox = { window: {}, console, Math, Object, Array, JSON, String, Number, Boolean, Date };
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const rel of scripts) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { console.error('  ! nema datoteke:', rel); continue; }
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: rel });
  }
  return sandbox.window;
}

// Prebroji flashcards + quiz + fillBlanks u jednom data-objektu (mapa kategorija).
function countData(data) {
  let n = 0;
  if (!data || typeof data !== 'object') return 0;
  for (const cat of Object.values(data)) {
    if (!cat || typeof cat !== 'object') continue;
    if (Array.isArray(cat.flashcards)) n += cat.flashcards.length;
    if (Array.isArray(cat.quiz)) n += cat.quiz.length;
    if (Array.isArray(cat.fillBlanks)) n += cat.fillBlanks.length;
  }
  return n;
}

let total = 0;
let subjectsCounted = 0;
const primary = (SOKRAT_CATALOG.subjects || []).filter((s) => SokratCatalog.isInProgram(s, PRIMARY_PROGRAM));

for (const s of primary) {
  const content = s.content || {};
  const resolve = content.resolve || {};
  const win = loadWindowVars(content.scripts || []);
  let subjTotal = 0;
  if (resolve['final'] && win[resolve['final']]) {
    subjTotal = countData(win[resolve['final']]);             // final = sve, bez dvostrukog brojanja
  } else {
    for (const varName of Object.values(resolve)) {           // bez final → zbroji sve lekcije
      if (win[varName]) subjTotal += countData(win[varName]);
    }
  }
  total += subjTotal;
  subjectsCounted++;
  console.log(`  ${s.id}: ${subjTotal}`);
}

// Konzervativan „floor" na okruglu stotinu (marketing „X+"): nikad ne precijeni stvaran broj.
const floored = Math.floor(total / 100) * 100;

const out =
`// AUTOGENERIRANO (scripts/compute-stats.js) — NE uređuj ručno. Regeneriraj: npm run stats.
// Ukupan broj pitanja (flashcards+quiz+fillBlanks) kroz PRIMARY program; landing hero ga čita preko renderLandingMeta().
window.SOKRAT_STATS = { questionCount: ${floored}, questionCountExact: ${total}, subjectsCounted: ${subjectsCounted} };
`;
fs.writeFileSync(path.join(ROOT, 'data', 'landing-stats.js'), out, 'utf8');
console.log(`\n  UKUPNO: ${total} (floored ${floored}) kroz ${subjectsCounted} predmeta → data/landing-stats.js`);
