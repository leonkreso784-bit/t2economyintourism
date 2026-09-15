// mail-check.js — test Edge Functiona `send-notification` i `mail-unsubscribe` (F2/4) kroz PRAVI HTTP.
//
// ⚠️ SAMO STAGING (CLAUDE pravilo #8). Provjera je na URL-u, prije ijednog poziva. Mail je
//    nepovratna radnja prema van — ovaj test SMIJE poslati mail tek kad mu POSLUŽITELJ kaže da je
//    preusmjeravanje uključeno (`MAIL_REDIRECT_TO`, npr. `delivered@resend.dev`).
//
// Što se tvrdi (svaka stavka = jedna rupa koja bi inače izašla prema ljudima):
//   T1 bez tokena → 401 · T2 običan korisnik → 403 (slati smije samo admin)
//   T3 BROJ primatelja prati pravi GoTrue: od četiri nova računa u segment „FMTU" ulazi TOČNO jedan,
//      u „svi s pristankom" TOČNO dva (nije pristao / nepotvrđen / nije FMTU ostaju vani)
//   T4 loš segment / tuđa poveznica → 400, ništa poslano
//   T5 odjava: krivotvoren potpis → 400; GET NE odjavljuje (skeneri pošte), nego preusmjerava;
//      POST s pravim potpisom → pristanak `false`, ostali metapodaci (FMTU, ime) PREŽIVE
//   T6 „proba meni" i slanje segmentu — samo uz potvrđeno preusmjeravanje; svako slanje ima red u `mail_log`
//
// Ishod: rupa → exit 1 · nema STAGING_* u .env → exit 0 + SKIP · tajne funkcije još nisu postavljene
// (`mail_not_configured`) → T5/T6 SKIP s porukom što treba postaviti, ostalo se i dalje mjeri.

try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }
const path = require('path');
const { pathToFileURL } = require('url');

const PROD_REF = 'naxjubnedhrbhsuasayu';
const BASE = process.env.STAGING_SUPABASE_URL;
const ANON = process.env.STAGING_SUPABASE_ANON;
const SERVICE = process.env.STAGING_SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = process.env.STAGING_TEST_ADMIN_EMAIL;
const ADMIN_PASS = process.env.STAGING_TEST_ADMIN_PASSWORD;
const TAJNA = process.env.STAGING_MAIL_UNSUB_SECRET || '';

let failed = 0;
let skipped = 0;
const rec = (ime, ok, detalj) => { if (!ok) failed++; console.log(`${ok ? '✅' : '❌'} ${ime}${detalj ? ' — ' + detalj : ''}`); };
const skip = (ime, zasto) => { skipped++; console.log(`⏭️  ${ime} — SKIP: ${zasto}`); };

async function http(p, opts) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 30000);
  try { return await fetch(BASE + p, Object.assign({ signal: ctrl.signal, redirect: 'manual' }, opts)); }
  finally { clearTimeout(to); }
}
const svc = () => ({ apikey: SERVICE, Authorization: 'Bearer ' + SERVICE, 'Content-Type': 'application/json' });

async function noviKorisnik(tag, meta, potvrden) {
  const email = `mail-${tag}-${Date.now()}@sokrat-test.invalid`;
  const password = 'Throwaway-' + Math.random().toString(36).slice(2) + '!9';
  const r = await http('/auth/v1/admin/users', {
    method: 'POST', headers: svc(),
    body: JSON.stringify({ email, password, email_confirm: potvrden !== false, user_metadata: meta })
  });
  if (!r.ok) throw new Error(`createUser ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return Object.assign(await r.json(), { password });
}
async function obrisi(id) { await http('/auth/v1/admin/users/' + id, { method: 'DELETE', headers: svc() }).catch(() => {}); }
async function meta(id) {
  const r = await http('/auth/v1/admin/users/' + id, { headers: svc() });
  return (await r.json()).user_metadata || {};
}
async function prijava(email, password) {
  const r = await http('/auth/v1/token?grant_type=password', {
    method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error(`signIn ${r.status}`);
  return (await r.json()).access_token;
}
async function posalji(token, body) {
  const r = await http('/functions/v1/send-notification', {
    method: 'POST',
    headers: Object.assign({ apikey: ANON, 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
    body: JSON.stringify(body)
  });
  let j = null; try { j = await r.json(); } catch (e) { /* prazno */ }
  return { status: r.status, j };
}

(async () => {
  if (!BASE || !ANON || !SERVICE || !ADMIN_EMAIL || !ADMIN_PASS) {
    console.log('⏭️  mail-check: nema STAGING_* (URL/ANON/SERVICE/TEST_ADMIN) u .env → SKIP');
    process.exit(0);
  }
  if (BASE.includes(PROD_REF)) { console.log('⛔ mail-check gađa PRODUKCIJU — odbijeno (pravilo #8).'); process.exit(1); }

  const M = await import(pathToFileURL(path.join(__dirname, '..', 'supabase', 'functions', '_shared', 'mail-core.ts')).href);
  const stvoreni = [];
  try {
    // T0 — funkcija bira primatelje kroz GoTrue `admin/users`. Jedan račun upisan SQL-om mimo Auth
    // API-ja (NULL u `confirmation_token` i srodnima) ruši CIJELI popis — izmjereno 15.09. na RLS-fiksturi
    // staginga (`list_users_failed`). Ovdje se to kaže TIM riječima, prije nego padne slanje.
    const lu = await http('/auth/v1/admin/users?page=1&per_page=1', { headers: svc() });
    rec('T0 GoTrue popis korisnika radi (nijedan račun s NULL tokenima)', lu.ok,
      lu.ok ? '' : lu.status + ' ' + (await lu.text()).slice(0, 160) + ' → u auth.users postavi NULL tokene na \'\'');

    // T1 / T2
    const bez = await posalji(null, { mode: 'count', segment: 'all' });
    rec('T1 bez tokena → 401', bez.status === 401, 'status ' + bez.status);

    const obican = await noviKorisnik('obican', {}, true);
    stvoreni.push(obican.id);
    const tObican = await prijava(obican.email, obican.password);
    const ne = await posalji(tObican, { mode: 'count', segment: 'all' });
    rec('T2 običan korisnik → 403 not_admin', ne.status === 403 && ne.j && ne.j.error === 'not_admin', JSON.stringify(ne.j));

    // T3 — broj primatelja kroz pravi GoTrue (razlika prije/poslije, ne ovisi o zatečenim računima)
    const tAdmin = await prijava(ADMIN_EMAIL, ADMIN_PASS);
    const prije = { fmtu: (await posalji(tAdmin, { mode: 'count', segment: 'fmtu' })).j, all: (await posalji(tAdmin, { mode: 'count', segment: 'all' })).j };
    if (!prije.fmtu || typeof prije.fmtu.recipients !== 'number') throw new Error('count nije vratio broj: ' + JSON.stringify(prije.fmtu));
    const A = await noviKorisnik('fmtu', { mail_consent: true, is_fmtu: true, display_name: 'Test A' }, true);
    const B = await noviKorisnik('drugi', { mail_consent: true, is_fmtu: false }, true);
    const C = await noviKorisnik('bez', { mail_consent: false, is_fmtu: true }, true);
    const D = await noviKorisnik('nepotvrden', { mail_consent: true, is_fmtu: true }, false);
    stvoreni.push(A.id, B.id, C.id, D.id);
    const poslije = { fmtu: (await posalji(tAdmin, { mode: 'count', segment: 'fmtu' })).j, all: (await posalji(tAdmin, { mode: 'count', segment: 'all' })).j };
    const dF = poslije.fmtu.recipients - prije.fmtu.recipients;
    const dA = poslije.all.recipients - prije.all.recipients;
    rec('T3 „FMTU" prima TOČNO jednog od četiri nova računa', dF === 1, 'razlika ' + dF);
    rec('T3 „svi s pristankom" prima TOČNO dva (bez pristanka i nepotvrđen ostaju vani)', dA === 2, 'razlika ' + dA);

    // T4
    const losSeg = await posalji(tAdmin, { mode: 'count', segment: 'sve' });
    rec('T4 nepoznat segment → 400', losSeg.status === 400 && losSeg.j.error === 'mail_bad_segment', JSON.stringify(losSeg.j));
    const losUrl = await posalji(tAdmin, { mode: 'test', segment: 'all', subject: 's', text: 't', url: 'https://evil.io/' });
    rec('T4 poveznica izvan našeg sitea → 400 (ništa poslano)', losUrl.status === 400 && losUrl.j.error === 'mail_bad_url', JSON.stringify(losUrl.j));

    // T5 — odjava
    const probaOdjave = await http('/functions/v1/mail-unsubscribe?t=' + encodeURIComponent('x.y'), { method: 'POST' });
    const probaJ = await probaOdjave.json().catch(() => ({}));
    if (probaJ.error === 'mail_not_configured') {
      skip('T5 odjava', 'na stagingu nije postavljena tajna MAIL_UNSUB_SECRET (vrijednost STAGING_MAIL_UNSUB_SECRET iz .env)');
    } else if (!TAJNA) {
      skip('T5 odjava', 'nema STAGING_MAIL_UNSUB_SECRET u .env');
    } else {
      rec('T5 krivotvoren potpis → 400', probaOdjave.status === 400 && probaJ.error === 'bad_token', JSON.stringify(probaJ));
      const tB = await M.tokenOdjave(TAJNA, B.id);
      const get = await http('/functions/v1/mail-unsubscribe?t=' + encodeURIComponent(tB), { method: 'GET' });
      const loc = get.headers.get('location') || '';
      rec('T5 GET preusmjerava na odjava.html', get.status === 302 && /\/odjava\.html\?t=/.test(loc), get.status + ' ' + loc);
      rec('T5 GET NE odjavljuje (skeneri pošte otvaraju poveznice)', (await meta(B.id)).mail_consent === true);

      const tA = await M.tokenOdjave(TAJNA, A.id);
      const post = await http('/functions/v1/mail-unsubscribe?t=' + encodeURIComponent(tA), {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'List-Unsubscribe=One-Click'
      });
      const mA = await meta(A.id);
      rec('T5 one-click POST → pristanak false', post.status === 200 && mA.mail_consent === false, post.status + ' ' + JSON.stringify(mA));
      rec('T5 ostali metapodaci PREŽIVE odjavu (FMTU, ime)', mA.is_fmtu === true && mA.display_name === 'Test A', JSON.stringify(mA));
      const jsonPost = await http('/functions/v1/mail-unsubscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: await M.tokenOdjave(TAJNA, B.id) })
      });
      rec('T5 gumb na odjava.html (JSON {t}) → pristanak false', jsonPost.status === 200 && (await meta(B.id)).mail_consent === false);
      const opet = await posalji(tAdmin, { mode: 'count', segment: 'fmtu' });
      rec('T5 odjavljeni više nije primatelj', opet.j.recipients === prije.fmtu.recipients, 'fmtu ' + opet.j.recipients + ' (prije ' + prije.fmtu.recipients + ')');
    }

    // T6 — slanje, samo uz potvrđeno preusmjeravanje
    if (!poslije.all.redirected) {
      skip('T6 slanje', 'poslužitelj NE potvrđuje preusmjeravanje — na stagingu postavi MAIL_REDIRECT_TO=delivered@resend.dev');
    } else {
      const kljuc = 'mailcheck-' + Date.now();
      const proba = await posalji(tAdmin, { mode: 'test', segment: 'all', subject: 'mail-check proba', text: 'Proba.\n\nDrugi odlomak.', url: 'https://www.sokratstudy.com/', idempotency: kljuc });
      if (proba.j && proba.j.error === 'mail_not_configured') {
        skip('T6 slanje', 'na stagingu nedostaje RESEND_API_KEY ili MAIL_UNSUB_SECRET');
      } else {
        rec('T6 „proba meni" → 1 mail, preusmjeren', proba.status === 200 && proba.j.sent === 1 && proba.j.redirected === true, JSON.stringify(proba.j));
        const log = await http('/rest/v1/mail_log?select=subject,segment,recipients,test&order=id.desc&limit=1', { headers: svc() });
        const red = (await log.json())[0] || {};
        rec('T6 proba zapisana u mail_log (test=true, 1 primatelj)', red.subject === 'mail-check proba' && red.test === true && red.recipients === 1, JSON.stringify(red));
        // T5 je odjavio OBA računa s pristankom, pa bi segment ovdje imao 0 primatelja i „0 === 0"
        // prošao bez ijednog poslanog maila (izmjereno 15.09.). Svjež račun s pristankom + broj
        // IZ OVOG TRENUTKA; mjera je valjana tek s ≥ 1 primateljem.
        const E = await noviKorisnik('segment', { mail_consent: true, is_fmtu: false }, true);
        stvoreni.push(E.id);
        const n = (await posalji(tAdmin, { mode: 'count', segment: 'all' })).j.recipients;
        if (n > 10) {
          skip('T6 slanje segmentu', 'na stagingu je ' + n + ' primatelja s pristankom (> 10) — ne šaljem ni preusmjereno');
        } else {
          const seg = await posalji(tAdmin, { mode: 'send', segment: 'all', subject: 'mail-check segment', text: 'Segment.', idempotency: kljuc });
          rec('T6 slanje „svi s pristankom" → poslano onoliko koliko je primatelja (≥ 1)',
            seg.status === 200 && seg.j.recipients >= 1 && seg.j.sent === seg.j.recipients && seg.j.redirected === true, JSON.stringify(seg.j));
          const log2 = await http('/rest/v1/mail_log?select=subject,segment,recipients,test&order=id.desc&limit=1', { headers: svc() });
          const red2 = (await log2.json())[0] || {};
          rec('T6 slanje zapisano u mail_log (test=false, isti broj primatelja)',
            red2.subject === 'mail-check segment' && red2.test === false && red2.recipients === seg.j.recipients, JSON.stringify(red2));
        }
      }
    }
  } catch (e) {
    rec('mail-check se odvrtio do kraja', false, String(e && e.message || e));
  } finally {
    for (const id of stvoreni) await obrisi(id);
  }
  console.log(`\nmail-check: ${failed ? failed + ' PAD(OVA)' : 'bez padova'}${skipped ? ' · ' + skipped + ' SKIP' : ''}`);
  process.exit(failed ? 1 : 0);
})();
