// ===== TE2 STUDY MASTER - MAIN APPLICATION =====

// ========== GLOBAL STATE ==========
let currentSection = 'home';
let currentCategory = 'all';

// Flashcard state
let flashcards = [];
let currentCardIndex = 0;
let knownCards = [];
let unknownCards = [];

// Quiz state
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizStartTime = null;
let timerInterval = null;
let wrongAnswersList = [];

// Fill state
let fillQuestions = [];
let currentFillIndex = 0;
let fillCorrect = 0;
let fillWrong = 0;

// Progress state
let progress = {
    flashcardsLearned: [],
    quizScores: [],
    fillSolved: 0,
    lastStudy: null,
    streak: 0,
    categoryProgress: {}
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    initNavigation();
    initTheme();
    initFlashcards();
    initFill();
    updateHomeStats();
    renderLearnContent();
    renderProgressPage();
});

// ========== NAVIGATION ==========
function initNavigation() {
    // Desktop navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
            
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Sync mobile nav
            syncMobileNav(section);
        });
    });
    
    // Mobile navigation
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
            
            mobileNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Sync desktop nav
            navBtns.forEach(b => {
                if (b.dataset.section === section) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        });
    });
    
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            currentCategory = category;
            
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            showToast(`Category: ${studyData[category].name}`);
        });
    });
}

// Sync mobile navigation
function syncMobileNav(section) {
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(b => {
        if (b.dataset.section === section) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
}

function switchSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    currentSection = section;
    
    // Scroll to top when switching sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (section === 'flashcards') {
        initFlashcards();
    } else if (section === 'fill') {
        initFill();
    } else if (section === 'progress') {
        renderProgressPage();
    }
}

// ========== THEME ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('te2-theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('te2-theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ========== FLASHCARDS ==========
function initFlashcards() {
    flashcards = getAllFlashcards();
    shuffleArray(flashcards);
    currentCardIndex = 0;
    knownCards = [];
    unknownCards = [];
    
    updateFlashcard();
    updateFlashcardProgress();
    updateFlashcardStats();
    
    // Event listeners
    document.getElementById('flashcard').addEventListener('click', flipCard);
    document.getElementById('btnPrev').addEventListener('click', prevCard);
    document.getElementById('btnNext').addEventListener('click', nextCard);
    document.getElementById('btnCorrect').addEventListener('click', markKnown);
    document.getElementById('btnWrong').addEventListener('click', markUnknown);
}

function getAllFlashcards() {
    let all = [];
    Object.keys(studyData).forEach(category => {
        studyData[category].flashcards.forEach(card => {
            all.push({
                ...card,
                category: category,
                categoryName: studyData[category].name
            });
        });
    });
    return all;
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function updateFlashcard() {
    if (flashcards.length === 0) return;
    
    const card = flashcards[currentCardIndex];
    document.getElementById('cardCategory').textContent = card.categoryName;
    document.getElementById('cardQuestion').textContent = card.question;
    document.getElementById('cardAnswer').textContent = card.answer;
    document.getElementById('cardExplanation').textContent = card.explanation || '';
    
    // Reset flip
    document.getElementById('flashcard').classList.remove('flipped');
}

function updateFlashcardProgress() {
    const progress = `${currentCardIndex + 1} / ${flashcards.length}`;
    document.getElementById('cardProgress').textContent = progress;
    
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
        // Remove from unknown if was there
        const idx = unknownCards.indexOf(currentCardIndex);
        if (idx > -1) unknownCards.splice(idx, 1);
    }
    updateFlashcardStats();
    saveFlashcardProgress();
    nextCard();
}

function markUnknown() {
    if (!unknownCards.includes(currentCardIndex)) {
        unknownCards.push(currentCardIndex);
        // Remove from known if was there
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

// ========== QUIZ ==========
function startQuiz() {
    const count = document.getElementById('questionCount').value;
    const category = document.getElementById('quizCategory').value;
    
    quizQuestions = getQuizQuestions(category, count);
    shuffleArray(quizQuestions);
    
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    wrongAnswersList = [];
    quizStartTime = Date.now();
    
    document.getElementById('quizSetup').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    
    showQuestion();
    startTimer();
}

function getQuizQuestions(category, count) {
    let questions = [];
    
    if (category === 'all') {
        Object.keys(studyData).forEach(cat => {
            studyData[cat].quiz.forEach(q => {
                questions.push({
                    ...q,
                    category: cat,
                    categoryName: studyData[cat].name
                });
            });
        });
    } else {
        studyData[category].quiz.forEach(q => {
            questions.push({
                ...q,
                category: category,
                categoryName: studyData[category].name
            });
        });
    }
    
    if (count !== 'all') {
        questions = questions.slice(0, parseInt(count));
    }
    
    return questions;
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }
    
    const q = quizQuestions[currentQuestionIndex];
    
    document.getElementById('quizProgress').textContent = 
        `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    const percent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${percent}%`;
    
    document.getElementById('questionCategory').textContent = q.categoryName;
    document.getElementById('questionText').textContent = q.question;
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span><span>${option}</span>`;
        btn.addEventListener('click', () => selectAnswer(index, q.correct));
        container.appendChild(btn);
    });
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
}

function selectAnswer(selected, correct) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));
    
    if (selected === correct) {
        buttons[selected].classList.add('correct');
        correctAnswers++;
    } else {
        buttons[selected].classList.add('wrong');
        buttons[correct].classList.add('correct');
        wrongAnswers++;
        
        wrongAnswersList.push({
            question: quizQuestions[currentQuestionIndex].question,
            yourAnswer: quizQuestions[currentQuestionIndex].options[selected],
            correctAnswer: quizQuestions[currentQuestionIndex].options[correct]
        });
    }
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function startTimer() {
    let timeLeft = 30;
    document.getElementById('timeLeft').textContent = timeLeft;
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            // Auto-skip on timeout
            wrongAnswers++;
            wrongAnswersList.push({
                question: quizQuestions[currentQuestionIndex].question,
                yourAnswer: 'Time expired',
                correctAnswer: quizQuestions[currentQuestionIndex].options[quizQuestions[currentQuestionIndex].correct]
            });
            currentQuestionIndex++;
            timeLeft = 30;
            showQuestion();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    // Update results
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('finalCorrect').textContent = correctAnswers;
    document.getElementById('finalWrong').textContent = wrongAnswers;
    document.getElementById('totalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Results icon and message
    let icon, title, message;
    if (score >= 90) {
        icon = '🏆'; title = 'Excellent!'; message = 'Perfect knowledge!';
    } else if (score >= 70) {
        icon = '🎉'; title = 'Great!'; message = 'Very good!';
    } else if (score >= 50) {
        icon = '👍'; title = 'Good!'; message = 'Keep practicing!';
    } else {
        icon = '📚'; title = 'Need more study'; message = 'Review the material and try again!';
    }
    
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;
    
    // Wrong answers review
    const wrongList = document.getElementById('wrongAnswersList');
    wrongList.innerHTML = '';
    
    if (wrongAnswersList.length > 0) {
        document.getElementById('wrongAnswersReview').style.display = 'block';
        wrongAnswersList.forEach(item => {
            const div = document.createElement('div');
            div.className = 'wrong-answer-item';
            div.innerHTML = `
                <p><strong>Question:</strong> ${item.question}</p>
                <p class="your-answer"><strong>Your answer:</strong> ${item.yourAnswer}</p>
                <p class="correct-answer-review"><strong>Correct answer:</strong> ${item.correctAnswer}</p>
            `;
            wrongList.appendChild(div);
        });
    } else {
        document.getElementById('wrongAnswersReview').style.display = 'none';
    }
    
    // Save progress
    progress.quizScores.push(score);
    progress.lastStudy = new Date().toISOString();
    saveProgress();
}

function retryQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    wrongAnswersList = [];
    shuffleArray(quizQuestions);
    quizStartTime = Date.now();
    
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    
    showQuestion();
    startTimer();
}

function showQuizSetup() {
    clearInterval(timerInterval);
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizSetup').classList.remove('hidden');
}

// Global functions for buttons
window.startQuiz = startQuiz;
window.retryQuiz = retryQuiz;
window.showQuizSetup = showQuizSetup;

// ========== FILL IN THE BLANK ==========
function initFill() {
    fillQuestions = getAllFillQuestions();
    shuffleArray(fillQuestions);
    currentFillIndex = 0;
    fillCorrect = 0;
    fillWrong = 0;
    
    showFillQuestion();
    updateFillProgress();
    updateFillStats();
    
    document.getElementById('checkFill').addEventListener('click', checkFillAnswer);
    document.getElementById('fillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkFillAnswer();
    });
    document.getElementById('btnHint').addEventListener('click', showHint);
    document.getElementById('btnSkip').addEventListener('click', skipFill);
    document.getElementById('btnNextFill').addEventListener('click', nextFill);
}

function getAllFillQuestions() {
    let all = [];
    Object.keys(studyData).forEach(category => {
        if (studyData[category].fillBlanks) {
            studyData[category].fillBlanks.forEach(q => {
                all.push({
                    ...q,
                    category: category,
                    categoryName: studyData[category].name
                });
            });
        }
    });
    return all;
}

function showFillQuestion() {
    if (currentFillIndex >= fillQuestions.length) {
        showToast('You completed all Fill-in-the-blank questions!');
        currentFillIndex = 0;
        shuffleArray(fillQuestions);
    }
    
    const q = fillQuestions[currentFillIndex];
    
    document.getElementById('fillCategory').textContent = q.categoryName;
    
    // Replace answer with blank
    const sentenceWithBlank = q.sentence.replace('_______', '<span class="blank">_______</span>');
    document.getElementById('fillSentence').innerHTML = sentenceWithBlank;
    
    // Reset
    document.getElementById('fillInput').value = '';
    document.getElementById('fillInput').disabled = false;
    document.getElementById('checkFill').disabled = false;
    document.getElementById('fillFeedback').classList.add('hidden');
    document.getElementById('fillHint').classList.add('hidden');
    document.getElementById('btnNextFill').classList.add('hidden');
    document.getElementById('btnSkip').classList.remove('hidden');
    document.getElementById('btnHint').classList.remove('hidden');
}

function checkFillAnswer() {
    const input = document.getElementById('fillInput').value.trim().toLowerCase();
    const correct = fillQuestions[currentFillIndex].answer.toLowerCase();
    
    const feedback = document.getElementById('fillFeedback');
    feedback.classList.remove('hidden', 'correct', 'wrong');
    
    if (input === correct || input === correct.replace('-', ' ') || correct.includes(input)) {
        feedback.classList.add('correct');
        document.getElementById('feedbackText').innerHTML = '<i class="fas fa-check-circle"></i> Correct!';
        fillCorrect++;
        progress.fillSolved++;
    } else {
        feedback.classList.add('wrong');
        document.getElementById('feedbackText').innerHTML = '<i class="fas fa-times-circle"></i> Wrong!';
        fillWrong++;
    }
    
    document.getElementById('correctFillAnswer').textContent = fillQuestions[currentFillIndex].answer;
    
    document.getElementById('fillInput').disabled = true;
    document.getElementById('checkFill').disabled = true;
    document.getElementById('btnNextFill').classList.remove('hidden');
    document.getElementById('btnSkip').classList.add('hidden');
    document.getElementById('btnHint').classList.add('hidden');
    
    updateFillStats();
    saveProgress();
}

function showHint() {
    const hint = fillQuestions[currentFillIndex].hint;
    document.getElementById('hintText').textContent = hint;
    document.getElementById('fillHint').classList.remove('hidden');
}

function skipFill() {
    fillWrong++;
    updateFillStats();
    nextFill();
}

function nextFill() {
    currentFillIndex++;
    showFillQuestion();
    updateFillProgress();
}

function updateFillProgress() {
    const progress = `${currentFillIndex + 1} / ${fillQuestions.length}`;
    document.getElementById('fillProgress').textContent = progress;
    
    const percent = ((currentFillIndex + 1) / fillQuestions.length) * 100;
    document.getElementById('fillProgressBar').style.width = `${percent}%`;
}

function updateFillStats() {
    document.getElementById('fillCorrect').textContent = fillCorrect;
    document.getElementById('fillWrong').textContent = fillWrong;
}

// ========== LEARN MODE ==========
function renderLearnContent() {
    const container = document.getElementById('learnContent');
    container.innerHTML = '';
    
    Object.keys(studyData).forEach(category => {
        const data = studyData[category];
        
        const card = document.createElement('div');
        card.className = 'learn-card';
        card.dataset.category = category;
        
        card.innerHTML = `
            <div class="learn-card-header" style="background: linear-gradient(135deg, ${data.color}, ${data.color}dd)">
                <h3><i class="fas ${data.icon}"></i> ${data.name}</h3>
                <span>${data.flashcards.length} terms</span>
            </div>
            <div class="learn-card-content">
                ${data.learn.image ? `<img src="${data.learn.image}" alt="${data.name}" class="learn-image">` : ''}
                ${data.learn.content}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('.learn-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========== PROGRESS PAGE ==========
function renderProgressPage() {
    // Overall progress
    const totalFlashcards = getAllFlashcards().length;
    const learned = progress.flashcardsLearned.length;
    const overallPercent = Math.round((learned / totalFlashcards) * 100) || 0;
    
    document.getElementById('overallPercent').textContent = `${overallPercent}%`;
    document.getElementById('overallProgress').setAttribute('stroke-dasharray', `${overallPercent}, 100`);
    
    // Flashcards
    document.getElementById('flashcardsLearned').textContent = learned;
    document.getElementById('flashcardsTotal').textContent = totalFlashcards;
    document.getElementById('flashcardsProgress').style.width = `${overallPercent}%`;
    
    // Quiz
    const avgScore = progress.quizScores.length > 0 
        ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
        : 0;
    document.getElementById('avgQuizScore').textContent = `${avgScore}%`;
    document.getElementById('totalQuizzes').textContent = progress.quizScores.length;
    
    // Fill
    const totalFills = fillCorrect + fillWrong;
    const fillAcc = totalFills > 0 ? Math.round((fillCorrect / totalFills) * 100) : 0;
    document.getElementById('fillAccuracy').textContent = `${fillAcc}%`;
    document.getElementById('fillSolved').textContent = progress.fillSolved;
    
    // Category bars
    const barsContainer = document.getElementById('categoryBars');
    barsContainer.innerHTML = '';
    
    Object.keys(studyData).forEach(category => {
        const data = studyData[category];
        const catProgress = progress.categoryProgress[category] || 0;
        
        const bar = document.createElement('div');
        bar.className = 'category-bar';
        bar.innerHTML = `
            <i class="fas ${data.icon}" style="color: ${data.color}"></i>
            <div class="category-bar-info">
                <span>
                    <strong>${data.name}</strong>
                    <span>${catProgress}%</span>
                </span>
                <div class="mini-progress">
                    <div class="mini-fill" style="width: ${catProgress}%; background: ${data.color}"></div>
                </div>
            </div>
        `;
        barsContainer.appendChild(bar);
    });
}

// ========== HOME STATS ==========
function updateHomeStats() {
    const totalQ = getAllFlashcards().length + Object.keys(studyData).reduce((acc, cat) => acc + studyData[cat].quiz.length, 0);
    document.getElementById('totalQuestions').textContent = `${totalQ}+`;
    
    const bestScore = progress.quizScores.length > 0 ? Math.max(...progress.quizScores) : 0;
    document.getElementById('bestScore').textContent = `${bestScore}%`;
    
    document.getElementById('streak').textContent = progress.streak;
}

// ========== QUICK START FUNCTIONS ==========
window.startQuickQuiz = function() {
    document.getElementById('questionCount').value = '10';
    document.getElementById('quizCategory').value = 'all';
    switchSection('quiz');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="quiz"]').classList.add('active');
    startQuiz();
};

window.startFlashcards = function() {
    switchSection('flashcards');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="flashcards"]').classList.add('active');
};

window.startLearning = function() {
    switchSection('learn');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="learn"]').classList.add('active');
};

// ========== UTILITIES ==========
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== PROGRESS STORAGE ==========
function loadProgress() {
    const saved = localStorage.getItem('te2-progress');
    if (saved) {
        progress = JSON.parse(saved);
    }
    
    // Check streak
    if (progress.lastStudy) {
        const lastDate = new Date(progress.lastStudy).toDateString();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastDate === yesterday) {
            progress.streak++;
        } else if (lastDate !== today) {
            progress.streak = 0;
        }
    }
}

function saveProgress() {
    progress.lastStudy = new Date().toISOString();
    localStorage.setItem('te2-progress', JSON.stringify(progress));
    updateHomeStats();
}

window.resetProgress = function() {
    if (confirm('Are you sure you want to reset all progress?')) {
        progress = {
            flashcardsLearned: [],
            quizScores: [],
            fillSolved: 0,
            lastStudy: null,
            streak: 0,
            categoryProgress: {}
        };
        saveProgress();
        renderProgressPage();
        showToast('Progress reset!');
    }
};
