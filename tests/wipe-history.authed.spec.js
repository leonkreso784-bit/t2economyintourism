// U2 (R1-UX) — „Obriši povijest učenja" MORA stvarno brisati: cloud + lokalno + snapshot,
// BEZ odjave. Trajni regresijski spec (pravilo #8): SAMO `authenticated` projekt (STAGING_*).
//
// Povod (Leon, 2026-09-02, uživo): stari gumb je obrisao cloud pa ODJAVIO korisnika, a
// lokalne ključeve čuvao — union-merge ih je pri sljedećoj prijavi VRATIO u cloud. Ovaj
// spec zabija točno taj krug: seed → push u bazu → wipe → baza prazna I lokalno prazno
// I korisnik još prijavljen → ponovni pull NE vraća ništa.
const { test, expect } = require('@playwright/test');

test('wipeAll: povijest obrisana u bazi i lokalno, korisnik ostaje prijavljen, pull ne vraća ništa', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await page.waitForFunction(() =>
    typeof CloudSync !== 'undefined' && !!CloudSync.wipeAll
    && typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser());

  // 1. SEED: pravi praćeni ključ (prvi analytics ključ iz watchedKeys) + push u bazu.
  const key = await page.evaluate(async () => {
    const k = CloudSync.watchedKeys().find((x) => x.indexOf('-analytics') !== -1);
    localStorage.setItem(k, JSON.stringify({ testWipeU2: 7 }));
    await CloudSync.pushNow();
    return k;
  });
  expect(key).toBeTruthy();

  const rowsBefore = await page.evaluate(async (k) => {
    const r = await SokratAuth.getClient().from('progress').select('key').eq('key', k);
    return r.error ? -1 : r.data.length;
  }, key);
  expect(rowsBefore).toBe(1); // seed je stvarno u bazi — inače test ne mjeri ništa

  // 2. WIPE
  const res = await page.evaluate(() => CloudSync.wipeAll());
  expect(res.ok).toBe(true);

  // 3. Baza prazna, lokalno prazno, korisnik JOŠ prijavljen (bez odjave — to je bio bug).
  const after = await page.evaluate(async (k) => {
    const r = await SokratAuth.getClient().from('progress').select('key');
    return {
      dbRows: r.error ? -1 : r.data.length,
      localGone: localStorage.getItem(k) === null,
      metaGone: localStorage.getItem('sokrat-sync-meta') === null,
      signedIn: !!SokratAuth.getUser()
    };
  }, key);
  expect(after.dbRows).toBe(0);
  expect(after.localGone).toBe(true);
  expect(after.metaGone).toBe(true);
  expect(after.signedIn).toBe(true);

  // 4. Reload + ponovni pull: NIŠTA se ne vraća (stari bug bi ovdje uskrsnuo podatke).
  await page.reload();
  await page.waitForFunction(() =>
    typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser());
  await page.waitForTimeout(2500); // pull-and-merge je async nakon SIGNED_IN/INITIAL_SESSION
  const resurrected = await page.evaluate(async (k) => {
    const r = await SokratAuth.getClient().from('progress').select('key').eq('key', k);
    return { db: r.error ? -1 : r.data.length, local: localStorage.getItem(k) };
  }, key);
  expect(resurrected.db).toBe(0);
  expect(resurrected.local).toBe(null);
});
