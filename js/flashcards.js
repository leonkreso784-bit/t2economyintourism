// ===== SOKRAT STUDY — FLASHCARDS =====

let flashcardListenersInitialized = false;

/* ── F1/13 — TABLICA AKCIJA: JEDNA ČINJENICA, JEDNO MJESTO (2026-09-06) ──────
   Leon: „Ako se povuče lijevo vraća se na prijašnju, desno ide na sljedeću. Kada se okrene
   daje odgovor. Know i don't know stoje dolje kao što Tinder ima lajk i ✕." + „da se sve
   može tipkama kontrolirati".

   Pet radnji, a svaka ima do četiri ulaza: gumb u markupu, gestu palcem, tipku i ime. Do
   F1/13 su ti ulazi stajali na tri mjesta — `addEventListener` po id-u, `switch` u `naTipku`
   i `aria-label` u markupu — i ništa nije jamčilo da govore o ISTOJ radnji. Ovdje stoje
   jednom: gumbe veže `initFlashcards` po tablici, tipku traži `naTipku` u tablici, a
   tutorial (F1/14) će iz nje čitati natpise — bez druge kopije popisa (ADR-027).

   ⚠️ `radnja` je CIJELA radnja, ne primitiv: „znam" je let s pečatom PA `markKnown`, ne samo
   upis — inače bi gumb i tipka pod istim imenom radili dvije različite stvari.
   ⚠️ Tipke su bez modifikatora (⌘/Ctrl/Alt su prečaci preglednika) i ne smiju se preklapati;
   `tests/unit/flashcard-swipe.test.js` oboje BROJI, kao i to da svaki `gumb` postoji u markupu.
   **Z = „znam", X = ✕** (Leon): hrvatska QWERTZ tipkovnica ima oboje pod lijevom rukom. */
const AKCIJE = Object.freeze({
    prethodna: Object.freeze({ gumb: 'btnPrev',    gesta: 'lijevo', tipke: Object.freeze(['ArrowLeft']),  i18n: 'fc.prev',     radnja: () => idiNatrag() }),
    sljedeca:  Object.freeze({ gumb: 'btnNext',    gesta: 'desno',  tipke: Object.freeze(['ArrowRight']), i18n: 'fc.next',     radnja: () => idiNaprijed() }),
    okreni:    Object.freeze({ gumb: null,         gesta: 'dodir',  tipke: Object.freeze([' ', 'Enter']), i18n: 'fc.flip',     radnja: () => okreni() }),
    znam:      Object.freeze({ gumb: 'btnCorrect', gesta: null,     tipke: Object.freeze(['z']),          i18n: 'fc.know',     radnja: () => sudi(1) }),
    neznam:    Object.freeze({ gumb: 'btnWrong',   gesta: null,     tipke: Object.freeze(['x']),          i18n: 'fc.dontKnow', radnja: () => sudi(-1) })
});

/* Radnje IZBORNIKA KRAJA ŠPILA — zasebna tablica, jer se ne vežu na gestu ni na tipku nego samo
   na svoj gumb, i žive samo dok je izbornik otvoren. Ista pravila: id iz markupa, ime iz i18n-a,
   radnja izvršna (F1/13 ②). Sve tri idu kroz `postaviSpil` i NIJEDNA ne dira upisani napredak. */
const KRAJ = Object.freeze({
    ispocetka:  Object.freeze({ gumb: 'btnKrajIspocetka',  i18n: 'fc.end.restart', radnja: () => krajIspocetka() }),
    promijesaj: Object.freeze({ gumb: 'btnKrajPromijesaj', i18n: 'fc.end.shuffle', radnja: () => krajPromijesaj() }),
    ponovi:     Object.freeze({ gumb: 'btnKrajPonovi',     i18n: 'fc.end.repeat',  radnja: () => krajPonovi() })
});

function initFlashcards() {
    const deck = getAllFlashcards();
    shuffleArray(deck);
    postaviSpil(deck);

    // Only add event listeners once to prevent duplicates
    if (!flashcardListenersInitialized) {
        document.getElementById('flashcard').addEventListener('click', flipCard);
        // F1/13: gumbi se vežu PO TABLICI — id u markupu, radnja u tablici. Dotad je svaki
        // gumb imao vlastiti redak s vlastitim imenom funkcije, pa se ulaz i značenje radnje
        // dalo razići a da nijedna brana to ne vidi.
        vezeGumbe(AKCIJE);
        vezeGumbe(KRAJ);     // F1/13 ②: tri radnje izbornika kraja špila
        initKraj();          // …i njegove tipke (strelice biraju, Escape vraća na karticu)
        initSwipe();         // F1/9: dodirna gesta (samo `pointerType === 'touch'`)
        initTipke();         // F1/9 ② → F1/13: tipke iz tablice (← → · razmak/Enter · X · Z)
        initKadar();         // F1/12 ①: prati visinu donje trake (okretanje, pragovi, sigurni rub)
        flashcardListenersInitialized = true;
    }
}

/**
 * F1/13 — JEDAN PUT DO NOVOG ŠPILA. Ulazak u mod (`initFlashcards`) i sve tri radnje izbornika
 * kraja špila zovu isto: `resetSwipe` (nijedna kartica ne smije ostati „u letu"), mjerenje kadra
 * PRIJE prvog crtanja (F1/12) i tri osvježenja. Upisani napredak (`progress.flashcardsLearned`,
 * `saveFlashcardProgress`) se OVDJE ne dira — mijenja se špil, ne ono što je zapisano.
 */
function postaviSpil(deck) {
    const cards = AppState.cards;
    cards.deck = deck || [];
    cards.index = 0;
    cards.known = [];
    cards.unknown = [];

    resetSwipe();            // F1/9: špil se puni iznova → nijedna kartica ne smije ostati „u letu"
    zatvoriKraj();           // F1/13 ②: novi špil nikad ne ostaje iza izbornika kraja
    osvjeziKadar();          // F1/12: rezerva za donju traku ide u CSS PRIJE prvog crtanja kartice
    updateFlashcard();
    updateFlashcardProgress();
    updateFlashcardStats();
}

/** Veži klik na svaki gumb koji tablica imenuje (id u markupu → radnja u tablici). */
function vezeGumbe(tablica) {
    Object.keys(tablica).forEach((id) => {
        const a = tablica[id];
        if (!a.gumb) return;
        const g = document.getElementById(a.gumb);
        if (g && typeof g.addEventListener === 'function') g.addEventListener('click', () => a.radnja());
    });
}

function getAllFlashcards() {
    const content = AppState.nav.data;
    if (!content) return [];
    let all = [];
    getCategories(content).forEach(category => {
        if (content[category] && content[category].flashcards && Array.isArray(content[category].flashcards)) {
            content[category].flashcards.forEach(card => {
                all.push({
                    ...card,
                    category: category,
                    categoryName: content[category].name,
                    // M3b: boja SEKCIJE putuje uz karticu — `card.color` (ako postoji) je pregazi.
                    catColor: content[category].color
                });
            });
        }
    });
    return all;
}

function flipCard() {
    // F1/9: povlačenje prstom zna završiti i `click`-om (preglednik ga pošalje poslije `pointerup`-a
    // na istom elementu) — taj klik je REP GESTE, ne „okreni". Zastavicu diže samo dodirna gesta;
    // sljedeći `pointerdown` je briše, pa klik koji nikad ne stigne ne može progutati idući dodir.
    if (swipe.progutajKlik) { swipe.progutajKlik = false; return; }
    document.getElementById('flashcard').classList.toggle('flipped');
}

/**
 * M3b — akcent kartice (ugovor: docs/product/UGC_SPEC.md §3).
 * Kartica bez svoje boje naslijedi boju sekcije; ni jedno ni drugo → svojstvo se UKLONI,
 * inače bi boja prethodne kartice ostala na sljedećoj (jedan te isti DOM za cijeli špil).
 * Validacija je u `SokratBlocks` — jedno mjesto istine za sve study-modove.
 */
function applyCardAccent(card) {
    const el = document.getElementById('flashcard');
    if (window.SokratBlocks && typeof SokratBlocks.applyAccent === 'function') {
        SokratBlocks.applyAccent(el, card ? [card.color, card.catColor] : []);
    }
}

function updateFlashcard() {
    const cards = AppState.cards;
    if (!cards.deck || cards.deck.length === 0) {
        const tr = (k, fb) => (typeof t === 'function' ? t(k) : fb);
        applyCardAccent(null);
        document.getElementById('cardCategory').textContent = tr('fc.noCards', 'No Cards');
        document.getElementById('cardQuestion').textContent = tr('fc.noCardsAvailable', 'No flashcards available for this lesson.');
        document.getElementById('cardAnswer').textContent = tr('fc.trySelecting', 'Try selecting a different lesson or category.');
        document.getElementById('cardExplanation').textContent = '';
        updateDeckGhosts();
        return;
    }
    
    const card = cards.deck[cards.index];
    applyCardAccent(card);
    document.getElementById('cardCategory').textContent = card.categoryName;
    document.getElementById('cardQuestion').textContent = card.question;
    document.getElementById('cardAnswer').textContent = card.answer;
    document.getElementById('cardExplanation').textContent = card.explanation || '';

    document.getElementById('flashcard').classList.remove('flipped');

    // ADR-009: render LaTeX in question/answer/explanation (KaTeX walks the text nodes).
    if (typeof renderMath === 'function') renderMath(document.getElementById('flashcard'));
    updateDeckGhosts();
}

/**
 * F1/9 — ŠPIL: dvije kartice koje vire ispod trenutne nose boju SVOJE kartice (isti
 * `applyAccent` kao i lice), da se na telefonu vidi što slijedi i kojoj sekciji pripada.
 * Bez sljedeće kartice sjena se skriva (`hidden`), pa zadnja kartica stoji sama — kao i
 * dosad na stolnom, gdje sjene ne postoje uopće (CSS ih crta samo pod `:root[data-uredjaj~="dodir"]`,
 * F1/12 ⓪ — platforma zna uređaj na jednom mjestu).
 */
function updateDeckGhosts() {
    const cards = AppState.cards;
    for (let i = 1; i <= 2; i++) {
        const g = document.getElementById('flashcardGhost' + i);
        if (!g) continue;
        const card = cards.deck ? cards.deck[cards.index + i] : null;
        g.hidden = !card;
        if (window.SokratBlocks && typeof SokratBlocks.applyAccent === 'function') {
            SokratBlocks.applyAccent(g, card ? [card.color, card.catColor] : []);
        }
    }
}

function updateFlashcardProgress() {
    const cards = AppState.cards;
    if (!cards.deck || cards.deck.length === 0) {
        document.getElementById('cardProgress').textContent = '0 / 0';
        document.getElementById('cardProgressBar').style.width = '0%';
        return;
    }

    const prog = `${cards.index + 1} / ${cards.deck.length}`;
    document.getElementById('cardProgress').textContent = prog;

    const percent = ((cards.index + 1) / cards.deck.length) * 100;
    document.getElementById('cardProgressBar').style.width = `${percent}%`;
}

function updateFlashcardStats() {
    document.getElementById('knownCount').textContent = AppState.cards.known.length;
    document.getElementById('unknownCount').textContent = AppState.cards.unknown.length;
}

function prevCard() {
    const cards = AppState.cards;
    if (cards.index > 0) {
        cards.index--;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function nextCard() {
    const cards = AppState.cards;
    if (cards.index < cards.deck.length - 1) {
        cards.index++;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function markKnown() {
    const cards = AppState.cards;
    if (!cards.known.includes(cards.index)) {
        cards.known.push(cards.index);
        const idx = cards.unknown.indexOf(cards.index);
        if (idx > -1) cards.unknown.splice(idx, 1);
    }
    updateFlashcardStats();
    saveFlashcardProgress();
    trackFlashcardReview();
    idiNaprijed();
}

function markUnknown() {
    const cards = AppState.cards;
    if (!cards.unknown.includes(cards.index)) {
        cards.unknown.push(cards.index);
        const idx = cards.known.indexOf(cards.index);
        if (idx > -1) cards.known.splice(idx, 1);
    }
    updateFlashcardStats();
    idiNaprijed();
}

function saveFlashcardProgress() {
    progress.flashcardsLearned = [...new Set([...progress.flashcardsLearned, ...AppState.cards.known])];
    saveProgress();
}

/* ── F1/12 ① — KADAR: JEDINA BROJKA KOJU CSS NE MOŽE SAM (2026-09-06) ───────────
   Leon, s previewom F1/9: „Treba kartica biti veća … kao na Tinderu."
   Kadar se crta u CSS-u (`css/flashcards-section.css` §F1/12): ljuska je visoka točno
   `100dvh − var(--chrome-h)`, a kartica uzima sve što traka napretka i red gumba ne uzmu.

   Odozgo se NIŠTA ne mjeri — `--chrome-h` je token koji već postoji i već je točan na svakom
   pragu. Odozdo ne postoji ništa slično: visina donje trake (`.study-mobile-nav`) je ZBROJ
   triju činjenica iz `css/study-chrome.css` — razmaka, `min-height` gumba koji se mijenja na
   dva praga (≤ 374 px i polegnuto ≤ 900 px) i sigurnog ruba. Napisati taj zbroj kao `calc()`
   značilo bi ČETVRTU kopiju istih brojeva, koja se tiho razilazi čim netko dirne traku
   (ADR-027: jedna činjenica, jedno mjesto). Zato se mjeri PRAVI element.

   ⚠️ Mjeri se na tri okidača, i svaki od njih se stvarno dogodio u brani:
     • ulazak u mod (`initFlashcards`),
     • promjena veličine / okretanje uređaja (traka mijenja `min-height` na pragovima),
     • **promjena visine SAME trake** — sigurni rub stigne tek kad ga sustav javi, a mjerač
       telefona ga postavlja NAKON navigacije (`postaviRub` u `tests/helpers/phone-gate.js`).
       Bez `ResizeObserver` bi rezerva ostala manja za `--safe-bottom` i stranica bi
       proskrolala točno za tu razliku.
   Nikad na `scroll`: skrol ne mijenja ni jednu od ovih visina.

   Kad trake nema (≥ 48rem — tablet i polegnut telefon), svojstvo se BRIŠE, pa vrijedi
   fallback iz CSS-a (`var(--safe-bottom)`). Brisanje, ne upis nule: nula bi bila tvrdnja da
   sigurnog ruba nema. */
let kadarZakazan = false;

function osvjeziKadar() {
    const korijen = document.documentElement;
    if (!korijen || !korijen.style || typeof korijen.style.setProperty !== 'function') return;
    const traka = typeof document.querySelector === 'function' ? document.querySelector('.study-mobile-nav') : null;
    const r = traka && typeof traka.getBoundingClientRect === 'function' ? traka.getBoundingClientRect() : null;
    // `Math.ceil`: pola piksela premalo rezerve znači pola piksela skrola, a brana mjeri skrol.
    if (r && r.height > 0) korijen.style.setProperty('--kartica-dolje', Math.ceil(r.height) + 'px');
    else korijen.style.removeProperty('--kartica-dolje');
}

/** Prigušeno na kadar: `resize` i `ResizeObserver` znaju stići u rafalu, a mjeri se raspored. */
function zakaziKadar() {
    if (kadarZakazan) return;
    kadarZakazan = true;
    const posao = () => { kadarZakazan = false; osvjeziKadar(); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(posao);
    else posao();
}

function initKadar() {
    osvjeziKadar();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', zakaziKadar);
        window.addEventListener('orientationchange', zakaziKadar);
    }
    const traka = typeof document.querySelector === 'function' ? document.querySelector('.study-mobile-nav') : null;
    if (traka && typeof ResizeObserver === 'function') new ResizeObserver(zakaziKadar).observe(traka);
}

/* ── F1/9 — TINDER-ŠPIL NA DODIRU (2026-09-06) ─────────────────────────────────
   Leon (2026-09-05): „na mobitelu bi napravio za kartice kao tinder način otvaranja i gledanja";
   (2026-09-06): „samo na mobitelu, ne vidim kako bi mogao funkcionirati na kompu".
   Do F1/9 u modovima učenja nije bilo NIJEDNE dodirne geste: jedna kartica, klik okreće, četiri gumba.

   ŠTO JE GESTA, A ŠTO NIJE
   • dodir bez pomaka = okreni — na `pointerup`, jer Chromium poslije brzog zamaha potisne `click`
     sljedećeg dodira (izmjereno na goloj stranici); miš i dalje okreće klikom;
   • **F1/13 (Leon, isti dan, s previewom): povlačenje DESNO = SLJEDEĆA, LIJEVO = PRETHODNA** —
     gesta LISTA i ne upisuje ništa; sudi se gumbima ✓ / ✕ (i tipkama Z / X), koji lete naprijed
     s pečatom i tek po slijetanju zovu `markKnown` / `markUnknown`. Jedini put u `cards.known` /
     `cards.unknown` / `saveFlashcardProgress` ostaju te dvije funkcije
     (`tests/unit/flashcard-swipe.test.js` to BROJI, ne tvrdi);
   • samo `pointerType === 'touch'` — miš i olovka ostaju kod današnjeg prikaza (stolno = kao danas);
   • okomit pomak nije gesta: `touch-action: pan-y` na kartici (CSS) pušta preglednik da skrola, a
     nama stižu samo vodoravni pomaci; što prije `SLOP`-a krene više okomito, prepušta se pregledniku;
   • gumbi ostaju ispod špila (pristupačnost) — gesta je prečac, ne zamjena.

   KAKO, BEZ BIBLIOTEKE
   `pointerdown` pamti ishodište; prvi pomak koji je pretežno vodoravan i veći od `SLOP` uzima pokazivač
   (`setPointerCapture`) i od tada JS piše SAMO TRI BROJKE kao CSS-varijable — `--swipe-x` (px),
   `--swipe-rot` (deg), `--swipe-p` (−1…1, koliko je odluka blizu) — i tri stanja kao klase
   (`is-dragging` · `is-flying` · `is-entering`); sve crtanje je u `flashcards-section.css` §F1/9.
   Otpuštanje iznad praga (trećina širine kartice, najmanje `PRAG_MIN`) = let van ekrana; ispod =
   povratak (varijable se obrišu, prijelaz iz CSS-a vrati karticu). Kraj leta javlja `transitionend`,
   a `LET_MS` je REZERVA (kartica skrivena usred leta, kartica bez prijelaza) — upis se dogodi točno
   jednom, ma koji od njih stigao prvi; `gen` (naraštaj) jamči da let poništen novim špilom
   (`initFlashcards` → `resetSwipe`) nikad ne upiše u tuđi špil. Nova kartica ulazi pod `is-entering`
   (prijelazi ugašeni jedan kadar): bez toga bi se naličje vidljivo okretalo natrag, a kartica
   „vraćala" s ruba ekrana. `prefers-reduced-motion` → leta nema, upis odmah, kartica se samo zamijeni. */
const swipe = {
    SLOP: 10,        // px prije nego pomak postane gesta (ispod = dodir → okretanje)
    PRAG_MIN: 90,    // px — najmanji put koji znači odluku; trećina kartice je više na širim ekranima
    LET_MS: 320,     // rezerva za `transitionend` (let u CSS-u traje 280 ms)
    id: null, x0: 0, y0: 0, dx: 0, aktivno: false, leti: false, progutajKlik: false, timer: 0, gen: 0, naKraj: null
};

function swipeEl() { return document.getElementById('flashcard'); }

function swipePrag(el) {
    return Math.max(swipe.PRAG_MIN, Math.round((el.offsetWidth || 0) / 3));
}

/* F1/13: povlačenje više NE nosi sud, pa ne piše ni `--swipe-p` — prst samo pomiče i naginje
   karticu. `--swipe-p` od F1/13 znači SUD (+1 znam · −1 ne znam) i piše ga isključivo `swipeLet`
   kad let dolazi s gumba ✓ / ✕; pečat se zato više ne može pojaviti usred listanja. */
function swipePostavi(el, dx) {
    el.style.setProperty('--swipe-x', dx + 'px');
    el.style.setProperty('--swipe-rot', Math.max(-14, Math.min(14, dx / 14)).toFixed(2) + 'deg');
}

function swipeOcisti(el) {
    el.style.removeProperty('--swipe-x');
    el.style.removeProperty('--swipe-rot');
    el.style.removeProperty('--swipe-p');
}

/** Poništi sve što je gesta ostavila — zove ga `initFlashcards` (novi špil usred leta ne smije naslijediti stanje). */
function resetSwipe() {
    const el = swipeEl();
    if (!el) return;
    swipe.gen++;
    if (swipe.timer) { clearTimeout(swipe.timer); swipe.timer = 0; }
    if (swipe.naKraj) { el.removeEventListener('transitionend', swipe.naKraj); swipe.naKraj = null; }
    swipe.id = null; swipe.aktivno = false; swipe.leti = false; swipe.progutajKlik = false;
    el.classList.remove('is-dragging', 'is-flying', 'is-entering', 'is-sud', 'is-slijeva');
    swipeOcisti(el);
}

function initSwipe() {
    const el = swipeEl();
    if (!el || typeof el.addEventListener !== 'function') return;
    el.addEventListener('pointerdown', swipeDown);
    el.addEventListener('pointermove', swipeMove);
    el.addEventListener('pointerup', swipeUp);
    el.addEventListener('pointercancel', swipeCancel);
}

function swipeDown(e) {
    if (e.pointerType !== 'touch' || e.isPrimary === false || swipe.leti) return;
    if (krajOtvoren()) return;             // ploča kraja špila stoji NAD karticom — prst ondje bira radnju
    swipe.progutajKlik = false;            // nova gesta: rep prethodne (ako ga je bilo) je već prošao
    swipe.id = e.pointerId; swipe.x0 = e.clientX; swipe.y0 = e.clientY;
    swipe.dx = 0; swipe.aktivno = false;
}

function swipeMove(e) {
    if (swipe.id === null || e.pointerId !== swipe.id) return;
    const el = swipeEl();
    const dx = e.clientX - swipe.x0, dy = e.clientY - swipe.y0;
    if (!swipe.aktivno) {
        if (Math.abs(dx) < swipe.SLOP && Math.abs(dy) < swipe.SLOP) return;
        if (Math.abs(dy) > Math.abs(dx)) { swipe.id = null; return; }   // okomito = skrol, preglednikov posao
        swipe.aktivno = true;
        el.classList.add('is-dragging');
        // Bez `setPointerCapture`: dodirni pokazivač ima IMPLICITNI capture na cilju `pointerdown`-a
        // (Pointer Events §implicit pointer capture), pa `pointermove`/`pointerup` stižu ovamo i kad prst
        // pobjegne s kartice — izmjereno CDP-sondom (2026-09-06): let i upis rade bez eksplicitnog.
    }
    swipe.dx = dx;
    swipePostavi(el, dx);
}

function swipeUp(e) {
    if (swipe.id === null || e.pointerId !== swipe.id) return;
    const el = swipeEl();
    const bio = swipe.aktivno, dx = swipe.dx;
    swipe.id = null; swipe.aktivno = false;
    swipe.progutajKlik = true;             // rep geste (ako stigne) nije okretanje — ni poslije povlačenja ni poslije dodira
    if (!bio) {
        // Dodir bez pomaka = okreni — OVDJE, ne u `click`-u. IZMJERENO (CDP-sonda na GOLOJ stranici,
        // 2026-09-06): Chromium poslije brzog vodoravnog zamaha (fling) POTISNE `click` sljedećeg
        // dodira (i 3 s kasnije; spor zamah ne), a `pointerdown`/`pointerup` stignu uredno. Da tap ne
        // ovisi o tome hoće li preglednik sintetizirati klik, okreće se na `pointerup`, a klik koji
        // ipak stigne guta zastavica gore (sljedeći `pointerdown` je briše).
        document.getElementById('flashcard').classList.toggle('flipped');
        return;
    }
    el.classList.remove('is-dragging');
    if (Math.abs(dx) < swipePrag(el)) { swipeOcisti(el); return; }   // ispod praga: povratak (prijelaz iz CSS-a)
    // F1/13 — RUB ŠPILA: prije prve kartice nema ničega, pa lijevo ondje ODSKOČI (isti povratak
    // kao kratko povlačenje, bez leta i bez upisa). Desno na zadnjoj vodi u izbornik kraja špila,
    // što je posao `idiNaprijed()` — gesta o tome ne zna ništa.
    if (dx < 0 && AppState.cards.index <= 0) { swipeOcisti(el); return; }
    swipeLet(el, dx > 0 ? 1 : -1, dx > 0 ? idiNaprijed : idiNatrag, 0);
}

function swipeCancel(e) {
    if (swipe.id === null || e.pointerId !== swipe.id) return;
    const el = swipeEl();
    const bio = swipe.aktivno;
    swipe.id = null; swipe.aktivno = false;
    if (!bio) return;
    swipe.progutajKlik = true;
    el.classList.remove('is-dragging');
    swipeOcisti(el);                       // preglednik je uzeo pokazivač (skrol, sustav) → ništa se ne upisuje
}

/**
 * Let kartice van ekrana, pa `poslije()` po slijetanju.
 * @param {number} smjer  +1 desno, −1 lijevo — KUDA kartica odlazi.
 * @param {Function} poslije  što se dogodi kad sleti (listanje ili upis) — točno jednom.
 * @param {number} sud  F1/13: 0 = listanje (bez pečata) · +1 = znam · −1 = ne znam. SMJER I SUD SU
 *   DVIJE STVARI: ✕ leti NAPRIJED (smjer +1, jer i ono ide na sljedeću) a nosi pečat „Ne znam".
 */
function swipeLet(el, smjer, poslije, sud) {
    const bezPokreta = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (bezPokreta) { swipeOcisti(el); swipeSleti(el, poslije); return; }
    swipe.leti = true;
    const gen = swipe.gen;
    const daleko = (el.offsetWidth || 0) + (window.innerWidth || 0);
    el.style.setProperty('--swipe-x', (smjer * daleko) + 'px');
    el.style.setProperty('--swipe-rot', (smjer * 18) + 'deg');
    if (sud) { el.style.setProperty('--swipe-p', String(sud)); el.classList.add('is-sud'); }
    el.classList.add('is-flying');
    const kraj = () => {
        if (gen !== swipe.gen || !swipe.leti) return;   // let je poništen (novi špil) ili već sletio
        el.removeEventListener('transitionend', naKraj);
        swipe.naKraj = null;
        if (swipe.timer) { clearTimeout(swipe.timer); swipe.timer = 0; }
        swipe.leti = false;
        swipeSleti(el, poslije);
    };
    const naKraj = (ev) => { if (!ev || ev.target === el) kraj(); };
    swipe.naKraj = naKraj;
    el.addEventListener('transitionend', naKraj);
    swipe.timer = setTimeout(kraj, swipe.LET_MS);
}

/** Slijetanje: prijelazi ugašeni (`is-entering`), let/varijable obrisani, radnja kroz postojeću
 *  funkciju (listanje ili upis), pa kadar poslije prijelazi natrag. `is-slijeva` (ulazak s LIJEVE
 *  strane) dodaje `idiNatrag()` dok ova klasa stoji — zato ga isti rAF i skida. */
function swipeSleti(el, poslije) {
    el.classList.add('is-entering');
    el.classList.remove('is-flying', 'is-sud');
    swipeOcisti(el);
    poslije();
    const skini = () => el.classList.remove('is-entering', 'is-slijeva');
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(skini));
    else skini();
}

/* ── F1/13 — RADNJE: LISTANJE, SUD, OKRETANJE ─────────────────────────────
   Sve što korisnik može napraviti s karticom prolazi kroz ove tri funkcije — gumb, gesta i tipka
   zovu ISTU, preko tablice `AKCIJE`. Pravilo: **listanje je trenutno, sud leti.**

   ⚠️ Zašto gumb ← / → i tipka ← / → NE lete, a gesta i ✓ / ✕ lete:
     • gesta MORA razriješiti pomak — prst je karticu već odveo s mjesta, pa ona ili odleti ili se
       vrati; to je fizika, ne ukras;
     • sud SMIJE stajati 280 ms — upis je jednokratan i let ga štiti od dvostrukog okidanja (straža
       `swipe.leti`), a pečat je jedina potvrda koju korisnik dobije;
     • listanje NE SMIJE — kroz špil se ide brzo i uzastopno, a let bi svaku drugu tipku pojeo
       (straža koja štiti upis ovdje bi smetala). Zato gumb i tipka listaju odmah. */

/** Naprijed: sljedeća kartica; na zadnjoj — IZBORNIK KRAJA ŠPILA (F1/13 ②). */
function idiNaprijed() {
    const cards = AppState.cards;
    if (!cards.deck || !cards.deck.length) return;
    if (cards.index >= cards.deck.length - 1) { otvoriKraj(); return; }
    nextCard();
}

/** Natrag: prethodna kartica; na prvoj ne radi ništa (gesta ondje odskoči, v. `swipeUp`). */
function idiNatrag() {
    const cards = AppState.cards;
    if (!cards.deck || !cards.deck.length) return;
    if (cards.index <= 0) return;
    const el = swipeEl();
    // Ulazak S LIJEVE strane ima smisla samo kad kartica UPRAVO slijeće (`is-entering`, jedan kadar);
    // isti rAF u `swipeSleti` ga i skida, pa klasa ne moze ostati visjeti poslije klika na strelicu.
    if (el && el.classList.contains('is-entering')) el.classList.add('is-slijeva');
    prevCard();
}

/** Sud: ✓ / ✕ — let NAPRIJED s pečatom, upis (`markKnown`/`markUnknown`) tek po slijetanju. */
function sudi(sud) {
    const el = swipeEl();
    if (!el || swipe.leti || swipe.aktivno) return;
    const cards = AppState.cards;
    if (!cards.deck || !cards.deck.length) return;
    swipeLet(el, 1, sud > 0 ? markKnown : markUnknown, sud);
}

/** Okretanje tipkom/gestom: zastavica repa geste se TROŠI ovdje, da tipka nikad ne bude progutana. */
function okreni() {
    swipe.progutajKlik = false;
    flipCard();
}

/* ── F1/13 — TIPKE: SVE IZ TABLICE (2026-09-06) ──────────────────────────
   Leon: „dobro bi bilo da i na kompu imamo strelicu … da se sve može tipkama kontrolirati."
   ← / → = prethodna / sljedeća · razmak / Enter = okreni · **X = ne znam · Z = znam**. Popis više
   nije `switch` nego TABLICA (gore) — tipka se u njoj TRAŽI, pa nova radnja ne može dobiti tipku
   koju nitko ne vidi u tutorialu.
   Straže su iz F1/9 i ostaju: samo dok je otvoren mod kartica; nikad iznad polja za unos, gumba,
   poveznice ili otvorenog modala (ondje tipke već znače nešto drugo) i nikad s modifikatorom
   (⌘ / Ctrl / Alt = prečaci preglednika). Gumbi i klik ostaju netaknuti. */
function initTipke() {
    if (typeof document.addEventListener !== 'function') return;
    document.addEventListener('keydown', naTipku);
}

/** Tipka → radnja iz tablice. Jednoslovne se normaliziraju (Shift+X je i dalje X), imenovane ne. */
function akcijaZaTipku(key) {
    if (typeof key !== 'string') return null;
    const k = key.length === 1 ? key.toLowerCase() : key;
    const id = Object.keys(AKCIJE).find((x) => AKCIJE[x].tipke.indexOf(k) >= 0);
    return id ? AKCIJE[id] : null;
}

function naTipku(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const akcija = akcijaZaTipku(e.key);
    if (!akcija) return;
    const nav = AppState.nav;
    if (!nav || nav.page !== 'study' || nav.section !== 'flashcards') return;
    const meta = e.target;
    if (meta && typeof meta.closest === 'function' && meta.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
    // Zatvoren `<sokrat-modal>` OSTAJE u DOM-u (`aria-hidden="true"`, `visibility: hidden` — i dalje ima
    // pravokutnik!), otvoren nosi `aria-hidden="false"` i `body.modal-open`. Pita se ATRIBUT, ne geometrija.
    const modal = typeof document.querySelector === 'function' ? document.querySelector('[aria-modal="true"]:not([aria-hidden="true"])') : null;
    if (modal || (document.body && document.body.classList && document.body.classList.contains('modal-open'))) return;
    const el = swipeEl();
    if (!el || swipe.leti || swipe.aktivno) return;
    if (!AppState.cards.deck || !AppState.cards.deck.length) return;
    // Dok je izbornik kraja otvoren, tipke pripadaju NJEMU (`initKraj`): strelice biraju radnju,
    // Enter ju pokreće, Escape se vraća na karticu. Straža `closest('button')` gore hvata samo
    // slučaj kad je fokus doista na gumbu — a fokus se zna izgubiti (klik u prazno).
    if (krajOtvoren()) return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    akcija.radnja();
}

/* ── F1/13 ② — IZBORNIK KRAJA ŠPILA (2026-09-06) ───────────────────────────────
   Leon (§6/8, isti dan): „Kada ode desno do zadnje kartice bude izbornik da se krene ispočetka i
   da se promiješaju kartice, ponovi ne znam."

   Tri radnje, sve tri kroz `postaviSpil` — dakle isti put kojim se špil postavlja pri ulasku u mod
   (`resetSwipe`, mjerenje kadra, tri osvježenja). **Nijedna ne dira upisani napredak:**
   `progress.flashcardsLearned` i `saveFlashcardProgress` se ovdje ne zovu; mijenja se ŠPIL, a ne
   ono što je o njemu zapisano.

   ⚠️ „Ponovi ne znam" mora pročitati `cards.unknown` PRIJE `postaviSpil`, jer taj put briše i
   `known` i `unknown` (indeksi vrijede za stari špil).
   ⚠️ Prazan „ne znam" ne skriva radnju nego ju ONEMOGUĆUJE i ispisuje razlog (i18n `fc.end.none`) —
   skrivena radnja ostavlja korisnika da nagađa što nedostaje.
   ⚠️ Fokus: pri otvaranju ulazi u prvu DOSTUPNU radnju, pri zatvaranju se vraća na karticu
   (`tabindex="-1"`). Bez toga fokus ostaje na skrivenom gumbu — a ondje `naTipku` staje na straži
   `closest('button')`, pa tipke tiho prestanu raditi. */
function krajEl() { return typeof document.getElementById === 'function' ? document.getElementById('deckEnd') : null; }

function krajOtvoren() {
    const k = krajEl();
    return !!k && !k.hidden;
}

/** Gumbi izbornika, redom iz tablice — jedan izvor i za vezanje i za kretanje strelicama. */
function krajGumbi() {
    return Object.keys(KRAJ)
        .map((id) => document.getElementById(KRAJ[id].gumb))
        .filter((g) => g);
}

function otvoriKraj() {
    const k = krajEl();
    if (!k || krajOtvoren()) return;
    const cards = AppState.cards;
    const imaNeznanih = !!(cards.unknown && cards.unknown.length);
    const ponovi = document.getElementById(KRAJ.ponovi.gumb);
    if (ponovi) ponovi.disabled = !imaNeznanih;
    const razlog = document.getElementById('deckEndHint');
    if (razlog) razlog.hidden = imaNeznanih;
    k.hidden = false;
    const prva = krajGumbi().filter((g) => !g.disabled)[0];
    if (prva && typeof prva.focus === 'function') prva.focus();
}

/** Zatvori i vrati fokus na karticu; vraća je li uopće bio otvoren (Escape to treba znati). */
function zatvoriKraj() {
    const k = krajEl();
    if (!k || k.hidden) return false;
    k.hidden = true;
    const el = swipeEl();
    if (el && typeof el.focus === 'function') el.focus();
    return true;
}

function krajIspocetka() { postaviSpil((AppState.cards.deck || []).slice()); }

function krajPromijesaj() {
    const spil = (AppState.cards.deck || []).slice();
    shuffleArray(spil);              // isti miješalac kao `initFlashcards` — jedno mjesto
    postaviSpil(spil);
}

function krajPonovi() {
    const cards = AppState.cards;
    const spil = (cards.unknown || []).map((i) => cards.deck[i]).filter((c) => c);
    if (!spil.length) return;        // gumb je onemogućen; straža je za tipkovnicu i za nas
    postaviSpil(spil);
}

/** Strelice biraju radnju (gore/dolje = lijevo/desno: ploča je stupac, ali obje osi znače isto),
 *  Enter/razmak ju pokreću (to radi sam `<button>`), Escape vraća na zadnju karticu. */
function initKraj() {
    const k = krajEl();
    if (!k || typeof k.addEventListener !== 'function') return;
    k.addEventListener('keydown', naTipkuKraj);
}

function naTipkuKraj(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        zatvoriKraj();
        return;
    }
    const dolje = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const gore = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!dolje && !gore) return;
    const gumbi = krajGumbi().filter((g) => !g.disabled);
    if (!gumbi.length) return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    const sad = gumbi.indexOf(e.target);
    const idx = sad < 0 ? 0 : (sad + (dolje ? 1 : -1) + gumbi.length) % gumbi.length;
    if (typeof gumbi[idx].focus === 'function') gumbi[idx].focus();
}

/* Read-only izvoz: tutorial (F1/14) i brane čitaju TABLICU, nikad markup ni `switch` (ADR-027).
   `SokratFlashcards` je na `window` (kao `SokratBlocks`/`SokratContent`), ne goli `const`. */
if (typeof window !== 'undefined') window.SokratFlashcards = Object.freeze({ AKCIJE: AKCIJE, KRAJ: KRAJ });
