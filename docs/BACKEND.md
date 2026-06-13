# Backend — plan (Vercel Functions + Supabase)

> Odluka: ADR-001 (Supabase) + ADR-008 (hosting na Vercelu). Frontend ostaje statički
> na Vercelu; backend = Vercel serverless funkcije (`/api`) + Supabase (DB/Auth/Storage).

## ✅ Staza B (MVP) — Auth + cloud sync napretka (implementirano 2026-06-12)
**Što živi u bazi:** SAMO napredak korisnika (tablica `public.progress`, 1 red = 1 localStorage
ključ, `jsonb`). Sadržaj predmeta i dalje u `data/*` fajlovima (staza A, kasnije, jednom).

- **Bez `/api` funkcija za MVP:** frontend govori direktno sa Supabase preko supabase-js
  (CDN UMD) + **publishable key** (javan po dizajnu) — podatke štiti **RLS** (`auth.uid() = user_id`).
  Service key NIJE potreban i NE koristi se; `/api` funkcije dolaze tek kad zatrebaju
  (AI tutor, admin, content-staza A).
- **Shema:** `supabase/schema.sql` — pokrenuti u Supabase SQL editoru (idempotentno).
- **Auth (od 2026-06-13): email + LOZINKA** (`js/auth.js`; magic-link uklonjen na korisnikov zahtjev).
  Modal s tabovima **Sign in** (`signInWithPassword`) / **Create account** (ime →
  `user_metadata.display_name` + email + lozinka min 8; `signUp` s `emailRedirectTo` →
  **email potvrda obavezna**) + **Forgot password** (`resetPasswordForEmail` →
  `PASSWORD_RECOVERY` event → forma za novu lozinku, `updateUser`). Profil ima „Change password".
  Potrebna konfiguracija u Supabase dashboardu: Auth → URL Configuration → **Site URL
  `https://www.sokratstudy.com`** + **Redirect URLs (sa `/**` wildcardom!): `https://www.sokratstudy.com/**`,
  `https://sokratstudy.com/**`, `http://localhost:5050/**`**. ⚠️ Ako redirect URL-ovi NISU pravilno
  postavljeni, klik na potvrdu emaila završi na `…supabase.co` s `{"error":"requested path is invalid"}`
  (jer `emailRedirectTo` = puni URL stranice nije na allowlisti → fallback na (krivi) Site URL). `/**` pokriva
  i `/` i `/index.html`. Stari linkovi iz maila imaju potrošen token → testirati NOVOM registracijom.
  Auth → Providers → Email → **min duljina lozinke 8**. Free tier šalje ~3-4 auth maila/sat
  (potvrde + reseti) — za skalu kasnije custom SMTP (Resend i sl.).
- **Sync (`js/cloud-sync.js`):** offline-first; pull+merge na login (brojevi=max,
  string-polja=unija, objekti rekurzivno — naučeno se nikad ne gubi), diff-push 30 s +
  visibility/beforeunload. App bez računa radi identično kao prije (auth je aditivan).
- **Profile (`js/profile.js` + `css/profile.css`, `#profile-page`):** account info, sync status
  + „Sync now", progress overview po predmetu (iz localStorage), **GDPR**: „Delete cloud data"
  (briše sve `progress` retke korisnika pa odjava — da diff-push ne re-uploada lokalno) + mailto
  za potpuno brisanje računa. Ulazi u auth: `.auth-entry` gumbi (landing nav + headeri
  browse/lessons/study) — odjavljen→modal, prijavljen→Profile.
- **Pravne/info stranice (Google Ads spremnost):** statične `privacy.html` / `terms.html` /
  `faq.html` / `contact.html` (+ `css/legal.css`), linkane iz landing footera i login modala
  (pristanak na Terms/Privacy). HTML se na Vercelu ne kešira immutable → izmjene su odmah vidljive.

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
