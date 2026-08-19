// K3 · BRANA DOHVATLJIVOSTI — prijavljene površine (faza „KOSTUR", spec §8).
//
// Blizanac `reachability.spec.js`, s istom logikom u `helpers/reach-gate.js`. Postoji
// odvojeno iz istog razloga kao `a11y.authed.spec.js`: **polica, profil, admin i Studio
// se odjavljenom posjetitelju ne prikazuju**, pa ih odjavljena brana ne može ni vidjeti.
// To je bio nalaz C3 (spec §7.10): *prijavljene površine nisu imale nijedan vizualni
// gate*, i baš su ondje ležala četiri kvara koja su stajala na produkciji.
//
// ⚠️ OVDJE SE MJERI I STUDIJEVA VLASTITA TRAKA. `studio-chrome.authed.spec.js` provjerava
// da ondje ništa nije ODREZANO i da ljuska ne jede ekran; ovaj spec dodaje da ništa nije
// PREKRIVENO ni PREKLOPLJENO. To su tri različita mehanizma s istom posljedicom — gumb
// koji korisnik vidi, a ne može upotrijebiti (K2b · BUG-028 · BUG-029).
const { test, expect } = require('@playwright/test');
const G = require('./helpers/reach-gate');

/** Prijavljen admin; `refresh()` otključava `.admin-only` ulaze prije mjerenja. */
async function spremanAdmin(page) {
    await page.goto('/');
    await G.spreman(page);
    await page.waitForFunction(() => !!window.SokratAdmin);
    await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
}

test('① + ② kromo je dohvatljiv i na prijavljenim stranicama (320…430 px)', async ({ page }) => {
    const kvarovi = [];

    for (const w of G.SIRINE) {
        await page.setViewportSize({ width: w, height: 720 });
        await spremanAdmin(page);

        for (const s of G.STRANICE_PRIJAVLJENE) {
            await G.idiNa(page, s);
            const m = await G.mjeriKromo(page);

            if (m.vidljivih === 0) kvarovi.push(w + 'px ' + s + ': kromo NEMA nijednu vidljivu kontrolu');
            m.promasaji.forEach((p) => kvarovi.push(w + 'px ' + s + ' · promašaj: ' + p));
            m.preklopi.forEach((p) => kvarovi.push(w + 'px ' + s + ' · preklop: ' + p));
        }
    }

    expect(kvarovi, 'kontrole u kromu prijavljenih stranica').toEqual([]);
});

test('② Studijeva traka: radnje nad dokumentom se ne preklapaju ni ne skrivaju', async ({ page }) => {
    const kvarovi = [];

    for (const w of G.SIRINE) {
        await page.setViewportSize({ width: w, height: 800 });
        await spremanAdmin(page);
        await G.idiNa(page, 'editor');
        await page.waitForSelector('#editor-page.active');

        const m = await G.mjeriKromo(page, '#editor-page .st-topbar button, #editor-page .st-topbar a[href]');
        m.promasaji.forEach((p) => kvarovi.push(w + 'px Studio · promašaj: ' + p));
        m.preklopi.forEach((p) => kvarovi.push(w + 'px Studio · preklop: ' + p));
        // Nevidljive kontrole u Studijevoj traci su upravo kvar koji je K2b zatvorio
        // (`.st-chip` i `.st-iconbtn` su bile IZVAN ekrana na 390 px).
        m.nevidljivi.forEach((n) => kvarovi.push(w + 'px Studio · nedostupno: ' + n));
    }

    expect(kvarovi, 'radnje nad dokumentom koje korisnik ne može upotrijebiti').toEqual([]);
});

test('③ + ④ izlaz iz Studija vodi na policu, a lanac završava na landingu', async ({ page }) => {
    const greske = [];
    page.on('pageerror', (e) => greske.push(e.message));

    await page.setViewportSize({ width: 390, height: 844 });
    await spremanAdmin(page);

    // Put kojim ide korisnik: polica → editor. Tek tad Studio zna da je otvorio ČVOR,
    // pa `roditeljOd()` vrati policu umjesto profila (propust K2a zatvoren u K2b).
    await G.idiNa(page, 'materials');
    await page.evaluate(() => {
        AppState.nav.editorNode = { id: 'proba', name: 'Proba' };
        navigateTo('editor');
    });
    await page.waitForSelector('#editor-page.active');

    const lanac = await G.lanacNatrag(page);
    expect(lanac[0], 'krećemo iz editora').toBe('editor');
    expect(lanac[1], 'prvi izlaz iz editora vodi na POLICU, ne u profil (BUG-027)').toBe('materials');
    expect(lanac[lanac.length - 1], 'lanac: ' + lanac.join(' → ')).toBe('landing');

    const vidjeni = new Set();
    const petlje = [];
    lanac.forEach((p) => { if (vidjeni.has(p)) petlje.push(p); vidjeni.add(p); });
    expect(petlje, 'petlja u lancu ' + lanac.join(' → ')).toEqual([]);

    expect(greske, 'greške stranice pri izlasku iz Studija').toEqual([]);
});
