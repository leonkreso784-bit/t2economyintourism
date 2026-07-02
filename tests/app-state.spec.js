// AppState (F2 2C): funkcionalni tijek FILL moda nakon migracije fill grupe u AppState.fill
// (2C.2a). Smoke test samo renderira sekcije — ovaj test stvarno OCJENJUJE (točan odgovor,
// kriv odgovor, skip) i provjerava brojače u DOM-u + Progress statistiku (progress.js path).
// Bonus namespacea: stanje je inspektabilno kroz window.AppState (prije bilo nedostupno —
// top-level `let` ne stvara window property).
const { test, expect } = require('@playwright/test');

test('fill tijek kroz AppState.fill: točan → kriv → skip → progress statistika', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);
  await page.evaluate(() => window.navigateTo('study', { subject: 'sit', lesson: 'first-midterm' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('sit'), null, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('fill'));
  await page.waitForFunction(() => document.getElementById('fillSentence').textContent.trim().length > 0);

  // Početno stanje (kroz AppState — nova opservabilnost)
  const init = await page.evaluate(() => ({
    n: window.AppState.fill.questions.length,
    index: window.AppState.fill.index,
    correct: window.AppState.fill.correct,
    wrong: window.AppState.fill.wrong,
  }));
  expect(init.n).toBeGreaterThan(2);
  expect(init).toMatchObject({ index: 0, correct: 0, wrong: 0 });

  // 1) TOČAN odgovor — čitamo ga iz AppState pa upišemo
  const answer = await page.evaluate(() => window.AppState.fill.questions[window.AppState.fill.index].answer);
  await page.fill('#fillInput', answer);
  await page.click('#checkFill');
  await expect(page.locator('#fillFeedback')).toHaveClass(/correct/);
  expect(await page.evaluate(() => window.AppState.fill.correct)).toBe(1);
  await expect(page.locator('#fillCorrect')).toHaveText('1'); // DOM brojač (id ≠ varijabla)

  await page.click('#btnNextFill');
  expect(await page.evaluate(() => window.AppState.fill.index)).toBe(1);

  // 2) KRIV odgovor
  await page.fill('#fillInput', 'xxx-definitivno-krivi-odgovor-xxx');
  await page.click('#checkFill');
  await expect(page.locator('#fillFeedback')).toHaveClass(/wrong/);
  expect(await page.evaluate(() => window.AppState.fill.wrong)).toBe(1);
  await expect(page.locator('#fillWrong')).toHaveText('1');
  await page.click('#btnNextFill');

  // 3) SKIP = wrong++ i ide dalje
  await page.click('#btnSkip');
  expect(await page.evaluate(() => ({ w: window.AppState.fill.wrong, i: window.AppState.fill.index })))
    .toEqual({ w: 2, i: 3 });

  // 4) Progress sekcija čita AppState.fill (progress.js): 1 točan / 3 ukupno = 33%
  await page.evaluate(() => window.switchSection('progress'));
  await expect(page.locator('#fillAccuracy')).toHaveText('33%');

  expect(errors).toEqual([]);
});
