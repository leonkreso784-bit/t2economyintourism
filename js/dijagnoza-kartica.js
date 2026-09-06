// dijagnoza-kartica.js — PRIVREMENA SONDA za Leonov iPhone (2026-09-06). Učitava je `js/boot.js` SAMO uz
// `?dijagnoza=kartica` u URL-u; nikad u paketu, nikad na produkciji, briše se prije spajanja u `feat/tinder-kadar`.
//
// ZAŠTO: naličje kartice na iPhoneu ne skrola (Leon, dva puta), a headless Chromium i WebKit skrolaju.
// Tri hipoteze su već potrošene bez uređaja (`safe center`, afordanca, 3D-okret). Ovo ispisuje na
// ekran ono što iOS STVARNO vidi: izračunate stilove skrolera i predaka, `scrollHeight/clientHeight`,
// što stoji pod prstom na sredini naličja, i zadnjih osam događaja dodira/pokazivača/skrola s time
// je li ih netko otkazao (`defaultPrevented` na `window`, dakle POSLIJE svih naših slušača).
(function () {
    'use strict';
    var log = [];
    var pre = null;

    function ime(el) {
        if (!el || !el.tagName) return null;
        var s = el.tagName.toLowerCase();
        if (el.id) s += '#' + el.id;
        else if (typeof el.className === 'string' && el.className) s += '.' + el.className.split(' ')[0];
        return s;
    }
    function cs(el, p) { return el ? getComputedStyle(el)[p] : null; }

    function zabiljezi(e) {
        var t = e.touches && e.touches[0];
        var xy = t ? Math.round(t.clientX) + ',' + Math.round(t.clientY)
            : (typeof e.clientX === 'number' ? Math.round(e.clientX) + ',' + Math.round(e.clientY) : '');
        log.push([e.type, ime(e.target), e.cancelable ? 1 : 0, e.defaultPrevented ? 1 : 0, xy].join(' '));
        if (log.length > 8) log.shift();
        crtaj();
    }

    function crtaj() {
        if (!pre) return;
        var back = document.querySelector('.flashcard-back'), front = document.querySelector('.flashcard-front');
        var inner = document.querySelector('.flashcard-inner'), fc = document.getElementById('flashcard');
        var wr = document.querySelector('.flashcard-wrapper');
        var r = back ? back.getBoundingClientRect() : null;
        var pod = r ? document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2 + 40) : null;
        var o = {
            ua: (/\(([^)]*)\)/.exec(navigator.userAgent) || [])[1] || navigator.userAgent,
            uredjaj: document.documentElement.getAttribute('data-uredjaj'),
            vp: window.innerWidth + 'x' + window.innerHeight,
            docH: document.documentElement.scrollHeight,
            fc: fc ? { kl: fc.className, ta: cs(fc, 'touchAction'), tr: cs(fc, 'transform') } : null,
            wr: wr ? { persp: cs(wr, 'perspective'), h: Math.round(wr.getBoundingClientRect().height) } : null,
            inner: inner ? { tr: cs(inner, 'transform'), ts: cs(inner, 'transformStyle'), h: Math.round(inner.getBoundingClientRect().height) } : null,
            front: front ? { vis: cs(front, 'visibility'), bf: cs(front, 'backfaceVisibility'), ta: cs(front, 'touchAction') } : null,
            back: back ? {
                vis: cs(back, 'visibility'), ovY: cs(back, 'overflowY'), ta: cs(back, 'touchAction'), h: cs(back, 'height'),
                tr: cs(back, 'transform'), bf: cs(back, 'backfaceVisibility'), jc: cs(back, 'justifyContent'), pos: cs(back, 'position'),
                cH: back.clientHeight, sH: back.scrollHeight, sT: back.scrollTop, preljev: back.hasAttribute('data-preljev')
            } : null,
            pod: ime(pod),
            dog: log
        };
        pre.textContent = JSON.stringify(o, null, 1);
    }

    function start() {
        pre = document.createElement('pre');
        pre.id = 'dijagnozaKartica';
        pre.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;margin:0;padding:4px 6px;' +
            'font:9px/1.2 monospace;background:rgba(0,0,0,.8);color:#7f7;pointer-events:none;white-space:pre-wrap;' +
            'max-height:46vh;overflow:hidden';
        document.body.appendChild(pre);
        ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel']
            .forEach(function (t) { window.addEventListener(t, zabiljezi, { passive: true }); });
        window.addEventListener('scroll', zabiljezi, { passive: true, capture: true });
        setInterval(crtaj, 700);
        crtaj();
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
