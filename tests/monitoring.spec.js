// SokratMonitor (Faza 2, cigla 2E): error monitoring, consent-gated, SAFE NO-OP bez DSN-a.
// Dokazuje: postoji API · prije pristanka odbacuje · pristanak ga uključi · bez DSN-a ništa
// se ne učita/šalje · NIKAD ne baca · consent.js "Accept" ga ožiči.
const { test, expect } = require('@playwright/test');

test('SokratMonitor: API + no-DSN no-op + consent gate + never throws', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.addInitScript(() => { try { localStorage.removeItem('sokrat-cookie-consent'); } catch (e) {} });
  await page.goto('/');
  await page.waitForFunction(() => window.SokratMonitor);

  // API prisutan + bez DSN-a (nije konfiguriran)
  const s0 = await page.evaluate(() => ({
    api: ['captureException', 'enable', 'disable', 'status'].every((m) => typeof window.SokratMonitor[m] === 'function'),
    st: window.SokratMonitor.status(),
  }));
  expect(s0.api).toBe(true);
  expect(s0.st.hasDsn).toBe(false);
  expect(s0.st.release).toContain('sokrat-study@');

  // captureException PRIJE pristanka → odbaci, ne baca, ništa ne buffera
  const r1 = await page.evaluate(() => {
    window.SokratMonitor.captureException(new Error('test-precon'));
    return window.SokratMonitor.status();
  });
  expect(r1.enabled).toBe(false);
  expect(r1.buffered).toBe(0);

  // pristanak → enable(); bez DSN-a i dalje no-op (ništa se ne učita/buffera)
  const r2 = await page.evaluate(() => {
    window.SokratMonitor.enable();
    window.SokratMonitor.captureException(new Error('test-postcon'));
    return window.SokratMonitor.status();
  });
  expect(r2.enabled).toBe(true);
  expect(r2.hasDsn).toBe(false);
  expect(r2.sentryReady).toBe(false);
  expect(r2.buffered).toBe(0);

  // nijedna Sentry skripta nije ubačena (jer nema DSN-a)
  const sentryScripts = await page.evaluate(() =>
    Array.from(document.scripts).filter((s) => /sentry/i.test(s.src)).length);
  expect(sentryScripts).toBe(0);

  expect(errors).toEqual([]);
});

test('consent "Accept" wires SokratMonitor.enable (end-to-end)', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.removeItem('sokrat-cookie-consent'); } catch (e) {} });
  await page.goto('/');
  await page.waitForSelector('#cookieAccept', { timeout: 8000 });
  await page.click('#cookieAccept');
  const st = await page.evaluate(() => window.SokratMonitor.status());
  expect(st.enabled).toBe(true);  // applyConsent(true) → SokratMonitor.enable()
  expect(st.hasDsn).toBe(false);  // i dalje no-op dok nema DSN-a
});
