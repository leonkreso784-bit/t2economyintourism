# Arhitektonske odluke (ADR)

Svaka značajna odluka: kontekst → odluka → posljedice. Najnovija na vrhu.

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
eksplicitnu strukturu.) Logo se zadržava.
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
