/* eslint-disable no-console */
// ===== Gate: Edge Functions na PRODUKCIJI (READ-ONLY, BEZ IJEDNOG KLJUČA) =====
// Usage: node scripts/check-edge-functions.js        (npm run check:functions)
//
// POVOD (2026-08-10): na produkciji su živjele TRI funkcije, a u repozitoriju postoji JEDNA.
// `bright-function` i `quick-api` su ostaci promašenih deployeva kroz dashboard (koji zaključa slug
// u trenutku otvaranja editora, pa preimenovanje mijenja samo prikazano ime). To nije bila kozmetika:
// `bright-function` je imao sha256 **identičan** `delete-account`-u — dakle **drugi, nezapisani
// endpoint koji nepovratno briše korisnički račun i sve podatke**. Sam po sebi nije bio rupa (identitet
// se i ondje izvodi isključivo iz JWT-a), ali je bio **stara kopija destruktivnog endpointa**: čim
// `delete-account` dobije sljedeći sigurnosni guard — kao što je `eee6f14` dodao zaštitu da se admin
// ne može obrisati sam — kopija ga NE dobiva, a i dalje radi. Zato ovaj gate postoji.
//
// KAKO RADI BEZ KLJUČA: neautenticiran POST na `/functions/v1/<slug>` odgovara
//   401 UNAUTHORIZED_NO_AUTH_HEADER  → funkcija POSTOJI (i traži JWT — što i želimo)
//   404 NOT_FOUND                    → funkcije NEMA
// Izmjereno na produkciji, ne pretpostavljeno.
//
// OGRANIČENJE (namjerno zapisano): bez Management API tokena se deployane funkcije **ne mogu
// nabrojati**, pa se prava invarijanta („sve što je na produkciji postoji i u `supabase/functions/`")
// ne da provjeriti izravno. Zato: očekivane se potvrđuju iz repozitorija, a poznati stranci iz
// popisa ispod. Kad se pojavi novi stranac, dodaje se OVDJE — popis je zapis, ne pogađanje.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROD = 'https://naxjubnedhrbhsuasayu.supabase.co';

/** Funkcije koje su nekad postojale na produkciji, a NE SMIJU više. */
const MUST_BE_GONE = [
  { slug: 'bright-function', why: 'duplikat delete-accounta pod krivim slugom (dashboard „Via Editor")' },
  { slug: 'quick-api', why: 'Supabaseov Hello-World predložak iz promašenog deploya' },
];

function expectedSlugs() {
  const dir = path.join(ROOT, 'supabase', 'functions');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);
}

async function probe(slug) {
  const res = await fetch(PROD + '/functions/v1/' + slug, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  return res.status;
}

(async () => {
  console.log('\n=== check:functions — Edge Functions na PRODUKCIJI ===');
  console.log('   ' + PROD + '\n');

  let fail = 0;

  // 1) Sve iz repozitorija MORA biti deployano i MORA tražiti JWT.
  const expected = expectedSlugs();
  if (!expected.length) console.log('  ⊘ nema `supabase/functions/*` u repozitoriju');
  for (const slug of expected) {
    let st;
    try { st = await probe(slug); } catch (e) {
      console.log(`  ⊘ ${slug} — mreža nedostupna (${e.message}); preskačem`);
      return process.exit(0);                       // offline nije pad gatea
    }
    if (st === 401) console.log(`  ✓ ${slug} — deployan i traži JWT (401)`);
    else if (st === 404) { fail++; console.log(`  ✗ ${slug} — u repozitoriju je, ali NIJE deployan (404)`); }
    else { fail++; console.log(`  ✗ ${slug} — očekivan 401 (JWT obavezan), dobiven ${st}` +
      (st === 200 ? '  ⚠️ funkcija odgovara BEZ autentikacije!' : '')); }
  }

  // 2) Poznati stranci NE SMIJU postojati.
  for (const { slug, why } of MUST_BE_GONE) {
    let st;
    try { st = await probe(slug); } catch (e) {
      console.log(`  ⊘ ${slug} — mreža nedostupna; preskačem`);
      continue;
    }
    if (st === 404) console.log(`  ✓ ${slug} — obrisan (404)`);
    else {
      fail++;
      console.log(`  ✗ ${slug} — JOŠ ŽIVI (HTTP ${st}) — ${why}`);
      console.log(`      obriši: Supabase Dashboard → Edge Functions → ${slug} → Delete`);
    }
  }

  console.log('\n' + (fail === 0
    ? '✅ Produkcija ima točno ono što repozitorij opisuje.'
    : `❌ ${fail} problem(a). Nezapisana funkcija na produkciji = kod koji nitko ne održava.`));
  process.exit(fail ? 1 : 0);
})();
