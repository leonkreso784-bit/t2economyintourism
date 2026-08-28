/* eslint-disable no-console */
// ===== Node unit testovi za CloudSync — cigla P4 (faza POLICA) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/cloud-sync.test.js)
//
// ⚠️ ZAŠTO P4 NE GRADI NIŠTA NEGO DOKAZUJE: sinkronizacija je offline-first od F-faze
// i radi. Ali cijela faza POLICA obećava učenje BEZ MREŽE, a to obećanje ima naličje
// koje dosad nitko nije mjerio: što se dogodi s tim napretkom kad se mreža vrati.
//
// Dva su načina da se napredak izgubi, i oba su tiha:
//   ① MERGE koji preferira udaljeno → sve naučeno offline nestane pri prvoj prijavi;
//   ② PUSH koji se označi kao obavljen iako je pao → promjena se nikad ne pošalje.
// Nijedan se ne vidi kao greška. Korisnik samo jednog dana ima manje nego jučer.
//
// `SokratAuth`, `localStorage` i `subjectDataMap` se u kodu referenciraju GOLO
// (leksički globali, v. CLAUDE.md), pa se ovdje predaju kao PARAMETRI funkcije —
// parametar zasjeni globalni pretražitelj imena. `setInterval` isto: bez njega bi
// `start()` ostavio pravi tajmer i Node ne bi izašao.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
function testAsync(name, fn) {
  return fn().then(
    () => { passed++; console.log('  ✓ ' + name); },
    (e) => { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
  );
}

console.log('\n=== cloud-sync (P4 · POLICA) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const KOD = fs.readFileSync(path.join(ROOT, 'js', 'cloud-sync.js'), 'utf8');

function lazniLocalStorage(pocetno) {
  const m = new Map(Object.entries(pocetno || {}));
  return {
    _m: m,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); }
  };
}

/**
 * Svježa instanca.
 * @param {object} o `{ ls, klijent, predmeti }`
 */
function load(o) {
  const opts = o || {};
  const ls = opts.ls || lazniLocalStorage();
  const slusaci = [];
  const win = { addEventListener: () => {}, t: null };
  const doc = { addEventListener: () => {}, visibilityState: 'visible' };
  const predmeti = opts.predmeti || { statistics: { storageKey: 'statistics-progress' } };
  const auth = {
    getClient: () => opts.klijent || null,
    setSyncInfo: () => {},
    onChange: (fn) => slusaci.push(fn)
  };
  const CS = new Function(
    'window', 'document', 'localStorage', 'subjectDataMap', 'SokratAuth', 'setInterval',
    KOD + '\n;return CloudSync;'
  )(win, doc, ls, predmeti, auth, () => 1);
  return { CS: CS, ls: ls };
}

const M = load().CS.mergeValues;

// ── PRAVILA SPAJANJA ───────────────────────────────────────────────────
test('brojači idu na MAX — offline naučeno ne smije pasti na udaljenu brojku', () => {
  assert.strictEqual(M(12, 5), 12);
  assert.strictEqual(M(5, 12), 12);
});

test('id-evi naučenih kartica idu u UNIJU, bez duplikata', () => {
  assert.deepStrictEqual(M(['a', 'b'], ['b', 'c']).sort(), ['a', 'b', 'c']);
});

test('polja koja nisu stringovi → pobjeđuje DULJE (npr. quizScores)', () => {
  assert.deepStrictEqual(M([{ s: 1 }], [{ s: 1 }, { s: 2 }]), [{ s: 1 }, { s: 2 }]);
  assert.deepStrictEqual(M([{ s: 1 }, { s: 2 }], [{ s: 3 }]), [{ s: 1 }, { s: 2 }]);
});

test('objekti se spajaju REKURZIVNO (napredak je ugniježđen po kategorijama)', () => {
  const spoj = M(
    { probability: { cardsStudied: 9, learned: ['p1'] } },
    { probability: { cardsStudied: 4, learned: ['p2'] } }
  );
  assert.strictEqual(spoj.probability.cardsStudied, 9);
  assert.deepStrictEqual(spoj.probability.learned.sort(), ['p1', 'p2']);
});

test('null/undefined s jedne strane → druga strana preživi cijela', () => {
  assert.deepStrictEqual(M(null, { a: 1 }), { a: 1 });
  assert.deepStrictEqual(M({ a: 1 }, null), { a: 1 });
  assert.deepStrictEqual(M(undefined, ['x']), ['x']);
});

// ── SVOJSTVO KOJE JE ZAPRAVO OBEĆANJE FAZE ─────────────────────────────
// Ne „vraća li točno ovo" nego „može li se išta izgubiti". Tvrdnja o REZULTATU
// ostari s podacima; tvrdnja o SVOJSTVU vrijedi za svaki ulaz.
test('⛔ BEZ GUBITKA: nijedna naučena kartica i nijedan brojač ne padaju spajanjem', () => {
  const lokalno = {                       // uređaj: učio u zrakoplovu
    cardsStudied: 40, quizzesTaken: 3, fillSolved: 7,
    flashcardsLearned: ['c1', 'c2', 'c3', 'c9'],
    lastStudy: '2026-08-28T10:00:00.000Z'
  };
  const udaljeno = {                      // oblak: stariji rad s drugog uređaja
    cardsStudied: 12, quizzesTaken: 9, fillSolved: 2,
    flashcardsLearned: ['c1', 'c5'],
    lastStudy: '2026-08-20T10:00:00.000Z'
  };

  [[lokalno, udaljeno], [udaljeno, lokalno]].forEach((par) => {
    const spoj = M(par[0], par[1]);
    ['cardsStudied', 'quizzesTaken', 'fillSolved'].forEach((k) => {
      assert.ok(spoj[k] >= lokalno[k], k + ' je pao ispod lokalnog: ' + spoj[k]);
      assert.ok(spoj[k] >= udaljeno[k], k + ' je pao ispod udaljenog: ' + spoj[k]);
    });
    lokalno.flashcardsLearned.concat(udaljeno.flashcardsLearned).forEach((id) => {
      assert.ok(spoj.flashcardsLearned.indexOf(id) !== -1, 'izgubljena kartica: ' + id);
    });
  });
});

test('⛔ OBRNUTO: spajanje NIJE „udaljeno pobjeđuje" (to bi pobrisalo sve naučeno offline)', () => {
  const spoj = M({ cardsStudied: 40 }, { cardsStudied: 0 });
  assert.notStrictEqual(spoj.cardsStudied, 0, 'udaljena nula ne smije pregaziti lokalnih 40');
  assert.strictEqual(spoj.cardsStudied, 40);
});

// ── SLANJE: pad mreže ne smije „potrošiti" promjenu ────────────────────
// Prekidac umjesto liste odgovora: `pullAndMerge()` na prijavi VEC potrosi jedan
// upsert, pa bi redoslijed odgovora tiho iskliznuo za jedan. Prva verzija ovog
// testa je pala upravo na tome i mjerila tudji poziv.
function lazniKlijent() {
  const o = {
    padaj: false,
    poslano: [],
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      upsert: (rows) => {
        o.poslano.push(rows);
        return Promise.resolve({ error: o.padaj ? { message: 'offline' } : null });
      }
    })
  };
  return o;
}

/** Pusti da se async lanac (`pullAndMerge`) slegne. */
function slegni() { return new Promise((r) => setTimeout(r, 30)); }

Promise.resolve()
  .then(() => testAsync('⛔ PAD SLANJA se ne označi kao uspjeh — promjena čeka i ide u sljedećem pokušaju', function () {
    // Drugi tihi način da napredak nestane: `snapshot` se pomakne iako upsert nije
    // prošao → ključ više nije „promijenjen" i nikad se ne pošalje. Korisnik ne vidi
    // ništa; napredak jednostavno ne stigne na drugi uređaj.
    const ls = lazniLocalStorage({ 'statistics-progress': JSON.stringify({ cardsStudied: 40 }) });
    const klijent = lazniKlijent();
    const { CS } = load({ ls: ls, klijent: klijent });

    CS.handleAuthChange({ id: 'u1' });
    return slegni().then(() => {
      const osnovica = klijent.poslano.length;   // ono što je poslao PULL, ne mi

      // Učenje offline: brojka naraste POSLIJE prijave, pa je ključ stvarno promijenjen.
      ls.setItem('statistics-progress', JSON.stringify({ cardsStudied: 55 }));
      klijent.padaj = true;

      return CS.pushNow().then(() => {
        assert.strictEqual(klijent.poslano.length, osnovica + 1, 'promjena mora otići na mrežu');
        klijent.padaj = false;
        return CS.pushNow().then(() => {
          assert.strictEqual(klijent.poslano.length, osnovica + 2, 'poslije pada se MORA pokušati ponovno');
          const zadnji = klijent.poslano[klijent.poslano.length - 1];
          const red = zadnji.filter((r) => r.key === 'statistics-progress')[0];
          assert.ok(red, 'ponovni pokušaj mora nositi isti ključ');
          assert.strictEqual(red.data.cardsStudied, 55, 'i podatke naučene offline');
        });
      });
    });
  }))

  .then(() => testAsync('uspješno slanje se NE ponavlja — inače bi svaki interval pisao isto', function () {
    const ls = lazniLocalStorage({ 'statistics-progress': JSON.stringify({ cardsStudied: 40 }) });
    const klijent = lazniKlijent();
    const { CS } = load({ ls: ls, klijent: klijent });

    CS.handleAuthChange({ id: 'u1' });
    return slegni().then(() => {
      ls.setItem('statistics-progress', JSON.stringify({ cardsStudied: 55 }));
      return CS.pushNow().then(() => {
        const poslije = klijent.poslano.length;
        return CS.pushNow().then(() => {
          assert.strictEqual(klijent.poslano.length, poslije, 'nepromijenjen ključ ne smije ponovno na mrežu');
        });
      });
    });
  }))

  .then(() => testAsync('⛔ POVRATAK MREŽE: prijava ne pregazi ono što je naučeno offline', function () {
    // Kriterij faze, doslovno: „uči offline i po povratku mreže mu se napredak spoji
    // bez gubitka". Udaljeni red je STARIJI (drugi uređaj) — naivan pull bi ga upisao
    // preko lokalnog i pojeo cijelu offline sesiju.
    const ls = lazniLocalStorage({
      'statistics-progress': JSON.stringify({ cardsStudied: 40, flashcardsLearned: ['c1', 'c9'] })
    });
    const poslano = [];
    const klijent = {
      from: () => ({
        select: () => Promise.resolve({
          data: [{ key: 'statistics-progress', data: { cardsStudied: 12, flashcardsLearned: ['c1', 'c5'] } }],
          error: null
        }),
        upsert: (rows) => { poslano.push(rows); return Promise.resolve({ error: null }); }
      })
    };
    const { CS } = load({ ls: ls, klijent: klijent });

    CS.handleAuthChange({ id: 'u1' });
    // `handleAuthChange` je sinkron ulaz u async lanac; pusti mikrozadatke da se slegnu.
    return slegni().then(() => {
      const spoj = JSON.parse(ls.getItem('statistics-progress'));
      assert.strictEqual(spoj.cardsStudied, 40, 'offline brojka je pregažena udaljenom');
      ['c1', 'c5', 'c9'].forEach((id) => {
        assert.ok(spoj.flashcardsLearned.indexOf(id) !== -1, 'izgubljena kartica: ' + id);
      });
      // I obrnuto: razlika mora otići GORE, inače drugi uređaj nikad ne sazna.
      assert.ok(poslano.length > 0, 'spojeno stanje se mora poslati natrag u oblak');
    });
  }))

  .then(() => {
    console.log('\n  ' + passed + ' prošlo, ' + failed + ' palo\n');
    process.exit(failed ? 1 : 0);
  });
