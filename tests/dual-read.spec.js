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

test('dual-read: exercise predmet (statistics) — study iz JSON, vježbe+lib iz .js', async ({ page }) => {
  await blockSupabase(page);
  const reqs = [];
  page.on('request', (r) => reqs.push(r.url()));
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent);

  const res = await page.evaluate(() => window.SokratContent.loadLesson('statistics', 'first-midterm').then((d) => ({
    studyKeys: Object.keys(d).length,
    hasExercises: typeof window.statisticsExercises === 'object' && !!window.statisticsExercises,
    hasLib: typeof window.StatLib === 'object' && !!window.StatLib,
  })));

  expect(res.studyKeys).toBeGreaterThan(0);     // study razriješen (iz JSON-a)
  expect(res.hasExercises).toBe(true);          // vježbe učitane (iz .js codeScripts)
  expect(res.hasLib).toBe(true);                // stat-lib učitan (iz .js codeScripts)
  // study iz JSON, kod iz .js — BUG-012 očuvan
  expect(reqs.some((u) => u.includes('data/json/statistics/statisticsM1.json'))).toBe(true);
  expect(reqs.some((u) => u.includes('data/statistics/exercises.js'))).toBe(true);
  expect(reqs.some((u) => u.includes('data/statistics/midterm-1.js'))).toBe(false); // study NIJE iz .js
  expect(errors).toEqual([]);
});

test('dual-read: exercise predmet (accounting, F2 2A dovršetak 18/18) — study iz JSON, vježbe iz .js', async ({ page }) => {
  // Accounting je zadnji predmet migriran na JSON (18/18) i najsloženiji za sastaviti
  // (11 skripti: category-moduli definiraju *Data globale, pa ih midterm/final.js assembliraju).
  // Study MORA doći iz JSON-a, a vježbe (accountingExercises, generate() funkcije) iz .js (BUG-012).
  await blockSupabase(page);
  const reqs = [];
  page.on('request', (r) => reqs.push(r.url()));
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.SokratContent);

  const res = await page.evaluate(() => window.SokratContent.loadLesson('accounting', 'first-midterm').then((d) => ({
    studyKeys: Object.keys(d).length,
    hasExercises: typeof window.accountingExercises === 'object' && !!window.accountingExercises,
  })));

  expect(res.studyKeys).toBeGreaterThan(0);     // study razriješen (iz JSON-a)
  expect(res.hasExercises).toBe(true);          // vježbe učitane (iz .js codeScripts)
  // study iz JSON, kod iz .js — BUG-012 očuvan
  expect(reqs.some((u) => u.includes('data/json/accounting/accountingM1.json'))).toBe(true);
  expect(reqs.some((u) => u.includes('data/accounting/exercises.js'))).toBe(true);
  expect(reqs.some((u) => u.includes('data/accounting/midterm-1.js'))).toBe(false); // study NIJE iz .js
  expect(errors).toEqual([]);
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
