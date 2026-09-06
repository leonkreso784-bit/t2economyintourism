const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * F1/12 ⓪ — platforma ZNA uređaj, iscrtano u pravom motoru.
 *
 * Pješčanik (`tests/unit/uredjaj.test.js`) tvrdi ŠTO `boot.js` izračuna iz lažnog `matchMedia`; ovdje se
 * mjeri što PRAVI Chromium javi za iPhone profil (dodir, bez hovera; širina po profilu) i za stolni kontekst
 * (miš, hover, 1280×800), te da promjena prozora osvježi razred UŽIVO kroz prave `change` događaje na
 * `min-width` upitima — a ne samo pri bootu. Pragovi razreda se ČITAJU iz `js/boot.js` (jedno mjesto),
 * nikad ne prepisuju ovamo. Ugovor: CSS pita `:root[data-uredjaj~="dodir"]`, JS `SokratUredjaj.dodir`.
 *
 * `pwa` (display-mode: standalone) i `os = ios` (GestureEvent) Chromium ne emulira → oba su u pješčaniku;
 * ovdje se tvrdi da su ODSUTNI (nema tokena), što je točno stanje ovog motora.
 */
const BOOT = fs.readFileSync(path.join(__dirname, '..', 'js', 'boot.js'), 'utf8');
const PRAG = (() => {
    const m = /var PRAGOVI = \{\s*tablet:\s*(\d+),\s*stolno:\s*(\d+)\s*\}/.exec(BOOT);
    if (!m) throw new Error('js/boot.js: PRAGOVI nisu nađeni');
    return { tablet: Number(m[1]), stolno: Number(m[2]) };
})();
const razredZa = (w) => (w >= PRAG.stolno ? 'stolno' : w >= PRAG.tablet ? 'tablet' : 'telefon');

const stanje = (page) => page.evaluate(() => {
    const attr = document.documentElement.getAttribute('data-uredjaj');
    return {
        attr,
        tokeni: (attr || '').split(' '),
        u: Object.assign({}, window.SokratUredjaj),
        zamrznut: Object.isFrozen(window.SokratUredjaj),
        sirina: window.innerWidth,
    };
});

async function otvori(page, ruta = '/') {
    await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
    await page.goto(ruta);
}

test.describe('F1/12 ⓪ — telefon (iPhone profili: dodir, bez hovera)', () => {
    test('data-uredjaj + SokratUredjaj: `dodir` i razred po širini, bez `hover`/`hibrid`', async ({ page }, testInfo) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await otvori(page);
        const s = await stanje(page);
        const w = testInfo.project.use.viewport.width;
        expect(s.sirina).toBe(w);
        expect(s.tokeni).toContain('dodir');
        expect(s.tokeni).toContain(razredZa(w));
        expect(s.tokeni).not.toContain('hover');
        expect(s.tokeni).not.toContain('hibrid');
        expect(s.tokeni).not.toContain('pwa');
        expect(s.tokeni).not.toContain('ios');
        expect(s.u).toEqual({ dodir: true, hover: false, hibrid: false, razred: razredZa(w), os: 'drugo', pwa: false });
        expect(s.zamrznut).toBe(true);
        expect(errors).toEqual([]);
    });

    test('pravne stranice (bez bundlea) isto znaju uređaj — boot.js je na svih 6', async ({ page }, testInfo) => {
        await otvori(page, '/privacy.html');
        const s = await stanje(page);
        expect(s.tokeni).toContain('dodir');
        expect(s.tokeni).toContain(razredZa(testInfo.project.use.viewport.width));
        expect(s.u.dodir).toBe(true);
    });

    test('špil kartica čita ISTI atribut: sjene su vidljive točno kad je `dodir` u data-uredjaj', async ({ page }) => {
        await otvori(page);
        await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection && typeof subjectDataMap !== 'undefined');
        await page.evaluate(() => {
            const s = Object.keys(subjectDataMap)[0];
            const x = SokratCatalog.getSubject(s);
            navigateTo('study', { subject: s, lesson: x.lessons[0].id });
        });
        await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded(AppState.nav.subject), null, { timeout: 15000 });
        await page.evaluate(() => window.switchSection('flashcards'));
        await page.waitForFunction(() => document.getElementById('cardQuestion').textContent.trim().length > 0 && AppState.cards.deck.length > 3);
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(2);
        // Protučinjenično: makni SAMO token `dodir` iz atributa → CSS špila ga više ne vidi → sjene nestaju.
        await page.evaluate(() => {
            const h = document.documentElement;
            h.setAttribute('data-uredjaj', h.getAttribute('data-uredjaj').split(' ').filter((t) => t !== 'dodir').join(' '));
        });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(0);
    });
});

test.describe('F1/12 ⓪ — stolno (miš, hover, 1280×800)', () => {
    test.use({ hasTouch: false, isMobile: false, viewport: { width: 1280, height: 800 } });

    test('`stolno` + `hover`, bez `dodir`; promjena prozora osvježi razred UŽIVO, novim zamrznutim objektom', async ({ page }, testInfo) => {
        // Stolni kontekst ne ovisi o iPhone profilu → mjeri se jednom, ne četiri puta s istim ishodom.
        test.skip(testInfo.project.name !== 'iPhone-SE-375', 'stolni kontekst je isti u svakom profilu');
        await otvori(page);
        const prije = await stanje(page);
        expect(prije.tokeni).toContain('stolno');
        expect(prije.tokeni).toContain('hover');
        expect(prije.tokeni).not.toContain('dodir');
        expect(prije.tokeni).not.toContain('hibrid');
        expect(prije.u).toEqual({ dodir: false, hover: true, hibrid: false, razred: 'stolno', os: 'drugo', pwa: false });
        expect(prije.zamrznut).toBe(true);

        await page.evaluate(() => { window.__uredjajPrije = window.SokratUredjaj; });
        await page.setViewportSize({ width: PRAG.tablet + 20, height: 800 });
        await expect.poll(async () => (await stanje(page)).u.razred).toBe('tablet');
        expect((await stanje(page)).tokeni).toContain('tablet');
        const osvjezen = await page.evaluate(() => ({
            novi: window.__uredjajPrije !== window.SokratUredjaj,
            stariRazred: window.__uredjajPrije.razred,
            stariZamrznut: Object.isFrozen(window.__uredjajPrije),
        }));
        expect(osvjezen).toEqual({ novi: true, stariRazred: 'stolno', stariZamrznut: true });

        await page.setViewportSize({ width: PRAG.tablet - 20, height: 800 });
        await expect.poll(async () => (await stanje(page)).u.razred).toBe('telefon');
        await page.setViewportSize({ width: PRAG.stolno, height: 800 });
        await expect.poll(async () => (await stanje(page)).u.razred).toBe('stolno');
        // hover/dodir se promjenom prozora NE mijenjaju — to su sposobnosti pokazivača, ne širine
        const kraj = await stanje(page);
        expect(kraj.u.hover).toBe(true);
        expect(kraj.u.dodir).toBe(false);
    });
});
