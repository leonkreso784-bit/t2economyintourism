# ROADMAP — Milestones

Legenda statusa: ⬜ todo · 🟦 u tijeku · ✅ gotovo

## 🧱 STRATEŠKI ZAOKRET (2026-06-29) — PLATFORMA-FIRST
**Korisnik odlučio:** staviti DODAVANJE SADRŽAJA na pauzu (na koliko god treba) i izgraditi **profesionalan, reliable,
reusable temelj** prije daljnjeg rasta. Cilj: platforma „brutalno napravljena", pripremljena za CRUD/UGC/AI-tutor/monetizaciju.
Sve detaljno (misije, faze, reusable podsistemi, brick-liste, KAKO): **[FOUNDATION_PLAN.md](FOUNDATION_PLAN.md)** +
**ADR-013** (content arhitektura: podatak≠ponašanje + ContentRepository šav) + **ADR-014** (CI/CD-gated, type-check bez build-a,
Web Components, monitoring) u [DECISIONS.md](DECISIONS.md). **Redoslijed faza:** F0 zapis → F1 reliability rails (CI/CD + tsc +
hardening v1) → F2 reusable jezgra (JSON format → ContentRepository → AppState → Web Components → monitoring) → F3 performanse
(Service Worker + bundling) → F4 custom Admin CRUD (source-of-truth flip) → F5 SRS → F6 pred-UGC sigurnost. **Sadržajne stavke
ispod (HRV long-tail, 3. god, prijevodi) su PAUZIRANE dok temelj ne stoji.**
**RAZINA = „brutalna" ne „zdrava" (korisnik 2026-06-29):** +5 nadogradnji (sve u postojeće faze, redoslijed isti; FOUNDATION_PLAN §7):
(1) **perf/a11y/visual TVRDI CI gateovi** (Lighthouse budžeti + axe + screenshot) [F1 1D], (2) **Sentry+release-tracking** [F2 2E],
(3) **RLS+migracije na Supabase branchu** [F1 1E], (4) **CRUD versioning+audit+dry-run** [F4 4E], (5) **SRS dizajn-dok PRIJE koda+FSRS** [F5 5.0].
TVRDI gate = blokada, ne upozorenje; trošak alata 0 €.
**STATUS:** ✅ **F1 GOTOVA + DEPLOYANA** (2026-06-30, `69ce466`; CI/CD + tsc + hardening + TVRDI gateovi + RLS-test; i18n chrome otišao zajedno).
✅ **F2 2B+2E GOTOVI + DEPLOYANI** (2026-07-01, `57f449a`; ContentRepository `SokratContent` šav + Sentry error-monitoring consent-gated/EU/error-only, uživo verificiran).
✅ **F2 2A GOTOVA + DEPLOYANA** (2026-07-02, `661dbc8`; S2 čisti JSON format: **17/18 predmeta na JSON dual-read** [svi osim accountinga — odgođen],
JSON Schema ugovor + exporter + drift-gate + dual-read loader DB→JSON→`.js`; dual-read 16/16, puni Playwright 117/0, nezavisni audit 0 razlika, live verificirano).
✅ **F2 2C GOTOVA + DEPLOYANA (2026-07-03, ff-merge `73f3809..f54048a`; CI zelen; live verificirano 16× token `20260703` + AppState + BUG-016 fix):** **AppState (S3)** — SVI mutable
globali iz config.js (5 grupa: fill/cards/quiz/session/nav) → `window.AppState`, grupa-po-grupa s funkcionalnim testovima (fill/quiz/flashcards/nav
tijekovi klikaju KAO KORISNIK); config.js bez ijednog mutable `let`; 3 `typeof` guarda prepisana. **Usput test ULOVIO + POPRAVLJEN BUG-016**
(landscape flashcard gutao tapove na ✓/✗ — relikt fiksne visine u `responsive/03`/`04`). Gate: puni Playwright **133/0** (subjects=18). Cache `?v=20260703`.
**▶ DALJE: F2 2D Web Components (toast → modal) → F3 performanse (SW na čistom šavu).** [[foundation-pivot]]

## 📍 AŽURNO (2026-06-28) — (PAUZIRANO zbog platforma-first zaokreta gore)
**SADRŽAJ: 2. god HM = 8/8 ✅ LIVE, 1. god HM = 9/9 ✅ LIVE** (Math zadnji). **▶ AKTIVNO: HRV program** „Menadžment u Hotelijerstvu"
(prijevod na hrvatski) — **cigle 1–5c ✅ LIVE** (pilot Business Informatics HR + globalni 🌐 toggle za cijeli glavni tok; vidi §C + [HRV_PLAN.md](HRV_PLAN.md)).
**✅ BUG-013 (flashcard) riješen + LIVE. ✅ Logo redizajn LIVE.** Sljedeće: long-tail i18n (profil/pravne) → prijevod ostalih predmeta.
**1. god (9 LIVE):** Business Informatics, SIT, Management, Microeconomics,
Statistics, Macroeconomics, Academic Writing, **Traffic in Tourism** (`62a4119`).
**✅ Math = 9. (zadnji) 1.god predmet — K1+K2+Final ✅ LIVE (deployano 2026-06-27, `89fd669..31be03f`; commiti `b481be5`+`c49422a`+`4eeccf1`+`31be03f`);**
year1/sem1, KaTeX, 39 vježbi (engine sad renderira KaTeX); K1 learn obogaćen + Gauss-vs-Gauss-Jordan nijansa. **→ 1. GODINA HM 9/9 KOMPLETNA (uz Intro blokiran).**
Intro to Hospitality blokiran (nema PDF-ova). **Generator predmeta** (ADR-010,
`docs/CONTENT_GENERATOR.md`) gotov i robustan (Sonnet API, ~$1–1.5/predmet). **Interaktivne vježbe**: engine sa 7 tipova
(novi `cite` = „napiši citat"). **Blok B read-path** (ADR-011): sadržaj se čita iz Supabasea direktno (anon key + RLS) s
file-fallbackom — AKTIVNO. Detaljan dnevnik: [PROGRESS.md](PROGRESS.md).

## 🧭 DALJE — planovi (korisnik, 2026-06-24)
**A) Dovršiti sadržaj 1. godine (po redu):**
1. ~~**Traffic in Tourism**~~ — ✅ GOTOVO i LIVE (2026-06-25 `62a4119`, plan [TRAFFIC_PLAN.md](TRAFFIC_PLAN.md)).
2. **Math** — ZADNJI 1.-god predmet. ✅ **K1+K2+Final ✅ LIVE (deployano 2026-06-27, `89fd669..31be03f`).** K1 learn obogaćen + Gauss-vs-Gauss-Jordan nijansa + korisnik pregledao formule. **→ 1. GODINA HM 9/9 KOMPLETNA.** Plan [MATH_PLAN.md](MATH_PLAN.md). ✅ Supabase re-sync Math napravljen 2026-06-27 (gradivo u bazi; vježbe iz datoteke).
- ⛔ **Introduction to Hospitality** — korisnik NEMA PDF-ove → blokiran dok ih ne nabavi (preskočiti).

**B) Nakon sadržaja — prioriteti** *(2026-06-29: PREUREĐENO platforma-first zaokretom → vidi [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md)):*
1. **Admin CRUD** — sad **Faza 4** u FOUNDATION_PLAN-u (custom, NA čistom content-sloju S1/S2; source-of-truth flip; ADR-013). Ne radi se dok F1–F2 ne stoje.
2. **AI tutor** — zaseban produkt-trk, neovisan o source-of-truth; bilo kad nakon jezgre (F2). „Donesi svoj ključ" prvo ([VISION.md](VISION.md)).
3. **Priprema za MATURU** — NOVI smjer proizvoda: srednjoškolci (širenje izvan fakulteta).
4. **(NOVO) Spaced Repetition (SRS)** — Faza 5; pravi pamet-algoritam učenja, najveći produkt-WOW, reusable preko svih predmeta.

**C) ▶ SAD AKTUALNO (korisnik 2026-06-27) — novi smjer „Menadžment u Hotelijerstvu" (HRV) + flashcard bug + logo + monetizacija:**
- **Logo ✅ LIVE (deployano 2026-06-28, `19f07db`):** `logo.png` (raster + crop-hak) **vektoriziran → `assets/logo.svg`**
  (indigo medaljon `#6366f1→#818cf8`, bijelo lice, čist prsten). Crop-hak maknut, favikoni regenerirani, glava ispunjava cijeli krug (auto-fit), stari logo obrisan, cache `20260693`.
  Gate: verify 0/0, Playwright 68/68. Detalji: `docs/PROGRESS.md` + `CLAUDE.md` §Ključne odluke.
- **Monetizacija (NOVO):** plan/scenariji u [MONETIZATION.md](MONETIZATION.md) (Stripe+NKD djelatnosti, matura tržište, modeli, ideje; F6 „tvoj ključ" prvo).
- **0) Flashcard bug** (**BUG-013**, [BUGS.md](BUGS.md)) — ✅ **RIJEŠEN + LIVE (deployano 2026-06-28, `213b067`):**
  grid-stack (`.flashcard-inner{display:grid}` + strane `grid-area:1/1; position:relative`) + svi fiksni `height` na `.flashcard` → `min-height`
  (`responsive/01`×4, `02`×1). Kartica naraste do više strane → strelice nikad prekrivene. CSS-only, cache `20260694`.
- **1) HRV program „Menadžment u Hotelijerstvu" — CIGLE 1–5c ✅ LIVE (deployano 2026-06-28, `320d413..4b795c8`):** prijevod predmeta na hrvatski.
  Arhitektura (ADR-012): **klon programa (Opcija A), NE i18n u sadržaju** — `hospitality-management-hr` + `data/<subj>-hr/*.js` (isti engine 0 promjena,
  vlastiti `storageKey`). Prijevod preko **`scripts/translate-subject.js`** (Sonnet tool_use, slot-pristup + salvage-parser; čuva quiz-indeks/KaTeX/
  `_______`/HTML). **Napravljeno:** ✅ pilot **Business Informatics HR** (11 kat/86fc, ~$0.66) · ✅ catalog (EN nepromijenjen, HR kroz Browse) ·
  ✅ **UI i18n + globalni 🌐 HR/EN toggle** (`js/i18n.js`, ~160 ključeva; cijeli study UI + landing + browse; EN bajt-identičan). Detaljan plan: [HRV_PLAN.md](HRV_PLAN.md).
  **⬜ Preostaje:** long-tail chrome (profil/pravne stranice/lessons-header/blind-map) **PA prijevod ostalih predmeta** (batch alatom) → kvantitativni → vježbe → Supabase re-sync.
- **2) 3. godina** Hospitality Managementa — doći će, timing TBD.
- **3) Studentski UGC za više godine:** studenti uploadaju/grade **3. i 4. godinu**. Za randomizirane UGC-vježbe =
  **deklarativni `params`+formula + sigurni sandbox-evaluator** (NE `eval`), ne klijentski kod (vidi BUG-012 pouku). Veže se na Fazu 1–2 + moderaciju ([VISION.md](VISION.md) §4).

## 📍 STANJE (povijesno, 2026-06-10)
**Napravljeno:** M0 Blok A (A1–A3) gotov i **LIVE** (data-driven katalog, `config.js` i sidebar iz
catalog-a) · Learn responsive/overflow fix live · sadržajni alati (template, scaffold, `verify`,
`pdf-text`, Playwright suite) · **Business Informatics (1. god, sem 1) KOMPLETAN** (K1+K2+Final, 11
kategorija) · **M0.5: puni drill-down navigacija (`#browse-page`) + „čisto i bogato" redizajn ✅** ·
**Landing rebuild u punu „pravu stranicu" ✅** (nav, subjects showcase iz catalog-a, How it works,
5 modova, CTA, strukturiran footer) + **SEO meta popravljen** · **Lazy-loading sadržaja ✅ (A4)**
(`content-loader.js`; ~777 KB se više ne učitava na startu, nego po predmetu) · **VISION.md** zapisan.
**Odluka smjera (2026-06-05):** prvo **kompletirati sadržaj** (1. i 2. godina) PA Blok B — autorstvo u
datotekama je migracijski sigurno (ADR-006), migracija ide JEDNOM na punom katalogu. Tier 2 (Privacy/FAQ/
Contact) ostaje brzi „quick win" kad zatreba za Google Ads.
**Kvantitativni predmeti (Math/Micro/Macro/Statistika):** poseban tretman — **KaTeX** rendering formula +
„worked problems" konvencija + grafovi-kao-slike (**ADR-009**). KaTeX = zasebna cigla PRIJE prvog takvog
predmeta; čista Matematika ZADNJA. Inventar materijala 1. god: [CONTENT_INTAKE.md](CONTENT_INTAKE.md).
**Sadržaj:** 2. god = 8 predmeta ✅ · **Marketing KOMPLETAN** (K1+K2+Finalni, 13 kat.) · **Economics in Hospitality
KOMPLETAN** (K1 Unit 1–5 + K2 Unit 6–10 + Finalni hibrid, 11 kat. / 162 fc) · **Tourism Geography KOMPLETAN**
(S30 1. kolokvij popravljen iz izvora: + `introToGeography`, croatiaFeatures, parks/UNESCO, karta netaknuta;
S31 2. kolokvij „svjetska geografija" 6 kat. po kontinentu; **S32 Finalni hibrid** `data-geography-final.js`
13 kat. / 128 fc) · **Food & Nutrition KOMPLETAN** (K1 Teme 1–7 verificiran + Beer premješten; K2 Teme 8–14; finalni hibrid;
15 kat. / 174 fc). **2. god = 8/8 KOMPLETNO (2026-06-13)** — sem 2 (Econ Hospitality, Marketing, Geography, Food & Nutrition) + sem 1
(Accounting, te2, E-Business, Entrepreneurship), svi K1/K2/finalni. (svi LIVE; Entrepreneurship deployano
2026-06-13 `8a37404`. Detalji: [BACKLOG.md](BACKLOG.md).) · **▶ 1. god** = Business Informatics ✅ + **SIT ✅ LIVE (2026-06-14
`e0e9ca7`, 13 kat/94 fc)** + **Management ✅ LIVE (2026-06-14 `06c96a8`, 11 kat/89 fc)**, ostalih 8 ⬜
(**Management bio zadnji čisto tekstualni**; dalje KaTeX cigla → Macro 19 / **Stat 26** / **Micro 172-str deck** / Math 109,
Math zadnja; Acad-writing/Intro-hosp/Traffic PRAZNO).
**Deploy:** sve LIVE na `origin/main` → Vercel. **2026-06-10 deployano (`05cb0af`):** **cijeli Food & Nutrition** (K1 Teme
1–7 verificiran iz izvora + Beer premješten u K2 po silabusu; K2 Teme 8–14; finalni hibrid) + **fix BUG-009** (Entrepreneurship
fill-blank). **Ranije `a8e7371`** (2026-06-10): cijeli Tourism Geography (S30–S32). **`24f2b6f`** (2026-06-09): Economics in
Hospitality + BUG-008 + Entrepreneurship→sem 1. (`822d788`, 2026-06-06: Marketing + responsive split + BUG-005/006/007.)
Radno stablo čisto, ništa lokalno nedeployano.

## M0 — Temelj: data-driven + backend (Faza 0)  🟦
Cilj: ukloniti hardkodiranje i postaviti skalabilan backend bez rušenja live verzije.

**Blok A — Frontend data-driven (lokalno, bez backenda)**
- ✅ A1 — `data/catalog.js` (jedinstveni izvor istine, hijerarhija FMTU→HM→2.god)
- ✅ A2 — `js/config.js` čita iz catalog-a (subjectDataMap + getSubjectData);
  svi data-*.js izloženi na `window`; verificirano `scripts/verify-catalog.js` (0 grešaka)
- ✅ A3 — sidebar render iz catalog-a (`renderSubjectsSidebar()`); uklonjen ručni
  HTML; `iconGradient` u catalogu; verificirano Playwrightom (sidebar.spec.js)
- ✅ A4 — **lazy loading** (`js/content-loader.js`: `loadSubjectContent()` učita sadržaj predmeta
  tek na otvaranje; statički `data-*.js` maknuti iz `index.html`). Šav prema `/api` (Blok B). Test `lazy-load.spec.js`.
- ✅ A5 — UI hijerarhije = **puni drill-down nav** (`#browse-page`, M0.5, ADR-007); test `browse.spec.js`

**Blok B — Backend: Vercel Functions + Supabase** (ADR-008, [BACKEND.md](BACKEND.md))

> **✅ Staza B (MVP) — Auth + cloud sync napretka (2026-06-12):** Supabase projekt + `supabase/schema.sql`
> (tablica `progress`, RLS) + `js/auth.js` (email magic-link) + `js/cloud-sync.js` (offline-first sync).
> Bez `/api` funkcija (frontend → Supabase direktno, publishable key + RLS). Sadržaj i dalje u fajlovima —
> stavke B6–B10 dolje su **staza A (migracija sadržaja)** i rade se JEDNOM kasnije. Detalji: `BACKEND.md` §Staza B.

- ✅ B6 — Supabase projekt + schema (`progress` + **`subject_content` tablica** s public-read RLS)
- ✅ B7 — migracijska skripta `scripts/migrate-content.js` (`data/*` → baza; 49 redova / 15 predmeta migrirano)
- ✅ B8 — read-path: frontend `loadSubjectContent` čita iz baze **direktno (anon key + RLS, ne `/api`)** s file-fallbackom (ADR-011). Flag `CONTENT_FROM_SUPABASE`.
- ⬜ B9 — admin login (Supabase Auth, samo ja)
- ⬜ B10 — admin CRUD (hijerarhija + sadržaj) → tada baza postaje JEDINI izvor
- Napomena: datoteke OSTAJU izvor istine, baza = zrcalo (re-sync skriptom). Puna migracija (baza=jedini izvor) tek s admin CRUD-om, kad je 1. god gotova.

**Definicija gotovog (M0):** svih 8 predmeta dolazi iz baze, app radi identično,
prvo učitavanje brže, mogu dodati novi predmet kroz admin bez diranja koda.

## M0.5 — Spremnost za sadržaj: hijerarhija + redesign (PRIJE masovnog unosa)  🟦
Cilj: stranica strukturirana Fakultet → Smjer → Godina → (Semestar) → Predmet, i
uglađen „čisto i bogato" frontend, spremno za ~19+ predmeta. Logo se zadržava.

- Sadržajni alati: ✅ struktura+template+scaffold (K1); ✅ coming-soon iz catalog-a (K2,
  `isLessonComingSoon`); ⬜ validator sadržaja (K3); ✅ **lazy-load seam (K4)** = `js/content-loader.js`;
  ✅ **KaTeX math rendering (K5)** = `renderMath()` (`js/math.js`) + LaTeX konvencija (currency-safe `\( \)`/`\[ \]`/
  `$$ $$`) za kvantitativne predmete (ADR-009). KaTeX CDN `0.16.9` + `css/math.css`; pozvan u sva 4 renderera;
  test `tests/katex.spec.js`. **✅ LIVE (deployano 2026-06-14 `236e303` s Microeconomicsom).**
- ✅ Pilot sadržaja: **Business Informatics** (Ch1–11, K1+K2+Final) — dokaz da content pipeline radi
- ⬜ Catalog: dodati ostalih 10 predmeta 1. godine + semestar mapping (čeka materijale)
- ✅ Hijerarhijska navigacija: Start → Fakulteti → Smjerovi → Godine → Predmeti (po semestru) +
  breadcrumbs (`#browse-page`, `renderBrowse()`; test `browse.spec.js`)
- ✅ Frontend redesign (browse + landing): „čisto i bogato", dosljedne kartice (gradijent-ikone,
  napredak), responzivno (Playwright zeleno, 4 iPhone profila). Logo nepromijenjen.
- ✅ **Landing rebuild** u punu višesekcijsku „pravu stranicu": fixed nav, subjects showcase (iz catalog-a),
  How it works, 5 modova, završni CTA, strukturiran footer + **SEO meta**. Test `landing.spec.js`.
  Preostaje: redizajn study/lessons unutarnjih ekrana (kasnije po potrebi).
- ⬜ **Tier 2 (povjerenje / priprema za Google Ads):** Privacy Policy + Contact + FAQ stranica/sekcija
- ⬜ Intake materijala: `_materials/` + [CONTENT_INTAKE.md](CONTENT_INTAKE.md)
- **DoD:** uđeš → fakultet → smjer → godina → predmeti po semestru; izgled uglađen; sve responzivno
  (Playwright zeleno); dodavanje predmeta = catalog + scaffold. **(Navigacija + redizajn browse/landing: ispunjeno ✅)**

## M1 — UGC MVP (Faza 1)  ⬜
Upload PDF/PPT → ekstrakcija → Claude generira skriptu → privatno učenje.
Kvote troška od prvog dana. Ljudski pregled prije objave.

## M2 — Dijeljenje (Faza 2)  ⬜
Javna biblioteka skripti, pretraga, kopiranje/fork tuđih, prijava sadržaja.

## M3 — Natjecanje + društveno (Faza 3)  ⬜
Ljestvice, profili, statistika učenja, anti-cheat.

## M4 — Monetizacija (Faza 4)  ⬜
Freemium/paywall na funkcionalnosti, "donesi svoj API ključ", lokalno sponzorstvo.

---
*Detalji koraka i obrazloženja: [ARCHITECTURE.md](ARCHITECTURE.md). Napredak: [PROGRESS.md](PROGRESS.md).*
