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
  /** @type {Record<string, { en: string, hr: string }>} */
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

    // Admin (F4 CRUD) — vidljivo samo adminu
    'admin.title': { en: 'Admin', hr: 'Admin' },
    'admin.desc': { en: 'Edit study content directly. Every change is versioned and can be undone.', hr: 'Uređuj sadržaj izravno. Svaka izmjena se verzionira i može se poništiti.' },
    'admin.editContent': { en: 'Edit content', hr: 'Uredi sadržaj' },
    'admin.comingSoon': { en: 'Content editor — coming in the next step.', hr: 'Uređivač sadržaja — stiže u sljedećem koraku.' },
    'admin.viewerNote': { en: 'Edit flashcards inline. Every change is versioned and can be undone. (Quiz/fill/learn editing arrives next.)', hr: 'Uredi kartice izravno. Svaka izmjena se verzionira i može poništiti. (Kviz/dopuna/učenje uskoro.)' },
    'admin.subject': { en: 'Subject', hr: 'Predmet' },
    'admin.lesson': { en: 'Lesson', hr: 'Lekcija' },
    'admin.selectSubject': { en: '— select subject —', hr: '— odaberi predmet —' },
    'admin.selectLesson': { en: '— select lesson —', hr: '— odaberi lekciju —' },
    'admin.loading': { en: 'Loading…', hr: 'Učitavanje…' },
    'admin.loadFail': { en: 'Could not load content.', hr: 'Nije moguće učitati sadržaj.' },
    'admin.noCards': { en: 'No flashcards in this lesson.', hr: 'Nema kartica u ovoj lekciji.' },
    'admin.edit': { en: 'Edit', hr: 'Uredi' },
    'admin.editCard': { en: 'Edit flashcard', hr: 'Uredi karticu' },
    'admin.question': { en: 'Question', hr: 'Pitanje' },
    'admin.answer': { en: 'Answer', hr: 'Odgovor' },
    'admin.save': { en: 'Save', hr: 'Spremi' },
    'admin.saving': { en: 'Saving…', hr: 'Spremanje…' },
    'admin.saveOk': { en: 'Flashcard saved.', hr: 'Kartica spremljena.' },
    'admin.saveErr': { en: 'Could not save.', hr: 'Spremanje nije uspjelo.' },
    'admin.emptyErr': { en: 'Question and answer must not be empty.', hr: 'Pitanje i odgovor ne smiju biti prazni.' },
    'admin.notInDb': { en: 'This subject is not in the database yet.', hr: 'Ovaj predmet još nije u bazi.' },
    'admin.finalNote': { en: 'syncs across this lesson and the final exam.', hr: 'sinkronizira se kroz ovu lekciju i finalni ispit.' },
    'admin.propWarn': { en: '(final sync incomplete)', hr: '(finalni nije potpuno sinkroniziran)' },

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
    'fc.prev': { en: 'Previous card', hr: 'Prethodna kartica' },   // a11y aria-label (F3 3E)
    'fc.next': { en: 'Next card', hr: 'Sljedeća kartica' },        // a11y aria-label (F3 3E)

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
    'common.cancel': { en: 'Cancel', hr: 'Odustani' },
    'common.confirm': { en: 'Confirm', hr: 'Potvrdi' },
    // Service Worker update-flow (F3 3A.3) — toast s klik-akcijom
    'sw.updateReady': { en: 'New version is ready — tap to update', hr: 'Nova verzija je spremna — dodirni za nadogradnju' },
    // a11y (F3 3E) — aria-label za skrolabilne learn tablice
    'a11y.scrollTable': { en: 'Table — scroll horizontally to see more', hr: 'Tablica — skrolaj vodoravno za više' },
    // a11y (F3 3E.2) — landmark labela za statistike na landingu
    'a11y.heroStats': { en: 'Key statistics', hr: 'Ključne statistike' },

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
    'hero.trust.offline': { en: 'Works offline', hr: 'Radi offline' },
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

    // ===== Browse drill-down (dinamički renderirano u navigation.js) =====
    'browse.trail.browse': { en: 'Browse', hr: 'Pregled' },
    'browse.trail.faculty': { en: 'Faculty', hr: 'Fakultet' },
    'browse.trail.program': { en: 'Program', hr: 'Smjer' },
    'browse.h.faculty': { en: 'Choose your faculty', hr: 'Odaberi svoj fakultet' },
    'browse.h.program': { en: 'Choose your program', hr: 'Odaberi svoj smjer' },
    'browse.h.year': { en: 'Choose your year', hr: 'Odaberi godinu' },
    'browse.i.faculty': { en: 'Select your faculty to find your subjects.', hr: 'Odaberi fakultet da pronađeš svoje predmete.' },
    'browse.i.program': { en: 'Select your study program.', hr: 'Odaberi svoj studijski smjer.' },
    'browse.i.year': { en: 'Pick the study year you want to review.', hr: 'Odaberi studijsku godinu koju želiš ponoviti.' },
    'browse.empty.faculties': { en: 'No faculties yet.', hr: 'Još nema fakulteta.' },
    'browse.empty.programs': { en: 'No programs yet.', hr: 'Još nema smjerova.' },
    'browse.empty.years': { en: 'No years yet.', hr: 'Još nema godina.' },
    'browse.empty.subjects': { en: 'No subjects yet.', hr: 'Još nema predmeta.' },
    'browse.studyYear': { en: 'Study year', hr: 'Studijska godina' },
    'browse.semester': { en: 'Semester', hr: 'Semestar' },
    'unit.year.1': { en: 'year', hr: 'godina' },
    'unit.year.n': { en: 'years', hr: 'godine' },
    'unit.subject.1': { en: 'subject', hr: 'predmet' },
    'unit.subject.n': { en: 'subjects', hr: 'predmeta' },
    'unit.lesson.1': { en: 'lesson', hr: 'lekcija' },
    'unit.lesson.n': { en: 'lessons', hr: 'lekcije' },

    // ===== Poruke (toast/confirm/status — dinamički iz JS-a) =====
    // Progress / analytics (analytics.js)
    'msg.confirmResetProgress': { en: 'Are you sure you want to reset all progress?', hr: 'Jesi li siguran/na da želiš poništiti sav napredak?' },
    'msg.progressReset': { en: 'Progress reset!', hr: 'Napredak poništen!' },
    'msg.confirmResetAnalytics': { en: 'Are you sure you want to reset all analytics?', hr: 'Jesi li siguran/na da želiš poništiti svu statistiku?' },
    'msg.analyticsReset': { en: 'Analytics reset!', hr: 'Statistika poništena!' },
    // Auth (auth.js)
    'msg.signedInSync': { en: 'Signed in — your progress now syncs to the cloud.', hr: 'Prijavljen/a — napredak se sad sinkronizira u oblak.' },
    'msg.passwordUpdatedSignedIn': { en: 'Password updated — you are signed in.', hr: 'Lozinka promijenjena — prijavljen/a si.' },
    'msg.signedOut': { en: 'Signed out. Progress stays on this device.', hr: 'Odjavljen/a. Napredak ostaje na ovom uređaju.' },
    // Profile (profile.js)
    'msg.syncedJustNow': { en: 'Synced just now — everything is backed up.', hr: 'Sinkronizirano upravo — sve je sigurno pohranjeno.' },
    'msg.progressSynced': { en: 'Progress synced to cloud', hr: 'Napredak sinkroniziran u oblak' },
    'msg.passwordsNoMatch': { en: 'Passwords do not match.', hr: 'Lozinke se ne podudaraju.' },
    'msg.saving': { en: 'Saving…', hr: 'Spremanje…' },
    'msg.passwordUpdated': { en: 'Password updated.', hr: 'Lozinka promijenjena.' },
    'msg.deleteCloudFail': { en: 'Could not delete cloud data: ', hr: 'Brisanje podataka u oblaku nije uspjelo: ' },
    'msg.cloudDataDeleted': { en: 'Cloud data deleted.', hr: 'Podaci u oblaku obrisani.' },
    'msg.confirmDeleteCloud': { en: 'Delete ALL study progress stored in the cloud? Progress on this device is kept, but you will be signed out.', hr: 'Obrisati SAV napredak pohranjen u oblaku? Napredak na ovom uređaju ostaje, ali bit ćeš odjavljen/a.' },

    // ===== Auth modal (građen u auth.js) =====
    'auth.m.title': { en: 'Sync your progress', hr: 'Sinkroniziraj svoj napredak' },
    'auth.m.text': { en: 'Back up your study progress and continue on any device with a free account.', hr: 'Sigurno pohrani napredak i nastavi na bilo kojem uređaju uz besplatan račun.' },
    'auth.tab.signUp': { en: 'Create account', hr: 'Otvori račun' },
    'auth.ph.password': { en: 'Password', hr: 'Lozinka' },
    'auth.forgot': { en: 'Forgot password?', hr: 'Zaboravljena lozinka?' },
    'auth.ph.name': { en: 'Your name', hr: 'Tvoje ime' },
    'auth.ph.passwordMin': { en: 'Password (min. 8 characters)', hr: 'Lozinka (min. 8 znakova)' },
    'auth.forgot.text': { en: 'Enter your email and we will send you a link to reset your password.', hr: 'Upiši svoj e-mail i poslat ćemo ti link za promjenu lozinke.' },
    'auth.btn.sendReset': { en: 'Send reset link', hr: 'Pošalji link za promjenu' },
    'auth.backToSignIn': { en: '← Back to sign in', hr: '← Natrag na prijavu' },
    'auth.terms.pre': { en: 'By signing in or creating an account you agree to our ', hr: 'Prijavom ili otvaranjem računa prihvaćaš naše ' },
    'auth.terms.mid': { en: ' and ', hr: ' i ' },
    'auth.recovery.title': { en: 'Set a new password', hr: 'Postavi novu lozinku' },
    'auth.recovery.textPre': { en: 'Choose a new password for ', hr: 'Odaberi novu lozinku za ' },
    'auth.signedIn.title': { en: 'Signed in', hr: 'Prijavljen/a' },
    'auth.signedInAs': { en: 'Signed in as ', hr: 'Prijavljen/a kao ' },
    'auth.syncAuto': { en: 'Your progress syncs automatically.', hr: 'Tvoj napredak se automatski sinkronizira.' },
    'sync.lastSyncedPre': { en: 'Your progress syncs automatically. Last synced ', hr: 'Tvoj napredak se automatski sinkronizira. Zadnja sinkronizacija ' },
    // Auth status poruke
    'auth.st.signingIn': { en: 'Signing in…', hr: 'Prijava…' },
    'auth.st.wrongCreds': { en: 'Wrong email or password.', hr: 'Pogrešan e-mail ili lozinka.' },
    'auth.st.confirmFirst': { en: 'Please confirm your email first — check your inbox for the confirmation link.', hr: 'Prvo potvrdi svoj e-mail — provjeri inbox za link za potvrdu.' },
    'auth.st.creating': { en: 'Creating account…', hr: 'Otvaranje računa…' },
    'auth.st.exists': { en: 'An account with this email already exists — switch to Sign in.', hr: 'Račun s ovim e-mailom već postoji — prebaci na Prijavu.' },
    'auth.st.created': { en: 'Account created! Check your inbox and click the confirmation link, then sign in.', hr: 'Račun otvoren! Provjeri inbox i klikni link za potvrdu, zatim se prijavi.' },
    'auth.st.sending': { en: 'Sending…', hr: 'Slanje…' },
    'auth.st.resetSent': { en: 'If an account exists for that email, a reset link is on its way — check your inbox.', hr: 'Ako račun za taj e-mail postoji, link za promjenu stiže — provjeri inbox.' },

    // ===== Profil (#profile-page; renderProfilePage u profile.js) =====
    'profile.title': { en: 'My Profile', hr: 'Moj profil' },
    'profile.notSignedIn': { en: 'You are not signed in', hr: 'Nisi prijavljen/a' },
    'profile.signInToBackup': { en: 'Sign in to back up your progress and study on any device.', hr: 'Prijavi se da sigurno pohraniš napredak i učiš na bilo kojem uređaju.' },
    'profile.memberSince': { en: 'Member since ', hr: 'Član od ' },
    'profile.changePassword': { en: 'Change password', hr: 'Promijeni lozinku' },
    'profile.signOut': { en: 'Sign out', hr: 'Odjava' },
    'profile.newPassPlaceholder': { en: 'New password (min. 8 characters)', hr: 'Nova lozinka (min. 8 znakova)' },
    'profile.repeatNewPass': { en: 'Repeat new password', hr: 'Ponovi novu lozinku' },
    'profile.saveNewPass': { en: 'Save new password', hr: 'Spremi novu lozinku' },
    'profile.cloudSync': { en: 'Cloud sync', hr: 'Sinkronizacija u oblak' },
    'profile.syncAuto': { en: 'Your progress is backed up automatically while you study.', hr: 'Tvoj napredak se automatski sigurno pohranjuje dok učiš.' },
    'profile.syncNow': { en: 'Sync now', hr: 'Sinkroniziraj sada' },
    'profile.progressOverview': { en: 'Progress overview', hr: 'Pregled napretka' },
    'profile.privacyData': { en: 'Privacy & data', hr: 'Privatnost i podaci' },
    'profile.deleteDesc1': { en: 'Delete all study progress stored in the cloud. Progress saved on this device stays. To delete your entire account, email ', hr: 'Obriši sav napredak pohranjen u oblaku. Napredak spremljen na ovom uređaju ostaje. Za brisanje cijelog računa pošalji e-mail na ' },
    'profile.deleteDesc2': { en: '. See our ', hr: '. Pogledaj naša ' },
    'profile.deleteCloud': { en: 'Delete cloud data', hr: 'Obriši podatke iz oblaka' },
    'profile.noActivity': { en: 'No study activity yet — open a subject and start learning!', hr: 'Još nema aktivnosti — otvori predmet i počni učiti!' },
    'profile.cardsLearned': { en: 'cards learned', hr: 'naučenih kartica' },
    'profile.quizzesTaken': { en: 'quizzes taken', hr: 'odrađenih kvizova' },
    'profile.fillSolved': { en: 'fill-ins solved', hr: 'riješenih dopuna' },
    'profile.tip.cards': { en: 'Flashcards learned', hr: 'Naučene kartice' },
    'profile.tip.quizzes': { en: 'Quizzes taken', hr: 'Odrađeni kvizovi' },
    'profile.tip.fill': { en: 'Fill-in exercises solved', hr: 'Riješene dopune' },
    'profile.avg': { en: 'avg', hr: 'prosj.' },

    // Lessons / Study chrome (dinamički iz navigation.js)
    'breadcrumb.lessons': { en: 'Lessons', hr: 'Lekcije' },
    'lesson.fallback': { en: 'Lesson', hr: 'Lekcija' },
    'toast.comingSoon': { en: 'Second Midterm is coming soon.', hr: 'Drugi kolokvij uskoro.' },
    'toast.loadError': { en: 'Could not load this subject. Please try again.', hr: 'Učitavanje predmeta nije uspjelo. Pokušaj ponovno.' },

    // Razno
    'loading.subject': { en: 'Loading subject…', hr: 'Učitavanje predmeta…' }
  };

  const HR_PROGRAM = 'hospitality-management-hr';
  const LS_KEY = 'sokrat-ui-lang';   // GLOBALNI izbor jezika sučelja (master); sadržaj se NE dira

  function readStored() {
    try { const v = localStorage.getItem(LS_KEY); return (v === 'hr' || v === 'en') ? v : null; } catch (_) { return null; }
  }
  // Početni jezik = spremljeni izbor korisnika, inače 'en'.
  /** @type {'en' | 'hr'} */
  let uiLang = readStored() || 'en';

  /** @param {string} key @returns {string} */
  function t(key) {
    const e = DICT[key];
    if (!e) return key;                       // nepoznat ključ → vrati ključ (vidljivo u dev-u)
    return e[uiLang] != null ? e[uiLang] : (e.en != null ? e.en : key);
  }

  // Postavi tekst svih [data-i18n] / [data-i18n-placeholder] + osvježi labelu toggle-a.
  /** @param {Document | Element} [root] */
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
    // a11y (F3 3E): lokaliziraj aria-label za ikone-gumbe bez vidljivog teksta (npr. flashcard prev/next).
    scope.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
    document.querySelectorAll('.lang-toggle-label').forEach((el) => { el.textContent = uiLang.toUpperCase(); });
    // auth nav-gumb ima dinamičan tekst (ime / „Sign in") → prepusti njemu da se osvježi
    if (typeof window.refreshAuthNav === 'function') window.refreshAuthNav();
    // Liste renderirane iz catalog-a (innerHTML) ne hvataju [data-i18n] → re-renderiraj ih na promjenu jezika.
    if (typeof window.renderSubjectsSidebar === 'function') window.renderSubjectsSidebar();
    if (typeof window.renderLandingSubjects === 'function') window.renderLandingSubjects();
    const bp = document.getElementById('browse-page');
    if (bp && bp.classList.contains('active') && typeof window.renderBrowse === 'function') window.renderBrowse();
    // Profil je renderiran innerHTML-om (ne hvata [data-i18n]) → re-renderiraj ako je otvoren.
    const pp = document.getElementById('profile-page');
    if (pp && pp.classList.contains('active') && typeof window.renderProfilePage === 'function') window.renderProfilePage();
  }

  // Postavi jezik sučelja. persist=true → zapamti kao globalni izbor (default).
  /** @param {string} lang @param {boolean} [persist] @returns {boolean} */
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
  /** @param {string} [subjectId] */
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
