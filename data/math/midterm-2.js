// ===== MATHEMATICS — 2nd MIDTERM (K2) =====
// Source: lecture decks 6, 8, 9, 11 (PhD Iva Mrša Haber; FMTU Opatija, 1st year HM).
// K1/K2 boundary AUTHORITATIVE from the syllabus: K2 = topics 6–11 (after extrema).
//   6.  The indefinite integral & elasticity of demand
//   8.  Rents (annuities) — future & present value
//   9.  Cash loan — equal annuities & equal repayment quotas
//   11. Solving linear systems by the Gauss-Jordan method
//
// ⚠ QUANTITATIVE SUBJECT — KaTeX (ADR-009): inline "\\( ... \\)", display "\\[ ... \\]".
//   A single `$` is NEVER used (currency-safe). A LaTeX backslash in a string = "\\".
// ⚠ CACHE: when editing data/*, bump CONTENT_VERSION in js/content-loader.js.

const mathM2 = {

  // ========================================================================
  // CATEGORY 1: THE INDEFINITE INTEGRAL & ELASTICITY OF DEMAND
  // ========================================================================
  integralElasticity: {
    id: "o6iwfa",
    name: "Integral & Elasticity of Demand",
    icon: "fa-chart-area",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "5vavof",
        question: "What is a primitive (antiderivative) function, and what is the indefinite integral?",
        answer: "Integration is the INVERSE of differentiation. A PRIMITIVE function \\(F\\) of \\(f\\) on \\((a,b)\\) is one whose derivative gives back \\(f\\): \\(F'(x)=f(x)\\).\n\nThe INDEFINITE INTEGRAL of \\(f\\) is the set of ALL primitive functions:\n\\[\\int f(x)\\,dx = F(x)+C,\\quad C\\in\\mathbb{R}.\\]\nHere \\(f\\) is the integrand, \\(x\\) the integration variable, and \\(C\\) the constant of integration.",
        explanation: "If we know the derivative, integration recovers the original function — up to the constant C (since (C)′ = 0, the constant is lost when differentiating)."
      },
      {
        id: "dhij4s",
        question: "State the power rule for the indefinite integral.",
        answer: "For the general power function:\n\\[\\int x^n\\,dx = \\frac{1}{n+1}x^{n+1}+C,\\qquad n\\in\\mathbb{Z},\\ n\\neq -1.\\]\nCheck: differentiating \\(\\frac{1}{n+1}x^{n+1}\\) gives \\(\\frac{1}{n+1}(n+1)x^{n}=x^n\\). ✓",
        explanation: "Integration RAISES the power by one and divides by the new power — the exact reverse of the derivative power rule. (n = −1 is excluded.)"
      },
      {
        id: "768jil",
        question: "What are the integration rules used in this course?",
        answer: "\\[\\int dx = x+C,\\]\n\\[\\int (f(x)\\pm g(x))\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx,\\]\n\\[\\int a\\,f(x)\\,dx = a\\int f(x)\\,dx\\quad(a=\\text{const}).\\]\nIntegration, like differentiation, is LINEAR — integrate term by term and pull out constants.",
        explanation: "So a polynomial is integrated term by term with the power rule."
      },
      {
        id: "3o48gf",
        question: "How do you find the TOTAL COST function from the marginal cost function?",
        answer: "Marginal cost is the derivative of total cost \\(M(Q)=T'(Q)\\), so total cost is the indefinite integral of marginal cost:\n\\[T(Q)=\\int M(Q)\\,dQ.\\]\nThe constant of integration C is the FIXED COST: marginal cost carries no information about it, so C must be given. If the fixed cost is known, \\(C=\\text{fixed cost}\\).",
        explanation: "E.g. M(Q)=3Q+100 → T(Q)=1.5Q²+100Q+C; with fixed cost 200, T(Q)=1.5Q²+100Q+200."
      },
      {
        id: "bgubas",
        question: "Define the coefficient of elasticity of demand.",
        answer: "For a continuous demand function \\(q=q(p)\\) (demand as a function of price), the coefficient of elasticity at a point \\(p_0\\) is:\n\\[E_{q,p}=\\frac{p}{q}\\cdot\\frac{dq}{dp}.\\]\nIt measures (approximately) the % change in demand \\(q\\) when the price \\(p\\) rises by 1%.",
        explanation: "Elasticity = the ability of one economic quantity to react to a change in another it depends on."
      },
      {
        id: "qn9dks",
        question: "How do you interpret the VALUE of the elasticity coefficient?",
        answer: "Comparing the absolute change in demand to that in price:\n• \\(|E_{q,p}|>1\\) → demand is ELASTIC (q changes proportionally MORE than p)\n• \\(|E_{q,p}|<1\\) → demand is INELASTIC (q changes LESS than p)\n• \\(|E_{q,p}|=1\\) → UNIT elasticity\n• \\(E_{q,p}=0\\) → perfectly inelastic\n\nThe SIGN shows direction: \\(E>0\\) → q rises with p; \\(E<0\\) → q falls as p rises (the usual demand case).",
        explanation: "If E = −4/3 at p₀: a 1% price rise lowers demand by about 4/3% (the minus sign means a decrease)."
      },
      {
        id: "3aiot2",
        question: "For a linear demand \\(q=mp+c\\), what is the elasticity at price \\(p\\)?",
        answer: "Since \\(\\frac{dq}{dp}=m\\),\n\\[E_{q,p}=\\frac{p}{q}\\cdot m=\\frac{m\\,p}{m\\,p+c}.\\]\nFor a downward-sloping demand \\(m<0\\), so \\(E<0\\) — raising the price lowers demand.",
        explanation: "E.g. q = −25p + 1200: demand is inelastic for small p and becomes elastic as p grows toward the choke price."
      }
    ],

    quiz: [
      {
        id: "h7h71i",
        question: "\\(\\int x^n\\,dx = \\) ? (for \\(n\\neq -1\\))",
        options: ["\\(n x^{n-1}+C\\)", "\\(\\frac{1}{n+1}x^{n+1}+C\\)", "\\(\\frac{1}{n-1}x^{n-1}+C\\)", "\\(x^{n+1}+C\\)"],
        correct: 1
      },
      {
        id: "8wa8tk",
        question: "Integration is the inverse operation of:",
        options: ["Multiplication", "Differentiation", "Taking logarithms", "Squaring"],
        correct: 1
      },
      {
        id: "goyylc",
        question: "The total cost function is obtained from marginal cost by:",
        options: ["Differentiating M(Q)", "Integrating M(Q): \\(T(Q)=\\int M(Q)\\,dQ\\)", "Dividing M(Q) by Q", "Multiplying M(Q) by Q"],
        correct: 1
      },
      {
        id: "20q0cd",
        question: "In \\(T(Q)=\\int M(Q)\\,dQ\\), the constant of integration C represents the:",
        options: ["Marginal cost", "Variable cost", "Fixed cost", "Average cost"],
        correct: 2
      },
      {
        id: "2obqg0",
        question: "The coefficient of elasticity of demand is:",
        options: ["\\(\\frac{q}{p}\\cdot\\frac{dp}{dq}\\)", "\\(\\frac{p}{q}\\cdot\\frac{dq}{dp}\\)", "\\(\\frac{dq}{dp}\\)", "\\(p\\cdot q\\)"],
        correct: 1
      },
      {
        id: "5tehep",
        question: "If \\(|E_{q,p}|>1\\), demand is:",
        options: ["Inelastic", "Elastic", "Perfectly inelastic", "Of unit elasticity"],
        correct: 1
      },
      {
        id: "wtsb4e",
        question: "A negative elasticity coefficient means that when price rises, demand:",
        options: ["Rises", "Falls", "Stays constant", "Becomes zero"],
        correct: 1
      },
      {
        id: "1yynwi",
        question: "Why can't total cost be uniquely determined from marginal cost alone?",
        options: ["Marginal cost is always zero", "The constant of integration (fixed cost) is unknown", "Integration is impossible", "Q is unknown"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "8j3t55", sentence: "A function F whose derivative is f (F′ = f) is called a _______ function of f.", answer: "primitive", hint: "Also: antiderivative" },
      { id: "mp77so", sentence: "The constant C added to every indefinite integral is the constant of _______.", answer: "integration", hint: "Lost when differentiating because (C)′ = 0" },
      { id: "mljcs7", sentence: "By the power rule, ∫xⁿ dx raises the power by one and divides by n + _______.", answer: "1", hint: "1/(n+1)·xⁿ⁺¹" },
      { id: "e97utd", sentence: "Total cost is the indefinite _______ of marginal cost: T(Q) = ∫ M(Q) dQ.", answer: "integral", hint: "Inverse of differentiation" },
      { id: "au5ici", sentence: "The constant of integration in T(Q) equals the _______ cost.", answer: "fixed", hint: "T(0)" },
      { id: "jdd1qr", sentence: "If |E| > 1 demand is elastic; if |E| < 1 demand is _______.", answer: "inelastic", hint: "q changes less than p" }
    ],

    learn: {
      id: "jgkc12",
      content:
        '<h3>The indefinite integral — undoing the derivative</h3>' +
        '<p>Differentiation took a function and produced its <em>rate of change</em>. <strong>Integration runs the film backwards</strong>: given a rate, it recovers the original quantity. This is exactly the question a manager asks — "I know how fast cost grows with each extra unit (the marginal cost); what is the <em>total</em> cost?" That reverse step is why integration sits at the heart of economic analysis.</p>' +
        '<p>A function \\(F\\) is a <span class="highlight">primitive</span> (antiderivative) of \\(f\\) when differentiating it gives \\(f\\) back: \\(F\'(x)=f(x)\\). But \\(F\\) is never unique — since the derivative of <em>any</em> constant is zero, \\(F(x)+5\\), \\(F(x)-200\\) and \\(F(x)\\) all share the same derivative. So the answer is a whole <strong>family</strong> of vertically-shifted curves, written with a constant of integration \\(C\\):</p>' +
        '<div class="formula-box">\\[\\int f(x)\\,dx = F(x)+C,\\qquad C\\in\\mathbb{R}.\\]</div>' +
        '<p>Here \\(f\\) is the <strong>integrand</strong>, \\(x\\) the integration variable, and \\(C\\) the <strong>constant of integration</strong>. That constant is not red tape — in economics it carries real meaning (the fixed cost), as we will see.</p>' +

        '<h4>The power rule, read backwards</h4>' +
        '<p>Recall \\((x^n)\'=n x^{n-1}\\): differentiation <em>lowers</em> the power by one. Integration must therefore do the opposite — <em>raise</em> the power and divide by the new one:</p>' +
        '<div class="formula-box">\\[\\int x^n\\,dx=\\frac{1}{n+1}x^{n+1}+C\\quad(n\\neq -1).\\]</div>' +
        '<p>Always check by differentiating your answer back: \\(\\left(\\tfrac{1}{n+1}x^{n+1}\\right)\'=\\tfrac{1}{n+1}(n+1)x^{n}=x^n\\) ✓. Integration is <strong>linear</strong> — \\(\\int(f\\pm g)=\\int f\\pm\\int g\\) and \\(\\int a\\,f=a\\int f\\) — so a polynomial is integrated <strong>term by term</strong>.</p>' +
        '<p><strong>Worked example.</strong> To integrate \\(x^5+10x^4+3x^2+x+10\\), lift each term one power and divide by the new power (the \\(10\\) becomes \\(10x\\), since \\(\\int dx=x\\)):</p>' +
        '<div class="formula-box">\\[\\int (x^5+10x^4+3x^2+x+10)\\,dx=\\tfrac16 x^6+2x^5+x^3+\\tfrac12 x^2+10x+C.\\]</div>' +

        '<div class="tip-box">' +
        '<h4>Application: from marginal cost back to total cost</h4>' +
        '<p>Because marginal cost is the derivative of total cost, \\(M(Q)=T\'(Q)\\), we recover total cost by integrating: \\(T(Q)=\\int M(Q)\\,dQ\\). <strong>Example.</strong> If \\(M(Q)=3Q+100\\), then \\(T(Q)=\\tfrac32 Q^2+100Q+C\\). We cannot pin \\(C\\) down from the margin alone — the marginal cost says nothing about what you pay at zero output. That leftover constant <strong>is the fixed cost</strong>: if it is 200, then \\(T(Q)=\\tfrac32 Q^2+100Q+200\\), and indeed \\(T(0)=200\\). This is the single most important economic use of the integral in the course.</p>' +
        '</div>' +

        '<h3>Elasticity of demand</h3>' +
        '<p>A second economic question: <em>how sensitive</em> is demand to price? The raw slope \\(\\frac{dq}{dp}\\) answers it in units (e.g. rooms sold per euro of price), which makes comparison across products impossible — is "−25 rooms per euro" a lot? <span class="highlight">Elasticity</span> fixes this by converting the slope into a unit-free percentage: the approximate % change in demand caused by a 1% rise in price.</p>' +
        '<div class="formula-box">\\[E_{q,p}=\\frac{p}{q}\\cdot\\frac{dq}{dp}.\\]</div>' +
        '<p>You can read it as a <em>normalised derivative</em>: take the slope, then re-scale it by the current price-to-quantity ratio so the answer is a pure number.</p>' +
        '<p><strong>Worked example.</strong> For the linear demand \\(q=-25p+1200\\), the slope is constant, \\(\\frac{dq}{dp}=-25\\). At the price \\(p=24\\), demand is \\(q=-25(24)+1200=600\\), so</p>' +
        '<div class="formula-box">\\[E_{q,p}=\\frac{24}{600}\\cdot(-25)=-1\\quad(\\text{unit elasticity at }p=24).\\]</div>' +
        '<p>For smaller prices demand is inelastic; for larger prices it becomes elastic. Reading the number (compare the absolute change in \\(q\\) with that in \\(p\\)):</p>' +
        '<ul>' +
        '<li>\\(|E|>1\\) → <strong>elastic</strong>: demand reacts <em>more</em> than proportionally (luxuries, products with easy substitutes);</li>' +
        '<li>\\(|E|<1\\) → <strong>inelastic</strong>: demand reacts <em>less</em> than proportionally (necessities, few substitutes);</li>' +
        '<li>\\(|E|=1\\) → <strong>unit</strong> elasticity; \\(E=0\\) → <strong>perfectly inelastic</strong> (demand does not react at all).</li>' +
        '</ul>' +
        '<div class="tip-box">' +
        '<h4>Watch the sign</h4>' +
        '<p>For an ordinary downward-sloping demand the slope is negative, so \\(E<0\\): raising the price <em>lowers</em> demand. The minus sign is the <em>direction</em> of the reaction; the size \\(|E|\\) is its <em>strength</em>. So \\(E=-\\tfrac43\\) reads "raise the price by 1% and demand falls by about 1.33%". Two common exam slips: dropping the minus sign, and comparing \\(E\\) itself (rather than \\(|E|\\)) with 1 when classifying elastic vs. inelastic.</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 2: ANNUITIES (RENTS) — FUTURE & PRESENT VALUE
  // ========================================================================
  annuities: {
    id: "ipmi4t",
    name: "Annuities (Rents)",
    icon: "fa-piggy-bank",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "p341by",
        question: "What is an annuity (rent), and what are the interest and discount factors?",
        answer: "An ANNUITY (rent) is a series of periodic payments of nominally equal amount \\(R\\), made at equal time intervals with the same interest rate \\(i\\) applied to each, over \\(n\\) periods.\n\n• INTEREST FACTOR: \\(r=1+i\\)\n• DISCOUNT FACTOR: \\(\\frac1r\\)\n• Basic compounding: \\(C_n=C_0\\cdot r^{n}\\)",
        explanation: "Compound, decursive capitalization is assumed (interest at the end of each period)."
      },
      {
        id: "yk9nfp",
        question: "Prenumerando vs. postnumerando — what is the difference?",
        answer: "• PRENUMERANDO: payments are made at the BEGINNING of each period.\n• POSTNUMERANDO: payments are made at the END of each period.\n\nA prenumerando payment earns interest for one extra period, so prenumerando values are the postnumerando values multiplied by \\(r\\).",
        explanation: "\"Invested at the beginning of the year\" = prenumerando; \"at the end of the year\" = postnumerando."
      },
      {
        id: "d4u3be",
        question: "Give the FUTURE (final) value formulas for an annuity.",
        answer: "POSTNUMERANDO (end of period):\n\\[S_n'=R\\cdot\\frac{r^{n}-1}{r-1}.\\]\nPRENUMERANDO (beginning of period — one extra period of interest):\n\\[S_n=R\\cdot r\\cdot\\frac{r^{n}-1}{r-1}.\\]",
        explanation: "Sₙ (prenumerando) = r · S′ₙ (postnumerando). Future value = accumulated worth of all payments at the end."
      },
      {
        id: "affbwn",
        question: "Give the PRESENT value formulas for an annuity.",
        answer: "POSTNUMERANDO (end of period):\n\\[A_n=\\frac{R}{r^{n}}\\cdot\\frac{r^{n}-1}{r-1}.\\]\nPRENUMERANDO (beginning of period):\n\\[A_n'=\\frac{R}{r^{n-1}}\\cdot\\frac{r^{n}-1}{r-1}.\\]",
        explanation: "Present value = today's worth of future payments, obtained by discounting (dividing by powers of r)."
      },
      {
        id: "5pnk1b",
        question: "How do you find the periodic payment R from a known future or present value?",
        answer: "Just invert the relevant formula. E.g. for prenumerando FUTURE value:\n\\[R=S_n\\cdot\\frac{r-1}{r\\,(r^{n}-1)}.\\]\nFor postnumerando PRESENT value:\n\\[R=A_n\\cdot\\frac{r^{n}(r-1)}{r^{n}-1}.\\]",
        explanation: "Example: S₁₂ = 540 000 €, r = 1.09, prenumerando → R ≈ 24 597.57 €."
      },
      {
        id: "2tw47m",
        question: "What does compound, decursive, annual capitalization mean?",
        answer: "• COMPOUND: interest is added to the principal and itself earns interest (\\(C_n=C_0 r^n\\)).\n• DECURSIVE: interest is calculated and added at the END of each period.\n• ANNUAL: the compounding period is one year.\n\nThe interest rate \\(p\\%\\) gives \\(i=\\frac{p}{100}\\) and \\(r=1+i\\).",
        explanation: "These are the standing assumptions for the rent and loan formulas in this course."
      }
    ],

    quiz: [
      {
        id: "d8zfq9",
        question: "The interest factor r is defined as:",
        options: ["\\(r=i\\)", "\\(r=1+i\\)", "\\(r=1-i\\)", "\\(r=\\frac{1}{i}\\)"],
        correct: 1
      },
      {
        id: "zuh2ij",
        question: "In a PRENUMERANDO annuity, payments are made:",
        options: ["At the end of each period", "At the beginning of each period", "Only once", "Randomly"],
        correct: 1
      },
      {
        id: "2qhuw7",
        question: "The future value of a POSTNUMERANDO annuity is:",
        options: ["\\(R\\cdot r\\cdot\\frac{r^n-1}{r-1}\\)", "\\(R\\cdot\\frac{r^n-1}{r-1}\\)", "\\(\\frac{R}{r^n}\\cdot\\frac{r^n-1}{r-1}\\)", "\\(R\\cdot r^n\\)"],
        correct: 1
      },
      {
        id: "dn917q",
        question: "The present value of a POSTNUMERANDO annuity is:",
        options: ["\\(R\\cdot\\frac{r^n-1}{r-1}\\)", "\\(\\frac{R}{r^n}\\cdot\\frac{r^n-1}{r-1}\\)", "\\(R\\cdot r^n\\)", "\\(\\frac{R}{r-1}\\)"],
        correct: 1
      },
      {
        id: "gehd4l",
        question: "A prenumerando future value equals the postnumerando one multiplied by:",
        options: ["\\(r^n\\)", "\\(r\\)", "\\(\\frac1r\\)", "\\(n\\)"],
        correct: 1
      },
      {
        id: "nzk8et",
        question: "An annual interest rate of p = 9% gives an interest factor r =",
        options: ["0.09", "1.09", "9", "1.9"],
        correct: 1
      },
      {
        id: "qlk9sq",
        question: "Discounting a future amount to its present value means:",
        options: ["Multiplying by rⁿ", "Dividing by the appropriate power of r", "Adding interest", "Subtracting the rate"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "vpdlm0", sentence: "A series of nominally equal periodic payments is called an _______ (rent).", answer: "annuity", hint: "Marked R" },
      { id: "g0fptn", sentence: "The interest factor is r = 1 + _______.", answer: "i", hint: "i = p/100" },
      { id: "umebye", sentence: "Payments at the beginning of each period define a _______ annuity.", answer: "prenumerando", hint: "Opposite of postnumerando" },
      { id: "2iih27", sentence: "The future value of a postnumerando annuity is S′ₙ = R·(rⁿ − 1)/(r − _______).", answer: "1", hint: "Geometric series sum" },
      { id: "qa969r", sentence: "Computing today's worth of future payments is called _______.", answer: "discounting", hint: "Divide by powers of r" },
      { id: "ncfqon", sentence: "Interest added at the END of each period is called _______ capitalization.", answer: "decursive", hint: "Standing assumption" }
    ],

    learn: {
      id: "1g8sx9",
      content:
        '<h3>Annuities (rents) — money has a time value</h3>' +
        '<p>The big idea of financial mathematics is that <strong>the same amount of money is worth different amounts at different times</strong>. 1000 € today is worth more than 1000 € in five years, because today\'s euro can be invested and earn interest. An <span class="highlight">annuity</span> (rent) is a series of nominally equal payments \\(R\\) made at equal intervals over \\(n\\) periods, each earning the same interest rate \\(i\\). We need a way to add up payments that fall at different times — and you cannot simply add them, because each lives at a different point on the time line.</p>' +
        '<p>The tool that moves money through time is the <strong>interest factor</strong>:</p>' +
        '<div class="formula-box">\\[r=1+i,\\qquad C_n=C_0\\,r^{n}\\quad(\\text{compound growth over }n\\text{ periods}).\\]</div>' +
        '<p>So an interest rate of \\(p=8\\%\\) means \\(i=0.08\\) and \\(r=1.08\\). Multiplying by \\(r\\) pushes a sum <em>forward</em> one period; dividing by \\(r\\) (the <strong>discount factor</strong> \\(\\tfrac1r\\)) pulls it <em>back</em> one period. Throughout we assume capitalization is <strong>compound</strong> (interest earns interest), <strong>decursive</strong> (interest credited at the period end) and <strong>annual</strong>.</p>' +

        '<h4>Prenumerando vs. postnumerando — when do you pay?</h4>' +
        '<p>Everything hinges on the <em>timing</em> of each payment within its period:</p>' +
        '<ul>' +
        '<li><strong>Prenumerando</strong> — paid at the <em>beginning</em> of each period ("invested at the start of the year");</li>' +
        '<li><strong>Postnumerando</strong> — paid at the <em>end</em> of each period ("at the end of the year").</li>' +
        '</ul>' +
        '<p>A beginning-of-period payment sits in the account one extra period and earns interest one more time, so <strong>every prenumerando value is the matching postnumerando value multiplied by \\(r\\)</strong>. Spotting which one a word problem describes is half the battle.</p>' +

        '<h4>Future (final) value — what you will HAVE</h4>' +
        '<p>The future value accumulates every payment forward to the end. Summing the geometric series of compounded payments gives:</p>' +
        '<div class="formula-box">\\[S_n\'=R\\cdot\\frac{r^{n}-1}{r-1}\\ \\ (\\text{post}),\\qquad S_n=R\\cdot r\\cdot\\frac{r^{n}-1}{r-1}\\ \\ (\\text{pre}).\\]</div>' +
        '<p><strong>Worked example.</strong> Invest 1000 € at the <em>start</em> of each year for 10 years at 8% (prenumerando). Then \\(r=1.08\\), \\(r^{10}\\approx2.1589\\), and</p>' +
        '<div class="formula-box">\\[S_{10}=1000\\cdot1.08\\cdot\\frac{2.1589-1}{0.08}\\approx 15\\,645.49\\ \\text{€}.\\]</div>' +

        '<h4>Present value — what to invest TODAY</h4>' +
        '<p>The present value discounts every future payment back to now, so you can fund a stream of withdrawals with one deposit today:</p>' +
        '<div class="formula-box">\\[A_n=\\frac{R}{r^{n}}\\cdot\\frac{r^{n}-1}{r-1}\\ \\ (\\text{post}),\\qquad A_n\'=\\frac{R}{r^{n-1}}\\cdot\\frac{r^{n}-1}{r-1}\\ \\ (\\text{pre}).\\]</div>' +
        '<p><strong>Worked example.</strong> To secure five end-of-year payments of 30 000 € at 5%, deposit today \\(A_5=\\frac{30000}{1.05^{5}}\\cdot\\frac{1.05^{5}-1}{0.05}\\approx 129\\,884.30\\ \\text{€}\\) — clearly less than \\(5\\times30000\\), because the later payments are discounted.</p>' +

        '<div class="tip-box">' +
        '<h4>How to read the problem (the exam decision tree)</h4>' +
        '<ul>' +
        '<li>"How much will I <strong>HAVE</strong> at the end?" → <strong>future</strong> value \\(S\\).</li>' +
        '<li>"How much must I invest <strong>TODAY</strong>?" → <strong>present</strong> value \\(A\\).</li>' +
        '<li>"At the <strong>beginning</strong> of each period" → prenumerando (×\\(r\\)); "at the <strong>end</strong>" → postnumerando.</li>' +
        '<li>Asked for the payment \\(R\\) instead? <strong>Invert</strong> the matching formula — e.g. \\(R=S_n\\cdot\\frac{r-1}{r(r^{n}-1)}\\).</li>' +
        '</ul>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 3: CASH LOANS
  // ========================================================================
  loans: {
    id: "n4a19h",
    name: "Cash Loans",
    icon: "fa-money-bill-wave",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "oox546",
        question: "What is a loan annuity, and of what two parts does it consist?",
        answer: "A loan is repaid through ANNUITIES \\(A_k\\). Each annuity consists of two parts:\n\\[A_k = R_k + I_k,\\]\n• \\(R_k\\) — the REPAYMENT QUOTA (the part that reduces the principal)\n• \\(I_k\\) — the INTEREST on the remaining debt: \\(I_k=\\frac{C_{k-1}\\cdot p}{100}\\).\n\nA repayment plan (table) lists annuity, interest, quota and remaining debt for each period.",
        explanation: "The loan can be repaid with equal annuities OR equal repayment quotas."
      },
      {
        id: "siqif9",
        question: "What are the three standard CONTROLS of a repayment plan?",
        answer: "a) The last period's repayment quota equals the previous remaining debt: \\(R_k=C_{k-1}\\).\nb) The sum of all repayment quotas equals the loan: \\(\\sum R_k=C_0\\).\nc) The sum of all quotas + the sum of all interest = the sum of all annuities: \\(\\sum R_k+\\sum I_k=\\sum A_k\\).",
        explanation: "These checks confirm the repayment table was computed correctly."
      },
      {
        id: "c9gd58",
        question: "Give the formula for the (nominally equal) loan annuity.",
        answer: "For the equal-annuities model (postnumerando), use the present value of a postnumerando annuity with \\(A_n\\to C\\), \\(R\\to a\\):\n\\[a=C\\cdot\\frac{r^{n}(r-1)}{r^{n}-1},\\qquad r=1+\\frac{p}{100}.\\]\nThe loan is the discounted value of the future equal repayments.",
        explanation: "Example: C = 130 000 €, n = 6, p = 10% → a ≈ 29 848.96 €."
      },
      {
        id: "clgc5e",
        question: "How does the equal-annuities model behave over time (interest vs. quota)?",
        answer: "The annuity \\(a\\) is constant, but its split changes:\n• Interest \\(I_k=\\frac{C_{k-1}p}{100}\\) DECREASES (the remaining debt shrinks).\n• Repayment quota \\(R_k=a-I_k\\) INCREASES, and grows geometrically: \\(R_k=R_1\\cdot r^{k-1}\\).\n• Remaining debt \\(C_k=C_{k-1}-R_k\\) decreases to 0.",
        explanation: "Early annuities are mostly interest; later annuities are mostly principal."
      },
      {
        id: "x4crvi",
        question: "Describe the equal-REPAYMENT-QUOTAS model.",
        answer: "Here the repayment quota is constant:\n\\[R=\\frac{C}{n}.\\]\nInterest and annuity decrease each period:\n\\[I_i=\\frac{C_{i-1}\\,p}{100},\\quad a_i=R+I_i,\\quad C_i=C\\left(1-\\frac{i}{n}\\right).\\]\nThe annuity \\(a_i\\) falls over time because the interest on a shrinking debt falls.",
        explanation: "Unlike the equal-annuities model, here the annuity itself is variable (decreasing)."
      },
      {
        id: "uadznq",
        question: "What is total interest paid on a loan?",
        answer: "The total interest is the price of having the money today — the sum of all annuities minus the loan amount:\n\\[\\sum I_k=\\sum A_k - C_0.\\]",
        explanation: "It is what the borrower pays the lender over and above repaying the principal."
      }
    ],

    quiz: [
      {
        id: "kstwmj",
        question: "A loan annuity \\(A_k\\) consists of:",
        options: ["Only interest", "Only the repayment quota", "Repayment quota + interest (\\(A_k=R_k+I_k\\))", "Principal × rate"],
        correct: 2
      },
      {
        id: "j4h9dw",
        question: "The interest in period k is computed as:",
        options: ["\\(I_k=\\frac{C_{k-1}\\cdot p}{100}\\)", "\\(I_k=\\frac{C_0\\cdot p}{100}\\)", "\\(I_k=a\\cdot r\\)", "\\(I_k=\\frac{C}{n}\\)"],
        correct: 0
      },
      {
        id: "pr5prl",
        question: "The sum of all repayment quotas equals:",
        options: ["The total interest", "The loan amount \\(C_0\\)", "The last annuity", "Zero"],
        correct: 1
      },
      {
        id: "ag10gs",
        question: "The nominally-equal loan annuity is:",
        options: ["\\(a=\\frac{C}{n}\\)", "\\(a=C\\cdot\\frac{r^n(r-1)}{r^n-1}\\)", "\\(a=C\\cdot r^n\\)", "\\(a=C\\cdot(r-1)\\)"],
        correct: 1
      },
      {
        id: "7z9a0d",
        question: "In the equal-ANNUITIES model, over time the interest part of each annuity:",
        options: ["Increases", "Decreases", "Stays constant", "Is always zero"],
        correct: 1
      },
      {
        id: "qd1bgq",
        question: "In the equal-repayment-QUOTAS model, the repayment quota is:",
        options: ["\\(R=\\frac{C}{n}\\)", "\\(R=C\\cdot r^n\\)", "Variable", "Equal to the interest"],
        correct: 0
      },
      {
        id: "xavrao",
        question: "Total interest paid equals:",
        options: ["\\(\\sum A_k + C_0\\)", "\\(\\sum A_k - C_0\\)", "\\(C_0\\)", "\\(\\frac{C_0}{n}\\)"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "na15bc", sentence: "Each loan annuity Aₖ = repayment quota Rₖ + _______.", answer: "interest", hint: "Iₖ on the remaining debt" },
      { id: "uhkhcw", sentence: "Interest in period k is Iₖ = Cₖ₋₁·p / _______.", answer: "100", hint: "p is the percentage rate" },
      { id: "84yk36", sentence: "The sum of all repayment quotas equals the loan amount _______.", answer: "C0", hint: "ΣRₖ = C₀ (control b)" },
      { id: "5ykwfb", sentence: "In the equal-annuities model the annuity a is _______ (does not change).", answer: "constant", hint: "Only its split shifts" },
      { id: "tuklbs", sentence: "In the equal-repayment-quotas model R = C / _______.", answer: "n", hint: "n = number of periods" },
      { id: "hjiqlq", sentence: "Total interest = sum of all annuities − loan amount, i.e. ΣIₖ = ΣAₖ − _______.", answer: "C0", hint: "The principal" }
    ],

    learn: {
      id: "xsz2le",
      content:
        '<h3>Cash loans — an annuity seen from the other side</h3>' +
        '<p>A loan reuses everything from the annuity unit, just viewed from the lender\'s desk. The bank hands you \\(C=C_0\\) <em>today</em>; in return you make a stream of future payments. So the loan is simply the <strong>present value of your future repayments</strong> — which is why the same compounding factor \\(r=1+\\frac{p}{100}\\) reappears here.</p>' +
        '<p>Each payment is called an <strong>annuity</strong> \\(A_k\\), and it does two jobs at once. Part of it pays the <span class="highlight">interest</span> the bank charges on what you still owe; the rest, the <span class="highlight">repayment quota</span> \\(R_k\\), actually shrinks the debt:</p>' +
        '<div class="formula-box">\\[A_k=R_k+I_k,\\qquad I_k=\\frac{C_{k-1}\\cdot p}{100}.\\]</div>' +
        '<p>Notice the interest is charged on \\(C_{k-1}\\), the debt <em>left over from the previous period</em> — not on the original loan. The whole repayment is laid out in a <strong>repayment plan (table)</strong> with four columns: annuity, interest, quota and remaining debt. Two <strong>controls</strong> confirm the table is correct: the quotas must rebuild the loan, \\(\\sum R_k=C_0\\), and quotas plus interest must equal all annuities, \\(\\sum R_k+\\sum I_k=\\sum A_k\\).</p>' +

        '<h4>Model 1 — nominally equal annuities (the usual home loan)</h4>' +
        '<p>You pay the <em>same amount</em> every period. Since the loan is the present value of these equal postnumerando payments, inverting that annuity formula gives:</p>' +
        '<div class="formula-box">\\[a=C\\cdot\\frac{r^{n}(r-1)}{r^{n}-1},\\qquad r=1+\\frac{p}{100}.\\]</div>' +
        '<p><strong>Worked example.</strong> A loan of 130 000 € over 6 years at 10% gives \\(r=1.1\\), \\(r^{6}\\approx1.7716\\), so \\(a=130000\\cdot\\frac{1.7716\\cdot0.1}{0.7716}\\approx 29\\,848.96\\ \\text{€}\\) per year. Although \\(a\\) is constant, its <em>split shifts</em>: early on the debt is large so most of the payment is interest; as the debt shrinks the interest \\(I_k\\) <strong>falls</strong> and the quota \\(R_k=a-I_k\\) <strong>grows</strong> (in fact \\(R_k=R_1 r^{k-1}\\)). That is why paying a mortgage off early saves so much — the late payments are almost all principal.</p>' +

        '<h4>Model 2 — nominally equal repayment quotas</h4>' +
        '<p>Here you instead repay the <em>same slice of principal</em> each period, so the quota is fixed and easy:</p>' +
        '<div class="formula-box">\\[R=\\frac{C}{n},\\quad I_i=\\frac{C_{i-1}\\,p}{100},\\quad a_i=R+I_i,\\quad C_i=C\\left(1-\\frac{i}{n}\\right).\\]</div>' +
        '<p>Now it is the <strong>annuity that decreases</strong> over time: the quota stays put, but the interest on a steadily shrinking debt falls, so each payment is a little smaller than the last. You pay more at the start than under Model 1, but less interest overall.</p>' +

        '<div class="tip-box">' +
        '<h4>What does the loan actually cost?</h4>' +
        '<p>The total interest is the price you pay for having the money today — the sum of everything you hand back minus what you borrowed: \\(\\sum I_k=\\sum A_k-C_0\\). It is the single number that tells you how expensive a loan really is, independent of the repayment model.</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 4: GAUSS-JORDAN METHOD
  // ========================================================================
  gaussJordan: {
    id: "5zn4q5",
    name: "Gauss & Gauss-Jordan Method",
    icon: "fa-table-cells",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "3ptmvt",
        question: "What is the goal of the Gauss-Jordan method?",
        answer: "To solve a linear system by writing it as an AUGMENTED matrix \\([A\\mid b]\\) and using elementary row operations to reduce the left side to the IDENTITY (unit) matrix:\n\\[\\left[\\begin{array}{ccc|c}a_{11}&a_{12}&a_{13}&b_1\\\\a_{21}&a_{22}&a_{23}&b_2\\\\a_{31}&a_{32}&a_{33}&b_3\\end{array}\\right]\\sim\\left[\\begin{array}{ccc|c}1&0&0&a\\\\0&1&0&b\\\\0&0&1&c\\end{array}\\right].\\]\nThe last column then gives the solution.",
        explanation: "Gauss-Jordan reduces fully to reduced row echelon form (identity on the left when a unique solution exists)."
      },
      {
        id: "zonfe4",
        question: "What is the difference between the GAUSS method and the GAUSS-JORDAN method?",
        answer: "Both use the same elementary row operations on the augmented matrix \\([A\\mid b]\\); they differ in HOW FAR they reduce:\n• GAUSS (elimination): reduce only to an UPPER-TRIANGULAR form (row echelon — zeros below the diagonal), then finish with BACK-SUBSTITUTION (solve the last variable, substitute upward).\n\\[\\left[\\begin{array}{ccc|c}1&*&*&*\\\\0&1&*&*\\\\0&0&1&*\\end{array}\\right]\\]\n• GAUSS-JORDAN: keep going until the left block is the FULL IDENTITY (zeros above AND below the diagonal) — no back-substitution needed; the solution is read straight off the last column.",
        explanation: "Gauss = upper triangle + back-substitution; Gauss-Jordan = full identity (reduced row echelon), answer read directly. Same operations, Gauss-Jordan just does more of them."
      },
      {
        id: "a43kqr",
        question: "Which part of the augmented matrix may elementary operations act on — rows or columns?",
        answer: "ROWS ONLY. Each row is one equation, so swapping, scaling or combining ROWS keeps the system equivalent. You must NEVER apply these operations to COLUMNS — a column mixes the coefficients of different unknowns across all equations, which changes the system and destroys the solution.",
        explanation: "Row operations = legal moves on equations. Column operations are not allowed when solving a system this way."
      },
      {
        id: "h153o1",
        question: "What are the three ELEMENTARY ROW OPERATIONS?",
        answer: "1. SWAP two rows.\n2. MULTIPLY a row by a non-zero number.\n3. Add a MULTIPLE of one row to another row.\n\nThese operations do not change the solution set of the system.",
        explanation: "They mirror the legal manipulations of equations: reorder, scale, and add equations."
      },
      {
        id: "kud1t7",
        question: "What is a pivot (leading) element?",
        answer: "A PIVOT is the leading 1 in a row that we use to eliminate the entries above and below it in its column. We often swap rows or scale a row to place a 1 in the pivot position (e.g. position (1,1)) before clearing the rest of the column.",
        explanation: "Working pivot by pivot down the diagonal turns the left block into the identity matrix."
      },
      {
        id: "922jzd",
        question: "How can you tell a system has a UNIQUE solution from the reduced matrix?",
        answer: "The left block reduces to the full IDENTITY matrix:\n\\[\\left[\\begin{array}{ccc|c}1&0&0&a\\\\0&1&0&b\\\\0&0&1&c\\end{array}\\right].\\]\nThen \\(x_1=a,\\ x_2=b,\\ x_3=c\\) — exactly one solution.",
        explanation: "Every unknown has a pivot; no free variables and no contradiction."
      },
      {
        id: "yjn34g",
        question: "How do you recognise INFINITELY MANY solutions?",
        answer: "A row of all zeros appears (including the augmented entry): \\([\\,0\\ 0\\ 0\\mid 0\\,]\\). Then at least one variable is FREE — set it to a parameter \\(t\\in\\mathbb{R}\\) and express the others in terms of \\(t\\).",
        explanation: "E.g. x₃ = t gives x₁ = 2t − 3, x₂ = 2t − 5 — an infinite family of solutions."
      },
      {
        id: "re64yb",
        question: "How do you recognise that a system has NO solution?",
        answer: "A row of the form \\([\\,0\\ 0\\ 0\\mid k\\,]\\) with \\(k\\neq 0\\) appears. This says \\(0=k\\) (a contradiction), so the system is inconsistent and has NO solution.",
        explanation: "0·x₁ + 0·x₂ + 0·x₃ = −2 can never hold → no solution."
      }
    ],

    quiz: [
      {
        id: "h1rknd",
        question: "The Gauss-Jordan method aims to reduce the left block of the augmented matrix to:",
        options: ["A diagonal of zeros", "The identity (unit) matrix", "An upper triangle of 2s", "A single row"],
        correct: 1
      },
      {
        id: "qd2sl9",
        question: "Which is NOT an elementary row operation?",
        options: ["Swapping two rows", "Multiplying a row by a non-zero number", "Adding a multiple of one row to another", "Multiplying a row by 0"],
        correct: 3
      },
      {
        id: "vlrmg0",
        question: "The GAUSS method reduces the matrix to an upper-triangular form and then finishes with:",
        options: ["Back-substitution", "Reducing to the identity matrix", "Column operations", "The quadratic formula"],
        correct: 0
      },
      {
        id: "l8ykil",
        question: "What distinguishes Gauss-Jordan from the plain Gauss method?",
        options: ["It uses different row operations", "It reduces all the way to the identity matrix (no back-substitution)", "It works on columns instead of rows", "It only finds the first variable"],
        correct: 1
      },
      {
        id: "6oxb4j",
        question: "Elementary operations when solving a linear system may be applied to:",
        options: ["Columns only", "Rows only", "Both rows and columns freely", "The diagonal only"],
        correct: 1
      },
      {
        id: "4fvlk4",
        question: "A pivot element is used to:",
        options: ["Delete a column", "Eliminate the other entries in its column", "Swap the matrix", "Add a new equation"],
        correct: 1
      },
      {
        id: "3fn12x",
        question: "If the left block reduces to the identity matrix, the system has:",
        options: ["No solution", "A unique solution", "Infinitely many solutions", "Two solutions"],
        correct: 1
      },
      {
        id: "aexb4w",
        question: "A row \\([\\,0\\ 0\\ 0\\mid 0\\,]\\) in the reduced matrix indicates:",
        options: ["A unique solution", "Infinitely many solutions (a free variable)", "No solution", "An error"],
        correct: 1
      },
      {
        id: "qzw431",
        question: "A row \\([\\,0\\ 0\\ 0\\mid k\\,]\\) with \\(k\\neq 0\\) indicates:",
        options: ["A unique solution", "Infinitely many solutions", "No solution (contradiction)", "A pivot"],
        correct: 2
      }
    ],

    fillBlanks: [
      { id: "a0xdzc", sentence: "A linear system is written for Gauss-Jordan as an _______ matrix [A | b].", answer: "augmented", hint: "Coefficients plus the right-hand side" },
      { id: "vgkjiq", sentence: "The goal is to reduce the left block to the _______ matrix.", answer: "identity", hint: "1s on the diagonal, 0s elsewhere" },
      { id: "p679s1", sentence: "The leading 1 used to clear a column is called the _______.", answer: "pivot", hint: "Pivot element" },
      { id: "fs2v1j", sentence: "The Gauss method stops at an upper-triangular matrix and then uses back-_______.", answer: "substitution", hint: "Solve last variable, work upward" },
      { id: "cf44mw", sentence: "Gauss-Jordan reduces all the way to the _______ matrix, so no back-substitution is needed.", answer: "identity", hint: "Full reduced row echelon form" },
      { id: "29j8vd", sentence: "Elementary operations may be applied to _______, never to columns.", answer: "rows", hint: "Each row is one equation" },
      { id: "u2tjt5", sentence: "Multiplying a row by a _______ number is an elementary row operation.", answer: "non-zero", hint: "Zero would destroy information" },
      { id: "27jk1l", sentence: "A zero row [0 0 0 | 0] signals _______ many solutions (a free variable).", answer: "infinitely", hint: "Set the free variable = t" },
      { id: "to702l", sentence: "A row [0 0 0 | k] with k ≠ 0 means the system has _______ solution.", answer: "no", hint: "Contradiction 0 = k" }
    ],

    learn: {
      id: "v7u42x",
      content:
        '<h3>The Gauss-Jordan method — solving systems by bookkeeping</h3>' +
        '<p>When several quantities must satisfy several linear conditions at once, we have a <strong>system of linear equations</strong>. Solving it by hand by substitution gets messy fast with three or more unknowns. The Gauss-Jordan method turns it into pure, mechanical <em>bookkeeping</em>: strip away the \\(x\\)\'s and \\(y\\)\'s, keep only the numbers in a grid, and tidy that grid by fixed rules until the answer is sitting in the last column.</p>' +
        '<p>First write the system as an <span class="highlight">augmented matrix</span> \\([A\\mid b]\\) — the coefficients on the left, the right-hand sides after the bar. The goal is to reshape the left block into the <strong>identity matrix</strong> (ones down the diagonal, zeros elsewhere). When you reach it, each row literally reads \\(x_i = \\text{number}\\):</p>' +
        '<div class="formula-box">\\[\\left[\\begin{array}{ccc|c}a_{11}&a_{12}&a_{13}&b_1\\\\a_{21}&a_{22}&a_{23}&b_2\\\\a_{31}&a_{32}&a_{33}&b_3\\end{array}\\right]\\ \\sim\\ \\left[\\begin{array}{ccc|c}1&0&0&a\\\\0&1&0&b\\\\0&0&1&c\\end{array}\\right]\\;\\Rightarrow\\;x_1=a,\\ x_2=b,\\ x_3=c.\\]</div>' +

        '<h4>The only three moves you are allowed</h4>' +
        '<p>You may transform the matrix using exactly three <strong>elementary row operations</strong> — and crucially, none of them changes the system\'s solution (they are just the legal moves on equations: reorder them, scale one, or add one to another):</p>' +
        '<ul>' +
        '<li><strong>Swap</strong> two rows;</li>' +
        '<li><strong>Multiply</strong> a row by a non-zero number (multiplying by 0 would erase an equation — forbidden);</li>' +
        '<li>Add a <strong>multiple of one row to another</strong> row.</li>' +
        '</ul>' +
        '<p>The strategy is to work <strong>pivot by pivot</strong>: in each diagonal position get a leading 1 (the <strong>pivot</strong>, by swapping or scaling), then use that pivot to clear every other entry in its column to 0. Do this column by column and the left block becomes the identity.</p>' +
        '<p><strong>One absolute rule:</strong> these operations act on <span class="highlight">rows, never on columns</span>. Each row <em>is</em> one equation, so reordering, scaling or combining rows leaves the system equivalent. A column, by contrast, holds the coefficient of a single unknown across <em>all</em> the equations — touching a column would scramble different equations together and change the problem. Operate on rows only.</p>' +

        '<h4>Gauss vs. Gauss-Jordan — how far do you reduce?</h4>' +
        '<p>Two related methods use exactly these row operations; they differ only in <em>where they stop</em>:</p>' +
        '<ul>' +
        '<li><strong>Gauss (elimination)</strong> reduces only to an <strong>upper-triangular</strong> shape — leading 1s on the diagonal and zeros <em>below</em> it (row echelon form). You then finish by <strong>back-substitution</strong>: the bottom row gives the last unknown directly, and you substitute it upward to recover the rest.</li>' +
        '<li><strong>Gauss-Jordan</strong> keeps going past the triangle, clearing the entries <em>above</em> the diagonal too, until the left block is the <strong>full identity</strong> (reduced row echelon form). No back-substitution is needed — every unknown is read straight off the last column.</li>' +
        '</ul>' +
        '<div class="formula-box">\\[\\underbrace{\\left[\\begin{array}{ccc|c}1&*&*&*\\\\0&1&*&*\\\\0&0&1&*\\end{array}\\right]}_{\\text{Gauss: triangle + back-substitution}}\\qquad\\underbrace{\\left[\\begin{array}{ccc|c}1&0&0&a\\\\0&1&0&b\\\\0&0&1&c\\end{array}\\right]}_{\\text{Gauss-Jordan: identity, read directly}}\\]</div>' +
        '<p>Same legal moves, same answer — Gauss-Jordan simply does the extra work up front so the reading is trivial at the end.</p>' +

        '<div class="tip-box">' +
        '<h4>Reading the result — three possible outcomes</h4>' +
        '<p>A linear system does not always have one neat answer. The reduced matrix tells you which of three cases you are in:</p>' +
        '<ul>' +
        '<li><strong>Unique solution</strong> — the left block becomes the full identity, so \\(x_1=a,\\ x_2=b,\\ x_3=c\\). Every unknown is pinned down.</li>' +
        '<li><strong>Infinitely many solutions</strong> — a whole row goes to zero, \\([0\\,0\\,0\\mid 0]\\) (it says \\(0=0\\), always true). One unknown is then <em>free</em>: set it to a parameter \\(t\\in\\mathbb{R}\\) and write the rest in terms of \\(t\\), e.g. \\(x_1=2t-3,\\ x_2=2t-5,\\ x_3=t\\).</li>' +
        '<li><strong>No solution</strong> — a row \\([0\\,0\\,0\\mid k]\\) with \\(k\\neq 0\\) appears. It claims \\(0=k\\), a flat contradiction, so the system is inconsistent.</li>' +
        '</ul>' +
        '<p>So a zero on <em>both</em> sides means freedom; a zero only on the left means impossibility. Telling these two apart is the most common exam question on this topic.</p>' +
        '</div>'
    }
  }

};

// Expose on window (catalog looks it up by name); also CommonJS for node tests.
if (typeof window !== "undefined") { window.mathM2 = mathM2; }
if (typeof module !== "undefined" && module.exports) { module.exports = mathM2; }
