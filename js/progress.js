// ===== SOKRAT STUDY — PROGRESS & HOME STATS =====

// ========== CATEGORY BUTTONS ==========
function updateCategoryButtons() {
    const container = document.querySelector('.categories');
    const content = AppState.nav.data;
    if (!container || !content) return;

    container.innerHTML = '';

    getCategories(content).forEach(category => {
        const data = content[category];
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.category = category;
        btn.innerHTML = `
            <i class="fas ${data.icon}"></i>
            <span>${data.name}</span>
            <small>${data.flashcards ? data.flashcards.length : 0} terms</small>
        `;
        btn.addEventListener('click', () => {
            AppState.nav.category = category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast(`Category: ${data.name}`);
        });
        container.appendChild(btn);
    });
}

// ========== LEARN FILTERS ==========
function updateLearnFilters() {
    const container = document.querySelector('.learn-filter');
    const content = AppState.nav.data;
    if (!container || !content) return;

    container.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';

    getCategories(content).forEach(category => {
        const data = content[category];
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = category;
        // Puni naziv kategorije. Bar je overflow-x:auto + nowrap → dugi/višerječni
        // nazivi samo skrolaju vodoravno, ne lome layout. (Prije: skraćivanje na ~10
        // znakova davalo nečitljive čipove npr. "The Product" → "The".)
        btn.textContent = data.name;
        container.appendChild(btn);
    });
    
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.learn-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Scroll afordancije (BUG-007): vidljiv scrollbar + rubni fade; poravnanje lijevo kad bar prelazi.
    updateLearnFilterScrollHints();
    if (!container.dataset.scrollHintsBound) {
        container.dataset.scrollHintsBound = '1';
        container.addEventListener('scroll', updateLearnFilterScrollHints, { passive: true });
        // ResizeObserver hvata i prijelaz iz skrivenog (display:none) u vidljivo (mjere postanu stvarne).
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(updateLearnFilterScrollHints).observe(container);
        } else {
            window.addEventListener('resize', updateLearnFilterScrollHints, { passive: true });
        }
    }
}

// Naznake skrola za learn filter-bar (BUG-007): koja strana ima još čipova izvan vidljivog.
// Postavlja klase is-scrollable / can-scroll-left / can-scroll-right (CSS: scrollbar + rubni fade).
function updateLearnFilterScrollHints() {
    const container = document.querySelector('.learn-filter');
    if (!container) return;
    const max = container.scrollWidth - container.clientWidth;
    const scrollable = max > 1;
    const x = container.scrollLeft;
    container.classList.toggle('is-scrollable', scrollable);
    container.classList.toggle('can-scroll-left', scrollable && x > 1);
    container.classList.toggle('can-scroll-right', scrollable && x < max - 1);
}

// ========== QUIZ CATEGORIES ==========
function updateQuizCategories() {
    const select = document.getElementById('quizCategory');
    const content = AppState.nav.data;
    if (!select || !content) return;

    select.innerHTML = '<option value="all">All Categories</option>';

    getCategories(content).forEach(category => {
        const data = content[category];
        const option = document.createElement('option');
        option.value = category;
        option.textContent = data.name;
        select.appendChild(option);
    });
}

// ========== PROGRESS PAGE ==========
function renderProgressPage() {
    const nav = AppState.nav;
    if (!nav.data) return;
    
    const totalFlashcards = getAllFlashcards().length;
    const learned = progress.flashcardsLearned.length;
    const overallPercent = Math.round((learned / totalFlashcards) * 100) || 0;
    
    document.getElementById('overallPercent').textContent = `${overallPercent}%`;
    document.getElementById('overallProgress').setAttribute('stroke-dasharray', `${overallPercent}, 100`);
    
    document.getElementById('flashcardsLearned').textContent = learned;
    document.getElementById('flashcardsTotal').textContent = totalFlashcards;
    document.getElementById('flashcardsProgress').style.width = `${overallPercent}%`;
    
    const avgScore = progress.quizScores.length > 0 
        ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
        : 0;
    document.getElementById('avgQuizScore').textContent = `${avgScore}%`;
    document.getElementById('totalQuizzes').textContent = progress.quizScores.length;
    
    const totalFills = AppState.fill.correct + AppState.fill.wrong;
    const fillAcc = totalFills > 0 ? Math.round((AppState.fill.correct / totalFills) * 100) : 0;
    document.getElementById('fillAccuracy').textContent = `${fillAcc}%`;
    document.getElementById('fillSolved').textContent = progress.fillSolved;
    
    // Geography-specific: Blind Map progress
    if (nav.subject === 'geography') {
        const bmSection = document.getElementById('blindMapProgressSection');
        if (bmSection) {
            bmSection.style.display = 'block';
            const bmAnswered = blindMapState.answers.length;
            const bmCorrect = blindMapState.answers.filter(a => a.correct).length;
            const bmAcc = bmAnswered > 0 ? Math.round((bmCorrect / bmAnswered) * 100) : 0;
            document.getElementById('blindMapAccuracy').textContent = `${bmAcc}%`;
            document.getElementById('blindMapAttempts').textContent = bmAnswered;
            document.getElementById('blindMapScore').textContent = blindMapState.score;
        }
    } else {
        const bmSection = document.getElementById('blindMapProgressSection');
        if (bmSection) bmSection.style.display = 'none';
    }

    // Exercises progress (subjects with features.exercises) — reads the same
    // localStorage key the Exercises tab writes (<subject>-exercises-progress).
    const exSection = document.getElementById('exercisesProgressSection');
    if (exSection) {
        const exSubject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(nav.subject) : null;
        const exVar = exSubject && exSubject.content && exSubject.content.exercises;
        const exData = (exVar && typeof window !== 'undefined') ? window[exVar] : null;
        const all = (exData && Array.isArray(exData.exercises)) ? exData.exercises : [];
        const list = all.filter((e) => !e.lesson || e.lesson === nav.lesson);
        if (list.length) {
            let store = {};
            try { store = JSON.parse(localStorage.getItem(nav.subject + '-exercises-progress') || '{}'); } catch (e) { store = {}; }
            let done = 0, attempts = 0, bestSum = 0;
            list.forEach((e) => {
                const p = store[e.id];
                if (p) { if (p.done) done++; attempts += (p.attempts || 0); bestSum += (p.best || 0); }
            });
            exSection.style.display = 'block';
            document.getElementById('exercisesDone').textContent = done;
            document.getElementById('exercisesTotal').textContent = list.length;
            document.getElementById('exercisesAttempts').textContent = attempts;
            document.getElementById('exercisesAvg').textContent = (list.length ? Math.round((bestSum / list.length) * 100) : 0) + '%';
        } else {
            exSection.style.display = 'none';
        }
    }

    const barsContainer = document.getElementById('categoryBars');
    if (!barsContainer || !nav.data) return;
    barsContainer.innerHTML = '';

    Object.keys(nav.data).forEach(category => {
        const data = nav.data[category];
        const catProgress = progress.categoryProgress[category] || 0;
        
        const bar = document.createElement('div');
        bar.className = 'category-bar';
        bar.innerHTML = `
            <i class="fas ${data.icon}" style="color: ${data.color}"></i>
            <div class="category-bar-info">
                <span>
                    <strong>${data.name}</strong>
                    <span>${catProgress}%</span>
                </span>
                <div class="mini-progress">
                    <div class="mini-fill" style="width: ${catProgress}%; background: ${data.color}"></div>
                </div>
            </div>
        `;
        barsContainer.appendChild(bar);
    });
}

// ========== HOME STATS ==========
function updateHomeStats() {
    const nav = AppState.nav;
    if (!nav.data) return;

    const totalQ = getAllFlashcards().length + Object.keys(nav.data).reduce((acc, cat) => acc + nav.data[cat].quiz.length, 0);
    document.getElementById('totalQuestions').textContent = `${totalQ}+`;

    document.getElementById('totalCategories').textContent = Object.keys(nav.data).length;

    const subtitle = document.getElementById('homeSubtitle');
    const meta = currentSubjectMeta();   // BUG-023: nepoznat subjekt → ostavi zatečen naslov
    if (subtitle && meta && meta.name) {
        const guide = (typeof t === 'function') ? t('home.guideTo') : 'Your interactive guide to';
        subtitle.textContent = `${guide} ${meta.name}`;
    }
    
    const bestScore = progress.quizScores.length > 0 ? Math.max(...progress.quizScores) : 0;
    document.getElementById('bestScore').textContent = `${bestScore}%`;
    
    document.getElementById('streak').textContent = progress.streak;
}

// ========== QUICK START FUNCTIONS ==========
window.startQuickQuiz = function() {
    document.getElementById('questionCount').value = '10';
    document.getElementById('quizCategory').value = 'all';
    switchSection('quiz');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="quiz"]').classList.add('active');
    startQuiz();
};

window.startFlashcards = function() {
    switchSection('flashcards');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="flashcards"]').classList.add('active');
};

window.startLearning = function() {
    switchSection('learn');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="learn"]').classList.add('active');
};
