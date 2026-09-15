/* eslint-disable no-console */
// ===== ODJAVA (F2/4) — `js/odjava.js` gađa ISTI projekt kao `js/auth.js` =====
// Pokreni: node tests/unit/odjava.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: `odjava.html` namjerno ne učitava `auth.js` (supabase-js je ~200 KB s CDN-a za
// jedan POST), pa adresa projekta u `odjava.js` je DRUGA KOPIJA. Da se ikad razide od `auth.js`,
// poveznica „Odjavi se" iz maila tiho bi gađala krivi projekt — korisnik bi kliknuo, dobio grešku,
// i ostao prijavljen na obavijesti koje ne želi. Ovaj test je veza između dviju kopija.
// Uz to: otvaranje stranice NE smije samo po sebi zvati funkciju (skeneri pošte otvaraju poveznice).

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const ODJAVA = fs.readFileSync(path.join(KORIJEN, 'js', 'odjava.js'), 'utf8');
const AUTH = fs.readFileSync(path.join(KORIJEN, 'js', 'auth.js'), 'utf8');
const HTML = fs.readFileSync(path.join(KORIJEN, 'odjava.html'), 'utf8');

let pao = 0;
const tvrdi = (uvjet, ime, detalj) => {
  if (uvjet) console.log('  ✓ ' + ime);
  else { pao++; console.log('  ✗ ' + ime + (detalj !== undefined ? '  → ' + JSON.stringify(detalj) : '')); }
};

console.log('\n=== odjava (F2/4) ===\n');

const authUrl = (AUTH.match(/url:\s*'(https:\/\/[a-z0-9]+\.supabase\.co)'/) || [])[1];
const odjavaUrl = (ODJAVA.match(/PROD_URL\s*=\s*'(https:\/\/[a-z0-9]+\.supabase\.co)'/) || [])[1];
tvrdi(!!authUrl && !!odjavaUrl, 'obje adrese pročitane (inače regex promašuje, a ne kopije)', { authUrl, odjavaUrl });
tvrdi(authUrl === odjavaUrl, 'odjava.js gađa ISTI projekt kao auth.js', { authUrl, odjavaUrl });
tvrdi(ODJAVA.includes("'sokrat-supabase-override'") && AUTH.includes("'sokrat-supabase-override'"),
  'isti test-šav (sokrat-supabase-override) kao auth.js — testovi na stagingu gađaju staging');

// `fetch` smije stajati SAMO unutar rukovatelja klika na gumb.
const prijeKlika = ODJAVA.slice(0, ODJAVA.indexOf("addEventListener('click'"));
tvrdi(ODJAVA.includes("addEventListener('click'"), 'odjava ide kroz klik na gumb');
tvrdi(!/fetch\(/.test(prijeKlika), 'otvaranje stranice NE zove funkciju (fetch tek na klik)');

tvrdi(/<meta name="robots" content="noindex">/.test(HTML), 'odjava.html se ne indeksira');
tvrdi(!/<script>(?!\s*<\/script>)/.test(HTML) && !/\son[a-z]+=/.test(HTML), 'bez inline skripti i on*-atributa (CSP)');

console.log('\n' + (pao ? '✗ ' + pao + ' pad(ova)' : '✓ sve prolazi') + '\n');
process.exit(pao ? 1 : 0);
