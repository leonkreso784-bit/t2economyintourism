/* eslint-disable no-console */
// ===== Node unit testovi za js/exercises-core.js =====
// Pokreni: `npm run test:unit`  (ili: node tests/unit/exercises-core.test.js)
// Bez frameworka — mali runner + node `assert`. Izlaz != 0 ako ijedan test padne.
// Ovo je najjeftinija zaštita "bez bugova" za jezgru ocjenjivanja (vidi docs/EXERCISES_ENGINE.md §3).

const assert = require('assert');
const path = require('path');
const {
    parseAmount, formatAmount, numEq, numEqMoney, gradeSet, toCents, seededRandom, pickParams
} = require(path.join(__dirname, '..', '..', 'js', 'exercises-core.js'));

let passed = 0;
let failed = 0;
function test(name, fn) {
    try { fn(); passed++; console.log('  ✓ ' + name); }
    catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== exercises-core ===\n');

// ---------------------------------------------------------------- parseAmount
test('parseAmount: plain integer', () => assert.strictEqual(parseAmount('120000'), 120000));
test('parseAmount: US thousands comma', () => assert.strictEqual(parseAmount('120,000'), 120000));
test('parseAmount: EU thousands dot', () => assert.strictEqual(parseAmount('120.000'), 120000));
test('parseAmount: dot decimal (2)', () => assert.strictEqual(parseAmount('63.60'), 63.6));
test('parseAmount: comma decimal (2)', () => assert.strictEqual(parseAmount('63,60'), 63.6));
test('parseAmount: US full 1,234.56', () => assert.strictEqual(parseAmount('1,234.56'), 1234.56));
test('parseAmount: EU full 1.234,56', () => assert.strictEqual(parseAmount('1.234,56'), 1234.56));
test('parseAmount: big EU 1.234.567,89', () => assert.strictEqual(parseAmount('1.234.567,89'), 1234567.89));
test('parseAmount: multi comma thousands', () => assert.strictEqual(parseAmount('1,234,567'), 1234567));
test('parseAmount: currency + grouping', () => assert.strictEqual(parseAmount('$120,000.00'), 120000));
test('parseAmount: spaces as grouping', () => assert.strictEqual(parseAmount('  120 000,50 '), 120000.5));
test('parseAmount: leading decimal .5', () => assert.strictEqual(parseAmount('.5'), 0.5));
test('parseAmount: trailing dot 5.', () => assert.strictEqual(parseAmount('5.'), 5));
test('parseAmount: negative sign', () => assert.strictEqual(parseAmount('-50'), -50));
test('parseAmount: accounting parentheses', () => assert.strictEqual(parseAmount('(50)'), -50));
test('parseAmount: parentheses + currency', () => assert.strictEqual(parseAmount('($1,250.00)'), -1250));
test('parseAmount: empty → NaN', () => assert.ok(Number.isNaN(parseAmount(''))));
test('parseAmount: letters → NaN', () => assert.ok(Number.isNaN(parseAmount('abc'))));
test('parseAmount: null → NaN', () => assert.ok(Number.isNaN(parseAmount(null))));
test('parseAmount: passes through Number', () => assert.strictEqual(parseAmount(63.6), 63.6));

// ---------------------------------------------------------------- formatAmount
test('formatAmount: default 2dp + grouping', () => assert.strictEqual(formatAmount(120000), '120,000.00'));
test('formatAmount: decimals', () => assert.strictEqual(formatAmount(63.6), '63.60'));
test('formatAmount: currency', () => assert.strictEqual(formatAmount(1250, { currency: '$' }), '$1,250.00'));
test('formatAmount: zero decimals', () => assert.strictEqual(formatAmount(1234, { decimals: 0 }), '1,234'));
test('formatAmount: EU locale separators', () =>
    assert.strictEqual(formatAmount(1234567.89, { groupSep: '.', decimalSep: ',', currency: '€' }), '€1.234.567,89'));
test('formatAmount: negative', () => assert.strictEqual(formatAmount(-50.5), '-50.50'));
test('formatAmount: non-finite → empty', () => assert.strictEqual(formatAmount(NaN), ''));

// ---------------------------------------------------------------- numEq
test('numEq: exact', () => assert.ok(numEq(1.9, 1.9)));
test('numEq: within default tol', () => assert.ok(numEq(1.902, 1.9)));
test('numEq: at boundary 0.005', () => assert.ok(numEq(1.905, 1.9)));
test('numEq: outside default tol', () => assert.ok(!numEq(1.92, 1.9)));
test('numEq: custom tol pass', () => assert.ok(numEq(1.95, 1.9, 0.1)));
test('numEq: parses string input', () => assert.ok(numEq('1.9', 1.9)));
test('numEq: NaN input → false', () => assert.ok(!numEq('abc', 1.9)));

// ---------------------------------------------------------------- numEqMoney
test('numEqMoney: exact', () => assert.ok(numEqMoney(259700, 259700)));
test('numEqMoney: cents float-safe', () => assert.ok(numEqMoney(63.6, 63.60)));
test('numEqMoney: rounds to cents', () => assert.ok(numEqMoney(63.604, 63.60)));
test('numEqMoney: 0.1+0.2 vs 0.3', () => assert.ok(numEqMoney(0.1 + 0.2, 0.3)));
test('numEqMoney: differs by a cent → false', () => assert.ok(!numEqMoney(63.61, 63.60)));
test('numEqMoney: string input', () => assert.ok(numEqMoney('120,000.00', 120000)));
test('numEqMoney: negative', () => assert.ok(numEqMoney(-1250, -1250)));
test('toCents: classic 1.005 boundary', () => assert.strictEqual(toCents(1.005), 101));

// ---------------------------------------------------------------- gradeSet
const exp = [
    { account: 'Cash', side: 'D', amount: 3000 },
    { account: 'Accounts Payable', side: 'C', amount: 3000 }
];
test('gradeSet: same order → correct', () => {
    const r = gradeSet(exp, [
        { account: 'Cash', side: 'D', amount: 3000 },
        { account: 'Accounts Payable', side: 'C', amount: 3000 }
    ]);
    assert.ok(r.correct && r.score === 2 && r.max === 2 && r.missing === 0 && r.extra === 0);
});
test('gradeSet: reversed order → still correct (order-independent)', () => {
    const r = gradeSet(exp, [
        { account: 'Accounts Payable', side: 'C', amount: 3000 },
        { account: 'Cash', side: 'D', amount: 3000 }
    ]);
    assert.ok(r.correct && r.score === 2);
});
test('gradeSet: case/space insensitive account name', () => {
    const r = gradeSet(exp, [
        { account: '  cash ', side: 'D', amount: 3000 },
        { account: 'accounts payable', side: 'C', amount: 3000 }
    ]);
    assert.ok(r.correct && r.score === 2);
});
test('gradeSet: money float-safe (3000.00 matches 3000)', () => {
    const r = gradeSet(exp, [
        { account: 'Cash', side: 'D', amount: 3000.0 },
        { account: 'Accounts Payable', side: 'C', amount: 3000.004 }
    ]);
    assert.ok(r.correct);
});
test('gradeSet: one wrong → score 1, not correct', () => {
    const r = gradeSet(exp, [
        { account: 'Cash', side: 'C', amount: 3000 }, // wrong side
        { account: 'Accounts Payable', side: 'C', amount: 3000 }
    ]);
    assert.ok(!r.correct && r.score === 1 && r.missing === 1 && r.extra === 1);
});
test('gradeSet: missing entry', () => {
    const r = gradeSet(exp, [{ account: 'Cash', side: 'D', amount: 3000 }]);
    assert.ok(!r.correct && r.score === 1 && r.max === 2 && r.missing === 1 && r.extra === 0);
});
test('gradeSet: extra entry', () => {
    const r = gradeSet(exp, [
        { account: 'Cash', side: 'D', amount: 3000 },
        { account: 'Accounts Payable', side: 'C', amount: 3000 },
        { account: 'Sales', side: 'C', amount: 500 }
    ]);
    assert.ok(!r.correct && r.score === 2 && r.extra === 1);
});
test('gradeSet: duplicate handling (multiset)', () => {
    const e = [{ a: 1 }, { a: 1 }];
    const r1 = gradeSet(e, [{ a: 1 }]);          // only one of two duplicates
    assert.ok(r1.score === 1 && r1.missing === 1);
    const r2 = gradeSet(e, [{ a: 1 }, { a: 1 }]); // both
    assert.ok(r2.correct && r2.score === 2);
});
test('gradeSet: classify rows (cls + effect)', () => {
    const e = [{ account: 'Cash', cls: 'A', effect: 'I' }, { account: 'Note Payable', cls: 'L', effect: 'I' }];
    const r = gradeSet(e, [{ account: 'Note Payable', cls: 'L', effect: 'I' }, { account: 'Cash', cls: 'A', effect: 'I' }]);
    assert.ok(r.correct);
});

// ---------------------------------------------------------------- seededRandom
test('seededRandom: same seed → same sequence', () => {
    const a = seededRandom(42); const b = seededRandom(42);
    for (let i = 0; i < 20; i++) assert.strictEqual(a(), b());
});
test('seededRandom: values in [0,1)', () => {
    const r = seededRandom(7);
    for (let i = 0; i < 100; i++) { const v = r(); assert.ok(v >= 0 && v < 1); }
});
test('seededRandom: different seeds differ', () => {
    assert.notStrictEqual(seededRandom(1)(), seededRandom(2)());
});

// ---------------------------------------------------------------- pickParams
const depSpec = {
    cost: { min: 10000, max: 50000, step: 1000 },
    life: { choices: [3, 5, 7, 10] },
    salvage: { min: 0, max: 5000, step: 500 },
    method: 'straight-line'
};
test('pickParams: deterministic for a seed', () => {
    assert.deepStrictEqual(pickParams(depSpec, 123), pickParams(depSpec, 123));
});
test('pickParams: respects range + step', () => {
    for (let seed = 0; seed < 50; seed++) {
        const p = pickParams(depSpec, seed);
        assert.ok(p.cost >= 10000 && p.cost <= 50000 && p.cost % 1000 === 0);
        assert.ok(p.salvage >= 0 && p.salvage <= 5000 && p.salvage % 500 === 0);
    }
});
test('pickParams: choices come from list', () => {
    for (let seed = 0; seed < 50; seed++) {
        assert.ok(depSpec.life.choices.includes(pickParams(depSpec, seed).life));
    }
});
test('pickParams: literal passthrough', () => {
    assert.strictEqual(pickParams(depSpec, 9).method, 'straight-line');
});
test('pickParams: decimal step float-clean', () => {
    const p = pickParams({ rate: { min: 0, max: 1, step: 0.1 } }, 5);
    assert.ok(p.rate >= 0 && p.rate <= 1);
    assert.ok(Math.abs(p.rate * 10 - Math.round(p.rate * 10)) < 1e-9); // multiple of 0.1
});
test('pickParams: empty/invalid spec → {}', () => {
    assert.deepStrictEqual(pickParams(null, 1), {});
});

// ---------------------------------------------------------------- rezultat
console.log('\n========================================');
console.log(`Prošlo: ${passed} · Palo: ${failed}`);
if (failed === 0) {
    console.log('✅ exercises-core: svi testovi prolaze.\n');
    process.exit(0);
} else {
    console.log('❌ exercises-core: ima padova — popravi prije nastavka.\n');
    process.exit(1);
}
