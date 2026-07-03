// ===== SOKRAT STUDY — <sokrat-modal> (F2 2D.2, S4: reusable modal-primitiv) =====
//
// Drugi UI-primitiv (nakon <sokrat-toast>, 2D.1). Objedinjuje overlay/dialog PONAŠANJE koje
// je danas ad-hoc ponovljeno po appu (auth modal gradi overlay+close+ESC ručno innerHTML-om;
// learn image-viewer isto). Pružа: prikaz/skrivanje, ESC-za-zatvoriti, klik-na-backdrop, zaključavanje
// scrolla (`body.modal-open`), fokus-na-otvaranju + vraćanje fokusa, Tab-trap, i a11y atribute.
//
// ⚠ ODLUKE (ADR-014, kao 2D.1):
//   • LIGHT-DOM (bez Shadow DOM) — sadržaj dijaloga su DJECA elementa (globalni CSS/i18n/teme rade).
//     Komponenta je OVERLAY; djeca su "kartica" dijaloga (konzument stilizira svoje `.…__card`).
//   • 2D.2a = SAMO primitiv (nijedan postojeći modal još ne migriran) → 0 rizika. 2D.2b migrira
//     image-viewer, 2D.2c auth modal (pravi cilj: makne innerHTML overlay-boilerplate).
//   • API: `open()` / `close()` / `toggle()` / `isOpen()`; eventi `sokrat-modal:open` / `:close`.

(function () {
    'use strict';

    // Selektor fokusabilnih elemenata (za fokus-na-otvaranju i Tab-trap).
    const FOCUSABLE =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
        'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    class SokratModal extends HTMLElement {
        constructor() {
            super();
            /** @type {HTMLElement|null} */
            this._prevFocus = null;
            /** @type {(e: KeyboardEvent) => void} */
            this._onKeydown = this._handleKeydown.bind(this);
            /** @type {(e: MouseEvent) => void} */
            this._onBackdrop = this._handleBackdrop.bind(this);
        }

        connectedCallback() {
            // Overlay klasa (CSS u css/sokrat-modal.css). Idempotentno.
            this.classList.add('sokrat-modal');
            if (!this.hasAttribute('role')) this.setAttribute('role', 'dialog');
            this.setAttribute('aria-modal', 'true');
            // Zatvoren po defaultu (osim ako je konzument eksplicitno postavio drugačije).
            if (!this.hasAttribute('aria-hidden')) this.setAttribute('aria-hidden', 'true');

            this.addEventListener('click', this._onBackdrop);
            document.addEventListener('keydown', this._onKeydown);
        }

        disconnectedCallback() {
            document.removeEventListener('keydown', this._onKeydown);
            // Ako je element uklonjen dok je otvoren, ne ostavi zaključan scroll.
            if (this.isOpen()) document.body.classList.remove('modal-open');
        }

        /** @returns {boolean} */
        isOpen() {
            return this.classList.contains('is-open');
        }

        /** Otvori modal: prikaži, zaključaj scroll, pomakni fokus unutra, zapamti prethodni fokus. */
        open() {
            if (this.isOpen()) return;
            this._prevFocus = /** @type {HTMLElement|null} */ (document.activeElement);
            this.setAttribute('aria-hidden', 'false');
            this.classList.add('is-open');
            document.body.classList.add('modal-open');
            this._focusFirst();
            this.dispatchEvent(new CustomEvent('sokrat-modal:open', { bubbles: true }));
        }

        /** Zatvori modal: sakrij, otključaj scroll, vrati fokus na prethodni element. */
        close() {
            if (!this.isOpen()) return;
            this.setAttribute('aria-hidden', 'true');
            this.classList.remove('is-open');
            document.body.classList.remove('modal-open');
            if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
                this._prevFocus.focus();
            }
            this.dispatchEvent(new CustomEvent('sokrat-modal:close', { bubbles: true }));
        }

        /** @param {boolean} [force] */
        toggle(force) {
            const want = (typeof force === 'boolean') ? force : !this.isOpen();
            if (want) this.open(); else this.close();
        }

        // ── interno ─────────────────────────────────────────────────────────
        /** @returns {HTMLElement[]} */
        _focusable() {
            return Array.prototype.filter.call(
                this.querySelectorAll(FOCUSABLE),
                (el) => el.offsetParent !== null || el === document.activeElement
            );
        }

        _focusFirst() {
            // Odgodi za jedan frame: tek ubačen/otvoren modal treba primijenjen layout + `visibility:visible`
            // (iz `.is-open`) prije nego .focus() uhvati — inače fokus tiho padne na <body>.
            const doFocus = () => {
                if (!this.isOpen()) return; // u međuvremenu zatvoren
                const items = this._focusable();
                if (items.length) {
                    items[0].focus();
                } else {
                    // Nema fokusabilnog sadržaja → fokusiraj sam dijalog (da AT/Tab imaju sidro).
                    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
                    this.focus();
                }
            };
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(doFocus);
            else doFocus();
        }

        /** @param {MouseEvent} e */
        _handleBackdrop(e) {
            // Klik izravno na overlay (ne na dijete/karticu) zatvara.
            if (e.target === this) this.close();
        }

        /** @param {KeyboardEvent} e */
        _handleKeydown(e) {
            if (!this.isOpen()) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
                return;
            }
            if (e.key === 'Tab') {
                // Tab-trap: drži fokus unutar modala (aria-modal jamstvo za tipkovnicu).
                const items = this._focusable();
                if (!items.length) { e.preventDefault(); return; }
                const first = items[0];
                const last = items[items.length - 1];
                const active = document.activeElement;
                if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
            }
        }
    }

    if (typeof customElements !== 'undefined' && !customElements.get('sokrat-modal')) {
        customElements.define('sokrat-modal', SokratModal);
    }
    if (typeof window !== 'undefined') {
        window.SokratModal = SokratModal;
    }
})();
