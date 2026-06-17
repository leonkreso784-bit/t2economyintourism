// ===== MACROECONOMICS — 1. KOLOKVIJ (K1) =====
// Source: course lectures (Blanchard-style) — Introduction + L2 National Accounts +
// L3 The Goods Market + L4 Financial Markets I + Ch5 The IS-LM Model.
// K1/K2 boundary AUTHORITATIVE from the official Test-1 preparation deck:
// Test 1 covers GDP determinants, the goods market (consumption/multiplier/equilibrium output),
// money market (money demand/supply, interest rate) and the IS-LM combined policies.
//
// ⚠ QUANTITATIVE SUBJECT — uses KaTeX (ADR-009). Convention (docs/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (in a JS string: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   A single `$` is NEVER used (currency). LaTeX backslash in a string = "\\".

const macroeconomicsM1 = {
  fundamentals: {
    name: 'Fundamentals & Objectives',
    icon: 'fa-globe',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What does macroeconomics study, and how does it differ from microeconomics?',
        answer: 'Macroeconomics studies the functioning of the economy as a WHOLE — overall national production, employment, prices and foreign trade ("macros" = big in Greek).\nMicroeconomics analyses individual prices, quantities and markets of a single supplier or consumer ("micros" = small).',
        explanation: 'In macro the two basic entities are aggregated: all households (consumers) and all businesses (the economy).'
      },
      {
        question: 'How do we obtain aggregate demand and aggregate supply?',
        answer: 'Aggregate demand is obtained by aggregating the demand of all households.\nAggregate supply is obtained by aggregating the supply of all companies.'
      },
      {
        question: 'What are the four fundamental macroeconomic objectives?',
        answer: '1. A high and growing level of production\n2. High employment (low unemployment)\n3. Price stability\n4. Internal and external (foreign-exchange) stability'
      },
      {
        question: 'What are the four main macroeconomic variables?',
        answer: '1. Gross Domestic Product (GDP) / aggregate output\n2. The unemployment rate\n3. The inflation rate\n4. The interest rate'
      },
      {
        question: 'What is economic policy, and what makes it expansive or restrictive?',
        answer: 'Economic policy is the set of government measures that steer GDP growth and the other macro objectives.\n• EXPANSIVE (expansionary) measures stimulate economic growth.\n• RESTRICTIVE measures reduce economic activity (cool the economy).'
      },
      {
        question: 'What are the main types of economic policy?',
        answer: '• Fiscal policy (taxation + public spending)\n• Monetary policy (control of the money supply / interest rate)\n• Policy of international economic relations (tariffs, quotas, exchange rate)\n• Income policy (wage and price control)'
      },
      {
        question: 'What does expansionary FISCAL policy do?',
        answer: 'It aims to increase GDP by: increasing public spending (G), reducing taxes (T), or increasing transfers (TR).\nRestrictive fiscal policy does the opposite — it limits personal and public spending.'
      },
      {
        question: 'What does expansionary MONETARY policy do?',
        answer: 'It aims to increase GDP by increasing the money supply and reducing interest rates, which stimulates investment and economic activity.\nRestrictive monetary policy restricts the money supply → higher interest rates, lower investment, lower GDP and lower inflation.'
      },
      {
        question: 'What primarily determines GDP in the short, medium and long run?',
        answer: '• SHORT run (a few years): annual changes in GDP are driven mainly by DEMAND.\n• MEDIUM run (~ten years): the level of production is determined by SUPPLY factors (capital, technology, size of the workforce).\n• LONG run (decades): innovation, savings, the quality of education and of public administration.',
        explanation: 'This is exactly why the short-run model (Goods/Financial markets, IS-LM) focuses on demand.'
      },
      {
        question: 'In the short run, what is the dominant cause of recessions?',
        answer: 'A fall in aggregate demand. The short-run model assumes firms supply whatever quantity is demanded at a given price, so output follows demand.'
      }
    ],

    quiz: [
      {
        question: 'Macroeconomics studies:',
        options: ['A single firm’s pricing', 'The economy as a whole', 'One consumer’s utility', 'A single market’s elasticity'],
        correct: 1
      },
      {
        question: 'Which is NOT one of the four fundamental macroeconomic objectives?',
        options: ['High and growing production', 'High employment', 'Maximising one firm’s profit', 'Price stability'],
        correct: 2
      },
      {
        question: 'Which is NOT one of the four main macroeconomic variables?',
        options: ['GDP', 'The unemployment rate', 'The marginal rate of substitution', 'The inflation rate'],
        correct: 2
      },
      {
        question: 'Reducing taxes and increasing government spending is:',
        options: ['Restrictive fiscal policy', 'Expansionary fiscal policy', 'Restrictive monetary policy', 'Income policy'],
        correct: 1
      },
      {
        question: 'Expansionary monetary policy involves:',
        options: ['Decreasing the money supply and raising rates', 'Increasing the money supply and lowering rates', 'Raising taxes', 'Imposing tariffs'],
        correct: 1
      },
      {
        question: 'In the SHORT run, annual changes in GDP are caused primarily by:',
        options: ['Demand factors', 'Supply factors', 'Technology', 'Capital accumulation'],
        correct: 0
      },
      {
        question: 'In the LONG run, the level of production is determined primarily by:',
        options: ['Monetary policy', 'Demand', 'Supply factors / innovation, savings, technology', 'Tariffs'],
        correct: 2
      },
      {
        question: 'Wage and price control is an instrument of:',
        options: ['Fiscal policy', 'Income policy', 'Monetary policy', 'Trade policy'],
        correct: 1
      },
      {
        question: 'Aggregate supply is obtained by aggregating:',
        options: ['The demand of all households', 'The supply of all companies', 'Government spending', 'Net exports'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'Macroeconomics studies the functioning of the economy as a _______.', answer: 'whole' },
      { sentence: 'Aggregating the demand of all households gives aggregate _______.', answer: 'demand' },
      { sentence: 'Measures that stimulate economic growth are called _______ measures.', answer: 'expansive' },
      { sentence: 'Fiscal policy works through taxation and public _______.', answer: 'spending' },
      { sentence: 'Monetary policy controls the money _______.', answer: 'supply' },
      { sentence: 'In the short run, changes in GDP are driven mainly by _______.', answer: 'demand' },
      { sentence: 'In the medium run, output is determined mainly by _______ factors.', answer: 'supply' },
      { sentence: 'Controlling wages and prices is an instrument of _______ policy.', answer: 'income' }
    ],

    learn: {
      content:
        '<h3>What macroeconomics is about</h3>' +
        '<p><strong>Macroeconomics</strong> studies the economy as a whole — total production, employment, the price level and foreign trade. Where microeconomics looks at a single market, macro <em>aggregates</em>: all households together form <strong>aggregate demand</strong>, all firms together form <strong>aggregate supply</strong>.</p>' +

        '<h4>The four objectives and the four variables</h4>' +
        '<p>Every economy pursues four <strong>objectives</strong>: high and growing production, high employment, price stability, and internal/external stability. We track progress through four <strong>variables</strong>:</p>' +
        '<ul>' +
        '<li><strong>GDP</strong> (aggregate output)</li>' +
        '<li>the <strong>unemployment rate</strong></li>' +
        '<li>the <strong>inflation rate</strong></li>' +
        '<li>the <strong>interest rate</strong></li>' +
        '</ul>' +

        '<h4>Economic policy</h4>' +
        '<p>Governments steer these variables with <strong>economic policy</strong>. Any policy can be <strong>expansive</strong> (stimulating activity) or <strong>restrictive</strong> (cooling it). The main types are:</p>' +
        '<ul>' +
        '<li><strong>Fiscal</strong> — taxes (T) and government spending (G)</li>' +
        '<li><strong>Monetary</strong> — the money supply and the interest rate</li>' +
        '<li><strong>International</strong> — tariffs, quotas, the exchange rate</li>' +
        '<li><strong>Income</strong> — wage and price control</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>The three horizons (why the short-run model is about demand)</h4>' +
        '<p>In the <strong>short run</strong>, GDP moves with <strong>demand</strong>. In the <strong>medium run</strong>, output is pinned down by <strong>supply</strong> (capital, technology, the workforce). In the <strong>long run</strong>, growth depends on innovation, savings and institutions. The Goods-market, Financial-market and IS-LM models in this midterm all describe the <em>short run</em>, so they focus on aggregate demand.</p>' +
        '</div>',
      image: null
    }
  },

  unemploymentInflation: {
    name: 'Unemployment & Inflation',
    icon: 'fa-arrow-trend-down',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'How is the labour force defined, and who is excluded?',
        answer: 'The labour force consists of the employed and the unemployed:\n\\( L = E + U \\)\nExcluded (NOT in the labour force): students, homemakers, retirees, those unable to work, and those who do not want to work.'
      },
      {
        question: 'How are the unemployment and employment rates calculated?',
        answer: 'Unemployment rate \\( = \\dfrac{U}{L} \\) (the unemployed as a share of the labour force).\nEmployment rate \\( = \\dfrac{E}{L} \\) (the employed as a share of the labour force).'
      },
      {
        question: 'What is the economic cost of unemployment?',
        answer: 'Behind every unemployed worker there is a LOSS — the economy produces less than it could. The cost is the difference between the potential output (at full employment) and the actual output. The higher unemployment, the further actual output falls below potential.'
      },
      {
        question: 'What is inflation, deflation, and the inflation rate?',
        answer: 'Inflation is a permanent increase in the general price level; the inflation rate is the rate at which prices rise.\nDeflation is a permanent decrease in the price level (a negative inflation rate) — rare (e.g. Japan in the late 1990s).',
        explanation: 'The general price level is tracked by the Consumer Price Index (CPI).'
      },
      {
        question: 'What is the CPI?',
        answer: 'The Consumer Price Index measures the average price (cost of living) of a FIXED basket of goods bought by typical consumers. In the base period CPI = 100, and we read its movement relative to 100.'
      },
      {
        question: 'What is considered the optimal inflation rate?',
        answer: 'Low and stable inflation, around 1–4% per year (often targeted near 2%). Both very high inflation and deflation create uncertainty and harm the economy.'
      },
      {
        question: 'How are the real and nominal interest rates related?',
        answer: 'The nominal interest rate is the rate at which the nominal value of a deposit grows; the real interest rate is the rate at which its purchasing power grows. Approximately:\n\\( \\text{real rate} \\approx \\text{nominal rate} - \\text{inflation rate} \\)',
        explanation: 'Example: nominal 8%, inflation 3% → real ≈ 5%.'
      },
      {
        question: 'What is Okun’s law?',
        answer: 'Okun’s law links output and unemployment: output growth ABOVE trend is associated with FALLING unemployment, and growth BELOW trend with RISING unemployment. (A roughly 2% shortfall of output relative to potential raises unemployment by about 1%.)'
      },
      {
        question: 'What does the Phillips curve tell us?',
        answer: 'The Phillips curve describes an INVERSE relationship between unemployment and inflation: a low unemployment rate tends to raise the inflation rate, and a high unemployment rate tends to lower it. A country trades off lower unemployment against higher inflation.'
      },
      {
        question: 'Why do economists worry about inflation if all prices and wages rose together?',
        answer: 'If inflation were "pure" (all prices and wages rising at the same rate) it would not be a problem. In reality the changes are NOT proportional — goods prices often rise faster than wages, relative prices distort, uncertainty rises, and nominal-income tax brackets push up real tax burdens.'
      }
    ],

    quiz: [
      {
        question: 'The labour force is:',
        options: ['Only the employed', 'The employed plus the unemployed (L = E + U)', 'Everyone of working age', 'The employed plus retirees'],
        correct: 1
      },
      {
        question: 'Which group is NOT counted in the labour force?',
        options: ['The unemployed actively seeking work', 'Full-time students not seeking work', 'Part-time employees', 'Self-employed workers'],
        correct: 1
      },
      {
        question: 'The unemployment rate equals:',
        options: ['U / E', 'E / L', 'U / L', 'L / U'],
        correct: 2
      },
      {
        question: 'A permanent decrease in the general price level is called:',
        options: ['Disinflation', 'Deflation', 'Stagflation', 'Recession'],
        correct: 1
      },
      {
        question: 'The CPI measures the price of:',
        options: ['A single good', 'A fixed basket of consumer goods', 'All capital goods', 'Exports only'],
        correct: 1
      },
      {
        question: 'If the nominal interest rate is 8% and inflation is 3%, the real interest rate is about:',
        options: ['11%', '5%', '3%', '24%'],
        correct: 1
      },
      {
        question: 'Okun’s law links:',
        options: ['Inflation and the money supply', 'Output growth and unemployment', 'Taxes and spending', 'Exports and the exchange rate'],
        correct: 1
      },
      {
        question: 'The Phillips curve describes the relationship between unemployment and:',
        options: ['GDP', 'Inflation', 'The exchange rate', 'Investment'],
        correct: 1
      },
      {
        question: 'A low unemployment rate tends to be associated with:',
        options: ['Lower inflation', 'Higher inflation', 'No change in inflation', 'Deflation'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The labour force equals the employed plus the _______.', answer: 'unemployed' },
      { sentence: 'The unemployment rate is the ratio U over _______.', answer: 'L' },
      { sentence: 'A permanent fall in the general price level is called _______.', answer: 'deflation' },
      { sentence: 'The general price level is measured by the Consumer Price _______.', answer: 'index' },
      { sentence: 'The optimal inflation rate is considered low and stable, around 1–4 _______.', answer: 'percent' },
      { sentence: 'The real interest rate ≈ nominal rate minus the _______ rate.', answer: 'inflation' },
      { sentence: 'Okun’s law links output growth with the _______ rate.', answer: 'unemployment' },
      { sentence: 'The Phillips curve shows an _______ relationship between unemployment and inflation.', answer: 'inverse' }
    ],

    learn: {
      content:
        '<h3>Two costs the economy watches: idle workers and rising prices</h3>' +
        '<h4>Unemployment</h4>' +
        '<p>The <strong>labour force</strong> is everyone working or actively looking for work:</p>' +
        '<div class="formula-box">\\[ L = E + U \\]</div>' +
        '<p>Students, homemakers, retirees and those who do not want to work are <em>outside</em> the labour force. The headline rate is</p>' +
        '<div class="formula-box">\\[ \\text{unemployment rate} = \\frac{U}{L} \\]</div>' +
        '<p>Every unemployed worker is lost output: the <strong>economic cost of unemployment</strong> is the gap between potential output (full employment) and actual output.</p>' +

        '<h4>Inflation</h4>' +
        '<p><strong>Inflation</strong> is a permanent rise in the general price level; <strong>deflation</strong> is a permanent fall. The price level is tracked by the <strong>CPI</strong> (a fixed basket; base = 100). Economists consider <strong>1–4%</strong> (≈2%) optimal — both runaway inflation and deflation breed uncertainty.</p>' +
        '<div class="example-box">' +
        '<h4>Worked example — real interest rate</h4>' +
        '<p>If the nominal interest rate is 8% and prices rise by 3%, the real (purchasing-power) return is</p>' +
        '<div class="formula-box">\\[ r \\approx i - \\pi = 8\\% - 3\\% = 5\\% \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Two empirical laws</h4>' +
        '<p><strong>Okun’s law:</strong> output growth above trend lowers unemployment; below trend raises it. <strong>Phillips curve:</strong> unemployment and inflation move <em>inversely</em> — push unemployment down and inflation tends to rise. A country must choose its preferred trade-off.</p>' +
        '</div>',
      image: null
    }
  },

  gdpMeasurement: {
    name: 'GDP: Nominal, Real & Growth',
    icon: 'fa-chart-area',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is GDP?',
        answer: 'Gross Domestic Product is the market value of all FINAL products and services produced in a country during one year — the most comprehensive measure of a country’s total economic production.'
      },
      {
        question: 'How does GDP differ from GNP?',
        answer: 'GDP is GEOGRAPHIC: all output produced WITHIN a country’s borders, regardless of ownership (e.g. a foreign-owned bank in Croatia counts in Croatian GDP).\nGNP is by OWNERSHIP: output produced by a country’s factors of production, wherever they are located.'
      },
      {
        question: 'Nominal vs. real vs. potential GDP — what is each?',
        answer: '• NOMINAL GDP — at current market prices (changes with both quantity and prices).\n• REAL GDP — at constant prices (changes only with the volume of production); the true measure of economic activity.\n• POTENTIAL GDP — the maximum output the economy can produce at stable prices (high employment).'
      },
      {
        question: 'How is real GDP calculated from nominal GDP?',
        answer: 'Using the GDP deflator (or a price index):\n\\( \\text{Nominal GDP} = \\text{Real GDP}\\times \\text{deflator} \\)\n\\( \\Rightarrow \\text{Real GDP} = \\dfrac{\\text{Nominal GDP}}{\\text{deflator}} \\)\nWith a base-100 index: \\( \\text{Real GDP}_n = \\text{Nominal GDP}_n \\times \\dfrac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_n} \\).'
      },
      {
        question: 'How do prices affect the relationship between real and nominal GDP?',
        answer: '• Prices RISE → real GDP is LESS than nominal GDP.\n• Prices FALL → real GDP is GREATER than nominal GDP.\n• Prices UNCHANGED → real GDP equals nominal GDP.'
      },
      {
        question: 'What is the GDP gap, and its two types?',
        answer: 'The GDP gap is the difference between potential and actual (real) GDP.\n• RECESSIONAL gap — the economy produces LESS than its capacity (idle resources); the goal is to raise GDP. (Most common.)\n• INFLATIONARY gap — the economy produces MORE than capacity; the goal is to cool GDP. (Rare, only in the most developed economies.)'
      },
      {
        question: 'How is the GDP growth rate calculated?',
        answer: 'It compares output across years:\n\\( \\text{growth rate} = \\dfrac{Y_t - Y_{t-1}}{Y_{t-1}}\\times 100 \\)\nPositive growth = expansion; negative growth = recession.'
      },
      {
        question: 'What is the technical definition of a recession?',
        answer: 'A recession occurs when the economy records negative growth rates in at least two consecutive quarters. (Economists watch quarterly, not just annual, data.)'
      },
      {
        question: 'Why is GDP per capita important?',
        answer: 'GDP per capita = real GDP / number of inhabitants. It indicates the average standard of living — the higher it is, the higher the population’s living standard, and it allows fairer comparison across countries.'
      }
    ],

    quiz: [
      {
        question: 'GDP measures the market value of all _______ produced in a country in a year.',
        options: ['Intermediate goods', 'Final products and services', 'Exports only', 'Capital goods only'],
        correct: 1
      },
      {
        question: 'A foreign-owned bank operating in Croatia is counted in:',
        options: ['Croatia’s GNP only', 'Croatia’s GDP', 'No country’s output', 'The bank’s home-country GDP'],
        correct: 1
      },
      {
        question: 'Real GDP is measured at:',
        options: ['Current prices', 'Constant prices', 'Future prices', 'Black-market prices'],
        correct: 1
      },
      {
        question: 'If prices rise during the year, real GDP will be:',
        options: ['Greater than nominal GDP', 'Less than nominal GDP', 'Equal to nominal GDP', 'Zero'],
        correct: 1
      },
      {
        question: 'Nominal GDP is 325 and the price index is 130 (base = 100). Real GDP is:',
        options: ['422.5', '250', '195', '130'],
        correct: 1
      },
      {
        question: 'An economy producing LESS than its capacity has a:',
        options: ['Inflationary gap', 'Recessional gap', 'Trade surplus', 'Budget surplus'],
        correct: 1
      },
      {
        question: 'A recession is defined as negative growth for at least:',
        options: ['One month', 'Two consecutive quarters', 'One year', 'Five years'],
        correct: 1
      },
      {
        question: 'The best indicator of the average standard of living is:',
        options: ['Nominal GDP', 'GDP per capita', 'The inflation rate', 'Total exports'],
        correct: 1
      },
      {
        question: 'Potential GDP is:',
        options: ['Output at current prices', 'The maximum output at stable prices (high employment)', 'Output minus imports', 'Last year’s GDP'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'GDP is the market value of all _______ goods and services produced in a year.', answer: 'final' },
      { sentence: 'GDP is geographic; GNP is based on _______.', answer: 'ownership' },
      { sentence: 'Real GDP is measured at _______ prices.', answer: 'constant' },
      { sentence: 'Real GDP equals nominal GDP divided by the _______.', answer: 'deflator' },
      { sentence: 'When prices rise, real GDP is _______ than nominal GDP.', answer: 'less' },
      { sentence: 'An economy producing less than capacity has a _______ gap.', answer: 'recessional' },
      { sentence: 'A recession is negative growth for at least two consecutive _______.', answer: 'quarters' },
      { sentence: 'The average standard of living is best shown by GDP per _______.', answer: 'capita' }
    ],

    learn: {
      content:
        '<h3>Measuring output — and stripping out prices</h3>' +
        '<p><strong>GDP</strong> is the market value of all <em>final</em> goods and services produced inside a country in a year. It is <strong>geographic</strong> (everything produced within the borders, regardless of who owns the firm) — unlike GNP, which follows <strong>ownership</strong>.</p>' +

        '<h4>Nominal, real, potential</h4>' +
        '<ul>' +
        '<li><strong>Nominal GDP</strong> — current prices (moves with quantity <em>and</em> prices).</li>' +
        '<li><strong>Real GDP</strong> — constant prices (moves only with quantity); the honest measure of activity.</li>' +
        '<li><strong>Potential GDP</strong> — the most the economy can produce at stable prices.</li>' +
        '</ul>' +
        '<p>Convert with the deflator (or a base-100 index):</p>' +
        '<div class="formula-box">\\[ \\text{Real GDP}_n = \\text{Nominal GDP}_n \\times \\frac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_n} \\]</div>' +
        '<div class="example-box">' +
        '<h4>Worked example — deflating nominal GDP</h4>' +
        '<p>Nominal GDP in 1990 is 325 (billion), the price index is 130 (base year = 100):</p>' +
        '<div class="formula-box">\\[ \\text{Real GDP} = 325 \\times \\frac{100}{130} = 250 \\]</div>' +
        '<p>So although nominal output rose, in <em>real</em> terms it is only 250.</p>' +
        '</div>' +

        '<h4>Growth and the GDP gap</h4>' +
        '<div class="formula-box">\\[ \\text{growth rate} = \\frac{Y_t - Y_{t-1}}{Y_{t-1}}\\times 100 \\]</div>' +
        '<p>Positive growth = <strong>expansion</strong>; negative growth in two consecutive quarters = <strong>recession</strong>. The <strong>GDP gap</strong> is potential minus actual output: a <strong>recessional gap</strong> (idle resources) is common, an <strong>inflationary gap</strong> (over-capacity) is rare.</p>' +
        '<div class="tip-box"><h4>Watch the price effect</h4><p>If prices rose, real GDP &lt; nominal GDP; if they fell, real GDP &gt; nominal GDP; if unchanged, the two are equal. And to compare living standards across countries, always use <strong>real GDP per capita</strong>.</p></div>',
      image: null
    }
  },

  nationalAccounts: {
    name: 'National Accounts',
    icon: 'fa-scale-balanced',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'What is the fundamental national-accounting identity?',
        answer: 'Total production = Total consumption = Total income.\nEconomic activity can be measured three equivalent ways, all giving the SAME value.'
      },
      {
        question: 'What are the three approaches to measuring GDP?',
        answer: '1. PRODUCTION approach — the value of final output (excluding intermediate stages).\n2. EXPENDITURE (consumption) approach — total spending by final buyers.\n3. INCOME approach — total income received.\nAll three give the same GDP.'
      },
      {
        question: 'What is the expenditure (consumption) formula for GDP?',
        answer: '\\( \\text{GDP} = C + I + G + (E - U) \\)\nwhere C = personal consumption, I = investment, G = government spending, E = exports, U = imports. Net exports \\( NX = E - U \\).'
      },
      {
        question: 'What are the four economic models of GDP?',
        answer: '• One-sector: \\( Y = C \\)\n• Two-sector: \\( Y = C + I \\)\n• Three-sector: \\( Y = C + I + G \\)\n• Four-sector: \\( Y = C + I + G + (E - U) \\)'
      },
      {
        question: 'What is the saving–investment identity in the four-sector model?',
        answer: '\\( S - I = (G + TR - T) + NX \\)\nwhere NX = E − U.\n(In the simple two-sector model this collapses to \\( S = I \\).)',
        explanation: 'Private saving minus investment equals the budget deficit plus net exports.'
      },
      {
        question: 'What is value added?',
        answer: 'Value added = gross value of production − intermediate consumption. Summing value added across all activities (the NACE structure) avoids double-counting and yields GDP by the production approach.'
      },
      {
        question: 'What is intermediate consumption?',
        answer: 'The value of products and services that are transformed, used up or consumed within the production process — they are NOT counted directly in GDP (only the final output is).'
      },
      {
        question: 'How is tourism treated in the national classification of activities (NACE)?',
        answer: 'Tourism is NOT a separate activity or sector in any classification. An activity is defined by the producer / the product, so tourism is monitored across several activities rather than as one — this is why a satellite account is needed (covered later).'
      },
      {
        question: 'What are the macroeconomic aggregate symbols?',
        answer: 'Y = GDP, C = personal consumption, I = investment, S = savings, G = government (fiscal) spending, E = exports, U = imports, T = taxes, TR = transfers.'
      }
    ],

    quiz: [
      {
        question: 'The three approaches to GDP (production, expenditure, income) give:',
        options: ['Three different values', 'The same value', 'Values that differ by taxes', 'Only an approximation'],
        correct: 1
      },
      {
        question: 'The expenditure formula for GDP is:',
        options: ['Y = C − I − G', 'Y = C + I + G + (E − U)', 'Y = C × I × G', 'Y = S + T'],
        correct: 1
      },
      {
        question: 'Net exports (NX) equal:',
        options: ['Imports − exports', 'Exports − imports', 'Exports + imports', 'Government spending − taxes'],
        correct: 1
      },
      {
        question: 'The three-sector model of GDP is:',
        options: ['Y = C', 'Y = C + I', 'Y = C + I + G', 'Y = C + I + G + NX'],
        correct: 2
      },
      {
        question: 'Value added equals gross value of production minus:',
        options: ['Taxes', 'Intermediate consumption', 'Net exports', 'Depreciation'],
        correct: 1
      },
      {
        question: 'In national accounting, total production equals total income and total:',
        options: ['Exports', 'Consumption', 'Taxes', 'Savings'],
        correct: 1
      },
      {
        question: 'In the national classification of activities, tourism is:',
        options: ['A single sector', 'A separate activity', 'Not a separate activity/sector', 'A primary sector'],
        correct: 2
      },
      {
        question: 'Intermediate consumption is:',
        options: ['Counted directly in GDP', 'Used up within the production process and not counted directly', 'A type of final good', 'Equal to net exports'],
        correct: 1
      },
      {
        question: 'In the symbols, G stands for:',
        options: ['Gross saving', 'Government (fiscal) spending', 'GDP growth', 'Goods imported'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'Total production equals total income equals total _______.', answer: 'consumption' },
      { sentence: 'GDP = C + I + G + (E − _______).', answer: 'U' },
      { sentence: 'Net exports equal exports minus _______.', answer: 'imports' },
      { sentence: 'The three-sector model is Y = C + I + _______.', answer: 'G' },
      { sentence: 'Value added equals gross production minus _______ consumption.', answer: 'intermediate' },
      { sentence: 'In the four-sector model, S − I = (G + TR − T) + _______.', answer: 'NX' },
      { sentence: 'Tourism is _______ a separate activity in the NACE classification.', answer: 'not' },
      { sentence: 'In the macro symbols, the letter T stands for _______.', answer: 'taxes' }
    ],

    learn: {
      content:
        '<h3>Three ways to count the same thing</h3>' +
        '<p>National accounts rest on one identity:</p>' +
        '<div class="formula-box">\\[ \\text{Total production} = \\text{Total consumption} = \\text{Total income} \\]</div>' +
        '<p>So GDP can be measured three equivalent ways — the <strong>production</strong> approach (value of final output), the <strong>expenditure</strong> approach (who spends on it), and the <strong>income</strong> approach (who earns it). All give the same number.</p>' +

        '<h4>The expenditure approach and the GDP models</h4>' +
        '<p>The most-used identity for macro modelling is the expenditure form, built up sector by sector:</p>' +
        '<div class="formula-box">\\[ Y = C \\;\\to\\; Y = C + I \\;\\to\\; Y = C + I + G \\;\\to\\; Y = C + I + G + (E - U) \\]</div>' +
        '<p>with net exports \\( NX = E - U \\). The four-sector model gives the <strong>saving–investment identity</strong>:</p>' +
        '<div class="formula-box">\\[ S - I = (G + TR - T) + NX \\]</div>' +

        '<h4>Production approach: value added</h4>' +
        '<p>To avoid double-counting, the production approach sums <strong>value added</strong> across activities:</p>' +
        '<div class="formula-box">\\[ \\text{Value added} = \\text{gross value of production} - \\text{intermediate consumption} \\]</div>' +

        '<div class="warning-box">' +
        '<h4>Tourism is not an "activity"</h4>' +
        '<p>In the NACE classification an activity is defined by the producer/product, so <strong>tourism is not a separate activity or sector</strong>. It spans many activities (accommodation, transport, food service…), which is exactly why a tourism <em>satellite account</em> is needed to measure it.</p>' +
        '</div>',
      image: null
    }
  },

  goodsMarket: {
    name: 'The Goods Market',
    icon: 'fa-cart-shopping',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is the consumption function?',
        answer: '\\( C = c_0 + c_1 Y_D \\)\n• \\( c_0 \\) = autonomous consumption (consumption when disposable income is zero)\n• \\( c_1 \\) = the marginal propensity to consume (MPC), with \\( 0 < c_1 < 1 \\)\n• \\( Y_D \\) = disposable income',
        explanation: 'Example: C = 1000 + 0.6·YD.'
      },
      {
        question: 'What is the marginal propensity to consume?',
        answer: 'The fraction of an extra unit of disposable income that is consumed, \\( c_1 \\). Since \\( 0 < c_1 < 1 \\), consumption rises with income but less than one-for-one (the rest is saved).'
      },
      {
        question: 'What is disposable income?',
        answer: 'Income left to households after taxes and transfers:\n\\( Y_D = Y - T \\)\nSubstituting into the consumption function: \\( C = c_0 + c_1 (Y - T) \\).'
      },
      {
        question: 'What is the equilibrium condition in the goods market?',
        answer: 'Production equals demand:\n\\( Y = Z \\), where \\( Z = C + I + G \\) (closed economy, X = IM = 0).\nBecause firms supply whatever is demanded, demand determines output.'
      },
      {
        question: 'What is the equilibrium-output formula?',
        answer: 'Solving \\( Y = c_0 + c_1(Y - T) + I + G \\):\n\\( Y = \\dfrac{1}{1 - c_1}\\,[\\,c_0 + I + G - c_1 T\\,] \\)\nThe bracket is autonomous spending; the front factor is the multiplier.'
      },
      {
        question: 'What is the multiplier?',
        answer: '\\( \\text{multiplier} = \\dfrac{1}{1 - c_1} \\)\nSince \\( 0 < c_1 < 1 \\), the multiplier is greater than 1: a one-unit rise in autonomous spending raises output by more than one unit. A higher MPC (or a lower MPС to save) makes the multiplier larger.'
      },
      {
        question: 'Why is the effect of autonomous spending greater than one-to-one?',
        answer: 'A rise in spending raises output and income; the extra income raises consumption by \\( c_1 \\); that raises output again, and so on. The geometric series \\( 1 + c_1 + c_1^2 + \\cdots = \\dfrac{1}{1-c_1} \\).'
      },
      {
        question: 'Which variables are endogenous vs. exogenous in the goods-market model?',
        answer: 'Endogenous (determined inside the model): output Y, consumption C, disposable income.\nExogenous / policy instruments: government spending G, taxes T (political decisions); investment I is taken as given (simplification).'
      },
      {
        question: 'What is autonomous spending?',
        answer: 'The part of demand that does NOT depend on current income: \\( c_0 + I + G - c_1 T \\). It is the constant term the multiplier acts on.'
      }
    ],

    quiz: [
      {
        question: 'In C = c₀ + c₁·YD, the term c₁ is the:',
        options: ['Autonomous consumption', 'Marginal propensity to consume', 'Tax rate', 'Interest rate'],
        correct: 1
      },
      {
        question: 'Disposable income is:',
        options: ['Y + T', 'Y − T', 'Y × T', 'C − T'],
        correct: 1
      },
      {
        question: 'Goods-market equilibrium requires:',
        options: ['Saving = 0', 'Production Y = demand Z', 'C = I', 'G = T'],
        correct: 1
      },
      {
        question: 'If c₁ = 0.75, the multiplier 1/(1−c₁) equals:',
        options: ['0.75', '1.33', '4', '5'],
        correct: 2
      },
      {
        question: 'With C = 250 + 0.75·YD, an increase in G of 100 raises equilibrium output by:',
        options: ['100', '250', '400', '1000'],
        correct: 2
      },
      {
        question: 'The multiplier is greater than 1 because:',
        options: ['Taxes are zero', '0 < c₁ < 1, so 1/(1−c₁) > 1', 'Investment is endogenous', 'Prices are flexible'],
        correct: 1
      },
      {
        question: 'An increase in the marginal propensity to consume makes the multiplier:',
        options: ['Smaller', 'Larger', 'Unchanged', 'Negative'],
        correct: 1
      },
      {
        question: 'In the simple goods-market model, which is a policy instrument (exogenous)?',
        options: ['Output Y', 'Consumption C', 'Government spending G', 'Disposable income'],
        correct: 2
      },
      {
        question: 'When disposable income is zero, consumption equals:',
        options: ['Zero', 'c₀ (autonomous consumption)', 'c₁', 'G'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'In the consumption function, c₀ is _______ consumption.', answer: 'autonomous' },
      { sentence: 'The marginal propensity to consume is denoted c_______.', answer: '1' },
      { sentence: 'Disposable income equals income Y minus _______.', answer: 'taxes' },
      { sentence: 'Goods-market equilibrium requires production Y to equal _______.', answer: 'demand' },
      { sentence: 'The multiplier equals 1 divided by (1 minus _______).', answer: 'c1' },
      { sentence: 'If c₁ = 0.75 the multiplier equals _______.', answer: '4' },
      { sentence: 'A higher marginal propensity to consume makes the multiplier _______.', answer: 'larger' },
      { sentence: 'Government spending G and taxes T are _______ variables (policy instruments).', answer: 'exogenous' }
    ],

    learn: {
      content:
        '<h3>What determines output in the short run? Demand.</h3>' +
        '<p>The short-run model assumes firms supply whatever is demanded at the going price, so <strong>demand determines output</strong>. Start with consumption, the largest component of demand:</p>' +
        '<div class="formula-box">\\[ C = c_0 + c_1 Y_D, \\qquad Y_D = Y - T \\]</div>' +
        '<p>Here \\( c_0 \\) is <strong>autonomous consumption</strong> and \\( c_1 \\) is the <strong>marginal propensity to consume</strong> (MPC), with \\( 0 < c_1 < 1 \\): consumption rises with income, but less than one-for-one.</p>' +

        '<h4>Equilibrium</h4>' +
        '<p>In a closed economy (\\(X = IM = 0\\)) demand is \\( Z = C + I + G \\). Equilibrium is \\( Y = Z \\):</p>' +
        '<div class="formula-box">\\[ Y = c_0 + c_1(Y - T) + I + G \\]</div>' +
        '<p>Solving for Y:</p>' +
        '<div class="formula-box">\\[ Y = \\underbrace{\\frac{1}{1 - c_1}}_{\\text{multiplier}}\\; \\underbrace{\\big[\\,c_0 + I + G - c_1 T\\,\\big]}_{\\text{autonomous spending}} \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — the multiplier</h4>' +
        '<p>Let \\( C = 250 + 0.75\\,Y_D \\). The multiplier is</p>' +
        '<div class="formula-box">\\[ \\frac{1}{1 - 0.75} = \\frac{1}{0.25} = 4 \\]</div>' +
        '<p>So a rise in government spending of \\( \\Delta G = 100 \\) raises output by</p>' +
        '<div class="formula-box">\\[ \\Delta Y = 4 \\times 100 = 400 \\]</div>' +
        '</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — equilibrium output</h4>' +
        '<p>Given \\( C = 500 + 0.5\\,Y_D,\\; T = 600,\\; I = 300,\\; G = 2000 \\):</p>' +
        '<div class="formula-box">\\[ Y = \\frac{1}{1-0.5}\\,[\\,500 + 300 + 2000 - 0.5(600)\\,] = 2 \\times 2500 = 5000 \\]</div>' +
        '</div>' +

        '<div class="tip-box"><h4>Why bigger than one-to-one?</h4><p>Extra spending → extra income → extra consumption \\(c_1\\) → extra income… The chain \\(1 + c_1 + c_1^2 + \\cdots = \\dfrac{1}{1-c_1}\\). A higher MPC makes the multiplier <strong>larger</strong>.</p></div>',
      image: null
    }
  },

  financialMarkets: {
    name: 'Financial Markets & Money',
    icon: 'fa-money-bill-trend-up',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'What is money in this model?',
        answer: 'Money = currency (cash) + checkable deposits — the financial asset that can be used directly to buy goods. The alternative is bonds, which pay interest but cannot be spent directly.'
      },
      {
        question: 'What determines the demand for money?',
        answer: 'The demand for money \\( M^d = \\$Y \\cdot L(i) \\) depends on:\n• the level of transactions, proportional to nominal income \\( \\$Y \\) (more income → more money demanded)\n• the interest rate \\( i \\) (higher i → less money demanded, because bonds become more attractive).'
      },
      {
        question: 'Why does the money-demand curve slope downward in i?',
        answer: 'The interest rate is the opportunity cost of holding money (instead of interest-bearing bonds). The higher the interest rate, the less money people want to hold. An increase in income shifts the whole curve to the right.'
      },
      {
        question: 'What is the money supply, and how is the interest rate determined?',
        answer: 'The money supply \\( M^s = M \\) is set by the central bank and is independent of the interest rate (a vertical line). Equilibrium is where supply meets demand:\n\\( M^s = M^d \\;\\Rightarrow\\; M = \\$Y\\,L(i) \\) — this pins down the equilibrium interest rate.'
      },
      {
        question: 'How are bond prices and the interest rate related?',
        answer: 'Inversely. For a one-year bond of nominal value 100 bought at price \\( P_B \\):\n\\( i = \\dfrac{100 - P_B}{P_B} \\)\nThe higher the bond’s price, the lower its yield (interest rate).'
      },
      {
        question: 'What are open-market operations?',
        answer: 'The central bank changes the money supply by trading (short-term government) bonds:\n• Buys bonds → raises bond demand → bond prices up → interest rate DOWN → money supply UP (expansionary).\n• Sells bonds → bond prices down → interest rate UP → money supply DOWN (contractionary).'
      },
      {
        question: 'What does expansionary vs. contractionary monetary policy do to i?',
        answer: '• Expansionary: CB increases M (buys bonds) → interest rate falls.\n• Contractionary: CB decreases M (sells bonds) → interest rate rises.'
      },
      {
        question: 'What happens to the equilibrium interest rate when income rises?',
        answer: 'A rise in income increases money demand (shifts M^d right). With money supply fixed, the equilibrium interest rate RISES. (This relationship becomes the upward-sloping LM curve.)'
      }
    ],

    quiz: [
      {
        question: 'Money in this model is defined as:',
        options: ['Bonds only', 'Currency + checkable deposits', 'All financial wealth', 'Stocks and shares'],
        correct: 1
      },
      {
        question: 'The demand for money increases when:',
        options: ['The interest rate rises', 'Income rises', 'Bond prices fall', 'Taxes rise'],
        correct: 1
      },
      {
        question: 'The money-demand curve slopes downward because a higher interest rate:',
        options: ['Raises income', 'Raises the opportunity cost of holding money', 'Lowers bond prices forever', 'Raises the money supply'],
        correct: 1
      },
      {
        question: 'The money supply curve is:',
        options: ['Upward-sloping', 'Vertical (set by the central bank)', 'Downward-sloping', 'Horizontal'],
        correct: 1
      },
      {
        question: 'When the central bank BUYS bonds, the interest rate:',
        options: ['Rises', 'Falls', 'Is unchanged', 'Becomes negative'],
        correct: 1
      },
      {
        question: 'The relationship between bond prices and the interest rate is:',
        options: ['Direct (positive)', 'Inverse (negative)', 'There is none', 'Always one-to-one'],
        correct: 1
      },
      {
        question: 'With money demand M = Y(0.4 − i), Y = 150 and money supply = 50, the equilibrium interest rate is about:',
        options: ['6.7%', '40%', '33%', '0.4%'],
        correct: 0
      },
      {
        question: 'Contractionary monetary policy means the central bank:',
        options: ['Buys bonds and lowers i', 'Sells bonds and raises i', 'Buys bonds and raises i', 'Cuts taxes'],
        correct: 1
      },
      {
        question: 'An increase in income (with fixed money supply) makes the equilibrium interest rate:',
        options: ['Fall', 'Rise', 'Stay the same', 'Become zero'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'Money equals currency plus checkable _______.', answer: 'deposits' },
      { sentence: 'The demand for money rises with the level of _______.', answer: 'income' },
      { sentence: 'The money-demand curve slopes downward in the _______ rate.', answer: 'interest' },
      { sentence: 'The money supply is set by the _______ bank.', answer: 'central' },
      { sentence: 'When the central bank buys bonds, the interest rate _______.', answer: 'falls' },
      { sentence: 'Bond prices and the interest rate are related _______.', answer: 'inversely' },
      { sentence: 'Selling bonds is _______ monetary policy.', answer: 'contractionary' },
      { sentence: 'Equilibrium in the money market is where money supply equals money _______.', answer: 'demand' }
    ],

    learn: {
      content:
        '<h3>Where the interest rate comes from</h3>' +
        '<p>People hold wealth either as <strong>money</strong> (currency + checkable deposits — spendable, but no interest) or as <strong>bonds</strong> (interest, but not directly spendable). The choice gives the <strong>demand for money</strong>:</p>' +
        '<div class="formula-box">\\[ M^d = \\$Y \\cdot L(i) \\]</div>' +
        '<p>It rises with the level of transactions (proportional to nominal income \\( \\$Y \\)) and falls with the interest rate \\( i \\) — the opportunity cost of holding money. So the \\(M^d\\) curve slopes <strong>down</strong>; more income shifts it <strong>right</strong>.</p>' +

        '<h4>Equilibrium interest rate</h4>' +
        '<p>The <strong>money supply</strong> \\( M^s = M \\) is set by the central bank (a vertical line). The interest rate adjusts so that supply meets demand:</p>' +
        '<div class="formula-box">\\[ M^s = M^d \\quad\\Longrightarrow\\quad M = \\$Y\\,L(i) \\]</div>' +
        '<div class="example-box">' +
        '<h4>Worked example — equilibrium interest rate</h4>' +
        '<p>Let money demand be \\( M^d = Y(0.4 - i) \\) with income \\( Y = 150 \\) and money supply \\( M^s = 50 \\):</p>' +
        '<div class="formula-box">\\[ 50 = 150\\,(0.4 - i) \\;\\Rightarrow\\; 0.4 - i = \\tfrac{1}{3} \\;\\Rightarrow\\; i \\approx 0.067 = 6.7\\% \\]</div>' +
        '</div>' +

        '<h4>How the central bank moves i: open-market operations</h4>' +
        '<p>The CB changes \\(M\\) by trading bonds. Bond prices and yields move inversely — for a 100-value one-year bond bought at \\(P_B\\):</p>' +
        '<div class="formula-box">\\[ i = \\frac{100 - P_B}{P_B} \\]</div>' +
        '<div class="tip-box"><h4>The policy levers</h4><p><strong>Expansionary:</strong> CB <em>buys</em> bonds → prices up → \\(i\\) down → \\(M^s\\) up. <strong>Contractionary:</strong> CB <em>sells</em> bonds → prices down → \\(i\\) up → \\(M^s\\) down. And a rise in income pushes the equilibrium \\(i\\) up — the seed of the LM curve.</p></div>',
      image: null
    }
  },

  isLmModel: {
    name: 'The IS-LM Model',
    icon: 'fa-arrows-to-dot',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is the IS-LM model?',
        answer: 'A single framework that puts the GOODS market (the IS relation) and the FINANCIAL/money market (the LM relation) on one graph (output Y on the horizontal axis, interest rate i on the vertical), to find the short-run equilibrium and analyse economic policy.'
      },
      {
        question: 'What is the IS curve?',
        answer: 'The IS curve represents goods-market equilibrium when investment depends on the interest rate:\n\\( Y = C(Y - T) + I(Y, i) + G \\)\nIt is DOWNWARD sloping: a higher interest rate reduces investment, hence demand and output.'
      },
      {
        question: 'What shifts the IS curve?',
        answer: 'A change in anything (other than i) that affects demand:\n• Increase in G, C, or I, or a DECREASE in T → IS shifts RIGHT.\n• Decrease in G, C, or I, or an INCREASE in T → IS shifts LEFT.'
      },
      {
        question: 'What is the LM curve?',
        answer: 'The LM curve represents financial-market (money-market) equilibrium:\n\\( \\dfrac{M}{P} = Y\\,L(i) \\)\nIt is UPWARD sloping: a higher income raises money demand, which raises the interest rate.'
      },
      {
        question: 'What shifts the LM curve?',
        answer: 'A change in the (real) money supply:\n• Increase in M → LM shifts DOWN/right (lower i at each Y).\n• Decrease in M → LM shifts UP/left (higher i at each Y).\nIncome does NOT shift LM — it is a movement along it.'
      },
      {
        question: 'How does FISCAL policy work in IS-LM?',
        answer: 'Fiscal expansion (increase G / transfers, or cut T) shifts IS RIGHT → output UP and interest rate UP.\nFiscal contraction (cut G, raise T) shifts IS LEFT → output DOWN and interest rate DOWN.'
      },
      {
        question: 'How does MONETARY policy work in IS-LM?',
        answer: 'Monetary expansion (increase M) shifts LM DOWN → output UP and interest rate DOWN.\nMonetary contraction (decrease M) shifts LM UP → output DOWN and interest rate UP.'
      },
      {
        question: 'What is a policy mix?',
        answer: 'The combined use of fiscal and monetary policy. Because they push the interest rate in opposite or reinforcing directions, a mix lets policymakers target output and the interest rate together (e.g. fiscal expansion + monetary expansion to boost output while keeping i from rising).'
      },
      {
        question: 'According to Table 5-1, what does an INCREASE in the money supply do?',
        answer: 'It shifts LM down (IS unchanged) → output rises and the interest rate falls. (An increase in government spending, by contrast, shifts IS right → output up and interest rate up.)'
      }
    ],

    quiz: [
      {
        question: 'The IS curve represents equilibrium in the:',
        options: ['Money market', 'Goods market', 'Labour market', 'Foreign-exchange market'],
        correct: 1
      },
      {
        question: 'The IS curve is downward-sloping because a higher interest rate:',
        options: ['Raises investment and output', 'Reduces investment, demand and output', 'Raises the money supply', 'Lowers taxes'],
        correct: 1
      },
      {
        question: 'An increase in government spending shifts the IS curve:',
        options: ['Left', 'Right', 'It does not move', 'Down'],
        correct: 1
      },
      {
        question: 'The LM curve represents equilibrium in the:',
        options: ['Goods market', 'Money/financial market', 'Bond market only', 'Labour market'],
        correct: 1
      },
      {
        question: 'The LM curve is upward-sloping because a higher income:',
        options: ['Lowers money demand', 'Raises money demand and the interest rate', 'Shifts the IS curve', 'Lowers prices'],
        correct: 1
      },
      {
        question: 'An increase in the money supply shifts the LM curve:',
        options: ['Up/left', 'Down/right', 'It does not move', 'Vertical'],
        correct: 1
      },
      {
        question: 'A fiscal contraction (higher taxes) leads to:',
        options: ['Higher output and interest rate', 'Lower output and lower interest rate', 'Higher output, lower rate', 'No change'],
        correct: 1
      },
      {
        question: 'Monetary expansion (increase in M) results in:',
        options: ['Output up, interest rate down', 'Output down, interest rate up', 'Output up, interest rate up', 'Output down, interest rate down'],
        correct: 0
      },
      {
        question: 'Using fiscal and monetary policy together is called a:',
        options: ['Liquidity trap', 'Policy mix', 'Tariff', 'Trade balance'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The IS curve represents equilibrium in the _______ market.', answer: 'goods' },
      { sentence: 'The IS curve slopes downward because higher interest rates reduce _______.', answer: 'investment' },
      { sentence: 'An increase in government spending shifts the IS curve to the _______.', answer: 'right' },
      { sentence: 'The LM curve represents equilibrium in the _______ market.', answer: 'money' },
      { sentence: 'The LM curve slopes _______ in the (Y, i) diagram.', answer: 'upward' },
      { sentence: 'An increase in the money supply shifts the LM curve _______.', answer: 'down' },
      { sentence: 'A fiscal expansion raises output and raises the _______ rate.', answer: 'interest' },
      { sentence: 'Using fiscal and monetary policy together is called a policy _______.', answer: 'mix' }
    ],

    learn: {
      content:
        '<h3>Putting the goods market and money market on one graph</h3>' +
        '<p>The <strong>IS-LM model</strong> combines the two short-run markets in a diagram of output \\(Y\\) (horizontal) against the interest rate \\(i\\) (vertical).</p>' +

        '<h4>The IS curve — goods market</h4>' +
        '<p>Now let investment depend on the interest rate. Goods-market equilibrium is:</p>' +
        '<div class="formula-box">\\[ Y = C(Y - T) + I(Y, i) + G \\]</div>' +
        '<p>A higher \\(i\\) lowers investment → lowers demand → lowers output, so <strong>IS slopes down</strong>. It shifts <strong>right</strong> when \\(G\\), \\(C\\) or \\(I\\) rise or \\(T\\) falls; <strong>left</strong> for the opposite.</p>' +

        '<h4>The LM curve — money market</h4>' +
        '<div class="formula-box">\\[ \\frac{M}{P} = Y\\,L(i) \\]</div>' +
        '<p>A higher \\(Y\\) raises money demand → raises \\(i\\), so <strong>LM slopes up</strong>. A change in the money supply \\(M\\) shifts it: more \\(M\\) → LM <strong>down</strong>; less \\(M\\) → LM <strong>up</strong>. (Income is a movement <em>along</em> LM, not a shift.)</p>' +

        '<h4>Economic policy</h4>' +
        '<table>' +
        '<tr><th>Policy</th><th>Shift</th><th>Output</th><th>Interest rate</th></tr>' +
        '<tr><td>Increase in taxes</td><td>IS left</td><td>Down</td><td>Down</td></tr>' +
        '<tr><td>Decrease in taxes</td><td>IS right</td><td>Up</td><td>Up</td></tr>' +
        '<tr><td>Increase in spending (G)</td><td>IS right</td><td>Up</td><td>Up</td></tr>' +
        '<tr><td>Decrease in spending (G)</td><td>IS left</td><td>Down</td><td>Down</td></tr>' +
        '<tr><td>Increase in money (M)</td><td>LM down</td><td>Up</td><td>Down</td></tr>' +
        '<tr><td>Decrease in money (M)</td><td>LM up</td><td>Down</td><td>Up</td></tr>' +
        '</table>' +

        '<div class="tip-box"><h4>The policy mix</h4><p>Fiscal and monetary policy are often combined. Notice fiscal expansion pushes \\(i\\) <em>up</em> while monetary expansion pushes it <em>down</em> — so a <strong>policy mix</strong> can raise output while controlling the interest rate (the typical COVID-crisis response).</p></div>',
      image: null
    }
  }
};

// Expose on window — name MUST match data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.macroeconomicsM1 = macroeconomicsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsM1; }
