// STRANICA „O NAMA" — IZLAZ I JEZIK (2026-08-24)
//
// ── ZAŠTO OVA BRANA POSTOJI ──────────────────────────────────────────────────────
// Leon je 2026-08-22 presudio da je `about` KVAR, ne proza: *stranica bez ijedne
// kontrole u prvom ekranu čita se kao slijepa ulica*. Mjerenje prije popravka je tu
// presudu pooštrilo — stranica nije imala kontrolu ni ISPOD prvog ekrana:
//
//     cijela stranica = 1 kontrola  ·  `mailto:` na y = 1411 px  ·  0 dohvatljivih
//     bez skrola na 320 / 393 / 430 / 852 px, jednako s cookie-trakom i bez nje
//
// ⚠️ Zatečeni nalaz phone-brane imenovao je cookie-traku („kromo 159 px + banner
// 129 px"), pa se čitao kao problem KROMA. Nije bio: mjerenje s već odbijenom
// privolom daje istih **0** dohvatljivih. Isti razred greške koji je T4 već platio —
// *nalaz koji nešto imenuje nije time i optužio to.*
//
// ⚠️ DRUGI KVAR, KOJI NIJE BIO ZAPISAN NIGDJE: stranica je imala **nula** `data-i18n`
// atributa. Cijeli tekst — misija, „Created by students, for students", opis
// platforme — bio je zakucan engleski, pa je korisnik s prekidačem na 🇭🇷 dobivao
// englesku stranicu. T4 je isti kvar našao na cookie-traci i zapisao pouku, ali kao
// anegdotu o JEDNOJ traci; nitko nije prebrojao ostale površine. Zato tvrdnja ③ ne
// mjeri prijevod nego SASTAV: svaki element koji nosi vlastiti tekst mora imati ključ.
//
// ── ŠTO SE MJERI ─────────────────────────────────────────────────────────────────
//   ① IZLAZ    bar dvije kontrole DOHVATLJIVE bez skrola, i to na 320 px
//   ② ODREDIŠTE oba gumba stvarno vode u proizvod (katalog / vlastito gradivo)
//   ③ JEZIK    nijedan tekst nije zakucan — svaki nositelj teksta ima `data-i18n`
//   ④ NASLOV   stranica ima naslov za čitač ekrana, ali ne DVAPUT na ekranu (T2)
//   ⑤ MJERA    obrnuta provjera: bez vrata ista mjera mora PASTI
const { test, expect } = require('@playwright/test');

// 320 px je najuži kriterij iz spec §2, a projekt je već dvaput platio to što su
// projekti suite najuži na 375: BUG-029 (gumb ispod prekidača jezika) i T5 (tvrdnja
// koja je na 375 px prošla nad kvarom).
const USKO = { width: 320, height: 568 };

test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375',
        'širina se postavlja u testu (320 px) → vrti se jednom');
    await page.setViewportSize(USKO);
});

/**
 * Otvori `about` s cookie-trakom u zadanom stanju.
 *
 * ⚠️ ČEKA SE DA SE CRTANJE SMIRI, NE DA SE POJAVE VRATA. Prva verzija ovog helpera je
 * čekala `.about-actions` — dakle **točno ono što tvrdnja ① mjeri**. Protiv zatečenog
 * stanja je zbog toga padala na `TimeoutError` umjesto na „0 dohvatljivih kontrola":
 * crveno jest bilo, ali je govorilo o brani, ne o stranici. Ista greška zbog koje T0
 * postoji (spec §9.7): *čekanje ne smije pretpostaviti ishod mjerenja.*
 */
async function otvori(page, { privola }) {
    if (privola) {
        await page.addInitScript(() => {
            try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
        });
    }
    await page.goto('/#/about');
    await page.waitForSelector('#about-page.active', { timeout: 20000 });

    let prije = null;
    const kraj = Date.now() + 6000;
    while (Date.now() < kraj) {
        const sad = await page.evaluate(() => {
            const el = document.querySelector('#about-page');
            if (!el) return '';
            return el.innerHTML.length + '/' + el.querySelectorAll('*').length
                + '/' + Math.round(el.getBoundingClientRect().height);
        });
        if (sad !== '' && sad === prije) return;
        prije = sad;
        await page.waitForTimeout(180);
    }
}

/** Kontrole `about`-a koje se mogu DOTAKNUTI bez skrola (pogodak, ne geometrija). */
const DOHVATLJIVE = () => {
    const kromo = document.querySelector('.chrome');
    const kromoH = kromo ? kromo.getBoundingClientRect().height : 0;
    const vh = window.innerHeight;
    const sel = ['a[href]', 'button', '[role="button"]']
        .map((s) => '#about-page ' + s).join(', ');
    return Array.from(document.querySelectorAll(sel)).filter((el) => {
        const q = el.getBoundingClientRect();
        const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
        if (cy < kromoH - 1 || cy > vh) return false;
        // Prekrivena kontrola ima savršen pravokutnik i nikakvu upotrebljivost —
        // cookie-traka je fiksna i `z-index: 2147483000` (K3 / T4).
        const meta = document.elementFromPoint(cx, cy);
        return !!meta && (meta === el || el.contains(meta));
    }).map((el) => el.className);
};

// ⚠️ Tvrdnja se vrti u OBA stanja privole namjerno. Da se vrti samo s odbijenom
// privolom, mjerila bi stranicu koju prvi posjetitelj nikad ne vidi.
for (const privola of [false, true]) {
    const kad = privola ? 'privola već odbijena' : 'PRVI POSJET (traka stoji)';
    test('① izlaz postoji bez skrola na 320 px — ' + kad, async ({ page }) => {
        await otvori(page, { privola });
        const dohvatljive = await page.evaluate(DOHVATLJIVE);
        expect(dohvatljive.length,
            'na `about` se bez skrola ne da dotaknuti nijedna kontrola → slijepa ulica')
            .toBeGreaterThanOrEqual(2);
    });
}

test('② vrata stvarno vode u proizvod — katalog i vlastito gradivo', async ({ page }) => {
    await otvori(page, { privola: true });

    // Postojanje se tvrdi PRIJE klika: bez ovoga bi nestanak vrata izašao kao
    // `page.click: Test timeout` nakon dvije minute — crveno koje govori o alatu,
    // ne o stranici (ista greška koju je ovaj spec već jednom napravio u čekanju).
    const ima = await page.evaluate(() => ({
        katalog: !!document.querySelector('#about-page .about-btn--primary'),
        gradivo: !!document.querySelector('#about-page .about-btn[data-goto-materials]')
    }));
    expect(ima, 'vrata s `about`-a ne postoje u markupu').toEqual({ katalog: true, gradivo: true });

    await page.click('#about-page .about-btn--primary');
    await page.waitForSelector('#browse-page.active', { timeout: 20000 });

    await page.goto('/#/about');
    await page.waitForSelector('#about-page.active', { timeout: 20000 });
    await page.click('#about-page .about-btn[data-goto-materials]');
    await page.waitForSelector('#materials-page.active', { timeout: 20000 });
});

test('③ nijedan tekst nije zakucan — svaki nositelj teksta ima ključ', async ({ page }) => {
    await otvori(page, { privola: true });
    const bezKljuca = await page.evaluate(() => {
        // Vlastito ime i e-adresa se NE prevode — to nije rupa nego jedini ispravan
        // izuzetak. Popis je kratak i izričit, da se ne pretvori u kantu.
        const IZUZETO = ['creator-info', 'email-link'];
        const sekcija = document.getElementById('about-page');
        const nositelji = Array.from(sekcija.querySelectorAll('h1, h2, h3, p, span, a, button'));
        return nositelji.filter((el) => {
            if (IZUZETO.some((k) => el.closest('.' + k))) return false;
            // Zanima nas element koji sam nosi tekst, ne omotač djece.
            const vlastiti = Array.from(el.childNodes)
                .filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
            if (!vlastiti) return false;
            return !el.hasAttribute('data-i18n');
        }).map((el) => el.tagName.toLowerCase() + '.' + (el.className || '')
            + ' → "' + el.textContent.trim().slice(0, 40) + '"');
    });
    expect(bezKljuca, 'zakucan tekst na `about` — korisnik s 🇭🇷 dobiva engleski').toEqual([]);
});

test('④ naslov postoji za čitač ekrana, ali ne stoji dvaput na ekranu (T2)', async ({ page }) => {
    await otvori(page, { privola: true });
    const r = await page.evaluate(() => {
        const h1 = document.querySelector('#about-page h1');
        if (!h1) return { ima: false };
        const q = h1.getBoundingClientRect();
        const mrvica = document.querySelector('.crumb-current');
        return {
            ima: true,
            ime: h1.textContent.trim(),
            // `visually-hidden` je 1×1 px isječak — vidljiv naslov bi bio deseci px.
            visina: Math.round(q.height),
            mrvica: mrvica ? mrvica.textContent.trim() : null
        };
    });
    expect(r.ima, 'stranica bez `h1` nema naslov za čitač ekrana').toBe(true);
    expect(r.ime.length, 'prazan naslov').toBeGreaterThan(0);
    expect(r.visina, 'naslov je vidljiv, a mrvica već govori gdje si (T2)').toBeLessThan(5);
    expect(r.mrvica, 'mrvica ne imenuje razinu → naslov bi tada bio jedini identitet').toBeTruthy();
});

test('⑤ OBRNUTA PROVJERA — bez vrata ista mjera PADA', async ({ page }) => {
    // Bez ovoga tvrdnja ① dokazuje samo da je danas zeleno, ne i da bi pocrvenjela.
    await otvori(page, { privola: true });
    const bezVrata = await page.evaluate((fn) => {
        const akcije = document.querySelector('#about-page .about-actions');
        if (akcije) akcije.remove();
        // eslint-disable-next-line no-eval
        return eval('(' + fn + ')')();
    }, DOHVATLJIVE.toString());
    expect(bezVrata.length,
        'mjera ne primjećuje nestanak vrata — dakle ne bi uhvatila ni povratak kvara')
        .toBe(0);
});
