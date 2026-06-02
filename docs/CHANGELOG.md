# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Verzioniranje: [SemVer](https://semver.org/).
Tekuća live verzija je 2.x. Platformska pregradnja (Faza 0+) vodi prema 3.0.0.

## [Unreleased] — rad u tijeku (cilj: 3.0.0)
### Added
- `CLAUDE.md` (root) — sažeti ključni kontekst koji se učitava svaku sesiju (preživljava
  kompaktiranje razgovora): stack, arhitektura, kritična pravila (cache bump, deploy uz potvrdu),
  komande, stanje, odluke. Detalji ostaju u `docs/`.
- `data/catalog.js` — jedinstveni izvor istine za predmete s hijerarhijom
  fakultet → smjer → godina → semestar → predmet → lekcija (M0/A1).
- `docs/` — profesionalna projektna dokumentacija (PRD, ROADMAP, ARCHITECTURE,
  PROGRESS, BUGS, DECISIONS, CONTENT_SCHEMA, CONTENT_GUIDE, TESTING, BACKLOG).
- `scripts/verify-catalog.js` — checker integriteta catalog-a (pokreni nakon
  dodavanja predmeta).
- Playwright vizualni responsive testovi (`tests/responsive.spec.js`,
  `playwright.config.js`, `scripts/static-server.js`) — emulira iPhone SE/15Pro/
  ProMax + landscape, automatski hvata horizontalni overflow. `npm run test:responsive`.
- `tests/smoke.spec.js` — sve sekcije × svih 8 predmeta (render, protok podataka,
  JS greške, overflow). Potvrđuje da A2 catalog refaktor ništa ne ruši.
- Content authoring tooling: `data/_template/lesson.template.js`,
  `scripts/scaffold-subject.js` (generira mapu+lekcije+catalog unos), npm skripte
  `scaffold` i `verify`. Standardna struktura: mapa po predmetu, datoteka po lekciji
  (ADR-006).
- `scripts/pdf-text.js` + `pdf-parse` (devDep) — ekstrakcija teksta iz profesorskih PDF-ova.
- **Business Informatics (1. godina, sem 1) — KOMPLETAN:**
  - Midterm 1 (Ch1–6): System Approach, Data/Info/Knowledge, Hardware, Software, Networks, WWW
  - Midterm 2 (Ch7–11): E-Business, IT Trends, Management Support, Expert Systems, Security
  - Final (`final.js`) = merge M1+M2 → 11 kategorija
  - Ukupno ~86 flashcards, 55 quiz, 44 fill (vjerno profesorskim PDF-ovima).
  - Provjereno: verify 0 grešaka; browser → M1=6, M2=5, Final=11 kartica, 0 overflow, 0 JS grešaka.
- **Browse stranica — puni drill-down navigacija** (`#browse-page`, M0.5 / A5, ADR-007):
  Fakultet → Smjer → Godina → Predmet (po semestru) → Lekcije. Render 100% iz catalog-a
  (`SokratCatalog.faculties/programsOf/yearsOf/subjectsOf/semestersOf` + `renderBrowse()` /
  `initBrowse()` u `js/navigation.js`, stil `css/browse.css`). Bogate kartice ("čisto i bogato":
  gradijent-ikone, breadcrumb, "Best NN%" napredak iz spremljenih quiz rezultata). Dodavanjem
  fakulteta/smjera/godine/predmeta u catalog kartice se pojave bez izmjene UI-a. Test:
  `tests/browse.spec.js` (drill-down + overflow guard, 4 iPhone profila).
- `SokratCatalog.isLessonComingSoon()` — data-driven "coming soon" (lekcija bez resolve mapiranja).
- **Landing rebuild — "prava stranica"** (M0.5 Tier 1): fixed nav traka (logo + linkovi + "Start studying"),
  hero trust red, **subjects showcase iz catalog-a** (`renderLandingSubjects()`/`initLandingSubjects()`, klik → lekcije),
  "How it works" (3 koraka), "Study modes" (5 modova), završni CTA band, strukturiran footer
  (brand/Explore/About + copyright). Svi "Start" gumbi vežu se preko klase `.start-trigger`. CSS u `css/landing.css`.
  Test: `tests/landing.spec.js` (nav, showcase=catalog, navigacija, overflow guard, 4 iPhone profila).
### Changed
- **SEO `<head>`:** osvježen `description`/`keywords`/`<title>`; dodan `canonical` + `og:site_name`;
  `og:url`/`twitter` → `https://www.sokratstudy.com/`; `og:image` → `/icon-512.png` (bilo zastarjelo: vercel.app + samo 3 predmeta).
- Bump `?v=20260605` (landing.css, styles.css, navigation.js, init.js) za landing rebuild.
- Landing: CTA "Start Studying" sada vodi na **browse drill-down** (umjesto slide-in sidebara;
  sidebar ostaje kao bezopasan legacy fallback). Back s Lessons vraća na popis predmeta (čuva drill-down poziciju).
- Landing: broj predmeta sada dinamičan iz catalog-a (`renderLandingMeta()` + `data-meta="subjectCount"`);
  osvježen copy (Year 1 & 2). Vizualni smjer: **"čisto i bogato"** (ne preminimalistički) — vidi ADR-007.
- `renderLessonsPage()` — coming-soon sada iz catalog-a (`isLessonComingSoon`) umjesto hardkodiranog `second-midterm`.
- Bump `?v=20260604` za izmijenjene datoteke (catalog.js, navigation.js, init.js, variables.css, styles.css + novi browse.css).
- Sidebar predmeta sada se renderira iz `data/catalog.js` (`renderSubjectsSidebar()`
  u `js/navigation.js`, pozvan iz `js/init.js`). Uklonjen ručno pisani `.subject-item`
  HTML iz `index.html`. Dodan `iconGradient` u catalog (vizualna parnost). Dodavanje
  predmeta sada = samo unos u catalog. (M0/A3; test: `tests/sidebar.spec.js`.)
- Bumpani svi `?v=` tokeni skripti/CSS-a u `index.html` na 20260602 (cache).
- Ažuriran root `README.md` — opisuje platformu, predmete (FMTU/Hospitality Mgmt)
  i poveznice na `docs/`.
- `js/config.js` — `subjectDataMap` i `getSubjectData()` sada se izvode iz
  `data/catalog.js` (uklonjeni hardkodirani if-lanci). Ponašanje nepromijenjeno
  (verificirano).
- Svi `data-*.js` sada izlažu svoj objekt na `window` (standardizacija za
  catalog lookup i lazy loading).
- `index.html` — učitava `data/catalog.js` prije `js/config.js`.
### Fixed
- `responsive.css` — dva slomljena CSS pravila (nedovršeni `.quiz-section,
  .fill-section,` selektor i sirotinjski `.topic-*` blok + višak `}`). Zagrade
  sada balansirane (520/520). Vidi BUG-001, BUG-002.
- Learn sekcija (mobilna responzivnost, BUG-003): **riješen horizontalni overflow** —
  `.study-content` (flex-dijete) dobio `min-width:0` + `width:100%` da se ne širi do
  `max-width:1200` na mobitelu; obrambeni `min-width:0` na `#learn`/`.learn-container`/
  `.learn-content`. Plus dedupliciran donji padding i landscape safe-area inset.
  Verificirano Playwrightom (4 iPhone profila × 8 predmeta, 0 overflowa).
- Cache-busting: dodan `?v=20260602` na sve CSS `@import` u `styles.css` (+ bump
  `styles.css?v=` u index.html) — bez toga `immutable` cache servira stari CSS
  nakon deploya (BUG-004).
### Napomena
- Live ponašanje (osim ciljanih CSS popravaka) nepromijenjeno; promjene verificirane
  skriptom + parse-checkom + brace-balance provjerom + Playwright smoke/responsive.

## [2.0.0] — baseline (postojeća live verzija)
### Added
- 8 predmeta, 5 modova učenja (Learn, Flashcards, Quiz, Fill, Progress).
- Blind Map za Tourism Geography.
- Modularizacija app.js u 12 JS modula; modularni accounting podaci.
- PWA, dark tema, lokalno spremanje napretka.
