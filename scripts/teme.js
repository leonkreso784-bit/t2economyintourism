'use strict';
/**
 * teme.js — POPIS TEMA IMA JEDNO MJESTO: `css/tokens.css`  (cigla F1/4)
 *
 * ── POVOD ────────────────────────────────────────────────────────────────────────
 * Četiri brane čitaju „koje teme postoje", i do F1/4 su to radile na četiri načina:
 *   • `check-contrast.js` (statička) — regexom iz `tokens.css`  ✅ vidjela je svaku temu
 *   • `check-contrast-live.js` (živa) — ZAKUCAN niz            ⚠️ nova tema bez upisa = neizmjerena
 *   • `tests/helpers/axe-gate.js` (a11y) — ZAKUCAN niz         ⛔ nosio `paper` (maknut 2026-09-01),
 *                                                                 NIJE nosio `carbon` (dodan 2026-09-05)
 *   • `theme-boot-order.test.js` — vlastiti regex               ✅ (uspoređuje `boot.js` s tokenima)
 * Posljedica trećeg retka: a11y-suita je mrtvu temu skenirala kao da je živa, a jedinu novu
 * tamnu temu nije skenirala uopće — i cijelo je vrijeme bila zelena. Zelena brana koja ne zna
 * što mjeri nije brana. `boot.js` mora zadržati SVOJ niz (izvršava se prije crtanja, CSS ne
 * može čitati) — ali njega čuva `theme-boot-order.test.js` protiv ovog čitatelja.
 *
 * ── ŠTO RADI ─────────────────────────────────────────────────────────────────────
 * Vrati imena svih `:root[data-theme="…"] {` blokova iz `css/tokens.css`, u redoslijedu iz
 * datoteke. Komentari se SKIDAJU prije čitanja — pouka iz F1/7 ②: primjer selektora u
 * komentaru modula postao je scenarij u testu i sondi. Nula tema = greška, ne prazan niz:
 * brana koja bi prošla nula tema i šutjela je točno kvar koji ovaj modul zatvara.
 *
 * Čuva: `tests/unit/theme-list.test.js` (svaki čitatelj ide ovuda, nijedan nema kopiju).
 */
const fs = require('fs');
const path = require('path');

const TOKENS = path.resolve(__dirname, '..', 'css', 'tokens.css');
const TEMA_BLOK_RE = /:root\[data-theme="([a-z0-9-]+)"\]\s*\{/g;

function bezKomentara(css) {
  return String(css).replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Imena tema iz `css/tokens.css` (ili iz predanog CSS-teksta — za testove). */
function temeIzTokena(css) {
  const izvor = bezKomentara(css == null ? fs.readFileSync(TOKENS, 'utf8') : css);
  const teme = [];
  const re = new RegExp(TEMA_BLOK_RE.source, 'g');
  let m;
  while ((m = re.exec(izvor)) !== null) {
    if (teme.indexOf(m[1]) < 0) teme.push(m[1]);
  }
  if (!teme.length) {
    throw new Error('scripts/teme.js: u ' + TOKENS + ' nije nađen nijedan `:root[data-theme="…"]` blok — ' +
      'brana bi mjerila nula tema i šutjela.');
  }
  return teme;
}

module.exports = { TOKENS, TEMA_BLOK_RE, bezKomentara, temeIzTokena };
