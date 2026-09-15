// ===== SOKRAT STUDY — izbornik „⋯" retka (F2/5b, izvučen u F2/5c) =====
//
// JEDNO ponašanje za svaki „⋯" na stranici „Moji materijali": redak radionice, „+ Novo" u traci
// (`js/my-materials.js`) i pločica police skinutog (`js/offline-store.js`). Do F2/5c je živjelo u
// `my-materials.js`; polica je drugi paket (radi i bez prijave), pa bi inače dobila DRUGU kopiju —
// a ovo je kod koji je u pregledu 15.09. trebao šest popravaka (ADR-027: jedna činjenica, jedno mjesto).
//
// UGOVOR (markup piše vlasnik izbornika, ovaj modul daje ponašanje):
//   • vlasnik nosi `data-menu-scope`; u njemu JEDAN gumb `[data-mm-more]` (aria-haspopup="menu",
//     aria-expanded, aria-controls) i JEDAN `.mm-menu` (role="menu") sa stavkama `[role="menuitem"]`;
//   • atribut za `.mm-menu` daje `SokratRowMenu.attr()` (`popover="auto"` ili `hidden`);
//   • radnju stavke obrađuje vlasnik (vlastitim rukovateljem klika) — modul samo ZATVORI izbornik
//     prije nje, da izbornik ne visi preko potvrde / unosa / prozora koji radnja otvara.
//
// Izbornik je `popover` (gornji sloj): DOM mu ostaje u vlasniku, pa `closest(...)` iz stavke nađe
// redak, a nijedan `overflow: hidden` ga ne reže. Bez Popover API-ja (Safari < 17) isti element
// s `hidden` i istim ponašanjem, samo bez gornjeg sloja.

(function (window) {
  'use strict';

  const doc = window.document;
  const HAS_POPOVER = typeof HTMLElement !== 'undefined'
    && Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover');

  function attr() { return HAS_POPOVER ? 'popover="auto"' : 'hidden'; }

  function isOpen(menu) {
    if (!menu) return false;
    if (HAS_POPOVER) { try { return menu.matches(':popover-open'); } catch (e) { return false; } }
    return !menu.hidden;
  }

  function scopeOf(el) { return el && el.closest ? el.closest('[data-menu-scope]') : null; }
  function buttonOf(menu) { const s = scopeOf(menu); return s && s.querySelector('[data-mm-more]'); }
  function openMenus() { return Array.prototype.filter.call(doc.querySelectorAll('.mm-menu'), isOpen); }

  function sync(menu, open) {
    const btn = buttonOf(menu);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeAll() {
    openMenus().forEach(function (m) {
      if (HAS_POPOVER) m.hidePopover(); else m.hidden = true;
      sync(m, false);
    });
  }

  /** Uz gumb: poravnat uz BLIŽI rub („⋯" desno, „+ Novo" lijevo); ispod — ili iznad ako dolje ne stane. */
  function place(menu, btn) {
    const r = btn.getBoundingClientRect();
    const mw = menu.offsetWidth || 200;
    const mh = menu.offsetHeight || 200;
    // Lijevi rub, ne središte: „+ Novo" je na telefonu pune širine, pa mu je središte točno na polovici.
    let left = Math.round((r.left < window.innerWidth / 2) ? r.left : r.right - mw);
    left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
    let top = r.bottom + 4;
    // Donji rub nije `innerHeight`: cookie-banner (`--bottom-inset`, js/consent.js) presreće
    // pokazivač — isti razlog kao izbornik blokova u Studiju.
    const donji = parseFloat(getComputedStyle(doc.documentElement).getPropertyValue('--bottom-inset')) || 0;
    if (top + mh > window.innerHeight - donji - 8) top = Math.max(8, r.top - mh - 4);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  // ⚠️ Drugi dodir na „⋯" mora ZATVORITI izbornik. Popover `auto` se zatvara već na PRITISAK izvan
  //    sebe (a „⋯" je izvan), pa bi klik stigao na zatvoren izbornik i otvorio ga ponovno — izmjereno
  //    u `radionica.authed.spec.js` ②. Zato se pamti je li izbornik bio otvoren u trenutku PRITISKA.
  let otvorenPriPritisku = null;

  function open(scope) {
    const menu = scope && scope.querySelector('.mm-menu');
    const btn = scope && scope.querySelector('[data-mm-more]');
    if (!menu || !btn) return;
    const bio = isOpen(menu) || otvorenPriPritisku === menu;
    otvorenPriPritisku = null;
    closeAll();
    if (bio) return;                              // drugi dodir na „⋯" zatvara
    if (HAS_POPOVER) menu.showPopover(); else menu.hidden = false;
    place(menu, btn);                             // izmjereno tek kad je vidljiv, prije iscrtavanja
    sync(menu, true);
    const prvi = menu.querySelector('[role="menuitem"]');
    if (prvi) prvi.focus();
  }

  /** Izbornik zatvoren izvana (klik mimo, Escape): `aria-expanded` natrag, fokus na „⋯" ako je bio u izborniku. */
  function onClosed(menu) {
    sync(menu, false);
    const a = doc.activeElement;
    if (!a || a === doc.body || menu.contains(a)) {
      const btn = buttonOf(menu);
      if (btn) btn.focus();
    }
  }

  if (doc && typeof doc.addEventListener === 'function') {
    doc.addEventListener('pointerdown', function (e) {
      const b = e.target.closest && e.target.closest('[data-mm-more]');
      const s = b && scopeOf(b);
      const m = s && s.querySelector('.mm-menu');
      otvorenPriPritisku = (m && isOpen(m)) ? m : null;
    }, true);

    // „⋯" otvara; stavka PRVO zatvori (radnju zatim obradi vlasnik svojim rukovateljem).
    doc.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      const more = e.target.closest('[data-mm-more]');
      if (more && scopeOf(more)) { open(scopeOf(more)); return; }
      if (e.target.closest('.mm-menu [role="menuitem"]')) closeAll();
    });

    // `toggle` ne mjehuri → hvata se u fazi hvatanja. Samo za popover-put.
    doc.addEventListener('toggle', function (e) {
      const m = e.target;
      if (m && m.classList && m.classList.contains('mm-menu') && e.newState === 'closed') onClosed(m);
    }, true);
    if (!HAS_POPOVER) {
      doc.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('.mm-menu, [data-mm-more]')) closeAll();
      }, true);
    }

    doc.addEventListener('keydown', function (e) {
      const u = e.target.closest && e.target.closest('.mm-menu');
      // Tab u izborniku (APG „menu button"): zatvori i vrati fokus na „⋯" — preglednikov Tab zatim
      // nastavlja OD njega (naprijed ili, uz Shift, natrag), kao da izbornik nije ni bio otvoren.
      if (u && e.key === 'Tab' && isOpen(u)) {
        const b = buttonOf(u);
        closeAll();
        if (b) b.focus();
        return;
      }
      // `role="menu"` obećava strelice (ARIA APG): ↓/↑ kruže stavkama, Home/End na prvu/zadnju.
      if (u && ['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) !== -1) {
        const items = Array.prototype.slice.call(u.querySelectorAll('[role="menuitem"]'));
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(doc.activeElement);
        const n = e.key === 'Home' ? 0
          : e.key === 'End' ? items.length - 1
          : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[n].focus();
        return;
      }
      if (e.key !== 'Escape' || HAS_POPOVER) return;
      const otvoren = openMenus()[0];
      if (otvoren) { closeAll(); onClosed(otvoren); }
    });

    // Fokus koji ODE iz izbornika ga zatvara. ⚠️ Samo kad fokus stvarno ode negdje (`relatedTarget`):
    // Safari na klik ne fokusira gumb, pa dodir na stavku daje `focusout` BEZ cilja — zatvaranje
    // tada bi pojelo klik na stavku.
    doc.addEventListener('focusout', function (e) {
      const m = e.target.closest && e.target.closest('.mm-menu');
      const to = e.relatedTarget;
      if (!m || !to || !isOpen(m) || m.contains(to) || buttonOf(m) === to) return;
      closeAll();
    });

    // Izbornik stoji na FIKSNOM mjestu ekrana; kad se stranica pomakne, „⋯" ode, a izbornik ne.
    // Zato ga pomak PREMJESTI uz njegov gumb, a zatvori tek kad gumb izađe s ekrana.
    // ⚠️ Ne zatvarati na svaki pomak: `scroll-behavior: smooth` (i zamah prsta na iPhoneu) nastavi
    //    klizati i POSLIJE dodira na „⋯" — izmjereno u `radionica` ②: izbornik se otvarao i odmah zatvarao.
    const pratiPomak = function (e) {
      if (e && e.target && e.target.closest && e.target.closest('.mm-menu')) return;
      const otvoren = openMenus()[0];
      if (!otvoren) return;
      const btn = buttonOf(otvoren);
      const r = btn && btn.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) { closeAll(); return; }
      place(otvoren, btn);
    };
    window.addEventListener('scroll', pratiPomak, { capture: true, passive: true });
    window.addEventListener('resize', pratiPomak, { passive: true });
  }

  window.SokratRowMenu = { attr: attr, open: open, closeAll: closeAll, isOpen: isOpen, HAS_POPOVER: HAS_POPOVER };
})(window);
