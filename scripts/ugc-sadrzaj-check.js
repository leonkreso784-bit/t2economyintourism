// ugc-sadrzaj-check.js — BAZA provodi strogi profil osobnog sadržaja na putovima upisa (F6 ②/0a–b):
// danas NACRT (②/0a); objava `publish_node` ulazi u ②/0b, Prihvati u ②/4 — svaki put dobiva svoj blok.
// Pokreni: npm run ugc:sadrzaj   (mrežno, STAGING-only, stvara i briše jednokratne korisnike)
//
// ─── ZAŠTO BAZA, A NE MCP POSLUŽITELJ ───────────────────────────────────────────────────────────
// Token AI-ja zove `mcp_*` RPC-ove i MIMO našeg poslužitelja (MCP_SECURITY N5, izmjereno S-B: svih 8
// zlonamjernih oblika ušlo je u nacrt). Korisnik nacrt GLEDA prije Prihvati, pa sigurnosno pravilo
// koje živi samo u poslužitelju ne vrijedi baš ondje gdje treba. Zato ga provodi baza.
//
// ─── ŠTO TVRDI ──────────────────────────────────────────────────────────────────────────────────
//   ① nacrt (`mcp_upisi_nacrt`, pravi AI-token): svaki primjer iz `pada` odbijen BAŠ imenom
//      `sadrzaj_neispravan`; svaki iz `prolazi` upisan i PROČITAN NATRAG isti
//   ③ shema u bazi je bajt-ista datoteci `schema/ugc-content.schema.json` (živi drift — generirana
//      kopija u SQL-u može biti ispravna u repou a stara na stagingu)
//
// Primjeri su ZAJEDNIČKI s unit-testom sheme (`tests/fixtures/ugc-sadrzaj.js`): baza i shema se ne
// mogu razići a da jedna od dviju brana to ne vidi.
//
// ⚠️ Greška se sudi po IMENU (`sadrzaj_neispravan`), ne po HTTP broju: odbijanje iz bilo kojeg
//    drugog razloga (veličina, oblik, nepostojeća funkcija) nije dokaz da validator radi.
//
// Ishod: exit 1 = baza propušta · exit 0 + SKIP = nema STAGING_* / SERVICE u `.env`.

const fs = require('fs');
const path = require('path');
const {
  BASE, ANON, SERVICE,
  http, svcHeaders, ref, jeProdukcija, noviKorisnik, pometi, prijava, oauthToken, rpc
} = require('./lib/staging-oauth');
const { prolazi, pada } = require('../tests/fixtures/ugc-sadrzaj');

let failed = 0;
let touched = 0;
function record(name, pass, detail) {
  touched++;
  if (!pass) failed++;
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}
function skip(why) { console.log('⏭️  SKIP — ' + why); process.exit(0); }

function greska(r) {
  if (r.status < 400) return '';
  const poruka = (r.json && r.json.message) || r.tekst || '';
  return (poruka.match(/^([a-z_]+)/) || [])[1] || ('HTTP ' + r.status);
}
const opis = (r) => 'HTTP ' + r.status + ' ' + (greska(r) || '')
  + (r.status >= 400 ? ' · ' + ((r.json && r.json.message) || r.tekst || '').replace(/\s+/g, ' ').slice(0, 90) : '');

const kanon = (v) => Array.isArray(v) ? v.map(kanon) : (v && typeof v === 'object'
  ? Object.keys(v).sort().reduce((o, k) => (o[k] = kanon(v[k]), o), {}) : v);
const isto = (a, b) => JSON.stringify(kanon(a)) === JSON.stringify(kanon(b));

(async () => {
  if (!BASE || !ANON) skip('nema STAGING_SUPABASE_URL / STAGING_SUPABASE_ANON u .env');
  if (!SERVICE) skip('nema STAGING_SUPABASE_SERVICE_KEY (brana stvara i briše jednokratne korisnike)');
  if (jeProdukcija()) {
    console.log('❌ ODBIJENO: ova brana piše i briše — PRODUKCIJA je zabranjena (CLAUDE #8).');
    process.exit(1);
  }
  console.log('\n=== ugc:sadrzaj === (staging ' + ref() + ')\n');
  if (pada.length < 30 || prolazi.length < 10) { console.log('❌ premalo primjera — brana ne bi mjerila ništa'); process.exit(1); }

  const A = await noviKorisnik({ prefiks: 'ugc-sadrzaj' });
  const jA = await prijava(A.email, A.password);
  const aA = (await oauthToken(jA, 'Sokrat sadrzaj (test)')).token;

  console.log('— ① nacrt: mcp_upisi_nacrt (pravi AI-token) —');
  const nacrt = (await rpc(aA, 'mcp_zapocni_nacrt', { p_name: 'Validator' })).json;
  if (typeof nacrt !== 'string') throw new Error('nacrt nije nastao');
  for (const p of pada) {
    const r = await rpc(aA, 'mcp_upisi_nacrt', { p_id: nacrt, p_payload: p.payload });
    const ime = p.jsonbOdbija ? 'unsupported' : 'sadrzaj_neispravan';
    record('ODBIJEN: ' + p.ime, greska(r) === ime, opis(r) + (greska(r) === ime ? '' : ' ← očekivano ' + ime));
  }
  for (const p of prolazi) {
    const u = await rpc(aA, 'mcp_upisi_nacrt', { p_id: nacrt, p_payload: p.payload });
    const c = u.status === 200 ? await rpc(aA, 'mcp_procitaj_nacrt', { p_id: nacrt }) : null;
    record('PRIMLJEN i pročitan natrag: ' + p.ime, !!(c && c.json && isto(c.json.payload, p.payload)), opis(u));
  }

  console.log('\n— ③ shema u bazi == datoteka —');
  const dat = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'schema', 'ugc-content.schema.json'), 'utf8'));
  const r = await http('/rest/v1/rpc/_ugc_shema', { method: 'POST', headers: svcHeaders(), body: '{}' });
  const uBazi = r.ok ? await r.json() : null;
  record('`_ugc_shema()` na stagingu == schema/ugc-content.schema.json', !!uBazi && isto(uBazi, dat),
    r.ok ? (isto(uBazi, dat) ? '' : 'RAZLIKUJE SE — pokreni build:ugc-sql i primijeni SQL') : 'HTTP ' + r.status);

  const ocekivano = pada.length + prolazi.length + 1;
  record('doseg: izvedeno točno ' + ocekivano + ' provjera', touched === ocekivano, 'izvedeno ' + touched);

  await pometi();
  console.log('\n  dotaknuto: ' + touched + ' provjera, palo: ' + failed);
  console.log(failed ? '✗ BAZA PROPUŠTA\n' : '✅ baza drži profil\n');
  process.exit(failed ? 1 : 0);
})().catch(async (e) => {
  await pometi();
  console.log('✗ brana je pukla: ' + e.message);
  process.exit(1);
});
