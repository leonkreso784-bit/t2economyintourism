// Backend staza B: auth UI (Sign in gumb + email+lozinka modal s tabovima).
// Auth se tiho gasi ako je supabase-js CDN nedostupan — tada se test preskače
// (offline okruženje), jer je upravo to željeno ponašanje appa.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

// Pre-set the cookie-consent choice so the fixed bottom banner (which legitimately
// overlays the bottom of the viewport until dismissed) doesn't intercept clicks on
// the auth modal's lower controls on short landscape viewports — mirrors a returning
// visitor who already made a choice.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
});

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

  // Gumb-oko: prikaži/sakrij lozinku (type password ↔ text)
  const signInToggle = page.locator('#authSignInForm .auth-pass-toggle');
  await expect(page.locator('#authSignInPassword')).toHaveAttribute('type', 'password');
  await signInToggle.click();
  await expect(page.locator('#authSignInPassword')).toHaveAttribute('type', 'text');
  await signInToggle.click();
  await expect(page.locator('#authSignInPassword')).toHaveAttribute('type', 'password');

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
  // `profile.js` stiže s istoimenim paketom; `navigateTo('profile')` bi ga i sam dovukao,
  // ali test ga traži izričito da čekanje ispod ne ovisi o brzini te mreže.
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => window.navigateTo && window.renderProfilePage);

  await page.evaluate(() => navigateTo('profile'));
  await expect(page.locator('#profile-page')).toBeVisible();
  await expect(page.locator('#profileSignInBtn')).toBeVisible();

  await page.click('#pathbarBack');   // K2b: jedan gumb natrag za cijelu aplikaciju
  await expect(page.locator('#landing-page')).toHaveClass(/active/);

  // Profile se NE sprema kao last-position (restore ovisi o auth sesiji)
  const savedPage = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('sokrat-last-position') || '{}').page || null; }
    catch (e) { return null; }
  });
  expect(savedPage).not.toBe('profile');

  expect(errors).toEqual([]);
});

// ===== R1 (spec RACUN): OAuth ulazi + dvokoracna registracija s upitnikom =====
// Pravi OAuth se u testu NE klika (signInWithOAuth = puni redirect na provider);
// ovdje se tvrdi STRUKTURA i tok panela — ziva prijava je test:authed domena.
test('auth R1: OAuth buttons + two-step signup with questionnaire', async ({ page }) => {
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
  test.skip(!cdnOk, 'supabase-js CDN unreachable — auth disabled by design');

  await btn.click();
  await expect(page.locator('#authModal')).toBeVisible();

  // OAuth gumbi vidljivi na prijavi I registraciji (blok je iznad tabova)
  await expect(page.locator('#authGoogleBtn')).toBeVisible();
  // Facebook maknut na Leonovu riječ 2026-09-02 (čeka Metine ključeve; FB_LOGIN u auth.js)
  await expect(page.locator('#authFacebookBtn')).toHaveCount(0);
  await page.click('#authTabSignUp');
  await expect(page.locator('#authGoogleBtn')).toBeVisible();

  // Korak 1 → korak 2: upitnik (role-pilule + skola + pristanak), OAuth se MICE
  // (usred registracije bi „Continue with Google" izgledao kao put da se ona dovrsi)
  await page.fill('#authSignUpName', 'Test Testic');
  await page.fill('#authSignUpEmail', 'test@example.com');
  await page.fill('#authSignUpPassword', 'neka-duga-lozinka-123');
  await page.click('#authSignUpForm button[type="submit"]');
  await expect(page.locator('#authSignUpForm2')).toBeVisible();
  await expect(page.locator('#authSignUpForm')).toBeHidden();
  await expect(page.locator('#authGoogleBtn')).toBeHidden();
  await expect(page.locator('input[name="authSignUpType"]')).toHaveCount(3);
  await expect(page.locator('#authSignUpSchool')).toBeVisible();
  await expect(page.locator('#authSignUpConsent')).not.toBeChecked(); // GDPR: default NE

  // Natrag cuva vrijednosti koraka 1 (forma je samo skrivena, ne resetirana)
  await page.click('#authSignUpBack');
  await expect(page.locator('#authSignUpForm')).toBeVisible();
  await expect(page.locator('#authSignUpEmail')).toHaveValue('test@example.com');
  await expect(page.locator('#authGoogleBtn')).toBeVisible();

  // Na forgot panelu OAuth-a takoder nema (nije nacin da se resetira lozinka)
  await page.click('#authTabSignIn');
  await page.click('#authForgotLink');
  await expect(page.locator('#authGoogleBtn')).toBeHidden();

  expect(errors).toEqual([]);
});

// buildQuestData test-sav: FMTU prepoznavanje + oblik metapodataka, bez prave prijave.
test('auth R1: buildQuestData recognizes FMTU and shapes metadata', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof SokratAuth !== 'undefined' && !!SokratAuth.buildQuestData);

  const out = await page.evaluate(() => {
    const b = SokratAuth.buildQuestData;
    return {
      fmtuShort: b('student', 'FMTU', true).is_fmtu,
      fmtuFull: b('student', 'Fakultet za menadžment u turizmu i ugostiteljstvu', false).is_fmtu,
      fmtuCity: b('student', 'faks u Opatiji', false).is_fmtu,
      notFmtu: b('student', 'FER Zagreb', false).is_fmtu,
      empty: b(undefined, '', undefined),
      consent: b('pupil', 'Gimnazija Rijeka', true)
    };
  });

  expect(out.fmtuShort).toBe(true);
  expect(out.fmtuFull).toBe(true);
  expect(out.fmtuCity).toBe(true);
  expect(out.notFmtu).toBe(false);
  // Prazan/preskocen unos: valjan biljeg (role fallback 'other', pristanak false)
  expect(out.empty.acct_type).toBe('other');
  expect(out.empty.mail_consent).toBe(false);
  expect(out.empty.questionnaire_done).toBe(true);
  expect(out.consent.acct_type).toBe('pupil');
  expect(out.consent.mail_consent).toBe(true);
  expect(out.consent.is_fmtu).toBe(false);
  expect(typeof out.consent.questionnaire_at).toBe('string');
});

test('auth: 5xx na /recover daje ljudsku poruku, nikad serializirani JSON', async ({ page }) => {
  // Leonov nalaz 2026-09-02: SMTP pao → GoTrue vratio 500 s PRAZNIM JSON tijelom →
  // supabase-js slozi message "{}" → korisnik vidio doslovno "{}" u crvenom.
  // Mock drzi rub deterministicnim (ne ovisi o stvarnom stanju SMTP-a).
  await page.route('**/auth/v1/recover*', (route) => route.fulfill({
    status: 500, contentType: 'application/json', body: '{}'
  }));

  await page.goto('/');
  const btn = page.locator('#authNavBtn');
  let cdnOk = true;
  try { await btn.waitFor({ state: 'visible', timeout: 15000 }); } catch (e) { cdnOk = false; }
  test.skip(!cdnOk, 'supabase-js CDN unreachable — auth disabled by design');

  await btn.click();
  await page.click('#authForgotLink');
  await page.fill('#authForgotEmail', 'nepostojeci@example.com');
  await page.click('#authForgotForm button[type="submit"]');

  const status = page.locator('#authStatus');
  await expect(status).toBeVisible();
  await expect(status).toHaveClass(/is-error/);
  const text = (await status.textContent()).trim();
  expect(text.length).toBeGreaterThan(10);            // prava recenica, ne fragment
  expect(text).not.toMatch(/^[\[{]|\[object/);        // nikad JSON/objekt kao poruka
});
