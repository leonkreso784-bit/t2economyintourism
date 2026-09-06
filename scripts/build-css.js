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
 * ⚠️ F1/8 ① (2026-09-05): POSLIJE Tailwinda svako `:hover` pravilo završi u `@media (hover: hover)`
 * na istom mjestu kaskade (`scripts/hover-css.js` — zašto i kako je ondje). Na dodiru hover
 * ne postoji, pa se poslije prelaska ništa ne „lijepi" za prst; na mišu 0 razlika (css:diff +
 * hover-probe). Čuva ga `npm run check:hover`. Legal/consent NISU u bundleu → omot ručan.
 * ⚠️ F1/8 ② (2026-09-05): isti prolaz svakom hover-selektoru doda prefiks
 * `:where(:root:not([data-hover-paused]))` (nula specifičnosti) — `pauzirajHover()` u `js/utils.js`
 * stavi taj atribut kad se mijenja ono što je pod mišem, prvi `pointermove` ga skine. Na mišu
 * poslije klika ništa ne svijetli dok se miš ne pomakne (`hover-probe --profil=prelaz`).
 *
 * RABLJENJE:
 *   node scripts/build-css.js           # regeneriraj styles.bundle.css
 *   node scripts/build-css.js --check   # CI gate: bundle u sinku s izvorima? (drift = exit 1)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { zamotaj: zamotajHover } = require('./hover-css');

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
  'css/tokens.static.css': 'GENERIRAN ovim skriptom (izvadak :root iz bundlea) — nije izvor; uvoz bi ga udvostručio',
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
  const sirovo = fs.readFileSync(tmp, 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';
  fs.unlinkSync(tmp);
  // F1/8 ①: gola `:hover` pravila → `@media (hover: hover)`, u tekstu, po lightningcss `loc`.
  // Baca ako ijedno ostane golo ili se ijedan hover-selektor izgubi (obrnuta provjera u modulu).
  const hover = zamotajHover(sirovo, OUT_REL);
  return { content: hover.css, version, hover };
}

/* ── drugi izlaz: samo tokeni, za stranice bez bundlea ────────────────────────
 * `privacy/terms/faq/contact.html` NE učitavaju `styles.bundle.css` (samostalne
 * su i brze), pa im je paleta dotad bila PREPISANA kao hex u `css/legal.css`.
 * Dva mjesta za jednu činjenicu — i razišla su se u prvom pokušaju: aplikacija
 * je prešla na „Kredu i tablu", a pravne stranice ostale mentol, pa je jedan
 * klik iz footera vodio u drugu paletu. (ADR-027: duplikat se briše, ne sinkronizira.)
 *
 * `css/tokens.css` se NE može poslužiti izravno — `@theme static` je Tailwindova
 * direktiva koju preglednik ne razumije. Zato se `:root` blokovi VADE IZ VEĆ
 * PREVEDENOG bundlea: iste vrijednosti, isti build, nula prepisivanja. Usput te
 * četiri stranice besplatno dobiju i sve teme. */
const TOKENS_OUT = path.join(ROOT, 'css', 'tokens.static.css');
const TOKENS_OUT_REL = 'css/tokens.static.css';

function extractTokens(css, version) {
  /* ⚠️ Vade se DVIJE vrste bloka i REDOSLIJED je bitan:
   *   `@layer theme { :root, :host { … } }`  = ZADANA paleta (Tailwindov @theme)
   *   `:root[data-theme="x"] { … }`          = teme, NEUSLOJENE navrh
   * Neuslojeno tuče svaki sloj (nalaz C1), pa `@layer` omot MORA ostati — bez
   * njega bi zadane vrijednosti dobile istu težinu kao teme i, stojeći prvo,
   * bile pregažene… ili, stojeći zadnje, pregazile SVE teme.
   * Prva verzija ove funkcije tražila je samo `^:root` i tiho ispustila zadanu
   * paletu (u izlazu nije bilo ni jedne krede), a teme složila PRIJE nje.
   * ⚠️ F1/12 ⓪ (2026-09-06): `:root[data-uredjaj~="dodir"] .flashcard-ghost { … }` je PRAVILO
   * SUČELJA vezano na `<html>`, ne token-blok — a `:root[^{]*\{` ga je pokupio i pravne stranice
   * su dobile špil kartica. Token-blok je `:root` (+ atributi, + zarezi) BEZ potomka: selektor
   * s razmakom/kombinatorom iza `:root…` ne ulazi. Brana dolje pada glasno ako bi ušao. */
  const blocks = [];
  const ROOT_SEL = ':root(?:\\[[^\\]]*\\])*';
  const re = new RegExp('^(?:@layer theme\\s*\\{|' + ROOT_SEL + '(?:\\s*,\\s*' + ROOT_SEL + ')*\\s*\\{)', 'gm');
  let m;
  while ((m = re.exec(css)) !== null) {
    let depth = 0;
    for (let j = css.indexOf('{', m.index); j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}' && --depth === 0) { blocks.push(css.slice(m.index, j + 1)); break; }
    }
  }
  // Brana protiv tihog ispuštanja: bez zadane palete ili bez tema datoteka je
  // beskorisna, a izgleda uredno. Pada glasno, ne ostavlja polovičan izlaz.
  const spojeno = blocks.join('\n\n');
  const problemi = [];
  if (!/@layer theme\s*\{/.test(spojeno)) problemi.push('nema `@layer theme` — zadana paleta bi nedostajala');
  if (!/\[data-theme=/.test(spojeno)) problemi.push('nema nijedne `[data-theme]` teme');
  if (/@layer theme/.test(spojeno) && spojeno.indexOf('@layer theme') > spojeno.indexOf('[data-theme=')) {
    problemi.push('zadana paleta stoji IZA tema — pregazila bi ih');
  }
  // Pravilo sučelja (`:root[data-uredjaj~=…] .x`) nije token: prelude s razmakom iza `:root…`.
  const sPotomkom = blocks.map((b) => b.slice(0, b.indexOf('{')).trim()).filter((p) => /:root(?:\[[^\]]*\])*\s+\S/.test(p));
  if (sPotomkom.length) problemi.push('blok s potomkom nije token-blok: ' + sPotomkom.join(' | '));
  if (problemi.length) {
    console.error(`❌ ${TOKENS_OUT_REL}: izvadak nije upotrebljiv.`);
    problemi.forEach((p) => console.error('   · ' + p));
    process.exit(1);
  }
  return [
    '/* GENERIRANO — ne uređuj ručno. Izvor: css/tokens.css → npm run build:css.',
    '   Postoji zato što privacy/terms/faq/contact.html ne učitavaju bundle, a',
    `   paleta smije živjeti na jednom mjestu. (tailwindcss ${version})`,
    ' */',
    '',
    blocks.join('\n\n'),
    '',
  ].join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  checkManifestCoverage();
  const { content, version, hover } = compile();
  const modules = importedModules().length;
  const hoverInfo = hover.zamotano + ' hover-pravila (' + hover.prije.hoverSelektora + ' selektora) pod (hover: hover), '
    + hover.naoruzano + ' selektora s prefiksom :where(:root:not([data-hover-paused]))';
  const tokens = extractTokens(content, version);

  if (check) {
    const onDisk = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : null;
    const tokensOnDisk = fs.existsSync(TOKENS_OUT)
      ? fs.readFileSync(TOKENS_OUT, 'utf8').replace(/\r\n/g, '\n') : null;
    if (onDisk === content && tokensOnDisk === tokens) {
      console.log(`✅ ${OUT_REL} + ${TOKENS_OUT_REL} u sinku s ${modules} modula + tokenima (tailwindcss ${version}; ${hoverInfo}).`);
      process.exit(0);
    }
    const koji = onDisk !== content ? OUT_REL : TOKENS_OUT_REL;
    console.error(`❌ DRIFT: ${koji} nije u sinku s izvorima. Pokreni "npm run build:css".`);
    process.exit(1);
  }

  fs.writeFileSync(OUT, content);
  fs.writeFileSync(TOKENS_OUT, tokens);
  const kb = (Buffer.byteLength(content) / 1024).toFixed(1);
  const tkb = (Buffer.byteLength(tokens) / 1024).toFixed(1);
  console.log(`✅ ${OUT_REL} zgrađen iz ${modules} modula + tokena (${kb} KB, tailwindcss ${version}).`);
  console.log(`✅ ${hoverInfo} — na dodiru se ništa ne lijepi, na mišu tek poslije pomaka (F1/8 ①+②, scripts/hover-css.js).`);
  console.log(`✅ ${TOKENS_OUT_REL} zgrađen (${tkb} KB) — paleta za stranice bez bundlea.`);
  console.log('   ⚠️ Cache-bump: pokreni `npm run bump` (styles.bundle.css token je u index.html).');
}

main();
