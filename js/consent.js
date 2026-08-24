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
        pratiNamjestaj(false);
        postavi('--bottom-furniture-h', 0);
        setBottomInset(0);
    }

    /**
     * Objavi koliko DNA ekrana zauzima trajni namjestaj, da plutajuci izbornici znaju
     * gdje im je stvarni rub. Banner je `position:fixed` na dnu sa `z-index: 2147483000`
     * (namjerno iznad svega), pa svaki popup koji se otvori preko njega postaje NEKLIKABILAN
     * — banner presretne pokazivac.
     *
     * ⚠️ Povod je stvaran kvar, ne opreznost: izbornik blokova (`.be-menu`) racunao je
     * okretanje prema `window.innerHeight`, sto je tocno za VIEWPORT, ali ne i za ono sto
     * je u njemu zauzeto. Dok je Studio pocinjao na vrhu ekrana, izbornik je slucajno padao
     * iznad bannera; cim ga je K2b spustio za visinu trake, poceo je padati U njega.
     * *Provjera „stane li u ekran" nije isto sto i „vidi li se".*
     */
    function postavi(token, px) {
        try { document.documentElement.style.setProperty(token, Math.max(0, px) + 'px'); }
        catch (e) { /* bez CSSOM-a (stariji preglednik) — pada na zadanu vrijednost iz CSS-a */ }
    }

    function setBottomInset(px) { postavi('--bottom-inset', px); }

    /**
     * T4 · Visina TRAJNOG DONJEG NAMJESTAJA — svega sto trajno sjedi na dnu ekrana i NIJE
     * ova traka. Danas je to tocno jedna stvar: `.study-mobile-nav`, kojom se na telefonu
     * mijenja nacin ucenja.
     *
     * ⚠️ Povod je izmjeren kvar, ne urednost. Traka je `z-index: 2147483000`, navigacija
     * 9999 — pa je na PRVOM POSJETU traka pokrivala svih sest gumba, i na 320 px nije
     * ostajala nijedna dohvatljiva kontrola bez skrola. **Fiksni element ne vidi drugi
     * fiksni element**: navigacija ne moze odgurnuti traku, a traka ne zna da navigacija
     * postoji. Netko dakle mora izmjeriti i objaviti — isti obrazac kao `--bottom-inset`,
     * samo u suprotnom smjeru.
     *
     * ⚠️ ZASTO SE VISINA MJERI, A NE PISE KAO KONSTANTA: navigacija svoju visinu dobiva iz
     * nekoliko pravila (`min-height` gumba + razmaci + sigurni rub) i **razlikuje se po
     * sirini** — izmjereno 93 px na 320 i 97 px na 393. Svaka konstanta upisana ovdje bila
     * bi drugi izvor iste istine i tocno bi jednom bila kriva.
     *
     * ⚠️ ZASTO SAMO `nav`/`footer`, A NE SVI ELEMENTI: ovo se vrti u pregledniku posjetitelja
     * pri svakoj navigaciji dok je traka otvorena, pa `getComputedStyle` nad tisucama
     * elemenata nije prihvatljiv trosak. Iscrpno skeniranje radi BRANA (`tests/helpers/
     * phone-gate.js`, tvrdnja ⑧), gdje cijena ne postoji — pa novi donji namjestaj koji nije
     * `nav`/`footer` pada na testu, a ne kod korisnika. Izricit izlaz za takav slucaj je
     * `data-bottom-furniture`.
     */
    function visinaDonjegNamjestaja() {
        var vh = window.innerHeight, vw = window.innerWidth, najvise = 0;
        var kandidati = document.querySelectorAll('nav, footer, [data-bottom-furniture]');
        for (var i = 0; i < kandidati.length; i++) {
            var el = kandidati[i];
            if (el.id === 'cookieBanner') continue;
            var cs = window.getComputedStyle(el);
            if (cs.position !== 'fixed' || cs.visibility !== 'visible' || cs.display === 'none') continue;
            var r = el.getBoundingClientRect();
            if (r.width < vw * 0.6) continue;      // odgurnuto ustranu = nije donji namjestaj
            if (r.bottom < vh - 1) continue;       // ne sjedi na dnu
            if (r.height > vh * 0.5) continue;     // to je ljuska stranice, ne namjestaj
            if (r.height > najvise) najvise = r.height;
        }
        return Math.round(najvise);
    }

    /** Premjesti traku iznad donjeg namjestaja i objavi koliko je dna ukupno zauzeto. */
    function osvjeziPodnozje() {
        var banner = document.getElementById('cookieBanner');
        if (!banner) { postavi('--bottom-furniture-h', 0); setBottomInset(0); return; }
        var pod = visinaDonjegNamjestaja();
        postavi('--bottom-furniture-h', pod);
        // Tek sada visina trake: podizanje mijenja `bottom`, ali i `padding-bottom` (sigurni
        // rub se oduzima za ono sto je vec ispod), pa se visina cita NAKON premjestanja.
        setBottomInset(pod + banner.getBoundingClientRect().height);
    }

    /**
     * Namjestaj se pojavljuje i nestaje s NAVIGACIJOM (donja navigacija postoji samo na
     * stranici ucenja), pa se prati promjena klase `.active` na sekcijama. Promatrac zivi
     * SAMO dok traka postoji — dakle do prvog pristanka, i nikad nakon njega.
     */
    var promatrac = null, mjeracVisine = null;
    function pratiNamjestaj(ukljuci) {
        if (!ukljuci) {
            if (promatrac) { promatrac.disconnect(); promatrac = null; }
            if (mjeracVisine) { mjeracVisine.disconnect(); mjeracVisine = null; }
            window.removeEventListener('resize', osvjeziPodnozje);
            window.removeEventListener('orientationchange', osvjeziPodnozje);
            return;
        }
        window.addEventListener('resize', osvjeziPodnozje);
        window.addEventListener('orientationchange', osvjeziPodnozje);

        if (!promatrac && typeof MutationObserver !== 'undefined') {
            promatrac = new MutationObserver(osvjeziPodnozje);
            var sekcije = document.querySelectorAll('section[id$="-page"]');
            for (var i = 0; i < sekcije.length; i++) {
                promatrac.observe(sekcije[i], { attributes: true, attributeFilter: ['class'] });
            }
        }

        // ⚠️ NAVIGACIJA MOZE PROMIJENITI VISINU BEZ IJEDNE PROMJENE KLASE: njezina visina sadrzi
        // `var(--safe-bottom)`, pa raste i pada s rotacijom uredaja. Tada objavljena vrijednost
        // ostane STARA i traka sjedne PREDUBOKO.
        // Izmjereno sondom (objavljeno 63 px umjesto 97 → traka preklapa gornji rub navigacije za
        // 34 px, tocno ondje gdje su ikone). ⚠️ POSTENO: taj konkretan preklop je bio ARTEFAKT
        // REDOSLIJEDA U TESTU — ondje se `--safe-bottom` postavlja NAKON sto se navigacija pojavi,
        // dok se na uredaju `env()` razrijesi pri prvom crtanju. Realan slucaj (rotacija) pokrivaju
        // i `resize`/`orientationchange` nize; ovo je pojas uz naramenice, i tako se i vodi.
        if (!mjeracVisine && typeof ResizeObserver !== 'undefined') {
            mjeracVisine = new ResizeObserver(osvjeziPodnozje);
            var kandidati = document.querySelectorAll('nav, footer, [data-bottom-furniture]');
            for (var j = 0; j < kandidati.length; j++) {
                if (kandidati[j].id === 'cookieBanner') continue;
                // ⚠️ `box: 'border-box'` NIJE kozmetika — bez njega ova provjera NE RADI.
                // Zadani `content-box` ne vidi promjenu razmaka, a visina donje navigacije
                // raste TOCNO razmakom (`padding-bottom: calc(.5rem + var(--safe-bottom))`).
                // Prva izvedba je zato sutjela i preklop od 34 px je ostao. *Promatrac koji
                // gleda krivu kutiju je promatrac koji ne gleda.*
                mjeracVisine.observe(kandidati[j], { box: 'border-box' });
            }
        }
    }

    /**
     * Prijevod s pricuvom. Traka se stvara u `defer`-skripti, dakle NAKON sto je `js/i18n.js`
     * vec izvrsen — pa `window.t` u aplikaciji postoji. Pravne stranice ga nemaju, i zato
     * pricuva nije opreznost nego jedini tekst koji ondje postoji.
     */
    var PRICUVA = {
        'cookie.text': 'We use optional analytics and error-monitoring cookies. They load only if you accept.',
        'cookie.privacy': 'Privacy Policy',
        'cookie.accept': 'Accept',
        'cookie.reject': 'Reject',
        'cookie.label': 'Cookie consent'
    };
    function T(kljuc) {
        var v = (typeof window.t === 'function') ? window.t(kljuc) : null;
        return (v && v !== kljuc) ? v : PRICUVA[kljuc];
    }

    function showBanner() {
        if (document.getElementById('cookieBanner')) return;

        var banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('data-i18n-aria', 'cookie.label');
        banner.setAttribute('aria-label', T('cookie.label'));

        // ⚠️ T4 · TRAKA JE DO SADA BILA JEDINA POVRSINA BEZ PRIJEVODA. Tekst je bio zakucan
        // engleski `innerHTML`, pa je posjetitelj s ukljucenim HR-om dobivao ponudu na
        // engleskom — a to je pravni tekst, ne ukras. Sada nosi `data-i18n`, dakle prati i
        // naknadnu promjenu jezika (`applyTranslations` prolazi cijelim dokumentom).
        // Gradi se kroz DOM API umjesto `innerHTML`-a: tekst ovdje jest nas, ali granica iz
        // BUG-025 se ne pomice po tome cije su rijeci (SokratBlocks.esc ovdje ne postoji —
        // `consent.js` se ucitava i na pravnim stranicama, bez ijedne druge nase skripte).
        var inner = document.createElement('div');
        inner.className = 'cookie-banner__inner';

        var p = document.createElement('p');
        p.className = 'cookie-banner__text';
        var span = document.createElement('span');
        span.setAttribute('data-i18n', 'cookie.text');
        span.textContent = T('cookie.text');
        var veza = document.createElement('a');
        veza.href = '/privacy.html';
        veza.setAttribute('data-i18n', 'cookie.privacy');
        veza.textContent = T('cookie.privacy');
        p.appendChild(span);
        p.appendChild(document.createTextNode(' '));
        p.appendChild(veza);

        var akcije = document.createElement('div');
        akcije.className = 'cookie-banner__actions';
        var odbij = document.createElement('button');
        odbij.type = 'button';
        odbij.className = 'cookie-btn cookie-btn--reject';
        odbij.id = 'cookieReject';
        odbij.setAttribute('data-i18n', 'cookie.reject');
        odbij.textContent = T('cookie.reject');
        var prihvati = document.createElement('button');
        prihvati.type = 'button';
        prihvati.className = 'cookie-btn cookie-btn--accept';
        prihvati.id = 'cookieAccept';
        prihvati.setAttribute('data-i18n', 'cookie.accept');
        prihvati.textContent = T('cookie.accept');
        akcije.appendChild(odbij);
        akcije.appendChild(prihvati);

        inner.appendChild(p);
        inner.appendChild(akcije);
        banner.appendChild(inner);

        document.body.appendChild(banner);
        pratiNamjestaj(true);
        osvjeziPodnozje();

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
