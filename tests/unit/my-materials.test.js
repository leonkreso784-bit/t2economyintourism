/* eslint-disable no-console */
// ===== Node unit testovi za js/my-materials.js (F2 — osobni UGC-graditelj) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/my-materials.test.js)
// Isti obrazac kao draft-store.test.js: klasična skripta kroz window-shim (new Function).
// Testiraju se ČISTE funkcije (bez DOM-a/mreže): buildTree · flattenVisible ·
// isSelfOrDescendant · humanError.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== my-materials (F2) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'my-materials.js'), 'utf8');

/** Svježa instanca modula. `t` = opcionalni i18n stub. */
function load(t) {
  /** @type {{ SokratMaterials?: any, t?: any }} */
  const win = {};
  if (t) win.t = t;
  new Function('window', code)(win);
  return win.SokratMaterials;
}

const M = load();

// ---------------------------------------------------------------- buildTree
{
  const rows = [
    { id: 'f1', parent_id: null, kind: 'folder', name: 'FMTU', position: 0 },
    { id: 'f2', parent_id: 'f1', kind: 'folder', name: '1. godina', position: 0 },
    { id: 's1', parent_id: 'f2', kind: 'study', name: 'Matematika', position: 1 },
    { id: 's2', parent_id: 'f2', kind: 'study', name: 'Statistika', position: 0 }
  ];
  const tree = M.buildTree(rows);

  test('buildTree: jedan korijen, ugniježđeno po parent_id', () => {
    assert.strictEqual(tree.length, 1);
    assert.strictEqual(tree[0].id, 'f1');
    assert.strictEqual(tree[0].children.length, 1);
    assert.strictEqual(tree[0].children[0].id, 'f2');
    assert.strictEqual(tree[0].children[0].children.length, 2);
  });

  test('buildTree: braća poredana po position (Statistika pos0 prije Matematike pos1)', () => {
    const kids = tree[0].children[0].children.map((n) => n.name);
    assert.deepStrictEqual(kids, ['Statistika', 'Matematika']);
  });

  test('buildTree: ne mutira ulazne retke (children se ne lijepi na izvor)', () => {
    assert.ok(!('children' in rows[0]), 'izvorni redak dobio children');
  });
}

{
  const rows = [
    { id: 'a', parent_id: null, kind: 'folder', name: 'Beta', position: 0 },
    { id: 'b', parent_id: null, kind: 'folder', name: 'Alfa', position: 0 }
  ];
  test('buildTree: ista position → poredak po imenu (stabilno)', () => {
    assert.deepStrictEqual(M.buildTree(rows).map((n) => n.name), ['Alfa', 'Beta']);
  });
}

{
  const rows = [
    { id: 'f1', parent_id: null, kind: 'folder', name: 'Živ', position: 0 },
    { id: 'f2', parent_id: null, kind: 'folder', name: 'Obrisan', position: 1, deleted_at: '2026-08-02T10:00:00Z' },
    { id: 's1', parent_id: 'f2', kind: 'study', name: 'Dijete obrisanog', position: 0 }
  ];
  const tree = M.buildTree(rows);
  test('buildTree: obrisani (deleted_at) se izbacuju', () => {
    assert.strictEqual(tree.filter((n) => n.name === 'Obrisan').length, 0);
  });
  test('buildTree: siroče (roditelj izvan skupa) ide na korijen, ne nestaje', () => {
    assert.ok(tree.some((n) => n.id === 's1'), 'siroče je nestalo iz stabla');
  });
}

test('buildTree: prazan/neispravan ulaz → prazno stablo (ne baca)', () => {
  assert.deepStrictEqual(M.buildTree(), []);
  assert.deepStrictEqual(M.buildTree([]), []);
  assert.deepStrictEqual(M.buildTree([null, {}, { id: null }]), []);
});

test('buildTree: position koji nije broj → 0 (ne ruši sortiranje)', () => {
  const t = M.buildTree([
    { id: 'a', parent_id: null, kind: 'folder', name: 'A', position: null },
    { id: 'b', parent_id: null, kind: 'folder', name: 'B', position: 1 }
  ]);
  assert.deepStrictEqual(t.map((n) => n.id), ['a', 'b']);
});

// ----------------------------------------------------------- flattenVisible
{
  const tree = M.buildTree([
    { id: 'f1', parent_id: null, kind: 'folder', name: 'F1', position: 0 },
    { id: 'f2', parent_id: 'f1', kind: 'folder', name: 'F2', position: 0 },
    { id: 's1', parent_id: 'f2', kind: 'study', name: 'S1', position: 0 },
    { id: 'f3', parent_id: null, kind: 'folder', name: 'F3', position: 1 }
  ]);

  test('flattenVisible: sve zatvoreno → samo korijeni, depth 0', () => {
    const rows = M.flattenVisible(tree, {});
    assert.deepStrictEqual(rows.map((r) => r.node.id), ['f1', 'f3']);
    assert.deepStrictEqual(rows.map((r) => r.depth), [0, 0]);
  });

  test('flattenVisible: otvoren f1 → prikazuje f2 (depth 1), ali ne unuka', () => {
    const rows = M.flattenVisible(tree, { f1: true });
    assert.deepStrictEqual(rows.map((r) => r.node.id), ['f1', 'f2', 'f3']);
    assert.deepStrictEqual(rows.map((r) => r.depth), [0, 1, 0]);
  });

  test('flattenVisible: otvoren cijeli lanac → unuk vidljiv na depth 2', () => {
    const rows = M.flattenVisible(tree, { f1: true, f2: true });
    assert.deepStrictEqual(rows.map((r) => r.node.id), ['f1', 'f2', 's1', 'f3']);
    assert.deepStrictEqual(rows.map((r) => r.depth), [0, 1, 2, 0]);
  });

  test('flattenVisible: bez expanded mape → ne baca', () => {
    assert.strictEqual(M.flattenVisible(tree).length, 2);
  });
}

// ------------------------------------------------------ isSelfOrDescendant
{
  const rows = [
    { id: 'f1', parent_id: null },
    { id: 'f2', parent_id: 'f1' },
    { id: 's1', parent_id: 'f2' },
    { id: 'x', parent_id: null }
  ];
  test('isSelfOrDescendant: sam sebi → true (drop na sebe zabranjen)', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, 'f1', 'f1'), true);
  });
  test('isSelfOrDescendant: izravno dijete → true', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, 'f1', 'f2'), true);
  });
  test('isSelfOrDescendant: unuk → true (spriječi ciklus u dubinu)', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, 'f1', 's1'), true);
  });
  test('isSelfOrDescendant: nepovezan čvor → false (drop dopušten)', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, 'f1', 'x'), false);
  });
  test('isSelfOrDescendant: roditelj nije potomak djeteta → false', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, 's1', 'f1'), false);
  });
  test('isSelfOrDescendant: pokvareni podaci s ciklusom → ne visi (guard)', () => {
    const bad = [{ id: 'a', parent_id: 'b' }, { id: 'b', parent_id: 'a' }];
    assert.strictEqual(M.isSelfOrDescendant(bad, 'zzz', 'a'), false);
  });
  test('isSelfOrDescendant: null argumenti → false', () => {
    assert.strictEqual(M.isSelfOrDescendant(rows, null, 'f2'), false);
    assert.strictEqual(M.isSelfOrDescendant(rows, 'f1', null), false);
  });
}

// -------------------------------------------------------------- humanError
{
  test('humanError: naši RPC kodovi → ljudska poruka (ne sirovi SQL)', () => {
    assert.match(M.humanError({ message: 'node_denied: nije tvoj čvor' }), /not yours/i);
    assert.match(M.humanError({ message: 'node_cycle: novi roditelj je potomak čvora' }), /itself/i);
    assert.match(M.humanError({ message: 'publish_version_conflict: base 1, u bazi 2' }), /edited elsewhere/i);
    assert.match(M.humanError({ message: 'node_parent_deleted: prvo vrati roditelja' }), /parent folder first/i);
  });
  test('humanError: tablica ne postoji na toj bazi → jasna poruka, NE „nešto je pošlo po zlu"', () => {
    // Prod prije F5-migracije: PostgREST PGRST205 / Postgres 42P01.
    assert.match(M.humanError({ code: 'PGRST205', message: "Could not find the table 'public.nodes' in the schema cache" }), /Not available on this environment/i);
    assert.match(M.humanError({ code: '42P01', message: 'relation "public.nodes" does not exist' }), /Not available on this environment/i);
    assert.match(M.humanError({ message: 'Could not find the table public.nodes' }), /Not available on this environment/i);
  });
  test('humanError: istekao/neispravan token → „moraš biti prijavljen"', () => {
    assert.match(M.humanError({ code: 'PGRST301', message: 'JWSError JWSInvalidSignature' }), /signed in/i);
  });
  test('humanError: nepoznata greška → generička poruka (bez curenja internih detalja)', () => {
    const msg = M.humanError({ code: 'XX000', message: 'deadlock detected at pid 4711 in relation foo' });
    assert.match(msg, /went wrong/i);
    assert.ok(msg.indexOf('pid 4711') === -1, 'interni detalj procurio korisniku');
  });
  test('humanError: null/prazna greška → generička poruka (ne baca)', () => {
    assert.match(M.humanError(null), /went wrong/i);
    assert.match(M.humanError({}), /went wrong/i);
  });
  test('humanError: koristi i18n kad postoji prijevod', () => {
    const M2 = load((k) => (k === 'materials.errDenied' ? 'To nije tvoje.' : k));
    assert.strictEqual(M2.humanError({ message: 'node_denied: x' }), 'To nije tvoje.');
  });
  test('humanError: i18n koji vraća ključ (nema prijevoda) → engleski fallback', () => {
    const M2 = load((k) => k);
    assert.match(M2.humanError({ message: 'node_denied: x' }), /not yours/i);
  });
}

console.log(`\n=== rezultat: ${passed} prošlo / ${failed} palo ===\n`);
process.exit(failed ? 1 : 0);
