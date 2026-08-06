// ===== SOKRAT STUDY — BLOCKS RENDERER (U7b) =====
//
// JEDAN renderer za learn-blokove = SIGURNOSNA GRANICA (EDITOR_PLAN §3.2/§6/§8).
// Isti kod servira study, editor-preview (U8) i budući marketplace → sav render learna
// prolazi ovuda. Sigurnost PO KONSTRUKCIJI: renderira se SAMO poznati tip s ESCAPANIM
// poljima; autor nikad ne piše sirovi HTML (osim `legacy-html` tipa → DOMPurify).
//
// Tipovi blokova: heading · paragraph · list · callout · image · video(youtube) · table ·
// formula(KaTeX) · legacy-html.  `renderBlocks(blocks)` → siguran HTML string.
//
// U7b JE IZOLIRAN — datoteka se učitava i definira `window.renderBlocks`, ali JOŠ nije
// ožičena na student-view (to radi U7c: `learn.js` dual-mode). DOMPurify se koristi AKO je
// `window.DOMPurify` prisutan (pouzdano učitavanje = U7c); dotad legacy-html ima siguran
// fallback (v1 = NAŠ povjerljiv sadržaj). YouTube = klik-za-učitavanje (nocookie), autor
// unosi SAMO link/ID, mi gradimo iframe → nula third-party poziva prije klika (consent-safe).

(function () {
  'use strict';

  // ── escape (jedina istina za izlaz teksta) ──
  const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; });
  }

  // ── URL sanitizacija: dopusti relativne/anchor/protocol-relative + http(s)/mailto;
  //    za slike još data:image/(png|jpg|gif|webp). Sve s eksplicitnom drugom shemom
  //    (javascript:, data:text, vbscript:, file:, …) → ODBIJ (prazan string). ──
  function safeUrl(url, opts) {
    const u = String(url == null ? '' : url).trim();
    if (!u) return '';
    const m = u.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/); // ima li eksplicitnu shemu?
    if (!m) return u;                                  // relativni / #anchor / //host → OK
    const scheme = m[1].toLowerCase();
    if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') return u;
    // data:image (bez svg — SVG može nositi skripte) samo za <img>
    if (opts && opts.image && /^data:image\/(png|jpe?g|gif|webp)[;,]/i.test(u)) return u;
    return '';                                         // nepoznata/opasna shema
  }

  // ── YouTube: izvuci + validiraj 11-znakovni video-ID (iz čistog ID-a ili URL-a). ──
  function youtubeId(input) {
    const s = String(input == null ? '' : input).trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;       // već čist ID
    const m = s.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  // ── inline tekst: plain string ILI runs [{text, b?, i?, color?, href?}] ──
  // Boja = SAMO iz kuriranog seta imena (token → CSS klasa) — nikad proizvoljna vrijednost.
  // ⚠ mora ostati usklađen s TB_COLORS u block-editor.js (F6 paleta boja teksta)
  const INLINE_COLORS = { indigo: 1, green: 1, amber: 1, red: 1, cyan: 1, blue: 1, violet: 1, pink: 1, default: 1 };
  function renderRun(run) {
    if (run == null) return '';
    if (typeof run === 'string') return esc(run);
    if (typeof run !== 'object') return esc(run);
    // ── inline matematika: EKSKLUZIVAN run (ne kombinira se s b/i/color/href) ──
    // Isti obrazac kao formula-blok: delimiteri izlaze kao TEKST, a `renderMath()` ih
    // tipografira POSLIJE umetanja (js/learn.js, js/studio.js). Ovdje se NIŠTA ne izvršava
    // i `esc()` ostaje → nema nove površine za injekciju. Loš LaTeX KaTeX crta crveno
    // (throwOnError:false), nikad ne baca.
    if (run.math) return '<span class="lb-imath">\\(' + esc(run.text) + '\\)</span>';
    let html = esc(run.text);
    if (run.b) html = '<strong>' + html + '</strong>';
    if (run.i) html = '<em>' + html + '</em>';
    if (run.color && INLINE_COLORS[run.color] && run.color !== 'default') {
      html = '<span class="lb-color-' + run.color + '">' + html + '</span>';
    }
    if (run.href) {
      const href = safeUrl(run.href);
      if (href) html = '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + html + '</a>';
    }
    return html;
  }
  function renderInline(content) {
    if (Array.isArray(content)) return content.map(renderRun).join('');
    return renderRun(content);
  }

  // ── DOMPurify config za legacy-html (whitelist ugođen parity-provjerom U7c) ──
  // ALLOWED_TAGS/ATTR = SUPERSET svega što naš v1 learn HTML koristi (dokazano
  // tests/unit/legacy-html-coverage.test.js nad svih 19 predmeta / 468 blokova) → DOMPurify
  // ne struže naš sadržaj. `style` (331×) i `value` (li) su tu radi PARITETA legacy prikaza
  // (gradijenti/centriranje/margine u tip-box itd.); DOMPurify i dalje sanitizira CSS-vrijednosti
  // (miče url(javascript:)/expression). Novo v2 autorstvo = tokeni-only (blokovi ne emitiraju style).
  const DOMPURIFY_CFG = {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div', 'sup', 'sub',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'value', 'colspan', 'rowspan', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  };

  // ── pojedini tipovi blokova ──
  function renderHeading(b) {
    let lvl = parseInt(b.level, 10);
    if (!(lvl >= 2 && lvl <= 4)) lvl = 3;              // kurirani raspon h2–h4
    return '<h' + lvl + ' class="lb-heading">' + renderInline(b.text) + '</h' + lvl + '>';
  }
  function renderParagraph(b) {
    return '<p class="lb-paragraph">' + renderInline(b.text) + '</p>';
  }
  function renderList(b) {
    const tag = b.ordered ? 'ol' : 'ul';
    const items = Array.isArray(b.items) ? b.items : [];
    return '<' + tag + ' class="lb-list">' +
      items.map(function (it) { return '<li>' + renderInline(it) + '</li>'; }).join('') +
      '</' + tag + '>';
  }
  const CALLOUT_VARIANTS = { info: 1, warning: 1, tip: 1 };
  function renderCallout(b) {
    const variant = CALLOUT_VARIANTS[b.variant] ? b.variant : 'info';
    const title = (b.title != null && String(b.title) !== '')
      ? '<div class="lb-callout__title">' + esc(b.title) + '</div>' : '';
    return '<div class="lb-callout lb-callout--' + variant + '">' + title +
      '<div class="lb-callout__body">' + renderInline(b.text) + '</div></div>';
  }
  function renderImage(b) {
    const src = safeUrl(b.src, { image: true });
    if (!src) return '';                               // nevaljan/opasan URL → izostavi (fail-safe)
    const alt = esc(b.alt || '');
    const cap = (b.caption != null && String(b.caption) !== '')
      ? '<figcaption class="lb-figure__cap">' + renderInline(b.caption) + '</figcaption>' : '';
    // U8.5e: kurirana širina u % (10–99; 100/nevaljano = bez stila → max-width:100% iz CSS-a).
    // Ne-broj/izvan raspona se IGNORIRA (granica: u style ide isključivo naš računati broj).
    const w = Math.round(Number(b.width));
    const wStyle = (isFinite(w) && w >= 10 && w <= 99) ? ' style="width:' + w + '%"' : '';
    return '<figure class="lb-figure"><img class="lb-figure__img" src="' + esc(src) +
      '" alt="' + alt + '" loading="lazy"' + wStyle + '>' + cap + '</figure>';
  }
  function renderVideo(b) {
    const id = youtubeId(b.videoId != null ? b.videoId : b.url);
    if (!id) return '';                                // nevaljan ID → izostavi
    // Facade: NULA poziva prema YouTubeu prije klika (consent-safe). Klik → iframe (nocookie).
    return '<div class="lb-video">' +
      '<button type="button" class="lb-video__play" data-lb-yt="' + esc(id) +
      '" aria-label="Load and play YouTube video">' +
      '<span class="lb-video__icon" aria-hidden="true">&#9658;</span>' +
      '<span class="lb-video__label">YouTube</span></button></div>';
  }
  function renderTable(b) {
    const rows = Array.isArray(b.rows) ? b.rows : [];
    const header = Array.isArray(b.header) ? b.header : null;
    let html = '<div class="lb-table-wrap"><table class="lb-table">';
    if (header) {
      html += '<thead><tr>' + header.map(function (c) { return '<th>' + renderInline(c) + '</th>'; }).join('') + '</tr></thead>';
    }
    html += '<tbody>' + rows.map(function (row) {
      const cells = Array.isArray(row) ? row : [];
      return '<tr>' + cells.map(function (c) { return '<td>' + renderInline(c) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
    return html;
  }
  function renderFormula(b) {
    // KaTeX: tex ide kao TEKST u delimiterima (esc → textContent dekodira natrag);
    // renderMath() (js/math.js, auto-render) ga obradi POSLIJE umetanja (poziva ga study/U7c).
    const tex = esc(b.tex);
    if (b.display === false) return '<span class="lb-formula lb-formula--inline">\\(' + tex + '\\)</span>';
    return '<div class="lb-formula">\\[' + tex + '\\]</div>';
  }
  function renderLegacyHtml(b) {
    const html = String(b.html == null ? '' : b.html);
    if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
      return '<div class="lb-legacy">' + window.DOMPurify.sanitize(html, DOMPURIFY_CFG) + '</div>';
    }
    // Fallback (DOMPurify još nije učitan): legacy = NAŠ povjerljiv v1 sadržaj (datoteke) →
    // zadrži postojeće ponašanje (raw), bez regresije. U7c dodaje pouzdano učitavanje DOMPurify-a;
    // UGC (F6) će zahtijevati DOMPurify (nema raw fallbacka za neprovjeren sadržaj).
    return '<div class="lb-legacy">' + html + '</div>';
  }

  const RENDERERS = {
    heading: renderHeading,
    paragraph: renderParagraph,
    list: renderList,
    callout: renderCallout,
    image: renderImage,
    video: renderVideo,
    table: renderTable,
    formula: renderFormula,
    'legacy-html': renderLegacyHtml
  };

  // ── glavni ulaz ──
  function renderBlocks(blocks) {
    if (!Array.isArray(blocks)) return '';
    let html = '';
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b || typeof b !== 'object') continue;
      const fn = RENDERERS[b.type];
      if (fn) html += fn(b);                            // nepoznat tip → tiho preskoči (fail-safe)
    }
    return html;
  }

  // ── YouTube klik-za-učitavanje (delegat; jednom). ID je već validiran pri renderu + ovdje. ──
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest ? e.target.closest('[data-lb-yt]') : null;
      if (!btn) return;
      const id = btn.getAttribute('data-lb-yt') || '';
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      const wrap = btn.closest('.lb-video');
      if (!wrap) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = 'YouTube video';
      iframe.className = 'lb-video__frame';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  }

  // ── izvoz (+ interni helperi za unit-testove) ──
  if (typeof window !== 'undefined') {
    window.renderBlocks = renderBlocks;
    window.SokratBlocks = {
      render: renderBlocks,
      _esc: esc,
      _safeUrl: safeUrl,
      _youtubeId: youtubeId,
      _renderInline: renderInline,
      _domPurifyConfig: DOMPURIFY_CFG   // za legacy-html-coverage.test.js (parity gate)
    };
  }
})();
