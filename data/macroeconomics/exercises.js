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
    },

    // ============================================================================
    // B2 — GDP MEASUREMENT (first-midterm), chapter 3
    //   Real GDP via deflator, growth rate, GDP per capita, nominal from real.
    //   Conventions: GDP/output 1 dp tol 0.5; growth rate % 1 dp tol 0.1; per capita tol 0.
    // ============================================================================

    // --- Concepts: GDP definitions, nominal/real, gap (TF + MC) ---------------
    {
      id: 'b2-concepts',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'choice',
      title: 'GDP Measurement — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'GDP counts only final goods and services, not intermediate ones.', kind: 'tf', answer: true },
        { q: 'A foreign-owned firm producing inside Croatia adds to Croatian GDP.', kind: 'tf', answer: true },
        { q: 'If prices rise during the year, real GDP is greater than nominal GDP.', kind: 'tf', answer: false },
        { q: 'Potential GDP is the maximum output the economy can produce at stable prices.', kind: 'tf', answer: true },
        { q: 'A recessional gap means the economy produces more than its potential.', kind: 'tf', answer: false },
        { q: 'A recession is defined as at least two consecutive quarters of negative growth.', kind: 'tf', answer: true },
        { q: 'Real GDP is measured at:', kind: 'mc', options: ['Current prices', 'Constant prices', 'Future prices', 'Black-market prices'], answer: 1 },
        { q: 'The best measure of the average standard of living is:', kind: 'mc', options: ['Nominal GDP', 'GDP per capita', 'Total exports', 'The CPI'], answer: 1 },
        { q: 'The measure of output that follows OWNERSHIP (factors wherever located) is:', kind: 'mc', options: ['GDP', 'GNP', 'CPI', 'Net exports'], answer: 1 }
      ],
      solution: [
        'When prices rise, real GDP is LESS than nominal GDP (the price rise inflates the nominal figure).',
        'A recessional gap = producing LESS than potential (idle resources); an inflationary gap = more than potential.',
        'GDP is geographic (within borders); GNP follows ownership of the factors of production.'
      ]
    },

    // --- Real GDP from nominal via the deflator (numeric, fixed) --------------
    {
      id: 'b2-realgdp-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Real GDP from Nominal',
      prompt: 'Nominal GDP is 325 (billion EUR) and the price index is 130 (base year = 100). Compute real GDP (billion EUR).',
      difficulty: 1,
      fields: [
        { key: 'real', label: 'Real GDP (billion)', answer: 250, tol: 0.5, unit: '', hint: 'Real = Nominal × (CPI_base ÷ CPI_n) = 325 × (100 ÷ 130)' }
      ],
      solution: [
        'Real GDP = Nominal GDP × (CPI_base ÷ CPI_n) = 325 × (100 ÷ 130) = 250.',
        'Although nominal output is 325, in constant prices it is only 250 — the rest was price increase.'
      ]
    },

    // --- Real GDP growth rate (numeric, fixed) --------------------------------
    {
      id: 'b2-growth-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Real GDP Growth Rate',
      prompt: 'Real GDP rose from 250 (last year) to 275 (this year). Compute the growth rate (%). Round to 1 decimal place.',
      difficulty: 1,
      fields: [
        { key: 'g', label: 'Growth rate', answer: 10, tol: 0.1, unit: '%', hint: '(Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100 = (275 − 250) ÷ 250 × 100' }
      ],
      solution: [
        'Growth rate = (Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100 = (275 − 250) ÷ 250 × 100 = 10.0%.',
        'Positive growth = expansion; negative growth = contraction (recession if it lasts two quarters).'
      ]
    },

    // --- GDP per capita (numeric, fixed) --------------------------------------
    {
      id: 'b2-percapita-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'GDP per Capita',
      prompt: 'A country has a real GDP of 900 billion EUR and a population of 45 million. Compute GDP per capita (EUR).',
      difficulty: 1,
      fields: [
        { key: 'pc', label: 'GDP per capita (EUR)', answer: 20000, tol: 0, unit: 'EUR', hint: 'GDP ÷ population = 900 billion ÷ 45 million' }
      ],
      solution: [
        'GDP per capita = real GDP ÷ population = 900 billion ÷ 45 million = 20,000 EUR.',
        'Per-capita GDP — not total GDP — is the standard gauge of average living standards.'
      ]
    },

    // --- Nominal GDP from real (numeric, fixed) -------------------------------
    {
      id: 'b2-nominal-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Nominal GDP from Real',
      prompt: 'Real GDP is 250 (billion EUR) and the GDP deflator (price index) is 130 (base year = 100). '
        + 'Compute nominal GDP (billion EUR).',
      difficulty: 2,
      fields: [
        { key: 'nom', label: 'Nominal GDP (billion)', answer: 325, tol: 0.5, unit: '', hint: 'Nominal = Real × (deflator ÷ 100) = 250 × (130 ÷ 100)' }
      ],
      solution: [
        'Nominal = Real × deflator ÷ 100 = 250 × 130 ÷ 100 = 325.',
        'This is just the deflator relationship rearranged: Nominal = Real × deflator.'
      ]
    },

    // --- RANDOMIZED: real GDP from nominal -------------------------------------
    {
      id: 'b2-realgdp-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Real GDP — Drill',
      prompt: 'Compute real GDP from nominal GDP and the price index.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { nom: 325, cpi: 130 },
          { nom: 480, cpi: 120 },
          { nom: 550, cpi: 110 },
          { nom: 360, cpi: 120 },
          { nom: 420, cpi: 105 }
        ] }
      },
      generate(p) {
        const nom = p.pair.nom, cpi = p.pair.cpi;
        const real = nom * 100 / cpi;
        return {
          prompt: 'Nominal GDP is ' + nom + ' (billion EUR) and the price index is ' + cpi
            + ' (base year = 100). Compute real GDP (billion EUR).',
          fields: [
            { key: 'real', label: 'Real GDP (billion)', answer: real, tol: 0.5, unit: '', hint: 'Real = Nominal × (100 ÷ CPI) = ' + nom + ' × (100 ÷ ' + cpi + ')' }
          ],
          solution: ['Real GDP = ' + nom + ' × (100 ÷ ' + cpi + ') = ' + real + '.']
        };
      },
      solution: ['Press “New numbers” for fresh values. Real GDP = Nominal GDP × (100 ÷ price index).']
    },

    // --- RANDOMIZED: GDP growth rate (incl. recessions) -----------------------
    {
      id: 'b2-growth-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Growth Rate — Drill',
      prompt: 'Compute the real GDP growth rate between the two years.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { y1: 200, y2: 220 },
          { y1: 250, y2: 240 },
          { y1: 300, y2: 312 },
          { y1: 400, y2: 380 },
          { y1: 150, y2: 165 }
        ] }
      },
      generate(p) {
        const y1 = p.pair.y1, y2 = p.pair.y2;
        const g = (y2 - y1) / y1 * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Real GDP changed from ' + y1 + ' (last year) to ' + y2 + ' (this year). Compute the growth '
            + 'rate (%). Round to 1 decimal place (a fall is negative).',
          fields: [
            { key: 'g', label: 'Growth rate', answer: g, tol: 0.1, unit: '%', hint: '(' + y2 + ' − ' + y1 + ') ÷ ' + y1 + ' × 100' }
          ],
          solution: ['Growth rate = (' + y2 + ' − ' + y1 + ') ÷ ' + y1 + ' × 100 = ' + r1(g) + '%.'
            + (g < 0 ? ' A negative rate means the economy contracted.' : '')]
        };
      },
      solution: ['Press “New numbers” for fresh values. Growth rate = (Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100; a fall is negative.']
    }
  ]
};

if (typeof window !== 'undefined') { window.macroeconomicsExercises = macroeconomicsExercises; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsExercises; }
