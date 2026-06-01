/* eslint-disable no-console */
// ===== Catalog integrity checker =====
// Pokreni: `node scripts/verify-catalog.js`
// Provjerava da je data/catalog.js konzistentan i ispravno povezan s data-*.js.
// Korisno nakon SVAKOG dodavanja/izmjene predmeta (vidi docs/TESTING.md).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

let errors = 0;
let warnings = 0;
const fail = (m) => { console.error('  ✗ ' + m); errors++; };
const warn = (m) => { console.warn('  ! ' + m); warnings++; };
const ok = (m) => console.log('  ✓ ' + m);

// Referentno ponašanje STAROG getSubjectData() — služi za usporedbu.
function oldResolve(subjectId, lessonId) {
  switch (subjectId) {
    case 'te2': return lessonId === 'final-test-prep' ? 'te2FinalData' : 'studyData';
    case 'entrepreneurship': return 'entrepreneurshipData';
    case 'accounting': return 'accountingData';
    case 'ebusiness': return 'ebusinessData';
    case 'econ-hospitality': return lessonId === 'first-midterm' ? 'economicsHospitalityData' : null;
    case 'marketing': return lessonId === 'first-midterm' ? 'marketingData' : null;
    case 'geography': return lessonId === 'first-midterm' ? 'geographyData' : null;
    case 'food-nutrition': return lessonId === 'first-midterm' ? 'foodNutritionData' : null;
    default: return null;
  }
}

const REQUIRED_FIELDS = ['name', 'shortName', 'icon', 'color', 'description', 'storageKey', 'lessons'];

console.log(`\nProvjeravam ${SOKRAT_CATALOG.subjects.length} predmeta...\n`);

const seenIds = new Set();
const fileCache = {};
const readFile = (rel) => {
  if (!(rel in fileCache)) {
    const p = path.join(ROOT, rel);
    fileCache[rel] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  }
  return fileCache[rel];
};

for (const s of SOKRAT_CATALOG.subjects) {
  console.log(`[${s.id}] ${s.name}`);

  // 1) Jedinstven id
  if (seenIds.has(s.id)) fail(`duplikat id "${s.id}"`); else seenIds.add(s.id);

  // 2) Obavezna polja
  const missing = REQUIRED_FIELDS.filter((f) => s[f] === undefined || s[f] === null);
  if (missing.length) fail(`nedostaju polja: ${missing.join(', ')}`); else ok('sva obavezna polja prisutna');

  // 3) Program postoji
  if (!SokratCatalog.getProgram(s.programId)) fail(`programId "${s.programId}" ne postoji u faculties`);

  // 4) Datoteke iz content.scripts postoje
  const scripts = (s.content && s.content.scripts) || [];
  for (const rel of scripts) {
    if (readFile(rel) === null) fail(`datoteka ne postoji: ${rel}`);
  }

  // 5) resolveDataVar == staro ponašanje + var postoji i izvozi se na window
  for (const lesson of (s.lessons || [])) {
    const got = SokratCatalog.resolveDataVar(s.id, lesson.id);
    const expected = oldResolve(s.id, lesson.id);
    if (got !== expected) {
      fail(`lekcija "${lesson.id}": resolveDataVar="${got}" ali staro očekuje "${expected}"`);
    } else if (got) {
      // varijabla mora biti deklarirana i izložena na window u nekoj od skripti
      const declared = scripts.some((rel) => {
        const src = readFile(rel) || '';
        return new RegExp(`\\b(const|let|var)\\s+${got}\\b`).test(src) || src.includes(`window.${got}`);
      });
      const exposed = scripts.some((rel) => (readFile(rel) || '').includes(`window.${got}`));
      if (!declared) fail(`var "${got}" (lekcija ${lesson.id}) nije deklariran ni u jednoj content.scripts datoteci`);
      else if (!exposed) warn(`var "${got}" nije izložen na window — radit će u browseru tek ako je globalni const u istom scopeu`);
      else ok(`lekcija "${lesson.id}" → ${got} (deklariran + na window)`);
    } else {
      ok(`lekcija "${lesson.id}" → prazno (coming soon), kako se očekuje`);
    }
  }
  console.log('');
}

console.log('================ REZULTAT ================');
console.log(`Greške: ${errors} · Upozorenja: ${warnings}`);
if (errors === 0) {
  console.log('✅ Catalog je konzistentan — A2 mapiranje identično starom getSubjectData.');
  process.exit(0);
} else {
  console.log('❌ Ima grešaka — popravi prije nastavka.');
  process.exit(1);
}
