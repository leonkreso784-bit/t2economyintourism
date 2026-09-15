/**
 * RADNJA IZ „⋯" — pomoćnik za specove koji na retku stabla „Mojih materijala" traže radnju.
 *
 * ⚠️ ZAŠTO POSTOJI: do F2/5b (2026-09-15) je svaki redak nosio pet ikona (Uči · Uredi · Preimenuj ·
 * Obriši · …) i specovi su ih klikali izravno. Otkad redak nosi JEDAN „⋯" (Leon, anketa 14.09.;
 * na 393 px su ikone rezale ime na 6–8 znakova), radnje žive u izborniku — i to s ISTIM `data-mm-*`
 * atributima, pa se mijenja samo put do njih: otvori „⋯", pa klikni stavku. Izbornik je `popover`
 * čiji DOM ostaje u retku, pa selektor ostaje vezan na redak (`row.locator(...)`).
 *
 * @param {import('@playwright/test').Locator} row  redak (`.mm-row[data-mm-id="…"]`)
 * @param {string} stavka  selektor stavke, npr. `[data-mm-open]`, `[data-mm-new-in="study"]`
 */
async function radnjaRetka(row, stavka) {
  await row.locator('[data-mm-more]').click();
  await row.locator('.mm-menu ' + stavka).click();
}

module.exports = { radnjaRetka };
