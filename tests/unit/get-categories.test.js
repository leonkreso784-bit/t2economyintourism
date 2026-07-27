/* eslint-disable no-console */
// ===== Node unit test za getCategories() (js/content-loader.js, U7a) =====
// Pokreni: node tests/unit/get-categories.test.js
// Isti shim-obrazac kao draft-store.test.js: klasična skripta se učita kroz new Function('window', code).
// getCategories filtrira TOP-LEVEL META ključeve (schema v2) da category-iteracije ne renderiraju
// lažnu kategoriju — preduvjet za U7 (learn-blokovi + schemaVersion).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== getCategories (U7a) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'content-loader.js'), 'utf8');
const win = {};
new Function('window', code)(win); // content-loader nema top-level browser-poziva → čist load
const getCategories = win.getCategories;

test('izvezen na window kao funkcija', function () {
  assert.strictEqual(typeof getCategories, 'function');
});

test('vraća ključeve kategorija (vrijednost = objekt)', function () {
  const content = { a: { name: 'A', flashcards: [] }, b: { name: 'B', quiz: [] } };
  assert.deepStrictEqual(getCategories(content), ['a', 'b']);
});

test('ISKLJUČUJE schemaVersion (broj) — jezgra U7a', function () {
  const content = { schemaVersion: 2, a: { name: 'A' }, b: { name: 'B' } };
  assert.deepStrictEqual(getCategories(content), ['a', 'b']);
});

test('ISKLJUČUJE composedOf (niz) — U9 kompozicija', function () {
  const content = { composedOf: ['m1', 'm2'], examPractice: { name: 'EP' } };
  assert.deepStrictEqual(getCategories(content), ['examPractice']);
});

test('prazna kategorija {} OSTAJE (objekt, ne meta)', function () {
  const content = { empty: {}, a: { name: 'A' } };
  assert.deepStrictEqual(getCategories(content), ['empty', 'a']);
});

test('čuva REDOSLIJED umetanja (meta preskočen, ne pomiče ostale)', function () {
  const content = { z: { n: 1 }, schemaVersion: 2, a: { n: 2 }, m: { n: 3 } };
  assert.deepStrictEqual(getCategories(content), ['z', 'a', 'm']);
});

test('null/undefined/skalar → []', function () {
  assert.deepStrictEqual(getCategories(null), []);
  assert.deepStrictEqual(getCategories(undefined), []);
  assert.deepStrictEqual(getCategories('x'), []);
  assert.deepStrictEqual(getCategories(42), []);
});

test('niz-vrijednosti i funkcije se NE broje kao kategorije', function () {
  const content = { a: { n: 1 }, arr: [1, 2], fn: function () {} };
  assert.deepStrictEqual(getCategories(content), ['a']);
});

console.log('\ngetCategories: ' + passed + ' prošlo, ' + failed + ' palo');
process.exit(failed ? 1 : 0);
