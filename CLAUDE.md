# CLAUDE.md — Sokrat Study (ključni kontekst)

> Ovaj fajl se učitava SVAKU sesiju. **Drži ga sažetim — samo TRENUTNO stanje, pravila i pointeri.**
> Povijest milestone-a: `docs/records/HISTORY.md` · stanje predmeta: `docs/subjects/README.md` · dnevnik: `docs/records/PROGRESS.md`.

## 🔀 TKO RADI? (role-router — provjeri PRIJE rada)
Repo ima 2 suradnika. Provjeri `git config user.name`:
- **"Leon Kreso"** (vlasnik) → nastavi po OVOM dokumentu (platforma + sve).
- **Saša Vudrag** (ili bilo tko drugi) → **STANI i pročitaj `docs/workflow/TEAM.md` §2** — tvoj opseg je SAMO content
  (`data/<subj>-hr/` + PR workflow); platformski kod, `main`, deploy i Supabase su IZVAN opsega. TEAM.md je tvoj izvor pravila.

## Što je projekt
Interaktivna platforma za učenje (flashcards / quiz / fill / learn + interaktivne vježbe). Live: **www.sokratstudy.com**.
Počelo na **FMTU Opatija** (smjer Hospitality Management), ali **cilj = UGC-platforma za SVE** (bilo koji student / škola / sveučilište, bilo koji sadržaj) — **FMTU je samo odskočna daska.** Kasnije: AI tutor + natjecanje. Vlasnik/jedini autor: **Leon Kreso**. Vizualni stil: **„čisto i bogato", dark.**

## Stack
- Frontend: **statički, vanilla JS, BEZ build-koraka/frameworka** (biblioteke preko CDN-a/vendorane su OK). Hosting: **Vercel** (git push na `main` = produkcijski deploy; grane = preview).
- Backend: **Supabase** (Postgres/Auth; projekt `naxjubnedhrbhsuasayu`) — čitanje/pisanje **direktno anon/user JWT + RLS, BEZ `/api`** (ADR-011).
  Privilegirano (`service_role`) → **SAMO Supabase Edge Functions** (ADR-016); `service_role` key SAMO u `.env` (gitignored). Publishable key u `js/auth.js` = javan po dizajnu.
  **Edge Functions (`supabase/functions/`):** `delete-account` (GDPR brisanje; identitet ISKLJUČIVO iz JWT-a preko `getUser()` — `user_id` iz body-ja je eskalacija privilegija). ⚠️ **Supabase odbija obrisati korisnika koji posjeduje objekte u Storageu** → slike se brišu PRIJE korisnika; `lesson-images` se NIKAD ne dira (odnio bi katalog).

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
- Schema (obavezno): `docs/architecture/CONTENT_SCHEMA.md`. Novi predmet = mapa `data/<subject>/{midterm-1,midterm-2,final}.js`; brzo: `npm run scaffold`. 4 stara sem-2 predmeta ostaju root `data-*.js` (svjesno, ADR-015).
- PDF materijali: `_materials/` (gitignored); čitaj s `node scripts/pdf-text.js "<pdf>"` (Read ne radi za PDF). Vidi `docs/workflow/CONTENT_INTAKE.md`.
- **KaTeX** (kvantitativni predmeti): delimiteri **`\( \)` / `\[ \]` / `$$ $$` — NIKAD jedan `$`** (valutni `$NN`); `renderMath()` u `js/math.js`. Konvencija: `docs/architecture/CONTENT_SCHEMA.md` §Matematika.
- Generator predmeta (Sonnet, `.env` ključ): `docs/workflow/CONTENT_GENERATOR.md`. Pouke za sadržajni rad: `docs/subjects/README.md` §Pouke. Kartica-standard: kratke definicije <200 znak., detalj→learn. [[content-model-standard]]

## ⚠️ KRITIČNA PRAVILA
1. **Cache bump:** pri izmjeni BILO KOJEG `css/*.css`/`js/*.js`/`data*.js` pokreni **`npm run bump`** (svi `?v=` + `CONTENT_VERSION` + `SW_VERSION` odjednom). `bump:check` = CI gate. Bez bumpa deploy je NEVIDLJIV (immutable cache 1 god; BUG-004, ADR-017). (`.md` izmjene ne traže bump.)
2. **SVAKI push na `main` traži Leonov IZRIČIT OK** — `git push` na main = produkcija. **Vrijedi i za čiste `.md` pusheve** (Leon, 2026-08-10: *„da sve ide uz moj OK"*; povod: nakon odobrenog mergea pushao sam još 4 docs-commita po vlastitoj procjeni opsega — odobrenje jedne radnje ne proteže se na sljedeću). Pravilo #3 traži da docs **napišeš**, ne da ih **pushaš**. Commit lokalno / push na feature-granu (preview) je i dalje slobodan. [[push-to-main-needs-ok]] **Deploy-guard:** pre-push hook (`.githooks/pre-push`) blokira push na `main` ako `npm run preflight` padne (aktiviraj po klonu: `git config core.hooksPath .githooks`; svjestan bypass = `--no-verify`). Direktan bypass-push na `main` preskače CI → **preflight je zadnja mreža** (BUG-004).
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
- **`npm run diff:db [id]`** — usporedi bazu s datotekama prije re-synca. **`migrate-content.js` radi upsert = piše PREKO baze**, a admin kroz Studio smije uređivati živi sadržaj → re-sync naslijepo može pojesti tuđu izmjenu, a `content_versions` je audit, ne undo. Read-only anon; ispisuje kodne točke ne-ASCII znakova (ćirilično `С` U+0421 i latinično `C` U+0043 izgledaju isto). **NIJE u preflight** (mrežno).
- **`npm run check:functions`** — Edge Functions na PRODUKCIJI: sve iz `supabase/functions/` mora biti deployano **i tražiti JWT** (401), a poznati stranci moraju biti obrisani (404). **Bez ijednog ključa** (401 vs 404 razlikuje postojanje). Povod: `bright-function` je bio **drugi, nezapisani endpoint za brisanje računa** sa sha256 identičnim `delete-account`-u — stara kopija destruktivnog koda ne dobiva buduće guardove. **NIJE u preflight** (mrežno).
- **`npm run test:storage`** — sigurnosni gate bucketa `node-images` (slike osobnog gradiva) kroz HTTP: vlastiti upload · tuđi prefiks · javni URL · anon · potpisani URL. **WRITE-test → TVRDO odbija prod** (samo STAGING). Graceful skip bez `STAGING_*`. **NIJE u preflight** (mrežno).
- **`npm run test:delete-account`** — gate Edge Functiona `delete-account`. **HARD-DELETE → TVRDO odbija prod.** Dvije razine: T1–T3 (odbijanje neovlaštenog poziva) trče sa `STAGING_*`; T4/T5 (stvarno brisanje) traže i `STAGING_SUPABASE_SERVICE_KEY` jer jednokratnog korisnika `signUp` ne može stvoriti (staging traži potvrdu maila). **NIJE u preflight** (mrežno).
- **`npm run load-probe [N] [ROUNDS]`** — simulira razred (N paralelnih anon content-readova × rundi); mjeri latenciju + error-rate. Read-only, graceful skip na sleep, **NIJE u preflight**.
- **`npm run backup`** / **`npm run backup:verify`** — DB snapshot: svi retci → gzip-JSON + manifest sha256 pod `backups/` (gitignored; KORISNIČKI podaci). `service_role` iz `.env` (ADR-016 OK). read-only (siguran vs PROD). Restore = guarded (`--restore`, dry-run · `--confirm` · `--force-prod`).
- `npm run export:json [id] [--check]` — export u `data/json/`; **⚠️ nakon izmjene `data/*.js` migriranog predmeta OBAVEZNO re-export — inače CI drift-gate pada.** Vježbe se NE exportaju.
- `npm run scaffold -- <id> "<Naziv>" <god> <sem>` · `node scripts/pdf-text.js "<pdf>"` · **`node scripts/seed-staging.js [id]`** — seed staging sadržajem (STAGING-only guard) · generator: `docs/workflow/CONTENT_GENERATOR.md`.
- **Naše lokalne komande (gitignored):** `/next` (raspoređivač) · `/brick` (jedna cigla end-to-end) · `/deploy` (siguran deploy). Agenti: `content-review`/`exercise-review` (recenzenti) · `agent-builder` (tvornica). [[sokrat-agent-engine]]

> **„F4", „U8", „K6" u starim zapisima = ZATVORENE oznake faza** (temelj F1–F6 · graditelj F0–F5 · editor U/F7/K). Sve tri serije su ispunjene i žive samo kao povijest u `docs/archive/` i `docs/plan/ROADMAP.md`. **Nova faza dobiva ime, ne slovo.**

## Stanje — TRENUTNO (2026-08-08)

> **Povijest NIJE ovdje.** Milestone-i: `docs/records/HISTORY.md` · dnevnik po sesijama: `PROGRESS.md` ·
> što je isporučeno: `CHANGELOG.md` · bugovi i lekcije: `BUGS.md` · otvorene ideje: `BACKLOG.md`.
> **Ovdje stoji samo ono što vrijedi SAD** (ADR-027).

- **🎯 TEKUĆA FAZA = FRONTEND REDIZAJN NA TAILWIND** (spec: `docs/plan/FRONTEND_REDIZAJN.md`, ADR-028; opseg = cijela platforma **i** editor; cigle **C0–C7** — C1 = temelj **bez ijedne vizualne promjene**, pa landing → **vlastiti materijal + editor** → browse → modovi. **Next.js razmotren i ODBIJEN** — obrazloženje u ADR-028, ne otvarati iznova). **✅ C0 JE NA PRODUKCIJI** (2026-08-10, `00e134b..0e2843a`) — ulaz u vlastiti materijal je ravnopravno odredište; provjereno na živoj stranici (token = repo, ulaz prvi u navigaciji, 0 JS grešaka). Put do njega je dao **4 pouke koje vrijede za C1–C7**: ① ciljani podskup testova NE dokazuje ciglu (tvrdio 41 prošao, puna suita rekla **35 palo**); ② **uzorak širina u gateu je i sam rupa** — dvije sesije su istog dana popravile isti bug i **obje prošle vlastiti gate**; ③ **CI/Linux mjeri font ~4px šire od Windowsa** → rezerva <5px je crvena na CI-u; ④ jedna ikona u traci srušila je pojas od 400px. **SLJEDEĆE = C1** (ništa ga ne blokira). ✅ **BUG-024 i BUG-025 su NA PRODUKCIJI** (2026-08-10, `5843f7e..5997232`; provjereno kroz živi kviz, ne samo po deployu). BUG-025 je bio teži i **pogađao je javni katalog**: sadržaj sa znakom `<` gubio se u kvizu/learnu/dopunama/napretku, pa je jedno pitanje u `statistics` bilo **neodgovorljivo**. Iz toga je izašao **stalni obrazac**: prikaz sadržaja ide isključivo kroz `renderContentBlocks()` (izvorna brana u `blocks-renderer.test.js`), a **svaki tekst iz podataka koji ide u `innerHTML` mora kroz `SokratBlocks.esc`** — sigurnosna granica je dosad pokrivala samo **blokove**, a ne i tekst stavki. Prethodna faza **„Mjera i zaborav" je ISPUNJENA i na produkciji** (2026-08-08): strop duljine kartice (200 upozorenje / **500 tvrda blokada**; politika = `js/card-limits.js`, čitaju je editor **i** `validate:content`) + **self-service brisanje računa** (Edge Function `delete-account`, `test:delete-account` 18/18 vs staging). Zapisana sekvenca dalje: **frontend redizajn** (uklj. „akcent = CIJELA kartica") → **objava/dijeljenje** (doseg presuđen: **link s tajnim tokenom, bez javne biblioteke**) → **MCP**. ⚠️ **Matura = IZBAČENA.** Otvoreno u `docs/records/BACKLOG.md`: **M5b** (skratiti **25 JEDINSTVENIH** kartica preko 500 — 48 je s kopijama u `final` — PA `maxLength` u shemu; obrnuto ruši CI).
- **NA PRODU** (**točan SHA, token i Vercel-ref = zadnji „🚀" redak u `docs/records/CHANGELOG.md`** — ovdje se namjerno ne prepisuju, mijenjaju se svakim deployem; ADR-027): **22 predmeta** (17 EN u Supabase + 5 HR file-served) · auth + cloud-sync + profil + GDPR · **Studio editor** (admin) · **osobni UGC-graditelj „Moji materijali"** · **faza „Materijal od nule do učenja"** — materijal se gradi od nule, iz njega se uči, boje sekcije vidljive u sva 4 moda · rizik-sprint 7/7 · GA4 + Sentry (consent-gated) · SW offline · i18n HR/EN · CI + deploy-guard. Tablica predmeta: `docs/subjects/README.md`.
- **🎨 Frontend je ZADNJI na redu** (Leon): *„sve mora savršeno raditi prije nego ga uredimo."* → funkcija prije vizuala. [[frontend-last-function-first]]
- **⚠️ Osobni graditelj = ZASEBAN OTOK (ADR-024):** javni katalog · 22 predmeta · studentski vrući put · `publish_document` = **NEDIRNUTI**. `anon` nema ništa, `authenticated` ima **samo SELECT**, **svaki upis ide kroz `SECURITY DEFINER` RPC s owner-checkom** (`owner_id = auth.uid()`).
- **Editor (admin CRUD) = funkcionalno gotov** — Studio: stablo/canvas/inspektor, svi modovi uredljivi, media (slika/video/KaTeX-MathLive/tablica-paste), drag-drop, boje. Preostali polish je **neobavezan**: `docs/archive/EDITOR_PLAN.md §12`. [[editor-must-be-real-product]]
- **STAGING Supabase:** `sokrat-staging` (ref `czljmvigkgiajzjxtndq`) — write/draft testovi, da prod-audit ostane čist. `test:authed`/`rls-check` gađaju staging kad su `STAGING_*` u `.env`; seed = `node scripts/seed-staging.js`.
- **⏳ Grane izvan `main`-a:** Sašine `content/entrepreneurship-hr` (3 commita) i `content/ebusiness-hr` (1) — **obje diraju `data/catalog.js` + cache-tokene i znatno su iza** → traže rebase + `npm run bump`; druga po redu će konfliktirati. Mergeane `docs/stage-a` i `docs/reorg` smiju se obrisati.
- **👥 Saša Vudrag** (content-suradnik) — opseg **SAMO HR sadržaj + PR-workflow** (`docs/workflow/TEAM.md`, role-router gore; ADR-023). Sad: **S4+S5** za `macroeconomics/statistics/math/accounting-hr` (HR vježbe = **samo string-polja**, `generate/answer/type` nedirljivi). Mergea vlastiti PR **uz Leonov izričit OK**; direktan push nemoguć. PR-ovi → `content-review` agent. **Sljedeći zadatak nakon ova 4 = nije određen.** [[content-model-standard]]
- **HR-ekspanzija:** HR 1. god × 3 smjera FMTU dijele vezne predmete (ADR-022; `docs/architecture/CATALOG_ARCHITECTURE.md`). Kad HR program bude potpun → **HR u Supabase** (Leon/Claude `migrate-content.js`, ne Saša). [[hrv-program]]
- **PAUZIRANO za nas:** 3. godina · novi EN sadržaj (ADR-018: student uploada PODATKE, nikad KOD).
- **Sitni dug (ne blokira):** siročad u Storageu · advisor-WARN `snapshot_content_version` (anon ga smije zvati — zatvoriti revoke-obrascem) · staging poravnati s `supabase/f1-nodes.sql`.
- **Napomene:** Supabase free-tier **spava ~7 dana** neaktivnosti (keep-alive cron to gasi; app tad fallbacka na datoteke, login/sync ne rade) · `content_versions`/`node_content_versions` = **append-only audit**, brisanje **samo uz izričit OK** · PWA drži staru ikonu do reinstalacije (nije bug) · `mcp-admin/` = untracked read-only spike [[mcp-admin-spike]].
## Ključne odluke — samo one koje MIJENJAJU današnji rad

> Puni tekst i sve starije: **`docs/records/DECISIONS.md` (ADR-001…028)**.
> Ovdje su ADR-ovi koji su **živa ograničenja**, ne povijesno obrazloženje.

- **ADR-029:** **UGC je GLAVNI proizvod**, javni katalog (22 predmeta) je **jedan izvor gradiva**, ne srce platforme. „Moji materijali" prestaju biti pododjeljak profila i postaju **ravnopravno odredište** (stranica + ulaz u navigaciji i na landingu). **Ne popušta ništa sigurnosno** — ADR-024/025/018 stoje netaknuti; ovo je odluka o **istaknutosti**.
- **ADR-028:** frontend ide na **Tailwind v4, ali SAMO preko CLI-ja** (generirani CSS se commita, kao i dosad `styles.bundle.css`) — **CDN nikad** (kompajler u pregledniku se tuče sa SW-om i immutable cacheom). **Tailwind NIKAD ne ulazi u `data/`** — gradivo zadržava semantičke klase, inače stil živi u podatku. **Dinamički sastavljene klase (`'bg-' + boja`) su zabranjene** — Tailwind skenira izvor, ne runtime; paleta od 8 boja ostaje na CSS varijablama.
- **ADR-027:** znanje ide u **kod i testove**; proza nosi samo **ZAŠTO**. Jedna činjenica = **jedno mjesto**. Rub koji prepoznaš isti čas dobiva test — inače je zapis samo uredno dokumentiran propust (povod: BUG-023).
- **ADR-026:** korisnik gradi **„materijal"**, spremnik je **„polica"** (EN ostaje `folder`); „gradivo" = javni katalog. **Mobilno autorstvo ide preko korisnikovog AI-a (MCP)**, ne preko editora na dodir. MCP invarijante: nikad katalog, nikad `is_admin()`, nikad `service_role`.
- **ADR-025:** doseg osobnog materijala — vježbe **odgođene** · dijeljenje privatno sad (**cijena: slike su vezane na vlasnički prefiks**) · napredak isti kao katalog · **boje se nasljeđuju od sekcije i smiju se pregaziti** · korisnik je **bilo tko**.
- **ADR-024:** osobni graditelj = **zaseban otok** (`nodes` + owner-RLS + RPC-only upis), NE proširenje kataloga; dva publish-puta svjesno koegzistiraju.
- **ADR-023:** Saša = content-only opseg + PR-workflow, least privilege.
- **ADR-022:** identitet predmeta preko programa (placement ≠ sadržaj) — temelj HR-ekspanzije.
- **ADR-018:** student uploada **PODATKE, nikad KOD** (vrijedi i za UGC).
- **ADR-017:** cache-busting = **jedan** auto-bumpani token (`npm run bump`), ne per-file hash.
- **ADR-016:** `service_role` → **samo** Supabase Edge Functions, nikad Vercel/klijent.
- **ADR-011:** read-path = Supabase **anon + RLS, bez `/api`**, uz file-fallback.
- Ostalo (013 · 014 · 015 · 019 · 020 · 021 · 006–012 · 001/008) = **povijesno obrazloženje**, u `DECISIONS.md`.
- **Logo:** `assets/logo.svg` (vektoriziran potraceom, indigo gradijent); favikoni iz SVG-a.
## Dokumentacija — **ulaz je SAMO `docs/README.md`**
Od 2026-08-07 je `docs/` složen **po ulozi dokumenta**, ne po temi. Ne traži fajlove napamet — otvori indeks.

| mapa | uloga |
|---|---|
| `docs/product/` | **ŠTO** gradimo — definicija + kriteriji prihvaćanja (PRD · VISION · MONETIZATION) |
| `docs/architecture/` | **KAKO** je građeno (ARCHITECTURE · BACKEND · CATALOG_ARCHITECTURE · CONTENT_SCHEMA · EXERCISES_ENGINE) |
| `docs/plan/` | **ŠTO SADA** — **najviše JEDAN** aktivni spec + ROADMAP |
| `docs/workflow/` | **KAKO RADIMO** (TESTING · TEAM · CONTENT_GUIDE/INTAKE/GENERATOR) |
| `docs/records/` | **POVIJEST** (HISTORY · CHANGELOG · PROGRESS · DECISIONS · BUGS · BACKLOG) — **nikad izvor istine** |
| `docs/subjects/` · `docs/archive/` · `docs/sokrat-ai/` | predmeti · ispunjeni planovi (referenca) · zaseban projekt |

**Pravila (gate `npm run check:docs`, dio preflighta):** jedan aktivni plan · `product/` bez dnevnika · svaka mogućnost ima **kriterij prihvaćanja** („gotovo kad korisnik može X", ne „test je zelen") · svaki `.md` naveden u indeksu · nula mrtvih poveznica.
