// F2/1 ① — TEMA PRATI RAČUN (STAGING): izbor ide u `user_metadata.theme` i vraća se iz njega.
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// `tests/unit/theme-account.test.js` čuva PONAŠANJE uz lažni `SokratAuth`. Ono što pješčanik
// ne može reći: da pravi GoTrue `updateUser({ data })` ključ STAPA s ostatkom metapodataka
// (a ne briše ime i upitnik), da ga vraća u sesiji, i da pravi `onAuthStateChange` stigne na
// vrijeme da temu promijeni poslije prvog kadra. Leonov kriterij: „korisnik postavi temu na
// jednom uređaju i zatekne ju na drugom čim se prijavi" — drugi uređaj je ovdje ista sesija
// s obrisanim lokalnim izborom.
//
// ⚠️ Tamni uređaj + izbor `academic` NAMJERNO: prvi kadar (boot.js, uređaj) je `carbon`, pa
//    se vidi da je temu donio RAČUN. A `academic` je ono što svi ostali prijavljeni specovi
//    ionako vide (svijetli uređaj), pa im usporedna vrtnja ne mijenja ništa dok je upisan.
// ⚠️ PIŠE u `user_metadata` i VRAĆA zatečenu vrijednost. Samo STAGING (pravilo #8).
// ⚠️ Odjava se ovdje NE vozi: `signOut()` je u supabase-js zadano GLOBALAN i opozvao bi
//    dijeljenu sesiju (`tests/.auth/admin.json`) svim ostalim specovima. Brisanje izbora pri
//    odjavi čuva unit-test (događaj `SIGNED_OUT`).
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

test.use({ colorScheme: 'dark' });

const tema = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const temaNaPosluzitelju = (page) => page.evaluate(async () => {
  const r = await SokratAuth.getClient().auth.getUser();
  return ((r.data && r.data.user && r.data.user.user_metadata) || {}).theme;
});

test('① izbor u profilu ide u račun, a na „drugom uređaju" ga račun vrati', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() => typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser(), null, { timeout: 20000 });

  const staro = await page.evaluate(() => {
    const m = SokratAuth.getUser().user_metadata || {};
    return { theme: m.theme === undefined ? null : m.theme, name: m.display_name || null };
  });

  try {
    await ucitajPakete(page, ['profile']);
    await page.evaluate(() => navigateTo('profile'));
    await page.waitForSelector('#profileContent [data-theme-pick="academic"]', { timeout: 20000 });

    await page.click('#profileContent [data-theme-pick="academic"]');
    expect(await tema(page), 'klik se primijeni odmah, bez čekanja mreže').toBe('academic');
    await expect.poll(() => temaNaPosluzitelju(page), { timeout: 15000, message: 'izbor nije stigao u račun' })
      .toBe('academic');

    // Stapanje, ne prepisivanje: ime (i sve ostalo u metapodacima) mora preživjeti upis teme.
    const imePoslije = await page.evaluate(() => (SokratAuth.getUser().user_metadata || {}).display_name || null);
    expect(imePoslije, 'upis teme je obrisao ostale metapodatke').toBe(staro.name);

    // „Drugi uređaj": isti račun, ništa zapamćeno lokalno.
    await page.evaluate(() => {
      localStorage.removeItem('sokrat-theme');
      localStorage.removeItem('sokrat-theme-chosen');
    });
    await page.reload();
    await expect.poll(() => tema(page), { timeout: 20000, message: 'račun nije pregazio temu uređaja' })
      .toBe('academic');
    const lokalno = await page.evaluate(() => [localStorage.getItem('sokrat-theme'), localStorage.getItem('sokrat-theme-chosen')]);
    expect(lokalno, 'tema iz računa mora ući i u prvi kadar sljedećeg ulaska (s biljegom)').toEqual(['academic', '1']);
    expect(await page.evaluate(() => getThemeChoice()), 'birač mora vidjeti izbor, ne „Automatski"').toBe('academic');
  } finally {
    // Vrati zatečeno stanje računa i kad tvrdnja padne — `null` = „račun nema teme" (kao prije F2/1).
    await page.evaluate(async (t) => {
      await SokratAuth.getClient().auth.updateUser({ data: { theme: t } });
    }, staro.theme);
  }
});
