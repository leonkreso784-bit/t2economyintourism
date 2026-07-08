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
  if (!subjectId || !lessonId) { holder.innerHTML = ''; return; }

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
  _renderAdminCards(holder, data);
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
  const canEdit = !!(window.SokratAdmin && typeof SokratAdmin.isAdmin === 'function' && SokratAdmin.isAdmin());
  let html = '';
  let total = 0;

  cats.forEach(function (catId) {
    const cat = data[catId];
    if (!cat || typeof cat !== 'object') return;
    const fcs = Array.isArray(cat.flashcards) ? cat.flashcards : [];
    const quiz = Array.isArray(cat.quiz) ? cat.quiz : [];
    if (fcs.length === 0 && quiz.length === 0) return;

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
  const data = _adminCtx.data;
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
      _adminT('admin.finalNote', 'saves this lesson only (final not synced in this step).');
  }
  _editStatus('', false);
  const m = document.getElementById('adminEditModal');
  if (m && typeof m.open === 'function') m.open();
}

/**
 * Zakrpaj jedan objekt (payload/window-var) na (catId, arrayKey, idx) ako stavka postoji.
 * `applyItem(item)` mutira stavku na mjestu (isti obrazac za flashcards/quiz/fill/…).
 */
function _patchObj(obj, catId, arrayKey, idx, applyItem) {
  if (obj && obj[catId] && Array.isArray(obj[catId][arrayKey]) && obj[catId][arrayKey][idx]) {
    applyItem(obj[catId][arrayKey][idx]);
    return true;
  }
  return false;
}

/** Zakrpaj window-var (ako je učitan u memoriji) — study/viewer to čitaju. */
function _patchWindowVar(varName, catId, arrayKey, idx, applyItem) {
  if (typeof window !== 'undefined') _patchObj(window[varName], catId, arrayKey, idx, applyItem);
}

/** Zakrpaj in-memory objekt(e) da se promjena vidi bez reloada (isti ref koji study/viewer čitaju). */
function _patchInMemory(varName, catId, arrayKey, idx, applyItem) {
  _patchWindowVar(varName, catId, arrayKey, idx, applyItem); // study čita window[var]
  _patchObj(_adminCtx.data, catId, arrayKey, idx, applyItem); // viewer re-render izvor (isti ref za midterm)
}

/**
 * F4.3c-2: propagiraj istu izmjenu u SESTRINSKE redove predmeta koji dijele ovu kategoriju.
 * Zašto: `final` je `Object.assign(M1, M2, …)` KOPIJA → u bazi zaseban red (npr. `te2Final`) koji
 * duplicira midterm stavke. Bez ovoga bi edit midterma i finalni razišli. Kategorije su unikatne
 * po predmetu (nema kolizije M1/M2), a final je čista kopija → (catId, arrayKey, idx) je ista stavka svugdje.
 * Generičko po tipu: `arrayKey` ∈ {flashcards, quiz, fillBlanks, …}; `applyItem(item)` mutira na mjestu.
 * Best-effort: primarni red je već spremljen; svaki sibling-write ide pod istim RLS + snapshotom.
 * @returns {Promise<{patched:string[], failed:string[]}>}
 */
async function _propagateToSiblings(client, subjectId, primaryVar, catId, arrayKey, idx, applyItem) {
  const patched = [];
  const failed = [];
  try {
    const sel = await client.from('subject_content').select('var_name,payload')
      .eq('subject_id', subjectId).neq('var_name', primaryVar);
    if (sel.error || !Array.isArray(sel.data)) return { patched: patched, failed: failed };
    for (const row of sel.data) {
      const p = row.payload;
      const arr = (p && p[catId] && Array.isArray(p[catId][arrayKey])) ? p[catId][arrayKey] : null;
      if (!arr || !arr[idx]) continue; // ta kategorija/indeks ne postoji ovdje → preskoči (npr. examPractice-only)
      applyItem(arr[idx]);
      const upd = await client.from('subject_content').update({ payload: p })
        .eq('subject_id', subjectId).eq('var_name', row.var_name);
      if (upd.error) failed.push(row.var_name); else patched.push(row.var_name);
    }
  } catch (e) {
    // best-effort; primarni je već spremljen — sib-neuspjeh ne ruši glavni write.
  }
  return { patched: patched, failed: failed };
}

/** Spremi uređenu karticu: read-modify-write JEDNOG reda pod admin JWT-om (RLS). */
async function _saveCard() {
  const qEl = document.getElementById('adminEditQ');
  const aEl = document.getElementById('adminEditA');
  const saveBtn = document.getElementById('adminEditSave');
  if (!qEl || !aEl || !_editTarget) return;

  const q = qEl.value.trim();
  const a = aEl.value.trim();
  if (!q || !a) { _editStatus(_adminT('admin.emptyErr', 'Question and answer must not be empty.'), true); return; }

  const subjectId = _adminCtx.subjectId;
  const varName = _adminCtx.varName;
  const catId = _editTarget.catId;
  const idx = _editTarget.idx;
  if (!subjectId || !varName) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
  const client = (auth && typeof auth.getClient === 'function') ? auth.getClient() : null;
  if (!client) { _editStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  if (saveBtn) saveBtn.disabled = true;
  _editStatus(_adminT('admin.saving', 'Saving…'), false);
  try {
    // 1) SVJEŽI autoritativni payload iz baze (read-modify-write; ne pišemo preko stale/JSON-fallbacka).
    const sel = await client.from('subject_content').select('payload')
      .eq('subject_id', subjectId).eq('var_name', varName).single();
    if (sel.error || !sel.data || !sel.data.payload) {
      _editStatus(_adminT('admin.notInDb', 'This subject is not in the database yet.'), true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }
    const payload = sel.data.payload;
    const target = (payload[catId] && Array.isArray(payload[catId].flashcards)) ? payload[catId].flashcards[idx] : null;
    if (!target) {
      _editStatus(_adminT('admin.saveErr', 'Could not save.'), true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }
    const applyItem = function (fc) { fc.question = q; fc.answer = a; };
    applyItem(target);

    // 2) Write natrag — RLS is_admin() čuvar; trigger snapshota STARI red u content_versions PRIJE prepisa.
    const upd = await client.from('subject_content').update({ payload: payload })
      .eq('subject_id', subjectId).eq('var_name', varName);
    if (upd.error) {
      _editStatus(_adminT('admin.saveErr', 'Could not save.') + ' (' + upd.error.message + ')', true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    // 3) F4.3c-2: propagiraj u sestrinske redove (final = kopija M1+M2 → mora ostati u sinku).
    const prop = await _propagateToSiblings(client, subjectId, varName, catId, 'flashcards', idx, applyItem);

    // 4) In-memory patch → live promjena bez reloada (primarni + svi zakrpani sestrinski varovi).
    _patchInMemory(varName, catId, 'flashcards', idx, applyItem);
    prop.patched.forEach(function (sv) { _patchWindowVar(sv, catId, 'flashcards', idx, applyItem); });

    if (saveBtn) saveBtn.disabled = false;
    _closeEditor();
    if (typeof showToast === 'function') {
      const okMsg = _adminT('admin.saveOk', 'Flashcard saved.');
      showToast(prop.failed.length ? (okMsg + ' ' + _adminT('admin.propWarn', '(final sync incomplete)')) : okMsg);
    }
    const holder = document.getElementById('adminCards');
    if (holder) _renderAdminCards(holder, _adminCtx.data);
  } catch (e) {
    _editStatus(_adminT('admin.saveErr', 'Could not save.'), true);
    if (saveBtn) saveBtn.disabled = false;
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

/** Otvori quiz-editor za (catId, idx) iz trenutnog konteksta. */
function _openQuizEditor(catId, idx) {
  const data = _adminCtx.data;
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
      _adminT('admin.finalNote', 'syncs across this lesson and the final exam.');
  }
  _quizStatus('', false);
  const m = document.getElementById('adminQuizModal');
  if (m && typeof m.open === 'function') m.open();
}

/** Spremi uređeno quiz pitanje: validacija → RMW jednog reda → verzija → propagacija → live re-render. */
async function _saveQuiz() {
  const qEl = document.getElementById('adminQuizQ');
  const saveBtn = document.getElementById('adminQuizSave');
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

  const subjectId = _adminCtx.subjectId;
  const varName = _adminCtx.varName;
  const catId = _quizTarget.catId;
  const idx = _quizTarget.idx;
  if (!subjectId || !varName) { _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  const auth = (typeof SokratAuth !== 'undefined') ? SokratAuth : null;
  const client = (auth && typeof auth.getClient === 'function') ? auth.getClient() : null;
  if (!client) { _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }

  if (saveBtn) saveBtn.disabled = true;
  _quizStatus(_adminT('admin.saving', 'Saving…'), false);
  try {
    // 1) Svjež autoritativni payload iz baze (read-modify-write; ne preko stale/JSON-fallbacka).
    const sel = await client.from('subject_content').select('payload')
      .eq('subject_id', subjectId).eq('var_name', varName).single();
    if (sel.error || !sel.data || !sel.data.payload) {
      _quizStatus(_adminT('admin.notInDb', 'This subject is not in the database yet.'), true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }
    const payload = sel.data.payload;
    const target = (payload[catId] && Array.isArray(payload[catId].quiz)) ? payload[catId].quiz[idx] : null;
    if (!target) {
      _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }
    // Mijenjamo samo question/options/correct → image/imageAlt (ako postoje) ostaju netaknuti.
    const applyItem = function (t) { t.question = q; t.options = options.slice(); t.correct = correct; };
    applyItem(target);

    // 2) Write natrag — RLS is_admin() čuvar; trigger snapshota STARI red u content_versions PRIJE prepisa.
    const upd = await client.from('subject_content').update({ payload: payload })
      .eq('subject_id', subjectId).eq('var_name', varName);
    if (upd.error) {
      _quizStatus(_adminT('admin.saveErr', 'Could not save.') + ' (' + upd.error.message + ')', true);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    // 3) Propagiraj u sestrinske redove (final = kopija M1+M2 → mora ostati u sinku).
    const prop = await _propagateToSiblings(client, subjectId, varName, catId, 'quiz', idx, applyItem);

    // 4) In-memory patch → live promjena bez reloada (primarni + zakrpani sestrinski varovi).
    _patchInMemory(varName, catId, 'quiz', idx, applyItem);
    prop.patched.forEach(function (sv) { _patchWindowVar(sv, catId, 'quiz', idx, applyItem); });

    if (saveBtn) saveBtn.disabled = false;
    _closeQuizEditor();
    if (typeof showToast === 'function') {
      const okMsg = _adminT('admin.quizSaveOk', 'Quiz question saved.');
      showToast(prop.failed.length ? (okMsg + ' ' + _adminT('admin.propWarn', '(final sync incomplete)')) : okMsg);
    }
    const holder = document.getElementById('adminCards');
    if (holder) _renderAdminCards(holder, _adminCtx.data);
  } catch (e) {
    _quizStatus(_adminT('admin.saveErr', 'Could not save.'), true);
    if (saveBtn) saveBtn.disabled = false;
  }
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
  else _openCardEditor(catId, idx);
});
