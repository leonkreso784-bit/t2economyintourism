/* eslint-disable no-console */
// ===== Gate: rewrite javne adrese `/mcp` (F6 ①/4b) =====
// Usage: node scripts/check-mcp-rewrite.js                  (npm run check:mcp-rewrite — offline)
//        node scripts/check-mcp-rewrite.js --zivo <adresa>   (mjeri STVARNI preview / produkciju)
//
// ─── ŠTO JE OVDJE NA KOCKI ──────────────────────────────────────────────────────────────────────
// Korisnikov AI prvi zahtjev šalje BEZ tokena i tek iz odgovora 401 sazna GDJE je prijava:
// `WWW-Authenticate: Bearer resource_metadata="<resource>/oauth-protected-resource"` (RFC 9728).
// Izmjereno u izvoru `@supabase/server@1.7.0` (22.–23.09.): ta se adresa gradi kao `resource` +
// sufiks, a ruta se hvata po SUFIKSU PUTA, na bilo kojoj dubini. Posljedica koja opravdava ovu
// branu: rewrite koji pokriva samo `/mcp`, a ne i `/mcp/*`, ostavlja putokaz koji vodi u 404 —
// konektor se tada ne može ni prijaviti, a `/mcp` pritom uredno odgovara i sve izgleda ispravno.
//
// ─── ZAŠTO SIMULACIJA, A NE ČITANJE KLJUČEVA ────────────────────────────────────────────────────
// „`vercel.json` ima ključ `rewrites`" ne tvrdi ništa o tome kamo zahtjev stvarno ode. Zato se
// routing OVDJE IZVODI: za svaki (host, put) traži se pravilo koje ga hvata i sudi se ref na koji
// vodi. Oblik `source`-a ili `has`-a koji ova brana ne zna suditi je PAD, ne preskok — inače bi
// nepoznat oblik prolazio kao „nema nalaza", što je isti razred greške kao prolaz na nuli.
//
// ─── ZAŠTO `has.value` NE SMIJE BITI GOLI STRING ────────────────────────────────────────────────
// U Vercelovoj shemi (`openapi.vercel.sh/vercel.json`, provjereno 23.09.) `has[].value` je ILI
// objekt (`{eq: …}`) ILI **regularni izraz**. Goli `"www.sokratstudy.com"` je dakle regex bez
// sidara: točka hvata bilo koji znak — pa ga zadovoljava i `www-sokratstudy-com.napadac.example`.
// Kontrolni host u `BEZ_REWRITEA` postoji točno zato da ta razlika ima svoje crveno.
//
// ─── ZAŠTO NEMA CATCH-ALLA (Leonova odluka 23.09.) ──────────────────────────────────────────────
// Prvo pravilo je glasilo „www → produkcija, SVE ostalo → staging". Mjerenje ga je oborilo:
// projekt ima PRODUKCIJSKE `.vercel.app` aliase koji nisu `www` — `studymaster-leon-kresos-
// projects.vercel.app` i `studymaster-git-main-…` — pa bi ih to pravilo poslalo u TEST-BAZU.
// Zato su hostovi IMENOVANI, a nepoznat host ne dobiva rewrite i ostaje 404: pada zatvoreno.
// ⚠️ Prva zamjena je imala ISTI kvar: preview-regex `^studymaster-[a-z0-9-]+\.vercel\.app$`
// hvatao je oba ta aliasa, a tablice niže su to propustile jer su koristile IZMIŠLJEN tim-slug.
// Otud pravilo: imena okruženja se prepisuju IZ PLATFORME, ne iz sjećanja (vidi `DOSEG.provjereno`).
//
// ─── GRANICA KOJU OVA BRANA NE MJERI (imenovano, ne prešućeno) ──────────────────────────────────
// 1. Sufiks `/oauth-protected-resource` dolazi iz tuđeg paketa koji NIJE naša ovisnost (Deno ga
//    povlači pri deployu), pa ga offline ne možemo nabrojati iz izvora — stoji kao konstanta s
//    razlogom. Mjeri ga `--zivo`, protiv stvarnog poslužitelja.
// 2. Podudara li Vercel `has.type=host` točno onako kako ovdje simuliram — to offline ne može
//    dokazati nijedna tvrdnja. Zato `--zivo` postoji i zato je preview dio cigle, a ne ukras.

try { require('dotenv').config(); } catch (e) { /* dotenv je neobavezan */ }

const fs = require('fs');
const path = require('path');

const { PROJEKTI } = require('./deploy-function.js');
const { expectedSlugs } = require('./check-edge-functions.js');

const ROOT = path.join(__dirname, '..');
const VERCEL = path.join(ROOT, 'vercel.json');

/** Sufiks na kojem `@supabase/server` poslužuje RFC 9728 dokument. Vidi granicu 1 u zaglavlju. */
const METAPODACI = '/oauth-protected-resource';

/**
 * Javne adrese koje izlažemo i projekt koji iza njih stoji.
 *
 * ⚠️ Hostovi su PREPISANI IZ VERCELOVOG POPISA DOMENA projekta `studymaster` (provjereno 23.09.
 * kroz Vercel API), ne izmišljeni. Prva verzija ove brane koristila je izmišljen tim-slug i zato
 * je propustila pravi kvar: preview-regex `^studymaster-[a-z0-9-]+\.vercel\.app$` hvatao je i
 * `studymaster-leon-kresos-projects.vercel.app` (PRODUKCIJSKI alias) i
 * `studymaster-git-main-…` (alias grane `main`) — dakle dvije PRODUKCIJSKE adrese išle bi na
 * STAGING. To je točno onaj kvar zbog kojeg je catch-all i odbačen, samo u drugom obliku.
 */
const USMJERENJE = [
  {
    host: 'www.sokratstudy.com',
    projekt: 'prod',
    zasto: 'jedina prava adresa platforme; `mcp` ondje živi tek od F7',
  },
  {
    host: 'studymaster-git-feat-f6-mcp-leon-kresos-projects.vercel.app',
    projekt: 'staging',
    zasto: 'preview GRANE ZNAČAJKE — jedini `.vercel.app` oblik koji nikad nije produkcija',
  },
];

/**
 * Hostovi koji NE SMIJU dobiti rewrite. Ovo je tvrdnja da pravilo pada ZATVORENO.
 * Prva tri su STVARNE adrese ovog projekta (Vercel `project.domains`, 23.09.).
 */
const BEZ_REWRITEA = [
  {
    host: 'studymaster-leon-kresos-projects.vercel.app',
    zasto: 'PRODUKCIJSKI `.vercel.app` alias ovog projekta — nije `www`, pa bi ga široko '
      + 'pisan preview-obrazac poslao u TEST-BAZU (taj je kvar stvarno postojao 23.09.)',
  },
  {
    host: 'studymaster-git-main-leon-kresos-projects.vercel.app',
    zasto: 'alias grane `main` = produkcijski deploy; isti kvar kao gore',
  },
  {
    host: 'sokratstudy.com',
    zasto: 'apex; Vercel ga 307-a na `www` prije routinga (izmjereno), pa ovdje nema što raditi',
  },
  {
    host: 'studymaster-7u2uoqad9-leon-kresos-projects.vercel.app',
    zasto: 'alias POJEDINOG deploya — svjesno NIJE pokriven: ne da se razlikovati od '
      + 'produkcijskog aliasa bez pogleda unaprijed, a alias grane je stabilan i dovoljan za mjeru',
  },
  {
    host: 'www-sokratstudy-com.napadac.example',
    zasto: 'KONTROLA za goli string u `has.value`: kao regex bez sidara zadovoljio bi ga i ovaj host',
  },
];

/**
 * Čegrtaljka na dosegu (kalup: `check:final`). Broj tvrdnji koje prolaz MORA izvesti.
 * Bez nje tvrdnja koja tiho nestane (rani `return`, petlja koja ne uđe) spušta ukupno,
 * a ljuska i dalje vidi ✅ — isti razred kao `note()` koji ne diže brojač u `mcp-brava-check.js`.
 */
const OCEKIVANO_OFFLINE = 8;
const OCEKIVANO_ZIVO = 7;

/**
 * Čegrtaljka na DOSEGU (T7), odvojena od čegrtaljke na broju tvrdnji.
 *
 * ⚠️ NALAZ REVIZIJE 23.09.: `USMJERENJE = []` i `BEZ_REWRITEA = []` davali su
 * „✓ T5 (0 × 2 puta)" i „✓ T6 (0 × 2 puta)" uz **EXIT 0**. Brojač TVRDNJI to ne hvata — tvrdnji
 * je i dalje sedam, samo ne mjere ništa. Doseg zato ima vlastitu tvrdnju.
 * `provjereno` stoji jer su hostovi prepisani iz Vercelovog popisa domena RUKOM: popis se ne
 * nabraja sam, pa uz njega ide datum kad je zadnji put uspoređen sa stvarnošću.
 */
const DOSEG = { usmjerenje: 2, bezRewritea: 5, provjereno: '2026-09-23' };

const nalazi = [];
let izmjereno = 0;
function tvrdi(ime, ok, poruka) {
  izmjereno++;
  if (ok) { console.log(`  ✓ ${ime}`); return true; }
  nalazi.push(`${ime} — ${poruka}`);
  console.log(`  ✗ ${ime} — ${poruka}`);
  return false;
}

// ── Vercelov `source` → mjera koja zna reći hvata li put ────────────────────────────────────────
// Poznajemo dva oblika: doslovan put i doslovan put + `/:ime*`. `*` znači „nula ili više
// segmenata", pa `/mcp/:put*` hvata i goli `/mcp`. Sve ostalo vraća `null` = ne znam suditi.
function izvorUMjeru(source) {
  const m = String(source).match(/^((?:\/[A-Za-z0-9_.-]+)+)(\/:([A-Za-z][A-Za-z0-9_]*)\*)?$/);
  if (!m) return null;
  const baza = m[1];
  const zvijezda = Boolean(m[2]);
  return {
    baza,
    zvijezda,
    // Rep koji `destination` MORA nositi da parametar stvarno završi u putu (vidi `refOd`).
    ocekivaniRep: zvijezda ? `/:${m[3]}*` : '',
    pogada(put) {
      if (put === baza) return true;
      if (!zvijezda) return false;
      return put.startsWith(baza + '/');
    },
  };
}

/** `true`/`false` = sud, `null` = oblik koji ne znam suditi (pada zatvoreno kod pozivatelja). */
function hostPogada(uvjet, host) {
  if (!uvjet || uvjet.type !== 'host') return null;
  const v = uvjet.value;
  if (v && typeof v === 'object') return typeof v.eq === 'string' ? v.eq === host : null;
  if (typeof v === 'string') { try { return new RegExp(v).test(host); } catch (_e) { return null; } }
  return null;
}

/** Izvedi routing: vrati pravilo koje hvata (host, put), ili `null`, ili grešku suđenja. */
function usmjeri(pravila, host, put) {
  for (const p of pravila) {
    const mjera = izvorUMjeru(p.source);
    if (!mjera) return { greska: `ne znam suditi \`source\`: ${JSON.stringify(p.source)}` };
    if (!mjera.pogada(put)) continue;
    let svi = true;
    for (const u of p.has || []) {
      const r = hostPogada(u, host);
      if (r === null) return { greska: `ne znam suditi \`has\`: ${JSON.stringify(u)}` };
      if (!r) { svi = false; break; }
    }
    if (svi) return { pravilo: p };
  }
  return { pravilo: null };
}

/**
 * Razloži `destination` na ref, slug i **REP** (sve iza sluga).
 *
 * ⚠️ NALAZ REVIZIJE 23.09.: prva verzija je regex završavala **bez `$`** i rep BACALA — pa je
 * `…/functions/v1/mcp` uz `source: "/mcp/:put*"` prolazila **zeleno, 7 ✓**. Vercel neiskorišten
 * parametar ne stavlja u put nego ga zalijepi kao upit, a `@supabase/server` rutu metapodataka
 * hvata **po putu** → `/mcp/oauth-protected-resource` prestaje posluživati RFC 9728 dokument,
 * dok `/mcp` i dalje uredno odgovara. To je **doslovno kvar zbog kojeg cigla postoji**, a brana
 * ga je previđala jer je mjerila DEFINICIJU (`source` spominje podput), ne POSLJEDICU.
 */
function refOd(destination) {
  const m = String(destination).match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/functions\/v1\/([A-Za-z0-9_-]+)(.*)$/);
  return m ? { ref: m[1], slug: m[2], rep: m[3] || '' } : null;
}

function imeProjekta(ref) {
  const k = Object.keys(PROJEKTI).find((n) => PROJEKTI[n].ref === ref);
  return k || null;
}

function kljuceviStabla(v, put, van) {
  if (!v || typeof v !== 'object') return;
  if (Array.isArray(v)) { v.forEach((x, i) => kljuceviStabla(x, `${put}[${i}]`, van)); return; }
  for (const k of Object.keys(v)) { van.push({ k, put: `${put}.${k}` }); kljuceviStabla(v[k], `${put}.${k}`, van); }
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
function offline() {
  console.log('\n=== check:mcp-rewrite — javna adresa `/mcp` (vercel.json) ===\n');

  const sirovo = fs.readFileSync(VERCEL, 'utf8');
  let vercel;
  try { vercel = JSON.parse(sirovo); } catch (e) {
    console.log(`  ✗ vercel.json nije valjan JSON — ${e.message}`);
    return 1;
  }

  // ── T1: bez komentar-ključeva (ruše schema-validaciju PRIJE builda; CLAUDE pravilo #7) ────────
  const sviKljucevi = [];
  kljuceviStabla(vercel, '$', sviKljucevi);
  const komentari = sviKljucevi.filter((x) => /^(\/\/|#)/.test(x.k));
  tvrdi('T1 vercel.json bez komentar-ključeva',
    komentari.length === 0,
    `nađeni: ${komentari.map((x) => x.put).join(', ')} — Vercel na njima pada prije builda`);

  const pravila = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];

  // ── T0: doseg. Nula pravila nije uspjeh. ──────────────────────────────────────────────────────
  tvrdi('T0 ima rewrite pravila za suđenje',
    pravila.length > 0,
    'vercel.json nema nijedan `rewrites` unos — javna adresa /mcp ne postoji');
  if (!pravila.length) return 1;

  // ── T2: svaki `destination` vodi na POZNAT projekt i na funkciju koja postoji NA DISKU ────────
  const naDisku = expectedSlugs();
  const t2loše = [];
  for (const p of pravila) {
    const d = refOd(p.destination);
    if (!d) { t2loše.push(`destination nije Supabase funkcija: ${p.destination}`); continue; }
    if (!imeProjekta(d.ref)) { t2loše.push(`nepoznat ref \`${d.ref}\` u ${p.destination}`); continue; }
    if (naDisku.indexOf(d.slug) === -1) { t2loše.push(`gađa \`${d.slug}\`, koje nema u supabase/functions/ (mrtav unos)`); continue; }
    // ⚠️ Rep se sudi, ne baca (vidi `refOd`): parametar iz `source`-a mora završiti U PUTU.
    const mjera = izvorUMjeru(p.source);
    if (!mjera) { t2loše.push(`ne znam suditi \`source\`: ${JSON.stringify(p.source)}`); continue; }
    if (d.rep !== mjera.ocekivaniRep) {
      t2loše.push(`\`${p.source}\` → destination završava ${JSON.stringify(d.rep)}, a mora `
        + `${JSON.stringify(mjera.ocekivaniRep)} — inače Vercel parametar zalijepi kao UPIT i podput `
        + 'nikad ne stigne do funkcije');
    }
  }
  tvrdi('T2 destination = poznat projekt + funkcija s diska + ISPRAVAN REP',
    t2loše.length === 0, t2loše.join(' · '));

  // ── T3: `has.value` nikad goli NEUSIDREN string (vidi zaglavlje) ──────────────────────────────
  let t3 = true; const t3loše = [];
  for (const p of pravila) {
    for (const u of p.has || []) {
      if (typeof u.value === 'string' && !(u.value.startsWith('^') && u.value.endsWith('$'))) {
        t3 = false; t3loše.push(`${p.source} → ${JSON.stringify(u.value)}`);
      }
    }
  }
  tvrdi('T3 host-uvjet je `{eq}` ili USIDREN regex', t3,
    `neusidreno: ${t3loše.join(', ')} — kao regex hvata i tuđe hostove`);

  // ── T4: par je potpun — svaki (uvjet, baza) ima i golo i podput pravilo, na ISTI ref ──────────
  // Popis se NE piše rukom: grupira se ono što u datoteci stvarno piše.
  const grupe = new Map();
  for (const p of pravila) {
    const mjera = izvorUMjeru(p.source);
    if (!mjera) continue;
    const kljuc = JSON.stringify(p.has || []) + '|' + mjera.baza;
    if (!grupe.has(kljuc)) grupe.set(kljuc, { baza: mjera.baza, golo: null, podput: null });
    const g = grupe.get(kljuc);
    if (mjera.zvijezda) g.podput = p; else g.golo = p;
  }
  let t4 = true; const t4loše = [];
  for (const [, g] of grupe) {
    if (!g.golo) { t4 = false; t4loše.push(`${g.baza}: nema golo pravilo`); continue; }
    if (!g.podput) { t4 = false; t4loše.push(`${g.baza}: nema podput pravilo (\`${g.baza}${METAPODACI}\` bi 404-ao → otkrivanje prijave staje)`); continue; }
    const a = refOd(g.golo.destination); const b = refOd(g.podput.destination);
    if (!a || !b) { t4 = false; t4loše.push(`${g.baza}: destination se ne da razložiti`); continue; }
    if (a.ref !== b.ref) { t4 = false; t4loše.push(`${g.baza}: golo i podput vode na RAZLIČITE projekte`); continue; }
    // ⚠️ „Isti projekt" NIJE „ista funkcija" (nalaz revizije 23.09.): podput preusmjeren na
    // `delete-account` ima isti ref i prolazio bi zeleno, a promet s MCP podputova išao bi u
    // funkciju za brisanje računa.
    if (a.slug !== b.slug) {
      t4 = false;
      t4loše.push(`${g.baza}: golo ide na \`${a.slug}\`, a podput na \`${b.slug}\` — ista baza, DRUGA funkcija`);
    }
  }
  tvrdi(`T4 svaki par je potpun i na istoj FUNKCIJI (grupa: ${grupe.size})`, t4, t4loše.join(' · '));

  // ── T5: usmjerenje — imenovani host završi na očekivanom projektu, i na golom putu i na podputu
  let t5 = true; const t5loše = [];
  for (const u of USMJERENJE) {
    for (const put of ['/mcp', '/mcp' + METAPODACI]) {
      const r = usmjeri(pravila, u.host, put);
      if (r.greska) { t5 = false; t5loše.push(`${u.host}${put}: ${r.greska}`); continue; }
      if (!r.pravilo) { t5 = false; t5loše.push(`${u.host}${put}: nijedno pravilo ne hvata`); continue; }
      const d = refOd(r.pravilo.destination);
      const ocekivan = PROJEKTI[u.projekt] && PROJEKTI[u.projekt].ref;
      if (!d || d.ref !== ocekivan) {
        t5 = false;
        t5loše.push(`${u.host}${put}: vodi na \`${d ? d.ref : '?'}\`, a mora na \`${ocekivan}\` (${u.projekt})`);
      }
    }
  }
  tvrdi(`T5 imenovani hostovi idu na svoj projekt (${USMJERENJE.length} × 2 puta)`, t5, t5loše.join(' · '));

  // ── T6: PADA ZATVORENO — nepoznat host ne smije dobiti nijedan rewrite ────────────────────────
  let t6 = true; const t6loše = [];
  for (const b of BEZ_REWRITEA) {
    for (const put of ['/mcp', '/mcp' + METAPODACI]) {
      const r = usmjeri(pravila, b.host, put);
      if (r.greska) { t6 = false; t6loše.push(`${b.host}${put}: ${r.greska}`); continue; }
      if (r.pravilo) {
        const d = refOd(r.pravilo.destination);
        t6 = false;
        t6loše.push(`${b.host}${put} → \`${d ? d.ref : '?'}\` (${b.zasto})`);
      }
    }
  }
  tvrdi(`T6 nepoznat host ne dobiva rewrite (${BEZ_REWRITEA.length} × 2 puta)`, t6, t6loše.join(' · '));

  // ── T7: DOSEG — prazan popis ne smije prolaziti (vidi `DOSEG`) ────────────────────────────────
  const t7loše = [];
  if (USMJERENJE.length < DOSEG.usmjerenje) {
    t7loše.push(`USMJERENJE ima ${USMJERENJE.length} hostova, a mora bar ${DOSEG.usmjerenje} — T5 na praznom popisu prolazi ne mjereći ništa`);
  }
  if (BEZ_REWRITEA.length < DOSEG.bezRewritea) {
    t7loše.push(`BEZ_REWRITEA ima ${BEZ_REWRITEA.length} hostova, a mora bar ${DOSEG.bezRewritea} — T6 je jedina koja čuva „pada zatvoreno"`);
  }
  if (!Array.from(grupe.values()).some((g) => g.baza === '/mcp')) {
    t7loše.push('nijedna grupa pravila nema bazu `/mcp` — a cigla postoji zbog nje (T4 na nula grupa prolazi)');
  }
  tvrdi(`T7 doseg popisa + postoji grupa za \`/mcp\` (hostovi provjereni ${DOSEG.provjereno})`,
    t7loše.length === 0, t7loše.join(' · '));

  console.log(`\n  dotaknuto: ${pravila.length} rewrite pravila · ${grupe.size} parova · `
    + `${(USMJERENJE.length + BEZ_REWRITEA.length) * 2} (host, put) slučajeva · ${izmjereno} tvrdnji`);
  if (izmjereno !== OCEKIVANO_OFFLINE) {
    nalazi.push(`doseg: izvedeno ${izmjereno} tvrdnji, a očekivano ${OCEKIVANO_OFFLINE}`);
    console.log(`  ✗ ČEGRTALJKA — izvedeno ${izmjereno} tvrdnji, očekivano ${OCEKIVANO_OFFLINE};`
      + ' tvrdnja je nestala ili je dodana bez podizanja osnovice');
  }
  console.log('  ⓘ podudaranje hosta kako ga Vercel STVARNO radi mjeri `--zivo` na previewu.\n');
  return nalazi.length ? 1 : 0;
}

/**
 * Potpis VERCELOVE zaštite deploya (SSO), koja odgovara SAMA — prije našeg rewritea.
 *
 * ⚠️ POVOD (izmjereno 23.09., i oborilo dvije moje tvrdnje): projekt ima `ssoProtection` s
 * dosegom `all_except_custom_domains`, pa svaki `.vercel.app` host vraća **401 na `/mcp`** i
 * **302 na `/`** — a taj 401 izgleda isto kao ispravan 401 iz funkcije. Prva verzija ove brane
 * je zbog toga imala DVA lažna zelena: Z1 je prošao jer `fetch` slijedi preusmjeravanja pa je
 * izmjerio VERCELOVU STRANICU ZA PRIJAVU (200), a Z2 je prihvatio zaštitni 401 kao svoj.
 * Zaštićen deploy se NE MOŽE izmjeriti — to je izlaz **2** („nisam mogao"), ne 1 („pokvareno je").
 */
function vercelovaZastita(res) {
  const sc = String(res.headers.get('set-cookie') || '');
  const loc = String(res.headers.get('location') || '');
  if (/_vercel_sso_nonce|_vercel_jwt/.test(sc)) return 'odgovor nosi Vercelov SSO kolačić';
  if (/vercel\.com\/(sso-api|login)/.test(loc)) return `preusmjerava na Vercelovu prijavu (${loc.slice(0, 60)}…)`;
  return null;
}

/**
 * Tajna kojom se preskače Vercelova zaštita deploya („Protection Bypass for Automation").
 * Stoji u `.env` (gitignoran), NIKAD u repozitoriju. Bez nje se preview ne može izmjeriti.
 */
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';

/** Zahtjev prema NAŠOJ adresi nosi bypass; prema tuđoj (Supabase) ne — tajna se ne rasipa. */
function zahtjev(url, baza, opts) {
  const o = Object.assign({ redirect: 'manual' }, opts || {});
  if (BYPASS && String(url).startsWith(baza)) {
    o.headers = Object.assign({}, o.headers, { 'x-vercel-protection-bypass': BYPASS });
  }
  return fetch(url, o);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
async function zivo(baza) {
  console.log(`\n=== check:mcp-rewrite --zivo — ${baza} ===`);
  console.log(`    bypass-tajna: ${BYPASS ? 'JEST u .env' : 'NEMA je u .env'}\n`);
  const host = new URL(baza).hostname;
  const pravila = JSON.parse(fs.readFileSync(VERCEL, 'utf8')).rewrites || [];

  // Očekivanje se IZVODI iz istih pravila — živa provjera i offline tablica ne mogu se raziće.
  const predvid = usmjeri(pravila, host, '/mcp');
  if (predvid.greska) { console.log(`  ✗ ${predvid.greska}`); return 1; }
  const d = predvid.pravilo ? refOd(predvid.pravilo.destination) : null;

  // ── Z0: je li adresa uopće MJERLJIVA ─────────────────────────────────────────────────────────
  // Prvi zahtjev služi i kao proba zaštite. Bez ove provjere zaštićen deploy daje 401 koji se
  // ne razlikuje od ispravnog, pa bi „konektor radi" bila tvrdnja o Vercelovoj prijavnoj stranici.
  const prvi = await zahtjev(baza + '/mcp', baza, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
  });
  const zastita = vercelovaZastita(prvi);
  if (zastita) {
    console.log(`  ⊘ DEPLOY JE ZAŠTIĆEN (${zastita}).`);
    console.log('     Vercelov SSO odgovara PRIJE rewritea, pa se kroz ovu adresu ne može izmjeriti');
    console.log('     ništa o našoj funkciji — njezin 401 i ovaj imaju isti broj.');
    if (BYPASS) {
      console.log('     ⚠️ Tajna JEST poslana, a zaštita je svejedno odgovorila → tajna je kriva,');
      console.log('        opozvana, ili nije „Protection Bypass for Automation" ovog projekta.');
    } else {
      console.log('     Dodaj `VERCEL_AUTOMATION_BYPASS_SECRET=…` u `.env` (Vercel → Project →');
      console.log('     Settings → Deployment Protection → Protection Bypass for Automation).');
    }
    console.log('     NIJE nalaz o kodu.\n');
    return 2;
  }

  if (!d) {
    console.log(`  ⓘ za host \`${host}\` nijedno pravilo ne hvata → očekuje se 404, kao i prije cigle.`);
    tvrdi('Z0 host bez pravila i dalje 404', prvi.status === 404, `dobiven ${prvi.status}`);
    console.log('\n  dotaknuto: 1 tvrdnja\n');
    return nalazi.length ? 1 : 0;
  }

  console.log(`  ⓘ pravilo predviđa projekt \`${imeProjekta(d.ref)}\` (${d.ref})\n`);

  // Z1 — rewrite nije pojeo aplikaciju. `redirect: 'manual'` je OBAVEZAN: sa slijeđenjem je ova
  // tvrdnja jednom već prošla na Vercelovoj stranici za prijavu (200 od tuđeg dokumenta).
  const korijen = await zahtjev(baza + '/', baza);
  tvrdi('Z1 aplikacija se i dalje poslužuje na `/`', korijen.status === 200,
    `dobiven ${korijen.status}${korijen.headers.get('location') ? ' → ' + korijen.headers.get('location') : ''}`);

  // Z2/Z3 — prvi zahtjev bez tokena mora nositi putokaz.
  tvrdi('Z2 POST /mcp kroz našu adresu vraća 401', prvi.status === 401, `dobiven ${prvi.status}`);
  const wa = prvi.headers.get('www-authenticate') || '';
  const m = wa.match(/resource_metadata="([^"]+)"/i);
  tvrdi('Z3 401 nosi `WWW-Authenticate` s `resource_metadata`', Boolean(m),
    wa ? `zaglavlje je: ${wa}` : 'zaglavlja NEMA — tako izgleda 401 s gatewaya, ne iz funkcije');

  // Z4 — oglašeni dokument stvarno postoji i opisuje PREDVIĐENI projekt.
  if (m) {
    const meta = await zahtjev(m[1], baza);
    const ok = meta.status === 200;
    tvrdi('Z4 oglašeni `resource_metadata` vraća 200', ok, `${m[1]} → ${meta.status}`);
    if (ok) {
      const body = await meta.json();
      tvrdi('Z5 metapodaci opisuju PREDVIĐENI projekt',
        String(body.resource || '').indexOf(d.ref) !== -1,
        `resource = ${body.resource}, a pravilo vodi na ${d.ref}`);
      tvrdi('Z6 prijava se šalje na `/auth/v1` istog projekta',
        (body.authorization_servers || []).some((s) => String(s) === `https://${d.ref}.supabase.co/auth/v1`),
        `authorization_servers = ${JSON.stringify(body.authorization_servers)}`);
    }
  }

  // Z7 — PODPUT kroz NAŠU domenu. Ovo je tvrdnja zbog koje cigla postoji.
  // ⚠️ Ne smije suditi SAMO HTTP broj (nalaz revizije 23.09.): 200 s bilo čim u tijelu — recimo
  // našim `index.html` — izgledao bi jednako. Tvrdi se da je to STVARNO RFC 9728 dokument.
  const pod = await zahtjev(baza + '/mcp' + METAPODACI, baza);
  let podTijelo = null;
  if (pod.status === 200) { try { podTijelo = await pod.json(); } catch (_e) { podTijelo = null; } }
  tvrdi('Z7 podput `/mcp' + METAPODACI + '` vraća RFC 9728 dokument NAŠEG resursa',
    pod.status === 200 && podTijelo !== null && String(podTijelo.resource || '').indexOf(d.ref) !== -1,
    pod.status !== 200
      ? `dobiven ${pod.status} — rewrite ne pokriva podputove, pa otkrivanje prijave staje`
      : `200, ali tijelo nije dokument našeg resursa: ${JSON.stringify(podTijelo).slice(0, 140)}`);

  console.log(`\n  dotaknuto: ${izmjereno} tvrdnji protiv ${baza}\n`);
  if (izmjereno !== OCEKIVANO_ZIVO) {
    nalazi.push(`doseg: izvedeno ${izmjereno} živih tvrdnji, a očekivano ${OCEKIVANO_ZIVO}`);
    console.log(`  ✗ ČEGRTALJKA — izvedeno ${izmjereno}, očekivano ${OCEKIVANO_ZIVO}`);
  }
  return nalazi.length ? 1 : 0;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  const i = args.indexOf('--zivo');
  let kod;
  if (i !== -1) {
    const baza = args[i + 1];
    if (!baza || !/^https?:\/\//.test(baza)) {
      console.error('\n❌ `--zivo` traži adresu, npr. --zivo https://studymaster-git-....vercel.app\n');
      process.exit(2);
    }
    try { kod = await zivo(baza.replace(/\/+$/, '')); } catch (e) {
      // Nedostupna mreža NIJE „čisto je" → izlaz 2. ⚠️ Ali parcijalan pad mreže NE SMIJE odbaciti
      // već nađene kvarove (nalaz revizije 23.09.; kalup `check-edge-functions.js`): „nisam mogao
      // izmjeriti" vrijedi samo ako dotad ništa nije palo.
      console.error(`\n⊘ prekid mjerenja: ${e.message}`);
      if (nalazi.length) {
        console.error(`   ⚠️ ali ${nalazi.length} nalaz(a) je već nađeno prije prekida — to ostaje kvar\n`);
        process.exit(1);
      }
      console.error('');
      process.exit(2);
    }
  } else {
    kod = offline();
  }

  if (kod === 0) { console.log('✅ check:mcp-rewrite — bez nalaza\n'); process.exit(0); }
  // 2 = „nisam mogao izmjeriti" i NIKAD se ne smije stopiti s 1 = „pokvareno je".
  if (kod === 2) { console.log('⊘ check:mcp-rewrite — nije izmjereno (vidi gore)\n'); process.exit(2); }
  console.log(`\n❌ check:mcp-rewrite — ${nalazi.length} nalaza\n`);
  process.exit(1);
})();
