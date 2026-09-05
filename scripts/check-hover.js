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
 * ── ② MIŠ (F1/8 ②) ──────────────────────────────────────────────────────────────
 * Na mišu isti kvar radi preglednik sam: hover se računa po položaju, ne po pokretu. Zato
 * svaki hover-selektor u bundleu nosi prefiks `:where(:root:not([data-hover-paused]))`, a
 * `pauzirajHover()` (`js/utils.js`) stavlja taj atribut dok se mijenja ono što je pod mišem.
 * Ovdje se čuva CSS-polovica (nula nenaoružanih selektora); JS-polovicu čuva
 * `tests/unit/hover-arm.test.js`, ekran `hover-probe --profil=prelaz`. `legal.css` prefiks NE
 * traži: pravne stranice nemaju ruter, pod mišem se ondje ništa ne mijenja.
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
// `naoruzan`: traži li se i prefiks `:where(:root:not([data-hover-paused]))` (② — samo gdje ruter postoji).
const DATOTEKE = [
  { rel: 'styles.bundle.css', naoruzan: true },
  { rel: path.join('css', 'legal.css'), naoruzan: false },
  { rel: path.join('css', 'consent.css'), naoruzan: true },
];

let pao = 0;
let ukupnoHover = 0;
let ukupnoPravila = 0;
let ukupnoNaoruzanih = 0;

for (const { rel, naoruzan } of DATOTEKE) {
  const p = path.join(KORIJEN, rel);
  if (!fs.existsSync(p)) { console.error('❌ ' + rel + ' ne postoji'); pao++; continue; }
  const css = fs.readFileSync(p, 'utf8');
  let r;
  try { r = gola(css, rel); } catch (e) { console.error('❌ ' + rel + ': ' + e.message); pao++; continue; }
  ukupnoHover += r.doseg.hoverSelektora;
  ukupnoPravila += r.doseg.pravila;
  ukupnoNaoruzanih += r.doseg.naoruzanihSelektora;
  const ispisi = (lista) => lista.slice(0, 12).forEach((g) => console.error('   ' + rel + ':' + g.line + '  ' + g.selektori.filter((_, i) => g.hoverIdx.includes(i)).join(', ')));
  let ok = true;
  if (r.gola.length) {
    pao++; ok = false;
    console.error('❌ ' + rel + ': ' + r.gola.length + ' hover-pravilo/a IZVAN `@media (hover: hover)` — na dodiru bi se zalijepilo:');
    ispisi(r.gola);
    if (r.gola.length > 12) console.error('   … i još ' + (r.gola.length - 12));
  }
  if (naoruzan && r.nenaoruzana.length) {
    pao++; ok = false;
    console.error('❌ ' + rel + ': ' + r.nenaoruzana.length + ' hover-pravilo/a BEZ prefiksa `:where(:root:not([data-hover-paused]))` — na mišu bi poslije prelaska svijetlilo:');
    ispisi(r.nenaoruzana);
    if (r.nenaoruzana.length > 12) console.error('   … i još ' + (r.nenaoruzana.length - 12));
  }
  if (ok) {
    console.log('✅ ' + rel + ': ' + r.doseg.hoverSelektora + ' hover-selektora u ' + r.doseg.pravila + ' pravila — svi pod hover-medijem'
      + (naoruzan ? ', svi s prefiksom' : ' (prefiks se ne traži: bez rutera)'));
  }
}

// Doseg: brana koja nije vidjela nijedan hover ne tvrdi ništa (prazan bundle bi „prošao").
if (ukupnoHover < 50) {
  pao++;
  console.error('❌ dotaknuto samo ' + ukupnoHover + ' hover-selektora — bundle je 2026-09-05 imao 142; ovo je sumnjivo prazno');
}

console.log((pao ? '❌ check:hover pao' : '✅ check:hover') + ' — dotaknuto ' + ukupnoPravila + ' pravila, ' + ukupnoHover + ' hover-selektora ('
  + ukupnoNaoruzanih + ' s prefiksom) u ' + DATOTEKE.length + ' datoteke');
process.exit(pao ? 1 : 0);
