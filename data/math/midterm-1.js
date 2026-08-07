// ===== MATHEMATICS — 1st MIDTERM (K1) =====
// Source: lecture decks 1–5 (PhD Iva Mrša Haber & Ante Funtak, prof.; FMTU Opatija, 1st year HM).
// Textbook: Mihalinčić, K. & Mrša Haber, I. "Mathematics" (FMTU script, 2017);
//           Klaričić Bakula & Braić, "Introduction to Mathematics" (Split, 2011/12).
// K1/K2 boundary AUTHORITATIVE from the syllabus: K1 = topics 1–5 (up to extrema).
//   1. Field of Real Numbers ℝ        2. Basic Equations on ℝ
//   3. Functions                       4. Differentiation
//   5. Increase, Decrease & Extrema
//
// ⚠ QUANTITATIVE SUBJECT — uses KaTeX (ADR-009). Convention (docs/architecture/CONTENT_SCHEMA.md §Math):
//   inline  \( ... \)   (in a JS string: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   A single `$` is NEVER used (currency-safe). A LaTeX backslash in a string = "\\".
// ⚠ CACHE: when editing data/*, bump CONTENT_VERSION in js/content-loader.js.

const mathM1 = {

  // ========================================================================
  // CATEGORY 1: FIELD OF REAL NUMBERS ℝ
  // ========================================================================
  realNumbers: {
    id: "amkpc8",
    name: "Field of Real Numbers ℝ",
    icon: "fa-infinity",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "ctaiy4",
        question: "What are the five number sets, and how are they nested?",
        answer: "• \\(\\mathbb{N}\\) — natural numbers (counting): \\(\\{1,2,3,\\dots\\}\\)\n• \\(\\mathbb{Z}\\) — integers: \\(\\{\\dots,-2,-1,0,1,2,\\dots\\}\\)\n• \\(\\mathbb{Q}\\) — rational numbers: \\(\\frac{m}{n},\\ m,n\\in\\mathbb{Z},\\ n\\neq 0\\)\n• \\(\\mathbb{I}\\) — irrational numbers (infinite non-periodic decimals)\n• \\(\\mathbb{R}\\) — real numbers\n\nThe chain of subsets: \\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\), and \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\).",
        explanation: "Each set is an extension of the previous one, introduced to make a new operation always possible. ℚ and 𝕀 are disjoint (ℚ ⊄ 𝕀)."
      },
      {
        id: "yw609p",
        question: "Why is the set of integers \\(\\mathbb{Z}\\) introduced as an extension of \\(\\mathbb{N}\\)?",
        answer: "In \\(\\mathbb{N}\\) you cannot always subtract: when the minuend is smaller than the subtrahend (e.g. \\(3-5\\)), there is no natural-number result. So \\(\\mathbb{N}\\) has no inverse element for addition.\n\n\\(\\mathbb{Z}\\) adds \\(0\\) (the neutral element for addition) and the negatives \\(-a\\) (the opposite/inverse), so subtraction \\(a-b=a+(-b)\\) is always defined.",
        explanation: "ℕ₀ = ℕ ∪ {0}. Each extension is built to supply a missing inverse: ℤ for subtraction, ℚ for division."
      },
      {
        id: "7d49n3",
        question: "What is a rational number, and what three decimal forms can it take?",
        answer: "A rational number is any number of the form \\(\\frac{m}{n}\\) with \\(m,n\\in\\mathbb{Z},\\ n\\neq 0\\). It is introduced so that division is always possible (the reciprocal \\(a^{-1}=\\tfrac1a\\) exists for \\(a\\neq 0\\)).\n\nDecimal forms:\n1. Finite: \\(\\frac34=0.75\\)\n2. Periodic, one repeating digit: \\(34.5555\\dots=34.\\dot5\\)\n3. Periodic, a repeating group: \\(\\frac{15}{7}=2.\\dot14285\\dot7\\)",
        explanation: "Every rational number has either a finite or an eventually-periodic decimal expansion — that is exactly what distinguishes it from an irrational number."
      },
      {
        id: "u8bgl4",
        question: "What is an irrational number? Give examples.",
        answer: "An irrational number is written as an INFINITE, NON-periodic decimal — it cannot be written as a fraction \\(\\frac{m}{n}\\).\n\nExamples: \\(\\sqrt2=1.41421356\\dots\\), \\(\\sqrt{13}=3.605551\\dots\\), \\(\\pi\\approx 3.14159\\dots\\), and \\(0.1234565\\dots\\)\n\nThey appear naturally: \\(x^2=2\\) has solutions \\(x=\\pm\\sqrt2\\), which are NOT rational.",
        explanation: "The set of irrationals 𝕀 is a SEPARATE set, not an extension of ℚ — together they fill the real line: ℝ = ℚ ∪ 𝕀."
      },
      {
        id: "go7e5o",
        question: "List the properties of addition and multiplication that hold in \\(\\mathbb{R}\\).",
        answer: "For all \\(a,b,c\\in\\mathbb{R}\\):\n• CLOSEDNESS: \\(a+b\\in\\mathbb{R}\\), \\(a\\cdot b\\in\\mathbb{R}\\)\n• COMMUTATIVITY: \\(a+b=b+a\\), \\(a\\cdot b=b\\cdot a\\)\n• ASSOCIATIVITY: \\((a+b)+c=a+(b+c)\\)\n• NEUTRAL element: \\(a+0=a\\); \\(a\\cdot 1=a\\)\n• INVERSE element: \\(a+(-a)=0\\); \\(a\\cdot a^{-1}=1\\) (for \\(a\\neq 0\\))\n• DISTRIBUTIVITY: \\((a+b)\\cdot c=a\\cdot c+b\\cdot c\\)",
        explanation: "ℝ has ALL of these for both operations. ℕ lacks an additive neutral & inverse; ℤ lacks a multiplicative inverse; ℚ and ℝ have them all."
      },
      {
        id: "xqmx49",
        question: "Which properties are MISSING in \\(\\mathbb{N}\\) and in \\(\\mathbb{Z}\\)?",
        answer: "• \\(\\mathbb{N}\\): no neutral element for addition (0 ∉ ℕ) and no inverse for addition → subtraction not always possible.\n• \\(\\mathbb{Z}\\): has a neutral & inverse for addition, but NO inverse for multiplication → division \\(a:b\\) is not always an integer (e.g. \\(2:4=\\tfrac12\\notin\\mathbb{Z}\\)).\n\nThis is exactly why ℚ (and then ℝ) is introduced.",
        explanation: "Distributivity holds in all four sets ℕ, ℤ, ℚ, ℝ."
      },
      {
        id: "lx2lzw",
        question: "What is a FIELD, and why is \\((\\mathbb{R},+,\\cdot)\\) called the field of real numbers?",
        answer: "A FIELD is any set with at least two distinct elements and two operations (addition & multiplication) satisfying nine properties: associativity, neutral & inverse of addition, commutativity of addition, associativity, neutral & inverse of multiplication, commutativity of multiplication, and distributivity of multiplication over addition.\n\nThe set \\(\\mathbb{R}\\) with the usual \\(+\\) and \\(\\cdot\\) satisfies all nine, so \\((\\mathbb{R},+,\\cdot)\\) is the FIELD of real numbers.",
        explanation: "The field structure is what lets us solve equations and do algebra reliably on ℝ."
      },
      {
        id: "buks3q",
        question: "Define exponentiation and the n-th root on \\(\\mathbb{R}\\).",
        answer: "EXPONENTIATION is repeated multiplication of the same number:\n\\[x^n=\\underbrace{x\\cdot x\\cdots x}_{n\\text{ times}}\\]\n(just as multiplication \\(nx=x+x+\\dots+x\\) is repeated addition).\n\nThe SECOND ROOT: if \\(a=b^2\\) then \\(b=\\sqrt a\\). E.g. \\(x^2=4\\) has two solutions \\(x_1=2,\\ x_2=-2\\).",
        explanation: "x²=2 has solutions ±√2 — the existence of such non-rational roots forces the introduction of irrational numbers."
      },
      {
        id: "9otw8r",
        question: "What is the reciprocal (multiplicative inverse) of a number \\(a\\)?",
        answer: "For every \\(a\\in\\mathbb{Q}\\) (or \\(\\mathbb{R}\\)) with \\(a\\neq 0\\) there is a unique INVERSE \\(\\frac1a=a^{-1}\\) such that\n\\[a\\cdot a^{-1}=a^{-1}\\cdot a=1.\\]\nDividing by \\(b\\neq 0\\) means multiplying by its reciprocal: \\(a:b=a\\cdot\\frac1b\\).",
        explanation: "0 has no reciprocal — that is why division by zero is undefined."
      }
    ],

    quiz: [
      {
        id: "2m88f7",
        question: "Which chain of subsets is correct?",
        options: ["\\(\\mathbb{R}\\subset\\mathbb{Q}\\subset\\mathbb{Z}\\subset\\mathbb{N}\\)", "\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)", "\\(\\mathbb{Z}\\subset\\mathbb{N}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)", "\\(\\mathbb{Q}\\subset\\mathbb{I}\\subset\\mathbb{R}\\)"],
        correct: 1
      },
      {
        id: "2hnciv",
        question: "Which number is irrational?",
        options: ["\\(\\frac{15}{7}\\)", "\\(0.75\\)", "\\(\\sqrt2\\)", "\\(-3\\)"],
        correct: 2
      },
      {
        id: "z21ol3",
        question: "Why is the set of integers \\(\\mathbb{Z}\\) introduced?",
        options: ["To make division always possible", "To make subtraction always possible (additive inverse)", "To introduce irrational numbers", "To define exponentiation"],
        correct: 1
      },
      {
        id: "smup04",
        question: "Which property does \\(\\mathbb{Z}\\) LACK (but \\(\\mathbb{Q}\\) has)?",
        options: ["Inverse for addition", "Neutral element for addition", "Inverse for multiplication", "Distributivity"],
        correct: 2
      },
      {
        id: "v4pkl1",
        question: "\\(\\mathbb{R}=\\) ?",
        options: ["\\(\\mathbb{Q}\\cap\\mathbb{I}\\)", "\\(\\mathbb{Q}\\cup\\mathbb{I}\\)", "\\(\\mathbb{Z}\\cup\\mathbb{N}\\)", "\\(\\mathbb{Q}\\setminus\\mathbb{I}\\)"],
        correct: 1
      },
      {
        id: "3d6oiy",
        question: "A finite or eventually-periodic decimal expansion always represents a number that is:",
        options: ["Irrational", "Rational", "Natural", "Negative"],
        correct: 1
      },
      {
        id: "t2z7iq",
        question: "The multiplicative inverse (reciprocal) of \\(a\\neq 0\\) satisfies:",
        options: ["\\(a+(-a)=0\\)", "\\(a\\cdot a^{-1}=1\\)", "\\(a\\cdot 0=0\\)", "\\(a^{-1}=-a\\)"],
        correct: 1
      },
      {
        id: "qe54sh",
        question: "How many properties must hold for a set with two operations to be a FIELD?",
        options: ["4", "6", "9", "12"],
        correct: 2
      },
      {
        id: "g3afhm",
        question: "The equation \\(x^2=2\\) shows the need for which set of numbers?",
        options: ["Integers \\(\\mathbb{Z}\\)", "Rational numbers \\(\\mathbb{Q}\\)", "Irrational numbers \\(\\mathbb{I}\\)", "Natural numbers \\(\\mathbb{N}\\)"],
        correct: 2
      }
    ],

    fillBlanks: [
      { id: "o3zone", sentence: "The set of counting numbers {1, 2, 3, …} is the set of _______ numbers.", answer: "natural", hint: "Symbol ℕ" },
      { id: "calwde", sentence: "A number that can be written as m/n with integers m, n (n ≠ 0) is called a _______ number.", answer: "rational", hint: "Symbol ℚ" },
      { id: "kxysz7", sentence: "An infinite, non-periodic decimal represents an _______ number.", answer: "irrational", hint: "Symbol 𝕀; e.g. √2, π" },
      { id: "ntcebt", sentence: "The set of real numbers is the union ℝ = ℚ ∪ _______.", answer: "I", hint: "Rationals together with irrationals" },
      { id: "50r918", sentence: "The neutral element for addition is the number _______.", answer: "0", hint: "a + 0 = a" },
      { id: "t6dwom", sentence: "The neutral element for multiplication is the number _______.", answer: "1", hint: "a · 1 = a" },
      { id: "6lc380", sentence: "Dividing by b ≠ 0 means multiplying by its _______.", answer: "reciprocal", hint: "1/b = b⁻¹; also called the multiplicative inverse" }
    ],

    learn: {
      id: "lc233e",
      content:
        '<h3>The field of real numbers ℝ</h3>' +
        '<p>All of the mathematics in this course lives on the <strong>real line</strong>. Before we can solve equations or differentiate, we have to be clear about <em>which</em> numbers we may use and <em>what rules</em> they obey. The real numbers are built up <strong>step by step</strong>: we begin with the numbers we count with and, every time some operation has no answer, we <span class="highlight">extend</span> the set just enough to give it one. Each extension supplies exactly one missing <em>inverse</em> — that single idea organises the whole picture.</p>' +

        '<h4>The five number sets</h4>' +
        '<ul>' +
        '<li><strong>Natural numbers</strong> \\(\\mathbb{N}=\\{1,2,3,\\dots\\}\\) — the counting numbers.</li>' +
        '<li><strong>Integers</strong> \\(\\mathbb{Z}=\\{\\dots,-2,-1,0,1,2,\\dots\\}\\) — we add \\(0\\) and the negatives so that <em>subtraction</em> always has an answer.</li>' +
        '<li><strong>Rational numbers</strong> \\(\\mathbb{Q}=\\left\\{\\frac{m}{n}: m,n\\in\\mathbb{Z},\\ n\\neq 0\\right\\}\\) — fractions, so that <em>division</em> always has an answer.</li>' +
        '<li><strong>Irrational numbers</strong> \\(\\mathbb{I}\\) — infinite, non-repeating decimals such as \\(\\sqrt2,\\ \\sqrt{13},\\ \\pi\\).</li>' +
        '<li><strong>Real numbers</strong> \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\) — every point on the number line.</li>' +
        '</ul>' +
        '<div class="formula-box">\\[\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R},\\qquad \\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}.\\]</div>' +

        '<div class="tip-box">' +
        '<h4>Why each extension is forced</h4>' +
        '<p>In \\(\\mathbb{N}\\) the calculation \\(3-5\\) has no answer → introduce \\(\\mathbb{Z}\\) (the additive inverse \\(-a\\)). In \\(\\mathbb{Z}\\) the calculation \\(2:4\\) is not a whole number → introduce \\(\\mathbb{Q}\\) (the multiplicative inverse \\(\\tfrac1a\\)). And \\(x^2=2\\) has no fractional answer → introduce \\(\\mathbb{I}\\). Every new set is the answer to a question the previous one could not solve — that is the single thread running through this unit.</p>' +
        '</div>' +

        '<h4>Rational vs. irrational — the decimal test</h4>' +
        '<p>How do you tell a rational number from an irrational one? Read its decimal expansion. A number is <strong>rational</strong> exactly when that expansion is <em>finite</em> or <em>eventually periodic</em>:</p>' +
        '<div class="formula-box">\\[\\tfrac34=0.75\\ (\\text{finite}),\\qquad \\tfrac{15}{7}=2.\\dot14285\\dot7\\ (\\text{a repeating block}).\\]</div>' +
        '<p>A number is <strong>irrational</strong> when the expansion runs on forever <em>without ever</em> repeating, e.g. \\(\\sqrt2=1.41421356\\dots\\). The two families never overlap (\\(\\mathbb{Q}\\cap\\mathbb{I}=\\varnothing\\)); together they leave no gaps on the line — that is the content of \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\). A handy consequence: if a calculator shows a decimal that settles into a repeating pattern, the number is rational; \\(\\sqrt{a}\\) is irrational unless \\(a\\) is a perfect square.</p>' +

        '<h4>The properties of \\(+\\) and \\(\\cdot\\)</h4>' +
        '<p>For all \\(a,b,c\\in\\mathbb{R}\\), addition and multiplication satisfy:</p>' +
        '<ul>' +
        '<li><strong>Closedness</strong> — the result stays in the set;</li>' +
        '<li><strong>Commutativity</strong> \\(a+b=b+a\\), \\(ab=ba\\);</li>' +
        '<li><strong>Associativity</strong> \\((a+b)+c=a+(b+c)\\);</li>' +
        '<li><strong>Neutral element</strong> \\(a+0=a\\), \\(a\\cdot 1=a\\);</li>' +
        '<li><strong>Inverse element</strong> \\(a+(-a)=0\\), \\(a\\cdot a^{-1}=1\\ (a\\neq 0)\\);</li>' +
        '<li><strong>Distributivity</strong> \\((a+b)c=ac+bc\\).</li>' +
        '</ul>' +
        '<p>The smaller sets fail some of these, and the failure is exactly the inverse that is missing: \\(\\mathbb{N}\\) has no additive neutral or inverse (subtracting can throw you out of \\(\\mathbb{N}\\)); \\(\\mathbb{Z}\\) has no multiplicative inverse (dividing can throw you out of \\(\\mathbb{Z}\\), e.g. \\(2:4=\\tfrac12\\notin\\mathbb{Z}\\)). \\(\\mathbb{Q}\\) and \\(\\mathbb{R}\\) have <em>all</em> of them, which is why we can do ordinary algebra in them without ever leaving the set.</p>' +

        '<h4>ℝ is a field</h4>' +
        '<p>A set with two operations obeying the <strong>nine</strong> properties above is called a <span class="highlight">field</span>. Because \\(\\mathbb{R}\\) obeys every one, \\((\\mathbb{R},+,\\cdot)\\) is the <strong>field of real numbers</strong>. This is not abstract decoration: the field axioms are precisely the rules that let us add, cancel, factor and rearrange equations without ever producing a false step — the business of the next unit.</p>' +

        '<div class="tip-box">' +
        '<h4>Common pitfalls</h4>' +
        '<ul>' +
        '<li><strong>\\(0\\) has no reciprocal</strong> — that is why <em>division by zero is undefined</em>. Every other real number does have one.</li>' +
        '<li>\\(\\mathbb{Q}\\) and \\(\\mathbb{I}\\) are <em>disjoint</em>: an irrational number is never a fraction, no matter how you write it.</li>' +
        '<li>\\(\\sqrt2\\) is irrational, but \\(\\sqrt4=2\\) is a natural number — taking a root does not automatically give an irrational.</li>' +
        '</ul>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 2: BASIC EQUATIONS ON ℝ
  // ========================================================================
  basicEquations: {
    id: "e4cfil",
    name: "Basic Equations on ℝ",
    icon: "fa-equals",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "kjfkum",
        question: "What determines how many solutions an algebraic (polynomial) equation has?",
        answer: "The DEGREE of the equation — the highest power of the unknown — determines the number of solutions.\n\nE.g. \\(5x^3-3x^2+x^4=x+5\\) is of degree 4 → it has four solutions.\n\nSolutions may be repeated, but they are still counted as separate solutions.",
        explanation: "An equation in one unknown need not have only one solution. We focus on equations of degree 1 (linear) and 2 (quadratic), plus equations that reduce to them."
      },
      {
        id: "cv53ln",
        question: "What is a linear equation and how do you solve it?",
        answer: "A linear equation has the form\n\\[ax+b=0,\\quad a\\neq 0,\\ a,b\\in\\mathbb{R}.\\]\nTo solve means to find the number that, put in place of the unknown, gives a true equality. The solution is\n\\[x=-\\frac{b}{a}.\\]",
        explanation: "It is a 1st-degree equation, so it has exactly one solution."
      },
      {
        id: "51ibgs",
        question: "Give the quadratic equation and the general solution formula.",
        answer: "A complete quadratic equation:\n\\[ax^2+bx+c=0,\\quad a\\neq 0.\\]\n\\(a\\) = leading (quadratic) coefficient, \\(b\\) = linear coefficient, \\(c\\) = free (constant) coefficient. The two solutions:\n\\[x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.\\]",
        explanation: "A 2nd-degree equation has two solutions x₁, x₂ (possibly equal, possibly non-real)."
      },
      {
        id: "5umwkq",
        question: "What are the two INCOMPLETE forms of the quadratic equation and their solutions?",
        answer: "1. \\(ax^2+c=0\\) (no linear term): \\(x_{1,2}=\\pm\\sqrt{-\\frac{c}{a}}\\)\n\n2. \\(ax^2+bx=0\\) (no constant term): factor \\(x(ax+b)=0\\) →\n\\(x_1=0,\\quad x_2=-\\frac{b}{a}\\)",
        explanation: "Form 2 always has x = 0 as one solution. These are quicker to solve than using the full formula."
      },
      {
        id: "rzdlgj",
        question: "What does the DISCRIMINANT \\(D=b^2-4ac\\) tell you?",
        answer: "It is the expression under the root in the quadratic formula, and it decides the NATURE of the solutions:\n• \\(D>0\\) → two distinct real solutions\n• \\(D=0\\) → one (repeated) real solution\n• \\(D<0\\) → no real solution (the solutions are complex)",
        explanation: "E.g. x² + 8x + 25 = 0 has D = 64 − 100 = −36 < 0 → no real solution."
      },
      {
        id: "tcd5iz",
        question: "How do you solve a BIQUADRATIC equation \\(ax^4+bx^2+c=0\\)?",
        answer: "Introduce the substitution \\(t=x^2\\). The equation becomes a quadratic in \\(t\\):\n\\[at^2+bt+c=0,\\quad t_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.\\]\nThen undo the substitution: solve \\(t_1=x^2\\) and \\(t_2=x^2\\). Each gives up to two values of \\(x\\) → up to four solutions \\(x_1,x_2,x_3,x_4\\).",
        explanation: "Example: 36x⁴ − 25x² + 4 = 0 → x = ±2/3, ±1/2."
      },
      {
        id: "zq7qw0",
        question: "How do you solve an IRRATIONAL equation (unknown under a root), and what must you always do?",
        answer: "Isolate the root and SQUARE both sides to remove it, then solve the resulting (often quadratic) equation.\n\n⚠ You MUST substitute each obtained solution back into the ORIGINAL equation and check it — squaring can introduce false (extraneous) solutions that do not satisfy the original.",
        explanation: "Example: √(2x+1) = x − 1. Squaring is a non-reversible step, so checking is mandatory."
      },
      {
        id: "nk17x5",
        question: "How do you solve a system of one quadratic and one linear equation?",
        answer: "By SUBSTITUTION:\n1. From the LINEAR equation, express one unknown.\n2. Substitute that expression into the QUADRATIC equation and solve for the second unknown.\n3. Put each value back into the expression for the first unknown to get its matching value.",
        explanation: "Each solution is an ordered pair (x, y). A quadratic-linear system typically yields two pairs."
      },
      {
        id: "gd2xrl",
        question: "What are the steps of the second-stage problem-solving process (word problems / modeling)?",
        answer: "1. Read the problem carefully several times.\n2. Identify what is known and what must be found.\n3. Name the known and unknown variables.\n4. If helpful, draw a picture/table.\n5. Establish mathematical relations between known and unknown quantities.\n6. Write the equation(s)/system.\n7. Solve the mathematical model.\n8. Interpret the solution.\n9. Check its accuracy and meaningfulness.",
        explanation: "\"Second-degree problems\" are everyday/professional problems that reduce to quadratic equations or to linear–quadratic systems."
      }
    ],

    quiz: [
      {
        id: "vs9vyz",
        question: "The solution of the linear equation \\(ax+b=0\\) (\\(a\\neq 0\\)) is:",
        options: ["\\(x=\\frac{b}{a}\\)", "\\(x=-\\frac{b}{a}\\)", "\\(x=\\frac{a}{b}\\)", "\\(x=ab\\)"],
        correct: 1
      },
      {
        id: "26sp6i",
        question: "The solutions of \\(ax^2+bx+c=0\\) are given by:",
        options: ["\\(x=-\\frac{b}{a}\\)", "\\(x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\)", "\\(x_{1,2}=\\frac{b\\pm\\sqrt{b^2+4ac}}{2a}\\)", "\\(x=\\frac{c}{a}\\)"],
        correct: 1
      },
      {
        id: "x4708g",
        question: "The degree of \\(x^4+5x^3-3x^2=x+5\\) — and hence the number of its solutions — is:",
        options: ["2", "3", "4", "5"],
        correct: 2
      },
      {
        id: "p545rn",
        question: "If the discriminant \\(D=b^2-4ac<0\\), the quadratic equation has:",
        options: ["Two distinct real solutions", "One repeated real solution", "No real solution", "Infinitely many solutions"],
        correct: 2
      },
      {
        id: "rckl45",
        question: "The incomplete quadratic \\(ax^2+bx=0\\) always has which solution?",
        options: ["\\(x=1\\)", "\\(x=0\\)", "\\(x=-1\\)", "\\(x=\\frac{c}{a}\\)"],
        correct: 1
      },
      {
        id: "y6gkm7",
        question: "To solve a biquadratic \\(ax^4+bx^2+c=0\\), the right substitution is:",
        options: ["\\(t=x\\)", "\\(t=x^2\\)", "\\(t=\\sqrt{x}\\)", "\\(t=\\frac1x\\)"],
        correct: 1
      },
      {
        id: "dyjx4j",
        question: "After squaring both sides of an irrational equation, you MUST:",
        options: ["Square again", "Check each solution in the original equation", "Differentiate", "Divide by the unknown"],
        correct: 1
      },
      {
        id: "bkmfhz",
        question: "A system of a quadratic and a linear equation is best solved by:",
        options: ["Squaring", "The substitution method", "Adding the equations", "Drawing a parabola"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "3zk738", sentence: "An equation of the form ax + b = 0 (a ≠ 0) is called a _______ equation.", answer: "linear", hint: "1st degree" },
      { id: "wgvsn8", sentence: "An equation of the form ax² + bx + c = 0 (a ≠ 0) is called a _______ equation.", answer: "quadratic", hint: "2nd degree" },
      { id: "w6rvz2", sentence: "The _______ of a polynomial equation determines the number of its solutions.", answer: "degree", hint: "Highest power of the unknown" },
      { id: "i5vo05", sentence: "The expression b² − 4ac under the root is called the _______.", answer: "discriminant", hint: "Its sign decides the nature of the solutions" },
      { id: "sndljz", sentence: "A biquadratic equation is solved with the substitution t = _______.", answer: "x^2", hint: "Turns ax⁴+bx²+c into a quadratic in t" },
      { id: "ilkife", sentence: "After squaring an irrational equation you must _______ each solution in the original.", answer: "check", hint: "Squaring can introduce false solutions" }
    ],

    learn: {
      id: "ouv44n",
      content:
        '<h3>Basic equations on ℝ</h3>' +
        '<p>An <strong>equation</strong> in one unknown is a statement that two expressions are equal — true only for certain value(s) of the unknown. To <em>solve</em> it is to find every number that, put in place of the unknown, makes the equality literally true. The first thing to read off is the <span class="highlight">degree</span>, the highest power of the unknown: a polynomial equation of degree \\(n\\) has exactly \\(n\\) solutions (counting repeats and complex ones). So \\(x^4+5x^3-3x^2=x+5\\) is degree 4 and has four solutions. In this unit we master the two everyday cases — degree 1 and degree 2 — and the tricks that reduce other equations to them.</p>' +

        '<h4>1. Linear equations</h4>' +
        '<p>Form \\(ax+b=0,\\ a\\neq 0\\). Being first degree, it has exactly <strong>one</strong> solution, found by moving \\(b\\) across and dividing by \\(a\\):</p>' +
        '<div class="formula-box">\\[x=-\\frac{b}{a}.\\]</div>' +
        '<p><strong>Worked example.</strong> \\(3x-12=0\\Rightarrow x=\\tfrac{12}{3}=4\\). The condition \\(a\\neq0\\) matters: if \\(a=0\\) the equation is no longer linear (it is either always true or impossible).</p>' +

        '<h4>2. Quadratic equations</h4>' +
        '<p>Complete form \\(ax^2+bx+c=0,\\ a\\neq 0\\), with leading coefficient \\(a\\), linear coefficient \\(b\\) and free term \\(c\\). The two solutions come from the quadratic formula:</p>' +
        '<div class="formula-box">\\[x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.\\]</div>' +
        '<p>The expression under the root, the <strong>discriminant</strong> \\(D=b^2-4ac\\), decides the <em>nature</em> of the solutions <strong>before</strong> you finish the calculation: \\(D>0\\) gives two distinct real solutions, \\(D=0\\) one repeated real solution, and \\(D<0\\) no real solution at all (the roots are complex). <strong>Worked example.</strong> \\(x^2-5x+6=0\\) has \\(D=25-24=1>0\\), so \\(x_{1,2}=\\frac{5\\pm1}{2}\\), giving \\(x_1=3,\\ x_2=2\\). By contrast \\(x^2+8x+25=0\\) has \\(D=64-100=-36<0\\) — no real solution.</p>' +
        '<p>When a coefficient is missing, the two <strong>incomplete</strong> forms are far quicker than the formula:</p>' +
        '<ul>' +
        '<li>\\(ax^2+c=0\\) (no linear term) \\(\\Rightarrow x_{1,2}=\\pm\\sqrt{-\\tfrac{c}{a}}\\);</li>' +
        '<li>\\(ax^2+bx=0\\) (no constant) \\(\\Rightarrow x(ax+b)=0\\Rightarrow x_1=0,\\ x_2=-\\tfrac{b}{a}\\) — note \\(x=0\\) is <em>always</em> one root here.</li>' +
        '</ul>' +

        '<h4>3. Equations that reduce to a quadratic</h4>' +
        '<p>Many harder-looking equations become quadratics after one clever move:</p>' +
        '<ul>' +
        '<li><strong>Biquadratic</strong> \\(ax^4+bx^2+c=0\\): substitute \\(t=x^2\\), solve \\(at^2+bt+c=0\\) for \\(t\\), then undo the substitution by solving \\(x^2=t_1\\) and \\(x^2=t_2\\) — up to four solutions. E.g. \\(36x^4-25x^2+4=0\\Rightarrow x=\\pm\\tfrac23,\\ \\pm\\tfrac12\\).</li>' +
        '<li><strong>Irrational</strong> (unknown under a root): isolate the root and square both sides to remove it, then solve. Squaring is a one-way step, so it can introduce <em>false</em> roots — <strong>always substitute every answer back into the original equation</strong> and keep only those that check.</li>' +
        '<li><strong>Linear–quadratic systems</strong>: from the linear equation express one unknown, substitute into the quadratic, solve, then back-substitute. Each solution is an ordered pair \\((x,y)\\), and there are usually two.</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>Modeling — turning a word problem into an equation</h4>' +
        '<p>Many real and professional problems ("second-degree problems") reduce to a quadratic. Work in fixed steps: read carefully → name the known and unknown quantities → write the relation between them → solve the model → <strong>interpret and check</strong> the answer against the problem. A 65% discount leaving 192.5 monetary units, two ages whose product is 28, water flowing through pipes of different diameter — each becomes an equation of degree 1 or 2. The final check is part of the method, not an afterthought: a negative length or a fractional number of people is a signal you must reject that root.</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 3: FUNCTIONS
  // ========================================================================
  functions: {
    id: "dds84m",
    name: "Functions",
    icon: "fa-chart-line",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "efnt09",
        question: "What is a polynomial of degree \\(n\\)?",
        answer: "A polynomial of the n-th degree is a mapping \\(x\\mapsto P_n(x)\\):\n\\[P_n(x)=a_nx^n+a_{n-1}x^{n-1}+\\dots+a_2x^2+a_1x+a_0,\\quad a_i\\in\\mathbb{R},\\ a_n\\neq 0.\\]\nThe degree = the highest power. A value \\(x\\) with \\(P_n(x)=0\\) is a ZERO of the polynomial.",
        explanation: "Degree 0 = constant function; degree 1 = linear; degree 2 = quadratic."
      },
      {
        id: "ktxud5",
        question: "Define a function and its domain, codomain and image.",
        answer: "Given non-empty sets \\(A,B\\), a FUNCTION \\(f\\) is a rule that assigns to each \\(x\\in A\\) a UNIQUE \\(y\\in B\\), written \\(y=f(x)\\).\n• DOMAIN \\(D_f\\) = set \\(A\\) of all values \\(x\\) can take.\n• CODOMAIN = set \\(B\\) of possible values.\n• IMAGE \\(\\operatorname{Im}f=\\{f(x)\\mid x\\in D_f\\}\\) = the values actually attained.",
        explanation: "The defining feature: each input maps to exactly ONE output."
      },
      {
        id: "bwi8wr",
        question: "What is the NATURAL DOMAIN of a function? Give the three common restrictions.",
        answer: "The natural domain is the LARGEST set on which the formula is defined (used when no domain is stated). Common restrictions:\n• Denominator ≠ 0: \\(f(x)=\\frac1x\\Rightarrow D_f=\\mathbb{R}\\setminus\\{0\\}\\)\n• Even root: argument \\(\\ge 0\\): \\(\\sqrt{g(x)}\\Rightarrow g(x)\\ge 0\\)\n• Logarithm: argument \\(>0\\): \\(\\ln g(x)\\Rightarrow g(x)>0\\)",
        explanation: "A linear function f(x)=ax+b is defined on all of ℝ; f(x)=1/x is not."
      },
      {
        id: "l1k4nr",
        question: "What is the graph of a function, and what do the constant, identity and linear graphs look like?",
        answer: "The GRAPH is the set of points \\((x,y)\\) with \\(y=f(x)\\):\n\\[G(f)=\\{(x,y)\\in\\mathbb{R}^2\\mid x\\in D_f,\\ y=f(x)\\}.\\]\n• Constant \\(f(x)=c\\): horizontal line.\n• Identity \\(f(x)=x\\): the 45° line through the origin.\n• Linear \\(f(x)=ax+b\\): a straight line.",
        explanation: "Constant is the 0-degree polynomial; identity is a special linear function mapping every x to itself."
      },
      {
        id: "ybyvoe",
        question: "For a linear function \\(f(x)=ax+b\\), what do \\(a\\) and \\(b\\) mean?",
        answer: "• \\(a\\) = SLOPE / rate of change / difference quotient — the tangent of the angle the line makes with the x-axis:\n\\[a=\\frac{\\Delta y}{\\Delta x}=\\frac{f(x_2)-f(x_1)}{x_2-x_1}.\\]\nIf \\(a>0\\) the function increases (steeper as \\(a\\) grows); if \\(a<0\\) it decreases.\n• \\(b\\) = the y-intercept (segment cut on the y-axis).",
        explanation: "The 'difference quotient' a is the key idea that leads to the derivative."
      },
      {
        id: "a1imj8",
        question: "What is the graph of the quadratic function, and of the basic rational function \\(f(x)=\\tfrac1x\\)?",
        answer: "• Quadratic \\(f(x)=ax^2+bx+c\\): a PARABOLA. (Opens up if \\(a>0\\), down if \\(a<0\\).)\n• Rational \\(f(x)=\\frac1x\\): a hyperbola with \\(D_f=\\mathbb{R}\\setminus\\{0\\}\\); the y-axis is a VERTICAL asymptote and the x-axis a HORIZONTAL asymptote.",
        explanation: "An asymptote is a line the graph approaches but never meets."
      },
      {
        id: "lueuuj",
        question: "Describe the exponential function and its base \\(e\\).",
        answer: "Exponential: \\(f(x)=a^x,\\ a>0,\\ a\\neq 1\\). In this course we use the natural base \\(e\\approx 2.71828\\approx 2.72\\):\n\\[f(x)=e^x.\\]\nIt takes only POSITIVE values, has domain \\(\\langle-\\infty,+\\infty\\rangle\\), codomain \\(\\langle 0,+\\infty\\rangle\\), and is strictly increasing. Rules:\n\\[e^a\\cdot e^b=e^{a+b},\\quad e^a\\div e^b=e^{a-b},\\quad (e^a)^b=e^{ab}.\\]",
        explanation: "e is Euler's number, the base of the natural logarithm; central to growth and financial mathematics."
      },
      {
        id: "4bftes",
        question: "Define the logarithm and the natural logarithm, and give the log rules.",
        answer: "The logarithm of \\(b\\) to base \\(a\\) is the exponent \\(x\\) with \\(a^x=b\\):\n\\[\\log_a b=x\\iff a^x=b.\\]\nThe NATURAL logarithm has base \\(e\\): \\(f(x)=\\log_e x=\\ln x\\), defined for \\(x>0\\). Rules:\n\\[\\ln 1=0,\\quad \\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac{a}{b}=\\ln a-\\ln b,\\quad \\ln a^n=n\\ln a.\\]",
        explanation: "ln is the inverse of eˣ: it maps ⟨0,+∞⟩ onto ⟨−∞,+∞⟩."
      },
      {
        id: "eugf2w",
        question: "How are the trigonometric functions sine and cosine defined on the unit circle?",
        answer: "On the unit circle (\\(r=1\\)) centred at the origin, for the angle \\(\\theta\\):\n\\[\\sin\\theta=\\frac{y}{r}=y,\\qquad \\cos\\theta=\\frac{x}{r}=x.\\]\n(From a right triangle: \\(\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}\\), \\(\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}\\).)",
        explanation: "Because they are periodic, sine and cosine model seasonal (periodic) phenomena — e.g. tourism seasonality / time series."
      },
      {
        id: "av20en",
        question: "Define the cost, revenue and profit functions used in economics.",
        answer: "• TOTAL COST \\(T(Q)\\) — a polynomial in the quantity \\(Q\\); the FIXED cost is \\(T(0)\\) (the free term).\n• REVENUE (income) \\(P(Q)=pQ\\), where \\(p\\) is the unit price.\n• PROFIT \\(D(Q)=P(Q)-T(Q)\\).\n• BREAK-EVEN (coverage) points: \\(P(Q)=T(Q)\\), i.e. \\(D(Q)=0\\).",
        explanation: "Between the break-even points the profit is positive; outside them the firm loses money. E.g. T(Q)=4Q³−120Q²+6Q+124 has fixed cost 124."
      },
      {
        id: "63s7nr",
        question: "What is the average cost function?",
        answer: "The average cost is the total cost divided by the quantity produced:\n\\[\\overline{T(Q)}=\\frac{T(Q)}{Q}.\\]\nExample: \\(T(Q)=2Q+3\\Rightarrow \\overline{T(Q)}=\\frac{2Q+3}{Q}\\). Total cost makes economic sense for \\(Q\\ge 0\\); average cost for \\(Q>0\\).",
        explanation: "Average cost is a rational function — undefined at Q = 0, where you would divide by zero."
      },
      {
        id: "c7mg31",
        question: "When is a function increasing or decreasing on an interval \\((a,b)\\)?",
        answer: "\\(f\\) is (strictly) INCREASING on \\((a,b)\\) if for all \\(x_1<x_2\\) in the interval \\(f(x_1)<f(x_2)\\).\n\\(f\\) is (strictly) DECREASING if \\(x_1<x_2\\Rightarrow f(x_1)>f(x_2)\\).",
        explanation: "Non-strict versions use ≤ and ≥. This 'value' definition is later linked to the sign of the derivative."
      }
    ],

    quiz: [
      {
        id: "f8oqdm",
        question: "A function assigns to each element of the domain:",
        options: ["At least one value", "Exactly one value of the codomain", "Any number of values", "Only positive values"],
        correct: 1
      },
      {
        id: "us7rax",
        question: "The natural domain of \\(f(x)=\\frac1x\\) is:",
        options: ["\\(\\mathbb{R}\\)", "\\(\\mathbb{R}\\setminus\\{0\\}\\)", "\\(\\langle 0,+\\infty\\rangle\\)", "\\(\\mathbb{R}\\setminus\\{1\\}\\)"],
        correct: 1
      },
      {
        id: "ju8z2d",
        question: "For \\(f(x)=ax+b\\), the coefficient \\(a\\) represents the:",
        options: ["y-intercept", "Slope / rate of change", "Zero of the function", "Curvature"],
        correct: 1
      },
      {
        id: "dey2c4",
        question: "The graph of a quadratic function is a:",
        options: ["Straight line", "Hyperbola", "Parabola", "Circle"],
        correct: 2
      },
      {
        id: "1ms4hi",
        question: "The natural domain of \\(f(x)=\\ln(g(x))\\) requires:",
        options: ["\\(g(x)\\ge 0\\)", "\\(g(x)>0\\)", "\\(g(x)\\neq 0\\)", "\\(g(x)<0\\)"],
        correct: 1
      },
      {
        id: "cm7hor",
        question: "\\(\\log_a b=x\\) is equivalent to:",
        options: ["\\(b^x=a\\)", "\\(a^x=b\\)", "\\(x^a=b\\)", "\\(a\\cdot x=b\\)"],
        correct: 1
      },
      {
        id: "uwrr0l",
        question: "Which rule is correct for the natural logarithm?",
        options: ["\\(\\ln(ab)=\\ln a\\cdot\\ln b\\)", "\\(\\ln(ab)=\\ln a+\\ln b\\)", "\\(\\ln(a+b)=\\ln a+\\ln b\\)", "\\(\\ln a^n=a\\ln n\\)"],
        correct: 1
      },
      {
        id: "2loekj",
        question: "The profit function is defined as:",
        options: ["\\(D(Q)=P(Q)+T(Q)\\)", "\\(D(Q)=P(Q)-T(Q)\\)", "\\(D(Q)=\\frac{T(Q)}{Q}\\)", "\\(D(Q)=pQ\\)"],
        correct: 1
      },
      {
        id: "k16s7w",
        question: "The fixed cost of a total-cost function \\(T(Q)\\) equals:",
        options: ["\\(T(1)\\)", "\\(T(0)\\)", "The leading coefficient", "\\(P(Q)\\)"],
        correct: 1
      },
      {
        id: "c0gvyy",
        question: "The base \\(e\\) of the natural logarithm is approximately:",
        options: ["2.72", "3.14", "1.62", "1.41"],
        correct: 0
      }
    ],

    fillBlanks: [
      { id: "9voafb", sentence: "The set of all values x can take is the _______ of the function.", answer: "domain", hint: "Symbol D_f" },
      { id: "d1n2tq", sentence: "A value x for which Pₙ(x) = 0 is a _______ of the polynomial.", answer: "zero", hint: "Where the graph crosses the x-axis" },
      { id: "afwyzu", sentence: "The graph of a quadratic function is a _______.", answer: "parabola", hint: "f(x)=x² shape" },
      { id: "6pdozd", sentence: "A line the graph approaches but never intersects is an _______.", answer: "asymptote", hint: "e.g. axes for f(x)=1/x" },
      { id: "411kg2", sentence: "The inverse of the exponential function eˣ is the natural _______.", answer: "logarithm", hint: "ln x, defined for x > 0" },
      { id: "jozvgy", sentence: "Revenue is P(Q) = p·Q, where p is the unit _______.", answer: "price", hint: "Price × quantity" },
      { id: "i4msn2", sentence: "Total cost ÷ quantity gives the _______ cost function.", answer: "average", hint: "T(Q)/Q" }
    ],

    learn: {
      id: "8slorw",
      content:
        '<h3>Functions</h3>' +
        '<p>A <strong>function</strong> is the central object of the whole course: a rule that turns each input into one output. Formally, a function \\(f\\) from a set \\(A\\) to a set \\(B\\) assigns to <em>each</em> \\(x\\in A\\) a <span class="highlight">unique</span> \\(y=f(x)\\in B\\). That word "unique" is the whole definition — one input may never lead to two different outputs. We name three sets: the <strong>domain</strong> \\(D_f\\) (the allowed inputs), the <strong>codomain</strong> \\(B\\) (where outputs may live), and the <strong>image</strong> \\(\\operatorname{Im}f\\) (the outputs actually reached). Drawing every pair \\((x,f(x))\\) in the plane gives the <strong>graph</strong>, the visual fingerprint of the function.</p>' +

        '<h4>Natural domain — where is the formula allowed?</h4>' +
        '<p>When a problem gives a formula but no domain, we take the <em>largest</em> set on which the formula makes sense. Three restrictions cover almost every case:</p>' +
        '<ul>' +
        '<li>a denominator must be non-zero — \\(\\frac1x\\Rightarrow D_f=\\mathbb{R}\\setminus\\{0\\}\\);</li>' +
        '<li>an even root needs a non-negative argument — \\(\\sqrt{g(x)}\\Rightarrow g(x)\\ge 0\\);</li>' +
        '<li>a logarithm needs a strictly positive argument — \\(\\ln g(x)\\Rightarrow g(x)>0\\).</li>' +
        '</ul>' +
        '<p><strong>Worked example.</strong> For \\(f(x)=\\frac{1}{\\sqrt{x-2}}\\) the root needs \\(x-2\\ge0\\) <em>and</em> the denominator needs \\(x-2\\neq0\\), so \\(D_f=\\langle2,+\\infty\\rangle\\). Finding the domain is always the first step when analysing a function.</p>' +

        '<h4>Polynomials and their graphs</h4>' +
        '<p>A polynomial \\(P_n(x)=a_nx^n+\\dots+a_0\\) has degree equal to its highest power, and a value with \\(P_n(x)=0\\) is a <strong>zero</strong> (where the graph crosses the \\(x\\)-axis). The low degrees are the workhorses: degree 0 is the <strong>constant</strong> \\(f(x)=c\\) (a horizontal line); degree 1 the <strong>linear</strong> \\(f(x)=ax+b\\) (a straight line with slope \\(a\\) and \\(y\\)-intercept \\(b\\)); degree 2 the <strong>quadratic</strong> (a parabola, opening up if \\(a>0\\), down if \\(a<0\\)). For a line the slope is the <strong>difference quotient</strong></p>' +
        '<div class="formula-box">\\[a=\\frac{\\Delta y}{\\Delta x}=\\frac{f(x_2)-f(x_1)}{x_2-x_1}.\\]</div>' +
        '<p>This is the rate of change — how much \\(y\\) moves per unit of \\(x\\) — and it is the <em>seed of the derivative</em> in the next unit. Dividing two polynomials gives a <strong>rational function</strong> such as \\(\\frac1x\\), defined off the zeros of the denominator; near such a zero the graph shoots off along a vertical <em>asymptote</em>, a line the curve approaches but never touches.</p>' +

        '<h4>Exponential, logarithm, trigonometric</h4>' +
        '<p>Beyond polynomials sit three families used constantly in economics. The <strong>exponential</strong> \\(f(x)=e^x\\) (base \\(e\\approx 2.72\\)) is always positive and strictly increasing, and obeys \\(e^a e^b=e^{a+b}\\); it models growth and compound interest. Its inverse is the <strong>natural logarithm</strong> \\(\\ln x\\) (defined only for \\(x>0\\)), which undoes exponentials and turns products into sums:</p>' +
        '<div class="formula-box">\\[\\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac{a}{b}=\\ln a-\\ln b,\\quad \\ln a^n=n\\ln a.\\]</div>' +
        '<p>Finally the <strong>periodic</strong> \\(\\sin\\theta\\) and \\(\\cos\\theta\\) (read off the unit circle, where \\(\\sin\\theta=y\\) and \\(\\cos\\theta=x\\)) repeat forever and are the natural language for <em>seasonal</em> phenomena — exactly the shape of a tourism demand time series across the year.</p>' +

        '<div class="tip-box">' +
        '<h4>Economic functions — why we care</h4>' +
        '<p>The functions above are not abstract: a firm\'s behaviour is described by them. <strong>Total cost</strong> \\(T(Q)\\) is a polynomial in the quantity \\(Q\\), with the <strong>fixed cost</strong> equal to \\(T(0)\\) (the free term). <strong>Revenue</strong> is \\(P(Q)=pQ\\) (price × quantity) and <strong>profit</strong> is \\(D(Q)=P(Q)-T(Q)\\). The <strong>break-even</strong> points solve \\(P(Q)=T(Q)\\), i.e. \\(D(Q)=0\\); between them the firm is profitable, outside them it loses money. The <strong>average cost</strong> \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\) is a rational function, undefined at \\(Q=0\\). In the last unit we will <em>optimise</em> exactly these functions with the derivative.</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 4: DIFFERENTIATION
  // ========================================================================
  differentiation: {
    id: "dc4e60",
    name: "Differentiation",
    icon: "fa-superscript",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "aqwabp",
        question: "What is the derivative of a function at a point \\(x_0\\)?",
        answer: "The derivative is the limit of the difference quotient as \\(x\\) tends to \\(x_0\\):\n\\[f'(x_0)=\\frac{dy}{dx}(x_0)=\\lim_{x\\to x_0}\\frac{f(x)-f(x_0)}{x-x_0}.\\]\nIt measures the INSTANTANEOUS rate of change of \\(f\\) at \\(x_0\\) — generalising the constant rate (slope \\(a\\)) of a linear function to curves.",
        explanation: "We let the difference x − x₀ become arbitrarily small but never zero (possible thanks to the continuity of ℝ)."
      },
      {
        id: "r0hfvi",
        question: "What is the GEOMETRIC meaning of the derivative \\(f'(x_0)\\)?",
        answer: "\\(f'(x_0)\\) is the SLOPE (direction coefficient) of the TANGENT line to the graph of \\(f\\) at the point \\(x_0\\). The tangent is the best linear approximation of the function's growth rate near \\(x_0\\).",
        explanation: "For a line f(x)=ax+b the tangent is the line itself, so f'(x)=a everywhere."
      },
      {
        id: "axgfoo",
        question: "What are the derivatives of a constant and of a linear function?",
        answer: "• Constant \\(f(x)=c\\): the difference quotient is always 0, so\n\\[(c)'=0.\\]\n• Linear \\(f(x)=ax+b\\): the difference quotient is \\(a\\), so\n\\[(ax+b)'=a,\\qquad\\text{in particular } (x)'=1.\\]",
        explanation: "The derivative of a constant is zero because a constant does not change with x."
      },
      {
        id: "ii88p5",
        question: "State the POWER rule for differentiation.",
        answer: "For \\(f(x)=x^n\\):\n\\[(x^n)'=n\\,x^{n-1}.\\]\nThe derived function has a power one less than the original. E.g. \\((x^3)'=3x^2\\), \\((x^7)'=7x^6\\).",
        explanation: "This is the single most-used rule; it also covers √x = x^{1/2} and 1/xⁿ = x^{−n}."
      },
      {
        id: "flfse3",
        question: "Give the derivatives of the elementary functions \\(\\frac1x\\), \\(\\sqrt x\\), \\(e^x\\), \\(\\ln x\\), \\(\\sin x\\), \\(\\cos x\\).",
        answer: "\\[\\left(\\frac1x\\right)'=-\\frac{1}{x^2},\\qquad (\\sqrt x)'=\\frac{1}{2\\sqrt x},\\]\n\\[(e^x)'=e^x,\\qquad (\\ln x)'=\\frac1x,\\]\n\\[(\\sin x)'=\\cos x,\\qquad (\\cos x)'=-\\sin x.\\]",
        explanation: "eˣ is its own derivative. Note the minus sign for (cos x)' and for (1/x)'."
      },
      {
        id: "t1dbxg",
        question: "State the sum, difference and constant-multiple rules.",
        answer: "\\[(u\\pm v)'=u'\\pm v',\\]\n\\[(C\\,u)'=C\\,u'\\quad(C=\\text{const}),\\]\n\\[(a\\,u+b\\,v)'=a\\,u'+b\\,v'.\\]\nDifferentiation is LINEAR: you differentiate term by term and pull out constants.",
        explanation: "So a polynomial is differentiated term by term using the power rule."
      },
      {
        id: "9i3z3p",
        question: "State the PRODUCT rule and the QUOTIENT rule.",
        answer: "PRODUCT:\n\\[(u\\cdot v)'=u'v+u\\,v'.\\]\nQUOTIENT:\n\\[\\left(\\frac{u}{v}\\right)'=\\frac{u'v-u\\,v'}{v^2}.\\]",
        explanation: "Order matters in the quotient rule's numerator: u′v − uv′ (not uv′ − u′v)."
      },
      {
        id: "28h1iv",
        question: "State the CHAIN rule for a composite function.",
        answer: "A composite ('function within a function') \\(f(g(x))\\) has outer function \\(f\\) and inner function \\(g\\). Its derivative:\n\\[[f(g(x))]'=f'(g(x))\\cdot g'(x).\\]\nDifferentiate the outer function (leaving the inner unchanged) and MULTIPLY by the derivative of the inner.",
        explanation: "E.g. (ln(3x²+5))' = 1/(3x²+5) · 6x. Used for trig/exp/log of expressions."
      },
      {
        id: "iha7tk",
        question: "What is a higher-order derivative?",
        answer: "Differentiating repeatedly. The n-th derivative is the derivative of the (n−1)-th:\n\\[f^{(n)}(x)=\\left[f^{(n-1)}(x)\\right]'.\\]\nThe SECOND derivative \\(f''\\) is the derivative of \\(f'\\); the third \\(f'''\\) the derivative of \\(f''\\), etc.",
        explanation: "E.g. f(x)=4x⁵−3x⁴+… → f′, then f″=80x³−36x²+12x−10, then f‴=240x²−72x+12."
      }
    ],

    quiz: [
      {
        id: "x1xicw",
        question: "Geometrically, \\(f'(x_0)\\) is the:",
        options: ["Area under the curve", "Slope of the tangent at \\(x_0\\)", "y-intercept", "Value \\(f(x_0)\\)"],
        correct: 1
      },
      {
        id: "s1ox9z",
        question: "\\((x^n)' = \\) ?",
        options: ["\\(n x^{n+1}\\)", "\\(n x^{n-1}\\)", "\\(x^{n-1}\\)", "\\((n-1)x^n\\)"],
        correct: 1
      },
      {
        id: "kxxn2y",
        question: "The derivative of a constant \\(c\\) is:",
        options: ["\\(c\\)", "\\(1\\)", "\\(0\\)", "\\(cx\\)"],
        correct: 2
      },
      {
        id: "l519la",
        question: "\\((e^x)' = \\) ?",
        options: ["\\(x e^{x-1}\\)", "\\(e^x\\)", "\\(\\frac1x\\)", "\\(e^{x-1}\\)"],
        correct: 1
      },
      {
        id: "28hvm8",
        question: "\\((\\ln x)' = \\) ?",
        options: ["\\(\\ln x\\)", "\\(\\frac1x\\)", "\\(-\\frac{1}{x^2}\\)", "\\(x\\)"],
        correct: 1
      },
      {
        id: "74j0en",
        question: "The product rule \\((uv)'\\) equals:",
        options: ["\\(u'v'\\)", "\\(u'v+uv'\\)", "\\(u'v-uv'\\)", "\\(\\frac{u'}{v'}\\)"],
        correct: 1
      },
      {
        id: "sqb777",
        question: "The quotient rule \\(\\left(\\frac{u}{v}\\right)'\\) equals:",
        options: ["\\(\\frac{u'v-uv'}{v^2}\\)", "\\(\\frac{uv'-u'v}{v^2}\\)", "\\(\\frac{u'}{v'}\\)", "\\(\\frac{u'v+uv'}{v^2}\\)"],
        correct: 0
      },
      {
        id: "ckqyso",
        question: "The chain rule \\([f(g(x))]'\\) equals:",
        options: ["\\(f'(g(x))\\)", "\\(f'(x)\\cdot g'(x)\\)", "\\(f'(g(x))\\cdot g'(x)\\)", "\\(f(g'(x))\\)"],
        correct: 2
      },
      {
        id: "0a28u8",
        question: "\\((\\cos x)' = \\) ?",
        options: ["\\(\\sin x\\)", "\\(-\\sin x\\)", "\\(\\cos x\\)", "\\(-\\cos x\\)"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "1dfmel", sentence: "The derivative is the limit of the _______ quotient (f(x)−f(x₀))/(x−x₀).", answer: "difference", hint: "Δy/Δx as x→x₀" },
      { id: "zgmqt0", sentence: "Geometrically, f′(x₀) is the slope of the _______ to the graph at x₀.", answer: "tangent", hint: "Best linear approximation" },
      { id: "j9onw0", sentence: "By the power rule, (xⁿ)′ = n·x^( _______ ).", answer: "n-1", hint: "One less than the original power" },
      { id: "xavjax", sentence: "The derivative of a constant function is _______.", answer: "0", hint: "A constant does not change" },
      { id: "qw03z7", sentence: "The function eˣ is its own _______.", answer: "derivative", hint: "(eˣ)′ = eˣ" },
      { id: "jjzlq7", sentence: "Differentiating a composite f(g(x)) uses the _______ rule.", answer: "chain", hint: "f′(g(x))·g′(x)" },
      { id: "pym6s4", sentence: "The derivative of f′ is the _______ derivative, written f″.", answer: "second", hint: "Higher-order derivative" }
    ],

    learn: {
      id: "wnoa7y",
      content:
        '<h3>Differentiation</h3>' +
        '<p>For a straight line the rate of change is a single number — the slope \\(a\\). But most functions bend, so their rate of change is different at every point. The <strong>derivative</strong> is the tool that captures this <em>local</em> rate of change. The idea: zoom in on a point \\(x_0\\), look at the difference quotient \\(\\frac{f(x)-f(x_0)}{x-x_0}\\) (the average slope between two nearby points), and let the second point slide towards \\(x_0\\). Because ℝ is <em>continuous</em> the gap can shrink without ever becoming zero, and the quotient settles on a number:</p>' +
        '<div class="formula-box">\\[f\'(x_0)=\\lim_{x\\to x_0}\\frac{f(x)-f(x_0)}{x-x_0}.\\]</div>' +
        '<p>That number is the derivative at \\(x_0\\). <strong>Geometrically</strong> it is the slope of the <span class="highlight">tangent</span> line — the best straight-line approximation of the curve right at \\(x_0\\). Doing this at every point turns the function \\(f\\) into a brand-new function \\(f\'\\), its derivative.</p>' +

        '<h4>Table of derivatives</h4>' +
        '<p>You never compute that limit by hand in practice — you memorise a short table of building blocks and combine them with rules. The blocks:</p>' +
        '<div class="formula-box">\\[(c)\'=0,\\quad (x)\'=1,\\quad (x^n)\'=n x^{n-1},\\]\\[\\left(\\tfrac1x\\right)\'=-\\tfrac{1}{x^2},\\quad (\\sqrt x)\'=\\tfrac{1}{2\\sqrt x},\\]\\[(e^x)\'=e^x,\\quad (\\ln x)\'=\\tfrac1x,\\quad (\\sin x)\'=\\cos x,\\quad (\\cos x)\'=-\\sin x.\\]</div>' +
        '<p>The <strong>power rule</strong> \\((x^n)\'=nx^{n-1}\\) is the one you use most — bring the power down in front and drop it by one. Note the two minus signs that students forget: \\((\\cos x)\'=-\\sin x\\) and \\(\\left(\\tfrac1x\\right)\'=-\\tfrac1{x^2}\\). And \\(e^x\\) is the rare function that is its <em>own</em> derivative.</p>' +

        '<h4>Rules of differentiation</h4>' +
        '<p>To differentiate anything built from the blocks, four rules suffice:</p>' +
        '<ul>' +
        '<li><strong>Linearity</strong>: \\((u\\pm v)\'=u\'\\pm v\'\\), \\((Cu)\'=Cu\'\\) — so a polynomial is differentiated <em>term by term</em>, pulling constants out front.</li>' +
        '<li><strong>Product</strong>: \\((uv)\'=u\'v+uv\'\\) — note you cannot just multiply the two derivatives.</li>' +
        '<li><strong>Quotient</strong>: \\(\\left(\\frac{u}{v}\\right)\'=\\dfrac{u\'v-uv\'}{v^2}\\) — the numerator order \\(u\'v-uv\'\\) matters; swapping it flips the sign.</li>' +
        '<li><strong>Chain</strong> (composite): \\([f(g(x))]\'=f\'(g(x))\\cdot g\'(x)\\).</li>' +
        '</ul>' +
        '<p><strong>Worked example.</strong> Differentiate \\(f(x)=4x^5-3x^4+2x-7\\) term by term: \\(f\'(x)=20x^4-12x^3+2\\). The constant \\(-7\\) vanishes, as every constant does.</p>' +

        '<div class="tip-box">' +
        '<h4>Chain rule in practice</h4>' +
        '<p>A composite is a "function inside a function". Differentiate the <em>outer</em> function (leaving the inner one untouched), then <strong>multiply</strong> by the derivative of the inner: \\((\\ln(3x^2+5))\'=\\frac{1}{3x^2+5}\\cdot 6x=\\frac{6x}{3x^2+5}\\). Forgetting the second factor \\(g\'(x)\\) is the single most common differentiation mistake. The chain rule is what lets us differentiate the exponential, logarithmic and trigonometric expressions that appear throughout economics.</p>' +
        '</div>' +

        '<h4>Higher-order derivatives</h4>' +
        '<p>Nothing stops you differentiating the result again. The derivative of \\(f\'\\) is the <strong>second derivative</strong> \\(f\'\'=\\left(f\'\\right)\'\\), and in general \\(f^{(n)}=\\left[f^{(n-1)}\\right]\'\\). For the example above, \\(f\'\'(x)=80x^3-36x^2\\). The first derivative tells us whether a function rises or falls; the second tells us how it <em>curves</em> — and together, in the next unit, they pin down maxima and minima.</p>'
    }
  },

  // ========================================================================
  // CATEGORY 5: INCREASE, DECREASE & EXTREMA
  // ========================================================================
  extrema: {
    id: "qtvemf",
    name: "Increase, Decrease & Extrema",
    icon: "fa-arrow-trend-up",
    color: "#8b5cf6",

    flashcards: [
      {
        id: "he810v",
        question: "How does the SIGN of the first derivative tell you where a function increases or decreases?",
        answer: "On an interval \\((a,b)\\):\n\\[f'(x)>0\\ \\text{for all }x\\ \\Rightarrow\\ f\\text{ increases},\\]\n\\[f'(x)<0\\ \\text{for all }x\\ \\Rightarrow\\ f\\text{ decreases}.\\]\nRecall \\(f'(x_0)\\) is the slope of the tangent at \\(x_0\\): positive slope rises, negative slope falls.",
        explanation: "This links the 'value' definition of increasing/decreasing to the derivative."
      },
      {
        id: "e2s14o",
        question: "What is a STATIONARY point?",
        answer: "A stationary point is any \\(x_0\\) where the first derivative is zero:\n\\[f'(x_0)=0.\\]\nGeometrically the tangent is horizontal there. At a stationary point the function may have an extremum (min or max) OR an inflection point.",
        explanation: "Equating f′(x)=0 and solving gives the candidate points for extrema."
      },
      {
        id: "k2rnfz",
        question: "State the FIRST-derivative test for a minimum and a maximum.",
        answer: "\\(x_0\\) is a MINIMUM if \\(f'(x_0)=0\\) and \\(f'\\) changes from negative to positive:\n• \\(f'(x)<0\\) for \\(x<x_0\\) (falls), \\(f'(x)>0\\) for \\(x>x_0\\) (rises).\n\n\\(x_0\\) is a MAXIMUM if \\(f'(x_0)=0\\) and \\(f'\\) changes from positive to negative:\n• \\(f'(x)>0\\) for \\(x<x_0\\) (rises), \\(f'(x)<0\\) for \\(x>x_0\\) (falls).",
        explanation: "The extremum is where the function changes from rising to falling (max) or falling to rising (min)."
      },
      {
        id: "9oewp9",
        question: "State the SECOND-derivative test for classifying a stationary point.",
        answer: "At a stationary point \\(x_0\\) (where \\(f'(x_0)=0\\)):\n\\[f''(x_0)>0\\ \\Rightarrow\\ x_0\\text{ is a MINIMUM},\\]\n\\[f''(x_0)<0\\ \\Rightarrow\\ x_0\\text{ is a MAXIMUM}.\\]\nIf \\(f''(x_0)=0\\), \\(x_0\\) is (typically) an INFLECTION point.",
        explanation: "f″ measures curvature: positive = curve opens upward (cup → minimum); negative = opens downward (cap → maximum)."
      },
      {
        id: "4mztaj",
        question: "What is an INFLECTION point, and how is it detected at a stationary point?",
        answer: "An inflection point is where the function changes its CURVATURE. At a stationary point \\(x_0\\), if the first derivative does NOT change sign (or equivalently \\(f''(x_0)=0\\)), then \\(x_0\\) is an inflection point rather than an extremum.",
        explanation: "So f′(x₀)=0 alone is not enough to guarantee an extremum — you must test the sign change or f″."
      },
      {
        id: "et8ump",
        question: "List the steps of the FUNCTION-FLOW table (to find increase/decrease and extrema).",
        answer: "1. Determine the domain of the function.\n2. Find the first derivative \\(f'\\).\n3. Find stationary points by solving \\(f'(x)=0\\).\n4. Split the domain into intervals at the stationary points.\n5. Pick a test point in each interval and find the SIGN of \\(f'\\) there.\n6. Read off intervals of increase/decrease and the extrema.",
        explanation: "This systematic table is the standard exam procedure for analysing a function's flow."
      },
      {
        id: "3bn6tm",
        question: "In economics, what is the marginal cost function?",
        answer: "Marginal cost is the DERIVATIVE of the total-cost function:\n\\[M(Q)=T'(Q).\\]\nIt is the (approximate) cost of producing one more unit. Likewise: income \\(P(Q)=pQ\\), profit \\(D(Q)=P(Q)-T(Q)\\), average cost \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\).",
        explanation: "Marginal = derivative of total. Many K1 optimisation problems compare marginal and average cost."
      },
      {
        id: "6fzaz0",
        question: "How do you find the MAXIMUM PROFIT of a firm?",
        answer: "Maximise the profit function \\(D(Q)=P(Q)-T(Q)\\):\n1. Solve \\(D'(Q)=0\\) for the stationary quantity \\(Q_0\\).\n2. Confirm it is a maximum (\\(D''(Q_0)<0\\), or first-derivative sign change).\n3. The maximum profit is \\(D(Q_0)\\).",
        explanation: "If D(Q) is a downward parabola, its maximum lies at the midpoint of the break-even interval (by symmetry)."
      },
      {
        id: "46emp1",
        question: "How do you find the MINIMUM AVERAGE COST?",
        answer: "Form the average cost \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\), then minimise it:\n1. Solve \\(\\overline{T}'(Q)=0\\) for the stationary \\(Q_0\\).\n2. Confirm a minimum (\\(\\overline{T}''(Q_0)>0\\)).\n3. The minimum average cost is \\(\\overline{T}(Q_0)\\).",
        explanation: "E.g. T(Q)=5Q³−90Q²+540Q → average 5Q²−90Q+540, minimised at Q=9, value 135."
      }
    ],

    quiz: [
      {
        id: "qt931u",
        question: "If \\(f'(x)>0\\) on an interval, the function is:",
        options: ["Decreasing", "Increasing", "Constant", "At a maximum"],
        correct: 1
      },
      {
        id: "azs1g8",
        question: "A stationary point is a point where:",
        options: ["\\(f(x_0)=0\\)", "\\(f'(x_0)=0\\)", "\\(f''(x_0)=0\\)", "\\(f(x_0)=x_0\\)"],
        correct: 1
      },
      {
        id: "zt1u32",
        question: "By the second-derivative test, if \\(f'(x_0)=0\\) and \\(f''(x_0)>0\\), then \\(x_0\\) is a:",
        options: ["Maximum", "Minimum", "Inflection point", "Zero"],
        correct: 1
      },
      {
        id: "a6ln3c",
        question: "By the second-derivative test, if \\(f'(x_0)=0\\) and \\(f''(x_0)<0\\), then \\(x_0\\) is a:",
        options: ["Maximum", "Minimum", "Inflection point", "Asymptote"],
        correct: 0
      },
      {
        id: "vb4k9f",
        question: "At a stationary point, if the first derivative does NOT change sign, the point is:",
        options: ["A maximum", "A minimum", "An inflection point", "A break-even point"],
        correct: 2
      },
      {
        id: "kya4ik",
        question: "Marginal cost is defined as:",
        options: ["\\(\\frac{T(Q)}{Q}\\)", "\\(T'(Q)\\)", "\\(P(Q)-T(Q)\\)", "\\(pQ\\)"],
        correct: 1
      },
      {
        id: "huysvu",
        question: "To maximise profit \\(D(Q)\\), you first solve:",
        options: ["\\(D(Q)=0\\)", "\\(D'(Q)=0\\)", "\\(T(Q)=0\\)", "\\(P(Q)=0\\)"],
        correct: 1
      },
      {
        id: "o57zyc",
        question: "The FIRST step of the function-flow table is to determine the function's:",
        options: ["Second derivative", "Domain", "Asymptotes", "Maximum"],
        correct: 1
      }
    ],

    fillBlanks: [
      { id: "htqmh5", sentence: "If f′(x) > 0 on an interval, the function is _______ there.", answer: "increasing", hint: "Positive slope rises" },
      { id: "s9cmux", sentence: "A point where f′(x₀) = 0 is called a _______ point.", answer: "stationary", hint: "Horizontal tangent" },
      { id: "ccf90t", sentence: "If f′(x₀)=0 and f″(x₀) > 0, then x₀ is a _______.", answer: "minimum", hint: "Curve opens upward" },
      { id: "sru7vc", sentence: "If f′(x₀)=0 and f″(x₀) < 0, then x₀ is a _______.", answer: "maximum", hint: "Curve opens downward" },
      { id: "4h6ak0", sentence: "A point where the function changes its curvature is an _______ point.", answer: "inflection", hint: "f″ = 0, no sign change in f′" },
      { id: "6frd4f", sentence: "Marginal cost is the _______ of the total-cost function, M(Q) = T′(Q).", answer: "derivative", hint: "Cost of one more unit" },
      { id: "jcofwf", sentence: "To maximise profit you solve D′(Q) = _______.", answer: "0", hint: "Stationary point of profit" }
    ],

    learn: {
      id: "15epji",
      content:
        '<h3>Increase, decrease &amp; extrema</h3>' +
        '<p>This unit is where the derivative pays off: it turns the vague idea of a curve "rising", "falling" or "turning around" into something you can <em>compute</em>. The key link is the geometric meaning from the last unit — \\(f\'(x_0)\\) is the slope of the tangent — so the <span class="highlight">sign</span> of the derivative reads off the direction of travel:</p>' +
        '<div class="formula-box">\\[f\'(x)>0\\Rightarrow f\\text{ increases},\\qquad f\'(x)<0\\Rightarrow f\\text{ decreases}.\\]</div>' +
        '<p>A positive slope means the tangent points uphill, so the function is rising; a negative slope points downhill. The interesting places are where it switches from one to the other.</p>' +

        '<h4>Stationary points and the two tests</h4>' +
        '<p>A <strong>stationary point</strong> is any \\(x_0\\) with \\(f\'(x_0)=0\\): the tangent is horizontal there. It is only a <em>candidate</em> — the function may have a minimum, a maximum, or merely flatten out at an inflection point. Two tests decide which:</p>' +
        '<ul>' +
        '<li><strong>First-derivative test</strong> — look at how \\(f\'\\) changes sign across \\(x_0\\): a switch \\(-\\to+\\) (falling then rising) is a <em>minimum</em>; \\(+\\to-\\) (rising then falling) is a <em>maximum</em>; <em>no</em> sign change is an inflection point.</li>' +
        '<li><strong>Second-derivative test</strong> — evaluate \\(f\'\'(x_0)\\): the value \\(f\'\'(x_0)>0\\) means the curve opens upward (a cup → <em>minimum</em>), \\(f\'\'(x_0)<0\\) means it opens downward (a cap → <em>maximum</em>), and \\(f\'\'(x_0)=0\\) is inconclusive (typically an inflection).</li>' +
        '</ul>' +
        '<p><strong>Worked example.</strong> For \\(f(x)=x^2-6x+5\\): \\(f\'(x)=2x-6=0\\Rightarrow x_0=3\\). Since \\(f\'\'(x)=2>0\\), the point \\(x_0=3\\) is a minimum, with value \\(f(3)=-4\\). A single sign decided the whole question.</p>' +

        '<div class="tip-box">' +
        '<h4>Function-flow table (the exam procedure)</h4>' +
        '<p>The reliable recipe for "analyse the function" is a six-step table: (1) find the <strong>domain</strong> → (2) compute \\(f\'\\) → (3) solve \\(f\'(x)=0\\) for the <strong>stationary points</strong> → (4) split the domain into intervals at those points → (5) test the <strong>sign</strong> of \\(f\'\\) in each interval (pick any convenient test point) → (6) read off where the function increases/decreases and which stationary points are maxima or minima. Doing the steps in order means you never miss a turning point.</p>' +
        '</div>' +

        '<h4>Optimisation in economics</h4>' +
        '<p>The same machinery finds a firm\'s best operating point — the quantitative pay-off of the whole midterm. <strong>Marginal cost</strong> is the derivative of total cost, \\(M(Q)=T\'(Q)\\) — roughly the cost of one more unit. To <strong>maximise profit</strong> \\(D(Q)=P(Q)-T(Q)\\), solve \\(D\'(Q)=0\\) for the stationary quantity and confirm \\(D\'\'<0\\); to <strong>minimise average cost</strong> \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\), solve \\(\\overline{T}\'(Q)=0\\) and confirm \\(\\overline{T}\'\'>0\\). <strong>Worked example.</strong> With \\(T(Q)=5Q^3-90Q^2+540Q\\), the average cost \\(\\overline{T}(Q)=5Q^2-90Q+540\\) has \\(\\overline{T}\'(Q)=10Q-90=0\\Rightarrow Q=9\\), giving a minimum average cost of \\(135\\). The derivative has turned a business question into one short calculation.</p>'
    }
  }

};

// Expose on window (catalog looks it up by name); also CommonJS for node tests.
if (typeof window !== "undefined") { window.mathM1 = mathM1; }
if (typeof module !== "undefined" && module.exports) { module.exports = mathM1; }
