/* eslint-disable no-console */
// ===== BUG-042 GATE — a11y specovi smiju mjeriti SAMO kroz helpers/axe-gate.js =====
// Pokreni: node tests/unit/axe-gate-usage.test.js
//
// ZAŠTO POSTOJI: axe-core u boju uračunava neprozirnost PREDAKA. Element uhvaćen usred
// fade-ina zato daje izmiješanu boju, a gate prijavi pad koji na gotovoj stranici ne
// postoji. `helpers/axe-gate.js` to rješava (`smiri()` gura animacije u krajnje stanje i
// od 2026-08-31 PADA ako ne uspije) — ali samo za onoga tko kroz njega prođe.
//
// Isti kvar javio se TRI PUTA, i svaki put je popravak bio na jednom mjestu dok je drugo
// mjesto ostalo skenirati po svome:
//   2026-08-13  `#btnCorrect > span` — boja na ~93 % neprozirnosti (4.29 umjesto 4.80)
//   2026-08-15  toast u Studiju — `#868584/#fdfcfb` = 3.59 na ~53 % neprozirnosti
//   2026-08-31  kolačić-traka na stranici lekcija (BUG-042) — 4.05/3.54 na 78 %,
//               dok isti tokeni na punoj neprozirnosti daju 6.35/5.67
// Treći put je prošao jer je `a11y.spec.js` uvozio SAMO `gateViolations` i zvao axe
// izravno, dakle zaobilazio smirivanje. Znanje o kvaru je već bilo zapisano — u datoteci
// koju taj spec nije koristio. Zato ovdje stoji BRANA, a ne bilješka (ADR-027: rub koji
// prepoznaš isti čas dobiva test).
//
// Brana namjerno gleda IZVORNI TEKST, ne ponašanje: kvar nije u tome što axe radi nego u
// tome TKO ga smije zvati. To se dokazuje čitanjem, ne pokretanjem preglednika — pa gate
// stane u `test:unit` (preflight + CI) umjesto da čeka 18 minuta Playwrighta.

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== axe-gate usage (BUG-042 gate) ===\n');

const TESTS_DIR = path.join(__dirname, '..');
const HELPER = path.join(TESTS_DIR, 'helpers', 'axe-gate.js');

// ⚠️ KOMENTARI SE ODSTRANJUJU PRIJE PROVJERE. Prva verzija ove brane to nije radila i pala
// je na PRVOM pokretanju — na vlastitom komentaru u `a11y.spec.js`, koji obrazac spominje
// da bi ga zabranio. Brana koja ne razlikuje kod od proze mjeri tekst, ne ponašanje, a
// prvi koji je popravlja počne je zaobilaziti.
const bezKomentara = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');

const IZRAVNO = /new\s+AxeBuilder\s*\(/;
const UVOZ = /require\(\s*['"]@axe-core\/playwright['"]\s*\)/;
const KROZ_HELPER = /\bskeniraj(SveTeme)?\s*\(/;

// ⚠️ Popis se ČITA S DISKA, ne nabraja rukom: nabrojan popis ne pokriva spec koji tek
// nastane, a upravo je „nova površina, stara greška" ovdje obrazac (BUG-034, isti razred).
const specovi = fs.readdirSync(TESTS_DIR)
  .filter((f) => /^a11y.*\.spec\.js$/.test(f))
  .map((f) => path.join(TESTS_DIR, f));

test('postoji barem jedan a11y spec (inače brana ne čuva ništa)', () => {
  if (!specovi.length) throw new Error('nijedan tests/a11y*.spec.js nije nađen');
});

test('helper postoji i izvozi skeniraj/smiri', () => {
  const h = fs.readFileSync(HELPER, 'utf8');
  for (const ime of ['smiri', 'skeniraj', 'skenirajSveTeme']) {
    if (!new RegExp('\\b' + ime + '\\b').test(h)) throw new Error('helper ne izvozi ' + ime);
  }
});

test('smiri() PADA ako se animacije ne smire (ne mjeri ekran u prijelazu)', () => {
  const h = fs.readFileSync(HELPER, 'utf8');
  if (!/throw new Error\(\s*\n?\s*'axe-gate: animacije se nisu smirile/.test(h)) {
    throw new Error('smiri() opet tiho nastavlja nakon neuspjelog smirivanja — to je BUG-042');
  }
});

for (const spec of specovi) {
  const ime = path.basename(spec);
  const kod = bezKomentara(fs.readFileSync(spec, 'utf8'));

  test(`${ime}: ne skenira izravno (mimo helpera)`, () => {
    if (IZRAVNO.test(kod)) {
      throw new Error(
        'skeniranje mimo helpera zaobilazi smiri() → mjerenje usred fade-ina. ' +
        'Koristi skeniraj(page, "IME") ili skenirajSveTeme(page, "IME").'
      );
    }
  });

  test(`${ime}: ne uvozi @axe-core/playwright`, () => {
    if (UVOZ.test(kod)) {
      throw new Error('uvoz axe-a u spec je prvi korak prema izravnom skeniranju; ide kroz helper');
    }
  });

  test(`${ime}: mjeri kroz helper (skeniraj / skenirajSveTeme)`, () => {
    if (!KROZ_HELPER.test(kod)) {
      throw new Error('spec ne poziva nijednu funkciju za skeniranje iz axe-gate.js');
    }
  });
}

// ⚠️ OBRNUTA PROVJERA — bez nje je ovo ukras, ne brana (pravilo iz docs/workflow/TESTING.md:
// „test koji ne bi pao ni da je tvrdnja lažna nije test nego ukras"). Vraća se točno onaj
// kod koji je 2026-08-31 pustio BUG-042 kroz CI, i traži se da ga brana prepozna.
test('prepoznaje kod koji je pustio BUG-042 (obrnuta provjera)', () => {
  const kvar = bezKomentara([
    "const AxeBuilder = require('@axe-core/playwright').default;",
    "const { gateViolations } = require('./helpers/axe-gate');",
    'const gated = gateViolations(await new AxeBuilder({ page }).analyze());'
  ].join('\n'));
  if (!IZRAVNO.test(kvar)) throw new Error('ne prepoznaje izravno skeniranje');
  if (!UVOZ.test(kvar)) throw new Error('ne prepoznaje izravan uvoz axe-a');
  if (KROZ_HELPER.test(kvar)) throw new Error('lažno tvrdi da taj kod ide kroz helper');
});

test('ne pada na komentaru koji obrazac samo spominje', () => {
  const proza = bezKomentara('// nikad ne zovi new AxeBuilder({ page })\nawait skeniraj(page, "X");');
  if (IZRAVNO.test(proza)) throw new Error('mjeri prozu umjesto koda');
  if (!KROZ_HELPER.test(proza)) throw new Error('ne prepoznaje poziv kroz helper');
});

console.log(`\n  ${passed} prošlo · ${failed} palo\n`);
process.exit(failed ? 1 : 0);
