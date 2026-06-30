// ===== SOKRAT STUDY — ContentRepository (S1) =====
//
// JEDAN čist sloj za "dohvati sadržaj", neovisan o izvoru (datoteka / Supabase / kasnije CRUD).
// Danas je dohvaćanje razbacano na 3 mjesta:
//   1) SokratCatalog.getSubject(id)        — metapodaci (data/catalog.js)
//   2) loadSubjectContent(id)              — async učita window-varove (js/content-loader.js)
//   3) getSubjectData(id, lessonId)        — pročita window-var u podatkovni objekt (js/config.js)
// Potrošači (npr. navigation.js) ručno slažu (await load → resolve). Ovaj Repo to objedini.
//
// ⚠ FAZA 2 / ADR-013: ovo je ŠAV na koji se kasnije vežu Service Worker (F3), Admin CRUD (F4)
//   i AI tutor. Svi pozivi sadržaja idu kroz Repo → izvor (datoteke/baza) postaje detalj implementacije.
//
// 2B.1 (ova cigla): TANKI omotač oko POSTOJEĆIH funkcija. NULA promjena ponašanja —
//   `loadLesson()` interno radi točno isto što navigation.js radi danas. Izvorni file↔DB
//   fallback već živi UNUTAR loadSubjectContent() (BLOK B), pa je "FileRepo + SupabaseRepo iza
//   istog sučelja" (2B.2) već zadovoljeno — Repo ga samo izlaže na jednom mjestu.

(function () {
    'use strict';

    // Sigurni pristup ambient-globalima (učitani prije ovog modula u index.html).
    function _catalog() { return (typeof SokratCatalog !== 'undefined') ? SokratCatalog : null; }

    const ContentRepository = {
        // ── Metapodaci (sinkrono, iz catalog-a) ─────────────────────────────
        /** Svi predmeti (metapodaci). @returns {Array<object>} */
        listSubjects() {
            const c = _catalog();
            return c ? c.all() : [];
        },

        /** Metapodaci jednog predmeta. @param {string} id @returns {object|null} */
        getSubject(id) {
            const c = _catalog();
            return c ? c.getSubject(id) : null;
        },

        /** Je li lekcija "coming soon" (nema mapiranja sadržaja)? @param {string} id @param {string} lessonId @returns {boolean} */
        isLessonComingSoon(id, lessonId) {
            const c = _catalog();
            return c ? c.isLessonComingSoon(id, lessonId) : true;
        },

        // ── Sadržaj (async učitavanje + resolve, objedinjeno) ────────────────
        /**
         * Učitaj sadržaj predmeta (ako već nije) i vrati podatkovni objekt za (predmet, lekcija).
         * Objedinjuje `loadSubjectContent` + `getSubjectData` u jedan poziv.
         * @param {string} subjectId
         * @param {string} lessonId
         * @returns {Promise<object>} podatkovni objekt lekcije ({} ako nema sadržaja)
         */
        loadLesson(subjectId, lessonId) {
            const load = (typeof loadSubjectContent === 'function')
                ? loadSubjectContent(subjectId)
                : Promise.resolve();
            return load.then(function () {
                return (typeof getSubjectData === 'function')
                    ? getSubjectData(subjectId, lessonId)
                    : {};
            });
        },

        /** Je li sadržaj predmeta već učitan? @param {string} subjectId @returns {boolean} */
        isLoaded(subjectId) {
            return (typeof isSubjectContentLoaded === 'function')
                ? isSubjectContentLoaded(subjectId)
                : false;
        }
    };

    // Globalno dostupno (konzistentno s SokratCatalog / SokratAuth).
    if (typeof window !== 'undefined') {
        window.SokratContent = ContentRepository;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ContentRepository };
    }
})();
