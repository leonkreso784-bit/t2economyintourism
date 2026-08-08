#!/usr/bin/env node
/* eslint-disable no-console */
// ===== check:docs — integritet dokumentacije (Stage R) =====
// Postoji jer je `docs/` narastao na 24 fajla u korijenu, s 188 međusobnih poveznica i
// osam ispunjenih planova koji su i dalje izgledali aktivno. Reorganizacija je to sredila;
// ovaj gate čuva da ostane sređeno.
//
// Pada ako:
//   1) relativna .md poveznica ne postoji            → mrtve veze
//   2) `plan/` ima više od JEDNOG spec-a             → „koji plan vrijedi?" (uzrok krivih odluka)
//   3) `product/**` sadrži dnevnički datum           → definicija se pretvara u dnevnik
//   4) .md postoji, a nije naveden u docs/README.md  → dokument-duh koji nitko ne nađe
//   5) CONTENT_SCHEMA nabraja druge tokene boje       → dokument zaostaje za KODOM (ne samo za sobom)
//                       nego schema/*.json
//
// Pokreni: npm run check:docs   (dio `npm run preflight`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const SKIP = ['node_modules', '.git', '.claude', 'mcp-admin', 'backups', '_materials', 'test-results'];

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const problems = [];
const allMd = walk(ROOT, []);
const known = new Set(allMd.map(rel));

// ── 1) mrtve poveznice ──────────────────────────────────────────────
let links = 0;
for (const abs of allMd) {
  const src = fs.readFileSync(abs, 'utf8');
  const dir = path.posix.dirname(rel(abs));
  const re = /\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const link = m[1];
    if (/^[a-z]+:\/\//i.test(link)) continue;              // vanjski URL
    links++;
    const target = path.posix.normalize(path.posix.join(dir, link));
    if (!known.has(target)) problems.push('MRTVA POVEZNICA  ' + rel(abs) + '  →  ' + link);
  }
}

// ── 2) najviše JEDAN aktivni spec u plan/ ───────────────────────────
// ROADMAP.md je stalni stanovnik (pregled milestone-a), ne spec.
const PLAN = path.join(DOCS, 'plan');
if (fs.existsSync(PLAN)) {
  const specs = fs.readdirSync(PLAN).filter((f) => f.endsWith('.md') && f !== 'ROADMAP.md');
  if (specs.length > 1) {
    problems.push('VIŠE AKTIVNIH PLANOVA u docs/plan/: ' + specs.join(', ') +
      '\n      → ispunjen plan ide u docs/archive/ ISTI DAN (pravilo 1)');
  }
}

// ── 2b) plan/ i product/ ne smiju proglasiti ARHIVU aktivnom (ADR-027) ──
// Povod: `plan/ROADMAP.md` je tjednima tvrdio „trenutni rad = CREATE_BACKEND F5" i označavao
// `CREATE_BACKEND_SPEC.md` kao **AKTIVNO** — a taj je dokument bio u `archive/`, a F5 odavno
// na produkciji. Svaka svježa sesija bi krenula od te rečenice.
//
// Ovo je JEDINA semantička zastarjelost iz tog čišćenja koja se da uhvatiti strojno:
// ako dokument koji govori „što sada" pokazuje na `archive/` i uz to viče AKTIVNO — laže.
const AKTIVNO = /\bAKTIVN(?:O|I|A)\b/;
// `PRODUCT` se definira niže (const → TDZ), pa se putanja ovdje računa lokalno.
for (const dir of [PLAN, path.join(DOCS, 'product')]) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const abs = path.join(dir, f);
    fs.readFileSync(abs, 'utf8').split(/\r?\n/).forEach((line, i) => {
      if (line.indexOf('archive/') !== -1 && AKTIVNO.test(line)) {
        problems.push('ARHIVA PROGLAŠENA AKTIVNOM  ' + rel(abs) + ':' + (i + 1) +
          '\n      → ' + line.trim().slice(0, 110) +
          '\n      → dokument u archive/ je REFERENCA, ne izvor istine (ADR-027)');
      }
    });
  }
}

// ── 3) product/ je DEFINICIJA, ne dnevnik ───────────────────────────
const PRODUCT = path.join(DOCS, 'product');
if (fs.existsSync(PRODUCT)) {
  for (const f of fs.readdirSync(PRODUCT).filter((x) => x.endsWith('.md'))) {
    const abs = path.join(PRODUCT, f);
    const src = fs.readFileSync(abs, 'utf8');
    const dated = src.match(/\b20\d\d-\d\d-\d\d\b/g) || [];
    if (dated.length > 3) {
      problems.push('DNEVNIK U DEFINICIJI  ' + rel(abs) + '  (' + dated.length + ' datuma)' +
        '\n      → product/ opisuje ŠTO proizvod mora znati; kronologija ide u docs/records/');
    }
  }
}

// ── 3b) ĆIRILICA ────────────────────────────────────────────────────
// Hrvatski i ćirilica dijele izgled nekoliko slova (а/о/е/с/р…), pa se pri kopiranju
// ili tipkanju neprimjetno uvuku. Već se jednom provuklo u sadržaj (`Manualне`, PR #1),
// a i ovaj gate je odmah uhvatio `katalога` u prepisanom ARCHITECTURE.md.
// ⚠ Ćirilica UNUTAR koda je legitimna — tako se navodi sam detekcijski raspon (`[Ѐ-ӿ]`) i
// citiraju popravljeni primjeri (`najbržи`). Zato se prije provjere maknu blokovi i inline-kod.
const stripCode = (s) => s.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
for (const abs of allMd) {
  const src = stripCode(fs.readFileSync(abs, 'utf8'));
  const hits = src.match(/[Ѐ-ӿ]+/g);
  if (hits) {
    const uniq = Array.from(new Set(hits)).slice(0, 5).map((h) => JSON.stringify(h)).join(', ');
    problems.push('ĆIRILICA           ' + rel(abs) + '  → ' + uniq +
      '\n      → hrvatski tekst ne smije sadržavati ćirilične znakove (izgledaju isto, nisu isto)');
  }
}

// ── 4) svaki .md pod docs/ mora biti naveden u indeksu ──────────────
const INDEX = path.join(DOCS, 'README.md');
if (fs.existsSync(INDEX)) {
  const idx = fs.readFileSync(INDEX, 'utf8');
  for (const abs of allMd) {
    const r = rel(abs);
    if (!r.startsWith('docs/')) continue;                  // root README/CLAUDE nisu u indeksu
    if (r === 'docs/README.md') continue;
    const base = path.basename(r);
    // dovoljno je da se ime pojavi u indeksu (poveznica ili spomen)
    if (idx.indexOf(base) === -1) {
      problems.push('NIJE U INDEKSU     ' + r + '  → dodaj redak u docs/README.md');
    }
  }
}

// ── 5) CONTENT_SCHEMA mora nabrajati TOČNO one tokene boje koje shema dopušta ──
// Provjere 1–4 čuvaju STRUKTURU dokumentacije; ovo je prva koja čuva njenu ISTINITOST.
// Povod: odlomak o „runs" tvrdio je 5 tokena boje i nije znao za `math`, dok su u shemi (i na
// produkciji) bila 9 tokena i `math` — autor sadržaja koji čita dokument ne bi znao da inline
// matematika postoji. Shema je izvor istine; dokument se mjeri po njoj.
const SCHEMA = path.join(ROOT, 'schema', 'subject-content.schema.json');
const CS = path.join(DOCS, 'architecture', 'CONTENT_SCHEMA.md');
if (fs.existsSync(SCHEMA) && fs.existsSync(CS)) {
  let want = null;
  try {
    const sc = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
    const run = sc.definitions && sc.definitions.run;
    if (run && run.properties && run.properties.color) want = run.properties.color.enum;
  } catch (e) {
    problems.push('SHEMA NEČITLJIVA    schema/subject-content.schema.json → ' + e.message);
  }
  if (Array.isArray(want)) {
    const src = fs.readFileSync(CS, 'utf8');
    const line = src.split('\n').find((l) => l.indexOf('Tokeni boje') !== -1);
    if (!line) {
      problems.push('NEMA POPISA BOJA   ' + rel(CS) +
        '\n      → treba redak koji počinje „**Tokeni boje" i nabraja tokene u `backtickovima`');
    } else {
      const got = (line.match(/`[a-z]+`/g) || []).map((t) => t.slice(1, -1));
      const missing = want.filter((t) => got.indexOf(t) === -1);
      const extra = got.filter((t) => want.indexOf(t) === -1);
      if (missing.length || extra.length) {
        problems.push('BOJE SE RAZILAZE   ' + rel(CS) + ' vs schema/subject-content.schema.json' +
          (missing.length ? '\n      → shema ima, dokument NEMA: ' + missing.join(', ') : '') +
          (extra.length ? '\n      → dokument ima, shema NEMA: ' + extra.join(', ') : ''));
      }
    }
  }
}

// ── izvještaj ───────────────────────────────────────────────────────
console.log('\n=== check:docs ===');
console.log('  .md dokumenata : ' + allMd.length);
console.log('  poveznica      : ' + links);
if (problems.length === 0) {
  console.log('\n✅ dokumentacija je konzistentna\n');
  process.exit(0);
}
console.log('\n❌ ' + problems.length + ' problem(a):\n');
problems.forEach((p) => console.log('   • ' + p));
console.log('');
process.exit(1);
