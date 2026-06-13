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
- **Food & Nutrition KOMPLETAN ✅ LIVE (2026-06-10, deployano `05cb0af`):** **1. kolokvij** sadržajno verificiran prema izvorima
  FAN 1–7 (0 činjeničnih grešaka) + **strukturna ispravka:** silabus (FAN Introduction) propisuje K1=Teme 1–7, K2=Teme 8–14,
  a K1 je pogrešno imao **Beer (Tema 8)** → Beer **premješten** u K2 (ključ `beer` isti, napredak očuvan); K1 sad 7 kat. (do Wine).
  **2. kolokvij** = novi `data-food-nutrition-m2.js` (`foodNutritionM2Data`, 7 kat. po temi: beer/distilledSpirits/meat/fish/
  milkDairy/eggs/healthyDiet; FAN 8–14; **71 fc / 84 quiz / 56 fill**). **Finalni** = `data-food-nutrition-final.js`
  (`Object.assign(K1,K2,{examPractice})`, hibrid; učitava se ZADNJI; **15 kat. / 174 fc / 182 quiz / 122 fill**).
  Catalog: 3 lekcije + 3 scripta. Cache `20260621`. Verify 0, strukturni validator 0, Playwright + ciljani render-testovi.
  → **Food & Nutrition 100% KOMPLETAN (K1 + K2 + finalni).**
- **2. god — stanje (2026-06-10):** **sem 2 = 4/4 KOMPLETNO** (Econ Hospitality, Marketing, Geography, Food & Nutrition,
  svi K1+K2+finalni i LIVE). **sem 1 = 4 stara root-predmeta** (te2/Entrepreneurship/Accounting/E-Business) imaju sadržaj
  ali NEMAJU strukturu „2 kolokvija + finalni" — **realno svi imaju 2 kolokvija + završni → trebaju restrukturu na K1/K2/finalni**
  (plan + trenutno stanje po predmetu: `docs/BACKLOG.md`; čeka materijale/silabus). ADR-006 „ne preslagivati stare predmete" je
  za sadržajno upotpunjavanje nadjačan; migracija u bazu i dalje JEDNOM u Bloku B.
- **✅ ACCOUNTING 100% KOMPLETAN ✅ LIVE (2026-06-12, deployano do `a6b6fb0`):** prvi sem-1 predmet restrukturiran + dobio
  interaktivne vježbe. **(a) Study gradivo:** 3 lekcije `first-midterm`/`second-midterm`/`final` (FAZA 4 — novo K1 gradivo
  `data/accounting/midterm-1.js` 6 kat./87fc; K2 realign `midterm-2.js` 8 kat.; finalni hibrid `final.js` 15 kat.).
  **(b) Reusable EXERCISES SUSTAV** (jedini na platformi): engine = `js/exercises-core.js` + `js/acc-kernel.js` +
  `js/exercises.js` + `css/exercises.css` (6 tipova choice/numeric/ratio/statement/classify/journal; 3 moda; randomizacija) —
  **NIKAD se ne mijenja za sadržaj** (sveto pravilo, dokazano kroz B3.1–B3.11); content pack `data/accounting/exercises.js`
  = **41 vježba** (K1 Ch1–6: 16; K2 Ch9–16 + inventory + journal/RE: 25). Plan/recovery: `docs/EXERCISES_ENGINE.md` §6/§8.
  Cache `20260638`. **Poznato (opcionalno, NE blokira):** Final lekcija → „Exercises" tab prazan (sve vježbe tagane na
  kolokvije; dosljedno sem-2 predmetima); USAR/USALI klasifikacija (Ch9-1/10-1) odgođena (nema službenog answer-keya).
- **✅ TOURISM ECONOMICS (`te2`) restrukturiran + REBUILD iz predavanja ✅ LIVE (2026-06-12, 2. sem-1 predmet):**
  sa starog 2-lekcijskog oblika na **K1/K2/finalni**. Sadržaj **PREPISAN IZ 10 PDF PREDAVANJA** (prvi split starog `te2FinalData`
  bio je 72 fc — korisnik javio premalo/staro → rebuild). Nova mapa `data/te2/`: `midterm-1.js` (`te2M1`) + `midterm-2.js` (`te2M2`) +
  `final.js` (`te2Final` = `Object.assign({}, te2M1, te2M2, {examPractice})`, ZADNJI). **Granica iz silabusa** (slajd „Important dates"):
  **K1 = Units 1–6** (fundamentals/demand/**forecasting (nova)**/supply/marketStructure, 61fc), **K2 = Units 7–12** (pricing/expenditure/
  tsa/environment/sustainability, 62fc). Finalni = 10 kat + `examPractice` → **11 kat / 135 fc / 94 quiz / 66 fill**. **Ispravljena
  činjenica:** stari je tvrdio „price NIJE najkritičnija" — slajd kaže suprotno. Stari root `data-te2*.js` obrisani; `lazy-load.spec.js`
  sentinel → `te2M1`. Cache `20260639`. Verify 0/0, node render-sanity 11/11, Playwright 36/36. **Deployano 2026-06-12 (`ca06158`).**
- **▶ BACKEND staza B — IMPLEMENTIRAN lokalno (2026-06-12/13, [[backend-track-b-start]]):** **Auth + cloud sync napretka.**
  Supabase projekt `naxjubnedhrbhsuasayu.supabase.co` (publishable key u `js/auth.js` — javan po dizajnu;
  **service key se NE koristi**, RLS štiti podatke; bez `/api` funkcija za MVP). Novo: `supabase/schema.sql` (tablica `progress`,
  1 red = 1 localStorage ključ, RLS) · `js/auth.js` (CDN supabase-js, tihi fallback ako CDN padne, modal) · `js/cloud-sync.js`
  (offline-first: pull+merge na login — unija/max, naučeno se ne gubi; diff-push 30 s) · `css/auth.css` · `tests/auth.spec.js`.
  **Sadržaj OSTAJE u fajlovima — NE migracija** (staza A / pravi „Blok B", JEDNOM kasnije). Supabase dashboard koraci
  (schema.sql + Auth URL config) **✅ korisnik odradio**; login lokalno testiran — „radi fantastično". **2. dio (isti dan):**
  **Profile stranica** (`#profile-page`, `js/profile.js`, `css/profile.css`; account+sync+progress overview+GDPR delete),
  **auth ulazi posvuda** (`.auth-entry`: landing nav + `.header-auth-btn` na browse/lessons/study; odjavljen→modal,
  prijavljen→Profile), **Google Ads stranice** `privacy.html`/`terms.html`/`faq.html`/`contact.html` (+`css/legal.css`,
  footer Legal linkovi, Terms/Privacy pristanak u modalu). Testovi: `tests/auth.spec.js` + `tests/legal.spec.js`.
  **3. dio (2026-06-13): AUTH = EMAIL+LOZINKA, magic-link UKLONJEN** — modal s tabovima Sign in / Create account
  (`signInWithPassword` / `signUp` + **obavezna email potvrda**; ime → `user_metadata.display_name`, na nav gumbu i profilu),
  Forgot password (`resetPasswordForEmail` → `PASSWORD_RECOVERY` → nova lozinka + repeat polje), profil „Change password"
  (+ repeat); **gumb-oko za prikaz lozinke** na svim password poljima. Pravne stranice ažurirane. Baza nepromijenjena.
  Cache `20260643`. Korisnikov dashboard korak: min duljina lozinke 8.
  **✅ DEPLOY GATE ISPUNJEN — SVE LIVE (2026-06-13, push `ca06158..51e4e7b` uz izričito odobrenje):** auth email+lozinka,
  cloud sync, Profile, pravne stranice + E-Business. `origin/main` sinkroniziran. Detalji: `docs/BACKEND.md` §Staza B.
- **✅ E-BUSINESS restrukturiran + obogaćen ✅ lokalno (2026-06-13, 3. sem-1 predmet):** korisnik dostavio 14 PDF predavanja
  (`…/2. godina Hospitaliy Managament/E-Business`). **Nalaz: stari `data-ebusiness.js` (14 kat/129 fc) BIO vjeran predavanjima**
  (iznimka od te2-pouke; 1 ispravak: SEO ima ČETIRI potkategorije) → **split skriptom** (ključevi kat. + storageKey nedirnuti →
  napredak očuvan) na `data/ebusiness/` `midterm-1.js` (`ebusinessM1`, **K1=Units 1–7**, 6 kat) / `midterm-2.js` (`ebusinessM2`,
  **K2=Units 8–15**, 8 kat) / `final.js` (`ebusinessFinal` hibrid + examPractice, ZADNJI) + **obogaćivanje +23 fc/+5 quiz** iz
  predavanja. **Finalni: 15 kat / 152 fc / 124 quiz / 75 fill.** Catalog 3 lekcije; stari root fajl obrisan; `lazy-load.spec.js`
  sentinel → `ebusinessM1`. `CONTENT_VERSION` `20260644`. `.gitignore` + `tmp-ebiz/`. Verify 0/0, validator OK, Playwright 64/64.
  **✅ LIVE — deployano 2026-06-13 (`51e4e7b`).**
- **✅ ENTREPRENEURSHIP restrukturiran + obogaćen ✅ LIVE (2026-06-13, `8a37404`, 4./4. sem-1 → 2. GODINA 8/8 KOMPLETNA):** korisnik
  dostavio 11 PDF predavanja (`…/Entrepreneurship and Innovation`, Week 2–7 + 9–13; Week 8 = kolokvij). **Nalaz: stari
  `data-entrepreneurship.js` (11 kat/92 fc) TOČAN ali TANAK — 3 tjedna nepokrivena** → **split skriptom** (ključevi kat. +
  storageKey nedirnuti → napredak očuvan) + **4 NOVE kategorije + ~95 fc**: `data/entrepreneurship/` `midterm-1.js`
  (`entrepreneurshipM1`, **K1=Weeks 2–7**, 7 kat: history/psychology/**creativity**/innovation/**financing**/**franchising**/
  planning) / `midterm-2.js` (`entrepreneurshipM2`, **K2=Weeks 9–13**, 7 kat: failure/economy/tourism/social/value/trends/
  **developing**) / `final.js` (`entrepreneurshipFinal` hibrid + examPractice, ZADNJI). **Ispravci:** „linearni proces"
  kartica + W3 kritika; uklonjeni dupli influencer/push-pull iz `tourism`. **Finalni: 15 kat / 175 fc / 134 quiz / 80 fill**
  (najveći predmet). Catalog 3 lekcije; stari root fajl obrisan (`second-exam-prep`/`final-exam-prep` → standardne 3 lekcije).
  `CONTENT_VERSION` `20260645`. `.gitignore` + `tmp-ent/`. Verify 0/0, validator 0, Playwright 64/64. **✅ LIVE — deployano 2026-06-13 (`8a37404`).**
- **✅ GOOGLE ANALYTICS (GA4) + GDPR cookie-consent ✅ LIVE (2026-06-13):** Measurement ID **`G-ME0V58NJ1Z`**. `js/consent.js`
  (Consent Mode v2 default DENIED; cookie banner; **gtag.js učita se TEK na „Accept"**, `anonymize_ip`; izbor u localStorage
  `sokrat-cookie-consent`; `window.openCookieSettings()`) + `css/consent.css` (samostalan dark banner). Consent blok u `<head>`
  svih 5 stranica; „Cookie settings" u footerima; `privacy.html` §5 prepisan (pristanak/Art.6(1)(a)). Cache `?v=20260646`.
  Mijenjati GA ponašanje SAMO u `js/consent.js` (ID je konstanta na vrhu). [[google-analytics-consent]]
- **✅ SPECIAL INTEREST TOURISM (SIT) — NOVI predmet 1. god ✅ LIVE (2026-06-14, `e0e9ca7`, prvi nakon Business Informaticsa):** iz 12 PDF
  predavanja + DINP silabus. `data/sit/` `sitM1` (K1: intro/destination/massToSit/business/cultural/industrial) +
  `sitM2` (K2: nautical/sports/luxury/dark/health/film) + `sitFinal` (hibrid + examPractice). **13 kat / 94 fc / 83 quiz /
  65 fill.** Catalog: novi subject `sit` (year 1, sem 2, `fa-compass`/teal). `CONTENT_VERSION` `20260646`. Verify 0/0, validator 0.
  **⚠️ Nautical slajd slikovni → kat. iz općeg znanja (označena, treba verifikaciju); Event + Outdoor/Wildlife nepokriveni (nema materijala).**
  **✅ LIVE — deployano 2026-06-14 (`e0e9ca7`).** [[content-roadmap-sequencing]]
- **Sadržaj-staza ([[content-roadmap-sequencing]]):** **sem-1 = 4/4 → CIJELA 2. GODINA HM = 8/8 KOMPLETNO.** **1. godina: Business
  Informatics ✅ + SIT ✅.** Dalje: **Management** (tekstualni); Macro/**Statistics — 26 datoteka**/**Micro — 172-str deck**/Math preko KaTeX cigle, Math zadnja, ADR-009.
  **⚠️ Prije masovnog unosa 1. god: razmotriti odgođeni generator-script za uštedu usagea (korisnik: „kombinacije uštede kasnije").**
  **⚠️ POUKA: provjeriti stari sadržaj PROTIV predavanja — rebuild ako je tanak (te2/Entrepreneurship-djelomično), split+obogaćivanje ako je vjeran (E-Business).**
  **⚠️ Korisnik ZASIĆEN računovodstvom — NE vraćati se na Accounting osim izričito.**
- **✅ te2 DEPLOYAN (2026-06-12, `35d8a70..ca06158`):** restruktura + rebuild + Learn — LIVE na sokratstudy.com (cache `20260639`).
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
`CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG` ·
**`EXERCISES_ENGINE`** (reusable sustav vježbi + cigla-po-cigla plan) · **`ACCOUNTING_PLAN`** (analiza izvora + katalog).
