// F3 K1 — EDITOR U ČVORU: IO-šav `SokratAdmin.studioBridge` vezan na `node_content`.
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// PIŠE u staging kroz owner-scoped RPC-ove i sve za sobom počisti. Prod se NE dira.
//
// Dokazuje ugovor faze F3: otvori study-čvor → uredi → `publish_node` → ponovno učitaj =
// sadržaj ostao + audit-redak zapisan + `base_version` lovi tuđu izmjenu.
const { test, expect } = require('@playwright/test');

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
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

const mkNode = (page, p, k, n) =>
  page.evaluate(([a, b, c]) => window.SokratMaterials.createNode(a, b, c), [p, k, n]);
const rmNode = (page, id) =>
  page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);

/** Pročitaj `node_content` izravno (anon/user JWT + owner-RLS). */
const readContent = (page, id) => page.evaluate(async (nodeId) => {
  const c = SokratAuth.getClient();
  const r = await c.from('node_content').select('payload,version').eq('node_id', nodeId).single();
  return r.error ? { error: r.error.message } : r.data;
}, id);

test.describe('F3 K1 — editor u čvoru (studioBridge → node_content)', () => {
  test('novi study-čvor ima PRAZAN payload i može u draft-mod', async ({ page }) => {
    await openProfile(page);
    const id = await mkNode(page, null, 'study', 'F3 Prazan');
    try {
      // `create_node` upisuje redak s `{}` → prazno je legitimno početno stanje, ne greška.
      expect(await readContent(page, id)).toEqual({ payload: {}, version: 1 });

      const entered = await page.evaluate(async (nodeId) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'F3 Prazan', null);
        await b.enter();
        return { editing: b.isEditing(), working: b.workingData(), ctx: b.nodeCtx() };
      }, id);
      expect(entered.editing, 'nije ušao u draft-mod nad praznim čvorom').toBe(true);
      expect(entered.working).toEqual({});
      expect(entered.ctx.nodeId).toBe(id);
    } finally {
      await rmNode(page, id);
    }
  });

  test('uredi → publish_node → ponovno učitaj: sadržaj ostao + verzija + audit-redak', async ({ page }) => {
    await openProfile(page);
    const id = await mkNode(page, null, 'study', 'F3 Objava');
    try {
      const res = await page.evaluate(async (nodeId) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'F3 Objava', null);
        await b.enter();
        // Ista draft-mašinerija kao admin: op → working → publish (nema posebnog puta za čvor).
        const opRes = window.SokratDraft.applyOp('node:' + nodeId, 'content', {
          type: 'addCategory',
          catId: 'uvod',
          category: {
            name: 'Uvod', icon: 'fa-book', color: '#6366f1',
            flashcards: [{ question: 'Pitanje 1', answer: 'Odgovor 1' }],
            quiz: [], fillBlanks: []
          }
        });
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        // ⚠️ `dirty` se čita PRIJE objave — `commitDone` ga re-baselinea na false.
        const dirtyBefore = !!(d && d.dirty);
        await b.publish();
        return { opRes: opRes, dirtyBefore: dirtyBefore, editingAfter: b.isEditing() };
      }, id);
      expect(res.dirtyBefore, 'op nije ušao u draft (applyOp: '
        + JSON.stringify(res.opRes) + ')').toBe(true);
      expect(res.editingAfter, 'nije izašao iz draft-moda nakon objave').toBe(false);

      // 1) sadržaj je STVARNO u bazi, s bumpanom verzijom
      const after = await readContent(page, id);
      expect(after.version, 'verzija nije bumpana').toBe(2);
      expect(after.payload.uvod.name).toBe('Uvod');
      expect(after.payload.uvod.flashcards[0].question).toBe('Pitanje 1');

      // 2) audit: `node_content_versions` je dobio snimku (append-only)
      const audit = await page.evaluate(async (nodeId) => {
        const c = SokratAuth.getClient();
        const r = await c.from('node_content_versions').select('id,op').eq('node_id', nodeId);
        return r.error ? { error: r.error.message } : r.data.length;
      }, id);
      expect(audit, 'audit-redak nije zapisan').toBeGreaterThanOrEqual(1);
    } finally {
      await rmNode(page, id);
    }
  });

  test('base_version lovi tuđu izmjenu (publish_version_conflict)', async ({ page }) => {
    await openProfile(page);
    const id = await mkNode(page, null, 'study', 'F3 Konflikt');
    try {
      const err = await page.evaluate(async (nodeId) => {
        const c = SokratAuth.getClient();
        // netko drugi (drugi tab/uređaj) objavi PRIJE nas → verzija u bazi odmakne
        await c.rpc('publish_node', { p_node_id: nodeId, p_payload: { a: {} }, p_base_version: 1 });
        // mi objavljujemo na ZASTARJELU bazu
        const r = await c.rpc('publish_node', { p_node_id: nodeId, p_payload: { b: {} }, p_base_version: 1 });
        return r.error ? r.error.message : null;
      }, id);
      expect(err, 'zastarjeli base_version je prošao — optimistic concurrency ne radi').toMatch(/publish_version_conflict/);

      // izgubljeni pokušaj NIJE upisan
      const after = await readContent(page, id);
      expect(after.payload).toEqual({ a: {} });
    } finally {
      await rmNode(page, id);
    }
  });

  test('setLesson gasi node-mod (povratak na klasični predmet ne piše u čvor)', async ({ page }) => {
    await openProfile(page);
    const id = await mkNode(page, null, 'study', 'F3 Prebacivanje');
    try {
      const ctx = await page.evaluate(async (nodeId) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'F3 Prebacivanje', null);
        const inNode = !!b.nodeCtx();
        b.setLesson('marketing', 'midterm-1', null);
        return { inNode: inNode, afterLesson: b.nodeCtx() };
      }, id);
      expect(ctx.inNode).toBe(true);
      expect(ctx.afterLesson, 'node-kontekst preživio povratak na predmet').toBeNull();
    } finally {
      await rmNode(page, id);
    }
  });
});
