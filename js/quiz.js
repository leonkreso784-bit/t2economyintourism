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
    quizStartTime = Date.now();
    
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
    
    document.getElementById('quizProgress').textContent = 
        `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    const percent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${percent}%`;
    
    document.getElementById('questionCategory').textContent = q.categoryName;
    document.getElementById('questionText').textContent = q.question;

    const existingImage = document.getElementById('questionImage');
    if (existingImage) {
        existingImage.remove();
    }

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
    
    // Shuffle answer options
    const optionsWithIndex = q.options.map((option, index) => ({
        text: option,
        originalIndex: index
    }));
    shuffleArray(optionsWithIndex);
    
    currentShuffledOptions = optionsWithIndex;
    currentShuffledCorrectIndex = optionsWithIndex.findIndex(opt => opt.originalIndex === q.correct);
    
    const letters = ['A', 'B', 'C', 'D'];
    optionsWithIndex.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span><span>${option.text}</span>`;
        btn.addEventListener('click', () => selectAnswer(index));
        container.appendChild(btn);
    });
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
}

function selectAnswer(selected) {
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
    
    trackQuizAnswer(isCorrect, quizQuestions[currentQuestionIndex].category || 'general');
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    
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
    shuffleArray(quizQuestions);
    quizStartTime = Date.now();
    
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
