// ===== STATISTICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski podaci za interaktivne, auto-ocjenjive vježbe
// statistike. Generički engine (js/exercises-core.js, js/exercises.js, css/exercises.css)
// ne sadrži NIŠTA odavde — vidi docs/EXERCISES_ENGINE.md §2 (schema/tipovi) + §3 (konvencije)
// i docs/STATISTICS_PLAN.md (cigla-po-cigla plan, TRACK B).
//
// Tipovi koje koristi statistika: numeric / choice / ratio (NE journal/classify/statement).
// Matematika za rješenja (normalCdf, z/t tablice) doći će u data/statistics/stat-lib.js
// (B1) i učitavat će se PRIJE ove datoteke. Elementarna aritmetika ide inline u solve().
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* je immutable).
//
// B0 (žica): SKELETON — prazna lista. Tab "Exercises" se pojavi (prazno stanje); sadržaj
//            se autorira po temi u FAZI B2 (T1–T9). meta.currency='' (statistika nije novac).

const statisticsExercises = {
  meta: { lang: 'en', currency: '', version: 1 },
  exercises: [
    // Omotnica vježbe (vidi docs/EXERCISES_ENGINE.md §2). Primjer (numeric, randomiziran):
    // { id:'t2-numeric-sd-1', lesson:'first-midterm', chapter:2, type:'numeric',
    //   title:'…', prompt:'…', difficulty:1, fields:[{key,label,answer,tol,unit,hint}],
    //   params:{…}, generate(p){…}, solve(p){…} }
  ]
};

if (typeof window !== 'undefined') window.statisticsExercises = statisticsExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = statisticsExercises;
