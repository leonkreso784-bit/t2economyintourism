// Regresija BUG-023: povratak u OSOBNI MATERIJAL ruši spremanje napretka.
//
// Aplikacija pamti zadnju poziciju (`sokrat-last-position`) i vraća te na nju.
// Katalog-predmeti su u `subjectDataMap` od učitavanja skripte, ali OSOBNI MATERIJALI
// su sintetički subjekti (`node:<uuid>`) koje `SokratMaterials` upiše u mapu TEK kad
// se otvori profil — asinkrono, uz prijavu i mrežu.
//
// `restoreLastPosition` čita localStorage SINKRONO i odmah odnavigira. Za node-poziciju
// to znači: study-stranica se PRIKAŽE, `AppState.nav.subject` se POSTAVI, a subjekta
// nema u mapi → svako `subjectDataMap[subject].storageKey` puca (analytics, storage,
// naslov na home-u).
//
// Bez popravka OBA testa padaju: prvi jer se otvori prazna study-stranica,
// drugi jer pomoćne funkcije bacaju umjesto da tiho ne rade ništa.
const { test, expect } = require('@playwright/test');

const NEPOSTOJEĆI = 'node:11111111-2222-3333-4444-555555555555';

/** Upiši zadnju poziciju TOČNO u obliku koji `saveCurrentPosition` stvarno zapisuje. */
async function zapisiPoziciju(page, subject) {
  await page.addInitScript(([sub]) => {
    try {
      localStorage.setItem('sokrat-cookie-consent', 'denied');
      localStorage.setItem('sokrat-last-position', JSON.stringify({
        page: 'study', subject: sub, lesson: 'content',
        section: 'quiz', category: 'all', timestamp: Date.now()
      }));
    } catch (e) { /* private mode */ }
  }, [subject]);
}

test('obnova pozicije NE otvara study za subjekt kojeg nema u mapi (BUG-023)', async ({ page }) => {
  await zapisiPoziciju(page, NEPOSTOJEĆI);
  await page.goto('/');
  await page.waitForFunction(() => window.AppState && window.navigateTo);
  // Obnova se dogodi pri inicijalizaciji; ostavi joj vremena da odradi svoje.
  await page.waitForTimeout(1200);

  const stanje = await page.evaluate(() => ({
    subject: AppState.nav.subject,
    uMapi: !!(typeof subjectDataMap !== 'undefined' && subjectDataMap[AppState.nav.subject]),
    studyVidljiv: !!document.querySelector('#study-page.active')
  }));

  // Jezgra regresije: nikad ne prikazuj study za subjekt koji ne postoji.
  expect(
    stanje.studyVidljiv && !stanje.uMapi,
    'otvorena je study-stranica za subjekt kojeg nema u `subjectDataMap` — prazna i puknuta'
  ).toBe(false);
});

test('pomoćne funkcije ne bacaju ni za nepoznat subjekt (obrana u dubini, BUG-023)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.AppState && window.saveProgress && window.saveAnalytics);

  // Namjerno postavi subjekt kojeg NEMA u mapi i pozovi sve što čita `storageKey`.
  // Funkcija za spremanje ne smije rušiti stranicu — ni za jedan ulaz, bez obzira odakle je došao.
  const greske = await page.evaluate((sub) => {
    AppState.nav.subject = sub;
    const out = {};
    for (const fn of ['loadProgress', 'saveProgress', 'loadAnalytics', 'saveAnalytics', 'updateHomeStats']) {
      try { if (typeof window[fn] === 'function') window[fn](); out[fn] = null; }
      catch (e) { out[fn] = e.message; }
    }
    return out;
  }, NEPOSTOJEĆI);

  for (const [fn, greska] of Object.entries(greske)) {
    expect(greska, `${fn}() baca na nepoznatom subjektu: ${greska}`).toBeNull();
  }
});
