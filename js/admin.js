// ===== SOKRAT STUDY — ADMIN (F4 Admin CRUD) =====
//
// F4.3a: detekcija admina + otkrivanje admin-only UI elemenata.
// F4.3b: admin editor stranica (#admin-page) — read-only pregled sadržaja (predmet → lekcija → kartice).
//        Uređivanje/spremanje dolazi u F4.3c. Sadržaj je javan (public-read) → viewer se smije renderirati
//        svakome; ulaz je admin-only (skriveni gumb, F4.3a), a WRITE (F4.3c) je RLS-zaštićen (F4.2).
//
// VAŽNO: prava sigurnost je u RLS-u (F4.1 profiles/is_admin + F4.2 write-policyji) —
// ne-admin FIZIČKI ne može pisati u bazu. .admin-only skrivanje je samo UX.

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

  // Ulaz u editor (skriveni gumb u profilu, F4.3a) → admin stranica.
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-open-editor]')) {
      if (typeof navigateTo === 'function') navigateTo('admin');
    }
  });

  // Back-gumb admin stranice → natrag na profil.
  document.addEventListener('DOMContentLoaded', function () {
    init();
    const back = document.getElementById('backFromAdmin');
    if (back) back.addEventListener('click', function () {
      if (typeof navigateTo === 'function') navigateTo('profile');
    });
  });

  return { refresh: refresh, isAdmin: isAdmin, applyVisibility: applyVisibility };
})();

window.SokratAdmin = SokratAdmin;

// ===== F4.3b — Admin editor stranica (read-only viewer) =====
// Renderira se iz navigateTo('admin') (navigation.js). Koristi ContentRepository (S1 šav).

/** i18n helper: t() ako postoji, inače fallback (engleski original). */
function _adminT(key, fb) { return (window.t) ? t(key) : fb; }

function _adminEscape(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/** Kratki čitljiv izvadak iz HTML-a (skini tagove, sažmi razmake, odreži) — SAMO za preview. */
function _adminExcerpt(html, n) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > n ? text.slice(0, n) + '…' : text;
}

function renderAdminPage() {
  const root = document.getElementById('adminContent');
  if (!root) return;

  const subjects = (window.SokratContent && typeof SokratContent.listSubjects === 'function')
    ? SokratContent.listSubjects() : [];

  let opts = '<option value="">' + _adminT('admin.selectSubject', '— select subject —') + '</option>';
  subjects.forEach(function (s) {
    opts += '<option value="' + _adminEscape(s.id) + '">' + _adminEscape(s.shortName || s.name || s.id) + '</option>';
  });

  root.innerHTML =
    '<div class="profile-card profile-card--wide">' +
    '  <p class="profile-meta">' + _adminT('admin.viewerNote', 'Read-only content viewer. Editing arrives in the next step.') + '</p>' +
    '  <div class="admin-pickers">' +
    '    <label class="admin-field"><span>' + _adminT('admin.subject', 'Subject') + '</span>' +
    '      <select id="adminSubjectSel" class="auth-modal__input">' + opts + '</select></label>' +
    '    <label class="admin-field"><span>' + _adminT('admin.lesson', 'Lesson') + '</span>' +
    '      <select id="adminLessonSel" class="auth-modal__input" disabled></select></label>' +
    '  </div>' +
    '</div>' +
    '<div id="adminEditBar"></div>' +
    '<div id="adminCards"></div>';

  document.getElementById('adminSubjectSel').addEventListener('change', _onAdminSubjectChange);
  document.getElementById('adminLessonSel').addEventListener('change', _onAdminLessonChange);
}

function _onAdminSubjectChange() {
  const subjectId = document.getElementById('adminSubjectSel').value;
  const lessonSel = document.getElementById('adminLessonSel');
  const cards = document.getElementById('adminCards');
  if (cards) cards.innerHTML = '';
  if (!subjectId) { lessonSel.innerHTML = ''; lessonSel.disabled = true; return; }

  const subject = SokratContent.getSubject(subjectId);
  const lessons = (subject && Array.isArray(subject.lessons)) ? subject.lessons : [];
  let opts = '<option value="">' + _adminT('admin.selectLesson', '— select lesson —') + '</option>';
  lessons.forEach(function (l) {
    const soon = SokratContent.isLessonComingSoon(subjectId, l.id);
    opts += '<option value="' + _adminEscape(l.id) + '"' + (soon ? ' disabled' : '') + '>' +
      _adminEscape(l.name || l.id) + (soon ? ' — soon' : '') + '</option>';
  });
  lessonSel.innerHTML = opts;
  lessonSel.disabled = false;
}

async function _onAdminLessonChange() {
  const subjectId = document.getElementById('adminSubjectSel').value;
  const lessonId = document.getElementById('adminLessonSel').value;
  const holder = document.getElementById('adminCards');
  if (!holder) return;
  _adminCtx = { subjectId: '', lessonId: '', varName: '', data: null }; // reset (F4.3c-1)
  _draftMode = false; // U3: promjena lekcije izlazi iz draft-moda (draft ostaje u memoriji + autosave)
  if (!subjectId || !lessonId) { holder.innerHTML = ''; _renderEditBar(); return; }

  holder.innerHTML = '<p class="profile-meta">' + _adminT('admin.loading', 'Loading…') + '</p>';
  let data = {};
  try {
    data = await SokratContent.loadLesson(subjectId, lessonId);
  } catch (e) {
    holder.innerHTML = '<p class="profile-meta">' + _adminT('admin.loadFail', 'Could not load content.') + '</p>';
    return;
  }
  // F4.3c-1: zapamti KOJI window-var ovoj lekciji pripada (resolve[lessonId]) — write ide u TAJ red.
  _adminCtx = { subjectId: subjectId, lessonId: lessonId, varName: _adminResolveVar(subjectId, lessonId) || '', data: data };
  // U3: ako za ovu lekciju već postoji draft s promjenama → automatski nastavi u draft-modu.
  const existing = _adminDraft();
  _draftMode = !!(existing && existing.dirty);
  _renderEditBar();
  _renderAdminCards(holder, _adminWorking());
}

/** Edit-gumb (samo adminu) za stavku (type ∈ flashcard|quiz). */
function _adminEditBtn(canEdit, type, catId, idx) {
  if (!canEdit) return '';
  return '<button type="button" class="admin-edit-btn" data-admin-edit data-type="' + type +
    '" data-cat="' + _adminEscape(catId) + '" data-idx="' + idx +
    '" aria-label="' + _adminT('admin.edit', 'Edit') + '"><i class="fas fa-pen"></i></button>';
}

/** „Dodaj stavku" gumb (samo adminu, samo draft-mod) — U6c strukturne operacije. */
function _adminAddBtn(canEdit, type, catId, label) {
  if (!canEdit) return '';
  return '<button type="button" class="admin-add-btn" data-admin-add data-type="' + type +
    '" data-cat="' + _adminEscape(catId) + '"><i class="fas fa-plus"></i> ' + label + '</button>';
}

// U6e-1 — „Obriši stavku" gumb (kartica/kviz/fill; samo draft-mod). remove* op (id + idx fallback).
function _adminItemDelBtn(canEdit, type, catId, idx) {
  if (!canEdit) return '';
  return '<button type="button" class="admin-edit-btn admin-del" data-admin-del data-type="' + type +
    '" data-cat="' + _adminEscape(catId) + '" data-idx="' + idx +
    '" aria-label="' + _adminT('admin.removeItem', 'Remove') + '"><i class="fas fa-trash"></i></button>';
}

// U6e — kontrole stavke (desno): presloži ↑↓ + uredi ✎ + obriši 🗑. Grupa za flashcard/quiz/fill.
function _adminItemControls(canEdit, type, catId, idx, total) {
  if (!canEdit) return _adminEditBtn(canEdit, type, catId, idx);
  const esc = _adminEscape(catId);
  const upDis = (idx <= 0) ? ' disabled' : '';
  const downDis = (idx >= total - 1) ? ' disabled' : '';
  return '<div class="admin-card-ctrls">' +
    '<button type="button" class="admin-edit-btn" data-admin-move="up" data-type="' + type + '" data-cat="' + esc + '" data-idx="' + idx + '"' + upDis +
      ' aria-label="' + _adminT('admin.moveUp', 'Move up') + '"><i class="fas fa-arrow-up"></i></button>' +
    '<button type="button" class="admin-edit-btn" data-admin-move="down" data-type="' + type + '" data-cat="' + esc + '" data-idx="' + idx + '"' + downDis +
      ' aria-label="' + _adminT('admin.moveDown', 'Move down') + '"><i class="fas fa-arrow-down"></i></button>' +
    _adminEditBtn(canEdit, type, catId, idx) +
    _adminItemDelBtn(canEdit, type, catId, idx) +
    '</div>';
}

// U6d — kategorije-UI: „Uredi" (meta: name/icon/color) na zaglavlju + „Dodaj kategoriju" na dnu.
function _adminCatEditBtn(canEdit, catId) {
  if (!canEdit) return '';
  return '<button type="button" class="admin-edit-btn admin-cat-edit" data-admin-cat-edit' +
    ' data-cat="' + _adminEscape(catId) + '" aria-label="' + _adminT('admin.editCategory', 'Edit category') +
    '"><i class="fas fa-pen"></i></button>';
}
function _adminCatAddBtn(canEdit, label) {
  if (!canEdit) return '';
  return '<button type="button" class="admin-add-btn admin-add-btn--cat" data-admin-cat-add>' +
    '<i class="fas fa-folder-plus"></i> ' + label + '</button>';
}

// U6d-2 — kontrole kategorije (gore-desno): presloži ↑↓ · uredi ✎ · obriši 🗑. Krajnje strelice disabled.
function _adminCatControls(canEdit, catId, catIdx, total) {
  if (!canEdit) return '';
  const esc = _adminEscape(catId);
  const upDis = (catIdx <= 0) ? ' disabled' : '';
  const downDis = (catIdx >= total - 1) ? ' disabled' : '';
  return '<div class="admin-cat-ctrls">' +
    '<button type="button" class="admin-edit-btn" data-admin-cat-move="up" data-cat="' + esc + '"' + upDis +
      ' aria-label="' + _adminT('admin.moveUp', 'Move up') + '"><i class="fas fa-arrow-up"></i></button>' +
    '<button type="button" class="admin-edit-btn" data-admin-cat-move="down" data-cat="' + esc + '"' + downDis +
      ' aria-label="' + _adminT('admin.moveDown', 'Move down') + '"><i class="fas fa-arrow-down"></i></button>' +
    _adminCatEditBtn(canEdit, catId) +
    '<button type="button" class="admin-edit-btn admin-cat-del" data-admin-cat-del data-cat="' + esc + '"' +
      ' aria-label="' + _adminT('admin.removeCategory', 'Remove category') + '"><i class="fas fa-trash"></i></button>' +
    '</div>';
}

function _renderAdminCards(holder, data) {
  const cats = (data && typeof data === 'object') ? Object.keys(data) : [];
  // F4.3c-1: edit-gumbi samo adminu (RLS je prava zaštita; ovo je UX/defense-in-depth).
  // U3: i SAMO u draft-modu — jedini put do izmjene je draft → „Objavi" (EDITOR_PLAN §4.1).
  const canEdit = !!(window.SokratAdmin && typeof SokratAdmin.isAdmin === 'function' && SokratAdmin.isAdmin()) && _draftMode;
  let html = '';
  let total = 0;

  cats.forEach(function (catId, catIdx) {
    const cat = data[catId];
    if (!cat || typeof cat !== 'object') return;
    const fcs = Array.isArray(cat.flashcards) ? cat.flashcards : [];
    const quiz = Array.isArray(cat.quiz) ? cat.quiz : [];
    const fills = Array.isArray(cat.fillBlanks) ? cat.fillBlanks : [];
    const hasLearn = !!(cat.learn && typeof cat.learn === 'object' && cat.learn.content);
    // Studenti preskaču praznu kategoriju; u draft-modu (canEdit) prikaži je da se može dodavati (U6c).
    if (!canEdit && fcs.length === 0 && quiz.length === 0 && fills.length === 0 && !hasLearn) return;

    html +=
      '<div class="profile-card profile-card--wide admin-cat">' +
      '<div class="admin-cat-head">' +
      '  <h3 class="profile-card-title"><i class="fas ' + _adminEscape(cat.icon || 'fa-book') + '"></i> ' +
      _adminEscape(cat.name || catId) + '</h3>' +
      _adminCatControls(canEdit, catId, catIdx, cats.length) +
      '</div>';

    // — Flashcards — (u draft-modu prikaži i prazan mod: subhead + „Dodaj")
    if (fcs.length || canEdit) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.flashcards', 'Flashcards') +
        ' <span class="admin-count">' + fcs.length + '</span></h4>';
      if (fcs.length) {
        html += '<ol class="admin-card-list">';
        fcs.forEach(function (fc, i) {
          total++;
          html +=
            '<li class="admin-card">' +
            '  <div class="admin-card-body">' +
            '    <div class="admin-card-q">' + _adminEscape(fc.question || '') + '</div>' +
            '    <div class="admin-card-a">' + _adminEscape(fc.answer || '') + '</div>' +
            '  </div>' +
            _adminItemControls(canEdit, 'flashcard', catId, i, fcs.length) +
            '</li>';
        });
        html += '</ol>';
      }
      html += _adminAddBtn(canEdit, 'flashcard', catId, _adminT('admin.addCardBtn', 'Add flashcard'));
    }

    // — Quiz (F4.4) — (u draft-modu prikaži i prazan mod)
    if (quiz.length || canEdit) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.quiz', 'Quiz') +
        ' <span class="admin-count">' + quiz.length + '</span></h4>';
      if (quiz.length) {
        html += '<ol class="admin-card-list">';
        quiz.forEach(function (qz, i) {
          total++;
          const opts = Array.isArray(qz.options) ? qz.options : [];
          let optsHtml = '<ul class="admin-quiz-opts">';
          opts.forEach(function (opt, oi) {
            const isCorrect = (oi === qz.correct);
            optsHtml += '<li' + (isCorrect ? ' class="is-correct"' : '') + '>' +
              (isCorrect ? '<i class="fas fa-check"></i> ' : '') + _adminEscape(opt) + '</li>';
          });
          optsHtml += '</ul>';
          html +=
            '<li class="admin-card">' +
            '  <div class="admin-card-body">' +
            '    <div class="admin-card-q">' + _adminEscape(qz.question || '') + '</div>' +
            '    ' + optsHtml +
            '  </div>' +
            _adminItemControls(canEdit, 'quiz', catId, i, quiz.length) +
            '</li>';
        });
        html += '</ol>';
      }
      html += _adminAddBtn(canEdit, 'quiz', catId, _adminT('admin.addQuizBtn', 'Add quiz question'));
    }

    // — Fill in the blank (F4.4) — (u draft-modu prikaži i prazan mod)
    if (fills.length || canEdit) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.fill', 'Fill blanks') +
        ' <span class="admin-count">' + fills.length + '</span></h4>';
      if (fills.length) {
        html += '<ol class="admin-card-list">';
        fills.forEach(function (fb, i) {
          total++;
          html +=
            '<li class="admin-card">' +
            '  <div class="admin-card-body">' +
            '    <div class="admin-card-q">' + _adminEscape(fb.sentence || '') + '</div>' +
            '    <div class="admin-card-a">' + _adminEscape(fb.answer || '') + '</div>' +
            '  </div>' +
            _adminItemControls(canEdit, 'fill', catId, i, fills.length) +
            '</li>';
        });
        html += '</ol>';
      }
      html += _adminAddBtn(canEdit, 'fill', catId, _adminT('admin.addFillBtn', 'Add fill-in-the-blank'));
    }

    // — Learn (F4.4) — jedan objekt po kategoriji (ne niz) —
    if (hasLearn) {
      total++;
      const L = cat.learn;
      html += '<h4 class="admin-subhead">' + _adminT('admin.learn', 'Learn') + '</h4>' +
        '<ol class="admin-card-list"><li class="admin-card admin-card--learn">' +
        '  <div class="admin-card-body">' +
        (L.title ? '    <div class="admin-card-q">' + _adminEscape(L.title) + '</div>' : '') +
        '    <div class="admin-card-a">' + _adminEscape(_adminExcerpt(L.content, 220)) + '</div>' +
        '  </div>' +
        _adminEditBtn(canEdit, 'learn', catId, 0) +
        '</li></ol>';
    }

    html += '</div>';
  });

  // U6d: „Dodaj kategoriju" (samo draft-mod). U praznoj lekciji je jedini sadržaj htmla → i tada se prikaže.
  html += _adminCatAddBtn(canEdit, _adminT('admin.addCategoryBtn', 'Add category'));

  holder.innerHTML = (total || (canEdit && html))
    ? html
    : '<p class="profile-meta">' + _adminT('admin.noContent', 'No flashcards or quiz in this lesson.') + '</p>';
}

window.renderAdminPage = renderAdminPage;

// ===== F4.3c-1 — Uredi JEDNU karticu: write JEDNOG reda + auto-verzija + live re-render =====
//
// Najtanji dokaz cijelog write-pipelinea. Piše SAMO red koji ovoj lekciji pripada
// (catalog.resolve[lessonId], npr. te2M1). ⚠ Final (…Final) je Object.assign KOPIJA M1+M2 →
// u ovoj cigli NAMJERNO ostaje nesinkroniziran; propagacija u sestrinske redove je F4.3c-2.
// Sve reverzibilno: RLS is_admin() dopušta write, a trigger snapshota STARI payload u
// content_versions PRIJE prepisa (F4.2) → undo + audit. Prava zaštita je RLS, ne UI.

/** Kontekst trenutno otvorene lekcije u vieweru (write ide u _adminCtx.varName). */
let _adminCtx = { subjectId: '', lessonId: '', varName: '', data: null };
/** Kartica koja se uređuje: { catId, idx }. */
let _editTarget = null;

/** lessonId → window-var (koji red u subject_content). */
function _adminResolveVar(subjectId, lessonId) {
  return (typeof SokratCatalog !== 'undefined' && typeof SokratCatalog.resolveDataVar === 'function')
    ? SokratCatalog.resolveDataVar(subjectId, lessonId) : null;
}

// ===== U3 — DRAFT-MOD (EDITOR_PLAN §4.1): uredi → radna kopija → Objavi/Odbaci =====
//
// „Uredi lekciju" povlači SVJEŽU bazu iz DB-a (payload + version) i otvara draft
// (SokratDraft.begin → original/working + autosave-restore iz localStoragea). Editori pišu
// OPOVE u working (bez mreže); „Objavi" (U4) šalje working + sibling-payloade s ISTIM opovima
// (final = kopija M1+M2) kroz publish_document RPC — atomično, uz base_version optimistic
// concurrency (tuđa izmjena = konflikt-toast, ništa nije upisano) i snapshot-trigger
// (undo/audit); „Odbaci" baca kopiju — baza i aplikacija nikad nisu ni dirnute. Edit-gumbi
// postoje SAMO u draft-modu (jedan write-put); autosave čuva draft preko refresha/crasha.

let _draftMode = false;

function _adminDraft() {
  return (window.SokratDraft && _adminCtx.subjectId)
    ? SokratDraft.get(_adminCtx.subjectId, _adminCtx.lessonId) : null;
}

/** Izvor za render/editore: working kopija u draft-modu, inače pročitani sadržaj. */
function _adminWorking() {
  const d = _adminDraft();
  return (_draftMode && d) ? d.working : _adminCtx.data;
}

function _adminRerender() {
  const holder = document.getElementById('adminCards');
  if (holder) _renderAdminCards(holder, _adminWorking());
  _renderEditBar();
}

/** Traka draft-moda: gumb za ulaz, odnosno indikator „uređuješ" + Objavi/Odbaci. */
function _renderEditBar() {
  const host = document.getElementById('adminEditBar');
  if (!host) return;
  const canEdit = !!(window.SokratAdmin && typeof SokratAdmin.isAdmin === 'function' && SokratAdmin.isAdmin());
  if (!canEdit || !_adminCtx.varName || !_adminCtx.data || !window.SokratDraft) { host.innerHTML = ''; return; }
  const d = _adminDraft();
  if (!_draftMode) {
    const resume = !!(d && d.dirty);
    host.innerHTML =
      '<div class="profile-card profile-card--wide admin-editbar">' +
      '  <button type="button" class="cta-button primary" id="adminDraftBtn"><i class="fas fa-pen"></i><span>' +
      (resume
        ? _adminT('admin.resumeEditing', 'Resume editing') + ' (' + d.ops.length + ')'
        : _adminT('admin.editLesson', 'Edit lesson')) +
      '</span></button>' +
      '</div>';
    return;
  }
  const n = d ? d.ops.length : 0;
  host.innerHTML =
    '<div class="profile-card profile-card--wide admin-editbar is-active">' +
    '  <span class="admin-editbar__status"><i class="fas fa-pen"></i> ' +
    _adminT('admin.draftOn', 'Editing draft — changes stay local until you publish.') +
    (n ? ' <strong class="admin-editbar__count">' + n + '</strong>' : '') + '</span>' +
    '  <span class="admin-editbar__actions">' +
    '    <button type="button" class="cta-button secondary" id="adminDiscardBtn">' + _adminT('admin.discard', 'Discard') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminPublishBtn"' + (n ? '' : ' disabled') + '>' +
    '      <i class="fas fa-upload"></i><span>' + _adminT('admin.publish', 'Publish') + '</span></button>' +
    '  </span>' +
    '</div>';
}

/** Ulaz u draft-mod: svježa autoritativna baza iz DB-a → SokratDraft.begin (uz autosave-restore). */
async function _enterDraftMode() {
  if (_draftMode) return;
  const s = _adminCtx.subjectId, l = _adminCtx.lessonId, v = _adminCtx.varName;
  if (!s || !v || !window.SokratDraft) return;
  if (SokratDraft.get(s, l)) { _draftMode = true; _adminRerender(); return; } // nastavak in-memory drafta

  const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
  const client = (auth && typeof auth.getClient === 'function') ? auth.getClient() : null;
  if (!client) return;
  try {
    // Baza drafta = svjež DB payload (ne JSON/js fallback — objava piše u DB, pa je DB istina za edit)
    // + version reda: publish-RPC (U4) njime lovi tuđu izmjenu između ulaska u draft i objave.
    const sel = await client.from('subject_content').select('payload,version')
      .eq('subject_id', s).eq('var_name', v).single();
    if (sel.error || !sel.data || !sel.data.payload) {
      if (typeof showToast === 'function') showToast(_adminT('admin.notInDb', 'This subject is not in the database yet.'));
      return;
    }
    const d = SokratDraft.begin(s, l, v, sel.data.payload, sel.data.version);
    _draftMode = true;
    if (d.restored && typeof showToast === 'function') showToast(_adminT('admin.draftRestored', 'Unsaved draft restored.'));
    _adminRerender();
  } catch (e) {
    if (typeof showToast === 'function') showToast(_adminT('admin.loadFail', 'Could not load content.'));
  }
}

/** „Objavi" (U4): working + sibling-payloadi → publish_document RPC — atomično + base_version. */
async function _publishDraft() {
  const d = _adminDraft();
  if (!_draftMode || !d || !d.dirty) return;
  const btn = document.getElementById('adminPublishBtn');
  const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
  const client = (auth && typeof auth.getClient === 'function') ? auth.getClient() : null;
  if (!client) return;
  if (btn) btn.disabled = true;
  try {
    // 1) Sestrinski redovi (final = kopija M1+M2 dijeli kategorije): SVJEŽ payload + version,
    //    pa isti opovi. Svježina je bitna — tuđa izmjena siblinga od ulaska u draft se ne gazi
    //    (opovi idu na aktualno stanje), a race do samog upisa lovi base_version u RPC-u.
    const ops = d.ops.slice();
    const writes = [{ var_name: d.varName, payload: d.working, base_version: d.baseVersion }];
    const patchedVars = [];
    const sel = await client.from('subject_content').select('var_name,payload,version')
      .eq('subject_id', d.subjectId).neq('var_name', d.varName);
    if (sel.error) {
      if (typeof showToast === 'function') showToast(_adminT('admin.publishErr', 'Publish failed.') + ' (' + sel.error.message + ')');
      if (btn) btn.disabled = false;
      return;
    }
    for (const row of (sel.data || [])) {
      const r = SokratDraft.applyOpsTo(row.payload, ops);
      if (!r.applied) continue; // red ne dijeli ove kategorije (npr. examPractice-only)
      writes.push({ var_name: row.var_name, payload: row.payload, base_version: row.version });
      patchedVars.push(row.var_name);
    }

    // 2) JEDINA točka pisanja: publish_document (is_admin + base_version + validacija + svi redovi
    //    u JEDNOJ transakciji — konflikt/greška = ništa nije upisano; snapshot-trigger čuva undo/audit).
    const rpc = await client.rpc('publish_document', { p_subject_id: d.subjectId, p_writes: writes });
    if (rpc.error) {
      const conflict = /publish_version_conflict/.test(rpc.error.message || '');
      if (typeof showToast === 'function') {
        showToast(conflict
          ? _adminT('admin.publishConflict', 'This lesson was changed elsewhere in the meantime — reopen it and repeat the edit.')
          : _adminT('admin.publishErr', 'Publish failed.') + ' (' + rpc.error.message + ')');
      }
      if (btn) btn.disabled = false;
      return;
    }

    // 3) In-memory sync bez reloada (study/viewer čitaju iste reference; update-opovi su idempotentni).
    if (typeof window !== 'undefined' && window[d.varName]) SokratDraft.applyOpsTo(window[d.varName], ops);
    if (_adminCtx.data) SokratDraft.applyOpsTo(_adminCtx.data, ops);
    patchedVars.forEach(function (sv) {
      if (typeof window !== 'undefined' && window[sv]) SokratDraft.applyOpsTo(window[sv], ops);
    });

    // 4) Re-baseline drafta (nova verzija iz RPC-a = baza za idući publish) + izlaz iz draft-moda.
    const newVersion = (rpc.data && rpc.data[d.varName] != null) ? rpc.data[d.varName] : null;
    SokratDraft.commitDone(d.subjectId, d.lessonId, newVersion);
    _draftMode = false;
    if (typeof showToast === 'function') showToast(_adminT('admin.publishOk', 'Published.'));
    _adminRerender();
  } catch (e) {
    if (typeof showToast === 'function') showToast(_adminT('admin.publishErr', 'Publish failed.'));
    if (btn) btn.disabled = false;
  }
}

/** „Odbaci": potvrdi ako ima promjena → baci draft (baza/aplikacija nisu ni dirnute). */
async function _discardDraft() {
  const d = _adminDraft();
  if (d && d.dirty && typeof window.askConfirm === 'function') {
    const ok = await window.askConfirm({
      title: _adminT('admin.discardTitle', 'Discard changes?'),
      message: _adminT('admin.discardMsg', 'All unpublished changes to this lesson will be lost.'),
      confirmText: _adminT('admin.discard', 'Discard'),
      danger: true
    });
    if (!ok) return;
  }
  if (window.SokratDraft) SokratDraft.discard(_adminCtx.subjectId, _adminCtx.lessonId);
  _draftMode = false;
  _adminRerender();
}

// Upozorenje pri zatvaranju taba s nespremljenim promjenama (autosave ionako čuva draft).
window.addEventListener('beforeunload', function (e) {
  if (_draftMode && window.SokratDraft && _adminCtx.subjectId &&
      SokratDraft.isDirty(_adminCtx.subjectId, _adminCtx.lessonId)) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Delegat za traku draft-moda.
document.addEventListener('click', function (e) {
  if (e.target.closest('#adminDraftBtn')) { _enterDraftMode(); return; }
  if (e.target.closest('#adminPublishBtn')) { _publishDraft(); return; }
  if (e.target.closest('#adminDiscardBtn')) { _discardDraft(); }
});

/** Kreiraj (jednom) edit-modal singleton na <sokrat-modal> primitivu. */
function _ensureEditModal() {
  let m = document.getElementById('adminEditModal');
  if (m) return m;
  m = document.createElement('sokrat-modal');
  m.id = 'adminEditModal';
  m.className = 'admin-edit';
  m.setAttribute('aria-labelledby', 'adminEditTitle');
  m.innerHTML =
    '<div class="admin-edit__card">' +
    '  <button type="button" class="admin-edit__close" data-admin-edit-close aria-label="Close">&times;</button>' +
    '  <h3 id="adminEditTitle" class="admin-edit__title"><i class="fas fa-pen"></i> ' + _adminT('admin.editCard', 'Edit flashcard') + '</h3>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.question', 'Question') + '</span>' +
    '    <textarea id="adminEditQ" class="admin-edit__input" rows="3"></textarea></label>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.answer', 'Answer') + '</span>' +
    '    <textarea id="adminEditA" class="admin-edit__input" rows="4"></textarea></label>' +
    '  <p class="admin-edit__note" id="adminEditNote"></p>' +
    '  <p class="admin-edit__status" id="adminEditStatus" hidden></p>' +
    '  <div class="admin-edit__actions">' +
    '    <button type="button" class="cta-button secondary" data-admin-edit-close>' + _adminT('common.cancel', 'Cancel') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminEditSave"><i class="fas fa-check"></i><span>' + _adminT('admin.save', 'Save') + '</span></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-edit-close]')) _closeEditor();
  });
  const saveBtn = document.getElementById('adminEditSave');
  if (saveBtn) saveBtn.addEventListener('click', _saveCard);
  return m;
}

function _editStatus(msg, isErr) {
  const el = document.getElementById('adminEditStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.hidden = !msg;
  el.classList.toggle('is-error', !!isErr);
}

function _closeEditor() {
  const m = document.getElementById('adminEditModal');
  if (m && typeof m.close === 'function') m.close();
}

/** Otvori editor za karticu. idx === null → ADD mod (nova kartica; U6c), inače uređivanje postojeće. */
function _openCardEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  if (!cat) return;
  const isAdd = (idx == null);
  const fc = isAdd ? { question: '', answer: '' } : (Array.isArray(cat.flashcards) ? cat.flashcards[idx] : null);
  if (!fc) return;
  _editTarget = { catId: catId, idx: idx, add: isAdd };
  _ensureEditModal();
  const titleEl = document.getElementById('adminEditTitle');
  if (titleEl) {
    titleEl.innerHTML = '<i class="fas fa-' + (isAdd ? 'plus' : 'pen') + '"></i> ' +
      (isAdd ? _adminT('admin.addCard', 'Add flashcard') : _adminT('admin.editCard', 'Edit flashcard'));
  }
  document.getElementById('adminEditQ').value = fc.question || '';
  document.getElementById('adminEditA').value = fc.answer || '';
  const note = document.getElementById('adminEditNote');
  if (note) {
    note.textContent = (cat.name || catId) + ' · ' + _adminCtx.varName + ' — ' +
      _adminT('admin.draftNote', 'edits the draft — publish to save (final syncs on publish).');
  }
  _editStatus('', false);
  const m = document.getElementById('adminEditModal');
  if (m && typeof m.open === 'function') m.open();
}

// (U3) Stari per-item RMW put (_patchObj/_patchInMemory/_propagateToSiblings) je uklonjen —
// jedini write-put je draft → „Objavi" (_publishDraft; od U4 kroz publish_document RPC).

/** Spremi uređenu karticu U DRAFT (op nad working kopijom; baza se dira tek na „Objavi" — U3). */
function _saveCard() {
  const qEl = document.getElementById('adminEditQ');
  const aEl = document.getElementById('adminEditA');
  if (!qEl || !aEl || !_editTarget) return;

  const q = qEl.value.trim();
  const a = aEl.value.trim();
  if (!q || !a) { _editStatus(_adminT('admin.emptyErr', 'Question and answer must not be empty.'), true); return; }

  const d = _adminDraft();
  const catId = _editTarget.catId;

  let res;
  if (_editTarget.add) {
    // U6c: nova kartica → addCard (item dobiva svjež stabilni id u draft-sloju; idempotentno).
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'addCard', catId: catId, item: { question: q, answer: a }
    });
  } else {
    const idx = _editTarget.idx;
    const w = (_draftMode && d) ? d.working : null;
    const item = (w && w[catId] && Array.isArray(w[catId].flashcards)) ? w[catId].flashcards[idx] : null;
    if (!item) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }
    // Op se adresira stabilnim id-om (U2a) s idx fallbackom (DB payloadi pre-U2a nemaju id-jeve).
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'updateCard', catId: catId, id: item.id, idx: idx,
      patch: { question: q, answer: a }
    });
  }
  if (!res.ok) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
}

// ===== U6d — Kategorije-UI: dodaj / uredi kategoriju (meta name/icon/color) =====
//
// Kategorija = ključ dokumenta (stabilni ID). „Dodaj" generira svjež 6-char ključ (+ isti id-field)
// i šalje addCategory op (idempotentno po ključu); „Uredi" šalje updateCategory op (patcha SAMO
// name/icon/color — nizovi/ključ se NIKAD ne diraju odavde). Kao i svi editori: piše u DRAFT, baza
// se dira tek na „Objavi" (sibling final se sinka replayem istih opova).

/** Kategorija koja se uređuje: { catId, add }. U add-modu je catId svjež generirani ključ. */
let _catTarget = null;

/** Svjež 6-char ključ za novu kategoriju (isti alfabet kao draft-store _genId / U2a id-jevi). */
function _genCatKey() {
  const A = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += A.charAt((Math.random() * A.length) | 0);
  return s;
}

/** Normaliziraj boju u #rrggbb za <input type=color> (fallback = indigo default). */
function _adminHexColor(c) {
  return (typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c)) ? c : '#6366f1';
}

function _ensureCatModal() {
  let m = document.getElementById('adminCatModal');
  if (m) return m;
  m = document.createElement('sokrat-modal');
  m.id = 'adminCatModal';
  m.className = 'admin-edit';
  m.setAttribute('aria-labelledby', 'adminCatTitle');
  m.innerHTML =
    '<div class="admin-edit__card">' +
    '  <button type="button" class="admin-edit__close" data-admin-cat-close aria-label="Close">&times;</button>' +
    '  <h3 id="adminCatTitle" class="admin-edit__title"><i class="fas fa-pen"></i> ' + _adminT('admin.editCategory', 'Edit category') + '</h3>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.catName', 'Name') + '</span>' +
    '    <input type="text" id="adminCatName" class="admin-edit__input" /></label>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.catIcon', 'Icon (FontAwesome class)') + '</span>' +
    '    <input type="text" id="adminCatIcon" class="admin-edit__input" placeholder="fa-book" /></label>' +
    '  <label class="admin-edit__field admin-edit__field--color"><span>' + _adminT('admin.catColor', 'Color') + '</span>' +
    '    <input type="color" id="adminCatColor" class="admin-edit__color" value="#6366f1" /></label>' +
    '  <p class="admin-edit__note" id="adminCatNote"></p>' +
    '  <p class="admin-edit__status" id="adminCatStatus" hidden></p>' +
    '  <div class="admin-edit__actions">' +
    '    <button type="button" class="cta-button secondary" data-admin-cat-close>' + _adminT('common.cancel', 'Cancel') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminCatSave"><i class="fas fa-check"></i><span>' + _adminT('admin.save', 'Save') + '</span></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-cat-close]')) _closeCatEditor();
  });
  const saveBtn = document.getElementById('adminCatSave');
  if (saveBtn) saveBtn.addEventListener('click', _saveCat);
  return m;
}

function _catStatus(msg, isErr) {
  const el = document.getElementById('adminCatStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.hidden = !msg;
  el.classList.toggle('is-error', !!isErr);
}

function _closeCatEditor() {
  const m = document.getElementById('adminCatModal');
  if (m && typeof m.close === 'function') m.close();
}

/** Otvori editor kategorije. catId === null → ADD mod (svjež ključ), inače uredi postojeću. */
function _openCatEditor(catId) {
  const data = _adminWorking();
  if (!data || typeof data !== 'object') return;
  const isAdd = (catId == null);
  const cat = isAdd ? { name: '', icon: 'fa-book', color: '#6366f1' } : data[catId];
  if (!cat) return;
  _catTarget = { catId: isAdd ? _genCatKey() : catId, add: isAdd };
  _ensureCatModal();
  const titleEl = document.getElementById('adminCatTitle');
  if (titleEl) {
    titleEl.innerHTML = '<i class="fas fa-' + (isAdd ? 'folder-plus' : 'pen') + '"></i> ' +
      (isAdd ? _adminT('admin.addCategory', 'Add category') : _adminT('admin.editCategory', 'Edit category'));
  }
  document.getElementById('adminCatName').value = cat.name || '';
  document.getElementById('adminCatIcon').value = cat.icon || '';
  document.getElementById('adminCatColor').value = _adminHexColor(cat.color);
  const note = document.getElementById('adminCatNote');
  if (note) {
    note.textContent = _adminCtx.varName + ' — ' +
      _adminT('admin.draftNote', 'edits the draft — publish to save (final syncs on publish).');
  }
  _catStatus('', false);
  const m = document.getElementById('adminCatModal');
  if (m && typeof m.open === 'function') m.open();
}

/** Spremi kategoriju U DRAFT: add → addCategory (svjež ključ+id), edit → updateCategory (meta patch). */
function _saveCat() {
  const nameEl = document.getElementById('adminCatName');
  const iconEl = document.getElementById('adminCatIcon');
  const colorEl = document.getElementById('adminCatColor');
  if (!nameEl || !_catTarget) return;
  const name = nameEl.value.trim();
  const icon = (iconEl && iconEl.value.trim()) || 'fa-book';
  const color = _adminHexColor(colorEl && colorEl.value);
  if (!name) { _catStatus(_adminT('admin.catNameErr', 'Category name must not be empty.'), true); return; }

  const d = _adminDraft();
  if (!d) { _catStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }
  const key = _catTarget.catId;

  let res;
  if (_catTarget.add) {
    // Nova kategorija: ključ = id = svjež 6-char; prazni nizovi → svi „Dodaj" modovi odmah vidljivi.
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'addCategory', catId: key,
      category: { id: key, name: name, icon: icon, color: color, flashcards: [], quiz: [], fillBlanks: [] }
    });
  } else {
    // Patcha SAMO meta — nizovi/ključ se ne diraju (updateCategory to i sam brani whitelistom).
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'updateCategory', catId: key,
      patch: { name: name, icon: icon, color: color }
    });
  }
  if (!res.ok) { _catStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeCatEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
}

/** Presloži kategoriju za dir (-1 gore / +1 dolje): izračunaj novi red ključeva → reorderCategories op. */
function _moveCategory(catId, dir) {
  const d = _adminDraft();
  const data = _adminWorking();
  if (!d || !data || typeof data !== 'object') return;
  const keys = Object.keys(data);
  const i = keys.indexOf(catId);
  if (i < 0) return;
  const j = i + dir;
  if (j < 0 || j >= keys.length) return; // rub → no-op
  keys.splice(i, 1);
  keys.splice(j, 0, catId);
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, { type: 'reorderCategories', order: keys });
  if (res && res.ok) {
    if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
    _adminRerender();
  }
}

/** Obriši kategoriju iz DRAFTA (uz potvrdu; poništivo „Odbaci"-jem / content_versions). removeCategory op. */
async function _removeCategory(catId) {
  const d = _adminDraft();
  const data = _adminWorking();
  if (!d || !data || !data[catId]) return;
  if (typeof window.askConfirm === 'function') {
    const ok = await window.askConfirm({
      title: _adminT('admin.removeCatTitle', 'Remove category?'),
      message: _adminT('admin.removeCatMsg', 'This category and all its cards/quiz will be removed from the draft. You can restore it by discarding the draft.'),
      confirmText: _adminT('admin.remove', 'Remove'),
      danger: true
    });
    if (!ok) return;
  }
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, { type: 'removeCategory', catId: catId });
  if (res && res.ok) {
    if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
    _adminRerender();
  }
}

// ===== U6e-1 — Obriši STAVKU (kartica/kviz/fill) iz DRAFTA =====
//
// Uz potvrdu; poništivo „Odbaci"-jem drafta / content_versions. Op je adresiran stabilnim id-om
// (U2a; DB predmeti resyncani 2026-07-17) s idx fallbackom. Ops-sloj (U6a remove*) idempotentan →
// publish-put + sibling-replay netaknuti. Learn nema remove (jedan objekt/kat; miče se kroz kategoriju).
async function _removeItem(type, catId, idx) {
  const d = _adminDraft();
  const data = _adminWorking();
  if (!d || !data || !data[catId]) return;
  const MAP = {
    flashcard: { arr: 'flashcards', op: 'removeCard' },
    quiz:      { arr: 'quiz',       op: 'removeQuiz' },
    fill:      { arr: 'fillBlanks', op: 'removeFill' }
  };
  const m = MAP[type];
  if (!m) return;
  const arr = Array.isArray(data[catId][m.arr]) ? data[catId][m.arr] : null;
  const item = (arr && idx >= 0 && idx < arr.length) ? arr[idx] : null;
  if (!item) return;
  if (typeof window.askConfirm === 'function') {
    const ok = await window.askConfirm({
      title: _adminT('admin.removeItemTitle', 'Remove item?'),
      message: _adminT('admin.removeItemMsg', 'This item will be removed from the draft. You can restore it by discarding the draft.'),
      confirmText: _adminT('admin.remove', 'Remove'),
      danger: true
    });
    if (!ok) return;
  }
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, { type: m.op, catId: catId, id: item.id, idx: idx });
  if (res && res.ok) {
    if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
    _adminRerender();
  }
}

// ===== U6e-2 — Presloži STAVKU (kartica/kviz/fill) u DRAFTU (↑↓) =====
//
// reorder* op = apsolutni ciljni red ID-eva (op.order); ↑↓ pomak = swap idx↔idx±dir (isti splice-obrazac
// kao _moveCategory). Idempotentno (U6a _structReorder). Stavke imaju stabilne id-jeve (DB resyncan 07-17).
function _moveItem(type, catId, idx, dir) {
  const d = _adminDraft();
  const data = _adminWorking();
  if (!d || !data || !data[catId]) return;
  const MAP = {
    flashcard: { arr: 'flashcards', op: 'reorderCards' },
    quiz:      { arr: 'quiz',       op: 'reorderQuiz' },
    fill:      { arr: 'fillBlanks', op: 'reorderFill' }
  };
  const m = MAP[type];
  if (!m) return;
  const arr = Array.isArray(data[catId][m.arr]) ? data[catId][m.arr] : null;
  if (!arr) return;
  const j = idx + dir;
  if (idx < 0 || idx >= arr.length || j < 0 || j >= arr.length) return; // rub → no-op
  const order = arr.map(function (it) { return it && it.id; });
  const moved = order.splice(idx, 1)[0];
  order.splice(j, 0, moved);
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, { type: m.op, catId: catId, order: order });
  if (res && res.ok) {
    if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
    _adminRerender();
  }
}

// ===== F4.4 — Uredi QUIZ pitanje: pitanje + dinamičke opcije (2–6) + točan odgovor =====
//
// Isti pipeline kao flashcards (RMW jednog reda → verzija → propagacija u sestrinske redove →
// live re-render), ali s dinamičkim opcijama i validacijom `correct` indeksa. `image`/`imageAlt`
// ostaju netaknuti (mijenjamo samo question/options/correct na postojećem objektu).

/** Quiz koji se uređuje: { catId, idx }. */
let _quizTarget = null;

/** Kreiraj (jednom) quiz-editor singleton na <sokrat-modal> primitivu. */
function _ensureQuizModal() {
  let m = document.getElementById('adminQuizModal');
  if (m) return m;
  m = document.createElement('sokrat-modal');
  m.id = 'adminQuizModal';
  m.className = 'admin-edit';
  m.setAttribute('aria-labelledby', 'adminQuizTitle');
  m.innerHTML =
    '<div class="admin-edit__card">' +
    '  <button type="button" class="admin-edit__close" data-admin-quiz-close aria-label="Close">&times;</button>' +
    '  <h3 id="adminQuizTitle" class="admin-edit__title"><i class="fas fa-pen"></i> ' + _adminT('admin.editQuiz', 'Edit quiz question') + '</h3>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.question', 'Question') + '</span>' +
    '    <textarea id="adminQuizQ" class="admin-edit__input" rows="3"></textarea></label>' +
    '  <div class="admin-edit__field">' +
    '    <span>' + _adminT('admin.options', 'Options (pick the correct one)') + '</span>' +
    '    <div id="adminQuizOpts" class="admin-quiz-editopts"></div>' +
    '    <button type="button" class="admin-quiz-addopt" id="adminQuizAddOpt"><i class="fas fa-plus"></i> ' + _adminT('admin.addOption', 'Add option') + '</button>' +
    '  </div>' +
    '  <p class="admin-edit__note" id="adminQuizNote"></p>' +
    '  <p class="admin-edit__status" id="adminQuizStatus" hidden></p>' +
    '  <div class="admin-edit__actions">' +
    '    <button type="button" class="cta-button secondary" data-admin-quiz-close>' + _adminT('common.cancel', 'Cancel') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminQuizSave"><i class="fas fa-check"></i><span>' + _adminT('admin.save', 'Save') + '</span></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-quiz-close]')) { _closeQuizEditor(); return; }
    if (e.target.closest('#adminQuizAddOpt')) { _quizAddOption(); return; }
    const del = e.target.closest('[data-opt-del]');
    if (del) { _quizDeleteOption(del); return; }
  });
  const saveBtn = document.getElementById('adminQuizSave');
  if (saveBtn) saveBtn.addEventListener('click', _saveQuiz);
  return m;
}

function _quizStatus(msg, isErr) {
  const el = document.getElementById('adminQuizStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.hidden = !msg;
  el.classList.toggle('is-error', !!isErr);
}

function _closeQuizEditor() {
  const m = document.getElementById('adminQuizModal');
  if (m && typeof m.close === 'function') m.close();
}

/** Pročitaj trenutne opcije + odabrani correct iz DOM-a (izvor istine dok je modal otvoren). */
function _readQuizOptsFromDom() {
  const rows = document.querySelectorAll('#adminQuizOpts .admin-quiz-optrow');
  const options = [];
  let correct = 0;
  rows.forEach(function (row, i) {
    const inp = row.querySelector('.admin-quiz-optinput');
    options.push(inp ? inp.value : '');
    const radio = row.querySelector('input[type=radio]');
    if (radio && radio.checked) correct = i;
  });
  return { options: options, correct: correct };
}

/** (Pre)crtaj redove opcija iz danog niza (svaki = radio „točan" + tekst + brisanje). */
function _renderQuizOptRows(options, correct) {
  const host = document.getElementById('adminQuizOpts');
  if (!host) return;
  let html = '';
  options.forEach(function (opt, i) {
    html +=
      '<div class="admin-quiz-optrow" data-opt-idx="' + i + '">' +
      '  <input type="radio" name="adminQuizCorrect" value="' + i + '"' + (i === correct ? ' checked' : '') +
      '    aria-label="' + _adminT('admin.correct', 'Correct') + '">' +
      '  <input type="text" class="admin-quiz-optinput" value="' + _adminEscape(opt) + '">' +
      '  <button type="button" class="admin-quiz-delopt" data-opt-del aria-label="' + _adminT('admin.removeOption', 'Remove option') + '"><i class="fas fa-times"></i></button>' +
      '</div>';
  });
  host.innerHTML = html;
}

/** Dodaj praznu opciju (max 6). Čuva postojeće vrijednosti (čita iz DOM-a prije re-crtanja). */
function _quizAddOption() {
  const cur = _readQuizOptsFromDom();
  if (cur.options.length >= 6) { _quizStatus(_adminT('admin.quizCountErr', 'A question needs 2–6 options.'), true); return; }
  cur.options.push('');
  _renderQuizOptRows(cur.options, cur.correct);
  _quizStatus('', false);
}

/** Obriši jednu opciju (min 2); pomakni `correct` ako treba. */
function _quizDeleteOption(delBtn) {
  const row = delBtn.closest('.admin-quiz-optrow');
  if (!row || !row.parentNode) return;
  const cur = _readQuizOptsFromDom();
  if (cur.options.length <= 2) { _quizStatus(_adminT('admin.quizCountErr', 'A question needs 2–6 options.'), true); return; }
  const delIdx = Array.prototype.indexOf.call(row.parentNode.children, row);
  cur.options.splice(delIdx, 1);
  let correct = cur.correct;
  if (delIdx === cur.correct) correct = 0;           // obrisan točan → prvi preostali
  else if (delIdx < cur.correct) correct = cur.correct - 1; // pomak indeksa
  _renderQuizOptRows(cur.options, correct);
  _quizStatus('', false);
}

/** Otvori quiz-editor. idx === null → ADD mod (novo pitanje s 2 prazne opcije), inače uređivanje. */
function _openQuizEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  if (!cat) return;
  const isAdd = (idx == null);
  const qz = isAdd ? { question: '', options: ['', ''], correct: 0 } : (Array.isArray(cat.quiz) ? cat.quiz[idx] : null);
  if (!qz) return;
  _quizTarget = { catId: catId, idx: idx, add: isAdd };
  _ensureQuizModal();
  const titleEl = document.getElementById('adminQuizTitle');
  if (titleEl) {
    titleEl.innerHTML = '<i class="fas fa-' + (isAdd ? 'plus' : 'pen') + '"></i> ' +
      (isAdd ? _adminT('admin.addQuiz', 'Add quiz question') : _adminT('admin.editQuiz', 'Edit quiz question'));
  }
  document.getElementById('adminQuizQ').value = qz.question || '';
  const options = Array.isArray(qz.options) ? qz.options.slice() : [];
  const correct = (typeof qz.correct === 'number' && qz.correct >= 0 && qz.correct < options.length) ? qz.correct : 0;
  _renderQuizOptRows(options, correct);
  const note = document.getElementById('adminQuizNote');
  if (note) {
    note.textContent = (cat.name || catId) + ' · ' + _adminCtx.varName + ' — ' +
      _adminT('admin.draftNote', 'edits the draft — publish to save (final syncs on publish).');
  }
  _quizStatus('', false);
  const m = document.getElementById('adminQuizModal');
  if (m && typeof m.open === 'function') m.open();
}

/** Spremi uređeno quiz pitanje U DRAFT: validacija → op nad working kopijom (U3). */
function _saveQuiz() {
  const qEl = document.getElementById('adminQuizQ');
  if (!qEl || !_quizTarget) return;

  const q = qEl.value.trim();
  const cur = _readQuizOptsFromDom();
  const options = cur.options.map(function (s) { return String(s).trim(); });
  const correct = cur.correct;

  // Validacija (odražava JSON Schemu: 2–6 nepraznih opcija, question neprazan, correct valjan indeks).
  if (!q) { _quizStatus(_adminT('admin.quizEmptyErr', 'Question and all options must not be empty.'), true); return; }
  if (options.length < 2 || options.length > 6) { _quizStatus(_adminT('admin.quizCountErr', 'A question needs 2–6 options.'), true); return; }
  if (options.some(function (s) { return !s; })) { _quizStatus(_adminT('admin.quizEmptyErr', 'Question and all options must not be empty.'), true); return; }
  if (correct < 0 || correct >= options.length) { _quizStatus(_adminT('admin.quizCorrectErr', 'Pick which option is correct.'), true); return; }

  const d = _adminDraft();
  const catId = _quizTarget.catId;

  let res;
  if (_quizTarget.add) {
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'addQuiz', catId: catId, item: { question: q, options: options.slice(), correct: correct }
    });
  } else {
    const idx = _quizTarget.idx;
    const w = (_draftMode && d) ? d.working : null;
    const item = (w && w[catId] && Array.isArray(w[catId].quiz)) ? w[catId].quiz[idx] : null;
    if (!item) { _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }
    // Patch mijenja samo question/options/correct → image/imageAlt (ako postoje) ostaju netaknuti.
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'updateQuiz', catId: catId, id: item.id, idx: idx,
      patch: { question: q, options: options.slice(), correct: correct }
    });
  }
  if (!res.ok) { _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeQuizEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
}

// ===== F4.4 — Uredi FILL-IN-THE-BLANK: rečenica (s _______) + odgovor =====
//
// Najjednostavniji tip (sentence + answer). Isti pipeline (RMW → verzija → propagacija → live).
// Validacija: rečenica neprazna I sadrži prazninu `_______` (7 podvlaka, JSON Schema pattern);
// odgovor neprazan. `hint` (ako postoji) ostaje netaknut (mijenja se samo sentence/answer).

const _FILL_BLANK = '_______'; // 7 podvlaka — mora se poklapati sa schemom (fillBlank.sentence.pattern)

/** Fill koji se uređuje: { catId, idx }. */
let _fillTarget = null;

function _ensureFillModal() {
  let m = document.getElementById('adminFillModal');
  if (m) return m;
  m = document.createElement('sokrat-modal');
  m.id = 'adminFillModal';
  m.className = 'admin-edit';
  m.setAttribute('aria-labelledby', 'adminFillTitle');
  m.innerHTML =
    '<div class="admin-edit__card">' +
    '  <button type="button" class="admin-edit__close" data-admin-fill-close aria-label="Close">&times;</button>' +
    '  <h3 id="adminFillTitle" class="admin-edit__title"><i class="fas fa-pen"></i> ' + _adminT('admin.editFill', 'Edit fill-in-the-blank') + '</h3>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.sentence', 'Sentence (use _______ for the blank)') + '</span>' +
    '    <textarea id="adminFillS" class="admin-edit__input" rows="3"></textarea></label>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.answer', 'Answer') + '</span>' +
    '    <textarea id="adminFillA" class="admin-edit__input" rows="2"></textarea></label>' +
    '  <p class="admin-edit__note" id="adminFillNote"></p>' +
    '  <p class="admin-edit__status" id="adminFillStatus" hidden></p>' +
    '  <div class="admin-edit__actions">' +
    '    <button type="button" class="cta-button secondary" data-admin-fill-close>' + _adminT('common.cancel', 'Cancel') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminFillSave"><i class="fas fa-check"></i><span>' + _adminT('admin.save', 'Save') + '</span></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-fill-close]')) _closeFillEditor();
  });
  const saveBtn = document.getElementById('adminFillSave');
  if (saveBtn) saveBtn.addEventListener('click', _saveFill);
  return m;
}

function _fillStatus(msg, isErr) {
  const el = document.getElementById('adminFillStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.hidden = !msg;
  el.classList.toggle('is-error', !!isErr);
}

function _closeFillEditor() {
  const m = document.getElementById('adminFillModal');
  if (m && typeof m.close === 'function') m.close();
}

/** Otvori fill-editor. idx === null → ADD mod (nova rečenica), inače uređivanje postojeće. */
function _openFillEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  if (!cat) return;
  const isAdd = (idx == null);
  const fb = isAdd ? { sentence: '', answer: '' } : (Array.isArray(cat.fillBlanks) ? cat.fillBlanks[idx] : null);
  if (!fb) return;
  _fillTarget = { catId: catId, idx: idx, add: isAdd };
  _ensureFillModal();
  const titleEl = document.getElementById('adminFillTitle');
  if (titleEl) {
    titleEl.innerHTML = '<i class="fas fa-' + (isAdd ? 'plus' : 'pen') + '"></i> ' +
      (isAdd ? _adminT('admin.addFill', 'Add fill-in-the-blank') : _adminT('admin.editFill', 'Edit fill-in-the-blank'));
  }
  document.getElementById('adminFillS').value = fb.sentence || '';
  document.getElementById('adminFillA').value = fb.answer || '';
  const note = document.getElementById('adminFillNote');
  if (note) {
    note.textContent = (cat.name || catId) + ' · ' + _adminCtx.varName + ' — ' +
      _adminT('admin.draftNote', 'edits the draft — publish to save (final syncs on publish).');
  }
  _fillStatus('', false);
  const m = document.getElementById('adminFillModal');
  if (m && typeof m.open === 'function') m.open();
}

/** Spremi uređeni fill U DRAFT: validacija → op nad working kopijom (U3). */
function _saveFill() {
  const sEl = document.getElementById('adminFillS');
  const aEl = document.getElementById('adminFillA');
  if (!sEl || !aEl || !_fillTarget) return;

  const sentence = sEl.value.trim();
  const answer = aEl.value.trim();

  // Validacija (odražava JSON Schemu: rečenica neprazna + sadrži prazninu; odgovor neprazan).
  if (!sentence || !answer) { _fillStatus(_adminT('admin.fillEmptyErr', 'Sentence and answer must not be empty.'), true); return; }
  if (sentence.indexOf(_FILL_BLANK) === -1) { _fillStatus(_adminT('admin.fillBlankErr', 'The sentence must contain the blank (_______).'), true); return; }

  const d = _adminDraft();
  const catId = _fillTarget.catId;

  let res;
  if (_fillTarget.add) {
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'addFill', catId: catId, item: { sentence: sentence, answer: answer }
    });
  } else {
    const idx = _fillTarget.idx;
    const w = (_draftMode && d) ? d.working : null;
    const item = (w && w[catId] && Array.isArray(w[catId].fillBlanks)) ? w[catId].fillBlanks[idx] : null;
    if (!item) { _fillStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }
    // Patch mijenja samo sentence/answer → hint (ako postoji) ostaje netaknut.
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'updateFill', catId: catId, id: item.id, idx: idx,
      patch: { sentence: sentence, answer: answer }
    });
  }
  if (!res.ok) { _fillStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeFillEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
}

// ===== F4.4 — Uredi LEARN: naslov + HTML sadržaj (jedan objekt po kategoriji) =====
//
// Learn je JEDAN objekt `cat.learn = {title?, content, image?}` (ne niz) → vlastiti object-put
// (nema idx). Sadržaj je sirovi HTML (+ moguć KaTeX `\( \)`/`\[ \]`/`$$ $$`) — uređuje se kao
// tekst u textarei, sprema se doslovno (bez render/sanitize, kao u izvornim datotekama).
// Validacija: content neprazan (title/image opcionalni po schemi). `image` ostaje netaknut.

/** Learn koji se uređuje: { catId }. */
let _learnTarget = null;

// (U3) Stari learn RMW/propagate put je uklonjen — learn ide kroz draft kao i ostali tipovi.

function _ensureLearnModal() {
  let m = document.getElementById('adminLearnModal');
  if (m) return m;
  m = document.createElement('sokrat-modal');
  m.id = 'adminLearnModal';
  m.className = 'admin-edit admin-learn';
  m.setAttribute('aria-labelledby', 'adminLearnTitle');
  m.innerHTML =
    '<div class="admin-edit__card">' +
    '  <button type="button" class="admin-edit__close" data-admin-learn-close aria-label="Close">&times;</button>' +
    '  <h3 id="adminLearnTitle" class="admin-edit__title"><i class="fas fa-pen"></i> ' + _adminT('admin.editLearn', 'Edit learn content') + '</h3>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.learnTitle', 'Title (optional)') + '</span>' +
    '    <input type="text" id="adminLearnT" class="admin-edit__input"></label>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.learnContent', 'Content (HTML)') + '</span>' +
    '    <textarea id="adminLearnC" class="admin-edit__input admin-learn__content" rows="14"></textarea></label>' +
    '  <p class="admin-edit__note" id="adminLearnNote"></p>' +
    '  <p class="admin-edit__status" id="adminLearnStatus" hidden></p>' +
    '  <div class="admin-edit__actions">' +
    '    <button type="button" class="cta-button secondary" data-admin-learn-close>' + _adminT('common.cancel', 'Cancel') + '</button>' +
    '    <button type="button" class="cta-button primary" id="adminLearnSave"><i class="fas fa-check"></i><span>' + _adminT('admin.save', 'Save') + '</span></button>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-admin-learn-close]')) _closeLearnEditor();
  });
  const saveBtn = document.getElementById('adminLearnSave');
  if (saveBtn) saveBtn.addEventListener('click', _saveLearn);
  return m;
}

function _learnStatus(msg, isErr) {
  const el = document.getElementById('adminLearnStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.hidden = !msg;
  el.classList.toggle('is-error', !!isErr);
}

function _closeLearnEditor() {
  const m = document.getElementById('adminLearnModal');
  if (m && typeof m.close === 'function') m.close();
}

/** Otvori learn-editor za kategoriju (learn = jedan objekt, bez idx). */
function _openLearnEditor(catId) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  const L = (cat && cat.learn && typeof cat.learn === 'object') ? cat.learn : null;
  if (!L) return;
  _learnTarget = { catId: catId };
  _ensureLearnModal();
  document.getElementById('adminLearnT').value = L.title || '';
  document.getElementById('adminLearnC').value = L.content || '';
  const note = document.getElementById('adminLearnNote');
  if (note) {
    note.textContent = (cat.name || catId) + ' · ' + _adminCtx.varName + ' — ' +
      _adminT('admin.draftNote', 'edits the draft — publish to save (final syncs on publish).');
  }
  _learnStatus('', false);
  const m = document.getElementById('adminLearnModal');
  if (m && typeof m.open === 'function') m.open();
}

/** Spremi uređeni learn U DRAFT: validacija → op nad working kopijom (U3). */
function _saveLearn() {
  const tEl = document.getElementById('adminLearnT');
  const cEl = document.getElementById('adminLearnC');
  if (!cEl || !_learnTarget) return;

  const title = tEl ? tEl.value.trim() : '';
  // Sadržaj NE trimamo — čuvamo formatiranje/uvlake HTML-a bit-točno (validiramo nepraznost preko .trim()).
  const content = cEl.value;
  if (!content.trim()) { _learnStatus(_adminT('admin.learnEmptyErr', 'Content must not be empty.'), true); return; }

  const d = _adminDraft();
  const catId = _learnTarget.catId;
  const w = (_draftMode && d) ? d.working : null;
  const target = (w && w[catId] && w[catId].learn && typeof w[catId].learn === 'object') ? w[catId].learn : null;
  if (!target) { _learnStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  // Patch mijenja content (+ title: prazan → null BRIŠE ključ, semantika F4.4). `image` ostaje netaknut.
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
    type: 'updateLearn', catId: catId,
    patch: { content: content, title: title || null }
  });
  if (!res.ok) { _learnStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeLearnEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
}

// Delegat: klik na edit-gumb stavke → otvori editor (grana po tipu).
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-admin-edit]');
  if (!btn) return;
  const type = btn.getAttribute('data-type') || 'flashcard';
  const catId = btn.getAttribute('data-cat');
  const idx = parseInt(btn.getAttribute('data-idx'), 10);
  if (!catId || isNaN(idx)) return;
  if (type === 'quiz') _openQuizEditor(catId, idx);
  else if (type === 'fill') _openFillEditor(catId, idx);
  else if (type === 'learn') _openLearnEditor(catId);
  else _openCardEditor(catId, idx);
});

// Delegat: klik na „Dodaj" gumb → otvori editor u ADD modu (U6c strukturne operacije).
document.addEventListener('click', function (e) {
  const add = e.target.closest('[data-admin-add]');
  if (!add) return;
  const type = add.getAttribute('data-type') || 'flashcard';
  const catId = add.getAttribute('data-cat');
  if (!catId) return;
  if (type === 'quiz') _openQuizEditor(catId, null);
  else if (type === 'fill') _openFillEditor(catId, null);
  else _openCardEditor(catId, null);
});

// Delegat: klik na „Obriši stavku" 🗑 (U6e-1) → potvrda → remove* op.
document.addEventListener('click', function (e) {
  const del = e.target.closest('[data-admin-del]');
  if (!del) return;
  const type = del.getAttribute('data-type') || 'flashcard';
  const catId = del.getAttribute('data-cat');
  const idx = parseInt(del.getAttribute('data-idx'), 10);
  if (!catId || isNaN(idx)) return;
  _removeItem(type, catId, idx);
});

// Delegat: klik na ↑↓ stavke (U6e-2) → presloži (reorder* op; disabled rub = no-op).
document.addEventListener('click', function (e) {
  const move = e.target.closest('[data-admin-move]');
  if (!move || move.disabled) return;
  const type = move.getAttribute('data-type') || 'flashcard';
  const catId = move.getAttribute('data-cat');
  const idx = parseInt(move.getAttribute('data-idx'), 10);
  if (!catId || isNaN(idx)) return;
  _moveItem(type, catId, idx, move.getAttribute('data-admin-move') === 'up' ? -1 : 1);
});

// Delegat: klik na kategorije-gumbe (U6d) → dodaj/uredi meta · presloži ↑↓ · obriši.
document.addEventListener('click', function (e) {
  if (e.target.closest('[data-admin-cat-add]')) { _openCatEditor(null); return; }
  const edit = e.target.closest('[data-admin-cat-edit]');
  if (edit) { _openCatEditor(edit.getAttribute('data-cat')); return; }
  const move = e.target.closest('[data-admin-cat-move]');
  if (move) {
    if (!move.disabled) _moveCategory(move.getAttribute('data-cat'), move.getAttribute('data-admin-cat-move') === 'up' ? -1 : 1);
    return;
  }
  const del = e.target.closest('[data-admin-cat-del]');
  if (del) { _removeCategory(del.getAttribute('data-cat')); return; }
});
