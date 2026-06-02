# Backend — plan (Vercel Functions + Supabase)

> Odluka: ADR-001 (Supabase) + ADR-008 (hosting na Vercelu). Frontend ostaje statički
> na Vercelu; backend = Vercel serverless funkcije (`/api`) + Supabase (DB/Auth/Storage).

## Arhitektura
```
Frontend (statički, vanilla JS, fetch)
   │  fetch('/api/...')
   ▼
Vercel Functions  (/api/*.js, Node, @supabase/supabase-js)   ← isti repo, isti deploy
   ▼
Supabase  (Postgres + Auth + Storage)
```
- Vercel automatski servira `api/*.js` kao funkcije — bez framework-a/builda.
- Tajne (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, kasnije `ANTHROPIC_API_KEY`) u
  Vercel Project Settings → Environment Variables (nikad u frontend).

## API površina (planirano)
- `GET /api/catalog` — hijerarhija (faculties→programs→years→subjects/lessons), lagano, keširano.
- `GET /api/subject?slug=…` — sadržaj jednog predmeta (lazy, na otvaranje).
- `POST /api/admin/*` — CRUD (iza Supabase Auth, samo admin).
- `POST /api/ingest` — (kasnije) PDF → Claude → draft sadržaj.

## Ograničenja (bitno)
- Funkcije kratkotrajne (Hobby ~10–60s) → CRUD OK; teška AI obrada se chunka ili ide
  na zaseban worker (npr. Railway) tek u AI fazi.
- Stateless, bez trajnog diska. Cijena: Vercel Hobby besplatno; Supabase free → Pro ~$25/mj na skali.

## Plan migracije sadržaja (KLJUČNO)
**Sad NE migriramo ništa.** Sadržaj ostaje u datotekama (catalog + `data/*`), jer:
- uskoro dodajemo puno (1. godina) — migrirati sad pa opet kasnije = dupli posao;
- autorstvo u datotekama je brže i **migracijski sigurno** (ADR-006).

**Migracija ide JEDNOM, u Bloku B**, kad je sadržaj uglavnom unutra:
1. Postavi Supabase + shemu (B6).
2. Skripta pročita `data/catalog.js` + `data/*` → upiše u tablice **1:1** (B7).
3. Frontend `loadSubjectContent()` se prebaci s lokalnih datoteka na `/api` (B8).
4. Admin login + CRUD (B9/B10) → od tada DB postaje izvor istine.

**Sirovi materijali (`_materials/` PDF/JPG):** ostaju lokalni (gitignored). U Supabase
Storage idu tek ako/kad gradimo AI ingest (da ih `/api/ingest` može čitati). Inače su
samo ulaz iz kojeg nastaje sadržaj.

## Shema baze (sažeto; detalji u ARCHITECTURE.md)
`institutions → faculties → programs → subjects(year,semester) → lessons → categories
→ content_items(type, payload JSONB)`. `payload` čuva postojeći oblik (flashcard/quiz/
fill/learn) pa migracija ne mijenja UI.
