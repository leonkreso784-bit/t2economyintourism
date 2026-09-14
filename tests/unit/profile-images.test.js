/* eslint-disable no-console */
// ===== Node unit testovi za js/profile-images.js (F2/2 — slike profila, javan bucket) =====
// Pokreni: `npm run test:unit` (ili: node tests/unit/profile-images.test.js)
// Isti obrazac kao node-images.test.js: klasična skripta kroz window-shim (new Function).
//
// Testiraju se ČISTE funkcije i rubovi BEZ mreže i BEZ canvasa: fitDims (nikad povećanje, omjer,
// zaokruživanje) · newPath (vlasnik → vrsta → uuid.ext) · ownerOf/kindOf · publicUrl bez klijenta ·
// upload/remove bez prijave odbijaju s `auth_required`, s krivom vrstom s `image_kind_invalid` ·
// upload s LAŽNIM klijentom: RPC odbije → upload se POČISTI (siroče se ne ostavlja) · stara slika se
// briše samo ako je NAŠA i nije upravo upisana.
//
// Mrežni dio (bucket, RLS, RPC) pokriva `tests/profile-images.authed.spec.js` protiv staginga;
// canvas-smanjivanje pokriva authed spec cigle 3 (pravi preglednik).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}
async function testAsync(name, fn) {
  try { await fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.error('  ✗ ' + name + '\n      ' + e.message); }
}

console.log('\n=== profile-images (F2/2) ===\n');

const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'profile-images.js'), 'utf8');

/**
 * Svježa instanca modula. `SokratAuth` je leksički global u proizvodu → ovdje ga dajemo kao
 * parametar funkcije (isti doseg-oblik: golo ime, ne `window.SokratAuth`).
 * @param {any} [auth]
 */
function load(auth) {
  /** @type {{ SokratProfileImages?: any }} */
  const win = {};
  new Function('window', 'SokratAuth', code)(win, auth);
  return win.SokratProfileImages;
}

// ---------------------------------------------------------------- fitDims
{
  const PI = load();
  test('fitDims: velika slika se smanji na najdulju stranicu = max, omjer sačuvan', () => {
    assert.deepStrictEqual(PI.fitDims(4032, 3024, 512), { w: 512, h: 384 });
    assert.deepStrictEqual(PI.fitDims(3024, 4032, 512), { w: 384, h: 512 });
    assert.deepStrictEqual(PI.fitDims(6000, 2000, 1500), { w: 1500, h: 500 });
  });
  test('fitDims: mala slika se NIKAD ne povećava', () => {
    assert.deepStrictEqual(PI.fitDims(200, 100, 512), { w: 200, h: 100 });
    assert.deepStrictEqual(PI.fitDims(512, 512, 512), { w: 512, h: 512 });
  });
  test('fitDims: nikad ispod 1 px, smeće ulaz → 1×1', () => {
    assert.deepStrictEqual(PI.fitDims(10000, 1, 512), { w: 512, h: 1 });
    assert.deepStrictEqual(PI.fitDims(0, 0, 512), { w: 1, h: 1 });
    assert.deepStrictEqual(PI.fitDims(NaN, undefined, 512), { w: 1, h: 1 });
  });
  test('fitDims: bez valjanog max-a vraća izvorne dimenzije', () => {
    assert.deepStrictEqual(PI.fitDims(3000, 2000, 0), { w: 3000, h: 2000 });
  });
  test('KINDS: avatar 512, cover 1500 — brojke iz RASPORED §F2/2', () => {
    assert.strictEqual(PI.KINDS.avatar.max, 512);
    assert.strictEqual(PI.KINDS.cover.max, 1500);
  });
}

// ---------------------------------------------------------------- putanje
{
  const PI = load();
  test('newPath = <uid>/<vrsta>/<uuid>.<ext>; 1. segment vlasnik (RLS), 2. vrsta (RPC)', () => {
    const p = PI.newPath('U-1', 'avatar', 'webp');
    const seg = p.split('/');
    assert.strictEqual(seg.length, 3);
    assert.strictEqual(seg[0], 'U-1');
    assert.strictEqual(seg[1], 'avatar');
    assert.ok(/\.webp$/.test(seg[2]));
    assert.notStrictEqual(PI.newPath('U-1', 'avatar', 'webp'), p, 'dva poziva → dva imena');
  });
  test('newPath bez ext → webp', () => {
    assert.ok(/\.webp$/.test(PI.newPath('U', 'cover')));
  });
  test('ownerOf / kindOf čitaju segmente; nepoznata vrsta → null', () => {
    assert.strictEqual(PI.ownerOf('U-1/avatar/x.webp'), 'U-1');
    assert.strictEqual(PI.kindOf('U-1/avatar/x.webp'), 'avatar');
    assert.strictEqual(PI.kindOf('U-1/cover/x.webp'), 'cover');
    assert.strictEqual(PI.kindOf('U-1/role/x.webp'), null);
    assert.strictEqual(PI.kindOf(''), null);
    assert.strictEqual(PI.ownerOf(null), '');
  });
  test('ACCEPT nema svg ni gif — isti popis kao bucket', () => {
    assert.ok(PI.ACCEPT.indexOf('svg') < 0 && PI.ACCEPT.indexOf('gif') < 0);
    assert.ok(PI.ACCEPT.indexOf('image/webp') >= 0 && PI.ACCEPT.indexOf('image/jpeg') >= 0);
  });
}

// ---------------------------------------------------------------- bez prijave / kriva vrsta
(async () => {
  {
    const PI = load();
    test('publicUrl bez klijenta → null (bez rušenja), bez putanje → null', () => {
      assert.strictEqual(PI.publicUrl('U/avatar/x.webp'), null);
      assert.strictEqual(PI.publicUrl(''), null);
      assert.strictEqual(PI.publicUrl(null), null);
    });
    await testAsync('upload bez prijave → auth_required', async () => {
      await assert.rejects(PI.upload('avatar', {}), /auth_required/);
    });
    await testAsync('remove bez prijave → auth_required', async () => {
      await assert.rejects(PI.remove('avatar', null), /auth_required/);
    });
    await testAsync('kriva vrsta se odbija PRIJE mreže → image_kind_invalid', async () => {
      await assert.rejects(PI.upload('role', {}), /image_kind_invalid/);
      await assert.rejects(PI.remove('role', null), /image_kind_invalid/);
      await assert.rejects(PI.smanji({}, 'role'), /image_kind_invalid/);
    });
  }

  // -------------------------------------------------------------- lažni klijent: siroče se čisti
  {
    /** Bilježi što modul zove; `rpcError` upravlja ishodom RPC-a. `o.meta` = `user_metadata`
        prijavljenog, `o.updateError` = `auth.updateUser` vraća grešku (F2/1 ③ zrcaljenje). */
    function fakeAuth(rpcError, o) {
      o = o || {};
      const log = { uploads: [], removes: [], rpc: [], updates: [] };
      const user = { id: 'U-1', user_metadata: Object.assign({}, o.meta || {}) };
      const storage = {
        from() {
          return {
            upload(p) { log.uploads.push(p); return Promise.resolve({ data: { path: p }, error: null }); },
            remove(ps) { log.removes.push(ps.slice()); return Promise.resolve({ data: ps, error: null }); },
            getPublicUrl(p) { return { data: { publicUrl: 'https://x.supabase.co/storage/v1/object/public/profile-images/' + p } }; }
          };
        }
      };
      const client = {
        storage,
        rpc(name, args) {
          log.rpc.push({ name, args });
          if (rpcError) return Promise.resolve({ data: null, error: { message: rpcError } });
          return Promise.resolve({ data: { user_id: 'U-1', avatar_path: args.p_path, cover_path: null }, error: null });
        },
        auth: {
          updateUser(p) {
            log.updates.push(p);
            if (o.updateError) return Promise.resolve({ data: null, error: { message: o.updateError } });
            Object.assign(user.user_metadata, p.data);
            return Promise.resolve({ data: { user }, error: null });
          }
        }
      };
      return { auth: { getClient: () => client, getUser: () => user }, log };
    }

    // `upload` prolazi kroz UNUTARNJI `smanji` (canvas + createImageBitmap), kojih u sandboxu nema →
    // pada na `image_decode_failed` PRIJE ijednog mrežnog poziva (i to se mjeri dolje). Tijek nakon
    // smanjivanja (upload → RPC → brisanje stare) dijeli klijent, RPC i `removeOld` s `remove`-om,
    // pa se ovdje mjeri kroz `remove`; cijeli `upload` u pravom pregledniku pokriva authed spec cigle 3.
    const loadFake = load;

    await testAsync('publicUrl s klijentom → /object/public/profile-images/<putanja>', async () => {
      const f = fakeAuth(null);
      const PI = loadFake(f.auth);
      assert.strictEqual(PI.publicUrl('U-1/avatar/a.webp'),
        'https://x.supabase.co/storage/v1/object/public/profile-images/U-1/avatar/a.webp');
    });

    await testAsync('remove: RPC upiše NULL pa se STARA (naša) obriše', async () => {
      const f = fakeAuth(null);
      const PI = loadFake(f.auth);
      const row = await PI.remove('avatar', 'U-1/avatar/old.webp');
      assert.strictEqual(f.log.rpc.length, 1);
      assert.deepStrictEqual(f.log.rpc[0].args, { p_kind: 'avatar', p_path: null });
      assert.deepStrictEqual(f.log.removes, [['U-1/avatar/old.webp']]);
      assert.strictEqual(row.avatar_path, null);
    });

    await testAsync('remove: TUĐA stara putanja se NE dira (vlasnik ≠ ja)', async () => {
      const f = fakeAuth(null);
      const PI = loadFake(f.auth);
      await PI.remove('avatar', 'U-2/avatar/old.webp');
      assert.deepStrictEqual(f.log.removes, [], 'pokušao obrisati tuđi objekt');
    });

    await testAsync('remove: RPC odbije → greška nosi poruku RPC-a, ništa se ne briše', async () => {
      const f = fakeAuth('image_kind_invalid: x');
      const PI = loadFake(f.auth);
      await assert.rejects(PI.remove('avatar', 'U-1/avatar/old.webp'), /image_kind_invalid/);
      assert.deepStrictEqual(f.log.removes, []);
    });

    // ── F2/1 ③ — putanja avatara se ZRCALI u `user_metadata.avatar_path` (traka ju čita iz JWT-a) ──
    await testAsync('③ remove avatara → user_metadata.avatar_path = null (traka vraća ikonu)', async () => {
      const f = fakeAuth(null, { meta: { avatar_path: 'U-1/avatar/old.webp', display_name: 'Leon' } });
      const PI = loadFake(f.auth);
      await PI.remove('avatar', 'U-1/avatar/old.webp');
      assert.deepStrictEqual(f.log.updates, [{ data: { avatar_path: null } }]);
    });
    await testAsync('③ remove NASLOVNE → račun se ne dira (traka nosi samo avatar)', async () => {
      const f = fakeAuth(null, { meta: { avatar_path: 'U-1/avatar/a.webp' } });
      const PI = loadFake(f.auth);
      await PI.remove('cover', 'U-1/cover/old.webp');
      assert.deepStrictEqual(f.log.updates, []);
    });
    await testAsync('③ RPC odbije → ni zrcaljenja (račun ne smije tvrditi ono što baza nema)', async () => {
      const f = fakeAuth('rpc_failed', { meta: { avatar_path: 'U-1/avatar/a.webp' } });
      const PI = loadFake(f.auth);
      await assert.rejects(PI.remove('avatar', 'U-1/avatar/a.webp'));
      assert.deepStrictEqual(f.log.updates, []);
    });
    await testAsync('③ zrcaljenje padne → remove SVEJEDNO uspije (baza je istina, profil ga popravi)', async () => {
      const f = fakeAuth(null, { meta: { avatar_path: 'U-1/avatar/a.webp' }, updateError: 'Failed to fetch' });
      const PI = loadFake(f.auth);
      const row = await PI.remove('avatar', 'U-1/avatar/a.webp');
      assert.strictEqual(row.avatar_path, null);
      assert.strictEqual(f.log.updates.length, 1);
      assert.deepStrictEqual(f.log.removes, [['U-1/avatar/a.webp']], 'stara se i dalje briše');
    });
    await testAsync('③ mirrorAvatar: ista putanja kakvu račun već ima → bez poziva', async () => {
      const f = fakeAuth(null, { meta: { avatar_path: 'U-1/avatar/a.webp' } });
      const PI = loadFake(f.auth);
      assert.strictEqual(await PI.mirrorAvatar('U-1/avatar/a.webp'), false);
      assert.strictEqual(await PI.mirrorAvatar(null), true);
      assert.strictEqual(await PI.mirrorAvatar(null), false, 'null → null je isto');
      assert.deepStrictEqual(f.log.updates, [{ data: { avatar_path: null } }]);
    });
    await testAsync('③ mirrorAvatar: nema ključa u računu + nema slike → bez poziva (nedostaje = null)', async () => {
      const f = fakeAuth(null, { meta: {} });
      const PI = loadFake(f.auth);
      assert.strictEqual(await PI.mirrorAvatar(null), false);
      assert.strictEqual(await PI.mirrorAvatar(''), false, 'prazan string = nema slike');
      assert.deepStrictEqual(f.log.updates, []);
    });
    await testAsync('③ mirrorAvatar bez prijave → false, bez rušenja', async () => {
      const PI = load();
      assert.strictEqual(await PI.mirrorAvatar('U-1/avatar/a.webp'), false);
    });

    await testAsync('upload bez canvasa u sandboxu → image_decode_failed, i NIŠTA nije uploadano', async () => {
      const f = fakeAuth(null);
      const PI = load(f.auth);
      await assert.rejects(PI.upload('avatar', { size: 1 }), /image_decode_failed/);
      assert.deepStrictEqual(f.log.uploads, []);
      assert.deepStrictEqual(f.log.rpc, []);
    });
  }

  console.log(`\n${passed} prošlo, ${failed} palo\n`);
  process.exit(failed ? 1 : 0);
})();
