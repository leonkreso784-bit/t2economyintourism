// POZITIVAN admin-put — traži pravu admin-sesiju (iz storageState, `authenticated` projekt).
// Ovo je pokrivenost koja je FALILA kad je window.SokratAuth bug pustio isAdmin=false kroz
// SVE testove (BUG-018): stari testovi provjeravali su samo isAdmin===false (odjavljen).
// Pokreće se samo kad je test-admin credential postavljen (vidi playwright.config.js).
const { test, expect } = require('@playwright/test');

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

test('admin viewer: edit-gumbi (.admin-edit-btn) VIDLJIVI adminu na pravoj lekciji', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // Odaberi te2 (ako postoji), inače prvi predmet.
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

  const editBtns = await page.locator('#adminCards .admin-edit-btn').count();
  expect(editBtns).toBeGreaterThan(0); // admin VIDI edit-gumbe (pozitivan put — prije netestiran)
});

test('F4.4 — admin: quiz edit-gumb otvara quiz-editor s redovima opcija (bez spremanja)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 First Midterm ima quiz (fundamentals).
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
  await page.waitForSelector('#adminCards [data-admin-edit][data-type="quiz"]', { timeout: 20000 });

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

  // Zatvori bez spremanja (write nije automatiziran — dijeljena prod baza).
  await page.evaluate(() => { const m = document.getElementById('adminQuizModal'); if (m) m.close(); });
});

test('F4.4 — admin: fill edit-gumb otvara fill-editor s rečenicom (blank) + odgovorom (bez spremanja)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 First Midterm ima fillBlanks (fundamentals).
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
  await page.waitForSelector('#adminCards [data-admin-edit][data-type="fill"]', { timeout: 20000 });

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
