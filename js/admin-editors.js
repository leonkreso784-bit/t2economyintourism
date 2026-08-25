// ===== SOKRAT STUDY — ADMIN EDITORI (modal-editori: kartica / kategorija / kviz / fill / learn) =====
//
// Izdvojeno iz js/admin.js (U8-prep, 2026-07-18): admin.js je kroz U6 narastao na ~1390 LOC.
// Ovdje žive SVI modal-editori draft-moda. Rez = ČISTA SEOBA KODA (nula promjene logike).
// UČITAVA SE ODMAH IZA js/admin.js i koristi njegovo dijeljeno stanje/pomoćnike (klasične
// skripte dijele globalni scope, bez ES-modula):
//   _adminCtx · _draftMode · _adminDraft() · _adminWorking() · _adminRerender() · _adminT() · _adminEscape()
//   + SokratDraft (js/draft-store.js). Listeneri koji ove editore otvaraju su u admin.js (rade u runtimeu).
// U admin.js OSTAJE: render, graditelji gumba, draft-ožičenje, strukturne akcije (_moveItem/_removeItem/
// _moveCategory/_removeCategory) i svi delegat-listeneri.

/** Kartica koja se uređuje: { catId, idx }. */
let _editTarget = null;

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
    '    <textarea id="adminEditQ" class="admin-edit__input" rows="3"></textarea>' +
    '    <span class="admin-edit__count" id="adminEditQCount" aria-live="polite"></span></label>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.answer', 'Answer') + '</span>' +
    '    <textarea id="adminEditA" class="admin-edit__input" rows="4"></textarea>' +
    '    <span class="admin-edit__count" id="adminEditACount" aria-live="polite"></span></label>' +
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
  // M5a: brojač uživo. `input` pokriva tipkanje I paste; programsko postavljanje vrijednosti
  // (_openCardEditor) ga NE okida, pa se ondje _refreshCardCounts zove ručno.
  ['adminEditQ', 'adminEditA'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', _refreshCardCounts);
  });
  return m;
}

// ===== M5a — mjera duljine kartice =====
//
// Politika (pragovi + klasifikacija) živi u `js/card-limits.js` i NE prepisuje se ovdje —
// isti modul čita i `scripts/validate-content.js`. Ovaj sloj je samo prikaz + kočnica.
//
// Ovaj editor je JEDINI editor kartica: Studio (`js/studio.js` renderPane) emitira `data-admin-*`
// kontrole koje hvataju delegati u `js/admin.js` i završe ovdje. Zato javni katalog i osobni
// materijal dobivaju isto ograničenje bez ijedne druge promjene — `tests/card-limits.authed.spec.js`
// pada ako se ta pretpostavka ikad prekrši.

/** Ispiši stanje jednog brojača; vrati true ako polje blokira spremanje. */
function _paintCount(elId, text) {
  const L = (typeof window !== 'undefined') ? window.SokratCardLimits : null;
  const el = document.getElementById(elId);
  if (!L || !el) return false;
  const m = L.measure(text);
  el.textContent = m.len + ' / ' + L.HARD;
  el.classList.toggle('is-warn', m.state === 'warn');
  el.classList.toggle('is-over', m.state === 'over');
  return m.blocked;
}

/** Osvježi oba brojača + omogući/onemogući „Spremi". Vrati true ako je spremanje blokirano. */
function _refreshCardCounts() {
  const qEl = document.getElementById('adminEditQ');
  const aEl = document.getElementById('adminEditA');
  const qOver = _paintCount('adminEditQCount', qEl ? qEl.value : '');
  const aOver = _paintCount('adminEditACount', aEl ? aEl.value : '');
  const blocked = qOver || aOver;
  const saveBtn = document.getElementById('adminEditSave');
  if (saveBtn) {
    saveBtn.disabled = blocked;
    saveBtn.classList.toggle('is-blocked', blocked);
  }
  return blocked;
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
  _refreshCardCounts(); // programsko postavljanje ne okida `input` → brojači bi ostali od prošle kartice
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

  // M5a: TVRDA blokada. Onemogućen gumb nije zaštita (Enter, programski klik, izgubljen listener) —
  // jedina prava kočnica je ova, na jedinom putu koji piše op u draft.
  const L = (typeof window !== 'undefined') ? window.SokratCardLimits : null;
  if (L && !L.allows(q, a)) {
    _refreshCardCounts();
    _editStatus(_adminT('admin.tooLongErr',
      'Too long — a flashcard holds at most {max} characters. Move the detail into Learn.')
      .replace('{max}', String(L.HARD)), true);
    return;
  }

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

// ── D1 (2026-08-25): PODVLAKA JE FORMAT POHRANE I NE TRAŽI SE OD AUTORA ─────────
// Editor je dosad tražio da autor utipka točno 7 podvlaka, dakle ono što baza sprema.
// Sada se praznina UBACUJE GUMBOM (označi riječ → postane praznina i ponuđeni odgovor).
//
// ⚠️ Tolerira se samo niz od 3+ podvlake; JEDNA I DVIJE SE NE DIRAJU. Razlog nije stil nego
// LaTeX: `_` je operator indeksa, a rečenice s dopunom renderiraju matematiku (js/fill-blanks.js).
// Izmjereno u `data/`: 1005 rečenica s dopunom, 5 ih sadrži KaTeX — u jednoj stoji
// `\(Q_d = Q_s\)`, koji bi po pravilu „jedna podvlaka = praznina" postao DVIJE praznine.

/** Nizovi od 3+ podvlake → kanonski marker. `Q_d` i `x__y` ostaju netaknuti. */
function _fillNormalize(text) {
  return String(text == null ? '' : text).replace(/_{3,}/g, _FILL_BLANK);
}

/** Koliko praznina rečenica ima (nakon normalizacije). */
function _fillCount(text) {
  return _fillNormalize(text).split(_FILL_BLANK).length - 1;
}

/**
 * ČISTA funkcija (bez DOM-a → testabilna): ubaci prazninu preko raspona [start, end).
 * Vraća { text, caret, word }; `word` je označena riječ = kandidat za odgovor ('' ako nije bilo odabira).
 */
function _fillInsert(text, start, end) {
  const s = String(text == null ? '' : text);
  let a = Math.max(0, Math.min(s.length, start | 0));
  let b = Math.max(0, Math.min(s.length, end | 0));
  if (a > b) { const t = a; a = b; b = t; }
  return {
    text: s.slice(0, a) + _FILL_BLANK + s.slice(b),
    caret: a + _FILL_BLANK.length,
    word: s.slice(a, b).trim()
  };
}

// Izvoz za node-test (tests/unit/fill-blank-format.test.js); u pregledniku bezopasno.
if (typeof window !== 'undefined') {
  window.SokratFillFormat = {
    MARK: _FILL_BLANK, normalize: _fillNormalize, count: _fillCount, insert: _fillInsert
  };
}

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
    '  <label class="admin-edit__field"><span>' + _adminT('admin.sentence', 'Sentence') + '</span>' +
    '    <textarea id="adminFillS" class="admin-edit__input" rows="3"></textarea></label>' +
    '  <div class="admin-edit__tools">' +
    '    <button type="button" class="cta-button secondary admin-edit__tool" id="adminFillBlankBtn">' +
    '      <i class="fas fa-square-minus"></i><span>' + _adminT('admin.insertBlank', 'Insert blank') + '</span></button>' +
    '    <span class="admin-edit__toolhint">' + _adminT('admin.insertBlankHint', 'Select a word — it becomes the blank and the answer.') + '</span>' +
    '  </div>' +
    '  <label class="admin-edit__field"><span>' + _adminT('admin.answer', 'Answer') + '</span>' +
    '    <textarea id="adminFillA" class="admin-edit__input" rows="2"></textarea></label>' +
    '  <div id="adminFillMore"></div>' +
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
  const blankBtn = document.getElementById('adminFillBlankBtn');
  if (blankBtn) blankBtn.addEventListener('click', _insertFillBlank);
  const sTa = document.getElementById('adminFillS');
  if (sTa) sTa.addEventListener('input', _fillSyncAnswers);
  return m;
}

/**
 * Gumb „Ubaci prazninu": označena riječ → praznina, i (ako je polje odgovora prazno) postaje odgovor.
 * Bez odabira → praznina ide na mjesto pokazivača. Textarea pamti `selectionStart` i nakon blura,
 * pa klik na gumb ne gubi mjesto.
 */
function _insertFillBlank() {
  const sEl = document.getElementById('adminFillS');
  const aEl = document.getElementById('adminFillA');
  if (!sEl) return;
  const r = _fillInsert(sEl.value, sEl.selectionStart, sEl.selectionEnd);
  sEl.value = r.text;
  if (r.word && aEl && !aEl.value.trim()) aEl.value = r.word;
  sEl.focus();
  try { sEl.setSelectionRange(r.caret, r.caret); } catch (e) { /* stariji preglednik */ }
  _fillSyncAnswers();
  _fillStatus('', false);
}

/**
 * D2: broj polja za odgovor prati broj praznina u rečenici. Prvo polje je zatečeni `adminFillA`
 * (jedna praznina = sučelje se NE mijenja), a od druge nadalje se dodaju redci. Upisane
 * vrijednosti se čuvaju PO INDEKSU, pa ubacivanje praznine ne briše ono što je autor već napisao.
 */
function _fillSyncAnswers() {
  const box = document.getElementById('adminFillMore');
  const sEl = document.getElementById('adminFillS');
  if (!box || !sEl) return;
  const need = Math.max(1, _fillCount(sEl.value)) - 1; // koliko IZNAD prvog
  const had = _fillExtraAnswers();
  let html = '';
  for (let i = 0; i < need; i++) {
    html += '<label class="admin-edit__field"><span>' + _adminT('admin.answer', 'Answer') + ' ' + (i + 2) + '</span>' +
      '<input type="text" class="admin-edit__input" data-fill-ans="' + (i + 1) + '" value="' + _adminEscape(had[i] || '') + '"></label>';
  }
  box.innerHTML = html;
}

/** Vrijednosti polja za 2., 3., … prazninu (bez prvog, koje je `adminFillA`). */
function _fillExtraAnswers() {
  const box = document.getElementById('adminFillMore');
  if (!box) return [];
  return Array.prototype.slice.call(box.querySelectorAll('[data-fill-ans]')).map(function (el) { return el.value; });
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
  // D2: `answers` (2+) je izvor kad postoji; `answer` je i dalje prvi odgovor.
  const all = (Array.isArray(fb.answers) && fb.answers.length) ? fb.answers : [fb.answer || ''];
  document.getElementById('adminFillA').value = all[0] || '';
  const more = document.getElementById('adminFillMore');
  if (more) more.innerHTML = '';
  _fillSyncAnswers();
  const rows = document.querySelectorAll('#adminFillMore [data-fill-ans]');
  for (let i = 0; i < rows.length; i++) rows[i].value = all[i + 1] || '';
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

  // D1: ručno utipkane podvlake (3+) poravnavaju se na kanonski marker — autor ih ne mora brojiti.
  const sentence = _fillNormalize(sEl.value).trim();
  const all = [aEl.value.trim()].concat(_fillExtraAnswers().map(function (v) { return String(v).trim(); }));

  // Validacija (odražava JSON Schemu: rečenica neprazna + sadrži prazninu; svaki odgovor neprazan).
  if (!sentence || !all[0]) { _fillStatus(_adminT('admin.fillEmptyErr', 'Sentence and answer must not be empty.'), true); return; }
  const blanks = _fillCount(sentence);
  if (blanks === 0) { _fillStatus(_adminT('admin.fillBlankErr', 'The sentence needs a blank — select a word and press the button.'), true); return; }
  // D2: svaka praznina traži svoj odgovor — inače bi se rečenica spremila s prazninom koja se
  // NE MOŽE pogoditi (ocjenjivanje ide po praznini, prazan odgovor nikad nije točan).
  if (all.length !== blanks || all.some(function (a) { return !a; })) {
    _fillStatus(_adminT('admin.fillAnswerCountErr', 'Every blank needs its own answer.'), true); return;
  }
  // `answer` OSTAJE prvi odgovor i kad ih je više: stara keširana skripta tako pokaže smislenu
  // rečenicu umjesto da pukne. `answers` se briše (null) kad praznina opet postane jedna.
  const answer = all[0];
  const answers = (blanks > 1) ? all : null;

  const d = _adminDraft();
  const catId = _fillTarget.catId;

  let res;
  if (_fillTarget.add) {
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'addFill', catId: catId,
      item: answers ? { sentence: sentence, answer: answer, answers: answers }
                    : { sentence: sentence, answer: answer }
    });
  } else {
    const idx = _fillTarget.idx;
    const w = (_draftMode && d) ? d.working : null;
    const item = (w && w[catId] && Array.isArray(w[catId].fillBlanks)) ? w[catId].fillBlanks[idx] : null;
    if (!item) { _fillStatus(_adminT('admin.saveErr', 'Could not save.'), true); return; }
    // Patch mijenja samo sentence/answer → hint (ako postoji) ostaje netaknut.
    res = SokratDraft.applyOp(d.subjectId, d.lessonId, {
      type: 'updateFill', catId: catId, id: item.id, idx: idx,
      patch: { sentence: sentence, answer: answer, answers: answers } // `null` briše ključ
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
