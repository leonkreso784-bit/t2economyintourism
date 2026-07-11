/* eslint-disable no-console */
// ===== Catalog integrity checker =====
// Pokreni: `node scripts/verify-catalog.js`
// Provjerava da je data/catalog.js konzistentan i ispravno povezan s data-*.js.
// Korisno nakon SVAKOG dodavanja/izmjene predmeta (vidi docs/TESTING.md).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// CATALOG_PATH (env) = alternativni catalog za fixture-testove gate-a (default: pravi catalog).
const CATALOG_PATH = process.env.CATALOG_PATH
  ? path.resolve(ROOT, process.env.CATALOG_PATH)
  : path.join(ROOT, 'data', 'catalog.js');
const { SOKRAT_CATALOG } = require(CATALOG_PATH);

// Lokalni helperi (ne ovise o exportanom SokratCatalog → gate radi i nad fixture-katalozima).
const getProgram = (id) => {
  for (const f of (SOKRAT_CATALOG.faculties || [])) {
    const p = (f.programs || []).find((p) => p.id === id);
    if (p) return { ...p, facultyId: f.id };
  }
  return null;
};
const resolveDataVar = (s, lessonId) => {
  const r = (s.content && s.content.resolve) || {};
  return r[lessonId] || r['*'] || null;
};

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

  // 3) Smještaj u hijerarhiju — dual-mode (U2.5, ADR-022 / docs/CATALOG_ARCHITECTURE.md §6):
  //    legacy (programId+year+semester) XOR placement[] — nikad oboje, nikad nijedno.
  const hasLegacy = s.programId != null || s.year != null || s.semester != null;
  const hasPlacement = Array.isArray(s.placement);
  if (hasLegacy && hasPlacement) {
    fail('ima I legacy smještaj (programId/year/semester) I placement[] — dozvoljen je točno jedan način (ADR-022)');
  } else if (!hasLegacy && !hasPlacement) {
    fail('nema ni programId/year/semester ni placement[] — predmet nije smješten u hijerarhiju');
  } else if (hasLegacy) {
    if (!getProgram(s.programId)) fail(`programId "${s.programId}" ne postoji u faculties`);
    if (!Number.isFinite(s.year) || !Number.isFinite(s.semester)) fail('legacy smještaj traži numerički year i semester');
  } else {
    if (!s.placement.length) fail('placement[] je prazan');
    const seenCoords = new Set();
    const facultySet = new Set();
    for (const pl of s.placement) {
      const f = (SOKRAT_CATALOG.faculties || []).find((x) => x.id === pl.faculty);
      if (!f) { fail(`placement faculty "${pl.faculty}" ne postoji`); continue; }
      facultySet.add(pl.faculty);
      if (!(f.programs || []).some((p) => p.id === pl.program)) {
        fail(`placement program "${pl.program}" ne postoji u fakultetu "${pl.faculty}"`);
      }
      if (!Number.isFinite(pl.year) || !Number.isFinite(pl.semester)) {
        fail(`placement (${pl.program}) traži numerički year i semester`);
      }
      const key = `${pl.program}|${pl.year}|${pl.semester}`;
      if (seenCoords.has(key)) fail(`duplicirana placement koordinata: ${key}`); else seenCoords.add(key);
    }
    if (facultySet.size > 1) {
      fail('placement preko VIŠE fakulteta — preko fakulteta se UVIJEK duplicira, ne dijeli (ADR-022 §3)');
    }
    for (const fid of facultySet) {
      if (!s.id.startsWith(fid + '-')) {
        fail(`placement-predmet mora nositi prefiks fakulteta u id-u: očekivano "${fid}-…", a id je "${s.id}" (ADR-022 §2)`);
      }
    }
    if (!/-(hr|en)$/.test(s.id)) {
      warn(`kanonski id je <fakultet>-<predmet>-<jezik> — "${s.id}" nema -hr/-en sufiks (ADR-022 §2)`);
    }
    if (seenCoords.size) ok(`placement: ${seenCoords.size} koordinata (dijeljeni sadržaj, jedan storageKey)`);
  }

  // 4) Datoteke iz content.scripts postoje
  const scripts = (s.content && s.content.scripts) || [];
  for (const rel of scripts) {
    if (readFile(rel) === null) fail(`datoteka ne postoji: ${rel}`);
  }

  // 5) resolveDataVar == staro ponašanje + var postoji i izvozi se na window
  for (const lesson of (s.lessons || [])) {
    const got = resolveDataVar(s, lesson.id);
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

  // 7) F2 2A.3 čuvar (dual-read): predmet s content.dataFormat === 'json' MORA imati generirane
  //    JSON datoteke za SVAKI razriješeni lekcijski var (data/json/<id>/<var>.json). Bez njih bi
  //    loader pao na .js fallback (radi), ali flag bez datoteka = greška u namjeri → hard-fail.
  if (s.content && s.content.dataFormat === 'json') {
    const jsonVars = new Set();
    for (const lesson of (s.lessons || [])) {
      const v = resolveDataVar(s, lesson.id);
      if (v) jsonVars.add(v);
    }
    for (const v of jsonVars) {
      const rel = `data/json/${s.id}/${v}.json`;
      if (readFile(rel) === null) fail(`dataFormat 'json' ali nedostaje ${rel} (pokreni: npm run export:json ${s.id})`);
      else ok(`JSON dual-read: ${rel} prisutan`);
    }
  }
  console.log('');
}

// 8) Globalno: duplikat storageKey preko RAZLIČITIH predmeta = fail (ADR-022 §4/§6-2).
//    "Lažno dijeljenje" kroz dva unosa s istim ključem miješa napredak dvaju sadržaja;
//    pravo dijeljenje = JEDAN unos s placement[] (jedan storageKey po konstrukciji).
{
  const byKey = new Map();
  for (const s of SOKRAT_CATALOG.subjects) {
    if (!s.storageKey) continue;
    if (!byKey.has(s.storageKey)) byKey.set(s.storageKey, []);
    byKey.get(s.storageKey).push(s.id);
  }
  for (const [key, ids] of byKey) {
    if (ids.length > 1) fail(`storageKey "${key}" dijele predmeti [${ids.join(', ')}] — dijeljenje ide kroz placement[], ne kroz dva unosa`);
  }
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
