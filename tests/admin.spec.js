// F4.3a — SokratAdmin: detekcija admina + otkrivanje admin-only UI.
// Prava zaštita je RLS (F4.1/F4.2, dokazano SQL-om); ovdje testiramo UX-plumbing i,
// sigurnosno najbitnije, DEFAULT: bez admin-sesije .admin-only ostaje skriven.
//
// ⚠️ T6 JE OVU DATOTEKU PREPOLOVIO, I TO ODLUKOM, NE ZATO ŠTO JE NEŠTO PALO.
// Pet tvrdnji je počivalo na premisi „viewer se renderira i bez admin-sesije" (sadržaj je
// javan, ulaz je bio samo skriveni gumb). Otkad editor ima vlastitu adresu, do preglednika
// se dolazi kroz ČUVARA, a on bez admin-prava ne pušta — premisa je nestala po dizajnu.
// To je STROŽE ponašanje: dotad je svatko mogao pozvati `navigateTo('admin')` iz konzole i
// dobiti nacrtan preglednik (upis je i tada branio RLS — mijenja se dubina obrane).
//
// GDJE JE POKRIVENOST OTIŠLA:
//   • preglednik se crta / edit-gumbi ovise o draft-modu → `card-limits`, `item-ops`,
//     `category-ops` (.authed), kroz `otvoriAdminPreglednik()`;
//   • neprijavljeni ga NE dobije → `editor-page.spec.js`, na četiri telefonska profila;
//   • „natrag" iz editora ne pravi petlju (BUG-019) → `reachability.authed` + prava
//     povijest preglednika, jer editor više nije stranica ove aplikacije.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');


test('SokratAdmin postoji i bez sesije isAdmin() = false', async ({ page }) => {
  await page.goto('/');
  // `admin-reveal.js` od učitavanja po ruti stiže s paketom `profile` — jedinom površinom
  // koja danas ima `.admin-only` UI. Sigurnosni default se time NE mijenja: dok modul ne
  // stigne, ništa se ne otkriva (fail-closed), a ovaj test upravo to i mjeri poslije.
  await ucitajPakete(page, ['profile']);
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
  // `admin-reveal.js` od učitavanja po ruti stiže s paketom `profile` — jedinom površinom
  // koja danas ima `.admin-only` UI. Sigurnosni default se time NE mijenja: dok modul ne
  // stigne, ništa se ne otkriva (fail-closed), a ovaj test upravo to i mjeri poslije.
  await ucitajPakete(page, ['profile']);
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

test('T6: aplikacija UOPĆE nema editorske sekcije (ne skrivene — nepostojeće)', async ({ page }) => {
  // Do T6 je ovdje stajala tvrdnja „#admin-page je skriven dok nije aktivan", jer je
  // sekcija stajala u dokumentu i znala „procuriti" na dno stranice. Od T6 se taj kvar
  // ne popravlja nego je NEMOGUĆ: sekcije su otišle na `editor.html`. Slabija tvrdnja
  // (skriven) zamijenjena je jačom (ne postoji) — i ta jača ujedno čuva isporuku cigle.
  await page.goto('/');
  await page.waitForSelector('#landing-page.active');
  const res = await page.evaluate(() => ({
    admin: !!document.getElementById('admin-page'),
    editor: !!document.getElementById('editor-page'),
    studio: typeof window.SokratStudio,
    draft: typeof window.SokratDraft
  }));
  expect(res.admin, '#admin-page je opet u aplikaciji').toBe(false);
  expect(res.editor, '#editor-page je opet u aplikaciji').toBe(false);
  expect(res.studio, 'Studio se opet učitava posjetitelju').toBe('undefined');
  expect(res.draft, 'draft-store se opet učitava posjetitelju').toBe('undefined');
});
