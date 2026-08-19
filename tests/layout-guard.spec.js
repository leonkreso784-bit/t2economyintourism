// Layout-regression guard (FOUNDATION_PLAN F1, brick 1D.3). DETERMINISTIČAN (geometrija, ne pikseli) →
// platform-neovisan, zelen u CI-u bez baseline-slika. Hvata točno BUG-015 klasu: dodavanje nav-elementa
// (npr. 🌐 toggle) prelomi tijesni landing-nav na nekoj širini i CTA „Start" se odreže.
//
// Pixel-perfect toHaveScreenshot je odvojen follow-up (treba Linux baseline; vidi BACKLOG).
const { test, expect } = require('@playwright/test');

// ⚠️ Uzorak širina MORA gaziti okolinu SVAKOG praga u css/landing.css, inače test bude zelen nad
// rupom. Dvije neovisne sesije su na tome nasjele istog dana, svaka na svoju rupu:
//   • popis je skakao s 1024 na 1280 → prag 1100 je PROŠAO test, a na 1200px je HR izlazio 14px van;
//   • popis nije imao 861 → prag „ulaz = ikona do 1239px" je prošao, a na 861px je HR visio 8.8px van.
// Zato: svaki prag iz CSS-a ide ovdje ZAJEDNO s prag+1 (granica se ponaša drukčije s obje strane).
//
// C2 je pragove PROMIJENIO — stari popis (400 · 480 · 560 · 720 · 1120 · 1280) opisivao je
// landing kojeg više nema. Novi `css/landing.css` ima: 480 (wordmark odlazi), 544 (demo 2
// stupca), 704 (vrata 2 stupca), 896 (demo dvodijelan), 1024 (katalog 3 stupca) — plus
// `clamp()` na rubovima, koji nema prag nego teče. Sve su ovdje s ±1.
const WIDTHS = [320, 360, 361, 390, 400, 414, 479, 480, 481, 543, 544, 545, 560, 600, 703, 704, 705,
                768, 860, 861, 895, 896, 897, 900, 960, 1023, 1024, 1025, 1100, 1200, 1280, 1366, 1440];
const LANGS = ['en', 'hr'];

test('landing nav: no overflow and CTA never clipped across widths x languages', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iPhone-SE-375', 'layout sweep se vrti jednom');

  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('/');
  await page.waitForSelector('.topbar .topbar-cta');

  for (const lang of LANGS) {
    await page.evaluate((l) => window.setUiLang(l, true), lang);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(60); // pusti reflow/applyTranslations

      // 1) Nema horizontalnog overflowa cijele stranice.
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, `overflow @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);

      // 2) ULAZ „počni učiti" MORA POSTOJATI — ali od K3a ne nužno u traci.
      //
      // ⚠️ TVRDNJA JE PROMIJENJENA, NIJE OSLABLJENA (K3a, BUG-029). Do K3 je test tražio
      // CTA u traci na SVIM širinama, uključujući 320. To je bilo točno dok je traka na
      // 320 px imala mjesta — a nije: `.topbar-nav` se stiskao na širinu 0 i „Predmeti"
      // su isplivali POD prekidač jezika, pa je klik na njih prebacivao jezik. Popravak
      // je maknuo CTA ispod 360 px, jer su ulaz na landingu **vrata u herou** (ista
      // odluka koja je odande maknula „Moje materijale").
      //
      // Novi oblik je JAČI: čuva staru zaštitu ondje gdje se CTA crta, a ondje gdje se ne
      // crta traži da ulaz i dalje postoji. Test bi propustio da smo zabunom sakrili CTA
      // na 400 px — `expect(w).toBeLessThan(360)` to ne dopušta.
      const cta = await page.$('.topbar .topbar-cta');
      const uTraci = cta ? await cta.isVisible() : false;

      if (uTraci) {
        const box = await cta.boundingBox();
        expect(box, `CTA bez box-a @ ${w}px / ${lang}`).not.toBeNull();
        expect(box.width, `CTA širina 0 @ ${w}px / ${lang}`).toBeGreaterThan(0);
        expect(box.x + box.width, `CTA desni rub izvan viewporta @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);
        expect(box.x, `CTA lijevi rub izvan viewporta @ ${w}px / ${lang}`).toBeGreaterThanOrEqual(-1);

        // 3) Tekst CTA-a nije „odrezan" unutar gumba (scrollWidth <= clientWidth).
        const clipped = await cta.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
        expect(clipped, `CTA tekst odrezan @ ${w}px / ${lang}`).toBe(false);
      } else {
        // Nestati smije SAMO ondje gdje je tako odlučeno.
        expect(w, `CTA nestao iz trake na širini na kojoj bi trebao stajati @ ${w}px / ${lang}`).toBeLessThan(360);

        // …i samo ako ulaz preživi drugdje. Vrata u herou su primarni `.start-trigger`.
        const vrata = await page.$('.doors .door--primary.start-trigger');
        expect(vrata, `nema vrata u herou @ ${w}px / ${lang}`).not.toBeNull();
        expect(await vrata.isVisible(), `vrata u herou nisu vidljiva @ ${w}px / ${lang}`).toBe(true);
        const vb = await vrata.boundingBox();
        expect(vb.width, `vrata širina 0 @ ${w}px / ${lang}`).toBeGreaterThan(0);
        expect(vb.x + vb.width, `vrata izvan viewporta @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);
      }
    }
  }

  await page.evaluate(() => window.setUiLang('en', true)); // vrati default
  expect(errors).toEqual([]);
});
