#!/usr/bin/env node
/**
 * check-lockfile.js — bi li `npm ci` prošao? I to s npm-om KOJI VRTI CI.  (C2)
 *
 * ZAŠTO POSTOJI: `npm ci` je PRVI korak svakog CI joba, a nije postojao ni u
 * jednom lokalnom gateu. Razvojni stroj radi s već instaliranim `node_modules`
 * pa lock može biti razišao, a vidi se tek kad push na `main` obori SVA TRI
 * JOBA u deset sekundi — prije nego se ijedan pravi test pokrene.
 *
 * ── Kvar 1 (2026-08-12, `d4c7914`) ────────────────────────────────────────
 *   npm error Missing: @emnapi/wasi-threads@1.2.3 from lock file
 * Uzrok NIJE bio u commitu. `@tailwindcss/oxide-wasm32-wasi@4.3.3` ima
 * `bundleDependencies`: lock bilježi zapakirani `@emnapi/wasi-threads@1.2.2`
 * (`inBundle: true`), a raspon je `^1.2.2`. Kad je upstream objavio 1.2.3, npm
 * je pri provjeri sinkronizacije razriješio raspon u 1.2.3, u locku našao samo
 * 1.2.2 i proglasio ga nedostajućim. Bomba se naoružala sama, danima poslije.
 *
 * ⚠️ `npm install --package-lock-only` to NE popravlja — gradi „idealno stablo"
 * bez dodirivanja diska, zadrži zastarjeli zapakirani zapis i vrati BAJT-IDENTIČAN
 * lock. Popravlja ga **`npm install`** (bez zastavice).
 *
 * ── Kvar 2 (isti dan, `8c7d122`) — i zato ovaj gate vrti DVA npm-a ────────
 * Prva verzija ovog gatea je prošla lokalno, a CI je opet pao. Razlog: lokalno
 * je npm 11 (Node 24), CI vrti Node 22 → **npm 10**, a to su različiti razrješivači.
 * npm 11 je tražio samo `@emnapi/wasi-threads`, npm 10 je tražio i `@emnapi/core`
 * i `@emnapi/runtime`. **Gate koji vrti drugu verziju od CI-a nije gate — daje
 * lažnu sigurnost, što je gore od nikakve provjere.** Zato skripta pročita
 * `node-version` iz `.github/workflows/ci.yml` i, ako se major razlikuje od
 * lokalnog, pokrene provjeru JOŠ JEDNOM kroz `npx npm@<major>` (~3 s, cache).
 *
 * Popravak koji zadovolji oba: `npx npm@10 install` (najstariji npm u igri
 * piše najpotpuniji lock; noviji ga onda prihvati kao nadskup).
 */

'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CI_YML = path.resolve(__dirname, '..', '.github', 'workflows', 'ci.yml');

/* Koji npm dolazi uz koji Node. Pogrešan pogodak košta samo jedan suvišan
   prolaz, nikad lažni prolaz — zato je mapa dopuštena, za razliku od pogađanja
   ishoda. Nadopuni kad CI skoči na noviji Node. */
const NPM_ZA_NODE = { 18: 9, 20: 10, 22: 10, 24: 11 };

const NETWORK = /ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ERR_SOCKET_TIMEOUT|registry\.npmjs\.org.*(?:failed|timeout)/i;

/* ⚠️ Ova dva podešavanja su IZMJERENA, ne stilska — pogrešna kombinacija vrati
   status bez ijedne poruke, pa gate ne zna ŠTO je palo:
     shell:true + naslijeđen env → status 1, izlaz PRAZAN  (roditeljski `npm run`
                                    ubaci `npm_config_*` koje dijete naslijedi)
     shell:false + čist env      → status null, izlaz PRAZAN (Windows, npm.cmd)
     shell:true + čist env       → status 1, puna poruka   ✅
   (DEP0190 o args uz shell:true nas ne pogađa — argumenti su konstante ovdje.) */
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^npm_config_/i.test(k)));

function pokreni(argv) {
  const bin = process.platform === 'win32' ? `${argv[0]}.cmd` : argv[0];
  const t0 = Date.now();
  const r = spawnSync(bin, argv.slice(1), { encoding: 'utf8', env: ENV, shell: true });
  return {
    status: r.status,
    out: `${r.stdout || ''}${r.stderr || ''}`,
    secs: ((Date.now() - t0) / 1000).toFixed(1),
  };
}

function ciNodeMajor() {
  try {
    const m = fs.readFileSync(CI_YML, 'utf8').match(/node-version:\s*['"]?(\d+)/);
    return m ? Number(m[1]) : null;
  } catch { return null; }
}

console.log('\n=== check:lockfile — package.json ↔ package-lock.json ===\n');

const mojNpm = Number((process.env.npm_config_user_agent || '').match(/npm\/(\d+)/)?.[1])
  || Number(pokreni(['npm', '--version']).out.trim().split('.')[0]) || null;
const nodeCI = ciNodeMajor();
const npmCI = nodeCI ? NPM_ZA_NODE[nodeCI] : null;

const prolazi = [{ ime: `npm ${mojNpm ?? '?'} (lokalni)`, argv: ['npm', 'ci', '--dry-run', '--ignore-scripts'] }];
if (npmCI && npmCI !== mojNpm) {
  prolazi.push({
    ime: `npm ${npmCI} (CI, Node ${nodeCI})`,
    argv: ['npx', '--yes', `npm@${npmCI}`, 'ci', '--dry-run', '--ignore-scripts'],
  });
} else if (!npmCI) {
  console.log('   ⚠️  Ne mogu pročitati `node-version` iz ci.yml — provjeravam samo lokalnim npm-om.');
  console.log('      Ako se verzije raziđu, CI može pasti ondje gdje je ovdje zeleno.\n');
} else {
  // ⚠️ MREŽA A2 (2026-08-31): otkad stroj i CI vrte isti Node (24 → npm 11), drugog
  // razrješivača NEMA — pa se ni ne pokreće. To se MORA reći naglas: jedan zeleni
  // redak ondje gdje su prije stajala dva izgleda kao izgubljen prolaz, a nije.
  // Divergencija koja je dvaput oborila CI je uklonjena NA IZVORU (`check:node`), ne
  // ovdje; ovaj gate ostaje kao osiguranje ako se verzije ikad opet raziđu.
  console.log(`   ℹ️  Jedan npm u igri: stroj i CI (Node ${nodeCI}) oboje vrte npm ${mojNpm}.`);
  console.log('      Drugi prolaz nije preskočen nego NE POSTOJI — v. `check:node`.\n');
}

for (const { ime, argv } of prolazi) {
  const r = pokreni(argv);

  if (r.status === 0) {
    console.log(`   ✅ ${ime}: lock je u sinku (${r.secs}s)`);
    continue;
  }

  // Tuđa infrastruktura je jedina dopuštena isprika — i mora se PREPOZNATI, ne
  // pretpostaviti. Prva verzija je radila obrnuto (nepoznato = prolaz) i zato je
  // negativan test tiho prošao. Gate koji na nejasnoću kaže „u redu je" gori je
  // od nepostojećeg, jer se na njega još i oslanjaš.
  if (NETWORK.test(r.out)) {
    console.log(`   ⏭️  ${ime}: preskočeno (${r.secs}s) — npm nije došao do registryja.`);
    continue;
  }

  const nedostaje = [...new Set([...r.out.matchAll(/(?:Missing|Invalid): (\S+)/g)].map((m) => m[1]))];
  console.log(`\n   ❌ ${ime}: \`npm ci\` bi PAO — lock i package.json se ne slažu.\n`);
  if (nedostaje.length) {
    console.log('   npm prijavljuje:');
    nedostaje.slice(0, 10).forEach((m) => console.log('      · ' + m));
  } else if (r.out.trim()) {
    r.out.split('\n').filter(Boolean).slice(0, 6).forEach((l) => console.log('      ' + l.trim()));
  } else {
    console.log(`   (status ${r.status} bez poruke — pokreni \`npm ci --dry-run\` ručno.)`);
  }
  console.log('\n   POPRAVAK:  npx npm@' + (npmCI || 10) + ' install     (pa commitaj package-lock.json)');
  console.log('      Najstariji npm u igri piše najpotpuniji lock; noviji ga prihvati kao nadskup.');
  console.log('   ⚠️ NE:      npm install --package-lock-only');
  console.log('      Gradi idealno stablo bez dodirivanja diska i kod bundleDependencies');
  console.log('      vrati BAJT-IDENTIČAN lock — izgleda kao popravak, a gate i dalje pada.\n');
  console.log('   Bez ovoga `npm ci` obori SVA TRI CI joba prije ijednog testa.\n');
  process.exit(1);
}

console.log('');
process.exit(0);
