/* ===== jank-probe — MJERI TRZANJE PRI SKROLANJU, PO KADRU =====
 *
 * ZAŠTO POSTOJI: Leon (2026-09-04): „kada se scrolla mora biti savršeno smooth kao da si
 * na najnovijem iPhoneu, trenutno prekidaju frejmovi". To je do sada bio DOJAM bez broja.
 * `perf-probe` tu NE pomaže — on mjeri PRVI KADAR (FCP/LCP/TBT), a trzanje je trošak
 * PO KADRU dok se stranica pomiče. Ova sonda daje tu brojku, po ruti, i uz nju
 * PROTUČINJENIČNI pokus: isti skrol bez sumnjivca (zamućenje, sjene, fiksna pozadina…),
 * pa razlika kaže KOLIKO koji sumnjivac košta — umjesto da se pogađa (BACKLOG §LEONOVI
 * NALAZI B: „ne pogađati uzrok"). Hipoteza za F1/7 piše se TEK iz ovih brojki.
 *
 * ŠTO MJERI (po ruti × scenariju, mobilni profil 393×852 @3x, CPU 4× sporiji, dodir):
 *   - kadrovi kroz `requestAnimationFrame` dok ručni niz touch-događaja (CDP, prst)
 *     vuče stranicu dolje pa gore: median · p95 · max · broj kadrova > 25 ms (ispušten
 *     bar jedan) · > 50 ms (dugi) · udio vremena u takvim kadrovima = **trzanje %**
 *   - `long-animation-frame` unosi (LoAF) s krivcem po skripti, kad ih ima
 *   - CDP `Performance.getMetrics` razlika: broj layouta / recalc-stylea i njihovo trajanje,
 *     vrijeme skripte — glavna nit
 *   - trace (`devtools.timeline`): broj `Paint` događaja i **zbroj prebojane površine**
 *     (Mpx u CSS px), `DroppedFrame`, `RunTask` > 50 ms
 *   - koliko je piksela stvarno prešlo (skrol koji se nije dogodio = mjera praznog)
 *
 * SCENARIJI („bez" = protučinjenični): `kontrola` + jedan po pravilu iz `css/bez.css`
 *   (`[data-bez~="ime"]` → `bez-ime`; danas: zamucenja · sjena · prijelaza · pozadine).
 *   F1/7 ②: sonda NE ubrizgava vlastiti CSS nego postavlja ISTI atribut `data-bez` koji
 *   `?bez=…` daje Leonu na previewu (`js/boot.js`) — jedno mjesto za zabrane (ADR-027), pa je
 *   ono što ovdje mjerimo i ono što on gleda na iPhoneu doslovno isti CSS. Scenarij
 *   `bez-fiksne-pozadine` je otpao s F1/7 ① (fiksne pozadine više nema; brana to čuva).
 *
 * ⚠️ Mjera na razvojnom stroju je DONJA GRANICA, ne korisnikova stvarnost (Leonov bljesak
 * je trajao ~1 s dok je moj izmjereni bio 119 ms). Ono što ovdje trza, trza i njemu;
 * ono što ovdje ne trza — ne znamo. Zato je i CPU 4× (Lighthouse „mobile").
 * ⚠️ Mjerač ISPISUJE koliko je toga dotaknuo (ruta × scenarija, gesti, kadrova) — pravilo
 * iz faze redizajna: mjerač koji šuti o dosegu vraća uvjerljiv krivi broj umjesto da padne.
 *
 * NIJE GATE (traži preglednik i poslužitelj) — mjerni instrument, kao fouc-probe.
 * Pokretanje:  npm run serve:test  (drugi terminal)
 *              node scripts/jank-probe.js [izlaz] [--rute=landing,learn] [--scenariji=kontrola,bez-sjena]
 *                                                [--cpu=4] [--gesta=3]
 */
'use strict';
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const gate = require('../tests/helpers/phone-gate');

const arg = (ime, zadano) => { const a = process.argv.find((x) => x.indexOf('--' + ime + '=') === 0); return a ? a.slice(ime.length + 3) : zadano; };
const OUT = process.argv.slice(2).find((x) => x.indexOf('--') !== 0) || path.join(__dirname, '..', '.jank');
const URL_BASE = process.env.JANK_URL || 'http://localhost:5050';
const CPU = Number(arg('cpu', '4'));
const GESTA = Number(arg('gesta', '3'));           // gesti dolje, pa isto toliko gore
const DPR = 3;                                       // iPhone 16

/* Rute: javne stranice + načini učenja iz phone-gatea (isti popis vozi branu telefona, pa
   sonda ne može mjeriti rutu koju brana ne poznaje). `study@…` uvjetni tabovi nisu tu: vježbe
   i slijepa karta imaju vlastite listove, ne dugačku stranicu. */
const RUTE_SVE = gate.EKRANI_JAVNI.concat(gate.NACINI);
const RUTE = arg('rute', RUTE_SVE.join(',')).split(',').map((s) => s.trim()).filter(Boolean);

/* Scenariji dolaze iz `css/bez.css` — JEDNO mjesto (ADR-027): `[data-bez~="ime"]` → `bez-ime`.
   Sonda postavlja atribut, isti koji `?bez=` daje na previewu; zabrane su u tom modulu.
   Prazan popis = pad, ne „nula scenarija": mjerač koji šuti o dosegu vraća krivi broj. */
// bez komentara: zaglavlje modula objašnjava obrazac (`[data-bez~="ime"]`) — nije scenarij
const BEZ_CSS = fs.readFileSync(path.join(__dirname, '..', 'css', 'bez.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const BEZ_IMENA = Array.from(new Set(Array.from(BEZ_CSS.matchAll(/\[data-bez~="([a-z-]+)"\]/g), (m) => m[1])));
if (!BEZ_IMENA.length) { console.error('jank-probe: css/bez.css nema nijedan [data-bez~="…"] selektor — nema scenarija'); process.exit(2); }
const SCENARIJI = ['kontrola'].concat(BEZ_IMENA.map((n) => 'bez-' + n));
const SCEN = arg('scenariji', SCENARIJI.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
for (const s of SCEN) if (SCENARIJI.indexOf(s) < 0) { console.error('nepoznat scenarij: ' + s + ' (imam: ' + SCENARIJI.join(', ') + ')'); process.exit(2); }

const TRACE_KAT = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'];

const kvantil = (arr, q) => { if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
const povrsina = (q) => { // shoelace nad četverokutom [x1,y1,…,x4,y4] (CSS px)
    if (!q || q.length < 8) return 0; let a = 0;
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; a += q[2 * i] * q[2 * j + 1] - q[2 * j] * q[2 * i + 1]; }
    return Math.abs(a) / 2;
};

async function otvori(page, ruta) {
    if (gate.NACINI.indexOf(ruta) >= 0) { await gate.idiNa(page, 'study'); await gate.otvoriNacin(page, ruta); }
    else await gate.idiNa(page, ruta);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    await page.waitForTimeout(300);
}

function skupMetrika(odgovor) { return odgovor.metrics.reduce((o, m) => { o[m.name] = m.value; return o; }, {}); }

/* Jedan potez prsta: touchStart → 20 × touchMove po 35 px svakih ~12 ms (≈ 2 900 px/s,
   brz zamah) → touchEnd, pa Chromium sam doda zalet. ⚠️ `Input.synthesizeScrollGesture`
   s `gestureSourceType: 'touch'` u headless modu NE MIČE stranicu (izmjereno: 0 px, dok
   `mouse` i ručni touch-niz miču) — zato ručni niz, jer je i jedini koji ide istim putem
   kao prst: touch-slušači, pa kompozitorski skrol, pa zalet. `smjer` −1 = prema dolje. */
async function prst(cdp, smjer) {
    const x = 196, y0 = smjer < 0 ? 760 : 120, KORAK = 35, KORAKA = 20;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
    for (let i = 1; i <= KORAKA; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 + smjer * i * KORAK }] });
        await new Promise((r) => setTimeout(r, 12));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise((r) => setTimeout(r, 700)); // zalet + smirivanje
}

async function mjeri(browser, ruta, scen) {
    const ctx = await browser.newContext({ baseURL: URL_BASE, viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    await page.goto('/', { waitUntil: 'load' });
    await page.evaluate(() => { try { localStorage.setItem('sokrat-cookie-consent', 'declined'); } catch (e) { /* */ } });
    await gate.spreman(page);
    await otvori(page, ruta);
    if (scen !== 'kontrola') await page.evaluate((n) => document.documentElement.setAttribute('data-bez', n), scen.slice(4));
    await page.waitForTimeout(400);

    const skrolabilno = await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollHeight - window.innerHeight);

    /* promatrači u stranici: rAF-kadrovi + LoAF */
    await page.evaluate(() => {
        window.__jank = { kadrovi: [], loaf: [], radi: true, zadnji: performance.now() };
        const tik = (t) => { if (!window.__jank.radi) return; window.__jank.kadrovi.push(t - window.__jank.zadnji); window.__jank.zadnji = t; requestAnimationFrame(tik); };
        requestAnimationFrame((t) => { window.__jank.zadnji = t; requestAnimationFrame(tik); });
        try {
            const po = new PerformanceObserver((l) => {
                for (const e of l.getEntries()) {
                    const skripte = (e.scripts || []).slice(0, 3).map((s) => {
                        const src = String(s.sourceURL || '').split('/').pop().split('?')[0];
                        return src + ':' + (s.sourceFunctionName || '?') + '=' + Math.round(s.duration);
                    });
                    window.__jank.loaf.push({ trajanje: Math.round(e.duration), blokira: Math.round(e.blockingDuration || 0), skripte });
                }
            });
            po.observe({ type: 'long-animation-frame', buffered: false });
            window.__jank.po = po;
        } catch (e) { window.__jank.loafNema = true; }
    });
    await cdp.send('Performance.enable');
    const m0 = skupMetrika(await cdp.send('Performance.getMetrics'));
    await browser.startTracing(page, { categories: TRACE_KAT });

    let gesti = 0;
    for (let i = 0; i < GESTA; i++) { await prst(cdp, -1); gesti++; }
    const preslo = await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTop);
    for (let i = 0; i < GESTA; i++) { await prst(cdp, +1); gesti++; }
    await page.waitForTimeout(150);

    const trace = await browser.stopTracing();
    const m1 = skupMetrika(await cdp.send('Performance.getMetrics'));
    const u = await page.evaluate(() => {
        window.__jank.radi = false;
        try { if (window.__jank.po) window.__jank.po.disconnect(); } catch (e) { /* */ }
        return { kadrovi: window.__jank.kadrovi, loaf: window.__jank.loaf, loafNema: !!window.__jank.loafNema };
    });
    await ctx.close();

    /* trace → Paint površina, DroppedFrame, dugi RunTask */
    let ev = [];
    try { const t = JSON.parse(trace.toString()); ev = Array.isArray(t) ? t : (t.traceEvents || []); } catch (e) { /* prazan trace */ }
    let paint = 0, paintPx = 0, dropped = 0, drawn = 0, dugiTask = 0, layout = 0, recalc = 0;
    for (const e of ev) {
        if (e.name === 'Paint') { paint++; paintPx += povrsina(e.args && e.args.data && e.args.data.clip); }
        else if (e.name === 'DroppedFrame') dropped++;
        else if (e.name === 'DrawFrame') drawn++;
        else if (e.name === 'RunTask' && (e.dur || 0) > 50000) dugiTask++;
        else if (e.name === 'Layout') layout++;
        else if (e.name === 'UpdateLayoutTree') recalc++;
    }

    const k = u.kadrovi.slice(1);
    const ukupno = k.reduce((a, b) => a + b, 0) || 1;
    const spori = k.filter((d) => d > 25), dugi = k.filter((d) => d > 50);
    const ms = (a, b) => Math.round(((m1[a] || 0) - (m0[a] || 0)) * 1000);
    const n = (a) => Math.round((m1[a] || 0) - (m0[a] || 0));
    return {
        ruta, scen, skrolabilno: Math.round(skrolabilno), preslo: Math.round(preslo), gesti,
        kadrova: k.length, median: +kvantil(k, 0.5).toFixed(1), p95: +kvantil(k, 0.95).toFixed(1), max: +Math.max(0, ...k).toFixed(1),
        sporih: spori.length, dugih: dugi.length, trzanjePct: +((spori.reduce((a, b) => a + b, 0) / ukupno) * 100).toFixed(1),
        loaf: u.loaf.length, loafNema: u.loafNema, loafTop: u.loaf.sort((a, b) => b.trajanje - a.trajanje).slice(0, 3),
        layoutN: n('LayoutCount'), recalcN: n('RecalcStyleCount'),
        layoutMs: ms('LayoutDuration'), recalcMs: ms('RecalcStyleDuration'), skriptaMs: ms('ScriptDuration'),
        traceEv: ev.length, paint, paintMpx: +(paintPx / 1e6).toFixed(2), dropped, drawn, dugiTask, traceLayout: layout, traceRecalc: recalc,
    };
}

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const rez = [];
    const t0 = Date.now();
    console.log('jank-probe · ' + RUTE.length + ' ruta × ' + SCEN.length + ' scenarija · CPU ' + CPU + '× · ' + GESTA + '+' + GESTA + ' gesti · ' + URL_BASE);
    for (const ruta of RUTE) for (const scen of SCEN) {
        try {
            const r = await mjeri(browser, ruta, scen);
            rez.push(r);
            console.log(
                ruta.padEnd(14) + scen.padEnd(20) +
                ('skrol ' + r.preslo + '/' + r.skrolabilno + 'px').padEnd(20) +
                ('kadrova ' + r.kadrova).padEnd(13) + ('med ' + r.median).padEnd(10) + ('p95 ' + r.p95).padEnd(11) + ('max ' + r.max).padEnd(11) +
                ('>25ms ' + r.sporih).padEnd(10) + ('>50ms ' + r.dugih).padEnd(10) + ('trzanje ' + r.trzanjePct + '%').padEnd(16) +
                ('paint ' + r.paint + '/' + r.paintMpx + 'Mpx').padEnd(22) + ('dropped ' + r.dropped).padEnd(12) + ('layout ' + r.layoutN + '/' + r.layoutMs + 'ms').padEnd(18) +
                ('recalc ' + r.recalcN + '/' + r.recalcMs + 'ms').padEnd(18) + ('skripta ' + r.skriptaMs + 'ms').padEnd(15) + ('loaf ' + (r.loafNema ? 'n/a' : r.loaf))
            );
            if (r.loafTop.length) console.log('    LoAF: ' + r.loafTop.map((l) => l.trajanje + 'ms[' + l.skripte.join(', ') + ']').join(' · '));
        } catch (e) {
            rez.push({ ruta, scen, greska: String(e.message || e).split('\n')[0] });
            console.log(ruta.padEnd(14) + scen.padEnd(20) + '⚠️ ' + String(e.message || e).split('\n')[0]);
        }
    }
    await browser.close();
    const datoteka = path.join(OUT, 'jank-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json');
    fs.writeFileSync(datoteka, JSON.stringify({ kada: new Date().toISOString(), cpu: CPU, dpr: DPR, gesta: GESTA, url: URL_BASE, rez }, null, 2));
    const ok = rez.filter((r) => !r.greska);
    const kadrova = ok.reduce((a, r) => a + r.kadrova, 0), gesti = ok.reduce((a, r) => a + r.gesti, 0);
    console.log('\nDOTAKNUTO: ' + ok.length + '/' + rez.length + ' mjera (' + RUTE.length + ' ruta × ' + SCEN.length + ' scenarija) · ' + gesti + ' gesti · ' + kadrova + ' kadrova · ' + Math.round((Date.now() - t0) / 1000) + ' s → ' + datoteka);
    const nula = ok.filter((r) => r.preslo === 0);
    if (nula.length) console.log('⚠️ bez pomaka (stranica kraća od ekrana ili skrol nije prošao): ' + nula.map((r) => r.ruta + '/' + r.scen).join(', '));
    if (rez.some((r) => r.greska)) process.exitCode = 1;
})().catch((e) => { console.error(e); process.exit(1); });
