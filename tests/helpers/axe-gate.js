// Zajednička axe-logika za a11y gateove (odjavljeni `a11y.spec.js` + prijavljeni `a11y.authed.spec.js`).
//
// ⚠️ ZAŠTO ZAJEDNIČKI MODUL, a ne kopija u svakoj datoteci:
// gate hvata `serious`/`critical` i ispisuje izmjerene brojke. Da su to dvije kopije, prva
// zakrpa (npr. novi razred u `IMPACT_GATE`) vrijedila bi samo za jednu površinu — a upravo
// je „ista provjera na dva mjesta, samo jedno održavano" obrazac koji je 2026-08-14 pustio
// tamnu plohu na produkcijsku granu. Jedna činjenica = jedno mjesto (ADR-027).
const AxeBuilder = require('@axe-core/playwright').default;

// Gate hvata samo ozbiljne razrede; 'minor'/'moderate' su backlog (ne ruše build).
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

function gateViolations(results) {
  return results.violations
    .filter((v) => IMPACT_GATE.includes(v.impact))
    .map((v) => ({
      id: v.id,
      impact: v.impact,
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
async function smiri(page) {
  await page.evaluate(() => {
    document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* beskonačne */ } });
  });
  await page.waitForTimeout(250);
}

// Skenira trenutno stanje stranice i vraća gateane prekršaje (prazno = zeleno).
// `ime` ide u ispis da se u dnevniku vidi KOJA je površina pala.
async function skeniraj(page, ime) {
  await smiri(page);
  const gated = gateViolations(await new AxeBuilder({ page }).analyze());
  if (gated.length) console.log(`${ime} violations:`, JSON.stringify(gated, null, 2));
  return gated.map((g) => ({ povrsina: ime, ...g }));
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

module.exports = { IMPACT_GATE, TEME, detalji, gateViolations, smiri, skeniraj, skenirajSveTeme };
