/* =====================================================================
 * SokratDraft — draft-sloj za admin editore (U3, EDITOR_PLAN.md §4.1)
 * =====================================================================
 * Ulaz u edit-mode = deep-copy lekcijskog payloada: { original, working, dirty }.
 * Editori NE diraju bazu ni window-varove direktno — zovu applyOp(op) nad
 * `working` kopijom; „Objavi" (admin.js) šalje working u bazu, „Odbaci" baca kopiju.
 *
 * Zašto imenovane OPERACIJE (ops): undo/redo besplatno (stog opova) · AI-alati
 * kasnije dobivaju gotov akcijski prostor · audit čitljiv · U6 (add/remove/reorder)
 * samo registrira nove tipove ovdje, jezgra se ne mijenja.
 *
 * Adresiranje stavke: PRVO stabilni `id` (U2a, schema v2), fallback na indeks —
 * jer DB payloadi (zrcalo sinkano PRIJE U2a) još nemaju id-jeve; datoteke/JSON imaju.
 *
 * Autosave: localStorage po dokumentu (preživi refresh/crash; default ON —
 * EDITOR_PLAN §11). Vraća se SAMO ako se baza drafta (original) poklapa s
 * onom iz vremena spremanja (fingerprint) — inače je autosave zastario i briše se.
 *
 * Klasična skripta (bez modula): window.SokratDraft. H2: draftovi sele u
 * server-tablicu `content_drafts` — ISTO sučelje, editori se ne mijenjaju.
 * ===================================================================== */
'use strict';

(function (window) {
  const LS_PREFIX = 'sokrat-draft:';

  /** @type {Object<string, any>} aktivni draftovi po ključu subjectId::lessonId */
  const _drafts = {};

  const _key = (subjectId, lessonId) => subjectId + '::' + lessonId;

  /** Deep-copy JSON round-tripom — payloadi su JSON-safe po konstrukciji (kod/vježbe NIKAD ovdje, BUG-012). */
  const _copy = (data) => JSON.parse(JSON.stringify(data));

  /** Fingerprint baze drafta (djb2 + duljina) — jeftina provjera „ista polazna verzija?" za autosave restore. */
  function _fp(data) {
    const s = JSON.stringify(data);
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return h + ':' + s.length;
  }

  const _storage = () => {
    try { return window.localStorage || null; } catch (_) { return null; }
  };

  function _autosaveWrite(d) {
    const ls = _storage();
    if (!ls) return;
    try {
      ls.setItem(LS_PREFIX + _key(d.subjectId, d.lessonId), JSON.stringify({
        varName: d.varName, baseFp: d.baseFp, working: d.working, ops: d.ops, savedAt: Date.now()
      }));
    } catch (_) { /* best-effort (quota/private mode) — draft živi u memoriji i bez ovoga */ }
  }

  function _autosaveClear(subjectId, lessonId) {
    const ls = _storage();
    if (!ls) return;
    try { ls.removeItem(LS_PREFIX + _key(subjectId, lessonId)); } catch (_) { /* ignore */ }
  }

  function _autosaveRead(subjectId, lessonId) {
    const ls = _storage();
    if (!ls) return null;
    try {
      const raw = ls.getItem(LS_PREFIX + _key(subjectId, lessonId));
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  /* ---- Registar operacija -------------------------------------------------
   * update-ops za 4 postojeća editora (F4.3/F4.4): arrayKey = stavka niza, objectKey = cijeli objekt.
   * U6 strukturne (add/remove/reorder) = arrayKey + `struct` — IDEMPOTENTNE po konstrukciji
   * (add: guard po id · remove: no-op ako nema · reorder: apsolutni red) → op-replay sibling-sync
   * (applyOpsTo) ostaje ispravan, publish-put se NE mijenja. */
  const OPS = {
    updateCard:  { arrayKey: 'flashcards' },
    updateQuiz:  { arrayKey: 'quiz' },
    updateFill:  { arrayKey: 'fillBlanks' },
    updateLearn: { objectKey: 'learn' },
    addCard:      { arrayKey: 'flashcards', struct: 'add' },
    removeCard:   { arrayKey: 'flashcards', struct: 'remove' },
    reorderCards: { arrayKey: 'flashcards', struct: 'reorder' },
    addQuiz:      { arrayKey: 'quiz',       struct: 'add' },
    removeQuiz:   { arrayKey: 'quiz',       struct: 'remove' },
    reorderQuiz:  { arrayKey: 'quiz',       struct: 'reorder' },
    addFill:      { arrayKey: 'fillBlanks', struct: 'add' },
    removeFill:   { arrayKey: 'fillBlanks', struct: 'remove' },
    reorderFill:  { arrayKey: 'fillBlanks', struct: 'reorder' }
  };

  /** Nađi indeks stavke: preferiraj stabilni `id`, fallback na `idx` (DB payloadi pre-U2a nemaju id). */
  function _findIndex(arr, op) {
    if (op.id != null) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].id === op.id) return i;
      }
    }
    if (Number.isInteger(op.idx) && op.idx >= 0 && op.idx < arr.length && arr[op.idx]) return op.idx;
    return -1;
  }

  /** Primijeni jedan op nad working kopijom. Vrati {ok, error?}. */
  function _dispatch(working, op) {
    const spec = op && OPS[op.type];
    if (!spec) return { ok: false, error: 'unknown-op' };
    const cat = op.catId != null ? working[op.catId] : null;
    if (!cat || typeof cat !== 'object') return { ok: false, error: 'no-category' };

    // U6 strukturne operacije (add/remove/reorder) — idempotentne (v. _struct*).
    if (spec.struct) {
      let arr = cat[spec.arrayKey];
      if (!Array.isArray(arr)) {
        if (spec.struct !== 'add') return { ok: false, error: 'no-array' };
        arr = cat[spec.arrayKey] = []; // add smije kreirati niz (prvi sadržaj u modu)
      }
      if (spec.struct === 'add') return _structAdd(arr, op);
      if (spec.struct === 'remove') return _structRemove(arr, op);
      return _structReorder(arr, op);
    }

    // update-ops (F4.3/4.4): apsolutne vrijednosti kroz patch.
    if (!op.patch || typeof op.patch !== 'object') return { ok: false, error: 'no-patch' };
    if (spec.arrayKey) {
      const arr = Array.isArray(cat[spec.arrayKey]) ? cat[spec.arrayKey] : null;
      if (!arr) return { ok: false, error: 'no-array' };
      const i = _findIndex(arr, op);
      if (i === -1) return { ok: false, error: 'not-found' };
      _assignPatch(arr[i], op.patch);
      return { ok: true };
    }
    // object-op (learn): kategorijin objekt; kreiraj ako ne postoji (learn je opcionalan u shemi)
    const obj = (cat[spec.objectKey] && typeof cat[spec.objectKey] === 'object') ? cat[spec.objectKey] : (cat[spec.objectKey] = {});
    _assignPatch(obj, op.patch);
    return { ok: true };
  }

  /** Object.assign s brisanjem: `null` vrijednost u patchu BRIŠE ključ (npr. prazan learn.title — schema nema prazne stringove). */
  function _assignPatch(target, patch) {
    Object.keys(patch).forEach(function (k) {
      if (patch[k] === null) delete target[k];
      else target[k] = patch[k];
    });
  }

  /* ---- U6 strukturne operacije (idempotentne po konstrukciji) -------------- */

  /** Kratki stabilni id (6-char, isti alfabet kao U2a `scripts/add-item-ids.js`) za NOVE stavke. */
  function _genId() {
    const A = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 6; i++) s += A.charAt((Math.random() * A.length) | 0);
    return s;
  }

  /** add: umetni KOPIJU op.item na op.at (default kraj). Idempotentno: ako id VEĆ postoji → no-op uspjeh.
   *  Id se fiksira JEDNOM na samom op-u (ako ga pozivatelj nije dao) → replay i sibling-sync koriste isti id. */
  function _structAdd(arr, op) {
    const item = op.item;
    if (!item || typeof item !== 'object') return { ok: false, error: 'no-item' };
    if (item.id == null) item.id = _genId();
    for (let i = 0; i < arr.length; i++) if (arr[i] && arr[i].id === item.id) return { ok: true };
    let at = Number.isInteger(op.at) ? op.at : arr.length;
    if (at < 0) at = 0; else if (at > arr.length) at = arr.length;
    arr.splice(at, 0, JSON.parse(JSON.stringify(item))); // KOPIJA → svaki red/sibling drži svoj objekt (bez aliasinga)
    return { ok: true };
  }

  /** remove: makni stavku po id (ili idx fallback). Idempotentno: nema je → no-op uspjeh. */
  function _structRemove(arr, op) {
    const i = _findIndex(arr, op);
    if (i === -1) return { ok: true };
    arr.splice(i, 1);
    return { ok: true };
  }

  /** reorder: apsolutni ciljni redoslijed po id-evima (op.order). Stavke koje order ne spominje (ili bez id-a)
   *  zadrže relativni redoslijed NA KRAJU → nedestruktivno + idempotentno (ista lista dvaput = isto). Mutira arr in-place (čuva referencu za siblinge). */
  function _structReorder(arr, op) {
    const order = Array.isArray(op.order) ? op.order : null;
    if (!order) return { ok: false, error: 'no-order' };
    const byId = {};
    for (let i = 0; i < arr.length; i++) { const it = arr[i]; if (it && it.id != null) byId[it.id] = it; }
    const out = [], seen = {};
    order.forEach(function (id) { if (byId[id] && !seen[id]) { out.push(byId[id]); seen[id] = 1; } });
    for (let i = 0; i < arr.length; i++) { const it = arr[i]; if (it && (it.id == null || !seen[it.id])) out.push(it); }
    arr.length = 0;
    Array.prototype.push.apply(arr, out);
    return { ok: true };
  }

  const SokratDraft = {
    /**
     * Otvori draft za (subject, lesson): original = netaknuta baza, working = radna kopija.
     * Ako postoji autosave S ISTOM bazom (fingerprint) → vrati radnu kopiju i opove (restored=true).
     * @param {string} subjectId @param {string} lessonId @param {string} varName
     * @param {any} data autoritativni payload lekcije (iz baze — read se radi u admin.js)
     * @param {number} [baseVersion] `subject_content.version` reda u trenutku dohvata — publish-RPC
     *   (U4) njime lovi tuđu izmjenu (optimistic concurrency). Uvijek iz SVJEŽEG fetcha, ne iz
     *   autosavea: fingerprint jamči isti sadržaj, a svježa verzija je istinita i kad se poklapaju.
     */
    begin(subjectId, lessonId, varName, data, baseVersion) {
      const baseFp = _fp(data);
      const d = {
        subjectId, lessonId, varName, baseFp,
        baseVersion: (baseVersion == null) ? null : baseVersion,
        original: _copy(data),
        working: _copy(data),
        ops: [], dirty: false, restored: false, startedAt: Date.now()
      };
      const saved = _autosaveRead(subjectId, lessonId);
      if (saved && saved.baseFp === baseFp && saved.working) {
        d.working = saved.working;
        d.ops = Array.isArray(saved.ops) ? saved.ops : [];
        d.dirty = d.ops.length > 0;
        d.restored = d.dirty;
      } else if (saved) {
        _autosaveClear(subjectId, lessonId); // baza se promijenila → autosave zastario
      }
      _drafts[_key(subjectId, lessonId)] = d;
      return d;
    },

    /** Aktivni draft ili null. */
    get(subjectId, lessonId) { return _drafts[_key(subjectId, lessonId)] || null; },

    isDirty(subjectId, lessonId) {
      const d = this.get(subjectId, lessonId);
      return !!(d && d.dirty);
    },

    /** Opovi primijenjeni od zadnje baze (za badge/publish/undo). */
    opsOf(subjectId, lessonId) {
      const d = this.get(subjectId, lessonId);
      return d ? d.ops.slice() : [];
    },

    /**
     * Primijeni imenovanu operaciju nad working kopijom drafta.
     * @param {string} subjectId @param {string} lessonId
     * @param {{type:string, catId:string, id?:string, idx?:number, patch:object}} op
     * @returns {{ok:boolean, error?:string}}
     */
    applyOp(subjectId, lessonId, op) {
      const d = this.get(subjectId, lessonId);
      if (!d) return { ok: false, error: 'no-draft' };
      const res = _dispatch(d.working, op);
      if (res.ok) {
        d.ops.push(op);
        d.dirty = true;
        _autosaveWrite(d);
      }
      return res;
    },

    /** „Odbaci" — baci radnu kopiju i autosave; baza/window-varovi nikad nisu ni dirnuti. */
    discard(subjectId, lessonId) {
      delete _drafts[_key(subjectId, lessonId)];
      _autosaveClear(subjectId, lessonId);
    },

    /**
     * Primijeni niz opova na PROIZVOLJAN payload (in-place) — za sync sestrinskih redova
     * pri objavi (`final` = kopija M1+M2 dijeli kategorije) i in-memory window-varova.
     * SVI opovi (update + U6 strukturne) su idempotentni po konstrukciji → smiju se primijeniti
     * i na već ažuriran objekt (add = guard po id · remove = no-op ako nema · reorder = apsolutni red).
     * Zato op-replay sibling-sync ostaje ispravan i za strukturne ops — publish-put se NE mijenja.
     * @returns {{applied:number, skipped:number}} skipped = kategorija/stavka ne postoji u tom payloadu (npr. examPractice-only red)
     */
    applyOpsTo(payload, ops) {
      let applied = 0, skipped = 0;
      (ops || []).forEach(function (op) {
        if (payload && _dispatch(payload, op).ok) applied++; else skipped++;
      });
      return { applied: applied, skipped: skipped };
    },

    /**
     * Nakon USPJEŠNE objave: nova baza = working (re-baseline), oplog i autosave se čiste.
     * @param {number} [newVersion] verzija koju je publish-RPC vratio — nova baza za idući publish
     */
    commitDone(subjectId, lessonId, newVersion) {
      const d = this.get(subjectId, lessonId);
      if (!d) return;
      d.original = _copy(d.working);
      d.baseFp = _fp(d.working);
      if (newVersion != null) d.baseVersion = newVersion;
      d.ops = [];
      d.dirty = false;
      d.restored = false;
      _autosaveClear(subjectId, lessonId);
    }
  };

  window.SokratDraft = SokratDraft;
})(typeof window !== 'undefined' ? window : this);
