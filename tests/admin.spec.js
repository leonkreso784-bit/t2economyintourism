// F4.3a — SokratAdmin: detekcija admina + otkrivanje admin-only UI.
// Prava zaštita je RLS (F4.1/F4.2, dokazano SQL-om); ovdje testiramo UX-plumbing i,
// sigurnosno najbitnije, DEFAULT: bez admin-sesije .admin-only ostaje skriven.
// Pozitivan slučaj (admin VIDI) traži pravu Supabase sesiju → verificira se ručno/na preview-u (F4.3b).
const { test, expect } = require('@playwright/test');

test('SokratAdmin postoji i bez sesije isAdmin() = false', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.SokratAdmin);

  const res = await page.evaluate(async () => {
    // pričekaj da početni refresh() (async RPC/no-session) slegne
    await window.SokratAdmin.refresh();
    return {
      hasModule: !!window.SokratAdmin,
      hasRefresh: typeof window.SokratAdmin.refresh === 'function',
      hasApply: typeof window.SokratAdmin.applyVisibility === 'function',
      isAdmin: window.SokratAdmin.isAdmin(),
    };
  });

  expect(res.hasModule).toBe(true);
  expect(res.hasRefresh).toBe(true);
  expect(res.hasApply).toBe(true);
  expect(res.isAdmin).toBe(false); // nema sesije → nije admin
});

test('.admin-only ostaje SKRIVEN za ne-admina (sigurnosni default)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.SokratAdmin);

  const res = await page.evaluate(async () => {
    const d = document.createElement('div');
    d.className = 'admin-only';
    d.textContent = 'tajni admin gumb';
    document.body.appendChild(d);
    await window.SokratAdmin.refresh(); // primijeni vidljivost prema (ne-admin) statusu
    return {
      inlineDisplay: d.style.display,
      computedDisplay: getComputedStyle(d).display,
      bodyHasAdminClass: document.body.classList.contains('sokrat-is-admin'),
    };
  });

  expect(res.inlineDisplay).toBe('none');       // ne-admin → skriveno
  expect(res.computedDisplay).toBe('none');
  expect(res.bodyHasAdminClass).toBe(false);    // body nije označen kao admin
});

test('#admin-page je SKRIVEN dok nije aktivan (regresija: ne curi na dno stranice)', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#landing-page.active');
  const res = await page.evaluate(() => {
    const ap = document.getElementById('admin-page');
    return {
      exists: !!ap,
      active: ap ? ap.classList.contains('active') : null,
      display: ap ? getComputedStyle(ap).display : null,
    };
  });
  expect(res.exists).toBe(true);
  expect(res.active).toBe(false);       // na landingu admin-page NIJE aktivan
  expect(res.display).toBe('none');     // → mora biti skriven (inače „Admin" curi na dno)
});

test('F4.3b — admin viewer: navigateTo(admin) renderira picker predmeta → lekcija', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && !!window.SokratContent);

  // Sadržaj je javan → viewer se renderira i bez admin-sesije (ulaz je admin-only, write je RLS-zaštićen).
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  const subjectCount = await page.evaluate(() => document.querySelectorAll('#adminSubjectSel option').length);
  expect(subjectCount).toBeGreaterThan(1); // placeholder + stvarni predmeti iz catalog-a

  // Odabir predmeta → lekcije se popune i select se otključa.
  const res = await page.evaluate(() => {
    const sel = document.getElementById('adminSubjectSel');
    const opt = sel.querySelector('option[value]:not([value=""])');
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change'));
    const lessonSel = document.getElementById('adminLessonSel');
    return {
      subjectPicked: sel.value !== '',
      lessonEnabled: !lessonSel.disabled,
      lessonOptions: lessonSel.querySelectorAll('option').length,
    };
  });
  expect(res.subjectPicked).toBe(true);
  expect(res.lessonEnabled).toBe(true);
  expect(res.lessonOptions).toBeGreaterThan(1); // placeholder + lekcije
});
