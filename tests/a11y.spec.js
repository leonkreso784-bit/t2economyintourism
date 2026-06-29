// Accessibility gate (FOUNDATION_PLAN F1, brick 1D.2). axe-core preko Playwrighta.
// TVRDI gate: 0 serious/critical violationa na ključnim ekranima. Determinističan (ne timing) → pouzdan u CI-u.
//
// Napomena: skeniramo na JEDNOM viewportu (prvi projekt) da izbjegnemo 4× šum istih nalaza; a11y nije viewport-ovisan
// za ono što axe provjerava (kontrast/role/labele/alt). Pokreće se kroz Playwright (`test:responsive`/CI).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Gate hvata samo ozbiljne razrede; 'minor'/'moderate' su backlog (ne ruše build).
const IMPACT_GATE = ['serious', 'critical'];

function gateViolations(results) {
  return results.violations
    .filter((v) => IMPACT_GATE.includes(v.impact))
    .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, target: v.nodes.map((n) => n.target).flat() }));
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

  test('study page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'a11y se skenira na jednom viewportu');
    await page.goto('/');
    await page.waitForFunction(() => window.navigateTo);
    await page.evaluate(() => window.navigateTo('study', { subject: 'marketing', lesson: 'first-midterm' }));
    await page.waitForSelector('#learn .learn-card', { state: 'attached', timeout: 15000 });
    const results = await new AxeBuilder({ page }).analyze();
    const gated = gateViolations(results);
    if (gated.length) console.log('STUDY violations:', JSON.stringify(gated, null, 2));
    expect(gated).toEqual([]);
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
});
