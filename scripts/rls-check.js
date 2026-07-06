// rls-check.js — RLS sigurnosni test protiv POSTOJEĆE baze, anon ključem, READ-ONLY (FOUNDATION_PLAN F1, brick 1E).
// Dokazuje da Row Level Security ne curi: anon SMIJE čitati javni `subject_content`, anon NE SMIJE vidjeti tuđi `progress`.
// Bez pisanja u bazu. Anon (publishable) ključ je javan po dizajnu (isti je u js/auth.js, RLS je taj koji štiti podatke).
//
// Ishod:
//   - LEAK (anon vidi redove `progress`)            -> exit 1  (TVRDI gate; CI crveno)
//   - javno čitanje `subject_content` blokirano      -> exit 1  (politika slomljena)
//   - baza nedostupna/uspavana (free tier ~7 dana)   -> exit 0 + SKIP  (ne lažni crveni; isto kao auth.spec skip)
//   - sve ispravno                                   -> exit 0 + OK
//
// Napomena: jedan izlaz s kratkom odgodom — `fetch` (undici) drži keep-alive socket pa `process.exit` usred
// teardowna ruši libuv NA WINDOWSU (poznato; vidi generator-pilot). Odgoda pusti socket da mirno zatvori.

const URL = 'https://naxjubnedhrbhsuasayu.supabase.co';
const ANON = 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L';

async function rest(table, qs) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(`${URL}/rest/v1/${table}?${qs}`, {
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
  console.log('RLS check protiv', URL, '(anon, read-only)\n');

  // 1) Javno čitanje sadržaja — anon MORA moći čitati subject_content.
  let sc;
  try { sc = await rest('subject_content', 'select=subject_id&limit=5'); }
  catch (e) { return { code: 0, kind: 'skip', msg: 'subject_content nedostupan: ' + e.message }; }

  if (sc.status >= 500 || sc.status === 0) return { code: 0, kind: 'skip', msg: `subject_content status ${sc.status}` };
  if (sc.status === 401 || sc.status === 403) return { code: 1, kind: 'fail', msg: `anon NE MOŽE čitati subject_content (status ${sc.status}) — javna politika slomljena` };
  if (sc.status !== 200 || !Array.isArray(sc.body)) return { code: 0, kind: 'skip', msg: `subject_content neočekivan odgovor (status ${sc.status})` };
  if (sc.body.length === 0) return { code: 0, kind: 'skip', msg: 'subject_content prazan (baza možda tek budna) — ne testiram dalje' };
  console.log(`✅ anon ČITA subject_content (${sc.body.length} redova vidljivo) — javna politika radi`);

  // 2) Privatnost napretka — anon NE SMIJE vidjeti nijedan red progress.
  let pr;
  try { pr = await rest('progress', 'select=user_id&limit=5'); }
  catch (e) { return { code: 0, kind: 'skip', msg: 'progress nedostupan: ' + e.message }; }

  if (pr.status >= 500 || pr.status === 0) return { code: 0, kind: 'skip', msg: `progress status ${pr.status}` };
  if (pr.status === 401 || pr.status === 403) {
    console.log(`✅ anon ODBIJEN na progress (status ${pr.status}) — nema curenja`);
  } else if (pr.status === 200 && Array.isArray(pr.body)) {
    if (pr.body.length > 0) return { code: 1, kind: 'fail', msg: `anon VIDI ${pr.body.length} redova progress — RLS CURI (privatni podaci izloženi!)` };
    console.log('✅ anon vidi 0 redova progress (RLS filtrira na vlastite) — privatnost radi');
  } else {
    return { code: 0, kind: 'skip', msg: `progress neočekivan odgovor (status ${pr.status})` };
  }

  // 3) Admin identitet (F4.1) — anon NE SMIJE vidjeti nijedan red profiles.
  //    Tablica možda još ne postoji (f4-admin.sql nije primijenjen) → 404 = SKIP te podprovjere, ne fail.
  let pf;
  try { pf = await rest('profiles', 'select=user_id&limit=5'); }
  catch (e) { pf = null; }

  if (pf) {
    if (pf.status === 404) {
      console.log('⏭️  profiles tablica još ne postoji (F4.1 f4-admin.sql neprimijenjen) — preskačem admin-identitet provjeru');
    } else if (pf.status === 401 || pf.status === 403) {
      console.log(`✅ anon ODBIJEN na profiles (status ${pf.status}) — nema curenja`);
    } else if (pf.status === 200 && Array.isArray(pf.body)) {
      if (pf.body.length > 0) return { code: 1, kind: 'fail', msg: `anon VIDI ${pf.body.length} redova profiles — RLS CURI (uloge izložene!)` };
      console.log('✅ anon vidi 0 redova profiles (RLS filtrira na vlastiti) — privatnost uloga radi');
    } else if (pf.status < 500) {
      console.log(`⏭️  profiles neočekivan odgovor (status ${pf.status}) — preskačem`);
    }
  }

  return { code: 0, kind: 'ok', msg: 'javni sadržaj čitljiv, privatni napredak+uloge skriveni od anona.' };
}

check()
  .catch((e) => ({ code: 0, kind: 'skip', msg: 'neočekivana greška: ' + e.message }))
  .then((r) => {
    if (r.kind === 'fail') console.error(`\n❌ RLS FAIL: ${r.msg}`);
    else if (r.kind === 'skip') console.log(`\n⏭️  RLS SKIP (baza nedostupna/uspavana): ${r.msg}`);
    else console.log(`\n✅ RLS OK: ${r.msg}`);
    // Odgoda: pusti undici keep-alive socket da zatvori prije exita (Windows libuv teardown).
    setTimeout(() => process.exit(r.code), 300);
  });
