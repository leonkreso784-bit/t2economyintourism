/* eslint-disable no-console */
// ===== TEMA SE MORA ODLUČITI PRIJE PRVOG CRTANJA =====
// Pokreni: node tests/unit/theme-boot-order.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: bljesak krive teme (Leon, 2026-09-04: „prvo se učita bijela obična
// stranica pa onda na brzinu theme koji je izabran") nastao je zato što je `theme.js`
// stajao na DNU stranice i primjenjivao temu tek na `DOMContentLoaded` — iza 42 skripte
// koje blokiraju parser. Popravak je selio popis tema i primjenu u `js/boot.js`, jedinu
// SINKRONU skriptu na vrhu `<body>`.
//
// Taj popravak ima tri načina da tiho umre, i sva tri se ovdje love:
//   ① netko doda `defer`/`async` na `boot.js`  → odluka opet pada IZA crtanja;
//   ② nova stranica učita `theme.js` bez `boot.js` → `__sokratPrimijeniTemu` ne postoji;
//   ③ netko vrati drugu kopiju popisa tema u `theme.js` → dvije istine koje se razilaze,
//      a razlaz se vidi točno kao — bljesak.
// Nijedno od toga ne bi oborilo nijednu postojeću branu, a `check:budget`/`check:csp`
// gledaju sasvim druge stvari. Zato zasebna, brza, offline provjera.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
let pao = 0;
const tvrdi = (uvjet, ime) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime); }
};

console.log('\n=== tema prije prvog crtanja (boot.js) ===\n');

const stranice = fs.readdirSync(KORIJEN).filter((f) => f.endsWith('.html'));
tvrdi(stranice.length >= 2, 'nađene HTML stranice: ' + stranice.join(', '));

for (const ime of stranice) {
    const html = fs.readFileSync(path.join(KORIJEN, ime), 'utf8');
    const boot = html.search(/<script[^>]+js\/boot\.js/);
    const tema = html.search(/<script[^>]+js\/theme\.js/);
    if (tema < 0) { console.log('  ·  ' + ime + ' ne učitava theme.js — preskačem'); continue; }

    tvrdi(boot >= 0, ime + ': učitava boot.js (jer učitava theme.js)');
    tvrdi(boot >= 0 && boot < tema, ime + ': boot.js dolazi PRIJE theme.js');

    // ① Sinkronost: `defer`/`async` bi odluku vratili iza prvog crtanja — točno bug koji
    //    popravljamo. Gledamo SAMO tag boot.js-a, ne cijeli dokument.
    const tag = boot >= 0 ? html.slice(boot, html.indexOf('>', boot) + 1) : '';
    tvrdi(!/\b(defer|async)\b/.test(tag), ime + ': boot.js je SINKRON (bez defer/async) — ' + tag.trim());

    // Atribut u markupu je i dalje zadana tema (za posjetitelja bez spremljene teme i za
    // slučaj da JS ne prođe). Nije bug — ali NIJE ni rješenje za `chalk`/`mint`.
    tvrdi(/<html[^>]+data-theme=/.test(html), ime + ': <html> ima zadani data-theme u markupu');
}

// ② i ③ — jedan popis, jedno mjesto.
const boot = fs.readFileSync(path.join(KORIJEN, 'js', 'boot.js'), 'utf8');
const tema = fs.readFileSync(path.join(KORIJEN, 'js', 'theme.js'), 'utf8');

tvrdi(/window\.__sokratPrimijeniTemu\s*=/.test(boot), 'boot.js izlaže __sokratPrimijeniTemu');
tvrdi(/window\.SOKRAT_THEMES\s*=/.test(boot), 'boot.js izlaže SOKRAT_THEMES');
tvrdi(/localStorage\.getItem\(\s*['"]sokrat-theme['"]/.test(boot), 'boot.js ČITA spremljenu temu (inače popravlja ništa)');
tvrdi(/data-theme/.test(boot), 'boot.js postavlja data-theme');

// Popis tema smije postojati SAMO u boot.js. Tražimo doslovan niz imena tema u theme.js.
const kopijaPopisa = /\[[^\]]*['"]chalk['"][^\]]*['"]mint['"][^\]]*\]/.test(tema)
    || /\[[^\]]*['"]academic['"][^\]]*['"]chalk['"][^\]]*\]/.test(tema);
tvrdi(!kopijaPopisa, 'theme.js NEMA vlastitu kopiju popisa tema');
tvrdi(/window\.__sokratPrimijeniTemu\(\)/.test(tema), 'theme.js primjenjuje temu kroz boot-funkciju');

// Popis u boot.js mora odgovarati temama koje CSS stvarno definira — inače je izbor
// koji nigdje ne postoji (ili tema koju biraču nitko nije ponudio).
const tokeni = fs.readFileSync(path.join(KORIJEN, 'css', 'tokens.css'), 'utf8');
const uCssu = [...tokeni.matchAll(/:root\[data-theme="([a-z]+)"\]/g)].map((m) => m[1]).sort();
const uBootu = (boot.match(/var TEME = \[([^\]]+)\]/) || [, ''])[1]
    .split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean).sort();
tvrdi(uCssu.length > 0 && JSON.stringify(uCssu) === JSON.stringify(uBootu),
    'popis tema u boot.js == teme u tokens.css  (css: ' + uCssu.join(',') + ' · boot: ' + uBootu.join(',') + ')');

console.log('\n' + (pao ? '❌ palo: ' + pao : '✅ sve prošlo') + '\n');
process.exit(pao ? 1 : 0);
