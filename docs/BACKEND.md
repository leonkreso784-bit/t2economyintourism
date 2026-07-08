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
  `https://www.sokratstudy.com`** + **Redirect URLs: `https://www.sokratstudy.com`, `https://www.sokratstudy.com/**`,
  `https://sokratstudy.com`, `https://sokratstudy.com/**`, `http://localhost:5050`, `http://localhost:5050/**`**.
  ⚠️ **STVARNI UZROK `{"error":"requested path is invalid"}` (riješeno 2026-06-14, dokazano screenshotom):
  Site URL je bio upisan BEZ sheme — `www.sokratstudy.com` umjesto `https://www.sokratstudy.com`.** Bez `https://`
  GoTrue gola hostname tretira kao RELATIVNU putanju na svojoj domeni → redirect završi na
  `https://…supabase.co/www.sokratstudy.com` (vidljivo u adresnoj traci!) → ta putanja ne postoji → error.
  **Svaki URL (Site + Redirect) MORA imati `https://`/`http://`.** Pada i email-potvrda i reset (oba koriste Site URL).
  (Sporedno: `error_code=otp_expired` u hashu = link je usto bio istekao → nakon ispravka treba SVJEŽ link.)
  NIJE bug u kodu (`js/auth.js` šalje ispravan `window.location.origin + …` = uvijek s `https://`).
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
  > **⚠️ Self-service „Obriši račun" (GDPR pravo na zaborav) — PLANIRANO, još NEMA** (trenutno samo „Delete cloud data" + mail-fallback).
  > Odlučeno (ADR-016): brisanje `auth.users` traži `service_role` → ide u **Supabase Edge Function** (`service_role` NIKAD u Vercel), NE frontend.
  > Dizajn-skica: `docs/BACKLOG.md` §Brisanje računa. Odgođeno (uz F4 ili ranije).
- **Pravne/info stranice (Google Ads spremnost):** statične `privacy.html` / `terms.html` /
  `faq.html` / `contact.html` (+ `css/legal.css`), linkane iz landing footera i login modala
  (pristanak na Terms/Privacy). HTML se na Vercelu ne kešira immutable → izmjene su odmah vidljive.

## ✅ Staza B2 — SADRŽAJ iz baze (read-path, ✅ LIVE od 2026-06-23, pushano do `569e608`)
> **AKTIVIRANO + DEPLOYANO:** schema pokrenuta u dashboardu + sadržaj migriran + `CONTENT_FROM_SUPABASE = true`.
> **Stanje baze (2026-06-27, nakon BUG-012 fixa): 51 redova / 17 predmeta / 0 redova vježbi.** (Inicijalno 49/15 → +traffic → +math gradivo → −4 reda vježbi.)
> Anon-key read provjeren, Playwright 68/68 (sadržaj iz baze). Datoteke = i dalje izvor istine + fallback.
> **⚠️ BUG-012 PRAVILO: VJEŽBE NIKAD U BAZU** (sadrže `generate()` funkcije koje JSON briše) — read-path nosi SAMO M1/M2/Final;
> vježbe+lib se učitaju iz datoteke preko `content.codeScripts` (vidi `docs/BUGS.md` §BUG-012 + `docs/archive/EXERCISES_DB_FIX_PLAN.md`).
> ⚠️ Free tier: projekt se uspava nakon ~7 dana neaktivnosti → restore je BESPLATAN; dok je uspavan sadržaj radi iz datoteka (fallback), login/sync ne. Re-sync nakon izmjene predmeta: `node scripts/migrate-content.js <id>`.
> **✅ ODLUKA (2026-07-05): Supabase Pro (€25/mj) PRIJE prvih korisnika** (backup + bez uspavljivanja) — gasi rizik gubitka napretka i login/sync padova. Do tada free tier + fallback ostaje.

**Cilj:** `loadSubjectContent()` čita sadržaj predmeta iz Supabasea umjesto iz `data/*.js`,
**direktno preko anon keya** (sadržaj je JAVAN — bez `/api` funkcija, bez service-keya na frontu),
s **fallbackom na datoteke** (offline-first; datoteke ostaju izvor istine + sigurnosna mreža).

- **Shema:** `supabase/schema.sql` → tablica `public.subject_content` (1 red = 1 window var:
  `subject_id, var_name, payload jsonb`), **public SELECT RLS** (`using (true)`). Pisanje samo service_role.
- **Migracija:** `node scripts/migrate-content.js [subjectId] [--dry]` — vm window-shim učita
  `data/<subject>/*.js` (final je već Object.assign-an u istom sandboxu) → upsert preko Supabase REST
  (`Prefer: resolution=merge-duplicates`, `on_conflict=subject_id,var_name`). Treba `SUPABASE_URL` +
  `SUPABASE_SERVICE_KEY` u `.env` (gitignored). **Migrira SAMO M1/M2/Final — NE vježbe** (BUG-012). Stanje: **51 redova / 17 predmeta**.
- **Frontend:** `js/content-loader.js` → `CONTENT_FROM_SUPABASE` flag + `_loadSubjectFromSupabase()`
  (`SokratAuth.getClient().from('subject_content').select(...).eq('subject_id', …)` → `window[var]=payload`).
  **Flag OFF** = 100% staro ponašanje (datoteke). Flag ON + tablica puna = sadržaj iz baze; greška/prazno → datoteke.
- **AKTIVACIJA (koraci):** (1) pokreni `supabase/schema.sql` u dashboardu; (2) Settings → API → kopiraj
  **service_role** key u `.env` (`SUPABASE_SERVICE_KEY` + `SUPABASE_URL`); (3) `node scripts/migrate-content.js`;
  (4) flipni `CONTENT_FROM_SUPABASE = true`, bump cache, test (online iz baze + offline fallback), commit.
- **Re-sync:** nakon dodavanja/izmjene predmeta → ponovno `node scripts/migrate-content.js <id>` (datoteke su izvor).

**🆕 JSON tier (F2 2A, ✅ LIVE 2026-07-02):** read-path je sada TROSLOJNI — **baza → `data/json/<id>/<var>.json`
(predmeti s catalog `content.dataFormat:'json'`, 18/18) → `.js` fallback**. Loader: `_loadSubjectFromJson()` u
`content-loader.js`. Kad je baza budna, sadržaj i dalje dolazi iz baze (JSON tier se ne okida); kad je uspavana/nedostupna,
JSON preuzima prije `.js`. `.json` su generirani export (`npm run export:json`) — **nakon izmjene `.js` migriranog
predmeta obavezan i re-export I `migrate-content.js` re-sync** (dva zrcala istog izvora). Vježbe i dalje SAMO `.js` (BUG-012).

**🆕 F4 Admin CRUD — write-path + identitet (▶ U TIJEKU, grana `foundation/f4` = PREVIEW; ADR-021/ADR-022):**
uređivanje sadržaja kroz sučelje, **direktno preglednik→Supabase pod admin-JWT-om + RLS** (bez server-koda; ADR-016 — admin-write ne treba `service_role`). Nove tablice (SQL u `supabase/f4-admin.sql` + `supabase/f4-content-write.sql`, primijenjeno preko MCP-a):
- **`public.profiles`** (`user_id → auth.users`, `role text default 'user'`, `created_at`) — tko je admin. `handle_new_user` trigger auto-provisionira red na svaki novi `auth.users`; **select-own RLS** (korisnik čita svoj profil; NEMA client write → `role` immutable, mijenja se samo dashboard/service_role). Helper **`public.is_admin()`** (SECURITY DEFINER) = reusable u RLS policyjima. Leon seedan `role='admin'`.
- **`subject_content` write RLS:** admin-only `insert/update/delete` (`using (is_admin())`); public SELECT ostaje. → samo admin piše sadržaj, izravno iz preglednika.
- **`public.content_versions`** (`id, subject_id, var_name, payload jsonb, op, edited_by, edited_at`) — **append-only povijest**. BEFORE UPDATE/DELETE trigger na `subject_content` (SECURITY DEFINER) snapshota STARI red = **undo + audit „tko/kad"** od prve izmjene (4E). Admin-only read RLS.
- **Frontend:** `js/admin.js` (`SokratAdmin.isAdmin()` = `client.rpc('is_admin')`) + `#admin-page` viewer. Write (F4.3c) = read-modify-write `payload` blob pod admin-JWT-om. **⚠️ `SokratAuth`/`SokratCatalog` su top-level `const` (leksički globali, NE `window` props) → referenciraj golo** ([[live-login-verifies-crud]]).
- **Datoteke ostaju izvor istine dok F4.6 ne flipne autoritet** (predmet-po-predmet, nakon dry-run diffa). `rls-check.js` čuva 4 invarijante (anon ne vidi progress/profiles/content_versions).

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
