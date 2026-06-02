// ===== SOKRAT STUDY — INITIALIZATION =====

// ========== THEME ==========
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sokrat-theme', 'dark');
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sokrat-theme', next);
}

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderLandingMeta();       // keep landing counts in sync with the catalog
    renderSubjectsSidebar();   // build sidebar list from catalog BEFORE binding listeners
    initBrowse();              // bind delegated click handler for the browse drill-down
    initLearnImageModal();
    setupEventListeners();
    restoreLastPosition();
});

function setupEventListeners() {
    // Open Study button → drill-down browse (Faculty → Program → Year → Subject)
    const openStudyBtn = document.getElementById('openStudyBtn');
    if (openStudyBtn) {
        openStudyBtn.addEventListener('click', enterBrowse);
    }

    // Browse page back button (steps back through the drill-down, then to landing)
    const backFromBrowse = document.getElementById('backFromBrowse');
    if (backFromBrowse) {
        backFromBrowse.addEventListener('click', browseBack);
    }

    // Close sidebar (legacy slide-in panel; kept as harmless fallback)
    const closeSidebarBtn = document.getElementById('closeSidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    // Overlay click closes sidebar
    const overlay = document.getElementById('subjectsOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Subject items in sidebar (legacy)
    document.querySelectorAll('.subject-item').forEach(item => {
        item.addEventListener('click', () => {
            const subjectId = item.dataset.subject;
            navigateTo('lessons', { subject: subjectId });
        });
    });

    // Back buttons — from Lessons, return to the browse subject list (preserves
    // the drill-down position: Subject ← Subjects ← Year ← Program ← Faculty).
    const backToLanding = document.getElementById('backToLanding');
    if (backToLanding) {
        backToLanding.addEventListener('click', () => navigateTo('browse'));
    }
    
    const backToLessons = document.getElementById('backToLessons');
    if (backToLessons) {
        backToLessons.addEventListener('click', () => navigateTo('lessons', { subject: currentSubject }));
    }
    
    const backFromAbout = document.getElementById('backFromAbout');
    if (backFromAbout) {
        backFromAbout.addEventListener('click', () => navigateTo('landing'));
    }
    
    // Theme toggles
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
    
    // Study nav buttons
    document.querySelectorAll('.study-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
    
    // Mobile nav buttons in study page
    document.querySelectorAll('.study-mobile-nav .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
}
