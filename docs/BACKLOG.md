# Backlog — parkiralište ideja

> Ovdje skupljamo ideje da se ne izgube. Nije obaveza — kad ideja sazri, seli se u
> [ROADMAP.md](ROADMAP.md) kao milestone/korak. Prioritet: 🔥 visok · ➖ srednji · 💤 nekad.

## ✅ GOTOVO (2026-06-13) — Auth prelazak na email+lozinku
**Implementirano po dogovoru od 2026-06-12** (detalji: `docs/PROGRESS.md` 2026-06-13 + `docs/BACKEND.md` §Staza B):
email+lozinka (signUp/signInWithPassword), email potvrda obavezna, magic-link UKLONJEN, ime pri registraciji
(`display_name`, na profilu i nav gumbu), Forgot/Change password, pravne stranice ažurirane. Baza nepromijenjena.
**Ručni korak korisnika:** Supabase dashboard → Auth → Providers → Email → min duljina lozinke 8.
**Deploy gate i dalje vrijedi** (push tek uz potvrdu korisnika).

**Ostaje za kasnije:**
- **Google login** (uz lozinku; treba korisnikov OAuth client u Google Cloud Consoleu).
- **Onboarding anketa pri ulasku u sustav** — korisnikova ideja (2026-06-12); veže se na budući backend za izradu
  sadržaja iz PDF prezentacija (admin/ingest alati).

## ▶ AKTIVNO — Sadržaj 2. god (sem 1): restruktura na K1 / K2 / finalni  🔥
**Status (2026-06-13):** semestar 2 = **4/4 KOMPLETNO**. Semestar 1: **3/4 gotovo** — **Accounting ✅** (3 lekcije + jedinstveni
reusable Exercises sustav, 41 vježba; vidi `docs/EXERCISES_ENGINE.md`), **Tourism Economics `te2` ✅** (restrukturiran + rebuild iz
PDF predavanja, LIVE) i **E-Business ✅** (2026-06-13: split starog vjernog sadržaja + obogaćivanje iz 14 PDF predavanja; finalni
**15 kat / 152 fc**; lokalno, čeka deploy). **▶ PREOSTAO SAMO Entrepreneurship** — folder materijala
(`…/Entrepreneurship and Innovation`) **PRAZAN** → **čeka da korisnik pošalje PDF-ove/silabus.**
**⚠️ Korisnik je ZASIĆEN računovodstvom (2026-06-12) — ne vraćati se na Accounting (ni Final-tab ni USAR/USALI klasifikaciju) osim izričito.**

**Obrazac (kao Marketing/Geo/F&N):** po predmetu — utvrditi K1/K2 granicu iz silabusa/materijala → sadržaj podijeliti
na `first-midterm` (K1) + `second-midterm` (K2) → **finalni = hibrid** `Object.assign({}, K1, K2, { examPractice })`
(učitava se ZADNJI). Catalog: 3 lekcije + 3 scripta + `resolve`. Bump `CONTENT_VERSION` + `catalog.js`/`content-loader.js`
`?v=`. Verify + strukturni validator + Playwright (+ ciljani render testovi K2/finalni). **Treba: izvorni materijali +
silabus po predmetu.** (Napomena: ADR-006 „ne preslagivati stare root-predmete do Bloka B" — ova odluka to nadjačava
za sadržajno upotpunjavanje; migracija u bazu i dalje ide JEDNOM u Bloku B.)

| Predmet | sem | Trenutno (lekcije → podaci, kategorija/flashcards) | Što treba |
|---|---|---|---|
| ~~**Tourism Economics** (`te2`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** `first-midterm`/`second-midterm`/`final` (`data/te2/`, te2M1/te2M2/te2Final); finalni **11 kat / 135 fc / 94 quiz / 66 fill** | ✅ Restrukturirano + **REBUILD iz 10 PDF predavanja** (2026-06-12): K1=Units 1–6 (5 kat, +nova `forecasting`), K2=Units 7–12 (5 kat) + `examPractice`. Ispravljena činjenica (price = najkritičnija). Lokalno, čeka deploy |
| **Entrepreneurship** (`entrepreneurship`) | 1 | 1 blok (`entrepreneurshipData`, 11 kat/92 fc) prikazan pod 2 imena lekcije (obje **iste**) | Podijeliti sadržaj na K1/K2; izgraditi finalni hibrid (3 zasebne lekcije) |
| ~~**Accounting** (`accounting`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`accountingM1`/`accountingM2`/`accountingFinal`) + **41 interaktivna vježba** (`data/accounting/exercises.js`) | ✅ Restrukturirano + Exercises sustav (2026-06-12, LIVE `a6b6fb0`). Opcionalno: Final exercises-tab, USAR/USALI klasifikacija (treba answer-key) |
| ~~**E-Business** (`ebusiness`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`ebusinessM1`/`ebusinessM2`/`ebusinessFinal`, `data/ebusiness/`); finalni **15 kat / 152 fc / 124 quiz / 75 fill** | ✅ Split (stari sadržaj VJERAN predavanjima — iznimka od te2-pouke) + obogaćen iz 14 PDF-ova (+23 fc; SEO 3→4 fix). K1=Units 1–7, K2=Units 8–15. Lokalno, čeka deploy |

**⚠️ Pouka iz te2 (2026-06-12):** puki **SPLIT postojećeg** tankog sadržaja daje premalo (te2 split = 72 fc → korisnik
javio da je premalo i staro). Zato je te2 **rebuildan IZ PROFESORSKIH PREDAVANJA** (10 PDF-ova → 135 fc, + ispravljena
činjenična greška u starom sadržaju). **Za Entrepreneurship/E-Business isto: raditi iz materijala, ne preslagivati stari
tanki blok.** Stoga **OBA trebaju izvorne PDF-ove/silabus od korisnika** (folderi su trenutno prazni) prije početka.

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
