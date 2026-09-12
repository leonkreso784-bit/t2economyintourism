/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA A11Y PRESUDE I OSNOVICE (MREŽA B3b) =====
// Pokreni: node tests/unit/a11y-gate.test.js
//
// ZAŠTO POSTOJI: B3b mijenja PRESUDU brane (težina → razina ∪ težina) i uvodi imenovanu
// osnovicu. Brana kojoj nitko nije dokazao i CRVENU stranu ne dokazuje ništa (kućno
// pravilo iz check-tokens/check-final provjera) — a upravo je presuda po krivoj ljestvici
// držala `scrollable-region-focusable` u backlogu uz zelenu branu od 2026-08-14.
// Razvrstavač razine (`wcagRazina`) ima vlastitih 10 provjera u `wcag-razina.test.js`;
// ovdje se dokazuje PRESUDA nad njim i ponašanje osnovice.

const path = require('path');
const { uGateu, presudiOsnovicom, ucitajOsnovicu, gateViolations, iskljucenoOdlukom, ISKLJUCENO_ODLUKOM } = require('../helpers/axe-gate.js');

const v = (impact, tags, id) => ({ id: id || 'pravilo-x', impact, tags, nodes: [] });

let failed = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime) => {
  ukupno++;
  if (uvjet) console.log('  ✅ ' + ime);
  else { failed++; console.log('  ❌ ' + ime); }
};

console.log('\n=== obrnuta provjera: a11y presuda (uGateu) ===\n');

// ① POVOD CIJELE CIGLE: razina A s težinom moderate MORA u gate — do B3b nije ulazila.
tvrdi(uGateu(v('moderate', ['cat.keyboard', 'wcag2a', 'wcag211'])) === true,
  'wcag2a + moderate → U GATEU (scrollable-region-focusable, povod B3)');

// ② Razina AA ulazi neovisno o težini.
tvrdi(uGateu(v('minor', ['wcag2aa', 'wcag143'])) === true, 'wcag2aa + minor → u gateu');

// ③ UNIJA NE SLABI: serious bez wcag-taga (best-practice) i dalje ulazi.
tvrdi(uGateu(v('serious', ['cat.semantics', 'best-practice'])) === true,
  'best-practice + serious → u gateu (prebacivanje ljestvice ne smije oslabiti branu)');

// ④ best-practice + moderate NE ulazi (to je backlog, kao i dosad).
tvrdi(uGateu(v('moderate', ['cat.semantics', 'best-practice'])) === false,
  'best-practice + moderate → NIJE u gateu');

// ⑤ AAA se ne gatea po razini (cilj je AA) — ali serious AAA uđe po težini.
tvrdi(uGateu(v('minor', ['wcag2aaa'])) === false, 'AAA + minor → nije u gateu (cilj je AA)');
tvrdi(uGateu(v('serious', ['wcag2aaa'])) === true, 'AAA + serious → u gateu (po težini)');

console.log('\n=== obrnuta provjera: osnovica (presudiOsnovicom) ===\n');

const OSN = { tolerirano: { 'STUDY-KVANT/learn::scrollable-region-focusable': 'razlog' } };
const nalaz = { id: 'scrollable-region-focusable', impact: 'serious', nodes: 9 };

// ⑥ Imenovani upis se tolerira (ne pada), ali se broji kao toleriran.
{
  const r = presudiOsnovicom([nalaz], 'STUDY-KVANT/learn', OSN);
  tvrdi(r.novi.length === 0 && r.tolerirani.length === 1, 'imenovani upis → toleriran, ne pada');
}

// ⑦ Isti rule na DRUGOJ površini PADA — tolerancija se ne proteže preko ključa.
{
  const r = presudiOsnovicom([nalaz], 'LANDING', OSN);
  tvrdi(r.novi.length === 1, 'isti rule na drugoj površini → NOVI (tolerancija je po ključu)');
}

// ⑧ Nalaz kojeg u osnovici nema pada i s praznom osnovicom.
{
  const r = presudiOsnovicom([nalaz], 'STUDY-KVANT/learn', { tolerirano: {} });
  tvrdi(r.novi.length === 1, 'prazna osnovica → svaki nalaz je nov (brana traži nulu)');
}

// ⑨ Upis bez nalaza = RIJEŠEN, imenovan — zastarjela osnovica se ne smije tiho vući.
{
  const r = presudiOsnovicom([], 'STUDY-KVANT/learn', OSN);
  tvrdi(r.rijeseni.length === 1 && r.rijeseni[0].indexOf('scrollable') !== -1,
    'upis bez nalaza → riješen, imenovan');
}

// ⑩ Riješenost se sudi SAMO za skeniranu površinu: tuđi upisi se ne proglašavaju riješenima.
{
  const r = presudiOsnovicom([], 'LANDING', OSN);
  tvrdi(r.rijeseni.length === 0, 'upis druge površine NIJE riješen kad se skenira ova');
}

console.log('\n=== obrnuta provjera: isključeno ODLUKOM, ne osnovicom (F1/11, ADR-034) ===\n');

// Povod: `user-scalable=no, maximum-scale=1` na svih 6 stranica je Leonova odluka o proizvodu
// (ADR-034), a axe to prijavljuje kao `meta-viewport` (WCAG 1.4.4, AA) — dakle U GATEU po
// razini. Osnovica bi tražila deset ključeva (po površini) i proglašavala „riješeno" kad
// nalaz nestane — a on ne smije nestati. Obrnuto 2026-09-05: bez isključenja landing pada.
const rez = (violations) => ({ violations });
const metaViewport = {
  id: 'meta-viewport', impact: 'moderate', tags: ['cat.sensory-and-visual-cues', 'wcag2aa', 'wcag144'],
  help: 'Zooming and scaling must not be disabled', nodes: [{ target: ['meta[name="viewport"]'], any: [] }]
};
const drugiAA = Object.assign({}, metaViewport, { id: 'color-contrast' });

// ⑬ Popis je TOČNO { meta-viewport } i nosi ADR-034 kao razlog — širenje popisa je nova odluka, ne zakrpa.
tvrdi(Object.keys(ISKLJUCENO_ODLUKOM).join(',') === 'meta-viewport' && /ADR-034/.test(ISKLJUCENO_ODLUKOM['meta-viewport']),
  'ISKLJUCENO_ODLUKOM = točno { meta-viewport } s razlogom ADR-034');

// ⑭ meta-viewport JE u gateu po presudi (AA) — vadi ga odluka, ne ljestvica; i ne nestaje nego se ispisuje.
tvrdi(uGateu(metaViewport) === true, 'meta-viewport (AA, moderate) je po presudi U GATEU — isključenje ga vadi odlukom, ne ljestvicom');
tvrdi(gateViolations(rez([metaViewport])).length === 0, 'gateViolations: meta-viewport NE pada (ADR-034)');
tvrdi(iskljucenoOdlukom(rez([metaViewport])).length === 1, 'iskljucenoOdlukom: meta-viewport se ISPISUJE kao isključen, ne nestaje tiho');

// ⑮ Isključenje je po ID-u, ne po razredu: drugi AA nalaz s ISTIM tagovima i dalje pada.
tvrdi(gateViolations(rez([metaViewport, drugiAA])).map((g) => g.id).join(',') === 'color-contrast',
  'drugi AA nalaz uz meta-viewport i dalje pada — isključenje je po id-u, ne po razini');

console.log('\n=== obrnuta provjera: ucitajOsnovicu ===\n');

// ⑪ Nedostajuća osnovica RUŠI (ugovor u repou; nestanak je kvar okoline, ne "nula upisa").
{
  let bacio = false;
  try { ucitajOsnovicu(path.join(__dirname, 'ne-postoji-12345.json')); } catch (e) { bacio = true; }
  tvrdi(bacio, 'nedostajuća osnovica → baca, ne tolerira tiho');
}

// ⑫ Prava, commitana osnovica se učitava i ima ugovorenu strukturu.
{
  const o = ucitajOsnovicu();
  tvrdi(o && typeof o.tolerirano === 'object', 'commitana osnovica postoji i drži "tolerirano"');
}

console.log('\n' + (failed ? '❌ ' + failed + ' palo' : '✅ svih ' + ukupno + ' prošlo') + '\n');
process.exit(failed ? 1 : 0);
