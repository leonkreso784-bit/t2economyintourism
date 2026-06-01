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
    renderSubjectsSidebar();   // build sidebar list from catalog BEFORE binding listeners
    initLearnImageModal();
    setupEventListeners();
    restoreLastPosition();
});

function setupEventListeners() {
    // Open Study button
    const openStudyBtn = document.getElementById('openStudyBtn');
    if (openStudyBtn) {
        openStudyBtn.addEventListener('click', openSidebar);
    }
    
    // Close sidebar
    const closeSidebarBtn = document.getElementById('closeSidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }
    
    // Overlay click closes sidebar
    const overlay = document.getElementById('subjectsOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Subject items in sidebar
    document.querySelectorAll('.subject-item').forEach(item => {
        item.addEventListener('click', () => {
            const subjectId = item.dataset.subject;
            navigateTo('lessons', { subject: subjectId });
        });
    });
    
    // Back buttons
    const backToLanding = document.getElementById('backToLanding');
    if (backToLanding) {
        backToLanding.addEventListener('click', () => navigateTo('landing'));
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
