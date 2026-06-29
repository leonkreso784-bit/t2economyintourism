# FOUNDATION_PLAN — Platforma-first temelj (Sokrat Study)

> **Status:** ▶ ODLUČENO 2026-06-29, izvršavanje TEK KREĆE (0 koda napisano osim ne-deployanog i18n chromea).
> **Odluka korisnika (2026-06-29):** staviti DODAVANJE SADRŽAJA na pauzu na koliko god treba i izgraditi
> **profesionalan, reliable, reusable temelj** prije daljnjeg rasta. Cilj: platforma „brutalno napravljena",
> pripremljena za sve što planiramo (Admin CRUD, UGC, AI tutor, monetizacija).
> **Vezano:** ADR-013 (content arhitektura), ADR-014 (engineering standardi) u [DECISIONS.md](DECISIONS.md);
> `sonnet.md` (hardening checklist); [[foundation-pivot]].

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

- **1A — CI/CD (GitHub Actions + Vercel preview):** *najvažnija cigla faze.*
  - [1A.1] `.github/workflows/ci.yml` — na svaki push/PR pokreni `npm ci` → `validate:content` → `verify` → `test:unit` → `playwright`.
  - [1A.2] Playwright u CI-u (headless, instalacija browsera u workflowu); artefakti (screenshotovi) na fail.
  - [1A.3] Potvrdi da Vercel radi **preview-deploy po grani** (već uključeno) → dokumentiraj „grana → preview URL → provjera → prod" tok u TESTING.md.
  - **Done-kriterij:** push na granu = zelen/crven CI; nijedan merge u `main` ako je crveno.
- **1B — Type-safety bez build-a (JSDoc + `tsc --checkJs`):**
  - [1B.1] `tsconfig.json` (`checkJs:true`, `noEmit:true`, `allowJs:true`, `strict` postupno); `typescript` kao devDep.
  - [1B.2] `// @ts-check` + JSDoc tipovi u **1 modulu kao pilot** (npr. `js/i18n.js` ili `js/content-loader.js`).
  - [1B.3] `npm run typecheck` (= `tsc --noEmit`) + dodaj u CI (1A). **Nula runtime/build promjene** — `tsc` je samo checker.
  - **Done-kriterij:** `typecheck` zelen na pilotu; širi se modul-po-modul u kasnijim fazama (ne sve odjednom).
- **1C — Hardening v1 (sonnet.md, provjereno):** sve male, vidljive, 0-rizik. *Svaka je zasebna cigla + cache bump gdje treba.*
  - [1C.1] `vercel.json`: **makni** `X-XSS-Protection` (deprecated), **dodaj** `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  - [1C.2] `js/analytics.js` `loadProgress()`: `progress = { ...defaultProgress, ...JSON.parse(saved) }` (otpornost na pokvaren/stari localStorage).
  - [1C.3] Obriši mrtvi `lessonCategoryMap` entry (`js/config.js`) — entrepreneurship stari ID-evi (vidi BACKLOG/sonnet #4; PAZI: objekt JE referenciran u `navigation.js:545`, briše se samo mrtav entry).
  - [1C.4] „400+" u heroju (`index.html` ×3) → **dinamički `questionCount`** iz kataloga (kao `subjectCount`).
  - [1C.5] **„Works offline" copy** — privremeno na pošteno (npr. „Bez instalacije" / „Radi na mobitelu") DOK Service Worker (F3) ne učini offline istinitim. (Odluka: oslabi sad, SW kasnije.)
**Gate faze:** CI zelen, `typecheck` zelen na pilotu, verify 0/0, Playwright pun, vizualni pregled landinga.

### ▸ FAZA 2 — Reusable jezgra (srce temelja)
**Cilj:** izgraditi S1–S4 + error monitoring. Ovo otključava CRUD i čisti SW.
**Ovisnosti:** F1 (CI mora štititi ove veće refaktore).

- **2A — Čisti podatkovni format (S2):** *najvažnija, radi se JEDAN PREDMET ODJEDNOM.*
  - [2A.1] Definiraj kanonski **JSON shape** study-sadržaja (iz CONTENT_SCHEMA.md) + **JSON Schema** datoteku.
  - [2A.2] Skripta `data.js → data.json` (mašinerija postoji: `migrate-content.js` već vadi podatke za bazu).
  - [2A.3] **Dual-read tranzicija:** loader čita NOVI `.json` ako postoji, inače stari `.js` (ništa se ne lomi tijekom migracije).
  - [2A.4] Migriraj predmete jedan-po-jedan (gate po svakom). Vježbe OSTAJU JS moduli (S2 pravilo).
  - **Done-kriterij:** svi study-podaci portabilni kao JSON; `.js` postaje generirani export (ne uređuje se ručno).
- **2B — ContentRepository (S1):**
  - [2B.1] Definiraj sučelje: `getSubject(id)`, `getLesson(id,lessonId)`, `listSubjects()`… neovisno o izvoru.
  - [2B.2] Implementacije: `FileRepo` (JSON datoteke) + `SupabaseRepo` (već postoji read-path) iza istog sučelja; flag bira izvor; fallback ostaje.
  - [2B.3] `content-loader.js` postaje tanak adapter na Repo. **Svi pozivi sadržaja idu kroz Repo.**
  - **Done-kriterij:** prebacivanje datoteka↔baza = config; CRUD i SW kasnije koriste isti Repo.
- **2C — AppState (S3):** *oprezno, inkrementalno — NE sve globale odjednom.*
  - [2C.1] Uvedi `AppState = { current:{}, study:{}, quiz:{}, ... }` namespace.
  - [2C.2] Migriraj **jednu skupinu globala odjednom** (npr. `current*`), s testovima, pa sljedeću. Može se djelomično odgoditi do kad CRUD/tutor zatraži.
- **2D — UI-primitivi = Web Components (S4):** *inkrementalno, light-DOM (bez Shadow DOM — čuva globalni CSS/teme).*
  - [2D.1] Pilot: `<sokrat-toast>` (najjednostavniji) → dokaži obrazac (registracija, atributi, render).
  - [2D.2] Zatim `<sokrat-modal>` (auth/profil ga koriste) → makne ad-hoc `innerHTML` + riješi XSS-brigu kontroliranim renderom.
  - [2D.3] Postupno kartice/forme; CRUD forme (F4) grade se isključivo iz ovih primitiva.
- **2E — Error monitoring:** Sentry (free) ILI mini-logger (`window.onerror`/`unhandledrejection` → Supabase tablica). Pro app zna kad pukne kod korisnika.
**Gate faze:** CI/typecheck zeleni, sav sadržaj kroz Repo, 0 regresija (Playwright pun + ručni smoke svih modova × par predmeta).

### ▸ FAZA 3 — Performanse (na čistom šavu)
**Cilj:** platforma stvarno brza i offline-sposobna.
**Ovisnosti:** F2 (SW kešira kroz ContentRepository → mora postojati čist šav).
- [3A] **Service Worker** (cache-first za `index.html`/`js`/`css`/`data`/JSON + mrežne odgovore Repo-a) → **„Works offline" postaje ISTINA** → vrati/ojačaj copy.
- [3B] **CSS bundling** — 23 `@import` u jedan konkateniran fajl (build-korak `cat`/`cleancss`); ostaje no-framework.
- [3C] **Auto version-bump** skripta (`scripts/bump-version.js`) — generira `?v=` iz git-hasha/timestampa, zamijeni sve tokene odjednom (gasi BUG-004 rizik zaboravljanja).
- [3D] **Optimizacija slika** (blind-map png, learn slike) + lazy-loading slika.
- [3E] **a11y prolaz** (tipkovnica/ARIA/kontrast) — pro + SEO.
**Gate:** Lighthouse/perf provjera, offline test (DevTools offline), CI zelen.

### ▸ FAZA 4 — Authoring: custom Admin CRUD (veliki kamen)
**Cilj:** uređivanje sadržaja kroz sučelje, bez deploya. **Custom (korisnikova odluka), NE CMS.**
**Ovisnosti:** F2 (S1 Repo + S2 format + S4 primitivi su preduvjet — bez njih CRUD je krpa).
- [4A] **Source-of-truth flip:** baza postaje autoritativna u runtimeu; `.js`/`.json` datoteke = **generirani export** (commitan zbog gita/offline-a). Migriraj svih 17 (+HR) predmeta.
- [4B] **RLS/admin** (S6): tko smije uređivati; admin role.
- [4C] **CRUD UI** (iz S4 Web Components): popis → uredi predmet/lekciju/kategoriju/karticu/quiz/fill/learn. Validacija kroz JSON Schema (2A.1).
- [4D] **Export-generator** baza → datoteke (za git-povijest + offline fallback).
- **Izuzetak:** vježbe ostaju JS moduli (BUG-012) → CRUD ih ne uređuje (ili poseban „code editor" put kasnije).
**Gate:** uredi-spremi-vidi radi end-to-end; export reproducira datoteke bajt-stabilno; RLS testiran (ne-admin ne može pisati).

### ▸ FAZA 5 — Produkt WOW: Spaced Repetition (SRS)
**Cilj:** pravi pamet-algoritam učenja (SM-2/Anki-stil) — kartice se vraćaju u optimalnim intervalima.
**Ovisnosti:** S2 (per-card podaci) + S3 (AppState) + cloud-sync (scheduling se sinkronizira).
- [5A] Schema: per-card `{ ease, interval, dueDate, reps }` (lokalno + cloud-sync, kao postojeći napredak).
- [5B] Algoritam (SM-2) kao **reusable modul** (node-testiran, kao exercises lib).
- [5C] UI: „Review due today" tok preko SVIH predmeta; ocjena (again/hard/good/easy) → reschedule.
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

## 7. Reference
- **ADR-013** (content arhitektura) + **ADR-014** (engineering standardi) — [DECISIONS.md](DECISIONS.md)
- `sonnet.md` — vanjski hardening-checklist (tretiraj kao prijedloge za PROVJERU, ne istinu; #7 je bio netočan)
- [BUGS.md](BUGS.md) BUG-012 (vježbe nikad u bazu), BUG-004 (cache bump)
- [EXERCISES_ENGINE.md](EXERCISES_ENGINE.md) — uzor reusable podsistema
- [ARCHITECTURE.md](ARCHITECTURE.md) · [BACKEND.md](BACKEND.md) · [VISION.md](VISION.md) · [ROADMAP.md](ROADMAP.md)
- [[foundation-pivot]] (memorija)
