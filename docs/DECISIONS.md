# Arhitektonske odluke (ADR)

Svaka značajna odluka: kontekst → odluka → posljedice. Najnovija na vrhu.

---

## ADR-016 — Privilegirane operacije (`service_role`) → Supabase Edge Functions, NIKAD Vercel
**Datum:** 2026-07-04 · **Status:** ✅ ODLUČENO (implementacija odgođena; prvi konzument = brisanje računa)
**Kontekst:** App treba „Obriši račun" (GDPR pravo na zaborav — trenutno samo ručno mailom + „Delete cloud data" gumb
koji briše samo `progress` retke). Brisanje `auth.users` retka zahtijeva **`service_role`** ključ (`auth.admin.deleteUser()`) —
ključ koji **zaobilazi SVE RLS = root nad bazom**. Danas taj ključ postoji SAMO u lokalnom `.env` (migracijske skripte);
nijedan deployani sustav ga nema → Vercel je „inertan" (statičke datoteke, proboj ne curi ništa što šteti bazi). Pitanje
(sigurnost = najvažnija): gdje smije živjeti taj ključ? Razmatrano: **(A) Supabase Edge Function** (Deno, ključ u Supabase
secrets) vs **(B) Vercel `/api`** (ključ u Vercel env). ADR-001/008 su generički rekli „Vercel Functions + Supabase" — ovo precizira.
**Odluka:** **(A) Supabase Edge Function** za sve što traži `service_role`. Trajno pravilo:
> **Sve što traži `service_role` → Supabase Edge Function. Sve što može ići pod korisnikovim/anon JWT-om uz RLS → bilo gdje (uklj. Vercel `/api`).**

**Obrazloženje (sigurnosno):**
1. **Ko-lokacija tajne s resursom** — `service_role` ostaje unutar Supabasea (isti dvorac kao baza koju može uništiti); ne pretvaramo inertni Vercel u nositelja DB-root moći.
2. **Manje sustava koji mogu iscuriti ključ** — jedan (Supabase) umjesto dva (Supabase + Vercel env/build-logovi/npm supply-chain).
3. **Nativna provjera identiteta** — JWT-verify i admin-akcija u istom runtimeu; nema ručne JWT-validacije na Vercelu (izbjegnut klasičan „obriši tuđi račun" bug ako se vjeruje `user_id` iz body-ja umjesto iz tokena).
4. **Blast-radius** bilo kojeg Vercel incidenta ostaje „statičke datoteke" (kao danas).
**Cijena / posljedice:** +1 deploy-toolchain (Supabase CLI + Deno) za malu, rijetko-mijenjanu funkciju — prihvatljivo za maksimalno-opasnu, niskofrekventnu operaciju. F4 (Admin CRUD) i dalje smije koristiti Vercel `/api` za operacije pod RLS-om; `service_role` **nikad ne ulazi u Vercel.** ⚠️ Pri gradnji provjeriti postoji li do tada **nativni Supabase „delete self" RPC** (tada ni Edge Function ne treba `service_role`); odluka „gdje živi privilegirani ključ" vrijedi bez obzira. Detaljan dizajn: [BACKLOG.md](BACKLOG.md) §Brisanje računa. [[foundation-pivot]]

---

## ADR-015 — Tech-debt triage: „briše li ga F4?" (accounting→JSON DA; root-lokacije & Supabase-sleep NE)
**Datum:** 2026-07-03 · **Status:** ✅ ODLUČENO + accounting-dio IZVRŠEN (grana `foundation/f2a-accounting`)
**Kontekst:** Pregled cijelog projekta (2026-07-03) iznio je 4 „iskrene" stavke tech-duga. Pitanje: koje popraviti,
kojim redom. Ključni princip presude: **F4 (Admin CRUD → baza autoritativna, datoteke = generirani export) je
gravitacijski centar temelja** — svaku stavku mjeri prema tome hoće li je F4 ionako učiniti bespredmetnom.
**Odluka (triage):**
1. **Accounting → JSON dual-read = NAPRAVITI (akumulira se).** Bio je jedini predmet izvan JSON supstrata (17/18).
   F4 je „dual-read, predmet-po-predmet" → 1 nemigriran predmet = specijalni slučaj kroz cijelu migraciju.
   Dovršetak na **18/18** znači F4 kreće s uniformne baze. Mehanički, reverzibilno, format-only (0 diranja sadržaja →
   ne aktivira „zasićenost računovodstvom"). **✅ IZVRŠENO:** `export:json accounting` (3 JSON, round-trip 0) +
   `dataFormat:'json'` u catalog + catalog.js token `20260702→20260704` + novi `dual-read.spec` accounting test.
2. **Root `data-*.js` lokacije (12 datoteka: marketing/geography/econ-hospitality/food-nutrition) = NE popravljati.**
   Čisto kozmetika (krši „mapa po predmetu", ADR-006), ali funkcionalno svejedno (JSON mirror + dual-read rade).
   **F4 čini datoteke generiranim exportom → exporter ih piše gdje god, nered se riješi sam.** Premještanje sad =
   bacanje posla + diranje 4 radna predmeta za 0 dobiti. Svjesno otpisano do F4.
3. **Ručni per-file cache-tokeni = NE prčkati ručno; čeka F3.** Prava klasa rizika (BUG-004), ali rješenje je
   **auto version-bump** koji F3 već planira — ubija cijelu klasu trajno. Ad-hoc ručni rad = pola posla. Odgođeno na F3.
4. **Supabase free-tier uspavljivanje (~7 dana) = PRIHVATITI (nije inženjerski zadatak).** Fallback na datoteke je
   točno ponašanje; padnu samo login/sync do restore-a. Alternativa (Pro $25/mj) već odbačena. Revidirati tek uz monetizaciju.
**Posljedice:** JSON supstrat je sad **18/18 uniforman** (spreman za F4 flip bez specijalnih slučajeva). Stavke #2/#4
prestaju biti „trebamo li?" teret — eksplicitno su otpisane s razlogom. Sljedeći korak (nepromijenjen): **F2 2D (Web Components).**
[[foundation-pivot]]

---

## ADR-014 — Engineering standardi temelja: CI/CD-gated, type-check bez build-a, Web Components, monitoring
**Datum:** 2026-06-29 · **Status:** ▶ ODLUČENO, izvršavanje kroz [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) (Faze 1–2)
**Kontekst:** „Platforma-first" odluka (vidi ADR-013) traži da projekt postane **profesionalniji, reliable, WOW** —
ne samo „radi". Trenutno: testovi se pokreću RUČNO, nema CI-a, nema type-provjere, UI se gradi ad-hoc `innerHTML`
stringovima, nema error-monitoringa. Sve to skalira loše kako dolaze CRUD/UGC/tutor.
**Odluka:** Četiri presjećna standarda, uvode se rano (Faza 1–2), **bez napuštanja „vanilla/no-build" etosa:**
1. **CI/CD gate (GitHub Actions + Vercel preview deploys):** svaki push pokreće `validate:content`+`verify`+`test:unit`+
   Playwright; crveno = ne ide u `main`. Vercel preview po grani = pravi staging prije produkcije.
2. **Type-safety bez build-a:** JSDoc tipovi + `// @ts-check` + `tsc --checkJs --noEmit` **samo kao CI checker**
   (nula runtime/build promjene; browser i dalje vrti čisti JS). Uvodi se **modul-po-modul**, ne globalni strict odmah.
3. **Reusable UI = Web Components** (custom elements, **light-DOM** bez Shadow DOM) umjesto ad-hoc `innerHTML` —
   native, framework-free, riješi i `innerHTML`/XSS brigu kontroliranim renderom. Uvodi se inkrementalno (toast → modal → …).
4. **Error monitoring** (Sentry free ILI mini-logger → Supabase) — app zna kad pukne kod korisnika.
**Posljedice:** Temelj prestaje biti samo „CRUD-ready" i postaje **CI-gated, tipiziran, komponentno-reusable, monitoran.**
`tsconfig.json`/`.github/workflows/ci.yml`/`typescript` devDep su jedini novi alati — svi su dev/CI, ne runtime.
Odbačeno: frontend framework, runtime build-step, CMS (vidi ADR-013). [[foundation-pivot]]

**Dodatak (2026-06-29) — razina podignuta na „brutalnu" (korisnik: „ne zdrav nego jeben i brutalan"):** 4 standarda gore
dobivaju **TVRDE gateove + 5 konkretizacija** (detalji [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) §7):
1. **Perf/a11y/visual = TVRDI gateovi** (Lighthouse budžeti Performance≥0.95/LCP≤2s + axe-core 0 serious + Playwright `toHaveScreenshot` baseline) — **blokada, ne upozorenje**; prošlost ne može truniti (BUG-015 nemoguć).
2. **Monitoring = Sentry s release-trackingom** (git SHA), consent-aware — ne maglovit „mini-logger".
3. **RLS + migracije testirane na ephemeral Supabase branchu** u CI (RLS = dokazana, ne nadana).
4. **CRUD source-of-truth flip dobiva versioning + audit-log + dry-run diff** (undo/povijest/kočnica).
5. **SRS dobiva dizajn-dok PRIJE koda + FSRS** (2024+ algoritam), ne nabacani SM-2.
Trošak alata = **0 €** (sve free na ovoj skali). Svjesno NE: product-analytics (Posthog), framework, runtime build, microservices.

**▶ IMPLEMENTIRANO (2026-06-30 / 2026-07-01, sve LIVE):** **F1** = CI/CD (`.github/workflows/ci.yml`) + `tsc --checkJs` (scoped) + hardening + TVRDI gateovi 1D
(axe 0-serious, layout-guard, Lighthouse budžeti) + RLS-test. **F2 2E** = Sentry error-monitoring (`js/monitoring.js`→`window.SokratMonitor`): consent-gated
(isti gate kao GA), **Loader Script EU/DE** (`js-de.sentry-cdn.com`), **samo hvatanje grešaka** (Tracing/Replay/Logs isključeni), `sendDefaultPii:false`, release
`sokrat-study@20260699`; uživo verificiran. **Točka #4 (nadogradnja) = ISPUNJENA** (Sentry + release-tracking, ne mini-logger). **F2 2C (2026-07-02, grana `foundation/f2c`)** = **AppState (S3)**: SVI mutable globali iz config.js
(nav/cards/quiz/fill/session — 5 grupa) → `window.AppState` namespace, grupa-po-grupa s funkcionalnim testovima; config.js bez ijednog mutable `let`; `js/app-state.js` u typecheck scopeu. **⬜ Preostaje:** Web Components (S4, F2 2D) + pixel `toHaveScreenshot` (F3, treba Linux baseline).

---

## ADR-013 — Content arhitektura: podatak ≠ ponašanje + ContentRepository šav (source-of-truth)
**Datum:** 2026-06-29 · **Status:** ▶ ODLUČENO, izvršavanje kroz [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) (Faza 2, flip u Faza 4)
**Kontekst:** Sadržaj je trenutno **`.js` kod** (`window.X = {...}`, ponekad s funkcijama). To ne skalira: ne validira se
kao podatak, ne ide čisto u bazu/CMS, i izvor je BUG-012 (vježbe s `generate()`). Admin CRUD bi ovo obrnuo
(baza = istina), ali to je velika odluka koju treba donijeti SVJESNO, ne usput. Korisnik bira **platforma-first**.
**Odluka:**
- **Razdvoji podatak od ponašanja:** study sadržaj → **čisti JSON** (portabilan, validabilan); vježbe/generatori →
  **zasebni JS moduli** (kod, ostaju datoteke). To je najveći reusable potez i preduvjet svega.
- **Uvedi `ContentRepository` šav** (S1): jedno sučelje `getSubject/getLesson/listSubjects…` neovisno o izvoru;
  implementacije `FileRepo`(JSON) + `SupabaseRepo` iza istog sučelja, fallback ostaje. Prebacivanje izvora = config.
- **Ciljani model:** **baza = autoritativna u runtimeu, datoteke = generirani export** (commitane zbog gita/offline-a,
  više se NE uređuju ručno). Flip se izvodi u Fazi 4 (Admin CRUD), **jedan predmet odjednom uz dual-read** (loader
  čita i staro `.js` i novo `.json`) → nikad „big bang".
- **Admin CRUD = CUSTOM** (korisnik: „radio bih CRUD normalno"), NE CMS — ali tek nakon što su S1/S2 čisti, pa je build malen.
**Posljedice:** Svaki budući sadržaj (HR ×16, 3. god, UGC) rađa se u CRUD-spremnom formatu → nema velike kasnije
migracije. Vježbe ostaju izuzetak (BUG-012) — CRUD ih ne uređuje. Datoteke + git-povijest + offline fallback ostaju.
Odbačeno: i18n-u-sadržaju (ADR-012), CMS (Decap/Directus/Sanity — premda S1/S2 ostavljaju tu opciju otvorenom). [[foundation-pivot]]

**▶ IMPLEMENTIRANO (2026-07-01, LIVE — dio šava):** **S1 `ContentRepository` = `window.SokratContent`** (`js/content-repo.js`): `listSubjects/getSubject/isLessonComingSoon/loadLesson/isLoaded` —
tanki omotač koji objedinjuje 3 razbacana puta dohvata (catalog + `loadSubjectContent` + `getSubjectData`); `navigation.js` sada ide kroz njega. **NULA promjene ponašanja** (DB↔datoteka
fallback već u loaderu). „Podatak≠kod" već strukturno čuvan u loaderu (`scripts` vs `codeScripts`, BUG-012).

**▶ IMPLEMENTIRANO (2026-07-02, LIVE — S2 čisti JSON format, F2 2A):** study sadržaj **portabilan kao čisti JSON** — `data/json/<id>/<var>.json` (51 datoteka, 17/18 predmeta;
accounting odgođen). Strojni ugovor `schema/subject-content.schema.json` (draft-07) + `npm run validate:schema` (ajv, CI). Exporter `npm run export:json [id] [--check]`
(round-trip bez gubitka, deterministički; CI drift-gate). **Dual-read u loaderu: baza → JSON (catalog `content.dataFormat:'json'`) → `.js` fallback** — `.js` OSTAJE izvor istine
do flipa u Fazi 4. Vježbe NIKAD u JSON (BUG-012). **⬜ Preostaje:** formalni `FileRepo`/`SupabaseRepo` (2B.2, kad zatreba) + source-of-truth flip u Fazi 4.

---

## ADR-012 — HRV program: KLON programa + globalni UI toggle (sadržaj ≠ sučelje)
**Datum:** 2026-06-28 · **Status:** ✅ implementirano + LIVE (cigle 1–5c, `320d413..4b795c8`)
**Kontekst:** Treba hrvatska verzija platforme („Menadžment u Hotelijerstvu"). Dvije razdvojene potrebe:
(1) hrvatski **SADRŽAJ** predmeta, (2) hrvatsko **SUČELJE**. Korisnik izričito: „translate ne dira predmete".
**Odluka:** **Dvije neovisne osi.**
- **Sadržaj = KLON programa (Opcija A), NE i18n u sadržaju.** Paralelni `program` `hospitality-management-hr` +
  `data/<subj>-hr/*.js` (isti engine, 0 promjena; vlastiti `storageKey` → napredak odvojen). Prijevod alatom
  `scripts/translate-subject.js` (Sonnet tool_use; **slot-pristup** = model prevodi samo string-polja iz bijelog popisa,
  JS rekonstruira strukturu → `quiz.correct`/`_______`/KaTeX/HTML očuvani po konstrukciji; **salvage-parser** za
  tool_use koji vrati `translations` kao pokvaren JSON-string). Vježbe = posebno (samo string-polja). Odbačeno:
  i18n ključevi u sadržaju (`{en,hr}` po flashcardu) — zagadilo bi schemu i engine.
- **Sučelje = GLOBALNI toggle (master), neovisan o programu.** `js/i18n.js` rječnik `{en,hr}` + `t()` +
  `applyTranslations()` nad `[data-i18n]`; izbor u `localStorage 'sokrat-ui-lang'`. 🌐 gumb u nav-u. Opening HR
  programa samo „predloži" hrvatski prvi put (ako korisnik nije birao). **EN dict-vrijednosti = ORIGINALNI tekst →
  EN bajt-identičan.** Landing/sidebar pokazuju `PRIMARY_PROGRAM` (EN); HR program dostupan kroz Browse drill-down.
**Posljedice:** Hrvatski student dobije potpuno hrvatsko sučelje i sadržaj; engine se nikad ne dira. Baza: HR =
**novi redovi u POSTOJEĆIM tablicama** (`subject_content`/`progress` su ključani po id-u → 0 novih tablica/koda).
Long-tail chrome (profil/pravne stranice/blind-map) ostaje za dovršiti. Detalji: [HRV_PLAN.md](HRV_PLAN.md). [[hrv-program]]

---

## ADR-011 — Blok B read-path: sadržaj iz baze DIREKTNO preko anon keya (ne `/api`)
**Datum:** 2026-06-23 · **Status:** ✅ implementirano (aktivno lokalno)
**Kontekst:** Blok B (sadržaj→Supabase). Originalni plan (ADR-008/BACKEND.md) predviđao je `/api`
Vercel funkcije. Ali sadržaj je **javan** (svi čitaju isti katalog) → ne treba per-user logiku ni
skrivanje iza servera.
**Odluka:** Sadržaj se čita **direktno preko supabase-js (anon/publishable key) + public-read RLS**
(`using(true)`), isto kao što napredak već radi — **bez `/api` funkcija, bez service-keya na frontu**.
Tablica `public.subject_content` (1 red = 1 window var, `jsonb`). `js/content-loader.js` proba bazu pa
**padne na datoteke** (offline-first; datoteke = izvor istine, baza = zrcalo koje puni
`scripts/migrate-content.js` sa service-keyem). `/api` funkcije ostaju za KASNIJE (admin CRUD, AI tutor).
**Posljedice:** Najmanji setup, ništa se ne kvari ako baza padne/uspava se (fallback). Free tier uspava
projekt ~7 dana → restore besplatan; uspavan = sadržaj iz datoteka, login/sync stanu. Puna migracija
(„baza = jedini izvor" + admin CRUD) tek kad je 1. godina gotova. Detalji: [BACKEND.md](BACKEND.md) §Staza B2.
**Dopuna (2026-06-27, BUG-012):** read-path nosi SAMO čisto-podatkovne window-varove (M1/M2/Final = flashcards/quiz/fill/learn).
**VJEŽBE (`*Exercises`) se NE migriraju** — sadrže `generate()` funkcije koje `JSON.stringify` izbriše; uvijek se učitaju iz
datoteke preko **`content.codeScripts`** (loader: `filesToLoad = fromDb ? codeScripts : scripts`). `verify-catalog.js` to forsira.
Općenito pravilo: **payload s funkcijama nije JSON-migracijski → kod ostaje u datotekama, baza nosi samo podatke.** Vidi [BUGS.md](BUGS.md) §BUG-012.

## ADR-010 — Generator predmeta (manje Opus-usagea) + tool_use structured output
**Datum:** 2026-06-22/23 · **Status:** ✅ implementirano (pilot: Academic Writing)
**Kontekst:** Ručno autorstvo predmeta troši puno (skupog) Opus-vremena. Korisnik želi dodavati predmete
uz minimalan moj usage, PA tek onda puni Blok B.
**Odluka:** Pipeline `scripts/`: `build-topics.js` (materijali→topics.json) → `generate-subject.js`
(**Anthropic Sonnet preko korisnikovog `.env` ključa** — bulk drafting OFF Opus) → `assemble-subject.js`
(draft→`data/<id>/*.js`) → gate (`validate-content.js` + verify + Playwright + moj činjenični spot-check).
**Točnost nose deterministički zaštitari**, ne model. Output = isti `data/*.js` format → migracijski siguran.
**Ključno (pilot-nalaz):** drafting koristi **Anthropic `tool_use` (forced tool_choice)** → API jamči valjan
objekt → nestaje cijela klasa „unescaped quote → nevaljan JSON" padova (sadržaj prepun navodnika). +`coerce`
(learn kao string) +retry (learn prazan). **Inherentni limit:** validator provjerava da je quiz `correct` u
rasponu, NE je li stvarno točan → hvata samo Opus/ljudski spot-check (zato gate postoji).
**Posljedice:** Novi predmet ~$1–1.5 (Sonnet, korisnikov račun) umjesto sati Opus-rada. Pouka: generirani
sadržaj VERIFICIRATI protiv predavanja. Detalji: [CONTENT_GENERATOR.md](CONTENT_GENERATOR.md).

## ADR-009 — Kvantitativni predmeti (Math/Micro/Macro/Statistika): KaTeX + "worked problems"
**Datum:** 2026-06-05 · **Status:** ✅ **implementirano** (KaTeX cigla, 2026-06-14)
**Implementacija (2026-06-14):** `js/math.js` (`renderMath(container)` = KaTeX auto-render, tihi no-op ako
CDN padne) + KaTeX CDN u `<head>` + `css/math.css` (dark + mobilni overflow). `renderMath` se zove na kraju
sva četiri renderera (`learn.js`/`flashcards.js`/`quiz.js`/`fill-blanks.js`). Test `tests/katex.spec.js`.
**⚠️ ISPRAVAK delimitera (currency-safe):** plan je predviđao `$...$` inline, ALI postojeći sadržaj ima 120+
valutnih `$NN` (npr. „$25 per night") → s `$...$` bi KaTeX parsirao tekst između dvaju `$` kao matematiku i
**pokvario live sadržaj**. Zato: **inline `\( \)`, blok `\[ \]` / `$$ $$`; jedan `$` se NE koristi.** Te se
sekvence ne pojavljuju u običnom tekstu (provjereno grep-om) → render je globalan ali za tekstualne predmete
**no-op** (nije potreban opt-in flag). Konvencija autorstva: [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) § Matematika.
**Kontekst:** Math, Microeconomics, Macroeconomics i Statistika su **formula- i zadatak-orijentirani**;
postojeća schema (Learn/Flashcards/Quiz/Fill) rađena je za konceptualno, tekstualno gradivo. Tri problema:
(1) prikaz **formula** (HTML tekst ne prikazuje razlomke/eksponente/sume/integrale), (2) bit je
**rješavanje zadataka korak-po-korak** (ne prepoznavanje), (3) **grafovi** (ponuda/potražnja, tangente,
distribucije). Math materijal je u JPG slajdovima (PPT export).
**Odluka:**
1. **Rendering formula = KaTeX** (CDN `<link>` + `<script>`, bez build-a; isti alat kao Khan/Brilliant).
   Sadržaj se piše kao **LaTeX** unutar `$...$` / `$$...$$` u POSTOJEĆIM poljima (flashcard/quiz/fill/learn).
   Jedan helper `renderMath(container)` (KaTeX auto-render) zove se nakon što sekcija ubaci HTML.
   **Migracijski sigurno** — payload ostaje string (LaTeX), struktura scheme se NE mijenja.
2. **Pedagogija = "worked problems" konvencija na POSTOJEĆIM modovima** (bez novog moda zasad):
   Learn = teorija + formule + riješeni primjeri; Flashcards = zadatak → puno rješenje; Quiz = numerički,
   **distraktori = tipične greške**; Fill = popuni formulu/korak. Namjenski "Problems" mod (otkrivanje
   koraka jedan-po-jedan) gradimo TEK ako se reuse pokaže nedovoljnim.
3. **Grafovi = statične SVG / croppane slike u Learn** (`learn.image` već postoji). Interaktivni grafovi = ne sad.
**Posljedice:** KaTeX integracija je stvaran (ali kontroliran) posao u rendererima (learn/flashcards/quiz/
fill) → cache bump + test. Točnost formula iz slika = glavni rizik → male serije + **obavezan ljudski pregled**.
**Redoslijed:** prvo lagani tekstualni predmeti; KaTeX cigla PRIJE prvog kvantitativnog; pilot na predmetu
s materijalima (Statistika je PRAZNA, Micro tanak → realno Math ili Macro); **čista Matematika ZADNJA**.
Detalji: [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) (LaTeX konvencija) + [CONTENT_INTAKE.md](CONTENT_INTAKE.md) (image→LaTeX, inventar).

## ADR-008 — Backend hosting: Vercel Functions + Supabase
**Datum:** 2026-06-03 · **Status:** prihvaćeno
**Kontekst:** Treba odlučiti gdje hostati backend. Razmatrano: Vercel Functions +
Supabase, all-Vercel (Neon+Blob+auth), i Railway (always-on server+Postgres).
**Odluka:** **Vercel serverless funkcije (`/api`) + Supabase** (Postgres/Auth/Storage).
Frontend ostaje statički na istom Vercel projektu/deployu. Railway se razmatra KASNIJE
samo kao zaseban worker za dugotrajni AI ingest (serverless timeout), ne za cijeli backend.
**Razlozi:** besplatno na startu, Auth+Storage+DB u jednom, minimalno održavanja, paše
postojećem no-build statičkom setupu (Vercel sam servira `/api`).
**Posljedice:** Serverless timeout (10–60s) → tešku AI obradu chunkamo / kasnije worker.
**Migracija sadržaja:** ne sad; jednom u Bloku B (datoteke → DB 1:1). Vidi [BACKEND.md](BACKEND.md).

## ADR-007 — Navigacija: puni drill-down (Fakultet → Smjer → Godina → Predmet)
**Datum:** 2026-06-02 · **Status:** ✅ implementirano (2026-06-02, M0.5)
**Kontekst:** Stranica treba biti strukturirana po fakultetu/smjeru/godini; korisnik
želi da se eksplicitno vidi hijerarhija ("uđeš na fakultete → smjerovi → godine").
**Odluka:** Puni drill-down korak po korak: Start → Fakulteti → Smjerovi → Godine →
Predmeti (po semestru), čak i kad razina ima samo jednu opciju. Breadcrumbs na svakom
ekranu. (Razmatran "pametni skip" jednolične razine — odbijen jer korisnik želi
eksplicitnu strukturu.) ~~Logo se zadržava.~~ **PROMJENA (2026-06-28): logo redizajniran** — `logo.png` (raster) → `assets/logo.svg` (vektorizirani glatki Sokrat, glava ispunjava krug, indigo gradijent); ✅ LIVE `19f07db`. Vidi `CLAUDE.md` §Ključne odluke + `docs/PROGRESS.md`.
**Vizualni stil (revidirano 2026-06-02):** **„čisto i bogato" (clean & rich, Brilliant/
Quizlet-feel), dark** — NE preminimalistički; treba izgledati kao „prava stranica"
(bogate kartice s gradijent-ikonama, breadcrumb, napredak). Mijenja raniji opis
„minimalistički".
**Implementacija:** zasebna `#browse-page` stranica; render iz `data/catalog.js` preko
helpera `SokratCatalog.faculties()/programsOf()/yearsOf()/subjectsOf()/semestersOf()`
u `js/navigation.js` (`renderBrowse()` + `initBrowse()`), stil u `css/browse.css`.
Dodavanjem fakulteta/smjera/godine/predmeta u catalog kartice se pojave bez izmjene UI-a.
Test: `tests/browse.spec.js` (drill-down + overflow guard, sva 4 iPhone profila).
**Posljedice:** Par dodatnih klikova dok je 1 fakultet/smjer, ali jasna struktura i
spremnost za više smjerova/fakulteta bez promjene toka.

## ADR-006 — Struktura sadržaja: mapa po predmetu, datoteka po lekciji
**Datum:** 2026-06-02 · **Status:** prihvaćeno
**Kontekst:** Uskoro se dodaje cijela 1. godina (po predmetu: k1, k2, završni) →
~15 novih lekcija. Postojeći nered (jedna velika datoteka vs modularni accounting)
ne skalira za autorstvo.
**Odluka:** Novi predmeti idu u `data/<subject-id>/{midterm-1,midterm-2,final}.js`
(jedna datoteka po lekciji, svaka izlaže `window.<var>`), uz `data/_template/
lesson.template.js` i `scripts/scaffold-subject.js`. Postojeći 2. god. predmeti se
NE prepravljaju (rade; catalog ih već apstrahira; migracija u bazu ih svejedno
normalizira). Autorstvo u datotekama je migracijski sigurno (Blok B uvozi 1:1).
**Posljedice:** Brže i dosljednije dodavanje; čista migracija u Supabase kasnije.

## ADR-005 — Playwright za vizualne responsive testove
**Datum:** 2026-06-01 · **Status:** prihvaćeno
**Kontekst:** Responzivnost mora biti savršena na svim uređajima; vizualne bugove
(npr. horizontalni overflow) ne hvataju logički testovi, a ručno testiranje na
svakom iPhoneu nije održivo.
**Odluka:** Dodati Playwright (chromium) kao dev-dependency + `tests/responsive.spec.js`
koji emulira iPhone širine (375/393/430 + landscape 852), mjeri overflow i radi
screenshotove. Mali vlastiti static server (`scripts/static-server.js`).
**Posljedice:** Regresije responzivnosti hvatamo automatski. `node_modules` i
Playwright artefakti su u `.gitignore`.

## ADR-004 — Svi data-*.js izlažu objekt na `window`
**Datum:** 2026-06-01 · **Status:** prihvaćeno
**Kontekst:** `getSubjectData()` sada razrješava podatke po IMENU varijable iz
catalog-a (`content.resolve`). Top-level `const` u skripti nije dostupan kao
`window[ime]`, a samo su 3 od 8 predmeta to imala.
**Odluka:** Standardizirati: svaki `data-*.js` na kraju radi `window.X = X`.
**Posljedice:** Catalog lookup radi uniformno; ujedno preduvjet za lazy loading
(A4) gdje se skripte učitavaju dinamički i moraju biti dostupne preko `window`.

## ADR-003 — Catalog kao jedinstveni izvor istine
**Datum:** 2026-06-01 · **Status:** prihvaćeno
**Kontekst:** Predmeti su bili hardkodirani na 3 mjesta (`subjectDataMap`,
`getSubjectData()` if-lanci, ručni HTML u sidebaru) → ne skalira na 100+ predmeta.
**Odluka:** Uvesti `data/catalog.js` kao jedini izvor istine. `content.resolve`
mapira (predmet, lekcija) → globalna varijabla, čime generalizira `getSubjectData()`.
**Posljedice:** Novi predmet = jedan unos u katalog. Kasnije katalog dolazi iz baze
bez promjene UI logike. Migracija na bazu je triviјalna jer model već odgovara.

## ADR-002 — Hijerarhija s `institutions/faculties` od početka
**Datum:** 2026-06-01 · **Status:** prihvaćeno
**Kontekst:** Cilj je širenje na cijelo sveučilište i druga sveučilišta.
**Odluka:** Model uključuje razine ustanova/fakultet/smjer/godina/semestar već sad,
iako kreće s jednim fakultetom (FMTU Opatija, Hospitality Management).
Konvencija: `semester` ∈ {1,2} unutar `year`.
**Posljedice:** Buduće širenje ne traži migraciju sheme.

## ADR-001 — Supabase kao backend (Faza 0)
**Datum:** 2026-06-01 · **Status:** prihvaćeno
**Kontekst:** Treba pravi backend (baza, auth, storage, serverless) uz malo
održavanja i nisku cijenu na početku; jedini autor sam ja.
**Odluka:** Supabase (Postgres + Auth + Storage + Edge Functions); frontend ostaje
na Vercelu. Razmatrano: čisti statički JSON (premalo za UGC kasnije) i custom
Node+Postgres (previše održavanja za sada).
**Posljedice:** Besplatan tier dovoljan na početku; lagan put do UGC-a (Faza 1+).
