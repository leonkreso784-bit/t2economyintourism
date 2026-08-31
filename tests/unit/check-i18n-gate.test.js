/* eslint-disable no-console */
// ===== OBRNUTA PROVJERA ZA `check:i18n` (MREŽA B5) =====
// Pokreni: node tests/unit/check-i18n-gate.test.js
//
// ZAŠTO POSTOJI: brana je pisana NAD zatečenim stanjem (421 nalaz u 23 datoteke), pa na
// živom stablu prolazi od prvog dana — a brana koja samo prolazi ne dokazuje ništa.
// Ovdje stoji dokaz da PADNE na `about`-razredu (nova stranica bez ijednog ključa), na
// zakucanom tekstu u JS predlošcima i sinkovima te na ključu kojeg NEMA u rječniku
// (K5 razred) — i da NE prijavljuje tekst s ključem, iznimke (brojevi/e-adrese/URL/imena),
// `<head>`, interpolirani `${t('k')}` ni argument-ključ `t('x.y', …)` poziva.
//
// ⚠️ MJERI SE U LAŽNOM STABLU (kućni obrazac iz check-cascade provjere) — pravo se ne dira.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const IZVOR = path.join(__dirname, '..', '..', 'scripts', 'check-i18n.js');

let passed = 0;
let failed = 0;

// Mini rječnik: ključevi koje lažno stablo smije koristiti.
const MINI_DICT = "(function () {\n  const DICT = {\n"
  + "    'nav.ok': { en: 'OK', hr: 'U redu' },\n"
  + "    'msg.saved': { en: 'Saved', hr: 'Spremljeno' },\n"
  + "  };\n})();\n";

function stablo({ html, js, osnovica }) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'checki18n-'));
  fs.mkdirSync(path.join(d, 'scripts'));
  fs.mkdirSync(path.join(d, 'js'));
  fs.copyFileSync(IZVOR, path.join(d, 'scripts', 'check-i18n.js'));
  fs.writeFileSync(path.join(d, 'js', 'i18n.js'), MINI_DICT);
  for (const [ime, sadrzaj] of Object.entries(html || {})) {
    fs.writeFileSync(path.join(d, ime), '<html><head><title>Skip me</title></head><body>' + sadrzaj + '</body></html>');
  }
  for (const [ime, sadrzaj] of Object.entries(js || {})) {
    fs.writeFileSync(path.join(d, 'js', ime), sadrzaj);
  }
  if (osnovica !== null) {
    fs.writeFileSync(path.join(d, 'scripts', 'i18n-baseline.json'),
      JSON.stringify({ datoteke: osnovica || {} }, null, 2) + '\n');
  }
  return d;
}

function vrti(d, argv) {
  return spawnSync(process.execPath,
    [path.join(d, 'scripts', 'check-i18n.js')].concat(argv || []),
    { encoding: 'utf8', cwd: d });
}

function slucaj(ime, ocekivanExit, r, dodatno) {
  const izlaz = (r.stdout || '') + (r.stderr || '');
  const ok = r.status === ocekivanExit && (!dodatno || dodatno(izlaz));
  if (ok) { passed++; console.log('  ✅ ' + ime); }
  else {
    failed++;
    console.log('  ❌ ' + ime + ' (exit ' + r.status + ', očekivan ' + ocekivanExit + ')');
    console.log(izlaz.split('\n').slice(0, 10).map((l) => '     | ' + l).join('\n'));
  }
}

console.log('\n=== obrnuta provjera: check:i18n (B5) ===\n');

// ① `about`-RAZRED: nova stranica sa zakucanim tekstom, nije u osnovici → PAD + imenovana.
slucaj('nova stranica bez ključeva → PAD, `about`-razred imenovan', 1, vrti(stablo({
  html: { 'nova.html': '<h1>Welcome students</h1>' },
  osnovica: {},
})), (o) => o.includes('nova.html') && o.includes('about'));

// ② Isti tekst S ključem koji POSTOJI u rječniku → zeleno.
slucaj('tekst s data-i18n i postojećim ključem → zeleno', 0, vrti(stablo({
  html: { 'ok.html': '<h1 data-i18n="nav.ok">Welcome</h1>' },
  osnovica: {},
})));

// ③ `<head>` je granica mjere (domena check:seo) → zeleno.
slucaj('tekst u <head> (title) se ne sudi → zeleno', 0, vrti(stablo({
  html: { 'prazna.html': '' }, // title "Skip me" dolazi iz omota stabla
  osnovica: {},
})));

// ④ Iznimke: brojevi, e-adresa, URL, vlastito ime → zeleno.
slucaj('broj / e-adresa / URL / vlastito ime → zeleno', 0, vrti(stablo({
  html: { 'izuzeto.html': '<p>© 2026</p><a>info@sokratstudy.com</a><span>https://a.hr/x</span><b>Sokrat Study</b>' },
  osnovica: {},
})));

// ⑤ placeholder bez mehanizma → PAD; s data-i18n-placeholder → zeleno.
slucaj('placeholder bez data-i18n-placeholder → PAD', 1, vrti(stablo({
  html: { 'p1.html': '<input placeholder="Your name">' },
  osnovica: {},
})), (o) => o.includes('atribut placeholder'));
slucaj('placeholder s mehanizmom i postojećim ključem → zeleno', 0, vrti(stablo({
  html: { 'p2.html': '<input placeholder="Your name" data-i18n-placeholder="nav.ok">' },
  osnovica: {},
})));

// ⑥ JS predložak sa zakucanim tekstom → PAD; samo `${t(\'k\')}` interpolacija → zeleno.
slucaj('zakucan tekst u JS template literalu → PAD', 1, vrti(stablo({
  js: { 'ui.js': 'el.innerHTML = `<button class="x">Publish now</button>`;\n' },
  osnovica: {},
})), (o) => o.includes('js/ui.js') && o.includes('Publish now'));
slucaj('tekst koji dolazi kroz `${t(...)}` → zeleno', 0, vrti(stablo({
  js: { 'ui.js': "el.innerHTML = `<button class=\"x\">${t('nav.ok')}</button>`;\n" },
  osnovica: {},
})));

// ⑦ Sinkovi: `.textContent = '…'` i `showToast('…')` → PAD; kroz `t()` → zeleno.
slucaj('sink .textContent sa zakucanim tekstom → PAD', 1, vrti(stablo({
  js: { 's.js': "el.textContent = 'No items found';\n" },
  osnovica: {},
})), (o) => o.includes('No items found'));
slucaj('showToast sa zakucanim tekstom → PAD', 1, vrti(stablo({
  js: { 's.js': "showToast('Saved to cloud!');\n" },
  osnovica: {},
})), (o) => o.includes('Saved to cloud'));
slucaj('sink kroz t() → zeleno', 0, vrti(stablo({
  js: { 's.js': "el.textContent = t('msg.saved'); showToast(t('msg.saved'));\n" },
  osnovica: {},
})));

// ⑧ askConfirm: KLJUČ (argument t-a) se preskače, FALLBACK je nalaz (K5 razred).
slucaj('askConfirm: ključ preskočen, engleski fallback = nalaz → PAD', 1, vrti(stablo({
  js: { 'a.js': "askConfirm({ title: t('nav.ok', 'Delete everything?') });\n" },
  osnovica: {},
})), (o) => o.includes('Delete everything?') && !o.includes('"nav.ok"'));

// ⑨ PRESUDA ③: ključ kojeg NEMA u rječniku → PAD (i u t-pozivu i u data-i18n atributu).
slucaj('t() s nepostojećim ključem → PAD „ključ bez rječnika"', 1, vrti(stablo({
  js: { 'k.js': "el.textContent = t('studio.nema');\n" },
  osnovica: {},
})), (o) => o.includes('ključ bez rječnika') && o.includes('studio.nema'));
slucaj('data-i18n s nepostojećim ključem → PAD', 1, vrti(stablo({
  html: { 'k.html': '<h1 data-i18n="landing.nema">x</h1>' },
  osnovica: {},
})), (o) => o.includes('ključ bez rječnika') && o.includes('landing.nema'));

// ⑩ KONKATENIRANI literal koji počinje usred taga → sudi se kao ATRIBUT, ne „tekst u <?>".
slucaj('ostatak taga u konkatenaciji → PAD kao atribut title', 1, vrti(stablo({
  js: { 'c.js': "h = '<b data-x=\"' + esc(id) + '\" title=\"Drag to reorder\"><i class=\"fa\"></i></b>';\n" },
  osnovica: {},
})), (o) => o.includes('atribut title') && o.includes('Drag to reorder'));

// ⑪ Čegrtaljka: osnovica tolerira isti broj → zeleno; PAD broja → glasni RIJEŠENO.
slucaj('osnovica tolerira zatečeno → zeleno', 0, vrti(stablo({
  html: { 'stara.html': '<h1>Welcome</h1>' },
  osnovica: { 'stara.html': 1 },
})));
slucaj('pad broja → zeleno + glasni RIJEŠENO', 0, vrti(stablo({
  html: { 'stara.html': '<h1 data-i18n="nav.ok">Welcome</h1>' },
  osnovica: { 'stara.html': 1 },
})), (o) => o.includes('RIJEŠENO') && o.includes('stara.html'));

// ⑫ Rast broja u datoteci s osnovicom → PAD.
slucaj('rast iznad osnovice → PAD', 1, vrti(stablo({
  html: { 'stara.html': '<h1>Welcome</h1><p>Second hardcoded line</p>' },
  osnovica: { 'stara.html': 1 },
})), (o) => o.includes('stara.html'));

// ⑬ Nedostajuća osnovica RUŠI (exit 2) — brana koja šuti nije stroža nego pokvarena.
slucaj('bez osnovice → exit 2', 2, vrti(stablo({
  html: { 'x.html': '<p data-i18n="nav.ok">t</p>' },
  osnovica: null,
})), (o) => o.includes('i18n-baseline.json'));

// ⑭ Mjerač kaže koliko je dotaknuo.
slucaj('ispisuje „dotaknuto"', 0, vrti(stablo({
  html: { 'x.html': '<p data-i18n="nav.ok">t</p>' },
  osnovica: {},
})), (o) => /dotaknuto: \d+ html · \d+ js/.test(o));

console.log('\n' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
