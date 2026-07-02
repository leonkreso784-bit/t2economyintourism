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

    const storageKey = subjectDataMap[AppState.nav.subject].storageKey;
    const saved = localStorage.getItem(storageKey);
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
    if (!AppState.nav.subject) return;

    progress.lastStudy = new Date().toISOString();
    const storageKey = subjectDataMap[AppState.nav.subject].storageKey;
    localStorage.setItem(storageKey, JSON.stringify(progress));
    updateHomeStats();
}
