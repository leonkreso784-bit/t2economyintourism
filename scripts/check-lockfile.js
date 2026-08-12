#!/usr/bin/env node
/**
 * check-lockfile.js — je li `package-lock.json` u sinku s `package.json`?  (C2)
 *
 * ZAŠTO POSTOJI: `npm ci` je PRVI korak svakog CI joba, a ne postoji ni u
 * jednom lokalnom gateu. Razvojni stroj radi s `node_modules` koje je već
 * instalirano, pa lock može biti razišao mjesecima i nitko to ne vidi — sve dok
 * push na `main` ne obori SVA TRI CI joba u deset sekundi, prije nego se ijedan
 * pravi test uopće pokrene.
 *
 * Točno se to dogodilo 2026-08-12 na `d4c7914` (C1 = uvođenje Tailwinda):
 *
 *   npm error `npm ci` can only install packages when your package.json and
 *   npm error package-lock.json are in sync.
 *   npm error Missing: @emnapi/wasi-threads@1.2.3 from lock file
 *
 * Uzrok NIJE bio u našem commitu. `@tailwindcss/oxide-wasm32-wasi` ima
 * `bundleDependencies`: lock bilježi zapakirani `@emnapi/wasi-threads@1.2.2`
 * (`inBundle: true`), a deklarirani raspon je `^1.2.2`. Kad je upstream objavio
 * **1.2.3**, npm je pri provjeri sinkronizacije razriješio raspon u 1.2.3, u
 * locku našao samo 1.2.2 i proglasio ga nedostajućim. Bomba se naoružala sama,
 * izvan repozitorija, danima nakon commita — zato je ovo gate, a ne komentar.
 *
 * ⚠️ ZAMKA KOJA JE POJELA DVA POKUŠAJA: `npm install --package-lock-only` ovo
 * NE POPRAVLJA. On gradi „idealno stablo" bez dodirivanja datotečnog sustava,
 * pa zadrži zastarjeli zapakirani zapis i proizvede BAJT-IDENTIČAN lock.
 * Popravlja ga **`npm install`** (bez zastavice), koji stvarno reificira stablo
 * i doda razriješeni zapis na vrh. Ista poruka stoji dolje, jer se ta zamka
 * inače ponovi svaki put.
 */

'use strict';
const { spawnSync } = require('child_process');

console.log('\n=== check:lockfile — package.json ↔ package-lock.json ===\n');

// ⚠️ Ova dva podešavanja su IZMJERENA, ne stilska — pogrešna kombinacija vraća
// status bez ijedne poruke, pa gate ne zna ŠTO je palo:
//   shell:true + naslijeđen env  → status 1, izlaz PRAZAN   (roditeljski `npm run`
//                                   ubaci `npm_config_*` koje dijete naslijedi)
//   shell:false + čist env       → status null, izlaz PRAZAN (Windows, npm.cmd)
//   shell:true + čist env        → status 1, izlaz 1227 zn.  ✅
// (DEP0190 upozorenje o args uz shell:true nas ne pogađa — argumenti su konstante
// u ovoj datoteci, ništa ne dolazi izvana.)
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^npm_config_/i.test(k)));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const started = Date.now();
const res = spawnSync(npm, ['ci', '--dry-run', '--ignore-scripts'], { encoding: 'utf8', env, shell: true });
const secs = ((Date.now() - started) / 1000).toFixed(1);

const out = `${res.stdout || ''}${res.stderr || ''}`;

if (res.status === 0) {
  console.log(`   ✅ lock je u sinku (${secs}s) — \`npm ci\` na CI-u će proći.\n`);
  process.exit(0);
}

// TUĐA INFRASTRUKTURA je jedina dopuštena isprika — i mora se PREPOZNATI, ne
// pretpostaviti. Sve ostalo pada. Prva verzija je radila obrnuto (nepoznato =
// prolaz) i zato je negativan test tiho prošao: gate koji na nejasnoću kaže
// „u redu je" gori je od nepostojećeg, jer se na njega još i oslanjaš.
const NETWORK = /ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ERR_SOCKET_TIMEOUT|network|registry\.npmjs\.org.*(?:failed|timeout)/i;
if (NETWORK.test(out)) {
  console.log(`   ⏭️  preskočeno (${secs}s) — npm nije mogao doći do registryja.`);
  console.log('      Ovo NIJE nesklad locka nego mreža. Na CI-u će se svejedno provjeriti.\n');
  process.exit(0);
}

const missing = [...out.matchAll(/(?:Missing|Invalid): (\S+)/g)].map((m) => m[1]);
console.log('   ❌ `npm ci` bi PAO — lock i package.json se ne slažu.\n');
if (missing.length) {
  console.log('   npm prijavljuje:');
  [...new Set(missing)].slice(0, 10).forEach((m) => console.log('      · ' + m));
  console.log('');
} else if (out.trim()) {
  console.log('   npm je rekao:');
  out.split('\n').filter(Boolean).slice(0, 6).forEach((l) => console.log('      ' + l.trim()));
  console.log('');
} else {
  console.log(`   (npm je izašao sa statusom ${res.status} bez poruke — pokreni`);
  console.log('    `npm ci --dry-run` ručno da vidiš razlog.)\n');
}
console.log('   POPRAVAK:  npm install        (pa commitaj package-lock.json)');
console.log('   ⚠️ NE:      npm install --package-lock-only');
console.log('      Ta zastavica gradi idealno stablo bez dodirivanja diska i kod');
console.log('      bundleDependencies vrati BAJT-IDENTIČAN lock — izgleda kao da si');
console.log('      popravio, a gate i dalje pada.\n');
console.log('   Bez ovoga `npm ci` obori SVA TRI CI joba prije ijednog testa.\n');
process.exit(1);
