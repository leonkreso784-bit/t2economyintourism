// ===== SOKRAT STUDY — FLASHCARDS =====

let flashcardListenersInitialized = false;

function initFlashcards() {
    flashcards = getAllFlashcards();
    shuffleArray(flashcards);
    currentCardIndex = 0;
    knownCards = [];
    unknownCards = [];
    
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
    if (!flashcards || flashcards.length === 0) {
        const tr = (k, fb) => (typeof t === 'function' ? t(k) : fb);
        document.getElementById('cardCategory').textContent = tr('fc.noCards', 'No Cards');
        document.getElementById('cardQuestion').textContent = tr('fc.noCardsAvailable', 'No flashcards available for this lesson.');
        document.getElementById('cardAnswer').textContent = tr('fc.trySelecting', 'Try selecting a different lesson or category.');
        document.getElementById('cardExplanation').textContent = '';
        return;
    }
    
    const card = flashcards[currentCardIndex];
    document.getElementById('cardCategory').textContent = card.categoryName;
    document.getElementById('cardQuestion').textContent = card.question;
    document.getElementById('cardAnswer').textContent = card.answer;
    document.getElementById('cardExplanation').textContent = card.explanation || '';

    document.getElementById('flashcard').classList.remove('flipped');

    // ADR-009: render LaTeX in question/answer/explanation (KaTeX walks the text nodes).
    if (typeof renderMath === 'function') renderMath(document.getElementById('flashcard'));
}

function updateFlashcardProgress() {
    if (!flashcards || flashcards.length === 0) {
        document.getElementById('cardProgress').textContent = '0 / 0';
        document.getElementById('cardProgressBar').style.width = '0%';
        return;
    }
    
    const prog = `${currentCardIndex + 1} / ${flashcards.length}`;
    document.getElementById('cardProgress').textContent = prog;
    
    const percent = ((currentCardIndex + 1) / flashcards.length) * 100;
    document.getElementById('cardProgressBar').style.width = `${percent}%`;
}

function updateFlashcardStats() {
    document.getElementById('knownCount').textContent = knownCards.length;
    document.getElementById('unknownCount').textContent = unknownCards.length;
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function markKnown() {
    if (!knownCards.includes(currentCardIndex)) {
        knownCards.push(currentCardIndex);
        const idx = unknownCards.indexOf(currentCardIndex);
        if (idx > -1) unknownCards.splice(idx, 1);
    }
    updateFlashcardStats();
    saveFlashcardProgress();
    trackFlashcardReview();
    nextCard();
}

function markUnknown() {
    if (!unknownCards.includes(currentCardIndex)) {
        unknownCards.push(currentCardIndex);
        const idx = knownCards.indexOf(currentCardIndex);
        if (idx > -1) knownCards.splice(idx, 1);
    }
    updateFlashcardStats();
    nextCard();
}

function saveFlashcardProgress() {
    progress.flashcardsLearned = [...new Set([...progress.flashcardsLearned, ...knownCards])];
    saveProgress();
}
