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

test('tijelo bloka = preview kroz renderBlocks (isti renderer = granica)', function () {
  const h = E.renderEditor(sample);
  assert.ok(h.indexOf('<h2 class="lb-heading">Naslov</h2>') !== -1, 'heading preview');
  assert.ok(h.indexOf('<p class="lb-paragraph">Neki tekst.</p>') !== -1, 'paragraph preview');
  assert.ok(h.indexOf('lb-list') !== -1, 'list preview');
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
test('ADD_TYPES: 4 tekstualna tipa, svaki make() = valjan default-blok', function () {
  assert.strictEqual(E._addTypes.length, 4);
  E._addTypes.forEach(function (t) {
    const b = t.make();
    assert.strictEqual(b.type, t.type);
  });
  assert.strictEqual(E._addTypes[0].make().level, 2);       // heading default h2
  assert.deepStrictEqual(E._addTypes[2].make().items, ['']); // lista = jedna prazna stavka
});

console.log('\n=== rezultat: ' + passed + ' prošlo / ' + failed + ' palo ===\n');
process.exit(failed ? 1 : 0);
