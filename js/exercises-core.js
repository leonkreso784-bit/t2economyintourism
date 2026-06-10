// ===== SOKRAT STUDY — EXERCISES CORE (čiste funkcije, bez DOM-a) =====
//
// JEZGRA Exercises enginea: parsiranje i usporedba brojeva + multiset ocjenjivanje.
// NEMA DOM-a, NEMA domenskih (engl./hr) stringova → 100% node-testabilno i reusable.
// Sadržaj (tekstovi, računi, jezik) NIKAD nije ovdje — to ide u data/<subject>/exercises.js.
//
// Izvozi se i na `window.ExercisesCore` (browser, koristi ga js/exercises.js) i preko
// `module.exports` (node testovi: tests/unit/exercises-core.test.js).
//
// Konvencije (vidi docs/EXERCISES_ENGINE.md §3): u DATA su iznosi čisti Number; korisnički
// unos se normalizira preko parseAmount; novac se uspoređuje na razini centi; nikad == na float.

(function (root) {
    'use strict';

    // --- Zaokruživanje na cente (interna pomoćna) ----------------------------
    // Vrati iznos u cijelim centima (Number). Mali ε prema predznaku rješava
    // klasičan float-rub (npr. 1.005 * 100 = 100.4999…) deterministički.
    function toCents(x) {
        if (!Number.isFinite(x)) return NaN;
        const sign = x < 0 ? -1 : 1;
        return Math.round(Math.abs(x) * 100 + 1e-6) * sign;
    }

    // --- parseAmount(input) → Number | NaN -----------------------------------
    // Normalizira korisnički unos iznosa. Podržava:
    //   "120000" "120,000" "120.000" → 120000        (grupiranje tisuća: . , ili razmak)
    //   "63.60" "63,60"               → 63.6          (jedan decimalni separator)
    //   "1,234.56" "1.234,56"         → 1234.56       (US i EU mješavina)
    //   "$120,000.00" " 120 000,50 "  → 120000 / 120000.5  (valuta/razmaci se ignoriraju)
    //   "(50)" "-50"                  → -50           (zagrade = negativno, računovodstvo)
    //   "" "abc"                      → NaN
    //
    // Pravilo razrješenja dvosmislenosti (jedan separator, 3 znamenke iza = grupiranje;
    // ako su prisutna OBA separatora, ZADNJI je decimalni). Vidi testove za rubne slučajeve.
    function parseAmount(input) {
        if (typeof input === 'number') return Number.isFinite(input) ? input : NaN;
        if (input == null) return NaN;
        let s = String(input).trim();
        if (s === '') return NaN;

        s = s.replace(/\s/g, ''); // razmaci (i tanki/non-break) = grupiranje → makni

        // Predznak: vodeći +/- ili računovodstvene zagrade (50) = -50
        let neg = false;
        if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
        if (s[0] === '-') { neg = !neg; s = s.slice(1); }
        else if (s[0] === '+') { s = s.slice(1); }

        s = s.replace(/[^0-9.,]/g, ''); // makni valutu/slova; ostaju znamenke + . ,
        if (s === '') return NaN;

        const lastDot = s.lastIndexOf('.');
        const lastComma = s.lastIndexOf(',');
        let decimalPos = -1;

        if (lastDot !== -1 && lastComma !== -1) {
            // Oba prisutna → zadnji separator je decimalni, drugi je grupiranje.
            decimalPos = Math.max(lastDot, lastComma);
        } else if (lastDot !== -1 || lastComma !== -1) {
            const ch = lastDot !== -1 ? '.' : ',';
            const pos = lastDot !== -1 ? lastDot : lastComma;
            const occurrences = s.split(ch).length - 1;
            const trailing = s.length - pos - 1;
            // Jedan separator s točno 3 znamenke iza = grupiranje tisuća (npr. "120,000").
            // Inače (≠3 znamenke iza) = decimalni. Više od jednog = grupiranje.
            if (occurrences === 1 && trailing !== 3) decimalPos = pos;
        }

        let intPart = decimalPos === -1 ? s : s.slice(0, decimalPos);
        let fracPart = decimalPos === -1 ? '' : s.slice(decimalPos + 1);
        intPart = intPart.replace(/[.,]/g, '');
        fracPart = fracPart.replace(/[.,]/g, '');
        if (intPart === '' && fracPart === '') return NaN;

        const num = Number((intPart || '0') + (fracPart ? '.' + fracPart : ''));
        if (!Number.isFinite(num)) return NaN;
        return neg ? -num : num;
    }

    // --- formatAmount(n, opts) → string --------------------------------------
    // Prikaz iznosa (rješenja, hintovi). Default: 2 decimale + grupiranje tisuća.
    // opts: { decimals=2, currency='', groupSep=',', decimalSep='.' } — jezik prikaza
    // (npr. EU: groupSep:'.', decimalSep:',') dolazi iz content packa, ne hardkodirano.
    function formatAmount(n, opts) {
        if (!Number.isFinite(n)) return '';
        opts = opts || {};
        const decimals = opts.decimals != null ? opts.decimals : 2;
        const groupSep = opts.groupSep != null ? opts.groupSep : ',';
        const decimalSep = opts.decimalSep != null ? opts.decimalSep : '.';
        const currency = opts.currency || '';

        const neg = n < 0;
        const fixed = Math.abs(n).toFixed(decimals);
        const parts = fixed.split('.');
        let intStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
        let out = intStr + (parts[1] ? decimalSep + parts[1] : '');
        if (currency) out = currency + out;
        return (neg ? '-' : '') + out;
    }

    // --- numEq(a, b, tol) → bool ---------------------------------------------
    // Apsolutna tolerancija (default 0.005). Za omjere/postotke `tol` dolazi po polju.
    // `a` smije biti string (parsira se) ili Number; `b` je očekivani Number.
    function numEq(a, b, tol) {
        if (tol == null) tol = 0.005;
        const x = typeof a === 'number' ? a : parseAmount(a);
        return Number.isFinite(x) && Number.isFinite(b) && Math.abs(x - b) <= tol + 1e-9;
    }

    // --- numEqMoney(a, b) → bool ---------------------------------------------
    // Usporedba novca na razini centi (zaokruži oba pa usporedi cijele cente).
    function numEqMoney(a, b) {
        const x = typeof a === 'number' ? a : parseAmount(a);
        if (!Number.isFinite(x) || !Number.isFinite(b)) return false;
        return toCents(x) === toCents(b);
    }

    // --- canonicalKey(value) → string (interna; za multiset usporedbu) -------
    // Stabilan ključ neovisan o redoslijedu polja, velikim/malim slovima, razmacima
    // i float-reprezentaciji novca (brojevi → cente). Objekti se sortiraju po ključu.
    function canonicalKey(value) {
        if (value === null || value === undefined) return '∅';
        const t = typeof value;
        if (t === 'number') return 'n:' + (Number.isFinite(value) ? toCents(value) : 'NaN');
        if (t === 'boolean') return 'b:' + value;
        if (t === 'string') return 's:' + value.trim().toLowerCase().replace(/\s+/g, ' ');
        if (Array.isArray(value)) return '[' + value.map(canonicalKey).join(',') + ']';
        const keys = Object.keys(value).sort();
        return '{' + keys.map((k) => k + '=' + canonicalKey(value[k])).join('|') + '}';
    }

    // --- gradeSet(expected[], got[], keyFn?) → rezultat ----------------------
    // Redoslijed-neovisna (multiset) usporedba dvije liste stavki — za knjiženje
    // (debit/credit linije) i klasifikaciju. Vraća koliko se stavki poklapa.
    //   { score, max, correct, missing, extra }
    // - score   = broj poklopljenih stavki (min count po ključu)
    // - max     = expected.length
    // - correct = sve točno I bez viška (got se poklapa s expected kao multiset)
    // - missing = neunesene očekivane stavke
    // - extra   = suvišne (pogrešne/dodatne) unesene stavke
    function gradeSet(expected, got, keyFn) {
        const key = keyFn || canonicalKey;
        expected = Array.isArray(expected) ? expected : [];
        got = Array.isArray(got) ? got : [];

        const expCount = new Map();
        expected.forEach((e) => { const k = key(e); expCount.set(k, (expCount.get(k) || 0) + 1); });
        const gotCount = new Map();
        got.forEach((g) => { const k = key(g); gotCount.set(k, (gotCount.get(k) || 0) + 1); });

        let matched = 0;
        expCount.forEach((c, k) => { matched += Math.min(c, gotCount.get(k) || 0); });

        return {
            score: matched,
            max: expected.length,
            correct: matched === expected.length && got.length === expected.length,
            missing: Math.max(0, expected.length - matched),
            extra: Math.max(0, got.length - matched)
        };
    }

    // --- seededRandom(seed) → fn() ∈ [0,1) ----------------------------------
    // Deterministički PRNG (mulberry32). Isti seed ⇒ isti niz brojeva. Koristi se za
    // parametrizirane vježbe (gumb "New numbers" daje novi seed; rješenje je reproducibilno).
    function seededRandom(seed) {
        let a = (seed >>> 0) || 1;
        return function () {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // --- pickParams(spec, seed) → { key: value } -----------------------------
    // Deterministički odabir konkretnih parametara iz spec-a (za randomizirane vježbe).
    // Spec po ključu:
    //   { min, max, step? }   → broj iz raspona (step default 1; decimalni step podržan)
    //   { choices: [...] }     → jedan element iz liste
    //   literal (number/...)   → fiksna vrijednost (passthrough)
    // Redoslijed ključeva = redoslijed izvlačenja → isti seed daje identičan rezultat.
    function pickParams(spec, seed) {
        const out = {};
        if (!spec || typeof spec !== 'object') return out;
        const rnd = seededRandom(seed == null ? 1 : seed);
        Object.keys(spec).forEach((key) => {
            const d = spec[key];
            if (d != null && Array.isArray(d.choices)) {
                const i = Math.floor(rnd() * d.choices.length);
                out[key] = d.choices[Math.min(i, d.choices.length - 1)];
            } else if (d != null && typeof d.min === 'number' && typeof d.max === 'number') {
                const step = d.step != null ? d.step : 1;
                const steps = Math.floor((d.max - d.min) / step + 1e-9);
                const k = Math.floor(rnd() * (steps + 1));
                let v = d.min + k * step;
                if (!Number.isInteger(step)) v = Math.round(v * 1e6) / 1e6;
                out[key] = Math.min(v, d.max);
            } else {
                out[key] = d; // literal / fiksna vrijednost
            }
        });
        return out;
    }

    const ExercisesCore = {
        parseAmount,
        formatAmount,
        numEq,
        numEqMoney,
        gradeSet,
        canonicalKey,
        toCents,
        seededRandom,
        pickParams
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = ExercisesCore;
    if (root) root.ExercisesCore = ExercisesCore;
})(typeof window !== 'undefined' ? window : null);
