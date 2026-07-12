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

function _renderAdminCards(holder, data) {
  const cats = (data && typeof data === 'object') ? Object.keys(data) : [];
  // F4.3c-1: edit-gumbi samo adminu (RLS je prava zaštita; ovo je UX/defense-in-depth).
  // U3: i SAMO u draft-modu — jedini put do izmjene je draft → „Objavi" (EDITOR_PLAN §4.1).
  const canEdit = !!(window.SokratAdmin && typeof SokratAdmin.isAdmin === 'function' && SokratAdmin.isAdmin()) && _draftMode;
  let html = '';
  let total = 0;

  cats.forEach(function (catId) {
    const cat = data[catId];
    if (!cat || typeof cat !== 'object') return;
    const fcs = Array.isArray(cat.flashcards) ? cat.flashcards : [];
    const quiz = Array.isArray(cat.quiz) ? cat.quiz : [];
    const fills = Array.isArray(cat.fillBlanks) ? cat.fillBlanks : [];
    const hasLearn = !!(cat.learn && typeof cat.learn === 'object' && cat.learn.content);
    if (fcs.length === 0 && quiz.length === 0 && fills.length === 0 && !hasLearn) return;

    html +=
      '<div class="profile-card profile-card--wide admin-cat">' +
      '  <h3 class="profile-card-title"><i class="fas ' + _adminEscape(cat.icon || 'fa-book') + '"></i> ' +
      _adminEscape(cat.name || catId) + '</h3>';

    // — Flashcards —
    if (fcs.length) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.flashcards', 'Flashcards') +
        ' <span class="admin-count">' + fcs.length + '</span></h4><ol class="admin-card-list">';
      fcs.forEach(function (fc, i) {
        total++;
        html +=
          '<li class="admin-card">' +
          '  <div class="admin-card-body">' +
          '    <div class="admin-card-q">' + _adminEscape(fc.question || '') + '</div>' +
          '    <div class="admin-card-a">' + _adminEscape(fc.answer || '') + '</div>' +
          '  </div>' +
          _adminEditBtn(canEdit, 'flashcard', catId, i) +
          '</li>';
      });
      html += '</ol>';
    }

    // — Quiz (F4.4) —
    if (quiz.length) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.quiz', 'Quiz') +
        ' <span class="admin-count">' + quiz.length + '</span></h4><ol class="admin-card-list">';
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
          _adminEditBtn(canEdit, 'quiz', catId, i) +
          '</li>';
      });
      html += '</ol>';
    }

    // — Fill in the blank (F4.4) —
    if (fills.length) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.fill', 'Fill blanks') +
        ' <span class="admin-count">' + fills.length + '</span></h4><ol class="admin-card-list">';
      fills.forEach(function (fb, i) {
        total++;
        html +=
          '<li class="admin-card">' +
          '  <div class="admin-card-body">' +
          '    <div class="admin-card-q">' + _adminEscape(fb.sentence || '') + '</div>' +
          '    <div class="admin-card-a">' + _adminEscape(fb.answer || '') + '</div>' +
          '  </div>' +
          _adminEditBtn(canEdit, 'fill', catId, i) +
          '</li>';
      });
      html += '</ol>';
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

  holder.innerHTML = total
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
// „Uredi lekciju" povlači SVJEŽU bazu iz DB-a i otvara draft (SokratDraft.begin →
// original/working + autosave-restore iz localStoragea). Editori pišu OPOVE u working
// (bez mreže); „Objavi" upisuje working u primarni red (RLS + verzija-trigger = undo/audit)
// i sinka sestrinske redove primjenom ISTIH opova (final = kopija M1+M2); „Odbaci" baca
// kopiju — baza i aplikacija nikad nisu ni dirnute. Edit-gumbi postoje SAMO u draft-modu
// (jedan write-put). ⚠ base_version concurrency dolazi s U4 publish-RPC-om (jedini smo
// admin → prihvatljivo u U3); autosave čuva draft preko refresha/crasha.

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
    // Baza drafta = svjež DB payload (ne JSON/js fallback — objava piše u DB, pa je DB istina za edit).
    const sel = await client.from('subject_content').select('payload')
      .eq('subject_id', s).eq('var_name', v).single();
    if (sel.error || !sel.data || !sel.data.payload) {
      if (typeof showToast === 'function') showToast(_adminT('admin.notInDb', 'This subject is not in the database yet.'));
      return;
    }
    const d = SokratDraft.begin(s, l, v, sel.data.payload);
    _draftMode = true;
    if (d.restored && typeof showToast === 'function') showToast(_adminT('admin.draftRestored', 'Unsaved draft restored.'));
    _adminRerender();
  } catch (e) {
    if (typeof showToast === 'function') showToast(_adminT('admin.loadFail', 'Could not load content.'));
  }
}

/** „Objavi": working → primarni red (verzija-trigger) + isti opovi → sestrinski redovi + in-memory. */
async function _publishDraft() {
  const d = _adminDraft();
  if (!_draftMode || !d || !d.dirty) return;
  const btn = document.getElementById('adminPublishBtn');
  const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
  const client = (auth && typeof auth.getClient === 'function') ? auth.getClient() : null;
  if (!client) return;
  if (btn) btn.disabled = true;
  try {
    // 1) Primarni red = cijeli working blob (RLS is_admin; trigger snapshota STARO stanje → undo/audit).
    const upd = await client.from('subject_content').update({ payload: d.working })
      .eq('subject_id', d.subjectId).eq('var_name', d.varName);
    if (upd.error) {
      if (typeof showToast === 'function') showToast(_adminT('admin.publishErr', 'Publish failed.') + ' (' + upd.error.message + ')');
      if (btn) btn.disabled = false;
      return;
    }

    // 2) Sestrinski redovi: primijeni ISTE opove (final = kopija M1+M2 dijeli kategorije). Best-effort.
    const ops = d.ops.slice();
    const failed = [];
    const patchedVars = [];
    try {
      const sel = await client.from('subject_content').select('var_name,payload')
        .eq('subject_id', d.subjectId).neq('var_name', d.varName);
      if (!sel.error && Array.isArray(sel.data)) {
        for (const row of sel.data) {
          const r = SokratDraft.applyOpsTo(row.payload, ops);
          if (!r.applied) continue; // red ne dijeli ove kategorije (npr. examPractice-only)
          const su = await client.from('subject_content').update({ payload: row.payload })
            .eq('subject_id', d.subjectId).eq('var_name', row.var_name);
          if (su.error) failed.push(row.var_name); else patchedVars.push(row.var_name);
        }
      }
    } catch (e) { /* best-effort — primarni je već objavljen */ }

    // 3) In-memory sync bez reloada (study/viewer čitaju iste reference; update-opovi su idempotentni).
    if (typeof window !== 'undefined' && window[d.varName]) SokratDraft.applyOpsTo(window[d.varName], ops);
    if (_adminCtx.data) SokratDraft.applyOpsTo(_adminCtx.data, ops);
    patchedVars.forEach(function (sv) {
      if (typeof window !== 'undefined' && window[sv]) SokratDraft.applyOpsTo(window[sv], ops);
    });

    // 4) Re-baseline drafta + izlaz iz draft-moda.
    SokratDraft.commitDone(d.subjectId, d.lessonId);
    _draftMode = false;
    if (typeof showToast === 'function') {
      const okMsg = _adminT('admin.publishOk', 'Published.');
      showToast(failed.length ? (okMsg + ' ' + _adminT('admin.propWarn', '(final sync incomplete)')) : okMsg);
    }
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

/** Otvori editor za karticu (catId, idx) iz trenutnog konteksta. */
function _openCardEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  const fc = (cat && Array.isArray(cat.flashcards)) ? cat.flashcards[idx] : null;
  if (!fc) return;
  _editTarget = { catId: catId, idx: idx };
  _ensureEditModal();
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
// jedini write-put je sada draft → „Objavi" (_publishDraft: working blob + isti opovi na siblinge).

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
  const idx = _editTarget.idx;
  const w = (_draftMode && d) ? d.working : null;
  const item = (w && w[catId] && Array.isArray(w[catId].flashcards)) ? w[catId].flashcards[idx] : null;
  if (!item) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  // Op se adresira stabilnim id-om (U2a) s idx fallbackom (DB payloadi pre-U2a nemaju id-jeve).
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
    type: 'updateCard', catId: catId, id: item.id, idx: idx,
    patch: { question: q, answer: a }
  });
  if (!res.ok) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  _closeEditor();
  if (typeof showToast === 'function') showToast(_adminT('admin.draftSaved', 'Saved to draft.'));
  _adminRerender();
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

/** Otvori quiz-editor za (catId, idx) iz trenutnog konteksta. */
function _openQuizEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  const qz = (cat && Array.isArray(cat.quiz)) ? cat.quiz[idx] : null;
  if (!qz) return;
  _quizTarget = { catId: catId, idx: idx };
  _ensureQuizModal();
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
  const idx = _quizTarget.idx;
  const w = (_draftMode && d) ? d.working : null;
  const item = (w && w[catId] && Array.isArray(w[catId].quiz)) ? w[catId].quiz[idx] : null;
  if (!item) { _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  // Patch mijenja samo question/options/correct → image/imageAlt (ako postoje) ostaju netaknuti.
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
    type: 'updateQuiz', catId: catId, id: item.id, idx: idx,
    patch: { question: q, options: options.slice(), correct: correct }
  });
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

/** Otvori fill-editor za (catId, idx) iz trenutnog konteksta. */
function _openFillEditor(catId, idx) {
  const data = _adminWorking(); // U3: u draft-modu editor čita working kopiju (re-edit vidi draftane vrijednosti)
  const cat = data && data[catId];
  const fb = (cat && Array.isArray(cat.fillBlanks)) ? cat.fillBlanks[idx] : null;
  if (!fb) return;
  _fillTarget = { catId: catId, idx: idx };
  _ensureFillModal();
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
  const idx = _fillTarget.idx;
  const w = (_draftMode && d) ? d.working : null;
  const item = (w && w[catId] && Array.isArray(w[catId].fillBlanks)) ? w[catId].fillBlanks[idx] : null;
  if (!item) { _fillStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  // Patch mijenja samo sentence/answer → hint (ako postoji) ostaje netaknut.
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
    type: 'updateFill', catId: catId, id: item.id, idx: idx,
    patch: { sentence: sentence, answer: answer }
  });
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
