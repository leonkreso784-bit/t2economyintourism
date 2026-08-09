// ===== MACROECONOMICS — 1. KOLOKVIJ (K1) =====
// Source: course lectures (Blanchard-style) — Introduction + L2 National Accounts +
// L3 The Goods Market + L4 Financial Markets I + Ch5 The IS-LM Model.
// K1/K2 boundary AUTHORITATIVE from the official Test-1 preparation deck:
// Test 1 covers GDP determinants, the goods market (consumption/multiplier/equilibrium output),
// money market (money demand/supply, interest rate) and the IS-LM combined policies.
//
// ⚠ QUANTITATIVE SUBJECT — uses KaTeX (ADR-009). Convention (docs/architecture/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (in a JS string: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   A single `$` is NEVER used (currency). LaTeX backslash in a string = "\\".

const macroeconomicsM1 = {
  fundamentals: {
    id: "l20jaz",
    name: 'Fundamentals & Objectives',
    icon: 'fa-globe',
    color: '#f59e0b',

    flashcards: [
      {
        id: "mhdcfs",
        question: 'What does macroeconomics study, and how does it differ from microeconomics?',
        answer: 'Macroeconomics studies the functioning of the economy as a WHOLE — overall national production, employment, prices and foreign trade ("macros" = big in Greek).\nMicroeconomics analyses individual prices, quantities and markets of a single supplier or consumer ("micros" = small).',
        explanation: 'In macro the two basic entities are aggregated: all households (consumers) and all businesses (the economy).'
      },
      {
        id: "k02rlf",
        question: 'How do we obtain aggregate demand and aggregate supply?',
        answer: 'Aggregate demand is obtained by aggregating the demand of all households.\nAggregate supply is obtained by aggregating the supply of all companies.'
      },
      {
        id: "il5gwu",
        question: 'What are the four fundamental macroeconomic objectives?',
        answer: '1. A high and growing level of production\n2. High employment (low unemployment)\n3. Price stability\n4. Internal and external (foreign-exchange) stability'
      },
      {
        id: "g7p4qh",
        question: 'What are the four main macroeconomic variables?',
        answer: '1. Gross Domestic Product (GDP) / aggregate output\n2. The unemployment rate\n3. The inflation rate\n4. The interest rate'
      },
      {
        id: "tl1z0p",
        question: 'What is economic policy, and what makes it expansive or restrictive?',
        answer: 'Economic policy is the set of government measures that steer GDP growth and the other macro objectives.\n• EXPANSIVE (expansionary) measures stimulate economic growth.\n• RESTRICTIVE measures reduce economic activity (cool the economy).'
      },
      {
        id: "tpxpey",
        question: 'What are the main types of economic policy?',
        answer: '• Fiscal policy (taxation + public spending)\n• Monetary policy (control of the money supply / interest rate)\n• Policy of international economic relations (tariffs, quotas, exchange rate)\n• Income policy (wage and price control)'
      },
      {
        id: "d04tby",
        question: 'What does expansionary FISCAL policy do?',
        answer: 'It aims to increase GDP by: increasing public spending (G), reducing taxes (T), or increasing transfers (TR).\nRestrictive fiscal policy does the opposite — it limits personal and public spending.'
      },
      {
        id: "orq36j",
        question: 'What does expansionary MONETARY policy do?',
        answer: 'It aims to increase GDP by increasing the money supply and reducing interest rates, which stimulates investment and economic activity.\nRestrictive monetary policy restricts the money supply → higher interest rates, lower investment, lower GDP and lower inflation.'
      },
      {
        id: "x1oa47",
        question: 'What primarily determines GDP in the short, medium and long run?',
        answer: '• SHORT run (a few years): annual changes in GDP are driven mainly by DEMAND.\n• MEDIUM run (~ten years): the level of production is determined by SUPPLY factors (capital, technology, size of the workforce).\n• LONG run (decades): innovation, savings, the quality of education and of public administration.',
        explanation: 'This is exactly why the short-run model (Goods/Financial markets, IS-LM) focuses on demand.'
      },
      {
        id: "z9ib1h",
        question: 'In the short run, what is the dominant cause of recessions?',
        answer: 'A fall in aggregate demand. The short-run model assumes firms supply whatever quantity is demanded at a given price, so output follows demand.'
      }
    ],

    quiz: [
      {
        id: "nri8ee",
        question: 'Macroeconomics studies:',
        options: ['A single firm’s pricing', 'The economy as a whole', 'One consumer’s utility', 'A single market’s elasticity'],
        correct: 1
      },
      {
        id: "1eupnq",
        question: 'Which is NOT one of the four fundamental macroeconomic objectives?',
        options: ['High and growing production', 'High employment', 'Maximising one firm’s profit', 'Price stability'],
        correct: 2
      },
      {
        id: "plof8j",
        question: 'Which is NOT one of the four main macroeconomic variables?',
        options: ['GDP', 'The unemployment rate', 'The marginal rate of substitution', 'The inflation rate'],
        correct: 2
      },
      {
        id: "nv8mnd",
        question: 'Reducing taxes and increasing government spending is:',
        options: ['Restrictive fiscal policy', 'Expansionary fiscal policy', 'Restrictive monetary policy', 'Income policy'],
        correct: 1
      },
      {
        id: "f7gstp",
        question: 'Expansionary monetary policy involves:',
        options: ['Decreasing the money supply and raising rates', 'Increasing the money supply and lowering rates', 'Raising taxes', 'Imposing tariffs'],
        correct: 1
      },
      {
        id: "zuz2yl",
        question: 'In the SHORT run, annual changes in GDP are caused primarily by:',
        options: ['Demand factors', 'Supply factors', 'Technology', 'Capital accumulation'],
        correct: 0
      },
      {
        id: "ezxq4w",
        question: 'In the LONG run, the level of production is determined primarily by:',
        options: ['Monetary policy', 'Demand', 'Supply factors / innovation, savings, technology', 'Tariffs'],
        correct: 2
      },
      {
        id: "bks6ip",
        question: 'Wage and price control is an instrument of:',
        options: ['Fiscal policy', 'Income policy', 'Monetary policy', 'Trade policy'],
        correct: 1
      },
      {
        id: "iga4r5",
        question: 'Aggregate supply is obtained by aggregating:',
        options: ['The demand of all households', 'The supply of all companies', 'Government spending', 'Net exports'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "ll5et4", sentence: 'Macroeconomics studies the functioning of the economy as a _______.', answer: 'whole' },
      { id: "w4vt2k", sentence: 'Aggregating the demand of all households gives aggregate _______.', answer: 'demand' },
      { id: "8kddh3", sentence: 'Measures that stimulate economic growth are called _______ measures.', answer: 'expansive' },
      { id: "kpiipv", sentence: 'Fiscal policy works through taxation and public _______.', answer: 'spending' },
      { id: "f1gabo", sentence: 'Monetary policy controls the money _______.', answer: 'supply' },
      { id: "rpy6r0", sentence: 'In the short run, changes in GDP are driven mainly by _______.', answer: 'demand' },
      { id: "zv2b0i", sentence: 'In the medium run, output is determined mainly by _______ factors.', answer: 'supply' },
      { id: "65op2j", sentence: 'Controlling wages and prices is an instrument of _______ policy.', answer: 'income' }
    ],

    learn: {
      id: "8w6n91",
      content:
        '<h3>Zooming out: the economy as a whole</h3>' +
        '<p>Microeconomics puts a single market under the microscope — one good, one firm, one consumer. <strong>Macroeconomics</strong> does the opposite: it steps back to study the economy <em>as a whole</em> — total national production, overall employment, the general price level, and trade with the rest of the world. ("Macro" is Greek for big; "micro" for small.)</p>' +
        '<p>The trick that makes this possible is <strong>aggregation</strong>. Instead of one buyer and one seller, macro works with two giant blocks:</p>' +
        '<ul>' +
        '<li>all households together → <strong>aggregate demand</strong> (the total desire to buy);</li>' +
        '<li>all firms together → <strong>aggregate supply</strong> (the total ability to produce).</li>' +
        '</ul>' +
        '<p>Almost every macro debate — growth, unemployment, inflation, policy — is ultimately about how these two aggregates interact.</p>' +

        '<h3>What a healthy economy aims for: the four objectives</h3>' +
        '<p>Governments and central banks judge an economy against four <strong>fundamental objectives</strong>:</p>' +
        '<ol>' +
        '<li><strong>A high and growing level of production</strong> — more output means more income and a higher standard of living.</li>' +
        '<li><strong>High employment</strong> (low unemployment) — idle workers are lost output and lost welfare.</li>' +
        '<li><strong>Price stability</strong> — low, predictable inflation so money keeps its value.</li>' +
        '<li><strong>Internal and external stability</strong> — a balanced budget at home and a sustainable position abroad (foreign-exchange/trade balance).</li>' +
        '</ol>' +

        '<h3>The four variables we actually watch</h3>' +
        '<p>To see whether those objectives are being met, macroeconomists track four headline <strong>variables</strong> — and the whole course is essentially the story of these four and how they move together:</p>' +
        '<ul>' +
        '<li><strong>GDP</strong> — aggregate output (objective 1).</li>' +
        '<li>the <strong>unemployment rate</strong> (objective 2).</li>' +
        '<li>the <strong>inflation rate</strong> (objective 3).</li>' +
        '<li>the <strong>interest rate</strong> — the price of money, the main lever of policy.</li>' +
        '</ul>' +

        '<h3>How governments steer the economy: economic policy</h3>' +
        '<p>The objectives do not take care of themselves. <strong>Economic policy</strong> is the set of measures used to steer the four variables. Every policy comes in two directions:</p>' +
        '<ul>' +
        '<li><strong>Expansive (expansionary)</strong> — stimulate activity, push GDP up (used in recessions).</li>' +
        '<li><strong>Restrictive</strong> — cool activity, slow GDP and inflation (used when the economy overheats).</li>' +
        '</ul>' +
        '<p>The main toolkits are:</p>' +
        '<ul>' +
        '<li><strong>Fiscal policy</strong> — taxes (T) and government spending (G). Cutting T or raising G is expansionary.</li>' +
        '<li><strong>Monetary policy</strong> — the money supply and the interest rate, run by the central bank. More money / lower rates is expansionary.</li>' +
        '<li><strong>International (trade) policy</strong> — tariffs, quotas, the exchange rate.</li>' +
        '<li><strong>Income policy</strong> — direct control of wages and prices.</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>The three horizons — the backbone of the whole course</h4>' +
        '<p>The same variables behave differently depending on the time frame, and this is the single most important organising idea in macroeconomics:</p>' +
        '<ul>' +
        '<li><strong>Short run</strong> (a few years): GDP is driven by <strong>demand</strong>. If spending rises, output rises.</li>' +
        '<li><strong>Medium run</strong> (~a decade): output is pinned down by <strong>supply</strong> factors — capital, technology, the size of the workforce.</li>' +
        '<li><strong>Long run</strong> (decades): growth depends on <strong>innovation, savings and institutions</strong> (education, the quality of government).</li>' +
        '</ul>' +
        '<p>The Goods-market, Financial-market and IS-LM models in <em>this</em> midterm all describe the <strong>short run</strong> — which is exactly why they focus on aggregate demand. The second midterm then moves to the medium and long run, where supply takes over.</p>' +
        '</div>',
      image: null
    }
  },

  unemploymentInflation: {
    id: "v83dc9",
    name: 'Unemployment & Inflation',
    icon: 'fa-arrow-trend-down',
    color: '#fbbf24',

    flashcards: [
      {
        id: "e5kl5x",
        question: 'How is the labour force defined, and who is excluded?',
        answer: 'The labour force consists of the employed and the unemployed:\n\\( L = E + U \\)\nExcluded (NOT in the labour force): students, homemakers, retirees, those unable to work, and those who do not want to work.'
      },
      {
        id: "dlr3hl",
        question: 'How are the unemployment and employment rates calculated?',
        answer: 'Unemployment rate \\( = \\dfrac{U}{L} \\) (the unemployed as a share of the labour force).\nEmployment rate \\( = \\dfrac{E}{L} \\) (the employed as a share of the labour force).'
      },
      {
        id: "tz86uz",
        question: 'What is the economic cost of unemployment?',
        answer: 'Behind every unemployed worker there is a LOSS — the economy produces less than it could. The cost is the difference between the potential output (at full employment) and the actual output. The higher unemployment, the further actual output falls below potential.'
      },
      {
        id: "pqofyf",
        question: 'What is inflation, deflation, and the inflation rate?',
        answer: 'Inflation is a permanent increase in the general price level; the inflation rate is the rate at which prices rise.\nDeflation is a permanent decrease in the price level (a negative inflation rate) — rare (e.g. Japan in the late 1990s).',
        explanation: 'The general price level is tracked by the Consumer Price Index (CPI).'
      },
      {
        id: "5uxopt",
        question: 'What is the CPI?',
        answer: 'The Consumer Price Index measures the average price (cost of living) of a FIXED basket of goods bought by typical consumers. In the base period CPI = 100, and we read its movement relative to 100.'
      },
      {
        id: "w6ajn5",
        question: 'What is considered the optimal inflation rate?',
        answer: 'Low and stable inflation, around 1–4% per year (often targeted near 2%). Both very high inflation and deflation create uncertainty and harm the economy.'
      },
      {
        id: "uqvfxj",
        question: 'How are the real and nominal interest rates related?',
        answer: 'The nominal interest rate is the rate at which the nominal value of a deposit grows; the real interest rate is the rate at which its purchasing power grows. Approximately:\n\\( \\text{real rate} \\approx \\text{nominal rate} - \\text{inflation rate} \\)',
        explanation: 'Example: nominal 8%, inflation 3% → real ≈ 5%.'
      },
      {
        id: "4r0owe",
        question: 'What is Okun’s law?',
        answer: 'Okun’s law links output and unemployment: output growth ABOVE trend is associated with FALLING unemployment, and growth BELOW trend with RISING unemployment. (A roughly 2% shortfall of output relative to potential raises unemployment by about 1%.)'
      },
      {
        id: "5chk5i",
        question: 'What does the Phillips curve tell us?',
        answer: 'The Phillips curve describes an INVERSE relationship between unemployment and inflation: a low unemployment rate tends to raise the inflation rate, and a high unemployment rate tends to lower it. A country trades off lower unemployment against higher inflation.'
      },
      {
        id: "nnc4om",
        question: 'Why do economists worry about inflation if all prices and wages rose together?',
        answer: 'If inflation were "pure" (all prices and wages rising at the same rate) it would not be a problem. In reality the changes are NOT proportional — goods prices often rise faster than wages, relative prices distort, uncertainty rises, and nominal-income tax brackets push up real tax burdens.'
      }
    ],

    quiz: [
      {
        id: "20q9hx",
        question: 'The labour force is:',
        options: ['Only the employed', 'The employed plus the unemployed (L = E + U)', 'Everyone of working age', 'The employed plus retirees'],
        correct: 1
      },
      {
        id: "bupujx",
        question: 'Which group is NOT counted in the labour force?',
        options: ['The unemployed actively seeking work', 'Full-time students not seeking work', 'Part-time employees', 'Self-employed workers'],
        correct: 1
      },
      {
        id: "psnfgf",
        question: 'The unemployment rate equals:',
        options: ['U / E', 'E / L', 'U / L', 'L / U'],
        correct: 2
      },
      {
        id: "y30zy3",
        question: 'A permanent decrease in the general price level is called:',
        options: ['Disinflation', 'Deflation', 'Stagflation', 'Recession'],
        correct: 1
      },
      {
        id: "xnikrz",
        question: 'The CPI measures the price of:',
        options: ['A single good', 'A fixed basket of consumer goods', 'All capital goods', 'Exports only'],
        correct: 1
      },
      {
        id: "1zejv5",
        question: 'If the nominal interest rate is 8% and inflation is 3%, the real interest rate is about:',
        options: ['11%', '5%', '3%', '24%'],
        correct: 1
      },
      {
        id: "f0ergz",
        question: 'Okun’s law links:',
        options: ['Inflation and the money supply', 'Output growth and unemployment', 'Taxes and spending', 'Exports and the exchange rate'],
        correct: 1
      },
      {
        id: "n9a8o7",
        question: 'The Phillips curve describes the relationship between unemployment and:',
        options: ['GDP', 'Inflation', 'The exchange rate', 'Investment'],
        correct: 1
      },
      {
        id: "y34upt",
        question: 'A low unemployment rate tends to be associated with:',
        options: ['Lower inflation', 'Higher inflation', 'No change in inflation', 'Deflation'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "05yq2l", sentence: 'The labour force equals the employed plus the _______.', answer: 'unemployed' },
      { id: "0of9ne", sentence: 'The unemployment rate is the ratio U over _______.', answer: 'L' },
      { id: "ja6iel", sentence: 'A permanent fall in the general price level is called _______.', answer: 'deflation' },
      { id: "o9yafq", sentence: 'The general price level is measured by the Consumer Price _______.', answer: 'index' },
      { id: "12n2mt", sentence: 'The optimal inflation rate is considered low and stable, around 1–4 _______.', answer: 'percent' },
      { id: "vzfe7m", sentence: 'The real interest rate ≈ nominal rate minus the _______ rate.', answer: 'inflation' },
      { id: "5hryci", sentence: 'Okun’s law links output growth with the _______ rate.', answer: 'unemployment' },
      { id: "0t4aj5", sentence: 'The Phillips curve shows an _______ relationship between unemployment and inflation.', answer: 'inverse' }
    ],

    learn: {
      id: "09675q",
      content:
        '<h3>Two things that hurt: idle workers and an unstable currency</h3>' +
        '<p>Beyond producing a lot (GDP), a healthy economy must keep two other numbers under control: <strong>unemployment</strong> and <strong>inflation</strong>. Both are costly, both are watched constantly, and — as we will see — they are linked to each other and to output.</p>' +

        '<h3>Unemployment: measuring lost potential</h3>' +
        '<p>Start by splitting the working-age population. The <strong>labour force</strong> is everyone who is either working or actively looking for work:</p>' +
        '<div class="formula-box">\\[ L = E + U \\]</div>' +
        '<p>where \\(E\\) = employed and \\(U\\) = unemployed. Crucially, many people are <em>outside</em> the labour force altogether: full-time students, homemakers, retirees, those unable to work, and those who simply do not want to. They are neither \\(E\\) nor \\(U\\). The two headline ratios are:</p>' +
        '<div class="formula-box">\\[ \\text{unemployment rate} = \\frac{U}{L}, \\qquad \\text{employment rate} = \\frac{E}{L} \\]</div>' +
        '<p><strong>Why we care:</strong> unemployment is not just a social problem, it is an <em>economic</em> one. Every unemployed worker represents output that was never produced. The <strong>economic cost of unemployment</strong> is exactly the gap between the potential output of full employment and the actual output — the higher unemployment, the further the economy falls below its potential. The unemployment rate also rises and falls with the business cycle: up in recessions, down in expansions.</p>' +

        '<h3>Inflation: when money loses its value</h3>' +
        '<p><strong>Inflation</strong> is a <em>permanent, ongoing</em> rise in the general price level; <strong>deflation</strong> is a permanent fall (a negative inflation rate — rare, e.g. Japan in the late 1990s). The general price level is measured by the <strong>Consumer Price Index (CPI)</strong>: the cost of a <em>fixed basket</em> of goods bought by a typical household, set to 100 in the base year.</p>' +
        '<p>Surprisingly, economists do not aim for zero inflation — the target is <strong>low and stable inflation, around 1–4%</strong> (often ≈2%). Why not zero?</p>' +
        '<ul>' +
        '<li><strong>High inflation</strong> creates uncertainty, distorts relative prices, complicates investment, and quietly raises real tax burdens (as nominal incomes drift into higher brackets).</li>' +
        '<li><strong>Deflation</strong> is also harmful: it signals a weak economy, encourages people to delay spending, and limits the power of monetary policy.</li>' +
        '</ul>' +
        '<div class="warning-box">' +
        '<h4>"Pure" inflation would be harmless — but it never happens</h4>' +
        '<p>If <em>all</em> prices and wages rose at exactly the same rate, inflation would not hurt anyone. The damage comes because the changes are <strong>not proportional</strong>: goods prices typically rise faster than wages, so real purchasing power and relative prices shift in unpredictable ways.</p>' +
        '</div>' +

        '<h3>Real vs. nominal interest rates</h3>' +
        '<p>Interest is the price of money. But a 10% return means little if prices also rose 10%. So we separate the <strong>nominal</strong> rate (how fast the money value of a deposit grows) from the <strong>real</strong> rate (how fast its <em>purchasing power</em> grows):</p>' +
        '<div class="formula-box">\\[ \\text{real rate} \\approx \\text{nominal rate} - \\text{inflation rate} \\]</div>' +
        '<div class="example-box">' +
        '<h4>Worked example — the real interest rate</h4>' +
        '<p>If the nominal interest rate is 8% and prices rise by 3%, the real (purchasing-power) return is</p>' +
        '<div class="formula-box">\\[ r \\approx i - \\pi = 8\\% - 3\\% = 5\\% \\]</div>' +
        '<p><strong>Interpretation:</strong> your money grew 8% in euros, but since everything costs 3% more, you are only about 5% better off in real terms. This is the rate that actually matters for saving and borrowing decisions.</p>' +
        '</div>' +

        '<h3>How the three connect: Okun and Phillips</h3>' +
        '<p>Output, unemployment and inflation are not independent — two famous empirical relationships tie them together:</p>' +
        '<ul>' +
        '<li><strong>Okun’s law</strong> (output ↔ unemployment): when output grows <em>faster</em> than trend, unemployment falls; when it grows <em>slower</em> than trend, unemployment rises. (Roughly, a 2% shortfall of output below potential raises unemployment by about 1%.)</li>' +
        '<li><strong>The Phillips curve</strong> (unemployment ↔ inflation): the two move <em>inversely</em>. Low unemployment strengthens workers’ bargaining power, pushing wages and prices up (higher inflation); high unemployment does the reverse.</li>' +
        '</ul>' +
        '<div class="tip-box">' +
        '<h4>The policy trade-off</h4>' +
        '<p>Put together, Okun and Phillips imply a choice: a country can aim for <strong>lower unemployment but higher inflation</strong>, or <strong>higher unemployment but lower inflation</strong>. There is no free lunch in the short run — this tension is exactly what the AS-AD model in the second midterm formalises.</p>' +
        '</div>',
      image: null
    }
  },

  gdpMeasurement: {
    id: "wd41kq",
    name: 'GDP: Nominal, Real & Growth',
    icon: 'fa-chart-area',
    color: '#f59e0b',

    flashcards: [
      {
        id: "wup011",
        question: 'What is GDP?',
        answer: 'Gross Domestic Product is the market value of all FINAL products and services produced in a country during one year — the most comprehensive measure of a country’s total economic production.'
      },
      {
        id: "k6acax",
        question: 'How does GDP differ from GNP?',
        answer: 'GDP is GEOGRAPHIC: all output produced WITHIN a country’s borders, regardless of ownership (e.g. a foreign-owned bank in Croatia counts in Croatian GDP).\nGNP is by OWNERSHIP: output produced by a country’s factors of production, wherever they are located.'
      },
      {
        id: "5rckjo",
        question: 'Nominal vs. real vs. potential GDP — what is each?',
        answer: '• NOMINAL GDP — at current market prices (changes with both quantity and prices).\n• REAL GDP — at constant prices (changes only with the volume of production); the true measure of economic activity.\n• POTENTIAL GDP — the maximum output the economy can produce at stable prices (high employment).'
      },
      {
        id: "txlft9",
        question: 'How is real GDP calculated from nominal GDP?',
        answer: 'Using the GDP deflator (or a price index):\n\\( \\text{Nominal GDP} = \\text{Real GDP}\\times \\text{deflator} \\)\n\\( \\Rightarrow \\text{Real GDP} = \\dfrac{\\text{Nominal GDP}}{\\text{deflator}} \\)\nWith a base-100 index: \\( \\text{Real GDP}_n = \\text{Nominal GDP}_n \\times \\dfrac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_n} \\).'
      },
      {
        id: "racztc",
        question: 'How do prices affect the relationship between real and nominal GDP?',
        answer: '• Prices RISE → real GDP is LESS than nominal GDP.\n• Prices FALL → real GDP is GREATER than nominal GDP.\n• Prices UNCHANGED → real GDP equals nominal GDP.'
      },
      {
        id: "a8fnop",
        question: 'What is the GDP gap, and its two types?',
        answer: 'The GDP gap is the difference between potential and actual (real) GDP.\n• RECESSIONAL gap — the economy produces LESS than its capacity (idle resources); the goal is to raise GDP. (Most common.)\n• INFLATIONARY gap — the economy produces MORE than capacity; the goal is to cool GDP. (Rare, only in the most developed economies.)'
      },
      {
        id: "ocegnq",
        question: 'How is the GDP growth rate calculated?',
        answer: 'It compares output across years:\n\\( \\text{growth rate} = \\dfrac{Y_t - Y_{t-1}}{Y_{t-1}}\\times 100 \\)\nPositive growth = expansion; negative growth = recession.'
      },
      {
        id: "gp9nk3",
        question: 'What is the technical definition of a recession?',
        answer: 'A recession occurs when the economy records negative growth rates in at least two consecutive quarters. (Economists watch quarterly, not just annual, data.)'
      },
      {
        id: "ayu57m",
        question: 'Why is GDP per capita important?',
        answer: 'GDP per capita = real GDP / number of inhabitants. It indicates the average standard of living — the higher it is, the higher the population’s living standard, and it allows fairer comparison across countries.'
      }
    ],

    quiz: [
      {
        id: "dnxkl8",
        question: 'GDP measures the market value of all _______ produced in a country in a year.',
        options: ['Intermediate goods', 'Final products and services', 'Exports only', 'Capital goods only'],
        correct: 1
      },
      {
        id: "nm2658",
        question: 'A foreign-owned bank operating in Croatia is counted in:',
        options: ['Croatia’s GNP only', 'Croatia’s GDP', 'No country’s output', 'The bank’s home-country GDP'],
        correct: 1
      },
      {
        id: "6x4tr3",
        question: 'Real GDP is measured at:',
        options: ['Current prices', 'Constant prices', 'Future prices', 'Black-market prices'],
        correct: 1
      },
      {
        id: "x7dv7m",
        question: 'If prices rise during the year, real GDP will be:',
        options: ['Greater than nominal GDP', 'Less than nominal GDP', 'Equal to nominal GDP', 'Zero'],
        correct: 1
      },
      {
        id: "px2nbz",
        question: 'Nominal GDP is 325 and the price index is 130 (base = 100). Real GDP is:',
        options: ['422.5', '250', '195', '130'],
        correct: 1
      },
      {
        id: "g8xhzx",
        question: 'An economy producing LESS than its capacity has a:',
        options: ['Inflationary gap', 'Recessional gap', 'Trade surplus', 'Budget surplus'],
        correct: 1
      },
      {
        id: "sg3tvw",
        question: 'A recession is defined as negative growth for at least:',
        options: ['One month', 'Two consecutive quarters', 'One year', 'Five years'],
        correct: 1
      },
      {
        id: "e83cl1",
        question: 'The best indicator of the average standard of living is:',
        options: ['Nominal GDP', 'GDP per capita', 'The inflation rate', 'Total exports'],
        correct: 1
      },
      {
        id: "1ipioe",
        question: 'Potential GDP is:',
        options: ['Output at current prices', 'The maximum output at stable prices (high employment)', 'Output minus imports', 'Last year’s GDP'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "1b6gq9", sentence: 'GDP is the market value of all _______ goods and services produced in a year.', answer: 'final' },
      { id: "iwh9af", sentence: 'GDP is geographic; GNP is based on _______.', answer: 'ownership' },
      { id: "s7jd1a", sentence: 'Real GDP is measured at _______ prices.', answer: 'constant' },
      { id: "aqpwli", sentence: 'Real GDP equals nominal GDP divided by the _______.', answer: 'deflator' },
      { id: "780orx", sentence: 'When prices rise, real GDP is _______ than nominal GDP.', answer: 'less' },
      { id: "avm324", sentence: 'An economy producing less than capacity has a _______ gap.', answer: 'recessional' },
      { id: "ewem9p", sentence: 'A recession is negative growth for at least two consecutive _______.', answer: 'quarters' },
      { id: "1fbu6r", sentence: 'The average standard of living is best shown by GDP per _______.', answer: 'capita' }
    ],

    learn: {
      id: "o24ss3",
      content:
        '<h3>Measuring an entire economy with one number</h3>' +
        '<p>How do you summarise the activity of millions of firms and households in a single figure? That is the job of <strong>Gross Domestic Product (GDP)</strong> — the market value of all <em>final</em> goods and services produced inside a country during one year. It is the most comprehensive measure of a nation’s economic output, published monthly, quarterly and annually for every country (Eurostat, the IMF, national statistical offices).</p>' +
        '<p>Two words in that definition do a lot of work:</p>' +
        '<ul>' +
        '<li><strong>"Final"</strong> — only goods sold to their last user are counted. The flour a bakery buys is an <em>intermediate</em> good; counting both the flour and the bread would double-count. We count the bread only.</li>' +
        '<li><strong>"Inside a country"</strong> — GDP is <strong>geographic</strong>. Everything produced within the borders counts, no matter who owns the firm. A foreign-owned bank operating in Croatia adds to <em>Croatian</em> GDP.</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>GDP vs. GNP — borders vs. owners</h4>' +
        '<p><strong>GDP</strong> follows the <em>location</em> of production (within the borders). <strong>GNP</strong> (Gross National Product) follows <em>ownership</em> — output produced by a country’s factors of production, wherever in the world they sit. Most statistics switched from GNP to GDP after 1992.</p>' +
        '</div>' +

        '<h3>Why we strip out prices: nominal, real and potential GDP</h3>' +
        '<p>Suppose a country’s GDP "grows" from 300 to 330. Did it really produce more — or did prices simply rise? To answer this, economists always distinguish three versions of GDP:</p>' +
        '<ul>' +
        '<li><strong>Nominal GDP</strong> — valued at <em>current</em> market prices. It moves for two reasons at once: changes in quantities <em>and</em> changes in prices. Useful, but it can mislead.</li>' +
        '<li><strong>Real GDP</strong> — valued at <em>constant</em> (base-year) prices, so it moves <em>only</em> when the volume of production changes. This is the honest measure of economic activity and the one economists care about.</li>' +
        '<li><strong>Potential GDP</strong> — the maximum output the economy could produce at stable prices with a high level of employment. It is the benchmark the economy "should" reach.</li>' +
        '</ul>' +
        '<p>The bridge between nominal and real is the <strong>GDP deflator</strong> (or a price index such as the CPI, set to 100 in the base year):</p>' +
        '<div class="formula-box">\\[ \\text{Nominal GDP} = \\text{Real GDP}\\times \\text{deflator} \\;\\;\\Longrightarrow\\;\\; \\text{Real GDP}_n = \\text{Nominal GDP}_n \\times \\frac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_n} \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — deflating nominal GDP</h4>' +
        '<p>Nominal GDP in 1990 is 325 (billion EUR), and the price index has risen to 130 (base year 1990 = 100). To express it in base-year purchasing power:</p>' +
        '<div class="formula-box">\\[ \\text{Real GDP} = 325 \\times \\frac{100}{130} = 250 \\]</div>' +
        '<p><strong>Interpretation:</strong> the headline (nominal) figure is 325, but once we remove the price increase, real output is only 250. The "growth" was largely inflation, not extra production. This is exactly why a country can have a rising nominal GDP and a <em>falling</em> standard of living.</p>' +
        '</div>' +

        '<div class="warning-box">' +
        '<h4>Read the price effect correctly</h4>' +
        '<p>The relationship between the two always follows the price movement:</p>' +
        '<ul>' +
        '<li>Prices <strong>rose</strong> → real GDP &lt; nominal GDP.</li>' +
        '<li>Prices <strong>fell</strong> → real GDP &gt; nominal GDP.</li>' +
        '<li>Prices <strong>unchanged</strong> → real GDP = nominal GDP.</li>' +
        '</ul>' +
        '<p>A common exam trap is to celebrate a big nominal rise — always check what happened to prices first.</p>' +
        '</div>' +

        '<h3>The GDP gap: is the economy under- or over-performing?</h3>' +
        '<p>The <strong>GDP gap</strong> compares actual (real) output with potential output. Because of business cycles, the two rarely coincide:</p>' +
        '<ul>' +
        '<li><strong>Recessional gap</strong> — the economy produces <em>less</em> than its potential; resources sit idle (unemployment). This is the common situation, and policy aims to <em>raise</em> GDP.</li>' +
        '<li><strong>Inflationary gap</strong> — the economy produces <em>more</em> than its sustainable capacity, straining resources and pushing prices up. Rare, and seen only in the most developed economies; policy aims to <em>cool</em> GDP.</li>' +
        '</ul>' +

        '<h3>Measuring growth and living standards</h3>' +
        '<p>The pace of the economy is captured by the <strong>growth rate</strong> of real GDP:</p>' +
        '<div class="formula-box">\\[ \\text{growth rate} = \\frac{Y_t - Y_{t-1}}{Y_{t-1}}\\times 100 \\]</div>' +
        '<p>Sustained positive growth is an <strong>expansion</strong>; sustained negative growth is a <strong>recession</strong> — technically defined as at least <em>two consecutive quarters</em> of negative growth (which is why economists watch quarterly, not just annual, data).</p>' +
        '<div class="tip-box">' +
        '<h4>For living standards, use real GDP per capita</h4>' +
        '<p>Total GDP tells you how <em>big</em> an economy is, not how <em>well-off</em> its people are. For that, divide by population:</p>' +
        '<div class="formula-box">\\[ \\text{GDP per capita} = \\frac{\\text{real GDP}}{\\text{population}} \\]</div>' +
        '<p>This is the standard measure of the average standard of living and the only fair way to compare a large country with a small one. (For cross-country comparisons it is refined further into PPP terms — see the Long Run.)</p>' +
        '</div>',
      image: null
    }
  },

  nationalAccounts: {
    id: "juxo71",
    name: 'National Accounts',
    icon: 'fa-scale-balanced',
    color: '#fbbf24',

    flashcards: [
      {
        id: "todcwi",
        question: 'What is the fundamental national-accounting identity?',
        answer: 'Total production = Total consumption = Total income.\nEconomic activity can be measured three equivalent ways, all giving the SAME value.'
      },
      {
        id: "0ju0in",
        question: 'What are the three approaches to measuring GDP?',
        answer: '1. PRODUCTION approach — the value of final output (excluding intermediate stages).\n2. EXPENDITURE (consumption) approach — total spending by final buyers.\n3. INCOME approach — total income received.\nAll three give the same GDP.'
      },
      {
        id: "noxznl",
        question: 'What is the expenditure (consumption) formula for GDP?',
        answer: '\\( \\text{GDP} = C + I + G + (E - U) \\)\nwhere C = personal consumption, I = investment, G = government spending, E = exports, U = imports. Net exports \\( NX = E - U \\).'
      },
      {
        id: "sf3mtx",
        question: 'What are the four economic models of GDP?',
        answer: '• One-sector: \\( Y = C \\)\n• Two-sector: \\( Y = C + I \\)\n• Three-sector: \\( Y = C + I + G \\)\n• Four-sector: \\( Y = C + I + G + (E - U) \\)'
      },
      {
        id: "iky3fw",
        question: 'What is the saving–investment identity in the four-sector model?',
        answer: '\\( S - I = (G + TR - T) + NX \\)\nwhere NX = E − U.\n(In the simple two-sector model this collapses to \\( S = I \\).)',
        explanation: 'Private saving minus investment equals the budget deficit plus net exports.'
      },
      {
        id: "cz9q3r",
        question: 'What is value added?',
        answer: 'Value added = gross value of production − intermediate consumption. Summing value added across all activities (the NACE structure) avoids double-counting and yields GDP by the production approach.'
      },
      {
        id: "ksx9vp",
        question: 'What is intermediate consumption?',
        answer: 'The value of products and services that are transformed, used up or consumed within the production process — they are NOT counted directly in GDP (only the final output is).'
      },
      {
        id: "yd601s",
        question: 'How is tourism treated in the national classification of activities (NACE)?',
        answer: 'Tourism is NOT a separate activity or sector in any classification. An activity is defined by the producer / the product, so tourism is monitored across several activities rather than as one — this is why a satellite account is needed (covered later).'
      },
      {
        id: "mab7fg",
        question: 'What are the macroeconomic aggregate symbols?',
        answer: 'Y = GDP, C = personal consumption, I = investment, S = savings, G = government (fiscal) spending, E = exports, U = imports, T = taxes, TR = transfers.'
      }
    ],

    quiz: [
      {
        id: "mgd12g",
        question: 'The three approaches to GDP (production, expenditure, income) give:',
        options: ['Three different values', 'The same value', 'Values that differ by taxes', 'Only an approximation'],
        correct: 1
      },
      {
        id: "hctxa0",
        question: 'The expenditure formula for GDP is:',
        options: ['Y = C − I − G', 'Y = C + I + G + (E − U)', 'Y = C × I × G', 'Y = S + T'],
        correct: 1
      },
      {
        id: "4dfbbj",
        question: 'Net exports (NX) equal:',
        options: ['Imports − exports', 'Exports − imports', 'Exports + imports', 'Government spending − taxes'],
        correct: 1
      },
      {
        id: "y5t5gn",
        question: 'The three-sector model of GDP is:',
        options: ['Y = C', 'Y = C + I', 'Y = C + I + G', 'Y = C + I + G + NX'],
        correct: 2
      },
      {
        id: "i21s2v",
        question: 'Value added equals gross value of production minus:',
        options: ['Taxes', 'Intermediate consumption', 'Net exports', 'Depreciation'],
        correct: 1
      },
      {
        id: "3ycoww",
        question: 'In national accounting, total production equals total income and total:',
        options: ['Exports', 'Consumption', 'Taxes', 'Savings'],
        correct: 1
      },
      {
        id: "oi4w4g",
        question: 'In the national classification of activities, tourism is:',
        options: ['A single sector', 'A separate activity', 'Not a separate activity/sector', 'A primary sector'],
        correct: 2
      },
      {
        id: "qehes6",
        question: 'Intermediate consumption is:',
        options: ['Counted directly in GDP', 'Used up within the production process and not counted directly', 'A type of final good', 'Equal to net exports'],
        correct: 1
      },
      {
        id: "ypw4ed",
        question: 'In the symbols, G stands for:',
        options: ['Gross saving', 'Government (fiscal) spending', 'GDP growth', 'Goods imported'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "5x8392", sentence: 'Total production equals total income equals total _______.', answer: 'consumption' },
      { id: "gglj50", sentence: 'GDP = C + I + G + (E − _______).', answer: 'U' },
      { id: "bgklk1", sentence: 'Net exports equal exports minus _______.', answer: 'imports' },
      { id: "uf4cve", sentence: 'The three-sector model is Y = C + I + _______.', answer: 'G' },
      { id: "st4i1v", sentence: 'Value added equals gross production minus _______ consumption.', answer: 'intermediate' },
      { id: "wuivf1", sentence: 'In the four-sector model, S − I = (G + TR − T) + _______.', answer: 'NX' },
      { id: "zq7yjs", sentence: 'Tourism is _______ a separate activity in the NACE classification.', answer: 'not' },
      { id: "cklv95", sentence: 'In the macro symbols, the letter T stands for _______.', answer: 'taxes' }
    ],

    learn: {
      id: "nsmbr0",
      content:
        '<h3>One economy, three ways to count it</h3>' +
        '<p>National accounts are the bookkeeping system of a whole country. They rest on a single, almost philosophical identity: every euro of output is also a euro that someone spends and a euro that someone earns. In other words,</p>' +
        '<div class="formula-box">\\[ \\text{Total production} = \\text{Total consumption} = \\text{Total income} \\]</div>' +
        '<p>This is why GDP can be measured in <strong>three equivalent ways</strong>, each starting from a different side of the same circular flow:</p>' +
        '<ol>' +
        '<li><strong>Production approach</strong> — add up the value of all final output.</li>' +
        '<li><strong>Expenditure (consumption) approach</strong> — add up what all buyers spend.</li>' +
        '<li><strong>Income approach</strong> — add up all the income earned.</li>' +
        '</ol>' +
        '<p>All three <em>must</em> give the same number. If your textbook computes GDP three different ways and gets three answers, something is mis-measured, not three "kinds" of GDP.</p>' +

        '<h3>The expenditure approach: building GDP sector by sector</h3>' +
        '<p>The expenditure form is the one we use for modelling, because it names <em>who</em> does the spending. Adding one sector at a time gives the four classic models of GDP:</p>' +
        '<div class="formula-box">\\[ \\underbrace{Y = C}_{\\text{1 sector}} \\;\\to\\; \\underbrace{Y = C + I}_{\\text{2 sectors}} \\;\\to\\; \\underbrace{Y = C + I + G}_{\\text{3 sectors}} \\;\\to\\; \\underbrace{Y = C + I + G + (E - U)}_{\\text{4 sectors}} \\]</div>' +
        '<p>Each letter is one spender: <strong>C</strong> households, <strong>I</strong> firms (investment), <strong>G</strong> the government, and <strong>E − U</strong> the rest of the world (exports minus imports). Net exports are \\(NX = E - U\\). The goods-market model you study next is built directly on the three-sector version \\(Y = C + I + G\\).</p>' +

        '<h4>The saving–investment identity</h4>' +
        '<p>Rearranging the full four-sector model yields a deep relationship between a country’s saving, its government budget and its trade balance:</p>' +
        '<div class="formula-box">\\[ S - I = (G + TR - T) + NX \\]</div>' +
        '<p><strong>Interpretation:</strong> the term \\(G + TR - T\\) is the government <em>budget deficit</em> (spending plus transfers minus taxes). So a country’s private saving over investment must equal the budget deficit <em>plus</em> net exports — the seed of the "twin deficits" idea that reappears in the open economy.</p>' +

        '<h3>The production approach: value added (no double-counting)</h3>' +
        '<p>If you simply summed every firm’s sales you would count the same output many times (the steel inside a car, the flour inside bread). The production approach avoids this by summing only the <strong>value added</strong> at each stage:</p>' +
        '<div class="formula-box">\\[ \\text{Value added} = \\text{gross value of production} - \\text{intermediate consumption} \\]</div>' +
        '<p>where <strong>intermediate consumption</strong> is the value of inputs used up in production. Summed across all activities — organised by the <strong>NACE</strong> classification (primary, secondary, tertiary, quaternary, quintary sectors) — value added equals GDP.</p>' +

        '<div class="warning-box">' +
        '<h4>Tourism is not an "activity" — a key point for this faculty</h4>' +
        '<p>In NACE an activity is defined by the producer and the product, so <strong>tourism does not exist as a separate activity or sector</strong> in any classification. A tourist’s spending is spread across accommodation, transport, food service, retail and more. This is precisely why measuring tourism requires a special construction — a tourism <em>satellite account</em> — rather than reading one line off the national accounts.</p>' +
        '</div>',
      image: null
    }
  },

  goodsMarket: {
    id: "8tlpqt",
    name: 'The Goods Market',
    icon: 'fa-cart-shopping',
    color: '#f59e0b',

    flashcards: [
      {
        id: "wh2fj1",
        question: 'What is the consumption function?',
        answer: '\\( C = c_0 + c_1 Y_D \\)\n• \\( c_0 \\) = autonomous consumption (consumption when disposable income is zero)\n• \\( c_1 \\) = the marginal propensity to consume (MPC), with \\( 0 < c_1 < 1 \\)\n• \\( Y_D \\) = disposable income',
        explanation: 'Example: C = 1000 + 0.6·YD.'
      },
      {
        id: "4ul67c",
        question: 'What is the marginal propensity to consume?',
        answer: 'The fraction of an extra unit of disposable income that is consumed, \\( c_1 \\). Since \\( 0 < c_1 < 1 \\), consumption rises with income but less than one-for-one (the rest is saved).'
      },
      {
        id: "1wt3bn",
        question: 'What is disposable income?',
        answer: 'Income left to households after taxes and transfers:\n\\( Y_D = Y - T \\)\nSubstituting into the consumption function: \\( C = c_0 + c_1 (Y - T) \\).'
      },
      {
        id: "fhz7nt",
        question: 'What is the equilibrium condition in the goods market?',
        answer: 'Production equals demand:\n\\( Y = Z \\), where \\( Z = C + I + G \\) (closed economy, X = IM = 0).\nBecause firms supply whatever is demanded, demand determines output.'
      },
      {
        id: "ch4u6h",
        question: 'What is the equilibrium-output formula?',
        answer: 'Solving \\( Y = c_0 + c_1(Y - T) + I + G \\):\n\\( Y = \\dfrac{1}{1 - c_1}\\,[\\,c_0 + I + G - c_1 T\\,] \\)\nThe bracket is autonomous spending; the front factor is the multiplier.'
      },
      {
        id: "putiz9",
        question: 'What is the multiplier?',
        answer: '\\( \\text{multiplier} = \\dfrac{1}{1 - c_1} \\)\nSince \\( 0 < c_1 < 1 \\), the multiplier is greater than 1: a one-unit rise in autonomous spending raises output by more than one unit. A higher MPC (or a lower MPC to save) makes the multiplier larger.'
      },
      {
        id: "t1hduh",
        question: 'Why is the effect of autonomous spending greater than one-to-one?',
        answer: 'A rise in spending raises output and income; the extra income raises consumption by \\( c_1 \\); that raises output again, and so on. The geometric series \\( 1 + c_1 + c_1^2 + \\cdots = \\dfrac{1}{1-c_1} \\).'
      },
      {
        id: "yrgn7b",
        question: 'Which variables are endogenous vs. exogenous in the goods-market model?',
        answer: 'Endogenous (determined inside the model): output Y, consumption C, disposable income.\nExogenous / policy instruments: government spending G, taxes T (political decisions); investment I is taken as given (simplification).'
      },
      {
        id: "sdp527",
        question: 'What is autonomous spending?',
        answer: 'The part of demand that does NOT depend on current income: \\( c_0 + I + G - c_1 T \\). It is the constant term the multiplier acts on.'
      }
    ],

    quiz: [
      {
        id: "fh0o75",
        question: 'In C = c₀ + c₁·YD, the term c₁ is the:',
        options: ['Autonomous consumption', 'Marginal propensity to consume', 'Tax rate', 'Interest rate'],
        correct: 1
      },
      {
        id: "hqifl3",
        question: 'Disposable income is:',
        options: ['Y + T', 'Y − T', 'Y × T', 'C − T'],
        correct: 1
      },
      {
        id: "1jw2th",
        question: 'Goods-market equilibrium requires:',
        options: ['Saving = 0', 'Production Y = demand Z', 'C = I', 'G = T'],
        correct: 1
      },
      {
        id: "akivm4",
        question: 'If c₁ = 0.75, the multiplier 1/(1−c₁) equals:',
        options: ['0.75', '1.33', '4', '5'],
        correct: 2
      },
      {
        id: "kuqo7w",
        question: 'With C = 250 + 0.75·YD, an increase in G of 100 raises equilibrium output by:',
        options: ['100', '250', '400', '1000'],
        correct: 2
      },
      {
        id: "nw7ivy",
        question: 'The multiplier is greater than 1 because:',
        options: ['Taxes are zero', '0 < c₁ < 1, so 1/(1−c₁) > 1', 'Investment is endogenous', 'Prices are flexible'],
        correct: 1
      },
      {
        id: "20l5rn",
        question: 'An increase in the marginal propensity to consume makes the multiplier:',
        options: ['Smaller', 'Larger', 'Unchanged', 'Negative'],
        correct: 1
      },
      {
        id: "onydec",
        question: 'In the simple goods-market model, which is a policy instrument (exogenous)?',
        options: ['Output Y', 'Consumption C', 'Government spending G', 'Disposable income'],
        correct: 2
      },
      {
        id: "xpz5l4",
        question: 'When disposable income is zero, consumption equals:',
        options: ['Zero', 'c₀ (autonomous consumption)', 'c₁', 'G'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "zffmat", sentence: 'In the consumption function, c₀ is _______ consumption.', answer: 'autonomous' },
      { id: "86klai", sentence: 'The marginal propensity to consume is denoted c_______.', answer: '1' },
      { id: "vomr80", sentence: 'Disposable income equals income Y minus _______.', answer: 'taxes' },
      { id: "vqh49k", sentence: 'Goods-market equilibrium requires production Y to equal _______.', answer: 'demand' },
      { id: "tljms7", sentence: 'The multiplier equals 1 divided by (1 minus _______).', answer: 'c1' },
      { id: "95stny", sentence: 'If c₁ = 0.75 the multiplier equals _______.', answer: '4' },
      { id: "y5ess2", sentence: 'A higher marginal propensity to consume makes the multiplier _______.', answer: 'larger' },
      { id: "yzx39c", sentence: 'Government spending G and taxes T are _______ variables (policy instruments).', answer: 'exogenous' }
    ],

    learn: {
      id: "xwbi2d",
      content:
        '<h3>The big question of the short run: what sets the level of output?</h3>' +
        '<p>Over a few quarters, prices and wages barely move ("sticky prices"), and firms are willing to supply whatever quantity is demanded. So in the short run a single force drives output: <strong>aggregate demand</strong>. If people and firms want to buy more, more gets produced; if demand falls, output falls (the dominant cause of recessions). The goods-market model makes this precise.</p>' +
        '<p>Demand has four components — \\( Z = C + I + G + (X - IM) \\) — but to see the mechanism clearly we start with a <strong>closed economy</strong> (no trade, \\(X = IM = 0\\)), so \\( Z = C + I + G \\). The open-economy version comes back in the Open Economy topic.</p>' +

        '<h3>Consumption: the engine of demand</h3>' +
        '<p>Consumption \\(C\\) is by far the largest piece of demand (around two-thirds of GDP), and what mainly drives it is <strong>disposable income</strong> \\(Y_D\\) — income left after taxes and transfers, \\(Y_D = Y - T\\). The <strong>consumption function</strong> captures this:</p>' +
        '<div class="formula-box">\\[ C = c_0 + c_1 Y_D, \\qquad Y_D = Y - T \\]</div>' +
        '<ul>' +
        '<li>\\(c_0\\) — <strong>autonomous consumption</strong>: what households consume even at zero disposable income (drawing on savings or borrowing). It captures confidence and other non-income influences.</li>' +
        '<li>\\(c_1\\) — the <strong>marginal propensity to consume (MPC)</strong>: the fraction of each extra unit of disposable income that is spent, with \\(0 < c_1 < 1\\).</li>' +
        '</ul>' +
        '<p><strong>Intuition:</strong> when you earn one extra euro you spend part of it (\\(c_1\\)) and save the rest (\\(1 - c_1\\), the marginal propensity to save). So consumption rises with income, but <em>less than one-for-one</em> — that single fact is what later gives the multiplier its size.</p>' +

        '<h3>Equilibrium: production equals demand</h3>' +
        '<p>Because firms produce to meet demand, the goods market is in equilibrium when output equals the demand for goods, \\( Y = Z \\). Substituting consumption (and treating investment \\(I\\), spending \\(G\\) and taxes \\(T\\) as given) :</p>' +
        '<div class="formula-box">\\[ Y = c_0 + c_1(Y - T) + I + G \\]</div>' +
        '<p>This equation is a little subtle: \\(Y\\) appears on <em>both</em> sides, because income determines consumption, which is itself part of demand, which determines income. Solving for \\(Y\\) untangles the loop:</p>' +
        '<div class="formula-box">\\[ Y = \\underbrace{\\frac{1}{1 - c_1}}_{\\text{multiplier}}\\; \\underbrace{\\big[\\,c_0 + I + G - c_1 T\\,\\big]}_{\\text{autonomous spending}} \\]</div>' +
        '<p>The bracket is <strong>autonomous spending</strong> — the part of demand that does <em>not</em> depend on current income. The fraction in front is the <strong>multiplier</strong>.</p>' +

        '<h3>The multiplier: why a small push moves output a lot</h3>' +
        '<p>The multiplier \\( \\dfrac{1}{1-c_1} \\) is greater than 1 (since \\(0<c_1<1\\)), so any change in autonomous spending changes output by <em>more</em> than itself:</p>' +
        '<div class="formula-box">\\[ \\Delta Y = \\frac{1}{1 - c_1}\\times \\Delta(\\text{autonomous spending}) \\]</div>' +
        '<p><strong>Why more than one-to-one?</strong> Trace the chain. Extra spending of 1 raises output and income by 1; that extra income raises consumption by \\(c_1\\); the new spending raises income again, lifting consumption by \\(c_1^2\\); and so on. The rounds form a geometric series:</p>' +
        '<div class="formula-box">\\[ 1 + c_1 + c_1^2 + c_1^3 + \\cdots = \\frac{1}{1 - c_1} \\]</div>' +
        '<p><strong>Interpretation:</strong> a higher MPC means each round leaks less into saving, so the chain runs longer and the multiplier is <em>larger</em>. (In the real world, taxes and imports leak demand out of the loop and shrink the multiplier — we add those later.)</p>' +

        '<div class="example-box">' +
        '<h4>Worked example 1 — the multiplier in action</h4>' +
        '<p>Let \\( C = 250 + 0.75\\,Y_D \\), so the MPC is \\(c_1 = 0.75\\). The multiplier is</p>' +
        '<div class="formula-box">\\[ \\frac{1}{1 - 0.75} = \\frac{1}{0.25} = 4 \\]</div>' +
        '<p>A fiscal stimulus of \\( \\Delta G = 100 \\) therefore raises equilibrium output by</p>' +
        '<div class="formula-box">\\[ \\Delta Y = 4 \\times 100 = 400 \\]</div>' +
        '<p>The initial 100 of spending ultimately generates 400 of output — the extra 300 comes from the induced consumption rounds.</p>' +
        '</div>' +

        '<div class="example-box">' +
        '<h4>Worked example 2 — computing equilibrium output</h4>' +
        '<p>Given \\( C = 500 + 0.5\\,Y_D,\\; T = 600,\\; I = 300,\\; G = 2000 \\). First the multiplier is \\( \\tfrac{1}{1-0.5} = 2 \\); then:</p>' +
        '<div class="formula-box">\\[ Y = \\frac{1}{1-0.5}\\,[\\,500 + 300 + 2000 - 0.5(600)\\,] = 2 \\times 2500 = 5000 \\]</div>' +
        '<p><strong>Check the logic:</strong> notice taxes enter as \\(-c_1 T\\), not \\(-T\\). A tax only reduces demand through the part of income households would have <em>spent</em> (\\(c_1\\)); the part they would have saved never affected demand. This is why a tax cut is a weaker stimulus than an equal rise in \\(G\\).</p>' +
        '</div>' +

        '<div class="warning-box">' +
        '<h4>Common pitfalls</h4>' +
        '<ul>' +
        '<li>The multiplier uses \\(c_1\\) (the MPC), <em>not</em> the tax rate or the interest rate.</li>' +
        '<li>Government spending \\(G\\) and taxes \\(T\\) are <strong>exogenous</strong> policy choices; output \\(Y\\), consumption \\(C\\) and disposable income are <strong>endogenous</strong> (determined inside the model).</li>' +
        '<li>This is a <em>short-run, demand-driven</em> story. It does not describe the long run, where supply (capital, technology) sets output.</li>' +
        '</ul>' +
        '</div>',
      image: null
    }
  },

  financialMarkets: {
    id: "4rdbc9",
    name: 'Financial Markets & Money',
    icon: 'fa-money-bill-trend-up',
    color: '#fbbf24',

    flashcards: [
      {
        id: "qla3n9",
        question: 'What is money in this model?',
        answer: 'Money = currency (cash) + checkable deposits — the financial asset that can be used directly to buy goods. The alternative is bonds, which pay interest but cannot be spent directly.'
      },
      {
        id: "bgki6x",
        question: 'What determines the demand for money?',
        answer: 'The demand for money \\( M^d = \\$Y \\cdot L(i) \\) depends on:\n• the level of transactions, proportional to nominal income \\( \\$Y \\) (more income → more money demanded)\n• the interest rate \\( i \\) (higher i → less money demanded, because bonds become more attractive).'
      },
      {
        id: "eizsun",
        question: 'Why does the money-demand curve slope downward in i?',
        answer: 'The interest rate is the opportunity cost of holding money (instead of interest-bearing bonds). The higher the interest rate, the less money people want to hold. An increase in income shifts the whole curve to the right.'
      },
      {
        id: "pb8gma",
        question: 'What is the money supply, and how is the interest rate determined?',
        answer: 'The money supply \\( M^s = M \\) is set by the central bank and is independent of the interest rate (a vertical line). Equilibrium is where supply meets demand:\n\\( M^s = M^d \\;\\Rightarrow\\; M = \\$Y\\,L(i) \\) — this pins down the equilibrium interest rate.'
      },
      {
        id: "xeq9hf",
        question: 'How are bond prices and the interest rate related?',
        answer: 'Inversely. For a one-year bond of nominal value 100 bought at price \\( P_B \\):\n\\( i = \\dfrac{100 - P_B}{P_B} \\)\nThe higher the bond’s price, the lower its yield (interest rate).'
      },
      {
        id: "04x3th",
        question: 'What are open-market operations?',
        answer: 'The central bank changes the money supply by trading (short-term government) bonds:\n• Buys bonds → raises bond demand → bond prices up → interest rate DOWN → money supply UP (expansionary).\n• Sells bonds → bond prices down → interest rate UP → money supply DOWN (contractionary).'
      },
      {
        id: "4604j2",
        question: 'What does expansionary vs. contractionary monetary policy do to i?',
        answer: '• Expansionary: CB increases M (buys bonds) → interest rate falls.\n• Contractionary: CB decreases M (sells bonds) → interest rate rises.'
      },
      {
        id: "pgmg32",
        question: 'What happens to the equilibrium interest rate when income rises?',
        answer: 'A rise in income increases money demand (shifts M^d right). With money supply fixed, the equilibrium interest rate RISES. (This relationship becomes the upward-sloping LM curve.)'
      }
    ],

    quiz: [
      {
        id: "2qui9x",
        question: 'Money in this model is defined as:',
        options: ['Bonds only', 'Currency + checkable deposits', 'All financial wealth', 'Stocks and shares'],
        correct: 1
      },
      {
        id: "qblyvp",
        question: 'The demand for money increases when:',
        options: ['The interest rate rises', 'Income rises', 'Bond prices fall', 'Taxes rise'],
        correct: 1
      },
      {
        id: "673i41",
        question: 'The money-demand curve slopes downward because a higher interest rate:',
        options: ['Raises income', 'Raises the opportunity cost of holding money', 'Lowers bond prices forever', 'Raises the money supply'],
        correct: 1
      },
      {
        id: "99mqro",
        question: 'The money supply curve is:',
        options: ['Upward-sloping', 'Vertical (set by the central bank)', 'Downward-sloping', 'Horizontal'],
        correct: 1
      },
      {
        id: "hd3sw0",
        question: 'When the central bank BUYS bonds, the interest rate:',
        options: ['Rises', 'Falls', 'Is unchanged', 'Becomes negative'],
        correct: 1
      },
      {
        id: "dx3912",
        question: 'The relationship between bond prices and the interest rate is:',
        options: ['Direct (positive)', 'Inverse (negative)', 'There is none', 'Always one-to-one'],
        correct: 1
      },
      {
        id: "al7ij3",
        question: 'With money demand M = Y(0.4 − i), Y = 150 and money supply = 50, the equilibrium interest rate is about:',
        options: ['6.7%', '40%', '33%', '0.4%'],
        correct: 0
      },
      {
        id: "7ya4nt",
        question: 'Contractionary monetary policy means the central bank:',
        options: ['Buys bonds and lowers i', 'Sells bonds and raises i', 'Buys bonds and raises i', 'Cuts taxes'],
        correct: 1
      },
      {
        id: "v1ezvs",
        question: 'An increase in income (with fixed money supply) makes the equilibrium interest rate:',
        options: ['Fall', 'Rise', 'Stay the same', 'Become zero'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "o0y8em", sentence: 'Money equals currency plus checkable _______.', answer: 'deposits' },
      { id: "cvhasp", sentence: 'The demand for money rises with the level of _______.', answer: 'income' },
      { id: "shl7fj", sentence: 'The money-demand curve slopes downward in the _______ rate.', answer: 'interest' },
      { id: "ng3q6o", sentence: 'The money supply is set by the _______ bank.', answer: 'central' },
      { id: "0t26gc", sentence: 'When the central bank buys bonds, the interest rate _______.', answer: 'falls' },
      { id: "i5bljq", sentence: 'Bond prices and the interest rate are related _______.', answer: 'inversely' },
      { id: "2uz7nv", sentence: 'Selling bonds is _______ monetary policy.', answer: 'contractionary' },
      { id: "fvxqsg", sentence: 'Equilibrium in the money market is where money supply equals money _______.', answer: 'demand' }
    ],

    learn: {
      id: "8iklan",
      content:
        '<h3>The other half of the short run: where the interest rate is born</h3>' +
        '<p>The goods-market model took the interest rate as given. But the interest rate is one of our four key variables, and it has enormous influence on investment and spending. So we now ask: <em>what determines the interest rate?</em> The answer comes from the financial market, using the same supply-and-demand logic as any other market — except the "good" being traded is <strong>money</strong> itself, and its price is the interest rate.</p>' +

        '<h3>Money vs. bonds: the portfolio choice</h3>' +
        '<p>Imagine you have some financial wealth. You can hold it in two broad forms:</p>' +
        '<ul>' +
        '<li><strong>Money</strong> (currency + checkable deposits) — instantly spendable, but pays little or no interest.</li>' +
        '<li><strong>Bonds</strong> (and similar interest-bearing assets) — pay a return, but cannot be used directly to buy goods.</li>' +
        '</ul>' +
        '<p>The <strong>demand for money</strong> is the decision of how much wealth to keep in spendable form. It depends on two things — how much you transact, and how costly it is to hold money instead of bonds:</p>' +
        '<div class="formula-box">\\[ M^d = \\$Y \\cdot L(i) \\]</div>' +
        '<ul>' +
        '<li>It rises with the <strong>level of transactions</strong>, proportional to nominal income \\(\\$Y\\) (more income and spending → you need more money on hand).</li>' +
        '<li>It falls with the <strong>interest rate</strong> \\(i\\), which is the <em>opportunity cost</em> of holding money rather than interest-bearing bonds.</li>' +
        '</ul>' +
        '<p>So the \\(M^d\\) curve slopes <strong>downward</strong> in \\(i\\), and a rise in income shifts the whole curve to the <strong>right</strong>.</p>' +

        '<h3>Equilibrium: the interest rate that clears the money market</h3>' +
        '<p>The <strong>money supply</strong> \\(M^s = M\\) is set by the central bank and does not depend on the interest rate — a vertical line. The interest rate then adjusts until people are willing to hold exactly the money that exists:</p>' +
        '<div class="formula-box">\\[ M^s = M^d \\quad\\Longrightarrow\\quad M = \\$Y\\,L(i) \\]</div>' +
        '<div class="example-box">' +
        '<h4>Worked example — equilibrium interest rate</h4>' +
        '<p>Let money demand be \\( M^d = Y(0.4 - i) \\) with income \\( Y = 150 \\) and a money supply \\( M^s = 50 \\). Set supply equal to demand and solve for \\(i\\):</p>' +
        '<div class="formula-box">\\[ 50 = 150\\,(0.4 - i) \\;\\Rightarrow\\; 0.4 - i = \\tfrac{50}{150} = \\tfrac{1}{3} \\;\\Rightarrow\\; i \\approx 0.067 = 6.7\\% \\]</div>' +
        '<p><strong>Interpretation:</strong> at 6.7% people are content to hold the 50 of money in existence. If the central bank printed more money, \\(i\\) would have to <em>fall</em> to persuade them to hold it; if income rose, money demand would rise and \\(i\\) would climb.</p>' +
        '</div>' +

        '<h3>How the central bank actually moves the rate</h3>' +
        '<p>The central bank does not "set" the interest rate by decree — it changes the <strong>money supply</strong> by buying and selling government bonds (<strong>open-market operations</strong>). The link runs through bond prices, which move <em>inversely</em> to the interest rate. For a one-year bond of face value 100 bought at price \\(P_B\\):</p>' +
        '<div class="formula-box">\\[ i = \\frac{100 - P_B}{P_B} \\]</div>' +
        '<p>The higher the price you pay today, the smaller your return — so a higher bond price means a lower interest rate.</p>' +
        '<div class="tip-box">' +
        '<h4>The two policy levers</h4>' +
        '<ul>' +
        '<li><strong>Expansionary:</strong> the central bank <em>buys</em> bonds → bond demand and prices rise → \\(i\\) falls → money supply rises.</li>' +
        '<li><strong>Contractionary:</strong> the central bank <em>sells</em> bonds → prices fall → \\(i\\) rises → money supply falls.</li>' +
        '</ul>' +
        '<p>One more result will matter enormously next: a rise in income raises money demand and pushes the equilibrium interest rate <strong>up</strong>. That positive link between output and the interest rate is exactly the <strong>LM curve</strong> of the IS-LM model.</p>' +
        '</div>',
      image: null
    }
  },

  isLmModel: {
    id: "44qrd8",
    name: 'The IS-LM Model',
    icon: 'fa-arrows-to-dot',
    color: '#f59e0b',

    flashcards: [
      {
        id: "uqfj3e",
        question: 'What is the IS-LM model?',
        answer: 'A single framework that puts the GOODS market (the IS relation) and the FINANCIAL/money market (the LM relation) on one graph (output Y on the horizontal axis, interest rate i on the vertical), to find the short-run equilibrium and analyse economic policy.'
      },
      {
        id: "wojpcv",
        question: 'What is the IS curve?',
        answer: 'The IS curve represents goods-market equilibrium when investment depends on the interest rate:\n\\( Y = C(Y - T) + I(Y, i) + G \\)\nIt is DOWNWARD sloping: a higher interest rate reduces investment, hence demand and output.'
      },
      {
        id: "p3ohm7",
        question: 'What shifts the IS curve?',
        answer: 'A change in anything (other than i) that affects demand:\n• Increase in G, C, or I, or a DECREASE in T → IS shifts RIGHT.\n• Decrease in G, C, or I, or an INCREASE in T → IS shifts LEFT.'
      },
      {
        id: "9a93k9",
        question: 'What is the LM curve?',
        answer: 'The LM curve represents financial-market (money-market) equilibrium:\n\\( \\dfrac{M}{P} = Y\\,L(i) \\)\nIt is UPWARD sloping: a higher income raises money demand, which raises the interest rate.'
      },
      {
        id: "566h5i",
        question: 'What shifts the LM curve?',
        answer: 'A change in the (real) money supply:\n• Increase in M → LM shifts DOWN/right (lower i at each Y).\n• Decrease in M → LM shifts UP/left (higher i at each Y).\nIncome does NOT shift LM — it is a movement along it.'
      },
      {
        id: "jmuggp",
        question: 'How does FISCAL policy work in IS-LM?',
        answer: 'Fiscal expansion (increase G / transfers, or cut T) shifts IS RIGHT → output UP and interest rate UP.\nFiscal contraction (cut G, raise T) shifts IS LEFT → output DOWN and interest rate DOWN.'
      },
      {
        id: "akd6sr",
        question: 'How does MONETARY policy work in IS-LM?',
        answer: 'Monetary expansion (increase M) shifts LM DOWN → output UP and interest rate DOWN.\nMonetary contraction (decrease M) shifts LM UP → output DOWN and interest rate UP.'
      },
      {
        id: "57w214",
        question: 'What is a policy mix?',
        answer: 'The combined use of fiscal and monetary policy. Because they push the interest rate in opposite or reinforcing directions, a mix lets policymakers target output and the interest rate together (e.g. fiscal expansion + monetary expansion to boost output while keeping i from rising).'
      },
      {
        id: "o9fgfr",
        question: 'According to Table 5-1, what does an INCREASE in the money supply do?',
        answer: 'It shifts LM down (IS unchanged) → output rises and the interest rate falls. (An increase in government spending, by contrast, shifts IS right → output up and interest rate up.)'
      }
    ],

    quiz: [
      {
        id: "7deyld",
        question: 'The IS curve represents equilibrium in the:',
        options: ['Money market', 'Goods market', 'Labour market', 'Foreign-exchange market'],
        correct: 1
      },
      {
        id: "xulcuy",
        question: 'The IS curve is downward-sloping because a higher interest rate:',
        options: ['Raises investment and output', 'Reduces investment, demand and output', 'Raises the money supply', 'Lowers taxes'],
        correct: 1
      },
      {
        id: "q62hbi",
        question: 'An increase in government spending shifts the IS curve:',
        options: ['Left', 'Right', 'It does not move', 'Down'],
        correct: 1
      },
      {
        id: "eqyba9",
        question: 'The LM curve represents equilibrium in the:',
        options: ['Goods market', 'Money/financial market', 'Bond market only', 'Labour market'],
        correct: 1
      },
      {
        id: "cjrjt1",
        question: 'The LM curve is upward-sloping because a higher income:',
        options: ['Lowers money demand', 'Raises money demand and the interest rate', 'Shifts the IS curve', 'Lowers prices'],
        correct: 1
      },
      {
        id: "fzm9l9",
        question: 'An increase in the money supply shifts the LM curve:',
        options: ['Up/left', 'Down/right', 'It does not move', 'Vertical'],
        correct: 1
      },
      {
        id: "9z324r",
        question: 'A fiscal contraction (higher taxes) leads to:',
        options: ['Higher output and interest rate', 'Lower output and lower interest rate', 'Higher output, lower rate', 'No change'],
        correct: 1
      },
      {
        id: "407h5f",
        question: 'Monetary expansion (increase in M) results in:',
        options: ['Output up, interest rate down', 'Output down, interest rate up', 'Output up, interest rate up', 'Output down, interest rate down'],
        correct: 0
      },
      {
        id: "44fh2j",
        question: 'Using fiscal and monetary policy together is called a:',
        options: ['Liquidity trap', 'Policy mix', 'Tariff', 'Trade balance'],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "w18glg", sentence: 'The IS curve represents equilibrium in the _______ market.', answer: 'goods' },
      { id: "ff5zit", sentence: 'The IS curve slopes downward because higher interest rates reduce _______.', answer: 'investment' },
      { id: "3u7fh2", sentence: 'An increase in government spending shifts the IS curve to the _______.', answer: 'right' },
      { id: "ginidp", sentence: 'The LM curve represents equilibrium in the _______ market.', answer: 'money' },
      { id: "w421q2", sentence: 'The LM curve slopes _______ in the (Y, i) diagram.', answer: 'upward' },
      { id: "b6x8x6", sentence: 'An increase in the money supply shifts the LM curve _______.', answer: 'down' },
      { id: "i90bw9", sentence: 'A fiscal expansion raises output and raises the _______ rate.', answer: 'interest' },
      { id: "mhzbad", sentence: 'Using fiscal and monetary policy together is called a policy _______.', answer: 'mix' }
    ],

    learn: {
      id: "x2dnkv",
      content:
        '<h3>Bringing the two markets together</h3>' +
        '<p>So far we have two separate short-run models: the <strong>goods market</strong> (which set output, taking the interest rate as given) and the <strong>financial market</strong> (which set the interest rate, taking income as given). But output and the interest rate clearly affect each other — higher income raises the interest rate; a higher interest rate lowers investment and output. The <strong>IS-LM model</strong> resolves this two-way dependence by putting both markets on a single diagram, with output \\(Y\\) on the horizontal axis and the interest rate \\(i\\) on the vertical. The economy settles where the two curves cross.</p>' +

        '<h3>The IS curve — equilibrium in the goods market</h3>' +
        '<p>We now drop the simplification that investment is fixed and let it depend (negatively) on the interest rate. Goods-market equilibrium becomes:</p>' +
        '<div class="formula-box">\\[ Y = C(Y - T) + I(Y, i) + G \\]</div>' +
        '<p><strong>Why it slopes down:</strong> a higher interest rate \\(i\\) makes borrowing dearer, so investment \\(I\\) falls; lower investment means lower demand, and lower demand (through the multiplier) means lower output \\(Y\\). High \\(i\\) ↔ low \\(Y\\): the IS curve slopes <strong>downward</strong>.</p>' +
        '<p><strong>What shifts it:</strong> anything that changes demand at a given interest rate. An increase in \\(G\\), \\(C\\) or \\(I\\), or a cut in \\(T\\), shifts IS to the <strong>right</strong>; the opposite shifts it <strong>left</strong>.</p>' +

        '<h3>The LM curve — equilibrium in the money market</h3>' +
        '<p>From the financial-market model, equilibrium requires the real money supply to equal real money demand:</p>' +
        '<div class="formula-box">\\[ \\frac{M}{P} = Y\\,L(i) \\]</div>' +
        '<p><strong>Why it slopes up:</strong> a higher income \\(Y\\) raises the demand for money; with a fixed money supply, the interest rate \\(i\\) must rise to restore balance. High \\(Y\\) ↔ high \\(i\\): the LM curve slopes <strong>upward</strong>.</p>' +
        '<p><strong>What shifts it:</strong> a change in the <em>money supply</em> \\(M\\). More money shifts LM <strong>down</strong> (a lower \\(i\\) at every \\(Y\\)); less money shifts it <strong>up</strong>. Note carefully: a change in income is a <em>movement along</em> the LM curve, not a shift of it.</p>' +

        '<h3>Reading economic policy off the diagram</h3>' +
        '<p>The power of IS-LM is that every policy becomes a clean prediction about the direction of output and the interest rate. The golden rule: <em>a curve moves only if a variable in its own equation changes.</em></p>' +
        '<table>' +
        '<tr><th>Policy</th><th>Shift</th><th>Output</th><th>Interest rate</th></tr>' +
        '<tr><td>Increase in taxes (T)</td><td>IS left</td><td>Down</td><td>Down</td></tr>' +
        '<tr><td>Decrease in taxes (T)</td><td>IS right</td><td>Up</td><td>Up</td></tr>' +
        '<tr><td>Increase in spending (G)</td><td>IS right</td><td>Up</td><td>Up</td></tr>' +
        '<tr><td>Decrease in spending (G)</td><td>IS left</td><td>Down</td><td>Down</td></tr>' +
        '<tr><td>Increase in money (M)</td><td>LM down</td><td>Up</td><td>Down</td></tr>' +
        '<tr><td>Decrease in money (M)</td><td>LM up</td><td>Down</td><td>Up</td></tr>' +
        '</table>' +
        '<p>Notice the tell-tale signatures: a <strong>fiscal expansion</strong> raises output <em>and</em> the interest rate (it works on IS), whereas a <strong>monetary expansion</strong> raises output but <em>lowers</em> the interest rate (it works on LM). That difference is how you identify which policy was used just from what happened to \\(Y\\) and \\(i\\).</p>' +

        '<div class="tip-box">' +
        '<h4>The policy mix</h4>' +
        '<p>Because fiscal expansion pushes \\(i\\) <em>up</em> while monetary expansion pushes it <em>down</em>, the two can be combined into a deliberate <strong>policy mix</strong> — for example, a fiscal stimulus paired with monetary easing to raise output <em>without</em> letting the interest rate spike. This is precisely the combination used in the COVID-19 crisis. The IS-LM model is the workhorse for analysing such combinations.</p>' +
        '</div>',
      image: null
    }
  }
};

// Expose on window — name MUST match data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.macroeconomicsM1 = macroeconomicsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsM1; }
