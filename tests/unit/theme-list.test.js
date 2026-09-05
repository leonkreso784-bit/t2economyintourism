/* eslint-disable no-console */
// ===== POPIS TEMA IMA JEDNO MJESTO — `css/tokens.css` kroz `scripts/teme.js` (F1/4) =====
// Pokreni: node tests/unit/theme-list.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: `tests/helpers/axe-gate.js` je do F1/4 nosio zakucan popis tema s mrtvim
// `paper` (maknut 2026-09-01) i BEZ `carbon` (dodan 2026-09-05) — a11y-suita je skenirala temu
// koje nema i preskakala jedinu novu tamnu, zelena cijelo vrijeme. `check-contrast-live.js` je
// imao svoju kopiju (slučajno točnu). Nijedna brana to nije vidjela, jer je popis bio
// PODATAK brane, ne nešto što brana mjeri. Ovdje se mjeri: svaki čitatelj ide kroz jedan
// modul, nijedan nema kopiju, a modul čita ono što CSS stvarno definira.
//
// Obrnuta provjera (2026-09-06, `git worktree` na stablu prije F1/4 uz kopiran modul i
// ovaj test): čitatelji bez `require` + a11y-popis ≠ tokeni → crveno.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
let pao = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime, detalj) => {
    ukupno++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  →  ' + JSON.stringify(detalj) : '')); }
};
const citaj = (rel) => fs.readFileSync(path.join(KORIJEN, rel), 'utf8');
const bezKom = (js) => js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

console.log('\n=== popis tema: jedno mjesto (scripts/teme.js) ===\n');

const { temeIzTokena, bezKomentara, TEMA_BLOK_RE } = require('../../scripts/teme');

// ① Modul čita ono što CSS ima — i to je danas ≥ 4 teme, s carbonom, bez papera.
const teme = temeIzTokena();
tvrdi(teme.length >= 4, 'tokens.css definira ≥ 4 teme: ' + teme.join(', '), teme);
tvrdi(teme.indexOf('carbon') >= 0, '`carbon` je među njima (a11y-brana ga do F1/4 nije skenirala)', teme);
tvrdi(teme.indexOf('paper') < 0, '`paper` NIJE među njima (maknut 2026-09-01; a11y-brana ga je skenirala)', teme);
tvrdi(new Set(teme).size === teme.length, 'bez duplikata', teme);
tvrdi(teme.every((t) => /^[a-z0-9-]+$/.test(t)), 'imena su iz [a-z0-9-] (ista abeceda kao `boot.js` provjera)', teme);

// ② Komentari se skidaju: primjer bloka u komentaru NE postaje tema (pouka F1/7 ②).
const lazni = '/* primjer: :root[data-theme="lazna"] { --x: 1 } */\n:root[data-theme="prava"] {\n  --x: 2;\n}\n';
tvrdi(JSON.stringify(temeIzTokena(lazni)) === '["prava"]', 'tema iz komentara se NE broji', temeIzTokena(lazni));
tvrdi(bezKomentara(lazni).indexOf('lazna') < 0, 'bezKomentara() skida blok-komentar');

// ③ Nula tema = greška, ne prazan niz (brana koja prođe nula tema i šuti je kvar koji zatvaramo).
let bacio = false;
try { temeIzTokena(':root { --x: 1 }'); } catch (e) { bacio = /nijedan/.test(String(e.message)); }
tvrdi(bacio, 'CSS bez ijednog `[data-theme]` bloka → modul BACA (ne vraća [])');

// ④ Svaki čitatelj ide kroz modul i NEMA vlastitu kopiju (ni niz imena, ni vlastiti regex).
const CITATELJI = [
    'scripts/check-contrast-live.js',
    'scripts/check-contrast.js',
    'tests/helpers/axe-gate.js',
    'tests/unit/theme-boot-order.test.js',
];
const kopijaNiza = /\[[^\]]*['"](academic|chalk|mint|carbon|paper)['"][^\]]*['"](academic|chalk|mint|carbon|paper)['"][^\]]*\]/;
for (const rel of CITATELJI) {
    const izvor = bezKom(citaj(rel));
    tvrdi(/require\(['"][./]*(scripts\/)?teme['"]\)/.test(izvor) || /require\(['"]\.\/teme['"]\)/.test(izvor),
        rel + ': require(…/teme)');
    tvrdi(!kopijaNiza.test(izvor), rel + ': bez vlastitog niza imena tema');
    tvrdi(!/data-theme="\(\[/.test(izvor), rel + ': bez vlastitog regexa za `[data-theme="…"]` blok');
}
// Regex za blok teme živi SAMO u modulu.
tvrdi(TEMA_BLOK_RE instanceof RegExp && /data-theme/.test(TEMA_BLOK_RE.source), 'TEMA_BLOK_RE je izvezen iz modula');

// ⑤ Ono što a11y-brana stvarno vrti == tokeni + zadana (`null`). Ne tekst, nego izvezena vrijednost.
const { TEME: a11yTeme } = require('../helpers/axe-gate');
tvrdi(Array.isArray(a11yTeme) && a11yTeme[0] === null, 'axe-gate TEME počinje zadanom (null, goli :root)');
tvrdi(JSON.stringify(a11yTeme.slice(1)) === JSON.stringify(teme),
    'axe-gate TEME (bez null) == teme iz tokens.css', { a11y: a11yTeme, tokeni: teme });

// ⑥ `boot.js` mora zadržati SVOJ niz (izvršava se prije crtanja) — a on == tokeni.
//    Isto tvrdi i theme-boot-order.test.js; ovdje se dokazuje da je i TAJ test na modulu (④),
//    pa jedna promjena u tokens.css obara oba, ne jedan.
const boot = citaj('js/boot.js');
const uBootu = (boot.match(/var TEME = \[([^\]]+)\]/) || [, ''])[1]
    .split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean).sort();
tvrdi(JSON.stringify(uBootu) === JSON.stringify(teme.slice().sort()),
    'boot.js TEME == tokens.css (boot smije nositi niz jer se vrti prije CSS-a)', { boot: uBootu, tokeni: teme });

console.log('\n' + (pao ? '❌ palo: ' + pao + ' / ' + ukupno : '✅ sve prošlo (' + ukupno + ' tvrdnji)') + '\n');
process.exit(pao ? 1 : 0);
