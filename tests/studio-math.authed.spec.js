// STUDIO + KaTeX — formula se mora TIPOGRAFIRATI u Studio-canvasu, ne ostati kao kod.
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// PIŠE u staging kroz owner-scoped RPC-ove i sve za sobom počisti. Prod se NE dira.
//
// BUG (Leon, 2026-08-06, uočen UŽIVO na produkciji u osobnom gradivu):
//   `blocks-renderer.js` NAMJERNO ispljune `\[tex\]` kao TEKST (sigurnosna granica — renderer
//   ne tipografira). Pozivatelj mora nakon umetanja pozvati `renderMath()`. `js/learn.js` to
//   radi za studentsku stranicu; **`js/studio.js` nikad nije bio ožičen** → u Studiju je formula
//   ostajala kao sirovi LaTeX.
//   Za OSOBNO GRADIVO je to teže nego za katalog: čvor se gleda ISKLJUČIVO u Studiju, pa se
//   formula tamo ne tipografira NIKAD — ni u pregledu, ni nakon objave.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');
// T6: editor je vlastiti dokument — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriStudio, otvoriAplikaciju } = require('./helpers/studio-entry');

const TEX = '\\sqrt{55}\\pm\\frac{154}{85}';

async function openMaterials(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile', 'study']);
  await page.waitForFunction(() =>
    !!window.SokratMaterials && !!window.SokratAdmin
    && typeof window.navigateTo === 'function');
  // KaTeX auto-render stiže s CDN-a uz paket `study` (do 2026-09-04 `defer` u `index.html`) —
  // bez njega je renderMath TIHI no-op i test bi lažno pao na infrastrukturi umjesto na regresiji.
  await page.waitForFunction(() => typeof window.renderMathInElement === 'function', null, { timeout: 20000 });
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
  await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });
}

const mkNode = (page, p, k, n) =>
  page.evaluate(([a, b, c]) => window.SokratMaterials.createNode(a, b, c), [p, k, n]);
// ⚠️ T6: čišćenje traži APLIKACIJU — `SokratMaterials` ne postoji na stranici editora,
// a test ondje često i završi; bez povratka kući `finally` bi rušio umjesto da čisti.
const rmNode = async (page, id) => {
  await otvoriAplikaciju(page);
  await page.waitForFunction(() => !!window.SokratMaterials, null, { timeout: 20000 });
  await page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);
};

/** Objavi sekciju s formula-blokom kroz isti put kao gumb „Objavi". */
const publishFormula = (page, id, name, tex) => page.evaluate(async ([nodeId, nm, t]) => {
  const b = window.SokratAdmin.studioBridge;
  b.setNode(nodeId, nm, {});
  await b.enter();
  const d = window.SokratDraft.get('node:' + nodeId, 'content');
  window.SokratDraft.applyOp(d.subjectId, d.lessonId, {
    type: 'addCategory', catId: 'sekcija-1',
    category: {
      name: 'Formule', icon: 'fa-book', color: '#6366f1',
      flashcards: [], quiz: [], fillBlanks: [],
      learn: { blocks: [
        { type: 'paragraph', text: 'prije formule' },
        { type: 'formula', tex: t, display: true },
      ] } },
  });
  await b.publish();
}, [id, name, tex]);

test.describe('Studio — KaTeX u canvasu', () => {
  test('objavljena formula se u Studiju TIPOGRAFIRA (ne ostaje sirovi LaTeX)', async ({ page }) => {
    await openMaterials(page);
    const id = await mkNode(page, null, 'study', 'Studio Math');
    try {
      // T6: bridge i Studio žive na stranici editora, ne u aplikaciji.
      await otvoriStudio(page);
      await publishFormula(page, id, 'Studio Math', TEX);

      await page.evaluate((nodeId) => window.SokratStudio.openNode(nodeId, 'Studio Math'), id);
      await page.waitForSelector('#editor-page.active', { timeout: 15000 });
      // Read-only pregled (bez klika na „Uredi") — to je prikaz koji je Leon vidio slomljen.
      await page.waitForSelector('.st-pane[data-pane="learn"] .lb-formula', { timeout: 15000 });

      // 1) KaTeX je STVARNO prošao kroz formula-blok.
      await expect.poll(
        () => page.$$eval('.st-pane[data-pane="learn"] .lb-formula .katex', (els) => els.length),
        { timeout: 5000, message: 'formula nije tipografirana — renderMath nije pozvan nad canvasom' },
      ).toBeGreaterThan(0);

      // 2) Sirovi LaTeX se NE smije vidjeti kao tekst (ovo je bio simptom na slici).
      const rawVisible = await page.$eval('.st-pane[data-pane="learn"]', (el, needle) =>
        el.innerText.includes(needle), '\\sqrt{55}');
      expect(rawVisible, 'sirovi \\sqrt{55} je i dalje vidljiv kao tekst').toBe(false);

      // 3) Kontrola: obični tekst oko formule je netaknut (renderMath nije pojeo sadržaj).
      const proseOk = await page.$eval('.st-pane[data-pane="learn"]', (el) =>
        el.innerText.includes('prije formule'));
      expect(proseOk, 'renderMath ne smije dirati običan tekst').toBe(true);
    } finally {
      await rmNode(page, id);
    }
  });

  test('u EDIT-modu formula ostaje uredljiva (KaTeX ne smije zagristi contenteditable)', async ({ page }) => {
    await openMaterials(page);
    const id = await mkNode(page, null, 'study', 'Studio Math Edit');
    try {
      // T6: bridge i Studio žive na stranici editora, ne u aplikaciji.
      await otvoriStudio(page);
      await publishFormula(page, id, 'Studio Math Edit', TEX);
      await page.evaluate((nodeId) => window.SokratStudio.openNode(nodeId, 'Studio Math Edit'), id);
      await page.waitForSelector('#editor-page.active', { timeout: 15000 });
      await page.click('#stEdit');
      await page.waitForSelector('.st-learn-cat', { timeout: 15000 });

      // Tekstualni blok je contenteditable i mora sadržavati IZVORNI tekst, ne KaTeX-markup.
      const editableHtml = await page.$$eval('[contenteditable="true"]', (els) =>
        els.map((e) => e.innerHTML).join('\n'));
      expect(editableHtml.includes('katex'),
        'KaTeX se ne smije ubaciti u contenteditable (serijalizator bi to spremio natrag)').toBe(false);

      // Draft mora i dalje nositi ISTI `tex` — dokaz da prikaz nije pokvario model.
      const tex = await page.evaluate((nodeId) => {
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        const blocks = d.working['sekcija-1'].learn.blocks;
        const f = blocks.find((b) => b.type === 'formula');
        return f ? f.tex : null;
      }, id);
      expect(tex, 'model formule je promijenjen prikazom').toBe(TEX);
    } finally {
      await rmNode(page, id);
    }
  });

  test('INLINE matematika: označi dio rečenice → √x u traci → math-run → tipografirano u pregledu', async ({ page }) => {
    await openMaterials(page);
    const id = await mkNode(page, null, 'study', 'Inline Math');
    try {
      // T6: bridge i Studio žive na stranici editora, ne u aplikaciji.
      await otvoriStudio(page);
      // Sekcija s običnim odlomkom — dalje sve ide kroz PRAVI editor, ne kroz opove.
      await page.evaluate(async ([nodeId]) => {
        const b = window.SokratAdmin.studioBridge;
        b.setNode(nodeId, 'Inline Math', {});
        await b.enter();
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        window.SokratDraft.applyOp(d.subjectId, d.lessonId, {
          type: 'addCategory', catId: 'sekcija-1',
          category: { name: 'Tekst', icon: 'fa-book', color: '#6366f1',
            flashcards: [], quiz: [], fillBlanks: [], learn: { blocks: [] } },
        });
        await b.publish();
      }, [id]);

      await page.evaluate((nodeId) => window.SokratStudio.openNode(nodeId, 'Inline Math'), id);
      await page.waitForSelector('#editor-page.active', { timeout: 15000 });
      await page.click('#stEdit');
      await page.waitForSelector('#stCanvas .be-mount .be-root', { timeout: 15000 });

      // Dodaj Tekst blok i upiši rečenicu s matematikom USRED nje.
      await page.locator('#stCanvas .be-mount .be-bigplus').first().click();
      await page.waitForSelector('.be-menu .be-menu-item');
      await page.locator('.be-menu .be-menu-item', { hasText: 'Tekst' }).click();
      const editable = page.locator('#stCanvas .be-mount .be-block').last().locator('[data-be-field="text"]');
      await editable.click();
      await page.keyboard.type('ako je x^2 onda');
      await page.locator('#stCanvas .st-head h1').click();

      // Označi SAMO „x^2" (znakovi 7–10) — ovo je bit cigle: dio rečenice, ne cijeli blok.
      await editable.click();
      await page.evaluate(() => {
        const blocks = document.querySelectorAll('#stCanvas .be-mount .be-block');
        const el = blocks[blocks.length - 1].querySelector('[data-be-field="text"]');
        const node = el.firstChild;
        const r = document.createRange(); r.setStart(node, 7); r.setEnd(node, 10);
        const s = document.getSelection(); s.removeAllRanges(); s.addRange(r);
        document.dispatchEvent(new Event('selectionchange'));
      });
      await page.waitForSelector('.be-toolbar.on', { timeout: 5000 });
      await page.locator('.be-toolbar .be-tb[data-be-mathact]').click();
      await page.locator('#stCanvas .st-head h1').click();       // blur → serijalizacija

      // Draft: tekst je razlomljen na tekst + math + tekst, a formula nosi TOČAN LaTeX.
      const runs = await page.evaluate((nodeId) => {
        const d = window.SokratDraft.get('node:' + nodeId, 'content');
        const blks = d.working['sekcija-1'].learn.blocks;
        const p = blks.find((b) => Array.isArray(b.text) && b.text.some((r) => r.math));
        return p ? p.text : null;
      }, id);
      expect(runs, 'nijedan blok nema math-run').not.toBeNull();
      const math = runs.filter((r) => r.math);
      expect(math).toHaveLength(1);
      expect(math[0].text).toBe('x^2');
      expect(runs.map((r) => r.text).join('')).toBe('ako je x^2 onda');

      // Objavi pa izađi iz edita → u pregledu mora biti TIPOGRAFIRANO, a tekst oko njega cijel.
      // Objava NEMA potvrdu (za razliku od „Odbaci"/brisanja) — `#stPublish` zove publish izravno.
      // ⚠ Ne provjeravati `locator.count()` za `<sokrat-confirm>`: komponenta je UVIJEK u DOM-u,
      // samo zatvorena → count()>0, a `.click()` bi onda čekao vidljivost do isteka testa.
      await page.click('#stPublish');
      await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });

      await expect.poll(
        () => page.$$eval('#stCanvas .lb-imath .katex', (els) => els.length),
        { timeout: 8000, message: 'inline formula nije tipografirana u pregledu' },
      ).toBeGreaterThan(0);
      const prose = await page.$eval('.st-pane[data-pane="learn"]', (el) => el.innerText);
      expect(prose.includes('ako je'), 'tekst prije formule je nestao').toBe(true);
      expect(prose.includes('onda'), 'tekst poslije formule je nestao').toBe(true);
    } finally {
      await rmNode(page, id);
    }
  });
});
