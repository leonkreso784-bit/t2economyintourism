// Regresija BUG-020: kviz procuri između lekcija/predmeta.
// Study-stranica dijeli JEDAN DOM (isti #quizSetup/#quizGame/#quizResults + globalni
// AppState.quiz). Ako se kviz ne resetira na učitavanju nove lekcije, in-progress kviz
// prethodnog predmeta ostaje vidljiv. Ovaj test DOKAZUJE da fix (resetQuiz() u
// initStudyPage) drži: nakon prelaska na drugi predmet, kviz je natrag na SETUP i
// AppState.quiz.questions je očišćen. Bez fixa test PADA (game vidljiv, questions > 0).
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

test('kviz se resetira pri promjeni predmeta (BUG-020)', async ({ page }) => {
  await page.goto('/');
  await ucitajPakete(page, ['study']);   // `startQuiz` stiže s paketom, ne s naslovnicom
  await page.waitForFunction(() =>
    window.SOKRAT_CATALOG && window.navigateTo && window.switchSection && window.startQuiz);

  // Dva RAZLIČITA predmeta, svaki s rješivom lekcijom (isti obrazac kao smoke.spec).
  const subs = await page.evaluate(() =>
    window.SOKRAT_CATALOG.subjects
      .map((s) => {
        const lesson = (s.lessons || []).find((l) => window.SokratCatalog.resolveDataVar(s.id, l.id));
        return lesson ? { id: s.id, lesson: lesson.id } : null;
      })
      .filter(Boolean)
      .slice(0, 2)
  );
  expect(subs.length, 'trebaju barem 2 predmeta s rješivim lekcijama').toBe(2);

  const probe = () => ({
    gameVisible: !document.getElementById('quizGame').classList.contains('hidden'),
    setupVisible: !document.getElementById('quizSetup').classList.contains('hidden'),
    qCount: window.AppState.quiz.questions.length,
  });

  // 1) Predmet A → pokreni kviz (game panel postaje vidljiv).
  await page.evaluate(({ id, lesson }) => window.navigateTo('study', { subject: id, lesson }), subs[0]);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id), subs[0].id, { timeout: 15000 });
  await page.evaluate(() => { window.switchSection('quiz'); window.startQuiz(); });
  await page.waitForTimeout(150);

  const midA = await page.evaluate(probe);
  expect(midA.gameVisible, 'kviz u predmetu A mora biti stvarno pokrenut').toBe(true);
  expect(midA.setupVisible).toBe(false);
  expect(midA.qCount, 'kviz A ima pitanja').toBeGreaterThan(0);

  // 2) Prijeđi na predmet B BEZ završavanja kviza.
  await page.evaluate(({ id, lesson }) => window.navigateTo('study', { subject: id, lesson }), subs[1]);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id), subs[1].id, { timeout: 15000 });

  // 3) Otvori Quiz tab u predmetu B → MORA biti SETUP, ne procureli game iz A.
  await page.evaluate(() => window.switchSection('quiz'));
  await page.waitForTimeout(150);

  const inB = await page.evaluate(probe);
  expect(inB.setupVisible, 'kviz u predmetu B mora pokazati SETUP').toBe(true);
  expect(inB.gameVisible, 'stari game iz predmeta A NE smije biti vidljiv (curenje!)').toBe(false);
  expect(inB.qCount, 'AppState.quiz.questions mora biti očišćen na novoj lekciji').toBe(0);
});
