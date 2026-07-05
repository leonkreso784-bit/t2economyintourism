/* sw-register.js — registrira Service Worker (F3 3A). Progressive enhancement:
 * fail-safe (nikad ne ruši app), bez pisanja u UI osim update-toasta. `updateViaCache:'none'` →
 * preglednik NIKAD ne servira sw.js iz HTTP keša pri update-checku (zaobilazi vercel.json immutable).
 *
 * UPDATE-FLOW (F3 3A.3): kad je NOVI sw.js instaliran dok stranicu kontrolira stari (= čeka na
 * aktivaciju), pokaži <sokrat-toast> „Nova verzija je spremna — dodirni za nadogradnju".
 * Dodir → pošalji 'sw:skipWaiting' čekajućem SW-u (hook u sw.js) → 'controllerchange' → JEDAN reload.
 * Bez dodira se ništa ne mijenja (NE auto-reload — korisnik može biti usred kviza); novi SW ionako
 * preuzme pri sljedećem punom otvaranju appa. Reload je STROGO uvjetovan korisnikovim pristankom
 * (guard-flag) — 'controllerchange' se okida i pri PRVOJ instalaciji (clients.claim) i tada NE
 * smije reloadati. */
(function () {
  if (!('serviceWorker' in navigator)) return;

  // Reload SAMO kad je korisnik prihvatio nadogradnju (dodirnuo toast) — nikad na prvi install/claim.
  var userAcceptedUpdate = false;
  var reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!userAcceptedUpdate || reloaded) return;
    reloaded = true; // čuvar od reload-petlje
    window.location.reload();
  });

  var prompted = false;
  /** Pokaži update-toast (jednom po učitavanju stranice). @param {ServiceWorkerRegistration} reg */
  function promptUpdate(reg) {
    if (prompted) return;
    prompted = true;
    var msg = (typeof window.t === 'function')
      ? window.t('sw.updateReady')
      : 'New version is ready — tap to update';
    if (typeof window.showToast !== 'function') return; // bez UI-ja nema prompta; update dođe restartom
    window.showToast(msg, {
      duration: 12000, // duže od običnog toasta (2.5 s) — ovo je poziv na akciju, ne obavijest
      onClick: function () {
        userAcceptedUpdate = true;
        if (reg.waiting) reg.waiting.postMessage('sw:skipWaiting'); // → activate → controllerchange → reload
        else window.location.reload(); // rub: worker se u međuvremenu već aktivirao
      }
    });
  }

  /** Prati registraciju: postojeći čekajući SW + budući `updatefound`.
   *  `navigator.serviceWorker.controller` razlikuje UPDATE (postoji stari kontrolor) od prve
   *  instalacije (nema kontrolora → bez prompta). @param {ServiceWorkerRegistration} reg */
  function watchRegistration(reg) {
    if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg);
    reg.addEventListener('updatefound', function () {
      var w = reg.installing;
      if (!w) return;
      w.addEventListener('statechange', function () {
        if (w.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(reg);
      });
    });
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then(watchRegistration)
      .catch(function () { /* tiho — SW je opcionalno ubrzanje, ne smije srušiti stranicu */ });
  });

  // Globalni kill-switch iz konzole ako SW ikad zaglavi: window.__swKill()
  window.__swKill = function () {
    navigator.serviceWorker.getRegistrations().then(function (rs) {
      rs.forEach(function (r) { if (r.active) r.active.postMessage('sw:unregister'); r.unregister(); });
    });
  };
})();
