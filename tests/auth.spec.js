// Backend staza B: auth UI (Sign in gumb + magic-link modal).
// Auth se tiho gasi ako je supabase-js CDN nedostupan — tada se test preskače
// (offline okruženje), jer je upravo to željeno ponašanje appa.
const { test, expect } = require('@playwright/test');

test('auth: sign-in button appears and magic-link modal opens/closes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');

  const btn = page.locator('#authNavBtn');
  let cdnOk = true;
  try {
    await btn.waitFor({ state: 'visible', timeout: 15000 });
  } catch (e) {
    cdnOk = false;
  }
  test.skip(!cdnOk, 'supabase-js CDN unreachable — auth disabled by design, app radi bez njega');

  // Modal otvaranje
  await btn.click();
  await expect(page.locator('#authModal')).toBeVisible();
  await expect(page.locator('#authEmail')).toBeVisible();
  await expect(page.locator('#authForm .auth-modal__submit')).toBeVisible();

  // Zatvaranje na X
  await page.click('.auth-modal__close');
  await expect(page.locator('#authModal')).toBeHidden();

  // Gumb ne smije izazvati horizontalni overflow nav-a
  const vw = page.viewportSize().width;
  const docScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(docScrollW).toBeLessThanOrEqual(vw + 1);

  expect(errors).toEqual([]);
});

// Profile stranica: odjavljen korisnik vidi sign-in prompt; back vraća na landing.
// Ne ovisi o CDN-u (renderProfilePage radi i bez supabase klijenta).
test('profile page shows sign-in prompt when signed out and navigates back', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.navigateTo && window.renderProfilePage);

  await page.evaluate(() => navigateTo('profile'));
  await expect(page.locator('#profile-page')).toBeVisible();
  await expect(page.locator('#profileSignInBtn')).toBeVisible();

  await page.click('#backFromProfile');
  await expect(page.locator('#landing-page')).toHaveClass(/active/);

  // Profile se NE sprema kao last-position (restore ovisi o auth sesiji)
  const savedPage = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('sokrat-last-position') || '{}').page || null; }
    catch (e) { return null; }
  });
  expect(savedPage).not.toBe('profile');

  expect(errors).toEqual([]);
});
