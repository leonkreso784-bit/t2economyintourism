// C3 — a11y gate za PRIJAVLJENE površine (Moji materijali sa stablom · Studio · block-editor · potvrda).
//
// ⚠️ ZAŠTO OVAJ SPEC POSTOJI (nalaz 2026-08-14, spec §7.9):
// Prebacivanje zadane teme u svijetlu slomilo je Studio (`.st-icard` = **1.00**, doslovno ista
// boja), dijalog potvrde (**1.02**) i prijavu (**1.83**) — a suita je bila zelena. Razlog nije
// bio propušten rub nego RUPA U DOSEGU: `a11y.spec.js` posjećuje `#materials-page` **odjavljen**
// (stablo se tada uopće ne iscrta), a `#editor-page` **nikad** — svi studio-testovi su
// `*.authed.spec.js`, a nijedan od njih ne vrti axe.
// → **Prijavljene površine nisu imale NIJEDAN vizualni gate.** Ovaj spec je taj gate.
//
// Svaka ploha se mjeri kroz **svih 5 tema** (zadana + 4 imenovane) — jer kvar iz §7.9 nije bio u
// pravilu nego u KOMBINACIJI pravila i teme: ista deklaracija koja je na tamnoj temi bila ispravna
// postala je nečitljiva čim je zadana tema postala svijetla. Jedna tema ne dokazuje ništa o ostalima.
//
// Doseg je namjerno „prvi kat, ne krov": axe hvata ZATEČENO stanje, ne `:hover`/`.active`
// (od 35 pravila s bijelim tekstom na marki axe ih je uhvatio 2, ostala su bila u hover-stanjima).
// Statičku stranu drži `npm run check:palette` (tri tvrde zabrane). Dvije brane, dva različita kuta.
//
// STAGING-only, kao i ostali authed specovi. **Ništa se ne objavljuje** — draft se na kraju odbacuje.
const { test, expect } = require('@playwright/test');
// T6: editor ima vlastitu adresu — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriStudio } = require('./helpers/studio-entry');
const { skenirajSveTeme } = require('./helpers/axe-gate');

test.describe('a11y (prijavljen) — 0 serious/critical na vlastitom gradivu i u editoru', () => {
  test('Moji materijali — sa STABLOM, ne s pozivom na prijavu', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.SokratMaterials && typeof window.navigateTo === 'function');
    await page.evaluate(() => navigateTo('materials'));
    await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
    // ⚠️ Čekaj da učitavanje ZAVRŠI. Spinner dijeli `.mm-state-title` s praznim stanjem, pa bi
    // skeniranje usred učitavanja mjerilo spinner umjesto stabla. [[tests-must-be-data-independent]]
    await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });

    // Račun SMIJE biti prazan (spec ne ovisi o podacima) — tada se skenira prazno stanje,
    // što je i dalje prijavljena ploha i i dalje više nego što je gate pokrivao dosad.
    const redaka = await page.locator('#myMaterials .mm-row').count();
    console.log(`[a11y/authed] Moji materijali: ${redaka} redaka u stablu`);

    expect(await skenirajSveTeme(page, 'MATERIJALI (prijavljen)')).toEqual([]);
  });

  test('Studio — stablo, otvorena lekcija, draft-mod, block-editor, dijalog potvrde', async ({ page }) => {
    // ⚠️ VLASTITI BUDŽET, i to nije popuštanje nego mjera. Ovaj test radi PET punih
    // axe-analiza (5 tema) nad najtežom stranicom u aplikaciji — Studio nosi stablo,
    // platno, inspektor i block-editor odjednom. Na zadanih 120 s prošao je u 51 s dok je
    // stroj bio odmoran, a poslije nekoliko sati rada ista revizija prijeđe 120 s i padne
    // kao „timeout" — dakle gate koji javlja kvar kad ga nema, i to baš onaj koji je uveden
    // da bi se vjerovalo njegovim nalazima. Provjereno da NIJE regresija: isti pad daje i
    // izvorna verzija `smiri()`, prije današnje izmjene.
    test.setTimeout(300000);
    const nalazi = [];

    await otvoriStudio(page);
    await page.waitForSelector('#editor-page.active #stTree .st-row', { timeout: 20000 });

    // ① Studio sa stablom (prazan canvas) — ploha `--st-rail`/`--st-panel`.
    nalazi.push(...await skenirajSveTeme(page, 'STUDIO/stablo'));

    // ② Otvorena lekcija, read-only pregled — ovdje žive `.st-icard` (bio 1.00) i `.st-kv` (1.18).
    await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach((n) => n.classList.add('open')); });
    const leaf = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
    await expect(leaf, 'staging mora biti seedan: node scripts/seed-staging.js te2').toHaveCount(1);
    await leaf.click();
    await page.waitForSelector('#stCanvas .st-head h1', { timeout: 20000 });
    nalazi.push(...await skenirajSveTeme(page, 'STUDIO/lekcija (pregled)'));

    // ③ Draft-mod — traka s Objavi/Odbaci i `.st-editing` ploha.
    await page.waitForSelector('#stEdit:not([hidden])', { timeout: 20000 });
    await page.click('#stEdit');
    await page.waitForSelector('#stCanvas .st-editing', { timeout: 20000 });
    nalazi.push(...await skenirajSveTeme(page, 'STUDIO/draft-mod'));

    // ④ Block-editor — `block-editor.css` je nosio 100 od 339 pogodaka čegrtaljke.
    const learnTab = page.locator('#stCanvas .st-tab[data-mode="learn"]');
    if (await learnTab.count()) await learnTab.click();
    const migrate = page.locator('#stCanvas .st-migrate').first();
    if (await migrate.count()) {
      await migrate.click();
      await page.waitForSelector('#stCanvas .be-mount .be-root', { timeout: 20000 });
      nalazi.push(...await skenirajSveTeme(page, 'STUDIO/block-editor'));

      // ⑤ Izbornik za umetanje bloka — plutajuća ploha, vlastita pozadina.
      await page.locator('#stCanvas .be-bigplus').first().click();
      await page.waitForSelector('.be-menu .be-menu-item', { timeout: 20000 });
      nalazi.push(...await skenirajSveTeme(page, 'STUDIO/be-izbornik'));
      await page.keyboard.press('Escape');
    }

    // ⑥ Dijalog potvrde — bio **1.02**, i do njega se u praksi dolazi SAMO prijavljen.
    // Ujedno je i put kojim odbacujemo draft → staging ostaje netaknut.
    await page.click('#stDiscard');
    const potvrda = page.locator('sokrat-confirm .sokrat-confirm__ok');
    // ⚠️ NE provjeravaj `count()` odmah nakon klika: dijalog se montira asinkrono, pa bi nula
    // značila „još nije", a ne „nema ga" — i skeniranje bi se TIHO preskočilo, tj. gate bi bio
    // zelen zato što nije gledao. Čeka se pojava; istek čekanja je jedini dopušten „nema dijaloga".
    const vidljiv = await potvrda.waitFor({ state: 'visible', timeout: 8000 }).then(() => true, () => false);
    expect(vidljiv, 'Odbaci mora tražiti potvrdu — inače se draft gubi bez pitanja').toBeTruthy();
    nalazi.push(...await skenirajSveTeme(page, 'DIJALOG POTVRDE'));
    await potvrda.click();

    expect(nalazi).toEqual([]);
  });
});
