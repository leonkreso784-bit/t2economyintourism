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

**Backend hosting:** Vercel serverless `/api` funkcije + Supabase (Postgres/Auth/Storage) — vidi
[BACKEND.md](BACKEND.md) (ADR-008). Frontend zove `/api` običnim `fetch`-om; baza/admin dolaze u Bloku B.

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
- 2. god, sem 1: Tourism Economics, E-Business, Accounting
- 2. god, sem 2: Entrepreneurship, Economics in Hospitality, Marketing, Tourism Geography, Food & Nutrition
- 1. god, sem 1: **Business Informatics ✅ (KOMPLETAN)** — ostalih 10 predmeta 1. god ⬜ (čeka materijale)

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

## Content pipeline (Faza 1+, PPT/PDF → gradivo)
Upload → ekstrakcija teksta/slika → chunking → Claude generira po postojećoj schemi
→ draft → ljudski pregled/uredi → publish. Kontrola troška: kvote, kasnije "donesi
svoj API ključ".

## Math rendering (kvantitativni predmeti — KaTeX)
Frontend sposobnost (plan, ADR-009): **KaTeX** (CDN, bez build-a) za prikaz LaTeX formula
(`$...$`/`$$...$$`) u Learn/Flashcards/Quiz/Fill. Helper `renderMath(container)` poziva se nakon
što sekcija ubaci HTML. Math/Micro/Macro/Statistika koriste „worked problems" konvenciju + grafove
kao slike. Schema struktura se NE mijenja (LaTeX je običan string u payloadu → migracijski sigurno).

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

### Blok B — Backend: Vercel Functions + Supabase (ADR-008, [BACKEND.md](BACKEND.md))
- **B6** — Supabase projekt + schema. **B7** — migracija catalog + svi `data/*` → baza (JEDNOM).
- **B8** — `/api/catalog` + `/api/subject` (Vercel Functions); frontend `loadSubjectContent` → `/api`.
- **B9** — admin login (Supabase Auth). **B10** — admin CRUD.

### Blok C — priprema za budućnost (ne gradi se sad)
Rezervirati u modelu: `users`, `subscriptions`, `is_premium`, UGC tablice.

## Pravila rada
1. Mali koraci, svaki testabilan zasebno.
2. Live verzija radi nakon svakog koraka.
3. Postojeća schema sadržaja se ne mijenja bez jako dobrog razloga.
4. Ništa se ne briše dok zamjena nije dokazano ispravna.
