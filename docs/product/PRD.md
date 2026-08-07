# PRD — Sokrat Study

**Status:** živi dokument · **Verzija PRD-a:** 0.4 · **Zadnja izmjena:** 2026-07-15

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

## 3. Što platforma danas radi

> **Ovdje NEMA kronologije ni brojeva verzija** — to je posao [records/HISTORY.md](../records/HISTORY.md) i
> [records/CHANGELOG.md](../records/CHANGELOG.md). Ovaj dokument opisuje **proizvod**, ne put do njega.
> Stanje pojedinih predmeta: [subjects/README.md](../subjects/README.md).

- **Učenje iz javnog kataloga** — hijerarhija fakultet → smjer → godina → semestar → predmet → lekcija;
  modovi **Learn · Flashcards · Quiz · Fill · Exercises · Progress**, KaTeX za kvantitativne predmete.
- **Račun i napredak** — prijava e-mailom, napredak se sinkronizira između uređaja, profil + GDPR.
- **Autorstvo javnog sadržaja** — Studio editor za administratore; svaka objava je atomična i verzionirana.
- **Osobno gradivo** — prijavljen korisnik gradi **vlastito ugniježđeno stablo** i u njemu piše gradivo;
  privatno, bez objave na javni katalog.
- **Radi bez mreže** (Service Worker), dvojezično sučelje HR/EN.

> ⚠️ **Poznata rupa:** u osobnom gradivu se zasad može pisati samo Learn — **kartice, kviz i dopune
> se ne mogu napraviti od nule, niti se iz vlastitog gradiva može učiti.** Vježbe nisu ni definirane.
> To je predmet sljedeće faze; definicija s kriterijima prihvaćanja slijedi u ovoj mapi.

## 4. Opseg po fazama
- **Faza 0 (✅ GOTOVA + platforma-first pregradnja F0–F3 LIVE):** data-driven katalog (✅ A1–A3) + hijerarhijska navigacija/redizajn (M0.5) +
  backend **Supabase** (read-path anon+RLS, ADR-011; migracija datoteka→baza kroz F4 flip). Hijerarhija fakultet→smjer→godina→semestar→predmet. **Nastavak = F4 CRUD → U-staza (`EDITOR_PLAN.md`) → F5/F6 → UGC.**
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
