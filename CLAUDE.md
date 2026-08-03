# CLAUDE.md — Sokrat Study (ključni kontekst)

> Ovaj fajl se učitava SVAKU sesiju. **Drži ga sažetim — samo TRENUTNO stanje, pravila i pointeri.**
> Povijest milestone-a: `docs/HISTORY.md` · stanje predmeta: `docs/subjects/README.md` · dnevnik: `docs/PROGRESS.md`.

## 🔀 TKO RADI? (role-router — provjeri PRIJE rada)
Repo ima 2 suradnika. Provjeri `git config user.name`:
- **"Leon Kreso"** (vlasnik) → nastavi po OVOM dokumentu (platforma + sve).
- **Saša Vudrag** (ili bilo tko drugi) → **STANI i pročitaj `docs/TEAM.md` §2** — tvoj opseg je SAMO content
  (`data/<subj>-hr/` + PR workflow); platformski kod, `main`, deploy i Supabase su IZVAN opsega. TEAM.md je tvoj izvor pravila.

## Što je projekt
Interaktivna platforma za učenje (flashcards / quiz / fill / learn + interaktivne vježbe). Live: **www.sokratstudy.com**.
Počelo na **FMTU Opatija** (smjer Hospitality Management), ali **cilj = UGC-platforma za SVE** (bilo koji student / škola / sveučilište, bilo koji sadržaj) — **FMTU je samo odskočna daska.** Kasnije: AI tutor + natjecanje. Vlasnik/jedini autor: **Leon Kreso**. Vizualni stil: **„čisto i bogato", dark.**

## Stack
- Frontend: **statički, vanilla JS, BEZ build-koraka/frameworka** (biblioteke preko CDN-a/vendorane su OK). Hosting: **Vercel** (git push na `main` = produkcijski deploy; grane = preview).
- Backend: **Supabase** (Postgres/Auth; projekt `naxjubnedhrbhsuasayu`) — čitanje/pisanje **direktno anon/user JWT + RLS, BEZ `/api`** (ADR-011).
  Privilegirano (`service_role`) → **SAMO Supabase Edge Functions** (ADR-016); `service_role` key SAMO u `.env` (gitignored). Publishable key u `js/auth.js` = javan po dizajnu.

## Arhitektura (najvažnije)
- **`data/catalog.js` = JEDINSTVENI IZVOR ISTINE** za predmete: `faculties → programs → (year, semester) → subjects → lessons`;
  subject ima `content.scripts` + `content.resolve` (lessonId → window-var) + `content.codeScripts` (vježbe/lib = KOD).
- **Read-path sadržaja (dual-read):** `js/content-loader.js` → **DB (Supabase) → `data/json/<id>/*.json` → `.js` fallback**; lazy po predmetu.
  S1 šav: **`window.SokratContent`** (`js/content-repo.js`) — `listSubjects/getSubject/loadLesson`. Datoteke = izvor istine do F4.6 flipa; baza = zrcalo (re-sync `scripts/migrate-content.js`).
- **Vježbe NIKAD u bazu/JSON** (BUG-012): `generate()` funkcije ne prežive serializaciju → uvijek iz `.js` preko `codeScripts`. Engine (7 tipova) se **NE mijenja za sadržaj** (sveto pravilo). [[exercises-code-vs-data]]
- **`final` lekcija = `Object.assign(M1, M2, {examPractice})`** — spljoštena KOPIJA; u bazi zaseban red → svaki write mora propagirati na final (admin CRUD to radi; kompozicija umjesto kopije = planirano u UGC smjeru).
- **Stanje:** `window.AppState` (svi mutable globali). **UI-primitivi:** `<sokrat-toast>`/`<sokrat-modal>`/`<sokrat-confirm>` (light-DOM WC) + `window.askConfirm`.
- **Auth:** email+lozinka (`js/auth.js`, CDN supabase-js, tihi fallback) + **cloud-sync napretka** (`js/cloud-sync.js`, offline-first merge unija/max). Profil + GDPR na `#profile-page`.
- **Editor/Admin CRUD (FUNKC. GOTOV):** `window.SokratAdmin` (`js/admin.js` jezgra + `js/admin-editors.js` modal-editori) + **Studio** (`#editor-page`, `js/studio.js`+`js/block-editor.js`+`js/block-editor-media.js`) + **jedan renderer** `js/blocks-renderer.js` (sigurnosna granica). Draft-mod: `window.SokratDraft` (`js/draft-store.js`) → editori pišu OPOVE (id-adresirano) → **jedini write-put = `publish_document` RPC** (SECURITY DEFINER, is_admin, base_version, atomično, `content_versions` audit). `is_admin()` RPC + `.admin-only` reveal.
- **⚠️ GOTCHA:** `SokratAuth`/`SokratCatalog` su top-level `const` (leksički globali) → referenciraj **GOLO** (`typeof X !== 'undefined'`), NE `window.X`; `SokratContent`/`SokratAdmin`/`AppState` JESU na window. [[live-login-verifies-crud]]
- **Service Worker:** `sw.js` (navigacija network-first + offline shell; asseti stale-while-revalidate; kill-switch `__swKill()`); `SW_VERSION` bumpa `npm run bump`.
- **i18n:** globalni 🌐 HR/EN toggle (`js/i18n.js`, `localStorage 'sokrat-ui-lang'`); sadržaj po programu (HR = klon-program, ADR-012).
- **Monitoring:** GA4 (`G-ME0V58NJ1Z`) + Sentry — oboje **consent-gated**; GA ponašanje mijenjati SAMO u `js/consent.js`. [[google-analytics-consent]]
- Konvencija semestra: `year` = studijska godina; `semester` ∈ {1,2}.

## Sadržaj (autorstvo)
- **Stanje svih predmeta (brojevi/izvori/posebnosti): `docs/subjects/README.md`** — 2. god 8/8 ✅ · 1. god 9/9 ✅ (⛔ Intro blokiran) · HR pilot ✅. Sadržajna staza (za NAS) PAUZIRANA (ADR-018); HR nosi Saša.
- Schema (obavezno): `docs/content/CONTENT_SCHEMA.md`. Novi predmet = mapa `data/<subject>/{midterm-1,midterm-2,final}.js`; brzo: `npm run scaffold`. 4 stara sem-2 predmeta ostaju root `data-*.js` (svjesno, ADR-015).
- PDF materijali: `_materials/` (gitignored); čitaj s `node scripts/pdf-text.js "<pdf>"` (Read ne radi za PDF). Vidi `docs/content/CONTENT_INTAKE.md`.
- **KaTeX** (kvantitativni predmeti): delimiteri **`\( \)` / `\[ \]` / `$$ $$` — NIKAD jedan `$`** (valutni `$NN`); `renderMath()` u `js/math.js`. Konvencija: `docs/content/CONTENT_SCHEMA.md` §Matematika.
- Generator predmeta (Sonnet, `.env` ključ): `docs/content/CONTENT_GENERATOR.md`. Pouke za sadržajni rad: `docs/subjects/README.md` §Pouke. Kartica-standard: kratke definicije <200 znak., detalj→learn. [[content-model-standard]]

## ⚠️ KRITIČNA PRAVILA
1. **Cache bump:** pri izmjeni BILO KOJEG `css/*.css`/`js/*.js`/`data*.js` pokreni **`npm run bump`** (svi `?v=` + `CONTENT_VERSION` + `SW_VERSION` odjednom). `bump:check` = CI gate. Bez bumpa deploy je NEVIDLJIV (immutable cache 1 god; BUG-004, ADR-017). (`.md` izmjene ne traže bump.)
2. **Deploy samo uz izričitu potvrdu korisnika** (`git push` na main = produkcija). Commit lokalno / push na feature-granu (preview) je OK. **Deploy-guard:** pre-push hook (`.githooks/pre-push`) blokira push na `main` ako `npm run preflight` padne (aktiviraj po klonu: `git config core.hooksPath .githooks`; svjestan bypass = `--no-verify`). Direktan bypass-push na `main` preskače CI → **preflight je zadnja mreža** (BUG-004).
3. **Uvijek ažuriraj `docs/`** nakon izmjene (PROGRESS/CHANGELOG + tematske; stanje predmeta u `docs/subjects/README.md`).
4. **Provjeri prije commita:** `npm run verify` + `npm run test:responsive`; nakon izmjene css-a i `npm run build:css` (`studio.css`/moduli = bundle → inače CI drift-gate padne). [[preflight-before-every-push]]
5. Radi pažljivo, korak po korak, s provjerama; pazi na bugove. **Tempo = FAZA-CHECKPOINT** (Leon 2026-08-02): teci kroz cigle unutar faze (gate na svakoj), STANI na kraju faze za OK; **deploy = uvijek izričit OK**. [[pace-short-stretches-check-in]]
6. **PRIJE SVAKOG COMPACTA (korisnikovo pravilo, 2026-06-24):** proći **APSOLUTNO SVE `.md` datoteke** (root + `docs/**` + memorija) i provjeriti točnost (status, brojevi, ADR-ovi, linkovi) — ispraviti zastarjelo PRIJE compacta. [[doc-audit-before-compact]]
7. **Nakon pusha provjeri i Vercel check na commitu, ne samo GitHub Actions** (Actions ne validira `vercel.json`!); `vercel.json` = bez komentar-ključeva (ruše schema-validaciju prije builda).
8. **Auth/RLS-gated značajke:** pozitivan put verificiraj pravom admin-prijavom (`npm run test:authed` — gađa STAGING kad su `STAGING_*` u `.env`); **write/draft tokovi se automatiziraju vs STAGING** (`sokrat-staging` = izolirani test-DB); protiv PROD-a write SAMO edit-pa-revert + Supabase MCP provjera (append-only audit). [[live-login-verifies-crud]]

## Komande
- `npm run verify` — integritet catalog-a. · `npm run typecheck` — tsc bez build-a (scoped).
- **`npm run bump`** — svi `?v=` tokeni + verzije na isti timestamp; `bump:check` = CI gate.
- **`npm run preflight`** — svi brzi deploy-gate-ovi u jednom (verify · bump:check · css-drift · typecheck · schema · export-drift · unit); pokreni PRIJE svakog main-pusha (i pre-push hook ga automatski vrti na main).
- **`npm run build:css`** — regeneriraj `styles.bundle.css` iz modula; `-- --check` = CI drift-gate.
- `npm run test:responsive` — Playwright (iPhone profili, default suite). · **`npm run test:authed`** — pozitivan admin-put (storageState; traži `TEST_ADMIN_EMAIL/PASSWORD` u `.env`; CI = zaseban secret-gated job).
- `npm run test:unit` — node unit testovi. · `npm run serve:test` — lokalni server :5050.
- `npm run validate:content [id]` — sadržajni validator. · `npm run validate:schema [id]` — JSON Schema gate (ajv).
- **`npm run check:final`** — provjeri da BAZNI `final` red == M1⊕M2(+examPractice) za sve migrirane predmete. Read-only anon; graceful skip na uspavanu bazu; **NIJE u preflight** (mrežno).
- **`npm run load-probe [N] [ROUNDS]`** — simulira razred (N paralelnih anon content-readova × rundi); mjeri latenciju + error-rate. Read-only, graceful skip na sleep, **NIJE u preflight**.
- **`npm run backup`** / **`npm run backup:verify`** — DB snapshot: svi retci → gzip-JSON + manifest sha256 pod `backups/` (gitignored; KORISNIČKI podaci). `service_role` iz `.env` (ADR-016 OK). read-only (siguran vs PROD). Restore = guarded (`--restore`, dry-run · `--confirm` · `--force-prod`).
- `npm run export:json [id] [--check]` — export u `data/json/`; **⚠️ nakon izmjene `data/*.js` migriranog predmeta OBAVEZNO re-export — inače CI drift-gate pada.** Vježbe se NE exportaju.
- `npm run scaffold -- <id> "<Naziv>" <god> <sem>` · `node scripts/pdf-text.js "<pdf>"` · **`node scripts/seed-staging.js [id]`** — seed staging sadržajem (STAGING-only guard) · generator: `docs/content/CONTENT_GENERATOR.md`.
- **Naše lokalne komande (gitignored):** `/next` (raspoređivač) · `/brick` (jedna cigla end-to-end) · `/deploy` (siguran deploy). Agenti: `content-review`/`exercise-review` (recenzenti) · `agent-builder` (tvornica). [[sokrat-agent-engine]]

## Stanje — TRENUTNO (2026-08-02; povijest: `docs/HISTORY.md` · `docs/PROGRESS.md` · `docs/EDITOR_PLAN.md §12`)
- **🎯 ŠTO SADA RADIMO:** gradimo **osobni PRIVATNI UGC-graditelj gradiva „od nule"** — ugovor + fazni plan u **`docs/CREATE_BACKEND_SPEC.md` v3 (vizija POTVRĐENA)**. Korisnik slaže VLASTITO ugniježđeno stablo (svoji folderi: fakultet/godina/predmet/tema…, imena i mjesta po želji — „nešto unutar nečega"), a u **study-čvorovima** gradi kartice/kviz/fill/learn **POSTOJEĆIM editorom + istim rendererom**. **Privatno, na profilu, BEZ objavljivanja na javni katalog** (to još ne radimo). Model: `nodes` (self-ref stablo, owner-RLS) + `node_content` (reuse content-payload). Zvijezda = **UGC**; platforma za SVE, FMTU = odskočna daska → entitet institucijski-agnostičan. Kasnije: **MCP** (vanjski AI „spoji se, pretvori PDF-ove u gradivo"). **Fazni plan F0–F5** (F0 spec✓ · **F1 ✅ IZVEDEN na STAGINGU 2026-08-02, gate 51/51** — `nodes`+`node_content`+`node_content_versions` audit+tvrda owner-RLS+**7 RPC-ova** (create/rename/move/reorder/delete/restore/publish_node); artefakt = **`supabase/f1-nodes.sql`** (idempotentan, isti fajl ide na PROD u F5; md5-otisak 13/13 fajl==baza); rezultati = spec §9; odluka = **ADR-024** · **F2 ✅ IZVEDEN 2026-08-03** — „Moji materijali" na profilu: `js/my-materials.js` (`window.SokratMaterials`) + `css/my-materials.css` + kartica `#myMaterials` u `js/profile.js`; stablo/CRUD/inline-rename/soft-delete+undo/**drag** (gnijezdi u folder · presloži među braćom); unit 24/24 · authed 5/5 · puni authed 32/32; PROD netaknut; rezultati = spec §10 · **F3 ✅ IZVEDEN 2026-08-04, gate 9/9** — editor u study-čvoru: node-mod u `studioBridge` (`setNode`/`nodeCtx`; `_enterDraftMode`→`node_content`, `_publishDraft`→`publish_node`), gumb „Uredi gradivo" na study-retku → `SokratStudio.openNode()` (crumb „Moji materijali › «naziv»", panel čvora umjesto katalog-stabla), **„＋ Nova sekcija"** (prije NIJE postojala — nov čvor je bio slijepa ulica), „←"→profil; **ključno: draft-stroj je generičan po ključu → čvor koristi sintetički `node:<uuid>` pa draft/opovi/autosave/blok-editor rade BEZ IZMJENE** (`draft-store`/`block-editor`/`blocks-renderer`/`admin-editors` = 0 promjena); grana `feature/f3-node-editor`; rezultati = spec §11 · **SLIJEDI F4 = polish + puni E2E**). ⚠️ **Matura = IZBAČENA.** Tempo = faza-checkpoint.
- **⚠️ OTVORENA NIT (2026-08-03, Leon):** Leon je htio vidjeti F2 uživo i **nije mogao ništa napraviti** — klijent gađa **PROD**, a `nodes` na produkciji **ne postoje** (namjerno, to je F5) → kartica uvijek prazna/nedostupna. Opcije: **(a)** staging-override u konzoli + prijava kao `test-admin@sokrat.local` (krhko — traži odjavu s prod-računa), **(b)** primijeniti **`supabase/f1-nodes.sql` na PROD** (čisto additivno, 0 `ALTER` na postojećem, `publish_document` nedirnut, isti fajl dokazan na stagingu) — **traži Leonov IZRIČIT OK (produkcijski DDL)**. Detalji: `docs/PROGRESS.md` 2026-08-03-b.
- **🎨 Leonova presuda o frontendu (2026-08-03):** *„frontend će morat biti potpuno preuređen… ali je zadnji na redu — moramo se potrudit da SVE savršeno radi prije nego što ga uredimo."* → prioritet: **funkcija besprijekorna → tek onda vizual.**
- **⚠️ Osobni graditelj = ZASEBAN otok (ADR-024):** javni katalog / 22 predmeta / studentski vrući put / `publish_document` = **NEDIRNUTI**. `anon` nema NIŠTA, `authenticated` ima **samo SELECT** — **svaki upis ide kroz SECURITY DEFINER RPC s owner-checkom** (`owner_id = auth.uid()`). Editor se veže kroz **`SokratAdmin.studioBridge`** ([admin.js:800-820]) — F3 mijenja SAMO 3 IO-metode (`setLesson`/`enter`/`publish`), draft-store/block-editor/renderer nedirnuti.
- **Editor (admin CRUD) = FUNKCIONALNO GOTOV** — Studio: stablo/canvas/inspektor; kartice/kviz/fill/learn+blokovi uredljivi; media (slika-upload/video/KaTeX-MathLive/tablica-paste); F7 kvadratić-model; drag-drop blokova+sekcija; boje sekcija. **Reuse za novi graditelj = ~100 %.** Preostali editor-polish (U8.6 vizual · F8 lista · U8.8 chart · mobilni) = NEobavezno. Detalji: `docs/EDITOR_PLAN.md §12` + `docs/EDITOR_FEEDBACK.md`. [[editor-must-be-real-product]]
- **NA PRODU (`main`=`8b99775`, kôd `3634a1e`; Vercel READY):** 22 predmeta (17 EN u Supabase + 5 HR file-served) · auth+cloud-sync+profil+GDPR · Studio editor · **rizik-sprint 7/7** (keep-alive cron protiv free-tier sleepa · supabase-js pin+SRI · backup · load-probe 90/90) · GA4+Sentry (consent) · SW offline · i18n HR/EN · CI+deploy-guard. Tablica predmeta: `docs/subjects/README.md`.
- **STAGING Supabase:** `sokrat-staging` (ref `czljmvigkgiajzjxtndq`, ista org) — write/draft testovi (prod audit ostaje čist). `test:authed`/`rls-check` gađaju staging kad su `STAGING_*` u `.env`; seed `node scripts/seed-staging.js`. Test-admin creds u `.env` (`STAGING_*`, `TEST_ADMIN_*`).
- **Napomene:** Supabase free-tier **spava ~7 dana neaktivnosti** (keep-alive cron gasi; app fallbacka na datoteke, login/sync ne rade dok se ne restorea) · `content_versions` = append-only audit → **brisanje SAMO uz izričit OK** · PWA drži staru ikonu do reinstalacije (nije bug) · `mcp-admin/` = untracked read-only spike (ne dira prod) [[mcp-admin-spike]].
- **👥 TIM: Saša Vudrag** (content-suradnik; student prog. inž.) — opseg SAMO HR sadržaj + PR-workflow (`docs/TEAM.md`, role-router gore; ADR-023). Trenutno: **S4+S5 za `macroeconomics/statistics/math/accounting-hr`** (HR vježbe = **SAMO string-polja**, `generate/answer/type` nedirljivi, `test:unit` zelen). **DEPLOY-PERMISIJA:** Saša mergea VLASTITI PR uz Leonov IZRIČIT OK; direktan push nemoguć. Sašini content-PR-ovi → `content-review` agent recenzira prije merge-a. [[content-model-standard]]
- **HR-ekspanzija:** HR 1. god × 3 smjera FMTU (MUH/MUT/MOR), dijele vezne predmete (ADR-022 placement dual-mode ✅ `b969892`; `docs/CATALOG_ARCHITECTURE.md`). Stvarni programi + podjela veznih = S7 (silabusi presuđuju). **Kad HR program potpun → HR→Supabase** (Leon/Claude `migrate-content.js`, NE Saša). [[hrv-program]]
- **PAUZIRANO za NAS (ADR-018 duh vrijedi — student uploada PODATKE, nikad KOD):** 3. godina · novi EN sadržaj. **REVIDIRANA SEKVENCA (Leon 2026-08-02): DOVRŠI osobni UGC-graditelj → frontend redizajn → objava/dijeljenje + MCP.** (Staro „F5 SRS → F6 → UGC" NADGLAŠENO; matura izbačena.) [[follow-recorded-plan-dont-reopen]]

## Ključne odluke (jedan red po ADR-u; puni tekst `docs/DECISIONS.md`)
- **ADR-024:** osobni UGC-graditelj = ZASEBAN otok (`nodes` stablo + owner-RLS + RPC-only upis), NE proširenje javnog kataloga; dva publish-puta (`publish_document` admin · `publish_node` vlasnik) svjesno koegzistiraju; MCP kasnije koristi iste RPC-ove.
- **ADR-013:** podatak≠ponašanje — study=JSON, vježbe=JS moduli; ContentRepository šav; cilj = baza autoritativna (flip u F4).
- **ADR-014:** engineering standardi — CI/CD · typecheck bez build-a · Web Components (light-DOM) · error monitoring; vanilla/no-build etos ostaje.
- **ADR-015:** tech-debt triage „briše li ga F4?" (root data-*.js + free-tier sleep = svjesno NE popravljati).
- **ADR-016:** `service_role` → SAMO Supabase Edge Functions, nikad Vercel; prvi konzument = GDPR „Obriši račun" (još NE postoji; skica u BACKLOG §Brisanje računa).
- **ADR-017:** cache-busting = JEDAN uniformni auto-bumpani token (`npm run bump`), ne per-file hash.
- **ADR-018:** platforma-first do UGC-a; student uploada PODATKE, nikad KOD. (Osobni graditelj = PRIVATNI podaci, owner-RLS → respektira duh; javna objava = kasnija faza uz sigurnost.)
- **ADR-019:** maksimalno-rizične cigle na FABLE modelu (drugi model = jeftin sigurnosni sloj); handoff = testiran commitani checkpoint.
- **ADR-020:** točnost sadržaja = dvo-ključni verifier (Sonnet piše → Opus provjerava → korisnik presudi) — gradi se u fazi sadržaja.
- **ADR-021:** F4 CRUD = direktni preglednik→Supabase RLS-write · `profiles.role` · grubi blob · stupnjeviti flip · safety-net od prve cigle.
- **ADR-022:** identitet predmeta preko programa (placement≠sadržaj, prefiks fakulteta, dijeli-unutar-fakulteta) — za HR-ekspanziju.
- Starije: **ADR-006** (autorstvo u datotekama) · **ADR-007** (drill-down nav ✅) · **ADR-009** (KaTeX, currency-safe ✅) · **ADR-010** (generator ✅) · **ADR-011** (read-path = Supabase anon+RLS bez `/api` ✅) · **ADR-012** (HR = klon-program, UI-jezik zasebna os ✅) · ADR-001/008 (Supabase temelj; Railway tek za AI worker).
- **Logo:** `assets/logo.svg` — vektorizirani originalni Sokrat (potrace), glava ispunjava krug, indigo gradijent; favikoni iz SVG-a.

## Dokumentacija (`docs/` — indeks: `docs/README.md`)
**Aktivno:** **`CREATE_BACKEND_SPEC.md` (▶ AKTIVNO — osobni UGC-graditelj „od nule"; potvrđena vizija + fazni plan F0–F5)** · `EDITOR_PLAN.md` (editor-detalji §12; editor funkc. gotov) · `EDITOR_UX.md` / `EDITOR_FEEDBACK.md` (editor dizajn) · `FOUNDATION_PLAN` (F0–F6) · `CATALOG_ARCHITECTURE` · `HRV_PLAN`.
**Referenca:** `PRD` · `VISION` · `ARCHITECTURE` · `BACKEND` · `ROADMAP` · `TESTING` · `MONETIZATION` · `TEAM`.
**Sadržaj:** `content/` (SCHEMA · GUIDE · INTAKE · GENERATOR · EXERCISES_ENGINE) · `subjects/` (tablica predmeta + planovi).
**Zapisnici:** `HISTORY` (vremenska crta) · `CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG`. **Arhiva:** `archive/`.
