// ===== SOKRAT STUDY — FLASHCARDS =====

let flashcardListenersInitialized = false;

function initFlashcards() {
    const cards = AppState.cards;
    cards.deck = getAllFlashcards();
    shuffleArray(cards.deck);
    cards.index = 0;
    cards.known = [];
    cards.unknown = [];

    resetSwipe();            // F1/9: špil se puni iznova → nijedna kartica ne smije ostati „u letu"
    osvjeziKadar();          // F1/12: rezerva za donju traku ide u CSS PRIJE prvog crtanja kartice
    updateFlashcard();
    updateFlashcardProgress();
    updateFlashcardStats();
    
    // Only add event listeners once to prevent duplicates
    if (!flashcardListenersInitialized) {
        document.getElementById('flashcard').addEventListener('click', flipCard);
        document.getElementById('btnPrev').addEventListener('click', prevCard);
        document.getElementById('btnNext').addEventListener('click', nextCard);
        document.getElementById('btnCorrect').addEventListener('click', markKnown);
        document.getElementById('btnWrong').addEventListener('click', markUnknown);
        initSwipe();         // F1/9: dodirna gesta (samo `pointerType === 'touch'`)
        initTipke();         // F1/9 ②: stolni pandan — strelice
        initKadar();         // F1/12 ①: prati visinu donje trake (okretanje, pragovi, sigurni rub)
        flashcardListenersInitialized = true;
    }
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
    okreni();
}

/* ── F1/12 ④ — OKRET S RAVNIM MIROM (Leon, iPhone, 06.09.: „ne mogu skrolati još uvijek") ──
   Na dodiru je kartica u miru RAVNA (CSS §F1/12 ④: bez `preserve-3d`, bez rotacije, nevidljiva
   strana `visibility: hidden`), jer iOS ne skrola naličje unutar 3D-okreta. 3D postoji samo dok
   traje animacija: `is-turning` se stavi PRIJE promjene `flipped` i makne na `transitionend`
   (ili rezervni timer — isti obrazac kao let u F1/9, jer `transitionend` zna izostati).
   Povratak s naličja ide u dva koraka: `is-restoring` (bez prijelaza) vrati 3D-okrenuto stanje,
   reflow, pa se `flipped` makne → animacija 180° → 0°. Bez toga bi se okret vrtio iz ravnog
   stanja u krivu stranu. `gen` štiti od starog timera koji bi maknuo `is-turning` novom okretu.
   Stolno: klase se toggleaju isto, ali CSS pod atributom uređaja ondje ne postoji → kao dosad. */
const OKRET_MS = 700;   // > 0.6 s prijelaza `.flashcard-inner`; reduced-motion ga skrati, timer to ne smeta
let okretGen = 0;

function okreni(zelim) {
    const el = document.getElementById('flashcard');
    if (!el || !el.classList) return;
    const okrenuta = typeof el.classList.contains === 'function' && el.classList.contains('flipped');
    const cilj = (zelim === undefined) ? !okrenuta : !!zelim;
    if (cilj === okrenuta) return;
    okretGen += 1;
    const gen = okretGen;
    // Bez `.flashcard-inner` nema što animirati (unit-pješčanik, ogoljen DOM): samo stanje, bez
    // `is-turning` — klasa koja čeka `transitionend` koji nikad ne dođe ostala bi zauvijek.
    const inner = typeof el.querySelector === 'function' ? el.querySelector('.flashcard-inner') : null;
    if (!inner) {
        if (okrenuta) el.classList.remove('flipped'); else el.classList.add('flipped');
        return;
    }
    el.classList.add('is-turning');
    if (okrenuta) {
        el.classList.add('is-restoring');
        void el.offsetWidth;                 // reflow: skok u 3D-okrenuto se mora NACRTATI prije animacije
        el.classList.remove('is-restoring');
        el.classList.remove('flipped');
    } else {
        el.classList.add('flipped');
    }
    let timer = null;
    const kraj = () => {
        if (gen !== okretGen) return;
        if (inner && typeof inner.removeEventListener === 'function') inner.removeEventListener('transitionend', naKraj);
        el.classList.remove('is-turning');
    };
    const naKraj = (e) => {
        if (e && (e.target !== inner || (e.propertyName && e.propertyName !== 'transform'))) return;
        if (timer !== null) clearTimeout(timer);
        kraj();
    };
    if (inner && typeof inner.addEventListener === 'function') inner.addEventListener('transitionend', naKraj);
    timer = setTimeout(kraj, OKRET_MS);
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

    // F1/12 ④: nova kartica = lice odmah, bez animacije; stari okret (ako još traje) se poništava.
    okretGen += 1;
    const fc = document.getElementById('flashcard');
    fc.classList.remove('flipped');
    fc.classList.remove('is-turning');
    fc.classList.remove('is-restoring');

    // ADR-009: render LaTeX in question/answer/explanation (KaTeX walks the text nodes).
    if (typeof renderMath === 'function') renderMath(document.getElementById('flashcard'));
    updateDeckGhosts();
    zakaziPreljev();         // F1/12 ③: novi tekst → izmjeri prelijeva li lice ili naličje
}

/* ── F1/12 ③ — ZNAK DA IMA JOŠ (Leon s previewom, 2026-09-06) ────────────────────
   „Neke kartice su presječene i ne vidi se sve kao odgovor na mobitelu." Kadar iz ① daje
   kartici strop, pa dugo naličje SKROLA u sebi — a na iOS-u skroler nema klizač, pa odrezan
   kraj izgleda kao kvar, ne kao poziv na skrol. JS zato zna jednu činjenicu koju CSS ne može
   izmjeriti: prelijeva li se sadržaj (`scrollHeight > clientHeight`). Zapiše je kao atribut
   `data-preljev` na lice i naličje; sve ostalo (strelica, ljepljivost) crta CSS
   (`css/flashcards-section.css` §F1/12 ③). Bez preljeva atributa nema, pa ni strelice.

   Mjeri se poslije crtanja (rAF), na dva okidača: novi tekst kartice i promjena visine kadra
   (`osvjeziKadar` — okretanje, pragovi). Okretanje kartice NE treba mjeriti: grid-stack drži
   OBJE strane nacrtane, pa je naličje mjerljivo i dok je skriveno. */
let preljevZakazan = false;

function oznaciPreljev() {
    ['.flashcard-front', '.flashcard-back'].forEach((sel) => {
        const el = typeof document.querySelector === 'function' ? document.querySelector(sel) : null;
        if (!el || typeof el.setAttribute !== 'function') return;
        // +1: na 2× i 3× gustoći `scrollHeight` zna biti veći za razlomak piksela i bez ikakvog
        // preljeva — to bi nacrtalo strelicu ispod naličja koje stane cijelo.
        if (el.scrollHeight > el.clientHeight + 1) el.setAttribute('data-preljev', '');
        else el.removeAttribute('data-preljev');
    });
}

function zakaziPreljev() {
    if (preljevZakazan) return;
    preljevZakazan = true;
    const posao = () => { preljevZakazan = false; oznaciPreljev(); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(posao);
    else posao();
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
    nextCard();
}

function markUnknown() {
    const cards = AppState.cards;
    if (!cards.unknown.includes(cards.index)) {
        cards.unknown.push(cards.index);
        const idx = cards.known.indexOf(cards.index);
        if (idx > -1) cards.known.splice(idx, 1);
    }
    updateFlashcardStats();
    nextCard();
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
    zakaziPreljev();         // F1/12 ③: nova visina kadra = nova granica preljeva
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
   • povlačenje DESNO = znam, LIJEVO = ne znam — gesta ZOVE `markKnown` / `markUnknown`, nikad ne
     duplicira upis: jedini put u `cards.known` / `cards.unknown` / `saveFlashcardProgress` ostaju te
     dvije funkcije (`tests/unit/flashcard-swipe.test.js` to BROJI, ne tvrdi);
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

function swipePostavi(el, dx) {
    const p = Math.max(-1, Math.min(1, dx / swipePrag(el)));
    el.style.setProperty('--swipe-x', dx + 'px');
    el.style.setProperty('--swipe-rot', Math.max(-14, Math.min(14, dx / 14)).toFixed(2) + 'deg');
    el.style.setProperty('--swipe-p', p.toFixed(3));
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
    el.classList.remove('is-dragging', 'is-flying', 'is-entering');
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
        okreni();                        // F1/12 ④: isti okret kao klik — 3D samo dok animacija traje
        return;
    }
    el.classList.remove('is-dragging');
    if (Math.abs(dx) >= swipePrag(el)) swipeLet(el, dx > 0 ? 1 : -1);
    else swipeOcisti(el);                  // povratak: bez varijabli prijelaz iz CSS-a vrati karticu
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

function swipeLet(el, smjer) {
    const upis = smjer > 0 ? markKnown : markUnknown;
    const bezPokreta = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (bezPokreta) { swipeOcisti(el); swipeSleti(el, upis); return; }
    swipe.leti = true;
    const gen = swipe.gen;
    const daleko = (el.offsetWidth || 0) + (window.innerWidth || 0);
    el.style.setProperty('--swipe-x', (smjer * daleko) + 'px');
    el.style.setProperty('--swipe-rot', (smjer * 18) + 'deg');
    el.style.setProperty('--swipe-p', String(smjer));
    el.classList.add('is-flying');
    const kraj = () => {
        if (gen !== swipe.gen || !swipe.leti) return;   // let je poništen (novi špil) ili već sletio
        el.removeEventListener('transitionend', naKraj);
        swipe.naKraj = null;
        if (swipe.timer) { clearTimeout(swipe.timer); swipe.timer = 0; }
        swipe.leti = false;
        swipeSleti(el, upis);
    };
    const naKraj = (ev) => { if (!ev || ev.target === el) kraj(); };
    swipe.naKraj = naKraj;
    el.addEventListener('transitionend', naKraj);
    swipe.timer = setTimeout(kraj, swipe.LET_MS);
}

/** Slijetanje: prijelazi ugašeni (`is-entering`), let/varijable obrisani, UPIS kroz postojeću funkciju, pa kadar poslije prijelazi natrag. */
function swipeSleti(el, upis) {
    el.classList.add('is-entering');
    el.classList.remove('is-flying');
    swipeOcisti(el);
    upis();
    const skini = () => el.classList.remove('is-entering');
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(skini));
    else skini();
}

/* ── F1/9 ② — STOLNI PANDAN PALCU: STRELICE ─────────────────────────────────────
   Leon (2026-09-06): špil „samo na mobitelu … ali ako imaš viziju probaj nešto". Stolno zadržava
   IZGLED (jedna kartica, gumbi, bez špila), ali dobiva isti TOK bez ijednog klika: → = znam,
   ← = ne znam, razmak / Enter = okreni — uz isti let kartice i pečat kao kod povlačenja, pa se odluka
   VIDI, ne samo upiše. Radi samo dok je otvoren mod kartica; nikad iznad polja za unos, gumba,
   poveznice ili otvorenog modala (ondje tipke već znače nešto drugo) i nikad s modifikatorom
   (⌘ / Ctrl / Alt = prečaci preglednika). Gumbi i klik ostaju netaknuti. */
function initTipke() {
    if (typeof document.addEventListener !== 'function') return;
    document.addEventListener('keydown', naTipku);
}

function naTipku(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== ' ' && e.key !== 'Enter') return;
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
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (e.key === 'ArrowRight') swipeLet(el, 1);
    else if (e.key === 'ArrowLeft') swipeLet(el, -1);
    else { swipe.progutajKlik = false; flipCard(); }
}
