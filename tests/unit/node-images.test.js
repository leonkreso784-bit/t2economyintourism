/* eslint-disable no-console */
// ===== Node unit testovi za js/node-images.js (F4 — privatne slike osobnog gradiva) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/node-images.test.js)
// Isti obrazac kao my-materials.test.js: klasična skripta kroz window-shim (new Function).
// Testiraju se ČISTE funkcije (bez mreže): oznaka ↔ putanja · newPath · collectPaths ·
// resolveBlock/resolveBlocks (kopija-semantika + fail-safe) · clear.
//
// Mrežni dio (potpisivanje, RLS) pokriva `npm run test:storage` protiv staginga.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== node-images (F4) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'node-images.js'), 'utf8');

/** Svježa instanca modula (bez SokratAuth → mrežne staze vraćaju prazno, što i testiramo). */
function load() {
  /** @type {{ SokratNodeImages?: any }} */
  const win = {};
  new Function('window', code)(win);
  return win.SokratNodeImages;
}

// ---------------------------------------------------------------- oznaka ↔ putanja
{
  const NI = load();
  test('isMarker prepoznaje samo `node-img:` prefiks', () => {
    assert.strictEqual(NI.isMarker('node-img:u/n/a.png'), true);
    assert.strictEqual(NI.isMarker('https://cdn/x.png'), false);
    assert.strictEqual(NI.isMarker('data:image/png;base64,AAA'), false);
    assert.strictEqual(NI.isMarker(''), false);
    assert.strictEqual(NI.isMarker(null), false);
    assert.strictEqual(NI.isMarker(undefined), false);
    assert.strictEqual(NI.isMarker(123), false);
  });
  test('isMarker ne pada na oznaku u SREDINI (prefiks, ne substring)', () => {
    assert.strictEqual(NI.isMarker('https://x/?u=node-img:a'), false);
  });
  test('pathOf / marker su inverzni', () => {
    const p = 'uid-1/node-2/abc.png';
    assert.strictEqual(NI.pathOf(NI.marker(p)), p);
    assert.strictEqual(NI.pathOf('https://cdn/x.png'), '');
  });
}

// ---------------------------------------------------------------- newPath
{
  const NI = load();
  test('newPath = <uid>/<node>/<uuid>.<ext> i počinje vlasnikom (RLS gleda 1. segment)', () => {
    const p = NI.newPath('U-1', 'N-2', 'png');
    const seg = p.split('/');
    assert.strictEqual(seg.length, 3, 'tri segmenta, got: ' + p);
    assert.strictEqual(seg[0], 'U-1');
    assert.strictEqual(seg[1], 'N-2');
    assert.ok(/\.png$/.test(seg[2]), 'ekstenzija: ' + seg[2]);
  });
  test('newPath je jedinstven po pozivu', () => {
    assert.notStrictEqual(NI.newPath('U', 'N', 'jpg'), NI.newPath('U', 'N', 'jpg'));
  });
}

// ---------------------------------------------------------------- collectPaths
{
  const NI = load();
  const payload = {
    sekcija1: {
      name: 'Prva',
      learn: { blocks: [
        { type: 'paragraph', text: 'bok' },
        { type: 'image', src: 'node-img:U/N/a.png' },
        { type: 'image', src: 'https://cdn.example/vanjska.png' },   // NIJE naša — ignoriraj
      ] },
      flashcards: [{ question: 'q', answer: 'a' }],
    },
    sekcija2: {
      learn: { blocks: [
        { type: 'image', src: 'node-img:U/N/b.png' },
        { type: 'image', src: 'node-img:U/N/a.png' },                // duplikat
      ] },
    },
  };

  test('collectPaths nađe sve oznake, dubinski, bez duplikata', () => {
    const out = NI.collectPaths(payload).slice().sort();
    assert.deepStrictEqual(out, ['U/N/a.png', 'U/N/b.png']);
  });
  test('collectPaths ignorira vanjske URL-ove i ne-slike', () => {
    assert.ok(NI.collectPaths(payload).every((p) => p.indexOf('http') !== 0));
  });
  test('collectPaths na praznom/čudnom ulazu vraća prazno (ne baca)', () => {
    assert.deepStrictEqual(NI.collectPaths({}), []);
    assert.deepStrictEqual(NI.collectPaths(null), []);
    assert.deepStrictEqual(NI.collectPaths('string'), []);
    assert.deepStrictEqual(NI.collectPaths([{ type: 'image', src: 'node-img:x/y/z.png' }]), ['x/y/z.png']);
  });
}

// ---------------------------------------------------------------- resolve (fail-safe + kopija)
{
  const NI = load();
  const block = { type: 'image', src: 'node-img:U/N/a.png', alt: 'slika', width: 60 };

  test('bez potpisa u cacheu resolveBlock vraća ISTI objekt (renderer ga fail-safe izostavi)', () => {
    assert.strictEqual(NI.resolveBlock(block), block);
  });

  test('note() → resolveBlock vraća KOPIJU s potpisom, original je netaknut', () => {
    NI.note('U/N/a.png', 'https://sb/storage/v1/object/sign/node-images/U/N/a.png?token=T');
    const r = NI.resolveBlock(block);
    assert.notStrictEqual(r, block, 'mora biti kopija, ne mutacija');
    assert.strictEqual(r.src, 'https://sb/storage/v1/object/sign/node-images/U/N/a.png?token=T');
    assert.strictEqual(block.src, 'node-img:U/N/a.png', 'ORIGINAL (payload) mora zadržati oznaku');
    assert.strictEqual(r.alt, 'slika', 'ostala polja se prenose');
    assert.strictEqual(r.width, 60);
  });

  test('ne-slike i vanjski URL-ovi prolaze nedirnuti (ista referenca)', () => {
    const p = { type: 'paragraph', text: 'x' };
    const ext = { type: 'image', src: 'https://cdn/x.png' };
    assert.strictEqual(NI.resolveBlock(p), p);
    assert.strictEqual(NI.resolveBlock(ext), ext);
  });

  test('resolveBlocks bez ijedne oznake vraća ISTI niz (bez suvišne kopije)', () => {
    const arr = [{ type: 'paragraph', text: 'a' }, { type: 'image', src: 'https://cdn/x.png' }];
    assert.strictEqual(NI.resolveBlocks(arr), arr);
  });

  test('resolveBlocks s oznakom vraća NOV niz, stari netaknut', () => {
    const arr = [block, { type: 'paragraph', text: 'a' }];
    const out = NI.resolveBlocks(arr);
    assert.notStrictEqual(out, arr);
    assert.ok(out[0].src.indexOf('token=') > -1);
    assert.strictEqual(arr[0].src, 'node-img:U/N/a.png');
    assert.strictEqual(out[1], arr[1], 'nedirnuti blokovi zadržavaju referencu');
  });

  test('resolveBlocks na ne-nizu vraća ulaz nepromijenjen', () => {
    assert.strictEqual(NI.resolveBlocks(null), null);
    assert.strictEqual(NI.resolveBlocks(undefined), undefined);
  });

  test('clear() briše potpise → opet fail-safe', () => {
    NI.clear();
    assert.strictEqual(NI.resolveBlock(block), block);
  });
}

// ---------------------------------------------------------------- bez klijenta (offline/odjavljen)
// PAŽNJA: `test()` je sinkron — async tijelo bi mu uvijek bilo zeleno (promise se ne čeka).
// Zato asinkrone provjere idu kroz `atest`, koji se ČEKA prije zbroja.
async function atest(name, fn) {
  try { await fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

(async () => {
  const NI = load();
  await atest('prefetch bez SokratAutha ne baca i vrati 0', async () => {
    const n = await NI.prefetch({ s: { learn: { blocks: [{ type: 'image', src: 'node-img:U/N/a.png' }] } } });
    assert.strictEqual(n, 0);
  });
  await atest('sign bez SokratAutha ne baca i vrati null', async () => {
    assert.strictEqual(await NI.sign('U/N/a.png'), null);
  });

  console.log(`\n${passed} prošlo, ${failed} palo\n`);
  process.exit(failed ? 1 : 0);
})();
