# Predmeti — stanje sadržaja (autoritativna tablica)

> **Ovo je trajni dom za "koji predmet ima što".** Izvor: CLAUDE.md povijest (pred-reorg 2026-07-08) + docs/PROGRESS.
> Brojevi = **finalna lekcija** (hibrid K1+K2+examPractice). Ažuriraj OVDJE kad se predmet mijenja.

## Invarijante (vrijede za sve predmete)
- Svaki predmet = **3 lekcije**: `first-midterm` / `second-midterm` / `final` (final = `Object.assign(M1, M2, {examPractice})`, učitava se **ZADNJI**).
- **JSON dual-read 18/18**: study sadržaj se čita DB → `data/json/<id>/*.json` → `.js` fallback. Datoteke = izvor istine do F4.6 flipa.
- **Vježbe = JS moduli** (`data/<id>/exercises.js` + lib), NIKAD u bazu/JSON (BUG-012); učitavaju se preko `content.codeScripts`.
- Baza `subject_content`: **51 red / 17 predmeta** (17×3; **accounting nije u bazi** — study ide s JSON/datoteka).
- Kvantitativni predmeti = **KaTeX** (ADR-009; currency-safe delimiteri `\( \)` / `\[ \]` / `$$ $$`, NIKAD jedan `$`).

## 2. godina HM — 8/8 KOMPLETNO i LIVE

| Predmet | ID | Sem | Final: kat/fc/quiz/fill | Vježbe | Napomene |
|---|---|---|---|---|---|
| Tourism Economics 2 | `te2` | 1 | 11 / 135 / 94 / 66 | — | REBUILD iz 10 PDF predavanja (stari je bio tanak); LIVE 2026-06-12 `ca06158` |
| Entrepreneurship & Innovation | `entrepreneurship` | 1 | 15 / 175 / 134 / 80 | — | split + 4 nove kat (~95 fc); LIVE 2026-06-13 `8a37404` |
| Accounting | `accounting` | 1 | 15 kat | **41** (6 tipova) | prvi s Exercises sustavom; plan [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md); LIVE 2026-06-12 `a6b6fb0` |
| E-Business | `ebusiness` | 1 | 15 / 152 / 124 / 75 | — | stari bio VJERAN predavanjima → split + obogaćen (+23 fc); LIVE 2026-06-13 `51e4e7b` |
| Economics in Hospitality | `econ-hospitality` | 2 | 11 / 162 / 106 / 84 | — | K1 rebuild iz izvora (30→73 fc) + K2 hotelski KPI; LIVE 2026-06-09 `24f2b6f` |
| Marketing | `marketing` | 2 | 13 / 113 / 66 / 56 | — | K1 (T1–T8) + K2 (T9–T13) + hibrid; LIVE 2026-06-06 `822d788` |
| Tourism Geography | `geography` | 2 | 13 / 128 / 127 / 84 | — | + **slijepa karta** (blind-map, WebP); K1 obogaćen, K2 kontinenti; LIVE 2026-06-10 `a8e7371` |
| Food & Nutrition | `food-nutrition` | 2 | 15 / 174 / 182 / 122 | — | Beer premješten K1→K2 po silabusu (ključ isti → napredak očuvan); LIVE 2026-06-10 `05cb0af` |

## 1. godina HM — 9/9 KOMPLETNO i LIVE (⛔ Intro to Hospitality BLOKIRAN — nema PDF-ova)

| Predmet | ID | Sem | Final: kat/fc/quiz/fill | Vježbe | Napomene |
|---|---|---|---|---|---|
| Business Informatics | `business-informatics` | 1 | 11 kat / ~86 fc | — | prvi 1.god predmet (pilot mapa-po-predmetu) |
| Microeconomics | `microeconomics` | 1 | 15 / 164 / 148 / 118 | — | **prvi kvantitativni (KaTeX)**; K1=Ch1–7, K2=Ch8–18 iz silabusa; LIVE 2026-06-14 `236e303` |
| Statistics | `statistics` | 1 | 10 / 108 / 102 / 80 | **56** + `stat-lib` | KaTeX; Learn obogaćen (Track A); plan [STATISTICS_PLAN.md](STATISTICS_PLAN.md); LIVE 2026-06-16 `d97ee0b` |
| Macroeconomics | `macroeconomics` | 1 | — (study) | **~81** (B1–B12) | KaTeX; open-economy + BoP vježbe; LIVE `58cc37c` + `28fcb7e` |
| Academic Writing | `academic-writing` | 1 | 24 / 336 / 286 / 240 | **17** (uklj. 2 `cite`) | **prvi GENERATOR-pilot** (~$2.27); Chicago style težište; LIVE 2026-06-23 |
| Mathematics | `math` | 1 | 10 / 79 / 79 / 64 | **39** + `math-lib` | KaTeX; ZADNJI 1.god predmet; K1 learn obogaćen + Gauss/Gauss-Jordan; plan [MATH_PLAN.md](MATH_PLAN.md); LIVE 2026-06-27 |
| Special Interest Tourism | `sit` | 2 | 13 / 94 / 83 / 65 | — | ⚠ nautical kat. iz općeg znanja (slikovni slajd); Event+Outdoor nepokriveni; LIVE 2026-06-14 `e0e9ca7` |
| Management | `management` | 2 | 11 / 89 / 84 / 55 | — | Lussier 9e; teme 2/3/6/13/15 bez decka → neobrađene; LIVE 2026-06-14 `06c96a8` |
| Traffic in Tourism | `traffic` | 2 | 27 / 189 / 186 / 188 | — | ručno (NE generator); CONNECTOR+PRODUCT obrazac; plan [TRAFFIC_PLAN.md](TRAFFIC_PLAN.md); LIVE 2026-06-25 `62a4119` |

## HR program „Menadžment u Hotelijerstvu" (klon, ADR-012) — STATUSNA PLOČA (vodi: Saša, [TEAM.md](../TEAM.md))

> **Aktivno od 2026-07-09** (ADR-023): Saša prevodi/gradi HR program do pune 2 godine. Tok po predmetu = [TEAM.md](../TEAM.md) §5
> (prijevod alatom → **HR materijali = autoritet** → gate → PR). Faza = S-cigla iz TEAM.md §4. Saša ažurira SAMO ovu tablicu
> (svoj redak, direktno u PR-u — **normalno pravilo vraćeno 2026-07-13**, docs su na main-u).

| Predmet (EN izvor) | HR ID | Faza | Status | PR / napomena |
|---|---|---|---|---|
| Business Informatics | `business-informatics-hr` | pilot (prije S-staze) | ✅ LIVE 2026-06-28 | 11 kat/86 fc; ~$0.66 |
| Management | `management-hr` | **S2 PILOT** | 🟡 **DRAFT PR #1 otvoren** (2026-07-12) | prijevod ✓ + catalog/JSON/bump ✓ + gateovi zeleni (185/0) ✓ + živa provjera ✓ + CI na PR-u zelen ✓ (grana `content/management-hr`, `9d2f5c3`); PR-opis po privremenom pravilu (redak u opisu) ✓; **čeka:** (1) rebase na novi main (F4 deploy 2026-07-13 → bump-konflikt, trivijalan — TEAM.md §7) · (2) 1.god materijali (Leon) za §5.2 terminologiju → Saša flipa u „Ready for review" |
| Special Interest Tourism | `sit-hr` | S3 | ⬜ | |
| Traffic in Tourism | `traffic-hr` | S3 | ⬜ | |
| Tourism Economics 2 | `te2-hr` | S3 | ⬜ | |
| Entrepreneurship & Innovation | `entrepreneurship-hr` | S3 | ⬜ | |
| E-Business | `ebusiness-hr` | S3 | ⬜ | |
| Economics in Hospitality | `econ-hospitality-hr` | S3 | ⬜ | |
| Marketing | `marketing-hr` | S3 | ⬜ | |
| Tourism Geography | `geography-hr` | S3 | ⬜ | + blind-map (geografija-only) |
| Food & Nutrition | `food-nutrition-hr` | S3 | ⬜ | |
| Academic Writing | `academic-writing-hr` | S3 (study) + S5 (vježbe) | ⬜ | Chicago primjeri = jezično osjetljivi |
| Microeconomics | `microeconomics-hr` | S4 (KaTeX) | ⬜ | |
| Macroeconomics | `macroeconomics-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Statistics | `statistics-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Mathematics | `math-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Accounting | `accounting-hr` | S3 (study) + S5 (vježbe) | ⬜ | |

**S6 (examPractice iz ispitnih pitanja)**: usput, po dostupnosti Word materijala. **S7 (MUT/MOR)**: čeka U2.5 (ADR-022).

## Detaljni planovi (u ovoj mapi)
- [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md) — analiza izvora + katalog vježbi (✅ done)
- [STATISTICS_PLAN.md](STATISTICS_PLAN.md) — Learn Track A + vježbe Track B (✅ done)
- [TRAFFIC_PLAN.md](TRAFFIC_PLAN.md) — plan + master-obrazac (✅ done)
- [MATH_PLAN.md](MATH_PLAN.md) — KaTeX + worked problems (✅ done)

## Pouke za budući sadržajni rad (iz CLAUDE.md povijesti, 2026-06)
- **Provjeri stari sadržaj PROTIV predavanja:** rebuild ako je tanak (te2; djelomično Entrepreneurship), split+obogaćivanje ako je vjeran (E-Business).
- **Learn sekcije moraju biti BOGATE** (definicija+intuicija+radni primjeri+interpretacija+zamke), ne „formule nabacane" — uzor: Statistics Track A / Math K1 obogaćivanje. [[learn-sections-must-be-rich]]
- **Korisnik ZASIĆEN računovodstvom** — na Accounting se NE vraćati osim izričito.
- **Masovni unos novog programa** → generator ([../content/CONTENT_GENERATOR.md](../content/CONTENT_GENERATOR.md)) + razmotriti dodatne uštede usagea (korisnik: „kombinacije uštede kasnije").
- **KaTeX predmeti:** currency-safe delimiteri (ADR-009; jedan `$` NIKAD); `final` se učitava **ZADNJI**; sadržajna točnost = dvo-ključni verifier (ADR-020) kad se vratimo sadržaju.

> Alati za autorstvo: [../content/](../content/) (SCHEMA · GUIDE · INTAKE · GENERATOR · EXERCISES_ENGINE).
