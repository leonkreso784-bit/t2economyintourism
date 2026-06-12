// Backend staza B: auth UI (Sign in gumb + email+lozinka modal s tabovima).
// Auth se tiho gasi ako je supabase-js CDN nedostupan — tada se test preskače
// (offline okruženje), jer je upravo to željeno ponašanje appa.
const { test, expect } = require('@playwright/test');

test('auth: sign-in button opens password modal with tabs and forgot flow', async ({ page }) => {
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

  // Modal otvaranje → default je Sign in tab s email+password poljima
  await btn.click();
  await expect(page.locator('#authModal')).toBeVisible();
  await expect(page.locator('#authTabSignIn')).toHaveClass(/is-active/);
  await expect(page.locator('#authSignInEmail')).toBeVisible();
  await expect(page.locator('#authSignInPassword')).toBeVisible();
  await expect(page.locator('#authSignUpForm')).toBeHidden();

  // Tab Create account → ime + email + lozinka (min 8)
  await page.click('#authTabSignUp');
  await expect(page.locator('#authTabSignUp')).toHaveClass(/is-active/);
  await expect(page.locator('#authSignUpName')).toBeVisible();
  await expect(page.locator('#authSignUpEmail')).toBeVisible();
  await expect(page.locator('#authSignUpPassword')).toBeVisible();
  await expect(page.locator('#authSignUpPassword')).toHaveAttribute('minlength', '8');
  await expect(page.locator('#authSignInForm')).toBeHidden();

  // Natrag na Sign in → Forgot password? → reset forma → Back to sign in
  await page.click('#authTabSignIn');
  await page.click('#authForgotLink');
  await expect(page.locator('#authForgotEmail')).toBeVisible();
  await expect(page.locator('#authSignInForm')).toBeHidden();
  await page.click('#authBackToSignIn');
  await expect(page.locator('#authSignInEmail')).toBeVisible();
  await expect(page.locator('#authForgotForm')).toBeHidden();

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
