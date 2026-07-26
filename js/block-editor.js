// ===== SOKRAT STUDY — BLOCK EDITOR (U8a jezgra + U8.4 inline uređivanje) =====
//
// Vizualni editor learn-blokova (schema v2). Renderira `learn.blocks` kao editabilne
// „kvadratiće" (vizual = design/mockups/editor-c-tok.html) sa strukturnim kontrolama
// (↑↓ presloži · ✕ ukloni · ＋ dodaj) ožičenim na U7e draft-ops.
//
// U8.4a — INLINE UREĐIVANJE TEKSTA: tekstualni blokovi (heading/paragraph/callout/list)
// renderiraju `contenteditable` polje; upisivanje → focusout → serijalizacija u `inline runs`
// → `updateLearnBlock` op (BEZ re-crtanja, čuva caret). Plutajuća traka B/I (execCommand).
// U8.4b — BOJA + LINK u traci: 4 swatch-a (`lb-color-<token>`) + „ukloni boju"; 🔗 = prompt za URL
// (prazno = ukloni link) → ručno omatanje selekcije u `<span class="lb-color-…">` / `<a href>`
// (execCommand ne može stvoriti klasu; ručno omatanje je konzistentno i za link).
// **SIGURNOSNA GRANICA:** editabilni sadržaj se NIKAD ne sprema kao HTML — `editableToInline`
// destilira DOM u kurirani model `{text,b?,i?,color?,href?}` (prepoznaje samo b/i/link/token-boju;
// ostalo curi u čisti tekst), a `renderInline` (blocks-renderer) escapa/whitelista + `safeUrl` na prikazu.
// U8.5 — MEDIA/STRUKTURNI blokovi = forma-polja (`data-be-mfield` tekst · `data-be-mcheck` boolean · `.be-tcell`
// grid) + živi preview kroz JEDAN renderer: slika (a) · video (b) · formula (c, KaTeX preko `renderMath`) ·
// tablica (d, 2D grid + dodaj/obriši red-stupac + header-toggle). Autor NIKAD ne piše HTML — samo vrijednosti
// polja (src/alt/tex/ćelije…) koje renderer escapa/sanitizira. `legacy-html` = read-only preview.

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
  // ── MEDIA/STRUKTURNI blokovi (slika/video/formula/tablica + MathLive) izdvojeni u
  //    js/block-editor-media.js (T1 rez); jezgra ih dobiva preko tvornice window.__beMedia,
  //    injektirajući `esc` + `preview` (JEDAN renderer). Node-testovi učitavaju oba u ISTI window. ──
  const _media = (typeof window !== 'undefined' && typeof window.__beMedia === 'function')
    ? window.__beMedia({ esc: esc, preview: preview }) : {};
  const inlineToPlain = _media.inlineToPlain, mediaImageBody = _media.mediaImageBody,
    mediaVideoBody = _media.mediaVideoBody, mediaFormulaBody = _media.mediaFormulaBody,
    mediaTableBody = _media.mediaTableBody, mediaPreviewHtml = _media.mediaPreviewHtml,
    typesetFormulas = _media.typesetFormulas, enhanceMathFields = _media.enhanceMathFields,
    tableModel = _media.tableModel, readGridCells = _media.readGridCells, colCountOf = _media.colCountOf,
    imageResizePointerDown = _media.imageResizePointerDown, parsePastedTable = _media.parsePastedTable;
  function findBlockById(blocks, id) {
    for (let k = 0; k < blocks.length; k++) if (blocks[k] && String(blocks[k].id) === String(id)) return blocks[k];
    return null;
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
      // U8.5e: varijanta + naslov postaju uredljivi — kurirane vrijednosti koje renderer VEĆ
      // podržava (lb-callout--info/warning/tip + title). Naslov = mfield (hvata ga postojeći
      // change-handler; prazno → null briše ključ). Statični title-div se u EDITORU ne crta
      // (input ga zamjenjuje); student-render (renderCallout) nepromijenjen.
      const CVAR_LABEL = { info: 'ℹ️ Info', warning: '⚠️ Upozorenje', tip: '💡 Savjet' };
      let ctrls = '<div class="be-cvars">';
      Object.keys(CALLOUT_VARIANTS).forEach(function (v) {
        ctrls += '<button type="button" class="be-cvar' + (v === variant ? ' on' : '') +
          '" data-be-cvar="' + v + '">' + (CVAR_LABEL[v] || v) + '</button>';
      });
      ctrls += '<input type="text" class="be-mfield be-cvtitle" data-be-mfield="title" placeholder="Naslov isticanja (opcionalno)" value="' +
        esc(block.title == null ? '' : block.title) + '"></div>';
      return ctrls + '<div class="lb-callout lb-callout--' + variant + '">' +
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
    if (type === 'image') return mediaImageBody(block); // U8.5a: slika = forma (src/alt/caption) + živi preview
    if (type === 'video') return mediaVideoBody(block); // U8.5b: video = forma (YouTube link/ID) + facade preview
    if (type === 'formula') return mediaFormulaBody(block); // U8.5c: formula = tex-polje + prekidač + živi KaTeX preview
    if (type === 'table') return mediaTableBody(block); // U8.5d: tablica = 2D grid-forma + živi preview
    return preview(block);                              // legacy = read-only
  }

  // ── jedna blok-kartica (glava s kontrolama + tijelo = editabilno/preview) ──
  function blockCard(block, i, total) {
    const id = block && block.id != null ? String(block.id) : '';
    const type = block && block.type ? String(block.type) : '?';
    const label = TYPE_LABEL[type] || type;
    const upDis = i <= 0 ? ' disabled' : '';
    const downDis = i >= total - 1 ? ' disabled' : '';
    // K3 (D2): tip-labela uklonjena (chrome stanjen) → tip ostaje kao `title` na broju (hover/a11y).
    return '<div class="be-block" data-be-block="' + esc(id) + '">' +
      '<div class="be-head">' +
        '<span class="be-n" title="' + esc(label) + '">' + (i + 1) + '</span>' +
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
    { type: 'callout',   label: 'Isticanje', make: function () { return { type: 'callout', variant: 'info', text: '' }; } },
    { type: 'image',     label: 'Slika',     make: function () { return { type: 'image', src: '', alt: '' }; } },
    { type: 'video',     label: 'Video',     make: function () { return { type: 'video', url: '' }; } },
    { type: 'formula',   label: 'Formula',   make: function () { return { type: 'formula', tex: '', display: true }; } },
    { type: 'table',     label: 'Tablica',   make: function () { return { type: 'table', header: ['', ''], rows: [['', ''], ['', '']] }; } }
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
    // Meniji žive na document.body (ne u containeru) → zatvaranje je uvijek globalno.
    closeAllMenus();
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
    // Na BODY s fixed-pozicijom od sidra (kao .be-toolbar): meni u containeru je nasljeđivao
    // opacity/stacking predaka (.be-adder opacity:0, .st-card) → bio poluproziran/prekriven.
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { left: 0, right: 0, top: 0, bottom: 0 };
    const mw = menu.offsetWidth || 150, mh = menu.offsetHeight || 200;
    let left = Math.round(r.left + ((r.right - r.left) - mw) / 2);   // centriran ispod sidra
    left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
    let top = r.bottom + 4;
    if (top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 4);  // ne stane dolje → iznad
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  // ── polje [data-be-field] koje sadrži trenutnu selekciju (ili null) ──
  function selectionField() {
    if (typeof document === 'undefined') return null;
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const a = sel.anchorNode;
    const node = a && (a.nodeType === 1 ? a : a.parentElement);
    return node && node.closest ? node.closest('[data-be-field]') : null;
  }

  // ── ukloni sve lb-color spanove u fragmentu (zadrži djecu) — spriječi ugniježđene boje ──
  function unwrapColorSpans(root) {
    if (!root || !root.querySelectorAll) return;
    const spans = root.querySelectorAll('span[class*="lb-color-"]');
    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      while (s.firstChild) s.parentNode.insertBefore(s.firstChild, s);
      s.parentNode.removeChild(s);
    }
  }

  // ── boja selekcije = omotaj u <span class="lb-color-token"> (token='default' → ukloni boju).
  //    Serijalizator (editableToInline) čita lb-color klasu → boja round-trippa. ──
  function applyColor(token) {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    if (!selectionField()) return;                      // samo unutar editabilnog polja
    const range = sel.getRangeAt(0);
    const frag = range.extractContents();
    unwrapColorSpans(frag);                             // makni staru boju (bez ugnježđivanja)
    let first, last;
    if (token && token !== 'default' && INLINE_COLORS[token]) {
      const span = document.createElement('span');
      span.className = 'lb-color-' + token;
      span.appendChild(frag);
      range.insertNode(span);
      first = last = span;
    } else {
      first = frag.firstChild; last = frag.lastChild;   // 'default' = bez omotača (čisti tekst)
      range.insertNode(frag);
    }
    if (first && last) {                                // zadrži selekciju (traka ostaje, ulanči)
      const r = document.createRange();
      r.setStartBefore(first); r.setEndAfter(last);
      sel.removeAllRanges(); sel.addRange(r);
    }
  }

  // ── link: pretvori selekciju u <a href> (prazan URL = ukloni link). Serijalizator čita href;
  //    safeUrl (renderer) ostaje granica na PRIKAZU. Ovdje light-provjera sheme na UNOSU. ──
  function sanitizeLink(url) {
    const u = String(url == null ? '' : url).trim();
    if (!u) return '';
    const m = u.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);   // ima li eksplicitnu shemu?
    if (m) {
      const s = m[1].toLowerCase();
      return (s === 'http' || s === 'https' || s === 'mailto') ? u : '';  // javascript:/data:/… = odbij
    }
    if (u.charAt(0) === '#' || u.charAt(0) === '/') return u;  // relativni / #anchor → OK
    return 'https://' + u;                              // goli domen → dodaj https://
  }
  function unwrapEls(frag, tag) {
    const els = frag && frag.querySelectorAll ? frag.querySelectorAll(tag) : [];
    for (let i = 0; i < els.length; i++) { const el = els[i]; while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el); el.parentNode.removeChild(el); }
  }
  function reselectRange(first, last) {
    if (!first || !last) return;
    const sel = document.getSelection();
    const r = document.createRange(); r.setStartBefore(first); r.setEndAfter(last);
    sel.removeAllRanges(); sel.addRange(r);
  }
  function enclosingHref(range) {                       // href linka koji obuhvaća selekciju (za predpopunu)
    let n = range.commonAncestorContainer;
    n = n && (n.nodeType === 1 ? n : n.parentElement);
    const a = n && n.closest ? n.closest('a') : null;
    return a ? (a.getAttribute('href') || '') : '';
  }
  function promptLink() {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    if (!selectionField()) return;
    const range = sel.getRangeAt(0).cloneRange();       // kloniraj PRIJE prompta (DOM se ne mijenja tijekom njega)
    const input = window.prompt('URL linka (prazno = ukloni):', enclosingHref(range));
    if (input === null) return;                         // Odustani
    const url = sanitizeLink(input);
    const frag = range.extractContents();
    unwrapEls(frag, 'a');                               // makni postojeće linkove u selekciji (bez ugnježđivanja)
    let first, last;
    if (url) {
      const a = document.createElement('a');
      a.setAttribute('href', url); a.setAttribute('data-be-link', '');
      a.appendChild(frag); range.insertNode(a); first = last = a;
    } else {
      first = frag.firstChild; last = frag.lastChild;   // prazno → čisti tekst (link uklonjen)
      range.insertNode(frag);
    }
    reselectRange(first, last);
  }

  // ── plutajuća tekst-traka (B/I + boja + link). Singleton, vezan JEDNOM. ──
  function ensureToolbar() {
    if (typeof document === 'undefined') return null;
    if (window.__beToolbar) return window.__beToolbar;
    const bar = document.createElement('div');
    bar.className = 'be-toolbar';
    bar.innerHTML =
      '<button type="button" class="be-tb" data-be-fmt="bold" title="Podebljano"><b>B</b></button>' +
      '<button type="button" class="be-tb" data-be-fmt="italic" title="Kurziv"><em>I</em></button>' +
      '<span class="be-tbsep"></span>' +
      '<button type="button" class="be-tb be-tbc" data-be-color="indigo" title="Indigo" style="--sw:#818cf8"></button>' +
      '<button type="button" class="be-tb be-tbc" data-be-color="green" title="Zelena" style="--sw:#34d399"></button>' +
      '<button type="button" class="be-tb be-tbc" data-be-color="amber" title="Jantar" style="--sw:#fbbf24"></button>' +
      '<button type="button" class="be-tb be-tbc" data-be-color="red" title="Crvena" style="--sw:#f87171"></button>' +
      '<button type="button" class="be-tb" data-be-color="default" title="Ukloni boju">⊘</button>' +
      '<span class="be-tbsep"></span>' +
      '<button type="button" class="be-tb" data-be-linkact="1" title="Link (prazno = ukloni)">🔗</button>';
    document.body.appendChild(bar);
    bar.addEventListener('mousedown', function (e) {
      const b = e.target.closest ? e.target.closest('[data-be-fmt], [data-be-color], [data-be-linkact]') : null;
      if (!b) return;
      e.preventDefault();                               // NE gubi selekciju/fokus editabilnog
      const color = b.getAttribute('data-be-color');
      if (color != null) { applyColor(color); return; } // boja = ručno omatanje (lb-color-token)
      if (b.getAttribute('data-be-linkact') != null) { promptLink(); return; }  // link = prompt + <a href>
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
    function draw() { container.innerHTML = renderEditor(container._beCtx.getBlocks()); typesetFormulas(container); enhanceMathFields(container); }
    if (!container._beWired) {
      container._beWired = true;

      // U8.9b: paleta („Photomath keypad") — mousedown+preventDefault ČUVA selekciju math-fielda
      // (inače bi klik gumba ukrao fokus); ubaci LaTeX-template (MathLive `insert`) → change → commit.
      container.addEventListener('mousedown', function (e) {
        const key = e.target.closest ? e.target.closest('[data-be-mathins],[data-be-mathcmd]') : null;
        if (!key || !container.contains(key)) return;
        e.preventDefault();                                    // ne kradi fokus math-fieldu
        const blockEl = key.closest('[data-be-block]');
        const mf = blockEl ? blockEl.querySelector('math-field[data-be-mathfield]') : null;
        if (!mf) return;
        try { mf.focus(); } catch (_) {}
        const cmd = key.getAttribute('data-be-mathcmd');
        if (cmd) {                                             // naredba (npr. ⌫ deleteBackward)
          if (typeof mf.executeCommand === 'function') { try { mf.executeCommand(cmd); } catch (_) {} }
        } else {                                               // insert-template
          if (typeof mf.insert !== 'function') return;         // MathLive još nije spreman → no-op
          const latex = key.getAttribute('data-be-mathins') || '';
          try { mf.insert(latex, { focus: true, selectionMode: 'placeholder' }); }
          catch (_) { try { mf.insert(latex); } catch (__) {} }
        }
        mf.dispatchEvent(new Event('change', { bubbles: true })); // commit u draft (+ živi preview)
      });

      container.addEventListener('click', function (e) {
        const c = container._beCtx;
        // U8.5e: callout-varijanta (info/warning/tip) → op → re-crtaj (boja/stil se mijenja)
        const cv = e.target.closest ? e.target.closest('[data-be-cvar]') : null;
        if (cv && container.contains(cv)) {
          const cvEl = cv.closest('[data-be-block]');
          const cvId = cvEl ? cvEl.getAttribute('data-be-block') : '';
          if (cvId) {
            c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: cvId, patch: { variant: cv.getAttribute('data-be-cvar') } });
            draw();
          }
          return;
        }
        // U8.5d: strukturne ops tablice (addrow/addcol/delrow/delcol) → mutiraj model iz grida → draft → re-crtaj
        const tact = e.target.closest ? e.target.closest('[data-be-tact]') : null;
        if (tact && container.contains(tact)) {
          const tBlockEl = tact.closest('[data-be-block]');
          const tId = tBlockEl ? tBlockEl.getAttribute('data-be-block') : '';
          if (!tId) return;
          const op = tact.getAttribute('data-be-tact');
          const t = readGridCells(tBlockEl);              // uhvati trenutno upisane vrijednosti
          const cols = colCountOf(t);
          if (op === 'addrow') t.rows.push(new Array(cols || 1).fill(''));
          else if (op === 'addcol') { if (t.header) t.header.push(''); for (let k = 0; k < t.rows.length; k++) t.rows[k].push(''); }
          else if (op === 'delrow') { const r = parseInt(tact.getAttribute('data-be-r'), 10); if (t.rows.length > 1 && r >= 0) t.rows.splice(r, 1); }
          else if (op === 'delcol') { const cc = parseInt(tact.getAttribute('data-be-c'), 10); if (cols > 1 && cc >= 0) { if (t.header) t.header.splice(cc, 1); for (let k = 0; k < t.rows.length; k++) t.rows[k].splice(cc, 1); } }
          c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: tId, patch: { header: t.header, rows: t.rows } });
          draw();
          return;
        }
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

      // U8.5e: resize-ručka slike (⇲) — drag u media-modulu; jedan op na puštanju.
      container.addEventListener('pointerdown', function (e) {
        if (typeof imageResizePointerDown === 'function') imageResizePointerDown(e, container);
      });

      // U8.10: PASTE u ćeliju tablice → ako je clipboard tablica (TSV/HTML), izgradi cijeli grid.
      container.addEventListener('paste', function (e) {
        const cell = e.target.closest ? e.target.closest('.be-tcell') : null;
        if (!cell || !container.contains(cell)) return;
        const cd = e.clipboardData || (typeof window !== 'undefined' && window.clipboardData);
        if (!cd || typeof parsePastedTable !== 'function') return;
        const grid = parsePastedTable(cd.getData('text/plain'), cd.getData('text/html'));
        if (!grid) return;                                    // jedna ćelija → normalan (default) paste
        e.preventDefault();
        const c = container._beCtx;
        const blockEl = cell.closest('[data-be-block]');
        const id = blockEl ? blockEl.getAttribute('data-be-block') : '';
        if (!id) return;
        const cur = readGridCells(blockEl);                   // zadrži trenutni header-mod
        let header = null, rows = grid;
        if (cur.header) { header = grid[0].slice(); rows = grid.slice(1); }  // header aktivan → prvi red = zaglavlje
        if (!rows.length) rows = [new Array((header ? header.length : (grid[0] || []).length) || 1).fill('')];
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: { header: header, rows: rows } });
        draw();
      });

      // U8.10: Enter u ćeliji → ćelija ISPOD (Excel); na dnu → dodaj red pa fokusiraj novu ćeliju.
      container.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || e.shiftKey) return;
        const cell = e.target.closest ? e.target.closest('.be-tcell') : null;
        if (!cell || !container.contains(cell)) return;
        e.preventDefault();
        const r = parseInt(cell.getAttribute('data-be-tr'), 10);
        const cc = parseInt(cell.getAttribute('data-be-tc'), 10);
        const blockEl = cell.closest('[data-be-block]');
        const below = blockEl.querySelector('.be-tcell[data-be-tr="' + (r + 1) + '"][data-be-tc="' + cc + '"]');
        if (below) { below.focus(); return; }                 // postoji red ispod → samo pomakni fokus
        const c = container._beCtx;                            // zadnji red → dodaj red (readGridCells hvata živi .value)
        const id = blockEl.getAttribute('data-be-block');
        const t = readGridCells(blockEl);
        t.rows.push(new Array(colCountOf(t) || 1).fill(''));
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: { header: t.header, rows: t.rows } });
        draw();
        const nb = container.querySelector('[data-be-block="' + id + '"]');
        const focusCell = nb && nb.querySelector('.be-tcell[data-be-tr="' + (r + 1) + '"][data-be-tc="' + cc + '"]');
        if (focusCell) focusCell.focus();
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

      // U8.5a/b/c: media-polja (<input> tekst + checkbox) → draft na `change`; osvježi SAMO preview
      // (inpute/checkboxe ne diramo → fokus ostaje). Formula-preview se KaTeX-tipografira po osvježenju.
      container.addEventListener('change', function (e) {
        const c = container._beCtx;
        // U8.5d: tablica — ćelija (preview-only, čuva fokus) ili header-toggle (re-crtaj, oblik se mijenja)
        const tEl = e.target.closest ? e.target.closest('.be-tcell, [data-be-tcheck]') : null;
        if (tEl && container.contains(tEl)) {
          const tBlockEl = tEl.closest('[data-be-block]');
          const tId = tBlockEl ? tBlockEl.getAttribute('data-be-block') : '';
          if (!tId) return;
          const grid = readGridCells(tBlockEl);
          if (tEl.getAttribute('data-be-tcheck') === 'header') {   // uključi/isključi zaglavlje
            grid.header = tEl.checked ? new Array(colCountOf(grid) || 2).fill('') : null;
            c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: tId, patch: { header: grid.header, rows: grid.rows } });
            draw();
          } else {                                                  // uređena ćelija → preview-only
            c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: tId, patch: { header: grid.header, rows: grid.rows } });
            const updated = findBlockById((c.getBlocks && c.getBlocks()) || [], tId);
            const prev = tBlockEl.querySelector('.be-media__preview');
            if (prev && updated) prev.innerHTML = mediaPreviewHtml(updated);
          }
          return;
        }
        const inp = e.target.closest ? e.target.closest('[data-be-mfield], [data-be-mcheck]') : null;
        if (!inp || !container.contains(inp)) return;
        const blockEl = inp.closest('[data-be-block]');
        const id = blockEl ? blockEl.getAttribute('data-be-block') : '';
        if (!id) return;
        const patch = {};
        const fields = blockEl.querySelectorAll('[data-be-mfield]');
        for (let k = 0; k < fields.length; k++) {
          const key = fields[k].getAttribute('data-be-mfield');
          const val = fields[k].value;
          patch[key] = (val === '') ? null : val;         // prazno → briše ključ (_assignPatch null)
        }
        const checks = blockEl.querySelectorAll('[data-be-mcheck]');  // U8.5c: boolean (npr. formula display)
        for (let k = 0; k < checks.length; k++) patch[checks[k].getAttribute('data-be-mcheck')] = !!checks[k].checked;
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: patch });
        const blocks = (c.getBlocks && c.getBlocks()) || [];
        let updated = null;
        for (let k = 0; k < blocks.length; k++) { if (blocks[k] && String(blocks[k].id) === String(id)) { updated = blocks[k]; break; } }
        const prev = blockEl.querySelector('.be-media__preview');
        if (prev && updated) { prev.innerHTML = mediaPreviewHtml(updated); if (updated.type === 'formula') typesetFormulas(blockEl); }
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
      _inlineToPlain: inlineToPlain,     // U8.5a (inline → plain za media-inpute)
      _mediaImageBody: mediaImageBody,   // U8.5a (slika-forma)
      _mediaVideoBody: mediaVideoBody,   // U8.5b (video-forma)
      _mediaFormulaBody: mediaFormulaBody, // U8.5c (formula-forma)
      _mediaTableBody: mediaTableBody,   // U8.5d (tablica-grid-forma)
      _tableModel: tableModel,           // U8.5d (normalizacija modela)
      _parsePastedTable: parsePastedTable, // U8.10 (paste TSV/HTML → grid)
      _runsToEditable: runsToEditable,   // U8.4a serijalizator (runs → editabilni HTML)
      _editableToInline: editableToInline, // U8.4a serijalizator (DOM → runs/string)
      _editableBody: editableBody
    };
  }
})();
