// C2 — landing: hero sa ŽIVIM PRIKAZOM, dvoje vrata, katalog-traka, podnožje.
//
// Ovi testovi su prepisani zajedno s površinom (spec §5, „poznata zamka"): stari su
// gađali `.hero-badge`, `.how-step` i `.mode-card`, kojih više nema — da su ostali,
// suita bi pala; da su samo obrisani, ne bi ostalo ništa što čuva novu stranicu.
const { test, expect } = require('@playwright/test');

test('landing: nav, brojka iz kataloga i vitrina predmeta', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => window.SOKRAT_CATALOG && document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  // BROJ i VITRINA imaju različit doseg, i to je namjerno (Leon, 2026-08-09):
  //  • broj      = CIJELA platforma kroz sve programe (17 EN + 5 HR = 22)
  //  • vitrina   = samo primarni program; HR predmeti se dohvaćaju kroz Browse
  const counts = await page.evaluate(() => {
    const seen = {}; let total = 0;
    (SOKRAT_CATALOG.faculties || []).forEach((f) => (f.programs || []).forEach((p) => {
      SokratCatalog.subjectsOf(p.id).forEach((s) => { if (s && s.id && !seen[s.id]) { seen[s.id] = true; total++; } });
    }));
    return { total: total, primary: SokratCatalog.subjectsOf('hospitality-management').length };
  });

  // Regresijska brana: da netko vrati broj na primarni program, `total` i `primary` bi se
  // poklopili i tvrdnja ispod bi prošla lažno. Ovo traži da razlika STVARNO postoji.
  expect(counts.total, 'katalog nema više programa — test bi postao bezvrijedan')
    .toBeGreaterThan(counts.primary);

  await expect(page.locator('.landing-nav')).toBeVisible();

  const metaText = await page.$eval('[data-meta="subjectCount"]', (el) => el.textContent.trim());
  expect(metaText).toBe(String(counts.total));

  // C2 je BROJ PITANJA UKLONIO s landinga, i to je tvrdnja koju treba čuvati.
  // Pokrivao je 17 od 22 predmeta (`compute-stats.js` namjerno preskače prijevode da
  // isto gradivo ne broji dvaput), pa je uz „22 predmeta" bio nedosljedan. Kriterij
  // prihvaćanja #5 traži da se brojke slažu — ispunjeno brisanjem, ne pogađanjem.
  expect(await page.locator('[data-meta="questionCount"]').count(),
    'brojka pitanja se vratila na landing — pokriva 17/22, v. spec kriterij #5').toBe(0);

  const showcase = await page.$$eval('#landingSubjects .landing-subject-card', (e) => e.length);
  expect(showcase).toBe(counts.primary);

  await expect(page.locator('.landing-footer .footer-cols')).toBeVisible();

  const vw = page.viewportSize().width;
  const docScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(docScrollW).toBeLessThanOrEqual(vw + 1);

  expect(errors).toEqual([]);
});

test('landing: živi prikaz pretvara JEDAN unos u ČETIRI moda', async ({ page }) => {
  // Ovo je srž C2 („landing ne opisuje proizvod, landing JEST proizvod"). Ako demo
  // prestane reagirati, stranica se vraća na tvrdnju — a to je točno ono što smo maknuli.
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForSelector('#heroDemo');

  await page.fill('#demoTerm', 'Osmoza');
  await page.fill('#demoDef', 'Prolazak otapala kroz polupropusnu membranu.');

  await expect(page.locator('#demoCardFront')).toHaveText('Osmoza');
  await expect(page.locator('#demoCardBack')).toHaveText('Prolazak otapala kroz polupropusnu membranu.');
  await expect(page.locator('#demoQuizQ')).toContainText('Osmoza');
  await expect(page.locator('#demoLearnH')).toHaveText('Osmoza');
  await expect(page.locator('#demoFillQ')).toContainText('Prolazak otapala');

  // Točan odgovor mora biti označen, inače kviz ne pokazuje kviz nego popis rečenica.
  await expect(page.locator('#demoQuizOpts .demo-opt.is-right')).toHaveCount(1);
  await expect(page.locator('#demoQuizOpts .demo-opt')).toHaveCount(4);

  // Okret kartice je jedini ukras na stranici i mora biti dostupan tipkovnici.
  await page.click('#demoFlip');
  await expect(page.locator('#demoFlip')).toHaveAttribute('aria-pressed', 'true');

  expect(errors).toEqual([]);
});

test('landing: unos posjetitelja se NE tumači kao HTML (BUG-025)', async ({ page }) => {
  // Demo je jedino mjesto na landingu koje prima korisnički unos. Zato je građen
  // `textContent`/`createElement`-om, bez `innerHTML` — ovaj test čuva tu odluku.
  await page.goto('/');
  await page.waitForSelector('#heroDemo');

  const napad = '<img src=x onerror=alert(1)>';
  await page.fill('#demoTerm', napad);
  await page.fill('#demoDef', '<b>podebljano</b> & "navodnici"');

  // Tekst mora ostati DOSLOVAN, a ubačeni element ne smije nastati.
  await expect(page.locator('#demoCardFront')).toHaveText(napad);
  await expect(page.locator('#demoLearnH')).toHaveText(napad);
  expect(await page.locator('#heroDemo img').count(), 'unos je postao pravi <img> element').toBe(0);
  expect(await page.locator('#heroDemo b').count(), 'unos je postao pravi <b> element').toBe(0);
  await expect(page.locator('#demoCardBack')).toHaveText('<b>podebljano</b> & "navodnici"');
});

test('landing: dvoje vrata vode na browse i na vlastiti materijal', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(() => window.enterBrowse);

  // Primarna vrata → drill-down browse.
  await page.click('.doors .door--primary');
  await page.waitForSelector('#browse-page.active', { timeout: 5000 });
  await page.waitForSelector('.browse-card[data-browse="faculty"]');

  // Natrag na landing → druga vrata vode u vlastiti materijal.
  await page.evaluate(() => window.navigateTo('landing'));
  await page.waitForSelector('#landing-page.active');
  await page.click('.doors [data-goto-materials]');
  await page.waitForSelector('#materials-page.active', { timeout: 5000 });

  expect(errors).toEqual([]);
});

test('landing: kartica predmeta otvara lekcije tog predmeta', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  await page.click('#landingSubjects .landing-subject-card[data-landing-subject="te2"]');
  await page.waitForSelector('#lessons-page.active', { timeout: 5000 });
  const title = (await page.textContent('#currentSubjectTitle')) || '';
  expect(title).toContain('Tourism Economics');

  expect(errors).toEqual([]);
});

test('landing: nijedan ukras ne prekriva sadržaj ispod ljepljive trake', async ({ page }) => {
  // Nasljednik starog „hero badge clears the fixed nav" testa. Stari je gađao element
  // kojeg više nema, ali je RAZLOG ostao: traka je `position: sticky`, pa prvi sadržaj
  // ispod nje mora počinjati ISPOD njenog donjeg ruba, ne pod njom.
  await page.goto('/');
  await page.waitForSelector('.landing-nav');
  await page.waitForSelector('.hero-kicker');

  const { navBottom, kickerTop } = await page.evaluate(() => {
    const nav = document.querySelector('.landing-nav').getBoundingClientRect();
    const kicker = document.querySelector('.hero-kicker').getBoundingClientRect();
    return { navBottom: nav.bottom, kickerTop: kicker.top };
  });

  expect(kickerTop).toBeGreaterThanOrEqual(navBottom - 1);
});
