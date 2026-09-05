#!/usr/bin/env node
'use strict';
/**
 * hover-probe.js — LJEPLJIVI HOVER poslije prelaska (F1/8), mjeren na EKRANU. Izvan preflighta.
 *
 * ── ŠTO MJERI ────────────────────────────────────────────────────────────────────
 * Profil DODIR (zadano, WebKit): otvori popis fakulteta, dodirni karticu u sredini ekrana, pričekaj
 * da se ruta promijeni, pa pogledaj što je SAD pod tim istim prstom: ima li nova kartica
 * `:hover` i hover-izgled (rub/pomak različit od kartice do nje, koja miruje). Dva prelaska
 * (fakultet → program → godina). Leonov opis od 2026-09-05, riječ po riječ. ⚠️ Reproducira
 * ga SAMO WebKit (= svaki preglednik na iPhoneu); Chromium s dodirom ne — zato je Chromium
 * ovdje KONTROLA, ne dokaz.
 *
 * Profil MIŠ (Chromium 1280×800): za svaki vidljivi interaktivni element na četiri rute
 * snimi izračunati izgled u mirovanju i pod mišem. `--out` sprema snimku, `--usporedi`
 * uspoređuje s ranijom: 0 razlika = zamatanje u `@media (hover: hover)` nije promijenilo
 * NIŠTA na mišu, a broj elemenata čiji se izgled pod mišem mijenja dokazuje da hover uopće
 * još postoji (brana koja bi prošla i s obrisanim hoverom nije brana).
 *
 * Profil PRELAZ (Chromium, miš; F1/8 ②): pokazivač stoji na kartici, klik promijeni razinu
 * kataloga, i pod NEPOMIČNIM pokazivačem se nađe nova kartica. Preglednik joj po pravilu daje
 * `:hover` (hover se računa po položaju, ne po pokretu) — a Leon upravo to ne želi vidjeti.
 * Tri mjerenja po prelasku: KONTROLA (kartica pod mišem PRIJE klika ima hover-izgled — inače
 * sonda ne može ništa dokazati) · MIRNO (poslije prelaska, bez pomaka, nova kartica pod istim
 * pokazivačem NEMA hover-izgled, makar JEST `:hover`) · NAORUŽANO (pomak od 1 px → hover-izgled
 * se vrati; hover koji se ne vrati nije popravak nego gubitak). Prije ②: ljepljivo 2/2.
 *
 * ── ZAŠTO NIJE U PREFLIGHTU ──────────────────────────────────────────────────────
 * Traži preglednik i poslužitelj (`npm run serve:test`), a WebKit u CI-ju ne postoji.
 * Statičku stranu čuva `npm run check:hover`, JS-stranu `tests/unit/hover-arm.test.js`.
 *
 * RABLJENJE:
 *   node scripts/hover-probe.js                                  # dodir, WebKit (dokaz ①)
 *   node scripts/hover-probe.js --motor=chromium                 # dodir, Chromium (kontrola)
 *   node scripts/hover-probe.js --profil=prelaz                  # miš poslije prelaska (dokaz ②)
 *   node scripts/hover-probe.js --profil=mis --out=prije.json    # miš: snimka
 *   node scripts/hover-probe.js --profil=mis --usporedi=prije.json
 * Izlaz 1 = ljepljivo (dodir · prelaz) ili razlike (miš); 2 = kontrola pala (sonda ne mjeri).
 */
const fs = require('fs');
const path = require('path');
const pw = require('@playwright/test');

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith('--' + k + '=')); return m ? m.slice(k.length + 3) : d; };
const PROFIL = arg('profil', 'dodir');
const MOTOR = arg('motor', PROFIL === 'dodir' ? 'webkit' : 'chromium');
const OUT = arg('out', '');
const USPOREDI = arg('usporedi', '');
const BASE = 'http://localhost:5050';

const UGASI_PRIVOLU = () => { try { localStorage.setItem('sokrat-cookie-consent', 'declined'); } catch (e) { /* */ } };

/**
 * Što je pod točkom (x, y): koja kartica, je li `:hover`, njezin izgled i izgled jedne MIRNE
 * kartice do nje (usporedba s bratom, ne sa zapisanom bojom — tema smije mijenjati boje).
 * `pauza` = nosi li `<html>` `data-hover-paused` (F1/8 ②; do ② uvijek false).
 */
const podTockom = (page, x, y) => page.evaluate(([x, y]) => {
  const g = document.elementFromPoint(x, y);
  const k = g && g.closest('.browse-card');
  if (!k) return { pod: null, pauza: document.documentElement.hasAttribute('data-hover-paused') };
  const cs = getComputedStyle(k);
  const druga = Array.from(document.querySelectorAll('.browse-card')).find((el) => el !== k && el.offsetParent);
  const cd = druga && getComputedStyle(druga);
  return {
    pod: k.dataset.browse + ':' + k.dataset.id, hover: k.matches(':hover'),
    pauza: document.documentElement.hasAttribute('data-hover-paused'),
    rub: cs.borderTopColor, pomak: cs.transform, sjena: cs.boxShadow,
    mirniRub: cd ? cd.borderTopColor : null, mirniPomak: cd ? cd.transform : null, mirnaSjena: cd ? cd.boxShadow : null,
  };
}, [x, y]);
const hoverIzgled = (s) => !!(s.pod && (s.rub !== s.mirniRub || s.pomak !== s.mirniPomak || s.sjena !== s.mirnaSjena));

async function dodir(browser) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, baseURL: BASE });
  const page = await ctx.newPage();
  await page.goto('/#/subjects', { waitUntil: 'load' });
  await page.evaluate(UGASI_PRIVOLU);
  const mq = await page.evaluate(() => ({ hover: matchMedia('(hover: hover)').matches, none: matchMedia('(hover: none)').matches }));
  console.log('MOTOR ' + MOTOR + ' · profil dodir · (hover: hover)=' + mq.hover + ' (hover: none)=' + mq.none);
  const prva = page.locator('.browse-card[data-browse="faculty"]').first();
  await prva.waitFor({ state: 'visible' });
  const b = await prva.boundingBox();
  const x = Math.round(b.x + b.width / 2), y = Math.round(b.y + b.height / 2);

  const stanje = () => podTockom(page, x, y);

  let ljepljivo = 0;
  const hopovi = [['program', 'fakultet → program'], ['year', 'program → godina']];
  for (const [cilj, ime] of hopovi) {
    await page.touchscreen.tap(x, y);
    await page.waitForSelector('.browse-card[data-browse="' + cilj + '"]');
    await page.waitForTimeout(500);
    const s = await stanje();
    const izgled = hoverIzgled(s);
    const lj = !!(s.pod && s.hover && izgled);
    if (lj) ljepljivo++;
    console.log('  ' + ime.padEnd(20) + ' pod prstom: ' + (s.pod || 'ništa') + ' · :hover=' + s.hover + ' · hover-izgled=' + !!izgled
      + (s.pod ? ' (rub ' + s.rub + ' vs mirni ' + s.mirniRub + ')' : '') + '  → ' + (lj ? '❌ LJEPLJIVO' : '✅ mirno'));
  }
  await ctx.close();
  console.log('DOSEG: ' + hopovi.length + ' prelaska · ' + (ljepljivo ? '❌ ljepljivo u ' + ljepljivo : '✅ ništa ne svijetli poslije dodira'));
  return ljepljivo ? 1 : 0;
}

const SVOJSTVA = ['borderTopColor', 'borderBottomColor', 'backgroundColor', 'color', 'transform', 'boxShadow', 'opacity', 'textDecorationLine', 'outlineColor', 'filter'];
const RUTE = [['/', 'landing'], ['/#/subjects', 'browse'], ['/#/about', 'about']];

async function mis(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, baseURL: BASE });
  const page = await ctx.newPage();
  const snimka = {};
  let elemenata = 0, mijenja = 0;
  console.log('MOTOR ' + MOTOR + ' · profil miš · 1280×800');
  for (const [url, ime] of RUTE) {
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(UGASI_PRIVOLU);
    await page.waitForTimeout(600);
    // Prijelazi bi dali polovične vrijednosti — gase se, hover-pravila ostaju netaknuta.
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
    const kandidati = await page.evaluate((SV) => {
      const out = [];
      const sel = 'a[href], button, .browse-card, .landing-subject-card, .door, [class*="-card"], [class*="btn"], [class*="link"]';
      const vidjeni = new Set();
      document.querySelectorAll(sel).forEach((el, i) => {
        if (vidjeni.has(el)) return; vidjeni.add(el);
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const meta = document.elementFromPoint(cx, cy);
        if (!meta || !(meta === el || el.contains(meta))) return;
        let k = el.tagName.toLowerCase(); if (el.id) k += '#' + el.id; else if (typeof el.className === 'string' && el.className.trim()) k += '.' + el.className.trim().split(/\s+/)[0];
        out.push({ k: k + '[' + i + ']', x: cx, y: cy });
      });
      return out.slice(0, 60);
    }, SVOJSTVA);
    for (const c of kandidati) {
      await page.mouse.move(2, 2); await page.waitForTimeout(40);
      const mir = await page.evaluate(([x, y, SV]) => { const el = document.elementFromPoint(x, y); const cs = getComputedStyle(el); return SV.map((p) => cs[p]).join('|'); }, [c.x, c.y, SVOJSTVA]);
      await page.mouse.move(c.x, c.y); await page.waitForTimeout(60);
      const hov = await page.evaluate(([x, y, SV]) => { const el = document.elementFromPoint(x, y); const cs = getComputedStyle(el); return SV.map((p) => cs[p]).join('|'); }, [c.x, c.y, SVOJSTVA]);
      snimka[ime + ' ' + c.k] = { mir, hov };
      elemenata++; if (mir !== hov) mijenja++;
    }
    console.log('  ' + ime.padEnd(8) + ' elemenata: ' + String(kandidati.length).padStart(3) + ' · pod mišem se mijenja: ' + kandidati.filter((c) => { const s = snimka[ime + ' ' + c.k]; return s.mir !== s.hov; }).length);
  }
  await ctx.close();
  console.log('DOSEG: ' + RUTE.length + ' rute · ' + elemenata + ' elemenata · ' + mijenja + ' mijenja izgled pod mišem');
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify({ motor: MOTOR, snimka }, null, 1)); console.log('snimka → ' + OUT); }
  if (USPOREDI) {
    const stara = JSON.parse(fs.readFileSync(USPOREDI, 'utf8')).snimka;
    const kljucevi = Object.keys(stara);
    let isto = 0, razlike = [], nema = 0, mijenjaloPrije = 0;
    for (const k of kljucevi) {
      const a = stara[k], b = snimka[k];
      if (a.mir !== a.hov) mijenjaloPrije++;
      if (!b) { nema++; continue; }
      if (a.mir === b.mir && a.hov === b.hov) isto++; else razlike.push(k + (a.hov !== b.hov ? ' [hover]' : ' [mir]'));
    }
    console.log('USPOREDBA s ' + path.basename(USPOREDI) + ': ' + kljucevi.length + ' elemenata · isto ' + isto + ' · razlike ' + razlike.length + ' · nedostaje ' + nema
      + ' · mijenjalo prije ' + mijenjaloPrije + ', sada ' + mijenja);
    razlike.slice(0, 20).forEach((r) => console.log('   ≠ ' + r));
    if (razlike.length || nema || mijenja < mijenjaloPrije) { console.log('❌ hover na mišu NIJE isti kao prije'); return 1; }
    console.log('✅ hover na mišu netaknut (' + mijenja + ' elemenata i dalje mijenja izgled)');
  }
  return 0;
}

async function prelaz(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, baseURL: BASE });
  const page = await ctx.newPage();
  await page.goto('/#/subjects', { waitUntil: 'load' });
  await page.evaluate(UGASI_PRIVOLU);
  // Prijelazi bi dali polovične vrijednosti — gase se, hover-pravila ostaju netaknuta.
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
  console.log('MOTOR ' + MOTOR + ' · profil prelaz (miš) · 1280×800');
  const prva = page.locator('.browse-card[data-browse="faculty"]').first();
  await prva.waitFor({ state: 'visible' });
  const b = await prva.boundingBox();
  const x = Math.round(b.x + b.width / 2), y = Math.round(b.y + b.height / 2);
  const opis = (s) => (s.pod || 'ništa') + ' · :hover=' + s.hover + ' · hover-izgled=' + hoverIzgled(s) + ' · pauza=' + s.pauza;

  let ljepljivo = 0, neNaoruzano = 0;
  const hopovi = [['program', 'fakultet → program'], ['year', 'program → godina']];
  for (const [cilj, ime] of hopovi) {
    // KONTROLA: miš stoji na kartici i ona MORA imati hover-izgled — inače dolje ne mjerimo ništa.
    await page.mouse.move(x, y); await page.waitForTimeout(150);
    const k = await podTockom(page, x, y);
    if (!(k.pod && k.hover && hoverIzgled(k))) {
      console.log('  ' + ime.padEnd(20) + ' KONTROLA pala: ' + opis(k) + ' — hover na mišu ne radi, sonda ne može ništa dokazati');
      await ctx.close();
      return 2;
    }
    await page.mouse.click(x, y);
    await page.waitForSelector('.browse-card[data-browse="' + cilj + '"]');
    await page.waitForTimeout(500);
    const s = await podTockom(page, x, y);           // bez pomaka
    const lj = hoverIzgled(s);
    if (lj) ljepljivo++;
    await page.mouse.move(x + 1, y + 1); await page.waitForTimeout(150);
    const n = await podTockom(page, x + 1, y + 1);   // poslije pomaka od 1 px
    const nao = !!(n.pod && n.hover && hoverIzgled(n));
    if (!nao) neNaoruzano++;
    console.log('  ' + ime.padEnd(20) + ' kontrola ✅ · bez pomaka: ' + opis(s) + '  → ' + (lj ? '❌ LJEPLJIVO' : '✅ mirno')
      + '\n' + ' '.repeat(23) + 'pomak 1 px: ' + opis(n) + '  → ' + (nao ? '✅ naoružano' : '❌ hover se NIJE vratio'));
  }
  await ctx.close();
  console.log('DOSEG: ' + hopovi.length + ' prelaska · ' + (ljepljivo ? '❌ ljepljivo u ' + ljepljivo : '✅ ništa ne svijetli dok se miš ne pomakne')
    + (neNaoruzano ? ' · ❌ hover se nije vratio u ' + neNaoruzano : ' · ✅ hover se vraća prvim pomakom'));
  return (ljepljivo || neNaoruzano) ? 1 : 0;
}

(async () => {
  const browser = await pw[MOTOR].launch();
  const kod = PROFIL === 'mis' ? await mis(browser) : PROFIL === 'prelaz' ? await prelaz(browser) : await dodir(browser);
  await browser.close();
  process.exit(kod);
})().catch((e) => { console.error('❌ ' + (e && e.message ? e.message.split('\n')[0] : e)); process.exit(2); });
