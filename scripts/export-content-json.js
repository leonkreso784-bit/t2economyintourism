/* eslint-disable no-console */
// ===== Export study content: data/*.js → data/json/<id>/<var>.json (Faza 2, cigla 2A.2) =====
// Pokreni:
//   node scripts/export-content-json.js [subjectId] [--check]
//     (bez subjectId = svi predmeti; --check = NE piše, samo provjeri round-trip + sinkron s diskom)
//
// Cilj (S2 / ADR-013): study sadržaj postaje portabilan JSON; .js datoteke → generirani export.
// Za svaki predmet učita content.scripts (vm window-shim, isti obrazac kao migrate-content.js),
// razriješi lekcijske window-varove (content.resolve) i zapiše svaki kao ČIST JSON.
//
// ⚠ VJEŽBE se NE exportaju — nisu razriješene lekcijske varijable (content.exercises je zaseban,
//   sadrži generate() funkcije koje JSON briše, BUG-012). One ostaju JS moduli (content.codeScripts).
// ⚠ Ovo SAMO generira/provjerava datoteke — NIŠTA u aplikaciji ih još ne čita (to je cigla 2A.3
//   dual-read). Zato je 0 runtime rizika i nije potreban cache-bump.
//
// Izlazni put je UNIFORMAN (data/json/<subjectId>/<varName>.json) namjerno — odvaja format od
// zbrkanog legacy layouta (root data-*.js vs data/<subj>/*.js) i zrcali DB model (1 red = 1 var).

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'json');
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

// --- vm window-shim (identičan migrate-content.js / validate-content.js) ------------
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

// Deterministički JSON (2 razmaka, redoslijed ključeva = insertion order iz izvora → bajt-stabilno).
function toJson(obj) { return JSON.stringify(obj, null, 2) + '\n'; }

// Strukturna jednakost (za round-trip i sinkron-s-diskom provjeru).
function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// Skupi {varName → payload} za jedan predmet (samo razriješene lekcijske varijable).
function payloadsForSubject(s) {
  const win = loadWindowVars(s.content.scripts);
  const out = [];
  const seen = new Set();
  for (const lesson of (s.lessons || [])) {
    const varName = SokratCatalog.resolveDataVar(s.id, lesson.id);
    if (!varName || seen.has(varName)) continue;
    seen.add(varName);
    const payload = win[varName];
    if (!payload || typeof payload !== 'object') throw new Error(`[${s.id}] var "${varName}" nije objekt na window`);
    out.push({ varName: varName, payload: payload });
  }
  return out;
}

const args = process.argv.slice(2);
const check = args.includes('--check');
const onlyId = args.find((a) => !a.startsWith('--'));

const subjects = SOKRAT_CATALOG.subjects.filter((s) => (!onlyId || s.id === onlyId) && s.content && s.content.scripts);
if (onlyId && !subjects.length) { console.error('Nepoznat ili coming-soon subjectId "' + onlyId + '".'); process.exit(2); }

console.log(`\n${check ? 'PROVJERA' : 'EXPORT'} JSON sadržaja: ${subjects.length} predmet(a)${onlyId ? ' (' + onlyId + ')' : ''}...\n`);

let written = 0;
let problems = 0;
let checked = 0;

for (const s of subjects) {
  const payloads = payloadsForSubject(s);
  const dir = path.join(OUT_DIR, s.id);
  for (const { varName, payload } of payloads) {
    checked++;
    // 1) Round-trip sigurnost: payload MORA biti bez gubitka kroz JSON (nema funkcija/undefined).
    const roundtrip = JSON.parse(JSON.stringify(payload));
    if (!deepEqual(payload, roundtrip)) {
      problems++;
      console.error(`  ✗ [${s.id}] ${varName} — GUBITAK kroz JSON (funkcija/undefined u payloadu!)`);
      continue;
    }
    const outPath = path.join(dir, varName + '.json');
    const rel = path.relative(ROOT, outPath).replace(/\\/g, '/');
    const json = toJson(payload);

    if (check) {
      // 2) Sinkron s diskom: ako .json postoji, mora se poklapati s trenutnim izvorom.
      if (!fs.existsSync(outPath)) { console.log(`  · [${s.id}] ${varName} — nema još ${rel} (očekivano dok 2A.4 ne migrira)`); continue; }
      // EOL-neutralna usporedba (autocrlf može radnu kopiju pretvoriti u CRLF; export je uvijek LF).
      const onDisk = fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n');
      if (onDisk !== json) { problems++; console.error(`  ✗ ${rel} — NIJE u sinku s izvorom (.js promijenjen, re-exportaj)`); }
      else console.log(`  ✓ ${rel} — u sinku (${Object.keys(payload).length} kat.)`);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(outPath, json, 'utf8');
      written++;
      console.log(`  ✓ ${rel} (${Object.keys(payload).length} kat., ${json.length} B)`);
    }
  }
}

console.log('\n================ REZULTAT ================');
console.log(`Provjereno varijabli: ${checked} · ${check ? 'Nesklada' : 'Zapisano'}: ${check ? problems : written} · Problema: ${problems}`);
if (problems === 0) {
  console.log(check ? '✅ Round-trip čist; postojeći JSON u sinku.' : '✅ Export gotov (round-trip bez gubitka).');
  process.exit(0);
} else {
  console.log('❌ Problemi — vidi gore.');
  process.exit(1);
}
