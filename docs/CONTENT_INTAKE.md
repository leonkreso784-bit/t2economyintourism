# Content Intake — kako slagati izvorne materijale (PPT/PDF/JPG)

> Cilj: da pretvaranje profesorskih prezentacija u gradivo bude TOČNO i da se
> tekst (pogotovo formule) ne iskvari. Materijali idu u `_materials/` (gitignored).

## Format — po točnosti teksta
1. **PDF s pravim tekstom (NAJBOLJE)** — PowerPoint → *Save As → PDF*. Tekst ostaje
   selektabilan pa ga čitam doslovno (najmanje grešaka). Preferiraj za predmete bogate
   tekstom (ekonomija, management, informatika).
2. **JPG / PNG slike** — čitam ih vizualno (kao OCR). Dobro za slajdove s dijagramima i
   slikama; kod sitnog/gustog teksta moguća pokoja greška. Jedan slajd = jedna slika,
   visoka rezolucija, nazivi zero-padded (`Slide01.jpg`).
3. **Izbjegavaj**: niskorezolucijske screenshotove, jako kompresirane slike, "spojene"
   prezentacije u jedan fajl bez reda.

## ⚠️ Kvantitativni predmeti (Math / Micro / Macro / Statistika) — poseban tretman
Ovi predmeti idu **drugačije** od tekstualnih (puna razrada: [DECISIONS.md](DECISIONS.md) ADR-009):
- **Formule → KaTeX/LaTeX.** Pišu se kao `$...$` u poljima (vidi [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md)).
  **KaTeX rendering dodajemo kao zasebnu ciglu PRIJE prvog takvog predmeta.**
- **Slike (JPG slajdovi):** čitam ih (Read alat čita JPG/PNG) i **transkribiram formule u LaTeX**.
  Math materijal su tipkani PPT slajdovi (provjereno čitljivi) → izvedivo, ali **ti OBAVEZNO pregledaš matematiku**.
- **Grafovi** (tangente, ponuda/potražnja, distribucije): zasad croppani slajd kao slika u `learn.image`.
- **Pedagogija:** worked-problems na postojećim modovima (Learn = riješeni primjeri korak-po-korak;
  Quiz = numerički, distraktori = tipične greške).
- **Redoslijed:** čista **Matematika ZADNJA** (najveća gustoća formula); pilot na predmetu s najviše konceptualnog + materijalima.
- **Rizik:** točnost → male serije, `verify` + tvoj pregled nakon svake cigle.

## Inventar 1. godine (stanje materijala, 2026-06-05)
Folder: `C:\Users\leonk\OneDrive\Documentos\1. godina Hospitality Managament`

| Predmet | Materijali | Bilješka |
|---|---|---|
| Business Informatics | 12 PDF | ✅ GOTOVO (pilot — tekstualni pipeline dokazan) |
| Macroeconomics | 19 PDF | dobar tekstualni izvor (kvantitativni elementi) |
| Management | 11 PDF | tekstualni |
| Special interest in tourism | 13 PDF + txt | tekstualni |
| Math | 100 JPG + 8 PDF + docx | PPT slajdovi (čitljivi): realni brojevi, funkcije, derivacije, integrali, Gauss-Jordan, ekon. primjene → KaTeX + grafovi-kao-slike |
| Microeconomics | 3 PDF | **tanko** — vjerojatno treba još |
| English | 2 PDF | malo |
| Academic writing | 0 | **PRAZNO** |
| Introduction to hospitality | 0 | **PRAZNO** |
| Statistics | 0 | **PRAZNO** — nema za pilot |
| Traffic in tourism | 0 | **PRAZNO** |

**Posljedica za plan:** Statistika nema materijala (ne može biti pilot); Micro tanak. Kvantitativni pilot
realno = **Math** (bogato) ili **Macro** (19 PDF). 4 prazna predmeta čekaju da doneseš materijale.
Najbrži dobici (tekstualni, bez KaTeX-a): **Management, Macroeconomics, Special interest in tourism**.

## Marketing (2. god) — intake & plan (2026-06-05) ← SLJEDEĆE
Folder: `C:\Users\leonk\OneDrive\Documentos\2. godina Hospitaliy Managament\Marketing`
Svi PDF-ovi, **čista ekstrakcija teksta** (PPT-export, provjereno) → **bez KaTeX-a** (konceptualni predmet).

**Teme (TJ = tema):** T1 Concept · T2 Environment · T3 Market · **T4 = `Market Research.pdf`** (nenumeriran) ·
T5 Segmentation · T6 Consumer behaviour · **T7 Product** · **T8 Price** · T9 Distribution · T10 Promotion ·
T11 New trends in promotion · T12 Planning · T13 Organizing & Controlling.

**Podjela kolokvija (potvrdio korisnik): 2. kolokvij = T9 → kraj.**
- **1. kolokvij = T1–T8. ✅ GOTOVO (Sesija 20, 2026-06-05).** Dodane kategorije `product` (T7) i `price` (T8)
  u `data-marketing.js` (bilo T1,2,3,5,6). Verify 0, Playwright 36/36. Lokalni commit, NIJE deployano.
- **2. kolokvij = T9–T13. ✅ GOTOVO (Sesija 21, 2026-06-05).** Novi sibling fajl `data-marketing-m2.js`
  (`marketingM2Data`) s 5 kategorija (distribution, promotion, newTrendsPromotion, marketingPlanning,
  organizingControlling). Catalog `second-midterm` → `marketingM2Data`, coming-soon uklonjen. Verify 0,
  Playwright 36/36 + ciljani K2 render-test (4 profila, 0 problema). Lokalni commit, NIJE deployano.
- **Finalni ✅ GOTOVO (Sesija 22, 2026-06-06).** Struktura = **HIBRID** (odluka korisnika): `data-marketing-final.js`
  → `marketingFinalData = Object.assign({}, marketingData, marketingM2Data, { examPractice })`. Spaja svih 12
  kategorija K1+K2 + kurirana `examPractice` (cross-topic). Catalog: lekcija `final`, script zadnji, `resolve.final`.
  Verify 0, strukturni validator 0 (13 kat.), Playwright 36/36 + ciljani final render-test (4 profila). Lokalno, NIJE deployano.

**Redoslijed rada (ciglu po ciglu, verify + Playwright + pregled nakon svake):**
1. ~~T7 + T8 → postojeći 1. kolokvij (`data-marketing.js`).~~ ✅ **GOTOVO (S20)**
2. ~~2. kolokvij T9–T13 (`data-marketing-m2.js` → `marketingM2Data`; catalog resolve; ukloniti coming-soon).~~ ✅ **GOTOVO (S21)**
3. ~~Finalni — NOVA lekcija (hibrid: spoj K1+K2 + Exam Practice).~~ ✅ **GOTOVO (S22)**
→ **Marketing predmet KOMPLETAN.** Sljedeće: deploy paketa (uz potvrdu) pa drugi predmeti.
**Catalog sad:** marketing ima `first-midterm` (✅) + `second-midterm` (coming-soon). Provjeri kako su drugi
predmeti riješili „final" (te2 ima zaseban `te2FinalData`; BI radi `Object.assign(M1,M2)`).

## Economics in Hospitality (2. god) — intake & nalaz (2026-06-09)
Folder: `2. godina Hospitaliy Managament/Economics of hospitality` (svi PDF, čista ekstrakcija teksta).
Intro (`1 Introductory information 2026.pdf`) = silabus: **T7 = 1. midterm, T13 = 2. midterm** → **1. kolokvij =
T2–T6 = Unit 1–5**, 2. kolokvij = Unit 6–10 (Unit 6–10 imaju i „add" verzije). Kolegij: K. Mikinac, FTHM, sem IV, 9 ECTS.

**1. kolokvij ✅ GOTOVO (Sesija 27).** Postojeći `data-econ-hospitality.js` (5 jedinica) imao **točnu strukturu** ali
**pretanak sadržaj** (~15–25% slajdova; U3/U4/U5 = 48–55 slajdova). Rebuild iz izvora → **73 fc / 46 quiz / 36 fill** +
bogat learn. Catalog opis 1. kolokvija ispravljen (bio pogrešno „seminarski").

**2. kolokvij ✅ GOTOVO (Sesija 28).** Unit 6–10 (teme T8–T12: business result, success & KPIs, price policy, sales,
investment profitability) → novi `data-econ-hospitality-m2.js` (`economicsHospitalityM2Data`, 5 kat., **75 fc / 50 quiz /
40 fill**). Pročitane i glavne i „add" prezentacije (KPI formule iz „add": ADR/RevPAR/TRevPAR/GOP/GOPPAR/NOP/EBITDA).

**Finalni ✅ GOTOVO (Sesija 29).** Hibrid `data-econ-hospitality-final.js` = `Object.assign({}, m1, m2, { examPractice })`
→ 11 kat. / 162 fc / 106 quiz / 84 fill (10 jedinica + cross-topic Exam Practice). Catalog: lekcija `final`, script zadnji,
`resolve.final`. → **Economics in Hospitality 100% KOMPLETAN (K1 + K2 + finalni).** Napomena: postoji i zaseban folder
`seminar Hospitality economics` (seminarski dio, drugačiji od predavanja) — nije obrađen.

## Tourism Geography (2. god) — intake & nalaz (2026-06-09)
Folder: `2. godina Hospitaliy Managament/Tourism Geography` (svi PDF, čista ekstrakcija teksta — PPT-export, sažeti slajdovi).
Prof. H. Grofelnik. **Podjela kolokvija iz imena datoteka + silabusa (prez. 0):** 1. kolokvij = „Introduction to Geography +
Tourism Geography of Croatia" (prez. **0–6**: `0 Welcome`, `1 Introduction`, `2–6 HM-TG`); 2. kolokvij = „Tourism Geography
of the World" (prez. **7–12**, oznaka `_2K_`). Bodovi: 1.K 20 + 2.K 20 + slijepa karta 10 + seminar 20 + finalni 30; testovi =
10 pitanja (5 zatvorenih + 5 otvorenih).

**1. kolokvij ✅ POPRAVLJEN (Sesija 30).** Pregled je pokazao da **statistike NISU pogrešne** (sve doslovno sa slajdova prez. 3:
GDP 23.200 EUR/80%, 170.723 dozvole, 31%/31%, Top 10 noćenja 2024), nego da je **falio konceptualni uvod**. Izmjene u
`data-geography.js`: + nova kategorija `introToGeography` (prez. 1); `croatiaFeatures` prepisan vjerno prez. 2+3;
`protectedAndTouristRegions` dopunjen prez. 4–6 (okvir zaštite 9 kat./5.930 km²/10,1%; statistika 2017; planinska +
istočno-slavonska regija). **Slijepa karta (`blindMapDrill`) i `examFramework` NETAKNUTI** (uputa korisnika). Geografija
sad = 6 kat. / 58 fc / 72 quiz / 43 fill. Verify 0, Playwright 36/36, `CONTENT_VERSION` 20260616.

**2. kolokvij ⬜ TODO.** Prez. 7–12 (`_2K_` = svjetska turistička geografija) → novi sibling `data-geography-m2.js`
(`geographyM2Data`), catalog `second-midterm` resolve + ukloniti coming-soon. Slijepa karta ostaje vezana uz 1. kolokvij.

## Struktura mapa (gitignored)
```
_materials/
  year-1/
    microeconomics/
      midterm-1/  01_intro.pdf  02_demand.pdf ...
      midterm-2/  ...
      final/      ...
    macroeconomics/ ...
  year-2/ ...
```
- **Po predmetu → po kolokviju (k1 / k2 / završni).** Ovo je ključno: samo TI znaš koja
  prezentacija ide u koji kolokvij (iz silabusa) — označi to mapom ili porukom.
- `NN_` prefiks za redoslijed; jedna prezentacija = jedan fajl.

## Tok rada
1. Ti složiš materijale po gornjoj strukturi (ili samo pošalješ putanju + koji su za koji kolokvij).
2. `npm run scaffold -- <id> "<Naziv>" <godina> <semestar>` (kostur predmeta).
3. Ja pročitam materijale i generiram flashcards/quiz/fill/learn po `CONTENT_SCHEMA`.
4. `npm run verify` + pregled (ti potvrdiš točnost, pogotovo formule).
5. Deploy uz bump `?v=` (vidi [[css-cache-bump-version]] princip).
