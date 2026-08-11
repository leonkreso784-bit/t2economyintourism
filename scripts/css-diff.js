#!/usr/bin/env node
'use strict';
/**
 * css-diff.js — dokazuje da se IZGLED nije promijenio, mjerenjem u pravom pregledniku.
 *
 * ZAŠTO POSTOJI: cigla C1 (Tailwind temelj) obećava „stranica izgleda bajt-identično", a
 * `styles.bundle.css` se pritom promijenio za 50 KB — Tailwind provlači i naš CSS kroz
 * Lightning CSS, koji briše komentare i normalizira zapis. Diff bajtova zato NE dokazuje ništa:
 * pokazuje stotine razlika koje ne znače ništa, a jednu koja bi značila sve utopio bi u njima.
 * Jedino mjerodavno pitanje je: daje li preglednik za SVAKI element ISTE izračunate stilove?
 *
 * Isto pitanje vrijedi za svaku sljedeću ciglu (C2–C7), samo obrnuto: tamo se JEDNA površina
 * smije promijeniti, a sve ostale moraju ostati netaknute. Ovaj alat to razdvaja.
 *
 * KAKO: ista stranica se učita dvaput — jednom s referentnim bundleom (presretnut zahtjev),
 * jednom s onim iz radnog stabla. Sve `*-page` plohe se prisilno otvore (inače su `display:none`
 * i mjerili bismo prazno), animacije se zamrznu na t=0 (inače je usporedba bučna), pa se za
 * svaki element pohrani sažetak SVIH izračunatih svojstava. Razlikuje li se sažetak, element se
 * mjeri još jednom i ispiše se točno koje se svojstvo razlikuje.
 *
 * RABLJENJE:
 *   node scripts/css-diff.js                 # radno stablo vs `styles.bundle.css` iz HEAD-a
 *   node scripts/css-diff.js put/do/ref.css  # radno stablo vs zadana referenca
 *
 * Izlazni kod: 0 = nema razlika, 1 = ima. Traži Playwright + slobodan port (mrežno/browser) →
 * NIJE u `preflight`, pokreće se ručno uz ciglu koja dira CSS.
 */
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.CSS_DIFF_PORT || 5051;
const BUNDLE = 'styles.bundle.css';

/** Širine na kojima mjerimo — svaka otvara drugi skup media queryja. */
const VIEWPORTS = [
  { name: 'telefon-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 900 },
];

function referenceCss(arg) {
  if (arg) {
    const p = path.resolve(ROOT, arg);
    if (!fs.existsSync(p)) { console.error('❌ Referenca ne postoji: ' + arg); process.exit(2); }
    return { css: fs.readFileSync(p, 'utf8'), label: arg };
  }
  try {
    const css = execFileSync('git', ['show', 'HEAD:' + BUNDLE], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return { css, label: 'HEAD:' + BUNDLE };
  } catch (e) {
    console.error('❌ Ne mogu dohvatiti `' + BUNDLE + '` iz HEAD-a. Zadaj referencu kao argument.');
    process.exit(2);
  }
}

/**
 * Ono što se izvršava U PREGLEDNIKU. Vraća `{ keys, hashes }` — po jedan sažetak izračunatih
 * stilova za svaki element, adresiran stabilnim putem kroz stablo (ne indeksom u listi, jer bi
 * jedan element viška pomaknuo sve ostale i proizveo lažnu rijeku razlika).
 */
const COLLECT = function () {
  document.querySelectorAll('[class*="-page"]').forEach(function (el) {
    if (/(^|\s)[a-z-]+-page(\s|$)/.test(el.className)) el.classList.add('active');
  });
  document.getAnimations().forEach(function (a) { try { a.currentTime = 0; a.pause(); } catch (e) { /* neanimirano */ } });

  function pathOf(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      const parent = node.parentElement;
      let idx = 0;
      if (parent) {
        const same = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
        idx = same.indexOf(node);
      }
      parts.unshift(node.tagName.toLowerCase() + '[' + idx + ']');
      node = parent;
    }
    return parts.join('>');
  }

  // Dva odvojena sažetka po elementu. STANDARDNA svojstva su ono što se vidi. CUSTOM
  // (`--*`) su tokeni: dodati novi token mijenja izračunatu vrijednost na SVAKOM elementu
  // (nasljeđuju se), a ne pomiče ni jedan piksel. Da su u istom sažetku, 33 nova tokena
  // proizvela bi 1146 „razlika" i utopila bi jednu pravu. Zato se broje odvojeno.
  const keys = [];
  const std = [];
  const custom = [];
  const all = document.querySelectorAll('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') continue;
    const cs = getComputedStyle(el);
    let hs = 5381;
    let hc = 5381;
    for (let j = 0; j < cs.length; j++) {
      const s = cs[j] + ':' + cs.getPropertyValue(cs[j]) + ';';
      const isVar = cs[j].charCodeAt(0) === 45 && cs[j].charCodeAt(1) === 45;
      for (let k = 0; k < s.length; k++) {
        if (isVar) hc = ((hc * 33) ^ s.charCodeAt(k)) >>> 0;
        else hs = ((hs * 33) ^ s.charCodeAt(k)) >>> 0;
      }
    }
    keys.push(pathOf(el));
    std.push(hs);
    custom.push(hc);
  }
  return { keys: keys, std: std, custom: custom };
};

/** Puni popis izračunatih svojstava za zadane putanje (jedan prolaz za sve, ne po elementu). */
const DETAIL = function (targetPaths) {
  document.querySelectorAll('[class*="-page"]').forEach(function (el) {
    if (/(^|\s)[a-z-]+-page(\s|$)/.test(el.className)) el.classList.add('active');
  });
  document.getAnimations().forEach(function (a) { try { a.currentTime = 0; a.pause(); } catch (e) { /* neanimirano */ } });

  function pathOf(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      const parent = node.parentElement;
      let idx = 0;
      if (parent) {
        const same = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
        idx = same.indexOf(node);
      }
      parts.unshift(node.tagName.toLowerCase() + '[' + idx + ']');
      node = parent;
    }
    return parts.join('>');
  }

  const want = new Set(targetPaths);
  const out = {};
  const all = document.querySelectorAll('*');
  for (let i = 0; i < all.length; i++) {
    const key = pathOf(all[i]);
    if (!want.has(key) || out[key]) continue;
    const cs = getComputedStyle(all[i]);
    const styles = {};
    for (let j = 0; j < cs.length; j++) styles[cs[j]] = cs.getPropertyValue(cs[j]);
    out[key] = { cls: String(all[i].className || ''), styles: styles };
  }
  return out;
};

async function measure(page, url, overrideCss) {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  if (overrideCss !== null) {
    await page.route('**/' + BUNDLE + '*', function (route) {
      return route.fulfill({ status: 200, contentType: 'text/css', body: overrideCss });
    });
  }
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(700); // pusti `defer` skripte da sagrade markup
  return page.evaluate(COLLECT);
}

(async () => {
  let chromium;
  try { ({ chromium } = require('@playwright/test')); } catch (e) {
    console.error('❌ Playwright nije dostupan. `npm ci`.'); process.exit(2);
  }
  const ref = referenceCss(process.argv[2]);
  const cur = fs.readFileSync(path.join(ROOT, BUNDLE), 'utf8');

  console.log('\n=== css-diff: izračunati stilovi, referenca vs radno stablo ===');
  console.log('   referenca : ' + ref.label + '  (' + (ref.css.length / 1024).toFixed(1) + ' KB)');
  console.log('   radno     : ' + BUNDLE + '  (' + (cur.length / 1024).toFixed(1) + ' KB)\n');

  const server = spawn(process.execPath, [path.join(ROOT, 'scripts', 'static-server.js')], {
    cwd: ROOT, env: Object.assign({}, process.env, { PORT: String(PORT) }), stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise(function (resolve, reject) {
    const t = setTimeout(function () { reject(new Error('server se nije podigao')); }, 15000);
    server.stdout.on('data', function (d) { if (String(d).includes('static server on')) { clearTimeout(t); resolve(); } });
  });

  const browser = await chromium.launch();
  let problems = 0;
  let elementsChecked = 0;
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, serviceWorkers: 'block' });
      const page = await ctx.newPage();
      const url = 'http://localhost:' + PORT + '/';

      const before = await measure(page, url, ref.css);
      const after = await measure(page, url, null);

      const beforeStd = new Map();
      const beforeCustom = new Map();
      before.keys.forEach(function (k, i) { beforeStd.set(k, before.std[i]); beforeCustom.set(k, before.custom[i]); });

      const diffStd = [];
      const diffCustom = [];
      let onlyAfter = 0;
      after.keys.forEach(function (k, i) {
        if (!beforeStd.has(k)) { onlyAfter++; return; }
        elementsChecked++;
        if (beforeStd.get(k) !== after.std[i]) diffStd.push(k);
        else if (beforeCustom.get(k) !== after.custom[i]) diffCustom.push(k);
      });
      const afterSet = new Set(after.keys);
      const onlyBefore = before.keys.filter(function (k) { return !afterSet.has(k); }).length;

      // Tokeni: razlika smije biti SAMO „dodan novi token". Promijenjena ili nestala vrijednost
      // znači da je nova definicija pregazila postojeću (npr. Tailwindov `--shadow-lg` preko našeg)
      // — to je tiha regresija i pada.
      let tokenAdded = 0;
      const tokenBroken = [];
      if (diffCustom.length) {
        const probe = diffCustom.slice(0, 60);
        await measure(page, url, ref.css);
        const a = await page.evaluate(DETAIL, probe);
        await measure(page, url, null);
        const b = await page.evaluate(DETAIL, probe);
        for (const key of probe) {
          if (!a[key] || !b[key]) continue;
          const props = new Set(Object.keys(a[key].styles).concat(Object.keys(b[key].styles)));
          for (const p of props) {
            if (p.slice(0, 2) !== '--' || a[key].styles[p] === b[key].styles[p]) continue;
            if (a[key].styles[p] === undefined) tokenAdded++;
            else tokenBroken.push(key + '  ' + p + ':  ' + JSON.stringify(a[key].styles[p]) + '  →  ' + JSON.stringify(b[key].styles[p]));
          }
        }
      }

      const notes = [];
      if (onlyBefore || onlyAfter) notes.push('DOM se razlikuje: ' + onlyBefore + '/' + onlyAfter + ' elemenata (gradi ih JS, nije CSS)');
      if (tokenAdded) notes.push(diffCustom.length + ' elemenata je naslijedilo NOVE tokene (očekivano — definicija, ne prikaz)');
      const note = notes.length ? '\n      ↳ ' + notes.join('\n      ↳ ') : '';

      if (!diffStd.length && !tokenBroken.length) {
        console.log('  ✓ ' + vp.name + ' — ' + after.keys.length + ' elemenata, 0 razlika u prikazu' + note);
      } else {
        problems += diffStd.length + tokenBroken.length;
        console.log('  ✗ ' + vp.name + ' — ' + diffStd.length + ' element(a) s drukčijim PRIKAZOM, ' +
          tokenBroken.length + ' pregaženih tokena' + note);
        tokenBroken.slice(0, 10).forEach(function (t) { console.log('      ⚠ pregažen token: ' + t); });
        if (diffStd.length) {
          const probe = diffStd.slice(0, 8);
          await measure(page, url, ref.css);
          const a = await page.evaluate(DETAIL, probe);
          await measure(page, url, null);
          const b = await page.evaluate(DETAIL, probe);
          for (const key of probe) {
            if (!a[key] || !b[key]) { console.log('      ' + key + ' — element nestao između mjerenja'); continue; }
            const props = Object.keys(b[key].styles).filter(function (p) {
              return p.slice(0, 2) !== '--' && a[key].styles[p] !== b[key].styles[p];
            });
            console.log('      ' + key + (b[key].cls ? '   .' + b[key].cls.trim().split(/\s+/).join('.') : ''));
            props.slice(0, 12).forEach(function (p) {
              console.log('         ' + p + ':  referenca ' + JSON.stringify(a[key].styles[p]) + '  →  radno ' + JSON.stringify(b[key].styles[p]));
            });
            if (props.length > 12) console.log('         … i još ' + (props.length - 12) + ' svojstava');
          }
          if (diffStd.length > 8) console.log('      … i još ' + (diffStd.length - 8) + ' elemenata');
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log('\n' + (problems === 0
    ? '✅ Nijedan element nije promijenio prikaz (' + elementsChecked + ' usporedbi kroz ' + VIEWPORTS.length + ' širine).'
    : '⚠️  ' + problems + ' razlika u prikazu — pročitaj ih prije nego proglasiš ciglu gotovom.'));
  process.exit(problems === 0 ? 0 : 1);
})();
