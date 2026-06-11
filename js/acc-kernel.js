// ===== SOKRAT STUDY — ACCOUNTING KERNEL (čisti double-entry, bez DOM-a) =====
//
// Jezgra za `journal` tip vježbi: knjiženje debit/credit stavki, provjera ravnoteže,
// izvođenje završnih salda i zbrajanje po sekcijama (A = L + E). 100% čisto i node-testabilno.
// NEMA domenskih stringova — sve (računi, normalna strana, sekcija) dolazi iz `chartOfAccounts`.
//
// chartOfAccounts: [{ name, normal:'D'|'C', section:'asset'|'liability'|'equity'|'revenue'|'expense' }]
// entry:           { account, side:'D'|'C', amount:Number }

(function (root) {
    'use strict';

    // Cente (float-safe), kao u exercises-core (namjerno samostalno → kernel nema ovisnosti).
    function cents(x) {
        if (!Number.isFinite(x)) return NaN;
        const sign = x < 0 ? -1 : 1;
        return Math.round(Math.abs(x) * 100 + 1e-6) * sign;
    }
    function round2(x) { return cents(x) / 100; }

    function sumSide(entries, side) {
        return (entries || []).reduce((acc, e) =>
            acc + (e && e.side === side && Number.isFinite(e.amount) ? e.amount : 0), 0);
    }

    // Ravnoteža naloga: Σ debit === Σ credit (na razini centi).
    function isBalanced(entries) {
        return cents(sumSide(entries, 'D')) === cents(sumSide(entries, 'C'));
    }

    function findAccount(chart, name) {
        return (chart || []).find((c) => c.name === name) || null;
    }
    function normalOf(chart, name) {
        const a = findAccount(chart, name);
        return a ? a.normal : 'D'; // default: normalno debitni (asset/expense)
    }
    function sectionOf(chart, name) {
        const a = findAccount(chart, name);
        return a ? a.section : null;
    }

    // Završni saldi: za svaki račun beg + (knjiženje na normalnu stranu = +, suprotna = −).
    function deriveEndingBalances(begBalances, entries, chart) {
        const bal = Object.assign({}, begBalances || {});
        (chart || []).forEach((c) => { if (bal[c.name] == null) bal[c.name] = 0; });
        (entries || []).forEach((e) => {
            if (!e || !Number.isFinite(e.amount)) return;
            if (bal[e.account] == null) bal[e.account] = 0;
            const dir = (e.side === normalOf(chart, e.account)) ? 1 : -1;
            bal[e.account] = bal[e.account] + dir * e.amount;
        });
        Object.keys(bal).forEach((k) => { bal[k] = round2(bal[k]); });
        return bal;
    }

    // Alias (knjiženje i izvođenje salda su isti račun).
    function postEntries(begBalances, entries, chart) {
        return deriveEndingBalances(begBalances, entries, chart);
    }

    // Zbroji salda po sekciji + provjeri računovodstvenu jednadžbu A = L + E.
    function classifyTotals(balances, chart) {
        const t = { asset: 0, liability: 0, equity: 0, revenue: 0, expense: 0 };
        Object.keys(balances || {}).forEach((name) => {
            const sec = sectionOf(chart, name);
            if (sec && t[sec] != null) t[sec] += balances[name];
        });
        Object.keys(t).forEach((k) => { t[k] = round2(t[k]); });
        // čitljivi aliasi + provjera jednadžbe
        t.assets = t.asset;
        t.liabilities = t.liability;
        t.equationOk = cents(t.asset) === cents(t.liability + t.equity);
        return t;
    }

    // Po-računu T-saldi za vizual: { account: {debits, credits, balance, normal, section} }.
    function tAccounts(begBalances, entries, chart) {
        const names = {};
        (chart || []).forEach((c) => { names[c.name] = true; });
        (entries || []).forEach((e) => { if (e && e.account) names[e.account] = true; });
        Object.keys(begBalances || {}).forEach((n) => { names[n] = true; });
        const ending = deriveEndingBalances(begBalances, entries, chart);
        const out = {};
        Object.keys(names).forEach((name) => {
            out[name] = {
                debits: round2(sumOf(entries, name, 'D')),
                credits: round2(sumOf(entries, name, 'C')),
                balance: ending[name] != null ? ending[name] : 0,
                normal: normalOf(chart, name),
                section: sectionOf(chart, name)
            };
        });
        return out;
    }
    function sumOf(entries, account, side) {
        return (entries || []).reduce((a, e) =>
            a + (e && e.account === account && e.side === side && Number.isFinite(e.amount) ? e.amount : 0), 0);
    }

    // Ocjena slobodnog naloga PO ZAVRŠNIM SALDIMA (free mode). Pure → node-testabilno.
    // Točno = nalog uravnotežen I svaki očekivani saldo postignut (na razini centi).
    function gradeEndingBalances(begBalances, entries, chart, expected) {
        const balanced = isBalanced(entries);
        const ending = deriveEndingBalances(begBalances, entries, chart);
        const accounts = Object.keys(expected || {});
        const perField = accounts.map((name) => {
            const got = ending[name] != null ? ending[name] : 0;
            return { key: name, ok: cents(got) === cents(expected[name]), expected: expected[name], got: got };
        });
        const score = perField.filter((p) => p.ok).length;
        return {
            score: score, max: accounts.length, perField: perField,
            correct: balanced && accounts.length > 0 && score === accounts.length,
            balanced: balanced, ending: ending
        };
    }

    const AccKernel = {
        cents, round2, sumSide, isBalanced,
        normalOf, sectionOf, postEntries, deriveEndingBalances, classifyTotals,
        tAccounts, gradeEndingBalances
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = AccKernel;
    if (root) root.AccKernel = AccKernel;
})(typeof window !== 'undefined' ? window : null);
