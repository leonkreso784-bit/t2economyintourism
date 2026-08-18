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

test('BUG-019 — back iz admina NE stvara petlju profil ⇄ admin (back s profila vraća na početnu)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function');
  await page.waitForSelector('#landing-page.active');

  // Korisnikov tijek: početna → profil → admin.
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#profile-page.active');
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active');

  // Back iz admina → profil (pravi klik na gumb).
  await page.click('#pathbarBack');   // K2b: jedan gumb natrag za cijelu aplikaciju
  await page.waitForSelector('#profile-page.active');

  // Back s profila → POČETNA, ne natrag u admin (prije fixa: profil ⇄ admin zauvijek).
  await page.click('#pathbarBack');
  await page.waitForSelector('#landing-page.active');
  const res = await page.evaluate(() => ({
    landingActive: document.getElementById('landing-page').classList.contains('active'),
    adminActive: document.getElementById('admin-page').classList.contains('active'),
    profileActive: document.getElementById('profile-page').classList.contains('active'),
  }));
  expect(res.landingActive).toBe(true);
  expect(res.adminActive).toBe(false);
  expect(res.profileActive).toBe(false);
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

test('F4.3c-1 — edit-gumbi (.admin-edit-btn) NISU vidljivi ne-adminu; viewer i dalje renderira kartice', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && !!window.SokratContent && !!window.SokratAdmin);
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); }); // slegni (ne-admin) status
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // Odaberi prvi predmet, pa prvu NEonemogućenu lekciju → učitaj kartice.
  await page.evaluate(() => {
    const sel = document.getElementById('adminSubjectSel');
    const opt = sel.querySelector('option[value]:not([value=""])');
    sel.value = opt.value; sel.dispatchEvent(new Event('change'));
  });
  await page.waitForFunction(() => {
    const l = document.getElementById('adminLessonSel');
    return l && !l.disabled && !!l.querySelector('option[value]:not([value=""]):not([disabled])');
  });
  await page.evaluate(() => {
    const l = document.getElementById('adminLessonSel');
    const opt = l.querySelector('option[value]:not([value=""]):not([disabled])');
    l.value = opt.value; l.dispatchEvent(new Event('change'));
  });
  await page.waitForSelector('#adminCards .admin-card', { timeout: 15000 });

  const res = await page.evaluate(() => ({
    cards: document.querySelectorAll('#adminCards .admin-card').length,
    editBtns: document.querySelectorAll('#adminCards .admin-edit-btn').length,
    editModal: !!document.getElementById('adminEditModal'),
  }));
  expect(res.cards).toBeGreaterThan(0);   // viewer renderira sadržaj (javno čitanje / JSON fallback)
  expect(res.editBtns).toBe(0);           // ne-admin NE vidi edit-gumbe (RLS je prava zaštita, ovo je UX)
  expect(res.editModal).toBe(false);      // modal se ne kreira dok se ne klikne "edit"
});

test('F4.4 — quiz preview se renderira u vieweru (opcije + točan označen); quiz edit-gumbi skriveni ne-adminu', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && !!window.SokratContent && !!window.SokratAdmin);
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 First Midterm ima quiz (fundamentals) → deterministički izbor.
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
  await page.waitForSelector('#adminCards .admin-quiz-opts', { timeout: 15000 });

  const res = await page.evaluate(() => ({
    quizBlocks: document.querySelectorAll('#adminCards .admin-quiz-opts').length,
    correctMarks: document.querySelectorAll('#adminCards .admin-quiz-opts li.is-correct').length,
    quizEditBtns: document.querySelectorAll('#adminCards [data-admin-edit][data-type="quiz"]').length,
  }));
  expect(res.quizBlocks).toBeGreaterThan(0);    // quiz stavke se prikazuju
  expect(res.correctMarks).toBeGreaterThan(0);  // točan odgovor je označen
  expect(res.quizEditBtns).toBe(0);             // ne-admin NE vidi quiz edit-gumbe
});

test('F4.4 — fill preview se renderira (rečenica s prazninom); fill edit-gumbi skriveni ne-adminu', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && !!window.SokratContent && !!window.SokratAdmin);
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 First Midterm ima fillBlanks (fundamentals) → deterministički izbor.
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
  await page.waitForSelector('#adminCards .admin-card', { timeout: 15000 });

  const res = await page.evaluate(() => ({
    hasBlank: Array.from(document.querySelectorAll('#adminCards .admin-card-q')).some(function (el) { return el.textContent.indexOf('_______') !== -1; }),
    fillEditBtns: document.querySelectorAll('#adminCards [data-admin-edit][data-type="fill"]').length,
  }));
  expect(res.hasBlank).toBe(true);      // fill rečenica (s prazninom) je prikazana
  expect(res.fillEditBtns).toBe(0);     // ne-admin NE vidi fill edit-gumbe
});

test('F4.4 — learn preview se renderira (.admin-card--learn); learn edit-gumbi skriveni ne-adminu', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function' && !!window.SokratContent && !!window.SokratAdmin);
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');

  // te2 First Midterm — svaka kategorija ima learn.
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
  await page.waitForSelector('#adminCards .admin-card--learn', { timeout: 15000 });

  const res = await page.evaluate(() => ({
    learnBlocks: document.querySelectorAll('#adminCards .admin-card--learn').length,
    learnEditBtns: document.querySelectorAll('#adminCards [data-admin-edit][data-type="learn"]').length,
  }));
  expect(res.learnBlocks).toBeGreaterThan(0);   // learn preview se prikazuje
  expect(res.learnEditBtns).toBe(0);            // ne-admin NE vidi learn edit-gumbe
});
