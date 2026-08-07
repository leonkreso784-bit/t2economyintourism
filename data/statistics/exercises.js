// ===== STATISTICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski podaci za interaktivne, auto-ocjenjive vježbe
// statistike. Generički engine (js/exercises-core.js, js/exercises.js, css/exercises.css)
// ne sadrži NIŠTA odavde — vidi docs/architecture/EXERCISES_ENGINE.md §2 (schema/tipovi) + §3 (konvencije)
// i docs/subjects/STATISTICS_PLAN.md (cigla-po-cigla plan, TRACK B).
//
// Tipovi koje koristi statistika: numeric / choice / ratio (NE journal/classify/statement).
// Matematika za rješenja (normalCdf, z/t tablice) doći će u data/statistics/stat-lib.js
// (B1) i učitavat će se PRIJE ove datoteke. Elementarna aritmetika ide inline u solve().
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* je immutable).
//
// B0 (žica): SKELETON — prazna lista. Tab "Exercises" se pojavi (prazno stanje); sadržaj
//            se autorira po temi u FAZI B2 (T1–T9). meta.currency='' (statistika nije novac).

// Pristup stat-lib matematici iz solve()/generate(): u pregledniku je window.StatLib
// (učitan PRIJE ove datoteke preko content.scripts); u nodeu (testovi) require relativno.
var SL = (typeof window !== 'undefined' && window.StatLib) ? window.StatLib
  : (typeof require !== 'undefined' ? require('./stat-lib.js') : null);

const statisticsExercises = {
  meta: { lang: 'en', currency: '', version: 1 },
  exercises: [
    // ============================================================================
    // B2.1 — T1–T2 DESCRIPTIVE STATISTICS (first-midterm)
    //   Data types & graphs (T1) + central tendency / variation (T2).
    //   Concepts (choice) + computation (numeric/ratio) + 4 randomized drills.
    //   Numbers: clean or exact; answers cross-checked by hand. chapter 1 = describing
    //   data (graphical), chapter 2 = describing data (numerical).
    // ============================================================================

    // --- T1–T2 concepts (TF + MC) ---------------------------------------------
    {
      id: 't1-2-concepts',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Describing Data — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'Nominal data fall into categories with no natural order.', kind: 'tf', answer: true },
        { q: 'The number of rooms booked in a hotel is a discrete numerical variable.', kind: 'tf', answer: true },
        { q: 'Temperature in °C is measured on a ratio scale.', kind: 'tf', answer: false },
        { q: 'A histogram is the appropriate graph for categorical data.', kind: 'tf', answer: false },
        { q: 'The median is more resistant to outliers than the mean.', kind: 'tf', answer: true },
        { q: 'For bell-shaped data, the empirical rule says about 95% of values lie within ±2 standard deviations.', kind: 'tf', answer: true },
        { q: 'Chebyshev’s theorem requires the data to be bell-shaped.', kind: 'tf', answer: false },
        { q: 'The coefficient of variation is unit-free, so it compares variability across different scales.', kind: 'tf', answer: true },
        { q: 'Which measure of center is the most frequently occurring value?', kind: 'mc', options: ['Mean', 'Median', 'Mode', 'Range'], answer: 2 },
        { q: 'A satisfaction rating from 1 (low) to 5 (high) is measured on which scale?', kind: 'mc', options: ['Nominal', 'Ordinal', 'Interval', 'Ratio'], answer: 1 }
      ],
      solution: [
        'Temperature in °C is interval, not ratio — 0 °C is not “no temperature”, so ratios are meaningless.',
        'Histograms are for numerical data; categorical data use bar/pie/Pareto charts.',
        'The empirical rule (68–95–99.7) needs a bell shape; Chebyshev works for ANY shape.'
      ]
    },

    // --- Central tendency & range (numeric, fixed data) -----------------------
    {
      id: 't2-center-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Mean, Median, Mode & Range',
      prompt: 'For the sample 12, 7, 9, 7, 15, compute the mean, median, mode and range.',
      difficulty: 1,
      fields: [
        { key: 'mean', label: 'Mean', answer: 10, tol: 0.01, unit: '', hint: 'Sum ÷ n = 50 ÷ 5' },
        { key: 'median', label: 'Median', answer: 9, tol: 0.01, unit: '', hint: 'Middle value of the ordered data: 7, 7, 9, 12, 15' },
        { key: 'mode', label: 'Mode', answer: 7, tol: 0.01, unit: '', hint: 'The most frequent value' },
        { key: 'range', label: 'Range', answer: 8, tol: 0.01, unit: '', hint: 'Max − Min = 15 − 7' }
      ],
      solution: [
        'Mean = (12 + 7 + 9 + 7 + 15) ÷ 5 = 50 ÷ 5 = 10.',
        'Ordered: 7, 7, 9, 12, 15 → median = 9 (the middle, 3rd, value).',
        'Mode = 7 (it occurs twice). Range = 15 − 7 = 8.'
      ]
    },

    // --- Variance, SD & CV (numeric, fixed data — the learn worked example) ---
    {
      id: 't2-spread-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Variance, Standard Deviation & CV',
      prompt: 'For the sample 5, 9, 10, 2, 7, 9, 14 (mean = 8), compute the sample variance, the sample standard '
        + 'deviation and the coefficient of variation (%). Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'var', label: 'Sample variance s²', answer: 14.6667, tol: 0.05, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = 88 ÷ 6' },
        { key: 'sd', label: 'Sample standard deviation s', answer: 3.8297, tol: 0.05, unit: '', hint: '√(s²) = √14.67' },
        { key: 'cv', label: 'Coefficient of variation', answer: 47.871, tol: 0.05, unit: '%', hint: '(s ÷ x̄) × 100 = (3.83 ÷ 8) × 100' }
      ],
      solution: [
        'Deviations from 8: −3, 1, 2, −6, −1, 1, 6 → squared: 9, 1, 4, 36, 1, 1, 36; sum = 88.',
        's² = 88 ÷ (7 − 1) = 88 ÷ 6 = 14.67.',
        's = √14.67 = 3.83.   CV = (3.83 ÷ 8) × 100 = 47.87%.'
      ]
    },

    // --- IQR & range from quartiles (ratio, given values) ---------------------
    {
      id: 't2-iqr-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'ratio',
      title: 'Interquartile Range & Range',
      prompt: 'Using the five-number summary below, compute the interquartile range (IQR) and the range.',
      difficulty: 1,
      givens: [
        { label: 'Minimum', value: 12 },
        { label: 'First quartile Q₁', value: 24 },
        { label: 'Third quartile Q₃', value: 39 },
        { label: 'Maximum', value: 58 }
      ],
      fields: [
        { key: 'iqr', label: 'Interquartile range', answer: 15, tol: 0.01, unit: '', hint: 'Q₃ − Q₁ = 39 − 24' },
        { key: 'range', label: 'Range', answer: 46, tol: 0.01, unit: '', hint: 'Max − Min = 58 − 12' }
      ],
      solution: [
        'IQR = Q₃ − Q₁ = 39 − 24 = 15 (spread of the middle 50%).',
        'Range = Max − Min = 58 − 12 = 46.'
      ]
    },

    // --- RANDOMIZED: standard deviation of a small sample ---------------------
    {
      id: 't2-sd-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Standard Deviation — Drill',
      prompt: 'Compute the mean, sample variance and sample standard deviation of the data set below.',
      difficulty: 2,
      params: {
        a: { min: 2, max: 18, step: 1 },
        b: { min: 2, max: 18, step: 1 },
        c: { min: 2, max: 18, step: 1 },
        d: { min: 2, max: 18, step: 1 },
        e: { min: 2, max: 18, step: 1 }
      },
      generate(p) {
        const xs = [p.a, p.b, p.c, p.d, p.e];
        const n = xs.length;
        const mean = xs.reduce((s, x) => s + x, 0) / n;
        const ss = xs.reduce((s, x) => s + (x - mean) * (x - mean), 0);
        const variance = ss / (n - 1);
        const sd = Math.sqrt(variance);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'For the sample ' + xs.join(', ') + ', compute the mean, the sample variance s² and the sample '
            + 'standard deviation s (divide by n − 1). Round to 1 decimal place.',
          fields: [
            { key: 'mean', label: 'Mean x̄', answer: mean, tol: 0.05, unit: '', hint: 'Sum ÷ 5' },
            { key: 'var', label: 'Sample variance s²', answer: variance, tol: 0.05, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = Σ(x − x̄)² ÷ 4' },
            { key: 'sd', label: 'Sample standard deviation s', answer: sd, tol: 0.05, unit: '', hint: '√(s²)' }
          ],
          solution: [
            'Mean = (' + xs.join(' + ') + ') ÷ 5 = ' + r2(mean) + '.',
            'Sum of squared deviations from the mean = ' + r2(ss) + '.',
            's² = ' + r2(ss) + ' ÷ 4 = ' + r2(variance) + ';   s = √' + r2(variance) + ' = ' + r2(sd) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for a fresh sample. Mean = Σx ÷ n; s² = Σ(x − x̄)² ÷ (n − 1); s = √(s²).']
    },

    // --- RANDOMIZED: coefficient of variation from mean & SD ------------------
    {
      id: 't2-cv-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Coefficient of Variation — Drill',
      prompt: 'Compute the coefficient of variation from the mean and standard deviation below.',
      difficulty: 1,
      params: {
        mean: { min: 40, max: 200, step: 5 },
        sd: { min: 4, max: 40, step: 2 }
      },
      generate(p) {
        const cv = (p.sd / p.mean) * 100;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A data set has mean ' + p.mean + ' and standard deviation ' + p.sd + '. Compute the coefficient '
            + 'of variation (%). Round to 1 decimal place.',
          fields: [
            { key: 'cv', label: 'Coefficient of variation', answer: cv, tol: 0.05, unit: '%', hint: '(s ÷ x̄) × 100' }
          ],
          solution: ['CV = (s ÷ x̄) × 100 = (' + p.sd + ' ÷ ' + p.mean + ') × 100 = ' + r2(cv) + '%.']
        };
      },
      solution: ['Press “New numbers” for fresh values. CV = (standard deviation ÷ mean) × 100, expressed as a percent.']
    },

    // --- RANDOMIZED: Chebyshev minimum fraction within k SD -------------------
    {
      id: 't2-chebyshev-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Chebyshev’s Theorem — Drill',
      prompt: 'Use Chebyshev’s theorem to find the minimum percentage within k standard deviations.',
      difficulty: 2,
      params: { k: { choices: [2, 3, 4, 5] } },
      generate(p) {
        const pct = (1 - 1 / (p.k * p.k)) * 100;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'By Chebyshev’s theorem, at least what percentage of ANY data set lies within k = ' + p.k
            + ' standard deviations of the mean? Round to 1 decimal place.',
          fields: [
            { key: 'pct', label: 'Minimum percentage within k SD', answer: pct, tol: 0.05, unit: '%', hint: '(1 − 1 ÷ k²) × 100' }
          ],
          solution: ['At least (1 − 1 ÷ k²) × 100 = (1 − 1 ÷ ' + p.k + '²) × 100 = ' + r2(pct) + '%.']
        };
      },
      solution: ['Press “New numbers” for a fresh k. Chebyshev: at least (1 − 1 ÷ k²) of the data lie within k SD of the mean (k > 1).']
    },

    // --- RANDOMIZED: class width for a frequency distribution -----------------
    {
      id: 't1-classwidth-random',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'numeric',
      title: 'Class Width — Drill',
      prompt: 'Compute the class width for a frequency distribution.',
      difficulty: 1,
      params: {
        minV: { min: 0, max: 40, step: 5 },
        span: { min: 40, max: 120, step: 5 },
        k: { choices: [5, 6, 8] }
      },
      generate(p) {
        const maxV = p.minV + p.span;
        const width = Math.ceil(p.span / p.k);
        return {
          prompt: 'The data range from ' + p.minV + ' to ' + maxV + '. Using ' + p.k + ' classes, compute the class '
            + 'width (round UP to a whole number).',
          fields: [
            { key: 'width', label: 'Class width', answer: width, tol: 0, unit: '', hint: '⌈(Max − Min) ÷ k⌉ = ⌈' + p.span + ' ÷ ' + p.k + '⌉' }
          ],
          solution: ['Width = (Max − Min) ÷ k = (' + maxV + ' − ' + p.minV + ') ÷ ' + p.k + ' = ' + (p.span / p.k).toFixed(2) + ' → round up to ' + width + '.']
        };
      },
      solution: ['Press “New numbers” for a fresh range. Class width = (Max − Min) ÷ number of classes, always rounded UP to a whole number.']
    },

    // ============================================================================
    // B2.2 — T3 PROBABILITY METHODS (first-midterm)
    //   Addition rule, complement, conditional probability, independence, combinations.
    //   Probabilities entered as decimals (0–1), rounded to 2 places (tol 0.01);
    //   combination counts are exact integers (tol 0). chapter 3.
    // ============================================================================

    // --- T3 concepts (TF + MC) ------------------------------------------------
    {
      id: 't3-concepts',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'choice',
      title: 'Probability — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The sample space is the set of ALL possible outcomes of a random experiment.', kind: 'tf', answer: true },
        { q: 'If two events are mutually exclusive, then P(A and B) = 0.', kind: 'tf', answer: true },
        { q: 'Mutually exclusive events are always independent.', kind: 'tf', answer: false },
        { q: 'For any event A, P(A) + P(not A) = 1.', kind: 'tf', answer: true },
        { q: 'If A and B are independent, then P(A and B) = P(A) × P(B).', kind: 'tf', answer: true },
        { q: 'A probability can be greater than 1 when an event is very likely.', kind: 'tf', answer: false },
        { q: 'The probability that at LEAST ONE of two events occurs uses the:', kind: 'mc', options: ['Multiplication rule', 'Addition rule', 'Complement only', 'Independence'], answer: 1 },
        { q: 'Choosing 3 people from 10 where order does NOT matter is counted with:', kind: 'mc', options: ['Permutations', 'Combinations', 'The addition rule', 'The complement'], answer: 1 },
        { q: 'If P(A | B) = P(A), then events A and B are:', kind: 'mc', options: ['Mutually exclusive', 'Independent', 'Complementary', 'Collectively exhaustive'], answer: 1 }
      ],
      solution: [
        'Mutually exclusive ≠ independent: exclusive events cannot both happen, so they are highly dependent.',
        'P(A or B) uses the addition rule P(A) + P(B) − P(A and B); independence means P(A | B) = P(A).'
      ]
    },

    // --- Addition rule, complement, conditional (numeric, fixed) --------------
    {
      id: 't3-addition-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Addition Rule, Complement & Conditional',
      prompt: 'In a store, P(asks for help) = 0.30, P(makes a purchase) = 0.20, and P(both) = 0.15. Compute the '
        + 'following probabilities as decimals, rounded to 2 places.',
      difficulty: 2,
      fields: [
        { key: 'union', label: 'P(asks for help OR makes a purchase)', answer: 0.35, tol: 0.01, unit: '', hint: 'P(A) + P(B) − P(A and B) = 0.30 + 0.20 − 0.15' },
        { key: 'notHelp', label: 'P(does NOT ask for help)', answer: 0.70, tol: 0.01, unit: '', hint: 'Complement: 1 − P(A)' },
        { key: 'purchGivenHelp', label: 'P(purchase | asked for help)', answer: 0.50, tol: 0.01, unit: '', hint: 'P(A and B) ÷ P(A) = 0.15 ÷ 0.30' }
      ],
      solution: [
        'P(A or B) = 0.30 + 0.20 − 0.15 = 0.35.',
        'P(not A) = 1 − 0.30 = 0.70.',
        'P(B | A) = P(A and B) ÷ P(A) = 0.15 ÷ 0.30 = 0.50.',
        'Check independence: P(A)·P(B) = 0.30 × 0.20 = 0.06 ≠ 0.15, so the events are NOT independent.'
      ]
    },

    // --- Combinations (numeric, fixed) ----------------------------------------
    {
      id: 't3-combinations-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Counting with Combinations',
      prompt: 'Compute the number of unordered ways to choose the items. Use C(n, k) = n! ÷ [k!(n − k)!].',
      difficulty: 2,
      fields: [
        { key: 'c103', label: 'C(10, 3)', answer: 120, tol: 0, unit: '', hint: '(10 × 9 × 8) ÷ (3 × 2 × 1)' },
        { key: 'c62', label: 'C(6, 2)', answer: 15, tol: 0, unit: '', hint: '(6 × 5) ÷ (2 × 1)' },
        { key: 'c80', label: 'C(8, 0)', answer: 1, tol: 0, unit: '', hint: 'Choosing none: exactly 1 way (0! = 1)' }
      ],
      solution: [
        'C(10, 3) = (10 × 9 × 8) ÷ (3 × 2 × 1) = 720 ÷ 6 = 120.',
        'C(6, 2) = (6 × 5) ÷ (2 × 1) = 30 ÷ 2 = 15.',
        'C(8, 0) = 1 (there is exactly one way to choose nothing).'
      ]
    },

    // --- Contingency table → marginal/joint/conditional (ratio, fixed) --------
    {
      id: 't3-crosstable-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'ratio',
      title: 'Probabilities from a Cross Table',
      prompt: 'A survey of 100 guests cross-classifies them by whether they are Members (A) and whether they Booked online (B), '
        + 'as shown. Compute the probabilities as decimals, rounded to 2 places.',
      difficulty: 2,
      givens: [
        { label: 'Member & Booked online', value: 30 },
        { label: 'Member & did NOT book online', value: 10 },
        { label: 'Non-member & Booked online', value: 20 },
        { label: 'Non-member & did NOT book online', value: 40 },
        { label: 'Total guests', value: 100 }
      ],
      fields: [
        { key: 'pA', label: 'P(Member)', answer: 0.40, tol: 0.01, unit: '', hint: '(30 + 10) ÷ 100' },
        { key: 'pAandB', label: 'P(Member AND Booked online)', answer: 0.30, tol: 0.01, unit: '', hint: '30 ÷ 100' },
        { key: 'pAgivenB', label: 'P(Member | Booked online)', answer: 0.60, tol: 0.01, unit: '', hint: '30 ÷ (30 + 20) = 30 ÷ 50' }
      ],
      solution: [
        'P(Member) = (30 + 10) ÷ 100 = 0.40.',
        'P(Member and Booked) = 30 ÷ 100 = 0.30.',
        'P(Member | Booked) = 30 ÷ 50 = 0.60 (restrict to the 50 who booked online).'
      ]
    },

    // --- RANDOMIZED: addition rule + conditional ------------------------------
    {
      id: 't3-addition-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Addition Rule — Drill',
      prompt: 'Compute P(A or B) and P(A | B) from the probabilities below.',
      difficulty: 2,
      params: {
        a: { choices: [20, 30, 40, 50] },
        b: { choices: [20, 30, 40, 50] },
        ov: { choices: [5, 10, 15] }
      },
      generate(p) {
        const pAB = Math.min(p.ov, p.a, p.b); // overlap ≤ each marginal (always = ov here)
        const union = (p.a + p.b - pAB) / 100;
        const aGivenB = pAB / p.b;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'For two events, P(A) = ' + (p.a / 100).toFixed(2) + ', P(B) = ' + (p.b / 100).toFixed(2)
            + ', and P(A and B) = ' + (pAB / 100).toFixed(2) + '. Compute P(A or B) and P(A | B) as decimals, '
            + 'rounded to 2 places.',
          fields: [
            { key: 'union', label: 'P(A or B)', answer: union, tol: 0.01, unit: '', hint: 'P(A) + P(B) − P(A and B)' },
            { key: 'aGivenB', label: 'P(A | B)', answer: aGivenB, tol: 0.01, unit: '', hint: 'P(A and B) ÷ P(B)' }
          ],
          solution: [
            'P(A or B) = ' + (p.a / 100).toFixed(2) + ' + ' + (p.b / 100).toFixed(2) + ' − ' + (pAB / 100).toFixed(2) + ' = ' + r2(union) + '.',
            'P(A | B) = P(A and B) ÷ P(B) = ' + (pAB / 100).toFixed(2) + ' ÷ ' + (p.b / 100).toFixed(2) + ' = ' + r2(aGivenB) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh probabilities. P(A or B) = P(A) + P(B) − P(A and B); P(A | B) = P(A and B) ÷ P(B).']
    },

    // --- RANDOMIZED: combinations ---------------------------------------------
    {
      id: 't3-combinations-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Combinations — Drill',
      prompt: 'Compute the combination below.',
      difficulty: 2,
      params: {
        n: { choices: [5, 6, 7, 8, 9, 10] },
        k: { choices: [2, 3] }
      },
      generate(p) {
        const c = SL ? SL.combinations(p.n, p.k) : 0;
        return {
          prompt: 'In how many unordered ways can you choose ' + p.k + ' items from ' + p.n + '? Compute C(' + p.n + ', ' + p.k + ').',
          fields: [
            { key: 'c', label: 'C(' + p.n + ', ' + p.k + ')', answer: c, tol: 0, unit: '', hint: 'n! ÷ [k!(n − k)!]' }
          ],
          solution: ['C(' + p.n + ', ' + p.k + ') = ' + p.n + '! ÷ [' + p.k + '!(' + p.n + ' − ' + p.k + ')!] = ' + c + '.']
        };
      },
      solution: ['Press “New numbers” for a fresh combination. C(n, k) = n! ÷ [k!(n − k)!] counts unordered selections.']
    },

    // ============================================================================
    // B2.3 — T4 DISCRETE RANDOM VARIABLES (first-midterm)
    //   Expected value & variance of a distribution; binomial P(x), μ=nP, σ²=nP(1−P);
    //   Poisson P(x)=e^(−λ)λ^x/x!, μ=σ²=λ. Probabilities → 2 dp (tol 0.01); E(X)/μ/σ²/σ
    //   are descriptive numbers → 1 dp (tol 0.05). Binomial reuses SL.combinations;
    //   Poisson uses Math.exp + a tiny inline factorial (elementary → inline). chapter 4.
    // ============================================================================

    // --- T4 concepts (TF + MC) ------------------------------------------------
    {
      id: 't4-concepts',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'Discrete Random Variables — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'A discrete random variable can take only a countable number of values.', kind: 'tf', answer: true },
        { q: 'For a discrete probability distribution, the probabilities P(x) must sum to 1.', kind: 'tf', answer: true },
        { q: 'The expected value E(X) is always one of the possible values of X.', kind: 'tf', answer: false },
        { q: 'In a binomial experiment, the success probability P stays constant across all trials.', kind: 'tf', answer: true },
        { q: 'The binomial distribution requires the trials to be dependent.', kind: 'tf', answer: false },
        { q: 'For the Poisson distribution, the mean and the variance are equal.', kind: 'tf', answer: true },
        { q: 'The variance of a binomial distribution is nP.', kind: 'tf', answer: false },
        { q: 'The mean of a binomial distribution is:', kind: 'mc', options: ['nP(1 − P)', 'nP', 'λ', 'P / n'], answer: 1 },
        { q: 'The number of arrivals at a hotel front desk per hour is best modeled by the:', kind: 'mc', options: ['Binomial distribution', 'Poisson distribution', 'Normal distribution', 'Uniform distribution'], answer: 1 },
        { q: 'The expected value of X is computed as:', kind: 'mc', options: ['Σ x', 'Σ P(x)', 'Σ x·P(x)', '√λ'], answer: 2 }
      ],
      solution: [
        'E(X) is a probability-weighted average, so it need NOT equal any single possible value (e.g. average 1.7 children).',
        'Binomial: fixed n, two outcomes, CONSTANT P, INDEPENDENT trials; its variance is nP(1 − P), not nP.',
        'Poisson models counts of events in a fixed interval and has μ = σ² = λ.'
      ]
    },

    // --- Expected value, variance & SD from a distribution table (numeric) ----
    {
      id: 't4-expected-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Expected Value, Variance & SD',
      prompt: 'A hotel records the number of suites sold per day, X, with the distribution '
        + 'P(0) = 0.10, P(1) = 0.30, P(2) = 0.40, P(3) = 0.20. Compute E(X), the variance σ² and the standard '
        + 'deviation σ. Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'ex', label: 'Expected value E(X)', answer: 1.7, tol: 0.05, unit: '', hint: 'Σ x·P(x) = 0(0.10) + 1(0.30) + 2(0.40) + 3(0.20)' },
        { key: 'var', label: 'Variance σ²', answer: 0.81, tol: 0.05, unit: '', hint: 'Σ (x − μ)²·P(x), with μ = 1.7' },
        { key: 'sd', label: 'Standard deviation σ', answer: 0.9, tol: 0.05, unit: '', hint: '√(σ²)' }
      ],
      solution: [
        'E(X) = 0(0.10) + 1(0.30) + 2(0.40) + 3(0.20) = 0 + 0.30 + 0.80 + 0.60 = 1.7.',
        'σ² = (0−1.7)²(0.10) + (1−1.7)²(0.30) + (2−1.7)²(0.40) + (3−1.7)²(0.20) = 0.289 + 0.147 + 0.036 + 0.338 = 0.81.',
        'σ = √0.81 = 0.9.'
      ]
    },

    // --- Binomial: P(x), mean, variance (numeric, fixed) ----------------------
    {
      id: 't4-binomial-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Binomial Distribution',
      prompt: 'Each guest cancels with probability P = 0.30, independently. For n = 6 guests, let X be the number of '
        + 'cancellations. Compute P(X = 2) (2 decimals), the mean μ and the variance σ² (1 decimal).',
      difficulty: 2,
      fields: [
        { key: 'p2', label: 'P(X = 2)', answer: 0.324135, tol: 0.01, unit: '', hint: 'C(6,2)·0.30²·0.70⁴ = 15 · 0.09 · 0.2401' },
        { key: 'mean', label: 'Mean μ', answer: 1.8, tol: 0.05, unit: '', hint: 'μ = nP = 6 × 0.30' },
        { key: 'var', label: 'Variance σ²', answer: 1.26, tol: 0.05, unit: '', hint: 'σ² = nP(1 − P) = 6 × 0.30 × 0.70' }
      ],
      solution: [
        'P(X = 2) = C(6, 2)·0.30²·0.70⁴ = 15 × 0.09 × 0.2401 = 0.3241 ≈ 0.32.',
        'μ = nP = 6 × 0.30 = 1.8.',
        'σ² = nP(1 − P) = 6 × 0.30 × 0.70 = 1.26 ≈ 1.3.'
      ]
    },

    // --- Poisson: P(x) and SD (numeric, fixed) --------------------------------
    {
      id: 't4-poisson-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Poisson Distribution',
      prompt: 'Calls arrive at a reception desk at an average rate of λ = 2 per minute (Poisson). Compute P(X = 0) and '
        + 'P(X = 1) as decimals (2 places), and the standard deviation σ (1 decimal). Use e ≈ 2.71828.',
      difficulty: 2,
      fields: [
        { key: 'p0', label: 'P(X = 0)', answer: Math.exp(-2), tol: 0.01, unit: '', hint: 'e^(−2)·2⁰ ÷ 0! = e^(−2)' },
        { key: 'p1', label: 'P(X = 1)', answer: 2 * Math.exp(-2), tol: 0.01, unit: '', hint: 'e^(−2)·2¹ ÷ 1! = 2·e^(−2)' },
        { key: 'sd', label: 'Standard deviation σ', answer: Math.sqrt(2), tol: 0.05, unit: '', hint: 'σ = √λ = √2' }
      ],
      solution: [
        'P(X = 0) = e^(−2)·2⁰ ÷ 0! = e^(−2) = 0.1353 ≈ 0.14.',
        'P(X = 1) = e^(−2)·2¹ ÷ 1! = 2 × 0.1353 = 0.2707 ≈ 0.27.',
        'For Poisson, σ² = λ = 2, so σ = √2 = 1.41 ≈ 1.4.'
      ]
    },

    // --- RANDOMIZED: expected value & variance of a 3-value distribution ------
    {
      id: 't4-expected-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Expected Value — Drill',
      prompt: 'Compute the expected value, variance and standard deviation of the distribution below.',
      difficulty: 2,
      params: {
        a: { choices: [0, 1, 2] },
        b: { choices: [3, 4, 5] },
        c: { choices: [6, 7, 8] }
      },
      generate(p) {
        const xs = [p.a, p.b, p.c];
        const ps = [0.2, 0.5, 0.3];
        const mean = xs.reduce((s, x, i) => s + x * ps[i], 0);
        const variance = xs.reduce((s, x, i) => s + (x - mean) * (x - mean) * ps[i], 0);
        const sd = Math.sqrt(variance);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A discrete random variable X has P(' + p.a + ') = 0.2, P(' + p.b + ') = 0.5, P(' + p.c + ') = 0.3. '
            + 'Compute E(X), the variance σ² and the standard deviation σ. Round to 1 decimal place.',
          fields: [
            { key: 'ex', label: 'Expected value E(X)', answer: mean, tol: 0.05, unit: '', hint: 'Σ x·P(x)' },
            { key: 'var', label: 'Variance σ²', answer: variance, tol: 0.05, unit: '', hint: 'Σ (x − μ)²·P(x)' },
            { key: 'sd', label: 'Standard deviation σ', answer: sd, tol: 0.05, unit: '', hint: '√(σ²)' }
          ],
          solution: [
            'E(X) = ' + p.a + '(0.2) + ' + p.b + '(0.5) + ' + p.c + '(0.3) = ' + r2(mean) + '.',
            'σ² = Σ (x − μ)²·P(x) = ' + r2(variance) + ';   σ = √' + r2(variance) + ' = ' + r2(sd) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for a fresh distribution. E(X) = Σ x·P(x); σ² = Σ (x − μ)²·P(x); σ = √(σ²).']
    },

    // --- RANDOMIZED: binomial P(x), mean, variance ----------------------------
    {
      id: 't4-binomial-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Binomial Distribution — Drill',
      prompt: 'Compute a binomial probability together with the mean and variance.',
      difficulty: 3,
      params: {
        n: { choices: [5, 6, 7, 8] },
        Pp: { choices: [20, 30, 40, 50] }, // success probability in % (kept integer for clean prompts)
        x: { choices: [1, 2, 3] }
      },
      generate(p) {
        const P = p.Pp / 100;
        const n = p.n, x = p.x;
        const cnx = SL ? SL.combinations(n, x) : 0;
        const prob = cnx * Math.pow(P, x) * Math.pow(1 - P, n - x);
        const mean = n * P;
        const variance = n * P * (1 - P);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'In a binomial experiment with n = ' + n + ' trials and success probability P = ' + P.toFixed(2)
            + ', compute P(X = ' + x + ') (2 decimals), the mean μ and the variance σ² (1 decimal).',
          fields: [
            { key: 'px', label: 'P(X = ' + x + ')', answer: prob, tol: 0.01, unit: '', hint: 'C(' + n + ',' + x + ')·P^' + x + '·(1−P)^' + (n - x) },
            { key: 'mean', label: 'Mean μ', answer: mean, tol: 0.05, unit: '', hint: 'μ = nP' },
            { key: 'var', label: 'Variance σ²', answer: variance, tol: 0.05, unit: '', hint: 'σ² = nP(1 − P)' }
          ],
          solution: [
            'P(X = ' + x + ') = C(' + n + ', ' + x + ')·' + P.toFixed(2) + '^' + x + '·' + (1 - P).toFixed(2) + '^' + (n - x) + ' = ' + cnx + ' × ' + r2(Math.pow(P, x)) + ' × ' + r2(Math.pow(1 - P, n - x)) + ' = ' + r2(prob) + '.',
            'μ = nP = ' + n + ' × ' + P.toFixed(2) + ' = ' + r2(mean) + ';   σ² = nP(1 − P) = ' + r2(variance) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. P(x) = C(n, x)·Pˣ·(1 − P)ⁿ⁻ˣ;   μ = nP;   σ² = nP(1 − P).']
    },

    // --- RANDOMIZED: Poisson P(x) and SD --------------------------------------
    {
      id: 't4-poisson-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Poisson Distribution — Drill',
      prompt: 'Compute a Poisson probability and the standard deviation.',
      difficulty: 3,
      params: {
        lam: { choices: [1, 2, 3, 4] },
        x: { choices: [0, 1, 2] }
      },
      generate(p) {
        const lam = p.lam, x = p.x;
        let fact = 1;
        for (let i = 2; i <= x; i++) fact *= i; // x ≤ 2 → 0!=1!=1, 2!=2
        const prob = Math.exp(-lam) * Math.pow(lam, x) / fact;
        const sd = Math.sqrt(lam);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Events occur at an average rate of λ = ' + lam + ' (Poisson). Compute P(X = ' + x + ') as a decimal '
            + '(2 places) and the standard deviation σ (1 decimal). Use e ≈ 2.71828.',
          fields: [
            { key: 'px', label: 'P(X = ' + x + ')', answer: prob, tol: 0.01, unit: '', hint: 'e^(−λ)·λ^' + x + ' ÷ ' + x + '!' },
            { key: 'sd', label: 'Standard deviation σ', answer: sd, tol: 0.05, unit: '', hint: 'σ = √λ' }
          ],
          solution: [
            'P(X = ' + x + ') = e^(−' + lam + ')·' + lam + '^' + x + ' ÷ ' + x + '! = ' + r2(prob) + '.',
            'σ = √λ = √' + lam + ' = ' + r2(sd) + ' (Poisson: μ = σ² = λ).'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. P(x) = e^(−λ)·λˣ ÷ x!;   for Poisson μ = σ² = λ, so σ = √λ.']
    },

    // ============================================================================
    // B2.4 — T5 CONTINUOUS RANDOM VARIABLES / NORMAL (first-midterm)
    //   Standardizing z = (x − μ)/σ; normal probabilities via the z-table
    //   (SL.normalCdf / normalSf / normalBetween); inverse "find x" via SL.zUpper.
    //   Probabilities & z-scores → 2 dp (tol 0.01); the inverse value x is in the
    //   variable's units → 1 dp (tol 0.05). z-values kept clean (±0.5/1/1.5/2) so a
    //   z-table lookup works. chapter 5.
    // ============================================================================

    // --- T5 concepts (TF + MC) ------------------------------------------------
    {
      id: 't5-concepts',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'Continuous & Normal — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'For a continuous random variable, the probability of any single exact value is 0.', kind: 'tf', answer: true },
        { q: 'Probability for a continuous variable is the AREA under the density curve.', kind: 'tf', answer: true },
        { q: 'The total area under a probability density function equals 1.', kind: 'tf', answer: true },
        { q: 'In a normal distribution the mean, median and mode are equal.', kind: 'tf', answer: true },
        { q: 'The standard normal distribution has mean 0 and standard deviation 1.', kind: 'tf', answer: true },
        { q: 'A negative z-score means the value is above the mean.', kind: 'tf', answer: false },
        { q: 'By the empirical rule, about 95% of values lie within ±1 standard deviation of the mean.', kind: 'tf', answer: false },
        { q: 'The z-score of x is computed as:', kind: 'mc', options: ['xμ', '(x − μ)/σ', 'σ/μ', 'x − σ'], answer: 1 },
        { q: 'If the z-table gives P(Z < z), then P(Z > z) equals:', kind: 'mc', options: ['P(Z < z)', '1 − P(Z < z)', '2·P(Z < z)', 'z'], answer: 1 },
        { q: 'For X ~ N(80, 100) (variance 100), the standard deviation is:', kind: 'mc', options: ['100', '10', '80', '1'], answer: 1 }
      ],
      solution: [
        'A negative z means BELOW the mean; the empirical rule is 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ.',
        'Standardize with z = (x − μ)/σ; the table gives the left tail P(Z < z), so the right tail is its complement.',
        'Variance 100 → σ = √100 = 10.'
      ]
    },

    // --- z-score and tail probabilities (numeric, fixed) ----------------------
    {
      id: 't5-zscore-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Standardizing & Tail Probabilities',
      prompt: 'Guest spending is normally distributed with mean μ = 70 and standard deviation σ = 10. For X = 85, '
        + 'compute the z-score, P(X < 85) and P(X > 85). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'z', label: 'z-score', answer: 1.5, tol: 0.01, unit: '', hint: 'z = (85 − 70) ÷ 10' },
        { key: 'pLess', label: 'P(X < 85)', answer: SL.normalCdf(1.5), tol: 0.01, unit: '', hint: 'P(Z < 1.5) from the z-table ≈ 0.9332' },
        { key: 'pMore', label: 'P(X > 85)', answer: SL.normalSf(1.5), tol: 0.01, unit: '', hint: '1 − P(Z < 1.5)' }
      ],
      solution: [
        'z = (85 − 70) ÷ 10 = 1.5.',
        'P(X < 85) = P(Z < 1.5) = 0.9332 ≈ 0.93.',
        'P(X > 85) = 1 − 0.9332 = 0.0668 ≈ 0.07.'
      ]
    },

    // --- Probability between two values (numeric, fixed) ----------------------
    {
      id: 't5-between-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Probability Between Two Values',
      prompt: 'A process has output X ~ N(μ = 500, σ = 100). Compute P(400 < X < 650) using the z-table. '
        + 'Give probabilities to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'zLow', label: 'z for 400', answer: -1.0, tol: 0.01, unit: '', hint: '(400 − 500) ÷ 100' },
        { key: 'zHigh', label: 'z for 650', answer: 1.5, tol: 0.01, unit: '', hint: '(650 − 500) ÷ 100' },
        { key: 'prob', label: 'P(400 < X < 650)', answer: SL.normalBetween(-1.0, 1.5), tol: 0.01, unit: '', hint: 'P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587' }
      ],
      solution: [
        'z₁ = (400 − 500) ÷ 100 = −1.0;   z₂ = (650 − 500) ÷ 100 = 1.5.',
        'P(400 < X < 650) = P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587 = 0.7745 ≈ 0.77.'
      ]
    },

    // --- Empirical rule bounds (numeric, fixed) -------------------------------
    {
      id: 't5-empirical-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Empirical Rule (68–95–99.7)',
      prompt: 'IQ scores are normal with μ = 100 and σ = 15. Using the empirical rule, find the interval μ ± 2σ and the '
        + 'approximate percentage of values inside it.',
      difficulty: 1,
      fields: [
        { key: 'lower', label: 'Lower bound (μ − 2σ)', answer: 70, tol: 0, unit: '', hint: '100 − 2 × 15' },
        { key: 'upper', label: 'Upper bound (μ + 2σ)', answer: 130, tol: 0, unit: '', hint: '100 + 2 × 15' },
        { key: 'pct', label: 'Approx. % within μ ± 2σ', answer: 95, tol: 0, unit: '%', hint: 'Empirical rule: ≈ 95% within ±2 SD' }
      ],
      solution: [
        'μ − 2σ = 100 − 30 = 70;   μ + 2σ = 100 + 30 = 130.',
        'By the empirical rule, about 95% of values lie within ±2 standard deviations of the mean.'
      ]
    },

    // --- RANDOMIZED: z-score + tail probabilities -----------------------------
    {
      id: 't5-zscore-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Standardizing — Drill',
      prompt: 'Standardize the value and find the two tail probabilities.',
      difficulty: 2,
      params: {
        mu: { choices: [50, 60, 80, 100] },
        sigma: { choices: [10, 20] },
        zc: { choices: [-1.5, -1, 0.5, 1, 1.5, 2] }
      },
      generate(p) {
        const x = p.mu + p.zc * p.sigma; // chosen so z is exactly zc (clean for the table)
        const pLess = SL ? SL.normalCdf(p.zc) : 0;
        const pMore = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A variable is X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '). For X = ' + x + ', compute the z-score, '
            + 'P(X < ' + x + ') and P(X > ' + x + '). Use a z-table; give probabilities to 2 decimals.',
          fields: [
            { key: 'z', label: 'z-score', answer: p.zc, tol: 0.01, unit: '', hint: 'z = (x − μ) ÷ σ = (' + x + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'pLess', label: 'P(X < ' + x + ')', answer: pLess, tol: 0.01, unit: '', hint: 'P(Z < ' + p.zc + ') from the z-table' },
            { key: 'pMore', label: 'P(X > ' + x + ')', answer: pMore, tol: 0.01, unit: '', hint: '1 − P(Z < ' + p.zc + ')' }
          ],
          solution: [
            'z = (' + x + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.zc + '.',
            'P(X < ' + x + ') = P(Z < ' + p.zc + ') = ' + r2(pLess) + ';   P(X > ' + x + ') = 1 − ' + r2(pLess) + ' = ' + r2(pMore) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. z = (x − μ) ÷ σ; the z-table gives P(Z < z); the upper tail is 1 − P(Z < z).']
    },

    // --- RANDOMIZED: probability between two values ---------------------------
    {
      id: 't5-between-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Probability Between — Drill',
      prompt: 'Find the probability that X falls between the two given values.',
      difficulty: 3,
      params: {
        mu: { choices: [50, 60, 80, 100] },
        sigma: { choices: [10, 20] },
        z1: { choices: [-2, -1.5, -1] },
        z2: { choices: [0.5, 1, 1.5, 2] }
      },
      generate(p) {
        const a = p.mu + p.z1 * p.sigma;
        const b = p.mu + p.z2 * p.sigma;
        const prob = SL ? SL.normalBetween(p.z1, p.z2) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'For X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '), compute the z-scores of ' + a + ' and ' + b
            + ', then P(' + a + ' < X < ' + b + '). Use a z-table; give probabilities to 2 decimals.',
          fields: [
            { key: 'zLow', label: 'z for ' + a, answer: p.z1, tol: 0.01, unit: '', hint: '(' + a + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'zHigh', label: 'z for ' + b, answer: p.z2, tol: 0.01, unit: '', hint: '(' + b + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'prob', label: 'P(' + a + ' < X < ' + b + ')', answer: prob, tol: 0.01, unit: '', hint: 'P(Z < ' + p.z2 + ') − P(Z < ' + p.z1 + ')' }
          ],
          solution: [
            'z₁ = (' + a + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.z1 + ';   z₂ = (' + b + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.z2 + '.',
            'P(' + a + ' < X < ' + b + ') = P(Z < ' + p.z2 + ') − P(Z < ' + p.z1 + ') = ' + r2(prob) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. Standardize both ends, then P(a < X < b) = P(Z < z₂) − P(Z < z₁).']
    },

    // --- RANDOMIZED: inverse — find x for a given upper-tail area --------------
    {
      id: 't5-inverse-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Inverse Normal — Drill',
      prompt: 'Find the value x above which a given proportion of the distribution lies.',
      difficulty: 3,
      params: {
        mu: { choices: [400, 500, 600] },
        sigma: { choices: [10, 15, 20] },
        alpha: { choices: [0.10, 0.05, 0.025, 0.01] }
      },
      generate(p) {
        const z = SL ? SL.zUpper(p.alpha) : 0;
        const x = p.mu + z * p.sigma;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Scores are X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '). Find the score c such that '
            + 'P(X > c) = ' + p.alpha.toFixed(3) + '. Use the upper-tail critical value z = ' + z + '. Round to 1 decimal place.',
          fields: [
            { key: 'c', label: 'Score c', answer: x, tol: 0.05, unit: '', hint: 'c = μ + z·σ = ' + p.mu + ' + ' + z + ' × ' + p.sigma }
          ],
          solution: ['c = μ + z·σ = ' + p.mu + ' + ' + z + ' × ' + p.sigma + ' = ' + r2(x) + ' (' + (p.alpha * 100) + '% of scores exceed it).']
        };
      },
      solution: ['Press “New numbers” for fresh values. To find a cutoff for an upper-tail area α: c = μ + z_α·σ, where z_α is the critical z value.']
    },

    // ============================================================================
    // B2.5 — T6 SAMPLING DISTRIBUTIONS (first-midterm)
    //   Standard error of the mean σ_x̄ = σ/√n; z for x̄ = (x̄ − μ)/(σ/√n); standard
    //   error of a proportion σ_p̂ = √(P(1−P)/n); z for p̂ = (p̂ − P)/σ_p̂. Probabilities
    //   via SL.normalCdf/normalSf (engine untouched). Numbers chosen so SE is clean
    //   (n = perfect square; P ∈ {0.2, 0.5}) → z is exact, no rounding ambiguity.
    //   Probabilities & z → 2 dp (tol 0.01); SE → descriptive, 2 dp (tol 0.05). chapter 6.
    // ============================================================================

    // --- T6 concepts (TF + MC) ------------------------------------------------
    {
      id: 't6-concepts',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Sampling Distributions — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The standard error of the mean equals σ ÷ √n.', kind: 'tf', answer: true },
        { q: 'As the sample size increases, the standard error of the mean decreases.', kind: 'tf', answer: true },
        { q: 'The Central Limit Theorem requires the population itself to be normal.', kind: 'tf', answer: false },
        { q: 'The mean of the sampling distribution of x̄ equals the population mean μ.', kind: 'tf', answer: true },
        { q: 'The standard error of a sample proportion is √[P(1 − P) ÷ n].', kind: 'tf', answer: true },
        { q: 'For a normal population, x̄ is normal for any sample size n.', kind: 'tf', answer: true },
        { q: 'The sampling distribution of x̄ becomes WIDER as n grows.', kind: 'tf', answer: false },
        { q: 'The z-value for a sample mean uses which denominator?', kind: 'mc', options: ['σ', 'σ ÷ √n', 'n', 's²'], answer: 1 },
        { q: 'A common rule of thumb for the CLT to apply is:', kind: 'mc', options: ['n > 5', 'n > 25 (often n ≥ 30)', 'n > 500', 'n = 1'], answer: 1 },
        { q: 'The expected value of the sample proportion p̂ is:', kind: 'mc', options: ['P', '0', 'n', '1 − P'], answer: 0 }
      ],
      solution: [
        'The CLT makes x̄ approximately normal for large n even if the POPULATION is not normal.',
        'A larger n shrinks the standard error σ/√n, so the sampling distribution gets NARROWER (more precise).',
        'E(p̂) = P; standardize x̄ with σ/√n in the denominator.'
      ]
    },

    // --- Standard error of the mean (numeric, fixed) --------------------------
    {
      id: 't6-se-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Standard Error of the Mean',
      prompt: 'A population has standard deviation σ = 20. A random sample of n = 25 is taken. Compute the standard '
        + 'error of the sample mean. Round to 2 decimals.',
      difficulty: 1,
      fields: [
        { key: 'se', label: 'Standard error σ_x̄', answer: 4, tol: 0.05, unit: '', hint: 'σ ÷ √n = 20 ÷ √25 = 20 ÷ 5' }
      ],
      solution: ['σ_x̄ = σ ÷ √n = 20 ÷ √25 = 20 ÷ 5 = 4.00.']
    },

    // --- SE + z + tail probability for the mean (numeric, fixed) --------------
    {
      id: 't6-zmean-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Sampling Distribution of the Mean',
      prompt: 'A population has μ = 100 and σ = 15. For a sample of n = 9, compute the standard error, the z-value for '
        + 'x̄ = 105, and P(x̄ > 105). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'se', label: 'Standard error σ_x̄', answer: 5, tol: 0.05, unit: '', hint: '15 ÷ √9 = 15 ÷ 3' },
        { key: 'z', label: 'z-value for x̄ = 105', answer: 1.0, tol: 0.01, unit: '', hint: '(105 − 100) ÷ 5' },
        { key: 'pMore', label: 'P(x̄ > 105)', answer: SL.normalSf(1.0), tol: 0.01, unit: '', hint: '1 − P(Z < 1.0) = 1 − 0.8413' }
      ],
      solution: [
        'σ_x̄ = 15 ÷ √9 = 15 ÷ 3 = 5.',
        'z = (105 − 100) ÷ 5 = 1.0.',
        'P(x̄ > 105) = 1 − P(Z < 1.0) = 1 − 0.8413 = 0.1587 ≈ 0.16.'
      ]
    },

    // --- SE + z + tail probability for a proportion (numeric, fixed) ----------
    {
      id: 't6-proportion-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Sampling Distribution of a Proportion',
      prompt: 'A population proportion is P = 0.50. For a sample of n = 100, compute the standard error of p̂, the '
        + 'z-value for p̂ = 0.60, and P(p̂ > 0.60). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'se', label: 'Standard error σ_p̂', answer: 0.05, tol: 0.01, unit: '', hint: '√[P(1 − P) ÷ n] = √(0.25 ÷ 100)' },
        { key: 'z', label: 'z-value for p̂ = 0.60', answer: 2.0, tol: 0.01, unit: '', hint: '(0.60 − 0.50) ÷ 0.05' },
        { key: 'pMore', label: 'P(p̂ > 0.60)', answer: SL.normalSf(2.0), tol: 0.01, unit: '', hint: '1 − P(Z < 2.0) = 1 − 0.9772' }
      ],
      solution: [
        'σ_p̂ = √[0.50 × 0.50 ÷ 100] = √(0.0025) = 0.05.',
        'z = (0.60 − 0.50) ÷ 0.05 = 2.0.',
        'P(p̂ > 0.60) = 1 − P(Z < 2.0) = 1 − 0.9772 = 0.0228 ≈ 0.02.'
      ]
    },

    // --- RANDOMIZED: standard error of the mean -------------------------------
    {
      id: 't6-se-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Standard Error — Drill',
      prompt: 'Compute the standard error of the sample mean.',
      difficulty: 1,
      params: {
        sigma: { choices: [10, 15, 20, 25, 30] },
        n: { choices: [9, 16, 25, 100] }
      },
      generate(p) {
        const se = p.sigma / Math.sqrt(p.n);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A population has standard deviation σ = ' + p.sigma + '. For a sample of n = ' + p.n + ', compute the '
            + 'standard error of the sample mean. Round to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_x̄', answer: se, tol: 0.05, unit: '', hint: 'σ ÷ √n = ' + p.sigma + ' ÷ √' + p.n }
          ],
          solution: ['σ_x̄ = σ ÷ √n = ' + p.sigma + ' ÷ ' + Math.sqrt(p.n) + ' = ' + r2(se) + '.']
        };
      },
      solution: ['Press “New numbers” for fresh values. The standard error of the mean is σ ÷ √n; it shrinks as n grows.']
    },

    // --- RANDOMIZED: SE + z + probability for the mean ------------------------
    {
      id: 't6-zmean-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Sampling Distribution of the Mean — Drill',
      prompt: 'Compute the standard error, the z-value of the sample mean, and a tail probability.',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 15, n: 9 }, { s: 20, n: 25 }, { s: 30, n: 9 }, { s: 10, n: 25 }, { s: 24, n: 16 }, { s: 40, n: 100 }] },
        mu: { choices: [50, 100, 200] },
        zc: { choices: [-1.5, -1, 1, 1.5, 2] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);     // clean integer by construction
        const xbar = p.mu + p.zc * se;       // so the z-value is exactly zc
        const pLess = SL ? SL.normalCdf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A population has μ = ' + p.mu + ' and σ = ' + sigma + '. For a sample of n = ' + n + ', compute the '
            + 'standard error, the z-value for x̄ = ' + xbar + ', and P(x̄ < ' + xbar + '). Probabilities to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_x̄', answer: se, tol: 0.05, unit: '', hint: '' + sigma + ' ÷ √' + n },
            { key: 'z', label: 'z-value for x̄ = ' + xbar, answer: p.zc, tol: 0.01, unit: '', hint: '(' + xbar + ' − ' + p.mu + ') ÷ ' + se },
            { key: 'pLess', label: 'P(x̄ < ' + xbar + ')', answer: pLess, tol: 0.01, unit: '', hint: 'P(Z < ' + p.zc + ') from the z-table' }
          ],
          solution: [
            'σ_x̄ = ' + sigma + ' ÷ √' + n + ' = ' + se + '.',
            'z = (' + xbar + ' − ' + p.mu + ') ÷ ' + se + ' = ' + p.zc + ';   P(x̄ < ' + xbar + ') = P(Z < ' + p.zc + ') = ' + r2(pLess) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. σ_x̄ = σ ÷ √n; z = (x̄ − μ) ÷ σ_x̄; then read P(Z < z) from the z-table.']
    },

    // --- RANDOMIZED: SE + z + probability for a proportion --------------------
    {
      id: 't6-proportion-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Sampling Distribution of a Proportion — Drill',
      prompt: 'Compute the standard error of p̂, its z-value, and a tail probability.',
      difficulty: 3,
      params: {
        P: { choices: [0.2, 0.5] },
        n: { choices: [25, 100, 400] },
        zc: { choices: [1, 1.5, 2] }
      },
      generate(p) {
        const se = Math.sqrt(p.P * (1 - p.P) / p.n); // clean (√(P(1−P)) ÷ √n) by construction
        const phat = p.P + p.zc * se;                // so the z-value is exactly zc
        const pMore = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        const r4 = (v) => Math.round(v * 10000) / 10000;
        return {
          prompt: 'A population proportion is P = ' + p.P.toFixed(2) + '. For a sample of n = ' + p.n + ', compute the '
            + 'standard error of p̂, the z-value for p̂ = ' + r4(phat) + ', and P(p̂ > ' + r4(phat) + '). '
            + 'Probabilities to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_p̂', answer: se, tol: 0.01, unit: '', hint: '√[P(1 − P) ÷ n] = √(' + r4(p.P * (1 - p.P)) + ' ÷ ' + p.n + ')' },
            { key: 'z', label: 'z-value', answer: p.zc, tol: 0.01, unit: '', hint: '(p̂ − P) ÷ σ_p̂' },
            { key: 'pMore', label: 'P(p̂ > ' + r4(phat) + ')', answer: pMore, tol: 0.01, unit: '', hint: '1 − P(Z < ' + p.zc + ')' }
          ],
          solution: [
            'σ_p̂ = √[' + p.P.toFixed(2) + ' × ' + (1 - p.P).toFixed(2) + ' ÷ ' + p.n + '] = ' + r2(se) + '.',
            'z = (' + r4(phat) + ' − ' + p.P.toFixed(2) + ') ÷ ' + r2(se) + ' = ' + p.zc + ';   P(p̂ > ' + r4(phat) + ') = 1 − P(Z < ' + p.zc + ') = ' + r2(pMore) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. σ_p̂ = √[P(1 − P) ÷ n]; z = (p̂ − P) ÷ σ_p̂; then use the z-table.']
    },

    // ============================================================================
    // B2.6 — T7 CONFIDENCE INTERVALS (second-midterm)
    //   Point estimate ± (reliability factor)·(standard error). CI for μ (σ known, z
    //   via SL.zCritical), CI for μ (σ unknown, t via SL.tCritical(df, α/2)), CI for a
    //   proportion. ME = factor·SE; width = 2·ME. The reliability factor (z or t) is
    //   STATED in the prompt (no z/t-table widget) → exercise tests the CI mechanics,
    //   not the lookup. SE kept clean. Means: bounds/ME/width 2 dp (tol 0.05);
    //   proportions: 3 dp (tol 0.01). chapter 7. FIRST K2 (second-midterm) exercise.
    // ============================================================================

    // --- T7 concepts (TF + MC) ------------------------------------------------
    {
      id: 't7-concepts',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Confidence Intervals — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'A point estimate is a single number; a confidence interval gives a range.', kind: 'tf', answer: true },
        { q: 'Every confidence interval has the form: point estimate ± (reliability factor)(standard error).', kind: 'tf', answer: true },
        { q: 'A 95% CI means there is a 95% probability that THIS particular interval contains μ.', kind: 'tf', answer: false },
        { q: 'When σ is unknown, the CI for μ uses the t distribution with n − 1 degrees of freedom.', kind: 'tf', answer: true },
        { q: 'Increasing the confidence level makes the interval narrower.', kind: 'tf', answer: false },
        { q: 'A larger sample size produces a narrower confidence interval.', kind: 'tf', answer: true },
        { q: 'The margin of error is the FULL width of the confidence interval.', kind: 'tf', answer: false },
        { q: 'For a 95% CI with σ known, the z reliability factor is:', kind: 'mc', options: ['1.645', '1.96', '2.33', '2.58'], answer: 1 },
        { q: 'The width of a confidence interval equals:', kind: 'mc', options: ['ME', '2·ME', 'ME ÷ 2', 'ME²'], answer: 1 },
        { q: 'The confidence interval for a proportion uses the standard error:', kind: 'mc', options: ['√[p̂(1 − p̂) ÷ n]', 'σ ÷ √n', 's ÷ √n', 'p̂ ÷ n'], answer: 0 }
      ],
      solution: [
        'A realized 95% interval either contains μ or not; the 95% refers to the long-run success rate of the METHOD, not one interval.',
        'Higher confidence → larger z/t → WIDER interval; larger n → smaller SE → NARROWER interval.',
        'ME is the HALF-width; the full width is 2·ME.'
      ]
    },

    // --- CI for μ, σ known (numeric, fixed) -----------------------------------
    {
      id: 't7-ci-mean-known-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for the Mean (σ known)',
      prompt: 'A sample of n = 25 gives x̄ = 50; the population σ = 10 is known. Build a 95% confidence interval for μ '
        + '(use z = 1.96). Compute the margin of error, the lower and upper limits, and the width. Round to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'me', label: 'Margin of error', answer: 3.92, tol: 0.05, unit: '', hint: 'z·σ/√n = 1.96 × (10 ÷ 5)' },
        { key: 'lower', label: 'Lower limit', answer: 46.08, tol: 0.05, unit: '', hint: 'x̄ − ME = 50 − 3.92' },
        { key: 'upper', label: 'Upper limit', answer: 53.92, tol: 0.05, unit: '', hint: 'x̄ + ME = 50 + 3.92' },
        { key: 'width', label: 'Width', answer: 7.84, tol: 0.05, unit: '', hint: '2·ME' }
      ],
      solution: [
        'SE = σ/√n = 10 ÷ 5 = 2.   ME = 1.96 × 2 = 3.92.',
        'CI = 50 ± 3.92 = (46.08, 53.92).   Width = 2 × 3.92 = 7.84.'
      ]
    },

    // --- CI for μ, σ unknown (t) (numeric, fixed) -----------------------------
    {
      id: 't7-ci-mean-unknown-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for the Mean (σ unknown, t)',
      prompt: 'A sample of n = 9 gives x̄ = 100 and sample SD s = 12. Build a 95% confidence interval for μ using the t '
        + 'distribution (df = 8, t = 2.306). Compute the margin of error and the lower and upper limits. Round to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'me', label: 'Margin of error', answer: 2.306 * 4, tol: 0.05, unit: '', hint: 't·s/√n = 2.306 × (12 ÷ 3)' },
        { key: 'lower', label: 'Lower limit', answer: 100 - 2.306 * 4, tol: 0.05, unit: '', hint: 'x̄ − ME' },
        { key: 'upper', label: 'Upper limit', answer: 100 + 2.306 * 4, tol: 0.05, unit: '', hint: 'x̄ + ME' }
      ],
      solution: [
        'SE = s/√n = 12 ÷ 3 = 4.   ME = t·SE = 2.306 × 4 = 9.22.',
        'CI = 100 ± 9.22 = (90.78, 109.22). The t value is larger than z because σ is unknown.'
      ]
    },

    // --- CI for a proportion (numeric, fixed) ---------------------------------
    {
      id: 't7-ci-proportion-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for a Proportion',
      prompt: 'In a sample of n = 100, the sample proportion is p̂ = 0.50. Build a 95% confidence interval for the '
        + 'population proportion (use z = 1.96). Compute the margin of error and the lower and upper limits. Round to 3 decimals.',
      difficulty: 2,
      fields: [
        { key: 'me', label: 'Margin of error', answer: 1.96 * 0.05, tol: 0.01, unit: '', hint: 'z·√[p̂(1 − p̂)/n] = 1.96 × 0.05' },
        { key: 'lower', label: 'Lower limit', answer: 0.5 - 1.96 * 0.05, tol: 0.01, unit: '', hint: 'p̂ − ME' },
        { key: 'upper', label: 'Upper limit', answer: 0.5 + 1.96 * 0.05, tol: 0.01, unit: '', hint: 'p̂ + ME' }
      ],
      solution: [
        'SE = √[0.50 × 0.50 ÷ 100] = √0.0025 = 0.05.   ME = 1.96 × 0.05 = 0.098.',
        'CI = 0.50 ± 0.098 = (0.402, 0.598).'
      ]
    },

    // --- RANDOMIZED: CI for μ, σ known ----------------------------------------
    {
      id: 't7-ci-mean-known-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for the Mean (σ known) — Drill',
      prompt: 'Build a confidence interval for μ when σ is known.',
      difficulty: 2,
      params: {
        pair: { choices: [{ s: 20, n: 16 }, { s: 30, n: 9 }, { s: 12, n: 9 }, { s: 20, n: 25 }, { s: 15, n: 9 }, { s: 24, n: 16 }] },
        xbar: { choices: [50, 100, 200] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);          // clean integer by construction
        const z = SL ? SL.zCritical(p.conf) : 0;
        const me = z * se;
        const lower = p.xbar - me, upper = p.xbar + me, width = 2 * me;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A sample of n = ' + n + ' gives x̄ = ' + p.xbar + '; the population σ = ' + sigma + ' is known. Build a '
            + p.conf + '% confidence interval for μ (use z = ' + z + '). Compute the margin of error, the lower and '
            + 'upper limits, and the width. Round to 2 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.05, unit: '', hint: 'z·σ/√n = ' + z + ' × (' + sigma + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.05, unit: '', hint: 'x̄ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.05, unit: '', hint: 'x̄ + ME' },
            { key: 'width', label: 'Width', answer: width, tol: 0.05, unit: '', hint: '2·ME' }
          ],
          solution: [
            'SE = ' + sigma + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   ME = ' + z + ' × ' + se + ' = ' + r2(me) + '.',
            'CI = ' + p.xbar + ' ± ' + r2(me) + ' = (' + r2(lower) + ', ' + r2(upper) + ');   width = ' + r2(width) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. CI = x̄ ± z·(σ/√n); ME = z·σ/√n; width = 2·ME.']
    },

    // --- RANDOMIZED: CI for μ, σ unknown (t) ----------------------------------
    {
      id: 't7-ci-mean-unknown-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for the Mean (σ unknown, t) — Drill',
      prompt: 'Build a confidence interval for μ using the t distribution (σ unknown).',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 6, n: 9, df: 8 }, { s: 12, n: 9, df: 8 }, { s: 8, n: 16, df: 15 }, { s: 10, n: 25, df: 24 }, { s: 15, n: 25, df: 24 }] },
        xbar: { choices: [50, 100, 200] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const s = p.pair.s, n = p.pair.n, df = p.pair.df;
        const se = s / Math.sqrt(n);              // clean integer by construction
        // α/2 upper-tail area as EXACT table keys (avoid float drift like 0.0499…).
        const AREA = { 90: 0.05, 95: 0.025, 99: 0.005 };
        const area = AREA[p.conf];
        const t = SL ? SL.tCritical(df, area) : 0;
        const me = t * se;
        const lower = p.xbar - me, upper = p.xbar + me;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A sample of n = ' + n + ' gives x̄ = ' + p.xbar + ' and sample SD s = ' + s + '. Build a ' + p.conf
            + '% confidence interval for μ using the t distribution (df = ' + df + ', t = ' + t + '). Compute the margin '
            + 'of error and the lower and upper limits. Round to 2 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.05, unit: '', hint: 't·s/√n = ' + t + ' × (' + s + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.05, unit: '', hint: 'x̄ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.05, unit: '', hint: 'x̄ + ME' }
          ],
          solution: [
            'SE = ' + s + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   ME = ' + t + ' × ' + se + ' = ' + r2(me) + '.',
            'CI = ' + p.xbar + ' ± ' + r2(me) + ' = (' + r2(lower) + ', ' + r2(upper) + ').'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. With σ unknown: CI = x̄ ± t·(s/√n), df = n − 1; ME = t·s/√n.']
    },

    // --- RANDOMIZED: CI for a proportion --------------------------------------
    {
      id: 't7-ci-proportion-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'CI for a Proportion — Drill',
      prompt: 'Build a confidence interval for a population proportion.',
      difficulty: 3,
      params: {
        phat: { choices: [0.2, 0.5] },
        n: { choices: [100, 400] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const se = Math.sqrt(p.phat * (1 - p.phat) / p.n); // clean by construction
        const z = SL ? SL.zCritical(p.conf) : 0;
        const me = z * se;
        const lower = p.phat - me, upper = p.phat + me;
        const r3 = (v) => Math.round(v * 1000) / 1000;
        return {
          prompt: 'In a sample of n = ' + p.n + ', the sample proportion is p̂ = ' + p.phat.toFixed(2) + '. Build a '
            + p.conf + '% confidence interval for the population proportion (use z = ' + z + '). Compute the margin of '
            + 'error and the lower and upper limits. Round to 3 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.01, unit: '', hint: 'z·√[p̂(1 − p̂)/n] = ' + z + ' × ' + r3(se) },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.01, unit: '', hint: 'p̂ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.01, unit: '', hint: 'p̂ + ME' }
          ],
          solution: [
            'SE = √[' + p.phat.toFixed(2) + ' × ' + (1 - p.phat).toFixed(2) + ' ÷ ' + p.n + '] = ' + r3(se) + ';   ME = ' + z + ' × ' + r3(se) + ' = ' + r3(me) + '.',
            'CI = ' + p.phat.toFixed(2) + ' ± ' + r3(me) + ' = (' + r3(lower) + ', ' + r3(upper) + ').'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. CI = p̂ ± z·√[p̂(1 − p̂)/n]; ME = z·SE.']
    },

    // ============================================================================
    // B2.7 — T8 HYPOTHESIS TESTING (single population) (second-midterm)
    //   z test for a mean (σ known) z=(x̄−μ₀)/(σ/√n); t test (σ unknown) t=(x̄−μ₀)/(s/√n),
    //   df=n−1; z test for a proportion z=(p̂−P₀)/√(P₀(1−P₀)/n). p-value via SL.normalSf
    //   (two-tailed = 2·P(Z>|z|)); decision by comparing to the critical value. Test
    //   statistics & p-values → 2 dp (tol 0.01). SE kept clean → z exact. Decisions are
    //   `choice` (reject / fail to reject). chapter 8.
    // ============================================================================

    // --- T8 concepts (TF + MC) ------------------------------------------------
    {
      id: 't8-concepts',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Hypothesis Testing — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The null hypothesis H₀ contains the equality (=, ≤, ≥).', kind: 'tf', answer: true },
        { q: 'A non-significant test PROVES that H₀ is true.', kind: 'tf', answer: false },
        { q: 'The probability of a Type I error is α.', kind: 'tf', answer: true },
        { q: 'The power of a test is 1 − β.', kind: 'tf', answer: true },
        { q: 'A two-tailed test splits α between both tails.', kind: 'tf', answer: true },
        { q: 'When σ is unknown, the test statistic for a mean uses the t distribution.', kind: 'tf', answer: true },
        { q: 'Failing to reject a FALSE H₀ is a Type II error.', kind: 'tf', answer: true },
        { q: 'Rejecting a TRUE H₀ is a:', kind: 'mc', options: ['Type I error', 'Type II error', 'Correct decision', 'p-value'], answer: 0 },
        { q: 'Using the p-value, we reject H₀ when:', kind: 'mc', options: ['p ≥ α', 'p < α', 'p = 1', 'p > 0.5'], answer: 1 },
        { q: 'The significance level α is chosen:', kind: 'mc', options: ['After seeing the data', 'In advance by the researcher', 'Always 0.5', 'By the sample size'], answer: 1 }
      ],
      solution: [
        'We never “prove” H₀; we either reject it or fail to reject it (“innocent until proven guilty”).',
        'Type I error = rejecting a true H₀ (probability α); Type II = failing to reject a false H₀ (probability β); power = 1 − β.',
        'The p-value rule: reject H₀ when p < α.'
      ]
    },

    // --- Decisions from a test statistic / p-value (choice) -------------------
    {
      id: 't8-decision',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Reaching a Decision',
      prompt: 'For each scenario, decide what to do with H₀.',
      difficulty: 2,
      items: [
        { q: 'A test statistic beyond the critical value leads to rejecting H₀.', kind: 'tf', answer: true },
        { q: 'If the p-value is greater than α, we fail to reject H₀.', kind: 'tf', answer: true },
        { q: 'Two-tailed test: z = 2.50, critical values ±1.96. Decision?', kind: 'mc', options: ['Reject H₀', 'Fail to reject H₀'], answer: 0 },
        { q: 'p-value = 0.08, α = 0.05. Decision?', kind: 'mc', options: ['Reject H₀', 'Fail to reject H₀'], answer: 1 },
        { q: 'Right-tailed test: z = 1.20, critical value 1.645. Decision?', kind: 'mc', options: ['Reject H₀', 'Fail to reject H₀'], answer: 1 },
        { q: 'Left-tailed test: z = −2.10, critical value −1.645. Decision?', kind: 'mc', options: ['Reject H₀', 'Fail to reject H₀'], answer: 0 },
        { q: 'p-value = 0.003, α = 0.01. Decision?', kind: 'mc', options: ['Reject H₀', 'Fail to reject H₀'], answer: 0 }
      ],
      solution: [
        'Critical-value rule: reject H₀ when the statistic falls in the rejection region (beyond the critical value).',
        'p-value rule: reject H₀ when p < α. z = 2.50 > 1.96 → reject; z = 1.20 < 1.645 → fail to reject; z = −2.10 < −1.645 → reject.'
      ]
    },

    // --- z test for a mean, two-tailed (numeric, fixed) -----------------------
    {
      id: 't8-ztest-mean-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z Test for a Mean (σ known)',
      prompt: 'Test H₀: μ = 50 vs H₁: μ ≠ 50 (two-tailed) at α = 0.05. A sample of n = 25 gives x̄ = 58; the population '
        + 'σ = 20 is known. Compute the test statistic z and the two-tailed p-value (2 decimals).',
      difficulty: 3,
      fields: [
        { key: 'z', label: 'Test statistic z', answer: 2.0, tol: 0.01, unit: '', hint: '(x̄ − μ₀) ÷ (σ/√n) = (58 − 50) ÷ (20 ÷ 5)' },
        { key: 'p', label: 'Two-tailed p-value', answer: 2 * SL.normalSf(2.0), tol: 0.01, unit: '', hint: '2 × P(Z > |z|) = 2 × (1 − 0.9772)' }
      ],
      solution: [
        'SE = 20 ÷ 5 = 4;   z = (58 − 50) ÷ 4 = 2.0.',
        'p = 2 × P(Z > 2.0) = 2 × 0.0228 = 0.0456 ≈ 0.05. Since p < 0.05 (just), reject H₀.'
      ]
    },

    // --- t test for a mean (numeric, fixed) -----------------------------------
    {
      id: 't8-ttest-mean-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 't Test for a Mean (σ unknown)',
      prompt: 'Test H₀: μ = 50 vs H₁: μ ≠ 50 (two-tailed) at α = 0.05. A sample of n = 16 gives x̄ = 53 and sample SD '
        + 's = 8. The critical value is t = ±2.131 (df = 15). Compute the degrees of freedom and the test statistic t.',
      difficulty: 3,
      fields: [
        { key: 'df', label: 'Degrees of freedom', answer: 15, tol: 0, unit: '', hint: 'n − 1 = 16 − 1' },
        { key: 't', label: 'Test statistic t', answer: 1.5, tol: 0.01, unit: '', hint: '(x̄ − μ₀) ÷ (s/√n) = (53 − 50) ÷ (8 ÷ 4)' }
      ],
      solution: [
        'df = n − 1 = 15;   SE = 8 ÷ 4 = 2;   t = (53 − 50) ÷ 2 = 1.5.',
        '|t| = 1.5 < 2.131, so the statistic is NOT in the rejection region → fail to reject H₀.'
      ]
    },

    // --- z test for a proportion, right-tailed (numeric, fixed) ---------------
    {
      id: 't8-ztest-prop-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z Test for a Proportion',
      prompt: 'Test H₀: P = 0.50 vs H₁: P > 0.50 (right-tailed) at α = 0.05. A sample of n = 100 gives p̂ = 0.60. '
        + 'Compute the test statistic z and the one-tailed p-value (2 decimals).',
      difficulty: 3,
      fields: [
        { key: 'z', label: 'Test statistic z', answer: 2.0, tol: 0.01, unit: '', hint: '(p̂ − P₀) ÷ √[P₀(1 − P₀)/n] = (0.60 − 0.50) ÷ 0.05' },
        { key: 'p', label: 'One-tailed p-value', answer: SL.normalSf(2.0), tol: 0.01, unit: '', hint: 'P(Z > z) = 1 − 0.9772' }
      ],
      solution: [
        'SE = √[0.50 × 0.50 ÷ 100] = 0.05;   z = (0.60 − 0.50) ÷ 0.05 = 2.0.',
        'p = P(Z > 2.0) = 0.0228 ≈ 0.02. Since p < 0.05, reject H₀.'
      ]
    },

    // --- RANDOMIZED: z test for a mean, two-tailed ----------------------------
    {
      id: 't8-ztest-mean-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z Test for a Mean — Drill',
      prompt: 'Compute the test statistic and the two-tailed p-value.',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 15, n: 9 }, { s: 20, n: 25 }, { s: 30, n: 9 }, { s: 12, n: 9 }, { s: 20, n: 16 }] },
        mu0: { choices: [50, 100, 200] },
        zc: { choices: [-2.5, -2, -1.5, 1.5, 2, 2.5] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);     // clean integer by construction
        const xbar = p.mu0 + p.zc * se;      // so the test statistic is exactly zc
        const pval = SL ? 2 * SL.normalSf(Math.abs(p.zc)) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Test H₀: μ = ' + p.mu0 + ' vs H₁: μ ≠ ' + p.mu0 + ' (two-tailed). A sample of n = ' + n + ' gives '
            + 'x̄ = ' + xbar + '; the population σ = ' + sigma + ' is known. Compute the test statistic z and the '
            + 'two-tailed p-value (2 decimals).',
          fields: [
            { key: 'z', label: 'Test statistic z', answer: p.zc, tol: 0.01, unit: '', hint: '(' + xbar + ' − ' + p.mu0 + ') ÷ (' + sigma + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'p', label: 'Two-tailed p-value', answer: pval, tol: 0.01, unit: '', hint: '2 × P(Z > |z|)' }
          ],
          solution: [
            'SE = ' + sigma + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   z = (' + xbar + ' − ' + p.mu0 + ') ÷ ' + se + ' = ' + p.zc + '.',
            'p = 2 × P(Z > ' + Math.abs(p.zc) + ') = ' + r2(pval) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. z = (x̄ − μ₀) ÷ (σ/√n); two-tailed p = 2 × P(Z > |z|); reject H₀ if p < α.']
    },

    // --- RANDOMIZED: z test for a proportion, right-tailed --------------------
    {
      id: 't8-ztest-prop-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z Test for a Proportion — Drill',
      prompt: 'Compute the test statistic and the one-tailed p-value.',
      difficulty: 3,
      params: {
        P0: { choices: [0.2, 0.5] },
        n: { choices: [100, 400] },
        zc: { choices: [1.5, 2, 2.5] }
      },
      generate(p) {
        const se = Math.sqrt(p.P0 * (1 - p.P0) / p.n); // clean by construction
        const phat = p.P0 + p.zc * se;                 // so the test statistic is exactly zc
        const pval = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        const r4 = (v) => Math.round(v * 10000) / 10000;
        return {
          prompt: 'Test H₀: P = ' + p.P0.toFixed(2) + ' vs H₁: P > ' + p.P0.toFixed(2) + ' (right-tailed). A sample of '
            + 'n = ' + p.n + ' gives p̂ = ' + r4(phat) + '. Compute the test statistic z and the one-tailed p-value (2 decimals).',
          fields: [
            { key: 'z', label: 'Test statistic z', answer: p.zc, tol: 0.01, unit: '', hint: '(p̂ − P₀) ÷ √[P₀(1 − P₀)/n]' },
            { key: 'p', label: 'One-tailed p-value', answer: pval, tol: 0.01, unit: '', hint: 'P(Z > z)' }
          ],
          solution: [
            'SE = √[' + p.P0.toFixed(2) + ' × ' + (1 - p.P0).toFixed(2) + ' ÷ ' + p.n + '] = ' + r2(se) + ';   z = (' + r4(phat) + ' − ' + p.P0.toFixed(2) + ') ÷ ' + r2(se) + ' = ' + p.zc + '.',
            'p = P(Z > ' + p.zc + ') = ' + r2(pval) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. z = (p̂ − P₀) ÷ √[P₀(1 − P₀)/n]; one-tailed p = P(Z > z); reject H₀ if p < α.']
    },

    // ============================================================================
    // B2.8 — T9 REGRESSION ANALYSIS (second-midterm)
    //   Least-squares slope b₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² and intercept b₀ = ȳ − b₁x̄;
    //   prediction ŷ = b₀ + b₁x; variation SST = SSR + SSE; R² = SSR/SST; error variance
    //   s²ₑ = SSE/(n−2). All elementary inline (no stat-lib needed). Randomized slope uses
    //   hand-verified clean data sets (object-valued param choices). Coefficients/predictions
    //   2 dp (tol 0.05); R² is a proportion → 2 dp (tol 0.01); SSR integer (tol 0). chapter 9.
    // ============================================================================

    // --- T9 concepts (TF + MC) ------------------------------------------------
    {
      id: 't9-concepts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Regression — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'In regression, Y is the dependent variable we predict.', kind: 'tf', answer: true },
        { q: 'Least squares minimizes the sum of squared residuals (SSE).', kind: 'tf', answer: true },
        { q: 'The regression line always passes through (x̄, ȳ).', kind: 'tf', answer: true },
        { q: 'Total variation decomposes as SST = SSR + SSE.', kind: 'tf', answer: true },
        { q: 'R² can be greater than 1 for a very strong relationship.', kind: 'tf', answer: false },
        { q: 'The model error variance divides SSE by n − 1.', kind: 'tf', answer: false },
        { q: 'The slope t test has null hypothesis H₀: β₁ = 0.', kind: 'tf', answer: true },
        { q: 'The coefficient of determination R² equals:', kind: 'mc', options: ['SSE ÷ SST', 'SSR ÷ SST', 'SST ÷ SSR', '1 + SSE ÷ SST'], answer: 1 },
        { q: 'The slope b₁ measures the change in average Y for a one-unit change in:', kind: 'mc', options: ['Y', 'X', 'the residual', 'SST'], answer: 1 },
        { q: 'In simple regression, the F statistic equals:', kind: 'mc', options: ['t', 't²', '√t', 'R²'], answer: 1 }
      ],
      solution: [
        '0 ≤ R² ≤ 1; the error variance divides SSE by n − 2 (two parameters b₀, b₁ were estimated).',
        'R² = SSR/SST is the proportion of Y’s variation explained by X; the line passes through (x̄, ȳ).',
        'For one predictor, F = t² and both test β₁ = 0.'
      ]
    },

    // --- Least-squares line from a small data set (numeric, fixed) ------------
    {
      id: 't9-slope-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Least-Squares Line',
      prompt: 'For the data (1, 2), (2, 4), (3, 5), (4, 4), (5, 5), find the least-squares slope b₁ and intercept b₀, '
        + 'then predict ŷ at x = 6. (x̄ = 3, ȳ = 4.) Round to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'b1', label: 'Slope b₁', answer: 0.6, tol: 0.05, unit: '', hint: 'Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² = 6 ÷ 10' },
        { key: 'b0', label: 'Intercept b₀', answer: 2.2, tol: 0.05, unit: '', hint: 'ȳ − b₁x̄ = 4 − 0.6 × 3' },
        { key: 'yhat', label: 'Prediction ŷ at x = 6', answer: 5.8, tol: 0.05, unit: '', hint: 'b₀ + b₁ × 6' }
      ],
      solution: [
        'Σ(x − x̄)(y − ȳ) = 6;  Σ(x − x̄)² = 10  →  b₁ = 6 ÷ 10 = 0.6.',
        'b₀ = ȳ − b₁x̄ = 4 − 0.6 × 3 = 2.2.   ŷ(6) = 2.2 + 0.6 × 6 = 5.8.'
      ]
    },

    // --- Variation decomposition & R² (numeric, fixed) ------------------------
    {
      id: 't9-rsquared-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'R² and the Error Variance',
      prompt: 'A regression on n = 12 observations gives SST = 200 and SSE = 50. Compute the explained variation SSR, '
        + 'the coefficient of determination R², and the estimated error variance s²ₑ. Round R² to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'ssr', label: 'Explained variation SSR', answer: 150, tol: 0, unit: '', hint: 'SST − SSE = 200 − 50' },
        { key: 'r2', label: 'Coefficient of determination R²', answer: 0.75, tol: 0.01, unit: '', hint: 'SSR ÷ SST = 150 ÷ 200' },
        { key: 'se2', label: 'Error variance s²ₑ', answer: 5, tol: 0.05, unit: '', hint: 'SSE ÷ (n − 2) = 50 ÷ 10' }
      ],
      solution: [
        'SSR = SST − SSE = 200 − 50 = 150.',
        'R² = SSR ÷ SST = 150 ÷ 200 = 0.75 (75% of Y’s variation explained).',
        's²ₑ = SSE ÷ (n − 2) = 50 ÷ 10 = 5.'
      ]
    },

    // --- Prediction & slope interpretation (numeric, fixed) -------------------
    {
      id: 't9-predict-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Prediction from a Fitted Line',
      prompt: 'A fitted regression line is ŷ = 10 + 2.5x. Predict ŷ at x = 8, predict ŷ at x = 4, and state the change '
        + 'in average Y for a one-unit increase in X. Round to 2 decimals.',
      difficulty: 1,
      fields: [
        { key: 'y8', label: 'Prediction ŷ at x = 8', answer: 30, tol: 0.05, unit: '', hint: '10 + 2.5 × 8' },
        { key: 'y4', label: 'Prediction ŷ at x = 4', answer: 20, tol: 0.05, unit: '', hint: '10 + 2.5 × 4' },
        { key: 'change', label: 'Change in Y per +1 in X', answer: 2.5, tol: 0.05, unit: '', hint: 'The slope b₁' }
      ],
      solution: [
        'ŷ(8) = 10 + 2.5 × 8 = 30;   ŷ(4) = 10 + 2.5 × 4 = 20.',
        'The slope b₁ = 2.5 is the change in average Y for each one-unit increase in X.'
      ]
    },

    // --- RANDOMIZED: least-squares line from a data set -----------------------
    {
      id: 't9-slope-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Least-Squares Line — Drill',
      prompt: 'Find the least-squares line for the data set and use it to predict.',
      difficulty: 3,
      params: {
        ds: { choices: [
          { pts: [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]], xn: 6 },
          { pts: [[0, 1], [1, 1], [2, 3], [3, 3], [4, 5]], xn: 5 },
          { pts: [[2, 3], [4, 7], [6, 8], [8, 12], [10, 15]], xn: 12 },
          { pts: [[1, 5], [2, 4], [3, 4], [4, 2], [5, 1]], xn: 6 }
        ] }
      },
      generate(p) {
        const pts = p.ds.pts, xn = p.ds.xn, n = pts.length;
        const xbar = pts.reduce((s, q) => s + q[0], 0) / n;
        const ybar = pts.reduce((s, q) => s + q[1], 0) / n;
        const sxy = pts.reduce((s, q) => s + (q[0] - xbar) * (q[1] - ybar), 0);
        const sxx = pts.reduce((s, q) => s + (q[0] - xbar) * (q[0] - xbar), 0);
        const b1 = sxy / sxx;
        const b0 = ybar - b1 * xbar;
        const yhat = b0 + b1 * xn;
        const r2 = (v) => Math.round(v * 100) / 100;
        const ptsStr = pts.map((q) => '(' + q[0] + ', ' + q[1] + ')').join(', ');
        return {
          prompt: 'For the data ' + ptsStr + ', find the least-squares slope b₁ and intercept b₀, then predict ŷ at '
            + 'x = ' + xn + '. (x̄ = ' + r2(xbar) + ', ȳ = ' + r2(ybar) + '.) Round to 2 decimals.',
          fields: [
            { key: 'b1', label: 'Slope b₁', answer: b1, tol: 0.05, unit: '', hint: 'Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² = ' + r2(sxy) + ' ÷ ' + r2(sxx) },
            { key: 'b0', label: 'Intercept b₀', answer: b0, tol: 0.05, unit: '', hint: 'ȳ − b₁x̄' },
            { key: 'yhat', label: 'Prediction ŷ at x = ' + xn, answer: yhat, tol: 0.05, unit: '', hint: 'b₀ + b₁ × ' + xn }
          ],
          solution: [
            'b₁ = ' + r2(sxy) + ' ÷ ' + r2(sxx) + ' = ' + r2(b1) + ';   b₀ = ' + r2(ybar) + ' − ' + r2(b1) + ' × ' + r2(xbar) + ' = ' + r2(b0) + '.',
            'ŷ(' + xn + ') = ' + r2(b0) + ' + ' + r2(b1) + ' × ' + xn + ' = ' + r2(yhat) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for a fresh data set. b₁ = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²; b₀ = ȳ − b₁x̄; ŷ = b₀ + b₁x.']
    },

    // --- RANDOMIZED: SSR, R² and error variance -------------------------------
    {
      id: 't9-rsquared-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'R² and Error Variance — Drill',
      prompt: 'From the variation totals, compute SSR, R² and the error variance.',
      difficulty: 2,
      params: {
        ss: { choices: [{ sst: 400, sse: 100 }, { sst: 500, sse: 100 }, { sst: 200, sse: 50 }, { sst: 400, sse: 40 }, { sst: 300, sse: 120 }, { sst: 500, sse: 200 }] },
        n: { choices: [12, 22, 52] }
      },
      generate(p) {
        const sst = p.ss.sst, sse = p.ss.sse;
        const ssr = sst - sse;
        const r2v = ssr / sst;
        const se2 = sse / (p.n - 2);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A regression on n = ' + p.n + ' observations gives SST = ' + sst + ' and SSE = ' + sse + '. Compute '
            + 'the explained variation SSR, the coefficient of determination R², and the estimated error variance s²ₑ. '
            + 'Round R² to 2 decimals.',
          fields: [
            { key: 'ssr', label: 'Explained variation SSR', answer: ssr, tol: 0, unit: '', hint: 'SST − SSE = ' + sst + ' − ' + sse },
            { key: 'r2', label: 'Coefficient of determination R²', answer: r2v, tol: 0.01, unit: '', hint: 'SSR ÷ SST' },
            { key: 'se2', label: 'Error variance s²ₑ', answer: se2, tol: 0.05, unit: '', hint: 'SSE ÷ (n − 2) = ' + sse + ' ÷ ' + (p.n - 2) }
          ],
          solution: [
            'SSR = ' + sst + ' − ' + sse + ' = ' + ssr + ';   R² = ' + ssr + ' ÷ ' + sst + ' = ' + r2(r2v) + '.',
            's²ₑ = ' + sse + ' ÷ ' + (p.n - 2) + ' = ' + r2(se2) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh totals. SSR = SST − SSE; R² = SSR ÷ SST; s²ₑ = SSE ÷ (n − 2).']
    },

    // --- RANDOMIZED: prediction from a fitted line ----------------------------
    {
      id: 't9-predict-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Prediction — Drill',
      prompt: 'Use the fitted regression line to predict and interpret.',
      difficulty: 1,
      params: {
        b0: { choices: [2, 5, 10] },
        b1: { choices: [0.5, 1.5, 2.5, 3] },
        x: { choices: [4, 6, 10] }
      },
      generate(p) {
        const yhat = p.b0 + p.b1 * p.x;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A fitted regression line is ŷ = ' + p.b0 + ' + ' + p.b1 + 'x. Predict ŷ at x = ' + p.x + ', and state '
            + 'the change in average Y for a one-unit increase in X. Round to 2 decimals.',
          fields: [
            { key: 'yhat', label: 'Prediction ŷ at x = ' + p.x, answer: yhat, tol: 0.05, unit: '', hint: '' + p.b0 + ' + ' + p.b1 + ' × ' + p.x },
            { key: 'change', label: 'Change in Y per +1 in X', answer: p.b1, tol: 0.05, unit: '', hint: 'The slope b₁' }
          ],
          solution: [
            'ŷ(' + p.x + ') = ' + p.b0 + ' + ' + p.b1 + ' × ' + p.x + ' = ' + r2(yhat) + '.',
            'The slope b₁ = ' + p.b1 + ' is the change in average Y per one-unit increase in X.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. ŷ = b₀ + b₁x; the slope b₁ is the change in average Y per one-unit increase in X.']
    }
  ]
};

if (typeof window !== 'undefined') window.statisticsExercises = statisticsExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = statisticsExercises;
