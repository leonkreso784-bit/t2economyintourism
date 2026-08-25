#!/usr/bin/env node
/**
 * css:debt — što je ostalo za C4–C7, izmjereno umjesto prepisano (2026-08-25)
 *
 * ── ZAŠTO ────────────────────────────────────────────────────────────────────────
 * Tablica cigli u `docs/plan/FRONTEND_REDIZAJN.md` nosila je brojke tipa
 * „`subject-selector.css` (**49 `!important`**)" i „`responsive/*` (6 datoteka,
 * 40 `!important`)". Obje su **ostarile tiho**: izmjereno 2026-08-25 → **47** i **35**.
 * Nijedna nije bila kriva kad je napisana; jednostavno su ih C1–C3 promijenile, a proza
 * se ne održava sama. To je isti razred greške zbog kojeg postoji `check:state`
 * (brojka u prozi) i zbog kojeg `check:seo` generira sitemap s diska.
 *
 * *Cigla se ne planira po brojci od prije tri tjedna.* Zato plan od danas imenuje OVU
 * naredbu umjesto brojki, a naredba čita disk.
 *
 * ── ŠTO MJERI ────────────────────────────────────────────────────────────────────
 *   · po cigli: koje datoteke su joj mete, koliko su velike, koliko nose `!important`
 *   · `!important` se broji IZVAN komentara — inače objašnjenje zašto ga nema
 *     ulazi u statistiku kao da ga ima (isti kvar koji je `check:safearea` platio)
 *   · ⚠️ NE mjeri paletu — to rade `check:palette` (čegrtaljka) i `palette:breakdown`
 *     (razlaganje po posljedici). Ovdje je riječ o SPECIFIČNOSTI, ne o boji.
 *
 * Read-only, bez mreže i preglednika. **NIJE gate** — brojka koja se smije mijenjati
 * u oba smjera nije tvrdnja nego mjera.
 *
 *   node scripts/css-debt.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** Mete po cigli — izvor je tablica §3 spec-a; imena datoteka, ne brojke. */
const CIGLE = [
  ['C4  browse + lekcije', ['css/browse.css', 'css/subject-selector.css', 'css/pages.css']],
  ['C5a modovi uvježbavanja', ['css/flashcards-section.css', 'css/quiz-section.css',
    'css/fill-blanks-section.css', 'css/progress-section.css']],
  ['C5b gradivo + vježbe', ['css/learn.css', 'css/learn-blocks.css', 'css/math.css',
    'css/exercises.css', 'css/blind-map.css']],
  ['C6  profil, auth, pravne', ['css/profile.css', 'css/auth.css', 'css/legal.css',
    'css/consent.css']],
  ['C7  gašenje', ['css/components.css', 'css/variables.css']]
];

function mjeri(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  const src = fs.readFileSync(p, 'utf8');
  // Komentari se brišu prije brojanja: komentar nije pravilo.
  const kod = src.replace(/\/\*[\s\S]*?\*\//g, '');
  return {
    redaka: src.split('\n').length,
    vazno: (kod.match(/!important/g) || []).length
  };
}

console.log('\n=== css:debt — što je ostalo za C4–C7 (mjereno, ne prepisano) ===\n');

let ukupnoR = 0;
let ukupnoV = 0;
CIGLE.forEach(([ime, mete]) => {
  const redci = [];
  let r = 0;
  let v = 0;
  mete.forEach((f) => {
    const m = mjeri(f);
    if (!m) {
      redci.push('    ' + f.padEnd(34) + '  — NE POSTOJI (obrisana ili preimenovana)');
      return;
    }
    r += m.redaka;
    v += m.vazno;
    redci.push('    ' + f.padEnd(34) + String(m.redaka).padStart(6) + ' redaka  ' +
      String(m.vazno).padStart(3) + ' !important');
  });
  ukupnoR += r;
  ukupnoV += v;
  console.log('  ' + ime + '   →  ' + r + ' redaka, ' + v + ' !important');
  redci.forEach((x) => console.log(x));
  console.log('');
});

// `responsive/*` se mjeri kao skupina: cigla C7 ih gasi zajedno.
const RESP = path.join(ROOT, 'css', 'responsive');
if (fs.existsSync(RESP)) {
  const fs2 = fs.readdirSync(RESP).filter((f) => f.endsWith('.css')).sort();
  let r = 0;
  let v = 0;
  fs2.forEach((f) => {
    const m = mjeri('css/responsive/' + f);
    r += m.redaka;
    v += m.vazno;
  });
  ukupnoR += r;
  ukupnoV += v;
  console.log('  C7  css/responsive/*   →  ' + fs2.length + ' datoteka, ' + r +
    ' redaka, ' + v + ' !important\n');
}

console.log('  UKUPNO preostalo: ' + ukupnoR + ' redaka, ' + ukupnoV + ' !important\n');
console.log('  ⚠️ Ovo NIJE gate. Paletu mjere `check:palette` i `palette:breakdown`;\n' +
  '     ovdje je riječ o specifičnosti i opsegu, ne o boji.\n');
