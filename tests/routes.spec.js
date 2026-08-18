// K1 · RUTE — adresa je identitet stranice (faza „KOSTUR", spec §8).
//
// Do K1 je aplikacija imala DEVET stranica i JEDNU adresu (`#/materials`): „natrag" je
// odvodio sa stranice, nijedna lekcija se nije dala podijeliti, a dijeljenje materijala
// (faza iza MCP-a) nije imalo na što objesiti token.
//
// ⚠️ Propis nije bio nov — `BUGS.md` ga je zapisao DVAPUT (BUG-019 i BUG-020, oba traže
// „pravi navigacijski stog + History API") i oba puta odgodio na U8, koji se zatvorio bez
// izvedbe. Zato ove tvrdnje postoje kao TEST, a ne kao rečenica u planu: pouka BUG-023
// glasi da rečenica u dokumentu ne sprječava ništa.
//
// Testovi gađaju ISHOD ZA KORISNIKA (što vidi, kamo ga vodi „natrag"), ne unutarnji oblik
// rute — da preimenovanje segmenta ne obori suitu bez pravog kvara.
const { test, expect } = require('@playwright/test');

/** Sve što testovi trebaju znati o stanju, na jednom mjestu. */
const stanje = (page) => page.evaluate(() => ({
  hash: location.hash,
  page: AppState.nav.page,
  subject: AppState.nav.subject,
  lesson: AppState.nav.lesson,
  section: AppState.nav.section,
  aktivna: Array.from(document.querySelectorAll('section[id$="-page"]'))
    .filter((s) => s.classList.contains('active')).map((s) => s.id),
}));

const spreman = (page) => page.waitForFunction(() => window.AppState && window.SOKRAT_CATALOG);

/** Prvi predmet i njegova prva lekcija — iz KATALOGA, nikad zakucani. */
async function prviPar(page) {
  return page.evaluate(() => {
    const id = Object.keys(subjectDataMap)[0];
    const s = SokratCatalog.getSubject(id);
    return { subject: id, lesson: (s && s.lessons && s.lessons[0]) ? s.lessons[0].id : null };
  });
}

test('ruta: svaka stranica ima adresu, a mod lekcije je dio nje', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await spreman(page);

  await page.evaluate(() => navigateTo('browse'));
  expect((await stanje(page)).hash).toBe('#/subjects');

  const { subject, lesson } = await prviPar(page);
  await page.evaluate((id) => navigateTo('lessons', { subject: id }), subject);
  expect((await stanje(page)).hash).toContain(subject);

  test.skip(!lesson, 'katalog nema nijednu lekciju za probu');
  await page.evaluate(([s, l]) => navigateTo('study', { subject: s, lesson: l }), [subject, lesson]);
  await page.evaluate(() => switchSection('quiz'));
  const s = await stanje(page);
  expect(s.hash).toContain(lesson);
  expect(s.hash).toContain('quiz');   // mod je dio adrese → dijeljen link vodi u TAJ mod

  expect(errors).toEqual([]);
});

test('ruta: dijeljen link otvara točno tu lekciju iz hladnog starta', async ({ page }) => {
  await page.goto('/');
  await spreman(page);
  const { subject, lesson } = await prviPar(page);
  test.skip(!lesson, 'katalog nema nijednu lekciju za probu');

  // Hladan start: nova navigacija na adresu, bez ijednog klika kroz aplikaciju.
  await page.goto('/#/subject/' + encodeURIComponent(subject) + '/' + encodeURIComponent(lesson));
  await page.waitForFunction(() => AppState && AppState.nav.page === 'study', null, { timeout: 15000 });

  const s = await stanje(page);
  expect(s.subject).toBe(subject);
  expect(s.lesson).toBe(lesson);
  expect(s.aktivna).toEqual(['study-page']);
});

test('ruta: „natrag" vraća korak umjesto da izađe sa stranice', async ({ page }) => {
  await page.goto('/');
  await spreman(page);

  await page.evaluate(() => navigateTo('browse'));
  await page.evaluate(() => navigateTo('materials'));
  expect((await stanje(page)).page).toBe('materials');

  await page.goBack();
  await page.waitForFunction(() => AppState.nav.page === 'browse', null, { timeout: 10000 });
  expect((await stanje(page)).page).toBe('browse');
});

test('ruta: golo sidro na landingu NIJE ruta i ne smije se pregaziti', async ({ page }) => {
  // ⚠️ Ovaj test čuva kvar nađen probom u K1, ne hipotezu. `restoreLastPosition()` na
  // hladnom startu završi u `navigateTo('landing')`, koji je adresu prepisivao u `#/` —
  // pa je `#subjects` nestao i preglednik više nije imao kamo skrolati. Landing koristi
  // GOLA sidra (`#top`, `#subjects`), i ona su preciznija pozicija od `#/`.
  await page.goto('/#subjects');
  await spreman(page);
  await page.waitForTimeout(500);          // pusti restoreLastPosition da odradi svoje

  const s = await stanje(page);
  expect(s.hash).toBe('#subjects');
  expect(s.page).toBe('landing');
});

test('ruta iz adrese je NEPOVJERLJIV ulaz — izmišljen predmet ne otvara praznu stranicu', async ({ page }) => {
  // Isti razred kao BUG-023, ali gori: spremljena pozicija je bar nekad bila valjana na
  // ovom uređaju, a adresu je netko mogao utipkati ili poslati. Prazna study-stranica
  // izgleda kao da je gradivo nestalo, a svako spremanje napretka na njoj puca.
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/#/subject/ovo-ne-postoji/nikakva-lekcija');
  await spreman(page);
  await page.waitForTimeout(1500);

  const s = await stanje(page);
  expect(s.page).not.toBe('study');
  expect(s.aktivna).not.toContain('study-page');
  expect(errors).toEqual([]);
});

test('ruta: profil/admin/Studio NEMAJU adresu — namjerno', async ({ page }) => {
  // Prikaz im ovisi o auth-sesiji i admin-statusu koji na hladnom startu nisu spremni;
  // deep-link bi pokazao praznu stranicu bilo kome tko zna adresu. Zato se hash ČISTI,
  // a povijest ostaje netaknuta → „natrag" iz Studija vraća onamo odakle se ušlo.
  await page.goto('/');
  await spreman(page);

  await page.evaluate(() => navigateTo('materials'));
  await page.evaluate(() => navigateTo('profile'));

  const s = await stanje(page);
  expect(s.page).toBe('profile');
  expect(s.hash).toBe('');

  await page.goBack();
  await page.waitForFunction(() => AppState.nav.page === 'materials', null, { timeout: 10000 });
});
