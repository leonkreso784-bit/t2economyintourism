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
 * Pokretanje:  node scripts/perf-probe.js [url] [--stolno]
 */
'use strict';
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const URL_META = process.argv.find((a) => /^https?:/.test(a)) || 'https://www.sokratstudy.com/';
const STOLNO = process.argv.includes('--stolno');

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
        return { ...window.__m, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, ttfb: n.responseStart };
    });

    /* TBT: zbroj onoga preko 50 ms u svakoj dugoj zadaći — Lighthouseova definicija,
       samo bez njegovog simuliranog kočenja. Broj nije usporediv s PSI-jem u apsolutnom
       iznosu; usporediv je SAM SA SOBOM prije i poslije zahvata, a to je ono što treba. */
    const tbt = m.duge.reduce((s, d) => s + Math.max(0, d.ms - 50), 0);

    const svi = [...bajti.values()].filter((r) => r.bytes > 0);
    const po = {}; let ukupno = 0;
    for (const r of svi) { const v = vrsta(r.url); po[v] = (po[v] || 0) + r.bytes; ukupno += r.bytes; }

    console.log('\n═══ ' + URL_META + '  ·  profil: ' + PROFIL.ime + '  ·  HLADAN cache ═══');
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

    const izlaz = path.join(__dirname, '..', '.perf-' + PROFIL.ime + '.json');
    fs.writeFileSync(izlaz, JSON.stringify({ url: URL_META, profil: PROFIL.ime, m, tbt, ukupno, po, top: svi.slice(0, 25) }, null, 1));
    console.log('\n  → ' + izlaz);
    await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
