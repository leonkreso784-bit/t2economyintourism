/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `check:final` — imenovani preskočeni (MREŽA B2) =====
// Pokreni: node tests/unit/check-final-skips.test.js
//
// ZAŠTO POSTOJI: B2 tvrdi da „deveti preskočeni obara branu". Na živoj bazi to se ne može
// dokazati bez kvarenja podataka — zato se baza GLUMI: lokalni HTTP server odgovara na
// `/rest/v1/subject_content`, a skripta ga gađa kroz svoj postojeći staging-mehanizam
// (`SUPABASE_TARGET=staging` + `STAGING_SUPABASE_URL`). Katalog dolazi kroz `CATALOG_PATH`.
// Mreže nema, prod se ne dira, a mjeri se ISTA skripta koja se vrti protiv produkcije.
//
// ⚠️ Svaki slučaj dobiva svoje lažno stablo (kopija brane + vlastita osnovica), jer brana
// čita osnovicu pored sebe (`__dirname`) — kao i ostale obrnute provjere brana.

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const IZVOR = path.join(__dirname, '..', '..', 'scripts', 'check-final-drift.js');

let passed = 0;
let failed = 0;

// Katalog: `alpha` je 3-dijelni i u bazi; `beta` je 3-dijelni ali NIJE u bazi (preskočen).
const KATALOG = `module.exports.SOKRAT_CATALOG = { subjects: [
  { id: 'alpha', content: { resolve: { 'first-midterm': 'aM1', 'second-midterm': 'aM2', 'final': 'aF' } } },
  { id: 'beta',  content: { resolve: { 'first-midterm': 'bM1', 'second-midterm': 'bM2', 'final': 'bF' } } },
] };\n`;

// Baza: alpha kompletan i konzistentan (final == M1 ⊕ M2); beta nema redova.
const REDCI_OK = [
  { subject_id: 'alpha', var_name: 'aM1', payload: { k1: [1, 2] } },
  { subject_id: 'alpha', var_name: 'aM2', payload: { k2: [3] } },
  { subject_id: 'alpha', var_name: 'aF', payload: { k1: [1, 2], k2: [3], examPractice: [9] } },
];
// Varijanta s DRIFTOM: final ima stari k1.
const REDCI_DRIFT = [
  REDCI_OK[0], REDCI_OK[1],
  { subject_id: 'alpha', var_name: 'aF', payload: { k1: [1, 999], k2: [3], examPractice: [9] } },
];

function stablo(osnovica) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'checkfinal-'));
  fs.mkdirSync(path.join(d, 'scripts'));
  fs.copyFileSync(IZVOR, path.join(d, 'scripts', 'check-final-drift.js'));
  fs.writeFileSync(path.join(d, 'katalog.js'), KATALOG);
  if (osnovica !== null) {
    fs.writeFileSync(path.join(d, 'scripts', 'final-skip-baseline.json'),
      JSON.stringify(osnovica, null, 2) + '\n');
  }
  return d;
}

// ⚠️ Asinkrono NAMJERNO: `spawnSync` bi blokirao event-loop OVOG procesa, a u njemu
// živi lažni HTTP server — dijete bi onda visjelo na fetchu do svog 20 s aborta i
// svaki slučaj bi ispao „baza spava". Prva verzija je pala točno tako, svih šest.
function vrti(d, url) {
  return new Promise((ok) => {
    const ch = spawn(process.execPath, [path.join(d, 'scripts', 'check-final-drift.js')], {
      cwd: d,
      env: Object.assign({}, process.env, {
        SUPABASE_TARGET: 'staging',
        STAGING_SUPABASE_URL: url,
        STAGING_SUPABASE_ANON: 'lazni-kljuc',
        CATALOG_PATH: path.join(d, 'katalog.js'),
      }),
    });
    let out = '';
    ch.stdout.on('data', (c) => { out += c; });
    ch.stderr.on('data', (c) => { out += c; });
    ch.on('close', (status) => ok({ status, stdout: out, stderr: '' }));
  });
}

function slucaj(ime, ocekivanExit, r, dodatno) {
  const izlaz = (r.stdout || '') + (r.stderr || '');
  const okExit = r.status === ocekivanExit;
  const okDodatno = !dodatno || dodatno(izlaz);
  if (okExit && okDodatno) {
    passed++;
    console.log('  ✅ ' + ime);
  } else {
    failed++;
    console.log('  ❌ ' + ime + '  (exit ' + r.status + ', očekivan ' + ocekivanExit + ')');
    console.log(izlaz.split('\n').map((l) => '     | ' + l).join('\n'));
  }
}

async function main() {
  let redci = REDCI_OK;
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(redci));
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const url = 'http://127.0.0.1:' + server.address().port;

  console.log('\n=== obrnuta provjera: check:final — imenovani preskočeni ===\n');

  // ① preskočeni u osnovici → PROLAZI, i imenovan je u ispisu
  slucaj('① preskočeni iz osnovice prolazi imenovan', 0,
    await vrti(stablo({ beta: 'nije u bazi' }), url),
    (izlaz) => izlaz.includes('beta') && izlaz.includes('nije u bazi'));

  // ② preskočeni IZVAN osnovice → PADA („deveti preskočeni")
  slucaj('② preskočeni izvan osnovice pada', 1,
    await vrti(stablo({}), url),
    (izlaz) => izlaz.includes('NOVI preskočeni: beta'));

  // ③ isti predmet, PROMIJENJEN razlog → PADA (razlog je dio odobrenja)
  slucaj('③ promijenjen razlog pada', 1,
    await vrti(stablo({ beta: 'ne-3-dijelni' }), url));

  // ④ osnovica imenuje predmet koji više nije preskočen → prolaz + uputa
  slucaj('④ zastarjela osnovica traži spuštanje', 0,
    await vrti(stablo({ beta: 'nije u bazi', gama: 'nije u bazi' }), url),
    (izlaz) => izlaz.includes('gama') && izlaz.includes('--update'));

  // ⑤ nema osnovice → pada zatvoreno
  slucaj('⑤ bez osnovice pada zatvoreno', 2, await vrti(stablo(null), url));

  // ⑥ DRIFT i dalje pada — prepravka nije oslabila izvornu tvrdnju brane
  redci = REDCI_DRIFT;
  slucaj('⑥ drift i dalje pada', 1,
    await vrti(stablo({ beta: 'nije u bazi' }), url),
    (izlaz) => izlaz.includes('DRIFT: alpha'));

  server.close();
  console.log('\n' + (failed ? '❌ ' + failed + ' palo' : '✅ svih ' + passed + ' prošlo') + '\n');
  process.exit(failed ? 1 : 0);
}

main();
