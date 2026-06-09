# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Verzioniranje: [SemVer](https://semver.org/).
Tekuća live verzija je 2.x. Platformska pregradnja (Faza 0+) vodi prema 3.0.0.

## [Unreleased] — rad u tijeku (cilj: 3.0.0)
### Added
- **Tourism Geography FINALNI ispit (Hrvatska + svijet) — hibrid:** novi `data-geography-final.js`
  (`window.geographyFinalData = Object.assign({}, geographyData, geographyM2Data, { examPractice })`, uzor
  Marketing/Economics/BI final; učitava se ZADNJI). Spaja svih 12 kategorija oba kolokvija (bez kolizija ključeva)
  + dodaje kuriranu **`examPractice`** („Exam Practice (Croatia + World)", cross-topic: 14 fc · 10 quiz · 8 fill +
  „Final Exam Roadmap" learn). Silabus (prez. 0): finalni = 30 bodova, ista struktura kao kolokviji (10 pitanja:
  5 zatvorenih + 5 otvorenih), pokriva sve. Catalog: nova lekcija `final`, `scripts` += final (zadnji),
  `resolve.final = geographyFinalData`. `CONTENT_VERSION` 20260617→20260618 + bump `catalog.js`/`content-loader.js`
  `?v=20260618`. Ukupno final = **13 kat. / 128 fc / 127 quiz / 84 fill**. Verify 0; strukturni validator 0
  (0 loših quiz-indeksa); Playwright 36/36 + ciljani final render-test (4 profila, merged=true:
  croatiaFeatures+americas+examPractice aktivni, 0 problema/overflowa). → **Tourism Geography KOMPLETAN (K1+K2+finalni).**
- **Tourism Geography 2. kolokvij („Tourism Geography of the World") — `second-midterm` popunjen:** novi sibling
  fajl `data-geography-m2.js` (`window.geographyM2Data`, obrazac kao `data-*-m2.js`) sa **6 kategorija po kontinentu** —
  Global Tourism & World Regions (uvod/UNWTO), Europe, Asia, Africa, Australia & Oceania, The Americas
  (**56 flashcards · 45 quiz · 33 fill · 6 learn**). Izvori: prezentacije 7–12 (`_2K_`): 7 uvod, 8 Europa, 9 Azija,
  10 Afrika, 11 Australija/Oceanija, 12 Amerike (SAD/Meksiko/Brazil). Sve brojke doslovno sa slajdova (npr. Azija 44,5
  mil. km²/~60% čovječanstva; Europa ~740 mil./Golfska struja; Suez 163 km; Yellowstone 1872 = najstariji NP; Brasília
  UNESCO 1987). Catalog: `scripts` += `data-geography-m2.js`, `resolve.second-midterm = geographyM2Data`, coming-soon
  uklonjen, opisi lekcija osvježeni. **Slijepa karta ostaje vezana uz 1. kolokvij** (m2 nema blind-map kategoriju).
  `CONTENT_VERSION` 20260616→20260617 + bump `catalog.js`/`content-loader.js` `?v=20260617`. Verify 0; strukturni
  validator 0 (0 loših quiz-indeksa); Playwright 36/36 + ciljani K2 render-test (4 profila, kategorije
  europe/americas aktivne, 0 problema/overflowa, obrisan). → **Tourism Geography KOMPLETAN (1. + 2. kolokvij).**
- **Economics in Hospitality FINALNI ispit (Unit 1–10) — hibrid:** novi `data-econ-hospitality-final.js`
  (`window.economicsHospitalityFinalData = Object.assign({}, economicsHospitalityData, economicsHospitalityM2Data,
  { examPractice })`, uzor Marketing/BI final; učitava se ZADNJI). Spaja svih 10 provjerenih jedinica + dodaje
  kuriranu **`examPractice`** („Exam Practice (All Units)", cross-topic: 14 fc · 10 quiz · 8 fill + „Final Exam Roadmap"
  learn). Catalog: nova lekcija `final`, `scripts` += final (zadnji), `resolve.final = economicsHospitalityFinalData`.
  `CONTENT_VERSION` 20260614→20260615 + bump `catalog.js`/`content-loader.js` `?v=20260615`. Ukupno final =
  **11 kat. / 162 fc / 106 quiz / 84 fill**. Verify 0; strukturni validator 0; Playwright 36/36 + ciljani final
  render-test (4 profila, quizOpts=12, 0 problema). → **Economics in Hospitality KOMPLETAN (1.+2. kolokvij + finalni).**
- **Economics in Hospitality 2. kolokvij (Unit 6–10) — `second-midterm` popunjen:** novi sibling fajl
  `data-econ-hospitality-m2.js` (`window.economicsHospitalityM2Data`, obrazac kao `data-marketing-m2.js`) s **5
  kategorija** — Business Result, Success & KPIs, Price Policy, Principles of Sales, Investment Profitability
  (**75 flashcards · 50 quiz · 40 fill · 5 learn**). Izvori: glavne prezentacije U6–U10 + „add" dodaci (KPI formule:
  ADR, RevPAR, TRevPAR, GOP, GOPPAR, NOP, EBITDA). Catalog: `scripts` += m2, `resolve.second-midterm =
  economicsHospitalityM2Data`, coming-soon uklonjen. `CONTENT_VERSION` 20260613→20260614 + bump `catalog.js`/
  `content-loader.js` `?v=20260614`. Verify 0; Playwright 36/36 + ciljani render-test (4 profila, 0 problema).
  → **Economics in Hospitality KOMPLETAN (1.+2. kolokvij).**
- **Marketing FINALNI ispit (T1–T13) — hibrid:** novi `data-marketing-final.js`
  (`window.marketingFinalData = Object.assign({}, marketingData, marketingM2Data, { examPractice })`,
  uzor BI `final.js`; učitava se ZADNJI). Spaja svih 12 provjerenih kategorija + dodaje kuriranu
  **`examPractice`** („Exam Practice (All Topics)", cross-topic: 12 flashcards · 10 quiz · 8 fill + „Final Exam
  Roadmap" learn). Catalog: nova lekcija `final`, `scripts` += final (zadnji), `resolve.final = marketingFinalData`.
  `CONTENT_VERSION` 20260608→20260609 + bump `?v=20260609`. Ukupno final = **13 kat. / 113 fc / 66 quiz / 56 fill**.
  Verify 0; strukturni validator 0; Playwright 36/36 + ciljani final render-test (4 profila, quizOptions=14, 0 overflowa).
  → **Marketing predmet KOMPLETAN (K1+K2+Final).**
- **Marketing 2. kolokvij (T9–T13) — `second-midterm` popunjen:** novi sibling fajl `data-marketing-m2.js`
  (`window.marketingM2Data`, obrazac kao `data-te2-final.js`) s **5 kategorija** — Distribution, Promotion (IMC),
  New Trends in Promotion, Marketing Planning, Organizing &amp; Controlling (**45 flashcards · 25 quiz · 20 fill ·
  5 learn**). Catalog: `scripts` += `data-marketing-m2.js`, `resolve.second-midterm = marketingM2Data`,
  coming-soon uklonjen. Izvori: 4 prezentacije (T9 27str · T10 33 · T11 31 · T12/13 27).
  `CONTENT_VERSION` 20260607→20260608 + bump `?v=20260608` (content-loader.js, catalog.js).
  Verify 0; Playwright 36/36; + ciljani K2 render-test (4 profila, 0 problema/overflowa, obrisan).
- **Marketing 1. kolokvij dopunjen — T7 (Product) + T8 (Price):** `data-marketing.js` dobio dvije nove
  kategorije (`product`, `price`) po `CONTENT_SCHEMA` (svaka 9 flashcards · 5 quiz · 4 fill · learn).
  1. kolokvij sada pokriva pune teme **T1–T8** (bio T1,2,3,5,6). Izvor: `TJ 7_The product` (28 str.) +
  `TJ 8_The price` (21 str.). `CONTENT_VERSION` 20260603→20260607 (busta lazy-loadane data-fajlove) +
  bump `?v=20260607` za `content-loader.js`/`catalog.js`. Verify 0 grešaka; Playwright 36/36.
- `CLAUDE.md` (root) — sažeti ključni kontekst koji se učitava svaku sesiju (preživljava
  kompaktiranje razgovora): stack, arhitektura, kritična pravila (cache bump, deploy uz potvrdu),
  komande, stanje, odluke. Detalji ostaju u `docs/`.
- `data/catalog.js` — jedinstveni izvor istine za predmete s hijerarhijom
  fakultet → smjer → godina → semestar → predmet → lekcija (M0/A1).
- `docs/` — profesionalna projektna dokumentacija (PRD, ROADMAP, ARCHITECTURE,
  PROGRESS, BUGS, DECISIONS, CONTENT_SCHEMA, CONTENT_GUIDE, TESTING, BACKLOG).
- `scripts/verify-catalog.js` — checker integriteta catalog-a (pokreni nakon
  dodavanja predmeta).
- Playwright vizualni responsive testovi (`tests/responsive.spec.js`,
  `playwright.config.js`, `scripts/static-server.js`) — emulira iPhone SE/15Pro/
  ProMax + landscape, automatski hvata horizontalni overflow. `npm run test:responsive`.
- `tests/smoke.spec.js` — sve sekcije × svih 8 predmeta (render, protok podataka,
  JS greške, overflow). Potvrđuje da A2 catalog refaktor ništa ne ruši.
- Content authoring tooling: `data/_template/lesson.template.js`,
  `scripts/scaffold-subject.js` (generira mapu+lekcije+catalog unos), npm skripte
  `scaffold` i `verify`. Standardna struktura: mapa po predmetu, datoteka po lekciji
  (ADR-006).
- `scripts/pdf-text.js` + `pdf-parse` (devDep) — ekstrakcija teksta iz profesorskih PDF-ova.
- **Business Informatics (1. godina, sem 1) — KOMPLETAN:**
  - Midterm 1 (Ch1–6): System Approach, Data/Info/Knowledge, Hardware, Software, Networks, WWW
  - Midterm 2 (Ch7–11): E-Business, IT Trends, Management Support, Expert Systems, Security
  - Final (`final.js`) = merge M1+M2 → 11 kategorija
  - Ukupno ~86 flashcards, 55 quiz, 44 fill (vjerno profesorskim PDF-ovima).
  - Provjereno: verify 0 grešaka; browser → M1=6, M2=5, Final=11 kartica, 0 overflow, 0 JS grešaka.
- **Browse stranica — puni drill-down navigacija** (`#browse-page`, M0.5 / A5, ADR-007):
  Fakultet → Smjer → Godina → Predmet (po semestru) → Lekcije. Render 100% iz catalog-a
  (`SokratCatalog.faculties/programsOf/yearsOf/subjectsOf/semestersOf` + `renderBrowse()` /
  `initBrowse()` u `js/navigation.js`, stil `css/browse.css`). Bogate kartice ("čisto i bogato":
  gradijent-ikone, breadcrumb, "Best NN%" napredak iz spremljenih quiz rezultata). Dodavanjem
  fakulteta/smjera/godine/predmeta u catalog kartice se pojave bez izmjene UI-a. Test:
  `tests/browse.spec.js` (drill-down + overflow guard, 4 iPhone profila).
- `SokratCatalog.isLessonComingSoon()` — data-driven "coming soon" (lekcija bez resolve mapiranja).
- **Lazy loading sadržaja (A4)** — `js/content-loader.js` (`loadSubjectContent`/`loadScriptOnce`/
  `isSubjectContentLoaded`, `CONTENT_VERSION`): sadržaj predmeta (`data-*.js`, ~777 KB) više se NE
  učitava na startu, nego **tek na otvaranje predmeta** (driven by `catalog.content.scripts`).
  `initStudyPage` je sada `async` (+ loader overlay `#studyLoading`). Statički `data-*.js` tagovi
  uklonjeni iz `index.html` (ostaje samo `catalog.js` + app moduli). Šav prema backendu (Blok B:
  `loadSubjectContent` → `fetch('/api/...')`). `restoreLastPosition` prosljeđuje sekciju kroz
  `initStudyPage` (bez `setTimeout` utrke). Test: `tests/lazy-load.spec.js`.
- **`docs/VISION.md`** — dugoročna full-stack vizija (AI tutor, profili, UGC, dijeljenje, natjecanje,
  "donesi svoj ključ") + 6 gating-odluka + mapa ovisnosti.
- **Landing rebuild — "prava stranica"** (M0.5 Tier 1): fixed nav traka (logo + linkovi + "Start studying"),
  hero trust red, **subjects showcase iz catalog-a** (`renderLandingSubjects()`/`initLandingSubjects()`, klik → lekcije),
  "How it works" (3 koraka), "Study modes" (5 modova), završni CTA band, strukturiran footer
  (brand/Explore/About + copyright). Svi "Start" gumbi vežu se preko klase `.start-trigger`. CSS u `css/landing.css`.
  Test: `tests/landing.spec.js` (nav, showcase=catalog, navigacija, overflow guard, 4 iPhone profila).
### Changed
- **Tourism Geography — 1. kolokvij popravljen i obogaćen iz izvornih prezentacija (0–6).** Pregled je pokazao
  da „sumnjive" statistike NISU pogrešne (GDP 23.200 EUR/80% EU, 170.723 dozvole, građevinarstvo 31% / turizam 31%,
  Top 10 noćenja 2024 — sve doslovno sa slajdova prez. 3), nego da je falio **cijeli konceptualni uvod** koji silabus
  eksplicitno traži za 1. kolokvij („Introduction to Geography + Tourism Geography of Croatia"). Izmjene u
  `data-geography.js`: **(1)** nova kategorija **`introToGeography`** (prez. 1 — definicija/grane geografije, humana
  geografija: stanovništvo/ekonomija/naselja, turistička geografija, turistička destinacija, regionalizacija; 10 fc /
  9 quiz / 7 fill / learn); **(2)** `croatiaFeatures` prepisan vjerno prez. 2+3 (relief/orogeneza, 3 tipa krša,
  hidrografija 38‰, biogeo. regije; GDP, transport A1–A12/mostovi/Helsinki 1997, demografija, **puni raspored radnih
  dozvola 2025** po djelatnostima i državama) — fc 11→16, quiz 12→14, fill 8→9; **(3)** `protectedAndTouristRegions`
  dopunjen (prez. 4–6): **okvir zaštite** (Zakon o zaštiti prirode = 9 kategorija; 2 stroga rezervata + 8 NP + 12 PP;
  5.930 km² ≈ 10,1%), **statistika 2017** (17 mil. turista/89% stranih; 4 mil. posjeta NP/PP, 3 mil. Plitvice+Krka;
  96% stranih u NP), komponente prirodnih atrakcija, **planinska regija** (Gorski kotar/Risnjak/Platak/Fužine) i
  **istočna Slavonija** (Vukovar/Vučedol, Ilok, Đakovo/lipicanci, Požega) — fc 12→18, quiz 18→25, fill 10→14.
  **Slijepa karta (`blindMapDrill`) i `examFramework` namjerno netaknuti** (uputa korisnika). Geografija ukupno =
  **6 kat. / 58 fc / 72 quiz / 43 fill** (bilo 5 / 39 / 56 / 36). `CONTENT_VERSION` 20260615→20260616 + bump
  `content-loader.js?v=20260616` (index.html). Verify 0; strukturni validator 0 (0 loših quiz-indeksa); Playwright 36/36.
  **2. kolokvij (prez. 7–12, oznaka `_2K_` = „Tourism Geography of the World") ostaje „coming soon".**
- **Economics in Hospitality — 1. kolokvij pregledan i bitno obogaćen iz izvornih prezentacija.** Postojeća
  struktura (5 jedinica = Unit 1–5 = teme T2–T6: hospitality basics, business economics, hospitality business,
  assets of reproduction, cost theory) **potvrđena točnom**, ali sadržaj bio pretanak → rebuild `data-econ-hospitality.js`:
  **flashcards 30→73 · quiz 20→46 · fill 15→36** + prošireni `learn` (povijesni razvoj ekonomije; asocijacije/koncentracija
  poduzeća; poslovna načela/politika/planiranje; likvidnost/solventnost, amortizacijski rokovi RH + metode `a%=100/t`;
  fiksni/varijabilni, zone troškova, koef. reaktivnosti `h=T%/Q%`, break-even). Catalog opis 1. kolokvija ispravljen
  (bio pogrešno „seminarski: sezonalnost/konkurentnost"). `CONTENT_VERSION` 20260609→20260613 + bump `catalog.js`/
  `content-loader.js` `?v=20260613`. Verify 0; Playwright 36/36. **2. kolokvij (Unit 6–10) ostaje „coming soon".**
- **Predmet preimenovan + premješten: „Business Entrepreneurship" → „Entrepreneurship and Innovation",
  sem 2 → sem 1** (`data/catalog.js`, id `entrepreneurship` nepromijenjen → napredak/storageKey očuvan).
  Ispravak prema stvarnom silabusu (predmet je u zimskom semestru). Posljedica: u browse navigaciji se
  sada prikazuje pod 2. god / Semestar 1 (data-driven, bez UI izmjena). Sadržaj lekcija nepromijenjen.
  Bump `data/catalog.js?v=20260612` (index.html). Usklađeni i `README.md`, `package.json`, `docs/ARCHITECTURE.md`.
  Verify 0; Playwright 36/36.
- **`css/responsive.css` (2470 linija) razbijen na 6 uređenih dijelova** u `css/responsive/`
  (`01-up-and-phone-breakpoints` → `06-component-improvements`). Čista podjela po SUSJEDNIM sekcijama
  (bez premještanja) → konkatenacija 01→06 = bivši fajl 1:1; redoslijed očuvan (responsive se učitava
  ZADNJI i gazi module → premještanje bi promijenilo kaskadu). Provjereno: kontiguitet + identičnost
  sadržaja (rebuild iz fajlova = original) + balans `{}` po fajlu + **Playwright 36/36** (ponašanje
  nepromijenjeno). Bump `?v=20260607` (styles.css token + dijelovi). Dublje čišćenje (3 preklapajuća
  prolaza) ostaje zaseban posao.
- **SEO `<head>`:** osvježen `description`/`keywords`/`<title>`; dodan `canonical` + `og:site_name`;
  `og:url`/`twitter` → `https://www.sokratstudy.com/`; `og:image` → `/icon-512.png` (bilo zastarjelo: vercel.app + samo 3 predmeta).
- Bump `?v=20260605` (landing.css, styles.css, navigation.js, init.js) za landing rebuild.
- Lazy loading: `responsive.spec.js` i `smoke.spec.js` prilagođeni async `initStudyPage`
  (čekaju da je sadržaj učitan/renderiran prije provjere, umjesto fiksnog delaya).
- Bump `?v=20260605`: novi `js/content-loader.js` + `css/pages.css` (loader overlay).
- Landing: CTA "Start Studying" sada vodi na **browse drill-down** (umjesto slide-in sidebara;
  sidebar ostaje kao bezopasan legacy fallback). Back s Lessons vraća na popis predmeta (čuva drill-down poziciju).
- Landing: broj predmeta sada dinamičan iz catalog-a (`renderLandingMeta()` + `data-meta="subjectCount"`);
  osvježen copy (Year 1 & 2). Vizualni smjer: **"čisto i bogato"** (ne preminimalistički) — vidi ADR-007.
- `renderLessonsPage()` — coming-soon sada iz catalog-a (`isLessonComingSoon`) umjesto hardkodiranog `second-midterm`.
- Bump `?v=20260604` za izmijenjene datoteke (catalog.js, navigation.js, init.js, variables.css, styles.css + novi browse.css).
- Sidebar predmeta sada se renderira iz `data/catalog.js` (`renderSubjectsSidebar()`
  u `js/navigation.js`, pozvan iz `js/init.js`). Uklonjen ručno pisani `.subject-item`
  HTML iz `index.html`. Dodan `iconGradient` u catalog (vizualna parnost). Dodavanje
  predmeta sada = samo unos u catalog. (M0/A3; test: `tests/sidebar.spec.js`.)
- Bumpani svi `?v=` tokeni skripti/CSS-a u `index.html` na 20260602 (cache).
- Ažuriran root `README.md` — opisuje platformu, predmete (FMTU/Hospitality Mgmt)
  i poveznice na `docs/`.
- `js/config.js` — `subjectDataMap` i `getSubjectData()` sada se izvode iz
  `data/catalog.js` (uklonjeni hardkodirani if-lanci). Ponašanje nepromijenjeno
  (verificirano).
- Svi `data-*.js` sada izlažu svoj objekt na `window` (standardizacija za
  catalog lookup i lazy loading).
- `index.html` — učitava `data/catalog.js` prije `js/config.js`.
### Fixed
- **Globalni footer + toast bez baznog CSS-a → goli blokovi lijevo-dolje (BUG-008):** bazni `.toast`/`.footer`
  stilovi nedostajali (ostali samo responsive override-i) → toast se stalno prikazivao kao „Message", a globalni
  copyright-footer kao goli blok na dnu svake stranice (uz duplikat na Landingu). Dodan bazni `.toast` (fiksan,
  skriven dok `showToast()` ne doda `.show`) i `.footer` (centriran, suptilan) u `css/pages.css`; globalni footer
  skriven na Landing/Browse preko `:has()`. Bump `pages.css`/`styles.css` `?v=20260611`. Suite 36/36.
- **Learn filter-bar rezao čipove na rubovima + skriven scroll (BUG-007):** maknut uzrok lijevog reza
  (`justify-content:center` na skrolabilnom `.learn-filter` @≥1024px — sad `flex-start` preko klase
  `.is-scrollable`, koja se aktivira samo kad bar prelazi širinu). Dodan **vidljiv tanak scrollbar** +
  **rubni gradijent-fade** (`mask-image`, klase `.can-scroll-left/right`) kao naznaka skrola. JS:
  `updateLearnFilterScrollHints()` (`js/progress.js`) vezan na `scroll` + `ResizeObserver`. Globalno
  (svi predmeti). Bump `learn.css`/`progress.js`/`styles.css` `?v=20260610`. Suite 36/36 + desktop 1280px provjera.
- **Learn filter-bar rezao nazive kategorija (BUG-006):** čipovi u learn-baru pokazivali skraćene/
  dvosmislene labele (npr. „The Product" → „The", „Segmentation and Positioning" → „Segmentati").
  Uzrok: `updateLearnFilters()` (`js/progress.js`) skraćivao naziv na prvu riječ / 10 znakova.
  Popravak (Opcija A): prikaz **punog `data.name`** (bar je već `overflow-x:auto` + nowrap → skrola).
  Globalno (svi predmeti). Bump `progress.js?v=20260609`. Suite 36/36, 0 page-overflowa.
- **Landing hero offset (BUG-005):** bedž "Free exam toolkit" više ne pada pod fiksnu nav-traku na
  mobitelu. Uzrok: `responsive.css` (učitava se zadnji) imao mobilni `.landing-hero { padding-top:1.5rem }`
  koji je tiho gazio `landing.css` offset. Uveden `--nav-h` (variables.css) kao jedinstveni izvor; hero
  `padding-top` + `scroll-margin-top` (landing.css + responsive.css) vezani uz nju; logo `white-space:nowrap`
  + slim nav na ≤480px. Regresijski test ("hero badge clears the fixed top nav", 4 profila). Suite 36/36.
  Bump `?v=20260606` (variables.css, landing.css, responsive.css + styles.css token).
- `responsive.css` — dva slomljena CSS pravila (nedovršeni `.quiz-section,
  .fill-section,` selektor i sirotinjski `.topic-*` blok + višak `}`). Zagrade
  sada balansirane (520/520). Vidi BUG-001, BUG-002.
- Learn sekcija (mobilna responzivnost, BUG-003): **riješen horizontalni overflow** —
  `.study-content` (flex-dijete) dobio `min-width:0` + `width:100%` da se ne širi do
  `max-width:1200` na mobitelu; obrambeni `min-width:0` na `#learn`/`.learn-container`/
  `.learn-content`. Plus dedupliciran donji padding i landscape safe-area inset.
  Verificirano Playwrightom (4 iPhone profila × 8 predmeta, 0 overflowa).
- Cache-busting: dodan `?v=20260602` na sve CSS `@import` u `styles.css` (+ bump
  `styles.css?v=` u index.html) — bez toga `immutable` cache servira stari CSS
  nakon deploya (BUG-004).
### Napomena
- Live ponašanje (osim ciljanih CSS popravaka) nepromijenjeno; promjene verificirane
  skriptom + parse-checkom + brace-balance provjerom + Playwright smoke/responsive.

## [2.0.0] — baseline (postojeća live verzija)
### Added
- 8 predmeta, 5 modova učenja (Learn, Flashcards, Quiz, Fill, Progress).
- Blind Map za Tourism Geography.
- Modularizacija app.js u 12 JS modula; modularni accounting podaci.
- PWA, dark tema, lokalno spremanje napretka.
