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
  await page.waitForSelector('.topbar');

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
  // ⚠️ F2/0 (2026-09-08): do tada je ovdje stajalo `.topbar .start-trigger`. CTA je obrisan
  // iz trake, pa se u browse ide onim putem kojim korisnik STVARNO ide — VRATIMA U HEROU.
  // Vozilo se mijenja, svojstvo koje test čuva (model vraćanja) ostaje isto.
  await page.click('.doors .door--primary.start-trigger');
  await page.waitForSelector('#browse-page.active');

  // ⚠️ T2: do ove cigle je ovdje stajao klik na `.topbar [data-goto-materials]`. Taj gumb
  // je Leonovom odlukom IZAŠAO iz trake (spec §9.6), pa vozila više nema — ali svojstvo
  // koje test čuva nije bilo vozilo nego **model vraćanja**: „natrag" vodi odakle si došao
  // i ruta se briše iz adrese. Zato se do police dolazi istim pozivom koji je gumb ionako
  // zvao (`navigateTo('materials')`), a scenarij (landing → browse → polica → natrag)
  // ostaje netaknut. *Test se mijenja odlukom, ne pada.*
  await page.evaluate(() => navigateTo('materials'));
  await page.waitForSelector('#materials-page.active');

  await page.click('#pathbarBack');   // K2b: jedan gumb natrag
  await page.waitForSelector('#browse-page.active', { timeout: 5000 });

  // Ostane li `#/materials` u adresi dok gledaš browse, reload bi te bacio natrag.
  //
  // ⚠️ Do K1 je ovdje stajalo `toBe('')`, jer je `#/materials` bila JEDINA ruta u aplikaciji
  // pa je „nije materials" i „nema hasha" bilo isto. Od K1 browse ima vlastitu adresu, pa
  // prazan hash više ne bi značio ispravno stanje nego IZGUBLJENU rutu. Tvrdnja je zato
  // pooštrena na točnu adresu — namjera (adresa opisuje ono što gledaš) ostaje ista i sad
  // je jače ispunjena: reload na `#/subjects` vraća na browse umjesto na landing.
  expect(new URL(page.url()).hash).toBe('#/subjects');
});

// ⚠️ TVRDNJA JE PROMIJENJENA DVAPUT, I NIJEDNOM ZATO STO JE PALA. Ovo je zapis obje promjene,
// jer bez njega izgleda kao da je brana s vremenom oslabila.
//
//  • Do K2b je test trazio ikonu ulaza U SVAKOM od tri zaglavlja (`#lessons-page
//    [data-goto-materials]`) — jer su `browse`/`lessons`/`study` nosili VLASTITU kopiju istog
//    trojca kontrola. To je bio opis kvara koji K2b uklanja, ne svojstvo koje stitimo.
//  • K2b je to zamijenio jacom tvrdnjom: ulaz je dohvatljiv sa svake od tih stranica i nosi
//    ga TOCNO JEDAN element u trajnom kromu.
//  • T2 je i tu tvrdnju ukinuo — ali ODLUKOM, ne mjerenjem: Leon je gumb maknuo iz trake
//    (*„taj gumb je na landingu i na profilu i to je DOVOLJNO"*, spec §9.6). Cijena je
//    IZRECENA u samom planu: iz UNUTRASNJOSTI aplikacije (katalog, lekcija, ucenje, Studio)
//    ulaza vise nema; ide se preko landinga ili profila.
//  • F2/0 (2026-09-08) je T2 OKRENUO, i opet ODLUKOM: Leon je CTA „Pocni uciti" nazvao
//    *„najbeskorisnijim smecem koje zauzima prostor gore"* i trazio da gore budu profil i UGC.
//    Time je placena cijena iz §9.6 VRACENA — ulaz je opet u trajnom kromu, dakle dohvatljiv
//    sa svake stranice. Vraca se tvrdnja koju je K2b vec jednom drzao, samo sto je sada
//    mjerena i na kartici i unutar aplikacije.
//
// Ono sto ovaj test sada stiti: ulaz je TOCNO JEDAN u traci (dva bi se natjecala i vratila
// kvar koji je K2b uklonio), stoji na SVAKOJ stranici, a landing ga i dalje ima vise puta —
// inace bi selidba u traku tiho pojela ulaze koji su ondje Leonovom odlukom.
test('ulaz u materijale JE u traci, tocno jedan i na svakoj stranici (F2/0; okrece T2)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(
    () => document.querySelectorAll('#landingSubjects .landing-subject-card').length > 0
  );

  // Landing: ulaza ima VISE (vrata u herou, ➕ plocica, CTA sekcije, podnozje) — Leonova
  // odluka, ne propust. Prva verzija ove tvrdnje brojala je sve i pala na 5: mjerila je
  // tocno, a tvrdila krivo.
  expect(await page.locator('[data-goto-materials]').count()).toBeGreaterThan(1);
  expect(await page.locator('.topbar [data-goto-materials]').count()).toBe(1);

  // Iz UNUTRASNJOSTI aplikacije traka sad NOSI ulaz — i to je bila cijela svrha F2/0.
  // Broj je `1`, ne `>= 1`: dva ulaza u istoj traci natjecu se medusobno i vracaju kvar
  // koji je K2b uklonio (svaka je stranica imala vlastitu kopiju istog trojca kontrola).
  await page.click('#landingSubjects .landing-subject-card[data-landing-subject="te2"]');
  await page.waitForSelector('#lessons-page.active');
  expect(await page.locator('.topbar [data-goto-materials]').count()).toBe(1);

  await page.click('#lessons-page .lessons-grid .lesson-card');
  await page.waitForSelector('#study-page.active', { timeout: 8000 });
  expect(await page.locator('.topbar [data-goto-materials]').count()).toBe(1);

  await page.evaluate(() => navigateTo('browse'));
  await page.waitForSelector('#browse-page.active');
  expect(await page.locator('.topbar [data-goto-materials]').count()).toBe(1);

  // ...i taj ulaz STVARNO vodi na policu, iz dubine aplikacije, bez povratka na landing.
  // (Do F2/0 se ovamo moralo preko landinga — to je bila zapisana cijena §9.6.)
  await page.click('.topbar [data-goto-materials]');
  await page.waitForSelector('#materials-page.active');

  // ...a stari put preko landinga NIJE izgubljen selidbom u traku.
  await page.evaluate(() => navigateTo('landing'));
  await page.waitForSelector('#landing-page.active');
  await page.click('.doors [data-goto-materials]');
  await page.waitForSelector('#materials-page.active');
});

test('u dokumentu postoji TOČNO JEDAN #myMaterials', async ({ page }) => {
  // C0 je stablo preselio s profila na vlastitu stranicu. Vrati li ga netko i na profil,
  // nastaju dva čvora s istim id-em → `mount()` crta u prvi, a korisnik gleda drugi.
  await page.goto('/');
  await page.waitForSelector('.topbar');
  expect(await page.locator('#myMaterials').count()).toBe(1);
});
