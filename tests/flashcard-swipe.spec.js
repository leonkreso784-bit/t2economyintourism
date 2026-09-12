const { test, expect } = require('@playwright/test');

/**
 * F1/9 — kartice kao Tinder-špil na DODIRU, izmjereno PRAVIM dodirom.
 *
 * Dodir ide kroz CDP (`Input.dispatchTouchEvent`), ne kroz sintetički `PointerEvent`: samo tako
 * preglednik sam prevede dodir u pointer-događaje I primijeni `touch-action` — a upravo je
 * `touch-action: pan-y` na kartici tvrdnja koju sintetički događaj ne može izmjeriti (reset F1/11
 * `pan-x pan-y` daje vodoravan dodir pregledniku, koji ga nema kamo dati). Zadnji test to dokazuje
 * protučinjenično: s vraćenim resetom na kartici ista gesta ne upisuje ništa.
 *
 * Gesta u pješčaniku (rubovi: rep-klik, cancel, timer, novi špil usred leta) je u
 * `tests/unit/flashcard-swipe.test.js`; ovdje je ono što traži pravi motor: dodir → gesta → upis →
 * brojka na ekranu, pečat koji raste s prstom, i špil koji se crta samo pod `pointer: coarse`.
 */

const KARTICA = '#flashcard';

async function otvoriKartice(page) {
    await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
    await page.goto('/');
    await page.waitForFunction(() => window.SOKRAT_CATALOG && window.navigateTo && window.switchSection && typeof subjectDataMap !== 'undefined');
    // Predmet i lekcija IZ KATALOGA (isti rez kao phone-gate): nikad zakucani id.
    await page.evaluate(() => {
        const s = Object.keys(subjectDataMap)[0];
        const x = SokratCatalog.getSubject(s);
        navigateTo('study', { subject: s, lesson: x.lessons[0].id });
    });
    await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded(AppState.nav.subject), null, { timeout: 15000 });
    await page.evaluate(() => window.switchSection('flashcards'));
    await page.waitForFunction(() => document.getElementById('cardQuestion').textContent.trim().length > 0 && AppState.cards.deck.length > 3);
    await page.locator(KARTICA).scrollIntoViewIfNeeded();
}

/** Pravi dodir: touchStart → touchMove… → touchEnd kroz CDP. Bez `kraj` prst OSTAJE na ekranu —
 *  vraća se sesija, jer touchEnd mora doći kroz ISTU (nova sesija „ne zna" za započeti dodir). */
async function dodirniNiz(page, tocke, kraj = true) {
    const cdp = await page.context().newCDPSession(page);
    try {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tocke[0]] });
        for (let i = 1; i < tocke.length; i++) {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [tocke[i]] });
        }
        if (!kraj) return cdp;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } catch (e) {
        await cdp.detach();
        throw e;
    }
    await cdp.detach();
    return null;
}
/** Podigni prst koji je `dodirniNiz(…, false)` ostavio na ekranu. */
async function podigni(cdp) {
    try { await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); } finally { await cdp.detach(); }
}

async function sredina(page) {
    const b = await page.locator(KARTICA).boundingBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width };
}

/** Povuci karticu vodoravno za `udio` njezine širine (pozitivno = desno). */
async function povuci(page, udio, kraj = true, koraci = 8) {
    const s = await sredina(page);
    const tocke = [{ x: s.x, y: s.y }];
    for (let i = 1; i <= koraci; i++) tocke.push({ x: s.x + s.w * udio * i / koraci, y: s.y });
    return dodirniNiz(page, tocke, kraj);
}

async function dodirni(page) {
    const s = await sredina(page);
    await dodirniNiz(page, [{ x: s.x, y: s.y }]);
}

const stanje = (page) => page.evaluate(() => {
    const el = document.getElementById('flashcard');
    return {
        index: AppState.cards.index,
        known: AppState.cards.known.slice(),
        unknown: AppState.cards.unknown.slice(),
        flipped: el.classList.contains('flipped'),
        klase: Array.from(el.classList).filter((k) => /^is-/.test(k)),
        x: el.style.getPropertyValue('--swipe-x'),
    };
});

const sletjela = (page) => page.waitForFunction(() => {
    const c = document.getElementById('flashcard').classList;
    return !c.contains('is-flying') && !c.contains('is-entering') && !c.contains('is-dragging');
});

test.describe('F1/9 — kartice kao Tinder-špil na dodiru', () => {
    test.beforeEach(async ({ page }) => {
        await otvoriKartice(page);
    });

    test('desno = znam, lijevo = ne znam — upis kroz markKnown/markUnknown, brojke na ekranu', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [], flipped: false, klase: [] });

        await povuci(page, 0.6);
        await sletjela(page);
        await expect(page.locator('#knownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 1, known: [0], unknown: [], klase: [], x: '' });

        await povuci(page, -0.6);
        await sletjela(page);
        await expect(page.locator('#unknownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 2, known: [0], unknown: [1], klase: [], x: '' });

        // known se slijeva u progress.flashcardsLearned — isti put kao gumb (saveFlashcardProgress)
        expect(await page.evaluate(() => progress.flashcardsLearned.includes(0))).toBe(true);
        expect(errors).toEqual([]);
    });

    test('kratko povlačenje se vraća bez upisa; dodir bez pomaka okreće', async ({ page }) => {
        await povuci(page, 0.12);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [], flipped: false, klase: [], x: '' });

        await dodirni(page);
        await expect(page.locator(KARTICA)).toHaveClass(/flipped/);
        await dodirni(page);
        await expect(page.locator(KARTICA)).not.toHaveClass(/flipped/);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [] });
    });

    test('pečat raste s prstom i vidi se SAMO dok gesta traje', async ({ page }) => {
        const prst = await povuci(page, 0.2, false);   // prst još drži
        const usred = await page.evaluate(() => {
            const el = document.getElementById('flashcard');
            const z = getComputedStyle(el.querySelector('.swipe-stamp--know'));
            const n = getComputedStyle(el.querySelector('.swipe-stamp--dont'));
            return { klase: Array.from(el.classList).filter((k) => /^is-/.test(k)), znamVid: z.visibility, znamOp: parseFloat(z.opacity), neznamOp: parseFloat(n.opacity), x: el.style.getPropertyValue('--swipe-x') };
        });
        expect(usred.klase).toEqual(['is-dragging']);
        expect(usred.znamVid).toBe('visible');
        expect(usred.znamOp).toBeGreaterThan(0.3);
        expect(usred.neznamOp).toBe(0);
        expect(parseFloat(usred.x)).toBeGreaterThan(10);

        await podigni(prst);
        await sletjela(page);
        const poslije = await page.evaluate(() => getComputedStyle(document.querySelector('.swipe-stamp--know')).visibility);
        expect(poslije).toBe('hidden');
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [] });
    });

    test('špil: dvije sjene ispod kartice na dodiru, nijedna na zadnjoj', async ({ page }) => {
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(2);
        const boja = await page.evaluate(() => ({
            g1: document.getElementById('flashcardGhost1').style.getPropertyValue('--item-acc'),
            sljedeca: (AppState.cards.deck[1].color || AppState.cards.deck[1].catColor || ''),
        }));
        expect(boja.g1).toBe(boja.sljedeca);
        // sjene ne šire stranicu (phone-gate mjeri to i sam; ovdje izravno)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

        await page.evaluate(() => { AppState.cards.index = AppState.cards.deck.length - 1; updateFlashcard(); });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(0);
        await page.evaluate(() => { AppState.cards.index = AppState.cards.deck.length - 2; updateFlashcard(); });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(1);
    });

    test('strelice = stolni pandan palcu: → znam · ← ne znam · razmak okreće (F1/9 ②)', async ({ page }) => {
        await page.keyboard.press('ArrowRight');
        await sletjela(page);
        await expect(page.locator('#knownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 1, known: [0], klase: [] });
        await page.keyboard.press('ArrowLeft');
        await sletjela(page);
        await expect(page.locator('#unknownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 2, unknown: [1], klase: [] });
        await page.keyboard.press('Space');
        await expect(page.locator(KARTICA)).toHaveClass(/flipped/);
        await page.keyboard.press('Enter');
        await expect(page.locator(KARTICA)).not.toHaveClass(/flipped/);
        // u polju za unos strelica je strelica: kviz-tražilica nije tu, ali gumb „Znam" jest → fokusiraj ga
        await page.focus('#btnCorrect');
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(150);
        expect(await stanje(page)).toMatchObject({ index: 2, known: [0], unknown: [1] });
    });

    test('prefers-reduced-motion: upis bez leta', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await povuci(page, 0.6);
        await sletjela(page);
        await expect(page.locator('#knownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 1, known: [0], klase: [] });
    });

    test('protučinjenično: `touch-action` se čita na SKROLERU (lice/naličje), ne na kartici — reset ondje gasi gestu', async ({ page }) => {
        // ① reset samo na `.flashcard` = ništa se ne mijenja: preglednik stane na prvom skroleru
        //    (`.flashcard-front`, `overflow-y: auto`) i ondje još vidi `pan-y`. Zato pravilo mora stajati i na skrolerima.
        await page.evaluate(() => { document.getElementById('flashcard').style.touchAction = 'pan-x pan-y'; });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 1, known: [0], klase: [] });
        // ② reset na licu i naličju = preglednik uzme vodoravni dodir za pomicanje → `pointercancel` → nema upisa
        await page.evaluate(() => {
            document.getElementById('flashcard').style.removeProperty('touch-action');
            document.querySelectorAll('.flashcard-front, .flashcard-back').forEach((el) => { el.style.touchAction = 'pan-x pan-y'; });
        });
        await povuci(page, 0.6);
        await page.waitForTimeout(400);
        expect(await stanje(page)).toMatchObject({ index: 1, known: [0], unknown: [], klase: [] });
        // ③ vraćeno: ista gesta opet upisuje
        await page.evaluate(() => {
            document.querySelectorAll('.flashcard-front, .flashcard-back').forEach((el) => el.style.removeProperty('touch-action'));
        });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 2, known: [0, 1] });
    });
});
