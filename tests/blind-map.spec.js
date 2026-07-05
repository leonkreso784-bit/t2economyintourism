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
