# CRUD_PLAN — F4 Admin CRUD (Sokrat Study)

> **Status (2026-07-06):** ▶ POČETAK. Plan-ugovor za **F4 (custom Admin CRUD)** — uređivanje sadržaja
> kroz sučelje bez deploya. Odluke fiksirane u **ADR-021**; sjeda na F2 jezgru (S1 Repo, S2 JSON, S3 AppState, S4 Web Components).
> Filozofija: **cigla po cigla, svaka testabilna/reverzibilna** (FOUNDATION_PLAN §1). Vježbe se NIKAD ne diraju (BUG-012).

## 0. Cilj
Autor (kasnije i studenti — UGC nakon F6) uređuje predmete/lekcije/kategorije/kartice/kviz/fill/learn kroz UI.
**Custom, ne CMS.** Baza postaje autoritativna u runtimeu (stupnjeviti flip); datoteke ostaju generirani export (git/offline).

## 1. Odluke (ADR-021) — fiksirano
| Os | Izbor | Zašto |
|----|-------|-------|
| Write-path | **direktno preglednik → Supabase, admin RLS** | nula server-koda; ADR-016 (admin-JWT+RLS ne treba `service_role`) |
| Admin identitet | **`profiles(user_id, role)` + `is_admin()`** | UGC-spremno (ADR-018), RLS-testabilno (1E) |
| Model podataka | **grubi blob** (`subject_content`, 1 red = 1 window-var) | read-path netaknut; verzija = snapshot |
| Safety-net | **`content_versions` od prve cigle** (undo+audit) + dry-run diff | krivi edit nikad trajan gubitak |
| Flip | **stupnjeviti, predmet-po-predmet, nakon čistog diffa** | dual-read već nosi fallback → reverzibilno |
| Prva cigla | **jedna kartica end-to-end** | najtanji rez dokazuje cijeli pipeline |

## 2. Što temelj VEĆ daje
- `subject_content` (public-read RLS, **bez write-policya**) — čitanje riješeno, treba samo admin-write policy.
- Auth (email+lozinka), ContentRepository (`window.SokratContent`), JSON Schema (`schema/subject-content.schema.json`), Web Components (toast/modal/confirm), dual-read loader (DB→JSON→`.js`).

## 3. Brick-slijed

### ▸ F4.1 — Admin identitet (schema + RLS, BEZ UI-ja)  ✅ GOTOVO + VERIFICIRANO (2026-07-06)
*Primijenjeno na bazu (`f4-admin.sql`), Leon seedan `role='admin'` (3 ostala `user`), `rls-check` zelen (anon vidi 0 `profiles`). Commit `5ee749e`.*
**Ugovor:** baza zna „tko je admin"; klijent to može PROČITATI, ali NE promijeniti.
- `supabase/f4-admin.sql` (idempotentno, additivno na `schema.sql`):
  - `profiles(user_id uuid pk → auth.users on delete cascade, role text not null default 'user', created_at)`.
  - `handle_new_user()` trigger na `auth.users` (auto-provisionira profil `role='user'`, security definer).
  - `is_admin()` SQL fn (security definer, stable) — `exists(profiles where user_id=auth.uid() and role='admin')`; reusable u budućim policyjima.
  - RLS: `profiles_select_own` (`auth.uid()=user_id`). **NEMA client insert/update/delete** → `role` immutable iz klijenta (mijenja se samo dashboard/`service_role`).
  - Seed (dashboard): `update profiles set role='admin' where user_id=(select id from auth.users where email='leonkreso784@gmail.com');`
- **Test:** `rls-check.js` proširen — anon vidi 0 redova `profiles` (RLS ne curi); skip-if-table-absent dok se SQL ne primijeni.
- **Gate:** RLS-test zelen (nakon primjene SQL-a), frontend NETAKNUT.
- **Handoff:** korisnik primijeni `f4-admin.sql` u Supabase dashboardu + seed → onda verify.

### ▸ F4.2 — Write-path + verzioniranje (schema + RLS, BEZ UI-ja)  ✅ GOTOVO + VERIFICIRANO (2026-07-06)
*Primijenjeno (`f4-content-write.sql`, migracija `f4_content_write_and_versioning`). Live-dokazano (rollback-transakcije, produkcija netaknuta = 51 red): admin UPDATE prolazi + `content_versions` snapshot (op=UPDATE, edited_by=admin, payload snapshotiran); običan korisnik I anon → 0 redova. `rls-check` proširen (anon vidi 0 `content_versions`), zelen.*
- Admin-write RLS na `subject_content`: `for insert/update using (is_admin()) with check (is_admin())`.
- `content_versions(id, subject_id, var_name, payload jsonb, edited_by, edited_at)` — **append-only snapshot na svaki write** (undo + audit). RLS: admin read (`is_admin()`), insert dozvoljen adminu.
- Snapshot mehanizam: trigger na `subject_content` UPDATE (spremi STARI red u `content_versions` prije prepisa) — atomično, ne ovisi o klijentu.
- **Test:** dokaz da admin piše + verzija se zapiše; ne-admin (anon/običan user) odbijen (401/403).
- **Gate:** write-path + versioning dokazani; read-path i dalje netaknut.

### ▸ F4.3 — PRVA UI CIGLA: uredi jednu karticu end-to-end
- Skriveni admin ulaz (gate na `is_admin()`; nevidljiv ne-adminu).
- Tok: `SokratContent.loadLesson` → renderiraj flashcards → odaberi 1 → uredi front/back u `<sokrat-modal>` formi → **validacija kroz JSON Schema** → spremi (read-modify-write grubog blob-a pod RLS) → verzija → `<sokrat-toast>` → live re-read dokaže promjenu.
- **Test:** Playwright e2e (admin uredi karticu, vidi promjenu; ne-admin ne može ući). Novi `tests/admin.spec.js`.
- **Gate:** cijeli pipeline (identitet→write→verzija→live) dokazan na jednom entitetu.

### ▸ F4.4 — Proširi tipove
quiz / fill / learn / kategorije (dodaj-obriši-presloži), isti obrazac; svaki tip = svoja cigla + test.

### ▸ F4.5 — Export-generator (4D)
baza → `data/json/<id>/*.json` (reuse `export:json` shape) + **dry-run diff** (4E.3) baza↔datoteka. Git-povijest/offline fallback ostaju.

### ▸ F4.6 — Stupnjeviti source-of-truth flip (4A)
autoritet baza-nad-datotekom **predmet-po-predmet**, tek nakon čistog dry-run diffa. Dual-read to podržava → reverzibilno.

## 4. Nepovredivo
- **Vježbe = JS moduli** (BUG-012) — CRUD ih ne dira; ostaju izvan baze.
- **Deploy samo uz potvrdu**; DB-migracije primjenjuje korisnik u dashboardu (ili uz izričit OK preko MCP-a).
- **Cache bump** na svaku `js/css` izmjenu (`npm run bump`); docs nakon svake cigle.
- **Engine se ne mijenja za sadržaj**; CRUD gradi UI iz S4 primitiva.

## 5. Reference
ADR-021 (ove odluke) · ADR-013 (content arhitektura) · ADR-016 (`service_role`→Edge) · ADR-018 (UGC-spremno) ·
FOUNDATION_PLAN §Faza 4 · BUG-012 · `supabase/schema.sql` · `schema/subject-content.schema.json`.
