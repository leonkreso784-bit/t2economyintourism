/* eslint-disable no-console */
// ===== Node unit test — IDENTITET NAUČENE KARTICE (BUG-047) =====
// Pokreni: node tests/unit/flashcard-identity.test.js
//
// ŠTO STOJI NA KOCKI: `initFlashcards()` promiješa špil, a „znam" je spremao POZICIJU u tom
// špilu. Sutra je na poziciji 0 druga kartica, pa su se obje vodile kao isti broj; k tome je
// napredak po PREDMETU, a špil po LEKCIJI, pa su se indeksi iz midterm-1, midterm-2 i final
// miješali u istom nizu. Broj „naučeno" je bio šum, a sync-unija (koja pretpostavlja
// stringove) ga nije ni dohvaćala.
//
// Identitet kartice: `card.id` (schema v2, 6 znakova) kad postoji — a ne postoji u sedam HR
// predmeta i dijelu `accounting`-a (1 175 od 5 737 kartica, 12.09.) — inače deterministički
// otisak `kategorija|pitanje`. Stari brojčani zapisi se pri učitavanju odbacuju: ne znače ništa.
//
// `flashcards.js` referencira `AppState`, `progress`, `document`… GOLO (leksički globali,
// v. CLAUDE.md) — ovdje se predaju kao parametri funkcije, isto kao u `cloud-sync.test.js`.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== flashcards / identitet naučene kartice (BUG-047) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/** Lažni DOM: svaki element je isti bezlični stub — ovdje se ne mjeri ekran nego zapis. */
function lazniDocument() {
  const el = () => ({
    textContent: '', innerHTML: '', className: '', style: {}, dataset: {},
    classList: { toggle() {}, remove() {}, add() {} },
    setAttribute() {}, appendChild() {}, addEventListener() {}, querySelectorAll: () => []
  });
  const poId = {};                                   // isti id → isti element, da se zapis može pročitati
  return {
    getElementById: (id) => (poId[id] || (poId[id] = el())),
    createElement: () => el(), querySelector: () => el(),
    querySelectorAll: () => [], addEventListener() {}
  };
}

/**
 * Svježa instanca `flashcards.js` + `storage.js` + `progress.js` nad zadanim gradivom.
 * `shuffle` = kako se špil miješa (test bira, da pozicija bude ono što se mijenja).
 */
function load(o) {
  const opts = o || {};
  const ls = new Map(Object.entries(opts.ls || {}));
  const localStorage = {
    _m: ls,
    getItem: (k) => (ls.has(k) ? ls.get(k) : null),
    setItem: (k, v) => { ls.set(k, String(v)); },
    removeItem: (k) => { ls.delete(k); }
  };
  const AppState = {
    nav: { subject: 'te2', lesson: 'midterm-1', data: opts.data || null, category: null },
    cards: { deck: [], index: 0, known: [], unknown: [] },
    fill: { correct: 0, wrong: 0 }
  };
  const subjectDataMap = { te2: { storageKey: 'te2-progress' } };
  const kod = [
    'let progress = { flashcardsLearned: [], quizScores: [], fillSolved: 0, lastStudy: null, streak: 0, categoryProgress: {} };',
    'function currentStorageKey() { return subjectDataMap[AppState.nav.subject].storageKey; }',
    'function currentSubjectMeta() { return null; }',
    'function getCategories(c) { return Object.keys(c).filter((k) => k !== "schemaVersion"); }',
    'function shuffleArray(a) { return shuffle(a); }',
    'function trackFlashcardReview() {}',
    'function showToast() {}',
    rd('js/storage.js'),
    rd('js/flashcards.js'),
    rd('js/progress.js'),
    'return { initFlashcards, markKnown, markUnknown, loadProgress, renderProgressPage, ' +
    '  cardIdentity: (typeof cardIdentity === "function") ? cardIdentity : null, ' +
    '  progress: () => progress, AppState, ls: localStorage._m };'
  ].join('\n');
  const doc = lazniDocument();
  const F = new Function('window', 'document', 'localStorage', 'AppState', 'subjectDataMap', 'shuffle', kod)(
    { SokratBlocks: null }, doc, localStorage, AppState, subjectDataMap, opts.shuffle || ((a) => a)
  );
  F.doc = doc;
  return F;
}

const GRADIVO = {
  demand: { name: 'Demand', quiz: [], flashcards: [
    { id: 'aaaaaa', question: 'What is demand?', answer: 'Q at P' },
    { question: 'Elasticity?', answer: 'dQ/dP' }                    // bez id-a (HR predmeti)
  ] },
  supply: { name: 'Supply', quiz: [], flashcards: [
    { question: 'Elasticity?', answer: 'isto pitanje, druga sekcija' }
  ] }
};

// ── IDENTITET ──────────────────────────────────────────────────────────
test('kartica s id-om → identitet je taj id', () => {
  const F = load({ data: GRADIVO });
  assert.ok(F.cardIdentity, 'cardIdentity mora postojati');
  assert.strictEqual(F.cardIdentity({ id: 'aaaaaa', category: 'demand', question: 'x' }), 'aaaaaa');
});

test('kartica BEZ id-a → deterministički otisak iz kategorije i pitanja, nikad broj', () => {
  const F = load({ data: GRADIVO });
  const a = F.cardIdentity({ category: 'demand', question: 'Elasticity?' });
  const b = F.cardIdentity({ category: 'demand', question: 'Elasticity?' });
  const c = F.cardIdentity({ category: 'supply', question: 'Elasticity?' });
  const d = F.cardIdentity({ category: 'demand', question: 'Elasticity!' });
  assert.strictEqual(typeof a, 'string');
  assert.strictEqual(a, b, 'isti sadržaj → isti identitet (inače „naučeno" ne preživi ni jedan reload)');
  assert.notStrictEqual(a, c, 'isto pitanje u drugoj sekciji je druga kartica');
  assert.notStrictEqual(a, d, 'drugo pitanje je druga kartica');
});

// ── ZAPIS NE OVISI O POZICIJI U ŠPILU ───────────────────────────────────
test('⛔ „znam" pamti KARTICU, ne poziciju: ista pozicija nakon drugog miješanja = druga kartica', () => {
  const F = load({ data: GRADIVO, shuffle: (a) => a });      // špil kako jest
  F.initFlashcards();
  F.markKnown();                                            // pozicija 0 = 'aaaaaa'
  const prvi = F.progress().flashcardsLearned.slice();
  assert.deepStrictEqual(prvi, ['aaaaaa']);

  const G = load({ data: GRADIVO, ls: Object.fromEntries(F.ls), shuffle: (a) => a.reverse() });
  G.loadProgress();
  G.initFlashcards();
  G.markKnown();                                            // pozicija 0 = zadnja kartica (supply)
  const drugi = G.progress().flashcardsLearned;
  assert.strictEqual(drugi.length, 2, 'dvije RAZLIČITE kartice su naučene, a ne „pozicija 0" dvaput');
  assert.ok(drugi.indexOf('aaaaaa') !== -1, 'prva naučena nije smjela nestati');
  drugi.forEach((x) => assert.strictEqual(typeof x, 'string', 'u zapisu ne smije biti broj: ' + x));
});

test('ista kartica dvaput → jedan zapis', () => {
  const F = load({ data: GRADIVO, shuffle: (a) => a });
  F.initFlashcards();
  F.markKnown();
  F.AppState.cards.index = 0;
  F.markKnown();
  assert.deepStrictEqual(F.progress().flashcardsLearned, ['aaaaaa']);
});

// ── STARI ZAPISI ────────────────────────────────────────────────────────
test('stari brojčani zapisi (pozicije) se pri učitavanju ODBACUJU — bili su šum', () => {
  const F = load({ data: GRADIVO, ls: { 'te2-progress': JSON.stringify({ flashcardsLearned: [0, 1, 7, 'aaaaaa'] }) } });
  F.loadProgress();
  assert.deepStrictEqual(F.progress().flashcardsLearned, ['aaaaaa']);
});

// ── PRIKAZ PO LEKCIJI ───────────────────────────────────────────────────
test('„naučeno" za lekciju broji SAMO kartice iz njezina špila (napredak je po predmetu, špil po lekciji)', () => {
  const F = load({ data: GRADIVO, shuffle: (a) => a });
  // 'zzzzzz' je naučena u DRUGOJ lekciji istog predmeta; ova lekcija je ne poznaje.
  F.progress().flashcardsLearned = ['aaaaaa', 'zzzzzz'];
  F.renderProgressPage();
  assert.strictEqual(String(F.doc.getElementById('flashcardsLearned').textContent), '1', 'tuđa lekcija ne smije napuhati brojku');
  assert.strictEqual(String(F.doc.getElementById('flashcardsTotal').textContent), '3');
});

console.log('\nflashcard-identity: ' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
