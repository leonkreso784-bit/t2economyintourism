// Landing: hero BEZ ŽIVOG PRIKAZA, dvoje vrata, katalog-traka, podnožje.
//
// Ovi testovi se prepisuju zajedno s površinom (spec §5, „poznata zamka"): da stari
// ostanu, suita pada; da se samo obrišu, ne ostaje ništa što čuva novu stranicu.
//
// ⚠️ 2026-08-15 (spec §7.13): obrisana su DVA testa koja su čuvala živi prikaz u heroju
// („jedan unos → četiri moda" i „unos se ne tumači kao HTML"). Nisu pali — značajka je
// UKLONJENA ODLUKOM: Leon je landing odbio kad ga je vidio, jer je tražio od posjetitelja
// da RADI prije nego mu je dan razlog. Razlika je bitna i zato stoji zapisana: test koji
// padne znači kvar, test koji nestane znači promjenu opsega. Umjesto njih stoji tvrdnja
// da hero od posjetitelja NE traži ništa — inače bi se demo mogao vratiti neopaženo.
const { test, expect } = require('@playwright/test');

test('landing: nav, brojka iz kataloga i vitrina predmeta', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('/');
  await page.waitForFunction(
    () => window.SOKRAT_CATALOG && document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  // BROJ i VITRINA imaju različit doseg, i to je namjerno (Leon, 2026-08-09):
  //  • broj      = CIJELA platforma kroz sve programe (danas 17 EN + 7 HR)
  //  • vitrina   = samo primarni program; HR predmeti se dohvaćaju kroz Browse
  // ⚠️ Brojevi u ovom komentaru su ILUSTRACIJA, ne tvrdnja — tvrdnje ispod se računaju
  // iz kataloga. Da su zakucani, ostarili bi istog dana kad je dodan predmet.
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

test('landing: hero NE traži nikakav unos od posjetitelja', async ({ page }) => {
  // Nasljednik dvaju obrisanih demo-testova. Ne čuva izgled nego ODLUKU iz §7.13:
  // prvi ekran daje razlog, ne zadatak. Bez ovoga bi se živi prikaz mogao vratiti
  // sljedećim editom, a nijedan drugi test to ne bi primijetio.
  await page.goto('/');
  await page.waitForSelector('#landing-page.active');

  expect(await page.locator('#heroDemo').count(), 'živi prikaz se vratio u hero').toBe(0);

  // Šire od samog demoa: BILO KOJE polje za unos na landingu znači da smo posjetitelju
  // opet dali posao. Tražilica kataloga je jedina dopuštena iznimka (§7.13 ② ) — kad se
  // doda, ovdje se izuzima IMENOM, ne brisanjem tvrdnje.
  const polja = await page.locator('#landing-page input, #landing-page textarea').count();
  expect(polja, 'landing traži unos od posjetitelja koji još nije dobio razlog').toBe(0);
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
