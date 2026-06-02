# Arhitektonske odluke (ADR)

Svaka značajna odluka: kontekst → odluka → posljedice. Najnovija na vrhu.

---

## ADR-007 — Navigacija: puni drill-down (Fakultet → Smjer → Godina → Predmet)
**Datum:** 2026-06-02 · **Status:** prihvaćeno
**Kontekst:** Stranica treba biti strukturirana po fakultetu/smjeru/godini; korisnik
želi da se eksplicitno vidi hijerarhija ("uđeš na fakultete → smjerovi → godine").
**Odluka:** Puni drill-down korak po korak: Start → Fakulteti → Smjerovi → Godine →
Predmeti (po semestru), čak i kad razina ima samo jednu opciju. Breadcrumbs na svakom
ekranu. (Razmatran "pametni skip" jednolične razine — odbijen jer korisnik želi
eksplicitnu strukturu.) Logo se zadržava; vizualni stil minimalistički, dark.
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
