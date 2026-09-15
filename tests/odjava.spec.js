// F2/4 — STRANICA ODJAVE (`odjava.html`), bez prijave i bez mreže.
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Do ove stranice vodi poveznica „Odjavi se" iz SVAKOG maila. Tvrdi se ono što korisnik vidi:
//   ① otvaranje stranice NE odjavljuje (nijedan zahtjev prema funkciji dok se ne klikne) — skeneri
//     pošte otvaraju svaku poveznicu iz maila;
//   ② klik šalje token i pokazuje „Gotovo", a gumb ostaje ugašen;
//   ③ krivotvoren/stari token → jasna poruka (ne „nešto je pošlo po zlu");
//   ④ poveznica bez tokena → gumb ugašen i objašnjenje.
// Odgovor funkcije se PODMEĆE (`page.route`): pravi potpis mjeri `npm run test:mail` na stagingu.
const { test, expect } = require('@playwright/test');

const FN = /\/functions\/v1\/mail-unsubscribe/;

async function otvori(page, upit) {
  await page.addInitScript(() => { try { localStorage.setItem('sokrat-ui-lang', 'hr'); } catch (e) { /* private */ } });
  await page.goto('/odjava.html' + (upit || ''));
  await page.waitForFunction(() => typeof window.t === 'function');
}

test('① otvaranje ne odjavljuje · ② klik odjavi i pokaže „Gotovo"', async ({ page }) => {
  const pozivi = [];
  await page.route(FN, (route) => {
    pozivi.push({ metoda: route.request().method(), tijelo: route.request().postData() });
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await otvori(page, '?t=abc.def');
  await expect(page.locator('h1')).toHaveText('Odjava od obavijesti mailom');
  await page.waitForTimeout(500);
  expect(pozivi, 'stranica je sama zvala funkciju prije klika').toEqual([]);

  await page.click('#unsubBtn');
  await expect(page.locator('#unsubStatus')).toHaveAttribute('data-state', 'done');
  await expect(page.locator('#unsubStatus')).toContainText('Gotovo');
  await expect(page.locator('#unsubBtn')).toBeDisabled();
  expect(pozivi.length).toBe(1);
  expect(pozivi[0].metoda).toBe('POST');
  expect(JSON.parse(pozivi[0].tijelo)).toEqual({ t: 'abc.def' });
});

test('③ neispravan potpis → jasna poruka, gumb ostaje ugašen', async ({ page }) => {
  await page.route(FN, (route) => route.fulfill({ status: 400, contentType: 'application/json', body: '{"error":"bad_token"}' }));
  await otvori(page, '?t=abc.krivo');
  await page.click('#unsubBtn');
  await expect(page.locator('#unsubStatus')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#unsubStatus')).toContainText('nije valjana');
});

test('greška poslužitelja → „pokušaj ponovno" i gumb se vraća', async ({ page }) => {
  await page.route(FN, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"update_failed"}' }));
  await otvori(page, '?t=abc.def');
  await page.click('#unsubBtn');
  await expect(page.locator('#unsubStatus')).toContainText('pokušaj ponovno');
  await expect(page.locator('#unsubBtn')).toBeEnabled();
});

test('④ poveznica bez tokena → gumb ugašen i objašnjenje', async ({ page }) => {
  await otvori(page, '');
  await expect(page.locator('#unsubBtn')).toBeDisabled();
  await expect(page.locator('#unsubStatus')).toContainText('nije potpuna');
});
