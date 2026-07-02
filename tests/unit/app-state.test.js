/* eslint-disable no-console */
// ===== Node unit testovi za js/app-state.js (F2 2C — AppState namespace) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/app-state.test.js)
// Bez frameworka — mali runner + node assert. app-state.js je klasična skripta (IIFE
// na `window`) pa je učitavamo kroz vm sandbox s window-shimom.
// Čuva OBLIK namespacea: točan skup grupa + početne vrijednosti identične config.js
// `let`-ovima koje grupe zamjenjuju (FOUNDATION_PLAN §2C).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== app-state ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'app-state.js'), 'utf8');
/** @type {{ AppState?: any }} */
const windowShim = {};
// ISTI realm (ne vm.runInNewContext) — inače deepStrictEqual pada na cross-realm Object.prototype.
new Function('window', code)(windowShim);
const state = windowShim.AppState;

test('window.AppState postoji i objekt je', () => {
  assert.ok(state && typeof state === 'object' && !Array.isArray(state));
});

test('točan skup grupa (nav/cards/quiz/fill/session) — ni manje ni više', () => {
  assert.deepStrictEqual(Object.keys(state).sort(), ['cards', 'fill', 'nav', 'quiz', 'session']);
});

test('nav — početne vrijednosti = config.js currentPage/…', () => {
  assert.deepStrictEqual(state.nav, {
    page: 'landing', subject: null, lesson: null, data: null, section: 'home', category: 'all'
  });
});

test('cards — početne vrijednosti = config.js flashcards/…', () => {
  assert.deepStrictEqual(state.cards, { deck: [], index: 0, known: [], unknown: [] });
});

test('quiz — početne vrijednosti = config.js quizQuestions/…', () => {
  assert.deepStrictEqual(state.quiz, {
    questions: [], index: 0, correct: 0, wrong: 0, startTime: null,
    wrongList: [], shuffledOptions: [], shuffledCorrectIndex: 0, answers: []
  });
});

test('fill — početne vrijednosti = config.js fillQuestions/…', () => {
  assert.deepStrictEqual(state.fill, { questions: [], index: 0, correct: 0, wrong: 0 });
});

test('session — početna vrijednost = config.js sessionStartTime', () => {
  assert.deepStrictEqual(state.session, { startTime: null });
});

test('grupe su mutabilne (namespace nije zamrznut — polja se reasignaju u runtimeu)', () => {
  state.fill.index = 3;
  assert.strictEqual(state.fill.index, 3);
  state.fill.index = 0;
});

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
if (failed > 0) process.exit(1);
