// ===== SOKRAT STUDY — CONFIG & GLOBAL STATE =====

// ========== HELPER FUNCTION TO GET DATA ==========
function getSubjectData(subjectId, lessonId) {
    if (subjectId === 'te2') {
        if (lessonId === 'final-test-prep') {
            return typeof te2FinalData !== 'undefined' ? te2FinalData : {};
        }
        return typeof studyData !== 'undefined' ? studyData : {};
    }
    if (subjectId === 'entrepreneurship') {
        return typeof entrepreneurshipData !== 'undefined' ? entrepreneurshipData : {};
    }
    if (subjectId === 'accounting') {
        return typeof accountingData !== 'undefined' ? accountingData : {};
    }
    if (subjectId === 'ebusiness') {
        return typeof ebusinessData !== 'undefined' ? ebusinessData : {};
    }
    if (subjectId === 'econ-hospitality') {
        if (lessonId === 'first-midterm') {
            return typeof economicsHospitalityData !== 'undefined' ? economicsHospitalityData : {};
        }
        return {};
    }
    if (subjectId === 'marketing') {
        if (lessonId === 'first-midterm') {
            return typeof marketingData !== 'undefined' ? marketingData : {};
        }
        return {};
    }
    if (subjectId === 'geography') {
        if (lessonId === 'first-midterm') {
            return typeof geographyData !== 'undefined' ? geographyData : {};
        }
        return {};
    }
    if (subjectId === 'food-nutrition') {
        if (lessonId === 'first-midterm') {
            return typeof foodNutritionData !== 'undefined' ? foodNutritionData : {};
        }
        return {};
    }
    return {};
}

// ========== SUBJECT DATA MAPPING ==========
const subjectDataMap = {
    te2: {
        name: 'Tourism Economics',
        shortName: 'TE',
        icon: 'fa-plane',
        color: '#6366f1',
        description: 'Pricing, TSA, Expenditure, Environment, Sustainability',
        storageKey: 'te2-progress',
        lessons: [
            { id: 'exam-prep', name: 'Exam Preparation', description: 'Complete study material for the exam' },
            { id: 'final-test-prep', name: 'Final Test Preparation', description: 'Comprehensive review for the final examination' }
        ]
    },
    entrepreneurship: {
        name: 'Business Entrepreneurship',
        shortName: 'Entrep',
        icon: 'fa-rocket',
        color: '#8b5cf6',
        description: 'Planning, Innovation, Social Entrepreneurship, Tourism, Final Exam Prep',
        storageKey: 'entrepreneurship-progress',
        lessons: [
            { id: 'second-exam-prep', name: 'Second Exam Preparation', description: 'Core concepts: Planning, Failure, Economy, Social Entrepreneurship, Trends' },
            { id: 'final-exam-prep', name: 'Final Exam Preparation', description: 'Complete review: History, Psychology, Innovation, Franchising, Tourism, Value Measurement' }
        ]
    },
    accounting: {
        name: 'Accounting Theory',
        shortName: 'Accounting',
        icon: 'fa-coins',
        color: '#059669',
        description: 'Cash Control, Budgeting, SEC Reports, Financial Analysis',
        storageKey: 'accounting-progress',
        lessons: [
            { id: 'accounting-fundamentals', name: 'Accounting Fundamentals', description: 'Complete accounting theory for hospitality' }
        ]
    },
    ebusiness: {
        name: 'E-Business',
        shortName: 'E-Biz',
        icon: 'fa-globe',
        color: '#f59e0b',
        description: 'E-Commerce, Distribution Chain, Digital Marketing, SEO, PMS, Security',
        storageKey: 'ebusiness-progress',
        lessons: [
            { id: 'final-exam-prep', name: 'Final Exam Preparation', description: 'Complete E-Business theory covering all 15 units' }
        ]
    },
    'econ-hospitality': {
        name: 'Economics in Hospitality',
        shortName: 'EIH',
        icon: 'fa-hotel',
        color: '#0ea5e9',
        description: 'Economic analysis of Croatian hospitality industry, seasonality, productivity, and policy responses',
        storageKey: 'econ-hospitality-progress',
        lessons: [
            { id: 'first-midterm', name: 'First Midterm', description: 'Seminar-based preparation: macro importance, seasonality, case studies, competitiveness' },
            { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
        ]
    },
    marketing: {
        name: 'Marketing',
        shortName: 'MKT',
        icon: 'fa-bullhorn',
        color: '#ec4899',
        description: 'Marketing concept, environment, market exchange, segmentation, consumer behaviour, and market research',
        storageKey: 'marketing-progress',
        lessons: [
            { id: 'first-midterm', name: 'First Midterm', description: 'Comprehensive preparation from 6 presentations' },
            { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
        ]
    },
    geography: {
        name: 'Tourism Geography',
        shortName: 'Geo',
        icon: 'fa-earth-europe',
        color: '#14b8a6',
        description: 'Croatia tourist geography, blind map drills, protected areas, UNESCO and image-based city recognition',
        storageKey: 'geography-progress',
        lessons: [
            { id: 'first-midterm', name: 'First Midterm', description: 'Blind map + Croatia geography + image questions from lecture materials' },
            { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
        ]
    },
    'food-nutrition': {
        name: 'Food & Nutrition',
        shortName: 'F&N',
        icon: 'fa-utensils',
        color: '#ef4444',
        description: 'Food quality, nutrients, preservation, cereals, fruits & vegetables, coffee/tea/cocoa, wine, beer',
        storageKey: 'food-nutrition-progress',
        lessons: [
            { id: 'first-midterm', name: 'First Midterm', description: '8 lectures: Food Quality, Components, Preservation, Cereals, Fruits & Veg, Coffee/Tea/Cocoa, Wine, Beer' },
            { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
        ]
    }
};

// Defines which categories belong to each lesson
const lessonCategoryMap = {
    'entrepreneurship': {
        'second-exam-prep': ['planning', 'failure', 'economy', 'social', 'trends'],
        'final-exam-prep': null  // null means ALL categories
    }
};

// ========== GLOBAL STATE ==========
let currentPage = 'landing';
let currentSubject = null;
let currentLesson = null;
let currentData = null;
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
let wrongAnswersList = [];
let currentShuffledOptions = [];
let currentShuffledCorrectIndex = 0;
let quizAnswers = []; // stores { selected, shuffledOptions, shuffledCorrectIndex, isCorrect } per question

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
