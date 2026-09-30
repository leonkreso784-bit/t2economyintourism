/* eslint-disable no-console */
// ===== MCP (F6 ①/1) — jezgra alata + omot Edge Functiona, BEZ mreže =====
// Pokreni: node tests/unit/mcp-alati.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: MCP je vrata na koja ulazi TUĐI model s korisnikovim tokenom (ADR-030/031/038).
// Dvije stvari se tvrde prije ijednog pravog poziva:
//   ① ŠTO alat vraća — stablo polica i materijala, izričiti stupci (nikad `*`: novi stupac u
//     `nodes` ne smije tiho procuriti AI-ju), bez obrisanih čvorova, i nijedan materijal ne nestaje
//     iz odgovora samo zato što mu roditelj nije u popisu;
//   ② ŠTO omot NE SMIJE — admin-klijent, service_role, tajni ključ, upis bilo koje vrste (brava
//     za token s `client_id` još ne postoji, ①/2), plutajuće verzije paketa (pravilo #9) i
//     nestabilni `pipeline` oblik `@supabase/server`-a.
// Jezgra je `.ts` bez ijednog Deno-uvoza → Node 24 je učita izravno (kalup mail-core.test.js).

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const KORIJEN = path.join(__dirname, '..', '..');
const MAPA = path.join(KORIJEN, 'supabase', 'functions', 'mcp');
let pao = 0;
let proslo = 0;
const test = async (ime, fn) => {
  try { await fn(); proslo++; console.log('  ✓ ' + ime); }
  catch (e) { pao++; console.log('  ✗ ' + ime + '\n      ' + e.message); }
};

const cvor = (id, parent_id, kind, name, position) => ({ id, parent_id, kind, name, position, updated_at: '2026-09-17T00:00:00Z' });

/** Lažni supabase-js klijent koji pamti što je alat tražio. */
function lazniKlijent(redovi, greska) {
  const zapis = {};
  return {
    zapis,
    from(t) {
      zapis.tablica = t;
      return {
        select(s) {
          zapis.stupci = s;
          return {
            is(st, v) {
              zapis.filter = [st, v];
              return {
                order(st2, o) {
                  zapis.redoslijed = [st2, o];
                  return Promise.resolve({ data: greska ? null : redovi, error: greska || null });
                }
              };
            }
          };
        }
      };
    }
  };
}

(async () => {
  console.log('\n=== MCP alati (F6 ①/1) ===\n');
  const A = await import(pathToFileURL(path.join(MAPA, 'alati.ts')).href);

  await test('stablo: police nose djecu, redom `position`, vrsta i naziv na hrvatskom ključu', () => {
    const s = A.slozStablo([
      cvor('m2', 'p1', 'study', 'Drugi', 1),
      cvor('p1', null, 'folder', 'Ekonomija', 0),
      cvor('m1', 'p1', 'study', 'Prvi', 0),
      cvor('m0', null, 'study', 'Slobodni', 1)
    ]);
    assert.deepStrictEqual(s, [
      { id: 'p1', vrsta: 'polica', naziv: 'Ekonomija', djeca: [
        { id: 'm1', vrsta: 'materijal', naziv: 'Prvi' },
        { id: 'm2', vrsta: 'materijal', naziv: 'Drugi' }
      ] },
      { id: 'm0', vrsta: 'materijal', naziv: 'Slobodni' }
    ]);
  });

  await test('materijal čiji roditelj nije u popisu NE nestaje — ide u korijen', () => {
    const s = A.slozStablo([cvor('m9', 'nema-ga', 'study', 'Siroce', 0)]);
    assert.deepStrictEqual(s, [{ id: 'm9', vrsta: 'materijal', naziv: 'Siroce' }]);
  });

  await test('ciklus u podacima ne vrti beskonačno', () => {
    const s = A.slozStablo([cvor('a', null, 'folder', 'A', 0), cvor('b', 'a', 'folder', 'B', 0)]);
    assert.strictEqual(s[0].djeca[0].id, 'b');
  });

  await test('alat čita IZRIČITE stupce iz `nodes`, bez obrisanih, redom position', async () => {
    const k = lazniKlijent([cvor('m1', null, 'study', 'X', 0)]);
    const r = await A.procitajMaterijale(k);
    assert.strictEqual(k.zapis.tablica, 'nodes');
    assert.strictEqual(k.zapis.stupci, 'id,parent_id,kind,name,position,updated_at');
    assert.ok(!k.zapis.stupci.includes('*'), 'stupci ne smiju biti *');
    assert.deepStrictEqual(k.zapis.filter, ['deleted_at', null]);
    assert.deepStrictEqual(k.zapis.redoslijed, ['position', { ascending: true }]);
    assert.strictEqual(r.materijala, 1);
    assert.deepStrictEqual(JSON.parse(r.tekst), { materijala: 1, stablo: [{ id: 'm1', vrsta: 'materijal', naziv: 'X' }] });
  });

  await test('prazan korisnik → jasna rečenica, ne prazan JSON', async () => {
    const r = await A.procitajMaterijale(lazniKlijent([]));
    assert.strictEqual(r.materijala, 0);
    assert.match(r.tekst, /no shelves or materials/);
  });

  await test('greška čitanja se NE pretvara u „nemaš materijala"', async () => {
    await assert.rejects(() => A.procitajMaterijale(lazniKlijent(null, { message: 'boom' })), /read_failed: boom/);
  });

  const INDEX = fs.readFileSync(path.join(MAPA, 'index.ts'), 'utf8');
  const ALATI = fs.readFileSync(path.join(MAPA, 'alati.ts'), 'utf8');
  const kod = (s) => s.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

  await test('omot: nikad admin-klijent, service_role ni tajni ključ (ADR-026)', () => {
    for (const [ime, src] of [['index.ts', kod(INDEX)], ['alati.ts', kod(ALATI)]]) {
      assert.ok(!/supabaseAdmin|service_role|SERVICE_ROLE|SECRET_KEY|secretKey/.test(src), ime + ' spominje privilegirani pristup');
    }
  });

  await test('①/1 je SAMO čitanje: nema rpc/insert/update/upsert/delete dok brava (①/2) ne postoji', () => {
    for (const [ime, src] of [['index.ts', kod(INDEX)], ['alati.ts', kod(ALATI)]]) {
      assert.ok(!/\.(rpc|insert|update|upsert|delete)\(/.test(src), ime + ' piše u bazu');
    }
  });

  await test('prijava: korisnički mod (`auth: \'user\'`) i ugniježđeni (stabilni) oblik, ne `pipeline`', () => {
    assert.ok(/withSupabase\(\{ auth: 'user' \}/.test(INDEX), 'withSupabase mora biti auth: user');
    assert.ok(/withOAuthProtectedResource\(\s*\{/.test(INDEX), 'withOAuthProtectedResource s izričitom adresom resursa');
    assert.ok(!/@supabase\/middleware|pipeline\(/.test(kod(INDEX)), 'pipeline je alpha');
  });

  await test('paketi pinani TOČNO (pravilo #9) i samo poznati', () => {
    const uvozi = [...INDEX.matchAll(/from '((?:npm|jsr):[^']+)'/g)].map((m) => m[1]);
    assert.deepStrictEqual(uvozi.sort(), ['npm:@modelcontextprotocol/server@2.0.0', 'npm:@supabase/server@1.7.0']);
    for (const u of uvozi) assert.ok(/@\d+\.\d+\.\d+$/.test(u), u + ' nije točna verzija');
  });

  await test('javni katalog izvan dosega i za čitanje (ADR-031 ⑥)', () => {
    assert.ok(!/subject_content|content_versions|is_admin|catalog/.test(kod(INDEX) + kod(ALATI)));
  });

  // ── ②/1b (N9): imenovano odbijanje iz baze → poruka koju AI može iskoristiti ──
  // PostgREST kvotu i „već predan" vraća kao HTTP 500 — AI tada ne razlikuje „pokušaj kasnije" od
  // kvara. Popis imena se IZVODI iz SQL-a: svaki `raise exception '<ime>…` u nacrtu i validatoru
  // mora imati prijevod, i nijedan prijevod ne smije biti mrtav.
  const IZ_SQL = new Set();
  for (const f of ['f6-nacrt.sql', 'f6-sadrzaj.sql']) {
    // Iz validatora samo dio koji AI doseže (`_provjeri_sadrzaj`); `publish_node` (②/0b) je Studijev put.
    const sql = fs.readFileSync(path.join(KORIJEN, 'supabase', f), 'utf8').split('-- ─── ②/0b')[0];
    for (const m of sql.matchAll(/raise exception '([a-z_]+)/g)) IZ_SQL.add(m[1]);
  }
  await test('N9: svako ime odbijanja iz f6-nacrt.sql + f6-sadrzaj.sql ima prijevod, nijedan prijevod nije mrtav', () => {
    assert.ok(IZ_SQL.size >= 10, 'iz SQL-a izvučeno premalo imena: ' + IZ_SQL.size);
    assert.strictEqual(typeof A.prevediOdbijanje, 'function', 'nema prevediOdbijanje');
    const poznato = Object.keys(A.ODBIJANJA || {});
    assert.deepStrictEqual({ bezPrijevoda: [...IZ_SQL].filter((x) => !poznato.includes(x)).sort(),
      mrtvo: poznato.filter((x) => !IZ_SQL.has(x)).sort() }, { bezPrijevoda: [], mrtvo: [] });
  });
  await test('N9: kvota = „korisnik", sukob = „pročitaj ponovno", sadržaj = „ispravi" uz razlog', () => {
    const k = A.prevediOdbijanje({ message: 'nacrt_kvota_u_izradi: najviše 3 nacrta u izradi — predaj ili pričekaj' });
    assert.strictEqual(k.kod, 'nacrt_kvota_u_izradi'); assert.strictEqual(k.vrsta, 'korisnik');
    const s = A.prevediOdbijanje({ message: 'nacrt_sukob: nacrt je u međuvremenu promijenjen (verzija 3, poslano 2) — pročitaj ga ponovno' });
    assert.strictEqual(s.vrsta, 'ponovno'); assert.ok(/read|again/i.test(s.poruka), s.poruka);
    const v = A.prevediOdbijanje({ message: 'sadrzaj_neispravan: "x" is longer than 500 characters' });
    assert.strictEqual(v.vrsta, 'ispravi'); assert.ok(v.poruka.includes('longer than 500'), 'razlog se ne smije izgubiti: ' + v.poruka);
  });
  await test('N9: nepoznata greška = „kvar", bez unutarnjih detalja (SQL, putanje) u poruci', () => {
    const n = A.prevediOdbijanje({ message: 'relation "public.node_drafts" does not exist at /var/lib/x' });
    assert.strictEqual(n.vrsta, 'kvar'); assert.ok(!/node_drafts|\/var/.test(n.poruka), n.poruka);
    assert.strictEqual(A.prevediOdbijanje(null).vrsta, 'kvar');
  });

  console.log('\n  ' + proslo + ' prošlo, ' + pao + ' palo\n');
  process.exit(pao ? 1 : 0);
})();
