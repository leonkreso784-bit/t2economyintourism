// ===== P3 (POLICA) — pravilo u Service Workeru, kroz pravi preglednik =====
//
// Ovo je KRITERIJ CIJELE FAZE, ne još jedna tvrdnja: „u zrakoplovnom načinu otvori
// skinuti predmet i on se otvori". P1 je skinuo bajtove, P2 ih je pokazao na polici,
// ali do P3 ih `sw.js` nije posluživao po pravilu — samo slučajno, dok se `?v=` poklapa.
//
// ⚠️ ZAŠTO OVAJ SPEC POSTOJI ODVOJEN OD `sw.spec.js`: ondje se dokazuje da app-SHELL
// radi offline (index.html + bundle). Ljuska bez gradiva je prazna aplikacija — student
// vidi izbornik i nijednu karticu. Ovdje se mjeri SADRŽAJ.
//
// ⚠️ OBRNUTA PROVJERA JE OBAVEZNA I NIJE UKRAS: predmet koji NIJE skinut mora offline
// PASTI. Bez nje test ne mjeri policu nego opći keš — stale-while-revalidate bi svaki
// posjećeni predmet ionako posluživao, pa bi tvrdnja prolazila i da P3 uopće ne postoji.

const { test, expect } = require('@playwright/test');

// Ovaj spec, kao i `sw.spec.js`, treba pravi Service Worker (globalni config ga gasi).
test.use({ serviceWorkers: 'allow' });

const PREDMET = 'statistics';              // ima i vježbe i lib → najgori slučaj plana
const NACINI = ['learn', 'flashcards', 'quiz', 'fill'];

/** Registriran, aktiviran i — najvažnije — SW koji KONTROLIRA ovu stranicu. */
async function podKontrolomSW(page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
}

/** Uređaj bez ijednog skinutog predmeta — testovi ne nasljeđuju tuđe stanje. */
async function cistUredaj(page) {
  await page.evaluate(async () => {
    window.localStorage.removeItem('sokrat-offline-v1');
    if (window.caches) await window.caches.delete('sokrat-offline');
  });
}

/** Prva lekcija predmeta — iz KATALOGA, da novi sadržaj ne ruši test. */
function prvaLekcija(page, id) {
  return page.evaluate((s) => {
    const x = SokratCatalog.getSubject(s);
    return (x && x.lessons && x.lessons[0]) ? x.lessons[0].id : null;
  }, id);
}

test.describe('POLICA · P3 (pravilo u SW-u) + P4 (napredak bez mreže)', () => {
  test('⛔ KRITERIJ FAZE: skinut predmet se offline OTVORI i sva četiri načina rade', async ({ page, context }) => {
    await page.goto('/index.html');
    await podKontrolomSW(page);

    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });

    const lekcija = await prvaLekcija(page, PREDMET);
    expect(lekcija, 'katalog mora imati bar jednu lekciju').toBeTruthy();

    // Ljuska (app JS/CSS) mora biti u kešu PRIJE nego mreža padne — inače test mjeri
    // stale-while-revalidate ljuske, a ne policu.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await context.setOffline(true);
    try {
      await page.goto('/#/subject/' + PREDMET + '/' + lekcija);
      await page.waitForFunction(() => window.AppState && AppState.nav.page === 'study', null, { timeout: 25000 });

      // ① Gradivo je STVARNO stiglo. Sama `study` stranica se nacrta i kad sadržaj
      //    padne, pa bi tvrdnja o adresi prolazila nad praznom stranicom.
      const ucitano = await page.evaluate(async (arg) => {
        try {
          const d = await window.SokratContent.loadLesson(arg[0], arg[1]);
          // Lekcija je kljucana po KATEGORIJAMA gradiva, ne po nacinima ucenja
          // (`flashcards`/`quiz`/…) — prva verzija ovog testa je to pretpostavila i
          // pala nad ISPRAVNIM kodom. Mjeri se ono sto stvarno dodje: ima li sadrzaja.
          return !!(d && typeof d === 'object' && Object.keys(d).length > 0);
        } catch (e) { return false; }
      }, [PREDMET, lekcija]);
      expect(ucitano, 'gradivo skinutog predmeta mora doći iz keša').toBe(true);

      // ② Ono što student stvarno radi: sva četiri načina se nacrtaju.
      for (const nacin of NACINI) {
        await page.evaluate((s) => {
          const b = document.querySelector('.study-nav-btn[data-section="' + s + '"]');
          if (b) b.click();
        }, nacin);
        await page.waitForFunction((s) => {
          const el = document.getElementById(s);
          return !!el && el.classList.contains('active') && el.getBoundingClientRect().height > 0;
        }, nacin, { timeout: 20000 });
      }
    } finally {
      await context.setOffline(false);
    }
  });

  test('⛔ OBRNUTO: predmet koji NIJE skinut offline PADNE (inače test mjeri opći keš)', async ({ page, context }) => {
    await page.goto('/index.html');
    await podKontrolomSW(page);

    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    // Drugi predmet se bira IZ KATALOGA, ne zakucava: bilo koji koji nije naš i ima lekcije.
    const drugi = await page.evaluate((nas) => {
      // `SokratCatalog.all()`, ne `listSubjects()` — potonji postoji na `SokratContent`,
      // a ne na katalogu. Prva verzija je zvala krivi i test se TIHO PRESKAKAO,
      // sto je gore od pada: obrnuta provjera je izgledala kao da postoji.
      const svi = SokratCatalog.all ? SokratCatalog.all() : [];
      const kandidat = svi.filter((s) => s && s.id !== nas && s.lessons && s.lessons.length)[0];
      return kandidat ? kandidat.id : null;
    }, PREDMET);
    test.skip(!drugi, 'katalog nema drugi predmet za obrnutu provjeru');

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const lekcija = await prvaLekcija(page, drugi);
    test.skip(!lekcija, 'drugi predmet nema lekciju');

    await context.setOffline(true);
    try {
      const uspjelo = await page.evaluate(async (arg) => {
        try {
          const d = await window.SokratContent.loadLesson(arg[0], arg[1]);
          return !!(d && typeof d === 'object' && Object.keys(d).length > 0);
        } catch (e) { return false; }
      }, [drugi, lekcija]);
      expect(uspjelo, 'neskinut predmet NE SMIJE raditi offline — inače polica ne znači ništa').toBe(false);
    } finally {
      await context.setOffline(false);
    }
  });

  // ⚠️ OVO JE JEDINI TEST KOJI MJERI BAS P3, i to treba reci naglas.
  //
  // Tvrdnja „skinut predmet radi offline" prolazila bi i BEZ ove cigle: `caches.match(req)`
  // bez `cacheName` pretrazuje SVE kesove, pa se skinuta datoteka posluzi sama od sebe —
  // dok se `?v=` tocno poklapa. Prvi deploy to razbije: stranica trazi `?v=novi`, u kesu
  // lezi `?v=stari`, poklapanja nema i skinut predmet postane NEVIDLJIV.
  // To je kvar zbog kojeg faza POLICA postoji, i hvata ga samo ovaj test.
  test('⛔ POSLIJE DEPLOYA: skinuto se offline i dalje otvara, iako je `?v=` drugi', async ({ page, context }) => {
    await page.goto('/index.html');
    await podKontrolomSW(page);

    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const plan = await page.evaluate((s) => window.SokratOffline.plan(s), PREDMET);
    expect(plan.length).toBeGreaterThan(0);

    await context.setOffline(true);
    try {
      const rez = await page.evaluate(async (adrese) => {
        const izlaz = [];
        for (const stara of adrese) {
          // „Deploy": ista datoteka, drugi token. Nista drugo se ne mijenja.
          const nova = stara.replace(/\?v=.*$/, '?v=20990101000000');
          try {
            const r = await fetch(nova);
            const t = await r.text();
            izlaz.push({ url: nova, ok: !!(r && r.ok), duljina: t.length });
          } catch (e) {
            izlaz.push({ url: nova, ok: false, err: String(e) });
          }
        }
        return izlaz;
      }, plan);

      rez.forEach((r) => {
        expect(r.ok, 'poslije deploya mora doci STARA kopija umjesto nicega: ' + r.url + ' ' + (r.err || '')).toBe(true);
        expect(r.duljina, 'prazan odgovor je isto sto i nista: ' + r.url).toBeGreaterThan(0);
      });

      // Obrnuto u istom dahu: datoteka koja NIJE skinuta ne smije se pojaviti ni sa
      // starim ni s novim tokenom — inace bi `ignoreSearch` posluzivao bilo sto.
      const tudje = await page.evaluate(async () => {
        try {
          const r = await fetch('data/json/statistics/nepostojeci.json?v=20990101000000');
          return !!(r && r.ok);
        } catch (e) { return false; }
      });
      expect(tudje, 'neskinuta datoteka ne smije doci iz police').toBe(false);
    } finally {
      await context.setOffline(false);
    }
  });

  // Druga polovica P3, i nije ukras. SW poslije deploya posluzi STARU kopiju kad mreze
  // nema — to je namjerno (staro gradivo > prazan ekran), ali korisnik tada uci staru
  // verziju. Ako mu to nitko ne kaze, cigla je tiho pogorsala tocnost gradiva.
  test('⛔ ZASTARJELO SE VIDI i da se osvjeziti (cijena dvorazinskog kesa ide na ekran)', async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    const red = page.locator('#offlineControl .offline-row');
    await page.locator('#offlineControl .offline-btn').click();
    await expect(red).toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });
    await expect(page.locator('#offlineControl .offline-refresh')).toBeHidden();

    // „Deploy" bez deploya: token se pomakne, uredjaj ostaje isti.
    await page.evaluate((s) => {
      window.CONTENT_VERSION = '20990101000000';
      window.SokratOffline.mount(document.getElementById('offlineControl'), s);
    }, PREDMET);

    await expect(red).toHaveAttribute('data-offline-state', 'stale');
    await expect(page.locator('#offlineControl .offline-meta')).toHaveText(/Outdated|Zastarjel/i);
    const osvjezi = page.locator('#offlineControl .offline-refresh');
    await expect(osvjezi).toBeVisible();

    // Osvjezavanje je NA DODIR (nikad automatsko — trosi tudji promet) i mora ugasiti alarm.
    await osvjezi.click();
    await expect(red).toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });
    await expect(osvjezi).toBeHidden();
  });

  test('polica takodjer pokazuje zastarjelost — isti zapis, isti sud', async ({ page }) => {
    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });

    await page.goto('/#/materials');
    await page.waitForFunction(() => !!document.querySelector('#shelfList .shelf-tile'), null, { timeout: 20000 });
    await expect(page.locator('#shelfList .shelf-tile').first()).not.toHaveAttribute('data-shelf-stale', '1');

    await page.evaluate(() => {
      window.CONTENT_VERSION = '20990101000000';
      window.SokratOffline.mountShelf(document.getElementById('shelfList'));
    });
    const plocica = page.locator('#shelfList .shelf-tile[data-shelf-id="' + PREDMET + '"]');
    await expect(plocica).toHaveAttribute('data-shelf-stale', '1');
    await expect(plocica.locator('[data-shelf-refresh]')).toBeVisible();
  });

  // P4 zatvara petlju: sinkronizacija je vec offline-first (dokazano u
  // tests/unit/cloud-sync.test.js), ali to nista ne vrijedi ako se offline uopce
  // NEMA sto spremiti. Ovo je jedina karika koju jedinicni test ne moze vidjeti.
  test('⛔ P4: napredak steceni BEZ MREZE stvarno zavrsi na uredjaju', async ({ page, context }) => {
    // Isti razlog kao u `sw.spec.js`: fiksni cookie-banner presrece dodir. Ovo je jedini
    // test u specu koji stvarno KLIKCE duboko u stranici, pa jedini to treba.
    await page.addInitScript(() => {
      try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
    });
    await page.goto('/index.html');
    await podKontrolomSW(page);

    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const kljuc = await page.evaluate((s) => {
      const x = SokratCatalog.getSubject(s);
      return x ? x.storageKey : null;
    }, PREDMET);
    expect(kljuc, 'predmet mora imati storageKey').toBeTruthy();

    // Zateceno stanje se pamti, ne pretpostavlja: uredjaj je mozda vec ucio.
    const prije = await page.evaluate((k) => window.localStorage.getItem(k), kljuc);

    const lekcija = await prvaLekcija(page, PREDMET);

    // ⚠️ LEKCIJA SE OTVORI DOK MREŽA JOŠ RADI, i to nije popuštanje nego uvjet da test mjeri ono
    // što tvrdi. Do F1/13 je klik na ✓ bio vezan RAVNO na `markKnown`, pa je upis nastajao i nad
    // PRAZNIM špilom — test je bio zelen dok je na kartici pisalo „No flashcards available for this
    // lesson." Od F1/13 sud bez kartice ne postoji (`sudi()` staje na praznom špilu) i fikcija je
    // ispala na vidjelo. Izmjereno sondom (2026-09-06): na HLADNOJ offline navigaciji špil ostaje
    // prazan i 30 s — gradivo se ne učita iako su datoteke u kešu (**BUG-045**, zaseban nalaz);
    // kad je lekcija jednom otvorena, offline špil ima svih 61 karticu.
    // Tvrdnja OVOG testa je TRAJNOST napretka bez mreže; da se gradivo posluži iz keša tvrdi prva
    // tvrdnja u ovom specu.
    await page.goto('/#/subject/' + PREDMET + '/' + lekcija);
    await page.waitForFunction(() => window.AppState && AppState.nav.page === 'study', null, { timeout: 25000 });
    // ⚠️ Klik zna stići PRIJE nego traka načina učenja postoji, i tada tiho ne napravi ništa
    // (špil se svejedno napuni, jer `initFlashcards` vrti i sam ulazak u lekciju — pa čekanje na
    // `deck > 0` NIJE dokaz da je mod otvoren). Zato se klik ponavlja dok sekcija stvarno ne bude
    // otvorena, a tek onda se čeka špil.
    await expect.poll(async () => await page.evaluate(() => {
      const b = document.querySelector('.study-nav-btn[data-section="flashcards"]');
      if (b) b.click();
      const el = document.getElementById('flashcards');
      return !!el && el.classList.contains('active') && el.getBoundingClientRect().height > 0;
    }), { message: 'mod kartica se nije otvorio', timeout: 20000 }).toBe(true);
    await page.waitForFunction(() => AppState.cards.deck && AppState.cards.deck.length > 0, null, { timeout: 20000 });

    await context.setOffline(true);
    try {
      // NIKAD SUD NAD PRAZNIM ŠPILOM — inače ovaj test opet počne mjeriti fikciju.
      const kartica = await page.evaluate(() => AppState.cards.deck.length);
      expect(kartica, 'bez kartice u špilu ovaj test ne mjeri napredak nego prazan upis').toBeGreaterThan(0);

      // Jedna kartica oznacena kao naucena — najmanja radnja koja proizvodi napredak.
      //
      // ⚠️ Klik ide kroz `evaluate`, a ne kao pravi dodir, i to je namjerno: na telefonskom
      // profilu je bocni izbornik s predmetima DIO RASPOREDA i prekriva studijski stupac,
      // pa Playwrightova provjera izvedivosti nikad ne prodje. DOHVATLJIVOST kontrola na
      // telefonu mjeri phone-gate (osnovica je prazna) — ovdje bi bila druga kopija iste
      // cinjenice. Ovaj test tvrdi TRAJNOST napretka bez mreze, ne pogodak prsta.
      await page.evaluate(() => {
        const b = document.getElementById('btnCorrect');
        if (b) b.click();
      });

      // ⚠️ ČEKA SE STANJE, NE VRIJEME. Do F1/13 je ✓ upisivao odmah, pa je fiksnih 300 ms bilo
      // dovoljno; od F1/13 gumb LETI (pečat „Znam", ~280 ms) i upisuje TEK po slijetanju — 300 ms
      // je time postalo utrka, i puna suita ju je izgubila na sva četiri profila. Tvrdnja ovog
      // testa je TRAJNOST napretka bez mreže, a ne koliko brzo stigne, pa se čeka zapis.
      await expect.poll(
        async () => await page.evaluate((k) => window.localStorage.getItem(k), kljuc),
        { message: 'bez mreze se napredak MORA zapisati na uredjaj', timeout: 5000 }
      ).not.toBe(prije);

      const poslije = await page.evaluate((k) => window.localStorage.getItem(k), kljuc);
      expect(poslije, 'bez mreze se napredak MORA zapisati na uredjaj').toBeTruthy();
      expect(poslije).not.toBe(prije);
    } finally {
      await context.setOffline(false);
    }
  });

  test('skinuto se poslužuje IZ KEŠA, bez ijednog mrežnog poziva (② ne troši tuđi promet)', async ({ page }) => {
    await page.goto('/index.html');
    await podKontrolomSW(page);

    await page.goto('/#/subject/' + PREDMET);
    await page.waitForFunction(() => !!window.SokratOffline);
    await cistUredaj(page);
    await page.reload();
    await page.waitForFunction(() => !!window.SokratOffline);

    await page.locator('#offlineControl .offline-btn').click();
    await expect(page.locator('#offlineControl .offline-row'))
      .toHaveAttribute('data-offline-state', 'ready', { timeout: 45000 });

    const plan = await page.evaluate((s) => window.SokratOffline.plan(s), PREDMET);
    expect(plan.length).toBeGreaterThan(0);

    // Točan `?v=` → cache-first BEZ mreže. Mjeri se ono što je stvarno otišlo van:
    // `requestfinished` puca i za odgovore koje je SW poslužio iz keša, pa se gleda
    // `response.fromServiceWorker()`.
    const izMreze = [];
    page.on('response', (res) => {
      const u = res.url();
      if (plan.some((p) => u.endsWith(p)) && !res.fromServiceWorker()) izMreze.push(u);
    });

    const lekcija = await prvaLekcija(page, PREDMET);
    await page.goto('/#/subject/' + PREDMET + '/' + lekcija);
    await page.waitForFunction(() => window.AppState && AppState.nav.page === 'study', null, { timeout: 25000 });
    await page.waitForTimeout(1000);

    expect(izMreze, 'skinuto gradivo ne smije ponovno ići na mrežu').toEqual([]);
  });
});
