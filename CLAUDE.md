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
6. **PRIJE SVAKOG COMPACTA (korisnikovo pravilo, 2026-06-24):** kad korisnik kaže da je potreban compact,
   Claude MORA proći **APSOLUTNO SVE `.md` datoteke** (root + `docs/` + memorija) i provjeriti da svaka točno
   i dobro piše (status, brojevi, ADR-ovi, linkovi) — ispraviti zastarjelo PRIJE compacta. Audit-obrazac: vidi
   sesiju 2026-06-23/24 (provjeri svaku, popravi netočno, commit). [[doc-audit-before-compact]]

## Komande
- `npm run verify` — integritet catalog-a (pokreni nakon dodavanja predmeta/sadržaja).
- `npm run test:responsive` — Playwright (iPhone profili): responsive overflow + smoke (sve sekcije × svi predmeti) + sidebar.
- `npm run serve:test` — lokalni server na http://localhost:5050 (za pregled).
- `npm run scaffold -- ...` — kostur novog predmeta.
- `node scripts/pdf-text.js "<pdf>"` — tekst iz PDF-a.
- `npm run validate:content [subjectId]` — sadržajni validator (shema + quiz indeks + KaTeX currency-safe).
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
- **🧭 DALJE (korisnik 2026-06-24; detalji `docs/ROADMAP.md` §DALJE + [[content-roadmap-sequencing]]):** **A)** ✅ **sadržaj 1. god GOTOV**
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
- ADR-001/008: backend = Vercel Functions + Supabase (Railway samo kasnije za AI worker).
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
`README` (index) · `PRD` · `VISION` (dugoročna full-stack vizija + gating-odluke) · `ARCHITECTURE` ·
`BACKEND` · `ROADMAP` · `CONTENT_SCHEMA` · `CONTENT_GUIDE` · `CONTENT_INTAKE` · `TESTING` ·
`CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG` ·
**`EXERCISES_ENGINE`** (reusable sustav vježbi + cigla-po-cigla plan) · **`ACCOUNTING_PLAN`** (analiza izvora + katalog) ·
**`STATISTICS_PLAN`** (teorija-learn + statistički exercises na istom engineu, cigla-po-cigla; stat-lib u `data/`; mathportal kalkulatori) ·
**`CONTENT_GENERATOR`** (pipeline za dodavanje predmeta uz minimalan usage: build-topics→generate-subject(Sonnet)→assemble-subject→gate) ·
**`MATH_PLAN`** (plan za Matematiku — zadnji 1.-god predmet, KaTeX + worked problems; ⬜ TODO) ·
**`HRV_PLAN`** (HRVATSKI program „Menadžment u Hotelijerstvu" = prijevod svih predmeta; klon-program Opcija A + `translate-subject.js`; konvencije imenovanja + bijeli-popis polja; cigla po cigla).
