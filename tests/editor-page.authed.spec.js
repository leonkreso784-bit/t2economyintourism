// T6 — STRANICA EDITORA S PRAVOM PRIJAVOM (spec §9.13).
// Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt sa STAGING_*.
// PIŠE u staging kroz owner-scoped RPC-ove i sve za sobom počisti. Prod se NE dira.
//
// Dvije tvrdnje, i druga je važnija:
//   ① vlastiti materijal se otvara, a IME DOLAZI IZ BAZE — ne iz adrese;
//   ② tuđi/nepostojeći materijal se odbija, i Studio se ne nacrta ni prazan.
//
// ⚠️ ZAŠTO IME NE SMIJE STIĆI URL-om: `?node=` je jedino što stranica dobiva izvana, i ono
// je puki ID. Da se uz njega primalo i ime, stranica bi tuđem linku vjerovala na riječ i
// ispisala tuđi tekst u vlastito sučelje. Ovako isti upit koji donosi ime ujedno DOKAZUJE
// vlasništvo: RLS ga izda samo vlasniku, pa je prazan odgovor odgovor „nije tvoj".
const { test, expect } = require('@playwright/test');

async function otvoriMaterijale(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
  });
  await page.goto('/');
  await page.waitForFunction(() =>
    !!window.SokratMaterials && typeof window.navigateTo === 'function');
  await page.waitForFunction(() => window.SokratMaterials.isAvailable(), null, { timeout: 20000 });
}

const mkNode = (page, p, k, n) =>
  page.evaluate(([a, b, c]) => window.SokratMaterials.createNode(a, b, c), [p, k, n]);
const rmNode = (page, id) =>
  page.evaluate((i) => window.SokratMaterials.deleteNode(i).catch(() => {}), id);

test.describe('T6 — editor.html kao prava adresa', () => {
  test('vlastiti materijal se otvara; ime u mrvici dolazi IZ BAZE', async ({ page }) => {
    await otvoriMaterijale(page);
    const ime = 'T6 Adresa ' + Date.now();
    const id = await mkNode(page, null, 'study', ime);
    try {
      await page.goto('/editor.html?node=' + id);

      // Stanje, ne vrijeme: platno Studija postoji tek kad je čuvar propustio.
      await page.waitForSelector('#editor-page.active #stCanvas', { timeout: 30000 });

      const stanje = await page.evaluate(() => {
        const g = document.getElementById('edGuard');
        return {
          cuvarVidljiv: !!(g && !g.hidden && getComputedStyle(g).display !== 'none'),
          mrvica: (document.getElementById('crumbs') || {}).textContent,
          trakaStudija: !!document.querySelector('#editor-page .st-topbar')
        };
      });

      expect(stanje.cuvarVidljiv, 'čuvar je ostao preko editora').toBe(false);
      expect(stanje.trakaStudija, 'Studio nije nacrtao svoju traku').toBe(true);
      expect(stanje.mrvica, 'mrvica ne pokazuje ime materijala iz baze').toContain(ime);
    } finally {
      await otvoriMaterijale(page);
      await rmNode(page, id);
    }
  });

  test('tuđi/nepostojeći materijal: čuvar odbija, Studio se ne crta', async ({ page }) => {
    await otvoriMaterijale(page);
    // Postojeći ID tuđeg materijala i nepostojeći ID prolaze ISTIM putem: RLS oba vrati
    // prazna, pa se test tuđim računom ne mora (ni ne može) glumiti.
    await page.goto('/editor.html?node=00000000-0000-4000-8000-000000000000');
    await page.waitForSelector('#edGuardBack:visible', { timeout: 30000 });

    const stanje = await page.evaluate(() => {
      const ed = document.getElementById('editor-page');
      return {
        poruka: (document.getElementById('edGuardMsg') || {}).textContent.trim(),
        editorAktivan: !!(ed && ed.classList.contains('active')),
        editorSadrzaj: ed ? ed.innerHTML.trim().length : -1
      };
    });

    expect(stanje.editorAktivan, 'Studio je aktivan nad tuđim materijalom').toBe(false);
    expect(stanje.editorSadrzaj, 'Studio je nešto nacrtao nad tuđim materijalom').toBe(0);
    expect(stanje.poruka, 'na ekranu je i18n KLJUČ, ne prijevod').not.toMatch(/^editor\./);
    expect(stanje.poruka.length).toBeGreaterThan(0);
  });
});
