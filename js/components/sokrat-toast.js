// ===== SOKRAT STUDY — <sokrat-toast> (F2 2D.1, S4: prvi UI-primitiv = Web Component) =====
//
// PRVI custom element na platformi. Dokazuje obrazac (registracija → lifecycle → metoda) na
// NAJJEDNOSTAVNIJEM UI-primitivu, prije nego <sokrat-modal> (2D.2) i kartice/forme (2D.3, temelj CRUD-a F4).
//
// ⚠ ODLUKE (ADR-014):
//   • LIGHT-DOM (bez Shadow DOM) — komponenta zadržava klasu `.toast`, pa SVI postojeći CSS-ovi
//     (css/pages.css base + css/responsive/* override-i pozicije) i dalje gađaju `.toast` NEPROMIJENJENO.
//   • ZERO behavior change — logika (`show`) je preseljena iz js/utils.js `showToast()` doslovno
//     (isti reflow-restart animacije, isti 2500 ms auto-hide). `showToast()` sada delegira na ovu
//     komponentu, uz FALLBACK na staro ako custom element ne upgrade-a (defensivno, 0 regresije).
//   • IDEMPOTENTNO — ako je unutarnji markup već u index.html (što jest), NE re-renderira ga.

(function () {
    'use strict';

    /** Trajanje prikaza prije auto-sakrivanja (ms) — identično prijašnjem showToast(). */
    const AUTO_HIDE_MS = 2500;

    class SokratToast extends HTMLElement {
        constructor() {
            super();
            // Polja deklarirana ovdje (ne class-field sintaksom) → TS zaključi tipove + runtime-safe
            // (bez class-field transpilacije) na starijem mobilnom Safariju. Custom-element ctor smije
            // postavljati vlastita JS-svojstva (ne dira atribute/djecu — to je u connectedCallback).
            /** @type {HTMLElement|null} */
            this._msg = null;
            /** @type {ReturnType<typeof setTimeout>|null} */
            this._timer = null;
        }

        connectedCallback() {
            // Zadrži .toast (ključno: svi CSS-ovi gađaju klasu, ne tag) — idempotentno.
            this.classList.add('toast');

            // Unutarnji markup: ako već postoji (statički u index.html), preuzmi ga; inače renderiraj.
            this._msg = /** @type {HTMLElement|null} */ (this.querySelector('#toastMessage'));
            if (!this._msg) {
                this.innerHTML =
                    '<i class="fas fa-info-circle" aria-hidden="true"></i>' +
                    '<span id="toastMessage">Message</span>';
                this._msg = /** @type {HTMLElement|null} */ (this.querySelector('#toastMessage'));
            }

            // a11y: čitači ekrana najave poruku (bio je nijemi <div>). aria-live polite = ne prekida.
            if (!this.hasAttribute('role')) this.setAttribute('role', 'status');
            if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', 'polite');
        }

        /**
         * Prikaži toast s porukom (auto-sakrivanje nakon AUTO_HIDE_MS).
         * @param {string} message
         */
        show(message) {
            if (this._msg) this._msg.textContent = String(message);

            if (this._timer) clearTimeout(this._timer);

            this.classList.remove('show');
            void this.offsetWidth; // force reflow → restart CSS tranzicije i kad se toast već prikazuje
            this.classList.add('show');

            this._timer = setTimeout(() => {
                this.classList.remove('show');
                this._timer = null;
            }, AUTO_HIDE_MS);
        }
    }

    // Registriraj jednom (guard za dvostruko učitavanje / HMR-safe).
    if (typeof customElements !== 'undefined' && !customElements.get('sokrat-toast')) {
        customElements.define('sokrat-toast', SokratToast);
    }

    // Izloži klasu (konzistentno s ostalim modulima; korisno za testove/introspekciju).
    if (typeof window !== 'undefined') {
        window.SokratToast = SokratToast;
    }
})();
