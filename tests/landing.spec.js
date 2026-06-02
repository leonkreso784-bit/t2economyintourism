// M0.5 landing rebuild: nav, data-driven subject showcase, sections, CTAs, no overflow.
const { test, expect } = require('@playwright/test');

test('landing has nav, dynamic counts, and a data-driven subject showcase', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => window.SOKRAT_CATALOG && document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  const catCount = await page.evaluate(() => window.SOKRAT_CATALOG.subjects.length);

  // Nav present
  await expect(page.locator('.landing-nav')).toBeVisible();

  // Dynamic subject count reflects catalog
  const metaText = await page.$eval('[data-meta="subjectCount"]', (el) => el.textContent.trim());
  expect(metaText).toBe(String(catCount));

  // Subject showcase count matches catalog
  const showcase = await page.$$eval('#landingSubjects .landing-subject-card', (e) => e.length);
  expect(showcase).toBe(catCount);

  // Sections present
  expect(await page.$$eval('#how .how-step', (e) => e.length)).toBe(3);
  expect(await page.$$eval('#modes .mode-card', (e) => e.length)).toBe(5);
  await expect(page.locator('.landing-footer .footer-cols')).toBeVisible();

  // No horizontal overflow on the (now long) landing page
  const vw = page.viewportSize().width;
  const docScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(docScrollW).toBeLessThanOrEqual(vw + 1);

  expect(errors).toEqual([]);
});

test('landing CTAs and showcase navigate correctly', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => window.enterBrowse && document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  // Showcase card → lessons page for that subject
  await page.click('#landingSubjects .landing-subject-card[data-landing-subject="te2"]');
  await page.waitForSelector('#lessons-page.active', { timeout: 5000 });
  const title = (await page.textContent('#currentSubjectTitle')) || '';
  expect(title).toContain('Tourism Economics');

  // Back to landing, then a "Start studying" trigger → browse drill-down
  await page.evaluate(() => window.navigateTo('landing'));
  await page.waitForSelector('#landing-page.active');
  await page.click('.landing-nav .start-trigger');
  await page.waitForSelector('#browse-page.active', { timeout: 5000 });
  await page.waitForSelector('.browse-card[data-browse="faculty"]');

  expect(errors).toEqual([]);
});
