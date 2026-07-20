/* eslint-disable no-console */
// ===== U7c PARITY GATE — legacy-html pokrivenost (js/blocks-renderer.js DOMPURIFY_CFG) =====
// Pokreni: node tests/unit/legacy-html-coverage.test.js
//
// ZAŠTO: U7c rutira SAV learn (v1 = `legacy-html` blok) kroz DOMPurify. Ako allowlist ne pokriva
// tag/atribut koji naš sadržaj koristi → DOMPurify ga ostruže → VIZUALNA REGRESIJA na živom study-u.
// Ovaj gate izvuče SVE tagove/atribute iz learn.content svih predmeta (data/json) i dokaže da su
// pokriveni DOMPURIFY_CFG-om (single source of truth iz blocks-renderer.js). Pada ako budući sadržaj
// uvede nepokriveni tag/atribut → svjesna odluka (dopusti ILI prihvati da se izbaci).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== legacy-html coverage (U7c parity gate) ===\n');

// ── config iz stvarnog renderera (bez duplikata) ──
const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'blocks-renderer.js'), 'utf8');
const win = {};
new Function('window', code)(win);
const CFG = win.SokratBlocks._domPurifyConfig;
const ALLOWED_TAGS = new Set(CFG.ALLOWED_TAGS.map(function (t) { return t.toLowerCase(); }));
const ALLOWED_ATTR = new Set(CFG.ALLOWED_ATTR.map(function (a) { return a.toLowerCase(); }));

// ── poznati „safe-to-drop" (content-typosi / math-tekst tipa `x<z`): DOMPurify čuva VIDLJIVI tekst
//    (KEEP_CONTENT), a bogus atribut nema efekt → izostavljanje NE mijenja prikaz. Dokumentirano. ──
const KNOWN_DROP_TAGS = new Set(['z', 'avc']);
const KNOWN_DROP_ATTR = new Set(['mv']);

// ── skupi tagove/atribute iz learn.content svih predmeta ──
function categories(content) {
  if (!content || typeof content !== 'object') return [];
  return Object.keys(content).filter(function (k) {
    const v = content[k]; return v && typeof v === 'object' && !Array.isArray(v);
  });
}
const JSON_DIR = path.join(__dirname, '..', '..', 'data', 'json');
const usedTags = {};
const usedAttr = {};
let blocks = 0;
for (const subj of fs.readdirSync(JSON_DIR)) {
  const dir = path.join(JSON_DIR, subj);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    let payload;
    try { payload = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
    for (const cat of categories(payload)) {
      const html = payload[cat] && payload[cat].learn && payload[cat].learn.content;
      if (!html || typeof html !== 'string') continue;
      blocks++;
      const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
      let m;
      while ((m = tagRe.exec(html))) {
        const tag = m[1].toLowerCase();
        usedTags[tag] = (usedTags[tag] || 0) + 1;
        const attrRe = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=/g;
        let a;
        while ((a = attrRe.exec(m[2]))) { const at = a[1].toLowerCase(); usedAttr[at] = (usedAttr[at] || 0) + 1; }
      }
    }
  }
}

test('učitani learn-blokovi (sanity: > 400)', function () {
  assert.ok(blocks > 400, 'nađeno blokova: ' + blocks);
});

test('SVI korišteni tagovi su pokriveni (allowlist ∪ known-drop)', function () {
  const gaps = Object.keys(usedTags).filter(function (t) { return !ALLOWED_TAGS.has(t) && !KNOWN_DROP_TAGS.has(t); });
  assert.deepStrictEqual(gaps, [], 'NEPOKRIVENI tagovi (odluči: dopusti u DOMPURIFY_CFG ili dodaj u KNOWN_DROP): ' +
    gaps.map(function (t) { return t + '×' + usedTags[t]; }).join(', '));
});

test('SVI korišteni atributi su pokriveni (allowlist ∪ known-drop)', function () {
  const gaps = Object.keys(usedAttr).filter(function (a) { return !ALLOWED_ATTR.has(a) && !KNOWN_DROP_ATTR.has(a); });
  assert.deepStrictEqual(gaps, [], 'NEPOKRIVENI atributi (odluči: dopusti ili known-drop): ' +
    gaps.map(function (a) { return a + '×' + usedAttr[a]; }).join(', '));
});

test('kritični parity-atributi su u allowlisti (class + style)', function () {
  assert.ok(ALLOWED_ATTR.has('class'), 'class mora biti dopušten (naše CSS klase)');
  assert.ok(ALLOWED_ATTR.has('style'), 'style mora biti dopušten (331× inline stilova u v1)');
});

console.log('\n  (skenirano ' + blocks + ' learn-blokova; tagova=' + Object.keys(usedTags).length +
  ', atributa=' + Object.keys(usedAttr).length + ')');
console.log('\nlegacy-html coverage: ' + passed + ' prošlo, ' + failed + ' palo');
process.exit(failed ? 1 : 0);
