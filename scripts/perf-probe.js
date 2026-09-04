/* ===== perf-probe — PONOVLJIVA MJERA BRZINE, BEZ NOVE OVISNOSTI =====
 *
 * ZAŠTO POSTOJI: PageSpeed je rekao 75, ali njegov API bez ključa vraća 429, a rezultat
 * na webu se ne može ni ponoviti ni usporediti s granom. Lighthouse kao ovisnost ne
 * dolazi u obzir bez Leonove odluke (pravilo #9: ovisnosti se pinaju i dodaju namjerno).
 * Chromium koji već imamo kroz Playwright zna sve što treba: CDP daje hladan cache,
 * kočenje CPU-a i mreže, a `PerformanceObserver` daje iste metrike koje Lighthouse
 * i ocjenjuje (FCP · LCP · CLS · duge zadaće ≈ TBT).
 *
 * ⚠️ MJERI HLADAN PRVI POSJET — to je ono što PageSpeed ocjenjuje i ono što vidi
 * posjetitelj koji dolazi prvi put. `fouc-probe.js` namjerno mjeri DRUGI posjet
 * (tema se vidi tek kad postoji spremljena), pa se brojke te dvije sonde NE
 * uspoređuju: ondje je cache topao i `styles.bundle.css` stoji 0 ms.
 *
 * ⚠️ NIJE GATE. Mreža + preglednik. Kao css:diff — instrument, ne brana.
 * Pokretanje:  node scripts/perf-probe.js [url] [--stolno] [--bez=fa,katex,supabase,fonts]
 */
'use strict';
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const URL_META = process.argv.find((a) => /^https?:/.test(a)) || 'https://www.sokratstudy.com/';
const STOLNO = process.argv.includes('--stolno');

/* `--bez=fa,katex,supabase` — PROTUČINJENIČNA MJERA. Umjesto da procjenjujemo koliko
   nešto košta, taj se resurs blokira na ISTOJ produkciji i mjeri razlika. Jedna varijabla
   po pokusu; tako se „mislim da su fontovi krivi" pretvara u broj prije nego se dirne kod. */
const BEZ = (process.argv.find((a) => a.startsWith('--bez=')) || '').replace('--bez=', '').split(',').filter(Boolean);
const UZORCI = {
    fa: /font-awesome/i,
    katex: /katex/i,
    supabase: /supabase-js/i,
    fonts: /\.woff2?(\?|$)/i,
    // `js` NE gasi boot.js — on je jedina skripta koja mora ostati (tema prije crtanja).
    // Služi za mjerenje GORNJE GRANICE: koliko bi prvi kadar bio brz da nijedna skripta
    // ne otima propusnost `styles.bundle.css`-u.
    js: /\/js\/(?!boot\.js)|\/data\/.*\.js(\?|$)/i,
};

/* Lighthouseov mobilni profil: 4× sporiji CPU, Slow-4G (1.6 Mbit/s, 150 ms RTT),
   zaslon srednjeg Androida. Stolni: bez kočenja. */
const PROFIL = STOLNO
    ? { ime: 'stolno', cpu: 1, mreza: null, viewport: { width: 1350, height: 940 }, dpr: 1 }
    : {
        ime: 'mobitel', cpu: 4, viewport: { width: 412, height: 823 }, dpr: 2.625,
        mreza: { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 },
    };

function vrsta(url) {
    if (/\.css(\?|$)/.test(url)) return 'css';
    if (/\.js(\?|$)/.test(url)) return 'js';
    if (/\.(woff2?|ttf|otf|eot)(\?|$)/.test(url)) return 'font';
    if (/\.(png|jpe?g|svg|gif|webp|avif|ico)(\?|$)/.test(url)) return 'slika';
    return 'ostalo';
}
const kb = (b) => Math.round(b / 1024 * 10) / 10;

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: PROFIL.viewport, deviceScaleFactor: PROFIL.dpr,
        isMobile: !STOLNO, hasTouch: !STOLNO,
        userAgent: STOLNO ? undefined : 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });   // HLADAN posjet
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROFIL.cpu });
    if (PROFIL.mreza) await cdp.send('Network.emulateNetworkConditions', PROFIL.mreza);

    /* Bajtove brojimo iz CDP-a, ne iz `transferSize`: za CDN-ove s drugog origina
       `transferSize` je 0 (Timing-Allow-Origin), pa bi Font Awesome i Supabase — dakle
       upravo ono najteže — bili nevidljivi. Ovo je isti razred greške koji je
       `check:budget` već jednom imao (mjerio disk umjesto mreže). */
    const bajti = new Map();
    cdp.on('Network.loadingFinished', (e) => { const r = bajti.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
    cdp.on('Network.requestWillBeSent', (e) => bajti.set(e.requestId, { url: e.request.url, bytes: 0 }));

    /* `--defer` — POKUS NAD ŽIVOM PRODUKCIJOM, BEZ DEPLOYA. Presreće se sam dokument i
       svim se skriptama (osim `boot.js`, koji MORA ostati sinkron zbog teme) doda `defer`.
       Hipoteza koju provjerava: skripte koje blokiraju parser dobivaju VISOK mrežni
       prioritet, pa se `styles.bundle.css` — jedini resurs koji stvarno drži prvi kadar —
       skida usporedo s njima i stiže zadnji. Ako je hipoteza točna, FCP mora pasti bez
       ijednog izbačenog bajta. */
    /* ⚠️ `--kontrola` NIJE višak: presretanje dokumenta samo po sebi košta (dvostruko
       dohvaćanje + prolaz kroz Node), pa se izmjereni `--defer` MORA uspoređivati s njim,
       a ne sa sirovom produkcijom. Bez te kontrole je prvi pokus s deferom izgledao kao
       POGORŠANJE, a mjerio je vlastiti alat. */
    if (process.argv.includes('--defer') || process.argv.includes('--kontrola')) {
        const mijenjaj = process.argv.includes('--defer');
        await page.route(URL_META, async (route) => {
            const odg = await route.fetch();
            let html = await odg.text();
            if (mijenjaj) {
                html = html.replace(/<script\s+src="([^"]+)"(?![^>]*\b(?:defer|async)\b)([^>]*)>/g,
                    (cijeli, src, ostatak) => (/boot\.js/.test(src) ? cijeli : '<script defer src="' + src + '"' + ostatak + '>'));
            }
            await route.fulfill({ response: odg, body: html });
        });
    }

    if (BEZ.length) {
        await page.route('**/*', (route) => {
            const u = route.request().url();
            if (BEZ.some((k) => UZORCI[k] && UZORCI[k].test(u))) return route.abort();
            return route.continue();
        });
    }

    await page.addInitScript(() => {
        window.__m = { lcp: 0, cls: 0, duge: [], fcp: 0 };
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; })
            .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; })
            .observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.duge.push({ t: e.startTime, ms: e.duration }); })
            .observe({ type: 'longtask', buffered: true });
    });

    const t0 = Date.now();
    await page.goto(URL_META, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(2500);              // pusti da LCP i duge zadaće dođu do kraja
    const zid = Date.now() - t0;

    const m = await page.evaluate(() => {
        const p = performance.getEntriesByType('paint').find((x) => x.name === 'first-contentful-paint');
        window.__m.fcp = p ? p.startTime : 0;
        const n = performance.getEntriesByType('navigation')[0] || {};
        /* Vodopad: što je stiglo PRIJE prvog kadra. Bez ovoga se o uzroku nagađa — a
           pokus s blokiranjem već je jednom pokazao da 272 KB Font Awesomea nosi 100 ms,
           dakle da bajtovi NISU glavni krivac. Kriv je onaj tko je zadnji stigao. */
        const res = performance.getEntriesByType('resource')
            .map((r) => ({ url: r.name, kraj: r.responseEnd, poc: r.startTime, tip: r.initiatorType }))
            .sort((a, b) => a.kraj - b.kraj);
        return { ...window.__m, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, ttfb: n.responseStart, res };
    });

    /* TBT: zbroj onoga preko 50 ms u svakoj dugoj zadaći — Lighthouseova definicija,
       samo bez njegovog simuliranog kočenja. Broj nije usporediv s PSI-jem u apsolutnom
       iznosu; usporediv je SAM SA SOBOM prije i poslije zahvata, a to je ono što treba. */
    const tbt = m.duge.reduce((s, d) => s + Math.max(0, d.ms - 50), 0);

    const svi = [...bajti.values()].filter((r) => r.bytes > 0);
    const po = {}; let ukupno = 0;
    for (const r of svi) { const v = vrsta(r.url); po[v] = (po[v] || 0) + r.bytes; ukupno += r.bytes; }

    console.log('\n═══ ' + URL_META + '  ·  profil: ' + PROFIL.ime + '  ·  HLADAN cache'
        + (BEZ.length ? '  ·  BLOKIRANO: ' + BEZ.join(',') : '') + ' ═══');
    console.log('  TTFB              : ' + Math.round(m.ttfb) + ' ms');
    console.log('  FCP               : ' + Math.round(m.fcp) + ' ms');
    console.log('  LCP               : ' + Math.round(m.lcp) + ' ms');
    console.log('  CLS               : ' + (Math.round(m.cls * 1000) / 1000));
    console.log('  TBT (duge zadaće) : ' + Math.round(tbt) + ' ms  (' + m.duge.length + ' zadaća)');
    console.log('  DCL / load        : ' + Math.round(m.dcl) + ' / ' + Math.round(m.load) + ' ms   [zid: ' + zid + ' ms]');
    console.log('\n  BAJTOVI (mrežom, stisnuto): ukupno ' + kb(ukupno) + ' KB / ' + svi.length + ' zahtjeva');
    Object.entries(po).sort((a, b) => b[1] - a[1])
        .forEach(([v, b]) => console.log('    ' + v.padEnd(7) + String(kb(b)).padStart(8) + ' KB'));
    console.log('\n  NAJTEŽIH 12:');
    svi.sort((a, b) => b.bytes - a.bytes).slice(0, 12)
        .forEach((r) => console.log('    ' + String(kb(r.bytes)).padStart(7) + ' KB  ' + r.url.replace(/^https?:\/\//, '').replace(/\?v=\d+/, '').slice(0, 78)));

    if (process.argv.includes('--vodopad')) {
        console.log('\n  VODOPAD do prvog kadra (FCP = ' + Math.round(m.fcp) + ' ms):');
        const prije = m.res.filter((r) => r.kraj <= m.fcp + 50);
        prije.slice(-24).forEach((r) => console.log('    ' + String(Math.round(r.poc)).padStart(6) + ' → '
            + String(Math.round(r.kraj)).padStart(6) + ' ms  ' + r.tip.padEnd(6) + ' '
            + r.url.replace(/^https?:\/\/[^/]+\//, '').replace(/\?v=\d+/, '').slice(0, 56)));
        console.log('    ── ' + prije.length + ' resursa zavrsilo prije prvog kadra, '
            + (m.res.length - prije.length) + ' poslije');
    }

    const izlaz = path.join(__dirname, '..', '.perf-' + PROFIL.ime + (BEZ.length ? '-bez-' + BEZ.join('_') : '') + '.json');
    fs.writeFileSync(izlaz, JSON.stringify({ url: URL_META, profil: PROFIL.ime, m, tbt, ukupno, po, top: svi.slice(0, 25) }, null, 1));
    console.log('\n  → ' + izlaz);
    await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
