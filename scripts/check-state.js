#!/usr/bin/env node
/* eslint-disable no-console */
// ===== check:state — tvrdnje o STANJU koje neka naredba zna bolje =====
//
// Povod (2026-08-18). Tri dokumenta koja svaka sesija čita prva otvarala su se rečenicom
// koja više nije bila istinita:
//
//   CLAUDE.md:86   „🔴 PRVO ŠTO TREBA NAPRAVITI: `git push origin main`"  → push je bio obavljen
//   memorija       ista rečenica                                          → isto
//   CLAUDE.md      „grana = 8 commita"                                    → bilo ih je 10
//
// Nijedna nije bila greška u zaključivanju — sve tri su bile TOČNE u trenutku pisanja i
// ostarile su same od sebe. To je najgori razred zastarjelosti: sesija starta s NALOGOM da
// učini nešto što je već učinjeno, pa krene djelovati.
//
// ⚠️ ZAŠTO GATE, A NE PRAVILO. `BUGS.md` je isti zaključak već zapisao dvaput — BUG-019 i
// BUG-020 oba propisuju „pravi navigacijski stog", i oba su odgođena na U8, koji je zatvoren
// bez da je propis izveden. BUG-023 iz toga izvodi pouku doslovno: *„Rečenica u dokumentu ne
// sprječava ništa — `if` u kodu ili test sprječavaju."* (ADR-027.)
//
// ⚠️ GATE NE ZABRANJUJE BROJKU, NEGO JU PROVJERAVA. Zabrana bi dokumente učinila nečitljivima
// („vidi naredbu" umjesto broja). Ovdje se broj smije napisati — samo mora biti točan, a što
// je točno pita se git. Time zapis ostaje čitljiv, a ne može tiho ostariti.
//
// Pokriva SAMO dokumente koji govore ŠTO SADA. `CHANGELOG`/`PROGRESS`/`HISTORY` su namjerno
// izvan: ondje je „33 commita" tvrdnja o prošlosti i ostaje točna zauvijek.
//
// ⚠️ Memorija (`~/.claude/.../memory/`) je IZVAN repozitorija pa je ovaj gate ne doseže —
// a ondje je ista greška živjela. To je poznata rupa, ne previd; drži ju na umu pri reviziji.
//
// Pokreni: npm run check:state   (dio `npm run preflight`)

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// Dokumenti koji tvrde ŠTO SADA. Popis je namjerno kratak i eksplicitan.
const WATCHED = [
  path.join(ROOT, 'CLAUDE.md'),
  path.join(ROOT, 'docs', 'records', 'BACKLOG.md'),
];
for (const f of fs.existsSync(path.join(ROOT, 'docs', 'plan')) ? fs.readdirSync(path.join(ROOT, 'docs', 'plan')) : []) {
  if (f.endsWith('.md')) WATCHED.push(path.join(ROOT, 'docs', 'plan', f));
}

const problems = [];
const skipped = [];

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return null;
  }
}

// ── priprema: znamo li uopće čitati repozitorij? ─────────────────────
// CI radi plitak checkout, pa `main` i tuđe grane ondje ne moraju postojati. Gate tada
// PRESKAČE tvrdnju umjesto da padne — nepotpuni podaci nisu dokaz o netočnosti.
const HEAD_OK = git(['rev-parse', '--git-dir']) !== null;
const MAIN = HEAD_OK ? git(['rev-parse', '--verify', '--quiet', 'main']) : null;

const branches = HEAD_OK
  ? (git(['branch', '--format=%(refname:short)']) || '').split('\n').map((s) => s.trim()).filter(Boolean)
  : [];

// ── 1) broj commita grane ────────────────────────────────────────────
// Provjerava se SAMO za grane koje su ŽIVE (ispred `main`-a). Kad je grana mergeana,
// `main..grana` je 0, a rečenica „33 commita" u istom dokumentu govori o prošlom mergeu i
// točna je — provjera bi ondje prijavila lažan kvar.
const COMMIT_RE = /(\d+)\s*commit/i;

function proveriBrojCommita(file, line, i) {
  const m = COMMIT_RE.exec(line);
  if (!m) return;
  const stated = Number(m[1]);

  // koja se grana spominje u istom retku?
  const grana = branches
    .filter((b) => b !== 'main' && b !== 'origin')
    .find((b) => line.indexOf(b) !== -1);
  if (!grana) return;

  if (!MAIN) { skipped.push(rel(file) + ':' + (i + 1) + ' — `main` nije dostupan (plitak checkout?)'); return; }

  const ahead = git(['rev-list', '--count', 'main..' + grana]);
  if (ahead === null) { skipped.push(rel(file) + ':' + (i + 1) + ' — ne mogu prebrojati `main..' + grana + '`'); return; }

  const stvarno = Number(ahead);
  if (stvarno === 0) return;                 // mergeana grana → tvrdnja je povijesna
  if (stvarno === stated) return;

  problems.push(
    'BROJ COMMITA JE OSTARIO  ' + rel(file) + ':' + (i + 1) +
    '\n      → piše ' + stated + ', grana `' + grana + '` ima ' + stvarno +
    '\n      → ' + line.trim().slice(0, 100) +
    '\n      → točan broj: git rev-list --count main..' + grana
  );
}

// ── 2) nalog za radnju koja je već obavljena ─────────────────────────
// Uži, ali najopasniji slučaj: dokument NALAŽE push koji je već prošao. Sesija tad ne čita
// zastarjelu činjenicu nego zastarjelu ZAPOVIJED — a zapovijed navodi na radnju.
const NALOG = /🔴|PRVO ŠTO TREBA|PRVO SLJEDEĆE|TREBA NAPRAVITI|JEDNA NAREDBA/;
const PUSH = /git push origin main/;

// ⚠️ Redak koji OPISUJE ovaj gate mora smjeti citirati obrazac koji gate traži — inače se
// brana ne da dokumentirati. Ista iznimka i iz istog razloga postoji u `check-docs.js`
// (`CYRILLIC_ALLOWED`), gdje detektor ćirilice mora navesti sam raspon `[Ѐ-ӿ]`.
// Iznimka je NAMJERNO uska: samo redak koji imenuje `check:state`. Jest teoretski zaobilazak,
// ali onaj tko ga napiše više ne griješi slučajno — a gate čuva od slučajnog, ne od namjernog.
const SAMOOPIS = /check:state/;

function proveriZastarjeliNalog(file, line, i) {
  if (!PUSH.test(line) || !NALOG.test(line)) return;
  if (SAMOOPIS.test(line)) return;
  if (!MAIN) { skipped.push(rel(file) + ':' + (i + 1) + ' — ne mogu usporediti `main` i `origin/main`'); return; }

  const ORIGIN = git(['rev-parse', '--verify', '--quiet', 'origin/main']);
  if (!ORIGIN) { skipped.push(rel(file) + ':' + (i + 1) + ' — `origin/main` nije dostupan'); return; }
  if (ORIGIN !== MAIN) return;               // push doista još predstoji → nalog je istinit

  problems.push(
    'NALOG JE VEĆ IZVRŠEN     ' + rel(file) + ':' + (i + 1) +
    '\n      → ' + line.trim().slice(0, 100) +
    '\n      → `main` i `origin/main` su na istom commitu (' + MAIN.slice(0, 7) + ') — push je obavljen' +
    '\n      → zastarjela ZAPOVIJED je gora od zastarjele činjenice: navodi sesiju na radnju'
  );
}

// ── prolaz ───────────────────────────────────────────────────────────
let redaka = 0;
for (const file of WATCHED) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  redaka += lines.length;
  lines.forEach((line, i) => {
    proveriBrojCommita(file, line, i);
    proveriZastarjeliNalog(file, line, i);
  });
}

// ── izvještaj ────────────────────────────────────────────────────────
console.log('\n=== check:state ===');
console.log('  dokumenata     : ' + WATCHED.filter((f) => fs.existsSync(f)).length + ' (' + redaka + ' redaka)');
console.log('  živih grana    : ' + branches.filter((b) => b !== 'main').length);
if (skipped.length) {
  console.log('  preskočeno     : ' + skipped.length);
  skipped.forEach((s) => console.log('     · ' + s));
}
if (problems.length === 0) {
  console.log('\n✅ tvrdnje o stanju se slažu s repozitorijem\n');
  process.exit(0);
}
console.log('\n❌ ' + problems.length + ' zastarjel(a) tvrdnja:\n');
problems.forEach((p) => console.log('   • ' + p));
console.log('');
process.exit(1);
