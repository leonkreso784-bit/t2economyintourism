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
9. **OVISNOSTI SE PINAJU TOČNO — `^` je zabranjen.** `save-exact=true` u `.npmrc`, Node u `.nvmrc` (**22**, isto što vrti CI) i `engines`. Povod: CI je dvaput pao na `npm ci` **prije ijednog testa**, oba puta jer je raspon `^` dopustio da **upstream objava promijeni razrješenje ispod nas** — ništa u commitu nije bilo krivo. Projekt nema runtime-ovisnosti, sve je alat: **predvidljivost je vrjednija od automatskih zakrpa**, a nadogradnja je namjerna radnja uz pun gate, nikad nuspojava `npm install`-a. **Od 2026-08-14 isto vrijedi za CDN-ovisnosti koje idu u preglednik** (`check:cdn`) — dotad je pravilo pokrivalo samo alat, dakle ono što ne može nauditi korisniku.

## Komande

> **ZAŠTO neka brana postoji piše U NJEZINOJ SKRIPTI** (`scripts/<ime>.js`, zaglavlje) — ondje
> stoji uz kod koji to provodi, pa ne može ostarjeti odvojeno od njega (ADR-027). Ovdje je samo
> **što radi i kad se vrti**. Do 2026-08-25 su ta obrazloženja stajala i ovdje, u drugoj kopiji;
> provjereno je da svako postoji u svojoj skripti prije nego je odavde maknuto.
> Pouke o **testiranju** (uklj. „zeleno lokalno nije zeleno") su u `docs/workflow/TESTING.md`.

**Svaki dan:** `npm run verify` (integritet catalog-a) · `npm run typecheck` (tsc bez builda) ·
**`npm run bump`** (svi `?v=` + `CONTENT_VERSION` + `SW_VERSION` na isti timestamp; `bump:check`
= CI gate) · **`npm run build:css`** (regeneriraj `styles.bundle.css` iz manifesta `css/app.css`;
emitira i `css/tokens.static.css` za stranice bez bundlea; `-- --check` = drift-gate) ·
`npm run test:unit` · `npm run serve:test` (:5050).

### `npm run preflight` — sve brze brane odjednom (pokreni PRIJE svakog main-pusha)

`check:lockfile` · `verify` · `bump:check` · css-drift · `check:tailwind` · `check:cdn` ·
`check:palette` · `check:orphan-css` · `check:safearea` · `check:budget` · `check:seo` · `check:contrast` ·
`typecheck` · `validate:schema` · `export:json --check` · `check:docs` · `check:state` ·
`test:unit`. Pre-push hook ga automatski vrti na `main`.

| brana | što tvrdi |
|---|---|
| `check:lockfile` | bi li `npm ci` prošao — vrti **dva npm-a** (lokalni + onaj iz CI-ja), pada zatvoreno. Lock se popravlja s `npx npm@10 install` |
| `check:state` | tvrdnje o stanju se slažu s gitom (broj commita žive grane · **zapovijed koja je već izvršena**). Pokriva `CLAUDE.md`, `docs/plan/**`, `BACKLOG.md` |
| `check:docs` | jedan aktivni plan · svaki `.md` u indeksu · nula mrtvih poveznica · **nula ćirilice** u kodu i sadržaju (popis datoteka se **čita s diska**, BUG-034) |
| `check:tailwind` | 6 brana oko Tailwind sloja (dinamička imena klasa · sudar s legacy klasom · `@source` ugovor · klase bez bundlea · šum · **sudar `@keyframes`**) |
| `check:cdn` | vanjski podresursi imaju **SRI + `crossorigin` + verzioniran URL**; `check:cdn:live --verify` uspoređuje bajtove s izdavačevim hashem (mrežno) |
| `check:palette` | **čegrtaljka**: broj ostataka stare palete ne smije **porasti** (`--update` spušta osnovicu). Uz nju **četiri tvrde zabrane**: zakucan tekst na ispuni marke · isto to na **POTOMKU** ispune (ispuna i boja teksta u dva pravila) · `--primary-light` kao tekst · **zakucana tamna ploha** |
| `check:orphan-css` | **čegrtaljka**: klasa u `css/**` koju ne spominje ni markup, ni JS, ni gradivo, ni test. Osnovica ih **imenuje** — dio je legitiman (KaTeX; `lb-color-*` nastaje u runtimeu) |
| `check:safearea` | `env(safe-area-inset-*)` samo u `css/variables.css`, drugdje `var(--safe-*)` — pravilo pisano golim `env()` je **nemjerljivo** |
| `check:budget` | posjetiteljev put: **nijedna editorska datoteka** + **≤ 200 KB prenesenih** skripti (mjeri PRENESENE bajtove, ne disk) |
| `check:seo` | ono što tražilica i pretpregled VIDE: sitemap == disk · robots ne `Disallow`-a `noindex` stranicu · jedan tekst u `<title>`/`og:`/`twitter:` · `og:image` **1200×630** · JSON-LD **parsira**. `--write` regenerira sitemap |
| `check:contrast` | WCAG **po temi** — 164 provjere kroz sve 4 teme; parsira `css/tokens.css`, ne drži kopiju vrijednosti |

### Izvan preflighta — traže mrežu ili preglednik

| naredba | što radi | zašto nije u preflightu |
|---|---|---|
| `npm run css:diff` | izračunati stilovi u pravom Chromiumu, radno stablo vs git-referencu kroz **`git worktree`** (cijelo stablo, pa vidi i seobu iz markupa u CSS). ⚠️ **Doseg se PREDAJE — zadani laže tiho:** `CSS_DIFF_RUTE` (inače samo `/`) · `CSS_DIFF_SIRINE` (inače samo 375/768/1280) · `CSS_DIFF_ALL=1`. ⚠️ **NE dvije instance usporedo.** Obrazloženja: zaglavlje `scripts/css-diff.js` | preglednik + port |
| `npm run check:contrast:live` | kontrast kakav se STVARNO iscrta: 4 teme × 11 ruta. `check:contrast` čita tokene i ne zna KORISTI li ih CSS — ovo mjeri ekran; iznimke **imenovane** u `scripts/contrast-live-allow.json` | preglednik + poslužitelj |
| `npm run build:og` | crta `og-cover.png` **1200×630** (boje iz tokena, tekst iz i18n) | preglednik; PNG se **commita**, dimenzije mjeri `check:seo` |
| `npm run css:debt` | što je ostalo za C4–C7: po cigli datoteke, redci, `!important` izvan komentara | read-only, **nije gate** — plan je do 2026-08-25 te brojke nosio **ručno** i obje su ostarile |
| `npm run palette:breakdown` | razloži ostatak palete po **POSLJEDICI** (nevidljiv tekst · blijede plohe · stara paleta) | read-only, **nije gate** |
| `npm run check:final` | bazni `final` red == M1⊕M2(+examPractice) | mrežno (anon, read-only) |
| `npm run diff:db [id]` | usporedi bazu s datotekama **prije re-synca** — `migrate-content.js` piše PREKO baze, a `content_versions` je audit, ne undo | mrežno |
| `npm run check:functions` | Edge Functions na PRODUKCIJI: sve deployano i traži JWT (401), stranci obrisani (404) | mrežno, bez ijednog ključa |
| `npm run backup` / `backup:verify` | DB snapshot → gzip-JSON + sha256 manifest u `backups/` (gitignored, KORISNIČKI podaci) | mrežno; restore je guarded (`--restore` dry-run · `--confirm` · `--force-prod`) |
| `npm run load-probe [N] [R]` | simulira razred: N paralelnih anon readova × rundi | mrežno |

### Testovi

- **`npm run test:responsive`** — Playwright, default suite (iPhone profili).
  ⚠️ Prijava zna pasti **iz utrke**, i to nije naš kod — dva lica su opisana u `tests/auth.setup.js`
  (drugo, `is_admin() = false` uz prazan `rpcError`, obori **cijeli** `authenticated` projekt).
- **`npm run test:authed`** — pozitivan admin-put (storageState; traži `TEST_ADMIN_EMAIL/PASSWORD`;
  gađa **STAGING** kad su `STAGING_*` u `.env`; u CI-ju zaseban secret-gated job).
- **`tests/phone.spec.js` + `phone.authed.spec.js`** (mjera: `tests/helpers/phone-gate.js`) —
  **telefon kao STRANICA**: 8 tvrdnji na 320/393/430 px i 852×393, + četiri načina učenja.
  Osnovica je `tests/phone-baseline.json` (danas **prazna** → traži nulu);
  spuštanje = `PHONE_BASELINE_UPDATE=1 npx playwright test …`.
- **`npm run test:storage`** — bucket `node-images` kroz HTTP (vlastiti upload · tuđi prefiks ·
  javni URL · anon · potpisani URL). **WRITE → TVRDO odbija prod.**
- **`npm run test:delete-account`** — Edge Function `delete-account`. **HARD-DELETE → TVRDO odbija
  prod;** T4/T5 traže i `STAGING_SUPABASE_SERVICE_KEY`.

### Sadržaj i baza

`npm run validate:content [id]` · `npm run validate:schema [id]` (ajv) ·
`npm run export:json [id] [--check]` — ⚠️ **nakon izmjene `data/*.js` migriranog predmeta
OBAVEZNO re-export**, inače CI drift-gate pada; vježbe se **ne** exportaju ·
`npm run scaffold -- <id> "<Naziv>" <god> <sem>` · `node scripts/pdf-text.js "<pdf>"` ·
`node scripts/seed-staging.js [id]` (STAGING-only guard) ·
generator predmeta: `docs/workflow/CONTENT_GENERATOR.md`.

**Naše lokalne komande (gitignored):** `/next` (raspoređivač) · `/brick` (jedna cigla end-to-end) ·
`/deploy` (siguran deploy). Agenti: `content-review` / `exercise-review` · `agent-builder`
(tvornica). [[sokrat-agent-engine]]

> **„F4", „U8", „K6" u starim zapisima = ZATVORENE oznake faza** (temelj F1–F6 · graditelj F0–F5 · editor U/F7/K). Sve tri serije su ispunjene i žive samo kao povijest u `docs/archive/` i `docs/plan/ROADMAP.md`. **Nova faza dobiva ime, ne slovo.**

## Stanje — TRENUTNO (2026-08-25)

> **Ovdje stoji samo ono što vrijedi SAD** (ADR-027). **Povijest cigli je IZAŠLA odavde**
> (2026-08-25): mjere, pouke i obrnute provjere svake cigle žive u specu i zapisima, a ova je
> sekcija do tada nosila **41 604 znaka o GOTOVIM ciglama** — drugu kopiju onoga što spec već
> ima. Provjereno prije brisanja: od **513 pojmova** u tekstu njih **513 postoji drugdje**.
>
> | pitanje | tko zna odgovor |
> |---|---|
> | što je na produkciji | zadnji **🚀** redak u `docs/records/CHANGELOG.md` |
> | grana · commiti · je li pushano | `git status -sb` · `git log --oneline -1 origin/main` |
> | koliko predmeta | `npm run verify` |
> | zašto je cigla izvedena baš tako | `docs/plan/FRONTEND_REDIZAJN.md` §7 (C0–C3, landing) · §8 (KOSTUR) · §9 (TELEFON, `about`, SEO) · §10 (C4) |
> | koji su bugovi bili i što su naučili | `docs/records/BUGS.md` |
> | što je isporučeno i kada | `CHANGELOG.md` · dnevnik sesija: `PROGRESS.md` |
>
> **Brojka prepisana u prozu ostari istog dana** — dogodilo se triput u tri dana. Zato postoji
> **`npm run check:state`**: ne zabranjuje brojku nego ju provjerava protiv gita, i pada na
> **zapovijed koja je već izvršena** (zastarjeli NALOG navodi sesiju na radnju).
> ⚠️ **Memorija je izvan repozitorija pa ju gate ne doseže** — poznata rupa, ne previd.

### Gdje smo

**✅ NA PRODUKCIJI** (2026-08-24): faza **TELEFON (T0–T6)** · **BUG-032** · **KOSTUR (K1–K4a)** ·
**landing C+D** · prije toga C0–C3 i sve starije. Točan SHA/token/Vercel-ref se **namjerno ne
prepisuje** ovamo (ADR-027) — zna ih zadnji **🚀** redak CHANGELOG-a.

**✅ GOTOVO, NIJE DEPLOYANO** — **popis grana i njihov sadržaj NE STOJI ovdje** (ADR-027): zna ih
`git branch --no-merged main` i **🚀**-redci CHANGELOG-a, a ovakav se inventar raziđe s repozitorijem
istog dana. Ovdje ostaje samo ono što je **živo pravilo**, a ne stanje:
⚠️ **Iz D2:** `answer` je obavezan i drži **prvi** odgovor i kad postoji `answers` — zbog
**keširane stare skripte**, ne zbog urednosti sheme.
⚠️ **N2 je POLA:** polica pokazuje **skinuto**, ne uniju skinutog i onoga što se uči.

**✅ FAZA POLICA JE ZATVORENA** — **P1 · P2 · P3 · P4 svi ispunjeni** (spec §9.17–9.21).
Kriterij je **mjeren, ne tvrđen**: skinut predmet se otvara bez mreže, **preživi deploy**, a
napredak stečen offline se po povratku mreže **spoji bez gubitka**.
✅ **C4 JE ISPUNJEN** (grana `feat/c4-browse-lekcije`) — C4a (§10.1) · §10.2 · **C4b (§10.3) =
prva migrirana površina u fazi**, i prva koja piše utilityje.
🔄 **C5a JE U TIJEKU** (grana `feat/c5a-modovi`, spec **§11**) — u **četiri commita**, jer uz pet
CSS datoteka nosi i **179 pravila iz `responsive/*`** (§11.0). **/1 kromo ✅ · /2 kartice+dopune ✅**
**/3 kviz ✅** → /4 napredak → C5b → C6 → C7.
✅ **PAUZA UKINUTA ISTI DAN (Leon):** *„krenimo sa daljnjom C radnjom… VPS ću ja sutra."*
Seoba i cigle teku USPOREDO — ne dijele nijednu datoteku (seoba: `js/auth.js`, `.env`, testovi).
⚠️ **Tri pravila za preostale cigle** (zašto: §10.3, §11.1, §11.2): ① prije nego pravilo postane
utility **izmjeri tko ga danas tuče**; ② **rez ide po SVOJSTVU** — što neki preživjeli `@media` još
mijenja ne smije u utility; ③ **dvaput zaredom je prvi kvar bio u MJERAČU, ne u cigli** — prije
nego povjeruješ nalazu, provjeri mjeri li alat ono što misliš.
**K4** se NE radi zasebno (utopljen u **P2**). **K5** (editor dvojezično) čeka i ne blokira ništa.
**A1 (Google-prijava) + A0 (prepravak dijaloga) idu ZAJEDNO** — `#authModal` je građen za jedan
put, pa se inače prepravlja dvaput. **Oboje TEK POSLIJE SEOBE** (auth je Supabase-konfiguracija;
seoba mijenja URL, a time i redirect URI). Redoslijed unutar para nije presuđen i nije važan.

### 🚚 SEOBA SE RADI ODMAH (Leon, 2026-08-30) — **SAMO Supabase; Vercel OSTAJE**

*„danas ili sutra (samo supabase)… iznajmit ću VPS… **hostanje ostaje na Vercelu, ne mijenjamo do
daljnjeg!**"* **Zašto sada, iako plan kaže „poslije frontenda":** *„prije nego faks krene."*
Suženje opsega je **ukinulo dvije od tri zapisane prepreke** (`vercel.json`/`sw.js` i „push =
produkcija" — oboje otpada jer ostajemo na Vercelu). **Ostaje: DVIJE instance.**

**Pet stvari koje se ne smiju zaboraviti** (brojke i obrazloženja: `BACKLOG.md` §SELF-HOST):
① **stari projekt živi još ~2 tjedna** — anon-ključ je u `js/auth.js`, koji preglednik drži godinu
dana · ② **`sokrat-staging` seli s prodom**, inače prestaje biti brana · ③ **backup je naš od
prvog dana** (`pg_dump` + kopija IZVAN VPS-a; `npm run backup` je aplikacijski snimak, **ne**
zamjena) · ④ **`delete-account` = najveći rizik** (GDPR) · ⑤ **prvo provjeri jesu li URL-ovi slika
APSOLUTNI** — inače sve slike puknu. **Testovi su uvjet, ne dodatak.**

### 🎯 Tekuća faza = FRONTEND REDIZAJN NA TAILWIND (spec: `docs/plan/FRONTEND_REDIZAJN.md`, ADR-028)

Opseg = cijela platforma **i** editor; cigle **C0–C7** (C5 razbijen na C5a/C5b). **Next.js
razmotren i ODBIJEN** — obrazloženje u ADR-028, **ne otvarati iznova**.

**Živa ograničenja koja su iz gotovih cigli ostala na snazi** (obrazloženje svakog je u specu):

- **Zadana tema je SVIJETLA — „Akademsko plavo"** (`academic`; ostale `paper`, `chalk`, `mint`).
  Dvije tamne palete zaredom pale su na živom ekranu. Smjer izgleda je **APPLE** (Leon: *„apple
  smjer, naravno"*): grotesk svugdje (**serif nadglašen**), praznina, tipografija nosi, monokrom
  + jedan akcent. Spec §7.3–7.8.
- **🔒 ZNAK JE NEPROMJENJIV** (Leon: *„sokrat logo je nezamjenjiv"*) — ne prepravlja se nego
  dobiva PROSTOR, i **zadržava indigo kroz sve teme = konstanta marke**.
- **Broj predmeta se NIKAD ne piše rukom.** Jedini ručno pisan je statični fallback u
  `index.html` i njega čuva `npm run verify`; landing je taj razred greške već imao **na
  produkciji** (pisao 17 kad ih je bilo 22).
- **Prikaz blokova ide ISKLJUČIVO kroz `renderContentBlocks()`**, a **svaki tekst iz podataka
  koji ide u `innerHTML` mora kroz `SokratBlocks.esc`** (ikona kroz `safeIcon`, boja kroz
  `accentFrom`, URL kroz `safeUrl`). Povod: BUG-024/025 — jedno pitanje u katalogu bilo je
  **neodgovorljivo**. [[escape-all-data-in-innerhtml]]
- **Telefon je MJERENA površina** (faza TELEFON): `tests/phone.spec.js` + `phone.authed.spec.js`,
  osnovica prazna → brana traži nulu. Ne popravljati „na oko" ono što ona mjeri.
  [[phone-is-unmeasured-surface]]
- **Sigurna zona ima JEDAN izvor:** `env()` samo u `css/variables.css`, svugdje drugdje
  `var(--safe-*)` — pravilo napisano golim `env()` je **nemjerljivo** (brana: `check:safearea`).

### 🔒 TVRDE ODLUKE O DEPLOYU

① *„Ništa ne ide na produkciju dok cijeli frontend ne bude riješen"* (Leon, 2026-08-19) — **Leon
je tu odluku sam promijenio 2026-08-24** i odobrio merge iako C4–C7 i POLICA nisu gotovi
(prepreka je bio telefon, koji je riješen). **Odluka o odgodi je POTROŠENA, ne ukinuta:** sljedeći
deploy opet traži izričit OK.
② **Broj commita izvan produkcije NIJE nalaz i NE SPOMINJE SE** (*„ZNAM KADA ZELIM PUSTIT NESTO
NA PRODUKCIJU"*) — **ova stoji netaknuta.** Pravilo #2 time dobiva dopunu: ne samo da se ne smije
pushati bez OK-a, nego se na to ne smije ni **nagovarati**. [[leon-decides-deploys]]

### 🧪 VJEŽBE — smjer zaključan, radi se TEK nakon frontenda (§9.5)

*„Vježbe su KÔD"* je **oboreno mjerenjem** (65 % je podatak; kôd je samo **formula**). Smjer:
formula → **imenovana knjižnica recepata**, vježba postaje 100 % podatak, **BUG-012 se umirovljuje**.
Odbačeno (ruši ADR-018): evaluator izraza i sandbox za korisnički JS. Izvan MCP-a (ADR-031).
[[exercises-code-vs-data]]

### ❓ OTVORENO — ostalo je JEDNO. Ne planirati kao dogovoreno.

Od tri pitanja otvorena 2026-08-24, **dva su zatvorena 2026-08-30**: birač tema (ide s ciglama,
najranije nakon C6 — `BACKLOG.md`) i redoslijed self-host vs OAuth (**seoba je prva**, pa OAuth
poslije nje). Ostaje:

- **OAuth (Google/Apple) — DA ILI NE.** **5 registriranih korisnika, 3 su Leonova** → stvarnih
  vanjskih **dvoje**, uz e-mail+lozinku kao jedini put. Google je besplatan; **Apple ~99 $/god** i
  nema smisla bez iOS aplikacije; „Sign in with ChatGPT" je **NEPOTVRĐEN** — ne obećavati.
- **Semantičke ispune** (`--on-success`/`--on-danger`): pravo pitanje nije koji token nego
  **smiju li zelena i crvena uopće biti ISPUNA, ili samo obrub i tekst**. `BACKLOG.md`.

### Stalno — vrijedi neovisno o fazi

- **🎨 Funkcija prije vizuala** (Leon: *„sve mora savršeno raditi prije nego ga uredimo"*) —
  zato je frontend zadnji, i zato smo tek sad u njemu. [[frontend-last-function-first]]
- **⚠️ Osobni graditelj = ZASEBAN OTOK (ADR-024):** javni katalog · studentski vrući put ·
  `publish_document` = **NEDIRNUTI**. `anon` nema ništa, `authenticated` ima **samo SELECT**,
  **svaki upis ide kroz `SECURITY DEFINER` RPC s owner-checkom** (`owner_id = auth.uid()`).
- **Editor (admin CRUD) = funkcionalno gotov** — Studio: stablo/canvas/inspektor, svi modovi
  uredljivi, media, drag-drop, boje. Preostali polish je **neobavezan**:
  `docs/archive/EDITOR_PLAN.md` §12. [[editor-must-be-real-product]]
- **STAGING Supabase:** `sokrat-staging` (ref `czljmvigkgiajzjxtndq`) — write/draft testovi, da
  prod-audit ostane čist. `test:authed`/`rls-check` gađaju staging kad su `STAGING_*` u `.env`;
  seed = `node scripts/seed-staging.js`.
- **⏳ Grane izvan `main`-a:** zna ih `git branch --no-merged main`, ne ova datoteka. **Pouka za
  zaostali content-PR:** grana zna izgledati kao platformski zahvat a nositi samo `?v=` tokene →
  razrješenje je *uzmi `main`, pa `npm run bump`*. **Token nije sadržaj nego izlaz alata.**
- **👥 Saša Vudrag** (content-suradnik) — opseg **SAMO HR sadržaj + PR-workflow**
  (`docs/workflow/TEAM.md`, role-router gore; ADR-023). **Na stanci je dok frontend redizajn nije
  gotov** (razlog je mehanički: C2–C7 bumpaju iste tokene i prepisuju `index.html`, koje dira i
  svaki content-PR). **S4+S5 je PAUZIRAN, ne otkazan.** PR-ovi → `content-review` agent.
  [[content-model-standard]]
- **HR-ekspanzija:** HR 1. god × 3 smjera FMTU dijele vezne predmete (ADR-022). Kad HR program
  bude potpun → **HR u Supabase** (Leon/Claude `migrate-content.js`, ne Saša). [[hrv-program]]
- **PAUZIRANO za nas:** 3. godina · novi EN sadržaj (ADR-018: student uploada PODATKE, nikad KOD).
- **✅ Tri „za Leonovu ruku" stavke odrađene (2026-08-28):** strane Edge Functions obrisane →
  `check:functions` **ZELEN** prvi put; **min. lozinka 6 → 8**; **leaked-password zaštita ON**
  (advisori 16 → 15 WARN). ⚠️ Zadnje dvoje ovisi o **Pro planu (~mjesec)** — poslije seobe provjeri.
  ✅ **AUTH-1:** `authError()` mapira auth-greške na i18n (`tests/unit/auth-error.test.js`).
  ⚠️ **NE „popravljaj" `js/auth.js:343`** — tvrdnja o `WeakPasswordError` je **oborena**: u
  zakucanom `supabase-js@2.110.8` slaba lozinka dolazi kao `data.weakPassword` uz `error: null`.
- **Sitni dug (ne blokira):** siročad u Storageu · advisor-WARN `snapshot_content_version` /
  `handle_new_user` · staging poravnati s `supabase/f1-nodes.sql`. ⚠️ **`is_admin()` se NE smije
  revokeati `authenticated`-u** — zovu ga RLS politike kao pozivatelj. Advisori PROD: **0 ERROR,
  16 WARN.**
- **Napomene:** ⚠️ **Supabase org je `pro` — ali samo ~mjesec dana** (Leon, 2026-08-27), pa
  free-tier spavanje nakon ~7 dana neaktivnosti **trenutno ne vrijedi** i vratit će se s planom · `content_versions`/`node_content_versions` = **append-only audit**,
  brisanje **samo uz izričit OK** · PWA drži staru ikonu do reinstalacije (nije bug) ·
  `mcp-admin/` = untracked read-only spike [[mcp-admin-spike]].

## Ključne odluke — samo one koje MIJENJAJU današnji rad

> Puni tekst i sve starije: **`docs/records/DECISIONS.md` (ADR-001…031)**.
> Ovdje su ADR-ovi koji su **živa ograničenja**, ne povijesno obrazloženje.

- **ADR-031:** **MCP je CJEVOVOD, ne CRUD** (Leon, 2026-08-30): `Learn` je podloga svega → AI prvo prepozna lekcije/sekcije i napiše skriptu → iz nje kartice (**pojam/pitanje → objašnjenje**, boja po lekciji da se vidi kojoj pripada) → iz kartica dopune i kviz, uz **pokrivenost, ne uzorak**. **AI je KORISNIKOV** (ne plaćamo tokene → kvalitetu držimo samo branama), **materijal dolazi kroz chat** (datoteku nikad ne vidimo), **sve ide u NACRT**, doseg = **samo vlastito gradivo** (ni čitanje kataloga). **Četiri tvrde brane u write-putu:** duljina kartice · svaka kartica daje bar jedno pitanje · svaka lekcija dobiva boju · dopuna ima jednoznačan odgovor. **Radi se TEK NAKON FRONTENDA**, a konektor traži OAuth → **tek nakon seobe**.
- **ADR-030:** **AI kroz MCP je GLAVNI put stvaranja; editor je DORADA** (Leon, 2026-08-13) — smije IZGUBITI funkcije, ne dobiti ih. **Što od njega još stoji:** MCP je proizvod, ne spike (danas untracked read-only pokus) i najveći neriješeni komad plana; **kontrola kvalitete seli s ekrana u write-put** (`js/card-limits.js` mora biti **treći čitatelj, nikad treća kopija**); nikad katalog/`is_admin()`/`service_role`; **vježbe izvan MCP-a** (ADR-018). ⚠️ Njegovo „pristup je prvi problem" je **presuđeno u ADR-031** (konektor + OAuth).

- **ADR-029:** **UGC je GLAVNI proizvod**, javni katalog (24 predmeta) je **jedan izvor gradiva**, ne srce platforme. „Moji materijali" prestaju biti pododjeljak profila i postaju **ravnopravno odredište** (stranica + ulaz u navigaciji i na landingu). **Ne popušta ništa sigurnosno** — ADR-024/025/018 stoje netaknuti; ovo je odluka o **istaknutosti**. **➕ Dopuna 2026-08-14:** *„UGC PRIJE kataloga"* ublaženo u **„ravnopravno, i to u herou"** — doslovna primjena skrivala je jedini dokaz da sadržaja ima. **Ublažavanje, ne ispunjenje.**
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
| `docs/subjects/` · `docs/archive/` · `docs/ideas/` · `docs/sokrat-ai/` | predmeti · ispunjeni planovi (referenca) · **ideje koje nisu projekt** · zaseban projekt |

**Pravila (gate `npm run check:docs`, dio preflighta):** jedan aktivni plan · `product/` bez dnevnika · svaka mogućnost ima **kriterij prihvaćanja** („gotovo kad korisnik može X", ne „test je zelen") · svaki `.md` naveden u indeksu · nula mrtvih poveznica.
