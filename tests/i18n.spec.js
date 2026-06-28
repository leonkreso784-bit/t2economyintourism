// Cigla 5 (HRV): UI i18n se prebacuje po AKTIVNOM PROGRAMU.
// EN predmet → engleski tabovi; HR predmet ("…-hr") → hrvatski; landing → reset na EN.
const { test, expect } = require('@playwright/test');

const navSpans = (page) =>
  page.$$eval('.study-nav .study-nav-btn span', (els) => els.map((e) => e.textContent.trim()));

test('study UI language follows the active program (EN vs HR)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.getUiLang);

  // EN predmet → engleski
  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('en');
  const en = await navSpans(page);
  expect(en).toContain('Flashcards');
  expect(en).toContain('Quiz');

  // HR predmet → hrvatski
  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics-hr', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics-hr'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  const hr = await navSpans(page);
  expect(hr).toContain('Kartice');   // Flashcards
  expect(hr).toContain('Kviz');      // Quiz
  expect(hr).toContain('Učenje');    // Learn
  expect(hr).not.toContain('Flashcards');

  // Natrag na landing → reset na EN (landing je primarni program)
  await page.evaluate(() => window.navigateTo('landing'));
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => window.getUiLang())).toBe('en');
});
