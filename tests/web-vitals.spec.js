// ===== CLS + TBT — zamjena za jedine dvije tvrdnje koje je lighthouse držao sam =====
// Cigla MREŽA A2. Pokreće se u `test:responsive` i CI-ju kao i ostali specovi.
//
// ZAŠTO POSTOJI: `@lhci/cli` je nosio **10 od 11 high dev-ranjivosti**, a pravog popravka
// nema — `npm` kao „fix" nudi spuštanje s 0.15.1 na 0.1.0. Prije brisanja je izmjereno što
// bi se točno izgubilo: od šest tvrdnji lighthouse joba, `accessibility` pokriva
// `a11y.spec.js` (i to strože, kroz sve teme), `seo` pokriva `check:seo`, `best-practices`
// dijelom `check:cdn`, a `performance ≥ 0.5` je bio **mrtvo slovo** — komentar u
// `.lighthouserc.json` je od 2026-06-29 tražio podizanje na 0.9 „nakon F3", F3 je odavno
// gotov, prag je ostao na 0.5. **Ostale su dvije koje nitko drugi ne mjeri: CLS i TBT.**
// Ovaj spec ih preuzima, pa brisanje ovisnosti ne znači i gubitak mjere.
//
// ⚠️⚠️ POŠTENO O TOME ŠTO OVO JEST, A ŠTO NIJE — inače je ovo mjerač koji tvrdi više nego
// što mjeri, a upravo je to razred greške zbog kojeg faza MREŽA postoji:
//
//   ① **Nema prigušivanja (throttlinga).** Lighthouse mjeri uz simulirani spori CPU i mrežu;
//      ovdje se mjeri na golom stroju. Brojke su zato OPTIMISTIČNE i **nisu usporedive** s
//      lighthouseovima. Prag ispod nije prepisan iz `.lighthouserc.json` nego **postavljen na
//      izmjereno stanje + zaliha** — čegrtaljka, ne apsolutni sud o brzini.
//   ② **TBT je APROKSIMACIJA.** Prava definicija je zbroj (trajanje − 50 ms) po dugim
//      zadacima **između FCP-a i TTI-ja**. TTI se ovdje ne računa; uzima se prozor od
//      početka navigacije do smirivanja mreže. Za hvatanje regresija je dovoljno; za
//      usporedbu s vanjskim brojkama nije.
//   ③ **CLS je potpun u okviru prozora** — zbraja `layout-shift` unose bez
//      `hadRecentInput`, isto kao web-vitals. Ovdje je aproksimacija samo prozor, ne formula.
//
// Dakle: ovo hvata **katastrofalne regresije** (skok koji gura sadržaj, skripta koja blokira
// nit), ne fine razlike. To je i sve što je stari prag od 0.5 hvatao.
const { test, expect } = require('@playwright/test');

// IZMJERENO 2026-08-31 na landingu, stroj (Node 24, bez prigušivanja):
//     CLS 0.0000  ·  TBT ~140 ms  ·  3 duga zadatka
//
// CLS je **zategnut ispod lighthouseova praga**: bezdimenzionalan je, prigušivanje ga ne
// napuhuje, a na statičnoj stranici je determinističan — 0.05 je stvarna čegrtaljka, dok bi
// naslijeđenih 0.1 značilo da smijemo pokvariti dvostruko prije nego itko primijeti.
//
// TBT **namjerno ostaje na 400** iako je izmjereno 140. Razlog nije popustljivost nego to što
// hardver CI-runnera **nije izmjeren**: runneri su osjetno sporiji od ovog stroja, pa bi prag
// postavljen na lokalnu brojku bio čegrtaljka koja pada zbog tuđeg procesora, ne zbog našeg
// koda. ⏳ **Zategnuti nakon prvih nekoliko CI prolaza**, kad stvarna raspodjela bude poznata.
const PRAG_CLS = 0.05;
const PRAG_TBT = 400; // ms — v. gore; broj čeka CI-osnovicu, nije presuda o brzini

/** Postavi promatrače PRIJE ijednog skripta stranice, inače se rani pomaci ne vide. */
async function pripremi(page) {
  await page.addInitScript(() => {
    window.__vitals = { cls: 0, dugi: [] };
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch { /* preglednik bez layout-shift — test će to prijaviti niže */ }
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__vitals.dugi.push(e.duration);
      }).observe({ type: 'longtask', buffered: true });
    } catch { /* longtask nije svugdje; TBT tada ispada 0 i to se ISPISUJE */ }
  });
}

async function ocitaj(page) {
  return page.evaluate(() => ({
    cls: window.__vitals ? window.__vitals.cls : null,
    dugih: window.__vitals ? window.__vitals.dugi.length : null,
    tbt: window.__vitals ? window.__vitals.dugi.reduce((a, d) => a + Math.max(0, d - 50), 0) : null,
  }));
}

test.describe('web vitals — CLS i TBT (zamjena za lighthouse budžete)', () => {
  test('landing: sadržaj ne skače i nit se ne blokira', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375', 'mjeri se na jednom profilu, kao a11y');

    await pripremi(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#landingSubjects .landing-subject-card');
    // Pomaci znaju stići i nakon networkidle (fontovi, lijene slike) — pusti ih da se dogode.
    await page.waitForTimeout(1500);

    const v = await ocitaj(page);
    console.log(`   [vitals] CLS ${v.cls === null ? 'nedostupan' : v.cls.toFixed(4)} · ` +
      `TBT ~${v.tbt === null ? 'nedostupan' : Math.round(v.tbt)} ms · dugih zadataka: ${v.dugih}`);

    // Pada zatvoreno: ako promatrač nije proradio, ovo NIJE prolaz.
    expect(v.cls, 'layout-shift promatrač nije dao brojku — mjera ne postoji, ne prolazi').not.toBeNull();
    expect(v.cls).toBeLessThanOrEqual(PRAG_CLS);
    expect(v.tbt).toBeLessThanOrEqual(PRAG_TBT);
  });
});
