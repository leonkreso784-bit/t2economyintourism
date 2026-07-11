# CRUD_PLAN — F4 Admin CRUD (Sokrat Study)

> **Status (2026-07-08):** ▶ U TIJEKU. F4.1/4.2 (identitet+write-path+verzioniranje) ✅ · F4.3a/b (detekcija+viewer) ✅ · **F4.3c (prva UI cigla — edit kartice end-to-end) ✅ KOMPLETNA + ŽIVO VERIFICIRANA** (c-1 write+verzija+revert; c-2 propagacija midterm↔final) · **Playwright LOGIN (storageState) ✅ — pozitivan admin-put automatiziran** (`test:authed` 4/4 + CI `authed` job). **F4.4 quiz+fill+learn ✅ ŽIVO VERIFICIRANO** (edit persistira+propagira na final+revert; prod 51 red netaknut). Sve na grani `foundation/f4` (PREVIEW, NIJE produkcija).
> **🧭 SMJER PROMIJENJEN (korisnik 2026-07-08/09):** nastavak F4 ide kroz **[UGC.md](UGC.md)** brick-slijed (U1 staging ✅ 2026-07-10 → U2a id-jevi ✅ 2026-07-11 `b490172` → U2.5 ADR-022 / U2b → U3 draft-sloj → U4 publish-RPC → …): CRUD prelazi na **draft→objavi** model; „F4.4-kategorije" se radi kao **U6 strukturne operacije** unutar draft-moda; F4.5 (export/dry-run) i F4.6 (flip) = U9+. Dosadašnji F4.1–F4.4 rad je temelj i ostaje (RLS, verzije, editori se prevezuju na draft). Plan-ugovor za **F4 (custom Admin CRUD)** — uređivanje sadržaja
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
  - **✅ F4.3c-1 GOTOVO + ŽIVO VERIFICIRANO (2026-07-06/08, commit `7d1368a`):** svaka kartica u vieweru dobije „uredi" (admin-only, `.admin-edit-btn`) → edit question/answer u `<sokrat-modal>` formi (`#adminEditModal`, na S4 primitivu) → lagana validacija (neprazni stringovi) → **write JEDNOG reda** (`catalog.resolve[lessonId]`, npr. `te2M1`): read-modify-write blob `subject_content` pod admin JWT-om (RLS `is_admin()`) → auto-verzija (F4.2 trigger snapshota STARI payload) → toast → **in-memory patch** (`window[var]` + viewer re-render, bez reloada). ⚠ **Final NAMJERNO nesinkroniziran u ovoj cigli** (propagacija = c-2). Piše na `_saveCard()` u `js/admin.js`; i18n `admin.edit*`/`admin.save*` (en/hr); CSS `.admin-edit*` u `profile.css`. Cache `20260706205405`.
    - **Gate (statika):** verify 0/0, typecheck 0, unit 8/8, validate:content 0/0, validate:schema 54/54, bump:check 95/95, build:css --check + export:json --check 0. **Playwright admin+components+a11y 56/0** (novi test: edit-gumbi skriveni ne-adminu + viewer renderira).
    - **✅ ŽIVA VERIFIKACIJA (2026-07-08, kroz Playwright LOGIN — vidi niže):** authed-sesijom + PRAVIM UI-em uređen `te2 First Midterm` `demand/0` → **promjena PERSISTIRALA U BAZU** (marker vidljiv u `subject_content`, ne samo memoriji) → **revert vratio original** (produkcija netaknuta, `content_rows=51`). Kroz Supabase potvrđeno: **2 reda `content_versions`** (`op=UPDATE`, `edited_by=leonkreso784`, snapshot STAROG payloada = undo+audit „tko/kad/što"). ⚠ Ta 2 test-audit-reda ostala (auto-mode blokirao brisanje iz append-only audita bez izričite upute — očekivano; korisnik odlučuje briše li ih). ⚠ Preview i prod dijele jednu Supabazu → svaki write mijenja živi sadržaj (edit-pa-revert).
  - **✅ PLAYWRIGHT LOGIN (storageState) — INFRA + ŽIVO (2026-07-08, commit `d57c5fd`):** zatvara [[live-login-verifies-crud]] rupu (pozitivan admin-put je sad AUTOMATIZIRAN). `playwright.config.js` (dotenv + uvjetni `auth-setup`/`authenticated` projekti kad je `TEST_ADMIN_EMAIL/PASSWORD` set → default suite netaknut) · `tests/auth.setup.js` (signInWithPassword+is_admin → storageState `tests/.auth/admin.json`, gitignored) · `tests/admin-detect.authed.spec.js` (isAdmin=true + admin VIDI edit-gumbe). `npm run test:authed` **3/3 živo** (prava admin-prijava). CI: zaseban `authed` job (gate-an na secret, preskoči ako ga nema). **Write-testovi svjesno NISU automatizirani** (dijeljena prod baza + append-only audit; nema izoliranog test-DB-a na free tieru).
  - **✅ F4.3c-2 GOTOVO + ŽIVO VERIFICIRANO (2026-07-08, cache `20260708012428`):** write sad zakrpa i **sestrinske redove koji dijele kategoriju** (`_propagateToSiblings` u `js/admin.js`): dohvati sve redove predmeta osim primarnog, na svakom koji ima `(catId, idx)` primijeni istu izmjenu (RLS + snapshot). `final` = `Object.assign(M1,M2)` kopija → ostaje u sinku s midtermom. Best-effort (primarni je već spremljen; djelomičan sib-neuspjeh → toast `admin.propWarn`). `admin.finalNote` sad kaže „sinkronizira se kroz ovu lekciju i finalni". **Živa provjera (authed Playwright): edit `te2M1 demand/0` → i te2M1 I te2Final dobili marker → revert vratio oba na original (prod netaknut, oba u sinku).** Gate: verify/typecheck/unit/schema/bump:check 0, Playwright admin+components 13/13, test:authed 3/3. **→ time je F4.3c (prva UI cigla, edit kartice end-to-end) KOMPLETNA.**
- Skriveni admin ulaz (gate na `is_admin()`; nevidljiv ne-adminu).
- Tok: `SokratContent.loadLesson` → renderiraj flashcards → odaberi 1 → uredi front/back u `<sokrat-modal>` formi → **validacija kroz JSON Schema** → spremi (read-modify-write grubog blob-a pod RLS) → verzija → `<sokrat-toast>` → live re-read dokaže promjenu.
- **Test:** Playwright e2e (admin uredi karticu, vidi promjenu; ne-admin ne može ući). Novi `tests/admin.spec.js`.
- **Gate:** cijeli pipeline (identitet→write→verzija→live) dokazan na jednom entitetu.

### ▸ F4.4 — Proširi tipove
quiz / fill / learn / kategorije (dodaj-obriši-presloži), isti obrazac; svaki tip = svoja cigla + test.

- **✅ F4.4-quiz GOTOVO + ŽIVO VERIFICIRANO (2026-07-08, commit `9c2c979`, cache `20260708021017`).** Isti write-pipeline kao flashcards (RMW jednog reda → F4.2 verzija → `_propagateToSiblings` u sestrinske redove → live re-render), proširen na quiz. Novo u `js/admin.js`:
  - **Generalizirani helperi** (`_patchObj`/`_patchWindowVar`/`_patchInMemory`/`_propagateToSiblings`) sada primaju `arrayKey` (`flashcards`|`quiz`|…) + `applyItem(item)` umjesto hardkodiranog `flashcards`+`{q,a}` → flashcard ponašanje bit-identično (pozivi ažurirani), quiz se nakalemi bez duplikacije.
  - **Viewer** crta i quiz stavke po kategoriji (`.admin-subhead` Flashcards/Quiz; quiz preview = opcije s označenim točnim `.is-correct`); quiz-only kategorije se sad prikazuju (prije guard tražio flashcards). Edit-gumb nosi `data-type` → delegat grana na quiz/flashcard editor.
  - **Quiz-editor** (`#adminQuizModal` na `<sokrat-modal>`): pitanje + **dinamičke opcije 2–6** (dodaj/obriši, radio „točan"). Validacija odražava JSON Schemu (question neprazan · 2–6 nepraznih opcija · valjan `correct` indeks). `image`/`imageAlt` netaknuti (mijenja se samo question/options/correct). i18n `admin.quiz*`/`admin.options`/`admin.addOption`/… (en/hr); CSS `.admin-quiz-*` u `profile.css`.
  - **Gate:** verify 0/0, typecheck 0, test:unit 8/8, validate:content 0/0, validate:schema 54/54, bump:check 95/95, build:css/export:json --check 0. **Playwright admin+components+a11y 60/0** (novi non-admin test: quiz preview se renderira + quiz edit-gumbi skriveni ne-adminu) · **`test:authed` 4/4** (novi: admin klik na quiz edit-gumb otvara editor s ≥2 reda opcija + jednim „točan" + prefilanim pitanjem).
  - **✅ ŽIVA VERIFIKACIJA (authed Playwright + Supabase MCP):** edit `te2M1 fundamentals/quiz[0]` (pitanje **i** `correct` 1→2) → **persistiralo u te2M1 I te2Final** (propagacija radi za pitanje i točan odgovor) → **revert** vratio oba bit-točno na original. `content_versions` 6→**10** (+4 = 2 spremanja × M1+Final = undo+audit uhvatio svaki write); `subject_content` **51 red netaknut**. ⚠ Ta +4 audit-reda (uk. 10 te2) ostaju (append-only, auto-mode ne briše bez izričite upute).
- **✅ F4.4-fill GOTOVO + ŽIVO VERIFICIRANO (2026-07-08, cache `20260708024031`).** Najjednostavniji tip (`sentence` + `answer`), isti generalizirani pipeline (`arrayKey='fillBlanks'`). Novo u `js/admin.js`: viewer crta fill stavke po kategoriji (`.admin-subhead` „Fill blanks"; preview = rečenica + odgovor, reuse `.admin-card-*` → **0 novog CSS-a**); **fill-editor** `#adminFillModal` (`<sokrat-modal>`) = rečenica + odgovor; validacija odražava JSON Schemu (**rečenica mora sadržavati prazninu `_______`** = 7 podvlaka + neprazna; odgovor neprazan); `hint` (ako postoji) netaknut. Edit-gumb `data-type="fill"` → delegat grana. i18n `admin.fill`/`admin.editFill`/`admin.sentence`/`admin.fillBlankErr`/… (en/hr).
  - **Gate:** verify/typecheck/unit/validate:content/validate:schema/bump:check/build:css --check/export:json --check 0. **Playwright admin+components+a11y 64/0** (novi non-admin fill-preview test) · **`test:authed` 5/5** (novi: admin klik na fill edit-gumb otvara editor s rečenicom-blank + odgovorom).
  - **✅ ŽIVA VERIFIKACIJA (authed Playwright + Supabase MCP):** edit `te2M1 fundamentals/fillBlanks[0]` (rečenica **i** odgovor; blank očuvan) → **persistiralo u te2M1 I te2Final** → **revert** vratio oba bit-točno. `content_versions` 10→**14** (+4); `subject_content` **51 red netaknut**.
  - **⬜ Nakon fill:** **learn** ✅ (niže) → **kategorije**.
- **✅ F4.4-learn GOTOVO + ŽIVO VERIFICIRANO (2026-07-08, cache `20260708060435`).** Learn je **jedan objekt po kategoriji** (`cat.learn = {title?, content, image?}`, NE niz) → vlastiti **object-put** (`_patchLearnObj`/`_patchLearnInMemory`/`_propagateLearnToSiblings`, bez `idx`; array-put quiz/fill NETAKNUT). Viewer crta learn po kategoriji (`.admin-card--learn`; preview = naslov + čist izvadak bez HTML tagova preko `_adminExcerpt`). **Learn-editor** `#adminLearnModal` (širi + monospace textarea) = naslov (opcionalno) + **sirovi HTML sadržaj** (uređuje se kao tekst, sprema doslovno — bez render/sanitize, kao u izvoru; KaTeX/HTML očuvani); prazan naslov → makne ključ; `image` netaknut. i18n `admin.learn*` (en/hr); CSS `.admin-learn*`.
  - **🐛 NALAZ živog verifikatora — `_saveLearn` je TRIMAO `content`:** learn HTML ima namjernu uvlaku (`\n                <h3>…`) → trim bi tiho brisao formatiranje pri SVAKOM editu i onemogućio bit-točan revert. **Popravljeno: content se NE trima** (validira nepraznost preko `.trim()`, sprema sirovo). Kratka polja (title/question/answer/opcije/rečenica) i dalje trimana (poželjno). *(Zašto se isplati strogi živi verify.)*
  - **Gate:** verify/typecheck/unit/validate:content/validate:schema/bump:check/build:css --check/export:json --check 0. **Playwright admin+components+a11y 68/0** (novi non-admin learn-preview test) · **`test:authed` 6/6** (novi: admin klik na learn edit-gumb otvara editor s HTML sadržajem).
  - **✅ ŽIVA VERIFIKACIJA (authed Playwright + Supabase MCP):** edit `te2M1 fundamentals.learn` (naslov **i** 4 KB HTML sadržaj) → **persistiralo u te2M1 I te2Final** → **revert** bit-točan (sha1 == izvor). ⚠ Pali prvi run (prije no-trim fixa) ostavio marker u bazi → **odmah vraćeno na kanonsku vrijednost iz JSON izvora** (sha1 `be6ceff8…`, oba reda, MCP-potvrđeno); `subject_content` **51 red netaknut**. `content_versions` (te2) → **22** (learn epizoda skuplja zbog restore-a).
  - **⬜ Nakon learn:** **kategorije** (dodaj/obriši/presloži — mijenja strukturu, najrizičnije).

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
