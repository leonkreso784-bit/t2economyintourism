// F2/1 ③ — PROFILNA U GORNJOJ TRACI (STAGING).
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Leon (anketa 13.09.): avatar u traci, putanja u `user_metadata`. Traka ga zato čita iz JWT-a,
// a baza (`profile_identity`) ostaje istina — između njih stoje DVA upisivača preslika
// (`SokratProfileImages.upload/remove` i samopopravak u `loadIdentity`) i jedna provjera ulaza
// (`navAvatarUrl` u auth.js: samo `<moj-id>/avatar/<ime>`). Pješčanik (`profile-images.test.js`)
// mjeri zrcaljenje; ovo mjeri ono što se VIDI: slika u traci, dodir 44×44 na 320 px, povratak
// ikone, samopopravak i to da tuđa putanja ne postane URL. I jedan kvar koji je ③ mogao
// pogoršati: `USER_UPDATED` iz „Ukloni" (koji stoji U formi) ne smije obrisati otvorenu formu.
//
// ⚠️ PIŠE na STAGING (upload, RPC, `user_metadata`) i vraća zatečeno u `finally`.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

const TUDJI_UID = '00000000-0000-0000-0000-000000000000';

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

/** Zatečeno: putanja u bazi i preslik u računu — oboje se vraća na kraju. */
async function zateceno(page) {
  return page.evaluate(async () => {
    const c = SokratAuth.getClient();
    const { data } = await c.from('profile_identity')
      .select('avatar_path').eq('user_id', SokratAuth.getUser().id).maybeSingle();
    const m = SokratAuth.getUser().user_metadata || {};
    return { db: (data && data.avatar_path) || null, meta: m.avatar_path === undefined ? null : m.avatar_path };
  });
}

async function vrati(page, s) {
  await page.evaluate(async (a) => {
    const c = SokratAuth.getClient();
    await c.rpc('set_profile_image', { p_kind: 'avatar', p_path: a.db });
    await c.auth.updateUser({ data: { avatar_path: a.meta } });
  }, s);
}

/** Pravi 64×64 PNG iz canvasa → kroz PRAVI `SokratProfileImages.upload` (smanji → upload → RPC → zrcaljenje). */
async function uploadAvatar(page) {
  return page.evaluate(async () => {
    const cv = document.createElement('canvas');
    cv.width = 64; cv.height = 64;
    const g = cv.getContext('2d');
    g.fillStyle = '#4f46e5'; g.fillRect(0, 0, 64, 64);
    const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
    const red = await SokratProfileImages.upload('avatar', blob);   // bez oldPath: zatečena datoteka ostaje
    return red.avatar_path;
  });
}

const metaAvatar = (page) => page.evaluate(() => (SokratAuth.getUser().user_metadata || {}).avatar_path || null);

test.describe('F2/1 ③ — profilna u traci', () => {
  test('① upload → slika u traci (44×44 na 320 px) → ukloni → ikona', async ({ page }) => {
    await naProfilu(page);
    const s = await zateceno(page);
    let nova = null;
    try {
      nova = await uploadAvatar(page);
      expect(nova, 'upload nije vratio putanju').toMatch(/\/avatar\//);
      await expect.poll(() => metaAvatar(page), { message: 'putanja nije zrcaljena u račun' }).toBe(nova);

      const img = page.locator('#authNavBtn img.auth-entry-avatar');
      await expect(img).toHaveAttribute('src', new RegExp(nova.replace(/[.]/g, '\\.') + '$'));
      await expect(page.locator('#authNavBtn')).toHaveClass(/has-avatar/);
      await expect(page.locator('#authNavBtn > i')).toBeHidden();
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0), { message: 'slika se nije učitala' }).toBe(true);

      // Traka na najužem telefonu: dodir ostaje 44×44, slika 28 px, ništa se ne prelijeva.
      // ⚠️ Prijelazi se gase: `.topbar-btn` animira visinu 40 → 44 px kad prozor prijeđe prag od
      // 560 px, pa je prva vrtnja izmjerila 42,66 px USRED animacije (lažan „gumb nizak").
      // Mjeri se konačno stanje, ne put do njega.
      await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
      await page.setViewportSize({ width: 320, height: 700 });
      await page.waitForTimeout(80);
      await expect(img, 'u gumbu smije biti TOČNO jedna slika').toHaveCount(1);
      const b = await page.locator('#authNavBtn').boundingBox();
      expect(b.width, 'gumb uzak').toBeGreaterThanOrEqual(44);
      expect(b.height, 'gumb nizak').toBeGreaterThanOrEqual(44);
      expect(b.x + b.width, 'gumb viri desno').toBeLessThanOrEqual(321);
      const ib = await img.boundingBox();
      expect(Math.round(ib.width)).toBe(28);
      expect(Math.round(ib.height)).toBe(28);
      const prelijeva = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(prelijeva, 'traka se prelijeva na 320 px').toBe(false);

      await page.evaluate((p) => SokratProfileImages.remove('avatar', p), nova);
      nova = null;   // remove je obrisao i datoteku
      await expect.poll(() => metaAvatar(page)).toBe(null);
      await expect(img).toHaveCount(0);
      await expect(page.locator('#authNavBtn > i')).toBeVisible();
    } finally {
      if (nova) await page.evaluate((p) => SokratAuth.getClient().storage.from('profile-images').remove([p]), nova).catch(() => {});
      await vrati(page, s);
    }
  });

  test('② samopopravak: preslik koji se razišao s bazom vrati otvaranje profila; tuđa putanja nije URL', async ({ page }) => {
    await naProfilu(page);
    const s = await zateceno(page);
    try {
      // Tuđa putanja u vlastitim metapodacima (korisnik ih smije pisati sam) → traka ju ODBIJE.
      await page.evaluate(async (uid) => {
        await SokratAuth.getClient().auth.updateUser({ data: { avatar_path: uid + '/avatar/x.webp' } });
      }, TUDJI_UID);
      await expect.poll(() => metaAvatar(page)).toBe(TUDJI_UID + '/avatar/x.webp');
      await expect(page.locator('#authNavBtn img.auth-entry-avatar')).toHaveCount(0);

      // Ponovno otvaranje profila → `loadIdentity` usporedi s bazom i vrati preslik na istinu.
      await page.evaluate(() => navigateTo('landing'));
      await page.reload();
      await ucitajPakete(page, ['profile']);
      await page.waitForFunction(() => typeof SokratAuth !== 'undefined' && !!SokratAuth.getUser(), null, { timeout: 20000 });
      await page.evaluate(() => navigateTo('profile'));
      await page.waitForSelector('#profileContent .profile-wall', { timeout: 20000 });
      await expect.poll(() => metaAvatar(page), { timeout: 15000, message: 'samopopravak nije vratio preslik' }).toBe(s.db);
    } finally {
      await vrati(page, s);
    }
  });

  test('③ „Ukloni" u otvorenoj formi ne briše ono što korisnik upravo piše', async ({ page }) => {
    await naProfilu(page);
    const s = await zateceno(page);
    let nova = null;
    try {
      nova = await uploadAvatar(page);
      await expect.poll(() => metaAvatar(page)).toBe(nova);
      // Upload je išao IZRAVNO kroz modul, mimo `changeProfileImage`, pa profilni keš (`_identity`)
      // ne zna za sliku i red „Ukloni" ostaje skriven (prva vrtnja je ovdje visjela 120 s).
      // Isprazni keš → `renderProfilePage` pozove `loadIdentity` → red stigne iz baze.
      await page.evaluate(() => { _identityFor = null; renderProfilePage(); });
      await expect(page.locator('#profileEditForm .profile-edit-image-row[data-image-kind="avatar"]'),
        'red „Ukloni" se nije pojavio').not.toHaveAttribute('hidden', /.*/, { timeout: 15000 });
      await page.click('#profileEditBtn');
      await expect(page.locator('#profileEditForm')).toBeVisible();
      await page.fill('#profileEditBio', 'napola napisan opis');

      await page.click('#profileEditForm .profile-img-remove[data-image-kind="avatar"]');
      nova = null;
      await expect.poll(() => metaAvatar(page), { message: 'uklanjanje nije zrcaljeno' }).toBe(null);
      await page.waitForTimeout(300);   // USER_UPDATED stiže poslije upisa — daj mu vremena da (ne) prepiše
      await expect(page.locator('#profileEditForm'), 'forma je nestala').toBeVisible();
      await expect(page.locator('#profileEditBio')).toHaveValue('napola napisan opis');
      await expect(page.locator('#authNavBtn img.auth-entry-avatar'), 'traka prati događaj i uz otvorenu formu').toHaveCount(0);
    } finally {
      if (nova) await page.evaluate((p) => SokratAuth.getClient().storage.from('profile-images').remove([p]), nova).catch(() => {});
      await vrati(page, s);
    }
  });

  // F3/2 cigla 4a: ime gumba prijavljenog korisnika bilo je „My profile" u oba jezika, a oko
  // lozinke u profilu „Show password". Samo čita — ništa se ne upisuje, pa nema `finally`.
  test('④ ime gumba u traci i oko lozinke u profilu prate jezik', async ({ page }) => {
    await naProfilu(page);
    const gumb = page.locator('#authNavBtn');
    await expect(gumb).toHaveClass(/is-signed-in/);
    await expect(gumb).toHaveAttribute('aria-label', 'My Profile');
    await page.evaluate(() => window.toggleUiLang());
    expect(await page.evaluate(() => window.getUiLang())).toBe('hr');
    await expect(gumb, 'ime gumba poslije prekidača').toHaveAttribute('aria-label', 'Moj profil');
    await expect(page.locator('#profileChangePassForm .auth-pass-toggle').first(), 'oko lozinke u profilu')
      .toHaveAttribute('aria-label', 'Prikaži lozinku');
  });
});
