// ===== SOKRAT STUDY — „Moji materijali" (osobni UGC-graditelj, F2) =====
//
// Korisnikovo VLASTITO ugniježđeno stablo (`nodes`) + gradivo study-čvorova (`node_content`).
// Ugovor: `docs/archive/CREATE_BACKEND_SPEC.md` v3 · odluka: ADR-024 · SQL: `supabase/f1-nodes.sql`.
//
// ⚠️ GRANICE (ADR-024):
//   • Ovo je ZASEBAN otok — javni katalog, 22 predmeta i studentski vrući put su NEDIRNUTI.
//   • ČITANJE = direktan SELECT (RLS filtrira na vlasnika). UPIS = ISKLJUČIVO kroz owner-scoped
//     SECURITY DEFINER RPC-ove; klijent NEMA write-grantove na tablicama (ni da hoće).
//   • Sve je prijavljen-only i privatno. Nema objave na javni katalog (kasnija faza).
//
// Ovaj modul je podatkovni sloj + UI stabla na profilu. Study-čvor se u F3 otvara postojećim
// Studio editorom (vezanjem `SokratAdmin.studioBridge` na `node_content`).

(function (window) {
  'use strict';

  // ── Lokalni helperi ────────────────────────────────────────────────────
  /** i18n s fallbackom (isti obrazac kao profile.js/studio.js: ključ==rezultat ⇒ fallback). */
  function mt(key, fb) {
    if (!window.t) return fb;
    const v = window.t(key);
    return (v === key) ? fb : v;
  }
  function auth() { return (typeof SokratAuth !== 'undefined') ? SokratAuth : null; }
  function client() {
    const a = auth();
    return (a && typeof a.getClient === 'function') ? a.getClient() : null;
  }
  function user() {
    const a = auth();
    return (a && typeof a.getUser === 'function') ? a.getUser() : null;
  }

  // ── Poruke grešaka: naši RPC error-kodovi → ljudski tekst ──────────────
  // Server je izvor istine; ovo je SAMO prijevod za korisnika (nikad autorizacija).
  const ERRORS = {
    auth_required:        ['materials.errAuth', 'You need to be signed in.'],
    node_denied:          ['materials.errDenied', 'That is not yours.'],
    node_not_found:       ['materials.errMissing', 'That item no longer exists.'],
    node_deleted:         ['materials.errDeleted', 'That item is in the bin.'],
    node_cycle:           ['materials.errCycle', 'A folder cannot be moved into itself.'],
    node_parent_not_folder: ['materials.errNotFolder', 'Only folders can contain items.'],
    node_parent_deleted:  ['materials.errParentDeleted', 'Restore the parent folder first.'],
    node_bad_name:        ['materials.errName', 'Please enter a name.'],
    node_bad_kind:        ['materials.errKind', 'Unknown item type.'],
    node_reorder_mismatch: ['materials.errReorder', 'The list changed — please try again.'],
    publish_version_conflict: ['materials.errConflict', 'This was edited elsewhere. Reload and try again.'],
    publish_not_study:    ['materials.errNotStudy', 'Only study items hold material.']
  };

  /** Pretvori supabase/PostgREST grešku u kratku poruku za korisnika. */
  function humanError(err) {
    const raw = String((err && (err.message || err.hint || err.details)) || '');
    const code = String((err && err.code) || '');

    // Tablice još nema na OVOJ bazi (npr. prod prije F5-migracije). To nije „greška"
    // nego „značajka ovdje još ne postoji" — reci to ravno umjesto generičkog mumljanja.
    // PostgREST: PGRST205 (nema u schema cacheu) · Postgres: 42P01 (undefined_table).
    if (code === 'PGRST205' || code === '42P01'
        || /Could not find the table|does not exist|schema cache/i.test(raw)) {
      return mt('materials.errNoTable', 'Not available on this environment yet.');
    }
    // Nema prijave / istekao token.
    if (code === 'PGRST301' || /JWT|JWS/i.test(raw)) {
      return mt('materials.errAuth', 'You need to be signed in.');
    }

    for (const key in ERRORS) {
      if (raw.indexOf(key) !== -1) return mt(ERRORS[key][0], ERRORS[key][1]);
    }
    return mt('materials.errGeneric', 'Something went wrong. Please try again.');
  }

  // ── ČISTE funkcije (bez DOM-a/mreže) — pokrivene unit testovima ────────

  /**
   * Ravni retci iz baze → ugniježđeno stablo.
   * Poredak braće: `position` pa `name` (stabilno i kad su pozicije iste/neispravne).
   * Obrisani (`deleted_at`) se izbacuju; siroče (roditelj nije u skupu) ide na korijen
   * da nikad ne "nestane" korisniku.
   * @param {Array<object>} rows
   * @returns {Array<object>} korijenski čvorovi s `children`
   */
  function buildTree(rows) {
    const list = (rows || []).filter(function (r) { return r && r.id && !r.deleted_at; });
    const byId = Object.create(null);
    list.forEach(function (r) {
      byId[r.id] = {
        id: r.id, parent_id: r.parent_id || null, kind: r.kind, name: r.name,
        position: (typeof r.position === 'number') ? r.position : 0,
        icon: r.icon || null, color: r.color || null, children: []
      };
    });
    const roots = [];
    Object.keys(byId).forEach(function (id) {
      const n = byId[id];
      const p = n.parent_id ? byId[n.parent_id] : null;
      if (p) p.children.push(n); else roots.push(n);   // siroče → korijen
    });
    const sortKids = function (arr) {
      arr.sort(function (a, b) {
        if (a.position !== b.position) return a.position - b.position;
        return String(a.name).localeCompare(String(b.name));
      });
      arr.forEach(function (n) { sortKids(n.children); });
    };
    sortKids(roots);
    return roots;
  }

  /**
   * Stablo → ravni popis VIDLJIVIH redaka (zatvoreni folderi skrivaju potomke).
   * @param {Array<object>} tree
   * @param {object} expanded mapa id→true (otvoreni folderi)
   * @returns {Array<{node:object, depth:number}>}
   */
  function flattenVisible(tree, expanded) {
    const out = [];
    const walk = function (nodes, depth) {
      (nodes || []).forEach(function (n) {
        out.push({ node: n, depth: depth });
        if (n.children.length && expanded && expanded[n.id]) walk(n.children, depth + 1);
      });
    };
    walk(tree, 0);
    return out;
  }

  /**
   * Je li `candidateId` potomak (ili jednak) `ancestorId`? Klijentska zrcalna provjera
   * servrskog anti-ciklusa — SAMO za UX (server svejedno presuđuje).
   * @param {Array<object>} rows ravni retci (id, parent_id)
   */
  function isSelfOrDescendant(rows, ancestorId, candidateId) {
    if (!ancestorId || !candidateId) return false;
    if (ancestorId === candidateId) return true;
    const parentOf = Object.create(null);
    (rows || []).forEach(function (r) { if (r && r.id) parentOf[r.id] = r.parent_id || null; });
    let cur = parentOf[candidateId];
    let guard = 0;
    while (cur && guard++ < 1000) {
      if (cur === ancestorId) return true;
      cur = parentOf[cur];
    }
    return false;
  }

  // ── MREŽA: čitanje = SELECT (RLS), pisanje = RPC ───────────────────────

  /** Je li graditelj uopće dostupan (prijavljen + klijent spreman)? */
  function isAvailable() { return !!(client() && user()); }

  /**
   * Učitaj cijelo korisnikovo stablo (živi čvorovi). RLS jamči da su SAMO njegovi.
   * @returns {Promise<{rows:Array<object>, tree:Array<object>}>}
   */
  async function loadTree() {
    const c = client();
    if (!c) throw new Error('auth_required');
    const res = await c
      .from('nodes')
      .select('id,parent_id,kind,name,position,icon,color,deleted_at')
      .is('deleted_at', null)
      .order('position', { ascending: true });
    if (res.error) throw res.error;
    const rows = res.data || [];
    return { rows: rows, tree: buildTree(rows) };
  }

  /** Jedini put upisa: owner-scoped RPC. Vraća `data` ili baca izvornu grešku. */
  async function callRpc(name, args) {
    const c = client();
    if (!c) throw new Error('auth_required');
    const res = await c.rpc(name, args);
    if (res.error) throw res.error;
    return res.data;
  }

  const createNode  = (parentId, kind, name) => callRpc('create_node', { p_parent: parentId || null, p_kind: kind, p_name: name });
  const renameNode  = (id, name)             => callRpc('rename_node', { p_id: id, p_name: name });
  const moveNode    = (id, parentId, pos)    => callRpc('move_node', { p_id: id, p_new_parent: parentId || null, p_position: (pos == null ? null : pos) });
  const reorderNodes = (parentId, orderedIds) => callRpc('reorder_nodes', { p_parent: parentId || null, p_ordered_ids: orderedIds });
  const deleteNode  = (id)                   => callRpc('delete_node', { p_id: id });
  const restoreNode = (id)                   => callRpc('restore_node', { p_id: id });

  // ── UI: stablo na profilu ──────────────────────────────────────────────
  // SIGURNOSNA GRANICA: `name` je korisnički unos → SVAKO ispisivanje ide kroz esc().
  // Nikad ne ubacujemo sirovi tekst u innerHTML.

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function root() { return document.getElementById('myMaterials'); }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }

  const EXPAND_KEY = 'sokrat-materials-open';

  // M2: materijal nema lekcije kao katalog-predmet — ima jedan sadržaj. Isti ključ koristi i
  // Studio (`_sel.lessonId`), pa su editor i učenje adresirani jednako.
  const LESSON_ID = 'content';

  /** Stanje UI-a (nije podatak — samo prikaz). */
  let _rows = [];
  let _tree = [];
  let _expanded = {};
  let _busy = false;
  let _loaded = false;       // je li stablo ikad uspješno učitano (→ nema više „skeleton" bljeska)
  let _edit = null;          // {mode:'create',parentId,kind} | {mode:'rename',id,name}
  let _lastDeleted = null;   // id zadnje obrisanog → ponudi „Vrati"

  /**
   * Zauzet = UI NIJE interaktivan. Bez ovoga postoji utrka: `refresh()` prekrije stablo
   * PRIJE mrežnog poziva, pa korisnik vidi gumb („Vrati") i klikne ga dok posao još traje —
   * a akcija tiho ne napravi ništa. `.mm-busy` gasi pointer-evente → klik pričeka.
   */
  function setBusy(v) {
    _busy = !!v;
    const el = root();
    if (el) {
      el.classList.toggle('mm-busy', _busy);
      el.setAttribute('aria-busy', _busy ? 'true' : 'false');
    }
  }

  function loadExpanded() {
    try {
      const raw = window.localStorage && window.localStorage.getItem(EXPAND_KEY);
      const o = raw ? JSON.parse(raw) : null;
      _expanded = (o && typeof o === 'object') ? o : {};
    } catch (e) { _expanded = {}; }
  }
  function saveExpanded() {
    try {
      if (window.localStorage) window.localStorage.setItem(EXPAND_KEY, JSON.stringify(_expanded));
    } catch (e) { /* privatni način rada / puna kvota — prikaz radi i bez pamćenja */ }
  }

  function shellHtml(inner) {
    return '' +
      '<div class="mm-bar">' +
      '  <button type="button" class="mm-add" data-mm-new="folder">' +
      '    <i class="fas fa-folder-plus" aria-hidden="true"></i><span>' + esc(mt('materials.newFolder', 'New folder')) + '</span></button>' +
      '  <button type="button" class="mm-add" data-mm-new="study">' +
      '    <i class="fas fa-book-medical" aria-hidden="true"></i><span>' + esc(mt('materials.newStudy', 'New material')) + '</span></button>' +
      (_lastDeleted
        ? '  <button type="button" class="mm-add mm-add--undo" data-mm-undo>' +
          '    <i class="fas fa-rotate-left" aria-hidden="true"></i><span>' + esc(mt('materials.undo', 'Undo delete')) + '</span></button>'
        : '') +
      '</div>' +
      '<div class="mm-body">' + inner + '</div>';
  }

  function stateHtml(icon, title, sub, retry) {
    return '' +
      '<div class="mm-state">' +
      '  <div class="mm-state-icon"><i class="fas ' + icon + '" aria-hidden="true"></i></div>' +
      '  <p class="mm-state-title">' + esc(title) + '</p>' +
      (sub ? '  <p class="mm-state-sub">' + esc(sub) + '</p>' : '') +
      (retry ? '  <button type="button" class="cta-button secondary" data-mm-retry>' +
               '<i class="fas fa-rotate"></i><span>' + esc(mt('materials.retry', 'Try again')) + '</span></button>' : '') +
      '</div>';
  }

  /** Jedan redak stabla. Folder s djecom dobiva chevron; study je uvijek list. */
  function rowHtml(entry) {
    const n = entry.node;
    const isFolder = n.kind === 'folder';
    const hasKids = n.children.length > 0;
    const open = !!_expanded[n.id];
    const icon = isFolder ? (open && hasKids ? 'fa-folder-open' : 'fa-folder') : 'fa-book-open';

    // ⚠️ `role="treeitem"` NIJE ukras. `<ul role="tree">` GASI implicitnu ulogu liste, pa su `<li>`
    // bez uloge ostajali siročad: axe je javljao `aria-required-children` (critical) + `listitem`
    // (serious), a za čitač ekrana je to značilo **stablo s nula stavki** — cijela korisnikova
    // polica nevidljiva. Pola ARIA-e je bilo gore od nikakve: native semantika je uklonjena, a
    // zamjena nije stavljena. Nađeno tek kad je `a11y.authed.spec.js` prvi put posjetio ovu plohu.
    // DOM je PLOSNAT (dubina je vizualna, `--mm-depth`) → `aria-level` nosi hijerarhiju.
    // `aria-expanded` stoji i na retku (stanje stavke) i na twisty-gumbu (stanje kontrole); oba se
    // ispisuju iz iste varijable `open`, pa se ne mogu razići.
    return '' +
      '<li class="mm-row' + (isFolder ? ' mm-row--folder' : ' mm-row--study') + '"' +
      ' role="treeitem" aria-level="' + (entry.depth + 1) + '"' +
      (isFolder && hasKids ? ' aria-expanded="' + (open ? 'true' : 'false') + '"' : '') +
      ' data-mm-id="' + esc(n.id) + '" data-mm-kind="' + esc(n.kind) + '"' +
      ' style="--mm-depth:' + entry.depth + '">' +
      '  <span class="mm-grip" data-mm-drag title="' + esc(mt('materials.drag', 'Drag to move')) + '" aria-hidden="true">' +
      '<i class="fas fa-grip-vertical"></i></span>' +
      '  <span class="mm-twisty">' +
      (isFolder && hasKids
        ? '<button type="button" class="mm-twisty-btn" data-mm-toggle aria-expanded="' + (open ? 'true' : 'false') + '"' +
          ' aria-label="' + esc(mt('materials.toggle', 'Expand or collapse')) + '">' +
          '<i class="fas fa-chevron-right" aria-hidden="true"></i></button>'
        : '') +
      '  </span>' +
      '  <span class="mm-icon"><i class="fas ' + icon + '" aria-hidden="true"></i></span>' +
      '  <span class="mm-name" title="' + esc(n.name) + '">' + esc(n.name) + '</span>' +
      (hasKids ? '  <span class="mm-count">' + n.children.length + '</span>' : '') +
      '  <span class="mm-acts">' +
      (isFolder
        ? '<button type="button" class="mm-act" data-mm-new-in="folder" title="' + esc(mt('materials.addFolderIn', 'New folder inside')) + '">' +
          '<i class="fas fa-folder-plus" aria-hidden="true"></i></button>' +
          '<button type="button" class="mm-act" data-mm-new-in="study" title="' + esc(mt('materials.addStudyIn', 'New material inside')) + '">' +
          '<i class="fas fa-plus" aria-hidden="true"></i></button>'
        // M2: „Uči" ide PRVI — materijal se češće uči nego uređuje, a create/edit je zasebna radnja.
        // ⚠ Mjesto gumba je PRIVREMENO; konačan raspored je u vlasništvu frontend-redizajna (Leon).
        // F3 K2: study-čvor se otvara POSTOJEĆIM Studio editorom (isti renderer, isti draft-stroj).
        : '<button type="button" class="mm-act mm-act--learn" data-mm-learn title="' + esc(mt('materials.learn', 'Study')) + '">' +
          '<i class="fas fa-graduation-cap" aria-hidden="true"></i></button>' +
          '<button type="button" class="mm-act mm-act--open" data-mm-open title="' + esc(mt('materials.open', 'Edit material')) + '">' +
          '<i class="fas fa-pen-to-square" aria-hidden="true"></i></button>') +
      '    <button type="button" class="mm-act" data-mm-rename title="' + esc(mt('materials.rename', 'Rename')) + '">' +
      '<i class="fas fa-pen" aria-hidden="true"></i></button>' +
      '    <button type="button" class="mm-act mm-act--danger" data-mm-del title="' + esc(mt('materials.delete', 'Delete')) + '">' +
      '<i class="fas fa-trash" aria-hidden="true"></i></button>' +
      '  </span>' +
      '</li>';
  }

  /** Inline redak za unos naziva (novi čvor ili preimenovanje). */
  function editRowHtml(depth, value, kind) {
    const icon = (kind === 'study') ? 'fa-book-open' : 'fa-folder';
    const ph = (kind === 'study')
      ? mt('materials.phStudy', 'Material name…')
      : mt('materials.phFolder', 'Folder name…');
    return '' +
      // I redak u uređivanju je stavka stabla — bez uloge bi ga `aria-required-children` odbio
      // kao nedopušteno dijete `role="tree"` (v. komentar u `rowHtml`).
      '<li class="mm-row mm-row--edit" role="treeitem" aria-level="' + (depth + 1) + '"' +
      ' style="--mm-depth:' + depth + '">' +
      '  <span class="mm-twisty"></span>' +
      '  <span class="mm-icon"><i class="fas ' + icon + '" aria-hidden="true"></i></span>' +
      '  <input type="text" class="mm-input" data-mm-input maxlength="120" autocomplete="off"' +
      '   value="' + esc(value) + '" placeholder="' + esc(ph) + '" aria-label="' + esc(ph) + '">' +
      '  <span class="mm-acts mm-acts--edit">' +
      '    <button type="button" class="mm-act" data-mm-commit title="' + esc(mt('materials.save', 'Save')) + '">' +
      '<i class="fas fa-check" aria-hidden="true"></i></button>' +
      '    <button type="button" class="mm-act" data-mm-cancel title="' + esc(mt('materials.cancel', 'Cancel')) + '">' +
      '<i class="fas fa-xmark" aria-hidden="true"></i></button>' +
      '  </span>' +
      '</li>';
  }

  /** Indeks NAKON cijelog podstabla čvora na `i` (gdje ide novo dijete). */
  function afterSubtree(entries, i) {
    const d = entries[i].depth;
    let j = i + 1;
    while (j < entries.length && entries[j].depth > d) j++;
    return j;
  }

  function treeHtml() {
    const entries = flattenVisible(_tree, _expanded);
    const html = entries.map(rowHtml);

    if (_edit && _edit.mode === 'rename') {
      const i = entries.findIndex(function (e) { return e.node.id === _edit.id; });
      if (i !== -1) html[i] = editRowHtml(entries[i].depth, _edit.name, entries[i].node.kind);
    } else if (_edit && _edit.mode === 'create') {
      if (!_edit.parentId) {
        html.push(editRowHtml(0, '', _edit.kind));                 // novi korijen → na kraj
      } else {
        const i = entries.findIndex(function (e) { return e.node.id === _edit.parentId; });
        if (i === -1) html.push(editRowHtml(0, '', _edit.kind));   // roditelj nevidljiv → fallback
        else html.splice(afterSubtree(entries, i), 0, editRowHtml(entries[i].depth + 1, '', _edit.kind));
      }
    }
    return '<ul class="mm-tree" role="tree">' + html.join('') + '</ul>';
  }

  /** Prekrij UI trenutnim stanjem (bez mrežnog poziva). */
  function draw() {
    const el = root();
    if (!el) return;
    el.innerHTML = (_tree.length || _edit)
      ? shellHtml(treeHtml())
      : shellHtml(stateHtml('fa-folder-open',
          mt('materials.emptyTitle', 'Nothing here yet'),
          mt('materials.emptySub', 'Create a folder to organise your studies, or a material to start building.')));
    if (_edit) {
      const input = el.querySelector('[data-mm-input]');
      if (input) { input.focus(); input.select(); }
    }
  }

  // ── Akcije (svaki upis = owner-scoped RPC; UI se osvježi iz baze) ───────

  /** Otvori inline unos za NOVI čvor pod `parentId` (null = korijen). */
  function startCreate(parentId, kind) {
    if (_busy) return;
    if (parentId) { _expanded[parentId] = true; saveExpanded(); }   // da se unos vidi
    _edit = { mode: 'create', parentId: parentId || null, kind: kind };
    draw();
  }

  /**
   * F3 K2 — otvori study-čvor u Studio editoru. Sadržaj NE učitavamo ovdje: Studio je
   * vlasnik tog toka (`openNode` → `node_content` → `studioBridge.setNode`), pa ostaje
   * JEDNO mjesto koje zna kako se čvor uređuje.
   */
  function openStudy(id) {
    if (_busy) return;
    const row = _rows.find(function (r) { return r.id === id; });
    if (!row || row.kind !== 'study') return;
    if (!window.SokratStudio || typeof SokratStudio.openNode !== 'function') {
      toast(mt('materials.errNoEditor', 'The editor is not available here yet.'));
      return;
    }
    SokratStudio.openNode(id, row.name);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // M2 — UČENJE IZ VLASTITOG MATERIJALA
  //
  // Study-stranica cijeli život kreće od `subjectDataMap[subjectId]` = KATALOG (13 mjesta u
  // kodu: storage, analytics, profil, sinkronizacija, napredak). Umjesto da se svih 13 uči za
  // čvorove, materijal se REGISTRIRA kao sintetički predmet pod ključem `node:<uuid>`.
  //
  // To je isti obrazac „šav generičan po tekstualnom ključu" koji je već platio dvaput:
  // draft-stroj (`node:<uuid>`) i `progress` (generički key-value). `storageKey` je slobodan
  // tekst → napredak, analitika, profil-statistika i cloud-sync rade BEZ IJEDNE IZMJENE.
  //
  // Zastavica `_node` je jedina razlika i služi da se katalog i materijal NE MIJEŠAJU (ADR-024):
  // po njoj `initStudyPage` zna odakle vuče sadržaj, a `applyFeatureNav` da vježbi nema.
  // ───────────────────────────────────────────────────────────────────────────

  /** Sintetički upis materijala u `subjectDataMap`. Vraća ključ predmeta (`node:<uuid>`). */
  function registerStudySubject(row) {
    if (typeof subjectDataMap === 'undefined' || !row || row.kind !== 'study') return null;
    const key = 'node:' + row.id;
    subjectDataMap[key] = {
      name: row.name,
      shortName: row.name,
      icon: row.icon || 'fa-book-open',
      color: row.color || '#6366f1',
      description: '',
      storageKey: key,                       // napredak + analitika + sync žive pod ovim ključem
      lessons: [{ id: LESSON_ID, name: row.name }],
      _node: true,                           // NIJE katalog — vidi initStudyPage / applyFeatureNav
      _nodeId: row.id
    };
    return key;
  }

  /**
   * Registriraj SVE učitane materijale. Zove se nakon svakog učitavanja stabla, da profil-statistika
   * i cloud-sync vide ključeve i materijala koje korisnik nije otvorio u ovoj sesiji.
   */
  function registerAllStudySubjects() {
    _rows.forEach(function (r) { if (r.kind === 'study' && !r.deleted_at) registerStudySubject(r); });
  }

  /**
   * Sadržaj materijala za učenje (`initStudyPage` ga traži preko ovog šava).
   * Prazan payload je legitimno početno stanje — materijal bez sadržaja nije greška.
   *
   * BUG-024: ovo je JEDINI šav kroz koji sadržaj osobnog materijala ulazi u učenje, pa se potpisi
   * za privatne slike nabavljaju OVDJE — jednom, za sva četiri moda. Alternativa (potpisivati u
   * trenutku prikaza) je asinkrona usred sinkronog renderiranja i zato je Learn i ostao bez slike.
   * `prefetch` NIKAD ne baca: nedostupan Storage znači materijal bez slike, ne materijal koji se
   * ne otvara. Potpis se namjerno NE upisuje u payload — istekao bi (invarijanta F4).
   */
  async function loadNodeContent(nodeId) {
    const client = (typeof SokratAuth !== 'undefined' && typeof SokratAuth.getClient === 'function')
      ? SokratAuth.getClient() : null;
    if (!client) throw new Error('auth-unavailable');
    const r = await client.from('node_content').select('payload').eq('node_id', nodeId).single();
    if (r.error) throw r.error;
    const payload = (r.data && r.data.payload) || {};
    const NI = window.SokratNodeImages;
    if (NI && typeof NI.prefetch === 'function') await NI.prefetch(payload);
    return payload;
  }

  /** M2 — otvori materijal za UČENJE (isti study-DOM i isti modovi kao katalog). */
  function learnNode(id) {
    if (_busy) return;
    const row = _rows.find(function (r) { return r.id === id; });
    if (!row || row.kind !== 'study') return;
    const key = registerStudySubject(row);
    if (!key || typeof navigateTo !== 'function') {
      toast(mt('materials.errLearn', 'This material cannot be opened for studying.'));
      return;
    }
    navigateTo('study', { subject: key, lesson: LESSON_ID });
  }

  /** Otvori inline unos za PREIMENOVANJE. */
  function startRename(id) {
    if (_busy) return;
    const row = _rows.find(function (r) { return r.id === id; });
    if (!row) return;
    _edit = { mode: 'rename', id: id, name: row.name };
    draw();
  }

  function cancelEdit() { _edit = null; draw(); }

  /** Potvrdi inline unos → RPC → osvježi iz baze. */
  async function commitEdit(value) {
    if (!_edit || _busy) return;
    const name = String(value == null ? '' : value).trim();
    const job = _edit;
    if (!name || (job.mode === 'rename' && name === job.name)) { cancelEdit(); return; }

    setBusy(true);
    try {
      if (job.mode === 'create') {
        const id = await createNode(job.parentId, job.kind, name);
        if (job.kind === 'folder' && id) _expanded[id] = true;
        toast(mt('materials.created', 'Created.'));
      } else {
        await renameNode(job.id, name);
        toast(mt('materials.renamed', 'Renamed.'));
      }
      _edit = null;
      saveExpanded();
      await refresh();
    } catch (err) {
      toast(humanError(err));
      _edit = null;
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  /** Obriši (mekano, rekurzivno) uz potvrdu; ponudi „Vrati". */
  async function removeNode(id) {
    if (_busy) return;
    const row = _rows.find(function (r) { return r.id === id; });
    if (!row) return;
    const kids = _rows.filter(function (r) { return r.parent_id === id; }).length;

    if (typeof window.askConfirm === 'function') {
      const ok = await window.askConfirm({
        title: mt('materials.delTitle', 'Delete this item?'),
        message: kids
          ? mt('materials.delMsgTree', 'Everything inside it will be deleted too. You can restore it right after.')
          : mt('materials.delMsg', 'You can restore it right after.'),
        confirmText: mt('materials.delete', 'Delete'),
        danger: true
      });
      if (!ok) return;
    }

    setBusy(true);
    try {
      await deleteNode(id);
      // Postavi PRIJE refresh-a — draw() iz njega crta gumb „Vrati obrisano".
      // (Soft-delete je povratan; `restore_node` traži da roditelj bude živ.)
      _lastDeleted = id;
      await refresh();
      toast(mt('materials.deleted', 'Deleted.'));
    } catch (err) {
      toast(humanError(err));
    } finally {
      setBusy(false);
    }
  }

  // ── Povlačenje: gnijezdi u folder ILI presloži među braćom ─────────────
  // VANILLA pointer-drag (isti obrazac kao Studio K6). Povlači se SAMO s ručke ⠿
  // → klikovi na naziv/gumbe ostaju netaknuti.
  //
  // Pravila ispuštanja (predvidljiva, bez pogađanja):
  //   • preko SREDINE folder-retka  → premjesti U taj folder (na kraj)
  //   • na granicu između redaka    → postani brat retka ISPOD granice, na toj poziciji
  //   • ispod svega                 → na korijen, na kraj
  // Ciklus i „u samog sebe" hvata i klijent (UX) i server (istina).

  let _drag = null;

  function dropIndicator() {
    let el = document.getElementById('mmDropLine');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mmDropLine';
      el.className = 'mm-dropline';
      document.body.appendChild(el);
    }
    return el;
  }
  function clearDropUi() {
    const line = document.getElementById('mmDropLine');
    if (line) line.style.display = 'none';
    const host = root();
    if (host) host.querySelectorAll('.mm-row--into').forEach(function (r) { r.classList.remove('mm-row--into'); });
  }

  /** Vidljivi redci s njihovim pravokutnicima (izračunato pri svakom pomaku). */
  function visibleRows() {
    const host = root();
    if (!host) return [];
    return Array.prototype.map.call(host.querySelectorAll('.mm-row[data-mm-id]'), function (el) {
      return { el: el, id: el.getAttribute('data-mm-id'), kind: el.getAttribute('data-mm-kind'), rect: el.getBoundingClientRect() };
    });
  }

  /** Gdje bi ispuštanje na koordinati y sletjelo? → {type:'into',id} | {type:'between',index} */
  function dropTargetAt(y, rows) {
    if (!rows.length) return null;
    // Iznad/ispod popisa = jasna namjera (na početak / na kraj korijena).
    if (y <= rows[0].rect.top) return { type: 'between', index: 0 };
    if (y >= rows[rows.length - 1].rect.bottom) return { type: 'between', index: rows.length };

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (y < r.rect.top || y > r.rect.bottom) continue;
      const rel = (y - r.rect.top) / r.rect.height;
      // Srednja traka folder-retka = „u folder"; rubovi = granica među braćom.
      if (r.kind === 'folder' && rel > 0.28 && rel < 0.72
          && !isSelfOrDescendant(_rows, _drag.id, r.id) && r.id !== _drag.id) {
        return { type: 'into', id: r.id };
      }
      return { type: 'between', index: (rel < 0.5) ? i : i + 1 };
    }
    // Sub-piksel procjep između redaka: uzmi prvi redak ISPOD točke umjesto da
    // ispuštanje tiho propadne u prazno.
    const i = rows.findIndex(function (r) { return r.rect.top > y; });
    return { type: 'between', index: (i === -1) ? rows.length : i };
  }

  function paintDrop(target, rows) {
    clearDropUi();
    if (!target) return;
    if (target.type === 'into') {
      const r = rows.find(function (x) { return x.id === target.id; });
      if (r) r.el.classList.add('mm-row--into');
      return;
    }
    const line = dropIndicator();
    const ref = rows[Math.min(target.index, rows.length - 1)];
    if (!ref) return;
    const atEnd = target.index >= rows.length;
    line.style.display = 'block';
    line.style.left = ref.rect.left + 'px';
    line.style.width = ref.rect.width + 'px';
    line.style.top = ((atEnd ? ref.rect.bottom : ref.rect.top) - 1) + 'px';
  }

  /** Ispuštanje → {parentId, position} ili null ako je bez učinka/zabranjeno. */
  function resolveDrop(target, rows) {
    if (!target || !_drag) return null;
    if (target.type === 'into') {
      if (isSelfOrDescendant(_rows, _drag.id, target.id)) return null;
      return { parentId: target.id, position: null };            // na kraj foldera
    }
    // Granica: postani brat retka ISPOD (ili korijen na samom kraju).
    const refRow = rows[target.index];
    if (!refRow) return { parentId: null, position: null };
    const ref = _rows.find(function (r) { return r.id === refRow.id; });
    if (!ref) return null;
    if (ref.id === _drag.id) return null;                        // ispušteno na sebe
    if (isSelfOrDescendant(_rows, _drag.id, ref.parent_id)) return null;
    const pos = _rows
      .filter(function (r) { return (r.parent_id || null) === (ref.parent_id || null); })
      .sort(function (a, b) { return a.position - b.position; })
      .findIndex(function (r) { return r.id === ref.id; });
    return { parentId: ref.parent_id || null, position: (pos < 0 ? null : pos) };
  }

  function startDrag(e, handle) {
    if (_busy || _edit) return;
    const rowEl = handle.closest('[data-mm-id]');
    if (!rowEl) return;
    e.preventDefault();

    _drag = { id: rowEl.getAttribute('data-mm-id'), el: rowEl, target: null };
    rowEl.classList.add('mm-row--dragging');
    document.body.classList.add('mm-dragging');

    const onMove = function (ev) {
      const rows = visibleRows();
      _drag.target = dropTargetAt(ev.clientY, rows);
      paintDrop(_drag.target, rows);
      // Auto-scroll SAMO kad je pokazivač stvarno gurnut u rub (namjerna gesta).
      // Šira margina je klizala stranicu ispod korisnika dok samo lebdi nad donjim retkom
      // → cilj ispuštanja bi se pomaknuo. 24px = rub, ne „blizu ruba".
      const M = 24;
      if (ev.clientY < M) window.scrollBy(0, -10);
      else if (ev.clientY > window.innerHeight - M) window.scrollBy(0, 10);
    };

    const onUp = async function () {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      document.body.classList.remove('mm-dragging');
      rowEl.classList.remove('mm-row--dragging');

      const rows = visibleRows();
      const plan = resolveDrop(_drag.target, rows);
      const id = _drag.id;
      _drag = null;
      clearDropUi();
      if (!plan) return;

      setBusy(true);
      try {
        await moveNode(id, plan.parentId, plan.position);
        if (plan.parentId) { _expanded[plan.parentId] = true; saveExpanded(); }
        await refresh();
      } catch (err) {
        toast(humanError(err));
        await refresh();
      } finally {
        setBusy(false);
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  }

  /** Vrati zadnje obrisano (ako je roditelj još živ). */
  async function undoDelete() {
    if (!_lastDeleted || _busy) return;
    setBusy(true);
    try {
      await restoreNode(_lastDeleted);
      _lastDeleted = null;
      await refresh();
      toast(mt('materials.restored', 'Restored.'));
    } catch (err) {
      toast(humanError(err));
    } finally {
      setBusy(false);
    }
  }

  /** Učitaj iz baze pa nacrtaj. Tiho odustane ako korisnik nije prijavljen. */
  async function refresh() {
    const el = root();
    if (!el) return;
    if (!isAvailable()) { el.innerHTML = ''; return; }

    // Skeleton SAMO pri prvom učitavanju. Nakon akcije stablo ostaje na ekranu dok
    // ne stignu novi podaci → nema bljeska i nema „duha" gumba nad praznim stablom.
    if (!_loaded) {
      el.innerHTML = shellHtml(stateHtml('fa-spinner mm-spin', mt('materials.loading', 'Loading your materials…')));
    }
    try {
      const res = await loadTree();
      _rows = res.rows;
      _tree = res.tree;
      _loaded = true;
      // M2: profil-statistika i cloud-sync iteriraju `subjectDataMap` → materijali moraju biti
      // ondje i kad ih korisnik nije otvorio, inače im napredak ne bi bio ni prikazan ni sinkroniziran.
      registerAllStudySubjects();
      draw();
    } catch (err) {
      _rows = []; _tree = [];
      el.innerHTML = shellHtml(stateHtml('fa-triangle-exclamation',
        mt('materials.errLoad', 'Could not load your materials.'), humanError(err), true));
    }
  }

  /**
   * BUG-023 — registriraj korisnikove materijale u `subjectDataMap` BEZ dodirivanja DOM-a.
   *
   * `refresh()` prvo radi `const el = root(); if (!el) return;` — a na hladnom startu
   * kartica profila NIJE montirana, pa refresh tiho odustane i ne registrira ništa.
   * Zbog toga obnova zadnje pozicije nije imala načina doznati za `node:<uuid>` subjekt
   * i otvarala je praznu study-stranicu.
   *
   * Vraća `true` ako je stablo učitano. Tiho `false` kad korisnik nije prijavljen ili
   * mreže nema — pozivatelj tad NE otvara stranicu, umjesto da je otvori praznu.
   */
  async function ensureRegistered() {
    if (!isAvailable()) return false;
    try {
      const res = await loadTree();
      _rows = res.rows;
      _tree = res.tree;
      // `_loaded` NAMJERNO ostaje kakav jest: prvi posjet profilu i dalje pokaže skeleton,
      // pa ova pozadinska registracija ne mijenja ponašanje kartice.
      registerAllStudySubjects();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Nacrtaj stranicu `#materials-page` (C0 / ADR-029).
   *
   * Stranica je od C0 ravnopravno odredište i **smije se otvoriti i bez prijave** — ulaz stoji u
   * navigaciji da posjetitelj uopće vidi da platforma služi gradnji vlastitog materijala. Zato ovdje
   * biramo IZMEĐU DVIJE PLOHE umjesto da praznu stranicu prepustimo slučaju:
   *   prijavljen  → stablo (`mount()`),
   *   odjavljen   → poziv na prijavu.
   * `mount()` sam sakrije svoju karticu kad graditelj nije dostupan, pa bi bez ovoga odjavljen
   * posjetitelj dobio prazan ekran — a to je točno dojam koji ADR-029 uklanja.
   */
  function renderPage() {
    const ok = isAvailable();
    const signedOut = document.getElementById('materialsSignedOut');
    if (signedOut) signedOut.hidden = ok;
    if (ok) mount();
  }

  /** Montiraj stablo u `#myMaterials` (poziva renderPage). */
  function mount() {
    const el = root();
    if (!el) return;
    loadExpanded();
    _edit = null;     // nedovršen unos ne smije preživjeti odlazak s profila
    setBusy(false);   // poznato početno stanje (aria-busy + .mm-busy)
    const card = el.closest('.profile-card');
    // Kartica je u DOM-u skrivena dok ne znamo da je korisnik prijavljen.
    if (card) card.style.display = isAvailable() ? '' : 'none';
    refresh();
  }

  // ── Delegirani događaji (jedan listener; redci se stalno re-crtaju) ─────
  // Ograda `typeof document` = modul se učitava i u Node unit-testovima (čiste funkcije).
  function onClick(e) {
    const host = root();
    if (!host || !host.contains(e.target)) return;

    const retry = e.target.closest('[data-mm-retry]');
    if (retry) { refresh(); return; }

    const twisty = e.target.closest('[data-mm-toggle]');
    if (twisty) {
      const row = twisty.closest('[data-mm-id]');
      if (!row) return;
      const id = row.getAttribute('data-mm-id');
      if (_expanded[id]) delete _expanded[id]; else _expanded[id] = true;
      saveExpanded();
      draw();
      return;
    }

    // Novi čvor iz trake (korijen)
    const bar = e.target.closest('[data-mm-new]');
    if (bar) { startCreate(null, bar.getAttribute('data-mm-new')); return; }

    // Novi čvor UNUTAR foldera
    const inside = e.target.closest('[data-mm-new-in]');
    if (inside) {
      const row = inside.closest('[data-mm-id]');
      if (row) startCreate(row.getAttribute('data-mm-id'), inside.getAttribute('data-mm-new-in'));
      return;
    }

    // M2: otvori materijal za UČENJE (prije uređivanja — češća radnja)
    const learn = e.target.closest('[data-mm-learn]');
    if (learn) {
      const row = learn.closest('[data-mm-id]');
      if (row) learnNode(row.getAttribute('data-mm-id'));
      return;
    }

    // F3 K2: otvori study-čvor u Studio editoru
    const open = e.target.closest('[data-mm-open]');
    if (open) {
      const row = open.closest('[data-mm-id]');
      if (row) openStudy(row.getAttribute('data-mm-id'));
      return;
    }

    const ren = e.target.closest('[data-mm-rename]');
    if (ren) {
      const row = ren.closest('[data-mm-id]');
      if (row) startRename(row.getAttribute('data-mm-id'));
      return;
    }

    const del = e.target.closest('[data-mm-del]');
    if (del) {
      const row = del.closest('[data-mm-id]');
      if (row) removeNode(row.getAttribute('data-mm-id'));
      return;
    }

    if (e.target.closest('[data-mm-undo]')) { undoDelete(); return; }

    const commit = e.target.closest('[data-mm-commit]');
    if (commit) {
      const input = host.querySelector('[data-mm-input]');
      commitEdit(input ? input.value : '');
      return;
    }

    if (e.target.closest('[data-mm-cancel]')) { cancelEdit(); return; }
  }

  /** Enter = potvrdi · Escape = odustani (inline unos). */
  function onKeydown(e) {
    const input = e.target.closest && e.target.closest('[data-mm-input]');
    if (!input) return;
    if (e.key === 'Enter') { e.preventDefault(); commitEdit(input.value); }
    else if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
  }

  /** Klik izvan unosa = odustani (nikad tiho ne spremaj nešto što korisnik nije potvrdio). */
  function onFocusout(e) {
    if (!_edit || _busy) return;
    const input = e.target.closest && e.target.closest('[data-mm-input]');
    if (!input) return;
    // Odgodi: ako je fokus otišao na ✓/✕ (mišem je spriječen blur, ali tipkovnicom NIJE),
    // njihov handler presuđuje — inače bi Tab→✓ otkazao unos prije nego gumb odradi klik.
    setTimeout(function () {
      const host = root();
      if (!_edit || !host) return;
      const a = document.activeElement;
      if (!a) { cancelEdit(); return; }
      if (host.contains(a) && a.closest('[data-mm-input],[data-mm-commit],[data-mm-cancel]')) return;
      cancelEdit();
    }, 120);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focusout', onFocusout);
    document.addEventListener('pointerdown', function (e) {
      const host = root();
      if (!host || !host.contains(e.target)) return;
      const grip = e.target.closest && e.target.closest('[data-mm-drag]');
      if (grip) startDrag(e, grip);
    });
    // Sprječava da blur ubije inline unos prije nego ✓/✕ odradi klik.
    document.addEventListener('mousedown', function (e) {
      if (e.target.closest && e.target.closest('[data-mm-commit],[data-mm-cancel]')) e.preventDefault();
    });
  }

  // ── Javno sučelje ──────────────────────────────────────────────────────
  const SokratMaterials = {
    // UI
    renderPage: renderPage,   // C0: cijela stranica (bira stablo vs poziv na prijavu)
    mount: mount,
    refresh: refresh,
    startCreate: startCreate,
    startRename: startRename,
    removeNode: removeNode,
    undoDelete: undoDelete,
    openStudy: openStudy,
    // M2 — učenje iz vlastitog materijala
    learnNode: learnNode,
    loadNodeContent: loadNodeContent,
    registerStudySubject: registerStudySubject,
    // čisto (testabilno bez preglednika)
    buildTree: buildTree,
    flattenVisible: flattenVisible,
    isSelfOrDescendant: isSelfOrDescendant,
    humanError: humanError,
    // mreža
    isAvailable: isAvailable,
    ensureRegistered: ensureRegistered,   // BUG-023: registracija bez DOM-a (obnova pozicije)
    loadTree: loadTree,
    createNode: createNode,
    renameNode: renameNode,
    moveNode: moveNode,
    reorderNodes: reorderNodes,
    deleteNode: deleteNode,
    restoreNode: restoreNode
  };

  window.SokratMaterials = SokratMaterials;
})(typeof window !== 'undefined' ? window : this);
