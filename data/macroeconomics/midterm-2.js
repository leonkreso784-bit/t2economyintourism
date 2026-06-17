// ===== MACROECONOMICS — 2. KOLOKVIJ (K2) =====
// Source: course lectures — Ch6 Labour Market + Ch7 AS-AD (Medium Run) +
// Ch10/11/12 The Long Run (growth) + Ch14/17 Expectations + Open Economy.
// K1/K2 boundary AUTHORITATIVE from the official Test-2 preparation decks:
// the Lecture-7 prep covers the labour market (natural rate), and the Lecture-11
// prep is entirely the OPEN ECONOMY (exchange rates, net exports, balance of payments).
//
// ⚠ QUANTITATIVE SUBJECT — uses KaTeX (ADR-009). Convention (docs/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (in a JS string: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   A single `$` is NEVER used (currency). LaTeX backslash in a string = "\\".

const macroeconomicsM2 = {
  labourMarket: {
    name: 'The Labour Market & Natural Rate',
    icon: 'fa-people-group',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'Why does the medium-run analysis start with the labour market?',
        answer: 'In the medium run, higher output → higher employment → lower unemployment → higher wages → higher production costs → higher prices. The unemployment rate is the key variable that links output Y and the price level P, and it is determined on the labour market.'
      },
      {
        question: 'What are the participation rate and the unemployment rate?',
        answer: 'Participation rate = labour force / working-age population.\nUnemployment rate \\( u = \\dfrac{U}{L} \\) = unemployed / labour force.',
        explanation: 'Discouraged workers leave the labour force, which lowers the measured participation rate.'
      },
      {
        question: 'What is the wage-setting (WS) relation?',
        answer: 'The nominal wage depends on the expected price level, the unemployment rate and a catch-all z:\n\\( W = P^e\\, F(u, z) \\)\n• higher expected prices \\(P^e\\) → higher wages\n• higher unemployment u → LOWER wages (weaker bargaining power)\n• higher z (benefits, protection, minimum wage) → higher wages'
      },
      {
        question: 'Why do wages depend on the EXPECTED price level?',
        answer: 'Because workers and firms care about the REAL wage W/P, and wages are negotiated for a future period. If a higher price level is expected, workers demand higher nominal wages and firms can grant them without losing profitability.'
      },
      {
        question: 'What are efficiency wages?',
        answer: 'Wages paid ABOVE the reservation wage to reduce turnover and raise productivity. The reservation wage is the wage that makes a worker indifferent between working and being unemployed. Firms pay more than this to keep and motivate workers.'
      },
      {
        question: 'What is the price-setting (PS) relation?',
        answer: 'With a markup μ over marginal cost (one worker produces one unit, so marginal cost = W):\n\\( P = (1 + \\mu)\\,W \\quad\\Rightarrow\\quad \\dfrac{W}{P} = \\dfrac{1}{1+\\mu} \\)\nA higher markup (more monopoly power) lowers the real wage.'
      },
      {
        question: 'How is the natural rate of unemployment determined?',
        answer: 'Set \\(P^e = P\\) so the WS real wage equals the PS real wage:\n\\( F(u_n, z) = \\dfrac{1}{1+\\mu} \\)\nThe natural rate \\(u_n\\) is the unemployment rate consistent with both relations — determined by the STRUCTURE of the labour market (z) and the product market (μ).'
      },
      {
        question: 'Using F = 1 − u + z, what is the natural rate formula?',
        answer: 'From \\( 1 - u_n + z = \\dfrac{1}{1+\\mu} \\):\n\\( u_n = 1 - \\dfrac{1}{1+\\mu} + z \\)\nA higher markup μ or higher benefits z RAISES the natural rate of unemployment.'
      },
      {
        question: 'What raises the natural rate of unemployment?',
        answer: '• An increase in the markup μ (more market power, less product-market competition).\n• An increase in z — higher unemployment benefits, stronger employment protection, a higher minimum wage (less labour-market flexibility).'
      },
      {
        question: 'What is the natural level of output?',
        answer: 'The output the economy produces when unemployment equals the natural rate. With \\(Y = N\\) and \\(N = L(1 - u_n)\\):\n\\( Y_n = L\\,(1 - u_n) \\)\nIn the short run output fluctuates AROUND this natural level.'
      }
    ],

    quiz: [
      {
        question: 'The wage-setting relation W = Pᵉ·F(u, z) says wages rise when:',
        options: ['Unemployment rises', 'The expected price level rises', 'The markup rises', 'Output falls'],
        correct: 1
      },
      {
        question: 'In the wage-setting relation, a higher unemployment rate leads to:',
        options: ['Higher wages', 'Lower wages', 'Unchanged wages', 'Higher prices'],
        correct: 1
      },
      {
        question: 'The reservation wage is the wage that makes a worker:',
        options: ['Maximally productive', 'Indifferent between working and being unemployed', 'Quit immediately', 'Accept any job'],
        correct: 1
      },
      {
        question: 'The price-setting relation P = (1 + μ)W implies a real wage of:',
        options: ['1 + μ', '1/(1 + μ)', 'μ', 'W − μ'],
        correct: 1
      },
      {
        question: 'If the markup μ = 5%, the price-setting real wage W/P is about:',
        options: ['1.05', '0.952', '0.05', '5'],
        correct: 1
      },
      {
        question: 'With W/P = 0.952 and z = 0, the natural rate of unemployment is about:',
        options: ['9.5%', '4.8%', '0.95%', '52%'],
        correct: 1
      },
      {
        question: 'An increase in unemployment benefits (z) will:',
        options: ['Lower the natural rate', 'Raise the natural rate', 'Not affect the natural rate', 'Raise the markup'],
        correct: 1
      },
      {
        question: 'In the medium run, the natural rate of unemployment is determined by:',
        options: ['Aggregate demand', 'The structure of the labour and product markets (z and μ)', 'The money supply', 'Net exports'],
        correct: 1
      },
      {
        question: 'The natural level of output is the output when:',
        options: ['Prices are zero', 'Unemployment equals the natural rate', 'Net exports are zero', 'The budget is balanced'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The wage-setting relation is W = Pᵉ·F(u, z), where wages fall as _______ rises.', answer: 'unemployment' },
      { sentence: 'Wages depend on the _______ price level because wages are set for the future.', answer: 'expected' },
      { sentence: 'A wage paid above the reservation wage to cut turnover is an _______ wage.', answer: 'efficiency' },
      { sentence: 'The price-setting relation is P = (1 + μ)W, where μ is the _______.', answer: 'markup' },
      { sentence: 'The price-setting real wage equals 1 divided by (1 + _______).', answer: 'μ' },
      { sentence: 'A higher markup _______ the natural rate of unemployment.', answer: 'raises' },
      { sentence: 'The natural rate is determined by the _______ of the labour and product markets.', answer: 'structure' },
      { sentence: 'The natural level of output corresponds to the natural rate of _______.', answer: 'unemployment' }
    ],

    learn: {
      content:
        '<h3>The medium run begins on the labour market</h3>' +
        '<p>The IS-LM model assumed fixed prices. In the medium run that breaks down: higher output lowers unemployment, which raises wages, costs and finally prices. So the <strong>unemployment rate</strong> is the bridge between output \\(Y\\) and the price level \\(P\\) — and it is set on the labour market by two relations.</p>' +

        '<h4>Wage setting (WS)</h4>' +
        '<div class="formula-box">\\[ W = P^e\\, F(u, z) \\]</div>' +
        '<p>Wages rise with the <strong>expected</strong> price level \\(P^e\\) (real wages are what matter, and wages are negotiated ahead), fall with unemployment \\(u\\) (weaker bargaining power), and rise with \\(z\\) — benefits, employment protection, the minimum wage.</p>' +

        '<h4>Price setting (PS)</h4>' +
        '<p>If one worker makes one unit of output, marginal cost is \\(W\\). Firms add a markup \\(\\mu\\):</p>' +
        '<div class="formula-box">\\[ P = (1+\\mu)\\,W \\quad\\Longrightarrow\\quad \\frac{W}{P} = \\frac{1}{1+\\mu} \\]</div>' +

        '<h4>The natural rate of unemployment</h4>' +
        '<p>The two relations describe the same real wage, so setting \\(P^e = P\\):</p>' +
        '<div class="formula-box">\\[ F(u_n, z) = \\frac{1}{1+\\mu} \\]</div>' +
        '<div class="example-box">' +
        '<h4>Worked example — natural rate</h4>' +
        '<p>Take \\(F = 1 - u + z\\) with \\(z = 0\\) and markup \\(\\mu = 5\\%\\):</p>' +
        '<div class="formula-box">\\[ \\frac{W}{P} = \\frac{1}{1.05} = 0.952, \\qquad u_n = 1 - 0.952 = 4.8\\% \\]</div>' +
        '<p>If the markup rises to 10%: \\( \\tfrac{1}{1.10} = 0.909 \\Rightarrow u_n = 9.1\\% \\). More market power → higher natural unemployment.</p>' +
        '</div>' +
        '<div class="tip-box"><h4>Natural level of output</h4><p>With \\(Y = N\\) and \\(N = L(1-u_n)\\), the <strong>natural level of output</strong> is \\(Y_n = L(1-u_n)\\). Short-run output simply fluctuates around \\(Y_n\\); the natural rate is set by structure (\\(z\\), \\(\\mu\\)), not by demand.</p></div>',
      image: null
    }
  },

  mediumRun: {
    name: 'The Medium Run: AS-AD',
    icon: 'fa-arrows-up-down',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'What is the AS-AD model?',
        answer: 'The standard framework for analysing output Y and the price level P in the short and medium run. The Aggregate Supply (AS) curve comes from the labour market; the Aggregate Demand (AD) curve comes from the IS-LM model.'
      },
      {
        question: 'How is the AS curve derived, and why does it slope up?',
        answer: 'From the labour-market relations:\n\\( P = P^e (1+\\mu)\\,F\\!\\left(1 - \\dfrac{Y}{L}, z\\right) \\)\nIt slopes UP (positive P–Y relation): higher Y → lower unemployment → higher wages → higher costs → higher prices.'
      },
      {
        question: 'What shifts the AS curve?',
        answer: 'Changes in the expected price level \\(P^e\\), the markup \\(\\mu\\), or the catch-all \\(z\\). In particular, a rise in \\(P^e\\) shifts AS up.'
      },
      {
        question: 'How is the AD curve derived, and why does it slope down?',
        answer: 'From the IS-LM model. A higher price level reduces the real money supply \\(M/P\\) → raises the interest rate → lowers investment and demand → lowers output. So the AD relation \\( Y = Y\\!\\left(\\dfrac{M}{P}, G, T\\right) \\) is DOWNWARD sloping in P.'
      },
      {
        question: 'What shifts the AD curve?',
        answer: 'Anything (other than P) that shifts IS or LM: a change in the money supply M, government spending G, or taxes T. Expansionary fiscal or monetary policy shifts AD to the right.'
      },
      {
        question: 'What is the medium-run (natural) equilibrium?',
        answer: 'When \\(P = P^e\\), unemployment equals the natural rate \\(u_n\\) and output equals the natural level \\(Y_n\\). The economy is in medium-run equilibrium; the price level has fully adjusted to expectations.'
      },
      {
        question: 'What happens when output is above the natural level (Y > Yₙ)?',
        answer: 'Low unemployment pushes wages up, so prices rise above the expected level: \\(P > P^e\\). Expectations then adjust upward, shifting AS up, and output returns toward \\(Y_n\\). (Symmetrically, \\(Y < Y_n \\Rightarrow P < P^e\\).)'
      },
      {
        question: 'In the short run vs. the medium run, what determines output?',
        answer: 'SHORT run: output is determined by aggregate demand (AD) and can differ from \\(Y_n\\).\nMEDIUM run: output returns to the natural level \\(Y_n\\), which is set by supply-side structure; demand affects only the price level.'
      }
    ],

    quiz: [
      {
        question: 'The AS curve is derived from equilibrium in the:',
        options: ['Money market', 'Goods market', 'Labour market', 'Bond market'],
        correct: 2
      },
      {
        question: 'The AS curve slopes upward because higher output leads to:',
        options: ['Lower wages and prices', 'Lower unemployment, higher wages and prices', 'A lower money supply', 'Higher taxes'],
        correct: 1
      },
      {
        question: 'The AD curve is derived from the:',
        options: ['Labour market', 'IS-LM model', 'Production function', 'Phillips curve'],
        correct: 1
      },
      {
        question: 'The AD curve slopes downward because a higher price level:',
        options: ['Raises the real money supply', 'Reduces M/P, raises i and lowers demand', 'Raises government spending', 'Lowers the markup'],
        correct: 1
      },
      {
        question: 'In medium-run equilibrium:',
        options: ['P > Pᵉ', 'P = Pᵉ and Y = Yₙ', 'Y > Yₙ', 'Unemployment is zero'],
        correct: 1
      },
      {
        question: 'If output is above the natural level (Y > Yₙ), then:',
        options: ['P < Pᵉ', 'P > Pᵉ', 'Prices do not change', 'Unemployment rises'],
        correct: 1
      },
      {
        question: 'An increase in the money supply shifts the AD curve:',
        options: ['Left', 'Right', 'It does not move', 'Vertical'],
        correct: 1
      },
      {
        question: 'In the medium run, aggregate demand affects mainly the:',
        options: ['Natural level of output', 'Price level (output returns to Yₙ)', 'Markup', 'Labour force'],
        correct: 1
      },
      {
        question: 'A rise in the expected price level shifts the AS curve:',
        options: ['Down', 'Up', 'It does not move', 'Right only'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The AS curve is derived from equilibrium in the _______ market.', answer: 'labour' },
      { sentence: 'The AS curve slopes _______ in the (Y, P) diagram.', answer: 'upward' },
      { sentence: 'The AD curve is derived from the _______ model.', answer: 'IS-LM' },
      { sentence: 'A higher price level reduces the real money supply M over _______.', answer: 'P' },
      { sentence: 'In medium-run equilibrium, the actual price level equals the _______ price level.', answer: 'expected' },
      { sentence: 'When Y exceeds Yₙ, the price level rises above the _______ level.', answer: 'expected' },
      { sentence: 'An increase in the money supply shifts the AD curve to the _______.', answer: 'right' },
      { sentence: 'In the medium run, output returns to its _______ level.', answer: 'natural' }
    ],

    learn: {
      content:
        '<h3>Putting all markets together: AS-AD</h3>' +
        '<p>The AS-AD model analyses output and prices together. <strong>Aggregate Supply</strong> comes from the labour market; <strong>Aggregate Demand</strong> comes from IS-LM.</p>' +

        '<h4>Aggregate Supply (upward)</h4>' +
        '<p>Combining wage and price setting with \\(u = 1 - Y/L\\):</p>' +
        '<div class="formula-box">\\[ P = P^e\\,(1+\\mu)\\,F\\!\\left(1 - \\frac{Y}{L},\\, z\\right) \\]</div>' +
        '<p>Higher \\(Y\\) → lower \\(u\\) → higher \\(W\\) → higher \\(P\\). AS shifts with \\(P^e\\), \\(\\mu\\), \\(z\\).</p>' +

        '<h4>Aggregate Demand (downward)</h4>' +
        '<p>A higher \\(P\\) shrinks the real money supply \\(M/P\\), raising \\(i\\) and cutting demand:</p>' +
        '<div class="formula-box">\\[ Y = Y\\!\\left(\\frac{M}{P},\\, G,\\, T\\right) \\]</div>' +
        '<p>AD shifts with \\(M\\), \\(G\\), \\(T\\) — i.e. with monetary and fiscal policy.</p>' +

        '<div class="tip-box">' +
        '<h4>Short run vs. medium run</h4>' +
        '<p>In <strong>medium-run equilibrium</strong> \\(P = P^e\\), so \\(u = u_n\\) and \\(Y = Y_n\\). In the short run, demand can push \\(Y\\) away from \\(Y_n\\): if \\(Y > Y_n\\) then \\(P > P^e\\), expectations rise, AS shifts up and output returns to \\(Y_n\\). <strong>Demand determines the short run; supply (structure) determines the medium run.</strong></p>' +
        '</div>',
      image: null
    }
  },

  longRun: {
    name: 'The Long Run: Growth',
    icon: 'fa-seedling',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is the difference between the short/medium run and the long run?',
        answer: 'The short and medium run are about output FLUCTUATIONS (business cycles around trend). The long run is about output GROWTH — the steady, decades-long rise in aggregate output and living standards.'
      },
      {
        question: 'How do we compare standards of living across countries?',
        answer: 'By GDP per capita, ideally adjusted for purchasing power: GDP per capita at PPP (purchasing power parity), because prices differ across countries. What matters for welfare is how many goods income can buy.'
      },
      {
        question: 'What is the aggregate production function?',
        answer: '\\( Y = F(K, N) \\), where K = capital (machines, plants, buildings) and N = labour. It shows how much output is produced from given capital and labour.'
      },
      {
        question: 'What are the key properties of the production function?',
        answer: '• Constant returns to scale: \\( xY = F(xK, xN) \\).\n• Decreasing (diminishing) returns to capital.\n• Decreasing (diminishing) returns to labour.'
      },
      {
        question: 'What does output per worker depend on?',
        answer: 'Setting \\(x = 1/N\\): \\( \\dfrac{Y}{N} = F\\!\\left(\\dfrac{K}{N}, 1\\right) \\). Output per worker rises with capital per worker (K/N), but by smaller and smaller amounts — diminishing returns to capital.'
      },
      {
        question: 'What is the central message of the Solow growth model?',
        answer: 'Capital accumulation is driven by saving (\\(I = sY\\); capital evolves as \\(K_{t+1} = (1-\\delta)K_t + I_t\\)). A higher saving rate raises the LEVEL of output per worker, but because of diminishing returns, capital accumulation ALONE cannot sustain growth — the long-run growth rate of Y/N from capital alone is zero.'
      },
      {
        question: 'What is required for SUSTAINED long-run growth?',
        answer: 'Sustained technological progress. Adding the state of technology A to the production function \\( Y = F(K, N, A) \\), a higher A raises output for given K and N. Continuous output growth requires continuous technological progress.'
      },
      {
        question: 'What determines the rate of technological progress?',
        answer: 'Investment in R&D, which depends on:\n• the FERTILITY of research (basic vs. applied research, education, entrepreneurial culture)\n• the APPROPRIABILITY of results (how much profit a firm can capture — e.g. patent protection).'
      },
      {
        question: 'What is human capital, and why does it matter for growth?',
        answer: 'Human capital is the knowledge and skills of workers: \\( \\dfrac{Y}{N} = f\\!\\left(\\dfrac{K}{N}, \\dfrac{H}{N}\\right) \\). Output per worker depends on investment in BOTH physical capital (saving) and human capital (spending on education).'
      },
      {
        question: 'What is convergence?',
        answer: 'The tendency of poorer countries (lower initial output per capita) to grow faster and catch up to richer ones. It holds among similar (e.g. OECD) economies but is NOT unconditional — many countries have not converged.'
      }
    ],

    quiz: [
      {
        question: 'The long run is concerned with output:',
        options: ['Fluctuations', 'Growth', 'Equilibrium prices', 'The money supply'],
        correct: 1
      },
      {
        question: 'The best cross-country measure of living standards is:',
        options: ['Nominal GDP', 'GDP per capita at PPP', 'Total exports', 'The markup'],
        correct: 1
      },
      {
        question: 'The aggregate production function Y = F(K, N) exhibits diminishing returns to:',
        options: ['Scale', 'Capital (and to labour)', 'Technology', 'Money'],
        correct: 1
      },
      {
        question: 'Constant returns to scale means:',
        options: ['xY = F(xK, xN)', 'Y = F(K) only', 'Output is fixed', 'Y = K + N'],
        correct: 0
      },
      {
        question: 'In the Solow model, capital accumulation is ultimately financed by:',
        options: ['Government spending', 'Saving', 'Imports', 'The markup'],
        correct: 1
      },
      {
        question: 'Because of diminishing returns, capital accumulation ALONE produces a long-run growth rate of Y/N equal to:',
        options: ['The saving rate', 'Zero', 'The depreciation rate', 'Infinity'],
        correct: 1
      },
      {
        question: 'Sustained long-run growth requires sustained:',
        options: ['Capital accumulation', 'Technological progress', 'Inflation', 'Trade deficits'],
        correct: 1
      },
      {
        question: 'The amount of profit a firm can capture from a new idea is called its:',
        options: ['Fertility', 'Appropriability', 'Markup', 'Depreciation'],
        correct: 1
      },
      {
        question: 'The tendency of poorer countries to grow faster and catch up is called:',
        options: ['Divergence', 'Convergence', 'Depreciation', 'Stagnation'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The long run is about output growth, not output _______.', answer: 'fluctuations' },
      { sentence: 'Living standards are best compared with GDP per capita at _______.', answer: 'PPP' },
      { sentence: 'The production function Y = F(K, N) has diminishing returns to _______.', answer: 'capital' },
      { sentence: 'Constant returns to scale: xY = F(xK, x_______).', answer: 'N' },
      { sentence: 'In the Solow model, investment is financed by _______.', answer: 'saving' },
      { sentence: 'Capital accumulation alone cannot _______ long-run growth.', answer: 'sustain' },
      { sentence: 'Sustained growth requires sustained technological _______.', answer: 'progress' },
      { sentence: 'Patent protection raises the _______ of research results.', answer: 'appropriability' }
    ],

    learn: {
      content:
        '<h3>What makes countries rich: long-run growth</h3>' +
        '<p>Over decades, trend growth dwarfs business-cycle fluctuations. Growth determines living standards, measured by <strong>GDP per capita at PPP</strong> (correcting for cross-country price differences).</p>' +

        '<h4>The production function</h4>' +
        '<div class="formula-box">\\[ Y = F(K, N) \\]</div>' +
        '<p>It has <strong>constant returns to scale</strong> (\\(xY = F(xK, xN)\\)) but <strong>diminishing returns</strong> to each input. Per worker:</p>' +
        '<div class="formula-box">\\[ \\frac{Y}{N} = F\\!\\left(\\frac{K}{N},\\, 1\\right) \\]</div>' +
        '<p>More capital per worker raises output per worker — but by ever-smaller increments.</p>' +

        '<h4>The Solow model: saving and the limits of capital</h4>' +
        '<p>Capital is built by investment, financed by saving:</p>' +
        '<div class="formula-box">\\[ K_{t+1} = (1-\\delta)K_t + I_t, \\qquad I_t = sY_t \\]</div>' +
        '<p>A higher saving rate \\(s\\) raises the <em>level</em> of \\(Y/N\\), but diminishing returns mean capital accumulation alone <strong>cannot sustain growth</strong> — its long-run contribution to the growth rate of \\(Y/N\\) is zero.</p>' +

        '<h4>Technology and human capital</h4>' +
        '<p>Sustained growth needs sustained <strong>technological progress</strong>: \\( Y = F(K, N, A) \\), with \\(A\\) rising through R&D — driven by the <strong>fertility</strong> of research and the <strong>appropriability</strong> of its results (patents). Output per worker also depends on <strong>human capital</strong>:</p>' +
        '<div class="formula-box">\\[ \\frac{Y}{N} = f\\!\\left(\\frac{K}{N},\\, \\frac{H}{N}\\right) \\]</div>' +
        '<div class="tip-box"><h4>Convergence</h4><p>Poorer economies tend to grow faster and catch up — but only <em>conditionally</em> (within groups like the OECD). Note: technological progress in tourism/hospitality (services) is on average slower than in industry.</p></div>',
      image: null
    }
  },

  expectations: {
    name: 'Expectations',
    icon: 'fa-lightbulb',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'Why do expectations matter in macroeconomics?',
        answer: 'Many decisions of consumers, managers and financial investors depend not only on current conditions but on EXPECTATIONS of the future. To analyse their effects we need the distinction between nominal and real interest rates and the idea of expected present discounted value.'
      },
      {
        question: 'How are the nominal and real interest rates related (the Fisher relation)?',
        answer: 'The real rate is the nominal rate minus EXPECTED inflation:\n\\( r_t \\approx i_t - \\pi^e_{t+1} \\)\nExactly: \\( 1 + r_t = \\dfrac{1 + i_t}{1 + \\pi^e_{t+1}} \\).',
        explanation: 'Example: nominal 4%, expected inflation 2% → real ≈ 2%.'
      },
      {
        question: 'Why is the real interest rate the one that matters for decisions?',
        answer: 'From a saver’s view: giving up goods today to get goods in the future, the real rate measures the extra GOODS earned, not extra money. Spending and investment decisions depend on the real (purchasing-power) cost of borrowing.'
      },
      {
        question: 'What is expected present discounted value?',
        answer: 'The value today of an expected future sequence of payments, obtained by DISCOUNTING each future payment. A payment of \\(z\\) one year ahead is worth \\( \\dfrac{z}{1 + r} \\) today; further-off payments are discounted more heavily.'
      },
      {
        question: 'How do expectations enter the IS relation?',
        answer: 'Consumption and investment depend on EXPECTED future income, profits and interest rates, not just current ones. Replacing the current interest rate with the real rate, the IS relation becomes \\( Y = C(Y - T) + I(Y, r) + G \\), and expectations of the future shift it.'
      },
      {
        question: 'How can a change in expectations affect today’s economy?',
        answer: 'Optimistic expectations (higher expected future income/profits, lower expected future rates) raise current consumption and investment → shift IS right → raise output today. Pessimism does the reverse. Expectations are themselves a source of demand fluctuations.'
      },
      {
        question: 'Why does monetary policy work partly through expectations?',
        answer: 'Spending depends on the EXPECTED future path of real interest rates, not just today’s rate. A central bank that credibly signals lower rates for longer can stimulate demand more than a one-off cut — expectations amplify (or mute) policy.'
      }
    ],

    quiz: [
      {
        question: 'The real interest rate approximately equals the nominal rate minus:',
        options: ['The tax rate', 'Expected inflation', 'The growth rate', 'The markup'],
        correct: 1
      },
      {
        question: 'If the nominal interest rate is 4% and expected inflation is 2%, the real rate is about:',
        options: ['6%', '2%', '8%', '0%'],
        correct: 1
      },
      {
        question: 'Spending and investment decisions depend mainly on the:',
        options: ['Nominal interest rate', 'Real interest rate', 'Tax rate', 'Exchange rate'],
        correct: 1
      },
      {
        question: 'A payment of z received one year from now is worth today:',
        options: ['z × (1 + r)', 'z / (1 + r)', 'z − r', 'z'],
        correct: 1
      },
      {
        question: 'Expected present discounted value is found by _______ future payments.',
        options: ['Adding up', 'Discounting', 'Taxing', 'Doubling'],
        correct: 1
      },
      {
        question: 'More optimistic expectations about the future tend to:',
        options: ['Shift the IS curve left', 'Shift the IS curve right (raise current output)', 'Lower the money supply', 'Raise the natural rate'],
        correct: 1
      },
      {
        question: 'Monetary policy affects demand partly through expectations of the future path of:',
        options: ['Taxes', 'Real interest rates', 'The markup', 'Net exports'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The real interest rate equals the nominal rate minus _______ inflation.', answer: 'expected' },
      { sentence: 'With a 4% nominal rate and 2% expected inflation, the real rate is about _______ percent.', answer: '2' },
      { sentence: 'Spending decisions depend mainly on the _______ interest rate.', answer: 'real' },
      { sentence: 'A payment z one year ahead is worth z divided by (1 + _______) today.', answer: 'r' },
      { sentence: 'Present value is computed by _______ future payments.', answer: 'discounting' },
      { sentence: 'Optimistic expectations shift the IS curve to the _______.', answer: 'right' },
      { sentence: 'Monetary policy works partly through expectations of future _______ rates.', answer: 'interest' }
    ],

    learn: {
      content:
        '<h3>The future shapes the present</h3>' +
        '<p>Consumers, firms and investors act on <strong>expectations</strong>. Two tools make this precise: the distinction between nominal and real interest rates, and present discounted value.</p>' +

        '<h4>Nominal vs. real interest rate (Fisher)</h4>' +
        '<div class="formula-box">\\[ r_t \\approx i_t - \\pi^e_{t+1}, \\qquad 1 + r_t = \\frac{1 + i_t}{1 + \\pi^e_{t+1}} \\]</div>' +
        '<div class="example-box"><h4>Worked example</h4><p>Nominal rate 4%, expected inflation 2%:</p><div class="formula-box">\\[ r \\approx 4\\% - 2\\% = 2\\% \\]</div><p>A saver gives up goods today to get about 2% MORE goods next year — the real rate is what drives decisions.</p></div>' +

        '<h4>Expected present discounted value</h4>' +
        '<p>A future payment is worth less today. One year ahead, \\(z\\) is worth \\( \\dfrac{z}{1+r} \\); payments further out are discounted more. Summing the discounted expected payments gives an asset’s value today.</p>' +

        '<div class="tip-box">' +
        '<h4>Expectations and the IS curve</h4>' +
        '<p>Because \\(C\\) and \\(I\\) depend on <em>expected</em> future income, profits and rates, the IS relation \\( Y = C(Y-T) + I(Y, r) + G \\) shifts with the mood of the economy. Optimism shifts IS right and raises output today; pessimism does the reverse. This is also why credible signals about the future path of real rates make monetary policy more powerful.</p>' +
        '</div>',
      image: null
    }
  },

  openEconomyGoods: {
    name: 'Open Economy: Trade & Exchange Rates',
    icon: 'fa-arrow-right-arrow-left',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'How is the openness of an economy measured?',
        answer: 'By the share of foreign trade in GDP:\n• Exports/GDP (goal: high)\n• Imports/GDP (goal: low)\n• (EX − IM)/GDP — the trade balance (goal: positive and growing)\n• EX/IM — coverage of imports by exports (goal: high).'
      },
      {
        question: 'What is the import function, and the marginal propensity to import?',
        answer: 'Imports rise with domestic output:\n\\( IM = IM_0 + m\\,Y \\)\nwhere \\(IM_0\\) is autonomous import and \\(m\\) (0 < m < 1) is the marginal propensity to import — the extra import per unit of extra output.'
      },
      {
        question: 'What is the open-economy multiplier, and how does importing change it?',
        answer: 'With a tax rate t and marginal propensity to import m:\n\\( \\text{multiplier} = \\dfrac{1}{1 - \\beta(1 - t) + m} \\)\nImports REDUCE the multiplier (the +m in the denominator). The smaller m, the larger the multiplier.'
      },
      {
        question: 'What is the difference between domestic demand for goods and demand for domestic goods?',
        answer: 'Domestic demand for goods = \\( C + I + G \\) (what residents want).\nDemand for domestic goods = \\( C + I + G - IM + X \\) — subtract imports (foreign goods inside C+I+G) and add exports. The difference is net exports \\( NX = X - IM \\).'
      },
      {
        question: 'What is the goods-market equilibrium condition in an open economy?',
        answer: 'Output equals the demand for domestic goods:\n\\( Y = C + I + G + X - IM = (C + I + G) + NX \\).\nEquivalently \\( Y - (C + I + G) = X - IM \\): any gap between output and domestic spending is the trade balance.'
      },
      {
        question: 'What is the nominal exchange rate, and what are appreciation/depreciation?',
        answer: 'The nominal exchange rate is the price of one currency in terms of another. An APPRECIATION is a rise in a currency’s value relative to others; a DEPRECIATION is a fall. Both result from supply and demand on the foreign-exchange market.'
      },
      {
        question: 'How do devaluation and revaluation differ from depreciation and appreciation?',
        answer: 'Depreciation/appreciation are MARKET-driven changes in a (flexible) exchange rate. Devaluation/revaluation are changes made by the MONETARY AUTHORITIES (in a fixed-rate regime): devaluation lowers the currency’s value, revaluation raises it.'
      },
      {
        question: 'What is the real exchange rate?',
        answer: 'The price of domestic goods in terms of foreign goods (it adjusts the nominal rate for price levels). A RISE in the real exchange rate means domestic goods are relatively more expensive (foreign goods cheaper) → less competitive → net exports fall.'
      },
      {
        question: 'What determines exports and imports?',
        answer: '• Exports rise with foreign output and with a real DEPRECIATION (domestic goods cheaper abroad).\n• Imports rise with domestic output and with a real APPRECIATION (foreign goods cheaper).\nSo \\(NX\\) falls when domestic output or the real exchange rate rises.'
      },
      {
        question: 'What is the Marshall-Lerner condition?',
        answer: 'A real DEPRECIATION improves net exports provided the sum of the price elasticities of export and import demand exceeds 1. If the condition holds, a fall in the real exchange rate (cheaper domestic goods) raises NX.'
      },
      {
        question: 'How does an open economy change the effect of fiscal policy on net exports?',
        answer: 'An increase in government spending raises output, which raises imports → net exports FALL (a trade deficit). Fiscal expansion in an open economy partly leaks abroad through higher imports.'
      }
    ],

    quiz: [
      {
        question: 'The marginal propensity to import (m) is the extra import per unit of extra:',
        options: ['Taxes', 'Output (Y)', 'Exports', 'Government spending'],
        correct: 1
      },
      {
        question: 'In the open-economy multiplier 1/(1 − β(1−t) + m), a higher m makes the multiplier:',
        options: ['Larger', 'Smaller', 'Unchanged', 'Negative'],
        correct: 1
      },
      {
        question: 'With β = 0.8, t = 0.1 and m = 0.12, the multiplier equals:',
        options: ['3.57', '2.5', '5', '1.0'],
        correct: 1
      },
      {
        question: 'Demand for domestic goods differs from domestic demand for goods by:',
        options: ['Taxes', 'Net exports (X − IM)', 'The markup', 'Government spending'],
        correct: 1
      },
      {
        question: 'A depreciation of the domestic currency is:',
        options: ['A rise in its value set by authorities', 'A fall in its value driven by the market', 'A rise driven by the market', 'A fall set by authorities'],
        correct: 1
      },
      {
        question: 'A change in the exchange rate made by the monetary authorities (lowering value) is a:',
        options: ['Depreciation', 'Devaluation', 'Appreciation', 'Revaluation'],
        correct: 1
      },
      {
        question: 'A rise in the real exchange rate means domestic goods become:',
        options: ['Relatively cheaper', 'Relatively more expensive', 'Free', 'Unchanged in price'],
        correct: 1
      },
      {
        question: 'Assuming the Marshall-Lerner condition holds, net exports rise after a:',
        options: ['Real appreciation', 'Real depreciation', 'Rise in domestic output', 'Rise in the markup'],
        correct: 1
      },
      {
        question: 'In an open economy, an increase in government spending tends to make net exports:',
        options: ['Rise', 'Fall', 'Stay constant', 'Become zero'],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: 'The import function is IM = IM₀ + m·Y, where m is the marginal propensity to _______.', answer: 'import' },
      { sentence: 'Imports _______ the size of the open-economy multiplier.', answer: 'reduce' },
      { sentence: 'With β = 0.8, t = 0.1 and m = 0.12 the multiplier equals _______.', answer: '2.5' },
      { sentence: 'Net exports equal exports minus _______.', answer: 'imports' },
      { sentence: 'A market-driven fall in a currency’s value is a _______.', answer: 'depreciation' },
      { sentence: 'A change in value made by the authorities (downward) is a _______.', answer: 'devaluation' },
      { sentence: 'A rise in the real exchange rate makes domestic goods relatively more _______.', answer: 'expensive' },
      { sentence: 'Under the Marshall-Lerner condition, a real depreciation raises net _______.', answer: 'exports' }
    ],

    learn: {
      content:
        '<h3>Opening up: trade, the multiplier and the exchange rate</h3>' +
        '<p>An open economy adds the foreign sector: \\( Y = C + I + G + X - IM \\). <strong>Openness</strong> is measured by trade shares (EX/GDP, IM/GDP, (EX−IM)/GDP, EX/IM).</p>' +

        '<h4>Imports and the multiplier</h4>' +
        '<p>Imports grow with output: \\( IM = IM_0 + m\\,Y \\), where \\(m\\) is the <strong>marginal propensity to import</strong>. With consumption \\( C = \\beta(1-t)Y + c_0 \\), the open-economy multiplier is:</p>' +
        '<div class="formula-box">\\[ \\text{multiplier} = \\frac{1}{1 - \\beta(1 - t) + m} \\]</div>' +
        '<div class="example-box"><h4>Worked example — imports shrink the multiplier</h4><p>Let \\( \\beta = 0.8,\\ t = 0.1,\\ m = 0.12 \\). Without imports:</p><div class="formula-box">\\[ \\frac{1}{1 - 0.8(1-0.1)} = \\frac{1}{0.28} = 3.57 \\]</div><p>With imports:</p><div class="formula-box">\\[ \\frac{1}{1 - 0.8(0.9) + 0.12} = \\frac{1}{0.40} = 2.5 \\]</div><p>Imports leak demand abroad, so the multiplier falls from 3.57 to 2.5.</p></div>' +

        '<h4>Domestic demand vs. demand for domestic goods</h4>' +
        '<p><strong>Domestic demand</strong> is \\(C + I + G\\). <strong>Demand for domestic goods</strong> subtracts imports and adds exports, so equilibrium is \\( Y = (C + I + G) + NX \\) with \\(NX = X - IM\\). A trade surplus (\\(NX>0\\)) means demand for domestic goods exceeds domestic demand.</p>' +

        '<h4>The exchange rate</h4>' +
        '<ul>' +
        '<li><strong>Appreciation / depreciation</strong> — market-driven rise / fall in a currency’s value.</li>' +
        '<li><strong>Revaluation / devaluation</strong> — rise / fall set by the authorities (fixed-rate regime).</li>' +
        '<li><strong>Real exchange rate</strong> — the price of domestic goods in terms of foreign goods. A <em>rise</em> makes domestic goods dearer → less competitive → \\(NX\\) falls.</li>' +
        '</ul>' +
        '<div class="warning-box"><h4>Marshall-Lerner</h4><p>A real <strong>depreciation</strong> improves net exports <em>only if</em> the sum of export and import demand elasticities exceeds 1. And note: a fiscal expansion raises output and thus imports, so it tends to <strong>worsen</strong> net exports.</p></div>',
      image: null
    }
  },

  balanceOfPayments: {
    name: 'Balance of Payments',
    icon: 'fa-file-invoice-dollar',
    color: '#fbbf24',

    flashcards: [
      {
        question: 'What is the balance of payments?',
        answer: 'A summary statement of all monetary transactions of a country’s residents with the rest of the world during one year. It records trade in goods and services, incomes, and capital/financial flows.'
      },
      {
        question: 'What are the two main accounts of the balance of payments?',
        answer: '1. The CURRENT account — goods, services, primary income and secondary income.\n2. The FINANCIAL (capital) account — direct, portfolio and other investments, financial derivatives.\nAcross the accounts (plus the change in reserves), the balance of payments sums to zero.'
      },
      {
        question: 'What does the current account include?',
        answer: 'The trade balance (goods), the services balance, primary income (compensation of employees, investment income such as dividends and interest) and secondary income (transfers with no reciprocal obligation — pensions, gifts, aid).'
      },
      {
        question: 'How is the tourism (travel) balance defined?',
        answer: 'Income (Export) − Expenditure (Import):\n• Income = spending of foreign tourists in the country (a foreign-exchange inflow, an EXPORT).\n• Expenditure = spending of domestic tourists abroad (an outflow, an IMPORT).\nSurplus → a tourist-RECEPTIVE country; deficit → a tourist-EMITTING country.'
      },
      {
        question: 'Why is the tourism balance important for Croatia?',
        answer: 'In the Croatian balance of payments, the large TRAVEL surplus within services typically offsets the persistent deficit in the goods (trade) balance — tourism is the key foreign-exchange earner that supports the current account.'
      },
      {
        question: 'How does net capital export depend on the interest rate?',
        answer: 'Net capital export \\(K\\) is a DECREASING function of the domestic interest rate: \\( K = f(r),\\ \\dfrac{dK}{dr} < 0 \\). A higher domestic rate attracts capital inflows (reduces net capital export).'
      },
      {
        question: 'How does a rise in the domestic interest rate affect the trade balance (indirectly)?',
        answer: 'Higher r → capital inflows → higher demand for the domestic currency → the currency appreciates → exports fall and imports rise → the trade balance DETERIORATES. (Lower rates work the opposite way.)'
      },
      {
        question: 'What is the BP curve?',
        answer: 'The set of combinations of output Y and interest rate r for which the balance of payments is in equilibrium (BP = 0): the trade balance matches net capital flows. Points below the curve are in deficit, points above in surplus.'
      },
      {
        question: 'What does internal and external balance mean, and how are they related?',
        answer: 'INTERNAL balance is goods+money market equilibrium (IS = LM). EXTERNAL balance is balance-of-payments equilibrium (on the BP curve). They are interdependent: a BoP deficit reduces reserves and the money supply, shifting LM left and raising r, which over time moves the economy toward simultaneous internal and external balance.'
      }
    ],

    quiz: [
      {
        question: 'The balance of payments records a country’s transactions with the rest of the world over:',
        options: ['One day', 'One year', 'One quarter only', 'A decade'],
        correct: 1
      },
      {
        question: 'The current account includes goods, services, primary income and:',
        options: ['Direct investment', 'Secondary income', 'Portfolio investment', 'Reserves'],
        correct: 1
      },
      {
        question: 'In the travel (tourism) balance, spending by foreign tourists in the country is recorded as an:',
        options: ['Import', 'Export', 'Transfer', 'Investment'],
        correct: 1
      },
      {
        question: 'A country with a tourism-balance surplus is:',
        options: ['Tourist-emitting', 'Tourist-receptive', 'In a trade deficit by definition', 'Closed'],
        correct: 1
      },
      {
        question: 'Net capital export K is a _______ function of the domestic interest rate.',
        options: ['Increasing', 'Decreasing', 'Constant', 'Random'],
        correct: 1
      },
      {
        question: 'A rise in the domestic interest rate tends to make the trade balance:',
        options: ['Improve', 'Deteriorate (currency appreciates)', 'Unchanged', 'Always balanced'],
        correct: 1
      },
      {
        question: 'On the BP curve, the balance of payments is:',
        options: ['In deficit', 'In surplus', 'In equilibrium (BP = 0)', 'Undefined'],
        correct: 2
      },
      {
        question: 'Internal balance corresponds to the intersection of:',
        options: ['IS and BP', 'IS and LM', 'LM and BP', 'AS and AD'],
        correct: 1
      },
      {
        question: 'Across all its accounts (with reserves), the balance of payments sums to:',
        options: ['A surplus', 'A deficit', 'Zero', 'The trade balance'],
        correct: 2
      }
    ],

    fillBlanks: [
      { sentence: 'The balance of payments records transactions with the rest of the world over one _______.', answer: 'year' },
      { sentence: 'The two main accounts are the current account and the _______ account.', answer: 'financial' },
      { sentence: 'In the travel balance, foreign tourists’ spending in the country is an _______.', answer: 'export' },
      { sentence: 'A tourism-balance surplus indicates a tourist-_______ country.', answer: 'receptive' },
      { sentence: 'Net capital export is a _______ function of the domestic interest rate.', answer: 'decreasing' },
      { sentence: 'A higher domestic interest rate causes the currency to _______.', answer: 'appreciate' },
      { sentence: 'On the BP curve the balance of payments equals _______.', answer: 'zero' },
      { sentence: 'Internal balance is the intersection of the IS and _______ curves.', answer: 'LM' }
    ],

    learn: {
      content:
        '<h3>Accounting for a country’s dealings with the world</h3>' +
        '<p>The <strong>balance of payments</strong> records all transactions between residents and the rest of the world in a year. It has two main accounts:</p>' +
        '<ul>' +
        '<li><strong>Current account</strong> — goods, services, primary income (wages, investment income) and secondary income (transfers).</li>' +
        '<li><strong>Financial account</strong> — direct, portfolio and other investments, derivatives.</li>' +
        '</ul>' +
        '<p>Together with the change in reserves, the whole balance of payments sums to <strong>zero</strong>: a current-account deficit must be financed by capital inflows.</p>' +

        '<h4>The tourism (travel) balance</h4>' +
        '<div class="formula-box">\\[ \\text{Travel balance} = \\underbrace{\\text{income from foreign tourists}}_{\\text{export, inflow}} - \\underbrace{\\text{spending of residents abroad}}_{\\text{import, outflow}} \\]</div>' +
        '<p>A surplus marks a tourist-<strong>receptive</strong> country, a deficit a tourist-<strong>emitting</strong> one. For Croatia, the large travel surplus typically offsets the goods-trade deficit.</p>' +

        '<h4>Capital flows and the BP curve</h4>' +
        '<p>Net capital export falls as the domestic interest rate rises: \\( K = f(r),\\ \\tfrac{dK}{dr} < 0 \\). A higher \\(r\\) attracts capital, the currency appreciates, and the trade balance <em>deteriorates</em>. The <strong>BP curve</strong> gives the \\((Y, r)\\) pairs where \\(BP = 0\\).</p>' +

        '<div class="tip-box"><h4>Internal and external balance</h4><p><strong>Internal</strong> balance is IS = LM; <strong>external</strong> balance is a point on the BP curve. They interact: a BoP deficit drains reserves, shrinks the money supply (LM shifts left), raises \\(r\\) and cuts imports — pushing the economy toward simultaneous internal and external balance.</p></div>',
      image: null
    }
  }
};

// Expose on window — name MUST match data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.macroeconomicsM2 = macroeconomicsM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsM2; }
