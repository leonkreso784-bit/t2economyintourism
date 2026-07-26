// U6e — ITEM-OPS E2E (STAGING): dodaj test-kategoriju + 3 kartice → presloži (↑↓) → obriši karticu.
// Trajni regresijski spec (pravilo #8: write/draft tokovi se automatiziraju vs STAGING) —
// pokreće se SAMO u `authenticated` projektu sa STAGING_* env (staging seedan: seed-staging.js te2).
//
// SVE ostaje u DRAFTU (nikad se ne objavljuje) → staging DB NETAKNUT. Radimo u SVJEŽOJ test-kategoriji;
// dodane kartice dobiju svjež stabilni id (addCard/_structAdd) → reorder-by-id radi neovisno o tome
// imaju li stari staging-te2 payloadi id-jeve. Provjeravamo da item-ops (add/reorder/remove) mijenjaju render.
const { test, expect } = require('@playwright/test');

const PREFIX = 'U6EITEM';
const CAT = PREFIX + '-cat';
const A = PREFIX + '-A', B = PREFIX + '-B', C = PREFIX + '-C';

/** Otvori admin → te2 + prva lekcija → uđi u draft-mod (isti helper kao category-ops/publish-rpc spec). */
async function openLessonInDraftMode(page) {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');
  await page.evaluate(() => {
    const sel = document.getElementById('adminSubjectSel');
    const te2 = sel.querySelector('option[value="te2"]');
    sel.value = te2 ? 'te2' : sel.querySelector('option[value]:not([value=""])').value;
    sel.dispatchEvent(new Event('change'));
  });
  await page.waitForFunction(() => {
    const l = document.getElementById('adminLessonSel');
    return l && !l.disabled && !!l.querySelector('option[value]:not([value=""]):not([disabled])');
  });
  await page.evaluate(() => {
    const l = document.getElementById('adminLessonSel');
    l.value = l.querySelector('option[value]:not([value=""]):not([disabled])').value;
    l.dispatchEvent(new Event('change'));
  });
  await page.waitForSelector('#adminDraftBtn', { timeout: 20000 });
  await page.click('#adminDraftBtn');
  await page.waitForSelector('#adminCards .admin-cat', { timeout: 20000 });
}

/** Dodaj flashcard u zadanu kategoriju kroz „Dodaj" UI (add-mod istog kartica-editora). */
async function addCard(page, catLocator, q, a) {
  await catLocator.locator('[data-admin-add][data-type="flashcard"]').click();
  await page.waitForSelector('#adminEditModal #adminEditQ');
  await page.fill('#adminEditQ', q);
  await page.fill('#adminEditA', a);
  await page.click('#adminEditSave');
  await expect(catLocator.locator('.admin-card', { hasText: q })).toHaveCount(1);
}

test('U6e — stavka: dodaj 3 → presloži (↑↓) → obriši (draft-only, staging netaknut)', async ({ page }) => {
  await openLessonInDraftMode(page);
  const initialCats = await page.locator('#adminCards .admin-cat').count();

  // Setup: svježa test-kategorija (izolirano od pravog sadržaja) → addCategory op.
  await page.click('[data-admin-cat-add]');
  await page.waitForSelector('#adminCatModal #adminCatName');
  await page.fill('#adminCatName', CAT);
  await page.fill('#adminCatIcon', 'fa-flask');
  await page.click('#adminCatSave');
  await page.waitForFunction((n) => document.querySelectorAll('#adminCards .admin-cat').length === n, initialCats + 1);
  const testCat = page.locator('#adminCards .admin-cat', { hasText: CAT });
  await expect(testCat).toHaveCount(1);

  // Dodaj 3 kartice A, B, C (svaka dobiva svjež id) → red A, B, C.
  await addCard(page, testCat, A, 'ans-A');
  await addCard(page, testCat, B, 'ans-B');
  await addCard(page, testCat, C, 'ans-C');
  const cardQs = testCat.locator('.admin-card .admin-card-q');
  await expect(cardQs).toHaveCount(3);
  await expect(cardQs.nth(0)).toHaveText(A);
  await expect(cardQs.nth(1)).toHaveText(B);
  await expect(cardQs.nth(2)).toHaveText(C);

  // PRESLOŽI: ↑ na zadnjoj kartici (C) → reorderCards op → red A, C, B.
  await testCat.locator('.admin-card', { hasText: C }).locator('[data-admin-move="up"]').click();
  await expect(cardQs.nth(0)).toHaveText(A);
  await expect(cardQs.nth(1)).toHaveText(C);
  await expect(cardQs.nth(2)).toHaveText(B);

  // Rubne strelice disabled: prva kartica (A) ↑ disabled, zadnja (B) ↓ disabled.
  await expect(testCat.locator('.admin-card').first().locator('[data-admin-move="up"]')).toBeDisabled();
  await expect(testCat.locator('.admin-card').last().locator('[data-admin-move="down"]')).toBeDisabled();

  // OBRIŠI: 🗑 na C → potvrda → removeCard op → 2 kartice (A, B).
  await testCat.locator('.admin-card', { hasText: C }).locator('[data-admin-del]').click();
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await expect(cardQs).toHaveCount(2);
  await expect(cardQs.nth(0)).toHaveText(A);
  await expect(cardQs.nth(1)).toHaveText(B);

  // Pospremi: Odbaci (draft je dirty od ops) → čist izlaz; staging nikad nije pisan.
  await page.click('#adminDiscardBtn');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#adminDraftBtn');
});
