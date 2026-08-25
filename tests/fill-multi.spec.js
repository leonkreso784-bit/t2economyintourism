// D2 — VIŠE PRAZNINA PO REČENICI, na pravom ekranu (jedinični testovi pokrivaju čiste funkcije).
//
// ⚠️ Test je NAMJERNO neovisan o podacima: u katalogu danas NEMA nijedne rečenice s dvije praznine
// (izmjereno: 0 od 1005), pa se pitanje UBACUJE u AppState. Kad bi test tražio takvu rečenicu u
// gradivu, mjerio bi sadržaj, a ne kod — i pao bi čim netko obriše lekciju.
//
// Tvrdnje: dvije praznine → dva polja U REČENICI · vanjsko polje se skloni · ocjena ide PO
// praznini · jedna praznina i dalje ide starim putem (vanjsko polje, netaknuto).
const { test, expect } = require('@playwright/test');

const DVIJE = {
  sentence: 'Kad cijena raste, ponuda _______ a potražnja _______.',
  answer: 'raste',
  answers: ['raste', 'pada'],
  categoryName: 'Test'
};

async function otvoriFill(page) {
  await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
  await page.goto('/');
  await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection);
  await page.evaluate(() => window.navigateTo('study', { subject: 'sit', lesson: 'first-midterm' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('sit'), null, { timeout: 15000 });
  await page.evaluate(() => window.switchSection('fill'));
  await page.waitForFunction(() => document.getElementById('fillSentence').textContent.trim().length > 0);
}

/** Ubaci pripremljeno pitanje i prikaži ga (bez diranja gradiva). */
async function postavi(page, q) {
  await page.evaluate((item) => {
    window.AppState.fill.questions = [item];
    window.AppState.fill.index = 0;
    window.AppState.fill.correct = 0;
    window.AppState.fill.wrong = 0;
    window.showFillQuestion();
  }, q);
}

test('dvije praznine: dva polja u rečenici, vanjsko polje skriveno', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await otvoriFill(page);
  await postavi(page, DVIJE);

  await expect(page.locator('#fillSentence .fill-blank-input')).toHaveCount(2);
  await expect(page.locator('#fillInput')).toBeHidden();
  // Svaka praznina ima svoju oznaku — inače čitač ekrana čita dva ista polja.
  const labels = await page.locator('#fillSentence .fill-blank-input').evaluateAll(
    (els) => els.map((e) => e.getAttribute('aria-label')));
  expect(new Set(labels).size).toBe(2);
  expect(errors).toEqual([]);
});

test('ocjena ide PO praznini: obje točne = točno, jedna kriva = netočno', async ({ page }) => {
  await otvoriFill(page);
  await postavi(page, DVIJE);

  const polja = page.locator('#fillSentence .fill-blank-input');
  await polja.nth(0).fill('raste');
  await polja.nth(1).fill('pada');
  await page.click('#checkFill');
  await expect(page.locator('#fillFeedback')).toHaveClass(/correct/);
  await expect(polja.nth(0)).toHaveClass(/is-ok/);
  await expect(polja.nth(1)).toHaveClass(/is-ok/);
  expect(await page.evaluate(() => window.AppState.fill.correct)).toBe(1);

  // Druga runda: prva točna, druga kriva → rečenica je NETOČNA, ali se vidi KOJA je praznina pala.
  await postavi(page, DVIJE);
  const polja2 = page.locator('#fillSentence .fill-blank-input');
  await polja2.nth(0).fill('raste');
  await polja2.nth(1).fill('xxx-krivo-xxx');
  await page.click('#checkFill');
  await expect(page.locator('#fillFeedback')).toHaveClass(/wrong/);
  await expect(polja2.nth(0)).toHaveClass(/is-ok/);
  await expect(polja2.nth(1)).toHaveClass(/is-bad/);
  // Otkriveni odgovor pokazuje OBA, ne samo prvi.
  await expect(page.locator('#correctFillAnswer')).toHaveText('raste · pada');
});

test('jedna praznina ide starim putem — vanjsko polje, bez polja u rečenici', async ({ page }) => {
  await otvoriFill(page);
  await postavi(page, { sentence: 'Cijena je _______ kad se ponuda i potražnja sretnu.', answer: 'ravnotežna', categoryName: 'Test' });

  await expect(page.locator('#fillSentence .fill-blank-input')).toHaveCount(0);
  await expect(page.locator('#fillSentence .blank')).toHaveCount(1);
  await expect(page.locator('#fillInput')).toBeVisible();
  await page.fill('#fillInput', 'ravnotežna');
  await page.click('#checkFill');
  await expect(page.locator('#fillFeedback')).toHaveClass(/correct/);
});
