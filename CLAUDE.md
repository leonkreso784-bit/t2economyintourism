# CLAUDE.md — Sokrat Study (ključni kontekst)

> Ovaj fajl se učitava SVAKU sesiju. Drži ga sažetim. Detalji su u `docs/`.
> Svrha: nakon kompaktiranja razgovora ne izgubiti bitne stvari.

## Što je projekt
Interaktivna platforma za učenje (flashcards / quiz / fill / learn). Live: **www.sokratstudy.com**.
Fakultet: **FMTU Opatija**, smjer **Hospitality Management**. Cilj: skalirati na cijeli fakultet
(pa sveučilište), kasnije UGC + natjecanje. Vlasnik/jedini autor: **Leon Kreso**.

## Stack
- Frontend: **statički, vanilla JS, BEZ build-a / frameworka**. Hosting: **Vercel** (git push → auto-deploy).
- Backend (planiran, Blok B): **Vercel serverless funkcije `/api` + Supabase** (Postgres/Auth/Storage). Vidi `docs/BACKEND.md`.

## Arhitektura (najvažnije)
- **`data/catalog.js` = JEDINSTVENI IZVOR ISTINE** za predmete: hijerarhija
  `faculties → programs → (year, semester) → subjects → lessons`.
  Svaki subject ima `content.scripts` (koje datoteke) + `content.resolve` (lessonId → ime window varijable).
- `js/config.js`: `subjectDataMap` i `getSubjectData()` se izvode IZ catalog-a (ne hardkodirano).
- Svi `data-*.js` izlažu svoj objekt na `window` (catalog ih traži po imenu).
- **LAZY LOADING (A4):** `data-*.js` se NE učitavaju u `index.html`. `js/content-loader.js`
  (`loadSubjectContent(subjectId)`) ih učita TEK na otvaranje predmeta (po `content.scripts`).
  `initStudyPage` je `async`. Pri izmjeni `data/*` bumpaj `CONTENT_VERSION` (u content-loader.js).
  Ovo je šav prema backendu (Blok B: `loadSubjectContent` → `fetch('/api/...')`).
- Sidebar predmeta se renderira iz catalog-a (`renderSubjectsSidebar()` u `js/navigation.js`).
- Konvencija semestra: `year` = studijska godina; `semester` ∈ {1,2} unutar godine.

## Sadržaj (autorstvo)
- Schema (obavezno poštovati): `docs/CONTENT_SCHEMA.md` — kategorija ima
  `name, icon, color, flashcards[], quiz[](correct=index), fillBlanks[](_______), learn{content,image}`.
- **Novi predmet = mapa po predmetu, datoteka po lekciji:** `data/<subject>/{midterm-1,midterm-2,final}.js`
  (svaka izlaže `window.<var>`). Template: `data/_template/lesson.template.js`.
- Brzo: `npm run scaffold -- <id> "<Naziv>" <god> <sem>` (kreira datoteke + ispiše catalog unos).
- Stari predmeti (root `data-*.js`) rade preko catalog-a; NE preslagivati ih — migriraju u bazu u Bloku B.
- Profesorski materijali: `_materials/` (gitignored). PDF se NE čita preko Read (pdftoppm nema) →
  koristi **`node scripts/pdf-text.js "<pdf>"`** (ekstrakcija teksta). Vidi `docs/CONTENT_INTAKE.md`.

## ⚠️ KRITIČNA PRAVILA
1. **Cache bump:** pri izmjeni BILO KOJEG `css/*.css` ili `js/*.js`/`data*.js`, bumpaj `?v=` token u
   `index.html` (i `styles.css` @import za CSS). Vercel ima `immutable` cache 1 god → inače deploy
   ostaje NEVIDLJIV (BUG-004).
2. **Deploy samo uz izričitu potvrdu korisnika** (`git push` = produkcijski deploy). Commit lokalno je OK.
3. **Uvijek ažuriraj `docs/`** nakon izmjene (PROGRESS/CHANGELOG/ROADMAP + tematske).
4. **Provjeri prije commita:** `npm run verify` (catalog) + `npm run test:responsive` (Playwright).
5. Radi polako, korak po korak, s provjerama; pazi na bugove.

## Komande
- `npm run verify` — integritet catalog-a (pokreni nakon dodavanja predmeta/sadržaja).
- `npm run test:responsive` — Playwright (iPhone profili): responsive overflow + smoke (sve sekcije × svi predmeti) + sidebar.
- `npm run serve:test` — lokalni server na http://localhost:5050 (za pregled).
- `npm run scaffold -- ...` — kostur novog predmeta.
- `node scripts/pdf-text.js "<pdf>"` — tekst iz PDF-a.

## Stanje (ažuriraj po potrebi)
- **Live:** M0 Blok A gotov (A1 catalog, A2 config-iz-catalog, A3 sidebar-iz-catalog) + Learn responsive/overflow fix.
- **M0.5 ✅ LIVE:** **puni drill-down nav** (`#browse-page`: Fakultet→Smjer→Godina→Predmet,
  100% iz catalog-a; `renderBrowse()`/`initBrowse()` u `js/navigation.js`, `css/browse.css`) + **„čisto i bogato"
  redizajn** browse/landing. Coming-soon data-driven (`isLessonComingSoon`). Test `tests/browse.spec.js`. (A5 ✅, ADR-007 ✅)
- **Landing rebuild ✅ LIVE:** puna „prava stranica" — fixed nav, **subjects showcase iz catalog-a**
  (`renderLandingSubjects()`), How it works, 5 modova, CTA band, strukturiran footer + **SEO meta** popravljen.
  Svi „Start" gumbi = klasa `.start-trigger` → `enterBrowse`. Test `tests/landing.spec.js`.
- **Lazy loading sadržaja (A4) ✅ LIVE:** `js/content-loader.js`; statički `data-*.js`
  maknuti iz `index.html`; sadržaj se učita po predmetu. Test `tests/lazy-load.spec.js`.
- **Vizija:** `docs/VISION.md` (full-stack: AI tutor, UGC, dijeljenje, natjecanje, „donesi ključ" + gating-odluke).
  Temelj svega = **Backend (Blok B: Supabase+Auth+/api)**; Tier 2 (Privacy/FAQ/Contact) = brzi quick-win za Google Ads kad zatreba.
- **Sadržaj:** 8 predmeta 2. godine + **Business Informatics (1. god, sem 1) KOMPLETAN** (K1+K2+Final, pilot uspješan).
- **LIVE (deployano 2026-06-06, commit `822d788`):** sve gore + **cijeli Marketing predmet** + responsive split
  (`css/responsive/01..06`) + KaTeX-plan docovi (ADR-009) + **fixevi BUG-005, BUG-006, BUG-007**.
- **Marketing KOMPLETAN ✅ LIVE:** K1 (T1–T8, `data-marketing.js`) + K2 (T9–T13, `data-marketing-m2.js`)
  + Finalni (`data-marketing-final.js` = `Object.assign(K1,K2,{examPractice})`, hibrid). Catalog: 3 lekcije
  (`first-midterm`/`second-midterm`/`final`). Final = 13 kat. / 113 fc / 66 quiz / 56 fill.
- **Fixevi LIVE:** BUG-006 (learn filter-bar puni nazivi); BUG-007 (filter-bar vidljiv scrollbar + rubni fade,
  `is-scrollable` gazi `center`; `learn.css`/`progress.js`, ResizeObserver). Globalni (svi predmeti).
- **Economics in Hospitality KOMPLETAN ✅ LIVE:** 1. kolokvij (Unit 1–5, `data-econ-hospitality.js`
  rebuild iz izvora 30→73 fc) + 2. kolokvij (Unit 6–10, `data-econ-hospitality-m2.js`, 75 fc s hotelskim KPI-jevima) +
  Finalni (`data-econ-hospitality-final.js` = `Object.assign(m1,m2,{examPractice})`, hibrid; 11 kat. / 162 fc / 106 quiz /
  84 fill). Catalog: 3 lekcije. Cache `20260615`. (S27–S29.)
- **LIVE (deployano 2026-06-09, commit `24f2b6f`):** sve gore + **fix BUG-008** (bazni `.toast`/`.footer` CSS,
  `css/pages.css`, footer skriven na Landing/Browse preko `:has()`) + **Entrepreneurship→sem 1** catalog ispravak
  (id nedirnut → napredak očuvan) + **cijeli Economics in Hospitality** (K1 rebuild + K2 + finalni). `origin/main`
  sinkroniziran, radno stablo čisto. Sve uz `verify` 0 i Playwright **36/36**.
- **Tourism Geography KOMPLETAN ✅ LIVE (S30–S32, deployano 2026-06-10 `a8e7371`):** **1. kolokvij** popravljen/obogaćen iz izvora
  (nalaz: statistike NISU bile pogrešne, falio konceptualni uvod → + kat. `introToGeography` (prez. 1), prepisan
  `croatiaFeatures` (prez. 2+3), dopunjen `protectedAndTouristRegions` (prez. 4–6); **slijepa karta + examFramework
  NETAKNUTI**; 6 kat. / 58 fc). **2. kolokvij** „Tourism Geography of the World" = novi `data-geography-m2.js`
  (`geographyM2Data`, 6 kat. po kontinentu: globalIntro/europe/asia/africa/australiaOceania/americas; prez. 7–12;
  56 fc / 45 quiz / 33 fill). **Finalni (S32)** = `data-geography-final.js` (`Object.assign(K1,K2,{examPractice})`, hibrid;
  učitava se ZADNJI; **13 kat. / 128 fc / 127 quiz / 84 fill**). Catalog: 3 lekcije + 3 scripta. Cache `20260618`.
  Verify 0, strukturni validator 0, Playwright 36/36. **LIVE — deployano 2026-06-10 (`a8e7371`):** geo K1 `09eb48d` +
  K2 `8efeaf3` + doc fix `b858440` + finalni `a8e7371`. `origin/main` sinkroniziran, radno stablo čisto.
- **Food & Nutrition KOMPLETAN ✅ (2026-06-10, lokalno — čeka deploy):** **1. kolokvij** sadržajno verificiran prema izvorima
  FAN 1–7 (0 činjeničnih grešaka) + **strukturna ispravka:** silabus (FAN Introduction) propisuje K1=Teme 1–7, K2=Teme 8–14,
  a K1 je pogrešno imao **Beer (Tema 8)** → Beer **premješten** u K2 (ključ `beer` isti, napredak očuvan); K1 sad 7 kat. (do Wine).
  **2. kolokvij** = novi `data-food-nutrition-m2.js` (`foodNutritionM2Data`, 7 kat. po temi: beer/distilledSpirits/meat/fish/
  milkDairy/eggs/healthyDiet; FAN 8–14; **71 fc / 84 quiz / 56 fill**). Catalog: 2 lekcije + 2 scripta. Cache `20260620`.
  Verify 0, strukturni validator 0, Playwright 36/36 + ciljani K2 render. (Opcija kasnije: finalni hibrid.)
- **▶ SLJEDEĆE (plan, [[content-roadmap-sequencing]]):** (1) **2. god SADRŽAJNO KOMPLETNA** (svih 9 predmeta K1+K2/finalni);
  opcija: finalni hibridi gdje fale (Food & Nutrition). (2) **pa 1. godina** (najbrži tekstualni: Management/Macroeconomics/SIT;
  Business Informatics već gotov). (3) **pa drugi smjerovi** (1.+2. god, novi `programs`). → kasnije **Blok B** (Supabase+Auth+/api).
- **Šira odluka (2026-06-05):** sadržaj-prvo (1.+2. god) PA **Blok B** (migracija JEDNOM). Kvantitativni
  (Math/Micro/Macro/Stat) preko **KaTeX** (ADR-009), Math zadnja. Materijali 1. god: Math/Macro/Mgmt/SIT imaju; Stat/Acad-writing/Intro-hosp/Traffic PRAZNO.

## Ključne odluke (detalji: `docs/DECISIONS.md`)
- ADR-001/008: backend = Vercel Functions + Supabase (Railway samo kasnije za AI worker).
- ADR-006: autorstvo u datotekama sad (migracijski sigurno); migracija u bazu jednom u Bloku B.
- ADR-007: navigacija = puni drill-down (eksplicitni Fakultet→Smjer→Godina→Predmet). **Implementirano** (`#browse-page`).
- ADR-009: kvantitativni predmeti (Math/Micro/Macro/Statistika) = **KaTeX** (LaTeX `$...$`) + „worked problems" na
  postojećim modovima + grafovi-kao-slike. KaTeX = cigla PRIJE prvog takvog predmeta; **Math zadnja**. (plan)
- Logo se NE mijenja. Vizualni stil: **„čisto i bogato" (clean & rich, Brilliant/Quizlet-feel), dark** — NE preminimalistički.

## Dokumentacija (`docs/`)
`README` (index) · `PRD` · `VISION` (dugoročna full-stack vizija + gating-odluke) · `ARCHITECTURE` ·
`BACKEND` · `ROADMAP` · `CONTENT_SCHEMA` · `CONTENT_GUIDE` · `CONTENT_INTAKE` · `TESTING` ·
`CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG`.
