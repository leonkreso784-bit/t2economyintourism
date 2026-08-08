/* eslint-disable no-console */
// ===== Node unit test za js/card-limits.js (M5a — mjera duljine kartice) =====
// Pokreni: node tests/unit/card-limits.test.js
// Shim-obrazac (kao blocks-renderer/draft-store): klasična skripta kroz new Function('window', code).
//
// Naglasak je na RUBOVIMA praga, jer je „strop 500" odluka koja se lako izvede za jedan znak krivo:
// 500 mora PROĆI, 501 mora pasti. Isto za mekani prag 200.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== card-limits (M5a) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'card-limits.js'), 'utf8');
const win = {};
new Function('window', code)(win);
const L = win.SokratCardLimits;

const rep = (n) => 'x'.repeat(n);

// ── izvoz i pragovi ──
test('izvezen na window s pragovima i funkcijama', function () {
  assert.strictEqual(typeof L, 'object');
  assert.strictEqual(L.SOFT, 200);
  assert.strictEqual(L.HARD, 500);
  assert.strictEqual(typeof L.measure, 'function');
  assert.strictEqual(typeof L.allows, 'function');
});

// ── mekani prag: upozorava, NE blokira ──
test('200 znakova je jos `ok` (prag je iskljuciv)', function () {
  const m = L.measure(rep(200));
  assert.strictEqual(m.len, 200);
  assert.strictEqual(m.state, 'ok');
  assert.strictEqual(m.blocked, false);
});

test('201 prelazi u `warn` ali se i dalje SMIJE spremiti', function () {
  const m = L.measure(rep(201));
  assert.strictEqual(m.state, 'warn');
  assert.strictEqual(m.blocked, false);
  assert.strictEqual(L.allows(rep(201)), true);
});

test('mekani prag ne blokira ni na 499', function () {
  assert.strictEqual(L.measure(rep(499)).state, 'warn');
  assert.strictEqual(L.allows(rep(499)), true);
});

// ── tvrdi strop: rub na jedan znak ──
test('TOCNO 500 jos prolazi', function () {
  const m = L.measure(rep(500));
  assert.strictEqual(m.len, 500);
  assert.strictEqual(m.state, 'warn');
  assert.strictEqual(m.blocked, false);
  assert.strictEqual(L.allows(rep(500)), true);
});

test('501 je `over` i BLOKIRA spremanje', function () {
  const m = L.measure(rep(501));
  assert.strictEqual(m.state, 'over');
  assert.strictEqual(m.blocked, true);
  assert.strictEqual(L.allows(rep(501)), false);
});

// ── mjeri se PODREZANA duljina (editor sprema value.trim()) ──
test('vodeci/prateci razmaci se NE broje — inace bi brojac i kocnica rekli razlicito', function () {
  assert.strictEqual(L.measure('   ' + rep(500) + '   ').len, 500);
  assert.strictEqual(L.allows('  ' + rep(500) + '  '), true);
  assert.strictEqual(L.measure('  ' + rep(501) + '  ').blocked, true);
});

test('sami razmaci = duljina 0', function () {
  assert.strictEqual(L.measure('      ').len, 0);
  assert.strictEqual(L.measure('      ').state, 'ok');
});

// ── neispravan ulaz ne smije rusiti editor ──
test('null/undefined/broj/objekt se mjere kao 0, bez bacanja', function () {
  [null, undefined, 42, {}, [], true].forEach(function (v) {
    const m = L.measure(v);
    assert.strictEqual(m.len, 0, 'ulaz ' + JSON.stringify(v));
    assert.strictEqual(m.blocked, false);
  });
});

// ── allows() nad vise polja (pitanje + odgovor) ──
test('allows() pada ako BILO KOJE polje probije strop', function () {
  assert.strictEqual(L.allows(rep(10), rep(10)), true);
  assert.strictEqual(L.allows(rep(501), rep(10)), false, 'dugo pitanje mora blokirati');
  assert.strictEqual(L.allows(rep(10), rep(501)), false, 'dug odgovor mora blokirati');
  assert.strictEqual(L.allows(rep(501), rep(501)), false);
});

test('allows() bez argumenata je istina (nema sto blokirati)', function () {
  assert.strictEqual(L.allows(), true);
});

// ── politika je JEDNA definicija: editor i validator moraju citati IZ modula ──
test('editor ne drzi vlastitu kopiju brojeva 200/500', function () {
  const ed = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'admin-editors.js'), 'utf8');
  assert.ok(/SokratCardLimits/.test(ed), 'admin-editors.js mora citati politiku iz modula');
  // Goli prag u editoru bi bio druga kopija istine (BUG-023 obrazac).
  assert.ok(!/\b(?:200|500)\b\s*(?:>|<|>=|<=)/.test(ed) && !/(?:>|<|>=|<=)\s*\b(?:200|500)\b/.test(ed),
    'admin-editors.js ne smije usporedjivati s golim pragom — pragovi zive u card-limits.js');
});

console.log('\n' + passed + ' prošlo, ' + failed + ' palo');
process.exit(failed ? 1 : 0);
