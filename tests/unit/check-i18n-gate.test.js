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

// ⑤b `title` (F3/2): mehanizam `data-i18n-title` postoji od gumba za jezik u traci.
// Do tada je title bio nalaz BEZ lijeka — sad s ključem prolazi, bez njega i dalje pada,
// a ključ kojeg nema u rječniku pada kao i svaki drugi (presuda ③).
slucaj('title bez data-i18n-title → PAD', 1, vrti(stablo({
  html: { 't1.html': '<button title="Close panel">x</button>' },
  osnovica: {},
})), (o) => o.includes('atribut title') && o.includes('Close panel'));
slucaj('title s data-i18n-title i postojećim ključem → zeleno', 0, vrti(stablo({
  html: { 't2.html': '<button title="Close panel" data-i18n-title="nav.ok"><i class="fa"></i></button>' },
  osnovica: {},
})));
slucaj('data-i18n-title s nepostojećim ključem → PAD „ključ bez rječnika"', 1, vrti(stablo({
  html: { 't3.html': '<button title="Close panel" data-i18n-title="topbar.nema"><i class="fa"></i></button>' },
  osnovica: {},
})), (o) => o.includes('ključ bez rječnika') && o.includes('topbar.nema'));

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

// ⑦b F3/2 cigla 4a: `setAttribute` sudi CIJELI drugi argument, ne samo literal odmah iza
// zareza. Do tada je `uvjet ? 'A' : 'B'` prolazio — tako su „My profile"/„Sign in" na gumbu
// za prijavu i „Hide password" na oku lozinke ostali engleski na hrvatskom sučelju.
slucaj('setAttribute s uvjetnim izrazom i zakucanim tekstom → PAD (obje grane)', 1, vrti(stablo({
  js: { 'u.js': "btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');\n" },
  osnovica: {},
})), (o) => o.includes('Close menu') && o.includes('Open menu'));
slucaj('setAttribute s uvjetnim izrazom kroz t() → zeleno', 0, vrti(stablo({
  js: { 'u.js': "btn.setAttribute('aria-label', open ? t('nav.ok') : t('msg.saved'));\n" },
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
// ⑨b Kućni helperi `pt` (profile.js) i `at` (auth.js) nose ključ jednako kao `t`/`mt` — do
// F3/2 cigle 4a presuda ③ ih nije znala, pa bi ključ bez rječnika ondje tiho pokazao engleski.
slucaj('pt()/at() s nepostojećim ključem → PAD „ključ bez rječnika"', 1, vrti(stablo({
  js: { 'h.js': "x = pt('profile.nema', 'Profile'); y = at('auth.nema', 'Sign in');\n" },
  osnovica: {},
})), (o) => o.includes('profile.nema') && o.includes('auth.nema'));
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

// ⑯ JEZIČNI BLOKOVI (F3/1, Leon 16.09.: pravne stranice nose oba jezika u stranici).
// Tekst u `.jezik[lang]` bloku je preveden SAMO ako uz njega stoji blok drugog jezika ISTOG
// oblika — inače bi „omotaj u lang=en" bio način da engleski prođe branu bez prijevoda.
const EN = '<div class="jezik" lang="en"><h2>Privacy</h2><p>We <strong>never</strong> sell data. <a href="x">More</a></p></div>';
const HR = '<div class="jezik" lang="hr"><h2>Privatnost</h2><p>Podatke <strong>nikad</strong> ne prodajemo. <a href="x">Više</a></p></div>';
slucaj('par EN+HR istog oblika → zeleno (i inline <strong> smije ići)', 0, vrti(stablo({
  html: { 'par.html': EN + HR },
  osnovica: {},
})));
slucaj('EN blok BEZ hrvatskog para → PAD, tekst prijavljen', 1, vrti(stablo({
  html: { 'sam.html': EN },
  osnovica: {},
})), (o) => o.includes('sam.html') && o.includes('never') && o.includes('bez para'));
slucaj('HR blok bez odlomka koji EN ima → PAD „oblik"', 1, vrti(stablo({
  html: { 'oblik.html': EN.replace('</p></div>', '</p><p>Extra paragraph.</p></div>') + HR },
  osnovica: {},
})), (o) => o.includes('oblik.html') && o.includes('oblik se razlikuje'));
slucaj('HR blok bez poveznice koju EN ima → PAD „oblik"', 1, vrti(stablo({
  html: { 'link.html': EN + HR.replace(' <a href="x">Više</a>', '') },
  osnovica: {},
})), (o) => o.includes('link.html') && o.includes('oblik se razlikuje'));
slucaj('dva EN bloka zaredom (bez HR između) → PAD', 1, vrti(stablo({
  html: { 'dva.html': EN + EN },
  osnovica: {},
})), (o) => o.includes('dva.html') && o.includes('bez para'));
slucaj('HR blok = doslovna kopija engleskog → PAD „kopija"', 1, vrti(stablo({
  html: { 'kopija.html': EN + EN.replace('lang="en"', 'lang="hr"') },
  osnovica: {},
})), (o) => o.includes('kopija.html') && o.includes('doslovna kopija') && o.includes('never'));
slucaj('`lang` bez klase `jezik` (npr. citat) NIJE blok → tekst se sudi normalno', 1, vrti(stablo({
  html: { 'citat.html': '<p lang="en">Quoted text</p>' },
  osnovica: {},
})), (o) => o.includes('Quoted text'));

// ⑭ Mjerač kaže koliko je dotaknuo.
slucaj('ispisuje „dotaknuto"', 0, vrti(stablo({
  html: { 'x.html': '<p data-i18n="nav.ok">t</p>' },
  osnovica: {},
})), (o) => /dotaknuto: \d+ html · \d+ js/.test(o));

console.log('\n' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
