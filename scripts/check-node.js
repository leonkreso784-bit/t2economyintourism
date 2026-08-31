#!/usr/bin/env node
'use strict';
/**
 * check:node (MREŽA A2) — STROJ NA KOJEM SE PIŠE KÔD MORA BITI ONAJ KOJI PRESUĐUJE.
 *
 * ⚠️ POVOD (revizija 2026-08-31): razvojni stroj je vrtio **Node 24.11.1**, a `.nvmrc` i sva
 * tri CI joba **Node 22**. Nijedna brana to nije gledala, pa je drift stajao neopaženo —
 * zeleno lokalno nije značilo zeleno u CI-ju, i obrnuto, a razlika se ne bi pokazala kao
 * greška nego kao *„kod mene radi"*.
 *
 * ⚠️ ZAŠTO BRANA, A NE SAMO JEDNOKRATNO PREBACIVANJE: bez nje se drift vrati prvom idućom
 * instalacijom Nodea — a nitko ga neće primijetiti, jer se ništa ne sruši odmah. Pravilo #9
 * postoji baš zato da razrješenje ne varira ispod nas; stroj je bio jedina karika koju to
 * pravilo nije pokrivalo.
 *
 * ČETIRI IZVORA MORAJU DATI ISTI MAJOR:
 *   ① `.nvmrc`                          — što razvojni stroj TREBA vrtjeti
 *   ② `package.json` → `engines.node`   — što projekt TVRDI da traži
 *   ③ `node-version:` u `.github/workflows/**` — što CI STVARNO vrti
 *   ④ `process.versions.node`           — što ovaj proces UPRAVO vrti
 *
 * ⚠️ ZAŠTO SVA ČETIRI, A NE SAMO ① vs ④: brana koja gleda samo stroj i `.nvmrc` propušta
 * slučaj u kojem CI odluta od `.nvmrc`-a — a tada je „usklađen stroj" lažna utjeha, jer
 * presuđuje CI. Isto vrijedi za `engines`: raspon poput `>=22` je istinit i na Node 24, pa
 * TVRDNJA prolazi dok STANJE ne valja. Zato se traži zakucan major, ne raspon.
 *
 * PADA ZATVORENO: nedostaje li ijedan izvor, brana pada — ne pretpostavlja se vrijednost.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const problemi = [];
const nalazi = [];

/** Izvuče prvi cijeli broj iz teksta (npr. "22", "v22.11.0", ">=22 <23", "22.x"). */
function major(txt) {
  const m = String(txt).match(/\d+/);
  return m ? m[0] : null;
}

// ── ① .nvmrc ────────────────────────────────────────────────────────────────────────────
const nvmrcPath = path.join(ROOT, '.nvmrc');
let nvmrc = null;
if (!fs.existsSync(nvmrcPath)) {
  problemi.push('.nvmrc ne postoji — stroj nema zapisan referentni major');
} else {
  nvmrc = major(fs.readFileSync(nvmrcPath, 'utf8').trim());
  if (!nvmrc) problemi.push('.nvmrc ne sadrži broj verzije');
  else nalazi.push(['.nvmrc', nvmrc, fs.readFileSync(nvmrcPath, 'utf8').trim()]);
}

// ── ② package.json → engines.node ───────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const enginesRaw = pkg.engines && pkg.engines.node;
let engines = null;
if (!enginesRaw) {
  problemi.push('package.json nema `engines.node` — projekt ne tvrdi ništa o Node verziji');
} else {
  engines = major(enginesRaw);
  nalazi.push(['engines.node', engines, enginesRaw]);
  // Raspon je istinit na više majora → tvrdnja prolazi dok stanje ne valja.
  if (/^[><~^]|\|\||\s-\s/.test(enginesRaw.trim())) {
    problemi.push(
      '`engines.node` je RASPON (' + enginesRaw + ') — mora zakucati major, npr. "' + (nvmrc || '22') + '.x"\n' +
      '      raspon je istinit i na krivoj verziji, pa tvrdnja prolazi dok stanje ne valja'
    );
  }
}

// ── ③ CI workflowi ──────────────────────────────────────────────────────────────────────
const wfDir = path.join(ROOT, '.github', 'workflows');
const ciVerzije = [];
if (!fs.existsSync(wfDir)) {
  problemi.push('.github/workflows/ ne postoji — ne mogu provjeriti što CI vrti');
} else {
  for (const f of fs.readdirSync(wfDir).filter((x) => /\.ya?ml$/.test(x))) {
    const txt = fs.readFileSync(path.join(wfDir, f), 'utf8');
    const re = /node-version:\s*['"]?([^'"\s#]+)/g;
    let m;
    while ((m = re.exec(txt))) {
      const linija = txt.slice(0, m.index).split('\n').length;
      ciVerzije.push({ f, linija, raw: m[1], major: major(m[1]) });
    }
  }
  if (!ciVerzije.length) problemi.push('nijedan workflow ne postavlja `node-version:` — CI vrti neodređeno');
  for (const c of ciVerzije) nalazi.push(['CI ' + c.f + ':' + c.linija, c.major, c.raw]);
}

// ── ④ proces koji upravo vrti ───────────────────────────────────────────────────────────
const tekuci = major(process.versions.node);
nalazi.push(['proces (ovaj node)', tekuci, 'v' + process.versions.node]);

// ── usporedba ───────────────────────────────────────────────────────────────────────────
const majori = [...new Set(nalazi.map((n) => n[1]).filter(Boolean))];
if (majori.length > 1) {
  problemi.push(
    'ČETIRI IZVORA NE DAJU ISTI MAJOR — nađeni: ' + majori.sort().join(' vs ') + '\n' +
    '      → uskladi ih SVE na jedan broj; koji broj pobjeđuje je odluka, ali razilaženje nije'
  );
}

// ── ispis ───────────────────────────────────────────────────────────────────────────────
console.log('\n=== check:node — stroj, projekt i CI vrte isti Node ===\n');
const sirina = Math.max(...nalazi.map((n) => n[0].length));
// Kod razilaženja se označava ono što ODUDARA od većine — a ne, kao u prvoj izvedbi,
// svih pet ispravnih dok šesti prolazi neoznačen. Većina nije presuda o tome tko je u
// pravu (to je odluka), nego samo način da oko odmah nađe iznimku.
const broj = {};
for (const [, maj] of nalazi) if (maj) broj[maj] = (broj[maj] || 0) + 1;
const vecina = Object.keys(broj).sort((a, b) => broj[b] - broj[a])[0];
for (const [ime, maj, raw] of nalazi) {
  const znak = majori.length === 1 ? '✅' : maj === vecina ? '  ' : '⚠️ ';
  console.log('   ' + znak + ' ' +
    ime.padEnd(sirina) + '  major ' + String(maj).padEnd(4) + '  (' + raw + ')');
}
console.log('\n   dotaknuto izvora: ' + nalazi.length +
  '  (.nvmrc 1 · engines 1 · CI ' + ciVerzije.length + ' · proces 1)');

if (problemi.length) {
  console.log('\n   ❌ ' + problemi.length + ' problem(a):\n');
  for (const p of problemi) console.log('      · ' + p);
  console.log('\n   POPRAVAK NA STROJU:  nvm install ' + (nvmrc || '22') + ' && nvm use ' + (nvmrc || '22'));
  console.log('   (Windows bez nvm-a: instaler s nodejs.org za taj major.)\n');
  process.exit(1);
}
console.log('\n✅ svi izvori vrte Node ' + majori[0] + '\n');
