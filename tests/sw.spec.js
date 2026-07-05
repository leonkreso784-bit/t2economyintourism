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

// F3 3A.3 — update-flow: novi SW čeka → toast „nova verzija" → dodir → skipWaiting → JEDAN reload.
// Pravi update simuliramo registracijom ISTOG sw.js pod drugim URL-om (isti scope → browser ga
// tretira kao novu verziju: installing → installed → waiting, jer stari još kontrolira stranicu).
// To okida updatefound na ISTOJ registraciji koju sw-register.js prati → cijeli lanac je stvaran.
test('SW update-flow: toast „nova verzija" → dodir → novi SW preuzme + reload (F3 3A.3)', async ({ page }) => {
  // Consent unaprijed — fiksni cookie-banner ne smije presresti dodir na toast.
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/index.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // clients.claim() postavi kontrolora bez reloada — uvjet da update-prompt uopće smije nastati
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 10000 });

  // „Deploy": ista skripta pod novim URL-om = nova verzija SW-a za isti scope
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?u=2', { updateViaCache: 'none' }));

  // sw-register.js (updatefound → installed uz postojećeg kontrolora) pokaže dodirljiv toast
  const toast = page.locator('#toast');
  await expect(toast).toHaveClass(/show/, { timeout: 15000 });
  await expect(toast).toHaveClass(/toast--action/);

  // VAŽNO (guard): prije dodira NEMA spontanog reloada — novi SW strpljivo čeka
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  // Dodir → sw:skipWaiting → controllerchange → točno jedan reload
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }),
    toast.click(),
  ]);

  // Nakon reloada: stranica pod kontrolom SW-a, app-shell normalno radi
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 10000 });
  await expect(page.locator('#landing-page')).toBeVisible();
});
