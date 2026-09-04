/* eslint-disable no-console */
// ===== NIJEDNA IKONA NE SMIJE POVUĆI FONT-AWESOME BRANDS =====
// Pokreni: node tests/unit/no-brand-font.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: `fa-brands-400.woff2` je **106 KB** i skidao se na svakom učitavanju
// landinga — zbog dvije ikone (`fab fa-google`, `fab fa-facebook-f`) u dijalogu prijave,
// od kojih se druga uz `FB_LOGIN=false` nije ni crtala. Izmjereno 2026-09-04
// (`scripts/perf-probe.js`): brands je bio drugi najteži resurs cijele stranice.
//
// Zamjena su ugrađeni SVG-ovi (~0.6 KB, nula zahtjeva). Regresija je jedan `class="fab …"`
// daleko i NE BI oborila nijednu drugu branu — `check:budget` broji samo skripte, a font
// se skida tek kad ga netko upotrijebi. Zato ova provjera.
//
// ⚠️ NE zabranjuje Font Awesome općenito: `fas`/`far` (solid/regular) su i dalje u
// upotrebi na cijeloj platformi. Zabranjena je SAMO obitelj `brands`, jer je jedina
// koja se plaća cijelim fontom za nekoliko znakova.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const PRESKOCI = new Set(['node_modules', '.git', 'backups', 'test-results', 'playwright-report', '_materials', '.fouc']);
const NASTAVCI = ['.html', '.js', '.css'];

let pao = 0;
const tvrdi = (uvjet, ime) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime); }
};

function* datoteke(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (PRESKOCI.has(e.name) || e.name.startsWith('.perf-')) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) yield* datoteke(p);
        else if (NASTAVCI.includes(path.extname(e.name))) yield p;
    }
}

console.log('\n=== brands-font se ne smije povlaciti (106 KB) ===\n');

const nalazi = [];
for (const p of datoteke(KORIJEN)) {
    // Ova datoteka OPISUJE zabranu, pa mora smjeti spomenuti uzorak.
    if (p === __filename) continue;
    const s = fs.readFileSync(p, 'utf8');
    const rel = path.relative(KORIJEN, p).replace(/\\/g, '/');
    /* `fab` kao CSS-klasa (u navodnicima ili u razmacima) i klasa `fa-brands`.
       `(?!-)` isključuje IME DATOTEKE `fa-brands-400.woff2`: ono se pojavljuje u
       obrazloženjima („zašto ovo pravilo postoji"), a zabrana se odnosi na UPOTREBU,
       ne na spominjanje. Bez toga brana pada na vlastitom komentaru — što je i pala. */
    const re = /(class\s*=\s*["'][^"']*\bfab\b|["'\s]fab\s+fa-|\bfa-brands\b(?!-)|Font Awesome 6 Brands)/g;
    const m = s.match(re);
    if (m) nalazi.push(rel + ' → ' + [...new Set(m)].join(' · '));
}

tvrdi(nalazi.length === 0, 'nigdje `fab` / `fa-brands`' + (nalazi.length ? ':\n       ' + nalazi.join('\n       ') : ''));

// Pozitivna strana: znakovi providera POSTOJE kao ugrađeni SVG — inače bi „nema fab"
// bilo zeleno i kad gumbi ostanu bez ikona.
const auth = fs.readFileSync(path.join(KORIJEN, 'js', 'auth.js'), 'utf8');
tvrdi(/IKONA_GOOGLE\s*=\s*\n?\s*'<svg/.test(auth), 'auth.js ima ugradjeni SVG za Google');
tvrdi(/IKONA_FACEBOOK\s*=\s*\n?\s*'<svg/.test(auth), 'auth.js ima ugradjeni SVG za Facebook (ceka FB_LOGIN)');
tvrdi(auth.includes('IKONA_GOOGLE +'), 'Google gumb koristi taj SVG');

console.log('\n' + (pao ? '❌ palo: ' + pao : '✅ sve prošlo') + '\n');
process.exit(pao ? 1 : 0);
