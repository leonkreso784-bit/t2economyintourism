// Provjera A3: sidebar se renderira iz catalog-a i klik navigira na lekcije.
const { test, expect } = require('@playwright/test');

test('sidebar renders all catalog subjects and navigates on click', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => window.SOKRAT_CATALOG && document.querySelectorAll('#subjectsList .subject-item').length > 0
  );

  // 1) Renderirani redoslijed i id-evi odgovaraju catalogu (SAMO primarni program —
  //    drugi programi, npr. HRV, dostupni su kroz Browse; sidebar/landing pokazuju primarni)
  const expected = await page.evaluate(() =>
    window.SOKRAT_CATALOG.subjects.filter((s) => s.programId === 'hospitality-management').map((s) => s.id));
  const rendered = await page.$$eval('#subjectsList .subject-item', (els) =>
    els.map((e) => e.getAttribute('data-subject'))
  );
  expect(rendered).toEqual(expected);

  // 2) Svaki ima naslov + ikonu
  const titles = await page.$$eval('#subjectsList .subject-item .subject-item-info h3', (els) =>
    els.map((e) => e.textContent.trim())
  );
  expect(titles.length).toBe(expected.length);
  expect(titles.every((t) => t.length > 0)).toBe(true);
  const icons = await page.$$eval('#subjectsList .subject-item .subject-item-icon i', (els) => els.length);
  expect(icons).toBe(expected.length);

  // 3) Klik na predmet otvara stranicu lekcija
  await page.evaluate(() => window.openSidebar && window.openSidebar());
  await page.waitForTimeout(300);
  await page.click('#subjectsList .subject-item[data-subject="te2"]');
  await page.waitForSelector('#lessons-page.active', { timeout: 5000 });
  const title = (await page.textContent('#currentSubjectTitle')) || '';
  expect(title).toContain('Tourism Economics');

  expect(errors).toEqual([]);
});
