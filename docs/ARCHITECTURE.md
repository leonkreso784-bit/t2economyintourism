# Arhitektura i tehnička razrada

> Živi dokument. Cilj: pretvoriti statički study app u skalabilnu platformu.
> Gradi se **korak po korak**; svaki korak je malen, testabilan i ne smije
> srušiti live verziju. Napredak se prati u [ROADMAP.md](ROADMAP.md) i [PROGRESS.md](PROGRESS.md).

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

**Backend hosting:** Supabase (Postgres/Auth/Storage) — vidi [BACKEND.md](BACKEND.md) (ADR-008).
**Stanje (2026-06-23):** Auth + cloud-sync napretka LIVE; **sadržaj se čita iz baze direktno preko
supabase-js (anon key + RLS), NE preko `/api`** (ADR-011) — `/api` Vercel funkcije ostaju za admin/AI kasnije.

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
- 1. god (7 ✅): Business Informatics, Special Interest Tourism, Management, Microeconomics, Statistics,
  Macroeconomics, **Academic Writing** (prvi kroz generator) · ⬜ preostalo: Intro to Hospitality, Traffic in Tourism, Math (zadnja)

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
> model uvodimo s admin CRUD-om (B10). Stvarna shema: `supabase/schema.sql`.

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

### Blok B — Backend: Supabase (ADR-008/011, [BACKEND.md](BACKEND.md))
- **B6 ✅** — Supabase projekt + schema (`progress` + `subject_content`). **B7 ✅** — `scripts/migrate-content.js` (`data/*` → baza).
- **B8 ✅** — read-path: `loadSubjectContent` čita iz baze **direktno (supabase-js anon, ne `/api`)** + file-fallback (ADR-011).
- **B9 ⬜** — admin login (Supabase Auth). **B10 ⬜** — admin CRUD → tada baza postaje jedini izvor + normalizirani model gore.

### Blok C — priprema za budućnost (ne gradi se sad)
Rezervirati u modelu: `users`, `subscriptions`, `is_premium`, UGC tablice.

## Pravila rada
1. Mali koraci, svaki testabilan zasebno.
2. Live verzija radi nakon svakog koraka.
3. Postojeća schema sadržaja se ne mijenja bez jako dobrog razloga.
4. Ništa se ne briše dok zamjena nije dokazano ispravna.
