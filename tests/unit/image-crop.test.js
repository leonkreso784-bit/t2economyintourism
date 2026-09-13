/* eslint-disable no-console */
// ===== Node unit testovi za js/image-crop.js (F2/2 dopuna — izrez slike) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/image-crop.test.js)
//
// Mjeri se MATEMATIKA izreza, bez preglednika: `baseScale` (slika uvijek POKRIVA okvir),
// `clampOffset` (okvir nikad ne vidi prazninu — ni pri pomaku ni pri zumu), `sourceRect`
// (isječak u izvornim pikselima točno odgovara okviru) i `rezoom` (točka pod prstom pri zumu
// ostaje na istom pikselu). DOM-dio (modal, povlačenje) pokriva authed spec u pravom pregledniku.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== image-crop (F2/2 dopuna) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'image-crop.js'), 'utf8');
/** @type {{ SokratImageCrop?: any }} */
const win = {};
new Function('window', code)(win);
const C = win.SokratImageCrop;
const blizu = (a, b, eps) => Math.abs(a - b) <= (eps == null ? 1e-9 : eps);

test('baseScale: široka slika u kvadratni okvir → skala po VISINI (pokriva, ne stane)', () => {
  assert.strictEqual(C.baseScale(300, 300, 4000, 3000), 300 / 3000);
  assert.strictEqual(C.baseScale(300, 300, 3000, 4000), 300 / 3000);
});
test('baseScale: naslovna 3:1 iz portretne fotke → skala po ŠIRINI', () => {
  assert.strictEqual(C.baseScale(900, 300, 3000, 4000), 900 / 3000);
});
test('baseScale: neispravne dimenzije → 1 (ne dijeli nulom)', () => {
  assert.strictEqual(C.baseScale(300, 300, 0, 0), 1);
});

test('clampOffset: pomak preko ruba se zaustavi na rubu (okvir nikad ne vidi prazninu)', () => {
  // slika 400×300 @ s=1 u okviru 300×300 → x smije biti u [-100, 0], y točno 0
  assert.deepStrictEqual(C.clampOffset(50, 20, 300, 300, 400, 300, 1), { tx: 0, ty: 0 });
  assert.deepStrictEqual(C.clampOffset(-150, -5, 300, 300, 400, 300, 1), { tx: -100, ty: 0 });
  assert.deepStrictEqual(C.clampOffset(-40, 0, 300, 300, 400, 300, 1), { tx: -40, ty: 0 });
});
test('clampOffset: pri zumu 2× raspon pomaka raste s dimenzijom slike', () => {
  assert.deepStrictEqual(C.clampOffset(-1000, -1000, 300, 300, 400, 300, 2), { tx: -500, ty: -300 });
});

test('sourceRect: centrirana slika bez zuma → isječak je sredina izvorne slike', () => {
  const s = C.baseScale(300, 300, 4000, 3000); // 0.1 → prikaz 400×300
  const tx = (300 - 4000 * s) / 2, ty = 0;
  const r = C.sourceRect(tx, ty, 300, 300, s);
  assert.ok(blizu(r.sx, 500) && blizu(r.sy, 0) && blizu(r.sw, 3000) && blizu(r.sh, 3000), JSON.stringify(r));
});
test('sourceRect: zum 2× → isječak upola manji u izvornim pikselima', () => {
  const r = C.sourceRect(-100, -50, 300, 300, 0.2);
  assert.ok(blizu(r.sx, 500) && blizu(r.sy, 250) && blizu(r.sw, 1500) && blizu(r.sh, 1500), JSON.stringify(r));
});
test('sourceRect: omjer isječka = omjer okvira (3:1 ostaje 3:1)', () => {
  const r = C.sourceRect(-10, -10, 900, 300, 0.37);
  assert.ok(blizu(r.sw / r.sh, 3), String(r.sw / r.sh));
});

test('rezoom: točka pod prstom ostaje na istom pikselu slike', () => {
  const sOld = 0.5, sNew = 1.0, px = 120, py = 80, tx = -30, ty = -10;
  const imgPx = (px - tx) / sOld, imgPy = (py - ty) / sOld;       // piksel slike pod prstom PRIJE
  const r = C.rezoom(tx, ty, sOld, sNew, px, py);
  assert.ok(blizu((px - r.tx) / sNew, imgPx) && blizu((py - r.ty) / sNew, imgPy), JSON.stringify(r));
});
test('rezoom bez promjene skale → pomak nepromijenjen', () => {
  assert.deepStrictEqual(C.rezoom(-30, -10, 0.5, 0.5, 100, 100), { tx: -30, ty: -10 });
});
test('granice zuma: 1 do 4', () => {
  assert.strictEqual(C.ZOOM_MIN, 1);
  assert.strictEqual(C.ZOOM_MAX, 4);
});

console.log(`\n${passed} prošlo, ${failed} palo\n`);
process.exit(failed ? 1 : 0);
