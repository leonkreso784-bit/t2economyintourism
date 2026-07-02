// ===== SOKRAT STUDY — CONFIG & GLOBAL STATE =====

// ========== HELPER FUNCTION TO GET DATA ==========
// Resolves the data object for a (subject, lesson) using the catalog as the
// single source of truth (data/catalog.js). Each data-*.js file exposes its
// object on `window`, so we look it up by the name from catalog.content.resolve.
function getSubjectData(subjectId, lessonId) {
    const varName = (typeof SokratCatalog !== 'undefined')
        ? SokratCatalog.resolveDataVar(subjectId, lessonId)
        : null;
    if (varName && typeof window !== 'undefined' && typeof window[varName] !== 'undefined') {
        return window[varName];
    }
    return {};
}

// ========== SUBJECT DATA MAPPING (derived from catalog) ==========
// Flat id -> metadata map kept for backward compatibility with the rest of the
// app (navigation.js, storage.js). Single source of truth: data/catalog.js.
const subjectDataMap = (function buildSubjectDataMap() {
    const map = {};
    const subjects = (typeof SOKRAT_CATALOG !== 'undefined' && Array.isArray(SOKRAT_CATALOG.subjects))
        ? SOKRAT_CATALOG.subjects
        : [];
    subjects.forEach(function (s) {
        map[s.id] = {
            name: s.name,
            shortName: s.shortName,
            icon: s.icon,
            color: s.color,
            description: s.description,
            storageKey: s.storageKey,
            lessons: s.lessons || []
        };
    });
    return map;
})();

// Defines which categories belong to each lesson
// Opcionalni filter kategorija po lekciji: lessonCategoryMap[subjectId][lessonId] = [dozvoljeni ključevi] | null(=sve).
// Koristi ga navigation.js (loadStudyPage). Trenutno prazno — raniji 'entrepreneurship' unos koristio je STARE
// ID-eve lekcija (second-exam-prep/final-exam-prep) koji više ne postoje (predmet je na first/second-midterm/final).
// Mehanizam ostaje dostupan za buduće predmete; nedostajeći subjekt → puni sadržaj lekcije (else grana).
const lessonCategoryMap = {};

// ========== GLOBAL STATE ==========
let currentPage = 'landing';
let currentSubject = null;
let currentLesson = null;
let currentData = null;
let currentSection = 'home';
let currentCategory = 'all';

// Flashcard state → MIGRIRANO u AppState.cards (js/app-state.js, F2 2C.2b)

// Quiz state
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizStartTime = null;
let wrongAnswersList = [];
let currentShuffledOptions = [];
let currentShuffledCorrectIndex = 0;
let quizAnswers = []; // stores { selected, shuffledOptions, shuffledCorrectIndex, isCorrect } per question

// Fill state → MIGRIRANO u AppState.fill (js/app-state.js, F2 2C.2a)

// Progress state
let progress = {
    flashcardsLearned: [],
    quizScores: [],
    fillSolved: 0,
    lastStudy: null,
    streak: 0,
    categoryProgress: {}
};

// Analytics state
let analytics = {
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
    firstUseDate: null
};

let sessionStartTime = null;
