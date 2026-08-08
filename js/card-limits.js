// ===== SOKRAT STUDY — MJERA KARTICE (jedna definicija duljinske politike) =====
//
// Zašto zaseban modul: isto pravilo treba na TRI mjesta — modal-editor kartice
// (`js/admin-editors.js`), validator sadržaja (`scripts/validate-content.js`) i unit test.
// Tri kopije istog broja su točno onaj obrazac iz kojeg je nastao BUG-023, pa politika
// živi ovdje i nigdje drugdje (ADR-027).
//
// Standard kartice (docs/architecture/CONTENT_SCHEMA.md): kratke definicije, detalj ide u learn.
//   • SOFT (200) — MEKAN prag. Upozorava, NE blokira. Tvrda granica na 200 srušila bi
//     46,2 % zatečenog kataloga (izmjereno na 5379 kartica), pa je 200 standard, ne pravilo.
//   • HARD (500) — tvrdi strop (Leon, 2026-08-07). Točno 500 još prolazi; 501 ne.
//
// Mjeri se PODRezana duljina, jer editor sprema `value.trim()` — kad bi brojač mjerio
// sirovi tekst, korisnik bi vidio 501 a spremanje bi prošlo (ili obrnuto).
//
// Node-potrošači učitavaju ovu datoteku shim-obrascem: new Function('window', code)(win).

(function (/** @type {any} */ root) {
  'use strict';

  var SOFT = 200;
  var HARD = 500;

  /**
   * Izmjeri jedno tekstualno polje kartice.
   * @param {*} text
   * @returns {{ len: number, state: 'ok'|'warn'|'over', blocked: boolean, soft: number, hard: number }}
   */
  function measure(text) {
    var len = (typeof text === 'string') ? text.trim().length : 0;
    /** @type {'ok'|'warn'|'over'} */
    var state = (len > HARD) ? 'over' : (len > SOFT ? 'warn' : 'ok');
    return { len: len, state: state, blocked: (state === 'over'), soft: SOFT, hard: HARD };
  }

  /**
   * Smije li se kartica spremiti? Isto pravilo vrijedi za pitanje i za odgovor — jedno pravilo
   * se lakše objasni i testira, a pitanja ga u praksi ne dodiruju (izmjereno: najduže 134).
   * @param {...*} fields
   * @returns {boolean}
   */
  function allows() {
    for (var i = 0; i < arguments.length; i++) {
      if (measure(arguments[i]).blocked) return false;
    }
    return true;
  }

  root.SokratCardLimits = { SOFT: SOFT, HARD: HARD, measure: measure, allows: allows };
})(typeof window !== 'undefined' ? window : this);
