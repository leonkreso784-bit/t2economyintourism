// ===== MATHEMATICS — MATH-LIB (content-layer math) =====
//
// MINIMAL shared math used ONLY by the content pack (data/math/exercises.js) in its
// solve()/generate() answers. This is NOT the engine: the generic engine
// (js/exercises-core.js, js/exercises.js, css/exercises.css) never calls this → it lives
// in data/ (lazy via content.scripts), not js/. Pattern mirrors data/statistics/stat-lib.js.
//
// PRINCIPLE: only "shared/non-trivial" helpers go here (quadratic solver, gcd, rounding,
// polynomial eval/derivative). Elementary arithmetic stays INLINE in each exercise's generate().
//
// Pure functions, no DOM. Node-testable. Loaded BEFORE exercises.js (catalog content.scripts).
//
// ⚠ CACHE: when editing, bump CONTENT_VERSION in js/content-loader.js (data/* is immutable).

(function (root) {
  'use strict';

  // Round to n decimals (banker-free, simple). r2 = 2 dp by default.
  function round(x, n) {
    var f = Math.pow(10, n == null ? 2 : n);
    return Math.round(x * f) / f;
  }

  // Greatest common divisor (for reducing fractions in generated answers).
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  // Solve a x^2 + b x + c = 0. Returns { D, nReal, roots:[smaller,larger] } (roots only when D>=0).
  function solveQuadratic(a, b, c) {
    var D = b * b - 4 * a * c;
    if (D < 0) return { D: D, nReal: 0, roots: [] };
    if (D === 0) return { D: D, nReal: 1, roots: [-b / (2 * a)] };
    var s = Math.sqrt(D);
    var r1 = (-b - s) / (2 * a), r2 = (-b + s) / (2 * a);
    return { D: D, nReal: 2, roots: r1 <= r2 ? [r1, r2] : [r2, r1] };
  }

  // Evaluate a polynomial given coefficients in DESCENDING order [a_n, ..., a_1, a_0] at x.
  function polyEval(coeffs, x) {
    return coeffs.reduce(function (acc, c) { return acc * x + c; }, 0);
  }

  // Derivative coefficients (descending in → descending out) of a polynomial.
  // [a_n,...,a_1,a_0] -> [n*a_n, ..., 1*a_1].
  function polyDeriv(coeffs) {
    var n = coeffs.length - 1, out = [];
    for (var i = 0; i < coeffs.length - 1; i++) out.push((n - i) * coeffs[i]);
    return out.length ? out : [0];
  }

  var MathLib = { round: round, gcd: gcd, solveQuadratic: solveQuadratic, polyEval: polyEval, polyDeriv: polyDeriv };

  if (typeof module !== 'undefined' && module.exports) module.exports = MathLib;
  if (root) root.MathLib = MathLib;
})(typeof window !== 'undefined' ? window : null);
