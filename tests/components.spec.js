// F2 2D.1 — <sokrat-toast> Web Component (prvi UI-primitiv, S4).
// Dokazuje obrazac: custom element se registrira, #toast je njegova instanca s .show() metodom,
// a globalni showToast() delegira na komponentu (prikaz .show + tekst, pa auto-sakrivanje).
// Light-DOM: element zadržava klasu .toast → postojeći CSS (base + responsive) vrijedi nepromijenjeno.
const { test, expect } = require('@playwright/test');

test('sokrat-toast: registriran kao custom element + #toast je instanca s .show()', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!customElements.get('sokrat-toast'));

  const info = await page.evaluate(() => {
    const el = document.getElementById('toast');
    return {
      defined: !!customElements.get('sokrat-toast'),
      tag: el ? el.tagName.toLowerCase() : null,
      hasShow: !!(el && typeof (/** @type {any} */ (el)).show === 'function'),
      hasToastClass: !!(el && el.classList.contains('toast')),
      role: el ? el.getAttribute('role') : null,
      ariaLive: el ? el.getAttribute('aria-live') : null,
      hasMsgSpan: !!(el && el.querySelector('#toastMessage')),
    };
  });

  expect(info.defined).toBe(true);
  expect(info.tag).toBe('sokrat-toast');        // markup je Web Component, ne <div>
  expect(info.hasShow).toBe(true);              // komponenta izlaže .show() metodu
  expect(info.hasToastClass).toBe(true);        // .toast zadržan → CSS vrijedi
  expect(info.role).toBe('status');             // a11y najava
  expect(info.ariaLive).toBe('polite');
  expect(info.hasMsgSpan).toBe(true);           // unutarnji #toastMessage prisutan
});

test('sokrat-toast: showToast() prikaže poruku (.show + tekst) pa auto-sakrije', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => typeof window.showToast === 'function' && !!customElements.get('sokrat-toast'));

  // Prikaz preko globalnog delegata (isti ulaz kao svih ~13 pozivatelja u appu)
  await page.evaluate(() => window.showToast('Pozdrav 2D'));

  const toast = page.locator('#toast');
  await expect(toast).toHaveClass(/show/);                       // prikazан
  await expect(page.locator('#toastMessage')).toHaveText('Pozdrav 2D'); // tekst ažuriran

  // Auto-sakrivanje nakon 2500 ms (buffer do 4 s)
  await expect(toast).not.toHaveClass(/show/, { timeout: 4000 });

  expect(errors).toEqual([]);
});
