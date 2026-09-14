// F2/1 ④ — ODJAVA JE SAMO OVAJ UREĐAJ (STAGING, dvije prave sesije).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Leon (anketa 14.09.): „Samo ovaj uređaj". U supabase-js 2.110.8 je `signOut()` bez argumenta
// GLOBALAN — opozove sve sesije računa, pa odjava na mobitelu odjavi i računalo. Ništa u
// pregledniku koji se odjavljuje to ne pokazuje; šteta se vidi tek na DRUGOM uređaju. Zato su
// ovdje dva uređaja = dva odvojena konteksta, svaki sa SVOJOM prijavom lozinkom (zasebna sesija
// na poslužitelju), i tvrdi se ono što pravi GoTrue kaže:
//   ① uređaj A se odjavi kroz `SokratAuth.signOut()` (isti put kao gumb „Odjava");
//   ② A-ov token poslužitelj više NE prihvaća — lokalna odjava je prava odjava, ne zaborav;
//   ③ uređaj B je i dalje prijavljen: `getUser()` ga prepozna i `refreshSession()` prolazi;
//   ④ A-ov lokalni izbor teme je obrisan (F2/1 ①: `SIGNED_OUT` stiže i za lokalnu odjavu).
// Izvor (svaki poziv nosi `scope: 'local'`) čuva `tests/unit/signout-scope.test.js`.
//
// ⚠️ Konteksti NE nasljeđuju `tests/.auth/admin.json`: dijeljena sesija ostalih specova ovdje
//    se ne dira, a vlastite dvije sesije se na kraju odjave (lokalno).
// ⚠️ OBRNUTA PROVJERA (globalni `signOut()`) opoziva i dijeljenu sesiju → vrti ju SAMO ovaj spec
//    sam, nikad usred pune suite.
// ⚠️ Samo STAGING (pravilo #8) — bez `STAGING_*` se preskače.
const { test, expect } = require('@playwright/test');

const URL = process.env.STAGING_SUPABASE_URL;
const ANON = process.env.STAGING_SUPABASE_ANON;
const EMAIL = process.env.STAGING_TEST_ADMIN_EMAIL;
const LOZINKA = process.env.STAGING_TEST_ADMIN_PASSWORD;

test.skip(!(URL && ANON && EMAIL && LOZINKA), 'traži STAGING_* (pravilo #8)');

/** Novi „uređaj": prazan kontekst, aplikacija usmjerena na staging, prijava lozinkom. */
async function uredaj(browser, baseURL) {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await page.addInitScript((c) => {
    try {
      window.__SOKRAT_SUPABASE__ = c;
      localStorage.setItem('sokrat-supabase-override', JSON.stringify(c));
      localStorage.setItem('sokrat-cookie-consent', 'denied');
    } catch (e) { /* private mode */ }
  }, { url: URL, publishableKey: ANON });
  await page.goto(baseURL + '/');
  await page.waitForFunction(() => typeof SokratAuth !== 'undefined' && !!SokratAuth.getClient(), null, { timeout: 25000 });
  const greska = await page.evaluate(async ({ email, lozinka }) => {
    const r = await SokratAuth.getClient().auth.signInWithPassword({ email, password: lozinka });
    return r.error ? r.error.message : null;
  }, { email: EMAIL, lozinka: LOZINKA });
  expect(greska, 'prijava na staging').toBeNull();
  await page.waitForFunction(() => !!SokratAuth.getUser(), null, { timeout: 20000 });
  return { context, page };
}

const sesija = (page) => page.evaluate(async () => {
  const s = (await SokratAuth.getClient().auth.getSession()).data.session;
  const tijelo = JSON.parse(atob(s.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  return { token: s.access_token, id: tijelo.session_id };
});

test('④ odjava na jednom uređaju ne odjavi drugi, a odjavljeni token je opozvan', async ({ browser, baseURL }) => {
  const A = await uredaj(browser, baseURL);
  const B = await uredaj(browser, baseURL);
  try {
    const sa = await sesija(A.page);
    const sb = await sesija(B.page);
    expect(sa.id && sb.id && sa.id !== sb.id, 'dva uređaja moraju imati DVIJE sesije na poslužitelju').toBe(true);

    // Izbor teme upisan lokalno TEK POSLIJE prijave — da ga `SIGNED_IN` ne preuzme u dijeljeni račun.
    await A.page.evaluate(() => {
      localStorage.setItem('sokrat-theme', 'mint');
      localStorage.setItem('sokrat-theme-chosen', '1');
    });

    // ① isti put kao gumb „Odjava"
    await A.page.evaluate(() => SokratAuth.signOut());
    await expect.poll(() => A.page.evaluate(() => !!SokratAuth.getUser()), { message: 'A je i dalje prijavljen' })
      .toBe(false);

    // ② A-ov stari token poslužitelj odbija (sesija je obrisana, ne samo zaboravljena u pregledniku)
    const statusA = await A.page.evaluate(async ({ url, anon, token }) => {
      const r = await fetch(url + '/auth/v1/user', { headers: { apikey: anon, Authorization: 'Bearer ' + token } });
      return r.status;
    }, { url: URL, anon: ANON, token: sa.token });
    expect([401, 403], 'odjavljeni token mora biti opozvan na poslužitelju, dobiven ' + statusA).toContain(statusA);

    // ③ B živi: poslužitelj ga prepozna, a osvježavanje sesije (refresh token) prolazi
    const b = await B.page.evaluate(async () => {
      const c = SokratAuth.getClient();
      const u = await c.auth.getUser();
      const r = await c.auth.refreshSession();
      return {
        korisnik: !!(u.data && u.data.user),
        greskaUser: u.error ? u.error.message : null,
        osvjezeno: !!(r.data && r.data.session),
        greskaRefresh: r.error ? r.error.message : null,
      };
    });
    expect(b, 'odjava na A je odjavila i B (globalna odjava)').toEqual({
      korisnik: true, greskaUser: null, osvjezeno: true, greskaRefresh: null,
    });

    // ④ lokalni izbor teme nije preživio odjavu
    const tema = await A.page.evaluate(() => localStorage.getItem('sokrat-theme-chosen'));
    expect(tema, 'izbor teme je preživio lokalnu odjavu').toBeNull();
  } finally {
    // Higijena: vlastite sesije se odjavljuju LOKALNO — dijeljena sesija ostalih specova ostaje.
    await B.page.evaluate(() => SokratAuth.getClient().auth.signOut({ scope: 'local' })).catch(() => {});
    await A.context.close();
    await B.context.close();
  }
});
