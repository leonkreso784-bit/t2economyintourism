// C0 / ADR-029 — vlastiti materijal je RAVNOPRAVNO odredište, ne pododjeljak profila.
//
// Prije C0 se do njega dolazilo samo: prijavi se → profil → skrolaj. Ovi testovi čuvaju
// suprotno: ulaz je vidljiv BEZ prijave, stranica ima vlastitu rutu, i neprijavljen
// posjetitelj nikad ne vidi prazan ekran (to je bio točan dojam koji ADR-029 uklanja).
//
// Svi testovi teku ODJAVLJENI — to je i najstroži slučaj (odjavljen posjetitelj je onaj
// koji do UGC-a nikad nije dolazio) i jedini koji ne ovisi o test-računu.
const { test, expect } = require('@playwright/test');

test('ulaz u vlastiti materijal vidi se na landingu BEZ prijave', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForSelector('.landing-nav');

  // ⚠️ C2 JE ULAZ PRESELIO IZ TRAKE U VRATA (Leon, 2026-08-12: „ne znam zašto je My
  // materials na gornjem baru — trebao bi biti prvi, gdje je Start studying").
  // Cilj ADR-029 se NIJE promijenio, samo mjesto: ulaz mora biti vidljiv bez prijave
  // i mora stajati PRIJE kataloga. Zato tvrdnja gleda vrata, ne `.landing-nav-links`.
  const entry = page.locator('.doors [data-goto-materials]');
  await expect(entry).toBeVisible();

  // Regresijska brana: vrata moraju biti IZNAD katalog-sekcije u dokumentu. Katalog je
  // jedan izvor gradiva, a ne ono što platforma jest — vrati li ih netko ispod, ovo pada.
  const redoslijed = await page.evaluate(() => {
    const vrata = document.querySelector('.doors [data-goto-materials]');
    const katalog = document.getElementById('subjects');
    if (!vrata || !katalog) return null;
    // 4 = DOCUMENT_POSITION_FOLLOWING → katalog dolazi POSLIJE vrata.
    return (vrata.compareDocumentPosition(katalog) & 4) === 4;
  });
  expect(redoslijed, 'ulaz u vlastiti materijal je pao ispod kataloga').toBe(true);

  expect(errors).toEqual([]);
});

test('klik na ulaz otvara stranicu, a odjavljen posjetitelj dobiva poziv na prijavu (ne prazan ekran)', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForSelector('.doors [data-goto-materials]');   // C2: ulaz je preselio iz trake u vrata
  await page.click('.doors [data-goto-materials]');

  await page.waitForSelector('#materials-page.active', { timeout: 5000 });

  // Ovo je srž ADR-029: stranica se SMIJE otvoriti bez prijave, ali tada mora nešto reći.
  await expect(page.locator('#materialsSignedOut')).toBeVisible();
  await expect(page.locator('#materialsSignInBtn')).toBeVisible();

  // Adresa prati stranicu → link se može podijeliti.
  expect(new URL(page.url()).hash).toBe('#/materials');

  expect(errors).toEqual([]);
});

test('izravan link #/materials otvara stranicu i NE pada natrag na spremljenu poziciju', async ({ page }) => {
  // Spremljena pozicija je stariji mehanizam koji na učitavanju navigira sam od sebe i to
  // ASINKRONO. Bez izričite prednosti rute, korisnik koji otvori link završi na prošlom
  // predmetu — sekundu nakon što je stranica već bila prava.
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sokrat-last-position', JSON.stringify({
      page: 'lessons', subject: 'te2', timestamp: Date.now()
    }));
  });

  await page.goto('/#/materials');
  await page.waitForSelector('#materials-page.active', { timeout: 5000 });

  // Obnova je asinkrona — pričekaj da bi se stigla umiješati da brana ne radi.
  await page.waitForTimeout(1500);
  await expect(page.locator('#materials-page')).toHaveClass(/active/);
  await expect(page.locator('#lessons-page')).not.toHaveClass(/active/);
});

test('povratak vodi odakle si došao, a ruta se briše iz adrese', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.enterBrowse);

  // landing → browse → materijali → natrag mora vratiti na BROWSE, ne na landing.
  await page.click('.landing-nav .start-trigger');
  await page.waitForSelector('#browse-page.active');

  await page.click('#browse-page [data-goto-materials]');
  await page.waitForSelector('#materials-page.active');

  await page.click('#backFromMaterials');
  await page.waitForSelector('#browse-page.active', { timeout: 5000 });

  // Ostane li `#/materials` u adresi dok gledaš browse, reload bi te bacio natrag.
  expect(new URL(page.url()).hash).toBe('');
});

test('ikona ulaza stoji u zaglavljima browse/lessons/study', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(
    () => document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  await page.click('#landingSubjects .landing-subject-card[data-landing-subject="te2"]');
  await page.waitForSelector('#lessons-page.active');
  await expect(page.locator('#lessons-page [data-goto-materials]')).toBeVisible();

  await page.click('#lessons-page .lessons-grid .lesson-card');
  await page.waitForSelector('#study-page.active', { timeout: 8000 });
  await expect(page.locator('#study-page [data-goto-materials]')).toBeVisible();
});

test('u dokumentu postoji TOČNO JEDAN #myMaterials', async ({ page }) => {
  // C0 je stablo preselio s profila na vlastitu stranicu. Vrati li ga netko i na profil,
  // nastaju dva čvora s istim id-em → `mount()` crta u prvi, a korisnik gleda drugi.
  await page.goto('/');
  await page.waitForSelector('.landing-nav');
  expect(await page.locator('#myMaterials').count()).toBe(1);
});
