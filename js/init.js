// ===== SOKRAT STUDY — INITIALIZATION =====

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
    renderLandingMeta();       // keep landing counts in sync with the catalog
    renderCatalogPrograms();   // filter buttons, drawn FROM the catalog (never hardcoded)
    renderLandingSubjects();   // build landing subject showcase from catalog
    initLandingSubjects();     // bind showcase click + search + programme filter
    initBrowse();              // bind delegated click handler for the browse drill-down
    initMaterialsEntries();    // C0: ulazi u vlastiti materijal
    initTopbar();              // K2b: znak → dom, „Predmeti", natrag u drugom redu
    initRouter();              // K1: adresa ⇄ stranica; MORA prije restoreLastPosition()
    // `initLearnImageModal()` je odavde OTIŠAO u `initStudyPage`: `learn.js` od učitavanja po
    // ruti stiže s paketom `study`, a modal za sliku ionako nema što raditi dok lekcija nije
    // otvorena. Poziv je idempotentan, pa ponovni ulazak u lekciju ništa ne dupla.
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

    // K2a — svi gumbi „natrag" idu kroz JEDAN model (`goBack`): povijest kad iza nas stoji
    // naš unos, inače semantički roditelj koji zna i katalošku i osobnu hijerarhiju.
    // Dotad je svaki gumb nosio TVRDO ožičeno odredište, pa je vraćanje iz vlastitog
    // materijala završavalo na izboru fakulteta. ⚠️ `backToLanding` je usput ime koje LAŽE —
    // sjedi na stranici lekcija i nikad nije vodio na landing nego na browse; zadržano je
    // samo zato što je `id` u markupu, a mijenja ga tek cigla koja prepisuje zaglavlja (K2b).
    const backToLanding = document.getElementById('backToLanding');
    if (backToLanding) {
        backToLanding.addEventListener('click', () => goBack());
    }

    const backToLessons = document.getElementById('backToLessons');
    if (backToLessons) {
        backToLessons.addEventListener('click', () => goBack());
    }

    const backFromAbout = document.getElementById('backFromAbout');
    if (backFromAbout) {
        backFromAbout.addEventListener('click', () => goBack());
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
