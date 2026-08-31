/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `check:node` (MREŽA A2) =====
// Pokreni: node tests/unit/check-node-gate.test.js
//
// ZAŠTO POSTOJI: `check:node` je u trenutku pisanja bio CRVEN na razvojnom stroju (Node 24
// vs `.nvmrc` 22). Brana koja pada u trenutku uvođenja ne dokazuje ništa — jednako tako bi
// padala i da uvijek vraća 1. Zato ovdje stoji dokaz da POZELENI kad se izvori slože, a ne
// samo da pocrveni kad se ne slože.
//
// ⚠️ MJERI SE U LAŽNOM STABLU, pravo se ne dira. Svaki slučaj dobiva svoj privremeni
// direktorij s vlastitim `.nvmrc`, `package.json` i `.github/workflows/ci.yml`, pa se u
// njemu pokrene KOPIJA brane. Time provjera ne ovisi o tome što stroj trenutno vrti —
// referentna vrijednost je uvijek `process.versions.node` ovog procesa.
//
// ŠEST SLUČAJEVA, i tri od njih pokrivaju rubove koje bi naivna brana propustila:
//   ③ CI odluta od `.nvmrc`-a — brana koja gleda samo stroj vs `.nvmrc` to ne vidi, a
//      presuđuje CI, pa je „usklađen stroj" ondje lažna utjeha;
//   ④ `engines` kao raspon (`>=22`) uz točan major — TVRDNJA prolazi dok STANJE ne valja;
//   ⑤/⑥ nedostaje izvor — brana mora pasti zatvoreno, ne pretpostaviti vrijednost.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const IZVOR = path.join(__dirname, '..', '..', 'scripts', 'check-node.js');
const TEKUCI = process.versions.node.split('.')[0];

let passed = 0;
let failed = 0;

function stablo({ nvmrc, engines, ci }) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'checknode-'));
  fs.mkdirSync(path.join(d, 'scripts'));
  fs.mkdirSync(path.join(d, '.github', 'workflows'), { recursive: true });
  fs.copyFileSync(IZVOR, path.join(d, 'scripts', 'check-node.js'));
  if (nvmrc !== null) fs.writeFileSync(path.join(d, '.nvmrc'), nvmrc + '\n');
  fs.writeFileSync(
    path.join(d, 'package.json'),
    JSON.stringify({ name: 'lazno', engines: engines === null ? undefined : { node: engines } }, null, 2)
  );
  if (ci !== null) {
    fs.writeFileSync(
      path.join(d, '.github', 'workflows', 'ci.yml'),
      'jobs:\n  a:\n    steps:\n      - uses: actions/setup-node@v4\n        with:\n' +
        '          node-version: ' + JSON.stringify(ci) + '\n'
    );
  }
  return d;
}

function test(ime, opts, ocekivan) {
  const d = stablo(opts);
  try {
    const r = spawnSync(process.execPath, [path.join(d, 'scripts', 'check-node.js')], { encoding: 'utf8' });
    if (r.status === ocekivan) {
      passed++;
      console.log('  ✓ ' + ime);
    } else {
      failed++;
      console.error('  ✗ ' + ime + '\n      exit ' + r.status + ', očekivano ' + ocekivan);
    }
  } finally {
    fs.rmSync(d, { recursive: true, force: true });
  }
}

console.log('\n=== check:node — obrnuta provjera (MREŽA A2) ===\n');

test('① svi izvori jednaki tekućem procesu → PROLAZI', { nvmrc: TEKUCI, engines: TEKUCI + '.x', ci: TEKUCI }, 0);
test('② .nvmrc odudara od procesa → pada', { nvmrc: '18', engines: '18.x', ci: '18' }, 1);
test('③ CI odluta od .nvmrc-a → pada (ovo brana „stroj vs .nvmrc" ne vidi)', { nvmrc: TEKUCI, engines: TEKUCI + '.x', ci: '18' }, 1);
test('④ engines je raspon (>=N) iako je major točan → pada', { nvmrc: TEKUCI, engines: '>=' + TEKUCI, ci: TEKUCI }, 1);
test('⑤ .nvmrc nedostaje → pada zatvoreno', { nvmrc: null, engines: TEKUCI + '.x', ci: TEKUCI }, 1);
test('⑥ workflow bez node-version → pada zatvoreno', { nvmrc: TEKUCI, engines: TEKUCI + '.x', ci: null }, 1);

console.log('\n  ' + passed + ' prošlo · ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
