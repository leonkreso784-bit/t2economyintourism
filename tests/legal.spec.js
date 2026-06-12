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

test('landing footer links to legal pages', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.landing-footer');
  await expect(page.locator('.landing-footer a[href="privacy.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="terms.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="faq.html"]')).toBeAttached();
  await expect(page.locator('.landing-footer a[href="contact.html"]')).toBeAttached();
});
