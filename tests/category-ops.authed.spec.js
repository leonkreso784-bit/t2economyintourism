// U6d — KATEGORIJE-UI E2E (STAGING): dodaj → uredi → presloži → obriši kategoriju.
// Trajni regresijski spec (pravilo #8: write/draft tokovi se automatiziraju vs STAGING) —
// pokreće se SAMO u `authenticated` projektu sa STAGING_* env (staging seedan: seed-staging.js te2).
//
// SVE ostaje u DRAFTU (nikad se ne objavljuje) → staging DB je NETAKNUT; provjeravamo da editor-ops
// (addCategory/updateCategory/reorderCategories/removeCategory) ispravno mijenjaju working-render.
const { test, expect } = require('@playwright/test');
// T6: editor ima vlastitu adresu — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriAdminPreglednik } = require('./helpers/studio-entry');

// Dijeljeni prefiks (uvijek nalazi test-kategoriju bez obzira na rename); orig/renamed su distinktni.
const PREFIX = 'U6DKAT';
const NAME = PREFIX + '-orig';
const NAME2 = PREFIX + '-renamed';

/** Otvori admin → te2 + prva lekcija → uđi u draft-mod (isti helper kao publish-rpc/admin-detect spec). */
async function openLessonInDraftMode(page) {
  await otvoriAdminPreglednik(page);
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

/** Naslovi svih kategorija (redoslijedom rendera) — za provjeru preslagivanja. */
function catTitles(page) {
  return page.locator('#adminCards .admin-cat .profile-card-title').allTextContents();
}

test('U6d — kategorija: dodaj → uredi → presloži → obriši (draft-only, staging netaknut)', async ({ page }) => {
  await openLessonInDraftMode(page);

  const nCats = () => page.locator('#adminCards .admin-cat').count();
  const initial = await nCats();
  expect(initial).toBeGreaterThan(0);
  // uvijek nalazi našu test-kategoriju (PREFIX preživi rename); mora je NA POČETKU biti 0
  const testCat = page.locator('#adminCards .admin-cat', { hasText: PREFIX });
  await expect(testCat).toHaveCount(0);

  // 1) DODAJ kategoriju → addCategory op; prazna kategorija pokazuje sva tri „Dodaj" moda.
  await page.click('[data-admin-cat-add]');
  await page.waitForSelector('#adminCatModal #adminCatName');
  await page.fill('#adminCatName', NAME);
  await page.fill('#adminCatIcon', 'fa-flask');
  await page.click('#adminCatSave');
  await page.waitForFunction((n) => document.querySelectorAll('#adminCards .admin-cat').length === n, initial + 1);
  await expect(testCat).toHaveCount(1);
  await expect(testCat.locator('[data-admin-add][data-type="flashcard"]')).toHaveCount(1);
  await expect(testCat.locator('[data-admin-add][data-type="quiz"]')).toHaveCount(1);
  await expect(testCat.locator('[data-admin-add][data-type="fill"]')).toHaveCount(1);
  // editbar postao aktivan (draft dirty) i broji ≥1 op
  await expect(page.locator('.admin-editbar.is-active')).toBeVisible();
  expect(Number(await page.locator('.admin-editbar__count').textContent())).toBeGreaterThanOrEqual(1);

  // dodana kategorija = ZADNJA (addCategory append)
  let titles = await catTitles(page);
  expect(titles.findIndex((t) => t.includes(NAME))).toBe(titles.length - 1);

  // 2) UREDI kategoriju → updateCategory op (rename); modal dolazi prefilled starim nazivom.
  await testCat.locator('[data-admin-cat-edit]').click();
  await page.waitForSelector('#adminCatModal #adminCatName');
  expect(await page.inputValue('#adminCatName')).toBe(NAME);
  await page.fill('#adminCatName', NAME2);
  await page.click('#adminCatSave');
  await page.waitForFunction(
    (t) => [...document.querySelectorAll('#adminCards .admin-cat .profile-card-title')].some((h) => h.textContent.includes(t)),
    NAME2
  );
  await expect(page.locator('#adminCards .admin-cat', { hasText: NAME2 })).toHaveCount(1);
  await expect(page.locator('#adminCards .admin-cat', { hasText: NAME })).toHaveCount(0); // stari naziv nestao

  // 3) PRESLOŽI → reorderCategories op: ↑ pomakne zadnju za jedno gore (predzadnja).
  await testCat.locator('[data-admin-cat-move="up"]').click();
  await page.waitForFunction((t) => {
    const ts = [...document.querySelectorAll('#adminCards .admin-cat .profile-card-title')].map((h) => h.textContent);
    return ts.findIndex((x) => x.includes(t)) === ts.length - 2;
  }, NAME2);
  titles = await catTitles(page);
  expect(titles.findIndex((t) => t.includes(NAME2))).toBe(titles.length - 2);

  // 4) OBRIŠI → removeCategory op (uz potvrdu) → kategorija nestaje, natrag na početni broj.
  await testCat.locator('[data-admin-cat-del]').click();
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForFunction((n) => document.querySelectorAll('#adminCards .admin-cat').length === n, initial);
  await expect(testCat).toHaveCount(0);

  // 5) Pospremi: Odbaci (draft je dirty od ops) → čist izlaz; staging nikad nije pisan.
  await page.click('#adminDiscardBtn');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#adminDraftBtn');
});
