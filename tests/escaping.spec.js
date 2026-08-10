// BUG-025 — tekst iz PODATAKA koji ide u `innerHTML` mora se prikazati doslovno i ne smije se izvršiti.
//
// Nije teorijski rizik nego zatečena šteta u KATALOGU: u `statistics` je kviz-pitanje o Z-tablici
// imalo tri ponuđena odgovora `\(P(Z<z)\)`, `\(1-P(Z<z)\)` i `\(2P(Z<z)\)`. Preglednik je iz
// `innerHTML` pročitao `<z…` kao POČETAK TAGA i pojeo sve do prvog `>`, pa su se sve tri opcije
// prikazale skraćeno (`\(P(Z`, `\(1-P(Z`, `\(2P(Z`) — pitanje se nije moglo riješiti.
// Druga polovica istog propusta je sigurnosna: u osobnom materijalu te tekstove tipka KORISNIK.
//
// Testira se PRAVI put prikaza (`AppState.nav.data` → funkcije modova), ne pomoćna funkcija —
// pouka BUG-024: dokazati da pozivatelj escape STVARNO koristi, ne samo da escape postoji.
// Podaci su vlastiti (ne ovisi o katalogu) — v. [[tests-must-be-data-independent]].
const { test, expect } = require('@playwright/test');

// Doslovni zapisi iz kataloga (ono što je pucalo) + klasičan teret za izvršavanje.
const MATH = '\\(P(Z<z)\\)';
const MATH_Q = 'If the Z-table gives \\(P(Z<z)\\), then \\(P(Z>z)\\) equals:';
const XSS = '<img src=x onerror="window.__pwned=1">';
const AMP = 'Profit and loss (P&L) & A&G';

/** Jedna sekcija koja u svakom modu nosi i formulu s `<` i teret za izvršavanje. */
function fixture() {
  return {
    tema: {
      name: 'Sekcija ' + XSS,
      icon: 'fa-book',
      color: '#6366f1',
      flashcards: [{ question: 'q', answer: 'a' }],
      quiz: [{ question: MATH_Q, options: [MATH, '\\(1-P(Z<z)\\)', XSS, AMP], correct: 0 }],
      fillBlanks: [{ sentence: 'Za \\(x<5\\) vrijedi _______ ' + XSS, answer: 'to' }],
      learn: { blocks: [{ type: 'paragraph', text: 'tijelo' }] },
    },
  };
}

/** Otvori bilo koju rješivu lekciju (treba nam samo živ study-DOM), pa podmetni svoje podatke. */
async function openStudyWithFixture(page) {
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo
    && window.switchSection && window.startQuiz && window.renderLearnContent);

  const target = await page.evaluate(() => {
    for (const s of window.SOKRAT_CATALOG.subjects) {
      const l = (s.lessons || []).find((x) => window.SokratCatalog.resolveDataVar(s.id, x.id));
      if (l) return { id: s.id, lesson: l.id };
    }
    return null;
  });
  expect(target, 'treba barem jedan predmet s rješivom lekcijom').not.toBeNull();

  await page.evaluate(({ id, lesson }) => window.navigateTo('study', { subject: id, lesson }), target);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id),
    target.id, { timeout: 20000 });

  // Podmetni podatke TEK nakon učitavanja — `initStudyPage` bi ih inače pregazio.
  await page.evaluate((data) => { window.AppState.nav.data = data; }, fixture());
}

test.describe('BUG-025 — sadržaj u innerHTML se prikazuje doslovno i ne izvršava', () => {
  test('kviz: opcija s `<` u formuli ostaje CIJELA (i ne izvrši se)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'dovoljno je jednom');
    await openStudyWithFixture(page);

    await page.evaluate(() => { window.switchSection('quiz'); window.startQuiz(); });
    await expect(page.locator('#answersContainer .answer-btn')).toHaveCount(4, { timeout: 10000 });

    // `> span` = IZRAVNO dijete gumba; KaTeX iznutra izgradi vlastito stablo spanova.
    const texts = await page.locator('#answersContainer .answer-btn > span:nth-child(2)').allTextContents();
    expect(texts).toHaveLength(4);

    // JEZGRA: prije popravka je ovdje stajalo `\(P(Z` — preglednik je `<z)\)` pojeo kao tag, pa
    // KaTeX nije imao zatvoren delimiter i formula je ostala krnji tekst. Redoslijed opcija je
    // promiješan (`startQuiz`), zato se tvrdi nad skupom, ne nad indeksom.
    const joined = texts.join(' | ');
    expect(joined, '`<` iz formule mora preživjeti do prikaza').toContain('P(Z<z)');
    expect(texts.filter((s) => s.includes('P(Z<z)')).length,
      'obje matematičke opcije moraju biti citljive, ne skraćene').toBe(2);
    expect(texts, 'ampersand se ne smije pretvoriti u entitet').toContain(AMP);
    expect(texts, 'teret mora ostati TEKST').toContain(XSS);
    expect(new Set(texts).size, 'opcije se moraju međusobno razlikovati').toBe(4);

    // Sigurnosna strana: nijedan element nije nastao i ništa se nije izvršilo.
    expect(await page.locator('#answersContainer img').count(), 'iz teksta je nastao <img>').toBe(0);
    expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
  });

  test('learn: naziv sekcije je TEKST, a nevaljana ikona ne ulazi u class', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'dovoljno je jednom');
    await openStudyWithFixture(page);

    await page.evaluate(() => {
      window.AppState.nav.data.tema.icon = 'fa-book" onload="window.__pwned=1';   // pokušaj bijega iz class
      window.switchSection('learn');
      window.renderLearnContent();
    });

    const title = page.locator('#learnContent .learn-card-title').first();
    await expect(title).toHaveText('Sekcija ' + XSS, { timeout: 10000 });
    expect(await page.locator('#learnContent .learn-card-header img').count()).toBe(0);
    expect(await page.evaluate(() => window.__pwned)).toBeUndefined();

    // Nevaljan oblik ikone pada na siguran default umjesto da procuri u atribut.
    const cls = await page.locator('#learnContent .learn-card-title i').first().getAttribute('class');
    expect(cls).toBe('fas fa-book');
  });

  test('napredak: naziv/ikona/boja sekcije ne izlaze iz svojih atributa', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'dovoljno je jednom');
    await openStudyWithFixture(page);

    await page.evaluate(() => {
      // Boja ide u `style`, ikona u `class` — dva atributa koja escape sam ne bi obranio.
      window.AppState.nav.data.tema.color = 'red" onmouseover="window.__pwned=1';
      window.AppState.nav.data.tema.icon = 'fa-book danger';
      window.switchSection('progress');
      window.updateCategoryButtons();
      if (typeof window.updateCategoryBars === 'function') window.updateCategoryBars();
    });

    const btn = page.locator('.categories .category-btn').first();
    await expect(btn).toContainText(XSS, { timeout: 10000 });   // naziv je TEKST, ne markup
    expect(await page.locator('.categories img').count()).toBe(0);

    // Ikona: nevaljan oblik → siguran default, bez pridružene tuđe klase.
    expect(await btn.locator('i').first().getAttribute('class')).toBe('fas fa-book');

    // Boja: nije čist #rrggbb → stil se izostavi umjesto da nešto proizvoljno uđe u `style`.
    const bars = page.locator('.category-bar');
    if (await bars.count()) {
      const style = await bars.first().locator('i').first().getAttribute('style');
      expect(style === null || !style.includes('onmouseover')).toBe(true);
    }
    expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
  });

  test('dopune: rečenica s `<` ostaje cijela, a praznina se i dalje crta', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'dovoljno je jednom');
    await openStudyWithFixture(page);

    await page.evaluate(() => { window.switchSection('fill'); window.initFill(); });
    const sentence = page.locator('#fillSentence');
    // KaTeX je formulu već tipografirao → tražimo `x<5` (znak `<` je preživio), ne sirov LaTeX.
    await expect(sentence).toContainText('x<5', { timeout: 10000 });
    await expect(sentence).toContainText(XSS);

    // Praznina je NAŠ markup i mora preživjeti escape (escape ide prije umetanja spana).
    await expect(sentence.locator('.blank')).toHaveCount(1);
    expect(await page.locator('#fillSentence img').count()).toBe(0);
    expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
  });
});
