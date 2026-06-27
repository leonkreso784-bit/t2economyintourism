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

// (Stara A2 regresijska usporedba uklonjena — ovo je sad opći validator catalog-a.)

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
    if (got) {
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

  // 6) BUG-012 čuvar: predmet s interaktivnim vježbama MORA imati content.codeScripts koji
  //    pokriva exercises (i lib). Vježbe su KOD (generate() funkcije) → uvijek se učitaju iz
  //    DATOTEKE, nikad iz baze (JSON briše funkcije). Bez codeScripts vježbe pucaju u DB-modu.
  const hasExercises = !!(s.content && s.content.exercises) || !!(s.features && s.features.exercises);
  const codeScripts = (s.content && s.content.codeScripts) || [];
  if (hasExercises) {
    if (!codeScripts.length) {
      fail('ima vježbe ali nema content.codeScripts → vježbe bi pukle iz baze (BUG-012)');
    } else {
      for (const rel of codeScripts) {
        if (readFile(rel) === null) fail(`codeScripts datoteka ne postoji: ${rel}`);
        if (!scripts.includes(rel)) warn(`codeScripts "${rel}" nije u content.scripts → offline/fallback put ga neće učitati`);
      }
      const exVar = s.content && s.content.exercises;
      if (exVar) {
        const inCode = codeScripts.some((rel) => {
          const src = readFile(rel) || '';
          return new RegExp(`\\b(const|let|var)\\s+${exVar}\\b`).test(src) || src.includes(`window.${exVar}`);
        });
        if (!inCode) fail(`exercises var "${exVar}" nije definiran ni u jednoj codeScripts datoteci`);
        else ok(`vježbe: codeScripts pokriva "${exVar}" → učita se iz datoteke (ne iz baze)`);
      } else {
        ok('vježbe (features.exercises): codeScripts prisutan');
      }
    }
  } else if (codeScripts.length) {
    warn('nema vježbe ali ima codeScripts — neočekivano (provjeri)');
  }
  console.log('');
}

console.log('================ REZULTAT ================');
console.log(`Greške: ${errors} · Upozorenja: ${warnings}`);
if (errors === 0) {
  console.log('✅ Catalog je konzistentan (struktura, datoteke, varijable + window).');
  process.exit(0);
} else {
  console.log('❌ Ima grešaka — popravi prije nastavka.');
  process.exit(1);
}
