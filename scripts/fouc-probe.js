/* ===== fouc-probe — MJERI ŠTO OKO VIDI PRIJE NEGO TEMA SJEDNE =====
 *
 * ZAŠTO POSTOJI: „bljesak krive teme" je do sada bio DOJAM, a dojam se ne može
 * ni potvrditi ni oboriti. `index.html` u komentaru tvrdi da je problem riješen
 * time što `data-theme` stoji u markupu — a u markupu stoji ZAKUCANO `academic`.
 * Za posjetitelja koji je izabrao `chalk` ili `mint` (obje TAMNE) to znači da je
 * prvi kadar zajamčeno SVIJETAO, pa se tema mijenja tek kad se probudi JS.
 * Ova skripta to pretvara u brojku i u niz sličica.
 *
 * ŠTO MJERI (po temi i po profilu uređaja):
 *   - FCP (prvi nacrtani sadržaj)  — `PerformanceObserver('paint')`
 *   - trenutak kad `data-theme` DOBIJE spremljenu vrijednost — MutationObserver
 *     na `<html>`, postavljen PRIJE ijedne skripte stranice (addInitScript)
 *   - DOMContentLoaded i load
 *   - razliku FCP → tema = **trajanje bljeska**
 * Uz to snima CDP-screencast, pa bljesak postoji i kao slika, ne samo kao broj.
 *
 * NIJE GATE (traži preglednik i poslužitelj) — mjerni instrument, kao css:diff.
 * Pokretanje:  npm run serve:test  (drugi terminal)  →  node scripts/fouc-probe.js [izlaz]
 */
'use strict';
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || path.join(__dirname, '..', '.fouc');
const URL_BASE = process.env.FOUC_URL || 'http://localhost:5050/';

/* Profili: „stolno" bez kočenja i „mobitel" s 4× sporijim CPU-om i Slow-4G mrežom —
   isti par koji Lighthouse zove desktop/mobile. Bljesak raste s oba, pa jedan profil
   ne bi rekao ništa o drugome. */
const PROFILI = [
    { ime: 'stolno', cpu: 1, mreza: null },
    {
        ime: 'mobitel', cpu: 4,
        mreza: { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 },
    },
];

/* Scenariji: spremljena tema (kako je bilo do F1/3) ili NIŠTA spremljeno uz emulirani
   uređaj (F1/3: bez izbora stranica prati `prefers-color-scheme`, kao mail). Treći je
   Leonov slučaj doslovno — tamni telefon, prvi ulazak bez ikakvog izbora — i mora dati
   „NIJE MIJENJANA" uz `carbon` na startu; bljesak bijele bi se ovdje vidio kao broj. */
const SCENARIJI = [
    { ime: 'chalk',         spremljena: 'chalk',    uredjaj: null,   snimaj: true },  // tamna (kritična)
    { ime: 'academic',      spremljena: 'academic', uredjaj: null },                  // zadana (kontrola)
    { ime: 'uredjaj-tamni', spremljena: null,       uredjaj: 'dark', snimaj: true },  // F1/3
];

async function mjeri(browser, sc, profil) {
    const tema = sc.ime, snimaj = !!sc.snimaj;
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profil.cpu });
    if (profil.mreza) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', profil.mreza); }

    /* ⚠️ Prvi posjet NIJE mjera koju tražimo — Leonov opis je „kada se OPET ulazi na
       stranicu". Zato: prvo obična posjeta (da origin postoji i localStorage bude
       zapisiv — na praznom dokumentu je origin neprozirni i `setItem` baci), pa tek
       onda mjereni RELOAD s promatračem. Prva verzija ove sonde mjerila je prvi posjet
       i vratila „tema NIJE MIJENJANA" — lažno zeleno, jer spremljena tema nije ni
       postojala u trenutku učitavanja. */
    await page.goto(URL_BASE, { waitUntil: 'domcontentloaded' });
    await page.evaluate((t) => {
        try {
            localStorage.removeItem('sokrat-theme'); localStorage.removeItem('sokrat-theme-chosen');
            if (t) { localStorage.setItem('sokrat-theme', t); localStorage.setItem('sokrat-theme-chosen', '1'); }
        } catch (e) { /* */ }
    }, sc.spremljena);
    if (sc.uredjaj) await page.emulateMedia({ colorScheme: sc.uredjaj });

    /* Promatrač mora biti postavljen PRIJE skripti stranice — mjerimo trenutak TUĐE izmjene. */
    await page.addInitScript(() => {
        window.__fouc = { pocetni: document.documentElement && document.documentElement.getAttribute('data-theme'), promjene: [] };
        const pocni = () => {
            const html = document.documentElement;
            window.__fouc.pocetni = html.getAttribute('data-theme');
            new MutationObserver((zapisi) => {
                for (const z of zapisi) {
                    if (z.attributeName === 'data-theme') window.__fouc.promjene.push({ t: performance.now(), v: html.getAttribute('data-theme') });
                }
            }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
        };
        if (document.documentElement) pocni(); else document.addEventListener('readystatechange', pocni, { once: true });
    });

    const kadrovi = [];
    if (snimaj) {
        cdp.on('Page.screencastFrame', async (f) => {
            kadrovi.push({ t: f.metadata.timestamp, data: f.data });
            try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) { /* zatvoreno */ }
        });
        await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 });
    }

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1200);            // pusti da i zakašnjeli JS odradi svoje
    if (snimaj) { try { await cdp.send('Page.stopScreencast'); } catch (e) { /* */ } }

    const r = await page.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0] || {};
        const res = performance.getEntriesByType('resource');
        const fcpE = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint');
        window.__fouc.fcp = fcpE ? fcpE.startTime : null;   // čitamo iz buffera, ne iz promatrača
        const skripte = res.filter((x) => x.initiatorType === 'script' || /\.js(\?|$)/.test(x.name));
        return {
            fouc: window.__fouc,
            dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd,
            tema: document.documentElement.getAttribute('data-theme'),
            pozadina: getComputedStyle(document.body).backgroundColor,
            brojResursa: res.length,
            brojSkripti: skripte.length,
            zadnjaSkripta: skripte.length ? Math.max.apply(null, skripte.map((x) => x.responseEnd)) : 0,
            najsporije: res.slice().sort((a, b) => b.duration - a.duration).slice(0, 8)
                .map((x) => ({ url: x.name.replace(/^https?:\/\/[^/]+\//, '').replace(/\?v=\d+/, ''), ms: Math.round(x.duration), kb: Math.round((x.transferSize || 0) / 1024) })),
        };
    });

    if (snimaj && kadrovi.length) {
        const dir = path.join(OUT, tema + '-' + profil.ime);
        fs.mkdirSync(dir, { recursive: true });
        const t0 = kadrovi[0].t;
        kadrovi.forEach((k, i) => {
            const ms = Math.round((k.t - t0) * 1000);
            fs.writeFileSync(path.join(dir, String(i).padStart(3, '0') + '_' + ms + 'ms.jpg'), Buffer.from(k.data, 'base64'));
        });
        r.kadrova = kadrovi.length;
        r.mapa = dir;
    }
    await page.close();
    return r;
}

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const sve = [];
    for (const profil of PROFILI) {
        for (const sc of SCENARIJI) {
            const tema = sc.ime;
            const r = await mjeri(browser, sc, profil);
            const prva = (r.fouc.promjene[0] || {}).t;
            const bljesak = (prva != null && r.fouc.fcp != null) ? prva - r.fouc.fcp : null;
            sve.push({ tema, profil: profil.ime, ...r, bljesak });
            console.log('\n── ' + tema + ' / ' + profil.ime + ' ' + '─'.repeat(30));
            console.log('  markup na startu : data-theme="' + r.fouc.pocetni + '"' + (sc.uredjaj ? '  (uređaj: ' + sc.uredjaj + ', ništa spremljeno)' : ''));
            console.log('  tema na kraju    : ' + r.tema + ' · pozadina ' + r.pozadina);
            console.log('  FCP              : ' + Math.round(r.fouc.fcp) + ' ms');
            console.log('  tema primijenjena: ' + (prva != null ? Math.round(prva) + ' ms (' + r.fouc.promjene[0].v + ')' : 'NIJE MIJENJANA'));
            console.log('  ⇒ BLJESAK        : ' + (bljesak != null ? Math.round(bljesak) + ' ms krive teme' : '0 (nema promjene)'));
            console.log('  DCL / load       : ' + Math.round(r.dcl) + ' / ' + Math.round(r.load) + ' ms');
            console.log('  zadnja skripta   : ' + Math.round(r.zadnjaSkripta) + ' ms · skripti: ' + r.brojSkripti + ' · resursa: ' + r.brojResursa);
            if (r.mapa) console.log('  kadrova          : ' + r.kadrova + ' → ' + r.mapa);
        }
    }
    console.log('\nNajsporiji resursi (mobitel/chalk):');
    (sve.find((x) => x.profil === 'mobitel' && x.tema === 'chalk') || { najsporije: [] }).najsporije
        .forEach((x) => console.log('   ' + String(x.ms).padStart(5) + ' ms  ' + String(x.kb).padStart(4) + ' KB  ' + x.url));
    fs.writeFileSync(path.join(OUT, 'mjere.json'), JSON.stringify(sve, null, 1));
    await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
