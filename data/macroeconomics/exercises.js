// ===== MACROECONOMICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NOT the engine): all domain data for interactive, auto-graded
// macroeconomics exercises. The generic engine (js/exercises-core.js, js/exercises.js,
// css/exercises.css) contains NOTHING from here — see docs/EXERCISES_ENGINE.md §2
// (schema/types) + §3 (conventions). Reusable engine proven by Accounting (41) and
// Statistics (56); see [[accounting-exercises-engine]] / [[statistics-exercises-plan]].
//
// Types macro will use: numeric / choice / ratio (NOT journal/classify/statement).
// Macro math is ELEMENTARY ALGEBRA (multipliers, GDP deflator, natural rate, open
// multiplier, Fisher) → computed INLINE in generate(p); no stat-lib-style library is
// expected (unlike Statistics' normalCdf). If a shared/hard helper ever emerges, add a
// data-layer lib (e.g. data/macroeconomics/macro-lib.js) — YAGNI until then.
//
// ⚠ CACHE: on any change bump CONTENT_VERSION in js/content-loader.js (data/* is immutable).
//
// SEAM (this commit): SKELETON — empty list. The "Exercises" tab appears (empty state);
// content is authored later, topic by topic (Track B), with the same verify methodology
// as Statistics: independent recompute + brute-force grade-correct + discrimination.
// meta.currency = '' (macro answers are rates/ratios/indices, not a single currency).

const macroeconomicsExercises = {
  meta: { lang: 'en', currency: '', version: 1 },
  exercises: [
    // ============================================================================
    // B1 — FUNDAMENTALS + UNEMPLOYMENT & INFLATION (first-midterm)
    //   chapter 1 = fundamentals/objectives/policy/horizons; chapter 2 = unemployment,
    //   inflation, real vs nominal interest, Okun/Phillips.
    //   Concepts (choice) + computation (numeric/ratio) + 2 randomized drills.
    //   Conventions: rates entered as PERCENT (e.g. 5 for 5%), 1 dp, tol 0.1; counts tol 0.
    // ============================================================================

    // --- Concepts: fundamentals + unemployment & inflation (TF + MC) ----------
    {
      id: 'b1-concepts',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Fundamentals & Inflation — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'Macroeconomics studies the economy as a whole (total output, employment, prices, trade).', kind: 'tf', answer: true },
        { q: 'In the short run, GDP is driven mainly by aggregate demand.', kind: 'tf', answer: true },
        { q: 'Deflation is a permanent rise in the general price level.', kind: 'tf', answer: false },
        { q: 'The real interest rate is approximately the nominal rate minus expected inflation.', kind: 'tf', answer: true },
        { q: 'Full-time students not looking for work are counted in the labour force.', kind: 'tf', answer: false },
        { q: 'According to the Phillips curve, lower unemployment is associated with higher inflation.', kind: 'tf', answer: true },
        { q: 'Okun’s law links the inflation rate to the money supply.', kind: 'tf', answer: false },
        { q: 'Which of these is NOT one of the four main macroeconomic variables?', kind: 'mc', options: ['GDP', 'The unemployment rate', 'The marginal propensity to consume', 'The inflation rate'], answer: 2 },
        { q: 'Increasing the money supply and lowering interest rates is:', kind: 'mc', options: ['Restrictive monetary policy', 'Expansionary monetary policy', 'Income policy', 'Trade policy'], answer: 1 },
        { q: 'The general price level is measured by the:', kind: 'mc', options: ['GDP per capita', 'Consumer Price Index (CPI)', 'Unemployment rate', 'Exchange rate'], answer: 1 }
      ],
      solution: [
        'Deflation is a permanent FALL in the price level (a negative inflation rate); a permanent rise is inflation.',
        'Students, homemakers and retirees not seeking work are OUTSIDE the labour force (neither employed nor unemployed).',
        'Okun’s law links OUTPUT growth to UNEMPLOYMENT; it is the Phillips curve that involves inflation.'
      ]
    },

    // --- Concepts: policy direction + the three horizons (TF + MC) ------------
    {
      id: 'b1-policy-horizons',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Economic Policy & the Three Horizons',
      prompt: 'Classify each policy and time-horizon statement as true or false, then answer the MC items.',
      difficulty: 1,
      items: [
        { q: 'An increase in government spending (G) is an expansionary fiscal measure.', kind: 'tf', answer: true },
        { q: 'A central bank selling bonds is an expansionary measure.', kind: 'tf', answer: false },
        { q: 'A cut in taxes is an expansionary fiscal measure.', kind: 'tf', answer: true },
        { q: 'Raising the central bank’s interest rate is a restrictive measure.', kind: 'tf', answer: true },
        { q: 'Wage and price controls are instruments of monetary policy.', kind: 'tf', answer: false },
        { q: 'In the MEDIUM run, output is determined mainly by:', kind: 'mc', options: ['Aggregate demand', 'Supply factors (capital, technology, the workforce)', 'The money supply', 'Tariffs'], answer: 1 },
        { q: 'In the LONG run, growth depends mainly on:', kind: 'mc', options: ['Demand', 'Innovation, saving and institutions', 'The exchange rate', 'The inflation rate'], answer: 1 },
        { q: 'Cutting taxes and raising spending at the same time is:', kind: 'mc', options: ['Restrictive fiscal policy', 'Expansionary fiscal policy', 'Monetary policy', 'Income policy'], answer: 1 }
      ],
      solution: [
        'Expansionary measures stimulate activity: higher G, lower T, more money, lower rates. Restrictive measures do the opposite.',
        'Selling bonds drains money from the economy → contractionary; raising rates is also restrictive.',
        'Wage/price control is INCOME policy, not monetary policy.'
      ]
    },

    // --- Unemployment rate from employment & unemployment (numeric, fixed) ----
    {
      id: 'b1-unemp-fixed',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Labour Force & Unemployment Rate',
      prompt: 'A country has 190 million employed and 10 million unemployed. Compute the labour force (millions), '
        + 'the unemployment rate (%) and the employment rate (%). Round rates to 1 decimal place.',
      difficulty: 1,
      fields: [
        { key: 'L', label: 'Labour force (millions)', answer: 200, tol: 0, unit: 'm', hint: 'L = E + U = 190 + 10' },
        { key: 'u', label: 'Unemployment rate', answer: 5, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100 = (10 ÷ 200) × 100' },
        { key: 'e', label: 'Employment rate', answer: 95, tol: 0.1, unit: '%', hint: '(E ÷ L) × 100 = (190 ÷ 200) × 100' }
      ],
      solution: [
        'Labour force L = E + U = 190 + 10 = 200 million.',
        'Unemployment rate = (U ÷ L) × 100 = (10 ÷ 200) × 100 = 5.0%.',
        'Employment rate = (E ÷ L) × 100 = (190 ÷ 200) × 100 = 95.0%.'
      ]
    },

    // --- Real interest rate (numeric, fixed) ----------------------------------
    {
      id: 'b1-real-rate-fixed',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Real Interest Rate',
      prompt: 'The nominal interest rate is 8% and the (expected) inflation rate is 3%. Compute the real interest rate (%).',
      difficulty: 1,
      fields: [
        { key: 'r', label: 'Real interest rate', answer: 5, tol: 0.1, unit: '%', hint: 'real ≈ nominal − inflation = 8 − 3' }
      ],
      solution: [
        'The real interest rate ≈ nominal rate − inflation rate = 8% − 3% = 5%.',
        'Interpretation: money grew 8%, but prices rose 3%, so purchasing power rose about 5%.'
      ]
    },

    // --- Participation & unemployment rate (ratio, given) ---------------------
    {
      id: 'b1-participation-ratio',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'ratio',
      title: 'Participation & Unemployment Rate',
      prompt: 'Using the labour-market figures below (millions), compute the labour force, the participation rate (%) '
        + 'and the unemployment rate (%). Round rates to 1 decimal place.',
      difficulty: 2,
      givens: [
        { label: 'Working-age population', value: 375 },
        { label: 'Employed (E)', value: 285 },
        { label: 'Unemployed (U)', value: 15 }
      ],
      fields: [
        { key: 'L', label: 'Labour force (millions)', answer: 300, tol: 0, unit: 'm', hint: 'L = E + U = 285 + 15' },
        { key: 'part', label: 'Participation rate', answer: 80, tol: 0.1, unit: '%', hint: '(L ÷ working-age) × 100 = (300 ÷ 375) × 100' },
        { key: 'u', label: 'Unemployment rate', answer: 5, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100 = (15 ÷ 300) × 100' }
      ],
      solution: [
        'Labour force L = E + U = 285 + 15 = 300 million.',
        'Participation rate = (L ÷ working-age population) × 100 = (300 ÷ 375) × 100 = 80.0%.',
        'Unemployment rate = (U ÷ L) × 100 = (15 ÷ 300) × 100 = 5.0%.'
      ]
    },

    // --- RANDOMIZED: unemployment & employment rate ---------------------------
    {
      id: 'b1-unemp-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Unemployment Rate — Drill',
      prompt: 'From the number of employed and unemployed, compute the labour force, the unemployment rate and the employment rate.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { E: 190, U: 10 },
          { E: 230, U: 20 },
          { E: 282, U: 18 },
          { E: 144, U: 6 },
          { E: 216, U: 24 }
        ] }
      },
      generate(p) {
        const E = p.pair.E, U = p.pair.U;
        const L = E + U;
        const u = (U / L) * 100;
        const e = (E / L) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A country has ' + E + ' million employed and ' + U + ' million unemployed. Compute the labour force '
            + '(millions), the unemployment rate (%) and the employment rate (%). Round rates to 1 decimal place.',
          fields: [
            { key: 'L', label: 'Labour force (millions)', answer: L, tol: 0, unit: 'm', hint: 'L = E + U = ' + E + ' + ' + U },
            { key: 'u', label: 'Unemployment rate', answer: u, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100' },
            { key: 'e', label: 'Employment rate', answer: e, tol: 0.1, unit: '%', hint: '(E ÷ L) × 100' }
          ],
          solution: [
            'Labour force L = E + U = ' + E + ' + ' + U + ' = ' + L + ' million.',
            'Unemployment rate = (' + U + ' ÷ ' + L + ') × 100 = ' + r1(u) + '%.',
            'Employment rate = (' + E + ' ÷ ' + L + ') × 100 = ' + r1(e) + '%.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. L = E + U; unemployment rate = U ÷ L × 100; employment rate = E ÷ L × 100.']
    },

    // --- RANDOMIZED: real interest rate ---------------------------------------
    {
      id: 'b1-real-rate-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Real Interest Rate — Drill',
      prompt: 'Compute the real interest rate from the nominal rate and the inflation rate.',
      difficulty: 1,
      params: {
        i: { choices: [5, 6, 7, 8, 9, 10] },
        pi: { choices: [1, 2, 3, 4] }
      },
      generate(p) {
        const r = p.i - p.pi;
        return {
          prompt: 'The nominal interest rate is ' + p.i + '% and the (expected) inflation rate is ' + p.pi
            + '%. Compute the real interest rate (%).',
          fields: [
            { key: 'r', label: 'Real interest rate', answer: r, tol: 0.1, unit: '%', hint: 'real ≈ nominal − inflation = ' + p.i + ' − ' + p.pi }
          ],
          solution: ['Real interest rate ≈ nominal − inflation = ' + p.i + '% − ' + p.pi + '% = ' + r + '%.']
        };
      },
      solution: ['Press “New numbers” for fresh values. Real interest rate ≈ nominal rate − (expected) inflation rate.']
    }
  ]
};

if (typeof window !== 'undefined') { window.macroeconomicsExercises = macroeconomicsExercises; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsExercises; }
