// ===== MATHEMATICS — FINAL (hybrid K1 + K2 + exam practice) =====
// mathFinal = Object.assign({}, mathM1, mathM2, { examPractice })
// MUST load LAST (after midterm-1.js and midterm-2.js put mathM1/mathM2 on window).
//
// ⚠ QUANTITATIVE — KaTeX (ADR-009): inline "\\( ... \\)", display "\\[ ... \\]". No single `$`.
// ⚠ CACHE: when editing data/*, bump CONTENT_VERSION in js/content-loader.js.

// Cross-topic exam-practice category — synthesises K1 (real numbers → extrema) and
// K2 (integrals/elasticity, annuities, loans, Gauss-Jordan) into one "big picture" deck.
const mathExamPractice = {
  id: "v02ar4",
  name: "Exam Practice (All Topics)",
  icon: "fa-graduation-cap",
  color: "#8b5cf6",

  flashcards: [
    {
      id: "1nf4pc",
      question: "How are differentiation and integration related, and how is each used in cost analysis?",
      answer: "They are INVERSE operations.\n• DERIVATIVE: marginal cost from total cost — \\(M(Q)=T'(Q)\\).\n• INTEGRAL: total cost from marginal cost — \\(T(Q)=\\int M(Q)\\,dQ\\) (with C = fixed cost).\n\nPower rules mirror each other:\n\\[(x^n)'=n x^{n-1},\\qquad \\int x^n\\,dx=\\frac{1}{n+1}x^{n+1}+C.\\]",
      explanation: "Differentiate to go total → marginal; integrate to go marginal → total."
    },
    {
      id: "dzktic",
      question: "Optimisation cheat-sheet: how do you find a firm's best operating point?",
      answer: "Use the first derivative to find stationary points, the second to classify:\n• MAX PROFIT: solve \\(D'(Q)=0\\) (with \\(D''<0\\)), where \\(D(Q)=P(Q)-T(Q)\\).\n• MIN AVERAGE COST: solve \\(\\overline{T}'(Q)=0\\) (with \\(\\overline{T}''>0\\)), where \\(\\overline{T}(Q)=\\frac{T(Q)}{Q}\\).\n• MARGINAL COST: \\(M(Q)=T'(Q)\\).",
      explanation: "Optimise on the margin: set the relevant derivative to zero, then confirm with the second-derivative test."
    },
    {
      id: "febm4n",
      question: "How does elasticity of demand use the derivative?",
      answer: "Elasticity combines the derivative with a price/quantity ratio:\n\\[E_{q,p}=\\frac{p}{q}\\cdot\\frac{dq}{dp}.\\]\nFor linear demand \\(q=mp+c\\), \\(E_{q,p}=\\frac{mp}{mp+c}\\). \\(|E|>1\\) elastic, \\(|E|<1\\) inelastic; the sign gives the direction of change.",
      explanation: "Elasticity is a normalised (unit-free) derivative — % change in q per % change in p."
    },
    {
      id: "nr6i4v",
      question: "How are loans connected to annuities?",
      answer: "A loan is the PRESENT VALUE of the future repayments (a postnumerando annuity). Replacing \\(A_n\\to C\\), \\(R\\to a\\) in the present-value formula gives the equal loan annuity:\n\\[a=C\\cdot\\frac{r^{n}(r-1)}{r^{n}-1},\\qquad r=1+\\frac{p}{100}.\\]",
      explanation: "Financial maths reuses the same compounding tool (r = 1 + i) for rents and loans."
    },
    {
      id: "h7chti",
      question: "Which equation type gives how many solutions — quick recap?",
      answer: "• Linear \\(ax+b=0\\): one solution.\n• Quadratic \\(ax^2+bx+c=0\\): two (\\(D>0\\)), one (\\(D=0\\)), none real (\\(D<0\\)), where \\(D=b^2-4ac\\).\n• Biquadratic \\(ax^4+bx^2+c=0\\): up to four (substitute \\(t=x^2\\)).\n• Linear system (Gauss-Jordan): unique (identity), infinite (zero row \\([0\\,0\\,0\\mid 0]\\)), or none (\\([0\\,0\\,0\\mid k],\\ k\\neq0\\)).",
      explanation: "The degree (or the reduced matrix form) tells you the number of solutions."
    },
    {
      id: "rn9y47",
      question: "What is the single most-used pair of formulas across the whole course?",
      answer: "The power rules of calculus, used everywhere from cost curves to integrals:\n\\[\\frac{d}{dx}x^n=n x^{n-1},\\qquad \\int x^n\\,dx=\\frac{1}{n+1}x^{n+1}+C\\ (n\\neq-1).\\]\nWith the chain rule \\([f(g)]'=f'(g)\\,g'\\) they cover polynomials, roots, exponentials and logarithms.",
      explanation: "Master these two and most exam computations follow."
    }
  ],

  quiz: [
    {
      id: "cfmfr4",
      question: "Total cost is recovered from marginal cost by:",
      options: ["Differentiating", "Integrating: \\(T(Q)=\\int M(Q)\\,dQ\\)", "Dividing by Q", "Setting it to zero"],
      correct: 1
    },
    {
      id: "t1cqew",
      question: "To maximise profit \\(D(Q)\\) you solve \\(D'(Q)=0\\) and check that:",
      options: ["\\(D''>0\\)", "\\(D''<0\\)", "\\(D=0\\)", "\\(D'>0\\)"],
      correct: 1
    },
    {
      id: "5t9g5p",
      question: "The elasticity coefficient is:",
      options: ["\\(\\frac{dq}{dp}\\)", "\\(\\frac{p}{q}\\cdot\\frac{dq}{dp}\\)", "\\(p\\cdot q\\)", "\\(\\frac{q}{p}\\)"],
      correct: 1
    },
    {
      id: "6auqlg",
      question: "The equal loan annuity formula \\(a=C\\cdot\\frac{r^n(r-1)}{r^n-1}\\) comes from the:",
      options: ["Future value of an annuity", "Present value of a postnumerando annuity", "Power rule", "Discriminant"],
      correct: 1
    },
    {
      id: "f1frcj",
      question: "A reduced augmented matrix with a row \\([0\\,0\\,0\\mid 5]\\) means the system has:",
      options: ["A unique solution", "Infinitely many solutions", "No solution", "Two solutions"],
      correct: 2
    },
    {
      id: "hrnmwx",
      question: "Which substitution solves a biquadratic \\(ax^4+bx^2+c=0\\)?",
      options: ["\\(t=x\\)", "\\(t=x^2\\)", "\\(t=\\sqrt x\\)", "\\(t=\\ln x\\)"],
      correct: 1
    },
    {
      id: "oxwkg4",
      question: "Marginal cost is to total cost as the ______ is to the original function:",
      options: ["Integral", "Derivative", "Reciprocal", "Logarithm"],
      correct: 1
    }
  ],

  fillBlanks: [
    { id: "qmswul", sentence: "Differentiation and integration are _______ operations.", answer: "inverse", hint: "One undoes the other" },
    { id: "f4a22c", sentence: "Marginal cost is the derivative of total cost: M(Q) = T′(Q); total cost is the _______ of marginal cost.", answer: "integral", hint: "T(Q) = ∫ M(Q) dQ" },
    { id: "bzt6ey", sentence: "To maximise profit, solve D′(Q) = 0 and confirm with the _______ derivative test.", answer: "second", hint: "D″ < 0 for a maximum" },
    { id: "s9vt2m", sentence: "Elasticity E = (p/q)·(dq/dp); if |E| > 1 demand is _______.", answer: "elastic", hint: "Reacts more than proportionally" },
    { id: "0jnyee", sentence: "A loan equals the _______ value of its future repayments (an annuity).", answer: "present", hint: "Discounted to today" },
    { id: "181en7", sentence: "A linear system reduces (Gauss-Jordan) to the _______ matrix when it has a unique solution.", answer: "identity", hint: "1s on the diagonal" }
  ],

  learn: {
    id: "ukcc4x",
    content:
      '<h3>Exam practice — the whole picture</h3>' +
      '<p>The course is one connected story: build numbers and functions, learn to differentiate, then use derivatives (and their inverse, the integral) to analyse and optimise economic quantities, and finally apply the same compounding tool to finance and a matrix method to systems. Keep this master list at hand.</p>' +

      '<h4>Calculus core (used everywhere)</h4>' +
      '<div class="formula-box">\\[(x^n)\'=n x^{n-1},\\qquad \\int x^n\\,dx=\\frac{1}{n+1}x^{n+1}+C\\ (n\\neq-1),\\qquad [f(g)]\'=f\'(g)\\,g\'.\\]</div>' +

      '<h4>Optimisation &amp; economics</h4>' +
      '<div class="formula-box">\\[M(Q)=T\'(Q),\\quad T(Q)=\\int M(Q)\\,dQ,\\quad D(Q)=P(Q)-T(Q),\\quad \\overline{T}(Q)=\\frac{T(Q)}{Q},\\quad E_{q,p}=\\frac{p}{q}\\frac{dq}{dp}.\\]</div>' +
      '<p>Maximise profit: \\(D\'(Q)=0,\\ D\'\'<0\\). Minimise average cost: \\(\\overline{T}\'(Q)=0,\\ \\overline{T}\'\'>0\\).</p>' +

      '<h4>Equations</h4>' +
      '<div class="formula-box">\\[x=-\\frac{b}{a}\\ (\\text{linear}),\\qquad x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\ (\\text{quadratic}),\\qquad t=x^2\\ (\\text{biquadratic}).\\]</div>' +

      '<h4>Financial mathematics</h4>' +
      '<div class="formula-box">\\[r=1+\\frac{p}{100},\\quad S_n\'=R\\frac{r^n-1}{r-1},\\quad A_n=\\frac{R}{r^n}\\frac{r^n-1}{r-1},\\quad a=C\\frac{r^n(r-1)}{r^n-1}.\\]</div>' +

      '<div class="tip-box">' +
      '<h4>Gauss-Jordan outcomes</h4>' +
      '<p>Reduce \\([A\\mid b]\\) with elementary row operations: identity → unique solution; zero row \\([0\\,0\\,0\\mid 0]\\) → infinitely many (free parameter \\(t\\)); \\([0\\,0\\,0\\mid k],\\ k\\neq0\\) → no solution.</p>' +
      '</div>'
  }
};

// Hybrid: K1 + K2 + exam practice. mathM1 / mathM2 are on window (loaded earlier).
const mathFinal = Object.assign(
  {},
  (typeof window !== "undefined" ? window.mathM1 : require("./midterm-1.js")) || {},
  (typeof window !== "undefined" ? window.mathM2 : require("./midterm-2.js")) || {},
  { examPractice: mathExamPractice }
);

if (typeof window !== "undefined") { window.mathFinal = mathFinal; }
if (typeof module !== "undefined" && module.exports) { module.exports = mathFinal; }
