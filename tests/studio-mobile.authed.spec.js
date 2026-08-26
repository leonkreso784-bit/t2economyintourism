// K4a · STUDIO NA TELEFONU — stablo prestaje jesti ekran (faza „KOSTUR").
//
// ── POVOD JE LEONOVA REČENICA, ALI TVRDNJE SU MJERE ──────────────────────────────
// Leon, 2026-08-19, uz snimku: *„zbog toga ne možeš ništa raditi na telefonu u editoru,
// apsolutno ništa."* Izmjereno prije popravka, 390×844:
//
//     traka 64 + putanja 44 + st-topbar 57 + stablo 357…375  =  522…540 px
//     = 62–64 % EKRANA, a za uređivanje ostaje 304…323 px.
//
// Poslije: canvas **679 px** u oba moda, ljuska u čvor-modu **165 px = 20 %**.
//
// ── ZAŠTO DVA MODA, A NE JEDAN `display:none` ────────────────────────────────────
// `.st-tree` nosi DVIJE različite stvari, i to se ne vidi iz CSS-a:
//   • ČVOR-mod   → PRIKAZ jednog materijala. Ime mu na istom ekranu već piše dvaput
//                  (globalna mrvica + `H1` canvasa) → briše se BEZ ZAMJENE.
//   • KATALOG-mod → NAVIGATOR i jedini način da se odabere lekcija → seli u LADICU.
// Do danas je u specu i BACKLOG-u stajala jedna tvrdnja („stablo se ne smije sakriti na
// telefonu") koja je pokrivala oba moda i zato je pola vremena bila kriva.
//
// ⚠️ ZAŠTO PRAVILO DOSAD NIJE RADILO IAKO JE POSTOJALO: `@media(max-width:680px){ …
// .st-tree{ display:none } }` i bazno `#editor-page .st-tree{ display:flex }` imaju ISTU
// specifičnost, a bazno dolazi niže u datoteci. *Medijski upit ne dodaje specifičnost.*
// Popravak zato nosi dvije klase. ⚠️ Istu sam grešku ponovio u samom popravku, na kvaki
// ladice — uhvatila ju je sonda, ne oko.
const { test, expect } = require('@playwright/test');
// T6: Studio je vlastiti dokument — ulaz zna helper.
const { otvoriStudio } = require('./helpers/studio-entry');

const TELEFON = { width: 390, height: 844 };

// T6: do tada je ovo bio odlazak na `/` pa `navigateTo('editor')`. Sada je Studio
// vlastita adresa, a čuvar sam provjeri admin-status — pa je cijela priprema jedan poziv.
async function spremanStudio(page) {
    await otvoriStudio(page);
}

/** Mjere ljuske — jedino što ovi testovi smiju tvrditi. */
const mjere = (page) => page.evaluate(() => {
    const h = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : 0; };
    const aside = document.querySelector('#stTreeAside');
    const kvaka = document.querySelector('#stTreeToggle');
    return {
        vh: window.innerHeight,
        canvas: h('#editor-page .st-canvas'),
        kromo: h('.topbar') + h('.pathbar') + h('#editor-page .st-topbar'),
        stabloVidljivo: !!aside && getComputedStyle(aside).display !== 'none' && getComputedStyle(aside).visibility !== 'hidden',
        stabloDisplay: aside ? getComputedStyle(aside).display : '(nema)',
        kvakaVidljiva: !!kvaka && kvaka.offsetParent !== null,
        docScroll: document.documentElement.scrollWidth
    };
});

test('čvor-mod na telefonu: panel materijala NESTAJE, canvas dobiva ekran', async ({ page }) => {
    await page.setViewportSize(TELEFON);
    await spremanStudio(page);

    // ⚠️ Čvor je i dalje LAŽAN (sadržaj nije predmet ovog testa) — mjeri se RASPORED u
    // čvor-modu. Do T6 se mod postavljao kroz `AppState.nav.editorNode`; sada ga postavlja
    // sam `openNode`, jer je hijerarhija editora otišla sa stranicom.
    await page.evaluate(() => {
        if (window.SokratStudio && window.SokratStudio.openNode) {
            try { window.SokratStudio.openNode('proba', 'Proba'); } catch (e) { /* sadržaj nije predmet ovog testa */ }
        }
    });
    await page.waitForSelector('#editor-page.active');
    await page.waitForTimeout(700);

    const m = await mjere(page);

    // Panel je u čvor-modu čista redundancija — ne smije zauzeti ni piksel.
    expect(m.stabloDisplay, 'panel čvora na telefonu').toBe('none');

    // Bilo 304 px. Prag 600 hvata POVRATAK panela (koji bi oduzeo ~375), ne sitno ugađanje.
    expect(m.canvas, 'visina canvasa (bila 304 px)').toBeGreaterThanOrEqual(600);

    // Ljuska je bila 540 px = 64 % ekrana. Sada ~165 px; prag 30 % je i dalje širok.
    expect(m.kromo / m.vh, 'udio ljuske u ekranu (bio 0,64)').toBeLessThan(0.30);

    // U čvor-modu stabla nema → ni kvaka nema što otvarati.
    expect(m.kvakaVidljiva, 'kvaka ladice u čvor-modu').toBe(false);
});

test('katalog-mod na telefonu: stablo je LADICA — zatvorena ne postoji, otvorena ne gura canvas', async ({ page }) => {
    await page.setViewportSize(TELEFON);
    await spremanStudio(page);
    await page.waitForSelector('#stTree .st-row', { state: 'attached' });

    const zatvoreno = await mjere(page);
    expect(zatvoreno.canvas, 'canvas dok je ladica zatvorena (bio 323 px)').toBeGreaterThanOrEqual(600);
    expect(zatvoreno.kvakaVidljiva, 'kvaka mora postojati — inače stablo nije dohvatljivo').toBe(true);
    // ⚠️ Zatvorena ladica NE SMIJE biti samo pomaknuta: `transform` je ostavlja u stablu
    // pristupačnosti i u tab-redu, pa bi je čitač ekrana čitao, a tipkovnica ulazila u nju.
    expect(zatvoreno.stabloVidljivo, 'zatvorena ladica je izvan a11y-stabla i tab-reda').toBe(false);

    await page.click('#stTreeToggle');
    await page.waitForTimeout(400);
    const otvoreno = await mjere(page);
    expect(otvoreno.stabloVidljivo, 'ladica se otvorila').toBe(true);
    expect(await page.getAttribute('#stTreeToggle', 'aria-expanded'), 'aria-expanded prati stanje').toBe('true');
    // Ladica PREKRIVA, ne gura — inače bi vratila točno onaj kvar koji uklanja.
    expect(otvoreno.canvas, 'canvas dok je ladica otvorena').toBe(zatvoreno.canvas);
    expect(otvoreno.docScroll, 'ladica ne smije proširiti dokument').toBeLessThanOrEqual(TELEFON.width + 1);

    // Odabir lekcije je SVRHA ladice → nakon njega se mora zatvoriti sama.
    await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach((n) => n.classList.add('open')); });
    const red = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
    await expect(red).toHaveCount(1);
    await red.click();
    await page.waitForSelector('#stCanvas .st-head h1');

    const poslije = await mjere(page);
    expect(poslije.stabloVidljivo, 'ladica se zatvara nakon odabira').toBe(false);
    expect(await page.getAttribute('#stTreeToggle', 'aria-expanded')).toBe('false');
});

test('stolno računalo je NEDIRNUTO: stablo je stalni stupac, kvake nema', async ({ page }) => {
    // Bez ove tvrdnje bi „popravak za telefon" mogao tiho oduzeti stablo i na 1280 px,
    // gdje je ono glavni način rada — a nijedan drugi spec to ne mjeri.
    await page.setViewportSize({ width: 1280, height: 800 });
    await spremanStudio(page);
    await page.waitForSelector('#stTree .st-row', { state: 'attached' });

    const m = await mjere(page);
    expect(m.stabloVidljivo, 'stablo na stolnom računalu').toBe(true);
    expect(m.kvakaVidljiva, 'kvaka na stolnom računalu nema što otvarati').toBe(false);

    const polozaj = await page.evaluate(() => getComputedStyle(document.querySelector('#stTreeAside')).position);
    expect(polozaj, 'stablo je stupac u mreži, ne plutajuća ladica').not.toBe('absolute');
});
