// ===== SOKRAT STUDY — <sokrat-confirm> (F2 2D.3, S4: branded confirm-dialog) =====
//
// Treći UI-primitiv (nakon <sokrat-toast> 2D.1 i <sokrat-modal> 2D.2). Prvi koji je GRAĐEN
// NA drugom primitivu — interno koristi <sokrat-modal> (dokaz kompozicije komponenti).
// Zamjenjuje ružne native `confirm()` dijaloge brendiranim, Promise-baziranim dijalogom.
//
// ⚠ ODLUKE (ADR-014):
//   • LIGHT-DOM (bez Shadow DOM) — globalni CSS/i18n/teme rade.
//   • KOMPOZICIJA: <sokrat-confirm> renderira <sokrat-modal> koji vodi overlay/ESC/backdrop/
//     scroll-lock/fokus/Tab-trap; ovaj sloj dodaje samo karticu (naslov/poruka/akcije) + Promise.
//   • API: instanca `el.ask(opts) → Promise<boolean>`; globalni `window.askConfirm(opts)` (singleton
//     `#confirmDialog`) s FALLBACKOM na native `confirm()` (uvijek vrati Promise → pozivatelji `await`).
//   • Budući konzument: GDPR „Obriši račun" dvostruka potvrda (ADR-016 / BACKLOG).

(function () {
    'use strict';

    // i18n helper: t() ako postoji, inače engleski fallback.
    /** @param {string} key @param {string} fb @returns {string} */
    function tt(key, fb) { return (window.t && window.t(key) !== key) ? window.t(key) : fb; }

    class SokratConfirm extends HTMLElement {
        constructor() {
            super();
            /** @type {((v: boolean) => void)|null} */
            this._resolve = null;
            this._built = false;
            /** @type {any} */ this._modal = null;
            /** @type {HTMLElement|null} */ this._titleEl = null;
            /** @type {HTMLElement|null} */ this._msgEl = null;
            /** @type {HTMLButtonElement|null} */ this._okBtn = null;
            /** @type {HTMLButtonElement|null} */ this._cancelBtn = null;
        }

        connectedCallback() {
            if (this._built) return;
            this._built = true;

            // <sokrat-modal> je sam dialog (role=alertdialog + aria-modal iz komponente). Kartica
            // NEMA duplirani role (izbjegnut ugniježđeni dialog). aria-labelledby = poruka (pitanje).
            this.innerHTML =
                '<sokrat-modal class="sokrat-confirm-modal" role="alertdialog" aria-labelledby="sokratConfirmMsg">' +
                '  <div class="sokrat-confirm__card">' +
                '    <h3 class="sokrat-confirm__title" id="sokratConfirmTitle" hidden></h3>' +
                '    <p class="sokrat-confirm__msg" id="sokratConfirmMsg"></p>' +
                '    <div class="sokrat-confirm__actions">' +
                '      <button type="button" class="sokrat-confirm__btn sokrat-confirm__cancel"></button>' +
                '      <button type="button" class="sokrat-confirm__btn sokrat-confirm__ok"></button>' +
                '    </div>' +
                '  </div>' +
                '</sokrat-modal>';

            this._modal = this.querySelector('sokrat-modal');
            this._titleEl = this.querySelector('.sokrat-confirm__title');
            this._msgEl = this.querySelector('.sokrat-confirm__msg');
            this._okBtn = this.querySelector('.sokrat-confirm__ok');
            this._cancelBtn = this.querySelector('.sokrat-confirm__cancel');
            if (!this._okBtn || !this._cancelBtn || !this._modal) return; // struktura uvijek postoji; guard za tip-sigurnost

            this._okBtn.addEventListener('click', () => { this._settle(true); this._close(); });
            this._cancelBtn.addEventListener('click', () => { this._settle(false); this._close(); });
            // ESC / klik-na-backdrop zatvore modal → tretiraj kao „cancel" (false).
            this._modal.addEventListener('sokrat-modal:close', () => { this._settle(false); });
        }

        /**
         * Pitaj korisnika za potvrdu.
         * @param {{title?:string, message?:string, confirmText?:string, cancelText?:string, danger?:boolean}} [opts]
         * @returns {Promise<boolean>}
         */
        ask(opts) {
            opts = opts || {};
            if (!this._built) this.connectedCallback();
            // Ako je prethodni upit još otvoren, razriješi ga kao cancel prije novog.
            this._settle(false);
            // Ako struktura nije izgrađena (ne bi se smjelo dogoditi) → tihi „cancel".
            if (!this._titleEl || !this._msgEl || !this._okBtn || !this._cancelBtn) return Promise.resolve(false);

            const title = opts.title || '';
            this._titleEl.textContent = title;
            this._titleEl.hidden = !title;
            this._msgEl.textContent = opts.message || '';
            this._okBtn.textContent = opts.confirmText || tt('common.confirm', 'Confirm');
            this._cancelBtn.textContent = opts.cancelText || tt('common.cancel', 'Cancel');
            this._okBtn.classList.toggle('is-danger', !!opts.danger);
            // Ako ima naslova, on je labela dijaloga; inače ostaje poruka.
            this._modal.setAttribute('aria-labelledby', title ? 'sokratConfirmTitle' : 'sokratConfirmMsg');

            return new Promise((resolve) => {
                this._resolve = resolve;
                if (this._modal && typeof this._modal.open === 'function') this._modal.open();
            });
        }

        // ── interno ─────────────────────────────────────────────────────────
        /** @param {boolean} value */
        _settle(value) {
            if (this._resolve) { const r = this._resolve; this._resolve = null; r(value); }
        }
        _close() {
            if (this._modal && typeof this._modal.close === 'function') this._modal.close();
        }
    }

    if (typeof customElements !== 'undefined' && !customElements.get('sokrat-confirm')) {
        customElements.define('sokrat-confirm', SokratConfirm);
    }

    // Globalni ulaz — singleton #confirmDialog; fallback na native confirm() (uvijek Promise<boolean>).
    /**
     * @param {{title?:string, message?:string, confirmText?:string, cancelText?:string, danger?:boolean}} [opts]
     * @returns {Promise<boolean>}
     */
    function askConfirm(opts) {
        opts = opts || {};
        const el = /** @type {any} */ (document.getElementById('confirmDialog'));
        if (el && typeof el.ask === 'function') return el.ask(opts);
        // Krajnji fallback (element nema / custom element ne upgrade-a): native confirm.
        return Promise.resolve(window.confirm(opts.message || ''));
    }

    if (typeof window !== 'undefined') {
        window.SokratConfirm = SokratConfirm;
        window.askConfirm = askConfirm;
    }
})();
