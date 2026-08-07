// ===== SOKRAT STUDY — MATH (KaTeX) RENDERING — ADR-009 =====
//
// One helper, renderMath(container), runs KaTeX auto-render over freshly injected
// HTML so quantitative subjects (Micro / Macro / Statistics / Math) can write
// formulas as LaTeX. The payload stays a plain string → migration-safe.
//
// ⚠ DELIMITERS — currency-safe by design:
//   \( ... \)   → inline math
//   \[ ... \]   → display (block) math
//   $$ ... $$   → display (block) math (ergonomic alias)
// Single `$` is DELIBERATELY NOT a delimiter. Existing content has 120+ currency
// amounts like "$25 per night"; with a single-`$` delimiter KaTeX would parse the
// text between two dollar signs as math and visually corrupt live content across
// many subjects. \(  \[  $$ never appear in existing prose (verified) → enabling
// this globally is a no-op for every textual subject and only activates where an
// author actually writes LaTeX.
//
// Author convention + escaping rules: docs/architecture/CONTENT_SCHEMA.md (§ Matematika / formule).
//
// CDN (KaTeX + auto-render) is loaded in index.html <head> with `defer`. If it fails
// to load (offline / CDN down), renderMath is a silent no-op — formulas degrade to
// their raw LaTeX source but nothing breaks (same philosophy as the Supabase CDN
// fallback in js/auth.js).

(function () {
    'use strict';

    var DELIMITERS = [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
    ];

    // MathLive (autorski math-field, U8.9) emitira nekoliko vlastitih naredbi koje KaTeX NE poznaje
    // (najvažnije `\placeholder{}` za prazne kutije) → bez ovih makroa bi se prikazale kao crveni
    // "\placeholder". Mapiramo ih na KaTeX-ekvivalente: prazna kutija → sivi okvir □ (isto što autor
    // vidi u math-fieldu). Bezopasno za sav ostali sadržaj (makro se koristi SAMO ako se naredba pojavi).
    var MACROS = {
        '\\placeholder': '{\\color{#94a3b8}\\square}',
        '\\mleft': '\\left',
        '\\mright': '\\right',
        '\\differentialD': '\\mathrm{d}',
        '\\exponentialE': 'e',
        '\\imaginaryI': 'i'
    };

    function renderMath(container) {
        if (!container) return;
        var auto = window.renderMathInElement;
        if (typeof auto !== 'function') return; // KaTeX CDN not (yet) loaded → no-op
        try {
            auto(container, {
                delimiters: DELIMITERS,
                macros: MACROS,                 // MathLive-izmi (\placeholder itd.) → KaTeX-ekvivalenti
                throwOnError: false,            // a formula typo renders red, never throws
                ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
                ignoredClasses: ['no-math']     // escape hatch: opt a node out of math parsing
            });
        } catch (e) {
            if (window.console && console.warn) console.warn('renderMath failed', e);
        }
    }

    window.renderMath = renderMath;
})();
