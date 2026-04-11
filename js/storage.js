// ===== SOKRAT STUDY — PROGRESS STORAGE =====

function loadProgress() {
    if (!currentSubject) return;
    
    const storageKey = subjectDataMap[currentSubject].storageKey;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        progress = JSON.parse(saved);
    } else {
        progress = {
            flashcardsLearned: [],
            quizScores: [],
            fillSolved: 0,
            lastStudy: null,
            streak: 0,
            categoryProgress: {}
        };
    }
    
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
    if (!currentSubject) return;
    
    progress.lastStudy = new Date().toISOString();
    const storageKey = subjectDataMap[currentSubject].storageKey;
    localStorage.setItem(storageKey, JSON.stringify(progress));
    updateHomeStats();
}
