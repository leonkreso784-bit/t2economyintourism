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

    // Home tab
    'home.welcome': { en: '🎓 Welcome to Sokrat Study', hr: '🎓 Dobrodošli u Sokrat Study' },
    'home.subtitle': { en: 'Your interactive study guide', hr: 'Tvoj interaktivni vodič za učenje' },
    'home.guideTo': { en: 'Your interactive guide to', hr: 'Tvoj interaktivni vodič za' },
    'home.stat.questions': { en: 'Questions', hr: 'Pitanja' },
    'home.stat.categories': { en: 'Categories', hr: 'Kategorija' },
    'home.stat.bestScore': { en: 'Best Score', hr: 'Najbolji rezultat' },
    'home.stat.streak': { en: 'Day Streak', hr: 'Niz dana' },
    'home.chooseCategory': { en: '📚 Choose a category to study', hr: '📚 Odaberi kategoriju za učenje' },
    'home.quickStart': { en: '🚀 Quick Start', hr: '🚀 Brzi početak' },
    'home.quickQuiz': { en: 'Quick Quiz (10 questions)', hr: 'Brzi kviz (10 pitanja)' },
    'home.allFlashcards': { en: 'All Flashcards', hr: 'Sve kartice' },
    'home.startLearning': { en: 'Start Learning', hr: 'Započni učenje' },

    // Learn
    'learn.title': { en: 'Learn - Complete Material', hr: 'Učenje – cjelovito gradivo' },

    // Flashcards
    'fc.title': { en: 'Flashcards', hr: 'Kartice' },
    'fc.clickForAnswer': { en: 'Click for answer', hr: 'Klikni za odgovor' },
    'fc.noCards': { en: 'No Cards', hr: 'Nema kartica' },
    'fc.noCardsAvailable': { en: 'No flashcards available for this lesson.', hr: 'Za ovu lekciju nema kartica.' },
    'fc.trySelecting': { en: 'Try selecting a different lesson or category.', hr: 'Pokušaj odabrati drugu lekciju ili kategoriju.' },
    'fc.dontKnow': { en: "Don't Know", hr: 'Ne znam' },
    'fc.know': { en: 'Know', hr: 'Znam' },

    // Zajednički gumbi
    'common.previous': { en: 'Previous', hr: 'Prethodno' },
    'common.next': { en: 'Next', hr: 'Dalje' },
    'common.check': { en: 'Check', hr: 'Provjeri' },
    'common.submit': { en: 'Submit', hr: 'Predaj' },
    'common.restart': { en: 'Restart', hr: 'Ponovno' },
    'common.skip': { en: 'Skip', hr: 'Preskoči' },
    'common.hint': { en: 'Hint', hr: 'Pomoć' },
    'common.correct': { en: 'Correct', hr: 'Točno' },
    'common.wrong': { en: 'Wrong', hr: 'Netočno' },

    // Quiz
    'quiz.title': { en: 'Quiz Mode', hr: 'Način kviza' },
    'quiz.subtitle': { en: 'Test your knowledge!', hr: 'Provjeri svoje znanje!' },
    'quiz.numQuestions': { en: 'Number of questions:', hr: 'Broj pitanja:' },
    'quiz.opt.5': { en: '5 questions', hr: '5 pitanja' },
    'quiz.opt.10': { en: '10 questions', hr: '10 pitanja' },
    'quiz.opt.20': { en: '20 questions', hr: '20 pitanja' },
    'quiz.opt.all': { en: 'All questions', hr: 'Sva pitanja' },
    'quiz.categoryLabel': { en: 'Category:', hr: 'Kategorija:' },
    'quiz.difficulty': { en: 'Difficulty:', hr: 'Težina:' },
    'quiz.easy': { en: 'Easy', hr: 'Lako' },
    'quiz.medium': { en: 'Medium', hr: 'Srednje' },
    'quiz.hard': { en: 'Hard', hr: 'Teško' },
    'quiz.start': { en: 'Start Quiz', hr: 'Pokreni kviz' },
    'quiz.reviewWrong': { en: 'Review Wrong Answers', hr: 'Pregled netočnih odgovora' },
    'quiz.tryAgain': { en: 'Try Again', hr: 'Pokušaj ponovno' },
    'quiz.newQuiz': { en: 'New Quiz', hr: 'Novi kviz' },
    'quiz.correct': { en: 'Correct!', hr: 'Točno!' },
    'quiz.incorrect': { en: 'Incorrect', hr: 'Netočno' },
    'quiz.question': { en: 'Question', hr: 'Pitanje' },
    'quiz.time': { en: 'Time', hr: 'Vrijeme' },
    // Quiz rezultat — naslovi/poruke po postotku (EN = ORIGINALNI tekst → EN nepromijenjen)
    'quiz.res.perfect.t': { en: 'Excellent!', hr: 'Izvrsno!' },
    'quiz.res.perfect.m': { en: 'Perfect knowledge!', hr: 'Savršeno znanje!' },
    'quiz.res.great.t': { en: 'Great!', hr: 'Sjajno!' },
    'quiz.res.great.m': { en: 'Very good!', hr: 'Vrlo dobro!' },
    'quiz.res.good.t': { en: 'Good!', hr: 'Dobro!' },
    'quiz.res.good.m': { en: 'Keep practicing!', hr: 'Nastavi vježbati!' },
    'quiz.res.ok.t': { en: 'Need more study', hr: 'Treba još učenja' },
    'quiz.res.ok.m': { en: 'Review the material and try again!', hr: 'Ponovi gradivo i pokušaj opet!' },

    // Fill
    'fill.title': { en: 'Fill in the Blank', hr: 'Dopuni prazninu' },
    'fill.placeholder': { en: 'Type your answer...', hr: 'Upiši svoj odgovor...' },
    'fill.correctAnswerLabel': { en: 'Correct answer:', hr: 'Točan odgovor:' },
    'fill.correct': { en: 'Correct!', hr: 'Točno!' },
    'fill.wrong': { en: 'Wrong!', hr: 'Netočno!' },
    'fill.completed': { en: 'You completed all Fill-in-the-blank questions!', hr: 'Riješio si sva pitanja Dopuni prazninu!' },

    // Progress
    'prog.title': { en: 'Your Progress', hr: 'Tvoj napredak' },
    'prog.overall': { en: 'Overall Progress', hr: 'Ukupan napredak' },
    'prog.learned': { en: 'learned', hr: 'naučeno' },
    'prog.avgScore': { en: 'Average score:', hr: 'Prosječan rezultat:' },
    'prog.totalQuizzes': { en: 'Total quizzes:', hr: 'Ukupno kvizova:' },
    'prog.accuracy': { en: 'Accuracy:', hr: 'Točnost:' },
    'prog.solved': { en: 'Solved:', hr: 'Riješeno:' },
    'prog.completed': { en: 'Completed:', hr: 'Završeno:' },
    'prog.attempts': { en: 'Attempts:', hr: 'Pokušaja:' },
    'prog.avgBest': { en: 'Avg best score:', hr: 'Prosj. najbolji rezultat:' },
    'prog.byCategory': { en: 'Progress by Category', hr: 'Napredak po kategoriji' },
    'prog.history': { en: 'Study History', hr: 'Povijest učenja' },
    'prog.reset': { en: 'Reset Progress', hr: 'Poništi napredak' },

    // Exercises
    'ex.subtitle': { en: 'Interactive, auto-graded practice problems.', hr: 'Interaktivni zadaci s automatskim ocjenjivanjem.' },
    'ex.empty': { en: 'No exercises yet for this lesson.', hr: 'Za ovu lekciju još nema vježbi.' },

    // Razno
    'loading.subject': { en: 'Loading subject…', hr: 'Učitavanje predmeta…' }
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
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
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
