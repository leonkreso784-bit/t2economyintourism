// ===== STATISTICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski podaci za interaktivne, auto-ocjenjive vježbe
// statistike. Generički engine (js/exercises-core.js, js/exercises.js, css/exercises.css)
// ne sadrži NIŠTA odavde — vidi docs/EXERCISES_ENGINE.md §2 (schema/tipovi) + §3 (konvencije)
// i docs/STATISTICS_PLAN.md (cigla-po-cigla plan, TRACK B).
//
// Tipovi koje koristi statistika: numeric / choice / ratio (NE journal/classify/statement).
// Matematika za rješenja (normalCdf, z/t tablice) doći će u data/statistics/stat-lib.js
// (B1) i učitavat će se PRIJE ove datoteke. Elementarna aritmetika ide inline u solve().
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* je immutable).
//
// B0 (žica): SKELETON — prazna lista. Tab "Exercises" se pojavi (prazno stanje); sadržaj
//            se autorira po temi u FAZI B2 (T1–T9). meta.currency='' (statistika nije novac).

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
        + 'deviation and the coefficient of variation (%). Round to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'var', label: 'Sample variance s²', answer: 14.67, tol: 0.05, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = 88 ÷ 6' },
        { key: 'sd', label: 'Sample standard deviation s', answer: 3.83, tol: 0.02, unit: '', hint: '√(s²) = √14.67' },
        { key: 'cv', label: 'Coefficient of variation', answer: 47.87, tol: 0.1, unit: '%', hint: '(s ÷ x̄) × 100 = (3.83 ÷ 8) × 100' }
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
            + 'standard deviation s (divide by n − 1). Round to 2 decimals.',
          fields: [
            { key: 'mean', label: 'Mean x̄', answer: mean, tol: 0.01, unit: '', hint: 'Sum ÷ 5' },
            { key: 'var', label: 'Sample variance s²', answer: variance, tol: 0.1, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = Σ(x − x̄)² ÷ 4' },
            { key: 'sd', label: 'Sample standard deviation s', answer: sd, tol: 0.02, unit: '', hint: '√(s²)' }
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
            + 'of variation (%). Round to 2 decimals.',
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
            + ' standard deviations of the mean? Round to 2 decimals.',
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
    }
  ]
};

if (typeof window !== 'undefined') window.statisticsExercises = statisticsExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = statisticsExercises;
