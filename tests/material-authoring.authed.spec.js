// M1 — AUTORSTVO U PRAZNOM MATERIJALU (faza „Materijal od nule do učenja").
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// PIŠE u staging kroz owner-scoped RPC-ove i sve za sobom počisti. Prod se NE dira.
//
// BUG koji ovo lovi (Leon, 2026-08-07): u vlastitom materijalu se NIJE mogla napraviti
// nijedna kartica, pitanje kviza ni dopuna. `presentModes` je označavao mod postojećim
// SAMO ako je niz nepraznan → nov materijal ima prazne nizove → tab se ne nacrta →
// nema gumba „＋ Dodaj" → prva stavka se ne može dodati NIKAD.
// Uređivači su cijelo vrijeme postojali i radili — bili su samo nedostupni.
//
// Zato prvi test gleda AFORDANCIJU (postoji li put do prve stavke), a drugi prolazi
// tim putem do kraja i provjerava da stavke prežive objavu. Kriterij 1 iz
// `docs/product/UGC_SPEC.md` traži oboje.
const { test, expect } = require('@playwright/test');

const MODES = ['learn', 'cards', 'quiz', 'fill'];

async function openProfile(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() =>
    !!window.SokratMaterials && !!window.SokratAdmin && !!window.SokratDraft
    && typeof window.navigateTo === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  // ⚠ Spinner dijeli selektor s praznim stanjem — čekaj da NESTANE, inače test prolazi nad učitavanjem.
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

const mkNode = (page, p, k, n) =>
  page.evaluate(([a, b, c]) => window.SokratMaterials.createNode(a, b, c), [p, k, n]);
const rmNode = (page, id) =>
  page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);
const readContent = (page, id) => page.evaluate(async (nodeId) => {
  const c = SokratAuth.getClient();
  const r = await c.from('node_content').select('payload,version').eq('node_id', nodeId).single();
  return r.error ? { error: r.error.message } : r.data;
}, id);

/** Otvori SVJEŽ materijal u Studiju, uđi u draft-mod i dodaj prvu sekciju. */
async function openFreshMaterialWithSection(page, name) {
  const id = await mkNode(page, null, 'study', name);
  await page.evaluate(() => window.SokratMaterials.refresh());
  const row = page.locator('#myMaterials .mm-row[data-mm-id="' + id + '"]');
  await expect(row).toHaveCount(1, { timeout: 20000 });
  await row.locator('[data-mm-open]').click();

  await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
  await page.click('#stEdit');

  // Prazan materijal → canvas nudi samo „＋ Nova sekcija" (nema nijedne kategorije).
  await page.click('#stCanvas [data-st-addcat]');
  await expect(page.locator('#stCanvas .st-learn-cat')).toHaveCount(1, { timeout: 20000 });
  return id;
}

test.describe('M1 — autorstvo u praznom materijalu', () => {
  test('nova sekcija nudi SVA ČETIRI moda, svaki s putem do prve stavke', async ({ page }) => {
    await openProfile(page);
    const id = await openFreshMaterialWithSection(page, 'M1 Modovi');
    try {
      // ── JEZGRA REGRESIJE ──
      // Prije popravka ovdje je bio SAMO `learn` (prazni nizovi = mod „ne postoji").
      for (const mode of MODES) {
        await expect(
          page.locator('#stCanvas .st-tab[data-mode="' + mode + '"]'),
          'mod „' + mode + '" se ne nudi u praznom materijalu → prva stavka se ne može dodati'
        ).toHaveCount(1);
      }

      // Afordancija mora POSTOJATI, ne samo tab: svaki od tri kviz-modova nudi „＋ Dodaj".
      for (const [mode, type] of [['cards', 'flashcard'], ['quiz', 'quiz'], ['fill', 'fill']]) {
        await page.click('#stCanvas .st-tab[data-mode="' + mode + '"]');
        const pane = page.locator('#stCanvas .st-pane[data-pane="' + mode + '"]');
        await expect(
          pane.locator('[data-admin-add][data-type="' + type + '"]'),
          'mod „' + mode + '" nema gumb za dodavanje prve stavke'
        ).toHaveCount(1);
      }
    } finally {
      await rmNode(page, id);
    }
  });

  test('kartica + pitanje kviza + dopuna: dodaj kroz UI → objavi → prežive', async ({ page }) => {
    await openProfile(page);
    const id = await openFreshMaterialWithSection(page, 'M1 Prva stavka');
    try {
      // ── KARTICA ──
      await page.click('#stCanvas .st-tab[data-mode="cards"]');
      await page.click('#stCanvas .st-pane[data-pane="cards"] [data-admin-add][data-type="flashcard"]');
      await page.waitForSelector('#adminEditModal #adminEditQ');
      await page.fill('#adminEditQ', 'M1 pitanje kartice');
      await page.fill('#adminEditA', 'M1 odgovor');
      await page.click('#adminEditSave');
      await expect(page.locator('#stCanvas .st-pane[data-pane="cards"] .st-edit-item')).toHaveCount(1);

      // ── PITANJE KVIZA ── (2 opcije; druga je točna)
      await page.click('#stCanvas .st-tab[data-mode="quiz"]');
      await page.click('#stCanvas .st-pane[data-pane="quiz"] [data-admin-add][data-type="quiz"]');
      await page.waitForSelector('#adminQuizModal #adminQuizQ');
      await page.fill('#adminQuizQ', 'M1 pitanje kviza');
      const opts = page.locator('#adminQuizOpts .admin-quiz-optinput');
      while (await opts.count() < 2) await page.click('#adminQuizAddOpt');
      await opts.nth(0).fill('netočno');
      await opts.nth(1).fill('točno');
      await page.locator('#adminQuizOpts input[type=radio]').nth(1).check();
      await page.click('#adminQuizSave');
      await expect(page.locator('#stCanvas .st-pane[data-pane="quiz"] .st-edit-item')).toHaveCount(1);

      // ── DOPUNA ──
      await page.click('#stCanvas .st-tab[data-mode="fill"]');
      await page.click('#stCanvas .st-pane[data-pane="fill"] [data-admin-add][data-type="fill"]');
      await page.waitForSelector('#adminFillModal #adminFillS');
      await page.fill('#adminFillS', 'M1 rečenica s _______ prazninom');
      await page.fill('#adminFillA', 'jednom');
      await page.click('#adminFillSave');
      await expect(page.locator('#stCanvas .st-pane[data-pane="fill"] .st-edit-item')).toHaveCount(1);

      // ── OBJAVA ──
      // ⚠ Objava NEMA potvrdu (za razliku od „Odbaci"/brisanja) — `#stPublish` zove publish izravno.
      await page.click('#stPublish');
      await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });

      // ── DOKAZ U BAZI: stavke su preživjele, ne samo nacrtane ──
      const saved = await readContent(page, id);
      expect(saved.error, 'node_content se ne da pročitati').toBeUndefined();
      const cat = Object.values(saved.payload)[0];
      expect(cat, 'objavljeni payload nema nijednu sekciju').toBeTruthy();
      expect(cat.flashcards.map((f) => f.question)).toContain('M1 pitanje kartice');
      expect(cat.quiz.map((q) => q.question)).toContain('M1 pitanje kviza');
      expect(cat.quiz[0].correct, 'točan odgovor nije zapamćen kao indeks 1').toBe(1);
      expect(cat.fillBlanks.map((f) => f.answer)).toContain('jednom');
      expect(saved.version, 'objava mora podići verziju').toBeGreaterThan(1);
    } finally {
      await rmNode(page, id);
    }
  });
});
