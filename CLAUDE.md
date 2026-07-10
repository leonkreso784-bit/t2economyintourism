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
Fakultet: **FMTU Opatija**, smjer **Hospitality Management**. Cilj: skalirati na cijeli fakultet (pa sveučilište),
kasnije UGC + AI tutor + natjecanje. Vlasnik/jedini autor: **Leon Kreso**. Vizualni stil: **„čisto i bogato", dark.**

## Stack
- Frontend: **statički, vanilla JS, BEZ build-koraka/frameworka** (biblioteke preko CDN-a/vendorane su OK). Hosting: **Vercel** (git push na `main` = produkcijski deploy; grane = preview).
- Backend: **Supabase** (Postgres/Auth; projekt `naxjubnedhrbhsuasayu`) — čitanje/pisanje **direktno anon/user JWT + RLS, BEZ `/api`** (ADR-011).
  Privilegirano (`service_role`) → **SAMO Supabase Edge Functions** (ADR-016); `service_role` key SAMO u `.env` (gitignored). Publishable key u `js/auth.js` = javan po dizajnu.

## Arhitektura (najvažnije)
- **`data/catalog.js` = JEDINSTVENI IZVOR ISTINE** za predmete: `faculties → programs → (year, semester) → subjects → lessons`;
  subject ima `content.scripts` + `content.resolve` (lessonId → window-var) + `content.codeScripts` (vježbe/lib = KOD).
- **Read-path sadržaja (dual-read):** `js/content-loader.js` → **DB (Supabase) → `data/json/<id>/*.json` → `.js` fallback**; lazy po predmetu.
  S1 šav: **`window.SokratContent`** (`js/content-repo.js`) — `listSubjects/getSubject/loadLesson`. Datoteke = izvor istine do F4.6 flipa; baza = zrcalo (re-sync `scripts/migrate-content.js`).
- **Vježbe NIKAD u bazu/JSON** (BUG-012): `generate()` funkcije ne prežive serializaciju → uvijek iz `.js` preko `codeScripts`. Engine (7 tipova) se **NE mijenja za sadržaj** (sveto pravilo).
- **`final` lekcija = `Object.assign(M1, M2, {examPractice})`** — spljoštena KOPIJA; u bazi zaseban red → svaki write mora propagirati na final (admin CRUD to radi; kompozicija umjesto kopije = planirano u UGC smjeru).
- **Stanje:** `window.AppState` (svi mutable globali). **UI-primitivi:** `<sokrat-toast>`/`<sokrat-modal>`/`<sokrat-confirm>` (light-DOM WC) + `window.askConfirm`.
- **Auth:** email+lozinka (`js/auth.js`, CDN supabase-js, tihi fallback) + **cloud-sync napretka** (`js/cloud-sync.js`, offline-first merge unija/max). Profil + GDPR na `#profile-page`.
- **Admin (F4):** `window.SokratAdmin` (`js/admin.js`) — `is_admin()` RPC + `.admin-only` reveal; `#admin-page` viewer/editori; RLS admin-write + `content_versions` append-only audit (undo, „tko/kad").
- **⚠️ GOTCHA:** `SokratAuth`/`SokratCatalog` su top-level `const` (leksički globali) → referenciraj **GOLO** (`typeof X !== 'undefined'`), NE `window.X`; `SokratContent`/`SokratAdmin`/`AppState` JESU na window. [[live-login-verifies-crud]]
- **Service Worker:** `sw.js` (navigacija network-first + offline shell; asseti stale-while-revalidate; kill-switch `__swKill()`); `SW_VERSION` bumpa `npm run bump`.
- **i18n:** globalni 🌐 HR/EN toggle (`js/i18n.js`, `localStorage 'sokrat-ui-lang'`); sadržaj po programu (HR = klon-program, ADR-012).
- **Monitoring:** GA4 (`G-ME0V58NJ1Z`) + Sentry — oboje **consent-gated**; GA ponašanje mijenjati SAMO u `js/consent.js`. [[google-analytics-consent]]
- Konvencija semestra: `year` = studijska godina; `semester` ∈ {1,2}.

## Sadržaj (autorstvo)
- **Stanje svih predmeta (brojevi/izvori/posebnosti): `docs/subjects/README.md`** — 2. god 8/8 ✅ · 1. god 9/9 ✅ (⛔ Intro blokiran) · HR pilot ✅. Sadržajna staza **PAUZIRANA** (platforma-first, ADR-018).
- Schema (obavezno): `docs/content/CONTENT_SCHEMA.md`. Novi predmet = mapa `data/<subject>/{midterm-1,midterm-2,final}.js`; brzo: `npm run scaffold`. 4 stara sem-2 predmeta ostaju root `data-*.js` (svjesno, ADR-015).
- PDF materijali: `_materials/` (gitignored); čitaj s `node scripts/pdf-text.js "<pdf>"` (Read ne radi za PDF). Vidi `docs/content/CONTENT_INTAKE.md`.
- **KaTeX** (kvantitativni predmeti): delimiteri **`\( \)` / `\[ \]` / `$$ $$` — NIKAD jedan `$`** (valutni `$NN`); `renderMath()` u `js/math.js`. Konvencija: `docs/content/CONTENT_SCHEMA.md` §Matematika.
- Generator predmeta (Sonnet, `.env` ključ): `docs/content/CONTENT_GENERATOR.md`. Pouke za sadržajni rad: `docs/subjects/README.md` §Pouke.

## ⚠️ KRITIČNA PRAVILA
1. **Cache bump:** pri izmjeni BILO KOJEG `css/*.css`/`js/*.js`/`data*.js` pokreni **`npm run bump`** (svi `?v=` + `CONTENT_VERSION` + `SW_VERSION` odjednom). `bump:check` = CI gate. Bez bumpa deploy je NEVIDLJIV (immutable cache 1 god; BUG-004, ADR-017).
2. **Deploy samo uz izričitu potvrdu korisnika** (`git push` na main = produkcija). Commit lokalno / push na feature-granu (preview) je OK.
3. **Uvijek ažuriraj `docs/`** nakon izmjene (PROGRESS/CHANGELOG + tematske; stanje predmeta u `docs/subjects/README.md`).
4. **Provjeri prije commita:** `npm run verify` + `npm run test:responsive`; nakon izmjene css-a i `npm run build:css`.
5. Radi polako, korak po korak, s provjerama; pazi na bugove; **kraće dionice, češće se javi korisniku**.
6. **PRIJE SVAKOG COMPACTA (korisnikovo pravilo, 2026-06-24):** proći **APSOLUTNO SVE `.md` datoteke** (root + `docs/**` + memorija) i provjeriti točnost (status, brojevi, ADR-ovi, linkovi) — ispraviti zastarjelo PRIJE compacta. [[doc-audit-before-compact]]
7. **Nakon pusha provjeri i Vercel check na commitu, ne samo GitHub Actions** (Actions ne validira `vercel.json`!); `vercel.json` = bez komentar-ključeva (ruše schema-validaciju prije builda).
8. **Auth/RLS-gated značajke:** pozitivan put verificiraj pravom admin-prijavom (`npm run test:authed`); WRITE = privremeni edit-pa-revert spec + Supabase MCP provjera (nema izoliranog test-DB-a; spec se briše). [[live-login-verifies-crud]]

## Komande
- `npm run verify` — integritet catalog-a. · `npm run typecheck` — tsc bez build-a (scoped).
- **`npm run bump`** — svi `?v=` tokeni + verzije na isti timestamp; `bump:check` = CI gate.
- **`npm run build:css`** — regeneriraj `styles.bundle.css` iz 26 modula; `-- --check` = CI drift-gate.
- `npm run test:responsive` — Playwright (iPhone profili, default suite). · **`npm run test:authed`** — pozitivan admin-put (storageState; traži `TEST_ADMIN_EMAIL/PASSWORD` u `.env`; CI = zaseban secret-gated job).
- `npm run test:unit` — node unit testovi. · `npm run serve:test` — lokalni server :5050.
- `npm run validate:content [id]` — sadržajni validator. · `npm run validate:schema [id]` — JSON Schema gate (ajv).
- `npm run export:json [id] [--check]` — export u `data/json/`; **⚠️ nakon izmjene `data/*.js` migriranog predmeta OBAVEZNO re-export — inače CI drift-gate pada.** Vježbe se NE exportaju.
- `npm run scaffold -- <id> "<Naziv>" <god> <sem>` · `node scripts/pdf-text.js "<pdf>"` · generator: vidi `docs/content/CONTENT_GENERATOR.md`.

## Stanje — TRENUTNO (2026-07-08; povijest: `docs/HISTORY.md`)
- **PRODUKCIJA (`main`):** sve do **F3 uključivo** — 18 predmeta live (17 EN + HR pilot; tablica `docs/subjects/README.md`), auth + cloud-sync + profil,
  pravne stranice, GA4 + Sentry (consent), SW offline, i18n HR/EN, JSON dual-read 18/18, CI (Actions + Lighthouse). **F0–F3 KOMPLETNE + LIVE** (F1 rails · F2 reusable jezgra · F3 performanse). [[foundation-pivot]]
- **AKTIVNO — grana `foundation/f4` (Vercel preview, NIJE produkcija):** F4 Admin CRUD (`docs/CRUD_PLAN.md`, ADR-021).
  ✅ gotovo + živo verificirano: F4.1 identitet · F4.2 write-RLS+versioning · F4.3 viewer + edit kartice (+propagacija na final) · **F4.4 quiz/fill/learn editori** · Playwright LOGIN (`test:authed`).
- **🧭 NOVI SMJER (korisnik 2026-07-08/09) — ✅ ZAPISAN u `docs/UGC.md` (north-star dizajn-dok; U0 gotov):** CRUD prelazi na **draft→objavi** + bogato autorsko sučelje (= UGC-sjeme).
  Arhitektura (puni detalji UGC.md): **dokument u sredini** (stabilni ID-jevi + `schemaVersion` + stil-TOKENI + learn-BLOKOVI + YouTube-blok) · **jedan write-put** (draft+ops+**publish-RPC**, atomično, `base_version`) ·
  **jedan renderer** = sigurnosna granica · `final` = kompozicija umjesto kopije · editor = **biblioteka pod 4 uvjeta** (vendorana/adapter/samo-autorska-strana/spike) · rizici ↓: **staging Supabase** + dual-mode + datoteke=mreža.
  **Brick-slijed U0–U9 (status u UGC.md §12): U1 ✅ (`40dc07b`, 2026-07-10) — staging Supabase `sokrat-staging` (ref `czljmvigkgiajzjxtndq`) + shema + test-admin; test-only Supabase-override u `js/auth.js` (prod default no-op, testovi→staging preko `STAGING_*` u `.env`); test:authed 6/6 + write-verify + rls-check vs staging; PROD audit NETAKNUT. SLJEDEĆE = U2 schema v2 (ID-jevi) → U2.5 ADR-022 → U3 draft-sloj → U4 publish-RPC → …** Kategorije-cigla F4.4 = U6 (u draft-modu).
- **Docs-reorg ✅ KOMPLETAN (2026-07-08/09, `08ab604`+`0d17689`):** content/ subjects/ archive/ + HISTORY + tablica predmeta + ova dijeta CLAUDE.md (463→94, verify-then-cut, korisnik odobrio).
- **Napomene:** ⚠️ **22 test-audit-reda (te2) u `content_versions`** iz živih proba — bezopasni; brisanje SAMO uz izričit OK (append-only audit) · CI `authed` job čeka repo-secrete (korisnik javio „riješeno") ·
  Supabase free-tier **spava ~7 dana neaktivnosti** (restore besplatan; app fallbacka na datoteke, login/sync ne rade dok se ne restorea) · **accounting NIJE u bazi** (study iz JSON-a; 51 red = 17×3) ·
  PWA instalirana app drži staru ikonu do reinstalacije (nije bug).
- **👥 TIM (2026-07-08): pridružio se Saša Vudrag** (content-suradnik; student prog. inž.) — uloge/granice/workflow: **`docs/TEAM.md`** (+ role-router gore; ADR-023).
  **Sadržajna staza ODMRZNUTA za njega** (ADR-018 pauza je bila kapacitetna): Saša paralelno radi **HR program do pune 2 godine** (prijevod alatom + HR materijali kao autoritet; S-cigle u TEAM.md §4), MI nastavljamo U-stazu. **ADR-022 POVUČEN NAPRIJED = U2.5** (odmah iza U2; preduvjet MUT/MOR smjerova ~S7; 3 uvjeta u ADR-023).
- **PAUZIRANO za NAS do kraja platforme (ADR-018):** 3. godina · novi EN sadržaj. Nakon F4/U-staze: **F5 SRS → F6 sigurnost → UGC.** (HR sadržaj sad nosi Saša.)
- **HR-ekspanzija:** HR 1. godina × 3 smjera FMTU (MUH/MUT/MOR), dijele vezne predmete — arhitektura: ADR-022 / `docs/CATALOG_ARCHITECTURE.md`; implementacija = **U2.5**. Kolokviji ~4. mj = runway. [[hrv-program]]

## Ključne odluke (jedan red po ADR-u; puni tekst `docs/DECISIONS.md`)
- **ADR-013:** podatak≠ponašanje — study=JSON, vježbe=JS moduli; ContentRepository šav; cilj = baza autoritativna (flip u F4).
- **ADR-014:** engineering standardi — CI/CD · typecheck bez build-a · Web Components (light-DOM) · error monitoring; vanilla/no-build etos ostaje.
- **ADR-015:** tech-debt triage „briše li ga F4?" (root data-*.js + free-tier sleep = svjesno NE popravljati).
- **ADR-016:** `service_role` → SAMO Supabase Edge Functions, nikad Vercel; prvi konzument = GDPR „Obriši račun" (još NE postoji; skica u BACKLOG §Brisanje računa).
- **ADR-017:** cache-busting = JEDAN uniformni auto-bumpani token (`npm run bump`), ne per-file hash.
- **ADR-018:** platforma-first SKROZ do UGC-a prije povratka na sadržaj; student-upload NIKAD prije F6; student uploada PODATKE, nikad KOD.
- **ADR-019:** maksimalno-rizične cigle na FABLE modelu (drugi model = jeftin sigurnosni sloj); handoff = testiran commitani checkpoint.
- **ADR-020:** točnost sadržaja = dvo-ključni verifier (Sonnet piše → Opus provjerava → korisnik presudi) — gradi se u fazi sadržaja.
- **ADR-021:** F4 CRUD = direktni preglednik→Supabase RLS-write · `profiles.role` · grubi blob · stupnjeviti flip · safety-net od prve cigle.
- **ADR-022:** identitet predmeta preko programa (placement≠sadržaj, prefiks fakulteta, dijeli-unutar-fakulteta) — za HR-ekspanziju.
- Starije: **ADR-006** (autorstvo u datotekama) · **ADR-007** (drill-down nav ✅) · **ADR-009** (KaTeX, currency-safe ✅) · **ADR-010** (generator ✅) · **ADR-011** (read-path = Supabase anon+RLS bez `/api` ✅) · **ADR-012** (HR = klon-program, UI-jezik zasebna os ✅) · ADR-001/008 (Supabase temelj; Railway tek za AI worker).
- **Logo:** `assets/logo.svg` — vektorizirani originalni Sokrat (potrace), glava ispunjava krug, indigo gradijent; favikoni iz SVG-a. Kvaliteta = vektorizacija ORIGINALA, ne ručno crtanje.

## Dokumentacija (`docs/` — indeks: `docs/README.md`)
**Aktivno:** `FOUNDATION_PLAN` (faze F0–F6) · `CRUD_PLAN` (F4) · **`UGC.md` (SLJEDEĆE — draft→objavi + autorstvo + UGC arhitektura)** · `CATALOG_ARCHITECTURE` · `HRV_PLAN`.
**Referenca:** `PRD` · `VISION` · `ARCHITECTURE` · `BACKEND` · `ROADMAP` · `TESTING` · `MONETIZATION`.
**Sadržaj:** `content/` (SCHEMA · GUIDE · INTAKE · GENERATOR · EXERCISES_ENGINE) · `subjects/` (tablica predmeta + planovi).
**Zapisnici:** `HISTORY` (vremenska crta) · `CHANGELOG` · `PROGRESS` · `DECISIONS` · `BUGS` · `BACKLOG`. **Arhiva:** `archive/`.
