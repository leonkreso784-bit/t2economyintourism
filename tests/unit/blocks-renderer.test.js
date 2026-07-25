/* eslint-disable no-console */
// ===== Node unit test za js/blocks-renderer.js (U7b — JEDAN renderer = sigurnosna granica) =====
// Pokreni: node tests/unit/blocks-renderer.test.js
// Shim-obrazac (kao draft-store/get-categories): klasična skripta kroz new Function('window', code).
// `document` je u node undefined → YouTube-delegat guard preskoči; render se testira kao PURE fn.
// Naglasak: ESCAPING svih polja + odbijanje opasnih URL-ova/shema (XSS-fixtures).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== blocks-renderer (U7b) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'blocks-renderer.js'), 'utf8');
const win = {};
new Function('window', code)(win); // nema top-level browser-poziva (document guardan) → čist load
const R = win.renderBlocks;
const B = win.SokratBlocks;

// ── osnovno ──
test('izvezen na window (renderBlocks + SokratBlocks)', function () {
  assert.strictEqual(typeof R, 'function');
  assert.strictEqual(typeof B.render, 'function');
});
test('nije niz → prazan string', function () {
  assert.strictEqual(R(null), '');
  assert.strictEqual(R(undefined), '');
  assert.strictEqual(R({}), '');
});
test('null/ne-objekt članovi i nepoznat tip → preskočeni (fail-safe)', function () {
  const out = R([null, 'x', 42, { type: 'nepostoji', text: 'a' }, { type: 'paragraph', text: 'ok' }]);
  assert.strictEqual(out, '<p class="lb-paragraph">ok</p>');
});

// ── heading ──
test('heading: level clamp 2–4 (default 3) + escaped tekst', function () {
  assert.ok(R([{ type: 'heading', level: 2, text: 'A' }]).indexOf('<h2 class="lb-heading">A</h2>') === 0);
  assert.ok(R([{ type: 'heading', level: 9, text: 'A' }]).indexOf('<h3') === 0); // izvan raspona → 3
  assert.ok(R([{ type: 'heading', text: 'A' }]).indexOf('<h3') === 0);           // bez levela → 3
  assert.strictEqual(R([{ type: 'heading', level: 2, text: '<b>x</b>' }]), '<h2 class="lb-heading">&lt;b&gt;x&lt;/b&gt;</h2>');
});

// ── paragraph + XSS ──
test('paragraph: <script> ESCAPAN (ne izvršiv)', function () {
  const out = R([{ type: 'paragraph', text: '<script>alert(1)</script>' }]);
  assert.strictEqual(out, '<p class="lb-paragraph">&lt;script&gt;alert(1)&lt;/script&gt;</p>');
  assert.ok(out.indexOf('<script>') === -1);
});
test('paragraph: napad kroz atribut ("><img onerror>) escapan', function () {
  const out = R([{ type: 'paragraph', text: '"><img src=x onerror=alert(1)>' }]);
  assert.ok(out.indexOf('<img') === -1);
  assert.ok(out.indexOf('onerror') !== -1 && out.indexOf('&gt;') !== -1); // kao tekst, ne tag
});

// ── inline runs (bold/italic/color/link) ──
test('runs: b/i/color(token) omotani ispravno', function () {
  const out = B._renderInline([{ text: 'x', b: true, i: true, color: 'green' }]);
  assert.strictEqual(out, '<span class="lb-color-green"><em><strong>x</strong></em></span>');
});
test('runs: nepoznata boja se IGNORIRA (nema proizvoljne boje)', function () {
  const out = B._renderInline([{ text: 'x', color: 'hotpink' }]);
  assert.strictEqual(out, 'x');
});
test('runs: link http → anchor s rel=noopener; javascript: → BEZ anchora', function () {
  const ok = B._renderInline([{ text: 'go', href: 'https://a.com' }]);
  assert.ok(ok.indexOf('<a href="https://a.com" target="_blank" rel="noopener noreferrer">go</a>') === 0);
  const bad = B._renderInline([{ text: 'go', href: 'javascript:alert(1)' }]);
  assert.strictEqual(bad, 'go'); // href odbijen → samo tekst
});

// ── list ──
test('list: ul/ol + escapane stavke', function () {
  assert.strictEqual(R([{ type: 'list', items: ['a', '<b>'] }]), '<ul class="lb-list"><li>a</li><li>&lt;b&gt;</li></ul>');
  assert.ok(R([{ type: 'list', ordered: true, items: ['a'] }]).indexOf('<ol') === 0);
});

// ── callout ──
test('callout: nepoznat variant → info; title escapan', function () {
  const out = R([{ type: 'callout', variant: 'zzz', title: '<t>', text: 'body' }]);
  assert.ok(out.indexOf('lb-callout--info') !== -1);
  assert.ok(out.indexOf('&lt;t&gt;') !== -1);
});

// ── image + URL sanitizacija ──
test('image: valjan src → <img>; alt escapan', function () {
  const out = R([{ type: 'image', src: 'https://x/y.png', alt: '"a"' }]);
  assert.ok(out.indexOf('<img class="lb-figure__img" src="https://x/y.png" alt="&quot;a&quot;"') !== -1);
});
test('image: javascript:/data:svg src → blok IZOSTAVLJEN', function () {
  assert.strictEqual(R([{ type: 'image', src: 'javascript:alert(1)' }]), '');
  assert.strictEqual(R([{ type: 'image', src: 'data:image/svg+xml,<svg onload=alert(1)>' }]), '');
});
test('image: relativni put i data:image/png OK', function () {
  assert.ok(R([{ type: 'image', src: 'assets/x.png' }]).indexOf('<img') !== -1);
  assert.ok(R([{ type: 'image', src: 'data:image/png;base64,AAAA' }]).indexOf('<img') !== -1);
});

// ── video (youtube) ──
test('video: valjan ID → facade s data-lb-yt (bez iframea prije klika)', function () {
  const out = R([{ type: 'video', videoId: 'dQw4w9WgXcQ' }]);
  assert.ok(out.indexOf('data-lb-yt="dQw4w9WgXcQ"') !== -1);
  assert.ok(out.indexOf('<iframe') === -1);       // NEMA iframea u facade-u (consent-safe)
  assert.ok(out.indexOf('youtube') === -1);        // nula YT-URL-ova prije klika
});
test('video: ID iz raznih URL-oblika; nevaljan → izostavljen', function () {
  assert.strictEqual(B._youtubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.strictEqual(B._youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s'), 'dQw4w9WgXcQ');
  assert.strictEqual(B._youtubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.strictEqual(B._youtubeId('not a video'), '');
  assert.strictEqual(R([{ type: 'video', url: 'not a video' }]), '');
});

// ── table ──
test('table: header + redovi, ćelije escapane', function () {
  const out = R([{ type: 'table', header: ['H<'], rows: [['a', '<x>']] }]);
  assert.ok(out.indexOf('<th>H&lt;</th>') !== -1);
  assert.ok(out.indexOf('<td>&lt;x&gt;</td>') !== -1);
});

// ── formula (KaTeX) ──
test('formula: display → \\[ \\], inline → \\( \\), tex escapan', function () {
  assert.strictEqual(R([{ type: 'formula', tex: 'x^2' }]), '<div class="lb-formula">\\[x^2\\]</div>');
  assert.ok(R([{ type: 'formula', tex: 'x', display: false }]).indexOf('\\(x\\)') !== -1);
  assert.ok(R([{ type: 'formula', tex: 'a<b' }]).indexOf('a&lt;b') !== -1); // < escapan (KaTeX čita textContent)
});

// ── legacy-html: DOMPurify (mock) + fallback ──
test('legacy-html: koristi window.DOMPurify.sanitize ako postoji', function () {
  let gotHtml = null, gotCfg = null;
  win.DOMPurify = { sanitize: function (h, cfg) { gotHtml = h; gotCfg = cfg; return '[CLEAN]'; } };
  const out = R([{ type: 'legacy-html', html: '<p>hi</p><script>x</script>' }]);
  assert.strictEqual(out, '<div class="lb-legacy">[CLEAN]</div>');
  assert.ok(gotHtml.indexOf('<script>') !== -1);       // proslijeđen sirov DOMPurify-u
  assert.ok(Array.isArray(gotCfg.ALLOWED_TAGS));       // proslijeđen config
  delete win.DOMPurify;
});
test('legacy-html: fallback (bez DOMPurify) = raw za NAŠ povjerljiv v1 sadržaj', function () {
  const out = R([{ type: 'legacy-html', html: '<p>trusted</p>' }]);
  assert.strictEqual(out, '<div class="lb-legacy"><p>trusted</p></div>');
});

// ── safeUrl (izravno) ──
test('safeUrl: dopušta http(s)/mailto/relativni/#/protocol-relative', function () {
  ['https://a.com', 'http://a.com', 'mailto:a@b.com', '/x', './x', '#top', '//cdn/x.js', 'foo/bar']
    .forEach(function (u) { assert.strictEqual(B._safeUrl(u), u, u); });
});
test('safeUrl: odbija javascript:/data:text/vbscript:/file: (→ prazno)', function () {
  ['javascript:alert(1)', 'JAVAScript:x', 'data:text/html,<script>', 'vbscript:x', 'file:///etc/passwd']
    .forEach(function (u) { assert.strictEqual(B._safeUrl(u), '', u); });
});
test('safeUrl: data:image/png samo uz {image:true}; svg uvijek odbijen', function () {
  assert.strictEqual(B._safeUrl('data:image/png;base64,AA', { image: true }), 'data:image/png;base64,AA');
  assert.strictEqual(B._safeUrl('data:image/png;base64,AA'), '');            // bez image opt → odbij
  assert.strictEqual(B._safeUrl('data:image/svg+xml,<svg>', { image: true }), '');
});

// ── U8.5e — image width (kurirana širina u %) ──
test('image width: 10–99 → style="width:NN%" (zaokružen broj)', function () {
  const out = R([{ type: 'image', src: 'https://a.com/x.png', width: 55 }]);
  assert.ok(out.indexOf('style="width:55%"') !== -1, out);
  const out2 = R([{ type: 'image', src: 'https://a.com/x.png', width: 33.4 }]);
  assert.ok(out2.indexOf('style="width:33%"') !== -1, out2);
});
test('image width: 100 / izvan raspona / ne-broj → BEZ style (granica: samo naš broj u style)', function () {
  [100, 5, 500, -20, 'abc', null, undefined, '55; background:url(x)'].forEach(function (w) {
    const out = R([{ type: 'image', src: 'https://a.com/x.png', width: w }]);
    assert.ok(out.indexOf('style=') === -1, 'width=' + w + ' → ' + out);
  });
});

console.log('\nblocks-renderer: ' + passed + ' prošlo, ' + failed + ' palo');
process.exit(failed ? 1 : 0);
