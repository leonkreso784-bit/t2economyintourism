/* eslint-disable no-console */
// ===== Node unit test za js/loader.js — OPORAVAK PAKETA (BUG-051) =====
// Pokreni: node tests/unit/loader-retry.test.js
//
// ŠTO STOJI NA KOCKI: `paket(ime)` je idempotentan — drugi poziv vraća ISTO obećanje. To je
// točno dok obećanje uspije. Kad padne (mreža otkazala usred otvaranja lekcije), `ubaci()`
// uredno zaboravi pojedinačni URL, ali `paketi[ime]` je i dalje držao ODBIJENO obećanje: svaki
// sljedeći `paket('study')` vraćao je staru grešku bez ijednog zahtjeva prema mreži. Korisnik
// je gledao poruku „ne mogu učitati" i nakon što se mreža vratila — pomagalo je jedino F5.
//
// Lažni `document`: element pamti slušače, a `appendChild` ga stavi u red; test sam odluči
// hoće li mu javiti `error` ili `load`. Mreže nema, pa se broji ono što bi je dotaknulo:
// koliko je puta stvoren `<script>` za isti paket.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function testAsync(name, fn) {
  return fn().then(
    () => { passed++; console.log('  ✓ ' + name); },
    (e) => { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
  );
}

console.log('\n=== loader / oporavak paketa ===\n');

const ROOT = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(ROOT, 'js', 'loader.js'), 'utf8');

function lazniDom() {
  const red = [];                                   // ubačeni elementi, redom
  function element() {
    const slusaci = {};
    return {
      slusaci: slusaci,
      addEventListener: (tip, fn) => { slusaci[tip] = fn; },
      javi: function (tip) { if (slusaci[tip]) slusaci[tip]({}); }
    };
  }
  const doc = {
    createElement: () => element(),
    head: { appendChild: (el) => { red.push(el); } }
  };
  return { doc: doc, red: red };
}

function load() {
  const dom = lazniDom();
  const win = {};
  new Function('window', 'document', src)(win, dom.doc);
  return { L: win.SokratLoad, red: dom.red };
}

/** Pusti mikrozadatke da se slegnu (odbijanje putuje kroz `Promise.all`). */
function slegni() { return new Promise((r) => setTimeout(r, 0)); }

Promise.resolve()
  .then(() => testAsync('⛔ ODBIJENI PAKET SE ZABORAVLJA: drugi poziv ponovno skida, ne vraća staru grešku', function () {
    const { L, red } = load();
    // `polica` = jedna naša skripta, bez CDN-a — najmanji paket koji prolazi kroz `ubaci`.
    const prvi = L.paket('polica');
    assert.strictEqual(red.length, 1, 'prvi poziv mora ubaciti skriptu');
    red[0].javi('error');
    return prvi.then(
      () => { throw new Error('prvi poziv je morao PASTI'); },
      () => slegni()
    ).then(() => {
      const drugi = L.paket('polica');
      assert.strictEqual(red.length, 2, 'poslije pada drugi poziv MORA ponovno ubaciti skriptu (mreža se možda vratila)');
      red[1].javi('load');
      return drugi;                                  // i mora se RAZRIJEŠITI, ne naslijediti pad
    });
  }))

  .then(() => testAsync('uspio paket ostaje idempotentan — drugi poziv ne skida ništa', function () {
    const { L, red } = load();
    const prvi = L.paket('polica');
    red[0].javi('load');
    return prvi.then(() => {
      const drugi = L.paket('polica');
      assert.strictEqual(red.length, 1, 'uspio paket se ne smije skidati dvaput');
      assert.strictEqual(drugi, prvi, 'isto obećanje');
    });
  }))

  .then(() => {
    console.log('\nloader-retry: ' + passed + ' prošlo, ' + failed + ' palo\n');
    process.exit(failed ? 1 : 0);
  });
