// ===== ACCOUNTING — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski + jezični podaci za interaktivne vježbe.
// Engine (js/exercises*.js, css/exercises.css) ne sadrži ništa odavde. Dodavanje vježbi
// za drugi predmet/jezik = nova ovakva datoteka + catalog unos, NULA izmjena enginea.
// Schema i tipovi: docs/EXERCISES_ENGINE.md §2. Brojevi su čisti Number (vidi §3).
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* immutable).
//
// B0.7: skeleton (prazna lista). Sadržaj se autorira u FAZI 3 (po poglavlju, K1 prvo).

const accountingExercises = {
    meta: { lang: 'en', currency: '$', version: 1 },
    exercises: [
        // Primjer omotnice (vidi docs/EXERCISES_ENGINE.md §2):
        // { id:'k1-classify-ch6-1', lesson:'first-midterm', chapter:6, type:'classify',
        //   title:'…', prompt:'…', difficulty:1, solution:[…], /* payload po tipu */ }
    ]
};

if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
