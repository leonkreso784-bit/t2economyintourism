# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/) · Verzioniranje: [SemVer](https://semver.org/).
Tekuća live verzija je 2.x. Platformska pregradnja (Faza 0+) vodi prema 3.0.0.

## [Unreleased] — rad u tijeku (cilj: 3.0.0)
### Added
- `data/catalog.js` — jedinstveni izvor istine za predmete s hijerarhijom
  fakultet → smjer → godina → semestar → predmet → lekcija (M0/A1).
- `docs/` — profesionalna projektna dokumentacija (PRD, ROADMAP, ARCHITECTURE,
  PROGRESS, BUGS, DECISIONS, CONTENT_SCHEMA, CONTENT_GUIDE, TESTING, BACKLOG).
- `scripts/verify-catalog.js` — checker integriteta catalog-a (pokreni nakon
  dodavanja predmeta).
### Changed
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
- Learn sekcija (mobilna responzivnost, BUG-003): smanjen nagomilani donji padding
  (learn-container 90px→24px) i dodan bočni safe-area inset u landscape za moderne
  iPhone (notch/Dynamic Island).
### Napomena
- Live ponašanje (osim ciljanih CSS popravaka) nepromijenjeno; promjene verificirane
  skriptom + parse-checkom + brace-balance provjerom.

## [2.0.0] — baseline (postojeća live verzija)
### Added
- 8 predmeta, 5 modova učenja (Learn, Flashcards, Quiz, Fill, Progress).
- Blind Map za Tourism Geography.
- Modularizacija app.js u 12 JS modula; modularni accounting podaci.
- PWA, dark tema, lokalno spremanje napretka.
