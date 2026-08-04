// storage-check.js — sigurnosni test bucketa `node-images` (CREATE_BACKEND_SPEC §11 S1+S2, F4).
// Dokazuje kroz PRAVI HTTP Storage API da osobne slike: (a) smije uploadati OBIČAN prijavljen
// korisnik u SVOJ prefiks, (b) nisu javno čitljive, (c) ne cure između korisnika.
//
// ⚠️ SAMO STAGING. Ovo je WRITE-test (upload + delete) → gađanje produkcije je TVRDO zabranjeno
//    (CLAUDE pravilo #8: write/draft tokovi se automatiziraju vs STAGING).
//
// Ishod:
//   - curenje (javno čitanje / tuđi prefiks / anon vidi)  -> exit 1  (TVRDI gate)
//   - vlastiti upload odbijen (S1 nije riješen)           -> exit 1
//   - nema STAGING_* / TEST_ADMIN_* u .env                -> exit 0 + SKIP
//   - baza uspavana / nedostupna                          -> exit 0 + SKIP
//   - sve ispravno                                        -> exit 0 + OK
//
// Napomena o „admin" računu: NIJEDAN policy na `node-images` NE spominje `is_admin()` — jedini
// uvjet je vlasnički prefiks putanje. Zato račun kojim se prijavljujemo nema nikakvu povlasticu
// na ovom bucketu; T2/T6 to i dokazuju (odbijen je na TUĐEM prefiksu unatoč admin-ulozi).
// Policy-razina je uz to dokazana i pod ne-admin identitetom (spec §12, T1–T5 u bazi).

try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const PROD_REF = 'naxjubnedhrbhsuasayu';
const BUCKET = 'node-images';

const BASE = process.env.STAGING_SUPABASE_URL;
const ANON = process.env.STAGING_SUPABASE_ANON;
const EMAIL = process.env.STAGING_TEST_ADMIN_EMAIL || process.env.TEST_ADMIN_EMAIL;
const PASSWORD = process.env.STAGING_TEST_ADMIN_PASSWORD || process.env.TEST_ADMIN_PASSWORD;

// 1x1 PNG (najmanji valjani teret; bucket ionako propušta samo rasterske image MIME-ove).
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function http(path, opts) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(BASE + path, Object.assign({ signal: ctrl.signal }, opts));
    return res;
  } finally { clearTimeout(to); }
}

async function main() {
  if (!BASE || !ANON || !EMAIL || !PASSWORD) {
    console.log('SKIP: nema STAGING_SUPABASE_URL/ANON + TEST_ADMIN_* u .env — preskačem.');
    return 0;
  }
  if (BASE.includes(PROD_REF)) {
    console.error('ABORT: storage-check je WRITE-test i NE SMIJE gađati produkciju.');
    return 1;
  }
  console.log('Storage check protiv', BASE, `(bucket ${BUCKET})\n`);

  // ── Prijava (password grant) → JWT prijavljenog korisnika.
  let token, uid;
  try {
    const r = await http('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    if (r.status >= 500) { console.log(`SKIP: auth status ${r.status} (baza možda spava).`); return 0; }
    const b = await r.json();
    token = b && b.access_token;
    uid = b && b.user && b.user.id;
    if (!token || !uid) { console.error('FAIL: prijava nije uspjela (bez tokena).'); return 1; }
  } catch (e) {
    console.log('SKIP: auth nedostupan —', e.message); return 0;
  }

  const authHdr = { apikey: ANON, Authorization: 'Bearer ' + token };
  const FOREIGN = '00000000-0000-4000-8000-00000000dead';       // tuđi uid (ne postoji — svejedno mora pasti)
  const nodeId = 'check-' + Date.now();
  const ownPath = `${uid}/${nodeId}/probe.png`;
  const foreignPath = `${FOREIGN}/${nodeId}/probe.png`;
  let uploaded = false;

  // ── T1 · upload u VLASTITI prefiks mora PROĆI (S1: značajka radi bez admin-uloge).
  {
    const r = await http(`/storage/v1/object/${BUCKET}/${ownPath}`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'image/png', 'x-upsert': 'false' }, authHdr),
      body: PNG,
    });
    uploaded = r.status === 200;
    record('T1 upload u vlastiti prefiks prolazi', uploaded, `status ${r.status}`);
    if (!uploaded) { console.error('\nS1 NIJE riješen — prekidam.'); return 1; }
  }

  // ── T2 · upload u TUĐI prefiks mora PASTI (i to unatoč admin-ulozi računa).
  {
    const r = await http(`/storage/v1/object/${BUCKET}/${foreignPath}`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'image/png', 'x-upsert': 'false' }, authHdr),
      body: PNG,
    });
    record('T2 upload u tuđi prefiks odbijen', r.status !== 200, `status ${r.status}`);
  }

  // ── T3 · JAVNI URL NE SMIJE raditi (S2: bucket je privatan).
  {
    const r = await http(`/storage/v1/object/public/${BUCKET}/${ownPath}`, { method: 'GET' });
    record('T3 javni URL ne radi (bucket privatan)', r.status !== 200, `status ${r.status}`);
  }

  // ── T4 · ANONIMNI dohvat objekta mora biti odbijen.
  {
    const r = await http(`/storage/v1/object/${BUCKET}/${ownPath}`, {
      method: 'GET', headers: { apikey: ANON },
    });
    record('T4 anon dohvat odbijen', r.status !== 200, `status ${r.status}`);
  }

  // ── T5 · ANON ne smije IZLISTATI bucket (nema SELECT policyja za anon).
  {
    const r = await http(`/storage/v1/object/list/${BUCKET}`, {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: '', limit: 100 }),
    });
    let n = null;
    try { const b = await r.json(); n = Array.isArray(b) ? b.length : null; } catch (_) { /* nije JSON */ }
    const ok = r.status !== 200 || n === 0;
    record('T5 anon ne može izlistati bucket', ok, `status ${r.status}${n === null ? '' : `, ${n} stavki`}`);
  }

  // ── T6 · potpisivanje TUĐE putanje mora PASTI (potpis prolazi kroz SELECT policy).
  {
    const r = await http(`/storage/v1/object/sign/${BUCKET}/${foreignPath}`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHdr),
      body: JSON.stringify({ expiresIn: 60 }),
    });
    record('T6 potpisivanje tuđe putanje odbijeno', r.status !== 200, `status ${r.status}`);
  }

  // ── T7 · potpisivanje VLASTITE putanje radi, i potpisani URL stvarno vraća sliku.
  {
    const r = await http(`/storage/v1/object/sign/${BUCKET}/${ownPath}`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHdr),
      body: JSON.stringify({ expiresIn: 60 }),
    });
    let signed = null;
    try { const b = await r.json(); signed = b && b.signedURL; } catch (_) { /* ignore */ }
    if (r.status !== 200 || !signed) {
      record('T7 potpisani URL vlastite slike radi', false, `sign status ${r.status}`);
    } else {
      const g = await http('/storage/v1' + signed, { method: 'GET' });
      const buf = g.status === 200 ? Buffer.from(await g.arrayBuffer()) : null;
      const same = !!buf && buf.equals(PNG);
      record('T7 potpisani URL vlastite slike radi', g.status === 200 && same,
        `GET ${g.status}${buf ? `, ${buf.length} B, bajtovi ${same ? 'isti' : 'RAZLIČITI'}` : ''}`);
    }
  }

  // ── Počisti (isti put kojim klijent briše: DELETE s user-JWT-om).
  if (uploaded) {
    const r = await http(`/storage/v1/object/${BUCKET}/${ownPath}`, { method: 'DELETE', headers: authHdr });
    record('Čišćenje: vlastiti objekt obrisan', r.status === 200, `status ${r.status}`);
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} prošlo`);
  if (failed.length) {
    console.error('CURENJE / NEISPRAVNOST:\n  - ' + failed.map((f) => f.name).join('\n  - '));
    return 1;
  }
  console.log('OK — osobne slike su privatne i vlastiti upload radi bez admin-uloge.');
  return 0;
}

main()
  .then((code) => { setTimeout(() => process.exit(code), 250); })
  .catch((e) => { console.error('Neočekivana greška:', e && e.message); setTimeout(() => process.exit(1), 250); });
