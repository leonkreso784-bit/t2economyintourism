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
// `https://studymaster.vercel.app` vraća **200** i to je ŽIVA PRODUKCIJSKA adresa koja nije `www`
// — pod tim bi pravilom produkcijska adresa posluživala `/mcp` iz test-baze. Zato su hostovi
// IMENOVANI, a nepoznat host ne dobiva rewrite i ostaje 404: pada zatvoreno.
//
// ─── GRANICA KOJU OVA BRANA NE MJERI (imenovano, ne prešućeno) ──────────────────────────────────
// 1. Sufiks `/oauth-protected-resource` dolazi iz tuđeg paketa koji NIJE naša ovisnost (Deno ga
//    povlači pri deployu), pa ga offline ne možemo nabrojati iz izvora — stoji kao konstanta s
//    razlogom. Mjeri ga `--zivo`, protiv stvarnog poslužitelja.
// 2. Podudara li Vercel `has.type=host` točno onako kako ovdje simuliram — to offline ne može
//    dokazati nijedna tvrdnja. Zato `--zivo` postoji i zato je preview dio cigle, a ne ukras.

const fs = require('fs');
const path = require('path');

const { PROJEKTI } = require('./deploy-function.js');
const { expectedSlugs } = require('./check-edge-functions.js');

const ROOT = path.join(__dirname, '..');
const VERCEL = path.join(ROOT, 'vercel.json');

/** Sufiks na kojem `@supabase/server` poslužuje RFC 9728 dokument. Vidi granicu 1 u zaglavlju. */
const METAPODACI = '/oauth-protected-resource';

/** Javne adrese koje izlažemo i projekt koji iza njih stoji. */
const USMJERENJE = [
  {
    host: 'www.sokratstudy.com',
    projekt: 'prod',
    zasto: 'jedina prava adresa platforme; `mcp` ondje živi tek od F7',
  },
  {
    host: 'studymaster-git-feat-f6-mcp-sokrat.vercel.app',
    projekt: 'staging',
    zasto: 'preview grane — oblik `<projekt>-git-<grana>-<tim>.vercel.app`',
  },
  {
    host: 'studymaster-9f2c1ab7x-sokrat.vercel.app',
    projekt: 'staging',
    zasto: 'preview pojedinog deploya — oblik `<projekt>-<hash>-<tim>.vercel.app`',
  },
];

/** Hostovi koji NE SMIJU dobiti rewrite. Ovo je tvrdnja da pravilo pada ZATVORENO. */
const BEZ_REWRITEA = [
  {
    host: 'studymaster.vercel.app',
    zasto: 'ŽIVI produkcijski `.vercel.app` alias (izmjereno 23.09.: HTTP 200), a nije `www` — '
      + 'pod catch-all pravilom bi produkcijska adresa gađala TEST-BAZU',
  },
  {
    host: 'sokratstudy.com',
    zasto: 'apex; Vercel ga 307-a na `www` prije routinga (izmjereno), pa ovdje nema što raditi',
  },
  {
    host: 'www-sokratstudy-com.napadac.example',
    zasto: 'KONTROLA za goli string u `has.value`: kao regex bez sidara zadovoljio bi ga i ovaj host',
  },
];

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

function refOd(destination) {
  const m = String(destination).match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/functions\/v1\/([A-Za-z0-9_-]+)/);
  return m ? { ref: m[1], slug: m[2] } : null;
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
  let t2 = true;
  for (const p of pravila) {
    const d = refOd(p.destination);
    if (!d) { t2 = false; nalazi.push(`destination nije Supabase funkcija: ${p.destination}`); continue; }
    if (!imeProjekta(d.ref)) { t2 = false; nalazi.push(`nepoznat ref \`${d.ref}\` u ${p.destination}`); continue; }
    if (naDisku.indexOf(d.slug) === -1) { t2 = false; nalazi.push(`rewrite gađa \`${d.slug}\`, koje nema u supabase/functions/ (mrtav unos)`); }
  }
  tvrdi('T2 svaki destination = poznat projekt + funkcija s diska', t2, nalazi[nalazi.length - 1] || '');

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
    if (!a || !b || a.ref !== b.ref) { t4 = false; t4loše.push(`${g.baza}: golo i podput vode na RAZLIČITE projekte`); }
  }
  tvrdi(`T4 svaki par je potpun i na istom projektu (grupa: ${grupe.size})`, t4, t4loše.join(' · '));

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

  console.log(`\n  dotaknuto: ${pravila.length} rewrite pravila · ${grupe.size} parova · `
    + `${(USMJERENJE.length + BEZ_REWRITEA.length) * 2} (host, put) slučajeva · ${izmjereno} tvrdnji`);
  console.log('  ⓘ podudaranje hosta kako ga Vercel STVARNO radi mjeri `--zivo` na previewu.\n');
  return nalazi.length ? 1 : 0;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
async function zivo(baza) {
  console.log(`\n=== check:mcp-rewrite --zivo — ${baza} ===\n`);
  const host = new URL(baza).hostname;
  const pravila = JSON.parse(fs.readFileSync(VERCEL, 'utf8')).rewrites || [];

  // Očekivanje se IZVODI iz istih pravila — živa provjera i offline tablica ne mogu se raziće.
  const predvid = usmjeri(pravila, host, '/mcp');
  if (predvid.greska) { console.log(`  ✗ ${predvid.greska}`); return 1; }
  const d = predvid.pravilo ? refOd(predvid.pravilo.destination) : null;

  if (!d) {
    console.log(`  ⓘ za host \`${host}\` nijedno pravilo ne hvata → očekuje se 404, kao i prije cigle.`);
    const r = await fetch(baza + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    tvrdi('Z0 host bez pravila i dalje 404', r.status === 404, `dobiven ${r.status}`);
    console.log(`\n  dotaknuto: 1 tvrdnja\n`);
    return nalazi.length ? 1 : 0;
  }

  console.log(`  ⓘ pravilo predviđa projekt \`${imeProjekta(d.ref)}\` (${d.ref})\n`);

  // Z1 — rewrite nije pojeo aplikaciju.
  const korijen = await fetch(baza + '/');
  tvrdi('Z1 aplikacija se i dalje poslužuje na `/`', korijen.status === 200, `dobiven ${korijen.status}`);

  // Z2/Z3 — prvi zahtjev bez tokena mora nositi putokaz.
  const prvi = await fetch(baza + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  tvrdi('Z2 POST /mcp kroz našu adresu vraća 401', prvi.status === 401, `dobiven ${prvi.status}`);
  const wa = prvi.headers.get('www-authenticate') || '';
  const m = wa.match(/resource_metadata="([^"]+)"/i);
  tvrdi('Z3 401 nosi `WWW-Authenticate` s `resource_metadata`', Boolean(m),
    wa ? `zaglavlje je: ${wa}` : 'zaglavlja NEMA — tako izgleda 401 s gatewaya, ne iz funkcije');

  // Z4 — oglašeni dokument stvarno postoji i opisuje PREDVIĐENI projekt.
  if (m) {
    const meta = await fetch(m[1], { redirect: 'manual' });
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
  const pod = await fetch(baza + '/mcp' + METAPODACI, { redirect: 'manual' });
  tvrdi('Z7 podput `/mcp' + METAPODACI + '` prolazi kroz rewrite', pod.status === 200,
    `dobiven ${pod.status} — rewrite ne pokriva podputove, pa otkrivanje prijave staje`);

  console.log(`\n  dotaknuto: ${izmjereno} tvrdnji protiv ${baza}\n`);
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
      // Nedostupna mreža NIJE „čisto je". Izlaz 2 = nisam mogao izmjeriti.
      console.error(`\n⊘ nisam mogao izmjeriti: ${e.message}\n`);
      process.exit(2);
    }
  } else {
    kod = offline();
  }

  if (kod === 0) { console.log('✅ check:mcp-rewrite — bez nalaza\n'); process.exit(0); }
  console.log(`\n❌ check:mcp-rewrite — ${nalazi.length} nalaza\n`);
  process.exit(1);
})();
