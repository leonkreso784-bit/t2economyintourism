// ===== SOKRAT STUDY — F4: SLIKE OSOBNOG GRADIVA (privatni bucket + potpisani URL-ovi) =====
//
// Problem koji rješava (CREATE_BACKEND_SPEC §11, S1+S2): slike osobnog gradiva žive u PRIVATNOM
// bucketu `node-images` (owner-scoped RLS, putanja `<auth.uid()>/<node_id>/<uuid>.<ext>`). Privatan
// bucket nema javni URL — čita se samo POTPISANIM URL-om koji vrijedi ograničeno.
//
// ZAŠTO OVAJ MODUL POSTOJI (a ne diramo renderer):
//   • U payload se sprema STABILNA oznaka `node-img:<putanja>` — nikad potpisani URL. Potpis istječe;
//     da je u payloadu, objavljeni sadržaj bi „istrunuo", a draft-autosave u localStorage bi vratio
//     mrtve linkove. Oznaka je vječna.
//   • Potpisi se razrješavaju TEK PRI PRIKAZU, i to kod POZIVATELJA renderera (studio.js /
//     block-editor.js), pa `js/blocks-renderer.js` — sigurnosna granica — ostaje NEDIRNUT.
//   • Objava ne treba obrnutu pretvorbu: `working` cijelo vrijeme drži oznake.
//
// Fail-safe: nerazriješena oznaka ostaje `node-img:…`, a `safeUrl` u rendereru odbija nepoznatu
// shemu → slika se IZOSTAVI (nikad polomljen `<img>`, nikad injektiran URL).
//
// SokratAuth = leksički global (auth.js prije nas) → referenca GOLO uz typeof-guard (CLAUDE GOTCHA).

(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  var BUCKET = 'node-images';
  var MARKER = 'node-img:';
  var EXPIRES = 8 * 60 * 60;              // 8 h — dulje od svake razumne uređivačke sesije

  var _cache = Object.create(null);        // putanja → potpisani URL (samo u memoriji; ne perzistira)

  function isMarker(src) {
    return typeof src === 'string' && src.lastIndexOf(MARKER, 0) === 0;
  }
  function pathOf(src) {
    return isMarker(src) ? src.slice(MARKER.length) : '';
  }
  function marker(path) { return MARKER + path; }

  /** Putanja novog uploada: `<uid>/<node_id>/<uuid>.<ext>`. Prvi segment = vlasnik (RLS ga provjerava). */
  function newPath(uid, nodeId, ext) {
    var uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
    return String(uid) + '/' + String(nodeId) + '/' + uuid + '.' + ext;
  }

  /** Skupi sve `node-img:` putanje iz payloada (dubinski — ne pretpostavlja oblik sekcije). */
  function collectPaths(value, out) {
    out = out || [];
    if (!value || typeof value !== 'object') return out;
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) collectPaths(value[i], out);
      return out;
    }
    if (value.type === 'image' && isMarker(value.src)) {
      var p = pathOf(value.src);
      if (p && out.indexOf(p) === -1) out.push(p);
    }
    for (var k in value) {
      if (Object.prototype.hasOwnProperty.call(value, k)) {
        var v = value[k];
        if (v && typeof v === 'object') collectPaths(v, out);
      }
    }
    return out;
  }

  function client() {
    if (typeof SokratAuth === 'undefined' || !SokratAuth || typeof SokratAuth.getClient !== 'function') return null;
    var c = SokratAuth.getClient();
    return (c && c.storage) ? c : null;
  }

  /**
   * Potpiši sve nepoznate oznake iz payloada i napuni cache. NIKAD ne baca — prikaz bez slike je
   * prihvatljiv ishod, rušenje otvaranja čvora nije.
   * @returns {Promise<number>} koliko je putanja novo-potpisano
   */
  function prefetch(payload) {
    var paths = collectPaths(payload).filter(function (p) { return !_cache[p]; });
    if (!paths.length) return Promise.resolve(0);
    var c = client();
    if (!c) return Promise.resolve(0);
    return c.storage.from(BUCKET).createSignedUrls(paths, EXPIRES)
      .then(function (res) {
        if (!res || res.error || !Array.isArray(res.data)) return 0;
        var n = 0;
        res.data.forEach(function (row) {
          if (row && row.path && row.signedUrl && !row.error) { _cache[row.path] = row.signedUrl; n++; }
        });
        return n;
      })
      .catch(function () { return 0; });
  }

  /** Zapamti potpis odmah nakon uploada (bez još jednog kruga prema Storageu). */
  function note(path, signedUrl) {
    if (path && signedUrl) _cache[path] = signedUrl;
  }

  /** Potpiši JEDNU putanju (koristi se odmah nakon uploada). → Promise<string|null> */
  function sign(path) {
    if (_cache[path]) return Promise.resolve(_cache[path]);
    var c = client();
    if (!c) return Promise.resolve(null);
    return c.storage.from(BUCKET).createSignedUrl(path, EXPIRES)
      .then(function (res) {
        var url = res && res.data && res.data.signedUrl;
        if (url) { _cache[path] = url; return url; }
        return null;
      })
      .catch(function () { return null; });
  }

  /** Blok s razriješenim `src` (KOPIJA — original s oznakom ostaje netaknut). */
  function resolveBlock(b) {
    if (!b || b.type !== 'image' || !isMarker(b.src)) return b;
    var url = _cache[pathOf(b.src)];
    if (!url) return b;                                  // nerazriješeno → renderer fail-safe izostavi
    var copy = {};
    for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) copy[k] = b[k];
    copy.src = url;
    return copy;
  }

  /** Niz blokova s razriješenim slikama. Vrati ISTI niz ako nema što mijenjati (bez suvišnih kopija). */
  function resolveBlocks(blocks) {
    if (!Array.isArray(blocks)) return blocks;
    var touched = false;
    var out = blocks.map(function (b) {
      var r = resolveBlock(b);
      if (r !== b) touched = true;
      return r;
    });
    return touched ? out : blocks;
  }

  /** Isprazni cache (izlaz iz čvora / odjava) — potpisi ne smiju preživjeti promjenu identiteta. */
  function clear() { _cache = Object.create(null); }

  window.SokratNodeImages = {
    BUCKET: BUCKET,
    MARKER: MARKER,
    isMarker: isMarker,
    pathOf: pathOf,
    marker: marker,
    newPath: newPath,
    collectPaths: collectPaths,
    prefetch: prefetch,
    sign: sign,
    note: note,
    resolveBlock: resolveBlock,
    resolveBlocks: resolveBlocks,
    clear: clear,
  };
})();
