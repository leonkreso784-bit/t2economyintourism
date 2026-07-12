# Testing — QA checklista

> Imamo automatske testove (Playwright + unit + validatori) — uz njih ova ručna lista.
> Prođi relevantni dio prije svakog deploya. Nađeš li bug → upiši ga u [BUGS.md](BUGS.md).

## Automatske provjere (uvijek prvo)
- [ ] `npm run verify` → 0 grešaka (mapiranje, datoteke, window-izvoz, **+ BUG-012 čuvar: predmet s vježbama MORA imati `content.codeScripts`**). *(alias: `verify:catalog`)*
- [ ] `npm run validate:content [subjectId]` → 0 grešaka (shema sadržaja + quiz indeks + KaTeX currency-safe). Zaštitar generatora.
- [ ] `npm run validate:schema [subjectId]` → 0 grešaka (STRUKTURNI JSON Schema ugovor `schema/subject-content.schema.json` nad payloadom svake lekcije; ajv, dev-dep). Nadopunjuje `validate:content` (semantiku). *(F2 2A.1)*
- [ ] `npm run export:json -- --check` → 0 problema (generirani `data/json/**` u sinku s izvornim `.js` + round-trip bez gubitka). **⚠️ Nakon izmjene `data/*.js` migriranog predmeta obavezan re-export `npm run export:json <id>`** — inače ovaj gate (i CI) pada. *(F2 2A.2)*
- [ ] `npm run test:unit` → graderi engine-a vježbi (`exercises-core` uklj. `cite`/`gradeCite`, `acc-kernel`, `stat-parse`, `stat-lib`) + **`app-state`** (oblik `window.AppState` namespacea; isti-realm load jer vm cross-realm ruši `deepStrictEqual`). *(F2 2C)*
- [ ] `npm run bump:check` → 0 (svi `?v=` tokeni + `CONTENT_VERSION` IDENTIČNI = jedan broj za cijelu app; drift = netko ručno bumpao podskup → BUG-004). Popravak: **`npm run bump`**. *(F3 3C.1, ADR-017)*
- [ ] `npm run build:css -- --check` → 0 (`styles.bundle.css` u sinku s `css/*.css` + @import redom u `styles.css`; drift = editiran css bez `npm run build:css`). *(F3 3B)*
- [ ] Playwright uključuje **`tests/sw.spec.js`** (Service Worker: registracija/kontrola nakon reloada + **offline app-shell load** iz keša + **update-flow e2e** = pravi waiting-worker → toast → dodir → reload). **App-testovi imaju `serviceWorkers:'block'`** (u `playwright.config.js` `use`) → deterministički, SW ne presreće `page.route`/fetcheve (inače lomi npr. dual-read). SW se testira IZOLIRANO — samo `sw.spec.js` ima `test.use({ serviceWorkers: 'allow' })`. *(F3 3A)*
- [ ] **`tests/blind-map.spec.js`** (F3 3D.1): blind-map WebP karta se STVARNO dekodira (`_blindMapImg.naturalWidth>0`), dim. 1536×1024, `?v=` token prisutan, PNG-fallback se NE okida. *(smoke.spec filtrira resource-greške → ne bi uhvatio pokvarenu sliku.)*
- [ ] `npm run typecheck` → `tsc --checkJs` (bez build-a; scope u `tsconfig.json` raste modul-po-modul). 0 grešaka.
- [ ] `npm run test:rls` → RLS sigurnosni test (read-only, anon): anon čita `subject_content`, NE vidi `progress`. Pad = curenje; SKIP ako je baza uspavana.
- [ ] `npm run test:responsive` → pokreće Playwright (4 iPhone profila):
  - `responsive.spec.js` — Learn sekcija, 0 horizontalnog overflowa (screenshotovi u
    `test-results/learn-shots/`).
  - `smoke.spec.js` — SVE sekcije × svih predmeta (trenutno **18** = 17 EN + HR pilot): renderiranje, protok podataka
    kroz catalog, 0 JS grešaka, 0 overflowa.
  - `katex.spec.js` — KaTeX render (learn/flashcards/quiz/fill) + currency-safety (`$NN` se ne parsira kao matematika).
  - `browse.spec.js` — drill-down navigacija (Fakultet→Smjer→Godina→Predmet) + overflow guard.
  - `landing.spec.js` — landing nav, subjects showcase (= broj predmeta iz catalog-a),
    navigacija CTA-ova, overflow guard.
  - `lazy-load.spec.js` — sadržaj predmeta se NE učita na startu, nego tek na otvaranje (A4).
  - `app-state.spec.js` — **funkcionalni tijekovi kroz `AppState`** (F2 2C): fill (točan/kriv/skip/Progress %),
    quiz (točan/kriv/review/rezultat/retry), flashcards (known/unknown/swap), nav (navigateTo/switchSection/last-position).
    Klikaju KAO KORISNIK (ne samo render) — love klasu bugova koju smoke ne vidi (dokaz: BUG-016); consent `'denied'` unaprijed.
  - `sidebar.spec.js` — legacy sidebar render iz catalog-a.
  - `auth.spec.js` — Sign-in gumb + email+lozinka modal: tabovi Sign in / Create account
    (polja, minlength=8), gumb-oko (type password↔text), Forgot password tok (forma + back),
    otvaranje/zatvaranje, bez overflowa;
    **skip ako je supabase-js CDN nedostupan** (auth se tada tiho gasi — željeno ponašanje).
    + Profile stranica: sign-in prompt za odjavljene, back na landing, NE sprema se u last-position.
    **`beforeEach` pred-postavlja `sokrat-cookie-consent='denied'`** da fiksni cookie-banner (na dnu) ne presreće
    klikove na donje kontrole modala na niskom landscape ekranu (kao posjetitelj koji se vraća).
  - `legal.spec.js` — statične stranice privacy/terms/faq/contact (200, h1, footer nav, mailto,
    bez overflowa) + landing footer linkovi na njih.
  - `admin.spec.js` (F4): `SokratAdmin` postoji + bez sesije `isAdmin()=false`; `.admin-only` skriven za ne-admina;
    **`#admin-page` skriven na landingu (regresija BUG-018 „Admin curi na dno")**; F4.3b viewer — `navigateTo('admin')` renderira picker predmeta→lekcija;
    **F4.3c-1:** edit-gumbi (`.admin-edit-btn`) skriveni ne-adminu, viewer i dalje renderira kartice. *(Ovo su NEGATIVNI/odjavljeni putovi — vrte se u default suiteu.)*

## Authenticated (admin) suite — POZITIVAN admin-put (`npm run test:authed`)
> Rješava dugogodišnju rupu: Playwright se sad MOŽE prijaviti na Supabase (storageState). Pokriva put koji je pustio
> `window.SokratAuth` bug (BUG-018) — stari testovi provjeravali samo `isAdmin===false`. [[live-login-verifies-crud]]
- **Kako radi:** `playwright.config.js` doda projekte `auth-setup` + `authenticated` **SAMO kad su `TEST_ADMIN_EMAIL`/
  `TEST_ADMIN_PASSWORD` postavljeni** (lokalno preko `.env` → `dotenv`; CI preko secrets). Bez njih → default suite NEPROMIJENJEN/deterministički.
- **`auth.setup.js`** (dependency): prijavi se kroz `SokratAuth.getClient().auth.signInWithPassword(env creds)`, provjeri `is_admin()`,
  spremi sesiju u `tests/.auth/admin.json` (gitignored; Supabase persistira u localStorage → storageState ga uhvati).
- **`admin-detect.authed.spec.js`** (reusea storageState; **7 testova, U3 draft-mod**): (1) `isAdmin()=true` + body-klasa;
  (2) „Uredi lekciju" ulazi u draft-mod — edit-gumbi vidljivi TEK u draftu (prije: read-only viewer); (3) **E2E draft-tok**
  (edit kartice → brojač 1 + Objavi enabled → Odbaci → original vraćen + autosave očišćen, 0 writeova); (4–6) quiz/fill/learn
  editori se otvore prefilani (bez spremanja). ⚠️ **Traže SEEDAN staging** (draft-mod povlači payload iz baze):
  `node scripts/seed-staging.js te2` (idempotentan; tvrdi guard — odbija ne-staging URL).
- **Setup:** dediciran **test-admin account (NE osobni)** → napravi kroz app + `profiles.role='admin'` → kopiraj creds u `.env`.
- **🏗️ STAGING (U1, 2026-07-10):** postoji **`sokrat-staging`** (ref `czljmvigkgiajzjxtndq`, 2. free projekt) = izolirani test-DB. Kad su `STAGING_SUPABASE_URL/ANON/TEST_ADMIN_EMAIL/PASSWORD` u `.env`, **`test:authed` + `rls-check` automatski gađaju staging** (`js/auth.js` `_readSupabaseOverride()` preusmjeri app; `SUPABASE_TARGET=staging` za rls-check) → **write-testovi (edit-pa-revert) sad rade na stagingu, prod audit ostaje čist.** Bez `STAGING_*` → staro ponašanje (prod TEST_ADMIN).
  ⚠️ Protiv **PROD** baze WRITE-testovi i dalje mijenjaju živi sadržaj / ostavljaju `content_versions` audit-redove (append-only, admin ih ne može RLS-obrisati) → zato ih vozimo na stagingu; committani `admin-detect.authed.spec.js` je READ/detekcijski (siguran i na prod i na staging).
  - `a11y.spec.js` — **TVRDI gate (F1 1D + F3 3E):** axe-core, **0 serious/critical** na landing/browse/profile + **study SVE sekcije** (learn/flashcards/quiz/fill/progress). *(3E: „study page" prošireno s petljom po sekcijama — prije samo learn, presrano skenirano → flashcards/quiz/fill/progress bili izvan gate-a i kroz njih su prošli critical button-name/select-name na produkciji. Sad zatvoreno.)* Samo iPhone-SE profil (bez 4× šuma).
  - `blind-map.spec.js` — F3 3D.1 blind-map WebP karta se stvarno dekodira (naturalWidth>0, dim 1536×1024, `?v=` token, PNG-fallback se ne okida).
  - `layout-guard.spec.js` — **TVRDI gate (F1 1D):** deterministička geometrija, 13 širina × {EN,HR}, CTA `.nav-cta` nikad odrezan (**BUG-015 zaštita**).
  - `content-repo.spec.js` — **ContentRepository (F2 2B.1):** `SokratContent` metapodaci = catalog + `loadLesson` vraća IDENTIČNU referencu kao stari put (dokaz nula-promjene).
  - `monitoring.spec.js` — **SokratMonitor / Sentry (F2 2E):** API, consent-gate (ne učita prije pristanka), nakon pristanka loader ubačen + `init(release)` + greška proslijeđena, nikad ne baca. Sentry loader **stubban preko `page.route`** (offline-deterministički).
  - `dual-read.spec.js` — **JSON dual-read (F2 2A.3):** predmet s `content.dataFormat:'json'` (pilot `sit`) učita study iz `data/json` a NE iz `.js`; **shadow-ekvivalencija** (JSON-učitan `window.sitM1` === `.js`-učitan, bajt-u-bajt); JSON blokiran → `.js` fallback. **Supabase blokiran** u testu (determinizam — inače bi DB shadowao JSON put). Uključuje i **accounting** (2A dovršena 18/18) i **statistics** (exercise-put: study iz JSON, vježbe iz `.js`).
  - `components.spec.js` — **UI-primitivi / Web Components (F2 2D):** `<sokrat-toast>` (registracija + `showToast()` prikaz/auto-hide) · `<sokrat-modal>` (registracija + a11y + open/close stanje + ESC + backdrop-klik) · learn image-viewer (`#imageModal`) otvara/ESC-zatvara/čisti sliku preko `<sokrat-modal>` · **auth modal (`#authModal`, 2D.2c) je `<sokrat-modal>` — open→`.is-open`+scroll-lock, ESC-zatvara, X-zatvara; skip ako je supabase-js CDN nedostupan (kao `auth.spec.js`).** · **`<sokrat-confirm>` (2D.3): `#confirmDialog` registriran + sadrži unutarnji `<sokrat-modal>` (kompozicija); `window.askConfirm()` otvara → Confirm=true / Cancel=false / ESC=false; `danger` boja gumb.** **NB:** fokus-management NIJE gate-an (touch-profili ne fokusiraju tapom → verificiran ručno/scratch; `aria-modal=true` deklarativni signal). **NB2 (scratch):** `page.evaluate(() => window.askConfirm(...))` VISI (vraća promise koji čeka klik) → ne vraćaj promise ili klikni gumb.
  - (Prvi put: `npm install` + `npx playwright install chromium`.)

## CI/CD — automatski gate (od 2026-06-29, FOUNDATION_PLAN F1)
> Iste provjere gore vrte se **automatski na svaki push/PR** preko GitHub Actions (`.github/workflows/ci.yml`).
- **Lanac (fail-fast):** `npm ci` → `validate:content` → `validate:schema` → `export:json --check` → `verify` → `test:unit` → `typecheck` → `test:rls` → `npx playwright test` (chromium); zasebni `lighthouse` (budžeti) + `authed` job.
- **`authed` job (F4):** pokreće `npm run test:authed` (pozitivan admin-put) **samo ako je secret `TEST_ADMIN_EMAIL`/`TEST_ADMIN_PASSWORD` postavljen** (Settings → Secrets → Actions); inače se čisto preskoči. Odvojen od glavnog gate-a (može pasti ako je free-tier Supabase uspavan → ne blokira merge osim ako ga učiniš required). **Za aktivaciju: dodaj ta dva repo-secreta.**
- **TVRDI gate:** crveno = **ne mergea se u `main`**. Artefakti (screenshotovi/report) se uploadaju samo na pad.
- **Tok rada „grana → preview → prod":**
  1. Radi na grani (ne direktno na `main`). Push grane → **CI se pokrene** + **Vercel napravi preview-deploy** (zaseban URL, NIJE produkcija).
  2. Provjeri: CI zelen + vizualni pregled na preview URL-u.
  3. Tek kad je zeleno i pregledano → merge u `main` (= produkcijski deploy) **uz izričitu potvrdu korisnika**.
- **Lokalno prije pusha** (da CI ne bude crven): pokreni isti lanac ručno (`validate:content` → `verify` → `test:unit` → `npx playwright test`).

## Smoke test (uvijek, ~2 min)
- [ ] Stranica se učita bez greške u konzoli (F12 → Console).
- [ ] Landing → "Start Studying" otvara **drill-down browse** (Fakultet→Smjer→Godina→Predmet).
- [ ] Showcase predmeta na landingu: klik na predmet otvara njegove lekcije.
- [ ] Otvori jedan predmet → lekcija → Home sekcija se prikaže.
- [ ] Prebaci kroz: Learn, Flashcards, Quiz, Fill, Progress — svaka se otvori.

## Po predmetu (nakon izmjene catalog-a / sadržaja)
Za **svaki** pogođeni predmet:
- [ ] Predmet se pojavljuje u sidebaru ( ispravan naziv, ikona, boja).
- [ ] Sve lekcije se prikazuju; "coming soon" lekcije se ponašaju kako treba.
- [ ] **Learn:** sve kategorije prikazane, slike se otvaraju u modalu.
- [ ] **Flashcards:** okreću se, Know/Don't Know broji, navigacija radi.
- [ ] **Quiz:** start radi, opcije se prikažu, točno/netočno se boji, rezultat na kraju.
- [ ] **Fill:** praznina prikazana, provjera odgovora radi, hint radi.
- [ ] **Exercises** (ako `features.exercises`): tab se prikaže, vježbe grupirane po poglavlju, Check ocijeni; za `cite` upišeš citat → točno/netočno + prikaže se točan odgovor.
- [ ] **Progress:** brojevi i trake se ažuriraju nakon aktivnosti.
- [ ] (Geografija) **Blind Map** se prikaže i prima klikove.

## Regresija nakon refaktora (A2–A5)
- [ ] Svi predmeti rade **identično** kao prije refaktora.
- [ ] Napredak spremljen prije refaktora i dalje se učita (storageKey nepromijenjen).
- [ ] Nema novih grešaka u konzoli.

## Performanse (nakon lazy loadinga, A4)
- [ ] Prvo učitavanje ne povlači sve `data-*.js` (provjeri Network tab).
- [ ] Sadržaj predmeta se učita tek na otvaranje, bez vidljivog zastoja.

## Mobitel / responzivnost
- [ ] Testirano na uskom ekranu (DevTools ~375px): donja navigacija radi.
- [ ] Nema horizontalnog scrolla; tekst čitljiv.

## Nakon deploya
- [ ] Otvori live (sokratstudy.com), ponovi Smoke test.
- [ ] Hard refresh (Ctrl+F5) — provjeri da nova verzija fajlova dolazi (cache busting `?v=`).
