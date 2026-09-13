// F2/2 cigla 1 — BUCKET `profile-images` + RPC `set_profile_image` (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Odluka je JAVAN bucket (Leon, 2026-09-09): tko ima URL, vidi sliku i bez prijave. Ta se
// odluka mora IZMJERITI, ne pretpostaviti — u oba smjera: ① javno čitanje po URL-u radi
// (inače je odluka izvedena krivo i avatar traži potpis), ② SVE OSTALO ostaje vlasničko:
// upload i listanje tuđeg prefiksa, anon-upload, tuđa putanja u vlastitom redu, izravan
// upis stupca mimo RPC-a. Sigurnost bucketa je prefiks, sigurnost tablice je RPC — i oba se
// mjere OBRNUTO („drugi putevi su zatvoreni"), kao u `profile-identity.authed.spec.js`.
//
// Mjeri se KROZ supabase-js iz stranice (isti klijent i JWT kao proizvod) i kroz goli HTTP
// (javni URL bez ijednog zaglavlja; anon samo s `apikey`).
//
// ⚠️ PIŠE na STAGING (upload + RPC) i čisti za sobom u `finally`. `authenticated` projekt se
//    aktivira tek sa `STAGING_*` (pravilo #8), pa protiv produkcije ne može ni krenuti.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

const BUCKET = 'profile-images';
const TUDJI_UID = '00000000-0000-0000-0000-000000000000';

// 1×1 PNG — najmanji valjani teret; bucket propušta samo rasterske image MIME-ove.
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

async function naProfilu(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => typeof window.navigateTo === 'function');
  await page.evaluate(() => navigateTo('profile'));
  await page.waitForSelector('#profileContent .profile-wall', { timeout: 20000 });
}

const uBazi = (page, fn, arg) => page.evaluate(fn, arg);

/** Upload 1×1 PNG-a na zadanu putanju kao prijavljeni korisnik; vraća { ok, error }. */
async function upload(page, path) {
  return uBazi(page, async (a) => {
    const bin = Uint8Array.from(atob(a.b64), (c) => c.charCodeAt(0));
    const { error } = await SokratAuth.getClient().storage.from(a.bucket)
      .upload(a.path, bin, { contentType: 'image/png', upsert: false });
    return { ok: !error, error: error ? error.message : null };
  }, { b64: PNG_B64, bucket: BUCKET, path });
}

async function ukloni(page, path) {
  await uBazi(page, async (a) => {
    await SokratAuth.getClient().storage.from(a.bucket).remove([a.path]);
  }, { bucket: BUCKET, path }).catch(() => {});
}

async function rpc(page, kind, path) {
  return uBazi(page, async (a) => {
    const { data, error } = await SokratAuth.getClient().rpc('set_profile_image',
      { p_kind: a.kind, p_path: a.path });
    return { data, error: error ? error.message : null };
  }, { kind, path });
}

/** Zatečene putanje, da se na kraju vrate točno kakve su bile. */
async function zatecenoStanje(page) {
  return uBazi(page, async () => {
    const c = SokratAuth.getClient();
    const { data } = await c.from('profile_identity')
      .select('avatar_path, cover_path').eq('user_id', SokratAuth.getUser().id).maybeSingle();
    return data || { avatar_path: null, cover_path: null };
  });
}

async function vratiStanje(page, s) {
  await rpc(page, 'avatar', s.avatar_path);
  await rpc(page, 'cover', s.cover_path);
}

test.describe('F2/2 — bucket profile-images + set_profile_image', () => {
  test('① vlastiti upload → RPC upiše putanju → RLS je vrati → javni URL radi BEZ prijave', async ({ page, request }) => {
    await naProfilu(page);
    const uid = await uBazi(page, () => SokratAuth.getUser().id);
    const staro = await zatecenoStanje(page);
    const path = `${uid}/avatar/brana-${crypto.randomUUID()}.png`;

    try {
      const up = await upload(page, path);
      expect(up.error, 'upload u VLASTITI prefiks je odbijen').toBeNull();

      const r = await rpc(page, 'avatar', path);
      expect(r.error, 'RPC je odbio vlastitu, postojeću putanju').toBeNull();
      expect(r.data.avatar_path).toBe(path);
      // Upsert dira SAMO traženi stupac: naslovna ostaje kakva je bila.
      expect(r.data.cover_path).toBe(staro.cover_path);

      const procitano = await zatecenoStanje(page);
      expect(procitano.avatar_path).toBe(path);

      // Javno čitanje: goli GET bez ijednog zaglavlja, kao <img src> tuđem posjetitelju.
      const javniUrl = await uBazi(page, (p) =>
        SokratAuth.getClient().storage.from('profile-images').getPublicUrl(p).data.publicUrl, path);
      expect(javniUrl).toContain('/object/public/profile-images/');
      const res = await request.get(javniUrl, { headers: {} });
      expect(res.status(), 'javni URL nije čitljiv bez prijave — bucket nije javan').toBe(200);
      expect(res.headers()['content-type']).toContain('image/png');

      // Ista datoteka, ista vrsta, ali kao NASLOVNA → mora pasti: mapa `avatar` ≠ vrsta `cover`.
      const krivaVrsta = await rpc(page, 'cover', path);
      expect(krivaVrsta.error, 'putanja iz mape avatar upisana kao cover').toContain('image_not_owned');
    } finally {
      await vratiStanje(page, staro);
      await ukloni(page, path);
    }
  });

  test('② tuđi prefiks je zatvoren: upload, listanje i RPC — i nepostojeći objekt', async ({ page }) => {
    await naProfilu(page);
    const uid = await uBazi(page, () => SokratAuth.getUser().id);
    const staro = await zatecenoStanje(page);

    try {
      const tudji = `${TUDJI_UID}/avatar/${crypto.randomUUID()}.png`;
      const up = await upload(page, tudji);
      expect(up.ok, 'upload u TUĐI prefiks je prošao').toBe(false);

      const popis = await uBazi(page, async (u) => {
        const { data, error } = await SokratAuth.getClient().storage.from('profile-images').list(u);
        return { n: (data || []).length, error: error ? error.message : null };
      }, TUDJI_UID);
      expect(popis.n, 'listanje tuđeg prefiksa vraća unose').toBe(0);

      const rTudji = await rpc(page, 'avatar', tudji);
      expect(rTudji.error, 'RPC je prihvatio tuđu putanju').toContain('image_not_owned');

      const nema = await rpc(page, 'avatar', `${uid}/avatar/${crypto.randomUUID()}.png`);
      expect(nema.error, 'RPC je prihvatio putanju bez objekta').toContain('image_not_found');

      const vrsta = await rpc(page, 'role', `${uid}/role/x.png`);
      expect(vrsta.error, 'RPC je prihvatio nepoznatu vrstu').toContain('image_kind_invalid');

      // Ništa od gornjeg nije smjelo promijeniti red.
      expect(await zatecenoStanje(page)).toEqual(staro);
    } finally {
      await vratiStanje(page, staro);
    }
  });

  test('③ anon ne može uploadati; stupac se ne da pisati mimo RPC-a', async ({ page, request }) => {
    await naProfilu(page);
    const uid = await uBazi(page, () => SokratAuth.getUser().id);
    const { url, key } = await uBazi(page, () => {
      const c = SokratAuth.getClient();
      return { url: c.supabaseUrl, key: c.supabaseKey };
    });

    // Anon (samo `apikey`, bez korisničkog JWT-a) — nijedna politika ga ne propušta.
    const anon = await request.post(`${url}/storage/v1/object/${BUCKET}/${uid}/avatar/anon.png`, {
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'image/png' },
      data: Buffer.from(PNG_B64, 'base64')
    });
    expect(anon.status(), 'anon upload je prošao').toBeGreaterThanOrEqual(400);

    const izravno = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const upd = await c.from('profile_identity').update({ avatar_path: 'x/y.png' })
        .eq('user_id', SokratAuth.getUser().id).select();
      return { redaka: (upd.data || []).length, error: upd.error ? upd.error.message : null };
    });
    expect(izravno.redaka, 'izravan UPDATE avatar_path je prošao — RPC nije jedini put').toBe(0);
  });

  // Cigla 2 (`js/profile-images.js`): cijeli tijek u PRAVOM pregledniku — smanjivanje je canvas,
  // pa se ne da mjeriti u Nodeu. Ulaz je 2000×1500 PNG nacrtan u stranici (≈ fotka), izlaz mora biti
  // WebP ≤ 512 px na dužoj stranici, upisan kroz RPC, javno čitljiv, a PRETHODNI avatar obrisan.
  test('④ upload() smanji u pregledniku → WebP ≤ 512 → RPC → javni URL; stara slika nestane', async ({ page, request }) => {
    await naProfilu(page);
    const uid = await uBazi(page, () => SokratAuth.getUser().id);
    const staro = await zatecenoStanje(page);
    const prvi = `${uid}/avatar/brana-stari-${crypto.randomUUID()}.png`;
    let novi = null;

    try {
      // „Stari" avatar: upload + RPC, da `upload()` ima što zamijeniti.
      expect((await upload(page, prvi)).error).toBeNull();
      expect((await rpc(page, 'avatar', prvi)).error).toBeNull();

      const ishod = await uBazi(page, async (a) => {
        const c = document.createElement('canvas');
        c.width = 2000; c.height = 1500;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#4f46e5'; ctx.fillRect(0, 0, 2000, 1500);
        ctx.fillStyle = '#fff'; ctx.fillRect(400, 300, 1200, 900);
        const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
        const file = new File([blob], 'fotka.png', { type: 'image/png' });
        const izlaz = await window.SokratProfileImages.smanji(file, 'avatar');
        const row = await window.SokratProfileImages.upload('avatar', file, { oldPath: a.stari });
        return {
          ulazBajtova: blob.size, izlazBajtova: izlaz.blob.size, tip: izlaz.type, w: izlaz.width, h: izlaz.height,
          path: row && row.avatar_path, cover: row && row.cover_path,
          url: window.SokratProfileImages.publicUrl(row && row.avatar_path)
        };
      }, { stari: prvi });
      novi = ishod.path;

      expect(ishod.tip, 'Chromium zna WebP — izlaz mora biti WebP').toBe('image/webp');
      expect(Math.max(ishod.w, ishod.h)).toBe(512);
      expect(ishod.w).toBe(512); expect(ishod.h).toBe(384);
      expect(ishod.izlazBajtova, 'smanjena slika mora biti manja od ulaza').toBeLessThan(ishod.ulazBajtova);
      expect(ishod.path).toMatch(new RegExp('^' + uid + '/avatar/[0-9a-f-]{36}\\.webp$'));
      expect(ishod.cover, 'upload avatara ne smije dirati naslovnu').toBe(staro.cover_path);

      const res = await request.get(ishod.url, { headers: {} });
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/webp');

      // Stari objekt je obrisan (listanje vlastitog prefiksa ga više ne vidi).
      const ostao = await uBazi(page, async (p) => {
        const { data } = await SokratAuth.getClient().storage.from('profile-images').list(p.split('/')[0] + '/avatar');
        return (data || []).map((x) => x.name);
      }, prvi);
      expect(ostao, 'stari avatar nije obrisan nakon zamjene').not.toContain(prvi.split('/')[2]);
      expect(ostao).toContain(ishod.path.split('/')[2]);
    } finally {
      await vratiStanje(page, staro);
      await ukloni(page, prvi);
      if (novi) await ukloni(page, novi);
    }
  });

  // Cigla 3 (`js/profile.js`): korisnikov put KLIKOVIMA — „Uredi profil" → „Promijeni" → birač datoteka →
  // portret na zidu postaje <img> s javnim URL-om, forma OSTAJE otvorena (slika se osvježava u mjestu),
  // „Ukloni" vraća ikonu. Bez ovoga bi cigla 2 bila modul koji nitko ne zove.
  test('⑤ zid: Promijeni → slika na portretu, forma ostaje; Ukloni → ikona natrag', async ({ page }) => {
    await naProfilu(page);
    const uid = await uBazi(page, () => SokratAuth.getUser().id);
    const staro = await zatecenoStanje(page);
    const prije = await uBazi(page, async (u) => {
      const { data } = await SokratAuth.getClient().storage.from('profile-images').list(u + '/avatar');
      return (data || []).map((x) => x.name);
    }, uid);

    try {
      await expect(page.locator('.profile-avatar img')).toHaveCount(0);
      await page.click('#profileEditBtn');
      await expect(page.locator('#profileEditForm')).toBeVisible();

      // Slika 1200×900 nacrtana u stranici → PNG bajtovi za birač (Playwright presreće <input type=file>).
      const png = await uBazi(page, async () => {
        const c = document.createElement('canvas'); c.width = 1200; c.height = 900;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#10b981'; ctx.fillRect(0, 0, 1200, 900);
        const b = await new Promise((r) => c.toBlob(r, 'image/png'));
        return Array.from(new Uint8Array(await b.arrayBuffer()));
      });
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('.profile-img-change[data-image-kind="avatar"]')
      ]);
      await chooser.setFiles({ name: 'fotka.png', mimeType: 'image/png', buffer: Buffer.from(png) });

      const img = page.locator('.profile-avatar img.profile-avatar-img');
      await expect(img).toHaveCount(1, { timeout: 20000 });
      const src = await img.getAttribute('src');
      expect(src).toMatch(new RegExp('/object/public/profile-images/' + uid + '/avatar/[0-9a-f-]{36}\\.webp$'));
      await expect(page.locator('#profileEditForm'), 'forma se zatvorila — slika mora osvježiti zid U MJESTU').toBeVisible();
      await expect(page.locator('.profile-img-remove[data-image-kind="avatar"]')).toBeVisible();
      // Slika se stvarno učita (nije polomljen <img>).
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth), { timeout: 20000 }).toBe(512);

      await page.click('.profile-img-remove[data-image-kind="avatar"]');
      await expect(page.locator('.profile-avatar img')).toHaveCount(0, { timeout: 20000 });
      await expect(page.locator('.profile-avatar i.fa-user-graduate')).toHaveCount(1);
      await expect(page.locator('.profile-img-remove[data-image-kind="avatar"]')).toBeHidden();
      const red = await zatecenoStanje(page);
      expect(red.avatar_path).toBeNull();
    } finally {
      await vratiStanje(page, staro);
      // Sve što je test dodao u vlastiti prefiks — van (staro stanje je popis prije testa).
      await uBazi(page, async (a) => {
        const s = SokratAuth.getClient().storage.from('profile-images');
        const { data } = await s.list(a.uid + '/avatar');
        const visak = (data || []).map((x) => a.uid + '/avatar/' + x.name).filter((p) => a.prije.indexOf(p.split('/')[2]) < 0);
        if (visak.length) await s.remove(visak);
      }, { uid, prije });
    }
  });
});
