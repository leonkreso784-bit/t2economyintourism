/* eslint-disable no-console */
// ===== Node unit test za js/block-editor.js (U8a — vizualni blok-editor, čisti renderEditor) =====
// Pokreni: node tests/unit/block-editor.test.js
// Shim: učita blocks-renderer.js (window.renderBlocks za preview) + block-editor.js u ISTI window.
// U8a-1 je ČISTA fn (bez DOM-a) → testira se kao pure render (mount/event-wiring = U8a-2).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
const count = (s, re) => (s.match(re) || []).length;

console.log('\n=== block-editor (U8a) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'js', 'blocks-renderer.js'), 'utf8'))(win);
new Function('window', fs.readFileSync(path.join(ROOT, 'js', 'block-editor.js'), 'utf8'))(win);
const E = win.SokratBlockEditor;

const sample = [
  { id: 'aaa111', type: 'heading', level: 2, text: 'Naslov' },
  { id: 'bbb222', type: 'paragraph', text: 'Neki tekst.' },
  { id: 'ccc333', type: 'list', ordered: false, items: ['x', 'y'] }
];

test('izvezen na window (renderEditor + helperi)', function () {
  assert.strictEqual(typeof E.renderEditor, 'function');
  assert.strictEqual(typeof E._esc, 'function');
});

test('prazni blokovi → be-empty + jedan adder (at=0) + bigplus, bez be-block', function () {
  const h = E.renderEditor([]);
  assert.ok(h.indexOf('be-empty') !== -1, 'prazna poruka');
  assert.strictEqual(count(h, /class="be-block"/g), 0);
  assert.strictEqual(count(h, /class="be-adder"/g), 1);
  assert.ok(h.indexOf('data-be-at="0"') !== -1);
  assert.strictEqual(count(h, /class="be-bigplus"/g), 1);
});

test('ne-niz → tretira se kao prazno (fail-safe)', function () {
  assert.ok(E.renderEditor(null).indexOf('be-empty') !== -1);
  assert.ok(E.renderEditor(undefined).indexOf('be-empty') !== -1);
  assert.ok(E.renderEditor({}).indexOf('be-empty') !== -1);
});

test('N blokova → N kartica + (N+1) addera + numeracija 1..N', function () {
  const h = E.renderEditor(sample);
  assert.strictEqual(count(h, /class="be-block"/g), 3);
  assert.strictEqual(count(h, /class="be-adder"/g), 4); // prije svakog (3) + kraj (1)
  assert.ok(h.indexOf('<span class="be-n">1</span>') !== -1);
  assert.ok(h.indexOf('<span class="be-n">2</span>') !== -1);
  assert.ok(h.indexOf('<span class="be-n">3</span>') !== -1);
  assert.strictEqual(count(h, /class="be-empty"/g), 0);
});

test('adderi nose točne pozicije 0..N (umetni-ovdje + kraj)', function () {
  const h = E.renderEditor(sample);
  assert.ok(h.indexOf('data-be-at="0"') !== -1);
  assert.ok(h.indexOf('data-be-at="1"') !== -1);
  assert.ok(h.indexOf('data-be-at="2"') !== -1);
  assert.ok(h.indexOf('data-be-at="3"') !== -1); // kraj = N
});

test('prvi blok: ↑ disabled; zadnji blok: ↓ disabled', function () {
  const h = E.renderEditor(sample);
  // prva kartica (aaa111) mora imati disabled up
  const first = h.slice(h.indexOf('data-be-block="aaa111"'), h.indexOf('data-be-block="bbb222"'));
  assert.ok(/data-be-act="up"[^>]*disabled/.test(first), 'prvi ↑ disabled');
  assert.ok(!/data-be-act="down"[^>]*disabled/.test(first), 'prvi ↓ NIJE disabled');
  const last = h.slice(h.indexOf('data-be-block="ccc333"'));
  assert.ok(/data-be-act="down"[^>]*disabled/.test(last), 'zadnji ↓ disabled');
  assert.ok(!/data-be-act="up"[^>]*disabled/.test(last), 'zadnji ↑ NIJE disabled');
});

test('kontrole nose data-be-act + data-be-id (za U8a-2 wiring)', function () {
  const h = E.renderEditor(sample);
  assert.ok(h.indexOf('data-be-act="up" data-be-id="bbb222"') !== -1);
  assert.ok(h.indexOf('data-be-act="down" data-be-id="bbb222"') !== -1);
  assert.ok(h.indexOf('data-be-act="remove" data-be-id="bbb222"') !== -1);
});

test('U8.4a: tekstualni blok = editabilno polje (contenteditable + data-be-field), NE read-only preview', function () {
  const h = E.renderEditor(sample);
  assert.ok(h.indexOf('data-be-field="text"') !== -1, 'heading/paragraph editabilno polje');
  assert.ok(h.indexOf('be-edit--h2') !== -1, 'heading = h2 editabilno');
  assert.ok(h.indexOf('<h2 class="lb-heading">') === -1, 'heading NIJE renderBlocks-preview');
  assert.ok(h.indexOf('Naslov') !== -1 && h.indexOf('Neki tekst.') !== -1, 'tekst sadržaja prisutan');
  assert.ok(h.indexOf('be-editlist') !== -1, 'lista editabilna');
  assert.strictEqual(count(h, /data-be-field="items"/g), 2, 'dvije editabilne stavke liste');
});

test('U8.4a: NE-tekstualni blok (table) ostaje read-only preview kroz renderBlocks (granica)', function () {
  const h = E.renderEditor([{ id: 't1', type: 'table', header: ['A'], rows: [['1']] }]);
  assert.ok(h.indexOf('lb-table') !== -1, 'table preview kroz renderBlocks');
  assert.ok(h.indexOf('data-be-field') === -1, 'ne-tekstualni blok nema editabilna polja');
});

// ── U8.4a: serijalizator runs → editabilni HTML ──
test('runsToEditable: plain string → escapan tekst', function () {
  assert.strictEqual(E._runsToEditable('a<b>&'), 'a&lt;b&gt;&amp;');
});
test('runsToEditable: b/i/color/href → strong/em/span.lb-color/a', function () {
  assert.strictEqual(E._runsToEditable([{ text: 'x', b: true }]), '<strong>x</strong>');
  assert.strictEqual(E._runsToEditable([{ text: 'y', i: true }]), '<em>y</em>');
  assert.strictEqual(E._runsToEditable([{ text: 'z', color: 'green' }]), '<span class="lb-color-green">z</span>');
  assert.ok(E._runsToEditable([{ text: 'l', href: 'https://a.b' }]).indexOf('<a href="https://a.b" data-be-link>l</a>') !== -1);
});
test('runsToEditable: nepoznata boja se ignorira (kurirani token-set)', function () {
  assert.strictEqual(E._runsToEditable([{ text: 'q', color: 'pink' }]), 'q');
});

// ── U8.4a: serijalizator DOM → runs (mini fake-DOM: firstChild/nextSibling/nodeType/tagName/data/getAttribute/className) ──
function T(s) { return { nodeType: 3, data: s, nextSibling: null }; }
function EL(tag, kids, attrs) {
  attrs = attrs || {};
  const node = {
    nodeType: 1, tagName: tag.toUpperCase(), className: attrs.class || '',
    getAttribute: function (k) { return attrs[k] != null ? attrs[k] : null; },
    firstChild: null, nextSibling: null
  };
  for (let i = 0; i < kids.length; i++) { if (i === 0) node.firstChild = kids[i]; if (i > 0) kids[i - 1].nextSibling = kids[i]; }
  return node;
}
const EROOT = (kids) => EL('div', kids);

test('editableToInline: čisti tekst → plain string', function () {
  assert.strictEqual(E._editableToInline(EROOT([T('zdravo')])), 'zdravo');
});
test('editableToInline: susjedni tekst-čvorovi istog formata → spojen string', function () {
  assert.strictEqual(E._editableToInline(EROOT([T('a'), T('b')])), 'ab');
});
test('editableToInline: prazno → prazan string', function () {
  assert.strictEqual(E._editableToInline(EROOT([])), '');
  assert.strictEqual(E._editableToInline(EROOT([T('')])), '');
});
test('editableToInline: <strong> → run b:true', function () {
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('strong', [T('bold')])])), [{ text: 'bold', b: true }]);
});
test('editableToInline: <b> i <i> alias (strong/em)', function () {
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('b', [T('x')])])), [{ text: 'x', b: true }]);
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('i', [T('y')])])), [{ text: 'y', i: true }]);
});
test('editableToInline: ugniježđeno <em><strong> → b+i', function () {
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('em', [EL('strong', [T('x')])])])), [{ text: 'x', b: true, i: true }]);
});
test('editableToInline: <a href> → run href', function () {
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('a', [T('link')], { href: 'https://a.b' })])), [{ text: 'link', href: 'https://a.b' }]);
});
test('editableToInline: span.lb-color-green → run color', function () {
  assert.deepStrictEqual(E._editableToInline(EROOT([EL('span', [T('g')], { class: 'lb-color-green' })])), [{ text: 'g', color: 'green' }]);
});
test('editableToInline: miješano tekst+bold+tekst → 3 runa (array)', function () {
  assert.deepStrictEqual(
    E._editableToInline(EROOT([T('a'), EL('strong', [T('b')]), T('c')])),
    [{ text: 'a' }, { text: 'b', b: true }, { text: 'c' }]
  );
});
test('editableToInline: nepoznato formatiranje (span style) → curi u čisti tekst (granica)', function () {
  // span bez lb-color-* klase → ne unosi boju; tekst ostaje
  assert.strictEqual(E._editableToInline(EROOT([EL('span', [T('plain')], { style: 'color:red' })])), 'plain');
});

test('badge tipa = ljudski naziv (heading→Naslov, paragraph→Tekst, list→Lista)', function () {
  const h = E.renderEditor(sample);
  assert.ok(h.indexOf('<span class="be-type">Naslov</span>') !== -1);
  assert.ok(h.indexOf('<span class="be-type">Tekst</span>') !== -1);
  assert.ok(h.indexOf('<span class="be-type">Lista</span>') !== -1);
});

test('nepoznat tip → badge = sirovi tip (fail-safe, escapan)', function () {
  const h = E.renderEditor([{ id: 'z1', type: 'wat' }]);
  assert.ok(h.indexOf('<span class="be-type">wat</span>') !== -1);
});

test('id se escapa u atributima (obrana)', function () {
  const h = E._blockCard({ id: 'a"><x', type: 'paragraph', text: 'p' }, 0, 1);
  assert.ok(h.indexOf('a"><x') === -1, 'sirovi id ne smije proći u atribut');
  assert.ok(h.indexOf('a&quot;&gt;&lt;x') !== -1, 'id escapan');
});

// ── U8a-2: swappedOrder (apsolutni red za reorderBlocks; ↑↓ logika) ──
test('swappedOrder: prvi ↑ → null (ne može gore)', function () {
  assert.strictEqual(E._swappedOrder(sample, 'aaa111', -1), null);
});
test('swappedOrder: zadnji ↓ → null (ne može dolje)', function () {
  assert.strictEqual(E._swappedOrder(sample, 'ccc333', 1), null);
});
test('swappedOrder: sredina ↑ → zamjena s prethodnim', function () {
  assert.deepStrictEqual(E._swappedOrder(sample, 'bbb222', -1), ['bbb222', 'aaa111', 'ccc333']);
});
test('swappedOrder: sredina ↓ → zamjena sa sljedećim', function () {
  assert.deepStrictEqual(E._swappedOrder(sample, 'bbb222', 1), ['aaa111', 'ccc333', 'bbb222']);
});
test('swappedOrder: blokovi bez id preskočeni (red samo od id-eva)', function () {
  const b = [{ id: 'a', type: 'paragraph', text: '1' }, { type: 'paragraph', text: 'noid' }, { id: 'c', type: 'paragraph', text: '2' }];
  assert.deepStrictEqual(E._swappedOrder(b, 'c', -1), ['c', 'a']);
});
test('swappedOrder: nepoznat id → null', function () {
  assert.strictEqual(E._swappedOrder(sample, 'nema', -1), null);
});
test('ADD_TYPES: 6 tipova (4 tekst + slika + video), svaki make() = valjan default-blok', function () {
  assert.strictEqual(E._addTypes.length, 6);
  E._addTypes.forEach(function (t) {
    const b = t.make();
    assert.strictEqual(b.type, t.type);
  });
  assert.strictEqual(E._addTypes[0].make().level, 2);       // heading default h2
  assert.deepStrictEqual(E._addTypes[2].make().items, ['']); // lista = jedna prazna stavka
  assert.strictEqual(E._addTypes[4].type, 'image');          // 5. = slika (U8.5a)
  assert.strictEqual(E._addTypes[5].type, 'video');          // 6. = video (U8.5b)
});

// ── U8.5a — media (slika) ──
test('inlineToPlain: string/runs/null/objekt → plain string', function () {
  assert.strictEqual(E._inlineToPlain('x'), 'x');
  assert.strictEqual(E._inlineToPlain([{ text: 'a', b: true }, 'b']), 'ab');
  assert.strictEqual(E._inlineToPlain(null), '');
  assert.strictEqual(E._inlineToPlain({ text: 'z' }), 'z');
});

test('mediaImageBody: prazna slika → 3 polja (src/alt/caption) + placeholder', function () {
  const html = E._mediaImageBody({ type: 'image', src: '', alt: '' });
  assert.ok(html.indexOf('data-be-mfield="src"') !== -1);
  assert.ok(html.indexOf('data-be-mfield="alt"') !== -1);
  assert.ok(html.indexOf('data-be-mfield="caption"') !== -1);
  assert.ok(html.indexOf('be-media__ph') !== -1);            // nema src → placeholder
});

test('mediaImageBody: vrijednosti polja escapane (bez HTML-injekcije)', function () {
  const html = E._mediaImageBody({ type: 'image', src: 'a"b', alt: 'A<b>' });
  assert.ok(html.indexOf('value="a&quot;b"') !== -1);
  assert.ok(html.indexOf('value="A&lt;b&gt;"') !== -1);
});

// ── U8.5b — video ──
test('mediaVideoBody: prazan video → 1 polje (url) + placeholder', function () {
  const html = E._mediaVideoBody({ type: 'video', url: '' });
  assert.ok(html.indexOf('data-be-mfield="url"') !== -1);
  assert.ok(html.indexOf('be-media__ph') !== -1);            // prazno → placeholder (preview '' u nodeu)
});

test('mediaVideoBody: postojeći videoId prikazan u url-polju (escapan)', function () {
  const html = E._mediaVideoBody({ type: 'video', videoId: 'ab"cd' });
  assert.ok(html.indexOf('value="ab&quot;cd"') !== -1);      // videoId pada u url-polje
});

console.log('\n=== rezultat: ' + passed + ' prošlo / ' + failed + ' palo ===\n');
process.exit(failed ? 1 : 0);
