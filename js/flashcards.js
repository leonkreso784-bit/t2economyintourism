// ===== SOKRAT STUDY — FLASHCARDS =====

let flashcardListenersInitialized = false;

function initFlashcards() {
    const cards = AppState.cards;
    cards.deck = getAllFlashcards();
    shuffleArray(cards.deck);
    cards.index = 0;
    cards.known = [];
    cards.unknown = [];
    
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

/**
 * BUG-047 — IDENTITET KARTICE. „Znam" je do 12.09. spremao POZICIJU u promiješanom špilu:
 * sutra je na poziciji 0 druga kartica, pa su se obje vodile kao isti broj; napredak je k tome
 * po PREDMETU, a špil po LEKCIJI, pa su se indeksi triju lekcija miješali u istom nizu. Broj
 * „naučeno" je bio šum, a sync-unija (pretpostavlja stringove) ga nije ni dohvaćala.
 *
 * Identitet: `card.id` (schema v2, 6 znakova) kad postoji. Ne postoji u sedam HR predmeta i
 * dijelu `accounting`-a (1 175 od 5 737 kartica na dan 12.09.) — ondje deterministički otisak
 * `kategorija|pitanje` (FNV-1a, base36). Stabilan dok se pitanje ne promijeni; promjena
 * pitanja = nova kartica, što je za „naučeno" pošteno. `final` = kopija M1⊕M2 → ista kartica
 * ima isti id u obje lekcije, pa naučeno u midterm-u vrijedi i u finalu. Vraća UVIJEK string.
 * Brana: `tests/unit/flashcard-identity.test.js`.
 */
function cardIdentity(card) {
    if (card && typeof card.id === 'string' && card.id) return card.id;
    const s = String(card && card.category || '') + '|' + String(card && card.question || '');
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return 'q:' + h.toString(36);
}

function saveFlashcardProgress() {
    const cards = AppState.cards;
    const znam = cards.known.map(i => cardIdentity(cards.deck[i]));
    // Stari brojčani zapisi (pozicije) ovdje ispadaju — `loadProgress` ih isto odbacuje, a prvi
    // upis s bilo kojeg uređaja ih time izbaci i iz oblaka (upsert piše cijeli redak).
    const stari = (progress.flashcardsLearned || []).filter(x => typeof x === 'string');
    progress.flashcardsLearned = [...new Set([...stari, ...znam])];
    saveProgress();
}
