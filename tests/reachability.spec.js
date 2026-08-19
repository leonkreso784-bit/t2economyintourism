// K3 · BRANA DOHVATLJIVOSTI — odjavljen posjetitelj (faza „KOSTUR", spec §8).
//
// ── KRITERIJ JE POOŠTREN, I TO NIJE FORMALNOST ───────────────────────────────────
// Izvorno je glasio: „iz svake stranice dohvatljiva je bar jedna druga u jednom kliku."
// Tako napisan mjeri POSTOJANJE izlaza — a oba kvara koja su fazu pokrenula izlaz su
// imala. BUG-026 je vodio na lekcijsku stranicu čvora koja crta prazninu, BUG-027 je
// vraćao u editor iz kojeg si upravo izašao. **Oba bi prošla branu kako je bila
// napisana.** Zato ovdje stoje četiri tvrdnje, a ne jedna:
//
//   ① POGODAK        klik na sredinu kontrole završi na TOJ kontroli
//   ② NEPREKLAPANJE  nijedne dvije kontrole u kromu se ne sijeku
//   ③ ISHOD          izlaz vodi na stranicu koja se stvarno prikaže, bez greške
//   ④ ZAVRŠETAK      uzastopni „natrag" stigne na landing i nikad ne oscilira
//
// ── OBRNUTA PROVJERA (izmjereno na kodu prije K3a) ───────────────────────────────
// Tvrdnja ① i ② PADAJU na 320 px: `.topbar-nav` se stisnuo na širinu 0, „Predmeti"
// isplivali ispod prekidača jezika, i klik na njih PREBACIVAO JE JEZIK umjesto da
// otvori katalog (BUG-029). Tvrdnje ③ i ④ prolaze i prije popravka — one čuvaju model
// vraćanja iz K2a/K2b, koji K3 ne mijenja. **Brana koja bi i njih oborila mjerila bi
// nešto drugo nego što tvrdi.**
//
// ⚠️ ZAŠTO SE ŠIRINE POSTAVLJAJU OVDJE, A NE PROJEKTIMA: 320 px je donja granica iz
// kriterija prihvaćanja (spec §2), a najuži Playwright profil je 375. Dodati projekt na
// 320 značilo bi vrtjeti CIJELU suitu na petoj širini zbog jedne tvrdnje. Spec zato sam
// pomiče ekran — i zato se, kao `layout-guard` i `a11y`, vrti **jednom**: sva četiri
// iPhone profila dijele isti `hasTouch`, `deviceScaleFactor` i UA, pa bi ponavljanje
// bilo 4× isto mjerenje. (Prva verzija ovog komentara tvrdila je suprotno — da profili
// mijenjaju hit-testing. Zvučalo je uvjerljivo i bilo je netočno; provjereno u configu.)
const { test, expect } = require('@playwright/test');
const G = require('./helpers/reach-gate');

test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'brana sama postavlja širine → vrti se jednom');
});

test('① + ② kromo: nijedna kontrola nije promašena ni preklopljena (320…430 px)', async ({ page }) => {
    const kvarovi = [];

    for (const w of G.SIRINE) {
        await page.setViewportSize({ width: w, height: 720 });
        await page.goto('/');
        await G.spreman(page);

        for (const s of G.STRANICE_JAVNE) {
            await G.idiNa(page, s);
            const m = await G.mjeriKromo(page);

            // Kromo bez ijedne vidljive kontrole nije „čisto" nego slijep ekran.
            if (m.vidljivih === 0) kvarovi.push(w + 'px ' + s + ': kromo NEMA nijednu vidljivu kontrolu');
            m.promasaji.forEach((p) => kvarovi.push(w + 'px ' + s + ' · promašaj: ' + p));
            m.preklopi.forEach((p) => kvarovi.push(w + 'px ' + s + ' · preklop: ' + p));
        }
    }

    expect(kvarovi, 'kontrole u kromu koje ne rade ono što pišu').toEqual([]);
});

test('③ ishod: izlaz vodi na stranicu koja se stvarno prikaže, bez greške', async ({ page }) => {
    const greske = [];
    page.on('pageerror', (e) => greske.push(e.message));

    await page.setViewportSize({ width: 390, height: 844 });
    const kvarovi = [];

    for (const s of G.STRANICE_JAVNE) {
        if (s === 'landing') continue;               // landing NEMA drugi red — on je vrh
        await page.goto('/');
        await G.spreman(page);
        await G.idiNa(page, s);

        const prije = await page.evaluate(() => AppState.nav.page);
        const kliknuo = await page.evaluate(() => {
            const b = document.getElementById('pathbarBack');
            if (!b || b.offsetParent === null) return false;
            b.click();
            return true;
        });
        if (!kliknuo) { kvarovi.push(s + ': nema izlaza u kromu'); continue; }
        await page.waitForTimeout(500);

        const ishod = await page.evaluate(() => {
            const aktivne = Array.prototype.slice.call(document.querySelectorAll('section[id$="-page"]'))
                .filter((x) => x.classList.contains('active'));
            return {
                stranica: AppState.nav.page,
                subject: AppState.nav.subject || '',
                aktivnih: aktivne.length,
                id: aktivne.length ? aktivne[0].id : '',
                duljinaTeksta: aktivne.length ? aktivne[0].innerText.trim().length : 0
            };
        });

        if (ishod.stranica === prije) kvarovi.push(s + ': izlaz nije nikamo odveo');
        if (ishod.aktivnih !== 1) kvarovi.push(s + ' → ' + ishod.stranica + ': aktivnih sekcija ' + ishod.aktivnih + ', treba 1');
        // Prazna stranica izgleda kao da je gradivo nestalo — to je bio BUG-023/BUG-026.
        if (ishod.duljinaTeksta < 20) kvarovi.push(s + ' → ' + ishod.stranica + ': odredište je PRAZNO (' + ishod.duljinaTeksta + ' znakova)');
        // Imenovana zabrana iz pooštrenog kriterija.
        if (ishod.stranica === 'lessons' && ishod.subject.indexOf('node:') === 0) {
            kvarovi.push(s + ': izlaz je otvorio lekcijsku stranicu ČVORA (BUG-026)');
        }
    }

    expect(kvarovi, 'izlazi koji vode nekamo besmisleno').toEqual([]);
    expect(greske, 'greške stranice pri izlasku').toEqual([]);
});

test('④ završetak: „natrag" stigne na landing i nikad ne oscilira', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const kvarovi = [];

    for (const s of G.STRANICE_JAVNE) {
        await page.goto('/');
        await G.spreman(page);
        await G.idiNa(page, s);

        const lanac = await G.lanacNatrag(page);
        const zadnji = lanac[lanac.length - 1];

        if (s === 'landing') {
            // Landing je vrh hijerarhije — drugi red se ondje NE crta, i to je odluka.
            if (zadnji !== '(nema izlaza)') kvarovi.push('landing: očekivan vrh, dobiveno ' + lanac.join(' → '));
            continue;
        }

        if (zadnji !== 'landing') kvarovi.push(s + ': lanac ne završava na landingu → ' + lanac.join(' → '));

        // Petlja = isti čvor dvaput u PENJANJU. Kad se to dogodi, korisnik se vrti u krug
        // (BUG-027) — a lanac se ne bi ni zaustavio da straža u `lanacMrvica` ne postoji.
        const vidjeni = new Set();
        lanac.forEach((p) => {
            if (vidjeni.has(p)) kvarovi.push(s + ': PETLJA — „' + p + '" dvaput u ' + lanac.join(' → '));
            vidjeni.add(p);
        });
    }

    expect(kvarovi, 'lanci vraćanja koji se ne zatvaraju').toEqual([]);
});

test('④b dubina UNUTAR stranice ide prije dubine među stranicama (browse)', async ({ page }) => {
    // K2b: browse drill-down (fakultet → smjer → godina → predmeti) ne stvara unose u
    // povijesti, jer se ne mijenja stranica nego njezin sadržaj. Da globalni „natrag" to
    // ne zna, s razine „predmeti" izletio bi ravno s browsea i preskočio tri razine kroz
    // koje je korisnik upravo prošao.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await G.spreman(page);
    await G.idiNa(page, 'browse');

    // Spusti se koliko god dopusti — dubina ovisi o katalogu, pa se NE zakucava.
    const razine = [await page.evaluate(() => browseState.level)];
    for (let i = 0; i < 4; i++) {
        const usao = await page.evaluate(() => {
            const k = document.querySelector('#browse-page .browse-card, #browse-page [data-faculty], #browse-page [data-program]');
            if (!k) return false;
            k.click();
            return true;
        });
        if (!usao) break;
        await page.waitForTimeout(300);
        const l = await page.evaluate(() => browseState.level);
        if (l === razine[razine.length - 1]) break;
        razine.push(l);
    }
    test.skip(razine.length < 2, 'katalog nema dubinu za probu drill-downa');

    const lanac = await G.lanacNatrag(page);
    expect(lanac[lanac.length - 1], 'lanac iz dubine browsea: ' + lanac.join(' → ')).toBe('landing');
    // Koliko smo se spustili, toliko se moramo i popeti prije nego izađemo s browsea.
    const brojBrowseKoraka = lanac.filter((p) => p.indexOf('browse') === 0).length;
    expect(brojBrowseKoraka, 'razina browsea u lancu (spustili smo se ' + razine.length + ')').toBeGreaterThanOrEqual(razine.length);
});
