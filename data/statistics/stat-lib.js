// ===== STATISTICS — STAT-LIB (content-layer math) =====
//
// MINIMALNA statistička matematika koju koristi SAMO content pack (data/statistics/exercises.js)
// u svojim solve()/fiksnim odgovorima. NIJE engine: generički engine (js/exercises-core.js,
// js/exercises.js, css/exercises.css) ovo NE poziva → zato živi u data/ (lazy preko content.scripts),
// a ne u js/. Vidi docs/subjects/STATISTICS_PLAN.md §2 i docs/architecture/EXERCISES_ENGINE.md.
//
// NAČELO: u lib ide samo „teško/dijeljeno" (normalna CDF + z/t kritične tablice). Elementarna
// aritmetika (mean, SD, z=(x−μ)/σ, SE, CI granice, test-statistika, slope/R²) ostaje INLINE u solve(p).
//
// Čiste funkcije, bez DOM-a. Node-testabilno: tests/unit/stat-lib.test.js (npm run test:unit).
// Brojevi cross-checkani: standardna z/t tablica + mathportal kalkulatori + midterm answer-keyevi.
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* je immutable).
// Učitava se PRIJE exercises.js (catalog content.scripts).

(function (root) {
  'use strict';

  // --- normalCdf(z) → P(Z ≤ z) za standardnu normalnu N(0,1) ----------------
  // Abramowitz & Stegun 26.2.17 (|greška| < 7.5e-8). Za desni rep koristi normalSf.
  function normalCdf(z) {
    if (!isFinite(z)) return z > 0 ? 1 : 0;
    if (z < 0) return 1 - normalCdf(-z);
    var b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937,
        b4 = -1.821255978, b5 = 1.330274429, p = 0.2316419, c = 0.39894228040143268;
    var t = 1 / (1 + p * z);
    var poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
    return 1 - c * Math.exp(-z * z / 2) * poly;
  }

  // P(Z > z) — desni rep (komplement). Zgodno za "greater than" zadatke.
  function normalSf(z) { return 1 - normalCdf(z); }

  // P(a < Z < b) — površina između dvije z-vrijednosti.
  function normalBetween(a, b) { return normalCdf(b) - normalCdf(a); }

  // --- Z kritične vrijednosti (gornji-repna površina α) ----------------------
  // Reliability faktor za CI: z_{α/2}. Po RAZINI POUZDANOSTI (dvostrani):
  //   90% → 1.645, 95% → 1.96, 99% → 2.576 (α/2 = 0.05 / 0.025 / 0.005).
  var Z_BY_CONFIDENCE = { 80: 1.282, 90: 1.645, 95: 1.960, 98: 2.326, 99: 2.576 };
  // Po GORNJEM REPU α (jednostrani test / α/2 za dvostrani):
  var Z_UPPER = { 0.10: 1.282, 0.05: 1.645, 0.025: 1.960, 0.01: 2.326, 0.005: 2.576 };

  // z_{α/2} iz razine pouzdanosti (npr. 95 → 1.96).
  function zCritical(confidencePct) { return Z_BY_CONFIDENCE[confidencePct]; }
  // z iz gornje-repne površine (npr. 0.025 → 1.96).
  function zUpper(alphaUpper) { return Z_UPPER[alphaUpper]; }

  // --- Studentova t — kritične vrijednosti (gornji-repna površina) -----------
  // Standardna t-tablica: T_TABLE[df] = { '0.10','0.05','0.025','0.01','0.005' } (gornji rep).
  //   Dvostrani 95% CI → df, površina 0.025.  Jednostrani test α=0.05 → površina 0.05.
  //   df = Infinity (∞) → z-vrijednosti.
  var T_TABLE = {
    1:  { 0.10: 3.078, 0.05: 6.314, 0.025: 12.706, 0.01: 31.821, 0.005: 63.657 },
    2:  { 0.10: 1.886, 0.05: 2.920, 0.025: 4.303,  0.01: 6.965,  0.005: 9.925 },
    3:  { 0.10: 1.638, 0.05: 2.353, 0.025: 3.182,  0.01: 4.541,  0.005: 5.841 },
    4:  { 0.10: 1.533, 0.05: 2.132, 0.025: 2.776,  0.01: 3.747,  0.005: 4.604 },
    5:  { 0.10: 1.476, 0.05: 2.015, 0.025: 2.571,  0.01: 3.365,  0.005: 4.032 },
    6:  { 0.10: 1.440, 0.05: 1.943, 0.025: 2.447,  0.01: 3.143,  0.005: 3.707 },
    7:  { 0.10: 1.415, 0.05: 1.895, 0.025: 2.365,  0.01: 2.998,  0.005: 3.499 },
    8:  { 0.10: 1.397, 0.05: 1.860, 0.025: 2.306,  0.01: 2.896,  0.005: 3.355 },
    9:  { 0.10: 1.383, 0.05: 1.833, 0.025: 2.262,  0.01: 2.821,  0.005: 3.250 },
    10: { 0.10: 1.372, 0.05: 1.812, 0.025: 2.228,  0.01: 2.764,  0.005: 3.169 },
    11: { 0.10: 1.363, 0.05: 1.796, 0.025: 2.201,  0.01: 2.718,  0.005: 3.106 },
    12: { 0.10: 1.356, 0.05: 1.782, 0.025: 2.179,  0.01: 2.681,  0.005: 3.055 },
    13: { 0.10: 1.350, 0.05: 1.771, 0.025: 2.160,  0.01: 2.650,  0.005: 3.012 },
    14: { 0.10: 1.345, 0.05: 1.761, 0.025: 2.145,  0.01: 2.624,  0.005: 2.977 },
    15: { 0.10: 1.341, 0.05: 1.753, 0.025: 2.131,  0.01: 2.602,  0.005: 2.947 },
    16: { 0.10: 1.337, 0.05: 1.746, 0.025: 2.120,  0.01: 2.583,  0.005: 2.921 },
    17: { 0.10: 1.333, 0.05: 1.740, 0.025: 2.110,  0.01: 2.567,  0.005: 2.898 },
    18: { 0.10: 1.330, 0.05: 1.734, 0.025: 2.101,  0.01: 2.552,  0.005: 2.878 },
    19: { 0.10: 1.328, 0.05: 1.729, 0.025: 2.093,  0.01: 2.539,  0.005: 2.861 },
    20: { 0.10: 1.325, 0.05: 1.725, 0.025: 2.086,  0.01: 2.528,  0.005: 2.845 },
    21: { 0.10: 1.323, 0.05: 1.721, 0.025: 2.080,  0.01: 2.518,  0.005: 2.831 },
    22: { 0.10: 1.321, 0.05: 1.717, 0.025: 2.074,  0.01: 2.508,  0.005: 2.819 },
    23: { 0.10: 1.319, 0.05: 1.714, 0.025: 2.069,  0.01: 2.500,  0.005: 2.807 },
    24: { 0.10: 1.318, 0.05: 1.711, 0.025: 2.064,  0.01: 2.492,  0.005: 2.797 },
    25: { 0.10: 1.316, 0.05: 1.708, 0.025: 2.060,  0.01: 2.485,  0.005: 2.787 },
    26: { 0.10: 1.315, 0.05: 1.706, 0.025: 2.056,  0.01: 2.479,  0.005: 2.779 },
    27: { 0.10: 1.314, 0.05: 1.703, 0.025: 2.052,  0.01: 2.473,  0.005: 2.771 },
    28: { 0.10: 1.313, 0.05: 1.701, 0.025: 2.048,  0.01: 2.467,  0.005: 2.763 },
    29: { 0.10: 1.311, 0.05: 1.699, 0.025: 2.045,  0.01: 2.462,  0.005: 2.756 },
    30: { 0.10: 1.310, 0.05: 1.697, 0.025: 2.042,  0.01: 2.457,  0.005: 2.750 }
  };

  // t kritična vrijednost za (df, gornji-repna površina). df ≥ 31 ili ∞ → z-aproksimacija.
  function tCritical(df, alphaUpper) {
    if (df >= 31 || !isFinite(df)) return Z_UPPER[alphaUpper];
    var row = T_TABLE[df];
    return row ? row[alphaUpper] : undefined;
  }

  // --- combinations(n, k) → C(n,k) = n! / (k!(n−k)!) -------------------------
  // Multiplikativni oblik (bez velikih faktorijela → bez overflowa/greške). Cijeli broj.
  // Dijele ga T3 (kombinatorika) i T4 (binomna vjerojatnost). 0 ako k<0 ili k>n.
  function combinations(n, k) {
    if (k < 0 || k > n || n < 0) return 0;
    k = Math.min(k, n - k);
    var num = 1;
    for (var i = 1; i <= k; i++) num = num * (n - k + i) / i;
    return Math.round(num);
  }

  var StatLib = {
    normalCdf: normalCdf,
    normalSf: normalSf,
    normalBetween: normalBetween,
    zCritical: zCritical,
    zUpper: zUpper,
    tCritical: tCritical,
    combinations: combinations,
    Z_BY_CONFIDENCE: Z_BY_CONFIDENCE,
    Z_UPPER: Z_UPPER,
    T_TABLE: T_TABLE
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = StatLib;
  if (root) root.StatLib = StatLib;
})(typeof window !== 'undefined' ? window : null);
