#!/usr/bin/env node
'use strict';
/**
 * build-css.js — gradi `styles.bundle.css` iz `css/app.css` preko Tailwind v4 CLI-ja.
 *
 * POVIJEST (zašto skripta uopće postoji): `styles.css` je uvozio 26 modula preko `@import`.
 * `@import` je render-blocking i SEKVENCIJALAN → glavni krivac za Lighthouse perf 66 / LCP 6.6s.
 * F3 3B je uveo konkatenaciju u JEDAN bundle: 1 request, isti sadržaj, isti redoslijed.
 *
 * ŠTO SE PROMIJENILO U C1: konkatenaciju je preuzeo Tailwind CLI, koji uz naše module u isti
 * izlaz slaže i dizajn-tokene (`css/tokens.css`) i generirane utilityje. Manifest je preselio iz
 * `styles.css` u **`css/app.css`** — jedan ulaz, jedan izlaz, bez dvije liste koje se razilaze.
 * Redoslijed kaskade i vrijednosti su nepromijenjeni; obrazloženje slojeva je u `css/app.css`.
 *
 * IZVOR ISTINE = `css/app.css` + `css/*.css`. `styles.bundle.css` je GENERIRANO (kao data/json
 * export) — commita se (Vercel servira bez build-koraka) i čuva ga CI drift-gate.
 *
 * ⚠️ Tailwind provlači i NAŠ CSS kroz Lightning CSS, koji izlaz normalizira i briše komentare.
 * To je promjena BAJTOVA bundlea, ne promjena RENDERA (mjereno u C1: computed-style diff kroz
 * pravi preglednik, 0 razlika). Komentari žive u `css/*.css`, gdje ih se i čita.
 *
 * RABLJENJE:
 *   node scripts/build-css.js           # regeneriraj styles.bundle.css
 *   node scripts/build-css.js --check   # CI gate: bundle u sinku s izvorima? (drift = exit 1)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'css', 'app.css');
const SRC_REL = 'css/app.css';
const OUT = path.join(ROOT, 'styles.bundle.css');
const OUT_REL = 'styles.bundle.css';
const TMP_DIR = path.join(ROOT, '.cache');

/**
 * Moduli koji NAMJERNO nisu u manifestu (svaki mora imati razlog — inače je zaboravljen import
 * tihi gubitak stila). `app.css`/`tokens.css` su sam manifest; `legal.css`/`consent.css` se
 * učitavaju zasebnim `<link>`-om na stranicama koje bundle uopće ne uzimaju.
 */
const NOT_IN_BUNDLE = {
  'css/app.css': 'sam manifest (ulaz)',
  'css/tokens.css': 'tokeni — manifest ga uvozi prvi',
  'css/legal.css': 'contact/faq/privacy/terms ga učitavaju zasebno (ne uzimaju bundle)',
  'css/consent.css': 'consent banner — zaseban <link> u svakoj stranici',
};

/** Popis svih `css/**.css` u repozitoriju (POSIX putanje, relativno na ROOT). */
function allCssModules() {
  const out = [];
  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir)).sort()) {
      const rel = prefix + entry;
      if (fs.statSync(path.join(ROOT, dir, entry)).isDirectory()) walk(dir + '/' + entry, rel + '/');
      else if (entry.endsWith('.css')) out.push(rel);
    }
  };
  walk('css', 'css/');
  return out;
}

/** Moduli koje manifest stvarno uvozi (relativni `@import "./x.css"` → `css/x.css`). */
function importedModules() {
  const txt = fs.readFileSync(SRC, 'utf8');
  const re = /@import\s+["']\.\/([^"']+\.css)["']/g;
  const out = [];
  let m;
  while ((m = re.exec(txt)) !== null) out.push('css/' + m[1]);
  return out;
}

/**
 * Nijedan `css/*.css` ne smije tiho ispasti iz izlaza. Bez ove provjere novi modul koji se
 * zaboravi uvezti izgleda kao „stil ne radi", a uzrok je jedan redak koji nedostaje u manifestu.
 */
function checkManifestCoverage() {
  const imported = new Set(importedModules());
  const orphans = allCssModules().filter((f) => !imported.has(f) && !NOT_IN_BUNDLE[f]);
  if (orphans.length) {
    console.error(`❌ ${orphans.length} CSS modul(a) nije ni u manifestu ni na popisu iznimaka:`);
    orphans.forEach((f) => console.error('   • ' + f));
    console.error(`   Dodaj @import u ${SRC_REL} ILI upiši razlog u NOT_IN_BUNDLE (scripts/build-css.js).`);
    process.exit(2);
  }
}

/** Putanja do Tailwind CLI ulaza (bin iz package.json — ne ovisi o npx-u ni o PATH-u). */
function tailwindBin() {
  let pkgPath;
  try {
    pkgPath = require.resolve('@tailwindcss/cli/package.json');
  } catch (e) {
    console.error('❌ `@tailwindcss/cli` nije instaliran. Pokreni `npm ci` (devDependency).');
    process.exit(2);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.tailwindcss;
  return { bin: path.resolve(path.dirname(pkgPath), rel), version: pkg.version };
}

/** Pokreni CLI i vrati LF-normaliziran sadržaj izlaza. */
function compile() {
  const { bin, version } = tailwindBin();
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const tmp = path.join(TMP_DIR, 'styles.bundle.build.css');
  const res = spawnSync(process.execPath, [bin, '--input', SRC, '--output', tmp], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (res.status !== 0) {
    console.error('❌ Tailwind CLI je pao:\n' + (res.stderr || res.stdout || '(bez izlaza)'));
    process.exit(2);
  }
  if (!fs.existsSync(tmp)) {
    console.error('❌ Tailwind CLI nije proizveo izlaz.');
    process.exit(2);
  }
  const content = fs.readFileSync(tmp, 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';
  fs.unlinkSync(tmp);
  return { content, version };
}

function main() {
  const check = process.argv.includes('--check');
  checkManifestCoverage();
  const { content, version } = compile();
  const modules = importedModules().length;

  if (check) {
    const onDisk = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : null;
    if (onDisk === content) {
      console.log(`✅ ${OUT_REL} u sinku s ${modules} modula + tokenima (tailwindcss ${version}).`);
      process.exit(0);
    }
    console.error(`❌ DRIFT: ${OUT_REL} nije u sinku s izvorima. Pokreni "npm run build:css".`);
    process.exit(1);
  }

  fs.writeFileSync(OUT, content);
  const kb = (Buffer.byteLength(content) / 1024).toFixed(1);
  console.log(`✅ ${OUT_REL} zgrađen iz ${modules} modula + tokena (${kb} KB, tailwindcss ${version}).`);
  console.log('   ⚠️ Cache-bump: pokreni `npm run bump` (styles.bundle.css token je u index.html).');
}

main();
