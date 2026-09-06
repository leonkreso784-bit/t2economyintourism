/* eslint-disable no-console */
// ===== BIRAČ TEMA — NATPIS „Automatski" NEMA SUFIKS =====
// Pokreni: node tests/unit/theme-picker-label.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI (Leon, 2026-09-06, slika profila na tamnom telefonu: „glupo je imati ovu
// Automatic · Carbon, uopće ne kužim koji je smisao toga" → RASPORED §6/7, odluka (a)):
// F1/3 je gumbu „Automatski" dopisivao ` · ` + ime teme koju uređaj TRENUTNO bira, uz
// obrazloženje „inače je gumb obećanje bez sadržaja". Posljedica na tamnom uređaju:
// „Automatic · Carbon" stoji odmah do gumba „Carbon" i čita se kao PETA tema, dakle kao
// duplikat. Odluka: natpis je samo „Automatski", gumb OSTAJE (jedini način da se jednom
// napravljen izbor poništi i da se praćenje uređaja vrati), a što gumb radi kaže opis iznad
// birača (`profile.appearanceDesc`) — jedno mjesto, ne dva.
//
// Sufiks je lako vratiti „iz uslužnosti" (znanje o uređaju ostaje na `window`), a nijedna
// postojeća brana to ne bi vidjela: nijedan test do danas nije uopće crtao birač. Zato se
// ovdje mjeri ISPIS, a ne izvor — uz dvije statičke tvrdnje kao ogradu (izvor ne smije ni
// zvati `__sokratTemaUredjaja` ni lijepiti ` · `), i uz provjeru da rezervni (fallback)
// tekst opisa kaže isto što i rječnik, jer je opis od sada JEDINO objašnjenje gumba.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const PROFILE = fs.readFileSync(path.join(KORIJEN, 'js', 'profile.js'), 'utf8');
const I18N = fs.readFileSync(path.join(KORIJEN, 'js', 'i18n.js'), 'utf8');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== birač tema: natpis „Automatski" bez sufiksa (§6/7 a) ===\n');

// ---- rječnik iz js/i18n.js, čitan iz IZVORA (ne kopija vrijednosti u testu) ----
/** @returns {{en: string, hr: string}} */
function kljuc(ime) {
  const r = new RegExp("'" + ime.replace('.', '\\.') + "':\\s*\\{\\s*en:\\s*'((?:[^'\\\\]|\\\\.)*)'\\s*,\\s*hr:\\s*'((?:[^'\\\\]|\\\\.)*)'", 'm');
  const m = r.exec(I18N);
  assert.ok(m, 'ključ ' + ime + ' ne postoji u js/i18n.js');
  return { en: m[1], hr: m[2] };
}

const RJECNIK = {
  'profile.appearance': kljuc('profile.appearance'),
  'profile.appearanceDesc': kljuc('profile.appearanceDesc'),
  'profile.themeAuto': kljuc('profile.themeAuto'),
  'profile.themeAcademic': kljuc('profile.themeAcademic'),
  'profile.themeChalk': kljuc('profile.themeChalk'),
  'profile.themeMint': kljuc('profile.themeMint'),
  'profile.themeCarbon': kljuc('profile.themeCarbon')
};

/**
 * Svježa instanca `js/profile.js` u `vm`-pješčaniku: bez preglednika, bez mreže.
 * @param {{ jezik?: 'en'|'hr'|null, uredjaj?: string|null, izbor?: string }} o
 */
function crtaj(o) {
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout
  };
  sandbox.window = sandbox;               // golo ime i `window.x` = ista stvar, kao u pregledniku
  sandbox.document = {
    readyState: 'complete',
    getElementById: () => null,
    addEventListener: () => {},
    documentElement: { getAttribute: () => 'academic' }
  };
  sandbox.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  sandbox.SOKRAT_THEMES = ['academic', 'chalk', 'mint', 'carbon'];
  sandbox.getThemeChoice = () => (o.izbor || 'auto');
  // Znanje o uređaju OSTAJE dostupno (boot.js ga izvozi) — cigla tvrdi da ga birač ne troši.
  if (o.uredjaj) sandbox.__sokratTemaUredjaja = () => o.uredjaj;
  if (o.jezik) {
    sandbox.t = (k) => (RJECNIK[k] ? RJECNIK[k][o.jezik] : k);
  }
  vm.createContext(sandbox);
  vm.runInContext(PROFILE, sandbox, { filename: 'js/profile.js' });
  assert.strictEqual(typeof sandbox.themeCardHtml, 'function', 'themeCardHtml nije global u pješčaniku');
  return sandbox.themeCardHtml();
}

/** Natpis gumba `data-theme-pick="ime"` (tekst zadnjeg `<span>` unutar gumba). */
function natpis(html, ime) {
  const r = new RegExp('<button[^>]*data-theme-pick="' + ime + '"[\\s\\S]*?<\\/button>');
  const m = r.exec(html);
  assert.ok(m, 'nema gumba za temu ' + ime);
  const spans = m[0].match(/<span[^>]*>([^<]*)<\/span>/g) || [];
  const zadnji = spans[spans.length - 1] || '';
  return zadnji.replace(/<[^>]*>/g, '');
}

// ---------------------------------------------------------- ① tamni uređaj, EN
{
  const html = crtaj({ jezik: 'en', uredjaj: 'carbon' });

  test('EN · tamni uređaj: natpis je točno „Automatic", bez sufiksa', () => {
    assert.strictEqual(natpis(html, 'auto'), RJECNIK['profile.themeAuto'].en);
  });

  test('EN · tamni uređaj: u cijelom biraču nema separatora „ · "', () => {
    assert.ok(html.indexOf(' · ') < 0, 'birač i dalje lijepi sufiks: ' + html);
  });

  test('EN · tamni uređaj: natpis „Automatic" ne spominje Carbon', () => {
    assert.ok(natpis(html, 'auto').indexOf(RJECNIK['profile.themeCarbon'].en) < 0);
  });

  test('gumb „Automatski" OSTAJE (jedini način da se izbor poništi)', () => {
    assert.ok(/data-theme-pick="auto"/.test(html));
    assert.ok(/theme-option-swatch--auto/.test(html), 'auto je ostao bez swatcha');
  });

  test('birač nudi auto + sve teme iz SOKRAT_THEMES (5 gumba)', () => {
    assert.strictEqual((html.match(/data-theme-pick="/g) || []).length, 5);
  });

  test('svaka tema nosi SVOJE ime iz rječnika (sufiks nije pojeo ostale)', () => {
    assert.strictEqual(natpis(html, 'academic'), RJECNIK['profile.themeAcademic'].en);
    assert.strictEqual(natpis(html, 'carbon'), RJECNIK['profile.themeCarbon'].en);
  });

  test('aktivan je IZBOR, ne primijenjena tema: aria-pressed samo na „auto"', () => {
    assert.ok(/data-theme-pick="auto" aria-pressed="true"/.test(html));
    assert.strictEqual((html.match(/aria-pressed="true"/g) || []).length, 1);
  });
}

// ---------------------------------------------------------- ② tamni uređaj, HR
{
  const html = crtaj({ jezik: 'hr', uredjaj: 'carbon' });

  test('HR · tamni uređaj: natpis je točno „Automatski"', () => {
    assert.strictEqual(natpis(html, 'auto'), RJECNIK['profile.themeAuto'].hr);
  });

  test('HR · tamni uređaj: natpis ne spominje „Ugljen"', () => {
    assert.ok(natpis(html, 'auto').indexOf(RJECNIK['profile.themeCarbon'].hr) < 0);
    assert.ok(html.indexOf(' · ') < 0);
  });
}

// ------------------------------------------- ③ svijetli uređaj i uređaj bez odgovora
{
  test('svijetli uređaj: natpis je isti — sufiksa nema ni ondje gdje je bio bezopasan', () => {
    assert.strictEqual(natpis(crtaj({ jezik: 'hr', uredjaj: 'academic' }), 'auto'), RJECNIK['profile.themeAuto'].hr);
  });

  test('bez `__sokratTemaUredjaja` (stranica bez boot.js): isti natpis, bez pada', () => {
    assert.strictEqual(natpis(crtaj({ jezik: 'en', uredjaj: null }), 'auto'), RJECNIK['profile.themeAuto'].en);
  });

  test('izabran „carbon": aria-pressed seli na carbon, natpis auto ostaje čist', () => {
    const html = crtaj({ jezik: 'hr', uredjaj: 'carbon', izbor: 'carbon' });
    assert.ok(/data-theme-pick="carbon" aria-pressed="true"/.test(html));
    assert.ok(/data-theme-pick="auto" aria-pressed="false"/.test(html));
    assert.strictEqual(natpis(html, 'auto'), RJECNIK['profile.themeAuto'].hr);
  });
}

// -------------------------------------- ④ bez i18n.js: rezervni tekstovi (pt fallback)
{
  const html = crtaj({ jezik: null, uredjaj: 'carbon' });

  test('bez rječnika: natpis pada na engleski original, i dalje bez sufiksa', () => {
    assert.strictEqual(natpis(html, 'auto'), RJECNIK['profile.themeAuto'].en);
    assert.ok(html.indexOf(' · ') < 0);
  });

  test('opis birača objašnjava „Automatski" i u rezervnom tekstu (jedino objašnjenje gumba)', () => {
    assert.ok(html.indexOf(RJECNIK['profile.appearanceDesc'].en) >= 0,
      'rezervni opis se razišao s rječnikom — u ispisu nema: ' + RJECNIK['profile.appearanceDesc'].en);
  });
}

// ------------------------------------------------- ⑤ rječnik: opis nosi značenje gumba
{
  test('rječnik: `profile.appearanceDesc` spominje uređaj na OBA jezika', () => {
    assert.ok(/device/i.test(RJECNIK['profile.appearanceDesc'].en), 'EN opis ne spominje uređaj');
    assert.ok(/ure(đ|dj)aj/i.test(RJECNIK['profile.appearanceDesc'].hr), 'HR opis ne spominje uređaj');
  });

  test('rječnik: `profile.themeAuto` je jedna riječ, bez separatora', () => {
    assert.ok(RJECNIK['profile.themeAuto'].en.indexOf('·') < 0);
    assert.ok(RJECNIK['profile.themeAuto'].hr.indexOf('·') < 0);
  });
}

// -------------------------------------------------- ⑥ ograda u izvoru (da se ne vrati)
{
  test('izvor: `js/profile.js` više ne pita `__sokratTemaUredjaja`', () => {
    assert.ok(PROFILE.indexOf('__sokratTemaUredjaja(') < 0,
      'birač opet čita temu uređaja — sufiks se vratio ili ga netko sprema vratiti');
  });

  test('izvor: `js/profile.js` ne lijepi natpis separatorom " · "', () => {
    assert.ok(!/'\s*·\s*'/.test(PROFILE), 'u izvoru je opet literal " · "');
  });
}

console.log('\n' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
