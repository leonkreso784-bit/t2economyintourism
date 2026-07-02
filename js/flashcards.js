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
    if (!currentData) return [];
    let all = [];
    Object.keys(currentData).forEach(category => {
        if (currentData[category] && currentData[category].flashcards && Array.isArray(currentData[category].flashcards)) {
            currentData[category].flashcards.forEach(card => {
                all.push({
                    ...card,
                    category: category,
                    categoryName: currentData[category].name
                });
            });
        }
    });
    return all;
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function updateFlashcard() {
    const cards = AppState.cards;
    if (!cards.deck || cards.deck.length === 0) {
        const tr = (k, fb) => (typeof t === 'function' ? t(k) : fb);
        document.getElementById('cardCategory').textContent = tr('fc.noCards', 'No Cards');
        document.getElementById('cardQuestion').textContent = tr('fc.noCardsAvailable', 'No flashcards available for this lesson.');
        document.getElementById('cardAnswer').textContent = tr('fc.trySelecting', 'Try selecting a different lesson or category.');
        document.getElementById('cardExplanation').textContent = '';
        return;
    }
    
    const card = cards.deck[cards.index];
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

function saveFlashcardProgress() {
    progress.flashcardsLearned = [...new Set([...progress.flashcardsLearned, ...AppState.cards.known])];
    saveProgress();
}
