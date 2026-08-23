// JEDNO MJESTO KOJE ZNA GDJE EDITOR ŽIVI (T6, spec §9.13).
//
// Do T6 je editor bio deveta sekcija u `index.html`, pa je svaki spec ulazio ovako:
//     await page.goto('/'); await page.waitForFunction(() => !!window.SokratStudio …);
//     await page.evaluate(() => navigateTo('editor'));
// Tih „ulaza" bilo je sedamnaest, svaki sa svojom kopijom istog znanja — pa je preseljenje
// editora na vlastitu adresu značilo sedamnaest izmjena. Ovdje je to znanje jedno.
//
// ⚠️ ČEKA SE STANJE, NE VRIJEME: stranica editora prvo razriješi identitet (čuvar), pa tek
// onda nacrta Studio. Sekcija s klasom `active` je zato signal da je odluka pala; fiksno
// čekanje bi mjerilo mrežu (T0/K6b).
//
// ⚠️ TRAKA PRIVOLE se gasi prije učitavanja: na telefonu prekriva donji dio ekrana i miješa
// se u mjerenja rasporeda (T4).

const CEKANJE = 30000;

async function bezTrakePrivole(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
  });
}

/** Studio nad KATALOGOM (admin). Traži admin-sesiju — inače čuvar odbija. */
async function otvoriStudio(page) {
  await bezTrakePrivole(page);
  await page.goto('/editor.html');
  await page.waitForSelector('#editor-page.active', { timeout: CEKANJE });
}

/** Studio nad VLASTITIM materijalom. Ime dolazi iz baze, adresa nosi samo ID. */
async function otvoriCvor(page, nodeId) {
  await bezTrakePrivole(page);
  await page.goto('/editor.html?node=' + encodeURIComponent(nodeId));
  await page.waitForSelector('#editor-page.active #stCanvas', { timeout: CEKANJE });
}

/** Stari read-only preglednik sadržaja (#admin-page). */
async function otvoriAdminPreglednik(page) {
  await bezTrakePrivole(page);
  await page.goto('/editor.html?view=admin');
  await page.waitForSelector('#admin-page.active #adminSubjectSel', { timeout: CEKANJE });
}

/** Aplikacija (polica) — ondje žive `SokratMaterials` i ostatak proizvoda. */
async function otvoriAplikaciju(page) {
  await bezTrakePrivole(page);
  await page.goto('/');
  await page.waitForFunction(() => typeof window.navigateTo === 'function');
}

module.exports = { otvoriStudio, otvoriCvor, otvoriAdminPreglednik, otvoriAplikaciju, bezTrakePrivole };
