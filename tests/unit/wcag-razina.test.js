/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `wcagRazina` (MREŽA B3a) =====
// Pokreni: node tests/unit/wcag-razina.test.js
//
// ZAŠTO POSTOJI: B3a je MJERENJE opsega a11y duga po WCAG razini — a mjera čiji
// razvrstavač nitko nije dokazao bila bi točno rupa koju BLOK B lovi. Rubovi koje
// naivan regex promaši: `wcag2aa` ne smije proći kao A (sufiks `a` je i u `aa`),
// a kriterijski tagovi (`wcag211`, `wcag412`) ne nose razinu i ne smiju je dati.

const { wcagRazina } = require('../helpers/axe-gate.js');

const SLUCAJEVI = [
  // [tagovi, očekivano, ime]
  [['cat.keyboard', 'wcag2a', 'wcag211'], 'A', 'wcag2a → A (scrollable-region-focusable, povod B3)'],
  [['wcag21a'], 'A', 'wcag21a → A'],
  [['wcag22a'], 'A', 'wcag22a → A'],
  [['cat.color', 'wcag2aa', 'wcag143'], 'AA', 'wcag2aa → AA, NE A (sufiks-zamka)'],
  [['wcag21aa'], 'AA', 'wcag21aa → AA'],
  [['wcag2aaa'], 'AAA', 'wcag2aaa → AAA, NE AA'],
  [['wcag2a', 'wcag2aa'], 'AA', 'više razina → najviša prijavljena (AA tuče A)'],
  [['cat.semantics', 'best-practice'], 'best-practice', 'bez wcag-taga → best-practice'],
  [['wcag211', 'wcag412'], 'best-practice', 'kriterijski tag BEZ razinskog ne daje razinu'],
  [[], 'best-practice', 'prazno → best-practice'],
];

let failed = 0;
console.log('\n=== obrnuta provjera: wcagRazina (B3a mjerni razvrstavač) ===\n');
for (const [tags, ocekivano, ime] of SLUCAJEVI) {
  const dobiveno = wcagRazina(tags);
  if (dobiveno === ocekivano) {
    console.log('  ✅ ' + ime);
  } else {
    failed++;
    console.log('  ❌ ' + ime + '  (dobiveno "' + dobiveno + '", očekivano "' + ocekivano + '")');
  }
}
console.log('\n' + (failed ? '❌ ' + failed + ' palo' : '✅ svih ' + SLUCAJEVI.length + ' prošlo') + '\n');
process.exit(failed ? 1 : 0);
