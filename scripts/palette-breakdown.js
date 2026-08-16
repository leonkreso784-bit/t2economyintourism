#!/usr/bin/env node
/**
 * palette-breakdown — RAZLOŽI ostatak stare palete po POSLJEDICI, ne po uzorku.
 *
 * ── ZAŠTO OVO POSTOJI ────────────────────────────────────────────────────────
 * `check:palette` je čegrtaljka: broji koliko je zakucanih boja ostalo i pazi da broj
 * ne poraste. To je dobar gate, ali je **loš savjetnik**, i to nas je koštalo cigle.
 *
 * Spec je (do 2026-08-13) tvrdio da svijetla tema čeka `check:palette` = 0, dakle
 * cijeli C3–C7. Ispalo je da je ta jedna brojka **tri različita duga zbrojena u jedan**,
 * i da samo jedan blokira svijetlu podlogu:
 *
 *   A) FATALNO — zakucana boja TEKSTA (`color: #fff` / `white`). Na papiru NEVIDLJIV.
 *   B) BLAGO    — poluprozirna bijela/crna kao PLOHA ili RUB. Blijedo, ali ispravno.
 *   C) STARA PALETA — indigo/slate hex. Neusklađeno, ali čitljivo.
 *
 * Mjereno na C2: 46 / 54 / 125. Prepreka je bila **46 pravila u 15 datoteka**, ne pet
 * cigli — dakle posao od jednog popodneva, a izgledalo je kao kraj faze.
 *
 * **Pouka koju ova skripta utjelovljuje: agregatna brojka može mjeriti točno, a
 * savjetovati krivo.** Prije nego neki broj proglasiš preprekom, razloži ga po tome
 * ŠTO SE ZAPRAVO DOGODI korisniku.
 *
 * ── UPOTREBA ─────────────────────────────────────────────────────────────────
 *   npm run palette:breakdown            → zbirna tablica po datoteci
 *   npm run palette:breakdown -- --list  → SVAKO fatalno pravilo, sa selektorom i pozadinom
 *
 * Read-only. NIJE gate i NIJE u preflightu — ovo je dijagnostika za C3–C7.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSS = path.join(ROOT, 'css');
const LIST = process.argv.includes('--list');

/* `color:` ali NE `background-color:` / `border-color:` → negativan lookbehind.
   Bez njega bi svaka ispuna ispala „fatalna" i brojka bi opet lagala, samo u drugu stranu. */
const TEKST = /(?<![-\w])color:\s*(?:#fff\b|#ffffff\b|white\b|#000\b|#000000\b|black\b|rgba?\(\s*255\s*,\s*255\s*,\s*255[^)]*\)|rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\))/i;
const PLOHA = /(background|border|box-shadow|outline|fill|stroke)[^;]*(#fff\b|#ffffff\b|\bwhite\b|#000\b|#000000\b|\bblack\b|rgba?\(\s*255\s*,\s*255\s*,\s*255|rgba?\(\s*0\s*,\s*0\s*,\s*0)/i;
const STARA = /#6366f1|#818cf8|#0f172a|#1e293b|#334155|#475569|#64748b|#94a3b8|rgba?\(\s*99\s*,\s*102\s*,\s*241/i;

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

const rez = {};
const fatalna = [];
let fatal = 0, blago = 0, stara = 0;

function walk(d) {
  for (const e of fs.readdirSync(d).sort()) {
    const f = path.join(d, e);
    if (fs.statSync(f).isDirectory()) { walk(f); continue; }
    if (!f.endsWith('.css')) continue;

    const rel = path.relative(CSS, f).replace(/\\/g, '/');
    const css = stripComments(fs.readFileSync(f, 'utf8'));
    rez[rel] = { fatal: 0, blago: 0, stara: 0 };

    const re = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = re.exec(css)) !== null) {
      const sel = m[1].trim();
      const tijelo = m[2];
      if (sel.startsWith('@')) continue;

      if (TEKST.test(tijelo)) {
        rez[rel].fatal++; fatal++;
        const decl = (tijelo.match(TEKST) || [''])[0].replace(/\s+/g, ' ');
        const bg = (tijelo.match(/background[^;]*/i) || [''])[0].replace(/\s+/g, ' ').slice(0, 46);
        fatalna.push({ rel, sel: sel.replace(/\s+/g, ' '), decl, bg });
      }
      if (PLOHA.test(tijelo)) { rez[rel].blago++; blago++; }
      if (STARA.test(tijelo)) { rez[rel].stara++; stara++; }
    }
  }
}

walk(CSS);

if (LIST) {
  console.log('\n=== FATALNA pravila (zakucan tekst → nevidljiv na svijetloj podlozi) ===\n');
  console.log('  #  datoteka                   selektor                              tekst              pozadina');
  console.log('  ' + '─'.repeat(124));
  fatalna.forEach((r, i) => {
    console.log(
      String(i + 1).padStart(3) + '  ' +
      r.rel.padEnd(27) + r.sel.slice(0, 36).padEnd(38) +
      r.decl.padEnd(19) + (r.bg || '—')
    );
  });
  console.log('\n   ukupno: ' + fatalna.length + '\n');
} else {
  const redci = Object.entries(rez)
    .filter(([, v]) => v.fatal || v.blago || v.stara)
    .sort((a, b) => b[1].fatal - a[1].fatal || b[1].stara - a[1].stara);

  console.log('\n=== palette-breakdown — ostatak razložen po POSLJEDICI ===\n');
  console.log('   datoteka                                FATALNO  blago  stara');
  console.log('   ' + '─'.repeat(64));
  for (const [f, v] of redci) {
    console.log('   ' + f.padEnd(38) + String(v.fatal).padStart(7) + String(v.blago).padStart(7) + String(v.stara).padStart(7));
  }
  console.log('   ' + '─'.repeat(64));
  console.log('   ' + 'UKUPNO'.padEnd(38) + String(fatal).padStart(7) + String(blago).padStart(7) + String(stara).padStart(7));
  console.log('\n   FATALNO = tekst koji na svijetloj podlozi postaje NEVIDLJIV.');
  console.log('             Jedini broj koji stvarno blokira svijetlu temu.');
  console.log('   blago   = plohe i rubovi (rgba bijela/crna) — blijedo, ali ispravno.');
  console.log('   stara   = indigo/slate — neusklađeno, ali čitljivo.');
  console.log('\n   Popis pojedinačnih fatalnih pravila: npm run palette:breakdown -- --list\n');
}
