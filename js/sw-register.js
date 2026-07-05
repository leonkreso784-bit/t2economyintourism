/* sw-register.js — registrira Service Worker (F3 3A). Progressive enhancement:
 * fail-safe (nikad ne ruši app), bez pisanja u UI. `updateViaCache:'none'` → preglednik
 * NIKAD ne servira sw.js iz HTTP keša pri update-checku (zaobilazi vercel.json immutable). */
(function () {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .catch(function () { /* tiho — SW je opcionalno ubrzanje, ne smije srušiti stranicu */ });
  });
  // Globalni kill-switch iz konzole ako SW ikad zaglavi: window.__swKill()
  window.__swKill = function () {
    navigator.serviceWorker.getRegistrations().then(function (rs) {
      rs.forEach(function (r) { if (r.active) r.active.postMessage('sw:unregister'); r.unregister(); });
    });
  };
})();
