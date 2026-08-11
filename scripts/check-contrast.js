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
                 '--color-ok', '--color-warn-ink', '--color-danger-ink'];
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

console.log(`\n   ${Object.keys(themes).length} tema · ${checks} provjera`);
if (fails) {
  console.log(`\n❌ ${fails} pada. Popravi vrijednost u css/tokens.css — ne prag ovdje.\n`);
  process.exit(1);
}
console.log('\n✅ sve teme prolaze AA na sve tri plohe.\n');
