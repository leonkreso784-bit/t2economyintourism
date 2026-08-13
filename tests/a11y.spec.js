// Accessibility gate (FOUNDATION_PLAN F1, brick 1D.2). axe-core preko Playwrighta.
// TVRDI gate: 0 serious/critical violationa na ključnim ekranima. Determinističan (ne timing) → pouzdan u CI-u.
//
// Napomena: skeniramo na JEDNOM viewportu (prvi projekt) da izbjegnemo 4× šum istih nalaza; a11y nije viewport-ovisan
// za ono što axe provjerava (kontrast/role/labele/alt). Pokreće se kroz Playwright (`test:responsive`/CI).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Gate hvata samo ozbiljne razrede; 'minor'/'moderate' su backlog (ne ruše build).
const IMPACT_GATE = ['serious', 'critical'];

// ⚠️ Ispisuj i axeove BROJKE, ne samo selektor.
// Povod (C2, 2026-08-13): gate je javio „color-contrast na `#btnCorrect > span`" i tu stao.
// Uzrok se onda pogađa — a dva neovisna ručna mjerenja dala su 4.80 i 5.16, dakle IZNAD
// praga, dok je axe tvrdio suprotno. Sat vremena je otišao na razliku koju je axe cijelo
// vrijeme znao. Boja, pozadina i omjer sad idu u ispis, pa se uzrok ČITA umjesto da se traži.
function detalji(node) {
  const d = (node.any || []).map((c) => c.data).find((x) => x && x.contrastRatio != null);
  if (!d) return null;
  return `fg ${d.fgColor} / bg ${d.bgColor} = ${d.contrastRatio} (treba ${d.expectedContrastRatio})`;
}

function gateViolations(results) {
  return results.violations
    .filter((v) => IMPACT_GATE.includes(v.impact))
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      help: v.help,
      target: v.nodes.map((n) => n.target).flat(),
      mjere: v.nodes.map((n) => detalji(n)).filter(Boolean)
    }));
}

test.describe('a11y — no serious/critical axe violations', () => {
  test('landing', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForSelector('#landingSubjects .landing-subject-card');
    const results = await new AxeBuilder({ page }).analyze();
    const gated = gateViolations(results);
    if (gated.length) console.log('LANDING violations:', JSON.stringify(gated, null, 2));
    expect(gated).toEqual([]);
  });

  test('browse drill-down', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.enterBrowse && window.enterBrowse());
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page }).analyze();
    const gated = gateViolations(results);
    if (gated.length) console.log('BROWSE violations:', JSON.stringify(gated, null, 2));
    expect(gated).toEqual([]);
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
      // ⚠️ NE mjeri usred prijelaza. Sekcije se pojavljuju s fade-inom, a axe uzorkuje
      // boju ONAKVU KAKVA JE U TOM TRENUTKU: izmjereno je javljao `#1e8155` umjesto
      // tokena `#10794a` — ista boja na ~93 % neprozirnosti, dakle 4.29 umjesto 4.80.
      // Gate je tako prijavljivao pad koji na gotovoj stranici ne postoji, a dva ručna
      // mjerenja (koja su čekala duže) tvrdila su suprotno. `finish()` je determinističan:
      // ne produljuje čekanje nego animacije gura u KRAJNJE stanje.
      await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* beskonačne */ } }));
      await page.waitForTimeout(250);
      const gated = gateViolations(await new AxeBuilder({ page }).analyze());
      if (gated.length) console.log(`STUDY/${sec} violations:`, JSON.stringify(gated, null, 2));
      gated.forEach((g) => all.push({ sec, ...g }));
    }
    expect(all).toEqual([]);
  });

  test('profile (signed out)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.navigateTo('profile'));
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page }).analyze();
    const gated = gateViolations(results);
    if (gated.length) console.log('PROFILE violations:', JSON.stringify(gated, null, 2));
    expect(gated).toEqual([]);
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
    const results = await new AxeBuilder({ page }).analyze();
    const gated = gateViolations(results);
    if (gated.length) console.log('MATERIALS violations:', JSON.stringify(gated, null, 2));
    expect(gated).toEqual([]);
  });
});
