// ===== P1 (POLICA) — „skini predmet na uređaj" kroz pravi preglednik =====
//
// Unit test (tests/unit/offline-store.test.js) dokazuje LOGIKU nad lažnim uređajem:
// plan, rollback, manifest. Ovaj dokazuje ono što lažni uređaj ne može — da su bajtovi
// stvarno u Cache Storageu preglednika i da kontrola vodi kroz oba smjera (skini → ukloni).
//
// ⚠️ NEOVISAN O PODACIMA u onom smislu koji je važan: ne tvrdi koliko predmet ima
// datoteka ni koliko je velik — pita MODUL za plan i mjeri protiv njega. Predmet koji
// dobije novu lekciju ne ruši ovaj test.
//
// Što ovdje NAMJERNO NE stoji: „otvori predmet u zrakoplovnom načinu". To je kriterij
// faze i pripada P3 (pravilo u SW-u); P1 ne dira `sw.js`.

const { test, expect } = require('@playwright/test');

const PREDMET = 'statistics';   // ima i vježbe i lib → najgori slučaj plana

test.describe('P1 · skidanje predmeta na uređaj', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    // Čist uređaj — testovi se ne smiju oslanjati na ono što je ostalo od prethodnog.
    await page.evaluate(async () => {
      window.localStorage.removeItem('sokrat-offline-v1');
      if (window.caches) await window.caches.delete('sokrat-offline');
    });
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);
  });

  test('kontrola nudi skidanje i kaže koliko zauzima PRIJE skidanja', async ({ page }) => {
    const red = page.locator('#offlineControl .offline-row');
    await expect(red).toHaveAttribute('data-offline-state', 'idle');

    const gumb = page.locator('#offlineControl .offline-btn');
    await expect(gumb).toBeVisible();

    // Kriterij P1: broj mora stajati PRIJE nego korisnik pritisne.
    await expect(page.locator('#offlineControl .offline-meta')).toHaveText(/^~\d+(\.\d+)?\s?(B|KB|MB)$/, { timeout: 15000 });
  });

  test('skidanje stvarno upiše SVE planirane datoteke u Cache Storage', async ({ page }) => {
    await page.locator('#offlineControl .offline-btn').click();

    const red = page.locator('#offlineControl .offline-row');
    await expect(red).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    // Mjeri se protiv MODULOVA plana, ne protiv prepisanog broja.
    const nalaz = await page.evaluate(async (id) => {
      const plan = window.SokratOffline.plan(id);
      const cache = await window.caches.open(window.SokratOffline.CACHE);
      const fale = [];
      for (const u of plan) {
        const hit = await cache.match(u);
        if (!hit) fale.push(u);
      }
      return { planirano: plan.length, fale: fale, zapis: window.SokratOffline.get(id) };
    }, PREDMET);

    expect(nalaz.planirano).toBeGreaterThan(0);
    expect(nalaz.fale).toEqual([]);
    expect(nalaz.zapis.files).toBe(nalaz.planirano);
    expect(nalaz.zapis.bytes).toBeGreaterThan(0);
    expect(nalaz.zapis.v).toBeTruthy();          // P3 se oslanja na ovaj zapis

    // Stanje mora biti čitljivo, ne samo istinito.
    await expect(page.locator('#offlineControl .offline-meta')).toContainText(/\d+\s?(KB|MB)/);
  });

  test('skinuto preživi ponovno učitavanje stranice', async ({ page }) => {
    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready');
  });

  test('rezerva za veličinu je izvediva u PRAVOM pregledniku (dva klona istog odgovora)', async ({ page }) => {
    // Kad poslužitelj ne pošalje `content-length`, veličina se mjeri iz tijela:
    // `res.clone().blob()` pa `res.clone()` za keš. Da taj redoslijed u pravom
    // pregledniku ne baca, provjeravalo se dosad samo nad LAŽNIM odgovorom — a lažni
    // odgovor nema ni tee-anje toka ni `bodyUsed`. Ovo je jedina tvrdnja koju lažni
    // uređaj ne može dati.
    const nalaz = await page.evaluate(async () => {
      const res = await fetch('index.html');
      const b = await res.clone().blob();          // rezerva: izmjeri tijelo
      let drugiKlonRadi = false;
      try { const c = res.clone(); drugiKlonRadi = !!c && !res.bodyUsed; } catch (e) { drugiKlonRadi = false; }
      return { velicina: b.size, drugiKlonRadi: drugiKlonRadi };
    });
    expect(nalaz.velicina).toBeGreaterThan(0);
    expect(nalaz.drugiKlonRadi).toBe(true);
  });

  test('uklanjanje vraća uređaj u zatečeno stanje — i bajtove i zapis', async ({ page }) => {
    const gumb = page.locator('#offlineControl .offline-btn');
    await gumb.click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'ready', { timeout: 30000 });

    await gumb.click();
    await expect(page.locator('#offlineControl .offline-row')).toHaveAttribute('data-offline-state', 'idle', { timeout: 15000 });

    const ostalo = await page.evaluate(async (id) => {
      const plan = window.SokratOffline.plan(id);
      const cache = await window.caches.open(window.SokratOffline.CACHE);
      let n = 0;
      for (const u of plan) { if (await cache.match(u)) n++; }
      return { n: n, zapis: window.SokratOffline.get(id) };
    }, PREDMET);

    expect(ostalo.n).toBe(0);
    expect(ostalo.zapis).toBeNull();
  });
});
