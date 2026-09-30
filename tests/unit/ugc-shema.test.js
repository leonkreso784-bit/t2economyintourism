/* eslint-disable no-console */
// ===== Node unit test za schema/ugc-content.schema.json (F6 ②/0a — strogi profil osobnog sadržaja) =====
// Pokreni: node tests/unit/ugc-shema.test.js
//
// Isti primjeri (`tests/fixtures/ugc-sadrzaj.js`) idu i kroz BAZU (`npm run ugc:sadrzaj`, staging).
// Ovdje se mjeri samo shema, bez mreže — da CI vidi svaku izmjenu sheme koja propusti poznati napad
// ili odbije ono što Studio stvarno sprema.

const assert = require('assert');
const path = require('path');
const Ajv = require('ajv');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== ugc-shema (F6 ②/0a) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const shema = require(path.join(ROOT, 'schema', 'ugc-content.schema.json'));
const { prolazi, pada, jsonbText, valjanTocno } = require(path.join(ROOT, 'tests', 'fixtures', 'ugc-sadrzaj.js'));
const provjeri = new Ajv({ allErrors: false, allowUnionTypes: true }).compile(shema);

// Doseg: prazan popis bi dao zeleno bez ijedne tvrdnje.
test('primjeri postoje (≥ 10 valjanih, ≥ 30 zlonamjernih)', function () {
  assert.ok(prolazi.length >= 10, 'valjanih: ' + prolazi.length);
  assert.ok(pada.length >= 30, 'zlonamjernih: ' + pada.length);
});

for (const p of prolazi) {
  test('PROLAZI: ' + p.ime, function () {
    assert.ok(provjeri(p.payload), JSON.stringify(provjeri.errors && provjeri.errors[0]));
  });
}

let samoBaza = 0;
for (const p of pada) {
  if (p.samoBaza) { samoBaza++; continue; }
  test('PADA: ' + p.ime, function () {
    assert.strictEqual(provjeri(p.payload), false, 'shema ga je PROPUSTILA');
  });
}
test('preskočeni (samo baza zna provjeriti) su imenovani i malo ih je', function () {
  assert.ok(samoBaza >= 1 && samoBaza <= 3, 'samo-baza: ' + samoBaza);
});

// ── STRUKTURA sheme (brana-revizor 30.09., F1): pravilo „svaki objekt zatvoren, svaki niz i niz
// znakova ograničen" nabraja se iz SAME sheme, ne iz popisa primjera — nova definicija ili polje bez
// granice obara test čim se napiše. Iznimke su imenovane s razlogom.
const { UZORCI, broj } = require(path.join(ROOT, 'tests', 'fixtures', 'ugc-sadrzaj.js'));
/** Objekti bez `additionalProperties: false`, s razlogom. */
const OTVORENI = {
  '#': 'korijen: ključevi su lekcije — `propertyNames` ih ograničava, `additionalProperties` je shema lekcije',
  'block': 'razvodnik po tipu: zatvara ga svaki `oneOf` krak (blockHeading…)'
};
function obidji(s, put, fn) {
  if (!s || typeof s !== 'object') return;
  fn(s, put);
  for (const [k, v] of Object.entries(s)) {
    if (k === 'properties' || k === 'definitions') {
      for (const [ime, pod] of Object.entries(v)) obidji(pod, k === 'definitions' ? ime : put + '.' + ime, fn);
    } else if (k === 'items' || k === 'additionalProperties' || k === 'propertyNames' || k === 'not') obidji(v, put + '[' + k + ']', fn);
    else if (k === 'oneOf' || k === 'anyOf') v.forEach((x, i) => obidji(x, put + '|' + i, fn));
  }
}
test('struktura: svaki objekt zatvoren, svaki niz ima maxItems, svaki tekst ima granicu', function () {
  const nalazi = [];
  let obj = 0, niz = 0, tekst = 0;
  obidji(shema, '#', function (s, put) {
    if (s.type === 'object') { obj++; if (s.additionalProperties !== false && !OTVORENI[put]) nalazi.push(put + ': objekt bez additionalProperties:false'); }
    if (s.type === 'array') { niz++; if (typeof s.maxItems !== 'number') nalazi.push(put + ': niz bez maxItems'); }
    if (s.type === 'string') {
      tekst++;
      const ogranicen = typeof s.maxLength === 'number' || s.enum || s.const !== undefined
        || (typeof s.pattern === 'string' && /\{\d+(,\d+)?\}\$$/.test(s.pattern));
      if (!ogranicen) nalazi.push(put + ': tekst bez maxLength/enum/const/ograničenog uzorka');
    }
  });
  assert.deepStrictEqual(nalazi, []);
  assert.ok(obj >= 15 && niz >= 10 && tekst >= 20, 'obiđeno premalo: ' + obj + ' objekata, ' + niz + ' nizova, ' + tekst + ' tekstova');
});
test('struktura: svaka objektna definicija ima uzorak za generirane primjere', function () {
  const bez = Object.entries(shema.definitions)
    .filter(([ime, d]) => d.type === 'object' && d.properties && !OTVORENI[ime] && !UZORCI[ime]).map(([ime]) => ime);
  assert.deepStrictEqual(bez, []);
  assert.ok(broj.gen >= 40, 'generirano premalo zlonamjernih: ' + broj.gen + ' (izmjereno 30.09.: 50)');
});

// Katalog je NAMJERNO drukčiji profil: shema osobnog sadržaja ne smije postati katalogova.
test('katalogov legacy-html i learn.content NISU u profilu', function () {
  const txt = JSON.stringify(shema.definitions);
  assert.ok(!txt.includes('legacy-html'), 'legacy-html se pojavljuje u shemi');
  assert.ok(!shema.definitions.learn.properties.content, 'learn.content je dopušten');
});

// Graditelj granice od 1 MB mora biti točan, inače staging-brana mjeri krivu granicu.
test('jsonbText slaže ključeve kao Postgres (duljina pa bajtovi)', function () {
  assert.strictEqual(jsonbText({ bb: 1, a: [true, 'x'], ab: null }), '{"a": [true, "x"], "ab": null, "bb": 1}');
});
test('valjanTocno(1 MB) je točno 1 048 576 bajtova i prolazi shemu', function () {
  const p = valjanTocno(1048576);
  assert.strictEqual(Buffer.byteLength(jsonbText(p)), 1048576);
  assert.ok(provjeri(p), JSON.stringify(provjeri.errors && provjeri.errors[0]));
});

console.log('\n  ' + passed + ' prošlo, ' + failed + ' palo (' + samoBaza + ' samo-baza preskočeno)\n');
process.exit(failed ? 1 : 0);
