# PRD — Sokrat Study

**Status:** živi dokument · **Verzija PRD-a:** 0.3 · **Zadnja izmjena:** 2026-06-24

## 1. Vizija
Sokrat Study je platforma za učenje koja studentima pretvara nastavne materijale
(PPT/PDF profesora) u interaktivne skripte: gradivo, flashcards, kvizove i
fill-in-the-blank vježbe. Kreće s jednim fakultetom (FMTU Opatija), širi se na
cijelo sveučilište i druga sveučilišta, te kasnije omogućuje korisnicima da sami
generiraju i dijele skripte te se natječu.

## 2. Korisnici
- **Student (primarni):** uči za kolokvije/ispite; želi brzo, mobilno, besplatno.
- **Admin/autor (ja, Leon):** dodaje predmete i sadržaj, održava kvalitetu.
- **(Faza 1+) Korisnik-autor:** uploada svoj materijal i radi privatne skripte.
- **(Faza 4) Pretplatnik:** plaća premium funkcionalnosti.

## 3. Trenutno stanje (2026-06-24)
- Statički sajt (HTML/CSS/vanilla JS), live na Vercelu (sokratstudy.com). Data-driven katalog + drill-down nav + landing rebuild.
- Sadržaj: **2. god = 8/8 ✅** + **1. god = 9/9 ✅** (BI, SIT, Management, Microeconomics, Statistics, Macroeconomics, Academic Writing, Traffic in Tourism, **Mathematics** — zadnji, LIVE 2026-06-27). ⛔ Intro to Hospitality blokiran (nema PDF-ova).
- Modovi: Learn, Flashcards, Quiz, Fill, **Exercises** (interaktivne, auto-ocjenjive, 7 tipova uklj. „napiši citat"), Progress (+ Blind Map za geografiju). **KaTeX** za kvantitativne.
- **Auth + cloud-sync** napretka LIVE (email+lozinka). **Blok B read-path:** sadržaj se čita iz Supabasea (anon key + RLS) s file-fallbackom (ADR-011).
- **Generator predmeta** (ADR-010): PDF→Sonnet→`data/*.js`, jeftino dodavanje. Alati: `verify`, `validate:content`, `test:unit`, `test:responsive` (Playwright), `scaffold`, `pdf-text`, `build/generate/assemble-subject`, `migrate-content`.
- **Sljedeće:** sadržaj 1.+2. god GOTOV → admin CRUD (B9/B10) · AI tutor · MATURA prep · pa Faza 1 (UGC/AI).

## 4. Opseg po fazama
- **Faza 0 (u tijeku):** data-driven katalog (✅ A1–A3) + hijerarhijska navigacija/redizajn (M0.5) +
  backend **Vercel Functions + Supabase** (Blok B) uz migraciju datoteka → baza JEDNOM.
  Hijerarhija fakultet→smjer→godina→semestar→predmet. Bez novih korisničkih funkcija.
- **Faza 1:** UGC MVP — korisnik uploada PDF/PPT → AI radi privatnu skriptu. Kvote troška.
- **Faza 2:** dijeljenje — javna biblioteka, pretraga, kopiranje tuđih skripti.
- **Faza 3:** natjecanje + društveno — ljestvice, profili, statistika učenja, anti-cheat.
- **Faza 4:** monetizacija — freemium/paywall na funkcionalnosti (ne na sadržaju).

## 5. Funkcionalni zahtjevi (Faza 0)
- F0-1: Katalog kao jedinstveni izvor istine za predmete/hijerarhiju.
- F0-2: Postojeći UI radi identično nakon migracije na katalog.
- F0-3: Sadržaj predmeta se učitava lijeno (lazy), ne sve odjednom.
- F0-4: Backend (Supabase) drži katalog + sadržaj; admin može uređivati.
- F0-5: Navigacija prikazuje hijerarhiju smjer/godina/semestar.

## 6. Ne-funkcionalni zahtjevi
- Mobile-first, radi offline za objavljene predmete (PWA).
- Prvo učitavanje brzo i na slabom mobitelu (kritično za skaliranje na 100+ predmeta).
- Trošak blizu nule dok je publika mala.

## 7. Ne-ciljevi (zasad)
- Nema korisničkog uploada do Faze 1.
- Nema naplate do Faze 4 (i tek na skali).
- Nema sustava uloga — jedini autor sam ja.

## 8. Mjere uspjeha
- Faza 0: svih 8 predmeta migrirano, app radi identično, prvo učitavanje brže.
- Dugoročno: ~1000 MAU s kompletnim sadržajem mog fakulteta.

## 9. Rizici (vidi i ARCHITECTURE/DECISIONS)
- AI trošak kad ga vode korisnici → kvote, "donesi svoj API ključ".
- Moderacija UGC-a i autorska prava na profesorske materijale.
- Anti-cheat na natjecanju.
