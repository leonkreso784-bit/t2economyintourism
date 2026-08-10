// Layout-regression guard (FOUNDATION_PLAN F1, brick 1D.3). DETERMINISTIČAN (geometrija, ne pikseli) →
// platform-neovisan, zelen u CI-u bez baseline-slika. Hvata točno BUG-015 klasu: dodavanje nav-elementa
// (npr. 🌐 toggle) prelomi tijesni landing-nav na nekoj širini i CTA „Start" se odreže.
//
// Pixel-perfect toHaveScreenshot je odvojen follow-up (treba Linux baseline; vidi BACKLOG).
const { test, expect } = require('@playwright/test');

// ⚠️ Uzorak širina MORA pokrivati okolinu svakog praga u css/landing.css, inače test bude zelen nad
// rupom. Konkretno: prije C0 je popis skakao s 1024 na 1280, pa je pojas u kojem se sidreni linkovi
// vraćaju u traku bio NEGLEDAN — na 1200px je HR CTA izlazio 14px izvan ekrana, a suita zelena.
// Kad mijenjaš prag u CSS-u, dodaj ovdje prag i prag+1.
const WIDTHS = [320, 360, 361, 390, 400, 401, 414, 480, 481, 600, 720, 768, 860, 960, 1024, 1100, 1200,
                1280, 1281, 1366, 1440];
const LANGS = ['en', 'hr'];

test('landing nav: no overflow and CTA never clipped across widths x languages', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iPhone-SE-375', 'layout sweep se vrti jednom');

  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('/');
  await page.waitForSelector('.landing-nav .nav-cta');

  for (const lang of LANGS) {
    await page.evaluate((l) => window.setUiLang(l, true), lang);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(60); // pusti reflow/applyTranslations

      // 1) Nema horizontalnog overflowa cijele stranice.
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, `overflow @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);

      // 2) CTA „Start" je vidljiv i NIJE odrezan (desni rub unutar viewporta, sadržaj stane u gumb).
      const cta = await page.$('.landing-nav .nav-cta');
      const box = await cta.boundingBox();
      expect(box, `CTA bez box-a @ ${w}px / ${lang}`).not.toBeNull();
      expect(box.width, `CTA širina 0 @ ${w}px / ${lang}`).toBeGreaterThan(0);
      expect(box.x + box.width, `CTA desni rub izvan viewporta @ ${w}px / ${lang}`).toBeLessThanOrEqual(w + 1);
      expect(box.x, `CTA lijevi rub izvan viewporta @ ${w}px / ${lang}`).toBeGreaterThanOrEqual(-1);

      // 3) Tekst CTA-a nije „odrezan" unutar gumba (scrollWidth <= clientWidth).
      const clipped = await cta.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      expect(clipped, `CTA tekst odrezan @ ${w}px / ${lang}`).toBe(false);
    }
  }

  await page.evaluate(() => window.setUiLang('en', true)); // vrati default
  expect(errors).toEqual([]);
});
