/* eslint-disable no-console */
// ===== Gate: Edge Functions na PRODUKCIJI (READ-ONLY, BEZ IJEDNOG KLJUČA) =====
// Usage: node scripts/check-edge-functions.js        (npm run check:functions)
//        CHECK_FUNCTIONS_URL=https://<ref>.supabase.co npm run check:functions   (npr. staging PRIJE prod-deploya)
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
// IZNIMKA (F2/4, 2026-09-15): funkcija koja NAMJERNO radi bez prijave (`verify_jwt = false`) na
// neautenticiran POST ne daje 401 nego odgovara SAMA — pa se za nju tvrdi njezin vlastiti odgovor
// (popis `PUBLIC_FNS` ispod). Pravilo „sve traži JWT" time ne slabi: javna funkcija mora biti
// IMENOVANA ovdje, inače je 200/400 bez prijave i dalje pad.
//
// OGRANIČENJE (namjerno zapisano): bez Management API tokena se deployane funkcije **ne mogu
// nabrojati**, pa se prava invarijanta („sve što je na produkciji postoji i u `supabase/functions/`")
// ne da provjeriti izravno. Zato: očekivane se potvrđuju iz repozitorija, a poznati stranci iz
// popisa ispod. Kad se pojavi novi stranac, dodaje se OVDJE — popis je zapis, ne pogađanje.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = (process.env.CHECK_FUNCTIONS_URL || 'https://naxjubnedhrbhsuasayu.supabase.co').replace(/\/+$/, '');
const SITE = 'https://www.sokratstudy.com';

/** Funkcije koje su nekad postojale na produkciji, a NE SMIJU više. */
const MUST_BE_GONE = [
  { slug: 'bright-function', why: 'duplikat delete-accounta pod krivim slugom (dashboard „Via Editor")' },
  { slug: 'quick-api', why: 'Supabaseov Hello-World predložak iz promašenog deploya' },
];

/**
 * Funkcije koje NAMJERNO rade bez prijave, i što njihov odgovor bez ključa mora biti.
 * `check` dobiva odgovore na POST `{}` i GET (bez praćenja preusmjeravanja) i vraća `null` ili razlog pada.
 */
const PUBLIC_FNS = {
  'mail-unsubscribe': {
    why: 'odjava iz maila — tko klikne, na tom uređaju najčešće nije prijavljen (RFC 8058 one-click)',
    check(post, get) {
      // POST bez tokena: 400 bad_token = deployana, javna, ima tajnu i odbija bez potpisa.
      if (post.status === 401) return 'traži JWT (401) — klijent pošte odjavljuje BEZ prijave, pa one-click u svakom mailu pada; deploy s --no-verify-jwt';
      if (post.status === 500 && post.error === 'mail_not_configured') return 'nema tajne MAIL_UNSUB_SECRET (500) — odjava iz svakog poslanog maila pada';
      if (post.status !== 400 || post.error !== 'bad_token') return `POST bez tokena: očekivan 400 bad_token, dobiven ${post.status} ${post.error || ''}`.trim();
      // GET nikad ne odjavljuje nego šalje na NAŠU stranicu s gumbom; krivi MAIL_SITE vodi ljude drugamo.
      const cilj = SITE + '/odjava.html';
      if (get.status !== 302 || !String(get.location || '').startsWith(cilj + '?')) {
        return `GET: očekivan 302 na ${cilj}, dobiven ${get.status} ${get.location || ''}`.trim();
      }
      return null;
    },
  },
};

function expectedSlugs() {
  const dir = path.join(ROOT, 'supabase', 'functions');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);
}

async function probe(slug) {
  const res = await fetch(BASE + '/functions/v1/' + slug, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  let error = null;
  try { const b = await res.json(); error = (b && (b.error || b.code)) || null; } catch (_e) { /* nije JSON */ }
  return { status: res.status, error };
}

async function probeGet(slug) {
  const res = await fetch(BASE + '/functions/v1/' + slug, { method: 'GET', redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location') };
}

(async () => {
  console.log('\n=== check:functions — Edge Functions na ' + (process.env.CHECK_FUNCTIONS_URL ? 'ZADANOM PROJEKTU' : 'PRODUKCIJI') + ' ===');
  console.log('   ' + BASE + '\n');

  let fail = 0;

  // 1) Sve iz repozitorija MORA biti deployano i MORA tražiti JWT — osim imenovanih javnih.
  const expected = expectedSlugs();
  if (!expected.length) console.log('  ⊘ nema `supabase/functions/*` u repozitoriju');
  for (const slug of Object.keys(PUBLIC_FNS)) {
    if (expected.indexOf(slug) === -1) { fail++; console.log(`  ✗ ${slug} — na popisu javnih, a nema je u supabase/functions/ (mrtav zapis)`); }
  }
  for (const slug of expected) {
    let post;
    try { post = await probe(slug); } catch (e) {
      console.log(`  ⊘ ${slug} — mreža nedostupna (${e.message}); preskačem`);
      return process.exit(0);                       // offline nije pad gatea
    }
    const st = post.status;
    if (st === 404) { fail++; console.log(`  ✗ ${slug} — u repozitoriju je, ali NIJE deployan (404)`); continue; }

    const javna = PUBLIC_FNS[slug];
    if (javna) {
      const razlog = javna.check(post, await probeGet(slug));
      if (razlog) { fail++; console.log(`  ✗ ${slug} — ${razlog}`); }
      else console.log(`  ✓ ${slug} — deployana, NAMJERNO bez prijave, odbija bez potpisa (400) i GET vodi na odjava.html`);
      continue;
    }
    if (st === 401) console.log(`  ✓ ${slug} — deployan i traži JWT (401)`);
    else { fail++; console.log(`  ✗ ${slug} — očekivan 401 (JWT obavezan), dobiven ${st}` +
      (st === 200 ? '  ⚠️ funkcija odgovara BEZ autentikacije!' : '')); }
  }

  // 2) Poznati stranci NE SMIJU postojati.
  for (const { slug, why } of MUST_BE_GONE) {
    let st;
    try { st = (await probe(slug)).status; } catch (e) {
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
    ? '✅ Projekt ima točno ono što repozitorij opisuje.'
    : `❌ ${fail} problem(a) — razlog piše uz svaku stavku.`));
  process.exit(fail ? 1 : 0);
})();
