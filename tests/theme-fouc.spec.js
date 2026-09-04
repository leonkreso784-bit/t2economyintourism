// ===== BLJESAK KRIVE TEME — TVRDNJA NAD ONIM ŠTO OKO VIDI =====
//
// POVOD (Leon, 2026-09-04): „kada se selecta neki theme on ostane, no kada se opet ulazi
// na stranicu prvo se učita bijela obična stranica pa onda na brzinu theme koji je izabran.
// to je ružno i neprofesionalno."
//
// ZAŠTO OVAJ TEST, A NE DOJAM: bljesak traje 119–232 ms (izmjereno `scripts/fouc-probe.js`
// na produkciji) — dovoljno da se vidi, prekratko da se pouzdano uhvati okom, i nevidljivo
// SVAKOJ postojećoj brani. `<html data-theme="academic">` u markupu je izgledao kao
// rješenje i imao komentar koji to tvrdi; vrijedio je samo za zadanu temu.
//
// MJERA: promatrač na `<html>` postavljen PRIJE ijedne skripte stranice broji promjene
// `data-theme` u kojima se VRIJEDNOST stvarno mijenja. Takva promjena poslije prvog
// crtanja JEST bljesak. Ponovno postavljanje iste vrijednosti se ne broji — to korisnik
// ne vidi. Nula promjena = tema je bila točna već u prvom kadru.
const { test, expect } = require('@playwright/test');

// `chalk` jer je TAMNA: bljesak sa zadane (svijetle) teme je ondje najveći i najvidljiviji.
// `academic` bi prošao i s pokvarenim kodom — zato ne bi bio dokaz.
for (const tema of ['chalk', 'mint']) {
    test('povratak na stranicu: tema „' + tema + '" je na ekranu od prvog kadra', async ({ page }) => {
        // Prvi posjet samo zato da origin postoji i localStorage bude zapisiv.
        await page.goto('/');
        await page.evaluate((t) => localStorage.setItem('sokrat-theme', t), tema);

        await page.addInitScript(() => {
            window.__promjene = [];
            const pocni = () => {
                const html = document.documentElement;
                window.__pocetni = html.getAttribute('data-theme');
                new MutationObserver((zapisi) => {
                    for (const z of zapisi) {
                        const novo = html.getAttribute('data-theme');
                        // Samo STVARNA promjena vrijednosti = ono što se vidi.
                        if (z.oldValue !== novo) window.__promjene.push({ iz: z.oldValue, u: novo, t: performance.now() });
                    }
                }).observe(html, { attributes: true, attributeFilter: ['data-theme'], attributeOldValue: true });
            };
            if (document.documentElement) pocni();
            else document.addEventListener('readystatechange', pocni, { once: true });
        });

        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => typeof window.setTheme === 'function');

        const stanje = await page.evaluate(() => ({
            promjene: window.__promjene,
            pocetni: window.__pocetni,
            konacni: document.documentElement.getAttribute('data-theme'),
            colorScheme: document.documentElement.style.colorScheme,
            pozadina: getComputedStyle(document.body).backgroundColor,
        }));

        // ① Nijedne promjene vrijednosti — dakle nikakvog bljeska.
        expect(stanje.promjene, 'tema se mijenjala PRED korisnikom: ' + JSON.stringify(stanje.promjene)).toEqual([]);
        // ② Tema je bila točna već u trenutku kad je promatrač postavljen (prije skripti stranice).
        expect(stanje.pocetni).toBe(tema);
        expect(stanje.konacni).toBe(tema);
        // ③ `color-scheme` prati temu — bez toga native scrollbarovi i polja ostanu svijetli.
        expect(stanje.colorScheme).toBe('dark');
        // ④ Tvrdnja o BOJI, ne samo o atributu: obje su teme tamne, pa svijetla pozadina
        //    znači da atribut stoji a CSS ga ne sluša (drugi kvar, isti simptom).
        const [r, g, b] = stanje.pozadina.match(/\d+/g).map(Number);
        expect(r + g + b, 'pozadina nije tamna: ' + stanje.pozadina).toBeLessThan(200);
    });
}

// ===== F1/3: BEZ IZBORA TEMA PRATI UREĐAJ — ISTO MJERILO, ISTA GRANICA (prvi kadar) =====
// Leon (2026-09-04): „isto kao i email template" — predlošci maila imaju `prefers-color-scheme`
// blok, pa se na tamnom telefonu otvore crni. Stranica mora isto, i to bez bljeska bijele:
// odluka je u boot.js (sinkrono), a ovdje se to dokazuje kroz emulirani uređaj.
// Četvrti slučaj je MIGRACIJA: produkcija je do F1/3 svakom posjetitelju upisivala `academic`
// bez da je birao — takav zapis se mora čitati kao „ništa", inače crno ne dobiva nitko.
const UREDJAJ = [
    { shema: 'dark',  tema: 'carbon',   tamna: true,  spremljeno: null,       opis: 'ništa spremljeno' },
    { shema: 'light', tema: 'academic', tamna: false, spremljeno: null,       opis: 'ništa spremljeno' },
    { shema: 'dark',  tema: 'carbon',   tamna: true,  spremljeno: 'academic', opis: 'stari automatski `academic` bez biljega → nije izbor' },
    { shema: 'dark',  tema: 'chalk',    tamna: true,  spremljeno: 'chalk',    opis: 'izbor `chalk` pobjeđuje uređaj' },
];
for (const u of UREDJAJ) {
    test('uređaj ' + u.shema + ' · ' + u.opis + ' → „' + u.tema + '" od prvog kadra', async ({ page }) => {
        await page.goto('/');
        await page.evaluate((s) => {
            localStorage.removeItem('sokrat-theme');
            localStorage.removeItem('sokrat-theme-chosen');   // bez biljega = kako je produkcija pisala
            if (s) localStorage.setItem('sokrat-theme', s);
        }, u.spremljeno);
        await page.emulateMedia({ colorScheme: u.shema });

        await page.addInitScript(() => {
            window.__promjene = [];
            const pocni = () => {
                const html = document.documentElement;
                window.__pocetni = html.getAttribute('data-theme');
                new MutationObserver((zapisi) => {
                    for (const z of zapisi) {
                        const novo = html.getAttribute('data-theme');
                        if (z.oldValue !== novo) window.__promjene.push({ iz: z.oldValue, u: novo, t: performance.now() });
                    }
                }).observe(html, { attributes: true, attributeFilter: ['data-theme'], attributeOldValue: true });
            };
            if (document.documentElement) pocni();
            else document.addEventListener('readystatechange', pocni, { once: true });
        });

        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => typeof window.getThemeChoice === 'function');

        const stanje = await page.evaluate(() => ({
            promjene: window.__promjene,
            pocetni: window.__pocetni,
            konacni: document.documentElement.getAttribute('data-theme'),
            colorScheme: document.documentElement.style.colorScheme,
            pozadina: getComputedStyle(document.body).backgroundColor,
            izbor: window.getThemeChoice(),
            zapis: localStorage.getItem('sokrat-theme'),
        }));

        expect(stanje.promjene, 'tema se mijenjala PRED korisnikom: ' + JSON.stringify(stanje.promjene)).toEqual([]);
        expect(stanje.pocetni).toBe(u.tema);
        expect(stanje.konacni).toBe(u.tema);
        expect(stanje.colorScheme).toBe(u.tamna ? 'dark' : 'light');
        const [r, g, b] = stanje.pozadina.match(/\d+/g).map(Number);
        if (u.tamna) expect(r + g + b, 'pozadina nije tamna: ' + stanje.pozadina).toBeLessThan(200);
        else expect(r + g + b, 'pozadina nije svijetla: ' + stanje.pozadina).toBeGreaterThan(600);
        // Birač vidi IZBOR: „auto" kad ga nema — i stari automatski zapis je počišćen, ne
        // pretvoren u izbor (drugi način da „Automatski" traje jedno učitavanje).
        if (u.spremljeno === 'chalk') { expect(stanje.izbor).toBe('chalk'); expect(stanje.zapis).toBe('chalk'); }
        else { expect(stanje.izbor).toBe('auto'); expect(stanje.zapis).toBeNull(); }
    });
}
