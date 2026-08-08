/* =====================================================================
 * sw.js — Sokrat Study Service Worker (F3 3A). Konzervativan, offline-sposoban app-shell.
 *
 * STRATEGIJA (sigurnost prvo — SW može „zaglaviti" stranicu na stari keš):
 *  • Samo SAME-ORIGIN GET se presreće. Sve ostalo (Supabase auth/sadržaj, CDN fontovi/KaTeX,
 *    POST/PUT) → čista mreža (SW se NE miješa) → login/sync nikad iz keša.
 *  • Navigacija (index.html) = NETWORK-FIRST → fallback na keš (offline shell). Novi deploy s
 *    novim `?v=` tokenima se UVIJEK pokupi (index.html se ne servira immutable).
 *  • Statički asseti (js/css/json/slike; verzionirani `?v=` = immutable URL) = STALE-WHILE-REVALIDATE
 *    (posluži keš odmah, osvježi u pozadini) → brzo + samo-liječivo.
 *  • NE `skipWaiting` — novi SW aktivira se tek kad se stare stranice zatvore (bez mismatcha
 *    novi-asset/stari-JS usred sesije). `activate` čisti stare cache-verzije.
 *  • `SW_VERSION` bumpa `npm run bump` (jedan broj za cijelu app) → svaki deploy = nova sw.js =
 *    novi cache = purge starog. Registrira se s `updateViaCache:'none'` (zaobilazi HTTP cache).
 *  • Kill-switch: `postMessage('sw:unregister')` → SW se sam odjavi + očisti kešove.
 * ===================================================================== */
'use strict';

const SW_VERSION = '20260808032805'; // bumpan `npm run bump` (usklađen s ?v= i CONTENT_VERSION)
const CACHE = 'sokrat-cache-' + SW_VERSION;

// Minimalni precache: navigacijski shell. Ostalo se kešira runtime-om po verzioniranom URL-u
// (robusnije od hardkodirane liste — ne mora se održavati u koraku s tokenima).
// CSS bundle MORA nositi `?v=` ključ: HTML ga traži kao `styles.bundle.css?v=TOKEN`, a cache-match
// NE ignorira query → bez tokena bi precache unos bio mrtav (nikad pogođen). ADR-017 jamči da je
// SW_VERSION identičan tokenu u HTML-u (`npm run bump` postavlja oba; `bump:check` = CI gate).
// manifest.json se u HTML-u referencira BEZ tokena → ostaje neverzioniran.
const PRECACHE = ['/', '/index.html', '/styles.bundle.css?v=' + SW_VERSION, '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .catch(() => { /* precache je best-effort; ne ruši instalaciju */ })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('sokrat-cache-') && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg === 'sw:skipWaiting') {
    self.skipWaiting();
  } else if (msg === 'sw:unregister') {
    // Kill-switch: očisti sve kešove pa se odjavi (stranica se vrati na čistu mrežu nakon reloada).
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sokrat-cache-')).map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Samo same-origin GET. Sve ostalo (Supabase/CDN/non-GET) → mreža, SW se ne miješa.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navigacija → network-first (novi deploy uvijek svjež), fallback na keširani shell (offline).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Keširaj SAMO uspješan odgovor — 404/500 ne smije pregaziti dobar offline shell.
          if (res && res.ok) {
            // waitUntil: preglednik ne smije ugasiti SW prije nego upis u keš završi.
            event.waitUntil(caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {}));
          }
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('/index.html')))
    );
    return;
  }

  // Statički asset → stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            // waitUntil legalan: vanjski waitUntil(networkDone) niže drži event živim do ovog trena.
            event.waitUntil(caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {}));
          }
          return res;
        })
        .catch(() => cached);
      // Drži SW živim dok revalidacija (i upis u keš) ne završi — i kad je odgovor već otišao iz keša.
      event.waitUntil(network.then(() => {}, () => {}));
      return cached || network;
    })
  );
});
