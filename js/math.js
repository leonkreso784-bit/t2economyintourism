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

        // ── MREŽA B3c: display-formule su SKROLABILNE regije (css/math.css: overflow-x) ──
        // WCAG 2.1.1 (razina A, axe `scrollable-region-focusable`): sadržaj do kojeg se
        // dolazi samo skrolom mora biti dohvatljiv i tipkovnicom → tabindex. Mehanizam je
        // NAMJERNO ovdje, na jedinom mjestu kroz koje svaka formula prolazi (learn, kartice,
        // kviz, Studio-pregled…) — 9 izmjerenih prekršaja @ 375 px pada jednim popravkom,
        // i svaki budući put renderiranja ga dobiva besplatno (B3a: mjerač je našao kvar
        // upravo na površini koju nitko nije gledao).
        // ⚠️ `role="group"`, NE `role="region"` — presudilo je MJERENJE, ne ukus: region je
        // LANDMARK, pa je više formula s istim imenom na stranici odmah okinulo axeov
        // `landmark-unique` (izmjereno na macro learnu). Group daje isto (ime + granice
        // pri fokusu) bez landmark-statusa, tj. bez šuma u rotoru čitača ekrana.
        try {
            var formule = container.querySelectorAll('.katex-display');
            for (var i = 0; i < formule.length; i++) {
                var f = formule[i];
                if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '0');
                if (!f.hasAttribute('role')) f.setAttribute('role', 'group');
                if (!f.hasAttribute('aria-label')) {
                    f.setAttribute('aria-label',
                        typeof window.t === 'function' ? window.t('a11y.formula') : 'Mathematical formula');
                }
            }
        } catch (e2) {
            if (window.console && console.warn) console.warn('renderMath a11y attrs failed', e2);
        }
    }

    window.renderMath = renderMath;
})();
