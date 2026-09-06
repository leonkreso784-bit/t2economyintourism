// ═════════════════════════════════════════════════════════════════════════════
// BOČNE TRAKE PREDMETA NEMA — i ne smije se vratiti prijepisom.
//
// Do 2026-09-06 je ovdje stajala provjera A3 („sidebar se renderira iz catalog-a i klik
// navigira na lekcije"). Bila je ZELENA cijelo vrijeme dok je panel bio NEDOSTIŽAN:
// `openSidebar()` nije imao nijednog pozivatelja (nalaz C6/2, 2026-09-01), pa ga je test
// otvarao SAM — jedini korisnik te trake bio je ovaj spec. Leon je anketom 2026-09-06
// presudio: OBRISATI (do svakog predmeta se dolazi landingom i browseom).
//
// ⚠️ ZAŠTO BRANA OSTAJE, A NE SAMO BRISANJE DATOTEKE: mrtva površina se najlakše vraća
// PRIJEPISOM — netko kopira stari markup ili staru funkciju iz gita „jer je već postojala",
// i platforma tiho dobije natrag ekran koji nitko ne otvara i koji nijedna druga brana ne
// mjeri. Zato ovdje sad stoji tvrdnja o ODSUTNOSTI, i to na dva neovisna načina:
//   ① STATIČKI — trag bočne trake ne postoji u izvoru (markup · CSS · JS · i18n);
//   ② ŽIVI — na učitanoj stranici nema ni elementa ni globalne funkcije.
// Sam ① bi propustio traku koju crta JavaScript u runtimeu; sam ② bi propustio mrtav
// CSS/markup koji se ne iscrta. Uz njih ide JEDNA POZITIVNA tvrdnja (landing i dalje crta
// predmete iz kataloga) — brana koja mjeri samo odsutnost prolazi i nad ruševinom.
//
// KOMENTARI SE NE BROJE: nadgrobni zapisi u `index.html` i `js/navigation.js` NAMJERNO
// spominju `openSidebar()` — oni objašnjavaju zašto trake nema. Zato se izvor prije
// mjerenja očisti od komentara (isto načelo kao `scripts/css-debt.js`: komentar nije pravilo).
// ═════════════════════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/** Sve po čemu se bočna traka prepoznaje — klase, id-evi, funkcije, i18n ključ, modul. */
const TRAGOVI = [
  'subjects-sidebar', 'subjectsSidebar',
  'subjects-overlay', 'subjectsOverlay',
  'subjects-list', 'subjectsList',
  'sidebar-header', 'sidebar-content', 'sidebar-logo', 'close-sidebar-btn',
  'subject-item',
  'openSidebar', 'closeSidebar', 'renderSubjectsSidebar',
  'sidebar.choose', 'sidebar.css',
];
// ⚠️ `subject-arrow` NIJE na popisu, i to je nalaz iz prvog pokretanja ove brane: strelica
// bočne trake zvala se `.subject-arrow`, ali živa landing-kartica ima `.landing-subject-arrow`
// — traženje PODNISKE javilo je tri lažna pogotka (`landing.css`, `navigation.js`, bundle).
// Ista pouka kao u `tint-ink.spec.js`: trag po IMENU hvata i ono što nije iste vrste. Strelica
// ionako ne može preživjeti sama: bez `.subject-item` iz istog popisa nema je gdje objesiti.

function bezKomentara(src, vrsta) {
  if (vrsta === 'html') return src.replace(/<!--[\s\S]*?-->/g, '');
  if (vrsta === 'css') return src.replace(/\/\*[\s\S]*?\*\//g, '');
  // JS: blok-komentari + redci koji su CIJELI komentar. Unutarnji `//` se ne dira, da se
  // ne pojede `https://` u stringu — takav redak ionako nije komentar.
  return src.replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').filter((r) => !/^\s*\/\//.test(r)).join('\n');
}

function jsDatoteke(dir, out) {
  for (const ime of fs.readdirSync(dir)) {
    const p = path.join(dir, ime);
    if (fs.statSync(p).isDirectory()) jsDatoteke(p, out);
    else if (ime.endsWith('.js')) out.push(p);
  }
  return out;
}

test('① bočne trake nema u izvoru — ni markup, ni CSS, ni JS, ni i18n', () => {
  expect(fs.existsSync(path.join(ROOT, 'css', 'sidebar.css')),
    'css/sidebar.css je natrag — modul obrisane površine').toBe(false);

  const mete = [
    { p: 'index.html', vrsta: 'html' },
    { p: 'styles.bundle.css', vrsta: 'css' },
  ];
  for (const f of fs.readdirSync(path.join(ROOT, 'css'))) {
    if (f.endsWith('.css')) mete.push({ p: 'css/' + f, vrsta: 'css' });
  }
  for (const p of jsDatoteke(path.join(ROOT, 'js'), [])) {
    mete.push({ p: path.relative(ROOT, p).split(path.sep).join('/'), vrsta: 'js' });
  }

  const nalazi = [];
  for (const m of mete) {
    const puna = path.join(ROOT, m.p);
    if (!fs.existsSync(puna)) continue;
    const kod = bezKomentara(fs.readFileSync(puna, 'utf8'), m.vrsta);
    for (const trag of TRAGOVI) {
      if (kod.includes(trag)) nalazi.push(m.p + ' → ' + trag);
    }
  }

  // ⚠️ Mjera mora reći i KOLIKO je dotaknula: brana koja ne nađe nijednu datoteku prolazi
  // lažno (prvi kvar 12× u fazi redizajna bio je upravo mjerač koji nije mjerio ništa).
  expect(mete.length, 'nijedna datoteka nije pregledana — brana bi prošla prazna')
    .toBeGreaterThan(30);
  expect(nalazi, 'bočna traka je natrag u izvoru (prijepis iz gita?)').toEqual([]);
});

test('② bočne trake nema na učitanoj stranici — ni elementa, ni globalne funkcije', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  // Pozitivna tvrdnja PRVA: katalog se i dalje crta. Bez nje bi sve niže prošlo i nad
  // stranicom koja se uopće nije podigla.
  await page.waitForFunction(
    () => window.SOKRAT_CATALOG
      && document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0,
    null, { timeout: 15000 }
  );

  const stanje = await page.evaluate(() => ({
    elemenata: document.querySelectorAll(
      '.subjects-sidebar, #subjectsSidebar, .subjects-overlay, #subjectsOverlay, '
      + '#subjectsList, .subjects-list, .subject-item, .close-sidebar-btn'
    ).length,
    globali: ['openSidebar', 'closeSidebar', 'renderSubjectsSidebar']
      .filter((k) => typeof window[k] !== 'undefined'),
    predmeta: document.querySelectorAll('#landingSubjects .landing-subject-card').length,
  }));

  expect(stanje.elemenata, 'element bočne trake je natrag u DOM-u').toBe(0);
  expect(stanje.globali, 'globalna funkcija bočne trake je natrag na `window`').toEqual([]);
  expect(stanje.predmeta, 'vitrina landinga je prazna — rez je odnio više nego traku')
    .toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
