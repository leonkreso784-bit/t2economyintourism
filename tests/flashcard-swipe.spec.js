const { test, expect } = require('@playwright/test');

/**
 * F1/13 — palac LISTA, gumbi SUDE; izmjereno PRAVIM dodirom.
 *
 * Dodir ide kroz CDP (`Input.dispatchTouchEvent`), ne kroz sintetički `PointerEvent`: samo tako
 * preglednik sam prevede dodir u pointer-događaje I primijeni `touch-action` — a upravo je
 * `touch-action: pan-y` na kartici I na njezinim skrolerima tvrdnja koju sintetički događaj ne može
 * izmjeriti (reset F1/11 `pan-x pan-y` daje vodoravan dodir pregledniku, koji ga nema kamo dati).
 * Zadnji test to dokazuje protučinjenično: s vraćenim resetom na licu/naličju ista gesta ne radi ništa.
 *
 * ⚠️ ŠTO SE OD F1/13 MJERI DRUKČIJE (Leon, 2026-09-06, s previewom F1/9): gesta LISTA
 * (desno = sljedeća, lijevo = prethodna) i **ne upisuje ništa**; sud je na gumbima ✓ / ✕ (i tipkama
 * Z / X), koji lete naprijed s pečatom. Zato ovdje stoji i tvrdnja koje prije nije bilo: poslije
 * povlačenja moraju brojke „znam / ne znam" ostati na **0 / 0**.
 *
 * Gesta u pješčaniku (rubovi: rep-klik, cancel, timer, novi špil usred leta, tablica akcija) je u
 * `tests/unit/flashcard-swipe.test.js`; ovdje je ono što traži pravi motor.
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
        p: el.style.getPropertyValue('--swipe-p'),
    };
});

/** Skoči na zadnju karticu špila (izbornik kraja se inače dočeka tek nakon N povlačenja). */
const naZadnju = (page) => page.evaluate(() => {
    AppState.cards.index = AppState.cards.deck.length - 1;
    updateFlashcard();
    updateFlashcardProgress();
});

const sletjela = (page) => page.waitForFunction(() => {
    const c = document.getElementById('flashcard').classList;
    return !c.contains('is-flying') && !c.contains('is-entering') && !c.contains('is-dragging');
});

/** Klik na gumb i ODMAH mjera — u istoj zadaći, dakle prije nego let sleti. */
const sudiPaMjeri = (page, gumb) => page.evaluate((id) => {
    document.getElementById(id).click();
    const el = document.getElementById('flashcard');
    const z = getComputedStyle(el.querySelector('.swipe-stamp--know'));
    const n = getComputedStyle(el.querySelector('.swipe-stamp--dont'));
    return {
        klase: Array.from(el.classList).filter((k) => /^is-/.test(k)),
        p: el.style.getPropertyValue('--swipe-p'),
        x: parseFloat(el.style.getPropertyValue('--swipe-x')),
        znamVid: z.visibility, znamOp: parseFloat(z.opacity),
        neVid: n.visibility, neOp: parseFloat(n.opacity),
        index: AppState.cards.index, known: AppState.cards.known.slice(), unknown: AppState.cards.unknown.slice(),
    };
}, gumb);

test.describe('F1/13 — palac lista, gumbi sude (dodir)', () => {
    test.beforeEach(async ({ page }) => {
        await otvoriKartice(page);
    });

    test('desno = SLJEDEĆA, lijevo = PRETHODNA — i nijedno ne upisuje ništa', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [], flipped: false, klase: [] });

        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 1, known: [], unknown: [], klase: [], x: '', p: '' });
        // ⚠️ Srce cigle: listanje NIJE sud. Brojke na ✓ / ✕ moraju ostati 0 / 0, i to je ono što je
        // do F1/13 bilo 1 / 0 — mjeri se ekran, ne samo `AppState`.
        await expect(page.locator('#knownCount')).toHaveText('0');
        await expect(page.locator('#unknownCount')).toHaveText('0');
        expect(await page.evaluate(() => progress.flashcardsLearned.length)).toBe(0);

        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 2, known: [], unknown: [] });

        await povuci(page, -0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 1, known: [], unknown: [], klase: [], x: '' });
        await expect(page.locator('#knownCount')).toHaveText('0');
        await expect(page.locator('#unknownCount')).toHaveText('0');
        expect(errors).toEqual([]);
    });

    test('prva kartica + lijevo = ODSKOK (nema ispred čega), kratko povlačenje se vraća, dodir okreće', async ({ page }) => {
        await povuci(page, -0.6);
        await page.waitForTimeout(400);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [], klase: [], x: '' });

        await povuci(page, 0.12);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 0, klase: [], x: '' });

        await dodirni(page);
        await expect(page.locator(KARTICA)).toHaveClass(/flipped/);
        await dodirni(page);
        await expect(page.locator(KARTICA)).not.toHaveClass(/flipped/);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [] });
    });

    test('pečata NEMA pod prstom (gesta ne sudi), a ✓ / ✕ lete naprijed s pečatom i upisuju', async ({ page }) => {
        const prst = await povuci(page, 0.35, false);   // prst još drži
        const usred = await page.evaluate(() => {
            const el = document.getElementById('flashcard');
            const z = getComputedStyle(el.querySelector('.swipe-stamp--know'));
            const n = getComputedStyle(el.querySelector('.swipe-stamp--dont'));
            return { klase: Array.from(el.classList).filter((k) => /^is-/.test(k)), znamVid: z.visibility, neVid: n.visibility, x: el.style.getPropertyValue('--swipe-x'), p: el.style.getPropertyValue('--swipe-p') };
        });
        expect(usred.klase).toEqual(['is-dragging']);
        expect(parseFloat(usred.x)).toBeGreaterThan(10);
        expect(usred.p).toBe('');                        // sud se pod prstom ne piše
        expect(usred.znamVid).toBe('hidden');
        expect(usred.neVid).toBe('hidden');
        await podigni(prst);
        await sletjela(page);

        // ✓ = znam: let NAPRIJED (+x), pečat „Znam" pun, „Ne znam" nevidljiv, upis TEK po slijetanju
        const znam = await sudiPaMjeri(page, 'btnCorrect');
        expect(znam.klase.sort()).toEqual(['is-flying', 'is-sud']);
        expect(znam.p).toBe('1');
        expect(znam.x).toBeGreaterThan(0);
        expect(znam.znamVid).toBe('visible');
        expect(znam.znamOp).toBe(1);
        expect(znam.neOp).toBe(0);
        expect(znam.known).toEqual([]);                  // upis čeka slijetanje
        await sletjela(page);
        await expect(page.locator('#knownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 2, known: [1], klase: [] });
        expect(await page.evaluate(() => progress.flashcardsLearned.includes(1))).toBe(true);

        // ✕ = ne znam: ISTI smjer leta (naprijed), suprotan pečat
        const ne = await sudiPaMjeri(page, 'btnWrong');
        expect(ne.klase.sort()).toEqual(['is-flying', 'is-sud']);
        expect(ne.p).toBe('-1');
        expect(ne.x).toBeGreaterThan(0);
        expect(ne.neVid).toBe('visible');
        expect(ne.neOp).toBe(1);
        expect(ne.znamOp).toBe(0);
        await sletjela(page);
        await expect(page.locator('#unknownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 3, unknown: [2], klase: [] });
        const poslije = await page.evaluate(() => getComputedStyle(document.querySelector('.swipe-stamp--know')).visibility);
        expect(poslije).toBe('hidden');
    });

    test('špil: sjene VIRE DESNO, unutar ekrana, i nijedne na zadnjoj kartici', async ({ page }) => {
        // F1/12 ⓪: CSS špila pita PLATFORMU (`:root[data-uredjaj~="dodir"]`, boot.js), ne medij — tvrdi se ono što CSS čita.
        expect(await page.evaluate(() => ({
            atribut: document.documentElement.getAttribute('data-uredjaj').split(' ').includes('dodir'),
            objekt: window.SokratUredjaj.dodir,
        }))).toEqual({ atribut: true, objekt: true });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(2);
        const boja = await page.evaluate(() => ({
            g1: document.getElementById('flashcardGhost1').style.getPropertyValue('--item-acc'),
            sljedeca: (AppState.cards.deck[1].color || AppState.cards.deck[1].catColor || ''),
        }));
        expect(boja.g1).toBe(boja.sljedeca);

        // ⚠️ F1/13: sjene se od kadra (F1/12) više ne vide odozdo — visoka kartica ih proguta. Mjeri se
        // DESNI RUB: svaka sljedeća viri malo dalje, a najdalja i dalje stoji unutar ekrana.
        const r = await page.evaluate(() => {
            const rub = (id) => document.getElementById(id).getBoundingClientRect();
            return { kartica: rub('flashcard').right, g1: rub('flashcardGhost1').right, g2: rub('flashcardGhost2').right, vw: window.innerWidth, doc: document.documentElement.scrollWidth };
        });
        expect(r.g1).toBeGreaterThan(r.kartica);
        expect(r.g2).toBeGreaterThan(r.g1);
        expect(r.g2).toBeLessThanOrEqual(r.vw);
        // sjene ne šire stranicu (phone-gate mjeri to i sam; ovdje izravno)
        expect(r.doc).toBeLessThanOrEqual(r.vw);

        await page.evaluate(() => { AppState.cards.index = AppState.cards.deck.length - 1; updateFlashcard(); });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(0);
        await page.evaluate(() => { AppState.cards.index = AppState.cards.deck.length - 2; updateFlashcard(); });
        await expect(page.locator('.flashcard-ghost:visible')).toHaveCount(1);
    });

    test('prefers-reduced-motion: listanje i upis bez leta', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 1, known: [], klase: [] });
        await page.click('#btnCorrect');
        await expect(page.locator('#knownCount')).toHaveText('1');
        // Upis je i bez leta trenutan, ali klasa ulaska (što gasi prijelaze) živi još dva kadra —
        // mjeri se STANJE poslije nje, inače brana hvata sam sebe u utrci s rAF-om.
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 2, known: [1], klase: [] });
    });

    test('zadnja kartica + desno = IZBORNIK KRAJA ŠPILA; Escape vraća na karticu', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await naZadnju(page);
        await expect(page.locator('#deckEnd')).toBeHidden();
        await povuci(page, 0.6);
        await expect(page.locator('#deckEnd')).toBeVisible();
        await expect(page.locator('.deck-end-btn')).toHaveCount(3);
        // fokus ulazi u prvu DOSTUPNU radnju; „ponovi ne znam" je bez ijedne takve kartice onemogućen
        expect(await page.evaluate(() => document.activeElement.id)).toBe('btnKrajIspocetka');
        await expect(page.locator('#btnKrajPonovi')).toBeDisabled();
        await expect(page.locator('#deckEndHint')).toBeVisible();

        /* ⚠️ OKRENUTO U ⑨ (08.09.), i to je NALAZ. Do ⑨ je ovdje stajalo „ploča je U OKVIRU KARTICE
           i stranica ne skrola" — a to je vrijedilo samo zato što je kartica imala strop, pa su
           „mjesto kartice" i „vidljivi pojas" bili ISTI pravokutnik. Od ⑨ kartica smije prerasti
           ekran; da je ploča ostala vezana za nju, rasla bi s njom i odnijela svoja tri gumba ispod
           ruba — izmjereno u polegnutom telefonu: dokument 514 px na ekranu od 393. Tvrdnja je zato
           prešla na ono što STVARNO mora vrijediti kad stranica smije rasti: izbornik je CIJEL na
           ekranu i sva tri gumba se daju dohvatiti bez skrolanja. „Stranica ne skrola" više NIJE
           tvrdnja ovog testa — ⑨ ju je namjerno ukinuo. */
        const okvir = await page.evaluate(() => {
            const p = document.getElementById('deckEnd').getBoundingClientRect();
            const naEkranu = (r) => r.top >= -1 && r.bottom <= window.innerHeight + 1
                && r.left >= -1 && r.right <= window.innerWidth + 1;
            return {
                izvanEkrana: [p.top < -1, p.bottom > window.innerHeight + 1, p.left < -1, p.right > window.innerWidth + 1],
                gumbi: Array.from(document.querySelectorAll('.deck-end-btn')).map((g) => naEkranu(g.getBoundingClientRect())),
                modalOpen: document.body.classList.contains('modal-open'),
            };
        });
        expect(okvir.izvanEkrana).toEqual([false, false, false, false]);
        expect(okvir.gumbi).toEqual([true, true, true]);
        expect(okvir.modalOpen).toBe(false);

        // dok stoji, gesta ne dira špil
        const prije = (await stanje(page)).index;
        await povuci(page, -0.6);
        await page.waitForTimeout(300);
        expect((await stanje(page)).index).toBe(prije);

        await page.keyboard.press('Escape');
        await expect(page.locator('#deckEnd')).toBeHidden();
        expect(await page.evaluate(() => document.activeElement.id)).toBe('flashcard');
        expect((await stanje(page)).index).toBe(prije);
        expect(errors).toEqual([]);
    });

    test('izbornik: ispočetka · promiješaj — isti skup, novi špil, upisani napredak netaknut', async ({ page }) => {
        const spil = () => page.evaluate(() => AppState.cards.deck.map((c) => c.question));
        const pocetni = await spil();
        await naZadnju(page);
        await povuci(page, 0.6);
        await expect(page.locator('#deckEnd')).toBeVisible();
        await page.click('#btnKrajIspocetka');
        await expect(page.locator('#deckEnd')).toBeHidden();
        expect(await spil()).toEqual(pocetni);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [] });

        await naZadnju(page);
        await povuci(page, 0.6);
        await page.click('#btnKrajPromijesaj');
        const promijesan = await spil();
        expect(promijesan.slice().sort()).toEqual(pocetni.slice().sort());
        // Redoslijed se traži drukčiji samo kad ima dovoljno kartica da slučajnost nije objašnjenje.
        if (pocetni.length >= 8) expect(promijesan).not.toEqual(pocetni);
        expect(await stanje(page)).toMatchObject({ index: 0 });
        expect(await page.evaluate(() => progress.flashcardsLearned.length)).toBe(0);
    });

    test('izbornik: „ponovi ne znam" — špil je TOČNO skup ne-znam, a upisani napredak ostaje', async ({ page }) => {
        // dvije kartice u „ne znam", jedna u „znam" (gumbi, jer gesta od F1/13 ne sudi)
        const ne1 = await page.evaluate(() => AppState.cards.deck[0].question);
        await page.click('#btnWrong');
        await sletjela(page);
        await page.click('#btnCorrect');
        await sletjela(page);
        const ne2 = await page.evaluate(() => AppState.cards.deck[AppState.cards.index].question);
        await page.click('#btnWrong');
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ known: [1], unknown: [0, 2] });

        await naZadnju(page);
        await povuci(page, 0.6);
        await expect(page.locator('#btnKrajPonovi')).toBeEnabled();
        await expect(page.locator('#deckEndHint')).toBeHidden();
        await page.click('#btnKrajPonovi');
        await expect(page.locator('#deckEnd')).toBeHidden();
        expect(await page.evaluate(() => AppState.cards.deck.map((c) => c.question))).toEqual([ne1, ne2]);
        expect(await stanje(page)).toMatchObject({ index: 0, known: [], unknown: [] });
        // upisani napredak (kartica označena sa „znam") NIJE dirnut
        expect(await page.evaluate(() => progress.flashcardsLearned)).toEqual([1]);
        await expect(page.locator('#knownCount')).toHaveText('0');
    });

    /* ⑨ — DUGA KARTICA, end-to-end (Leon, 08.09.: „možemo li napraviti da uopće nema scrolla i da
       se cijela stranica povećava … makni barem skrolanje lijevo-desno jer ovo postaje JAKO
       frustrirajuće"). Sve ostale tvrdnje ove datoteke rade s karticama koje stanu na ekran — a ⑨
       mijenja upravo ono što se događa kad NE stanu, pa bez ovog testa promjena nema branu na
       pravom dodirnom profilu. Tekst se ubacuje kroz PRAVI put crtanja (`updateFlashcard`), ne u
       DOM: inače bi test mjerio svoj vlastiti `innerHTML`, ne ono što korisnik dobije. */
    test('⑨ duga kartica: stranica RASTE, u kartici nema skrolera, sud ostaje na ekranu', async ({ page }) => {
        const prije = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.evaluate(() => {
            const c = AppState.cards.deck[AppState.cards.index];
            c.answer = 'Odgovor koji se ne da sazeti u jedan redak, pa kartica mora narasti. '.repeat(20);
            c.explanation = 'Objasnjenje koje ide jos dalje i nosi primjer, broj i posljedicu. '.repeat(26);
            updateFlashcard();
        });
        await page.waitForTimeout(250);
        const m = await page.evaluate(() => {
            const back = document.querySelector('.flashcard-back');
            const cs = getComputedStyle(back);
            return {
                doc: document.documentElement.scrollHeight, vh: window.innerHeight,
                overflow: cs.overflowX + '/' + cs.overflowY,
                // ⚠️ OVO je bio kvar: druga os koju nitko nije napisao. Nula znači da je nema.
                fantomskaOs: back.scrollWidth - back.clientWidth,
                skrolUKartici: back.scrollHeight - back.clientHeight,
            };
        });
        expect(m.overflow).toBe('visible/visible');
        expect(m.fantomskaOs).toBe(0);
        expect(m.skrolUKartici).toBe(0);
        expect(m.doc).toBeGreaterThan(m.vh);        // skrol je preuzeo DOKUMENT
        expect(m.doc).toBeGreaterThan(prije);       // i to zbog kartice, ne od prije
        /* Sud mora ostati na ekranu na SVAKOM mjestu skrola — to je jedino što je Leon tražio da
           stoji. ⚠️ Mjeriti SAMO na dnu ne dokazuje ništa: ondje je i običan (neljepljiv) red na
           ekranu, jer je zadnji element stranice. Izmjereno: s `position: static` test na dnu
           PROLAZI. Zato vrh (0) i sredina — ondje neljepljiv red pada ispod ruba. */
        const naTri = [];
        for (const gdje of ['vrh', 'sredina', 'dno']) {
            await page.evaluate((g) => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo(0, g === 'vrh' ? 0 : g === 'sredina' ? Math.round(max / 2) : max);
            }, gdje);
            await page.waitForTimeout(150);
            naTri.push(await page.evaluate((g) => {
                const r = document.querySelector('.flashcard-controls').getBoundingClientRect();
                const ok = document.getElementById('btnCorrect').getBoundingClientRect();
                const pod = document.elementFromPoint(ok.left + ok.width / 2, ok.top + ok.height / 2);
                return { gdje: g, naEkranu: r.top >= -1 && r.bottom <= window.innerHeight + 1,
                         dohvatljiv: !!(pod && pod.closest('#btnCorrect')) };
            }, gdje));
        }
        expect(naTri).toEqual([
            { gdje: 'vrh', naEkranu: true, dohvatljiv: true },
            { gdje: 'sredina', naEkranu: true, dohvatljiv: true },
            { gdje: 'dno', naEkranu: true, dohvatljiv: true },
        ]);
    });

    /* ⚠️ OKRENUTO U ⑨ (08.09.), i to je NALAZ, ne održavanje testa. Do ⑨ su lice i naličje BILI
       skroleri (`overflow-y: scroll`), pa je preglednik čitao `touch-action` do PRVOG skrolera i
       ondje stao: reset na licu/naličju gasio je gestu, a reset na kartici nije značio ništa. Od ⑨
       u kartici nema skrolera, pa se lanac čita sve do dokumenta, a vrijedi PRESJEK cijelog lanca.
       Gesta je time ROBUSNIJA nego prije: preživi reset na bilo kojoj JEDNOJ karici lanca i umre
       tek kad `pan-y` nestane sa SVIH — što je i dalje dokaz da pravilo nosi teret, samo drugi. */
    test('protučinjenično: od ⑨ se `touch-action` čita KROZ LANAC — gestu gasi tek reset na SVIMA', async ({ page }) => {
        // ① reset samo na `.flashcard`: lice još kaže `pan-y`, presjek ostaje `pan-y` → gesta živi
        await page.evaluate(() => { document.getElementById('flashcard').style.touchAction = 'pan-x pan-y'; });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 1, klase: [] });
        // ② reset samo na licu/naličju: DO ⑨ je gesta ovdje umirala; sad je drži kartica
        await page.evaluate(() => {
            document.getElementById('flashcard').style.removeProperty('touch-action');
            document.querySelectorAll('.flashcard-front, .flashcard-back').forEach((el) => { el.style.touchAction = 'pan-x pan-y'; });
        });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 2, klase: [] });
        // ③ reset na CIJELOM lancu = preglednik uzme vodoravni dodir → `pointercancel` → gesta stane
        await page.evaluate(() => { document.getElementById('flashcard').style.touchAction = 'pan-x pan-y'; });
        await povuci(page, 0.6);
        await page.waitForTimeout(400);
        expect(await stanje(page)).toMatchObject({ index: 2, known: [], unknown: [], klase: [] });
        // ④ vraćeno: ista gesta opet lista
        await page.evaluate(() => {
            document.getElementById('flashcard').style.removeProperty('touch-action');
            document.querySelectorAll('.flashcard-front, .flashcard-back').forEach((el) => el.style.removeProperty('touch-action'));
        });
        await povuci(page, 0.6);
        await sletjela(page);
        expect(await stanje(page)).toMatchObject({ index: 3 });
    });
});

/* ── STOLNO: SVE TIPKAMA (Leon: „da se sve može tipkama kontrolirati") ──────────
   Stolni kontekst ne ovisi o iPhone profilu, pa se mjeri jednom — isti rez koji `uredjaj.spec.js`
   već koristi za svoj stolni describe. */
test.describe('F1/13 — stolno: sve tipkama (1280×800, bez dodira)', () => {
    test.use({ hasTouch: false, isMobile: false, viewport: { width: 1280, height: 800 } });

    test('← → listaju · razmak/Enter okreće · Z = znam · X = ne znam', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'iPhone-SE-375', 'stolni kontekst je isti u svakom profilu');
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await otvoriKartice(page);

        await page.keyboard.press('ArrowRight');
        expect(await stanje(page)).toMatchObject({ index: 1, known: [], unknown: [] });
        await page.keyboard.press('ArrowRight');
        expect(await stanje(page)).toMatchObject({ index: 2, known: [], unknown: [] });
        await page.keyboard.press('ArrowLeft');
        expect(await stanje(page)).toMatchObject({ index: 1, known: [], unknown: [] });
        await expect(page.locator('#knownCount')).toHaveText('0');

        await page.keyboard.press('Space');
        await expect(page.locator(KARTICA)).toHaveClass(/flipped/);
        await page.keyboard.press('Enter');
        await expect(page.locator(KARTICA)).not.toHaveClass(/flipped/);

        await page.keyboard.press('z');
        await sletjela(page);
        await expect(page.locator('#knownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 2, known: [1] });
        await page.keyboard.press('x');
        await sletjela(page);
        await expect(page.locator('#unknownCount')).toHaveText('1');
        expect(await stanje(page)).toMatchObject({ index: 3, unknown: [2] });

        // strelice-gumbi su na stolnom VIDLJIVI i klikaju isto (od ⑥ i na dodiru — Leon 07.09.)
        await expect(page.locator('#btnPrev')).toBeVisible();
        await page.click('#btnPrev');
        expect(await stanje(page)).toMatchObject({ index: 2 });

        // …i na kraj špila se dolazi i s kompa: → na zadnjoj kartici otvara izbornik, strelice
        // biraju radnju, Enter ju pokreće (to radi sam `<button>`).
        // ⚠️ Fokus je poslije klika NA GUMBU, a straža iz F1/9 ondje tipke namjerno ne uzima
        // (gumb ima svoje). Zato se fokus prvo vrati na karticu — isto što radi .
        await page.evaluate(() => document.getElementById('flashcard').focus());
        await page.evaluate(() => { AppState.cards.index = AppState.cards.deck.length - 1; updateFlashcard(); });
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#deckEnd')).toBeVisible();
        expect(await page.evaluate(() => document.activeElement.id)).toBe('btnKrajIspocetka');
        await page.keyboard.press('ArrowDown');
        expect(await page.evaluate(() => document.activeElement.id)).toBe('btnKrajPromijesaj');
        await page.keyboard.press('Enter');
        await expect(page.locator('#deckEnd')).toBeHidden();
        expect(await stanje(page)).toMatchObject({ index: 0 });
        expect(errors).toEqual([]);
    });
});
