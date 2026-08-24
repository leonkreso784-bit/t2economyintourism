// K2b · STUDIO NA TELEFONU — traka ne smije pojesti ekran, gumbi ne smiju izaći van.
//
// ── POVOD JE MJERENJE, NE NAČELO ─────────────────────────────────────────────────
// Prije K2b je ljuska Studija na 390×844 izgledala ovako (izmjereno 2026-08-14, pa
// PONOVLJENO 2026-08-19 prije ijedne izmjene — iste brojke, kvar je stajao od U8):
//
//     .st-topbar   347 px  (41 % ekrana)      ← mrvica se srušila u stupac 96×326
//     .st-tree     263 px  (31 %)
//     .st-canvas   235 px  (28 %)             ← toliko je ostalo za UREĐIVANJE
//     .st-chip     [375…458]  IZVAN ekrana    ← nedostupan
//     .st-iconbtn  [470…484]  IZVAN ekrana    ← nedostupan
//
// Traka NEMA `flex-wrap`, a `#editor-page` je `position:fixed; inset:0; overflow:hidden`
// → višak se nije prelio nego ODREZAO. Nije bilo skrola jer nije bilo kamo: dva gumba
// jednostavno nisu postojala za korisnika telefona.
//
// ⚠️ ZAŠTO NIJEDAN GATE NIJE PISNUO: `layout.authed.spec.js` izuzima podstabla u
// `position:fixed`, uz obrazloženje „ne mogu uzrokovati skrol dokumenta". Premisa ne
// vrijedi kad fiksna ljuska ima `overflow:hidden` — tad se ne vidi ni kao skrol ni kao
// prelijev. *Izuzeće čija premisa ne vrijedi je rupa, ne optimizacija.*
//
// ── ŠTO JE K2b PROMIJENIO ────────────────────────────────────────────────────────
// Leon je 2026-08-19 presudio SPAJANJE (ne slaganje): identitet i položaj (natrag, znak
// „Sokrat STUDIO", mrvica) otišli su u globalnu traku, Studiju su ostale RADNJE NAD
// DOKUMENTOM. Izmjereno poslije: traka 57 px (7 %), canvas 326 px (39 %), nula gumba van.
//
// Da je globalna traka SLOŽENA iznad postojeće, canvas bi pao s 235 na ~171 px — cigla
// bi pogoršala kvar koji je trebala zaobići. Zato ovaj spec mjeri OBOJE: i da je ljuska
// niska, i da ništa nije odrezano.
const { test, expect } = require('@playwright/test');
// T6: editor ima vlastitu adresu — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriStudio } = require('./helpers/studio-entry');

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

/** Uđi u Studio i otvori te2 skriptu (stablo je ispod 680 px skriveno → klik programski). */
async function otvoriStudioSaLekcijom(page) {  // T6: lokalni helper; sam ULAZ na stranicu nosi studio-entry
    await otvoriStudio(page);
    await page.waitForSelector('#editor-page.active');
    await page.waitForSelector('#stTree .st-row', { state: 'attached' });
    await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach((n) => n.classList.add('open')); });
    const list = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
    await expect(list).toHaveCount(1);
    await list.dispatchEvent('click');
    await page.waitForSelector('#stCanvas .st-head h1');
}

test('Studio na 390px: nijedna kontrola u traci nije odrezana', async ({ page }) => {
    await otvoriStudioSaLekcijom(page);

    const odrezani = await page.evaluate(() => {
        const vw = window.innerWidth;
        const bar = document.querySelector('#editor-page .st-topbar');
        if (!bar) return ['NEMA .st-topbar'];
        return Array.from(bar.children)
            .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && (r.right > vw + 0.5 || r.left < -0.5);
            })
            .map((el) => {
                const r = el.getBoundingClientRect();
                return (el.id || el.className) + ' [' + Math.round(r.left) + '...' + Math.round(r.right) + '] vw=' + vw;
            });
    });

    // Prije K2b su ovdje bila DVA: `.st-chip` i `.st-iconbtn` (postavke).
    expect(odrezani, 'kontrole izvan ekrana u traci Studija').toEqual([]);
});

test('Studio na 390px: ljuska ne jede ekran — traka niska, canvas ostaje za rad', async ({ page }) => {
    await otvoriStudioSaLekcijom(page);

    const m = await page.evaluate(() => {
        const h = (sel) => {
            const el = document.querySelector(sel);
            return el ? Math.round(el.getBoundingClientRect().height) : 0;
        };
        return {
            vh: window.innerHeight,
            globalna: h('.topbar'),
            putanja: h('.pathbar'),
            studio: h('#editor-page .st-topbar'),
            canvas: h('#editor-page .st-canvas')
        };
    });

    // Ljuska Studija je RADNA traka, ne zaglavlje: jedan red kontrola + rub.
    // Bila je 347 px; prag je 96 da uhvati povratak mrvice ili znaka, a ne sitno ugađanje.
    expect(m.studio, 'traka Studija (bila 347 px)').toBeLessThanOrEqual(96);

    // Cijeli kromo (globalna traka + putanja + traka Studija) mora ostati ISPOD onoga
    // što je prije trošila SAMA traka Studija — inače spajanje nije bilo spajanje.
    expect(m.globalna + m.putanja + m.studio, 'ukupan kromo iznad canvasa').toBeLessThan(347);

    // I ono zbog čega sve ovo postoji: koliko je ostalo za uređivanje. Bilo je 235 px.
    expect(m.canvas, 'visina canvasa (bila 235 px)').toBeGreaterThanOrEqual(280);
});
