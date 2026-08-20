// T0 · MJERAČ TELEFONA — prijavljene površine (faza „TELEFON", spec §9.3 i §9.7).
//
// Blizanac `phone.spec.js`, s istom mjerom u `helpers/phone-gate.js`. Postoji odvojeno
// iz istog razloga kao `a11y.authed` i `reachability.authed`: **polica, profil i Studio
// se odjavljenom posjetitelju ne prikazuju**, pa ih odjavljena brana ne može ni vidjeti.
// To je bio nalaz C3 (spec §7.10) — *prijavljene površine nisu imale nijedan vizualni
// gate*, i baš su ondje ležala četiri kvara koja su stajala na produkciji.
//
// ⚠️ Ovo NE preklapa `studio-mobile.authed.spec.js`. Ondje se mjeri **ljuska Studija**
// (koliko od ekrana ostane platnu); ovdje se mjeri **stranica** — otok, budžet kroma,
// sukob kraćenja, dohvatljivost bez skrola, čitljivost naslova razine. Isti ekran,
// druga os. K4a je platno vratio na 679 px, a ništa od toga nije tvrdio o otoku.
//
// Osnovica i pravilo „pada se samo na NOVOM kvaru" su objašnjeni u `phone.spec.js`.
const { test, expect } = require('@playwright/test');
const G = require('./helpers/phone-gate');

/** Prijavljen admin; `refresh()` otključava `.admin-only` ulaze prije mjerenja. */
async function spremanAdmin(page) {
    await page.goto('/');
    await G.spreman(page);
    await page.waitForFunction(() => !!window.SokratAdmin);
    await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
    await G.postaviOtok(page);
}

const NALAZI = { otok: [], kromo: [], sukob: [], prviEkran: [], zaglavlje: [] };
let izmjerenoEkrana = 0;

test.beforeAll(async ({ browser }, testInfo) => {
    // Ni port ni putanja sesije se NE prepisuju — oboje stoji u `playwright.config.js`.
    const { baseURL, storageState } = testInfo.project.use;
    const snimka = [];

    for (const e of G.EKRANI) {
        const ctx = await browser.newContext({
            viewport: { width: e.w, height: e.h },
            storageState, baseURL
        });
        const page = await ctx.newPage();
        await spremanAdmin(page);
        await page.waitForTimeout(600);

        for (const ekran of G.EKRANI_PRIJAVLJENI) {
            await G.idiNa(page, ekran);
            if (ekran === 'editor') await page.waitForSelector('#editor-page.active');
            await G.postaviOtok(page);
            await page.waitForTimeout(400);
            snimka.push({ e, ekran, m: await G.mjeriStranicu(page) });
        }
        await ctx.close();
    }

    izmjerenoEkrana = snimka.length;
    const gdje = (r) => r.e.w + 'px ' + r.ekran;

    snimka.forEach((r) => {
        const m = r.m;
        m.uOtoku.forEach((x) => NALAZI.otok.push(gdje(r) + ' · ' + x));
        if (m.kromoPct > G.KROMO_BUDZET_PCT) {
            NALAZI.kromo.push(gdje(r) + ' · ' + m.kromoPct + ' % (' + m.nasKromo + ' od '
                + (m.vh - G.OTOK) + ' px) · ' + m.trake.join(' + '));
        }
        m.sudari.forEach((x) => NALAZI.sukob.push(gdje(r) + ' · ' + x));
        if (m.upotrebljivih === 0) {
            NALAZI.prviEkran.push(gdje(r) + ' · kromo ' + m.kromoPx + ' px'
                + (m.bannerPx ? ' + banner ' + m.bannerPx + ' px' : '') + ' od ' + m.vh + ' px');
        }
        m.zaglavlja.forEach((x) => NALAZI.zaglavlje.push(gdje(r) + ' · ' + x));
    });

    if (G.spremiOsnovicu('prijavljeno', NALAZI)) {
        console.log('⚠️  phone-baseline.json PREPISAN (prijavljeno) — provjeri diff prije commita.');
    }
});

function protivOsnovice(kljuc, poruka) {
    const { novi, rijeseni } = G.usporediSOsnovicom('prijavljeno', kljuc, NALAZI[kljuc]);
    if (rijeseni.length) {
        console.log('\n✅ RIJEŠENO (' + kljuc + ', ' + rijeseni.length + ') — spusti osnovicu:\n   '
            + rijeseni.join('\n   ') + '\n');
    }
    expect(novi, poruka).toEqual([]);
}

test('① otok: prijavljene stranice ne stavljaju ništa ispod izreza', async () => {
    protivOsnovice('otok', 'NOVE kontrole ispod Dynamic Islanda (BUG-031)');
});

test('② kromo: trake prijavljenih stranica ostaju u budžetu', async () => {
    protivOsnovice('kromo', 'NOVE trake koje pojedu ekran (cigla T3)');
});

test('③ jedan krati, drugi se lomi — i na polici i u Studiju', async () => {
    protivOsnovice('sukob', 'NOV susjed pojeden susjedom koji se lomi (BUG-030)');
});

test('④ prvi ekran: iz police i Studija se bez skrola da nešto napraviti', async () => {
    protivOsnovice('prviEkran', 'NOVI prijavljeni ekrani bez ijedne dohvatljive kontrole');
});

test('⑤ zaglavlje razine je čitljivo i iza prijave', async () => {
    protivOsnovice('zaglavlje', 'NOVI naslovi razine koje korisnik ne može pročitati (BUG-030)');
});

test('⓪ pokrivenost: sve prijavljene stranice na sve tri širine', async () => {
    expect(izmjerenoEkrana, 'izmjerenih prijavljenih ekrana')
        .toBe(G.EKRANI.length * G.EKRANI_PRIJAVLJENI.length);
});
