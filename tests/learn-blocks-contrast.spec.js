// TINTE AUTORA SE MJERE NA EKRANU, U SVE ČETIRI TEME.
//
// ZAŠTO OVAJ TEST POSTOJI (a ne oslanjamo se na postojeće brane):
//
//   1. `check:contrast` čita `css/tokens.css` i dokazuje da VRIJEDNOST tokena prolazi AA.
//      Ne zna KORISTI li ju itko — `.lb-color-amber` je do 2026-08-31 imao zakucan `#fbbf24`
//      i token je bio posve nevažan.
//   2. `check:contrast:live` mjeri stvarni ekran, ali obilazi rute predmeta `te2`, a na
//      KATALOŠKIM learn-rutama se `lb-*` blokovi uopće ne crtaju: gradivo je v1 HTML kroz
//      DOMPurify. Izmjereno na četiri predmeta (te2, statistics, geography, accounting) —
//      iscrtaju se samo `.lb-legacy` i `.lb-table-wrap`. Ostala 42 pravila datoteke žive u
//      editoru i u korisnikovim materijalima.
//   3. `check:palette` prepoznaje fatalno samo kad su boja i pozadina u ISTOM pravilu.
//      Tekst bez vlastite pozadine — dakle najčešći slučaj koji postoji — njegova je
//      slijepa točka. Baš tu su te boje i stajale.
//
// ⇒ Nijedna od tri ne bi pala dok je jantar na bijelom mjerio 1.67. Ovaj test zatvara rupu
//   tako da blokove NACRTA kroz `window.renderBlocks` (isti ulaz koji koristi
//   `tests/learn-parity.spec.js`) u pravi spremnik učenja, pa mjeri iscrtano.
//
// ⚠️ MJERI SE EFEKTIVNA PODLOGA, ne `background` elementa: tekstualni span je proziran, pa
//    se hoda prema gore do prvog neprozirnog pretka. Mjerač koji uzme `rgba(0,0,0,0)` kao
//    podlogu vraća uvjerljiv besmisao umjesto da padne.

const { test, expect } = require('@playwright/test');

const TEME = ['paper', 'chalk', 'academic', 'mint'];
const TONOVI = ['red', 'amber', 'green', 'cyan', 'blue', 'indigo', 'violet', 'pink'];
const AA = 4.5;

test('tinte autora prolaze AA u sve četiri teme (mjereno na iscrtanom bloku)', async ({ page }) => {
  const greske = [];
  page.on('pageerror', (e) => greske.push('pageerror: ' + e.message));

  await page.goto('/#/subject/te2/first-midterm/learn');
  await page.waitForFunction(() => typeof window.renderBlocks === 'function', null, { timeout: 20000 });

  // ⚠️ ČEKA SE STANJE, NE ROK. Gradivo se učitava lijeno (DB → JSON → .js) i kad stigne,
  // PREPIŠE `#learnContent`. Prva verzija ovog testa injektirala je odmah: tri teme su
  // prošle, a četvrta našla NULA elemenata jer je učitavač u međuvremenu pojeo uzorak.
  // Uvjet je namjerno neovisan o onome što se mjeri — čekanje koje pretpostavi ishod ne
  // može pasti.
  await page.waitForFunction(() => {
    const h = document.querySelector('#learnContent') || document.querySelector('.learn-content');
    if (!h) return false;
    const n = h.innerHTML.length;
    const prije = window.__lbZadnji;
    window.__lbZadnji = n;
    return n > 0 && prije === n;
  }, null, { timeout: 25000, polling: 400 });

  // Uzorak ide u VLASTITI spremnik uz `#learnContent`, ne u njega: aplikacija tom čvoru
  // postavlja `innerHTML`, pa bi svaki njezin re-render pojeo uzorak. Kao sibling dijeli
  // istu plohu i tipografiju, a preživi. Crta se iznova u SVAKOJ temi — ako ga ipak nešto
  // odnese, pada tvrdnja o broju elemenata, a ne mjerenje koje bi tiho vratilo prazno.
  const crtaj = (tonovi) => page.evaluate((t) => {
    const host = document.querySelector('#learnContent') || document.querySelector('.learn-content');
    if (!host || !host.parentElement) return -1;
    let proba = document.querySelector('#lbProba');
    if (!proba) {
      proba = document.createElement('div');
      proba.id = 'lbProba';
      host.parentElement.appendChild(proba);
    }
    const runs = t.map((x) => ({ text: 'Uzorak ' + x + ' ', color: x }));
    proba.innerHTML = window.renderBlocks([{ type: 'paragraph', text: runs }]);
    return proba.querySelectorAll('[class*="lb-color-"]').length;
  }, tonovi);

  expect(await crtaj(TONOVI), 'blokovi se moraju STVARNO nacrtati — inače test mjeri prazan ekran')
    .toBe(TONOVI.length);

  for (const tema of TEME) {
    expect(await crtaj(TONOVI), 'tema ' + tema + ': uzorak mora postojati prije mjerenja')
      .toBe(TONOVI.length);
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), tema);
    // Promjena teme pokreće prijelaze boje; dovršavaju se, ne čeka se na sreću (isti nalaz
    // koji je `check:contrast:live` platio prvim mjerenjem).
    await page.waitForTimeout(250);
    await page.evaluate(() => { document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* ne da se */ } }); });

    const nalaz = await page.evaluate(() => {
      const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      const Lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const rgb = (s) => { const m = String(s).match(/(\d+(?:\.\d+)?)/g); return m ? m.slice(0, 3).map(Number) : null; };
      const alfa = (s) => { const m = String(s).match(/rgba?\([^)]*?,\s*([\d.]+)\s*\)$/); return m ? parseFloat(m[1]) : 1; };
      // prvi NEPROZIRAN predak = stvarna podloga teksta
      const podloga = (el) => {
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && bg !== 'transparent' && alfa(bg) > 0.95) return rgb(bg);
        }
        return rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255];
      };
      const out = [];
      document.querySelectorAll("#lbProba [class*=\"lb-color-\"]").forEach((el) => {
        const f = rgb(getComputedStyle(el).color);
        const b = podloga(el);
        if (!f || !b) return;
        const l1 = Lum(f), l2 = Lum(b);
        out.push({
          ton: (el.className.match(/lb-color-([a-z]+)/) || [])[1],
          cr: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
          boja: getComputedStyle(el).color,
        });
      });
      return out;
    });

    expect(nalaz.length, 'tema ' + tema + ': mjerač mora dotaknuti svih 8 tonova').toBe(TONOVI.length);
    for (const n of nalaz) {
      expect(
        n.cr,
        'tema ' + tema + ', ton ' + n.ton + ' (' + n.boja + '): kontrast ' + n.cr.toFixed(2) + ' < ' + AA
      ).toBeGreaterThanOrEqual(AA);
    }
  }

  expect(greske, 'nema JS grešaka pri renderu blokova').toEqual([]);
});
