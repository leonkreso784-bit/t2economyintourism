// K2a · MODEL VRAĆANJA — jedan „natrag" za cijelu aplikaciju (faza „KOSTUR", spec §8).
//
// Do K2a su ovdje živjela TRI paralelna modela: tvrdo ožičen roditelj u svakom gumbu, ručna
// jednodubinska povijest (`profileReturnPage`/`materialsReturnPage`) i — od K1 — prava
// povijest preglednika. Razišli su se na dva mjesta koja je Leon našao na živom ekranu:
//
//   ① Vlastiti materijal se uči kao sintetički predmet `node:<uuid>`, ali su gumbi poznavali
//      SAMO katalošku hijerarhiju. Vraćanje iz vlastitog gradiva vodilo je na lekcijsku
//      stranicu ČVORA (koja crta prazninu, „Matematika / undefined") i odande na izbor
//      fakulteta — dvije stranice na kojima korisnik nikad nije bio.
//   ② „Natrag" s police vraćao je U EDITOR iz kojeg si upravo izašao. Isti izuzetak POSTOJAO
//      je za profil (komentar se poziva na BUG-019 i petlju profil ⇄ admin) i nikad nije bio
//      prenesen na materijale.
//
// ⚠️ ZAŠTO OVO MORA BITI TEST, A NE REČENICA U PLANU: BUG-019 i BUG-020 propisali su „pravi
// navigacijski stog" DVAPUT, oba puta odgodili na U8, i nitko nije primijetio pet tjedana.
//
// ⚠️ OBRNUTA PROVJERA (izmjereno na kodu prije K2a, `git stash`): **pada 3 od 5**, i to je
// točan ishod. Tri testa tvrde ono što K2a mijenja (čvor u katalogu · petlja s editorom ·
// povratak na landing) i bez popravka moraju pasti. Preostala dva NE mjere K2a:
//   · „hladan dolazak penje hijerarhiju" — stara tvrdo ožičena odredišta slučajno se
//     poklapaju s hijerarhijom, pa test prolazi i na starom kodu. Postoji zato što čuva
//     RIZIK KOJI JE UVEO SAM K2a: prva verzija je odlazak gore gurala u povijest i time
//     stvarala petlju natrag u dijete.
//   · „gumb i sistemska gesta govore isto" — to je tekovina K1 (povijest), ne K2a.
// ⚠️ Brojka je ovdje ISPRAVLJENA nakon mjerenja: prvo je pisalo „4 od 5", napisano napamet
// prije nego što je provjera vožena. Isti razred greške koji ova cigla zatvara.
//
// Testovi gađaju ISHOD ZA KORISNIKA (gdje se našao), ne mehanizam (je li pozvan pushState).
// Pouka K1: prvu verziju rutera oborio je tek test pisan o ishodu — dimna proba mehanizma
// prošla je iako je „natrag" iz Studija preskakao materijale.
const { test, expect } = require('@playwright/test');

const spreman = (page) => page.waitForFunction(() => window.AppState && window.SOKRAT_CATALOG);

/** Gdje se korisnik NAŠAO — jedino što ovi testovi smiju tvrditi. */
const gdjeSam = (page) => page.evaluate(() => ({ page: AppState.nav.page, hash: location.hash }));

/** Klik na vidljiv gumb natrag; false ako ga na toj stranici nema. */
const natrag = (page, id) => page.evaluate((el) => {
  const b = document.getElementById(el);
  if (!b || b.offsetParent === null) return false;
  b.click();
  return true;
}, id);

/** Prvi predmet iz KATALOGA — nikad zakucan, da suita ne ovisi o sadržaju. */
const prviPredmet = (page) => page.evaluate(() => Object.keys(subjectDataMap)[0]);

test('vlastiti materijal se NIKAD ne otvara kao lekcijska stranica kataloga', async ({ page }) => {
  await page.goto('/');
  await spreman(page);

  // Ovo je adresa sa screenshota koji je Leon poslao. Ruta je od K1 dijeljiva, pa čuvar mora
  // stajati u `navigateTo`, a ne u gumbu — inače je dovoljno utipkati je.
  await page.evaluate(() => navigateTo('lessons', { subject: 'node:6c333796-ecaa-47c7-9ab5-3cb9a8340b0b' }));

  const s = await gdjeSam(page);
  expect(s.page).toBe('materials');
  expect(s.hash).toBe('#/materials');
});

test('petlja polica <-> editor je mrtva: natrag s police ne vraća u editor', async ({ page }) => {
  await page.goto('/');
  await spreman(page);

  await page.evaluate(() => navigateTo('materials'));
  // Studio traži admina za sadržaj, ali se stranica aktivira svejedno — a mjerimo povijest.
  await page.evaluate(() => { try { navigateTo('editor'); } catch (e) { /* render nije predmet ovog testa */ } });
  expect((await gdjeSam(page)).page).toBe('editor');

  await natrag(page, 'stBack');
  await page.waitForFunction(() => AppState.nav.page === 'materials');

  // A OVO je bio kvar: sljedeći „natrag" vraćao je NAZAD U EDITOR.
  await natrag(page, 'backFromMaterials');
  await page.waitForFunction(() => AppState.nav.page !== 'materials');
  expect((await gdjeSam(page)).page).not.toBe('editor');
});

test('ulaz s landinga: natrag vraća na landing, ne u katalog koji nismo vidjeli', async ({ page }) => {
  await page.goto('/');
  await spreman(page);

  const id = await prviPredmet(page);
  await page.evaluate((s) => navigateTo('lessons', { subject: s }), id);
  expect((await gdjeSam(page)).page).toBe('lessons');

  await natrag(page, 'backToLanding');
  await page.waitForFunction(() => AppState.nav.page === 'landing');
  expect((await gdjeSam(page)).page).toBe('landing');
});

test('hladan dolazak na dijeljenu lekciju: natrag PENJE hijerarhiju i ne pada natrag dolje', async ({ page }) => {
  await page.goto('/');
  await spreman(page);
  const subject = await prviPredmet(page);
  const lesson = await page.evaluate((s) => {
    const x = SokratCatalog.getSubject(s);
    return (x && x.lessons && x.lessons[0]) ? x.lessons[0].id : null;
  }, subject);
  test.skip(!lesson, 'katalog nema nijednu lekciju za probu');

  // Hladan start ravno na lekciju: iza nas NEMA našeg unosa, pa „natrag" ide na roditelja.
  await page.goto('/#/subject/' + encodeURIComponent(subject) + '/' + encodeURIComponent(lesson));
  await spreman(page);
  await page.waitForFunction(() => AppState.nav.page === 'study');

  await natrag(page, 'backToLessons');
  await page.waitForFunction(() => AppState.nav.page === 'lessons');

  // ⚠️ OVDJE JE PRVA VERZIJA K2a PALA: odlazak GORE je gurao unos u povijest, pa je sljedeći
  // „natrag" imao kamo natrag — u lekciju iz koje smo upravo izašli. Popravak je stvarao
  // petlju koju je trebao ukloniti; našla ga je proba u pregledniku, ne čitanje koda.
  // Zato kretanje gore ZAMJENJUJE unos, ne gura ga.
  await natrag(page, 'backToLanding');
  await page.waitForFunction(() => AppState.nav.page !== 'lessons');
  expect((await gdjeSam(page)).page).toBe('browse');
});

test('gumb u aplikaciji i sistemska gesta natrag govore isto', async ({ page }) => {
  await page.goto('/');
  await spreman(page);

  const subject = await prviPredmet(page);
  await page.evaluate((s) => navigateTo('lessons', { subject: s }), subject);
  await page.waitForFunction(() => AppState.nav.page === 'lessons');

  await page.goBack();
  await page.waitForFunction(() => AppState.nav.page === 'landing');
  expect((await gdjeSam(page)).page).toBe('landing');
});
