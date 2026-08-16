// ===== SOKRAT STUDY — INITIALIZATION =====

// ========== THEME ==========
// C2: zadana tema je „Akademsko plavo" (svijetla) — v. `css/tokens.css`.
//
// Prije je ovdje stajalo tvrdo `setAttribute('data-theme','dark')` uz `toggleTheme()`
// koji je pisao `light` — temu koja u CSS-u NIJE POSTOJALA. Prekidač je dakle vodio u
// prazno, a `dark` je bio jedini stvarni ishod. Sada su teme prave, pa i ovo mora biti.
//
// ⚠️ Vrijednost se PROVJERAVA prema popisu: nepoznat `data-theme` (npr. zaostali `dark`
// iz localStoragea nekog starog posjetitelja) ne bi pogodio nijedan token-blok, ali BI
// aktivirao 21 legacy pravilo koje selektira `[data-theme="dark"]` → bijeli tekst na
// svijetloj podlozi. Zato se nepoznata vrijednost odbacuje, a ne propušta.
const SOKRAT_THEMES = ['academic', 'paper', 'chalk', 'mint'];
const SOKRAT_THEME_DEFAULT = 'academic';

function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('sokrat-theme'); } catch (e) { /* privatni način */ }
    const theme = SOKRAT_THEMES.indexOf(saved) >= 0 ? saved : SOKRAT_THEME_DEFAULT;
    document.documentElement.setAttribute('data-theme', theme);
    // `color-scheme` javlja pregledniku kakve da crta scrollbarove i zadana polja;
    // bez toga svijetla tema dobiva tamne native kontrole i obrnuto.
    document.documentElement.style.colorScheme = (theme === 'chalk' || theme === 'mint') ? 'dark' : 'light';
    try { localStorage.setItem('sokrat-theme', theme); } catch (e) { /* privatni način */ }
}

function setTheme(name) {
    if (SOKRAT_THEMES.indexOf(name) < 0) return false;
    try { localStorage.setItem('sokrat-theme', name); } catch (e) { /* privatni način */ }
    initTheme();
    return true;
}
window.setTheme = setTheme;
window.SOKRAT_THEMES = SOKRAT_THEMES;

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderLandingMeta();       // keep landing counts in sync with the catalog
    renderLandingSubjects();   // build landing subject showcase from catalog
    initLandingSubjects();     // bind showcase click → lessons
    renderSubjectsSidebar();   // build sidebar list from catalog BEFORE binding listeners
    initBrowse();              // bind delegated click handler for the browse drill-down
    initMaterialsEntries();    // C0: ulazi u vlastiti materijal + ruta #/materials
    initLearnImageModal();
    setupEventListeners();
    restoreLastPosition();
});

function setupEventListeners() {
    // All "Start studying" triggers (nav, hero, final CTA, footer) → drill-down browse
    document.querySelectorAll('.start-trigger').forEach((btn) => {
        btn.addEventListener('click', enterBrowse);
    });

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
        backToLessons.addEventListener('click', () => navigateTo('lessons', { subject: AppState.nav.subject }));
    }
    
    const backFromAbout = document.getElementById('backFromAbout');
    if (backFromAbout) {
        backFromAbout.addEventListener('click', () => navigateTo('landing'));
    }
    
    // Birač teme. `.theme-toggle` NE POSTOJI u markupu — ostaje samo vezanje, da
    // ga cigla koja doda gumb ne mora tražiti. `data-set-theme="paper"` na elementu
    // bira temu izravno; bez atributa se cikliraju sve četiri.
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const want = btn.dataset.setTheme;
            if (want) { setTheme(want); return; }
            const now = document.documentElement.getAttribute('data-theme');
            const i = SOKRAT_THEMES.indexOf(now);
            setTheme(SOKRAT_THEMES[(i + 1) % SOKRAT_THEMES.length]);
        });
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
