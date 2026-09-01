// GLIF NA PLOČICI U BOJI PREDMETA — mjereno u PREGLEDNIKU, kroz sve teme.
//
// Zašto uz `npm run check:contrast`, a ne umjesto njega: statički gate dokazuje da je
// PALETA ispravna (postoji čitljiva tinta za svaku boju iz `data/catalog.js`), ali ne zna
// koristi li je CSS. Točno ta razlika je pustila kvar iz §7.9 — ispravna paleta i pogrešna
// upotreba gateu izgledaju jednako. Ovdje se čita IZRAČUNATA boja glifa i STVARNA pozadina
// pločice, pa se kontrast računa iz onoga što korisnik vidi.
//
// Povod (2026-08-15): pločica je nosila tintu izračunatu za boju MARKE (`--color-on-brand`),
// a u bočnoj traci čak ZAKUCANO `color: white`. Izmjereno: bijelo na `#f59e0b` = 2.15, i tu
// boju nosi 5 predmeta — 10 od 24 predmeta bilo je ispod praga 3:1 u zadanoj temi.
// Tvrda zabrana #1 to nije uhvatila jer traži bijelo na `var(--primary)`, a ova ploha nije
// token nego inline gradijent iz podatka.
const { test, expect } = require('@playwright/test');

const UI_MIN = 3.0;  // WCAG 1.4.11 — glif je grafički element, ne tekst
const TEME = ['academic', 'chalk', 'mint'];

/** Kontrast iz dva `rgb(...)` stringa koje vraća `getComputedStyle`. */
function kontrastIzCss(a, b) {
  const px = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const d = m[1].split(/[,\s/]+/).map(Number);
    return [d[0], d[1], d[2]];
  };
  const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (r) => 0.2126 * lin(r[0]) + 0.7152 * lin(r[1]) + 0.0722 * lin(r[2]);
  const x = px(a), y = px(b);
  if (!x || !y) return null;
  const l1 = lum(x), l2 = lum(y);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Pročitaj boju glifa i PRVU boju gradijenta pločice za svaku pločicu iz `sel`.
 * Gradijent se ne da pročitati kao `backgroundColor`, pa se prva postaja vadi iz
 * `backgroundImage` — to je ista vrijednost koju renderer upisuje iz kataloga.
 */
async function ocitajPlocice(page, sel) {
  return page.$$eval(sel, (els) => els.map((el) => {
    const cs = getComputedStyle(el);
    const glif = el.querySelector('i');
    const prvaPostaja = (cs.backgroundImage.match(/rgba?\([^)]+\)/) || [])[0] || cs.backgroundColor;
    return {
      ink: el.getAttribute('data-ink'),
      boja: glif ? getComputedStyle(glif).color : cs.color,
      ploha: prvaPostaja,
      // ⚠️ Ključ se traži na PRETKU, ne na samoj pločici: id predmeta nosi kartica/redak,
      // a pločica je dijete. Prva verzija ga je tražila na pločici i svaka poruka o padu
      // glasila je „?" — poruka koja ne imenuje krivca tjera te da pad tražiš ručno.
      kljuc: el.closest('[data-subject],[data-landing-subject],[data-id]')?.getAttribute('data-subject')
        || el.closest('[data-landing-subject]')?.getAttribute('data-landing-subject')
        || el.closest('[data-id]')?.getAttribute('data-id') || '?'
    };
  }));
}

function provjeri(plocice, gdje, tema) {
  expect(plocice.length, `${gdje} (${tema}): nijedna pločica nije nacrtana — test bi prošao lažno`).toBeGreaterThan(0);
  for (const p of plocice) {
    expect(p.ink, `${gdje} (${tema}) ${p.kljuc}: nema data-ink → tinta se ne bira izračunom`).toMatch(/^(dark|light)$/);
    const k = kontrastIzCss(p.boja, p.ploha);
    expect(k, `${gdje} (${tema}) ${p.kljuc}: boje se ne daju pročitati (${p.boja} / ${p.ploha})`).not.toBeNull();
    expect(k, `${gdje} (${tema}) ${p.kljuc}: glif ${p.boja} na ${p.ploha} = ${k?.toFixed(2)} < ${UI_MIN}`)
      .toBeGreaterThanOrEqual(UI_MIN);
  }
}

for (const tema of TEME) {
  test(`pločice predmeta: glif je čitljiv na landingu i u traci — tema ${tema}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), tema);
    await page.waitForFunction(
      () => document.querySelectorAll('#landingSubjects .landing-subject-icon').length > 0
        && document.querySelectorAll('#subjectsList .subject-item-icon').length > 0
    );

    // ⚠️ ＋ PLOČICA („Tvoj predmet", od 2026-08-16) SE IZUZIMA, i to nije izvlačenje.
    // Ovaj gate provjerava JEDNO pravilo: da se tinta glifa bira IZRAČUNOM iz boje
    // predmeta (`inkForTint()` → `data-ink`). ＋ pločica nema boju predmeta — ploha
    // joj je `--color-surface-2`, a glif `--color-ink-2`, oboje TOKENI. Taj par već
    // mjeri `check:contrast` kroz svih 5 tema (`--color-ink-2` je u `AS_TEXT`,
    // `--color-surface-2` u `SURFACES`), pa bi traženje `data-ink` na njoj značilo
    // tražiti izračun ondje gdje nema što računati.
    //
    // POVOD: kad je ＋ pločica dodana, naslijedila je klasu `landing-subject-icon` i
    // ovaj ju je selektor pokupio → svih 16 tema-testova palo je s „nema data-ink".
    // Zapisano jer je pouka šira: SELEKTOR PO IZGLEDU (klasa) HVATA I ONO ŠTO NIJE
    // ISTE VRSTE. Da je selektor od početka gađao `[data-ink]`, pada ne bi bilo — ali
    // ni gatea, jer bi element bez atributa tiho ispao iz mjerenja. Ovako je glasno.
    provjeri(await ocitajPlocice(page, '#landingSubjects .landing-subject-icon:not(.landing-subject-icon--make)'), 'landing', tema);
    provjeri(await ocitajPlocice(page, '#subjectsList .subject-item-icon'), 'bočna traka', tema);
  });
}

test('pločice predmeta: glif je čitljiv i u Browse drill-downu', async ({ page }) => {
  // Browse je jedina od tri površine gdje pločica NIJE uvijek boja predmeta — fakultet,
  // program i godina nose marku i legitimno drže `--on-primary`. Zato se ovdje traže samo
  // kartice PREDMETA; da se traže sve, test bi padao na ispravnom ponašanju.
  await page.goto('/');
  await page.waitForFunction(() => window.enterBrowse);
  await page.click('.doors .door--primary');
  await page.waitForSelector('.browse-card[data-browse="faculty"]');
  await page.click('.browse-card[data-browse="faculty"]');
  await page.waitForSelector('.browse-card[data-browse="program"]');
  await page.click('.browse-card[data-browse="program"]');
  await page.waitForSelector('.browse-card[data-browse="year"]');
  await page.click('.browse-card[data-browse="year"]');
  await page.waitForSelector('.browse-card[data-browse="subject"]');

  provjeri(
    await ocitajPlocice(page, '.browse-card[data-browse="subject"] .browse-card-icon'),
    'browse',
    'zadana'
  );
});
