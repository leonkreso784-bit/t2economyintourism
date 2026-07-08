// ===== MICROECONOMICS — 1. KOLOKVIJ (K1) =====
// Pindyck & Rubinfeld, Microeconomics, 9th ed. — Chapters 1–7 (lectures L1–L6).
// K1/K2 granica iz službenog DINP rasporeda predavanja (L7 = 1. kolokvij).
//
// ⚠ PRVI KVANTITATIVNI PREDMET — koristi KaTeX (ADR-009). Konvencija (docs/content/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (u JS stringu: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   Jedan `$` se NE koristi (valuta). LaTeX backslash u stringu = "\\".
//
// PILOT (2026-06-14): zasad samo kategorija `supplyAndDemand` (Ch 2) kao dokaz da KaTeX
// render radi u svim modovima. Ostatak K1 (preliminaries, consumerBehavior, demand,
// uncertainty, production, costOfProduction) dodaje se nakon pregleda pilota.

const microeconomicsM1 = {
  preliminaries: {
    name: 'Preliminaries',
    icon: 'fa-compass',
    color: '#38bdf8',

    flashcards: [
      {
        question: 'What is economics, and what are its two key elements?',
        answer: 'Economics is the study of how societies use scarce resources to produce valuable goods and services and distribute them among different people.\nThe two key elements are:\n• Scarcity — resources are limited\n• Efficiency — using those resources to get the most value'
      },
      {
        question: 'What are the three problems of economic organization?',
        answer: '1. WHAT goods are produced (and in what quantities)\n2. HOW goods are produced (with which resources/technology)\n3. FOR WHOM goods are produced (who gets them)'
      },
      {
        question: 'Positive vs. normative economics — what is the difference?',
        answer: 'Positive economics describes the FACTS of the economy ("a higher minimum wage raises unemployment among the young").\nNormative economics involves VALUE JUDGMENTS — what ought to be ("taxes should be progressive").',
        explanation: 'Positive = is; normative = ought.'
      },
      {
        question: 'How do microeconomics and macroeconomics differ?',
        answer: 'Microeconomics studies the behavior of individual economic units — consumers, firms, workers, investors — and how prices allocate scarce resources.\nMacroeconomics studies the economy as a whole (growth, inflation, unemployment, business cycles).',
        explanation: 'Adam Smith → micro (the "invisible hand"); Keynes → macro.'
      },
      {
        question: 'What are inputs, outputs, and the factors of production?',
        answer: 'Inputs are commodities/services used to produce things; outputs are the goods/services that result.\nThe three factors of production are:\n• Land (natural resources)\n• Labor\n• Capital'
      },
      {
        question: 'What is the production-possibility frontier (PPF)?',
        answer: 'The PPF shows the maximum quantity of goods an economy can efficiently produce given its technology and available inputs.\n• On the frontier → efficient\n• Inside → inefficient (idle resources)\n• Outside → currently unattainable'
      },
      {
        question: 'How does the PPF illustrate opportunity cost?',
        answer: 'Along the frontier, producing more of one good means giving up some of the other. The opportunity cost is the amount of the OTHER good sacrificed — shown by the (magnitude of the) slope of the PPF.',
        explanation: 'The PPF bows outward → rising opportunity cost.'
      },
      {
        question: 'What causes the PPF to shift outward?',
        answer: 'Economic growth: more inputs (labor, capital, resources) or better technology. Investing in capital goods today (sacrificing current consumption) shifts the future PPF outward.'
      },
      {
        question: 'What is productive efficiency?',
        answer: 'An economy is productively efficient when it cannot produce more of one good without producing less of another — i.e. it operates ON its production-possibility frontier.'
      },
      {
        question: 'Real vs. nominal prices — what is the difference?',
        answer: 'The nominal price is a good’s absolute price in current dollars. The real price is the price relative to an aggregate measure of prices (corrected for inflation), so values from different years can be compared:\n\\( \\text{Real price} = \\text{Nominal price}\\times\\dfrac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_{\\text{current}}} \\)'
      },
      {
        question: 'What is a market, and what is arbitrage?',
        answer: 'A market is a collection of buyers and sellers that, through their interaction, determine the price of a good. The EXTENT of a market is its boundaries (geographic and by product range).\nArbitrage is buying at a low price in one place and selling at a higher price in another.'
      },
      {
        question: 'What is the difference between a theory and a model in economics?',
        answer: 'A theory explains observed phenomena using a set of basic rules and assumptions. A model is a mathematical representation (of a firm, market, etc.) based on that theory. No theory is perfectly correct — it is judged by its predictions.'
      }
    ],

    quiz: [
      {
        question: 'The two key elements of economics are scarcity and:',
        options: ['Inflation', 'Efficiency', 'Equality', 'Profit'],
        correct: 1
      },
      {
        question: '"Taxes should be progressive" is an example of:',
        options: ['Positive economics', 'Normative economics', 'A production function', 'Arbitrage'],
        correct: 1
      },
      {
        question: 'A point INSIDE the production-possibility frontier indicates:',
        options: ['Maximum efficiency', 'Inefficiency (idle resources)', 'An unattainable output', 'Constant returns to scale'],
        correct: 1
      },
      {
        question: 'Moving along the PPF, producing more of one good requires:',
        options: ['Producing more of the other good too', 'Giving up some of the other good (opportunity cost)', 'A fall in technology', 'No trade-off at all'],
        correct: 1
      },
      {
        question: 'Microeconomics primarily studies:',
        options: ['National unemployment and inflation', 'The behavior of individual consumers and firms', 'The overall business cycle', 'Government budget deficits'],
        correct: 1
      },
      {
        question: 'The PPF shifts OUTWARD when:',
        options: ['Tastes change', 'Technology improves or inputs increase', 'Prices rise', 'The good becomes inferior'],
        correct: 1
      },
      {
        question: 'Land, labor, and capital are known as:',
        options: ['Outputs', 'Factors of production', 'Normative goods', 'Sunk costs'],
        correct: 1
      },
      {
        question: 'The "invisible hand" of the market is a concept associated with:',
        options: ['John Maynard Keynes', 'Adam Smith', 'David Ricardo', 'Karl Marx'],
        correct: 1
      },
      {
        question: 'A real price is a nominal price adjusted for:',
        options: ['Taxes', 'Inflation', 'Quantity', 'Opportunity cost'],
        correct: 1
      },
      {
        question: 'The three problems of economic organization are what, how, and:',
        options: ['When', 'For whom', 'Why', 'How much'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'Economics is the study of how societies use _______ resources to produce and distribute goods.',
        answer: 'scarce'
      },
      {
        sentence: 'A value judgment such as "inflation is worse than unemployment" is _______ economics.',
        answer: 'normative',
        hint: 'The opposite of positive.'
      },
      {
        sentence: 'A point inside the production-possibility frontier is _______.',
        answer: 'inefficient',
        hint: 'Some resources are idle.'
      },
      {
        sentence: 'On the PPF, the opportunity cost of more of one good is the amount of the _______ good given up.',
        answer: 'other'
      },
      {
        sentence: '_______ deals with the behavior of individual consumers and firms.',
        answer: 'microeconomics'
      },
      {
        sentence: 'The three factors of production are land, labor and _______.',
        answer: 'capital'
      },
      {
        sentence: 'A price corrected for inflation is called a _______ price.',
        answer: 'real'
      },
      {
        sentence: 'Buying cheaply in one market and reselling at a higher price in another is _______.',
        answer: 'arbitrage'
      }
    ],

    learn: {
      content:
        '<h3>Preliminaries — the economic way of thinking</h3>' +
        '<p><strong>Economics</strong> studies how societies use <span class="highlight">scarce</span> resources to produce valuable goods and services and distribute them among people. Its two pillars are <strong>scarcity</strong> (resources are limited) and <strong>efficiency</strong> (getting the most from them). Every economy must answer three questions: <strong>what</strong> to produce, <strong>how</strong>, and <strong>for whom</strong>.</p>' +

        '<div class="tip-box">' +
        '<h4>Positive vs. normative</h4>' +
        '<p><strong>Positive</strong> economics describes what <em>is</em> (testable facts). <strong>Normative</strong> economics expresses what <em>ought</em> to be (value judgments). "A carbon tax cuts emissions" is positive; "we should tax carbon" is normative.</p>' +
        '</div>' +

        '<h4>Production-possibility frontier (PPF)</h4>' +
        '<p>The PPF shows the maximum output of two goods an economy can produce with its given technology and inputs (land, labor, capital).</p>' +
        '<ul>' +
        '<li><strong>On</strong> the frontier → productively efficient</li>' +
        '<li><strong>Inside</strong> → inefficient (idle resources)</li>' +
        '<li><strong>Outside</strong> → currently unattainable</li>' +
        '</ul>' +
        '<p>Because resources are not equally good at everything, the frontier bows outward, so the <strong>opportunity cost</strong> — the other good given up — rises as you specialize. Growth (more inputs or better technology) shifts the whole PPF outward.</p>' +

        '<h4>Markets and prices</h4>' +
        '<p>A <strong>market</strong> is the buyers and sellers whose interaction sets a good’s price. <strong>Arbitrage</strong> (buy low here, sell high there) tends to equalize prices within a market. To compare prices across years we adjust for inflation:</p>' +
        '<div class="formula-box">\\[ \\text{Real price} = \\text{Nominal price}\\times\\frac{\\text{CPI}_{\\text{base}}}{\\text{CPI}_{\\text{current}}} \\]</div>' +
        '<p class="highlight">Microeconomics is about individual units (consumers, firms, workers) and how prices allocate scarce resources — much of it is about limits, and making the most of them.</p>',
      image: null
    }
  },

  supplyAndDemand: {
    name: 'The Basics of Supply & Demand',
    icon: 'fa-scale-balanced',
    color: '#0ea5e9',

    flashcards: [
      {
        question: 'What is a demand schedule, and why does the demand curve slope downward?',
        answer: 'A demand schedule is the relationship between a good’s market price and the quantity buyers demand, holding other things constant; its graph is the demand curve.\nIt slopes downward (the law of downward-sloping demand) for two reasons:\n• the substitution effect\n• the income effect',
        explanation: 'Market demand is found by adding the quantities demanded by all individuals at each price.'
      },
      {
        question: 'Movement ALONG the demand curve vs. a SHIFT of the demand curve — what triggers each?',
        answer: 'A change in the good’s OWN price → a movement along the curve (a change in quantity demanded).\nA change in ANY OTHER factor (income, prices of related goods, tastes…) → a shift of the whole curve (a change in demand).',
        explanation: 'Mixing up the two is the most common exam mistake.'
      },
      {
        question: 'Which factors SHIFT the demand curve (besides the good’s own price)?',
        answer: '• Average income\n• Size of the market (number of buyers)\n• Prices & availability of related goods (substitutes / complements)\n• Tastes and preferences\n• Special / expectational influences'
      },
      {
        question: 'Which forces SHIFT the supply curve (besides the good’s own price)?',
        answer: '• Cost of production\n• Prices of inputs (labor, energy, machinery)\n• Technology (lowers inputs needed per unit)\n• Prices of related (substitute) outputs\n• Government policy (taxes, regulation)\n• Special influences (e.g. weather)'
      },
      {
        question: 'What is market equilibrium?',
        answer: 'The price and quantity at which the forces of supply and demand are in balance. At the equilibrium (market-clearing) price, quantity demanded equals quantity supplied: \\(Q_d = Q_s\\).',
        explanation: 'Above equilibrium → surplus (excess supply); below it → shortage (excess demand).'
      },
      {
        question: 'If DEMAND rises (curve shifts right), what happens to equilibrium price and quantity?',
        answer: 'Both rise: equilibrium price ↑ and equilibrium quantity ↑.',
        explanation: 'Demand falls → both ↓. Supply rises → price ↓, quantity ↑. Supply falls → price ↑, quantity ↓.'
      },
      {
        question: 'Define the price elasticity of demand and give its formula.',
        answer: 'The percentage change in quantity demanded resulting from a 1% change in price:\n\\(E_p = \\dfrac{\\%\\Delta Q}{\\%\\Delta P} = \\dfrac{P}{Q}\\cdot\\dfrac{\\Delta Q}{\\Delta P}\\).\nIt is normally negative; we usually report its absolute value.'
      },
      {
        question: 'How do you classify demand as elastic, inelastic, or unit elastic from \\(E_p\\)?',
        answer: '• \\(|E_p| > 1\\) → elastic (quantity very responsive)\n• \\(|E_p| < 1\\) → inelastic (quantity barely responds)\n• \\(|E_p| = 1\\) → unit elastic'
      },
      {
        question: 'What is the arc (midpoint) elasticity formula, and why use it?',
        answer: '\\(E_p = \\dfrac{\\Delta Q \\,/\\, \\tfrac{Q_1+Q_2}{2}}{\\Delta P \\,/\\, \\tfrac{P_1+P_2}{2}}\\).\nIt uses the AVERAGE of the two prices and quantities as the base, so you get the same elasticity whether price rises or falls between the two points.'
      },
      {
        question: 'Is the slope of a demand curve the same as its elasticity?',
        answer: 'No. Slope \\(=\\Delta P/\\Delta Q\\) is constant on a straight line, but elasticity \\(=\\dfrac{P}{Q}\\cdot\\dfrac{\\Delta Q}{\\Delta P}\\) varies along it: demand is elastic near the top (high \\(P\\), low \\(Q\\)) and inelastic near the bottom.',
        explanation: '"Slope ≠ elasticity" is a classic trap.'
      },
      {
        question: 'Define income elasticity of demand.',
        answer: 'The percentage change in quantity demanded resulting from a 1% increase in income:\n\\(E_I = \\dfrac{\\%\\Delta Q}{\\%\\Delta I}\\).\n\\(E_I > 0\\) → normal good; \\(E_I < 0\\) → inferior good.'
      },
      {
        question: 'Define cross-price elasticity of demand.',
        answer: 'The percentage change in quantity demanded of good A from a 1% increase in the price of good B:\n\\(E_{Q_A P_B} = \\dfrac{\\%\\Delta Q_A}{\\%\\Delta P_B}\\).\nPositive → substitutes; negative → complements.'
      },
      {
        question: 'How does price elasticity relate to total revenue?',
        answer: 'Revenue is \\(R = P \\times Q\\). If demand is elastic (\\(|E_p|>1\\)), a price cut RAISES revenue; if inelastic (\\(|E_p|<1\\)), a price cut LOWERS revenue; if unit elastic, revenue is unchanged.'
      },
      {
        question: 'What are completely inelastic and infinitely elastic demand?',
        answer: 'Completely (perfectly) inelastic: \\(E_p = 0\\) → a vertical demand curve (quantity fixed regardless of price).\nInfinitely (perfectly) elastic: \\(E_p = \\infty\\) → a horizontal demand curve (any quantity at a single price).'
      }
    ],

    quiz: [
      {
        question: 'A change in the price of the good itself causes:',
        options: ['A shift of the demand curve', 'A movement along the demand curve', 'A change in tastes', 'A shift of the supply curve'],
        correct: 1
      },
      {
        question: 'Which of the following SHIFTS the demand curve rather than causing a movement along it?',
        options: ['The good’s own price', 'Consumers’ average income', 'The quantity demanded', 'The equilibrium price'],
        correct: 1
      },
      {
        question: 'At a price ABOVE the equilibrium price, the market has:',
        options: ['A shortage', 'A surplus', 'Exact equilibrium', 'Infinitely elastic demand'],
        correct: 1
      },
      {
        question: 'Price rises from 90 to 110 while quantity falls from 240 to 160. Using the midpoint method, \\(|E_p|\\) equals:',
        options: ['0.5', '1', '2', '4'],
        correct: 2
      },
      {
        question: 'If \\(|E_p| = 0.4\\), demand is:',
        options: ['Elastic', 'Inelastic', 'Unit elastic', 'Perfectly elastic'],
        correct: 1
      },
      {
        question: 'For a good with elastic demand, a price INCREASE will:',
        options: ['Increase total revenue', 'Decrease total revenue', 'Leave total revenue unchanged', 'Always increase quantity sold'],
        correct: 1
      },
      {
        question: 'A POSITIVE cross-price elasticity between goods A and B means they are:',
        options: ['Complements', 'Substitutes', 'Both inferior goods', 'Unrelated'],
        correct: 1
      },
      {
        question: 'A good whose quantity demanded FALLS when income rises has:',
        options: ['Positive income elasticity (normal good)', 'Negative income elasticity (inferior good)', 'Zero cross-price elasticity', 'Unit price elasticity'],
        correct: 1
      },
      {
        question: 'A perfectly inelastic demand curve is:',
        options: ['Horizontal', 'Vertical', 'Upward sloping', 'Unit elastic everywhere'],
        correct: 1
      },
      {
        question: 'Along a straight-line (linear) demand curve, elasticity:',
        options: ['Is constant and equals the slope', 'Varies — elastic at the top, inelastic at the bottom', 'Is always exactly 1', 'Is always infinite'],
        correct: 1
      },
      {
        question: 'A technological advance in producing a good will:',
        options: ['Shift the supply curve left', 'Shift the supply curve right', 'Cause a movement along the supply curve', 'Shift the demand curve right'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'At the market-clearing price, quantity demanded equals quantity _______ (\\(Q_d = Q_s\\)).',
        answer: 'supplied',
        hint: 'The two forces are in balance.'
      },
      {
        sentence: 'A change in a good’s OWN price causes a _______ along the demand curve.',
        answer: 'movement',
        hint: 'Not a shift.'
      },
      {
        sentence: 'If \\(|E_p| > 1\\), demand is said to be _______.',
        answer: 'elastic',
        hint: 'Quantity is very responsive to price.'
      },
      {
        sentence: 'If \\(|E_p| < 1\\), demand is _______.',
        answer: 'inelastic',
        hint: 'Quantity barely responds.'
      },
      {
        sentence: 'Two goods with a POSITIVE cross-price elasticity are _______.',
        answer: 'substitutes',
        hint: 'e.g. tea and coffee.'
      },
      {
        sentence: 'A good whose demand falls as income rises has negative income elasticity and is called an _______ good.',
        answer: 'inferior'
      },
      {
        sentence: 'When demand is inelastic, a price increase will _______ total revenue.',
        answer: 'increase',
        hint: '\\(R = P \\times Q\\).'
      },
      {
        sentence: 'A vertical demand curve represents perfectly _______ demand.',
        answer: 'inelastic'
      },
      {
        sentence: 'Above the equilibrium price the market has an excess of supply, i.e. a _______.',
        answer: 'surplus'
      }
    ],

    learn: {
      content:
        '<h3>The Basics of Supply &amp; Demand</h3>' +
        '<p><strong>Demand</strong> describes how much of a good buyers will purchase at each price, other things equal. The <em>law of downward-sloping demand</em> says quantity demanded rises as price falls, driven by the <span class="highlight">substitution effect</span> and the <span class="highlight">income effect</span>. <strong>Supply</strong> describes how much producers are willing to sell at each price. Either schedule can <em>shift</em> when something other than the good’s own price changes.</p>' +

        '<div class="tip-box">' +
        '<h4>Movement vs. shift — the #1 exam trap</h4>' +
        '<p>A change in the good’s <strong>own price</strong> → a <strong>movement along</strong> the curve. A change in <strong>any other factor</strong> (income, prices of related goods, tastes, technology, taxes…) → a <strong>shift</strong> of the whole curve.</p>' +
        '</div>' +

        '<h4>Market equilibrium</h4>' +
        '<p>Equilibrium is the price and quantity where supply and demand balance — the <strong>market-clearing price</strong>, where</p>' +
        '<div class="formula-box">\\[ Q_d = Q_s \\]</div>' +
        '<p>Above the equilibrium price there is a <strong>surplus</strong> (excess supply); below it, a <strong>shortage</strong> (excess demand). If demand rises, both equilibrium price and quantity rise; if supply rises, price falls but quantity rises.</p>' +

        '<h4>Price elasticity of demand</h4>' +
        '<p>Elasticity is the percentage change in one variable caused by a 1% change in another. The <strong>price elasticity of demand</strong> is</p>' +
        '<div class="formula-box">\\[ E_p = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{\\Delta Q / Q}{\\Delta P / P} = \\frac{P}{Q}\\cdot\\frac{\\Delta Q}{\\Delta P} \\]</div>' +
        '<p>It is normally negative (price up, quantity down); we usually quote its absolute value \\(|E_p|\\):</p>' +
        '<ul>' +
        '<li>\\(|E_p| > 1\\) → <strong>elastic</strong> (quantity very responsive)</li>' +
        '<li>\\(|E_p| < 1\\) → <strong>inelastic</strong></li>' +
        '<li>\\(|E_p| = 1\\) → <strong>unit elastic</strong></li>' +
        '</ul>' +
        '<p>To get the same answer whether price rises or falls between two points, use the <strong>arc (midpoint)</strong> formula, which takes the averages as the base:</p>' +
        '<div class="formula-box">\\[ E_p = \\frac{\\Delta Q \\,/\\, \\tfrac{Q_1 + Q_2}{2}}{\\Delta P \\,/\\, \\tfrac{P_1 + P_2}{2}} \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — midpoint method</h4>' +
        '<p>Price rises from \\(P_1 = 90\\) to \\(P_2 = 110\\); quantity falls from \\(Q_1 = 240\\) to \\(Q_2 = 160\\).</p>' +
        '<p><strong>Step 1 — changes:</strong> \\(\\Delta P = 110 - 90 = 20\\), \\(\\Delta Q = 160 - 240 = -80\\).</p>' +
        '<p><strong>Step 2 — percentages off the midpoints</strong> (\\(\\bar P = 100\\), \\(\\bar Q = 200\\)):</p>' +
        '<div class="formula-box">\\[ \\%\\Delta P = \\frac{20}{100} = 20\\%, \\qquad \\%\\Delta Q = \\frac{-80}{200} = -40\\% \\]</div>' +
        '<p><strong>Step 3 — divide:</strong></p>' +
        '<div class="formula-box">\\[ E_p = \\frac{-40\\%}{20\\%} = -2 \\quad\\Rightarrow\\quad |E_p| = 2 \\]</div>' +
        '<p>Demand here is <strong>elastic</strong>: a 1% price rise cuts quantity by about 2%.</p>' +
        '</div>' +

        '<h4>Income and cross-price elasticities</h4>' +
        '<p><strong>Income elasticity</strong> measures responsiveness to income:</p>' +
        '<div class="formula-box">\\[ E_I = \\frac{\\%\\Delta Q}{\\%\\Delta I} \\]</div>' +
        '<p>\\(E_I > 0\\) → normal good; \\(E_I < 0\\) → inferior good. <strong>Cross-price elasticity</strong> measures the response of good A to the price of good B:</p>' +
        '<div class="formula-box">\\[ E_{Q_A P_B} = \\frac{\\%\\Delta Q_A}{\\%\\Delta P_B} \\]</div>' +
        '<p>Positive → <strong>substitutes</strong>; negative → <strong>complements</strong>.</p>' +

        '<div class="tip-box">' +
        '<h4>Elasticity and revenue</h4>' +
        '<p>Since revenue \\(R = P \\times Q\\): if demand is <strong>elastic</strong>, a price cut <em>raises</em> revenue; if <strong>inelastic</strong>, a price cut <em>lowers</em> revenue; if <strong>unit elastic</strong>, revenue is unchanged.</p>' +
        '</div>' +

        '<p class="highlight">Remember: slope ≠ elasticity. Along a straight-line demand curve the slope is constant, but demand is elastic near the top (high price, low quantity) and inelastic near the bottom.</p>',
      image: null
    }
  },

  consumerBehavior: {
    name: 'Consumer Behavior',
    icon: 'fa-user',
    color: '#6366f1',

    flashcards: [
      {
        question: 'What three steps make up the theory of consumer behavior?',
        answer: '1. Consumer preferences — what the consumer likes (indifference curves)\n2. Budget constraints — what the consumer can afford\n3. Consumer choices — combining the two to maximize satisfaction'
      },
      {
        question: 'What three basic assumptions do we make about preferences?',
        answer: '• Completeness — the consumer can rank any two baskets\n• Transitivity — if A ⪰ B and B ⪰ C, then A ⪰ C\n• More is better than less (goods are desirable)'
      },
      {
        question: 'What is an indifference curve?',
        answer: 'A curve showing all combinations of market baskets that give the consumer the SAME level of satisfaction. A whole set of them is an indifference map; higher curves = more satisfaction.',
        explanation: 'Indifference curves can never intersect (it would violate transitivity).'
      },
      {
        question: 'What is the marginal rate of substitution (MRS)?',
        answer: 'The maximum amount of one good a consumer will give up to get one more unit of another, holding satisfaction constant. It equals the magnitude of the slope of the indifference curve:\n\\( MRS = -\\dfrac{\\Delta C}{\\Delta F} = \\dfrac{MU_F}{MU_C} \\)'
      },
      {
        question: 'Why are indifference curves typically convex (bowed inward)?',
        answer: 'Because of a DIMINISHING marginal rate of substitution: the more of good F you already have, the less of good C you are willing to give up for another unit of F.'
      },
      {
        question: 'What is utility, and what is the difference between ordinal and cardinal utility?',
        answer: 'Utility is a numerical score for the satisfaction from a basket; a utility function assigns it.\n• Ordinal utility only RANKS baskets (most→least preferred)\n• Cardinal utility says by HOW MUCH one basket is preferred to another'
      },
      {
        question: 'Write the budget line and state its slope.',
        answer: 'With income \\(I\\) and prices \\(P_F, P_C\\):\n\\( P_F F + P_C C = I \\).\nIts slope is \\(-\\dfrac{P_F}{P_C}\\) — the rate at which the market lets you trade C for F.'
      },
      {
        question: 'How does the budget line move when (a) income changes, (b) one price changes?',
        answer: '(a) A change in income (prices fixed) shifts the budget line PARALLEL — outward if income rises, inward if it falls.\n(b) A change in one good’s price PIVOTS the line, changing its slope (the intercept on that good’s axis moves).'
      },
      {
        question: 'What two conditions define the consumer’s optimal (utility-maximizing) basket?',
        answer: '1. It lies ON the budget line (all income spent)\n2. It is on the highest attainable indifference curve\nThis happens where the indifference curve is tangent to the budget line:\n\\( MRS = \\dfrac{P_F}{P_C} \\)'
      },
      {
        question: 'What is marginal utility, and what is diminishing marginal utility?',
        answer: 'Marginal utility (MU) is the extra satisfaction from consuming one more unit of a good. Diminishing marginal utility: as you consume more of a good, each additional unit adds less utility.'
      },
      {
        question: 'State the equal-marginal principle.',
        answer: 'Utility is maximized when the marginal utility per dollar is equal across all goods:\n\\( \\dfrac{MU_F}{P_F} = \\dfrac{MU_C}{P_C} \\).\nThis is equivalent to \\(MRS = P_F/P_C\\).'
      },
      {
        question: 'What is a corner solution?',
        answer: 'An optimum where the consumer buys NONE of one good (the best basket is at an end of the budget line). There the tangency condition need not hold — \\(MRS \\ne P_F/P_C\\).'
      }
    ],

    quiz: [
      {
        question: 'The marginal rate of substitution equals the magnitude of the slope of the:',
        options: ['Budget line', 'Indifference curve', 'Demand curve', 'Engel curve'],
        correct: 1
      },
      {
        question: 'Indifference curves are convex (bowed inward) because of:',
        options: ['Increasing marginal utility', 'A diminishing marginal rate of substitution', 'Constant prices', 'A higher income'],
        correct: 1
      },
      {
        question: 'The slope of the budget line equals:',
        options: ['\\(MU_F/MU_C\\)', '\\(-P_F/P_C\\)', '\\(I/P_F\\)', '\\(P_C/P_F\\)'],
        correct: 1
      },
      {
        question: 'A rise in income with prices unchanged shifts the budget line:',
        options: ['Inward and steeper', 'Outward and parallel', 'It pivots around one axis', 'It does not move'],
        correct: 1
      },
      {
        question: 'At the consumer’s interior optimum:',
        options: ['\\(MRS > P_F/P_C\\)', '\\(MRS = P_F/P_C\\)', '\\(MRS = 0\\)', 'MRS equals income'],
        correct: 1
      },
      {
        question: 'The equal-marginal principle says utility is maximized when:',
        options: ['Total utility equals income', 'Marginal utility per dollar is equal across goods', 'MRS is zero', 'All goods cost the same'],
        correct: 1
      },
      {
        question: 'Two indifference curves can never:',
        options: ['Be downward sloping', 'Intersect', 'Be convex', 'Touch the budget line'],
        correct: 1
      },
      {
        question: 'A utility function that only ranks baskets (without saying by how much) is:',
        options: ['Cardinal', 'Ordinal', 'Marginal', 'Nominal'],
        correct: 1
      },
      {
        question: 'When a consumer buys none of one good, the optimum is a:',
        options: ['Tangency solution', 'Corner solution', 'Sunk solution', 'Network solution'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A curve showing baskets that give equal satisfaction is an _______ curve.',
        answer: 'indifference'
      },
      {
        sentence: 'The marginal rate of substitution equals the magnitude of the slope of the _______ curve.',
        answer: 'indifference'
      },
      {
        sentence: 'The slope of the budget line is the negative ratio of the two _______.',
        answer: 'prices',
        hint: '\\(-P_F/P_C\\).'
      },
      {
        sentence: 'At the optimum, the MRS equals the ratio of the _______.',
        answer: 'prices'
      },
      {
        sentence: 'As more of a good is consumed, its marginal _______ diminishes.',
        answer: 'utility'
      },
      {
        sentence: 'The budget line shows all baskets that cost exactly the consumer’s _______.',
        answer: 'income'
      },
      {
        sentence: 'An optimum at which the consumer buys none of one good is a _______ solution.',
        answer: 'corner'
      }
    ],

    learn: {
      content:
        '<h3>Consumer Behavior</h3>' +
        '<p>Consumer theory explains how people split limited income among goods to maximize satisfaction. It has three building blocks: <strong>preferences</strong>, <strong>budget constraints</strong>, and the resulting <strong>choice</strong>.</p>' +

        '<h4>Preferences and indifference curves</h4>' +
        '<p>We assume preferences are <strong>complete</strong> (any two baskets can be ranked), <strong>transitive</strong>, and that <strong>more is better</strong>. An <strong>indifference curve</strong> joins all baskets giving equal satisfaction; higher curves are preferred, and curves never cross. Their slope is the <strong>marginal rate of substitution</strong>:</p>' +
        '<div class="formula-box">\\[ MRS = -\\frac{\\Delta C}{\\Delta F} = \\frac{MU_F}{MU_C} \\]</div>' +
        '<p>Curves are convex because the MRS <em>diminishes</em>: the more F you have, the less C you will trade for one more F.</p>' +

        '<h4>The budget constraint</h4>' +
        '<p>With income \\(I\\) and prices \\(P_F\\) and \\(P_C\\), affordable baskets satisfy the <strong>budget line</strong>:</p>' +
        '<div class="formula-box">\\[ P_F F + P_C C = I, \\qquad \\text{slope} = -\\frac{P_F}{P_C} \\]</div>' +
        '<p>A change in income shifts the line in parallel; a change in one price pivots it.</p>' +

        '<div class="tip-box">' +
        '<h4>The consumer’s optimum</h4>' +
        '<p>Satisfaction is highest where the budget line is <strong>tangent</strong> to an indifference curve — the marginal benefit of a good (its MRS) equals its marginal cost (the price ratio):</p>' +
        '<div class="formula-box">\\[ MRS = \\frac{P_F}{P_C} \\quad\\Longleftrightarrow\\quad \\frac{MU_F}{P_F} = \\frac{MU_C}{P_C} \\]</div>' +
        '<p>This is the <strong>equal-marginal principle</strong>: at the optimum the marginal utility per dollar is the same for every good.</p>' +
        '</div>' +

        '<p class="highlight">If \\(MRS \\ne P_F/P_C\\), the consumer can do better by reallocating spending — unless the optimum is a corner solution (zero of one good).</p>',
      image: null
    }
  },

  individualMarketDemand: {
    name: 'Individual & Market Demand',
    icon: 'fa-people-group',
    color: '#8b5cf6',

    flashcards: [
      {
        question: 'How is an individual demand curve derived from consumer theory?',
        answer: 'By tracing the optimal quantity of a good as its price changes (the price-consumption path). At every point on the demand curve the consumer is maximizing utility, but the level of utility changes as you move along it.'
      },
      {
        question: 'What is an Engel curve?',
        answer: 'A curve relating the quantity of a good consumed to the consumer’s INCOME (holding prices fixed). It slopes upward for normal goods and downward (eventually) for inferior goods.'
      },
      {
        question: 'Normal vs. inferior goods — define each.',
        answer: '• Normal good: quantity demanded RISES when income rises (positive income elasticity).\n• Inferior good: quantity demanded FALLS when income rises (negative income elasticity).'
      },
      {
        question: 'Decompose the effect of a price fall into its two parts.',
        answer: 'Total effect = substitution effect + income effect.\n• Substitution effect: the good is now relatively cheaper → buy more of it (always opposite to the price change).\n• Income effect: real purchasing power rises → buy more (normal good) or less (inferior good).'
      },
      {
        question: 'Why can the income effect work "backwards" for an inferior good?',
        answer: 'For an inferior good, a rise in real income (from a price fall) reduces quantity demanded. The income effect then opposes the substitution effect. If it ever outweighs it, you get a Giffen good (upward-sloping demand) — very rare.'
      },
      {
        question: 'How is the market demand curve obtained from individual demands?',
        answer: 'By adding the quantities demanded by all individuals at each price — i.e. the HORIZONTAL sum of the individual demand curves. The market curve is flatter (more elastic) and reflects more buyers.'
      },
      {
        question: 'What is consumer surplus?',
        answer: 'The difference between the maximum a consumer is willing to pay and what they actually pay. Graphically it is the area BELOW the demand curve and ABOVE the market price.'
      },
      {
        question: 'What are network externalities (bandwagon vs. snob effect)?',
        answer: 'A network externality occurs when one person’s demand depends on others’ purchases.\n• Bandwagon effect (positive): you want it because others have it → demand more elastic.\n• Snob effect (negative): you want it because few others have it → demand less elastic.'
      },
      {
        question: 'How does the demand curve relate to utility maximization?',
        answer: 'Each point on an individual demand curve is a utility-maximizing choice for that price. As price falls, the budget line pivots out and the optimum moves to a larger quantity — generating the downward-sloping demand curve.'
      },
      {
        question: 'Why is market demand usually more elastic than individual demand?',
        answer: 'A lower price keeps existing buyers buying more AND brings new buyers into the market. Summing many individuals’ responses makes total quantity more responsive to price.'
      }
    ],

    quiz: [
      {
        question: 'The market demand curve is the ____ sum of individual demand curves.',
        options: ['Vertical', 'Horizontal', 'Diagonal', 'Weighted'],
        correct: 1
      },
      {
        question: 'A good whose quantity demanded rises when income rises is:',
        options: ['Inferior', 'Normal', 'Giffen', 'Complementary'],
        correct: 1
      },
      {
        question: 'The Engel curve relates quantity demanded to:',
        options: ['Price', 'Income', 'The price of a substitute', 'Utility'],
        correct: 1
      },
      {
        question: 'The substitution effect of a price FALL:',
        options: ['Always reduces quantity of the good', 'Always increases quantity of the now-cheaper good', 'Is zero for normal goods', 'Only applies to inferior goods'],
        correct: 1
      },
      {
        question: 'Consumer surplus is the area:',
        options: ['Above demand and below price', 'Below the demand curve and above the price', 'Under the supply curve', 'Between two indifference curves'],
        correct: 1
      },
      {
        question: 'Wanting a product because many others own it is a:',
        options: ['Snob effect (negative)', 'Bandwagon effect (positive)', 'Income effect', 'Sunk effect'],
        correct: 1
      },
      {
        question: 'For an inferior good, the income effect of a price fall:',
        options: ['Reinforces the substitution effect', 'Works opposite to the substitution effect', 'Is always zero', 'Makes demand vertical'],
        correct: 1
      },
      {
        question: 'The total effect of a price change equals the substitution effect plus the ____ effect.',
        options: ['Network', 'Income', 'Snob', 'Surplus'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'Adding individual demand curves horizontally gives the _______ demand curve.',
        answer: 'market'
      },
      {
        sentence: 'A good whose demand falls as income rises is _______.',
        answer: 'inferior'
      },
      {
        sentence: 'The _______ curve plots quantity demanded against income.',
        answer: 'engel'
      },
      {
        sentence: 'The area below the demand curve and above the price is consumer _______.',
        answer: 'surplus'
      },
      {
        sentence: 'A price change splits into a substitution effect and an _______ effect.',
        answer: 'income'
      },
      {
        sentence: 'Wanting a good because many others buy it is the _______ effect.',
        answer: 'bandwagon'
      },
      {
        sentence: 'The substitution effect always moves quantity in the _______ direction to the price change.',
        answer: 'opposite'
      }
    ],

    learn: {
      content:
        '<h3>Individual &amp; Market Demand</h3>' +
        '<p>The <strong>individual demand curve</strong> falls out of consumer theory: as a good’s price drops, the budget line pivots outward and the optimal basket moves to a larger quantity. Every point on the curve is a utility-maximizing choice.</p>' +

        '<h4>Income changes and Engel curves</h4>' +
        '<p>Tracing the optimum as INCOME changes gives the <strong>Engel curve</strong> (quantity vs. income). It rises for <strong>normal</strong> goods and falls for <strong>inferior</strong> goods.</p>' +

        '<div class="tip-box">' +
        '<h4>Substitution &amp; income effects</h4>' +
        '<p>A price change has two parts: the <strong>substitution effect</strong> (the good is now relatively cheaper → buy more, always opposite the price change) and the <strong>income effect</strong> (real purchasing power changes). For a normal good both push the same way; for an inferior good the income effect opposes the substitution effect.</p>' +
        '</div>' +

        '<h4>From individual to market demand</h4>' +
        '<p>The <strong>market demand curve</strong> is the <em>horizontal</em> sum of all individuals’ demand curves — at each price, add up everyone’s quantity. More buyers and larger individual responses make it flatter (more elastic).</p>' +

        '<h4>Consumer surplus &amp; network effects</h4>' +
        '<p><strong>Consumer surplus</strong> is the area below the demand curve and above the price — the extra value buyers get beyond what they pay. <strong>Network externalities</strong> make one person’s demand depend on others’: the <strong>bandwagon</strong> effect (want it because others have it) and the <strong>snob</strong> effect (want it because few do).</p>' +
        '<p class="highlight">Demand summarizes willingness to pay; supply will summarize willingness to sell — together they set the market price.</p>',
      image: null
    }
  },

  uncertainty: {
    name: 'Uncertainty & Consumer Behavior',
    icon: 'fa-dice',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'Define probability, payoff, and expected value.',
        answer: '• Probability — the likelihood a given outcome occurs.\n• Payoff — the value associated with a possible outcome.\n• Expected value — a probability-weighted average of the payoffs:\n\\( E(X) = \\sum_i p_i x_i \\)'
      },
      {
        question: 'A job pays $1,500 with probability 0.5 and $500 with probability 0.5. What is the expected value?',
        answer: '\\( E(X) = 0.5\\times 1500 + 0.5\\times 500 = 1000 \\). (Reported in USD.)',
        explanation: 'Expected value weights each payoff by its probability.'
      },
      {
        question: 'What is variability, and how is it measured?',
        answer: 'Variability is the extent to which possible outcomes differ. It is measured by the variance (and its square root, the standard deviation):\n\\( \\sigma^2 = \\sum_i p_i\\,(x_i - E(X))^2 \\)'
      },
      {
        question: 'What is expected utility?',
        answer: 'The sum of the utilities of all possible outcomes, weighted by their probabilities:\n\\( E(U) = \\sum_i p_i\\,u(x_i) \\).\nPeople maximize expected UTILITY, not expected value.'
      },
      {
        question: 'Distinguish risk-averse, risk-neutral, and risk-loving.',
        answer: 'Defined by the marginal utility of income:\n• Risk averse — diminishing MU of income; prefers a sure thing to a fair gamble.\n• Risk neutral — constant MU; judges a gamble only by its expected value.\n• Risk loving — increasing MU; prefers the gamble.'
      },
      {
        question: 'What is the risk premium?',
        answer: 'The maximum amount of money a risk-averse person would pay (give up in expected value) to AVOID a risk — i.e. to make a risky prospect equivalent to a certain one.'
      },
      {
        question: 'What are the three common ways to reduce risk?',
        answer: '1. Diversification — spread across many (uncorrelated) choices\n2. Insurance — pay a small certain premium to avoid a large uncertain loss\n3. Obtaining more information about choices and payoffs'
      },
      {
        question: 'Why are risk-averse people willing to buy insurance?',
        answer: 'Because of diminishing marginal utility of income: the utility lost from paying a small certain premium is less than the expected utility lost from a possible large loss. A fairly priced policy raises their expected utility.'
      },
      {
        question: 'What is the trade-off between risk and return on assets?',
        answer: 'A riskless asset gives a certain return; a risky asset offers a higher EXPECTED return to compensate for its variability. Investors choose a mix according to how risk-averse they are.'
      }
    ],

    quiz: [
      {
        question: 'Expected value is a ____ average of the payoffs.',
        options: ['Simple (unweighted)', 'Probability-weighted', 'Geometric', 'Maximum'],
        correct: 1
      },
      {
        question: 'A person with diminishing marginal utility of income is:',
        options: ['Risk loving', 'Risk averse', 'Risk neutral', 'Indifferent to income'],
        correct: 1
      },
      {
        question: 'You win $200 with probability 0.25 and $0 otherwise. The expected value is:',
        options: ['$200', '$100', '$50', '$25'],
        correct: 2
      },
      {
        question: 'The risk premium is the amount a risk-averse person will give up to:',
        options: ['Increase risk', 'Avoid risk', 'Raise expected value', 'Buy a lottery ticket'],
        correct: 1
      },
      {
        question: 'Buying insurance is rational for someone who is risk:',
        options: ['Neutral', 'Averse', 'Loving', 'Free'],
        correct: 1
      },
      {
        question: 'Spreading investments across uncorrelated assets is called:',
        options: ['Insurance', 'Diversification', 'Arbitrage', 'Speculation'],
        correct: 1
      },
      {
        question: 'A risk-NEUTRAL person evaluates a gamble using only its:',
        options: ['Variance', 'Expected value', 'Worst outcome', 'Risk premium'],
        correct: 1
      },
      {
        question: 'Greater expected return on an asset normally comes with greater:',
        options: ['Certainty', 'Risk (variability)', 'Liquidity', 'Insurance'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A probability-weighted average of the payoffs is the _______ value.',
        answer: 'expected'
      },
      {
        sentence: 'Someone who prefers a sure thing to a fair gamble is risk _______.',
        answer: 'averse'
      },
      {
        sentence: 'The spread of possible outcomes is measured by the _______.',
        answer: 'variance',
        hint: 'Its square root is the standard deviation.'
      },
      {
        sentence: 'Reducing risk by spreading across many uncorrelated choices is _______.',
        answer: 'diversification'
      },
      {
        sentence: 'The most a risk-averse person will pay to avoid risk is the risk _______.',
        answer: 'premium'
      },
      {
        sentence: 'A risk-_______ person judges a gamble only by its expected value.',
        answer: 'neutral'
      },
      {
        sentence: 'People buy _______ to swap a possible large loss for a small certain payment.',
        answer: 'insurance'
      }
    ],

    learn: {
      content:
        '<h3>Uncertainty &amp; Consumer Behavior</h3>' +
        '<p>When outcomes are uncertain we describe them with <strong>probabilities</strong> and <strong>payoffs</strong>. The single best summary of a risky prospect is its <strong>expected value</strong> — the probability-weighted average of payoffs:</p>' +
        '<div class="formula-box">\\[ E(X) = \\sum_i p_i\\,x_i \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — expected value</h4>' +
        '<p>A sales job pays \\(1{,}500\\) with probability \\(0.5\\) and \\(500\\) with probability \\(0.5\\) (in USD).</p>' +
        '<div class="formula-box">\\[ E(X) = 0.5\\times 1500 + 0.5\\times 500 = 1000 \\]</div>' +
        '<p>So the expected income is 1,000 — even though neither outcome equals 1,000.</p>' +
        '</div>' +

        '<h4>Risk, variability and utility</h4>' +
        '<p>Two prospects can share an expected value but differ in <strong>variability</strong>, measured by the variance:</p>' +
        '<div class="formula-box">\\[ \\sigma^2 = \\sum_i p_i\\,(x_i - E(X))^2 \\]</div>' +
        '<p>People actually maximize <strong>expected utility</strong>, \\(E(U)=\\sum_i p_i\\,u(x_i)\\). The shape of the utility-of-income function defines attitudes to risk:</p>' +
        '<ul>' +
        '<li><strong>Risk averse</strong> — diminishing marginal utility; prefers the sure thing</li>' +
        '<li><strong>Risk neutral</strong> — constant MU; cares only about \\(E(X)\\)</li>' +
        '<li><strong>Risk loving</strong> — increasing MU; prefers the gamble</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>Reducing risk</h4>' +
        '<p>Risk-averse people lower risk by <strong>diversification</strong> (spreading across uncorrelated choices), <strong>insurance</strong> (a small certain premium instead of a large uncertain loss), and gathering <strong>more information</strong>. The most they will pay to avoid a risk is the <strong>risk premium</strong>.</p>' +
        '</div>' +
        '<p class="highlight">Higher expected return on an asset typically comes only with higher risk — the risk-return trade-off.</p>',
      image: null
    }
  },

  production: {
    name: 'Production',
    icon: 'fa-industry',
    color: '#10b981',

    flashcards: [
      {
        question: 'What three decisions make up the theory of the firm’s production?',
        answer: '1. Production technology — how inputs turn into output\n2. Cost constraints — the prices of labor, capital and other inputs\n3. Input choices — how much of each input to use'
      },
      {
        question: 'What is a production function?',
        answer: 'The relationship giving the MAXIMUM output obtainable from each combination of inputs, given the technology:\n\\( Q = F(K, L) \\) (K = capital, L = labor).'
      },
      {
        question: 'Short run vs. long run in production — what defines them?',
        answer: 'The short run is a period in which at least one input is FIXED (often capital). In the long run ALL inputs are variable. They are defined by flexibility, not a fixed calendar length.'
      },
      {
        question: 'Define average product and marginal product of labor.',
        answer: '• Average product: output per worker, \\(AP_L = \\dfrac{Q}{L}\\)\n• Marginal product: extra output from one more worker, \\(MP_L = \\dfrac{\\Delta Q}{\\Delta L}\\)'
      },
      {
        question: 'State the law of diminishing marginal returns.',
        answer: 'As more of a variable input (e.g. labor) is added to fixed inputs, beyond some point the marginal product of that input declines. It is about the short run, not about bad workers.'
      },
      {
        question: 'What is the relationship between MP and AP curves?',
        answer: 'When \\(MP_L > AP_L\\), average product is RISING; when \\(MP_L < AP_L\\), average product is FALLING. So \\(MP_L\\) crosses \\(AP_L\\) at the maximum of \\(AP_L\\).'
      },
      {
        question: 'What is an isoquant?',
        answer: 'A curve showing all combinations of two inputs (e.g. capital and labor) that yield the SAME output. An isoquant map shows several output levels.'
      },
      {
        question: 'What is the marginal rate of technical substitution (MRTS)?',
        answer: 'The rate at which a firm can swap one input for another holding output constant — the magnitude of the isoquant’s slope:\n\\( MRTS = -\\dfrac{\\Delta K}{\\Delta L} = \\dfrac{MP_L}{MP_K} \\).\nIt diminishes along an isoquant.'
      },
      {
        question: 'Name the two special-case production functions.',
        answer: '• Perfect substitutes — inputs replace each other at a constant rate (straight-line isoquants).\n• Fixed proportions (Leontief) — inputs must be used in a fixed ratio (L-shaped isoquants).'
      },
      {
        question: 'What are returns to scale?',
        answer: 'How output responds when ALL inputs are scaled up together:\n• Increasing — output more than doubles when inputs double\n• Constant — output exactly doubles\n• Decreasing — output less than doubles'
      }
    ],

    quiz: [
      {
        question: 'The production function \\(Q = F(K,L)\\) gives the:',
        options: ['Total cost of inputs', 'Maximum output from the inputs', 'Profit of the firm', 'Price of output'],
        correct: 1
      },
      {
        question: 'Average product of labor is:',
        options: ['\\(\\Delta Q/\\Delta L\\)', '\\(Q/L\\)', '\\(L/Q\\)', '\\(Q\\times L\\)'],
        correct: 1
      },
      {
        question: 'Marginal product of labor is:',
        options: ['\\(Q/L\\)', '\\(\\Delta Q/\\Delta L\\)', '\\(TC/Q\\)', '\\(\\Delta L/\\Delta Q\\)'],
        correct: 1
      },
      {
        question: 'The law of diminishing marginal returns says that, beyond a point, marginal product:',
        options: ['Rises forever', 'Falls as more of the variable input is added', 'Stays constant', 'Becomes negative immediately'],
        correct: 1
      },
      {
        question: 'An isoquant shows input combinations that yield the same:',
        options: ['Cost', 'Output', 'Price', 'Profit'],
        correct: 1
      },
      {
        question: 'The MRTS equals the ratio:',
        options: ['\\(P_L/P_K\\)', '\\(MP_L/MP_K\\)', '\\(Q/L\\)', '\\(w/r\\)'],
        correct: 1
      },
      {
        question: 'When \\(MP_L\\) is above \\(AP_L\\), average product is:',
        options: ['Falling', 'Rising', 'At its maximum', 'Zero'],
        correct: 1
      },
      {
        question: 'A Leontief (fixed-proportions) technology uses inputs in:',
        options: ['Any ratio', 'A fixed ratio', 'Perfect substitution', 'Decreasing returns'],
        correct: 1
      },
      {
        question: 'If doubling all inputs MORE than doubles output, the firm has:',
        options: ['Decreasing returns to scale', 'Increasing returns to scale', 'Constant returns to scale', 'Diminishing marginal returns'],
        correct: 1
      },
      {
        question: 'In the short run, at least one input is:',
        options: ['Variable', 'Fixed', 'Free', 'Doubled'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'The relationship \\(Q = F(K, L)\\) is the _______ function.',
        answer: 'production'
      },
      {
        sentence: 'Output per worker, \\(Q/L\\), is the average _______ of labor.',
        answer: 'product'
      },
      {
        sentence: 'The extra output from one more worker is the _______ product of labor.',
        answer: 'marginal'
      },
      {
        sentence: 'Adding more of a variable input to fixed inputs eventually makes marginal product _______.',
        answer: 'diminish',
        hint: 'The law of diminishing returns.'
      },
      {
        sentence: 'A curve of input combinations giving the same output is an _______.',
        answer: 'isoquant'
      },
      {
        sentence: 'The slope of an isoquant is the marginal rate of technical _______.',
        answer: 'substitution'
      },
      {
        sentence: 'When doubling inputs exactly doubles output, there are _______ returns to scale.',
        answer: 'constant'
      },
      {
        sentence: 'In the _______ run, all inputs are variable.',
        answer: 'long'
      }
    ],

    learn: {
      content:
        '<h3>Production</h3>' +
        '<p>The <strong>theory of the firm</strong> describes how firms turn inputs into output. Production decisions involve the <strong>technology</strong>, the <strong>cost</strong> of inputs, and the <strong>input mix</strong>. The <strong>production function</strong> gives the maximum output from each input combination:</p>' +
        '<div class="formula-box">\\[ Q = F(K, L) \\]</div>' +
        '<p>In the <strong>short run</strong> at least one input is fixed; in the <strong>long run</strong> all inputs vary.</p>' +

        '<h4>One variable input</h4>' +
        '<p>With labor variable and capital fixed:</p>' +
        '<div class="formula-box">\\[ AP_L = \\frac{Q}{L}, \\qquad MP_L = \\frac{\\Delta Q}{\\Delta L} \\]</div>' +
        '<p>The <strong>law of diminishing marginal returns</strong> says \\(MP_L\\) eventually falls as more workers crowd a fixed capital stock. Note the link: when \\(MP_L>AP_L\\), \\(AP_L\\) rises; when \\(MP_L<AP_L\\), \\(AP_L\\) falls — so MP cuts AP at its peak.</p>' +

        '<div class="tip-box">' +
        '<h4>Two variable inputs</h4>' +
        '<p>An <strong>isoquant</strong> shows the input combinations giving the same output. Its slope is the <strong>marginal rate of technical substitution</strong>:</p>' +
        '<div class="formula-box">\\[ MRTS = -\\frac{\\Delta K}{\\Delta L} = \\frac{MP_L}{MP_K} \\]</div>' +
        '<p>Special cases: <strong>perfect substitutes</strong> (straight isoquants) and <strong>fixed proportions / Leontief</strong> (L-shaped).</p>' +
        '</div>' +

        '<p class="highlight">Returns to scale describe scaling ALL inputs together: increasing, constant, or decreasing — distinct from diminishing returns to a single input in the short run.</p>',
      image: null
    }
  },

  costOfProduction: {
    name: 'The Cost of Production',
    icon: 'fa-coins',
    color: '#ef4444',

    flashcards: [
      {
        question: 'Economic cost vs. accounting cost — what is the difference?',
        answer: 'Accounting cost counts explicit out-of-pocket expenses (and depreciation). Economic cost also includes the OPPORTUNITY cost of all resources — e.g. the salary the owner gives up, or the return on capital used in the business.'
      },
      {
        question: 'What is opportunity cost, and what is a sunk cost?',
        answer: 'Opportunity cost is the value of the best alternative forgone when a resource is used. A sunk cost is an expenditure already made and unrecoverable — it should be IGNORED in current decisions.'
      },
      {
        question: 'Distinguish fixed cost (FC) and variable cost (VC), and write total cost.',
        answer: 'Fixed cost does not change with output (paid even at \\(Q=0\\)); variable cost rises with output. Total cost is their sum:\n\\( TC = FC + VC \\)'
      },
      {
        question: 'Define marginal cost.',
        answer: 'The extra cost of producing one more unit:\n\\( MC = \\dfrac{\\Delta TC}{\\Delta Q} = \\dfrac{\\Delta VC}{\\Delta Q} \\) (since FC does not change).'
      },
      {
        question: 'Write the three average cost measures.',
        answer: '\\( ATC = \\dfrac{TC}{Q}, \\quad AFC = \\dfrac{FC}{Q}, \\quad AVC = \\dfrac{VC}{Q} \\)\nand they satisfy \\( ATC = AFC + AVC \\).'
      },
      {
        question: 'How does the marginal cost curve relate to AVC and ATC?',
        answer: 'MC cuts both AVC and ATC at their MINIMUM points. While \\(MC<AVC\\) average cost falls; while \\(MC>AVC\\) it rises. ATC and AVC are U-shaped.'
      },
      {
        question: 'What happens to average fixed cost (AFC) as output rises?',
        answer: 'AFC = FC/Q falls continuously as output rises (fixed cost is spread over more units) — the gap between ATC and AVC narrows.'
      },
      {
        question: 'What is the cost-minimizing input rule in the long run?',
        answer: 'Choose inputs where the isoquant is tangent to the isocost line:\n\\( MRTS = \\dfrac{w}{r} \\quad\\Longleftrightarrow\\quad \\dfrac{MP_L}{w} = \\dfrac{MP_K}{r} \\)\n(the marginal product per dollar is equal across inputs).'
      },
      {
        question: 'Economies vs. diseconomies of scale — define them.',
        answer: '• Economies of scale: long-run average cost FALLS as output rises (doubling output costs less than double).\n• Diseconomies of scale: long-run average cost RISES with output (doubling output costs more than double).'
      },
      {
        question: 'What are economies of scope and the learning curve?',
        answer: '• Economies of scope: it is cheaper to produce several products together than separately.\n• Learning curve: average cost falls as cumulative experience (output) grows — distinct from economies of scale.'
      }
    ],

    quiz: [
      {
        question: 'Total cost equals fixed cost plus:',
        options: ['Marginal cost', 'Variable cost', 'Average cost', 'Sunk cost'],
        correct: 1
      },
      {
        question: 'Marginal cost is:',
        options: ['\\(TC/Q\\)', '\\(\\Delta TC/\\Delta Q\\)', '\\(FC/Q\\)', '\\(VC\\times Q\\)'],
        correct: 1
      },
      {
        question: 'Average total cost equals:',
        options: ['\\(\\Delta TC/\\Delta Q\\)', '\\(TC/Q\\)', '\\(FC+VC\\)', '\\(AVC-AFC\\)'],
        correct: 1
      },
      {
        question: 'ATC equals AVC plus:',
        options: ['MC', 'AFC', 'TC', 'FC'],
        correct: 1
      },
      {
        question: 'The marginal cost curve crosses AVC and ATC at their:',
        options: ['Maximum points', 'Minimum points', 'Vertical intercepts', 'Midpoints'],
        correct: 1
      },
      {
        question: 'A cost already incurred that cannot be recovered is a:',
        options: ['Variable cost', 'Sunk cost', 'Marginal cost', 'Fixed-but-recoverable cost'],
        correct: 1
      },
      {
        question: 'Economic cost differs from accounting cost by also including:',
        options: ['Sales tax', 'Opportunity cost', 'Depreciation only', 'Marginal revenue'],
        correct: 1
      },
      {
        question: 'As output rises, average fixed cost (AFC):',
        options: ['Rises', 'Always falls', 'Stays constant', 'Is U-shaped'],
        correct: 1
      },
      {
        question: 'If doubling output LESS than doubles total cost, the firm has economies of:',
        options: ['Scope', 'Scale', 'Density', 'Learning'],
        correct: 1
      },
      {
        question: 'Long-run cost is minimized where the MRTS equals:',
        options: ['\\(MP_L/MP_K\\) only', 'The input-price ratio \\(w/r\\)', 'Total cost', 'Marginal revenue'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'Total cost is fixed cost plus _______ cost.',
        answer: 'variable'
      },
      {
        sentence: 'The change in total cost from one more unit is _______ cost.',
        answer: 'marginal'
      },
      {
        sentence: 'Average total cost equals total cost divided by _______.',
        answer: 'quantity',
        hint: '\\(ATC = TC/Q\\).'
      },
      {
        sentence: 'ATC is the sum of AVC and average _______ cost.',
        answer: 'fixed'
      },
      {
        sentence: 'A cost already incurred and unrecoverable is a _______ cost.',
        answer: 'sunk'
      },
      {
        sentence: 'Economic cost includes accounting cost plus _______ cost.',
        answer: 'opportunity'
      },
      {
        sentence: 'When long-run average cost falls as output rises, there are economies of _______.',
        answer: 'scale'
      },
      {
        sentence: 'Average fixed cost _______ as output increases.',
        answer: 'falls'
      }
    ],

    learn: {
      content:
        '<h3>The Cost of Production</h3>' +
        '<p>Firms care about <strong>economic cost</strong>, which adds the <strong>opportunity cost</strong> of all resources (e.g. the owner’s forgone salary) to accounting cost. <strong>Sunk costs</strong> — already spent and unrecoverable — are irrelevant to decisions.</p>' +

        '<h4>Short-run costs</h4>' +
        '<p>Split total cost into fixed and variable parts, then derive the averages and the margin:</p>' +
        '<div class="formula-box">\\[ TC = FC + VC, \\qquad MC = \\frac{\\Delta TC}{\\Delta Q} = \\frac{\\Delta VC}{\\Delta Q} \\]</div>' +
        '<div class="formula-box">\\[ ATC = \\frac{TC}{Q}, \\quad AFC = \\frac{FC}{Q}, \\quad AVC = \\frac{VC}{Q}, \\quad ATC = AFC + AVC \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — cost measures</h4>' +
        '<p>At \\(Q = 10\\): fixed cost \\(FC = 100\\), variable cost \\(VC = 200\\) (USD).</p>' +
        '<div class="formula-box">\\[ TC = 100 + 200 = 300, \\quad ATC = \\frac{300}{10} = 30 \\]</div>' +
        '<div class="formula-box">\\[ AFC = \\frac{100}{10} = 10, \\qquad AVC = \\frac{200}{10} = 20 \\]</div>' +
        '<p>Check: \\(AFC + AVC = 10 + 20 = 30 = ATC\\). ✓</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>The marginal–average relationship</h4>' +
        '<p>ATC and AVC are U-shaped, and <strong>MC cuts each at its minimum</strong>. While \\(MC < AVC\\) the average falls; once \\(MC > AVC\\) it rises. <strong>AFC</strong> falls continuously, so ATC and AVC converge as output grows.</p>' +
        '</div>' +

        '<h4>Long-run costs</h4>' +
        '<p>In the long run the firm picks the cheapest input mix where an isoquant is tangent to an isocost line:</p>' +
        '<div class="formula-box">\\[ MRTS = \\frac{w}{r} \\quad\\Longleftrightarrow\\quad \\frac{MP_L}{w} = \\frac{MP_K}{r} \\]</div>' +
        '<p class="highlight">Long-run average cost shows economies of scale (falling), then constant, then diseconomies (rising); economies of scope and the learning curve lower costs further.</p>',
      image: null
    }
  }
};

// Izloži na window — IME mora odgovarati data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.microeconomicsM1 = microeconomicsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = microeconomicsM1; }
