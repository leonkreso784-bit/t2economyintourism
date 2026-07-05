#!/usr/bin/env node
'use strict';
/**
 * build-css.js — F3 3B: konkatenira CSS module u JEDAN bundle (kraj @import waterfalla).
 *
 * ZAŠTO: `styles.css` je uvozio 26 modula preko `@import`. `@import` je render-blocking i
 * SEKVENCIJALAN: preglednik mora dohvatiti + isparsirati `styles.css` PA TEK OTKRIJE @importe →
 * pa ih dohvaća → glavni krivac Lighthouse perf 66 / LCP 6.6s / FCP 4.3s. Bundle = 1 request,
 * ISTI sadržaj u ISTOM redoslijedu → render bajt-identičan, ali FCP/LCP puno brži.
 *
 * IZVOR ISTINE ostaje `styles.css` (ručno uređivan @import manifest — definira red + nosi komentare)
 * + pojedinačni `css/*.css`. `styles.bundle.css` je GENERIRANO (kao data/json export) — commita se
 * (Vercel servira bez build-koraka) i čuva ga CI drift-gate.
 *
 * Konkatenacija je sigurna (provjereno): 0 relativnih `url()` (jedini je self-contained `data:` SVG),
 * 0 ugniježđenih `@import`, 0 `@charset`. Redoslijed kaskade = redoslijed @importa u `styles.css`.
 *
 * RABLJENJE:
 *   node scripts/build-css.js           # regeneriraj styles.bundle.css iz izvora
 *   node scripts/build-css.js --check   # CI gate: bundle u sinku s izvorima? (drift = exit 1)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'styles.css');
const OUT = path.join(ROOT, 'styles.bundle.css');
const OUT_REL = 'styles.bundle.css';

/** Izvuci uređeni popis modula iz @import redoslijeda u styles.css (token `?v=` se ignorira). */
function parseOrder() {
  const txt = fs.readFileSync(SRC, 'utf8');
  const re = /@import\s+url\(\s*['"]([^'"?]+)(?:\?[^'"]*)?['"]\s*\)/g;
  const files = [];
  let m;
  while ((m = re.exec(txt)) !== null) files.push(m[1].replace(/\\/g, '/'));
  return files;
}

/** Sagradi sadržaj bundlea (LF-normaliziran, deterministički). */
function build() {
  const files = parseOrder();
  const parts = [
    '/* =====================================================================\n' +
    ' * styles.bundle.css — GENERIRANO (scripts/build-css.js, F3 3B). NE UREĐUJ RUČNO.\n' +
    ' * Uredi css/*.css + redoslijed u styles.css, pa pokreni `npm run build:css`.\n' +
    ' * Bundle zamjenjuje 26 @import-a jednim requestom (perf: kraj render-blocking waterfalla).\n' +
    ' * ===================================================================== */\n'
  ];
  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.error('❌ @import cilja nepostojeću datoteku: ' + rel);
      process.exit(2);
    }
    const css = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').replace(/@charset[^;]*;/gi, '').trim();
    parts.push(`\n/* ==================== ${rel} ==================== */\n${css}\n`);
  }
  return { content: parts.join(''), count: files.length };
}

function main() {
  const check = process.argv.includes('--check');
  const { content, count } = build();

  if (check) {
    const onDisk = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : null;
    if (onDisk === content) {
      console.log(`✅ ${OUT_REL} u sinku s ${count} izvornih modula.`);
      process.exit(0);
    }
    console.error(`❌ DRIFT: ${OUT_REL} nije u sinku s css/*.css. Pokreni "npm run build:css".`);
    process.exit(1);
  }

  fs.writeFileSync(OUT, content);
  const kb = (Buffer.byteLength(content) / 1024).toFixed(1);
  console.log(`✅ ${OUT_REL} zgrađen iz ${count} modula (${kb} KB).`);
  console.log('   ⚠️ Cache-bump: pokreni `npm run bump` (styles.bundle.css token je u index.html).');
}

main();
