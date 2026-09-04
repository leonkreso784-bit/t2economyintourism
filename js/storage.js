// ===== SOKRAT STUDY — PROGRESS STORAGE =====

function loadProgress() {
    if (!AppState.nav.subject) return;

    // Kanonska shema napretka — svako polje uvijek postoji (otpornost na stari/pokvaren localStorage).
    const defaultProgress = {
        flashcardsLearned: [],
        quizScores: [],
        fillSolved: 0,
        lastStudy: null,
        streak: 0,
        categoryProgress: {}
    };

    // BUG-023: nepoznat subjekt (npr. materijal koji još nije registriran) → ostani na
    // defaultima umjesto da pukneš. Napredak se ionako nema odakle učitati.
    const storageKey = currentStorageKey();
    const saved = storageKey ? localStorage.getItem(storageKey) : null;
    let parsed = null;
    if (saved) {
        try { parsed = JSON.parse(saved); } catch (e) { parsed = null; }  // pokvaren JSON → default
    }
    // Schema-merge: defaulti + spremljeno → polje koje fali u starom zapisu dobije default.
    progress = Object.assign({}, defaultProgress, (parsed && typeof parsed === 'object') ? parsed : {});

    // Check streak
    if (progress.lastStudy) {
        const lastDate = new Date(progress.lastStudy).toDateString();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastDate === yesterday) {
            progress.streak++;
        } else if (lastDate !== today) {
            progress.streak = 0;
        }
    }
}

function saveProgress() {
    // BUG-023: `null` znači „nema kamo pisati" (nepoznat subjekt) — tiho ne radi ništa.
    const storageKey = currentStorageKey();
    if (!storageKey) return;

    progress.lastStudy = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(progress));
    // `updateHomeStats` živi u `js/progress.js`, koji od učitavanja po ruti stiže s paketom
    // `study`. Napredak se spremi i bez njega (npr. sinkronizacija dok je otvoren landing) —
    // ono što bi osvježio tada nije ni na ekranu.
    if (typeof updateHomeStats === 'function') updateHomeStats();
}
