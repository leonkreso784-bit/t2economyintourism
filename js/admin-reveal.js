// ===== SOKRAT STUDY — OTKRIVANJE ADMINA (F4.3a) =====
//
// ⚠️ T6: OVA DATOTEKA JE IZREZANA IZ `js/admin.js`, I RAZLOG JE MJERA, NE UREDNOST.
// Editor (studio + block-editor + admin CRUD) seli na vlastitu stranicu da ga posjetitelj
// bez računa više ne preuzima. `admin.js` se pritom NIJE dao preseliti cijel: u njemu je,
// uz uređivanje, živjelo i „jesi li ti admin" — a to aplikacija treba i onda kad editora
// NEMA, jer o tome ovisi otkrivanje jedne jedine kartice u profilu (`js/profile.js`).
// Zato rez ne ide po datoteci nego KROZ nju: identitet ostaje ovdje, uređivanje seli.
//
// ⚠️ REDOSLIJED UČITAVANJA JE OBAVEZAN: ova datoteka ide PRIJE `js/admin.js`, jer
// `admin.js` pri samom parsiranju piše `window.SokratAdmin.studioBridge = {…}` — bez
// ovoga bi to bio TypeError, a ne tiho preskočena značajka.
//
// VAŽNO (nepromijenjeno): prava sigurnost je u RLS-u (F4.1 profiles/is_admin + F4.2
// write-policyji) — ne-admin FIZIČKI ne može pisati u bazu. `.admin-only` skrivanje je samo UX.

const SokratAdmin = (function () {
  'use strict';

  let isAdminCache = false;

  async function computeIsAdmin() {
    // SokratAuth je top-level `const` (globalni leksički binding), NIJE window property → referenciraj golo (kao profile/cloud-sync).
    const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
    if (!auth || typeof auth.getClient !== 'function') return false;
    const client = auth.getClient();
    const user = (typeof auth.getUser === 'function') ? auth.getUser() : null;
    if (!client || !user) return false;                 // nema sesije → nije admin
    try {
      const res = await client.rpc('is_admin');
      return !!(res && res.data === true && !res.error);
    } catch (e) {
      return false;                                     // mreža/RPC padne → tretiraj kao ne-admin
    }
  }

  // Otkrij/sakrij sve .admin-only elemente prema keširanom statusu.
  // Inline style pobjeđuje CSS (bez potrebe za CSS pravilom); '' vraća na stylesheet default.
  function applyVisibility() {
    document.querySelectorAll('.admin-only').forEach(function (el) {
      el.style.display = isAdminCache ? '' : 'none';
    });
    document.body.classList.toggle('sokrat-is-admin', isAdminCache);
  }

  async function refresh() {
    isAdminCache = await computeIsAdmin();
    applyVisibility();
    return isAdminCache;
  }

  function isAdmin() { return isAdminCache; }

  function init() {
    // Osvježi na svaku promjenu auth-stanja (login/logout/početna sesija iz spremljenog tokena).
    if (typeof SokratAuth !== 'undefined' && typeof SokratAuth.onChange === 'function') {
      SokratAuth.onChange(function () { refresh(); });
    }
    refresh(); // početno (ako je sesija već prisutna)
  }

  // Otkrivanje visi o životnom ciklusu STRANICE, ne o editoru: `init()` se veže na promjenu
  // auth-stanja i osvježi vidljivost. Namještaj admin-stranice (ulazni gumb, „natrag") je
  // s T6 u `js/admin.js`, jer živi i pada zajedno s tom stranicom.
  // ⚠️ NE SAMO `DOMContentLoaded`. Od učitavanja po ruti ova skripta stiže s paketom
  // `profile`, dakle DAVNO nakon tog događaja — slušač koji čeka nešto što se već dogodilo
  // ne okine se nikad, pa se admin-kartica ne bi otkrila baš onome tko je otvorio profil.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { refresh: refresh, isAdmin: isAdmin, applyVisibility: applyVisibility };
})();

window.SokratAdmin = SokratAdmin;

