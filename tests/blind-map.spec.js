// F3 3D.1 — blind-map slika (WebP + PNG fallback). Dokazuje da se karta STVARNO dekodira
// (smoke.spec dotiče sekciju ali filtrira resource-greške → ne bi uhvatio pokvarenu sliku).
// Chromium (Playwright) podržava WebP → očekujemo da primarni put (.webp) uspije, ne fallback.
const { test, expect } = require('@playwright/test');

test('blind-map: WebP karta se učita i dekodira (Tourism Geography)', async ({ page }) => {
  const requested = [];
  page.on('request', (r) => { if (/blind-map\.(webp|png)/.test(r.url())) requested.push(r.url()); });

  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);

  // Geography je predmet s features.blindMap; nađi ga iz catalog-a (ne hardkodiraj lekciju).
  const target = await page.evaluate(() => {
    const s = window.SOKRAT_CATALOG.subjects.find((x) => x.features && x.features.blindMap);
    if (!s) return null;
    const lesson = (s.lessons || []).find((l) => window.SokratCatalog.resolveDataVar(s.id, l.id));
    return lesson ? { id: s.id, lesson: lesson.id } : null;
  });
  expect(target, 'predmet s blindMap postoji u catalog-u').not.toBeNull();

  await page.evaluate((t) => window.navigateTo('study', { subject: t.id, lesson: t.lesson }), target);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id), target.id, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('blind-map'));

  // Slika se učita asinkrono (new Image().onload → window._blindMapImg). Čekaj stvarni decode.
  await page.waitForFunction(
    () => window._blindMapImg && window._blindMapImg.complete && window._blindMapImg.naturalWidth > 0,
    null,
    { timeout: 15000 }
  );

  const info = await page.evaluate(() => ({
    src: window._blindMapImg.currentSrc || window._blindMapImg.src,
    w: window._blindMapImg.naturalWidth,
    h: window._blindMapImg.naturalHeight,
  }));

  // Primarni put je WebP (Chromium ga podržava) — fallback na .png se NE bi smio okinuti.
  expect(info.src).toContain('blind-map.webp');
  expect(info.w).toBe(1536);          // dimenzije očuvane (koordinate blind-mapa ovise o njima)
  expect(info.h).toBe(1024);
  expect(info.src).toContain('?v=');  // cache-token prisutan (bio je izostavljen prije 3D)
  // Fallback .png NIJE zatražen (WebP je uspio iz prve)
  expect(requested.some((u) => /blind-map\.png/.test(u))).toBe(false);
});

// F3/2 cigla 2: slijepa karta na hrvatskom sučelju — bez engleskog ostatka, i poruke koje ovise
// o STANJU (koordinate) precrtaju se na promjenu jezika. Imena mjesta su gradivo i ostaju (ADR-012).
// Obrnuto provjereno: na starom markupu pada na naslovu; bez kuke u `applyTranslations` pada na
// koordinatama poslije prekidača.
test('F3/2: slijepa karta na hrvatskom — bez engleskog ostatka, koordinate prate jezik', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sokrat-cookie-consent', 'denied');
    if (!sessionStorage.getItem('f3-lang-set')) {
      localStorage.setItem('sokrat-ui-lang', 'hr');
      sessionStorage.setItem('f3-lang-set', '1');
    }
  });
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection && window.getUiLang);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');

  const target = await page.evaluate(() => {
    const s = window.SOKRAT_CATALOG.subjects.find((x) => x.features && x.features.blindMap);
    if (!s) return null;
    const lesson = (s.lessons || []).find((l) => window.SokratCatalog.resolveDataVar(s.id, l.id));
    return lesson ? { id: s.id, lesson: lesson.id } : null;
  });
  expect(target, 'predmet s blindMap postoji u catalog-u').not.toBeNull();
  await page.evaluate((t) => window.navigateTo('study', { subject: t.id, lesson: t.lesson }), target);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id), target.id, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('blind-map'));
  await page.waitForFunction(() => document.getElementById('mapTaskName').textContent.trim().length > 0, null, { timeout: 15000 });

  const karta = page.locator('#blind-map');
  await expect(karta.locator('h1')).toHaveText('Interaktivna slijepa karta');
  await expect(karta.locator('.map-diff-btn[data-level="cities"]')).toHaveText('Gradovi');
  await expect(page.locator('#mapCoords')).toHaveText('Nijedno mjesto nije odabrano');
  // zadatak = SAMO ime mjesta (do F3/2 je pisalo „Click on the location of: Find: Zagreb")
  await expect(page.locator('#mapTaskName')).not.toHaveText(/Find|Pronađi/);

  // Nijedan engleski ostatak u vidljivom tekstu sekcije.
  const vidljivo = await karta.evaluate((el) => el.innerText);
  for (const en of ['Interactive Blind Map', 'Click on the map', 'Cities', 'Islands', 'National Parks',
    'Nature Parks', 'Regions', 'Click on the location of', 'No location selected', 'Submit', 'Clear',
    'Skip', 'Progress:', 'Score:', 'pts', 'Loading']) {
    expect(vidljivo, `engleski ostatak „${en}" na hrvatskoj karti`).not.toContain(en);
  }

  // Predaja bez odabira → toast na hrvatskom.
  await page.evaluate(() => window.submitMapAnswer());
  await expect(page.locator('#toastMessage')).toHaveText('Najprije klikni na karti i odaberi mjesto');

  // Klik na kartu → koordinate na hrvatskom; prekidač → precrtane na engleski iz stanja.
  const platno = page.locator('#blindMapCanvas');
  await platno.scrollIntoViewIfNeeded();
  await platno.click({ position: { x: 40, y: 40 } });
  await expect(page.locator('#mapCoords')).toHaveText(/^Odabrano: X=\d+, Y=\d+$/);
  await page.evaluate(() => window.toggleUiLang());
  await expect(page.locator('#mapCoords')).toHaveText(/^Clicked: X=\d+, Y=\d+$/);
  await expect(karta.locator('h1')).toHaveText('Interactive Blind Map');

  // Predaja → poruka na engleskom sad, s imenom mjesta, bez HTML-a iz podatka.
  await page.evaluate(() => window.submitMapAnswer());
  await expect(page.locator('#feedbackMessage')).toHaveText(/(Correct! That's .+!|That's not right\. .+ is elsewhere\. \(\d+px off\))/);
  expect(await page.locator('#feedbackMessage i').count(), 'ikona poruke ostaje element').toBe(1);

  // Kartica napretka na hrvatskom.
  await page.evaluate(() => window.toggleUiLang());
  await page.evaluate(() => window.switchSection('progress'));
  const kartica = page.locator('#blindMapProgressSection');
  await expect(kartica).toBeVisible();
  await expect(kartica.locator('h3')).toHaveText('Slijepa karta');
  await expect(kartica).toContainText('Točnost:');
  await expect(kartica).toContainText('Pokušaja:');
  await expect(kartica).toContainText('Bodovi:');
});
