#!/usr/bin/env node
/**
 * check:hover — nijedno `:hover` pravilo ne smije stajati izvan `@media (hover: hover)` (F1/8 ①).
 *
 * ── POVOD ────────────────────────────────────────────────────────────────────────
 * Leon (2026-09-05): *„gumb koji je stajao na mjestu starog gumba isto svijetli po rubovima
 * a nije ga se diralo — jako naporno"*, *„od početka"*. WebKit (svaki preglednik na
 * iPhoneu) nakon dodira koji promijeni rutu zadrži `:hover` na onome što se sad nalazi pod
 * prstom. Reproducirano 2026-09-05 u Playwrightovom WebKitu s dodirom; `@media (hover: none)`
 * protučinjenično vraća mirni izgled. Zamatanje radi `scripts/build-css.js` kroz
 * `scripts/hover-css.js` — ova brana čuva da to i OSTANE tako:
 *
 *   • `styles.bundle.css` — što god build ispusti, ovdje pada (drift ili buduća promjena
 *     builda koja zaboravi prolaz);
 *   • `css/legal.css` i `css/consent.css` — NISU u bundleu (zaseban `<link>`), pa ih build
 *     ne dira; ondje je omot RUČAN i ovo je jedino što ga čuva.
 *
 * ── ZAŠTO STATIČKI, A NE EKRANOM ─────────────────────────────────────────────────
 * Ljepljivi hover na dodiru reproducira samo WebKit, kojeg CI nema. Ekran mjeri
 * `scripts/hover-probe.js` (izvan preflighta); ovdje se mjeri ONO ŠTO PREGLEDNIK DOBIJE —
 * i to kroz isti parser (lightningcss) kojim je bundle zamotan, ne regexom koji višeredne
 * liste selektora ne vidi. Brana ispisuje koliko je pravila dotaknula (pouka faze redizajna:
 * mjerač koji ne kaže doseg dvaput je vratio uvjerljiv krivi broj).
 *
 * Read-only, bez mreže → `npm run preflight`.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { gola } = require('./hover-css');

const KORIJEN = path.join(__dirname, '..');
const DATOTEKE = ['styles.bundle.css', path.join('css', 'legal.css'), path.join('css', 'consent.css')];

let pao = 0;
let ukupnoHover = 0;
let ukupnoPravila = 0;

for (const rel of DATOTEKE) {
  const p = path.join(KORIJEN, rel);
  if (!fs.existsSync(p)) { console.error('❌ ' + rel + ' ne postoji'); pao++; continue; }
  const css = fs.readFileSync(p, 'utf8');
  let r;
  try { r = gola(css, rel); } catch (e) { console.error('❌ ' + rel + ': ' + e.message); pao++; continue; }
  ukupnoHover += r.doseg.hoverSelektora;
  ukupnoPravila += r.doseg.pravila;
  if (r.gola.length) {
    pao++;
    console.error('❌ ' + rel + ': ' + r.gola.length + ' hover-pravilo/a IZVAN `@media (hover: hover)` — na dodiru bi se zalijepilo:');
    r.gola.slice(0, 12).forEach((g) => console.error('   ' + rel + ':' + g.line + '  ' + g.selektori.filter((_, i) => g.hoverIdx.includes(i)).join(', ')));
    if (r.gola.length > 12) console.error('   … i još ' + (r.gola.length - 12));
  } else {
    console.log('✅ ' + rel + ': ' + r.doseg.hoverSelektora + ' hover-selektora u ' + r.doseg.pravila + ' pravila — svi pod hover-medijem');
  }
}

// Doseg: brana koja nije vidjela nijedan hover ne tvrdi ništa (prazan bundle bi „prošao").
if (ukupnoHover < 50) {
  pao++;
  console.error('❌ dotaknuto samo ' + ukupnoHover + ' hover-selektora — bundle je 2026-09-05 imao 142; ovo je sumnjivo prazno');
}

console.log((pao ? '❌ check:hover pao' : '✅ check:hover') + ' — dotaknuto ' + ukupnoPravila + ' pravila, ' + ukupnoHover + ' hover-selektora u ' + DATOTEKE.length + ' datoteke');
process.exit(pao ? 1 : 0);
