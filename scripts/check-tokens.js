#!/usr/bin/env node
/**
 * check:tokens — svaka `var(--x)` u `css/**` mora imati definiciju.
 *
 * ── ZAŠTO OVA BRANA POSTOJI (MREŽA B1, 2026-08-31) ───────────────────────────
 * `--border-color` se koristio 11 puta, a definiran nije bio NIGDJE — deset puta uz
 * fallback `#334155`. `var()` s fallbackom IZGLEDA kao tematiziranost, a bez definicije
 * je samo zakucana vrijednost s ukrasom: na svijetloj zadanoj temi crtao se rub iz
 * STARE TAMNE palete, i to na cijelom profilu/admin sučelju. Isti mehanizam je prije
 * toga već dvaput izmjeren i popravljen ručno (`--card-bg` → kontrast **1.43** u
 * chalk/mint; `--grad` → jedno od fatalnih pravila palete), svaki put SLUČAJNIM
 * nalazom. `check:palette` ovaj razred ne vidi jer ne traži vrijednosti stare palete
 * nego rupu: kvar nije ono što piše, nego ono što NE piše.
 *
 * ── ŠTO SE SMATRA DEFINICIJOM ────────────────────────────────────────────────
 *   • `--x:` u `css/**` (bez komentara i stringova; `tokens.static.css` se preskače
 *     jer je generirano zrcalo `tokens.css` — build:css);
 *   • `--x:` u `js/**` ili u `*.html` — varijable koje nastaju u RUNTIMEU inline
 *     stilom (`--dot`, `--card-accent`, `--lb-acc`, `--sw`…) ili `setProperty`-jem.
 *     Ove se broje i ispisuju ODVOJENO, da se vidi koliko definicija stoji na
 *     string-uzorku umjesto na CSS-u.
 *
 * ── GRANICE MJERE (svaki mjerač mora reći svoje) ─────────────────────────────
 *   • `var(--x)` sastavljen u JS-u (npr. u style-stringu renderera) NIJE u dosegu —
 *     mjere se samo upotrebe u `css/**`.
 *   • JS/HTML definicije se love string-uzorkom `--x:`, bez parsiranja — spomen u
 *     JS-komentaru s dvotočkom mogao bi lažno „definirati" varijablu. Zato ispis
 *     runtime-definicija postoji: ako se ondje pojavi ime koje nitko ne postavlja,
 *     to je mjesto gdje će se vidjeti.
 *
 * ── ZAŠTO ČEGRTALJKA S IMENOVANOM OSNOVICOM ──────────────────────────────────
 * Dio zatečenog je svjesno OSTAVLJEN i ne smije se popraviti napamet:
 *   • `--danger-bg` — fallback `#7f1d1d` uvijek gori; boja je presuda BLOKA C
 *     (ADR-032: semantika = puna ispuna, tinta po temi), ne usputni popravak;
 *   • `--font-mono` / `--font-serif` — fallback-stack uvijek gori; definirati ih
 *     znači presuditi tipografiju editora, a to je odluka redizajna (C5b+).
 * Osnovica ta imena IMENUJE (`scripts/tokens-baseline.json`), pa je iznimka vidljiva.
 * Novo nedefinirano ime = pad. Ime iz osnovice koje više ne postoji = uputa da se
 * osnovica spusti. `--update` ju prepisuje.
 *
 * RABLJENJE:  node scripts/check-tokens.js [--update]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OSNOVICA = path.join(__dirname, 'tokens-baseline.json');

/* Generirano se preskače: `tokens.static.css` emitira build:css iz `tokens.css`,
   pa bi njegove upotrebe/definicije bile druga kopija istog izvora. */
const GENERIRANO = new Set(['tokens.static.css']);

function cssDatoteke() {
  const out = [];
  const dir = path.join(ROOT, 'css');
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.css') && !GENERIRANO.has(f)) out.push(path.join('css', f));
  }
  const rd = path.join(dir, 'responsive');
  if (fs.existsSync(rd)) for (const f of fs.readdirSync(rd)) {
    if (f.endsWith('.css')) out.push(path.join('css', 'responsive', f));
  }
  return out.sort();
}

/* Bez komentara i stringova — `--card-bg` i `--grad` žive u KOMENTARIMA kao povijest
   vlastitog popravka, i prva verzija ovog mjerila ih je lažno prijavila. */
function ocisti(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/url\([^)]*\)/g, ' ')
    .replace(/"[^"]*"/g, ' ')
    .replace(/'[^']*'/g, ' ');
}

function jsHtmlIzvori() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) out.push(f);
  const hoda = (rel) => {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return;
    for (const f of fs.readdirSync(abs)) {
      const r = path.join(rel, f);
      if (fs.statSync(path.join(ROOT, r)).isDirectory()) hoda(r);
      else if (/\.(js|html)$/.test(f)) out.push(r);
    }
  };
  hoda('js');
  return out;
}

/* ── upotrebe u css/** ── */
const upotrebe = new Map(); // ime -> [gdje…]
const cssPopis = cssDatoteke();
for (const rel of cssPopis) {
  const redci = fs.readFileSync(path.join(ROOT, rel), 'utf8').split(/\r?\n/);
  /* čišćenje po retku: višeredni komentar se prati ručno da brojevi redaka ostanu točni */
  let uKomentaru = false;
  redci.forEach((linija, i) => {
    let s = linija;
    if (uKomentaru) {
      const kraj = s.indexOf('*/');
      if (kraj < 0) return;
      s = s.slice(kraj + 2);
      uKomentaru = false;
    }
    s = s.replace(/\/\*[\s\S]*?\*\//g, ' ');
    const pocetak = s.indexOf('/*');
    if (pocetak >= 0) { s = s.slice(0, pocetak); uKomentaru = true; }
    for (const m of s.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) {
      if (!upotrebe.has(m[1])) upotrebe.set(m[1], []);
      upotrebe.get(m[1]).push(rel.split(path.sep).join('/') + ':' + (i + 1));
    }
  });
}

/* ── definicije ── */
const cssDef = new Set();
for (const rel of cssPopis) {
  const s = ocisti(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  for (const m of s.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) cssDef.add(m[1]);
}
const runtimeDef = new Map(); // ime -> Set(datoteka)
const rtPopis = jsHtmlIzvori();
for (const rel of rtPopis) {
  const s = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const m of s.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) {
    if (!runtimeDef.has(m[1])) runtimeDef.set(m[1], new Set());
    runtimeDef.get(m[1]).add(rel.split(path.sep).join('/'));
  }
  for (const m of s.matchAll(/setProperty\(\s*['"`](--[A-Za-z0-9_-]+)/g)) {
    if (!runtimeDef.has(m[1])) runtimeDef.set(m[1], new Set());
    runtimeDef.get(m[1]).add(rel.split(path.sep).join('/'));
  }
}

/* ── presuda ── */
const nedefinirano = [];   // [ime, [gdje…]]
const krozRuntime = [];    // [ime, [datoteke…]] — definiran SAMO string-uzorkom
for (const [ime, gdje] of [...upotrebe.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  if (cssDef.has(ime)) continue;
  if (runtimeDef.has(ime)) { krozRuntime.push([ime, [...runtimeDef.get(ime)].sort()]); continue; }
  nedefinirano.push([ime, gdje]);
}

if (process.argv.includes('--update')) {
  const nova = {};
  for (const [ime, gdje] of nedefinirano) nova[ime] = gdje;
  fs.writeFileSync(OSNOVICA, JSON.stringify(nova, null, 2) + '\n', 'utf8');
  console.log('\n✅ osnovica prepisana — ' + nedefinirano.length + ' imenovanih iznimaka.\n');
  process.exit(0);
}

if (!fs.existsSync(OSNOVICA)) {
  console.error('❌ Nema osnovice. Pokreni: node scripts/check-tokens.js --update');
  process.exit(2);
}
const BASE = JSON.parse(fs.readFileSync(OSNOVICA, 'utf8'));

console.log('\n=== check:tokens — var() bez definicije = zakucana vrijednost s ukrasom ===\n');
console.log('   pregledano: ' + cssPopis.length + ' css · ' + rtPopis.length + ' js/html ·'
  + ' različitih var() imena: ' + upotrebe.size);

if (krozRuntime.length) {
  console.log('\n   definirano SAMO u runtimeu (inline stil / setProperty — string-uzorak, ne CSS):');
  for (const [ime, dat] of krozRuntime) {
    console.log('   ~ ' + ime.padEnd(24) + dat.join(' '));
  }
}

let pao = 0;
const vidjeno = new Set();
if (nedefinirano.length) console.log('');
for (const [ime, gdje] of nedefinirano) {
  vidjeno.add(ime);
  const dopusteno = Object.prototype.hasOwnProperty.call(BASE, ime);
  console.log((dopusteno ? '   ⚠️ ' : '   ❌ ') + ime.padEnd(24) + gdje.length + '×  '
    + (dopusteno ? '(u osnovici)' : 'NOVO — nema definicije nigdje'));
  if (!dopusteno) { for (const g of gdje) console.log('        ' + g); pao++; }
}

let zastarjelo = 0;
for (const ime of Object.keys(BASE)) {
  if (!vidjeno.has(ime)) {
    console.log('   ✅ ' + ime.padEnd(24) + 'više nije nedefiniran — makni ga iz osnovice (--update)');
    zastarjelo++;
  }
}

console.log('\n   nedefinirano ' + nedefinirano.length + '   osnovica ' + Object.keys(BASE).length);

if (pao) {
  console.log('\n❌ ' + pao + ' NOVO nedefinirano ime — `var()` koji se nikad ne razriješi.');
  console.log('   Ili definiraj token (po temi, u `css/tokens.css`/`variables.css`), ili — ako je');
  console.log('   iznimka svjesna — opravdaj je i spusti osnovicu: node scripts/check-tokens.js --update\n');
  process.exit(1);
}
if (zastarjelo) {
  console.log('\n✅ ispod osnovice — spusti ju s `--update` da napredak postane brana.\n');
  process.exit(0);
}
console.log('\n✅ čisto — ništa novo nije nastalo.\n');
