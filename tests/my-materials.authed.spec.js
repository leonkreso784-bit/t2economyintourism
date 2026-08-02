// F2 — „MOJI MATERIJALI" E2E (STAGING): osobni UGC-graditelj na profilu.
// Trajni regresijski spec (pravilo #8): pokreće se SAMO u `authenticated` projektu sa STAGING_*.
// PIŠE u staging bazu kroz owner-scoped RPC-ove (`nodes`) i SVE za sobom počisti (delete_node).
// Prod se NE dira — `nodes` na produ ni ne postoji do F5.
//
// Dokazuje: stablo se učita i nacrta (RLS-filtrirano) · ugniježđenje i chevron ·
// korisnički naziv se ESCAPA (sigurnosna granica) · prazno stanje.
const { test, expect } = require('@playwright/test');

/** Otvori profil s montiranim graditeljem. */
async function openProfile(page) {
  // Fiksni cookie-banner legitimno prekriva dno stranice → presreo bi pointer-evente
  // na donjim redcima stabla. Isti obrazac kao auth.spec.js/components.spec.js.
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() => !!window.SokratMaterials && typeof window.navigateTo === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  // App ima `scroll-behavior: smooth` (css/variables.css) → scrollIntoView ANIMIRA, pa
  // boundingBox() izmjeri koordinate usred animacije i sintetički miš sleti na krivi redak.
  // Gasimo animaciju SAMO u testu (proizvod ostaje gladak).
  await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
}

/** Napravi čvor kroz RPC (isti put koji UI koristi). */
async function mkNode(page, parentId, kind, name) {
  return page.evaluate(
    ([p, k, n]) => window.SokratMaterials.createNode(p, k, n),
    [parentId, kind, name]
  );
}

/** Obriši (soft) — čišćenje nakon testa. */
async function rmNode(page, id) {
  await page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);
}

test.describe('F2 — Moji materijali', () => {
  test('prazno stanje kad korisnik nema ništa', async ({ page }) => {
    await openProfile(page);
    await expect(page.locator('#myMaterials .mm-state-title')).toBeVisible();
    await expect(page.locator('#myMaterials .mm-row')).toHaveCount(0);
  });

  test('stablo se crta ugniježđeno; chevron otvara/zatvara; naziv je ESCAPAN', async ({ page }) => {
    await openProfile(page);

    const XSS = '<img src=x onerror="window.__pwned=1">';
    const fid = await mkNode(page, null, 'folder', 'F2 Test fakultet');
    const sub = await mkNode(page, fid, 'folder', 'F2 Godina');
    await mkNode(page, sub, 'study', XSS);

    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await page.waitForSelector('#myMaterials .mm-row', { timeout: 20000 });

      // 1) korijen vidljiv, djeca skrivena dok folder nije otvoren
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(1);
      const rootRow = page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]');
      await expect(rootRow).toHaveCount(1);
      await expect(rootRow.locator('.mm-name')).toHaveText('F2 Test fakultet');

      // 2) chevron otvara → podfolder se pojavi na dubini 1
      await rootRow.locator('[data-mm-toggle]').click();
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(2);
      const subRow = page.locator('#myMaterials .mm-row[data-mm-id="' + sub + '"]');
      await expect(subRow).toHaveAttribute('style', /--mm-depth:1/);

      // 3) otvori i podfolder → study-čvor na dubini 2, s book ikonom
      await subRow.locator('[data-mm-toggle]').click();
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(3);
      const studyRow = page.locator('#myMaterials .mm-row--study');
      await expect(studyRow).toHaveAttribute('style', /--mm-depth:2/);
      await expect(studyRow.locator('.mm-icon .fa-book-open')).toHaveCount(1);

      // 4) SIGURNOSNA GRANICA: naziv je TEKST, nikad HTML
      await expect(studyRow.locator('.mm-name')).toHaveText(XSS);
      await expect(page.locator('#myMaterials img')).toHaveCount(0);
      expect(await page.evaluate(() => window.__pwned)).toBeUndefined();

      // 5) zatvaranje vraća na jedan redak
      await rootRow.locator('[data-mm-toggle]').click();
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(1);
    } finally {
      await rmNode(page, fid);
    }
  });

  test('dodaj folder → dodaj gradivo UNUTRA → preimenuj (inline unos, Enter potvrđuje)', async ({ page }) => {
    await openProfile(page);
    let fid = null;
    try {
      // 1) novi folder iz trake → inline unos → Enter
      await page.click('#myMaterials [data-mm-new="folder"]');
      await expect(page.locator('#myMaterials .mm-row--edit [data-mm-input]')).toBeFocused();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Akcije');
      await page.press('#myMaterials [data-mm-input]', 'Enter');

      const row = page.locator('#myMaterials .mm-row--folder', { hasText: 'F2 Akcije' });
      await expect(row).toHaveCount(1, { timeout: 20000 });
      fid = await row.getAttribute('data-mm-id');

      // 2) gradivo UNUTAR foldera → pojavi se ugniježđeno (depth 1) i folder je otvoren
      await row.locator('[data-mm-new-in="study"]').click();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Gradivo');
      await page.press('#myMaterials [data-mm-input]', 'Enter');

      const study = page.locator('#myMaterials .mm-row--study', { hasText: 'F2 Gradivo' });
      await expect(study).toHaveCount(1, { timeout: 20000 });
      await expect(study).toHaveAttribute('style', /--mm-depth:1/);

      // 3) preimenuj — unos je PREDPOPUNJEN starim nazivom
      await study.locator('[data-mm-rename]').click();
      await expect(page.locator('#myMaterials [data-mm-input]')).toHaveValue('F2 Gradivo');
      await page.fill('#myMaterials [data-mm-input]', 'F2 Preimenovano');
      await page.press('#myMaterials [data-mm-input]', 'Enter');
      await expect(page.locator('#myMaterials .mm-row--study .mm-name')).toHaveText('F2 Preimenovano', { timeout: 20000 });

      // 3b) ✓ gumb potvrđuje jednako kao Enter (mišem — blur ga ne smije pojesti)
      await page.locator('#myMaterials .mm-row--study [data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Gumbom');
      await page.click('#myMaterials [data-mm-commit]');
      await expect(page.locator('#myMaterials .mm-row--study .mm-name')).toHaveText('F2 Gumbom', { timeout: 20000 });

      // 3c) ✕ gumb odustaje
      await page.locator('#myMaterials .mm-row--study [data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'NE OVO');
      await page.click('#myMaterials [data-mm-cancel]');
      await expect(page.locator('#myMaterials .mm-row--study .mm-name')).toHaveText('F2 Gumbom');

      // 3d) tipkovnica: Tab s unosa na ✓ pa Enter — blur NE smije otkazati unos
      await page.locator('#myMaterials .mm-row--study [data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Tipkovnicom');
      await page.press('#myMaterials [data-mm-input]', 'Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#myMaterials .mm-row--study .mm-name')).toHaveText('F2 Tipkovnicom', { timeout: 20000 });

      // 4) Escape odustaje (naziv ostaje)
      await page.locator('#myMaterials .mm-row--study [data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'NE SPREMAJ');
      await page.press('#myMaterials [data-mm-input]', 'Escape');
      await expect(page.locator('#myMaterials .mm-row--study .mm-name')).toHaveText('F2 Tipkovnicom');
    } finally {
      if (fid) await rmNode(page, fid);
    }
  });

  test('obriši (potvrda) → podstablo nestane → „Vrati obrisano" ga vrati', async ({ page }) => {
    await openProfile(page);
    const fid = await mkNode(page, null, 'folder', 'F2 Za brisanje');
    await mkNode(page, fid, 'study', 'F2 Dijete');
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const row = page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]');
      await expect(row).toHaveCount(1, { timeout: 20000 });

      // brisanje traži potvrdu
      await row.locator('[data-mm-del]').click();
      await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
      await page.click('sokrat-confirm .sokrat-confirm__ok');

      // cijelo podstablo nestalo (soft-delete, rekurzivno)
      await expect(page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]')).toHaveCount(0, { timeout: 20000 });
      await expect(page.locator('#myMaterials .mm-row--study', { hasText: 'F2 Dijete' })).toHaveCount(0);

      // „Vrati obrisano" → podstablo se vraća
      await page.click('#myMaterials [data-mm-undo]');
      await expect(page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]')).toHaveCount(1, { timeout: 20000 });
      await page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"] [data-mm-toggle]').click();
      await expect(page.locator('#myMaterials .mm-row--study', { hasText: 'F2 Dijete' })).toHaveCount(1);
    } finally {
      await rmNode(page, fid);
    }
  });

  test('povuci ⠿: gnijezdi u folder, pa vrati na korijen; ciklus odbijen', async ({ page }) => {
    await openProfile(page);
    const A = await mkNode(page, null, 'folder', 'F2 Drag A');
    const B = await mkNode(page, null, 'folder', 'F2 Drag B');
    const S = await mkNode(page, null, 'study', 'F2 Drag gradivo');
    const inner = await mkNode(page, A, 'folder', 'F2 Drag unutra');

    /** Povuci ručku retka `fromId` na `ratio` visine retka `toId` (0.5 = sredina). */
    const drag = async (fromId, toId, ratio) => {
      // `page.mouse` ne radi actionability-provjere kao `.click()` → moramo sami pričekati
      // da prethodna akcija završi (dok traje, `.mm-busy` gasi pointer-evente).
      await page.waitForSelector('#myMaterials:not(.mm-busy)');
      const from = page.locator('#myMaterials .mm-row[data-mm-id="' + fromId + '"] [data-mm-drag]');
      const to = page.locator('#myMaterials .mm-row[data-mm-id="' + toId + '"]');
      // Centriraj stablo: `scrollIntoViewIfNeeded` gura element tek do ruba, pa cilj zna
      // završiti ispod viewporta → pointer-event ne stigne i drag ostane bez cilja.
      await page.locator('#myMaterials .mm-tree').evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await from.scrollIntoViewIfNeeded();
      const g = await from.boundingBox();
      const t = await to.boundingBox();
      await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
      await page.mouse.down();
      await page.mouse.move(t.x + t.width / 2, t.y + t.height * ratio, { steps: 8 });
      await page.mouse.up();
    };

    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(3, { timeout: 20000 });

      // 1) ispusti gradivo na SREDINU foldera A → ugnijezdi se u njega
      await drag(S, A, 0.5);
      const sRow = page.locator('#myMaterials .mm-row[data-mm-id="' + S + '"]');
      await expect(sRow).toHaveAttribute('style', /--mm-depth:1/, { timeout: 20000 });
      expect(await page.evaluate(async (id) => {
        const r = await window.SokratMaterials.loadTree();
        return (r.rows.find((x) => x.id === id) || {}).parent_id;
      }, S)).toBe(A);

      // 2) ispusti ga na GORNJI RUB foldera B → opet korijen, brat od B
      await drag(S, B, 0.2);
      await expect(sRow).toHaveAttribute('style', /--mm-depth:0/, { timeout: 20000 });
      expect(await page.evaluate(async (id) => {
        const r = await window.SokratMaterials.loadTree();
        return (r.rows.find((x) => x.id === id) || {}).parent_id;
      }, S)).toBe(null);

      // 3) CIKLUS: povuci folder A na svoje vlastito dijete → odbijeno, ništa se ne mijenja
      // (A može već biti otvoren — ugnježđivanje ga otvara — pa širimo samo ako treba.)
      const toggleA = page.locator('#myMaterials .mm-row[data-mm-id="' + A + '"] [data-mm-toggle]');
      if ((await toggleA.getAttribute('aria-expanded')) !== 'true') await toggleA.click();
      await expect(page.locator('#myMaterials .mm-row[data-mm-id="' + inner + '"]')).toHaveCount(1);
      await drag(A, inner, 0.5);
      expect(await page.evaluate(async (id) => {
        const r = await window.SokratMaterials.loadTree();
        return (r.rows.find((x) => x.id === id) || {}).parent_id;
      }, A)).toBe(null);
      expect(await page.evaluate(async (id) => {
        const r = await window.SokratMaterials.loadTree();
        return (r.rows.find((x) => x.id === id) || {}).parent_id;
      }, inner)).toBe(A);
    } finally {
      await rmNode(page, A);
      await rmNode(page, B);
      await rmNode(page, S);
    }
  });

  test('odustajanje od potvrde NE briše', async ({ page }) => {
    await openProfile(page);
    const fid = await mkNode(page, null, 'folder', 'F2 Ostaje');
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const row = page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]');
      await expect(row).toHaveCount(1, { timeout: 20000 });
      await row.locator('[data-mm-del]').click();
      await page.waitForSelector('sokrat-confirm .sokrat-confirm__cancel', { state: 'visible' });
      await page.click('sokrat-confirm .sokrat-confirm__cancel');
      await expect(page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]')).toHaveCount(1);
    } finally {
      await rmNode(page, fid);
    }
  });
});
