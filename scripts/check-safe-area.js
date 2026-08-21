#!/usr/bin/env node
/**
 * check:safearea — sigurna zona ima JEDAN izvor (cigla T1, spec §9.8).
 *
 * ── POVOD (izmjereno, nije pretpostavljeno) ─────────────────────────────────────
 * `viewport-fit=cover` je postavljen, dakle stranica se NAMJERNO crta ispod izreza i
 * home-indikatora — pa je od tog trenutka svaki nenadoknađen rub regresija (BUG-031).
 * Nadoknada je postojala na dva načina odjednom:
 *
 *     var(--safe-bottom)                     ← naš token, `css/variables.css`
 *     env(safe-area-inset-bottom, 0px)       ← izravno, u 18 pravila kroz 5 datoteka
 *
 * Dvije liste iste činjenice neizbježno se raziđu — i jesu: `.landing-footer` je imao
 * ISPRAVNO pravilo napisano golim `env()`, a `.browse-content` je svoje izgubio jer ga
 * je kratica `padding:` u medijskom upitu pregazila. Prvo se nije vidjelo, drugo jest.
 *
 * ── ZAŠTO JE GOLI `env()` GORI OD KRIVE VRIJEDNOSTI ────────────────────────────
 * `env()` se u Chromiumu **ne da simulirati**. Jedini poznati način da se sigurna zona
 * uopće izmjeri jest postaviti NAŠU varijablu iznad njega (`--safe-top: 59px`) i vidjeti
 * što se pomakne. Pravilo napisano golim `env()` ta zamjena ne dohvaća → ostaje 0, i u
 * pregledniku i u brani. Dakle: **pravilo s golim `env()` je pravilo koje nijedan test
 * ne može ni potvrditi ni oboriti.** Zato ovdje ne stoji stilska preporuka nego brana.
 *
 * Ista pouka koju projekt već plaća na drugom mjestu: *gate koji provjerava NEKE tokene
 * stvara tihu pretpostavku da su provjereni SVI* (`check:contrast`, tvrda zabrana #2).
 *
 * Read-only, bez mreže → ide u `npm run preflight`.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..');

/** Jedina datoteka koja SMIJE spomenuti `env(safe-area-inset-*)`. */
const IZVOR = path.join('css', 'variables.css');

/** Generiran izlaz `build:css` — izvadak `:root` blokova iz bundlea, dakle KOPIJA
 *  izvora. Nema smisla braniti kopiju od sadržaja koji je u nju prepisan strojno. */
const GENERIRANO = [path.join('css', 'tokens.static.css'), 'styles.bundle.css'];

const TOKENI = ['--safe-top', '--safe-bottom', '--safe-left', '--safe-right'];
const NALAZ_ENV = /env\(\s*safe-area-inset-(top|bottom|left|right)/g;

/**
 * Izbaci CSS komentare, ali ZADRŽI prijelome redaka — inače prijavljeni broj retka
 * pokazuje na krivo mjesto i nalaz se ne da naći.
 *
 * ⚠️ **Ovo nije zaobilaženje brane nego njezin uvjet ispravnosti.** Prva verzija je
 * čitala datoteku kao goli tekst i odmah prijavila **vlastiti komentar** koji objašnjava
 * zašto je goli `env()` maknut. Komentar nije pravilo: ne izvršava se, ne može ništa
 * pregaziti, i mora se smjeti napisati — inače se objašnjenje ne da zapisati ondje gdje
 * pripada. Isti razred kao `check:tailwind` §šum, gdje je skener iz proze u `studio.js`
 * izvukao kandidat-klasu: *skener vidi tekst, ne pravila.*
 */
function bezKomentara(tekst) {
    return tekst.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function sviCss(dir, izlaz) {
    izlaz = izlaz || [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) sviCss(p, izlaz);
        else if (d.name.endsWith('.css')) izlaz.push(p);
    });
    return izlaz;
}

const greske = [];

// ── ① Goli `env()` izvan jedinog izvora ────────────────────────────────────────
const datoteke = sviCss(path.join(KORIJEN, 'css'));
['index.html'].forEach((f) => {
    const p = path.join(KORIJEN, f);
    if (fs.existsSync(p)) datoteke.push(p);
});

datoteke.forEach((p) => {
    const rel = path.relative(KORIJEN, p);
    if (rel === IZVOR || GENERIRANO.indexOf(rel) !== -1) return;
    const redci = bezKomentara(fs.readFileSync(p, 'utf8')).split(/\r?\n/);
    redci.forEach((redak, i) => {
        NALAZ_ENV.lastIndex = 0;
        if (NALAZ_ENV.test(redak)) {
            greske.push(rel + ':' + (i + 1) + '  ' + redak.trim().slice(0, 100));
        }
    });
});

// ── ② Izvor stvarno definira sva četiri tokena ─────────────────────────────────
// Bez ovoga bi brana ① bila zadovoljna i kad token uopće ne postoji: nula golih
// `env()` je savršena ocjena i za stranicu koja sigurnu zonu ne poznaje.
const izvorTekst = fs.readFileSync(path.join(KORIJEN, IZVOR), 'utf8');
const nedostaju = TOKENI.filter((t) => izvorTekst.indexOf(t + ':') === -1);

// ── Ispis ──────────────────────────────────────────────────────────────────────
if (!greske.length && !nedostaju.length) {
    console.log('✅ check:safearea — sigurna zona ima jedan izvor (' + IZVOR + '), '
        + datoteke.length + ' datoteka provjereno.');
    process.exit(0);
}

if (nedostaju.length) {
    console.error('❌ ' + IZVOR + ' ne definira: ' + nedostaju.join(', '));
}
if (greske.length) {
    console.error('❌ goli env(safe-area-inset-*) izvan ' + IZVOR + ' — ' + greske.length + ' mjesta:\n');
    greske.forEach((g) => console.error('   ' + g));
    console.error('\n   Zamijeni s var(--safe-top|bottom|left|right).');
    console.error('   Razlog nije stil: env() se ne da simulirati u pregledniku, pa pravilo');
    console.error('   napisano njime nijedan test ne može ni potvrditi ni oboriti');
    console.error('   (tests/helpers/phone-gate.js, tvrdnje ①⑥⑦).');
}
process.exit(1);
