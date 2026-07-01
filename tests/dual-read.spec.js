// Dual-read JSON study sadržaja (F2 2A.3): predmet s content.dataFormat === 'json' čita
// study iz data/json/<id>/<var>.json; fallback na .js ako JSON padne. Pilot = 'sit'.
//
// ⚠ Supabase read-path se blokira (fromDb=false) da test bude DETERMINISTIČAN — inače bi,
//   ako je baza budna, sit sadržaj došao iz DB-a i JSON put se ne bi ni okinuo.
const { test, expect } = require('@playwright/test');

async function blockSupabase(page) {
  await page.route(/supabase\.co/, (route) => route.abort());
}

test('dual-read: sit study se učita iz data/json (ne iz .js)', async ({ page }) => {
  await blockSupabase(page);
  const reqs = [];
  page.on('request', (r) => reqs.push(r.url()));
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent && window.loadSubjectContent);

  const res = await page.evaluate(() => window.SokratContent.loadLesson('sit', 'first-midterm').then((d) => ({
    keys: Object.keys(d).length,
    onWindow: typeof window.sitM1 === 'object' && !!window.sitM1,
  })));

  expect(res.keys).toBeGreaterThan(0);          // sadržaj razriješen (kategorije prisutne)
  expect(res.onWindow).toBe(true);              // window.sitM1 postavljen
  // JSON put uzet: JSON datoteka fetchana, study .js NIJE učitan
  expect(reqs.some((u) => u.includes('data/json/sit/sitM1.json'))).toBe(true);
  expect(reqs.some((u) => u.includes('data/sit/midterm-1.js'))).toBe(false);
  expect(errors).toEqual([]);
});

test('dual-read: JSON payload === .js payload (bajt-identično u pregledniku)', async ({ page }) => {
  await blockSupabase(page);
  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent);

  // 1) JSON-mod: učitaj sit → window.sitM1 dolazi iz JSON-a
  const jsonVer = await page.evaluate(async () => {
    await window.SokratContent.loadLesson('sit', 'first-midterm');
    return JSON.stringify(window.sitM1);
  });

  // 2) Učitaj .js verziju PREKO nje i usporedi (shadow double-check: dva izvora se moraju slagati)
  const jsVer = await page.evaluate(() => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'data/sit/midterm-1.js?cmp=' + Date.now();
    s.onload = () => resolve(JSON.stringify(window.sitM1));
    s.onerror = () => reject(new Error('js load failed'));
    document.head.appendChild(s);
  }));

  expect(jsonVer.length).toBeGreaterThan(100);
  expect(jsVer).toBe(jsonVer);                  // JSON-učitano === .js-učitano, bajt-u-bajt
});

test('dual-read: JSON blokiran → fallback na .js (0 regresije)', async ({ page }) => {
  await blockSupabase(page);
  await page.route('**/data/json/sit/**', (route) => route.abort());
  const reqs = [];
  page.on('request', (r) => reqs.push(r.url()));

  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent);

  const res = await page.evaluate(() => window.SokratContent.loadLesson('sit', 'first-midterm').then((d) => ({
    keys: Object.keys(d).length,
    onWindow: !!window.sitM1,
  })));

  expect(res.keys).toBeGreaterThan(0);          // sadržaj i dalje tu — iz .js fallbacka
  expect(res.onWindow).toBe(true);
  expect(reqs.some((u) => u.includes('data/sit/midterm-1.js'))).toBe(true);  // .js fallback okinut
});
