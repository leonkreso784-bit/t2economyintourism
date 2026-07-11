#!/usr/bin/env node
// scripts/add-item-ids.js — U2 (schema v2): dodaj stabilni `id` po stavci + `schemaVersion` po dokumentu.
// SURGICAL (esprima range-based): ubacuje samo nove retke, ČUVA formatiranje + komentare. Idempotentno.
// Cilja shape `const <name> = { <categoryKey>: { name, ..., flashcards:[..], quiz:[..], fillBlanks:[..], learn:{..} }, ... }`.
//   - dokument (root objekt)  → schemaVersion: 2
//   - svaka kategorija        → id
//   - svaka stavka u nizovima (flashcards/quiz/fillBlanks/...) → id
//   - learn objekt po kategoriji → id
// Usage: node scripts/add-item-ids.js <file.js> [--write]   (bez --write = dry-run: samo izvještaj)
'use strict';
const fs = require('fs');
const esprima = require('esprima');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
function genId(used) {
  let id;
  do { id = ''; for (let i = 0; i < 6; i++) id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; }
  while (used.has(id));
  used.add(id);
  return id;
}

const file = process.argv[2];
const doWrite = process.argv.includes('--write');
// `schemaVersion` je ODGOĐEN u U2b — top-level meta-ključ traži runtime meta-filter (inače `Object.keys(content)`
// iteracije ga tretiraju kao kategoriju). U2a dodaje SAMO id-jeve (inertni). Opt-in kad U2b doda runtime podršku:
const doSchemaVersion = process.argv.includes('--schema-version');
if (!file) { console.error('Usage: node scripts/add-item-ids.js <file.js> [--write]'); process.exit(1); }

const src = fs.readFileSync(file, 'utf8');
let ast;
try { ast = esprima.parseScript(src, { range: true }); }
catch (e) { console.error('PARSE ERROR:', e.message); process.exit(1); }

// Skupi već postojeće id-jeve (idempotencija + izbjegavanje kolizija)
const used = new Set();
for (const m of src.matchAll(/\bid:\s*["']([a-z0-9]{6})["']/g)) used.add(m[1]);

const inserts = [];               // {offset, text}
const counts = { schemaVersion: 0, category: 0, item: 0, learn: 0, skipped: 0 };

const hasProp = (obj, name) => obj.properties.some(p => p.key && (p.key.name === name || p.key.value === name));
function indentOf(obj) {
  if (!obj.properties.length) return '    ';
  const first = obj.properties[0];
  const lineStart = src.lastIndexOf('\n', first.range[0]) + 1;
  const linePrefix = src.slice(lineStart, first.range[0]);
  const m = linePrefix.match(/^[ \t]*/);   // SAMO vodeće bjeline (ako je prvo polje u istom retku kao `{`, ne povlači `{`)
  return m ? m[0] : '    ';
}
function addProp(obj, propText, kind) {
  if (obj.type !== 'ObjectExpression') return;
  const name = kind === 'schemaVersion' ? 'schemaVersion' : 'id';
  if (hasProp(obj, name)) { counts.skipped++; return; }
  const first = obj.properties[0];
  // Ako je prvo polje u ISTOM retku kao `{` (kompaktni stil) → ubaci inline (čuva additions-only, ne cijepa liniju).
  // Inače (brace sam u retku) → novi redak s istim uvlačenjem kao prvo polje.
  const sameLine = first && !src.slice(obj.range[0] + 1, first.range[0]).includes('\n');
  const text = sameLine ? ' ' + propText : '\n' + indentOf(obj) + propText;
  inserts.push({ offset: obj.range[0] + 1, text });
  counts[kind]++;
}

// Nađi SVE top-level `const/let/var <name> = {ObjectExpression}`
const roots = [];
for (const node of ast.body) {
  if (node.type === 'VariableDeclaration') {
    for (const d of node.declarations) if (d.init && d.init.type === 'ObjectExpression') roots.push(d.init);
  }
}
if (!roots.length) { console.error('Nema `const <name> = {...}` objekta u', file, '— čisto kompozicijski fajl (Object.assign referenci)? Nema što dodati.'); process.exit(2); }

// Kategorija = objekt s izravnim name+icon+color; dokument = mapa {ključ: kategorija}
const isCategory = (obj) => hasProp(obj, 'name') && hasProp(obj, 'icon') && hasProp(obj, 'color');

function processCategory(cat) {
  addProp(cat, `id: "${genId(used)}",`, 'category');
  for (const p of cat.properties) {
    if (p.value && p.value.type === 'ArrayExpression') {
      for (const el of p.value.elements) {
        if (el && el.type === 'ObjectExpression') addProp(el, `id: "${genId(used)}",`, 'item');
      }
    } else if (p.key && (p.key.name === 'learn' || p.key.value === 'learn') && p.value && p.value.type === 'ObjectExpression') {
      addProp(p.value, `id: "${genId(used)}",`, 'learn');
    }
  }
}

for (const root of roots) {
  if (isCategory(root)) {
    // Jedna kategorija (npr. final `examPractice`) — id + id-jevi stavki, BEZ schemaVersion (final ga naslijedi kroz Object.assign)
    processCategory(root);
  } else {
    // Dokument = mapa kategorija → (schemaVersion opcionalno) + id po kategoriji + id po stavci
    if (doSchemaVersion) addProp(root, 'schemaVersion: 2,', 'schemaVersion');
    for (const catProp of root.properties) {
      if (catProp.value && catProp.value.type === 'ObjectExpression') processCategory(catProp.value);
    }
  }
}

// Primijeni umetanja OD KRAJA prema početku (da se offseti ne pomaknu)
inserts.sort((a, b) => b.offset - a.offset);
let out = src;
for (const ins of inserts) out = out.slice(0, ins.offset) + ins.text + out.slice(ins.offset);

console.log(`\n${file}`);
console.log(`  schemaVersion: +${counts.schemaVersion}  kategorije: +${counts.category}  stavke: +${counts.item}  learn: +${counts.learn}  (preskočeno-već-imaju: ${counts.skipped})`);
console.log(`  ukupno novih id-jeva: ${counts.category + counts.item + counts.learn}`);

if (doWrite) {
  // re-parse rezultata kao sanity-check da je i dalje valjan JS
  try { esprima.parseScript(out, { range: true }); }
  catch (e) { console.error('  ✗ REZULTAT NIJE VALJAN JS — ne pišem:', e.message); process.exit(3); }
  fs.writeFileSync(file, out);
  console.log('  ✓ zapisano (+ re-parse OK)');
} else {
  console.log('  (dry-run — dodaj --write da primijeniš)');
}
