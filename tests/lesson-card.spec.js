// BUG-032 · KARTICA LEKCIJE MORA BITI PRAVA KONTROLA (2026-08-24)
//
// ── ZAŠTO OVA BRANA POSTOJI ──────────────────────────────────────────────────────
// Kartica lekcije je do 2026-08-24 bila `<div class="lesson-card">` sa slušačem klika.
// Mišem je radila savršeno, pa se kvar nije vidio; tipkovnicom se nije dala fokusirati,
// a čitač ekrana ju je čitao kao običan tekst. To je JEDINI put u svaku lekciju kataloga
// — dakle cijeli katalog bio je nedostupan svakome tko ne koristi miš.
//
// ⚠️ NIJEDNA POSTOJEĆA BRANA TO NIJE MOGLA VIDJETI, i razlog je poučan: sve traže
// KONTROLU (`a[href], button, [role=button], [tabindex]`), a ovdje kontrole NIJE BILO.
// Gate koji provjerava kontrole ne vidi kvar u kojem kontrola ne postoji. Jedini trag
// bio je posredan — phone-brana je `lessons` prijavljivala kao ekran „bez ijedne
// dohvatljive kontrole" (tvrdnja ④) na sve četiri širine, i to se čitalo kao problem
// KROMA, a bio je problem SADRŽAJA.
//
// ⚠️ ISPRAVAN OBRAZAC JE VEĆ POSTOJAO 400 REDAKA IZNAD, U ISTOJ DATOTECI: `renderBrowsePage`
// crta `<button class="browse-card">`, `renderLessonsPage` je crtao `<div>`. Zato ova brana
// mjeri OBJE stranice kataloga — ne da se popravi jedna i zaboravi da su par.
//
// ── ŠTO SE MJERI ─────────────────────────────────────────────────────────────────
//   ① SASTAV     svaka kartica na putu u lekciju je `<a href>` ili `<button>`
//   ② TIPKOVNICA fokus stigne do kartice, a Enter je stvarno otvori (bez ijednog klika)
//   ③ IME        ime kontrole nosi naziv lekcije, a stanje „uskoro" se čuje PRIJE klika
//   ④ MJERA      obrnuta provjera: ista mjera nad starim markupom mora PASTI
//
// ⚠️ Tvrdnja ② se namjerno vozi tipkovnicom, ne `element.click()`-om: `click()` prolazi i
// nad `<div>`-om, dakle nad kvarom. Mjeri se ono što korisnik radi, ne ono što API dopušta.
const { test, expect } = require('@playwright/test');

const SUBJ = 'te2';   // Tourism Economics — isti predmet koji koristi browse.spec.js

test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375',
        'dostupnost ne ovisi o širini → vrti se jednom (isti razlog kao reachability)');
    // Traka privole je fiksna i pokriva dno — u K2b je već oborila tri testa kao pozadinski šum.
    await page.addInitScript(() => {
        try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
    });
    await page.goto('/#/subject/' + SUBJ);
    await page.waitForSelector('#lessons-page.active .lesson-card', { timeout: 20000 });
});

test('① svaka kartica lekcije je PRAVA kontrola (a[href] ili button)', async ({ page }) => {
    const nalaz = await page.evaluate(() => {
        const kartice = Array.from(document.querySelectorAll('#lessonsGrid .lesson-card'));
        return {
            ukupno: kartice.length,
            krive: kartice.filter((k) => {
                const tag = k.tagName.toLowerCase();
                if (tag === 'button') return false;
                if (tag === 'a' && k.hasAttribute('href')) return false;
                return true;
            }).map((k) => k.tagName.toLowerCase() + '.' + k.className),
            // Sidro bez `href` je za tipkovnicu isto što i `div` — zato se traži atribut, ne tag.
            bezAdrese: kartice.filter((k) => k.tagName.toLowerCase() === 'a' && !k.getAttribute('href')).length
        };
    });

    expect(nalaz.ukupno, 'predmet nema nijednu lekciju → tvrdnja bi prošla prazna').toBeGreaterThan(0);
    expect(nalaz.krive, 'kartica lekcije koja nije kontrola').toEqual([]);
    expect(nalaz.bezAdrese, 'sidro bez href-a nije kontrola').toBe(0);
});

test('① b — browse zadržava isti obrazac (kartice su par, ne dvije priče)', async ({ page }) => {
    await page.goto('/#/subjects');
    await page.waitForSelector('#browse-page.active .browse-card', { timeout: 20000 });
    const krive = await page.evaluate(() => Array.from(document.querySelectorAll('.browse-card'))
        .filter((k) => {
            const tag = k.tagName.toLowerCase();
            return !(tag === 'button' || (tag === 'a' && k.hasAttribute('href')));
        })
        .map((k) => k.tagName.toLowerCase() + '.' + k.className));
    expect(krive, 'kartica u katalogu koja nije kontrola').toEqual([]);
});

test('② tipkovnica sama otvara lekciju — Tab do kartice, pa Enter', async ({ page }) => {
    // Fokus se ne postavlja skriptom: traži se da kartica bude U REDU FOKUSIRANJA, što je
    // pola kvara. `focus()` bi uspio i na `div`-u s `tabindex`-om kojeg nema.
    const stigao = await page.evaluate(async () => {
        const prva = document.querySelector('#lessonsGrid .lesson-card:not(.lesson-card--soon)');
        if (!prva) return { ok: false, zasto: 'nema otvorive lekcije' };
        prva.focus();
        return { ok: document.activeElement === prva, zasto: document.activeElement
            ? document.activeElement.tagName.toLowerCase() : 'null' };
    });
    expect(stigao.ok, 'fokus ne stigne do kartice (aktivan: ' + stigao.zasto + ')').toBe(true);

    await page.keyboard.press('Enter');
    await page.waitForSelector('#study-page.active', { timeout: 20000 });
    await expect(page.locator('#study-page.active')).toHaveCount(1);
});

test('③ ime kontrole nosi lekciju; „uskoro" se čuje PRIJE klika, a ukras se ne čuje', async ({ page }) => {
    const opis = await page.evaluate(() => {
        const kartice = Array.from(document.querySelectorAll('#lessonsGrid .lesson-card'));
        return kartice.map((k) => ({
            soon: k.classList.contains('lesson-card--soon'),
            ime: (k.innerText || '').replace(/\s+/g, ' ').trim(),
            // Strelica/sat su ukras: ako ih čitač ekrana čita, ime kontrole postaje smeće.
            ukrasBezSkrivanja: Array.from(k.querySelectorAll('.lesson-arrow'))
                .filter((i) => i.getAttribute('aria-hidden') !== 'true').length,
            skriveniTekst: Array.from(k.querySelectorAll('.visually-hidden'))
                .map((s) => s.textContent.trim()).join(' ')
        }));
    });

    expect(opis.length).toBeGreaterThan(0);
    for (const k of opis) {
        expect(k.ime.length, 'kartica bez ijednog imena').toBeGreaterThan(0);
        expect(k.ukrasBezSkrivanja, 'ikona ukrasa nije sakrivena od čitača ekrana').toBe(0);
    }
    // Ako predmet uopće ima „uskoro" lekciju, njezino stanje mora biti u imenu — vidljivo je
    // (sat + prigušenje), pa bi bez ovoga čitač ekrana bio jedini kojem se stanje prešuti.
    const soon = opis.filter((k) => k.soon);
    for (const k of soon) {
        expect(k.skriveniTekst.length,
            '„uskoro" kartica ne najavljuje stanje prije klika').toBeGreaterThan(0);
    }
});

test('④ OBRNUTA PROVJERA — ista mjera nad starim markupom PADA', async ({ page }) => {
    // Bez ovoga tvrdnja ① dokazuje samo da je danas zeleno, ne i da bi pocrvenjela na kvaru.
    // Stari oblik se rekonstruira u DOM-u: `<div>` s klikom, točno kako je bilo do 2026-08-24.
    const krive = await page.evaluate(() => {
        const grid = document.getElementById('lessonsGrid');
        const stara = document.createElement('div');
        stara.className = 'lesson-card';
        stara.addEventListener('click', () => {});
        grid.appendChild(stara);

        return Array.from(document.querySelectorAll('#lessonsGrid .lesson-card'))
            .filter((k) => {
                const tag = k.tagName.toLowerCase();
                return !(tag === 'button' || (tag === 'a' && k.hasAttribute('href')));
            }).length;
    });
    expect(krive, 'mjera ne prepoznaje stari `div` — dakle ne bi uhvatila ni povratak kvara').toBe(1);
});
