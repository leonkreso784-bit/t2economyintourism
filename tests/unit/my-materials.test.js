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

// ---------------------------------------------------------------- F2/5a — zid gradiva
// Leon (anketa 15.09.): materijal bez vlastite boje dobiva STALNU boju iz kurirane palete —
// istu na svakom uređaju, izvedenu iz id-a. Paleta i izvod žive u `js/utils.js` (i profil i
// editor ga učitavaju), pa se modul ovdje slaže kao u pregledniku: utils PRVI.
{
  const utils = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'utils.js'), 'utf8');
  /** @type {any} */
  const win = {};
  new Function('window', utils)(win);
  new Function('window', code)(win);
  const W = win.SokratMaterials;
  const HEX = /^#[0-9a-f]{6}$/i;

  test('paleta: kurirani skup Studija (6 boja, sve #rrggbb, bez duplikata)', () => {
    assert.ok(Array.isArray(win.KURIRANE_BOJE), 'KURIRANE_BOJE nije na window');
    assert.strictEqual(win.KURIRANE_BOJE.length, 6);
    win.KURIRANE_BOJE.forEach((b) => assert.match(b, HEX));
    assert.strictEqual(new Set(win.KURIRANE_BOJE).size, 6);
  });
  test('bojaMaterijala: ista za isti id (stalna), uvijek iz palete', () => {
    const id = '3f2a9c1e-0000-4000-8000-000000000001';
    assert.strictEqual(win.bojaMaterijala(id), win.bojaMaterijala(id));
    assert.ok(win.KURIRANE_BOJE.includes(win.bojaMaterijala(id)));
  });
  test('bojaMaterijala: 60 id-eva pogodi bar 5 od 6 boja (nije sve ista boja)', () => {
    const vidjene = new Set();
    for (let i = 0; i < 60; i++) vidjene.add(win.bojaMaterijala('id-' + i + '-x'));
    assert.ok(vidjene.size >= 5, 'raspon je preuzak: ' + vidjene.size);
  });
  test('bojaMaterijala: prazan id → prva boja palete (ne baca)', () => {
    assert.strictEqual(win.bojaMaterijala(''), win.KURIRANE_BOJE[0]);
    assert.strictEqual(win.bojaMaterijala(null), win.KURIRANE_BOJE[0]);
  });

  const rows = [
    { id: 'f1', parent_id: null, kind: 'folder', name: 'Ispiti', created_at: '2026-09-01T10:00:00Z', node_content: null },
    { id: 's1', parent_id: 'f1', kind: 'study', name: 'Makro', created_at: '2026-09-01T10:00:00Z',
      node_content: { updated_at: '2026-09-10T10:00:00Z' } },
    { id: 's2', parent_id: null, kind: 'study', name: 'Statistika', created_at: '2026-09-02T10:00:00Z',
      node_content: [{ updated_at: '2026-09-12T10:00:00Z' }] },                 // PostgREST zna vratiti niz
    { id: 's3', parent_id: null, kind: 'study', name: 'Bez sadržaja', created_at: '2026-09-11T10:00:00Z',
      node_content: null },                                                     // → vrijeme stvaranja
    { id: 's4', parent_id: 'nema', kind: 'study', name: 'Siroče', created_at: '2026-08-01T10:00:00Z',
      node_content: { updated_at: '2026-08-02T10:00:00Z' }, color: '#10b981', icon: 'fa-flask' },
    { id: 's5', parent_id: null, kind: 'study', name: 'Obrisan', created_at: '2026-09-13T10:00:00Z',
      node_content: { updated_at: '2026-09-14T10:00:00Z' }, deleted_at: '2026-09-14T11:00:00Z' },
    { id: 's6', parent_id: null, kind: 'study', name: 'Loša boja', created_at: '2026-07-01T10:00:00Z',
      node_content: null, color: 'red;background:url(x)', icon: 'fa-x" onclick="y' }
  ];

  test('recentStudy: samo živi materijali (bez mapa i obrisanih), zadnja izmjena gradiva prva', () => {
    const r = W.recentStudy(rows, 6);
    assert.deepStrictEqual(r.items.map((x) => x.id), ['s2', 's3', 's1', 's4', 's6']);
    assert.strictEqual(r.total, 5);
  });
  test('recentStudy: granica (6 → prvih N) i ukupan broj ostaje pun', () => {
    const r = W.recentStudy(rows, 2);
    assert.deepStrictEqual(r.items.map((x) => x.id), ['s2', 's3']);
    assert.strictEqual(r.total, 5);
  });
  test('recentStudy: mapa = ime roditelja; korijen i siroče bez mape', () => {
    const po = Object.fromEntries(W.recentStudy(rows, 6).items.map((x) => [x.id, x.folder]));
    assert.strictEqual(po.s1, 'Ispiti');
    assert.strictEqual(po.s2, null);
    assert.strictEqual(po.s4, null);
  });
  test('recentStudy: vlastita boja/ikona se poštuje, a neispravna pada na izvedenu/zadanu', () => {
    const po = Object.fromEntries(W.recentStudy(rows, 6).items.map((x) => [x.id, x]));
    assert.strictEqual(po.s4.color, '#10b981');
    assert.strictEqual(po.s4.icon, 'fa-flask');
    assert.strictEqual(po.s6.color, win.bojaMaterijala('s6'));
    assert.strictEqual(po.s6.icon, 'fa-book-open');
    assert.strictEqual(po.s2.color, win.bojaMaterijala('s2'));
  });
  test('recentStudy: prazan/neispravan ulaz → prazno, ne baca', () => {
    assert.deepStrictEqual(W.recentStudy(null, 6), { items: [], total: 0 });
    assert.deepStrictEqual(W.recentStudy([], 6), { items: [], total: 0 });
  });
  test('registerStudySubject: materijal bez boje dobiva ISTU boju kao na zidu', () => {
    // `subjectDataMap` je u pregledniku goli global; modul ga traži preko `typeof`.
    const mapa = {};
    const M3 = new Function('window', 'subjectDataMap', code + '\n;return window.SokratMaterials;')(win, mapa);
    const key = M3.registerStudySubject({ id: 's2', kind: 'study', name: 'Statistika' });
    assert.strictEqual(mapa[key].color, win.bojaMaterijala('s2'));
  });
}

console.log(`\n=== rezultat: ${passed} prošlo / ${failed} palo ===\n`);
process.exit(failed ? 1 : 0);
