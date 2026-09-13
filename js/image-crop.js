// ===== SOKRAT STUDY — IZREZ SLIKE (F2/2 dopuna, Leon 2026-09-13: „treba biti da se bira crop") =====
//
// Modal u kojem korisnik POMIČE i ZUMIRA sliku unutar okvira zadanog omjera (avatar 1:1 krug,
// naslovna 3:1) i sprema točno taj isječak. Bez knjižnice: okvir + <canvas> s transformacijom,
// pointer-događaji za povlačenje, klizač i kotačić/štipanje za zum.
//
// ZAŠTO OVAKO:
//   • Facebook-obrazac (Leon): slika se ne „smanjuje na oko" nego korisnik bira ŠTO ostaje.
//   • Matematika izreza je ČISTA i izdvojena (`baseScale` · `clampOffset` · `sourceRect`) pa ju
//     mjeri unit test bez preglednika; DOM-dio samo zove te tri funkcije.
//   • Izlaz je PNG (bez gubitka) točnih ciljnih dimenzija → `js/profile-images.js` ga jednom
//     kodira u WebP. Da cropper sam kodira WebP, slika bi prošla dva gubitna koraka.
//   • Overlay je <sokrat-modal> (ESC, backdrop, fokus-zamka, zaključan skrol) — ne gradimo drugi.
//   • Tekst ide kroz `t()` s rezervom (isti obrazac kao `pt` u profile.js); sve ostalo bez i18n-a.
//
// API: `SokratImageCrop.open(file, { aspect, output: {w,h}, round, title }) → Promise<Blob|null>`
//      null = korisnik odustao. Baca `Error('image_decode_failed')` kad se datoteka ne da dekodirati.

(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  var ZOOM_MIN = 1, ZOOM_MAX = 4;

  function ct(key, fb) {
    if (!window.t) return fb;
    var v = window.t(key);
    return (v === key) ? fb : v;
  }

  // ── ČISTA MATEMATIKA ────────────────────────────────────────────────────────
  /** Najmanja skala pri kojoj slika POKRIVA okvir (cover). */
  function baseScale(frameW, frameH, imgW, imgH) {
    if (!(imgW > 0) || !(imgH > 0)) return 1;
    return Math.max(frameW / imgW, frameH / imgH);
  }
  /**
   * Zadrži sliku preko cijelog okvira: gornji-lijevi kut (tx,ty) smije biti između
   * `frame - img*s` (desni/donji rub na rubu okvira) i 0 (lijevi/gornji rub na rubu okvira).
   */
  function clampOffset(tx, ty, frameW, frameH, imgW, imgH, s) {
    var w = imgW * s, h = imgH * s;
    var minX = Math.min(0, frameW - w), minY = Math.min(0, frameH - h);
    return { tx: Math.min(0, Math.max(minX, tx)), ty: Math.min(0, Math.max(minY, ty)) };
  }
  /** Pravokutnik u IZVORNOJ slici koji okvir trenutno pokazuje. */
  function sourceRect(tx, ty, frameW, frameH, s) {
    return { sx: -tx / s, sy: -ty / s, sw: frameW / s, sh: frameH / s };
  }
  /** Novi pomak pri promjeni zuma tako da TOČKA (px,py) u okviru ostane na istom pikselu slike. */
  function rezoom(tx, ty, sOld, sNew, px, py) {
    var k = sNew / sOld;
    return { tx: px - (px - tx) * k, ty: py - (py - ty) * k };
  }

  // ── DEKODIRANJE ─────────────────────────────────────────────────────────────
  function decode(file) {
    if (!file || typeof file !== 'object' || (typeof Blob !== 'undefined' && !(file instanceof Blob))) {
      return Promise.reject(new Error('image_decode_failed'));
    }
    var viaImg = function () {
      return new Promise(function (resolve, reject) {
        var url;
        try { url = URL.createObjectURL(file); } catch (e) { reject(new Error('image_decode_failed')); return; }
        var img = new Image();
        img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('image_decode_failed')); };
        img.src = url;
      });
    };
    if (typeof createImageBitmap === 'function') {
      return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(viaImg);
    }
    return viaImg();
  }

  // ── MODAL ───────────────────────────────────────────────────────────────────
  function ensureModal() {
    var m = document.getElementById('imageCropModal');
    if (m) return m;
    m = document.createElement('sokrat-modal');
    m.id = 'imageCropModal';
    m.className = 'crop';
    m.setAttribute('aria-labelledby', 'imageCropTitle');
    m.innerHTML =
      '<div class="crop__card">' +
      '  <h3 id="imageCropTitle" class="crop__title"></h3>' +
      '  <div class="crop__frame" id="imageCropFrame"><canvas class="crop__canvas" id="imageCropCanvas"></canvas></div>' +
      '  <p class="crop__hint profile-meta">' + ct('profile.cropHint', 'Drag to reposition, zoom with the slider.') + '</p>' +
      '  <label class="crop__zoom"><span>' + ct('profile.cropZoom', 'Zoom') + '</span>' +
      '    <input type="range" id="imageCropZoom" min="' + ZOOM_MIN + '" max="' + ZOOM_MAX + '" step="0.01" value="1"></label>' +
      '  <div class="crop__actions">' +
      '    <button type="button" class="cta-button secondary" id="imageCropCancel"><i class="fas fa-xmark"></i><span>' + ct('profile.editCancel', 'Cancel') + '</span></button>' +
      '    <button type="button" class="cta-button primary" id="imageCropSave"><i class="fas fa-check"></i><span>' + ct('profile.editSave', 'Save') + '</span></button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(m);
    return m;
  }

  /**
   * @param {Blob} file
   * @param {{ aspect: number, output: { w: number, h: number }, round?: boolean, title?: string }} opts
   * @returns {Promise<Blob|null>}
   */
  function open(file, opts) {
    opts = opts || {};
    var aspect = opts.aspect > 0 ? opts.aspect : 1;
    var out = opts.output || { w: 512, h: Math.round(512 / aspect) };
    return decode(file).then(function (bmp) {
      return new Promise(function (resolve) {
        var m = ensureModal();
        var frame = m.querySelector('#imageCropFrame');
        var canvas = m.querySelector('#imageCropCanvas');
        var zoom = m.querySelector('#imageCropZoom');
        var title = m.querySelector('#imageCropTitle');
        title.textContent = opts.title || '';
        frame.style.aspectRatio = String(aspect);
        frame.classList.toggle('crop__frame--round', !!opts.round);

        var imgW = bmp.naturalWidth || bmp.width, imgH = bmp.naturalHeight || bmp.height;
        canvas.width = imgW; canvas.height = imgH;
        canvas.getContext('2d').drawImage(bmp, 0, 0);
        if (typeof bmp.close === 'function') bmp.close();

        var fw = 0, fh = 0, s0 = 1, z = 1, tx = 0, ty = 0;
        function measure() {
          var r = frame.getBoundingClientRect();
          fw = r.width; fh = r.height;
          s0 = baseScale(fw, fh, imgW, imgH);
        }
        function scale() { return s0 * z; }
        function apply() {
          var c = clampOffset(tx, ty, fw, fh, imgW, imgH, scale());
          tx = c.tx; ty = c.ty;
          canvas.style.width = (imgW * scale()) + 'px';
          canvas.style.height = (imgH * scale()) + 'px';
          canvas.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
        }
        function center() {
          measure();
          z = 1; zoom.value = '1';
          tx = (fw - imgW * scale()) / 2; ty = (fh - imgH * scale()) / 2;
          apply();
        }
        function setZoom(zNew, px, py) {
          zNew = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zNew));
          var sOld = scale();
          z = zNew;
          var r = rezoom(tx, ty, sOld, scale(), px == null ? fw / 2 : px, py == null ? fh / 2 : py);
          tx = r.tx; ty = r.ty;
          zoom.value = String(z);
          apply();
        }

        // ── povlačenje (jedan pokazivač) + štipanje (dva) ──
        var pts = {};
        var last = null, pinch = null;
        function onDown(e) {
          frame.setPointerCapture(e.pointerId);
          pts[e.pointerId] = { x: e.clientX, y: e.clientY };
          var ids = Object.keys(pts);
          if (ids.length === 1) last = { x: e.clientX, y: e.clientY };
          if (ids.length === 2) {
            var a = pts[ids[0]], b = pts[ids[1]];
            pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: z };
            last = null;
          }
          e.preventDefault();
        }
        function onMove(e) {
          if (!pts[e.pointerId]) return;
          pts[e.pointerId] = { x: e.clientX, y: e.clientY };
          var ids = Object.keys(pts);
          if (ids.length === 2 && pinch) {
            var a = pts[ids[0]], b = pts[ids[1]];
            var d = Math.hypot(a.x - b.x, a.y - b.y);
            var r = frame.getBoundingClientRect();
            setZoom(pinch.z * (d / pinch.d), (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
          } else if (last) {
            tx += e.clientX - last.x; ty += e.clientY - last.y;
            last = { x: e.clientX, y: e.clientY };
            apply();
          }
          e.preventDefault();
        }
        function onUp(e) {
          delete pts[e.pointerId];
          var ids = Object.keys(pts);
          pinch = null;
          last = ids.length === 1 ? pts[ids[0]] : null;
        }
        function onWheel(e) {
          var r = frame.getBoundingClientRect();
          setZoom(z * (e.deltaY < 0 ? 1.1 : 0.9), e.clientX - r.left, e.clientY - r.top);
          e.preventDefault();
        }
        function onZoomInput() { setZoom(parseFloat(zoom.value)); }
        function onResize() { var sOld = scale(); measure(); var k = scale() / sOld; tx *= k; ty *= k; apply(); }

        function finish(blob) {
          frame.removeEventListener('pointerdown', onDown);
          frame.removeEventListener('pointermove', onMove);
          frame.removeEventListener('pointerup', onUp);
          frame.removeEventListener('pointercancel', onUp);
          frame.removeEventListener('wheel', onWheel);
          zoom.removeEventListener('input', onZoomInput);
          window.removeEventListener('resize', onResize);
          m.removeEventListener('sokrat-modal:close', onClose);
          save.removeEventListener('click', onSave);
          cancel.removeEventListener('click', onCancel);
          if (m.isOpen()) m.close();
          resolve(blob);
        }
        function onClose() { finish(null); }
        function onCancel() { finish(null); }
        function onSave() {
          var s = scale();
          var src = sourceRect(tx, ty, fw, fh, s);
          var oc = document.createElement('canvas');
          oc.width = out.w; oc.height = out.h;
          oc.getContext('2d').drawImage(canvas, src.sx, src.sy, src.sw, src.sh, 0, 0, out.w, out.h);
          oc.toBlob(function (blob) { finish(blob || null); }, 'image/png');
        }
        var save = m.querySelector('#imageCropSave');
        var cancel = m.querySelector('#imageCropCancel');

        frame.addEventListener('pointerdown', onDown);
        frame.addEventListener('pointermove', onMove);
        frame.addEventListener('pointerup', onUp);
        frame.addEventListener('pointercancel', onUp);
        frame.addEventListener('wheel', onWheel, { passive: false });
        zoom.addEventListener('input', onZoomInput);
        window.addEventListener('resize', onResize);
        m.addEventListener('sokrat-modal:close', onClose);
        save.addEventListener('click', onSave);
        cancel.addEventListener('click', onCancel);

        m.open();
        // Okvir dobiva mjere tek kad je vidljiv (modal je `visibility: hidden` dok je zatvoren).
        requestAnimationFrame(center);
      });
    });
  }

  window.SokratImageCrop = {
    open: open,
    baseScale: baseScale,
    clampOffset: clampOffset,
    sourceRect: sourceRect,
    rezoom: rezoom,
    ZOOM_MIN: ZOOM_MIN,
    ZOOM_MAX: ZOOM_MAX
  };
})();
