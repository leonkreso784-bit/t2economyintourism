# Testing — QA checklista

> Imamo automatske testove (Playwright + unit + validatori) — uz njih ova ručna lista.
> Prođi relevantni dio prije svakog deploya. Nađeš li bug → upiši ga u [BUGS.md](../records/BUGS.md).

## Automatske provjere (uvijek prvo)

> **Ovaj dokument NIJE inventar testova, i namjerno je prestao to biti (2026-08-25).**
> Do tada je nabrajao spec-datoteke rukom, i mjerenje je pokazalo kako to završi: **od 53
> datoteke `tests/**/*.spec.js` bilo ih je imenovano 35**, a i sam broj u upozorenju („46") bio
> je zastario. Provjereno je i **što bi se skraćivanjem izgubilo: ništa** — **52 od 53 speca
> nosi vlastito zaglavlje** s poviješću i metodom, a od 51 pojma koji je dokument imao „viška"
> nijedan nije postojao samo ovdje.
>
> **Autoritativan popis testova je `tests/` sam:** `npx playwright test --list`.
> **Zašto neka tvrdnja postoji piše u zaglavlju svog speca** (ili njegova mjerača u
> `tests/helpers/`), gdje stoji uz kod koji je provodi i ne može ostarjeti odvojeno od njega
> (ADR-027). Ovdje ostaje ono što je **operativno**: koje naredbe vrtjeti, čime su uvjetovane,
> i što smije dirati koju bazu.
>
> ⚠️ **Broj testova se NE prepisuje u prozu.** Ovdje je stajalo *„ukupno `test:authed` = 89"* i
> *„21 predmet = 17 EN + 4 HR"* — oboje je ostarilo tiho. Brojeve zna runner, predmete
> `npm run verify`.

### Brze brane — `npm run preflight` ih vrti sve odjednom

- [ ] `npm run verify` → integritet catalog-a (mapiranje, datoteke, window-izvoz, **+ BUG-012 čuvar: predmet s vježbama MORA imati `content.codeScripts`**).
- [ ] `npm run validate:content [id]` → shema sadržaja + quiz indeks + KaTeX currency-safety. Zaštitar generatora.
- [ ] `npm run validate:schema [id]` → strukturni JSON Schema ugovor (`schema/subject-content.schema.json`, ajv).
- [ ] `npm run export:json -- --check` → `data/json/**` u sinku s izvornim `.js`. **⚠️ Nakon izmjene `data/*.js` migriranog predmeta obavezan re-export**, inače pada i CI.
- [ ] `npm run test:unit` → graderi engine-a vježbi + `app-state` + `blocks-renderer` (escape-granica).
- [ ] `npm run bump:check` → svi `?v=` tokeni + `CONTENT_VERSION` identični (drift = ručni bump podskupa → BUG-004, ADR-017). Popravak: `npm run bump`.
- [ ] `npm run build:css -- --check` → `styles.bundle.css` i `css/tokens.static.css` u sinku s manifestom `css/app.css`.
- [ ] `npm run check:tailwind` · `check:cdn` · `check:palette` · `check:safearea` · `check:budget` · `check:seo` · `check:contrast` · `check:docs` · `check:state` · `check:lockfile` → **što svaka tvrdi, piše u `CLAUDE.md` §Komande; ZAŠTO postoji, u zaglavlju svoje skripte.**
- [ ] `npm run typecheck` → `tsc --checkJs`, bez builda (scope u `tsconfig.json` raste modul po modul).

### Sporije brane — traže preglednik, mrežu ili prijavu

- [ ] `npm run test:responsive` → Playwright, default (odjavljena) suita na iPhone profilima.
- [ ] `npm run test:authed` → pozitivan admin-put (v. odjeljak niže).
- [ ] `npm run css:diff` → dokaz da se **prikaz** nije promijenio; uz svaku ciglu koja dira CSS.
      ⚠️ **Mjeri samo promjene u CSS-u** — presreće stylesheet, a HTML uzima iz radnog stabla. Premjesti li cigla vrijednost **iz markupa u CSS**, referenca je stranica koja **nikad nije postojala**, pa prijavljuje razlike i ondje gdje se ništa nije promijenilo. Tada se dokazuje **pravim A/B-om**: `HEAD` poslužen iz zasebnog `git worktree`-a na drugom portu, obje verzije sa **svojim** markupom i **svojim** CSS-om.
- [ ] `npm run test:rls` → anon čita `subject_content`, **ne vidi** `progress`. Pad = curenje; SKIP na uspavanu bazu.
- [ ] `npm run test:storage` → bucket `node-images` kroz pravi HTTP Storage API. **WRITE → TVRDO odbija prod.**
- [ ] `npm run test:delete-account` → Edge Function `delete-account`. **HARD-DELETE → TVRDO odbija prod.**

### Što suita čuva — po skupinama, ne po datotekama

> Imena u zagradi su **ulazne točke za čitanje**, ne popis. Cijeli popis: `npx playwright test --list`.

| skupina | što čuva | ući kroz |
|---|---|---|
| **sadržaj i katalog** | sve sekcije svih predmeta se renderiraju, podaci teku kroz catalog, 0 JS grešaka, lijeno učitavanje stvarno je lijeno | `smoke` · `browse` · `lazy-load` · `dual-read` |
| **tijekovi učenja** | flashcards/quiz/fill/learn kroz **prave klikove**, napredak, povratak na zadnju poziciju | `app-state` · `quiz-reset` · `restore-position` · `learn-parity` |
| **geometrija i telefon** | nijedna kontrola nije odrezana, prekrivena ni preklopljena; **telefon kao STRANICA** (osnovica u `tests/phone-baseline.json`, danas prazna) | `phone` (+`.authed`) · `reachability` (+`.authed`) · `layout-guard` · `layout.authed` |
| **izgled po temama** | kontrast i tinta kroz sve 4 teme, uklj. boje koje dolaze iz **podatka**, ne iz CSS-a | `tint-ink` · `a11y` (+`.authed`) |
| **sigurnost prikaza** | svaki tekst iz podataka ide kroz `esc`; `:hover`/`:disabled` se ne tuku s kaskadom | `escaping` · `cascade.authed` |
| **adrese i vraćanje** | devet stranica ima devet dijeljivih adresa; „natrag" ima **jedan** model; kartica lekcije je prava kontrola | `routes` · `back-model` · `lesson-card` · `materials-entry` |
| **auth, admin, RLS** | odjavljeni put ne vidi ništa admina; prijavljeni put stvarno piše i stvarno je odbijen gdje treba | `auth` · `admin` · `admin-detect.authed` · `publish-rpc.authed` |
| **autorstvo (UGC + Studio)** | graditelj materijala, blok-editor, media, slike pod vlasničkim prefiksom, stropovi kartica | `my-materials.authed` · `studio.authed` · `node-images.authed` · `card-limits.authed` |
| **platforma** | Service Worker (offline shell + update-flow), monitoring iza privole, UI-primitivi, i18n, pravne stranice | `sw` · `monitoring` · `components` · `i18n` · `legal` |

⚠️ **`sw.spec.js` je izoliran:** app-testovi imaju `serviceWorkers: 'block'` (u `playwright.config.js`), inače SW presreće `page.route` i lomi npr. dual-read. Dva speca imaju `test.use({ serviceWorkers: 'allow' })`: **`sw.spec.js`** (ljuska) i — od cigle P3
— **`offline-study.spec.js`** (sadržaj skinutog predmeta). Dodaješ li treći, pravilo je isto:
`allow` samo ondje gdje se SW **mjeri**, jer inače presreće `page.route` i lomi npr. dual-read.
⚠️ **Konvencija privole:** specovi koji klikaju donje kontrole pred-postavljaju `localStorage['sokrat-cookie-consent'] = 'denied'` — inače fiksna cookie-traka presreće klik (isti kvar koji je T4 mjerio kao ⑧).
⚠️ **Gdje editor živi zna JEDNO mjesto:** `tests/helpers/studio-entry.js`. Do T6 je isti ulaz bio prepisan **sedamnaest puta**. *Ovisnost nije samo „tko spominje" nego i „tko čeka"* — dva speca stranicu ne spominju, ali čekaju njezine globale, pa ne padnu nego **vise**.

(Prvi put: `npm install` + `npx playwright install chromium`.)

## Authenticated (admin) suite — POZITIVAN admin-put (`npm run test:authed`)

> Rješava dugogodišnju rupu: Playwright se **može prijaviti** na Supabase (storageState). Pokriva
> put koji je pustio `window.SokratAuth` bug (BUG-018) — stari testovi provjeravali su samo
> `isAdmin === false`. [[live-login-verifies-crud]]

- **Kako se uključuje:** `playwright.config.js` dodaje projekte `auth-setup` + `authenticated`
  **samo kad su `TEST_ADMIN_EMAIL`/`TEST_ADMIN_PASSWORD` postavljeni** (lokalno `.env` → dotenv,
  CI → secrets). Bez njih default suita ostaje **nepromijenjena i deterministička**.
- **`auth.setup.js`** je dependency cijelog projekta: prijava kroz `SokratAuth`, provjera
  `is_admin()`, sesija u `tests/.auth/admin.json` (gitignored).
  ⚠️ **Prijava zna pasti iz utrke i to NIJE naš kod** — dva lica su opisana u zaglavlju te
  datoteke; drugo (`is_admin() = false` uz **prazan** `rpcError`) obori **cijeli** `authenticated`
  projekt, pa jedan promašaj izgleda kao stotinu padova.
- **🏗️ STAGING je uvjet, ne udobnost:** `sokrat-staging` (ref `czljmvigkgiajzjxtndq`) = izolirani
  test-DB. Kad su `STAGING_*` u `.env`, write-testovi gađaju njega. Seed: `node scripts/seed-staging.js`
  (idempotentan, tvrdi guard — odbija ne-staging URL).
  ⚠️ **Protiv PROD baze WRITE-testovi mijenjaju živi sadržaj i ostavljaju `content_versions`
  audit-redove** (append-only, admin ih ne može obrisati) → pravilo #8: protiv PROD-a samo
  edit-pa-revert.
- **Setup računa:** dediciran **test-admin account (NE osobni)** → napravi kroz app +
  `profiles.role='admin'` → creds u `.env`.


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


## ⚠️ ZELENO LOKALNO NIJE ZELENO (2026-08-24)

> Preseljeno iz `CLAUDE.md` 2026-08-25 (cigla B skraćivanja): ovo je **pravilo o testiranju**,
> pa mu je mjesto ovdje, a ne u datoteci koja se učitava svaku sesiju.

**Windows i Linux ne crtaju isti font istom širinom (~4 px)** — i to je dovoljno da **brana
promijeni ishod bez ijedne promjene u proizvodu**.

U jednom pushu je to naplaćeno **tri puta**:

1. **Marker landinga** se lomio preko dva retka. T5 je `nowrap` odbacio **bez mjerenja**; sonda
   je poslije pokazala da fraza troši **58 % stupca** i da prelijevanja nema do **1,9×**.
2. **Phone-osnovica** je **poznat nalaz brojala kao nov**, jer joj je izmjerena brojka bila
   **u imenu kante**.
3. **Landing je na 320 px prolazio sa zalihom od 21 px = 3,7 % ekrana.**
   *Tvrdnja koja prolazi s 3,7 % rezerve ne mjeri ispravnost nego sreću.*

**Iz toga dvije trajne obveze:**

- **CI je jedini sudac za mjere ovisne o crtaču** (širine, prelomi, odrezanost). Zeleno na
  Windowsu nije dokaz.
- **Nova tvrdnja o rasporedu traži sondu sa širim slovima** prije nego se proglasi gotovom —
  inače mjeri font razvojnog stroja, ne pravilo.

**Kako se čitaju padovi u CI-ju.** Playwright ondje vrti `github` reporter (uključen samo uz
`process.env.CI`), pa padovi izlaze kao **anotacije**. Bez toga se ime palog testa dobiva samo
iz artefakta od **87 MB** koji traži prijavu — a svaki pokušaj košta rundu od **~18 min**.
⚠️ **GitHubov javni API ima 60 zahtjeva/h** — ne provjeravati CI u petlji, inače ostaneš bez
očitanja baš kad ti treba.

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
