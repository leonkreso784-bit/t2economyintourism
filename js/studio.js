// ===== SOKRAT STUDY — STUDIO EDITOR (U8) =====
//
// U8.1 = SKELET novog vizualnog editora „Studio" (kosti iz design/mockups/editor-c-tok.html):
//   topbar+breadcrumb · STABLO (fakultet→smjer→godina→predmet→skripte) · canvas
//   (naslov + meta + mode-tabovi + PREVIEW) · inspektor-stub. Zamjenjuje dropdowne #admin-page.
// U8.2 = LEARN-PANE = blok-editor u canvasu: u draft-modu se `block-editor.js` jezgra
//   (`SokratBlockEditor`) montira u learn-pane → blokovi (kvadratići) postaju editabilni
//   (add/reorder/remove kroz U7e draft-ops). „Uredi lekciju" ulazi u draft (svjež DB payload +
//   base_version), „Objavi" = U4 RPC. **SIGURNOST:** `learn.js` bira blokove NAD `content`, pa
//   se blok-editor montira SAMO na v2/prazne kategorije; v1 (content) dobiva eksplicitnu, poništivu
//   „Uredi kao blokove" migraciju (content → jedan `legacy-html` blok; ništa se ne gubi). Kartice/
//   kviz/fill ostaju read-only preview (uređivanje = U8.3). Vizualni „čisto i bogato" prolaz = U8.6.
//
// JEDAN draft/publish engine: sve ide preko `SokratAdmin.studioBridge` (bez duplikata publish-logike).
// Stari #admin-page koegzistira (umirovljuje se kad Studio sazrije).

const SokratStudio = (function () {
  'use strict';

  let _sel = { subjectId: '', lessonId: '' }; // trenutno odabrana skripta
  let _data = null;                            // učitani sadržaj (dijeli referencu s _adminCtx.data preko setLesson)
  let _activeMode = null;                      // zadnji odabrani mode-tab (očuva se kroz re-render)

  // ---- helpers ----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Globalni i18n t() vraća KLJUČ kad prijevoda nema (studio.* nisu u rječniku) → bez ove
  // provjere bi UI pokazivao sirove ključeve („studio.publishHint"). Ključ==rezultat ⇒ fallback.
  function t(key, fb) {
    if (window.t) { const s = window.t(key); if (s && s !== key) return s; }
    return fb;
  }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function byId(id) { return document.getElementById(id); }
  function bridge() { return (window.SokratAdmin && SokratAdmin.studioBridge) ? SokratAdmin.studioBridge : null; }
  function editing() { const b = bridge(); return !!(b && b.isEditing && b.isEditing()); }
  function currentData() { const b = bridge(); if (b && editing()) { const w = b.workingData(); if (w) return w; } return _data; }
  function cats(data) {
    if (typeof getCategories === 'function') return getCategories(data);
    return Object.keys(data || {}).filter(function (k) {
      return data[k] && typeof data[k] === 'object' && !Array.isArray(data[k]);
    });
  }
  function yearLabel(y) {
    return (typeof getUiLang === 'function' && getUiLang() === 'hr') ? (y + '. godina') : ('Year ' + y);
  }
  // learn-stanje kategorije: 'v2' (blocks) · 'v1' (content, bez blocks) · '' (nema learn)
  function learnKind(c) {
    if (!c || typeof c !== 'object' || !c.learn || typeof c.learn !== 'object') return '';
    if (Array.isArray(c.learn.blocks)) return 'v2';
    if (typeof c.learn.content === 'string' && c.learn.content) return 'v1';
    return '';
  }

  // ---- STABLO (iz kataloga) ----
  function buildTree() {
    if (typeof SokratCatalog === 'undefined') return '<p class="st-hint" style="padding:12px">Katalog nije učitan.</p>';
    var facs = SokratCatalog.faculties();
    var html = '';
    facs.forEach(function (f) {
      var progHtml = '';
      SokratCatalog.programsOf(f.id).forEach(function (p) {
        var yearHtml = '';
        SokratCatalog.yearsOf(p.id).forEach(function (y) {
          var subHtml = '';
          SokratCatalog.subjectsOf(p.id, y).forEach(function (s) {
            var crumbBase = esc(f.name) + ' › ' + esc(p.name) + ' › ' + esc(yearLabel(y)) + ' › ' + esc(s.name);
            var lessonHtml = '';
            (s.lessons || []).forEach(function (l) {
              var soon = (typeof SokratCatalog.isLessonComingSoon === 'function')
                ? SokratCatalog.isLessonComingSoon(s.id, l.id) : false;
              lessonHtml +=
                '<div class="st-node"><div class="st-row' + (soon ? ' soon' : '') + '"' +
                (soon ? '' : ' data-subj="' + esc(s.id) + '" data-lesson="' + esc(l.id) + '"' +
                  ' data-crumb="' + crumbBase + '" data-lname="' + esc(l.name || l.id) + '"') +
                '><span class="st-lbl">📝 ' + esc(l.name || l.id) + (soon ? ' · soon' : '') + '</span></div></div>';
            });
            subHtml +=
              '<div class="st-node"><div class="st-row"><span class="st-tw">▶</span>' +
              '<span class="st-lbl">📖 ' + esc(s.name) + '</span></div>' +
              '<div class="st-kids">' + lessonHtml + '</div></div>';
          });
          yearHtml +=
            '<div class="st-node"><div class="st-row"><span class="st-tw">▶</span>' +
            '<span class="st-lbl">📅 ' + esc(yearLabel(y)) + '</span></div>' +
            '<div class="st-kids">' + (subHtml || '<div class="st-hint" style="padding:6px 10px">—</div>') + '</div></div>';
        });
        progHtml +=
          '<div class="st-node"><div class="st-row"><span class="st-tw">▶</span>' +
          '<span class="st-lbl">🎓 ' + esc(p.name) + '</span></div>' +
          '<div class="st-kids">' + yearHtml + '</div></div>';
      });
      html +=
        '<div class="st-node open"><div class="st-row"><span class="st-tw">▶</span>' +
        '<span class="st-lbl">🏛️ ' + esc(f.name) + '</span></div>' +
        '<div class="st-kids">' + progHtml + '</div></div>';
    });
    return html || '<p class="st-hint" style="padding:12px">Nema predmeta u katalogu.</p>';
  }

  // ---- SHELL ----
  function render() {
    var page = byId('editor-page');
    if (!page) return;
    page.innerHTML =
      '<div class="st-topbar">' +
      '  <button class="st-iconbtn" id="stBack" aria-label="' + esc(t('common.back', 'Back')) + '">←</button>' +
      '  <div class="st-logo"><span class="st-dot">🦉</span> Sokrat <span class="st-ed">STUDIO</span></div>' +
      '  <div class="st-crumb" id="stCrumb"><span class="st-c">' + esc(t('studio.pickHint', 'Odaberi skriptu iz stabla')) + '</span></div>' +
      '  <div class="st-spacer"></div>' +
      '  <button class="st-btn ghost" id="stEdit" hidden><i class="fas fa-pen"></i> ' + esc(t('studio.edit', 'Uredi')) + '</button>' +
      '  <span class="st-chip" id="stDraftChip">—</span>' +
      '  <button class="st-btn ghost" id="stDiscard" hidden>' + esc(t('admin.discard', 'Odbaci')) + '</button>' +
      '  <button class="st-btn primary" id="stPublish" hidden>⬆ ' + esc(t('admin.publish', 'Objavi')) + '</button>' +
      '  <button class="st-iconbtn" id="stOldEditor" title="Stari editor" aria-label="Stari editor">⚙</button>' +
      '</div>' +
      '<div class="st-layout">' +
      '  <aside class="st-tree">' +
      '    <button class="st-newscript" id="stNewScript">＋ ' + esc(t('studio.newScript', 'Nova skripta')) + '</button>' +
      '    <h3>🗂️ ' + esc(t('studio.structure', 'Struktura')) + '</h3>' +
      '    <div id="stTree">' + buildTree() + '</div>' +
      '  </aside>' +
      '  <main class="st-canvas" id="stCanvas">' + emptyCanvas() + '</main>' +
      '  <aside class="st-inspector">' + inspectorStub() + '</aside>' +
      '</div>';

    byId('stBack').addEventListener('click', function () { if (typeof navigateTo === 'function') navigateTo('profile'); });
    byId('stOldEditor').addEventListener('click', function () { if (typeof navigateTo === 'function') navigateTo('admin'); });
    byId('stNewScript').addEventListener('click', function () { toast(t('studio.wizardSoon', 'Čarobnjak „Nova skripta" stiže u kasnijoj cigli.')); });
    byId('stEdit').addEventListener('click', enterEdit);
    byId('stPublish').addEventListener('click', publish);
    byId('stDiscard').addEventListener('click', discard);

    // stablo (delegirano)
    byId('stTree').addEventListener('click', function (e) {
      var row = e.target.closest('.st-row');
      if (!row) return;
      if (row.classList.contains('soon')) { toast(t('studio.soon', 'Ova lekcija još nema sadržaj.')); return; }
      var subj = row.getAttribute('data-subj');
      var lesson = row.getAttribute('data-lesson');
      if (subj && lesson) selectLesson(subj, lesson, row);
      else row.parentElement.classList.toggle('open');
    });

    // canvas (delegirano): migracija v1→blokovi
    byId('stCanvas').addEventListener('click', function (e) {
      var mig = e.target.closest('[data-migrate-cat]');
      if (mig) { migrateToBlocks(mig.getAttribute('data-migrate-cat')); }
    });

    refreshTopbar();
  }

  function emptyCanvas() {
    return '<div class="st-empty"><div><div class="st-emoji">🦉</div>' +
      '<p>' + esc(t('studio.emptyTitle', 'Odaberi skriptu iz stabla lijevo')) + '</p></div></div>';
  }

  function inspectorStub() {
    return '<div class="st-icard"><h3>🎨 ' + esc(t('studio.colors', 'Boje sekcija')) + '</h3>' +
      '<p>' + esc(t('studio.colorsHint', 'Uređivanje boja stiže u kasnijoj cigli.')) + '</p>' +
      '<div class="st-swatches" style="margin-top:10px">' +
      ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'].map(function (c) {
        return '<div class="st-sw" style="background:' + c + '"></div>';
      }).join('') + '</div></div>' +
      '<div class="st-icard"><h3>⬆ Publish</h3><p>' +
      esc(t('studio.publishHint', 'Objava = publish-RPC: atomično, verzija, konflikt se ne gazi.')) + '</p></div>' +
      '<div class="st-premium"><h4>✨ AI autor <span class="st-pill">PREMIUM</span></h4>' +
      '<p>' + esc(t('studio.aiHint', 'Napiši samo Learn — kartice, kviz i dopuni nastaju automatski.')) + '</p>' +
      '<button class="st-btn primary" style="width:100%" disabled>' + esc(t('studio.aiBtn', 'Generiraj iz Learna')) + '</button></div>';
  }

  // ---- ODABIR SKRIPTE → CANVAS ----
  async function selectLesson(subjectId, lessonId, row) {
    _sel = { subjectId: subjectId, lessonId: lessonId };
    _activeMode = null; // nova skripta → počni od prvog moda
    var tree = byId('stTree');
    if (tree) tree.querySelectorAll('.st-row.active').forEach(function (r) { r.classList.remove('active'); });
    if (row) row.classList.add('active');

    var canvas = byId('stCanvas');
    if (canvas) canvas.innerHTML = '<div class="st-empty"><p>' + esc(t('admin.loading', 'Učitavanje…')) + '</p></div>';

    if (row && byId('stCrumb')) {
      var parts = (row.getAttribute('data-crumb') || '').split(' › ');
      var html = '';
      parts.forEach(function (p, i) { html += (i ? '<span class="st-sep">›</span>' : '') + '<span class="st-c">' + esc(p) + '</span>'; });
      html += '<span class="st-sep">›</span><span class="st-c now">' + esc(row.getAttribute('data-lname') || '') + '</span>';
      byId('stCrumb').innerHTML = html;
    }

    var data;
    try {
      data = await SokratContent.loadLesson(subjectId, lessonId);
    } catch (e) {
      if (canvas) canvas.innerHTML = '<div class="st-empty"><p>' + esc(t('admin.loadFail', 'Sadržaj se nije mogao učitati.')) + '</p></div>';
      return;
    }
    _data = data;
    // ožiči JEDAN draft/publish engine na ovu lekciju (nastavi draft ako postoji dirty)
    if (bridge()) { try { bridge().setLesson(subjectId, lessonId, data); } catch (e) {} }

    renderCanvas();
    refreshTopbar();
  }

  function presentModes(data) {
    var m = { learn: false, cards: false, quiz: false, fill: false };
    cats(data).forEach(function (catId) {
      var c = data[catId];
      if (!c || typeof c !== 'object') return;
      if (Array.isArray(c.flashcards) && c.flashcards.length) m.cards = true;
      if (Array.isArray(c.quiz) && c.quiz.length) m.quiz = true;
      if (Array.isArray(c.fillBlanks) && c.fillBlanks.length) m.fill = true;
      if (learnKind(c)) m.learn = true;
    });
    return m;
  }

  function renderCanvas() {
    var canvas = byId('stCanvas');
    if (!canvas) return;
    var data = currentData();
    if (!data) { canvas.innerHTML = emptyCanvas(); return; }

    var lname = '';
    var subj = (typeof SokratContent !== 'undefined') ? SokratContent.getSubject(_sel.subjectId) : null;
    if (subj && Array.isArray(subj.lessons)) {
      var lo = subj.lessons.find(function (l) { return l.id === _sel.lessonId; });
      lname = lo ? (lo.name || lo.id) : _sel.lessonId;
    }
    var isEd = editing();
    // U draft-modu prikaži i learn tab ako neka kategorija UOPĆE ima learn (za migraciju/dodavanje).
    var m = presentModes(data);
    var order = ['learn', 'cards', 'quiz', 'fill'].filter(function (k) { return m[k]; });
    var LABEL = { learn: '📚 Learn', cards: '🃏 ' + t('studio.cards', 'Kartice'), quiz: '❓ ' + t('studio.quiz', 'Kviz'), fill: '✍️ ' + t('studio.fill', 'Dopuni') };
    var active = (_activeMode && order.indexOf(_activeMode) >= 0) ? _activeMode : (order[0] || null);

    var tabs = order.map(function (k) {
      return '<button class="st-tab' + (k === active ? ' on' : '') + '" data-mode="' + k + '">' + LABEL[k] + '</button>';
    }).join('');
    var panes = order.map(function (k) {
      var body = (k === 'learn') ? renderLearnPane(data, isEd) : renderPane(k, data, isEd);
      return '<section class="st-pane' + (k === active ? ' on' : '') + '" data-pane="' + k + '">' + body + '</section>';
    }).join('');

    canvas.innerHTML =
      '<div class="st-head"><h1>' + esc(lname) + '</h1>' +
      '<div class="st-metas">' +
      '<span class="st-m">👁 ' + order.length + ' ' + esc(t('studio.modes', 'moda')) + '</span>' +
      (isEd
        ? '<span class="st-m st-editing">✏️ ' + esc(t('studio.editingTag', 'uređuješ (draft)')) + '</span>'
        : '<span class="st-m">📄 ' + esc(t('studio.previewTag', 'pregled')) + '</span>') +
      '</div></div>' +
      (order.length ? '<div class="st-tabs" id="stTabs">' + tabs + '</div>' : '') +
      (order.length ? panes : '<div class="st-empty" style="height:auto;padding:40px"><p>' + esc(t('studio.noModes', 'Ova skripta još nema sadržaja.')) + '</p></div>');

    var tabBar = byId('stTabs');
    if (tabBar) tabBar.addEventListener('click', function (e) {
      var b = e.target.closest('.st-tab'); if (!b) return;
      var mode = b.getAttribute('data-mode');
      _activeMode = mode;
      canvas.querySelectorAll('.st-tab').forEach(function (x) { x.classList.toggle('on', x === b); });
      canvas.querySelectorAll('.st-pane').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-pane') === mode); });
    });

    if (isEd) mountLearnEditors();
  }

  // ---- LEARN PANE (edit-svjestan) ----
  function renderLearnPane(data, isEd) {
    var out = '';
    var n = 0;
    cats(data).forEach(function (catId) {
      var c = data[catId];
      if (!c || typeof c !== 'object') return;
      var kind = learnKind(c);
      if (!isEd && !kind) return;              // read-only: preskoči kategorije bez learn-a
      if (isEd && !kind) return;               // U8.2: dodavanje learn-a praznoj kategoriji = kasnija cigla
      n++;
      var accStyle = c.color ? ' style="--st-acc:' + esc(c.color) + '"' : '';
      var catName = esc(c.name || catId);

      if (!isEd) {
        // READ-ONLY preview (U8.1) kroz JEDAN renderer
        var body = renderLearnBody(c.learn, kind);
        out += '<div class="st-kv"' + accStyle + '><div class="st-kvhead"><span class="st-n">' + n + '</span>' +
          '<h2>' + catName + (c.learn.title ? ' — ' + esc(c.learn.title) : '') + '</h2></div>' +
          '<div class="st-body">' + body + '</div></div>';
        return;
      }

      // EDIT-MOD
      out += '<div class="st-learn-cat"' + accStyle + '><div class="st-learn-cathead">§ ' + catName + '</div>';
      if (kind === 'v2') {
        // blok-editor (kvadratići) — montira se u post-renderu
        out += '<div class="be-mount" data-be-cat="' + esc(catId) + '"></div>';
      } else {
        // v1: read-only + sigurna migracija na blokove (learn.js bira blokove nad content → ne montiramo editor na v1)
        out += '<div class="st-kv"' + accStyle + '><div class="st-body">' + renderLearnBody(c.learn, 'v1') + '</div></div>' +
          '<div class="st-legacy-note">' + esc(t('studio.v1Note', 'Stari format (jedan HTML). Prebaci na blokove za uređivanje po kvadratićima:')) + '</div>' +
          '<button type="button" class="st-migrate" data-migrate-cat="' + esc(catId) + '"><i class="fas fa-cubes"></i> ' +
          esc(t('studio.migrate', 'Uredi kao blokove')) + '</button>';
      }
      out += '</div>';
    });
    if (!out) return '<p class="st-hint">' + esc(t('studio.learnEmpty', 'Nema learn-sadržaja u ovoj skripti.')) + '</p>';
    return out;
  }

  function renderLearnBody(L, kind) {
    if (kind === 'v2' && typeof window.renderBlocks === 'function') return window.renderBlocks(L.blocks);
    if (kind === 'v1' && typeof window.renderBlocks === 'function') return window.renderBlocks([{ type: 'legacy-html', html: L.content }]);
    return esc(String((L && L.content) || ''));
  }

  // ---- KARTICE/KVIZ/FILL PANE (read-only preview + U8.3 edit-mod) ----
  // Tijela stavki (dijele read-only i edit).
  function cardBody(fc) { return '<div class="st-q">' + esc(fc.question || '') + '</div><div class="st-a">' + esc(fc.answer || '') + '</div>'; }
  function quizBody(qz) {
    var opts = Array.isArray(qz.options) ? qz.options : [];
    return '<div class="st-qtext">' + esc(qz.question || '') + '</div>' + opts.map(function (o, oi) {
      var ok = (oi === qz.correct);
      return '<div class="st-opt' + (ok ? ' correct' : '') + '">' + esc(o) + (ok ? '<span class="st-ok">TOČAN</span>' : '') + '</div>';
    }).join('');
  }
  function fillBody(fb) { return '<div class="st-fsent">' + esc(fb.sentence || '') + '</div><div class="st-fans">→ ' + esc(fb.answer || '') + '</div>'; }

  var PANE_MAP = {
    cards: { arr: 'flashcards', type: 'flashcard', body: cardBody, add: 'Dodaj karticu' },
    quiz:  { arr: 'quiz',       type: 'quiz',      body: quizBody, add: 'Dodaj pitanje' },
    fill:  { arr: 'fillBlanks', type: 'fill',      body: fillBody, add: 'Dodaj dopunu' }
  };

  // U8.3: uređivanje kartica/kviza/fill-a REUSE-a admin modal-editore + kontrole (data-admin-*),
  // koje već hvataju globalni listeneri u admin.js (edit ✎ / dodaj ＋ / obriši 🗑 / presloži ↑↓).
  // Op ide u ISTI draft → `_adminRerender` → `onDraftChanged` osvježi Studio canvas.
  function renderPane(mode, data, isEd) {
    var m = PANE_MAP[mode];
    if (!m) return '';
    var hasCtrls = (typeof _adminItemControls === 'function' && typeof _adminAddBtn === 'function');
    var out = '';
    cats(data).forEach(function (catId) {
      var c = data[catId];
      if (!c || typeof c !== 'object') return;
      var arr = Array.isArray(c[m.arr]) ? c[m.arr] : [];
      if (!isEd && !arr.length) return;                    // read-only: preskoči prazne
      var accStyle = c.color ? ' style="--st-acc:' + esc(c.color) + '"' : '';
      out += '<div class="st-seclbl">§ ' + esc(c.name || catId) + '</div>';

      if (!isEd) {
        if (mode === 'cards') {
          out += '<div class="st-cardgrid">' + arr.map(function (fc) {
            return '<div class="st-fcard"' + accStyle + '>' + m.body(fc) + '</div>';
          }).join('') + '</div>';
        } else {
          out += arr.map(function (it) {
            return '<div class="' + (mode === 'quiz' ? 'st-qz' : 'st-fill') + '"' + accStyle + '>' + m.body(it) + '</div>';
          }).join('');
        }
        return;
      }

      // EDIT: svaka stavka = tijelo + admin-kontrole + „＋ Dodaj" na dnu kategorije
      arr.forEach(function (it, i) {
        out += '<div class="st-edit-item"' + accStyle + '><div class="st-edit-body">' + m.body(it) + '</div>' +
          (hasCtrls ? _adminItemControls(true, m.type, catId, i, arr.length) : '') + '</div>';
      });
      if (hasCtrls) out += '<div class="st-addwrap">' + _adminAddBtn(true, m.type, catId, m.add) + '</div>';
    });
    return out || '<p class="st-hint">' + esc(t('studio.paneEmpty', 'Nema sadržaja u ovom modu.')) + '</p>';
  }

  // ---- BLOK-EDITOR mount (U8.2): montira SokratBlockEditor u svaki .be-mount learn-panea ----
  function mountLearnEditors() {
    var b = bridge();
    if (!b || !window.SokratBlockEditor || typeof SokratBlockEditor.mount !== 'function') return;
    var canvas = byId('stCanvas');
    if (!canvas) return;
    canvas.querySelectorAll('.be-mount').forEach(function (el) {
      var catId = el.getAttribute('data-be-cat');
      SokratBlockEditor.mount(el, {
        catId: catId,
        getBlocks: function () { return b.getBlocks(catId); },
        applyOp: function (op) { var r = b.applyOp(op); refreshTopbar(); return r; }
      });
    });
  }

  // v1 → v2: sadržaj postaje jedan legacy-html blok (addBlock dodijeli id). Poništivo (Odbaci/content_versions).
  function migrateToBlocks(catId) {
    var b = bridge();
    if (!b || !editing()) return;
    var data = currentData();
    var c = data && data[catId];
    if (!c || learnKind(c) !== 'v1') return;
    var res = b.applyOp({ type: 'addBlock', catId: catId, item: { type: 'legacy-html', html: c.learn.content } });
    if (res && res.ok) {
      renderCanvas();
      refreshTopbar();
      toast(t('studio.migrated', 'Sekcija prebačena na blokove — postojeći sadržaj je sad prvi blok.'));
    }
  }

  // ---- ULAZ U EDIT / OBJAVI / ODBACI (JEDAN engine preko bridge-a) ----
  async function enterEdit() {
    var b = bridge();
    if (!b || !_sel.subjectId) return;
    if (editing()) return;
    await b.enter();                 // svjež DB payload + SokratDraft.begin (toast „nije u bazi" ako fali)
    if (editing()) { renderCanvas(); refreshTopbar(); }
  }

  function currentDraft() {
    return (window.SokratDraft && _sel.subjectId) ? SokratDraft.get(_sel.subjectId, _sel.lessonId) : null;
  }

  function refreshTopbar() {
    var chip = byId('stDraftChip');
    var editBtn = byId('stEdit');
    var pub = byId('stPublish');
    var dis = byId('stDiscard');
    var b = bridge();
    var isEd = editing();
    var hasLesson = !!_sel.subjectId;
    var canEdit = hasLesson && b && (typeof b.hasVar !== 'function' || b.hasVar());

    if (editBtn) editBtn.hidden = !(canEdit && !isEd);
    if (pub) pub.hidden = !isEd;
    if (dis) dis.hidden = !isEd;

    if (!chip) return;
    if (!hasLesson) { chip.textContent = '—'; chip.classList.remove('dirty'); return; }
    var d = currentDraft();
    if (d && d.dirty) {
      chip.textContent = '✏️ ' + d.ops.length + ' ' + t('studio.changes', 'izmjena');
      chip.classList.add('dirty');
    } else {
      chip.textContent = '✓ ' + t('studio.published', 'objavljeno');
      chip.classList.remove('dirty');
    }
  }

  async function publish() {
    var d = currentDraft();
    if (!d || !d.dirty) { toast(t('studio.nothingToPublish', 'Nema izmjena za objavu.')); return; }
    if (!bridge()) return;
    await bridge().publish();          // U4 publish_document RPC
    renderCanvas();                    // izašli iz draft-moda → read-only sinkroniziran sadržaj
    refreshTopbar();
  }
  async function discard() {
    var d = currentDraft();
    if (!d || !d.dirty) { toast(t('studio.nothingToDiscard', 'Nema izmjena.')); return; }
    if (!bridge()) return;
    await bridge().discard();
    renderCanvas();
    refreshTopbar();
  }

  // Hook: admin draft-op (`_adminRerender`) je promijenio isti draft → osvježi Studio canvas.
  // No-op ako Studio nije aktivan (npr. op je došao sa starog #admin-page).
  function onDraftChanged() {
    var page = byId('editor-page');
    if (!page || !page.classList.contains('active')) return;
    if (!_sel.subjectId) return;
    renderCanvas();
    refreshTopbar();
  }

  return { render: render, onDraftChanged: onDraftChanged };
})();

window.SokratStudio = SokratStudio;
// Poziva ga navigateTo('editor') (navigation.js), analogno renderAdminPage().
window.renderStudioPage = function () { SokratStudio.render(); };

// Ulaz u Studio: admin-only gumb u profilu (data-studio-open). Stari „Edit content" ostaje (→ #admin-page).
document.addEventListener('click', function (e) {
  if (e.target.closest('[data-studio-open]')) {
    if (typeof navigateTo === 'function') navigateTo('editor');
  }
});
