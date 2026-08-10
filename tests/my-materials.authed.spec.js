// F2 — „MOJI MATERIJALI" E2E (STAGING): osobni UGC-graditelj na profilu.
// Trajni regresijski spec (pravilo #8): pokreće se SAMO u `authenticated` projektu sa STAGING_*.
// PIŠE u staging bazu kroz owner-scoped RPC-ove (`nodes`) i SVE za sobom počisti (delete_node).
// Prod se NE dira — `nodes` na produ ni ne postoji do F5.
//
// Dokazuje: stablo se učita i nacrta (RLS-filtrirano) · ugniježđenje i chevron ·
// korisnički naziv se ESCAPA (sigurnosna granica) · prazno stanje.
const { test, expect } = require('@playwright/test');

/** Otvori profil s montiranim graditeljem. */
async function openMaterials(page) {
  // Fiksni cookie-banner legitimno prekriva dno stranice → presreo bi pointer-evente
  // na donjim redcima stabla. Isti obrazac kao auth.spec.js/components.spec.js.
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() => !!window.SokratMaterials && typeof window.navigateTo === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  // ⚠️ ČEKAJ da učitavanje ZAVRŠI. Spinner-stanje ima isti `.mm-state-title` kao prazno stanje,
  // pa bi tvrdnje inače prolazile NAD SPINNEROM (lažno zeleno — vidi test „učitavanje se dovrši").
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
  // App ima `scroll-behavior: smooth` (css/variables.css) → scrollIntoView ANIMIRA, pa
  // boundingBox() izmjeri koordinate usred animacije i sintetički miš sleti na krivi redak.
  // Gasimo animaciju SAMO u testu (proizvod ostaje gladak).
  await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
}

/** Koliko KORIJENSKIH redaka stablo pokazuje (test se ne smije oslanjati na prazan račun). */
const rootRowCount = (page) =>
  page.locator('#myMaterials .mm-row[style*="--mm-depth:0"]').count();

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
  // Prije je ovaj test tvrdio „`.mm-state-title` vidljiv + 0 redaka" i time PROLAZIO NAD
  // SPINNEROM (spinner ima isti naslov-element) — dakle prolazio bi i da je učitavanje potpuno
  // slomljeno. Sada gate-a stvarni invarijant: učitavanje se DOVRŠI i UI ZRCALI podatke.
  test('učitavanje se dovrši i UI zrcali podatke (prazno stanje samo kad je stvarno prazno)', async ({ page }) => {
    await openMaterials(page);

    // 1) nije zaglavilo u spinneru i nije u stanju greške
    await expect(page.locator('#myMaterials .mm-spin')).toHaveCount(0);
    await expect(page.locator('#myMaterials [data-mm-retry]')).toHaveCount(0);

    // 2) UI mora odgovarati onome što baza vrati — neovisno o tome ima li račun podataka
    const roots = await page.evaluate(async () => {
      const r = await window.SokratMaterials.loadTree();
      return r.tree.length;
    });
    if (roots === 0) {
      await expect(page.locator('#myMaterials .mm-state-title')).toBeVisible();
      await expect(page.locator('#myMaterials .mm-row')).toHaveCount(0);
    } else {
      expect(await rootRowCount(page)).toBe(roots);
    }
  });

  test('stablo se crta ugniježđeno; chevron otvara/zatvara; naziv je ESCAPAN', async ({ page }) => {
    await openMaterials(page);

    const XSS = '<img src=x onerror="window.__pwned=1">';
    const fid = await mkNode(page, null, 'folder', 'F2 Test fakultet');
    const sub = await mkNode(page, fid, 'folder', 'F2 Godina');
    const studyId = await mkNode(page, sub, 'study', XSS);

    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      await page.waitForSelector('#myMaterials .mm-row', { timeout: 20000 });

      // ⚠️ Tvrdnje su SCOPE-ane na vlastite čvorove (data-mm-id): račun smije imati i druge
      // podatke (demo stablo, ručno testiranje) — globalni brojevi bi test činili lažno crvenim.
      const rootRow = page.locator('#myMaterials .mm-row[data-mm-id="' + fid + '"]');
      const subRow = page.locator('#myMaterials .mm-row[data-mm-id="' + sub + '"]');
      const studyRow = page.locator('#myMaterials .mm-row[data-mm-id="' + studyId + '"]');

      // 1) korijen vidljiv, djeca skrivena dok folder nije otvoren
      await expect(rootRow).toHaveCount(1);
      await expect(rootRow.locator('.mm-name')).toHaveText('F2 Test fakultet');
      await expect(subRow).toHaveCount(0);
      await expect(studyRow).toHaveCount(0);

      // 2) chevron otvara → podfolder se pojavi na dubini 1
      await rootRow.locator('[data-mm-toggle]').click();
      await expect(subRow).toHaveCount(1);
      await expect(subRow).toHaveAttribute('style', /--mm-depth:1/);
      await expect(studyRow).toHaveCount(0);          // unuk i dalje skriven

      // 3) otvori i podfolder → study-čvor na dubini 2, s book ikonom
      await subRow.locator('[data-mm-toggle]').click();
      await expect(studyRow).toHaveCount(1);
      await expect(studyRow).toHaveAttribute('style', /--mm-depth:2/);
      await expect(studyRow.locator('.mm-icon .fa-book-open')).toHaveCount(1);

      // 4) SIGURNOSNA GRANICA: naziv je TEKST, nikad HTML
      await expect(studyRow.locator('.mm-name')).toHaveText(XSS);
      await expect(page.locator('#myMaterials img')).toHaveCount(0);
      expect(await page.evaluate(() => window.__pwned)).toBeUndefined();

      // 5) zatvaranje korijena sklanja cijelo podstablo (korijen ostaje)
      await rootRow.locator('[data-mm-toggle]').click();
      await expect(rootRow).toHaveCount(1);
      await expect(subRow).toHaveCount(0);
      await expect(studyRow).toHaveCount(0);
    } finally {
      await rmNode(page, fid);
    }
  });

  test('dodaj folder → dodaj gradivo UNUTRA → preimenuj (inline unos, Enter potvrđuje)', async ({ page }) => {
    await openMaterials(page);
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

      const created = page.locator('#myMaterials .mm-row--study', { hasText: 'F2 Gradivo' });
      await expect(created).toHaveCount(1, { timeout: 20000 });
      await expect(created).toHaveAttribute('style', /--mm-depth:1/);

      // Uhvati ID i dalje ciljaj NJEGA — naziv se mijenja, a `.mm-row--study` bi uhvatio i
      // tuđe/postojeće čvorove na računu (strict-mode sudar).
      const sid = await created.getAttribute('data-mm-id');
      const study = page.locator('#myMaterials .mm-row[data-mm-id="' + sid + '"]');
      const studyName = study.locator('.mm-name');

      // 3) preimenuj — unos je PREDPOPUNJEN starim nazivom
      await study.locator('[data-mm-rename]').click();
      await expect(page.locator('#myMaterials [data-mm-input]')).toHaveValue('F2 Gradivo');
      await page.fill('#myMaterials [data-mm-input]', 'F2 Preimenovano');
      await page.press('#myMaterials [data-mm-input]', 'Enter');
      await expect(studyName).toHaveText('F2 Preimenovano', { timeout: 20000 });

      // 3b) ✓ gumb potvrđuje jednako kao Enter (mišem — blur ga ne smije pojesti)
      await study.locator('[data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Gumbom');
      await page.click('#myMaterials [data-mm-commit]');
      await expect(studyName).toHaveText('F2 Gumbom', { timeout: 20000 });

      // 3c) ✕ gumb odustaje
      await study.locator('[data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'NE OVO');
      await page.click('#myMaterials [data-mm-cancel]');
      await expect(studyName).toHaveText('F2 Gumbom');

      // 3d) tipkovnica: Tab s unosa na ✓ pa Enter — blur NE smije otkazati unos
      await study.locator('[data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'F2 Tipkovnicom');
      await page.press('#myMaterials [data-mm-input]', 'Tab');
      await page.keyboard.press('Enter');
      await expect(studyName).toHaveText('F2 Tipkovnicom', { timeout: 20000 });

      // 4) Escape odustaje (naziv ostaje)
      await study.locator('[data-mm-rename]').click();
      await page.fill('#myMaterials [data-mm-input]', 'NE SPREMAJ');
      await page.press('#myMaterials [data-mm-input]', 'Escape');
      await expect(studyName).toHaveText('F2 Tipkovnicom');
    } finally {
      if (fid) await rmNode(page, fid);
    }
  });

  test('obriši (potvrda) → podstablo nestane → „Vrati obrisano" ga vrati', async ({ page }) => {
    await openMaterials(page);
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
    await openMaterials(page);
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
      // scope-ano na vlastite čvorove (račun smije imati i druge podatke)
      for (const id of [A, B, S]) {
        await expect(page.locator('#myMaterials .mm-row[data-mm-id="' + id + '"]'))
          .toHaveCount(1, { timeout: 20000 });
      }

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

  // ── Rubni slučajevi (lov na bugove 2026-08-04; svi su prošli iz prve — drže to tako) ──

  test('duboko ugnježđivanje (8 razina) ne razbija layout ni čitljivost', async ({ page }) => {
    await openMaterials(page);
    let root = null;
    try {
      let parent = null;
      for (let i = 0; i < 8; i++) {
        parent = await mkNode(page, parent, i === 7 ? 'study' : 'folder', 'Razina ' + (i + 1));
        if (i === 0) root = parent;
      }
      await page.evaluate(() => window.SokratMaterials.refresh());
      await page.waitForSelector('#myMaterials .mm-row', { timeout: 20000 });
      for (let i = 0; i < 8; i++) {
        const t = page.locator('#myMaterials [data-mm-toggle][aria-expanded="false"]').first();
        if (await t.count()) await t.click(); else break;
      }
      // Stranica se NIKAD ne smije vodoravno skrolati (klasa BUG-003/007).
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'stranica se vodoravno skrola na dubokom stablu').toBeLessThanOrEqual(1);
      // Naziv na najdubljoj razini mora ostati čitljiv (uvlaka ga ne smije stisnuti).
      const nameBox = await page.locator('#myMaterials .mm-row').last().locator('.mm-name').boundingBox();
      expect(nameBox.width, 'naziv na dubokoj razini stisnut').toBeGreaterThan(40);
    } finally {
      if (root) await rmNode(page, root);
    }
  });

  test('naziv od 120 znakova (granica sheme) ne razbija layout', async ({ page }) => {
    await openMaterials(page);
    let id = null;
    try {
      id = await mkNode(page, null, 'folder', 'D'.repeat(120));
      await page.evaluate(() => window.SokratMaterials.refresh());
      const row = page.locator('#myMaterials .mm-row[data-mm-id="' + id + '"]');
      await expect(row).toHaveCount(1, { timeout: 20000 });
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'dugačak naziv gura stranicu vodoravno').toBeLessThanOrEqual(1);
      const rowBox = await row.boundingBox();
      const treeBox = await page.locator('#myMaterials .mm-tree').boundingBox();
      expect(rowBox.width).toBeLessThanOrEqual(treeBox.width + 2);
    } finally {
      if (id) await rmNode(page, id);
    }
  });

  test('brzi dvoklik na „+ Folder" ne otvara dva unosa', async ({ page }) => {
    await openMaterials(page);
    const btn = page.locator('#myMaterials [data-mm-new="folder"]');
    await btn.click();
    await btn.click({ force: true });
    await expect(page.locator('#myMaterials [data-mm-input]')).toHaveCount(1);
    await page.keyboard.press('Escape');
  });

  test('dvostruki Enter ne stvara duplikat čvora', async ({ page }) => {
    await openMaterials(page);
    await page.click('#myMaterials [data-mm-new="folder"]');
    await page.fill('#myMaterials [data-mm-input]', 'F2 DvaPuta');
    await page.press('#myMaterials [data-mm-input]', 'Enter');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#myMaterials:not(.mm-busy)');
    await expect(page.locator('#myMaterials .mm-row', { hasText: 'F2 DvaPuta' }))
      .toHaveCount(1, { timeout: 20000 });
    const made = await page.evaluate(async () => {
      const r = await window.SokratMaterials.loadTree();
      return r.rows.filter((x) => x.name === 'F2 DvaPuta' && !x.deleted_at).map((x) => x.id);
    });
    try {
      expect(made.length, 'dupli čvor od dvostrukog Enter-a').toBe(1);
    } finally {
      for (const id of made) await rmNode(page, id);
    }
  });

  test('ispuštanje retka na SAMOG SEBE ne mijenja ništa', async ({ page }) => {
    await openMaterials(page);
    const A = await mkNode(page, null, 'folder', 'F2 Self A');
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const row = page.locator('#myMaterials .mm-row[data-mm-id="' + A + '"]');
      await expect(row).toHaveCount(1, { timeout: 20000 });
      await page.waitForSelector('#myMaterials:not(.mm-busy)');
      const g = await row.locator('[data-mm-drag]').boundingBox();
      const t = await row.boundingBox();
      await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
      await page.mouse.down();
      await page.mouse.move(t.x + t.width / 2, t.y + t.height * 0.5, { steps: 6 });
      await page.mouse.up();
      await page.waitForSelector('#myMaterials:not(.mm-busy)');
      const parent = await page.evaluate(async (id) => {
        const r = await window.SokratMaterials.loadTree();
        return (r.rows.find((x) => x.id === id) || {}).parent_id;
      }, A);
      expect(parent, 'čvor postao vlastito dijete').toBe(null);
      await expect(row).toHaveCount(1);
    } finally {
      await rmNode(page, A);
    }
  });

  test('otvaranje drugog unosa dok je prvi otvoren ne ostavlja siroče', async ({ page }) => {
    await openMaterials(page);
    await page.click('#myMaterials [data-mm-new="folder"]');
    await page.fill('#myMaterials [data-mm-input]', 'nedovrseno');
    await page.click('#myMaterials [data-mm-new="study"]');
    const inputs = page.locator('#myMaterials [data-mm-input]');
    await expect(inputs).toHaveCount(1);
    await expect(inputs).toHaveValue('');   // stari tekst se NE prenosi
    await page.keyboard.press('Escape');
  });

  test('odustajanje od potvrde NE briše', async ({ page }) => {
    await openMaterials(page);
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
