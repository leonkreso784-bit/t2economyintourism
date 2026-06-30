/* ===== Sokrat Study — SokratMonitor (Faza 2, cigla 2E): praćenje grešaka =====
 *
 * Cilj: kad nekome na stranici kod pukne, saznaš ODMAH (umjesto sljepoće dok netko ne javi).
 * Tehnika: Sentry (besplatan tier), učitan SAMO nakon pristanka na kolačiće (kao GA u consent.js),
 *          NULA PII-a, i SIGURAN NO-OP dok DSN nije upisan (handleri postoje, ništa se ne šalje/učita).
 *
 * ⚙️ SETUP (jedini korak): zalijepi svoj Sentry DSN niže (izgleda kao
 *    "https://<key>@<org>.ingest.sentry.io/<projectId>"). Do tada je sve no-op.
 *    Koristi se Sentry "Loader Script" (URL se gradi iz ključa u DSN-u) → NEMA fiksne verzije
 *    SDK-a → nema rizika od 404; loader sam dovuče najnoviji SDK i pušta queue.
 *
 * Veza s consent.js: applyConsent(true) → SokratMonitor.enable(); applyConsent(false) → disable().
 * Globalni hvatači (error / unhandledrejection) instaliraju se ODMAH, ali prosljeđuju TEK kad
 * je `enabled` (pristanak) — prije pristanka greške se ODBACUJU (GDPR: bez obrade prije privole).
 */
(function () {
    'use strict';

    // 👉 ZALIJEPI DSN OVDJE (prazno = monitoring isključen, sve no-op):
    var SENTRY_DSN = '';

    // Release oznaka — bumpaj pri deployu da znaš NA KOJOJ verziji je greška.
    // (Bez build-koraka: ručna konstanta; kasnije može iz auto-version-bump skripte, F3 3C.)
    var APP_RELEASE = 'sokrat-study@20260699';

    var enabled = false;     // pristanak dan?
    var sentryReady = false; // SDK učitan?
    var loading = false;
    var buffer = [];         // greške uhvaćene prije nego je SDK spreman (flush na ready, cap 20)

    function _publicKey() {
        var m = String(SENTRY_DSN).match(/^https:\/\/([0-9a-f]+)@/i);
        return m ? m[1] : null;
    }
    function hasDsn() { return !!_publicKey() && /@[^/]+\/\d+/.test(SENTRY_DSN); }

    function _flush() {
        buffer.forEach(function (it) { _send(it.err, it.ctx); });
        buffer = [];
    }

    function _loadSentry() {
        if (loading || sentryReady || !hasDsn()) return;
        loading = true;
        var s = document.createElement('script');
        s.src = 'https://js.sentry-cdn.com/' + _publicKey() + '.min.js'; // Loader Script (bez verzije)
        s.crossOrigin = 'anonymous';
        s.async = true;
        s.onload = function () {
            if (!window.Sentry) { loading = false; return; }
            try {
                // Loader auto-inicijalizira s DSN-om; dodaj release + privacy opcije.
                window.Sentry.onLoad(function () {
                    try {
                        window.Sentry.init({
                            release: APP_RELEASE,
                            sendDefaultPii: false
                        });
                    } catch (e) { /* ignore */ }
                });
                sentryReady = true;
                _flush();
            } catch (e) { loading = false; }
        };
        s.onerror = function () { loading = false; /* CDN padne → ostani no-op */ };
        document.head.appendChild(s);
    }

    function _send(err, ctx) {
        if (!window.Sentry) return;
        try {
            if (ctx) window.Sentry.captureException(err, { extra: ctx });
            else window.Sentry.captureException(err);
        } catch (e) { /* monitoring NIKAD ne smije srušiti app */ }
    }

    function captureException(err, ctx) {
        if (!enabled) return;                         // bez pristanka → odbaci
        if (!hasDsn()) return;                         // bez DSN-a → no-op
        if (sentryReady) { _send(err, ctx); return; }
        if (buffer.length < 20) buffer.push({ err: err, ctx: ctx });
        _loadSentry();
    }

    // Globalne sigurnosne mreže — instaliraju se odmah; prosljeđuju tek kad `enabled`.
    window.addEventListener('error', function (e) {
        if (e && e.error) captureException(e.error, { kind: 'window.onerror' });
    });
    window.addEventListener('unhandledrejection', function (e) {
        var reason = e && e.reason;
        var err = (reason instanceof Error) ? reason : new Error(String(reason));
        captureException(err, { kind: 'unhandledrejection' });
    });

    function enable() {
        enabled = true;
        if (hasDsn()) _loadSentry();
        else console.info('[monitor] Pristanak dan, ali Sentry DSN nije konfiguriran — monitoring je no-op.');
    }
    function disable() { enabled = false; }

    function status() {
        return { hasDsn: hasDsn(), enabled: enabled, sentryReady: sentryReady, release: APP_RELEASE, buffered: buffer.length };
    }

    window.SokratMonitor = {
        captureException: captureException,
        enable: enable,
        disable: disable,
        status: status
    };
})();
