#!/usr/bin/env node
/**
 * check:csp — CSP enforce smije živjeti samo dok je stranica čista (cigla MREŽA-D3, spec §6).
 *
 * ── POVOD ──────────────────────────────────────────────────────────────────────
 * D1 je izvadio SVE inline izvršne komade iz `*.html` (inline `<script>` blokove i
 * `on*` atribute), a D3 pali `Content-Security-Policy` bez `'unsafe-inline'` za
 * skripte. Od tog trenutka **prva iduća inline skripta ne pada kod nas nego kod
 * KORISNIKA**: lokalno i u testovima radi (poslužitelji bez headera je ne blokiraju),
 * a na produkciji ju CSP tiho odbije. To je najgora vrsta regresije — nevidljiva
 * svim postojećim branama, vidljiva svakom posjetitelju. Zato brana stoji NA VRATIMA
 * (preflight), ne u dokumentaciji.
 *
 * ── ŠTO TVRDI (tri tvrdnje, sve tri padaju zatvoreno) ──────────────────────────
 *   1. nijedan `<script>` bez `src` u ijednom `*.html` (root)
 *   2. nijedan `on*=` atribut unutar taga u ijednom `*.html`
 *   3. `vercel.json` šalje ENFORCE `Content-Security-Policy` čiji `script-src`
 *      NEMA `'unsafe-inline'` — bez ove tvrdnje bi prve dvije čuvale header koji
 *      je netko u međuvremenu ugasio ili razvodnio, tj. mjerile bi krivu stvar.
 *
 * ── ZAMKE KOJE SU VEĆ NAPLAĆENE DRUGDJE ────────────────────────────────────────
 * · Komentari se skidaju PRIJE mjerenja: naš vlastiti komentar koji spominje
 *   `<script src>` jednom je već ušao u tuđe brojanje kao 37. skripta (CHANGELOG,
 *   deploy 2026-08-24). Komentar nije pravilo — ista pouka kao u `check:tailwind`.
 * · `on*` se traži SAMO unutar tagova (`<...>`), inače bi tekst sadržaja poput
 *   "click on export" postajao nalaz.
 * · Brana ispisuje koliko je datoteka i tagova DOTAKNULA — mjerač koji ne kaže
 *   opseg zna vratiti uvjerljivu nulu nad praznim skupom (prvi kvar 12× u fazi
 *   TELEFON; dvaput „uvjerljiv krivi broj umjesto pada").
 *
 * Read-only, bez mreže → ide u `npm run preflight`.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..');

function makniKomentare(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
}

let padova = 0;
const nalazi = [];

// ── 1 + 2: *.html u korijenu ───────────────────────────────────────────────────
const htmlDatoteke = fs.readdirSync(KORIJEN).filter((f) => f.endsWith('.html'));
if (htmlDatoteke.length === 0) {
    console.error('check:csp — 0 html datoteka u korijenu; brana bi mjerila prazan skup.');
    process.exit(2);
}

let ukupnoTagova = 0;
for (const ime of htmlDatoteke) {
    const html = makniKomentare(fs.readFileSync(path.join(KORIJEN, ime), 'utf8'));

    // inline <script>: otvarajući tag bez src atributa.
    // JEDINA iznimka: type="application/ld+json" (JSON-LD za tražilice, čuva ga
    // check:seo) — to je inertan PODATKOVNI blok koji preglednik ne izvršava pa ga
    // ni script-src ne blokira; empirijski dokazano u D2 (landing ga nosi, report čist).
    const skripte = html.match(/<script\b[^>]*>/gi) || [];
    for (const tag of skripte) {
        if (/\btype\s*=\s*"application\/ld\+json"/i.test(tag)) continue;
        if (!/\bsrc\s*=/i.test(tag)) {
            padova++;
            nalazi.push(`${ime}: inline <script> — ${tag.slice(0, 60)}`);
        }
    }

    // on* atribut unutar bilo kojeg taga
    const tagovi = html.match(/<[a-z][^>]*>/gi) || [];
    ukupnoTagova += tagovi.length;
    for (const tag of tagovi) {
        const m = tag.match(/\son([a-z]+)\s*=/i);
        if (m) {
            padova++;
            nalazi.push(`${ime}: on${m[1]}= atribut — ${tag.slice(0, 60)}`);
        }
    }
}

// ── 3: vercel.json šalje enforce CSP bez 'unsafe-inline' u script-src ──────────
const vercel = JSON.parse(fs.readFileSync(path.join(KORIJEN, 'vercel.json'), 'utf8'));
const sviHeaderi = (vercel.headers || []).flatMap((h) => h.headers || []);
const csp = sviHeaderi.find((h) => h.key === 'Content-Security-Policy');
if (!csp) {
    padova++;
    nalazi.push("vercel.json: nema ENFORCE 'Content-Security-Policy' headera (Report-Only nije enforce)");
} else {
    const scriptSrc = (csp.value.match(/script-src[^;]*/) || [''])[0];
    if (!scriptSrc) {
        padova++;
        nalazi.push('vercel.json: CSP bez script-src direktive');
    } else if (scriptSrc.includes("'unsafe-inline'")) {
        padova++;
        nalazi.push("vercel.json: script-src sadrži 'unsafe-inline' — točno ono što D1 gasi");
    }
}

// ── 4: script-src dopušta TOČNE datoteke s CDN-a, ne cijele hostove (F6 ②/0e, MCP_SECURITY N2) ──
// jsdelivr poslužuje BILO KOJU javnu datoteku s GitHuba i npm-a, a cdnjs tisuće biblioteka. Dok je
// u `script-src` goli host, `iframe srcdoc` iz ubačenog HTML-a smije učitati napadačevu skriptu i
// CSP ne pomaže (dionica A: pročitana sesija uz produkcijski CSP). Popis dopuštenog se IZVODI iz
// koda (tagovi u *.html + adrese u js/**), pa ne može tiho zastarjeti ni u jednom smjeru:
// skripta koju kod učitava a CSP ne dopušta = pokvarena stranica; dopuštena a neučitana = rupa.
const CDN = /^https:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)(?:\/|$)/;
const koristeno = new Set();
for (const f of htmlDatoteke) {
    const html = makniKomentare(fs.readFileSync(path.join(KORIJEN, f), 'utf8'));
    for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*"(https:\/\/[^"]+)"/gi)) if (CDN.test(m[1])) koristeno.add(m[1]);
}
const jsDatoteke = fs.readdirSync(path.join(KORIJEN, 'js')).filter((f) => f.endsWith('.js'));
for (const f of jsDatoteke) {
    const src = fs.readFileSync(path.join(KORIJEN, 'js', f), 'utf8');
    for (const m of src.matchAll(/['"](https:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\/[^'"\s]+\.js)['"]/g)) koristeno.add(m[1]);
}
if (csp) {
    const izvori = ((csp.value.match(/script-src([^;]*)/) || ['', ''])[1]).trim().split(/\s+/);
    const cdnIzvori = izvori.filter((x) => CDN.test(x));
    const goli = cdnIzvori.filter((x) => !/\.js$/.test(x));
    const nedopusteno = [...koristeno].filter((u) => !cdnIzvori.includes(u));
    const mrtvo = cdnIzvori.filter((x) => /\.js$/.test(x) && !koristeno.has(x));
    if (koristeno.size === 0) { padova++; nalazi.push('script-src: iz koda nije izvučena NIJEDNA CDN skripta — izvlačenje je pokvareno'); }
    for (const x of goli) { padova++; nalazi.push('script-src: cijeli CDN host/mapa umjesto točne datoteke — ' + x); }
    for (const x of nedopusteno) { padova++; nalazi.push('script-src: kod učitava, CSP ne dopušta (stranica bi pukla) — ' + x); }
    for (const x of mrtvo) { padova++; nalazi.push('script-src: dopušteno, a kod ne učitava (mrtva rupa) — ' + x); }
}

console.log(`check:csp — dotaknuto: ${htmlDatoteke.length} html datoteka, ${ukupnoTagova} tagova, ${jsDatoteke.length} js datoteka, `
    + `${koristeno.size} CDN skripti iz koda, vercel.json`);
if (padova > 0) {
    console.error(`❌ check:csp — ${padova} nalaz(a):`);
    for (const n of nalazi) console.error('   ' + n);
    process.exit(1);
}
console.log('✅ nula inline skripti, nula on* atributa, enforce CSP bez unsafe-inline za skripte.');
