// ===== SOKRAT STUDY — BLOCK EDITOR (U8a jezgra + U8.4 inline uređivanje) =====
//
// Vizualni editor learn-blokova (schema v2). Renderira `learn.blocks` kao editabilne
// „kvadratiće" (vizual = design/mockups/editor-c-tok.html) sa strukturnim kontrolama
// (↑↓ presloži · ✕ ukloni · ＋ dodaj) ožičenim na U7e draft-ops.
//
// U8.4a — INLINE UREĐIVANJE TEKSTA: tekstualni blokovi (heading/paragraph/callout/list)
// renderiraju `contenteditable` polje; upisivanje → focusout → serijalizacija u `inline runs`
// → `updateLearnBlock` op (BEZ re-crtanja, čuva caret). Plutajuća traka B/I (execCommand).
// **SIGURNOSNA GRANICA:** editabilni sadržaj se NIKAD ne sprema kao HTML — `editableToInline`
// destilira DOM u kurirani model `{text,b?,i?,color?,href?}` (prepoznaje samo b/i/link/token-boju;
// ostalo curi u čisti tekst), a `renderInline` (blocks-renderer) escapa/whitelista na prikazu.
// Boja/link u traci = U8.4b (serijalizator ih VEĆ round-trippa radi postojećeg v2 sadržaja).
// Ne-tekstualni blokovi (image/video/table/formula/legacy) = read-only preview kroz `renderBlocks`.

(function () {
  'use strict';

  // ── esc (lokalna kopija; editor ne ovisi o internom helperu renderera) ──
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  // ── sadržaj NE-tekstualnog bloka kroz JEDAN renderer (sigurnosna granica) ──
  function preview(block) {
    if (typeof window !== 'undefined' && typeof window.renderBlocks === 'function') return window.renderBlocks([block]);
    return '';
  }

  // ── ljudski naziv tipa (badge) ──
  const TYPE_LABEL = {
    heading: 'Naslov', paragraph: 'Tekst', list: 'Lista', callout: 'Isticanje',
    image: 'Slika', video: 'Video', table: 'Tablica', formula: 'Formula', 'legacy-html': 'HTML'
  };
  const CALLOUT_VARIANTS = { info: 1, warning: 1, tip: 1 };
  const INLINE_COLORS = { indigo: 1, green: 1, amber: 1, red: 1 }; // 'default' = bez boje (nema spana)
  const TEXT_TYPES = { heading: 1, paragraph: 1, callout: 1, list: 1 };

  // ── inline runs/string → editabilni HTML (ista formatna klasa kao renderer → vizualni paritet) ──
  function runToEditable(run) {
    if (run == null) return '';
    if (typeof run !== 'object') return esc(run);
    let html = esc(run.text);
    if (run.b) html = '<strong>' + html + '</strong>';
    if (run.i) html = '<em>' + html + '</em>';
    if (run.color && INLINE_COLORS[run.color]) html = '<span class="lb-color-' + run.color + '">' + html + '</span>';
    if (run.href) html = '<a href="' + esc(run.href) + '" data-be-link>' + html + '</a>';
    return html;
  }
  function runsToEditable(inline) {
    if (Array.isArray(inline)) return inline.map(runToEditable).join('');
    return runToEditable(inline);
  }

  // ── editabilni DOM → inline runs (destilacija u kurirani model; ovo je sigurnosna granica) ──
  function _emit(out, state, text) {
    if (text === '') return;
    const r = { text: text };
    if (state.b) r.b = true;
    if (state.i) r.i = true;
    if (state.color) r.color = state.color;
    if (state.href) r.href = state.href;
    out.push(r);
  }
  const _BLOCKISH = { DIV: 1, P: 1, LI: 1 };
  function _walk(node, state, out) {
    let child = node.firstChild;
    while (child) {
      if (child.nodeType === 3) {                       // tekst-čvor
        _emit(out, state, child.data);
      } else if (child.nodeType === 1) {                // element
        const tag = child.tagName;
        if (tag === 'BR') { _emit(out, state, ' '); child = child.nextSibling; continue; }
        // blok-element (paste iz više redova) → razmak da se riječi ne spoje
        if (_BLOCKISH[tag] && out.length) { const last = out[out.length - 1]; if (last && !/\s$/.test(last.text)) _emit(out, state, ' '); }
        const ns = { b: state.b, i: state.i, color: state.color, href: state.href };
        if (tag === 'B' || tag === 'STRONG') ns.b = true;
        if (tag === 'I' || tag === 'EM') ns.i = true;
        if (tag === 'A') { const h = child.getAttribute('href'); if (h) ns.href = h; }
        const cm = /(?:^|\s)lb-color-(indigo|green|amber|red)(?:\s|$)/.exec(child.className || '');
        if (cm) ns.color = cm[1];
        _walk(child, ns, out);
      }
      child = child.nextSibling;
    }
  }
  function _sameFmt(a, b) {
    return !!a.b === !!b.b && !!a.i === !!b.i && (a.color || '') === (b.color || '') && (a.href || '') === (b.href || '');
  }
  // root = contenteditable element; vrati plain string (ako nema formata) ili niz runs.
  function editableToInline(root) {
    const raw = [];
    if (root) _walk(root, {}, raw);
    const merged = [];
    for (let i = 0; i < raw.length; i++) {
      const last = merged[merged.length - 1];
      if (last && _sameFmt(last, raw[i])) last.text += raw[i].text;
      else merged.push(raw[i]);
    }
    const runs = merged.filter(function (r) { return r.text !== ''; });
    if (runs.length === 0) return '';
    if (runs.length === 1 && !runs[0].b && !runs[0].i && !runs[0].color && !runs[0].href) return runs[0].text;
    return runs;
  }

  // ── editabilno tijelo tekstualnog bloka (contenteditable polja s data-be-field) ──
  function editField(field, ph, inlineHtml, extraClass) {
    return '<div class="be-edit' + (extraClass ? ' ' + extraClass : '') + '" contenteditable="true" data-be-field="' + field + '"' +
      (ph ? ' data-be-ph="' + esc(ph) + '"' : '') + '>' + inlineHtml + '</div>';
  }
  function editableBody(block) {
    const type = block && block.type;
    if (type === 'heading') {
      let lvl = parseInt(block.level, 10); if (!(lvl >= 2 && lvl <= 4)) lvl = 3;
      return editField('text', 'Naslov…', runsToEditable(block.text), 'be-edit--h' + lvl);
    }
    if (type === 'paragraph') {
      return editField('text', 'Piši tekst…', runsToEditable(block.text));
    }
    if (type === 'callout') {
      const variant = CALLOUT_VARIANTS[block.variant] ? block.variant : 'info';
      const title = (block.title != null && String(block.title) !== '')
        ? '<div class="lb-callout__title">' + esc(block.title) + '</div>' : '';
      return '<div class="lb-callout lb-callout--' + variant + '">' + title +
        editField('text', 'Tekst isticanja…', runsToEditable(block.text), 'lb-callout__body') + '</div>';
    }
    if (type === 'list') {
      const tag = block.ordered ? 'ol' : 'ul';
      const items = (Array.isArray(block.items) && block.items.length) ? block.items : [''];
      const lis = items.map(function (it) {
        return '<li class="be-edit" contenteditable="true" data-be-field="items" data-be-ph="Stavka…">' + runsToEditable(it) + '</li>';
      }).join('');
      return '<' + tag + ' class="lb-list be-editlist">' + lis + '</' + tag + '>';
    }
    return preview(block);                              // image/video/table/formula/legacy = read-only
  }

  // ── jedna blok-kartica (glava s kontrolama + tijelo = editabilno/preview) ──
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
      '<div class="be-body">' + editableBody(block) + '</div>' +
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

  // ── tipovi koje ＋ nudi (default-blok po tipu) ──
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
  // Jedan globalni listener: klik izvan menija/＋ zatvara sve otvorene tip-izbornike.
  if (typeof document !== 'undefined' && document.addEventListener && !window.__beMenuWired) {
    window.__beMenuWired = true;
    document.addEventListener('click', function (e) {
      // ＋ izvori (mali `.be-add` I veliki `.be-bigplus`) + sam meni ne smiju zatvoriti meni
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

  // ── plutajuća tekst-traka (B/I; boja/link = U8.4b). Singleton, vezan JEDNOM. ──
  function ensureToolbar() {
    if (typeof document === 'undefined') return null;
    if (window.__beToolbar) return window.__beToolbar;
    const bar = document.createElement('div');
    bar.className = 'be-toolbar';
    bar.innerHTML =
      '<button type="button" class="be-tb" data-be-fmt="bold" title="Podebljano"><b>B</b></button>' +
      '<button type="button" class="be-tb" data-be-fmt="italic" title="Kurziv"><em>I</em></button>';
    document.body.appendChild(bar);
    bar.addEventListener('mousedown', function (e) {
      const b = e.target.closest ? e.target.closest('[data-be-fmt]') : null;
      if (!b) return;
      e.preventDefault();                               // NE gubi selekciju/fokus editabilnog
      try { document.execCommand('styleWithCSS', false, false); } catch (_) {}  // <b>/<i> tagovi, ne inline-style
      try { document.execCommand(b.getAttribute('data-be-fmt')); } catch (_) {}
    });
    window.__beToolbar = bar;
    return bar;
  }
  function hideToolbar() { if (typeof window !== 'undefined' && window.__beToolbar) window.__beToolbar.classList.remove('on'); }
  if (typeof document !== 'undefined' && document.addEventListener && !window.__beToolbarWired) {
    window.__beToolbarWired = true;
    document.addEventListener('selectionchange', function () {
      const bar = ensureToolbar();
      if (!bar) return;
      const sel = document.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed) { hideToolbar(); return; }
      const a = sel.anchorNode;
      const node = a && (a.nodeType === 1 ? a : a.parentElement);
      if (!node || !node.closest || !node.closest('[data-be-field]')) { hideToolbar(); return; }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      const vw = window.innerWidth || 800;
      bar.style.left = Math.max(8, Math.min(r.left, vw - 110)) + 'px';
      bar.style.top = Math.max(8, r.top - 44) + 'px';
      bar.classList.add('on');
    });
  }

  // ── mount: renderira u container + ožičuje kontrole (delegat) na ctx.applyOp (host = admin/Studio) ──
  // ctx = { catId, getBlocks(): niz, applyOp(op): {ok} }. Strukturne ops re-crtaju container;
  // inline-tekst (focusout) sprema BEZ re-crtanja (čuva caret; DOM već ima tekst).
  function mount(container, ctx) {
    if (!container || typeof document === 'undefined') return;
    container._beCtx = ctx;
    ensureToolbar();
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

      // U8.4a: inline-tekst → draft (updateLearnBlock) na focusout; BEZ draw() (caret/fokus ostaju).
      container.addEventListener('focusout', function (e) {
        const ed = e.target.closest ? e.target.closest('[data-be-field]') : null;
        if (!ed || !container.contains(ed)) return;
        const c = container._beCtx;
        const blockEl = ed.closest('[data-be-block]');
        const id = blockEl ? blockEl.getAttribute('data-be-block') : '';
        if (!id) return;
        const field = ed.getAttribute('data-be-field');
        let patch;
        if (field === 'items') {
          const lis = blockEl.querySelectorAll('[data-be-field="items"]');
          const items = [];
          for (let k = 0; k < lis.length; k++) items.push(editableToInline(lis[k]));
          patch = { items: items };
        } else {
          patch = {};
          patch[field] = editableToInline(ed);
        }
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: patch });
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
      _addTypes: ADD_TYPES,
      _runsToEditable: runsToEditable,   // U8.4a serijalizator (runs → editabilni HTML)
      _editableToInline: editableToInline, // U8.4a serijalizator (DOM → runs/string)
      _editableBody: editableBody
    };
  }
})();
