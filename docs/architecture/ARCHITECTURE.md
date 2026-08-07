# Arhitektura i tehnička razrada

> Živi dokument. Cilj: pretvoriti statički study app u skalabilnu platformu.
> Gradi se **korak po korak**; svaki korak je malen, testabilan i ne smije
> srušiti live verziju. Napredak se prati u [ROADMAP.md](../plan/ROADMAP.md) i [PROGRESS.md](../records/PROGRESS.md).

## Ciljana arhitektura

```
FRONTEND (Vercel, vanilla JS — minimalne izmjene)
   • dohvat lakog "catalog" manifesta
   • lazy load sadržaja predmeta tek na otvaranje
   • postojeći Learn / Flashcards / Quiz / Fill / Progress UI (nepromijenjen)
        │ public read                         │ admin (login — samo ja)
        ▼                                      ▼
SUPABASE                                  ADMIN UI (/admin, zaštićen)
   • Postgres (katalog + sadržaj)            • CRUD hijerarhije i sadržaja
   • Auth                                    • (kasnije) upload + AI generacija
   • Storage (kasnije: PPT/PDF/slike)
   • Edge Functions (kasnije: ingest+Claude)
```

**Backend hosting:** Supabase (Postgres/Auth/Storage) — vidi [BACKEND.md](./BACKEND.md) (ADR-008).
**Stanje (2026-07-13):** Auth + cloud-sync napretka LIVE; **admin draft→objavi tok LIVE od 2026-07-13** (F4 deploy); **sadržaj se čita iz baze direktno preko
supabase-js (anon key + RLS), NE preko `/api`** (ADR-011) — privilegirano (`service_role`) ide **SAMO u Supabase Edge Functions, ne Vercel `/api`** (ADR-016); admin-write = direktno klijent→RLS (ADR-021).
**Read-path redoslijed (od F2 2A): baza → `data/json/*.json` (predmeti s `dataFormat:'json'`, 18/18) → `.js` fallback.**

Postojeća schema kategorije ostaje **identična** — UI logika se ne dira.

## Hijerarhija podataka

```
institutions (sveučilište)      ← spremno za buduće širenje
└── faculties (fakultet)        → FMTU Opatija
    └── programs (smjer)        → Hospitality Management
        └── (year, semester)    → year=studijska godina; semester∈{1,2} unutar godine
            └── subjects (predmet)
                └── lessons (lekcija / kolokvij)
                    └── categories (tema)
                        └── content_items: flashcard | quiz | fill | learn (JSONB)
```

**Trenutni raspored (Hospitality Management):**
- 2. god, sem 1: Tourism Economics, E-Business, Accounting, Entrepreneurship and Innovation
- 2. god, sem 2: Economics in Hospitality, Marketing, Tourism Geography, Food & Nutrition
- **2. god = 8/8 ✅ KOMPLETNO**
- **1. god = 9/9 ✅ KOMPLETNO:** Business Informatics, Special Interest Tourism, Management, Microeconomics, Statistics,
  Macroeconomics, **Academic Writing** (prvi kroz generator), Traffic in Tourism, **Mathematics** (zadnji, LIVE 2026-06-27) · ⛔ Intro to Hospitality blokiran (nema PDF-ova)

## Model baze (ciljano, Supabase/Postgres)

```
institutions   (id, name)
faculties      (id, institution_id→, name)
programs       (id, faculty_id→, name)
subjects       (id, program_id→, slug, name, short_name, icon, color,
                description, year, semester, features JSONB, status)
lessons        (id, subject_id→, slug, name, description, sort)
categories     (id, lesson_id→, slug, name, icon, color, sort)
content_items  (id, category_id→, type['flashcard'|'quiz'|'fill'|'learn'],
                payload JSONB, sort, status)
-- Faza 1+ (rezervirano): users, subscriptions, source_docs, shares, scores
```
`payload JSONB` čuva **postojeći oblik** (npr. flashcard `{question,answer,explanation}`),
pa migracija ne mijenja UI.

> **Napomena (2026-06-23):** gore je CILJANI normalizirani model (za admin CRUD/UGC kasnije). Trenutni
> **read-path** (ADR-011) koristi jednostavniju tablicu **`public.subject_content`** (1 red = 1 window var,
> cijeli objekt kategorija kao `jsonb`) — dovoljno za čitanje, migracijski isto sigurno. Puni normalizirani
> model uvodimo s admin CRUD-om (B10). Stvarna shema: `supabase/schema.sql`. **⚠️ U `subject_content` idu SAMO
> čisto-podatkovni varovi (M1/M2/Final = flashcards/quiz/fill/learn). VJEŽBE (`*Exercises`) NISU u bazi** — sadrže
> `generate()` funkcije koje JSON briše → uvijek se učitaju iz datoteke (`content.codeScripts`). Vidi BUG-012. Stanje: 51 redova / 17 predmeta.

## Content pipeline (Faza 1+, PPT/PDF → gradivo)
Upload → ekstrakcija teksta/slika → chunking → Claude generira po postojećoj schemi
→ draft → ljudski pregled/uredi → publish. Kontrola troška: kvote, kasnije "donesi
svoj API ključ".

## Math rendering (kvantitativni predmeti — KaTeX)
✅ implementirano (ADR-009): **KaTeX** (CDN, bez build-a) za prikaz LaTeX formula u Learn/Flashcards/Quiz/Fill.
Helper `renderMath(container)` (`js/math.js`) poziva se nakon što sekcija ubaci HTML. **⚠️ Delimiteri su
currency-safe: inline `\( \)`, blok `\[ \]` / `$$ $$` — JEDAN `$` se NE koristi** (postojeći `$NN` valutni iznosi
bi se inače parsirali kao matematika). Micro/Macro/Statistika koriste „worked problems" + grafove kao slike.
Schema struktura se NE mijenja (LaTeX je običan string u payloadu → migracijski sigurno).

---

## Razrada po koracima (M0 — Faza 0)

Redoslijed je namjeran: prvo frontend postaje data-driven **lokalno** (bez backenda,
nula rizika), pa tek onda Supabase. Tako live verzija radi nakon svakog koraka.

### Blok A — Frontend data-driven (lokalno)
- **A1 — `data/catalog.js`** ✅ — jedinstveni izvor istine; `content.resolve` generalizira `getSubjectData()`.
- **A2 — refaktor `js/config.js`** ✅ — `subjectDataMap`/`getSubjectData()` iz catalog-a; svi `data-*.js` na `window`. Verificirano.
- **A3 — sidebar iz catalog-a** ✅ — `renderSubjectsSidebar()`, uklonjen ručni HTML. LIVE.
- **A4 — lazy loading** ✅ — `js/content-loader.js` (`loadSubjectContent(subjectId)`) učita
  `content.scripts` predmeta **tek na otvaranje** (`initStudyPage` je async + loader); statički
  `data-*.js` maknuti iz `index.html`. Ovo je **šav prema backendu**: u Bloku B `loadSubjectContent`
  postaje `fetch('/api/subject/...')` bez izmjene ostatka app-a. Test `lazy-load.spec.js`.
- **A5 — UI hijerarhije** ✅ — **puni drill-down nav** (`#browse-page`, M0.5, ADR-007).

### Blok B — Backend: Supabase (ADR-008/011, [BACKEND.md](./BACKEND.md))
- **B6 ✅** — Supabase projekt + schema (`progress` + `subject_content`). **B7 ✅** — `scripts/migrate-content.js` (`data/*` → baza).
- **B8 ✅** — read-path: `loadSubjectContent` čita iz baze **direktno (supabase-js anon, ne `/api`)** + file-fallback (ADR-011).
- **B9 ✅ (kao F4.1, 2026-07-06)** — admin identitet (`profiles`+`is_admin()` RLS). **B10 🟡 (= F4/U-staza; dosadašnje cigle DEPLOYANE na produkciju 2026-07-13)** — admin CRUD (draft→objavi, `EDITOR_PLAN.md`; U4 publish-RPC ✅ + U-UX dizajn ✅ 🚀 DEPLOYANO na PROD 2026-07-14 (`79f17c7..056d963`); **U6 strukturne ops ✅ + U7 learn-blokovi/renderer ✅ → U8 vizualni editor „Studio" U TIJEKU (U8.1–U8.5d ✅ 2026-07-22: skelet+blok-editor+kartice/kviz/fill+inline-tekst+boja/link+media slika/video/formula/tablica; **U8.9 math-tipkovnica MathLive ✅ INTEGRIRANA 2026-07-23** [math-field autorska strana + Casio-paleta/renderirane labele; izlaz LaTeX→student KaTeX nepromijenjen] + **R1 grana-sync s main ✅** [55↑/0↓]; slijedi U8.5e/f + U8.10 → U8.6 vizual; ideje U8.7 upload/U8.8 chart zapisane)**, grana `feature/u6-structural-ops`, PREVIEW); source-of-truth flip na bazu = U9+/F4.6.

### Blok F — Platforma-first temelj (FOUNDATION_PLAN, ADR-013/014)
- **F1 ✅ LIVE** — reliability rails: CI/CD (`.github/workflows/ci.yml`) + `tsc --checkJs` (scoped) + hardening + TVRDI gateovi (axe/layout-guard/Lighthouse) + RLS-test.
- **F2 2B ✅ LIVE — `ContentRepository` (S1) šav:** `js/content-repo.js` → `window.SokratContent`
  (`listSubjects/getSubject/isLessonComingSoon/loadLesson/isLoaded`) objedinjuje 3 dosad razbacana puta dohvata
  (catalog metapodaci + `loadSubjectContent` async + `getSubjectData` resolve). `navigation.js:initStudyPage` sada zove
  `SokratContent.loadLesson(...)` (fallback na stari dvokorak). **NULA promjene ponašanja** (DB↔datoteka fallback ostaje u loaderu).
  Ovo je formalizirani „šav prema backendu" iz A4 — budući SW (F3), CRUD (F4) i tutor idu kroz Repo. Test `content-repo.spec.js`.
- **F2 2E ✅ LIVE — error monitoring:** `js/monitoring.js` → `window.SokratMonitor` (Sentry, consent-gated preko `consent.js`,
  Loader EU/DE, samo hvatanje grešaka, `sendDefaultPii:false`, release `sokrat-study@…`). Test `monitoring.spec.js`.
- **F2 2A ✅ LIVE (2026-07-02) — S2 čisti JSON format (dual-read):** study sadržaj = čisti JSON u
  **`data/json/<subjectId>/<varName>.json`** (1 datoteka = 1 window-var; 51 datoteka). Loader grananje:
  **baza → JSON (catalog `content.dataFormat:'json'`, 18/18 predmeta) → `.js` fallback**. `.js` OSTAJE izvor
  istine — `.json` je generirani export (`npm run export:json <id>`); **nakon izmjene `.js` migriranog predmeta
  obavezan re-export** (CI drift-gate `export:json -- --check`). Strojni ugovor: `schema/subject-content.schema.json`
  (draft-07) + `npm run validate:schema`. Vježbe NIKAD u JSON (BUG-012, `codeScripts` uvijek iz `.js`). Accounting
  odgođen. Test `tests/dual-read.spec.js` (JSON put · shadow bajt-ekvivalencija · exercise put · fallback).
- **F2 2C ✅ LIVE (deployano 2026-07-03, ff-merge `73f3809..f54048a`) — S3 AppState:** SVI mutable globali iz `config.js` (5 grupa:
  nav/cards/quiz/fill/session) → **`window.AppState`** (`js/app-state.js`, učitava se prije config.js); config.js bez ijednog mutable
  `let` (`progress`/`analytics` namjerno ne — persist-lifecycle). Funkcionalni testovi `tests/app-state.spec.js` (klik kao korisnik).
- **F2 2D ▶ (2D.1/2D.2a/2D.2b ✅ LIVE `d2b1e48..9b62428`; 2D.2c ✅ LIVE `ba1c6f9..4ed6e75`, sve deployano 2026-07-04) — UI-primitivi = Web Components (light-DOM):** `<sokrat-toast>`
  (`js/components/sokrat-toast.js`, `showToast()` delegira) + `<sokrat-modal>` primitiv (`js/components/sokrat-modal.js` + `css/sokrat-modal.css`:
  open/close/ESC/backdrop/scroll-lock/fokus/Tab-trap) + learn image-viewer (`#imageModal`) migriran + **auth modal (`#authModal`) migriran** (2D.2c, `js/auth.js`+`css/auth.css` override; zadnji ad-hoc overlay pojeden)
  + **`<sokrat-confirm>`** (2D.3, `js/components/sokrat-confirm.js`+`css/sokrat-confirm.css`: branded confirm-dijalog GRAĐEN NA `<sokrat-modal>` = prva kompozicija; `window.askConfirm()`→Promise; zamijenio 3 native `confirm()`; budući GDPR delete). Testovi `tests/components.spec.js`.
  **✅ 2D.3 LIVE `7d88e5c..df67766` (2026-07-04) → time F2 (reusable jezgra) KOMPLETNA (2A/2B/2C/2D/2E svi LIVE).**
- **F3 (performanse) — (3C.1+3B+3A) ✅ DEPLOYANO NA PRODUKCIJU 2026-07-05; 3D+3E na grani `foundation/f3d`:** redoslijed = najsigurnija cigla prva (3C→3B→3A→3D→3E; SW zadnja).
  **✅ 3C.1** auto version-bump (`scripts/bump-version.js` = JEDAN broj za app: svi `?v=`+`CONTENT_VERSION`+`SW_VERSION`; `npm run bump`/`bump:check` CI gate; ADR-017). **✅ 3B** CSS bundling
  (`scripts/build-css.js`: 26 `@import`→1 `styles.bundle.css`; `styles.css`=izvor-manifest, `index.html`→bundle; CI drift-gate; eliminiran render-blocking waterfall). **✅ 3A** Service Worker
  (`sw.js` + `js/sw-register.js`: navigacija network-first + offline app-shell fallback; asseti SWR; Supabase/CDN network-only; kill-switch; `vercel.json` `/sw.js` no-cache; „Works offline" istina).
  **3A.3 (FABLE): Fable-pregled popravio 3 nalaza u sw.js** (navigate-keš samo `res.ok`; `cache.put`→`event.waitUntil`; verzioniran precache) **+ update-flow** (`<sokrat-toast>`→`skipWaiting`→jedan reload). Testovi `tests/sw.spec.js` (offline load + update-flow e2e); app-testovi `serviceWorkers:'block'`.
  **✅ DEPLOYANO** (main `c115a5d..868dc9f`; vercel.json `"//"` komentar-incident popravljen `868dc9f`). ✅ **3D.1** blind-map→WebP (−98%) · ✅ **3D.2** async KaTeX/Fonts · ✅ **3E.1/3E.2** a11y (0 axe violationa, sve 4 stranice) — **sve DEPLOYANO 2026-07-06 → F3 KOMPLETNA LIVE.**
- **F4 🟡 U TIJEKU — dosadašnje cigle 🚀 DEPLOYANE NA PRODUKCIJU 2026-07-13 (`5d24a96..79f17c7`)** — custom Admin CRUD (= B9/B10 gore): F4.1–4.4 ✅ + draft→objavi staza (`EDITOR_PLAN.md`; U1–U4 ✅ + U-UX ✅ DEPLOYANO → smjer C „Tok" u `EDITOR_UX.md`; **U6 strukturne ops ✅ KOMPLETNE** — grana `feature/u6-structural-ops`: kategorije + stavke add/edit/reorder/remove; DB id-resync 16 eng. odrađen 2026-07-17; authed 11/11); source-of-truth flip = U9+/F4.6 — **dizajniran UGC-spreman, ali student-upload tek nakon F6** (ADR-018). **F5⬜** SRS · **F6⬜** pred-UGC sigurnost (CSP/DOMPurify/moderacija) → **UGC** → tek onda nazad na sadržaj.

### Blok C — priprema za budućnost (ne gradi se sad)
Rezervirati u modelu: `users`, `subscriptions`, `is_premium`, UGC tablice.

## Pravila rada
1. Mali koraci, svaki testabilan zasebno.
2. Live verzija radi nakon svakog koraka.
3. Postojeća schema sadržaja se ne mijenja bez jako dobrog razloga.
4. Ništa se ne briše dok zamjena nije dokazano ispravna.
