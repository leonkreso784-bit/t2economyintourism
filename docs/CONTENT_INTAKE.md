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

## ⚠️ Matematika / formule — najveći rizik
Formule (eksponenti, razlomci, indeksi) najlakše se iskvare iz slika. Za Math:
- preferiraj **PDF s pravim tekstom**; ako je samo slika, očekuj da ja transkribiram
  formule i **ti ih obavezno pregledaš**;
- po potrebi ključne formule napiši ručno (tekst) uz slajd.

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
