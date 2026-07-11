/* eslint-disable no-console */
// ===== Node unit testovi za placement dual-mode (U2.5, ADR-022) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/catalog-placement.test.js)
// Dva dijela:
//   1) SokratCatalog helperi — legacy ekvivalencija (18 postojećih predmeta netaknuto)
//      + sintetički dijeljeni predmet postavljen u 3 smjera (in-memory injekcija).
//   2) verify-catalog gate nad fixture-katalozima (CATALOG_PATH env): valjan prolazi,
//      katalog s prekršajima PADA s očekivanim porukama (dokaz da gate stvarno puca).

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== catalog placement (U2.5) ===\n');

// ---- 1a) Legacy ekvivalencija: helperi daju ISTO što je davao stari programId-filter ----

const PRIMARY = 'hospitality-management';

test('subjectsOf(legacy program) === stari programId-filter (iste reference, isti redoslijed)', () => {
  const viaHelper = SokratCatalog.subjectsOf(PRIMARY);
  const direct = SOKRAT_CATALOG.subjects.filter((s) => s.programId === PRIMARY);
  assert.strictEqual(viaHelper.length, direct.length);
  viaHelper.forEach((s, i) => assert.strictEqual(s, direct[i], `predmet ${i} nije ista referenca`));
});

test('yearsOf/semestersOf(legacy) = izvedeno iz legacy polja', () => {
  const years = [...new Set(SOKRAT_CATALOG.subjects
    .filter((s) => s.programId === PRIMARY && s.year != null).map((s) => s.year))].sort((a, b) => a - b);
  assert.deepStrictEqual(SokratCatalog.yearsOf(PRIMARY), years);
  for (const y of years) {
    const sems = [...new Set(SOKRAT_CATALOG.subjects
      .filter((s) => s.programId === PRIMARY && s.year === y).map((s) => s.semester))].sort((a, b) => a - b);
    assert.deepStrictEqual(SokratCatalog.semestersOf(PRIMARY, y), sems);
  }
});

test('placementsOf(legacy predmet) derivira 1 koordinatu s facultyId', () => {
  const te2 = SokratCatalog.getSubject('te2');
  assert.ok(te2, 'te2 mora postojati');
  assert.deepStrictEqual(SokratCatalog.placementsOf(te2), [
    { faculty: 'fmtu', program: PRIMARY, year: 2, semester: 1 }
  ]);
});

test('isInProgram(legacy) radi u oba smjera', () => {
  const te2 = SokratCatalog.getSubject('te2');
  assert.strictEqual(SokratCatalog.isInProgram(te2, PRIMARY), true);
  assert.strictEqual(SokratCatalog.isInProgram(te2, 'hospitality-management-hr'), false);
});

// ---- 1b) Sintetički dijeljeni predmet u 3 smjera (in-memory, čisti se na kraju) ----

const fmtu = SOKRAT_CATALOG.faculties.find((f) => f.id === 'fmtu');
const injectedPrograms = [
  { id: 'test-muh', name: 'Test MUH' },
  { id: 'test-mut', name: 'Test MUT' },
  { id: 'test-mor', name: 'Test MOR' }
];
const shared = {
  id: 'fmtu-testmath-hr',
  name: 'Test Matematika', shortName: 'TMat', icon: 'fa-square-root-variable', color: '#000',
  description: 'test', storageKey: 'fmtu-testmath-hr-progress',
  lessons: [{ id: 'first-midterm', name: 'K1', description: 'x' }],
  content: { scripts: [], resolve: {} },
  placement: [
    { faculty: 'fmtu', program: 'test-muh', year: 1, semester: 1 },
    { faculty: 'fmtu', program: 'test-mut', year: 1, semester: 1 },
    { faculty: 'fmtu', program: 'test-mor', year: 1, semester: 2 }
  ]
};
fmtu.programs.push(...injectedPrograms);
SOKRAT_CATALOG.subjects.push(shared);

try {
  test('dijeljeni predmet vidljiv u sva 3 smjera (isInProgram)', () => {
    for (const p of ['test-muh', 'test-mut', 'test-mor']) {
      assert.strictEqual(SokratCatalog.isInProgram(shared, p), true, p);
    }
    assert.strictEqual(SokratCatalog.isInProgram(shared, PRIMARY), false);
  });

  test('yearsOf/semestersOf novih smjerova izvedeni iz placementa', () => {
    assert.deepStrictEqual(SokratCatalog.yearsOf('test-mut'), [1]);
    assert.deepStrictEqual(SokratCatalog.semestersOf('test-mut', 1), [1]);
    assert.deepStrictEqual(SokratCatalog.semestersOf('test-mor', 1), [2]);
  });

  test('subjectsOf vraća dekoriranu kopiju s koordinatama pogođenog placementa', () => {
    const inMor = SokratCatalog.subjectsOf('test-mor', 1);
    assert.strictEqual(inMor.length, 1);
    assert.notStrictEqual(inMor[0], shared, 'placement-predmet mora biti kopija (dekoracija)');
    assert.strictEqual(inMor[0].id, 'fmtu-testmath-hr');
    assert.strictEqual(inMor[0].programId, 'test-mor');
    assert.strictEqual(inMor[0].year, 1);
    assert.strictEqual(inMor[0].semester, 2);
    // sadržaj/napredak dijele REFERENCU s originalom (jedan sadržaj, jedan storageKey)
    assert.strictEqual(inMor[0].content, shared.content);
    assert.strictEqual(inMor[0].storageKey, shared.storageKey);
  });

  test('getSubject vraća ORIGINAL (bez top-level year/semester) — placement je jedini smještaj', () => {
    const got = SokratCatalog.getSubject('fmtu-testmath-hr');
    assert.strictEqual(got, shared);
    assert.strictEqual(got.year, undefined);
    assert.strictEqual(got.programId, undefined);
  });

  test('postojeći smjerovi NEPROMIJENJENI injekcijom (legacy izolacija)', () => {
    const before = SOKRAT_CATALOG.subjects.filter((s) => s.programId === PRIMARY).length;
    assert.strictEqual(SokratCatalog.subjectsOf(PRIMARY).length, before);
  });
} finally {
  // počisti injekciju (higijena — druge assertacije/testovi ne smiju vidjeti sintetiku)
  SOKRAT_CATALOG.subjects.pop();
  fmtu.programs.splice(fmtu.programs.length - injectedPrograms.length, injectedPrograms.length);
}

// ---- 2) Verify-gate nad fixture-katalozima (dokaz da gate STVARNO pada) ----

function runVerify(fixtureRel) {
  return spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'verify-catalog.js')], {
    env: { ...process.env, CATALOG_PATH: fixtureRel },
    cwd: ROOT, encoding: 'utf8'
  });
}

test('gate: valjan placement-katalog PROLAZI (exit 0)', () => {
  const r = runVerify('tests/fixtures/catalog-placement-valid.js');
  assert.strictEqual(r.status, 0, 'očekivan exit 0, output:\n' + r.stdout + r.stderr);
});

test('gate: katalog s prekršajima PADA (exit 1) s očekivanim porukama', () => {
  const r = runVerify('tests/fixtures/catalog-placement-invalid.js');
  assert.strictEqual(r.status, 1, 'očekivan exit 1, output:\n' + r.stdout + r.stderr);
  const out = r.stdout + r.stderr;
  assert.ok(out.includes('dozvoljen je točno jedan način'), 'legacy+placement miješanje');
  assert.ok(out.includes('prefiks fakulteta'), 'id bez prefiksa fakulteta');
  assert.ok(out.includes('duplicirana placement koordinata'), 'dup koordinata');
  assert.ok(out.includes('ne postoji u fakultetu'), 'nepostojeći program');
  assert.ok(out.includes('storageKey'), 'dijeljeni storageKey preko dva unosa');
});

console.log(`\ncatalog-placement: ${passed} prošlo, ${failed} palo\n`);
process.exit(failed ? 1 : 0);
