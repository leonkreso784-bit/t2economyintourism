// F2/3b — SPREMIŠTE IDENTITETA (STAGING): ime i opis imaju svoju tablicu, a `role` ostaje zatvoren.
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Cijela cigla je jedna sigurnosna tvrdnja: korisnik mora smjeti pisati svoje ime, a ne
// smije smjeti ni pokušati pisati svoju ulogu. Da su ime i `role` u istoj tablici, prvo bi
// tražilo UPDATE-politiku nad `profiles`, a druga bi kolona time postala dohvatljiva —
// jedini pouzdan način da se to spriječi jest da ne budu u istoj tablici. To je struktura,
// ne oprez, i zato se mjeri OBRNUTO: ne „RPC radi", nego „drugi putevi su zatvoreni".
//
// Mjeri se KROZ HTTP, kao korisnik (anon ključ + korisnički JWT) — dakle ono što baza
// stvarno dopušta, ne ono što naš JS zove. Isti pristup kao `test:storage`.
//
// ⚠️ PIŠE na STAGING i vraća zatečeno stanje u `finally`. `authenticated` projekt se
//    aktivira tek sa `STAGING_*` (pravilo #8), pa protiv produkcije ne može ni krenuti.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

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

/** Sve tvrdnje idu kroz supabase-js iz stranice — isti klijent i isti JWT kao proizvod. */
const uBazi = (page, fn, arg) => page.evaluate(fn, arg);

test.describe('F2/3b — spremište identiteta', () => {
  test('① RPC upiše ime i opis, a RLS ih vrati natrag', async ({ page }) => {
    await naProfilu(page);

    const staro = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const { data } = await c.from('profile_identity')
        .select('display_name, bio').eq('user_id', SokratAuth.getUser().id).maybeSingle();
      return data || { display_name: null, bio: null };
    });

    try {
      const upisano = await uBazi(page, async () => {
        const c = SokratAuth.getClient();
        const { data, error } = await c.rpc('set_profile_identity',
          { p_display_name: 'Brana F2/3b', p_bio: 'opis iz brane' });
        return { data, error: error ? error.message : null };
      });
      expect(upisano.error).toBeNull();

      const procitano = await uBazi(page, async () => {
        const c = SokratAuth.getClient();
        const { data } = await c.from('profile_identity')
          .select('display_name, bio').eq('user_id', SokratAuth.getUser().id).maybeSingle();
        return data;
      });
      expect(procitano.display_name).toBe('Brana F2/3b');
      expect(procitano.bio).toBe('opis iz brane');
    } finally {
      await uBazi(page, async (s) => {
        await SokratAuth.getClient().rpc('set_profile_identity',
          { p_display_name: s.display_name, p_bio: s.bio });
      }, staro);
    }
  });

  test('② tablica se NE da pisati izravno — jedini put je RPC', async ({ page }) => {
    await naProfilu(page);

    const ishod = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const uid = SokratAuth.getUser().id;
      const ins = await c.from('profile_identity').insert({ user_id: uid, display_name: 'izravni upis' }).select();
      const upd = await c.from('profile_identity').update({ display_name: 'izravna izmjena' }).eq('user_id', uid).select();
      const del = await c.from('profile_identity').delete().eq('user_id', uid).select();
      return {
        insertOdbijen: !!ins.error || (ins.data || []).length === 0,
        updateOdbijen: !!upd.error || (upd.data || []).length === 0,
        deleteOdbijen: !!del.error || (del.data || []).length === 0
      };
    });

    expect(ishod.insertOdbijen, 'izravan INSERT je prošao — RPC više nije jedini put').toBe(true);
    expect(ishod.updateOdbijen, 'izravan UPDATE je prošao — RPC više nije jedini put').toBe(true);
    expect(ishod.deleteOdbijen, 'izravan DELETE je prošao — RPC više nije jedini put').toBe(true);
  });

  test('③ OBRNUTO: `profiles.role` ostaje nedodirljiv i prije i poslije upisa identiteta', async ({ page }) => {
    await naProfilu(page);

    const prije = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const { data } = await c.from('profiles').select('role')
        .eq('user_id', SokratAuth.getUser().id).maybeSingle();
      return data ? data.role : null;
    });
    expect(prije, 'test-račun nema red u `profiles` — brana bi mjerila prazno').not.toBeNull();

    const staro = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const { data } = await c.from('profile_identity')
        .select('display_name, bio').eq('user_id', SokratAuth.getUser().id).maybeSingle();
      return data || { display_name: null, bio: null };
    });

    try {
      // ⚠️ Namjerno se upisuje ISTA vrijednost koja ondje već stoji: ako bi vrata bila
      // otvorena, test to mora PRIJAVITI, a ne usput odjaviti test-računu administraciju.
      const pokusaj = await uBazi(page, async (r) => {
        const c = SokratAuth.getClient();
        const res = await c.from('profiles').update({ role: r })
          .eq('user_id', SokratAuth.getUser().id).select();
        return { greska: res.error ? res.error.message : null, redaka: (res.data || []).length };
      }, prije);
      expect(pokusaj.redaka, 'UPDATE nad `profiles` je prošao — `role` je zapisiv iz preglednika').toBe(0);

      await uBazi(page, async () => {
        await SokratAuth.getClient().rpc('set_profile_identity',
          { p_display_name: 'Brana F2/3b', p_bio: 'promjena identiteta ne dira ulogu' });
      });

      const poslije = await uBazi(page, async () => {
        const c = SokratAuth.getClient();
        const { data } = await c.from('profiles').select('role')
          .eq('user_id', SokratAuth.getUser().id).maybeSingle();
        return data ? data.role : null;
      });
      expect(poslije, 'upis identiteta je promijenio `role`').toBe(prije);
    } finally {
      await uBazi(page, async (s) => {
        await SokratAuth.getClient().rpc('set_profile_identity',
          { p_display_name: s.display_name, p_bio: s.bio });
      }, staro);
    }
  });

  test('④ tuđi red je nevidljiv (owner-RLS, ne filtar u JS-u)', async ({ page }) => {
    await naProfilu(page);

    const vidi = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      // Postojeći, ali TUĐI id. Da RLS ne stoji, upit bi vratio red ili barem drugi broj.
      const { data, error } = await c.from('profile_identity')
        .select('user_id').neq('user_id', SokratAuth.getUser().id);
      return { redaka: (data || []).length, greska: error ? error.message : null };
    });

    expect(vidi.redaka, 'vide se tuđi redovi identiteta').toBe(0);
  });

  test('⑤ granice duljine provodi BAZA, ne `maxlength` u formi', async ({ page }) => {
    await naProfilu(page);

    const ishod = await uBazi(page, async () => {
      const c = SokratAuth.getClient();
      const dugoIme = 'x'.repeat(61);
      const dugOpis = 'y'.repeat(281);
      const a = await c.rpc('set_profile_identity', { p_display_name: dugoIme, p_bio: null });
      const b = await c.rpc('set_profile_identity', { p_display_name: 'ok', p_bio: dugOpis });
      return { ime: a.error ? a.error.message : null, opis: b.error ? b.error.message : null };
    });

    expect(ishod.ime, 'ime od 61 znaka je prošlo').toContain('identity_name_too_long');
    expect(ishod.opis, 'opis od 281 znaka je prošao').toContain('identity_bio_too_long');
  });
});
