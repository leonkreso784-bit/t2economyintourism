/* eslint-disable no-console */
// ===== Node unit testovi za data/statistics/stat-lib.js =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/stat-lib.test.js)
// Bez frameworka — mali runner + node assert. Cross-check: standardna z/t tablica,
// mathportal kalkulatori, midterm answer-keyevi (P(>1.83)=0.0336, P(>−2)=0.977).
// Vidi docs/STATISTICS_PLAN.md §2 (B1). stat-lib je CONTENT-layer (data/), NE engine.

const assert = require('assert');
const path = require('path');
const StatLib = require(path.join(__dirname, '..', '..', 'data', 'statistics', 'stat-lib.js'));
const { normalCdf, normalSf, normalBetween, zCritical, zUpper, tCritical } = StatLib;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
const close = (a, b, tol) => assert.ok(Math.abs(a - b) <= (tol == null ? 1e-3 : tol),
  'expected ' + a + ' ≈ ' + b + ' (tol ' + (tol == null ? 1e-3 : tol) + ')');

console.log('\n=== stat-lib ===\n');

// ---------------------------------------------------------------- normalCdf
test('normalCdf(0) = 0.5', () => close(normalCdf(0), 0.5));
test('normalCdf(1) ≈ 0.8413', () => close(normalCdf(1), 0.8413));
test('normalCdf(1.96) ≈ 0.9750', () => close(normalCdf(1.96), 0.9750));
test('normalCdf(1.645) ≈ 0.95', () => close(normalCdf(1.645), 0.95, 2e-3));
test('normalCdf(2.33) ≈ 0.9901', () => close(normalCdf(2.33), 0.9901));
test('normalCdf(-1) ≈ 0.1587 (symmetry)', () => close(normalCdf(-1), 0.1587));
test('normalCdf(-2) ≈ 0.0228', () => close(normalCdf(-2), 0.0228));
test('normalCdf(±∞)', () => { assert.strictEqual(normalCdf(Infinity), 1); assert.strictEqual(normalCdf(-Infinity), 0); });

// ---------------------------------------------------------------- normalSf / between
test('normalSf(1.83) ≈ 0.0336 (sampling-dist answer key)', () => close(normalSf(1.83), 0.0336));
test('P(Z>-2) = 1-cdf(-2) ≈ 0.977 (continuous-RV example)', () => close(normalSf(-2), 0.9772, 2e-3));
test('normalBetween(-1,1) ≈ 0.6827 (empirical 68%)', () => close(normalBetween(-1, 1), 0.6827));
test('normalBetween(-1.96,1.96) ≈ 0.95', () => close(normalBetween(-1.96, 1.96), 0.95, 2e-3));

// ---------------------------------------------------------------- z critical
test('zCritical(95) = 1.96', () => assert.strictEqual(zCritical(95), 1.960));
test('zCritical(90) = 1.645', () => assert.strictEqual(zCritical(90), 1.645));
test('zCritical(99) = 2.576', () => assert.strictEqual(zCritical(99), 2.576));
test('zUpper(0.025) = 1.96', () => assert.strictEqual(zUpper(0.025), 1.960));
test('zUpper(0.05) = 1.645', () => assert.strictEqual(zUpper(0.05), 1.645));

// ---------------------------------------------------------------- t critical (standard table)
test('tCritical(9, 0.025) = 2.262', () => assert.strictEqual(tCritical(9, 0.025), 2.262));
test('tCritical(8, 0.025) = 2.306', () => assert.strictEqual(tCritical(8, 0.025), 2.306));
test('tCritical(15, 0.05) = 1.753', () => assert.strictEqual(tCritical(15, 0.05), 1.753));
test('tCritical(24, 0.025) = 2.064', () => assert.strictEqual(tCritical(24, 0.025), 2.064));
test('tCritical(29, 0.005) = 2.756', () => assert.strictEqual(tCritical(29, 0.005), 2.756));
test('t > z for small df: t(5,0.025) > 1.96', () => assert.ok(tCritical(5, 0.025) > 1.96));
test('tCritical(df>=31) falls back to z', () => assert.strictEqual(tCritical(40, 0.025), zUpper(0.025)));
test('tCritical(Infinity) = z', () => assert.strictEqual(tCritical(Infinity, 0.05), 1.645));

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
