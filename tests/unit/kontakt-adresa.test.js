/* eslint-disable no-console */
// ===== JAVNI KONTAKT JE JEDNA ADRESA: sokrat@sokratstudy.com =====
// Pokreni: node tests/unit/kontakt-adresa.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI (F3/1 ①, 2026-09-16): do ove cigle je javni kontakt bio Leonov osobni Gmail,
// i to na OSAM mjesta u pet datoteka (contact · faq ×3 · privacy ×2 · terms · „O nama"). Leon je
// 06.09. odlučio da je glavni kontakt `sokrat@sokratstudy.com` (prosljeđivanje na Gmail potvrđeno
// 15.09.). Adresa prepisana osam puta je osam prilika da jedna ostane — i nijedna postojeća brana
// to ne bi vidjela: `legal.spec.js` traži samo DA `mailto:` postoji, ne KAMO vodi.
//
// Mjeri se svaka `.html` stranica u korijenu (ono što posjetitelj otvara) i rječnik sučelja:
//   ① svaki `mailto:` vodi na službenu adresu
//   ② vidljiva adresa u poveznici je ta ista (inače piše jedno, a šalje na drugo)
//   ③ osobni Gmail se ne pojavljuje nigdje na javnoj površini
// ⚠️ Brana ispisuje koliko je poveznica DOTAKNULA — nula pronađenih `mailto:` nije prolaz nego pad
// (mjerač koji ništa ne izmjeri vraća uvjerljivo zeleno).

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const SLUZBENA = 'sokrat@sokratstudy.com';
const OSOBNA = /leonkreso784@gmail\.com/i;

let pao = 0;
const tvrdi = (uvjet, ime) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime); }
};

console.log('\n=== javni kontakt = ' + SLUZBENA + ' ===\n');

const stranice = fs.readdirSync(KORIJEN).filter((f) => f.endsWith('.html'));
let dotaknuto = 0;

for (const ime of stranice) {
    const html = fs.readFileSync(path.join(KORIJEN, ime), 'utf8');
    const poveznice = [...html.matchAll(/<a\b[^>]*href="mailto:([^"?]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)];
    dotaknuto += poveznice.length;
    for (const [, adresa, tekst] of poveznice) {
        tvrdi(adresa === SLUZBENA, ime + ': mailto vodi na ' + adresa);
        const vidljiva = tekst.replace(/<[^>]+>/g, '').match(/[\w.+-]+@[\w.-]+\.\w+/);
        if (vidljiva) tvrdi(vidljiva[0] === SLUZBENA, ime + ': vidljiva adresa ' + vidljiva[0]);
    }
    tvrdi(!OSOBNA.test(html), ime + ': bez osobnog Gmaila');
}

const rjecnik = fs.readFileSync(path.join(KORIJEN, 'js', 'i18n.js'), 'utf8');
tvrdi(!OSOBNA.test(rjecnik), 'js/i18n.js: bez osobnog Gmaila');

console.log('\n  dotaknuto: ' + stranice.length + ' stranica, ' + dotaknuto + ' mailto-poveznica');
tvrdi(dotaknuto >= 4, 'mjerač je našao bar četiri mailto-poveznice (nula = ništa nije izmjereno)');

if (pao) { console.log('\n❌ ' + pao + ' pad(ova)\n'); process.exit(1); }
console.log('\n✅ sve prolazi\n');
