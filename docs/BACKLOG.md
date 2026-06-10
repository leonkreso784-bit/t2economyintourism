# Backlog — parkiralište ideja

> Ovdje skupljamo ideje da se ne izgube. Nije obaveza — kad ideja sazri, seli se u
> [ROADMAP.md](ROADMAP.md) kao milestone/korak. Prioritet: 🔥 visok · ➖ srednji · 💤 nekad.

## ▶ AKTIVNO — Sadržaj 2. god (sem 1): restruktura na K1 / K2 / finalni  🔥
**Status (2026-06-10):** semestar 2 = **4/4 predmeta KOMPLETNO** (K1+K2+finalni: Economics in Hospitality,
Marketing, Tourism Geography, Food & Nutrition). Semestar 1 = **4 predmeta** (stari root `data-*.js`) imaju sadržaj,
ali NISU u standardnoj strukturi „dva kolokvija + završni". **Potvrđeno (korisnik 2026-06-10): svi realno imaju
2 kolokvija + finalni** → treba ih dovesti na isti standard kao sem-2.

**Obrazac (kao Marketing/Geo/F&N):** po predmetu — utvrditi K1/K2 granicu iz silabusa/materijala → sadržaj podijeliti
na `first-midterm` (K1) + `second-midterm` (K2) → **finalni = hibrid** `Object.assign({}, K1, K2, { examPractice })`
(učitava se ZADNJI). Catalog: 3 lekcije + 3 scripta + `resolve`. Bump `CONTENT_VERSION` + `catalog.js`/`content-loader.js`
`?v=`. Verify + strukturni validator + Playwright (+ ciljani render testovi K2/finalni). **Treba: izvorni materijali +
silabus po predmetu.** (Napomena: ADR-006 „ne preslagivati stare root-predmete do Bloka B" — ova odluka to nadjačava
za sadržajno upotpunjavanje; migracija u bazu i dalje ide JEDNOM u Bloku B.)

| Predmet | sem | Trenutno (lekcije → podaci, kategorija/flashcards) | Što treba |
|---|---|---|---|
| **Tourism Economics** (`te2`) | 1 | 2 lekcije: „Exam Preparation" (`studyData`, 6 kat/46 fc) + „Final Test Preparation" (`te2FinalData`, 9 kat/59 fc) | Provjeriti pokriva li to K1 vs ostatak; preslagati u K1 + K2 + finalni hibrid |
| **Entrepreneurship** (`entrepreneurship`) | 1 | 1 blok (`entrepreneurshipData`, 11 kat/92 fc) prikazan pod 2 imena lekcije (obje **iste**) | Podijeliti sadržaj na K1/K2; izgraditi finalni hibrid (3 zasebne lekcije) |
| **Accounting Theory** (`accounting`) | 1 | 1 lekcija (`accountingData`, 7 kat/124 fc; 7 modul-datoteka u `data/accounting/`) | Mapirati 7 kategorija na K1/K2 (iz silabusa); finalni hibrid |
| **E-Business** (`ebusiness`) | 1 | 1 lekcija („Final Exam Preparation", `ebusinessData`, 14 kat/129 fc; „15 units") | Mapirati 14 kat./15 units na K1/K2; finalni hibrid |

**Napomena o opsegu:** ebusiness/accounting/entrepreneurship već imaju (vjerojatno) sav sadržaj u jednom bloku → dio
posla je **SPLIT postojećeg** (brže, bez pisanja novih flashcards) + izrada kurirane `examPractice`. te2 već ima dvije
datoteke pa prvo treba provjeriti pokrivenost oba kolokvija. **Sve čeka materijale/silabus od korisnika.**

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
- ➖ Automatski testovi (barem za data-access sloj i schemu).
- ➖ Analitika korištenja (privacy-friendly) za odluke o sadržaju.
- 💤 i18n (hrvatski/engleski prebacivanje).
