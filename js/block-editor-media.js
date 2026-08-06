// ===== SOKRAT STUDY — BLOCK EDITOR: MEDIA / STRUKTURNI BLOKOVI (U8.5 + U8.9) =====
//
// Izdvojeno iz js/block-editor.js (T1 rez — risk-sanacija #6, da jezgra ostane ispod ~praga i
// održiva). Ne-tekstualni blokovi = forma-polja + živi preview kroz JEDAN renderer:
//   slika (U8.5a) · video (U8.5b) · formula (U8.5c, KaTeX preko renderMath) · tablica (U8.5d, 2D grid)
//   + MathLive math-tipkovnica (U8.9, SAMO autorska strana, lijeno).
// Autor NIKAD ne piše HTML — samo vrijednosti polja (src/alt/tex/ćelije…) koje renderer escapa/sanitizira.
//
// UČITAVA SE PRIJE js/block-editor.js. Izlaže TVORNICU `window.__beMedia(core)` → objekt media-funkcija
// koje jezgra koristi; `core = { esc, preview }` = dijeljeni helperi jezgre (preview = JEDAN renderer).
// Node-testovi učitavaju oba fajla u ISTI `window` (isti obrazac kao browser).

(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  window.__beMedia = function (core) {
    const esc = core.esc;
    const preview = core.preview;                          // JEDAN renderer (sigurnosna granica) iz jezgre

    // ── ne-tekstualni (media) blok: plain-text pomoćnik + polja-forma (U8.5) ──
    function inlineToPlain(inline) {                        // inline (string/runs) → plain string za <input>
      if (inline == null) return '';
      if (typeof inline === 'string') return inline;
      if (Array.isArray(inline)) return inline.map(function (r) { return typeof r === 'string' ? r : (r && r.text) || ''; }).join('');
      return String((inline && inline.text) || '');
    }
    function mField(name, ph, val) {
      return '<input type="text" class="be-mfield" data-be-mfield="' + name + '" placeholder="' + esc(ph) + '" value="' + esc(val == null ? '' : val) + '">';
    }
    function imagePreviewHtml(block) {                       // preview kroz JEDAN renderer, ili placeholder ako nema src
      if (!(block && block.src && String(block.src))) return '<div class="be-media__ph">Zalijepi URL slike ↓</div>';
      // U8.5e: resize-ručka + %-badge žive UNUTAR previewa (prežive preview-only osvježenje na change).
      const w = Math.round(Number(block.width));
      const wl = (isFinite(w) && w >= 10 && w <= 99) ? w : 100;
      return preview(block) +
        '<button type="button" class="be-imgresize" data-be-imgresize title="Povuci za širinu slike" aria-label="Promijeni širinu slike">⇲</button>' +
        '<span class="be-imgw" data-be-imgw>' + wl + '%</span>';
    }
    function mediaImageBody(block) {
      return '<div class="be-media be-media--image">' +
        '<div class="be-media__preview">' + imagePreviewHtml(block) + '</div>' +
        '<div class="be-media__fields">' +
          // U8.7: pravi upload (file-picker + drop-zona) → Storage → URL u block.src. Cijela zona = drop-meta.
          //   Nema URL-paste polja (Leonov zahtjev): normalan tok = klik „Odaberi" otvori datoteke/galeriju
          //   ili povuci sliku. `src` = skriveni nosač (upload ga puni + okine `change` = postojeći save-put).
          '<div class="be-upload" data-be-upload>' +
            '<input type="file" class="be-upload__file" data-be-imgfile accept="image/png,image/jpeg,image/webp,image/gif">' +
            '<button type="button" class="be-upload__btn" data-be-imgpick>📁 Odaberi sliku</button>' +
            '<span class="be-upload__hint">ili povuci sliku ovamo</span>' +
            '<span class="be-upload__status" data-be-imgstatus aria-live="polite"></span>' +
          '</div>' +
          '<input type="hidden" data-be-mfield="src" value="' + esc(block.src == null ? '' : block.src) + '">' +
          mField('alt', 'Opis za pristupačnost (alt)', block.alt) +
          mField('caption', 'Naslov ispod (opcionalno)', inlineToPlain(block.caption)) +
        '</div></div>';
    }
    // ── U8.7 upload: klijent (admin JWT) → Storage bucket → public URL. Bez /api / Edge / service_role
    //    (ADR-011). Validacija (tip/veličina) je klijentska UDOBNOST; bucket to nameće i server-side.
    //    SokratAuth = leksički global (auth.js prije nas) → referenca GOLO uz typeof-guard (CLAUDE GOTCHA).
    //
    //    F4: DVA ODREDIŠTA, ovisno o tome što se uređuje (v. js/node-images.js):
    //      • KATALOG (predmet/lekcija) → `lesson-images`, javan, admin-only  — NEDIRNUTO.
    //      • OSOBNO GRADIVO (study-čvor) → `node-images`, PRIVATAN, vlasnički prefiks; u payload ide
    //        oznaka `node-img:<putanja>`, a potpisani URL se traži tek pri prikazu.
    const UPLOAD_BUCKET = 'lesson-images';
    const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;              // 5 MB (= bucket file_size_limit)
    const UPLOAD_EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
    function validateImageFile(file) {                     // sinkroni validator → null ako OK, inače ljudska poruka
      if (!file) return 'Nema datoteke.';
      if (!UPLOAD_EXT[file.type]) return 'Dopušteni formati: PNG, JPG, WEBP, GIF.';  // SVG odbijen (može nositi skripte)
      if (file.size > UPLOAD_MAX_BYTES) return 'Slika je prevelika (max 5 MB).';
      return null;
    }
    function uploadImage(file) {                            // → Promise<string publicUrl>; baca Error s ljudskom porukom
      return new Promise(function (resolve, reject) {
        const verr = validateImageFile(file);
        if (verr) { reject(new Error(verr)); return; }
        const ext = UPLOAD_EXT[file.type];
        if (typeof SokratAuth === 'undefined' || !SokratAuth || typeof SokratAuth.getClient !== 'function') {
          reject(new Error('Prijava nije spremna — uloguj se pa pokušaj ponovno.')); return;
        }
        const client = SokratAuth.getClient();
        if (!client || !client.storage) { reject(new Error('Prijavi se za upload slike.')); return; }

        // F4 · osobno gradivo: privatan bucket, putanja pod vlasnikom, u payload OZNAKA (ne potpis).
        const NI = window.SokratNodeImages;
        const nodeCtx = (window.SokratAdmin && SokratAdmin.studioBridge
          && typeof SokratAdmin.studioBridge.nodeCtx === 'function')
          ? SokratAdmin.studioBridge.nodeCtx() : null;
        const me = (typeof SokratAuth.getUser === 'function') ? SokratAuth.getUser() : null;
        if (nodeCtx && NI && me && me.id) {
          const npath = NI.newPath(me.id, nodeCtx.nodeId, ext);
          client.storage.from(NI.BUCKET).upload(npath, file, { contentType: file.type, upsert: false })
            .then(function (res) {
              if (res && res.error) throw res.error;
              return NI.sign(npath);                       // potpiši ODMAH → preview radi bez čekanja
            })
            .then(function (signed) {
              if (!signed) throw new Error('Upload je uspio, ali slika se nije mogla prikazati.');
              resolve(NI.marker(npath));                   // u block.src ide `node-img:<putanja>`
            })
            .catch(function (err) { reject(new Error((err && err.message) ? err.message : 'Upload nije uspio.')); });
          return;
        }

        const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
        const path = uuid + '.' + ext;                     // ravan namespace + UUID = bez kolizije
        client.storage.from(UPLOAD_BUCKET).upload(path, file, { contentType: file.type, upsert: false })
          .then(function (res) {
            if (res && res.error) throw res.error;
            const pub = client.storage.from(UPLOAD_BUCKET).getPublicUrl(path);
            const url = pub && pub.data && pub.data.publicUrl;
            if (!url) throw new Error('Upload uspio, ali URL nije dobiven.');
            resolve(url);
          })
          .catch(function (err) { reject(new Error((err && err.message) ? err.message : 'Upload nije uspio.')); });
      });
    }
    function videoPreviewHtml(block) {                       // renderVideo facade, ili placeholder ako ID nevaljan/prazan
      const html = preview(block);
      return (html && String(html).trim()) ? html : '<div class="be-media__ph">Zalijepi YouTube link ili ID ↓</div>';
    }
    function mediaVideoBody(block) {
      const val = block.url != null ? block.url : (block.videoId != null ? block.videoId : '');
      return '<div class="be-media be-media--video">' +
        '<div class="be-media__preview">' + videoPreviewHtml(block) + '</div>' +
        '<div class="be-media__fields">' +
          mField('url', 'YouTube link ili ID (npr. youtu.be/abc123)', val) +
        '</div></div>';
    }
    // ── U8.9 MathLive adapter (SAMO autorska strana; biblioteka pod 4 uvjeta: vendorana/CDN kao KaTeX ·
    //    iza ovog adaptera · SAMO editor · spike-dokazan). Motor za VIZUALNO slaganje formule → izlaz LaTeX
    //    → isti `block.tex` → student render (KaTeX) NEPROMIJENJEN. Student NIKAD ne učita MathLive
    //    (lijeno, tek kad admin otvori formula-editor) = nula utjecaja na perf/bundle. Tvornička virtualna
    //    tipkovnica UGAŠENA (U8.9b = naša čista paleta). CDN padne → graceful fallback na sirovi <input>. ──
    var MATHLIVE_SRC = 'https://cdn.jsdelivr.net/npm/mathlive';
    var _mlState = 'idle';                                   // idle | loading | ready | failed
    var _mlPromise = null;
    function ensureMathLive() {
      if (_mlPromise) return _mlPromise;
      _mlPromise = new Promise(function (resolve, reject) {
        if (typeof document === 'undefined' || typeof window === 'undefined') { _mlState = 'failed'; reject(); return; }
        if (window.customElements && customElements.get && customElements.get('math-field')) { _mlState = 'ready'; resolve(); return; }
        _mlState = 'loading';
        var s = document.createElement('script');
        s.src = MATHLIVE_SRC; s.async = true;
        var to = setTimeout(function () { _mlState = 'failed'; reject(new Error('mathlive timeout')); }, 9000);
        s.onload = function () {
          clearTimeout(to);
          if (window.customElements && customElements.whenDefined) {
            customElements.whenDefined('math-field').then(function () { _mlState = 'ready'; resolve(); }, function () { _mlState = 'ready'; resolve(); });
          } else { _mlState = 'ready'; resolve(); }
        };
        s.onerror = function () { clearTimeout(to); _mlState = 'failed'; reject(new Error('mathlive load error')); };
        document.head.appendChild(s);
      });
      return _mlPromise;
    }
    // CDN padne → zamijeni inertni <math-field> sirovim <input> (hvata ga postojeći media change-handler).
    function mathFieldsToInputs(container) {
      var fs = container.querySelectorAll ? container.querySelectorAll('[data-be-mathfield]') : [];
      for (var i = 0; i < fs.length; i++) {
        var mf = fs[i];
        var inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'be-mfield';
        inp.setAttribute('data-be-mfield', mf.getAttribute('data-be-mathfield') || 'tex');
        inp.setAttribute('placeholder', 'LaTeX (npr. E = mc^2)');
        inp.value = mf.getAttribute('data-be-tex') || '';
        if (mf.parentNode) mf.parentNode.replaceChild(inp, mf);
      }
    }
    // Konfiguriraj svaki <math-field> jednom: keyboard OFF · init vrijednost · živi preview na `input`
    // (BEZ op-a → nema op-spama po tipki) · JEDAN commit na `change` (blur/enter) — kao media-polja.
    function setupMathField(container, mf) {
      if (mf._beMF) return; mf._beMF = true;
      try { mf.mathVirtualKeyboardPolicy = 'manual'; } catch (_) {} // ne pop-aj tvorničku tipkovnicu (U8.9b = naša paleta)
      try { mf.menuItems = []; } catch (_) {}                        // makni kontekst-meni gumb (čisto)
      try { mf.value = mf.getAttribute('data-be-tex') || ''; } catch (_) {}
      function latexOf() { try { return mf.value || ''; } catch (_) { return ''; } }
      function livePreview() {                                       // vizualna povratna veza dok autor slaže (ne dira draft)
        var blockEl = mf.closest ? mf.closest('[data-be-block]') : null;
        if (!blockEl) return;
        var prev = blockEl.querySelector('.be-media__preview');
        if (prev) { prev.innerHTML = formulaPreviewHtml({ type: 'formula', tex: latexOf() }); typesetFormulas(blockEl); }
      }
      function commit() {                                            // jedan op po uređivanju (na blur/enter)
        var c = container._beCtx; if (!c) return;
        var blockEl = mf.closest ? mf.closest('[data-be-block]') : null;
        var id = blockEl ? blockEl.getAttribute('data-be-block') : '';
        if (!id) return;
        var latex = latexOf();
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: { tex: latex ? latex : null } });
      }
      mf.addEventListener('input', livePreview);
      mf.addEventListener('change', function () { commit(); livePreview(); });
    }
    // Nadogradi sve math-fieldove u containeru (lijeno učita MathLive; fallback na <input> ako CDN padne).
    function enhanceMathFields(container) {
      if (typeof document === 'undefined' || !container || !container.querySelectorAll) return;
      var fs = container.querySelectorAll('[data-be-mathfield]');
      if (!fs.length) return;
      if (_mlState === 'failed') { mathFieldsToInputs(container); return; }
      if (_mlState !== 'ready') {
        ensureMathLive().then(function () { enhanceMathFields(container); }, function () { mathFieldsToInputs(container); });
        return;
      }
      for (var i = 0; i < fs.length; i++) setupMathField(container, fs[i]);
    }

    function formulaPreviewHtml(block) {                     // renderBlocks izbaci \[tex\]; renderMath ga tipografira POSLIJE
      return (block && block.tex != null && String(block.tex).trim()) ? preview(block) : '<div class="be-media__ph">Upiši LaTeX formulu ↓</div>';
    }
    // ── U8.9b — naša ČISTA paleta („Photomath keypad"): gumbi ubacuju LaTeX-template u math-field.
    //    #? = MathLive placeholder (prazna kutija), #@ = trenutna selekcija (potencija/indeks obuhvate označeno). ──
    // Svaki gumb = [label, kod, displayTex?]. `kod` "!cmd:<naredba>" = MathLive executeCommand (npr. ⌫),
    // inače insert-template (#?=prazna kutija, #@=selekcija). displayTex (opcionalno) = RENDERANA labela
    // kroz KaTeX (razlomak → ▯/▯, korijen → √‾) radi jasnoće; bez njega = tekstualni label.
    var MATH_PAD = [
      ['Funkcije', [['sin', '\\sin'], ['cos', '\\cos'], ['tan', '\\tan'], ['log', '\\log'], ['logₐ', '\\log_{#?}', '\\log_a'], ['ln', '\\ln'], ['eˣ', 'e^{#?}', 'e^x'], ['10ˣ', '10^{#?}', '10^x'], ['x⁻¹', '#@^{-1}', 'x^{-1}']]],
      ['Strukture', [['a⁄b', '\\frac{#?}{#?}', '\\frac{a}{b}'], ['x²', '#@^{2}', 'x^2'], ['xⁿ', '#@^{#?}', 'x^n'], ['xₙ', '#@_{#?}', 'x_n'], ['√', '\\sqrt{#?}', '\\sqrt{x}'], ['ⁿ√', '\\sqrt[#?]{#?}', '\\sqrt[n]{x}'], ['( )', '\\left(#?\\right)', '(\\ )'], ['|x|', '\\left|#?\\right|', '|x|'], ['n!', '#@!', 'n!']]],
      ['Statistika', [['x̄', '\\bar{#@}', '\\bar{x}'], ['x̂', '\\hat{#@}', '\\hat{x}'], ['(ⁿₖ)', '\\binom{#?}{#?}', '\\binom{n}{k}'], ['x′', "#@'", "x'"], ['%', '\\%', '\\%'], [',', ',']]],
      ['Analiza', [['Σ', '\\sum_{#?}^{#?}', '\\textstyle\\sum'], ['∫', '\\int_{#?}^{#?}', '\\int'], ['∬', '\\iint_{#?}', '\\iint'], ['∏', '\\prod_{#?}^{#?}', '\\textstyle\\prod'], ['lim', '\\lim_{#?\\to#?}', '\\lim'], ['d⁄dx', '\\frac{\\mathrm{d}}{\\mathrm{d}x}', '\\tfrac{d}{dx}'], ['∂', '\\partial', '\\partial'], ['∞', '\\infty', '\\infty']]],
      ['Brojevi', [['7', '7'], ['8', '8'], ['9', '9'], ['4', '4'], ['5', '5'], ['6', '6'], ['1', '1'], ['2', '2'], ['3', '3'], ['0', '0'], ['.', '.'], ['=', '=']]],
      ['Operacije', [['+', '+'], ['−', '-'], ['×', '\\times', '\\times'], ['÷', '\\div', '\\div'], ['·', '\\cdot', '\\cdot'], ['±', '\\pm', '\\pm'], ['(', '('], [')', ')'], ['⌫', '!cmd:deleteBackward']]],
      ['Grčka', [['π', '\\pi'], ['α', '\\alpha'], ['β', '\\beta'], ['γ', '\\gamma'], ['θ', '\\theta'], ['λ', '\\lambda'], ['μ', '\\mu'], ['σ', '\\sigma'], ['φ', '\\phi'], ['ω', '\\omega'], ['Δ', '\\Delta'], ['Ω', '\\Omega']]],
      ['Relacije', [['≤', '\\le'], ['≥', '\\ge'], ['≠', '\\ne'], ['≈', '\\approx'], ['≡', '\\equiv'], ['∝', '\\propto'], ['∈', '\\in'], ['∉', '\\notin'], ['⊂', '\\subset'], ['∪', '\\cup'], ['∩', '\\cap'], ['∅', '\\emptyset'], ['→', '\\to'], ['⇒', '\\Rightarrow'], ['°', '^{\\circ}']]]
    ];
    // Renderiraj labelu gumba kroz KaTeX (keširano po tex-u; renderToString = sinkrono, bez DOM-a).
    // KaTeX još nije učitan → tekstualni fallback (labela). Trusted (naš tex) → sigurno u innerHTML.
    var _keyTexCache = {};
    function keyLabelHtml(displayTex, fallback) {
      if (displayTex && typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
        if (_keyTexCache[displayTex] != null) return _keyTexCache[displayTex];
        try {
          var h = window.katex.renderToString(displayTex, { throwOnError: false, displayMode: false });
          _keyTexCache[displayTex] = h; return h;
        } catch (_) { /* fallback ispod */ }
      }
      return esc(fallback);
    }
    function mathPadHtml() {
      let html = '<div class="be-mathpad" data-be-mathpad>';
      for (let g = 0; g < MATH_PAD.length; g++) {
        const keys = MATH_PAD[g][1];
        html += '<div class="be-mathpad__group" data-be-padgroup="' + esc(MATH_PAD[g][0]) + '">';
        for (let i = 0; i < keys.length; i++) {
          const label = keys[i][0], code = keys[i][1], disp = keys[i][2];
          const attr = (code.indexOf('!cmd:') === 0)
            ? 'data-be-mathcmd="' + esc(code.slice(5)) + '"'
            : 'data-be-mathins="' + esc(code) + '"';
          html += '<button type="button" class="be-mathkey" ' + attr + ' title="' + esc(label) + '">' + keyLabelHtml(disp, label) + '</button>';
        }
        html += '</div>';
      }
      return html + '</div>';
    }
    function mediaFormulaBody(block) {                       // U8.9a/b: formula = <math-field> (MathLive) + naša paleta + „veliki blok" prekidač + živi KaTeX preview
      const display = block.display !== false;              // default = veliki (blok/centrirano); false = inline
      const tex = block.tex == null ? '' : String(block.tex);
      // Autor slaže formulu VIZUALNO (MathLive → LaTeX) preko math-fielda + NAŠE palete; enhanceMathFields ožiči.
      // CDN padne (_mlState==='failed') → sirovi <input> bez palete (autor i dalje upiše LaTeX ručno).
      const field = (_mlState === 'failed')
        ? mField('tex', 'LaTeX (npr. E = mc^2  ·  \\frac{a}{b})', tex)
        : '<math-field class="be-mathfield" data-be-mathfield="tex" data-be-tex="' + esc(tex) + '">' + esc(tex) + '</math-field>' + mathPadHtml();
      return '<div class="be-media be-media--formula">' +
        '<div class="be-media__preview">' + formulaPreviewHtml(block) + '</div>' +
        '<div class="be-media__fields">' +
          field +
          '<label class="be-mcheck"><input type="checkbox" data-be-mcheck="display"' + (display ? ' checked' : '') +
            '> Veliki blok (centrirano) — isključi za formulu u redu s tekstom</label>' +
        '</div></div>';
    }
    function mediaPreviewHtml(block) {                       // preview-osvježenje po tipu (change-handler)
      if (block && block.type === 'video') return videoPreviewHtml(block);
      if (block && block.type === 'formula') return formulaPreviewHtml(block);
      if (block && block.type === 'table') return tablePreviewHtml(block);
      return imagePreviewHtml(block);
    }
    // ── KaTeX-tipografiranje formula-previewa (delimiteri su tekst dok renderMath ne prođe) ──
    function typesetFormulas(root) {
      if (typeof window === 'undefined' || typeof window.renderMath !== 'function' || !root || !root.querySelectorAll) return;
      const prevs = root.querySelectorAll('.be-media--formula .be-media__preview');
      for (let i = 0; i < prevs.length; i++) window.renderMath(prevs[i]);
    }

    // ── U8.5d — TABLICA: 2D grid-forma (ćelije = plain-text inputi; dodaj/obriši red/stupac; header-toggle) ──
    //    Model: {type:'table', header?:[cell,…], rows:[[cell,…],…]} (renderTable u blocks-rendereru).
    //    Ćelije se uređuju kao PLAIN tekst (renderInline prima string) → rich-ćelije (runs) se pri uredu spljošte.
    function tableHasContent(block) {
      if (Array.isArray(block.header) && block.header.some(function (c) { return String(inlineToPlain(c)).trim() !== ''; })) return true;
      if (Array.isArray(block.rows) && block.rows.some(function (r) {
        return Array.isArray(r) && r.some(function (c) { return String(inlineToPlain(c)).trim() !== ''; });
      })) return true;
      return false;
    }
    function tablePreviewHtml(block) {
      return tableHasContent(block) ? preview(block) : '<div class="be-media__ph">Ispuni ćelije tablice ↓</div>';
    }
    function tableModel(block) {                              // normaliziraj u pravokutnik za render grida
      const hasHeader = Array.isArray(block.header);
      const header = hasHeader ? block.header.slice() : null;
      const rows = Array.isArray(block.rows) ? block.rows.map(function (r) { return Array.isArray(r) ? r.slice() : []; }) : [];
      let cols = 0;
      if (header) cols = Math.max(cols, header.length);
      for (let i = 0; i < rows.length; i++) cols = Math.max(cols, rows[i].length);
      if (cols === 0) cols = 2;
      return { hasHeader: hasHeader, header: header, rows: rows, cols: cols };
    }
    function tCell(val, r, c, isHeader) {                    // r = -1 za header-red
      return '<input type="text" class="be-tcell' + (isHeader ? ' be-tcell--h' : '') +
        '" data-be-tr="' + r + '" data-be-tc="' + c + '" value="' + esc(inlineToPlain(val)) +
        '" placeholder="' + (isHeader ? 'Zaglavlje' : '…') + '">';
    }
    function delBtn(tact, key, val, title) {
      // tabindex=-1: Tab teče ĆELIJA→ĆELIJA (Excel-osjećaj), ne preko delete-gumba (U8.10)
      return '<button type="button" class="be-btn be-del" tabindex="-1" data-be-tact="' + tact + '" data-be-' + key + '="' + val +
        '" title="' + title + '" aria-label="' + title + '">✕</button>';
    }
    function mediaTableBody(block) {
      const m = tableModel(block);
      let grid = '<table class="be-tgrid"><tbody>';
      if (m.hasHeader) {                                     // header-red (bez delrow kontrole)
        grid += '<tr class="be-tgrid-hrow">';
        for (let c = 0; c < m.cols; c++) grid += '<td>' + tCell(m.header[c], -1, c, true) + '</td>';
        grid += '<td class="be-tgrid-rc"></td></tr>';
      }
      for (let r = 0; r < m.rows.length; r++) {              // tijelo-redovi (+ ✕ obriši red)
        grid += '<tr>';
        for (let c = 0; c < m.cols; c++) grid += '<td>' + tCell(m.rows[r][c], r, c, false) + '</td>';
        grid += '<td class="be-tgrid-rc">' + (m.rows.length > 1 ? delBtn('delrow', 'r', r, 'Ukloni red') : '') + '</td></tr>';
      }
      grid += '<tr class="be-tgrid-crow">';                  // red kontrola stupaca (✕ obriši stupac)
      for (let c = 0; c < m.cols; c++) grid += '<td>' + (m.cols > 1 ? delBtn('delcol', 'c', c, 'Ukloni stupac') : '') + '</td>';
      grid += '<td class="be-tgrid-rc"></td></tr>';
      grid += '</tbody></table>';
      return '<div class="be-media be-media--table">' +
        '<div class="be-media__preview">' + tablePreviewHtml(block) + '</div>' +
        '<label class="be-mcheck"><input type="checkbox" data-be-tcheck="header"' + (m.hasHeader ? ' checked' : '') +
          '> Prvi red = zaglavlje</label>' +
        '<div class="be-tgrid-wrap">' + grid + '</div>' +
        '<div class="be-tgrid-add">' +
          '<button type="button" class="be-tbtn" data-be-tact="addrow">＋ red</button>' +
          '<button type="button" class="be-tbtn" data-be-tact="addcol">＋ stupac</button>' +
        '</div></div>';
    }
    // broj stupaca modela pročitanog iz grida
    function colCountOf(t) {
      if (t.header && t.header.length) return t.header.length;
      if (t.rows[0]) return t.rows[0].length;
      return 0;
    }
    // ── U8.10 — PASTE iz Excela/Worda/Sheets → grid. SIGURNOST: HTML se NIKAD ne umeće kao HTML;
    //    parsira se DOMParser-om (ne izvršava skripte/ne učitava resurse) i uzima se SAMO textContent
    //    svake ćelije → plain string (renderer ionako escapa). TSV = tab-stupac, newline-red. ──
    var PASTE_MAX_ROWS = 200, PASTE_MAX_COLS = 40;              // razuman strop (perf; studij-tablice su male)
    function collapseWs(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
    function rectangularize(rows) {                             // dopuni sve retke na max broj stupaca ('')
      var cols = 0, i;
      for (i = 0; i < rows.length; i++) if (rows[i].length > cols) cols = rows[i].length;
      cols = Math.min(cols, PASTE_MAX_COLS);
      var out = [];
      for (i = 0; i < rows.length && i < PASTE_MAX_ROWS; i++) {
        var r = rows[i].slice(0, cols);
        while (r.length < cols) r.push('');
        out.push(r);
      }
      return out;
    }
    function parsePastedTable(text, html) {
      // 1) HTML tablica (Excel/Word/Sheets/preglednik postave text/html) → plain-text ćelije
      if (html && /<table[\s>]/i.test(html) && typeof DOMParser !== 'undefined') {
        try {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var table = doc.querySelector('table');
          if (table) {
            var rows = [], trs = table.querySelectorAll('tr');
            for (var i = 0; i < trs.length; i++) {
              var cells = trs[i].querySelectorAll('th,td');
              if (!cells.length) continue;
              var row = [];
              for (var j = 0; j < cells.length; j++) row.push(collapseWs(cells[j].textContent));
              rows.push(row);
            }
            if (rows.length) { var rect = rectangularize(rows); if (rect.length && rect[0].length) return rect; }
          }
        } catch (_) { /* padne → TSV niže */ }
      }
      // 2) TSV/plain (tab = stupac, newline = red). Tablica SAMO ako ima >1 ćeliju (inače normalan paste).
      if (text && (text.indexOf('\t') !== -1 || /\r?\n/.test(text.replace(/\s+$/, '')))) {
        var lines = String(text).replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n');
        var trows = lines.map(function (ln) { return ln.split('\t').map(collapseWs); });
        if (trows.length > 1 || (trows[0] && trows[0].length > 1)) {
          var tr = rectangularize(trows); if (tr.length && tr[0].length) return tr;
        }
      }
      return null;
    }

    // pročitaj TRENUTNE vrijednosti ćelija iz DOM-grida → {header|null, rows} (pravokutnik)
    function readGridCells(blockEl) {
      const cells = (blockEl && blockEl.querySelectorAll) ? blockEl.querySelectorAll('.be-tcell') : [];
      let hasHeader = false, maxRow = -1, maxCol = -1;
      const hmap = {}, rmap = {};
      for (let i = 0; i < cells.length; i++) {
        const el = cells[i];
        const r = parseInt(el.getAttribute('data-be-tr'), 10);
        const c = parseInt(el.getAttribute('data-be-tc'), 10);
        if (isNaN(r) || isNaN(c)) continue;
        if (c > maxCol) maxCol = c;
        if (r === -1) { hasHeader = true; hmap[c] = el.value; }
        else { if (r > maxRow) maxRow = r; if (!rmap[r]) rmap[r] = {}; rmap[r][c] = el.value; }
      }
      const cols = maxCol + 1;
      const header = hasHeader ? [] : null;
      if (hasHeader) for (let c = 0; c < cols; c++) header.push(hmap[c] != null ? hmap[c] : '');
      const rows = [];
      for (let r = 0; r <= maxRow; r++) { const row = []; const rm = rmap[r] || {}; for (let c = 0; c < cols; c++) row.push(rm[c] != null ? rm[c] : ''); rows.push(row); }
      return { header: header, rows: rows };
    }

    // ── U8.5e — RESIZE SLIKE: povuci ⇲ ručku → živi width% na <img> → JEDAN op na puštanju.
    //    Kurirano: cijeli broj 10–99 (%); 100 = default (ključ se briše → renderer bez stila). ──
    function imageResizePointerDown(e, container) {
      const h = (e.target && e.target.closest) ? e.target.closest('[data-be-imgresize]') : null;
      if (!h || !container.contains(h)) return false;
      e.preventDefault();
      const blockEl = h.closest('[data-be-block]');
      const prev = blockEl ? blockEl.querySelector('.be-media__preview') : null;
      const img = prev ? prev.querySelector('.lb-figure__img') : null;
      if (!blockEl || !prev || !img) return false;
      const contW = prev.clientWidth || 1;
      const startX = e.clientX;
      const startPct = Math.max(10, Math.min(100, Math.round((img.getBoundingClientRect().width / contW) * 100) || 100));
      const badge = blockEl.querySelector('[data-be-imgw]');
      let pct = startPct;
      function onMove(ev) {                                  // živa povratna veza (ne dira draft)
        const p = Math.round(startPct + ((ev.clientX - startX) / contW) * 100);
        pct = Math.max(10, Math.min(100, p));
        img.style.width = pct + '%';
        if (badge) badge.textContent = pct + '%';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        const c = container._beCtx; if (!c) return;
        const id = blockEl.getAttribute('data-be-block'); if (!id) return;
        c.applyOp({ type: 'updateLearnBlock', catId: c.catId, id: id, patch: { width: pct >= 100 ? null : pct } });
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      return true;
    }

    // ── javni API media-modula (jezgra destrukturira ovo iz window.__beMedia(core)) ──
    return {
      inlineToPlain: inlineToPlain,
      mediaImageBody: mediaImageBody,
      mediaVideoBody: mediaVideoBody,
      mediaFormulaBody: mediaFormulaBody,
      mediaTableBody: mediaTableBody,
      mediaPreviewHtml: mediaPreviewHtml,
      imageResizePointerDown: imageResizePointerDown,  // U8.5e (drag-ručka širine slike)
      uploadImage: uploadImage,                        // U8.7 (file → Storage → public URL)
      validateImageFile: validateImageFile,            // U8.7 (sinkroni tip/veličina validator)
      typesetFormulas: typesetFormulas,
      enhanceMathFields: enhanceMathFields,
      tableModel: tableModel,
      readGridCells: readGridCells,
      colCountOf: colCountOf,
      parsePastedTable: parsePastedTable            // U8.10 (paste TSV/HTML → grid; granica u parseru)
    };
  };
})();
