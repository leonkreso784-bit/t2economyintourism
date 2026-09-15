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
      expect(await stavke(S)).toEqual(['data-mm-learn', 'data-mm-open', 'data-mm-rename', 'data-mm-move', 'data-mm-del']);
      expect(await stavke(F)).toEqual(['data-mm-new-in=study', 'data-mm-new-in=folder', 'data-mm-rename', 'data-mm-move', 'data-mm-del']);

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

test('⑥ traka nosi JEDAN „+ Novo": izbornik s materijalom i policom, poravnat uz gumb', async ({ page }) => {
  await openMaterials(page);
  const bar = page.locator('#myMaterials .mm-bar');
  const gumbi = await bar.locator('button:visible').evaluateAll((els) => els.filter((e) => !e.hasAttribute('data-mm-undo')).length);
  expect(gumbi, 'traka smije nositi samo „+ Novo" (i „Vrati" kad ima što)').toBe(1);
  const novo = bar.locator('[data-mm-more]');
  await novo.click();
  const menu = bar.locator('.mm-menu');
  await expect(menu).toBeVisible();
  await expect(novo).toHaveAttribute('aria-expanded', 'true');
  expect(await menu.locator('[role="menuitem"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-mm-new'))))
    .toEqual(['study', 'folder']);
  const [g, m] = [await novo.boundingBox(), await menu.boundingBox()];
  expect(Math.abs(m.x - g.x), 'izbornik „+ Novo" nije poravnat uz lijevi rub gumba').toBeLessThanOrEqual(1);
  await menu.locator('[data-mm-new="study"]').click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#myMaterials .mm-row--edit [data-mm-input]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#myMaterials [data-mm-input]')).toHaveCount(0);
});

const roditelj = (page, id) => page.evaluate(async (i) => {
  const r = await window.SokratMaterials.loadTree();
  return (r.rows.find((x) => x.id === i) || {}).parent_id;
}, id);

/** „⋯ → Premjesti u…" → odaberi odredište (`null` = vrh). */
async function premjesti(page, id, u, dodir) {
  const r = redak(page, id);
  const klik = (loc) => (dodir ? loc.tap() : loc.click());
  await klik(r.locator('[data-mm-more]'));
  await klik(r.locator('.mm-menu [data-mm-move]'));
  await expect(page.locator('#mmMoveModal .mm-move__card')).toBeVisible();
  await klik(page.locator('#mmMoveModal [data-mm-move-to="' + (u || '') + '"]'));
  await expect(page.locator('#mmMoveModal .mm-move__card')).toBeHidden();
  await page.waitForSelector('#myMaterials:not(.mm-busy)');
}

test.describe('F2/5b-2 — „Premjesti u…" (stolno)', () => {
  test('④ premještanje kroz izbornik: trenutna polica nije izbor, polica ne ide u sebe, upis stigne u bazu', async ({ page }) => {
    await openMaterials(page);
    const oznaka = Date.now();
    const A = await mk(page, null, 'folder', 'R5b2 A ' + oznaka);
    const A1 = await mk(page, A, 'folder', 'R5b2 A1 ' + oznaka);
    const B = await mk(page, null, 'folder', 'R5b2 B ' + oznaka);
    const S = await mk(page, A, 'study', 'R5b2 materijal ' + oznaka);
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await expect(redak(page, A)).toHaveCount(1, { timeout: 20000 });
      if ((await redak(page, A).getAttribute('aria-expanded')) !== 'true') await redak(page, A).locator('[data-mm-toggle]').click();
      await expect(redak(page, S)).toHaveCount(1);

      // prozor: trenutna polica (A) je onemogućena i označena
      await redak(page, S).locator('[data-mm-more]').click();
      await redak(page, S).locator('.mm-menu [data-mm-move]').click();
      const uA = page.locator('#mmMoveModal [data-mm-move-to="' + A + '"]');
      await expect(uA).toBeDisabled();
      await expect(uA).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('#mmMoveModal #mmMoveWhat')).toHaveText('R5b2 materijal ' + oznaka);
      // Escape = odustani, ništa se ne mijenja
      await page.keyboard.press('Escape');
      await expect(page.locator('#mmMoveModal .mm-move__card')).toBeHidden();
      expect(await roditelj(page, S)).toBe(A);

      // materijal A → B
      await premjesti(page, S, B, false);
      await expect.poll(() => roditelj(page, S), { timeout: 20000 }).toBe(B);
      await expect(redak(page, S)).toHaveAttribute('style', /--mm-depth:1/);

      // polica A: ne nudi sebe ni svog potomka A1
      await redak(page, A).locator('[data-mm-more]').click();
      await redak(page, A).locator('.mm-menu [data-mm-move]').click();
      await expect(page.locator('#mmMoveModal [data-mm-move-to="' + A + '"]')).toHaveCount(0);
      await expect(page.locator('#mmMoveModal [data-mm-move-to="' + A1 + '"]')).toHaveCount(0);
      await expect(page.locator('#mmMoveModal [data-mm-move-to="' + B + '"]')).toBeEnabled();
      await page.click('#mmMoveModal [data-mm-move-cancel]');
      await expect(page.locator('#mmMoveModal .mm-move__card')).toBeHidden();

      // materijal B → vrh
      await premjesti(page, S, null, false);
      await expect.poll(() => roditelj(page, S), { timeout: 20000 }).toBe(null);
    } finally {
      await rm(page, [S, A1, A, B]);
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
      await page.keyboard.press('Escape');

      // „+ Novo" je na telefonu pune širine → izbornik mu stoji uz LIJEVI rub (ne visi desno u zraku)
      const novo = page.locator('#myMaterials .mm-bar [data-mm-more]');
      await novo.tap();
      const gumb = await novo.boundingBox();
      const izb = await page.locator('#myMaterials .mm-bar .mm-menu').boundingBox();
      expect(Math.abs(izb.x - gumb.x), 'izbornik „+ Novo" nije uz lijevi rub gumba na telefonu').toBeLessThanOrEqual(1);
    } finally {
      await rm(page, [S]);
    }
  });

  test('⑤ premještanje DODIROM (bez povlačenja): materijal ide u policu i natrag', async ({ page }) => {
    await openMaterials(page);
    const oznaka = Date.now();
    const F = await mk(page, null, 'folder', 'R5b2 tel polica ' + oznaka);
    const S = await mk(page, null, 'study', 'R5b2 tel materijal ' + oznaka);
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await expect(redak(page, S)).toHaveCount(1, { timeout: 20000 });
      await premjesti(page, S, F, true);
      await expect.poll(() => roditelj(page, S), { timeout: 20000 }).toBe(F);
      const visine = await page.locator('#mmMoveModal [data-mm-move-to]').evaluateAll((els) =>
        els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(visine.length, 'prozor nije nacrtao odredišta').toBeGreaterThan(1);
      await premjesti(page, S, null, true);
      await expect.poll(() => roditelj(page, S), { timeout: 20000 }).toBe(null);
    } finally {
      await rm(page, [S, F]);
    }
  });
});
