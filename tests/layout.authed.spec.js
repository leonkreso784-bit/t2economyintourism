// C3 — layout-guard za PRIJAVLJENE površine („Moji materijali" + Studio) kroz širine.
//
// ⚠️ ZAŠTO OVAJ SPEC POSTOJI (mjereno 2026-08-14, prije jezgre C3):
// Kriterij prihvaćanja #1 faze glasi: *„…proći cijeli tok na telefonu od 320 px — landing →
// browse → predmet → sva četiri moda → vježbe → profil → **editor** — bez horizontalnog scrolla
// i bez elementa koji strši ili je prekriven."* Provjereno što to mjeri:
//   • `320` se u cijeloj suiti pojavljuje na JEDNOM mjestu — `layout-guard.spec.js`, koji gleda
//     isključivo CTA u landing-navigaciji;
//   • `responsive.spec.js` posjećuje `/` i `study`, a **materijale i editor nikad**;
//   • najmanji iPhone profil je **375 px**, dakle kriterijskih 320 ne mjeri ni jedan projekt.
// → **Kriterij po kojem se C3 proglašava gotovim nije imao mjerač.** Isti obrazac kao §7.10
// (ondje: prijavljene površine bez vizualnog gatea), samo na drugoj osi — ondje boja, ovdje širina.
//
// Uzorak širina gazi SVAKI prag koji dira ove površine, s ±1, jer se granica s obje strane
// ponaša drukčije (pouka `layout-guard.spec.js`: dvije sesije su nasjele na rupu u uzorku):
//   374/375 (`responsive/01`) · 640 (`my-materials.css`) · 680 i 1020 (`studio.css`) ·
//   767/768 i 1024 (`responsive/*`). Plus **320** — kriterij, ne prag.
//
// STAGING-only. Ništa se ne objavljuje: Studio se otvara u read-only pregledu.
const { test, expect } = require('@playwright/test');

const SIRINE = [320, 360, 374, 375, 390, 414, 480, 639, 640, 641, 679, 680, 681,
                767, 768, 900, 1019, 1020, 1021, 1024, 1280];

/**
 * Elementi koji strše izvan viewporta.
 *
 * ⚠️ Ovaj detektor je prepisan DVAPUT, i oba puta je greška bila poučna:
 *
 *   ① Prva izvedba je preskakala element ako je ON `position:fixed`, ali ne i njegovu djecu →
 *      izvlačna bočna traka (`sidebar.css:8`, fiksna i zatvorena = pomaknuta izvan ekrana)
 *      prijavila je 6 elemenata na SVAKOJ od 21 širine, na obje površine. **Sve je bio šum.**
 *      Brana koja viče na svakom pokretanju biva oslabljena ili ignorirana, a tad je gora od
 *      nikakve — jer i dalje izgleda kao brana.
 *
 *   ② Popravak je uveo **suprotan** kvar, gori od prvog: izuzimao je sve unutar pretka kojemu je
 *      `overflow-x` bio `auto`/`scroll`, uz obrazloženje „sadržaj u skrolabilnom spremniku smije
 *      biti širi". Premisa je bila kriva. `.st-canvas`, `.st-tree` i `.st-inspector` imaju
 *      `overflow-y:auto`, a **po CSS specifikaciji, čim je jedna os različita od `visible`, druga
 *      se računa kao `auto`** — pa je filtar izuzeo cijelu unutrašnjost sva tri panela Studija.
 *      Obrnuta provjera je to i dokazala: `min-width:1200px` na `.st-head h1` **nije oborio gate**.
 *      Zeleno je bilo zeleno **zato što nije gledalo**.
 *
 * Zato se sada ne izuzima nego MJERI. Panel s `overflow-y:auto` NE SMIJE skrolati vodoravno —
 * ta vodoravna `auto` je nuspojava specifikacije, ne namjera. Tri neovisne provjere:
 *   (a) dokument ne skrola vodoravno;
 *   (b) nijedan element ne strši izvan viewporta (osim podstabla u `position:fixed` — vlastiti
 *       koordinatni sustav, ne može uzrokovati skrol dokumenta, a (a) to ionako mjeri);
 *   (c) nijedan skrolabilan spremnik nema vodoravni prelijev (`scrollWidth > clientWidth`).
 * Namjerno vodoravno skrolabilna ploha (široka tablica) ide u `SMIJE_SKROLATI` — **izričito i s
 * razlogom**, nikad tiho.
 */
/**
 * Plohe kojima je vodoravni skrol NAMJERA — izričito i s razlogom, nikad tiho.
 *
 * `.lb-table-wrap`: tablica s 3+ stupca ne može ispod svoje min-content širine (izmjereno 414px),
 * pa na telefonu MORA negdje skrolati. Pitanje je samo GDJE: prije popravka skrolalo je cijelo
 * platno editora (`469 > 320`), sad skrola sam spremnik tablice. To je ispravan ishod, ne
 * popuštanje — ostatak stranice miruje. Alternativa `display:block` na tablici odbačena je jer
 * uklanja semantiku tablice za čitače ekrana (v. `wrapLegacyTables` u `js/blocks-renderer.js`).
 */
const SMIJE_SKROLATI = ['.lb-table-wrap'];
async function strsi(page, w, dopusteno) {
  return page.evaluate(([sirina, smijeSkrolati]) => {
    const van = [];
    const ime = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
    const uFiksnom = (el) => {
      for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
        if (getComputedStyle(p).position === 'fixed') return true;
      }
      return false;
    };

    const aktivna = document.querySelector('.page.active, .page:not([hidden])') || document.body;
    for (const el of aktivna.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;                  // nevidljivo
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;

      // (c) skrolabilan spremnik ne smije imati VODORAVNI prelijev
      if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1
          && !smijeSkrolati.some((s) => el.matches(s))) {
        van.push(`vodoravni skrol u ${ime(el)} (${el.scrollWidth} > ${el.clientWidth})`);
      }

      // (b) element strši izvan viewporta
      if ((r.right > sirina + 1 || r.left < -1) && !uFiksnom(el)) {
        van.push(`${ime(el)} [${Math.round(r.left)}…${Math.round(r.right)}] izvan ${sirina}`);
      }
      if (van.length >= 6) break;
    }
    return van;
  }, [w, dopusteno]);
}

async function prodjiSirine(page, ime) {
  const kvarovi = [];
  for (const w of SIRINE) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(70);                                     // reflow

    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scrollW > w + 1) kvarovi.push(`${ime} @ ${w}px — stranica skrola vodoravno (${scrollW}px)`);

    for (const s of await strsi(page, w, SMIJE_SKROLATI)) kvarovi.push(`${ime} @ ${w}px — ${s}`);
  }
  return kvarovi;
}

test.describe('layout (prijavljen) — bez vodoravnog scrolla i bez elementa koji strši', () => {
  test('Moji materijali — sa stablom, kroz sve pragove uklj. 320px', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.SokratMaterials && typeof window.navigateTo === 'function');
    await page.evaluate(() => navigateTo('materials'));
    await page.waitForSelector('#myMaterials .mm-bar', { timeout: 20000 });
    await page.waitForSelector('#myMaterials .mm-spin', { state: 'detached', timeout: 20000 });

    expect(await prodjiSirine(page, 'MATERIJALI')).toEqual([]);
  });

  test('Studio — stablo + otvorena lekcija, kroz sve pragove uklj. 320px', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(
      () => !!window.SokratStudio && !!window.SokratAdmin && typeof window.navigateTo === 'function'
    );
    await page.evaluate(async () => { await window.SokratAdmin.refresh(); });
    await page.evaluate(() => navigateTo('editor'));
    await page.waitForSelector('#editor-page.active #stTree .st-row', { timeout: 20000 });

    const kvarovi = await prodjiSirine(page, 'STUDIO/stablo');

    // Otvorena lekcija — canvas s naslovom, karticama i tabovima je najgušća ploha editora.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.evaluate(() => { document.querySelectorAll('#stTree .st-node').forEach((n) => n.classList.add('open')); });
    const leaf = page.locator('#stTree .st-row[data-subj="te2"][data-lesson]').first();
    await expect(leaf, 'staging mora biti seedan: node scripts/seed-staging.js te2').toHaveCount(1);
    await leaf.click();
    await page.waitForSelector('#stCanvas .st-head h1', { timeout: 20000 });

    // Invarijant renderera, ne samo simptom: SVAKA tablica — i ona iz v1 `legacy-html` sadržaja —
    // mora sjediti u `.lb-table-wrap`. Bez toga tablica ne može ispod svoje min-content širine i
    // odnese cijelo platno postrance (izmjereno `469 > 320`). Isti renderer služi i studentov
    // `learn`, pa ovaj invarijant čuva OBJE površine. [[escape-all-data-in-innerhtml]]
    const golihTablica = await page.evaluate(() => [...document.querySelectorAll('#stCanvas table')]
      .filter((t) => !t.parentElement || !t.parentElement.classList.contains('lb-table-wrap')).length);
    expect(golihTablica, 'tablica bez `.lb-table-wrap` — prelijeva platno na uskom ekranu').toBe(0);

    kvarovi.push(...await prodjiSirine(page, 'STUDIO/lekcija'));
    expect(kvarovi).toEqual([]);
  });
});
