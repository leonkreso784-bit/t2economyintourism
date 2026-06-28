// ===== SOKRAT STUDY — QUIZ =====

function startQuiz() {
    const count = document.getElementById('questionCount').value;
    const category = document.getElementById('quizCategory').value;
    
    quizQuestions = getQuizQuestions(category, count);
    shuffleArray(quizQuestions);
    
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    wrongAnswersList = [];
    quizAnswers = [];
    quizStartTime = Date.now();
    
    // Pre-shuffle options for every question so they stay stable when revisiting
    quizQuestions.forEach(q => {
        const opts = q.options.map((option, index) => ({
            text: option,
            originalIndex: index
        }));
        shuffleArray(opts);
        q._shuffledOptions = opts;
        q._shuffledCorrectIndex = opts.findIndex(o => o.originalIndex === q.correct);
    });
    
    document.getElementById('quizSetup').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    
    showQuestion();
}

function getQuizQuestions(category, count) {
    if (!currentData) return [];
    let questions = [];
    
    if (category === 'all') {
        Object.keys(currentData).forEach(cat => {
            if (currentData[cat] && currentData[cat].quiz && Array.isArray(currentData[cat].quiz)) {
                currentData[cat].quiz.forEach(q => {
                    questions.push({
                        ...q,
                        category: cat,
                        categoryName: currentData[cat].name
                    });
                });
            }
        });
    } else {
        if (currentData[category] && currentData[category].quiz && Array.isArray(currentData[category].quiz)) {
            currentData[category].quiz.forEach(q => {
                questions.push({
                    ...q,
                    category: category,
                    categoryName: currentData[category].name
                });
            });
        }
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
    const answered = quizAnswers[currentQuestionIndex];
    
    document.getElementById('quizProgress').textContent =
        `${(typeof t === 'function' ? t('quiz.question') : 'Question')} ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    const percent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${percent}%`;
    
    document.getElementById('questionCategory').textContent = q.categoryName;
    document.getElementById('questionText').textContent = q.question;

    const existingImage = document.getElementById('questionImage');
    if (existingImage) existingImage.remove();

    if (q.image) {
        const img = document.createElement('img');
        img.id = 'questionImage';
        img.className = 'quiz-question-image';
        img.src = q.image;
        img.alt = q.imageAlt || 'Quiz question image';
        img.loading = 'lazy';
        document.getElementById('questionText').insertAdjacentElement('afterend', img);
    }
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    // Use pre-shuffled options
    const optionsWithIndex = q._shuffledOptions;
    currentShuffledOptions = optionsWithIndex;
    currentShuffledCorrectIndex = q._shuffledCorrectIndex;
    
    const letters = ['A', 'B', 'C', 'D'];
    optionsWithIndex.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span><span>${option.text}</span>`;
        
        if (answered) {
            // Reviewing a previously answered question
            btn.classList.add('disabled');
            if (index === q._shuffledCorrectIndex) {
                btn.classList.add('correct');
            }
            if (index === answered.selected && !answered.isCorrect) {
                btn.classList.add('wrong');
            }
        } else {
            btn.addEventListener('click', () => selectAnswer(index));
        }
        container.appendChild(btn);
    });
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    
    // Update nav buttons
    updateQuizNavButtons();

    // ADR-009: render LaTeX in the question text and answer options.
    if (typeof renderMath === 'function') renderMath(document.getElementById('quizGame'));
}

function updateQuizNavButtons() {
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    if (!prevBtn || !nextBtn) return;
    
    // Show prev if not on first question
    prevBtn.style.display = currentQuestionIndex > 0 ? '' : 'none';
    
    // Show next only if current question is answered and there are more questions
    const answered = quizAnswers[currentQuestionIndex];
    if (answered && currentQuestionIndex < quizQuestions.length - 1) {
        nextBtn.style.display = '';
    } else {
        nextBtn.style.display = 'none';
    }
}

function quizPrev() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function quizNext() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function selectAnswer(selected) {
    // Prevent double-answering
    if (quizAnswers[currentQuestionIndex]) return;
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));
    
    const isCorrect = selected === currentShuffledCorrectIndex;
    
    if (isCorrect) {
        buttons[selected].classList.add('correct');
        correctAnswers++;
    } else {
        buttons[selected].classList.add('wrong');
        buttons[currentShuffledCorrectIndex].classList.add('correct');
        wrongAnswers++;
        
        wrongAnswersList.push({
            question: quizQuestions[currentQuestionIndex].question,
            yourAnswer: currentShuffledOptions[selected].text,
            correctAnswer: currentShuffledOptions[currentShuffledCorrectIndex].text
        });
    }
    
    // Store answer
    quizAnswers[currentQuestionIndex] = {
        selected: selected,
        isCorrect: isCorrect
    };
    
    trackQuizAnswer(isCorrect, quizQuestions[currentQuestionIndex].category || 'general');
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    
    // Auto-advance after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function endQuiz() {
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('finalCorrect').textContent = correctAnswers;
    document.getElementById('finalWrong').textContent = wrongAnswers;
    document.getElementById('totalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const tr = (k, fb) => (typeof t === 'function' ? t(k) : fb);
    let icon, title, message;
    if (score >= 90) {
        icon = '🏆'; title = tr('quiz.res.perfect.t', 'Excellent!'); message = tr('quiz.res.perfect.m', 'Perfect knowledge!');
    } else if (score >= 70) {
        icon = '🎉'; title = tr('quiz.res.great.t', 'Great!'); message = tr('quiz.res.great.m', 'Very good!');
    } else if (score >= 50) {
        icon = '👍'; title = tr('quiz.res.good.t', 'Good!'); message = tr('quiz.res.good.m', 'Keep practicing!');
    } else {
        icon = '📚'; title = tr('quiz.res.ok.t', 'Need more study'); message = tr('quiz.res.ok.m', 'Review the material and try again!');
    }
    
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;
    
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

    // ADR-009: render LaTeX in the wrong-answers review.
    if (typeof renderMath === 'function') renderMath(document.getElementById('quizResults'));

    progress.quizScores.push(score);
    progress.lastStudy = new Date().toISOString();
    saveProgress();
    
    trackQuizComplete(correctAnswers, quizQuestions.length);
}

function retryQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    wrongAnswersList = [];
    quizAnswers = [];
    shuffleArray(quizQuestions);
    quizStartTime = Date.now();
    
    // Re-shuffle options for each question
    quizQuestions.forEach(q => {
        const opts = q.options.map((option, index) => ({
            text: option,
            originalIndex: index
        }));
        shuffleArray(opts);
        q._shuffledOptions = opts;
        q._shuffledCorrectIndex = opts.findIndex(o => o.originalIndex === q.correct);
    });
    
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    
    showQuestion();
}

function showQuizSetup() {
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizSetup').classList.remove('hidden');
}

window.startQuiz = startQuiz;
window.retryQuiz = retryQuiz;
window.showQuizSetup = showQuizSetup;
window.quizPrev = quizPrev;
window.quizNext = quizNext;
