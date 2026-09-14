// TEMELJ MREŽE (BACKLOG §🌐 A1–A3) — korisničko ime, vidljivost, kvota slika (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// `supabase/f2-temelj-mreze.sql` uvodi TRI pravila koja će F7 (javni profili) pretpostavljati.
// Pravilo koje se ne izmjeri u OBA smjera tiho se izgubi pri sljedećoj migraciji, pa se ovdje
// mjeri i ono što PROLAZI i ono što se ODBIJA: ① vidljivost postoji i zadana je `private` ·
// ② ime se normalizira i upisuje kroz RPC · ③ kriv oblik, rezervirano, zauzeto i prerana
// promjena padaju s KODOM · ④ izravan upis mimo RPC-a i čitanje rezerviranih su zatvoreni ·
// ⑤ 21. slika u vlastitom prefiksu se odbija.
//
// Metoda (kao F2/2): spec je napisan PRIJE migracije i vrćen protiv staginga → crven; tek onda
// migracija → zelen.
//
// ⚠️ PIŠE na STAGING. Pravilo „30 dana" bi test-računu zaključalo ime nakon prve vrtnje, pa se
//    zatečeno stanje vraća SERVICE ključem (samo Node strana, nikad u preglednik). Bez
//    `STAGING_SUPABASE_SERVICE_KEY` spec se preskače — radije ništa nego polovična brana.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

const BASE = process.env.STAGING_SUPABASE_URL;
const SERVICE = process.env.STAGING_SUPABASE_SERVICE_KEY;
const PROD_REF = 'naxjubnedhrbhsuasayu';
const BUCKET = 'profile-images';
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

test.skip(!BASE || !SERVICE, 'treba STAGING_SUPABASE_URL + STAGING_SUPABASE_SERVICE_KEY');
test.skip(!!BASE && BASE.includes(PROD_REF), 'NIKAD protiv produkcije');

const svc = () => ({ apikey: SERVICE, Authorization: 'Bearer ' + SERVICE, 'Content-Type': 'application/json' });
async function http(path, opts) { return fetch(BASE.replace(/\/$/, '') + path, opts); }

/** Red identiteta kako ga vidi SERVICE (zaobilazi RLS) — za vraćanje stanja i provjeru nepromjenjenosti. */
async function redServis(uid) {
  const r = await http(`/rest/v1/profile_identity?user_id=eq.${uid}&select=*`, { headers: svc() });
  const rows = await r.json();
  return Array.isArray(rows) ? (rows[0] || null) : null;
}
async function vratiRed(uid, zateceno) {
  if (!zateceno) {
    // Reda nije bilo → ime i sat se samo isprazne (red briše kaskada tek s korisnikom).
    await http(`/rest/v1/profile_identity?user_id=eq.${uid}`, {
      method: 'PATCH', headers: svc(), body: JSON.stringify({ handle: null, handle_changed_at: null })
    }).catch(() => {});
    return;
  }
  await http(`/rest/v1/profile_identity?user_id=eq.${uid}`, {
    method: 'PATCH', headers: svc(),
    body: JSON.stringify({ handle: zateceno.handle ?? null, handle_changed_at: zateceno.handle_changed_at ?? null })
  });
}
/** Otvori sat „30 dana" (kao da je zadnja promjena bila davno) — da test može probati promjenu. */
async function otvoriSat(uid) {
  await http(`/rest/v1/profile_identity?user_id=eq.${uid}`, {
    method: 'PATCH', headers: svc(), body: JSON.stringify({ handle_changed_at: '2000-01-01T00:00:00Z' })
  });
}

const nasumicno = (pref) => (pref + Math.random().toString(36).slice(2, 10)).slice(0, 20);

async function prijavljen(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser(), null, { timeout: 20000 });
  return page.evaluate(() => SokratAuth.getUser().id);
}

const setHandle = (page, h) => page.evaluate(async (v) => {
  const { data, error } = await SokratAuth.getClient().rpc('set_profile_handle', { p_handle: v });
  return { data, error: error ? error.message : null };
}, h);

test.describe('Temelj mreže — ime, vidljivost, kvota', () => {
  test('① vidljivost postoji, zadana je private, i vlasnik ju vidi u svom redu', async ({ page }) => {
    const uid = await prijavljen(page);
    // Red mora postojati da se stupac pročita — ime ga stvara ako ga nema.
    const z = await redServis(uid);
    try {
      if (!z) await setHandle(page, nasumicno('vid_'));
      const r = await page.evaluate(async (id) => {
        const { data, error } = await SokratAuth.getClient().from('profile_identity')
          .select('visibility').eq('user_id', id).maybeSingle();
        return { data, error: error ? error.message : null };
      }, uid);
      expect(r.error, 'stupac visibility ne postoji').toBeNull();
      expect(r.data && r.data.visibility).toBe('private');
    } finally {
      await vratiRed(uid, z);
    }
  });

  test('② ime: normalizacija, upis kroz RPC, isto ime ne pokreće sat', async ({ page }) => {
    const uid = await prijavljen(page);
    const z = await redServis(uid);
    try {
      if (z && z.handle) await otvoriSat(uid);
      const ime = nasumicno('t_');
      const r = await setHandle(page, '  ' + ime.toUpperCase() + ' ');
      expect(r.error, 'RPC nije prošao').toBeNull();
      expect(r.data.handle, 'ime nije normalizirano u mala slova').toBe(ime);
      expect(r.data.handle_changed_at, 'sat nije postavljen').toBeTruthy();

      const opet = await setHandle(page, ime);
      expect(opet.error, 'isto ime mora proći (ništa se ne mijenja)').toBeNull();
      expect(opet.data.handle_changed_at, 'isto ime je pomaknulo sat').toBe(r.data.handle_changed_at);
    } finally {
      await vratiRed(uid, z);
    }
  });

  test('③ odbijanja nose KOD: oblik · rezervirano · prerana promjena · zauzeto', async ({ page }) => {
    const uid = await prijavljen(page);
    const z = await redServis(uid);
    let stranac = null;
    try {
      for (const krivo of ['ab', 'a-b', 'x'.repeat(21), 'čovjek', '', 'ime s razmakom']) {
        const r = await setHandle(page, krivo);
        expect(r.error || '', `„${krivo}" je prošao`).toMatch(/^handle_invalid/);
      }
      for (const rez of ['admin', ' ADMIN ', 'sokrat', 'login']) {
        const r = await setHandle(page, rez);
        expect(r.error || '', `rezervirano „${rez}" je prošlo`).toMatch(/^handle_reserved/);
      }

      // Prerana promjena: postavi ime (sat kreće sad), pa probaj drugo.
      if (z && z.handle) await otvoriSat(uid);
      const prvo = await setHandle(page, nasumicno('a_'));
      expect(prvo.error).toBeNull();
      const drugo = await setHandle(page, nasumicno('b_'));
      expect(drugo.error || '', 'druga promjena unutar 30 dana je prošla').toMatch(/^handle_cooldown/);

      // Zauzeto: jednokratni korisnik drži ime (upisano SERVICE ključem), test-račun ga traži.
      const email = `mreza-${Date.now()}@sokrat-test.invalid`;
      const cu = await http('/auth/v1/admin/users', {
        method: 'POST', headers: svc(),
        body: JSON.stringify({ email, password: 'Mreza-' + Math.random().toString(36).slice(2) + '!9', email_confirm: true })
      });
      expect(cu.ok, 'jednokratni korisnik nije stvoren').toBe(true);
      stranac = (await cu.json()).id;
      const tudje = nasumicno('z_');
      const ins = await http('/rest/v1/profile_identity', {
        method: 'POST', headers: svc(), body: JSON.stringify({ user_id: stranac, handle: tudje })
      });
      expect(ins.ok, 'strančevo ime nije upisano').toBe(true);
      await otvoriSat(uid);
      const zauzeto = await setHandle(page, tudje.toUpperCase());
      expect(zauzeto.error || '', 'tuđe ime je prošlo').toMatch(/^handle_taken/);
    } finally {
      if (stranac) await http(`/auth/v1/admin/users/${stranac}`, { method: 'DELETE', headers: svc() }).catch(() => {});
      await vratiRed(uid, z);
    }
  });

  test('④ mimo RPC-a nema puta: izravan upis imena/vidljivosti i čitanje rezerviranih', async ({ page }) => {
    const uid = await prijavljen(page);
    const prije = await redServis(uid);
    const r = await page.evaluate(async (id) => {
      const c = SokratAuth.getClient();
      const up = await c.from('profile_identity').update({ handle: 'hack_x', visibility: 'public' })
        .eq('user_id', id).select();
      const rez = await c.from('reserved_handles').select('handle').limit(5);
      return {
        upErr: up.error ? up.error.message : null, upRows: (up.data || []).length,
        rezErr: rez.error ? rez.error.message : null, rezRows: (rez.data || []).length
      };
    }, uid);
    // Upis mora pasti ILI dirnuti nula redaka — oboje je zatvoreno; otvoreno je samo „1 red".
    expect(r.upRows, 'izravan UPDATE je prošao').toBe(0);
    const poslije = await redServis(uid);
    expect((poslije || {}).handle ?? null, 'ime se promijenilo mimo RPC-a').toBe((prije || {}).handle ?? null);
    // Rezervirana: ili odbijeno (bez granta) ili prazno — nikad sadržaj.
    expect(r.rezRows, 'authenticated čita popis rezerviranih').toBe(0);
    expect(r.rezErr || '', 'tablica rezerviranih ne postoji (migracija nije primijenjena?)').not.toMatch(/does not exist|Could not find/i);
  });

  test('⑥ sučelje: krivo ime daje prevedenu grešku i čuva formu; ispravno se pojavi na zidu kao @ime', async ({ page }) => {
    const uid = await prijavljen(page);
    const z = await redServis(uid);
    try {
      if (z && z.handle) await otvoriSat(uid);
      await page.evaluate(() => navigateTo('profile'));
      await page.waitForSelector('#profileContent .profile-wall', { timeout: 20000 });
      await page.click('#profileEditBtn');
      await expect(page.locator('#profileEditHandle')).toBeVisible();

      await page.fill('#profileEditHandle', 'admin');
      await page.click('#profileEditForm button[type="submit"]');
      const status = page.locator('#profileEditStatus');
      await expect(status).toHaveClass(/is-error/, { timeout: 15000 });
      // Tekst iz rječnika, ne sirovi kod baze („handle_reserved: …").
      await expect(status).not.toContainText('handle_');
      await expect(page.locator('#profileEditForm')).toBeVisible();

      const ime = nasumicno('ui_');
      await page.fill('#profileEditHandle', '@' + ime.toUpperCase());
      await page.click('#profileEditForm button[type="submit"]');
      await expect(page.locator('.profile-handle')).toHaveText('@' + ime, { timeout: 15000 });
      const red = await redServis(uid);
      expect(red.handle).toBe(ime);
    } finally {
      await vratiRed(uid, z);
    }
  });

  test('⑤ kvota: 21. objekt u vlastitom prefiksu se odbija', async ({ page }) => {
    test.setTimeout(120000);
    const uid = await prijavljen(page);
    const stavljeno = [];
    try {
      const imam = await page.evaluate(async (a) => {
        const s = SokratAuth.getClient().storage.from(a.b);
        let n = 0;
        for (const mapa of ['avatar', 'cover']) {
          const { data } = await s.list(a.uid + '/' + mapa, { limit: 100 });
          n += (data || []).filter((f) => f.id).length;
        }
        return n;
      }, { b: BUCKET, uid });
      expect(imam, 'test-račun već ima ≥ 20 objekata — počisti staging').toBeLessThan(20);

      for (let i = 0; i < 20 - imam; i++) {
        const p = `${uid}/avatar/kvota-${Date.now()}-${i}.png`;
        const r = await page.evaluate(async (a) => {
          const bin = Uint8Array.from(atob(a.b64), (c) => c.charCodeAt(0));
          const { error } = await SokratAuth.getClient().storage.from(a.b).upload(a.p, bin, { contentType: 'image/png' });
          return error ? error.message : null;
        }, { b: BUCKET, p, b64: PNG_B64 });
        expect(r, `upload ${i + 1} (ispod granice) je pao`).toBeNull();
        stavljeno.push(p);
      }
      const p21 = `${uid}/avatar/kvota-${Date.now()}-preko.png`;
      const preko = await page.evaluate(async (a) => {
        const bin = Uint8Array.from(atob(a.b64), (c) => c.charCodeAt(0));
        const { error } = await SokratAuth.getClient().storage.from(a.b).upload(a.p, bin, { contentType: 'image/png' });
        return error ? error.message : null;
      }, { b: BUCKET, p: p21, b64: PNG_B64 });
      if (!preko) stavljeno.push(p21);
      expect(preko || 'PROŠAO', '21. objekt je prošao — kvote nema').toMatch(/row-level security|violates|Unauthorized|policy/i);
    } finally {
      if (stavljeno.length) {
        await page.evaluate(async (a) => {
          await SokratAuth.getClient().storage.from(a.b).remove(a.ps);
        }, { b: BUCKET, ps: stavljeno }).catch(() => {});
      }
    }
  });
});
