// ===== MATHEMATICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NOT the engine): all domain data for the interactive, auto-graded math
// exercises. The generic engine (js/exercises-core.js, js/exercises.js, css/exercises.css)
// contains NOTHING from here — see docs/EXERCISES_ENGINE.md §2 (types) + §3 (conventions)
// and docs/MATH_PLAN.md.
//
// Types used: numeric / choice (NOT journal/classify/statement). Randomization via
// params + generate(p). Shared math (quadratic solver, gcd, poly eval/deriv) lives in
// data/math/math-lib.js (window.MathLib), loaded BEFORE this file. Elementary arithmetic
// stays inline in generate().
//
// TOLERANCE policy (math): integers tol 0 (well, 0.01 to absorb float); decimals 0.01–0.05.
// Every randomized generate() is brute-force verified in node (independent recompute) — see
// the build session log. K1 only (topics 1–5); the Final lesson's Exercises tab stays empty
// (everything tagged to the midterms — consistent with the other subjects).
//
// ⚠ CACHE: when editing, bump CONTENT_VERSION in js/content-loader.js (data/* is immutable).

// MathLib access from generate(): in the browser it is window.MathLib (loaded earlier via
// content.scripts); in node (tests) require it relatively.
var ML = (typeof window !== 'undefined' && window.MathLib) ? window.MathLib
  : (typeof require !== 'undefined' ? require('./math-lib.js') : null);

const mathExercises = {
  meta: { lang: 'en', currency: '', version: 1 },
  exercises: [

    // ========================================================================
    // CHAPTER 1 — FIELD OF REAL NUMBERS ℝ
    // ========================================================================
    {
      id: 'r1-concepts',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Real Numbers — Concepts',
      prompt: 'Decide whether each statement is true or false, then answer the multiple-choice items.',
      difficulty: 1,
      items: [
        { q: 'Every natural number is also an integer (ℕ ⊂ ℤ).', kind: 'tf', answer: true },
        { q: 'The number 0 belongs to the set of natural numbers ℕ.', kind: 'tf', answer: false },
        { q: 'Every rational number can be written as a fraction m/n with n ≠ 0.', kind: 'tf', answer: true },
        { q: 'π is a rational number.', kind: 'tf', answer: false },
        { q: 'The set of real numbers is ℝ = ℚ ∪ 𝕀.', kind: 'tf', answer: true },
        { q: 'In ℤ every non-zero number has a multiplicative inverse that is also an integer.', kind: 'tf', answer: false },
        { q: 'Which set is introduced so that subtraction is ALWAYS possible?', kind: 'mc', options: ['ℕ', 'ℤ', 'ℚ', '𝕀'], answer: 1 },
        { q: 'A number with an infinite, NON-periodic decimal expansion is:', kind: 'mc', options: ['Rational', 'Irrational', 'Natural', 'Integer'], answer: 1 }
      ],
      solution: [
        '0 ∉ ℕ (we add it to get ℕ₀); ℤ supplies the additive inverse so subtraction always works.',
        'ℤ has no multiplicative inverse (2 : 4 = ½ ∉ ℤ) — that is why ℚ is introduced.',
        'Rational = finite or periodic decimal; irrational = infinite non-periodic (π, √2).'
      ]
    },
    {
      id: 'r1-classify',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Rational or Irrational?',
      prompt: 'Classify each number as rational or irrational.',
      difficulty: 1,
      items: [
        { q: '\\(\\sqrt{9}\\) is rational (it equals 3).', kind: 'tf', answer: true },
        { q: '\\(\\sqrt{2}\\) is rational.', kind: 'tf', answer: false },
        { q: '\\(0.\\overline{3}=0.333\\dots\\) is rational.', kind: 'tf', answer: true },
        { q: '\\(\\frac{15}{7}\\) is rational.', kind: 'tf', answer: true },
        { q: 'Which of these is IRRATIONAL?', kind: 'mc', options: ['\\(\\frac34\\)', '\\(-5\\)', '\\(\\sqrt{13}\\)', '\\(2.5\\)'], answer: 2 },
        { q: 'Which of these is RATIONAL?', kind: 'mc', options: ['\\(\\pi\\)', '\\(\\sqrt{2}\\)', '\\(0.75\\)', '\\(\\sqrt{5}\\)'], answer: 2 }
      ],
      solution: [
        '√9 = 3 and √(perfect square) is rational; √2, √13, √5 are irrational.',
        'A finite or periodic decimal (0.75, 0.333…) and any fraction are rational.'
      ]
    },

    // ========================================================================
    // CHAPTER 2 — BASIC EQUATIONS ON ℝ
    // ========================================================================
    {
      id: 'eq-linear-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Linear Equation — Drill',
      prompt: 'Solve the linear equation for x.',
      difficulty: 1,
      params: {
        a: { choices: [2, 3, 4, 5, 6] },
        x: { min: -6, max: 8, step: 1 },
        b: { min: -9, max: 9, step: 1 }
      },
      generate(p) {
        const c = p.a * p.x + p.b;
        const bsign = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        return {
          prompt: 'Solve for x:  \\(' + p.a + 'x ' + bsign + ' = ' + c + '\\).',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'x = (c − b) ÷ a = (' + c + ' − (' + p.b + ')) ÷ ' + p.a }
          ],
          solution: [
            'Move b: ' + p.a + 'x = ' + c + ' − (' + p.b + ') = ' + (c - p.b) + '.',
            'Divide by a: x = ' + (c - p.b) + ' ÷ ' + p.a + ' = ' + p.x + '.'
          ]
        };
      },
      solution: ['Press “New numbers” for a fresh equation. For ax + b = c, x = (c − b) ÷ a.']
    },
    {
      id: 'eq-linear2-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Linear Equation (unknown both sides) — Drill',
      prompt: 'Solve the linear equation with the unknown on both sides.',
      difficulty: 2,
      params: {
        a: { choices: [3, 4, 5, 6] },
        d: { choices: [1, 2] },
        x: { min: -5, max: 6, step: 1 },
        b: { min: -8, max: 8, step: 1 }
      },
      generate(p) {
        const e = (p.a - p.d) * p.x + p.b;
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        const es = e >= 0 ? '+ ' + e : '− ' + Math.abs(e);
        return {
          prompt: 'Solve for x:  \\(' + p.a + 'x ' + bs + ' = ' + p.d + 'x ' + es + '\\).',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'Collect x on one side: (' + p.a + ' − ' + p.d + ')x = ' + e + ' − (' + p.b + ')' }
          ],
          solution: [
            'Subtract ' + p.d + 'x and ' + p.b + ': (' + p.a + ' − ' + p.d + ')x = ' + e + ' − (' + p.b + ') = ' + (e - p.b) + '.',
            'x = ' + (e - p.b) + ' ÷ ' + (p.a - p.d) + ' = ' + p.x + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Collect the unknown on one side: (a − d)x = e − b, then divide.']
    },
    {
      id: 'eq-quadratic-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Quadratic Equation — Discriminant & Roots',
      prompt: 'For the monic quadratic, compute the discriminant and the two solutions.',
      difficulty: 2,
      params: {
        r1: { min: -5, max: 0, step: 1 },
        r2: { min: 1, max: 6, step: 1 }
      },
      generate(p) {
        const b = -(p.r1 + p.r2), c = p.r1 * p.r2;
        const D = b * b - 4 * c;
        const bs = b >= 0 ? '+ ' + b : '− ' + Math.abs(b);
        const cs = c >= 0 ? '+ ' + c : '− ' + Math.abs(c);
        return {
          prompt: 'Given \\(x^2 ' + bs + 'x ' + cs + ' = 0\\), compute the discriminant \\(D=b^2-4ac\\) and the two '
            + 'solutions (smaller first).',
          fields: [
            { key: 'D', label: 'Discriminant D', answer: D, tol: 0.01, unit: '', hint: 'D = b² − 4ac = (' + b + ')² − 4·1·(' + c + ')' },
            { key: 'x1', label: 'x₁ (smaller)', answer: p.r1, tol: 0.01, unit: '', hint: '(−b − √D) ÷ 2' },
            { key: 'x2', label: 'x₂ (larger)', answer: p.r2, tol: 0.01, unit: '', hint: '(−b + √D) ÷ 2' }
          ],
          solution: [
            'a = 1, b = ' + b + ', c = ' + c + '.  D = ' + b + '² − 4·' + c + ' = ' + D + '.',
            'x = (−b ± √D) ÷ 2a = (' + (-b) + ' ± ' + Math.sqrt(D) + ') ÷ 2 → x₁ = ' + p.r1 + ', x₂ = ' + p.r2 + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. D = b² − 4ac; x = (−b ± √D) ÷ 2a (here a = 1).']
    },
    {
      id: 'eq-incomplete-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Incomplete Quadratic ax² + bx = 0',
      prompt: 'Solve the incomplete quadratic (one root is always 0).',
      difficulty: 1,
      params: {
        a: { choices: [1, 2, 3] },
        k: { choices: [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6] }
      },
      generate(p) {
        const b = -p.a * p.k;        // a x² + b x = 0 → x(ax + b)=0 → x2 = -b/a = k
        const bs = b >= 0 ? '+ ' + b : '− ' + Math.abs(b);
        return {
          prompt: 'Solve \\(' + p.a + 'x^2 ' + bs + 'x = 0\\). Give the NON-zero solution.',
          fields: [
            { key: 'x2', label: 'Non-zero solution x₂', answer: p.k, tol: 0.01, unit: '', hint: 'Factor x(ax + b) = 0 → x₂ = −b ÷ a' }
          ],
          solution: [
            'Factor: x(' + p.a + 'x ' + bs + ') = 0 → x₁ = 0 or ' + p.a + 'x ' + bs + ' = 0.',
            'x₂ = −(' + b + ') ÷ ' + p.a + ' = ' + p.k + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Factor out x: x₁ = 0, x₂ = −b ÷ a.']
    },
    {
      id: 'eq-disc-sign',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'choice',
      title: 'Discriminant → Number of Real Solutions',
      prompt: 'Use the sign of the discriminant D = b² − 4ac to state how many REAL solutions the quadratic has.',
      difficulty: 1,
      items: [
        { q: 'If D > 0 the quadratic has two distinct real solutions.', kind: 'tf', answer: true },
        { q: 'If D = 0 the quadratic has one (repeated) real solution.', kind: 'tf', answer: true },
        { q: 'If D < 0 the quadratic has two real solutions.', kind: 'tf', answer: false },
        { q: 'For \\(x^2+8x+25=0\\), D = 64 − 100 = −36, so it has:', kind: 'mc', options: ['Two real solutions', 'One real solution', 'No real solution', 'Infinitely many'], answer: 2 },
        { q: 'For \\(x^2-6x+9=0\\), D = 36 − 36 = 0, so it has:', kind: 'mc', options: ['Two real solutions', 'One repeated real solution', 'No real solution', 'Three solutions'], answer: 1 }
      ],
      solution: [
        'D > 0 → two real; D = 0 → one repeated; D < 0 → none real (complex).',
        'x² + 8x + 25: D = −36 < 0 → no real solution. x² − 6x + 9 = (x−3)²: D = 0 → x = 3 (repeated).'
      ]
    },
    {
      id: 'eq-biquadratic-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Biquadratic Equation (t = x²)',
      prompt: 'Solve the biquadratic with the substitution t = x².',
      difficulty: 3,
      params: {
        r1: { choices: [1, 2, 3] },
        gap: { choices: [1, 2, 3] }
      },
      generate(p) {
        const r2 = p.r1 + p.gap;            // two positive roots r1 < r2
        const b = -(p.r1 * p.r1 + r2 * r2); // coefficient of x²
        const c = (p.r1 * p.r1) * (r2 * r2);// constant
        const bs = b >= 0 ? '+ ' + b : '− ' + Math.abs(b);
        const cs = c >= 0 ? '+ ' + c : '− ' + Math.abs(c);
        return {
          prompt: 'Solve \\(x^4 ' + bs + 'x^2 ' + cs + ' = 0\\) (substitute \\(t=x^2\\)). Give the number of REAL '
            + 'solutions and the LARGEST root.',
          fields: [
            { key: 'n', label: 'Number of real solutions', answer: 4, tol: 0.01, unit: '', hint: 'Each positive t gives ±√t' },
            { key: 'max', label: 'Largest root', answer: r2, tol: 0.01, unit: '', hint: '√(larger t)' }
          ],
          solution: [
            'Let t = x²: t² ' + bs + 't ' + cs + ' = 0 → t₁ = ' + (p.r1 * p.r1) + ', t₂ = ' + (r2 * r2) + '.',
            'x² = ' + (p.r1 * p.r1) + ' → x = ±' + p.r1 + ';  x² = ' + (r2 * r2) + ' → x = ±' + r2 + '.',
            'So 4 real solutions ±' + p.r1 + ', ±' + r2 + '; the largest is ' + r2 + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Substitute t = x², solve the quadratic in t, then x = ±√t for each positive t.']
    },
    {
      id: 'eq-word-discount-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Modeling — Discount Problem',
      prompt: 'A linear-equation word problem: recover the original price.',
      difficulty: 2,
      params: {
        original: { min: 200, max: 900, step: 50 },
        d: { choices: [10, 20, 25, 40, 60, 65] }
      },
      generate(p) {
        const value = p.original * (1 - p.d / 100);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'An item was reduced by ' + p.d + '% and now costs ' + r2(value) + ' monetary units. What was '
            + 'the price BEFORE the discount?',
          fields: [
            { key: 'orig', label: 'Original price', answer: p.original, tol: 0.05, unit: '', hint: 'value = original·(1 − d/100) → original = value ÷ (1 − d/100)' }
          ],
          solution: [
            'After a ' + p.d + '% cut, the price is (1 − ' + p.d + '/100) = ' + (1 - p.d / 100) + ' of the original.',
            'original = ' + r2(value) + ' ÷ ' + (1 - p.d / 100) + ' = ' + p.original + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. A d% discount leaves (1 − d/100) of the price: original = value ÷ (1 − d/100).']
    },

    // ========================================================================
    // CHAPTER 3 — FUNCTIONS
    // ========================================================================
    {
      id: 'fn-domain-choice',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'choice',
      title: 'Natural Domain',
      prompt: 'Determine the natural domain of each function (the restriction on x).',
      difficulty: 2,
      items: [
        { q: 'For \\(f(x)=\\frac{1}{x-3}\\) the domain excludes x = 3.', kind: 'tf', answer: true },
        { q: 'For \\(f(x)=\\sqrt{x-2}\\) we need x ≥ 2.', kind: 'tf', answer: true },
        { q: 'For \\(f(x)=\\ln(x+1)\\) we need x + 1 ≥ 0 (i.e. x ≥ −1).', kind: 'tf', answer: false },
        { q: 'A polynomial such as \\(f(x)=5x^3-9\\) is defined on all of ℝ.', kind: 'tf', answer: true },
        { q: 'The natural domain of \\(f(x)=\\frac{x^2-4}{x+2}\\) is:', kind: 'mc', options: ['ℝ', 'ℝ \\ {2}', 'ℝ \\ {−2}', 'x ≥ 0'], answer: 2 },
        { q: 'For \\(f(x)=\\ln(x-1)\\) the domain is:', kind: 'mc', options: ['x ≥ 1', 'x > 1', 'x ≠ 1', 'all of ℝ'], answer: 1 }
      ],
      solution: [
        'Denominator ≠ 0; even root ≥ 0; logarithm > 0 (STRICTLY positive, not ≥ 0).',
        'For (x²−4)/(x+2) the denominator is 0 at x = −2 → domain ℝ \\ {−2}. ln(x−1) needs x − 1 > 0 → x > 1.'
      ]
    },
    {
      id: 'fn-eval-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Evaluate a Function',
      prompt: 'Evaluate the quadratic function at the given point.',
      difficulty: 1,
      params: {
        a: { min: 1, max: 4, step: 1 },
        b: { min: -5, max: 5, step: 1 },
        c: { min: -6, max: 6, step: 1 },
        x0: { min: -3, max: 4, step: 1 }
      },
      generate(p) {
        const val = p.a * p.x0 * p.x0 + p.b * p.x0 + p.c;
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        const cs = p.c >= 0 ? '+ ' + p.c : '− ' + Math.abs(p.c);
        return {
          prompt: 'For \\(f(x)=' + p.a + 'x^2 ' + bs + 'x ' + cs + '\\), compute \\(f(' + p.x0 + ')\\).',
          fields: [
            { key: 'f', label: 'f(' + p.x0 + ')', answer: val, tol: 0.01, unit: '', hint: 'Substitute x = ' + p.x0 }
          ],
          solution: [
            'f(' + p.x0 + ') = ' + p.a + '·(' + p.x0 + ')² ' + bs + '·(' + p.x0 + ') ' + cs + ' = ' + val + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Substitute the value of x and evaluate.']
    },
    {
      id: 'fn-slope-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Slope (Difference Quotient)',
      prompt: 'Compute the slope of the line through two points.',
      difficulty: 1,
      params: {
        a: { min: -4, max: 5, step: 1 },
        b: { min: -6, max: 6, step: 1 },
        x1: { min: -5, max: 0, step: 1 },
        x2: { min: 1, max: 6, step: 1 }
      },
      generate(p) {
        const y1 = p.a * p.x1 + p.b, y2 = p.a * p.x2 + p.b;
        return {
          prompt: 'A line passes through \\((' + p.x1 + ',' + y1 + ')\\) and \\((' + p.x2 + ',' + y2 + ')\\). '
            + 'Compute its slope \\(a=\\frac{y_2-y_1}{x_2-x_1}\\).',
          fields: [
            { key: 'a', label: 'Slope a', answer: p.a, tol: 0.01, unit: '', hint: '(' + y2 + ' − ' + y1 + ') ÷ (' + p.x2 + ' − ' + p.x1 + ')' }
          ],
          solution: [
            'a = (y₂ − y₁) ÷ (x₂ − x₁) = (' + y2 + ' − (' + y1 + ')) ÷ (' + p.x2 + ' − (' + p.x1 + ')) = ' + (y2 - y1) + ' ÷ ' + (p.x2 - p.x1) + ' = ' + p.a + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Slope = (y₂ − y₁) ÷ (x₂ − x₁), the difference quotient.']
    },
    {
      id: 'fn-breakeven-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Break-even & Fixed Cost',
      prompt: 'For a linear cost and revenue model, find the fixed cost and the break-even quantity.',
      difficulty: 2,
      params: {
        a: { choices: [2, 3, 4] },        // variable cost per unit
        margin: { choices: [2, 3, 4] },   // p − a  (so price p = a + margin > a)
        Qstar: { min: 4, max: 40, step: 4 }
      },
      generate(p) {
        const price = p.a + p.margin;
        const f = p.margin * p.Qstar;     // break-even: pQ = aQ + f → Q* = f/(p−a) = f/margin
        return {
          prompt: 'Total cost \\(T(Q)=' + p.a + 'Q + ' + f + '\\) and revenue \\(P(Q)=' + price + 'Q\\). '
            + 'Find (a) the fixed cost T(0) and (b) the break-even quantity Q* where P(Q)=T(Q).',
          fields: [
            { key: 'fixed', label: 'Fixed cost T(0)', answer: f, tol: 0.01, unit: '', hint: 'The constant term of T(Q)' },
            { key: 'Q', label: 'Break-even Q*', answer: p.Qstar, tol: 0.01, unit: '', hint: 'Q* = f ÷ (p − a) = ' + f + ' ÷ ' + p.margin }
          ],
          solution: [
            'Fixed cost = T(0) = ' + f + '.',
            'Break-even: ' + price + 'Q = ' + p.a + 'Q + ' + f + ' → ' + p.margin + 'Q = ' + f + ' → Q* = ' + p.Qstar + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Fixed cost = T(0); break-even Q* = fixed ÷ (price − variable cost).']
    },
    {
      id: 'fn-avgcost-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Average Cost',
      prompt: 'Compute the average cost at the given quantity.',
      difficulty: 2,
      params: {
        a: { choices: [2, 3] },
        b: { min: 4, max: 20, step: 2 },
        c: { choices: [60, 120, 180, 240] },
        Q0: { min: 2, max: 12, step: 1 }
      },
      generate(p) {
        const total = p.a * p.Q0 * p.Q0 + p.b * p.Q0 + p.c;
        const avg = total / p.Q0;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'Total cost \\(T(Q)=' + p.a + 'Q^2 + ' + p.b + 'Q + ' + p.c + '\\). Compute the average cost '
            + '\\(\\overline{T}(Q)=\\frac{T(Q)}{Q}\\) at Q = ' + p.Q0 + '. Round to 2 dp.',
          fields: [
            { key: 'avg', label: 'Average cost at Q = ' + p.Q0, answer: avg, tol: 0.05, unit: '', hint: 'T(' + p.Q0 + ') ÷ ' + p.Q0 }
          ],
          solution: [
            'T(' + p.Q0 + ') = ' + p.a + '·' + p.Q0 + '² + ' + p.b + '·' + p.Q0 + ' + ' + p.c + ' = ' + total + '.',
            'Average = ' + total + ' ÷ ' + p.Q0 + ' = ' + r2(avg) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Average cost = T(Q) ÷ Q.']
    },

    // ========================================================================
    // CHAPTER 4 — DIFFERENTIATION
    // ========================================================================
    {
      id: 'df-table-choice',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'Derivative Table',
      prompt: 'Recall the derivatives of the elementary functions.',
      difficulty: 1,
      items: [
        { q: '\\((e^x)\' = e^x\\).', kind: 'tf', answer: true },
        { q: '\\((\\ln x)\' = \\dfrac{1}{x}\\).', kind: 'tf', answer: true },
        { q: '\\((\\cos x)\' = \\sin x\\).', kind: 'tf', answer: false },
        { q: '\\((c)\' = 0\\) for a constant c.', kind: 'tf', answer: true },
        { q: '\\((x^n)\' = \\) ?', kind: 'mc', options: ['\\(n x^{n+1}\\)', '\\(n x^{n-1}\\)', '\\(x^{n-1}\\)', '\\((n-1)x^n\\)'], answer: 1 },
        { q: '\\((\\sqrt{x})\' = \\) ?', kind: 'mc', options: ['\\(\\frac{1}{2\\sqrt{x}}\\)', '\\(\\frac{1}{\\sqrt{x}}\\)', '\\(2\\sqrt{x}\\)', '\\(-\\frac{1}{2\\sqrt{x}}\\)'], answer: 0 },
        { q: '\\(\\left(\\frac{1}{x}\\right)\' = \\) ?', kind: 'mc', options: ['\\(\\frac{1}{x^2}\\)', '\\(-\\frac{1}{x^2}\\)', '\\(\\ln x\\)', '\\(-\\frac{1}{x}\\)'], answer: 1 }
      ],
      solution: [
        '(cos x)′ = −sin x (note the minus); (sin x)′ = +cos x.',
        'Power rule (xⁿ)′ = n·xⁿ⁻¹; (√x)′ = 1/(2√x); (1/x)′ = −1/x².'
      ]
    },
    {
      id: 'df-power-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Power Rule — Evaluate',
      prompt: 'Differentiate a power function and evaluate the derivative at a point.',
      difficulty: 1,
      params: {
        n: { min: 2, max: 6, step: 1 },
        x0: { min: 1, max: 5, step: 1 }
      },
      generate(p) {
        const deriv = p.n * Math.pow(p.x0, p.n - 1);
        return {
          prompt: 'For \\(f(x)=x^{' + p.n + '}\\), use \\((x^n)\'=nx^{n-1}\\) to compute \\(f\'(' + p.x0 + ')\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: deriv, tol: 0.01, unit: '', hint: 'f′(x) = ' + p.n + 'x^' + (p.n - 1) + ', then x = ' + p.x0 }
          ],
          solution: [
            "f'(x) = " + p.n + 'x^' + (p.n - 1) + '.',
            "f'(" + p.x0 + ') = ' + p.n + '·' + p.x0 + '^' + (p.n - 1) + ' = ' + deriv + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. f′(x) = n·xⁿ⁻¹; substitute the point.']
    },
    {
      id: 'df-poly-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Polynomial Derivative — Evaluate',
      prompt: 'Differentiate a cubic polynomial term by term and evaluate.',
      difficulty: 2,
      params: {
        a: { min: 1, max: 4, step: 1 },
        b: { min: -4, max: 4, step: 1 },
        c: { min: -5, max: 5, step: 1 },
        d: { min: -6, max: 6, step: 1 },
        x0: { min: -3, max: 4, step: 1 }
      },
      generate(p) {
        // f = a x^3 + b x^2 + c x + d ; f' = 3a x^2 + 2b x + c
        const dv = 3 * p.a * p.x0 * p.x0 + 2 * p.b * p.x0 + p.c;
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        const cs = p.c >= 0 ? '+ ' + p.c : '− ' + Math.abs(p.c);
        const ds = p.d >= 0 ? '+ ' + p.d : '− ' + Math.abs(p.d);
        return {
          prompt: 'For \\(f(x)=' + p.a + 'x^3 ' + bs + 'x^2 ' + cs + 'x ' + ds + '\\), compute \\(f\'(' + p.x0 + ')\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: dv, tol: 0.01, unit: '', hint: "f′(x) = " + (3 * p.a) + 'x² + ' + (2 * p.b) + 'x + ' + p.c }
          ],
          solution: [
            "f'(x) = " + (3 * p.a) + 'x² + ' + (2 * p.b) + 'x + ' + p.c + '.',
            "f'(" + p.x0 + ') = ' + (3 * p.a) + '·(' + p.x0 + ')² + ' + (2 * p.b) + '·(' + p.x0 + ') + ' + p.c + ' = ' + dv + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Differentiate term by term (power rule), then substitute x.']
    },
    {
      id: 'df-product-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Product Rule — Evaluate',
      prompt: 'Use the product rule on two linear factors and evaluate.',
      difficulty: 2,
      params: {
        m: { choices: [1, 2, 3] },
        p2: { min: -4, max: 4, step: 1 },
        n: { choices: [1, 2, 3] },
        q: { min: -4, max: 4, step: 1 },
        x0: { min: -3, max: 4, step: 1 }
      },
      generate(p) {
        // f = (m x + p2)(n x + q); f' = m(n x+q) + n(m x+p2) = 2mn x + (mq + n p2)
        const dv = 2 * p.m * p.n * p.x0 + (p.m * p.q + p.n * p.p2);
        const ps = p.p2 >= 0 ? '+ ' + p.p2 : '− ' + Math.abs(p.p2);
        const qs = p.q >= 0 ? '+ ' + p.q : '− ' + Math.abs(p.q);
        return {
          prompt: 'For \\(f(x)=(' + p.m + 'x ' + ps + ')(' + p.n + 'x ' + qs + ')\\), use the product rule '
            + '\\((uv)\'=u\'v+uv\'\\) to compute \\(f\'(' + p.x0 + ')\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: dv, tol: 0.01, unit: '', hint: "u'=" + p.m + ", v'=" + p.n + "; f′ = " + p.m + '(' + p.n + 'x ' + qs + ') + ' + p.n + '(' + p.m + 'x ' + ps + ')' }
          ],
          solution: [
            "u = " + p.m + 'x ' + ps + ', v = ' + p.n + 'x ' + qs + '; u′ = ' + p.m + ', v′ = ' + p.n + '.',
            "f'(x) = " + p.m + '(' + p.n + 'x ' + qs + ') + ' + p.n + '(' + p.m + 'x ' + ps + ') = ' + (2 * p.m * p.n) + 'x + ' + (p.m * p.q + p.n * p.p2) + '.',
            "f'(" + p.x0 + ') = ' + dv + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. (uv)′ = u′v + uv′ with u, v the two linear factors.']
    },
    {
      id: 'df-quotient-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Quotient Rule — Evaluate',
      prompt: 'Use the quotient rule and evaluate at a point. Round to 3 dp.',
      difficulty: 3,
      params: {
        a: { choices: [1, 2, 3] },
        b: { min: -4, max: 4, step: 1 },
        c: { choices: [1, 2] },
        d: { min: 1, max: 5, step: 1 },
        x0: { min: 0, max: 4, step: 1 }
      },
      generate(p) {
        // f = (a x + b)/(c x + d); f' = (a(cx+d) - c(ax+b))/(cx+d)^2 = (ad - bc)/(cx+d)^2
        const denom = p.c * p.x0 + p.d;            // > 0 since c,d ≥ 1 and x0 ≥ 0
        const dv = (p.a * p.d - p.b * p.c) / (denom * denom);
        const r3 = (x) => Math.round(x * 1000) / 1000;
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        return {
          prompt: 'For \\(f(x)=\\dfrac{' + p.a + 'x ' + bs + '}{' + p.c + 'x + ' + p.d + '}\\), compute \\(f\'(' + p.x0 + ')\\). '
            + 'Round to 3 dp.',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: dv, tol: 0.01, unit: '', hint: 'f′ = (ad − bc) ÷ (cx + d)² = (' + (p.a * p.d - p.b * p.c) + ') ÷ ' + denom + '²' }
          ],
          solution: [
            "Quotient rule: f'(x) = (u'v − uv') ÷ v² = (ad − bc) ÷ (cx+d)² = " + (p.a * p.d - p.b * p.c) + ' ÷ (' + p.c + 'x + ' + p.d + ')².',
            "f'(" + p.x0 + ') = ' + (p.a * p.d - p.b * p.c) + ' ÷ ' + (denom * denom) + ' = ' + r3(dv) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. For (ax+b)/(cx+d), f′ = (ad − bc) ÷ (cx + d)².']
    },
    {
      id: 'df-chain-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Chain Rule — Evaluate',
      prompt: 'Use the chain rule on a power of a linear inner function and evaluate.',
      difficulty: 2,
      params: {
        a: { choices: [1, 2] },
        b: { min: -3, max: 3, step: 1 },
        n: { choices: [2, 3] },
        x0: { min: 0, max: 3, step: 1 }
      },
      generate(p) {
        // f = (a x + b)^n; f' = n a (a x + b)^(n-1)
        const base = p.a * p.x0 + p.b;
        const dv = p.n * p.a * Math.pow(base, p.n - 1);
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        return {
          prompt: 'For \\(f(x)=(' + p.a + 'x ' + bs + ')^{' + p.n + '}\\), use the chain rule to compute \\(f\'(' + p.x0 + ')\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ")", answer: dv, tol: 0.01, unit: '', hint: "f′(x) = " + p.n + '·' + p.a + '·(' + p.a + 'x ' + bs + ')^' + (p.n - 1) }
          ],
          solution: [
            "Outer (·)^" + p.n + " → " + p.n + "(·)^" + (p.n - 1) + "; inner derivative = " + p.a + ".",
            "f'(x) = " + (p.n * p.a) + '·(' + p.a + 'x ' + bs + ')^' + (p.n - 1) + '.',
            "f'(" + p.x0 + ') = ' + (p.n * p.a) + '·(' + base + ')^' + (p.n - 1) + ' = ' + dv + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. [f(g)]′ = f′(g)·g′: differentiate the power, keep the inner, times inner′.']
    },
    {
      id: 'df-higher-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Second Derivative — Evaluate',
      prompt: 'Compute the second derivative of a quartic and evaluate it.',
      difficulty: 2,
      params: {
        a: { min: 1, max: 3, step: 1 },
        b: { min: -3, max: 3, step: 1 },
        c: { min: -4, max: 4, step: 1 },
        x0: { min: -2, max: 3, step: 1 }
      },
      generate(p) {
        // f = a x^4 + b x^3 + c x^2 (+ lower) ; f'' = 12a x^2 + 6b x + 2c
        const dv = 12 * p.a * p.x0 * p.x0 + 6 * p.b * p.x0 + 2 * p.c;
        const bs = p.b >= 0 ? '+ ' + p.b : '− ' + Math.abs(p.b);
        const cs = p.c >= 0 ? '+ ' + p.c : '− ' + Math.abs(p.c);
        return {
          prompt: 'For \\(f(x)=' + p.a + 'x^4 ' + bs + 'x^3 ' + cs + 'x^2\\), compute the second derivative '
            + '\\(f\'\'(' + p.x0 + ')\\).',
          fields: [
            { key: 'd', label: "f''(" + p.x0 + ')', answer: dv, tol: 0.01, unit: '', hint: "f′ = " + (4 * p.a) + 'x³ + ' + (3 * p.b) + 'x² + ' + (2 * p.c) + 'x; f″ = ' + (12 * p.a) + 'x² + ' + (6 * p.b) + 'x + ' + (2 * p.c) }
          ],
          solution: [
            "f'(x) = " + (4 * p.a) + 'x³ + ' + (3 * p.b) + 'x² + ' + (2 * p.c) + 'x.',
            "f''(x) = " + (12 * p.a) + 'x² + ' + (6 * p.b) + 'x + ' + (2 * p.c) + '.',
            "f''(" + p.x0 + ') = ' + dv + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Differentiate twice: f″ = (f′)′; then substitute x.']
    },

    // ========================================================================
    // CHAPTER 5 — INCREASE, DECREASE & EXTREMA
    // ========================================================================
    {
      id: 'ex-stationary-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Stationary Point of a Quadratic',
      prompt: 'Find the stationary point of the quadratic (where f′(x) = 0).',
      difficulty: 2,
      params: {
        a: { choices: [1, 2] },
        root: { min: -5, max: 5, step: 1 },
        c: { min: -6, max: 6, step: 1 }
      },
      generate(p) {
        const b = -2 * p.a * p.root;       // f = a x² + b x + c, f' = 2a x + b = 0 → x = -b/(2a) = root
        const bs = b >= 0 ? '+ ' + b : '− ' + Math.abs(b);
        const cs = p.c >= 0 ? '+ ' + p.c : '− ' + Math.abs(p.c);
        return {
          prompt: 'For \\(f(x)=' + p.a + 'x^2 ' + bs + 'x ' + cs + '\\), find the stationary point '
            + '\\(x_0\\) (solve \\(f\'(x)=0\\)).',
          fields: [
            { key: 'x0', label: 'Stationary x₀', answer: p.root, tol: 0.01, unit: '', hint: "f′(x) = " + (2 * p.a) + 'x ' + bs + ' = 0 → x₀ = −b ÷ 2a' }
          ],
          solution: [
            "f'(x) = " + (2 * p.a) + 'x ' + bs + '.  Set = 0: x₀ = ' + (-b) + ' ÷ ' + (2 * p.a) + ' = ' + p.root + '.',
            'Since a = ' + p.a + ' > 0, this stationary point is a MINIMUM.'
          ]
        };
      },
      solution: ['Press “New numbers”. Stationary point: f′(x) = 2ax + b = 0 → x₀ = −b ÷ (2a).']
    },
    {
      id: 'ex-classify-choice',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'Classifying Stationary Points',
      prompt: 'Use the first- and second-derivative tests to classify stationary points.',
      difficulty: 2,
      items: [
        { q: 'If f′(x₀) = 0 and f″(x₀) > 0, then x₀ is a minimum.', kind: 'tf', answer: true },
        { q: 'If f′(x₀) = 0 and f″(x₀) < 0, then x₀ is a maximum.', kind: 'tf', answer: true },
        { q: 'If f′ changes from − to + at x₀, then x₀ is a maximum.', kind: 'tf', answer: false },
        { q: 'A point where f′(x₀) = 0 is called a stationary point.', kind: 'tf', answer: true },
        { q: 'If f′(x₀) = 0 and f′ does NOT change sign, x₀ is:', kind: 'mc', options: ['A minimum', 'A maximum', 'An inflection point', 'A break-even point'], answer: 2 },
        { q: 'For f(x) = x² (so f″ = 2 > 0), the stationary point x = 0 is a:', kind: 'mc', options: ['Maximum', 'Minimum', 'Inflection point', 'Asymptote'], answer: 1 }
      ],
      solution: [
        'f″ > 0 → minimum (curve opens up); f″ < 0 → maximum (curve opens down).',
        'First-derivative test: − to + is a MINIMUM, + to − is a MAXIMUM; no sign change → inflection.'
      ]
    },
    {
      id: 'ex-marginal-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Marginal Cost',
      prompt: 'Marginal cost is the derivative of total cost. Evaluate it at a quantity.',
      difficulty: 2,
      params: {
        a: { choices: [1, 2, 3] },
        b: { min: 2, max: 20, step: 1 },
        c: { choices: [0, 50, 100] },
        Q0: { min: 1, max: 10, step: 1 }
      },
      generate(p) {
        // T(Q) = a Q² + b Q + c ; M(Q) = T'(Q) = 2a Q + b
        const M = 2 * p.a * p.Q0 + p.b;
        return {
          prompt: 'Total cost \\(T(Q)=' + p.a + 'Q^2 + ' + p.b + 'Q + ' + p.c + '\\). Compute the marginal cost '
            + '\\(M(Q)=T\'(Q)\\) at Q = ' + p.Q0 + '.',
          fields: [
            { key: 'M', label: 'M(' + p.Q0 + ')', answer: M, tol: 0.01, unit: '', hint: "M(Q) = " + (2 * p.a) + 'Q + ' + p.b }
          ],
          solution: [
            'M(Q) = T′(Q) = ' + (2 * p.a) + 'Q + ' + p.b + '.',
            'M(' + p.Q0 + ') = ' + (2 * p.a) + '·' + p.Q0 + ' + ' + p.b + ' = ' + M + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Marginal cost M(Q) = T′(Q); the fixed cost c disappears on differentiating.']
    },
    {
      id: 'ex-maxprofit-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Maximum Profit',
      prompt: 'Maximise the profit function D(Q) = P(Q) − T(Q).',
      difficulty: 3,
      params: {
        a: { choices: [1, 2] },
        Qstar: { min: 5, max: 30, step: 5 },
        b: { min: 5, max: 30, step: 1 },
        c: { choices: [0, 50, 100, 150, 200] }
      },
      generate(p) {
        // T(Q) = a Q² + b Q + c ; P(Q) = p·Q with price chosen so D'(Q)=0 at Qstar.
        // D(Q) = (price − b)Q − a Q² − c ; D'(Q) = (price − b) − 2a Q = 0 → price − b = 2a·Qstar.
        const price = p.b + 2 * p.a * p.Qstar;
        const Dmax = p.a * p.Qstar * p.Qstar - p.c; // D(Qstar) = (2a Qstar)Qstar − a Qstar² − c = a Qstar² − c
        return {
          prompt: 'Total cost \\(T(Q)=' + p.a + 'Q^2 + ' + p.b + 'Q + ' + p.c + '\\) and revenue '
            + '\\(P(Q)=' + price + 'Q\\). Find the quantity \\(Q^*\\) of maximum profit and the maximum profit '
            + '\\(D(Q^*)\\).',
          fields: [
            { key: 'Q', label: 'Profit-maximising Q*', answer: p.Qstar, tol: 0.01, unit: '', hint: "D'(Q) = (price − b) − 2aQ = 0 → Q* = (price − b) ÷ 2a" },
            { key: 'Dmax', label: 'Maximum profit D(Q*)', answer: Dmax, tol: 0.01, unit: '', hint: 'Substitute Q* into D(Q) = P(Q) − T(Q)' }
          ],
          solution: [
            'D(Q) = P(Q) − T(Q) = (' + price + ' − ' + p.b + ')Q − ' + p.a + 'Q² − ' + p.c + ' = ' + (price - p.b) + 'Q − ' + p.a + 'Q² − ' + p.c + '.',
            "D'(Q) = " + (price - p.b) + ' − ' + (2 * p.a) + 'Q = 0 → Q* = ' + p.Qstar + '.',
            'D(' + p.Qstar + ') = ' + (price - p.b) + '·' + p.Qstar + ' − ' + p.a + '·' + p.Qstar + '² − ' + p.c + ' = ' + Dmax + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Solve D′(Q) = 0 for Q*, confirm D″ < 0 (maximum), then evaluate D(Q*).']
    },
    {
      id: 'ex-minavg-static',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Minimum Average Cost',
      prompt: 'Find the quantity that minimises the average cost, and the minimum average cost.',
      difficulty: 3,
      givens: [
        { label: 'Total cost T(Q)', value: '5Q³ − 90Q² + 540Q' }
      ],
      fields: [
        { key: 'Q', label: 'Cost-minimising Q', answer: 9, tol: 0.01, unit: '', hint: 'Average = T(Q)/Q = 5Q² − 90Q + 540; minimise: derivative 10Q − 90 = 0' },
        { key: 'min', label: 'Minimum average cost', answer: 135, tol: 0.01, unit: '', hint: 'Substitute Q = 9 into 5Q² − 90Q + 540' }
      ],
      solution: [
        'Average cost = T(Q) ÷ Q = 5Q² − 90Q + 540.',
        'Minimise: (5Q² − 90Q + 540)′ = 10Q − 90 = 0 → Q = 9 (and the second derivative 10 > 0 confirms a minimum).',
        'Minimum average cost = 5·9² − 90·9 + 540 = 405 − 810 + 540 = 135.'
      ]
    },

    // ========================================================================
    // CHAPTER 6 — INDEFINITE INTEGRAL & ELASTICITY OF DEMAND  (second-midterm)
    // ========================================================================
    {
      id: 'int-power-random',
      lesson: 'second-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Indefinite Integral — Power Rule',
      prompt: 'Integrate the power term using ∫xⁿ dx = 1/(n+1)·xⁿ⁺¹ + C.',
      difficulty: 1,
      params: {
        k: { choices: [1, 2, 3, 4] },
        n: { choices: [2, 3, 4, 5] }
      },
      generate(p) {
        const a = p.k * (p.n + 1);        // coefficient chosen so the new coefficient k is an integer
        const newExp = p.n + 1;
        return {
          prompt: 'Compute \\(\\int ' + a + 'x^{' + p.n + '}\\,dx\\). Give the coefficient of the new term and its '
            + 'exponent (ignore + C).',
          fields: [
            { key: 'coef', label: 'Coefficient', answer: p.k, tol: 0.01, unit: '', hint: 'a ÷ (n+1) = ' + a + ' ÷ ' + newExp },
            { key: 'exp', label: 'New exponent', answer: newExp, tol: 0.01, unit: '', hint: 'n + 1' }
          ],
          solution: [
            '∫ ' + a + 'x^' + p.n + ' dx = ' + a + '·(1 ÷ ' + newExp + ')·x^' + newExp + ' + C = ' + p.k + 'x^' + newExp + ' + C.'
          ]
        };
      },
      solution: ['Press “New numbers”. ∫a·xⁿ dx = a/(n+1)·xⁿ⁺¹ + C (raise the power by 1, divide by the new power).']
    },
    {
      id: 'int-totalcost-random',
      lesson: 'second-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Total Cost from Marginal Cost',
      prompt: 'Recover the total cost by integrating marginal cost; the fixed cost is the constant of integration.',
      difficulty: 2,
      params: {
        a: { choices: [1, 2, 3] },
        b: { min: 10, max: 60, step: 5 },
        fixed: { choices: [100, 200, 300, 400] },
        Q0: { min: 1, max: 10, step: 1 }
      },
      generate(p) {
        // M(Q) = 2a Q + b → T(Q) = a Q² + b Q + fixed ; evaluate at Q0
        const T = p.a * p.Q0 * p.Q0 + p.b * p.Q0 + p.fixed;
        return {
          prompt: 'Marginal cost is \\(M(Q)=' + (2 * p.a) + 'Q + ' + p.b + '\\) and the fixed cost is ' + p.fixed
            + '. Find the total cost function \\(T(Q)=\\int M(Q)\\,dQ\\) and evaluate \\(T(' + p.Q0 + ')\\).',
          fields: [
            { key: 'T', label: 'T(' + p.Q0 + ')', answer: T, tol: 0.01, unit: '', hint: 'T(Q) = ' + p.a + 'Q² + ' + p.b + 'Q + ' + p.fixed }
          ],
          solution: [
            'T(Q) = ∫(' + (2 * p.a) + 'Q + ' + p.b + ') dQ = ' + p.a + 'Q² + ' + p.b + 'Q + C, with C = fixed cost = ' + p.fixed + '.',
            'T(' + p.Q0 + ') = ' + p.a + '·' + p.Q0 + '² + ' + p.b + '·' + p.Q0 + ' + ' + p.fixed + ' = ' + T + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Integrate M(Q); the constant of integration is the fixed cost.']
    },
    {
      id: 'elasticity-random',
      lesson: 'second-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Elasticity of Linear Demand',
      prompt: 'Compute the elasticity coefficient of a linear demand at a given price. Round to 3 dp.',
      difficulty: 3,
      params: {
        m: { choices: [10, 20, 25, 50] },   // |slope| of demand
        c: { choices: [800, 1000, 1200 ] },  // intercept
        p0: { min: 2, max: 12, step: 2 }
      },
      generate(p) {
        // q = -m p + c ; dq/dp = -m ; E = (p/q)(dq/dp) = -m p / q
        const q0 = -p.m * p.p0 + p.c;        // stays positive for these ranges
        const E = (-p.m * p.p0) / q0;
        const r3 = (x) => Math.round(x * 1000) / 1000;
        return {
          prompt: 'The demand function is \\(q=-' + p.m + 'p+' + p.c + '\\). Compute the elasticity coefficient '
            + '\\(E_{q,p}=\\frac{p}{q}\\frac{dq}{dp}\\) at the price p = ' + p.p0 + '. Round to 3 dp.',
          fields: [
            { key: 'E', label: 'Elasticity E at p = ' + p.p0, answer: E, tol: 0.01, unit: '', hint: 'dq/dp = −' + p.m + '; q = ' + q0 + '; E = −' + p.m + '·' + p.p0 + ' ÷ ' + q0 }
          ],
          solution: [
            'dq/dp = −' + p.m + '.  q(' + p.p0 + ') = −' + p.m + '·' + p.p0 + ' + ' + p.c + ' = ' + q0 + '.',
            'E = (p ÷ q)·(dq/dp) = (' + p.p0 + ' ÷ ' + q0 + ')·(−' + p.m + ') = ' + r3(E) + '.',
            (Math.abs(E) > 1 ? 'Since |E| > 1, demand is ELASTIC here.' : 'Since |E| < 1, demand is INELASTIC here.') + ' The − sign means demand falls as price rises.'
          ]
        };
      },
      solution: ['Press “New numbers”. For q = −mp + c: E = (p/q)·(−m). |E| > 1 elastic, < 1 inelastic.']
    },
    {
      id: 'int-elasticity-concepts',
      lesson: 'second-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Integrals & Elasticity — Concepts',
      prompt: 'Answer the concept questions on integration and elasticity.',
      difficulty: 1,
      items: [
        { q: 'Integration is the inverse operation of differentiation.', kind: 'tf', answer: true },
        { q: 'The constant of integration in T(Q) = ∫M(Q)dQ is the fixed cost.', kind: 'tf', answer: true },
        { q: 'If |E| < 1 the demand is elastic.', kind: 'tf', answer: false },
        { q: 'A negative elasticity means demand falls when price rises.', kind: 'tf', answer: true },
        { q: '\\(\\int x^4\\,dx = \\) ?', kind: 'mc', options: ['\\(4x^3+C\\)', '\\(\\frac15 x^5+C\\)', '\\(x^5+C\\)', '\\(\\frac14 x^4+C\\)'], answer: 1 },
        { q: 'Demand with |E| = 1 has:', kind: 'mc', options: ['Perfect inelasticity', 'Unit elasticity', 'Elastic demand', 'No elasticity'], answer: 1 }
      ],
      solution: [
        '|E| > 1 elastic, |E| < 1 inelastic, |E| = 1 unit elasticity, E = 0 perfectly inelastic.',
        '∫x⁴ dx = 1/5·x⁵ + C (raise power to 5, divide by 5).'
      ]
    },

    // ========================================================================
    // CHAPTER 8 — ANNUITIES (RENTS)  (second-midterm)
    // ========================================================================
    {
      id: 'annuity-future-post-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Future Value — Postnumerando Annuity',
      prompt: 'Compute the future (final) value of a postnumerando annuity. Round to 2 dp.',
      difficulty: 2,
      params: {
        R: { choices: [1000, 2000, 5000, 10000] },
        p: { choices: [4, 5, 6, 8, 10] },
        n: { min: 4, max: 12, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100;
        const S = p.R * (Math.pow(r, p.n) - 1) / (r - 1);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A person invests ' + p.R + ' at the END of each year for ' + p.n + ' years at ' + p.p
            + '% annual (compound, decursive) interest. What is the future value? Round to 2 dp.',
          fields: [
            { key: 'S', label: 'Future value Sₙ′', answer: r2(S), tol: 2, unit: '', hint: "S = R·(rⁿ − 1)/(r − 1), r = 1 + " + p.p + "/100 = " + r }
          ],
          solution: [
            'r = 1 + ' + p.p + '/100 = ' + r + ';  rⁿ = ' + r + '^' + p.n + ' = ' + r2(Math.pow(r, p.n)) + '.',
            "Sₙ′ = " + p.R + '·(' + r2(Math.pow(r, p.n)) + ' − 1) ÷ (' + r + ' − 1) = ' + r2(S) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Postnumerando future value: Sₙ′ = R·(rⁿ − 1)/(r − 1), r = 1 + p/100.']
    },
    {
      id: 'annuity-future-pre-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Future Value — Prenumerando Annuity',
      prompt: 'Compute the future (final) value of a prenumerando annuity. Round to 2 dp.',
      difficulty: 2,
      params: {
        R: { choices: [1000, 2000, 5000] },
        p: { choices: [4, 5, 6, 8, 10] },
        n: { min: 4, max: 12, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100;
        const S = p.R * r * (Math.pow(r, p.n) - 1) / (r - 1);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A person invests ' + p.R + ' at the BEGINNING of each year for ' + p.n + ' years at ' + p.p
            + '% annual (compound, decursive) interest. What is the future value? Round to 2 dp.',
          fields: [
            { key: 'S', label: 'Future value Sₙ', answer: r2(S), tol: 2, unit: '', hint: "S = R·r·(rⁿ − 1)/(r − 1), r = " + r }
          ],
          solution: [
            'r = ' + r + ';  prenumerando earns one extra period of interest (×r).',
            "Sₙ = " + p.R + '·' + r + '·(' + r2(Math.pow(r, p.n)) + ' − 1) ÷ (' + r + ' − 1) = ' + r2(S) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Prenumerando future value: Sₙ = R·r·(rⁿ − 1)/(r − 1) = r × the postnumerando value.']
    },
    {
      id: 'annuity-present-post-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Present Value — Postnumerando Annuity',
      prompt: 'Compute how much to invest today for a postnumerando annuity. Round to 2 dp.',
      difficulty: 3,
      params: {
        R: { choices: [10000, 20000, 30000] },
        p: { choices: [4, 5, 6, 8] },
        n: { min: 4, max: 10, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100;
        const A = (p.R / Math.pow(r, p.n)) * (Math.pow(r, p.n) - 1) / (r - 1);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'What amount should be invested today to ensure ' + p.n + ' payments of ' + p.R
            + ' at the END of each year at ' + p.p + '% annual (compound, decursive) interest? Round to 2 dp.',
          fields: [
            { key: 'A', label: 'Present value Aₙ', answer: r2(A), tol: 2, unit: '', hint: "A = R/rⁿ·(rⁿ − 1)/(r − 1), r = " + r }
          ],
          solution: [
            'r = ' + r + ';  rⁿ = ' + r2(Math.pow(r, p.n)) + '.',
            "Aₙ = (" + p.R + ' ÷ ' + r2(Math.pow(r, p.n)) + ')·(' + r2(Math.pow(r, p.n)) + ' − 1) ÷ (' + r + ' − 1) = ' + r2(A) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Postnumerando present value: Aₙ = R/rⁿ·(rⁿ − 1)/(r − 1).']
    },
    {
      id: 'annuity-concepts',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Annuities — Concepts',
      prompt: 'Answer the concept questions on annuities (rents).',
      difficulty: 1,
      items: [
        { q: 'The interest factor is r = 1 + i.', kind: 'tf', answer: true },
        { q: 'Prenumerando payments are made at the beginning of each period.', kind: 'tf', answer: true },
        { q: 'The present value is larger than the future value of the same annuity.', kind: 'tf', answer: false },
        { q: 'A prenumerando future value equals the postnumerando one times r.', kind: 'tf', answer: true },
        { q: 'An annual rate p = 6% gives r =', kind: 'mc', options: ['0.06', '1.06', '6', '1.6'], answer: 1 },
        { q: 'The future value of a postnumerando annuity is:', kind: 'mc', options: ['R·rⁿ', 'R·(rⁿ−1)/(r−1)', 'R/rⁿ', 'R·(r−1)'], answer: 1 }
      ],
      solution: [
        'Future value (end worth) > present value (today\'s worth), because money grows with interest.',
        'r = 1 + p/100; postnumerando future value Sₙ′ = R·(rⁿ − 1)/(r − 1).'
      ]
    },

    // ========================================================================
    // CHAPTER 9 — CASH LOANS  (second-midterm)
    // ========================================================================
    {
      id: 'loan-annuity-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Loan with Equal Annuities',
      prompt: 'Compute the nominally equal annuity for a loan. Round to 2 dp.',
      difficulty: 3,
      params: {
        C: { choices: [80000, 100000, 130000, 150000] },
        p: { choices: [4, 5, 6, 8, 10] },
        n: { min: 4, max: 10, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100;
        const rn = Math.pow(r, p.n);
        const a = p.C * rn * (r - 1) / (rn - 1);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A loan of ' + p.C + ' is granted for ' + p.n + ' years at ' + p.p + '% annual (compound, '
            + 'decursive) interest, repaid with equal annuities at the END of each year. Find the annuity a. Round to 2 dp.',
          fields: [
            { key: 'a', label: 'Annuity a', answer: r2(a), tol: 2, unit: '', hint: "a = C·rⁿ(r − 1)/(rⁿ − 1), r = " + r }
          ],
          solution: [
            'r = ' + r + ';  rⁿ = ' + r2(rn) + '.',
            'a = ' + p.C + '·' + r2(rn) + '·(' + r + ' − 1) ÷ (' + r2(rn) + ' − 1) = ' + r2(a) + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Equal loan annuity: a = C·rⁿ(r − 1)/(rⁿ − 1) (present value of the repayments).']
    },
    {
      id: 'loan-equalquota-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Loan with Equal Repayment Quotas',
      prompt: 'For the equal-repayment-quotas model, find the quota and the first annuity.',
      difficulty: 2,
      params: {
        quota: { choices: [10000, 15000, 20000, 25000] },
        n: { choices: [4, 5, 6 ] },
        p: { choices: [4, 5, 6, 8, 10] }
      },
      generate(p) {
        const C = p.quota * p.n;          // C = R·n  (so R = C/n is exact)
        const I1 = C * p.p / 100;         // interest on full debt in year 1
        const a1 = p.quota + I1;          // first annuity = R + I₁
        return {
          prompt: 'A loan of ' + C + ' is repaid over ' + p.n + ' years with NOMINALLY EQUAL repayment quotas at '
            + p.p + '% annual interest. Find the repayment quota R and the FIRST annuity a₁.',
          fields: [
            { key: 'R', label: 'Repayment quota R', answer: p.quota, tol: 0.01, unit: '', hint: 'R = C ÷ n = ' + C + ' ÷ ' + p.n },
            { key: 'a1', label: 'First annuity a₁', answer: a1, tol: 0.01, unit: '', hint: 'a₁ = R + I₁, I₁ = C·p/100 = ' + C + '·' + p.p + '/100' }
          ],
          solution: [
            'R = C ÷ n = ' + C + ' ÷ ' + p.n + ' = ' + p.quota + '.',
            'I₁ = C·p/100 = ' + C + '·' + p.p + '/100 = ' + I1 + '.',
            'a₁ = R + I₁ = ' + p.quota + ' + ' + I1 + ' = ' + a1 + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Equal quotas: R = C/n; first annuity a₁ = R + I₁ with I₁ = C·p/100.']
    },
    {
      id: 'loan-concepts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Loans — Concepts',
      prompt: 'Answer the concept questions on loan repayment.',
      difficulty: 1,
      items: [
        { q: 'Each loan annuity splits into a repayment quota and interest (Aₖ = Rₖ + Iₖ).', kind: 'tf', answer: true },
        { q: 'The sum of all repayment quotas equals the loan amount C₀.', kind: 'tf', answer: true },
        { q: 'In the equal-annuities model, the interest part rises over time.', kind: 'tf', answer: false },
        { q: 'In the equal-repayment-quotas model the quota is R = C/n.', kind: 'tf', answer: true },
        { q: 'Interest in period k is computed as:', kind: 'mc', options: ['C₀·p/100', 'Cₖ₋₁·p/100', 'a·r', 'C/n'], answer: 1 },
        { q: 'Total interest paid equals:', kind: 'mc', options: ['ΣAₖ + C₀', 'ΣAₖ − C₀', 'C₀', 'C₀/n'], answer: 1 }
      ],
      solution: [
        'In the equal-annuities model the interest part FALLS over time (the debt shrinks) and the quota rises.',
        'Interest Iₖ = Cₖ₋₁·p/100; total interest = ΣAₖ − C₀.'
      ]
    },

    // ========================================================================
    // CHAPTER 11 — GAUSS-JORDAN METHOD  (second-midterm)
    // ========================================================================
    {
      id: 'gj-solve2x2-random',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Solve a 2×2 System (Gauss-Jordan)',
      prompt: 'Solve the linear system (unique solution).',
      difficulty: 2,
      params: {
        x: { min: -4, max: 5, step: 1 },
        y: { min: -4, max: 5, step: 1 },
        a1: { choices: [2, 3, 4] },   // eq1:  a1·x + y = c1   (b1 = 1)
        b2: { choices: [2, 3, 4] }    // eq2:  x + b2·y = c2   (a2 = 1)
      },
      generate(p) {
        // eq1: a1 x + 1 y = c1 ; eq2: 1 x + b2 y = c2.
        // Determinant = a1·b2 − 1·1 = a1·b2 − 1 ≥ 2·2 − 1 = 3 ≠ 0 → always a unique solution.
        const c1 = p.a1 * p.x + p.y;
        const c2 = p.x + p.b2 * p.y;
        const det = p.a1 * p.b2 - 1;
        return {
          prompt: 'Solve the system using the Gauss-Jordan method:\\[\\begin{aligned}' + p.a1 + 'x + y &= ' + c1
            + '\\\\ x + ' + p.b2 + 'y &= ' + c2 + '\\end{aligned}\\]',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'Reduce [A | b] to the identity' },
            { key: 'y', label: 'y', answer: p.y, tol: 0.01, unit: '', hint: 'Back-substitute / read from the reduced matrix' }
          ],
          solution: [
            'Determinant = ' + p.a1 + '·' + p.b2 + ' − 1·1 = ' + det + ' ≠ 0 → unique solution.',
            'Reducing the augmented matrix to the identity gives x = ' + p.x + ', y = ' + p.y + '.'
          ]
        };
      },
      solution: ['Press “New numbers”. Write [A | b], reduce the left block to the identity; the last column is (x, y).']
    },
    {
      id: 'gj-concepts',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'choice',
      title: 'Gauss-Jordan — Concepts',
      prompt: 'Answer the concept questions on the Gauss-Jordan method.',
      difficulty: 1,
      items: [
        { q: 'Swapping two rows is an elementary row operation.', kind: 'tf', answer: true },
        { q: 'Multiplying a row by 0 is an allowed elementary row operation.', kind: 'tf', answer: false },
        { q: 'The goal is to reduce the left block to the identity matrix.', kind: 'tf', answer: true },
        { q: 'A row [0 0 0 | 0] indicates no solution.', kind: 'tf', answer: false },
        { q: 'A row [0 0 0 | k] with k ≠ 0 indicates:', kind: 'mc', options: ['A unique solution', 'Infinitely many solutions', 'No solution', 'A pivot'], answer: 2 },
        { q: 'If the left block becomes the identity matrix, the system has:', kind: 'mc', options: ['No solution', 'A unique solution', 'Infinitely many solutions', 'Two solutions'], answer: 1 }
      ],
      solution: [
        'Multiplying a row by 0 destroys information and is NOT allowed. A zero row [0 0 0 | 0] → infinitely many solutions.',
        '[0 0 0 | k], k ≠ 0 is the contradiction 0 = k → no solution; identity → unique solution.'
      ]
    }

  ]
};

// Expose on window (engine reads it via catalog content.exercises); CommonJS for node tests.
if (typeof window !== 'undefined') { window.mathExercises = mathExercises; }
if (typeof module !== 'undefined' && module.exports) { module.exports = mathExercises; }
