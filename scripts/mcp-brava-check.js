// mcp-brava-check.js — BRAVA nad tokenom korisnikovog AI-ja (F6 ①/2, ADR-038 ④).
// Dokazuje kroz PRAVI OAuth 2.1 token da AI smije SAMO ono što mu je izričito otvoreno.
//
// ⚠️ SAMO STAGING. Test piše i na kraju BRIŠE jednokratnog korisnika → gađanje produkcije je
//    TVRDO zabranjeno (CLAUDE pravilo #8). Provjera je na URL-u, prije ijednog poziva.
//
// ─── ZAŠTO OVA BRANA POSTOJI ────────────────────────────────────────────────────────────────────
// Supabase OAuth token nije poseban: to je OBIČAN korisnički JWT uz claim `client_id` (izmjereno
// 17.09., RASPORED §F6). `aud` ostaje `authenticated` → token nije vezan na naš poslužitelj, a tko
// ga drži (broker Anthropica/OpenAI-ja, ne model) smije SVE što i prijavljeni korisnik: objaviti
// preko `publish_node`, obrisati čvor, uzeti `handle`, uploadati sliku, obrisati račun. ADR-038 ④
// zato presuđuje: **sigurnost je u bazi** — token s `client_id` dobiva vlastitu Postgres ulogu
// (`mcp_klijent`) kojoj je sve zabranjeno dok se izričito ne otvori.
//
// ─── ZAŠTO BEZ PREGLEDNIKA (i zašto to nije bilo očito) ─────────────────────────────────────────
// Plan je pretpostavljao da odobrenje mora kliknuti Playwright. Ne mora: `approveAuthorization` u
// supabase-js je samo `POST /auth/v1/oauth/authorizations/<id>/consent` s korisnikovim JWT-om.
// Dva izmjerena pravila toka (18.09.), oba puta krivo pogođena iz prve:
//   • `consent` BEZ prethodnog `GET /oauth/authorizations/<id>` vraća **404** — GET nije
//     informativan poziv nego korak toka (isti redoslijed koji vozi `js/odobrenje.js`);
//   • ako za taj par (klijent, scope) veza VEĆ postoji, autorizacija se odobri sama i `consent`
//     vrati **400 „no longer pending"** → zato svaki prolaz registrira SVJEŽ DCR klijent.
//
// ─── ZAŠTO SE SVAKI RPC ZOVE TOČNIM POTPISOM ────────────────────────────────────────────────────
// Izmjereno: odbijen RPC, nepostojeći RPC i RPC s krivim argumentima vraćaju ISTI odgovor
// (404 `PGRST202`). Gate koji zove `rpc(ime, {})` zato ne mjeri bravu nego vlastitu nespretnost —
// bio bi zelen i da je sve otvoreno. Potpisi ispod prepisani su iz `supabase/*.sql`, a
// `provjeriInventar()` pada ako se u SQL-u pojavi funkcija koju ovdje nitko nije klasificirao.
//
// ─── ZAŠTO JEDNOKRATNI KORISNIK, A ZA JEDNU PROVJERU ADMIN ──────────────────────────────────────
// Test na kraju zove `delete-account`, koja briše (kalup: `delete-account-check.js`); da gađa
// `test-admin@sokrat.local`, srušio bi sve authed testove. IZNIMKA je `send-notification`: ona
// traži `is_admin()`, pa bi jednokratni korisnik dobio 403 i bez brave — dokaz ni o čemu. Ta se
// provjera radi tokenom ADMINA i s NAMJERNO neispravnim tijelom: na starom kodu prođe admin-vrata
// i padne na `400` (mail se NE šalje), s bravom staje ranije na `403`. Razlika 400 → 403 je dokaz.
//
// ─── ŠTO SVJESNO OSTAJE OTVORENO ────────────────────────────────────────────────────────────────
// `PUT /auth/v1/user` ide na Auth API, ne kroz Postgres → brava u bazi ga NE doseže. To je cigla
// ①/2b (polje „Trenutna lozinka" pa postavka u dashboardu). Ovdje se MJERI i ispisuje kao poznata
// rupa; kad ①/2b bude gotov, `OCEKUJ.authApiZatvoren = true` pretvara to u tvrdu provjeru.
//
// Ishod:
//   - bilo koji zabranjeni put PROĐE                     -> exit 1  (TVRDI gate)
//   - dopušteni put (MCP alat, čitanje vlastitog) PADNE  -> exit 1  (brava koja ubija i MCP)
//   - u SQL-u postoji nerazvrstana funkcija              -> exit 1  (inventar)
//   - nema STAGING_* / SERVICE key u .env                -> exit 0 + SKIP
//   - baza uspavana / funkcija nije deployana            -> exit 0 + SKIP

try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PROD_REF = 'naxjubnedhrbhsuasayu';
const BASE = (process.env.STAGING_SUPABASE_URL || '').replace(/\/+$/, '');
const ANON = process.env.STAGING_SUPABASE_ANON;
const SERVICE = process.env.STAGING_SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = process.env.STAGING_TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.STAGING_TEST_ADMIN_PASSWORD;
const REDIRECT = 'https://claude.ai/api/mcp/auth_callback';
const ULOGA = 'mcp_klijent';
const NULA = '00000000-0000-0000-0000-000000000000';

/** Kad ①/2b (Trenutna lozinka + postavka) bude isporučen → true, i Auth API postaje tvrda provjera. */
const OCEKUJ = { authApiZatvoren: false };

/**
 * JEDINI izričito otvoreni putovi za ulogu `mcp_klijent` (①/2c-1).
 *
 * Do 18.09. je brana držala popis ZABRANJENOG — dokazivala je, dakle, da je zatvoreno ono čega se
 * netko sjetio nabrojati. Audit je našao tri rupe TE vrste i nijednu u samoj bravi, pa je popis
 * okrenut: `mcp_brava_inventar()` nabroji SVE što u bazi postoji, a ovdje stoji ono malo što smije.
 * Nova tablica, novi RPC ili zalutali `grant` time obore branu PO DEFAULTU — bez da se itko sjetio
 * dopisati ih.
 *
 * ⚠️ Svaka cigla koja nešto otvara (②/1 `node_drafts`, ②/2 čitanje gradiva…) dopisuje redak OVDJE,
 *    s razlogom. Taj je redak ujedno i dokumentacija te dozvole.
 */
const OTVORENO = {
  sheme: {
    public: 'ulaz u shemu — bez njega PostgREST ulozi ne vidi ništa (①/2)'
  },
  tablice: {
    nodes: { prava: ['select'], zasto: 'RLS `nodes_select_own` → samo vlastiti čvorovi (①/2)' }
  },
  funkcije: {}   // nijedna — nijedan RPC nije otvoren tokenu korisnikovog AI-ja
};

/**
 * Edge Functions ne stoje iza Postgresa, pa ih brava iz baze NE DOSEŽE (`verify_jwt` na gatewayu
 * provjerava samo potpis — izmjereno 18.09.: AI-token je kroz `delete-account` obrisao račun).
 * Zato svaka funkcija mora biti ili POD STRAŽOM (`_shared/token-guard.ts`) ili ovdje imenovana s
 * razlogom zašto joj straža ne treba.
 *
 * ⚠️ Do ①/2c-2 se ovo oslanjalo na to da smo se SJETILI staviti stražu na dvije funkcije — nova
 *    funkcija (②, ①/4…) ušla bi bez ijednog crvenog. Popis je sada obveza, ne navika.
 */
const EDGE_BEZ_STRAZE = {
  'mail-unsubscribe': 'autorizira HMAC-potpisan token iz linka, ne JWT-identitet (`verify_jwt = false`)',
  mcp: 'TO JE konektor — radi pod korisnikovim RLS-om (`withSupabase({ auth: "user" })`), ništa privilegirano'
};

/** Funkcije pod stražom koje brana ŽIVO gađa AI-tokenom (mora se poklapati sa stražom na disku). */
const EDGE_ZIVO = ['delete-account', 'send-notification'];

/** RPC-ovi koje token AI-ja NE SMIJE zvati — ime → točni argumenti iz `supabase/*.sql`. */
const ZABRANJENI_RPC = {
  create_node: { p_parent: null, p_kind: 'folder', p_name: 'brava-proba' },
  rename_node: { p_id: NULA, p_name: 'brava-proba' },
  delete_node: { p_id: NULA },
  move_node: { p_id: NULA, p_new_parent: null, p_position: null },
  reorder_nodes: { p_parent: null, p_ordered_ids: [] },
  restore_node: { p_id: NULA },
  publish_node: { p_node_id: NULA, p_payload: {}, p_base_version: 0 },
  publish_document: { p_subject_id: 'brava-proba', p_writes: [] },
  set_profile_handle: { p_handle: 'brava' + String(Date.now()).slice(-6) },
  set_profile_identity: { p_display_name: 'Brava', p_bio: '' },
  set_profile_image: { p_kind: 'avatar', p_path: null },
  profile_images_count_mine: {},
  is_admin: {},
  // `_node_own` vraća `public.nodes`, NE `trigger` → izuzeće „okidač nije ruta" na nju se ne odnosi;
  // drži je zatvorenom jedan `revoke` (f1-nodes.sql), pa ga ovdje netko mora i provjeriti.
  _node_own: { p_id: NULA },
  // Inventar iz ①/2c-1 je i sam funkcija u `public` — smije ga zvati isključivo `service_role`.
  mcp_brava_inventar: {}
};

/** Funkcije koje NISU ruta: okidači (zovu se iz triggera) i interni pomoćnici (service_role). */
const OKIDACI = ['handle_new_user', 'node_content_validate', 'nodes_validate', 'set_updated_at',
  'snapshot_content_version', 'snapshot_node_content', 'touch_node_content', 'touch_nodes',
  'touch_profile_identity', 'touch_subject_content'];
const INTERNE = [];

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

let failed = 0;
let touched = 0;
function record(name, pass, detail) {
  touched++;
  if (!pass) failed++;
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}
function note(text) { console.log('   ℹ️  ' + text); }
function skip(why) { console.log('⏭️  SKIP — ' + why); process.exit(0); }

async function http(put, opts) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 20000);
  try { return await fetch(BASE + put, Object.assign({ signal: ctrl.signal }, opts)); }
  finally { clearTimeout(to); }
}

const svcHeaders = () => ({ apikey: SERVICE, Authorization: 'Bearer ' + SERVICE, 'Content-Type': 'application/json' });
const ref = () => (BASE.match(/https:\/\/([a-z0-9]+)\.supabase\.co/) || [])[1] || '';

/** Odbijeno? 401/403, ili 404 koji PostgREST vraća kad ruta ulozi nije vidljiva. */
function odbijen(status, tekst) {
  return status === 401 || status === 403 || (status === 404 && /PGRST202/.test(tekst || ''));
}

async function createThrowaway() {
  const email = `mcp-brava-${Date.now()}@sokrat-test.invalid`;
  const password = 'Throwaway-' + crypto.randomBytes(6).toString('hex') + '!9';
  const r = await http('/auth/v1/admin/users', {
    method: 'POST', headers: svcHeaders(),
    body: JSON.stringify({ email, password, email_confirm: true })
  });
  if (!r.ok) throw new Error(`createUser ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return { id: (await r.json()).id, email, password };
}

async function prijava(email, password) {
  const r = await http('/auth/v1/token?grant_type=password', {
    method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error(`signIn ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).access_token;
}

/** PRAVI OAuth token: svjež DCR klijent → authorize → GET detalja → consent → zamjena koda. */
async function oauthToken(korisnikJwt) {
  const reg = await http('/auth/v1/oauth/clients/register', {
    method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_name: 'Sokrat brava (test)',
      redirect_uris: [REDIRECT],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none'
    })
  });
  if (!reg.ok) throw new Error(`DCR ${reg.status}: ${(await reg.text()).slice(0, 200)}`);
  const klijent = await reg.json();

  const verifier = crypto.randomBytes(32).toString('base64url');
  const u = new URL(BASE + '/auth/v1/oauth/authorize');
  u.searchParams.set('client_id', klijent.client_id);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('redirect_uri', REDIRECT);
  u.searchParams.set('code_challenge', crypto.createHash('sha256').update(verifier).digest('base64url'));
  u.searchParams.set('code_challenge_method', 'S256');
  const a = await fetch(u, { redirect: 'manual' });
  const id = ((a.headers.get('location') || '').match(/authorization_id=([^&]+)/) || [])[1];
  if (!id) throw new Error('authorize bez authorization_id (HTTP ' + a.status + ')');

  const det = await http('/auth/v1/oauth/authorizations/' + id, {
    headers: { apikey: ANON, Authorization: 'Bearer ' + korisnikJwt }
  });
  if (!det.ok) throw new Error(`detalji ${det.status}`);

  const c = await http('/auth/v1/oauth/authorizations/' + id + '/consent', {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json', Authorization: 'Bearer ' + korisnikJwt },
    body: JSON.stringify({ action: 'approve' })
  });
  if (!c.ok) throw new Error(`consent ${c.status}: ${(await c.text()).slice(0, 160)}`);
  const code = (((await c.json()).redirect_url || '').match(/[?&]code=([^&]+)/) || [])[1];

  const t = await http('/auth/v1/oauth/token', {
    method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'authorization_code', code, code_verifier: verifier, client_id: klijent.client_id, redirect_uri: REDIRECT })
  });
  if (!t.ok) throw new Error(`token ${t.status}: ${(await t.text()).slice(0, 200)}`);
  const token = (await t.json()).access_token;
  return { token, client_id: klijent.client_id, claims: JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) };
}

async function rpc(token, ime, tijelo) {
  const r = await http('/rest/v1/rpc/' + ime, {
    method: 'POST',
    headers: { apikey: ANON, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(tijelo)
  });
  return { status: r.status, tekst: (await r.text()).slice(0, 180) };
}

/** MCP alat preko HTTP-a, onako kako ga zove konektor (Streamable HTTP, bez stanja). */
async function mcpAlat(token, alat) {
  const H = { apikey: ANON, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  await http('/functions/v1/mcp', {
    method: 'POST', headers: H,
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'mcp-brava-check', version: '1' } } })
  });
  const r = await http('/functions/v1/mcp', {
    method: 'POST', headers: H,
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: alat, arguments: {} } })
  });
  return { status: r.status, tekst: await r.text() };
}

/** Svaka funkcija iz `supabase/*.sql` mora biti razvrstana — nova ruta inače uđe nezapaženo. */
function provjeriInventar() {
  const dir = path.join(__dirname, '..', 'supabase');
  const imena = new Set();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.sql'))) {
    const tekst = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of tekst.matchAll(/create\s+(?:or\s+replace\s+)?function\s+public\.([a-z0-9_]+)\s*\(/gi)) imena.add(m[1]);
  }
  const poznato = new Set([...Object.keys(ZABRANJENI_RPC), ...OKIDACI, ...INTERNE]);
  // ⚠️ Ovdje je do 18.09. stajalo blanket izuzeće `/^mcp_/` (pisano za hook). Cigla ②/1 dodaje
  // upravo `mcp_*` RPC-ove, pa bi cijeli budući write-put prošao kroz ovu provjeru nezapaženo.
  // Izuzeće je zato suženo na TOČNO ime hooka — sve ostalo mora biti razvrstano.
  const nerazvrstane = [...imena].filter((n) => !poznato.has(n) && n !== 'mcp_access_token_hook');
  record('svaka funkcija iz supabase/*.sql je razvrstana (' + imena.size + ' nađeno)',
    nerazvrstane.length === 0, nerazvrstane.join(', ') || 'nema nerazvrstanih');
}

/**
 * Svaka Edge Function s diska mora biti pod stražom ili imenovana s razlogom, a svaka pod stražom
 * mora imati i ŽIVU provjeru dolje — inače brana tvrdi nešto što nikad nije gađala.
 */
function provjeriEdgeStraze() {
  const dir = path.join(__dirname, '..', 'supabase', 'functions');
  const funkcije = fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '_shared')
    .map((d) => d.name);

  const podStrazom = [];
  const gole = [];
  for (const f of funkcije) {
    if (f in EDGE_BEZ_STRAZE) continue;
    const put = path.join(dir, f, 'index.ts');
    const izvor = fs.existsSync(put) ? fs.readFileSync(put, 'utf8') : '';
    if (/token-guard|biljegTokena/.test(izvor)) podStrazom.push(f); else gole.push(f);
  }
  record(`svaka Edge Function je pod stražom ili imenovana s razlogom (${funkcije.length} nađeno)`,
    gole.length === 0, gole.join(', ') || 'pod stražom: ' + (podStrazom.join(', ') || 'nijedna')
      + ' · bez nje s razlogom: ' + Object.keys(EDGE_BEZ_STRAZE).join(', '));

  const mrtvi = Object.keys(EDGE_BEZ_STRAZE).filter((f) => !funkcije.includes(f));
  record('popis funkcija bez straže nema mrtvog retka', mrtvi.length === 0,
    mrtvi.join(', ') || 'sve s popisa postoji na disku');

  const bezZive = podStrazom.filter((f) => !EDGE_ZIVO.includes(f));
  record('svaka funkcija pod stražom ima i živu provjeru AI-tokenom', bezZive.length === 0,
    bezZive.join(', ') || 'živo gađane: ' + EDGE_ZIVO.join(', '));
}

/** Matrica prava iz same baze (`mcp_brava_inventar`, service_role). Vraća `{ greska }` ako ne ide. */
async function dohvatiInventar() {
  const r = await http('/rest/v1/rpc/mcp_brava_inventar', { method: 'POST', headers: svcHeaders(), body: '{}' });
  const tekst = await r.text();
  if (!r.ok) return { greska: 'HTTP ' + r.status + ' ' + tekst.replace(/\s+/g, ' ').slice(0, 160) };
  try { return JSON.parse(tekst); } catch (e) { return { greska: 'neparsiv odgovor: ' + tekst.slice(0, 120) }; }
}

/**
 * Model: što baza TVRDI da uloga smije. Iscrpno — svaka shema, svaka tablica, svaka funkcija.
 * Mjeri se u OBA smjera: višak (otvoreno a nije na popisu) i manjak (popis tvrdi dozvolu koje
 * u bazi nema). Bez drugog smjera brana zna ostati zelena zato što je popis mrtav, ne zato što
 * je brava čvrsta.
 */
function provjeriPrava(inv) {
  record('uloga ' + ULOGA + ' postoji u bazi', inv.postoji === true, inv.postoji ? '' : 'nema je — brava nije primijenjena');
  if (inv.postoji !== true) return;

  const sheme = Object.entries(inv.sheme || {});
  const viskoviS = sheme.filter(([ime, ima]) => ima && !(ime in OTVORENO.sheme)).map(([ime]) => ime);
  record(`nijedna shema izvan popisa nije otvorena (${sheme.length} pregledano)`,
    viskoviS.length === 0, viskoviS.join(', ') || 'otvoreno samo: ' + Object.keys(OTVORENO.sheme).join(', '));

  const tablice = Object.entries(inv.tablice || {});
  const viskoviT = [];
  for (const [ime, prava] of tablice) {
    const dop = (OTVORENO.tablice[ime] || {}).prava || [];
    const visak = (prava || []).filter((p) => !dop.includes(p));
    if (visak.length) viskoviT.push(ime + ' → ' + visak.join('+'));
  }
  record(`nijedna tablica nema pravo izvan popisa (${tablice.length} pregledano)`,
    viskoviT.length === 0, viskoviT.join(' | ') || 'otvoreno samo: ' + Object.keys(OTVORENO.tablice).join(', '));

  const manjak = Object.entries(OTVORENO.tablice)
    .filter(([ime, o]) => o.prava.some((p) => !((inv.tablice || {})[ime] || []).includes(p)))
    .map(([ime]) => ime);
  record('popis otvorenog odgovara bazi (nijedan mrtav redak)', manjak.length === 0,
    manjak.join(', ') || 'sve s popisa stvarno postoji');

  const funkcije = Object.entries(inv.funkcije || {});
  const viskoviF = funkcije
    .filter(([ime, o]) => o.execute && !(ime in OTVORENO.funkcije))
    .map(([ime, o]) => ime + (o.okidac ? ' (okidač)' : ''));
  record(`nijedna funkcija u public nije izvršiva ulozi (${funkcije.length} pregledano)`,
    viskoviF.length === 0, viskoviF.join(' | ') || 'nijedna');
}

/**
 * Stvarnost: model iz kataloga vrijedi samo ako se isto vidi kroz PRAVI put (PostgREST).
 * ⚠️ 200 s praznim `[]` NIJE odbijanje — znači da dozvola POSTOJI a RLS je samo ispraznio
 *    rezultat. Zato ovdje pada sve što nije greška, a ne „sve što je vratilo redak".
 */
async function provjeriCitanjeTablica(inv, token) {
  const imena = Object.keys(inv.tablice || {}).sort().filter((ime) => !(ime in OTVORENO.tablice));
  const propusti = [];
  for (const ime of imena) {
    const r = await http('/rest/v1/' + encodeURIComponent(ime) + '?select=*&limit=1',
      { headers: { apikey: ANON, Authorization: 'Bearer ' + token } });
    const tekst = (await r.text()).replace(/\s+/g, ' ').slice(0, 120);
    const ok = r.status !== 200 && (r.status === 401 || r.status === 403
      || (r.status === 404 && /PGRST2/.test(tekst)) || /permission denied/i.test(tekst));
    if (!ok) propusti.push(ime + ' → HTTP ' + r.status + ' ' + tekst);
  }
  record(`nijedna tablica izvan popisa se ne čita kroz PostgREST (${imena.length} probano)`,
    propusti.length === 0, propusti.join(' | ') || 'sve odbijeno');
}

(async () => {
  if (!BASE || !ANON) skip('nema STAGING_SUPABASE_URL / STAGING_SUPABASE_ANON u .env');
  if (!SERVICE) skip('nema STAGING_SUPABASE_SERVICE_KEY (test stvara i briše jednokratnog korisnika)');
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) skip('nema STAGING_TEST_ADMIN_* (provjera send-notification traži admina)');
  if (BASE.includes(PROD_REF)) {
    console.log('❌ ODBIJENO: ovaj test piše i briše — PRODUKCIJA je zabranjena (CLAUDE #8).');
    process.exit(1);
  }

  console.log('\n=== mcp:brava === (staging ' + ref() + ')\n');
  provjeriInventar();
  provjeriEdgeStraze();

  console.log('\n— inventar iz baze: sve je zatvoreno osim izričito otvorenog —');
  const inv = await dohvatiInventar();
  if (inv.greska) {
    record('inventar prava se čita (mcp_brava_inventar)', false, inv.greska);
    console.log('\n  ①/2c-1 SQL nije primijenjen na ovaj projekt — `supabase/f6-mcp-inventar.sql`.');
    process.exit(1);
  }
  provjeriPrava(inv);

  let korisnik;
  try { korisnik = await createThrowaway(); }
  catch (e) { skip('jednokratni korisnik se ne stvara: ' + e.message); }

  const korisnikJwt = await prijava(korisnik.email, korisnik.password);
  let oauth;
  try { oauth = await oauthToken(korisnikJwt); }
  catch (e) { console.log('❌ OAuth token se ne može dobiti: ' + e.message); process.exit(1); }

  console.log('\n— token korisnikovog AI-ja —');
  record('token nosi client_id (bez toga brava nema što prepoznati)', !!oauth.claims.client_id, oauth.claims.client_id);
  record(`uloga u tokenu je '${ULOGA}'`, oauth.claims.role === ULOGA, 'role = ' + oauth.claims.role);
  record('obična prijava NIJE dirnuta (JWT s lozinkom ostaje authenticated)',
    JSON.parse(Buffer.from(korisnikJwt.split('.')[1], 'base64url').toString()).role === 'authenticated');

  console.log('\n— što token SMIJE (padne li ovo, brava je ubila i MCP) —');
  const adminJwt = await prijava(ADMIN_EMAIL, ADMIN_PASSWORD);
  const adminOauth = await oauthToken(adminJwt);
  const alat = await mcpAlat(adminOauth.token, 'procitaj_materijale');
  // ⚠️ Odgovor je SSE, a tekst alata je JSON UNUTAR JSON stringa → navodnici su izbjegnuti
  // (`\"materijala\": 40`). Regex bez toga ne nađe ništa i vrati lažno crveno (izmjereno 18.09.).
  const brojMaterijala = (alat.tekst.match(/\\?"materijala\\?":\s*(\d+)/) || [, null])[1];
  record('MCP alat procitaj_materijale vraća vlastito gradivo', alat.status === 200 && brojMaterijala !== null,
    'HTTP ' + alat.status + ' → ' + (brojMaterijala === null ? 'bez brojke' : brojMaterijala + ' materijala'));
  const citanje = await http('/rest/v1/nodes?select=id&limit=1', { headers: { apikey: ANON, Authorization: 'Bearer ' + adminOauth.token } });
  record('čitanje vlastitih čvorova prolazi', citanje.status === 200, 'HTTP ' + citanje.status);

  console.log('\n— što token NE SMIJE: RPC-ovi (svaki s točnim potpisom) —');
  for (const [ime, args] of Object.entries(ZABRANJENI_RPC)) {
    const r = await rpc(oauth.token, ime, args);
    record(`RPC ${ime} odbijen`, odbijen(r.status, r.tekst),
      'HTTP ' + r.status + (odbijen(r.status, r.tekst) ? '' : ' ← PROLAZI: ' + r.tekst.replace(/\s+/g, ' ').slice(0, 90)));
  }

  console.log('\n— što token NE SMIJE: čitanje tuđih tablica kroz pravi put —');
  await provjeriCitanjeTablica(inv, oauth.token);

  console.log('\n— što token NE SMIJE: izravan upis i Storage —');
  const upis = await http('/rest/v1/progress', {
    method: 'POST',
    headers: { apikey: ANON, Authorization: 'Bearer ' + oauth.token, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ user_id: korisnik.id, key: 'brava-proba', data: {} })
  });
  const upisTekst = await upis.text();
  record('izravan upis u tablicu progress odbijen', odbijen(upis.status, upisTekst) || upis.status === 401, 'HTTP ' + upis.status);

  // ⚠️ Bucketi se NE nabrajaju rukom: dolaze iz inventara, pa novi bucket (①/2c-2) mora sam
  //    dokazati da je zatvoren. Do sada se gađao samo `node-images` — `profile-images` i
  //    `lesson-images` nitko nije provjeravao.
  const bucketi = (inv.bucketi || []).map((b) => b.id);
  const propusniBucketi = [];
  for (const b of bucketi) {
    const up = await http('/storage/v1/object/' + b + '/' + korisnik.id + '/brava.png', {
      method: 'POST',
      headers: { apikey: ANON, Authorization: 'Bearer ' + oauth.token, 'Content-Type': 'image/png' },
      body: PNG
    });
    // ⚠️ Storage odbijanje NE dolazi kao HTTP 403: izmjereno 18.09. vraća **400** s tijelom
    // `{"statusCode":"403","code":"AccessDenied","message":"permission denied for schema storage"}`.
    // Gate koji gleda samo broj bio bi ovdje lažno crven — pa bi se „popravljao" otvaranjem prava.
    const upTekst = await up.text();
    const upOdbijen = up.status === 401 || up.status === 403 || /AccessDenied|"statusCode":"40[13]"/.test(upTekst);
    if (!upOdbijen) propusniBucketi.push(b + ' → HTTP ' + up.status + ' ' + upTekst.replace(/\s+/g, ' ').slice(0, 60));
  }
  record(`upload odbijen u SVAKI bucket (${bucketi.length} iz inventara)`, propusniBucketi.length === 0,
    propusniBucketi.join(' | ') || bucketi.join(', '));

  console.log('\n— što token NE SMIJE: Edge Functions —');
  const sn = await http('/functions/v1/send-notification', {
    method: 'POST',
    headers: { apikey: ANON, Authorization: 'Bearer ' + adminOauth.token, 'Content-Type': 'application/json' },
    body: 'nije-json'
  });
  record('send-notification odbija AI-token ADMINA (403, ne 400)', sn.status === 403,
    'HTTP ' + sn.status + (sn.status === 400 ? ' ← prošao admin-vrata' : ''));

  console.log('\n— Auth API (izvan dosega brave u bazi) —');
  const put = await http('/auth/v1/user', {
    method: 'PUT',
    headers: { apikey: ANON, Authorization: 'Bearer ' + oauth.token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { brava_proba: true } })
  });
  if (OCEKUJ.authApiZatvoren) {
    record('PUT /auth/v1/user odbijen (①/2b isporučen)', put.status === 401 || put.status === 403, 'HTTP ' + put.status);
  } else {
    record('PUT /auth/v1/user IZMJEREN (poznata rupa do ①/2b)', true, 'HTTP ' + put.status);
    note('brava u bazi ovo ne doseže — zatvara je tek ①/2b (Trenutna lozinka + postavka).');
  }

  console.log('\n— brisanje računa (zadnje: briše jednokratnog korisnika) —');
  const da = await http('/functions/v1/delete-account', {
    method: 'POST',
    headers: { apikey: ANON, Authorization: 'Bearer ' + oauth.token, 'Content-Type': 'application/json' },
    body: '{}'
  });
  record('delete-account odbija AI-token', da.status === 403,
    'HTTP ' + da.status + (da.status === 200 ? ' ← OBRISAO RAČUN' : ''));

  await http('/auth/v1/admin/users/' + korisnik.id, { method: 'DELETE', headers: svcHeaders() }).catch(() => {});

  console.log('\n  dotaknuto: ' + touched + ' provjera, palo: ' + failed);
  console.log(failed ? '✗ BRAVA NE DRŽI\n' : '✅ brava drži\n');
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.log('✗ test je pukao: ' + e.message);
  process.exit(1);
});
