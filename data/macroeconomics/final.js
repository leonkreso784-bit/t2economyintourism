// ===== MACROECONOMICS — Final Exam (hybrid) =====
// Same pattern as Microeconomics/Statistics/Marketing/etc. finals: the final lesson
// MERGES both midterms and adds one curated cross-topic "Exam Practice" category.
//   macroeconomicsFinal = Object.assign({}, macroeconomicsM1 (K1: Intro + L2–L5),
//                                        macroeconomicsM2 (K2: Ch6 + AS-AD + Long Run + Expectations + Open Economy),
//                                        { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.macroeconomicsM1 and window.macroeconomicsM2 at module-load time.
//
// K1 (7 topic cats) + K2 (6 topic cats) have no key collisions → 13 topic categories + examPractice = 14.
//
// ⚠ QUANTITATIVE SUBJECT — KaTeX (ADR-009). Inline "\\( ... \\)", display "\\[ ... \\]";
//   a single `$` is NEVER used (currency).

const macroeconomicsExamPractice = {
  name: 'Exam Practice (All Topics)',
  icon: 'fa-graduation-cap',
  color: '#f59e0b',

  flashcards: [
    {
      question: 'What is the single thread linking the whole macro course?',
      answer: 'The same variables (Y, u, π, i) are looked at over three horizons:\n• SHORT run — output is set by DEMAND (Goods, Financial, IS-LM markets).\n• MEDIUM run — output returns to its NATURAL level set by SUPPLY (the labour market, AS-AD).\n• LONG run — the natural level itself GROWS through capital, human capital and technology.',
      explanation: 'Demand moves output around a supply-determined trend that itself grows over time.'
    },
    {
      question: 'Collect the key equilibrium conditions of the course in one place.',
      answer: 'Goods market: \\( Y = Z \\). Money market: \\( M^s = M^d \\). IS-LM: IS \\(\\cap\\) LM. Labour market: \\( F(u_n,z)=\\dfrac{1}{1+\\mu} \\). Medium run: \\( P=P^e \\Rightarrow Y=Y_n \\). Open economy / external balance: trade balance = net capital flows (BP = 0).'
    },
    {
      question: 'Three ways to express GDP — and the expenditure identity.',
      answer: 'Production = expenditure = income (all equal). The expenditure identity is\n\\( Y = C + I + G + (X - IM) \\),\nand the saving–investment identity is \\( S - I = (G + TR - T) + NX \\).'
    },
    {
      question: 'How do you compute the multiplier in the closed and the open economy?',
      answer: 'Closed: \\( \\dfrac{1}{1 - c_1} \\). Open (with tax rate t and marginal propensity to import m): \\( \\dfrac{1}{1 - \\beta(1-t) + m} \\). Both taxes and imports SHRINK the multiplier because they leak demand out of the income–spending loop.'
    },
    {
      question: 'How do fiscal and monetary policy each move output and the interest rate (IS-LM)?',
      answer: 'Fiscal expansion (↑G or ↓T) shifts IS right → \\(Y\\uparrow,\\ i\\uparrow\\). Monetary expansion (↑M) shifts LM down → \\(Y\\uparrow,\\ i\\downarrow\\). A policy mix combines them to hit both output and the interest rate.'
    },
    {
      question: 'How is the medium-run equilibrium reached after a demand boom?',
      answer: 'A demand boom pushes \\(Y > Y_n\\), so \\(u < u_n\\); wages and prices rise above expectations (\\(P > P^e\\)). Expectations adjust up, the AS curve shifts up, and output falls back to \\(Y_n\\) at a higher price level. Demand affects output only temporarily.'
    },
    {
      question: 'What determines the natural rate of unemployment and the natural level of output?',
      answer: 'From wage setting \\(=\\) price setting: \\( F(u_n,z)=\\dfrac{1}{1+\\mu} \\Rightarrow u_n = 1 - \\dfrac{1}{1+\\mu} + z \\). Then \\( Y_n = L(1-u_n) \\). A higher markup μ or higher z (benefits/protection) raises \\(u_n\\) and lowers \\(Y_n\\).'
    },
    {
      question: 'What ultimately drives long-run growth, and why is capital not enough?',
      answer: 'Capital accumulation (saving) raises the LEVEL of output per worker, but diminishing returns mean its contribution to the long-run growth rate is zero. SUSTAINED growth requires sustained TECHNOLOGICAL PROGRESS (R&D, human capital).'
    },
    {
      question: 'Why is the real interest rate the one that matters, and how is it found?',
      answer: 'Decisions depend on the purchasing-power cost of borrowing/saving, not the money cost. \\( r \\approx i - \\pi^e \\). Expectations of future income, profits and real rates shift the IS curve — optimism raises current output.'
    },
    {
      question: 'How does an open economy change the picture (exchange rate, NX, BoP)?',
      answer: 'Output equals demand for domestic goods \\( Y = C + I + G + NX \\), \\(NX = X - IM\\). A real depreciation raises NX if Marshall-Lerner holds; higher domestic output or a real appreciation lowers NX. The balance of payments (current + financial account) must balance: a current-account deficit is financed by capital inflows.'
    },
    {
      question: 'Why is the tourism (travel) balance central for a country like Croatia?',
      answer: 'Travel = income from foreign tourists (export/inflow) − spending of residents abroad (import/outflow). A surplus marks a tourist-receptive country. For Croatia, the large travel surplus typically offsets the persistent goods-trade deficit, supporting the current account.'
    },
    {
      question: 'Connect Okun’s law and the Phillips curve to the rest of the model.',
      answer: 'Okun’s law links output growth to changes in unemployment (above-trend growth lowers u). The Phillips curve links low unemployment to higher inflation. Together they tie the demand side (Y) to the labour market (u) and to prices (π) — the same chain the AS curve formalizes.'
    }
  ],

  quiz: [
    {
      question: 'Over the three horizons, output is determined by demand in the:',
      options: ['Long run', 'Short run', 'Medium run', 'Never'],
      correct: 1
    },
    {
      question: 'The expenditure identity for GDP is:',
      options: ['Y = C − I − G', 'Y = C + I + G + (X − IM)', 'Y = S + T', 'Y = F(K, N)'],
      correct: 1
    },
    {
      question: 'Compared with the closed economy, the open-economy multiplier is:',
      options: ['Larger', 'Smaller', 'The same', 'Always 1'],
      correct: 1
    },
    {
      question: 'A fiscal expansion in the IS-LM model moves output and the interest rate:',
      options: ['Both down', 'Output up, interest rate up', 'Output up, interest rate down', 'Both unchanged'],
      correct: 1
    },
    {
      question: 'After a demand boom, the economy returns to Yₙ because:',
      options: ['The money supply falls automatically', 'Prices rise above expectations, expectations adjust and AS shifts up', 'Taxes rise', 'The markup falls'],
      correct: 1
    },
    {
      question: 'The natural rate of unemployment rises when:',
      options: ['The markup μ falls', 'Benefits z or the markup μ rise', 'Money supply rises', 'Exports rise'],
      correct: 1
    },
    {
      question: 'Sustained long-run growth in output per worker requires:',
      options: ['More saving only', 'Sustained technological progress', 'Lower taxes', 'A trade surplus'],
      correct: 1
    },
    {
      question: 'The real interest rate is approximately the nominal rate minus:',
      options: ['The tax rate', 'Expected inflation', 'The markup', 'Net exports'],
      correct: 1
    },
    {
      question: 'Assuming Marshall-Lerner holds, net exports rise after a real:',
      options: ['Appreciation', 'Depreciation', 'Rise in output', 'Rise in the markup'],
      correct: 1
    },
    {
      question: 'In the travel balance, spending by foreign tourists in the country is recorded as an:',
      options: ['Import', 'Export', 'Transfer', 'Capital outflow'],
      correct: 1
    },
    {
      question: 'A current-account deficit must be financed by:',
      options: ['A bigger trade deficit', 'Capital inflows (financial account)', 'Lower GDP', 'A higher markup'],
      correct: 1
    },
    {
      question: 'In the medium run, aggregate demand determines mainly the:',
      options: ['Natural level of output', 'Price level (output returns to Yₙ)', 'Saving rate', 'Markup'],
      correct: 1
    }
  ],

  fillBlanks: [
    { sentence: 'In the short run, output is determined by aggregate _______.', answer: 'demand' },
    { sentence: 'The expenditure identity is Y = C + I + G + (X − _______).', answer: 'IM' },
    { sentence: 'Both taxes and imports _______ the size of the multiplier.', answer: 'reduce' },
    { sentence: 'A fiscal expansion shifts the IS curve to the _______.', answer: 'right' },
    { sentence: 'In medium-run equilibrium the price level equals the _______ price level.', answer: 'expected' },
    { sentence: 'A higher markup raises the _______ rate of unemployment.', answer: 'natural' },
    { sentence: 'Sustained long-run growth requires technological _______.', answer: 'progress' },
    { sentence: 'The real interest rate equals the nominal rate minus expected _______.', answer: 'inflation' },
    { sentence: 'In the travel balance, foreign tourists’ spending in the country is an _______.', answer: 'export' }
  ],

  learn: {
    content:
      '<h3>Final Exam Roadmap — the whole of macro on one page</h3>' +
      '<p>The course follows the same variables — output \\(Y\\), unemployment \\(u\\), inflation \\(\\pi\\), the interest rate \\(i\\) — across three horizons. In the <strong>short run</strong> demand rules; in the <strong>medium run</strong> output returns to a supply-determined natural level; in the <strong>long run</strong> that level grows. Drill the per-topic categories in this lesson, then use this set to connect them.</p>' +

      '<div class="formula-box">\\[ \\begin{aligned}' +
      '\\text{GDP identity:}\\quad & Y = C + I + G + (X - IM)\\\\[2pt]' +
      '\\text{Goods-market multiplier:}\\quad & \\frac{1}{1 - c_1}\\;\\; \\Big(\\text{open: } \\tfrac{1}{1-\\beta(1-t)+m}\\Big)\\\\[2pt]' +
      '\\text{Money market:}\\quad & M = \\$Y\\,L(i)\\\\[2pt]' +
      '\\text{Natural rate:}\\quad & u_n = 1 - \\frac{1}{1+\\mu} + z\\\\[2pt]' +
      '\\text{Medium run:}\\quad & P = P^e \\;\\Rightarrow\\; Y = Y_n\\\\[2pt]' +
      '\\text{Real interest rate:}\\quad & r \\approx i - \\pi^e\\\\[2pt]' +
      '\\text{External balance:}\\quad & NX = X - IM,\\;\\; BP = 0' +
      '\\end{aligned} \\]</div>' +

      '<h4>First midterm (Intro + L2–L5)</h4>' +
      '<ul>' +
      '<li><strong>Fundamentals:</strong> objectives, variables, fiscal/monetary/income policy, the three horizons.</li>' +
      '<li><strong>Unemployment &amp; inflation:</strong> \\(L = E + U\\), CPI, real vs nominal rates, Okun’s law, the Phillips curve.</li>' +
      '<li><strong>GDP:</strong> nominal/real/potential, the deflator, the GDP gap, growth rates, per capita.</li>' +
      '<li><strong>National accounts:</strong> three approaches, the models \\(Y=C+I+G+NX\\), value added, NACE.</li>' +
      '<li><strong>Goods market:</strong> \\(C = c_0 + c_1 Y_D\\), equilibrium \\(Y = Z\\), the multiplier.</li>' +
      '<li><strong>Financial markets:</strong> \\(M^d = \\$Y\\,L(i)\\), \\(M^s = M^d\\), bonds, open-market operations.</li>' +
      '<li><strong>IS-LM:</strong> IS (goods) ∩ LM (money), fiscal + monetary policy, the policy mix.</li>' +
      '</ul>' +

      '<h4>Second midterm (Ch6 + AS-AD + Long Run + Expectations + Open Economy)</h4>' +
      '<ul>' +
      '<li><strong>Labour market:</strong> WS \\(W = P^e F(u,z)\\), PS \\(P = (1+\\mu)W\\), natural rate \\(u_n\\), natural output \\(Y_n\\).</li>' +
      '<li><strong>AS-AD (medium run):</strong> AS up (labour market), AD down (IS-LM); \\(P = P^e \\Rightarrow Y = Y_n\\).</li>' +
      '<li><strong>Long run / growth:</strong> \\(Y = F(K, N)\\), diminishing returns, Solow saving, technology, human capital, convergence.</li>' +
      '<li><strong>Expectations:</strong> Fisher \\(r \\approx i - \\pi^e\\), present value, expectations in the IS relation.</li>' +
      '<li><strong>Open economy — trade:</strong> import function \\(IM = IM_0 + mY\\), open multiplier, the exchange rate, NX, Marshall-Lerner.</li>' +
      '<li><strong>Balance of payments:</strong> current + financial account, the tourism balance, \\(K = f(r)\\), the BP curve, internal/external balance.</li>' +
      '</ul>' +

      '<div class="tip-box">' +
      '<h4>Exam strategy</h4>' +
      '<p>Closed questions reward exact <strong>conditions and formulas</strong> (the multiplier, \\(u_n\\), \\(r \\approx i - \\pi^e\\), \\(NX = X - IM\\)). Open questions reward <strong>concept + mechanism</strong> ("a fiscal expansion shifts IS right → Y and i rise; in an open economy imports rise, so NX falls"). Anchor one formula per topic, then trace the chain demand → labour market → prices → external sector.</p>' +
      '</div>' +

      '<p class="highlight">One sentence for the whole course: aggregate demand moves output around a supply-determined natural level in the short and medium run, while technological progress lifts that natural level in the long run.</p>',
    image: null
  }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// No key collisions between K1 (7 cats) and K2 (6 cats) → 13 topic categories + examPractice = 14.
const macroeconomicsFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.macroeconomicsM1) ? window.macroeconomicsM1 : {},
  (typeof window !== 'undefined' && window.macroeconomicsM2) ? window.macroeconomicsM2 : {},
  { examPractice: macroeconomicsExamPractice }
);

if (typeof window !== 'undefined') { window.macroeconomicsFinal = macroeconomicsFinal; }
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(
    {},
    require('./midterm-1.js'),
    require('./midterm-2.js'),
    { examPractice: macroeconomicsExamPractice }
  );
}
