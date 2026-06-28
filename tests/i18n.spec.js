// Cigla 5 (HRV): GLOBALNI language toggle (HR/EN) za sučelje. Sadržaj se NE dira.
// Model: globalni izbor (localStorage 'sokrat-ui-lang') je gospodar; otvaranje HR programa
// samo PREDLOŽI hrvatski ako korisnik još nije eksplicitno birao.
const { test, expect } = require('@playwright/test');

const navSpans = (page) =>
  page.$$eval('.study-nav .study-nav-btn span', (els) => els.map((e) => e.textContent.trim()));

test('opening an HR-program subject suggests Croatian UI (no prior choice)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('sokrat-ui-lang'));
  await page.reload();
  await page.waitForFunction(() => window.navigateTo && window.getUiLang);

  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics-hr', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics-hr'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  const hr = await navSpans(page);
  expect(hr).toContain('Kartice');
  expect(hr).toContain('Kviz');
  expect(hr).not.toContain('Flashcards');
});

test('global toggle is master and persists across reload (overrides program)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.setItem('sokrat-ui-lang', 'en'); });
  await page.reload();
  await page.waitForFunction(() => window.navigateTo && window.getUiLang);

  // Korisnik je izabrao EN → čak i HR predmet ostaje englesko sučelje
  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics-hr', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics-hr'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('en');
  expect(await navSpans(page)).toContain('Flashcards');

  // Toggle → HR, zapamti se, preživi reload
  await page.evaluate(() => window.toggleUiLang());
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  expect(await page.evaluate(() => localStorage.getItem('sokrat-ui-lang'))).toBe('hr');
  await page.reload();
  await page.waitForFunction(() => window.getUiLang);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
});
