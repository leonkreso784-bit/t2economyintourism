// Layout-regression guard (FOUNDATION_PLAN F1, brick 1D.3). DETERMINISTIČAN (geometrija, ne pikseli) →
// platform-neovisan, zelen u CI-u bez baseline-slika. Hvata točno BUG-015 klasu: dodavanje nav-elementa
// (npr. 🌐 toggle) prelomi tijesni landing-nav na nekoj širini i odredište se odreže ili podvuče
// pod susjeda.
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

test('traka: odredišta nikad odrezana, nikad preklopljena, i ulaz u katalog uvijek postoji', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iPhone-SE-375', 'layout sweep se vrti jednom');

  // ⚠️ PREDMET TVRDNJE JE PROMIJENJEN 2026-09-08, NIJE OSLABLJEN. Do tada je test čuvao
  // `.topbar-cta` („Počni učiti"), a taj je gumb obrisan — Leon: *„najbeskorisnije smeće
  // koje zauzima prostor gore. Gore treba biti profil i UGC."* Da je test samo obrisan s
  // njim, izgubila bi se zaštita koja je nastala iz BUG-029, a ona se nikad nije ticala
  // CTA-a nego GEOMETRIJE TRAKE: na 320 px se `.topbar-nav` stisnuo na nulu i „Predmeti"
  // su isplivali POD prekidač jezika, pa je klik na odredište PREBACIVAO JEZIK.
  //
  // Stari test taj kvar zapravo NE BI UHVATIO — mjerio je samo vlastiti okvir CTA-a, a
  // preklop je odnos DVAJU elemenata. Zato ova inačica mjeri ono što je BUG-029 stvarno
  // bio: nijedan par vidljivih gumba u traci se ne smije preklapati, ni na jednoj širini,
  // ni na jednom jeziku. Traka sad nosi dva odredišta umjesto jednog CTA-a, pa je prilika
  // za taj kvar veća nego prije, ne manja.
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('/');
  await page.waitForSelector('.topbar #topbarMaterials');

  for (const lang of LANGS) {
    await page.evaluate((l) => window.setUiLang(l, true), lang);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(60); // pusti reflow/applyTranslations

      // 1) Nema horizontalnog overflowa cijele stranice.
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, `overflow @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);

      // 2) „Moji materijali" su ODREDIŠTE i stoje na SVAKOJ širini. Nemaju prag ispod kojeg
      //    nestaju — to je bila iznimka CTA-a, koja je otišla s njim. Gumb ne treba JS
      //    (`data-goto-materials` hvata delegat), pa se smije tražiti bezuvjetno.
      const mat = await page.$('.topbar #topbarMaterials');
      expect(mat, `nema #topbarMaterials @ ${w}px / ${lang}`).not.toBeNull();
      expect(await mat.isVisible(), `#topbarMaterials nevidljiv @ ${w}px / ${lang}`).toBe(true);
      const mb = await mat.boundingBox();
      expect(mb.width, `#topbarMaterials širina 0 @ ${w}px / ${lang}`).toBeGreaterThan(0);
      expect(mb.x + mb.width, `#topbarMaterials desni rub izvan viewporta @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);
      expect(mb.x, `#topbarMaterials lijevi rub izvan viewporta @ ${w}px / ${lang}`).toBeGreaterThanOrEqual(-1);
      const rezano = await mat.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      expect(rezano, `#topbarMaterials tekst odrezan @ ${w}px / ${lang}`).toBe(false);

      // 3) BUG-029: nijedan par vidljivih gumba u traci se ne preklapa.
      //    ⚠️ Profil (`#authNavBtn`) se OTKRIVA iz `js/auth.js` i ovisi o CDN-u supabase-js
      //    (tihi fallback). Zato ulazi u mjeru SAMO kad je vidljiv — inače bi mrežni
      //    ispad davao crveni CI koji ne govori ništa o rasporedu. Njegovu VIDLJIVOST
      //    pokrivaju auth-testovi; ovdje se mjeri isključivo geometrija.
      const preklopi = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('.topbar-actions > button'))
          .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().width > 0);
        const out = [];
        for (let i = 0; i < els.length; i++) {
          for (let j = i + 1; j < els.length; j++) {
            const a = els[i].getBoundingClientRect();
            const b = els[j].getBoundingClientRect();
            const dijele = a.left < b.right - 1 && b.left < a.right - 1
                        && a.top < b.bottom - 1 && b.top < a.bottom - 1;
            if (dijele) out.push((els[i].id || els[i].className) + ' × ' + (els[j].id || els[j].className));
          }
        }
        return out;
      });
      expect(preklopi, `gumbi u traci se preklapaju @ ${w}px / ${lang}`).toEqual([]);

      // 4) Ulaz u KATALOG više ne stoji u traci nigdje, pa vrata u herou nisu više
      //    zamjena za širine ispod praga — ona su JEDINI stalni ulaz i moraju stajati
      //    na SVAKOJ širini. Tvrdnja je time bezuvjetna, dakle stroža nego prije.
      const vrata = await page.$('.doors .door--primary.start-trigger');
      expect(vrata, `nema vrata u herou @ ${w}px / ${lang}`).not.toBeNull();
      expect(await vrata.isVisible(), `vrata u herou nisu vidljiva @ ${w}px / ${lang}`).toBe(true);
      const vb = await vrata.boundingBox();
      expect(vb.width, `vrata širina 0 @ ${w}px / ${lang}`).toBeGreaterThan(0);
      expect(vb.x + vb.width, `vrata izvan viewporta @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);
    }
  }

  await page.evaluate(() => window.setUiLang('en', true)); // vrati default
  expect(errors).toEqual([]);
});
