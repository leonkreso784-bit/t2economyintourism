// F4 — PRIVATNE SLIKE OSOBNOG GRADIVA (CREATE_BACKEND_SPEC §11, S1+S2).
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// PIŠE u staging (Storage + node_content) i sve za sobom počisti. Prod se NE dira.
//
// Dokazuje ugovor: u node-modu upload ide u PRIVATNI `node-images` pod vlasnički prefiks,
// u payload se sprema STABILNA oznaka `node-img:<putanja>` (nikad potpis koji istječe),
// a pri prikazu se oznaka razrješava u potpisani URL — bez diranja `js/blocks-renderer.js`.
//
// RLS/HTTP stranu (tuđi prefiks, anon, javni URL) pokriva `npm run test:storage`.
const { test, expect } = require('@playwright/test');

// 1x1 PNG — najmanji valjani teret.
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

async function openApp(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() =>
    !!window.SokratMaterials && !!window.SokratAdmin && !!window.SokratDraft
    && !!window.SokratNodeImages && typeof window.renderBlocks === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
}

const mkNode = (page, p, k, n) =>
  page.evaluate(([a, b, c]) => window.SokratMaterials.createNode(a, b, c), [p, k, n]);
const rmNode = (page, id) =>
  page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);

/** Upload kroz PRAVI editorski put (`__beMedia().uploadImage`) u zadanom kontekstu. */
const uploadVia = (page, b64) => page.evaluate(async (b64s) => {
  const bin = atob(b64s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const file = new File([bytes], 'probe.png', { type: 'image/png' });
  const media = window.__beMedia({ esc: (s) => String(s), preview: () => '' });
  try { return { ok: true, src: await media.uploadImage(file) }; }
  catch (e) { return { ok: false, err: e && e.message }; }
}, b64);

const rmObject = (page, bucket, path) => page.evaluate(([b, p]) =>
  SokratAuth.getClient().storage.from(b).remove([p]).then(() => true).catch(() => false), [bucket, path]);

test.describe('F4 — privatne slike osobnog gradiva', () => {
  test('upload u node-modu ide u node-images pod vlasnički prefiks i vraća oznaku', async ({ page }) => {
    await openApp(page);
    const id = await mkNode(page, null, 'study', 'F4 Slika');
    let path = null;
    try {
      await page.evaluate((nodeId) => window.SokratAdmin.studioBridge.setNode(nodeId, 'F4 Slika', {}), id);
      const res = await uploadVia(page, PNG_B64);
      expect(res.ok, 'upload je pao: ' + res.err).toBe(true);

      // U payload NIKAD ne smije ući URL — samo stabilna oznaka.
      expect(res.src).toMatch(/^node-img:/);
      expect(res.src).not.toMatch(/^https?:/);

      path = res.src.replace(/^node-img:/, '');
      const uid = await page.evaluate(() => SokratAuth.getUser().id);
      const seg = path.split('/');
      expect(seg[0], 'prvi segment MORA biti vlasnik (RLS ga provjerava)').toBe(uid);
      expect(seg[1], 'drugi segment = node id').toBe(id);
      expect(seg).toHaveLength(3);
    } finally {
      if (path) await rmObject(page, 'node-images', path);
      await rmNode(page, id);
    }
  });

  test('objavljeni payload zadrži OZNAKU (potpis koji istječe ne smije u bazu)', async ({ page }) => {
    await openApp(page);
    const id = await mkNode(page, null, 'study', 'F4 Objava slike');
    let path = null;
    try {
      await page.evaluate((nodeId) => window.SokratAdmin.studioBridge.setNode(nodeId, 'F4 Objava slike', {}), id);
      const res = await uploadVia(page, PNG_B64);
      expect(res.ok, 'upload je pao: ' + res.err).toBe(true);
      path = res.src.replace(/^node-img:/, '');

      // Uredi kroz draft + objavi kroz publish_node (isti put kao editor).
      await page.evaluate(async ([nodeId, src]) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'F4 Objava slike', {});
        await b.enter();
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        window.SokratDraft.applyOp(d.subjectId, d.lessonId, {
          type: 'addCategory', catId: 'sekcija-1',
          category: { name: 'S', icon: 'fa-book', color: '#06b6d4',
            flashcards: [], quiz: [], fillBlanks: [],
            learn: { blocks: [{ type: 'image', src: src, alt: 'probe' }] } }
        });
        await b.publish();
      }, [id, res.src]);

      const stored = await page.evaluate(async (nodeId) => {
        const r = await SokratAuth.getClient().from('node_content')
          .select('payload,version').eq('node_id', nodeId).single();
        return r.error ? { error: r.error.message } : r.data;
      }, id);

      const storedSrc = stored.payload['sekcija-1'].learn.blocks[0].src;
      expect(storedSrc).toBe('node-img:' + path);
      expect(storedSrc, 'potpisani URL u bazi bi „istrunuo" kad token istekne').not.toMatch(/token=/);
      expect(stored.version).toBe(2);
    } finally {
      if (path) await rmObject(page, 'node-images', path);
      await rmNode(page, id);
    }
  });

  test('pri prikazu se oznaka razriješi u POTPISANI URL koji stvarno vraća sliku', async ({ page }) => {
    await openApp(page);
    const id = await mkNode(page, null, 'study', 'F4 Prikaz');
    let path = null;
    try {
      await page.evaluate((nodeId) => window.SokratAdmin.studioBridge.setNode(nodeId, 'F4 Prikaz', {}), id);
      const res = await uploadVia(page, PNG_B64);
      expect(res.ok, 'upload je pao: ' + res.err).toBe(true);
      path = res.src.replace(/^node-img:/, '');

      const out = await page.evaluate(async (src) => {
        const NI = window.SokratNodeImages;
        NI.clear();                                        // kreni od praznog cachea, kao pri otvaranju čvora
        const payload = { s1: { learn: { blocks: [{ type: 'image', src: src, alt: 'probe' }] } } };

        const before = window.renderBlocks(payload.s1.learn.blocks);   // BEZ potpisa = fail-safe
        const signed = await NI.prefetch(payload);
        const blocks = NI.resolveBlocks(payload.s1.learn.blocks);
        const after = window.renderBlocks(blocks);

        const m = after.match(/<img[^>]+src="([^"]+)"/);
        let fetched = 0;
        if (m) {
          const r = await fetch(m[1].replace(/&amp;/g, '&'));
          fetched = r.status;
        }
        return {
          before, after, signed, url: m ? m[1] : null, fetched,
          payloadSrc: payload.s1.learn.blocks[0].src,
        };
      }, res.src);

      // Fail-safe: nerazriješena oznaka NE proizvede <img> (safeUrl odbije nepoznatu shemu).
      expect(out.before).not.toContain('<img');

      expect(out.signed, 'prefetch nije potpisao nijednu putanju').toBe(1);
      expect(out.url, 'nakon razrješavanja mora postojati <img>').toBeTruthy();
      expect(out.url).toContain('/object/sign/node-images/');
      expect(out.url).toContain('token=');
      expect(out.fetched, 'potpisani URL mora stvarno vratiti sliku').toBe(200);

      // Razrješavanje NE SMIJE mutirati payload — u njemu ostaje oznaka.
      expect(out.payloadSrc).toBe('node-img:' + path);
    } finally {
      if (path) await rmObject(page, 'node-images', path);
      await rmNode(page, id);
    }
  });

  // ── BUG-024 — regresija koju je prijavio KORISNIK, ne gate ──────────────────────────────────
  // Prethodni test dokazuje razrješavanje kad ga netko RUČNO pokrene. Točno to je bila rupa:
  // slika se vidjela u editoru (Studio radi prefetch+resolve), a nestajala pri UČENJU, jer je
  // `learn.js` renderirao izravno. Ovaj test ide korisnikovim putem do kraja i — presudno —
  // ISPRAZNI cache prije učenja, pa ne može proći na ostacima uređivačke sesije.
  test('BUG-024: slika objavljena u materijalu VIDI SE u Learnu (i pri hladnom ulasku)', async ({ page }) => {
    await openApp(page);
    const id = await mkNode(page, null, 'study', 'BUG-024 Learn slika');
    let path = null;
    try {
      await page.evaluate((nodeId) => window.SokratAdmin.studioBridge.setNode(nodeId, 'BUG-024 Learn slika', {}), id);
      const res = await uploadVia(page, PNG_B64);
      expect(res.ok, 'upload je pao: ' + res.err).toBe(true);
      path = res.src.replace(/^node-img:/, '');

      // Objavi sliku istim putem kojim je objavljuje autor (draft → publish_node).
      await page.evaluate(async ([nodeId, src]) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'BUG-024 Learn slika', {});
        await b.enter();
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        window.SokratDraft.applyOp(d.subjectId, d.lessonId, {
          type: 'addCategory', catId: 'sekcija-1',
          category: { name: 'S', icon: 'fa-book', color: '#06b6d4',
            flashcards: [], quiz: [], fillBlanks: [],
            learn: { blocks: [{ id: 'b1', type: 'image', src: src, alt: 'probe' }] } }
        });
        await b.publish();
      }, [id, res.src]);

      // HLADAN ULAZ: bez ovoga bi test prošao i s bugom — potpisi iz uređivanja su još u memoriji.
      await page.evaluate(() => window.SokratNodeImages.clear());

      // `ensureRegistered`, ne `refresh`: refresh tiho odustane kad kartica materijala nije
      // montirana (BUG-023), a ovaj test namjerno ne prolazi kroz UI stabla.
      await page.evaluate(async (nodeId) => {
        await window.SokratMaterials.ensureRegistered();
        window.SokratMaterials.learnNode(nodeId);
      }, id);
      await page.waitForFunction((nodeId) => AppState.nav.subject === 'node:' + nodeId
        && AppState.nav.data && Object.keys(AppState.nav.data).length > 0, id, { timeout: 20000 });

      await page.click('.study-nav-btn[data-section="learn"]');
      await expect(page.locator('#learn.section.active')).toHaveCount(1, { timeout: 10000 });

      // JEZGRA: prije popravka ovdje NIJE bilo <img> (safeUrl tiho odbije `node-img:` shemu).
      const img = page.locator('#learnContent img.lb-image, #learnContent img');
      await expect(img, 'slika iz materijala mora postojati u Learnu').toHaveCount(1, { timeout: 10000 });

      const src = await img.first().getAttribute('src');
      expect(src, 'oznaka je stigla do DOM-a nerazriješena').not.toMatch(/^node-img:/);
      expect(src).toContain('/object/sign/node-images/');
      expect(src).toContain('token=');

      // Potpis mora stvarno vraćati bajtove — „ima src" nije isto što i „slika se vidi".
      const status = await page.evaluate((u) => fetch(u).then((r) => r.status).catch(() => 0), src);
      expect(status, 'potpisani URL ne vraća sliku').toBe(200);

      // Invarijanta F4 drži i nakon svega: u bazi je i dalje OZNAKA, ne potpis.
      const stored = await page.evaluate(async (nodeId) => {
        const r = await SokratAuth.getClient().from('node_content').select('payload').eq('node_id', nodeId).single();
        return r.error ? null : r.data.payload['sekcija-1'].learn.blocks[0].src;
      }, id);
      expect(stored).toBe('node-img:' + path);
    } finally {
      if (path) await rmObject(page, 'node-images', path);
      await rmNode(page, id);
    }
  });

  test('katalog-mod je NEDIRNUT: upload i dalje ide u javni lesson-images', async ({ page }) => {
    await openApp(page);
    let pubUrl = null;
    try {
      // setLesson gasi node-mod → mora se vratiti stari put (javni bucket + public URL).
      await page.evaluate(() => window.SokratAdmin.studioBridge.setLesson('management', 'midterm-1', {}));
      const res = await uploadVia(page, PNG_B64);
      expect(res.ok, 'upload je pao: ' + res.err).toBe(true);
      expect(res.src).toMatch(/^https?:/);
      expect(res.src).toContain('/lesson-images/');
      expect(res.src).not.toMatch(/^node-img:/);
      pubUrl = res.src;
    } finally {
      if (pubUrl) {
        const name = pubUrl.split('/lesson-images/')[1];
        if (name) await rmObject(page, 'lesson-images', name.split('?')[0]);
      }
    }
  });
});
