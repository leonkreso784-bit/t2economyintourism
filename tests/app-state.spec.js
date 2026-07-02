// AppState (F2 2C): funkcionalni tijek FILL moda nakon migracije fill grupe u AppState.fill
// (2C.2a). Smoke test samo renderira sekcije — ovaj test stvarno OCJENJUJE (točan odgovor,
// kriv odgovor, skip) i provjerava brojače u DOM-u + Progress statistiku (progress.js path).
// Bonus namespacea: stanje je inspektabilno kroz window.AppState (prije bilo nedostupno —
// top-level `let` ne stvara window property).
const { test, expect } = require('@playwright/test');

test('fill tijek kroz AppState.fill: točan → kriv → skip → progress statistika', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // Cookie banner riješen unaprijed ('denied' = ne učitava se ni GA ni Sentry — deterministički);
  // inače na landscape profilu banner presreće klikove na gumbe modova.
  await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
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

test('quiz tijek kroz AppState.quiz: točan → kriv → review krivih → rezultati → retry', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);
  await page.evaluate(() => window.navigateTo('study', { subject: 'sit', lesson: 'first-midterm' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('sit'), null, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('quiz'));

  // Pokreni kviz s 5 pitanja (programski — setup UI je već pokriven smoke-testom)
  await page.evaluate(() => {
    document.getElementById('questionCount').value = '5';
    document.getElementById('quizCategory').value = 'all';
    window.startQuiz();
  });
  await page.waitForFunction(() => document.querySelectorAll('.answer-btn').length > 0);

  const init = await page.evaluate(() => ({
    n: window.AppState.quiz.questions.length,
    index: window.AppState.quiz.index,
    correct: window.AppState.quiz.correct,
    shuffledOk: window.AppState.quiz.shuffledCorrectIndex >= 0 && window.AppState.quiz.shuffledOptions.length > 0,
  }));
  expect(init.n).toBe(5);
  expect(init).toMatchObject({ index: 0, correct: 0, shuffledOk: true });

  // 1) TOČAN odgovor — indeks točnog čitamo iz AppState
  let correctIdx = await page.evaluate(() => window.AppState.quiz.shuffledCorrectIndex);
  await page.locator('.answer-btn').nth(correctIdx).click();
  expect(await page.evaluate(() => ({ c: window.AppState.quiz.correct, a: window.AppState.quiz.answers[0].isCorrect })))
    .toEqual({ c: 1, a: true });
  await expect(page.locator('#correctCount')).toHaveText('1');

  // auto-advance (1.5 s) na pitanje 2
  await page.waitForFunction(() => window.AppState.quiz.index === 1);
  await page.waitForFunction(() => !document.querySelector('.answer-btn.disabled'));

  // 2) KRIV odgovor
  correctIdx = await page.evaluate(() => window.AppState.quiz.shuffledCorrectIndex);
  const btnCount = await page.locator('.answer-btn').count();
  const wrongIdx = (correctIdx + 1) % btnCount;
  await page.locator('.answer-btn').nth(wrongIdx).click();
  expect(await page.evaluate(() => ({
    w: window.AppState.quiz.wrong,
    listLen: window.AppState.quiz.wrongList.length,
    a: window.AppState.quiz.answers[1].isCorrect,
  }))).toEqual({ w: 1, listLen: 1, a: false });
  await expect(page.locator('#wrongCount')).toHaveText('1');

  // 3) Odgovori preostala 3 pitanja točno → rezultati: 4/5 = 80%
  for (let i = 2; i < 5; i++) {
    await page.waitForFunction((n) => window.AppState.quiz.index === n, i);
    await page.waitForFunction(() => !document.querySelector('.answer-btn.disabled'));
    const ci = await page.evaluate(() => window.AppState.quiz.shuffledCorrectIndex);
    await page.locator('.answer-btn').nth(ci).click();
  }
  await expect(page.locator('#quizResults')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#finalScore')).toHaveText('80%');
  await expect(page.locator('#finalCorrect')).toHaveText('4');
  await expect(page.locator('#finalWrong')).toHaveText('1');
  // Review krivih iz AppState.quiz.wrongList renderiran
  await expect(page.locator('#wrongAnswersList .wrong-answer-item')).toHaveCount(1);

  // 4) Retry resetira grupu (pitanja ostaju)
  await page.evaluate(() => window.retryQuiz());
  expect(await page.evaluate(() => ({
    i: window.AppState.quiz.index, c: window.AppState.quiz.correct, w: window.AppState.quiz.wrong,
    n: window.AppState.quiz.questions.length, wl: window.AppState.quiz.wrongList.length,
  }))).toEqual({ i: 0, c: 0, w: 0, n: 5, wl: 0 });

  expect(errors).toEqual([]);
});

test('flashcards tijek kroz AppState.cards: known → unknown → prev → premjesti unknown u known', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // Cookie banner riješen unaprijed ('denied' = ne učitava se ni GA ni Sentry — deterministički);
  // inače na landscape profilu banner presreće klikove na gumbe modova.
  await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);
  await page.evaluate(() => window.navigateTo('study', { subject: 'sit', lesson: 'first-midterm' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('sit'), null, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('flashcards'));
  await page.waitForFunction(() => document.getElementById('cardQuestion').textContent.trim().length > 0);

  const init = await page.evaluate(() => ({
    n: window.AppState.cards.deck.length,
    index: window.AppState.cards.index,
    known: window.AppState.cards.known.length,
    unknown: window.AppState.cards.unknown.length,
  }));
  expect(init.n).toBeGreaterThan(2);
  expect(init).toMatchObject({ index: 0, known: 0, unknown: 0 });

  // 1) Kartica 0 → known; ide na karticu 1
  await page.click('#btnCorrect');
  await expect(page.locator('#knownCount')).toHaveText('1');
  expect(await page.evaluate(() => ({ i: window.AppState.cards.index, k: window.AppState.cards.known })))
    .toEqual({ i: 1, k: [0] });

  // 2) Kartica 1 → unknown; ide na karticu 2
  await page.click('#btnWrong');
  await expect(page.locator('#unknownCount')).toHaveText('1');
  expect(await page.evaluate(() => ({ i: window.AppState.cards.index, u: window.AppState.cards.unknown })))
    .toEqual({ i: 2, u: [1] });

  // 3) Natrag na karticu 1 pa je označi known → mora NESTATI iz unknown (swap logika)
  await page.click('#btnPrev');
  expect(await page.evaluate(() => window.AppState.cards.index)).toBe(1);
  await page.click('#btnCorrect');
  await expect(page.locator('#knownCount')).toHaveText('2');
  await expect(page.locator('#unknownCount')).toHaveText('0');
  expect(await page.evaluate(() => ({ k: window.AppState.cards.known, u: window.AppState.cards.unknown })))
    .toEqual({ k: [0, 1], u: [] });

  // 4) known se slijeva u progress.flashcardsLearned (saveFlashcardProgress).
  //    NB: `progress` je top-level let (NE window.progress — to je DOM sekcija id="progress").
  expect(await page.evaluate(() => progress.flashcardsLearned.includes(0) && progress.flashcardsLearned.includes(1)))
    .toBe(true);

  expect(errors).toEqual([]);
});
