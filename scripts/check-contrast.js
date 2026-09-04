#!/usr/bin/env node
/**
 * check-contrast.js — WCAG i hue-odvojenost za SVAKU temu  (cigla C2)
 *
 * ZAŠTO POSTOJI: s jednom paletom kontrast se da provjeriti rukom — i tako je i
 * bilo, jednokratnom skriptom. S četiri teme to je 4 × (3 plohe × ~10 boja) i
 * provjera okom prestaje biti provjera. Svaka nova tema ili jedna „samo malo
 * svjetlija" vrijednost tiho obori AA na plohi koju nitko nije pogledao.
 *
 * ŠTO PROVJERAVA, po temi:
 *   1. TEKST na plohama — ink-0/1/2 i `-ink` varijante statusa ≥ 4.5:1
 *   2. UI/ISPUNE — brand-400/600 i pune boje statusa ≥ 3.0:1
 *   3. TEKST NA GUMBU — on-brand vs brand-500 ≥ 4.5:1
 *      (povod: mentol + bijelo = 2.04. Stari indigo je podnosio bijelo, nove palete
 *      ne; u svijetlim temama je obrnuto. Zato je `on-brand` token, ne navika.)
 *   4. HUE-ODVOJENOST „točno" od marke ≥ 25°
 *      (povod: kad je marka bila mentol-zelena, zelena za točan odgovor stapala se
 *      s gumbima. U alatu za učenje je „točno/netočno" najvažniji signal na ekranu.)
 *
 * IZVOR ISTINE JE `css/tokens.css` — skripta ga PARSIRA, ne drži vlastitu kopiju
 * vrijednosti. Kopija bi se razišla, a onda bi gate čuvao paletu koje nema.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const TOKENS = path.resolve(__dirname, '..', 'css', 'tokens.css');

const TEXT_MIN = 4.5;   // WCAG AA, normalan tekst
const UI_MIN = 3.0;     // WCAG AA, veliki tekst / granice komponenti
const HUE_MIN = 25;     // naše pravilo, ne WCAG — v. gore

// ── boja ────────────────────────────────────────────────────────────────────
function parseHex(v) {
  const m = String(v).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
/**
 * Kao `parseHex`, ali razumije i `rgb(R G B / A)` — oblik u kojem `--color-mark`
 * živi u temama `chalk` i `mint`. Vraća `{ rgb, a }`; alfa 1 kad je nema.
 *
 * ⚠️ Postoji jer je `parseHex` na taj oblik vraćao `null`, a pozivatelj je `null`
 * tumačio kao „preskoči" — pa je token tiho ispao iz mjerenja u baš onim temama
 * gdje je proziran. Prazan rezultat koji znači „ne mogu pročitati" ne smije se
 * čitati kao „nema što mjeriti".
 */
function parseColor(v) {
  const s = String(v == null ? '' : v).trim();
  const hex = parseHex(s);
  if (hex) return { rgb: hex, a: 1 };
  const m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?)\s*)?\)$/i);
  if (!m) return null;
  let a = m[4] == null ? 1 : (String(m[4]).endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
  if (!isFinite(a)) a = 1;
  return { rgb: [+m[1], +m[2], +m[3]].map((n) => Math.max(0, Math.min(255, Math.round(n)))), a: Math.max(0, Math.min(1, a)) };
}

const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
function hue([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return null;
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = Math.round(h * 60);
  return h < 0 ? h + 360 : h;
}
function hueGap(a, b) {
  const ha = hue(a), hb = hue(b);
  if (ha == null || hb == null) return 360;
  const d = Math.abs(ha - hb);
  return Math.min(d, 360 - d);
}

// ── parsiranje tokens.css ───────────────────────────────────────────────────
/** Vrati mapu `--ime` → vrijednost iz jednog CSS bloka (bez komentara). */
function varsIn(block) {
  const out = {};
  const clean = block.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(clean)) !== null) out[m[1]] = m[2].trim();
  return out;
}
/** Izvuci tijelo prvog bloka koji počinje na `header` (broji vitičaste zagrade). */
function blockAfter(css, headerRe) {
  const m = headerRe.exec(css);
  if (!m) return null;
  let i = css.indexOf('{', m.index);
  if (i < 0) return null;
  let depth = 0;
  for (let j = i; j < css.length; j++) {
    if (css[j] === '{') depth++;
    else if (css[j] === '}') { depth--; if (depth === 0) return css.slice(i + 1, j); }
  }
  return null;
}

const css = fs.readFileSync(TOKENS, 'utf8');
const base = varsIn(blockAfter(css, /@theme\s+static\s*\{/) || '');

const themes = { '(zadana)': base };
const themeRe = /:root\[data-theme="([a-z0-9-]+)"\]\s*\{/gi;
let tm;
while ((tm = themeRe.exec(css)) !== null) {
  const body = blockAfter(css.slice(tm.index), /:root\[data-theme="[a-z0-9-]+"\]\s*\{/);
  themes[tm[1]] = Object.assign({}, base, varsIn(body || ''));
}

// ── provjere ────────────────────────────────────────────────────────────────
const SURFACES = ['--color-surface-0', '--color-surface-1', '--color-surface-2'];
const AS_TEXT = ['--color-ink-0', '--color-ink-1', '--color-ink-2', '--color-brand-500',
                 '--color-ok', '--color-warn-ink', '--color-danger-ink',
                 /* TINTE AUTORA (`.lb-color-*` u gradivu, 8 nijansi iz trake editora).
                    Ušle su 2026-08-31 jer ih dotad NIJEDNA brana nije vidjela: `check:palette`
                    prepoznaje fatalno samo kad su boja i pozadina u ISTOM pravilu, a ove nemaju
                    vlastitu pozadinu — nasljeđuju plohu. Slijepa točka je time bila najčešći
                    slučaj koji postoji: obojen tekst. Mjereno prije popravka: 1.47–2.98 na
                    svijetlim temama, dakle nevidljivo, a `palette-breakdown` ih je svrstavao u
                    „stara = čitljivo". Sada ih ovdje ima 8 × 3 plohe × 4 teme = 96 provjera. */
                 '--color-ink-red', '--color-ink-amber', '--color-ink-green', '--color-ink-cyan',
                 '--color-ink-blue', '--color-ink-indigo', '--color-ink-violet', '--color-ink-pink'];
/* ⚠️ `--color-line` NAMJERNO NIJE OVDJE, `--color-line-strong` jest.
   Prva verzija ovog gatea mjerila je `--color-line` na 3:1 i oborila sve četiri teme.
   Provjera je bila kriva, ne palete: WCAG 1.4.11 traži 3:1 za granice KOJE SU NUŽNE
   da se komponenta prepozna — ukrasni razdjelnik između dvije plohe je izuzet, i
   svaki ozbiljan dizajn-sustav ga drži na ~1.2–1.5:1. Da smo „popravili" vrijednost,
   svaka hairline crta postala bi tvrda pruga.
   Nalaz je ipak bio koristan: razdjelnik i RUB KONTROLE (polje, gumb) dijelili su
   jedan token, a trebaju različite pragove. Zato `--color-line-strong` postoji. */
const AS_UI = ['--color-brand-400', '--color-brand-600', '--color-line-strong',
               '--color-ok-strong', '--color-warn', '--color-danger'];

console.log('\n=== check:contrast — WCAG po temi ===');
console.log(`    tekst ≥ ${TEXT_MIN} · UI/ispune ≥ ${UI_MIN} · hue „točno" vs marka ≥ ${HUE_MIN}°\n`);

let fails = 0;
let checks = 0;

for (const [name, t] of Object.entries(themes)) {
  const problems = [];

  const grounds = SURFACES.map((s) => [s, parseHex(t[s])]).filter(([, v]) => v);

  function sweep(list, min, kind) {
    for (const key of list) {
      const fg = parseHex(t[key]);
      if (!fg) continue;                       // rgba/alpha (npr. --color-mark) — ne mjeri se ovako
      for (const [gname, gv] of grounds) {
        checks++;
        const r = ratio(fg, gv);
        if (r < min) {
          problems.push(`${key} na ${gname}: ${r.toFixed(2)} < ${min}  (${kind})`);
        }
      }
    }
  }
  sweep(AS_TEXT, TEXT_MIN, 'tekst');
  sweep(AS_UI, UI_MIN, 'UI/ispuna');

  // ── TEKST NA MARKERU (`--color-mark`) ─────────────────────────────────────
  //
  // ⚠️ OVAJ TOKEN NIJE BIO MJEREN NI U JEDNOJ TEMI DO 2026-08-16, a nosi
  // isticanje u HEROJU — prvu stvar koju posjetitelj pročita. Ispao je kroz
  // rupu koju je `sweep()` izrijekom priznavao: `if (!fg) continue` preskače
  // svaki token s alfom, i u komentaru navodi baš `--color-mark` kao primjer.
  // U `chalk` i `mint` marker JEST alfa (`rgb(… / .30)`), pa je bio preskočen;
  // u `academic` i `paper` je neproziran, ali nije stajao ni na jednom popisu.
  //
  // Peti put isti obrazac: GATE KOJI MJERI NEKE TOKENE STVARA TIHU PRETPOSTAVKU
  // DA MJERI SVE. Zato se alfa ovdje ne preskače nego SLAŽE preko plohe teme —
  // kompozicija je jednoznačna, a piksel koji korisnik vidi je upravo ona.
  //
  // Mjeri se protiv `--color-ink-0` jer `.hero-mark` baš to i radi: tekst boje
  // ink-0 preko donjih 58 % markera.
  const mark = parseColor(t['--color-mark']);
  const ink0 = parseHex(t['--color-ink-0']);
  const surf0 = parseHex(t['--color-surface-0']);
  if (mark && ink0 && surf0) {
    checks++;
    const slozen = mark.a >= 1 ? mark.rgb : mark.rgb.map((v, i) => Math.round(mark.a * v + (1 - mark.a) * surf0[i]));
    const r = ratio(slozen, ink0);
    if (r < TEXT_MIN) {
      problems.push(`--color-ink-0 na --color-mark: ${r.toFixed(2)} < ${TEXT_MIN}  (tekst na markeru` +
        (mark.a < 1 ? `, alfa ${mark.a} složena preko --color-surface-0` : '') + ')');
    }
  }

  // tekst na ispuni marke
  const brand = parseHex(t['--color-brand-500']);
  const onBrand = parseHex(t['--color-on-brand']);
  if (brand && onBrand) {
    checks++;
    const r = ratio(brand, onBrand);
    if (r < TEXT_MIN) problems.push(`--color-on-brand na --color-brand-500: ${r.toFixed(2)} < ${TEXT_MIN}  (tekst na gumbu)`);
  }

  // „točno" se ne smije stopiti s markom
  const ok = parseHex(t['--color-ok']);
  if (brand && ok) {
    checks++;
    const g = hueGap(ok, brand);
    if (g < HUE_MIN) problems.push(`--color-ok je ${g}° od --color-brand-500 (< ${HUE_MIN}°): „točno" se stapa s bojom akcije`);
  }

  if (problems.length) {
    fails += problems.length;
    console.log(`❌ ${name}`);
    problems.forEach((p) => console.log(`      ${p}`));
  } else {
    console.log(`   ${name.padEnd(12)} ✅`);
  }
}

// ── GLIF NA PLOČICI PREDMETA ────────────────────────────────────────────────────
//
// Ovo je JEDINA provjera u datoteci koja NIJE po temama, i to je namjerno: pločica
// predmeta nosi boju iz `data/catalog.js`, koja se s temom ne mijenja, pa se ni tinta
// na njoj ne smije mijenjati (v. `--color-on-tint-*` u tokens.css).
//
// Povod: glif je do 2026-08-15 nosio `--color-on-brand` — token izračunat za boju MARKE.
// Nijedan gate ga nikad nije usporedio s 11 boja predmeta, a bijela na `#f59e0b` daje
// **2.15**; tu boju nosi 5 predmeta. 10 od 24 predmeta bilo je ispod praga u ZADANOJ temi.
// Pouka je ista kao kod tvrde zabrane #2: gate koji provjerava NEKE tokene stvara tihu
// pretpostavku da su provjereni SVI.
{
  const catalogPath = path.resolve(__dirname, '..', 'data', 'catalog.js');
  const w = {};
  new Function('window', fs.readFileSync(catalogPath, 'utf8'))(w);
  const subjects = ((w.SOKRAT_CATALOG || {}).subjects) || [];

  const dark = parseHex(base['--color-on-tint-dark']);
  const light = parseHex(base['--color-on-tint-light']);
  const problems = [];

  if (!dark || !light) {
    problems.push('--color-on-tint-dark/-light nedostaju u @theme static — pločice predmeta nemaju definiranu tintu');
  } else {
    // (a) SJECIŠTE mora pratiti tokene. `inkForTint()` (od MREŽA C2; od učitavanja po ruti
    //     stanuje u js/utils.js — jedini fajl koji dijele index.html i editor.html, jer tintu
    //     traže i landing i study-kartice i editorov pretpregled) bira tintu po pragu
    //     luminancije; taj prag je funkcija ove dvije vrijednosti i mora se PRERAČUNATI,
    //     ne prepisati. Prva verzija praga bila je napisana napamet i promašena za 0.013.
    //     Gate ga izvodi iz same definicije kontrasta i traži da se poklopi s kodom.
    const krizanje = Math.sqrt((lum(dark) + 0.05) * (lum(light) + 0.05)) - 0.05;
    const IZVOR_TINTE = 'js/utils.js';
    const nav = fs.readFileSync(path.resolve(__dirname, '..', IZVOR_TINTE), 'utf8');
    const m = nav.match(/const TINT_INK_CROSSOVER\s*=\s*([0-9.]+)\s*;/);
    checks++;
    if (!m) {
      problems.push(IZVOR_TINTE + ' nema TINT_INK_CROSSOVER — tinta pločice se bira nepoznatim pragom');
    } else if (Math.abs(parseFloat(m[1]) - krizanje) > 0.0005) {
      problems.push(`TINT_INK_CROSSOVER je ${m[1]}, a iz tokena izlazi ${krizanje.toFixed(4)} — postavi ${krizanje.toFixed(4)} u ${IZVOR_TINTE}`);
    }

    // (b) Za svaku boju predmeta: tinta koju kod STVARNO odabere mora prelaziti 3:1.
    //     Nije „najbolja od dvije" (to gotovo nikad ne padne s crno-bijelim parom), nego
    //     baš odabrana — inače gate potvrđuje da čitljiv izbor postoji, ne da je napravljen.
    const prag = m ? parseFloat(m[1]) : krizanje;
    const seen = new Set();
    for (const s of subjects) {
      const boja = (Array.isArray(s.iconGradient) && s.iconGradient[0]) || s.color;
      const rgb = parseHex(boja);
      if (!rgb || seen.has(boja)) continue;
      seen.add(boja);
      checks++;
      const odabrana = lum(rgb) > prag ? dark : light;
      const r = ratio(rgb, odabrana);
      if (r < UI_MIN) {
        const ime = lum(rgb) > prag ? 'on-tint-dark' : 'on-tint-light';
        problems.push(`boja predmeta ${boja} (npr. ${s.id}): odabrana tinta ${ime} daje ${r.toFixed(2)} < ${UI_MIN} — boju predmeta treba preugoditi`);
      }
    }

    // (c) NIJEDNA boja predmeta ne smije nositi INDIGO ZNAKA.
    //
    //     Spec §7.13: znak zadržava vlastiti indigo kroz sve četiri teme — „znak definira
    //     boju marke, ne obrnuto". Ta konstanta vrijedi samo ako je znak JEDINA stvar te
    //     boje; do 2026-08-16 nosila su je i ČETIRI predmeta (te2, te2-hr, management,
    //     management-hr), pa marka nije bila konstanta nego jedna od boja u mreži.
    //
    //     ⚠️ Zašto od ZNAKA, a ne od `--color-brand-500`: marka se PO TEMI mijenja
    //     (academic #1657d0 plava · chalk #f2c14e zlatna), pa bi fiksna boja predmeta
    //     bila odvojena u jednoj temi i sudarala se u drugoj. Znak je jedina nepomična
    //     meta. Zato se indigo ČITA IZ `assets/logo.svg` — ne prepisuje se ovamo, da
    //     pravilo prati znak ako se ikad promijeni (ADR-027: jedna činjenica, jedno mjesto).
    //
    //     ⚠️ Odvojenost se NE traži međusobno između predmeta: zatečena paleta ima
    //     `#059669` (161°) i `#14b8a6` (173°) na 12° razmaka, pa bi takvo pravilo bilo
    //     crveno od prvog dana. Brana koju zatečeno stanje ne može proći nije brana.
    const logoPath = path.resolve(__dirname, '..', 'assets', 'logo.svg');
    const logoHexes = [...new Set((fs.readFileSync(logoPath, 'utf8').match(/#[0-9a-fA-F]{6}/g) || []))]
      .map((h) => h.toLowerCase())
      .filter((h) => { const p = parseHex(h); return p && lum(p) > 0.02 && lum(p) < 0.6; }); // bijelo/crno iz znaka nisu marka

    checks++;
    if (!logoHexes.length) {
      problems.push('assets/logo.svg nema nijednu boju marke — pravilo o odvojenosti od znaka ne može se provjeriti');
    } else {
      const znakHue = hue(parseHex(logoHexes[0]));
      for (const boja of seen) {
        const rgb = parseHex(boja);
        if (!rgb) continue;
        checks++;
        const d = hueGap(rgb, parseHex(logoHexes[0]));
        if (d < HUE_MIN) {
          const ids = subjects
            .filter((s) => ((Array.isArray(s.iconGradient) && s.iconGradient[0]) || s.color) === boja)
            .map((s) => s.id);
          problems.push(
            `boja predmeta ${boja} je ${d.toFixed(0)}° od indiga ZNAKA (${logoHexes[0]}, ${znakHue.toFixed(0)}°) — traži se ≥ ${HUE_MIN}°. ` +
            `Nosi je: ${ids.join(', ')}. Znak mora ostati jedina stvar te boje.`
          );
        }
      }
    }
  }

  if (problems.length) {
    fails += problems.length;
    console.log('❌ glif na pločici predmeta');
    problems.forEach((p) => console.log(`      ${p}`));
  } else {
    console.log(`   ${'pločice predmeta'.padEnd(12)} ✅  (${seenCount(subjects)} boja, tinta se bira izračunom)`);
  }
}

function seenCount(subjects) {
  return new Set(subjects.map((s) => (Array.isArray(s.iconGradient) && s.iconGradient[0]) || s.color).filter(Boolean)).size;
}

console.log(`\n   ${Object.keys(themes).length} tema · ${checks} provjera`);
if (fails) {
  console.log(`\n❌ ${fails} pada. Popravi vrijednost u css/tokens.css — ne prag ovdje.\n`);
  process.exit(1);
}
console.log('\n✅ sve teme prolaze AA na sve tri plohe.\n');
