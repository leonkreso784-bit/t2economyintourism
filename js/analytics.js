// ===== SOKRAT STUDY — ANALYTICS SYSTEM =====

function loadAnalytics() {
    if (!AppState.nav.subject) return;

    const analyticsKey = subjectDataMap[AppState.nav.subject].storageKey + '-analytics';
    const saved = localStorage.getItem(analyticsKey);
    
    if (saved) {
        analytics = JSON.parse(saved);
    } else {
        analytics = {
            totalStudyTime: 0,
            sessionsCount: 0,
            quizzesTaken: 0,
            quizzesCompleted: 0,
            totalQuestionsAnswered: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            flashcardsReviewed: 0,
            fillExercisesDone: 0,
            categoryStats: {},
            dailyActivity: {},
            averageQuizScore: 0,
            bestQuizScore: 0,
            lastSessionDate: null,
            firstUseDate: new Date().toISOString()
        };
    }
    
    startSession();
}

function saveAnalytics() {
    if (!AppState.nav.subject) return;

    const analyticsKey = subjectDataMap[AppState.nav.subject].storageKey + '-analytics';
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
}

function startSession() {
    AppState.session.startTime = Date.now();
    analytics.sessionsCount++;
    analytics.lastSessionDate = new Date().toISOString();
    
    const today = new Date().toISOString().split('T')[0];
    if (!analytics.dailyActivity[today]) {
        analytics.dailyActivity[today] = {
            studyTime: 0,
            quizzes: 0,
            flashcards: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        };
    }
    
    saveAnalytics();
}

function updateStudyTime() {
    const session = AppState.session;
    if (!session.startTime) return;

    const sessionTime = Math.floor((Date.now() - session.startTime) / 1000);
    const today = new Date().toISOString().split('T')[0];

    if (analytics.dailyActivity[today]) {
        analytics.dailyActivity[today].studyTime += sessionTime;
    }
    analytics.totalStudyTime += sessionTime;

    session.startTime = Date.now();
    saveAnalytics();
}

function trackQuizAnswer(isCorrect, category) {
    analytics.totalQuestionsAnswered++;
    const today = new Date().toISOString().split('T')[0];
    
    if (isCorrect) {
        analytics.correctAnswers++;
        if (analytics.dailyActivity[today]) {
            analytics.dailyActivity[today].correctAnswers++;
        }
    } else {
        analytics.wrongAnswers++;
        if (analytics.dailyActivity[today]) {
            analytics.dailyActivity[today].wrongAnswers++;
        }
    }
    
    if (category) {
        if (!analytics.categoryStats[category]) {
            analytics.categoryStats[category] = {
                questionsAnswered: 0,
                correct: 0,
                wrong: 0
            };
        }
        analytics.categoryStats[category].questionsAnswered++;
        if (isCorrect) {
            analytics.categoryStats[category].correct++;
        } else {
            analytics.categoryStats[category].wrong++;
        }
    }
    
    saveAnalytics();
}

function trackQuizComplete(score, totalQuestions) {
    analytics.quizzesCompleted++;
    const today = new Date().toISOString().split('T')[0];
    
    if (analytics.dailyActivity[today]) {
        analytics.dailyActivity[today].quizzes++;
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    if (percentage > analytics.bestQuizScore) {
        analytics.bestQuizScore = percentage;
    }
    
    const totalScores = progress.quizScores.length;
    if (totalScores > 0) {
        const sum = progress.quizScores.reduce((a, b) => a + b, 0);
        analytics.averageQuizScore = Math.round(sum / totalScores);
    }
    
    saveAnalytics();
}

function trackFlashcardReview() {
    analytics.flashcardsReviewed++;
    const today = new Date().toISOString().split('T')[0];
    
    if (analytics.dailyActivity[today]) {
        analytics.dailyActivity[today].flashcards++;
    }
    
    saveAnalytics();
}

function trackFillExercise() {
    analytics.fillExercisesDone++;
    saveAnalytics();
}

function getAnalyticsSummary() {
    const accuracy = analytics.totalQuestionsAnswered > 0 
        ? Math.round((analytics.correctAnswers / analytics.totalQuestionsAnswered) * 100) 
        : 0;
    
    const studyHours = Math.floor(analytics.totalStudyTime / 3600);
    const studyMinutes = Math.floor((analytics.totalStudyTime % 3600) / 60);
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateStr,
            activity: analytics.dailyActivity[dateStr] || { studyTime: 0, quizzes: 0, flashcards: 0 }
        });
    }
    
    return {
        totalStudyTime: `${studyHours}h ${studyMinutes}m`,
        sessionsCount: analytics.sessionsCount,
        quizzesCompleted: analytics.quizzesCompleted,
        totalQuestionsAnswered: analytics.totalQuestionsAnswered,
        accuracy: accuracy,
        flashcardsReviewed: analytics.flashcardsReviewed,
        bestQuizScore: analytics.bestQuizScore,
        averageQuizScore: analytics.averageQuizScore,
        last7Days: last7Days,
        categoryStats: analytics.categoryStats
    };
}

// Save study time periodically
setInterval(updateStudyTime, 60000);

// Save on page unload
window.addEventListener('beforeunload', () => {
    updateStudyTime();
});

window.resetProgress = async function() {
    const ok = await askConfirm({
        message: window.t ? t('msg.confirmResetProgress') : 'Are you sure you want to reset all progress?',
        danger: true
    });
    if (!ok) return;
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
    showToast(window.t ? t('msg.progressReset') : 'Progress reset!');
};

window.resetAnalytics = async function() {
    const ok = await askConfirm({
        message: window.t ? t('msg.confirmResetAnalytics') : 'Are you sure you want to reset all analytics?',
        danger: true
    });
    if (!ok) return;
    analytics = {
        totalStudyTime: 0,
        sessionsCount: 0,
        quizzesTaken: 0,
        quizzesCompleted: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        flashcardsReviewed: 0,
        fillExercisesDone: 0,
        categoryStats: {},
        dailyActivity: {},
        averageQuizScore: 0,
        bestQuizScore: 0,
        lastSessionDate: null,
        firstUseDate: new Date().toISOString()
    };
    saveAnalytics();
    renderProgressPage();
    showToast(window.t ? t('msg.analyticsReset') : 'Analytics reset!');
};

window.getAnalytics = getAnalyticsSummary;
