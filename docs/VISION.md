# VISION — dugoročni proizvod (full-stack)

> **Svrha:** sačuvati cijelu dugoročnu viziju na jednom mjestu da se ne izgubi i da je
> planiramo **odluku po odluku** (ne sve odjednom). Ovo je *živi* dokument i namjerno
> NE pokušava sve isprojektirati do kraja — kad se neka odluka donese, seli se u
> [DECISIONS.md](DECISIONS.md) kao ADR, a konkretni koraci u [ROADMAP.md](ROADMAP.md).
>
> Povezano: [PRD.md](PRD.md) (faze), [BACKEND.md](BACKEND.md) (Supabase+Vercel),
> [BACKLOG.md](BACKLOG.md) (ideje), [ARCHITECTURE.md](ARCHITECTURE.md) (model podataka).

## 1. Vizija u jednoj rečenici
Od statičke skripte za jedan smjer → platforma na kojoj korisnici uče, pretvaraju
**svoje** materijale (PDF/Word) u interaktivno gradivo uz AI, dijele ga, natječu se na
kvizovima i (opcijski) plaćaju AI tutora.

## 2. Funkcije koje korisnik želi (uhvaćeno 2026-06-03)
| # | Funkcija | Faza | Status |
|---|----------|------|--------|
| F1 | **AI tutor po predmetu** — pita/objašnjava; pristup plaćanjem (~5 € / 100–200 „jedinica") | 1/4 | ⬜ ideja |
| F2 | **Računi/profili** — prijava, vlastiti profil | 1 | ⬜ ideja |
| F3 | **UGC:** upload PDF/Word → AI izradi gradivo na stranici | 1 | ⬜ ideja |
| F4 | **Dijeljenje** — objavi svoj „rad", drugi rješavaju njegove kvizove | 2 | ⬜ ideja |
| F5 | **Natjecanje/društveno** — ljestvice, tko je koliko uspješan, statistika | 3 | ⬜ ideja |
| F6 | **„Donesi svoj API ključ"** — vlastiti ključ → vlastiti AI tutor (trošak na korisniku) | 1/4 | ⬜ ideja |

Sve je u skladu s postojećim **Fazama 1–4** iz [PRD.md](PRD.md) i idejama u [BACKLOG.md](BACKLOG.md).

## 3. Ovisnosti — što o čemu ovisi (kritični put)
```
[ Frontend data-driven (✅ gotovo) ]
            │  lazy-loading = "šav" (loadSubjectContent → kasnije /api)   ← RADIMO SAD
            ▼
[ TEMELJ: Supabase + Auth + /api ]   ← ništa korisničko ne radi bez ovoga
   ├── F2 Računi/profili            (Supabase Auth)
   ├── F1/F6 AI tutor               (najprije F6 "tvoj ključ" = bez troška/PDV-a za nas)
   ├── F3 UGC upload → AI gradivo   (Storage + ingest pipeline + ljudski pregled)
   ├── F4 Dijeljenje                (privatno→javno, biblioteka, moderacija)
   └── F5 Natjecanje/ljestvice      (scores u DB, anti-cheat na serveru)
```
**Zaključak:** prvi „pravi" korak prema svemu = **Backend + Auth (Blok B)**. Današnji
lazy-loading je upravo taj šav (vidi B8 u [BACKEND.md](BACKEND.md)).

## 4. Gating-odluke (OVO je teški dio, ne funkcije)
Svaka je otvorena; rješavamo ih jednu po jednu i tad upisujemo ADR.

1. **Kontrola AI troška** *(najveći financijski rizik)*
   - Problem: neograničeno korištenje = neograničen račun.
   - Smjer: jeftin model po defaultu · **kapiran kontekst** · keširano gradivo predmeta ·
     kvote/„jedinice" · **F6 „tvoj ključ" prvo** (trošak na korisniku).
   - Otvoreno: izmjeriti **stvarni trošak po jedinici** PRIJE fiksiranja cijene (5 €/100–200).

2. **Plaćanje + EU/HR PDV**
   - Stripe = standard, ali PDV u EU komplicira solo-developeru.
   - Smjer za razmotriti: **Merchant-of-Record** (Paddle / Lemon Squeezy) — preuzmu PDV/račune.
   - Otvoreno: MoR vs Stripe; jednokratna kupnja „jedinica" vs pretplata; povrati za digitalno.

3. **Autorska prava + moderacija (UGC)** *(često potcijenjeno)*
   - Rizik: upload profesorskih PDF-ova + javno dijeljenje = povreda autorskih prava.
   - Smjer: ToS („imam prava na materijal") · **privatno po defaultu** · prijava/uklanjanje ·
     možda dijeliti samo AI-derivat, ne original.

4. **Sigurnost / zloupotreba**
   - API ključ NIKAD u browseru → sve preko `/api`; ključevi enkriptirani u bazi.
   - Rate-limit; oprez na **prompt-injection** iz uploadanih dokumenata u tutora.
   - Supabase RLS (row-level security) da korisnik vidi samo svoje (+ javno).

5. **Anti-cheat (ljestvice)**
   - Bodovi se računaju/validiraju **na serveru**, ne vjeruje se klijentu.

6. **Tvoj kapacitet (solo, višemjesečno)**
   - Pravilo: proizvod **radi i koristan je nakon svakog koraka** (nema „velike eksplozije").

## 5. Monetizacija (sažeto; detalji [BACKLOG.md](BACKLOG.md) §Monetizacija)
- **Najjeftinije/najsigurnije prvo:** F6 „donesi svoj ključ" (nula troška/PDV-a za nas, pravi MVP).
- Kasnije: plaćene „jedinice" AI tutora (tek nakon mjerenja troška), freemium, (kasnije) reklame.
- Pravilo iz ADR-a: **naplaćuj funkcionalnost, ne sadržaj** (autorska prava).

## 6. Predloženi redoslijed (visoka razina — NE radimo sve sad)
1. **Lazy-loading sadržaja** (A4) — šav prema backendu. ← *trenutni zadatak*
2. **Blok B: Supabase + Auth + `/api`** — temelj (vidi [BACKEND.md](BACKEND.md)).
3. **F6 AI tutor „tvoj ključ"** — najjeftiniji MVP AI vrijednosti.
4. **F2 profili** → **F3 UGC upload→AI** (privatno) → **F4 dijeljenje** → **F5 ljestvice**.
5. **F1 plaćeni AI tutor + plaćanje** — tek kad je trošak izmjeren i odluka o MoR/PDV donesena.

## 7. Dokumenti koje ćemo dodati kad njihova faza dođe (da ne stvaramo prazne ljuske sad)
- `SECURITY.md` — kad krene backend/auth (ključevi, RLS, rate-limit, prompt-injection).
- `DATA_MODEL.md` — kad krene Blok B (detaljna schema; sad živi u [ARCHITECTURE.md](ARCHITECTURE.md)).
- `AI_PIPELINE.md` — kad krene F3 (PDF→ekstrakcija→Claude→draft→pregled→publish).
- `MONETIZATION.md` — kad odlučimo plaćanje (cijena/jedinice, MoR vs Stripe, PDV).
