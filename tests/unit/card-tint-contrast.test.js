/* eslint-disable no-console */
// ===== TINTA NA AKCENTU KARTICE: pilula kategorije i tekst, kroz SVE boje gradiva =====
// Pokreni: node tests/unit/card-tint-contrast.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: kartica s bojom (C2/M3b) crta PUNU ISPUNU akcenta i bira tintu izračunom
// (`inkForTint`, `js/utils.js`). Pilula kategorije nad tom ispunom miješa postotak tinte —
// i dok je miješala ISTU tintu, tamno je padalo na tamno: `#8b5cf6` → `#6f4ac5` = 3,46 (treba
// 4,5), `#ec4899` → `#bd3a7a` = 4,05, ukupno 11 od 20 boja gradiva, najgori 3,31.
//
// ⚠️ ZAŠTO OVO NE OSTAJE a11y-BRANI (`tests/a11y.spec.js`): ona skenira JEDNU karticu, a špil se
// miješa BEZ SJEMENA (`shuffleArray(deck)`) — pad ovisi o tome koja boja slučajno ispadne prva.
// Izmjereno 2026-09-08: ista brana, isti kod, 3 pada u 6 pokretanja. Brana koja hvata svako
// drugo pokretanje nije brana nego kocka; ovdje se ista činjenica provjerava deterministično,
// nad SVIM bojama odjednom i bez preglednika.
//
// ⚠️ I ZAŠTO JE UOPĆE PROLAZILO NA PRODUKCIJI: axe je na `#cardCategory` vraćao `incomplete —
// bgOverlap` („podloga se ne da odrediti, element je prekriven"), jer naličje u `preserve-3d`
// prekriva lice u hit-testu — a gate sudi po violationima, pa je to čitao kao šutnju. Prazan
// rezultat koji znači „ne mogu pročitati" ne smije se čitati kao „nema što mjeriti" (isti
// razred propusta kao `parseColor` u `check-contrast.js`).
//
// IZVOR ISTINE SU DATOTEKE, NE OVAJ ZAPIS: postotak i tokeni se ČITAJU iz
// `flashcards-section.css`, tinte iz `tokens.css`, prag iz `js/utils.js`, boje iz `data/**`.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const citaj = (...r) => fs.readFileSync(path.join(KORIJEN, ...r), 'utf8');

let pao = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime, detalj) => {
    ukupno++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  →  ' + JSON.stringify(detalj) : '')); }
};

// ── boja (ista matematika kao `inkForTint` i `check-contrast.js`) ───────────────
function rgb(hex) {
    let h = String(hex).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum(hex) {
    const k = rgb(hex).map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
}
const kontrast = (a, b) => {
    const L1 = lum(a), L2 = lum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
// `color-mix(in srgb, X p%, transparent)` preko podloge = X s alfom p nad podlogom
const preko = (boja, podloga, p) => '#' + rgb(boja)
    .map((v, i) => Math.round(p * v + (1 - p) * rgb(podloga)[i]).toString(16).padStart(2, '0'))
    .join('');

const CSS = citaj('css', 'flashcards-section.css');
const TOKENS = citaj('css', 'tokens.css');
const UTILS = citaj('js', 'utils.js');
const BUNDLE = citaj('styles.bundle.css');

console.log('\n═══ TINTA NA AKCENTU KARTICE ═══════════════════════════════════════════════\n');

// ── ① UGOVOR U CSS-u: pilula miješa SUPROTNU tintu, i to kroz tokene ───────────
console.log('── ① pravilo pilule ─────────────────────────────────────────────────────');
const pravilo = (ink) => {
    const m = CSS.match(new RegExp('\\.flashcard\\[data-ink="' + ink + '"\\]\\s*\\.card-category\\s*\\{[^}]*\\}'));
    if (!m) return null;
    const mix = m[0].match(/color-mix\(\s*in srgb\s*,\s*var\((--color-on-tint-(?:dark|light))\)\s*([\d.]+)%\s*,\s*transparent\s*\)/);
    return mix ? { token: mix[1], p: parseFloat(mix[2]) / 100 } : null;
};
const tamna = pravilo('dark');
const svijetla = pravilo('light');
tvrdi(!!tamna && !!svijetla, 'obje inačice pilule postoje (`[data-ink="dark"]` i `[data-ink="light"]`)', { tamna, svijetla });
tvrdi(!!tamna && tamna.token === '--color-on-tint-light',
    'pod TAMNOM tintom pilula miješa SVIJETLU (suprotnu) — miješanje iste tinte je kvar koji ova brana čuva', tamna);
tvrdi(!!svijetla && svijetla.token === '--color-on-tint-dark',
    'pod SVIJETLOM tintom pilula miješa TAMNU (suprotnu)', svijetla);
tvrdi(/\.card-category\s*\{[^}]*currentColor 20%/.test(CSS),
    'kartica BEZ boje zadržava zatečenu pilulu od `currentColor` (fallback-ugovor M3b je netaknut)');
tvrdi(BUNDLE.indexOf('.flashcard[data-ink="dark"] .card-category') >= 0,
    'styles.bundle.css nosi pravilo (bez `build:css` preglednik crta staro, a brane su zelene)');

// ── ② TINTE I PRAG — čitaju se, ne prepisuju ───────────────────────────────────
const token = (ime) => {
    const m = TOKENS.match(new RegExp(ime + '\\s*:\\s*(#[0-9a-fA-F]{3,6})\\s*;'));
    return m ? m[1] : null;
};
const TAMNA_TINTA = token('--color-on-tint-dark');
const SVIJETLA_TINTA = token('--color-on-tint-light');
const PRAG = parseFloat((UTILS.match(/TINT_INK_CROSSOVER\s*=\s*([\d.]+)/) || [])[1]);
console.log('\n── ② izvori ─────────────────────────────────────────────────────────────');
tvrdi(!!TAMNA_TINTA && !!SVIJETLA_TINTA, 'tinte se čitaju iz `css/tokens.css`', { TAMNA_TINTA, SVIJETLA_TINTA });
tvrdi(isFinite(PRAG), 'prag `TINT_INK_CROSSOVER` se čita iz `js/utils.js`', PRAG);

// ── ③ SVE BOJE GRADIVA ────────────────────────────────────────────────────────
// Namjerno ŠIROKO: `applyAccent` prima `card.color` I boju sekcije, a obje dolaze iz istih
// datoteka i iste palete. Boja koja danas stoji samo u bloku sutra je akcent kartice.
const boje = new Set();
const pokupi = (tekst) => (tekst.match(/color:\s*'#[0-9a-fA-F]{3,6}'/g) || [])
    .forEach((m) => boje.add(m.match(/#[0-9a-fA-F]{3,6}/)[0].toLowerCase()));
(function hodaj(d) {
    for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) { if (f !== 'json') hodaj(p); }
        else if (f.endsWith('.js')) pokupi(fs.readFileSync(p, 'utf8'));
    }
})(path.join(KORIJEN, 'data'));
fs.readdirSync(KORIJEN).filter((f) => /^data-.*\.js$/.test(f)).forEach((f) => pokupi(citaj(f)));

console.log('\n── ③ kontrast kroz sve boje gradiva (' + boje.size + ' različitih) ──────────────');
tvrdi(boje.size >= 15, 'boje su stvarno pokupljene iz gradiva (prazan skup = brana koja ništa ne mjeri)', boje.size);

const padaPilula = [];
const padaTekst = [];
for (const b of boje) {
    const tamnaTinta = lum(b) > PRAG;                       // isti izračun kao `inkForTint`
    const tinta = tamnaTinta ? TAMNA_TINTA : SVIJETLA_TINTA;
    const pravRedak = tamnaTinta ? tamna : svijetla;
    if (!pravRedak || !tinta) break;
    const mijesa = pravRedak.token === '--color-on-tint-dark' ? TAMNA_TINTA : SVIJETLA_TINTA;
    const pilula = preko(mijesa, b, pravRedak.p);
    const kP = kontrast(tinta, pilula);
    const kT = kontrast(tinta, b);
    if (kP < 4.5) padaPilula.push([b, pilula, +kP.toFixed(2)]);
    if (kT < 4.5) padaTekst.push([b, +kT.toFixed(2)]);
}
tvrdi(padaPilula.length === 0,
    'pilula kategorije drži AA (4,5:1) nad SVAKOM bojom gradiva', padaPilula);
tvrdi(padaTekst.length === 0,
    'tekst kartice drži AA nad svakom bojom (prag `inkForTint` bira tintu koja stvarno prolazi)', padaTekst);

console.log('\n' + (pao ? '❌ palo: ' + pao + ' od ' + ukupno : '✅ sve prošlo (' + ukupno + ' tvrdnji)') + '\n');
process.exit(pao ? 1 : 0);
