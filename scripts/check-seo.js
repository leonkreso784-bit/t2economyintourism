#!/usr/bin/env node
/**
 * check-seo — ono što tražilica i pretpregled linka VIDE (2026-08-24)
 *
 * ── ZAŠTO ────────────────────────────────────────────────────────────────────────
 * Zatečeno stanje: `meta description` je platformu opisivao kao ispitnu pripremu za
 * **jedan smjer jednog fakulteta**, `og:image` je bio **kvadratna ikona 512×512**
 * (umjesto 1200×630), a `robots.txt` i `sitemap.xml` **nisu postojali**. Ništa od toga
 * nije mjerila nijedna brana, jer nijedna nije gledala `<head>`.
 *
 * ⚠️ **POPIS STRANICA SE ČITA S DISKA, NE PIŠE RUČNO.** Projekt je isto pravilo već
 * platio dvaput u T6: `check:cdn` i `check:tailwind` imali su ručne popise i prva nova
 * stranica (`editor.html`) ih je pregazila. *Brana koja ovisi o tome da se netko sjeti
 * nije brana nego bilješka.* Zato se i `sitemap.xml` ovdje **generira**, ne održava.
 *
 * ── ŠTO SE MJERI ─────────────────────────────────────────────────────────────────
 *   ① SITEMAP   sadrži TOČNO one stranice koje su indeksabilne (nema `noindex`)
 *   ② ROBOTS    postoji i imenuje sitemap
 *   ③ HEAD      `index.html` ima naslov, opis, canonical i pun OG/Twitter set
 *   ④ DULJINE   naslov ≤ 60, opis ≤ 160 znakova (inače ih tražilica reže)
 *   ⑤ JEDNA PRIČA  `og:title` == `<title>`, `twitter:description` == `description`
 *   ⑥ KARTICA   `og:image` postoji na disku i stvarno je 1200×630
 *
 * ⑤ postoji jer je zatečeno stanje imalo TRI različita opisa (`description`,
 * `og:description`, `twitter:description`) — svaki je govorio malo drugačije, i svaki
 * bi se pri sljedećoj izmjeni razišao još malo. *Ako je jedna priča, mora biti jedan
 * tekst.*
 *
 * Bez mreže i bez preglednika → **u preflightu**.
 *
 *   node scripts/check-seo.js            # provjeri
 *   node scripts/check-seo.js --write    # regeneriraj sitemap.xml iz stanja na disku
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://www.sokratstudy.com/';
const WRITE = process.argv.includes('--write');

let greske = 0;
const ok = (m) => console.log('  ✓ ' + m);
const fail = (m) => { greske++; console.log('  ✗ ' + m); };

/** Stranice u korijenu koje tražilica smije indeksirati. */
function indeksabilne() {
  return fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => {
      const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
      // `noindex` bilo gdje u `<head>` isključuje stranicu (editor.html).
      return !/name=["']robots["'][^>]*noindex|noindex[^>]*name=["']robots["']/i.test(html);
    })
    .sort();
}

/** URL kakav ide u sitemap: `index.html` je korijen, ostalo zadržava ime. */
const urlZa = (f) => BASE + (f === 'index.html' ? '' : f);

function metaIz(html, atribut, ime) {
  const re = new RegExp('<meta\\s+' + atribut + '=["\']' + ime.replace(/:/g, ':') +
    '["\']\\s+content=["\']([^"\']*)["\']', 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

/** Dimenzije PNG-a iz zaglavlja (IHDR) — bez ijedne ovisnosti. */
function pngDim(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function sitemapXml(stranice) {
  const url = (f) => '  <url>\n    <loc>' + urlZa(f) + '</loc>\n  </url>';
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!-- GENERIRANO — ne uređuj ručno. Izvor: stanje na disku → node scripts/check-seo.js --write\n' +
    '     Namjerno BEZ <lastmod>: datum koji nitko ne održava je datum koji laže, a\n' +
    '     tražilica ga tada ionako ignorira.\n' +
    '     Namjerno BEZ hash-ruta (#/subject/...): fragment nije zaseban URL za tražilicu,\n' +
    '     pa bi ih navesti značilo prijaviti stranice koje ne postoje. -->\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    stranice.map(url).join('\n') + '\n</urlset>\n';
}

console.log('\n=== check:seo — što vide tražilica i pretpregled linka ===\n');

const stranice = indeksabilne();
console.log('   indeksabilnih stranica na disku: ' + stranice.length +
  '  (' + stranice.join(', ') + ')\n');

// ── ① SITEMAP ────────────────────────────────────────────────────────────────────
const smPath = path.join(ROOT, 'sitemap.xml');
if (WRITE) {
  fs.writeFileSync(smPath, sitemapXml(stranice), 'utf8');
  console.log('  ✎ sitemap.xml regeneriran (' + stranice.length + ' URL-ova)\n');
}
if (!fs.existsSync(smPath)) {
  fail('sitemap.xml ne postoji — pokreni `node scripts/check-seo.js --write`');
} else {
  const sm = fs.readFileSync(smPath, 'utf8');
  const uSitemapu = (sm.match(/<loc>([^<]+)<\/loc>/g) || [])
    .map((x) => x.replace(/<\/?loc>/g, '')).sort();
  const ocekivano = stranice.map(urlZa).sort();
  const visak = uSitemapu.filter((u) => ocekivano.indexOf(u) === -1);
  const manjak = ocekivano.filter((u) => uSitemapu.indexOf(u) === -1);
  if (visak.length) fail('sitemap navodi stranicu koje nema (ili je noindex): ' + visak.join(', '));
  if (manjak.length) fail('sitemap NE navodi indeksabilnu stranicu: ' + manjak.join(', '));
  if (!visak.length && !manjak.length) ok('sitemap.xml se poklapa s diskom (' + uSitemapu.length + ' URL-ova)');
}

// ── ② ROBOTS ─────────────────────────────────────────────────────────────────────
const robotsPath = path.join(ROOT, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fail('robots.txt ne postoji');
} else {
  const r = fs.readFileSync(robotsPath, 'utf8');
  if (r.indexOf('Sitemap:') === -1) fail('robots.txt ne imenuje sitemap');
  else ok('robots.txt postoji i imenuje sitemap');
  // ⚠️ `Disallow` na stranici koja nosi `noindex` je KONTRAPRODUKTIVAN: zabrani li se
  // obilazak, robot nikad ne pročita `noindex` — pa stranica može ostati u indeksu.
  if (/^\s*Disallow:\s*\/editor\.html/mi.test(r)) {
    fail('robots.txt zabranjuje `editor.html`, a ta stranica nosi `noindex` — ' +
      'zabrana obilaska SPRJEČAVA čitanje noindexa. Ukloni Disallow.');
  }
}

// ── ③–⑥ HEAD ─────────────────────────────────────────────────────────────────────
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const naslov = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
const opis = metaIz(html, 'name', 'description');
const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/) || [])[1];
const og = {
  title: metaIz(html, 'property', 'og:title'),
  description: metaIz(html, 'property', 'og:description'),
  image: metaIz(html, 'property', 'og:image'),
  url: metaIz(html, 'property', 'og:url'),
  type: metaIz(html, 'property', 'og:type')
};
const tw = {
  card: metaIz(html, 'name', 'twitter:card'),
  title: metaIz(html, 'name', 'twitter:title'),
  description: metaIz(html, 'name', 'twitter:description'),
  image: metaIz(html, 'name', 'twitter:image')
};

const obavezno = { '<title>': naslov, 'description': opis, 'canonical': canonical,
  'og:title': og.title, 'og:description': og.description, 'og:image': og.image,
  'og:url': og.url, 'og:type': og.type, 'twitter:card': tw.card,
  'twitter:title': tw.title, 'twitter:description': tw.description, 'twitter:image': tw.image };
const prazno = Object.keys(obavezno).filter((k) => !obavezno[k]);
if (prazno.length) fail('index.html nema: ' + prazno.join(', '));
else ok('index.html ima pun set (naslov, opis, canonical, OG, Twitter)');

if (naslov && naslov.length > 60) fail('<title> je ' + naslov.length + ' znakova — tražilica reže na ~60');
else if (naslov) ok('<title> ' + naslov.length + ' znakova');
if (opis && opis.length > 160) fail('description je ' + opis.length + ' znakova — reže se na ~160');
else if (opis) ok('description ' + opis.length + ' znakova');

if (naslov && og.title && naslov !== og.title) {
  fail('`og:title` se razišao s `<title>` — jedna priča, jedan tekst');
} else if (naslov) ok('`og:title` == `<title>`');
if (opis && tw.description && opis !== tw.description) {
  fail('`twitter:description` se razišao s `description` — jedna priča, jedan tekst');
} else if (opis) ok('`twitter:description` == `description`');

// ⑥ kartica
if (og.image) {
  const rel = og.image.replace(BASE, '').replace(/^\//, '');
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    fail('`og:image` pokazuje na ' + rel + ', a te datoteke nema u repozitoriju');
  } else {
    const d = pngDim(p);
    if (!d) fail(rel + ' nije PNG koji umijem pročitati');
    else if (d.w !== 1200 || d.h !== 630) {
      fail('`og:image` je ' + d.w + '×' + d.h + ' — mreže traže 1200×630 ' +
        '(regeneriraj: node scripts/build-og-image.js)');
    } else ok('`og:image` ' + rel + ' je 1200×630');
  }
}

// ── ⑦ STRUKTURIRANI PODACI ───────────────────────────────────────────────────────
// Mjeri se da BLOK PARSIRA, ne da postoji: neispravan JSON-LD tražilica tiho odbaci,
// pa bi „ima ga" bila tvrdnja koja prolazi i nad pokvarenim blokom. Sadržaj se ne
// propisuje osim `@type`/`name` — shema smije rasti, ali ne smije puknuti.
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!ld) {
  fail('index.html nema JSON-LD blok');
} else {
  try {
    const o = JSON.parse(ld[1]);
    if (!o['@type'] || !o.name) fail('JSON-LD nema `@type` ili `name`');
    else ok('JSON-LD parsira (' + o['@type'] + ')');
  } catch (e) {
    fail('JSON-LD ne parsira — tražilica bi ga tiho odbacila: ' + e.message);
  }
}

console.log('\n' + (greske === 0
  ? '✅ čisto — tražilica i pretpregled vide ono što smo namjeravali.\n'
  : '❌ ' + greske + ' problem(a).\n'));
process.exit(greske === 0 ? 0 : 1);
