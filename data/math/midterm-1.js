// ===== MATHEMATICS — 1st MIDTERM (K1) =====
// Source: lecture decks 1–5 (PhD Iva Mrša Haber & Ante Funtak, prof.; FMTU Opatija, 1st year HM).
// Textbook: Mihalinčić, K. & Mrša Haber, I. "Mathematics" (FMTU script, 2017);
//           Klaričić Bakula & Braić, "Introduction to Mathematics" (Split, 2011/12).
// K1/K2 boundary AUTHORITATIVE from the syllabus: K1 = topics 1–5 (up to extrema).
//   1. Field of Real Numbers ℝ        2. Basic Equations on ℝ
//   3. Functions                       4. Differentiation
//   5. Increase, Decrease & Extrema
//
// ⚠ QUANTITATIVE SUBJECT — uses KaTeX (ADR-009). Convention (docs/CONTENT_SCHEMA.md §Math):
//   inline  \( ... \)   (in a JS string: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   A single `$` is NEVER used (currency-safe). A LaTeX backslash in a string = "\\".
// ⚠ CACHE: when editing data/*, bump CONTENT_VERSION in js/content-loader.js.

const mathM1 = {

  // ========================================================================
  // CATEGORY 1: FIELD OF REAL NUMBERS ℝ
  // ========================================================================
  realNumbers: {
    name: "Field of Real Numbers ℝ",
    icon: "fa-infinity",
    color: "#8b5cf6",

    flashcards: [
      {
        question: "What are the five number sets, and how are they nested?",
        answer: "• \\(\\mathbb{N}\\) — natural numbers (counting): \\(\\{1,2,3,\\dots\\}\\)\n• \\(\\mathbb{Z}\\) — integers: \\(\\{\\dots,-2,-1,0,1,2,\\dots\\}\\)\n• \\(\\mathbb{Q}\\) — rational numbers: \\(\\frac{m}{n},\\ m,n\\in\\mathbb{Z},\\ n\\neq 0\\)\n• \\(\\mathbb{I}\\) — irrational numbers (infinite non-periodic decimals)\n• \\(\\mathbb{R}\\) — real numbers\n\nThe chain of subsets: \\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\), and \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\).",
        explanation: "Each set is an extension of the previous one, introduced to make a new operation always possible. ℚ and 𝕀 are disjoint (ℚ ⊄ 𝕀)."
      },
      {
        question: "Why is the set of integers \\(\\mathbb{Z}\\) introduced as an extension of \\(\\mathbb{N}\\)?",
        answer: "In \\(\\mathbb{N}\\) you cannot always subtract: when the minuend is smaller than the subtrahend (e.g. \\(3-5\\)), there is no natural-number result. So \\(\\mathbb{N}\\) has no inverse element for addition.\n\n\\(\\mathbb{Z}\\) adds \\(0\\) (the neutral element for addition) and the negatives \\(-a\\) (the opposite/inverse), so subtraction \\(a-b=a+(-b)\\) is always defined.",
        explanation: "ℕ₀ = ℕ ∪ {0}. Each extension is built to supply a missing inverse: ℤ for subtraction, ℚ for division."
      },
      {
        question: "What is a rational number, and what three decimal forms can it take?",
        answer: "A rational number is any number of the form \\(\\frac{m}{n}\\) with \\(m,n\\in\\mathbb{Z},\\ n\\neq 0\\). It is introduced so that division is always possible (the reciprocal \\(a^{-1}=\\tfrac1a\\) exists for \\(a\\neq 0\\)).\n\nDecimal forms:\n1. Finite: \\(\\frac34=0.75\\)\n2. Periodic, one repeating digit: \\(34.5555\\dots=34.\\dot5\\)\n3. Periodic, a repeating group: \\(\\frac{15}{7}=2.\\dot14285\\dot7\\)",
        explanation: "Every rational number has either a finite or an eventually-periodic decimal expansion — that is exactly what distinguishes it from an irrational number."
      },
      {
        question: "What is an irrational number? Give examples.",
        answer: "An irrational number is written as an INFINITE, NON-periodic decimal — it cannot be written as a fraction \\(\\frac{m}{n}\\).\n\nExamples: \\(\\sqrt2=1.41421356\\dots\\), \\(\\sqrt{13}=3.605551\\dots\\), \\(\\pi\\approx 3.14159\\dots\\), and \\(0.1234565\\dots\\)\n\nThey appear naturally: \\(x^2=2\\) has solutions \\(x=\\pm\\sqrt2\\), which are NOT rational.",
        explanation: "The set of irrationals 𝕀 is a SEPARATE set, not an extension of ℚ — together they fill the real line: ℝ = ℚ ∪ 𝕀."
      },
      {
        question: "List the properties of addition and multiplication that hold in \\(\\mathbb{R}\\).",
        answer: "For all \\(a,b,c\\in\\mathbb{R}\\):\n• CLOSEDNESS: \\(a+b\\in\\mathbb{R}\\), \\(a\\cdot b\\in\\mathbb{R}\\)\n• COMMUTATIVITY: \\(a+b=b+a\\), \\(a\\cdot b=b\\cdot a\\)\n• ASSOCIATIVITY: \\((a+b)+c=a+(b+c)\\)\n• NEUTRAL element: \\(a+0=a\\); \\(a\\cdot 1=a\\)\n• INVERSE element: \\(a+(-a)=0\\); \\(a\\cdot a^{-1}=1\\) (for \\(a\\neq 0\\))\n• DISTRIBUTIVITY: \\((a+b)\\cdot c=a\\cdot c+b\\cdot c\\)",
        explanation: "ℝ has ALL of these for both operations. ℕ lacks an additive neutral & inverse; ℤ lacks a multiplicative inverse; ℚ and ℝ have them all."
      },
      {
        question: "Which properties are MISSING in \\(\\mathbb{N}\\) and in \\(\\mathbb{Z}\\)?",
        answer: "• \\(\\mathbb{N}\\): no neutral element for addition (0 ∉ ℕ) and no inverse for addition → subtraction not always possible.\n• \\(\\mathbb{Z}\\): has a neutral & inverse for addition, but NO inverse for multiplication → division \\(a:b\\) is not always an integer (e.g. \\(2:4=\\tfrac12\\notin\\mathbb{Z}\\)).\n\nThis is exactly why ℚ (and then ℝ) is introduced.",
        explanation: "Distributivity holds in all four sets ℕ, ℤ, ℚ, ℝ."
      },
      {
        question: "What is a FIELD, and why is \\((\\mathbb{R},+,\\cdot)\\) called the field of real numbers?",
        answer: "A FIELD is any set with at least two distinct elements and two operations (addition & multiplication) satisfying nine properties: associativity, neutral & inverse of addition, commutativity of addition, associativity, neutral & inverse of multiplication, commutativity of multiplication, and distributivity of multiplication over addition.\n\nThe set \\(\\mathbb{R}\\) with the usual \\(+\\) and \\(\\cdot\\) satisfies all nine, so \\((\\mathbb{R},+,\\cdot)\\) is the FIELD of real numbers.",
        explanation: "The field structure is what lets us solve equations and do algebra reliably on ℝ."
      },
      {
        question: "Define exponentiation and the n-th root on \\(\\mathbb{R}\\).",
        answer: "EXPONENTIATION is repeated multiplication of the same number:\n\\[x^n=\\underbrace{x\\cdot x\\cdots x}_{n\\text{ times}}\\]\n(just as multiplication \\(nx=x+x+\\dots+x\\) is repeated addition).\n\nThe SECOND ROOT: if \\(a=b^2\\) then \\(b=\\sqrt a\\). E.g. \\(x^2=4\\) has two solutions \\(x_1=2,\\ x_2=-2\\).",
        explanation: "x²=2 has solutions ±√2 — the existence of such non-rational roots forces the introduction of irrational numbers."
      },
      {
        question: "What is the reciprocal (multiplicative inverse) of a number \\(a\\)?",
        answer: "For every \\(a\\in\\mathbb{Q}\\) (or \\(\\mathbb{R}\\)) with \\(a\\neq 0\\) there is a unique INVERSE \\(\\frac1a=a^{-1}\\) such that\n\\[a\\cdot a^{-1}=a^{-1}\\cdot a=1.\\]\nDividing by \\(b\\neq 0\\) means multiplying by its reciprocal: \\(a:b=a\\cdot\\frac1b\\).",
        explanation: "0 has no reciprocal — that is why division by zero is undefined."
      }
    ],

    quiz: [
      {
        question: "Which chain of subsets is correct?",
        options: ["\\(\\mathbb{R}\\subset\\mathbb{Q}\\subset\\mathbb{Z}\\subset\\mathbb{N}\\)", "\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)", "\\(\\mathbb{Z}\\subset\\mathbb{N}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)", "\\(\\mathbb{Q}\\subset\\mathbb{I}\\subset\\mathbb{R}\\)"],
        correct: 1
      },
      {
        question: "Which number is irrational?",
        options: ["\\(\\frac{15}{7}\\)", "\\(0.75\\)", "\\(\\sqrt2\\)", "\\(-3\\)"],
        correct: 2
      },
      {
        question: "Why is the set of integers \\(\\mathbb{Z}\\) introduced?",
        options: ["To make division always possible", "To make subtraction always possible (additive inverse)", "To introduce irrational numbers", "To define exponentiation"],
        correct: 1
      },
      {
        question: "Which property does \\(\\mathbb{Z}\\) LACK (but \\(\\mathbb{Q}\\) has)?",
        options: ["Inverse for addition", "Neutral element for addition", "Inverse for multiplication", "Distributivity"],
        correct: 2
      },
      {
        question: "\\(\\mathbb{R}=\\) ?",
        options: ["\\(\\mathbb{Q}\\cap\\mathbb{I}\\)", "\\(\\mathbb{Q}\\cup\\mathbb{I}\\)", "\\(\\mathbb{Z}\\cup\\mathbb{N}\\)", "\\(\\mathbb{Q}\\setminus\\mathbb{I}\\)"],
        correct: 1
      },
      {
        question: "A finite or eventually-periodic decimal expansion always represents a number that is:",
        options: ["Irrational", "Rational", "Natural", "Negative"],
        correct: 1
      },
      {
        question: "The multiplicative inverse (reciprocal) of \\(a\\neq 0\\) satisfies:",
        options: ["\\(a+(-a)=0\\)", "\\(a\\cdot a^{-1}=1\\)", "\\(a\\cdot 0=0\\)", "\\(a^{-1}=-a\\)"],
        correct: 1
      },
      {
        question: "How many properties must hold for a set with two operations to be a FIELD?",
        options: ["4", "6", "9", "12"],
        correct: 2
      },
      {
        question: "The equation \\(x^2=2\\) shows the need for which set of numbers?",
        options: ["Integers \\(\\mathbb{Z}\\)", "Rational numbers \\(\\mathbb{Q}\\)", "Irrational numbers \\(\\mathbb{I}\\)", "Natural numbers \\(\\mathbb{N}\\)"],
        correct: 2
      }
    ],

    fillBlanks: [
      { sentence: "The set of counting numbers {1, 2, 3, …} is the set of _______ numbers.", answer: "natural", hint: "Symbol ℕ" },
      { sentence: "A number that can be written as m/n with integers m, n (n ≠ 0) is called a _______ number.", answer: "rational", hint: "Symbol ℚ" },
      { sentence: "An infinite, non-periodic decimal represents an _______ number.", answer: "irrational", hint: "Symbol 𝕀; e.g. √2, π" },
      { sentence: "The set of real numbers is the union ℝ = ℚ ∪ _______.", answer: "I", hint: "Rationals together with irrationals" },
      { sentence: "The neutral element for addition is the number _______.", answer: "0", hint: "a + 0 = a" },
      { sentence: "The neutral element for multiplication is the number _______.", answer: "1", hint: "a · 1 = a" },
      { sentence: "Dividing by b ≠ 0 means multiplying by its _______.", answer: "reciprocal", hint: "1/b = b⁻¹; also called the multiplicative inverse" }
    ],

    learn: {
      content:
        '<h3>The field of real numbers ℝ</h3>' +
        '<p>Mathematics on the real line is built up step by step. We start from the numbers we count with and, each time an operation cannot be carried out, we <strong>extend</strong> the number set so it can. Each extension supplies a missing <span class="highlight">inverse</span>.</p>' +

        '<h4>The five number sets</h4>' +
        '<ul>' +
        '<li><strong>Natural numbers</strong> \\(\\mathbb{N}=\\{1,2,3,\\dots\\}\\) — the numbers we count with.</li>' +
        '<li><strong>Integers</strong> \\(\\mathbb{Z}=\\{\\dots,-2,-1,0,1,2,\\dots\\}\\) — add 0 and the negatives so that subtraction always works.</li>' +
        '<li><strong>Rational numbers</strong> \\(\\mathbb{Q}=\\left\\{\\frac{m}{n}: m,n\\in\\mathbb{Z},\\ n\\neq 0\\right\\}\\) — so that division always works.</li>' +
        '<li><strong>Irrational numbers</strong> \\(\\mathbb{I}\\) — infinite non-periodic decimals such as \\(\\sqrt2,\\ \\pi\\).</li>' +
        '<li><strong>Real numbers</strong> \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\).</li>' +
        '</ul>' +
        '<div class="formula-box">\\[\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\]</div>' +

        '<div class="tip-box">' +
        '<h4>Why each extension?</h4>' +
        '<p>In \\(\\mathbb{N}\\) you cannot compute \\(3-5\\) → introduce \\(\\mathbb{Z}\\) (additive inverse \\(-a\\)). In \\(\\mathbb{Z}\\) you cannot compute \\(2:4\\) as a whole number → introduce \\(\\mathbb{Q}\\) (multiplicative inverse \\(\\tfrac1a\\)). The equation \\(x^2=2\\) has no rational solution → introduce \\(\\mathbb{I}\\).</p>' +
        '</div>' +

        '<h4>Rational vs. irrational — the decimal test</h4>' +
        '<p>A number is <strong>rational</strong> exactly when its decimal expansion is finite (\\(\\frac34=0.75\\)) or eventually periodic (\\(\\frac{15}{7}=2.\\dot14285\\dot7\\)). A number is <strong>irrational</strong> when the expansion is infinite and never repeats (\\(\\sqrt2=1.41421356\\dots\\)).</p>' +

        '<h4>Properties of the operations</h4>' +
        '<p>For all \\(a,b,c\\in\\mathbb{R}\\), addition and multiplication satisfy:</p>' +
        '<ul>' +
        '<li><strong>Closedness</strong> — the result stays in the set;</li>' +
        '<li><strong>Commutativity</strong> \\(a+b=b+a\\), \\(ab=ba\\);</li>' +
        '<li><strong>Associativity</strong> \\((a+b)+c=a+(b+c)\\);</li>' +
        '<li><strong>Neutral element</strong> \\(a+0=a\\), \\(a\\cdot 1=a\\);</li>' +
        '<li><strong>Inverse element</strong> \\(a+(-a)=0\\), \\(a\\cdot a^{-1}=1\\ (a\\neq 0)\\);</li>' +
        '<li><strong>Distributivity</strong> \\((a+b)c=ac+bc\\).</li>' +
        '</ul>' +
        '<p>\\(\\mathbb{N}\\) lacks an additive neutral and inverse; \\(\\mathbb{Z}\\) lacks a multiplicative inverse; \\(\\mathbb{Q}\\) and \\(\\mathbb{R}\\) have them all.</p>' +

        '<h4>ℝ is a field</h4>' +
        '<p>A set with two operations satisfying the <strong>nine</strong> properties above is called a <span class="highlight">field</span>. Because \\(\\mathbb{R}\\) satisfies all of them, \\((\\mathbb{R},+,\\cdot)\\) is the <strong>field of real numbers</strong>. This algebraic structure is what makes solving equations on ℝ reliable — the subject of the next unit.</p>'
    }
  },

  // ========================================================================
  // CATEGORY 2: BASIC EQUATIONS ON ℝ
  // ========================================================================
  basicEquations: {
    name: "Basic Equations on ℝ",
    icon: "fa-equals",
    color: "#8b5cf6",

    flashcards: [
      {
        question: "What determines how many solutions an algebraic (polynomial) equation has?",
        answer: "The DEGREE of the equation — the highest power of the unknown — determines the number of solutions.\n\nE.g. \\(5x^3-3x^2+x^4=x+5\\) is of degree 4 → it has four solutions.\n\nSolutions may be repeated, but they are still counted as separate solutions.",
        explanation: "An equation in one unknown need not have only one solution. We focus on equations of degree 1 (linear) and 2 (quadratic), plus equations that reduce to them."
      },
      {
        question: "What is a linear equation and how do you solve it?",
        answer: "A linear equation has the form\n\\[ax+b=0,\\quad a\\neq 0,\\ a,b\\in\\mathbb{R}.\\]\nTo solve means to find the number that, put in place of the unknown, gives a true equality. The solution is\n\\[x=-\\frac{b}{a}.\\]",
        explanation: "It is a 1st-degree equation, so it has exactly one solution."
      },
      {
        question: "Give the quadratic equation and the general solution formula.",
        answer: "A complete quadratic equation:\n\\[ax^2+bx+c=0,\\quad a\\neq 0.\\]\n\\(a\\) = leading (quadratic) coefficient, \\(b\\) = linear coefficient, \\(c\\) = free (constant) coefficient. The two solutions:\n\\[x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.\\]",
        explanation: "A 2nd-degree equation has two solutions x₁, x₂ (possibly equal, possibly non-real)."
      },
      {
        question: "What are the two INCOMPLETE forms of the quadratic equation and their solutions?",
        answer: "1. \\(ax^2+c=0\\) (no linear term): \\(x_{1,2}=\\pm\\sqrt{-\\frac{c}{a}}\\)\n\n2. \\(ax^2+bx=0\\) (no constant term): factor \\(x(ax+b)=0\\) →\n\\(x_1=0,\\quad x_2=-\\frac{b}{a}\\)",
        explanation: "Form 2 always has x = 0 as one solution. These are quicker to solve than using the full formula."
      },
      {
        question: "What does the DISCRIMINANT \\(D=b^2-4ac\\) tell you?",
        answer: "It is the expression under the root in the quadratic formula, and it decides the NATURE of the solutions:\n• \\(D>0\\) → two distinct real solutions\n• \\(D=0\\) → one (repeated) real solution\n• \\(D<0\\) → no real solution (the solutions are complex)",
        explanation: "E.g. x² + 8x + 25 = 0 has D = 64 − 100 = −36 < 0 → no real solution."
      },
      {
        question: "How do you solve a BIQUADRATIC equation \\(ax^4+bx^2+c=0\\)?",
        answer: "Introduce the substitution \\(t=x^2\\). The equation becomes a quadratic in \\(t\\):\n\\[at^2+bt+c=0,\\quad t_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.\\]\nThen undo the substitution: solve \\(t_1=x^2\\) and \\(t_2=x^2\\). Each gives up to two values of \\(x\\) → up to four solutions \\(x_1,x_2,x_3,x_4\\).",
        explanation: "Example: 36x⁴ − 25x² + 4 = 0 → x = ±2/3, ±1/2."
      },
      {
        question: "How do you solve an IRRATIONAL equation (unknown under a root), and what must you always do?",
        answer: "Isolate the root and SQUARE both sides to remove it, then solve the resulting (often quadratic) equation.\n\n⚠ You MUST substitute each obtained solution back into the ORIGINAL equation and check it — squaring can introduce false (extraneous) solutions that do not satisfy the original.",
        explanation: "Example: √(2x+1) = x − 1. Squaring is a non-reversible step, so checking is mandatory."
      },
      {
        question: "How do you solve a system of one quadratic and one linear equation?",
        answer: "By SUBSTITUTION:\n1. From the LINEAR equation, express one unknown.\n2. Substitute that expression into the QUADRATIC equation and solve for the second unknown.\n3. Put each value back into the expression for the first unknown to get its matching value.",
        explanation: "Each solution is an ordered pair (x, y). A quadratic-linear system typically yields two pairs."
      },
      {
        question: "What are the steps of the second-stage problem-solving process (word problems / modeling)?",
        answer: "1. Read the problem carefully several times.\n2. Identify what is known and what must be found.\n3. Name the known and unknown variables.\n4. If helpful, draw a picture/table.\n5. Establish mathematical relations between known and unknown quantities.\n6. Write the equation(s)/system.\n7. Solve the mathematical model.\n8. Interpret the solution.\n9. Check its accuracy and meaningfulness.",
        explanation: "\"Second-degree problems\" are everyday/professional problems that reduce to quadratic equations or to linear–quadratic systems."
      }
    ],

    quiz: [
      {
        question: "The solution of the linear equation \\(ax+b=0\\) (\\(a\\neq 0\\)) is:",
        options: ["\\(x=\\frac{b}{a}\\)", "\\(x=-\\frac{b}{a}\\)", "\\(x=\\frac{a}{b}\\)", "\\(x=ab\\)"],
        correct: 1
      },
      {
        question: "The solutions of \\(ax^2+bx+c=0\\) are given by:",
        options: ["\\(x=-\\frac{b}{a}\\)", "\\(x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\)", "\\(x_{1,2}=\\frac{b\\pm\\sqrt{b^2+4ac}}{2a}\\)", "\\(x=\\frac{c}{a}\\)"],
        correct: 1
      },
      {
        question: "The degree of \\(x^4+5x^3-3x^2=x+5\\) — and hence the number of its solutions — is:",
        options: ["2", "3", "4", "5"],
        correct: 2
      },
      {
        question: "If the discriminant \\(D=b^2-4ac<0\\), the quadratic equation has:",
        options: ["Two distinct real solutions", "One repeated real solution", "No real solution", "Infinitely many solutions"],
        correct: 2
      },
      {
        question: "The incomplete quadratic \\(ax^2+bx=0\\) always has which solution?",
        options: ["\\(x=1\\)", "\\(x=0\\)", "\\(x=-1\\)", "\\(x=\\frac{c}{a}\\)"],
        correct: 1
      },
      {
        question: "To solve a biquadratic \\(ax^4+bx^2+c=0\\), the right substitution is:",
        options: ["\\(t=x\\)", "\\(t=x^2\\)", "\\(t=\\sqrt{x}\\)", "\\(t=\\frac1x\\)"],
        correct: 1
      },
      {
        question: "After squaring both sides of an irrational equation, you MUST:",
        options: ["Square again", "Check each solution in the original equation", "Differentiate", "Divide by the unknown"],
        correct: 1
      },
      {
        question: "A system of a quadratic and a linear equation is best solved by:",
        options: ["Squaring", "The substitution method", "Adding the equations", "Drawing a parabola"],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: "An equation of the form ax + b = 0 (a ≠ 0) is called a _______ equation.", answer: "linear", hint: "1st degree" },
      { sentence: "An equation of the form ax² + bx + c = 0 (a ≠ 0) is called a _______ equation.", answer: "quadratic", hint: "2nd degree" },
      { sentence: "The _______ of a polynomial equation determines the number of its solutions.", answer: "degree", hint: "Highest power of the unknown" },
      { sentence: "The expression b² − 4ac under the root is called the _______.", answer: "discriminant", hint: "Its sign decides the nature of the solutions" },
      { sentence: "A biquadratic equation is solved with the substitution t = _______.", answer: "x^2", hint: "Turns ax⁴+bx²+c into a quadratic in t" },
      { sentence: "After squaring an irrational equation you must _______ each solution in the original.", answer: "check", hint: "Squaring can introduce false solutions" }
    ],

    learn: {
      content:
        '<h3>Basic equations on ℝ</h3>' +
        '<p>An <strong>equation</strong> in one unknown is a statement that two expressions are equal for some value(s) of the unknown. To <em>solve</em> it is to find every number that, put in place of the unknown, makes the equality true. The <span class="highlight">degree</span> (highest power) tells us how many solutions to expect.</p>' +

        '<h4>1. Linear equations</h4>' +
        '<p>Form \\(ax+b=0,\\ a\\neq 0\\). Exactly one solution:</p>' +
        '<div class="formula-box">\\[x=-\\frac{b}{a}\\]</div>' +

        '<h4>2. Quadratic equations</h4>' +
        '<p>Complete form \\(ax^2+bx+c=0,\\ a\\neq 0\\). The two solutions come from the quadratic formula:</p>' +
        '<div class="formula-box">\\[x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\]</div>' +
        '<p>The <strong>discriminant</strong> \\(D=b^2-4ac\\) decides their nature: \\(D>0\\) two real, \\(D=0\\) one repeated, \\(D<0\\) none real. The two <strong>incomplete</strong> forms are quicker:</p>' +
        '<ul>' +
        '<li>\\(ax^2+c=0\\Rightarrow x_{1,2}=\\pm\\sqrt{-\\tfrac{c}{a}}\\)</li>' +
        '<li>\\(ax^2+bx=0\\Rightarrow x(ax+b)=0\\Rightarrow x_1=0,\\ x_2=-\\tfrac{b}{a}\\)</li>' +
        '</ul>' +

        '<h4>3. Equations that reduce to a quadratic</h4>' +
        '<ul>' +
        '<li><strong>Biquadratic</strong> \\(ax^4+bx^2+c=0\\): substitute \\(t=x^2\\), solve \\(at^2+bt+c=0\\), then solve \\(x^2=t_1\\) and \\(x^2=t_2\\) (up to four solutions).</li>' +
        '<li><strong>Irrational</strong> (unknown under a root): isolate the root and square; <strong>always check</strong> the solutions in the original — squaring can create false ones.</li>' +
        '<li><strong>Linear–quadratic systems</strong>: express one unknown from the linear equation and substitute into the quadratic.</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>Modeling ("second-degree problems")</h4>' +
        '<p>Many real problems reduce to a quadratic. Work in steps: read carefully → name the variables → write the relation → solve → <strong>interpret and check</strong> the result. A discount of 65% leaving 192.5 monetary units, ages whose product is 28, flow through pipes of different diameter — all become equations.</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 3: FUNCTIONS
  // ========================================================================
  functions: {
    name: "Functions",
    icon: "fa-chart-line",
    color: "#8b5cf6",

    flashcards: [
      {
        question: "What is a polynomial of degree \\(n\\)?",
        answer: "A polynomial of the n-th degree is a mapping \\(x\\mapsto P_n(x)\\):\n\\[P_n(x)=a_nx^n+a_{n-1}x^{n-1}+\\dots+a_2x^2+a_1x+a_0,\\quad a_i\\in\\mathbb{R},\\ a_n\\neq 0.\\]\nThe degree = the highest power. A value \\(x\\) with \\(P_n(x)=0\\) is a ZERO of the polynomial.",
        explanation: "Degree 0 = constant function; degree 1 = linear; degree 2 = quadratic."
      },
      {
        question: "Define a function and its domain, codomain and image.",
        answer: "Given non-empty sets \\(A,B\\), a FUNCTION \\(f\\) is a rule that assigns to each \\(x\\in A\\) a UNIQUE \\(y\\in B\\), written \\(y=f(x)\\).\n• DOMAIN \\(D_f\\) = set \\(A\\) of all values \\(x\\) can take.\n• CODOMAIN = set \\(B\\) of possible values.\n• IMAGE \\(\\operatorname{Im}f=\\{f(x)\\mid x\\in D_f\\}\\) = the values actually attained.",
        explanation: "The defining feature: each input maps to exactly ONE output."
      },
      {
        question: "What is the NATURAL DOMAIN of a function? Give the three common restrictions.",
        answer: "The natural domain is the LARGEST set on which the formula is defined (used when no domain is stated). Common restrictions:\n• Denominator ≠ 0: \\(f(x)=\\frac1x\\Rightarrow D_f=\\mathbb{R}\\setminus\\{0\\}\\)\n• Even root: argument \\(\\ge 0\\): \\(\\sqrt{g(x)}\\Rightarrow g(x)\\ge 0\\)\n• Logarithm: argument \\(>0\\): \\(\\ln g(x)\\Rightarrow g(x)>0\\)",
        explanation: "A linear function f(x)=ax+b is defined on all of ℝ; f(x)=1/x is not."
      },
      {
        question: "What is the graph of a function, and what do the constant, identity and linear graphs look like?",
        answer: "The GRAPH is the set of points \\((x,y)\\) with \\(y=f(x)\\):\n\\[G(f)=\\{(x,y)\\in\\mathbb{R}^2\\mid x\\in D_f,\\ y=f(x)\\}.\\]\n• Constant \\(f(x)=c\\): horizontal line.\n• Identity \\(f(x)=x\\): the 45° line through the origin.\n• Linear \\(f(x)=ax+b\\): a straight line.",
        explanation: "Constant is the 0-degree polynomial; identity is a special linear function mapping every x to itself."
      },
      {
        question: "For a linear function \\(f(x)=ax+b\\), what do \\(a\\) and \\(b\\) mean?",
        answer: "• \\(a\\) = SLOPE / rate of change / difference quotient — the tangent of the angle the line makes with the x-axis:\n\\[a=\\frac{\\Delta y}{\\Delta x}=\\frac{f(x_2)-f(x_1)}{x_2-x_1}.\\]\nIf \\(a>0\\) the function increases (steeper as \\(a\\) grows); if \\(a<0\\) it decreases.\n• \\(b\\) = the y-intercept (segment cut on the y-axis).",
        explanation: "The 'difference quotient' a is the key idea that leads to the derivative."
      },
      {
        question: "What is the graph of the quadratic function, and of the basic rational function \\(f(x)=\\tfrac1x\\)?",
        answer: "• Quadratic \\(f(x)=ax^2+bx+c\\): a PARABOLA. (Opens up if \\(a>0\\), down if \\(a<0\\).)\n• Rational \\(f(x)=\\frac1x\\): a hyperbola with \\(D_f=\\mathbb{R}\\setminus\\{0\\}\\); the y-axis is a VERTICAL asymptote and the x-axis a HORIZONTAL asymptote.",
        explanation: "An asymptote is a line the graph approaches but never meets."
      },
      {
        question: "Describe the exponential function and its base \\(e\\).",
        answer: "Exponential: \\(f(x)=a^x,\\ a>0,\\ a\\neq 1\\). In this course we use the natural base \\(e\\approx 2.71828\\approx 2.72\\):\n\\[f(x)=e^x.\\]\nIt takes only POSITIVE values, has domain \\(\\langle-\\infty,+\\infty\\rangle\\), codomain \\(\\langle 0,+\\infty\\rangle\\), and is strictly increasing. Rules:\n\\[e^a\\cdot e^b=e^{a+b},\\quad e^a\\div e^b=e^{a-b},\\quad (e^a)^b=e^{ab}.\\]",
        explanation: "e is Euler's number, the base of the natural logarithm; central to growth and financial mathematics."
      },
      {
        question: "Define the logarithm and the natural logarithm, and give the log rules.",
        answer: "The logarithm of \\(b\\) to base \\(a\\) is the exponent \\(x\\) with \\(a^x=b\\):\n\\[\\log_a b=x\\iff a^x=b.\\]\nThe NATURAL logarithm has base \\(e\\): \\(f(x)=\\log_e x=\\ln x\\), defined for \\(x>0\\). Rules:\n\\[\\ln 1=0,\\quad \\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac{a}{b}=\\ln a-\\ln b,\\quad \\ln a^n=n\\ln a.\\]",
        explanation: "ln is the inverse of eˣ: it maps ⟨0,+∞⟩ onto ⟨−∞,+∞⟩."
      },
      {
        question: "How are the trigonometric functions sine and cosine defined on the unit circle?",
        answer: "On the unit circle (\\(r=1\\)) centred at the origin, for the angle \\(\\theta\\):\n\\[\\sin\\theta=\\frac{y}{r}=y,\\qquad \\cos\\theta=\\frac{x}{r}=x.\\]\n(From a right triangle: \\(\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}\\), \\(\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}\\).)",
        explanation: "Because they are periodic, sine and cosine model seasonal (periodic) phenomena — e.g. tourism seasonality / time series."
      },
      {
        question: "Define the cost, revenue and profit functions used in economics.",
        answer: "• TOTAL COST \\(T(Q)\\) — a polynomial in the quantity \\(Q\\); the FIXED cost is \\(T(0)\\) (the free term).\n• REVENUE (income) \\(P(Q)=pQ\\), where \\(p\\) is the unit price.\n• PROFIT \\(D(Q)=P(Q)-T(Q)\\).\n• BREAK-EVEN (coverage) points: \\(P(Q)=T(Q)\\), i.e. \\(D(Q)=0\\).",
        explanation: "Between the break-even points the profit is positive; outside them the firm loses money. E.g. T(Q)=4Q³−120Q²+6Q+124 has fixed cost 124."
      },
      {
        question: "What is the average cost function?",
        answer: "The average cost is the total cost divided by the quantity produced:\n\\[\\overline{T(Q)}=\\frac{T(Q)}{Q}.\\]\nExample: \\(T(Q)=2Q+3\\Rightarrow \\overline{T(Q)}=\\frac{2Q+3}{Q}\\). Total cost makes economic sense for \\(Q\\ge 0\\); average cost for \\(Q>0\\).",
        explanation: "Average cost is a rational function — undefined at Q = 0, where you would divide by zero."
      },
      {
        question: "When is a function increasing or decreasing on an interval \\((a,b)\\)?",
        answer: "\\(f\\) is (strictly) INCREASING on \\((a,b)\\) if for all \\(x_1<x_2\\) in the interval \\(f(x_1)<f(x_2)\\).\n\\(f\\) is (strictly) DECREASING if \\(x_1<x_2\\Rightarrow f(x_1)>f(x_2)\\).",
        explanation: "Non-strict versions use ≤ and ≥. This 'value' definition is later linked to the sign of the derivative."
      }
    ],

    quiz: [
      {
        question: "A function assigns to each element of the domain:",
        options: ["At least one value", "Exactly one value of the codomain", "Any number of values", "Only positive values"],
        correct: 1
      },
      {
        question: "The natural domain of \\(f(x)=\\frac1x\\) is:",
        options: ["\\(\\mathbb{R}\\)", "\\(\\mathbb{R}\\setminus\\{0\\}\\)", "\\(\\langle 0,+\\infty\\rangle\\)", "\\(\\mathbb{R}\\setminus\\{1\\}\\)"],
        correct: 1
      },
      {
        question: "For \\(f(x)=ax+b\\), the coefficient \\(a\\) represents the:",
        options: ["y-intercept", "Slope / rate of change", "Zero of the function", "Curvature"],
        correct: 1
      },
      {
        question: "The graph of a quadratic function is a:",
        options: ["Straight line", "Hyperbola", "Parabola", "Circle"],
        correct: 2
      },
      {
        question: "The natural domain of \\(f(x)=\\ln(g(x))\\) requires:",
        options: ["\\(g(x)\\ge 0\\)", "\\(g(x)>0\\)", "\\(g(x)\\neq 0\\)", "\\(g(x)<0\\)"],
        correct: 1
      },
      {
        question: "\\(\\log_a b=x\\) is equivalent to:",
        options: ["\\(b^x=a\\)", "\\(a^x=b\\)", "\\(x^a=b\\)", "\\(a\\cdot x=b\\)"],
        correct: 1
      },
      {
        question: "Which rule is correct for the natural logarithm?",
        options: ["\\(\\ln(ab)=\\ln a\\cdot\\ln b\\)", "\\(\\ln(ab)=\\ln a+\\ln b\\)", "\\(\\ln(a+b)=\\ln a+\\ln b\\)", "\\(\\ln a^n=a\\ln n\\)"],
        correct: 1
      },
      {
        question: "The profit function is defined as:",
        options: ["\\(D(Q)=P(Q)+T(Q)\\)", "\\(D(Q)=P(Q)-T(Q)\\)", "\\(D(Q)=\\frac{T(Q)}{Q}\\)", "\\(D(Q)=pQ\\)"],
        correct: 1
      },
      {
        question: "The fixed cost of a total-cost function \\(T(Q)\\) equals:",
        options: ["\\(T(1)\\)", "\\(T(0)\\)", "The leading coefficient", "\\(P(Q)\\)"],
        correct: 1
      },
      {
        question: "The base \\(e\\) of the natural logarithm is approximately:",
        options: ["2.72", "3.14", "1.62", "1.41"],
        correct: 0
      }
    ],

    fillBlanks: [
      { sentence: "The set of all values x can take is the _______ of the function.", answer: "domain", hint: "Symbol D_f" },
      { sentence: "A value x for which Pₙ(x) = 0 is a _______ of the polynomial.", answer: "zero", hint: "Where the graph crosses the x-axis" },
      { sentence: "The graph of a quadratic function is a _______.", answer: "parabola", hint: "f(x)=x² shape" },
      { sentence: "A line the graph approaches but never intersects is an _______.", answer: "asymptote", hint: "e.g. axes for f(x)=1/x" },
      { sentence: "The inverse of the exponential function eˣ is the natural _______.", answer: "logarithm", hint: "ln x, defined for x > 0" },
      { sentence: "Revenue is P(Q) = p·Q, where p is the unit _______.", answer: "price", hint: "Price × quantity" },
      { sentence: "Total cost ÷ quantity gives the _______ cost function.", answer: "average", hint: "T(Q)/Q" }
    ],

    learn: {
      content:
        '<h3>Functions</h3>' +
        '<p>A <strong>function</strong> \\(f\\) from a set \\(A\\) to a set \\(B\\) is a rule assigning to each \\(x\\in A\\) a <span class="highlight">unique</span> \\(y=f(x)\\in B\\). The <strong>domain</strong> \\(D_f\\) is the set of allowed inputs, the <strong>codomain</strong> the set of possible outputs, and the <strong>image</strong> \\(\\operatorname{Im}f\\) the outputs actually reached. Its <strong>graph</strong> is the set of points \\((x,f(x))\\) in the plane.</p>' +

        '<h4>Natural domain</h4>' +
        '<p>When no domain is given we use the largest set on which the formula makes sense:</p>' +
        '<ul>' +
        '<li>denominators must be non-zero — \\(\\frac1x\\Rightarrow D_f=\\mathbb{R}\\setminus\\{0\\}\\);</li>' +
        '<li>an even root needs a non-negative argument — \\(\\sqrt{g}\\Rightarrow g\\ge 0\\);</li>' +
        '<li>a logarithm needs a positive argument — \\(\\ln g\\Rightarrow g>0\\).</li>' +
        '</ul>' +

        '<h4>Polynomials and their graphs</h4>' +
        '<p>A polynomial \\(P_n(x)=a_nx^n+\\dots+a_0\\) has degree = highest power. Degree 0 is the <strong>constant</strong> \\(f(x)=c\\) (horizontal line); degree 1 the <strong>linear</strong> \\(f(x)=ax+b\\) (a line, slope \\(a\\), intercept \\(b\\)); degree 2 the <strong>quadratic</strong> (a parabola). The <strong>slope</strong> is the difference quotient</p>' +
        '<div class="formula-box">\\[a=\\frac{\\Delta y}{\\Delta x}=\\frac{f(x_2)-f(x_1)}{x_2-x_1}\\]</div>' +
        '<p>— the seed of the derivative. Dividing two polynomials gives a <strong>rational function</strong> (e.g. \\(\\frac1x\\)), defined off the zeros of the denominator, with vertical/horizontal <em>asymptotes</em>.</p>' +

        '<h4>Exponential, logarithm, trigonometric</h4>' +
        '<p>The exponential \\(f(x)=e^x\\) (\\(e\\approx 2.72\\)) is positive and strictly increasing, with \\(e^a e^b=e^{a+b}\\). Its inverse is the natural logarithm \\(\\ln x\\) (\\(x>0\\)) with</p>' +
        '<div class="formula-box">\\[\\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac{a}{b}=\\ln a-\\ln b,\\quad \\ln a^n=n\\ln a.\\]</div>' +
        '<p>The periodic \\(\\sin\\theta\\) and \\(\\cos\\theta\\) (from the unit circle) model <strong>seasonal</strong> phenomena — e.g. tourism time series.</p>' +

        '<div class="tip-box">' +
        '<h4>Economic functions</h4>' +
        '<p>Total cost \\(T(Q)\\) (fixed cost \\(=T(0)\\)); revenue \\(P(Q)=pQ\\); profit \\(D(Q)=P(Q)-T(Q)\\). <strong>Break-even</strong> points solve \\(P(Q)=T(Q)\\) (\\(D(Q)=0\\)); between them profit is positive. Average cost \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\).</p>' +
        '</div>'
    }
  },

  // ========================================================================
  // CATEGORY 4: DIFFERENTIATION
  // ========================================================================
  differentiation: {
    name: "Differentiation",
    icon: "fa-superscript",
    color: "#8b5cf6",

    flashcards: [
      {
        question: "What is the derivative of a function at a point \\(x_0\\)?",
        answer: "The derivative is the limit of the difference quotient as \\(x\\) tends to \\(x_0\\):\n\\[f'(x_0)=\\frac{dy}{dx}(x_0)=\\lim_{x\\to x_0}\\frac{f(x)-f(x_0)}{x-x_0}.\\]\nIt measures the INSTANTANEOUS rate of change of \\(f\\) at \\(x_0\\) — generalising the constant rate (slope \\(a\\)) of a linear function to curves.",
        explanation: "We let the difference x − x₀ become arbitrarily small but never zero (possible thanks to the continuity of ℝ)."
      },
      {
        question: "What is the GEOMETRIC meaning of the derivative \\(f'(x_0)\\)?",
        answer: "\\(f'(x_0)\\) is the SLOPE (direction coefficient) of the TANGENT line to the graph of \\(f\\) at the point \\(x_0\\). The tangent is the best linear approximation of the function's growth rate near \\(x_0\\).",
        explanation: "For a line f(x)=ax+b the tangent is the line itself, so f'(x)=a everywhere."
      },
      {
        question: "What are the derivatives of a constant and of a linear function?",
        answer: "• Constant \\(f(x)=c\\): the difference quotient is always 0, so\n\\[(c)'=0.\\]\n• Linear \\(f(x)=ax+b\\): the difference quotient is \\(a\\), so\n\\[(ax+b)'=a,\\qquad\\text{in particular } (x)'=1.\\]",
        explanation: "The derivative of a constant is zero because a constant does not change with x."
      },
      {
        question: "State the POWER rule for differentiation.",
        answer: "For \\(f(x)=x^n\\):\n\\[(x^n)'=n\\,x^{n-1}.\\]\nThe derived function has a power one less than the original. E.g. \\((x^3)'=3x^2\\), \\((x^7)'=7x^6\\).",
        explanation: "This is the single most-used rule; it also covers √x = x^{1/2} and 1/xⁿ = x^{−n}."
      },
      {
        question: "Give the derivatives of the elementary functions \\(\\frac1x\\), \\(\\sqrt x\\), \\(e^x\\), \\(\\ln x\\), \\(\\sin x\\), \\(\\cos x\\).",
        answer: "\\[\\left(\\frac1x\\right)'=-\\frac{1}{x^2},\\qquad (\\sqrt x)'=\\frac{1}{2\\sqrt x},\\]\n\\[(e^x)'=e^x,\\qquad (\\ln x)'=\\frac1x,\\]\n\\[(\\sin x)'=\\cos x,\\qquad (\\cos x)'=-\\sin x.\\]",
        explanation: "eˣ is its own derivative. Note the minus sign for (cos x)' and for (1/x)'."
      },
      {
        question: "State the sum, difference and constant-multiple rules.",
        answer: "\\[(u\\pm v)'=u'\\pm v',\\]\n\\[(C\\,u)'=C\\,u'\\quad(C=\\text{const}),\\]\n\\[(a\\,u+b\\,v)'=a\\,u'+b\\,v'.\\]\nDifferentiation is LINEAR: you differentiate term by term and pull out constants.",
        explanation: "So a polynomial is differentiated term by term using the power rule."
      },
      {
        question: "State the PRODUCT rule and the QUOTIENT rule.",
        answer: "PRODUCT:\n\\[(u\\cdot v)'=u'v+u\\,v'.\\]\nQUOTIENT:\n\\[\\left(\\frac{u}{v}\\right)'=\\frac{u'v-u\\,v'}{v^2}.\\]",
        explanation: "Order matters in the quotient rule's numerator: u′v − uv′ (not uv′ − u′v)."
      },
      {
        question: "State the CHAIN rule for a composite function.",
        answer: "A composite ('function within a function') \\(f(g(x))\\) has outer function \\(f\\) and inner function \\(g\\). Its derivative:\n\\[[f(g(x))]'=f'(g(x))\\cdot g'(x).\\]\nDifferentiate the outer function (leaving the inner unchanged) and MULTIPLY by the derivative of the inner.",
        explanation: "E.g. (ln(3x²+5))' = 1/(3x²+5) · 6x. Used for trig/exp/log of expressions."
      },
      {
        question: "What is a higher-order derivative?",
        answer: "Differentiating repeatedly. The n-th derivative is the derivative of the (n−1)-th:\n\\[f^{(n)}(x)=\\left[f^{(n-1)}(x)\\right]'.\\]\nThe SECOND derivative \\(f''\\) is the derivative of \\(f'\\); the third \\(f'''\\) the derivative of \\(f''\\), etc.",
        explanation: "E.g. f(x)=4x⁵−3x⁴+… → f′, then f″=80x³−36x²+12x−10, then f‴=240x²−72x+12."
      }
    ],

    quiz: [
      {
        question: "Geometrically, \\(f'(x_0)\\) is the:",
        options: ["Area under the curve", "Slope of the tangent at \\(x_0\\)", "y-intercept", "Value \\(f(x_0)\\)"],
        correct: 1
      },
      {
        question: "\\((x^n)' = \\) ?",
        options: ["\\(n x^{n+1}\\)", "\\(n x^{n-1}\\)", "\\(x^{n-1}\\)", "\\((n-1)x^n\\)"],
        correct: 1
      },
      {
        question: "The derivative of a constant \\(c\\) is:",
        options: ["\\(c\\)", "\\(1\\)", "\\(0\\)", "\\(cx\\)"],
        correct: 2
      },
      {
        question: "\\((e^x)' = \\) ?",
        options: ["\\(x e^{x-1}\\)", "\\(e^x\\)", "\\(\\frac1x\\)", "\\(e^{x-1}\\)"],
        correct: 1
      },
      {
        question: "\\((\\ln x)' = \\) ?",
        options: ["\\(\\ln x\\)", "\\(\\frac1x\\)", "\\(-\\frac{1}{x^2}\\)", "\\(x\\)"],
        correct: 1
      },
      {
        question: "The product rule \\((uv)'\\) equals:",
        options: ["\\(u'v'\\)", "\\(u'v+uv'\\)", "\\(u'v-uv'\\)", "\\(\\frac{u'}{v'}\\)"],
        correct: 1
      },
      {
        question: "The quotient rule \\(\\left(\\frac{u}{v}\\right)'\\) equals:",
        options: ["\\(\\frac{u'v-uv'}{v^2}\\)", "\\(\\frac{uv'-u'v}{v^2}\\)", "\\(\\frac{u'}{v'}\\)", "\\(\\frac{u'v+uv'}{v^2}\\)"],
        correct: 0
      },
      {
        question: "The chain rule \\([f(g(x))]'\\) equals:",
        options: ["\\(f'(g(x))\\)", "\\(f'(x)\\cdot g'(x)\\)", "\\(f'(g(x))\\cdot g'(x)\\)", "\\(f(g'(x))\\)"],
        correct: 2
      },
      {
        question: "\\((\\cos x)' = \\) ?",
        options: ["\\(\\sin x\\)", "\\(-\\sin x\\)", "\\(\\cos x\\)", "\\(-\\cos x\\)"],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: "The derivative is the limit of the _______ quotient (f(x)−f(x₀))/(x−x₀).", answer: "difference", hint: "Δy/Δx as x→x₀" },
      { sentence: "Geometrically, f′(x₀) is the slope of the _______ to the graph at x₀.", answer: "tangent", hint: "Best linear approximation" },
      { sentence: "By the power rule, (xⁿ)′ = n·x^( _______ ).", answer: "n-1", hint: "One less than the original power" },
      { sentence: "The derivative of a constant function is _______.", answer: "0", hint: "A constant does not change" },
      { sentence: "The function eˣ is its own _______.", answer: "derivative", hint: "(eˣ)′ = eˣ" },
      { sentence: "Differentiating a composite f(g(x)) uses the _______ rule.", answer: "chain", hint: "f′(g(x))·g′(x)" },
      { sentence: "The derivative of f′ is the _______ derivative, written f″.", answer: "second", hint: "Higher-order derivative" }
    ],

    learn: {
      content:
        '<h3>Differentiation</h3>' +
        '<p>The <strong>derivative</strong> generalises the constant rate of change (slope \\(a\\)) of a linear function to curves. Because ℝ is <em>continuous</em>, we can look at the function on an arbitrarily small interval around a point \\(x_0\\) and ask whether the difference quotient tends to a number:</p>' +
        '<div class="formula-box">\\[f\'(x_0)=\\lim_{x\\to x_0}\\frac{f(x)-f(x_0)}{x-x_0}\\]</div>' +
        '<p>That number is the derivative at \\(x_0\\). <strong>Geometrically</strong> it is the slope of the <span class="highlight">tangent</span> line — the best linear approximation of the function near \\(x_0\\). Deriving a function \\(f\\) produces a new function \\(f\'\\).</p>' +

        '<h4>Table of derivatives</h4>' +
        '<p>The basic building blocks:</p>' +
        '<div class="formula-box">\\[(c)\'=0,\\quad (x)\'=1,\\quad (x^n)\'=n x^{n-1},\\]\\[\\left(\\tfrac1x\\right)\'=-\\tfrac{1}{x^2},\\quad (\\sqrt x)\'=\\tfrac{1}{2\\sqrt x},\\]\\[(e^x)\'=e^x,\\quad (\\ln x)\'=\\tfrac1x,\\quad (\\sin x)\'=\\cos x,\\quad (\\cos x)\'=-\\sin x.\\]</div>' +

        '<h4>Rules of differentiation</h4>' +
        '<ul>' +
        '<li><strong>Linearity</strong>: \\((u\\pm v)\'=u\'\\pm v\'\\), \\((Cu)\'=Cu\'\\) — differentiate term by term.</li>' +
        '<li><strong>Product</strong>: \\((uv)\'=u\'v+uv\'\\).</li>' +
        '<li><strong>Quotient</strong>: \\(\\left(\\frac{u}{v}\\right)\'=\\dfrac{u\'v-uv\'}{v^2}\\).</li>' +
        '<li><strong>Chain</strong> (composite): \\([f(g(x))]\'=f\'(g(x))\\cdot g\'(x)\\).</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>Chain rule in practice</h4>' +
        '<p>Differentiate the <em>outer</em> function (keeping the inner intact), then multiply by the derivative of the <em>inner</em>: \\((\\ln(3x^2+5))\'=\\frac{1}{3x^2+5}\\cdot 6x\\). The chain rule is what lets us differentiate exponential, logarithmic and trigonometric expressions used in economics.</p>' +
        '</div>' +

        '<h4>Higher-order derivatives</h4>' +
        '<p>Differentiating again gives the second derivative \\(f\'\'=\\left(f\'\\right)\'\\), and so on: \\(f^{(n)}=\\left[f^{(n-1)}\\right]\'\\). The second derivative will be the key tool for classifying extrema in the next unit.</p>'
    }
  },

  // ========================================================================
  // CATEGORY 5: INCREASE, DECREASE & EXTREMA
  // ========================================================================
  extrema: {
    name: "Increase, Decrease & Extrema",
    icon: "fa-arrow-trend-up",
    color: "#8b5cf6",

    flashcards: [
      {
        question: "How does the SIGN of the first derivative tell you where a function increases or decreases?",
        answer: "On an interval \\((a,b)\\):\n\\[f'(x)>0\\ \\text{for all }x\\ \\Rightarrow\\ f\\text{ increases},\\]\n\\[f'(x)<0\\ \\text{for all }x\\ \\Rightarrow\\ f\\text{ decreases}.\\]\nRecall \\(f'(x_0)\\) is the slope of the tangent at \\(x_0\\): positive slope rises, negative slope falls.",
        explanation: "This links the 'value' definition of increasing/decreasing to the derivative."
      },
      {
        question: "What is a STATIONARY point?",
        answer: "A stationary point is any \\(x_0\\) where the first derivative is zero:\n\\[f'(x_0)=0.\\]\nGeometrically the tangent is horizontal there. At a stationary point the function may have an extremum (min or max) OR an inflection point.",
        explanation: "Equating f′(x)=0 and solving gives the candidate points for extrema."
      },
      {
        question: "State the FIRST-derivative test for a minimum and a maximum.",
        answer: "\\(x_0\\) is a MINIMUM if \\(f'(x_0)=0\\) and \\(f'\\) changes from negative to positive:\n• \\(f'(x)<0\\) for \\(x<x_0\\) (falls), \\(f'(x)>0\\) for \\(x>x_0\\) (rises).\n\n\\(x_0\\) is a MAXIMUM if \\(f'(x_0)=0\\) and \\(f'\\) changes from positive to negative:\n• \\(f'(x)>0\\) for \\(x<x_0\\) (rises), \\(f'(x)<0\\) for \\(x>x_0\\) (falls).",
        explanation: "The extremum is where the function changes from rising to falling (max) or falling to rising (min)."
      },
      {
        question: "State the SECOND-derivative test for classifying a stationary point.",
        answer: "At a stationary point \\(x_0\\) (where \\(f'(x_0)=0\\)):\n\\[f''(x_0)>0\\ \\Rightarrow\\ x_0\\text{ is a MINIMUM},\\]\n\\[f''(x_0)<0\\ \\Rightarrow\\ x_0\\text{ is a MAXIMUM}.\\]\nIf \\(f''(x_0)=0\\), \\(x_0\\) is (typically) an INFLECTION point.",
        explanation: "f″ measures curvature: positive = curve opens upward (cup → minimum); negative = opens downward (cap → maximum)."
      },
      {
        question: "What is an INFLECTION point, and how is it detected at a stationary point?",
        answer: "An inflection point is where the function changes its CURVATURE. At a stationary point \\(x_0\\), if the first derivative does NOT change sign (or equivalently \\(f''(x_0)=0\\)), then \\(x_0\\) is an inflection point rather than an extremum.",
        explanation: "So f′(x₀)=0 alone is not enough to guarantee an extremum — you must test the sign change or f″."
      },
      {
        question: "List the steps of the FUNCTION-FLOW table (to find increase/decrease and extrema).",
        answer: "1. Determine the domain of the function.\n2. Find the first derivative \\(f'\\).\n3. Find stationary points by solving \\(f'(x)=0\\).\n4. Split the domain into intervals at the stationary points.\n5. Pick a test point in each interval and find the SIGN of \\(f'\\) there.\n6. Read off intervals of increase/decrease and the extrema.",
        explanation: "This systematic table is the standard exam procedure for analysing a function's flow."
      },
      {
        question: "In economics, what is the marginal cost function?",
        answer: "Marginal cost is the DERIVATIVE of the total-cost function:\n\\[M(Q)=T'(Q).\\]\nIt is the (approximate) cost of producing one more unit. Likewise: income \\(P(Q)=pQ\\), profit \\(D(Q)=P(Q)-T(Q)\\), average cost \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\).",
        explanation: "Marginal = derivative of total. Many K1 optimisation problems compare marginal and average cost."
      },
      {
        question: "How do you find the MAXIMUM PROFIT of a firm?",
        answer: "Maximise the profit function \\(D(Q)=P(Q)-T(Q)\\):\n1. Solve \\(D'(Q)=0\\) for the stationary quantity \\(Q_0\\).\n2. Confirm it is a maximum (\\(D''(Q_0)<0\\), or first-derivative sign change).\n3. The maximum profit is \\(D(Q_0)\\).",
        explanation: "If D(Q) is a downward parabola, its maximum lies at the midpoint of the break-even interval (by symmetry)."
      },
      {
        question: "How do you find the MINIMUM AVERAGE COST?",
        answer: "Form the average cost \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\), then minimise it:\n1. Solve \\(\\overline{T}'(Q)=0\\) for the stationary \\(Q_0\\).\n2. Confirm a minimum (\\(\\overline{T}''(Q_0)>0\\)).\n3. The minimum average cost is \\(\\overline{T}(Q_0)\\).",
        explanation: "E.g. T(Q)=5Q³−90Q²+540Q → average 5Q²−90Q+540, minimised at Q=9, value 135."
      }
    ],

    quiz: [
      {
        question: "If \\(f'(x)>0\\) on an interval, the function is:",
        options: ["Decreasing", "Increasing", "Constant", "At a maximum"],
        correct: 1
      },
      {
        question: "A stationary point is a point where:",
        options: ["\\(f(x_0)=0\\)", "\\(f'(x_0)=0\\)", "\\(f''(x_0)=0\\)", "\\(f(x_0)=x_0\\)"],
        correct: 1
      },
      {
        question: "By the second-derivative test, if \\(f'(x_0)=0\\) and \\(f''(x_0)>0\\), then \\(x_0\\) is a:",
        options: ["Maximum", "Minimum", "Inflection point", "Zero"],
        correct: 1
      },
      {
        question: "By the second-derivative test, if \\(f'(x_0)=0\\) and \\(f''(x_0)<0\\), then \\(x_0\\) is a:",
        options: ["Maximum", "Minimum", "Inflection point", "Asymptote"],
        correct: 0
      },
      {
        question: "At a stationary point, if the first derivative does NOT change sign, the point is:",
        options: ["A maximum", "A minimum", "An inflection point", "A break-even point"],
        correct: 2
      },
      {
        question: "Marginal cost is defined as:",
        options: ["\\(\\frac{T(Q)}{Q}\\)", "\\(T'(Q)\\)", "\\(P(Q)-T(Q)\\)", "\\(pQ\\)"],
        correct: 1
      },
      {
        question: "To maximise profit \\(D(Q)\\), you first solve:",
        options: ["\\(D(Q)=0\\)", "\\(D'(Q)=0\\)", "\\(T(Q)=0\\)", "\\(P(Q)=0\\)"],
        correct: 1
      },
      {
        question: "The FIRST step of the function-flow table is to determine the function's:",
        options: ["Second derivative", "Domain", "Asymptotes", "Maximum"],
        correct: 1
      }
    ],

    fillBlanks: [
      { sentence: "If f′(x) > 0 on an interval, the function is _______ there.", answer: "increasing", hint: "Positive slope rises" },
      { sentence: "A point where f′(x₀) = 0 is called a _______ point.", answer: "stationary", hint: "Horizontal tangent" },
      { sentence: "If f′(x₀)=0 and f″(x₀) > 0, then x₀ is a _______.", answer: "minimum", hint: "Curve opens upward" },
      { sentence: "If f′(x₀)=0 and f″(x₀) < 0, then x₀ is a _______.", answer: "maximum", hint: "Curve opens downward" },
      { sentence: "A point where the function changes its curvature is an _______ point.", answer: "inflection", hint: "f″ = 0, no sign change in f′" },
      { sentence: "Marginal cost is the _______ of the total-cost function, M(Q) = T′(Q).", answer: "derivative", hint: "Cost of one more unit" },
      { sentence: "To maximise profit you solve D′(Q) = _______.", answer: "0", hint: "Stationary point of profit" }
    ],

    learn: {
      content:
        '<h3>Increase, decrease &amp; extrema</h3>' +
        '<p>The derivative turns the qualitative idea of "rising" and "falling" into a computation. Since \\(f\'(x_0)\\) is the slope of the tangent, its <span class="highlight">sign</span> tells us the direction of the function:</p>' +
        '<div class="formula-box">\\[f\'(x)>0\\Rightarrow f\\text{ increases},\\qquad f\'(x)<0\\Rightarrow f\\text{ decreases}.\\]</div>' +

        '<h4>Stationary points and the tests</h4>' +
        '<p>A <strong>stationary point</strong> solves \\(f\'(x_0)=0\\) (horizontal tangent). There the function may have a minimum, a maximum, or an inflection point. Two tests classify it:</p>' +
        '<ul>' +
        '<li><strong>First-derivative test</strong>: sign change \\(-\\to+\\) is a minimum; \\(+\\to-\\) is a maximum; no change is an inflection point.</li>' +
        '<li><strong>Second-derivative test</strong>: \\(f\'\'(x_0)>0\\Rightarrow\\) minimum; \\(f\'\'(x_0)<0\\Rightarrow\\) maximum; \\(f\'\'(x_0)=0\\Rightarrow\\) (typically) inflection.</li>' +
        '</ul>' +

        '<div class="tip-box">' +
        '<h4>Function-flow table (exam procedure)</h4>' +
        '<p>(1) domain → (2) compute \\(f\'\\) → (3) stationary points \\(f\'(x)=0\\) → (4) split the domain into intervals → (5) test the sign of \\(f\'\\) in each → (6) read off increase/decrease and extrema.</p>' +
        '</div>' +

        '<h4>Optimisation in economics</h4>' +
        '<p>Derivatives find the best operating point of a firm. <strong>Marginal cost</strong> is \\(M(Q)=T\'(Q)\\). To maximise <strong>profit</strong> \\(D(Q)=P(Q)-T(Q)\\) solve \\(D\'(Q)=0\\) and check \\(D\'\'<0\\); to minimise <strong>average cost</strong> \\(\\overline{T(Q)}=\\frac{T(Q)}{Q}\\) solve \\(\\overline{T}\'(Q)=0\\) and check \\(\\overline{T}\'\'>0\\). These are the quantitative pay-off of the whole unit: the calculus of optimal decisions.</p>'
    }
  }

};

// Expose on window (catalog looks it up by name); also CommonJS for node tests.
if (typeof window !== "undefined") { window.mathM1 = mathM1; }
if (typeof module !== "undefined" && module.exports) { module.exports = mathM1; }
