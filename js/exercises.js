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

    // ========================================================================
    // WIDGET REGISTRY — po tipu vježbe: render(ex) → html, collect(ex, root) →
    // answers (predaje se čistom graderu u ExercisesCore), opc. mark(ex, root, result).
    // Dodavanje novog tipa = novi unos ovdje + grader u jezgri (NULA promjena drugdje).
    // ========================================================================
    const Core = (typeof window !== 'undefined' && window.ExercisesCore) || {};

    const WIDGETS = {
        // --- choice: True/False + Multiple Choice -----------------------------
        choice: {
            grader: 'gradeChoice',
            render(ex) {
                const items = Array.isArray(ex.items) ? ex.items : [];
                return '<div class="ex-choice">' + items.map((item, i) => {
                    const opts = (item.kind === 'tf')
                        ? [['true', 'True'], ['false', 'False']]
                        : (item.options || []).map((o, idx) => [String(idx), o]);
                    const optsHtml = opts.map(([val, label]) =>
                        '<button type="button" class="ex-opt" data-val="' + esc(val) + '">' + esc(label) + '</button>'
                    ).join('');
                    return '<div class="ex-choice-item" data-item="' + i + '">'
                        + '<div class="ex-choice-q">' + (i + 1) + '. ' + esc(item.q) + '</div>'
                        + '<div class="ex-choice-options">' + optsHtml + '</div>'
                        + '</div>';
                }).join('') + '</div>';
            },
            collect(ex, root) {
                const items = Array.isArray(ex.items) ? ex.items : [];
                return items.map((item, i) => {
                    const group = root.querySelector('.ex-choice-item[data-item="' + i + '"]');
                    const sel = group && group.querySelector('.ex-opt.selected');
                    if (!sel) return null;
                    const val = sel.getAttribute('data-val');
                    return (item.kind === 'tf') ? (val === 'true') : Number(val);
                });
            },
            mark(ex, root, result) {
                const items = Array.isArray(ex.items) ? ex.items : [];
                items.forEach((item, i) => {
                    const group = root.querySelector('.ex-choice-item[data-item="' + i + '"]');
                    if (!group) return;
                    const ok = result.perField[i] && result.perField[i].ok;
                    group.querySelectorAll('.ex-opt').forEach((btn) => {
                        btn.classList.remove('is-correct', 'is-incorrect');
                        const val = btn.getAttribute('data-val');
                        const isCorrectOpt = (item.kind === 'tf')
                            ? ((val === 'true') === item.answer)
                            : (Number(val) === item.answer);
                        if (isCorrectOpt) btn.classList.add('is-correct');
                        if (btn.classList.contains('selected') && !ok) btn.classList.add('is-incorrect');
                    });
                });
            }
        },

        // --- numeric: jedan ili više brojčanih unosa (jedinice, hint) ---------
        numeric: {
            grader: 'gradeNumeric',
            render(ex, opts) {
                const mode = (opts && opts.mode) || 'practice';
                const showHints = mode !== 'exam'; // exam = bez hintova
                const fields = Array.isArray(ex.fields) ? ex.fields : [];
                return '<div class="ex-fields">' + fields.map((f) => {
                    const unit = f.unit ? ' <span class="ex-unit">(' + esc(f.unit) + ')</span>' : '';
                    return '<div class="ex-field">'
                        + '<label for="exf-' + esc(f.key) + '">' + esc(f.label) + unit + '</label>'
                        + '<input class="ex-input" id="exf-' + esc(f.key) + '" data-key="' + esc(f.key) + '"'
                        + ' type="text" inputmode="decimal" autocomplete="off" spellcheck="false">'
                        + (showHints && f.hint ? '<div class="ex-hint">' + esc(f.hint) + '</div>' : '')
                        + '</div>';
                }).join('') + '</div>';
            },
            collect(ex, root) {
                const fields = Array.isArray(ex.fields) ? ex.fields : [];
                const out = {};
                fields.forEach((f) => {
                    const el = root.querySelector('.ex-input[data-key="' + f.key + '"]');
                    out[f.key] = el ? el.value : '';
                });
                return out;
            },
            mark(ex, root, result) {
                result.perField.forEach((pf) => {
                    const el = root.querySelector('.ex-input[data-key="' + pf.key + '"]');
                    if (!el) return;
                    el.classList.remove('is-correct', 'is-incorrect');
                    el.classList.add(pf.ok ? 'is-correct' : 'is-incorrect');
                });
            }
        },

        // --- ratio: prikaže "givens" tablicu + brojčana polja (grading = numeric) ---
        ratio: {
            grader: 'gradeNumeric',
            render(ex, opts) {
                const rows = normalizeGivens(ex.givens);
                const givensHtml = rows.length
                    ? '<div class="ex-table-wrap"><table class="ex-table"><thead><tr><th>Given</th><th>Value</th></tr></thead><tbody>'
                        + rows.map((r) => '<tr><td>' + esc(r.label) + '</td><td>' + esc(formatGiven(r.value)) + '</td></tr>').join('')
                        + '</tbody></table></div>'
                    : '';
                return givensHtml + WIDGETS.numeric.render(ex, opts);
            },
            collect(ex, root) { return WIDGETS.numeric.collect(ex, root); },
            mark(ex, root, result) { return WIDGETS.numeric.mark(ex, root, result); }
        },

        // --- statement: financial statement build (sekcije/linije/totali) -----
        statement: {
            grader: 'gradeStatement',
            render(ex) {
                const sections = Array.isArray(ex.sections) ? ex.sections : [];
                const totals = Array.isArray(ex.totals) ? ex.totals : [];
                const row = (key, label, isTotal) =>
                    '<div class="ex-st-row' + (isTotal ? ' is-total' : '') + '">'
                    + '<span class="ex-st-label">' + esc(label) + '</span>'
                    + '<input class="ex-input ex-st-input" data-key="' + esc(key) + '"'
                    + ' type="text" inputmode="decimal" autocomplete="off" spellcheck="false">'
                    + '</div>';
                let html = '<div class="ex-statement">';
                sections.forEach((sec, si) => {
                    html += '<div class="ex-st-section">';
                    if (sec.label) html += '<div class="ex-st-section-title">' + esc(sec.label) + '</div>';
                    (sec.lines || []).forEach((line, li) => {
                        html += row(line.key || ('s' + si + '-l' + li), line.label, false);
                    });
                    html += '</div>';
                });
                totals.forEach((t, ti) => { html += row(t.key || ('t' + ti), t.label, true); });
                html += '</div>';
                return html;
            },
            collect(ex, root) {
                const out = {};
                root.querySelectorAll('.ex-st-input').forEach((el) => {
                    out[el.getAttribute('data-key')] = el.value;
                });
                return out;
            },
            mark(ex, root, result) {
                result.perField.forEach((pf) => {
                    const el = root.querySelector('.ex-st-input[data-key="' + pf.key + '"]');
                    if (!el) return;
                    el.classList.remove('is-correct', 'is-incorrect');
                    el.classList.add(pf.ok ? 'is-correct' : 'is-incorrect');
                });
            }
        },

        // --- classify: zadani račun → odaberi klasu + efekt (I/D) -------------
        classify: {
            grader: 'gradeClassify',
            render(ex) {
                const classes = normalizeOptions(ex.classes);
                const effects = normalizeOptions(ex.effects);
                const sel = (kind, opts) =>
                    '<select class="ex-select ex-cl-select" data-kind="' + kind + '">'
                    + '<option value="">—</option>'
                    + opts.map((o) => '<option value="' + esc(o.v) + '">' + esc(o.label) + '</option>').join('')
                    + '</select>';
                const rows = Array.isArray(ex.rows) ? ex.rows : [];
                return '<div class="ex-classify">' + rows.map((row, ri) => {
                    const entriesHtml = (row.entries || []).map((entry, ei) =>
                        '<div class="ex-cl-entry" data-row="' + ri + '" data-entry="' + ei + '">'
                        + '<span class="ex-cl-account">' + esc(entry.account) + '</span>'
                        + '<div class="ex-cl-selects">' + sel('cls', classes) + sel('effect', effects) + '</div>'
                        + '</div>'
                    ).join('');
                    return '<div class="ex-cl-row">'
                        + '<div class="ex-cl-text">' + (ri + 1) + '. ' + esc(row.text) + '</div>'
                        + entriesHtml + '</div>';
                }).join('') + '</div>';
            },
            collect(ex, root) {
                const rows = Array.isArray(ex.rows) ? ex.rows : [];
                return rows.map((row, ri) => (row.entries || []).map((entry, ei) => {
                    const el = root.querySelector('.ex-cl-entry[data-row="' + ri + '"][data-entry="' + ei + '"]');
                    const cls = el && el.querySelector('.ex-cl-select[data-kind="cls"]');
                    const eff = el && el.querySelector('.ex-cl-select[data-kind="effect"]');
                    return {
                        cls: cls && cls.value ? cls.value : null,
                        effect: eff && eff.value ? eff.value : null
                    };
                }));
            },
            mark(ex, root, result) {
                result.perField.forEach((pf) => {
                    const el = root.querySelector('.ex-cl-entry[data-row="' + pf.row + '"][data-entry="' + pf.entry + '"]');
                    if (!el) return;
                    el.classList.remove('is-correct', 'is-incorrect');
                    el.classList.add(pf.ok ? 'is-correct' : 'is-incorrect');
                });
            }
        }
    };

    // Opcije dropdowna: string → {v,label}; ili {v|value, label} → normalizirano.
    function normalizeOptions(arr) {
        if (!Array.isArray(arr)) return [];
        return arr.map((o) => {
            if (o && typeof o === 'object') {
                const v = o.v != null ? o.v : o.value;
                return { v: String(v), label: String(o.label != null ? o.label : v) };
            }
            return { v: String(o), label: String(o) };
        });
    }

    // "givens" može biti objekt {key:value} ili niz [{label,value}] → normaliziraj.
    function normalizeGivens(givens) {
        if (Array.isArray(givens)) return givens.filter((g) => g && g.label != null);
        if (givens && typeof givens === 'object') {
            return Object.keys(givens).map((k) => ({ label: k, value: givens[k] }));
        }
        return [];
    }

    function formatGiven(v) {
        if (typeof v === 'number' && Core.formatAmount) {
            return Core.formatAmount(v, { decimals: Number.isInteger(v) ? 0 : 2 });
        }
        return v == null ? '' : String(v);
    }

    // Trenutno otvorena vježba (za "Check") + aktivni mod + seed/raw za randomizaciju.
    let openEx = null;     // RIJEŠENA vježba (konkretni brojevi/odgovori)
    let openRaw = null;    // originalna definicija (za "New numbers")
    let currentSeed = 0;
    let currentMode = 'practice';
    const MODES = [['practice', 'Practice'], ['exam', 'Exam'], ['walkthrough', 'Walkthrough']];

    // Randomizirana vježba ima generate(p): engine izvuče parametre (pickParams, deterministički
    // po seedu) pa spoji generirani payload (prompt/fields/givens + odgovori) preko definicije.
    function isRandomized(ex) { return !!(ex && typeof ex.generate === 'function'); }
    function resolveExercise(ex, seed) {
        if (!isRandomized(ex)) return ex;
        try {
            const p = (Core.pickParams ? Core.pickParams(ex.params || {}, seed) : {});
            const dynamic = ex.generate(p) || {};
            return Object.assign({}, ex, dynamic);
        } catch (e) { return ex; }
    }
    function newSeed() { return Math.floor(Math.random() * 1e9); }

    function modeBar() {
        return '<div class="ex-modes">' + MODES.map((m) =>
            '<button type="button" class="ex-mode-btn' + (m[0] === currentMode ? ' active' : '') + '" data-ex-mode="' + m[0] + '">'
            + esc(m[1]) + '</button>'
        ).join('') + '</div>';
    }

    // walkthrough: prikaže korake rješenja (solution[]), bez unosa.
    function renderSolution(ex) {
        const steps = Array.isArray(ex.solution) ? ex.solution : [];
        if (!steps.length) return '<div class="ex-feedback">No worked solution is provided for this exercise.</div>';
        return '<div class="ex-solution"><strong>Worked solution</strong><ol>'
            + steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol></div>';
    }

    function notReadyBody(ex) {
        return '<div class="ex-feedback">This exercise type (&ldquo;' + esc(ex.type || '?')
            + '&rdquo;) is not interactive yet — coming in a later build step.</div>';
    }

    // Tijelo widgeta ovisno o modu (walkthrough = rješenje; ostalo = interaktivni tip).
    function openBody(ex) {
        if (currentMode === 'walkthrough') return renderSolution(ex);
        const widget = WIDGETS[ex.type];
        return widget ? widget.render(ex, { mode: currentMode }) : notReadyBody(ex);
    }

    function widgetShell(ex) {
        const widget = WIDGETS[ex.type];
        const interactive = !!widget && currentMode !== 'walkthrough';
        return ''
            + '<div class="ex-widget">'
            + '  <div class="ex-actions" style="margin-top:0;margin-bottom:1rem;">'
            + '    <button type="button" class="ex-btn ex-btn-ghost" data-ex-back="1"><i class="fas fa-arrow-left"></i> Back</button>'
            + '  </div>'
            + '  <h2 class="ex-card-title" style="font-size:1.15rem;margin-bottom:0.5rem;">' + esc(ex.title || ex.id) + '</h2>'
            + (ex.prompt ? '<div class="ex-prompt">' + esc(ex.prompt) + '</div>' : '')
            + modeBar()
            + '  <div class="ex-body">' + openBody(ex) + '</div>'
            + (interactive
                ? '<div class="ex-actions">'
                    + '<button type="button" class="ex-btn ex-btn-primary" data-ex-check="1"><i class="fas fa-check"></i> Check</button>'
                    + (isRandomized(ex) ? '<button type="button" class="ex-btn ex-btn-ghost" data-ex-new="1"><i class="fas fa-dice"></i> New numbers</button>' : '')
                    + '</div>'
                : '')
            + '  <div class="ex-feedback-host"></div>'
            + '</div>';
    }

    // Otvori jednu vježbu (uvijek kreni u practice modu; randomizirane dobiju novi seed).
    function openExercise(id) {
        const host = document.getElementById('exercisesContent');
        const data = getExerciseData();
        if (!host || !data) return;
        const raw = data.exercises.find((e) => e.id === id);
        if (!raw) return;
        openRaw = raw;
        currentMode = 'practice';
        currentSeed = newSeed();
        openEx = resolveExercise(raw, currentSeed);
        host.innerHTML = widgetShell(openEx);
    }

    // Promjena moda unutar otvorene vježbe → ponovno iscrtaj shell (isti brojevi, čisti unos).
    function setMode(mode) {
        if (!openEx || mode === currentMode) return;
        currentMode = mode;
        const host = document.getElementById('exercisesContent');
        if (host) host.innerHTML = widgetShell(openEx);
    }

    // "New numbers": novi seed → ponovno generiraj randomiziranu vježbu.
    function newNumbers() {
        if (!openRaw || !isRandomized(openRaw)) return;
        currentSeed = newSeed();
        openEx = resolveExercise(openRaw, currentSeed);
        const host = document.getElementById('exercisesContent');
        if (host) host.innerHTML = widgetShell(openEx);
    }

    // Odaberi opciju unutar grupe (samo jedna aktivna po stavci).
    function selectOption(optBtn) {
        const group = optBtn.closest('.ex-choice-item');
        if (group) group.querySelectorAll('.ex-opt').forEach((b) => b.classList.remove('selected'));
        optBtn.classList.add('selected');
    }

    function renderFeedback(host, result) {
        const fb = host.querySelector('.ex-feedback-host');
        if (!fb) return;
        const cls = result.correct ? 'is-correct' : 'is-incorrect';
        const icon = result.correct ? 'fa-circle-check' : 'fa-circle-xmark';
        const pct = result.max ? Math.round((result.score / result.max) * 100) : 0;
        const msg = result.correct
            ? 'Correct — all answers right! (100%)'
            : ('Score: ' + result.score + ' / ' + result.max + ' (' + pct + '%). Review the highlighted answers.');
        fb.innerHTML = '<div class="ex-feedback ' + cls + '"><i class="fas ' + icon + '"></i> ' + esc(msg) + '</div>';
    }

    function saveProgress(id, result) {
        try {
            const key = currentSubject + '-exercises-progress';
            const prog = readProgress();
            const prev = prog[id] || { attempts: 0, best: 0, done: false };
            const ratio = result.max ? result.score / result.max : 0;
            prog[id] = {
                done: !!(result.correct || prev.done),
                best: Math.max(prev.best || 0, ratio),
                attempts: (prev.attempts || 0) + 1,
                lastTs: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(prog));
        } catch (e) { /* storage off → preskoči */ }
    }

    // "Check": skupi unos iz DOM-a → čisti grader iz jezgre → feedback + napredak.
    function checkOpen() {
        if (!openEx) return;
        const widget = WIDGETS[openEx.type];
        const grader = widget && Core[widget.grader];
        const host = document.getElementById('exercisesContent');
        const root = host && host.querySelector('.ex-body');
        if (!widget || typeof grader !== 'function' || !root) return;

        const answers = widget.collect(openEx, root);
        const result = grader(openEx, answers);
        if (typeof widget.mark === 'function') widget.mark(openEx, root, result);
        renderFeedback(host, result);
        saveProgress(openEx.id, result);
    }

    // Delegirani click na cijelu sekciju (veže se jednom).
    function bindOnce() {
        const section = document.getElementById('exercises');
        if (!section || section.dataset.exBound === '1') return;
        section.dataset.exBound = '1';
        section.addEventListener('click', (e) => {
            if (e.target.closest('[data-ex-back]')) { openEx = null; renderList(); return; }
            const modeBtn = e.target.closest('[data-ex-mode]');
            if (modeBtn) { setMode(modeBtn.getAttribute('data-ex-mode')); return; }
            if (e.target.closest('[data-ex-new]')) { newNumbers(); return; }
            if (e.target.closest('[data-ex-check]')) { checkOpen(); return; }
            const opt = e.target.closest('.ex-opt');
            if (opt) { selectOption(opt); return; }
            const card = e.target.closest('.ex-card');
            if (card) openExercise(card.getAttribute('data-ex-id'));
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
