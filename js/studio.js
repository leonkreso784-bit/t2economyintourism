// ===== SOKRAT STUDY — STUDIO EDITOR (U8) =====
//
// U8.1 = SKELET novog vizualnog editora „Studio" (kosti iz design/mockups/editor-c-tok.html):
//   topbar+breadcrumb · STABLO (fakultet→smjer→godina→predmet→skripte, iz kataloga) ·
//   canvas (naslov + meta + mode-tabovi + read-only PREVIEW) · inspektor (stub).
// Zamjenjuje ružne „select predmet/lekcija" dropdowne starog #admin-page.
//
// OPSEG U8.1 (svjesno): navigacija + preview + prebacivanje modova. NE uređuje sadržaj
//   (blok-editor u learn = U8.2 · kartice/kviz/fill = U8.3 · tekst/media/boje = U8.4–5 ·
//   vizualni „čisto i bogato" prolaz = U8.6 · struktura-CRUD u stablu + wizard = kasnije).
// „Objavi/Odbaci" su ožičeni na JEDAN postojeći draft/publish engine (admin.js) preko
//   SokratAdmin.studioBridge — bez duplikata publish-logike; RPC/versioning/audit = U4.
//
// Stari #admin-page ostaje dostupan (koegzistira; umirovljuje se kad Studio sazrije).

const SokratStudio = (function () {
  'use strict';

  let _sel = { subjectId: '', lessonId: '' }; // trenutno odabrana skripta

  // ---- helpers ----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function t(key, fb) { return (window.t) ? window.t(key) : fb; }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function cats(data) {
    if (typeof getCategories === 'function') return getCategories(data);
    return Object.keys(data || {}).filter(function (k) {
      return data[k] && typeof data[k] === 'object' && !Array.isArray(data[k]);
    });
  }
  function yearLabel(y) {
    return (typeof getUiLang === 'function' && getUiLang() === 'hr') ? (y + '. godina') : ('Year ' + y);
  }

  // ---- STABLO (iz kataloga) ----
  // Gradi fakultet→smjer→godina→predmet→skripte. Svaki list (skripta) nosi data-subj/lesson
  // + data-crumb (za breadcrumb) + .soon ako lekcija nema sadržaj (isLessonComingSoon).
  function buildTree() {
    if (typeof SokratCatalog === 'undefined') return '<p class="st-hint" style="padding:12px">Katalog nije učitan.</p>';
    var facs = SokratCatalog.faculties();
    var html = '';
    facs.forEach(function (f) {
      var progs = SokratCatalog.programsOf(f.id);
      var progHtml = '';
      progs.forEach(function (p) {
        var years = SokratCatalog.yearsOf(p.id);
        var yearHtml = '';
        years.forEach(function (y) {
          var subs = SokratCatalog.subjectsOf(p.id, y);
          var subHtml = '';
          subs.forEach(function (s) {
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
    var page = document.getElementById('editor-page');
    if (!page) return;
    page.innerHTML =
      '<div class="st-topbar">' +
      '  <button class="st-iconbtn" id="stBack" aria-label="' + esc(t('common.back', 'Back')) + '">←</button>' +
      '  <div class="st-logo"><span class="st-dot">🦉</span> Sokrat <span class="st-ed">STUDIO</span></div>' +
      '  <div class="st-crumb" id="stCrumb"><span class="st-c">' + esc(t('studio.pickHint', 'Odaberi skriptu iz stabla')) + '</span></div>' +
      '  <div class="st-spacer"></div>' +
      '  <span class="st-chip" id="stDraftChip">—</span>' +
      '  <button class="st-btn ghost" id="stDiscard">' + esc(t('admin.discard', 'Odbaci')) + '</button>' +
      '  <button class="st-btn primary" id="stPublish">⬆ ' + esc(t('admin.publish', 'Objavi')) + '</button>' +
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

    // topbar akcije
    byId('stBack').addEventListener('click', function () { if (typeof navigateTo === 'function') navigateTo('profile'); });
    byId('stOldEditor').addEventListener('click', function () { if (typeof navigateTo === 'function') navigateTo('admin'); });
    byId('stNewScript').addEventListener('click', function () { toast(t('studio.wizardSoon', 'Čarobnjak „Nova skripta" stiže u kasnijoj cigli.')); });
    byId('stPublish').addEventListener('click', publish);
    byId('stDiscard').addEventListener('click', discard);

    // stablo (delegirano): klik na skriptu = odaberi; klik na granu = toggle; soon = toast
    byId('stTree').addEventListener('click', function (e) {
      var row = e.target.closest('.st-row');
      if (!row) return;
      if (row.classList.contains('soon')) { toast(t('studio.soon', 'Ova lekcija još nema sadržaj.')); return; }
      var subj = row.getAttribute('data-subj');
      var lesson = row.getAttribute('data-lesson');
      if (subj && lesson) {
        selectLesson(subj, lesson, row);
      } else {
        row.parentElement.classList.toggle('open'); // grana
      }
    });

    refreshDraftChip();
  }

  function byId(id) { return document.getElementById(id); }

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

  // ---- ODABIR SKRIPTE → CANVAS PREVIEW ----
  async function selectLesson(subjectId, lessonId, row) {
    _sel = { subjectId: subjectId, lessonId: lessonId };
    // aktivni red u stablu
    var tree = byId('stTree');
    if (tree) tree.querySelectorAll('.st-row.active').forEach(function (r) { r.classList.remove('active'); });
    if (row) row.classList.add('active');

    var canvas = byId('stCanvas');
    if (canvas) canvas.innerHTML = '<div class="st-empty"><p>' + esc(t('admin.loading', 'Učitavanje…')) + '</p></div>';

    // breadcrumb iz podataka reda
    if (row && byId('stCrumb')) {
      var crumb = row.getAttribute('data-crumb') || '';
      var lname = row.getAttribute('data-lname') || '';
      var parts = crumb.split(' › ');
      var html = '';
      parts.forEach(function (p, i) { html += (i ? '<span class="st-sep">›</span>' : '') + '<span class="st-c">' + esc(p) + '</span>'; });
      html += '<span class="st-sep">›</span><span class="st-c now">' + esc(lname) + '</span>';
      byId('stCrumb').innerHTML = html;
    }

    var data;
    try {
      data = await SokratContent.loadLesson(subjectId, lessonId);
    } catch (e) {
      if (canvas) canvas.innerHTML = '<div class="st-empty"><p>' + esc(t('admin.loadFail', 'Sadržaj se nije mogao učitati.')) + '</p></div>';
      return;
    }

    // ožiči JEDAN draft/publish engine na ovu lekciju (bez uređivanja u U8.1)
    if (window.SokratAdmin && SokratAdmin.studioBridge) {
      try { SokratAdmin.studioBridge.setLesson(subjectId, lessonId, data); } catch (e) {}
    }

    renderCanvas(data);
    refreshDraftChip();
  }

  function presentModes(data) {
    var m = { learn: false, cards: false, quiz: false, fill: false };
    cats(data).forEach(function (catId) {
      var c = data[catId];
      if (!c || typeof c !== 'object') return;
      if (Array.isArray(c.flashcards) && c.flashcards.length) m.cards = true;
      if (Array.isArray(c.quiz) && c.quiz.length) m.quiz = true;
      if (Array.isArray(c.fillBlanks) && c.fillBlanks.length) m.fill = true;
      var L = c.learn;
      if (L && typeof L === 'object' && ((typeof L.content === 'string' && L.content) || Array.isArray(L.blocks))) m.learn = true;
    });
    return m;
  }

  function renderCanvas(data) {
    var canvas = byId('stCanvas');
    if (!canvas) return;
    var lname = '';
    var subj = (typeof SokratContent !== 'undefined') ? SokratContent.getSubject(_sel.subjectId) : null;
    if (subj && Array.isArray(subj.lessons)) {
      var lo = subj.lessons.find(function (l) { return l.id === _sel.lessonId; });
      lname = lo ? (lo.name || lo.id) : _sel.lessonId;
    }
    var m = presentModes(data);
    var order = ['learn', 'cards', 'quiz', 'fill'].filter(function (k) { return m[k]; });
    var LABEL = { learn: '📚 Learn', cards: '🃏 ' + t('studio.cards', 'Kartice'), quiz: '❓ ' + t('studio.quiz', 'Kviz'), fill: '✍️ ' + t('studio.fill', 'Dopuni') };
    var active = order[0] || null;

    var tabs = order.map(function (k) {
      return '<button class="st-tab' + (k === active ? ' on' : '') + '" data-mode="' + k + '">' + LABEL[k] + '</button>';
    }).join('');

    var panes = order.map(function (k) {
      return '<section class="st-pane' + (k === active ? ' on' : '') + '" data-pane="' + k + '">' + renderPane(k, data) + '</section>';
    }).join('');

    canvas.innerHTML =
      '<div class="st-head"><h1>' + esc(lname) + '</h1>' +
      '<div class="st-metas">' +
      '<span class="st-m">👁 ' + order.length + ' ' + esc(t('studio.modes', 'moda')) + '</span>' +
      '<span class="st-m">📄 ' + esc(t('studio.previewTag', 'pregled (uređivanje: sljedeća cigla)')) + '</span>' +
      '</div></div>' +
      (order.length ? '<div class="st-tabs" id="stTabs">' + tabs + '</div>' : '') +
      (order.length ? panes : '<div class="st-empty" style="height:auto;padding:40px"><p>' + esc(t('studio.noModes', 'Ova skripta još nema sadržaja.')) + '</p></div>');

    var tabBar = byId('stTabs');
    if (tabBar) tabBar.addEventListener('click', function (e) {
      var b = e.target.closest('.st-tab'); if (!b) return;
      var mode = b.getAttribute('data-mode');
      canvas.querySelectorAll('.st-tab').forEach(function (x) { x.classList.toggle('on', x === b); });
      canvas.querySelectorAll('.st-pane').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-pane') === mode); });
    });
  }

  // read-only PREVIEW panea (uređivanje = kasnije cigle). Boja kategorije (cat.color) → --st-acc.
  function renderPane(mode, data) {
    var out = '';
    var n = 0;
    cats(data).forEach(function (catId) {
      var c = data[catId];
      if (!c || typeof c !== 'object') return;
      var accStyle = c.color ? ' style="--st-acc:' + esc(c.color) + '"' : '';
      var catName = esc(c.name || catId);

      if (mode === 'learn') {
        var L = c.learn;
        var hasLearn = L && typeof L === 'object' && ((typeof L.content === 'string' && L.content) || Array.isArray(L.blocks));
        if (!hasLearn) return;
        n++;
        var body = '';
        if (Array.isArray(L.blocks) && typeof window.renderBlocks === 'function') {
          body = window.renderBlocks(L.blocks);
        } else if (typeof L.content === 'string' && typeof window.renderBlocks === 'function') {
          body = window.renderBlocks([{ type: 'legacy-html', html: L.content }]); // v1 kroz ISTI renderer (granica)
        } else {
          body = esc(String(L.content || ''));
        }
        out += '<div class="st-kv"' + accStyle + '><div class="st-kvhead"><span class="st-n">' + n + '</span>' +
          '<h2>' + catName + (L.title ? ' — ' + esc(L.title) : '') + '</h2></div>' +
          '<div class="st-body">' + body + '</div></div>';
      } else if (mode === 'cards') {
        var fcs = Array.isArray(c.flashcards) ? c.flashcards : [];
        if (!fcs.length) return;
        out += '<div class="st-seclbl">§ ' + catName + '</div><div class="st-cardgrid">' +
          fcs.map(function (fc) {
            return '<div class="st-fcard"' + accStyle + '><div class="st-q">' + esc(fc.question || '') + '</div>' +
              '<div class="st-a">' + esc(fc.answer || '') + '</div></div>';
          }).join('') + '</div>';
      } else if (mode === 'quiz') {
        var qs = Array.isArray(c.quiz) ? c.quiz : [];
        if (!qs.length) return;
        out += '<div class="st-seclbl">§ ' + catName + '</div>' +
          qs.map(function (qz) {
            var opts = Array.isArray(qz.options) ? qz.options : [];
            return '<div class="st-qz"' + accStyle + '><div class="st-qtext">' + esc(qz.question || '') + '</div>' +
              opts.map(function (o, oi) {
                var ok = (oi === qz.correct);
                return '<div class="st-opt' + (ok ? ' correct' : '') + '">' + esc(o) + (ok ? '<span class="st-ok">TOČAN</span>' : '') + '</div>';
              }).join('') + '</div>';
          }).join('');
      } else if (mode === 'fill') {
        var fbs = Array.isArray(c.fillBlanks) ? c.fillBlanks : [];
        if (!fbs.length) return;
        out += '<div class="st-seclbl">§ ' + catName + '</div>' +
          fbs.map(function (fb) {
            return '<div class="st-fill"' + accStyle + '><div class="st-fsent">' + esc(fb.sentence || '') + '</div>' +
              '<div class="st-fans">→ ' + esc(fb.answer || '') + '</div></div>';
          }).join('');
      }
    });
    return out || '<p class="st-hint">' + esc(t('studio.paneEmpty', 'Nema sadržaja u ovom modu.')) + '</p>';
  }

  // ---- draft-chip + Objavi/Odbaci (JEDAN engine preko SokratAdmin.studioBridge) ----
  function currentDraft() {
    return (window.SokratDraft && _sel.subjectId)
      ? SokratDraft.get(_sel.subjectId, _sel.lessonId) : null;
  }
  function refreshDraftChip() {
    var chip = byId('stDraftChip');
    if (!chip) return;
    if (!_sel.subjectId) { chip.textContent = '—'; chip.classList.remove('dirty'); return; }
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
    if (!(window.SokratAdmin && SokratAdmin.studioBridge)) return;
    await SokratAdmin.studioBridge.publish();
    refreshDraftChip();
  }
  async function discard() {
    var d = currentDraft();
    if (!d || !d.dirty) { toast(t('studio.nothingToDiscard', 'Nema izmjena.')); return; }
    if (!(window.SokratAdmin && SokratAdmin.studioBridge)) return;
    await SokratAdmin.studioBridge.discard();
    refreshDraftChip();
  }

  return { render: render };
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
