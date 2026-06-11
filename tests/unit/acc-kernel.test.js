/* eslint-disable no-console */
// ===== Node unit testovi za js/acc-kernel.js (double-entry jezgra) =====
// Pokreni: `npm run test:unit` (uključeno) ili: node tests/unit/acc-kernel.test.js

const assert = require('assert');
const path = require('path');
const K = require(path.join(__dirname, '..', '..', 'js', 'acc-kernel.js'));

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); passed++; console.log('  ✓ ' + name); }
    catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== acc-kernel ===\n');

const chart = [
    { name: 'Cash', normal: 'D', section: 'asset' },
    { name: 'Equipment', normal: 'D', section: 'asset' },
    { name: 'Note Payable', normal: 'C', section: 'liability' },
    { name: 'Common Stock', normal: 'C', section: 'equity' }
];
const entries = [
    { account: 'Cash', side: 'D', amount: 50000 }, { account: 'Common Stock', side: 'C', amount: 50000 },
    { account: 'Cash', side: 'D', amount: 15000 }, { account: 'Note Payable', side: 'C', amount: 15000 },
    { account: 'Equipment', side: 'D', amount: 4000 }, { account: 'Cash', side: 'C', amount: 4000 }
];

test('isBalanced: balanced ledger', () => assert.ok(K.isBalanced(entries)));
test('isBalanced: unbalanced when a credit is dropped', () =>
    assert.ok(!K.isBalanced(entries.slice(0, 5))));
test('sumSide: debits and credits both 69,000', () => {
    assert.strictEqual(K.sumSide(entries, 'D'), 69000);
    assert.strictEqual(K.sumSide(entries, 'C'), 69000);
});

test('deriveEndingBalances: correct per-account balances', () => {
    const bal = K.deriveEndingBalances({}, entries, chart);
    assert.strictEqual(bal['Cash'], 61000);       // 50,000 + 15,000 − 4,000
    assert.strictEqual(bal['Equipment'], 4000);
    assert.strictEqual(bal['Note Payable'], 15000);
    assert.strictEqual(bal['Common Stock'], 50000);
});

test('deriveEndingBalances: honours beginning balances', () => {
    const bal = K.deriveEndingBalances({ Cash: 1000 }, entries, chart);
    assert.strictEqual(bal['Cash'], 62000);
});

test('classifyTotals: A = L + E holds (65,000 = 15,000 + 50,000)', () => {
    const bal = K.deriveEndingBalances({}, entries, chart);
    const t = K.classifyTotals(bal, chart);
    assert.strictEqual(t.assets, 65000);
    assert.strictEqual(t.liabilities, 15000);
    assert.strictEqual(t.equity, 50000);
    assert.ok(t.equationOk);
});

test('contra/credit-to-asset reduces asset balance', () => {
    // Pay 4,000 cash again (credit Cash) without matching debit → Cash falls
    const bal = K.deriveEndingBalances({ Cash: 10000 }, [{ account: 'Cash', side: 'C', amount: 4000 }], chart);
    assert.strictEqual(bal['Cash'], 6000);
});

test('cents: float-safe rounding', () => {
    assert.strictEqual(K.round2(0.1 + 0.2), 0.3);
});

test('tAccounts: per-account debits/credits/balance', () => {
    const t = K.tAccounts({}, entries, chart);
    assert.strictEqual(t['Cash'].debits, 65000);   // 50,000 + 15,000
    assert.strictEqual(t['Cash'].credits, 4000);
    assert.strictEqual(t['Cash'].balance, 61000);
    assert.strictEqual(t['Common Stock'].credits, 50000);
    assert.strictEqual(t['Common Stock'].balance, 50000);
});

const expectedEnding = { Cash: 61000, Equipment: 4000, 'Note Payable': 15000, 'Common Stock': 50000 };
test('gradeEndingBalances: correct ledger → correct', () => {
    const r = K.gradeEndingBalances({}, entries, chart, expectedEnding);
    assert.ok(r.correct && r.balanced && r.score === 4 && r.max === 4);
});
test('gradeEndingBalances: order-independent (shuffled entries)', () => {
    const shuffled = [entries[5], entries[0], entries[3], entries[1], entries[4], entries[2]];
    const r = K.gradeEndingBalances({}, shuffled, chart, expectedEnding);
    assert.ok(r.correct);
});
test('gradeEndingBalances: unbalanced ledger → not correct even if some balances match', () => {
    const r = K.gradeEndingBalances({}, entries.slice(0, 5), chart, expectedEnding);
    assert.ok(!r.correct && r.balanced === false);
});
test('gradeEndingBalances: wrong amount flags that account', () => {
    const bad = entries.map((e, i) => i === 0 ? { account: 'Cash', side: 'D', amount: 40000 } : e);
    // now debit side total changes → unbalanced; Cash balance also wrong
    const r = K.gradeEndingBalances({}, bad, chart, expectedEnding);
    const cash = r.perField.find((p) => p.key === 'Cash');
    assert.ok(cash.ok === false);
    assert.ok(!r.correct);
});

console.log('\n========================================');
console.log(`Prošlo: ${passed} · Palo: ${failed}`);
if (failed === 0) { console.log('✅ acc-kernel: svi testovi prolaze.\n'); process.exit(0); }
else { console.log('❌ acc-kernel: ima padova — popravi prije nastavka.\n'); process.exit(1); }
