/* eslint-disable no-console */
// ===== DODIR NE ZUMIRA — `touch-action` i 16 px u BUNDLEU i na pravnim stranicama (F1/10) =====
// Pokreni: node tests/unit/touch-zoom.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-05): „kada se više puta takne na jedno mjesto može se zoomat,
// to se mora riješit". Dva uzroka, dva pravila, oba u resetu `css/variables.css` — i drugi
// primjerak `touch-action`-a u `css/legal.css`, jer četiri pravne stranice ne učitavaju bundle:
//
//   ① `touch-action: manipulation` na `*` gasi Safarijev dvostruki dodir; skrol i štipanje
//      OSTAJU (za razliku od `user-scalable=no`, koji je odbačen — uzeo bi i štipanje).
//      NEMJERLJIVO u headlessu: gestu izvodi Safarijev UI-proces, ne stranica (24 mjerenja,
//      WebKit + Chromium, `visualViewport.scale` uvijek 1). Zato je ovdje STATIČKA tvrdnja o
//      onome što preglednik stvarno dobije, a presudu daje Leon na iPhoneu.
//   ② polja ≥ 16 px na dodiru (`@media (pointer: coarse)`), inače iOS zumira pri fokusu i ne
//      vraća se. Ovo JE mjerljivo — mjeri ga tvrdnja ⑨ u `tests/phone.spec.js`. Ovdje samo da
//      pravilo nije ispalo iz bundlea i da se STARO njuškanje motora nije vratilo:
//      `@supports (-webkit-touch-callout: none) { … font-size: 16px !important }` ne zadovoljava
//      NIJEDAN motor naših brana (Chromium i Playwrightov WebKit: `CSS.supports` = false), pa je
//      godinu dana bilo nevidljivo svakom mjerenju — je li iPhone dobio 16 px nije znao nitko.
//
// ⚠️ Čita BUNDLE (`styles.bundle.css`), ne izvor: lightningcss smije preslagati, a do korisnika
// stiže samo bundle. Da `build:css` ispusti pravilo, izvor bi i dalje bio „ispravan".

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const bundle = fs.readFileSync(path.join(KORIJEN, 'styles.bundle.css'), 'utf8');
const legal = fs.readFileSync(path.join(KORIJEN, 'css', 'legal.css'), 'utf8');

let pao = 0;
const tvrdi = (uvjet, ime) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime); }
};

/** Tijela svih pravila čiji je selektor TOČNO `*` (bez `*::before`, bez `.x *`). */
function univerzalna(css) {
    const out = [];
    const re = /(^|[\n;{}])\s*\*\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(css))) out.push(m[2]);
    return out;
}

/** Tijelo bloka (uključivo ugniježđene vitičaste) koji počinje na `od` — prvi `{` iza njega. */
function blok(css, od) {
    const start = css.indexOf('{', od);
    if (start < 0) return '';
    let dubina = 0;
    for (let i = start; i < css.length; i++) {
        if (css[i] === '{') dubina++;
        else if (css[i] === '}' && --dubina === 0) return css.slice(start + 1, i);
    }
    return css.slice(start + 1);
}

/** Svi blokovi čiji at-prolog odgovara regexu. */
function blokovi(css, re) {
    const out = [];
    let m;
    const g = new RegExp(re.source, 'g');
    while ((m = g.exec(css))) out.push(blok(css, m.index));
    return out;
}

console.log('\n=== dodir ne zumira: touch-action + 16 px (F1/10) ===\n');

// ① dvostruki dodir — reset u bundleu i u legal.css
const uniB = univerzalna(bundle);
tvrdi(uniB.length > 0, 'bundle ima pravilo sa selektorom `*` (reset iz variables.css)');
tvrdi(uniB.some((t) => /touch-action:\s*manipulation/.test(t)), 'bundle: `*` nosi `touch-action: manipulation`');
const uniL = univerzalna(legal);
tvrdi(uniL.some((t) => /touch-action:\s*manipulation/.test(t)), 'legal.css: `*` nosi `touch-action: manipulation` (pravne stranice nemaju bundle)');
// Isto pravilo NE smije živjeti i lokalno — jedna činjenica, jedno mjesto (ADR-027). Ručke za
// vučenje s `touch-action: none` su DRUGA vrijednost i smiju ostati.
const lokalni = (bundle.match(/touch-action:\s*manipulation/g) || []).length;
tvrdi(lokalni === 1, 'bundle: `touch-action: manipulation` postoji TOČNO jednom (u resetu), nađeno ' + lokalni);

// ② polja ≥ 16 px na dodiru — pravilo po SPOSOBNOSTI, mjerljivo u svakom motoru
const coarse = blokovi(bundle, /@media\s*\(pointer:\s*coarse\)/);
tvrdi(coarse.length > 0, 'bundle ima `@media (pointer: coarse)`');
tvrdi(coarse.some((b) => /input/.test(b) && /select/.test(b) && /textarea/.test(b) && /font-size:\s*16px/.test(b)),
    'bundle: pod `(pointer: coarse)` input/select/textarea dobivaju `font-size: 16px`');
tvrdi(coarse.every((b) => !/!important/.test(b)), 'bundle: to pravilo NE koristi `!important` (specifičnost, ne sila)');

// Staro njuškanje se ne vraća: nijedan `@supports (-webkit-touch-callout: none)` blok ne dira font.
const njuskanje = blokovi(bundle, /@supports\s*\(-webkit-touch-callout:\s*none\)/);
tvrdi(njuskanje.every((b) => !/font-size/.test(b)),
    'bundle: nijedan `@supports (-webkit-touch-callout: none)` blok ne postavlja `font-size` (njuškanje motora = nemjerljivo)');
const fsImportant = (bundle.match(/font-size:[^;]*!important/g) || []).length;
tvrdi(fsImportant === 0, 'bundle: nula `font-size … !important` (bilo 1, iz istog njuškanja), nađeno ' + fsImportant);

console.log('\n' + (pao ? '❌ palo: ' + pao : '✅ sve prošlo') + '\n');
process.exit(pao ? 1 : 0);
