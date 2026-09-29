// mcp-nacrt-check.js — NACRT od AI-ja (F6 ②/1, ADR-038 ①): AI piše SAMO u vlastiti nacrt.
// Pokreni: npm run mcp:nacrt   (mrežno, STAGING-only, stvara i briše jednokratne korisnike)
//
// ─── ŠTO TVRDI ──────────────────────────────────────────────────────────────────────────────────
// `mcp:brava` tvrdi DA je tokenu AI-ja otvoreno točno pet `mcp_*` funkcija. Ova brana tvrdi ŠTO te
// funkcije rade — jer su SECURITY DEFINER i time ZAOBILAZE RLS: provjera vlasnika u njima jedina je
// brava nad tuđim nacrtom. Mjeri se PRAVIM OAuth tokenom (isti put kao Claude), nikad simulacijom.
//
//   ① vlastiti nacrt: nastane, upis se PROČITA NATRAG (200 nije dokaz upisa), popis ga vidi
//   ② TUĐI nacrt: drugi korisnikov AI ga ne čita, ne mijenja, ne predaje, ne vidi na popisu — i
//      dobije ISTU grešku kao za id koji ne postoji (inače pogađanjem doznaje da postoji)
//   ③ obična sesija: vidi SAMO svoje nacrte, a ne piše u njih ni RPC-om ni izravno
//   ④ oblik i veličina: ne-objekt i > 1 MB odbijeni; prazan se ne predaje; predan je ZAMRZNUT
//   ⑤ kvota (Leon, 29.09.): 3 u izradi · 10 nepregledanih
//   ⑥ „sam nestane": u izradi netaknut 7 dana = nepostojeći i ne troši kvotu; PREDAN ne istječe
//   ⑦ ŽIVO GRADIVO NETAKNUTO: vlasnikovi `nodes` + `node_content` bajt-isti nakon SVIH poziva
//
// ⚠️ Greške se sude po IMENU iz poruke (`nacrt_ne_postoji` …), ne po HTTP broju: PostgREST istim
//    brojem vraća i „nema rute" (PGRST202) — brana na broj bila bi zelena i na nepostojećoj funkciji.
//
// Ishod: exit 1 = nacrt ne drži · exit 0 + SKIP = nema STAGING_* / SERVICE u `.env`.

const crypto = require('crypto');
const {
  BASE, ANON, SERVICE, NULA,
  http, svcHeaders, ref, jeProdukcija, odbijen, noviKorisnik, pometi, prijava, oauthToken, rpc
} = require('./lib/staging-oauth');

/** Čegrtaljka dosega (kalup `check:final`): manje = blok tiho otpao, više = osnovica nije podignuta. */
const OCEKIVANO_PROVJERA = 33;

let failed = 0;
let touched = 0;
function record(name, pass, detail) {
  touched++;
  if (!pass) failed++;
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}
function skip(why) { console.log('⏭️  SKIP — ' + why); process.exit(0); }

/** Ime greške iz odgovora (`nacrt_kvota_u_izradi: …` → `nacrt_kvota_u_izradi`), ili '' ako je prošlo. */
function greska(r) {
  if (r.status < 400) return '';
  const poruka = (r.json && r.json.message) || r.tekst || '';
  return (poruka.match(/^([a-z_]+)/) || [])[1] || ('HTTP ' + r.status);
}
const opis = (r) => 'HTTP ' + r.status + ' ' + (greska(r) || r.tekst.replace(/\s+/g, ' ').slice(0, 80));

/** Tvrdi da je poziv odbijen BAŠ tim imenom greške. */
function odbijenKao(ime, r, kod) {
  record(ime, greska(r) === kod, opis(r) + (greska(r) === kod ? '' : ' ← očekivano ' + kod));
}

/** Isti sadržaj bez obzira na redoslijed ključeva — `jsonb` ih sprema sortirane po svom (izmjereno 29.09.). */
const kanon = (v) => Array.isArray(v) ? v.map(kanon) : (v && typeof v === 'object'
  ? Object.keys(v).sort().reduce((o, k) => (o[k] = kanon(v[k]), o), {}) : v);
const isto = (a, b) => JSON.stringify(kanon(a)) === JSON.stringify(kanon(b));

const tijeloZa = (oznaka) => ({ lekcije: [{ naslov: 'Lekcija ' + oznaka, boja: 'indigo', learn: 'Tekst ' + oznaka }] });

/** Otisak vlasnikovog ŽIVOG gradiva (service ključ, zaobilazi RLS) — za tvrdnju ⑦. */
async function otisakGradiva(uid) {
  const n = await http('/rest/v1/nodes?owner_id=eq.' + uid + '&select=*&order=id', { headers: svcHeaders() });
  const nodes = await n.json();
  const ids = nodes.map((x) => x.id);
  const c = ids.length
    ? await (await http('/rest/v1/node_content?node_id=in.(' + ids.join(',') + ')&select=*&order=node_id', { headers: svcHeaders() })).json()
    : [];
  return { broj: nodes.length + '+' + c.length,
    hash: crypto.createHash('sha256').update(JSON.stringify([nodes, c])).digest('hex').slice(0, 16) };
}

/** Nacrti korisnika izravno iz tablice (service ključ) — za ⑥ fizičko brisanje. */
async function nacrtiUBazi(uid) {
  return (await http('/rest/v1/node_drafts?owner_id=eq.' + uid + '&select=id,status,updated_at', { headers: svcHeaders() })).json();
}

/** Postavi `updated_at` nacrta u prošlost — jedini način da se 7 dana izmjeri bez čekanja. */
async function ostari(id, dana) {
  const kad = new Date(Date.now() - dana * 86400000).toISOString();
  const r = await http('/rest/v1/node_drafts?id=eq.' + id, {
    method: 'PATCH', headers: Object.assign(svcHeaders(), { Prefer: 'return=minimal' }),
    body: JSON.stringify({ updated_at: kad })
  });
  if (!r.ok) throw new Error('ostari ' + r.status + ': ' + (await r.text()).slice(0, 120));
}

const rest = (token, put, opts = {}) => http('/rest/v1/' + put, Object.assign({}, opts, {
  headers: Object.assign({ apikey: ANON, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, opts.headers || {})
}));

(async () => {
  if (!BASE || !ANON) skip('nema STAGING_SUPABASE_URL / STAGING_SUPABASE_ANON u .env');
  if (!SERVICE) skip('nema STAGING_SUPABASE_SERVICE_KEY (brana stvara i briše jednokratne korisnike)');
  if (jeProdukcija()) {
    console.log('❌ ODBIJENO: ova brana piše i briše — PRODUKCIJA je zabranjena (CLAUDE #8).');
    process.exit(1);
  }
  console.log('\n=== mcp:nacrt === (staging ' + ref() + ')\n');

  // Tri korisnika: A (vlasnik), B (stranac), C (kvota i istjecanje — da brojanje ne ovisi o A).
  const [A, B, C] = [await noviKorisnik({ prefiks: 'mcp-nacrt' }), await noviKorisnik({ prefiks: 'mcp-nacrt' }),
    await noviKorisnik({ prefiks: 'mcp-nacrt' })];
  const jA = await prijava(A.email, A.password);
  const jB = await prijava(B.email, B.password);
  const jC = await prijava(C.email, C.password);
  const aA = (await oauthToken(jA, 'Sokrat nacrt (test)')).token;
  const aB = (await oauthToken(jB, 'Sokrat nacrt (test)')).token;
  const aC = (await oauthToken(jC, 'Sokrat nacrt (test)')).token;

  // A ima pravo živo gradivo (polica + materijal sa sadržajem), napravljeno OBIČNOM sesijom —
  // da ⑦ mjeri nešto, a ne prazan skup.
  const polica = (await rpc(jA, 'create_node', { p_parent: null, p_kind: 'folder', p_name: 'Polica' })).json;
  const mat = (await rpc(jA, 'create_node', { p_parent: polica, p_kind: 'study', p_name: 'Materijal' })).json;
  const verzija = ((await (await rest(jA, 'node_content?node_id=eq.' + mat + '&select=version')).json())[0] || {}).version;
  await rpc(jA, 'publish_node', { p_node_id: mat, p_payload: { m1: { naslov: 'Živo' } }, p_base_version: verzija });
  const prije = await otisakGradiva(A.id);

  console.log('— ① vlastiti nacrt —');
  const z = await rpc(aA, 'mcp_zapocni_nacrt', { p_name: 'Makroekonomija' });
  const idA = typeof z.json === 'string' ? z.json : null;
  record('AI započne nacrt', !!idA, opis(z));
  const sadrzaj = tijeloZa('A');
  const u = await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: sadrzaj });
  const p = await rpc(aA, 'mcp_procitaj_nacrt', { p_id: idA });
  record('upis se PROČITA NATRAG (isti sadržaj, status u_izradi)',
    u.status === 200 && p.json && isto(p.json.payload, sadrzaj) && p.json.status === 'u_izradi',
    'upis ' + opis(u) + ' · čitanje ' + opis(p));
  const lista = await rpc(aA, 'mcp_moji_nacrti', {});
  record('popis vlastitih nacrta ga vidi (bez sadržaja)',
    Array.isArray(lista.json) && lista.json.length === 1 && lista.json[0].id === idA && !('payload' in lista.json[0]),
    opis(lista) + ' · ' + (Array.isArray(lista.json) ? lista.json.length + ' nacrt(a)' : '—'));

  console.log('\n— ② tuđi nacrt: drugi korisnikov AI —');
  const tudjeCit = await rpc(aB, 'mcp_procitaj_nacrt', { p_id: idA });
  odbijenKao('tuđi nacrt se NE ČITA', tudjeCit, 'nacrt_ne_postoji');
  odbijenKao('tuđi nacrt se NE MIJENJA', await rpc(aB, 'mcp_upisi_nacrt', { p_id: idA, p_payload: tijeloZa('B') }), 'nacrt_ne_postoji');
  odbijenKao('tuđi nacrt se NE PREDAJE', await rpc(aB, 'mcp_predaj_nacrt', { p_id: idA }), 'nacrt_ne_postoji');
  const nepostojeci = await rpc(aB, 'mcp_procitaj_nacrt', { p_id: NULA });
  record('tuđi i nepostojeći nacrt daju ISTI odgovor (postojanje se ne da pogoditi)',
    tudjeCit.status === nepostojeci.status && tudjeCit.tekst === nepostojeci.tekst,
    'tuđi ' + opis(tudjeCit) + ' · nepostojeći ' + opis(nepostojeci));
  const listaB = await rpc(aB, 'mcp_moji_nacrti', {});
  record('tuđi nacrt nije na strančevom popisu', Array.isArray(listaB.json) && listaB.json.length === 0, opis(listaB));
  const nakonB = await rpc(aA, 'mcp_procitaj_nacrt', { p_id: idA });
  record('A-ov nacrt je poslije strančevih pokušaja NETAKNUT',
    nakonB.json && isto(nakonB.json.payload, sadrzaj) && nakonB.json.status === 'u_izradi',
    nakonB.json ? 'status ' + nakonB.json.status : opis(nakonB));

  console.log('\n— ③ obična sesija (bez AI-ja) —');
  const vidiA = await (await rest(jA, 'node_drafts?select=id')).json();
  record('vlasnik u običnoj sesiji VIDI svoj nacrt (za pregled u ②/4)',
    Array.isArray(vidiA) && vidiA.length === 1 && vidiA[0].id === idA, JSON.stringify(vidiA).slice(0, 80));
  const vidiB = await (await rest(jB, 'node_drafts?select=id')).json();
  record('stranac u običnoj sesiji NE VIDI tuđi nacrt', Array.isArray(vidiB) && vidiB.length === 0, JSON.stringify(vidiB).slice(0, 80));
  const rpcObicna = await rpc(jA, 'mcp_zapocni_nacrt', { p_name: 'Mimo AI-ja' });
  record('obična sesija NE ZOVE mcp_* (put u nacrt je samo AI-jev)', odbijen(rpcObicna.status, rpcObicna.tekst), opis(rpcObicna));
  const ins = await rest(jA, 'node_drafts', { method: 'POST', headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ owner_id: A.id, client_id: 'lazni', name: 'Izravno' }) });
  record('izravan INSERT u node_drafts odbijen', ins.status === 401 || ins.status === 403, 'HTTP ' + ins.status);
  const upd = await rest(jA, 'node_drafts?id=eq.' + idA, { method: 'PATCH', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status: 'predan', submitted_at: new Date().toISOString() }) });
  record('izravan UPDATE vlastitog nacrta odbijen', upd.status === 401 || upd.status === 403, 'HTTP ' + upd.status);
  const del = await rest(jA, 'node_drafts?id=eq.' + idA, { method: 'DELETE', headers: { Prefer: 'return=representation' } });
  record('izravan DELETE odbijen (Odbaci je ②/4, kroz RPC)', del.status === 401 || del.status === 403, 'HTTP ' + del.status);
  const aiTablica = await rest(aA, 'node_drafts?select=id');
  record('AI ne čita tablicu izravno (samo kroz mcp_procitaj_nacrt)',
    aiTablica.status === 401 || aiTablica.status === 403, 'HTTP ' + aiTablica.status);

  console.log('\n— ④ oblik, veličina, predaja —');
  odbijenKao('sadržaj koji nije objekt odbijen', await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: [1, 2] }), 'nacrt_los_oblik');
  const golem = { lekcije: [{ learn: 'x'.repeat(1048576) }] };
  odbijenKao('sadržaj > 1 MB odbijen', await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: golem }), 'nacrt_prevelik');
  const tik = { l: 'x'.repeat(1048576 - 9) };   // omotač `{"l": ""}` = 9 bajtova → ukupno TOČNO 1 048 576 u `jsonb::text`
  const tikR = await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: tik });
  record('sadržaj TOČNO 1 MB prolazi (granica nije pomaknuta)', tikR.status === 200, opis(tikR));
  await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: sadrzaj });
  const prazan = (await rpc(aA, 'mcp_zapocni_nacrt', { p_name: 'Prazan' })).json;
  odbijenKao('prazan nacrt se ne predaje', await rpc(aA, 'mcp_predaj_nacrt', { p_id: prazan }), 'nacrt_prazan');
  const pred = await rpc(aA, 'mcp_predaj_nacrt', { p_id: idA });
  const poPredaji = await rpc(aA, 'mcp_procitaj_nacrt', { p_id: idA });
  record('predaja: status predan + vrijeme predaje', pred.status === 200 && poPredaji.json && poPredaji.json.status === 'predan'
    && !!poPredaji.json.submitted_at, opis(pred));
  odbijenKao('predan nacrt se više NE MIJENJA', await rpc(aA, 'mcp_upisi_nacrt', { p_id: idA, p_payload: tijeloZa('kasno') }), 'nacrt_predan');
  odbijenKao('predan nacrt se ne predaje drugi put', await rpc(aA, 'mcp_predaj_nacrt', { p_id: idA }), 'nacrt_predan');

  console.log('\n— ⑤ kvota (korisnik C) —');
  const izrada = [];
  for (let i = 0; i < 3; i++) izrada.push((await rpc(aC, 'mcp_zapocni_nacrt', { p_name: 'C' + i })).json);
  record('tri nacrta u izradi nastanu', izrada.every((x) => typeof x === 'string'), izrada.length + ' id-eva');
  odbijenKao('ČETVRTI nacrt u izradi odbijen', await rpc(aC, 'mcp_zapocni_nacrt', { p_name: 'C3' }), 'nacrt_kvota_u_izradi');

  console.log('\n— ⑥ „sam nestane" (korisnik C) —');
  await ostari(izrada[0], 8);
  odbijenKao('nacrt u izradi netaknut 8 dana više NE POSTOJI za AI', await rpc(aC, 'mcp_procitaj_nacrt', { p_id: izrada[0] }), 'nacrt_ne_postoji');
  const vidiC = await (await rest(jC, 'node_drafts?select=id')).json();
  record('ni vlasnik ga u običnoj sesiji više ne vidi', Array.isArray(vidiC) && !vidiC.some((d) => d.id === izrada[0]),
    (Array.isArray(vidiC) ? vidiC.length : '?') + ' vidljivih');
  const noviC = await rpc(aC, 'mcp_zapocni_nacrt', { p_name: 'C-poslije' });
  record('istekao nacrt NE troši kvotu (novi prolazi uz 2 živa u izradi)', typeof noviC.json === 'string', opis(noviC));
  const uBazi = await nacrtiUBazi(C.id);
  record('istekao nacrt je FIZIČKI obrisan pri sljedećem započinjanju', !uBazi.some((d) => d.id === izrada[0]),
    uBazi.length + ' redaka u tablici');
  // Predan nacrt NE istječe: ostari ga i provjeri da je i dalje tu.
  await rpc(aC, 'mcp_upisi_nacrt', { p_id: izrada[1], p_payload: tijeloZa('C1') });
  await rpc(aC, 'mcp_predaj_nacrt', { p_id: izrada[1] });
  await ostari(izrada[1], 30);
  const stari = await rpc(aC, 'mcp_procitaj_nacrt', { p_id: izrada[1] });
  record('PREDAN nacrt star 30 dana i dalje postoji (čeka korisnikov pregled)',
    stari.json && stari.json.status === 'predan', opis(stari));

  // Do 10 nepregledanih: sad su živa 3 (C1 predan, C2 i C-poslije u izradi). Predaj ih i dopuni.
  for (const id of [izrada[2], noviC.json]) {
    await rpc(aC, 'mcp_upisi_nacrt', { p_id: id, p_payload: tijeloZa('C') });
    await rpc(aC, 'mcp_predaj_nacrt', { p_id: id });
  }
  let dopuna = 0;
  while ((await rpc(aC, 'mcp_moji_nacrti', {})).json.length < 10 && dopuna < 12) {
    const id = (await rpc(aC, 'mcp_zapocni_nacrt', { p_name: 'D' + dopuna })).json;
    await rpc(aC, 'mcp_upisi_nacrt', { p_id: id, p_payload: tijeloZa('D') });
    await rpc(aC, 'mcp_predaj_nacrt', { p_id: id });
    dopuna++;
  }
  const deset = (await rpc(aC, 'mcp_moji_nacrti', {})).json;
  record('deset nepregledanih nacrta nastane', Array.isArray(deset) && deset.length === 10, (deset || []).length + ' živih');
  odbijenKao('JEDANAESTI nacrt odbijen (10 čeka pregled)', await rpc(aC, 'mcp_zapocni_nacrt', { p_name: 'C11' }), 'nacrt_kvota_nepregledano');

  console.log('\n— ⑦ živo gradivo —');
  const poslije = await otisakGradiva(A.id);
  record('vlasnikovi nodes + node_content bajt-isti nakon SVIH MCP poziva',
    prije.hash === poslije.hash && prije.broj === '2+1', 'prije ' + prije.broj + ' ' + prije.hash + ' · poslije ' + poslije.broj + ' ' + poslije.hash);

  record('doseg: izvedeno točno ' + OCEKIVANO_PROVJERA + ' provjera', touched === OCEKIVANO_PROVJERA,
    touched === OCEKIVANO_PROVJERA ? '' : 'izvedeno ' + touched +
      (touched < OCEKIVANO_PROVJERA ? ' ← BLOK JE PRESKOČEN' : ' ← nova provjera bez podignute osnovice'));

  await pometi();
  console.log('\n  dotaknuto: ' + touched + ' provjera, palo: ' + failed);
  console.log(failed ? '✗ NACRT NE DRŽI\n' : '✅ nacrt drži\n');
  process.exit(failed ? 1 : 0);
})().catch(async (e) => {
  await pometi();
  console.log('✗ brana je pukla: ' + e.message);
  process.exit(1);
});
