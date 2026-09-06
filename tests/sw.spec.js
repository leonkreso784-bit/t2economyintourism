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

// ── BUG-045 (2026-09-06) — RUNTIME KEŠ STVARNO PUNI ─────────────────────────────
// Do popravka je `spremi()` klonirao odgovor unutar `.then(caches.open)` — prekasno, tijelo je
// stranica već potrošila, `clone()` je bacao „body is already used", a `.catch(() => {})` to gutao.
// Posljedica: SW od F3 3A NIJE spremio nijedan runtime asset; u kešu je stajao samo precache s
// instalacije, a „offline radi" je značilo „HTTP-keš preglednika još ima datoteke". iOS ga
// izbacuje → skinut predmet se otvarao prazan (paket načina učenja nije imao odakle doći).
// Tvrdnja mjeri KEŠ, ne dojam: poslije zahtjeva stranice skripta MORA biti u SW-kešu.
// Obrnuto (sw.js prije popravka, isti test): keš ostaje na 4 precache unosa → crveno.
test('BUG-045: SW stvarno spremi skriptu koju stranica zatraži (klon prije `caches.open`)', async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 10000 });
  const ver = await page.evaluate(() => window.CONTENT_VERSION);
  expect(ver, 'CONTENT_VERSION mora postojati (isti token kao ?v=)').toBeTruthy();
  // dva puta kojima stranica traži skripte: fetch() (cors) i <script src> (no-cors) — oba idu kroz SW
  await page.evaluate(async (v) => { await fetch('js/quiz.js?v=' + v); }, ver);
  await page.evaluate((v) => new Promise((res) => {
    const s = document.createElement('script'); s.src = 'js/fill-blanks.js?v=' + v;
    s.onload = () => res(1); s.onerror = () => res(0); document.head.appendChild(s);
  }), ver);
  await expect.poll(async () => await page.evaluate(async () => {
    const imena = await caches.keys();
    const app = imena.find((k) => k.startsWith('sokrat-cache-'));
    if (!app) return [];
    const ks = await (await caches.open(app)).keys();
    return ks.map((k) => k.url.split('/').slice(3).join('/').split('?')[0]).filter((u) => /^js\/(quiz|fill-blanks)\.js$/.test(u)).sort();
  }), { message: 'runtime keš SW-a mora sadržavati obje skripte koje je stranica zatražila', timeout: 8000 }).toEqual(['js/fill-blanks.js', 'js/quiz.js']);
});
