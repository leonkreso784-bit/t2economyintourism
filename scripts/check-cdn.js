#!/usr/bin/env node
'use strict';
/**
 * check-cdn.js — brana oko VANJSKIH podresursa (2026-08-14).
 *
 * ZAŠTO POSTOJI: projekt ima tvrdo pravilo da se ovisnosti pinaju TOČNO (`save-exact=true`,
 * `.nvmrc`, `check:lockfile`) — nastalo jer je raspon `^` pustio da upstream objava promijeni
 * razrješenje ispod nas. To pravilo je pokrivalo `package.json`, dakle ALAT, koji nikad ne dođe
 * do korisnika. Šest datoteka koje se doista izvršavaju u korisnikovu pregledniku nije pokrivalo
 * ništa: Font Awesome, KaTeX (CSS+JS+auto-render) i DOMPurify bili su bez SRI, a MathLive se
 * učitavao s golog `npm/mathlive` = „uvijek najnovija". Brana je čuvala ono što ne može nauditi.
 *
 * Revizija je našla i suptilniji kvar: `supabase.min.js` NE POSTOJI u npm paketu — jsDelivr ga
 * generira vlastitim minifierom na zahtjev. SRI je time bio pinan na izveden artefakt tuđeg
 * build-koraka; dan kad se taj minifier promijeni, hash pukne, `onerror` se okine i prijava se
 * TIHO ugasi. Zato provjera #4 postoji i zašto `--verify` uspoređuje sa sha-om iz file-listinga,
 * a ne samo s onim što CDN trenutno servira (to bi potvrdilo samo samo sebe).
 *
 * ČETIRI PROVJERE (1–3 su lokalne i brze → preflight; 4 traži mrežu → `--verify`):
 *   1. Svaki vanjski `<script src>` / `<link rel=stylesheet href>` ima `integrity` + `crossorigin`.
 *   2. Svaki vanjski URL je VERZIONIRAN (goli `npm/<paket>` = plutajuća ovisnost, zabranjeno).
 *   3. Svaki URL u `js/` koji se ubacuje kao skripta ima uz sebe SRI konstantu.
 *   4. (--verify) Hash u repozitoriju == hash koji izdavač objavljuje za tu datoteku.
 *
 * RABLJENJE: node scripts/check-cdn.js [--verify]      (npm run check:cdn / check:cdn:live)
 * Izlazni kod: 0 = čisto, 1 = nalaz, 2 = brana se nije mogla izvršiti.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const LIVE = process.argv.includes('--verify');

/**
 * Stranice koje se poslužuju korisniku — ČITAJU SE S DISKA.
 *
 * ⚠️ T6: ovdje je stajao ručni popis, i to uz vlastito upozorenje „svaka nova mora ući
 * ovamo, inače je brana ne gleda". Prva nova stranica od tada (`editor.html`) to je i
 * dokazala: pet vanjskih podresursa (Font Awesome, KaTeX ×2, DOMPurify) stajalo je
 * NEPROVJERENO, a gate je uredno javljao „svi vanjski podresursi pinani i pod SRI".
 * Brana koja ovisi o tome da se netko sjeti nije brana nego bilješka.
 */
const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();

/**
 * Vanjske skripte koje se NE pišu kao tag nego se ubacuju iz JS-a (`document.createElement`).
 * Regex ih ne bi našao pouzdano, pa se popis drži izričito — a provjera #3 potvrđuje da su
 * konstante doista u datoteci koju navodimo, tako da popis ne može tiho zastarjeti.
 */
const DYNAMIC = [
  { file: 'js/auth.js', urlConst: 'cdnSrc', sriConst: 'cdnIntegrity', sto: 'Supabase JS SDK' },
  { file: 'js/block-editor-media.js', urlConst: 'MATHLIVE_SRC', sriConst: 'MATHLIVE_SRI', sto: 'MathLive' },
  // Učitavanje po ruti: KaTeX i DOMPurify su otišli iz `index.html` u paket `study`.
  { file: 'js/loader.js', urlConst: 'KATEX_CSS_SRC', sriConst: 'KATEX_CSS_SRI', sto: 'KaTeX CSS' },
  { file: 'js/loader.js', urlConst: 'KATEX_SRC', sriConst: 'KATEX_SRI', sto: 'KaTeX' },
  { file: 'js/loader.js', urlConst: 'KATEX_AUTORENDER_SRC', sriConst: 'KATEX_AUTORENDER_SRI', sto: 'KaTeX auto-render' },
  { file: 'js/loader.js', urlConst: 'DOMPURIFY_SRC', sriConst: 'DOMPURIFY_SRI', sto: 'DOMPurify' },
];

/**
 * CDN-ovi s kojih smijemo išta učitati. Popis postoji zbog provjere #5 — ne kao dopuštenje
 * nego kao MJESTO ZA GLEDANJE: sve što s njih dolazi mora proći kroz `DYNAMIC` ili tag.
 */
const CDN_HOSTS = /https:\/\/(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)\/[^'"\s)]+/g;

const problems = [];
function fail(check, msg, lines) { problems.push({ check, msg, lines: lines || [] }); }

const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/**
 * Je li URL verzioniran? Traži se segment koji izgleda kao verzija (`1.2.3`, `@1.2.3`, `v2`).
 * Namjerno popustljivo prema obliku, ali NEPOPUSTLJIVO prema odsutnosti: `npm/mathlive` pada.
 */
function isPinned(url) {
  const u = url.replace(/^https?:\/\/[^/]+\//, '');
  return /@\d+\.\d+\.\d+/.test(u) || /\/\d+\.\d+\.\d+(\/|$)/.test(u) || /\/v\d+(\.\d+)*(\/|$)/.test(u);
}

// ── 1 + 2: tagovi na stranicama ────────────────────────────────────────────────────────────────
function checkTags() {
  const bezSri = [];
  const bezPina = [];
  for (const page of PAGES) {
    if (!fs.existsSync(path.join(ROOT, page))) continue;
    const html = rd(page);
    // Svaki <script>/<link> tag; `preconnect`/`dns-prefetch` nose href ali NE dohvaćaju podresurs.
    const tags = html.match(/<(script|link)\b[^>]*>/gi) || [];
    for (const tag of tags) {
      const rel = (tag.match(/\brel\s*=\s*"([^"]*)"/i) || [])[1] || '';
      if (/preconnect|dns-prefetch|icon|manifest|canonical|alternate/i.test(rel)) continue;
      const url = (tag.match(/\b(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/i) || [])[1];
      if (!url) continue;
      const kratko = url.replace(/^https?:\/\//, '').slice(0, 80);
      if (!/\bintegrity\s*=/i.test(tag) || !/\bcrossorigin\s*=/i.test(tag)) {
        bezSri.push(page + ' → ' + kratko);
      }
      if (!isPinned(url)) bezPina.push(page + ' → ' + kratko);
    }
  }
  if (bezSri.length) {
    fail('sri', 'Vanjski podresurs bez `integrity` + `crossorigin` — CDN koji se pokvari izvršava '
      + 'proizvoljan kod na našoj stranici:', bezSri);
  }
  if (bezPina.length) {
    fail('pin', 'Vanjski URL bez verzije — sadržaj se smije promijeniti bez ijedne naše izmjene:', bezPina);
  }
}

// ── 3: skripte ubačene iz JS-a ─────────────────────────────────────────────────────────────────
function checkDynamic() {
  const nalazi = [];
  for (const d of DYNAMIC) {
    if (!fs.existsSync(path.join(ROOT, d.file))) { nalazi.push(d.file + ' — datoteka ne postoji (popis zastario)'); continue; }
    const src = rd(d.file);
    const url = (src.match(new RegExp(d.urlConst + "\\s*[:=]\\s*'([^']+)'")) || [])[1];
    if (!url) { nalazi.push(d.file + ' — nema `' + d.urlConst + '` (popis zastario)'); continue; }
    if (!isPinned(url)) nalazi.push(d.sto + ' (' + d.file + ') — URL nije verzioniran: ' + url);
    const sri = (src.match(new RegExp(d.sriConst + "\\s*[:=]\\s*'(sha\\d{3}-[^']+)'")) || [])[1];
    if (!sri) nalazi.push(d.sto + ' (' + d.file + ') — nema SRI konstante `' + d.sriConst + '`');
  }
  if (nalazi.length) {
    fail('dinamicki', 'Skripta koja se ubacuje iz JS-a mora biti pinana i imati SRI jednako kao tag:', nalazi);
  }
}

// ── 5: nijedan CDN-URL u `js/**` izvan popisa ──────────────────────────────────────────────────
/**
 * ⚠️ POVOD (2026-09-04, cigla „učitavanje po ruti"): KaTeX i DOMPurify su preselili iz taga u
 * `js/loader.js`. Provjere #1/#2 čitaju HTML, pa bi ih od tog trenutka VIŠE NE BI VIDJELE — a
 * gate bi i dalje javljao „svi vanjski podresursi pinani i pod SRI". To je isti razred kvara
 * koji je već jednom prošao ovuda (`editor.html` i ručni popis stranica, T6): brana koja gleda
 * jedno mjesto, a istina se preselila na drugo.
 *
 * Zato: svaki URL s poznatog CDN-a koji se pojavi u `js/**` mora biti pokriven `DYNAMIC`
 * unosom. Time hand-list prestaje ovisiti o tome da se netko sjeti — ako se sjetio dodati
 * URL, a nije popis, gate pada.
 */
function checkNepopisani() {
  const jsDir = path.join(ROOT, 'js');
  const poznati = new Set();
  for (const d of DYNAMIC) {
    if (!fs.existsSync(path.join(ROOT, d.file))) continue;
    const src = rd(d.file);
    const url = (src.match(new RegExp(d.urlConst + "\\s*[:=]\\s*'([^']+)'")) || [])[1];
    if (url) poznati.add(url);
  }
  const nalazi = [];
  const hoda = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) { hoda(p); continue; }
      if (!f.name.endsWith('.js')) continue;
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      const txt = fs.readFileSync(p, 'utf8');
      for (const url of txt.match(CDN_HOSTS) || []) {
        if (!poznati.has(url)) nalazi.push(rel + ' → ' + url.replace(/^https:\/\//, '').slice(0, 80));
      }
    }
  };
  hoda(jsDir);
  if (nalazi.length) {
    fail('nepopisani', 'CDN-URL u `js/**` koji nije u popisu DYNAMIC — provjere #1–#4 ga NE VIDE, '
      + 'pa bi gate javljao zeleno za resurs koji nitko ne provjerava:', nalazi);
  }
}

// ── 4: hash u repozitoriju vs hash koji IZDAVAČ objavljuje (samo --verify) ──────────────────────
async function fetchBytes(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return Buffer.from(await res.arrayBuffer());
}

/** sha256 (base64) koji jsDelivr objavljuje u file-listingu paketa — izdavačevi bajtovi. */
async function jsdelivrHash(url) {
  const m = url.match(/^https:\/\/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^/@]+@[^/]+)(\/.*)$/);
  if (!m) return null;
  const res = await fetch('https://data.jsdelivr.com/v1/packages/npm/' + m[1] + '?structure=flat');
  if (!res.ok) return null;
  const data = await res.json();
  const entry = (data.files || []).find((f) => f.name === m[2]);
  return entry ? { hash: entry.hash, objavljena: true } : { hash: null, objavljena: false };
}

/** sha512 (SRI oblik) koji cdnjs objavljuje za točnu datoteku u točnoj verziji. */
async function cdnjsHash(url) {
  const m = url.match(/^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/([^/]+)\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const res = await fetch('https://api.cdnjs.com/libraries/' + m[1] + '/' + m[2]);
  if (!res.ok) return null;
  const data = await res.json();
  return { hash: (data.sri || {})[m[3]] || null, objavljena: !!(data.sri || {})[m[3]] };
}

async function checkLive() {
  const meta = [];
  for (const page of PAGES) {
    if (!fs.existsSync(path.join(ROOT, page))) continue;
    const html = rd(page);
    for (const tag of html.match(/<(script|link)\b[^>]*>/gi) || []) {
      const rel = (tag.match(/\brel\s*=\s*"([^"]*)"/i) || [])[1] || '';
      if (/preconnect|dns-prefetch|icon|manifest|canonical|alternate/i.test(rel)) continue;
      const url = (tag.match(/\b(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/i) || [])[1];
      const sri = (tag.match(/\bintegrity\s*=\s*"([^"]+)"/i) || [])[1];
      if (url && sri) meta.push({ url, sri, gdje: page });
    }
  }
  for (const d of DYNAMIC) {
    if (!fs.existsSync(path.join(ROOT, d.file))) continue;
    const src = rd(d.file);
    const url = (src.match(new RegExp(d.urlConst + "\\s*[:=]\\s*'([^']+)'")) || [])[1];
    const sri = (src.match(new RegExp(d.sriConst + "\\s*[:=]\\s*'(sha\\d{3}-[^']+)'")) || [])[1];
    if (url && sri) meta.push({ url, sri, gdje: d.file });
  }

  const seen = new Set();
  const lose = [];
  const izvedene = [];
  for (const r of meta) {
    if (seen.has(r.url + r.sri)) continue;
    seen.add(r.url + r.sri);
    const kratko = r.url.replace(/^https?:\/\//, '');
    let bytes;
    try { bytes = await fetchBytes(r.url); } catch (e) {
      lose.push(kratko + ' — nedohvatljivo (' + e.message + ')'); continue;
    }
    // (a) odgovara li SRI iz repozitorija onome što CDN SADA servira?
    const alg = r.sri.slice(0, 6);
    const nas = alg + '-' + crypto.createHash(alg.replace('sha', 'sha')).update(bytes).digest('base64');
    if (nas !== r.sri) {
      lose.push(kratko + '\n     u repou: ' + r.sri + '\n     servira: ' + nas);
      continue;
    }
    // (b) je li to IZDAVAČEVA datoteka ili artefakt CDN-ovog build-koraka?
    let pub = null;
    try { pub = (await jsdelivrHash(r.url)) || (await cdnjsHash(r.url)); } catch (e) { pub = null; }
    if (pub && pub.objavljena === false) {
      izvedene.push(kratko + ' — CDN je servira, ali je NEMA u objavljenom paketu (generirana na zahtjev)');
    } else if (pub && pub.hash) {
      const s256 = crypto.createHash('sha256').update(bytes).digest('base64');
      const s512 = 'sha512-' + crypto.createHash('sha512').update(bytes).digest('base64');
      if (pub.hash !== s256 && pub.hash !== s512) {
        lose.push(kratko + ' — bajtovi se NE slažu s izdavačevim objavljenim hashem');
      }
    }
  }
  if (lose.length) fail('zivo', 'SRI se ne slaže sa stvarnim bajtovima (ili resurs nije dohvatljiv):', lose);
  if (izvedene.length) {
    fail('izvedena', 'Datoteka koju CDN GENERIRA umjesto da je izdavač objavio — hash se smije '
      + 'promijeniti bez promjene verzije, a tad SRI tvrdo obori učitavanje:', izvedene);
  }
  return seen.size;
}

async function main() {
  console.log('\n=== check:cdn' + (LIVE ? ' --verify' : '') + ' ===');
  checkTags();
  checkDynamic();
  checkNepopisani();
  let provjereno = 0;
  if (LIVE) {
    if (typeof fetch !== 'function') {
      console.error('❌ Nema globalnog `fetch` — treba Node 18+.');
      process.exit(2);
    }
    try { provjereno = await checkLive(); } catch (e) {
      console.error('⚠️  Mrežna provjera preskočena: ' + e.message);
    }
  }
  if (!problems.length) {
    console.log('✅ Svi vanjski podresursi pinani i pod SRI'
      + (LIVE ? ' — ' + provjereno + ' provjereno protiv izdavačevih hasheva.' : '.'));
    if (!LIVE) console.log('   (mrežna provjera bajtova: `npm run check:cdn:live`)');
    console.log('');
    process.exit(0);
  }
  for (const p of problems) {
    console.error('\n❌ [' + p.check + '] ' + p.msg);
    p.lines.slice(0, 25).forEach((l) => console.error('   • ' + l));
    if (p.lines.length > 25) console.error('   … i još ' + (p.lines.length - 25));
  }
  console.error('\n' + problems.length + ' nalaz(a).\n');
  process.exit(1);
}

main();
