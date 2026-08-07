// ===== MACROECONOMICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NOT the engine): all domain data for interactive, auto-graded
// macroeconomics exercises. The generic engine (js/exercises-core.js, js/exercises.js,
// css/exercises.css) contains NOTHING from here — see docs/architecture/EXERCISES_ENGINE.md §2
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
    },

    // ============================================================================
    // B3 — NATIONAL ACCOUNTS (first-midterm), chapter 4
    //   Expenditure identity Y = C + I + G + (X − IM); missing component; value added.
    //   All answers are integers (tol 0). Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: approaches, identity, value added, sectors (TF + MC) -------
    {
      id: 'b3-concepts',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'National Accounts — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The production, expenditure and income approaches to GDP give the same value.', kind: 'tf', answer: true },
        { q: 'Net exports equal exports minus imports.', kind: 'tf', answer: true },
        { q: 'Value added equals gross value of production minus intermediate consumption.', kind: 'tf', answer: true },
        { q: 'Intermediate consumption is counted directly in GDP.', kind: 'tf', answer: false },
        { q: 'In the NACE classification, tourism is a single, separate sector.', kind: 'tf', answer: false },
        { q: 'In the identity S − I = (G + TR − T) + NX, the term (G + TR − T) is the government budget deficit.', kind: 'tf', answer: true },
        { q: 'The three-sector model of GDP is:', kind: 'mc', options: ['Y = C', 'Y = C + I', 'Y = C + I + G', 'Y = C + I + G + NX'], answer: 2 },
        { q: 'The expenditure approach to GDP is:', kind: 'mc', options: ['Y = C + I + G + (X − IM)', 'Y = wages + profits + rents', 'Y = sum of value added', 'Y = S + T'], answer: 0 },
        { q: 'In the macro symbols, TR stands for:', kind: 'mc', options: ['Taxes', 'Transfers', 'Trade', 'Total revenue'], answer: 1 }
      ],
      solution: [
        'Intermediate consumption is NOT counted directly — only final output is (value added avoids double-counting).',
        'Tourism is not a separate NACE activity/sector; it spans many activities (hence the satellite account).',
        '(G + TR − T) is the budget deficit: spending plus transfers minus taxes.'
      ]
    },

    // --- GDP from expenditure components (numeric, fixed) ---------------------
    {
      id: 'b3-gdp-fixed',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'GDP from Expenditure',
      prompt: 'An economy has C = 600, I = 150, G = 200, exports X = 80 and imports IM = 100. Compute net exports (NX) and GDP (Y).',
      difficulty: 1,
      fields: [
        { key: 'nx', label: 'Net exports (NX)', answer: -20, tol: 0, unit: '', hint: 'NX = X − IM = 80 − 100' },
        { key: 'y', label: 'GDP (Y)', answer: 930, tol: 0, unit: '', hint: 'Y = C + I + G + NX = 600 + 150 + 200 + (−20)' }
      ],
      solution: [
        'NX = X − IM = 80 − 100 = −20 (a trade deficit).',
        'Y = C + I + G + NX = 600 + 150 + 200 − 20 = 930.'
      ]
    },

    // --- Missing expenditure component (numeric, fixed) -----------------------
    {
      id: 'b3-missing-fixed',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Find the Missing Component',
      prompt: 'GDP is Y = 1000 with C = 600, I = 150 and net exports NX = 50. Compute government spending G.',
      difficulty: 2,
      fields: [
        { key: 'g', label: 'Government spending (G)', answer: 200, tol: 0, unit: '', hint: 'G = Y − C − I − NX = 1000 − 600 − 150 − 50' }
      ],
      solution: [
        'Rearrange Y = C + I + G + NX → G = Y − C − I − NX = 1000 − 600 − 150 − 50 = 200.'
      ]
    },

    // --- Value added (ratio, given) -------------------------------------------
    {
      id: 'b3-valueadded-ratio',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'ratio',
      title: 'Value Added',
      prompt: 'Using the production figures below, compute value added.',
      difficulty: 1,
      givens: [
        { label: 'Gross value of production', value: 500 },
        { label: 'Intermediate consumption', value: 180 }
      ],
      fields: [
        { key: 'va', label: 'Value added', answer: 320, tol: 0, unit: '', hint: 'Gross value − intermediate consumption = 500 − 180' }
      ],
      solution: [
        'Value added = gross value of production − intermediate consumption = 500 − 180 = 320.',
        'Summing value added across all activities (avoiding double-counting) gives GDP by the production approach.'
      ]
    },

    // --- RANDOMIZED: GDP from components --------------------------------------
    {
      id: 'b3-gdp-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'GDP from Expenditure — Drill',
      prompt: 'Compute net exports and GDP from the expenditure components.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { C: 600, I: 150, G: 200, X: 80, IM: 100 },
          { C: 500, I: 120, G: 180, X: 120, IM: 90 },
          { C: 700, I: 200, G: 250, X: 150, IM: 160 },
          { C: 550, I: 100, G: 150, X: 100, IM: 70 },
          { C: 640, I: 160, G: 220, X: 90, IM: 110 }
        ] }
      },
      generate(p) {
        const C = p.pair.C, I = p.pair.I, G = p.pair.G, X = p.pair.X, IM = p.pair.IM;
        const nx = X - IM;
        const y = C + I + G + nx;
        return {
          prompt: 'An economy has C = ' + C + ', I = ' + I + ', G = ' + G + ', exports X = ' + X
            + ' and imports IM = ' + IM + '. Compute net exports (NX) and GDP (Y).',
          fields: [
            { key: 'nx', label: 'Net exports (NX)', answer: nx, tol: 0, unit: '', hint: 'NX = X − IM = ' + X + ' − ' + IM },
            { key: 'y', label: 'GDP (Y)', answer: y, tol: 0, unit: '', hint: 'Y = C + I + G + NX' }
          ],
          solution: [
            'NX = X − IM = ' + X + ' − ' + IM + ' = ' + nx + '.',
            'Y = C + I + G + NX = ' + C + ' + ' + I + ' + ' + G + ' + (' + nx + ') = ' + y + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. NX = X − IM; Y = C + I + G + NX.']
    },

    // --- RANDOMIZED: missing component ----------------------------------------
    {
      id: 'b3-missing-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Missing Component — Drill',
      prompt: 'Given GDP and three components, solve for government spending G.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y: 1000, C: 600, I: 150, NX: 50 },
          { Y: 900, C: 550, I: 120, NX: -30 },
          { Y: 1200, C: 700, I: 250, NX: -50 },
          { Y: 850, C: 500, I: 200, NX: 0 },
          { Y: 1100, C: 650, I: 180, NX: 20 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, C = p.pair.C, I = p.pair.I, NX = p.pair.NX;
        const g = Y - C - I - NX;
        return {
          prompt: 'GDP is Y = ' + Y + ' with C = ' + C + ', I = ' + I + ' and net exports NX = ' + NX
            + '. Compute government spending G.',
          fields: [
            { key: 'g', label: 'Government spending (G)', answer: g, tol: 0, unit: '', hint: 'G = Y − C − I − NX' }
          ],
          solution: ['G = Y − C − I − NX = ' + Y + ' − ' + C + ' − ' + I + ' − (' + NX + ') = ' + g + '.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. From Y = C + I + G + NX, G = Y − C − I − NX.']
    },

    // ============================================================================
    // B4 — THE GOODS MARKET (first-midterm), chapter 5
    //   Multiplier 1/(1−c₁); equilibrium Y = 1/(1−c₁)·[c₀ + I + G − c₁T];
    //   ΔY = multiplier·ΔG; tax multiplier −c₁/(1−c₁), ΔY = (−c₁/(1−c₁))·ΔT.
    //   Clean c₁ ∈ {0.5,0.6,0.75,0.8} → multipliers 2/2.5/4/5 and integer Y.
    //   Conventions: multiplier 2 dp tol 0.05; output Y tol 0.5; ΔY tol 0.5.
    //   Randomized generate() reads p.pair.* (B2 lesson — pickParams stores the chosen object under the key).
    // ============================================================================

    // --- Concepts: equilibrium, multiplier, autonomous spending, taxes (TF + MC)
    {
      id: 'b4-concepts',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'The Goods Market — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'Goods-market equilibrium requires output Y to equal the demand for goods Z.', kind: 'tf', answer: true },
        { q: 'The multiplier 1/(1−c₁) is greater than 1 because 0 < c₁ < 1.', kind: 'tf', answer: true },
        { q: 'A higher marginal propensity to consume makes the multiplier smaller.', kind: 'tf', answer: false },
        { q: 'An increase in taxes (T) raises equilibrium output.', kind: 'tf', answer: false },
        { q: 'Autonomous spending is the part of demand that does not depend on current income.', kind: 'tf', answer: true },
        { q: 'The tax multiplier is smaller in absolute value than the government-spending multiplier.', kind: 'tf', answer: true },
        { q: 'If c₁ = 0.8, the multiplier 1/(1−c₁) equals:', kind: 'mc', options: ['2', '4', '5', '8'], answer: 2 },
        { q: 'With a multiplier of 4, an increase in G of 100 raises equilibrium output by:', kind: 'mc', options: ['40', '100', '250', '400'], answer: 3 },
        { q: 'In Y = 1/(1−c₁)·[c₀ + I + G − c₁T], the bracketed term is:', kind: 'mc', options: ['The multiplier', 'Autonomous spending', 'Disposable income', 'Net taxes'], answer: 1 }
      ],
      solution: [
        'A HIGHER MPC makes the multiplier LARGER: more of each extra euro is re-spent, so 1/(1−c₁) rises.',
        'Higher taxes cut disposable income and consumption, so they REDUCE equilibrium output (the tax multiplier is negative).',
        'Government spending acts on the multiplier in full (1/(1−c₁)); taxes act through −c₁/(1−c₁), which is smaller because c₁ < 1.'
      ]
    },

    // --- Multiplier from the MPC (numeric, fixed) -----------------------------
    {
      id: 'b4-multiplier-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'The Multiplier',
      prompt: 'The marginal propensity to consume is c₁ = 0.75. Compute the multiplier 1/(1 − c₁). Round to 2 decimal places.',
      difficulty: 1,
      fields: [
        { key: 'mult', label: 'Multiplier', answer: 4, tol: 0.05, unit: '', hint: '1 ÷ (1 − c₁) = 1 ÷ (1 − 0.75) = 1 ÷ 0.25' }
      ],
      solution: [
        'Multiplier = 1 ÷ (1 − c₁) = 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = 4.',
        'A one-unit rise in autonomous spending ultimately raises output by 4 units.'
      ]
    },

    // --- Equilibrium output (numeric, fixed) ----------------------------------
    {
      id: 'b4-equilibrium-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Equilibrium Output',
      prompt: 'Consumption is C = 500 + 0.5·Y_D, taxes T = 600, investment I = 300 and government spending G = 2000. '
        + 'Compute the multiplier and equilibrium output Y.',
      difficulty: 2,
      fields: [
        { key: 'mult', label: 'Multiplier', answer: 2, tol: 0.05, unit: '', hint: '1 ÷ (1 − c₁) = 1 ÷ (1 − 0.5)' },
        { key: 'Y', label: 'Equilibrium output (Y)', answer: 5000, tol: 0.5, unit: '', hint: 'Y = mult × [c₀ + I + G − c₁T] = 2 × [500 + 300 + 2000 − 0.5×600]' }
      ],
      solution: [
        'Multiplier = 1 ÷ (1 − 0.5) = 2.',
        'Autonomous spending = c₀ + I + G − c₁T = 500 + 300 + 2000 − 0.5×600 = 2800 − 300 = 2500.',
        'Y = multiplier × autonomous spending = 2 × 2500 = 5000.'
      ]
    },

    // --- Change in output from ΔG (numeric, fixed) ----------------------------
    {
      id: 'b4-deltaY-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Effect of Higher Spending',
      prompt: 'The marginal propensity to consume is c₁ = 0.75. Government spending rises by ΔG = 100. '
        + 'Compute the multiplier and the change in equilibrium output ΔY.',
      difficulty: 2,
      fields: [
        { key: 'mult', label: 'Multiplier', answer: 4, tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.75)' },
        { key: 'dY', label: 'Change in output (ΔY)', answer: 400, tol: 0.5, unit: '', hint: 'ΔY = multiplier × ΔG = 4 × 100' }
      ],
      solution: [
        'Multiplier = 1 ÷ (1 − 0.75) = 4.',
        'ΔY = multiplier × ΔG = 4 × 100 = 400. Spending of 100 raises output by 400 through repeated rounds of consumption.'
      ]
    },

    // --- Tax multiplier (numeric, fixed) --------------------------------------
    {
      id: 'b4-tax-effect-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'The Tax Multiplier',
      prompt: 'The marginal propensity to consume is c₁ = 0.75. Taxes rise by ΔT = 100. Compute the tax multiplier '
        + '−c₁/(1 − c₁) and the change in equilibrium output ΔY (a fall is negative).',
      difficulty: 3,
      fields: [
        { key: 'taxmult', label: 'Tax multiplier', answer: -3, tol: 0.05, unit: '', hint: '−c₁ ÷ (1 − c₁) = −0.75 ÷ 0.25' },
        { key: 'dY', label: 'Change in output (ΔY)', answer: -300, tol: 0.5, unit: '', hint: 'ΔY = tax multiplier × ΔT = −3 × 100' }
      ],
      solution: [
        'Tax multiplier = −c₁ ÷ (1 − c₁) = −0.75 ÷ 0.25 = −3.',
        'ΔY = tax multiplier × ΔT = −3 × 100 = −300. Higher taxes cut disposable income, consumption and output.',
        'Note it is smaller in size than the spending multiplier (4): taxes act on demand only through consumption.'
      ]
    },

    // --- RANDOMIZED: equilibrium output ---------------------------------------
    {
      id: 'b4-equilibrium-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Equilibrium Output — Drill',
      prompt: 'Compute the multiplier and equilibrium output from the consumption function and the components.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { c1: 0.5, c0: 500, I: 300, G: 2000, T: 600 },
          { c1: 0.6, c0: 400, I: 200, G: 1000, T: 500 },
          { c1: 0.75, c0: 300, I: 400, G: 1200, T: 800 },
          { c1: 0.8, c0: 200, I: 300, G: 900, T: 500 }
        ] }
      },
      generate(p) {
        const c1 = p.pair.c1, c0 = p.pair.c0, I = p.pair.I, G = p.pair.G, T = p.pair.T;
        const mult = 1 / (1 - c1);
        const auto = c0 + I + G - c1 * T;
        const Y = mult * auto;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'Consumption is C = ' + c0 + ' + ' + c1 + '·Y_D, taxes T = ' + T + ', investment I = ' + I
            + ' and government spending G = ' + G + '. Compute the multiplier and equilibrium output Y.',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + c1 + ')' },
            { key: 'Y', label: 'Equilibrium output (Y)', answer: Y, tol: 0.5, unit: '', hint: 'mult × [c₀ + I + G − c₁T]' }
          ],
          solution: [
            'Multiplier = 1 ÷ (1 − ' + c1 + ') = ' + r2(mult) + '.',
            'Autonomous spending = ' + c0 + ' + ' + I + ' + ' + G + ' − ' + c1 + '×' + T + ' = ' + auto + '.',
            'Y = ' + r2(mult) + ' × ' + auto + ' = ' + Y + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. Multiplier = 1/(1−c₁); Y = multiplier × [c₀ + I + G − c₁T].']
    },

    // --- RANDOMIZED: multiplier and ΔY from ΔG --------------------------------
    {
      id: 'b4-deltaY-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Multiplier Effect — Drill',
      prompt: 'From the marginal propensity to consume and a change in government spending, compute the multiplier and ΔY.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { c1: 0.5, dG: 100 },
          { c1: 0.6, dG: 200 },
          { c1: 0.75, dG: 100 },
          { c1: 0.8, dG: 50 },
          { c1: 0.75, dG: 200 }
        ] }
      },
      generate(p) {
        const c1 = p.pair.c1, dG = p.pair.dG;
        const mult = 1 / (1 - c1);
        const dY = mult * dG;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'The marginal propensity to consume is c₁ = ' + c1 + '. Government spending rises by ΔG = ' + dG
            + '. Compute the multiplier and the change in equilibrium output ΔY.',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + c1 + ')' },
            { key: 'dY', label: 'Change in output (ΔY)', answer: dY, tol: 0.5, unit: '', hint: 'ΔY = multiplier × ΔG = mult × ' + dG }
          ],
          solution: [
            'Multiplier = 1 ÷ (1 − ' + c1 + ') = ' + r2(mult) + '.',
            'ΔY = multiplier × ΔG = ' + r2(mult) + ' × ' + dG + ' = ' + dY + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. Multiplier = 1/(1−c₁); ΔY = multiplier × ΔG.']
    },

    // ============================================================================
    // B5 — FINANCIAL MARKETS (first-midterm), chapter 6
    //   Money demand M = $Y·L(i); equilibrium Mˢ = Mᵈ pins down i; bond yield
    //   i = (100 − P_B)/P_B; open-market operations; income → i (the LM logic).
    //   Linear money demand M = Y(0.4 − i) (i in DECIMAL) → i% = (0.4 − M/Y)·100.
    //   Conventions: interest rate / yield entered as PERCENT, 1 dp, tol 0.1.
    //   Randomized: scalar param P read as p.P; object param read as p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: money demand, equilibrium, bonds (TF + MC) -----------------
    {
      id: 'b5-concepts',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Financial Markets — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The demand for money rises with nominal income $Y.', kind: 'tf', answer: true },
        { q: 'The demand for money rises with the interest rate i.', kind: 'tf', answer: false },
        { q: 'The interest rate is the opportunity cost of holding money instead of bonds.', kind: 'tf', answer: true },
        { q: 'Bond prices and the interest rate move in the same direction.', kind: 'tf', answer: false },
        { q: 'The money supply is set by the central bank and is independent of the interest rate.', kind: 'tf', answer: true },
        { q: 'A rise in income, with the money supply fixed, raises the equilibrium interest rate.', kind: 'tf', answer: true },
        { q: 'The money-demand curve slopes downward because a higher interest rate:', kind: 'mc', options: ['Raises income', 'Raises the opportunity cost of holding money', 'Raises the money supply', 'Lowers bond prices forever'], answer: 1 },
        { q: 'For a one-year bond of face value 100, the yield is:', kind: 'mc', options: ['i = P_B / 100', 'i = 100 / P_B', 'i = (100 − P_B) / P_B', 'i = (P_B − 100) / 100'], answer: 2 },
        { q: 'Equilibrium in the money market occurs where:', kind: 'mc', options: ['Mˢ = Mᵈ', 'Y = C + I + G', 'i = inflation', 'S = I'], answer: 0 }
      ],
      solution: [
        'Money demand FALLS as i rises: higher interest makes bonds more attractive, so people hold less money.',
        'Bond prices and the interest rate move INVERSELY — a higher price means a lower yield (i = (100 − P_B)/P_B).',
        'A higher income raises money demand; with supply fixed, the equilibrium interest rate must rise (the upward-sloping LM relation).'
      ]
    },

    // --- Open-market operations: directions (TF + MC) -------------------------
    {
      id: 'b5-directions',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Monetary Policy & Open-Market Operations',
      prompt: 'Classify each statement about central-bank operations as true or false, then answer the MC items.',
      difficulty: 2,
      items: [
        { q: 'When the central bank BUYS bonds, bond prices rise and the interest rate falls.', kind: 'tf', answer: true },
        { q: 'Buying bonds increases the money supply (expansionary).', kind: 'tf', answer: true },
        { q: 'Selling bonds is expansionary monetary policy.', kind: 'tf', answer: false },
        { q: 'Selling bonds raises the interest rate.', kind: 'tf', answer: true },
        { q: 'To lower the interest rate, the central bank should:', kind: 'mc', options: ['Sell bonds', 'Buy bonds', 'Raise taxes', 'Cut government spending'], answer: 1 },
        { q: 'Contractionary monetary policy means the central bank:', kind: 'mc', options: ['Buys bonds and lowers i', 'Sells bonds and raises i', 'Buys bonds and raises i', 'Cuts taxes'], answer: 1 },
        { q: 'An open-market PURCHASE of bonds leads to:', kind: 'mc', options: ['Higher i, lower Mˢ', 'Lower i, higher Mˢ', 'Higher i, higher Mˢ', 'No change'], answer: 1 }
      ],
      solution: [
        'Selling bonds drains money from the economy → contractionary (bond prices fall, the interest rate rises).',
        'Expansionary chain: buy bonds → bond demand up → bond prices up → yield (i) down → money supply up.'
      ]
    },

    // --- Equilibrium interest rate (numeric, fixed) ---------------------------
    {
      id: 'b5-equilibrium-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Equilibrium Interest Rate',
      prompt: 'Money demand is M = Y(0.4 − i), income Y = 150 and the money supply Mˢ = 50. '
        + 'Compute the equilibrium interest rate i (%). Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'i', label: 'Equilibrium interest rate', answer: (0.4 - 50 / 150) * 100, tol: 0.1, unit: '%', hint: 'Set Mˢ = Mᵈ: 50 = 150(0.4 − i) → i = 0.4 − 50/150, then ×100' }
      ],
      solution: [
        'Set supply = demand: 50 = 150 × (0.4 − i).',
        '0.4 − i = 50 ÷ 150 = 0.3333, so i = 0.0667 ≈ 6.7%.'
      ]
    },

    // --- Bond yield from price (numeric, fixed) -------------------------------
    {
      id: 'b5-bond-yield-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Bond Yield',
      prompt: 'A one-year bond with a face (nominal) value of 100 sells for P_B = 95. Compute its yield i (%). '
        + 'Round to 1 decimal place.',
      difficulty: 1,
      fields: [
        { key: 'i', label: 'Bond yield', answer: (100 - 95) / 95 * 100, tol: 0.1, unit: '%', hint: 'i = (100 − P_B) ÷ P_B = (100 − 95) ÷ 95' }
      ],
      solution: [
        'i = (100 − P_B) ÷ P_B = (100 − 95) ÷ 95 = 5 ÷ 95 = 0.0526 ≈ 5.3%.',
        'A higher price would mean a lower yield — bond prices and the interest rate move inversely.'
      ]
    },

    // --- Income effect on i (numeric, fixed) ----------------------------------
    {
      id: 'b5-income-effect-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Income and the Interest Rate',
      prompt: 'Money demand is M = Y(0.4 − i) and the money supply is fixed at Mˢ = 60. '
        + 'Compute the equilibrium interest rate (%) when income Y = 200 and when Y = 300. Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'i1', label: 'Interest rate at Y = 200', answer: (0.4 - 60 / 200) * 100, tol: 0.1, unit: '%', hint: 'i = (0.4 − 60/200) × 100' },
        { key: 'i2', label: 'Interest rate at Y = 300', answer: (0.4 - 60 / 300) * 100, tol: 0.1, unit: '%', hint: 'i = (0.4 − 60/300) × 100' }
      ],
      solution: [
        'At Y = 200: i = 0.4 − 60/200 = 0.4 − 0.30 = 0.10 → 10.0%.',
        'At Y = 300: i = 0.4 − 60/300 = 0.4 − 0.20 = 0.20 → 20.0%.',
        'Higher income raises money demand; with supply fixed, the equilibrium interest rate rises (the LM logic).'
      ]
    },

    // --- RANDOMIZED: equilibrium interest rate --------------------------------
    {
      id: 'b5-equilibrium-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Equilibrium Interest Rate — Drill',
      prompt: 'Compute the equilibrium interest rate from money demand M = Y(0.4 − i), income and the money supply.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y: 200, M: 70 },
          { Y: 200, M: 60 },
          { Y: 200, M: 50 },
          { Y: 300, M: 105 },
          { Y: 400, M: 120 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, M = p.pair.M;
        const i = (0.4 - M / Y) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Money demand is M = Y(0.4 − i), income Y = ' + Y + ' and the money supply Mˢ = ' + M
            + '. Compute the equilibrium interest rate i (%). Round to 1 decimal place.',
          fields: [
            { key: 'i', label: 'Equilibrium interest rate', answer: i, tol: 0.1, unit: '%', hint: 'i = (0.4 − ' + M + '/' + Y + ') × 100' }
          ],
          solution: [
            'Set ' + M + ' = ' + Y + '(0.4 − i) → 0.4 − i = ' + M + '/' + Y + ' = ' + r1((M / Y) * 100) / 100 + '.',
            'i = 0.4 − ' + (M / Y) + ' = ' + r1(i) + '%.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. From Mˢ = Y(0.4 − i): i = (0.4 − Mˢ/Y) × 100.']
    },

    // --- RANDOMIZED: bond yield -----------------------------------------------
    {
      id: 'b5-bond-yield-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Bond Yield — Drill',
      prompt: 'Compute the yield of a one-year bond (face value 100) from its price.',
      difficulty: 1,
      params: {
        P: { choices: [95, 90, 80, 96, 98] }
      },
      generate(p) {
        const P = p.P;
        const i = (100 - P) / P * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A one-year bond with a face value of 100 sells for P_B = ' + P + '. Compute its yield i (%). '
            + 'Round to 1 decimal place.',
          fields: [
            { key: 'i', label: 'Bond yield', answer: i, tol: 0.1, unit: '%', hint: 'i = (100 − ' + P + ') ÷ ' + P }
          ],
          solution: ['i = (100 − ' + P + ') ÷ ' + P + ' = ' + (100 - P) + ' ÷ ' + P + ' = ' + r1(i) + '%.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. Bond yield i = (100 − P_B) ÷ P_B.']
    },

    // ============================================================================
    // B6 — THE IS-LM MODEL (first-midterm), chapter 7
    //   IS (goods market, downward) + LM (money market, upward); fiscal vs monetary
    //   policy; the policy mix. IS-LM here is QUALITATIVE/comparative-statics (the
    //   Learn gives no closed-form solution), so this brick is choice-based with one
    //   randomized comparative-statics drill (random policy → direction of Y and i).
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: IS / LM curves and their slopes (TF + MC) ------------------
    {
      id: 'b6-concepts',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'The IS-LM Model — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The IS curve represents goods-market equilibrium and slopes downward in the (Y, i) diagram.', kind: 'tf', answer: true },
        { q: 'The LM curve represents money-market equilibrium and slopes upward.', kind: 'tf', answer: true },
        { q: 'The IS curve slopes downward because a higher interest rate reduces investment.', kind: 'tf', answer: true },
        { q: 'The LM curve slopes upward because a higher income lowers money demand.', kind: 'tf', answer: false },
        { q: 'At the IS-LM intersection, both the goods market and the money market are in equilibrium.', kind: 'tf', answer: true },
        { q: 'The IS curve represents equilibrium in the:', kind: 'mc', options: ['Money market', 'Goods market', 'Labour market', 'Bond market only'], answer: 1 },
        { q: 'The LM curve represents equilibrium in the:', kind: 'mc', options: ['Goods market', 'Money market', 'Labour market', 'Foreign-exchange market'], answer: 1 },
        { q: 'The IS curve is downward-sloping because a higher interest rate:', kind: 'mc', options: ['Raises investment', 'Reduces investment, hence demand and output', 'Raises the money supply', 'Lowers taxes'], answer: 1 }
      ],
      solution: [
        'The LM curve slopes UPWARD because higher income RAISES money demand; with the money supply fixed, the interest rate must rise.',
        'IS = goods-market equilibrium (downward); LM = money-market equilibrium (upward); their intersection clears both markets.'
      ]
    },

    // --- What shifts each curve (TF + MC) -------------------------------------
    {
      id: 'b6-shifts',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Shifting the IS and LM Curves',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'An increase in government spending shifts the IS curve to the right.', kind: 'tf', answer: true },
        { q: 'An increase in taxes shifts the IS curve to the left.', kind: 'tf', answer: true },
        { q: 'An increase in the money supply shifts the LM curve down (to the right).', kind: 'tf', answer: true },
        { q: 'A fall in the money supply shifts the LM curve down.', kind: 'tf', answer: false },
        { q: 'An increase in G shifts the IS curve:', kind: 'mc', options: ['To the left', 'To the right', 'It does not move', 'It shifts the LM curve instead'], answer: 1 },
        { q: 'An increase in the money supply shifts the LM curve:', kind: 'mc', options: ['Up / to the left', 'Down / to the right', 'It does not move', 'It shifts the IS curve instead'], answer: 1 },
        { q: 'Which of these shifts the LM curve (not the IS curve)?', kind: 'mc', options: ['A change in government spending G', 'A change in taxes T', 'A change in the money supply', 'A change in autonomous investment'], answer: 2 }
      ],
      solution: [
        'A FALL in the money supply shifts the LM curve UP (to the left), raising the interest rate at each level of output.',
        'Fiscal variables (G, T) shift the IS curve; the money supply shifts the LM curve.'
      ]
    },

    // --- Fiscal policy effects (TF + MC) --------------------------------------
    {
      id: 'b6-fiscal-effects',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Fiscal Policy in IS-LM',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'A fiscal expansion raises both output and the interest rate.', kind: 'tf', answer: true },
        { q: 'A fiscal contraction (higher taxes) lowers output and lowers the interest rate.', kind: 'tf', answer: true },
        { q: 'A cut in taxes is contractionary.', kind: 'tf', answer: false },
        { q: 'A fiscal expansion (higher G) moves the economy to:', kind: 'mc', options: ['Higher Y, higher i', 'Lower Y, lower i', 'Higher Y, lower i', 'No change'], answer: 0 },
        { q: 'A fiscal contraction (higher T) leads to:', kind: 'mc', options: ['Higher Y and higher i', 'Lower Y and lower i', 'Lower Y, higher i', 'Higher Y, lower i'], answer: 1 },
        { q: 'Higher government spending raises the interest rate because:', kind: 'mc', options: ['The money supply falls', 'Higher output raises money demand', 'Taxes automatically rise', 'Prices fall'], answer: 1 }
      ],
      solution: [
        'A tax cut raises disposable income and demand — it is EXPANSIONARY (it shifts the IS curve right).',
        'A fiscal expansion shifts IS right: output rises, and the higher output raises money demand, pushing the interest rate up.'
      ]
    },

    // --- Monetary policy effects (TF + MC) ------------------------------------
    {
      id: 'b6-monetary-effects',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Monetary Policy in IS-LM',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'A monetary expansion raises output and lowers the interest rate.', kind: 'tf', answer: true },
        { q: 'A monetary contraction raises the interest rate and lowers output.', kind: 'tf', answer: true },
        { q: 'A monetary expansion raises the interest rate.', kind: 'tf', answer: false },
        { q: 'A monetary expansion (higher M) moves the economy to:', kind: 'mc', options: ['Higher Y, higher i', 'Higher Y, lower i', 'Lower Y, lower i', 'No change'], answer: 1 },
        { q: 'A monetary contraction leads to:', kind: 'mc', options: ['Higher Y, lower i', 'Lower Y, higher i', 'Higher Y, higher i', 'No change'], answer: 1 },
        { q: 'A lower interest rate boosts output mainly by raising:', kind: 'mc', options: ['Taxes', 'Investment', 'Imports', 'Money demand'], answer: 1 }
      ],
      solution: [
        'A monetary expansion shifts LM down: the interest rate FALLS (it does not rise), which raises investment and output.',
        'Monetary policy works through the interest rate: lower i → more investment → higher output.'
      ]
    },

    // --- The policy mix (TF + MC) ---------------------------------------------
    {
      id: 'b6-policy-mix',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'The Policy Mix',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'A policy mix is the combined use of fiscal and monetary policy.', kind: 'tf', answer: true },
        { q: 'A fiscal expansion plus a monetary expansion can raise output while keeping the interest rate from rising.', kind: 'tf', answer: true },
        { q: 'A policy mix can only ever be contractionary.', kind: 'tf', answer: false },
        { q: 'To raise output while keeping the interest rate roughly unchanged, combine:', kind: 'mc', options: ['Fiscal expansion + monetary contraction', 'Fiscal expansion + monetary expansion', 'Fiscal contraction + monetary contraction', 'Higher taxes only'], answer: 1 },
        { q: 'Using fiscal and monetary policy together is called a:', kind: 'mc', options: ['Multiplier', 'Policy mix', 'Liquidity trap', 'Crowding out'], answer: 1 },
        { q: 'A fiscal expansion alone raises i; adding a monetary expansion:', kind: 'mc', options: ['Raises i even further', 'Offsets the rise in i', 'Lowers output', 'Raises taxes'], answer: 1 }
      ],
      solution: [
        'A policy mix can be expansionary, contractionary, or designed to target output and the interest rate together.',
        'Fiscal expansion pushes i up; a simultaneous monetary expansion pushes i down — together they can lift output with little change in i.'
      ]
    },

    // --- RANDOMIZED: comparative statics (policy → Y and i directions) --------
    {
      id: 'b6-comparative-random',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'IS-LM Comparative Statics — Drill',
      prompt: 'For the given policy, determine the direction of equilibrium output and the interest rate.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { policy: 'a fiscal expansion (an increase in government spending G)', dY: 0, di: 0, why: 'IS shifts right: output rises, and higher output raises money demand, so the interest rate rises.' },
          { policy: 'a fiscal contraction (an increase in taxes T)', dY: 1, di: 1, why: 'IS shifts left: output falls, lower output reduces money demand, so the interest rate falls.' },
          { policy: 'a monetary expansion (the central bank increases the money supply)', dY: 0, di: 1, why: 'LM shifts down: the interest rate falls, which raises investment and output.' },
          { policy: 'a monetary contraction (the central bank reduces the money supply)', dY: 1, di: 0, why: 'LM shifts up: the interest rate rises, which lowers investment and output.' },
          { policy: 'a cut in taxes (lower T)', dY: 0, di: 0, why: 'A tax cut is expansionary (IS shifts right): output rises and the interest rate rises.' }
        ] }
      },
      generate(p) {
        const s = p.pair;
        const opts = ['Rises', 'Falls', 'Stays the same'];
        return {
          prompt: 'In the IS-LM model, consider ' + s.policy + '. Determine what happens to equilibrium output and to the interest rate.',
          items: [
            { q: 'What happens to equilibrium output Y?', kind: 'mc', options: opts, answer: s.dY },
            { q: 'What happens to the equilibrium interest rate i?', kind: 'mc', options: opts, answer: s.di }
          ],
          solution: [s.why]
        };
      },
      solution: ['Press “New numbers” for a fresh policy. Fiscal: shifts IS (Y and i move together). Monetary: shifts LM (Y and i move in opposite directions).']
    },

    // ============================================================================
    // B7 — THE LABOUR MARKET / NATURAL RATE (second-midterm), chapter 8
    //   Price-setting real wage W/P = 1/(1+μ); wage-setting F = 1 − u + z;
    //   natural rate u_n = 1 − 1/(1+μ) + z; natural output Y_n = L(1 − u_n).
    //   μ and z entered as PERCENT. Conventions: real wage 2–3 dp tol 0.01;
    //   natural rate % 1 dp tol 0.1; output (millions) integer tol 0.
    //   Randomized: scalar p.mu; object p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: WS, PS, natural rate, natural output (TF + MC) -------------
    {
      id: 'b7-concepts',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'The Labour Market — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'In the wage-setting relation, a higher unemployment rate lowers the wage.', kind: 'tf', answer: true },
        { q: 'The price-setting relation P = (1 + μ)W implies a real wage of 1/(1 + μ).', kind: 'tf', answer: true },
        { q: 'A higher markup μ raises the natural rate of unemployment.', kind: 'tf', answer: true },
        { q: 'More generous unemployment benefits (higher z) lower the natural rate.', kind: 'tf', answer: false },
        { q: 'The natural rate of unemployment is set by aggregate demand.', kind: 'tf', answer: false },
        { q: 'At the natural rate, the wage-setting and price-setting real wages are equal.', kind: 'tf', answer: true },
        { q: 'The price-setting relation P = (1 + μ)W implies a real wage of:', kind: 'mc', options: ['1 + μ', '1/(1 + μ)', 'μ', 'W − μ'], answer: 1 },
        { q: 'In the medium run, the natural rate of unemployment is determined by:', kind: 'mc', options: ['Aggregate demand', 'The structure of the labour and product markets (z and μ)', 'The money supply', 'Net exports'], answer: 1 },
        { q: 'The natural level of output corresponds to:', kind: 'mc', options: ['Zero unemployment', 'Unemployment equal to the natural rate', 'Zero inflation', 'A balanced budget'], answer: 1 }
      ],
      solution: [
        'Higher z (more generous benefits, stronger protection) RAISES the natural rate — workers can hold out for higher wages.',
        'The natural rate is a STRUCTURAL feature (z and μ), not something demand can permanently change.',
        'It is found by setting the WS real wage equal to the PS real wage (with P^e = P).'
      ]
    },

    // --- Price-setting real wage (numeric, fixed) -----------------------------
    {
      id: 'b7-realwage-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Price-Setting Real Wage',
      prompt: 'Firms set prices with a markup μ = 5% over wages, so P = (1 + μ)W. Compute the price-setting real wage W/P. '
        + 'Round to 3 decimal places.',
      difficulty: 1,
      fields: [
        { key: 'wp', label: 'Real wage W/P', answer: 1 / 1.05, tol: 0.01, unit: '', hint: 'W/P = 1 ÷ (1 + μ) = 1 ÷ 1.05' }
      ],
      solution: [
        'W/P = 1 ÷ (1 + μ) = 1 ÷ 1.05 = 0.952.',
        'A bigger markup would mean a lower real wage (more of the price goes to firms).'
      ]
    },

    // --- Natural rate of unemployment (numeric, fixed) ------------------------
    {
      id: 'b7-natural-rate-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'The Natural Rate of Unemployment',
      prompt: 'With the linear wage-setting form F = 1 − u + z, the markup is μ = 5% and z = 0. '
        + 'Compute the price-setting real wage W/P and the natural rate of unemployment u_n (%). Round the rate to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'wp', label: 'Real wage W/P', answer: 1 / 1.05, tol: 0.01, unit: '', hint: '1 ÷ (1 + 0.05)' },
        { key: 'un', label: 'Natural rate u_n', answer: (1 - 1 / 1.05 + 0) * 100, tol: 0.1, unit: '%', hint: 'u_n = 1 − 1/(1+μ) + z = 1 − 0.952 + 0, then ×100' }
      ],
      solution: [
        'W/P = 1 ÷ 1.05 = 0.952.',
        'u_n = 1 − 1/(1+μ) + z = 1 − 0.952 + 0 = 0.048 ≈ 4.8%.'
      ]
    },

    // --- Natural level of output (numeric, fixed) -----------------------------
    {
      id: 'b7-natural-output-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Natural Level of Output',
      prompt: 'The labour force is L = 200 (million) and the natural rate of unemployment is u_n = 5%. '
        + 'With one unit of output per worker, compute the natural level of output Y_n (millions).',
      difficulty: 1,
      fields: [
        { key: 'yn', label: 'Natural output Y_n (millions)', answer: 200 * (1 - 0.05), tol: 0, unit: 'm', hint: 'Y_n = L(1 − u_n) = 200 × (1 − 0.05)' }
      ],
      solution: [
        'Employment N = L(1 − u_n) = 200 × 0.95 = 190 million.',
        'With one unit of output per worker, Y_n = N = 190.'
      ]
    },

    // --- RANDOMIZED: price-setting real wage ----------------------------------
    {
      id: 'b7-realwage-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Real Wage — Drill',
      prompt: 'Compute the price-setting real wage from the markup.',
      difficulty: 1,
      params: {
        mu: { choices: [5, 10, 20, 25, 50] }
      },
      generate(p) {
        const mu = p.mu;
        const wp = 1 / (1 + mu / 100);
        const r3 = (x) => Math.round(x * 1000) / 1000;
        return {
          prompt: 'Firms set prices with a markup μ = ' + mu + '% over wages (P = (1 + μ)W). Compute the price-setting '
            + 'real wage W/P. Round to 3 decimal places.',
          fields: [
            { key: 'wp', label: 'Real wage W/P', answer: wp, tol: 0.01, unit: '', hint: 'W/P = 1 ÷ (1 + ' + (mu / 100) + ')' }
          ],
          solution: ['W/P = 1 ÷ (1 + ' + (mu / 100) + ') = ' + r3(wp) + '.']
        };
      },
      solution: ['Press “New numbers” for a fresh markup. W/P = 1 ÷ (1 + μ).']
    },

    // --- RANDOMIZED: natural rate of unemployment -----------------------------
    {
      id: 'b7-natural-rate-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Natural Rate — Drill',
      prompt: 'Compute the natural rate of unemployment from the markup and the wage-setting parameter z.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { mu: 5, z: 0 },
          { mu: 10, z: 0 },
          { mu: 25, z: 0 },
          { mu: 5, z: 2 },
          { mu: 10, z: 5 }
        ] }
      },
      generate(p) {
        const mu = p.pair.mu, z = p.pair.z;
        const un = (1 - 1 / (1 + mu / 100) + z / 100) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'With F = 1 − u + z, the markup is μ = ' + mu + '% and z = ' + z + '%. Compute the natural rate of '
            + 'unemployment u_n (%). Round to 1 decimal place.',
          fields: [
            { key: 'un', label: 'Natural rate u_n', answer: un, tol: 0.1, unit: '%', hint: 'u_n = (1 − 1/(1+' + (mu / 100) + ') + ' + (z / 100) + ') × 100' }
          ],
          solution: ['u_n = 1 − 1/(1+' + (mu / 100) + ') + ' + (z / 100) + ' = ' + r1(un) + '%.']
        };
      },
      solution: ['Press “New numbers” for fresh values. u_n = 1 − 1/(1+μ) + z (as a percent).']
    },

    // --- RANDOMIZED: natural level of output ----------------------------------
    {
      id: 'b7-natural-output-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Natural Output — Drill',
      prompt: 'Compute the natural level of output from the labour force and the natural rate of unemployment.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { L: 200, un: 5 },
          { L: 150, un: 4 },
          { L: 300, un: 10 },
          { L: 250, un: 8 },
          { L: 400, un: 5 }
        ] }
      },
      generate(p) {
        const L = p.pair.L, un = p.pair.un;
        const yn = L * (1 - un / 100);
        return {
          prompt: 'The labour force is L = ' + L + ' (million) and the natural rate of unemployment is u_n = ' + un
            + '%. With one unit of output per worker, compute the natural level of output Y_n (millions).',
          fields: [
            { key: 'yn', label: 'Natural output Y_n (millions)', answer: yn, tol: 0, unit: 'm', hint: 'Y_n = L(1 − u_n) = ' + L + ' × (1 − ' + (un / 100) + ')' }
          ],
          solution: ['Y_n = L(1 − u_n) = ' + L + ' × ' + (1 - un / 100) + ' = ' + yn + ' million.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. Y_n = L(1 − u_n).']
    },

    // ============================================================================
    // B8 — THE MEDIUM RUN / AS-AD (second-midterm), chapter 9
    //   AS (from the labour market, upward) + AD (from IS-LM, downward); short-run
    //   vs medium-run; money neutrality; the P^e adjustment process. Like IS-LM this
    //   is QUALITATIVE in the Learn material → choice-based, with one randomized
    //   shock drill (random shock → which curve shifts + short-run output effect).
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: AS/AD derivation, slopes, equilibrium (TF + MC) ------------
    {
      id: 'b8-concepts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'The Medium Run (AS-AD) — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The AS curve is derived from the labour market and slopes upward in the (Y, P) diagram.', kind: 'tf', answer: true },
        { q: 'The AD curve is derived from the IS-LM model and slopes downward.', kind: 'tf', answer: true },
        { q: 'In medium-run equilibrium, P = P^e and output equals the natural level Y_n.', kind: 'tf', answer: true },
        { q: 'The AD curve slopes downward because a higher price level raises the real money supply.', kind: 'tf', answer: false },
        { q: 'In the short run, output is determined by aggregate demand.', kind: 'tf', answer: true },
        { q: 'The AS curve is derived from equilibrium in the:', kind: 'mc', options: ['Goods market', 'Labour market', 'Money market', 'Bond market'], answer: 1 },
        { q: 'The AD curve slopes downward because a higher price level:', kind: 'mc', options: ['Raises the real money supply', 'Reduces the real money supply (M/P), raising i and lowering output', 'Raises output directly', 'Lowers the markup'], answer: 1 },
        { q: 'In medium-run equilibrium, output equals:', kind: 'mc', options: ['Zero', 'The natural level Y_n', 'Aggregate demand only', 'Potential minus the markup'], answer: 1 }
      ],
      solution: [
        'A higher price level REDUCES the real money supply M/P, which raises the interest rate and lowers output — that is why AD slopes downward.',
        'AS comes from the labour market (upward); AD comes from IS-LM (downward); medium-run equilibrium is where P = P^e and Y = Y_n.'
      ]
    },

    // --- What shifts AS and AD (TF + MC) --------------------------------------
    {
      id: 'b8-shifts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Shifting the AS and AD Curves',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'An increase in the money supply shifts the AD curve to the right.', kind: 'tf', answer: true },
        { q: 'A rise in the expected price level P^e shifts the AS curve up.', kind: 'tf', answer: true },
        { q: 'A fiscal expansion shifts the AD curve to the left.', kind: 'tf', answer: false },
        { q: 'A higher markup μ shifts the AS curve up (lowering the natural level of output).', kind: 'tf', answer: true },
        { q: 'An increase in the money supply shifts the AD curve:', kind: 'mc', options: ['To the left', 'To the right', 'It does not move', 'It shifts AS instead'], answer: 1 },
        { q: 'A rise in the expected price level shifts the AS curve:', kind: 'mc', options: ['Down', 'Up', 'It does not move', 'It shifts AD instead'], answer: 1 },
        { q: 'Which of these shifts the AS curve (not the AD curve)?', kind: 'mc', options: ['A change in the money supply', 'A change in government spending', 'A change in the expected price level', 'A change in autonomous investment'], answer: 2 }
      ],
      solution: [
        'A fiscal expansion (higher G) shifts the AD curve to the RIGHT, not the left.',
        'AD is shifted by demand factors (money, fiscal policy); AS is shifted by supply factors (P^e, the markup μ, z).'
      ]
    },

    // --- Short-run effects of demand shocks (TF + MC) -------------------------
    {
      id: 'b8-shortrun',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'The Short Run',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'In the short run, a monetary expansion raises output above the natural level.', kind: 'tf', answer: true },
        { q: 'In the short run, output can differ from the natural level.', kind: 'tf', answer: true },
        { q: 'A demand contraction raises output in the short run.', kind: 'tf', answer: false },
        { q: 'If output is above the natural level (Y > Y_n), then:', kind: 'mc', options: ['Unemployment is above the natural rate', 'Unemployment is below the natural rate', 'Prices must fall', 'The budget is balanced'], answer: 1 },
        { q: 'In the short run, a fiscal expansion:', kind: 'mc', options: ['Lowers output', 'Raises output and the price level', 'Has no effect', 'Lowers prices only'], answer: 1 },
        { q: 'In the short run, output is pinned down by:', kind: 'mc', options: ['The natural level Y_n', 'Aggregate demand', 'The markup', 'The labour force only'], answer: 1 }
      ],
      solution: [
        'A demand CONTRACTION lowers output in the short run (it shifts AD left).',
        'When Y > Y_n, unemployment is below the natural rate — the economy is overheating, which puts upward pressure on prices.'
      ]
    },

    // --- Medium-run adjustment & money neutrality (TF + MC) -------------------
    {
      id: 'b8-mediumrun',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'The Medium Run & Money Neutrality',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 2,
      items: [
        { q: 'In the medium run, output returns to the natural level Y_n.', kind: 'tf', answer: true },
        { q: 'In the medium run, a monetary expansion leaves output permanently higher.', kind: 'tf', answer: false },
        { q: 'In the medium run, aggregate demand affects mainly the price level.', kind: 'tf', answer: true },
        { q: 'In the medium run, a monetary expansion leads to:', kind: 'mc', options: ['Permanently higher output', 'The same output Y_n at a higher price level', 'Permanently lower prices', 'A lower natural rate'], answer: 1 },
        { q: 'In the medium run, aggregate demand affects mainly the:', kind: 'mc', options: ['Natural level of output', 'Price level', 'Labour force', 'Markup'], answer: 1 },
        { q: 'Money is said to be NEUTRAL in the medium run because it:', kind: 'mc', options: ['Changes the natural level of output', 'Affects only nominal variables (the price level), not Y_n', 'Lowers the markup', 'Raises real output forever'], answer: 1 }
      ],
      solution: [
        'A monetary expansion does NOT leave output permanently higher — in the medium run output returns to Y_n, with only the price level permanently higher.',
        'This is the neutrality of money: in the medium run, money affects the price level, not real output.'
      ]
    },

    // --- The adjustment process (TF + MC) -------------------------------------
    {
      id: 'b8-adjustment',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'The Adjustment Process',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 3,
      items: [
        { q: 'After a monetary expansion, as people revise P^e upward, the AS curve shifts up.', kind: 'tf', answer: true },
        { q: 'The adjustment stops when P = P^e and Y = Y_n again.', kind: 'tf', answer: true },
        { q: 'The adjustment process permanently raises the natural level of output.', kind: 'tf', answer: false },
        { q: 'Starting at Y_n, a monetary expansion in the SHORT run gives:', kind: 'mc', options: ['Y below Y_n', 'Y above Y_n with P above P^e', 'No change', 'Lower prices'], answer: 1 },
        { q: 'The economy returns to Y_n because:', kind: 'mc', options: ['The money supply falls back', 'Expectations P^e adjust upward, shifting AS up', 'Taxes automatically rise', 'Net exports adjust'], answer: 1 },
        { q: 'The end result of the adjustment is the same Y_n at a:', kind: 'mc', options: ['Lower price level', 'Higher price level', 'Lower markup', 'Higher natural rate'], answer: 1 }
      ],
      solution: [
        'The natural level of output is structural — the adjustment process returns output TO Y_n, it does not change Y_n.',
        'The mechanism: prices exceed expectations → P^e is revised up → AS shifts up → output falls back to Y_n at a higher price level.'
      ]
    },

    // --- RANDOMIZED: shock → which curve shifts + short-run output ------------
    {
      id: 'b8-comparative-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'AS-AD Shocks — Drill',
      prompt: 'For the given shock, identify which curve shifts and the short-run effect on output.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { shock: 'a monetary expansion (an increase in the money supply)', curve: 1, dY: 0, why: 'A monetary expansion shifts the AD curve right → in the short run output rises above Y_n.' },
          { shock: 'a monetary contraction (a fall in the money supply)', curve: 1, dY: 1, why: 'A monetary contraction shifts the AD curve left → in the short run output falls below Y_n.' },
          { shock: 'a fiscal expansion (an increase in government spending)', curve: 1, dY: 0, why: 'A fiscal expansion shifts the AD curve right → in the short run output rises above Y_n.' },
          { shock: 'a rise in the expected price level P^e', curve: 0, dY: 1, why: 'A higher P^e shifts the AS curve up → in the short run output falls below Y_n.' },
          { shock: 'a rise in the markup μ', curve: 0, dY: 1, why: 'A higher markup shifts the AS curve up (and lowers Y_n) → in the short run output falls.' }
        ] }
      },
      generate(p) {
        const s = p.pair;
        return {
          prompt: 'In the AS-AD model, consider ' + s.shock + '. Identify which curve shifts and the short-run effect on output.',
          items: [
            { q: 'Which curve shifts?', kind: 'mc', options: ['The AS curve', 'The AD curve'], answer: s.curve },
            { q: 'In the short run, output:', kind: 'mc', options: ['Rises (above Y_n)', 'Falls (below Y_n)'], answer: s.dY }
          ],
          solution: [s.why]
        };
      },
      solution: ['Press “New numbers” for a fresh shock. Demand shocks (money, fiscal) shift AD; supply shocks (P^e, μ, z) shift AS.']
    },

    // ============================================================================
    // B9 — THE LONG RUN / GROWTH (second-midterm), chapter 10
    //   Output per worker Y/N; investment from saving I = sY; capital accumulation
    //   K_{t+1} = (1 - δ)K_t + I_t; compound growth Y_n = Y_0(1 + g)^n.
    //   s, δ, g entered as PERCENT. Conventions: per-worker & amounts integer tol 0;
    //   compounded output 1 dp tol 0.5. Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: production function, Solow, growth sources (TF + MC) -------
    {
      id: 'b9-concepts',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'choice',
      title: 'The Long Run / Growth — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The aggregate production function Y = F(K, N) has diminishing returns to capital.', kind: 'tf', answer: true },
        { q: 'Output per worker depends on capital per worker K/N.', kind: 'tf', answer: true },
        { q: 'In the Solow model, investment is financed by saving.', kind: 'tf', answer: true },
        { q: 'A higher saving rate sustains a permanently higher growth RATE of output per worker.', kind: 'tf', answer: false },
        { q: 'Sustained long-run growth in output per worker requires technological progress.', kind: 'tf', answer: true },
        { q: 'Convergence means poorer countries tend to grow faster and catch up.', kind: 'tf', answer: true },
        { q: 'The production function Y = F(K, N) exhibits diminishing returns to:', kind: 'mc', options: ['Scale', 'Capital (and labour) separately', 'Saving', 'Depreciation'], answer: 1 },
        { q: 'Because of diminishing returns, capital accumulation ALONE gives a long-run growth rate of Y/N equal to:', kind: 'mc', options: ['The saving rate', 'Zero', 'The depreciation rate', 'Infinity'], answer: 1 },
        { q: 'What sustains long-run growth in output per worker?', kind: 'mc', options: ['A higher saving rate alone', 'Technological progress', 'A higher depreciation rate', 'More labour only'], answer: 1 }
      ],
      solution: [
        'A higher saving rate raises the LEVEL of output per worker (a richer steady state), but — because of diminishing returns — not its long-run growth RATE.',
        'Capital accumulation alone runs into diminishing returns; only technological progress sustains growth indefinitely.'
      ]
    },

    // --- Output per worker (numeric, fixed) -----------------------------------
    {
      id: 'b9-perworker-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Output per Worker',
      prompt: 'An economy produces output Y = 600 with N = 30 (million) workers. Compute output per worker Y/N.',
      difficulty: 1,
      fields: [
        { key: 'yn', label: 'Output per worker (Y/N)', answer: 600 / 30, tol: 0, unit: '', hint: 'Y ÷ N = 600 ÷ 30' }
      ],
      solution: [
        'Output per worker = Y ÷ N = 600 ÷ 30 = 20.',
        'Living standards depend on output per worker, which rises with capital per worker (K/N) — but with diminishing returns.'
      ]
    },

    // --- Investment from saving (numeric, fixed) ------------------------------
    {
      id: 'b9-investment-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Investment from Saving',
      prompt: 'The saving rate is s = 20% and output is Y = 1000. With I = sY, compute investment I.',
      difficulty: 1,
      fields: [
        { key: 'inv', label: 'Investment (I)', answer: 0.2 * 1000, tol: 0, unit: '', hint: 'I = sY = 0.20 × 1000' }
      ],
      solution: [
        'I = sY = 0.20 × 1000 = 200.',
        'Saving finances investment, which builds the capital stock — the engine of the Solow model.'
      ]
    },

    // --- Capital accumulation (numeric, fixed) --------------------------------
    {
      id: 'b9-capital-accum-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Capital Accumulation',
      prompt: 'The capital stock is K = 1000, the depreciation rate is δ = 10% and investment is I = 200. '
        + 'Using K_next = (1 − δ)K + I, compute next period’s capital stock.',
      difficulty: 2,
      fields: [
        { key: 'knext', label: 'Next-period capital', answer: (1 - 0.1) * 1000 + 200, tol: 0, unit: '', hint: 'K_next = (1 − 0.10) × 1000 + 200' }
      ],
      solution: [
        'K_next = (1 − δ)K + I = 0.90 × 1000 + 200 = 900 + 200 = 1100.',
        'Old capital depreciates (δK is lost) and new investment (I) is added.'
      ]
    },

    // --- RANDOMIZED: output per worker ----------------------------------------
    {
      id: 'b9-perworker-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Output per Worker — Drill',
      prompt: 'Compute output per worker from total output and the number of workers.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { Y: 600, N: 30 },
          { Y: 1200, N: 40 },
          { Y: 1000, N: 25 },
          { Y: 840, N: 42 },
          { Y: 1500, N: 50 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, N = p.pair.N;
        const yn = Y / N;
        return {
          prompt: 'An economy produces output Y = ' + Y + ' with N = ' + N + ' (million) workers. '
            + 'Compute output per worker Y/N.',
          fields: [
            { key: 'yn', label: 'Output per worker (Y/N)', answer: yn, tol: 0, unit: '', hint: Y + ' ÷ ' + N }
          ],
          solution: ['Output per worker = ' + Y + ' ÷ ' + N + ' = ' + yn + '.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. Output per worker = Y ÷ N.']
    },

    // --- RANDOMIZED: capital accumulation -------------------------------------
    {
      id: 'b9-capital-accum-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Capital Accumulation — Drill',
      prompt: 'Compute next period’s capital from the current stock, depreciation and investment.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { K: 1000, d: 10, I: 200 },
          { K: 800, d: 5, I: 100 },
          { K: 1200, d: 10, I: 300 },
          { K: 1500, d: 20, I: 400 },
          { K: 900, d: 10, I: 150 }
        ] }
      },
      generate(p) {
        const K = p.pair.K, d = p.pair.d, I = p.pair.I;
        const knext = (1 - d / 100) * K + I;
        return {
          prompt: 'The capital stock is K = ' + K + ', the depreciation rate is δ = ' + d + '% and investment is I = ' + I
            + '. Using K_next = (1 − δ)K + I, compute next period’s capital stock.',
          fields: [
            { key: 'knext', label: 'Next-period capital', answer: knext, tol: 0, unit: '', hint: '(1 − ' + (d / 100) + ') × ' + K + ' + ' + I }
          ],
          solution: ['K_next = (1 − ' + (d / 100) + ') × ' + K + ' + ' + I + ' = ' + ((1 - d / 100) * K) + ' + ' + I + ' = ' + knext + '.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. K_next = (1 − δ)K + I.']
    },

    // --- RANDOMIZED: compound growth ------------------------------------------
    {
      id: 'b9-growth-compound-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Compound Growth — Drill',
      prompt: 'Compute the level of output per capita after several years of compound growth.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y0: 100, g: 2, n: 3 },
          { Y0: 100, g: 3, n: 5 },
          { Y0: 200, g: 5, n: 2 },
          { Y0: 100, g: 10, n: 2 },
          { Y0: 150, g: 4, n: 3 }
        ] }
      },
      generate(p) {
        const Y0 = p.pair.Y0, g = p.pair.g, n = p.pair.n;
        const yn = Y0 * Math.pow(1 + g / 100, n);
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Output per capita starts at ' + Y0 + ' and grows by ' + g + '% per year for ' + n + ' years. '
            + 'Compute the level after ' + n + ' years. Round to 1 decimal place.',
          fields: [
            { key: 'yn', label: 'Level after ' + n + ' years', answer: yn, tol: 0.5, unit: '', hint: Y0 + ' × (1 + ' + (g / 100) + ')^' + n }
          ],
          solution: ['Level = ' + Y0 + ' × (1 + ' + (g / 100) + ')^' + n + ' = ' + r1(yn) + '. Because growth compounds, even small rates add up over time.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. Compounded level = Y₀ × (1 + g)ⁿ.']
    },

    // ============================================================================
    // B10 — EXPECTATIONS (second-midterm), chapter 11
    //   Fisher relation r ≈ i − π^e; expected present discounted value z/(1+r)^n;
    //   a higher r lowers every present value; expectations shift the IS curve.
    //   Rates entered as PERCENT (1 dp, tol 0.1); present values 1 dp tol 0.5.
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: Fisher, present value, expectations & IS (TF + MC) ---------
    {
      id: 'b10-concepts',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'choice',
      title: 'Expectations — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The real interest rate approximately equals the nominal rate minus expected inflation.', kind: 'tf', answer: true },
        { q: 'A higher interest rate lowers the present value of a given future payment.', kind: 'tf', answer: true },
        { q: 'The real interest rate is the one that matters for spending and investment decisions.', kind: 'tf', answer: true },
        { q: 'A payment received in the future is worth more today than the same payment received now.', kind: 'tf', answer: false },
        { q: 'Optimistic expectations about the future shift the IS curve to the right.', kind: 'tf', answer: true },
        { q: 'The real interest rate approximately equals the nominal rate minus:', kind: 'mc', options: ['The tax rate', 'Expected inflation', 'The growth rate', 'The markup'], answer: 1 },
        { q: 'Expected present discounted value is found by ___ future payments:', kind: 'mc', options: ['Adding up', 'Discounting', 'Taxing', 'Doubling'], answer: 1 },
        { q: 'More optimistic expectations about the future tend to:', kind: 'mc', options: ['Lower output today', 'Raise consumption and investment today', 'Raise the markup', 'Lower the money supply'], answer: 1 },
        { q: 'Monetary policy affects demand partly through expectations of the future path of:', kind: 'mc', options: ['Taxes', 'Interest rates', 'Net exports', 'The markup'], answer: 1 }
      ],
      solution: [
        'A future payment is worth LESS today (it is discounted), because money today could earn interest in the meantime.',
        'Spending depends on the REAL interest rate and on expectations of future income, profits and rates — so optimism shifts the IS curve right.'
      ]
    },

    // --- Fisher: real interest rate (numeric, fixed) --------------------------
    {
      id: 'b10-realrate-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'The Fisher Relation',
      prompt: 'The nominal interest rate is i = 4% and expected inflation is π^e = 2%. Compute the real interest rate r (%).',
      difficulty: 1,
      fields: [
        { key: 'r', label: 'Real interest rate', answer: 4 - 2, tol: 0.1, unit: '%', hint: 'r ≈ i − π^e = 4 − 2' }
      ],
      solution: [
        'r ≈ i − π^e = 4% − 2% = 2%.',
        'A saver gives up goods today for about 2% more goods next year — the real return is what shapes decisions.'
      ]
    },

    // --- Present value, one year (numeric, fixed) -----------------------------
    {
      id: 'b10-pv-1yr-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Present Value (One Year)',
      prompt: 'A payment of z = 1050 is due one year from now and the interest rate is r = 5%. '
        + 'Compute its expected present discounted value.',
      difficulty: 1,
      fields: [
        { key: 'pv', label: 'Present value', answer: 1050 / 1.05, tol: 0.5, unit: '', hint: 'PV = z ÷ (1 + r) = 1050 ÷ 1.05' }
      ],
      solution: [
        'PV = z ÷ (1 + r) = 1050 ÷ 1.05 = 1000.',
        'The future 1050 is worth only 1000 today — money tomorrow is discounted.'
      ]
    },

    // --- Present value, two years (numeric, fixed) ----------------------------
    {
      id: 'b10-pv-2yr-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Present Value (Two Years)',
      prompt: 'A payment of z = 1210 is due two years from now and the interest rate is r = 10%. '
        + 'Compute its expected present discounted value.',
      difficulty: 2,
      fields: [
        { key: 'pv', label: 'Present value', answer: 1210 / Math.pow(1.1, 2), tol: 0.5, unit: '', hint: 'PV = z ÷ (1 + r)^2 = 1210 ÷ 1.21' }
      ],
      solution: [
        'PV = z ÷ (1 + r)^2 = 1210 ÷ 1.1^2 = 1210 ÷ 1.21 = 1000.',
        'Payments further in the future are discounted more heavily (divided by (1+r) for each year).'
      ]
    },

    // --- Present value: effect of the interest rate (numeric, fixed) ----------
    {
      id: 'b10-pv-rate-effect-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Interest Rates and Present Value',
      prompt: 'A payment of z = 1200 is due one year from now. Compute its present value when r = 20% and when r = 50%. '
        + 'What this shows: a higher interest rate lowers the present value.',
      difficulty: 2,
      fields: [
        { key: 'pv20', label: 'Present value at r = 20%', answer: 1200 / 1.2, tol: 0.5, unit: '', hint: '1200 ÷ 1.20' },
        { key: 'pv50', label: 'Present value at r = 50%', answer: 1200 / 1.5, tol: 0.5, unit: '', hint: '1200 ÷ 1.50' }
      ],
      solution: [
        'At r = 20%: PV = 1200 ÷ 1.20 = 1000.',
        'At r = 50%: PV = 1200 ÷ 1.50 = 800.',
        'A higher interest rate discounts the future more heavily, so the present value falls.'
      ]
    },

    // --- RANDOMIZED: Fisher real rate -----------------------------------------
    {
      id: 'b10-realrate-random',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Real Interest Rate — Drill',
      prompt: 'Compute the real interest rate from the nominal rate and expected inflation.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { i: 4, pi: 2 },
          { i: 6, pi: 2 },
          { i: 5, pi: 1 },
          { i: 8, pi: 3 },
          { i: 7, pi: 4 }
        ] }
      },
      generate(p) {
        const i = p.pair.i, pi = p.pair.pi;
        const r = i - pi;
        return {
          prompt: 'The nominal interest rate is i = ' + i + '% and expected inflation is π^e = ' + pi
            + '%. Compute the real interest rate r (%).',
          fields: [
            { key: 'r', label: 'Real interest rate', answer: r, tol: 0.1, unit: '%', hint: 'r ≈ i − π^e = ' + i + ' − ' + pi }
          ],
          solution: ['r ≈ i − π^e = ' + i + '% − ' + pi + '% = ' + r + '%.']
        };
      },
      solution: ['Press “New numbers” for fresh values. Real rate ≈ nominal rate − expected inflation.']
    },

    // --- RANDOMIZED: present value over n years -------------------------------
    {
      id: 'b10-pv-random',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Present Value — Drill',
      prompt: 'Compute the present value of a future payment.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { z: 1050, r: 5, n: 1 },
          { z: 1260, r: 5, n: 1 },
          { z: 1100, r: 10, n: 1 },
          { z: 1210, r: 10, n: 2 },
          { z: 1440, r: 20, n: 2 }
        ] }
      },
      generate(p) {
        const z = p.pair.z, r = p.pair.r, n = p.pair.n;
        const pv = z / Math.pow(1 + r / 100, n);
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A payment of z = ' + z + ' is due ' + n + ' year' + (n > 1 ? 's' : '') + ' from now and the interest '
            + 'rate is r = ' + r + '%. Compute its expected present discounted value.',
          fields: [
            { key: 'pv', label: 'Present value', answer: pv, tol: 0.5, unit: '', hint: z + ' ÷ (1 + ' + (r / 100) + ')^' + n }
          ],
          solution: ['PV = ' + z + ' ÷ (1 + ' + (r / 100) + ')^' + n + ' = ' + r1(pv) + '.']
        };
      },
      solution: ['Press “New numbers” for fresh figures. PV = z ÷ (1 + r)ⁿ.']
    },

    // ============================================================================
    // B11 — THE OPEN ECONOMY: GOODS MARKET (second-midterm), chapter 12
    //   Import function IM = IM0 + m·Y; net exports NX = X − IM;
    //   demand for domestic goods Z = C + I + G − IM + X; equilibrium Y = (C+I+G) + NX.
    //   Open-economy multiplier = 1 / (1 − β(1−t) + m) — imports add +m to the
    //   denominator, so they SHRINK the multiplier. β, t, m are decimals here.
    //   Marshall-Lerner: a real depreciation raises NX only if elasticities sum > 1.
    //   Fiscal expansion raises Y → raises imports → NX falls.
    //   Multiplier 2 dp tol 0.05; amounts (IM, NX, Z, ΔY) tol 0; randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: imports, multiplier, NX, real exchange rate, Marshall-Lerner ---
    {
      id: 'b11-concepts',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'choice',
      title: 'The Open Economy (Goods) — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'Imports rise with domestic output: IM = IM0 + m·Y.', kind: 'tf', answer: true },
        { q: 'Imports add a new leak to the spending loop, so they make the multiplier smaller.', kind: 'tf', answer: true },
        { q: 'Net exports equal exports minus imports, NX = X − IM.', kind: 'tf', answer: true },
        { q: 'A real appreciation (domestic goods relatively more expensive) raises net exports.', kind: 'tf', answer: false },
        { q: 'An increase in government spending raises output and therefore tends to lower net exports.', kind: 'tf', answer: true },
        { q: 'The marginal propensity to import m is the extra import per unit of extra:', kind: 'mc', options: ['Taxes', 'Output', 'Exports', 'Government spending'], answer: 1 },
        { q: 'In the open-economy multiplier 1/(1 − β(1−t) + m), a higher m makes the multiplier:', kind: 'mc', options: ['Larger', 'Smaller', 'Unchanged', 'Negative'], answer: 1 },
        { q: 'Demand for domestic goods equals C + I + G:', kind: 'mc', options: ['Plus imports, minus exports', 'Minus imports, plus exports', 'Minus taxes', 'Plus the markup'], answer: 1 },
        { q: 'Assuming the Marshall-Lerner condition holds, net exports rise after a real:', kind: 'mc', options: ['Appreciation', 'Depreciation', 'Tax cut', 'Rise in the markup'], answer: 1 }
      ],
      solution: [
        'Imports are a leak (like saving and taxes): part of every extra euro of income is spent on foreign goods and stops circulating at home, so the multiplier 1/(1 − β(1−t) + m) is smaller than the closed-economy one.',
        'A real depreciation makes domestic goods cheaper abroad → exports rise, imports fall → NX rises, provided the Marshall-Lerner condition (sum of price elasticities > 1) holds.'
      ]
    },

    // --- Open-economy multiplier vs closed (numeric, fixed) -------------------
    {
      id: 'b11-multiplier-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Imports Shrink the Multiplier',
      prompt: 'Let β = 0.8, t = 0.1 and m = 0.12. Compute the multiplier first IGNORING imports (m = 0), '
        + 'then WITH imports. This shows how importing reduces the multiplier.',
      difficulty: 2,
      fields: [
        { key: 'closed', label: 'Closed-economy multiplier (m = 0)', answer: 1 / (1 - 0.8 * (1 - 0.1)), tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.8·0.9)' },
        { key: 'open', label: 'Open-economy multiplier', answer: 1 / (1 - 0.8 * (1 - 0.1) + 0.12), tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.8·0.9 + 0.12)' }
      ],
      solution: [
        'Closed: 1 ÷ (1 − 0.8·0.9) = 1 ÷ 0.28 ≈ 3.57.',
        'Open: 1 ÷ (1 − 0.8·0.9 + 0.12) = 1 ÷ 0.40 = 2.5.',
        'The multiplier falls from 3.57 to 2.5 — part of every extra euro now buys foreign goods, so it leaks out of the domestic economy.'
      ]
    },

    // --- Import function (numeric, fixed) -------------------------------------
    {
      id: 'b11-imports-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'The Import Function',
      prompt: 'Autonomous imports are IM0 = 100, the marginal propensity to import is m = 0.1 and output is Y = 2000. '
        + 'Compute total imports IM.',
      difficulty: 1,
      fields: [
        { key: 'im', label: 'Imports IM', answer: 100 + 0.1 * 2000, tol: 0, unit: '', hint: 'IM = IM0 + m·Y = 100 + 0.1·2000' }
      ],
      solution: [
        'IM = IM0 + m·Y = 100 + 0.1·2000 = 100 + 200 = 300.',
        'Imports rise with income: richer residents buy more from abroad.'
      ]
    },

    // --- Net exports and demand for domestic goods (numeric, fixed) -----------
    {
      id: 'b11-netexports-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Net Exports and Demand for Domestic Goods',
      prompt: 'Domestic demand C + I + G = 1900, exports X = 400 and imports IM = 300. '
        + 'Compute net exports NX and the demand for domestic goods Z.',
      difficulty: 2,
      fields: [
        { key: 'nx', label: 'Net exports NX', answer: 400 - 300, tol: 0, unit: '', hint: 'NX = X − IM = 400 − 300' },
        { key: 'z', label: 'Demand for domestic goods Z', answer: 1900 - 300 + 400, tol: 0, unit: '', hint: 'Z = (C+I+G) − IM + X = 1900 − 300 + 400' }
      ],
      solution: [
        'NX = X − IM = 400 − 300 = 100 (a trade surplus).',
        'Z = (C + I + G) − IM + X = 1900 − 300 + 400 = 2000: subtract the imports hidden inside C+I+G, add exports.',
        'Note Z = (C+I+G) + NX = 1900 + 100 = 2000 — the two routes agree.'
      ]
    },

    // --- Fiscal expansion: output and net exports (numeric, fixed) ------------
    {
      id: 'b11-fiscal-nx-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Fiscal Expansion Worsens the Trade Balance',
      prompt: 'The open-economy multiplier is 2.5 and the marginal propensity to import is m = 0.12. '
        + 'Government spending rises by ΔG = 100 (exports are unchanged). '
        + 'Compute the rise in output ΔY, the rise in imports ΔIM, and the fall in net exports.',
      difficulty: 3,
      fields: [
        { key: 'dy', label: 'Rise in output ΔY', answer: 2.5 * 100, tol: 0.5, unit: '', hint: 'ΔY = multiplier · ΔG = 2.5·100' },
        { key: 'dim', label: 'Rise in imports ΔIM', answer: 0.12 * (2.5 * 100), tol: 0.5, unit: '', hint: 'ΔIM = m·ΔY = 0.12·250' },
        { key: 'dnx', label: 'Fall in net exports', answer: 0.12 * (2.5 * 100), tol: 0.5, unit: '', hint: 'ΔX = 0, so NX falls by ΔIM' }
      ],
      solution: [
        'ΔY = multiplier · ΔG = 2.5 · 100 = 250.',
        'ΔIM = m · ΔY = 0.12 · 250 = 30.',
        'Exports do not change, so NX = X − IM falls by 30: fiscal expansion partly leaks abroad as higher imports.'
      ]
    },

    // --- RANDOMIZED: open-economy multiplier ----------------------------------
    {
      id: 'b11-multiplier-random',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Open-Economy Multiplier — Drill',
      prompt: 'Compute the open-economy multiplier from β, the tax rate t and the marginal propensity to import m.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { b: 0.8, t: 0.1, m: 0.12 },
          { b: 0.75, t: 0.2, m: 0.1 },
          { b: 0.9, t: 0, m: 0.15 },
          { b: 0.6, t: 0, m: 0.1 },
          { b: 0.8, t: 0, m: 0.2 }
        ] }
      },
      generate(p) {
        const b = p.pair.b, t = p.pair.t, m = p.pair.m;
        const denom = 1 - b * (1 - t) + m;
        const mult = 1 / denom;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'With β = ' + b + ', t = ' + t + ' and m = ' + m + ', compute the open-economy multiplier '
            + '1 ÷ (1 − β(1−t) + m).',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + b + '·' + (1 - t) + ' + ' + m + ')' }
          ],
          solution: [
            'Denominator = 1 − ' + b + '·' + (1 - t) + ' + ' + m + ' = ' + r2(denom) + '.',
            'Multiplier = 1 ÷ ' + r2(denom) + ' = ' + r2(mult) + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for fresh values. Multiplier = 1 ÷ (1 − β(1−t) + m); a larger m means a smaller multiplier.']
    },

    // --- RANDOMIZED: net exports from the import function ----------------------
    {
      id: 'b11-netexports-random',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Net Exports — Drill',
      prompt: 'Compute imports from the import function, then net exports NX = X − IM.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { X: 400, IM0: 50, m: 0.1, Y: 2000 },
          { X: 500, IM0: 100, m: 0.2, Y: 1500 },
          { X: 300, IM0: 0, m: 0.15, Y: 1000 },
          { X: 600, IM0: 200, m: 0.1, Y: 3000 },
          { X: 450, IM0: 50, m: 0.2, Y: 1000 }
        ] }
      },
      generate(p) {
        const X = p.pair.X, IM0 = p.pair.IM0, m = p.pair.m, Y = p.pair.Y;
        const im = IM0 + m * Y;
        const nx = X - im;
        return {
          prompt: 'Exports X = ' + X + '. Imports are IM = ' + IM0 + ' + ' + m + '·Y with output Y = ' + Y + '. '
            + 'Compute imports IM and net exports NX.',
          fields: [
            { key: 'im', label: 'Imports IM', answer: im, tol: 0, unit: '', hint: 'IM = ' + IM0 + ' + ' + m + '·' + Y },
            { key: 'nx', label: 'Net exports NX', answer: nx, tol: 0, unit: '', hint: 'NX = X − IM = ' + X + ' − IM' }
          ],
          solution: [
            'IM = ' + IM0 + ' + ' + m + '·' + Y + ' = ' + im + '.',
            'NX = X − IM = ' + X + ' − ' + im + ' = ' + nx + (nx >= 0 ? ' (surplus).' : ' (deficit).')
          ]
        };
      },
      solution: ['Press “New numbers” for fresh figures. NX = X − (IM0 + m·Y).']
    },

    // ============================================================================
    // B12 — BALANCE OF PAYMENTS (second-midterm), chapter 13  [LAST macro brick]
    //   BoP = all transactions with the rest of the world over one year, in two
    //   accounts: CURRENT (goods, services, primary & secondary income) and
    //   FINANCIAL/capital. With the change in reserves, the whole BoP sums to ZERO,
    //   so a current-account deficit must be financed by capital inflows.
    //   Travel (tourism) balance = income from foreign tourists − spending of
    //   residents abroad — Croatia's travel surplus offsets its goods deficit.
    //   Net capital export K = f(r), dK/dr < 0 (a higher r attracts capital in →
    //   currency appreciates → NX deteriorates). All items are accounting sums →
    //   integer amounts, tol 0. Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: accounts, sums-to-zero, travel balance, K=f(r) -------------
    {
      id: 'b12-concepts',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'choice',
      title: 'Balance of Payments — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'The balance of payments records a country’s transactions with the rest of the world over one year.', kind: 'tf', answer: true },
        { q: 'Including the change in official reserves, the whole balance of payments sums to zero.', kind: 'tf', answer: true },
        { q: 'The travel balance equals income from foreign tourists minus spending of residents abroad.', kind: 'tf', answer: true },
        { q: 'Net capital export K rises as the domestic interest rate rises.', kind: 'tf', answer: false },
        { q: 'A current-account deficit must be financed by capital inflows.', kind: 'tf', answer: true },
        { q: 'The two main accounts of the balance of payments are the current account and the:', kind: 'mc', options: ['Markup account', 'Financial (capital) account', 'Government account', 'Reserve ratio'], answer: 1 },
        { q: 'Spending by foreign tourists inside the country is recorded as an:', kind: 'mc', options: ['Import (outflow)', 'Export (inflow)', 'Transfer abroad', 'Capital outflow'], answer: 1 },
        { q: 'Net capital export K is a ___ function of the domestic interest rate:', kind: 'mc', options: ['Increasing', 'Decreasing', 'Constant', 'Random'], answer: 1 },
        { q: 'A higher domestic interest rate tends to make the currency appreciate, so net exports:', kind: 'mc', options: ['Rise', 'Deteriorate', 'Stay fixed', 'Become zero'], answer: 1 }
      ],
      solution: [
        'A higher r attracts foreign capital in (net capital export FALLS): K = f(r) with dK/dr < 0.',
        'Because the accounts mirror each other and sum to zero, a current-account deficit is the counterpart of a financial-account (capital) surplus — the country borrows from or sells assets to the rest of the world.'
      ]
    },

    // --- Travel (tourism) balance (numeric, fixed) ----------------------------
    {
      id: 'b12-travel-balance-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'The Travel (Tourism) Balance',
      prompt: 'Foreign tourists spend 12000 in the country, while residents spend 4000 abroad. '
        + 'Compute the travel (tourism) balance.',
      difficulty: 1,
      fields: [
        { key: 'tb', label: 'Travel balance', answer: 12000 - 4000, tol: 0, unit: '', hint: 'income from foreign tourists − spending of residents abroad = 12000 − 4000' }
      ],
      solution: [
        'Travel balance = income from foreign tourists − spending of residents abroad = 12000 − 4000 = 8000.',
        'A positive travel balance (surplus) means the country is tourist-receptive: tourism is a net foreign-exchange earner.'
      ]
    },

    // --- Current account from its components (numeric, fixed) -----------------
    {
      id: 'b12-current-account-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'The Current Account',
      prompt: 'A country records: goods balance −5000, services balance +9000, primary income −800, '
        + 'secondary income +300. Compute the current-account balance.',
      difficulty: 2,
      fields: [
        { key: 'ca', label: 'Current account', answer: -5000 + 9000 - 800 + 300, tol: 0, unit: '', hint: 'goods + services + primary income + secondary income' }
      ],
      solution: [
        'CA = −5000 + 9000 − 800 + 300 = 3500.',
        'The services surplus (which contains the travel balance) more than offsets the goods deficit — a current-account surplus.'
      ]
    },

    // --- Tourism offsets the goods deficit (numeric, fixed) -------------------
    {
      id: 'b12-tourism-offset-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Tourism Offsets the Goods Deficit',
      prompt: 'A small tourism economy runs a goods (trade) balance of −6000 (a merchandise deficit) but a '
        + 'travel surplus of +8000. Compute their combined balance, which shows whether tourism covers the goods deficit.',
      difficulty: 2,
      fields: [
        { key: 'comb', label: 'Combined balance', answer: -6000 + 8000, tol: 0, unit: '', hint: 'goods balance + travel balance = −6000 + 8000' }
      ],
      solution: [
        'Combined = −6000 + 8000 = +2000.',
        'The travel surplus more than covers the goods deficit — exactly the Croatian case, where tourism keeps the current account afloat.'
      ]
    },

    // --- Financing a current-account deficit (numeric, fixed) -----------------
    {
      id: 'b12-financing-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Financing a Current-Account Deficit',
      prompt: 'A country has a current-account deficit of 2000 (CA = −2000) and official reserves are unchanged. '
        + 'Because the balance of payments sums to zero, what financial-account balance is required, and what is the '
        + 'resulting balance of payments?',
      difficulty: 2,
      fields: [
        { key: 'fa', label: 'Required financial-account balance', answer: 2000, tol: 0, unit: '', hint: 'It must offset the current account: −(−2000)' },
        { key: 'bop', label: 'Balance of payments', answer: 0, tol: 0, unit: '', hint: 'CA + financial account (reserves unchanged)' }
      ],
      solution: [
        'BoP = 0 with reserves unchanged ⇒ financial account = −CA = −(−2000) = +2000 (a capital inflow).',
        'BoP = −2000 + 2000 = 0: the current-account deficit is financed by borrowing from / selling assets to the rest of the world.'
      ]
    },

    // --- RANDOMIZED: travel balance -------------------------------------------
    {
      id: 'b12-travel-balance-random',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Travel Balance — Drill',
      prompt: 'Compute the travel balance from tourist receipts and residents’ spending abroad.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { inc: 12000, exp: 4000 },
          { inc: 15000, exp: 6000 },
          { inc: 9000, exp: 2500 },
          { inc: 20000, exp: 7000 },
          { inc: 11000, exp: 3000 }
        ] }
      },
      generate(p) {
        const inc = p.pair.inc, exp = p.pair.exp;
        const tb = inc - exp;
        return {
          prompt: 'Foreign tourists spend ' + inc + ' in the country, while residents spend ' + exp + ' abroad. '
            + 'Compute the travel (tourism) balance.',
          fields: [
            { key: 'tb', label: 'Travel balance', answer: tb, tol: 0, unit: '', hint: inc + ' − ' + exp }
          ],
          solution: ['Travel balance = ' + inc + ' − ' + exp + ' = ' + tb + (tb >= 0 ? ' (surplus).' : ' (deficit).')]
        };
      },
      solution: ['Press “New numbers” for fresh figures. Travel balance = income from foreign tourists − spending of residents abroad.']
    },

    // --- RANDOMIZED: current account from components ---------------------------
    {
      id: 'b12-current-account-random',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Current Account — Drill',
      prompt: 'Add up the four components to get the current-account balance.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { g: -5000, s: 9000, pi: -800, si: 300 },
          { g: -6000, s: 11000, pi: -1000, si: 500 },
          { g: -4000, s: 7000, pi: -500, si: 200 },
          { g: -8000, s: 12000, pi: -1200, si: 400 },
          { g: -3000, s: 6000, pi: -600, si: 100 }
        ] }
      },
      generate(p) {
        const g = p.pair.g, s = p.pair.s, pi = p.pair.pi, si = p.pair.si;
        const ca = g + s + pi + si;
        const sgn = (x) => (x >= 0 ? '+' + x : '' + x);
        return {
          prompt: 'A country records: goods balance ' + g + ', services balance ' + sgn(s) + ', primary income '
            + pi + ', secondary income ' + sgn(si) + '. Compute the current-account balance.',
          fields: [
            { key: 'ca', label: 'Current account', answer: ca, tol: 0, unit: '', hint: g + ' + ' + s + ' + (' + pi + ') + ' + si }
          ],
          solution: ['CA = ' + g + ' + ' + s + ' + (' + pi + ') + ' + si + ' = ' + ca + (ca >= 0 ? ' (surplus).' : ' (deficit).')]
        };
      },
      solution: ['Press “New numbers” for fresh figures. Current account = goods + services + primary income + secondary income.']
    }
  ]
};

if (typeof window !== 'undefined') { window.macroeconomicsExercises = macroeconomicsExercises; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsExercises; }
