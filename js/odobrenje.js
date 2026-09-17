// ===== SOKRAT STUDY — stranica odobrenja za korisnikov AI (`odobrenje.html`, F6 ①/1) =====
//
// Supabase OAuth 2.1 poslužitelj šalje korisnika ovamo s `?authorization_id=…` kad njegov AI
// (Claude, ChatGPT) traži pristup. Stranica pokaže TKO traži i KAMO se vraća, i tek na gumb
// „Dopusti" javi odobrenje.
//
// ─── ZAŠTO POPIS HOSTOVA (ADR-038 ③) ────────────────────────────────────────────────────────────
// DCR je uključen: bilo tko može registrirati klijenta imena „Sokrat" s povratkom na svoju
// stranicu i poslati korisniku poveznicu. Odobrenje traži korisnikovu sesiju s NAŠEG origina, pa
// se ova stranica ne može zaobići — zato ovdje odbijamo svaki povratak koji nije poznati AI.
// `approve/denyAuthorization` u supabase-js SAMI preusmjere preglednik; uvijek šaljemo
// `skipBrowserRedirect` i preusmjeravamo tek poslije vlastite provjere.
//
// ⚠️ ADRESA, KLJUČ I SDK SU KOPIJA `SOKRAT_AUTH_CONFIG` iz `js/auth.js`. `auth.js` se ovdje ne
//    učitava: ubacuje prozor za prijavu (`<sokrat-modal>`) kojem na ovoj stranici nema ni komponente
//    ni stilova. `tests/unit/odobrenje.test.js` tvrdi da su kopije iste. Isti test-šav kao auth.js:
//    `localStorage['sokrat-supabase-override']` usmjeri na staging.

(function (window) {
  'use strict';

  const PROD_URL = 'https://naxjubnedhrbhsuasayu.supabase.co';
  const PROD_KEY = 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L';
  const SDK_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.8/dist/umd/supabase.js';
  const SDK_SRI = 'sha384-M65KxMm/JqBppck6onbmAgPVMBHrmPCf1L17Q+71EcvI9/VVI8j5cqoxQf6lj6h2';

  // Poznati AI-jevi (točan host, bez poddomena). Novi AI = novi unos + test.
  const DOPUSTENI_HOSTOVI = ['claude.ai', 'chatgpt.com'];

  const doc = window.document;

  function projekt() {
    try {
      const raw = window.localStorage.getItem('sokrat-supabase-override');
      const o = raw ? JSON.parse(raw) : null;
      if (o && typeof o.url === 'string' && /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(o.url)
          && typeof o.publishableKey === 'string' && o.publishableKey) {
        return { url: o.url, key: o.publishableKey };
      }
    } catch (e) { /* bez overridea → produkcija */ }
    return { url: PROD_URL, key: PROD_KEY };
  }

  /** Host povratne adrese ako je https i na popisu, inače null. */
  function dopustenHost(adresa) {
    try {
      const u = new URL(adresa);
      if (u.protocol !== 'https:') return null;
      return DOPUSTENI_HOSTOVI.indexOf(u.hostname) !== -1 ? u.hostname : null;
    } catch (e) { return null; }
  }

  function hostOd(adresa) {
    try { return new URL(adresa).hostname; } catch (e) { return String(adresa || ''); }
  }

  function tr(key, fb) {
    if (typeof window.t !== 'function') return fb;
    const v = window.t(key);
    return v === key ? fb : v;
  }

  function status(tekst, stanje) {
    const s = doc.getElementById('oauthStatus');
    if (!s) return;
    s.textContent = tekst;
    s.setAttribute('data-state', stanje || '');
  }

  function el(id) { return doc.getElementById(id); }

  function ucitajSdk() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && typeof window.supabase.createClient === 'function') { resolve(); return; }
      const s = doc.createElement('script');
      s.src = SDK_SRC;
      s.integrity = SDK_SRI;
      s.crossOrigin = 'anonymous';
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('sdk')); };
      doc.head.appendChild(s);
    });
  }

  async function init() {
    doc.title = tr('oauth.pageTitle', 'Connect your AI — Sokrat Study');

    const id = new URLSearchParams(window.location.search).get('authorization_id') || '';
    if (!id) {
      status(tr('oauth.missing', 'This link is incomplete — start connecting again from your AI app.'), 'error');
      return;
    }

    let klijent;
    try {
      await ucitajSdk();
      const p = projekt();
      klijent = window.supabase.createClient(p.url, p.key);
    } catch (e) {
      status(tr('oauth.error', 'That did not work — please try again.'), 'error');
      return;
    }

    const sesija = (await klijent.auth.getSession()).data.session;
    if (!sesija) {
      status(tr('oauth.signin', 'Sign in to Sokrat Study in this browser first, then connect again from your AI app.'), 'error');
      el('oauthSignin').hidden = false;
      return;
    }

    const odgovor = await klijent.auth.oauth.getAuthorizationDetails(id);
    const d = odgovor.data;
    if (odgovor.error || !d) {
      status(tr('oauth.error', 'That did not work — please try again.'), 'error');
      return;
    }

    // Već odobreno ranije → poslužitelj odmah vraća kamo ići. I tada vrijedi popis hostova.
    if (!d.authorization_id && d.redirect_url) {
      if (dopustenHost(d.redirect_url)) window.location.assign(d.redirect_url);
      else status(tr('oauth.blocked', 'This app is not one we recognise, so it cannot be connected.'), 'error');
      return;
    }

    el('oauthClient').textContent = (d.client && d.client.name) || '—';
    el('oauthHost').textContent = hostOd(d.redirect_uri);
    el('oauthAccount').textContent = (d.user && d.user.email) || (sesija.user && sesija.user.email) || '—';
    el('oauthDetails').hidden = false;

    if (!dopustenHost(d.redirect_uri)) {
      status(tr('oauth.blocked', 'This app is not one we recognise, so it cannot be connected.'), 'error');
      return;
    }

    el('oauthActions').hidden = false;
    const gumbi = [el('oauthAllow'), el('oauthDeny')];

    async function odluci(dopusti) {
      gumbi.forEach(function (g) { g.disabled = true; });
      status('', '');
      const fn = dopusti ? klijent.auth.oauth.approveAuthorization : klijent.auth.oauth.denyAuthorization;
      const r = await fn.call(klijent.auth.oauth, id, { skipBrowserRedirect: true });
      const kamo = r && r.data && r.data.redirect_url;
      if (r.error || !kamo || !dopustenHost(kamo)) {
        gumbi.forEach(function (g) { g.disabled = false; });
        status(tr('oauth.error', 'That did not work — please try again.'), 'error');
        return;
      }
      status(dopusti ? tr('oauth.done', 'Connected — returning to your AI app…') : tr('oauth.denied', 'Not connected — returning to your AI app…'), 'done');
      window.location.assign(kamo);
    }

    el('oauthAllow').addEventListener('click', function () { odluci(true); });
    el('oauthDeny').addEventListener('click', function () { odluci(false); });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
