// ===== SOKRAT STUDY — EXERCISES (DOM / UI engine) =====
//
// Subject-agnostic UI za interaktivne vježbe. NE sadrži domenske podatke — čita ih iz
// content packa `window[subject.content.exercises]` (npr. window.accountingExercises).
// Čista mehanika (parsiranje/usporedba/ocjena) je u js/exercises-core.js (ExercisesCore).
//
// B0.6 doseg: initExercises() → renderira LISTU kartica (naslov + status) za trenutnu
// lekciju, prazno stanje ako nema vježbi, klik otvara (zasad) widget shell.
// Rendereri po tipu (choice/numeric/ratio/statement/classify/journal) dolaze u FAZI 1.

(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Content pack za trenutni predmet: { meta, exercises:[…] } ili null.
    function getExerciseData() {
        if (typeof SokratCatalog === 'undefined' || typeof currentSubject === 'undefined' || !currentSubject) return null;
        const subject = SokratCatalog.getSubject(currentSubject);
        const varName = subject && subject.content && subject.content.exercises;
        if (!varName || typeof window === 'undefined') return null;
        const data = window[varName];
        return (data && Array.isArray(data.exercises)) ? data : null;
    }

    // Vježbe vezane na trenutnu lekciju (bez `lesson` polja = prikaži uvijek).
    function exercisesForLesson(data) {
        if (!data) return [];
        return data.exercises.filter((ex) => !ex.lesson || ex.lesson === currentLesson);
    }

    // Napredak po vježbi: { <id>: { done, best, attempts, lastTs } } (B1.8 ga proširuje).
    function readProgress() {
        try {
            const raw = localStorage.getItem(currentSubject + '-exercises-progress');
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function emptyState() {
        return '<div class="ex-empty"><i class="fas fa-pen-ruler"></i>'
            + '<p>No exercises yet for this lesson.</p></div>';
    }

    function renderList() {
        const host = document.getElementById('exercisesContent');
        if (!host) return;
        const list = exercisesForLesson(getExerciseData());
        if (!list.length) { host.innerHTML = emptyState(); return; }

        const prog = readProgress();
        host.innerHTML = '<div class="ex-list">' + list.map((ex) => {
            const done = !!(prog[ex.id] && prog[ex.id].done);
            const tags = [ex.type, ex.chapter ? ('Ch ' + ex.chapter) : null].filter(Boolean);
            return ''
                + '<div class="ex-card" data-ex-id="' + esc(ex.id) + '">'
                + '  <div class="ex-card-top">'
                + '    <span class="ex-card-title">' + esc(ex.title || ex.id) + '</span>'
                + '    <span class="ex-card-status ' + (done ? 'is-done' : 'is-todo') + '">'
                + '      <i class="fas ' + (done ? 'fa-circle-check' : 'fa-circle') + '"></i>'
                + '    </span>'
                + '  </div>'
                + '  <div class="ex-card-tags">' + tags.map((t) => '<span class="ex-tag">' + esc(t) + '</span>').join('') + '</div>'
                + '</div>';
        }).join('') + '</div>';
    }

    // Otvori jednu vježbu — zasad samo shell (interaktivni rendereri dolaze u FAZI 1).
    function openExercise(id) {
        const host = document.getElementById('exercisesContent');
        const data = getExerciseData();
        if (!host || !data) return;
        const ex = data.exercises.find((e) => e.id === id);
        if (!ex) return;
        host.innerHTML = ''
            + '<div class="ex-widget">'
            + '  <div class="ex-actions" style="margin-top:0;margin-bottom:1rem;">'
            + '    <button type="button" class="ex-btn ex-btn-ghost" data-ex-back="1"><i class="fas fa-arrow-left"></i> Back</button>'
            + '  </div>'
            + '  <h2 class="ex-card-title" style="font-size:1.15rem;margin-bottom:0.5rem;">' + esc(ex.title || ex.id) + '</h2>'
            + '  <div class="ex-prompt">' + esc(ex.prompt || '') + '</div>'
            + '  <div class="ex-feedback">This exercise type (&ldquo;' + esc(ex.type || '?') + '&rdquo;) is not interactive yet — coming in the next build step.</div>'
            + '</div>';
    }

    // Delegirani click na cijelu sekciju (veže se jednom).
    function bindOnce() {
        const section = document.getElementById('exercises');
        if (!section || section.dataset.exBound === '1') return;
        section.dataset.exBound = '1';
        section.addEventListener('click', (e) => {
            if (e.target.closest('[data-ex-back]')) { renderList(); return; }
            const card = e.target.closest('.ex-card');
            if (card) openExercise(card.dataset.exId);
        });
    }

    function initExercises() {
        bindOnce();
        renderList();
    }

    if (typeof window !== 'undefined') {
        window.initExercises = initExercises;
    }
})();
