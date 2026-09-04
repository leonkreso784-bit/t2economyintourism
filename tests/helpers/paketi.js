/**
 * ČEKANJE NA PAKET — pomoćnik za testove koji dosežu globale iz `js/loader.js`.
 *
 * ⚠️ ZAŠTO POSTOJI: do cigle „učitavanje po ruti" su SVE skripte stajale u `index.html`, pa je
 * `page.goto('/')` značio i „sve je na `window`". Otkad načini učenja, profil, materijali i
 * polica stižu tek na svom događaju, test koji odmah nakon otvaranja naslovnice čeka
 * `window.startQuiz` ili `window.SokratAdmin` čeka nešto što ondje NEĆE doći — i pada tek na
 * dvominutnom isteku, bez ijedne korisne poruke.
 *
 * Preduvjet time postaje IZRIČIT: test kaže koju površinu ispituje. To nije popuštanje mjere
 * nego njezino pojašnjenje — proizvod se ponaša isto, samo se u testu vidi ono što u
 * pregledniku radi klik korisnika.
 *
 * Imena paketa: `study` · `blind-map` · `exercises` · `polica` · `materials` · `profile` · `sync`.
 */
async function ucitajPakete(page, imena) {
  await page.waitForFunction(() => !!window.SokratLoad, null, { timeout: 20000 });
  await page.evaluate((n) => Promise.all(n.map((x) => window.SokratLoad.paket(x))), imena);
}

module.exports = { ucitajPakete };
