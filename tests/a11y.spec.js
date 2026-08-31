// Accessibility gate (FOUNDATION_PLAN F1, brick 1D.2). axe-core preko Playwrighta.
// TVRDI gate: 0 serious/critical violationa na ključnim ekranima. Determinističan (ne timing) → pouzdan u CI-u.
//
// Napomena: skeniramo na JEDNOM viewportu (prvi projekt) da izbjegnemo 4× šum istih nalaza; a11y nije viewport-ovisan
// za ono što axe provjerava (kontrast/role/labele/alt). Pokreće se kroz Playwright (`test:responsive`/CI).
//
// ⚠️ OVAJ SPEC POKRIVA SAMO ODJAVLJENE POVRŠINE. Prijavljene (Moji materijali sa stablom,
// Studio, block-editor, dijalog potvrde) drži `a11y.authed.spec.js` — dosegom, ne pravilima.
// Dok je taj spec nedostajao, tema na tamnoj plohi prošla je kroz cijelu suitu (spec §7.9).
//
// ⚠️ SVAKO MJERENJE IDE KROZ `skeniraj()` IZ `helpers/axe-gate.js` — NIKAD kroz vlastiti
// `new AxeBuilder(...)`. Razlog nije urednost nego BUG-042: axe računa neprozirnost predaka,
// pa element uhvaćen usred fade-ina daje IZMIJEŠANU boju i lažni pad. Ovaj je spec do
// 2026-08-31 skenirao izravno i time zaobilazio `smiri()`; posljedica je bila crveni CI na
// kolačić-traci s omjerima 4.05/3.54, dok isti tokeni na punoj neprozirnosti daju 6.35/5.67.
// Zabranu drži `tests/unit/axe-gate-usage.test.js`.
const { test, expect } = require('@playwright/test');
const { skeniraj } = require('./helpers/axe-gate');

test.describe('a11y — no serious/critical axe violations', () => {
  test('landing', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForSelector('#landingSubjects .landing-subject-card');
    expect(await skeniraj(page, 'LANDING')).toEqual([]);
  });

  test('browse drill-down', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.enterBrowse && window.enterBrowse());
    await page.waitForTimeout(400);
    expect(await skeniraj(page, 'BROWSE')).toEqual([]);
  });

  // Study page: skeniraj SVE interaktivne sekcije, ne samo learn. (3E: audit je otkrio da su
  // flashcards/quiz/fill/progress bili IZVAN gate-a → kroz njih su prošli critical button-name/
  // select-name + serious color-contrast. Ovdje ih zaključavamo da ne regresiraju.)
  test('study page — sve sekcije (learn/flashcards/quiz/fill/progress)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo && window.switchSection);
    await page.evaluate(() => window.navigateTo('study', { subject: 'marketing', lesson: 'first-midterm' }));
    await page.waitForSelector('#learn .learn-card', { state: 'attached', timeout: 15000 });

    const all = [];
    for (const sec of ['learn', 'flashcards', 'quiz', 'fill', 'progress']) {
      await page.evaluate((s) => window.switchSection(s), sec);
      // Sekcije se pojavljuju s fade-inom; smirivanje animacija radi `skeniraj()`.
      all.push(...await skeniraj(page, `STUDY/${sec}`));
    }
    expect(all).toEqual([]);
  });

  // Stranica LEKCIJA do 2026-08-26 nije bila skenirana — a jedini put u svaku lekciju
  // kataloga vodi kroz nju. Ušla je u branu s ciglom P1, koja joj je dodala prvu pravu
  // kontrolu („skini za offline"); dotad je bila popis poveznica, pa se propust nije vidio.
  // Skenira se OBOJE stanje kontrole: neskinuto i skinuto (drugo mijenja boju ikone).
  test('lekcije predmeta — uklj. kontrolu „skini za offline" (P1)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/#/subject/marketing');
    await page.waitForSelector('#lessonsGrid .lesson-card', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('#offlineControl .offline-btn', { timeout: 15000 });

    const prvo = await skeniraj(page, 'LEKCIJE (neskinuto)');

    await page.locator('#offlineControl .offline-btn').click();
    await page.waitForSelector('#offlineControl [data-offline-state="ready"]', { timeout: 30000 });
    const drugo = await skeniraj(page, 'LEKCIJE (skinuto)');

    // Počisti za sobom: iduci test u istom kontekstu ne smije naslijediti skinut predmet.
    await page.evaluate(async () => {
      window.localStorage.removeItem('sokrat-offline-v1');
      if (window.caches) await window.caches.delete('sokrat-offline');
    });

    expect(prvo.concat(drugo)).toEqual([]);
  });

  // B3b (MREŽA): KVANTITATIVNI predmet ulazi u branu. B3a je izmjerio da je jedini pravi
  // a11y dug (`scrollable-region-focusable`, 9× serious/wcag2a na `.katex-display` @ 375 px)
  // živio na macro/entrepreneurship — površinama koje se NISU skenirale, jer je STUDY gore
  // pokrivao samo `marketing`, TEKSTUALNI predmet bez ijedne display-formule. Prebacivanje
  // ljestvice na WCAG razinu bez ove površine zaključalo bi prazan skup: brana bi tvrdila
  // „0 po razini" o skupu na kojem razina nema što suditi. Skeniraju se iste sekcije kao
  // za marketing — formule žive u learn, ali inline-KaTeX ide i u quiz/fill.
  test('study page — kvantitativni predmet (macroeconomics, sve sekcije)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo && window.switchSection);
    await page.evaluate(() => window.navigateTo('study', { subject: 'macroeconomics', lesson: 'first-midterm' }));
    await page.waitForSelector('#learn .learn-card', { state: 'attached', timeout: 15000 });

    // KaTeX se renderira asinkrono (CDN + renderMath poslije umetanja) — čekaj da formule
    // POSTOJE prije mjerenja, inače se skenira stranica bez onoga zbog čega je ovdje.
    await page.waitForSelector('#learn .katex-display', { state: 'attached', timeout: 15000 });

    const all = [];
    for (const sec of ['learn', 'flashcards', 'quiz', 'fill', 'progress']) {
      await page.evaluate((s) => window.switchSection(s), sec);
      all.push(...await skeniraj(page, `STUDY-KVANT/${sec}`));
    }
    expect(all).toEqual([]);
  });

  test('profile (signed out)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.navigateTo('profile'));
    await page.waitForTimeout(400);
    expect(await skeniraj(page, 'PROFILE')).toEqual([]);
  });

  // C0 (ADR-029): vlastiti materijal je od sada ravnopravno odredište, pa mora ući i u a11y-gate.
  // Skenira se ODJAVLJENO — to je ploha s pozivom na prijavu, koju vidi svaki novi posjetitelj,
  // i jedina koja ne ovisi o test-računu. (Prije C0 gate je pokrivao 4 stranice; sad 5.)
  test('vlastiti materijal (odjavljen)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.navigateTo('materials'));
    await page.waitForSelector('#materials-page.active');
    await page.waitForTimeout(400);
    expect(await skeniraj(page, 'MATERIALS')).toEqual([]);
  });
});
