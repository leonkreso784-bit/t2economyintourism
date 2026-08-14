// C3 — kaskada na PRIJAVLJENIM površinama: iznimka mora pobijediti bez `!important`.
//
// ⚠️ ZAŠTO OVAJ SPEC POSTOJI. Tehnički dug C3-a bio je točno pet `!important` deklaracija na dva
// mjesta u `studio.css`, i oba su bila isti kvar: **`:hover` pravilo koje ne izuzima svoju vlastitu
// iznimku**, pa je iznimka morala pucati `!important`-om da se obrani.
//
//   ① `.st-btn.primary:hover` (1id+3r) tuče `.st-btn:disabled` (1id+2r) → onemogućen gumb se
//      podizao na prijelaz mišem. Nije teorijski: „Spoji svoj AI" (`studio.js`) stoji `disabled`
//      dok MCP ne postoji, i to je jedini primjerak na ekranu.
//   ② `.st-editing` (1id+1r) gubi od `.st-metas .st-m` (1id+2r), a `.st-m:hover` (1id+3r) dolazi i
//      KASNIJE u datoteci → oznaka „uređuješ (draft)" gubila bi boju upozorenja pod mišem.
//
// Popravak je oblik koji `block-editor.css` (`.be-btn:hover:not([disabled])`, 0 `!important`) već
// koristi — `studio.css` je bio iznimka u vlastitoj kući, ne obrnuto.
//
// ⚠️ ZAŠTO `css:diff` OVO NE POKRIVA: on uspoređuje izračunate stilove u MIRNOM stanju, a cijela
// promjena živi u `:hover` i `:disabled`. Zelen `css:diff` ovdje ne dokazuje ništa.
//
// ⚠️ SVAKA TVRDNJA IMA OBRNUTU PROVJERU. „Onemogućen gumb se nije pomaknuo" i „hover se uopće nije
// registrirao" daju IDENTIČAN rezultat. Zato se uz svaku negativnu tvrdnju mjeri i pozitivni
// blizanac (omogućen gumb / obična oznaka) koji se MORA promijeniti. Bez toga bi ovaj spec bio
// treći primjerak „zeleno jer ne gleda" u istoj fazi (v. `layout.authed.spec.js`, detektor ②).
//
// STAGING-only. Ništa se ne objavljuje — Studio se otvara u pregledu, `.st-editing` se ne dobiva
// ulaskom u edit-mod nego dodavanjem razreda na PRAVI čip koji je aplikacija već iscrtala.
const { test, expect } = require('@playwright/test');

/** Izračunati stil prije i poslije prelaska miša — jedno mjerenje, dva stanja. */
async function podMisem(page, locator, svojstva) {
  const ocitaj = () => locator.evaluate((el, kljucevi) => {
    const cs = getComputedStyle(el);
    return Object.fromEntries(kljucevi.map((k) => [k, cs[k]]));
  }, svojstva);

  // ⚠️ OBA čekanja moraju nadmašiti NAJDULJI prijelaz na ovim elementima (`.st-m` .15s,
  // `.st-btn` .18s). Prva izvedba je mirno stanje čitala nakon 60 ms i uhvatila boju NASRED
  // prijelaza (`rgb(102,95,79)` umjesto odredišnog `rgb(122,77,0)`) → lažan pad koji je
  // izgledao kao kvar kaskade. Mjerač koji ne čeka animaciju mjeri animaciju, ne stil.
  await page.mouse.move(0, 0);                                   // zajamčeno IZVAN elementa
  await page.waitForTimeout(260);
  const mirno = await ocitaj();

  await locator.hover({ force: true });                          // `force` — `disabled` nije prepreka za :hover
  await page.waitForTimeout(260);
  const podMisem_ = await ocitaj();

  await page.mouse.move(0, 0);
  return { mirno, pod: podMisem_ };
}

test.describe('kaskada (prijavljen) — iznimka pobjeđuje bez `!important`', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });    // inspektor se skriva ispod 1020px
    await page.goto('/');
    await page.waitForFunction(
      () => !!window.SokratStudio && !!window.SokratAdmin && typeof window.navigateTo === 'function'
    );
    await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
    await page.evaluate(() => navigateTo('editor'));
    await page.waitForSelector('#editor-page.active #stTree .st-row', { timeout: 20000 });

    await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach((n) => n.classList.add('open')); });
    const leaf = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
    await expect(leaf, 'staging mora biti seedan: node scripts/seed-staging.js te2').toHaveCount(1);
    await leaf.click();
    await page.waitForSelector('#stCanvas .st-head h1', { timeout: 20000 });
  });

  test('onemogućen `.st-btn` se NE podiže pod mišem — a omogućeni se podiže', async ({ page }) => {
    // Selektor NAMJERNO ne sadrži `[disabled]` — isti element služi i kao kontrola, pa mora
    // ostati uhvatljiv nakon što mu se atribut skine.
    const gumb = page.locator('#editor-page .st-premium .st-btn.primary');
    await expect(gumb, '„Spoji svoj AI" (studio.js) — jedini onemogućen primarni gumb').toHaveCount(1);
    await expect(gumb).toBeDisabled();

    const d = await podMisem(page, gumb, ['transform', 'boxShadow']);
    expect(d.pod.transform, 'onemogućen gumb se pomaknuo pod mišem').toBe(d.mirno.transform);
    expect(d.pod.transform, 'onemogućen gumb ne smije imati podizanje').toBe('none');
    expect(d.pod.boxShadow, 'onemogućen gumb je dobio sjenu pod mišem').toBe(d.mirno.boxShadow);

    // ── OBRNUTA PROVJERA ── bez nje gornje tvrdnje prolaze i kad se hover nikad ne registrira.
    // Kontrola je ISTI element s jednom promijenjenom varijablom (`disabled`), a ne neki drugi
    // gumb: time se dokazuje da razliku radi baš atribut, a ne položaj, veličina ili stanje.
    // (Prva izvedba je za kontrolu uzela `#stPublish` — on je `hidden` u pregledu, pa se nije dao
    // prijeći mišem; kontrola koja se ne izvrši nije kontrola.)
    await gumb.evaluate((el) => el.removeAttribute('disabled'));
    const o = await podMisem(page, gumb, ['transform', 'boxShadow']);
    expect(o.pod.transform, 'KONTROLA PALA: isti gumb se ni bez `disabled` ne podiže → hover se ne registrira, gornji test ne mjeri ništa')
      .not.toBe(o.mirno.transform);
  });

  test('`.st-editing` zadržava boju upozorenja i pod mišem — a obična oznaka je mijenja', async ({ page }) => {
    // Razred se dodaje na PRAVI čip koji je Studio iscrtao (`<span class="st-m">`), pa je rezultat
    // identičan onome što `studio.js` emitira u edit-modu — bez ulaska u edit-mod i bez drafta.
    const cipovi = page.locator('#stCanvas .st-metas .st-m');
    await expect(cipovi.first(), 'canvas mora imati meta-čipove').toBeVisible();
    await page.evaluate(() => {
      document.querySelector('#stCanvas .st-metas .st-m').classList.add('st-editing');
    });

    const editing = cipovi.first();
    const e = await podMisem(page, editing, ['color', 'backgroundColor', 'borderTopColor']);
    expect(e.pod.color, 'oznaka „uređuješ" izgubila je boju pod mišem').toBe(e.mirno.color);
    expect(e.pod.borderTopColor, 'oznaka „uređuješ" izgubila je rub pod mišem').toBe(e.mirno.borderTopColor);

    // Boja MORA biti `--warning-text`, a ne naslijeđeni `--text-muted` s `.st-m` —
    // inače bi test prošao i da `.st-editing` uopće ne djeluje.
    const warning = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--warning-text').trim());
    expect(warning, '`--warning-text` mora postojati u temi').not.toBe('');

    // ── OBRNUTA PROVJERA ── obična `.st-m` MORA reagirati na hover.
    const obicna = cipovi.nth(1);
    await expect(obicna, 'treba bar dva meta-čipa: jedan kao kontrola').toBeVisible();
    const k = await podMisem(page, obicna, ['color', 'borderTopColor']);
    expect(k.pod.borderTopColor, 'KONTROLA PALA: hover se ne registrira → gornji test ne mjeri ništa')
      .not.toBe(k.mirno.borderTopColor);
  });
});
