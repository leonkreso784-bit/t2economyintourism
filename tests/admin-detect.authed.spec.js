// POZITIVAN admin-put — traži pravu admin-sesiju (iz storageState, `authenticated` projekt).
// Ovo je pokrivenost koja je FALILA kad je window.SokratAuth bug pustio isAdmin=false kroz
// SVE testove (BUG-018): stari testovi provjeravali su samo isAdmin===false (odjavljen).
// Pokreće se samo kad je test-admin credential postavljen (vidi playwright.config.js).
//
// U3 (draft-mod): edit-gumbi postoje SAMO u draft-modu → testovi prvo ulaze u draft
// („Uredi lekciju" povlači payload iz BAZE — staging mora biti seedan: `node scripts/seed-staging.js te2`).
// Editori spremaju U DRAFT (bez mreže) → smijemo i spremiti pa ODBACITI (ništa ne ode u bazu).
const { test, expect } = require('@playwright/test');
// T6: editor ima vlastitu adresu — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriAdminPreglednik } = require('./helpers/studio-entry');

/** Otvori admin stranicu → odaberi te2 + prvu lekciju → uđi u draft-mod (edit-gumbi vidljivi). */
async function openLessonInDraftMode(page) {
  await otvoriAdminPreglednik(page);
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 (seedan na staging), inače prvi predmet.
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

  // U3: „Uredi lekciju" (admin-only) → draft-mod (payload iz baze → SokratDraft.begin).
  await page.waitForSelector('#adminDraftBtn', { timeout: 20000 });
  await page.click('#adminDraftBtn');
  await page.waitForSelector('#adminCards .admin-edit-btn', { timeout: 20000 });
}

test('admin sesija: SokratAdmin.isAdmin() = true + body.sokrat-is-admin', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.SokratAdmin);

  const res = await page.evaluate(async () => {
    await window.SokratAdmin.refresh(); // recompute s obnovljenom sesijom iz storageState
    return {
      isAdmin: window.SokratAdmin.isAdmin(),
      bodyClass: document.body.classList.contains('sokrat-is-admin'),
    };
  });

  expect(res.isAdmin).toBe(true);   // storageState je vratio admin-sesiju
  expect(res.bodyClass).toBe(true); // .admin-only elementi otkriveni
});

test('U3 — admin: „Uredi lekciju" ulazi u draft-mod; edit-gumbi vidljivi TEK u draftu', async ({ page }) => {
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
  await page.waitForSelector('#adminCards .admin-card', { timeout: 20000 });

  // PRIJE draft-moda: viewer read-only (nema edit-gumba), ali postoji „Uredi lekciju".
  expect(await page.locator('#adminCards .admin-edit-btn').count()).toBe(0);
  await page.waitForSelector('#adminDraftBtn');

  // Ulaz u draft-mod → traka aktivna + edit-gumbi vidljivi.
  await page.click('#adminDraftBtn');
  await page.waitForSelector('.admin-editbar.is-active', { timeout: 20000 });
  await page.waitForSelector('#adminCards .admin-edit-btn');
  expect(await page.locator('#adminCards .admin-edit-btn').count()).toBeGreaterThan(0);
  // Objavi disabled dok nema promjena.
  expect(await page.locator('#adminPublishBtn').isDisabled()).toBe(true);
});

test('U3 — draft-tok: edit kartice → spremi u draft (brojač 1, Objavi enabled) → Odbaci (ništa u bazu)', async ({ page }) => {
  await openLessonInDraftMode(page);

  // Uredi prvu karticu → spremi U DRAFT (bez mreže).
  await page.locator('#adminCards [data-admin-edit][data-type="flashcard"]').first().click();
  await page.waitForSelector('#adminEditModal #adminEditQ');
  await page.fill('#adminEditQ', 'DRAFT-TEST pitanje (ne objavljuje se)');
  await page.click('#adminEditSave');

  // Traka: brojač = 1, Objavi enabled; viewer renderira draftanu vrijednost.
  await page.waitForSelector('.admin-editbar__count');
  expect(await page.locator('.admin-editbar__count').textContent()).toBe('1');
  expect(await page.locator('#adminPublishBtn').isDisabled()).toBe(false);
  await expect(page.locator('#adminCards .admin-card-q').first()).toContainText('DRAFT-TEST');

  // Autosave postoji u localStorage (preživio bi refresh).
  const hasAutosave = await page.evaluate(() =>
    Object.keys(localStorage).some((k) => k.indexOf('sokrat-draft:') === 0));
  expect(hasAutosave).toBe(true);

  // Odbaci (potvrdi u <sokrat-confirm>) → izlaz iz draft-moda, original vraćen, autosave očišćen.
  await page.click('#adminDiscardBtn');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#adminDraftBtn');
  await expect(page.locator('#adminCards .admin-card-q').first()).not.toContainText('DRAFT-TEST');
  const stillAutosaved = await page.evaluate(() =>
    Object.keys(localStorage).some((k) => k.indexOf('sokrat-draft:') === 0));
  expect(stillAutosaved).toBe(false);
});

test('F4.4/U3 — admin: quiz edit-gumb otvara quiz-editor s redovima opcija (bez spremanja)', async ({ page }) => {
  await openLessonInDraftMode(page);
  await page.waitForSelector('#adminCards [data-admin-edit][data-type="quiz"]');

  // Klik na prvi quiz edit-gumb → editor se otvori s ≥2 reda opcija i jednim odabranim „točan".
  await page.locator('#adminCards [data-admin-edit][data-type="quiz"]').first().click();
  await page.waitForSelector('#adminQuizModal .admin-quiz-optrow');

  const res = await page.evaluate(() => ({
    modalOpen: (function () { const m = document.getElementById('adminQuizModal'); return !!(m && typeof m.isOpen === 'function' && m.isOpen()); })(),
    optRows: document.querySelectorAll('#adminQuizModal .admin-quiz-optrow').length,
    checkedRadios: document.querySelectorAll('#adminQuizModal input[name="adminQuizCorrect"]:checked').length,
    questionFilled: (document.getElementById('adminQuizQ').value || '').length > 0,
  }));
  expect(res.modalOpen).toBe(true);
  expect(res.optRows).toBeGreaterThanOrEqual(2); // 2–6 opcija
  expect(res.checkedRadios).toBe(1);             // točno jedan „točan"
  expect(res.questionFilled).toBe(true);         // pitanje prefilano

  await page.evaluate(() => { const m = document.getElementById('adminQuizModal'); if (m) m.close(); });
});

test('F4.4/U3 — admin: fill edit-gumb otvara fill-editor s rečenicom (blank) + odgovorom (bez spremanja)', async ({ page }) => {
  await openLessonInDraftMode(page);
  await page.waitForSelector('#adminCards [data-admin-edit][data-type="fill"]');

  await page.locator('#adminCards [data-admin-edit][data-type="fill"]').first().click();
  await page.waitForSelector('#adminFillModal #adminFillS');

  const res = await page.evaluate(() => ({
    modalOpen: (function () { const m = document.getElementById('adminFillModal'); return !!(m && typeof m.isOpen === 'function' && m.isOpen()); })(),
    sentenceHasBlank: (document.getElementById('adminFillS').value || '').indexOf('_______') !== -1,
    answerFilled: (document.getElementById('adminFillA').value || '').length > 0,
  }));
  expect(res.modalOpen).toBe(true);
  expect(res.sentenceHasBlank).toBe(true);  // rečenica prefilana + sadrži prazninu
  expect(res.answerFilled).toBe(true);      // odgovor prefilan

  await page.evaluate(() => { const m = document.getElementById('adminFillModal'); if (m) m.close(); });
});

test('F4.4/U3 — admin: learn edit-gumb otvara learn-editor s naslovom + HTML sadržajem (bez spremanja)', async ({ page }) => {
  await openLessonInDraftMode(page);
  await page.waitForSelector('#adminCards [data-admin-edit][data-type="learn"]');

  await page.locator('#adminCards [data-admin-edit][data-type="learn"]').first().click();
  await page.waitForSelector('#adminLearnModal #adminLearnC');

  const res = await page.evaluate(() => ({
    modalOpen: (function () { const m = document.getElementById('adminLearnModal'); return !!(m && typeof m.isOpen === 'function' && m.isOpen()); })(),
    contentFilled: (document.getElementById('adminLearnC').value || '').length > 0,
    contentHasHtml: (document.getElementById('adminLearnC').value || '').indexOf('<') !== -1,
  }));
  expect(res.modalOpen).toBe(true);
  expect(res.contentFilled).toBe(true);     // HTML sadržaj prefilan
  expect(res.contentHasHtml).toBe(true);    // sirovi HTML (npr. <h3>/<p>)

  await page.evaluate(() => { const m = document.getElementById('adminLearnModal'); if (m) m.close(); });
});
