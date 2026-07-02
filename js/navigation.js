// ===== SOKRAT STUDY — NAVIGATION =====

// ========== POSITION PERSISTENCE ==========
function saveCurrentPosition(page, data) {
    const nav = AppState.nav;
    const position = {
        page: page,
        subject: data.subject || nav.subject,
        lesson: data.lesson || nav.lesson,
        section: nav.section,
        category: nav.category,
        timestamp: Date.now()
    };
    localStorage.setItem('sokrat-last-position', JSON.stringify(position));
}

function restoreLastPosition() {
    try {
        const saved = localStorage.getItem('sokrat-last-position');
        if (saved) {
            const position = JSON.parse(saved);
            const hoursSinceSave = (Date.now() - position.timestamp) / (1000 * 60 * 60);

            if (hoursSinceSave < 24 && position.page && position.page !== 'landing') {
                if (position.page === 'study' && position.subject && position.lesson) {
                    AppState.nav.category = position.category || 'all';
                    // Pass the saved section into init; it switches there AFTER lazy content
                    // loads (no setTimeout race with async loading).
                    navigateTo('study', {
                        subject: position.subject,
                        lesson: position.lesson,
                        section: position.section || 'home'
                    });
                    return;
                } else if (position.page === 'lessons' && position.subject) {
                    navigateTo('lessons', { subject: position.subject });
                    return;
                }
            }
        }
    } catch (e) {
        // Could not restore position
    }
    navigateTo('landing');
}

// ========== PAGE NAVIGATION ==========
let profileReturnPage = null; // kamo vodi "back" s Profile stranice

function navigateTo(page, data = {}) {
    // Profile se NE sprema kao "last position": render ovisi o auth sesiji koja na
    // reloadu još nije spremna (CDN se tek učitava), pa bi restore završio prazan.
    if (page === 'profile' && AppState.nav.page !== 'profile') {
        profileReturnPage = { page: AppState.nav.page, data: { subject: AppState.nav.subject, lesson: AppState.nav.lesson } };
    }
    AppState.nav.page = page;
    if (page !== 'profile') saveCurrentPosition(page, data);

    document.querySelectorAll('.landing-page, .browse-page, .lessons-page, .study-page, .about-page, .profile-page').forEach(p => {
        p.classList.remove('active');
    });

    switch (page) {
        case 'landing':
            // Jezik sučelja = GLOBALNI toggle (ne diramo ga po stranici); chrome se već boja iz i18n inita.
            document.getElementById('landing-page').classList.add('active');
            closeSidebar();
            break;
        case 'browse':
            renderBrowse();
            document.getElementById('browse-page').classList.add('active');
            closeSidebar();
            break;
        case 'lessons':
            if (data.subject) {
                AppState.nav.subject = data.subject;
                if (typeof suggestLangForSubject === 'function') suggestLangForSubject(data.subject);
                renderLessonsPage(data.subject);
            }
            document.getElementById('lessons-page').classList.add('active');
            closeSidebar();
            break;
        case 'study':
            if (data.subject && data.lesson) {
                AppState.nav.subject = data.subject;
                AppState.nav.lesson = data.lesson;
                if (typeof suggestLangForSubject === 'function') suggestLangForSubject(data.subject);  // prvi put HR program → predloži hrvatski
                initStudyPage(data.subject, data.lesson, data.section);
            }
            document.getElementById('study-page').classList.add('active');
            break;
        case 'about':
            document.getElementById('about-page').classList.add('active');
            break;
        case 'profile':
            if (typeof renderProfilePage === 'function') renderProfilePage();
            document.getElementById('profile-page').classList.add('active');
            break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== SIDEBAR ==========
function openSidebar() {
    document.getElementById('subjectsSidebar').classList.add('active');
    document.getElementById('subjectsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.getElementById('subjectsSidebar').classList.remove('active');
    document.getElementById('subjectsOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Primarni (zadani) program za landing/sidebar showcase. Drugi programi (npr. HRV
// "hospitality-management-hr") dostupni su kroz Browse drill-down (program-svjestan),
// pa landing/sidebar pokazuju SAMO primarni → EN iskustvo ostaje nepromijenjeno, bez
// miješanja jezika. (UI i18n po aktivnom programu = kasniji korak; vidi docs/HRV_PLAN.md.)
const PRIMARY_PROGRAM = 'hospitality-management';
function primarySubjects() {
    return (typeof SOKRAT_CATALOG !== 'undefined' && Array.isArray(SOKRAT_CATALOG.subjects))
        ? SOKRAT_CATALOG.subjects.filter((s) => s.programId === PRIMARY_PROGRAM)
        : [];
}

// i18n kratice za dinamički renderirane stringove (browse/landing kartice)
function _t(key, fallback) { return (typeof t === 'function') ? t(key) : (fallback != null ? fallback : key); }
function _hr() { return typeof getUiLang === 'function' && getUiLang() === 'hr'; }
// jezično ispravna jedinica (1 vs množina)
function _unit(n, base) { return n + ' ' + _t('unit.' + base + (n === 1 ? '.1' : '.n')); }

// ========== SIDEBAR SUBJECT LIST (rendered from catalog) ==========
function renderSubjectsSidebar() {
    const list = document.getElementById('subjectsList');
    if (!list || typeof SOKRAT_CATALOG === 'undefined' || !Array.isArray(SOKRAT_CATALOG.subjects)) {
        return;
    }

    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    list.innerHTML = primarySubjects().map((s) => {
        const grad = (Array.isArray(s.iconGradient) && s.iconGradient.length === 2)
            ? s.iconGradient
            : [s.color, s.color];
        const lessonCount = (s.lessons || []).length;
        const lessonLabel = lessonCount === 1 ? 'Lesson' : 'Lessons';
        return `
                <div class="subject-item" data-subject="${esc(s.id)}">
                    <div class="subject-item-icon" style="background: linear-gradient(135deg, ${esc(grad[0])}, ${esc(grad[1])});">
                        <i class="fas ${esc(s.icon)}"></i>
                    </div>
                    <div class="subject-item-info">
                        <h3>${esc(s.name)}</h3>
                        <p>${esc(s.description)}</p>
                        <div class="subject-item-meta">
                            <span><i class="fas fa-book"></i> ${lessonCount} ${lessonLabel}</span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right subject-arrow"></i>
                </div>`;
    }).join('');
}

// ========== BROWSE (drill-down: Faculty → Program → Year → Subject) ==========
// Sve se renderira IZ data/catalog.js. Dodavanjem fakulteta/smjera/godine/predmeta
// u catalog, kartice se AUTOMATSKI pojave — bez ikakve izmjene ovog koda.

let browseState = { level: 'faculties', facultyId: null, programId: null, year: null };

// HTML-escape (lokalni helper za browse renderere)
function browseEsc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Pošten napredak po predmetu: best quiz score (0–100) iz spremljenog stanja.
function getSubjectProgress(storageKey) {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return { started: false, bestScore: 0 };
        const p = JSON.parse(raw);
        const best = (Array.isArray(p.quizScores) && p.quizScores.length)
            ? Math.max(...p.quizScores) : 0;
        const started = best > 0
            || (Array.isArray(p.flashcardsLearned) && p.flashcardsLearned.length > 0)
            || (p.fillSolved > 0);
        return { started, bestScore: best };
    } catch (e) {
        return { started: false, bestScore: 0 };
    }
}

// Ulaz u browse: uvijek kreni od vrha drill-downa (Fakulteti).
function enterBrowse() {
    browseState = { level: 'faculties', facultyId: null, programId: null, year: null };
    navigateTo('browse');
}

// Back gumb na browse stranici: korak unatrag kroz hijerarhiju.
function browseBack() {
    switch (browseState.level) {
        case 'subjects':
            browseState.level = 'years';
            browseState.year = null;
            renderBrowse();
            break;
        case 'years':
            browseState.level = 'programs';
            browseState.programId = null;
            renderBrowse();
            break;
        case 'programs':
            browseState.level = 'faculties';
            browseState.facultyId = null;
            renderBrowse();
            break;
        default:
            navigateTo('landing');
    }
}

function browseEmpty(msg) {
    return `<div class="browse-empty"><i class="fas fa-inbox"></i><p>${browseEsc(msg)}</p></div>`;
}

function renderFacultyCards() {
    const fs = SokratCatalog.faculties();
    if (!fs.length) return browseEmpty(_t('browse.empty.faculties', 'No faculties yet.'));
    return `<div class="browse-grid">` + fs.map(f => {
        const n = SokratCatalog.programsOf(f.id).length;
        return `
            <button type="button" class="browse-card" data-browse="faculty" data-id="${browseEsc(f.id)}">
                <div class="browse-card-top">
                    <div class="browse-card-icon"><i class="fas fa-building-columns"></i></div>
                    <div class="browse-card-headings">
                        <div class="browse-card-title">${browseEsc(f.name)}</div>
                    </div>
                </div>
                <div class="browse-card-meta"><span><i class="fas fa-graduation-cap"></i> ${n} ${n === 1 ? 'program' : 'programs'}</span></div>
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
    }).join('') + `</div>`;
}

function renderProgramCards(facultyId) {
    const ps = SokratCatalog.programsOf(facultyId);
    if (!ps.length) return browseEmpty(_t('browse.empty.programs', 'No programs yet.'));
    return `<div class="browse-grid">` + ps.map(p => {
        const years = SokratCatalog.yearsOf(p.id).length;
        const subs = SokratCatalog.subjectsOf(p.id).length;
        return `
            <button type="button" class="browse-card" data-browse="program" data-id="${browseEsc(p.id)}">
                <div class="browse-card-top">
                    <div class="browse-card-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="browse-card-headings">
                        <div class="browse-card-title">${browseEsc(p.name)}</div>
                    </div>
                </div>
                <div class="browse-card-meta">
                    <span><i class="fas fa-calendar-days"></i> ${_unit(years, 'year')}</span>
                    <span><i class="fas fa-book"></i> ${_unit(subs, 'subject')}</span>
                </div>
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
    }).join('') + `</div>`;
}

function renderYearCards(programId) {
    const years = SokratCatalog.yearsOf(programId);
    if (!years.length) return browseEmpty(_t('browse.empty.years', 'No years yet.'));
    const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
    return `<div class="browse-grid">` + years.map(y => {
        const subs = SokratCatalog.subjectsOf(programId, y).length;
        const yearTitle = _hr() ? `${y}. godina` : `${ordinal[y] || (y + '.')} Year`;
        return `
            <button type="button" class="browse-card" data-browse="year" data-id="${y}">
                <div class="browse-card-top">
                    <div class="browse-card-icon is-year">${y}</div>
                    <div class="browse-card-headings">
                        <div class="browse-card-title">${yearTitle}</div>
                        <div class="browse-card-sub">${_t('browse.studyYear', 'Study year')} ${y}</div>
                    </div>
                </div>
                <div class="browse-card-meta"><span><i class="fas fa-book"></i> ${_unit(subs, 'subject')}</span></div>
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
    }).join('') + `</div>`;
}

function subjectBrowseCard(s) {
    const grad = (Array.isArray(s.iconGradient) && s.iconGradient.length === 2)
        ? s.iconGradient : [s.color, s.color];
    const lessonCount = (s.lessons || []).length;
    const prog = getSubjectProgress(s.storageKey);
    const progressHtml = prog.started ? `
                <div class="browse-progress">
                    <div class="browse-progress-track"><div class="browse-progress-fill" style="width:${prog.bestScore}%"></div></div>
                    <span class="browse-progress-label">${prog.bestScore}%</span>
                </div>` : '';
    return `
            <button type="button" class="browse-card" data-browse="subject" data-id="${browseEsc(s.id)}" style="--card-accent:${browseEsc(grad[0])}">
                <div class="browse-card-top">
                    <div class="browse-card-icon" style="background:linear-gradient(135deg, ${browseEsc(grad[0])}, ${browseEsc(grad[1])});">
                        <i class="fas ${browseEsc(s.icon)}"></i>
                    </div>
                    <div class="browse-card-headings">
                        <div class="browse-card-title">${browseEsc(s.name)}</div>
                        <div class="browse-card-sub">${_unit(lessonCount, 'lesson')}</div>
                    </div>
                </div>
                <div class="browse-card-desc">${browseEsc(s.description)}</div>
                ${progressHtml}
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
}

function renderSubjectCards(programId, year) {
    const semesters = SokratCatalog.semestersOf(programId, year);
    if (!semesters.length) return browseEmpty(_t('browse.empty.subjects', 'No subjects yet.'));
    return semesters.map(sem => {
        const subs = SokratCatalog.subjectsOf(programId, year).filter(s => s.semester === sem);
        return `
            <section class="browse-section">
                <h2 class="browse-section-title">${_t('browse.semester', 'Semester')} ${sem}</h2>
                <div class="browse-grid">${subs.map(subjectBrowseCard).join('')}</div>
            </section>`;
    }).join('');
}

function renderBrowse() {
    if (typeof SokratCatalog === 'undefined') return;
    const grid = document.getElementById('browseGrid');
    const heading = document.getElementById('browseHeading');
    const crumb = document.getElementById('browseBreadcrumb');
    const intro = document.getElementById('browseIntro');
    if (!grid) return;

    let html = '', title = '', trail = _t('browse.trail.browse', 'Browse'), introText = '';
    const yearLabel = (y) => _hr() ? `${y}. godina` : `Year ${y}`;

    if (browseState.level === 'programs') {
        const f = SokratCatalog.faculties().find(x => x.id === browseState.facultyId);
        title = _t('browse.h.program', 'Choose your program');
        trail = f ? f.name : _t('browse.trail.faculty', 'Faculty');
        introText = _t('browse.i.program', 'Select your study program.');
        html = renderProgramCards(browseState.facultyId);
    } else if (browseState.level === 'years') {
        const p = SokratCatalog.getProgram(browseState.programId);
        title = _t('browse.h.year', 'Choose your year');
        trail = p ? p.name : _t('browse.trail.program', 'Program');
        introText = _t('browse.i.year', 'Pick the study year you want to review.');
        html = renderYearCards(browseState.programId);
    } else if (browseState.level === 'subjects') {
        const p = SokratCatalog.getProgram(browseState.programId);
        title = _hr() ? `Predmeti ${browseState.year}. godine` : `Year ${browseState.year} subjects`;
        trail = p ? `${p.name} · ${yearLabel(browseState.year)}` : yearLabel(browseState.year);
        introText = '';
        html = renderSubjectCards(browseState.programId, browseState.year);
    } else {
        // 'faculties' (default / entry)
        title = _t('browse.h.faculty', 'Choose your faculty');
        trail = _t('browse.trail.browse', 'Browse');
        introText = _t('browse.i.faculty', 'Select your faculty to find your subjects.');
        html = renderFacultyCards();
    }

    if (heading) heading.textContent = title;
    if (crumb) crumb.textContent = trail;
    if (intro) intro.textContent = introText;
    grid.innerHTML = html;
}

// Jedan delegirani click listener za sve browse kartice (veže se jednom).
function initBrowse() {
    const grid = document.getElementById('browseGrid');
    if (!grid || grid.dataset.bound === '1') return;
    grid.dataset.bound = '1';
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.browse-card');
        if (!card) return;
        const kind = card.dataset.browse;
        const id = card.dataset.id;
        if (kind === 'faculty') {
            browseState.facultyId = id;
            browseState.level = 'programs';
            renderBrowse();
        } else if (kind === 'program') {
            browseState.programId = id;
            browseState.level = 'years';
            renderBrowse();
        } else if (kind === 'year') {
            browseState.year = Number(id);
            browseState.level = 'subjects';
            renderBrowse();
        } else if (kind === 'subject') {
            navigateTo('lessons', { subject: id });
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== LANDING META (dynamic counts from catalog) ==========
// Drži landing brojeve usklađene s catalog-om: dodavanjem predmeta broj raste sam.
function renderLandingMeta() {
    if (typeof SOKRAT_CATALOG === 'undefined' || !Array.isArray(SOKRAT_CATALOG.subjects)) return;
    const count = primarySubjects().length;
    document.querySelectorAll('[data-meta="subjectCount"]').forEach((el) => {
        el.textContent = count;
    });
    // Ukupan broj pitanja (autogeneriran u data/landing-stats.js → window.SOKRAT_STATS). Fallback: ostavi HTML tekst.
    const stats = (typeof window !== 'undefined') ? window.SOKRAT_STATS : null;
    if (stats && typeof stats.questionCount === 'number' && stats.questionCount > 0) {
        const label = stats.questionCount.toLocaleString('en-US') + '+';
        document.querySelectorAll('[data-meta="questionCount"]').forEach((el) => {
            el.textContent = label;
        });
    }
}

// ========== LANDING SUBJECTS SHOWCASE (rendered from catalog) ==========
function renderLandingSubjects() {
    const wrap = document.getElementById('landingSubjects');
    if (!wrap || typeof SOKRAT_CATALOG === 'undefined' || !Array.isArray(SOKRAT_CATALOG.subjects)) return;
    wrap.innerHTML = primarySubjects().map((s) => {
        const grad = (Array.isArray(s.iconGradient) && s.iconGradient.length === 2)
            ? s.iconGradient : [s.color, s.color];
        const lessonCount = (s.lessons || []).length;
        return `
            <button type="button" class="landing-subject-card" data-landing-subject="${browseEsc(s.id)}" style="--card-accent:${browseEsc(grad[0])}">
                <div class="landing-subject-icon" style="background:linear-gradient(135deg, ${browseEsc(grad[0])}, ${browseEsc(grad[1])});">
                    <i class="fas ${browseEsc(s.icon)}"></i>
                </div>
                <div class="landing-subject-info">
                    <h3>${browseEsc(s.name)}</h3>
                    <p>${_hr() ? `${browseEsc(s.year)}. godina` : `Year ${browseEsc(s.year)}`} &middot; ${_unit(lessonCount, 'lesson')}</p>
                </div>
                <i class="fas fa-arrow-right landing-subject-arrow" aria-hidden="true"></i>
            </button>`;
    }).join('');
}

// Delegirani click za showcase kartice (veže se jednom) → otvori lekcije predmeta.
function initLandingSubjects() {
    const wrap = document.getElementById('landingSubjects');
    if (!wrap || wrap.dataset.bound === '1') return;
    wrap.dataset.bound = '1';
    wrap.addEventListener('click', (e) => {
        const card = e.target.closest('[data-landing-subject]');
        if (!card) return;
        navigateTo('lessons', { subject: card.dataset.landingSubject });
    });
}

// ========== LESSONS PAGE ==========
function renderLessonsPage(subjectId) {
    const subject = subjectDataMap[subjectId];
    if (!subject) return;

    document.getElementById('currentSubjectTitle').textContent = subject.name;
    document.getElementById('subjectDescription').textContent = subject.description;

    const grid = document.getElementById('lessonsGrid');
    grid.innerHTML = '';

    subject.lessons.forEach((lesson, index) => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        // Data-driven: lekcija bez mapiranja u catalog.content.resolve = coming soon.
        const isComingSoon = (typeof SokratCatalog !== 'undefined')
            ? SokratCatalog.isLessonComingSoon(subjectId, lesson.id)
            : (lesson.id === 'second-midterm');
        card.innerHTML = `
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-info">
                <h3>${lesson.name}</h3>
                <p>${lesson.description}</p>
            </div>
            <i class="fas fa-chevron-right lesson-arrow"></i>
        `;
        if (isComingSoon) {
            card.style.opacity = '0.65';
            card.style.cursor = 'not-allowed';
            card.querySelector('.lesson-arrow').className = 'fas fa-clock lesson-arrow';
            card.addEventListener('click', () => {
                showToast(window.t ? t('toast.comingSoon') : 'Second Midterm is coming soon.');
            });
        } else {
            card.addEventListener('click', () => {
                navigateTo('study', { subject: subjectId, lesson: lesson.id });
            });
        }
        grid.appendChild(card);
    });
}

// ========== STUDY PAGE INIT ==========
function showStudyLoading(on) {
    const el = document.getElementById('studyLoading');
    if (el) el.hidden = !on;
}

// Show/hide a paired (desktop + mobile) nav button.
function setNavButtonVisible(navId, mobileId, visible) {
    [navId, mobileId].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (visible) el.style.removeProperty('display');
        else el.style.display = 'none';
    });
}

// Data-driven optional sections: show a subject's special tabs based on its catalog
// `features` flags (e.g. blindMap for Geography, exercises for Accounting). Adding a
// flag in data/catalog.js is all it takes — no per-subject code here.
function applyFeatureNav(subjectId) {
    const subject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(subjectId) : null;
    const features = (subject && subject.features) || {};
    setNavButtonVisible('blindMapNavBtn', 'blindMapMobileBtn', !!features.blindMap);
    setNavButtonVisible('exercisesNavBtn', 'exercisesMobileBtn', !!features.exercises);
}

async function initStudyPage(subjectId, lessonId, targetSection) {
    const subject = subjectDataMap[subjectId];
    if (!subject) {
        console.error('Subject not found:', subjectId);
        return;
    }

    // Lazy-load kroz ContentRepository (S1, Faza 2): jedan poziv `loadLesson` objedini
    // učitavanje (catalog zna koje datoteke) + resolve u podatkovni objekt. Repo je šav
    // prema backendu/CRUD-u. FALLBACK na stari dvokorak ako Repo nije prisutan (skripta padne).
    let fullData = {};
    showStudyLoading(true);
    try {
        if (typeof SokratContent !== 'undefined' && SokratContent.loadLesson) {
            fullData = await SokratContent.loadLesson(subjectId, lessonId);
        } else {
            if (typeof loadSubjectContent === 'function') await loadSubjectContent(subjectId);
            fullData = getSubjectData(subjectId, lessonId);
        }
    } catch (e) {
        showStudyLoading(false);
        console.error(e);
        if (typeof showToast === 'function') showToast(window.t ? t('toast.loadError') : 'Could not load this subject. Please try again.');
        return;
    }
    showStudyLoading(false);

    const subjectLessonMap = lessonCategoryMap[subjectId];
    if (subjectLessonMap && subjectLessonMap[lessonId]) {
        const allowedCategories = subjectLessonMap[lessonId];
        const filteredData = {};
        for (const key of allowedCategories) {
            if (fullData[key]) {
                filteredData[key] = fullData[key];
            }
        }
        AppState.nav.data = filteredData;
    } else {
        AppState.nav.data = fullData;
    }

    const lessonsWord = window.t ? t('breadcrumb.lessons') : 'Lessons';
    document.getElementById('studyBreadcrumb').textContent = `${subject.shortName} > ${lessonsWord}`;
    document.getElementById('currentLessonTitle').textContent = subject.lessons.find(l => l.id === lessonId)?.name || (window.t ? t('lesson.fallback') : 'Lesson');

    loadProgress();
    loadAnalytics();

    initNavigation();
    updateCategoryButtons();
    updateLearnFilters();
    updateQuizCategories();
    initFlashcards();
    initFill();
    renderLearnContent();
    renderProgressPage();
    updateHomeStats();

    // Data-driven optional tabs (blind map, exercises, …) from catalog `features`.
    applyFeatureNav(subjectId);

    switchSection(targetSection || 'home');
}

// ========== SECTION SWITCHING ==========
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            syncMobileNav(section);
        });
    });

    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
            mobileNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            navBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.section === section);
            });
        });
    });
}

function syncMobileNav(section) {
    document.querySelectorAll('.mobile-nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.section === section);
    });
}

function switchSection(section) {
    if (!AppState.nav.subject) {
        showSubjectSelector();
        return;
    }

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    AppState.nav.section = section;

    document.querySelectorAll('.study-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
    document.querySelectorAll('.study-mobile-nav .mobile-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    saveCurrentPosition(AppState.nav.page, { subject: AppState.nav.subject, lesson: AppState.nav.lesson });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (section === 'flashcards') {
        initFlashcards();
    } else if (section === 'fill') {
        initFill();
    } else if (section === 'progress') {
        renderProgressPage();
    } else if (section === 'learn') {
        cleanupLearnContentForMobile();
    } else if (section === 'blind-map') {
        initBlindMap();
    } else if (section === 'exercises') {
        if (typeof initExercises === 'function') initExercises();
    }
}

// ========== ABOUT US ==========
function showAboutUs() {
    navigateTo('about');
}

function hideAboutUs() {
    navigateTo('landing');
}

// Legacy compatibility
function selectSubject(subject) {
    navigateTo('lessons', { subject: subject });
}

function showSubjectSelector() {
    navigateTo('landing');
}

// Global exports
window.selectSubject = selectSubject;
window.showSubjectSelector = showSubjectSelector;
window.showAboutUs = showAboutUs;
window.hideAboutUs = hideAboutUs;
window.navigateTo = navigateTo;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.switchSection = switchSection;
window.renderSubjectsSidebar = renderSubjectsSidebar;
window.renderBrowse = renderBrowse;
window.enterBrowse = enterBrowse;
window.browseBack = browseBack;
window.initBrowse = initBrowse;
window.renderLandingMeta = renderLandingMeta;
window.renderLandingSubjects = renderLandingSubjects;
window.initLandingSubjects = initLandingSubjects;
