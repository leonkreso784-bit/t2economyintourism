// Google Ads / pravne stranice: statične, crawlable, bez overflowa.
const { test, expect } = require('@playwright/test');

const PAGES = [
  { url: '/privacy.html', h1: 'Privacy Policy' },
  { url: '/terms.html', h1: 'Terms of Use' },
  { url: '/faq.html', h1: 'Frequently Asked Questions' },
  { url: '/contact.html', h1: 'Contact' },
];

for (const p of PAGES) {
  test(`legal page ${p.url} renders without errors or overflow`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

    const resp = await page.goto(p.url);
    expect(resp.status()).toBe(200);

    await expect(page.locator('h1')).toHaveText(p.h1);
    await expect(page.locator('.legal-nav .legal-logo')).toBeVisible();
    await expect(page.locator('.legal-footer nav a[href="privacy.html"]')).toBeVisible();

    // Kontakt email mora biti prisutan (Google Ads: provjerljiv kontakt)
    await expect(page.locator('a[href^="mailto:"]').first()).toBeAttached();

    const vw = page.viewportSize().width;
    const docScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docScrollW).toBeLessThanOrEqual(vw + 1);

    expect(errors).toEqual([]);
  });
}

// F1/5 (2026-09-06): pravne stranice prate UREĐAJ kao i aplikacija (F1/3) — do tada nisu imale ni
// `data-theme` ni `boot.js`, pa je korisnik na tamnom telefonu dobivao crn katalog i bijela Pravila.
// Mjeri se ISCRTANO (atribut na <html>, `color-scheme`, izračunata pozadina <body> == token teme),
// ne prisutnost skripte. Imena tema su odluka iz F1/3 (`boot.js` ZADANA), ne kopija palete.
const hexUrgb = (hex) => {
  const h = hex.replace('#', '');
  const p = h.length === 3 ? h.split('').map((c) => c + c) : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
  return 'rgb(' + p.map((x) => parseInt(x, 16)).join(', ') + ')';
};
for (const [shema, tema] of [['dark', 'carbon'], ['light', 'academic']]) {
  test(`legal pages follow the device colour scheme (${shema} → ${tema})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: shema });
    for (const p of PAGES) {
      await page.goto(p.url);
      const s = await page.evaluate(() => ({
        tema: document.documentElement.getAttribute('data-theme'),
        shema: document.documentElement.style.colorScheme,
        bg: getComputedStyle(document.body).backgroundColor,
        surface0: getComputedStyle(document.documentElement).getPropertyValue('--color-surface-0').trim(),
      }));
      expect(s.tema, p.url + ': data-theme').toBe(tema);
      expect(s.shema, p.url + ': color-scheme').toBe(shema);
      expect(s.bg, p.url + ': body pozadina == --color-surface-0 teme').toBe(hexUrgb(s.surface0));
    }
  });
}

test('landing footer links to legal pages', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.landing-footer');
  await expect(page.locator('.landing-footer a[href="privacy.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="terms.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="faq.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="contact.html"]')).toBeAttached();
});
