// mcp-alati-check.js — ALATI CJEVOVODA kroz pravi MCP (F6 ②/2, ADR-031/038).
// Pokreni: npm run mcp:alati   (mrežno, STAGING-only, stvara i briše jednokratnog korisnika)
//
// ─── ŠTO TVRDI ──────────────────────────────────────────────────────────────────────────────────
// `mcp:nacrt` tvrdi što rade RPC-ovi nacrta kad ih se zove IZRAVNO. Ova brana tvrdi što rade ALATI
// kad ih zove korisnikov AI: Node MCP klijent s PRAVIM OAuth tokenom (isti put kao Claude) prolazi
// cijeli cjevovod na Edge Functionu `mcp`, a svaki učinak se PROČITA NATRAG iz baze (200 nije dokaz):
//
//   ① popis alata = točno onaj iz jezgre (`alati.ts`), i svaki koji stvara traži `repeat_key`
//   ② cjevovod: započni → Learn → kartice → pitanja → pročitaj → predaj; nacrt u bazi prolazi strogi profil
//   ③ redoslijed: kartice bez Learna i pitanja bez kartica PADAJU imenovano
//   ④ isti poziv dvaput NE duplicira: ni nacrt, ni lekciju, ni kartice (i verzija se ne mijenja)
//   ⑤ N9 uživo: odbijanje iz BAZE (validator, predan nacrt) stiže AI-ju prevedeno — HTTP 200 +
//      `isError`, imenovana vrsta — nikad 500 i nikad sirova poruka baze
//   ⑥ živo gradivo korisnika bajt-isto nakon svih poziva
//
// Adresa: `MCP_ALATI_URL` ili `<STAGING>/functions/v1/mcp`.
// Ishod: exit 1 = alati ne drže · exit 0 + SKIP = nema STAGING_* / SERVICE u `.env`.

const crypto = require('crypto');
const path = require('path');
const { pathToFileURL } = require('url');
const Ajv = require('ajv');
const {
  BASE, ANON, SERVICE,
  http, svcHeaders, ref, jeProdukcija, noviKorisnik, pometi, prijava, oauthToken, rpc
} = require('./lib/staging-oauth');
const { lekcija } = require('../tests/fixtures/ugc-sadrzaj');

/** Čegrtaljka dosega (kalup `check:final`): manje = blok tiho otpao, više = osnovica nije podignuta. */
const OCEKIVANO_PROVJERA = 30;

const MCP = String(process.env.MCP_ALATI_URL || BASE + '/functions/v1/mcp').replace(/\/+$/, '');

let failed = 0;
let touched = 0;
function record(name, pass, detail) {
  touched++;
  if (!pass) failed++;
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}
function skip(why) { console.log('⏭️  SKIP — ' + why); process.exit(0); }

/** JSON-RPC prema MCP-u. Odgovor zna biti SSE (`data: {…}`) ili čisti JSON — oba se čitaju. */
let rpcId = 0;
async function mcp(token, method, params) {
  const id = ++rpcId;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(MCP, {
      method: 'POST', signal: ctrl.signal,
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params: params || {} })
    });
    const tekst = await r.text();
    const poruke = /^\s*[{[]/.test(tekst) ? [tekst] : tekst.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5));
    let json = null;
    for (const p of poruke) { try { const o = JSON.parse(p); if (o && o.id === id) json = o; } catch (e) { /* nije JSON */ } }
    return { status: r.status, json, tekst: tekst.replace(/\s+/g, ' ').slice(0, 200) };
  } finally { clearTimeout(to); }
}

/** Poziv alata: HTTP broj, je li `isError`, i tijelo (JSON iz teksta alata, ili sirov tekst). */
async function alat(token, ime, args) {
  const r = await mcp(token, 'tools/call', { name: ime, arguments: args });
  const res = r.json && r.json.result;
  const t = res && res.content && res.content[0] && res.content[0].text;
  let tijelo = null;
  try { tijelo = JSON.parse(t); } catch (e) { tijelo = t === undefined ? null : { _tekst: t }; }
  return { status: r.status, isError: !!(res && res.isError), tijelo, rpcGreska: r.json && r.json.error, sirovo: r.tekst };
}
const opis = (r) => 'HTTP ' + r.status + (r.isError ? ' isError ' : ' ') +
  (r.rpcGreska ? 'rpc-greška ' + JSON.stringify(r.rpcGreska).slice(0, 120) : JSON.stringify(r.tijelo).slice(0, 140));
/** Odbijeno BAŠ tim imenom i vrstom, i to kao rezultat alata (200 + isError), ne kao 500. */
function odbijenKao(ime, r, kod, vrsta) {
  const ok = r.status === 200 && r.isError && r.tijelo && r.tijelo.error === kod && r.tijelo.kind === vrsta;
  record(ime, ok, opis(r) + (ok ? '' : ' ← očekivano 200 + isError ' + kod + '/' + vrsta));
}

/** Nacrt izravno iz tablice (service ključ) — čitanje natrag, ne vjerujemo odgovoru alata. */
async function nacrtUBazi(id) {
  const r = await http('/rest/v1/node_drafts?id=eq.' + id + '&select=id,owner_id,client_id,status,payload,verzija', { headers: svcHeaders() });
  return ((await r.json()) || [])[0] || null;
}
async function brojNacrta(uid) {
  return ((await (await http('/rest/v1/node_drafts?owner_id=eq.' + uid + '&select=id', { headers: svcHeaders() })).json()) || []).length;
}
async function otisakGradiva(uid) {
  const nodes = await (await http('/rest/v1/nodes?owner_id=eq.' + uid + '&select=*&order=id', { headers: svcHeaders() })).json();
  const ids = nodes.map((x) => x.id);
  const c = ids.length
    ? await (await http('/rest/v1/node_content?node_id=in.(' + ids.join(',') + ')&select=*&order=node_id', { headers: svcHeaders() })).json()
    : [];
  return { broj: nodes.length + '+' + c.length, hash: crypto.createHash('sha256').update(JSON.stringify([nodes, c])).digest('hex').slice(0, 16) };
}
const rest = (token, put) => http('/rest/v1/' + put, { headers: { apikey: ANON, Authorization: 'Bearer ' + token } });

(async () => {
  if (!BASE || !ANON) skip('nema STAGING_SUPABASE_URL / STAGING_SUPABASE_ANON u .env');
  if (!SERVICE) skip('nema STAGING_SUPABASE_SERVICE_KEY (brana stvara i briše jednokratnog korisnika)');
  if (jeProdukcija() || /naxjubnedhrbhsuasayu|sokratstudy\.com/.test(MCP)) {
    console.log('❌ ODBIJENO: ova brana piše i briše — PRODUKCIJA je zabranjena (CLAUDE #8).');
    process.exit(1);
  }
  console.log('\n=== mcp:alati === (staging ' + ref() + ')\n  konektor: ' + MCP + '\n');

  const JEZGRA = await import(pathToFileURL(path.join(__dirname, '..', 'supabase', 'functions', 'mcp', 'alati.ts')).href);
  const provjeriShemu = new Ajv({ allErrors: false, allowUnionTypes: true }).compile(require('../schema/ugc-content.schema.json'));

  const A = await noviKorisnik({ prefiks: 'mcp-alati' });
  const jA = await prijava(A.email, A.password);
  const oa = await oauthToken(jA, 'Sokrat alati (test)');
  const t = oa.token;

  // Živo gradivo (obična sesija), da ⑥ mjeri nešto, a ne prazan skup.
  const polica = (await rpc(jA, 'create_node', { p_parent: null, p_kind: 'folder', p_name: 'Polica' })).json;
  const mat = (await rpc(jA, 'create_node', { p_parent: polica, p_kind: 'study', p_name: 'Materijal' })).json;
  const verzija = ((await (await rest(jA, 'node_content?node_id=eq.' + mat + '&select=version')).json())[0] || {}).version;
  await rpc(jA, 'publish_node', { p_node_id: mat, p_payload: lekcija({ name: 'Živo' }), p_base_version: verzija });
  const prije = await otisakGradiva(A.id);

  console.log('— ① popis alata —');
  const init = await mcp(t, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'mcp-alati-check', version: '1' } });
  record('initialize s pravim tokenom → 200', init.status === 200 && !!(init.json && init.json.result), 'HTTP ' + init.status + ' ' + init.tekst.slice(0, 80));
  const upute = init.json && init.json.result && init.json.result.instructions;
  record('instructions = UPUTE iz jezgre (deployana je ova verzija)', upute === JEZGRA.UPUTE,
    upute === JEZGRA.UPUTE ? 'poslužitelj ' + JSON.stringify(init.json.result.serverInfo) : 'razlikuje se ← stara funkcija na stagingu?');
  const lista = await mcp(t, 'tools/list');
  const alati = (lista.json && lista.json.result && lista.json.result.tools) || [];
  const imena = alati.map((a) => a.name).sort();
  const ocekivano = JEZGRA.ALATI.map((a) => a.ime).sort();
  record('tools/list = točno alati iz jezgre (' + ocekivano.length + ')', JSON.stringify(imena) === JSON.stringify(ocekivano), imena.join(', ') || lista.tekst);
  const stvaraju = JEZGRA.ALATI.filter((a) => !a.samoCitanje && a.ime !== 'predaj_nacrt').map((a) => a.ime);
  const bezKljuca = stvaraju.filter((ime) => { const x = alati.find((a) => a.name === ime); return !x || !((x.inputSchema || {}).required || []).includes('repeat_key'); });
  record('svaki alat koji stvara oglašava obavezan repeat_key', stvaraju.length === 4 && bezKljuca.length === 0, bezKljuca.join(', ') || stvaraju.join(', '));

  console.log('\n— ② cjevovod —');
  const lekcije = [{ name: 'Uvod u makro', color: '#6366F1' }, { name: 'BDP', color: '#10b981' }];
  const z = await alat(t, 'zapocni_nacrt', { name: 'Makroekonomija (test)', repeat_key: 'razgovor-1:start', lessons: lekcije });
  const draftId = z.tijelo && z.tijelo.draft_id;
  record('zapocni_nacrt → nacrt s dvije lekcije', z.status === 200 && !z.isError && !!draftId && (z.tijelo.lessons || []).length === 2, opis(z));
  if (!draftId) {
    // Bez nacrta ostatak cjevovoda nema što mjeriti — izlaz je PAD, ne prazan prolaz.
    await pometi();
    console.log('\n  dotaknuto: ' + touched + ' provjera, palo: ' + failed + '\n✗ ALATI NE DRŽE — nacrt nije nastao, cjevovod nije mjeren\n');
    process.exit(1);
  }
  let d = await nacrtUBazi(draftId);
  record('… u bazi: vlasnik iz tokena, client_id tokena, lekcije l1/l2 s bojom', !!d && d.owner_id === A.id && d.client_id === oa.client_id &&
    JSON.stringify(Object.keys(d.payload).sort()) === '["l1","l2"]' && d.payload.l1.color === '#6366f1',
  d ? 'owner ok=' + (d.owner_id === A.id) + ' · client ok=' + (d.client_id === oa.client_id) + ' · ' + JSON.stringify(d.payload).slice(0, 90) : 'nema retka');
  const L = 'l2';

  odbijenKao('③ dodaj_kartice PRIJE Learna → alat_nema_learna', await alat(t, 'dodaj_kartice',
    { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:k1', cards: [{ question: 'Što je BDP?', answer: 'Vrijednost proizvodnje.' }] }), 'alat_nema_learna', 'ispravi');

  const learn = await alat(t, 'napisi_learn', { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:learn', title: 'BDP', blocks: [
    { type: 'heading', text: 'Što je BDP', level: 2 },
    { type: 'paragraph', text: [{ text: 'Bruto domaći proizvod', b: true }, { text: ' je vrijednost konačnih dobara i usluga.' }] },
    { type: 'list', items: ['proizvodni pristup', 'dohodovni pristup', 'rashodovni pristup'] }] });
  d = await nacrtUBazi(draftId);
  record('napisi_learn → u bazi 3 bloka s id-evima', !learn.isError && d && d.payload[L].learn && d.payload[L].learn.blocks.length === 3 &&
    d.payload[L].learn.blocks.every((b) => /^[A-Za-z0-9_-]+$/.test(b.id || '')), opis(learn));

  odbijenKao('③ dodaj_pitanja PRIJE kartica → alat_nema_kartica', await alat(t, 'dodaj_pitanja',
    { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:p1', quiz: [{ question: 'BDP mjeri?', options: ['proizvodnju', 'uvoz'], correct: 0 }] }), 'alat_nema_kartica', 'ispravi');

  const kartice = { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:k1', cards: [
    { question: 'Što je BDP?', answer: 'Vrijednost konačnih dobara i usluga proizvedenih u zemlji.' },
    { question: 'Tri pristupa BDP-u', answer: 'Proizvodni, dohodovni, rashodovni.' }] };
  const k1 = await alat(t, 'dodaj_kartice', kartice);
  d = await nacrtUBazi(draftId);
  const vPoKarticama = d && d.verzija;
  record('dodaj_kartice → u bazi 2 kartice', !k1.isError && d && (d.payload[L].flashcards || []).length === 2, opis(k1));

  console.log('\n— ④ isti poziv dvaput —');
  const k2 = await alat(t, 'dodaj_kartice', kartice);
  d = await nacrtUBazi(draftId);
  record('ponovljen dodaj_kartice (isti ključ) → i dalje 2 kartice, verzija ista', !k2.isError && d && d.payload[L].flashcards.length === 2 && d.verzija === vPoKarticama,
    'kartica ' + (d && d.payload[L].flashcards.length) + ' · verzija ' + vPoKarticama + '→' + (d && d.verzija));
  const z2 = await alat(t, 'zapocni_nacrt', { name: 'Makroekonomija (test)', repeat_key: 'razgovor-1:start', lessons: lekcije });
  record('ponovljen zapocni_nacrt (isti ključ) → ISTI nacrt', !z2.isError && z2.tijelo && z2.tijelo.draft_id === draftId, opis(z2));
  d = await nacrtUBazi(draftId);
  record('… korisnik i dalje ima 1 nacrt, 2 lekcije, a Learn i kartice netaknuti', (await brojNacrta(A.id)) === 1 && Object.keys(d.payload).length === 2 &&
    d.payload[L].flashcards.length === 2 && d.payload[L].learn.blocks.length === 3, 'nacrta ' + (await brojNacrta(A.id)) + ' · lekcija ' + Object.keys(d.payload).length);
  const k3 = await alat(t, 'dodaj_kartice', Object.assign({}, kartice, { repeat_key: 'razgovor-1:k2', cards: [{ question: 'Tko mjeri BDP?', answer: 'DZS.' }] }));
  d = await nacrtUBazi(draftId);
  record('kontrola: NOV ključ → kartica se DODA (3)', !k3.isError && d.payload[L].flashcards.length === 3, opis(k3));

  console.log('\n— ② pitanja, čitanje —');
  const p = await alat(t, 'dodaj_pitanja', { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:p1',
    quiz: [{ question: 'BDP mjeri?', options: ['proizvodnju', 'uvoz', 'inflaciju'], correct: 0 }],
    fill_blanks: [{ sentence: 'BDP je vrijednost _____ dobara i usluga.', answer: 'konačnih' }] });
  d = await nacrtUBazi(draftId);
  record('dodaj_pitanja → u bazi 1 kviz + 1 dopuna', !p.isError && (d.payload[L].quiz || []).length === 1 && (d.payload[L].fillBlanks || []).length === 1, opis(p));
  record('nacrt u bazi prolazi STROGI profil (ugc-content.schema.json)', provjeriShemu(d.payload), JSON.stringify(provjeriShemu.errors && provjeriShemu.errors[0]) || 'ok');
  const citaj = await alat(t, 'procitaj_nacrt', {});
  record('procitaj_nacrt bez id-a → popis s ovim nacrtom', !citaj.isError && (citaj.tijelo.drafts || []).some((x) => x.draft_id === draftId), opis(citaj));
  const citaj2 = await alat(t, 'procitaj_nacrt', { draft_id: draftId });
  const s2 = citaj2.tijelo && (citaj2.tijelo.lessons || []).find((x) => x.lesson_id === L);
  record('procitaj_nacrt s id-om → sažetak lekcije (3 bloka, 3 kartice, 1 kviz, 1 dopuna)', !!s2 && s2.learn_blocks === 3 && s2.cards === 3 && s2.quiz === 1 && s2.fill_blanks === 1, opis(citaj2));
  const citaj3 = await alat(t, 'procitaj_nacrt', { draft_id: draftId, lesson_id: L });
  record('procitaj_nacrt s lekcijom → puni sadržaj lekcije', !citaj3.isError && citaj3.tijelo.lesson && citaj3.tijelo.lesson.flashcards.length === 3, opis(citaj3));
  const mat2 = await alat(t, 'procitaj_materijale', {});
  record('procitaj_materijale i dalje radi (vidi vlastiti materijal)', !mat2.isError && /Materijal/.test(JSON.stringify(mat2.tijelo)), opis(mat2));

  console.log('\n— ⑤ N9 uživo: odbijanje BAZE stiže prevedeno —');
  const zlo = await alat(t, 'napisi_learn', { draft_id: draftId, lesson_id: 'l1', repeat_key: 'razgovor-1:zlo',
    blocks: [{ type: 'paragraph', text: [{ text: 'klik', href: 'javascript:alert(1)' }] }] });
  odbijenKao('validator u bazi odbije `javascript:` poveznicu → sadrzaj_neispravan / ispravi', zlo, 'sadrzaj_neispravan', 'ispravi');
  record('… uz razlog koji AI može ispraviti, bez SQL-a i unutarnjih imena', !!zlo.tijelo && /content rule/.test(zlo.tijelo.message || '') &&
    !/node_drafts|_provjeri_sadrzaj|plpgsql|PGRST|SQLSTATE/.test(JSON.stringify(zlo.tijelo)), (zlo.tijelo && zlo.tijelo.message || '').slice(0, 140));
  d = await nacrtUBazi(draftId);
  record('… a lekcija l1 u bazi NIJE dobila Learn', !d.payload.l1.learn, JSON.stringify(d.payload.l1).slice(0, 80));
  // Samo NEPOSTOJEĆI: tuđi nacrt mjeri `mcp:nacrt` ② na RPC-u (alat samo prosljeđuje poziv).
  odbijenKao('nepostojeći nacrt → nacrt_ne_postoji / stop', await alat(t, 'procitaj_nacrt', { draft_id: '00000000-0000-4000-8000-000000000000' }), 'nacrt_ne_postoji', 'stop');

  console.log('\n— ② predaja —');
  const pr = await alat(t, 'predaj_nacrt', { draft_id: draftId });
  d = await nacrtUBazi(draftId);
  record('predaj_nacrt → u bazi status predan', !pr.isError && d.status === 'predan', opis(pr));
  odbijenKao('upis nakon predaje → nacrt_predan / stop (predan je zamrznut)', await alat(t, 'napisi_learn',
    { draft_id: draftId, lesson_id: L, repeat_key: 'razgovor-1:kasno', blocks: [{ type: 'paragraph', text: 'kasno' }] }), 'nacrt_predan', 'stop');
  const dPoslije = await nacrtUBazi(draftId);
  record('… nacrt poslije odbijenog upisa bajt-isti', JSON.stringify(dPoslije.payload) === JSON.stringify(d.payload) && dPoslije.verzija === d.verzija, 'verzija ' + dPoslije.verzija);
  odbijenKao('loš ulaz (bez repeat_key) → alat_los_ulaz / ispravi, bez upisa', await alat(t, 'zapocni_nacrt',
    { name: 'X', lessons: lekcije }), 'alat_los_ulaz', 'ispravi');
  record('… i nijedan nov nacrt nije nastao', (await brojNacrta(A.id)) === 1, 'nacrta ' + (await brojNacrta(A.id)));

  console.log('\n— ⑥ živo gradivo —');
  const poslije = await otisakGradiva(A.id);
  record('nodes + node_content korisnika bajt-isti nakon SVIH poziva alata', prije.hash === poslije.hash && prije.broj === '2+1',
    'prije ' + prije.broj + ' ' + prije.hash + ' · poslije ' + poslije.broj + ' ' + poslije.hash);

  record('doseg: izvedeno točno ' + OCEKIVANO_PROVJERA + ' provjera', touched === OCEKIVANO_PROVJERA,
    touched === OCEKIVANO_PROVJERA ? '' : 'izvedeno ' + touched +
      (touched < OCEKIVANO_PROVJERA ? ' ← BLOK JE PRESKOČEN' : ' ← nova provjera bez podignute osnovice'));

  await pometi();
  console.log('\n  dotaknuto: ' + touched + ' provjera, palo: ' + failed);
  console.log(failed ? '✗ ALATI NE DRŽE\n' : '✅ alati drže\n');
  process.exit(failed ? 1 : 0);
})().catch(async (e) => {
  await pometi();
  console.log('✗ brana je pukla: ' + e.message);
  process.exit(1);
});
