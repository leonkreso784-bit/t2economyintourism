// ===== SOKRAT STUDY — F2/2: SLIKE PROFILA (javan bucket `profile-images` + RPC `set_profile_image`) =====
//
// Što radi: profilna slika (avatar) i naslovna (cover) — odabir u pregledniku, SMANJIVANJE PRIJE
// uploada, upload u vlastiti prefiks, upis putanje kroz RPC, brisanje stare slike.
//
// ZAŠTO JE OVAKO (odluke Leon 2026-09-09, RASPORED §F2/2; sigurnosni model u `supabase/f2-profile-images.sql`):
//   • Bucket je JAVAN → slika se crta običnim URL-om (`getPublicUrl`), bez potpisa i bez kruga prema
//     bazi; CDN ju kešira. Ime datoteke nosi UUID pa je URL nepogodiv, a nakon zamjene STARA se briše.
//   • Smanjuje se U PREGLEDNIKU (avatar ≤ 512 px, naslovna ≤ 1500 px, WebP): fotka s iPhonea ima
//     3–8 MB i HEIC nije među dopuštenim tipovima. Preglednik ju dekodira (iOS HEIC → JPEG pri
//     odabiru), mi ju ponovno kodiramo → na server ide 30–200 KB u tipu koji bucket propušta.
//     Kad preglednik ne zna kodirati WebP, pada se na JPEG — bucket propušta oboje.
//   • Putanja `<uid>/<vrsta>/<uuid>.<ext>`: prvi segment presuđuje RLS (vlasnik), drugi presuđuje RPC
//     (vrsta), pa se avatar ne može podmetnuti kao naslovna ni obrnuto.
//   • U bazu ide PUTANJA, nikad URL (isto kao `node-img:` oznaka u `js/node-images.js`): URL ovisi o
//     projektu (staging/prod) i o domeni, putanja ne.
//   • Ovaj modul NE crta ništa i NE zna za i18n — vraća red / baca `Error` s KODOM (`auth_required`,
//     `image_kind_invalid`, `image_decode_failed`, poruka Storagea/RPC-a). Tekst za korisnika i
//     toast su posao `js/profile.js` (cigla 3), da tekst ostane na jednom mjestu (check:i18n).
//
// SokratAuth = leksički global (auth.js prije nas) → referenca GOLO uz typeof-guard (CLAUDE GOTCHA).

(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  var BUCKET = 'profile-images';
  /** Najdulja stranica po vrsti (px). Brojke iz RASPORED §F2/2. */
  var KINDS = { avatar: { max: 512 }, cover: { max: 1500 } };
  var QUALITY = 0.85;
  /** Što `<input type=file>` nudi. Bez SVG-a (skripte) i bez GIF-a (avatar se ne miče) — isto kao bucket. */
  var ACCEPT = 'image/png,image/jpeg,image/webp';
  /** UUID u imenu = datoteka je NEPROMJENJIVA → smije se keširati godinu dana (Storage `cacheControl` = sekunde). */
  var CACHE_SECONDS = 31536000;

  function isKind(kind) { return Object.prototype.hasOwnProperty.call(KINDS, kind); }

  /**
   * Dimenzije koje stanu u kvadrat `max` uz očuvan omjer. NIKAD ne povećava (mala slika ostaje mala),
   * nikad ispod 1 px. Čista funkcija — mjeri ju unit test.
   * @param {number} w @param {number} h @param {number} max
   * @returns {{ w: number, h: number }}
   */
  function fitDims(w, h, max) {
    w = Math.max(1, Math.round(Number(w) || 0));
    h = Math.max(1, Math.round(Number(h) || 0));
    var longest = Math.max(w, h);
    if (!(max > 0) || longest <= max) return { w: w, h: h };
    var k = max / longest;
    return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
  }

  /** `<uid>/<vrsta>/<uuid>.<ext>` — prvi segment = vlasnik (RLS), drugi = vrsta (RPC). */
  function newPath(uid, kind, ext) {
    var uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
    return String(uid) + '/' + String(kind) + '/' + uuid + '.' + String(ext || 'webp');
  }

  function segments(path) { return (typeof path === 'string' && path) ? path.split('/') : []; }
  /** Vlasnik iz putanje (prvi segment) ili ''. */
  function ownerOf(path) { return segments(path)[0] || ''; }
  /** Vrsta iz putanje (drugi segment) ako je poznata, inače null. */
  function kindOf(path) { var k = segments(path)[1]; return isKind(k) ? k : null; }

  function client() {
    if (typeof SokratAuth === 'undefined' || !SokratAuth || typeof SokratAuth.getClient !== 'function') return null;
    var c = SokratAuth.getClient();
    return (c && c.storage) ? c : null;
  }
  function currentUid() {
    if (typeof SokratAuth === 'undefined' || !SokratAuth || typeof SokratAuth.getUser !== 'function') return null;
    var u = SokratAuth.getUser();
    return (u && u.id) ? u.id : null;
  }

  /** Javni URL za putanju iz baze (ili null bez klijenta / bez putanje). Bez mreže — samo string. */
  function publicUrl(path) {
    if (!path || typeof path !== 'string') return null;
    var c = client();
    if (!c) return null;
    var res = c.storage.from(BUCKET).getPublicUrl(path);
    return (res && res.data && res.data.publicUrl) ? res.data.publicUrl : null;
  }

  /** Dekodiraj datoteku u bitmapu; `createImageBitmap` poštuje EXIF-orijentaciju (fotke s telefona). */
  function decode(file) {
    if (typeof createImageBitmap === 'function') {
      return createImageBitmap(file, { imageOrientation: 'from-image' })
        .catch(function () { return decodeViaImg(file); });
    }
    return decodeViaImg(file);
  }
  function decodeViaImg(file) {
    return new Promise(function (resolve, reject) {
      var url;
      try { url = URL.createObjectURL(file); } catch (e) { reject(new Error('image_decode_failed')); return; }
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('image_decode_failed')); };
      img.src = url;
    });
  }
  function toBlob(canvas, type, quality) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, type, quality); });
  }

  /**
   * Smanji sliku za zadanu vrstu i kodiraj ju u WebP (ili JPEG kad preglednik WebP ne zna).
   * @param {Blob} file
   * @param {string} kind
   * @returns {Promise<{ blob: Blob, ext: string, type: string, width: number, height: number }>}
   */
  function smanji(file, kind) {
    if (!isKind(kind)) return Promise.reject(new Error('image_kind_invalid'));
    // Samo pravi Blob/File: sve drugo bi `createObjectURL` oborio SIROVIM TypeErrorom, a pozivatelj
    // (cigla 3) razlikuje greške po KODU, ne po tekstu preglednika.
    if (!file || typeof file !== 'object' || (typeof Blob !== 'undefined' && !(file instanceof Blob))) {
      return Promise.reject(new Error('image_decode_failed'));
    }
    return decode(file).then(function (bmp) {
      var src = { w: bmp.naturalWidth || bmp.width, h: bmp.naturalHeight || bmp.height };
      var d = fitDims(src.w, src.h, KINDS[kind].max);
      var canvas = document.createElement('canvas');
      canvas.width = d.w; canvas.height = d.h;
      var ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('image_decode_failed');
      ctx.drawImage(bmp, 0, 0, d.w, d.h);
      if (typeof bmp.close === 'function') bmp.close();
      return toBlob(canvas, 'image/webp', QUALITY).then(function (blob) {
        if (blob && blob.type === 'image/webp') return { blob: blob, ext: 'webp', type: 'image/webp', width: d.w, height: d.h };
        // Preglednik ne kodira WebP (stariji Safari) → JPEG; bucket ga propušta.
        return toBlob(canvas, 'image/jpeg', QUALITY).then(function (jpg) {
          if (!jpg) throw new Error('image_decode_failed');
          return { blob: jpg, ext: 'jpg', type: 'image/jpeg', width: d.w, height: d.h };
        });
      });
    });
  }

  /** Obriši stari objekt ako je NAŠ i nije upravo upisani. Tiho — brisanje stare nije uvjet uspjeha. */
  function removeOld(c, uid, oldPath, keepPath) {
    if (!oldPath || oldPath === keepPath || ownerOf(oldPath) !== uid) return Promise.resolve(false);
    return c.storage.from(BUCKET).remove([oldPath])
      .then(function (res) { return !(res && res.error); })
      .catch(function () { return false; });
  }

  /**
   * Cijeli tijek: smanji → upload u vlastiti prefiks → RPC upiše putanju → obriši staru.
   * @param {string} kind  'avatar' | 'cover'
   * @param {Blob} file
   * @param {{ oldPath?: string|null }} [opts]  putanja koja se zamjenjuje (iz reda identiteta)
   * @returns {Promise<any>} upisani red `profile_identity`
   */
  function upload(kind, file, opts) {
    if (!isKind(kind)) return Promise.reject(new Error('image_kind_invalid'));
    var c = client();
    var uid = currentUid();
    if (!c || !uid) return Promise.reject(new Error('auth_required'));
    var oldPath = (opts && opts.oldPath) || null;
    var path;
    return smanji(file, kind).then(function (out) {
      path = newPath(uid, kind, out.ext);
      return c.storage.from(BUCKET).upload(path, out.blob, {
        contentType: out.type, upsert: false, cacheControl: String(CACHE_SECONDS)
      });
    }).then(function (res) {
      if (res && res.error) throw new Error(res.error.message || 'upload_failed');
      return c.rpc('set_profile_image', { p_kind: kind, p_path: path });
    }).then(function (res) {
      if (res && res.error) {
        // RPC odbio → upload je siroče; počisti ga pa tek onda javi grešku.
        return c.storage.from(BUCKET).remove([path]).catch(function () { /* najbolji pokušaj */ })
          .then(function () { throw new Error(res.error.message || 'rpc_failed'); });
      }
      var row = res ? res.data : null;
      return removeOld(c, uid, oldPath, path).then(function () { return row; });
    });
  }

  /**
   * Makni sliku: RPC upiše NULL, pa se objekt obriše.
   * @param {string} kind @param {string|null} oldPath
   * @returns {Promise<any>} upisani red
   */
  function remove(kind, oldPath) {
    if (!isKind(kind)) return Promise.reject(new Error('image_kind_invalid'));
    var c = client();
    var uid = currentUid();
    if (!c || !uid) return Promise.reject(new Error('auth_required'));
    return c.rpc('set_profile_image', { p_kind: kind, p_path: null }).then(function (res) {
      if (res && res.error) throw new Error(res.error.message || 'rpc_failed');
      var row = res ? res.data : null;
      return removeOld(c, uid, oldPath, null).then(function () { return row; });
    });
  }

  /**
   * Otvori sustavski birač datoteka; razriješi se datotekom ili `null` (odustao).
   * @returns {Promise<File|null>}
   */
  function pick() {
    return new Promise(function (resolve) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = ACCEPT;
      input.hidden = true;
      // iOS: `capture` NE postavljamo — korisnik bira između kamere i galerije sam.
      input.addEventListener('change', function () {
        var f = (input.files && input.files[0]) || null;
        input.remove();
        resolve(f);
      });
      // Zatvaranje bez izbora ne baca `change`; `cancel` je noviji događaj, pa je čuvan.
      input.addEventListener('cancel', function () { input.remove(); resolve(null); });
      document.body.appendChild(input);
      input.click();
    });
  }

  window.SokratProfileImages = {
    BUCKET: BUCKET,
    KINDS: KINDS,
    ACCEPT: ACCEPT,
    fitDims: fitDims,
    newPath: newPath,
    ownerOf: ownerOf,
    kindOf: kindOf,
    publicUrl: publicUrl,
    smanji: smanji,
    upload: upload,
    remove: remove,
    pick: pick
  };
})();
