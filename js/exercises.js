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
                const hasEffects = effects.length > 0;
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
                        + '<div class="ex-cl-selects">' + sel('cls', classes) + (hasEffects ? sel('effect', effects) : '') + '</div>'
                        + '</div>'
                    ).join('');
                    return '<div class="ex-cl-row">'
                        + (row.text ? '<div class="ex-cl-text">' + (ri + 1) + '. ' + esc(row.text) + '</div>' : '')
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
        },

        // --- journal: GUIDED (fiksne linije) ili FREE (slobodno, ocjena po saldima) ---
        journal: {
            render(ex) { return ex.free ? renderFreeJournal(ex) : renderGuidedJournal(ex); },
            collect(ex, root) {
                if (ex.free) return computeFreeRows(root);
                const trans = Array.isArray(ex.transactions) ? ex.transactions : [];
                return trans.map((t, ti) => (t.entries || []).map((e, li) => {
                    const ln = root.querySelector('.ex-jr-line[data-trans="' + ti + '"][data-line="' + li + '"]');
                    return readLine(ln);
                }));
            },
            grade(ex, answers) {
                if (ex.free) {
                    const entries = (answers || [])
                        .map((a) => ({ account: a.account, side: a.side, amount: Core.parseAmount(a.amount) }))
                        .filter((e) => e.account && (e.side === 'D' || e.side === 'C') && Number.isFinite(e.amount));
                    const K = (typeof window !== 'undefined' && window.AccKernel) || {};
                    return K.gradeEndingBalances
                        ? K.gradeEndingBalances(ex.beginningBalances || {}, entries, ex.chartOfAccounts || [], ex.expectedEndingBalances || {})
                        : { score: 0, max: 0, perField: [], correct: false };
                }
                return Core.gradeJournal ? Core.gradeJournal(ex, answers) : { score: 0, max: 0, perField: [], correct: false };
            },
            mark(ex, root, result) {
                if (ex.free) { updateLivePanel(root, ex); return; }
                result.perField.forEach((pf) => {
                    const block = root.querySelector('.ex-jr-trans[data-trans="' + pf.index + '"]');
                    if (!block) return;
                    block.classList.remove('is-correct', 'is-incorrect');
                    block.classList.add(pf.ok ? 'is-correct' : 'is-incorrect');
                    const status = block.querySelector('.ex-jr-status');
                    if (status) {
                        status.textContent = pf.ok
                            ? '✓ Correct entry'
                            : (pf.balanced ? '✗ Balanced, but not the right accounts/amounts' : '✗ Debits ≠ Credits (' + pf.debits + ' vs ' + pf.credits + ')');
                    }
                });
            }
        }
    };

    // ---- journal helpers ----------------------------------------------------
    function accountOptions(ex) {
        const accounts = (Array.isArray(ex.chartOfAccounts) ? ex.chartOfAccounts : []).map((c) => c.name);
        return '<option value="">Account…</option>'
            + accounts.map((n) => '<option value="' + esc(n) + '">' + esc(n) + '</option>').join('');
    }
    const SIDE_OPTS = '<option value="">DR/CR</option><option value="D">Debit</option><option value="C">Credit</option>';

    function jrLineHtml(ex, opts) {
        opts = opts || {};
        const cls = 'ex-jr-line' + (opts.extraClass ? ' ' + opts.extraClass : '');
        return '<div class="' + cls + '"' + (opts.data ? ' ' + opts.data : '') + '>'
            + '<select class="ex-select ex-jr-acc" data-kind="account">' + accountOptions(ex) + '</select>'
            + '<select class="ex-select ex-jr-side" data-kind="side">' + SIDE_OPTS + '</select>'
            + '<input class="ex-input ex-jr-amount" data-kind="amount" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Amount">'
            + (opts.withDelete ? '<button type="button" class="ex-jr-del" data-ex-jr-del="1" aria-label="Remove line">&times;</button>' : '')
            + '</div>';
    }
    function readLine(ln) {
        if (!ln) return { account: null, side: null, amount: '' };
        const acc = ln.querySelector('.ex-jr-acc');
        const side = ln.querySelector('.ex-jr-side');
        const amt = ln.querySelector('.ex-jr-amount');
        return {
            account: acc && acc.value ? acc.value : null,
            side: side && side.value ? side.value : null,
            amount: amt ? amt.value : ''
        };
    }

    function renderGuidedJournal(ex) {
        const trans = Array.isArray(ex.transactions) ? ex.transactions : [];
        return '<div class="ex-journal">' + trans.map((t, ti) => {
            const lines = (t.entries || []).map((e, li) =>
                jrLineHtml(ex, { data: 'data-trans="' + ti + '" data-line="' + li + '"' })
            ).join('');
            return '<div class="ex-jr-trans" data-trans="' + ti + '">'
                + '<div class="ex-jr-text">' + (ti + 1) + '. ' + esc(t.text) + '</div>'
                + '<div class="ex-jr-lines">' + lines + '</div>'
                + '<div class="ex-jr-status"></div>'
                + '</div>';
        }).join('') + '</div>';
    }

    function renderFreeJournal(ex) {
        const startLines = 4;
        let lines = '';
        for (let i = 0; i < startLines; i++) lines += jrLineHtml(ex, { extraClass: 'ex-jr-free-line', withDelete: true });
        return '<div class="ex-journal ex-jr-free">'
            + '<div class="ex-jr-free-lines">' + lines + '</div>'
            + '<button type="button" class="ex-btn ex-btn-ghost ex-jr-add" data-ex-jr-add="1"><i class="fas fa-plus"></i> Add line</button>'
            + '<div class="ex-jr-tpanel">' + renderTPanel(ex, []) + '</div>'
            + '</div>';
    }

    // Pročitaj sve slobodne linije iz DOM-a → niz {account, side, amount(raw)}.
    function computeFreeRows(root) {
        return Array.from(root.querySelectorAll('.ex-jr-free-line')).map(readLine);
    }
    function freeEntries(root) {
        return computeFreeRows(root)
            .map((a) => ({ account: a.account, side: a.side, amount: Core.parseAmount(a.amount) }))
            .filter((e) => e.account && (e.side === 'D' || e.side === 'C') && Number.isFinite(e.amount));
    }

    // Žive T-konta + Σdebit/Σcredit (auto-posting vizual).
    function renderTPanel(ex, entries) {
        const K = (typeof window !== 'undefined' && window.AccKernel) || {};
        if (!K.tAccounts) return '';
        const t = K.tAccounts(ex.beginningBalances || {}, entries, ex.chartOfAccounts || []);
        const touched = Object.keys(t).filter((n) => t[n].debits || t[n].credits);
        const fmt = (n) => (Core.formatAmount ? Core.formatAmount(n, { decimals: 0 }) : String(n));
        const cards = touched.length ? touched.map((name) =>
            '<div class="ex-tacc">'
            + '<div class="ex-tacc-name">' + esc(name) + '</div>'
            + '<div class="ex-tacc-cols"><span class="ex-tacc-dr">Dr ' + fmt(t[name].debits) + '</span>'
            + '<span class="ex-tacc-cr">Cr ' + fmt(t[name].credits) + '</span></div>'
            + '<div class="ex-tacc-bal">Balance: ' + fmt(t[name].balance) + '</div>'
            + '</div>'
        ).join('') : '<div class="ex-tacc-empty">Add lines above to see the T-accounts.</div>';
        const sumD = K.sumSide ? K.sumSide(entries, 'D') : 0;
        const sumC = K.sumSide ? K.sumSide(entries, 'C') : 0;
        const balanced = K.cents && K.cents(sumD) === K.cents(sumC) && sumD > 0;
        const barCls = balanced ? 'is-balanced' : (sumD || sumC ? 'is-unbalanced' : '');
        const bar = '<div class="ex-jr-bar ' + barCls + '">'
            + '<span>Σ Debits: ' + fmt(K.round2 ? K.round2(sumD) : sumD) + '</span>'
            + '<span>Σ Credits: ' + fmt(K.round2 ? K.round2(sumC) : sumC) + '</span>'
            + '<span class="ex-jr-bar-flag">' + (balanced ? '✓ Balanced' : (sumD || sumC ? '✗ Out of balance' : '—')) + '</span>'
            + '</div>';
        // Živa računovodstvena jednadžba A = L + E (iz tekućih završnih salda).
        let eq = '';
        if (K.classifyTotals && K.deriveEndingBalances) {
            const tot = K.classifyTotals(K.deriveEndingBalances(ex.beginningBalances || {}, entries, ex.chartOfAccounts || []), ex.chartOfAccounts || []);
            const rhs = (tot.liabilities || 0) + (tot.equity || 0);
            const eqOk = tot.equationOk;
            const eqCls = (sumD || sumC) ? (eqOk ? 'is-balanced' : 'is-unbalanced') : '';
            eq = '<div class="ex-jr-bar ex-jr-eq ' + eqCls + '">'
                + '<span>Assets ' + fmt(tot.assets) + '</span>'
                + '<span>=</span>'
                + '<span>Liabilities ' + fmt(tot.liabilities) + ' + Equity ' + fmt(tot.equity) + ' = ' + fmt(rhs) + '</span>'
                + '<span class="ex-jr-bar-flag">' + ((sumD || sumC) ? (eqOk ? '✓ A = L + E' : '✗ A ≠ L + E') : '—') + '</span>'
                + '</div>';
        }
        return '<h3 class="ex-tpanel-title">T-accounts (live)</h3>' + bar + eq + '<div class="ex-tacc-grid">' + cards + '</div>';
    }
    function updateLivePanel(root, ex) {
        const panel = root.querySelector('.ex-jr-tpanel');
        if (panel) panel.innerHTML = renderTPanel(ex, freeEntries(root));
    }

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
        let msg;
        if (result.correct) {
            msg = 'Correct — all answers right! (100%)';
        } else if (result.balanced === false) {
            msg = 'Out of balance: total debits ≠ total credits. Fix the entries, then check again.';
        } else {
            msg = 'Score: ' + result.score + ' / ' + result.max + ' (' + pct + '%). Review the highlighted answers.';
        }
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

    // "Check": skupi unos iz DOM-a → grader (widget.grade ILI imenovani iz jezgre) → feedback + napredak.
    function checkOpen() {
        if (!openEx) return;
        const widget = WIDGETS[openEx.type];
        const grader = widget && (typeof widget.grade === 'function' ? widget.grade : Core[widget.grader]);
        const host = document.getElementById('exercisesContent');
        const root = host && host.querySelector('.ex-body');
        if (!widget || typeof grader !== 'function' || !root) return;

        const answers = widget.collect(openEx, root);
        const result = grader(openEx, answers);
        if (typeof widget.mark === 'function') widget.mark(openEx, root, result);
        renderFeedback(host, result);
        saveProgress(openEx.id, result);
    }

    // Free-journal: dodaj/ukloni liniju + live osvježi T-konta.
    function freeRoot() { return document.querySelector('#exercisesContent .ex-body'); }
    function addFreeLine() {
        const root = freeRoot();
        const container = root && root.querySelector('.ex-jr-free-lines');
        if (!container || !openEx) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = jrLineHtml(openEx, { extraClass: 'ex-jr-free-line', withDelete: true });
        if (wrap.firstChild) container.appendChild(wrap.firstChild);
        updateLivePanel(root, openEx);
    }
    function removeFreeLine(btn) {
        const line = btn.closest('.ex-jr-line');
        const root = freeRoot();
        if (line) line.remove();
        if (root && openEx) updateLivePanel(root, openEx);
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
            if (e.target.closest('[data-ex-jr-add]')) { addFreeLine(); return; }
            const del = e.target.closest('[data-ex-jr-del]');
            if (del) { removeFreeLine(del); return; }
            if (e.target.closest('[data-ex-check]')) { checkOpen(); return; }
            const opt = e.target.closest('.ex-opt');
            if (opt) { selectOption(opt); return; }
            const card = e.target.closest('.ex-card');
            if (card) openExercise(card.getAttribute('data-ex-id'));
        });

        // Live auto-posting: osvježi T-konta dok korisnik tipka/bira (samo free journal).
        const onLive = (e) => {
            if (!openEx || !openEx.free) return;
            if (!e.target.closest('.ex-jr-free')) return;
            const root = freeRoot();
            if (root) updateLivePanel(root, openEx);
        };
        section.addEventListener('input', onLive);
        section.addEventListener('change', onLive);
    }

    function initExercises() {
        bindOnce();
        renderList();
    }

    if (typeof window !== 'undefined') {
        window.initExercises = initExercises;
    }
})();
