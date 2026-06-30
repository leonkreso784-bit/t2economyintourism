// ContentRepository (S1, Faza 2 / cigla 2B.1): tanki šav za dohvat sadržaja.
// Dokazuje EKVIVALENCIJU sa starim putem (loadSubjectContent + getSubjectData) =
// nula promjene ponašanja. getSubjectData vraća istu window-referencu, pa Repo mora
// vratiti IDENTIČAN objekt (===).
const { test, expect } = require('@playwright/test');

test('ContentRepository: metadata passthrough matches catalog', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent && window.SokratCatalog);

  const meta = await page.evaluate(() => ({
    hasAPI: ['listSubjects', 'getSubject', 'isLessonComingSoon', 'loadLesson', 'isLoaded']
      .every((m) => typeof window.SokratContent[m] === 'function'),
    repoSubj: (window.SokratContent.getSubject('marketing') || {}).id,
    catSubj: (window.SokratCatalog.getSubject('marketing') || {}).id,
    listLen: window.SokratContent.listSubjects().length,
    catLen: window.SokratCatalog.all().length,
    comingReal: window.SokratContent.isLessonComingSoon('ebusiness', 'first-midterm'),
    missing: window.SokratContent.getSubject('does-not-exist'),
  }));

  expect(meta.hasAPI).toBe(true);
  expect(meta.repoSubj).toBe('marketing');
  expect(meta.repoSubj).toBe(meta.catSubj);
  expect(meta.listLen).toBe(meta.catLen);
  expect(meta.listLen).toBeGreaterThan(0);
  expect(meta.comingReal).toBe(false);
  expect(meta.missing).toBeNull();
});

test('ContentRepository: loadLesson === old path (zero behavior change)', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent && window.loadSubjectContent && window.getSubjectData);

  const eq = await page.evaluate(async () => {
    const viaRepo = await window.SokratContent.loadLesson('ebusiness', 'first-midterm');
    const viaOld = window.getSubjectData('ebusiness', 'first-midterm'); // already loaded by repo
    return {
      same: viaRepo === viaOld,          // identična referenca = dokaz ekvivalencije
      keys: Object.keys(viaRepo).length, // nije prazno
      isLoaded: window.SokratContent.isLoaded('ebusiness'),
    };
  });

  expect(eq.same).toBe(true);
  expect(eq.keys).toBeGreaterThan(0);
  expect(eq.isLoaded).toBe(true);
  expect(errors).toEqual([]);
});
