#!/usr/bin/env node
'use strict';
/**
 * check-tailwind.js — brane oko Tailwind sloja (cigla C1). Sve su LOKALNE i BRZE → idu u preflight.
 *
 * Tailwind ima jedno svojstvo koje ga u našem projektu čini opasnijim nego u običnom: klase
 * generira SKENIRANJEM IZVORA KAO TEKSTA. Ako ime klase u trenutku skeniranja ne postoji kao
 * cjelovit niz, pravilo se ne generira — i stil tiho nestane. Naš markup velikim dijelom nastaje
 * u JS-u, pa je to realan put, a ne teorijski. Ove četiri provjere zatvaraju sve načine na koje
 * to može proći nezapaženo:
 *
 *   1. Dinamički sastavljeno ime klase (`'bg-' + boja`)     → ADR-028, granica #5
 *   2. Generirani utility koji se zove kao naša legacy klasa → tiho gaženje (utilityji su ZADNJI)
 *   3. `@source` ugovor: `data/` se NE skenira, `index.html`/`js` DA → ADR-028
 *   4. Tailwind klase na stranicama koje ne učitavaju bundle → stil koji nikad ne stigne
 *
 * Provjere 2 i 4 ne nagađaju što je „Tailwind klasa" iz popisa prefiksa — PITAJU Tailwind, tako
 * da mu ponude token kroz `@source inline(...)` i vide generira li pravilo. Popis prefiksa u
 * provjeri 1 je jedino mjesto gdje se nagađa, i namjerno je uzak.
 *
 * RABLJENJE: node scripts/check-tailwind.js     (npm run check:tailwind)
 * Izlazni kod: 0 = čisto, 1 = nalaz.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'css', 'app.css');
const BUNDLE = path.join(ROOT, 'styles.bundle.css');
const CACHE = path.join(ROOT, '.cache');

/**
 * Stranice koje UČITAVAJU `styles.bundle.css` (dakle smiju koristiti utilityje).
 *
 * ⚠️ T6: bio je ručni popis (`['index.html']`), pa je `editor.html` u provjerama #3 i #5
 * bio nevidljiv — utility napisan ondje Tailwind ne bi ni generirao (nije u `@source`), a
 * da ga i generira, brana bi ga prijavila kao „šum koji nitko nije napisao". Definicija je
 * zato ČINJENIČNA: bundle-stranica je ona koja bundle doista učitava.
 */
const BUNDLE_PAGES = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('styles.bundle.css'))
  .sort();

/**
 * Namespacei u kojima dinamičko sastavljanje imena znači tihi gubitak stila. Uzak popis:
 * radije propustiti rub nego zatrpati gate lažnim nalazima nad našim semantičkim klasama.
 */
const DYNAMIC_PREFIXES = [
  'bg', 'text', 'border', 'ring', 'shadow', 'rounded', 'fill', 'stroke', 'outline', 'accent',
  'from', 'via', 'to', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr',
  'mb', 'ml', 'w', 'h', 'gap', 'font', 'leading', 'tracking', 'z', 'opacity', 'grid-cols',
  'grid-rows', 'col-span', 'row-span', 'basis', 'order', 'duration', 'delay', 'translate-x',
  'translate-y', 'scale', 'rotate', 'space-x', 'space-y', 'divide-x', 'divide-y', 'size',
];

const problems = [];
function fail(check, msg, lines) {
  problems.push({ check, msg, lines: lines || [] });
}

/** Sve datoteke pod `js/` (rekurzivno) + navedene HTML stranice. */
function sourceFiles() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, e);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (e.endsWith('.js')) out.push(abs);
    }
  };
  walk(path.join(ROOT, 'js'));
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) out.push(path.join(ROOT, f));
  return out;
}

function rel(abs) { return path.relative(ROOT, abs).replace(/\\/g, '/'); }

/** Tailwind CLI ulaz (bin iz package.json — ne ovisi o npx-u ni PATH-u). */
function tailwindBin() {
  const pkgPath = require.resolve('@tailwindcss/cli/package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const b = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.tailwindcss;
  return path.resolve(path.dirname(pkgPath), b);
}

/**
 * PITAJ Tailwind koje od zadanih imena zna generirati. Vraća Set imena za koja je nastalo pravilo.
 * `@source inline()` je jedini način da se to sazna bez preslikavanja Tailwindove gramatike u
 * naš regex — a preslikana gramatika bi zastarjela prvom njihovom verzijom.
 */
function tailwindGenerates(tokens) {
  const usable = tokens.filter((t) => /^[A-Za-z0-9:/[\].,%!_-]+$/.test(t) && !/[{}]/.test(t));
  if (!usable.length) return new Set();
  fs.mkdirSync(CACHE, { recursive: true });
  const input = path.join(CACHE, 'tw-probe.css');
  const output = path.join(CACHE, 'tw-probe.out.css');
  fs.writeFileSync(input,
    '@import "tailwindcss/theme.css" layer(theme);\n' +
    '@import "../css/tokens.css";\n' +
    '@import "tailwindcss/utilities.css" source(none);\n' +
    usable.map((t) => '@source inline("' + t + '");').join('\n') + '\n');
  const res = spawnSync(process.execPath, [tailwindBin(), '--input', input, '--output', output], {
    cwd: ROOT, encoding: 'utf8',
  });
  if (res.status !== 0) {
    console.error('❌ Tailwind CLI je pao pri ispitivanju imena:\n' + (res.stderr || res.stdout));
    process.exit(2);
  }
  const css = fs.readFileSync(output, 'utf8');
  const found = new Set();
  const re = /^\s*\.((?:\\.|[^\s,{:])+(?::[a-z-]+)?)/gm;
  let m;
  while ((m = re.exec(css)) !== null) found.add(m[1].replace(/\\/g, ''));
  fs.unlinkSync(input);
  fs.unlinkSync(output);
  // Tailwind na varijantu (`md:flex`) generira selektor `.md\:flex` unutar @media — gornji regex
  // ga uhvati; pseudo-repove (`:hover`) odbacujemo da se `hover\:x:hover` svede na `hover:x`.
  return new Set([...found].map((s) => s.replace(/:(hover|focus|active|visited|disabled|focus-visible|before|after)$/, '')));
}

/**
 * Utilityji koje Tailwind STVARNO generira za `styles.bundle.css`. Gradi se probni ulaz s
 * doslovnim repom `css/app.css` (uvoz utilityja + svi `@source` redci), pa vrijede iste
 * iznimke. `.cache/` je, kao i `css/`, jednu razinu ispod korijena → relativne putanje iz
 * manifesta rade nepromijenjene.
 */
function generatedUtilities() {
  const txt = fs.readFileSync(MANIFEST, 'utf8');
  const at = txt.indexOf('@import "tailwindcss/utilities.css"');
  if (at < 0) {
    console.error('❌ `css/app.css` ne uvozi `tailwindcss/utilities.css` — manifest je razbijen.');
    process.exit(2);
  }
  fs.mkdirSync(CACHE, { recursive: true });
  const input = path.join(CACHE, 'tw-utils.css');
  const output = path.join(CACHE, 'tw-utils.out.css');
  fs.writeFileSync(input,
    '@import "tailwindcss/theme.css" layer(theme);\n@import "../css/tokens.css";\n' + txt.slice(at));
  const res = spawnSync(process.execPath, [tailwindBin(), '--input', input, '--output', output], {
    cwd: ROOT, encoding: 'utf8',
  });
  if (res.status !== 0) {
    console.error('❌ Tailwind CLI je pao pri popisivanju utilityja:\n' + (res.stderr || res.stdout));
    process.exit(2);
  }
  const css = fs.readFileSync(output, 'utf8');
  const out = new Set();
  const re = /^\s*\.((?:\\.|[^\s,{:])+)/gm;
  let m;
  while ((m = re.exec(css)) !== null) out.add(m[1].replace(/\\/g, ''));
  fs.unlinkSync(input);
  fs.unlinkSync(output);
  return out;
}

/** Imena klasa koja se pojavljuju u `class="..."` atributima i `classList` pozivima. */
function classTokensIn(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const tokens = new Set();
  const attr = /class(?:Name)?\s*=\s*(["'`])([^"'`]*)\1/g;
  let m;
  while ((m = attr.exec(txt)) !== null) {
    for (const t of m[2].split(/\s+/)) if (t) tokens.add(t);
  }
  const list = /classList\.(?:add|remove|toggle|contains)\(([^)]*)\)/g;
  while ((m = list.exec(txt)) !== null) {
    const inner = m[1].match(/["'`]([^"'`]+)["'`]/g) || [];
    for (const q of inner) for (const t of q.slice(1, -1).split(/\s+/)) if (t) tokens.add(t);
  }
  return tokens;
}

/* ─────────── 1. Dinamički sastavljena imena klasa (ADR-028, granica #5) ─────────── */
function checkDynamicClassNames() {
  const alt = DYNAMIC_PREFIXES.map((p) => p.replace(/[-]/g, '\\-')).join('|');
  const re = new RegExp('(?:^|[\\s"\'`(,=])(' + alt + ')-(?:\\$\\{|["\']\\s*\\+)', 'g');
  const hits = [];
  for (const f of sourceFiles()) {
    if (!f.endsWith('.js') && !f.endsWith('.html')) continue;
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      re.lastIndex = 0;
      if (re.test(line)) hits.push(rel(f) + ':' + (i + 1) + '  ' + line.trim().slice(0, 110));
    });
  }
  if (hits.length) {
    fail('dinamičke klase',
      'ime Tailwind klase se sastavlja u runtimeu. Tailwind skenira izvor kao TEKST, pa takvo ime\n' +
      '   nikad ne vidi → pravilo se ne generira i stil tiho nestane, i to SAMO na produkciji.\n' +
      '   Rješenje: preslikaj vrijednost u potpuna imena (mapa `{ plava: "bg-brand-500", … }`),\n' +
      '   ili — za paletu od 8 boja — ostani na CSS varijablama (ADR-028).', hits);
  }
}

/** Imena klasa definirana u našem legacy CSS-u → { ime: datoteka }. */
function legacyClassNames() {
  const legacy = new Map();
  const cssFiles = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, e);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (e.endsWith('.css') && e !== 'tokens.css' && e !== 'app.css') cssFiles.push(abs);
    }
  };
  walk(path.join(ROOT, 'css'));
  for (const f of cssFiles) {
    const txt = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    // Selektor = tekst prije `{`; unutar njega tražimo imena klasa.
    for (const chunk of txt.split('}')) {
      const sel = chunk.split('{')[0];
      if (!sel || sel.includes('@media') || sel.includes('@supports')) continue;
      const cls = sel.match(/\.([A-Za-z_][A-Za-z0-9_-]*)/g) || [];
      for (const c of cls) if (!legacy.has(c.slice(1))) legacy.set(c.slice(1), rel(f));
    }
  }

  return legacy;
}

/* ─────────── 2. Utility koji se zove kao naša legacy klasa ─────────── */
function checkNameCollisions(generated, legacy) {
  const clashes = [...generated].filter((c) => legacy.has(c));
  if (clashes.length) {
    fail('sudar imena',
      'Tailwind generira pravilo s IMENOM koje već postoji u našem CSS-u. Utilityji stoje ZADNJI\n' +
      '   i neuslojeni, pa pri jednakoj specifičnosti pobjeđuju — legacy pravilo tiho prestaje vrijediti,\n' +
      '   a razlika se pokaže tek kad se vrijednosti raziđu (npr. kad C2 promijeni paletu).\n' +
      '   Rješenje: dopiši ime u `@source not inline(...)` u css/app.css ILI dovrši migraciju te površine.',
      clashes.map((c) => '.' + c + '   (legacy: ' + legacy.get(c) + ')'));
  }
}

/* ─────────── 5. Utility koji nitko nije napisao (šum iz skeniranja teksta) ─────────── */
function checkNoiseUtilities(generated, legacy) {
  const standalone = new Set();
  for (const f of sourceFiles()) {
    if (f.endsWith('.html') && !BUNDLE_PAGES.includes(rel(f))) continue;
    for (const t of classTokensIn(f)) standalone.add(t);
  }
  const noise = [...generated].filter((c) => !standalone.has(c) && !legacy.has(c));
  if (noise.length) {
    fail('šum',
      'Tailwind generira pravilo koje NITKO nije napisao kao klasu. Skener čita izvor kao tekst, pa\n' +
      '   kandidate vadi i iz naših imena (`modes-grid` → `grid`) i iz koda (`if (!container)` → `!container`).\n' +
      '   Takvo pravilo je u najboljem slučaju mrtvih par redaka, a u najgorem pogodi element koji nitko\n' +
      '   nije namjeravao stilizirati. Rješenje: dopiši ime u `@source not inline(...)` u css/app.css.',
      noise.map((c) => '.' + c));
  }
}

/* ─────────── 3. `@source` ugovor ─────────── */
function checkSourceContract() {
  const txt = fs.readFileSync(MANIFEST, 'utf8');
  const sources = [...txt.matchAll(/@source\s+(?:not\s+)?["']([^"']+)["']/g)].map((m) => m[1]);

  if (!/@import\s+["']tailwindcss\/utilities\.css["']\s+source\(none\)/.test(txt)) {
    fail('@source ugovor',
      '`css/app.css` mora uvoziti utilityje sa `source(none)`. Bez toga Tailwind skenira SVE što nije\n' +
      '   u .gitignoreu — uključujući `data/`, a gradivo nikad ne smije sudjelovati u stiliziranju (ADR-028).');
  }
  const intoData = sources.filter((s) => /(^|\/)data(\/|$)/.test(s));
  if (intoData.length) {
    fail('@source ugovor', '`@source` cilja `data/` — gradivo se NE skenira (ADR-028).', intoData);
  }
  // Svaka bundle-stranica mora biti i skenirana — inače utility u njoj tiho ne postoji.
  for (const must of [...BUNDLE_PAGES.map((p) => '../' + p), '../js']) {
    if (!sources.includes(must)) {
      fail('@source ugovor',
        '`css/app.css` ne skenira `' + must + '`, a taj izvor gradi markup koji `styles.bundle.css` stilizira →\n' +
        '   svaka utility klasa u njemu bila bi mrtva.');
    }
  }
}

/* ─────────── 4. Tailwind klase na stranicama bez bundlea ─────────── */
function checkOffBundlePages() {
  const offBundle = fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html') && !BUNDLE_PAGES.includes(f))
    .filter((f) => !fs.readFileSync(path.join(ROOT, f), 'utf8').includes('styles.bundle.css'));
  const tokens = new Map();
  for (const f of offBundle) for (const t of classTokensIn(path.join(ROOT, f))) {
    if (!tokens.has(t)) tokens.set(t, f);
  }
  const generated = tailwindGenerates([...tokens.keys()]);
  const dead = [...generated].filter((t) => tokens.has(t));
  if (dead.length) {
    fail('mrtve klase',
      'stranica ne učitava `styles.bundle.css`, a koristi klasu koju bi Tailwind generirao samo u njega →\n' +
      '   pravilo nikad ne stigne do te stranice. Rješenje: ili joj daj vlastiti izlaz, ili je stiliziraj\n' +
      '   kroz `css/legal.css` (te stranice su zasebna površina, cigla C6).',
      dead.map((t) => '.' + t + '   (' + tokens.get(t) + ')'));
  }
}

/* ─────────── 6. Dva `@keyframes` s istim imenom u izlazu ─────────── */
function checkKeyframeCollisions() {
  const css = fs.readFileSync(BUNDLE, 'utf8');
  const seen = new Map();
  const dupes = [];
  const re = /@keyframes\s+([A-Za-z_][A-Za-z0-9_-]*)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    if (seen.has(m[1])) dupes.push(m[1]);
    else seen.set(m[1], true);
  }
  if (dupes.length) {
    fail('sudar animacija',
      'izlaz sadrži DVIJE animacije istog imena. Imena animacija su globalna i ne poznaju kaskadne\n' +
      '   slojeve → pobjeđuje kasnija, a to je Tailwindova (on ima ugrađene `spin`/`ping`/`pulse`/`bounce`).\n' +
      '   Rješenje: prefiksiraj NAŠU animaciju (npr. `sokratSpin`) i njeno `animation:` korištenje.',
      [...new Set(dupes)].map((n) => '@keyframes ' + n));
  }
}

function main() {
  console.log('\n=== check:tailwind ===');
  if (!fs.existsSync(BUNDLE)) {
    console.error('❌ `styles.bundle.css` ne postoji — pokreni `npm run build:css`.');
    process.exit(2);
  }
  const generated = generatedUtilities();
  const legacy = legacyClassNames();

  checkDynamicClassNames();
  checkNameCollisions(generated, legacy);
  checkSourceContract();
  checkOffBundlePages();
  checkNoiseUtilities(generated, legacy);
  checkKeyframeCollisions();

  if (!problems.length) {
    console.log('✅ 6/6 provjera čisto — ' + generated.size + ' generiranih utilityja, svi namjerni.');
    console.log('   (dinamičke klase · sudari imena · @source ugovor · mrtve klase · šum · sudari animacija)\n');
    process.exit(0);
  }
  for (const p of problems) {
    console.error('\n❌ [' + p.check + '] ' + p.msg);
    p.lines.slice(0, 25).forEach((l) => console.error('   • ' + l));
    if (p.lines.length > 25) console.error('   … i još ' + (p.lines.length - 25));
  }
  console.error('\n' + problems.length + ' nalaz(a).\n');
  process.exit(1);
}

main();
