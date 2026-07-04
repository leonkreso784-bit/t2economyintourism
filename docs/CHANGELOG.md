# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Verzioniranje: [SemVer](https://semver.org/).
Tekuća live verzija je 2.x. Platformska pregradnja (Faza 0+) vodi prema 3.0.0.

## [Unreleased] — rad u tijeku (cilj: 3.0.0)
### Added
- **🧩 FAZA 2 · 2D.2c — auth modal (`#authModal`) migriran na `<sokrat-modal>` (najrizičnija cigla 2D, zadnji ad-hoc overlay) — ✅ DEPLOYANO 2026-07-04 (ff-merge `ba1c6f9..4ed6e75`; live-verified: produkcija servira `js/auth.js?v=20260708` s `createElement('sokrat-modal')`; korisnik potvrdio login/logout na preview-u).**
  `auth.js:injectModal()` gradio ~90 redaka `innerHTML` overlaya (backdrop+close, bez ESC). Sada: `createElement('sokrat-modal')`, maknut zaseban `.auth-modal__backdrop` div
  (backdrop = komponentin overlay) + `wrap.hidden`; kartica bez **dupliranog** `role=dialog`/`aria-modal` (komponenta je jedini dialog), `aria-labelledby` premješten na komponentu;
  `openModal`/`closeModal` → `m.open()`/`m.close()` s fallbackom. **Login/signup/forgot/recovery logika netaknuta.** `css/auth.css`: overlay pravila → `sokrat-modal.auth-modal`
  override (backdrop `rgba(2,6,23,0.72)`+blur(6px) kao prije) + `> *` `max-width:420px` (card cap). **Bonus iz primitiva:** ESC-zatvaranje + scroll-lock + fokus-u-modal + Tab-trap +
  focus-restore (auth ih prije NIJE imao). **Izgled očuvan — potvrđeno screenshotom** (desktop 420px centrirano, mobitel 335px, backdrop/close-X/tabovi/eye-toggle). Novi test u
  `tests/components.spec.js` (open/scroll-lock/ESC/close, skip-ako-CDN) + postojeći `auth.spec.js` zelen. Cache token **`20260708`** (auth.js/auth.css/styles.css/index.html).
  Gate: verify/typecheck/unit 0, **Playwright `components`+`auth`+`a11y` 36/0** (12 a11y-skip po dizajnu).
- **🧩 FAZA 2 · 2D.2b — learn image-viewer migriran na `<sokrat-modal>` (prvi stvarni konzument) — grana `foundation/f2d`; ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`).**
  `#imageModal`: `<div class="image-modal hidden">` → `<sokrat-modal class="image-modal">`. Komponenta preuzima ESC · klik-na-backdrop · `body.modal-open` scroll-lock · fokus;
  `learn.js` sada delegira (`openLearnImageModal` → `modal.open()`; zatvaranje čisti sliku preko **`sokrat-modal:close` eventa**). Maknut zaseban `#imageModalBackdrop` div +
  ručni ESC/backdrop handleri iz learn.js. **Izgled očuvan bajt-isti** (tamni backdrop 0.9, safe-area padding, close X, instant bez fade-a) kroz `sokrat-modal.image-modal`
  override (learn.css se učitava POSLIJE sokrat-modal.css → pobjeđuje u remiju specifičnosti) — **potvrđeno screenshotom, nulta vizualna promjena**. Test u `tests/components.spec.js`
  (open kroz learn API + ESC-close + slika očišćena). Cache token **`20260707`** (learn.js/learn.css/styles.css/index.html). Gate: typecheck/verify/validate/unit 0, **Playwright 157/0**.
- **🧩 FAZA 2 · 2D.2a — reusable modal-primitiv `<sokrat-modal>` (S4) — grana `foundation/f2d`; ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`).**
  Drugi UI-primitiv (nakon toasta). Samostalni **overlay/dialog** (`js/components/sokrat-modal.js` + `css/sokrat-modal.css`, light-DOM):
  API `open()`/`close()`/`toggle()`/`isOpen()` + eventi `sokrat-modal:open`/`:close`. Ponašanje: ESC-zatvara · backdrop-klik-zatvara ·
  `body.modal-open` scroll-lock (reuse) · fokus-u-modal (rAF) + focus-restore + **Tab-trap** · a11y (`role=dialog`/`aria-modal=true`/`aria-hidden`).
  **Nijedan postojeći modal još ne migriran → 0 rizika** (2D.2b = image-viewer, 2D.2c = auth slijede). U typecheck scopeu (`Window.SokratModal`).
  Test `tests/components.spec.js`: stanje (is-open/aria/scroll-lock/ESC/backdrop) gate-ano; fokus-management verificiran ručno/scratch (touch-profili
  ne fokusiraju tapom → ne gate-an, dokumentirano). Cache token **`20260706`** (nova komponenta+CSS, styles.css @import, index.html). Gate: typecheck/verify/validate/unit 0, **Playwright 153/0**.
- **🧩 FAZA 2 · 2D.1 — prvi Web Component `<sokrat-toast>` (S4, UI-primitiv) — grana `foundation/f2d`; ✅ DEPLOYANO 2026-07-04 (`d2b1e48..9b62428`).**
  Prvi custom element na platformi (`js/components/sokrat-toast.js`), dokazuje obrazac (registracija → lifecycle → `.show()`) na najjednostavnijem
  primitivu prije `<sokrat-modal>` (2D.2). **Light-DOM (bez Shadow DOM)** → element zadržava klasu `.toast`, pa svi postojeći CSS-ovi (base +
  responsive) vrijede NEPROMIJENJENO. Show-logika preseljena iz `showToast()` doslovno (isti reflow-restart animacije + 2500 ms auto-hide);
  `showToast()` (js/utils.js) sada **tanki delegat** na komponentu, s **fallbackom** na stari DOM-put ako custom element ne upgrade-a (0 regresije).
  a11y: `role="status"` + `aria-live="polite"` (prije nijemi `<div>`). U typecheck scopeu (`Window.SokratToast`). Test `tests/components.spec.js`
  (registracija + prikaz/tekst/auto-hide, 0 page-error). Cache token **`20260705`** (utils.js + nova komponenta). Gate: verify/typecheck/unit/validate 0, **Playwright 145/0**.
- **🧩 FAZA 2 · 2A DOVRŠENA na 18/18 (accounting → JSON dual-read) — grana `foundation/f2a-accounting`; ✅ DEPLOYANO 2026-07-03 (ff-merge `a8c7b84..d2b1e48`; live-verified: `accountingM1.json` servira 6 kat., puni Playwright 137/0).**
  Accounting bio jedini predmet izvan JSON supstrata (17/18, svjesno odgođen). Migriran **format-only (0 diranja sadržaja)** da F4 (Admin CRUD,
  source-of-truth flip) kreće s uniformne baze — bez specijalnog slučaja. `export:json accounting` → 3 JSON (`accountingM1` 6kat / `accountingM2`
  8kat / `accountingFinal` 15kat; round-trip bez gubitka) + `dataFormat:'json'` u catalog (`data/catalog.js`) + catalog.js cache token
  **`20260702→20260704`**. Vježbe (`accountingExercises`, `generate()` funkcije) i dalje UVIJEK iz `.js` codeScripts (**BUG-012 očuvan**). Novi trajni
  test u `tests/dual-read.spec.js` (accounting: study iz `data/json/accounting/accountingM1.json`, vježbe iz `data/accounting/exercises.js`, 0 page-error).
  **Gate (sve zeleno):** verify 0/0 · validate:schema 54/54 · validate:content 0/0 · export:json --check 0 nesklada · test:unit 69/0 · typecheck 0 ·
  **dual-read.spec 5/5** (uklj. novi accounting). Odluka + otpis kozmetičkog duga (#2/#4): **ADR-015**.
- **🧩 FAZA 2 · 2C.2d (nav grupa → `AppState.nav`) → 2C KOMPLETNA — `2d75dd1`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`). Gate: puni Playwright 133/0.**
  `currentPage/currentSubject/currentLesson/currentData/currentSection/currentCategory` → `AppState.nav.*` kroz **13 datoteka**
  (navigation/progress/quiz/flashcards/fill-blanks/learn/exercises/analytics/storage/auth/cloud-sync/blind-map/init; exercises.js =
  mehanička izmjena, ne „za sadržaj"). **3 `typeof currentX` guarda** (exercises/auth/cloud-sync) prepisana na `typeof AppState` —
  identificirano U IZVIĐANJU (nakon brisanja `let`-ova bi tiho vratili 'undefined' = kod misli da predmeta nema). Novi funkcionalni
  nav-test; spec 16/16. **→ 2C DONE-KRITERIJ ISPUNJEN: config.js bez ijednog mutable globala; SVE runtime stanje u `window.AppState`.**
  Cache `?v=20260703` (svih 13 + config/app-state).
- **🧩 FAZA 2 · 2C.2c + 2C.2e (quiz + session grupe → `AppState.quiz`/`AppState.session`) — `1997014`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`).**
  Quiz: 9 varova (`quizQuestions/currentQuestionIndex/correctAnswers/wrongAnswers/quizStartTime/wrongAnswersList/currentShuffledOptions/
  currentShuffledCorrectIndex/quizAnswers`) → `AppState.quiz.*`; dirano SAMO quiz.js — analytics.js pogoci su **propertyji** `analytics` objekta,
  `'wrongAnswersList'` je i DOM id (nediran). Session: `sessionStartTime` → `AppState.session.startTime` (analytics.js, 4 ref.).
  Funkcionalni quiz-test (točan→kriv→review→rezultati 80%→retry) — app-state spec 12/12. Usput ispravljen zastarjeli opis `quizAnswers`
  (sprema `{selected, isCorrect}`, ne 4 polja). Cache `?v=20260703` (quiz/analytics/config/app-state).
- **🧩 FAZA 2 · 2C.2b (cards grupa → `AppState.cards`) — `9612977`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`).**
  `flashcards/currentCardIndex/knownCards/unknownCards` → `AppState.cards.deck/index/known/unknown`; dirano SAMO `flashcards.js`
  (ostale `flashcards` pojave = propertyji/stringovi/i18n — provjereno čitanjem). Funkcionalni flashcards-test (klik ✓/✗/prev kao korisnik,
  swap unknown→known, `progress.flashcardsLearned`) 8/8 uklj. landscape. Testovi postavljaju cookie-consent `'denied'` unaprijed (banner presretao klikove).
  Gate (zajedno s BUG-016): typecheck 0, unit 41/41, **puni Playwright 125/0** (117 + 8 novih app-state).
### Fixed
- **🐛 BUG-016 (landscape flashcard lice prekriva Known/Unknown gumbe) — `68bf7e1`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`).**
  Na landscape mobitelu lice kartice (raste sa sadržajem, BUG-013 grid-stack) stršalo ~130px ispod kartice jer su `responsive/03`
  (`height:200px` fiksna) i `responsive/04` (`max-height:200px`) ostali kao relikti od prije BUG-013 → tap na ✓/✗ flipao karticu.
  **Našao ga NOVI funkcionalni test** (2C.2b) — render-smoke to ne vidi. Fix CSS-only (`height:auto`, cap maknut) + sweep anti-patterna
  kroz sve css datoteke čist. Cache `styles.css?v=20260703` + importi `03`/`04`. Detalji `docs/BUGS.md` §BUG-016.
- **🧩 FAZA 2 · 2C.1 (S3 AppState — namespace skeleton) — `0a43fc9`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`).**
  `js/app-state.js` → `window.AppState` s grupama **nav/cards/quiz/fill/session** (početne vrijednosti identične config.js `let`-ovima;
  grupa NEAKTIVNA dok se ne migrira → nema dvostrukog izvora istine). JSDoc typedefi + tsconfig include (typecheck raste modul-po-modul, ADR-014) +
  `Window.AppState` u `types/globals.d.ts`. Učitava se PRIJE config.js (`?v=20260703`). NOVI `tests/unit/app-state.test.js` (8 testova čuva oblik
  namespacea; isti-realm load jer vm cross-realm ruši `deepStrictEqual`) u `test:unit` lancu. Gate: typecheck 0, unit 41/41, verify 0/0, smoke 16/16.
- **🧩 FAZA 2 · 2C.2a (fill grupa → `AppState.fill`) — `a08dc3b`; grana `foundation/f2c`; ✅ DEPLOYANO 2026-07-03 (ff-merge `73f3809..f54048a`).**
  `fillQuestions/currentFillIndex/fillCorrect/fillWrong` → `AppState.fill.questions/index/correct/wrong`; `let`-ovi obrisani iz config.js.
  Dirano SAMO `fill-blanks.js` (24 ref.) + `progress.js` (2). **DOM id-jevi `'fillCorrect'`/`'fillWrong'` NEDIRNUTI** (ista imena kao stare varijable —
  migracija čitanjem svakog mjesta, NE regexom). Grep-dokaz 0 golih referenci. NOVI funkcionalni `tests/app-state.spec.js` (fill tijek: točan→kriv→skip→
  Progress 33%; smoke samo renderira, ovaj OCJENJUJE; stanje sad inspektabilno kroz `window.AppState`) 4/4. Cache `?v=20260703`.
  Gate: typecheck 0, unit 41/41, **puni Playwright 117/0** (subjects=18, problems=0, errors=0).
- **🧩 FAZA 2 · 2A.1 (S2 čisti JSON format — JSON Schema ugovor) — `1fc6c19`; ✅ DEPLOYANO 2026-07-02 (`0c21aa6..661dbc8`).**
  `schema/subject-content.schema.json` (JSON Schema draft-07) = kanonski STRUKTURNI ugovor za payload sadržaja (window-var = kategorije lekcije/final).
  `scripts/validate-json-schema.js` (`npm run validate:schema`, `ajv@8` dev-dep) validira payload svake razriješene lekcije preko vm window-shima (izvor-neovisno)
  → **54/54 dokumenta (18 predmeta × 3 lekcije) poštuju schemu.** Izviđanje prije pisanja uključilo stvarna nedokumentirana polja (`quiz.image`/`imageAlt`, `learn.title`, `learn.image=null`).
  Nadopunjuje `validate:content` (semantika); novi CI korak. Bez runtime izmjena → bez cache bumpa. Temelj za 2A.2 exporter + F4 CRUD validaciju.
- **🧩 FAZA 2 · 2A.4b (preostalih 13 predmeta na JSON → 2A GOTOVO 17/18) — `04e09f0`; ✅ DEPLOYANO 2026-07-02.**
  te2, entrepreneurship, ebusiness, econ-hospitality, marketing, geography, food-nutrition, business-informatics, management, traffic, microeconomics, academic-writing, business-informatics-hr → `dataFormat:'json'`.
  **Migrirano 17/18** (accounting svjesno odgođen). 51 JSON datoteka ukupno. Gate: verify 0/0, validate:schema 54/54, export --check 54/54, Playwright 117/0. Cache `?v=20260702`.
- **🧩 FAZA 2 · 2A.4a (migracija kvantitativnih exercise-predmeta na JSON) — `134b7cb`; ✅ DEPLOYANO 2026-07-02.**
  `statistics` + `macroeconomics` + `math` dobili `content.dataFormat:'json'` (9 JSON datoteka). Odabrani jer dijele jedini još netestirani put: study iz JSON + vježbe/lib iz `.js`.
  NOVI `dual-read` exercise-test (statistics: `window.statisticsExercises`+`StatLib` iz `.js`, study `.js` NIJE fetchan) → **BUG-012 očuvan u JSON-modu**. Gate: dual-read 16/16 + puni Playwright 117/0. Cache `?v=20260701` (catalog). **Migrirano 4/18; svi mehanizam-putovi dokazani.**
- **🧩 FAZA 2 · 2A.3 (dual-read JSON + `sit` pilot flip) — `1f46c4c`; ✅ DEPLOYANO 2026-07-02.**
  Loader (`js/content-loader.js`) može čitati study sadržaj iz `data/json/<id>/<var>.json` po catalog-flagu `content.dataFormat:'json'` — grananje **DB → JSON → `.js`**;
  JSON-mod fallback na pune `.js` ako fetch padne (0 regresije); vježbe uvijek iz `.js` (BUG-012). `sit` = prvi migrirani predmet. `verify` čuvar #7 (flag bez datoteka = fail).
  **Provjere:** `tests/dual-read.spec.js` 12/12 (JSON put · **shadow-ekvivalencija bajt-u-bajt** · fallback) + puni Playwright 113/0 (subjects=18). Cache `?v=20260700` (catalog+loader).
- **🧩 FAZA 2 · 2A.2 (JSON exporter + pilot) — `55feb5f`; ✅ DEPLOYANO 2026-07-02.**
  `scripts/export-content-json.js` (`npm run export:json [id] [--check]`) → `data/json/<id>/<var>.json` (uniforman put, zrcali DB model 1 red=1 var).
  **Round-trip SVIH 54 payloada bez gubitka**; pilot `sit` (3 datoteke) nezavisno ajv-validiran + SHA1 bajt-identičan (deterministički). `.gitattributes` `data/json/**/*.json eol=lf`;
  novi CI drift-gate `export:json --check`. Vježbe se ne exportaju (BUG-012). Ništa još ne čita `.json` (to je 2A.3) → 0 runtime rizika, bez cache bumpa.
- **🧩 FAZA 2 (reusable jezgra) — 2B + 2E ✅ DEPLOYANO NA PRODUKCIJU (2026-07-01; ff-merge `164dc11..57f449a`, uz izričito odobrenje; CI zelen; live potvrđeno).**
  Revidirani redoslijed (dogovoreno, utemeljeno u kodu): **S1 Repo prije S2 JSON + Sentry ranije.**
  **ContentRepository (S1):** novi `js/content-repo.js` → `window.SokratContent` (`listSubjects`/`getSubject`/`isLessonComingSoon`/`loadLesson`/`isLoaded`) —
  tanki šav koji objedinjuje 3 razbacana puta dohvata (catalog metapodaci + `loadSubjectContent` + `getSubjectData`); **nula promjene ponašanja**
  (DB↔datoteka fallback ostaje u loaderu). `navigation.js:initStudyPage` → `await SokratContent.loadLesson(...)` (fallback na stari dvokorak).
  Test `tests/content-repo.spec.js` (ekvivalencija — identična referenca).
  **Sentry error-monitoring (2E):** novi `js/monitoring.js` → `window.SokratMonitor` (`captureException`/`enable`/`disable`/`status`); globalni
  `error`+`unhandledrejection` hvatači; **consent-gated** (`consent.js applyConsent`→`enable/disable`, isti gate kao GA); **Sentry Loader Script**
  `js-de.sentry-cdn.com` (EU/DE regija; ključ javan kao GA ID; bez fiksne verzije→bez 404); `sendDefaultPii:false`; release `sokrat-study@20260699`;
  dashboard sveden na **samo hvatanje grešaka** (Tracing/Session-Replay/Logs isključeni). Živa provjera: obje test-greške stigle na dashboard (Users:0).
  Test `tests/monitoring.spec.js` (loader stubban preko `page.route`, offline). Cache `?v=20260699`. Playwright 101 pass / 0 fail (subjects=18).
- **🧱 FAZA 1 — reliability rails ✅ GOTOVA + GITHUB-ZELENA + ✅ DEPLOYANA NA PRODUKCIJU (2026-06-30; ff-merge `c874627..69ce466`, uz izričito odobrenje; live potvrđeno: landing-stats=5700, tokeni `?v=20260698`).**
  Platforma-first temelj (FOUNDATION_PLAN). **CI/CD** (`.github/workflows/ci.yml`, GitHub Actions, 2 joba): `build` =
  npm ci→`validate:content`→`verify`→`test:unit`→`typecheck`→`test:rls`→Playwright; `lighthouse` = budžeti. TVRDI gate (crveno=ne u `main`).
  **Type-check bez build-a** (`tsconfig.json` strict, `include` scoped; `types/globals.d.ts`; pilot `js/i18n.js`; `npm run typecheck`; `typescript` devDep).
  **TVRDI gateovi:** `tests/a11y.spec.js` (axe-core, 0 serious — popravljen `.sidebar-content` `tabindex`), `tests/layout-guard.spec.js`
  (deterministička geometrija, 13 širina × {EN,HR} = BUG-015 zaštita), **Lighthouse** (`.lighthouserc.json`, kalibriran: a11y/bp/seo ≥0.95 + CLS≤0.1 + TBT≤400ms, perf ≥0.5 floor).
  **RLS sigurnosni test** (`scripts/rls-check.js`, read-only: anon čita `subject_content`, ne vidi `progress`). **`package-lock.json` sad verzioniran** (`npm ci`).
### Changed
- **Hardening v1 (F1 1C):** `vercel.json` (maknut `X-XSS-Protection`; +`Referrer-Policy`/`Permissions-Policy`); `loadProgress` schema-merge+try/catch
  (`js/storage.js`, otpornost na pokvaren/stari localStorage); mrtav `lessonCategoryMap`→`{}`; hero „400+" → **dinamičan `questionCount`**
  (`scripts/compute-stats.js`→`data/landing-stats.js`, stvarno 5721 → „5,700+"); „Works offline" → pošteno „No install needed"/„Bez instalacije"
  (+ meta-opisi „works on any device"). Cache `?v=20260698` (svi izmijenjeni js, uklj. naknadno bumpane chrome-fajlove auth/profile/analytics/cloud-sync).
- **HRV program „Menadžment u Hotelijerstvu" — cigle 1–5c ✅ LIVE 2026-06-28 (`320d413..4b795c8`).** Paralelni hrvatski program
  (klon, ADR-012): `hospitality-management-hr` + **pilot `business-informatics-hr`** („Poslovna informatika", 11 kat/86fc, strukturno
  identično EN-u). Alat **`scripts/translate-subject.js`** (Sonnet tool_use; slot-pristup + salvage-parser; čuva quiz-indeks/`_______`/
  KaTeX/HTML). **UI i18n** (`js/i18n.js`, ~160 ključeva) + **globalni 🌐 HR/EN toggle** (`localStorage`, master nad programom) preveo cijeli
  glavni tok: study UI + landing + browse (hrvatska gramatika: ordinali/množina). EN dict = originali → **EN bajt-identičan**. Cache do `20260696`.
  Test `tests/i18n.spec.js`. Detalji: `docs/HRV_PLAN.md`.
### Changed
- **LOGO redizajn — `logo.png` (raster) → `assets/logo.svg` (vektor) ✅ LIVE 2026-06-28 (`19f07db`).**
  Postojeći Sokrat **vektoriziran s zaglađivanjem**: ImageMagick (4× upscale → threshold → maska koja makne originalni medaljon-prsten i
  ramena, ostaje samo glava) → **potrace** (`alphaMax 1.3`/`optTolerance 1.6` = glatke krivulje) → **auto-fit** (bbox glave + scale/translate
  da **cijela glava ispuni krug**, ništa odrezano). Indigo brend-gradijent `#6366f1→#818cf8`, bijelo lice s indigo detaljima, glava ispunjava
  krug (bez prstena koji viri). **Maknut crop-hak** `.logo-image` (`150%`/`object-fit:cover` → `100%`/`contain`). Logo ožičen na 5 mjesta u
  `index.html` + 4 legal stranice. **Favikoni regenerirani iz SVG-a** (16/32/`.ico`/apple-180/192/512; PWA/iOS na `#0f172a`) + **SVG favicon**.
  Stari `logo.png`/`logo-small.png` obrisani. Cache `?v=20260693` (svg + favikoni; CSS ostao `20260692`). Iteracija: odbačeni ručno-crtani
  SVG-ovi (izgledali skicirano/„kao pingvin") — kvaliteta iz vektorizacije originala. Gate: verify 0/0, Playwright **68/68**, vizualni nav-pregled OK.
### Fixed
- **BUG-015 — Landing nav prepuni na mobitelu nakon dodavanja 🌐 toggle-a (CTA „Start studyin" rezan) ✅ RIJEŠEN + LIVE (2026-06-28, `ac68ab0`).**
  🌐 prekidač dodao ~75px u tijesan fiksni nav; `.cta-button{width:100%}` (≤767px, za hero) + `flex-shrink:1` je rezao CTA-tekst
  umjesto da gura višak. Fix CSS-only: `.nav-cta{flex-shrink:0; white-space:nowrap; width:auto}` + brand-wordmark `display:none`
  ≤1060px (brand=ikona, oslobađa ~125px da anchor-linkovi ostanu) + anchor-linkovi skriveni ≤860px (bilo ≤720) + `nowrap`
  + `.lessons-title{min-width:0}`. Playwright sweep 320→1440px × {EN,HR} = 0 overflowa/0 rezanja; gate verify 0/0, test:responsive 76/76.
  Cache `?v=20260697` (`styles.css`+`landing.css`+`pages.css`). Datoteke: `css/landing.css`, `css/pages.css`.
- **BUG-014 — Fill-in: prazan odgovor + „Provjeri" ispada „Correct!" ✅ RIJEŠEN + LIVE (2026-06-27, `7c70e07`).**
  `correct.includes(input)` je za `input===''` uvijek `true` (svaki string sadrži prazan). Fix (`js/fill-blanks.js`):
  `input.length>0 && normFill(input)===normFill(correct)` — prazno nikad točno, substring-uvjet uklonjen, case+razmak↔crtica
  tolerancija zadržana. Node-test 9/9. Cache `fill-blanks.js?v=20260691`.
- **BUG-013 — flashcard: dug tekst na okrenutoj kartici prekrije strelicu „dalje" ✅ RIJEŠEN + LIVE (2026-06-28, `213b067`).**
  `position:absolute` strane nisu rastezale `.flashcard-inner` + fiksni `height` po breakpointu. Fix CSS-only: grid-stack
  (`.flashcard-inner{display:grid}`, strane `grid-area:1/1; position:relative`) + svi fiksni `height` na `.flashcard`→`min-height`. Cache `20260694`.
- **BUG-012 — randomizirane vježbe se lome kad sadržaj dolazi iz Supabasea ✅ RIJEŠEN + LIVE (2026-06-27, `7176194..801d9a6`).**
  Vježbe (`data/<subj>/exercises.js`) imaju `generate(p)` funkcije koje `JSON.stringify` izbriše pri migraciji, a loader je u
  DB-modu preskakao SVE `content.scripts` → randomizirane vježbe razbijene iz baze (Statistics 23 / Macro 25 / Accounting 8).
  Fix (Opcija A): catalog **`content.codeScripts`** (vježbe+lib = KOD, uvijek iz datoteke) + `js/content-loader.js`
  (`filesToLoad = fromDb ? codeScripts : scripts`) + `scripts/migrate-content.js` više ne šalje vježbe + `scripts/verify-catalog.js`
  čuvar (predmet s vježbama MORA imati codeScripts). Baza očišćena (4 reda vježbi) + Math gradivo migrirano → **51 redova / 17 predmeta /
  0 redova vježbi**. Cache `20260690`. **Pravilo: read-path iz baze nosi SAMO čisto-podatkovne varove (M1/M2/Final); vježbe iz datoteke.**
  Vidi `docs/BUGS.md` §BUG-012 + `docs/EXERCISES_DB_FIX_PLAN.md`.
### Added
- **Mathematics — NOVI predmet (1. god, sem 1), KaTeX — K1+K2+Final ✅ LIVE (deployano 2026-06-27 `89fd669..31be03f`; commiti `b481be5`+`c49422a`+`4eeccf1`+`31be03f`)** — zadnji 1.god predmet iz
  deckova 1–6,8,9,11. **K1 = teme 1–5** (`mathM1`, 5 kat: realNumbers/basicEquations/functions/differentiation/extrema) · **K2 = teme 6–11**
  (`mathM2`, 4 kat: integralElasticity/annuities/loans/gaussJordan) · **finalni** hibrid + examPractice (**10 kat / 79 fc / 79 quiz / 64 fill**).
  **39 interaktivnih vježbi** (26 K1 + 13 K2) + `math-lib.js` — 28 randomiziranih brute-force verificirano (72.173 checka, 0 problema); financijske
  formule točne do centa vs slajdovi. Catalog `math` (`fa-square-root-variable`/violet `#8b5cf6`), `features.exercises:true`. Cache `20260689`.
  **✅ DOPUNA (`4eeccf1`, 2026-06-27):** K1 learn obogaćen — svih 5 sekcija na K2 dubinu (realNumbers 4798 / basicEquations 3907 / functions 4197 /
  differentiation 3520 / extrema 3184 zn) · Gauss-vs-Gauss-Jordan nijansa u `gaussJordan` (+2 fc/+3 quiz/+3 fill + learn-podsekcija; pravilo „samo redovi";
  naziv kat. → „Gauss & Gauss-Jordan Method"). Gate: KaTeX balans OK, validate/verify 0/0, test:unit 33/33, Playwright 68/68. **✅ Korisnik pregledao formule + DEPLOYANO 2026-06-27 (`31be03f`) → cijeli Math LIVE, 1. god HM 9/9.**
### Changed
- **Exercises engine renderira KaTeX (js/exercises.js, 2026-06-26)** — dodani 4 čuvana `renderMath()` poziva nakon mounta (list, otvaranje vježbe,
  mode-switch/new-numbers, feedback) → kvantitativne vježbe prikazuju formule kao LaTeX umjesto sirovog `\(...\)`. **Currency-safe** (jedan `$` netaknut)
  i **no-op za tekstualne predmete** (verificirano: Statistics/Accounting vježbe nepromijenjene). Aditivna prezentacijska ekstenzija — 0 promjena tipova vježbi.
### Added (nastavak)
- **Traffic in Tourism — NOVI predmet (1. god, sem 2)** — ručno iz 8 PDF predavanja (prof. Nataša Kovačić; udžbenik Mrnjavac, *Promet u turizmu*) + EU izvori
  (Sustainable & Smart Mobility Strategy, Key figures on European transport 2024, CO2/road-safety izvještaji). K1/K2 granica **autoritativna iz silabusa (DINP):
  1. kolokvij = tjedan 7 → K1 = tjedni 1–6, K2 = tjedni 7–15.** **K1** (`trafficM1`, 6 kat: theoreticalBasis/interdependence/mobilityPatterns/road-connector/
  road-product/rail-connector) · **K2** (`trafficM2`, 7 kat: rail-product+funicular/air/water/value&quality/safety/ecology/future) · **finalni** hibrid + examPractice.
  **27 kat / 189 fc / 186 quiz / 188 fill.** Kvalitativan predmet (bez KaTeX/vježbi). Catalog: subject `traffic` (`fa-route`/amber `#f59e0b`). Cache `20260685`.
  Gate: validate 0/0, verify 0/0, **Playwright 68/68** (subjects=16). **✅ LIVE — deployano 2026-06-25 (`62a4119`); Supabase re-sync 3/3.** *(INTRO.pdf = administrativan → tjedni 1–2 + value&quality autorski iz silabusa; EU izvještaji = izvor činjenica, ne zasebne teme.)*
- **Academic Writing — NOVI predmet (1. god, sem 1), prvi izgrađen kroz GENERATOR** (`c34d88a`+`73bca5e`): 13 PDF predavanja (prof. Bogdan) → 12 tema,
  **24 kat / 336 fc / 286 quiz / 240 fill** (K1 tjedni 1–6 / K2 8–14 / finalni hibrid; Chicago Manual of Style citiranje = težište). + **15 citation-vježbi
  (86 items)** na NEDIRNUTOM enginu (`data/academic-writing/exercises.js`, korisnikov zahtjev). Cache `20260681`. Gate: validate/verify/test:unit/Playwright 68/68.
- **Blok B — read-path: sadržaj iz Supabasea** (`077d375` + aktivacija): tablica `public.subject_content` (public-read RLS) + `scripts/migrate-content.js`
  (vm-shim → REST upsert; 49 redova/15 predmeta) + `js/content-loader.js` (`CONTENT_FROM_SUPABASE` flag + `_loadSubjectFromSupabase()`). Sadržaj se čita iz
  baze **direktno anon keyem** (javan, bez `/api`), s **fallbackom na datoteke**; datoteke ostaju izvor istine (baza=zrcalo). AKTIVNO lokalno (Playwright 68/68 iz baze).
### Changed / Fixed
- **Generator očvrsnut nakon prvog pilota** (`48f38da`): `generate-subject.js` prešao na **Anthropic `tool_use` structured output** (API jamči valjan objekt →
  nestaje cijela klasa „unescaped quote → nevaljan JSON" padova na sadržaju prepunom navodnika); `coerce()` za `learn` vraćen kao string; **retry do 3×** kad
  `learn.content` dođe prazan; eksplicitan `process.exit` (Windows libuv/undici teardown); raw-dump padova u `tmp/`. `assemble-subject.js`: hyphen-ključevi
  (`first-midterm`) ostaju citirani u ispisanom catalog-unosu (regex skida navodnike samo s valjanih JS identifikatora).
### Added (ranije)
- **GENERATOR PREDMETA (jezgra, bricks 1–4)** — pipeline za dodavanje predmeta uz minimalan Opus-usage (plan `docs/CONTENT_GENERATOR.md`):
  `scripts/validate-content.js` (`npm run validate:content` — schema + quiz indeks + KaTeX currency-safe; 14 predmeta 0/0) ·
  `scripts/build-topics.js` (PDF/TXT materijali → `tmp/<id>/topics.json`, jedan fajl=jedna tema, kolokvij iz podmape) ·
  `scripts/generate-subject.js` (**Anthropic Sonnet preko `.env` ključa**, strogi schema-prompt + few-shot → `draft.json`; max_tokens 16000,
  temp 0.3, truncation-detekcija) · `scripts/assemble-subject.js` (`draft.json` → `data/<id>/*.js` preko JSON.stringify=escaping bajt-točan;
  ISPISuje catalog unos, ne dira `catalog.js`). `.env.example` + `tmp/` gitignored. Gate: validate:content→verify→Playwright→Opus spot-check.
  Dev-tooling — ne učitava se u browseru (bez cache bumpa). **Odluka: generator-prvo → pa Blok B (sadržaj→Supabase+/api).**
- **Macroeconomics — interaktivne EXERCISES (Track B, B1–B12 ✅ 100% KOMPLETNO):** na postojećem reusable enginu (`js/exercises-core.js`+`js/exercises.js`,
  NEDIRNUT — 0 novih datoteka u `js/`). Sve u `data/macroeconomics/exercises.js`; makro NE treba biblioteku (sva matematika inline u
  `generate()`). **~81 vježbi:** first-midterm KOMPLETAN (B1 fundamentals/unemployment · B2 GDP · B3 national accounts · B4 goods market &
  multiplier · B5 financial markets · B6 IS-LM, 41 vj) + second-midterm KOMPLETAN (B7 labour market/natural rate · B8 AS-AD · B9 long-run growth ·
  B10 expectations · **B11 open-economy goods market** (otvoreni mult. `1/(1−β(1−t)+m)`, `NX=X−IM`, demand for domestic goods) ·
  **B12 balance of payments** (travel balance `income−expenditure`, current account, financiranje CA deficita, `K=f(r)`)). Tipovi
  choice/numeric/ratio + randomizacija (`params`+`generate`, čita `p.pair.*`). Tol-politika: stope % 1dp/0.1, cijeli 0,
  multiplikator 2dp/0.05, output/PV 1dp/0.5. Kvalitativne teme (IS-LM, AS-AD) = choice-based, vjerno gradivu. **Svaka cigla verificirana node
  brute-forceom** (neovisni preračun drugom formulom/identitetom + grade-correct kroz cijeli prostor params + diskriminacija + NaN-provjera).
  Final lekcija → Exercises prazan (tagano na kolokvije). Cache `?v=20260679`. verify 0/0, Playwright 68/68. **B1–B10 LIVE; B11+B12 čekaju push.**
- **Macroeconomics premješten na year 1, semestar 2** (catalog, korisnikov zahtjev) + **Learn sekcije obogaćene** (svih 13 tematskih, udžbenički stil).
- **Macroeconomics 100% KOMPLETAN (K1 + K2 + finalni hibrid) — treći kvantitativni predmet (KaTeX):** novi subject `macroeconomics`
  (year 1, **sem 2**, `fa-chart-area`/amber). Iz 19 lecture PDF-ova (Blanchard-stil). **K1/K2 granica autoritativna iz službenih test-prep
  deckova:** K1 = Intro + L2–L5 (kratki rok: fundamentals, unemployment&inflation, GDP, national accounts, goods market & multiplier,
  financial markets, IS-LM — **7 kat / 64 fc / 63 quiz / 56 fill**); K2 = Ch6 onward (labour market & natural rate, AS-AD, long-run growth,
  expectations, open economy + balance of payments — **6 kat / 55 fc / 52 quiz / 47 fill**). Finalni `macroeconomicsFinal` =
  `Object.assign(M1,M2,{examPractice})` → **14 kat / 131 fc / 127 quiz / 112 fill**. KaTeX currency-safe (inline 248/248 + display 40/40).
  Riješeni primjeri cross-checkani protiv test-prep brojeva (multiplikator 3.57→2.5, Y=5000, i≈6.7%, uₙ=4.8%). **Šav za vježbe ožičen
  (prazan pack + `features.exercises:true`)** — engine NEDIRNUT, Track B vježbe = kasniji blok. **Learn sekcije obogaćene (svih 13 tematskih,
  udžbenički stil 3–4× opširnije: motivacija/intuicija/interpretacija/zamke), na korisnikov zahtjev.** Cache `?v=20260666`. verify 0/0, Playwright 68/68 (subjects=14).
- **Statistics — Learn teorija obogaćena (Track A) + interaktivne EXERCISES (Track B, T1–T9):** na postojećem reusable enginu
  (`js/exercises-core.js`+`js/exercises.js`, NEDIRNUT). **Track A:** svih 10 Learn sekcija dobile pravu teoriju (def/intuicija/
  interpretacija/zamke + warning-boxovi), KaTeX currency-safe. **Track B:** novi content pack `data/statistics/exercises.js`
  (`window.statisticsExercises`) + content-layer matematika `data/statistics/stat-lib.js` (`window.StatLib`: normalCdf/normalSf/
  normalBetween, z/t kritične tablice, combinations) — oba lazy preko `content.scripts`, **0 novih datoteka u `js/`**. **56 vježbi:**
  35 first-midterm (T1 grafovi · T2 deskriptiva · T3 vjerojatnost · T4 diskretne RV · T5 normalna · T6 sampling) + 21 second-midterm
  (T7 CI · T8 hipoteze · T9 regresija). Tipovi: choice (TF/MC) / numeric / ratio, s randomizacijom (`params`+`generate`). Tol-politika:
  vjerojatnosti 2dp/0.01, deskriptivni brojevi 1–2dp/0.05, cijeli 0. Svaka cigla verificirana node brute-forceom (neovisni preračun +
  grade-correct + diskriminacija kroz cijeli prostor parametara) + z/t-tablica cross-check. catalog `features.exercises:true`. Final
  lekcija → Exercises prazan (sve tagano na kolokvije; dosljedno sem-2 predmetima). Cache `?v=20260664`. verify 0/0, test:unit 33/33
  (+ stat-parse + stat-lib), Playwright 68/68.
- **Statistics 100% KOMPLETAN (K1 + K2 + finalni hibrid) — drugi kvantitativni predmet (KaTeX):** novi subject `statistics`
  (year 1, sem 2). `data/statistics/midterm-1.js` (`statisticsM1`, **6 kat / 61 fc / 60 quiz / 48 fill** — T1–T6: describing data
  graphical & numerical, probability, discrete & continuous random variables, sampling distributions) + `midterm-2.js` (`statisticsM2`,
  **3 kat / 35 fc / 30 quiz / 24 fill** — T7–T9: confidence intervals, hypothesis testing, regression) + `final.js` (`statisticsFinal`
  = `Object.assign(M1,M2,{examPractice})`, ZADNJI → **10 kat / 108 fc / 102 quiz / 80 fill**). K1/K2 granica iz službenih
  midterm-materijala. KaTeX currency-safe. Cache `?v=20260650`. verify 0/0, Playwright 68/68 (subjects=13).
- **Microeconomics 100% KOMPLETAN (K1 + K2 + finalni hibrid) — prvi kvantitativni predmet (KaTeX):** dodani
  `data/microeconomics/midterm-2.js` (`microeconomicsM2`, **7 kat / 75 fc / 70 quiz / 56 fill** — Ch 8,9,10,12,13,14,18:
  profit max & competitive supply, competitive markets, monopoly & monopsony, monopolistic competition & oligopoly, game
  theory, factor inputs, externalities & public goods) + `final.js` (`microeconomicsFinal` = `Object.assign(M1,M2,{examPractice})`,
  učitava se ZADNJI → **15 kat / 164 fc / 148 quiz / 118 fill**). `examPractice` = cross-topic „optimiziraj na margini" sinteza
  s KaTeX `aligned` master-popisom (MR=MC, MRS=Px/Py, MRTS=w/r, MRP=w, MSC=MSB). Catalog: sve 3 lekcije mapirane. KaTeX
  currency-safe (single `$` nije delimiter). Cache `?v=20260649` (batch 20260648→49). verify 0/0, Playwright 68/68.
### Fixed
- **Exercises — Practice ≠ Exam (BUG-011, review-nalaz):** modovi su izgledali isto. Sad `checkOpen`/`renderFeedback` primaju
  `currentMode`: **Exam** na „Check" preskače markiranje (`widget.mark`) i prikazuje **samo rezultat** („Score: X / Y (Z%)"),
  bez po-stavci zeleno/crveno i bez otkrivanja točnih; hintovi i dalje skriveni. **Practice** = puna povratna info + hintovi.
  Dodan **opis aktivnog moda** ispod mode-bara (`MODE_DESC` → `.ex-mode-desc`) da je razlika odmah vidljiva. Engine ostao generički.
- **Exercises — lista po poglavlju + demoi maknuti (BUG-010, review-nalaz):** `renderList` sad **sortira po poglavlju**
  + dodaje **naslove „Chapter N"** (`.ex-list-head`); kartica više ne nosi „Ch N" tag. **Maknuto 7 demo-vježbi** iz FAZE 1/2
  (uklj. 2 K2 demoa koji su virili u K1) → `data/accounting/exercises.js` sad **16 vježbi, čisti K1 (Ch1–6)**; zadržan
  `k1-statement-bs-1`. Unit test (`exercises-core.test.js`) prebačen na **inline fixture** (engine-svojstvo, ne ovisi o sadržaju).
  verify 0/0, node 95/95 + 13/13, Playwright 36/36 + ciljani 3/3. Cache `?v=20260631`.
- **Exercises `statement` tip — prikaz izvornih podataka (review-fix):** „build the statement" vježbe (Build the Balance Sheet,
  Build the Income Statement) prikazivale su **samo prazna polja** — izvorni saldi (iz kojih se izvještaj gradi) nisu se nigdje
  vidjeli, pa se vježba nije mogla riješiti kako je zamišljeno. `statement` widget sad renderira **givens tablicu** kad vježba ima
  `givens` (isti mehanizam kao `ratio` tip; izdvojen zajednički helper `givensTableHtml`). Dodani izvorni saldi: `k1-statement-bs-1`
  (6 računa) i `k1-ch3-income-statement` (17 računa „Annie’s"). Mala, generička, unatrag-kompatibilna engine dopuna (bez `givens`
  ponašanje nepromijenjeno). verify 0/0, node 95/95 + 13/13, Playwright 36/36 + ciljani 3/3. Cache `?v=20260630`.
### Added
- **Microeconomics — 1. kolokvij KOMPLETAN (prvi kvantitativni predmet, KaTeX)** (2026-06-14): novi subject `microeconomics`
  (year 1, **sem 1**, `fa-chart-line`/sky `#0ea5e9`) iz Pindyck & Rubinfeld 9e + DINP silabus. **K1/K2 granica autoritativna iz
  službenog rasporeda predavanja: K1 = Ch 1–7, K2 = Ch 8,9,10,12,13,14,18.** Krenulo kao pilot (1 kategorija), korisnik potvrdio
  KaTeX → dovršen cijeli K1: `data/microeconomics/midterm-1.js` (`microeconomicsM1`), **7 kategorija / 77 fc / 66 quiz / 54 fill**
  (preliminaries, supplyAndDemand, consumerBehavior, individualMarketDemand, uncertainty, production, costOfProduction) — `learn`
  s KaTeX formulama (elastičnost, MRS, budget line, E(X)/varijanca, AP/MP, MRTS, TC/MC/ATC) + 3 riješena primjera. **Catalog: samo
  `first-midterm` mapiran**; K2/final coming-soon dok se ne dovrše. `CONTENT_VERSION` `20260648`. `.gitignore` += `tmp-micro/`.
  Playwright per-test timeout 60s→120s (suite mete 12 predmeta + fullPage screenshoti KaTeX-bogatih stranica). verify 0/0,
  node 0, responsive potvrdio `microeconomics ✓ ok` (docScrollW=deviceW → 0 horizontalnog overflowa).
- **KaTeX cigla (ADR-009) — formula rendering za kvantitativne predmete** (2026-06-14, infrastruktura prije
  Microeconomicsa): novi `js/math.js` (`renderMath(container)` = KaTeX auto-render, tihi no-op ako CDN padne) +
  KaTeX CDN (`0.16.9`, cdnjs, `defer`) u `<head>` + `css/math.css` (dark + mobilni overflow). `renderMath` se zove
  na kraju sva četiri renderera (learn/flashcards/quiz/fill). **Delimiteri currency-safe: inline `\( \)`, blok
  `\[ \]` / `$$ $$`; jedan `$` se NE koristi** (postojećih 123 valutnih `$NN` ostaje doslovno — inače bi KaTeX
  pokvario live sadržaj). Konvencija autorstva: `docs/CONTENT_SCHEMA.md`. Cache `?v=20260648` (math.js + learn/
  flashcards/quiz/fill + styles.css). Test `tests/katex.spec.js` 4/4 (render + currency-safety), verify 0/0.
- **Management — novi predmet 1. godine** (2026-06-14, 3. predmet 1. god, zadnji čisto tekstualni): iz 11 PDF predavanja
  (Lussier *Management Fundamentals* 9e; INTRO + TU2–TU11). K1 (`data/management/midterm-1.js`, `managementM1`, 6 kat:
  foundations/decisionMaking/strategicPlanning/organizing/teamwork/humanResources) + K2 (`midterm-2.js`, `managementM2`,
  4 kat: organizationalBehavior/motivation/leadership/controlSystems) + finalni hibrid (`final.js`, `managementFinal`,
  `Object.assign` + examPractice). **Ukupno 11 kat / 89 fc / 84 quiz / 55 fill.** Catalog: novi subject `management`
  (year 1, sem 2, `fa-user-tie`/indigo). **K1/K2 granica iz strukture udžbenika** (Part I–III vs IV–V; rez Organizing↔Leading).
  Teme 2/3/6/13/15 nemaju zaseban deck → neobrađene. `CONTENT_VERSION` `20260647`. verify 0/0, node sanity 0, Playwright 64/64.
- **Special Interest Tourism (SIT) — novi predmet 1. godine** (2026-06-14, prvi nakon Business Informaticsa): iz 12 PDF
  predavanja + DINP silabus. K1 (`data/sit/midterm-1.js`, `sitM1`, 6 kat: intro/destination/massToSit/business/cultural/
  industrial) + K2 (`midterm-2.js`, `sitM2`, 6 kat: nautical/sports/luxury/dark/health/film) + finalni hibrid
  (`final.js`, `sitFinal`, `Object.assign` + examPractice). **Ukupno 13 kat / 94 fc / 83 quiz / 65 fill.** Catalog: novi
  subject `sit` (year 1, sem 2). **⚠️ Nautical slajd slikovni → kategorija iz općeg znanja (označena, treba verifikaciju);
  Event + Outdoor/Wildlife nepokriveni (nema materijala).** `CONTENT_VERSION` `20260646`. verify 0/0, validator 0, Playwright.
- **Google Analytics (GA4) + GDPR cookie-consent (Consent Mode v2):** novi `js/consent.js` + `css/consent.css`.
  Google Consent Mode v2 default **denied**; cookie banner (Accept/Reject); **gtag.js (`G-ME0V58NJ1Z`, `anonymize_ip`)
  učita se TEK nakon pristanka**; izbor u `localStorage`; „Cookie settings" link u svim footerima → `openCookieSettings()`.
  Consent blok u `<head>` svih 5 stranica (index + privacy/terms/faq/contact). `privacy.html` sekcija 5 prepisana
  (analitika uz pristanak, IP-anonimizacija, pravna osnova = consent). Cache `?v=20260646`.
- **Entrepreneurship restrukturiran na K1/K2/finalni + obogaćen iz 11 PDF predavanja → 2. GODINA 100% KOMPLETNA:**
  stari `data-entrepreneurship.js` (11 kat/92 fc) verificiran protiv predavanja — **točan ali tanak** (3 tjedna
  potpuno nepokrivena) → **split skriptom** (ključevi kategorija i storageKey nedirnuti → napredak očuvan) +
  **4 NOVE kategorije + ~95 fc**. `data/entrepreneurship/midterm-1.js` (`entrepreneurshipM1`, **Weeks 2–7**, 7 kat:
  history/psychology/**creativity NOVA**/innovation/**financing NOVA**/**franchising NOVA**/planning; 91 fc) +
  `midterm-2.js` (`entrepreneurshipM2`, **Weeks 9–13**, 7 kat: failure/economy/tourism/social/value/trends/
  **developing NOVA**; 78 fc). **Ispravci sadržaja:** kartica „entrepreneurship = linearni proces" sada uključuje
  W3 kritiku (proces je complex/chaotic, NE linearan); uklonjeni dupli influencer/push-pull iz `tourism` (žive u
  `trends`). **Finalni** = `final.js` (`entrepreneurshipFinal`, hibrid `Object.assign` + examPractice;
  **15 kat / 175 fc / 134 quiz / 80 fill** — najveći predmet na platformi). Catalog 3 lekcije + resolve; stari root
  fajl obrisan (stare lekcije `second-exam-prep`/`final-exam-prep` → `first-midterm`/`second-midterm`/`final`).
  `CONTENT_VERSION` → `20260645`. verify 0/0, strukturni validator 0, Playwright. → **sem-1 = 4/4, cijela 2. god = 8/8.**
- **E-Business restrukturiran na K1/K2/finalni + obogaćen iz 14 PDF predavanja:** stari `data-ebusiness.js` (14 kat/129 fc)
  verificiran protiv predavanja — **vjeran** (1 ispravak: SEO ima ČETIRI potkategorije, ne tri) → **split skriptom**
  (ključevi kategorija i storageKey nedirnuti → napredak očuvan) na `data/ebusiness/midterm-1.js` (`ebusinessM1`,
  Units 1–7, 6 kat) + `midterm-2.js` (`ebusinessM2`, Units 8–15, 8 kat) + **obogaćivanje +23 fc/+5 quiz** (B2G/C2G,
  switch companies, numerički cash-flow primjeri, Web 5.0, 11 tipova digital marketinga, GA 5 benefits, PMS CRM,
  10 security savjeta, logomark…). **Finalni** = `final.js` (`ebusinessFinal`, hibrid `Object.assign` + examPractice;
  **15 kat / 152 fc / 124 quiz / 75 fill**). Catalog 3 lekcije + resolve; stari root fajl obrisan; `lazy-load.spec.js`
  sentinel → `ebusinessM1`. `CONTENT_VERSION` → `20260644`. verify 0/0, strukturni validator valid, Playwright 64/64.
  → **sem-1 = 3/4 kompletno** (još samo Entrepreneurship).
### Changed
- **Backend staza B (3. dio) — auth prelazak na EMAIL+LOZINKU, magic-link uklonjen:** `js/auth.js` prepisan —
  modal s tabovima **Sign in** (`signInWithPassword`, prijateljske greške) / **Create account** (ime →
  `user_metadata.display_name`, email, lozinka min 8; `signUp` + **obavezna email potvrda**; anti-enumeration
  „already exists" detekcija) + **Forgot password** tok (`resetPasswordForEmail` → `PASSWORD_RECOVERY` →
  „Set a new password" forma, `updateUser`). Nav gumbi prikazuju ime; profil: ime kao naslov + **„Change password"**
  inline forma. CSS: tabovi + `.auth-modal__form[hidden]`/`.profile-pass-form[hidden]` fixevi. Pravne stranice
  ažurirane (privacy: ime+lozinka-hash; terms: povjerljivost lozinke; faq). `tests/auth.spec.js` prepisan
  (tabovi/polja/forgot). Baza se NE mijenja. Dashboard korak: min duljina lozinke 8. **Dopuna:** repeat-password polje
  (recovery + profil Change password, „Passwords do not match.") + **gumb-oko za prikaz lozinke** na svim password
  poljima (`.auth-pass-wrap`/`.auth-pass-toggle`, delegirano na document). Cache `?v=20260643`.
### Added
- **Backend staza B (2. dio) — Profile + auth kroz frontend + Google Ads stranice:** **`#profile-page`**
  (`js/profile.js` + `css/profile.css` + ruta u `navigateTo`; ne sprema se kao last-position): account/sync/progress-overview
  kartice + GDPR „Delete cloud data" (briše cloud retke pa odjava). Auth ulazi posvuda: `.auth-entry` klasa — landing nav +
  novi okrugli `.header-auth-btn` na browse/lessons/study headerima (odjavljen→modal, prijavljen→Profile); modal dobio
  Terms/Privacy pristanak. **4 statične stranice za Google Ads:** `privacy.html` (GDPR) / `terms.html` / `faq.html` /
  `contact.html` + `css/legal.css`; landing footer dobio Legal kolonu + Contact/FAQ linkove. Novi `tests/legal.spec.js` +
  prošireni `tests/auth.spec.js` (profile prompt + last-position guard). Cache `?v=20260641`. **Deploy gate:** korisnik
  odlučuje kad je login UX potpun.
- **Backend staza B (MVP) — Auth + cloud sync napretka:** prvi backend kod. **`supabase/schema.sql`** (tablica `progress`,
  1 red = 1 localStorage ključ, `jsonb data`, RLS samo-svoji-retci, `updated_at` trigger; idempotentno). **`js/auth.js`**
  (supabase-js v2 UMD s CDN-a nakon DOMContentLoaded, tihi fallback ako CDN padne; **email magic-link** `signInWithOtp`;
  nav gumb `#authNavBtn` + injektirani modal). **`js/cloud-sync.js`** (offline-first: pull+merge na login — brojevi=max,
  string-polja=unija, objekti rekurzivno → naučeno se ne gubi; diff-push svakih 30 s + visibilitychange/beforeunload;
  upsert `onConflict user_id,key`; guard za ponovljeni SIGNED_IN). **`css/auth.css`** + import u `styles.css`.
  Novi test `tests/auth.spec.js` (skip ako CDN nedostupan). **Sadržaj ostaje u fajlovima** (staza A kasnije). Publishable
  key u frontendu je po dizajnu javan; service key se NE koristi. Cache `?v=20260640`.
- **Tourism Economics (te2) restrukturiran + REBUILD iz PDF predavanja:** novi `data/te2/` (midterm-1 `te2M1` / midterm-2 `te2M2` /
  final `te2Final` = `Object.assign({}, te2M1, te2M2, { examPractice })`). Sadržaj **prepisan iz 10 profesorskih PDF-ova** (ne split
  starog tankog `te2FinalData`). Granica iz silabusa 2025/26 (slajd „Important dates"): **K1 = Units 1–6** (fundamentals, demand,
  **forecasting (nova kat.)**, supply, marketStructure — 61 fc), **K2 = Units 7–12** (pricing, expenditure, tsa, environment,
  sustainability — 62 fc). **Ispravak činjenice:** stari sadržaj je tvrdio „price is NOT the most critical variable" — slajd kaže
  suprotno (najkritičnija + najprilagodljivija). Dodano: 4 oblika elasticiteta, sve pricing podstrategije, 5 tipova multiplikatora +
  realnost (≤2), 4 tipa dobara, Easterlin/decoupling/rebound, regenerativni turizam/degrowth. Finalni = 10 kat + obnovljena
  `examPractice` → **11 kat / 135 fc / 94 quiz / 66 fill**. Catalog: lekcije `first-midterm`/`second-midterm`/`final`. Stari root
  `data-te2.js`/`data-te2-final.js` obrisani; `lazy-load.spec.js` sentinel → `window.te2M1`. **Learn sekcije proširene na punu dubinu
  (~3.200 znak/kat, bilo ~1.830) — tablice + naslovi, puni studijski tekst.** verify 0/0, node render-sanity, Playwright.
  Cache `?v=20260639`.
- **Exercises — K2 koncepti Ch13/14/15/16 → K2 KOMPLETAN [B3.11]:** **4 nove `choice` vježbe** iz autentičnih workbook assignmenta:
  `k2-ch13-annual-reports` (8 MC — SOX/SEC/10-K/audit opinions/consolidated), `k2-ch14-computerised` (6 MC — POS/merchant account/cards),
  `k2-ch15-breakeven` (6 MC — cost behavior/breakeven = FC ÷ contribution margin %), `k2-ch16-internal-control` (12 TF — segregation of duties/
  imprest/deposit in transit/NSF). **Engine nepromijenjen.** Content pack sad **41 vježba** → **K2 plan kompletan** (Ch9–16 + inventory + journal/RE).
  verify 0/0, node 95/95 + 13/13, Playwright 36/36 + grade-check. Cache `?v=20260638`.
- **Exercises — K2 journal: revenue/expense + retained earnings [B3.10]:** **3 nove vježbe** (bez `chapter` → „Other"):
  `k2-journal-operations` (guided journal, 6 transakcija — proširuje K1 ALE na prihode/rashode + **depreciation adjusting entry**;
  guided grader po-transakciji, A=L+E traka nije u guided modu pa otvoreni revenue/expense rade), `k2-net-income-re` (numeric — net income →
  ending RE → total equity → total assets), `k2-net-income-random` (numeric randomiziran — NI + ending RE, NI>0, cijeli brojevi).
  **Engine nepromijenjen.** Content pack sad 37 vježbi. verify 0/0, node 95/95 + 13/13, Playwright 36/36 + grade-check. Cache `?v=20260637`.
- **Exercises — K2 Analyzing FS: Ch12 [B3.9]:** **5 novih vježbi**: `k2-ch12-concepts` (16 TF iz autentičnog Assignment 12-1; izbačene
  dvosmislene stavke bez answer-keya), `k2-ch12-ratios` (current/quick/profit margin), `k2-ch12-ratios-random` (randomiziran current+quick,
  ratiji ≤2 decimale), `k2-ch12-vertical` (common-size IS %), `k2-ch12-horizontal` ($ i % promjena Y1→Y2). Ratio definicije usklađene s
  `financialAnalysis` study-kategorijom. **Engine nepromijenjen.** Content pack sad 34 vježbe. verify 0/0, node 95/95 + 13/13,
  Playwright 36/36 + grade-check. Cache `?v=20260636`.
- **Exercises — K2 Restaurant/Hotel ratios: Ch9/10 [B3.8]:** **4 nove `ratio` vježbe**: `k2-ch9-restaurant-ratios` (fixni — average check,
  seat turnover, food/labor cost %), `k2-ch9-restaurant-random` (randomiziran), `k2-ch10-hotel-ratios` (fixni — occupancy/ADR/RevPAR),
  `k2-ch10-hotel-random` (randomiziran; `params` daju cijele brojeve, RevPAR = ADR × occupancy). **Engine nepromijenjen.** USAR/USALI
  klasifikacija (Assignment 9-1/10-1) odgođena — nema službenog answer-keya za Ch9/10 → rizik krivog ocjenjivanja. Content pack sad 29 vježbi.
  verify 0/0, node 95/95 + 13/13, Playwright 36/36 + grade-check. Cache `?v=20260635`.
- **Exercises — K2 Inventory: FIFO/LIFO/Average [B3.7]:** **4 nove vježbe** (`lesson:'second-midterm'`, bez `chapter` → grupa „Other"):
  `k2-inv-concepts` (TF/MC — cost-flow metode + rising-price efekt + COGS formula), `k2-inv-cogs-formula` (numeric randomiziran —
  Goods available = BI+Purchases, COGS = −EI), `k2-inv-methods` (numeric fixni — puna FIFO/LIFO/wtd-avg usporedba na čistim brojevima,
  sve metode COGS+ending=$4.800), `k2-inv-fifo-lifo-random` (numeric randomiziran — 2-slojni FIFO/LIFO, cjelobrojni odgovori + cross-check).
  **Engine nepromijenjen.** Average samo u fixnoj vježbi (randomizirani prosjek = decimalni drift). Content pack sad 25 vježbi.
  verify 0/0, node 95/95 + 13/13, Playwright 36/36 + grade-check. Cache `?v=20260634`.
- **Exercises — prve K2 interaktivne vježbe: Ch11 Depreciation [B3.6]:** Midterm 2 „Exercises" tab više nije prazan. **5 novih vježbi**
  u `data/accounting/exercises.js` (`lesson:'second-midterm'`, `chapter:11`), iz Cote Assignment 11-1: `k2-ch11-concepts` (TF/MC —
  SL/DDB/MACRS/contra-asset/amortization vs depletion), `k2-ch11-sl-schedule` (točan udžbenički straight-line raspored 31.000/3.000/4 god),
  `k2-ch11-ddb-schedule` (DDB 50% sa salvage-floorom, 4. god. ekspenz 875), te randomizirani drillovi `k2-ch11-sl-random` i
  `k2-ch11-ddb-random` („New numbers", `params`+`generate`; `life∈{4,5,10}` → cjelobrojni odgovori). **Engine nepromijenjen** (samo sadržaj);
  MACRS konceptualno (bez izmišljanja IRS tablica). Content pack sad 21 vježba. verify 0/0, node 95/95 + 13/13, Playwright 36/36 +
  node grade-check 5/5. Cache `?v=20260633`.
- **Accounting — restruktura na K1/K2/finalni (3 lekcije) [FAZA 4]:** predmet je dobio standardnu strukturu kao sem-2 predmeti.
  **NOVO K1 gradivo** (`data/accounting/midterm-1.js`, `window.accountingM1`): 6 kategorija Ch1–6 — `intro`, `businessFormation`,
  `financialStatements`, `balanceSheet`, `incomeStatement`, `bookkeeping` (**87 flashcards / 74 quiz / 57 fill / 6 learn**, autorirano iz
  Cote Ch1–6 + verificiranog znanja iz K1 vježbi). **K2** (`midterm-2.js`, `window.accountingM2`): realign 7 postojećih modula
  (cross-env wiring) + preimenovan `secReports`→`annualReports` + **2 nove kategorije** `restaurantAccounting` (Ch9) i `depreciation`
  (Ch11). **Finalni** (`final.js`, `window.accountingFinal`) = `Object.assign({}, M1, M2, {examPractice: finalPracticeData})` = 15 kat.
  `catalog.js` → 3 lekcije (`first-midterm`/`second-midterm`/`final`) + scripts reorder + resolve; interaktivne vježbe retagane na
  `first-midterm` (svih 16 = K1); `data/accounting/index.js` više nije u scripts (neiskorišten). verify 0/0, node 95/95 + 13/13,
  Playwright 36/36 + ciljani 3/3. Cache `?v=20260632`.
- **Accounting Exercises — sadržaj Ch1–2 (Intro/GAAP/oblici poslovanja/stock, K1) [FAZA 3 / B3.5]:** konceptualna teorija
  (Cote Ch1–2 su uvodni; workbook nema numerički set): `k1-ch1-concepts` (11 TF/MC — računovodstvena jednadžba, financijski
  izvještaji, GAAP pretpostavke/načela), `k1-ch2-business-forms` (13 TF/MC — proprietorship/partnership/corporation, limited
  liability, korporativni stock: par vs market, authorized/issued/outstanding, treasury, APIC). **Engine nepromijenjen** — čisti
  sadržaj. Node **95/95** (+13/13 kernel), verify 0/0, Playwright **36/36** + ciljani **2/2**. Cache `?v=20260629`.
  → **K1 sadržaj kompletan (Ch1–6).**
- **Accounting Exercises — sadržaj Ch3 (Survey of Financial Statements, K1) [FAZA 3 / B3.4]:** iz izvora (Cote *Hotel &
  Restaurant Accounting* workbook Assignments 3-1/3-2/3-3; **rješenja provjerena** na originalnim solution stranicama):
  `k1-ch3-tf` (14 True/False), `k1-ch3-terms` (10 pojmova → MC), `k1-ch3-isbs` (`classify`: stavka → Income Statement /
  Balance Sheet), `k1-ch3-capital` (`ratio`: owner’s capital roll-forward = **51.000**, s distraktorima koje treba ignorirati),
  `k1-ch3-income-statement` (`statement`: puni Income Statement „Annie’s Restaurant", 16 linija + 9 kaskadnih totala →
  **Net Income 57.000**). **Engine nepromijenjen** — čisti sadržaj. Node **95/95** (+13/13 kernel), verify 0/0, Playwright
  **36/36** + ciljani **5/5**. Cache `?v=20260628`. (Iza `features.exercises`.)
- **Accounting Exercises — sadržaj Ch6 (Bookkeeping process, K1) [FAZA 3 / B3.3]:** iz izvora (Cote *Hotel & Restaurant
  Accounting* workbook Assignment 6-2 + profesorski worked example „Bookkeeping process"): `k1-ch6-classify` (10 transakcija →
  **dvoosna** klasifikacija klasa A/L/EQ/R/EX **+ Increase/Decrease efekt**), `k1-ch6-journal` (**guided journal**, 6 ALE
  transakcija u perpetual sustavu — nastavlja otvoreni ledger preko `beginningBalances`; završni saldi provjereni kernelom;
  uključuje 3-linijski entry kod izdavanja dionica iznad pari). **Engine nepromijenjen** — čisti sadržaj. Node **95/95**
  (+13/13 kernel), verify 0/0, Playwright **36/36** + ciljani **2/2**. Cache `?v=20260627`. (Iza `features.exercises`.)
- **Accounting Exercises — sadržaj Ch5 (Income Statement, K1) [FAZA 3 / B3.2]:** iz izvora (Cote *Hotel & Restaurant
  Accounting* workbook Exercises-5; **rješenja provjerena** na originalnim solution stranicama): `k1-ch5-tf` (10 True/False),
  `k1-ch5-classify` (30 računa → **5-osna** klasifikacija Asset/Liability/Equity/Revenue/Expense — koristi jednoosni
  `classify` iz B3.1, bez izmjena enginea), `k1-ch5-foodcost` (`ratio`: Beginning+Direct+Storeroom → **Cost of Food Available**
  35.445; −Ending → **Cost of Food Used** 25.385). **Engine nepromijenjen** — čisti sadržaj. Node **95/95** (+13/13 kernel),
  Playwright **36/36** + ciljani **2/2**. Cache `?v=20260626`. (Iza `features.exercises` → ostali predmeti netaknuti.)
- **Accounting Exercises — sadržaj Ch4 (Balance Sheet, K1) [FAZA 3 / B3.1]:** prve prave vježbe iz izvora (Cote
  *Hotel & Restaurant Accounting* workbook, Assignment 4-1; **rješenja provjerena** na originalnim solution stranicama):
  `k1-ch4-tf` (15 True/False), `k1-ch4-terms` (8 pojmova kao MC), `k1-ch4-classify` (20 računa → bilančna kategorija
  CA/I/PE/OA/CL/LTL/EQ). Uz to mala **engine generalizacija** (unatrag-kompatibilna): `classify` effect-dropdown je sad
  **opcionalan** — ako vježba nema `effects`, radi se jednoosna klasifikacija (račun → kategorija), `gradeClassify`
  ocjenjuje samo klasu. Node **95/95** (+13/13 kernel), Playwright **36/36**. Cache `?v=20260625`. (Engine ostaje stabilan;
  ovo je sadržaj + jedna generička dopuna.)
- **Exercises engine — FAZA 2 (`journal` tip: pravi double-entry):** novi čisti **`js/acc-kernel.js`** (bez DOM-a, bez
  ovisnosti): `isBalanced`, `postEntries`/`deriveEndingBalances`, `classifyTotals` (A=L+E), `tAccounts`, `gradeEndingBalances`
  (`chartOfAccounts:[{name,normal,section}]`). Dva načina rada: **guided** (fiksne debit/credit linije po transakciji →
  `gradeJournal` u jezgri: `gradeSet` multiset + balance Σd=Σc, per-transakcija status) i **free** (`ex.free`: slobodno
  dodaj/ukloni linije, account picker, **live auto-posting u T-račune** + **živa Σdebit=Σcredit i A=L+E traka**, ocjena po
  završnim saldima). Widget sad podržava `widget.grade` (custom, free) uz imenovani grader iz jezgre. 3 demo vježbe
  (ALE guided, ALE free build-the-ledger). **Testovi:** node `acc-kernel` **13/13** + `exercises-core` **92/92** (`npm run
  test:unit` pokreće oba); Playwright **36/36** (0 regresija; smoke 9 predmeta 0 errora). Cache `?v=20260624`. **Iza
  `features.exercises` → ostali predmeti netaknuti.**
- **Exercises engine — FAZA 1 (generički tipovi widgeta + modovi + randomizacija + napredak):** svih **5 tipova vježbi**
  interaktivno i auto-ocjenjivano, svaki = **čisti grader u jezgri (node-testabilan) + tanki DOM widget** (registry obrazac
  render/collect/grader/mark). Tipovi: **choice** (TF+MC), **numeric** (`numEq`, jedinice/hint), **ratio** (givens tablica +
  polja), **statement** (sekcije/linije/totali + **balancing figure**, `numEqMoney`), **classify** (zadani račun → klasa+efekt).
  **3 moda** (practice s hintovima / exam bez / walkthrough = `solution[]` koraci) u zajedničkom shellu. **Randomizacija**
  (`params`+`generate(p)` deterministički po seedu preko `pickParams`) + gumb **„New numbers"** (demo: straight-line amortizacija).
  **Napredak** u `<subject>-exercises-progress` (done/best/attempts) + kartica na Progress stranici (data-driven). 6 demo vježbi
  u `data/accounting/exercises.js` (pravi K1/K2 sadržaj). Jezgra dobila gradere `gradeChoice/gradeNumeric/gradeStatement/
  gradeClassify` + `statementCells`. **Testovi:** node **86/86** (`npm run test:unit`), Playwright **36/36** (0 regresija; smoke
  9 predmeta 0 errora). Cache `?v=20260623`. **Sve i dalje iza `features.exercises` → ostali predmeti netaknuti.**
- **Exercises engine — FAZA 0 (scaffold, bez sadržaja):** temelj generičkog, reusable sustava interaktivnih
  auto-ocjenjivih vježbi (plan: `docs/EXERCISES_ENGINE.md`). **Engine (subject-agnostic):** `js/exercises-core.js`
  — čiste funkcije bez DOM-a (`parseAmount` s EU/US + zagrade-negativ, `formatAmount`, `numEq`, `numEqMoney` na razini
  centi, `gradeSet` multiset/redoslijed-neovisno, `seededRandom` mulberry32, `pickParams`); `js/exercises.js`
  — `initExercises()` (lista kartica iz content packa, filtrirana po lekciji, prazno stanje, shell na klik);
  `css/exercises.css` (`ex-`-prefiks, mode-tabovi/kartice/feedback/mobilni scroll-x). **Povezivanje (data-driven):**
  `navigation.js` `applyFeatureNav()` prikazuje tab po `catalog features` — **blindMap refaktoriran** s hardkodiranog
  `subjectId==='geography'` na `features.blindMap`; novi `features.exercises` + `content.exercises` (ime window var).
  index.html: `#exercises` sekcija + 2 skrivena nav gumba. **Content pack:** `data/accounting/exercises.js`
  (`window.accountingExercises = {meta:{lang,currency,version}, exercises:[]}`) — accounting dobio `features.exercises:true`.
  **Testovi:** novi `npm run test:unit` (60/60, node, bez frameworka); `playwright.config.js` dobio `testIgnore:['unit/**']`
  (spriječeno da Playwright pokupi node `*.test.js` i `process.exit` mu sruši run). `CONTENT_VERSION`/`styles.css`/
  `catalog.js`/`content-loader.js`/`navigation.js` `?v=20260622`. Verify **0/0**, Playwright **44/44** (ostali predmeti netaknuti).
  **Ništa vidljivo dok predmet nema flag → nula utjecaja na ostatak appa.**
- **Food & Nutrition FINALNI ispit (Teme 1–14) — hibrid:** novi `data-food-nutrition-final.js`
  (`window.foodNutritionFinalData = Object.assign({}, foodNutritionData, foodNutritionM2Data, { examPractice })`,
  uzor Marketing/Economics/Geography/BI final; učitava se ZADNJI). Spaja svih **14 kategorija** oba kolokvija
  (7 K1 Teme 1–7 + 7 K2 Teme 8–14; nema kolizija ključeva) + dodaje kuriranu **`examPractice`** („Exam Practice
  (All Topics)", cross-topic: 14 fc · 12 quiz · 8 fill + „Final Exam Roadmap" learn s tablicom must-know po temi i
  cross-topic nitima). Silabus (FAN Introduction): finalni = **30% (min 15%), obavezan, prag 35%; 16 pitanja
  (12 kratkih × 1.5% + 4 esejska × 3%)**, pokriva sve. Catalog: nova lekcija `final`, `scripts` += final (zadnji),
  `resolve.final = foodNutritionFinalData`. `CONTENT_VERSION` 20260620→20260621 + bump `catalog.js`/`content-loader.js`
  `?v=20260621`. Ukupno final = **15 kat. / 174 fc / 182 quiz / 122 fill**. Verify 0; strukturni validator merge-a 0
  (0 loših quiz-indeksa, 0 fill bez praznine, 0 kat. bez Learn); Playwright + ciljani final render-test (4 profila,
  merged=true: wine + healthyDiet + examPractice aktivni, quizOpts=16). → **Food & Nutrition 100% KOMPLETAN (K1 + K2 + finalni).**
- **Food & Nutrition 2. kolokvij („Topics 8–14") — `second-midterm` popunjen + podjela usklađena sa silabusom:**
  novi sibling fajl `data-food-nutrition-m2.js` (`window.foodNutritionM2Data`, obrazac kao ostali `data-*-m2.js`)
  sa **7 kategorija po temi** — Beer, Distilled Spirits & Liqueurs, Meat, Fish, Milk & Dairy, Eggs, Healthy Diet
  (**71 flashcards · 84 quiz · 56 fill · 7 learn**). Izvori: prezentacije FAN 8–14. **Ključna ispravka podjele:**
  silabus (FAN Introduction, slajd 3) propisuje 1. kolokvij = Teme **1–7** i 2. kolokvij = Teme **8–14**, a postojeći
  1. kolokvij je pogrešno uključivao **Beer (Tema 8)**. Beer je **premješten** iz `data-food-nutrition.js` u K2 (sadržaj
  nepromijenjen, ključ `beer` isti → napredak učenika očuvan). K1 sada = 7 kat. (Teme 1–7, završava na Wine; 89 fc / 86
  quiz / 58 fill). **Sadržaj K1 (Teme 1–7) verificiran prema izvorima FAN 1–7 — 0 činjeničnih grešaka** (sve brojke/
  definicije točne). Catalog: `scripts` += `data-food-nutrition-m2.js`, `resolve.second-midterm = foodNutritionM2Data`,
  coming-soon uklonjen, opisi obje lekcije osvježeni. `CONTENT_VERSION` 20260619→20260620 + bump `catalog.js`/
  `content-loader.js` `?v=20260620`. Verify 0; strukturni validator 0 (0 loših quiz-indeksa, 0 fill bez praznine);
  Playwright 36/36 + ciljani K2 render-test (4 profila). → **Food & Nutrition KOMPLETAN (1. + 2. kolokvij).**
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
- **Entrepreneurship fill-blank se nije renderirao — 6 umjesto 7 podvlaka (BUG-009):** u `data-entrepreneurship.js`
  (kat. `tourism`, fill #0) praznina je imala `______` (6) umjesto `_______` (7). `js/fill-blanks.js` zamjenjuje
  **točno** 7-znakovni token → praznina se nije prikazivala (korisnik vidio `______-term`, bez polja za upis).
  Ispravljeno na 7 podvlaka. Nađeno tijekom potpune content-revizije (audit svih predmeta: 53 fill u Entrepreneurshipu,
  sad 0 loših; cijeli projekt 0 loših quiz-indeksa / 0 loših fill / 0 kategorija bez Learn). `CONTENT_VERSION`
  20260618→20260619 + bump `content-loader.js?v=20260619`. Verify 0; Playwright 36/36.
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
