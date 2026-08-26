// ===== P2 (POLICA) — jedna polica, dva izvora =====
//
// Tvrdnja cigle: „na jednom mjestu vidim sve što učim, bez obzira odakle je došlo."
// Ovdje se mjeri DRUGI izvor (skinuti predmeti iz kataloga); prvi (vlastito gradivo)
// ima svoje testove i traži prijavu.
//
// ⚠️ NAJVAŽNIJA TVRDNJA JE ONA O ODJAVLJENOM POSJETITELJU. Do P2 je `#materials-page`
// odjavljenom pokazivala isključivo poziv na prijavu. Skinuto je stvar UREĐAJA, ne
// računa — polica koja bi ga sakrila iza prijave lagala bi o tome čije je.
//
// Neovisan o podacima: ne tvrdi koliko predmeta postoji ni koliki su; sam skida jedan
// i mjeri protiv modula.

const { test, expect } = require('@playwright/test');

const PREDMET = 'statistics';

async function ocistiUredaj(page) {
  await page.evaluate(async () => {
    window.localStorage.removeItem('sokrat-offline-v1');
    if (window.caches) await window.caches.delete('sokrat-offline');
  });
}

test.describe('P2 · polica s dva izvora', () => {
  test('odjavljen posjetitelj: polica postoji i objašnjava se kad je prazna', async ({ page }) => {
    await page.goto('/#/materials');
    await page.waitForFunction(() => !!window.SokratOffline);
    await ocistiUredaj(page);
    await page.evaluate(() => window.navigateTo('landing'));
    await page.evaluate(() => window.navigateTo('materials'));

    // Polica je vidljiva BEZ prijave…
    await expect(page.locator('#shelfCard')).toBeVisible();
    // …a poziv na prijavu i dalje stoji, jer se tiče DRUGOG izvora (vlastitog gradiva).
    await expect(page.locator('#materialsSignedOut')).toBeVisible();
    // Prazno stanje mora objasniti, ne šutjeti.
    await expect(page.locator('#shelfList .shelf-empty')).toBeVisible();
    await expect(page.locator('#shelfList .shelf-tile')).toHaveCount(0);
  });

  test('skinut predmet se pojavi na polici s imenom, veličinom i stanjem učenja', async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await ocistiUredaj(page);
    await page.reload();
    await page.waitForSelector('#offlineControl .offline-btn');

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    await page.evaluate(() => window.navigateTo('materials'));

    const plocica = page.locator('#shelfList .shelf-tile[data-shelf-id="' + PREDMET + '"]');
    await expect(plocica).toHaveCount(1);

    // Ime dolazi iz kataloga, ne iz id-a.
    const ocekivano = await page.evaluate((id) => SokratCatalog.getSubject(id).name, PREDMET);
    await expect(plocica.locator('.shelf-tile__name')).toHaveText(ocekivano);

    // Poveznica je PRAVA adresa (K1) — dijeljiva, otvoriva u novoj kartici.
    await expect(plocica.locator('.shelf-tile__name')).toHaveAttribute('href', '#/subject/' + PREDMET);

    // Meta nosi veličinu i stanje učenja („još nedirnuto", jer ništa nije učeno).
    await expect(plocica.locator('.shelf-tile__meta')).toContainText(/\d+\s?(B|KB|MB)/);
  });

  test('polica vodi u predmet — poveznica stvarno otvara njegove lekcije', async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await ocistiUredaj(page);
    await page.reload();
    await page.waitForSelector('#offlineControl .offline-btn');
    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    await page.evaluate(() => window.navigateTo('materials'));
    await page.locator('#shelfList .shelf-tile__name').first().click();

    await expect(page.locator('#lessons-page')).toHaveClass(/active/);
    await expect(page.locator('#lessonsGrid .lesson-card').first()).toBeVisible();
  });

  test('uklanjanje s POLICE briše i bajtove — ista radnja kao na stranici predmeta', async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await ocistiUredaj(page);
    await page.reload();
    await page.waitForSelector('#offlineControl .offline-btn');
    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    await page.evaluate(() => window.navigateTo('materials'));
    await page.locator('#shelfList [data-shelf-remove]').first().click();

    await expect(page.locator('#shelfList .shelf-tile')).toHaveCount(0, { timeout: 15000 });
    await expect(page.locator('#shelfList .shelf-empty')).toBeVisible();

    // Bajtovi, ne samo redak: polica koja obriše prikaz a ostavi keš je najgori ishod —
    // korisnik misli da je oslobodio prostor.
    const ostalo = await page.evaluate(async (id) => {
      const cache = await window.caches.open(window.SokratOffline.CACHE);
      const plan = window.SokratOffline.plan(id);
      let n = 0;
      for (const u of plan) { if (await cache.match(u)) n++; }
      return n;
    }, PREDMET);
    expect(ostalo).toBe(0);
  });
});
