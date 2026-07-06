# CRUD_PLAN — F4 Admin CRUD (Sokrat Study)

> **Status (2026-07-06):** ▶ U TIJEKU. F4.1/4.2 (identitet+write-path+verzioniranje) ✅ live-verificirano · F4.3a/b (detekcija+read-only viewer) ✅ live-verificirano · **F4.3c-1 (prvi write iz preglednika) KOD gotov + statika-gate zelen, čeka živu admin-prijavu na preview-u.** Sve na grani `foundation/f4` (PREVIEW, NIJE produkcija). Plan-ugovor za **F4 (custom Admin CRUD)** — uređivanje sadržaja
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

### ▸ F4.3 — PRVA UI CIGLA: uredi jednu karticu end-to-end  *(podijeljeno na a/b/c zbog rizika)*
- **✅ F4.3a GOTOVO (2026-07-06, `fc655a8`):** `js/admin.js` → `SokratAdmin.isAdmin()` (Supabase RPC `is_admin()` pod JWT-om, kеširano, osvježava se na auth-promjenu) + `.admin-only` reveal-plumbing (inline display; RLS je prava zaštita, ovo je UX) + skrivena **admin kartica u profilu** (`data-admin-open-editor` → placeholder toast) + i18n `admin.*` (en/hr). Test `tests/admin.spec.js` (modul postoji; `.admin-only` skriven za ne-admina). Gate: verify/typecheck/bump:check 0, Playwright 52/0. Cache `20260706035324`.
- **✅ F4.3b GOTOVO (2026-07-06, `28984fe`):** `#admin-page` sekcija + `navigateTo('admin')` → `renderAdminPage()` (kroz `SokratContent` S1 šav): subject → lesson picker → **read-only lista kartica po kategoriji** (question/answer). Admin/profil isključeni iz last-position. Test: `navigateTo('admin')` renderira picker predmeta→lekcija. Gate: verify/typecheck/bump:check/build:css --check 0, Playwright 197/0. Cache `20260706130643`.
- **✅ F4.3a/b LIVE-VERIFICIRANO (2026-07-06, prava admin-prijava Leon):** `isAdmin=true`, admin kartica se puno renderira, viewer učita 61 karticu (TE→First Midterm). **3 buga nađena živom prijavom + popravljena (`45489f7`, `0bc5e41`):** (1) `admin.js` koristio `window.SokratAuth` — a `SokratAuth` je top-level `const` (leksički global, NIJE window prop) → uvijek `undefined` → admin se nikad ne detektira; fix = golo `SokratAuth` (kao profile/cloud-sync); (2) `.admin-page` bez `display:none` default (sve druge `.*-page` imaju) → naslov „Admin" curio na dno SVAKE stranice; fix u `css/variables.css`; (3) native `<select>` popup bijeli (browser-default) → `color-scheme:dark` + tamni `option`. **POUKA: automatski Playwright NIJE uhvatio bug #1** (test je provjeravao samo `isAdmin===false`, što je prolazilo i dok je puknuto) → **prava admin-prijava (login-skripta / preview) je nužna za CRUD verifikaciju.** Regresijski test dodan (`#admin-page` skriven na landingu). [[live-login-verifies-crud]]
- **F4.3c podijeljen na c-1/c-2** (zbog zamke: `final` = `Object.assign` KOPIJA M1+M2 → jedan-red-write stvara midterm↔final divergenciju):
  - **✅ F4.3c-1 KOD GOTOV (2026-07-06, čeka ŽIVU verifikaciju):** svaka kartica u vieweru dobije „uredi" (admin-only, `.admin-edit-btn`) → edit question/answer u `<sokrat-modal>` formi (`#adminEditModal`, na S4 primitivu) → lagana validacija (neprazni stringovi) → **write JEDNOG reda** (`catalog.resolve[lessonId]`, npr. `te2M1`): read-modify-write blob `subject_content` pod admin JWT-om (RLS `is_admin()`) → auto-verzija (F4.2 trigger snapshota STARI payload) → toast → **in-memory patch** (`window[var]` + viewer re-render, bez reloada). ⚠ **Final NAMJERNO nesinkroniziran u ovoj cigli** (propagacija = c-2). Piše na `_saveCard()` u `js/admin.js`; i18n `admin.edit*`/`admin.save*` (en/hr); CSS `.admin-edit*` u `profile.css`. Cache `20260706205405`.
    - **Gate (statika):** verify 0/0, typecheck 0, unit 8/8, validate:content 0/0, validate:schema 54/54, bump:check 95/95, build:css --check + export:json --check 0. **Playwright admin+components+a11y 56/0** (novi test: edit-gumbi skriveni ne-adminu + viewer renderira).
    - **⏳ ČEKA:** end-to-end write TRAŽI pravu admin-sesiju (Playwright nema login, [[live-login-verifies-crud]]) → **Leon na preview-u**: uredi karticu (idealno `te2` First Midterm), spremi, potvrdi promjenu + provjeri `content_versions` red (snapshot). ⚠ **Preview i produkcija DIJELE JEDNU Supabazu** → write mijenja živi sadržaj → **edit-pa-odmah-revert** (verzija čuva original).
  - **⬜ F4.3c-2 (poslije žive potvrde c-1):** propagacija — write zakrpa i sestrinske redove koji dijele tu kategoriju (`te2Final`) → final ostaje konzistentan; test oba prikaza.
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
