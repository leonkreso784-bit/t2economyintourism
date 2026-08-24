#!/usr/bin/env node
/**
 * build-og-image — kartica koja se vidi kad netko podijeli link (2026-08-24)
 *
 * ── ZAŠTO OVO POSTOJI ────────────────────────────────────────────────────────────
 * `og:image` je do danas pokazivao **`icon-512.png` — kvadratnu aplikacijsku ikonu**,
 * dok Facebook, WhatsApp, LinkedIn i Slack traže **1200 × 630**. Posljedica se vidjela
 * na svakom podijeljenom linku: umjesto kartice, sitni kvadratić s logom. To je
 * najjeftinija vidljiva pobjeda u cijelom SEO popisu i jedina koja ne ovisi o Googleu.
 *
 * ── ZAŠTO GENERATOR, A NE SLIKA U REPOZITORIJU ───────────────────────────────────
 * Ručno nacrtana kartica je **četvrta kopija palete i pete mjesto s tekstom** — i
 * razišla bi se prvi put kad se promijeni tema ili poruka. Ovdje se oboje **čita iz
 * izvora**: boje iz `css/tokens.static.css` (isti izvadak koji koriste pravne
 * stranice), tekst iz `js/i18n.js` (`about.title` / `about.tagline`). Promijeni tekst
 * na jednom mjestu i kartica ga pokupi.
 *
 * ⚠️ **PNG JE ZAMRZNUT U TRENUTKU GENERIRANJA.** Font se ne ugrađuje — slika nosi ono
 * čime ju je nacrtao stroj koji ju je izradio (na Windowsu Segoe UI, na macOS-u SF).
 * Zato je stack izričit i sličan na oba, a slika se **commita**: posjetitelj ne izvodi
 * ovu skriptu, nego vidi bajtove iz repozitorija.
 *
 * ⚠️ Traži preglednik → **NIJE u preflightu**. Vrti se ručno kad se promijeni poruka
 * ili paleta. To da je kartica ISPRAVNIH dimenzija čuva `tests/seo.spec.js`, koji
 * mjeri datoteku, ne ovu skriptu — *gate mjeri artefakt, ne alat koji ga radi.*
 *
 *   node scripts/build-og-image.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'og-cover.png');

/** Izvuci `en` vrijednost jednog i18n ključa — bez učitavanja cijelog modula. */
function i18n(key) {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
  const re = new RegExp("'" + key.replace('.', '\\.') + "':\\s*\\{\\s*en:\\s*'((?:[^'\\\\]|\\\\.)*)'");
  const m = src.match(re);
  if (!m) throw new Error('i18n ključ nije nađen: ' + key);
  return m[1].replace(/\\'/g, "'");
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (e) {
    console.error('❌ playwright nije dostupan — ovo je alat, ne gate. `npm i` pa ponovno.');
    process.exit(1);
  }

  const tokeni = fs.readFileSync(path.join(ROOT, 'css', 'tokens.static.css'), 'utf8');
  const logo = fs.readFileSync(path.join(ROOT, 'assets', 'logo.svg'), 'utf8');
  const naslov = i18n('about.title');       // „About Sokrat Study" → marka
  const poruka = i18n('about.tagline');     // ista rečenica koju vidi posjetitelj

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${tokeni}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; }
body {
  background: var(--color-surface-0);
  color: var(--color-ink-0);
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif;
  /* ⚠️ TRI BLOKA U STUPCU, NIŠTA APSOLUTNO. Prva verzija je podnožje pozicionirala
     apsolutno (bottom: 60px) — pa je podnaslov, kad se prelomio u tri retka, PROŠAO
     KROZ NJEGA. Apsolutni element ne sudjeluje u rasporedu, dakle ne može ni biti
     odgurnut; kvar se ne bi vidio da nisam pogledao samu sliku.
     (Ovaj komentar je pisan bez znaka za kod jer živi unutar template-literala —
     backtick bi ga zatvorio. Ista obitelj greške koju projekt već ima zapisanu.) */
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 76px 96px 68px; position: relative; overflow: hidden;
}
/* Tanka traka marke uz lijevi rub — jedini akcent, po smjeru „monokrom + jedan akcent". */
body::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 14px;
  background: var(--color-brand-500);
}
.mark { display: flex; align-items: center; gap: 18px; }
.mark svg { width: 60px; height: 60px; display: block; }
.mark span {
  font-size: 29px; font-weight: 600; letter-spacing: -0.01em; color: var(--color-ink-1);
}
.msg { display: flex; flex-direction: column; gap: 22px; }
h1 {
  font-size: 78px; line-height: 1.06; font-weight: 700; letter-spacing: -0.035em;
  max-width: 21ch; text-wrap: balance;
}
p { font-size: 32px; line-height: 1.35; color: var(--color-ink-2); max-width: 46ch; }
.foot { font-size: 25px; color: var(--color-ink-2); letter-spacing: 0.01em; }
</style></head><body>
  <div class="mark">${logo}<span>Sokrat Study</span></div>
  <div class="msg">
    <h1>${esc(poruka)}</h1>
    <p>Flashcards, quizzes and fill-in-the-blanks — from the catalogue or from your own notes.</p>
  </div>
  <div class="foot">sokratstudy.com · free · no sign-up · works offline</div>
</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: OUT, type: 'png' });
  await browser.close();

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log('✅ og-cover.png  1200×630  ' + kb + ' KB');
  console.log('   naslov: „' + naslov + '"  ·  poruka: „' + poruka + '"');
  console.log('   ⚠️ commitaj sliku — posjetitelj vidi bajtove iz repozitorija, ne ovu skriptu.');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
