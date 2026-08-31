#!/usr/bin/env node
/**
 * blocks-diff.js — izračunati stilovi BLOKOVA GRADIVA, referenca vs radno stablo.
 *
 * Pokreni:  node scripts/blocks-diff.js [git-ref]      (zadano: HEAD)
 * Širine:   BLOCKS_DIFF_SIRINE="375,768,1280"
 *
 * ── ZAŠTO POSTOJI ZASEBAN ALAT, A NE `css:diff` ─────────────────────────────────────
 * `css:diff` mjeri RUTE. Ali javni katalog od `css/learn-blocks.css` iscrtava samo
 * **2 od 44 pravila** (`.lb-legacy`, `.lb-table-wrap`) — gradivo je v1 HTML kroz
 * DOMPurify, a ostalo živi u editoru i u korisnikovim materijalima (UGC). Zato
 * `css:diff` na kataloškoj learn-ruti javi „0 razlika" za gotovo cijelu datoteku, i to
 * nije dokaz nego **prazan ekran**. Ovaj alat crta blokove kroz `window.renderBlocks` —
 * isti put koji koriste `tests/learn-parity.spec.js` i `tests/learn-blocks-contrast.spec.js`.
 *
 * ── DVIJE STVARI KOJE OVAJ ALAT RADI, A LAKO SE ZABORAVE ────────────────────────────
 * ① **KLJUČ ELEMENTA JE STRUKTURNI POLOŽAJ, NIKAD IME KLASE.** Cigla migracije mijenja
 *    upravo klase; ključ s klasom razlikuje svaki element od samoga sebe. Izmjereno u
 *    C5b/1b: prva verzija je tako javila **138 lažnih razlika**. Mjerač ne smije ovisiti
 *    o onome što se mijenja.
 * ② **POKRIVENOST SE DOKAZUJE PRIJE RAZLIKE.** „0 razlika" na klasi koja nije nacrtana
 *    nije dokaz. Zato alat prvo provjeri da je svaka klasa iz `META` doista u DOM-u, i
 *    **padne ako nije** — uključujući `.lb-video__play`, koja postoji samo PRIJE klika na
 *    fasadu, i `.lb-video__frame`, koja postoji samo POSLIJE njega.
 *
 * Nije u preflightu: traži preglednik, poslužitelj i `git worktree`. Vrti se uz ciglu koja
 * dira `learn-blocks.css` ili `js/blocks-renderer.js`.
 */
'use strict';

const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const REF = process.argv[2] || 'HEAD';
const PORT_RAD = 5074;
const PORT_REF = 5075;   // ⚠️ NE 5060/5061: Chrome ih blokira kao SIP (ERR_UNSAFE_PORT).
const SIRINE = (process.env.BLOCKS_DIFF_SIRINE || '375,768,1280')
  .split(',').map((x) => Number(x.trim())).filter(Boolean);

/** Klase koje ovaj alat TVRDI da mjeri. Ako nešto od ovoga nije nacrtano — pad. */
const META = ['lb-heading', 'lb-paragraph', 'lb-list', 'lb-callout', 'lb-callout__title',
  'lb-callout__body', 'lb-figure__img', 'lb-figure__cap', 'lb-video', 'lb-video__play',
  'lb-video__icon', 'lb-video__label', 'lb-video__frame', 'lb-table-wrap', 'lb-table',
  'lb-formula', 'lb-formula--inline', 'lb-imath', 'lb-legacy', 'lb-color-red'];

/** Fixture pokriva SVAKI tip bloka koji renderer poznaje + svih 8 tinti autora. */
const BLOKOVI = [
  { type: 'heading', level: 2, text: 'Naslov dva' },
  { type: 'heading', level: 3, text: 'Naslov tri' },
  { type: 'heading', level: 4, text: 'Naslov cetiri' },
  { type: 'paragraph', text: [
    { text: 'obicno ' },
    { text: 'crveno ', color: 'red' }, { text: 'jantar ', color: 'amber' },
    { text: 'zeleno ', color: 'green' }, { text: 'tirkiz ', color: 'cyan' },
    { text: 'plavo ', color: 'blue' }, { text: 'indigo ', color: 'indigo' },
    { text: 'ljubicasto ', color: 'violet' }, { text: 'roza ', color: 'pink' },
    { text: 'x^2', math: true }
  ] },
  { type: 'list', items: ['prva', 'druga', 'treca'] },
  { type: 'callout', variant: 'info', title: 'Info', text: 'tijelo info' },
  { type: 'callout', variant: 'warning', title: 'Upozorenje', text: 'tijelo warn' },
  { type: 'callout', variant: 'tip', title: 'Savjet', text: 'tijelo tip' },
  { type: 'image', src: 'assets/logo.svg', alt: 'znak', caption: 'potpis slike' },
  { type: 'image', src: 'assets/logo.svg', alt: 'uza', width: 40 },
  { type: 'video', videoId: 'dQw4w9WgXcQ' },
  { type: 'table', header: ['A', 'B'], rows: [['1', '2'], ['3', '4']] },
  { type: 'formula', tex: 'a^2+b^2=c^2' },
  { type: 'formula', tex: 'x', display: false },
  { type: 'legacy-html', html: '<p>legacy tekst</p><table><tr><td>legacy celija</td></tr></table>' }
];

const SVOJSTVA = ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height',
  'max-width', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top',
  'padding-right', 'padding-bottom', 'padding-left', 'flex-direction', 'align-items',
  'justify-content', 'gap', 'overflow-x', 'overflow-y', 'aspect-ratio', 'text-align',
  'border-top-width', 'border-left-width', 'border-collapse', 'border-radius', 'color',
  'background-color', 'background-image', 'box-shadow', 'font-size', 'font-weight', 'line-height'];

function posluzitelj(port, korijen) {
  const p = spawn(process.execPath, [path.join(ROOT, 'scripts', 'static-server.js')], {
    env: Object.assign({}, process.env, { PORT: String(port), SERVE_ROOT: korijen }),
    stdio: 'ignore'
  });
  return p;
}

async function cekajPoslu(port) {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://localhost:' + port + '/');
      if (r.ok) return;
    } catch (e) { /* još ne sluša */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('blocks-diff: poslužitelj na ' + port + ' se nije podigao');
}

async function mjeri(browser, port, sirina) {
  const ctx = await browser.newContext({ viewport: { width: sirina, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.route('**youtube**', (r) => r.abort());   // fasada smije nastati, mreža ne treba
  await page.goto('http://localhost:' + port + '/', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.renderBlocks === 'function', null, { timeout: 20000 });

  const rez = await page.evaluate(({ blokovi, svojstva, meta }) => {
    const host = document.createElement('div');
    host.id = 'lbProba';
    host.style.width = '900px';
    document.body.appendChild(host);
    host.innerHTML = window.renderBlocks(blokovi);

    const nadjenoPrije = meta.filter((k) => host.querySelector('.' + k));

    const stilovi = {};
    const hod = (el, put) => {
      const cs = getComputedStyle(el);
      stilovi[put] = svojstva.map((s) => cs.getPropertyValue(s)).join('|');
      // ⚠️ Ključ = tag + redni broj. NIKAD ime klase: cigla mijenja upravo klase.
      Array.from(el.children).forEach((c, i) => hod(c, put + '>' + c.tagName.toLowerCase() + '[' + i + ']'));
    };
    Array.from(host.children).forEach((c, i) => hod(c, c.tagName.toLowerCase() + '[' + i + ']'));

    // Fasada videa → iframe. `.lb-video__play` postoji SAMO prije klika, `.lb-video__frame`
    // samo poslije — pa se pokrivenost mjeri kao UNIJA dvaju trenutaka.
    const btn = host.querySelector('[data-lb-yt]');
    if (btn) btn.click();
    const okvir = host.querySelector('iframe');
    if (okvir) {
      const cs = getComputedStyle(okvir);
      stilovi['__iframe__'] = svojstva.map((s) => cs.getPropertyValue(s)).join('|');
    }
    const nadjenoPoslije = meta.filter((k) => host.querySelector('.' + k));

    return { stilovi, nadjeno: Array.from(new Set(nadjenoPrije.concat(nadjenoPoslije))) };
  }, { blokovi: BLOKOVI, svojstva: SVOJSTVA, meta: META });

  await ctx.close();
  return rez;
}

(async () => {
  console.log('\n=== blocks-diff: izračunati stilovi blokova, referenca vs radno stablo ===');
  const wtDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blocks-diff-'));
  execSync('git worktree add --detach "' + wtDir + '" ' + REF, { cwd: ROOT, stdio: 'ignore' });
  const sha = execSync('git rev-parse --short HEAD', { cwd: wtDir }).toString().trim();
  console.log('   referenca : ' + REF + ' (' + sha + ')');
  console.log('   radno     : radno stablo');
  console.log('   put       : window.renderBlocks (NE kataloška ruta — ondje se crtaju 2 od 44 pravila)\n');

  const s1 = posluzitelj(PORT_RAD, ROOT);
  const s2 = posluzitelj(PORT_REF, wtDir);
  let browser;
  let pao = 0;
  try {
    await cekajPoslu(PORT_RAD);
    await cekajPoslu(PORT_REF);
    browser = await chromium.launch();

    let usporedbi = 0;
    let razlika = 0;
    for (const sirina of SIRINE) {
      const ref = await mjeri(browser, PORT_REF, sirina);
      const rad = await mjeri(browser, PORT_RAD, sirina);

      // ① POKRIVENOST PRIJE RAZLIKE — „0 razlika" na nenacrtanoj klasi nije dokaz.
      const fali = META.filter((k) => !rad.nadjeno.includes(k));
      if (fali.length) {
        console.log('  ✗ ' + sirina + 'px — NIJE NACRTANO: ' + fali.join(', '));
        pao = 1;
        continue;
      }

      const kljucevi = new Set(Object.keys(ref.stilovi).concat(Object.keys(rad.stilovi)));
      let ovdje = 0;
      for (const k of kljucevi) {
        usporedbi++;
        if (ref.stilovi[k] === rad.stilovi[k]) continue;
        ovdje++;
        if (ovdje <= 8) {
          console.log('   ✗ ' + k);
          const a = (ref.stilovi[k] || '').split('|');
          const b = (rad.stilovi[k] || '').split('|');
          SVOJSTVA.forEach((s, i) => {
            if (a[i] !== b[i]) console.log('        ' + s + ': ' + JSON.stringify(a[i]) + ' → ' + JSON.stringify(b[i]));
          });
        }
      }
      razlika += ovdje;
      console.log('  ' + (ovdje ? '✗' : '✓') + ' ' + sirina + 'px — ' + kljucevi.size +
        ' elemenata, ' + rad.nadjeno.length + '/' + META.length + ' klasa nacrtano, ' + ovdje + ' razlika');
    }

    console.log('\n   OPSEG: ' + usporedbi + ' usporedbi kroz ' + SIRINE.length + ' širina × ' +
      SVOJSTVA.length + ' svojstava');
    if (razlika || pao) {
      console.log('\n⚠️  ' + razlika + ' razlika u prikazu — pročitaj ih prije nego proglasiš ciglu gotovom.\n');
      pao = 1;
    } else {
      console.log('\n✅ Nijedan blok nije promijenio prikaz.\n');
    }
  } finally {
    if (browser) await browser.close();
    s1.kill(); s2.kill();
    try { execSync('git worktree remove --force "' + wtDir + '"', { cwd: ROOT, stdio: 'ignore' }); } catch (e) { /* ostaje za ručno */ }
    execSync('git worktree prune', { cwd: ROOT, stdio: 'ignore' });
  }
  process.exit(pao);
})();
