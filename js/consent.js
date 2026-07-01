/* ===== Sokrat Study — Cookie consent + Google Analytics (GA4) =====
 * GDPR-friendly: Google Consent Mode v2 defaults to DENIED (set inline in <head>),
 * and Google Analytics (gtag.js) is loaded ONLY after the visitor clicks "Accept".
 * The choice is remembered in localStorage; visitors can change it later via the
 * "Cookie settings" footer link (window.openCookieSettings).
 *
 * ⚙️  SETUP: paste your GA4 Measurement ID below (looks like "G-XXXXXXXXXX").
 *     Until a real ID is set, the banner still works but no analytics is loaded.
 */
(function () {
    'use strict';

    var GA_MEASUREMENT_ID = 'G-ME0V58NJ1Z'; // GA4 Measurement ID for www.sokratstudy.com
    var STORAGE_KEY = 'sokrat-cookie-consent'; // 'granted' | 'denied'

    // Ensure gtag exists even if the inline <head> snippet was missed.
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    var gaLoaded = false;
    function hasRealId() {
        return /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID);
    }

    function loadGoogleAnalytics() {
        if (gaLoaded) return;
        gaLoaded = true;
        if (!hasRealId()) {
            // No real Measurement ID yet — consent is recorded, but nothing is loaded.
            console.info('[consent] Analytics consent granted, but no GA4 Measurement ID is configured yet.');
            return;
        }
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(s);
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
    }

    function applyConsent(granted) {
        window.gtag('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied'
        });
        if (granted) loadGoogleAnalytics();
        // Faza 2 (2E): praćenje grešaka (Sentry) slijedi ISTI gate pristanka. No-op ako modul
        // nije učitan (npr. pravne stranice) ili DSN nije konfiguriran.
        if (window.SokratMonitor) {
            if (granted) window.SokratMonitor.enable();
            else window.SokratMonitor.disable();
        }
    }

    function saveChoice(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode */ }
    }

    function removeBanner() {
        var el = document.getElementById('cookieBanner');
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function showBanner() {
        if (document.getElementById('cookieBanner')) return;

        var banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<div class="cookie-banner__inner">' +
                '<p class="cookie-banner__text">' +
                    'We use optional <strong>analytics &amp; error-monitoring cookies</strong> to understand ' +
                    'how visitors use Sokrat Study and to fix problems. They load only if you Accept. See our ' +
                    '<a href="/privacy.html">Privacy Policy</a>.' +
                '</p>' +
                '<div class="cookie-banner__actions">' +
                    '<button type="button" class="cookie-btn cookie-btn--reject" id="cookieReject">Reject</button>' +
                    '<button type="button" class="cookie-btn cookie-btn--accept" id="cookieAccept">Accept</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        document.getElementById('cookieAccept').addEventListener('click', function () {
            saveChoice('granted');
            applyConsent(true);
            removeBanner();
        });
        document.getElementById('cookieReject').addEventListener('click', function () {
            saveChoice('denied');
            applyConsent(false);
            removeBanner();
        });
    }

    function init() {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }

        if (saved === 'granted') {
            applyConsent(true);
        } else if (saved === 'denied') {
            // stays denied (Consent Mode default) — nothing to load
        } else {
            showBanner();
        }
    }

    // Let users re-open the choice later (e.g. a "Cookie settings" footer link).
    window.openCookieSettings = function () {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        gaLoaded = false;
        showBanner();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
