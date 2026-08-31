/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `check:tokens` (MREŽA B1) =====
// Pokreni: node tests/unit/check-tokens-gate.test.js
//
// ZAŠTO POSTOJI: brana je pisana NAKON što je `--border-color` popravljen, pa na živom
// stablu od prvog dana prolazi — a brana koja samo prolazi ne dokazuje ništa. Ovdje stoji
// dokaz da PADNE na `var(--nepostojeci)` (izričit zahtjev speca §4·B1), da NE padne na
// spomen u komentaru (lekcija `--card-bg`/`--grad`: povijest popravka živi u komentaru i
// prva verzija mjerila ju je lažno prijavila), i da runtime-definiciju vidi kao definiciju.
//
// ⚠️ MJERI SE U LAŽNOM STABLU, pravo se ne dira — svaki slučaj dobiva svoj privremeni
// direktorij s vlastitim `css/`, `js/` i osnovicom, pa se u njemu pokrene KOPIJA brane.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const IZVOR = path.join(__dirname, '..', '..', 'scripts', 'check-tokens.js');

let passed = 0;
let failed = 0;

function stablo({ css, js, osnovica }) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'checktokens-'));
  fs.mkdirSync(path.join(d, 'scripts'));
  fs.mkdirSync(path.join(d, 'css'));
  fs.copyFileSync(IZVOR, path.join(d, 'scripts', 'check-tokens.js'));
  for (const [ime, sadrzaj] of Object.entries(css || {})) {
    fs.writeFileSync(path.join(d, 'css', ime), sadrzaj);
  }
  if (js) {
    fs.mkdirSync(path.join(d, 'js'));
    for (const [ime, sadrzaj] of Object.entries(js)) {
      fs.writeFileSync(path.join(d, 'js', ime), sadrzaj);
    }
  }
  if (osnovica !== null) {
    fs.writeFileSync(path.join(d, 'scripts', 'tokens-baseline.json'),
      JSON.stringify(osnovica || {}, null, 2) + '\n');
  }
  return d;
}

function vrti(d) {
  return spawnSync(process.execPath, [path.join(d, 'scripts', 'check-tokens.js')],
    { cwd: d, encoding: 'utf8' });
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

console.log('\n=== obrnuta provjera: check:tokens ===\n');

// ① sve definirano → PROLAZI (dokaz da brana nije uvijek crvena)
slucaj('① definirana upotreba prolazi', 0, vrti(stablo({
  css: { 'a.css': ':root { --boja: red; }\n.x { color: var(--boja); }\n' },
  osnovica: {},
})));

// ② `var(--nepostojeci)` → PADA — izričita obrnuta provjera iz speca
slucaj('② var(--nepostojeci) pada', 1, vrti(stablo({
  css: { 'a.css': '.x { color: var(--nepostojeci, #334155); }\n' },
  osnovica: {},
})), (izlaz) => izlaz.includes('--nepostojeci'));

// ③ ime iz osnovice se TOLERIRA (čegrtaljka, ne tvrda zabrana)
slucaj('③ ime iz osnovice prolazi', 0, vrti(stablo({
  css: { 'a.css': '.x { color: var(--naslijedjen); }\n' },
  osnovica: { '--naslijedjen': ['css/a.css:1'] },
})));

// ④ ime iz osnovice koje više ne postoji → prolaz + uputa da se osnovica spusti
slucaj('④ zastarjela osnovica traži spuštanje', 0, vrti(stablo({
  css: { 'a.css': ':root { --boja: red; }\n.x { color: var(--boja); }\n' },
  osnovica: { '--vise-ne-postoji': ['css/a.css:9'] },
})), (izlaz) => izlaz.includes('--update'));

// ⑤ nema osnovice → pada ZATVORENO, ne pretpostavlja praznu
slucaj('⑤ bez osnovice pada zatvoreno', 2, vrti(stablo({
  css: { 'a.css': '.x { color: red; }\n' },
  osnovica: null,
})));

// ⑥ spomen SAMO u komentaru se NE broji (lekcija --card-bg/--grad)
slucaj('⑥ komentar nije upotreba', 0, vrti(stablo({
  css: { 'a.css': '/* bilo je var(--duh, #fff) — popravljeno */\n.x { color: red; }\n' },
  osnovica: {},
})));

// ⑦ runtime-definicija (inline stil u JS-u) vrijedi kao definicija — i ispisuje se odvojeno
slucaj('⑦ JS inline stil je definicija', 0, vrti(stablo({
  css: { 'a.css': '.x::after { background: var(--tocka); }\n' },
  js: { 'w.js': "el.innerHTML = '<b style=\"--tocka:' + col + '\"></b>';\n" },
  osnovica: {},
})), (izlaz) => izlaz.includes('runtime'));

console.log('\n' + (failed ? '❌ ' + failed + ' palo' : '✅ svih ' + passed + ' prošlo') + '\n');
process.exit(failed ? 1 : 0);
