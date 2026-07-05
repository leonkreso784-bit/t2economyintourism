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
            // F3 3A.3 (aditivno): opcionalna klik-akcija (npr. „nova verzija — dodirni za nadogradnju").
            /** @type {((ev: Event) => void)|null} */
            this._onAction = null;
            /** @type {((ev: KeyboardEvent) => void)|null} */
            this._onKey = null;
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
         * F3 3A.3 (aditivno, natrag-kompatibilno): `opts.duration` = vlastito trajanje (ms);
         * `opts.onClick` = cijeli toast postane dodirljiv (jednokratna akcija — klik sakrije toast).
         * Bez opts = ponašanje identično prijašnjem (svi postojeći pozivatelji nepromijenjeni).
         * @param {string} message
         * @param {{ duration?: number, onClick?: (ev: Event) => void }} [opts]
         */
        show(message, opts) {
            const o = opts || {};
            if (this._msg) this._msg.textContent = String(message);

            if (this._timer) clearTimeout(this._timer);
            this._clearAction();
            if (typeof o.onClick === 'function') this._setAction(o.onClick);

            this.classList.remove('show');
            void this.offsetWidth; // force reflow → restart CSS tranzicije i kad se toast već prikazuje
            this.classList.add('show');

            const ms = (typeof o.duration === 'number' && o.duration > 0) ? o.duration : AUTO_HIDE_MS;
            this._timer = setTimeout(() => {
                this.classList.remove('show');
                this._clearAction();
                this._timer = null;
            }, ms);
        }

        /**
         * Aktiviraj klik-akciju: toast je dodirljiv (klik/Enter/Space), akcija je jednokratna
         * i odmah sakrije toast. `role` ostaje `status` (poruka se i dalje najavi čitaču;
         * tekst poruke sam poziva na dodir), ali `tabindex` omogući fokus tipkovnicom.
         * @param {(ev: Event) => void} fn
         */
        _setAction(fn) {
            this._onAction = (ev) => {
                this.classList.remove('show');
                if (this._timer) { clearTimeout(this._timer); this._timer = null; }
                this._clearAction();
                fn(ev);
            };
            this._onKey = (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    if (this._onAction) this._onAction(ev);
                }
            };
            this.addEventListener('click', this._onAction);
            this.addEventListener('keydown', this._onKey);
            this.classList.add('toast--action');
            this.setAttribute('tabindex', '0');
        }

        /** Makni klik-akciju + vrati toast u pasivno (ne-dodirljivo) stanje. Idempotentno. */
        _clearAction() {
            if (this._onAction) { this.removeEventListener('click', this._onAction); this._onAction = null; }
            if (this._onKey) { this.removeEventListener('keydown', this._onKey); this._onKey = null; }
            this.classList.remove('toast--action');
            this.removeAttribute('tabindex');
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
