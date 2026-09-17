// Cigla 5 (HRV): GLOBALNI language toggle (HR/EN) za sučelje. Sadržaj se NE dira.
// Model: globalni izbor (localStorage 'sokrat-ui-lang') je gospodar; otvaranje HR programa
// samo PREDLOŽI hrvatski ako korisnik još nije eksplicitno birao.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

const navSpans = (page) =>
  page.$$eval('.study-nav .study-nav-btn span', (els) => els.map((e) => e.textContent.trim()));

test('opening an HR-program subject suggests Croatian UI (no prior choice)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('sokrat-ui-lang'));
  await page.reload();
  await page.waitForFunction(() => window.navigateTo && window.getUiLang);

  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics-hr', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics-hr'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  const hr = await navSpans(page);
  expect(hr).toContain('Kartice');
  expect(hr).toContain('Kviz');
  expect(hr).not.toContain('Flashcards');
});

test('global toggle is master and persists across reload (overrides program)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.setItem('sokrat-ui-lang', 'en'); });
  await page.reload();
  await page.waitForFunction(() => window.navigateTo && window.getUiLang);

  // Korisnik je izabrao EN → čak i HR predmet ostaje englesko sučelje
  await page.evaluate(() => window.navigateTo('study', { subject: 'business-informatics-hr', lesson: 'midterm-1' }));
  await page.waitForFunction(() => window.isSubjectContentLoaded && window.isSubjectContentLoaded('business-informatics-hr'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.getUiLang())).toBe('en');
  expect(await navSpans(page)).toContain('Flashcards');

  // Toggle → HR, zapamti se, preživi reload
  await page.evaluate(() => window.toggleUiLang());
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  expect(await page.evaluate(() => localStorage.getItem('sokrat-ui-lang'))).toBe('hr');
  await page.reload();
  await page.waitForFunction(() => window.getUiLang);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
});

// ⚠️ DOKUMENT MORA DEKLARIRATI JEZIK KOJIM JE STVARNO PISAN (2026-08-24).
//
// Do danas se pri UČITAVANJU zvao goli `applyTranslations()`, pa se tekst prevodio, a
// `<html lang>` je ostajao `en` — atribut postavlja jedino `setUiLang`, a boot ju nije
// zvao. Korisnik koji je jednom odabrao 🇭🇷 dobivao je hrvatski tekst pod engleskom
// deklaracijom na SVAKOJ stranici i pri svakom posjetu, dok god ne pritisne prekidač.
// Čitač ekrana tada hrvatske rečenice izgovara engleskim glasovima (WCAG 3.1.1).
//
// ⚠️ Zašto ovo nijedan gate nije vidio: axe provjerava da `lang` POSTOJI i da je VALJAN
// jezični kod. `en` je oboje — samo nije istina. Isti razred kao tinta na pločicama
// (cigla B): pravilo je bilo ispravno, ali ga nijedna mjera nije uspoređivala sa stanjem.
test('`<html lang>` prati odabrani jezik — i pri OBIČNOM učitavanju, ne samo na prekidač', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.setItem('sokrat-ui-lang', 'hr'); });

  // Obično učitavanje, bez ijednog dodira prekidača — točno put kojim dolazi povratnik.
  await page.reload();
  await page.waitForFunction(() => window.getUiLang);
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
  expect(await page.evaluate(() => document.documentElement.lang),
    'tekst je hrvatski, a dokument se predstavlja kao engleski').toBe('hr');

  // I obrnuto, da tvrdnja ne prolazi zato što je atribut zaglavio na jednoj vrijednosti.
  await page.evaluate(() => { localStorage.setItem('sokrat-ui-lang', 'en'); });
  await page.reload();
  await page.waitForFunction(() => window.getUiLang);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
});

// F3/2 (index.html): tekst koji JS piše (kartica, kviz, naslovi) je u markupu PRAZAN, a ne s
// `data-i18n` — jer `applyTranslations()` na promjenu jezika piše ključ preko svega što ga
// nosi. Ova tvrdnja drži obje strane te odluke: ① živi sadržaj preživi prekidač usred igre,
// ② kromo koje JE dobilo ključ (gumb za jezik, staro podnožje) stvarno prati jezik.
// Obrnuto provjereno: `data-i18n` na `#questionText` obori ①; stari markup obori ②.
test('F3/2: prekidač usred kviza ne gazi pitanje, a traka i podnožje prate jezik', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sokrat-cookie-consent', 'denied'));
  await page.goto('/');
  await page.evaluate(() => { localStorage.setItem('sokrat-ui-lang', 'en'); });
  await page.reload();
  await ucitajPakete(page, ['study']);
  await page.waitForFunction(() =>
    window.SOKRAT_CATALOG && window.navigateTo && window.switchSection && window.startQuiz && window.toggleUiLang);

  // Predmet iz kataloga, ne zakucan id — test ne smije ovisiti o tome koji predmeti postoje.
  const sub = await page.evaluate(() => {
    for (const s of window.SOKRAT_CATALOG.subjects) {
      const l = (s.lessons || []).find((x) => window.SokratCatalog.resolveDataVar(s.id, x.id));
      if (l) return { id: s.id, lesson: l.id };
    }
    return null;
  });
  expect(sub, 'treba barem jedan predmet s rješivom lekcijom').not.toBeNull();
  await page.evaluate(({ id, lesson }) => window.navigateTo('study', { subject: id, lesson }), sub);
  await page.waitForFunction((id) => window.isSubjectContentLoaded && window.isSubjectContentLoaded(id), sub.id, { timeout: 15000 });

  await page.evaluate(() => window.switchSection('flashcards'));
  await page.waitForFunction(() => document.getElementById('cardQuestion').textContent.trim().length > 0);
  await page.evaluate(() => { window.switchSection('quiz'); window.startQuiz(); });
  await page.waitForFunction(() => document.getElementById('questionText').textContent.trim().length > 0);

  const zivo = () => ({
    kartica: document.getElementById('cardQuestion').textContent,
    pitanje: document.getElementById('questionText').textContent,
    kategorija: document.getElementById('questionCategory').textContent,
  });
  const prije = await page.evaluate(zivo);
  expect(prije.kategorija.trim().length, 'kategorija pitanja je upisana').toBeGreaterThan(0);

  await page.evaluate(() => window.toggleUiLang());
  expect(await page.evaluate(() => window.getUiLang())).toBe('hr');

  // ① živi sadržaj je NETAKNUT — ključ ga ne smije pregaziti
  expect(await page.evaluate(zivo), 'promjena jezika pregazila je sadržaj kartice/kviza').toEqual(prije);

  // ② kromo s ključem prati jezik
  const lang = page.locator('.topbar .topbar-lang');
  await expect(lang).toHaveAttribute('aria-label', 'Jezik / Language');
  await expect(lang).toHaveAttribute('title', 'Jezik / Language');
  await expect(lang.locator('.lang-toggle-label')).toHaveText('HR');
  await expect(page.locator('footer.footer p')).toHaveText(/Sva prava pridržana/);

  // i natrag, da tvrdnja ne prolazi zato što je nešto zaglavilo na hrvatskom
  await page.evaluate(() => window.toggleUiLang());
  await expect(lang).toHaveAttribute('title', 'Language / Jezik');
  await expect(lang.locator('.lang-toggle-label')).toHaveText('EN');
  expect(await page.evaluate(zivo)).toEqual(prije);
});

// F3/2 cigla 3 (Leon, 16.09.): BEZ IZBORA JEZIK PRATI UREĐAJ — samo hrvatski uređaj dobiva hrvatsko
// sučelje, izbor na prekidaču pobjeđuje, a jezik uređaja se NE zapisuje kao izbor. Logiku (koji su
// uređaji hrvatski) drži `tests/unit/jezik-boot.test.js`; ovdje je pravi preglednik s pravim `locale`.
test.describe('jezik uređaja', () => {
  test.use({ locale: 'hr-HR' });

  test('hrvatski uređaj bez izbora → hrvatsko sučelje; prekidač pobjeđuje i pamti se', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.getUiLang);
    expect(await page.evaluate(() => navigator.language)).toBe('hr-HR');
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('hr');
    expect(await page.evaluate(() => localStorage.getItem('sokrat-ui-lang')),
      'jezik uređaja nije korisnikov izbor i ne smije se zapisati').toBeNull();
    await expect(page.locator('.topbar .lang-toggle-label')).toHaveText('HR');
    await expect(page.locator('#topbarMaterials .topbar-btn-label')).toHaveText('Moji materijali');

    // Prekidač → engleski je IZBOR: zapiše se i nadjača hrvatski uređaj i poslije ponovnog učitavanja.
    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => localStorage.getItem('sokrat-ui-lang'))).toBe('en');
    await page.reload();
    await page.waitForFunction(() => window.getUiLang);
    expect(await page.evaluate(() => window.getUiLang())).toBe('en');
    await expect(page.locator('#topbarMaterials .topbar-btn-label')).toHaveText('My materials');
  });

  test('pravna stranica na hrvatskom uređaju: hrvatski blok od prvog učitavanja', async ({ page }) => {
    await page.goto('/privacy.html');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-ui-lang'))).toBe('hr');
    await expect(page.locator('.jezik[lang="hr"]').first()).toBeVisible();
    await expect(page.locator('.jezik[lang="en"]').first()).toBeHidden();
  });
});

// F3/2 cigla 4a: PRIJAVA NA JEZIKU SUČELJA. Tri kvara koja brana nije vidjela: ① imena gumba
// (zatvori, oko lozinke, gumb u traci) bila su engleska u svakom jeziku; ② oko je poslije klika
// uvijek govorilo „Hide password"; ③ prozor se gradi JEDNOM pri pokretanju, pa je poslije
// prekidača ostajao na jeziku prvog učitavanja. Upisano ne smije nestati kad se prozor
// pregradi (isto načelo kao `data-touched` na naslovnici).
test.describe('F3/2 cigla 4a — prijava prati jezik', () => {
  test.use({ locale: 'hr-HR' });

  test('hrvatski uređaj → hrvatska imena gumba; prekidač → prozor se otvori na novom jeziku, upisano ostaje', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
    });
    await page.goto('/');
    const gumb = page.locator('#authNavBtn');
    let cdnOk = true;
    try { await gumb.waitFor({ state: 'visible', timeout: 15000 }); } catch (e) { cdnOk = false; }
    test.skip(!cdnOk, 'supabase-js CDN nedostupan — prijava se gasi po dizajnu');
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');

    // ① gumb u traci (odjavljen)
    await expect(gumb, 'ime gumba za prijavu u traci').toHaveAttribute('aria-label', 'Prijava');

    await gumb.click();
    const prozor = page.locator('#authModal');
    await expect(prozor).toBeVisible();
    await expect(prozor.locator('.auth-modal__close'), 'ime gumba za zatvaranje').toHaveAttribute('aria-label', 'Zatvori');
    const oko = page.locator('#authSignInForm .auth-pass-toggle');
    await expect(oko, 'ime oka prije klika').toHaveAttribute('aria-label', 'Prikaži lozinku');
    // ② oko poslije klika
    await oko.click();
    await expect(oko, 'ime oka poslije klika').toHaveAttribute('aria-label', 'Sakrij lozinku');

    await page.fill('#authSignInEmail', 'ana@primjer.hr');
    await prozor.locator('.auth-modal__close').click();
    await expect(prozor).toBeHidden();

    // ③ prekidač dok je prozor zatvoren → sljedeće otvaranje je na novom jeziku
    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('en');
    await expect(gumb, 'gumb u traci prati prekidač').toHaveAttribute('aria-label', 'Sign in');
    await gumb.click();
    await expect(page.locator('#authModal')).toBeVisible();
    await expect(page.locator('#authModalTitle'), 'naslov prozora poslije prekidača').toHaveText(/Welcome to Sokrat/);
    await expect(page.locator('#authModal .auth-modal__close')).toHaveAttribute('aria-label', 'Close');
    await expect(page.locator('#authSignInForm .auth-pass-toggle')).toHaveAttribute('aria-label', 'Show password');
    await expect(page.locator('#authSignInEmail'), 'upisani e-mail preživi ponovnu gradnju prozora').toHaveValue('ana@primjer.hr');
    expect(await page.locator('#authModal').count(), 'točno jedan prozor').toBe(1);
  });
});

test.describe('jezik uređaja — susjedni jezici', () => {
  test.use({ locale: 'sr-RS' });

  test('srpski uređaj → engleski (Leon: samo hrvatski otvara hrvatsko sučelje)', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.getUiLang);
    expect(await page.evaluate(() => window.getUiLang())).toBe('en');
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
  });
});
