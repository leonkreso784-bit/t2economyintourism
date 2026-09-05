// Zajednička axe-logika za a11y gateove (odjavljeni `a11y.spec.js` + prijavljeni `a11y.authed.spec.js`).
//
// ⚠️ ZAŠTO ZAJEDNIČKI MODUL, a ne kopija u svakoj datoteci:
// gate sudi (WCAG razina A/AA ∪ težina serious/critical) i ispisuje izmjerene brojke. Da su
// to dvije kopije, prva zakrpa (npr. promjena presude) vrijedila bi samo za jednu površinu — a upravo
// je „ista provjera na dva mjesta, samo jedno održavano" obrazac koji je 2026-08-14 pustio
// tamnu plohu na produkcijsku granu. Jedna činjenica = jedno mjesto (ADR-027).
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');

// Ozbiljni razredi po axe TEŽINI — do B3b jedina ljestvica presude; od B3b jedna od dvije.
const IMPACT_GATE = ['serious', 'critical'];

// ⚠️ Ispisuj i axeove BROJKE, ne samo selektor.
// Povod (C2, 2026-08-13): gate je javio „color-contrast na `#btnCorrect > span`" i tu stao.
// Uzrok se onda pogađa — a dva neovisna ručna mjerenja dala su 4.80 i 5.16, dakle IZNAD
// praga, dok je axe tvrdio suprotno. Sat vremena je otišao na razliku koju je axe cijelo
// vrijeme znao. Boja, pozadina i omjer sad idu u ispis, pa se uzrok ČITA umjesto da se traži.
function detalji(node) {
  const d = (node.any || []).map((c) => c.data).find((x) => x && x.contrastRatio != null);
  if (!d) return null;
  return `fg ${d.fgColor} / bg ${d.bgColor} = ${d.contrastRatio} (treba ${d.expectedContrastRatio})`;
}

// ── B3a (MREŽA, 2026-08-31): WCAG RAZINA iz axe tagova ───────────────────────
// Axe ima DVIJE ljestvice: TEŽINU (minor…critical, axeova procjena posljedice) i RAZINU
// (A/AA/AAA, WCAG-ov pravni standard). Do B3b gate je sudio SAMO po težini — pa je
// `scrollable-region-focusable` (razina A, dakle tvrdi WCAG zahtjev) stajao u backlogu
// od 2026-08-14 uz zelenu branu. Tagovi: wcag2a/wcag21a/wcag22a = A; s `aa` = AA;
// bez wcag-taga = best-practice (axeova preporuka, ne WCAG zahtjev).
function wcagRazina(tags) {
  if (tags.some((t) => /^wcag2\d*aaa$/.test(t))) return 'AAA';
  if (tags.some((t) => /^wcag2\d*aa$/.test(t))) return 'AA';
  if (tags.some((t) => /^wcag2\d*a$/.test(t))) return 'A';
  return 'best-practice';
}

// ── B3b (MREŽA, 2026-08-31): PRESUDA = razina A/AA ∪ težina serious/critical ─
// UNIJA, ne zamjena: da je presuda prebačena SAMO na razinu, `serious` best-practice
// (npr. budući axe-nalaz bez wcag-taga) bi ispao iz gatea — prebacivanje ljestvice ne
// smije branu OSLABITI. AAA se ne gatea (cilj je AA, standard weba); AAA nalaz uđe samo
// ako mu je težina serious/critical. B3a je izmjerio da na 46 dosadašnjih površina ova
// promjena ne mijenja ništa — zube dobiva tek s novom površinom (macro, v. a11y.spec.js).
function uGateu(v) {
  const razina = wcagRazina(v.tags);
  return razina === 'A' || razina === 'AA' || IMPACT_GATE.includes(v.impact);
}

// ── B3b: IMENOVANA OSNOVICA (tests/a11y-baseline.json) ───────────────────────
// Kućni obrazac (check:orphan-css, phone-gate): brana pada samo na nalazu kojeg u osnovici
// NEMA, a svaki tolerirani upis je imenovan („POVRŠINA::rule-id") i nosi razlog. Ključ
// uključuje površinu: tolerancija se NE proteže na isti rule drugdje. Riješeni upisi se
// ispisuju GLASNO — zastarjela osnovica tiho pokriva kvar koji se vratio.
// ⚠️ Osnovica se piše RUKOM, nema auto-update flaga: Playwright vrti testove u paralelnim
// workerima, pa bi dva istovremena zapisa iste datoteke bila utrka — a upis u osnovicu
// ionako traži zapisan razlog, ne samo brojku (pouka iz phone-baseline `_zasto`).
const OSNOVICA_PUT = path.join(__dirname, '..', 'a11y-baseline.json');

// Nedostajuća/pokvarena osnovica RUŠI, ne tolerira ništa tiho: datoteka je ugovor u repou,
// njezin nestanak je kvar okoline, a brana koja o kvaru šuti nije stroža nego pokvarena.
function ucitajOsnovicu(putanja) {
  const p = putanja || OSNOVICA_PUT;
  let raw;
  try { raw = fs.readFileSync(p, 'utf8'); } catch (e) {
    throw new Error('axe-gate: osnovica ne postoji (' + p + ') — struktura je ugovor, ne smije se brisati. ' + e.message);
  }
  return JSON.parse(raw);
}

// Čista funkcija (unit-testirana bez preglednika): podijeli gateane nalaze jedne površine
// na nove (padaju), tolerirane (imenovani u osnovici) i riješene (upis bez nalaza).
function presudiOsnovicom(nalazi, povrsina, osnovica) {
  const tol = (osnovica && osnovica.tolerirano) || {};
  const novi = [];
  const tolerirani = [];
  for (const n of nalazi) {
    const kljuc = povrsina + '::' + n.id;
    if (Object.prototype.hasOwnProperty.call(tol, kljuc)) tolerirani.push(n);
    else novi.push(n);
  }
  const prefiks = povrsina + '::';
  const rijeseni = Object.keys(tol).filter(
    (k) => k.startsWith(prefiks) && !nalazi.some((n) => prefiks + n.id === k)
  );
  return { novi, tolerirani, rijeseni };
}

// Mjerni ispis (A11Y_WCAG_MJERENJE=1): SVE prekršaje, s obje ljestvice, bez presude.
function mjerenjePoRazini(results, ime) {
  if (!process.env.A11Y_WCAG_MJERENJE) return;
  const sve = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    razina: wcagRazina(v.tags),
    nodes: v.nodes.length,
    uGateu: uGateu(v),
  }));
  console.log('[B3a-mjerenje] ' + ime + ' ' + JSON.stringify(sve));
}

// ── F1/11 (ADR-034, Leon 2026-09-05): PRAVILA ISKLJUČENA ODLUKOM O PROIZVODU ─────────
// Osnovica gore je za TOLERIRANE KVAROVE: ključ nosi površinu, a upis se proglašava
// „riješenim" čim nalaz nestane — dakle OČEKUJE da nestane. Ovo je suprotan razred: nalaz
// koji ne smije nestati, jer je stanje koje axe prijavljuje NAMJERNO. `meta-viewport`
// (WCAG 1.4.4, AA) pada na `user-scalable=no` / `maximum-scale=1` — a to je ADR-034:
// stranica se ne zumira, ni štipanjem ni dodirom ni fokusom (sustavno povećanje teksta u
// postavkama uređaja ostaje). U osnovici bi to bilo deset redaka s istim razlogom (svaka
// površina svoj ključ) i jedanaesti sa svakim novim specom. Zato JEDNO imenovano isključenje
// s razlogom, ovdje — a `tests/unit/a11y-gate.test.js` tvrdi da je popis TOČNO ovaj.
// Ne `disableRules`: axe pravilo i dalje vrti, `skeniraj` ga ispisuje kao ISKLJUČENO, pa
// dnevnik pokazuje da nalaz postoji (i da je odluka još na snazi), ne da je nestao.
// Obrnuto provjereno 2026-09-05: bez ovoga landing pada na `meta-viewport` (moderate, AA).
const ISKLJUCENO_ODLUKOM = {
  'meta-viewport': 'ADR-034 — stranica se ne zumira (Leon, 2026-09-05); WCAG 1.4.4 svjesno nadjačan za gestu'
};
const jeIskljuceno = (v) => Object.prototype.hasOwnProperty.call(ISKLJUCENO_ODLUKOM, v.id);
function iskljucenoOdlukom(results) {
  return results.violations.filter(jeIskljuceno);
}

function gateViolations(results) {
  return results.violations
    .filter((v) => !jeIskljuceno(v))
    .filter(uGateu)
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      razina: wcagRazina(v.tags),
      nodes: v.nodes.length,
      help: v.help,
      target: v.nodes.map((n) => n.target).flat(),
      mjere: v.nodes.map((n) => detalji(n)).filter(Boolean)
    }));
}

// Animacije u KRAJNJE stanje prije mjerenja.
// ⚠️ NE mjeri usred prijelaza: axe uzorkuje boju onakvu kakva je u tom trenutku, pa je
// izmjereno javljao `#1e8155` umjesto tokena `#10794a` — ista boja na ~93 % neprozirnosti,
// dakle 4.29 umjesto 4.80, tj. pad koji na gotovoj stranici ne postoji. `finish()` je
// determinističan: ne produljuje čekanje nego animacije gura u krajnje stanje.
// ⚠️ 2026-08-15 — ISTI KVAR SE PONOVIO, jer je popravak bio nepotpun. `finish()` se zvao
// JEDNOM, prije čekanja od 250 ms; toast se skriva SAM, na tajmeru, pa je njegov prijelaz
// krenuo TIJEKOM tog čekanja i axe ga je uhvatio na ~53 % neprozirnosti:
// `#868584` na `#fdfcfb` = 3.59, prijavljeno kao serious color-contrast u Studiju.
// Da to nije boja nego prozirnost dokazuje aritmetika: sva tri kanala daju istu alfu
// (0.527 · 0.527 · 0.522) za `--color-ink-0` preko plohe. Prava boja daje ~14:1.
// Zato se sad gura u krajnje stanje U PETLJI i JOŠ JEDNOM neposredno prije mjerenja.
async function smiri(page) {
  // ⚠️ Brojiti smiju SAMO animacije koje mogu završiti. Beskonačne (spinneri) `finish()`
  // odbija — baci iznimku, `playState` ostane `running` — pa bi ih petlja čekala vječno.
  // Prva verzija ovog popravka to nije izuzela i test je s 51 s otišao u timeout od 120 s:
  // brana koja čeka na nešto što se po definiciji ne događa nije stroža, nego pokvarena.
  const gurni = () => page.evaluate(() => {
    const konacna = (a) => {
      try { return (a.effect.getTiming().iterations || 1) !== Infinity; } catch (e) { return false; }
    };
    document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* beskonačne */ } });
    return document.getAnimations()
      .filter((a) => a.playState === 'running' && konacna(a))
      .map((a) => a.animationName || a.transitionProperty || '(bezimena)');
  });

  for (let i = 0; i < 6; i++) {
    if (!(await gurni()).length) break;
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(250);
  // Ključni drugi poziv: sve što je krenulo TIJEKOM gornjeg čekanja mora biti gotovo prije
  // nego axe uzorkuje boje. Bez njega petlja gore ne pomaže — mjerenje je i dalje utrka.
  const preostalo = await gurni();

  // ⚠️ TREĆI PUT ISTI OBRAZAC (BUG-042) → mjerač koji ne uspije smiriti ekran mora PASTI,
  // a ne izmjeriti ga takvog. Do 2026-08-31 se ovdje samo nastavljalo dalje, pa je axe
  // uzorkovao boju usred prijelaza i prijavljivao pad koji na gotovoj stranici ne postoji.
  // Ime animacije ide u poruku — bez njega se uzrok opet pogađa umjesto da se pročita.
  if (preostalo.length) {
    throw new Error(
      'axe-gate: animacije se nisu smirile ni nakon 6 pokušaja + 250 ms — mjerenje bi bilo ' +
      'utrka, ne nalaz. Još se vrti: ' + preostalo.join(', ') + '. ' +
      'Ako je animacija namjerno beskonačna, mora to i deklarirati (iterations: Infinity).'
    );
  }
}

// Skenira trenutno stanje stranice i vraća NOVE gateane prekršaje (prazno = zeleno).
// `ime` ide u ispis da se u dnevniku vidi KOJA je površina pala — i ono je dio ključa
// osnovice, pa se ne smije mijenjati bez migracije upisa u `tests/a11y-baseline.json`.
async function skeniraj(page, ime) {
  await smiri(page);
  const results = await new AxeBuilder({ page }).analyze();
  mjerenjePoRazini(results, ime);
  for (const o of iskljucenoOdlukom(results)) {
    console.log(`[a11y-odluka] ISKLJUČENO ${ime}::${o.id} (${o.nodes.length} nodeova) — ${ISKLJUCENO_ODLUKOM[o.id]}`);
  }
  const { novi, tolerirani, rijeseni } = presudiOsnovicom(gateViolations(results), ime, ucitajOsnovicu());
  for (const t of tolerirani) {
    console.log(`[a11y-osnovica] TOLERIRANO ${ime}::${t.id} (${t.nodes} nodeova) — imenovano u tests/a11y-baseline.json`);
  }
  for (const r of rijeseni) {
    console.log(`[a11y-osnovica] ⚠️ RIJEŠENO: upis "${r}" više nema nalaza — ukloni ga iz tests/a11y-baseline.json (zastarjela osnovica tiho pokriva kvar koji se vrati)`);
  }
  if (novi.length) console.log(`${ime} violations:`, JSON.stringify(novi, null, 2));
  return novi.map((g) => ({ povrsina: ime, ...g }));
}

// Sve teme koje `css/tokens.css` definira, plus zadana (bez atributa).
// ⚠️ `null` = zadana NIJE isto što i `academic`: zadane vrijednosti stoje na golom `:root`, pa
// bi provjera samo imenovanih tema propustila upravo onu koju vidi većina korisnika.
// Popis mora pratiti `scripts/check-contrast.js` — ista paleta, dva različita kuta mjerenja.
const TEME = [null, 'academic', 'paper', 'chalk', 'mint'];

/**
 * Skenira ISTU plohu kroz sve teme, pa vrati atribut kakav je zatekao.
 * Povod: kvar iz §7.9 nije bio u pravilu nego u KOMBINACIJI tokena i teme — na tamnoj temi
 * je ista deklaracija bila ispravna. Jedna tema stoga ne dokazuje ništa o ostale četiri.
 */
async function skenirajSveTeme(page, ime) {
  const prije = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const nalazi = [];
  for (const tema of TEME) {
    await page.evaluate((t) => {
      if (t === null) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', t);
    }, tema);
    nalazi.push(...await skeniraj(page, `${ime} [${tema || 'zadana'}]`));
  }
  await page.evaluate((t) => {
    if (t === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }, prije);
  return nalazi;
}

module.exports = {
  IMPACT_GATE, TEME, ISKLJUCENO_ODLUKOM, detalji, gateViolations, iskljucenoOdlukom, wcagRazina, uGateu,
  ucitajOsnovicu, presudiOsnovicom, smiri, skeniraj, skenirajSveTeme
};
