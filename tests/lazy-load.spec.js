// A4 lazy loading: subject content (data-*.js) must NOT load at startup, only on demand
// when a subject's study page opens. Proves the payload win + the backend seam.
const { test, expect } = require('@playwright/test');

test('subject content loads on demand, not at startup', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.loadSubjectContent && window.navigateTo);

  // 1) At startup, no SUBJECT CONTENT scripts load. Allowed eager data scripts (catalog +
  //    landing-stats meta) are not subject content — exclude them.
  const dataScriptsAtStart = await page.evaluate(() =>
    Array.from(document.scripts)
      .map((s) => s.getAttribute('src') || '')
      .filter((src) => /data[-/]/.test(src) && !/catalog|landing-stats/.test(src))
  );
  expect(dataScriptsAtStart).toEqual([]);

  // 2) Heavy data globals are undefined before opening any subject.
  const before = await page.evaluate(() => ({
    ebiz: typeof window.ebusinessM1,
    te2: typeof window.te2M1,
    bi: typeof window.businessInformaticsM1,
  }));
  expect(before).toEqual({ ebiz: 'undefined', te2: 'undefined', bi: 'undefined' });

  // 3) Open E-Business → its content loads on demand and renders.
  await page.evaluate(() => window.navigateTo('study', { subject: 'ebusiness', lesson: 'first-midterm' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded('ebusiness'), { timeout: 15000 });
  expect(await page.evaluate(() => typeof window.ebusinessM1)).toBe('object');
  expect(await page.evaluate(() => typeof window.ebusinessFinal)).toBe('object');
  await page.waitForSelector('#learn .learn-card', { state: 'attached', timeout: 10000 });

  // 4) Subjects we did NOT open are still not loaded (only on-demand).
  expect(await page.evaluate(() => typeof window.te2M1)).toBe('undefined');
  expect(await page.evaluate(() => window.isSubjectContentLoaded('te2'))).toBe(false);

  expect(errors).toEqual([]);
});
