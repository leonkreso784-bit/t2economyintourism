#!/usr/bin/env node
'use strict';
/**
 * check:budget (T6) — KOLIKO KODA DOBIJE POSJETITELJ KOJI SAMO OTVORI STRANICU.
 *
 * ⚠️ POVOD: budžet „JS ≤ ~200 KB" projekt si je zadao još u F1 i označio ga 🔥 *„Blokada, ne
 * upozorenje"* — pa **nikad nije postojao kao gate**. U međuvremenu je narastao na 755 KiB u
 * 41 skripti, i to bez ijedne namjerne odluke: svaka je cigla dodala „samo još jednu skriptu".
 * *Stavka bez gatea ne stoji na mjestu nego klizi.*
 *
 * ⚠️ MJERI SE ONO ŠTO PUTUJE MREŽOM, NE ONO ŠTO LEŽI NA DISKU. Ovo je ispravak mjere, ne
 * popuštanje: zapisano „3,7× preko budžeta" računato je na sirovim bajtovima, a budžet dolazi
 * iz Lighthousea, koji mjeri PRENESENE bajtove — dakle komprimirane. U ispravnoj jedinici je
 * stanje prije T6 bilo 234 KiB (1,17×), a ne 3,7×. Brojka može biti točna i svejedno savjetovati
 * krivo ako je u krivoj jedinici (isti razred kao `palette:breakdown`). Sirovo se i dalje
 * ISPISUJE, jer ono mjeri koliko preglednik mora parsirati — samo ne odlučuje.
 *
 * DVIJE PROVJERE:
 *   ① nijedna EDITORSKA datoteka nije na posjetiteljevu putu (`index.html`);
 *   ② ukupni prijenos skripti ≤ BUDŽET.
 *
 * ⚠️ Zašto ① postoji uz ②: budžet je brojka i može se ispuniti na krivi način (npr. minifikacijom
 * editora). Cigla T6 nije bila „smanji bajtove" nego „alat koji posjetitelj nikad ne otvori ne
 * smije mu ni stići" — a to je tvrdnja o SASTAVU, ne o veličini.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const BUDZET_KB = 200;

/** Datoteke koje postoje isključivo radi AUTORSTVA. Njihovo mjesto je `editor.html`. */
const EDITORSKE = [
  'js/studio.js',
  'js/block-editor.js',
  'js/block-editor-media.js',
  'js/admin.js',
  'js/admin-editors.js',
  'js/draft-store.js',
  'js/card-limits.js'
];

/**
 * ⚠️ `js/node-images.js` NIJE na popisu, i to je mjereno, ne propušteno: traži ga
 * `js/blocks-renderer.js` (potpisani URL-ovi slika u vlastitom materijalu), dakle STUDENTOV
 * put učenja. „Sedam editorskih datoteka" bila je pretpostavka; mjera je rekla šest plus jedna
 * koja ostaje. Isto vrijedi za `js/admin-reveal.js` — ondje živi „jesi li ti admin", a to
 * aplikacija treba i kad editora nema (otkrivanje kartice u profilu).
 */

function skripte(stranica) {
  const html = fs.readFileSync(path.join(ROOT, stranica), 'utf8');
  const out = [];
  const re = /<script[^>]*\ssrc="((?:js|data)\/[^"?]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return [...new Set(out)];
}

/**
 * Paketi iz `js/loader.js` — skripte koje se od učitavanja po ruti NE nalaze u markupu.
 *
 * ⚠️ ZAŠTO OVO MORA BITI OVDJE: bez toga bi cigla „učitavanje po ruti" tiho OBORILA ovu branu
 * s 234 KiB na stotinjak — i to bez ijednog obrisanog retka koda. Brojka bi pala, a tvrdnja
 * („koliko koda dobije posjetitelj") ostala bi točna samo za prvi kadar. Zato mjerimo OBOJE:
 * budžet i dalje sudi PRVOM KADRU (to je ono što posjetitelja košta), a paketi se ispisuju i
 * zbrajaju da rast ne postane nevidljiv seljenjem u lijeni put. Provjera SASTAVA (editorski
 * kod) gleda i jedno i drugo — editor u paketu je jednako pogrešan kao editor u markupu.
 *
 * Datoteka se čita u pješčaniku (`new Function`), ne regexom: manifest je JS i takav treba i
 * ostati; regex nad njim bi ostario prvom promjenom oblika.
 */
function paketi() {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'loader.js'), 'utf8');
  const win = {};
  new Function('window', src)(win);        // `document` je undefined → token ostaje prazan, to je sve
  const P = (win.SokratLoad || {}).PAKETI || {};
  const out = {};
  for (const ime of Object.keys(P)) {
    out[ime] = P[ime].filter((s) => typeof s === 'string');   // vanjski (CDN) su na `check:cdn`
  }
  return out;
}

function mjeri(popis) {
  let sirovo = 0;
  let mrezom = 0;
  for (const f of popis) {
    const buf = fs.readFileSync(path.join(ROOT, f));
    sirovo += buf.length;
    mrezom += zlib.gzipSync(buf, { level: 9 }).length;
  }
  return { sirovo, mrezom, koliko: popis.length };
}

const kb = (n) => (n / 1024).toFixed(1) + ' KiB';

console.log('=== check:budget — posjetiteljev put ===\n');

const posjetitelj = skripte('index.html');
const m = mjeri(posjetitelj);
const PAKETI = paketi();
const lijeno = [...new Set(Object.values(PAKETI).flat())];

let pao = false;

// ① SASTAV — i markup i paketi (v. komentar uz `paketi()`)
const uljezi = [...posjetitelj, ...lijeno].filter((f) => EDITORSKE.includes(f));
if (uljezi.length) {
  pao = true;
  console.error('❌ EDITORSKI KOD JE NA POSJETITELJEVU PUTU (' + uljezi.length + '):');
  uljezi.forEach((f) => console.error('   • ' + f));
  console.error('\n   Editor od cigle T6 živi na `editor.html`. Ako mu nešto treba u aplikaciji,');
  console.error('   rez ide KROZ datoteku (kao `admin.js` → `admin-reveal.js`), ne vraćanjem cijele.\n');
} else {
  console.log('✅ sastav: nijedna editorska datoteka nije na posjetiteljevu putu.');
}

// ② TEŽINA — sudi PRVOM KADRU
const prekoracenje = m.mrezom - BUDZET_KB * 1024;
console.log('   PRVI KADAR: ' + m.koliko + ' skripti  ·  sirovo ' + kb(m.sirovo) + '  ·  mrežom (gzip) '
  + kb(m.mrezom) + '  ·  budžet ' + BUDZET_KB + ' KB');

if (prekoracenje > 0) {
  pao = true;
  console.error('\n❌ PREKO BUDŽETA za ' + kb(prekoracenje) + '.');
  console.error('   Budžet mjeri PRENESENE bajtove (kao Lighthouse), ne veličinu na disku.');
} else {
  console.log('   zaliha do budžeta: ' + kb(-prekoracenje));
}

// ③ LIJENI PUT — nije pod budžetom (plaća ga tko otvori lekciju), ali se MORA vidjeti.
if (lijeno.length) {
  const l = mjeri(lijeno);
  console.log('\n   PO RUTI (js/loader.js): ' + l.koliko + ' skripti · ' + kb(l.sirovo) + ' sirovo · '
    + kb(l.mrezom) + ' mrežom  →  UKUPNO aplikacija ' + kb(m.mrezom + l.mrezom));
  for (const ime of Object.keys(PAKETI)) {
    const p = mjeri(PAKETI[ime]);
    console.log('     • ' + ime.padEnd(11) + p.koliko + ' skripti · ' + kb(p.mrezom) + ' mrežom');
  }
}

// Za usporedbu (nije gate — stranica editora smije biti teška, plaća ju tko u nju uđe).
if (fs.existsSync(path.join(ROOT, 'editor.html'))) {
  const e = mjeri(skripte('editor.html'));
  console.log('\n   (stranica editora: ' + e.koliko + ' skripti · ' + kb(e.sirovo) + ' sirovo · '
    + kb(e.mrezom) + ' mrežom — NIJE pod budžetom, plaća ju tko u nju uđe)');
}

process.exit(pao ? 1 : 0);
