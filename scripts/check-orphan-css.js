#!/usr/bin/env node
/**
 * check:orphan-css — CSS koji NE MOŽE pogoditi ništa.
 *
 * ── ZAŠTO OVA BRANA POSTOJI (C4a, 2026-08-29) ────────────────────────────────
 * `css/subject-selector.css` je nosio 495 redaka i 47 od 49 `!important`-a u cijelom
 * preostalom dugu. Mjereno: od 44 klase njih **39 nije spominjao ni markup, ni JS, ni
 * gradivo, ni ijedan test.** Bio je to zaslon s dvije ponude predmeta (`te2`/`ent`) i
 * STARA `about` stranica — markup je i jedno i drugo izgubio davno prije.
 *
 * Da je ostalo na tome, bio bi to samo mrtav teret. Ali NIJE ostalo:
 *
 *   preostalih pet živih klasa DUPLIRALO je `pages.css` (novi `about`, §9.14), a
 *   `app.css` je mrtvu datoteku uvozio POSLIJE njega → pri jednakoj specifičnosti
 *   pobjeđuje kasnija. Ikone na `about` karticama dobivale su `color: white` iz
 *   mrtvog pravila, a ispunu koja je tu bjelinu nosila (`.mission-card .about-card-icon`)
 *   markup više nije imao. Izmjereno u pregledniku, sve četiri teme:
 *
 *       kontrast 1.13 (academic) i 1.16 (paper) — prag za ne-tekst je 3.0
 *
 *   Tri ikone bile su NEVIDLJIVE u obje svijetle teme, a zadana tema je svijetla.
 *
 * ⚠️ Nijedan postojeći gate to nije mogao vidjeti, i to nije bio previd nego doseg:
 * `check:contrast` čita PAROVE TOKENA iz `css/tokens.css` (ovdje je bjelina bila
 * zakucana u modulu), `check:palette` traži vrijednosti STARE palete (`#ffffff` to
 * nije), a `axe` ukrasnoj ikoni bez teksta ne mjeri kontrast. Mrtav CSS je jedina
 * mjera koja bi ovo prijavila — i prijavila bi ga tjednima prije nego što je itko
 * pogledao stranicu.
 *
 * ── ZAŠTO ČEGRTALJKA, A NE TVRDA ZABRANA ─────────────────────────────────────
 * Dio siročadi je LEGITIMAN i ne smije se popraviti brisanjem:
 *   • `katex-display` — ime dolazi iz KaTeX-a, ne iz našeg markupa;
 *   • `lb-color-*` — `js/block-editor.js` ih sastavlja u runtimeu (`'lb-color-' + token`).
 * Osnovica ta imena IMENUJE, pa iznimka postaje vidljiva umjesto da bude nevidljiva.
 * Broj smije samo padati; `--update` spušta osnovicu kad padne.
 *
 * ── ZAŠTO NIJE MJERENO „ista klasa u dva modula" ─────────────────────────────
 * Ta je mjera razmatrana i ODBAČENA MJERENJEM: dala bi 29 pogodaka od kojih je 28
 * legitimno (`.about-page` u `topbar.css` zbog rasporeda, `.is-error` u dva neovisna
 * modula…). Brana koja 28 puta viče krivo nauči te da ju ignoriraš.
 *
 * RABLJENJE:  node scripts/check-orphan-css.js [--update]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OSNOVICA = path.join(__dirname, 'orphan-css-baseline.json');

/* Pseudo-klase i pseudo-elementi pišu se s točkom pred sobom jednako kao klasa
   (`:hover` ne, ali `.foo:hover` da), pa se moraju izuzeti iz vađenja imena. */
const PSEUDO = new Set(['hover', 'focus', 'active', 'before', 'after', 'first-child', 'last-child',
  'nth-child', 'nth-of-type', 'not', 'is', 'where', 'has', 'root', 'disabled', 'checked', 'visited',
  'focus-visible', 'focus-within', 'placeholder', 'selection', 'empty', 'target', 'lang',
  'only-child', 'first-of-type', 'last-of-type', 'backdrop', 'marker', 'part', 'host', 'slotted']);

function cssDatoteke() {
  const out = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'css'))) {
    if (f.endsWith('.css')) out.push(path.join('css', f));
  }
  const rd = path.join(ROOT, 'css', 'responsive');
  if (fs.existsSync(rd)) for (const f of fs.readdirSync(rd)) {
    if (f.endsWith('.css')) out.push(path.join('css', 'responsive', f));
  }
  return out.sort();
}

/** Imena klasa iz CSS-a — bez komentara, stringova i `url()` sadržaja. */
function klaseIz(css) {
  const cist = css.replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/url\([^)]*\)/g, ' ')
    .replace(/"[^"]*"/g, ' ')
    .replace(/'[^']*'/g, ' ');
  const out = new Set();
  const re = /\.(-?[A-Za-z_][-A-Za-z0-9_]*)/g;
  let m;
  while ((m = re.exec(cist))) if (!PSEUDO.has(m[1])) out.add(m[1]);
  return out;
}

/**
 * Sve što izvor spominje, kao TOKENE.
 *
 * ⚠️ Namjerno bez regex-razdjelnika. Prva verzija ove mjere gradila je granicu riječi
 * ručno i pala je na tome: `grep -w` crticu smatra granicom, pa `landing-subject-card`
 * lažno POTVRDI `subject-card` — a to su dvije različite klase. Razlomiš li izvor po
 * svemu što ne može biti dio imena klase, pitanje postaje pripadnost skupu i cijeli
 * razred grešaka oko „što je granica" nestaje.
 */
function tokeni(text, u) {
  for (const t of text.split(/[^-A-Za-z0-9_]+/)) if (t) u.add(t);
}

function izvori() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) out.push(f);
  const hoda = (rel, ext) => {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return;
    for (const f of fs.readdirSync(abs)) {
      const r = path.join(rel, f);
      if (fs.statSync(path.join(ROOT, r)).isDirectory()) hoda(r, ext);
      else if (ext.test(f)) out.push(r);
    }
  };
  hoda('js', /\.(js|json|html)$/);
  hoda('data', /\.(js|json)$/);
  hoda('tests', /\.js$/);          // klasa koju spominje samo test barem POLAŽE pravo na postojanje
  return out;
}

const spomenuto = new Set();
for (const p of izvori()) tokeni(fs.readFileSync(path.join(ROOT, p), 'utf8'), spomenuto);

const izvjestaj = [];
for (const rel of cssDatoteke()) {
  const klase = klaseIz(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  const siroce = Array.from(klase).filter((k) => !spomenuto.has(k)).sort();
  if (siroce.length) izvjestaj.push({ rel: rel.split(path.sep).join('/'), siroce: siroce });
}

const ukupno = izvjestaj.reduce((s, r) => s + r.siroce.length, 0);

if (process.argv.includes('--update')) {
  const nova = {};
  for (const r of izvjestaj) nova[r.rel] = r.siroce;
  fs.writeFileSync(OSNOVICA, JSON.stringify(nova, null, 2) + '\n', 'utf8');
  console.log('\n✅ osnovica prepisana — ' + izvjestaj.length + ' datoteka, ukupno ' + ukupno + ' siročadi.\n');
  process.exit(0);
}

if (!fs.existsSync(OSNOVICA)) {
  console.error('❌ Nema osnovice. Pokreni: node scripts/check-orphan-css.js --update');
  process.exit(2);
}
const BASE = JSON.parse(fs.readFileSync(OSNOVICA, 'utf8'));

console.log('\n=== check:orphan-css — klase koje nitko nikad ne dobiva ===\n');

let pao = 0;
for (const r of izvjestaj) {
  const dopusteno = new Set(BASE[r.rel] || []);
  const nove = r.siroce.filter((k) => !dopusteno.has(k));
  const znak = nove.length ? '❌' : '  ';
  console.log(znak + ' ' + r.rel.padEnd(46) + String(r.siroce.length).padStart(3)
    + (nove.length ? '   NOVE: ' + nove.join(' ') : ''));
  if (nove.length) pao += nove.length;
}

/* Datoteka koja je bila u osnovici a više nema siročadi (ili je obrisana) = napredak. */
for (const k of Object.keys(BASE)) {
  if (!izvjestaj.some((r) => r.rel === k)) {
    console.log('   ' + k.padEnd(46) + '  0   ✅ čisto (bilo ' + BASE[k].length + ')');
  }
}

const dopusteniUkupno = Object.values(BASE).reduce((s, v) => s + v.length, 0);
console.log('\n   ukupno ' + ukupno + '   osnovica ' + dopusteniUkupno);

if (pao) {
  console.log('\n❌ ' + pao + ' NOVA siročad — CSS koji ne može pogoditi nijedan element.');
  console.log('   Ili obriši pravilo, ili — ako ime nastaje u runtimeu / dolazi iz knjižnice —');
  console.log('   opravdaj ga i spusti osnovicu: node scripts/check-orphan-css.js --update\n');
  process.exit(1);
}
if (ukupno < dopusteniUkupno) {
  console.log('\n✅ ispod osnovice (' + ukupno + ' < ' + dopusteniUkupno + ') — spusti ju s `--update`.\n');
  process.exit(0);
}
console.log('\n✅ čisto — ništa novo nije nastalo.\n');
