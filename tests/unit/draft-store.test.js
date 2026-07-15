/* eslint-disable no-console */
// ===== Node unit testovi za js/draft-store.js (U3 — draft-sloj, EDITOR_PLAN §4.1) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/draft-store.test.js)
// Isti obrazac kao app-state.test.js: klasična skripta se učitava kroz window-shim
// (new Function), localStorage = fake u shimu (autosave testovi bez preglednika).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== draft-store (U3) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'draft-store.js'), 'utf8');

function fakeStorage() {
  const m = {};
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
    _dump: () => m
  };
}

/** Svježa instanca store-a (npr. simulacija refresha) nad ZAJEDNIČKIM localStorage-om. */
function loadStore(ls) {
  /** @type {{ SokratDraft?: any, localStorage?: any }} */
  const win = { localStorage: ls };
  new Function('window', code)(win);
  return win.SokratDraft;
}

/** Mini lekcijski payload — kategorija s id-jevima (v2) i bez (v1/DB pre-U2a). */
function sampleData() {
  return {
    demand: {
      name: 'Demand', icon: 'fa-x', color: '#111',
      flashcards: [
        { id: 'aaa111', question: 'Q1?', answer: 'A1' },
        { id: 'bbb222', question: 'Q2?', answer: 'A2' }
      ],
      quiz: [{ id: 'qqq111', question: 'Pick', options: ['a', 'b'], correct: 0 }],
      fillBlanks: [{ sentence: 'Fill _______ here.', answer: 'me' }], // BEZ id (DB pre-U2a)
      learn: { title: 'T', content: '<p>x</p>' }
    }
  };
}

const S = 'te2';
const L = 'first-midterm';
const V = 'te2M1';

// ---- osnovni životni ciklus ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  const src = sampleData();
  const d = store.begin(S, L, V, src);

  test('begin: original i working su DEEP kopije (izvor i original netaknuti mutacijom workinga)', () => {
    d.working.demand.flashcards[0].question = 'MUTIRANO';
    assert.strictEqual(src.demand.flashcards[0].question, 'Q1?');
    assert.strictEqual(d.original.demand.flashcards[0].question, 'Q1?');
    d.working.demand.flashcards[0].question = 'Q1?'; // vrati za daljnje testove
  });

  test('applyOp updateCard po ID-u: working ažuriran, dirty=true, original netaknut', () => {
    const r = store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'bbb222', patch: { question: 'NQ', answer: 'NA' } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(d.working.demand.flashcards[1].question, 'NQ');
    assert.strictEqual(d.original.demand.flashcards[1].question, 'Q2?');
    assert.strictEqual(store.isDirty(S, L), true);
    assert.strictEqual(store.opsOf(S, L).length, 1);
  });

  test('id ima PREDNOST nad krivim idx (id pogađa stavku 0, idx pokazuje na 1)', () => {
    const r = store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', idx: 1, patch: { answer: 'A1-nova' } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(d.working.demand.flashcards[0].answer, 'A1-nova');
    assert.strictEqual(d.working.demand.flashcards[1].answer, 'NA'); // netaknut ovim opom
  });

  test('fallback na idx kad stavka NEMA id (DB payload pre-U2a): updateFill', () => {
    const r = store.applyOp(S, L, { type: 'updateFill', catId: 'demand', idx: 0, patch: { sentence: 'New _______ !', answer: 'x' } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(d.working.demand.fillBlanks[0].sentence, 'New _______ !');
  });

  test('updateQuiz i updateLearn (object-op) rade', () => {
    assert.strictEqual(store.applyOp(S, L, { type: 'updateQuiz', catId: 'demand', id: 'qqq111', patch: { correct: 1 } }).ok, true);
    assert.strictEqual(d.working.demand.quiz[0].correct, 1);
    assert.strictEqual(store.applyOp(S, L, { type: 'updateLearn', catId: 'demand', patch: { title: 'Novi naslov' } }).ok, true);
    assert.strictEqual(d.working.demand.learn.title, 'Novi naslov');
    assert.strictEqual(d.working.demand.learn.content, '<p>x</p>'); // ostala polja očuvana
  });

  test('nepostojeća stavka/kategorija/op → ok:false, oplog se NE puni', () => {
    const before = store.opsOf(S, L).length;
    assert.strictEqual(store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'nema-me', patch: { q: 'x' } }).ok, false);
    assert.strictEqual(store.applyOp(S, L, { type: 'updateCard', catId: 'ghost', idx: 0, patch: { q: 'x' } }).ok, false);
    assert.strictEqual(store.applyOp(S, L, { type: 'eksplodiraj', catId: 'demand', patch: {} }).ok, false);
    assert.strictEqual(store.applyOp('nepostojeci', L, { type: 'updateCard', catId: 'demand', idx: 0, patch: {} }).ok, false);
    assert.strictEqual(store.opsOf(S, L).length, before);
  });

  test('commitDone: re-baseline (original=working, dirty=false, oplog i autosave očišćeni)', () => {
    store.commitDone(S, L);
    assert.strictEqual(store.isDirty(S, L), false);
    assert.strictEqual(store.opsOf(S, L).length, 0);
    assert.deepStrictEqual(d.original, d.working);
    assert.strictEqual(ls.getItem('sokrat-draft:te2::first-midterm'), null);
  });
}

// ---- autosave / restore (preživi „refresh") ----

{
  const ls = fakeStorage();
  const store1 = loadStore(ls);
  store1.begin(S, L, V, sampleData());
  store1.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', patch: { question: 'PREŽIVI-ME' } });

  test('autosave: nakon applyOp postoji localStorage zapis drafta', () => {
    const raw = ls.getItem('sokrat-draft:te2::first-midterm');
    assert.ok(raw, 'autosave zapis mora postojati');
    assert.ok(raw.includes('PREŽIVI-ME'));
  });

  test('restore: NOVA instanca (refresh) + ISTA baza → working i oplog vraćeni, restored=true', () => {
    const store2 = loadStore(ls); // svjež eval = simulacija reload-a stranice
    const d2 = store2.begin(S, L, V, sampleData());
    assert.strictEqual(d2.restored, true);
    assert.strictEqual(d2.working.demand.flashcards[0].question, 'PREŽIVI-ME');
    assert.strictEqual(d2.original.demand.flashcards[0].question, 'Q1?'); // original = svježa baza
    assert.strictEqual(store2.isDirty(S, L), true);
    assert.strictEqual(store2.opsOf(S, L).length, 1);
  });

  test('restore se ODBIJA kad se baza promijenila (zastarjeli autosave se briše)', () => {
    const store3 = loadStore(ls);
    const changed = sampleData();
    changed.demand.flashcards[0].answer = 'baza se promijenila drugdje';
    const d3 = store3.begin(S, L, V, changed);
    assert.strictEqual(d3.restored, false);
    assert.strictEqual(d3.working.demand.flashcards[0].question, 'Q1?'); // čista kopija nove baze
    assert.strictEqual(store3.isDirty(S, L), false);
    assert.strictEqual(ls.getItem('sokrat-draft:te2::first-midterm'), null, 'zastarjeli autosave obrisan');
  });
}

// ---- applyOpsTo (sibling-sync pri objavi) + null-briše-ključ ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  const d = store.begin(S, L, V, sampleData());

  test('updateLearn s title:null BRIŠE ključ (semantika praznog naslova iz F4.4)', () => {
    const r = store.applyOp(S, L, { type: 'updateLearn', catId: 'demand', patch: { content: '<p>n</p>', title: null } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual('title' in d.working.demand.learn, false);
    assert.strictEqual(d.working.demand.learn.content, '<p>n</p>');
  });

  test('applyOpsTo: isti opovi primijenjeni na SIBLING payload (final-kopija) — applied broji pogotke', () => {
    store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', patch: { question: 'SYNC?' } });
    const sibling = sampleData(); // final = kopija istih kategorija
    const r = store.applyOpsTo(sibling, store.opsOf(S, L));
    assert.strictEqual(r.applied, 2);
    assert.strictEqual(r.skipped, 0);
    assert.strictEqual(sibling.demand.flashcards[0].question, 'SYNC?');
    assert.strictEqual('title' in sibling.demand.learn, false);
  });

  test('applyOpsTo: payload BEZ te kategorije (examPractice-only red) → skipped, bez rušenja', () => {
    const other = { examPractice: { name: 'EP', icon: 'fa-x', color: '#000', flashcards: [] } };
    const r = store.applyOpsTo(other, store.opsOf(S, L));
    assert.strictEqual(r.applied, 0);
    assert.strictEqual(r.skipped, 2);
  });

  test('applyOpsTo je idempotentan za update-opove (druga primjena = isto stanje)', () => {
    const sibling = sampleData();
    store.applyOpsTo(sibling, store.opsOf(S, L));
    const snapshot = JSON.stringify(sibling);
    store.applyOpsTo(sibling, store.opsOf(S, L));
    assert.strictEqual(JSON.stringify(sibling), snapshot);
  });
}

// ---- discard ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  store.begin(S, L, V, sampleData());
  store.applyOp(S, L, { type: 'updateLearn', catId: 'demand', patch: { content: '<p>y</p>' } });

  test('discard: draft i autosave nestaju („Odbaci" = ništa nije otišlo nikamo)', () => {
    store.discard(S, L);
    assert.strictEqual(store.get(S, L), null);
    assert.strictEqual(store.isDirty(S, L), false);
    assert.strictEqual(ls.getItem('sokrat-draft:te2::first-midterm'), null);
  });

  test('store radi i BEZ localStorage-a (autosave = tihi no-op)', () => {
    const bare = loadStore(undefined);
    const d = bare.begin(S, L, V, sampleData());
    const r = bare.applyOp(S, L, { type: 'updateCard', catId: 'demand', idx: 0, patch: { answer: 'ok' } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(d.working.demand.flashcards[0].answer, 'ok');
  });
}

// ---- baseVersion (U4 — publish-RPC optimistic concurrency) ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);

  test('begin pamti baseVersion; bez parametra = null', () => {
    const d = store.begin(S, L, V, sampleData(), 4);
    assert.strictEqual(d.baseVersion, 4);
    store.discard(S, L);
    const d2 = store.begin(S, L, V, sampleData());
    assert.strictEqual(d2.baseVersion, null);
    store.discard(S, L);
  });

  test('commitDone(newVersion) re-baselinea verziju; bez parametra je NE dira', () => {
    const d = store.begin(S, L, V, sampleData(), 4);
    store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', patch: { answer: 'v5' } });
    store.commitDone(S, L, 5);
    assert.strictEqual(d.baseVersion, 5);
    assert.strictEqual(d.dirty, false);
    store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', patch: { answer: 'opet' } });
    store.commitDone(S, L); // npr. stari pozivatelj bez verzije
    assert.strictEqual(d.baseVersion, 5, 'bez newVersion baseVersion ostaje');
    store.discard(S, L);
  });

  test('autosave-restore zadržava SVJEŽU baseVersion (ne onu iz vremena spremanja)', () => {
    const d1 = store.begin(S, L, V, sampleData(), 1);
    store.applyOp(S, L, { type: 'updateCard', catId: 'demand', id: 'aaa111', patch: { question: 'PREŽIVI' } });
    assert.strictEqual(d1.baseVersion, 1);
    // refresh: ista baza (fingerprint match, npr. tuđa objava identičnog sadržaja bumpa verziju)
    const store2 = loadStore(ls);
    const d2 = store2.begin(S, L, V, sampleData(), 7);
    assert.strictEqual(d2.restored, true);
    assert.strictEqual(d2.working.demand.flashcards[0].question, 'PREŽIVI');
    assert.strictEqual(d2.baseVersion, 7, 'publish mora ići sa svježom verzijom iz DB-a');
  });
}

// ---- U6: strukturne operacije (add / remove) — idempotentne ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  const d = store.begin(S, L, V, sampleData()); // flashcards: aaa111, bbb222

  test('addCard: dodaje na kraj, dobiva generiran id ako fali, dirty + op logiran', () => {
    const before = d.working.demand.flashcards.length;
    const r = store.applyOp(S, L, { type: 'addCard', catId: 'demand', item: { question: 'NOVA?', answer: 'DA' } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(d.working.demand.flashcards.length, before + 1);
    const added = d.working.demand.flashcards[before];
    assert.strictEqual(added.question, 'NOVA?');
    assert.ok(added.id && added.id.length === 6, 'nova kartica ima generiran 6-char id');
    assert.strictEqual(store.isDirty(S, L), true);
  });

  test('addCard IDEMPOTENTAN: isti op (isti id) dvaput → jedna kartica (guard po id)', () => {
    const op = { type: 'addCard', catId: 'demand', item: { id: 'new001', question: 'X?', answer: 'Y' } };
    store.applyOp(S, L, op);
    store.applyOpsTo(d.working, [op]); // replay (kao sibling/in-memory) NE smije duplirati
    assert.strictEqual(d.working.demand.flashcards.filter((c) => c.id === 'new001').length, 1);
  });

  test('addCard s op.at umeće na točan indeks; upisuje KOPIJU (op.item ≠ referenca u nizu)', () => {
    const item = { id: 'ins001', question: 'INS?', answer: 'A' };
    store.applyOp(S, L, { type: 'addCard', catId: 'demand', item: item, at: 0 });
    assert.strictEqual(d.working.demand.flashcards[0].id, 'ins001');
    d.working.demand.flashcards[0].answer = 'MUT';
    assert.strictEqual(item.answer, 'A', 'op.item ostaje netaknut kad se mijenja niz (kopija)');
  });

  test('removeCard po id: makne; IDEMPOTENTNO (drugi remove = no-op uspjeh, bez rušenja)', () => {
    assert.strictEqual(store.applyOp(S, L, { type: 'removeCard', catId: 'demand', id: 'ins001' }).ok, true);
    assert.strictEqual(d.working.demand.flashcards.some((c) => c.id === 'ins001'), false);
    assert.strictEqual(store.applyOp(S, L, { type: 'removeCard', catId: 'demand', id: 'ins001' }).ok, true);
  });

  test('removeFill po IDX (stavka bez id, DB pre-U2a)', () => {
    const before = d.working.demand.fillBlanks.length;
    assert.strictEqual(store.applyOp(S, L, { type: 'removeFill', catId: 'demand', idx: 0 }).ok, true);
    assert.strictEqual(d.working.demand.fillBlanks.length, before - 1);
  });

  test('addQuiz kreira niz ako kategorija nema mod (dodavanje sadržaja u prazan mod)', () => {
    const st2 = loadStore(fakeStorage());
    const dd = st2.begin('s2', 'l2', 'v2', { intro: { name: 'Intro', icon: 'fa-x', color: '#000' } });
    const r = st2.applyOp('s2', 'l2', { type: 'addQuiz', catId: 'intro', item: { id: 'z1', question: 'Q', options: ['a', 'b'], correct: 0 } });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(dd.working.intro.quiz.length, 1);
  });
}

// ---- U6: reorder (apsolutni redoslijed, nedestruktivan, idempotentan) ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  const d = store.begin(S, L, V, sampleData());
  store.applyOp(S, L, { type: 'addCard', catId: 'demand', item: { id: 'ccc333', question: 'Q3', answer: 'A3' } });

  test('reorderCards: apsolutni redoslijed po id (b, a, c)', () => {
    const r = store.applyOp(S, L, { type: 'reorderCards', catId: 'demand', order: ['bbb222', 'aaa111', 'ccc333'] });
    assert.strictEqual(r.ok, true);
    assert.deepStrictEqual(d.working.demand.flashcards.map((c) => c.id), ['bbb222', 'aaa111', 'ccc333']);
  });

  test('reorderCards: nelistane stavke ostaju NA KRAJU (nedestruktivno)', () => {
    store.applyOp(S, L, { type: 'reorderCards', catId: 'demand', order: ['ccc333'] });
    const ids = d.working.demand.flashcards.map((c) => c.id);
    assert.strictEqual(ids[0], 'ccc333');
    assert.deepStrictEqual(ids.slice(1).sort(), ['aaa111', 'bbb222']);
  });

  test('reorderCards IDEMPOTENTAN: ista lista dvaput = isto', () => {
    const order = ['aaa111', 'bbb222', 'ccc333'];
    store.applyOp(S, L, { type: 'reorderCards', catId: 'demand', order: order });
    const snap = d.working.demand.flashcards.map((c) => c.id).join(',');
    store.applyOpsTo(d.working, [{ type: 'reorderCards', catId: 'demand', order: order }]);
    assert.strictEqual(d.working.demand.flashcards.map((c) => c.id).join(','), snap);
  });
}

// ---- U6: strukturni sibling-sync — dvostruka primjena = jednom (čuva publish-put admin.js 439-443) ----

{
  const ls = fakeStorage();
  const store = loadStore(ls);
  store.begin(S, L, V, sampleData());
  store.applyOp(S, L, { type: 'addCard', catId: 'demand', item: { id: 'sib001', question: 'SIB?', answer: 'OK' } });
  store.applyOp(S, L, { type: 'removeCard', catId: 'demand', id: 'aaa111' });

  test('strukturni opovi: DVOSTRUKA applyOpsTo na sibling = kao JEDNOM (add-guard + remove-noop)', () => {
    const sibling = sampleData();
    store.applyOpsTo(sibling, store.opsOf(S, L));
    const once = JSON.stringify(sibling);
    store.applyOpsTo(sibling, store.opsOf(S, L)); // 2. prolaz (kad _adminCtx.data === window[var])
    assert.strictEqual(JSON.stringify(sibling), once);
    assert.strictEqual(sibling.demand.flashcards.some((c) => c.id === 'sib001'), true);
    assert.strictEqual(sibling.demand.flashcards.some((c) => c.id === 'aaa111'), false);
  });

  test('strukturni opovi na payloadu BEZ kategorije (examPractice-only red) → skipped, bez rušenja', () => {
    const other = { examPractice: { name: 'EP', icon: 'fa-x', color: '#000', flashcards: [] } };
    const r = store.applyOpsTo(other, store.opsOf(S, L));
    assert.strictEqual(r.applied, 0);
    assert.strictEqual(r.skipped, 2);
  });
}

console.log(`\ndraft-store: ${passed} prošlo, ${failed} palo\n`);
process.exit(failed ? 1 : 0);
