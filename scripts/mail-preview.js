#!/usr/bin/env node
/**
 * mail-preview.js — renderira Supabase mail-predloške u PNG (svijetlo + tamno).
 *
 * ZAŠTO POSTOJI: predlošci iz `supabase/email-templates/` završe u tuđem sustavu
 * (Supabase dashboard → mail-klijent), gdje ih nijedan naš gate ne vidi. Bez ovoga se
 * izgled maila „provjerava" tako da se pošalje sebi i gleda na mobitelu — što znači da
 * svaka izmjena traži živi mail. Ovime se vidi ODMAH, i to s popunjenim varijablama
 * (prava duljina URL-a s tokenom je najčešći razlog raspadnutog rasporeda).
 *
 * NIJE GATE — mail-klijenti se ionako ponašaju svaki po svom (Outlook renderira Wordom);
 * ovo je pregled prije slanja, ne dokaz ispravnosti u svakom klijentu.
 *
 * Korištenje: node scripts/mail-preview.js [izlazna-mapa]
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'supabase', 'email-templates');
const OUT = process.argv[2] || path.join(__dirname, '..', '_screenshots', 'mail');

// Primjeri stvarnih vrijednosti — token-URL je namjerno DUG (to je stvarni oblik).
const VARS = {
    '{{ .ConfirmationURL }}': 'https://naxjubnedhrbhsuasayu.supabase.co/auth/v1/verify?token=pkce_a1b2c3d4e5f6a1b2c3d4e5f6&type=signup&redirect_to=https://www.sokratstudy.com/',
    '{{ .Email }}': 'leonkreso784@gmail.com',
    '{{ .NewEmail }}': 'leon@sokratstudy.com',
};

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.html'));
    if (!files.length) { console.error('Nema predložaka u ' + SRC); process.exit(1); }

    const browser = await chromium.launch();
    let n = 0;
    for (const file of files) {
        let html = fs.readFileSync(path.join(SRC, file), 'utf8');
        for (const [k, v] of Object.entries(VARS)) html = html.split(k).join(v);
        // Nezamijenjena varijabla = predložak koristi nešto što ovdje ne poznajemo →
        // radije glasno nego tiho snimiti sliku s `{{ … }}` u tekstu.
        const ostalo = html.match(/\{\{\s*\.\w+/g);
        if (ostalo) console.warn('⚠️  ' + file + ': nezamijenjeno ' + [...new Set(ostalo)].join(', '));

        for (const scheme of ['light', 'dark']) {
            const page = await browser.newPage({ colorScheme: scheme, viewport: { width: 800, height: 1200 } });
            await page.setContent(html, { waitUntil: 'networkidle' });
            const out = path.join(OUT, file.replace('.html', '') + '-' + scheme + '.png');
            await page.screenshot({ path: out, fullPage: true });
            await page.close();
            n++;
        }
        console.log('✔ ' + file);
    }
    await browser.close();
    console.log('\nSnimljeno ' + n + ' slika (' + files.length + ' predložaka × 2 teme) → ' + OUT);
})();
