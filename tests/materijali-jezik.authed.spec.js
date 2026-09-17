// F3/2 cigla 4d — „MOJI MATERIJALI" NA JEZIKU SUČELJA (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Stablo, traka („+ Novo") i polica crtaju se JS-om iz već učitanih podataka, pa ih `applyTranslations`
// ne dohvaća. Brana `check:i18n` ovdje ne vidi ništa (svaki tekst ima ključ) — kvar je PONAŠANJE:
//  ① na prekidač jezika stranica je ostajala na starom jeziku sve do sljedećeg otvaranja; a ime koje
//    korisnik upravo upisuje u novu policu ne smije pritom nestati;
//  ② prozor „Premjesti u…" gradi se jednom, pa je „Odustani" ostajao na jeziku prvog otvaranja.
//
// ⚠️ ① NE UPISUJE ništa (unos se odbaci Escapeom). ② stvori JEDNU privremenu policu (mora postojati
//    redak na kojem se prozor otvara, a test ne smije ovisiti o tuđim podacima) i obriše je u `finally`.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');
const { radnjaRetka, novo } = require('./helpers/izbornik-retka');

async function openMaterials(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => !!window.SokratMaterials && window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

const kljuc = (page, k) => page.evaluate((x) => t(x), k);

test.describe('F3/2 cigla 4d — Moji materijali prate jezik', () => {
  test('① prekidač precrta traku, unos i policu odmah — upisano ime ostaje', async ({ page }) => {
    await openMaterials(page);
    expect(await page.evaluate(() => window.getUiLang())).toBe('en');

    await novo(page, 'folder');
    const unos = page.locator('#myMaterials [data-mm-input]');
    await expect(unos).toBeVisible();
    await unos.fill('napola upisano ime');

    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    const novoHr = await kljuc(page, 'materials.new');
    expect(novoHr, 'ključ mora imati hrvatski, inače tvrdnja ništa ne mjeri').not.toBe('New');

    await expect(page.locator('#myMaterials .mm-bar > [data-mm-more] span'), 'traka nije precrtana').toHaveText(novoHr);
    await expect(unos, 'unos je nestao na prekidač').toBeVisible();
    await expect(unos).toHaveValue('napola upisano ime');
    await expect(unos, 'unos nije precrtan').toHaveAttribute('placeholder', await kljuc(page, 'materials.phFolder'));
    await expect(page.locator('#shelfList .shelf-empty'), 'polica nije precrtana').toHaveText(await kljuc(page, 'shelf.empty'));

    await unos.press('Escape');   // odbaci — ništa se ne sprema
    await expect(unos).toHaveCount(0);
  });

  test('③ palo učitavanje: prekidač crta GREŠKU na novom jeziku, ne prazno stanje', async ({ page }) => {
    // Čitanje stabla (GET /rest/v1/nodes) pada — upisi se ne diraju.
    await page.route(/\/rest\/v1\/nodes\?/, (r) => (r.request().method() === 'GET'
      ? r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'brana 4d', code: 'XX000' }) })
      : r.continue()));
    await openMaterials(page);
    const naslov = page.locator('#myMaterials .mm-state-title');
    await expect(naslov).toHaveText(await kljuc(page, 'materials.errLoad'));
    await expect(page.locator('#myMaterials [data-mm-retry]')).toBeVisible();

    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    const greskaHr = await kljuc(page, 'materials.errLoad');
    expect(greskaHr).not.toBe('Could not load your materials.');
    await expect(naslov, 'greška nije precrtana na novi jezik').toHaveText(greskaHr);
    await expect(page.locator('#myMaterials [data-mm-retry]'), 'prekidač je grešku zamijenio drugim stanjem').toBeVisible();
  });

  test('② „Premjesti u…" otvoren poslije prekidača je na novom jeziku', async ({ page }) => {
    await openMaterials(page);
    const F = await page.evaluate(() => window.SokratMaterials.createNode(null, 'folder', 'F3-4d premjesti ' + Date.now()));
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const red = page.locator('#myMaterials .mm-row[data-mm-id="' + F + '"]');
      await expect(red).toBeVisible();
      const prozor = page.locator('#mmMoveModal');
      const odustani = prozor.locator('[data-mm-move-cancel] span');

      await radnjaRetka(red, '[data-mm-move]');
      await expect(prozor).toBeVisible();
      await expect(odustani).toHaveText('Cancel');
      await prozor.locator('[data-mm-move-cancel]').click();
      await expect(prozor).toBeHidden();

      await page.evaluate(() => window.toggleUiLang());
      await radnjaRetka(red, '[data-mm-move]');
      await expect(prozor).toBeVisible();
      await expect(odustani, '„Odustani" je ostao na jeziku prvog otvaranja').toHaveText(await kljuc(page, 'materials.cancel'));
      await expect(prozor.locator('#mmMoveTitle')).toHaveText(await kljuc(page, 'materials.move'));
      await prozor.locator('[data-mm-move-cancel]').click();
    } finally {
      await page.evaluate((id) => window.SokratMaterials.deleteNode(id).catch(() => {}), F);
    }
  });
});
