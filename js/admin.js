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
  const cats = getCategories(data);
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
    // Learn dual-mode: v1 = HTML string (content), v2 = blok-niz (blocks; U7/U8).
    const _learnObj = (cat.learn && typeof cat.learn === 'object') ? cat.learn : null;
    const learnV1 = !!(_learnObj && typeof _learnObj.content === 'string' && _learnObj.content && !Array.isArray(_learnObj.blocks));
    const learnV2 = !!(_learnObj && Array.isArray(_learnObj.blocks));
    const hasLearn = learnV1 || learnV2;
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

    // — Learn v1 (F4.4) — HTML string; postojeći modal-editor NEDIRNUT —
    if (learnV1) {
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
    } else if (learnV2 && !canEdit) {
      // v2 learn izvan drafta = read-only preview kroz JEDAN renderer (ista granica kao study).
      total++;
      html += '<h4 class="admin-subhead">' + _adminT('admin.learn', 'Learn') + ' · ' + _adminT('admin.blocksTag', 'blokovi') + '</h4>' +
        '<div class="admin-card admin-card--learn"><div class="admin-card-body be-body">' +
        // BUG-024: razrješavanje `node-img:` oznaka živi u `renderContentBlocks` (jedan ulaz za sve).
        (typeof window.renderContentBlocks === 'function'
          ? window.renderContentBlocks(cat.learn.blocks)
          : '') +
        '</div></div>';
    }

    // — Learn v2 blok-editor (U8a) — SAMO draft-mod; za v2 learn ILI prazan/nov (nema v1 sadržaja
    //   → nula dodira postojećeg v1 `content`; migracija v1→v2 je zasebna cigla). Mount ide u post-render.
    if (canEdit && !learnV1) {
      html += '<h4 class="admin-subhead">' + _adminT('admin.learn', 'Learn') + ' · ' + _adminT('admin.blocksTag', 'blokovi') + '</h4>' +
        '<div class="be-mount" data-be-cat="' + _adminEscape(catId) + '"></div>';
    }

    html += '</div>';
  });

  // U6d: „Dodaj kategoriju" (samo draft-mod). U praznoj lekciji je jedini sadržaj htmla → i tada se prikaže.
  html += _adminCatAddBtn(canEdit, _adminT('admin.addCategoryBtn', 'Add category'));

  holder.innerHTML = (total || (canEdit && html))
    ? html
    : '<p class="profile-meta">' + _adminT('admin.noContent', 'No flashcards or quiz in this lesson.') + '</p>';

  _mountBlockEditors(holder); // U8a-2: oživi .be-mount kontejnere (draft-mod, learn-blokovi)
}

window.renderAdminPage = renderAdminPage;

// ===== U8a-2 — blok-editor (learn v2) ožičen na draft-ops =====
// Editor je samostalan modul (js/block-editor.js); admin mu daje SAMO callbacke → nema vezanja.
// Blok-ops idu kroz istu draft-mašineriju kao ostali editori (SokratDraft.applyOp; „Objavi" = U4 RPC).

/** Trenutni blokovi kategorije iz WORKING kopije (draft). Prazno = editor pokaže ＋ (dodaj prvi). */
function _beGetBlocks(catId) {
  const data = _adminWorking();
  const cat = data && data[catId];
  return (cat && cat.learn && Array.isArray(cat.learn.blocks)) ? cat.learn.blocks : [];
}

/** Primijeni blok-op na draft + osvježi brojač trake. NE full-rerenderira (editor sam re-crta svoj container). */
function _beApplyOp(op) {
  const d = _adminDraft();
  if (!d) return { ok: false, error: 'no-draft' };
  const res = SokratDraft.applyOp(d.subjectId, d.lessonId, op);
  _renderEditBar(); // brojač „N izmjena"
  return res;
}

/** Nakon rendera: montiraj blok-editor u svaki .be-mount (draft-mod). Idempotentno (fresh container po renderu). */
function _mountBlockEditors(holder) {
  if (!holder || !window.SokratBlockEditor || typeof SokratBlockEditor.mount !== 'function') return;
  const mounts = holder.querySelectorAll('.be-mount');
  for (let i = 0; i < mounts.length; i++) {
    (function (el) {
      const catId = el.getAttribute('data-be-cat');
      SokratBlockEditor.mount(el, {
        catId: catId,
        getBlocks: function () { return _beGetBlocks(catId); },
        applyOp: _beApplyOp
      });
    })(mounts[i]);
  }
}

// ===== F4.3c-1 — Uredi JEDNU karticu: write JEDNOG reda + auto-verzija + live re-render =====
//
// Najtanji dokaz cijelog write-pipelinea. Piše SAMO red koji ovoj lekciji pripada
// (catalog.resolve[lessonId], npr. te2M1). ⚠ Final (…Final) je Object.assign KOPIJA M1+M2 →
// u ovoj cigli NAMJERNO ostaje nesinkroniziran; propagacija u sestrinske redove je F4.3c-2.
// Sve reverzibilno: RLS is_admin() dopušta write, a trigger snapshota STARI payload u
// content_versions PRIJE prepisa (F4.2) → undo + audit. Prava zaštita je RLS, ne UI.

/** Kontekst trenutno otvorene lekcije u vieweru (write ide u _adminCtx.varName). */
let _adminCtx = { subjectId: '', lessonId: '', varName: '', data: null };

// F3 — kontekst OSOBNOG study-čvora (`nodes`/`node_content`), null = klasični predmet/lekcija.
// Draft-mašinerija je generična (ključ = `subjectId::lessonId` string), pa čvor koristi
// SINTETIČKI ključ `node:<uuid>` i sve postojeće (draft/opovi/autosave/blokovi) radi netaknuto.
// Razlikuju se SAMO dvije IO-točke: odakle se čita (`_enterDraftMode`) i kamo se piše
// (`_publishDraft` → `publish_node` umjesto `publish_document`). ADR-024.
/** @type {{ nodeId: string, name: string }|null} */
let _nodeCtx = null;

/** Sintetički draft-ključ za čvor (nema predmeta/lekcije/var_name — jedan payload po čvoru). */
function _nodeDraftCtx(nodeId, data) {
  return { subjectId: 'node:' + nodeId, lessonId: 'content', varName: 'payload', data: data || null };
}

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
  // U8.3: ako je Studio aktivan, isti draft-op mijenja i njegov canvas → osvježi ga (no-op inače).
  if (window.SokratStudio && typeof SokratStudio.onDraftChanged === 'function') SokratStudio.onDraftChanged();
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

  // F3 — osobni čvor: izvor je `node_content` (owner-RLS), a ne `subject_content`.
  // `create_node` svakom study-čvoru odmah upisuje redak s `{}` → redak UVIJEK postoji;
  // prazan payload je legitimno početno stanje (čvor bez sadržaja), ne greška.
  if (_nodeCtx) {
    try {
      const sel = await client.from('node_content').select('payload,version')
        .eq('node_id', _nodeCtx.nodeId).single();
      if (sel.error || !sel.data) {
        if (typeof showToast === 'function') showToast(_adminT('admin.loadFail', 'Could not load content.'));
        return;
      }
      const d = SokratDraft.begin(s, l, v, sel.data.payload || {}, sel.data.version);
      _draftMode = true;
      if (d.restored && typeof showToast === 'function') showToast(_adminT('admin.draftRestored', 'Unsaved draft restored.'));
      _adminRerender();
    } catch (e) {
      if (typeof showToast === 'function') showToast(_adminT('admin.loadFail', 'Could not load content.'));
    }
    return;
  }

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

  // F3 — osobni čvor: JEDAN payload, BEZ sestrinskih redova (nema `final` kompozicije) i bez
  // window-vara (čvor ne živi u katalogu). Isti optimistic-concurrency ugovor: `base_version`
  // lovi tuđu izmjenu, a `publish_node` je jedini write-put (SECURITY DEFINER + owner-check).
  if (_nodeCtx) {
    try {
      const rpc = await client.rpc('publish_node', {
        p_node_id: _nodeCtx.nodeId,
        p_payload: d.working,
        p_base_version: d.baseVersion
      });
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
      if (_adminCtx.data) SokratDraft.applyOpsTo(_adminCtx.data, d.ops.slice());
      SokratDraft.commitDone(d.subjectId, d.lessonId, (rpc.data == null ? null : rpc.data));
      _draftMode = false;
      if (typeof showToast === 'function') showToast(_adminT('admin.publishOk', 'Published.'));
      _adminRerender();
    } catch (e) {
      if (typeof showToast === 'function') showToast(_adminT('admin.publishErr', 'Publish failed.'));
      if (btn) btn.disabled = false;
    }
    return;
  }

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


/** Presloži kategoriju za dir (-1 gore / +1 dolje): izračunaj novi red ključeva → reorderCategories op. */
function _moveCategory(catId, dir) {
  const d = _adminDraft();
  const data = _adminWorking();
  if (!d || !data || typeof data !== 'object') return;
  const keys = getCategories(data); // U7a: samo kategorije (meta-ključevi ostaju na mjestu kroz _setKeyOrder)
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


// ===== U8.1 — STUDIO BRIDGE =====
// Novi „Studio" editor (js/studio.js) dijeli JEDAN draft/publish engine s adminom — bez
// duplikata publish-logike (U4 RPC/versioning/audit). Studio postavi kontekst lekcije, a
// Objavi/Odbaci pozovu iste funkcije (_publishDraft/_discardDraft). `_adminRerender()` unutar
// njih je no-op ako admin-DOM nije renderiran (guard `if (holder)`), pa se ne miješaju sučelja.
window.SokratAdmin.studioBridge = {
  // Postavi kontekst na odabranu lekciju (data = svjež sadržaj iz Studija). Vrati draft (ako postoji).
  setLesson: function (subjectId, lessonId, data) {
    _nodeCtx = null;   // F3: povratak na klasični predmet/lekciju gasi node-mod
    _adminCtx = { subjectId: subjectId, lessonId: lessonId, varName: _adminResolveVar(subjectId, lessonId) || '', data: data || null };
    const d = _adminDraft();
    _draftMode = !!(d && d.dirty); // nastavi draft ako postoji dirty (npr. iz starog admina)
    return d;
  },
  // F3 — postavi kontekst na OSOBNI study-čvor. Isti ugovor kao setLesson (vrati draft ako
  // postoji dirty), samo je izvor/odredište `node_content` + `publish_node`. ADR-024.
  setNode: function (nodeId, name, data) {
    _nodeCtx = { nodeId: nodeId, name: name || '' };
    _adminCtx = _nodeDraftCtx(nodeId, data);
    const d = _adminDraft();
    _draftMode = !!(d && d.dirty);
    return d;
  },
  nodeCtx: function () { return _nodeCtx; },
  draft: function () { return _adminDraft(); },
  publish: function () { return _publishDraft(); },  // U4 publish_document RPC (atomično + base_version)
  discard: function () { return _discardDraft(); },
  // U8.2 — ulaz u draft-mod (svjež DB payload + version → SokratDraft.begin; async). Vraća promise.
  enter: function () { return _enterDraftMode(); },
  isEditing: function () { return _draftMode; },
  hasVar: function () { return !!_adminCtx.varName; }, // je li lekcija u bazi (inače nema editiranja)
  // Izvor za render u edit-modu = WORKING kopija drafta (inače pročitani sadržaj).
  workingData: function () { return _adminWorking(); },
  // U8.2 — blok-ops (learn v2) preko iste draft-mašinerije kao admin (_beApplyOp osvježi i admin-traku, no-op ako skrivena).
  getBlocks: function (catId) { return _beGetBlocks(catId); },
  applyOp: function (op) { return _beApplyOp(op); }
};
