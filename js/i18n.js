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

    // ===== Landing (chrome — marketing copy; EN = originalni tekst) =====
    'lnav.subjects': { en: 'Subjects', hr: 'Predmeti' },
    'lnav.how': { en: 'How it works', hr: 'Kako funkcionira' },
    'lnav.modes': { en: 'Study modes', hr: 'Načini učenja' },
    'lnav.about': { en: 'About', hr: 'O nama' },
    'cta.start.lower': { en: 'Start studying', hr: 'Počni učiti' },
    'cta.start.title': { en: 'Start Studying', hr: 'Počni učiti' },
    'auth.signIn': { en: 'Sign in', hr: 'Prijava' },
    'hero.badge.pre': { en: 'Free exam toolkit — ', hr: 'Besplatni alat za ispite — ' },
    'hero.badge.post': { en: ' subjects ready', hr: ' predmeta spremno' },
    'hero.title.l1': { en: 'Study Smart.', hr: 'Uči pametno.' },
    'hero.title.l2': { en: 'Score Higher.', hr: 'Postigni više.' },
    'hero.subtitle.pre': { en: 'Flashcards, quizzes, and in-depth lessons across ', hr: 'Kartice, kvizovi i detaljne lekcije za ' },
    'hero.subtitle.post': { en: ' university subjects from Year 1 & Year 2. Built for students who want results, not just notes.', hr: ' sveučilišnih predmeta 1. i 2. godine. Napravljeno za studente koji žele rezultate, a ne samo bilješke.' },
    'hero.browse': { en: 'Browse subjects', hr: 'Pregledaj predmete' },
    'hero.trust.free': { en: '100% free', hr: '100% besplatno' },
    'hero.trust.noSignup': { en: 'No sign-up', hr: 'Bez registracije' },
    'hero.trust.offline': { en: 'Works offline', hr: 'Radi izvanmrežno' },
    'stats.subjects': { en: 'Subjects', hr: 'Predmeta' },
    'stats.questions': { en: 'Questions', hr: 'Pitanja' },
    'stats.modes': { en: 'Study Modes', hr: 'Načina učenja' },
    'stats.free': { en: 'Free', hr: 'Besplatno' },
    'sec.catalog.eyebrow': { en: 'Catalog', hr: 'Katalog' },
    'sec.catalog.title': { en: 'Everything you need to study', hr: 'Sve što ti treba za učenje' },
    'sec.catalog.sub': { en: 'Year 1 & Year 2 of Hospitality Management at FMTU Opatija — pick a subject and start in seconds.', hr: 'Prva i druga godina smjera Hospitality Management na FMTU Opatija — odaberi predmet i počni u nekoliko sekundi.' },
    'sec.how.eyebrow': { en: 'Simple', hr: 'Jednostavno' },
    'sec.how.title': { en: 'How it works', hr: 'Kako funkcionira' },
    'sec.how.sub': { en: 'Three steps from lecture notes to exam-ready.', hr: 'Tri koraka od bilježaka do spremnosti za ispit.' },
    'how.1.t': { en: 'Pick your subject', hr: 'Odaberi predmet' },
    'how.1.p': { en: 'Browse by faculty, program and year, then open the lesson you need.', hr: 'Pregledavaj po fakultetu, smjeru i godini, pa otvori lekciju koju trebaš.' },
    'how.2.t': { en: 'Learn & practice', hr: 'Uči i vježbaj' },
    'how.2.p': { en: 'Read the material, then drill it with flashcards, quizzes and fill-in-the-blanks.', hr: 'Pročitaj gradivo, pa ga uvježbaj karticama, kvizovima i dopunjavanjem praznina.' },
    'how.3.t': { en: 'Track your progress', hr: 'Prati svoj napredak' },
    'how.3.p': { en: "See your best scores and streaks, and focus on what you haven't mastered yet.", hr: 'Vidi najbolje rezultate i nizove te se usredotoči na ono što još nisi svladao.' },
    'sec.modes.eyebrow': { en: '5 modes', hr: '5 načina' },
    'sec.modes.title': { en: 'Five ways to master the material', hr: 'Pet načina da svladaš gradivo' },
    'sec.modes.sub': { en: 'Every subject comes with all five — switch any time.', hr: 'Svaki predmet dolazi sa svih pet — prebacuj se kad god želiš.' },
    'mode.learn.p': { en: 'Complete, organised study material by topic.', hr: 'Potpuno, organizirano gradivo po temama.' },
    'mode.fc.p': { en: 'Flip cards to test recall and mark what you know.', hr: 'Okreći kartice da provjeriš pamćenje i označiš što znaš.' },
    'mode.quiz.p': { en: 'Multiple-choice with instant feedback and scoring.', hr: 'Pitanja s višestrukim izborom uz trenutnu povratnu informaciju i bodovanje.' },
    'mode.fill.t': { en: 'Fill-in-the-blank', hr: 'Dopuni prazninu' },
    'mode.fill.p': { en: 'Type the missing term to lock in key definitions.', hr: 'Upiši pojam koji nedostaje da učvrstiš ključne definicije.' },
    'mode.prog.p': { en: 'Scores, streaks and per-topic mastery in one place.', hr: 'Rezultati, nizovi i svladanost po temama na jednom mjestu.' },
    'cta.title': { en: 'Ready to ace your exams?', hr: 'Spreman/na za odličan ispit?' },
    'cta.sub': { en: "Jump into any subject — it's free and works right on your phone.", hr: 'Uskoči u bilo koji predmet — besplatno je i radi izravno na tvom mobitelu.' },
    'footer.tagline': { en: 'Interactive exam prep for FMTU Opatija — built by students, for students.', hr: 'Interaktivna priprema za ispite za FMTU Opatija — od studenata, za studente.' },
    'footer.explore': { en: 'Explore', hr: 'Istraži' },
    'footer.about': { en: 'About', hr: 'O nama' },
    'footer.aboutUs': { en: 'About us', hr: 'O nama' },
    'footer.contact': { en: 'Contact', hr: 'Kontakt' },
    'footer.faq': { en: 'FAQ', hr: 'Česta pitanja' },
    'footer.legal': { en: 'Legal', hr: 'Pravno' },
    'footer.privacy': { en: 'Privacy Policy', hr: 'Pravila privatnosti' },
    'footer.terms': { en: 'Terms of Use', hr: 'Uvjeti korištenja' },
    'footer.cookies': { en: 'Cookie settings', hr: 'Postavke kolačića' },
    'footer.rights': { en: '© 2026 Sokrat Study · Leon Kreso. All rights reserved.', hr: '© 2026 Sokrat Study · Leon Kreso. Sva prava pridržana.' },
    'footer.made.pre': { en: 'Made with ', hr: 'Stvoreno s ' },
    'footer.made.post': { en: ' for students', hr: ' za studente' },
    'sidebar.choose': { en: 'Choose Subject', hr: 'Odaberi predmet' },

    // Razno
    'loading.subject': { en: 'Loading subject…', hr: 'Učitavanje predmeta…' }
  };

  const HR_PROGRAM = 'hospitality-management-hr';
  const LS_KEY = 'sokrat-ui-lang';   // GLOBALNI izbor jezika sučelja (master); sadržaj se NE dira

  function readStored() {
    try { const v = localStorage.getItem(LS_KEY); return (v === 'hr' || v === 'en') ? v : null; } catch (_) { return null; }
  }
  // Početni jezik = spremljeni izbor korisnika, inače 'en'.
  let uiLang = readStored() || 'en';

  function t(key) {
    const e = DICT[key];
    if (!e) return key;                       // nepoznat ključ → vrati ključ (vidljivo u dev-u)
    return e[uiLang] != null ? e[uiLang] : (e.en != null ? e.en : key);
  }

  // Postavi tekst svih [data-i18n] / [data-i18n-placeholder] + osvježi labelu toggle-a.
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
    document.querySelectorAll('.lang-toggle-label').forEach((el) => { el.textContent = uiLang.toUpperCase(); });
    // auth nav-gumb ima dinamičan tekst (ime / „Sign in") → prepusti njemu da se osvježi
    if (typeof window.refreshAuthNav === 'function') window.refreshAuthNav();
  }

  // Postavi jezik sučelja. persist=true → zapamti kao globalni izbor (default).
  function setUiLang(lang, persist) {
    const next = lang === 'hr' ? 'hr' : 'en';
    const changed = next !== uiLang;
    uiLang = next;
    document.documentElement.setAttribute('lang', uiLang);
    if (persist !== false) { try { localStorage.setItem(LS_KEY, uiLang); } catch (_) { /* ignore */ } }
    // uvijek primijeni (i kad nema promjene) — npr. inicijalno bojanje toggle-labela
    applyTranslations();
    return changed;
  }

  // Globalni toggle: HR ↔ EN (korisnikov eksplicitni izbor → pamti se).
  function toggleUiLang() { setUiLang(uiLang === 'hr' ? 'en' : 'hr', true); }

  // Blagi prijedlog: ako korisnik NIJE eksplicitno birao jezik, a otvara HR program →
  // predloži hrvatsko sučelje (i zapamti). Ako je već birao, toggle je gospodar → ništa.
  function suggestLangForSubject(subjectId) {
    if (readStored()) return;                 // korisnik je već odlučio → ne diraj
    if (subjectId && typeof SokratCatalog !== 'undefined') {
      const s = SokratCatalog.getSubject(subjectId);
      if (s && s.programId === HR_PROGRAM) setUiLang('hr', true);
    }
  }

  // Primijeni spremljeni jezik na prvo bojanje (da persistirani HR odmah uhvati sve [data-i18n]).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyTranslations(); });
  } else { applyTranslations(); }

  // Globalno
  window.t = t;
  window.applyTranslations = applyTranslations;
  window.setUiLang = setUiLang;
  window.toggleUiLang = toggleUiLang;
  window.suggestLangForSubject = suggestLangForSubject;
  // natrag-kompatibilnost: stari poziv setUiLangForSubject sad samo „predloži"
  window.setUiLangForSubject = suggestLangForSubject;
  window.getUiLang = function () { return uiLang; };
})();
