// Smoke test: prolazi SVE sekcije za SVE predmete (8) i provjerava da A2 catalog
// refaktor nije ništa slomio. Hvata JS greške u konzoli, provjerava da sekcije
// renderiraju sadržaj, da podaci stvarno teku kroz catalog, i da nema horizontalnog
// overflowa ni na jednoj sekciji.  Pokreni: `npm run test:responsive` (uključuje i ovo).
const { test, expect } = require('@playwright/test');

const SECTIONS = ['home', 'learn', 'flashcards', 'quiz', 'fill', 'progress'];

test('all sections render for all subjects without errors or overflow', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });

  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);
  const dw = page.viewportSize().width;

  const subjects = await page.evaluate(() =>
    window.SOKRAT_CATALOG.subjects
      .map((s) => {
        const lesson = (s.lessons || []).find((l) => window.SokratCatalog.resolveDataVar(s.id, l.id));
        return lesson ? { id: s.id, lesson: lesson.id, blindMap: !!(s.features && s.features.blindMap) } : null;
      })
      .filter(Boolean)
  );

  const problems = [];

  for (const s of subjects) {
    await page.evaluate(({ id, lesson }) => window.navigateTo('study', { subject: id, lesson }), s);
    await page.waitForTimeout(120);

    const sections = [...SECTIONS, ...(s.blindMap ? ['blind-map'] : [])];
    for (const sec of sections) {
      await page.evaluate((sec) => window.switchSection(sec), sec);
      await page.waitForTimeout(120);
      const r = await page.evaluate(({ sec, dw }) => {
        const el = document.getElementById(sec);
        const active = el && el.classList.contains('active');
        const hasContent = el
          ? el.innerText.trim().length > 0 ||
            el.querySelectorAll('canvas,button,input,.learn-card,.flashcard').length > 0
          : false;
        const overflow = Math.max(document.documentElement.scrollWidth, window.innerWidth) > dw + 1;
        return { active, hasContent, overflow, innerW: window.innerWidth, docW: document.documentElement.scrollWidth };
      }, { sec, dw });
      if (!r.active) problems.push(`${s.id}/${sec}: section NOT active`);
      if (!r.hasContent) problems.push(`${s.id}/${sec}: EMPTY (nije renderirano)`);
      if (r.overflow) problems.push(`${s.id}/${sec}: H-OVERFLOW innerW=${r.innerW} docW=${r.docW}`);
    }

    // Podaci stvarno teku kroz catalog? (jaki signal da A2 radi za ovaj predmet)
    const data = await page.evaluate(() => {
      window.switchSection('flashcards');
      const card = (document.getElementById('cardQuestion') || {}).textContent || '';
      const quizOpts = document.querySelectorAll('#quizCategory option').length;
      return { cardLen: card.trim().length, quizOpts };
    });
    if (data.cardLen === 0) problems.push(`${s.id}: flashcard prazna (podaci ne teku?)`);
    if (data.quizOpts < 1) problems.push(`${s.id}: quiz kategorije prazne`);
  }

  // CDN/font/resource greške nisu naša odgovornost — filtriraj ih
  const realErrors = errors.filter(
    (e) => !/(favicon|fonts\.googleapis|fonts\.gstatic|font-awesome|cdnjs|ERR_|Failed to load resource|status of 4)/i.test(e)
  );

  console.log(`\n[${testInfo.project.name}] subjects=${subjects.length} problems=${problems.length} errors(real)=${realErrors.length} errors(all)=${errors.length}`);
  problems.forEach((p) => console.log('  ⚠ ' + p));
  realErrors.slice(0, 25).forEach((e) => console.log('  ✗ ' + e));

  expect.soft(problems, 'Problemi sekcija:\n' + problems.join('\n')).toEqual([]);
  expect.soft(realErrors, 'JS greške:\n' + realErrors.join('\n')).toEqual([]);
});
