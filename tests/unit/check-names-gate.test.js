/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA check:names =====
// Pokreni: node tests/unit/check-names-gate.test.js
//
// ZAŠTO POSTOJI: pravi popis imena je izvan gita, pa ga CI nema — bez ovog testa nitko ne
// bi dokazao da brana uopće PADA. Imena ovdje su izmišljena.

const { parsirajPopis, nadji } = require('../../scripts/check-names.js');

let failed = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime) => {
  ukupno++;
  if (uvjet) console.log('  ✅ ' + ime);
  else { failed++; console.log('  ❌ ' + ime); }
};
const d = (tekst) => [{ put: 'x.js', tekst }];

console.log('\n=== obrnuta provjera: check:names ===\n');

const popis = parsirajPopis('# komentar\nTestić\n\nprof. Primjerović   # s kontekstom\nZdrav*\r\n');
tvrdi(popis.length === 3 && popis[1] === 'prof. Primjerović', 'popis: komentari, prazni retci i CRLF izbačeni (3 stavke)');

tvrdi(nadji(popis, d('// Source: lecture decks (Testić, FMTU)')).length === 1, 'ime u komentaru → NALAZ');
tvrdi(nadji(popis, d("description: 'Opis (Testić): ...'")).length === 1, 'ime u opisu predmeta → NALAZ');
tvrdi(nadji(popis, d('Testićev')).length === 0, 'cijela riječ: „Testićev" NIJE „Testić" (Unicode granica, ne \\b)');
tvrdi(nadji(popis, d('NeTestić')).length === 0, 'cijela riječ: lijevi rub');
tvrdi(nadji(popis, d('Zdravkova staza · Zdravku')).length === 1, 'prefiks `Zdrav*` hvata padeže (jedan redak = jedan nalaz)');
tvrdi(nadji(popis, d('Primjerović, Ivo. „Naslov." Časopis 1 (2019).')).length === 0,
  'stavka s kontekstom („prof. X") NE dira dopušteni citat istog prezimena');
tvrdi(nadji(popis, d('prema prof. Primjerović iz predavanja')).length === 1, 'stavka s kontekstom hvata nastavnika');
tvrdi(nadji(popis, d('čisto\nčisto\nTestić')).map((n) => n.redak).join() === '3', 'broj retka nalaza je točan');
tvrdi(nadji([], d('Testić')).length === 0 && parsirajPopis('# samo komentar\n').length === 0,
  'prazan popis daje nula stavki (CLI to tretira kao PAD, ne kao „čisto")');

console.log(`\n${failed ? '❌' : '✅'} ${ukupno - failed}/${ukupno} prošlo`);
process.exit(failed ? 1 : 0);
