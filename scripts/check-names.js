#!/usr/bin/env node
/**
 * check:names — imena stvarnih osoba se ne vraćaju u repozitorij.
 *
 * ── POVOD ──────────────────────────────────────────────────────────────────────
 * 29.09.2026. su iz sadržaja, kataloga, komentara i docs-a maknuta imena FMTU nastavnika
 * i privatnih osoba (Leonova odluka, anketa 28./29.09.) — zamijenjena ULOGOM („nositelj
 * kolegija", „content-suradnik"). Jednokratni čistač ne štiti od sutrašnjeg graditelja koji
 * ime prepiše iz izvora u zaglavlje ili u opis predmeta: tako su i ušla.
 *
 * ── ZAŠTO JE POPIS IZVAN GITA ──────────────────────────────────────────────────
 * Popis imena u repou bio bi upravo ono što brana brani. Zato živi u `.imena-zabrana.txt`
 * (gitignored, kao `.env`), a brana ga samo čita.
 *   • nema datoteke LOKALNO → PAD (zatvoreno): brana koja tiho ne mjeri gora je od nikakve.
 *   • nema datoteke u CI-ju → „NIJE MJERENO" + izlaz 0. CI ne vrti preflight, ali ako ikad
 *     počne, ne smije pasti na tajni koju nema. Push na `main` svejedno ide kroz pre-push
 *     kuku → lokalni preflight → ova brana.
 *   • prazan popis → PAD: nula imena = nula mjerenja, ne „čisto".
 *
 * ── FORMAT POPISA ──────────────────────────────────────────────────────────────
 * Jedna stavka po retku; `#` = komentar. Stavka je DOSLOVAN niz, poklapa se samo kao
 * cijela riječ (Unicode granice — `\b` u JS-u ne zna za č/ć/š/ž). Zvjezdica na kraju
 * (`Saš*`) = prefiks, za padeže i posvojne oblike. Ime koje je i dio dopuštenog citata
 * (npr. prezime autora objavljenog članka) upiši S KONTEKSTOM („prof. Bogdan", „(Bogdan)").
 *
 * Mjerač ispisuje koliko je imena i datoteka dotaknuo — pouka iz redizajna: mjerač koji to
 * ne ispiše zna vratiti uvjerljivu nulu. Read-only, bez mreže → `npm run preflight`.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const KORIJEN = path.join(__dirname, '..');
const POPIS = process.env.IMENA_ZABRANA || path.join(KORIJEN, '.imena-zabrana.txt');

/** Binarno i generirano iz tuđeg (lock) — nema smisla čitati kao tekst. */
const PRESKOCI = /\.(png|jpe?g|gif|webp|ico|pdf|xlsx|docx|woff2?|ttf|otf|mp4|zip|gz)$|(^|\/)package-lock\.json$/i;

/** @param {string} tekst @returns {string[]} */
function parsirajPopis(tekst) {
  return tekst.split(/\r?\n/).map((r) => r.replace(/#.*$/, '').trim()).filter(Boolean);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SLOVO = '\\p{L}\\p{N}_';

/** Stavka → regex. Granica se traži samo uz rub koji je slovo (`(Bogdan)` nema slovo na rubu). */
function uRegex(stavka) {
  const prefiks = stavka.endsWith('*');
  const s = prefiks ? stavka.slice(0, -1) : stavka;
  const lijevo = /^[\p{L}\p{N}_]/u.test(s) ? `(?<![${SLOVO}])` : '';
  const desno = prefiks ? '' : (/[\p{L}\p{N}_]$/u.test(s) ? `(?![${SLOVO}])` : '');
  return new RegExp(lijevo + esc(s) + desno, 'gu');
}

/**
 * @param {string[]} stavke
 * @param {{put:string, tekst:string}[]} datoteke
 * @returns {{put:string, redak:number, stavka:string}[]}
 */
function nadji(stavke, datoteke) {
  const re = stavke.map((s) => [s, uRegex(s)]);
  const nalazi = [];
  for (const { put, tekst } of datoteke) {
    const retci = tekst.split('\n');
    retci.forEach((r, i) => {
      for (const [s, rx] of re) { rx.lastIndex = 0; if (rx.test(r)) nalazi.push({ put, redak: i + 1, stavka: s }); }
    });
  }
  return nalazi;
}

function main() {
  if (!fs.existsSync(POPIS)) {
    if (process.env.CI) { console.log('check:names — NIJE MJERENO (CI nema popis imena; mjeri pre-push kuka lokalno)'); return 0; }
    console.error(`❌ check:names — nema popisa ${path.relative(KORIJEN, POPIS)} (gitignored, izvan gita).`);
    console.error('   Kopiraj ga iz drugog radnog stabla; bez njega brana ne mjeri ništa.');
    return 1;
  }
  const stavke = parsirajPopis(fs.readFileSync(POPIS, 'utf8'));
  if (!stavke.length) { console.error('❌ check:names — popis je prazan: nula imena = nula mjerenja.'); return 1; }

  const putevi = execFileSync('git', ['ls-files', '-z'], { cwd: KORIJEN, encoding: 'utf8' })
    .split('\0').filter((p) => p && !PRESKOCI.test(p) && fs.existsSync(path.join(KORIJEN, p)));
  const datoteke = putevi.map((put) => ({ put, tekst: fs.readFileSync(path.join(KORIJEN, put), 'utf8') }));
  const nalazi = nadji(stavke, datoteke);

  console.log(`check:names — imena: ${stavke.length} · pregledano datoteka: ${datoteke.length} · nalaza: ${nalazi.length}`);
  if (!datoteke.length) { console.error('❌ nula datoteka pregledano — mjerač nije ništa dotaknuo.'); return 1; }
  if (nalazi.length) {
    for (const n of nalazi) console.error(`  ❌ ${n.put}:${n.redak}  «${n.stavka}»`);
    console.error('\nZamijeni ULOGOM („nositelj kolegija", „prema predavanjima", „content-suradnik"), ne rupom.');
    return 1;
  }
  console.log('✅ nijedno ime s popisa u praćenim datotekama');
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { parsirajPopis, uRegex, nadji };
