/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `check:cascade` (MREŽA B4) =====
// Pokreni: node tests/unit/check-cascade-gate.test.js
//
// ZAŠTO POSTOJI: brana je pisana NAD zatečenim stanjem (23 gašenja u osnovici), pa na
// živom stablu prolazi od prvog dana — a brana koja samo prolazi ne dokazuje ništa.
// Ovdje stoji dokaz da PADNE na mehanici BUG-039 (kasniji širi upit gasi raniji uži;
// isti pragovi gdje presuđuje samo redoslijed), da NE prijavljuje disjunktne uvjete,
// različita svojstva, iste vrijednosti ni raniji `!important`, i da redoslijed čita
// iz MANIFESTA (css/app.css), ne abecedno.
//
// ⚠️ MJERI SE U LAŽNOM STABLU (kućni obrazac iz check-tokens provjere) — pravo se ne dira.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const IZVOR = path.join(__dirname, '..', '..', 'scripts', 'check-cascade.js');

let passed = 0;
let failed = 0;

function stablo({ datoteke, manifest, osnovica }) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'checkcascade-'));
  fs.mkdirSync(path.join(d, 'scripts'));
  fs.mkdirSync(path.join(d, 'css'));
  fs.mkdirSync(path.join(d, 'css', 'responsive'));
  fs.copyFileSync(IZVOR, path.join(d, 'scripts', 'check-cascade.js'));
  const imena = Object.keys(datoteke);
  const uvozi = (manifest || imena).map((f) => '@import "./responsive/' + f + '";').join('\n');
  fs.writeFileSync(path.join(d, 'css', 'app.css'), uvozi + '\n');
  for (const [ime, sadrzaj] of Object.entries(datoteke)) {
    fs.writeFileSync(path.join(d, 'css', 'responsive', ime), sadrzaj);
  }
  if (osnovica !== null) {
    fs.writeFileSync(path.join(d, 'scripts', 'cascade-baseline.json'),
      JSON.stringify({ tolerirano: osnovica || {} }, null, 2) + '\n');
  }
  return d;
}

function vrti(d) {
  return spawnSync(process.execPath, [path.join(d, 'scripts', 'check-cascade.js')], { encoding: 'utf8' });
}

function slucaj(ime, ocekivanExit, r, dodatno) {
  const izlaz = (r.stdout || '') + (r.stderr || '');
  const ok = r.status === ocekivanExit && (!dodatno || dodatno(izlaz));
  if (ok) { passed++; console.log('  ✅ ' + ime); }
  else {
    failed++;
    console.log('  ❌ ' + ime + ' (exit ' + r.status + ', očekivan ' + ocekivanExit + ')');
    console.log(izlaz.split('\n').slice(0, 8).map((l) => '     | ' + l).join('\n'));
  }
}

console.log('\n=== obrnuta provjera: check:cascade (B4) ===\n');

// ① MEHANIKA BUG-039: kasniji ŠIRI upit gasi raniji uži (05 ljestva vs 06 blanket) → pad.
slucaj('kasniji širi upit gasi raniji uži → PAD, selektor imenovan', 1, vrti(stablo({
  datoteke: {
    '05.css': '@media screen and (min-width: 1280px) and (max-width: 1535px) { .quiz { max-width: 800px; } }',
    '06.css': '@media (min-width: 768px) { .quiz { max-width: 650px; } }'
  },
  osnovica: {}
})), (o) => o.includes('.quiz') && o.includes('NOVO'));

// ② ISTI pragovi, presuđuje samo redoslijed (najčišći oblik, .progress-overview) → pad.
slucaj('isti pragovi, kasnija datoteka pobjeđuje → PAD', 1, vrti(stablo({
  datoteke: {
    '01.css': '@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }',
    '06.css': '@media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }'
  },
  osnovica: {}
})), (o) => o.includes('.grid'));

// ③ Disjunktne ŠIRINE (max-767 vs min-768) se NE prijavljuju.
slucaj('disjunktne širine → zeleno', 0, vrti(stablo({
  datoteke: {
    '02.css': '@media (max-width: 767px) { .x { padding: 1rem; } }',
    '06.css': '@media (min-width: 768px) { .x { padding: 2rem; } }'
  },
  osnovica: {}
})));

// ④ Kontradiktorna ORIJENTACIJA se ne prijavljuje.
slucaj('landscape vs portrait → zeleno', 0, vrti(stablo({
  datoteke: {
    '04.css': '@media (max-width: 900px) and (orientation: landscape) { .fc { min-height: 150px; } }',
    '06.css': '@media (max-width: 767px) and (orientation: portrait) { .fc { min-height: 280px; } }'
  },
  osnovica: {}
})));

// ④b …ali BUG-037 oblik (kasniji upit BEZ orijentacije preklapa landscape) SE prijavljuje.
slucaj('kasniji upit bez orijentacije preklapa landscape → PAD (BUG-037)', 1, vrti(stablo({
  datoteke: {
    '04.css': '@media (max-width: 900px) and (orientation: landscape) { .fc { min-height: 150px; } }',
    '06.css': '@media (max-width: 767px) and (hover: none) and (pointer: coarse) { .fc { min-height: 280px; } }'
  },
  osnovica: {}
})), (o) => o.includes('.fc'));

// ⑤ Različito SVOJSTVO se ne prijavljuje (pravila se slažu, ne tuku).
slucaj('različito svojstvo → zeleno', 0, vrti(stablo({
  datoteke: {
    '02.css': '@media (max-width: 767px) { .x { padding: 1rem; } }',
    '06.css': '@media (max-width: 767px) { .x { margin: 2rem; } }'
  },
  osnovica: {}
})));

// ⑥ ISTA vrijednost se ne prijavljuje (redundancija bez vidljive posljedice).
slucaj('ista vrijednost → zeleno', 0, vrti(stablo({
  datoteke: {
    '02.css': '@media (max-width: 767px) { .x { padding: 1rem; } }',
    '06.css': '@media (max-width: 767px) { .x { padding: 1rem; } }'
  },
  osnovica: {}
})));

// ⑦ Raniji `!important` STVARNO pobjeđuje → nije gašenje.
slucaj('raniji !important → zeleno (raniji pobjeđuje)', 0, vrti(stablo({
  datoteke: {
    '02.css': '@media (max-width: 767px) { .x { padding: 1rem !important; } }',
    '06.css': '@media (max-width: 767px) { .x { padding: 2rem; } }'
  },
  osnovica: {}
})));

// ⑧ Imenovani upis u osnovici → zeleno, uz glasan "tolerirano".
slucaj('imenovani upis → zeleno + tolerirano', 0, vrti(stablo({
  datoteke: {
    '05.css': '@media (min-width: 1280px) { .quiz { max-width: 800px; } }',
    '06.css': '@media (min-width: 768px) { .quiz { max-width: 650px; } }'
  },
  osnovica: {
    '.quiz | max-width | responsive/05.css@@media (min-width: 1280px) -> responsive/06.css@@media (min-width: 768px)': 'zatečeno'
  }
})), (o) => o.includes('tolerirano'));

// ⑨ Upis bez nalaza → zeleno + glasan RIJEŠENO (uputa da se osnovica spusti).
slucaj('zastarjeli upis → zeleno + RIJEŠENO', 0, vrti(stablo({
  datoteke: { '02.css': '.x { padding: 1rem; }' },
  osnovica: { 'davno | riješeno | a -> b': 'zatečeno' }
})), (o) => o.includes('RIJEŠENO'));

// ⑩ Nedostajuća osnovica → exit 2 (pada zatvoreno).
slucaj('nema osnovice → exit 2', 2, vrti(stablo({
  datoteke: { '02.css': '.x { padding: 1rem; }' },
  osnovica: null
})));

// ⑪ Mjerač ispisuje koliko je dotaknuo (pravilo faze: 12 kvarova mjerača).
slucaj('ispisuje opseg (dotaknuto)', 0, vrti(stablo({
  datoteke: { '02.css': '.x { padding: 1rem; }' },
  osnovica: {}
})), (o) => /dotaknuto: 1 datoteka/.test(o));

// ⑫ Redoslijed iz MANIFESTA, ne abecedno: manifest kaže z-prva pa a-druga →
//    žrtva mora biti z-prva (abecedno kasnija). Ključ nalaza to imenuje.
slucaj('redoslijed čita manifest, ne abecedu', 1, vrti(stablo({
  datoteke: {
    'z-prva.css': '@media (min-width: 768px) { .x { gap: 1rem; } }',
    'a-druga.css': '@media (min-width: 768px) { .x { gap: 2rem; } }'
  },
  manifest: ['z-prva.css', 'a-druga.css'],
  osnovica: {}
})), (o) => o.includes('z-prva.css@') && /z-prva[^\n]*-> [^\n]*a-druga/.test(o));

console.log('\n' + (failed ? '❌ ' + failed + ' palo' : '✅ svih ' + passed + ' prošlo') + '\n');
process.exit(failed ? 1 : 0);
