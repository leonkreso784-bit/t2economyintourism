/* eslint-disable no-console */
// ===== Gate: OVISNOSTI EDGE FUNCTIONA SE PINAJU TOČNO (pravilo #9) =====
// Pokreni: node tests/unit/edge-pinovi.test.js
//
// ZAŠTO POSTOJI (F6 ①/4): pravilo #9 kaže da se ovisnosti pinaju točno i da je `^` zabranjen.
// Za alat to provodi `save-exact=true` u `.npmrc`, za preglednik `check:cdn` — ali kôd koji se
// vrti na Supabaseu **ne prolazi ni kroz jedno od toga**. Deno razrješava `npm:paket@raspon`
// pri DEPLOYU, iz mreže, bez lockfilea: isti commit deployan dva dana zaredom može dobiti
// dvije različite verzije, a razlika se vidi tek kad konektor prestane raditi.
//
// Povod nije hipotetski: `@supabase/server` je mlad, njegov OAuth sloj je alpha, a službeni
// vodič piše upravo `^`. ①/1 je pinao točno — ali to nitko nije MJERIO, pa je vrijedilo samo
// dok se netko sjeća. ADR-027: rub koji prepoznaš isti čas dobiva test.
//
// Brana gleda IZVORNI TEKST, kao `axe-gate-usage`: pitanje nije što se dogodi pri deployu nego
// ŠTO U REPOZITORIJU PIŠE. Popis datoteka se nabraja S DISKA — ručni popis bi propustio
// sljedeću funkciju, a upravo to je razred greške koji ova kuća već dvaput plaća.

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== edge-pinovi — ovisnosti Edge Functiona (pravilo #9) ===\n');

const KORIJEN = path.join(__dirname, '..', '..');
const FUNKCIJE = path.join(KORIJEN, 'supabase', 'functions');

/** Sve `.ts` datoteke pod supabase/functions — S DISKA, rekurzivno, bez ručnog popisa. */
function tsDatoteke(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...tsDatoteke(p));
    else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

// ⚠️ Komentari se odstranjuju PRIJE provjere — inače brana pada na vlastitoj prozi.
// Ova datoteka i zaglavlje `mcp/index.ts` spominju `^` upravo zato da ga zabrane.
const bezKomentara = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');

// Udaljeni specifikatori: `npm:`, `jsr:` i goli `https://`. Lokalni `./x.ts` nisu ovisnost.
// ⚠️ HVATA SE SAMO UVOZNI POLOŽAJ (`from '…'`, `import '…'`, `import('…')`). Prva verzija ove
// brane gledala je BILO KOJI navodnik s `https://` i prijavila `https://api.resend.com/emails/batch`
// i `https://www.sokratstudy.com` — adrese koje se POZIVAJU u izvođenju, a nisu ovisnost.
// Brana koja miješa uvoz s nizom znakova ne mjeri ono što tvrdi.
const SPEC = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]((?:npm|jsr):[^'"]+|https:\/\/[^'"]+)['"]/g;

/** Točan pin = ime@X.Y.Z (uz dopušten predizdanje/build sufiks). Sve ostalo je raspon. */
function tocanPin(spec) {
  if (spec.startsWith('npm:') || spec.startsWith('jsr:')) {
    const tijelo = spec.slice(4);
    // ime može imati scope (@scope/paket) i podput iza verzije (paket@1.2.3/sub)
    const m = tijelo.match(/^(@[^/@]+\/[^/@]+|[^/@]+)@([^/]+)(\/.*)?$/);
    if (!m) return { ok: false, zasto: 'nema verzije uopće — Deno bi pri svakom deployu uzeo najnoviju' };
    const v = m[2];
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(v)) {
      return { ok: false, zasto: `verzija "${v}" je RASPON, ne točan pin` };
    }
    return { ok: true };
  }
  // https://… mora nositi verziju u putu (deno.land/std@0.224.0/…, esm.sh/paket@1.2.3)
  if (!/@v?\d+\.\d+\.\d+/.test(spec)) return { ok: false, zasto: 'URL bez verzije u putu' };
  return { ok: true };
}

const datoteke = tsDatoteke(FUNKCIJE);
const nalazi = [];
for (const f of datoteke) {
  const src = bezKomentara(fs.readFileSync(f, 'utf8'));
  let m;
  SPEC.lastIndex = 0;
  while ((m = SPEC.exec(src)) !== null) {
    nalazi.push({ datoteka: path.relative(KORIJEN, f).replace(/\\/g, '/'), spec: m[1] });
  }
}

// ⚠️ DOSEG SE ISPISUJE. Brana koja tiho prođe na nuli ne mjeri ništa — u ovoj je kući
// mjerač koji ne kaže koliko je dotaknuo bio prvi kvar dvanaest puta.
console.log(`  (doseg: ${datoteke.length} .ts datoteka, ${nalazi.length} udaljenih specifikatora)\n`);

test('scan je nešto našao — nula bi značila da se brana slomila, ne da je čisto', () => {
  if (!datoteke.length) throw new Error('nijedna .ts datoteka pod supabase/functions — put je pogrešan?');
  if (!nalazi.length) throw new Error('nijedan udaljeni specifikator — regex ili put su se slomili');
});

// ČEGRTALJKA S IMENIMA. Ova je brana pri prvom pokretanju našla TRI prava kršenja pravila #9
// (`jsr:@supabase/supabase-js@2` = raspon glavne verzije), i to u kodu koji F6 ne smije dirati:
// `delete-account` je NA PRODUKCIJI, a `mail-unsubscribe`/`send-notification` pripadaju grani
// `feat/f2-mail`. Zato se ne prešućuju nego IMENUJU: popis je zapis duga, ne dopuštenje.
// Novo kršenje pada po defaultu; popravljeno kršenje pada kao MRTAV UNOS — oba smjera, jedna usporedba.
const OSNOVICA = [
  { datoteka: 'supabase/functions/delete-account/index.ts', spec: 'jsr:@supabase/supabase-js@2',
    zasto: 'funkcija je NA PRODUKCIJI; promjena pina traži redeploy destruktivnog endpointa — zaseban korak uz Leonov OK' },
  { datoteka: 'supabase/functions/mail-unsubscribe/index.ts', spec: 'jsr:@supabase/supabase-js@2',
    zasto: 'grana feat/f2-mail — F6 je ne dira' },
  { datoteka: 'supabase/functions/send-notification/index.ts', spec: 'jsr:@supabase/supabase-js@2',
    zasto: 'grana feat/f2-mail — F6 je ne dira' },
];
const kljuc = (n) => `${n.datoteka}|${n.spec}`;

test('svaki udaljeni specifikator je pinan TOČNO (pravilo #9: `^` je zabranjen)', () => {
  const dopusteni = new Set(OSNOVICA.map(kljuc));
  const losi = nalazi.map((n) => ({ ...n, sud: tocanPin(n.spec) }))
    .filter((n) => !n.sud.ok && !dopusteni.has(kljuc(n)));
  if (losi.length) {
    throw new Error('raspon umjesto točnog pina:\n' + losi
      .map((n) => `        ${n.datoteka}: ${n.spec}  → ${n.sud.zasto}`).join('\n'));
  }
});

test('osnovica nema MRTVIH unosa — popravljeno kršenje mora se maknuti s popisa', () => {
  const stvarni = new Set(nalazi.filter((n) => !tocanPin(n.spec).ok).map(kljuc));
  const mrtvi = OSNOVICA.filter((o) => !stvarni.has(kljuc(o)));
  if (mrtvi.length) {
    throw new Error('u osnovici, a više nije kršenje (makni unos):\n' + mrtvi
      .map((o) => `        ${o.datoteka}: ${o.spec}`).join('\n'));
  }
});

test('nijedan specifikator ne pokazuje na „latest" ni na granu', () => {
  const losi = nalazi.filter((n) => /@(latest|next|canary|main|master)\b/.test(n.spec));
  if (losi.length) throw new Error('pomična oznaka:\n' + losi.map((n) => `        ${n.datoteka}: ${n.spec}`).join('\n'));
});

console.log(`\n${failed === 0 ? '✅' : '❌'} edge-pinovi: ${passed} prošlo, ${failed} palo\n`);
process.exit(failed ? 1 : 0);
