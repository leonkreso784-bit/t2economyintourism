// F2/3a — PROFIL JE ZID (STAGING): tko si i što si napravio gore, administracija ispod.
//
// ── ZAŠTO OVAJ SPEC POSTOJI ──────────────────────────────────────────────────────
// Do 2026-09-09 je profil bio POPIS POSTAVKI: prva stvar koju je korisnik vidio o
// sebi bio je gumb „Promijeni lozinku", a ime mu je stajalo kao naslov te kartice.
// Leon (2026-09-08): „profil mora biti na isti način kao i Facebook". Time REDOSLIJED
// prestaje biti slobodan raspored i postaje TVRDNJA O PROIZVODU — a tvrdnja bez brane
// se tiho vrati unatrag prvom sljedećom ciglom koja dira istu funkciju (F2/3b joj
// mijenja spremište, F2/5 joj ubacuje rešetku između identiteta i postavki).
//
// ⚠️ PIŠE u `user_metadata` (ime + opis) i VRAĆA zatečenu vrijednost. Ide isključivo na
//    STAGING — `authenticated` projekt se aktivira tek sa `STAGING_*` (pravilo #8).
// ⚠️ Naslovna i portret su u F2/3a PRAZNE PLOHE; sliku donosi F2/2. Ovdje se mjeri
//    OBLIK (postoji, preklapa, ne visi van), ne sadržaj.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

/** Telefonske širine na kojima zid mora stajati (iste kao `tests/phone.spec.js`). */
const SIRINE = [320, 375, 393, 430];

async function otvoriProfil(page) {
  // Fiksna cookie-traka legitimno prekriva dno — inače presreće pointer-evente.
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* private mode */ }
  });
  await page.goto('/');
  await ucitajPakete(page, ['profile']);
  await page.waitForFunction(() => typeof window.navigateTo === 'function');
  await page.evaluate(() => navigateTo('profile'));
  // Zid se crta tek kad `SokratAuth` ima korisnika; bez prijave bi ovdje stajala
  // kartica „Nisi prijavljen/a" i cijeli spec bi mjerio krivu površinu.
  await page.waitForSelector('#profileContent .profile-wall', { timeout: 20000 });
  await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
}

const box = (page, sel) => page.locator(sel).first().boundingBox();

test.describe('F2/3a — profil je zid', () => {
  test('① identitet stoji IZNAD granice postavki, na svakoj telefonskoj širini', async ({ page }) => {
    await otvoriProfil(page);

    for (const w of SIRINE) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(60); // reflow prije mjerenja

      const zid = await box(page, '.profile-wall');
      const granica = await box(page, '.profile-settings-title');
      expect(zid, `zida nema @ ${w}px`).not.toBeNull();
      expect(granica, `granice postavki nema @ ${w}px`).not.toBeNull();

      // Ovo je cijela cigla u jednoj tvrdnji: administracija POČINJE ispod identiteta.
      expect(zid.y + zid.height, `postavke su iznad zida @ ${w}px`).toBeLessThanOrEqual(granica.y);

      // Stranica se ne smije prelijevati vodoravno ni na jednoj od tih širina.
      const prelijeva = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(prelijeva, `vodoravno prelijevanje @ ${w}px`).toBe(false);
    }
  });

  test('② portret preklapa naslovnu i ne visi izvan zida', async ({ page }) => {
    await otvoriProfil(page);

    for (const w of SIRINE) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(60);

      const zid = await box(page, '.profile-wall');
      const naslovna = await box(page, '.profile-cover');
      const portret = await box(page, '.profile-avatar');
      expect(naslovna, `naslovne nema @ ${w}px`).not.toBeNull();
      expect(portret, `portreta nema @ ${w}px`).not.toBeNull();

      // Preklapanje je namjerno (negativna margina) — bez njega zid izgleda kao dvije kartice.
      expect(portret.y, `portret ne preklapa naslovnu @ ${w}px`).toBeLessThan(naslovna.y + naslovna.height);
      expect(portret.y + portret.height, `portret je cijeli u naslovnoj @ ${w}px`)
        .toBeGreaterThan(naslovna.y + naslovna.height);

      // …ali ne smije iscuriti bočno: `overflow: hidden` na zidu bi ga odrezao.
      expect(portret.x, `portret viri lijevo @ ${w}px`).toBeGreaterThanOrEqual(zid.x - 1);
      expect(portret.x + portret.width, `portret viri desno @ ${w}px`)
        .toBeLessThanOrEqual(zid.x + zid.width + 1);
    }
  });

  test('③ „Uredi profil" je dohvatljiv prstom (44×44) i unutar ekrana', async ({ page }) => {
    await otvoriProfil(page);

    for (const w of SIRINE) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(60);

      const b = await box(page, '#profileEditBtn');
      expect(b, `gumba nema @ ${w}px`).not.toBeNull();
      expect(b.height, `dodir je nizak (${Math.round(b.height)}px) @ ${w}px`).toBeGreaterThanOrEqual(44);
      expect(b.width, `dodir je uzak (${Math.round(b.width)}px) @ ${w}px`).toBeGreaterThanOrEqual(44);
      expect(b.x, `gumb viri lijevo @ ${w}px`).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width, `gumb viri desno @ ${w}px`).toBeLessThanOrEqual(w + 1);
    }
  });

  test('④ forma se otvara s zatečenim vrijednostima i „Odustani" je zatvara', async ({ page }) => {
    await otvoriProfil(page);

    await expect(page.locator('#profileEditForm')).toBeHidden();
    await page.click('#profileEditBtn');
    await expect(page.locator('#profileEditForm')).toBeVisible();

    // Polje mora nositi ONO ŠTO ZID PIŠE — prazna forma bi tiho obrisala ime pri spremanju.
    const naZidu = (await page.locator('.profile-name').first().innerText()).trim();
    const uPolju = await page.inputValue('#profileEditName');
    if (uPolju) expect(naZidu).toBe(uPolju);

    await page.click('#profileEditCancel');
    await expect(page.locator('#profileEditForm')).toBeHidden();
  });

  test('⑤ spremanje mijenja ime i opis na zidu (pa se vraća zatečeno)', async ({ page }) => {
    await otvoriProfil(page);

    const staro = await page.evaluate(() => {
      const m = (SokratAuth.getUser() || {}).user_metadata || {};
      return { name: m.display_name || '', bio: m.bio || '' };
    });

    const probno = 'F2/3a proba ' + Date.now();
    try {
      await page.click('#profileEditBtn');
      await page.fill('#profileEditName', probno);
      await page.fill('#profileEditBio', 'opis iz brane');
      await page.click('#profileEditForm button[type="submit"]');

      await expect(page.locator('.profile-name')).toHaveText(probno, { timeout: 15000 });
      await expect(page.locator('.profile-bio')).toHaveText('opis iz brane');
      // Prazan opis nosi kurziv i drugu tintu — kad opis postoji, taj biljeg mora otpasti.
      await expect(page.locator('.profile-bio')).not.toHaveClass(/profile-bio--empty/);
    } finally {
      // Vrati zatečeno stanje računa i kad tvrdnja padne — sljedeća vrtnja mora zateći isto.
      await page.evaluate(async (s) => {
        await SokratAuth.getClient().auth.updateUser({ data: { display_name: s.name, bio: s.bio } });
      }, staro);
    }
  });
});
