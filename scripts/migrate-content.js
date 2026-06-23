/* eslint-disable no-console */
// ===== Migrate content → Supabase (Blok B, read-path) =====
// Usage:
//   node scripts/migrate-content.js [subjectId] [--dry]
//     (bez subjectId = svi predmeti; --dry = ispiši što bi se uploadalo, BEZ mreže)
//
// Čita data/catalog.js + data/<subject>/*.js (vm window-shim) i za svaki predmet
// skuplja RAZRIJEŠENE content-objekte (window varijable iz content.resolve + content.exercises;
// final.js je već Object.assign-an u istom sandboxu). Upsert u public.subject_content
// (1 red = 1 window var) preko Supabase REST API-ja sa SERVICE keyem.
//
// Datoteke ostaju IZVOR ISTINE — ovo je zrcalo. Pokreni nakon dodavanja/izmjene predmeta.
// .env: SUPABASE_URL + SUPABASE_SERVICE_KEY (service_role; gitignored, NIKAD u frontend/commit).

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

// --- vm window-shim (isti obrazac kao validate-content.js) -----------------------
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

// --- skupi {var_name → payload} za jedan predmet ---------------------------------
function rowsForSubject(s) {
  const scripts = (s.content && s.content.scripts) || [];
  if (!scripts.length) return [];
  const win = loadWindowVars(scripts);
  const varNames = new Set();
  for (const lesson of (s.lessons || [])) {
    const v = SokratCatalog.resolveDataVar(s.id, lesson.id);
    if (v) varNames.add(v);
  }
  if (s.content && s.content.exercises) varNames.add(s.content.exercises);

  const rows = [];
  for (const varName of varNames) {
    const payload = win[varName];
    if (!payload || typeof payload !== 'object') { throw new Error(`[${s.id}] var "${varName}" nije na window`); }
    rows.push({ subject_id: s.id, var_name: varName, payload: payload });
  }
  return rows;
}

// --- Supabase REST upsert --------------------------------------------------------
async function upsert(rows, url, key) {
  const res = await fetch(url.replace(/\/$/, '') + '/rest/v1/subject_content?on_conflict=subject_id,var_name', {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 400));
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const onlyId = args.find((a) => !a.startsWith('--'));

  const subjects = SOKRAT_CATALOG.subjects.filter((s) => (!onlyId || s.id === onlyId) && s.content && s.content.scripts);
  if (onlyId && !subjects.length) { console.error('Nepoznat ili coming-soon subjectId "' + onlyId + '".'); process.exit(2); }

  let allRows = [];
  for (const s of subjects) {
    const rows = rowsForSubject(s);
    rows.forEach((r) => console.log(`  [${r.subject_id}] ${r.var_name} — ${JSON.stringify(r.payload).length} B`));
    allRows = allRows.concat(rows);
  }
  console.log(`\n${subjects.length} predmet(a) → ${allRows.length} redova.`);

  if (dry) { console.log('DRY — ništa nije uploadano.'); return; }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) { console.error('Nedostaje SUPABASE_URL ili SUPABASE_SERVICE_KEY u .env'); process.exit(1); }

  // Upload u serijama (PostgREST voli manje pakete od više MB)
  const BATCH = 20;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const chunk = allRows.slice(i, i + BATCH);
    await upsert(chunk, url, key);
    console.log(`  ✓ uploadano ${Math.min(i + BATCH, allRows.length)}/${allRows.length}`);
  }
  console.log('✅ Migracija sadržaja gotova.');
  process.exit(0);
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
