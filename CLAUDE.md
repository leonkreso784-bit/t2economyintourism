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
1. **Cache bump:** pri izmjeni BILO KOJEG `css/*.css`/`js/*.js`/`data*.js` pokreni **`npm run bump`**
   (F3 3C.1) — postavi SVE `?v=` tokene + `CONTENT_VERSION` na isti novi timestamp ODJEDNOM (kraj ručnog
   bumpanja po fajlu). `npm run bump:check` = CI gate (svi identični, drift = crveno). Vercel ima `immutable`
   cache 1 god → bez bumpa deploy je NEVIDLJIV (BUG-004; ADR-017). *(Dok F3 nije mergean u main, alat je na grani `foundation/f3`.)*
2. **Deploy samo uz izričitu potvrdu korisnika** (`git push` = produkcijski deploy). Commit lokalno je OK.
3. **Uvijek ažuriraj `docs/`** nakon izmjene (PROGRESS/CHANGELOG/ROADMAP + tematske).
4. **Provjeri prije commita:** `npm run verify` (catalog) + `npm run test:responsive` (Playwright).
5. Radi polako, korak po korak, s provjerama; pazi na bugove.
6. **PRIJE SVAKOG COMPACTA (korisnikovo pravilo, 2026-06-24):** kad korisnik kaže da je potreban compact,
   Claude MORA proći **APSOLUTNO SVE `.md` datoteke** (root + `docs/` + memorija) i provjeriti da svaka točno
   i dobro piše (status, brojevi, ADR-ovi, linkovi) — ispraviti zastarjelo PRIJE compacta. Audit-obrazac: vidi
   sesiju 2026-06-23/24 (provjeri svaku, popravi netočno, commit). [[doc-audit-before-compact]]

## Komande
- `npm run verify` — integritet catalog-a (pokreni nakon dodavanja predmeta/sadržaja).
- **`npm run bump`** — F3 3C.1: postavi SVE `?v=` tokene + `CONTENT_VERSION` na isti novi timestamp (zamjena ručnog bumpanja). `npm run bump:check` = CI gate (drift=crveno).
- **`npm run build:css`** — F3 3B: regeneriraj `styles.bundle.css` iz `css/*.css` (nakon SVAKE izmjene bilo kojeg css modula). `npm run build:css -- --check` = CI drift-gate.
- `npm run test:responsive` — Playwright (iPhone profili): responsive overflow + smoke (sve sekcije × svi predmeti) + sidebar.
- `npm run serve:test` — lokalni server na http://localhost:5050 (za pregled).
- `npm run scaffold -- ...` — kostur novog predmeta.
- `node scripts/pdf-text.js "<pdf>"` — tekst iz PDF-a.
- `npm run validate:content [subjectId]` — sadržajni validator (shema + quiz indeks + KaTeX currency-safe).
- `npm run validate:schema [subjectId]` — STRUKTURNI JSON Schema gate (`schema/subject-content.schema.json`, ajv).
- `npm run export:json [subjectId] [--check]` — export study sadržaja u `data/json/<id>/<var>.json` (F2 2A).
  **⚠️ PRAVILO: nakon izmjene `data/*.js` migriranog predmeta (17/18, svi osim accountinga) OBAVEZNO
  `npm run export:json <id>` — inače CI pada na drift-gateu (`--check`).** Vježbe se NE exportaju (BUG-012).
- **GENERATOR predmeta** (jeftin Sonnet preko `.env` ključa; detalji `docs/CONTENT_GENERATOR.md`):
  `node scripts/build-topics.js <id> "<dir>"` → `node scripts/generate-subject.js <id> [--math]` →
  `node scripts/assemble-subject.js <id> --name ... --short ... --icon ... --color ...` → paste catalog + bump + gate.

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
- **✅ MANAGEMENT — NOVI predmet 1. god ✅ LIVE (2026-06-14, deployano `6e88030..06c96a8`, 3. predmet 1. god, ZADNJI čisto tekstualni):** iz 11 PDF
  predavanja (**Lussier *Management Fundamentals* 9e**; INTRO + TU2–TU11). `data/management/` `managementM1` (K1 = Part I–III:
  foundations/decisionMaking/strategicPlanning/organizing/teamwork/humanResources) + `managementM2` (K2 = Part IV–V:
  organizationalBehavior/motivation/leadership/controlSystems) + `managementFinal` (hibrid + examPractice). **11 kat / 89 fc /
  84 quiz / 55 fill.** Catalog: novi subject `management` (year 1, sem 2, `fa-user-tie`/indigo `#6366f1`). **K1/K2 granica iz
  strukture udžbenika** (5 dijelova; rez Organizing↔Leading). Teme 2/3/6/13/15 nemaju zaseban deck → neobrađene. `CONTENT_VERSION`
  `20260647` + `.gitignore` `tmp-mgmt/`. Verify 0/0, node sanity 0, Playwright 64/64 (`subjects=11`). **✅ LIVE — deployano 2026-06-14
  (`06c96a8`).** [[content-roadmap-sequencing]]
- **✅ KaTeX CIGLA (ADR-009) — ✅ LIVE (deployano 2026-06-14, `236e303`):** infrastruktura za kvantitativne predmete PRIJE Microeconomicsa.
  `js/math.js` = jedan helper **`renderMath(container)`** (KaTeX auto-render; **tihi no-op ako CDN padne**) + KaTeX CDN **`0.16.9`**
  (cdnjs, `defer`; `0.16.11` ne postoji → bio 404) u `<head>` + `css/math.css` (dark + `.katex-display{overflow-x:auto}` za mobilni
  overflow). `renderMath` zvan na kraju **sva 4 renderera** (learn/flashcards/quiz/fill). **⚠️ Delimiteri CURRENCY-SAFE: inline `\( \)`,
  blok `\[ \]`/`$$ $$`; jedan `$` se NE koristi** — postojećih **123 valutnih `$NN`** bi inače KaTeX pokvario; `\(`/`\[`/`$$` se ne
  pojavljuju u tekstu (grep) → render globalan ali za tekst no-op. Cache `?v=20260648` (math.js + 4 renderera + styles.css + math.css);
  **`CONTENT_VERSION` ostaje `20260647`** (data nedirana). Verify 0/0, `tests/katex.spec.js` 4/4 (render + currency-safety). Konvencija:
  `docs/CONTENT_SCHEMA.md` §Matematika. **Dalje: Microeconomics (1. god) = prvi kvantitativni, K1/K2/finalni, RUČNO.** [[content-roadmap-sequencing]]
- **✅ MICROECONOMICS 100% KOMPLETAN (K1 + K2 + finalni hibrid) — prvi kvantitativni predmet, KaTeX, ✅ LIVE (deployano 2026-06-14, `236e303`):** intake
  `Microeconomics_2024_25.pdf` (172-str Pindyck&Rubinfeld) + **DINP silabus** → **K1/K2 granica AUTORITATIVNA iz službenog
  rasporeda: K1 = Ch 1–7, K2 = Ch 8,9,10,12,13,14,18** (TU→poglavlje mapiranje provjereno iz decka: TU7=Ch8 … TU13=Ch18).
  **K1** `data/microeconomics/midterm-1.js` (`microeconomicsM1`) — 7 kat / 77fc / 66quiz / 54fill. **K2** `midterm-2.js`
  (`microeconomicsM2`) — **7 kat / 75fc / 70quiz / 56fill**: profitMaximization, competitiveMarkets, monopolyMonopsony,
  monopolisticOligopoly, gameTheory, factorMarkets, externalitiesPublicGoods (KaTeX learn + 6 riješenih primjera: P=MC,
  CS=1800, monopol Q=40/P=60, payoff-matrica, MRP=50, MSC=14). **Finalni** `final.js` (`microeconomicsFinal` =
  `Object.assign(M1,M2,{examPractice})`, ZADNJI) → **15 kat / 164fc / 148quiz / 118fill**; `examPractice` = cross-topic
  „optimiziraj na margini" sinteza (KaTeX `aligned` master-popis: MR=MC, MRS=Px/Py, MRTS=w/r, MRP=w, MSC=MSB) + roadmap.
  Catalog: subject `microeconomics` (year 1, **sem 1**, `fa-chart-line`/sky `#0ea5e9`), **sve 3 lekcije mapirane** (scripts:
  midterm-1/2/final, final ZADNJI). **KaTeX currency-safe** (kombinirano `\\(\\)` 509/509 + `\\[\\]` 71/71 balansirano;
  0 single-`$` u K2/final — delimiter je `$$` ne `$`). Cache `20260649` (batch 20260648→49). verify 0/0, node struktura 0,
  **Playwright 68/68** (`microeconomics ✓ ok`, 0 overflowa). **Dalje: Statistics ili Macro (oba kvant., KaTeX spreman); Math ZADNJA.** [[content-roadmap-sequencing]]
- **✅ STATISTICS 100% KOMPLETAN + NADOGRAĐEN ✅ LIVE (study deployano 2026-06-16 `d97ee0b`; drugi kvantitativni predmet, KaTeX):** iz 26
  datoteka (Newbold *Statistics for Business & Economics*; topic deckovi T1–T9 + answer-keyevi). **K1/K2 granica AUTORITATIVNA iz službenih
  midterm-materijala: K1 = T1–T6, K2 = T7–T9.** **K1** `data/statistics/midterm-1.js` (`statisticsM1`) — 6 kat / 61fc / 60quiz / 48fill
  (describing data graphical & numerical, probability, discrete & continuous RV, sampling distributions/CLT). **K2** `midterm-2.js`
  (`statisticsM2`) — 3 kat / 35fc / 30quiz / 24fill (confidence intervals, hypothesis testing, regression). **Finalni** `final.js`
  (`statisticsFinal` = `Object.assign(M1,M2,{examPractice})`, ZADNJI) → **10 kat / 108fc / 102quiz / 80fill**; examPractice = cross-topic
  luk + KaTeX `aligned` master-popis. Catalog: subject `statistics` (year 1, **sem 1 — POTVRĐENO (korisnik)**;
  `fa-chart-simple`/rose `#f43f5e`), sve 3 lekcije mapirane. KaTeX currency-safe (`\\(\\)` 540/540 + `\\[\\]` 45/45). Cache `20260650`.
  verify 0/0, node 0, **Playwright 68/68** (subjects=13).
- **✅ STATISTICS NADOGRADNJA (Track A + B) ✅ LIVE (deployano 2026-06-16 `d97ee0b`):** plan `docs/STATISTICS_PLAN.md`, cigla-po-cigla.
  **Track A:** svih 10 Learn sekcija obogaćeno pravom teorijom (def/intuicija/interpretacija/zamke + warning-boxovi). **Track B:** **56
  interaktivnih vježbi** na POSTOJEĆEM reusable enginu (NEDIRNUT) — 35 first-midterm (T1–T6) + 21 second-midterm (T7–T9). Statistika 100%
  u `data/`: `data/statistics/exercises.js` (`window.statisticsExercises`) + `data/statistics/stat-lib.js` (`window.StatLib`: normalCdf/
  normalSf/normalBetween, z/t tablice, combinations), oba lazy preko `content.scripts` (stat-lib PRIJE exercises). **0 novih datoteka u
  `js/`.** Tipovi choice/numeric/ratio + randomizacija (`params`+`generate`; objektni `choices` rade s pickParams). Tol-politika:
  vjerojatnosti 2dp/0.01, deskriptivni 1–2dp/0.05, cijeli 0. Verify-obrazac svake cigle = node brute-force (neovisni preračun +
  grade-correct + diskriminacija kroz cijeli prostor params) + z/t-tablica cross-check; **bug ulovljen B2.6 (α/2 float-zanos 0.0499…→
  promašaj t-tablica ključa → eksplicitna mapa conf→area).** Final lekcija → Exercises prazan (tagano na kolokvije; dosljedno sem-2).
  Cache `20260664`. verify 0/0, test:unit 33/33 (+stat-parse+stat-lib), Playwright 68/68. **Dalje: Macroeconomics (~19); Math ZADNJA.** [[content-roadmap-sequencing]] [[statistics-exercises-plan]]
- **✅ MACROECONOMICS Track B vježbe B1–B12 100% KOMPLETNO ✅ LIVE (B1–B10 deployano 2026-06-18 `58cc37c`; B11+B12 deployano 2026-06-22 `28fcb7e`):**
  ~81 vježbi na NEDIRNUTOM enginu, first-midterm B1–B6 (41) + second-midterm B7–B12. **B11** open-economy goods (`1/(1−β(1−t)+m)`, NX) ·
  **B12** balance of payments (travel balance, CA, `K=f(r)`). Svaka node brute-force verificirana (0 problema), cache `20260679`. [[macroeconomics-exercises-plan]]
- **▶ GENERATOR PREDMETA (jezgra bricks 1–4 GOTOVA, 2026-06-22, ✅ LIVE — pushano s AW pilotom do `569e608`):** odluka korisnika — dosta ručnog dodavanja →
  generator uz minimalan usage, PA Blok B. `scripts/`: `validate-content.js` (`npm run validate:content`) + `build-topics.js` (PDF/TXT→topics.json) +
  `generate-subject.js` (**Sonnet preko `.env ANTHROPIC_API_KEY`**, korisnikov ključ; max_tokens 16000/temp 0.3) + `assemble-subject.js` (draft→
  `data/<id>/*.js` preko JSON.stringify=escaping bajt-točan, ISPISUje catalog unos, NE dira catalog.js). Tok + detalji `docs/CONTENT_GENERATOR.md`.
  Gate = validate:content→verify→Playwright→Opus spot-check. [[content-generator-pipeline]]
- **✅ PRVI GENERATOR-PILOT: ACADEMIC WRITING (1. god, sem 1) — KOMPLETAN ✅ LIVE (2026-06-23, `48f38da`+`c34d88a`+`73bca5e`, pushano do `569e608`):**
  13 PDF predavanja (prof. Bogdan, *Essentials of Academic Writing*) → 12 tema kroz cijeli pipeline. **Study:** K1 (tjedni 1–6:
  fundamentals/lit-review/research-methods/thesis-structure/databases) + K2 (8–14: types-of-publications, **Chicago Manual of Style** books/
  journals/other, research-qualities, ethics & Latin; kolokvij tjedan 7) + finalni hibrid → **24 kat / 336 fc / 286 quiz / 240 fill**.
  **FAZA 2 — citation EXERCISES:** `data/academic-writing/exercises.js` (`academicWritingExercises`), **15 vježbi / 86 items** na NEDIRNUTOM
  enginu (korisnik tražio: Chicago „jako puno na testu"); tipovi `choice`(mc/tf)+`classify` (t/R/n/B, latinske kratice, primary/sec/tertiary).
  Cache `20260681`. Gate: validate 0/0, verify 0/0, test:unit 33/33, **Playwright 68/68 (subjects=15)**, iPhone-SE 0 overflow, Chicago spot-check točan.
  **FAZA 3 — novi reusable tip `cite` (`ada5b99`, cache `20260682`):** „napiši citat" slobodnim tekstom → `normalizeCite()`+`gradeCite()` (engine
  EKSTENZIJA, ne hack: novi grader+widget+CSS, 0 promjena postojećih tipova; core 104/104). Pametno-tolerantno (case/razmaci/navodnici/crtica/
  završna točka forgiven, interpunkcija+redoslijed bitni); pokaže točan odgovor. 2 cite-vježbe (7 items, autorski iz slajdova). Sad **7 tipova** vježbi.
- **✅ TRAFFIC IN TOURISM — NOVI predmet (1. god, sem 2) — ručno iz predavanja ✅ LIVE (deployano 2026-06-25, `62a4119`; Supabase re-sync 3/3):** 13 PDF-ova (prof. Nataša
  Kovačić; udžbenik Mrnjavac, *Promet u turizmu*) + EU izvori. **Ručno (NE generator)** — činjenično specifičan, ima rupe/izvještaje. Plan `docs/TRAFFIC_PLAN.md`.
  K1/K2 granica **autoritativna iz silabusa (DINP): 1. kolokvij = tjedan 7 → K1 = tjedni 1–6, K2 = tjedni 7–15.** `data/traffic/` `trafficM1` (6 kat:
  theoreticalBasis/interdependence/mobilityPatterns/road-connector/road-product/rail-connector) + `trafficM2` (7 kat: rail-product+funicular/air/water/
  value&quality/safety/ecology/future) + `trafficFinal` (hibrid + examPractice). **27 kat / 189 fc / 186 quiz / 188 fill.** **Master-obrazac:** svaki mod =
  CONNECTOR + TOURISM PRODUCT. **8 nastavnih deckova** (INTRO.pdf = administrativan → tjedni 1–2 + value&quality autorski iz silabusa); **4 EU izvještaja**
  (CO2/road-safety/climate/figures) = izvor činjenica za safety+ecology, NE zasebne teme. Kvalitativan → bez KaTeX/Exercises (korisnik). Catalog `traffic`
  (`fa-route`/amber `#f59e0b`). Cache `20260685` (+ catalog.js/content-loader.js `?v=`). `.gitignore` + `tmp-traffic/`. Gate: validate 0/0, verify 0/0,
  **Playwright 68/68 (subjects=16)**. **✅ DEPLOYANO + Supabase re-sync (3/3).** [[content-roadmap-sequencing]]
- **✅ MATHEMATICS — NOVI predmet (1. god, sem 1) — KaTeX — K1+K2+Final ✅ LIVE (deployano 2026-06-27, `89fd669..31be03f`; commiti `b481be5`+`c49422a`+`4eeccf1`):** zadnji 1.god predmet → **1. GODINA 9/9 (uz Intro blokiran).**
  Materijali `…/1. godina Hospitality Managament/Math` (deckovi 1–6,8,9,11 + 4 prezentacije-lekcije). **K1 = teme 1–5, K2 = teme 6–11** (granica iz silabusa).
  `data/math/` `mathM1` (5 kat: realNumbers/basicEquations/functions/differentiation/extrema) + `mathM2` (4 kat: integralElasticity/annuities/loans/gaussJordan) +
  `mathFinal` (hibrid+examPractice). **Final 10 kat / 79 fc / 79 quiz / 64 fill.** **`exercises.js` 39 vježbi (26 K1+13 K2) + `math-lib.js`** (28 randomiziranih
  brute-force, 72.173 checka 0 problema; financijske formule točne do centa vs slajdovi). Catalog `math` (`fa-square-root-variable`/violet `#8b5cf6`), sve 3 lekcije
  + `features.exercises:true`. Cache `20260689`. **⚙️ ENGINE PROMJENA: js/exercises.js dobio 4 čuvana `renderMath()` poziva → exercises sad renderiraju KaTeX**
  (currency-safe, no-op za tekstualne; Statistics/Accounting verificirano netaknuti; aditivno 0 promjena tipova).
  **✅ POST-COMPACT (2026-06-27, `4eeccf1`): (a) K1 learn obogaćen — svih 5 sekcija prepisano na K2 dubinu (realNumbers 4798/basicEquations 3907/functions 4197/
  differentiation 3520/extrema 3184 zn; intuicija+radni primjeri+interpretacija+zamke); (b) Gauss vs Gauss-Jordan nijansa dodana u `gaussJordan` (+2 fc/+3 quiz/+3 fill +
  learn-podsekcija: Gauss=gornji trokut+supstitucija unatrag vs Gauss-Jordan=puna jedinična; pravilo „samo redovi, nikad stupci"; naziv kat. → „Gauss & Gauss-Jordan Method").**
  Gate (oba puta): KaTeX runtime balans OK (m1 562/562+47/47, m2 202/202+36/36, final 814/814+91/91), validate 0/0, verify 0/0, test:unit 33/33,
  Playwright 68/68 (subjects=17). **Korisnik pregledao formule („sve izgleda odlično") → ✅ DEPLOYANO 2026-06-27.** ✅ Supabase re-sync Math (read-path) **NAPRAVLJEN 2026-06-27** (3 reda `mathM1/M2/Final`; vježbe iz datoteke). Plan `docs/MATH_PLAN.md`. [[content-roadmap-sequencing]] [[learn-sections-must-be-rich]]
- **✅ BUG-012 (randomizirane vježbe se lome iz baze) RIJEŠEN ✅ LIVE 2026-06-27 (`7176194..801d9a6`):** vježbe sadrže `generate()`
  funkcije koje `JSON.stringify` izbriše → iz baze su bile razbijene (Statistics 23 / Macro 25 / Accounting 8 randomiziranih). Fix (Opcija A,
  cigla-po-cigla): catalog **`content.codeScripts`** (vježbe+lib = KOD, uvijek iz datoteke) + `content-loader.js` u DB-modu učita codeScripts
  iz fajla (`filesToLoad = fromDb ? codeScripts : scripts`) + `migrate-content.js` više ne šalje vježbe + `verify-catalog.js` čuvar
  (predmet s vježbama MORA imati codeScripts) + baza očišćena (4 reda vježbi) + Math gradivo migrirano. **Baza: 51 red / 17 predmeta /
  0 redova vježbi.** Cache `20260690`. **PRAVILO: read-path iz baze nosi SAMO čisto-podatkovne varove (M1/M2/Final); vježbe (kod) UVIJEK iz
  datoteke.** Detalji `docs/BUGS.md` §BUG-012 + `docs/EXERCISES_DB_FIX_PLAN.md`. [[backend-track-b-start]]
- **✅ BLOK B — read-path SADRŽAJ IZ SUPABASEA, ✅ LIVE (2026-06-23, `077d375`+`8a087ad`, pushano do `569e608`):** sadržaj se čita iz
  baze **direktno anon keyem** (javan; bez `/api`/service-keya na frontu), **fallback na datoteke** (offline-first). Tablica
  `public.subject_content` (1 red=1 window var, `jsonb`) + public-read RLS (`supabase/schema.sql`). Migracija `node scripts/migrate-content.js`
  (vm-shim → REST upsert; inicijalno 49/15, **sad 51 redova / 17 predmeta / 0 redova vježbi** nakon BUG-012 fixa). `js/content-loader.js`: flag `CONTENT_FROM_SUPABASE=true` + `_loadSubjectFromSupabase()`.
  **Datoteke ostaju IZVOR ISTINE** — baza je zrcalo (re-sync skriptom nakon izmjene predmeta). Cache `20260684`. Gate: anon REST 49/49 +
  Playwright 68/68 (sadržaj iz baze). **⚠️ free tier uspava projekt ~7 dana neaktivnosti → restore BESPLATAN; uspavan = sadržaj iz datoteka (fallback),
  login/sync ne rade dok ne restoreaš.** `service_role` key SAMO u `.env` (gitignored). [[backend-track-b-start]]
  **⚠️ PILOT OTKRIO+POPRAVIO 5 generator-bugova** (`48f38da`): navodnici→nevaljan JSON → **`tool_use` structured output** (API jamči objekt);
  `learn` kao string → `coerce`; `learn` prazan → **retry do 3×**; Windows libuv teardown → clean `process.exit`; hyphen-ključevi u catalog-ispisu citirani.
  **💰 trošak ≈ $2.27** (skoro sve debug-re-runovi; budući predmet ~$1–1.5). [[content-generator-pipeline]] [[generator-api-cost]]
- **🐛 FIX potvrda emaila (2026-06-14, dashboard-only):** klik na Supabase „Confirm email address" otvarao `…supabase.co` s
  `{"error":"requested path is invalid"}`. NIJE kod (`js/auth.js` šalje `emailRedirectTo` ispravno) — Supabase **Redirect URLs**
  pokrivali samo localhost. Popravak: Auth → URL Configuration → Site URL `https://www.sokratstudy.com` + Redirect URLs sa `/**`:
  `https://www.sokratstudy.com/**`, `https://sokratstudy.com/**`, `http://localhost:5050/**`. Doc `docs/BACKEND.md` (`06c96a8`). [[backend-track-b-start]]
- **Sadržaj-staza ([[content-roadmap-sequencing]]):** **2. GODINA HM = 8/8 KOMPLETNO.** **✅ 1. GODINA HM = 9/9 KOMPLETNO i LIVE** (Business
  Informatics, SIT, Management, Microeconomics, Statistics, Macroeconomics, Academic Writing, Traffic in Tourism, **Math** — zadnji, deployan 2026-06-27).
  **⛔ Intro to Hospitality = BLOKIRAN** (nema PDF-ova). Math je bio ZADNJI 1.god predmet → sadržajna staza 1.+2. god **GOTOVA**.
  **⚠️ Prije masovnog unosa novog programa: razmotriti generator-script za uštedu usagea (korisnik: „kombinacije uštede kasnije").**
  **⚠️ POUKA: provjeriti stari sadržaj PROTIV predavanja — rebuild ako je tanak (te2/Entrepreneurship-djelomično), split+obogaćivanje ako je vjeran (E-Business).**
  **⚠️ Korisnik ZASIĆEN računovodstvom — NE vraćati se na Accounting osim izričito.**
- **✅ te2 DEPLOYAN (2026-06-12, `35d8a70..ca06158`):** restruktura + rebuild + Learn — LIVE na sokratstudy.com (cache `20260639`).
- **Šira odluka (2026-06-05):** sadržaj-prvo (1.+2. god) PA **Blok B** (read-path ✅ aktivan; admin CRUD kasnije). Kvantitativni
  (Math/Micro/Macro/Stat) preko **KaTeX** (ADR-009, gotov), Math zadnja.
- **🧱 STRATEŠKI ZAOKRET — PLATFORMA-FIRST (korisnik 2026-06-29; GLAVNI AKTIVNI SMJER; detalji `docs/FOUNDATION_PLAN.md`):**
  Sadržaj (HRV long-tail, prijevodi, 3. god) **PAUZIRAN** dok se ne izgradi profesionalan, reliable, reusable temelj.
  Princip: **malo→veliko, jedno po jedno, svaka cigla testabilna/reverzibilna/reusable** (uzor = exercises engine).
  **Faze (redom):** F0 zapis ✅ → **F1 reliability rails** (CI/CD GitHub Actions + Vercel preview · type-check JSDoc+`tsc` bez build-a ·
  hardening v1 iz `sonnet.md`) → **F2 reusable jezgra** (S2 čisti JSON format ⟂ vježbe=JS moduli → S1 ContentRepository šav →
  S3 AppState → S4 UI-primitivi=Web Components → error monitoring) → **F3 performanse** (Service Worker=pravi offline + CSS bundling +
  auto version-bump) → **F4 custom Admin CRUD** (source-of-truth flip: baza autoritativna, datoteke=export; dual-read, predmet-po-predmet) →
  **F5 SRS** (spaced repetition) → **F6 pred-UGC sigurnost** (CSP/DOMPurify/RLS/sandbox). **ADR-013** (content arhitektura) + **ADR-014**
  (engineering standardi). Vježbe NIKAD u bazu (BUG-012). CRUD=custom, NE CMS. **Plan PODIGNUT na „brutalan" (5 nadogradnji, FOUNDATION_PLAN §7):**
  perf/a11y/visual TVRDI CI gateovi · Sentry+release-tracking · RLS-test · CRUD versioning/audit/dry-run · SRS dizajn-dok+FSRS. [[foundation-pivot]]
- **✅ FAZA 1 (reliability rails) GOTOVA + GITHUB-ZELENA + ✅ DEPLOYANA NA PRODUKCIJU (2026-06-30, `c874627..69ce466` ff-merge grana→main uz izričito odobrenje; live potvrđeno: `landing-stats.js`=5700, tokeni `?v=20260698`):** **1A** CI/CD
  (`.github/workflows/ci.yml`: npm ci→validate→verify→test:unit→typecheck→**RLS**→Playwright; + zaseban `lighthouse` job) · **1B** type-check
  bez build-a (`tsconfig.json` strict scoped + `types/globals.d.ts` + pilot `js/i18n.js`; `npm run typecheck`) · **1C** hardening (vercel.json headeri;
  `loadProgress` schema-merge u storage.js; mrtav `lessonCategoryMap`→`{}`; „400+"→dinamičan `scripts/compute-stats.js`→`data/landing-stats.js`=5700+;
  „Works offline"→„No install needed") · **1D** TVRDI gateovi (`tests/a11y.spec.js` axe 0-serious — popravljen sidebar `tabindex`; `tests/layout-guard.spec.js`
  deterministički sweep 13šir×{EN,HR}=BUG-015 zaštita; **Lighthouse** kalibriran na CI-brojeve a11y98/bp100/seo100/perf66 → tvrdi a11y/bp/seo≥0.95+CLS≤0.1+TBT≤400ms,
  perf≥0.5 floor dok F3 ne digne; pixel-screenshot ODGOĐEN—treba Linux baseline) · **1E** `scripts/rls-check.js` read-only RLS (anon čita content, 0 progress; skip-ako-uspavana;
  branching traži Pro $25/mj→odbačeno). **package-lock.json sad VERZIONIRAN** (bio gitignored→`npm ci` pao). **✅ DEPLOYANO 2026-06-30** (i18n chrome `25c2474` otišao zajedno; main=origin/main=`69ce466`). [[foundation-pivot]]
- **▶ FAZA 2 (reusable jezgra) — 2B+2E ✅ DEPLOYANO NA PRODUKCIJU (2026-07-01, `164dc11..57f449a` ff-merge grana `foundation/f2`→main uz odobrenje; CI zelen; live potvrđeno):**
  **Revidirani redoslijed (dogovoreno, utemeljeno u kodu):** S1 Repo PRIJE S2 JSON + Sentry ranije (F3 ovisi o S1 ne o S2; S1=0-rizik šav prije diranja podataka; Sentry=vidljivost prije rizične migracije).
  **✅ 2B.1 ContentRepository (S1):** `js/content-repo.js` → `window.SokratContent` (`listSubjects/getSubject/isLessonComingSoon/loadLesson/isLoaded`) — tanki omotač oko 3 razbacana puta
  (catalog metapodaci + `loadSubjectContent` + `getSubjectData`), NULA promjene ponašanja (DB↔datoteka fallback ostaje u loaderu). **✅ 2B.3:** `navigation.js:initStudyPage` → `await SokratContent.loadLesson(...)`
  (fallback na stari dvokorak). Test `tests/content-repo.spec.js` (ekvivalencija: `loadLesson` vraća IDENTIČNU referencu). **✅ 2E Sentry monitoring:** `js/monitoring.js` → `window.SokratMonitor`
  (`captureException/enable/disable/status`); globalni `error`+`unhandledrejection` hvatači; **consent-gated** (`consent.js applyConsent`→`enable/disable`, isti gate kao GA); **Loader Script** `js-de.sentry-cdn.com`
  (EU/DE regija, ključ javan kao GA ID; nema fiksne verzije→nema 404); `sendDefaultPii:false`; release `sokrat-study@20260699`. **Dashboard: samo error-monitoring** (Tracing/Session-Replay/Logs ISKLJUČENI).
  **✅ ŽIVA PROVJERA:** obje test-greške stigle na Sentry dashboard (Users:0 = PII off radi). **✅ GDPR:** `privacy.html` §5 + cookie-banner spominju Sentry. Test `tests/monitoring.spec.js` (loader stubban preko `page.route`).
  Cache `?v=20260699`. Gate (dvaput): validate/verify/typecheck/unit/RLS 0/0, **Playwright 101 pass/0 fail (subjects=18)**, CI zelen. [[foundation-pivot]]
- **✅ FAZA 2 — 2A (S2 čisti JSON format) DEPLOYANO NA PRODUKCIJU (2026-07-02, ff-merge `0c21aa6..661dbc8` grana `foundation/f2a`→main uz potvrdu korisnika; CI zelen; live verificirano):**
  **17/18 predmeta na JSON dual-read** (tada svi osim **accountinga** — svjesno odgođen; **DOVRŠEN 2026-07-03 → 18/18**, grana `foundation/f2a-accounting`, vidi ADR-015 + zapis niže). Cigle: **2A.1** JSON Schema ugovor
  (`schema/subject-content.schema.json` draft-07 + `scripts/validate-json-schema.js` = `npm run validate:schema`, ajv dev-dep; izviđanje uhvatilo stvarna nedokumentirana polja `quiz.image`/`imageAlt`/`learn.title`/`learn.image=null`; 54/54) ·
  **2A.2** exporter (`scripts/export-content-json.js` = `npm run export:json [id] [--check]` → `data/json/<id>/<var>.json`, **51 datoteka**; round-trip 54/54 bez gubitka; `.gitattributes` `data/json/**/*.json eol=lf`; **CI drift-gate `export:json -- --check`**) ·
  **2A.3** dual-read loader (`_loadSubjectFromJson` u `content-loader.js`; grananje **DB → JSON (`content.dataFormat:'json'`) → `.js` fallback**; vježbe UVIJEK iz `.js` codeScripts = BUG-012; `verify` čuvar #7: flag ⇒ JSON datoteke postoje) ·
  **2A.4** migracija (pilot `sit` → statistics+macro+math = exercise put → 13 ostalih). **Provjere:** `tests/dual-read.spec.js` 16/16 (JSON put · SHADOW bajt-ekvivalencija JSON≡`.js` u pregledniku · exercise put · fallback) ·
  puni Playwright **117/0** · nezavisni audit JSON≡`.js` (414 kat / 4148 fc / 3479 quiz / 2641 fill, 0 razlika) · Vercel preview SHA1-provjeren (share-bypass) · **live:** tokeni `catalog?v=20260702`+`content-loader?v=20260700`, 17 flagova, JSON `application/json`.
  Napomene: `.json` NIJE immutable-cachean (vercel.json pokriva samo `.js`/`.css` → ETag, uvijek svjež); `CONTENT_VERSION` nedirnut (`20260695`); `.js` datoteke OSTAJU izvor istine + fallback (flip izvora = F4). [[foundation-pivot]]
- **✅ FAZA 2 — 2C (S3 AppState) KOMPLETNA + ✅ DEPLOYANO NA PRODUKCIJU (2026-07-03, ff-merge `73f3809..f54048a` main; CI zelen; preview SHA1/EOL-verificiran; live verificirano: 16× token `20260703`, `window.AppState` servira, BUG-016 CSS fix live, JSON 200):**
  SVI mutable globali iz `config.js` → **`window.AppState`** (`js/app-state.js`, učitava se PRIJE config.js), grupa-po-grupa s punim gateom nakon svake:
  **2C.1** skeleton (`0a43fc9`; JSDoc typedefi + tsconfig scope + `tests/unit/app-state.test.js`) → **2C.2a fill** (`a08dc3b`, 117/0) → **2C.2b cards** (`9612977`, 125/0) →
  **2C.2c+2C.2e quiz+session** (`1997014`, 129/0) → **2C.2d nav** (`2d75dd1`, 13 datoteka, **133/0**) = **5/5 grupa; config.js bez ijednog mutable `let`**
  (`progress`/`analytics` namjerno NISU u AppState — vlastiti persist-lifecycle kroz storage/cloud-sync). Mapiranje: `nav.page/subject/lesson/data/section/category` ·
  `cards.deck/index/known/unknown` · `quiz.questions/index/correct/wrong/startTime/wrongList/shuffledOptions/shuffledCorrectIndex/answers` · `fill.questions/index/correct/wrong` · `session.startTime`.
  **⚠️ POUKE:** (1) migracija ČITANJEM svakog mjesta NE regexom — imena kolidiraju s DOM id-jevima (`'fillCorrect'`/`'wrongAnswersList'`) i propertyjima (`analytics.correctAnswers`, `data.flashcards`);
  (2) `typeof currentX !== 'undefined'` guardovi (exercises/auth/cloud-sync) → `typeof AppState` (inače nakon brisanja `let`-ova TIHO 'undefined');
  (3) novi **funkcionalni testovi** `tests/app-state.spec.js` — fill/quiz/flashcards/nav tijekovi klikaju KAO KORISNIK; consent `'denied'` unaprijed u testu (banner presreće klikove).
  **🐛 BUG-016 nađen tim testom + POPRAVLJEN (`68bf7e1`):** landscape mobitel — `.flashcard` fiksna visina/cap (`responsive/03`+`04`, relikti prije BUG-013) → lice stršalo preko ✓/✗ gumba (tap=flip).
  Cache **`?v=20260703`** (18 js datoteka + styles.css + responsive/03/04). **(2D djelomično LIVE — vidi bullete niže; DALJE 2D.2c → F3.)** [[foundation-pivot]]
- **✅ FAZA 2 — 2A DOVRŠENA na 18/18 (accounting → JSON) — grana `foundation/f2a-accounting`, ✅ DEPLOYANO 2026-07-03 (`a8c7b84..d2b1e48`; uvjet „radi savršeno" ispunjen: Playwright 137/0 + live `accountingM1.json` servira 6 kat.):** accounting bio jedini
  predmet izvan JSON dual-reada (17/18); sad migriran (**format-only, 0 diranja sadržaja**) da F4 flip kreće s uniformne baze. `export:json accounting`
  (3 JSON: M1 6kat/M2 8kat/Final 15kat, round-trip 0) + `dataFormat:'json'` u catalog + catalog.js token **`20260702→20260704`** + novi `dual-read.spec`
  accounting test (study iz `data/json/accounting/*.json`, vježbe iz `.js` = BUG-012 očuvan). Gate: verify 0/0, validate:schema 54/54, validate:content 0/0,
  export:json --check 0 nesklada, test:unit 69/0, typecheck 0, **dual-read.spec 5/5** (uklj. novi accounting). Odluka + otpis #2/#4: **ADR-015**. [[foundation-pivot]]
- **✅ FAZA 2 — 2D.1 (prvi Web Component `<sokrat-toast>`, S4) — grana `foundation/f2d`, ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`):** prvi custom element
  (`js/components/sokrat-toast.js`), dokazuje obrazac (registracija→lifecycle→`.show()`). **Light-DOM zadržava klasu `.toast`** → svi CSS-ovi (base+responsive)
  nepromijenjeni. `showToast()` (utils.js) → **delegat** na komponentu s **fallbackom** na stari DOM-put (0 regresije, ~13 pozivatelja nedirnuto). a11y `role=status`.
  U typecheck scopeu (`Window.SokratToast`). Test `tests/components.spec.js`. Cache `20260705`. Gate: verify/typecheck/unit/validate 0, **Playwright 145/0**.
- **✅ FAZA 2 — 2D.2a (reusable modal-primitiv `<sokrat-modal>`, S4) — grana `foundation/f2d`, ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`):** samostalni overlay/dialog
  (`js/components/sokrat-modal.js` + `css/sokrat-modal.css`, light-DOM): `open/close/toggle/isOpen` + eventi; ESC/backdrop-zatvaranje, scroll-lock, fokus-u-modal+restore+Tab-trap,
  a11y (`role=dialog`/`aria-modal`). **Nijedan postojeći modal još ne migriran → 0 rizika.** Cache `20260706`. Test: stanje gate-ano; **fokus ne gate-an** (touch-profili ne fokusiraju
  tapom → ručno/scratch verificiran). Gate: typecheck/verify/validate/unit 0, **Playwright 153/0**.
- **✅ FAZA 2 — 2D.2b (learn image-viewer → `<sokrat-modal>`, prvi stvarni konzument) — grana `foundation/f2d`, ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`):** `#imageModal`
  `<div class="image-modal hidden">` → `<sokrat-modal class="image-modal">`; komponenta vodi ESC/backdrop/scroll-lock/fokus; `learn.js` delegira (`open()`, close čisti sliku preko
  `sokrat-modal:close` eventa); maknut `#imageModalBackdrop` div. Izgled očuvan kroz `sokrat-modal.image-modal` override — **nulta vizualna promjena (potvrđeno screenshotom)**. Cache `20260707`.
  Test u `components.spec.js`. Gate: typecheck/verify/validate/unit 0, **Playwright 157/0**.
- **✅ FAZA 2 — 2D.2c (auth modal `#authModal` → `<sokrat-modal>`, najrizičnija cigla 2D, zadnji ad-hoc overlay) — ✅ DEPLOYANO NA PRODUKCIJU 2026-07-04 (ff-merge `ba1c6f9..4ed6e75`; live-verified: `js/auth.js?v=20260708` na produkciji servira `createElement('sokrat-modal')`, tokeni styles.css/auth.js=20260708; korisnik potvrdio login/logout na preview-u):** `auth.js:injectModal()`
  gradio ~90 redaka `innerHTML` overlaya (backdrop+close, **bez ESC**). Sada: `createElement('sokrat-modal')`; maknut `.auth-modal__backdrop` div + `wrap.hidden` (backdrop = komponentin overlay);
  kartica bez **dupliranog** `role=dialog`/`aria-modal` (komponenta = jedini dialog), `aria-labelledby` na komponentu; `openModal`/`closeModal` → `m.open()`/`m.close()` (fallback). **Sav login/signup/
  forgot/recovery tok netaknut.** `css/auth.css`: overlay pravila → `sokrat-modal.auth-modal` override (backdrop `rgba(2,6,23,0.72)`+blur6 kao prije) + `> *` `max-width:420px` (card cap). **Bonus iz
  primitiva:** ESC-zatvaranje + scroll-lock + fokus/Tab-trap/focus-restore (auth prije ništa). **Nulta vizualna regresija — potvrđeno screenshotom** (desktop 420px centrirano / mobitel 335px). Cache
  `20260708`. Novi test u `components.spec.js` + `auth.spec.js` zelen. Gate: verify/typecheck/unit 0, **Playwright `components`+`auth`+`a11y` 36/0** (12 a11y-skip po dizajnu).
- **✅ FAZA 2 — 2D.3 (`<sokrat-confirm>` branded confirm-dijalog, prva kompozicija komponenti) — ✅ DEPLOYANO NA PRODUKCIJU 2026-07-04 (ff-merge `7d88e5c..df67766`; live-verified: `sokrat-confirm.js?v=20260709` servira `customElements.define('sokrat-confirm')`, `analytics.js` sadrži `askConfirm`; tokeni 20260709). → time F2 (reusable jezgra) KOMPLETNA:** treći UI-primitiv, **GRAĐEN NA `<sokrat-modal>`**
  (`js/components/sokrat-confirm.js`+`css/sokrat-confirm.css`). API `el.ask(opts)→Promise<boolean>` + globalni **`window.askConfirm(opts)`** (singleton `#confirmDialog`, **fallback na native `confirm()`**, uvijek Promise).
  Confirm→true, Cancel/ESC/backdrop→false, `danger:true`→crveni gumb; modal nasljeđuje ESC/scroll-lock/fokus/Tab-trap. **Zamijenio 3 native `confirm()`** (analytics reset progress/analytics → `async`; profile delete-cloud).
  `i18n` `common.cancel`/`common.confirm` (en+hr). **Budući konzument: GDPR „Obriši račun" (ADR-016).** Vizualno OK (screenshot, 420px/335px). Cache `20260709`. Test u `components.spec.js`. Gate: verify/validate/typecheck/unit 0, **PUNA Playwright 165/0**. **→ nakon deploya F2 (reusable jezgra) KOMPLETNA.**
- **▶ FAZA 3 (performanse) — 3C.1+3B+3A ✅ DEPLOYANO NA PRODUKCIJU (2026-07-05, main `c115a5d..868dc9f`; live-verified: token `20260705140655`, `/sw.js` `max-age=0,must-revalidate` + `SW_VERSION`+`res.ok`+`sw:skipWaiting`, bundle immutable, sw-register update-flow servira):** redoslijed = najsigurnija cigla prva → **3C → 3B → 3A → 3D → 3E** (SW zadnja, najrizičnija).
  **🐛 DEPLOY-POUKA (2026-07-05):** `"//"` komentar-ključ u `vercel.json` headers-unosu RUŠI Vercel schema validaciju → deploy ERROR **prije builda** (bez build-logova; GitHub Actions CI zelen jer ne validira vercel.json!). Fix `868dc9f` (ključ maknut). **Ubuduće: nakon pusha provjeri i Vercel check na commitu, ne samo Actions; vercel.json = bez komentar-ključeva.**
  **✅ 3C.1 auto version-bump:** `scripts/bump-version.js` = JEDAN broj za cijelu app — `npm run bump` postavi svih ~92 `?v=` tokena (5 HTML + styles.css @import + manifest.json) + `CONTENT_VERSION` na novi `YYYYMMDDHHMMSS` odjednom; `npm run bump:check` = TVRDI CI gate (drift=crveno = **BUG-004 čuvar**). **ADR-017** (uniformni token > content-hash).
  **✅ 3B CSS bundling:** `scripts/build-css.js` konkatenira 26 `css/*.css` (u @import redoslijedu iz `styles.css`) → **`styles.bundle.css`** (194 KB); `index.html`→bundle; `styles.css`=izvor-manifest (ne servira se). `npm run build:css` + CI drift-gate `build:css -- --check` (kao data/json; `.gitattributes` eol=lf). Eliminiran render-blocking @import waterfall (perf mjeri CI Lighthouse).
  **✅ 3A.1/3A.2 Service Worker (najrizičnija cigla):** `sw.js` (**same-origin GET only**; navigacija **network-first**+fallback na keširani shell=offline; asseti **stale-while-revalidate**; Supabase/CDN/non-GET → mreža; NE `skipWaiting`; activate-purge; kill-switch `__swKill()`) + `js/sw-register.js` (`updateViaCache:'none'`, fail-safe) + `vercel.json` `/sw.js` no-cache + `SW_VERSION` u `npm run bump`. **„Works offline" copy vraćen.** Test `tests/sw.spec.js` (offline load); app-testovi `serviceWorkers:'block'`, SW izoliran u sw.spec.
  **✅ 3A.3 (FABLE, ADR-019 u praksi):** Fable-pregled našao+popravio **3 nalaza u sw.js** (navigate keširao i 404/500→sad samo `res.ok`; `cache.put` fire-and-forget→`event.waitUntil`; precache bundlea bez `?v=`=mrtav ključ→`?v=SW_VERSION`, prvi posjet sad daje stiliziran offline shell) + **update-flow:** `sw-register.js` `updatefound`/`reg.waiting` → `<sokrat-toast>` klik-akcija („dodirni za nadogradnju", i18n `sw.updateReady`) → `sw:skipWaiting` → `controllerchange` → JEDAN reload (guard: NIKAD na prvi install; bez dodira novi SW čeka iduće otvaranje). **`<sokrat-toast>` aditivno proširen** `show(msg,{duration,onClick})` (13 pozivatelja netaknuto). Testovi: toast-akcija (components.spec) + **update-flow e2e** (sw.spec, pravi waiting-worker re-registracijom pod drugim URL-om). Cache `20260705140655`. Gate: **PUNA Playwright 181/0** (15 skipova po dizajnu), typecheck/unit/bump:check/build:css-check 0.
  **✅ (3C.1+3B+3A) DEPLOYANO 2026-07-05** (CI zelen na `9581b81`; merge uklj. korisnikov novi README `90ac791`, README=njegova verzija u cijelosti; vercel.json fix `868dc9f`; live-verified gore).
  **✅ 3D.1 optimizacija slika (OPUS, grana `foundation/f3d`; NIJE deployano):** `blind-map.png` (**1.52 MB**, jedina velika slika) → **`blind-map.webp` q85 = 39 KB (−98%, 40×)**, vizualno identično (karta se crta na canvas → format transparentan). `js/blind-map.js`: WebP→PNG fallback (PNG ostaje za ~1.5% preglednika) + dodan `?v=` token (prije izostavljen). `static-server.js` `.webp` MIME. Novi `tests/blind-map.spec.js`. Nalaz: `loading="lazy"` VEĆ na svim learn slikama; blind-map ≈95% težine slika (ali se učita SAMO u Geography → ne dira landing perf). Cache `20260705161843`.
  **✅ 3D.2 render-blocking eliminacija na landingu (OPUS, ista grana):** pravi landing perf-bottleneck = 3 eksterna render-blocking CSS-a. **KaTeX CSS** (na landingu neiskorišten; komentar LAŽNO tvrdio „ne blokira" — samo JS bio `defer`) + **Google Fonts** → **ASINKRONO** (`media=print`→`onload media=all`) + `<noscript>` fallback; **Font Awesome OSTAJE render-blocking** (async=bljesak ikona; zaseban zahvat) + `preconnect` cdnjs. HTML-only → **nema bumpa**. Vizualno (screenshot) + `katex.spec` 4/4. Gate: **Playwright 185/0**. CSP-napomena F6: inline `onload`→nonce/JS-flip.
  **✅ 3E.1 a11y hardening (OPUS, ista grana):** dubinski axe audit otkrio **rupu u gate-u** — postojeći a11y gate skenirao samo landing/browse/learn/profile → **flashcards/quiz/fill/progress IZVAN gate-a**, pa su kroz njih na produkciju prošli **critical** (button-name flashcard prev/next; select-name quiz selecti). Popravljeno + gate PROŠIREN (skenira sve study sekcije): `data-i18n-aria` (aria-label za ikone-gumbe) + `<label for>` quiz + **`--danger-text`** token + `--primary`→`--primary-dark` (check/th/filter) + learn h3 →`--primary-light` + box-naslovi svijetli+obojana ikona + `enhanceLearnTables()` (tabindex za skrolabilne tablice). **0 serious/critical.** Gate: **Playwright 185/0**, a11y 4/4. Cache `20260705215529`.
  **⬜ DALJE: 3E.2** (moderate `region` landmarks + `heading-order`, ne blokiraju) → **3C.2** (auto-bump na Vercel deploy-u) → deploy F3-ostatak. Opcionalno diminishing: geo-JPG→WebP, Font Awesome async, PWA icon-512. **🧭 Nakon F3: F4 CRUD → F5 SRS → F6 sigurnost → UGC → tek onda nazad na sadržaj (ADR-018).** [[foundation-pivot]]
- **🧭 DALJE (korisnik 2026-06-24; detalji `docs/ROADMAP.md` §DALJE + [[content-roadmap-sequencing]]; ⚠️ PAUZIRANO zbog platforma-first zaokreta gore):** **A)** ✅ **sadržaj 1. god GOTOV**
  (~~Traffic~~ ✅ → ~~**Math**~~ **✅ LIVE 2026-06-27, ZADNJI**); ⛔ **Intro to Hospitality = BLOKIRAN** (nema PDF-ova). → sadržajna staza 1.+2. god završena.
  **B)** nakon sadržaja: **(1) Admin CRUD (B9/B10) → (2) AI tutor → (3) priprema za MATURU.** (Supabase re-sync Math ✅ napravljen 2026-06-27.)
  **C) strateški:** ✅ **LOGO redizajniran + LIVE (2026-06-28, `19f07db`)** — glatki vektorski Sokrat, glava ispunjava krug (vidi §Ključne odluke).
  **▶▶ HRV program „Menadžment u Hotelijerstvu" — CIGLE 1–5c ✅ LIVE (deployano 2026-06-28, `320d413..4b795c8`):** prijevod predmeta
  1.+2. god na hrvatski. **Arhitektura (Opcija A — klon programa, NE i18n u sadržaju):** paralelni program `hospitality-management-hr`
  + `data/<subj>-hr/*.js` (isti engine 0 promjena, vlastiti `storageKey`) + **`scripts/translate-subject.js`** (Sonnet tool_use; slot-pristup
  = prevede SAMO string-polja iz bijelog popisa, JS rekonstruira strukturu → quiz.correct/`_______`/KaTeX/HTML očuvani po konstrukciji;
  **salvage-parser** jer tool_use često vrati `translations` kao pokvaren JSON-string). **Stanje:** ✅ PILOT **Business Informatics HR**
  (`business-informatics-hr` = „Poslovna informatika", 11 kat/86fc, strukturno identično EN-u, ~$0.66) + ✅ **catalog** (HR program, landing/
  sidebar filtrirani na `PRIMARY_PROGRAM`→EN nepromijenjen, HR kroz Browse) + ✅ **UI i18n** (`js/i18n.js`: `{en,hr}` rječnik ~160 ključeva +
  `t()`/`applyTranslations` nad `[data-i18n]`). **✅ GLOBALNI 🌐 HR/EN toggle** (`localStorage 'sokrat-ui-lang'`, master nad programom; HR program
  „predloži" hrvatski prvi put) preveo **cijeli glavni tok**: study UI + landing + browse drill-down (hrvatski ordinali/množina). **EN dict =
  originalni tekst → EN bajt-identičan.** Cache do `20260696`. Testovi `tests/i18n.spec.js`. Plan/detalji: **`docs/HRV_PLAN.md`**. [[hrv-program]]
  **⬜ Preostaje (long-tail):** profil + pravne stranice (privacy/terms/faq/contact = zasebni HTML) + lessons-header + blind-map → **PA prijevod ostalih predmeta** (Cigla 6, batch alatom).
  · **✅ BUG-013 (flashcard) RIJEŠEN + LIVE** (grid-stack + fiksni `height`→`min-height`; `213b067`).
  · zatim **3. godina HM** · **studentski UGC za 3./4. god**.
  **(Napomena: PWA instalirana app drži staru ikonu dok se ne reinstalira — server ima novu; nije bug.)**

## Ključne odluke (detalji: `docs/DECISIONS.md`)
- **ADR-013 (2026-06-29): content arhitektura = podatak≠ponašanje.** Study sadržaj → čisti **JSON**; vježbe/generatori → zasebni **JS moduli**.
  **`ContentRepository` šav** (FileRepo/SupabaseRepo iza istog sučelja). Cilj: **baza autoritativna, datoteke=generirani export**; flip u Fazi 4
  (Admin CRUD, **custom NE CMS**), predmet-po-predmet uz dual-read. Vidi `docs/FOUNDATION_PLAN.md`. [[foundation-pivot]]
- **ADR-014 (2026-06-29): engineering standardi temelja.** CI/CD gate (GitHub Actions + Vercel preview) · **type-check bez build-a** (JSDoc+`tsc --checkJs`,
  samo CI checker, modul-po-modul) · **Web Components** (light-DOM) za reusable UI umjesto ad-hoc `innerHTML` · error monitoring. Vanilla/no-build etos ostaje.
- **ADR-018 (2026-07-05): platforma-first SKROZ do UGC-a PRIJE povratka na sadržaj** (F3→F4 CRUD→F5 SRS→F6 sigurnost→UGC→sadržaj). **UGC se NE gura u CRUD prerano:** F4 se dizajnira UGC-spreman (multi-user/RLS/draft→publish), ali **student-upload NIKAD prije F6** (DOMPurify+moderacija+CSP); student uploada PODATKE, NIKAD KOD (vježbe=sandbox).
- **ADR-019 (2026-07-05): maksimalno-rizične cigle (Service Worker) rade se na FABLE modelu** (drugi model = jeftin sigurnosni sloj). Korisnik prebaci model; handoff = testirani commitani checkpoint (3A.1/3A.2 gotovi na Opusu, Fable radi 3A.3+deploy).
- **ADR-020 (2026-07-05): točnost sadržaja = dvo-ključni verifier** (Sonnet piše → **Opus SAMO provjerava+označava krive** → korisnik presudi; protiv izvornog `topics.json`, minimalna potrošnja; retroaktivno na 18 predmeta). Gradi se u fazi sadržaja. Postojeći predmeti = spot-checkani, NE iscrpno.
- **ADR-017 (2026-07-04): cache-busting = JEDAN uniformni auto-bumpani token za cijelu app** (ne per-file content-hash). `npm run bump` (F3 3C.1) postavi sve `?v=`+`CONTENT_VERSION`+`SW_VERSION`
  na isti `YYYYMMDDHHMMSS`; `bump:check` = TVRDI CI gate (drift=crveno). Uniformni jer je jednostavan=pouzdan i CI-provjerljiv; trade-off (deploy busta sve cacheve) zanemariv (SW ionako kešira). Zatvara ADR-015 #3.
- **ADR-016 (2026-07-04): privilegirane operacije (`service_role`) → Supabase Edge Functions, NIKAD Vercel.** Pravilo: *sve što traži `service_role` → Edge Function;
  sve pod korisnikovim/anon JWT-om uz RLS → bilo gdje (uklj. Vercel `/api`)*. `service_role` ostaje ko-lociran s bazom (min. napadna površina za root-ključ). Prvi konzument =
  **self-service „Obriši račun" (GDPR)** — trenutno NEMA (samo „Delete cloud data" + mail-fallback); dizajn-skica u `docs/BACKLOG.md` §Brisanje računa. Odgođeno (uz F4 ili ranije). [[foundation-pivot]]
- **ADR-015 (2026-07-03): tech-debt triage „briše li ga F4?".** Accounting→JSON = **NAPRAVITI** (dovršeno 18/18, F4 flip s uniformne baze) ·
  root `data-*.js` lokacije + Supabase free-tier sleep = **svjesno NE popravljati** (F4 ih ispari / poslovna odluka, ne inženjerska) · ručni cache-tokeni = **čekaju F3** (auto version-bump). [[foundation-pivot]]
- ADR-001/008: backend = Vercel Functions + Supabase (Railway samo kasnije za AI worker); **⚠️ ADR-016 precizira: `service_role`-operacije idu na Supabase Edge, ne Vercel.**
- ADR-006: autorstvo u datotekama sad (migracijski sigurno); migracija u bazu jednom u Bloku B.
- ADR-007: navigacija = puni drill-down (eksplicitni Fakultet→Smjer→Godina→Predmet). **Implementirano** (`#browse-page`).
- ADR-009: kvantitativni predmeti (Math/Micro/Macro/Statistika) = **KaTeX** (currency-safe delimiteri **`\( \)`/`\[ \]`/`$$ $$`**, NE jedan `$`) +
  „worked problems" na postojećim modovima + grafovi-kao-slike. ✅ implementirano; **Math zadnja**.
- ADR-010: **generator predmeta** (PDF→Sonnet→`data/*.js`, tool_use) uz minimalan usage. ADR-011: **Blok B read-path = sadržaj iz Supabasea direktno (anon key+RLS), NE `/api`** + file-fallback.
- ADR-012: **HRV program = KLON (Opcija A), NE i18n u sadržaju.** Sadržaj ostaje jednojezičan po datoteci (paralelni `data/<subj>-hr/*.js`, vlastiti
  `storageKey`); engine 0 promjena. **Sučelje = ZASEBNA os:** globalni `localStorage` toggle (HR/EN) je gospodar i ne dira sadržaj; opening HR programa
  samo „predloži" hrvatski prvi put. EN dict-vrijednosti = originalni tekst → EN bajt-identičan. Baza: HR = novi redovi u POSTOJEĆIM tablicama (NE nove tablice). [[hrv-program]]
- ~~Logo se NE mijenja.~~ **✅ LOGO REDIZAJNIRAN (2026-06-27): `logo.png` (raster + crop-hak) → `assets/logo.svg`** — postojeći
  Sokrat **vektoriziran s zaglađivanjem**: ImageMagick (4× upscale → threshold → maska koja makne originalni medaljon-prsten/ramena,
  ostaje samo glava) → **potrace** (visoka rez + `alphaMax 1.3`/`optTolerance 1.6` = glatke krivulje, NE „olovka") → **auto-fit**
  (izračun bbox-a glave + scale/translate da **cijela glava ispuni krug**, ništa odrezano). Finalni izgled: indigo brend-gradijent
  `#6366f1→#818cf8`, **glava ispunjava cijeli krug** (bez prstena koji viri), bijelo lice s indigo detaljima. Maknut crop-hak
  (`.logo-image` 150%→100%, bez `object-fit:cover`); favikoni regenerirani iz SVG-a (16/32/ico/apple-180/192/512; PWA/iOS na `#0f172a`);
  SVG favicon dodan. Stari `logo.png`/`logo-small.png` obrisani (mrtvi, u git povijesti). Cache `?v=20260693` (svg+favikoni; CSS ostao
  `20260692`). Gate: verify 0/0, Playwright **68/68**, vizualni pregled nav 44px OK. **Iteracija (korisnik): odbačeni ručno-crtani SVG-ovi
  (izgledali „kao pingvin"/skicirano) — kvaliteta dolazi iz vektorizacije ORIGINALA, ne ručnog crtanja.** Vizualni stil: **„čisto i bogato", dark.**

## Dokumentacija (`docs/`)
**`FOUNDATION_PLAN`** (▶ AKTIVNO: platforma-first temelj — misije/faze/reusable podsistemi S1–S6, brick-liste, KAKO; ADR-013/014) ·
`README` (index) · `PRD` · `VISION` (dugoročna full-stack vizija + gating-odluke) · `ARCHITECTURE` ·
`BACKEND` · `ROADMAP` · `CONTENT_SCHEMA` · `CONTENT_GUIDE` · `CONTENT_INTAKE` · `TESTING` ·
`CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG` ·
**`EXERCISES_ENGINE`** (reusable sustav vježbi + cigla-po-cigla plan) · **`ACCOUNTING_PLAN`** (analiza izvora + katalog) ·
**`STATISTICS_PLAN`** (teorija-learn + statistički exercises na istom engineu, cigla-po-cigla; stat-lib u `data/`; mathportal kalkulatori) ·
**`CONTENT_GENERATOR`** (pipeline za dodavanje predmeta uz minimalan usage: build-topics→generate-subject(Sonnet)→assemble-subject→gate) ·
**`MATH_PLAN`** (plan za Matematiku — zadnji 1.-god predmet, KaTeX + worked problems; ⬜ TODO) ·
**`HRV_PLAN`** (HRVATSKI program „Menadžment u Hotelijerstvu" = prijevod svih predmeta; klon-program Opcija A + `translate-subject.js`; konvencije imenovanja + bijeli-popis polja; cigla po cigla).
