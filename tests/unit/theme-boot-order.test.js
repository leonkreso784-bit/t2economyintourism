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
    // F1/5 (2026-09-06): SVAKA stranica u korijenu učitava boot.js — i pravne (contact/faq/privacy/
    // terms), koje dotad nisu imale ni `data-theme` ni boot. Od F1/3 stranica prati uređaj, pa je
    // korisnik na tamnom telefonu dobivao crn katalog i BIJELA Pravila privatnosti. Preskakanje
    // stranica bez theme.js bila je rupa u ovoj brani: birač teme nije preduvjet za temu.
    tvrdi(boot >= 0, ime + ': učitava boot.js (svaka stranica, ne samo one s biračem)');
    if (tema >= 0) tvrdi(boot >= 0 && boot < tema, ime + ': boot.js dolazi PRIJE theme.js');

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

// F1/3: bez izbora se prati UREĐAJ — i to isto mora pasti PRIJE crtanja, dakle u boot.js.
// Da je `prefers-color-scheme` čitao theme.js, tamni telefon bi opet vidio bljesak bijele.
tvrdi(/prefers-color-scheme/.test(boot), 'boot.js čita prefers-color-scheme (uređaj se odlučuje prije crtanja)');
tvrdi(/window\.__sokratIzborTeme\s*=/.test(boot), 'boot.js izlaže __sokratIzborTeme (jedno pravilo „što je izbor")');
// ⚠️ ZAPIS NA UČITAVANJU je zabranjen: `initTheme()` je do F1/3 upisivao primijenjenu temu,
// čime bi „Automatski" trajao točno jedno učitavanje. Ponašanje čuva theme-device.test.js;
// ovdje se čuva OBLIK — da se `setItem` ne vrati u initTheme „radi urednosti".
// Komentari se skidaju prije provjere — inače brana pada na rečenici koja objašnjava zašto postoji.
const initBody = tema.slice(tema.indexOf('function initTheme'), tema.indexOf('function setTheme'))
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
tvrdi(initBody.length > 0 && !/setItem\(/.test(initBody), 'theme.js: initTheme() NE upisuje temu na učitavanju (samo briše)');

// Popis tema smije postojati SAMO u boot.js. Tražimo doslovan niz imena tema u theme.js.
const kopijaPopisa = /\[[^\]]*['"]chalk['"][^\]]*['"]mint['"][^\]]*\]/.test(tema)
    || /\[[^\]]*['"]academic['"][^\]]*['"]chalk['"][^\]]*\]/.test(tema);
tvrdi(!kopijaPopisa, 'theme.js NEMA vlastitu kopiju popisa tema');
tvrdi(/window\.__sokratPrimijeniTemu\(\)/.test(tema), 'theme.js primjenjuje temu kroz boot-funkciju');

// Popis u boot.js mora odgovarati temama koje CSS stvarno definira — inače je izbor
// koji nigdje ne postoji (ili tema koju biraču nitko nije ponudio).
// Teme iz tokena čita JEDAN modul (`scripts/teme.js`, F1/4) — ovdje je do tada stajao
// četvrti regex za istu činjenicu.
const uCssu = require('../../scripts/teme').temeIzTokena().slice().sort();
const uBootu = (boot.match(/var TEME = \[([^\]]+)\]/) || [, ''])[1]
    .split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean).sort();
tvrdi(uCssu.length > 0 && JSON.stringify(uCssu) === JSON.stringify(uBootu),
    'popis tema u boot.js == teme u tokens.css  (css: ' + uCssu.join(',') + ' · boot: ' + uBootu.join(',') + ')');

console.log('\n' + (pao ? '❌ palo: ' + pao : '✅ sve prošlo') + '\n');
process.exit(pao ? 1 : 0);
