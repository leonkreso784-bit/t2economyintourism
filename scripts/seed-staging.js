/* eslint-disable no-console */
// ===== Seed STAGING Supabase sadržajem (U3 — podloga za authed/draft testove) =====
// Pokreni: `node scripts/seed-staging.js [subjectId]`   (default: te2)
//
// Upserta redove `subject_content` (1 red = 1 window-var) iz `data/json/<id>/*.json`
// u STAGING projekt — pod test-adminovim JWT-om (RLS is_admin() = isti put kao app).
// SIGURNOSNI GATE: koristi ISKLJUČIVO STAGING_* varijable iz .env (nikad prod!) i
// odbija URL koji nije staging ref (czljmvigkgiajzjxtndq).
//
// Čisti fetch (bez ovisnosti): GoTrue password-grant → PostgREST upsert.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// .env bez dotenv-a (isti mini-parser pristup kao drugdje; vrijednosti bez navodnika)
function readEnv() {
  const envPath = path.join(ROOT, '.env');
  const out = {};
  if (!fs.existsSync(envPath)) return out;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const STAGING_REF = 'czljmvigkgiajzjxtndq';

async function main() {
  const env = Object.assign(readEnv(), process.env);
  const url = env.STAGING_SUPABASE_URL;
  const anon = env.STAGING_SUPABASE_ANON;
  const email = env.STAGING_TEST_ADMIN_EMAIL || env.TEST_ADMIN_EMAIL;
  const password = env.STAGING_TEST_ADMIN_PASSWORD || env.TEST_ADMIN_PASSWORD;
  if (!url || !anon || !email || !password) {
    console.error('✗ Trebaju STAGING_SUPABASE_URL/ANON + STAGING_TEST_ADMIN_EMAIL/PASSWORD u .env');
    process.exit(1);
  }
  if (!url.includes(STAGING_REF)) {
    console.error('✗ ODBIJENO: URL nije staging (' + STAGING_REF + ') — ova skripta NIKAD ne smije gađati prod.');
    process.exit(1);
  }

  const subjectId = process.argv[2] || 'te2';
  const dir = path.join(ROOT, 'data', 'json', subjectId);
  if (!fs.existsSync(dir)) {
    console.error('✗ Nema ' + dir + ' (pokreni: npm run export:json ' + subjectId + ')');
    process.exit(1);
  }

  // 1) Test-admin JWT (password grant)
  const tok = await fetch(url + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: anon, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
  const tokJson = await tok.json();
  if (!tok.ok || !tokJson.access_token) {
    console.error('✗ Login test-admina nije uspio:', tokJson.error_description || tok.status);
    process.exit(1);
  }
  console.log('✓ Prijavljen test-admin na staging');

  // 2) Upsert po datoteci (1 datoteka = 1 window-var = 1 red)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  let okCount = 0;
  for (const f of files) {
    const varName = path.basename(f, '.json');
    const payload = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const res = await fetch(url + '/rest/v1/subject_content?on_conflict=subject_id,var_name', {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: 'Bearer ' + tokJson.access_token,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ subject_id: subjectId, var_name: varName, payload: payload })
    });
    if (res.ok || res.status === 201) { okCount++; console.log('  ✓ ' + subjectId + '/' + varName); }
    else console.error('  ✗ ' + varName + ' → HTTP ' + res.status + ': ' + (await res.text()).slice(0, 200));
  }
  console.log(okCount === files.length
    ? '✅ Staging seedan: ' + okCount + '/' + files.length + ' redova (' + subjectId + ')'
    : '❌ Djelomično: ' + okCount + '/' + files.length);
  process.exit(okCount === files.length ? 0 : 1);
}

main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
