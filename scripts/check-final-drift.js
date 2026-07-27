// check-final-drift.js — provjerava da materijalizirani `final` red u BAZI == M1 + M2 (+ examPractice).
//
// U DATOTEKAMA je final = Object.assign({}, M1, M2, { examPractice }) izračunat u run-timeu →
// NE MOŽE driftati (uvijek je M1+M2+examPractice po konstrukciji). ALI u bazi je `final` ZASEBAN
// materijaliziran red (snapshot) → svako uređivanje M1/M2 (draft→objavi) MORA propagirati na final
// (publish-RPC to radi). Ova provjera hvata ako propagacija ikad zakaže — inače studenti dobiju
// STARI/nekonzistentan završni ispit dok su kolokviji ažurni.
//
// READ-ONLY, anon (publishable) ključ = javan po dizajnu (isti kao js/auth.js; RLS štiti podatke).
// Graceful skip na uspavanu/nedostupnu bazu (free tier ~7 dana) → exit 0 (kao rls-check, bez lažnog crvenog).
// NIJE u `npm run preflight` (mrežno/ovisno o stanju baze) — pokreni ručno nakon uređivanja sadržaja,
// ili u secret-gated authed CI-jobu. Ishod: drift → exit 1 · nema drifta → exit 0 · baza spava → exit 0 (skip).
//
// Napomena (Windows libuv): jedan izlaz s kratkom odgodom pušta undici keep-alive socket da mirno zatvori.

const util = require('util');
const path = require('path');
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

// Default = PRODUKCIJA. SUPABASE_TARGET=staging + STAGING_* → gađaj staging (U1).
const _STAGING = process.env.SUPABASE_TARGET === 'staging'
  && !!(process.env.STAGING_SUPABASE_URL && process.env.STAGING_SUPABASE_ANON);
const URL = _STAGING ? process.env.STAGING_SUPABASE_URL : 'https://naxjubnedhrbhsuasayu.supabase.co';
const ANON = _STAGING ? process.env.STAGING_SUPABASE_ANON : 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L';

const CATALOG_PATH = process.env.CATALOG_PATH || path.join(__dirname, '..', 'data', 'catalog.js');
const { SOKRAT_CATALOG } = require(CATALOG_PATH);

// Isti resolver kao verify-catalog.js (lekcija → window var-ime).
const resolveDataVar = (s, lessonId) => {
  const r = (s.content && s.content.resolve) || {};
  return r[lessonId] || r['*'] || null;
};

async function rest(qs) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${URL.replace(/\/$/, '')}/rest/v1/subject_content?${qs}`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      signal: ctrl.signal,
    });
    let body = null;
    try { body = await res.json(); } catch (_) { body = null; }
    return { status: res.status, body };
  } finally { clearTimeout(to); }
}

// Vraća { code, kind, msg }: kind = 'ok' | 'skip' | 'fail'
async function check() {
  console.log('final-drift check protiv', URL, '(anon, read-only)\n');

  let sc;
  try { sc = await rest('select=subject_id,var_name,payload'); }
  catch (e) { return { code: 0, kind: 'skip', msg: 'subject_content nedostupan: ' + e.message }; }

  if (sc.status >= 500 || sc.status === 0) return { code: 0, kind: 'skip', msg: `subject_content status ${sc.status} (baza možda spava)` };
  if (sc.status === 401 || sc.status === 403) return { code: 1, kind: 'fail', msg: `anon NE MOŽE čitati subject_content (status ${sc.status}) — javna politika slomljena` };
  if (sc.status !== 200 || !Array.isArray(sc.body)) return { code: 0, kind: 'skip', msg: `subject_content neočekivan odgovor (status ${sc.status})` };
  if (sc.body.length === 0) return { code: 0, kind: 'skip', msg: 'subject_content prazan (baza tek budna?) — preskačem' };

  // subject_id → { var_name → payload }
  const db = {};
  for (const row of sc.body) {
    (db[row.subject_id] = db[row.subject_id] || {})[row.var_name] = row.payload;
  }
  console.log(`Učitano ${sc.body.length} redova za ${Object.keys(db).length} predmeta iz baze.\n`);

  let checked = 0, drifted = 0, skipped = 0;
  const driftReports = [];

  for (const s of SOKRAT_CATALOG.subjects) {
    const fv = resolveDataVar(s, 'final');
    const m1 = resolveDataVar(s, 'first-midterm');
    const m2 = resolveDataVar(s, 'second-midterm');

    // Nije 3-dijelni (M1/M2/final) predmet → nema što provjeriti (wildcard/jedan sadržaj).
    if (!fv || !m1 || !m2 || fv === m1 || fv === m2 || m1 === m2) { skipped++; continue; }

    const rows = db[s.id];
    // Predmet nije u bazi (HR file-served) ili nekompletan → preskoči (nije drift, samo nije migriran).
    if (!rows || !rows[fv] || !rows[m1] || !rows[m2]) { skipped++; continue; }

    const F = rows[fv], M1 = rows[m1], M2 = rows[m2];
    if (F == null || M1 == null || M2 == null || typeof F !== 'object') { skipped++; continue; }

    // Očekivano = M1 ⊕ M2 (Object.assign; M2 pobjeđuje na koliziji ključa) — točno kako final.js gradi.
    const expected = Object.assign({}, M1, M2);
    const actual = Object.assign({}, F);
    delete actual.examPractice; // examPractice postoji SAMO u finalu — nije iz M1/M2

    const expKeys = Object.keys(expected).sort();
    const actKeys = Object.keys(actual).sort();
    const diffs = [];

    // Set-razlika ključeva kategorija
    const missingInFinal = expKeys.filter((k) => !(k in actual));
    const extraInFinal = actKeys.filter((k) => !(k in expected));
    for (const k of missingInFinal) diffs.push(`kategorija "${k}" iz kolokvija FALI u finalu`);
    for (const k of extraInFinal) diffs.push(`kategorija "${k}" u finalu NIJE u kolokvijima (stale?)`);

    // Sadržajna usporedba zajedničkih kategorija (redoslijed stavki bitan → deep-strict)
    for (const k of expKeys) {
      if (!(k in actual)) continue;
      if (!util.isDeepStrictEqual(actual[k], expected[k])) {
        diffs.push(`kategorija "${k}" se RAZLIKUJE (final ≠ kolokvij)`);
      }
    }

    checked++;
    if (diffs.length) {
      drifted++;
      driftReports.push({ subject: s.id, finalVar: fv, diffs });
    } else {
      console.log(`  ✓ ${s.id} — final == ${m1} ⊕ ${m2} (+examPractice)`);
    }
  }

  console.log('');
  if (drifted) {
    for (const r of driftReports) {
      console.error(`  ✗ DRIFT: ${r.subject} (${r.finalVar})`);
      for (const d of r.diffs) console.error(`      • ${d}`);
    }
    return { code: 1, kind: 'fail', msg: `${drifted} predmet(a) s DRIFT-om finala; provjereno ${checked}, preskočeno ${skipped}. Re-sync (migrate-content.js) ili ispravi propagaciju.` };
  }
  return { code: 0, kind: 'ok', msg: `svih ${checked} provjerenih finala == M1⊕M2(+examPractice); preskočeno ${skipped} (nemigrirani/ne-3-dijelni).` };
}

check()
  .catch((e) => ({ code: 0, kind: 'skip', msg: 'neočekivana greška: ' + e.message }))
  .then((r) => {
    if (r.kind === 'fail') console.error(`\n❌ FINAL-DRIFT: ${r.msg}`);
    else if (r.kind === 'skip') console.log(`\n⏭️  SKIP (baza nedostupna/uspavana): ${r.msg}`);
    else console.log(`\n✅ OK: ${r.msg}`);
    setTimeout(() => process.exit(r.code), 300);
  });
