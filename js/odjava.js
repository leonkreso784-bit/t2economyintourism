// ===== SOKRAT STUDY — stranica odjave od obavijesti (`odjava.html`, F2/4) =====
//
// Poveznica „Odjavi se" iz maila vodi ovamo s `?t=<token>`. Otvaranje stranice NE odjavljuje
// (skeneri pošte otvaraju poveznice) — tek gumb šalje POST na Edge Function `mail-unsubscribe`,
// koja provjerava potpis. Stranica ne učitava `auth.js` ni supabase-js: za jedan POST bi povukla
// ~200 KB s CDN-a, a odjava mora raditi i bez prijave.
//
// ⚠️ ADRESA PROJEKTA JE DRUGA KOPIJA onoga što stoji u `js/auth.js` (`SOKRAT_AUTH_CONFIG.url`).
//    Da se ne raziđu, `tests/unit/odjava.test.js` tvrdi da su iste. Isti test-šav kao auth.js:
//    `localStorage['sokrat-supabase-override']` (samo automatski testovi) usmjeri na staging.

(function (window) {
  'use strict';

  const PROD_URL = 'https://naxjubnedhrbhsuasayu.supabase.co';
  const doc = window.document;

  function projekt() {
    try {
      const raw = window.localStorage.getItem('sokrat-supabase-override');
      const o = raw ? JSON.parse(raw) : null;
      if (o && typeof o.url === 'string' && /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(o.url)) return o.url;
    } catch (e) { /* bez overridea → produkcija */ }
    return PROD_URL;
  }

  function tr(key, fb) {
    if (typeof window.t !== 'function') return fb;
    const v = window.t(key);
    return v === key ? fb : v;
  }

  function status(tekst, stanje) {
    const s = doc.getElementById('unsubStatus');
    if (!s) return;
    s.textContent = tekst;
    s.setAttribute('data-state', stanje || '');
  }

  function init() {
    // Posjetitelj iz maila najčešće NIJE birao jezik na ovom uređaju; tada presuđuje jezik uređaja.
    let izabrano = null;
    try { izabrano = window.localStorage.getItem('sokrat-ui-lang'); } catch (e) { /* privatni način */ }
    if (!izabrano && /^hr\b/i.test(window.navigator.language || '') && typeof window.setUiLang === 'function') {
      window.setUiLang('hr', false);
    }
    doc.title = tr('unsub.pageTitle', 'Unsubscribe — Sokrat Study');

    const token = new URLSearchParams(window.location.search).get('t') || '';
    const gumb = doc.getElementById('unsubBtn');
    if (!gumb) return;
    if (!token) {
      gumb.disabled = true;
      status(tr('unsub.missing', 'The link is incomplete — open it again from the email.'), 'error');
      return;
    }

    gumb.addEventListener('click', async function () {
      if (gumb.disabled) return;
      gumb.disabled = true;
      status('', '');
      try {
        const r = await fetch(projekt() + '/functions/v1/mail-unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ t: token })
        });
        const j = await r.json().catch(function () { return {}; });
        if (r.ok && j.ok) {
          status(tr('unsub.done', 'Done — you will not get any more updates. You can turn them back on in your profile.'), 'done');
          return;                                   // gumb ostaje ugašen: posao je gotov
        }
        if (j.error === 'bad_token') {
          status(tr('unsub.bad', 'This link is not valid. Turn off updates in your profile instead.'), 'error');
          return;
        }
        throw new Error(j.error || 'failed');
      } catch (e) {
        gumb.disabled = false;
        status(tr('unsub.error', 'That did not work — please try again.'), 'error');
      }
    });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
