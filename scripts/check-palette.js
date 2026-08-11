#!/usr/bin/env node
/**
 * check-palette.js — ČEGRTALJKA ZA STARU PALETU  (cigla C2)
 *
 * ŠTO MJERI: koliko je u `css/` ostalo boja iz STARE, naslijeđene palete
 * (Tailwindovi zadani indigo/slate: #6366f1, #0f172a, #334155, #94a3b8 …) —
 * i to u OBA oblika u kojima se skrivaju: kao hex i kao `rgb()/rgba()`.
 *
 * ZAŠTO POSTOJI: pri prelasku na paletu „Ponoć i menta" (C2) most u
 * `css/variables.css` prebojao je 992 `var()` poziva jednim editom. Ali revizija
 * je tada gledala samo hex-oblik i zaključila da je ostalo ~78 mjesta. Stvarni broj
 * bio je tri puta veći: dodatnih **206 boja skrivenih u `rgba()`** — glow-ovi,
 * hover-tintovi i rubovi, kojih hex-pretraga ne vidi jer u njima piše
 * `rgba(99, 102, 241, .12)`, a ne `#6366f1`. Da gate nije napisan, taj ostatak bi
 * se otkrivao jedan po jedan, okom, kroz sljedećih pet cigli.
 *
 * ZAŠTO ČEGRTALJKA, A NE ZABRANA: ostatak se ne popravlja prebojavanjem nego
 * NESTAJE zajedno s površinama koje ga koriste (C3–C7), a §7.2.3 kaže da ti glow-ovi
 * uopće ne trebaju dobiti novu boju — trebaju biti obrisani. Zato gate ne traži nulu
 * odmah, nego samo da broj NIKAD NE PORASTE. Kad cigla obriše površinu, spusti se
 * osnovica (`node scripts/check-palette.js --update`) i ta razina postaje nova brana.
 *
 * IZLAZNI CILJ: sve nule. Tada ovaj gate postaje obična zabrana i seli se u preflight
 * kao takav (izlazni uvjet §2: „nijedna hex-boja izvan @theme").
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSS_DIR = path.join(ROOT, 'css');

/* Stara paleta = Tailwindovi zadani tonovi koje smo naslijedili, nikad izabrali.
   Ime uz svaku vrijednost postoji da izvještaj kaže ŠTO je nađeno, ne samo gdje. */
const OLD = [
  ['#6366f1', [99, 102, 241], 'indigo-500 (stari --primary)'],
  ['#4f46e5', [79, 70, 229], 'indigo-600'],
  ['#4338ca', [67, 56, 202], 'indigo-700'],
  ['#818cf8', [129, 140, 248], 'indigo-400'],
  ['#a5b4fc', [165, 180, 252], 'indigo-300'],
  ['#c7d2fe', [199, 210, 254], 'indigo-200'],
  ['#8b5cf6', [139, 92, 246], 'violet-500'],
  ['#7c3aed', [124, 58, 237], 'violet-600'],
  ['#a78bfa', [167, 139, 250], 'violet-400'],
  ['#c4b5fd', [196, 181, 253], 'violet-300'],
  ['#0f172a', [15, 23, 42], 'slate-900 (stari --bg-primary)'],
  ['#1e293b', [30, 41, 59], 'slate-800'],
  ['#334155', [51, 65, 85], 'slate-700'],
  ['#475569', [71, 85, 105], 'slate-600'],
  ['#64748b', [100, 116, 139], 'slate-500'],
  ['#94a3b8', [148, 163, 184], 'slate-400'],
  ['#e2e8f0', [226, 232, 240], 'slate-200'],
  ['#f1f5f9', [241, 245, 249], 'slate-100'],

  /* ⚠️ ZAKUCANA BIJELA I CRNA — za VIŠE TEMA fatalnije od indiga.
     Indigo na krivoj podlozi je neusklađen; `color: rgba(255,255,255,.9)` na
     papirnatoj temi je NEVIDLJIV. Nađeno u `learn.css`, gdje pravila pod
     `[data-theme="dark"]` boje tekst kartica bijelim, i u `landing.css` (23×).
     Prva verzija ovog gatea ih nije gledala jer je tražila samo staru paletu —
     a upravo su one prag koji odlučuje smije li se svijetla tema uopće uključiti.
     Ispravno je `var(--color-ink-0)` / `var(--color-surface-1)`, ne bijela. */
  ['#ffffff', [255, 255, 255], 'bijela (nevidljiva na svijetlim temama)'],
  ['#fff', null, 'bijela (nevidljiva na svijetlim temama)'],
  ['#000000', [0, 0, 0], 'crna (nevidljiva na tamnim temama)'],
  ['#000', null, 'crna (nevidljiva na tamnim temama)'],
];

/* OSNOVICA — koliko ih smije ostati po datoteci. Spuštaj je, nikad ne diži.
   Uz svaku stoji cigla u kojoj ta površina umire, da se vidi kad se broj SMIJE
   očekivati na nuli. Regeneracija: `node scripts/check-palette.js --update`. */
const BASELINE = require('./palette-baseline.json');

/** Komentari se NE broje — u njima namjerno pišu stare vrijednosti (npr. „#6366f1 = indigo-500"). */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function countIn(css) {
  const hits = [];
  for (const [hex, rgb, label] of OLD) {
    /* ⚠️ Negativni lookahead je OBAVEZAN: bez njega uzorak `#fff` pogađa i prva
       četiri znaka `#ffffff`, pa se ista deklaracija broji dvaput i osnovica laže. */
    const reHex = new RegExp(hex + '(?![0-9a-f])', 'gi');
    let n = (css.match(reHex) || []).length;
    if (rgb) {
      const [r, g, b] = rgb;
      const reRgb = new RegExp('rgba?\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*[,)]', 'gi');
      n += (css.match(reRgb) || []).length;
    }
    if (n) hits.push({ label, n });
  }
  return hits;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir)) {
    const abs = path.join(dir, e);
    if (fs.statSync(abs).isDirectory()) walk(abs, out);
    else if (e.endsWith('.css')) out.push(abs);
  }
  return out;
}

/* ⚠️ MARKUP SE MORA SKENIRATI JEDNAKO KAO CSS.
   Nađeno pri pisanju ovog gatea: `index.html` nosi paletu u inline-stilu
   (`<article class="mode-card" style="--card-accent:#6366f1">` × 5). Da se skenirao
   samo `css/`, gate bi javio „čisto" dok pet kartica na landingu i dalje svijetli
   starim indigom — a upravo su te kartice ono što posjetitelj prvo vidi.
   Isti razlog vrijedi za pravne stranice: one ne učitavaju bundle, pa im je paleta
   jedino ovdje vidljiva. */
const HTML_FILES = ['index.html', 'privacy.html', 'terms.html', 'faq.html', 'contact.html']
  .map((f) => path.join(ROOT, f))
  .filter((f) => fs.existsSync(f));

/* `tokens.css` je SAM POPIS BOJA — u njemu hex nije dug nego definicija.
   Da se skenira, gate bi prijavljivao `--color-white: #fff` kao prekršaj protiv
   samog sebe, a jedini način da se „popravi" bio bi ukloniti izvor istine. */
const SOURCE_OF_TRUTH = path.join(CSS_DIR, 'tokens.css');

const files = [...walk(CSS_DIR), ...HTML_FILES].filter((f) => f !== SOURCE_OF_TRUTH).sort();
const report = [];
for (const abs of files) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  const hits = countIn(stripComments(fs.readFileSync(abs, 'utf8')));
  const total = hits.reduce((s, h) => s + h.n, 0);
  if (total) report.push({ rel, total, hits });
}

const grand = report.reduce((s, r) => s + r.total, 0);

/* --update: prepiši osnovicu na TRENUTNO stanje (poziva se tek kad broj PADNE). */
if (process.argv.includes('--update')) {
  const next = {};
  for (const r of report) next[r.rel] = r.total;
  fs.writeFileSync(
    path.join(__dirname, 'palette-baseline.json'),
    JSON.stringify(next, null, 2) + '\n'
  );
  console.log(`\n✅ osnovica prepisana — ${report.length} datoteka, ukupno ${grand}.\n`);
  process.exit(0);
}

console.log('\n=== check:palette — ostatak stare palete (hex + rgba) ===\n');

let failed = 0;
for (const r of report) {
  const allowed = BASELINE[r.rel];
  if (allowed === undefined) {
    console.log(`❌ ${r.rel} — ${r.total} (datoteka NIJE u osnovici: nova stara boja)`);
    r.hits.forEach((h) => console.log(`      ${String(h.n).padStart(3)} × ${h.label}`));
    failed++;
  } else if (r.total > allowed) {
    console.log(`❌ ${r.rel} — ${r.total}, dopušteno ${allowed} (PORASLO za ${r.total - allowed})`);
    r.hits.forEach((h) => console.log(`      ${String(h.n).padStart(3)} × ${h.label}`));
    failed++;
  } else {
    const mark = r.total < allowed ? `⬇ ${allowed} → ${r.total}` : '=';
    console.log(`   ${r.rel.padEnd(44)} ${String(r.total).padStart(4)}   ${mark}`);
  }
}

/* Datoteka koja je bila u osnovici a više nema pogodaka (ili je obrisana) = napredak. */
const cleared = Object.keys(BASELINE).filter((k) => !report.some((r) => r.rel === k));
cleared.forEach((k) => console.log(`   ${k.padEnd(44)}    0   ✅ čisto (bilo ${BASELINE[k]})`));

const allowedTotal = Object.values(BASELINE).reduce((s, n) => s + n, 0);
console.log(`\n   ukupno ${grand} / dopušteno ${allowedTotal}`);

if (failed) {
  console.log(`\n❌ ${failed} datoteka iznad osnovice.`);
  console.log('   Stara paleta se ne smije vraćati. Koristi tokene iz css/tokens.css');
  console.log('   (ili `var(--primary)` i dr. iz mosta u css/variables.css).\n');
  process.exit(1);
}

if (grand < allowedTotal) {
  console.log(`\n✅ čisto — i PALO za ${allowedTotal - grand}. Spusti branu: node scripts/check-palette.js --update\n`);
} else if (grand === 0) {
  console.log('\n✅ stare palete više nema. Gate smije postati obična zabrana (§2).\n');
} else {
  console.log('\n✅ čisto — ostatak je na osnovici, ništa nije poraslo.\n');
}
