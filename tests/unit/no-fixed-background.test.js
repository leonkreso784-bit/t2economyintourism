/* eslint-disable no-console */
// ===== POZADINA NIKAD `fixed` — landing se ne preboji svaki kadar (F1/7 ①) =====
// Pokreni: node tests/unit/no-fixed-background.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: `scripts/jank-probe.js` (F1/6) je na 10 ruta našao JEDNU koja preboji ekran
// dok se skrola — landing, 240 paintova / 533 Mpx po prolazu (≈ 70 % ekrana SVAKI kadar),
// 28–54 ispuštena kadra — i protučinjenično dokazao jedini uzrok: dva sloja s
// `background-attachment: fixed` (zrno + odsjaj). Bez zamućenja / sjena / prijelaza = isto;
// bez `fixed` = 0 paintova, 0 ispuštenih. `fixed` znači da preglednik pozadinu mora PRECRTATI
// za svaki pomak jer ona ne putuje sa slojem; `scroll` ju kompozitor samo pomiče. iOS Safari
// `fixed` ionako crta kao `scroll`, pa iPhone ovime ne mijenja izgled — Android i stolni Chrome
// prestaju plaćati. Trzanje se u pregledu koda ne vidi; ova brana ga vidi.
//
// ⚠️ Čita BUNDLE (što preglednik dobije) I izvor (`css/*.css` bez komentara): bundle da pravilo
// ne uđe kroz Tailwind ili tuđi modul, izvor da se ne vrati u modul koji tek čeka `build:css`.
// Popravak je `scroll`, NE brisanje: zrno „nije opcionalno" (landing.css) — pa se tvrdi i da
// tekstura još postoji. Obrnuto (2026-09-05, stablo prije F1/7 ①): bundle 1, landing.css 1 → crveno.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const bundle = fs.readFileSync(path.join(KORIJEN, 'styles.bundle.css'), 'utf8');
const CSS_DIR = path.join(KORIJEN, 'css');
const bezKomentara = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const fiksne = (css) => (bezKomentara(css).match(/background-attachment\s*:[^;}]*\bfixed\b[^;}]*/g) || []);

let pao = 0;
const tvrdi = (uvjet, ime) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime); }
};

console.log('\n=== pozadina nikad `fixed` (F1/7 ①) ===\n');

// ① bundle — ono što preglednik stvarno dobije
const uBundleu = fiksne(bundle);
tvrdi(uBundleu.length === 0, 'bundle: nula `background-attachment … fixed`' + (uBundleu.length ? ' — NAĐENO: ' + uBundleu.join(' | ') : ''));

// ② izvor — svaki modul, bez komentara (komentar smije objasniti zašto `fixed` NE)
const moduli = fs.readdirSync(CSS_DIR).filter((f) => f.endsWith('.css')).sort();
tvrdi(moduli.length > 10, 'css/ ima module za provjeru: ' + moduli.length);
const krivci = moduli.filter((f) => fiksne(fs.readFileSync(path.join(CSS_DIR, f), 'utf8')).length);
tvrdi(krivci.length === 0, 'izvor: nijedan modul ne nosi `fixed` pozadinu' + (krivci.length ? ' — ' + krivci.join(', ') : ''));

// ③ popravak nije brisanje: landing i dalje ima zrno (SVG fractalNoise) i odsjaj
const landingPravilo = bundle.match(/\.landing-page\.active\s*\{[^}]*\}/);
tvrdi(!!landingPravilo, 'bundle: pravilo `.landing-page.active { … }` postoji');
tvrdi(!!landingPravilo && /fractalNoise/.test(landingPravilo[0]) && /radial-gradient/.test(landingPravilo[0]),
    'bundle: landing zadržava zrno (fractalNoise) i odsjaj (radial-gradient) — popravak je `scroll`, ne brisanje');

console.log('\n' + (pao ? '❌ palo: ' + pao : '✅ sve prošlo') + '\n');
process.exit(pao ? 1 : 0);
