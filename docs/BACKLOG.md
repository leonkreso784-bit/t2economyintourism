# Backlog — parkiralište ideja

> Ovdje skupljamo ideje da se ne izgube. Nije obaveza — kad ideja sazri, seli se u
> [ROADMAP.md](ROADMAP.md) kao milestone/korak. Prioritet: 🔥 visok · ➖ srednji · 💤 nekad.

## 🔥 Brisanje računa — self-service „Obriši račun" (GDPR pravo na zaborav) — 2026-07-04
**Nalaz (korisnik, 2026-07-04):** app NEMA self-service brisanje računa. Postoji samo (a) „Delete cloud data" gumb
(`js/profile.js:deleteCloudData` — briše `progress` retke preko anon+RLS, odjavi) i (b) tekst „za brisanje računa
pošalji mail". To je nedovoljno za live proizvod s EU korisnicima (GA/Sentry aktivni). **Ne radi se sad** (korisnikova
odluka), ali je prava planirana stavka.
**Odlučeni put:** **Supabase Edge Function** (ADR-016 — `service_role` NIKAD u Vercel; pravilo: privilegirano → Edge Function).
**Dizajn-skica (kad uđemo u to):**
1. **Edge Function `delete-account`** (Deno, na Supabaseu). `service_role` iz Supabase secrets (`supabase secrets set`), nikad u gitu/frontendu.
2. **Verifikacija identiteta u funkciji:** iz `Authorization: Bearer <JWT>` (šalje `supabase.functions.invoke`) → klijent s tim JWT-om → `auth.getUser()` → **provjeren** `user.id`. **NIKAD ne vjeruj `user_id` iz body-ja** (eskalacija privilegija).
3. **Kaskadno brisanje:** prvo `progress` (i buduće UGC tablice) za taj `user.id`, pa `auth.admin.deleteUser(user.id)`. Redoslijed: podaci → auth (orphan-safe). Razmotriti DB `ON DELETE CASCADE` na FK prema `auth.users`.
4. **Frontend (`js/profile.js`):** „Delete account" (danger) gumb → dvostruka potvrda (upiši email ili „DELETE") → `functions.invoke('delete-account')` → uspjeh: lokalni `signOut` + očisti localStorage napredak + toast + redirect na landing.
5. **GDPR tekst:** `privacy.html` — opisati self-service brisanje (što se briše, nepovratno). Odlučiti o mail-fallbacku.
6. **Soft- vs hard-delete:** MVP = **hard-delete** (doslovno „pravo na zaborav"); soft-delete (grace period) tek ako zatreba.
7. **Test:** RLS-test proširiti (ne-vlasnik ne briše tuđe); ručni E2E na test-računu. ⚠️ Ne u iPhone-touch Playwright matrici (pravi auth se preskače) → ručno + scratch.
**⚠️ Provjeriti pri gradnji:** ima li Supabase do tada **nativni „delete self" RPC** (tada ni Edge Function ne treba `service_role`).
**Gdje pripada:** uz **F4** (prvi backend-privilegij + `/api`/Edge šav) ili kao zaseban „compliance" zadatak koji možda vrijedi gurnuti ranije (live je s pravim korisnicima). [[foundation-pivot]]

## ➖ Supabase Auth — rate-limiting / brute-force zaštita prijava — 2026-07-10
**Nalaz (korisnik, 2026-07-10):** spriječiti da netko udara login endpoint (npr. 10.000 pokušaja prijave).
**Put (dashboard-only, bez koda):** Supabase Auth (GoTrue) ima ugrađene rate-limite → **Auth → Rate Limits** (po IP-u/satu za login/signup/reset/token-refresh) — provjeriti i pojačati po potrebi. Opcionalno **Bot/CAPTCHA zaštita** (hCaptcha/Turnstile) u Auth settings za signup/login. Primijeniti na **PROD i staging**.
**Kad:** ne sad (nema napada, baza mala); planirano prije šireg rasta / uz **F6 sigurnost** (CSP/DOMPurify/UGC). Sitno, brzo — čim bude prometa vrijedno uključiti.
**+ Leaked Password Protection (advisor-nalaz, 2026-07-12):** Supabase Auth provjera lozinki protiv HaveIBeenPwned je ISKLJUČENA (WARN na oba projekta) → uključiti u istom dashboard-prolazu (Auth → Password security), PROD i staging.

## 🧱 Hardening v1 + perf (2026-06-29) — sad u [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) Faza 1/3
Nalazi iz `archive/SONNET_REVIEW_2026-06.md` (vanjski review; **provjereni protiv koda** — #7 display=swap je bio NETOČAN, već postoji).
Tretiraj `archive/SONNET_REVIEW_2026-06.md` kao prijedloge za provjeru, ne istinu. Konkretne stavke (Faza 1C / 3 u FOUNDATION_PLAN):
> **✅ STATUS: F1 1C stavke ISPORUČENE + LIVE (2026-06-30):** sigurnosni headeri, „Works offline"→„No install needed", `loadProgress` schema-merge (u `storage.js`, ne analytics), „400+"→dinamičan (`compute-stats.js`), mrtav `lessonCategoryMap`→`{}`. Preostaju 💤 (CSP/DOMPurify/CSS-bundling/PWA-ikona/SW = Faza 3/6).
- 🔥 **Sigurnosni headeri** (`vercel.json`): makni deprecated `X-XSS-Protection`; dodaj `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- ✅ **„Works offline" copy** — RIJEŠENO + ✅ **DEPLOYANO NA PRODUKCIJU 2026-07-05** (F3 3A, main `868dc9f`): Service Worker (`sw.js` offline app-shell) + 3A.3 update-flow (Fable, ADR-019) → copy „Works offline"/„Radi offline" LIVE.
- ➖ **`loadProgress` schema-merge** (`js/analytics.js`): `{ ...defaultProgress, ...JSON.parse(saved) }` — otpornost na pokvaren/stari localStorage.
- ➖ **„400+" dinamički** (`index.html` ×3): izračun `questionCount` iz kataloga (kao `subjectCount`).
- ➖ **Mrtav `lessonCategoryMap` entry** (`js/config.js`) — vidi nalaz 2026-06-18 niže (PAZI: objekt JE referenciran u `navigation.js:545`).
- 💤 **CSP** + **DOMPurify** — tek uz UGC (Faza 6), ne prije (sadržaj autorski/trustiran).
- ✅ **CSS bundling** (26 `@import` → 1 `styles.bundle.css`, `build-css.js`) + **auto version-bump** (`bump-version.js`) — ISPORUČENO (F3 3B/3C.1, 2026-07-05, grana `foundation/f3`). ⬜ Ostaje 3C.2 (auto-bump na Vercel deploy-u).
- 💤 **PWA maskable ikona** — odvojena ikona sa safe-zone paddingom (sonnet #15).

### „Brutalan bar" — 5 nadogradnji (2026-06-29, korisnik: „ne zdrav nego jeben i brutalan"; FOUNDATION_PLAN §7)
Iznad „zdravog" temelja — ono što ga čini elitnim. Sve u postojeće faze, trošak alata 0 €:
- 🔥 **TVRDI CI gateovi (#1)** — Lighthouse budžeti (Perf≥0.95/A11y≥0.95/LCP≤2s/JS≤~200KB) + axe-core (0 serious) + Playwright `toHaveScreenshot` baseline. **Blokada, ne upozorenje.** [F1 1D, pojačano F3]. BUG-015 bi ovo ulovilo.
  - ✅ **axe a11y gate** (`tests/a11y.spec.js`) — GOTOVO 1D.2 (popravljen 1 serious: sidebar tabindex).
  - ✅ **layout-regression guard** (`tests/layout-guard.spec.js`, deterministička geometrija, 13 širina × 2 jezika) — GOTOVO 1D.3, hvata BUG-015 klasu, platform-neovisno.
  - ⬜ **Pixel `toHaveScreenshot`** — ODGOĐEN: baseline ovisi o platformi (Win lokalno ≠ Linux CI), nema Dockera/CI-token pristupa za Linux-baseline ovu sesiju. Plan kad bude moguće: (a) Playwright Docker image lokalno, ILI (b) `workflow_dispatch` job `--update-snapshots` koji commita `-linux` baseline (GITHUB_TOKEN write). Determinističke provjere (a11y+layout-guard+postojeći overflow sweep) dotad pokrivaju regresije.
- ✅ **Sentry + release-tracking (#2)** — GOTOVO + LIVE (2026-07-01, F2 2E): `js/monitoring.js`→`window.SokratMonitor`, consent-gated, Loader EU/DE, samo hvatanje grešaka (Tracing/Replay/Logs off), `sendDefaultPii:false`, release `sokrat-study@…`; uživo verificiran. ⬜ opc.: mail-alert prag na dashboardu.
- ✅ **RLS test (#3)** — GOTOVO 1E: `scripts/rls-check.js` read-only protiv POSTOJEĆE baze (besplatno). ⬜ **Ephemeral Supabase branch** (izolirani test + migracije na branchu) ODGOĐEN: **traži Pro plan $25/mj** (provjereno; org je free, branch compute $0.01344/h tek nakon Pro) → kad/ako Pro.
- 💤 **CRUD versioning + audit-log + dry-run diff (#4)** — undo/povijest/kočnica za source-of-truth flip. [F4 4E].
- 💤 **SRS dizajn-dok PRIJE koda + FSRS (#5)** — `docs/SRS_PLAN.md`; 2024+ algoritam, ne nabacani SM-2. [F5 5.0].

## ➖ Accounting → JSON format migracija (F2 2A ostatak; 2026-07-02)
Jedini predmet koji NIJE na JSON dual-readu (17/18 migrirano, LIVE). **Svjesno odgođen** — korisnik zasićen
računovodstvom (pravilo: ne dirati Accounting osim izričito). Postupak kad dođe red (čisto mehanički, ~5 min):
`npm run export:json accounting` → u `data/catalog.js` accountingu dodaj `dataFormat: 'json'` (iza `resolve`,
PRIJE `codeScripts`) → bump `catalog.js?v=` u index.html → gate (verify/validate:schema/export-check/Playwright).
Vježbe (41, `data/accounting/exercises.js`) ostaju `.js` — codeScripts već postavljen (BUG-012).

## ➖ Code-review nalazi (2026-06-18) — čišćenje, ništa kritično
Pregled cijelog koda (korisnik tražio): stanje vrlo dobro, bez bugova. Sitni dug za počistiti kad zgodno:
- ➖ **Mrtav `lessonCategoryMap`** (`js/config.js`): referencira `entrepreneurship` lekcije `second-exam-prep`/`final-exam-prep`
  koje više ne postoje (catalog je na `first-midterm`/`second-midterm`/`final`). Bezopasno — `js/navigation.js` pada na „sve kategorije".
  **Akcija:** obrisati entry (par redaka) ili cijeli `lessonCategoryMap` ako ga ništa drugo ne koristi.
- 💤 **`resolveExercise` robustnost** (`js/exercises.js:~489`): ako randomizirani `generate()` baci, vraća bazni `ex` (bez `fields`) →
  vježba bi se prikazala prazna. Idealno: sakriti/označiti. Trenutno netriggerirano (naši `generate` su čista aritmetika).
- 💤 **Stari root `data-*.js`** (12 sem-2 datoteka) nisu lazy-splitani po lekcijama kao noviji predmeti — namjerno (ADR-006), migracija u Bloku B.
- 💤 **cloud-sync „broj→max"** (`js/cloud-sync.js:60`) pretpostavlja monotone brojače; ispravno za sad, ali pažnja pri budućim ne-monotonim numeričkim poljima.

## ✅ GOTOVO (2026-06-13) — Auth prelazak na email+lozinku
**Implementirano po dogovoru od 2026-06-12** (detalji: `docs/PROGRESS.md` 2026-06-13 + `docs/BACKEND.md` §Staza B):
email+lozinka (signUp/signInWithPassword), email potvrda obavezna, magic-link UKLONJEN, ime pri registraciji
(`display_name`, na profilu i nav gumbu), Forgot/Change password, pravne stranice ažurirane. Baza nepromijenjena.
**Ručni korak korisnika:** Supabase dashboard → Auth → Providers → Email → min duljina lozinke 8.
**✅ LIVE — deployano 2026-06-13 (`ca06158..51e4e7b`, uz izričito odobrenje korisnika); deploy gate ispunjen.**

**Ostaje za kasnije:**
- **Google login** (uz lozinku; treba korisnikov OAuth client u Google Cloud Consoleu).
- **Onboarding anketa pri ulasku u sustav** — korisnikova ideja (2026-06-12); veže se na budući backend za izradu
  sadržaja iz PDF prezentacija (admin/ingest alati).

## ✅ ZAVRŠENO — Sadržaj 2. god (sem 1): restruktura na K1 / K2 / finalni → CIJELA 2. GODINA 8/8
**Status (2026-06-13):** semestar 2 = **4/4 KOMPLETNO**, semestar 1 = **4/4 KOMPLETNO** → **2. godina HM = 8/8 predmeta.**
**Accounting ✅** (3 lekcije + reusable Exercises sustav, 41 vježba; `docs/content/EXERCISES_ENGINE.md`), **Tourism Economics `te2` ✅**
(restrukturiran + rebuild iz PDF-ova, LIVE), **E-Business ✅** (split + obogaćivanje iz 14 PDF-ova; finalni 15 kat/152 fc; **LIVE `51e4e7b`**),
**Entrepreneurship ✅** (2026-06-13: split + 4 nove kategorije + obogaćivanje iz 11 PDF predavanja; finalni **15 kat / 175 fc / 134 quiz /
80 fill** — najveći predmet; **LIVE `8a37404`**). **▶ Dalje = 1. GODINA** (vidi [[content-roadmap-sequencing]]).
**⚠️ Korisnik je ZASIĆEN računovodstvom (2026-06-12) — ne vraćati se na Accounting (ni Final-tab ni USAR/USALI klasifikaciju) osim izričito.**

**Obrazac (kao Marketing/Geo/F&N):** po predmetu — utvrditi K1/K2 granicu iz silabusa/materijala → sadržaj podijeliti
na `first-midterm` (K1) + `second-midterm` (K2) → **finalni = hibrid** `Object.assign({}, K1, K2, { examPractice })`
(učitava se ZADNJI). Catalog: 3 lekcije + 3 scripta + `resolve`. Bump `CONTENT_VERSION` + `catalog.js`/`content-loader.js`
`?v=`. Verify + strukturni validator + Playwright (+ ciljani render testovi K2/finalni). **Treba: izvorni materijali +
silabus po predmetu.** (Napomena: ADR-006 „ne preslagivati stare root-predmete do Bloka B" — ova odluka to nadjačava
za sadržajno upotpunjavanje; migracija u bazu i dalje ide JEDNOM u Bloku B.)

| Predmet | sem | Trenutno (lekcije → podaci, kategorija/flashcards) | Što treba |
|---|---|---|---|
| ~~**Tourism Economics** (`te2`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** `first-midterm`/`second-midterm`/`final` (`data/te2/`, te2M1/te2M2/te2Final); finalni **11 kat / 135 fc / 94 quiz / 66 fill** | ✅ Restrukturirano + **REBUILD iz 10 PDF predavanja** (2026-06-12): K1=Units 1–6 (5 kat, +nova `forecasting`), K2=Units 7–12 (5 kat) + `examPractice`. Ispravljena činjenica (price = najkritičnija). ✅ LIVE (`ca06158`) |
| ~~**Entrepreneurship** (`entrepreneurship`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`entrepreneurshipM1`/`entrepreneurshipM2`/`entrepreneurshipFinal`, `data/entrepreneurship/`); finalni **15 kat / 175 fc / 134 quiz / 80 fill** | ✅ Split (stari točan ali tanak) + **4 nove kat.** (creativity W3, financing W5, franchising W6, developing W13) + obogaćen iz 11 PDF-ova (2026-06-13). K1=Weeks 2–7, K2=Weeks 9–13. **LIVE 2026-06-13 (`8a37404`)** |
| ~~**Accounting** (`accounting`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`accountingM1`/`accountingM2`/`accountingFinal`) + **41 interaktivna vježba** (`data/accounting/exercises.js`) | ✅ Restrukturirano + Exercises sustav (2026-06-12, LIVE `a6b6fb0`). Opcionalno: Final exercises-tab, USAR/USALI klasifikacija (treba answer-key) |
| ~~**E-Business** (`ebusiness`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`ebusinessM1`/`ebusinessM2`/`ebusinessFinal`, `data/ebusiness/`); finalni **15 kat / 152 fc / 124 quiz / 75 fill** | ✅ Split (stari sadržaj VJERAN predavanjima — iznimka od te2-pouke) + obogaćen iz 14 PDF-ova (+23 fc; SEO 3→4 fix). K1=Units 1–7, K2=Units 8–15. **LIVE 2026-06-13 (`51e4e7b`)** |

**⚠️ Pouka iz te2 (2026-06-12):** puki **SPLIT postojećeg** tankog sadržaja daje premalo (te2 split = 72 fc → korisnik
javio da je premalo i staro). Zato je te2 **rebuildan IZ PROFESORSKIH PREDAVANJA** (10 PDF-ova → 135 fc, + ispravljena
činjenična greška u starom sadržaju). **Za Entrepreneurship/E-Business isto: raditi iz materijala, ne preslagivati stari
tanki blok.** Stoga **OBA trebaju izvorne PDF-ove/silabus od korisnika** (folderi su trenutno prazni) prije početka.

## 🧭 Strateški smjerovi (korisnik, 2026-06-24) — veće mogućnosti, timing TBD
- 🔥 **Priprema za MATURU** — novi proizvodni smjer: srednjoškolci, priprema za maturu (širenje izvan fakulteta). Dolazi nakon admin CRUD + AI tutor.
- 🔥 **Novi program „Menadžment u ugostiteljstvu" (HRV)** — vrlo vjerojatno **prijevod cijelog Hospitality Managementa na hrvatski**. Catalog već podržava više programa (ADR-002/003) → novi `program` + prevedeni `data/*`. **Aktivira potrebu za i18n (HR/EN).**
- ➖ **3. godina HM** — doći će, timing neodlučen.
- ➖ **Studentski UGC za 3./4. godinu** — studenti uploadaju sadržaj i grade više godine (HM i/ili Menadžment u ugostiteljstvu); jezik (HR/EN) neodlučen. Veže se na Fazu 1–2 (upload→AI→pregled→dijeljenje) + moderacija/autorska prava ([VISION.md](VISION.md) §4 gating-odluke).
- ~~**Prioritet nakon sadržaja (korisnik):** (1) Admin CRUD → (2) AI tutor → (3) Matura prep.~~ **⚠️ NADGLAŠENO 2026-08-02 (Leon).** Admin CRUD = ✅ gotov; **matura IZBAČENA iz build-plana** (ostaje samo kao tržišna hipoteza u [MONETIZATION.md](MONETIZATION.md), ne kao posao). Aktualni redoslijed: **osobni UGC-graditelj ([CREATE_BACKEND_SPEC.md](CREATE_BACKEND_SPEC.md) F0–F5) → frontend redizajn → objava/dijeljenje + MCP.** [[follow-recorded-plan-dont-reopen]]

## Monetizacija (Faza 4 — tek na skali)
- 🔥 Freemium pretplata (~2–3 €/mj): neograničeni kvizovi, exam mode, bez reklama, analitika.
- 🔥 AI tutor kao premium ("objasni mi / ispitaj me") — koristi isti Claude pipeline.
- ➖ Lokalno sponzorstvo (kafići, student housing) — bolji prinos od ads na maloj skali.
- ➖ Affiliate (udžbenici, online tečajevi).
- 💤 White-label za druge fakultete/udruge (najveći dugoročni potencijal).
- 💤 Donacije / "Buy me a coffee".
- ⚠️ Naplaćivati FUNKCIONALNOST, ne sadržaj (autorska prava na profesorske materijale).

## Funkcionalnosti — učenje
- ➖ Spaced repetition za flashcards (pamti što ne znaš, vraća češće).
- ➖ "Exam mode" — vremenski ograničen, miješane kategorije, ocjena na kraju.
- ➖ Izvoz skripte u PDF.
- 💤 Audio/TTS čitanje gradiva.

## UGC & društveno (Faza 1–3)
- 🔥 Upload PDF/PPT → AI generira privatnu skriptu (Faza 1).
- 🔥 "Donesi svoj API ključ" za AI generaciju (kontrola troška).
- ➖ Javna biblioteka + pretraga + fork tuđih skripti (Faza 2).
- ➖ Ljestvice po kvizu + profili + statistika učenja (Faza 3).
- ➖ Anti-cheat za natjecanje.
- ➖ Moderacija/prijava UGC sadržaja.

## Tehničko / infra
- ✅ **Automatski testovi — uglavnom GOTOVO:** Playwright (responsive/smoke/…), `npm run test:unit` (graderi vježbi), `npm run validate:content` (shema sadržaja). Ostaje 💤 širi coverage po želji.
- ✅ **Analitika posjeta — GOTOVO (2026-06-13):** Google Analytics GA4 (`G-ME0V58NJ1Z`) uz GDPR cookie-consent
  (Consent Mode v2, učita se tek na pristanak); vidi `js/consent.js`. Time je i **priprema za Google Ads** korak dalje.
- 💤 i18n (hrvatski/engleski prebacivanje).
