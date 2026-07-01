/* eslint-disable no-console */
// ===== JSON Schema validator za sadrzaj (Faza 2, cigla 2A.1) =====
// Pokreni:  node scripts/validate-json-schema.js [subjectId]
//   - bez argumenta: validira SVE predmete (payload svake razrijesene lekcije)
//   - sa subjectId:  samo taj predmet
//
// Provjerava da svaki payload sadrzaja (window-var razrijesen iz content.resolve) postuje
// schema/subject-content.schema.json (STRUKTURNI ugovor: oblik + tipovi + nepoznata polja).
// Nadopunjuje validate-content.js (koji radi SEMANTICKE provjere: correct-u-rasponu, KaTeX,
// _______). Ovaj gate ce se u 2A.2 koristiti i nad GENERIRANIM .json datotekama.
//
// Izvor payloada = vm window-shim (kao migrate-content.js / validate-content.js) → radi
// neovisno o tome cita li app iz datoteke ili baze. 0 troska, hard-fail na greskama.

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Ajv = require('ajv');

const ROOT = path.join(__dirname, '..');
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));
const schema = require(path.join(ROOT, 'schema', 'subject-content.schema.json'));

// ajv draft-07 (default meta-schema u ajv v8). allErrors = prijavi sve, ne stani na prvoj.
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

// --- vm window-shim (isti obrazac kao ostali skripti) -----------------------------
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

const onlyId = process.argv[2];
const subjects = SOKRAT_CATALOG.subjects.filter((s) => (!onlyId || s.id === onlyId) && s.content && s.content.scripts);
if (onlyId && !subjects.length) { console.error('Nepoznat ili coming-soon subjectId "' + onlyId + '".'); process.exit(2); }

console.log(`\nJSON Schema validacija: ${subjects.length} predmet(a)${onlyId ? ' (' + onlyId + ')' : ''}...\n`);

let errors = 0;
let docs = 0;

for (const s of subjects) {
  const win = loadWindowVars(s.content.scripts);
  for (const lesson of (s.lessons || [])) {
    const varName = SokratCatalog.resolveDataVar(s.id, lesson.id);
    if (!varName) continue; // coming soon
    const payload = win[varName];
    docs++;
    const ok = validate(payload);
    if (!ok) {
      errors++;
      console.error(`  ✗ [${s.id}/${lesson.id}] var "${varName}" NE postuje schemu:`);
      for (const e of (validate.errors || []).slice(0, 12)) {
        console.error(`      ${e.instancePath || '(root)'} ${e.message}${e.params && e.params.additionalProperty ? ' → "' + e.params.additionalProperty + '"' : ''}`);
      }
      if ((validate.errors || []).length > 12) console.error(`      … +${validate.errors.length - 12} vise`);
    } else {
      console.log(`  ✓ [${s.id}/${lesson.id}] ${varName} (${Object.keys(payload).length} kat.)`);
    }
  }
}

console.log('\n================ REZULTAT ================');
console.log(`Dokumenata: ${docs} · Neispravnih: ${errors}`);
if (errors === 0) {
  console.log('✅ Svi payloadi postuju subject-content.schema.json.');
  process.exit(0);
} else {
  console.log('❌ Strukturne greske — payload ne odgovara schemi.');
  process.exit(1);
}
