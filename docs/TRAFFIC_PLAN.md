# TRAFFIC_PLAN — Traffic in Tourism (1. god, sem 2)

> Plan izrade predmeta **Traffic in Tourism** (FMTU Opatija, Hospitality Management, 1. godina).
> Ručno iz predavanja (kvalitativan predmet, NE generator, NE KaTeX).
> **Status: ✅ GOTOVO lokalno (2026-06-24)** — `data/traffic/` M1+M2+finalni izgrađeni; finalni **27 kat / 189 fc / 186 quiz / 188 fill**;
> catalog `traffic` (year 1, sem 2, `fa-route`/`#f59e0b`); cache `20260685`; gate zelen (validate 0/0, verify 0/0, Playwright 68/68). Čeka deploy + Supabase re-sync.

## Izvor istine
- **Silabus = `Obrazac DINP_ENGL_MUH 2024-2025.pdf`** (prof. Nataša Kovačić, 6 ECTS, 60h = 30L+30S).
- 13 PDF-ova u `…/1. godina Hospitality Managament/Traffic in tourism/` (izvan repo-a, kao i ostali materijali).
- Ekstrakcija: `node scripts/pdf-text.js "<pdf>"` → `tmp-traffic/` (gitignored).

## K1/K2 granica — AUTORITATIVNA iz silabusa + INTRO
- **1. kolokvij = tjedan 7**, **2. kolokvij = tjedan 15** (raspored predavanja, str. 5–6 silabusa; potvrđeno u INTRO.pdf „COURSE CONTENT").
- **K1 = tjedni 1–6** · **K2 = tjedni 7–15.**

## Klasifikacija materijala (korisnik: „neke stvari nisu potrebne, neki su samo esejski zadaci")
**✅ Nastavni deckovi (uče se):**
| Deck (PDF) | Tjedan | Linija teksta |
|---|---|---|
| INTRO.pdf | 1–2 | ⚠️ **ADMINISTRATIVAN** — upis/bodovanje/esej/research zadatak; **nema nastavnog sadržaja**, samo potvrđuje K1/K2 split |
| TJ 3 patterns | 3 | 299 — bogat (EU mobility survey: modal choice, long-distance travel, willingness-to-change) |
| TJ 4 and 5 road traffic | 4–5 | 503 |
| Rail transport and rail tourism | 6–7 | 789 |
| Air traffic and tourism | 8 | 492 |
| Maritime and river transport in tourism | 9 | 736 |
| SAFETY lecture | 11 | 432 |
| Sustainable and Smart Mobility Strategy | 14–15 | 1236 |

**➖ EU izvještaji (NE zasebne kategorije — samo izvor činjenica):** CO2 emissions from cars · Annual road-safety report EU 2023 · EU progress against climate change · figures on European transport 2024. Ključne brojke se utkaju u **Safety (11)** i **Ecology (12–13)**.

**⚠️ Rupe (nema decka — autorski iz silabusa + standardne transportne teorije):**
- **Tjedni 1–2** „Theoretical Basis of Traffic" + „Interdependence of Traffic & Tourism" — INTRO je samo admin. Pojmovi iz ciljeva silabusa: *traffic, traffic system, traffic mode, traffic service, traffic demand & offer, traffic effect, traffic policy* + međuovisnost transporta i turizma (uloga sektora u povezivanju ponude i potražnje).
- **Tjedan 10** „The value and quality of transportation services" (LO3) — nema zasebnog PDF-a → autorski iz silabusa LO3 (trošak/cijena transportne usluge u cijeni turističkog proizvoda).

## Struktura kategorija (mirror ostalih predmeta)
**K1 — `data/traffic/midterm-1.js` (`trafficM1`, 6 kat.):**
1. `theoreticalBasis` — Theoretical basis of traffic (autorski, tj. 1)
2. `trafficTourismInterdependence` — Interdependence of traffic & tourism (autorski, tj. 2)
3. `mobilityTravelPatterns` — Mobility & travel patterns (TJ 3, tj. 3)
4. `roadTransportConnecting` — Road transport ↔ destination (TJ 4&5, tj. 4)
5. `roadTransportProduct` — Road transport kao turistički proizvod (TJ 4&5, tj. 5)
6. `railTransportConnecting` — Rail transport ↔ destination (Rail, tj. 6)

**K2 — `data/traffic/midterm-2.js` (`trafficM2`, 7 kat.):**
7. `railTransportProduct` — Rail kao tur. proizvod + funicular/cable car (Rail, tj. 7)
8. `airTransport` — Air transport (connecting + product) (Air, tj. 8)
9. `waterTransport` — Water transport maritime/river (connecting + product) (Maritime, tj. 9)
10. `valueQualityServices` — Value & quality of transport services (autorski LO3, tj. 10)
11. `safetyInTraffic` — Safety in traffic (SAFETY + EU road-safety report, tj. 11)
12. `ecologicalAspects` — Ecological aspects of transport (SAFETY/Sustainable + CO2/climate reports, tj. 12–13)
13. `futureOfTransport` — Future of transport (Sustainable & Smart Mobility Strategy, tj. 14–15)

**Finalni — `data/traffic/final.js`:** `trafficFinal = Object.assign({}, trafficM1, trafficM2, { examPractice })` (učitava se ZADNJI). `examPractice` = cross-topic sinteza (uloga transporta u turizmu, usporedba modova, održivost). → **14 kat. ukupno.**

## Schema po kategoriji
`name, icon, color, flashcards[], quiz[](correct=index), fillBlanks[](_______), learn{content}`.
- **Learn = bogat udžbenički stil** (def + intuicija + interpretacija + zamke + primjeri) — korisnikovo pravilo [[learn-sections-must-be-rich]].
- **Bez KaTeX-a, bez numeric vježbi** (kvalitativan predmet). Vježbe (Exercises) — NE za sad (korisnik).

## Koraci izrade (cigla po cigla)
1. Ekstrahirati preostale deckove u `tmp-traffic/` (već: INTRO, TJ 3; treba TJ 4&5, Rail, Air, Maritime, SAFETY, Sustainable + skenirati 4 EU izvještaja za činjenice).
2. K1 (`midterm-1.js`) — 6 kat., verificirati protiv decka.
3. K2 (`midterm-2.js`) — 7 kat.
4. Finalni (`final.js`) — hibrid + examPractice.
5. Catalog unos: subject `traffic` (year 1, **sem 2**, ikona `fa-route`, boja TBD — npr. amber `#f59e0b`), 3 lekcije + 3 scripta + `resolve`.
6. Bump `CONTENT_VERSION` (content-loader.js) + `?v=` (index.html, catalog.js u content scripts).
7. **Gate:** `npm run validate:content traffic` → `npm run verify` → `npm run test:responsive` → spot-check (činjenice protiv deckova).
8. **Re-sync Supabase** (`node scripts/migrate-content.js traffic`) jer je Blok B read-path aktivan (baza = zrcalo datoteka).
9. Docs update (PROGRESS/CHANGELOG/ROADMAP/CLAUDE.md state), commit. **Deploy tek na izričitu potvrdu korisnika.**

## Napomene / pouke
- ⚠️ Mnogi slajdovi su slike/grafovi (prazne stranice u ekstrakciji) → činjenice iz tekstualnih slajdova + standardno znanje; označiti nesigurno za verifikaciju.
- TJ 3 i izvještaji su jako EU-statistika-teški → birati ispitno relevantne, trajne činjenice (koncepti > pojedinačni postoci po zemlji).
- Pouka [[content-roadmap-sequencing]]: stari sadržaj nema (nov predmet), pa se gradi iz predavanja od nule.
