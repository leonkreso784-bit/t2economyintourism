/* eslint-disable no-console */
// ===== S1 GATE — CI STVARNO VRTI JEDINU MJERU ŽICE =====
// Pokreni: node tests/unit/ci-tajne.test.js
//
// ── ZAŠTO POSTOJI ───────────────────────────────────────────────────────────────────────
// `tests/profile-jezik.authed.spec.js` ③ je jedina tvrdnja koja mjeri ŽICU: da tijelo
// `PUT /auth/v1/user` stvarno nosi `current_password`. Zakucani `supabase-js@2.110.8` to polje
// NE spominje — prolazi samo zato što `updateUser` cijeli objekt pošalje kao tijelo. SDK koji
// sutra počne filtrirati nepoznata polja tiho otključava bravu iz ①/2b.
//
// ⚠️ IZMJERENO 2026-09-24 i gore je od zapisanog. Zapis je tvrdio da se ta tvrdnja preskače
// jer joj CI ne prosljeđuje `STAGING_TEST_ADMIN_PASSWORD`. Mjera preko GitHub API-ja pokazala
// je da korak „Run authenticated suite" traje **0 sekundi u zadnjih 12 vrtnji** (`e23d658` …
// `921cfbc`): bio je napisan kao „ako je `TEST_ADMIN_EMAIL` prazan → exit 0", a taj secret
// nikad nije postavljen. Dakle nije se preskakala JEDNA tvrdnja nego **cijeli authed suite —
// 34 datoteke, ni na jednom commitu.** Svaka vrtnja pritom potroši 25 s na Chromium pa ga ne
// upotrijebi. Zeleno je značilo „ništa nisam izmjerio", a to se ne razlikuje od „sve je dobro".
//
// ⚠️ ZAŠTO JE OVO UNIT-BRANA, A NE „PAZIT ĆEMO". Prethodna zaštita bila je KOMENTAR u ci.yml-u
// koji opisuje mehanizam koji nikad nije proradio, i rečenica u TESTING.md („Za aktivaciju:
// dodaj ta dva repo-secreta") koja je stajala neispunjena 2,5 mjeseca. Rečenica u dokumentu ne
// sprječava ništa (ADR-027, BUG-023) — `if` u kodu ili test sprječavaju.
//
// ⚠️ NIJEDAN POPIS OVDJE NIJE PISAN RUKOM. Imena tajni dolaze iz `scripts/ci-tajne.js`, koji ih
// ČITA S DISKA iz `tests/**` + `playwright.config.js`; popis jobova koje roll-up mora pokrivati
// čita se iz same `ci.yml`. Ručni popis stari u OBA smjera, pa se sudi i propušteni i MRTAV unos.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const tajne = require('../../scripts/ci-tajne.js');

const KORIJEN = path.join(__dirname, '..', '..');
const CI_PUT = path.join(KORIJEN, '.github', 'workflows', 'ci.yml');
const HOOK_PUT = path.join(KORIJEN, '.githooks', 'pre-push');
const SKRIPTA = path.join(KORIJEN, 'scripts', 'ci-tajne.js');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== S1 — CI vrti mjeru žice (ci-tajne) ===\n');

// ── čitanje ci.yml ──────────────────────────────────────────────────────────────────────
// ⚠️ KOMENTARI SE ODSTRANJUJU PRIJE SVAKE PRETRAGE. Bez toga bi ova brana pala na VLASTITOM
// komentaru u ci.yml-u, koji stari obrazac (`exit 0`) citira da bi objasnio zašto ga nema —
// isti razred greške koji je `axe-gate-usage.test.js` platio na prvom pokretanju.
// Odstranjuju se samo PUNI redovi komentara (prvi neprazni znak je `#`), da `#` unutar
// navodnika ostane netaknut.
const ciSirovo = fs.readFileSync(CI_PUT, 'utf8');
const ciRedci = ciSirovo.split(/\r?\n/);
const ciKod = ciRedci.filter((l) => !/^\s*#/.test(l)).join('\n');

/** Imena jobova = ključevi na uvlaci 2 ispod `jobs:`. Pada zatvoreno ako `jobs:` nema. */
function joboviIzCija() {
  if (!/^jobs:\s*$/m.test(ciKod)) throw new Error('ci.yml: nema `jobs:` — brana ne zna što mjeri');
  const imena = [];
  let uJobs = false;
  for (const l of ciKod.split('\n')) {
    if (/^jobs:\s*$/.test(l)) { uJobs = true; continue; }
    if (!uJobs) continue;
    if (/^\S/.test(l)) break;                       // izašli iz `jobs:` bloka
    const m = l.match(/^ {2}([a-z][a-z0-9_-]*):\s*$/);
    if (m) imena.push(m[1]);
  }
  if (!imena.length) throw new Error('ci.yml: nijedan job nije prepoznat — parser ili datoteka su se razišli');
  return imena;
}

/** Blok jednog joba: od njegovog ključa do sljedećeg ključa na uvlaci 2. Pada ako joba nema. */
function blokJoba(ime) {
  const redci = ciKod.split('\n');
  const start = redci.findIndex((l) => new RegExp('^ {2}' + ime + ':\\s*$').test(l));
  if (start < 0) throw new Error('ci.yml: job `' + ime + '` ne postoji');
  let end = redci.length;
  for (let i = start + 1; i < redci.length; i++) {
    if (/^\S/.test(redci[i]) || /^ {2}[a-z][a-z0-9_-]*:\s*$/.test(redci[i])) { end = i; break; }
  }
  return redci.slice(start, end).join('\n');
}

const JOBOVI = joboviIzCija();
const BLOK_AUTHED = blokJoba('authed');

// ── ① popis se stvarno nabraja, i nije prazan ───────────────────────────────────────────
test('nabrajanje s diska nešto nađe (brana ne smije proći na nuli)', () => {
  const n = tajne.nabrojiIzTestova().size;
  if (n < 5) throw new Error('nađeno samo ' + n + ' imena — nabrajanje je puklo, a ne da tajni nema');
  if (!tajne.OBAVEZNE.length) throw new Error('OBAVEZNE je prazan → `--zahtijevaj` ne bi tražio ništa');
});

test('svako ime koje testovi traže je SVRSTANO (nova tajna je vidljiva)', () => {
  const n = tajne.nesvrstane();
  if (n.length) {
    throw new Error(
      'nesvrstane tajne: ' + n.join(', ') + '\n      → dodaj ih u OBAVEZNE (CI ih mora imati), ' +
      'IMENOVANE_IZNIMKE (svjesno ih nema, uz razlog I cijenu) ili NISU_TAJNE u scripts/ci-tajne.js'
    );
  }
});

test('nijedan svrstani unos nije MRTAV (popis ne stari u drugom smjeru)', () => {
  const m = tajne.mrtve();
  if (m.length) throw new Error('svrstano ali ih nitko ne traži: ' + m.join(', '));
});

test('svaka imenovana iznimka nosi RAZLOG i CIJENU', () => {
  for (const [ime, o] of Object.entries(tajne.IMENOVANE_IZNIMKE)) {
    if (!o || !o.zasto || o.zasto.length < 20) throw new Error(ime + ': nema napisan razlog');
    if (!o.cijena || o.cijena.length < 8) throw new Error(ime + ': nema napisanu cijenu (što se preskače)');
  }
});

// ── ② ci.yml prosljeđuje TOČNO ono što testovi traže ────────────────────────────────────
/** Sve `IME: ${{ secrets.X }}` veze u zadanom bloku. */
function proslijedene(blok) {
  const parovi = [...blok.matchAll(/([A-Z][A-Z_0-9]*):\s*\$\{\{\s*secrets\.([A-Z][A-Z_0-9]*)\s*\}\}/g)];
  return parovi.map(([, env, secret]) => ({ env, secret }));
}

test('authed job prosljeđuje SVE obavezne tajne (nijedna ne fali)', () => {
  const imena = new Set(proslijedene(BLOK_AUTHED).map((p) => p.env));
  const fale = tajne.OBAVEZNE.filter((t) => !imena.has(t));
  if (fale.length) {
    throw new Error(
      'authed job ne prosljeđuje: ' + fale.join(', ') +
      '\n      → spec koji ih traži bi se u CI-ju TIHO PRESKOČIO (to je S1)'
    );
  }
});

test('authed job ne prosljeđuje NIŠTA VIŠE (mrtav unos = secret koji ničemu ne služi)', () => {
  const dopusteno = new Set(tajne.OBAVEZNE);
  const viska = [...new Set(proslijedene(BLOK_AUTHED).map((p) => p.env))].filter((i) => !dopusteno.has(i));
  if (viska.length) throw new Error('prosljeđuje se a nije obavezno: ' + viska.join(', '));
});

test('ime varijable i ime secreta se PODUDARAJU (ne šalje se kriva tajna u pravo polje)', () => {
  for (const { env, secret } of proslijedene(BLOK_AUTHED)) {
    if (env !== secret) throw new Error(env + ' dobiva secrets.' + secret + ' — različita imena');
  }
});

test('authed job više NE PRESKAČE tiho (nema `exit 0` grane)', () => {
  if (/\bexit\s+0\b/.test(BLOK_AUTHED)) {
    throw new Error('u authed jobu opet stoji `exit 0` — to je točno ponašanje koje je dalo 12 praznih zelenih vrtnji');
  }
});

test('authed job PRVO izvede provjeru tajni (`ci-tajne.js --zahtijevaj`)', () => {
  if (!/scripts\/ci-tajne\.js\s+--zahtijevaj/.test(BLOK_AUTHED)) {
    throw new Error('authed job ne poziva `node scripts/ci-tajne.js --zahtijevaj` → prazna tajna bi opet prošla tiho');
  }
  const iProvjera = BLOK_AUTHED.indexOf('--zahtijevaj');
  const iSuite = BLOK_AUTHED.indexOf('npm run test:authed');
  if (iSuite < 0) throw new Error('authed job ne vrti `npm run test:authed`');
  if (iProvjera > iSuite) throw new Error('provjera tajni stoji IZA suite-a → suite bi krenuo pa se raspao usred');
});

// ── ③ roll-up pokriva SVE jobove, i to se čita iz ci.yml ────────────────────────────────
const BLOK_GATE = blokJoba('gate');

test('roll-up `gate` job postoji i nabraja SVE ostale jobove', () => {
  const m = BLOK_GATE.match(/needs:\s*\[([^\]]*)\]/);
  if (!m) throw new Error('gate job nema `needs: [...]`');
  const nabrojani = new Set(m[1].split(',').map((s) => s.trim()).filter(Boolean));
  const ocekivani = JOBOVI.filter((j) => j !== 'gate');
  const fale = ocekivani.filter((j) => !nabrojani.has(j));
  if (fale.length) {
    throw new Error(
      'gate ne pokriva jobove: ' + fale.join(', ') +
      '\n      → njihov pad ne bi obojio required-provjeru. Popis se čita iz ci.yml, ' +
      'pa novi job MORA biti dodan i u `needs`.'
    );
  }
  const viska = [...nabrojani].filter((j) => !ocekivani.includes(j));
  if (viska.length) throw new Error('gate nabraja job koji ne postoji: ' + viska.join(', '));
});

test('gate SUDI ishod svakog joba iz `needs` (ne samo ovisi o njemu)', () => {
  for (const job of JOBOVI.filter((j) => j !== 'gate')) {
    if (!new RegExp('needs\\.' + job + '\\.result').test(BLOK_GATE)) {
      throw new Error('gate ne čita `needs.' + job + '.result` → taj job ne bi utjecao na presudu');
    }
    if (!new RegExp('"' + job + ':\\$R_').test(BLOK_GATE)) {
      throw new Error('gate ne provlači `' + job + '` kroz presudu (petlja ga preskače)');
    }
  }
});

test('gate ima `if: always()` (inače se na padu SAM preskoči i required-provjera visi)', () => {
  if (!/^\s*if:\s*always\(\)\s*$/m.test(BLOK_GATE)) {
    throw new Error('gate nema `if: always()` → na padu ovisnosti bi bio `skipped`, a to u GitHubu blokira PR kao „pending"');
  }
});

test('gate sudi na `!= success` (cancelled/skipped nisu prošli)', () => {
  if (!/!=\s*"?success/.test(BLOK_GATE)) {
    throw new Error('gate ne sudi na `!= success` → `cancelled`/`skipped` bi prošli kao uspjeh');
  }
});

// ── ④ pre-push hook (Leonova odluka 2026-09-24: punih 154 tvrdnji na main) ──────────────
const HOOK = fs.readFileSync(HOOK_PUT, 'utf8').split(/\r?\n/).filter((l) => !/^\s*#/.test(l)).join('\n');

test('pre-push na main vrti authed suite I provjeru tajni', () => {
  if (!/npm run test:authed/.test(HOOK)) throw new Error('hook ne vrti `npm run test:authed`');
  if (!/ci-tajne\.js\s+--zahtijevaj/.test(HOOK)) throw new Error('hook ne provjerava tajne → suite bi se tiho preskočio');
  if (!/refs\/heads\/main/.test(HOOK)) throw new Error('hook ne razlikuje odredište main');
});

test('pre-push pada na padu authed suite-a (ne nastavlja dalje)', () => {
  if (!/if\s+!\s+npm run test:authed;\s*then/.test(HOOK)) {
    throw new Error('izlazni kod `npm run test:authed` se ne provjerava → pad bi prošao kao uspjeh');
  }
  const poslije = HOOK.slice(HOOK.indexOf('npm run test:authed'));
  if (!/exit 1/.test(poslije)) throw new Error('nakon pada authed suite-a hook ne izlazi s 1');
});

// ── ⑤ OBRNUTA PROVJERA — skripta se STVARNO IZVODI, ne čita ─────────────────────────────
// ⚠️ Ovo je jezgra brane. Sve gore sudi TEKST datoteka; ovdje se `--zahtijevaj` pusti u
// zasebnom procesu s podmetnutom okolinom i traži se točan izlazni kod. Bez ovoga brana tvrdi
// da provjera postoji, a ne da RADI — a upravo je „postoji ali ne radi" bio cijeli kvar.
function pusti(okolina) {
  try {
    const out = execFileSync(process.execPath, [SKRIPTA, '--zahtijevaj'], {
      cwd: KORIJEN, env: okolina, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { kod: 0, ispis: out };
  } catch (e) {
    return { kod: e.status === undefined ? -1 : e.status, ispis: (e.stdout || '') + (e.stderr || '') };
  }
}

/** Okolina u kojoj su sve obavezne tajne prisutne — bez ijedne prave vrijednosti. */
function okolinaSaSvime() {
  const o = { ...process.env, DOTENV_CONFIG_QUIET: 'true' };
  for (const t of tajne.OBAVEZNE) o[t] = 'podmetnuto-za-branu';
  return o;
}

test('--zahtijevaj PROLAZI kad su sve obavezne tajne tu', () => {
  const r = pusti(okolinaSaSvime());
  if (r.kod !== 0) throw new Error('EXIT=' + r.kod + ' uz sve tajne prisutne:\n' + r.ispis);
});

test('--zahtijevaj PADA na svakoj pojedinoj praznoj tajni, i IMENUJE ju', () => {
  for (const meta of tajne.OBAVEZNE) {
    const o = okolinaSaSvime();
    o[meta] = '';
    const r = pusti(o);
    if (r.kod !== 1) {
      throw new Error('prazna ' + meta + ' → EXIT=' + r.kod + ' (očekivano 1):\n' + r.ispis);
    }
    if (!r.ispis.includes(meta)) {
      throw new Error('pad zbog ' + meta + ' ju ne imenuje u ispisu → ne znaš što popraviti');
    }
  }
});

test('--zahtijevaj NE ISPISUJE vrijednost tajne (ni na padu)', () => {
  const o = okolinaSaSvime();
  o[tajne.OBAVEZNE[0]] = '';
  const r = pusti(o);
  if (r.ispis.includes('podmetnuto-za-branu')) {
    throw new Error('ispis sadrži vrijednost druge tajne → CI log bi ju procurio');
  }
});

// ── ⑥ brana ne mjeri PROZU ──────────────────────────────────────────────────────────────
// ⚠️ IME IZMIŠLJENE TAJNE SE SASTAVLJA U HODU, i to NIJE zaobilaženje brane nego jedini
// ispravan oblik. Ova datoteka leži pod `tests/`, dakle nabrajanje ČITA I NJU — kad je ime
// stajalo kao doslovni tekst, brana ga je (točno!) prijavila kao nesvrstanu tajnu i pala na
// prvom pokretanju. To je ujedno DOKAZ da nabrajanje radi nad pravim datotekama, ne samo nad
// podmetnutim nizom. Da ovo netko vrati u doslovni zapis, brana odmah pocrveni — pa je ovdje
// komentar, a ne iznimka u popisu: iznimka bi učinila cijelu datoteku nevidljivom, uključujući
// tajnu koju netko sutra ovdje stvarno upotrijebi.
const LAZNO_IME = 'process.env.' + 'IZMISLJENA_TAJNA';
const LAZNI_UZORAK = new RegExp(LAZNO_IME.replace('.', '\\.'));

test('nabrajanje ne pada na komentaru koji tajnu samo spominje', () => {
  const proza = tajne.bezKomentara('// nikad ne koristi ' + LAZNO_IME + '\nconst x = 1;');
  if (LAZNI_UZORAK.test(proza)) {
    throw new Error('komentar se broji kao ovisnost → brana bi tražila tajnu koju nitko ne koristi');
  }
});

test('nabrajanje PREPOZNAJE pravi poziv (dokaz da prethodna tvrdnja nije prošla na nuli)', () => {
  const kod = tajne.bezKomentara('const p = ' + LAZNO_IME + ';');
  if (!LAZNI_UZORAK.test(kod)) {
    throw new Error('ne prepoznaje ni pravi poziv → odstranjivanje komentara je pojelo kod');
  }
});

console.log(`\n  ${passed} prošlo · ${failed} palo\n`);
process.exit(failed ? 1 : 0);
