// F2/5b — RADIONICA: redak stabla „Mojih materijala" (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Izmjereno 14.09. snimkom na 393 px: svaki redak nosio je PET ikona, a ime materijala bilo je
// odrezano na 6–8 znakova. Leon (anketa 14.09.): redak = ikona u boji + PUNO ime + jedan „⋯";
// dodir na materijal = UČENJE (isto kao pločica na zidu); na telefonu se ne povlači.
// Ovaj spec tvrdi ono što se VIDI i DODIRNE:
//   ① dodir na materijal ga otvara za učenje; dodir na mapu je otvara/zatvara; prazna mapa → „⋯";
//   ② „⋯" nudi točno radnje svoje vrste, ne izlazi iz ekrana i ne reže ga stablo; Escape ga
//     zatvara i vraća fokus na „⋯";
//   ③ telefon (dodir): nema ručke, ime od 120 znakova je CIJELO (lomi se, ne reže), „⋯" je 44×44.
// Postojeći tokovi (preimenuj · obriši · povuci) žive u `my-materials.authed.spec.js` i idu kroz
// „⋯" (`tests/helpers/izbornik-retka.js`).
//
// ⚠️ PIŠE na STAGING (create_node) i briše za sobom (delete_node, soft) u `finally`.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

async function openMaterials(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => !!window.SokratMaterials && window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

const mk = (page, parent, kind, name) =>
  page.evaluate(([p, k, n]) => window.SokratMaterials.createNode(p, k, n), [parent, kind, name]);
const rm = (page, ids) => page.evaluate(async (list) => {
  for (const id of list) if (id) await window.SokratMaterials.deleteNode(id).catch(() => {});
}, ids);
const redak = (page, id) => page.locator('#myMaterials .mm-row[data-mm-id="' + id + '"]');

test.describe('F2/5b — redak radionice (stolno)', () => {
  test('① dodir: materijal → učenje · mapa → otvori/zatvori · prazna mapa → „⋯"', async ({ page }) => {
    await openMaterials(page);
    const oznaka = Date.now();
    const F = await mk(page, null, 'folder', 'R5b mapa ' + oznaka);
    const S = await mk(page, F, 'study', 'R5b materijal ' + oznaka);
    const E = await mk(page, null, 'folder', 'R5b prazna ' + oznaka);
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const mapa = redak(page, F);
      await expect(mapa).toHaveCount(1, { timeout: 20000 });

      // mapa: dodir na ime je otvara, drugi dodir zatvara
      const bila = await mapa.getAttribute('aria-expanded');
      await mapa.locator('[data-mm-main]').click();
      await expect(redak(page, F)).toHaveAttribute('aria-expanded', bila === 'true' ? 'false' : 'true');
      if (bila === 'true') await redak(page, F).locator('[data-mm-main]').click();
      await expect(redak(page, S)).toHaveCount(1);

      // prazna mapa: dodir ne smije biti mrtav → otvara „⋯"
      const prazna = redak(page, E);
      await prazna.locator('[data-mm-main]').click();
      await expect(prazna.locator('.mm-menu')).toBeVisible();
      await expect(prazna.locator('[data-mm-more]')).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(prazna.locator('.mm-menu')).toBeHidden();

      // materijal: dodir = UČENJE
      await redak(page, S).locator('[data-mm-main]').click();
      await expect.poll(() => page.evaluate(() => [AppState.nav.page, AppState.nav.subject]), {
        timeout: 20000, message: 'dodir na materijal ga nije otvorio za učenje',
      }).toEqual(['study', 'node:' + S]);
    } finally {
      await rm(page, [S, F, E]);
    }
  });

  test('② „⋯": radnje po vrsti, u ekranu, iznad stabla; Escape zatvara i vraća fokus', async ({ page }) => {
    await openMaterials(page);
    const oznaka = Date.now();
    const F = await mk(page, null, 'folder', 'R5b izbornik ' + oznaka);
    const S = await mk(page, null, 'study', 'R5b izbornik mat ' + oznaka);
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await expect(redak(page, S)).toHaveCount(1, { timeout: 20000 });

      const stavke = (id) => redak(page, id).locator('.mm-menu [role="menuitem"]').evaluateAll((els) =>
        els.map((e) => [...e.attributes].map((a) => a.name).find((n) => n.startsWith('data-mm-'))
          + (e.getAttribute('data-mm-new-in') ? '=' + e.getAttribute('data-mm-new-in') : '')));
      expect(await stavke(S)).toEqual(['data-mm-learn', 'data-mm-open', 'data-mm-rename', 'data-mm-del']);
      expect(await stavke(F)).toEqual(['data-mm-new-in=study', 'data-mm-new-in=folder', 'data-mm-rename', 'data-mm-del']);

      // na retku nema više ni jedne ikone-radnje osim „⋯" (i ✓/✕ u unosu, kojeg ovdje nema)
      const vidljiviGumbi = await redak(page, S).locator('button:visible').count();
      expect(vidljiviGumbi, 'redak materijala smije nositi samo glavni gumb i „⋯"').toBe(2);

      const vise = redak(page, S).locator('[data-mm-more]');
      await vise.click();
      const menu = redak(page, S).locator('.mm-menu');
      await expect(menu).toBeVisible();
      await expect(redak(page, S).locator('.mm-menu [data-mm-learn]')).toBeFocused();
      const m = await menu.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const pogodak = document.elementFromPoint(cx, cy);
        return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: innerWidth, h: innerHeight, navrhu: !!(pogodak && el.contains(pogodak)) };
      });
      expect(m.l).toBeGreaterThanOrEqual(0);
      expect(m.t).toBeGreaterThanOrEqual(0);
      expect(m.r).toBeLessThanOrEqual(m.w);
      expect(m.b).toBeLessThanOrEqual(m.h);
      expect(m.navrhu, 'izbornik je prekriven ili odrezan (stablo ima overflow: hidden)').toBe(true);

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(vise).toHaveAttribute('aria-expanded', 'false');
      await expect(vise).toBeFocused();

      // drugi dodir na „⋯" zatvara isti izbornik; otvaranje drugog zatvara prvi
      await vise.click();
      await redak(page, F).locator('[data-mm-more]').click();
      await expect(menu).toBeHidden();
      await expect(redak(page, F).locator('.mm-menu')).toBeVisible();
      await redak(page, F).locator('[data-mm-more]').click();
      await expect(redak(page, F).locator('.mm-menu')).toBeHidden();
    } finally {
      await rm(page, [S, F]);
    }
  });
});

test.describe('F2/5b — redak radionice (telefon, dodir)', () => {
  test.use({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true });

  test('③ bez ručke, PUNO ime (120 znakova se lomi, ne reže), „⋯" 44×44, izbornik u ekranu', async ({ page }) => {
    await openMaterials(page);
    const dugo = ('Makroekonomija skripta ' + Date.now() + ' ').repeat(6).slice(0, 120);
    const S = await mk(page, null, 'study', dugo);
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const r = redak(page, S);
      await expect(r).toHaveCount(1, { timeout: 20000 });

      const m = await r.evaluate((row) => {
        const ime = row.querySelector('.mm-name');
        const grip = row.querySelector('.mm-grip');
        const vise = row.querySelector('[data-mm-more]').getBoundingClientRect();
        const lh = parseFloat(getComputedStyle(ime).lineHeight);
        return {
          grip: getComputedStyle(grip).display,
          tekst: ime.textContent.length,
          reze: ime.scrollWidth > ime.clientWidth + 1 || getComputedStyle(ime).textOverflow === 'ellipsis',
          redaka: Math.round(ime.getBoundingClientRect().height / lh),
          vise: [Math.round(vise.width), Math.round(vise.height)],
          bijeg: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(m.grip, 'ručka za povlačenje na dodiru').toBe('none');
      expect(m.tekst).toBe(120);
      expect(m.reze, 'ime je rezano').toBe(false);
      expect(m.redaka, 'dugo ime se mora lomiti u retke').toBeGreaterThan(1);
      expect(m.vise).toEqual([44, 44]);
      expect(m.bijeg, 'stranica se vodoravno pomiče').toBeLessThanOrEqual(0);

      await r.locator('[data-mm-more]').tap();
      const box = await r.locator('.mm-menu').boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(393);
      const visine = await r.locator('.mm-menu [role="menuitem"]').evaluateAll((els) =>
        els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(Math.min(...visine), 'stavka izbornika je premala za prst').toBeGreaterThanOrEqual(44);
    } finally {
      await rm(page, [S]);
    }
  });
});
