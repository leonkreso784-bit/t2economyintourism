// ===== SOKRAT STUDY — FILL IN THE BLANK =====

let fillListenersInitialized = false;

function initFill() {
    const fill = AppState.fill;
    fill.questions = getAllFillQuestions();
    shuffleArray(fill.questions);
    fill.index = 0;
    fill.correct = 0;
    fill.wrong = 0;
    
    showFillQuestion();
    updateFillProgress();
    updateFillStats();
    
    // Only add event listeners once to prevent duplicates
    if (!fillListenersInitialized) {
        document.getElementById('checkFill').addEventListener('click', checkFillAnswer);
        document.getElementById('fillInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkFillAnswer();
        });
        document.getElementById('btnHint').addEventListener('click', showHint);
        document.getElementById('btnSkip').addEventListener('click', skipFill);
        document.getElementById('btnNextFill').addEventListener('click', nextFill);
        fillListenersInitialized = true;
    }
}

function getAllFillQuestions() {
    const content = AppState.nav.data;
    if (!content) return [];
    let all = [];
    getCategories(content).forEach(category => {
        if (content[category].fillBlanks) {
            content[category].fillBlanks.forEach(q => {
                all.push({
                    ...q,
                    category: category,
                    categoryName: content[category].name
                });
            });
        }
    });
    return all;
}

function showFillQuestion() {
    const fill = AppState.fill;
    if (!fill.questions || fill.questions.length === 0) {
        document.getElementById('fillSentence').innerHTML = '<p style="color: var(--text-muted);">No fill-in-the-blank questions available for this lesson.</p>';
        document.getElementById('fillInput').disabled = true;
        document.getElementById('checkFill').disabled = true;
        return;
    }

    if (fill.index >= fill.questions.length) {
        showToast(typeof t === 'function' ? t('fill.completed') : 'You completed all Fill-in-the-blank questions!');
        fill.index = 0;
        shuffleArray(fill.questions);
    }

    const q = fill.questions[fill.index];
    
    document.getElementById('fillCategory').textContent = q.categoryName;
    
    const sentenceWithBlank = q.sentence.replace('_______', '<span class="blank">_______</span>');
    document.getElementById('fillSentence').innerHTML = sentenceWithBlank;

    // ADR-009: render LaTeX in the sentence (a formula with a blank renders around it).
    if (typeof renderMath === 'function') renderMath(document.getElementById('fillSentence'));

    document.getElementById('fillInput').value = '';
    document.getElementById('fillInput').disabled = false;
    document.getElementById('checkFill').disabled = false;
    document.getElementById('fillFeedback').classList.add('hidden');
    document.getElementById('fillHint').classList.add('hidden');
    document.getElementById('btnNextFill').classList.add('hidden');
    document.getElementById('btnSkip').classList.remove('hidden');
    document.getElementById('btnHint').classList.remove('hidden');
}

// Crtica ↔ razmak su ekvivalentni; višestruki razmaci kolabiraju (npr. "long-term" == "long term").
function normFill(s) { return String(s).trim().toLowerCase().replace(/[-\s]+/g, ' ').trim(); }

function checkFillAnswer() {
    const fill = AppState.fill;
    const input = document.getElementById('fillInput').value.trim().toLowerCase();
    const correct = fill.questions[fill.index].answer.toLowerCase();

    const feedback = document.getElementById('fillFeedback');
    feedback.classList.remove('hidden', 'correct', 'wrong');

    // BUG-014: prazan unos NIKAD nije točan. (Stari `correct.includes(input)` je za input="" uvijek
    // bio true — svaki string sadrži prazan string — pa je prazno + Provjeri ispadalo „Correct!".
    // Taj substring-uvjet je i inače prelabav (jedno slovo prolazi) → zamijenjen pravim podudaranjem.)
    const isCorrect = input.length > 0 && normFill(input) === normFill(correct);

    const tr = (k, fb) => (typeof t === 'function' ? t(k) : fb);
    if (isCorrect) {
        feedback.classList.add('correct');
        document.getElementById('feedbackText').innerHTML = '<i class="fas fa-check-circle"></i> ' + tr('fill.correct', 'Correct!');
        fill.correct++;
        progress.fillSolved++;
        trackFillExercise();
    } else {
        feedback.classList.add('wrong');
        document.getElementById('feedbackText').innerHTML = '<i class="fas fa-times-circle"></i> ' + tr('fill.wrong', 'Wrong!');
        fill.wrong++;
    }

    document.getElementById('correctFillAnswer').textContent = fill.questions[fill.index].answer;

    // ADR-009: render LaTeX in the revealed correct answer (if it is a formula).
    if (typeof renderMath === 'function') renderMath(document.getElementById('fillFeedback'));

    document.getElementById('fillInput').disabled = true;
    document.getElementById('checkFill').disabled = true;
    document.getElementById('btnNextFill').classList.remove('hidden');
    document.getElementById('btnSkip').classList.add('hidden');
    document.getElementById('btnHint').classList.add('hidden');
    
    updateFillStats();
    saveProgress();
}

function showHint() {
    const fill = AppState.fill;
    const hint = fill.questions[fill.index].hint;
    document.getElementById('hintText').textContent = hint;
    document.getElementById('fillHint').classList.remove('hidden');
}

function skipFill() {
    AppState.fill.wrong++;
    updateFillStats();
    nextFill();
}

function nextFill() {
    AppState.fill.index++;
    showFillQuestion();
    updateFillProgress();
}

function updateFillProgress() {
    const fill = AppState.fill;
    const prog = `${fill.index + 1} / ${fill.questions.length}`;
    document.getElementById('fillProgress').textContent = prog;

    const percent = ((fill.index + 1) / fill.questions.length) * 100;
    document.getElementById('fillProgressBar').style.width = `${percent}%`;
}

function updateFillStats() {
    // 'fillCorrect'/'fillWrong' OVDJE su DOM id-jevi (index.html), ne stare varijable.
    document.getElementById('fillCorrect').textContent = AppState.fill.correct;
    document.getElementById('fillWrong').textContent = AppState.fill.wrong;
}
