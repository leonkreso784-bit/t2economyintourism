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
 * KAKO: ista stranica se učita dvaput — jednom iz REFERENTNE verzije, jednom iz radnog stabla.
 * Sve `*-page` plohe se prisilno otvore (inače su `display:none` i mjerili bismo prazno),
 * animacije se zamrznu na t=0 (inače je usporedba bučna), pa se za svaki element pohrani sažetak
 * SVIH izračunatih svojstava. Razlikuje li se sažetak, element se mjeri još jednom i ispiše se
 * točno koje se svojstvo razlikuje.
 *
 * ⚠️ ZAŠTO REFERENCA IDE KROZ `git worktree`, A NE KROZ PRESRETANJE (popravak 2026-08-29).
 * Do tada je alat premotavao SAMO `styles.bundle.css`, a HTML i JS uzimao iz radnog stabla.
 * Dok se mijenja isključivo CSS, to je točno. Ali cigle C4–C7 rade upravo obrnuto: **sele
 * vrijednost IZ markupa U CSS**. Tada referentna strana postane himera koja nikad nije
 * postojala — stari CSS + novi markup — pa alat prijavljuje rijeku razlika kojih nema, a jednu
 * pravu utopi u njima. **Alat koji laže gori je od alata kojeg nema: nauči te da ga ignoriraš.**
 * T5 je to platio i dokaz izveo ručnim A/B-om iz zasebnog worktreeja; sada to radi sam alat.
 * ⚠️ I markup gradi JS (`defer` skripte), pa premotati treba SVE osim mjerenja — dakle cijelo
 * stablo, ne popis datoteka. Popis bi trebalo održavati, a stablo se održava samo.
 *
 * RABLJENJE:
 *   node scripts/css-diff.js                    # radno stablo vs HEAD (cijelo stablo)
 *   node scripts/css-diff.js main               # vs bilo koja git referenca
 *   node scripts/css-diff.js --css-only ref.css # SAMO bundle (v. upozorenje niže)
 *
 * Izlazni kod: 0 = nema razlika, 1 = ima. Traži Playwright + slobodan port (mrežno/browser) →
 * NIJE u `preflight`, pokreće se ručno uz ciglu koja dira CSS.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.CSS_DIFF_PORT || 5051);
const PORT_REF = PORT + 1;                 // referentno stablo ide na svoj port
/* Koliko promijenjenih elemenata se ISPISUJE. Osam je dovoljno dok se lovi nenamjerna
   razlika, ali cigla koja MIGRIRA površinu mijenja desetke elemenata namjerno — i tada
   je „… i još 19" upravo ono što se mora pročitati da bi se smjelo tvrditi da se ništa
   IZVAN površine nije pomaknulo. Zato granica postaje podesiva (C4a). */
const KAP = Number(process.env.CSS_DIFF_ALL ? 100000 : (process.env.CSS_DIFF_KAP || 8));
const BUNDLE = 'styles.bundle.css';

/**
 * RUTE na kojima mjerimo (C4b).
 *
 * ⚠️ Dosad je alat gledao ISKLJUČIVO `/`. Za landing je to bilo dovoljno, ali `COLLECT`
 * nasilno pali svaku `*-page` sekciju, pa je nastao dojam da su sve stranice izmjerene —
 * a izmjeren je samo njihov MARKUP IZ `index.html`. Sve što crta JavaScript pri ulasku u
 * rutu (kartice kataloga, popis lekcija, polica) na `/` NE POSTOJI, pa se nije ni
 * uspoređivalo. To je „Zamka 2" iz §9.16, i C4b je prva cigla koja u nju stvarno upada.
 *
 * Zadano ostaje `/` da ostale cigle ne postanu trostruko sporije; cigla koja migrira
 * površinu s JS-om PREDAJE svoje rute:
 *     CSS_DIFF_RUTE="#/subjects,#/subject/te2" npm run css:diff
 * Ispis UVIJEK imenuje što je mjereno — šutnja o dosegu je upravo ono što je zamku i
 * održalo na životu.
 */
const RUTE = (process.env.CSS_DIFF_RUTE || '').split(',').map((r) => r.trim()).filter(Boolean);
if (!RUTE.length) RUTE.push('');

/** Širine na kojima mjerimo — svaka otvara drugi skup media queryja. */
const VIEWPORTS = [
  { name: 'telefon-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 900 },
];

/**
 * Način rada iz argumenata.
 *  • ništa / git-referenca → PUNO stablo kroz worktree (ispravno za svaku ciglu)
 *  • `--css-only <file>` ili putanja do postojeće datoteke → samo bundle (uz glasno upozorenje)
 */
function odabirNacina(argv) {
  const args = argv.slice(2);
  const i = args.indexOf('--css-only');
  if (i !== -1) return { css: true, arg: args[i + 1] || null };
  const a = args[0];
  if (a && fs.existsSync(path.resolve(ROOT, a)) && /\.css$/i.test(a)) return { css: true, arg: a };
  return { css: false, arg: a || 'HEAD' };
}

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
 * Referentna verzija u zasebnom radnom stablu.
 * `--detach` jer referenca zna biti grana koja je već negdje odjavljena (npr. `main`).
 */
function napraviWorktree(ref) {
  let sha;
  try {
    sha = execFileSync('git', ['rev-parse', '--verify', ref + '^{commit}'], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (e) {
    console.error('❌ Nepoznata git referenca: ' + ref);
    process.exit(2);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-diff-'));
  execFileSync('git', ['worktree', 'add', '--detach', '--quiet', dir, sha], { cwd: ROOT, stdio: 'ignore' });
  return { dir: dir, sha: sha, label: ref + ' (' + sha.slice(0, 7) + ')' };
}

function ocistiWorktree(wt) {
  if (!wt) return;
  try { execFileSync('git', ['worktree', 'remove', '--force', wt.dir], { cwd: ROOT, stdio: 'ignore' }); }
  catch (e) { console.warn('⚠️  worktree nije uklonjen: ' + wt.dir); }
}

/** Statički server nad zadanim stablom — UVIJEK skripta iz radnog stabla (v. zaglavlje). */
function pokreniServer(port, serveRoot) {
  const srv = spawn(process.execPath, [path.join(ROOT, 'scripts', 'static-server.js')], {
    cwd: ROOT,
    env: Object.assign({}, process.env, { PORT: String(port), SERVE_ROOT: serveRoot }),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return new Promise(function (resolve, reject) {
    const t = setTimeout(function () { reject(new Error('server se nije podigao na ' + port)); }, 15000);
    srv.stdout.on('data', function (d) { if (String(d).includes('static server on')) { clearTimeout(t); resolve(srv); } });
  });
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
  // PRIJELAZ nije isto sto i animacija: kad zavrsi, NESTANE iz `getAnimations()`. Zato ga
  // jedno mjerenje uhvati na pocetku, a drugo na kraju — i cookie-banner „promijeni izgled"
  // bez ijedne nase izmjene (mjereno: 1 lazna razlika na ~4 prolaza). Zato se svaki prijelaz
  // DOVRSI, a ne zamrzne na t=0: dovrseno stanje je ono sto korisnik vidi, i isto je bez
  // obzira na to kad smo pogledali. Beskonacne animacije (spinner) `finish()` odbija — one
  // se zamrznu na t=0, sto je deterministicno na obje strane.
  // ⚠️ Ovaj blok stoji DVAPUT (COLLECT i DETAIL) jer se funkcije serijaliziraju u preglednik
  // i ne mogu zatvoriti nad modulskim opsegom — isti razlog zbog kojeg je `pathOf` dvaput.
  // Mijenjaj OBA ili nijedan: razidju li se, sonda za detalje mjeri drugo stanje od usporedbe.
  document.getAnimations().forEach(function (a) {
    try { a.finish(); } catch (e) {
      try { a.currentTime = 0; a.pause(); } catch (e2) { /* neanimirano */ }
    }
  });

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
  // PRIJELAZ nije isto sto i animacija: kad zavrsi, NESTANE iz `getAnimations()`. Zato ga
  // jedno mjerenje uhvati na pocetku, a drugo na kraju — i cookie-banner „promijeni izgled"
  // bez ijedne nase izmjene (mjereno: 1 lazna razlika na ~4 prolaza). Zato se svaki prijelaz
  // DOVRSI, a ne zamrzne na t=0: dovrseno stanje je ono sto korisnik vidi, i isto je bez
  // obzira na to kad smo pogledali. Beskonacne animacije (spinner) `finish()` odbija — one
  // se zamrznu na t=0, sto je deterministicno na obje strane.
  // ⚠️ Ovaj blok stoji DVAPUT (COLLECT i DETAIL) jer se funkcije serijaliziraju u preglednik
  // i ne mogu zatvoriti nad modulskim opsegom — isti razlog zbog kojeg je `pathOf` dvaput.
  // Mijenjaj OBA ili nijedan: razidju li se, sonda za detalje mjeri drugo stanje od usporedbe.
  document.getAnimations().forEach(function (a) {
    try { a.finish(); } catch (e) {
      try { a.currentTime = 0; a.pause(); } catch (e2) { /* neanimirano */ }
    }
  });

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
  const nacin = odabirNacina(process.argv);
  const cur = fs.readFileSync(path.join(ROOT, BUNDLE), 'utf8');

  console.log('\n=== css-diff: izračunati stilovi, referenca vs radno stablo ===');

  let refCss = null;
  let wt = null;
  if (nacin.css) {
    refCss = referenceCss(nacin.arg);
    console.log('   referenca : ' + refCss.label + '  (' + (refCss.css.length / 1024).toFixed(1) + ' KB)');
    console.log('   radno     : ' + BUNDLE + '  (' + (cur.length / 1024).toFixed(1) + ' KB)');
    console.log('\n   ⚠️  SAMO-CSS NAČIN: premotava se isključivo `' + BUNDLE + '`, a HTML i JS');
    console.log('      ostaju iz radnog stabla. Za ciglu koja SELI VRIJEDNOST IZ MARKUPA U CSS');
    console.log('      ovaj način LAŽE — referentna strana je himera koja nikad nije postojala.');
    console.log('      Pusti bez argumenta za pošteno mjerenje cijelog stabla.\n');
  } else {
    wt = napraviWorktree(nacin.arg);
    console.log('   referenca : ' + wt.label + '  (cijelo stablo: HTML + JS + CSS)');
    console.log('   radno     : radno stablo\n');
  }

  const serveri = [];
  serveri.push(await pokreniServer(PORT, ROOT));
  if (wt) serveri.push(await pokreniServer(PORT_REF, wt.dir));

  const browser = await chromium.launch();
  let problems = 0;
  let elementsChecked = 0;
  try {
    for (const par of VIEWPORTS.flatMap((v) => RUTE.map((r) => [v, r]))) {
      const vp = { name: par[0].name + (par[1] ? '  ' + par[1] : ''), width: par[0].width, height: par[0].height };
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, serviceWorkers: 'block' });
      const page = await ctx.newPage();
      const url = 'http://localhost:' + PORT + '/' + par[1];
      const urlRef = wt ? ('http://localhost:' + PORT_REF + '/' + par[1]) : url;

      // Jedno mjesto koje zna ŠTO je referenca — inače bi se odluka ponovila na tri
      // mjesta (glavna usporedba + dvije sonde za detalje) i razišla pri prvoj izmjeni.
      const mjeriRef = function () { return measure(page, urlRef, wt ? null : refCss.css); };
      const mjeriRad = function () { return measure(page, url, null); };

      const before = await mjeriRef();
      const after = await mjeriRad();

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
        await mjeriRef();
        const a = await page.evaluate(DETAIL, probe);
        await mjeriRad();
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
      // U samo-CSS načinu je razlika u DOM-u očekivana (isti markup, druge skripte ne postoje).
      // U worktree načinu ZNAČI da se markup stvarno promijenio — što je za C4–C7 često
      // namjera, ali se mora vidjeti, a ne prešutjeti kao „gradi ih JS".
      if (onlyBefore || onlyAfter) {
        notes.push(wt
          ? 'MARKUP se razlikuje: ' + onlyBefore + ' samo u referenci, ' + onlyAfter + ' samo u radnom (provjeri je li namjerno)'
          : 'DOM se razlikuje: ' + onlyBefore + '/' + onlyAfter + ' elemenata (gradi ih JS, nije CSS)');
      }
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
          const probe = diffStd.slice(0, KAP);
          await mjeriRef();
          const a = await page.evaluate(DETAIL, probe);
          await mjeriRad();
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
          if (diffStd.length > KAP) {
            console.log('      … i još ' + (diffStd.length - KAP) + ' elemenata' +
              '  (CSS_DIFF_ALL=1 ispisuje sve)');
          }
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    serveri.forEach(function (srv) { srv.kill(); });
    // Worktree se uklanja UVIJEK, i kad je mjerenje puklo — inače ostaje smeće u tempu
    // i `git worktree list` se puni mrtvim unosima.
    ocistiWorktree(wt);
  }

  console.log('\n   mjereno na rutama: ' + RUTE.map((r) => (r || '/')).join(' · ') +
    (RUTE.length === 1 && !RUTE[0]
      ? '   ⚠️ sadržaj koji crta JS pri ulasku u rutu NIJE uspoređen (CSS_DIFF_RUTE=…)'
      : ''));
  console.log('\n' + (problems === 0
    ? '✅ Nijedan element nije promijenio prikaz (' + elementsChecked + ' usporedbi kroz ' + VIEWPORTS.length + ' širine).'
    : '⚠️  ' + problems + ' razlika u prikazu — pročitaj ih prije nego proglasiš ciglu gotovom.'));
  process.exit(problems === 0 ? 0 : 1);
})();
