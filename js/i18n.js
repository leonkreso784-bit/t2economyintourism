// ===== Sokrat Study — UI i18n (HRV program; vidi docs/HRV_PLAN.md, Cigla 5) =====
// Lagani rječnik SUČELJA (NE sadržaja — sadržaj je već jednojezičan po datoteci/programu).
// Jezik se bira po AKTIVNOM PROGRAMU: predmet iz "hospitality-management-hr" → 'hr', inače 'en'.
//
// Korištenje:
//   - statički HTML: <span data-i18n="nav.flashcards">Flashcards</span>  → applyTranslations() postavi tekst
//   - iz JS-a: t('quiz.correct')  → vrati string na trenutnom jeziku (fallback en → ključ)
//   - prebacivanje: setUiLang('hr'|'en') ili setUiLangForSubject(subjectId)
//
// Engine sadržaja se NE dira. Default je 'en' → EN iskustvo nepromijenjeno.

(function () {
  'use strict';

  // ---- Rječnik (en je izvor; hr je prijevod). Ključevi su točkasti za grupiranje. ----
  const DICT = {
    // Study navigacija (tabovi) + home kartice
    'nav.home': { en: 'Home', hr: 'Početna' },
    'nav.learn': { en: 'Learn', hr: 'Učenje' },
    'nav.flashcards': { en: 'Flashcards', hr: 'Kartice' },
    'nav.cards': { en: 'Cards', hr: 'Kartice' },
    'nav.quiz': { en: 'Quiz', hr: 'Kviz' },
    'nav.fill': { en: 'Fill', hr: 'Dopuni' },
    'nav.progress': { en: 'Progress', hr: 'Napredak' },
    'nav.map': { en: 'Map', hr: 'Karta' },
    'nav.exercises': { en: 'Exercises', hr: 'Vježbe' },

    // Flashcards kontrole
    'fc.flip': { en: 'Flip', hr: 'Okreni' },
    'fc.known': { en: 'I knew it', hr: 'Znao sam' },
    'fc.unknown': { en: "Didn't know", hr: 'Nisam znao' },
    'fc.known.count': { en: 'Known', hr: 'Znam' },
    'fc.unknown.count': { en: 'Unknown', hr: 'Ne znam' },

    // Quiz / Fill kontrole
    'common.previous': { en: 'Previous', hr: 'Prethodno' },
    'common.next': { en: 'Next', hr: 'Dalje' },
    'common.check': { en: 'Check', hr: 'Provjeri' },
    'common.submit': { en: 'Submit', hr: 'Predaj' },
    'common.restart': { en: 'Restart', hr: 'Ponovi' },
    'common.showHint': { en: 'Show hint', hr: 'Prikaži pomoć' },
    'quiz.correct': { en: 'Correct!', hr: 'Točno!' },
    'quiz.incorrect': { en: 'Incorrect', hr: 'Netočno' },
    'quiz.score': { en: 'Score', hr: 'Rezultat' },
    'fill.correct': { en: 'Correct!', hr: 'Točno!' },
    'fill.incorrect': { en: 'Incorrect', hr: 'Netočno' },
    'fill.answerWas': { en: 'Correct answer', hr: 'Točan odgovor' }
  };

  let uiLang = 'en';
  const HR_PROGRAM = 'hospitality-management-hr';

  function t(key) {
    const e = DICT[key];
    if (!e) return key;                       // nepoznat ključ → vrati ključ (vidljivo u dev-u)
    return e[uiLang] != null ? e[uiLang] : (e.en != null ? e.en : key);
  }

  // Postavi tekst svih [data-i18n] elemenata unutar root-a (default: cijeli dokument).
  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
  }

  function setUiLang(lang) {
    const next = lang === 'hr' ? 'hr' : 'en';
    if (next === uiLang) return;
    uiLang = next;
    document.documentElement.setAttribute('lang', uiLang);
    applyTranslations();
  }

  // Jezik prema aktivnom programu predmeta (HR program → 'hr').
  function setUiLangForSubject(subjectId) {
    let lang = 'en';
    if (subjectId && typeof SokratCatalog !== 'undefined') {
      const s = SokratCatalog.getSubject(subjectId);
      if (s && s.programId === HR_PROGRAM) lang = 'hr';
    }
    setUiLang(lang);
  }

  // Globalno
  window.t = t;
  window.applyTranslations = applyTranslations;
  window.setUiLang = setUiLang;
  window.setUiLangForSubject = setUiLangForSubject;
  window.getUiLang = function () { return uiLang; };
})();
