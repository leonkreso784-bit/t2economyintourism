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
- **1. kolokvij = T1–T8.** ⚠ Postojeći `data-marketing.js` ima samo 5 tema (T1,T2,T3,T5,T6) →
  **FALE T7 (Product) i T8 (Price)** → korisnik potvrdio: **dodati ih u 1. kolokvij**.
- **2. kolokvij = T9–T13** (4 PDF-a: `TJ 9_The distribution` 27str · `10_The promotion` 33 ·
  `11_New trends…` 31 · `12_13_Planning_Organizing_Controlling…` 27). Popunjava „second-midterm" (sad coming-soon).
- **Finalni = spoj K1 (potpun T1–T8) + K2** (kao BI final). **Finalni = NOVA lekcija** u catalogu.

**Redoslijed rada (ciglu po ciglu, verify + Playwright + pregled nakon svake):**
1. T7 + T8 → postojeći 1. kolokvij (`data-marketing.js`).
2. 2. kolokvij T9–T13 (nova `marketingData` 2. kolokvija; ukloniti coming-soon).
3. Finalni (nova lekcija; merge K1+K2).
**Catalog sad:** marketing ima `first-midterm` (✅) + `second-midterm` (coming-soon). Provjeri kako su drugi
predmeti riješili „final" (te2 ima zaseban `te2FinalData`; BI radi `Object.assign(M1,M2)`).

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
