// ADR-009 KaTeX brick — end-to-end proof of the math-rendering seam.
// Verifies BOTH halves of the design:
//   1. LaTeX inside \( ... \), \[ ... \] and $$ ... $$ renders to .katex nodes.
//   2. Currency `$` is NEVER parsed as math — single `$` is not a delimiter, so the
//      120+ "$NN" amounts in existing live content stay literal and untouched.
const { test, expect } = require('@playwright/test');

test('KaTeX renders LaTeX delimiters and leaves currency $ untouched', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');

  // Our helper is defined by js/math.js; renderMathInElement comes from the KaTeX CDN.
  await page.waitForFunction(() => typeof window.renderMath === 'function');
  await page.waitForFunction(() => typeof window.renderMathInElement === 'function', { timeout: 15000 });

  const result = await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = '__katex_probe__';
    box.innerHTML =
      '<p id="m1">Elasticity \\(E_d = \\frac{\\%\\Delta Q}{\\%\\Delta P}\\) is a ratio.</p>' +
      '<p id="m2">$$MR = MC$$</p>' +
      '<p id="m3">\\[ TC = FC + VC \\]</p>' +
      '<p id="m4">A room costs $25 and a suite costs $50 per night.</p>';
    document.body.appendChild(box);
    window.renderMath(box);
    return {
      inlineRendered: box.querySelector('#m1 .katex') !== null,
      displayDollar: box.querySelector('#m2 .katex') !== null,
      displayBracket: box.querySelector('#m3 .katex') !== null,
      currencyHasKatex: box.querySelector('#m4 .katex') !== null,
      currencyText: box.querySelector('#m4').textContent,
    };
  });

  expect(result.inlineRendered).toBe(true);
  expect(result.displayDollar).toBe(true);
  expect(result.displayBracket).toBe(true);

  // Currency must be left completely alone.
  expect(result.currencyHasKatex).toBe(false);
  expect(result.currencyText).toBe('A room costs $25 and a suite costs $50 per night.');

  expect(errors).toEqual([]);
});
