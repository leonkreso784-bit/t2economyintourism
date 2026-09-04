/* eslint-disable no-console */
// ===== Node unit test za js/loader.js (učitavanje po ruti) =====
// Pokreni: node tests/unit/loader-packages.test.js
//
// ŠTO OVDJE STOJI NA KOCKI: cigla „učitavanje po ruti" premješta jedanaest skripti iz markupa
// u manifest koji nitko ne vidi dok ne otvori lekciju. Svaki kvar u toj selidbi je TIH —
// stranica se učita, landing radi, a razlomljeno je nešto što se vidi tek dva klika dalje.
// Zato su ove tvrdnje statične i grube: postoji li datoteka, je li navedena DVAPUT, zove li
// netko paket koji ne postoji, i je li token ostao zapisan ondje gdje ga bump ne doseže.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== loader / paketi ===\n');

const ROOT = path.join(__dirname, '..', '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const src = rd('js/loader.js');
const win = {};
new Function('window', src)(win);
const L = win.SokratLoad;
const PAKETI = L.PAKETI;
const svi = Object.values(PAKETI).flat();
const nasi = svi.filter((s) => typeof s === 'string');
const vanjski = svi.filter((s) => typeof s !== 'string');

test('loader se izvozi na window s manifestom', function () {
  assert.strictEqual(typeof L.paket, 'function');
  assert.ok(PAKETI && Object.keys(PAKETI).length >= 1, 'manifest je prazan');
});

test('svaka navedena datoteka POSTOJI na disku', function () {
  const nema = nasi.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  assert.deepStrictEqual(nema, [], 'paket pokazuje na nepostojeću datoteku: ' + nema.join(', '));
});

test('nijedna datoteka nije u DVA svijeta (markup + paket)', function () {
  // Dvostruko učitavanje ne bi puklo glasno: skripta bi se izvršila dvaput, a `const` na
  // vrhu bi bacio tek u konzoli. Zato se tvrdi ovdje, a ne čeka na ekranu.
  const html = rd('index.html');
  const uMarkupu = new Set([...html.matchAll(/<script[^>]*\ssrc="((?:js|data)\/[^"?]+)/g)].map((m) => m[1]));
  const sudari = nasi.filter((f) => uMarkupu.has(f));
  assert.deepStrictEqual(sudari, [], 'i u markupu i u paketu: ' + sudari.join(', '));
});

test('nijedna datoteka nije u DVA PAKETA po istom imenu bez razloga (dedup je namjeran)', function () {
  // Ista datoteka SMIJE biti u više paketa (loader dedupira po URL-u) — ovo samo ISPISUJE
  // takve slučajeve da preklapanje bude odluka, a ne slučaj.
  const broj = {};
  nasi.forEach((f) => { broj[f] = (broj[f] || 0) + 1; });
  const dijeljene = Object.keys(broj).filter((f) => broj[f] > 1);
  if (dijeljene.length) console.log('      (dijele je paketi: ' + dijeljene.join(', ') + ')');
  assert.ok(true);
});

test('svako ime paketa koje kod TRAŽI postoji u manifestu', function () {
  const imena = new Set(Object.keys(PAKETI));
  const trazena = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) {
    if (!f.endsWith('.js')) continue;
    for (const m of rd('js/' + f).matchAll(/SokratLoad\.paket\('([^']+)'\)/g)) trazena.push({ f: 'js/' + f, ime: m[1] });
  }
  assert.ok(trazena.length > 0, 'nitko ne traži nijedan paket — cigla nije ožičena');
  const krivi = trazena.filter((t) => !imena.has(t.ime));
  assert.deepStrictEqual(krivi.map((t) => t.f + ' → ' + t.ime), [], 'tipfeler u imenu paketa');
});

test('svaki paket iz manifesta netko i TRAŽI (mrtav paket = mrtav kod)', function () {
  const kod = fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js'))
    .map((f) => rd('js/' + f)).join('\n');
  const mrtvi = Object.keys(PAKETI).filter((ime) => kod.indexOf("SokratLoad.paket('" + ime + "')") < 0);
  assert.deepStrictEqual(mrtvi, [], 'paket koji nitko ne učitava');
});

test('loader NE nosi zapisan `?v=` token (bump ga u js/** ne doseže)', function () {
  // BUG-004 u novom ruhu: `npm run bump` prepisuje tokene u *.html/css/manifest, ne u js/**.
  // Token zapisan ovdje ostario bi tiho, a posjetitelj bi zauvijek dobivao staru skriptu.
  assert.ok(!/['"][^'"]*\?v=\d+/.test(src), 'u loaderu stoji zakucan ?v= token');
  assert.ok(/document\.currentScript/.test(src), 'token se ne čita iz vlastite adrese');
});

test('loader je u markupu PRIJE navigation.js (ondje se paket traži)', function () {
  const html = rd('index.html');
  const a = html.indexOf('js/loader.js');
  const b = html.indexOf('js/navigation.js');
  assert.ok(a > -1, 'js/loader.js nije u index.html');
  assert.ok(b > -1 && a < b, 'loader mora stajati prije navigation.js');
});

test('redoslijed unutar paketa je onaj koji kod traži (jezgra vježbi prije vježbi)', function () {
  const e = PAKETI.exercises;
  assert.ok(e.indexOf('js/exercises-core.js') < e.indexOf('js/exercises.js'), 'exercises.js prije jezgre');
  assert.ok(e.indexOf('js/acc-kernel.js') < e.indexOf('js/exercises.js'), 'exercises.js prije acc-kernela');
});

test('KaTeX auto-render se izvršava POSLIJE katexa i nijedan nije `usporedno`', function () {
  // ⚠️ IZMJERENI KVAR, ne teorija: s `usporedno` (= `script.async`) redoslijed određuje mreža.
  // `auto-render` traži da `katex` već postoji, pa je otprilike svaki drugi put stizao prvi i
  // tiho se rušio unutar `renderMath`-ovog `try/catch` — lekcija bi se otvorila, a formule
  // ostale sirov LaTeX (26 formula na referentnom stablu, 0 na grani). U markupu je poredak
  // jamčio `defer`; ovdje ga jamči `async = false`, dakle IZOSTANAK ove zastavice.
  const s = PAKETI.study;
  const i = s.findIndex((x) => typeof x !== 'string' && /katex\.min\.js/.test(x.src));
  const j = s.findIndex((x) => typeof x !== 'string' && /auto-render/.test(x.src));
  assert.ok(i > -1 && j > -1, 'KaTeX je ispao iz paketa `study`');
  assert.ok(i < j, 'auto-render stoji PRIJE katexa — u trenutku izvršavanja `katex` ne postoji');
  assert.ok(!s[i].usporedno && !s[j].usporedno, 'KaTeX skripte ne smiju biti `usporedno` — redoslijed bi odredila mreža');
});

test('vanjski podresursi u paketu imaju SRI i pinanu verziju', function () {
  assert.ok(vanjski.length > 0, 'nijedan vanjski resurs — KaTeX/DOMPurify su ispali iz manifesta');
  for (const v of vanjski) {
    assert.ok(/^sha\d{3}-/.test(v.sri || ''), 'bez SRI: ' + v.src);
    assert.ok(/\/\d+\.\d+\.\d+\//.test(v.src), 'bez verzije u URL-u: ' + v.src);
    assert.ok(v.neobavezno === true, 'vanjski resurs mora biti `neobavezno` (pad CDN-a ne ruši lekciju): ' + v.src);
  }
});

// ── REFERENCE PREKO GRANICE PAKETA ──────────────────────────────────────────────────────────
//
// ⚠️ OVO JE JEDINI KVAR KOJI SELIDBA STVARNO PROIZVODI, i proizveo ga je odmah: `progress.js`
// (paket `study`) čitao je `blindMapState` iz `blind-map.js` (paket `blind-map`), pa je svaka
// lekcija geografije bacala ReferenceError prije nego je itko dotaknuo kartu. Dok su sve
// skripte stajale u markupu, takva referenca je bila ISPRAVNA — granica koju krši nastala je
// tek s ovom ciglom, i nijedan zatečeni gate je ne vidi.
//
// Pravilo: ime deklarirano u jednom paketu ne smije se GOLO spominjati iz drugog paketa ni iz
// jezgre. Zaštićeno (`typeof X` ili `window.X`) je uvijek u redu. Nezaštićeno mora biti
// IMENOVANO ovdje, s razlogom — i popis se provjerava u oba smjera, pa zastarjeli unos pada
// jednako kao nova referenca.
const DOZVOLJENO = {
  // Sve niže se zove iz `initStudyPage` / `switchSection` / `initNavigation`, dakle TEK NAKON
  // `await SokratLoad.paket(...)`. Ovdje `typeof` guard ne bi bio oprez nego skrivanje: ako
  // paket ne stigne, lekcija JEST razlomljena i to se mora vidjeti kao greška, a ne kao
  // stranica na kojoj tiho ne radi pola gumba.
  'js/navigation.js': [
    'initFlashcards', 'resetQuiz', 'initFill', 'renderLearnContent', 'initLearnImageModal',
    'cleanupLearnContentForMobile', 'updateCategoryButtons', 'updateLearnFilters',
    'updateQuizCategories', 'renderProgressPage', 'updateHomeStats', 'initBlindMap'
  ]
};

function bezKomentaraIStringova(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''").replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
}

function prekoGranice() {
  const paketOd = {};
  for (const ime of Object.keys(PAKETI)) {
    for (const f of PAKETI[ime]) if (typeof f === 'string') paketOd[f] = ime;
  }
  const html = rd('index.html');
  for (const m of html.matchAll(/<script[^>]*\ssrc="(js\/[^"?]+)/g)) paketOd[m[1]] = 'jezgra';

  const vlasnik = {};                                  // ime → {f, paket}
  for (const f of Object.keys(paketOd)) {
    if (paketOd[f] === 'jezgra') continue;             // jezgra je uvijek prisutna
    const s = bezKomentaraIStringova(rd(f));
    for (const m of s.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) vlasnik[m[1]] = { f, p: paketOd[f] };
    for (const m of s.matchAll(/^(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm)) vlasnik[m[1]] = { f, p: paketOd[f] };
  }

  const gole = [];
  for (const f of Object.keys(paketOd)) {
    const s = bezKomentaraIStringova(rd(f));
    for (const ime of Object.keys(vlasnik)) {
      const v = vlasnik[ime];
      if (v.f === f || v.p === paketOd[f] || ime.length < 4) continue;
      const bez$ = ime.replace(/\$/g, '\\$');
      if (!new RegExp('(^|[^.\\w$])' + bez$ + '\\b').test(s)) continue;
      if (new RegExp('typeof\\s+' + bez$ + '\\b').test(s)) continue;
      if (new RegExp('window\\.' + bez$ + '\\b').test(s)) continue;
      gole.push({ f, ime, iz: v.p });
    }
  }
  return gole;
}

test('nijedna NOVA gola referenca preko granice paketa (osnovica ih imenuje)', function () {
  const gole = prekoGranice();
  const nove = gole.filter((g) => !(DOZVOLJENO[g.f] || []).includes(g.ime));
  assert.deepStrictEqual(
    nove.map((g) => g.f + ' → ' + g.ime + ' (paket ' + g.iz + ')'), [],
    'ime iz drugog paketa se doseže golo — u trenutku poziva ga možda još nema'
  );
});

test('osnovica ne sadrži zastarjele unose (popis se čisti sam)', function () {
  const gole = prekoGranice();
  const mrtvi = [];
  for (const f of Object.keys(DOZVOLJENO)) {
    for (const ime of DOZVOLJENO[f]) {
      if (!gole.some((g) => g.f === f && g.ime === ime)) mrtvi.push(f + ' → ' + ime);
    }
  }
  assert.deepStrictEqual(mrtvi, [], 'unos u osnovici koji više ne postoji — makni ga');
});

console.log('\nloader: ' + passed + ' prošlo, ' + failed + ' palo\n');
process.exit(failed ? 1 : 0);
