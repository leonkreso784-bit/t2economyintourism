/* eslint-disable no-console */
// ===== Node de-risk testovi: parseAmount/numEq za STATISTIČKE formate brojeva =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/stat-parse.test.js)
//
// Zašto (docs/subjects/STATISTICS_PLAN.md, cigla B0.5): engineov parseAmount građen je za NOVAC.
// Statistika unosi NEGATIVNE (z = −2.64, slope = −0.4) i SITNE DECIMALE (p = 0.0336),
// uključujući vrijednosti s VODEĆOM NULOM i točno 3 decimale (R² = 0.576, p = 0.025/0.001).
// Ovaj test dokazuje da ih engine parsira ISPRAVNO PRIJE nego se autorira ijedna vježba.
// Ako padne → minimalna GENERIČKA (unatrag-kompatibilna) dopuna parseAmount + ovaj test ostaje zelen.
//
// NB: ovo NIJE domenski hack — radi se o korektnosti parsiranja decimala s vodećom nulom,
// što koristi BILO KOJEM predmetu; engine ostaje sadržajno-neutralan (sveto pravilo netaknuto).

const assert = require('assert');
const path = require('path');
const { parseAmount, numEq } = require(path.join(__dirname, '..', '..', 'js', 'exercises-core.js'));

let passed = 0;
let failed = 0;
function test(name, fn) {
    try { fn(); passed++; console.log('  ✓ ' + name); }
    catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
const eq = (input, expected) => () => assert.strictEqual(parseAmount(input), expected);

console.log('\n=== stat-parse (B0.5 de-risk) ===\n');

// --- Negativni (z-score, slope, suma umnožaka) -----------------------------
test('neg z-score -2.64', eq('-2.64', -2.64));
test('neg slope -0.4', eq('-0.4', -0.4));
test('neg integer -720', eq('-720', -720));
test('neg with sign and 2dp -1.83', eq('-1.83', -1.83));

// --- Pozitivne z/t kritične i statistike (2 dec) ---------------------------
test('z 1.96', eq('1.96', 1.96));
test('z 2.33', eq('2.33', 2.33));
test('t 1.48', eq('1.48', 1.48));

// --- Sitne decimale, ≠3 decimale (već rade) --------------------------------
test('p 0.0336 (4dp)', eq('0.0336', 0.0336));
test('p 0.05 (2dp)', eq('0.05', 0.05));
test('p 0.10 (2dp)', eq('0.10', 0.1));
test('prop 0.75 (2dp)', eq('0.75', 0.75));
test('leading decimal .5', eq('.5', 0.5));

// --- ⚠ Vodeća nula + TOČNO 3 decimale (rizična zona za "grupiranje tisuća") --
test('R2 0.576 (3dp)', eq('0.576', 0.576));
test('SSR-share 0.288 (3dp)', eq('0.288', 0.288));
test('p 0.069 (3dp)', eq('0.069', 0.069));
test('p 0.025 (3dp)', eq('0.025', 0.025));
test('p 0.001 (3dp)', eq('0.001', 0.001));
test('p 0.050 (3dp)', eq('0.050', 0.05));
test('leading decimal .025 (3dp)', eq('.025', 0.025));

// --- Regresija unatrag: grupiranje tisuća s vodećom ne-nulom MORA ostati ----
test('EU grouping 120.000 = 120000', eq('120.000', 120000));
test('EU grouping 1.000 = 1000', eq('1.000', 1000));
test('EU grouping 12.500 = 12500', eq('12.500', 12500));
test('US grouping 120,000 = 120000', eq('120,000', 120000));
test('zero 0.000 = 0', eq('0.000', 0));

// --- numEq s tipičnim statističkim tolerancijama ---------------------------
test('numEq z within 0.01', () => assert.ok(numEq('1.96', 1.96, 0.01)));
test('numEq R2 within 0.001', () => assert.ok(numEq('0.576', 0.576, 0.001)));
test('numEq negative within 0.01', () => assert.ok(numEq('-2.64', -2.64, 0.01)));
test('numEq rejects far value', () => assert.ok(!numEq('0.50', 0.576, 0.001)));

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
