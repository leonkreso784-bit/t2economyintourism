# VISION — dugoročni proizvod (full-stack)

> **Svrha:** sačuvati cijelu dugoročnu viziju na jednom mjestu da se ne izgubi i da je
> planiramo **odluku po odluku** (ne sve odjednom). Ovo je *živi* dokument i namjerno
> NE pokušava sve isprojektirati do kraja — kad se neka odluka donese, seli se u
> [DECISIONS.md](../records/DECISIONS.md) kao ADR, a konkretni koraci u [ROADMAP.md](../plan/ROADMAP.md).
>
> **▶ AUTORSTVO / UGC / AI-tutor / MCP — razrađena arhitektura i plan: [EDITOR_PLAN.md](../archive/EDITOR_PLAN.md)** (2026-07-09;
> draft→objavi, blokovi+ID-jevi+stil-tokeni, publish-RPC, editor, sigurnosna invarijanta, marketplace/AI skice).
> Funkcije F1/F3/F4/F6 iz tablice niže tamo dobivaju konkretan oblik (H1→H2→H3 horizonti).
>
> Povezano: [PRD.md](./PRD.md) (faze), [BACKEND.md](../architecture/BACKEND.md) (Supabase+Vercel),
> [BACKLOG.md](../records/BACKLOG.md) (ideje), [ARCHITECTURE.md](../architecture/ARCHITECTURE.md) (model podataka).

## 1. Vizija u jednoj rečenici
Od statičke skripte za jedan smjer → platforma na kojoj korisnici uče, pretvaraju
**svoje** materijale (PDF/Word) u interaktivno gradivo uz AI, dijele ga, natječu se na
kvizovima i (opcijski) plaćaju AI tutora.

## 2. Funkcije koje korisnik želi

> ⚠️ **Oznake F1–F6 u ovoj tablici su LOKALNE za ovaj dokument i NISU faze izvedbe.**
> Postojale su još dvije nepovezane „F" ljestvice (platformski temelj i osobni graditelj), što je
> uzrokovalo krive odluke. Ovdje su zadržane samo kao popis želja s izvornim numeriranjem.
>
> ⚠️ **`F3` opisuje DRUGI proizvod od onog koji je izgrađen.** Ovdje piše *„upload PDF → AI izradi
> gradivo"*; isporučeno je nešto drugo — **ručni osobni graditelj** u kojem korisnik sam slaže stablo
> i piše gradivo. AI-put nije napravljen i nije isto. Usklađivanje ide u definiciju proizvoda.

| # | Funkcija | Faza | Status |
|---|----------|------|--------|
| F1 | **AI tutor po predmetu** — pita/objašnjava; pristup plaćanjem (~5 € / 100–200 „jedinica") | 1/4 | ⬜ ideja |
| F2 | **Računi/profili** — prijava, vlastiti profil | 1 | ✅ LIVE (email+lozinka + cloud-sync + Profile) |
| F3 | **UGC:** upload PDF/Word → AI izradi gradivo na stranici | 1 | ⬜ ideja |
| F4 | **Dijeljenje** — objavi svoj „rad", drugi rješavaju njegove kvizove | 2 | ⬜ ideja |
| F5 | **Natjecanje/društveno** — ljestvice, tko je koliko uspješan, statistika | 3 | ⬜ ideja |
| F6 | **„Donesi svoj API ključ"** — vlastiti ključ → vlastiti AI tutor (trošak na korisniku) | 1/4 | ⬜ ideja |

Sve je u skladu s postojećim **Fazama 1–4** iz [PRD.md](./PRD.md) i idejama u [BACKLOG.md](../records/BACKLOG.md).

## 3. Ovisnosti — što o čemu ovisi (kritični put)
```
[ Frontend data-driven (✅ gotovo) + lazy-loading šav (✅) ]
            ▼
[ TEMELJ: Supabase + Auth (✅ LIVE) + read-path sadržaja (✅ ADR-011) ]
   ├── F2 Računi/profili            (Supabase Auth) ✅ LIVE
   ├── F1/F6 AI tutor               (najprije F6 "tvoj ključ" = bez troška/PDV-a za nas)
   ├── F3 UGC upload → AI gradivo   (Storage + ingest pipeline + ljudski pregled)
   ├── F4 Dijeljenje                (privatno→javno, biblioteka, moderacija)
   └── F5 Natjecanje/ljestvice      (scores u DB, anti-cheat na serveru)
```
**Zaključak:** temelj (Backend + Auth) je ✅ **postavljen** (auth+sync LIVE; read-path sadržaja iz baze, ADR-011).
Sljedeći „pravi" koraci prema viziji: **F6 „tvoj ključ" AI tutor** + **F3 UGC** (traže admin/ingest + Storage).

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

## 5. Monetizacija (sažeto; detalji [BACKLOG.md](../records/BACKLOG.md) §Monetizacija)
- **Najjeftinije/najsigurnije prvo:** F6 „donesi svoj ključ" (nula troška/PDV-a za nas, pravi MVP).
- Kasnije: plaćene „jedinice" AI tutora (tek nakon mjerenja troška), freemium, (kasnije) reklame.
- Pravilo iz ADR-a: **naplaćuj funkcionalnost, ne sadržaj** (autorska prava).

## 6. Predloženi redoslijed (visoka razina — NE radimo sve sad)
1. ~~Lazy-loading sadržaja (A4)~~ ✅ · ~~Blok B: Supabase + Auth + read-path~~ ✅ (auth+sync LIVE, sadržaj iz baze ADR-011)
2. ~~dovršiti sadržaj 1. god~~ ✅ · ~~admin CRUD (B9/B10)~~ ✅ **isporučen** (Studio editor, publish-RPC).
3. **F6 AI tutor „tvoj ključ"** — najjeftiniji MVP AI vrijednosti. ← *sljedeći „pravi" korak prema viziji*
4. **F2 profili** → **F3 UGC upload→AI** (privatno) → **F4 dijeljenje** → **F5 ljestvice**.
5. **F1 plaćeni AI tutor + plaćanje** — tek kad je trošak izmjeren i odluka o MoR/PDV donesena.

## 7. Dokumenti koje ćemo dodati kad njihova faza dođe (da ne stvaramo prazne ljuske sad)
- `SECURITY.md` — kad krene backend/auth (ključevi, RLS, rate-limit, prompt-injection).
- `DATA_MODEL.md` — kad krene Blok B (detaljna schema; sad živi u [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)).
- `AI_PIPELINE.md` — kad krene F3 (PDF→ekstrakcija→Claude→draft→pregled→publish).
- ~~`MONETIZATION.md`~~ ✅ postoji od 2026-06-27 ([MONETIZATION.md](./MONETIZATION.md) — modeli, matura-tržište, MoR vs Stripe).
