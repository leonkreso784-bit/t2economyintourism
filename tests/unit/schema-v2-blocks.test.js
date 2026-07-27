/* eslint-disable no-console */
// ===== Node unit test za schema v2 (U7d — learn-blokovi: schema + round-trip) =====
// Pokreni: node tests/unit/schema-v2-blocks.test.js
//
// Dokazuje TROJE:
//   ① subject-content.schema.json PRIHVAĆA v2 learn.blocks (svih 9 tipova + inline runs)
//      I DALJE prihvaća v1 learn.content (backward-compat unutar testa),
//   ② ODBIJA pokvarene blokove (nepoznat tip, višak polja, nedostaje required, loš enum boje,
//      video bez videoId/url, learn bez content/blocks),
//   ③ ROUND-TRIP: JSON.stringify → JSON.parse čuva blokove bit-točno i js/blocks-renderer.js
//      daje IDENTIČAN izlaz prije/poslije (= export:json + dual-read nose blokove, BUG-012 se
//      ne primjenjuje: blokovi su PODACI, ne funkcije).
//
// ajv config = isti kao scripts/validate-json-schema.js (draft-07, allErrors).

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
const clone = (o) => JSON.parse(JSON.stringify(o));

console.log('\n=== schema v2 — learn-blokovi (U7d) ===\n');

const ROOT = path.join(__dirname, '..', '..');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema', 'subject-content.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

// renderer (isti shim kao blocks-renderer.test.js)
const rcode = fs.readFileSync(path.join(ROOT, 'js', 'blocks-renderer.js'), 'utf8');
const win = {};
new Function('window', rcode)(win);
const R = win.renderBlocks;

// ── fixture: v2 dokument sa SVIH 9 tipova (mix inline string + runs) ──
const v2doc = {
  schemaVersion: 2,
  intro: {
    name: 'Uvod', icon: 'fa-book', color: '#6366f1',
    learn: {
      id: 'ln_intro',
      title: 'Uvod u temu',
      blocks: [
        { id: 'b1', type: 'heading', level: 2, text: 'Naslov' },
        { id: 'b2', type: 'paragraph', text: [{ text: 'Podebljano ', b: true }, { text: 'crveno', color: 'red' }, { text: ' i link', href: 'https://sokratstudy.com' }] },
        { id: 'b3', type: 'list', ordered: true, items: ['prva stavka', [{ text: 'druga', i: true }]] },
        { id: 'b4', type: 'callout', variant: 'tip', title: 'Savjet', text: 'Pazi na ovo.' },
        { id: 'b5', type: 'image', src: '/assets/dijagram.png', alt: 'dijagram', caption: 'Slika 1' },
        { id: 'b6', type: 'video', videoId: 'dQw4w9WgXcQ' },
        { id: 'b7', type: 'table', header: ['Pojam', 'Značenje'], rows: [['A', '1'], ['B', '2']] },
        { id: 'b8', type: 'formula', tex: 'a^2 + b^2 = c^2', display: true },
        { id: 'b9', type: 'legacy-html', html: '<p>stari <b>HTML</b> sadržaj</p>' }
      ]
    }
  }
};

// ── ① PRIHVAĆANJE ──
test('① schema PRIHVAĆA v2 dokument sa svih 9 tipova blokova', function () {
  const ok = validate(v2doc);
  assert.ok(ok, 'trebao valjan; greške: ' + JSON.stringify(validate.errors));
});

test('① i dalje PRIHVAĆA v1 (learn.content) — backward-compat', function () {
  const v1 = { intro: { name: 'Uvod', icon: 'fa-book', color: '#6366f1', learn: { content: '<p>stari sadržaj</p>' } } };
  assert.ok(validate(v1), 'v1 mora ostati valjan; greške: ' + JSON.stringify(validate.errors));
});

test('① inline kao goli string (ne samo runs) je valjan', function () {
  const d = clone(v2doc);
  d.intro.learn.blocks[1].text = 'običan tekst';
  assert.ok(validate(d), JSON.stringify(validate.errors));
});

test('① video preko "url" (ne videoId) je valjan', function () {
  const d = clone(v2doc);
  delete d.intro.learn.blocks[5].videoId;
  d.intro.learn.blocks[5].url = 'https://youtu.be/dQw4w9WgXcQ';
  assert.ok(validate(d), JSON.stringify(validate.errors));
});

// ── ② ODBIJANJE ──
function rejects(name, mutate) {
  test('② ODBIJA: ' + name, function () {
    const d = clone(v2doc);
    mutate(d);
    assert.ok(!validate(d), 'očekivao NEVALJAN, ali je prošao');
  });
}
rejects('nepoznat tip bloka', (d) => { d.intro.learn.blocks[0].type = 'nepostoji'; });
rejects('višak polja u bloku (additionalProperties)', (d) => { d.intro.learn.blocks[1].foo = 'x'; });
rejects('paragraph bez required "text"', (d) => { delete d.intro.learn.blocks[1].text; });
rejects('heading level izvan raspona (5 > max 4)', (d) => { d.intro.learn.blocks[0].level = 5; });
rejects('run s bojom izvan enuma', (d) => { d.intro.learn.blocks[1].text[1].color = 'ljubičasta'; });
rejects('run bez required "text"', (d) => { d.intro.learn.blocks[1].text = [{ b: true }]; });
rejects('callout variant izvan enuma', (d) => { d.intro.learn.blocks[3].variant = 'danger'; });
rejects('video bez videoId I bez url', (d) => { delete d.intro.learn.blocks[5].videoId; });
rejects('learn bez "content" i bez "blocks"', (d) => { d.intro.learn = { id: 'x' }; });

// ── ③ ROUND-TRIP (export:json + dual-read nose blokove) ──
test('③ round-trip: JSON.stringify→parse čuva blokove bit-točno', function () {
  const round = JSON.parse(JSON.stringify(v2doc));
  assert.deepStrictEqual(round, v2doc);
});

test('③ round-trip: renderer daje IDENTIČAN izlaz prije/poslije serijalizacije', function () {
  const round = JSON.parse(JSON.stringify(v2doc));
  const before = R(v2doc.intro.learn.blocks);
  const after = R(round.intro.learn.blocks);
  assert.strictEqual(before, after);
  assert.ok(before.length > 0, 'render mora nešto proizvesti');
});

test('③ round-trip: i schema-valjan i renderabilan (isti dokument)', function () {
  const round = JSON.parse(JSON.stringify(v2doc));
  assert.ok(validate(round), 'round-trip dokument mora ostati schema-valjan');
});

console.log('\n=== rezultat: ' + passed + ' prošlo / ' + failed + ' palo ===\n');
process.exit(failed ? 1 : 0);
