/* eslint-disable no-console */
// ===== Node unit test za format praznine u dopunama (D1 — autorstvo praznine) =====
// Pokreni: node tests/unit/fill-blank-format.test.js
// Shim-obrazac (kao card-limits/block-editor): klasična skripta kroz new Function('window', code).
// `js/admin-editors.js` na vrhu samo DEKLARIRA (nema poziva DOM-a pri učitavanju), pa se učita
// bez admin.js — testira se isključivo čisti dio (window.SokratFillFormat).
//
// ⚠️ ZAŠTO OVAJ TEST POSTOJI: „neka bude dovoljna jedna podvlaka" je razuman prijedlog koji bi
// slomio gradivo — u LaTeX-u je `_` operator indeksa, a rečenice s dopunom renderiraju matematiku.
// Izmjereno u data/: 1005 rečenica s dopunom, 5 sadrži KaTeX. Zato normalizacija dira SAMO
// nizove od 3+ podvlake, a ovaj test to drži na mjestu — mjeri se PRAVA rečenica iz kataloga.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== fill-blank-format (D1) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'js', 'admin-editors.js'), 'utf8'))(win);
const F = win.SokratFillFormat;

// ── izvoz + poklapanje sa schemom ──
test('izvezen na window (MARK + tri funkcije)', function () {
  assert.strictEqual(typeof F, 'object');
  assert.strictEqual(F.MARK, '_______');
  assert.strictEqual(typeof F.normalize, 'function');
  assert.strictEqual(typeof F.count, 'function');
  assert.strictEqual(typeof F.insert, 'function');
});

test('MARK zadovoljava JSON Schemu (fillBlank.sentence.pattern) — jedan izvor, ne dvije kopije', function () {
  const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema', 'subject-content.schema.json'), 'utf8'));
  const pattern = schema.definitions.fillBlank.properties.sentence.pattern;
  assert.ok(new RegExp(pattern).test('Neka rečenica ' + F.MARK + ' dalje.'), 'marker mora proći shemu');
});

// ── normalizacija: OPRAŠTA brojanje, ali NE dira LaTeX ──
test('nizovi od 3+ podvlake → kanonskih 7', function () {
  assert.strictEqual(F.normalize('Cijena je ___ jednaka.'), 'Cijena je _______ jednaka.');
  assert.strictEqual(F.normalize('Cijena je __________ jednaka.'), 'Cijena je _______ jednaka.');
  assert.strictEqual(F.normalize('Već točno ' + F.MARK + '.'), 'Već točno ' + F.MARK + '.');
});

test('⛔ JEDNA i DVIJE podvlake ostaju netaknute (LaTeX indeks)', function () {
  const katex = 'At the market-clearing price, quantity demanded equals quantity ' + F.MARK + ' (\\(Q_d = Q_s\\)).';
  const out = F.normalize(katex);
  assert.strictEqual(out, katex, 'prava rečenica iz kataloga se NE SMIJE promijeniti');
  assert.strictEqual(F.count(out), 1, 'Q_d i Q_s nisu praznine');
  assert.strictEqual(F.normalize('x__y'), 'x__y');
  assert.strictEqual(F.normalize('\\(x_{1}\\)'), '\\(x_{1}\\)');
});

test('normalize podnosi null/undefined (ne baca)', function () {
  assert.strictEqual(F.normalize(null), '');
  assert.strictEqual(F.normalize(undefined), '');
});

// ── brojanje praznina (temelj zabrane druge praznine) ──
test('count: 0 / 1 / 2', function () {
  assert.strictEqual(F.count('Bez praznine.'), 0);
  assert.strictEqual(F.count('Jedna ' + F.MARK + ' praznina.'), 1);
  assert.strictEqual(F.count('Dvije ' + F.MARK + ' i ' + F.MARK + '.'), 2);
  assert.strictEqual(F.count('Ručno ___ i ____.'), 2, 'i ručno utipkane se broje nakon normalizacije');
});

// ── ubacivanje: označena riječ postaje praznina I odgovor ──
test('odabir riječi → praznina na njezinu mjestu, riječ vraćena kao odgovor', function () {
  const s = 'Ponuda i potražnja.';
  const r = F.insert(s, 9, 18); // "potražnja"
  assert.strictEqual(r.text, 'Ponuda i ' + F.MARK + '.');
  assert.strictEqual(r.word, 'potražnja');
  assert.strictEqual(r.caret, 9 + F.MARK.length);
});

test('bez odabira → praznina na mjestu pokazivača, riječ je prazna', function () {
  const r = F.insert('Ponuda i .', 9, 9);
  assert.strictEqual(r.text, 'Ponuda i ' + F.MARK + '.');
  assert.strictEqual(r.word, '');
});

test('obrnut raspon i raspon izvan teksta se podnose (bez bacanja)', function () {
  assert.strictEqual(F.insert('abc', 3, 1).text, 'a' + F.MARK, 'obrnut raspon = isti raspon, samo zamijenjenih krajeva');
  assert.strictEqual(F.insert('abc', 99, 99).text, 'abc' + F.MARK);
  assert.strictEqual(F.insert('abc', -5, -5).text, F.MARK + 'abc');
});

test('rezultat ubacivanja je odmah valjan po count()', function () {
  const r = F.insert('Ponuda i potražnja.', 9, 18);
  assert.strictEqual(F.count(r.text), 1);
});

console.log('\n' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
