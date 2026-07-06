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
    const auth = window.SokratAuth;
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
    if (window.SokratAuth && typeof SokratAuth.onChange === 'function') {
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
  if (!subjectId || !lessonId) { holder.innerHTML = ''; return; }

  holder.innerHTML = '<p class="profile-meta">' + _adminT('admin.loading', 'Loading…') + '</p>';
  let data = {};
  try {
    data = await SokratContent.loadLesson(subjectId, lessonId);
  } catch (e) {
    holder.innerHTML = '<p class="profile-meta">' + _adminT('admin.loadFail', 'Could not load content.') + '</p>';
    return;
  }
  _renderAdminCards(holder, data);
}

function _renderAdminCards(holder, data) {
  const cats = (data && typeof data === 'object') ? Object.keys(data) : [];
  let html = '';
  let total = 0;

  cats.forEach(function (catId) {
    const cat = data[catId];
    if (!cat || !Array.isArray(cat.flashcards) || cat.flashcards.length === 0) return;
    html +=
      '<div class="profile-card profile-card--wide admin-cat">' +
      '  <h3 class="profile-card-title"><i class="fas ' + _adminEscape(cat.icon || 'fa-book') + '"></i> ' +
      _adminEscape(cat.name || catId) + ' <span class="admin-count">' + cat.flashcards.length + '</span></h3>' +
      '  <ol class="admin-card-list">';
    cat.flashcards.forEach(function (fc) {
      total++;
      html +=
        '<li class="admin-card">' +
        '  <div class="admin-card-q">' + _adminEscape(fc.question || '') + '</div>' +
        '  <div class="admin-card-a">' + _adminEscape(fc.answer || '') + '</div>' +
        '</li>';
    });
    html += '  </ol></div>';
  });

  holder.innerHTML = total
    ? html
    : '<p class="profile-meta">' + _adminT('admin.noCards', 'No flashcards in this lesson.') + '</p>';
}

window.renderAdminPage = renderAdminPage;
