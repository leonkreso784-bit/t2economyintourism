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
