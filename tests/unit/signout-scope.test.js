/* eslint-disable no-console */
// ===== ODJAVA JE SAMO OVAJ UREĐAJ — svaki `auth.signOut(` u js/** nosi `scope: 'local'` =====
// Pokreni: node tests/unit/signout-scope.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI (F2/1 ④, Leon, anketa 2026-09-14: „Samo ovaj uređaj"). U zakucanom
// supabase-js 2.110.8 je `signOut()` BEZ argumenta zadano `scope: 'global'` — opoziva SVE
// sesije računa, pa odjava na mobitelu odjavi i računalo. Poziv bez argumenta izgleda
// bezazleno i ništa u pregledniku ne pokazuje štetu dok se ne otvori DRUGI uređaj; zato se
// tvrdi na izvoru, za svako mjesto poziva, i novo mjesto bez `scope` padne ovdje.
//
// Učinak (da GoTrue stvarno pusti drugu sesiju živu) mjeri pravi poslužitelj:
// `tests/signout-local.authed.spec.js` (STAGING, dvije prave sesije).
// Brisanje računa ostaje globalno bez ijednog poziva odavde — `delete-account` briše
// korisnika, a s njim i sve njegove sesije.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');

let pao = 0;
const tvrdi = (uvjet, ime, detalj) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  → ' + JSON.stringify(detalj) : '')); }
};

function jsDatoteke(dir) {
    const van = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) van.push(...jsDatoteke(p));
        else if (e.name.endsWith('.js')) van.push(p);
    }
    return van;
}

/** Tekst argumenta poziva koji počinje na `od` (indeks otvorene zagrade), s brojanjem zagrada. */
function argument(izvor, od) {
    let dubina = 0;
    for (let i = od; i < izvor.length; i++) {
        if (izvor[i] === '(') dubina++;
        else if (izvor[i] === ')' && --dubina === 0) return izvor.slice(od + 1, i);
    }
    return null;
}

console.log('\n=== odjava samo ovaj uređaj (F2/1 ④) ===\n');

const datoteke = jsDatoteke(path.join(KORIJEN, 'js'));
const pozivi = [];
for (const d of datoteke) {
    const izvor = fs.readFileSync(d, 'utf8');
    const re = /\bauth\s*\.\s*signOut\s*\(/g;
    let m;
    while ((m = re.exec(izvor))) {
        const redak = izvor.slice(0, m.index).split('\n').length;
        pozivi.push({
            gdje: path.relative(KORIJEN, d).replace(/\\/g, '/') + ':' + redak,
            arg: argument(izvor, m.index + m[0].length - 1),
        });
    }
}

// Mjerač kaže koliko je dotaknuo: nula poziva znači da je regex promašio, ne da je sve u redu.
console.log('  (pregledano ' + datoteke.length + ' datoteka u js/, poziva `auth.signOut(`: ' + pozivi.length + ')');
tvrdi(pozivi.length >= 1, 'brana vidi bar jedan poziv (SokratAuth.signOut u js/auth.js)', pozivi.length);

for (const p of pozivi) {
    const lokalno = p.arg !== null && /\bscope\s*:\s*['"]local['"]/.test(p.arg);
    tvrdi(lokalno, p.gdje + ' → scope: \'local\'', p.arg);
}

console.log('\n' + (pao ? '❌ ' + pao + ' pad(ova)' : '✅ sve prolazi') + '\n');
process.exit(pao ? 1 : 0);
