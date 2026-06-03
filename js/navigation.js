// ===== SOKRAT STUDY — NAVIGATION =====

// ========== POSITION PERSISTENCE ==========
function saveCurrentPosition(page, data) {
    const position = {
        page: page,
        subject: data.subject || currentSubject,
        lesson: data.lesson || currentLesson,
        section: currentSection,
        category: currentCategory,
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
                    currentCategory = position.category || 'all';
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
function navigateTo(page, data = {}) {
    currentPage = page;
    saveCurrentPosition(page, data);

    document.querySelectorAll('.landing-page, .browse-page, .lessons-page, .study-page, .about-page').forEach(p => {
        p.classList.remove('active');
    });

    switch (page) {
        case 'landing':
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
                currentSubject = data.subject;
                renderLessonsPage(data.subject);
            }
            document.getElementById('lessons-page').classList.add('active');
            closeSidebar();
            break;
        case 'study':
            if (data.subject && data.lesson) {
                currentSubject = data.subject;
                currentLesson = data.lesson;
                initStudyPage(data.subject, data.lesson, data.section);
            }
            document.getElementById('study-page').classList.add('active');
            break;
        case 'about':
            document.getElementById('about-page').classList.add('active');
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

    list.innerHTML = SOKRAT_CATALOG.subjects.map((s) => {
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
    if (!fs.length) return browseEmpty('No faculties yet.');
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
    if (!ps.length) return browseEmpty('No programs yet.');
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
                    <span><i class="fas fa-calendar-days"></i> ${years} ${years === 1 ? 'year' : 'years'}</span>
                    <span><i class="fas fa-book"></i> ${subs} ${subs === 1 ? 'subject' : 'subjects'}</span>
                </div>
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
    }).join('') + `</div>`;
}

function renderYearCards(programId) {
    const years = SokratCatalog.yearsOf(programId);
    if (!years.length) return browseEmpty('No years yet.');
    const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
    return `<div class="browse-grid">` + years.map(y => {
        const subs = SokratCatalog.subjectsOf(programId, y).length;
        return `
            <button type="button" class="browse-card" data-browse="year" data-id="${y}">
                <div class="browse-card-top">
                    <div class="browse-card-icon is-year">${y}</div>
                    <div class="browse-card-headings">
                        <div class="browse-card-title">${ordinal[y] || (y + '.')} Year</div>
                        <div class="browse-card-sub">Study year ${y}</div>
                    </div>
                </div>
                <div class="browse-card-meta"><span><i class="fas fa-book"></i> ${subs} ${subs === 1 ? 'subject' : 'subjects'}</span></div>
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
                        <div class="browse-card-sub">${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}</div>
                    </div>
                </div>
                <div class="browse-card-desc">${browseEsc(s.description)}</div>
                ${progressHtml}
                <i class="fas fa-chevron-right browse-card-arrow"></i>
            </button>`;
}

function renderSubjectCards(programId, year) {
    const semesters = SokratCatalog.semestersOf(programId, year);
    if (!semesters.length) return browseEmpty('No subjects yet.');
    return semesters.map(sem => {
        const subs = SokratCatalog.subjectsOf(programId, year).filter(s => s.semester === sem);
        return `
            <section class="browse-section">
                <h2 class="browse-section-title">Semester ${sem}</h2>
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

    let html = '', title = '', trail = 'Browse', introText = '';

    if (browseState.level === 'programs') {
        const f = SokratCatalog.faculties().find(x => x.id === browseState.facultyId);
        title = 'Choose your program';
        trail = f ? f.name : 'Faculty';
        introText = 'Select your study program.';
        html = renderProgramCards(browseState.facultyId);
    } else if (browseState.level === 'years') {
        const p = SokratCatalog.getProgram(browseState.programId);
        title = 'Choose your year';
        trail = p ? p.name : 'Program';
        introText = 'Pick the study year you want to review.';
        html = renderYearCards(browseState.programId);
    } else if (browseState.level === 'subjects') {
        const p = SokratCatalog.getProgram(browseState.programId);
        title = `Year ${browseState.year} subjects`;
        trail = p ? `${p.name} · Year ${browseState.year}` : `Year ${browseState.year}`;
        introText = '';
        html = renderSubjectCards(browseState.programId, browseState.year);
    } else {
        // 'faculties' (default / entry)
        title = 'Choose your faculty';
        trail = 'Browse';
        introText = 'Select your faculty to find your subjects.';
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
    const count = SOKRAT_CATALOG.subjects.length;
    document.querySelectorAll('[data-meta="subjectCount"]').forEach((el) => {
        el.textContent = count;
    });
}

// ========== LANDING SUBJECTS SHOWCASE (rendered from catalog) ==========
function renderLandingSubjects() {
    const wrap = document.getElementById('landingSubjects');
    if (!wrap || typeof SOKRAT_CATALOG === 'undefined' || !Array.isArray(SOKRAT_CATALOG.subjects)) return;
    wrap.innerHTML = SOKRAT_CATALOG.subjects.map((s) => {
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
                    <p>Year ${browseEsc(s.year)} &middot; ${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}</p>
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
                showToast('Second Midterm is coming soon.');
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

async function initStudyPage(subjectId, lessonId, targetSection) {
    const subject = subjectDataMap[subjectId];
    if (!subject) {
        console.error('Subject not found:', subjectId);
        return;
    }

    // Lazy-load: dohvati sadržaj predmeta TEK sad (ako već nije učitan). Catalog zna
    // koje datoteke (subject.content.scripts). Šav prema backendu (kasnije fetch /api).
    if (typeof loadSubjectContent === 'function') {
        showStudyLoading(true);
        try {
            await loadSubjectContent(subjectId);
        } catch (e) {
            showStudyLoading(false);
            console.error(e);
            if (typeof showToast === 'function') showToast('Could not load this subject. Please try again.');
            return;
        }
        showStudyLoading(false);
    }

    let fullData = getSubjectData(subjectId, lessonId);

    const subjectLessonMap = lessonCategoryMap[subjectId];
    if (subjectLessonMap && subjectLessonMap[lessonId]) {
        const allowedCategories = subjectLessonMap[lessonId];
        const filteredData = {};
        for (const key of allowedCategories) {
            if (fullData[key]) {
                filteredData[key] = fullData[key];
            }
        }
        currentData = filteredData;
    } else {
        currentData = fullData;
    }

    document.getElementById('studyBreadcrumb').textContent = `${subject.shortName} > Lessons`;
    document.getElementById('currentLessonTitle').textContent = subject.lessons.find(l => l.id === lessonId)?.name || 'Lesson';

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

    // Show blind map button for Geography
    if (subjectId === 'geography') {
        document.getElementById('blindMapNavBtn')?.style.removeProperty('display');
        document.getElementById('blindMapMobileBtn')?.style.removeProperty('display');
    } else {
        const bmNav = document.getElementById('blindMapNavBtn');
        const bmMob = document.getElementById('blindMapMobileBtn');
        if (bmNav) bmNav.style.display = 'none';
        if (bmMob) bmMob.style.display = 'none';
    }

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
    if (!currentSubject) {
        showSubjectSelector();
        return;
    }

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    currentSection = section;

    document.querySelectorAll('.study-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
    document.querySelectorAll('.study-mobile-nav .mobile-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    saveCurrentPosition(currentPage, { subject: currentSubject, lesson: currentLesson });
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
