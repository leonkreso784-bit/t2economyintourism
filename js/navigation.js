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
                    currentSection = position.section || 'home';
                    navigateTo('study', { subject: position.subject, lesson: position.lesson });
                    if (position.section && position.section !== 'home') {
                        setTimeout(() => {
                            if (typeof switchSection === 'function') {
                                switchSection(position.section);
                            }
                        }, 200);
                    }
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

    document.querySelectorAll('.landing-page, .lessons-page, .study-page, .about-page').forEach(p => {
        p.classList.remove('active');
    });

    switch (page) {
        case 'landing':
            document.getElementById('landing-page').classList.add('active');
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
                initStudyPage(data.subject, data.lesson);
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
        const isComingSoon = lesson.id === 'second-midterm';
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
function initStudyPage(subjectId, lessonId) {
    const subject = subjectDataMap[subjectId];
    if (!subject) {
        console.error('Subject not found:', subjectId);
        return;
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

    switchSection('home');
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
