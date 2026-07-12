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
   * update-ops za 4 postojeća editora (F4.3/F4.4). U6 dodaje add/remove/reorder.
   * arrayKey-ops ciljaju stavku niza; object-ops cijeli objekt kategorije. */
  const OPS = {
    updateCard:  { arrayKey: 'flashcards' },
    updateQuiz:  { arrayKey: 'quiz' },
    updateFill:  { arrayKey: 'fillBlanks' },
    updateLearn: { objectKey: 'learn' }
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

  const SokratDraft = {
    /**
     * Otvori draft za (subject, lesson): original = netaknuta baza, working = radna kopija.
     * Ako postoji autosave S ISTOM bazom (fingerprint) → vrati radnu kopiju i opove (restored=true).
     * @param {string} subjectId @param {string} lessonId @param {string} varName
     * @param {any} data autoritativni payload lekcije (iz baze — read se radi u admin.js)
     */
    begin(subjectId, lessonId, varName, data) {
      const baseFp = _fp(data);
      const d = {
        subjectId, lessonId, varName, baseFp,
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
     * Update-opovi su idempotentni (apsolutne vrijednosti) → smije se primijeniti i na
     * već ažuriran objekt. ⚠ add/remove/reorder (U6) NEĆE biti idempotentni — tada sibling
     * sync prelazi na server (U4 publish-RPC to ionako preuzima).
     * @returns {{applied:number, skipped:number}} skipped = kategorija/stavka ne postoji u tom payloadu (npr. examPractice-only red)
     */
    applyOpsTo(payload, ops) {
      let applied = 0, skipped = 0;
      (ops || []).forEach(function (op) {
        if (payload && _dispatch(payload, op).ok) applied++; else skipped++;
      });
      return { applied: applied, skipped: skipped };
    },

    /** Nakon USPJEŠNE objave: nova baza = working (re-baseline), oplog i autosave se čiste. */
    commitDone(subjectId, lessonId) {
      const d = this.get(subjectId, lessonId);
      if (!d) return;
      d.original = _copy(d.working);
      d.baseFp = _fp(d.working);
      d.ops = [];
      d.dirty = false;
      d.restored = false;
      _autosaveClear(subjectId, lessonId);
    }
  };

  window.SokratDraft = SokratDraft;
})(typeof window !== 'undefined' ? window : this);
