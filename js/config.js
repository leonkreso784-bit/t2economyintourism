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

// ========== TRENUTNI SUBJEKT — JEDNO MJESTO ISTINE (BUG-023) ==========
// Prije ovoga je PET mjesta pisalo `subjectDataMap[AppState.nav.subject].storageKey`
// uz guard `if (!AppState.nav.subject) return;`. Taj guard provjerava POSTOJI LI ID,
// a ne postoji li subjekt u mapi — a to je razlika koja godinu dana nije značila ništa,
// jer je svaki subjekt dolazio iz kataloga i bio u mapi od učitavanja skripte.
//
// Osobni materijali (M2) su to slomili: oni su SINTETIČKI subjekti (`node:<uuid>`) koje
// `SokratMaterials` upiše u mapu tek kad se otvori profil — asinkrono, uz prijavu i mrežu.
// `restoreLastPosition` čita zadnju poziciju sinkrono, pa je moguće imati `nav.subject`
// koji NIJE u mapi → `.storageKey` na `undefined` → TypeError (BUG-023).
//
// Zato: jedno mjesto odgovara na „koji je subjekt otvoren i kamo mu se piše".
// Vraća `null` umjesto da baci — pozivatelj tad ne radi ništa, što je za pomoćnu
// funkciju za spremanje jedino ispravno ponašanje.
function currentSubjectMeta() {
    const id = (typeof AppState !== 'undefined' && AppState.nav) ? AppState.nav.subject : null;
    if (!id || typeof subjectDataMap === 'undefined') return null;
    return subjectDataMap[id] || null;
}

/** Ključ pod kojim se čuva napredak trenutnog subjekta; `null` = nema kamo pisati. */
function currentStorageKey() {
    const meta = currentSubjectMeta();
    return (meta && meta.storageKey) ? meta.storageKey : null;
}


// ========== GLOBAL STATE ==========
// Nav state → MIGRIRANO u AppState.nav (js/app-state.js, F2 2C.2d)

// Flashcard state → MIGRIRANO u AppState.cards (js/app-state.js, F2 2C.2b)

// Quiz state → MIGRIRANO u AppState.quiz (js/app-state.js, F2 2C.2c)

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

// Session state → MIGRIRANO u AppState.session (js/app-state.js, F2 2C.2e)
