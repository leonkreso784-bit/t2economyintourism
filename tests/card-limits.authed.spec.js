// M5a — MJERA DULJINE KARTICE kroz PRAVI UI (faza „Mjera i zaborav").
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// Sve ostaje u DRAFTU / u vlastitom test-materijalu koji se počisti → staging sadržaj netaknut.
//
// Politika (200 upozorenje / 500 strop) je već dokazana bez DOM-a u
// `tests/unit/card-limits.test.js`. OVAJ spec dokazuje ono što unit ne može:
//
//   1. da je kočnica STVARNA — kartica preko stropa se ne pojavi u canvasu,
//      a ne da je samo gumb posivio;
//   2. da vrijedi u OBA SVIJETA — javni katalog i osobni materijal.
//
// (2) je jedini razlog zašto ovaj spec postoji. Cijeli M5a stoji na pretpostavci da Studio
// nema vlastiti editor kartica, nego kroz `data-admin-*` završi u istom `#adminEditModal`.
// Ako netko ikad napravi drugi editor kartica, ograničenje tiho nestane u pola proizvoda —
// i tad pada test „osobni materijal", ne produkcija.
const { test, expect } = require('@playwright/test');

const HARD = 500;
const OVER = 'x'.repeat(HARD + 1);   // 501 — mora biti odbijeno
const EXACT = 'y'.repeat(HARD);      // 500 — mora proći (rub na jedan znak)

/** Otvori admin → te2 + prva lekcija → draft-mod (isti helper kao item-ops/category-ops spec). */
async function openLessonInDraftMode(page) {
  await page.goto('/');
  await page.waitForFunction(
    () => !!window.SokratAdmin && !!window.SokratContent && typeof window.navigateTo === 'function'
  );
  await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
  await page.evaluate(() => navigateTo('admin'));
  await page.waitForSelector('#admin-page.active #adminSubjectSel');
  await page.evaluate(() => {
    const sel = document.getElementById('adminSubjectSel');
    const te2 = sel.querySelector('option[value="te2"]');
    sel.value = te2 ? 'te2' : sel.querySelector('option[value]:not([value=""])').value;
    sel.dispatchEvent(new Event('change'));
  });
  await page.waitForFunction(() => {
    const l = document.getElementById('adminLessonSel');
    return l && !l.disabled && !!l.querySelector('option[value]:not([value=""]):not([disabled])');
  });
  await page.evaluate(() => {
    const l = document.getElementById('adminLessonSel');
    l.value = l.querySelector('option[value]:not([value=""]):not([disabled])').value;
    l.dispatchEvent(new Event('change'));
  });
  await page.waitForSelector('#adminDraftBtn', { timeout: 20000 });
  await page.click('#adminDraftBtn');
  await page.waitForSelector('#adminCards .admin-cat', { timeout: 20000 });
}

async function openMaterials(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() =>
    !!window.SokratMaterials && !!window.SokratAdmin && typeof window.navigateTo === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  // ⚠ Spinner dijeli selektor s praznim stanjem — čekaj da NESTANE.
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

/**
 * Obriši sve lokalne draftove. `SokratAdmin.discard()` ide kroz `askConfirm` (blokirao bi test),
 * a `SokratDraft.discard()` traži subjectId+lessonId koje spec ne drži — draft ionako živi
 * SAMO u localStorageu, pa je čišćenje ključeva potpuno i ne dira bazu.
 */
async function clearDrafts(page) {
  await page.evaluate(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.indexOf('sokrat-draft:') === 0)
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* private mode */ }
  });
}

/** Upiši pitanje/odgovor u otvoreni kartica-editor i vrati stanje brojača + gumba. */
async function fillCard(page, q, a) {
  await page.fill('#adminEditQ', q);
  await page.fill('#adminEditA', a);
  return page.evaluate(() => ({
    qCount: document.getElementById('adminEditQCount').textContent,
    aCount: document.getElementById('adminEditACount').textContent,
    aOver: document.getElementById('adminEditACount').classList.contains('is-over'),
    aWarn: document.getElementById('adminEditACount').classList.contains('is-warn'),
    saveDisabled: document.getElementById('adminEditSave').disabled
  }));
}

test.describe('M5a — mjera duljine kartice', () => {
  test('javni katalog: 501 znak se NE da spremiti, 500 prođe', async ({ page }) => {
    await openLessonInDraftMode(page);
    const cat = page.locator('#adminCards .admin-cat').first();
    const before = await cat.locator('.admin-card').count();

    await cat.locator('[data-admin-add][data-type="flashcard"]').click();
    await page.waitForSelector('#adminEditModal #adminEditQ');

    // ── PREKO STROPA ──
    const over = await fillCard(page, 'M5a predugo', OVER);
    expect(over.aCount, 'brojač mora pokazivati duljinu i strop').toBe((HARD + 1) + ' / ' + HARD);
    expect(over.aOver, 'brojač mora biti u stanju `is-over`').toBe(true);
    expect(over.saveDisabled, '„Spremi" mora biti onemogućen').toBe(true);

    // ── PRAVA KOČNICA, NE POSIVLJENJE ──
    // Onemogućen gumb ne emitira `click` (prvi pokušaj ovog testa je baš na tome pao), pa se
    // kroz UI do `_saveCard` uopće ne može doći. Zovemo ga izravno — tako se dokazuje guard u
    // kodu, a ne `disabled` atribut. Da guarda nema, kartica bi ovdje ušla u draft.
    await page.evaluate(() => _saveCard());
    await expect(page.locator('#adminEditModal #adminEditQ'), 'editor se zatvorio → kartica je spremljena')
      .toBeVisible();
    await expect(page.locator('#adminEditStatus')).toBeVisible();
    await expect(page.locator('#adminEditStatus'), 'poruka mora reći koji je strop')
      .toContainText(String(HARD));
    expect(await cat.locator('.admin-card').count(), 'predugačka kartica je ipak dodana').toBe(before);

    // ── TOČNO NA STROPU ── isti editor, samo jedan znak manje → mora proći
    const exact = await fillCard(page, 'M5a tocno na stropu', EXACT);
    expect(exact.aOver, '500 ne smije biti `is-over` — strop je uključiv').toBe(false);
    expect(exact.aWarn, '500 je preko mekanog praga → mora upozoravati').toBe(true);
    expect(exact.saveDisabled, '„Spremi" mora biti omogućen na točno 500').toBe(false);
    await page.click('#adminEditSave');
    await expect(cat.locator('.admin-card', { hasText: 'M5a tocno na stropu' })).toHaveCount(1);

    // Počisti draft — ništa se ne objavljuje, ali ni draft ne ostavljamo prljav.
    await clearDrafts(page);
  });

  test('mekani prag 200 upozorava, ali NE blokira spremanje', async ({ page }) => {
    await openLessonInDraftMode(page);
    const cat = page.locator('#adminCards .admin-cat').first();
    await cat.locator('[data-admin-add][data-type="flashcard"]').click();
    await page.waitForSelector('#adminEditModal #adminEditQ');

    const warn = await fillCard(page, 'M5a mekani prag', 'z'.repeat(201));
    expect(warn.aWarn, '201 mora upozoriti').toBe(true);
    expect(warn.aOver, '201 NE smije biti `is-over`').toBe(false);
    expect(warn.saveDisabled, 'mekani prag ne smije blokirati — 46 % kataloga je preko njega').toBe(false);

    await page.click('#adminEditSave');
    await expect(cat.locator('.admin-card', { hasText: 'M5a mekani prag' })).toHaveCount(1);
    await clearDrafts(page);
  });

  test('osobni materijal: isto ograničenje, isti editor', async ({ page }) => {
    await openMaterials(page);
    const id = await page.evaluate(() => window.SokratMaterials.createNode(null, 'study', 'M5a Mjera'));
    try {
      await page.evaluate(() => window.SokratMaterials.refresh());
      const row = page.locator('#myMaterials .mm-row[data-mm-id="' + id + '"]');
      await expect(row).toHaveCount(1, { timeout: 20000 });
      await row.locator('[data-mm-open]').click();

      await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
      await page.click('#stEdit');
      await page.click('#stCanvas [data-st-addcat]');
      await page.click('#stCanvas .st-tab[data-mode="cards"]');
      await page.click('#stCanvas .st-pane[data-pane="cards"] [data-admin-add][data-type="flashcard"]');

      // ── JEZGRA: Studio smije koristiti SAMO zajednički editor ──
      // Da Studio ikad dobije vlastiti editor kartica, ovaj selektor ne bi postojao i M5a bi
      // tiho vrijedio samo u pola proizvoda.
      await page.waitForSelector('#adminEditModal #adminEditQ');

      const over = await fillCard(page, 'M5a materijal predugo', OVER);
      expect(over.aOver, 'brojač u osobnom materijalu ne prepoznaje strop').toBe(true);
      expect(over.saveDisabled, '„Spremi" nije onemogućen u osobnom materijalu').toBe(true);

      await page.evaluate(() => _saveCard());   // izravno, iz istog razloga kao gore
      await expect(page.locator('#stCanvas .st-pane[data-pane="cards"] .st-edit-item'),
        'predugačka kartica je ušla u osobni materijal').toHaveCount(0);

      // Rub: 500 prolazi i ovdje.
      await fillCard(page, 'M5a materijal na stropu', EXACT);
      await page.click('#adminEditSave');
      await expect(page.locator('#stCanvas .st-pane[data-pane="cards"] .st-edit-item')).toHaveCount(1);
    } finally {
      await page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);
    }
  });
});
