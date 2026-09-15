// F2/4 — OBAVIJESTI MAILOM na profilu (STAGING): prekidač pristanka i admin-forma.
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Leon (anketa 15.09.): prekidač u profilu + forma u admin-kartici. Tvrdi se kroz PRAVI GoTrue i
// PRAVU funkciju na stagingu (poslužitelj presuđuje, sučelje samo prenosi):
//   ① prekidač upiše PRAVI boolean u `user_metadata.mail_consent` (+ vrijeme i izvor), u oba
//     smjera, a pristupačno ime nosi naslov I stanje;
//   ② admin-forma pokaže broj primatelja, broj se mijenja sa segmentom, a „Pošalji" je ugašen kad
//     nema kome; loša poveznica → poruka POSLUŽITELJA (ništa poslano).
// Stvarno slanje mjeri `npm run test:mail` (uz potvrđeno preusmjeravanje) — ovdje se NE šalje.
//
// ⚠️ PIŠE u `user_metadata` dijeljenog test-računa i VRAĆA zatečeno u `finally`.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');
const { skenirajSveTeme } = require('./helpers/axe-gate');

async function naProfilu(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); localStorage.setItem('sokrat-ui-lang', 'hr'); } catch (e) { /* private */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser());
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#profileMailSwitch', { timeout: 20000 });
}

const svjeze = (page) => page.evaluate(async () => {
  const r = await SokratAuth.getClient().auth.getUser();
  const m = (r.data && r.data.user && r.data.user.user_metadata) || {};
  return { consent: m.mail_consent, via: m.mail_consent_via, at: m.mail_consent_at };
});

test('① prekidač upisuje pravi boolean u račun, u oba smjera; ime = naslov + stanje', async ({ page }) => {
  await naProfilu(page);
  const zateceno = await page.evaluate(() => {
    const m = SokratAuth.getUser().user_metadata || {};
    return { c: m.mail_consent === undefined ? null : m.mail_consent, a: m.mail_consent_at || null, v: m.mail_consent_via || null };
  });
  try {
    const sw = page.locator('#profileMailSwitch');
    const bilo = (await sw.getAttribute('aria-checked')) === 'true';
    await sw.click();
    await expect.poll(() => svjeze(page).then((x) => x.consent), { timeout: 15000, message: 'izbor nije stigao u račun' }).toBe(!bilo);
    const s1 = await svjeze(page);
    expect(typeof s1.consent, 'pristanak mora biti PRAVI boolean (poslužitelj traži === true)').toBe('boolean');
    expect(s1.via).toBe('profile');
    expect(Date.parse(s1.at)).toBeGreaterThan(Date.now() - 120000);

    // profil se poslije USER_UPDATED crta iznova — prekidač mora pokazivati ono što račun kaže
    await expect(page.locator('#profileMailSwitch')).toHaveAttribute('aria-checked', String(!bilo));
    const ime = await page.locator('#profileMailSwitch').evaluate((el) =>
      el.getAttribute('aria-labelledby').split(' ').map((id) => document.getElementById(id).textContent.trim()).join(' '));
    expect(ime).toContain('Obavijesti mailom');
    expect(ime).toContain(!bilo ? 'Uključeno' : 'Isključeno');

    await page.locator('#profileMailSwitch').click();
    await expect.poll(() => svjeze(page).then((x) => x.consent), { timeout: 15000 }).toBe(bilo);
  } finally {
    await page.evaluate(async (z) => {
      await SokratAuth.getClient().auth.updateUser({ data: { mail_consent: z.c, mail_consent_at: z.a, mail_consent_via: z.v } });
    }, zateceno);
  }
});

test('② admin-forma: broj primatelja po segmentu, „Pošalji" ugašen bez primatelja, loša poveznica = poruka poslužitelja', async ({ page }) => {
  await naProfilu(page);
  const gumb = page.locator('[data-mail-admin]');
  await expect(gumb, 'admin-kartica mora ponuditi „Pošalji obavijest"').toBeVisible({ timeout: 20000 });
  await gumb.click();

  const card = page.locator('#mailAdminModal .mail-admin__card');
  await expect(card).toBeVisible();
  await expect(page.locator('#mailCount')).toHaveText(/^\d+$/, { timeout: 20000 });
  const fmtu = Number(await page.locator('#mailCount').textContent());
  await expect(page.locator('#mailSend')).toBeDisabled({ timeout: 1000 }).catch(() => {});
  if (fmtu === 0) await expect(page.locator('#mailSend'), '„Pošalji" mora biti ugašen kad nema kome').toBeDisabled();

  await page.check('#mailAdminModal input[name="mailSeg"][value="all"]');
  await expect(page.locator('#mailCount')).toHaveText(/^\d+$/, { timeout: 20000 });
  const svi = Number(await page.locator('#mailCount').textContent());
  expect(svi, '„svi s pristankom" ne može imati manje primatelja od FMTU-a').toBeGreaterThanOrEqual(fmtu);
  if (svi > 0) await expect(page.locator('#mailSend')).toContainText('(' + svi + ')');

  await page.fill('#mailSubject', 'Proba');
  await page.fill('#mailText', 'Tekst');
  await page.fill('#mailUrl', 'https://evil.io/');
  await page.click('#mailTest');
  await expect(page.locator('#mailStatus')).toHaveClass(/is-error/, { timeout: 20000 });
  await expect(page.locator('#mailStatus')).toContainText('sokratstudy.com');

  await page.keyboard.press('Escape');
  await expect(card).toBeHidden();
});

// Nove plohe F2/4 (prekidač u postavkama i otvoren prozor) — axe u svih pet tema.
test('③ a11y: kartica „Obavijesti mailom" i otvoren prozor obavijesti, 5 tema', async ({ page }) => {
  test.setTimeout(240000);
  await naProfilu(page);
  const nalazi = [];
  nalazi.push(...await skenirajSveTeme(page, 'PROFIL/obavijesti'));
  await page.locator('[data-mail-admin]').click();
  await expect(page.locator('#mailCount')).toHaveText(/^\d+$/, { timeout: 20000 });
  nalazi.push(...await skenirajSveTeme(page, 'PROFIL/obavijest-prozor'));
  expect(nalazi).toEqual([]);
});
