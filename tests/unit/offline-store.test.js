/* eslint-disable no-console */
// ===== Node unit test za SokratOffline (P1, faza POLICA) =====
// Pokreni: node tests/unit/offline-store.test.js
// Shim-obrazac (kao fill-blank-format/card-limits): klasična skripta kroz new Function.
// `SokratCatalog` se referencira GOLO (leksički globalni const, v. CLAUDE.md), pa se
// ovdje predaje kao PARAMETAR funkcije — parametar zasjeni globalni pretražitelj imena.
//
// ⚠️ ZAŠTO OVAJ TEST POSTOJI — dvije stvari koje se ne vide na ekranu:
//  ① Polovično skinut predmet je GORI od neskinutog: obeća offline, pa u zrakoplovnom
//    načinu padne na datoteci koja fali. Rollback se NE DA provjeriti klikom (traži
//    prekid mreže usred skidanja), a bez njega je cijela cigla lažno obećanje.
//  ② Popis „što se skida" mora se poklapati s onim što `content-loader.js` POSLIJE traži.
//    Zato se planovi vrte nad PRAVIM katalogom i provjeravaju protiv datoteka NA DISKU:
//    predmet čiji `resolve` pokazuje na nepostojeći JSON skinuo bi se „uspješno" i onda
//    offline ne bi radio.

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

console.log('\n=== offline-store (P1 · POLICA) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const KOD = fs.readFileSync(path.join(ROOT, 'js', 'offline-store.js'), 'utf8');
const { SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

const VER = '20260101000000';

// ── lažni uređaj ───────────────────────────────────────────────────────
function lazniLocalStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); }
  };
}

function lazniCaches() {
  const stores = {};
  return {
    _stores: stores,
    open(name) {
      if (!stores[name]) stores[name] = new Map();
      const m = stores[name];
      return Promise.resolve({
        put: (u, res) => { m.set(u, res); return Promise.resolve(); },
        delete: (u) => Promise.resolve(m.delete(u))
      });
    }
  };
}

// `pad` = skup URL-ova koji trebaju pasti; sve ostalo vraća 200 s duljinom `len`.
function lazniFetch(pad, len) {
  const pozivi = [];
  const f = (url, opts) => {
    pozivi.push({ url: url, method: (opts && opts.method) || 'GET' });
    if (pad && pad.indexOf(url) !== -1) {
      return Promise.resolve({ ok: false, status: 404, headers: { get: () => null }, clone() { return this; } });
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: (h) => (String(h).toLowerCase() === 'content-length' ? String(len) : null) },
      clone() { return this; }
    });
  };
  f.pozivi = pozivi;
  return f;
}

function noviWindow(opts) {
  const o = opts || {};
  const win = {
    CONTENT_VERSION: VER,
    localStorage: lazniLocalStorage(),
    caches: o.bezCaches ? undefined : lazniCaches(),
    fetch: o.fetch || lazniFetch([], 100)
  };
  new Function('window', 'SokratCatalog', KOD)(win, SokratCatalog);
  return win;
}

// ── izvoz ──────────────────────────────────────────────────────────────
test('izvezen na window sa svim ulazima', function () {
  const O = noviWindow().SokratOffline;
  ['plan', 'estimate', 'download', 'remove', 'get', 'list', 'human', 'mount'].forEach((k) => {
    assert.strictEqual(typeof O[k], 'function', k + ' mora postojati');
  });
  assert.strictEqual(O.CACHE, 'sokrat-offline', 'ime keša je BEZ verzije — inače ga sw.js briše pri deployu');
});

test('bez Cache Storagea modul se ne pravi da radi', function () {
  const O = noviWindow({ bezCaches: true }).SokratOffline;
  assert.strictEqual(O.supported, false);
});

// ── plan: što se skida ─────────────────────────────────────────────────
test('plan() za JSON-predmet vraća study-JSON-ove I codeScripts', function () {
  const O = noviWindow().SokratOffline;
  const urls = O.plan('statistics');
  // statistics: 3 resolve-vara + stat-lib.js + exercises.js
  assert.strictEqual(urls.length, 5, 'dobiveno: ' + urls.join(', '));
  assert.ok(urls.indexOf('data/json/statistics/statisticsM1.json?v=' + VER) !== -1);
  assert.ok(urls.indexOf('data/json/statistics/statisticsFinal.json?v=' + VER) !== -1);
});

test('⚠️ vježbe i njihov lib SE SKIDAJU — inače se skine predmet koji offline ne radi cijel', function () {
  const O = noviWindow().SokratOffline;
  const urls = O.plan('statistics');
  assert.ok(urls.indexOf('data/statistics/stat-lib.js?v=' + VER) !== -1, 'lib mora biti u planu');
  assert.ok(urls.indexOf('data/statistics/exercises.js?v=' + VER) !== -1, 'pack vježbi mora biti u planu');
});

test('svaki URL nosi ?v= — bez tokena bi se skinula datoteka koju loader nikad ne traži', function () {
  const O = noviWindow().SokratOffline;
  O.plan('statistics').forEach((u) => assert.ok(u.indexOf('?v=' + VER) !== -1, u));
});

test('nepoznat predmet → prazan plan (ne baca)', function () {
  const O = noviWindow().SokratOffline;
  assert.deepStrictEqual(O.plan('ovoga-nema'), []);
});

// ── obrnuta provjera nad PRAVIM katalogom ──────────────────────────────
test('OBRNUTO: za svaki predmet u katalogu svaka planirana datoteka postoji na disku', function () {
  const O = noviWindow().SokratOffline;
  const subjects = SokratCatalog.listSubjects ? SokratCatalog.listSubjects() : null;
  const ids = subjects ? subjects.map((s) => s.id) : require(path.join(ROOT, 'data', 'catalog.js')).SOKRAT_CATALOG.subjects.map((s) => s.id);
  assert.ok(ids.length >= 20, 'katalog mora imati predmete, dobiveno ' + ids.length);

  const fale = [];
  ids.forEach((id) => {
    const urls = O.plan(id);
    assert.ok(urls.length > 0, 'predmet bez ijedne datoteke za skidanje: ' + id);
    urls.forEach((u) => {
      const rel = u.split('?')[0];
      if (!fs.existsSync(path.join(ROOT, rel))) fale.push(id + ' → ' + rel);
    });
  });
  assert.strictEqual(fale.length, 0, 'planirano, a ne postoji:\n      ' + fale.join('\n      '));
});

// ── veličina ───────────────────────────────────────────────────────────
test('human() — ista pravila u testu i na ekranu', function () {
  const O = noviWindow().SokratOffline;
  assert.strictEqual(O.human(0), '');
  assert.strictEqual(O.human(512), '512 B');
  assert.strictEqual(O.human(1024), '1 KB');
  assert.strictEqual(O.human(320 * 1024), '320 KB');
  assert.strictEqual(O.human(1536 * 1024), '1.5 MB');
});

// ── asinkroni dio ──────────────────────────────────────────────────────
Promise.resolve()
  .then(() => testAsync('estimate() zbraja content-length i mjeri HEAD-om (ne skida)', function () {
    const f = lazniFetch([], 1000);
    const O = noviWindow({ fetch: f }).SokratOffline;
    return O.estimate('statistics').then((b) => {
      assert.strictEqual(b, 5000, '5 datoteka × 1000 B');
      assert.ok(f.pozivi.every((p) => p.method === 'HEAD'), 'procjena ne smije skidati tijela');
    });
  }))

  .then(() => testAsync('download() upiše sve datoteke i zapiše manifest', function () {
    const win = noviWindow({ fetch: lazniFetch([], 2048) });
    const O = win.SokratOffline;
    return O.download('statistics').then((zapis) => {
      assert.strictEqual(zapis.files, 5);
      assert.strictEqual(zapis.bytes, 5 * 2048);
      assert.strictEqual(zapis.v, VER, 'verzija se PAMTI — P3 na temelju nje odlučuje o zastarjelosti');
      assert.ok(zapis.at, 'datum mora postojati');
      assert.strictEqual(win.caches._stores['sokrat-offline'].size, 5);
      assert.strictEqual(O.get('statistics').bytes, 5 * 2048);
      assert.strictEqual(O.list().length, 1);
    });
  }))

  .then(() => testAsync('bez content-length veličina se mjeri iz TIJELA — nikad 0 koja laže', function () {
    // Nalaz iz preglednika: probni poslužitelj je odgovarao u komadima (chunked) i predmet
    // je dobio veličinu 0. Zaglavlje je prvi izvor, tijelo je rezerva.
    const bezZaglavlja = (url, opts) => Promise.resolve({
      ok: true, status: 200,
      headers: { get: () => null },
      blob: () => Promise.resolve({ size: 777 }),
      clone() { return this; }
    });
    const win = noviWindow({ fetch: bezZaglavlja });
    return win.SokratOffline.download('statistics').then((zapis) => {
      assert.strictEqual(zapis.bytes, 5 * 777, 'veličina mora doći iz tijela kad zaglavlja nema');
    });
  }))

  .then(() => testAsync('⛔ ROLLBACK: padne li JEDNA datoteka, ne ostaje NIŠTA — ni keš ni manifest', function () {
    const win = noviWindow({});
    const O = win.SokratOffline;
    const pad = O.plan('statistics')[3];            // padne tek ČETVRTA — tri su već upisane
    win.fetch = lazniFetch([pad], 2048);
    return O.download('statistics').then(
      () => { throw new Error('skidanje je moralo pasti'); },
      () => {
        const store = win.caches._stores['sokrat-offline'];
        assert.strictEqual(store ? store.size : 0, 0, 'djelomično skinute datoteke moraju nestati');
        assert.strictEqual(O.get('statistics'), null, 'manifest NE SMIJE tvrditi da je predmet skinut');
        assert.strictEqual(O.list().length, 0);
      }
    );
  }))

  .then(() => testAsync('remove() briše i bajtove i zapis', function () {
    const win = noviWindow({ fetch: lazniFetch([], 512) });
    const O = win.SokratOffline;
    return O.download('statistics')
      .then(() => O.remove('statistics'))
      .then(() => {
        assert.strictEqual(win.caches._stores['sokrat-offline'].size, 0);
        assert.strictEqual(O.get('statistics'), null);
      });
  }))

  .then(() => testAsync('⛔ POSLIJE DEPLOYA: uklanjanje briše ono što je STVARNO upisano, ne svježi plan', function () {
    // Nadjeno samopregledom, ne testom: `plan()` ovisi o CONTENT_VERSION-u. Promijeni li se
    // token (svaki deploy), plan pokazuje na DRUGE adrese nego sto je u kesu — brisanje po
    // planu bi obrisalo zapis, a bajtove ostavilo nedosezne na uredjaju ZAUVIJEK.
    const ls = lazniLocalStorage();
    const caches1 = lazniCaches();
    const w1 = { CONTENT_VERSION: VER, localStorage: ls, caches: caches1, fetch: lazniFetch([], 100) };
    new Function('window', 'SokratCatalog', KOD)(w1, SokratCatalog);
    return w1.SokratOffline.download('statistics').then(() => {
      assert.strictEqual(caches1._stores['sokrat-offline'].size, 5);
      // deploy: novi token, ISTI uredjaj (isti localStorage, isti kes)
      const w2 = { CONTENT_VERSION: '20990101000000', localStorage: ls, caches: caches1, fetch: lazniFetch([], 100) };
      new Function('window', 'SokratCatalog', KOD)(w2, SokratCatalog);
      assert.notDeepStrictEqual(w2.SokratOffline.plan('statistics'), w1.SokratOffline.plan('statistics'), 'plan se MORA razlikovati, inace test nista ne mjeri');
      return w2.SokratOffline.remove('statistics').then(() => {
        assert.strictEqual(caches1._stores['sokrat-offline'].size, 0, 'bajtovi moraju otici, ne samo zapis');
        assert.strictEqual(w2.SokratOffline.get('statistics'), null);
      });
    });
  }))

  .then(() => testAsync('manifest preživi novi window (isti localStorage) — skinuto se pamti', function () {
    const ls = lazniLocalStorage();
    const w1 = { CONTENT_VERSION: VER, localStorage: ls, caches: lazniCaches(), fetch: lazniFetch([], 64) };
    new Function('window', 'SokratCatalog', KOD)(w1, SokratCatalog);
    return w1.SokratOffline.download('statistics').then(() => {
      const w2 = { CONTENT_VERSION: VER, localStorage: ls, caches: lazniCaches(), fetch: lazniFetch([], 64) };
      new Function('window', 'SokratCatalog', KOD)(w2, SokratCatalog);
      assert.ok(w2.SokratOffline.get('statistics'), 'zapis se mora pročitati u novoj sesiji');
    });
  }))

  .then(() => {
    console.log('\n  ' + passed + ' prošlo, ' + failed + ' palo\n');
    process.exit(failed ? 1 : 0);
  });
