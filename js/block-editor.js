// ===== SOKRAT STUDY — BLOCK EDITOR (U8a) =====
//
// Vizualni editor learn-blokova (schema v2). Renderira `learn.blocks` kao editabilne
// „kvadratiće" (vizual = design/mockups/editor-c-tok.html) sa strukturnim kontrolama
// (↑↓ presloži · ✕ ukloni · ＋ dodaj) koje se u U8a-2 ožičuju na U7e draft-ops
// (addBlock/removeBlock/reorderBlocks/updateLearnBlock).
//
// U8a-1 JE IZOLIRAN (obrazac kao U7b blocks-renderer): definira `window.SokratBlockEditor`
// s ČISTIM `renderEditor(blocks)` → HTML string; `mount()` + event-wiring + CSS + integracija
// u admin dolaze u U8a-2. **Preview SADRŽAJA bloka ide kroz `renderBlocks` (U7c granica)** →
// editor i study dijele JEDAN sigurni renderer (nema drugog puta do HTML-a).

(function () {
  'use strict';

  // ── esc (lokalna kopija; editor ne ovisi o internom helperu renderera) ──
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  // ── sadržaj bloka kroz JEDAN renderer (sigurnosna granica); ako renderer još nije učitan → prazno ──
  function preview(block) {
    if (typeof window !== 'undefined' && typeof window.renderBlocks === 'function') {
      return window.renderBlocks([block]);
    }
    return '';
  }

  // ── ljudski naziv tipa (badge) ──
  const TYPE_LABEL = {
    heading: 'Naslov', paragraph: 'Tekst', list: 'Lista', callout: 'Isticanje',
    image: 'Slika', video: 'Video', table: 'Tablica', formula: 'Formula', 'legacy-html': 'HTML'
  };

  // ── jedna blok-kartica (glava s kontrolama + tijelo = preview) ──
  function blockCard(block, i, total) {
    const id = block && block.id != null ? String(block.id) : '';
    const type = block && block.type ? String(block.type) : '?';
    const label = TYPE_LABEL[type] || type;
    const upDis = i <= 0 ? ' disabled' : '';
    const downDis = i >= total - 1 ? ' disabled' : '';
    return '<div class="be-block" data-be-block="' + esc(id) + '">' +
      '<div class="be-head">' +
        '<span class="be-n">' + (i + 1) + '</span>' +
        '<span class="be-type">' + esc(label) + '</span>' +
        '<span class="be-ctrls">' +
          '<button type="button" class="be-btn" data-be-act="up" data-be-id="' + esc(id) + '"' + upDis + ' title="Pomakni gore" aria-label="Pomakni gore">↑</button>' +
          '<button type="button" class="be-btn" data-be-act="down" data-be-id="' + esc(id) + '"' + downDis + ' title="Pomakni dolje" aria-label="Pomakni dolje">↓</button>' +
          '<button type="button" class="be-btn be-del" data-be-act="remove" data-be-id="' + esc(id) + '" title="Ukloni blok" aria-label="Ukloni blok">✕</button>' +
        '</span>' +
      '</div>' +
      '<div class="be-body">' + preview(block) + '</div>' +
    '</div>';
  }

  // ── ＋ umetni-ovdje (nosi ciljnu poziciju) ──
  function adder(at) {
    return '<div class="be-adder"><button type="button" class="be-add" data-be-act="add" data-be-at="' + at +
      '" title="Dodaj blok ovdje" aria-label="Dodaj blok">＋</button></div>';
  }

  // ── glavni ulaz: cijeli editor-scaffold za niz blokova (ČISTA fn, bez DOM-a) ──
  function renderEditor(blocks) {
    const arr = Array.isArray(blocks) ? blocks : [];
    let html = '<div class="be-root">';
    if (arr.length === 0) html += '<div class="be-empty">Još nema blokova — dodaj prvi ↓</div>';
    for (let i = 0; i < arr.length; i++) {
      html += adder(i);                 // ＋ prije svakog bloka
      html += blockCard(arr[i], i, arr.length);
    }
    html += adder(arr.length);          // ＋ na kraju
    html += '<button type="button" class="be-bigplus" data-be-act="add" data-be-at="' + arr.length +
      '">＋ Dodaj blok (naslov · tekst · slika · video …)</button>';
    html += '</div>';
    return html;
  }

  // ── U8a-2: tipovi koje ＋ nudi (default-blok po tipu; inline uređivanje teksta = U8a-3/U8b) ──
  // Za sada tekstualni tipovi (media/tablica/formula = U8c, trebaju vlastiti unos).
  const ADD_TYPES = [
    { type: 'heading',   label: 'Naslov',    make: function () { return { type: 'heading', level: 2, text: '' }; } },
    { type: 'paragraph', label: 'Tekst',     make: function () { return { type: 'paragraph', text: '' }; } },
    { type: 'list',      label: 'Lista',     make: function () { return { type: 'list', ordered: false, items: [''] }; } },
    { type: 'callout',   label: 'Isticanje', make: function () { return { type: 'callout', variant: 'info', text: '' }; } }
  ];

  // ── apsolutni ciljni redoslijed s id-om pomaknutim za dir (±1) — hrani U7e reorderBlocks ──
  function swappedOrder(blocks, id, dir) {
    const ids = [];
    for (let i = 0; i < blocks.length; i++) { const b = blocks[i]; if (b && b.id != null) ids.push(b.id); }
    const i = ids.indexOf(id);
    if (i === -1) return null;
    const j = i + dir;
    if (j < 0 || j >= ids.length) return null;
    const out = ids.slice();
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    return out;
  }

  function closeMenu(container) {
    const m = container.querySelector('.be-menu');
    if (m) m.parentNode.removeChild(m);
  }
  function closeAllMenus() {
    if (typeof document === 'undefined') return;
    const ms = document.querySelectorAll('.be-menu');
    for (let i = 0; i < ms.length; i++) ms[i].parentNode.removeChild(ms[i]);
  }
  // Jedan globalni listener: klik izvan menija/＋ zatvara sve otvorene tip-izbornike
  // (vezan JEDNOM, ne po-mountu → nema gomilanja na re-renderu admina).
  if (typeof document !== 'undefined' && document.addEventListener && !window.__beMenuWired) {
    window.__beMenuWired = true;
    document.addEventListener('click', function (e) {
      // ＋ izvori (mali adder `.be-add` I veliki `.be-bigplus`) + sam meni ne smiju zatvoriti meni
      // koji upravo otvaraju (container-handler kreira meni PRIJE nego ovaj bubbling-listener stigne).
      const keep = e.target.closest ? e.target.closest('.be-menu, .be-add, .be-bigplus') : null;
      if (!keep) closeAllMenus();
    });
  }
  function openMenu(anchor, container, pick) {
    closeMenu(container);
    const menu = document.createElement('div');
    menu.className = 'be-menu';
    ADD_TYPES.forEach(function (t) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'be-menu-item';
      b.textContent = t.label;
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        closeMenu(container);
        pick(t.make());
      });
      menu.appendChild(b);
    });
    (anchor.parentNode || container).appendChild(menu);
  }

  // ── mount: renderira u container + ožičuje kontrole (delegat) na ctx.applyOp (host = admin) ──
  // ctx = { catId, getBlocks(): niz, applyOp(op): {ok} }. Re-render vlastitog containera nakon
  // svake op-e (host ne mora full-rerenderati); listener se veže JEDNOM (idempotentno na re-mount).
  function mount(container, ctx) {
    if (!container || typeof document === 'undefined') return;
    container._beCtx = ctx;
    function draw() { container.innerHTML = renderEditor(container._beCtx.getBlocks()); }
    if (!container._beWired) {
      container._beWired = true;
      container.addEventListener('click', function (e) {
        const c = container._beCtx;
        const btn = e.target.closest ? e.target.closest('[data-be-act]') : null;
        if (!btn || !container.contains(btn)) return;
        const act = btn.getAttribute('data-be-act');
        const blocks = (c.getBlocks && c.getBlocks()) || [];
        if (act === 'remove') {
          c.applyOp({ type: 'removeBlock', catId: c.catId, id: btn.getAttribute('data-be-id') });
          draw();
        } else if (act === 'up' || act === 'down') {
          const order = swappedOrder(blocks, btn.getAttribute('data-be-id'), act === 'up' ? -1 : 1);
          if (order) { c.applyOp({ type: 'reorderBlocks', catId: c.catId, order: order }); draw(); }
        } else if (act === 'add') {
          const at = parseInt(btn.getAttribute('data-be-at'), 10);
          openMenu(btn, container, function (item) {
            c.applyOp({ type: 'addBlock', catId: c.catId, item: item, at: isNaN(at) ? undefined : at });
            draw();
          });
        }
      });
    }
    draw();
  }

  // ── izvoz (+ interni helperi za unit-testove) ──
  if (typeof window !== 'undefined') {
    window.SokratBlockEditor = {
      renderEditor: renderEditor,
      mount: mount,
      _esc: esc,
      _blockCard: blockCard,
      _typeLabel: TYPE_LABEL,
      _swappedOrder: swappedOrder,
      _addTypes: ADD_TYPES
    };
  }
})();
