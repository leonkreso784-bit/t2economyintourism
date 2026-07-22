// U8.2 — STUDIO EDITOR E2E (STAGING): novi „Studio" (#editor-page) → learn blok-editor.
// Trajni regresijski spec (pravilo #8): pokreće se SAMO u `authenticated` projektu sa STAGING_*
// (staging seedan: node scripts/seed-staging.js te2). SVE ostaje u DRAFTU (nikad Objavi) → staging DB NETAKNUT.
//
// Dokazuje da U8.2 radi na Studio-kostima: uđi u Studio → odaberi te2 iz STABLA → „Uredi" (draft) →
// learn v1 kategorija → „Uredi kao blokove" (sigurna migracija content→legacy-html blok) → block-editor
// se montira → dodaj blok kroz ＋ → draft-brojač raste → Odbaci. Jedan draft/publish engine (studioBridge).
const { test, expect } = require('@playwright/test');

/** Uđi u Studio i otvori te2 skriptu iz stabla. */
async function openStudioLesson(page) {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratStudio && !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('editor'));
  await page.waitForSelector('#editor-page.active #stTree .st-row');
  // rasklopi sve čvorove pa klikni te2 lekciju
  await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach(n => n.classList.add('open')); });
  const leaf = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
  await expect(leaf).toHaveCount(1);
  const subj = await leaf.getAttribute('data-subj');
  const lesson = await leaf.getAttribute('data-lesson');
  await leaf.click();
  await page.waitForSelector('#stCanvas .st-head h1');
  return { subj, lesson };
}

test('U8.2 — Studio learn: Uredi → migracija v1→blokovi → dodaj blok → draft raste → Odbaci', async ({ page }) => {
  await openStudioLesson(page);

  // read-only preview najprije (U8.1): learn kv postoji, Uredi gumb ponuđen
  await expect(page.locator('#stCanvas .st-pane[data-pane="learn"]')).toHaveCount(1);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });

  // → uđi u draft-mod (svjež staging payload + base_version)
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });
  await expect(page.locator('#stPublish:not([hidden])')).toHaveCount(1);
  await expect(page.locator('#stDiscard:not([hidden])')).toHaveCount(1);

  // learn tab (ako nije aktivan)
  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();

  // te2 learn = v1 → „Uredi kao blokove" (sigurna migracija; sadržaj ostaje kao prvi blok)
  const migrate = page.locator('#stCanvas .st-migrate').first();
  await expect(migrate).toHaveCount(1);
  await migrate.click();

  // block-editor montiran; migracija = 1 op → draft dirty
  await page.waitForSelector('#stCanvas .be-mount .be-root', { timeout: 20000 });
  await expect(page.locator('#stCanvas .be-mount .be-block')).toHaveCount(1); // legacy-html blok
  await expect(page.locator('#stDraftChip.dirty')).toHaveCount(1);

  // dodaj TEKST blok kroz ＋ (bigplus → izbornik → Tekst) → 2 bloka
  await page.locator('#stCanvas .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Tekst' }).click();
  await expect(page.locator('#stCanvas .be-mount').first().locator('.be-block')).toHaveCount(2);

  // presloži: ↓ na prvom bloku → i dalje 2 bloka (dokaz da reorderBlocks op prolazi)
  await page.locator('#stCanvas .be-mount .be-block').first().locator('[data-be-act="down"]').click();
  await expect(page.locator('#stCanvas .be-mount').first().locator('.be-block')).toHaveCount(2);

  // Odbaci (draft dirty) → čist izlaz; staging nikad nije pisan
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.3 — Studio kartice: Uredi → Dodaj (modal) → uredi ✎ → obriši 🗑 (draft-only, tab očuvan)', async ({ page }) => {
  await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  // → Kartice tab (edit-mod = admin kontrole na stavkama)
  const cardsTab = page.locator('#stCanvas .st-tab[data-mode="cards"]');
  await expect(cardsTab).toHaveCount(1);
  await cardsTab.click();
  await page.waitForSelector('#stCanvas .st-pane[data-pane="cards"].on');
  const pane = page.locator('#stCanvas .st-pane[data-pane="cards"]');

  // Dodaj karticu (reuse admin modal preko data-admin-add) → spremi
  await pane.locator('[data-admin-add][data-type="flashcard"]').first().click();
  await page.waitForSelector('#adminEditModal #adminEditQ');
  await page.fill('#adminEditQ', 'U83-pitanje');
  await page.fill('#adminEditA', 'U83-odgovor');
  await page.click('#adminEditSave');
  // onDraftChanged re-render → nova kartica vidljiva, chip dirty, TAB očuvan (Kartice još aktivan)
  await expect(pane.locator('.st-edit-item', { hasText: 'U83-pitanje' })).toHaveCount(1);
  await expect(page.locator('#stDraftChip.dirty')).toHaveCount(1);
  await expect(page.locator('#stCanvas .st-tab[data-mode="cards"].on')).toHaveCount(1);

  // Uredi (✎) → promijeni odgovor
  await pane.locator('.st-edit-item', { hasText: 'U83-pitanje' }).locator('[data-admin-edit]').click();
  await page.waitForSelector('#adminEditModal #adminEditA');
  await page.fill('#adminEditA', 'U83-odgovor-2');
  await page.click('#adminEditSave');
  await expect(pane.locator('.st-edit-item', { hasText: 'U83-odgovor-2' })).toHaveCount(1);

  // Obriši (🗑) → potvrda → nema je
  await pane.locator('.st-edit-item', { hasText: 'U83-pitanje' }).locator('[data-admin-del]').click();
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await expect(pane.locator('.st-edit-item', { hasText: 'U83-pitanje' })).toHaveCount(0);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.4a — Studio learn: dodaj Tekst blok → upiši → bold (traka) → runs u draftu → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  // learn tab + migracija prve v1 kategorije → block-editor se montira
  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // dodaj Tekst (paragraph) blok kroz ＋
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Tekst' }).click();
  const editable = page.locator('#stCanvas .be-mount .be-block').last().locator('[data-be-field="text"]');
  await expect(editable).toHaveCount(1);

  // UPIŠI tekst → blur → focusout serijalizira u draft (plain string)
  await editable.click();
  await page.keyboard.type('Bold tekst ovdje');
  await page.locator('#stCanvas .st-head h1').click();  // klik izvan = blur
  const hasPlain = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    if (!d) return false;
    return Object.keys(d.working).some((k) => {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      return Array.isArray(blks) && blks.some((b) => b.text === 'Bold tekst ovdje');
    });
  }, sel);
  expect(hasPlain).toBe(true);

  // BOLD: selektiraj sav tekst polja → traka se pojavi → klik B → blur → runs s b:true
  await editable.click();
  await page.evaluate(() => {
    const blocks = document.querySelectorAll('#stCanvas .be-mount .be-block');
    const el = blocks[blocks.length - 1].querySelector('[data-be-field="text"]');
    const r = document.createRange(); r.selectNodeContents(el);
    const sel = document.getSelection(); sel.removeAllRanges(); sel.addRange(r);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await page.waitForSelector('.be-toolbar.on', { timeout: 5000 });
  await page.locator('.be-toolbar .be-tb[data-be-fmt="bold"]').click();
  await page.locator('#stCanvas .st-head h1').click();  // blur → serijalizacija
  const isBold = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    return Object.keys(d.working).some((k) => {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      return Array.isArray(blks) && blks.some((b) =>
        Array.isArray(b.text) && b.text.some((run) => run.b && /Bold tekst/.test(run.text)));
    });
  }, sel);
  expect(isBold).toBe(true);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.4b — Studio learn: boja (traka) + link (prompt) → runs u draftu → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  // learn tab + migracija prve v1 kategorije → block-editor
  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // dodaj Tekst blok + upiši
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Tekst' }).click();
  const editable = page.locator('#stCanvas .be-mount .be-block').last().locator('[data-be-field="text"]');
  await editable.click();
  await page.keyboard.type('Boja i link tekst');
  await page.locator('#stCanvas .st-head h1').click();

  // helper: selektiraj sav tekst zadnjeg polja → traka se pojavi
  const selectAllLast = async () => {
    await editable.click();
    await page.evaluate(() => {
      const blocks = document.querySelectorAll('#stCanvas .be-mount .be-block');
      const el = blocks[blocks.length - 1].querySelector('[data-be-field="text"]');
      const r = document.createRange(); r.selectNodeContents(el);
      const s = document.getSelection(); s.removeAllRanges(); s.addRange(r);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await page.waitForSelector('.be-toolbar.on', { timeout: 5000 });
  };
  const runHas = (pred) => page.evaluate(({ s, src }) => {
    const fn = new Function('run', 'return (' + src + ')(run);');
    const d = window.SokratDraft.get(s.subj, s.lesson);
    return Object.keys(d.working).some((k) => {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      return Array.isArray(blks) && blks.some((b) => Array.isArray(b.text) && b.text.some(fn));
    });
  }, { s: sel, src: pred.toString() });

  // BOJA: zeleni swatch → blur → run color:'green'
  await selectAllLast();
  await page.locator('.be-toolbar .be-tb[data-be-color="green"]').click();
  await page.locator('#stCanvas .st-head h1').click();
  expect(await runHas((run) => run.color === 'green')).toBe(true);

  // LINK: prompt (dialog) prihvati goli domen → sanitizeLink doda https:// → run href
  page.once('dialog', (d) => d.accept('example.com/x'));
  await selectAllLast();
  await page.locator('.be-toolbar .be-tb[data-be-linkact]').click();
  await page.locator('#stCanvas .st-head h1').click();
  expect(await runHas((run) => !!run.href && /example\.com/.test(run.href))).toBe(true);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.5a — Studio learn: dodaj Sliku → upiši URL → draft ima src → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  // learn tab + migracija → block-editor
  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // dodaj Slika blok kroz ＋
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Slika' }).click();
  const srcInput = page.locator('#stCanvas .be-mount .be-block').last().locator('[data-be-mfield="src"]');
  await expect(srcInput).toHaveCount(1);

  // upiši URL → blur → change → draft ima src
  await srcInput.fill('https://example.com/slika.png');
  await page.locator('#stCanvas .st-head h1').click();  // blur = change
  const hasSrc = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    return Object.keys(d.working).some((k) => {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      return Array.isArray(blks) && blks.some((b) => b.type === 'image' && b.src === 'https://example.com/slika.png');
    });
  }, sel);
  expect(hasSrc).toBe(true);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.5b — Studio learn: dodaj Video → zalijepi YouTube link → draft url + facade → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // dodaj Video blok kroz ＋
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Video' }).click();
  const urlInput = page.locator('#stCanvas .be-mount .be-block').last().locator('[data-be-mfield="url"]');
  await expect(urlInput).toHaveCount(1);

  // zalijepi YouTube link → blur → change
  await urlInput.fill('https://youtu.be/dQw4w9WgXcQ');
  await page.locator('#stCanvas .st-head h1').click();
  const hasUrl = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    return Object.keys(d.working).some((k) => {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      return Array.isArray(blks) && blks.some((b) => b.type === 'video' && b.url === 'https://youtu.be/dQw4w9WgXcQ');
    });
  }, sel);
  expect(hasUrl).toBe(true);

  // preview = facade (klik-za-učitavanje; NULA YT-poziva prije klika)
  const block = page.locator('#stCanvas .be-mount .be-block').last();
  await expect(block.locator('.lb-video__play')).toHaveCount(1);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.5c — Studio learn: dodaj Formulu → upiši LaTeX → draft tex+display → KaTeX preview → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // dodaj Formula blok kroz ＋
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Formula' }).click();
  const fblock = page.locator('#stCanvas .be-mount .be-block').last();
  const texInput = fblock.locator('[data-be-mfield="tex"]');
  await expect(texInput).toHaveCount(1);

  // upiši LaTeX → blur → change → draft ima tex + display:true (default = veliki blok)
  await texInput.fill('E = mc^2');
  await page.locator('#stCanvas .st-head h1').click();  // blur = change
  const draft = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    for (const k of Object.keys(d.working)) {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      if (Array.isArray(blks)) {
        const f = blks.find((b) => b.type === 'formula' && b.tex === 'E = mc^2');
        if (f) return { tex: f.tex, display: f.display };
      }
    }
    return null;
  }, sel);
  expect(draft).not.toBeNull();
  expect(draft.display).toBe(true);

  // preview živi kroz JEDAN renderer (.lb-formula)
  await expect(fblock.locator('.be-media__preview .lb-formula')).toHaveCount(1);
  // KaTeX je STVARNO tipografirao (renderMath prošao) — .katex output, ne sirovi \[…\] tekst
  await expect(fblock.locator('.be-media__preview .katex').first()).toBeVisible({ timeout: 10000 });

  // isključi „veliki blok" → display:false (inline)
  await fblock.locator('[data-be-mcheck="display"]').uncheck();
  const display2 = await page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    for (const k of Object.keys(d.working)) {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      if (Array.isArray(blks)) { const f = blks.find((b) => b.type === 'formula' && b.tex === 'E = mc^2'); if (f) return f.display; }
    }
    return null;
  }, sel);
  expect(display2).toBe(false);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});

test('U8.5d — Studio learn: dodaj Tablicu → upiši ćelije → +red/+stupac → toggle header → preview → Odbaci', async ({ page }) => {
  const sel = await openStudioLesson(page);
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');
  await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });

  const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
  if (await learnTab.count()) await learnTab.click();
  await page.locator('#stCanvas .st-migrate').first().click();
  await page.waitForSelector('#stCanvas .be-mount .be-root');

  // čitač tablice iz drafta
  const readTable = () => page.evaluate((s) => {
    const d = window.SokratDraft.get(s.subj, s.lesson);
    for (const k of Object.keys(d.working)) {
      const cat = d.working[k];
      const blks = cat && typeof cat === 'object' && cat.learn && cat.learn.blocks;
      if (Array.isArray(blks)) { const t = blks.find((b) => b.type === 'table'); if (t) return { header: t.header || null, rows: t.rows }; }
    }
    return null;
  }, sel);
  const tblock = () => page.locator('#stCanvas .be-mount .be-block').last();

  // dodaj Tablica blok (default 2×2 + zaglavlje)
  await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
  await page.waitForSelector('.be-menu .be-menu-item');
  await page.locator('.be-menu .be-menu-item', { hasText: 'Tablica' }).click();
  await expect(tblock().locator('.be-tgrid')).toHaveCount(1);

  // upiši header-ćeliju (r=-1,c=0) + tijelo-ćeliju (r=0,c=0) → blur → change
  await tblock().locator('[data-be-tr="-1"][data-be-tc="0"]').fill('Pojam');
  await tblock().locator('[data-be-tr="0"][data-be-tc="0"]').fill('Vrijednost');
  await page.locator('#stCanvas .st-head h1').click();  // blur
  const t1 = await readTable();
  expect(t1).not.toBeNull();
  expect(t1.header[0]).toBe('Pojam');
  expect(t1.rows[0][0]).toBe('Vrijednost');
  expect(t1.rows.length).toBe(2);       // default 2 reda
  expect(t1.header.length).toBe(2);     // default 2 stupca

  // ＋ red → 3 reda (upisane vrijednosti sačuvane)
  await tblock().locator('[data-be-tact="addrow"]').click();
  const t2 = await readTable();
  expect(t2.rows.length).toBe(3);
  expect(t2.rows[0][0]).toBe('Vrijednost');

  // ＋ stupac → 3 stupca
  await tblock().locator('[data-be-tact="addcol"]').click();
  const t3 = await readTable();
  expect(t3.header.length).toBe(3);
  expect(t3.rows[0].length).toBe(3);

  // isključi zaglavlje → header uklonjen (null/undefined), rows ostaju
  await tblock().locator('[data-be-tcheck="header"]').uncheck();
  const t4 = await readTable();
  expect(t4.header == null).toBe(true);
  expect(t4.rows.length).toBe(3);

  // živi preview kroz JEDAN renderer (.lb-table)
  await expect(tblock().locator('.be-media__preview .lb-table')).toHaveCount(1);

  // Odbaci
  await page.click('#stDiscard');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
});
