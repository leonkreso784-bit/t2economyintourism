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
- **`npm run preflight`** — svi brzi deploy-gate-ovi u jednom (**check:lockfile** · verify · bump:check · css-drift · **check:tailwind** · **check:cdn** · **check:palette** · **check:safearea** · **check:contrast** · typecheck · schema · export-drift · check:docs · **check:state** · unit); pokreni PRIJE svakog main-pusha (i pre-push hook ga automatski vrti na main).
- **⚠️ OVISNOSTI SE PINAJU TOČNO — `^` je zabranjen.** `save-exact=true` u `.npmrc`, Node deklariran u `.nvmrc` (**22**, isto što vrti CI) i `engines`. Povod: CI je 2026-08-12 dvaput pao na `npm ci` prije ijednog testa, oba puta zato što je raspon `^` dopustio da **upstream objava promijeni razrješenje ispod nas** — ništa u commitu nije bilo krivo. Projekt nema runtime-ovisnosti, sve je alat: predvidljivost je vrjednija od automatskih zakrpa. **Nadogradnja je namjerna radnja uz pun gate, nikad nuspojava `npm install`-a.** ⚠️ **Od 2026-08-14 isto vrijedi za CDN-ovisnosti koje idu u preglednik** (`check:cdn`) — dotad je ovo pravilo pokrivalo samo alat.
- **`npm run check:state`** — tvrdnje o stanju koje neka naredba zna bolje. **Ne zabranjuje brojku, nego ju provjerava protiv gita** (zabrana bi dokumente učinila nečitljivima). Dvije provjere: ① broj commita žive grane mora se slagati s `git rev-list --count main..<grana>` (mergeane grane se preskaču — ondje je brojka povijesna i ostaje točna) · ② **zapovijed koja je već izvršena** — `git push origin main` označen kao „🔴 PRVO ŠTO TREBA" dok je `main == origin/main`. **Povod:** tri dokumenta koja se čitaju prva otvarala su se nalogom za push koji je bio obavljen, a broj commita je istog dana bio kriv u **tri** datoteke (pisalo 8, bilo 10). *Zastarjela ZAPOVIJED je gora od zastarjele činjenice — navodi sesiju na radnju.* Pokriva `CLAUDE.md` · `docs/plan/**` · `BACKLOG.md`; `CHANGELOG`/`PROGRESS`/`HISTORY` su namjerno izvan (ondje je „33 commita" tvrdnja o prošlosti). ⚠️ **Memorija je izvan repozitorija pa ju gate ne doseže** — poznata rupa, ne previd. Pada graciozno na plitkom checkoutu.
- **`npm run check:lockfile`** — bi li `npm ci` prošao? To je **prvi korak svakog CI joba**, a dotad nije postojao ni u jednom lokalnom gateu: razvojni stroj radi s već instaliranim `node_modules` pa lock može biti razišao, a vidi se tek kad push na `main` obori **sva tri joba u 10 s**, prije ijednog pravog testa (dogodilo se na `d4c7914`). Uzrok tad nije bio u commitu nego **izvan repozitorija** — `@tailwindcss/oxide-wasm32-wasi` ima `bundleDependencies`, pa je objava `@emnapi/wasi-threads@1.2.3` upstream razišla raspon `^1.2.2` s locka. ⚠️ **`npm install --package-lock-only` to NE popravlja** (idealno stablo ne dira disk → bajt-identičan lock); popravlja **`npm install`**. Gate **pada zatvoreno** (nepoznat izlaz = pad; samo prepoznata mrežna greška je preskok) i **vrti DVA npm-a** — lokalni i onaj koji CI koristi (čita `node-version` iz `ci.yml`). Drugi prolaz postoji jer je prvi popravak bio zelen na npm 11 i crven na npm 10: **gate koji vrti drugu verziju od CI-a daje lažnu sigurnost.** Lock se popravlja **`npx npm@10 install`** — najstariji npm u igri piše najpotpuniji lock.
- **`npm run build:css`** — regeneriraj `styles.bundle.css`; `-- --check` = CI drift-gate. Od C1 ga gradi **Tailwind CLI** iz manifesta **`css/app.css`** (`styles.css` je obrisan — dvije liste modula neizbježno se raziđu). Od C2 emitira i **drugi izlaz: `css/tokens.static.css`** (izvadak `:root` blokova iz bundlea) — `privacy/terms/faq/contact.html` ne učitavaju bundle, pa su dotad držale **vlastitu kopiju palete** i razišle se s aplikacijom. Oba izlaza pokriva isti drift-gate. ⚠️ Izvadak mora zadržati `@layer theme` omot i držati zadanu paletu **prije** tema — inače je pregazi (brana je u skripti).
- **`npm run check:safearea`** (T1) — **sigurna zona ima JEDAN izvor.** `env(safe-area-inset-*)` smije stajati samo u `css/variables.css`; svugdje drugdje ide `var(--safe-*)`. Povod nije urednost nego **mjerljivost**: `env()` se u pregledniku ne da simulirati, pa je pravilo napisano njime pravilo koje **nijedan test ne može ni potvrditi ni oboriti**. Zatečeno: **18 mjesta u 5 datoteka**, i posljedica se dala izmjeriti — `.mobile-nav` je ispravno pravilo iz `components.css` prepisivao nemjerljivom inačicom (**90 lažnih nalaza** u phone-brani), a `.landing-footer` je „radio" na način koji se nije dao dokazati. Druga provjera traži da ta četiri tokena u izvoru **postoje** (bez nje je nula golih `env()` savršena ocjena i za stranicu koja sigurnu zonu ne poznaje). ⚠️ Skener **briše komentare** prije provjere, uz očuvanje brojeva redaka: prva verzija je prijavila vlastito objašnjenje — *komentar nije pravilo*, isti razred kao `check:tailwind` §šum. Lokalno i brzo → **u preflightu**.
- **`npm run check:tailwind`** — 6 brana oko Tailwind sloja: dinamički sastavljena imena klasa · utility koji se zove kao naša legacy klasa · `@source` ugovor (`data/` se NE skenira, ADR-028) · Tailwind klase na stranicama bez bundlea · **šum** (pravila koja nitko nije napisao — skener ih izvuče iz `modes-grid` ili iz `if (!container)`) · **sudar animacija** (imena `@keyframes` su globalna i ne poznaju slojeve → Tailwindov ugrađeni `spin` tiho pobjeđuje naš; zato je naš `sokratSpin`). Lokalno i brzo → **u preflightu**.
- **`npm run check:cdn`** (+ **`check:cdn:live`**, mrežna) — brana oko **vanjskih podresursa**. Povod: politika točnog pinanja je pokrivala `package.json` — **alat, koji nikad ne dođe do korisnika** — dok 6 datoteka koje se izvršavaju u korisnikovu pregledniku nije pokrivalo ništa (Font Awesome, KaTeX ×3, DOMPurify bez SRI; MathLive s **golog `npm/mathlive`** = „uvijek najnovija", uz komentar koji je tvrdio da je pinan). **Brana je čuvala ono što ne može nauditi.** Tri lokalne provjere (SRI+`crossorigin` na tagovima · URL je verzioniran · skripte ubačene iz JS-a imaju oboje) → **u preflightu**; četvrta (`--verify`) uspoređuje bajtove s **izdavačevim objavljenim hashem**. ⚠️ Ta četvrta postoji zbog najsuptilnijeg nalaza: `supabase.min.js` **ne postoji u npm paketu** — jsDelivr ga generira svojim minifierom na zahtjev, pa je SRI bio pinan na **izveden artefakt tuđeg build-koraka**; promijeni li se taj minifier, hash pukne i **prijava se tiho ugasi** (`onerror` put u `auth.js`). Zato provjera okida **i kad je SRI točan**. Nadogradnja bilo koje CDN-ovisnosti = svjesna radnja: novi pin + novi hash + `test:authed`.
- **`npm run palette:breakdown`** — razloži ostatak palete po **POSLJEDICI**: zakucan TEKST (na svijetlom **nevidljiv**) · plohe/rubovi (blijedi, ali ispravni) · stara paleta (neusklađena, ali čitljiva). `-- --list` daje svako fatalno pravilo sa selektorom i pozadinom. **Povod je pouka, ne udobnost:** spec je tvrdio da svijetla tema čeka `check:palette` = 0, dakle cijeli C3–C7 — a razlaganje je pokazalo da blokira samo **46 od 435**, dakle posao od jednog popodneva. **Agregatna brojka može mjeriti točno, a savjetovati krivo**; prije nego neki broj proglasiš preprekom, razloži ga po tome što se zapravo dogodi korisniku. Read-only, NIJE gate.
- **`npm run check:palette`** — **čegrtaljka**: koliko je u `css/` i markupu ostalo boja iz STARE palete (indigo/slate) **i zakucane bijele/crne**, u OBA oblika u kojima se kriju (hex i `rgba()`). Povod: hex-revizija je našla ~78 mjesta, a stvarni broj je pri otkriću bio **435** — boja se krije u `rgba(99, 102, 241, .12)`, što hex-pretraga ne vidi. (Trenutni broj ispisuje sam gate; osnovica je u `scripts/palette-baseline.json` — namjerno se ne prepisuje u prozu.) **Ne traži nulu** (glow-ovi ne trebaju novu boju nego brisanje, zajedno s površinama u C3–C7), nego samo da broj **nikad ne poraste**; `--update` spušta osnovicu kad cigla očisti površinu. **Nula je uvjet da se birač tema uopće smije uključiti.** ⚠️ Uz čegrtaljku nosi i **TVRDU zabranu**: nijedno pravilo ne smije staviti **zakucan tekst na ispunu marke**. Povod: promjena palete pomaknula je marku iz tamnog indiga u svijetlu kredu, a **35 pravila** je držalo `color: white` — bijelo na kredi je **1.68**, dakle nečitljivo. `check:contrast` to NE hvata (dokazuje da je paleta ispravna, ne i da je CSS koristi), a axe je uhvatio **2 od 35** jer su ostala bila u `:hover`/`.active`/`.selected`. Boja teksta na marki ovisi o TEMI → uvijek `var(--on-primary)`. ⚠️ **Regex te zabrane je imao rupu do 2026-08-14:** tražio je `var(--primary)` sa **zatvorenom zagradom odmah iza imena**, pa `var(--primary, #6366f1)` — isti token s fallbackom — nije bio pogodak; nakon zakrpe ispala su još **2** skrivena pravila. **TVRDA ZABRANA #2 (C2):** `--primary-light` (= `brand-400`) **nije boja teksta** — to je varijanta za hover/ispune, a `check:contrast` je NIKAD ne mjeri kao tekst (mjeri `brand-500`). Na tamnom je prolazila, na svijetlom daje ~3.2 → pada AA; bilo je **26 pravila**, axe je uhvatio **1**. Za tekst ide `var(--primary)`. **Općenitija pouka: gate koji provjerava NEKE tokene stvara tihu pretpostavku da su provjereni SVI** — svaki novi token s ulogom mora ili ući u `check:contrast`, ili dobiti zabranu ovdje. **TVRDA ZABRANA #3 (2026-08-14):** **zakucana TAMNA ploha** — inverz prve dvije. Ondje je zakucan TEKST na temiranoj plohi, ovdje zakucana PLOHA ispod temiranog teksta; tema okrene tekst, ploha ostane → tamno na tamnom (`.st-icard` = **1.00**, doslovno ista boja). Dva kraka (pravilo · modulska varijabla tipa `--st-glass`), iznimke **izričite i s razlogom** (zastori, matiranje medija, platno slijepe karte, pločice ikona). Povod: čegrtaljka je tamne `rgba()` brojala kao „blago", što vrijedi za **bijele** rgba na svijetloj temi, a za tamne vrijedi **obrnuto** — jedna kanta je držala **dva suprotna kvara**. ⚠️ **Provjera „ima li pravilo zakucan svijetao tekst" RAČUNA luminanciju, ne gleda uzorak** — prva izvedba je bila regex i promašila `#e0e7ff`, pa je gate prijavio dva lažna kvara.
- **`npm run check:contrast`** — WCAG **po temi**: 164 provjere kroz sve 4 teme (tekst ≥4.5 · UI ≥3.0 · tekst na gumbu · hue-odvojenost „točno" od marke ≥25°). S jednom paletom se kontrast dao provjeriti rukom; s četiri je provjera okom prestala biti provjera. Parsira `css/tokens.css` — **ne drži kopiju vrijednosti** (kopija bi se razišla, pa bi gate čuvao paletu koje nema).
- **`npm run css:diff`** — dokaz da se IZGLED nije promijenio: izračunati stilovi svakog elementa u pravom Chromiumu, radno stablo vs `HEAD:styles.bundle.css`, kroz 3 širine; tokeni se broje odvojeno od prikaza. Traži preglednik + port → **NIJE u preflightu**; vrti ga uz svaku ciglu koja dira CSS.
- **`npm run test:responsive`** — Playwright (iPhone profili, default suite). ⚠️ **Prijava zna pasti sa `JWT issued at future` — to NIJE kod.** Lokalni sat je bio točan (<1 s), a isti token je kroz direktan HTTP prošao (`is_admin` = true, 200); riječ je o sub-sekundnoj utrci između sata koji `iat` **izdaje** (GoTrue) i onoga koji ga **provjerava** (PostgREST). 3/3 ponovljene prijave prošle. Ne tražiti uzrok u vlastitom kodu. · **`npm run test:authed`** — pozitivan admin-put (storageState; traži `TEST_ADMIN_EMAIL/PASSWORD` u `.env`; CI = zaseban secret-gated job).
- **`tests/phone.spec.js` + `phone.authed.spec.js`** (mjera: `tests/helpers/phone-gate.js`) — **T0 mjerač: jedina brana koja mjeri TELEFON KAO STRANICU.** Povod: produkcija je na 393 px bila neupotrebljiva uz **desetak zelenih gateova** — axe mjeri na 1280, `css:diff` uspoređuje nas sa samima sobom (hvata PROMJENU, ne LOŠOĆU), K3/K4a mjere KROMO. **Osam tvrdnji** (otok · budžet kroma · sukob kraćenja · dohvatljivost bez skrola · čitljivost naslova razine · **donji rub** · **bočni rub + spremnik** · **trajni donji namještaj nije prekriven**) na **320/393/430 px i 852×393 (polegnut)** + **četiri načina učenja**. ⚠️ **`env()` se ne da simulirati, ali `--safe-*` su NAŠE varijable iznad njega** — postavi ih na stvarne vrijednosti uređaja i **što se ne pomakne, stoji ispod izreza**; to je jedini način da se sigurna zona uopće izmjeri, i zato goli `env()` u pravilu znači **nemjerljivo pravilo** (brana: `check:safearea`). Obrnuta provjera se vozi **protiv produkcije**, ne protiv izmišljenog kvara. ⚠️ **Donji rub se mjeri NA DNU SKROLA** (dok se skrola, sadržaj kroz pojas prolazi — kvar je ono što iz njega ne može izaći), a **spremnik se mjeri kao SVOJSTVO** (skroler koji seže do ruba mora rezervirati rub) jer bi inače ljuska s kratkim sadržajem prolazila **slučajno** — točno to je skrivalo `padding-bottom: 0` na platnu Studija. Traži preglednik → **NIJE u preflightu** (vrti se u `test:responsive`).
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

## Stanje — TRENUTNO (2026-08-18)

> **🔴 CRVENI ALARM — TELEFON (Leon na iPhoneu 16, 2026-08-19/20). OVO JE SADA TEKUĆI POSAO.**
> Leon: *„cijeli frontend na produkciji je apsolutno DNO DNA… puca mi kurac za cigla po ciglu."*
> Puna specifikacija: **`docs/plan/FRONTEND_REDIZAJN.md` §9**. Prije C4 ulaze **dvije nove faze**:
>
> | | |
> |---|---|
> | **TELEFON** | **T0 mjerač** (prvi — mjeri STRANICU, ne kromo) · T1 sigurna zona · T2 jedan naslov po ekranu (**tu `#topbarMaterials` izlazi iz trake**) · T3 budžet kroma ≤20 % · T4 cookie-banner · T5 tipografija · **T6 editor s posjetiteljeva puta** |
> | **POLICA** | P1 što se skida · P2 gdje živi (**K4 se OVDJE utapa**) · P3 SW cache-first · P4 napredak offline |
> | **tek onda** | C4 → C5a → C5b → C6 → C7 |
>
> **Izmjereno na 393 × 852 (produkcija):** zaglavlje kataloga **270 px** · naziv fakulteta u
> **14 redaka** · naslov odrezan na **34 od 205 px** · „Start studying" na **y = 18 px** dok je
> otok 59 · kromo **32 %** ekrana · cookie-banner još **24 %** · landing **744,6 KiB u 41
> skripti, 238 KiB editorsko**. → **BUG-030** i **BUG-031**, oba
> **✅ riješena** (T2 i T1, 2026-08-21). ⚠️ **BUG-032 je otvoren od 2026-08-22** (v. T4).
> **⚠️ Korijen je JEDAN: telefon kao STRANICA nikad nije bio mjerena površina** — axe mjeri na
> **1280 px**, `css:diff` uspoređuje nas **sa samima sobom** (drift, ne lošoća), a K3/K4a mjere
> **kromo**. Zato faza počinje **mjeračem**, ne popravkom. *Sigurna zona se ipak DA izmjeriti:
> `env()` se ne da simulirati, ali `--safe-top` je naša varijabla iznad njega — postavi je na
> 59 px i **što se ne pomakne, stoji ispod otoka**.*
>
> **🔒 DVIJE TVRDE ODLUKE (Leon, 2026-08-19):** ① **ništa ne ide na produkciju dok cijeli
> frontend ne bude riješen** · ② **broj commita izvan produkcije NIJE nalaz i NE SPOMINJE SE**
> (*„ZNAM KADA ZELIM PUSTIT NESTO NA PRODUKCIJU"*; povod: raniji deploy koji se nije trebao
> dogoditi). Pravilo #2 (izričit OK za `main`) time dobiva dopunu: ne samo da se ne smije
> pushati bez OK-a, nego se na to ne smije ni **nagovarati**. [[leon-decides-deploys]]
>
> **🧪 VJEŽBE — smjer je zaključan, radi se TEK nakon frontenda** (§9.5). Tvrdnja *„vježbe su
> KÔD"* je **oborena mjerenjem**: od 234 vježbe **151 (65 %) je čisti podatak**, a `params` su
> **već deklarirani kao podatak u svih 83** koje imaju funkciju — od deset ključeva vježbe
> **devet je već shema**, kôd je samo **formula**. Smjer: formula **seli iz vježbe u imenovanu,
> verzioniranu knjižnicu recepata** (`recipe:'sample-sd'`) → vježba postaje **100 % podatak** i
> **BUG-012 se smije umiroviti**. Odbačeni: evaluator izraza (novi jezik, 93 % umjesto 100 %) i
> sandbox za korisnički JS (ruši ADR-018; tuđi `generate` bi odlučivao o **ocjeni**).
> [[exercises-code-vs-data]]
>
> ⬇️ **Faza „KOSTUR" je isporučila K1 · K2a · K2b · K3 · K4a i tu STALA** — ostaje kao povijest;
> spec **§8**. Ubačena je bila **između C3 i C4** (Leon, 2026-08-18), po presedanu C0-a.
> **✅ K1 (rute) JE GOTOV** — §8.6; devet stranica ima devet adresa, `css:diff` 0/3498.
> **✅ K2a (jedan model vraćanja) JE GOTOV** — §8.7; `goBack()` = povijest, inače
> `roditeljOd()` koji zna OBJE hijerarhije. Zatvara **BUG-026** i **BUG-027**.
> **✅ K2b (jedna gornja traka) JE GOTOV** — §8.8, i to **SPAJANJEM, ne slaganjem**
> (Leon, 2026-08-19). `<header class="topbar">` + `<div class="pathbar">` stoje **izvan**
> `-page` sekcija; red 1 = odredišta, red 2 = položaj (mrvica se penje kroz **`roditeljOd()`**,
> pa put koji pokazuje i put kojim gumb vodi ne mogu se raziĆi). ⚠️ **Spec je do tada tvrdio
> da Studio traži „točno jednu iznimku" (traka IZNAD njegove) — mjerenje je pokazalo da bi
> to POGORŠALO kvar:** `.st-topbar` je bila **347 px = 41 % telefona**, canvas 235 px, dva
> gumba **izvan ekrana**; slaganjem bi canvas pao na ~171 px. Spajanjem: **traka 57 px,
> canvas 326 px, nula odrezanih kontrola** → usput zatvoren 🔥 nalaz „Studio na telefonu".
> Landing je izgubio vlastitu traku (bez gumba „Moji materijali" — ondje su ulaz **vrata u
> herou**); mjere §7.13 prenesene: **traka 64 px, znak 42 px**.
> **✅ K3 (brana dohvatljivosti) JE GOTOV** — §8.9. Mjeri **POGODAK, ne postojanje**
> (`elementFromPoint` na sredini kontrole), jer bi „bar jedan klik drugamo" propustio oba
> Leonova kvara. **Cigla je odmah našla kvar: BUG-029** — na 320 px su „Predmeti" na
> landingu **prebacivali jezik** umjesto da otvore katalog (`.topbar-nav` se stisnuo na
> širinu 0 i gumb je ispod prekidača jezika). ⚠️ **Nijedan gate to nije mogao vidjeti:**
> `overflow:visible` + `scrollWidth == clientWidth` = **prelijeva nema**, a najuži profil
> je 375 px dok kriterij §2 imenuje **320**. Treći mehanizam iste obitelji u tri cigle:
> **odrezano** (K2b) · **prekriveno** (BUG-028) · **preklopljeno** (BUG-029).
> **✂️ „Predmeti" su MAKNUTI iz trake** (Leon, 2026-08-19: *„najnebitniji gumb ikada"*).
> Katalog nije izgubio ulaz — vode **vrata u herou** i **mrvica**; ključ `topbar.subjects`
> ostaje jer imenuje mrvicu. Cijena: iz police/profila/Studija katalog je sad **dva klika**.
> **✅ K4a (Studio na telefonu) JE GOTOV** — §8.10. Povod je Leonova rečenica *„zbog toga ne
> možeš ništa raditi na telefonu u editoru, apsolutno ništa"*, a mjera ju je potvrdila:
> ljuska **522–540 px = 62–64 % ekrana**, canvas 304–323 px → sada canvas **679 px**, ljuska
> **20 %**. ⚠️ **Rez ide po MODU, ne po širini:** `.st-tree` je u **čvor-modu** PRIKAZ jednog
> materijala (ime već piše dvaput) → briše se bez zamjene; u **katalog-modu** je NAVIGATOR →
> seli u **ladicu** (kvaka 🗂️, zatvara se nakon odabira). *Jedna tvrdnja o „stablu na
> telefonu" pokrivala je oba moda i zato je pola vremena bila kriva.* ⚠️ `display:none` ispod
> 680 px nikad nije radio (**medijski upit ne dodaje specifičnost**, bazno pravilo stoji
> niže) — nova pravila nose **dvije klase**; istu grešku sam pritom **ponovio na kvaki
> ladice** i uhvatila ju je sonda, ne oko.
> ~~Sljedeća cigla = K4~~ **← NADIĐENO, ne izvršavaj.** K4 se utapa u **P2** (v. niže);
> **K5** (editor dvojezično) je u redu čekanja i ne blokira ništa — premjereno 2026-08-19:
> **28 od 48** `studio.*` ključeva nedostaje, a `block-editor.js` i `admin-editors.js` imaju
> **nula** `t()` poziva (nisu djelomično prevedeni nego uopće nisu spojeni na i18n).
>
> **✅ T0 (MJERAČ) JE GOTOV** (2026-08-21, spec **§9.7**) — `tests/phone.spec.js` +
> `tests/phone.authed.spec.js`, mjera u `tests/helpers/phone-gate.js`: 3 širine × stvarne
> visine uređaja, otok simuliran na 59 px, **i četiri načina učenja na pravoj lekciji**.
> **Obrnuto provjeren na PRODUKCIJI** prije nego je napisana ijedna tvrdnja — ondje pada svih
> pet, na Leonovim brojkama („Start studying" `y=18…53`, naslov odrezan na **34 od 187 px**).
> ⚠️ **Cigla je usput oborila zapisani uzrok BUG-030:** naslov nije pojela mrvica (ona je
> `display:block` brat, ne može mu uzeti širinu) nego **pet kontrola u istom flex-retku**
> (231 px + 80 px razmaka = 311 od 345). **Zato kratko ime fakulteta samo po sebi ne bi
> popravilo ništa** — T2 mora spojiti zaglavlje s mrvicom. ⚠️ Brana je tada pokrivala **samo
> `--safe-top` i samo portret** — rupa koju je **T1 zatvorio** (v. niže: ⑥ donji, ⑦ bočni,
> ⑦b/⑦c spremnik, + četvrti profil 852×393).
> **Brana traži OSNOVICU, ne nulu** (`tests/phone-baseline.json`, obrazac `check:palette`) —
> jer su nalazi planom dodijeljeni ciglama T1–T5, pa bi nula držala suitu crvenom kroz **pet**
> cigli i **prava regresija u ostalih 400+ testova nestala bi u šumu**. Pada se **samo na
> kvaru kojeg u osnovici nema**; spuštanje = `PHONE_BASELINE_UPDATE=1 npx playwright test …`.
> Poznato danas: ② **25 ekrana** (320 px: browse **49 %**) · ④ **15** (na 320 px kromo+banner =
> **84–89 %**) · ⑤ **5** (`span.crumb` odrezan na 30 %) · prijavljeno **4**. ① i ③ su **0**.
> ⚠️ **Brana je treperila, a mjera je bila determinističa** — uzrok je bilo **fiksno čekanje**
> u navigaciji (*fiksno čekanje mjeri vrijeme, tvrdnja treba stanje*, kao K6b). Prelazak na
> čekanje-po-stanju iznio je još dva kvara u samoj brani: `offsetParent` je **uvijek `null`
> za `position:fixed`** (pa se mjerio zastor učitavanja kao kromo 100 %), i petlja spuštanja
> je izlazila iz kataloga (uvjet je **razina** `subjects`, ne broj klikova). **Čekanje ne smije
> pretpostaviti ishod mjerenja** — čeka se da se crtanje SMIRI, ne da se pojavi kontrola, jer
> je potonje baš ono što ④ mjeri. Nakon toga **4/4 zelena prolaza, 13 s umjesto 32**.
> `test:responsive` i `preflight` su **oba zelena**; bump nije bio potreban (dirani samo `tests/`).
>
> **✅ T1 (SIGURNA ZONA KAO PRAVILO) JE GOTOV** (2026-08-21, spec **§9.8**) — **BUG-031 je
> zatvoren**. Mjereno prije/poslije: donji rub **183 → 0**, bočni **16 → 0**, spremnik
> **16 → 0**; `css:diff` **0/3408** (rubovi su u Chromiumu 0, pa se prikaz ne smije pomaknuti).
> ⚠️ **Nalaz koji je odredio oblik cigle: pravilo napisano golim `env()` je NEMJERLJIVO.**
> Zatečeno stanje je imalo **dvije liste iste činjenice** — naš token (**39 mjesta u 9 datoteka**) i goli
> `env()` (**18 mjesta u 5 datoteka**) — pa je `.mobile-nav` ispravno pravilo iz
> `components.css` prepisivao inačicom koju mjera ne vidi (**90 od 183** nalaza nije bio kvar
> na uređaju nego **kvar u mjerljivosti**), a `.landing-footer` je „radio" na način koji se
> nije dao dokazati. Otud nova brana **`npm run check:safearea`** (u preflightu).
> **Pravilo za vodoravnu os je JEDNO:** `section[id$="-page"] { padding-left/right: var(--safe-*) }`
> — padding ide na **sekciju** (pozadina se crta i ispod njega → ploha ostaje preko cijelog
> ekrana, uvlači se samo sadržaj), a selektor je **atributni** jer popis klasa u `variables.css`
> ima osam imena i ne poznaje `#editor-page`. Odbačeni: `margin` na `<main>` (pregazio bi
> `margin: 0 auto` → sadržaj skače ulijevo na desktopu) i `padding-inline` na `<main>` (tražio
> bi popis svih postojećih razmaka). **Donji rub NIJE u tom pravilu** — `.study-page` nosi svoj
> `padding-bottom` zbog donje trake, pa bi ga zajedničko pravilo obrisalo; donji rub je zato
> **mjeren**, ne nametnut. **Fiksni namještaj → `max()`, skrolabilni sadržaj → `calc()`**:
> sa zbrajanjem je cookie-traka narasla za 34 px i gurnula **još jedan ekran** u „bez skrola se
> ne da ništa" — dakle popravak sigurne zone bi pogoršao tvrdnju ④; sa `max()` raste 20 px i
> taj ekran ispada. ⚠️ **Prolaz zbog kratkog sadržaja nije prolaz:** tvrdnja ⑦c mjeri
> **svojstvo** spremnika (skroler koji seže do ruba mora rezervirati rub) jer je Studio imao
> `padding-bottom: 0` na platnu, a ⑥ to nije mogla vidjeti dok je dokument prazan — prva
> izvedba te tvrdnje **nije mogla puknuti** i to je otkrio ispis kandidata, ne čitanje koda.
> **Cijena koja se izriče:** cookie-traka je viša za 20 px (**T4**), a osnovica je narasla za
> **landscape** (`kromo` 25→34 javno, 4→8 prijavljeno; `prviEkran` 15→20) — ništa od toga nije
> T1 nego **T3/T4**.
>
> **✅ T2 (JEDAN NASLOV PO EKRANU) JE GOTOV** (2026-08-21, spec **§9.9**) — **BUG-030 je
> zatvoren, i time nema nijednog otvorenog buga.** Kromo kataloga **307 → 167 px** (54 % →
> **29 %** na 320 px, 36 % → **20 %** na 393); lekcije 286 → 167, učenje 282 → 167; trenutna
> mrvica **30/99 → 99/99**; tvrdnja ⑤ **5 → 0**; osnovica javno **59 → 31**.
> ⚠️ **Mjerenje je pokazalo da tri zaglavlja NISU bila ista stvar**, pa rez nije jedan:
> lekcije i učenje su bili **čisti duplikat** zadnje mrvice → naslov je postao
> `visually-hidden` (stranica ga mora imati za čitač ekrana, ne mora **dvaput na ekranu**);
> katalog **nije** bio duplikat — ondje je zaglavlje nosilo dubinu (`fakultet › smjer ›
> godina`) koju mrvica **nije pokazivala** → dubina je preselila **u mrvicu**, a uputa
> („Odaberi smjer") **u sadržaj**, gdje se smije odskrolati. *Da je rez bio „makni zaglavlje",
> katalog bi ostao bez ijednog prikaza dubine.* **Pravilo: IDENTITET ide u mrvicu, UPUTA u
> sadržaj.**
> ⚠️ **Pravi kvar iza BUG-030 bio je PRIORITET KRAĆENJA, i bio je naopak:** preci su imali
> `flex-shrink: 0`, a `.crumb-current` `flex-shrink: 1` — stiskalo se **jedino što govori gdje
> si**, dok su preci držali punu širinu. Sada je obrnuto (uz `min-width` na precima i pomak
> lanca na kraj), a **brana je naučila razliku u ULOZI**: ⑤ mjeri odgovor na „gdje sam?"
> (trenutna razina), a preci su navigacija i smiju se kratiti — ne smiju se **lomiti**, i
> dohvatljivost im mjeri `reachability` pogotkom. To je bilo predviđeno komentarom uz prag
> („prag se pomiče uz zapis zašto, ne prešutno"), pa je i zapisano.
> **Traka je ostala bez ijednog odredišta** — `#topbarMaterials` je izašao (§9.6); ostaju znak,
> jezik, prijava i CTA. Cijena je izrečena: iz unutrašnjosti aplikacije u vlastite materijale
> se ide preko landinga ili profila (pet ulaza). `shortName: 'FMTU'` je dodan u `catalog.js`,
> ali kao **posljedica, ne lijek**.
> **Promjena razine kataloga ide kroz JEDAN ulaz** (`browseNaRazinu()`) jer se dubina sada vidi
> u traci — inače bi prikaz i mrvica opet imali dva izvora istine (K2b je to već platio).
>
> **✅ T3 (BUDŽET KROMA) JE GOTOV** (2026-08-21, spec **§9.10**) — kromo **ne probija budžet ni
> na jednom profilu**: 320 × 568 **108 → 100 px** (21 % → **19,6 %**), 852 × 393 **108 → 56**
> (27 % → **14 %**), 393 nedirnuto (već je prolazilo). Osnovica **javno 31 → 13, prijavljeno
> 8 → 0**. ⚠️ **Sonda je oborila skicu iz plana prije ijednog retka koda:** problem nije bio
> **količina** kroma nego **RASPODJELA** — na 320 px `.topbar` troši 64 px visine na 134 px
> sadržaja i ostavlja **146 px širine prazno**, dok `.pathbar` mrvici daje 252 od traženih
> **377**. Spajanje u jedan red ostavilo bi mrvici **94 px** (bez znaka 244) → **manje nego
> danas**, i poništilo bi T2. *Prije nego se dvije stvari spoje, izmjeri ima li ona koja gubi
> prostor odakle ga dati.* Zato **dva pravila**: ① `max-height:700px` → izvan landinga
> `--topbar-h: 56px` (**64 postoji zbog landinga**, gdje traka nosi CTA i sama je cijela
> navigacija; **znak ostaje 42 px**, mijenja se samo zrak — §7.13 netaknut) · ② `max-height:519px`
> → **jedan red**, uz `order:-1` da položaj ide lijevo. **Portret i landscape imaju suprotnu
> oskudicu, pa jedan rez ne može biti točan za oboje.**
> ⚠️ **Ljepljivost je preselila na novi `<div class="chrome">`** — sticky se ne može zalijepiti
> **izvan svog roditelja**, pa bi omotač od 108 px pustio traku da odskrola; trake su unutra
> statične. **Prva provjera je lažno prošla** (`browse` u portretu ima `scrollY = 0`) — *prolaz
> zbog kratkog sadržaja nije prolaz*, drugi put u dvije cigle; ponovljeno na 4980/773/5522/1118 px.
> 🐞 **Usput ispravljen stariji, tiši kvar: `--chrome-h` nikad nije pratio `body`** — `var()` se
> supstituira **ondje gdje je deklariran**, pa je vrijednost s `:root`-a bila zapečena i
> `body.no-pathbar` je nije mijenjao → landing je od `100dvh` oduzimao red koji ondje ne postoji.
> Dokazano **invarijantom** (`min-height == vh − kromo`, 15/15), ne pregledom. ⚠️ `css:diff` ima
> **225 razlika** i obje su klase očekivane (sticky preselio · `min-height` je baš taj ispravak);
> alat ispisuje **8 od 15** elemenata po širini → *kad gate ne može pokazati sve, dokazuje se
> invarijanta, ne uzorak.*
>
> **✅ T4 (COOKIE-TRAKA) JE GOTOV** (2026-08-22, spec **§9.11**) — traka na 320 px **217 → 129 px**
> (38 % → **23 %**), na učenju **105** (podignuta, pa joj sigurni rub više ne treba); 393 **195 → 129**,
> polegnuto **103 → 73**. Osnovica javno **13 → 10**.
> ⚠️ **MJERENJE JE OBORILO PREMISU CIGLE, a premisu je napisao T3.** Ovdje je stajalo *„svih 13 su
> svi do jednog zbog bannera"* — **nije istina: traka je uzrok na 3 od 13.** Optužba je bila pročitana
> iz **formata poruke** (nalaz ispisuje visinu trake kad god traka postoji, ne kad je kriva).
> *Nalaz koji nešto imenuje nije time i optužio to.* Razlaganje: **3** traka (✅) · **4** `lessons`, gdje
> stranica **nema nijednu kontrolu** → **BUG-032** · **4** `about`, jedna kontrola na `y ≈ 1500` →
> pitanje dizajna · **2** `landing`, hero gura vrata ispod pregiba → **T5**.
> ⚠️ **Kvar nije bila VISINA nego POKRIVANJE:** `.study-mobile-nav` je `z-index: 9999`, traka
> `2147483000` → na prvom posjetu je pokrivala **svih šest gumba** za promjenu načina učenja.
> Razdvojeno na svježoj stranici po varijanti: **samo stisnuta ④ = 0**, **samo podignuta ④ = 6**.
> *Stiskanje ne popravlja ništa* — ostaje kao udobnost. Pravilo: `bottom: var(--bottom-furniture-h)`,
> a vrijednost **mjeri i objavljuje `js/consent.js`** (obrnuti smjer od `--bottom-inset`; **fiksni
> element ne vidi drugi fiksni element**). Mjeri se jer visina navigacije **ovisi o širini** (93 px na
> 320, 97 na 393). Sigurni rub se **oduzima** za ono što je već ispod trake, inače traka nosi 34 px
> praznine usred ekrana. Traka je usput **prvi put prevedena** (bila je jedina površina sa zakucanim
> engleskim, a to je pravni tekst) i skraćena sa 171 na 100 znakova; gumbi ostaju **36 px**.
> ⚠️ **Nova tvrdnja ⑧** (trajni donji namještaj nije prekriven) — obrnuta provjera je prijavila
> **17 ekrana**, dok ih je ④ vidjela **3**. *Brana koja mjeri posljedicu vidjela je 18 % kvara.*
> ⚠️ ⑧ ima **dvije** mjere: središte svake kontrole **i** gornji rub trake — *pogodak u sredinu
> ne dokazuje da je kontrola cijela vidljiva* (pri preklopu od 34 px središta gumba ostaju ispod
> pokrivača; na 393 px je mjera središta šutjela, mjera ruba prijavila 3 od 3 točke).
> ⚠️ **Funkcionalna sonda** (jezik · prihvat · odbijanje · položaj) je uz to našla da `ResizeObserver`
> po zadanom prati **content-box**, a visina navigacije raste **isključivo razmakom** → promatrač nije
> okidao (`{ box: 'border-box' }`). *Promatrač koji gleda krivu kutiju je promatrač koji ne gleda.*
> ⚠️ **Osnovica prijavljenih je pokušala progutati TUĐE STANJE:** četiri `dno` nalaza na polici koje
> dva ponovljena prolaza **istog koda** nisu reproducirala — polica je **podatak**. Maknuti; kvar
> riješen **svojstvom** (`.profile-content` rezervira donji rub, 16 → 34 px). **Pravilo: prije nego
> nalaz uđe u osnovicu, ponovi mjerenje.**
>
> **✅ T5 (TIPOGRAFIJA I PROSTOR) JE GOTOV** (2026-08-22, spec **§9.12**) — vrata landinga na
> 320 px **y = 567 → 338** (pojas do 439), polegnuto **425 → 200**; naslov 48 → **32 px** (3 → 2
> retka), podnaslov **5 → 2 retka**. Osnovica javno **10 → 8**, i **nijedan preostali nalaz nije
> više na landingu**.
> ⚠️ **Korijen nije bila veličina nego to što se veličina NE MIJENJA S EKRANOM:** hero je koštao
> **jednako 444 px na svakom telefonu** — 444 od 803 px pojasa na Pro Maxu (u redu) i **444 od
> 316 na SE-u**. *Trošak je bio konstanta, a prostor varijabla* (isti razred kao T3, gdje problem
> nije bila količina kroma nego raspodjela). Utility-ljestvica se mijenja **stepenasto po ŠIRINI**,
> a telefonu nedostaje **VISINA** → polegnut telefon je po širini „desktop" i dobivao je **60 px
> naslova na ekranu koji za cijeli hero ima 256 px**. Zato su tip i ritam heroja izašli iz markupa
> u `landing.css` — **jedina iznimka od C1/C2**, jer `.hero-title` i `.text-4xl` imaju istu
> specifičnost a utilityji stoje zadnji (dobiti specifičnošću je isti smjer kao `!important`, što
> `app.css` izričito zabranjuje); pragovi na **≥768 px vraćaju TOČNO današnje tokene**.
> ⚠️ **Prvi ekran je istu stvar govorio TRI puta** (naslov imenuje četiri načina · podnaslov ih
> nabraja · sekcija niže ih pokazuje), a prva polovica podnaslova stajala je **doslovno u opisu
> prvih vrata** → skraćen sa 135 na 72 znaka. **To je promjena TEKSTA na Leonovoj površini i zato
> se izriče**; struktura iz §7.13 je netaknuta.
> 🐞 **Dva pravila koja sam napisao zvučala su kao ispravak, a nisu bila — oba je oborila obrnuta
> provjera:** `br{display:none}` bez podizanja stropa mjere ne mijenja **ni piksel** (*pola pravila
> mjeri se kao mrtvo slovo*), a `white-space:nowrap` na markeru nije nosiv — frazu drži **naslov
> sveden na stupac**, i uz to bi `nowrap` prelom pretvorio u **prelijevanje**, dakle u gori kvar.
> **Pravilo koje zvuči kao ispravak nije ispravak dok obrnuta provjera ne pokaže da bez njega pada.**
> ⚠️ **`css:diff` OVU ciglu ne može izmjeriti, i to je nalaz o alatu:** presreće **samo stylesheet**,
> a HTML uzima iz radnog stabla → kad vrijednost seli iz markupa u CSS, referenca je stranica koja
> **nikad nije postojala** (46 razlika, i na 768 i 1280 gdje se ništa nije promijenilo). Dokaz je
> izveden **pravim A/B-om** (HEAD iz zasebnog `git worktree`-a, drugi port, obje verzije sa svojim
> markupom i CSS-om): **0 razlika na 768 i 1280**, 22 na 375 i sve namjera. Ponovit će se u C4–C7.
> ⚠️ **Nova tvrdnja je u `landing.spec.js`, ne u phone-brani** (specifična je za jednu površinu):
> potez preko fraze u **jednom retku**, u **oba jezika**, i **izričito na 320 px** — jer projekti
> suite počinju na 375, a kriterij §2 imenuje 320, pa je tvrdnja na 375 px **prošla nad kvarom**.
>
> **🔵 SLJEDEĆA CIGLA = T6 (editor s posjetiteljeva puta) — i to je ZADNJA cigla faze TELEFON.**
> Izmjereno: **744,6 KiB u 41 skripti, 38 bez `defer`**, od toga **238,2 KiB (32 %) editorsko** u 6
> datoteka; vlastiti budžet projekta je 200 KB → **3,7×**. Uvjetno učitavanje + budžet kao gate.
> **T6 nije čišćenje nego preduvjet faze POLICA** (offline ljuska ne smije nositi editor koji
> offline student nikad ne otvori).
> **🔴 BUG-032 je OTVOREN** (`lessons` nije upotrebljiv tipkovnicom ni čitačem ekrana — kartica je
> `div` s klikom): nije telefonski kvar nego **jedini put u svaku lekciju kataloga**. Zaslužuje
> vlastitu ciglu; u istom retku treba i escape (BUG-025).
> **K4 se NE radi zasebno** — utapa se u **P2** (ista pločica, isti ekran; odvojeno bi se
> pisalo dvaput). **K5 ostaje u redu čekanja** i ne blokira ništa.
> **A1 + A0: REDOSLIJED NIJE PRESUĐEN** (Leon, 2026-08-19: *„ne znam još, to ćemo se
> dogovorit"*) — ne planirati ga ni prije ni poslije ovih faza dok Leon ne kaže. Kad dođe,
> A0 i A1 idu **zajedno**: `#authModal` je građen za jedan put, a OAuth-gumbi su primarni i
> idu IZNAD e-maila, pa se inače prepravlja dvaput.
>
> **Ovdje se stanje NE prepisuje.** Grana, commiti, je li pushano — to zna git:
> `git status -sb` · `git rev-list --count main..HEAD` · `git log --oneline -1 origin/main`.
> Što je na produkciji: zadnji **🚀** redak u `docs/records/CHANGELOG.md`. Koliko predmeta:
> `npm run verify`. **Brojka prepisana u prozu ostari istog dana** — dogodilo se triput u tri
> dana (17 predmeta uživo · „8 commita" kad ih je bilo 9 · pa opet 8 kad ih je bilo 10, i to
> u tri različita dokumenta). Zato od 2026-08-18 postoji **`npm run check:state`**: ne
> zabranjuje brojku, nego ju **provjerava protiv gita** — i pada na zapovijed koja je već
> izvršena, jer zastarjeli NALOG navodi sesiju na radnju, a zastarjela činjenica samo zbunjuje.

> **Povijest NIJE ovdje.** Milestone-i: `docs/records/HISTORY.md` · dnevnik po sesijama: `PROGRESS.md` ·
> što je isporučeno: `CHANGELOG.md` · bugovi i lekcije: `BUGS.md` · otvorene ideje: `BACKLOG.md`.
> **Ovdje stoji samo ono što vrijedi SAD** (ADR-027).

- **🎯 TEKUĆA FAZA = FRONTEND REDIZAJN NA TAILWIND** (spec: `docs/plan/FRONTEND_REDIZAJN.md`, ADR-028; opseg = cijela platforma **i** editor; cigle **C0–C7**, uz **C5 razbijen na C5a (modovi uvježbavanja) + C5b (gradivo i vježbe)** — Leon, 2026-08-13; bila je 2755 redaka, rez ide po šavu, ne po veličini — C1 = temelj **bez ijedne vizualne promjene**, pa landing → **vlastiti materijal + editor** → browse → modovi. **Next.js razmotren i ODBIJEN** — obrazloženje u ADR-028, ne otvarati iznova). **✅ C0 JE NA PRODUKCIJI** (`00e134b..0e2843a`) — ulaz u vlastiti materijal je ravnopravno odredište. **✅ C1 JE NA PRODUKCIJI** (2026-08-12, `c9413a0..d4c7914`; Vercel `dpl_6fgHTmk…` READY, `styles.css` vraća 404 — v. „🚀" redak u CHANGELOG-u): tailwindcss **4.3.3 pinano**, manifest je sad **`css/app.css`** (`styles.css` obrisan), tokeni u **`css/tokens.css`** (`@theme static`, semantička imena, **vrijednosti namjerno današnje**), Tailwindov preflight se NE uvozi, `--color-*`/`--shadow-*`/`--font-*`/`--radius-*` obrisani do nule (`bg-indigo-500` **više ne postoji**). Dokaz: **3438 usporedbi izračunatih stilova, 0 razlika** (`css:diff`, obrnuto provjeren). **✅ C2 (landing) JE NA PRODUKCIJI** (isporučen zajedno s C3, 2026-08-18): landing **pokazuje** mehaniku umjesto da je opisuje (upišeš pojam → odmah kartica/kviz/dopuna/gradivo), 6 sekcija → 3, `landing.css` **1079 → 578**, `check:palette` **427 → 339**, bundle **224 → 210 KB**, **Google Fonts obrisani** (sistemski grotesk = pravi San Francisco na Appleu, 0 bajtova). Ulaz u vlastito gradivo **seli iz trake u vrata**. Detalji: spec **§7.8**.
**⚠️ LANDING IZ C2 JE ODBIJEN NA LEONOVU EKRANU (2026-08-14, spec §7.13) — mjere gore i dalje vrijede, ali KONCEPT ne.** *„Samo uđeš na landing i vidiš tutorial kako se rade materijali je bez veze."* Hero je tražio od posjetitelja da **RADI** (upiši pojam, upiši objašnjenje) prije nego mu je dan razlog, a **cijeli katalog gotovog gradiva bio je nevidljiv na ulazu**. Novi oblik (presuđen na maketi, **ništa još nije u repou**): naslov koji pokriva OBA izvora → **dvoja ravnopravna vrata** → katalog s pravim bojama/ikonama iz `catalog.js` → **vlastito gradivo kao puna sekcija** → **tvoj AI (MCP)** → četiri načina na pravoj lekciji **bez ijednog upisa**. **➕ POSLJEDNJA pločica** (`＋ Tvoj predmet`) jer puna mreža inače čita kao zatvoren popis — renderira se **iza posljednjeg predmeta iz kataloga**, nikad na fiksnoj poziciji. ⚠️ **Broj predmeta se NIKAD ne piše rukom** (spec §7.13): taj je odjeljak pisan dok ih je bilo 22, istog dana ih je 24, i svaka rečenica s brojem u sebi odmah je bila neistinita — a landing je taj razred greške već imao **na produkciji** (pisao 17 umjesto 22). Broj ide iz `allReachableSubjects()`. **ADR-029 dopunjen:** *prije* → **ravnopravno** (UGC vidljiv od prvog ekrana). **Usput pada BACKLOG-stavka „240 KB editorskog koda na landingu"** — nosio ju je baš živi prikaz. 🔒 **ZNAK JE NEPROMJENJIV** (Leon: *„sokrat logo je nezamjenjiv"*) — ne prepravlja se nego dobiva PROSTOR (traka 64px, znak 42px) i **zadržava indigo kroz sve teme = konstanta marke**.
**🛠️ POPRAVAK C2 (2026-08-14, spec §7.9) — C2 nije bio gotov.** Prebacivanje zadane teme u svijetlu **slomilo je PRIJAVLJENE površine**: `studio`/`block-editor`/`my-materials`/`auth`/`sokrat-confirm`/`pages` zakucavaju TAMNU plohu, a tekst na njoj dolazi iz tokena — tekst se okrenuo, ploha nije. Izmjereno: `.st-icard` **1.00** (ista boja), dijalog potvrde **1.02**, `.st-kv` **1.18**, prijava **1.83**. **Nijedan gate nije pisnuo iz tri neovisna razloga**, a treći je najvažniji: **axe posjećuje `#materials-page` ODJAVLJEN, a `#editor-page` nikad → prijavljene površine nemaju nijedan vizualni gate.** `check:palette` **339 → 126**. Iz toga: **tvrda zabrana #3** (zakucana tamna ploha) + **zakrpana rupa u zabrani #1** (`var(--primary, #fallback)` nije bio pogodak; nakon zakrpe ispala su još 2 pravila). **`--st-violet` umirovljen** — pada AA u svih 5 tema **od U8**. **`--bg-card` dobio definiciju u mostu** (postojao je samo u `legal.css`, koji app ne učitava → uvijek je gorio fallback `#0f172a`).
**🧱 C3 JE POČEO — GATE-om, ne CSS-om** (2026-08-14, grana `feat/c3-vlastito-gradivo`, spec §7.10). C3 prepisuje baš tri površine bez ijednog vizualnog gatea, pa je prva cigla brana: **`tests/a11y.authed.spec.js`** = axe na **7 prijavljenih stanja × 5 tema = 35 mjerenja** (materijali **sa stablom**, Studio, block-editor, dijalog potvrde), logika u **`tests/helpers/axe-gate.js`** dijeljena s odjavljenim gateom. **Pao je odmah i našao 4 kvara na produkciji:** `role="tree"` na `<ul>` **gasi implicitnu ulogu liste** → `<li>` bez uloge, pa je za čitač ekrana korisnikova polica bila **prazno stablo** (critical + serious, stoji od F2) · color-input samo s `title` · i, tek u prolazu kroz teme, **tekst boje marke na plohi tintanoj istom markom** (4.03 na `paper`, **ispravno u ostale 4**) — popravak **ukida razred** (tekst → `--text-primary`), ne pomiče postotak. **Dvije trajne pouke: kvar koji nitko ne mjeri nije suptilan nego nemjeren; gate koji mjeri jednu temu tvrdi nešto o jednoj temi.** Otvoreno iz revizije (u `BACKLOG.md`): **landing šalje editorski kod** posjetitelju bez računa uz vlastiti, nikad izgrađen budžet „JS ≤ 200 KB" — ⚠️ **C3 je isporučen a stavka je OSTALA otvorena**, pa više ne visi ni o jednoj cigli (danas **728 KiB u 41 skripti, 38 bez `defer`, 232 KiB = 31 % editorsko**; premjereno 2026-08-19 — brojka je RASLA, sama se ne popravlja) · **CSP odgođen „do UGC-a", a UGC je na produkciji** (→ C6).
**📐 C3, DRUGA CIGLA — ŠIRINA** (spec §7.11). Mjereno prije prepisivanja: **duga u tri C3 datoteke gotovo nema** (`my-materials`/`block-editor` = 0 `!important`, 0 zakucanih boja; od 11 „hex" u `studio.css` ih je 10 **u komentarima**) → tehnički dug C3-a je **5 `!important`**. ⚠️ **Tablica cigli i stvarni obrazac faze se razilaze:** §3 kaže da tri datoteke „nestaju", ali bundle ima **ukupno 22 utilityja**, a `landing.css` nakon C2 **postoji na 578 redaka** — faza radi **brisanje mrtvog + spajanje na tokene**, ne utility-juhu. **Prava rupa je bila ŠIRINA:** kriterij #1 traži 320 px i imenuje editor, a `320` je postojao u **jednom** testu (CTA landinga), `responsive.spec.js` ne posjećuje materijale ni editor, najmanji profil 375 px → **`tests/layout.authed.spec.js`** (21 širina). **Detektor je bio kriv dvaput, drugi put opasnije:** izuzimao je sve unutar pretka s `overflow-x:auto`, a paneli Studija imaju `overflow-y:auto` → **po CSS specifikaciji druga os postaje `auto`**, pa je izuzeta cijela unutrašnjost Studija; obrnuta provjera to dokazala. **Nalaz je bio veći od C3 — kvar je u RENDERERU:** tablice iz v1 `legacy-html` nisu imale `.lb-table-wrap` (v2 ga ima), pa su prelijevale platno (`469 > 320`) — a **isti renderer služi studentov `learn`**, dakle kvar na produkciji za svaku staru lekciju s tablicom na svakom telefonu. Popravak `wrapLegacyTables()`; **`display:block` odbačen** jer uklanja semantiku tablice.
**🧹 C3, TREĆA CIGLA — `studio.css` je na NULI `!important`** (2026-08-14, `4c4f26b`, spec §7.12). Onih 5 nisu bila pet problema nego **dva puta isti**: `:hover` pravilo koje ne izuzima svoju iznimku, pa se iznimka morala braniti. `.st-btn.primary:hover` (1id+3r) tuče `.st-btn:disabled` (1id+2r) → **onemogućen gumb se podizao pod mišem** („Spoji svoj AI" stoji `disabled` dok MCP ne postoji). Rješenje **posuđeno iz `block-editor.css`** (`.be-btn:hover:not([disabled])`, 0 `!important`) — `studio.css` je bio iznimka u vlastitoj kući. ⚠️ **`css:diff` ovo NE VIDI** (mjeri mirno stanje, promjena živi u `:hover`/`:disabled`) → nova brana **`tests/cascade.authed.spec.js`**, svaka tvrdnja s obrnutom provjerom (kontrola = **isti gumb bez atributa `disabled`**). **Najkorisniji trenutak:** obrnuta provjera **privremeno kvari repozitorij**, pa je bundle ostao na pokvarenoj verziji — uhvatio ga `build:css --check`. Gate: preflight EXIT 0 · `css:diff` 0/3210 · **`test:authed` 73/73**.
**🏗️ LANDING, CIGLE A i B (2026-08-15, spec §7.14; grana `feat/c3-vlastito-gradivo`, **mergeana i na produkciji od 2026-08-18**).** **A:** živi prikaz obrisan iz svih šest datoteka gdje je živio (58 markup + 78 JS + 18 poruka + 202 CSS + poziv + kuka); `landing.css` **578 → 380**; naslov pokriva OBA izvora gradiva. Dva testa **obrisana odlukom, nisu pala** — razlika je zapisana, a umjesto njih stoji tvrdnja da hero **ne traži nikakav unos**. Nova brana u `npm run verify`: **jedini ručno pisan broj predmeta** (statični fallback u `index.html`) mora pratiti katalog — već je jednom tiho ostario (pisao 8 kad ih je bilo 22). ⚠️ **Spec je tvrdio neistinu koju sam trebao samo prepisati:** brisanjem demoa **NE** nestaje „240 KB editorskog koda“ — demo je bio čisti `textContent`, a tih 234,2 KB učitavaju obični `<script src>` na dnu `index.html`, bezuvjetno (landing = **654 KB u 39 datoteka**, budžet 200). **Pretpostavljena uzročnost preživjela je reviziju jer je zvučala uzročno.** **B:** glif na pločici predmeta bio je **nečitljiv na 10 od 24 predmeta** u zadanoj temi (`#f59e0b` = **2.15**, 5 predmeta), na **tri površine** (landing, bočna traka svake study-stranice, Browse). **Nijedan od tri gatea ga nije vidio:** `check:palette` klasificira po pozadini koju vidi U CSS-u, a ova dolazi iz podatka kroz inline `style` → `color: white` prošao kao bezopasan · `check:contrast` mjeri TOKENE, a boje predmeta nisu tokeni · axe ne mjeri Font Awesome glif (sadržaj je u `::before`). Popravak je **pravilo, ne ugađanje boja**: tinta se bira izračunom luminancije iz dva **tema-neovisna** tokena (`--color-on-tint-dark/-light`) — neovisna jer je i ploha ispod njih tema-neovisna. ⚠️ Prag sam prvi put **napisao napamet i promašio**; sad ga `check:contrast` **preračuna iz tokena**. Druga brana: **`tests/tint-ink.spec.js`** (4 teme × 3 površine, čita IZRAČUNATU boju u pregledniku). ✅ **ZATVORENO 2026-08-16:** `a11y.authed` (Studio) je bio **artefakt okruženja, ne regresija** — 46,2 s na odmornom stroju, isti kod. Iz toga **normala trajanja** kao nova navika: puna suita **23,5 min / ~401 test**, `a11y.authed` **1,0 min**. *Dnevnici su dosad bilježili KOLIKO je prošlo, nikad KOLIKO je trajalo — pa se „je li test pokvaren ili je stroj spor?" nije dalo odgovoriti bez kontrolnog prolaza s izvornim kodom.* ✅ **Cigle C i D landinga su gotove** (spec §7.15) — grana `feat/c3-landing-cd`, preflight 0, **nepushana**.
**🎨 ZADANA TEMA JE SVIJETLA — „Akademsko plavo"** (`academic`; ostale: `paper`, `chalk`, `mint`). **Dvije tamne palete zaredom pale su na živom ekranu** („Ponoć i menta", pa „Kreda i tabla") — pouka §7.3 je bila zapisana i svejedno ponovljena. **⚠️ NAJVAŽNIJI NALAZ C2 nije paleta nego brojka:** spec je tvrdio da svijetla tema čeka `check:palette` = 0 (dakle cijeli C3–C7); mjerenje je pokazalo da su to **tri duga zbrojena u jedan** — samo **46** je zakucan TEKST (nevidljiv na svijetlom), 54 su plohe (blijede), 125 stara paleta (čitljiva). **Prepreka je bila 46 pravila, ne pet cigli. Čegrtaljka mora brojati po POSLJEDICI, ne po uzorku** — inače mjeri točno, a savjetuje krivo. Smjer izgleda je **APPLE** (Leon: *„apple smjer, naravno, to se podrazumijeva"*): grotesk svugdje (**serif nadglašen**), praznina, tipografija nosi, monokrom + jedan akcent. Spec **§7.3–7.8**. Pouke C0-a i **četiri nalaza C1-a** (kaskadni slojevi tuku specifičnost · Tailwind skenira kao tekst · imena `@keyframes` su globalna · statička analiza i preglednik hvataju različite bugove) stoje **u samom specu**, ne ovdje. ✅ **BUG-024 i BUG-025 su NA PRODUKCIJI** (`5843f7e..5997232`, provjereno kroz živi kviz). **Trajno pravilo koje je iz njih izašlo — vrijedi za SVAKU sljedeću ciglu:** prikaz blokova ide **isključivo** kroz `renderContentBlocks()`, a **svaki tekst iz podataka koji ide u `innerHTML` mora kroz `SokratBlocks.esc`** (ikona kroz `safeIcon` — ide u `class`, gdje escape ne pomaže; boja kroz `accentFrom`; URL kroz `safeUrl`). Sigurnosna granica je dotad pokrivala samo **blokove**, a ne i tekst stavki — zato je jedno pitanje u `statistics` bilo **neodgovorljivo**. Brane: `tests/escaping.spec.js` + izvorna brana u `tests/unit/blocks-renderer.test.js`. [[escape-all-data-in-innerhtml]] Prethodna faza **„Mjera i zaborav" je ISPUNJENA i na produkciji** (2026-08-08): strop duljine kartice (200 upozorenje / **500 tvrda blokada**; politika = `js/card-limits.js`, čitaju je editor **i** `validate:content`) + **self-service brisanje računa** (Edge Function `delete-account`, `test:delete-account` 18/18 vs staging). Zapisana sekvenca dalje (**izmijenjena 2026-08-13, ADR-030**): **frontend redizajn** (uklj. „akcent = CIJELA kartica") → **MCP kao glavni put stvaranja** → **objava/dijeljenje** (doseg presuđen: **link s tajnim tokenom, bez javne biblioteke**). MCP je promaknut ispred objave; **prvi korak MCP-a nije write-put nego PRISTUP** (kako korisnikov AI dokaže tko je). ⚠️ **Matura = IZBAČENA.** Otvoreno u `docs/records/BACKLOG.md`: **M5b** (skratiti **25 JEDINSTVENIH** kartica preko 500 — 48 je s kopijama u `final` — PA `maxLength` u shemu; obrnuto ruši CI).
- **NA PRODU** (**točan SHA, token i Vercel-ref = zadnji „🚀" redak u `docs/records/CHANGELOG.md`** — ovdje se namjerno ne prepisuju, mijenjaju se svakim deployem; ADR-027): **24 predmeta** (17 EN u Supabase + **7 HR file-served**) · auth + cloud-sync + profil + GDPR · **Studio editor** (admin) · **osobni UGC-graditelj „Moji materijali"** · **faza „Materijal od nule do učenja"** — materijal se gradi od nule, iz njega se uči, boje sekcije vidljive u sva 4 moda · rizik-sprint 7/7 · GA4 + Sentry (consent-gated) · SW offline · i18n HR/EN · CI + deploy-guard. Tablica predmeta: `docs/subjects/README.md`.
- **🎨 Frontend je ZADNJI na redu** (Leon): *„sve mora savršeno raditi prije nego ga uredimo."* → funkcija prije vizuala. [[frontend-last-function-first]]
- **⚠️ Osobni graditelj = ZASEBAN OTOK (ADR-024):** javni katalog · 24 predmeta · studentski vrući put · `publish_document` = **NEDIRNUTI**. `anon` nema ništa, `authenticated` ima **samo SELECT**, **svaki upis ide kroz `SECURITY DEFINER` RPC s owner-checkom** (`owner_id = auth.uid()`).
- **Editor (admin CRUD) = funkcionalno gotov** — Studio: stablo/canvas/inspektor, svi modovi uredljivi, media (slika/video/KaTeX-MathLive/tablica-paste), drag-drop, boje. Preostali polish je **neobavezan**: `docs/archive/EDITOR_PLAN.md §12`. [[editor-must-be-real-product]]
- **STAGING Supabase:** `sokrat-staging` (ref `czljmvigkgiajzjxtndq`) — write/draft testovi, da prod-audit ostane čist. `test:authed`/`rls-check` gađaju staging kad su `STAGING_*` u `.env`; seed = `node scripts/seed-staging.js`.
- **⏳ Grane izvan `main`-a:** ✅ **Obje Sašine grane su MERGEANE 2026-08-15** (`e8f6c59` entrepreneurship-hr, `1cbc82b` ebusiness-hr; grana `merge/sasa-hr`). **Pouka koja vrijedi za svaki sljedeći zaostali content-PR:** grane su dirale 17 datoteka i izgledale kao platformski zahvat, a **11 ih je nosilo isključivo `?v=` tokene** — izmjereno (`git diff` bez token-redaka = **0 redaka**), pa je razrješenje *uzmi `main`, pa `npm run bump`*, ne ručno spajanje. **Token nije sadržaj nego izlaz alata.** Ručno se spaja samo `data/catalog.js` i `docs/subjects/README.md`; `styles.css` = prihvati brisanje (C1). **Koje grane danas stoje izvan `main`-a NE piše ovdje** — `git branch --no-merged main` to zna, a popis se mijenja svakim mergeom (v. `check:state`). Jedina koju treba pamtiti je **`feat/c3-landing-cd`** — više ne nosi samo cigle C+D landinga nego i **cijelu fazu „KOSTUR" (K1 · K2a · K2b)**; čeka Leonov pogled. **Broj commita se NE piše ovdje** — `git rev-list --count main..feat/c3-landing-cd`.
- **👥 Saša Vudrag** (content-suradnik) — opseg **SAMO HR sadržaj + PR-workflow** (`docs/workflow/TEAM.md`, role-router gore; ADR-023). **🛑 STOP-NALOG JE ISPUNJEN (2026-08-15)** — obje grane su mergeane, ali **s naše strane, ne Sašine**: bile su 88 commita iza, a nakon C1 rebase nosi modify/delete na obrisanom `styles.css` i druga grana nužno konfliktira s prvom — to je platformski posao izvan njegova opsega (ADR-023). Saša je **na stanci dok frontend redizajn nije gotov**; javiti mu da su objavljene. **S4+S5** (`macroeconomics/statistics/math/accounting-hr`) je time **PAUZIRAN, ne otkazan**. Razlog stanke je mehanički: C2–C7 bumpaju iste cache-tokene i prepisuju `index.html` koje dira i svaki content-PR. Puni nalog: `docs/workflow/TEAM.md` §9. PR-ovi → `content-review` agent. [[content-model-standard]]
- **HR-ekspanzija:** HR 1. god × 3 smjera FMTU dijele vezne predmete (ADR-022; `docs/architecture/CATALOG_ARCHITECTURE.md`). Kad HR program bude potpun → **HR u Supabase** (Leon/Claude `migrate-content.js`, ne Saša). [[hrv-program]]
- **PAUZIRANO za nas:** 3. godina · novi EN sadržaj (ADR-018: student uploada PODATKE, nikad KOD).
- **⏳ ČEKA LEONOVU RUKU (2, sve istraženo i opremljeno gateom — ostala je samo radnja; detalji u `BACKLOG.md`):** ① obrisati `bright-function` + `quick-api` (Dashboard → Edge Functions) — **`npm run check:functions` je CRVEN — provjereno 2026-08-21** (oba sluga vraćaju 401, dakle postoje); `bright-function` ima sha256 **identičan** `delete-account`-u = drugi, nezapisani endpoint koji briše račun. ⚠️ **Odgođeno do C6 Leonovom odlukom (2026-08-13), a odgoda je izmjerena, ne pretpostavljena** — rizik je isključivo **divergencija** (da `delete-account` dobije guard koji ne stigne do kopije), a nijedna cigla frontenda ne dira Edge Functione; **uvjet koji odgodu poništava: dirne li itko `supabase/functions/delete-account/`, briše se odmah** · ② podići **Minimum password length 6 → 8** (Auth → Sign In / Providers) — forma traži 8 (`minlength`), ali to je pravilo **preglednika**; serverski minimum je zadanih 6. ⚠️ Polje „Password Requirements" **ne dirati** (server bi bio stroži od sučelja), i **prije toga popraviti `WeakPasswordError`** u `js/auth.js:343`.
  ⚠️ **`auth_leaked_password_protection` NIJE stavka za ruku — to je Pro značajka** (org je `free`), a premisa „jedan prekidač" bila je kriva 11 dana. **Rješava se BESPLATNO u našem kodu**: HIBP ima javni API bez ključa (`api.pwnedpasswords.com/range/<prvih 5 SHA-1>`, k-anonimnost — lozinka ne napušta preglednik), ~30 redaka. Naša izvedba je klijentska, dakle slabija od serverske, ali daje ~90 % vrijednosti za 0 €. Detalji + susjedne stavke: `BACKLOG.md`.
  **🧭 Self-host Supabase je ODLUČEN, ali TEK POSLIJE frontenda** (Leon, 2026-08-21) — open source, ~5 €/mj VPS, **isti kod i shema** (jedina opcija bez rewritea), usput gasi i uspavljivanje baze; cijena = postajemo sami sebi DBA. Kad dođe red → ADR. Brojke koje mjere cijenu seobe: `BACKLOG.md`.
  **✅ Treća je IZVRŠENA 2026-08-21:** Leon je pokrenuo `node scripts/migrate-content.js macroeconomics`; ćirilično `С` (U+0421) u `goodsMarket.flashcards[5].answer` zamijenjeno latiničnim. Poslije: `diff:db macroeconomics` **3/3 identično**, `check:final` **16/16**. Bez commita i bez bumpa — poravnata je **baza**, datoteke su bile ispravne (baza im je zrcalo).
- **Sitni dug (ne blokira):** siročad u Storageu · advisor-WARN `snapshot_content_version`/`handle_new_user` (trigger-funkcije; revoke ih ne dira) · staging poravnati s `supabase/f1-nodes.sql`. ⚠️ **`is_admin()` se NE smije revokeati `authenticated`-u** — zovu ga RLS politike kao pozivatelj → slomio bi admin-upis. Advisori PROD: **0 ERROR, 16 WARN.**
- **Napomene:** Supabase free-tier **spava ~7 dana** neaktivnosti (keep-alive cron to gasi; app tad fallbacka na datoteke, login/sync ne rade) · `content_versions`/`node_content_versions` = **append-only audit**, brisanje **samo uz izričit OK** · PWA drži staru ikonu do reinstalacije (nije bug) · `mcp-admin/` = untracked read-only spike [[mcp-admin-spike]].
## Ključne odluke — samo one koje MIJENJAJU današnji rad

> Puni tekst i sve starije: **`docs/records/DECISIONS.md` (ADR-001…028)**.
> Ovdje su ADR-ovi koji su **živa ograničenja**, ne povijesno obrazloženje.

- **ADR-030:** **AI kroz MCP je GLAVNI put stvaranja; editor je DORADA, ne ishodište** (Leon, 2026-08-13). Editor se time smije **pojednostaviti** — smije izgubiti funkcije, ne dobiti ih. **Tri tvrde posljedice:** ① **MCP prestaje biti spike i postaje proizvod** (danas untracked read-only pokus) — najveći neriješeni komad plana, veći od cijelog frontenda; ② **PRISTUP JE PRVI PROBLEM:** sve visi o JWT-u iz preglednika, a korisnikov AI nema preglednik → treba osobni token/OAuth, i dok to nije presuđeno **ostatak MCP-a nema smisla graditi**; ③ **kontrola kvalitete seli s ekrana u write-put** — strop kartice (200/500) živi u editoru, a AI ga preskače; `js/card-limits.js` je jedna politika i MCP mora biti **treći čitatelj, nikad treća kopija**. Granica se postavlja UNAPRIJED: **samo vlastito gradivo**, nikad katalog/`is_admin()`/`service_role`, **vježbe izvan MCP-a** (ADR-018: podatak, nikad kod).
- **ADR-029:** **UGC je GLAVNI proizvod**, javni katalog (24 predmeta) je **jedan izvor gradiva**, ne srce platforme. „Moji materijali" prestaju biti pododjeljak profila i postaju **ravnopravno odredište** (stranica + ulaz u navigaciji i na landingu). **Ne popušta ništa sigurnosno** — ADR-024/025/018 stoje netaknuti; ovo je odluka o **istaknutosti**. **➕ Dopuna 2026-08-14:** izvorno *„UGC PRIJE kataloga"* ublaženo je u **„ravnopravno, i to u herou"** — doslovna primjena skrivala je jedini dokaz da sadržaja ima. Naslov pokriva oba izvora, dvoja vrata su jednake težine, katalog je prva sekcija kao **dokaz supstance** (ne hijerarhija), vlastito gradivo puna sekcija odmah iza. **Vodi se kao ublažavanje, ne kao ispunjenje.**
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
