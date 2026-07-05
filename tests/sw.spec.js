// Service Worker (F3 3A) — registracija, aktivacija, kontrola, offline app-shell.
// localhost je secure-context → SW radi u Playwrightu.
const { test, expect } = require('@playwright/test');

// Ovaj spec JEDINI dopušta Service Worker (globalni config ga blokira za app-testove).
test.use({ serviceWorkers: 'allow' });

test('SW se registrira i aktivira, kontrolira stranicu nakon reloada', async ({ page }) => {
  await page.goto('/index.html');
  const hasActive = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;   // resolva kad postoji aktivan SW za scope
    // `ready` može resolvati dok je stanje još 'activating' (prelazi u 'activated') — oboje = aktivan.
    return !!reg.active && ['activating', 'activated'].includes(reg.active.state);
  });
  expect(hasActive).toBe(true);

  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 10000 });
  const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
  expect(controlled).toBe(true);
});

test('app-shell se učita OFFLINE iz keša (SW cache-first fallback)', async ({ page, context }) => {
  // 1) online load → SW se aktivira i preuzme kontrolu
  await page.goto('/index.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // 2) kontrolirani reload zagrije keš (js/css/json preko stale-while-revalidate)
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // pusti fire-and-forget cache.put da dovrši
  // 3) OFFLINE reload → shell mora doći iz keša
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#landing-page')).toBeVisible();
  // hero naslov (iz keširanog index.html + css) vidljiv = shell renderiran offline
  await expect(page.locator('.hero-title')).toBeVisible();
  await context.setOffline(false);
});
