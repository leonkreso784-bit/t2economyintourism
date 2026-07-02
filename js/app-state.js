// ===== SOKRAT STUDY — APP STATE (F2 2C, S3) =====
// JEDAN imenovani namespace za runtime stanje aplikacije (FOUNDATION_PLAN §2C, ADR-014).
//
// Migracija ide GRUPU-PO-GRUPU iz js/config.js: dok grupa NIJE migrirana, autoritativan
// je i dalje njezin top-level `let` u config.js, a ovdje istoimena grupa stoji NEAKTIVNA
// (nitko je ne čita) → nema dvostrukog izvora istine. Kad se grupa migrira, njezini
// `let`-ovi se BRIŠU iz config.js i sva mjesta prelaze na `AppState.<grupa>.<polje>`.
//
// Status grupa (ažuriraj pri svakoj migraciji):
//   nav     ⬜ config.js: currentPage/currentSubject/currentLesson/currentData/currentSection/currentCategory
//   cards   ✅ MIGRIRANO 2026-07-02 (2C.2b) — bilo config.js: flashcards/currentCardIndex/knownCards/unknownCards
//   quiz    ✅ MIGRIRANO 2026-07-02 (2C.2c) — bilo config.js: quizQuestions/currentQuestionIndex/correctAnswers/
//              wrongAnswers/quizStartTime/wrongAnswersList/currentShuffledOptions/currentShuffledCorrectIndex/quizAnswers
//   fill    ✅ MIGRIRANO 2026-07-02 (2C.2a) — bilo config.js: fillQuestions/currentFillIndex/fillCorrect/fillWrong
//   session ✅ MIGRIRANO 2026-07-02 (2C.2e) — bilo config.js: sessionStartTime
//
// `progress` i `analytics` NAMJERNO nisu ovdje — imaju vlastiti persist-lifecycle
// (storage.js / cloud-sync.js serijaliziraju ih u localStorage/Supabase); eventualna
// migracija tek uz zasebnu analizu, NE u sklopu runtime-grupa.

/**
 * @typedef {Object} AppStateNav
 * @property {string} page            Aktivna stranica ('landing'|'browse'|'lessons'|'study'|'profile').
 * @property {string|null} subject    Aktivni subjectId (iz catalog-a).
 * @property {string|null} lesson     Aktivni lessonId.
 * @property {Object<string, any>|null} data  Sadržaj aktivne lekcije (rezultat getSubjectData).
 * @property {string} section         Aktivni study-mod ('home'|'learn'|'flashcards'|'quiz'|'fill'|...).
 * @property {string} category        Aktivni filter kategorije ('all' ili ključ kategorije).
 */

/**
 * @typedef {Object} AppStateCards
 * @property {Array<Object<string, any>>} deck  Trenutni špil flashcarda (nakon filtera/shufflea).
 * @property {number} index                     Indeks trenutne kartice.
 * @property {Array<number>} known              Indeksi kartica označenih kao naučeno.
 * @property {Array<number>} unknown            Indeksi kartica označenih kao nenaučeno.
 */

/**
 * @typedef {Object} AppStateQuiz
 * @property {Array<Object<string, any>>} questions  Pitanja aktivnog kviza.
 * @property {number} index                          Indeks trenutnog pitanja.
 * @property {number} correct                        Broj točnih odgovora.
 * @property {number} wrong                          Broj netočnih odgovora.
 * @property {number|null} startTime                 Početak kviza (Date.now()).
 * @property {Array<Object<string, any>>} wrongList  Krivo odgovorena pitanja (za review).
 * @property {Array<string>} shuffledOptions         Opcije trenutnog pitanja nakon shufflea.
 * @property {number} shuffledCorrectIndex           Indeks točnog odgovora u shuffled opcijama.
 * @property {Array<Object<string, any>>} answers    Po pitanju: { selected, isCorrect } (sparse — indeks = pitanje).
 */

/**
 * @typedef {Object} AppStateFill
 * @property {Array<Object<string, any>>} questions  Pitanja aktivne fill-in vježbe.
 * @property {number} index                          Indeks trenutnog pitanja.
 * @property {number} correct                        Broj točnih odgovora.
 * @property {number} wrong                          Broj netočnih odgovora.
 */

/**
 * @typedef {Object} AppStateSession
 * @property {number|null} startTime  Početak sesije (Date.now()); koristi analytics.js.
 */

/**
 * @typedef {Object} AppStateRoot
 * @property {AppStateNav} nav
 * @property {AppStateCards} cards
 * @property {AppStateQuiz} quiz
 * @property {AppStateFill} fill
 * @property {AppStateSession} session
 */

(function () {
    'use strict';

    /** @type {AppStateRoot} */
    const AppState = {
        nav: {
            page: 'landing',
            subject: null,
            lesson: null,
            data: null,
            section: 'home',
            category: 'all'
        },
        cards: {
            deck: [],
            index: 0,
            known: [],
            unknown: []
        },
        quiz: {
            questions: [],
            index: 0,
            correct: 0,
            wrong: 0,
            startTime: null,
            wrongList: [],
            shuffledOptions: [],
            shuffledCorrectIndex: 0,
            answers: []
        },
        fill: {
            questions: [],
            index: 0,
            correct: 0,
            wrong: 0
        },
        session: {
            startTime: null
        }
    };

    window.AppState = AppState;
})();
