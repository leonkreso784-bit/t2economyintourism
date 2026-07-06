# FOUNDATION_PLAN — Platforma-first temelj (Sokrat Study)

> **Status (ažurirano 2026-07-06):** ▶ U TIJEKU. **F1 (reliability rails) ✅ DEPLOYANO · F2 (reusable jezgra) ✅ KOMPLETNA + DEPLOYANO · F3 (performanse) ✅ KOMPLETNA + DEPLOYANO** (jezgra 3C.1+3B+3A 2026-07-05; 3D+3E ff-merge `e39eb1d..b19a641` 2026-07-06, live-verified `20260706003609`). **F4 (Admin CRUD) ▶ U TIJEKU** (grana `foundation/f4` = preview: F4.1 identitet + F4.2 write-path/verzioniranje + F4.3a/b admin viewer gotovi+live-verificirani; F4.3c uređivanje sljedeće; ADR-021 + `CRUD_PLAN.md` + `CATALOG_ARCHITECTURE.md`) → F5 (SRS) → F6 (sigurnost) → UGC. Detalji po fazama niže.
> **Odluka korisnika (2026-06-29):** staviti DODAVANJE SADRŽAJA na pauzu na koliko god treba i izgraditi
> **profesionalan, reliable, reusable temelj** prije daljnjeg rasta. Cilj: platforma „brutalno napravljena",
> pripremljena za sve što planiramo (Admin CRUD, UGC, AI tutor, monetizacija).
> **Vezano:** ADR-013 (content arhitektura), ADR-014 (engineering standardi) u [DECISIONS.md](DECISIONS.md);
> `sonnet.md` (hardening checklist); [[foundation-pivot]].
>
> **Razina (korisnik 2026-06-29): ne „zdrav" nego „jeben i brutalan".** Cilj nije „radi i neće pasti" (higijena) nego
> stvarno elitan, WOW, profesionalan temelj. Zato svaka faza nosi **TVRDE gateove** (ne upozorenja — blokade): vidi
> §7. Pet stvari koje plan dižu iz solidnog (7/10) u brutalan (9–10): **(1) perf/a11y/visual-regression TVRDI gateovi
> u CI** · **(2) error-monitoring = Sentry s release-trackingom** · **(3) RLS + migracije testirane na pravom Supabase
> branchu** · **(4) CRUD versioning + audit-log + dry-run diff** · **(5) SRS dizajn-dok PRIJE koda (FSRS, ne samo SM-2).**
> Sve stane u postojeće faze — redoslijed se NE mijenja, samo se diže ljestvica.

> **▶ STRATEŠKO AŽURIRANJE (2026-07-05, korisnik):**
> 1. **Platforma-first SKROZ do UGC-a, PA tek onda nazad na sadržaj.** Puni redoslijed **F3 → F4 (CRUD) → F5 (SRS) → F6 (sigurnost) → UGC → tek onda sadržaj.**
>    Sadržaj kroz datoteke i dalje radi (dual-read), ali svjesno se NE vraćamo dodavanju dok temelj+UGC ne stoje.
> 2. **UGC se NE gura u Admin CRUD prerano.** F4 CRUD se DIZAJNIRA UGC-spreman (multi-user/RLS/vlasništvo/draft→publish), ali **student-upload NE ide živ prije F6**
>    (DOMPurify sanitizacija + moderacijski red + CSP). Student uploada **PODATKE** (kartice/kviz/fill/learn, saniziran HTML), **NIKAD KOD** (vježbe = deklarativni sandbox, BUG-012). Jedan authoring sustav, vrata se otvaraju kasnije. → nova **ADR-018**.
> 3. **Service Worker (3A.3+) se radi na FABLE modelu** (drugi model = jeftin sigurnosni sloj na najrizičnijoj cigli). → **ADR-019**.
> 4. **Točnost sadržaja = dvo-ključni verifier** (Sonnet piše → Opus SAMO provjerava+označava krive → korisnik presudi; protiv izvornog `topics.json`, troškovno-minimalno; retroaktivno na 18 predmeta). Gradi se u **fazi sadržaja**. → **ADR-020**, plan u `CONTENT_GENERATOR.md`.
> 5. **Supabase Pro (€25/mj) prije prvih korisnika** (backup + bez sleep-a; gasi rizik B). **Tempo:** kraće dionice, stani nakon 1–2 cigle ([[pace-short-stretches-check-in]]).

---

## 0. Zašto (kontekst odluke)
Sadržajna staza 1.+2. god HM je **gotova i LIVE** (17 EN predmeta + HRV pilot). Projekt je na inflection pointu:
volumen sadržaja je još upravljiv, ali pred eksplozijom (HR ×16, 3. god, UGC). Korisniku je **uvijek bila
bitnija platforma i njezina kvaliteta/performanse nego količina sadržaja.** Zato: **stop sadržaju → izgradi temelj.**

**Filozofija rada (korisnikova, doslovno):** „malo → veliko, jedno po jedno, definirano, da sve skupa radi,
bude održivo i reusable; polako, s puno provjera." Model uzora = **exercises engine** (7 tipova, nikad mijenjan
za sadržaj, node-testiran) — svaka cigla mora biti takva: **definirana, testabilna zasebno, reverzibilna, reusable.**

---

## 1. Načela rada — KAKO se radi SVAKA cigla (obavezno, bez iznimke)
Svaka cigla (najmanja jedinica posla) prolazi isti slijed:
1. **Definiraj sučelje/ugovor** prije implementacije (što ulazi, što izlazi, tko to zove).
2. **Implementiraj minimalno** — samo ta cigla, ništa „usput".
3. **Testiraj** — node-test za logiku + Playwright za UI + (od Faze 1) CI + `tsc` type-check.
4. **Dokumentiraj** — PROGRESS unos + relevantni doc; ako je odluka → ADR.
5. **Ship** — preview-deploy (grana) → vizualna/funkcionalna provjera → tek onda produkcija (uz potvrdu korisnika).
6. **Tek onda sljedeća cigla.** Nikad dvije nedovršene paralelno.

**Nepovrediva pravila (vrijede i dalje):**
- **Cache bump** `?v=` na SVAKU `css/js/data` izmjenu + `CONTENT_VERSION` za `data/*` (BUG-004).
- **Deploy (push) SAMO uz izričitu potvrdu korisnika.** Commit lokalno je OK.
- **Engine se ne mijenja ZA SADRŽAJ** (sveto; exercises engine dokaz). Prezentacijske ekstenzije (npr. KaTeX render) su OK ako su aditivne.
- **Vježbe NIKAD u bazu** (BUG-012) — sadrže `generate()` funkcije; ostaju kod u datotekama/modulima.
- **Ažuriraj docs** nakon svake cigle (PROGRESS/CHANGELOG/ovaj plan).
- **Pred-compact audit** svih `.md` (CLAUDE pravilo #6).

---

## 2. Reusable podsistemi (META-CILJ temelja)
Ne razmišljamo o „taskovima" nego o **jezgrenim reusable podsistemima** koje SVAKA buduća feature
(CRUD/UGC/AI-tutor/SRS) samo slaže. Svaki se **otvrdne jednom, koristi svugdje:**

| # | Podsistem | Što je | Tko ga koristi kasnije |
|---|-----------|--------|------------------------|
| S1 | **ContentRepository** | jedan čist sloj „dohvati sadržaj" (datoteka/baza/API iza istog sučelja) | CRUD (piše), SW (keš), tutor (kontekst), engine (čita) |
| S2 | **Čisti podatkovni format** | study sadržaj = JSON (podatak); vježbe = JS moduli (kod) | CRUD, validacija, prijevod, baza/CMS |
| S3 | **AppState** | globali → jedan imenovani namespace | CRUD, tutor, UGC, debug |
| S4 | **UI-primitivi (Web Components)** | `<sokrat-toast/modal/card/...>` umjesto ad-hoc `innerHTML` | CRUD forme, UGC, cijeli UI |
| S5 | **i18n** | `{en,hr}` rječnik + `t()` + `applyTranslations` (skoro gotov) | svaki novi UI tekst |
| S6 | **Auth/permisije (RLS)** | identitet + tko-smije-što | CRUD (admin), UGC (per-user), profil |
| — | **Presjećni** | CI/CD, type-safety (JSDoc+tsc), error-monitoring | sve |

---

## 3. Misije (faze) — redoslijed, ovisnosti, KAKO, brick-liste

> **Zašto baš ovaj redoslijed:** prvo jeftine/sigurne/neovisne cigle (grade povjerenje + de-riskiraju), pa
> reusable jezgra, pa performanse na čistom šavu, pa veliki kamen (CRUD), pa produkt-WOW, pa pred-UGC sigurnost.
> **CI ide PRVO** jer štiti svaku sljedeću izmjenu. **CRUD ide KASNO** jer sjedi na čistoj jezgri (S1–S4).

### ▸ FAZA 0 — Zapis odluka + čisti repovi  ✅ (ovo se radi SAD)
**Cilj:** fiksirati odluke da prežive compact i da se može odmah krenuti.
- [0.1] `docs/FOUNDATION_PLAN.md` (ovaj doc).
- [0.2] **ADR-013** (content arhitektura) + **ADR-014** (engineering standardi) u DECISIONS.md.
- [0.3] Pokazivači: ROADMAP §AŽURNO + CLAUDE.md §Stanje/§Ključne odluke + MEMORY.md + memory `foundation-pivot`.
- [0.4] **Commit ne-deployanog i18n chromea LOKALNO** (Odluka 3a — čuva se, deploya se s Fazom 1; treba cache-bump pri deployu).
- [0.5] BACKLOG: „hardening v1" + offline-feature + sonnet.md parkirane stavke.
**Gate:** sve `.md` točne, `verify` 0/0. **Bez deploya.**

### ▸ FAZA 1 — Reliability rails (jeftino, sigurno, neovisno)
**Cilj:** napravi tlo čvrstim i sigurnim PRIJE nego diramo jezgru. Sve cigle su niskorizične i neovisne o source-of-truth.
**Ovisnosti:** nema (može odmah nakon F0).

- **1A — CI/CD (GitHub Actions + Vercel preview):** *najvažnija cigla faze.* ✅ **GOTOVO + GITHUB-ZELEN 2026-06-29** (grana `foundation/f1`, run #28342101467, svi koraci success, ~5 min).
  - [1A.1] `.github/workflows/ci.yml` — na svaki push/PR pokreni `npm ci` → `validate:content` → `verify` → `test:unit` → `playwright`.
  - [1A.2] Playwright u CI-u (headless, instalacija browsera u workflowu); artefakti (screenshotovi) na fail.
  - [1A.3] Potvrdi da Vercel radi **preview-deploy po grani** (već uključeno) → dokumentiraj „grana → preview URL → provjera → prod" tok u TESTING.md.
  - **Done-kriterij:** push na granu = zelen/crven CI; nijedan merge u `main` ako je crveno.
- **1B — Type-safety bez build-a (JSDoc + `tsc --checkJs`):** ✅ **GOTOVO 2026-06-29.**
  - [1B.1] ✅ `tsconfig.json` (`checkJs`/`noEmit`/`allowJs`/**`strict`**; `include` SCOPED, raste modul-po-modul); `typescript` devDep v6.
  - [1B.2] ✅ JSDoc tipovi — pilot `js/i18n.js` + `types/globals.d.ts` (ambient `SokratCatalog`/`window.*`). Samo komentari → 0 runtime.
  - [1B.3] ✅ `npm run typecheck` (= `tsc --noEmit -p tsconfig.json`) + korak u CI (1A) poslije `test:unit`. `tsc` je samo checker.
  - **Done-kriterij:** ✅ `typecheck` zelen na pilotu (exit 0); obrazac dokazan (novi modul → `include` + globali + JSDoc). Širi se kasnije.
- **1C — Hardening v1 (sonnet.md, provjereno):** ✅ **GOTOVO 2026-06-29.** sve male, vidljive, 0-rizik.
  - [1C.1] ✅ `vercel.json`: maknut `X-XSS-Protection`; dodani `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  - [1C.2] ✅ `js/storage.js` `loadProgress()` (NE analytics.js — tu je funkcija): `Object.assign({}, defaultProgress, parsed)` + try/catch na `JSON.parse` (pokvaren JSON → default).
  - [1C.3] ✅ Mrtav `lessonCategoryMap` ENTRY uklonjen (`js/config.js` → `{}`); ID-evi `second-exam-prep`/`final-exam-prep` potvrđeno postoje samo u config.js. Varijabla + mehanizam ostaju (navigation.js:545 radi → else grana = pun sadržaj).
  - [1C.4] ✅ „400+" (samo 1×, ne ×3) → **dinamički `questionCount`**. Novo: `scripts/compute-stats.js` (`npm run stats`) broji fc+quiz+fill po FINAL lekciji svakog primarnog predmeta → generira `data/landing-stats.js` (`window.SOKRAT_STATS`, eager); `renderLandingMeta()` puni `[data-meta="questionCount"]` (`toLocaleString+'+'`). **Stvarno = 5721 (floored 5700)**. ⚠️ Regeneriraj `npm run stats` nakon izmjene sadržaja.
  - [1C.5] ✅ „Works offline" → pošteno „No install needed" / „Bez instalacije" (hero badge + i18n dict + 2 meta-opisa „works on any device"). Vrati na „offline" kad F3 SW slegne.
  - **Gate (sve provjereno ×):** validate 0/0 · verify 0/0 · typecheck 0 · unit 33/33 · **Playwright 76/76** (lazy-load test ažuriran da dopusti `landing-stats`; landing.spec dobio questionCount assertion). Cache bump `?v=20260698` (i18n/config/storage/navigation + landing-stats).
- **1D — TVRDI kvalitetni gateovi (nadogradnja #1 — razlika „zdravo→brutalno"):** ✅ **GOTOVO + GITHUB-ZELEN 2026-06-29** (run #28386199455, oba joba success).
  - [1D.1] ✅ **Lighthouse CI** (`.lighthouserc.json`, `@lhci/cli`, zaseban CI job `lighthouse` na Linuxu — Windows lokalno ima chrome-launcher `EPERM` na OneDriveu). ✅ **KALIBRIRANO na stvarne CI-brojeve (2026-06-29: a11y 98 / bp 100 / seo 100 / perf 66, LCP 6.6s):** tvrdi `error` **a11y/bp/seo ≥ 0.95** (deterministički) + **CLS ≤ 0.1** + **TBT ≤ 400ms** (mjerljivi, ne bučni); **performance ≥ 0.5** (nizak floor protiv katastrofe — perf je render-blocking CSS/fonts, **diže se u F3** bundling+defer+SW, pa onda prag → 0.9). `startServerReadyPattern` dodan (gasi „server timeout" warning).
  - [1D.2] ✅ **axe-core a11y gate** (`tests/a11y.spec.js`, `@axe-core/playwright`): 0 serious/critical na landing/browse/study/profil (1 viewport, izbjegava 4× šum). Mjereno baseline → nađen+popravljen 1 serious (`scrollable-region-focusable` na `.sidebar-content` → `tabindex=0`/`role=region`).
  - [1D.3] ✅ **Layout-regression guard** (`tests/layout-guard.spec.js`) — DETERMINISTIČKA geometrija (ne pikseli) → platform-neovisno, zeleno u CI-u bez baseline-slika; sweep 13 širina × {EN,HR}, CTA nikad odrezan + 0 overflowa = **BUG-015 klasa zaštićena**. ⬜ Pixel `toHaveScreenshot` ODGOĐEN (treba Linux baseline; nema Dockera/CI-tokena — vidi BACKLOG).
  - **Done-kriterij:** ✅ sva tri gatea zelena u CI (build job nosi axe+layout-guard; lighthouse job nosi budžete).
- **1E — RLS sigurnosni test (nadogradnja #3):** ✅ **GOTOVO 2026-06-30.** RLS bez automatskog testa = sigurnosna bomba pred UGC/CRUD.
  - **⚠️ Odluka o pristupu:** Supabase **branching traži Pro plan ($25/mj)** (provjereno: org je `free`, branch compute $0.01344/h ALI tek nakon Pro). Ne isplati se samo za RLS. → **Opcija 1: read-only test protiv POSTOJEĆE baze** (besplatno, testira STVARNE produkcijske politike — zapravo bolje).
  - [1E.1] ✅ `scripts/rls-check.js` (`npm run test:rls`) — anon (publishable) ključ, READ-ONLY, bez pisanja.
  - [1E.2] ✅ Dokazuje: anon **ČITA** `subject_content` (javna politika `using(true)`); anon **vidi 0 redova** `progress` (RLS `auth.uid()=user_id`). **Curenje (anon vidi progress) → exit 1 (CI crveno).**
  - [1E.3] ✅ **Skip-on-unreachable:** free-tier baza uspavana/nedostupna → SKIP (exit 0), ne lažni crveni. Windows libuv teardown riješen (jedan izlaz + 300ms odgoda).
  - **Done-kriterij:** ✅ lokalno prošlo (anon: 5 redova content / 0 redova progress); korak u CI build jobu. Branching (izolirani test) = BACKLOG kad/ako Pro.
**Gate faze:** ✅ **F1 GOTOVA 2026-06-30** — CI zelen (Lighthouse budžeti + axe + layout-guard + RLS-test + typecheck + validate/verify/unit/Playwright). Sve na grani `foundation/f1`; produkcija netaknuta. Preostaje: prod-deploy (uz potvrdu) + Vercel preview pregled.

### ▸ FAZA 2 — Reusable jezgra (srce temelja)
**Cilj:** izgraditi S1–S4 + error monitoring. Ovo otključava CRUD i čisti SW.
**Ovisnosti:** F1 (CI mora štititi ove veće refaktore).
**▶ STATUS (2026-07-01): 2B (S1 Repo) + 2E (Sentry) ✅ DEPLOYANI NA PRODUKCIJU** (`164dc11..57f449a`, grana `foundation/f2`→main, CI zelen, live+Sentry verificirano). **✅ 2A (S2 JSON) DEPLOYANO NA PRODUKCIJU (2026-07-02, ff-merge `0c21aa6..661dbc8` uz potvrdu korisnika; live verificirano: tokeni `20260702`/`20260700`, 17 flagova, JSON servira `application/json`, loader dual-read):** 2A.1 ✅ (JSON Schema, 54/54) · 2A.2 ✅ (exporter + pilot) · 2A.3 ✅ (dual-read) · 2A.4 ✅ (17/18 migrirano; accounting svjesno odgođen → **DOVRŠEN 18/18 2026-07-03 `d2b1e48`, ADR-015**). Gate: CI zelen (GitHub) + Vercel preview provjeren do bajta (SHA1) + puni Playwright 117/0. **✅ 2C (S3 AppState) KOMPLETNA + DEPLOYANA NA PRODUKCIJU (2026-07-03, ff-merge `73f3809..f54048a`; CI zelen; preview EOL-verificiran; live: 16× `20260703`, AppState servira, BUG-016 fix live):** svih 5 grupa globala → `window.AppState`, config.js bez ijednog mutable `let`; usput BUG-016 nađen funkcionalnim testom + popravljen (`68bf7e1`). Gate: puni Playwright **133/0**. **✅ 2D (Web Components) — 2D.1/2D.2a/2D.2b DEPLOYANI 2026-07-04 (`d2b1e48..9b62428`, grana `foundation/f2d`): `<sokrat-toast>` + `<sokrat-modal>` primitiv + learn image-viewer migriran; Playwright 157/0.** **✅ 2D.2c (auth modal `#authModal` → `<sokrat-modal>`, najrizičnija cigla, zadnji ad-hoc overlay) DEPLOYANO NA PRODUKCIJU 2026-07-04 (ff-merge `ba1c6f9..4ed6e75`; grana obrisana; live-verified: produkcija servira `js/auth.js?v=20260708` s `createElement('sokrat-modal')`; korisnik potvrdio login/logout na preview-u; cache `20260708`, Playwright `components`+`auth`+`a11y` 36/0, vizualno OK). Uz to ADR-016 (`service_role`→Supabase Edge) + BACKLOG „Obriši račun" (GDPR).** **✅ 2D.3 (`<sokrat-confirm>` branded confirm-dijalog, prva kompozicija na `<sokrat-modal>`; zamijenio 3 native `confirm()`) DEPLOYANO NA PRODUKCIJU 2026-07-04 (ff-merge `7d88e5c..df67766`; grana obrisana; live-verified: `sokrat-confirm.js?v=20260709` servira + `analytics.js` `askConfirm`; PUNA Playwright 165/0, vizualno OK; cache `20260709`).** **→ time F2 (reusable jezgra) KOMPLETNA (2A/2B/2C/2D/2E svi LIVE).** DALJE: **F3** (Service Worker + CSS bundling + auto version-bump).

> **🔁 REVIZIJA REDOSLIJEDA (2026-06-30, dogovoreno s korisnikom — utemeljeno u kodu):** izvodi **2B (S1 Repo) PRIJE 2A (S2 JSON)**,
> i **2E (Sentry) odmah nakon S1 wrappera** (prije rizične migracije). Razlozi: (1) **F3 (sljedeća faza) ovisi o S1, ne o S2-complete** —
> SW kešira kroz Repo; (2) **S1 thin-wrapper = 0 rizika za podatke** (omota postojeće funkcije) → daje šav PRIJE diranja podataka;
> (3) S2 migracija je onda sigurnija (dual-read na jednom mjestu, iza Repo sučelja); (4) Sentry ranije = **vidljivost grešaka DOK** se migrira 17 predmeta.
> **Bonus nalaz:** „podatak≠kod" (BUG-012) je VEĆ strukturno riješen u `content-loader.js:84-98` (`scripts` vs `codeScripts`), a `migrate-content.js`
> već vadi JSON → 2A je manje rizična nego što se činilo. **Izvedbeni redoslijed:** 2B.1 → 2B.2 → 2B.3 → 2E → 2A.1–2A.4 → 2C → 2D.

- **2A — Čisti podatkovni format (S2):** *najvažnija, radi se JEDAN PREDMET ODJEDNOM.* *(▶ AKTIVNO — grana `foundation/f2a`)*
  - [2A.1] ✅ **GOTOVO (2026-07-01, `1fc6c19`):** kanonski **JSON shape** + **JSON Schema** (`schema/subject-content.schema.json`, draft-07)
    + enforcing validator `scripts/validate-json-schema.js` (`npm run validate:schema`, ajv dev-dep) + CI korak. **Izviđanje svih 18 predmeta
    PRIJE pisanja** otkrilo nedokumentirana ali stvarna polja (`quiz.image`/`imageAlt` = Geography „koji grad je na slici", `learn.title`,
    `learn.image=null`) → uključena, `additionalProperties:false` sad siguran. **Dokazano: 54/54 dokumenta (18×3) poštuju schemu.** Strukturni
    ugovor nadopunjuje `validate:content` (semantika). Bez runtime izmjena (schema/scripts = dev/CI) → bez cache bumpa.
  - [2A.2] ✅ **GOTOVO (2026-07-01, `55feb5f`):** exporter `scripts/export-content-json.js` (`npm run export:json [id] [--check]`) — vm window-shim
    → `data/json/<id>/<var>.json` (uniforman put, zrcali DB model 1 red=1 var). **Dokazano:** round-trip SVIH 54 payloada bez gubitka (nema funkcije/undefined),
    pilot `sit` (3 datoteke) — nezavisna ajv-validacija file-ova + SHA1 bajt-identičan re-run (deterministički) + `--check` on-disk sync. `.gitattributes` `data/json/**/*.json eol=lf`
    (stabilan Windows/Linux) + `--check` EOL-neutralan. **CI gate `export:json --check`** (čim JSON postoji, čuva se od drifta). Vježbe se NE exportaju (BUG-012). 0 runtime rizika (ništa još ne čita `.json`).
  - [2A.3] ✅ **GOTOVO (2026-07-01, `1f46c4c`; pilot `sit`):** loader čita study iz `data/json/<id>/<var>.json` po catalog-flagu `content.dataFormat:'json'`,
    inače stari `.js`. Prioritet: **DB → JSON → .js** (DB ostaje autoritativna, Blok B; JSON zamjenjuje `.js` u file-tieru). JSON-mod fallback na PUNE `.js` ako fetch
    padne (404/offline/neispravan) → 0 regresije. Vježbe uvijek iz `.js` (BUG-012). `verify` čuvar #7 (flag bez JSON datoteka = hard-fail). **Provjere:** `dual-read.spec.js`
    12/12 [(a) sit iz JSON-a a NE iz `.js`; (b) **SHADOW ekvivalencija** — JSON-učitan `window.sitM1` === `.js`-učitan, bajt-u-bajt; (c) JSON blokiran → `.js` fallback] +
    puni Playwright **113 pass/0 fail (subjects=18, problems=0)**. Cache `?v=20260700` (catalog+loader). *(Napomena: sa budnom bazom sit i dalje dolazi iz DB-a; JSON = dokazani mrežni sloj + portabilni format za F4.)*
  - [2A.4] ✅ **GOTOVO (osim accountinga).** Migriraj predmete (`export:json <id>` + `dataFormat:'json'` flag + gate). **2A.4a ✅ (`134b7cb`):** statistics + macroeconomics + math
    (kvantitativni s vježbama — dijele exercise put: study iz JSON + vježbe/lib iz `.js`; NOVI `dual-read` exercise-test dokazuje BUG-012 očuvan). **2A.4b ✅ (`04e09f0`):** preostalih 13 predmeta
    (te2, entrepreneurship, ebusiness, econ-hospitality, marketing, geography, food-nutrition, business-informatics, management, traffic, microeconomics, academic-writing, business-informatics-hr).
    **Migrirano 17/18** (svih osim **accountinga** — svjesno odgođen po korisnikovoj napomeni; format-only kasnije uz OK). Vježbe OSTAJU JS moduli (S2 pravilo). Gate: verify 0/0 (guard = 51 JSON), validate:schema 54/54, export --check 54/54, Playwright 117/0.
  - **Done-kriterij:** svi study-podaci portabilni kao JSON; `.js` postaje generirani export (ne uređuje se ručno).
- **2B — ContentRepository (S1):**  *(▶ AKTIVNO — radi se PRVO, vidi reviziju gore)*
  - [2B.1] ✅ **GOTOVO (2026-06-30, grana `foundation/f2`):** `js/content-repo.js` → `window.SokratContent` (tanki omotač oko postojećih
    funkcija): `listSubjects()`/`getSubject(id)`/`isLessonComingSoon(id,lessonId)` (sinkrono iz catalog-a) + **`loadLesson(subjectId,lessonId)`**
    (objedini `loadSubjectContent`+`getSubjectData` u jedan async poziv) + `isLoaded(id)`. **NULA promjene ponašanja** (DB↔datoteka fallback već u
    loaderu). Test `tests/content-repo.spec.js` dokazuje EKVIVALENCIJU (`loadLesson === getSubjectData`, identična referenca; 8/8 × 4 profila). Cache `?v=20260699`.
  - [2B.2] Implementacije: `FileRepo` (JSON datoteke) + `SupabaseRepo` (već postoji read-path) iza istog sučelja; flag bira izvor; fallback ostaje. *(većinom već zadovoljeno UNUTAR `loadSubjectContent` — formalizirati kad 2A donese `.json`.)*
  - [2B.3] ✅ **GOTOVO (2026-06-30, grana `foundation/f2`):** `navigation.js:initStudyPage` više ne radi ručni `loadSubjectContent`+`getSubjectData`
    nego **`await SokratContent.loadLesson(subjectId, lessonId)`** (jedan poziv). Fallback na stari dvokorak ako Repo nije prisutan → 0 regresije.
    `navigation.js?v=20260699`. Gate: verify 0/0, typecheck 0, content-repo 8/8, lazy-load 4/4, **puni responsive smoke 89 pass / 0 fail (subjects=18, problems=0)**.
    *(Preostaje za pun „svi pozivi kroz Repo": ostali potrošači `getSubjectData`/`loadSubjectContent` — migrirati postupno kad zatreba.)*
  - **Done-kriterij:** prebacivanje datoteka↔baza = config; CRUD i SW kasnije koriste isti Repo.
- **2C — AppState (S3):** *oprezno, inkrementalno — NE sve globale odjednom.* *(▶ AKTIVNO — grana `foundation/f2c`)*
  - **Izviđanje (2026-07-02):** praktički SVI mutable globali žive u `js/config.js` (L47–106), već grupirani: nav `current*` (97 ref.) ·
    quiz (92) · fill (38) · flashcards/cards (30) · session. ⚠️ Imena `progress`/`analytics`/`flashcards` postoje i kao DOM id-jevi/
    stringovi/propertyji → migracija ČITANJEM svakog mjesta, NE slijepim regexom. `progress`+`analytics` NISU u AppState (vlastiti
    persist-lifecycle kroz storage.js/cloud-sync.js — zasebna analiza ako ikad).
  - [2C.1] ✅ **GOTOVO (2026-07-02, `0a43fc9`):** `js/app-state.js` → `window.AppState` s grupama **nav/cards/quiz/fill/session**
    (početne vrijednosti = config.js `let`-ovi; grupa NEAKTIVNA dok se ne migrira → nema dvostrukog izvora istine). JSDoc typedefi +
    tsconfig include + `Window.AppState` u globals.d.ts. Učitava se PRIJE config.js (`?v=20260703`). Test `tests/unit/app-state.test.js`
    (8 testova; isti-realm load — vm cross-realm ruši `deepStrictEqual`). Gate: typecheck 0, unit 41/41, verify 0/0, smoke 16/16.
  - [2C.2] Migracija **jedne skupine globala odjednom**, s testovima:
    - [2C.2a] ✅ **GOTOVO (2026-07-02, `a08dc3b`):** **fill** grupa (`fillQuestions/currentFillIndex/fillCorrect/fillWrong` → `AppState.fill.questions/index/correct/wrong`).
      Dirano SAMO `fill-blanks.js` (24 ref.) + `progress.js` (2) + brisanje `let`-ova iz config.js. DOM id-jevi `'fillCorrect'`/`'fillWrong'` NEDIRNUTI
      (ista imena kao stare varijable — dokaz zašto ne regex). Grep-dokaz: 0 preostalih golih referenci. NOVI funkcionalni test `tests/app-state.spec.js`
      (fill tijek: točan→kriv→skip→progress 33%; stanje inspektabilno kroz `window.AppState` — prije nemoguće, top-level `let` nije na window) 4/4.
      Cache `?v=20260703` (config/fill-blanks/progress).
    - [2C.2b] ✅ **GOTOVO (2026-07-02, `9612977`):** **cards** grupa (`flashcards/currentCardIndex/knownCards/unknownCards` →
      `AppState.cards.deck/index/known/unknown`; dirano SAMO flashcards.js — ostale `flashcards` pojave su propertyji/stringovi/i18n).
      Funkcionalni flashcards-test (klik ✓/✗/prev kao korisnik + swap unknown→known + `progress.flashcardsLearned`) 8/8.
      **Test ULOVIO stvarni pre-postojeći bug → BUG-016** (`68bf7e1`): landscape mobitel — `.flashcard` fiksna/capana visina (relikti
      prije BUG-013 u `responsive/03`+`04`) → lice stršalo preko Known/Unknown gumba (tap=flip). Fix CSS-only + sweep anti-patterna čist.
      Cache `styles.css?v=20260703`.
    - [2C.2c] ✅ **GOTOVO (2026-07-02, `1997014`):** **quiz** grupa (9 varova → `AppState.quiz.questions/index/correct/wrong/startTime/wrongList/
      shuffledOptions/shuffledCorrectIndex/answers`). Dirano SAMO quiz.js (analytics.js pogoci = propertyji `analytics` objekta, NE globali;
      `'wrongAnswersList'` je i DOM id — nediran). Funkcionalni quiz-test (točan→kriv→review krivih→rezultati 80%→retry) 12/12.
    - [2C.2d] ✅ **GOTOVO (2026-07-02, `2d75dd1`; puni Playwright 133/0):** **nav** grupa (`currentPage/currentSubject/currentLesson/currentData/currentSection/currentCategory`
      → `AppState.nav.page/subject/lesson/data/section/category`; **13 datoteka**: navigation/progress/quiz/flashcards/fill-blanks/learn/
      exercises/analytics/storage/auth/cloud-sync/blind-map/init). **⚠️ Ključna zamka riješena:** 3 `typeof currentX !== 'undefined'` guarda
      (exercises/auth/cloud-sync) bi nakon brisanja `let`-ova TIHO promijenila ponašanje → prepisani na `typeof AppState` (typeof-oblik zadržan).
      DOM id-jevi `currentSubjectTitle`/`currentLessonTitle` nedirnuti. Novi funkcionalni nav-test (navigateTo/switchSection/last-position iz AppState-a);
      spec 16/16. Cache: svih 13 datoteka + config `?v=20260703`.
    - [2C.2e] ✅ **GOTOVO (2026-07-02, `1997014`):** **session** grupa (`sessionStartTime` → `AppState.session.startTime`; samo analytics.js, 4 ref.).
  - **Done-kriterij:** ✅ **ISPUNJEN (2026-07-02, `2d75dd1`)** — config.js bez mutable `let` globala (svih 5 grupa migrirano; ostaju samo
    `const subjectDataMap`/`lessonCategoryMap` + `progress`/`analytics` s vlastitim persist-lifecycleom); runtime stanje =
    `window.AppState` (inspektabilno iz konzole/testova — prije nemoguće jer top-level `let` nije na window; temelj za CRUD/tutor/debug).
- **2D — UI-primitivi = Web Components (S4):** *inkrementalno, light-DOM (bez Shadow DOM — čuva globalni CSS/teme).*
  - [2D.1] ✅ **GOTOVO + DEPLOYANO (2026-07-04, grana `foundation/f2d`→main `d2b1e48..9b62428`):** Pilot `<sokrat-toast>` (`js/components/sokrat-toast.js`)
    — prvi custom element, dokazan obrazac (registracija → lifecycle → `.show()` metoda). **Light-DOM zadržava klasu `.toast`** → svi CSS-ovi (base +
    responsive) vrijede nepromijenjeno. `showToast()` (js/utils.js) sada **delegira** na komponentu, uz **fallback** na stari DOM-put (0 regresije ako
    element ne upgrade-a). Komponenta preselila show-logiku doslovno (isti reflow-restart + 2500 ms auto-hide) + a11y (`role=status`/`aria-live=polite`).
    U typecheck scopeu (novo polje `Window.SokratToast`). Test `tests/components.spec.js` (registracija + show/hide). Cache token `20260705` (utils + nova komponenta).
    Gate: verify/typecheck/unit/validate 0, **Playwright 145/0**.
  - [2D.2] ▶ `<sokrat-modal>` — reusable overlay/dialog primitiv. Dijeli se na pod-cigle (auth = najrizičniji → zadnji):
    - [2D.2a] ✅ **GOTOVO + DEPLOYANO (2026-07-04, grana `foundation/f2d`→main `d2b1e48..9b62428`):** samostalni primitiv `js/components/sokrat-modal.js`
      (`open()`/`close()`/`toggle()`/`isOpen()`; eventi `sokrat-modal:open`/`:close`) + `css/sokrat-modal.css` (light-DOM overlay). Ponašanje: ESC-zatvara,
      backdrop-klik-zatvara, `body.modal-open` scroll-lock, fokus-u-modal (rAF) + focus-restore + Tab-trap, a11y (`role=dialog`/`aria-modal`/`aria-hidden`).
      **Nijedan postojeći modal još ne migriran → 0 rizika.** U typecheck scopeu (`Window.SokratModal`). Test: stanje (is-open/aria/scroll-lock/ESC/backdrop)
      gate-ano; fokus-management dokumentiran (touch-profili ne fokusiraju tapom → verificiran ručno/scratch, ne gate-an). Cache `20260706`. Gate: **Playwright 153/0**.
    - [2D.2b] ✅ **GOTOVO + DEPLOYANO (2026-07-04, grana `foundation/f2d`→main `d2b1e48..9b62428`):** learn image-viewer (`#imageModal`) migriran na `<sokrat-modal>` —
      prvi STVARNI konzument primitiva. `<div class="image-modal hidden">` → `<sokrat-modal class="image-modal">`; komponenta vodi ESC/backdrop-klik/scroll-lock/fokus;
      izgled (tamni backdrop 0.9, safe-area, close X, instant bez fade-a) očuvan kroz `sokrat-modal.image-modal` override (learn.css poslije sokrat-modal.css → pobjeđuje).
      `learn.js` delegira (`openLearnImageModal`→`modal.open()`, close preko `sokrat-modal:close` eventa čisti sliku); maknut `#imageModalBackdrop` div + ručni ESC handler.
      **Nulta vizualna promjena — potvrđeno screenshotom.** Test u `components.spec.js` (open/ESC/clear). Cache `20260707`. Gate: **Playwright 157/0**.
    - [2D.2c] ✅ **GOTOVO + DEPLOYANO NA PRODUKCIJU (2026-07-04, ff-merge `ba1c6f9..4ed6e75`; live-verified):** **auth modal** (`#authModal`) migriran s ad-hoc `innerHTML` overlaya na `<sokrat-modal>` —
      zadnji ad-hoc overlay u appu. `injectModal()`: `createElement('sokrat-modal')`, maknut `.auth-modal__backdrop` div (+`wrap.hidden`) — backdrop je komponentin overlay; kartica bez
      **dupliranog** `role=dialog`/`aria-modal` (komponenta je jedini dialog), `aria-labelledby` na komponentu. `openModal`/`closeModal` → `m.open()`/`m.close()` (fallback ako ne upgrade-a);
      `data-auth-close` (close X) ostaje. **Sav login/signup/forgot/recovery tok netaknut.** `css/auth.css`: overlay pravila → `sokrat-modal.auth-modal` override (backdrop 0.72+blur6 kao prije)
      + `> *` `max-width:420px` (card cap; generički `> *` postavi 100%). **Bonus iz primitiva:** ESC-zatvaranje + scroll-lock + fokus/Tab-trap/focus-restore (auth prije ništa od toga).
      **Vizualno potvrđeno screenshotom** (desktop 420px centrirano / mobitel 335px, backdrop/X/tabovi/eye-toggle — nulta regresija). Test u `components.spec.js` + `auth.spec.js` zelen.
      Cache `20260708`. Gate: verify/typecheck/unit 0, **Playwright `components`+`auth`+`a11y` 36/0** (12 a11y-skip po dizajnu).
  - [2D.3] ✅ **GOTOVO + DEPLOYANO NA PRODUKCIJU (2026-07-04, ff-merge `7d88e5c..df67766`, live-verified):** prvi konzument = **`<sokrat-confirm>`** (branded confirm-dijalog, GRAĐEN NA `<sokrat-modal>` = prva kompozicija komponenti).
    `js/components/sokrat-confirm.js` + `css/sokrat-confirm.css`; API `el.ask(opts)→Promise<boolean>` + globalni `window.askConfirm(opts)` (singleton `#confirmDialog`, fallback na native `confirm()`). Confirm→true,
    Cancel/ESC/backdrop→false, `danger:true`→crveni gumb; modal nasljeđuje ESC/scroll-lock/fokus/Tab-trap. **Zamijenio 3 native `confirm()`** (analytics reset×2 → `async`, profile delete-cloud). `i18n` `common.cancel`/`common.confirm`.
    **Budući konzument = GDPR „Obriši račun" dvostruka potvrda (ADR-016).** Vizualno OK (screenshot; 420px/335px). Cache `20260709`. Gate: verify/validate/typecheck/unit 0, **PUNA Playwright 165/0**. *(CRUD forme (F4) grade se iz ovih primitiva.)*
- **2E — Error monitoring = Sentry s release-trackingom (nadogradnja #2):** ✅ **GOTOVO + DEPLOYANO NA PRODUKCIJU (2026-07-01, `164dc11..57f449a`).**
  - [2E.1] ✅ `js/monitoring.js` → `window.SokratMonitor` (`captureException`/`enable`/`disable`/`status`). Globalni `error`+`unhandledrejection`
    hvatači instalirani odmah; prosljeđuju TEK kad `enabled` (pristanak). **SIGURAN NO-OP bez DSN-a** (ništa se ne učita/šalje, NIKAD ne baca).
    Sentry **Loader Script** (URL iz ključa u DSN-u) → **nema fiksne verzije SDK-a → nema 404 rizika** (poučeno KaTeX-om). `defer`, no-build.
  - [2E.2] ✅ Release-tracking: `APP_RELEASE = 'sokrat-study@<token>'` konstanta (kasnije iz auto-version-bump skripte, 3C).
  - [2E.3] ✅ **GDPR/consent-aware:** `consent.js applyConsent(granted)` → `SokratMonitor.enable()/disable()` (ISTI gate kao GA; `sendDefaultPii:false`).
    Učita se na svih 5 stranica gate, no-op na pravnima (guard `if(window.SokratMonitor)`). **Alerting** = Sentry dashboard mail-prag (postavlja korisnik uz DSN).
  - ✅ **LOADER UPISAN (2026-06-30):** `SENTRY_LOADER_URL = 'https://js-de.sentry-cdn.com/59736986…min.js'` (EU/DE regija — GDPR plus; ključ u URL-u JAVAN, kao GA ID).
    Test `tests/monitoring.spec.js` (loader STUBBAN preko `page.route` → offline): 12/12 — pristanak gate, init(release), proslijeđena greška, nikad ne baca.
  - ✅ **ŽIVA PROVJERA GOTOVA (2026-07-01, lokalno protiv grane):** obje test-greške stigle na Sentry dashboard (`Error: Sokrat test…` JAVASCRIPT-1 + `ReferenceError: myUndefinedFunction…` JAVASCRIPT-2 Unhandled), release `sokrat-study@20260699`. Stack pokazao `sentryWrapped` = SDK aktivan. **Done-kriterij ISPUNJEN.**
  - ✅ **Dashboard očišćen (korisnik):** isključeni **Enable Tracing** + **Enable Session Replay** + **Enable Logs and Metrics** → čisto ERROR-monitoring (bez snimanja sesije/perf).
  - ✅ **GDPR disclosure GOTOVA:** `privacy.html` §5 dobio odlomak o Sentryju (samo tehnički error-report, bez PII/replay/perf, EU/DE, čl. 6(1)(a) pristanak; „Last updated" 1 July 2026) + cookie-banner tekst proširen na „analytics &amp; error-monitoring".
  - ✅ **DEPLOYANO na produkciju 2026-07-01** (F2 2B+2E, ff-merge `foundation/f2`→main). **PREOSTAJE samo opc.:** mail-alert prag na Sentry dashboardu (korisnikov korak).
  - *(Fallback ako Sentry tier zasmeta: mini-logger `window.onerror`→Supabase tablica iza istog `captureException` sučelja — zamjenjivo.)*
**Gate faze:** CI/typecheck zeleni, sav sadržaj kroz Repo, 0 regresija (Playwright pun + ručni smoke svih modova × par predmeta).

### ▸ FAZA 3 — Performanse (na čistom šavu)
**Cilj:** platforma stvarno brza i offline-sposobna.
**Ovisnosti:** F2 (SW kešira kroz ContentRepository → mora postojati čist šav).
**▶ STATUS (ažurirano 2026-07-06): F3 ✅ KOMPLETNA + DEPLOYANA NA PRODUKCIJU.** Jezgra 3C.1+3B+3A 2026-07-05 (main `868dc9f`); **3D.1+3D.2+3E.1+3E.2 DEPLOYANI 2026-07-06 (ff-merge `e39eb1d..b19a641` grana `foundation/f3d`→main uz izričito odobrenje; CI zelen oba job-a; Vercel preview vizualno potvrđen; live-verified: token `20260706003609`, `blind-map.webp` HTTP 200 40KB, `--danger-text:#f87171` live, `media="print"` async, `/sw.js` `max-age=0`).** Redoslijed cigli = **najsigurnija/najneovisnija prva, najrizičnija zadnja** (kao 2D): **3C → 3B → 3A → 3D → 3E**
(NE doc-brojevni A→E). Razlog: 3C je 0-runtime-rizik dev-alat koji gasi baš klasu rizika (BUG-004) izdvojenu na health-checku, i čini 3A/3B sigurnijima (pouzdan bump); SW (3A) = najrizičnija (može zaglaviti stari keš) → zadnja velika.
- [3C] **Auto version-bump** (`scripts/bump-version.js`) — ✅ **3C.1 GOTOVO + ✅ DEPLOYANO NA PRODUKCIJU 2026-07-05 (s jezgrom F3, main `868dc9f`):** JEDAN broj za cijelu app.
  `npm run bump` = svi `?v=` (~92 mjesta: 5 HTML + styles.css @import + manifest.json) + `CONTENT_VERSION` → novi `YYYYMMDDHHMMSS` timestamp ODJEDNOM
  (nemoguće zaboraviti podskup). `npm run bump:check` = **TVRDI CI gate**: svi tokeni identični, drift = crveno (BUG-004 čuvar). Normalizirano 92 → `20260704162056`.
  **ADR-017** (uniformni token > content-hash; trade-off: deploy busta sve cacheve). Gate: verify/validate/schema/typecheck/export 0, bump:check 0, Playwright smoke 18/0.
  **⬜ 3C.2 (odgođeno):** konzistencijski gate hvata *parcijalni* bump; „zaboravio pokrenuti bump" zatvara **git-diff freshness gate** (promijenjen asset ⇒ token napredovao)
  ILI čišće **auto-bump na Vercel deploy-u** (nula discipline) — prirodno se veže uz 3B build-korak.
- [3B] **CSS bundling** — ✅ **GOTOVO + ✅ DEPLOYANO NA PRODUKCIJU 2026-07-05 (s jezgrom F3, main `868dc9f`):** 26 `@import` → 1 **`styles.bundle.css`** (`scripts/build-css.js` konkatenira `css/*.css` u @import redoslijedu; `styles.css`=izvor-manifest, ne servira se; `index.html`→bundle). `npm run build:css` + CI drift-gate **`build:css -- --check`** (bundle u sinku, kao data/json). Konkatenacija dokazano sigurna (0 relativnih `url()`/0 ugniježđenih @import/0 @charset). Ostaje no-framework, no-runtime-build (bundle je commitan artefakt). **META (Lighthouse baseline 2026-06-29): perf 66, LCP 6.6s, FCP 4.3s** — render-blocking `@import` waterfall je glavni krivac → ovo ga eliminira; **perf mjeri CI Lighthouse na push/deploy** (cilj perf ≥ 0.9, pa podići `performance` prag 1D.1). *(Minifikacija = moguć follow-up; konkatenacija sama ubija waterfall.)*
- [3A] **Service Worker** — ✅ **3A.1/3A.2/3A.3 GOTOVO + ✅ DEPLOYANO NA PRODUKCIJU 2026-07-05 (main `868dc9f`; 3A.3+deploy odrađeni na FABLE, ADR-019):** „Works offline" postaje ISTINA.
  `sw.js` konzervativan (same-origin GET only; **navigacija network-first** + fallback na keširani shell; asseti stale-while-revalidate; Supabase/CDN/non-GET → mreža; NE `skipWaiting`; activate-purge; kill-switch)
  + `js/sw-register.js` (`updateViaCache:'none'`, fail-safe) + `vercel.json` `/sw.js` no-cache + `SW_VERSION` u `npm run bump`. Copy „Works offline" vraćen (hero+i18n+meta). Test `tests/sw.spec.js` (registracija/kontrola + **offline load**).
  **Regresija (SW presretao fetcheve → 4 dual-read pala) popravljena:** globalno `serviceWorkers:'block'` u Playwright configu, SW izoliran u `sw.spec` (`allow`).
  ✅ **3A.3 GOTOVO (2026-07-05, FABLE po ADR-019):** Fable-pregled 3A.1/3A.2 našao+popravio **3 nalaza u `sw.js`** (navigate keširao i 404/500 → sad samo `res.ok`;
  `cache.put` bio fire-and-forget → sad pod `event.waitUntil`; precache `/styles.bundle.css` bez `?v=` bio mrtav ključ → sad `?v=SW_VERSION`, ADR-017 jamči poklapanje s HTML-om)
  + **update-flow „nova verzija":** `sw-register.js` prati `updatefound`/`reg.waiting` → **`<sokrat-toast>` s klik-akcijom** („Nova verzija je spremna — dodirni za nadogradnju",
  i18n `sw.updateReady` en/hr) → dodir šalje `sw:skipWaiting` → `controllerchange` → JEDAN reload (guard: reload SAMO uz korisnikov pristanak — prvi install/claim NIKAD ne reloada;
  bez dodira ništa se ne mijenja, novi SW preuzme idućim otvaranjem). `<sokrat-toast>` aditivno proširen: `show(msg, {duration, onClick})` (13 starih pozivatelja netaknuto).
  Testovi: `components.spec` toast-akcija + `sw.spec` **update-flow e2e** (re-registracija istog SW-a pod drugim URL-om = pravi waiting-worker; toast→dodir→reload→nova kontrola).
  Gate: **PUNA Playwright 181/0** (173 stara + 8 novih; 15 skipova po dizajnu), typecheck/unit/bump:check/build:css --check 0. Cache `20260705140655`.
  **✅ DEPLOYANO NA PRODUKCIJU 2026-07-05 (main `c115a5d..868dc9f`, uz izričitu potvrdu; CI zelen na `9581b81`).** Live-verified: token `20260705140655`; `/sw.js` = `max-age=0, must-revalidate`
  (override NADJAČAVA generički `.js` immutable) + servira `SW_VERSION`/`res.ok`/`sw:skipWaiting`/verzionirani precache; bundle immutable; sw-register update-flow + i18n ključ live.
  **🐛 Deploy-incident:** `"//"` komentar-ključ u `vercel.json` headers-unosu → Vercel schema ERROR **prije builda** (preview `9581b81` i prvi prod-pokušaj `c48fa4e` pali; produkcija ostala
  na starom deployu = fail-safe). GitHub Actions CI to NE hvata (ne validira vercel.json). Fix `868dc9f`. Pouka: provjeri i **Vercel check** na commitu, ne samo Actions; vercel.json bez komentar-ključeva.
  (Usput mergean korisnikov novi osobni README `90ac791` — README njegova verzija u cijelosti.)
- [3D] **Optimizacija slika** + lazy-loading. ✅ **3D.1 GOTOVO (2026-07-05, grana `foundation/f3d`, ✅ DEPLOYANO 2026-07-06):** `blind-map.png` (1.52 MB, 1536×1024) → **`blind-map.webp` q85 = 39 KB (−98%, 40×)**,
  vizualno identično (neonska kontura oštra, obalna razvedenost očuvana — provjereno okom). `js/blind-map.js`: probaj WebP → na grešci PNG fallback (postojeći `onerror` prošireni; PNG ostaje u repou za ~1.5%
  preglednika bez WebP-a) + dodan `?v=` token (`window.CONTENT_VERSION`, prije IZOSTAVLJEN). `static-server.js` dobio `.webp` MIME. Novi `tests/blind-map.spec.js` (WebP se stvarno dekodira, dim. 1536×1024,
  token prisutan, PNG-fallback se NE okida). Gate: **PUNA Playwright 185/0** (181+4), verify/typecheck/unit/bump:check/build:css --check 0. Cache `20260705161843`.
  **Nalaz izviđanja:** `loading="lazy"` je VEĆ na svim learn slikama (`learn.js`); geografski JPG-ovi (29–204 KB) već razumni; blind-map je bio ~95% ukupne težine slika → **3D.1 = glavni dobitak** (ali blind-map se učita SAMO u Geography → ne dira landing Lighthouse perf; vidi 3D.2).
  **⬜ Opcionalni ostatak (diminishing returns):** 1 inline geografska slika bez `lazy` (data-geography.js:112 → re-export JSON); geografski JPG→WebP; PWA `icon-512` (205 KB).
  ✅ **3D.2 render-blocking eliminacija (landing critical path) GOTOVO (2026-07-05, grana `foundation/f3d`, ✅ DEPLOYANO 2026-07-06):** landing perf bottleneck = 3 render-blocking eksterna CSS-a u `<head>`.
  **KaTeX CSS** (neiskorišten na landingu — komentar je LAŽNO tvrdio „ne blokira", samo je JS bio `defer`) + **Google Fonts** (`display=swap`) sad učitani **ASINKRONO** (`media="print"` → `onload` `media='all'`), s **`<noscript>` fallbackom**.
  **Font Awesome OSTAJE render-blocking** (async bi bljesnuo ikone kroz cijelu app — zaseban oprezan zahvat). + `preconnect` na `cdnjs`. **Nema bumpa** (HTML-only, ne-immutable). Vizualno provjereno (screenshot landing = savršeno, fontovi+ikone OK); `katex.spec` 4/4 (math i dalje renderira). Gate: **PUNA Playwright 185/0**.
  **CSP-napomena (F6):** inline `onload` → tada treba nonce/JS-flip. **✅ DEPLOYANO 2026-07-06.**
- [3E] **a11y prolaz** (tipkovnica/ARIA/kontrast) — pro + SEO. ✅ **3E.1 GOTOVO (2026-07-05, grana `foundation/f3d`, ✅ DEPLOYANO 2026-07-06):** dubinski axe audit (SVI impact-levovi, sve sekcije uklj. flashcards/quiz/fill/progress/legal).
  **⚠️ KLJUČNI NALAZ:** postojeći axe-gate (1D.2) skenirao je samo landing/browse/**learn**/profile → **flashcards/quiz/fill/progress bili IZVAN gate-a**, pa su kroz njih prošli **critical** violationi na produkciji. Uz to je gate skenirao learn PRESRANO (prije punog renderiranja) → propuštao learn-kontrast.
  **Popravljeno (0 serious/critical ostalo):** (a) **button-name** — flashcard `#btnPrev`/`#btnNext` (samo ikona) → `aria-label` (novi i18n mehanizam **`data-i18n-aria`** + `fc.prev`/`fc.next` en/hr; ikone `aria-hidden`); (b) **select-name** — quiz `#questionCount`/`#quizCategory`/`#quizDifficulty` → `<label for>` povezan;
  (c) **color-contrast** (raširen, svi predmeti): novi token **`--danger-text` #f87171** (outline/ghost crveni tekst); `.control-btn.wrong`/`.reset-btn`/`.stat.wrong` → `--danger-text`; `.fill-category` bijelo→tamni tekst na amberu; `.check-btn`/filter-active/tablica `th` bijelo na `--primary`(4.22:1)→`--primary-dark`(5.8:1); **learn h3/example-box** `--primary`(3.7:1)→`--primary-light`(5.3:1); **learn tip/warning box-naslovi** → svijetli tekst + OBOJANA IKONA (boja-signal ostaje, kontrast zajamčen);
  (d) **scrollable-region-focusable** — learn tablice (mobilni preljev) → `enhanceLearnTables()` u learn.js dodaje `tabindex=0`+aria-label (bez `role=`, čuva table-semantiku). **Gate PROŠIREN:** `a11y.spec.js` „study page" sada skenira SVE sekcije (learn/flashcards/quiz/fill/progress) → zatvorena rupa.
  Vizualno: izbornik kategorija + landing čist (screenshot); box-naslovi promijenili stil (obojan tekst→svijetli+obojana ikona) — pregledati na preview-u. Gate: **PUNA Playwright 185/0**, a11y 4/4, verify/typecheck/unit/build:css --check/bump:check 0. Cache `20260705215529`.
  ✅ **3E.2 GOTOVO (2026-07-06, grana `foundation/f3d`, ✅ DEPLOYANO 2026-07-06):** moderate landmarks — **sve 4 stranice sad 100% axe-clean (0 violationa BILO kojeg levela).** `region`: landing `.hero-stats`→`role=region`, `.landing-cta`→`aria-labelledby`, `.landing-nav`/`.landing-footer` + study/browse/profile zaglavlja (ugniježđena u `<section>` → izgubila implicitni banner/contentinfo) → **eksplicitni `role="banner"`/`role="contentinfo"`** (jedna stranica vidljiva odjednom → nema duplikata). `heading-order`: footer `h4`→`h3` (preskakao h2→h4; CSS zadržao veličinu). Sve **atribut-only osim footer tag+CSS** → 0 layout-rizika. Gate: **PUNA Playwright 185/0**, axe 4/4 **potpuno clean**.
  **✅ 3D+3E DEPLOYANI NA PRODUKCIJU 2026-07-06** (ff-merge `e39eb1d..b19a641`, live-verified `20260706003609`). **→ F3 KOMPLETNA.** **⬜ opcionalno (ne blokira): 3C.2** (auto-bump na Vercel deploy-u).
**Gate:** **Lighthouse TVRDI budžeti (1D.1) prolaze nakon SW/bundling** (perf još veći), offline test (DevTools offline), CI zelen. *(F3 cilj = podići perf/LCP iznad budžeta postavljenih u 1D, ne ih obarati.)*

### ▸ FAZA 4 — Authoring: custom Admin CRUD (veliki kamen)
**Cilj:** uređivanje sadržaja kroz sučelje, bez deploya. **Custom (korisnikova odluka), NE CMS.**
**Ovisnosti:** F2 (S1 Repo + S2 format + S4 primitivi su preduvjet — bez njih CRUD je krpa).
- [4A] **Source-of-truth flip:** baza postaje autoritativna u runtimeu; `.js`/`.json` datoteke = **generirani export** (commitan zbog gita/offline-a). Migriraj svih 17 (+HR) predmeta.
- [4B] **RLS/admin** (S6): tko smije uređivati; admin role. (RLS-test iz 1E pokriva regresije.)
- [4C] **CRUD UI** (iz S4 Web Components): popis → uredi predmet/lekciju/kategoriju/karticu/quiz/fill/learn. Validacija kroz JSON Schema (2A.1).
- [4D] **Export-generator** baza → datoteke (za git-povijest + offline fallback).
- **4E — Safety-net (nadogradnja #4 — flip je najopasnija cigla, MORA imati undo):** bez ovoga prvi krivi edit = trajan gubitak sadržaja.
  - [4E.1] **Content versioning/history:** svaka izmjena = NOVA verzija (`content_versions` tablica), ne overwrite → vraćanje na bilo koju prošlu verziju 1 klikom.
  - [4E.2] **Audit-log:** tko/kad/što (user_id, timestamp, diff). Obavezno prije UGC-a.
  - [4E.3] **Dry-run export-diff:** PRIJE flipa svakog predmeta pokaže točan diff baza↔datoteka; flip tek kad je diff očekivan (sigurnosna kočnica protiv tihog gubitka).
  - [4E.4] **Rollback-staza:** export-generator (4D) + git znači da je svaki flip reverzibilan na zadnji dobar export.
- **Izuzetak:** vježbe ostaju JS moduli (BUG-012) → CRUD ih ne uređuje (ili poseban „code editor" put kasnije).
**Gate:** uredi-spremi-vidi radi end-to-end; export reproducira datoteke bajt-stabilno; RLS testiran (ne-admin ne može pisati); **versioning vraća prošlu verziju; dry-run diff prikazan prije svakog flipa.**

### ▸ FAZA 5 — Produkt WOW: Spaced Repetition (SRS)
**Cilj:** pravi pamet-algoritam učenja — kartice se vraćaju u optimalnim intervalima. Ovo je razlika između „još
jedna flashcard app" i „brutalno". **Zato (nadogradnja #5) ide DIZAJN-DOK PRIJE koda.**
**Ovisnosti:** S2 (per-card podaci) + S3 (AppState) + cloud-sync (scheduling se sinkronizira).
- [5.0] **`docs/SRS_PLAN.md` PRIJE ijedne linije koda:** odabir algoritma (**FSRS — 2024+ state-of-the-art, mjerljivo
  bolji od SM-2; razmotriti ga primarno**, SM-2 kao fallback) · per-card schema · multi-device sync-konflikti
  (isti card ocijenjen na 2 uređaja) · cold-start (novi korisnik) · kako se nosi s 17 predmeta × stotine kartica.
- [5A] Schema: per-card `{ stability, difficulty, dueDate, reps, lapses, lastReview }` (FSRS-stil; lokalno + cloud-sync, kao postojeći napredak).
- [5B] Algoritam kao **reusable modul** (node-testiran brute-force, kao exercises/stat-lib): determinističan, čista funkcija `schedule(card, grade, now) → card'`.
- [5C] UI (iz S4 Web Components): „Review due today" tok preko SVIH predmeta; ocjena (again/hard/good/easy) → reschedule.
- **Reusable preko svih predmeta**; najveći pojedinačni upgrade na razini proizvoda.
*(AI tutor = zaseban produkt-trk, neovisan o source-of-truth; može paralelno nakon jezgre.)*

### ▸ FAZA 6 — Pred-UGC sigurnost
**Cilj:** pripremiti za studentski UGC (3./4. god).
**Ovisnosti:** F4 (CRUD/RLS) + S4 (Web Components umanjuju `innerHTML` rizik).
- [6A] **CSP** header (`vercel.json`) — script/style/font allowlist (cdnjs/jsdelivr/fonts/gtag).
- [6B] **DOMPurify** (ili ekvivalent) prije BILO kojeg `innerHTML` s korisničkim inputom.
- [6C] **RLS hardening** + **moderacija** UGC sadržaja (per-user write, pregled prije objave).
- [6D] UGC randomizirane vježbe = **deklarativni `params`+formula + sigurni sandbox-evaluator** (NE `eval`/klijentski kod — BUG-012 pouka).

---

## 4. Graf ovisnosti (tekstualno)
```
F0 (zapis)
 └─> F1 (CI/CD ─ type-check ─ hardening)        [neovisno, ide odmah]
      └─> F2 (S2 format → S1 Repo → S3 state → S4 components → 2E monitoring)   [JEZGRA]
           ├─> F3 (Service Worker ─ bundling ─ version-bump ─ img ─ a11y)
           ├─> F4 (Admin CRUD: flip → RLS → UI → export)
           │    └─> F6 (CSP ─ DOMPurify ─ moderacija ─ sandbox)   [uz UGC]
           └─> F5 (SRS)   [produkt; paralelno s F3/F4 moguće]
AI tutor: neovisan o svemu gore (ne ovisi o source-of-truth) — bilo kada nakon jezgre.
```

## 5. Rizici i kako ih gasimo
- **🔴 Najveći — migracija formata/flip source-of-truth:** radi se **JEDAN PREDMET ODJEDNOM** uz **dual-read** (loader čita i staro i novo) → nikad „big bang", uvijek reverzibilno.
- **SW vezan uz source-of-truth:** zato SW (F3) tek NAKON ContentRepository (F2) → ne gradi se dvaput.
- **Web Components + CSS:** koristi **light-DOM** (bez Shadow DOM) → globalne teme/varijable ostaju jednostavne.
- **AppState refaktor:** **inkrementalno** (skupina po skupina globala), nikad svih 15 odjednom; može se djelomično odgoditi.
- **Vježbe = kod (BUG-012):** ostaju JS moduli; CRUD ima taj izuzetak — nikad ih ne guraj u bazu/JSON.
- **Type-check zamor:** `tsc` se uvodi **modul-po-modul**, ne globalni strict odmah.
- **Compact:** svaki dovršeni brick → PROGRESS + ovaj doc (status po cigli) → preživi compact.

## 6. Ne-ciljevi / svjesne odgode
- **CMS** (Decap/Directus/Sanity) — **odbačeno**; CRUD = custom (korisnik: „radio bih CRUD normalno"). Sloj S1/S2 ipak ga čini mogućim kasnije ako se predomislimo.
- **Frontend framework** — NE (ostaje vanilla; Web Components su native).
- **Build-step za runtime** — NE (tsc/bundling su dev/CI alati, ne runtime; ostaje statički deploy).
- **CSP/DOMPurify** — tek uz UGC (F6), ne prije (sadržaj je autorski/trustiran).
- **Pune migracije svih starih root `data-*.js`** — kroz F2/F4, ne ad-hoc.

## 7. Razina kvalitete — TVRDI gateovi („brutalan bar", ne „zdrav")
> Korisnik (2026-06-29): „ne zanima me je li plan zdrav nego je li jeben i brutalan." Razlika je **5 nadogradnji** koje
> dižu plan iz solidnog (higijena, 7/10) u elitan (9–10). Sve stanu u postojeće faze; redoslijed se NE mijenja.

| # | Nadogradnja | Gdje | Zašto je to „brutalno" a ne samo „zdravo" |
|---|-------------|------|--------------------------------------------|
| 1 | **Perf/a11y/visual TVRDI gateovi u CI** (Lighthouse budžeti + axe + screenshot) | F1 (1D), pojačano F3 | Prošlost NE MOŽE truniti — stranica ne može postati spora/nepristupačna/vizualno slomljena bez crvenog builda. BUG-015 nemoguć. |
| 2 | **Sentry + release-tracking** | F2 (2E) | Kraj sljepoće — znaš kad i na kojoj verziji kod pukne KOD korisnika, prije nego javi. |
| 3 | **RLS + migracije na pravom Supabase branchu** | F1 (1E) | Sigurnost se DOKAZUJE testom, ne nadom; pred-uvjet za CRUD/UGC bez curenja podataka. |
| 4 | **CRUD versioning + audit-log + dry-run diff** | F4 (4E) | Najopasnija cigla (source-of-truth flip) dobiva undo/povijest/kočnicu → krivi edit nije katastrofa. |
| 5 | **SRS dizajn-dok prije koda + FSRS** | F5 (5.0) | Najveći produkt-WOW dobiva ozbiljan dizajn i 2024+ algoritam, ne nabacani SM-2. |

**Princip TVRDOG gatea:** gate je **blokada, ne upozorenje.** Ako prekršiš budžet/a11y/visual/RLS → CI je crven i ne ide u
`main`. Meki prag (samo ispiše broj) = za godinu dana stranica trune a nitko ne zna kad se to dogodilo. Tvrdi = brutalan.

**Trošak svega gore = 0 € softvera** (Lighthouse CI, axe-core, Playwright, GitHub Actions, Sentry free, Supabase branching — sve besplatno na ovoj skali).

**Svjesno NE radimo (over-engineering za ovu skalu):** frontend framework · runtime build · microservices/Redis/queues ·
zaseban product-analytics (Posthog) dok retencija ne postane pitanje · pune source-mape ako JS ostane čitljiv.

---

## 8. Reference
- **ADR-013** (content arhitektura) + **ADR-014** (engineering standardi) — [DECISIONS.md](DECISIONS.md)
- `sonnet.md` — vanjski hardening-checklist (tretiraj kao prijedloge za PROVJERU, ne istinu; #7 je bio netočan)
- [BUGS.md](BUGS.md) BUG-012 (vježbe nikad u bazu), BUG-004 (cache bump)
- [EXERCISES_ENGINE.md](EXERCISES_ENGINE.md) — uzor reusable podsistema
- [ARCHITECTURE.md](ARCHITECTURE.md) · [BACKEND.md](BACKEND.md) · [VISION.md](VISION.md) · [ROADMAP.md](ROADMAP.md)
- [[foundation-pivot]] (memorija)
