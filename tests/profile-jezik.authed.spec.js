// F3/2 cigla 4c — PROFIL NA JEZIKU SUČELJA (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Profil je nacrtan `innerHTML`-om, pa ga prekidač jezika crta iznova (`applyTranslations`). Tri kvara
// koja brana `check:i18n` ne može vidjeti, jer nisu zakucan tekst nego PONAŠANJE:
//  ① prekidač je zatvarao otvorene forme i brisao ono što korisnik piše (opis, nova lozinka, DELETE);
//  ② datum „Član od" uvijek je imao engleski mjesec (`toLocaleDateString('en-GB')`);
//  ③ greška servera pri promjeni lozinke išla je SIROVA na engleskom, mimo prevoditelja iz auth.js.
//
// ⚠️ NIŠTA SE NE UPISUJE: forme se ne spremaju, a ③ šalje TRENUTNU lozinku — poslužitelj takvu odbija
//    (`same_password`), pa se lozinka računa ne mijenja. Procurjele lozinke se ne pitaju (ruta je prazna).
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

const MJESECI_EN = /January|February|March|April|May|June|July|August|September|October|November|December/;

async function naProfilu(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && typeof window.toggleUiLang === 'function');
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#profileContent .profile-wall', { timeout: 20000 });
}

test.describe('F3/2 cigla 4c — profil prati jezik', () => {
  test('① prekidač precrta profil, a otvorene forme i upisano ostaju', async ({ page }) => {
    await naProfilu(page);
    expect(await page.evaluate(() => window.getUiLang())).toBe('en');

    await page.click('#profileEditBtn');
    await page.fill('#profileEditBio', 'napola napisan opis');
    await page.fill('#profileEditHandle', 'napola_ime');
    await page.click('#profileChangePassBtn');
    await page.fill('#profileNewPassword', 'nije-spremljeno-1');
    await page.click('#profileDeleteAccountBtn');
    await page.fill('#profileDeleteConfirm', 'DEL');

    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    const spremi = await page.evaluate(() => t('profile.editSave'));
    expect(spremi, 'ključ mora imati hrvatski, inače tvrdnja ništa ne mjeri').not.toBe('Save');

    await expect(page.locator('#profileEditForm'), 'prekidač je zatvorio „Uredi profil"').toBeVisible();
    await expect(page.locator('#profileEditForm button[type="submit"] span'), 'forma nije precrtana').toHaveText(spremi);
    await expect(page.locator('#profileEditBio')).toHaveValue('napola napisan opis');
    await expect(page.locator('#profileEditHandle')).toHaveValue('napola_ime');
    await expect(page.locator('#profileChangePassForm'), 'prekidač je zatvorio „Promijeni lozinku"').toBeVisible();
    await expect(page.locator('#profileNewPassword')).toHaveValue('nije-spremljeno-1');
    await expect(page.locator('#profileDeleteAccountForm'), 'prekidač je zatvorio brisanje računa').toBeVisible();
    await expect(page.locator('#profileDeleteConfirm')).toHaveValue('DEL');
  });

  test('② „Član od" ima mjesec na jeziku sučelja', async ({ page }) => {
    await naProfilu(page);
    const clan = page.locator('.profile-identity-text .profile-meta:not(.profile-meta--sub)');
    await expect(clan).toHaveText(MJESECI_EN);

    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    await expect(clan, 'engleski mjesec na hrvatskom sučelju').not.toHaveText(MJESECI_EN);
    await expect(clan).toContainText(await page.evaluate(() => t('profile.memberSince').trim()));
  });

  test('③ greška servera pri promjeni lozinke ide kroz prevoditelja, ne sirova', async ({ page }) => {
    const lozinka = process.env.STAGING_TEST_ADMIN_PASSWORD;
    test.skip(!lozinka, 'treba STAGING_TEST_ADMIN_PASSWORD (ista lozinka = poslužitelj odbije, ništa se ne mijenja)');
    await page.route('https://api.pwnedpasswords.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/plain', body: '' }));
    await naProfilu(page);
    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');

    await page.click('#profileChangePassBtn');
    await page.fill('#profileNewPassword', lozinka);
    await page.fill('#profileNewPassword2', lozinka);
    const [odgovor] = await Promise.all([
      page.waitForResponse((r) => /\/auth\/v1\/user(\?|$)/.test(r.url()) && r.request().method() === 'PUT'),
      page.click('#profileChangePassForm button[type="submit"]'),
    ]);
    expect(odgovor.status(), 'ista lozinka mora biti odbijena — inače se ništa nije izmjerilo').toBeGreaterThanOrEqual(400);
    const tijelo = await odgovor.json().catch(() => ({}));
    const sirovo = tijelo.msg || tijelo.message || '';
    const prevedeno = await page.evaluate((b) => SokratAuth.authError({ code: b.error_code, message: b.msg || b.message }), tijelo);
    expect(prevedeno, 'prevoditelj ne zna ovaj kod — tvrdnja ne bi ništa dokazala').not.toBe(sirovo);
    await expect(page.locator('#profilePassStatus'), 'sirova poruka servera').toHaveText(prevedeno);
  });
});
