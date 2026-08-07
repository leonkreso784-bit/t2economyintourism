# PRD — Sokrat Study

**Status:** živi dokument · **Verzija PRD-a:** 0.5 · **Zadnja izmjena:** 2026-08-07

## 1. Vizija
Sokrat Study je platforma za učenje koja studentima pretvara nastavne materijale
(PPT/PDF profesora) u interaktivne skripte: gradivo, flashcards, kvizove i
fill-in-the-blank vježbe. Kreće s jednim fakultetom (FMTU Opatija), širi se na
cijelo sveučilište i druga sveučilišta. **Zvijezda je UGC:** svatko gradi vlastito
gradivo za sebe, a kasnije ga smije dijeliti i natjecati se. FMTU je odskočna daska,
ne opseg — ništa u modelu ne pretpostavlja instituciju, smjer ni godinu.

## 2. Korisnici
- **Student (primarni):** uči za kolokvije/ispite; želi brzo, mobilno, besplatno.
- **Admin/autor (ja, Leon):** dodaje predmete i sadržaj, održava kvalitetu.
- **Korisnik-autor:** gradi **vlastiti privatni materijal** — ručno u editoru; kasnije i preko
  vlastitog AI-a (MCP, ADR-026). **Bilo tko**, ne nužno student FMTU-a.
- **(kasnije) Pretplatnik:** plaća premium funkcionalnosti.

## 3. Što platforma danas radi

> **Ovdje NEMA kronologije ni brojeva verzija** — to je posao [records/HISTORY.md](../records/HISTORY.md) i
> [records/CHANGELOG.md](../records/CHANGELOG.md). Ovaj dokument opisuje **proizvod**, ne put do njega.
> Stanje pojedinih predmeta: [subjects/README.md](../subjects/README.md).

- **Učenje iz javnog kataloga** — hijerarhija fakultet → smjer → godina → semestar → predmet → lekcija;
  modovi **Learn · Flashcards · Quiz · Fill · Exercises · Progress**, KaTeX za kvantitativne predmete.
- **Račun i napredak** — prijava e-mailom, napredak se sinkronizira između uređaja, profil + GDPR.
- **Autorstvo javnog sadržaja** — Studio editor za administratore; svaka objava je atomična i verzionirana.
- **Osobni materijal** — prijavljen korisnik slaže **vlastito ugniježđeno stablo polica** i u materijalu
  gradi kartice, kviz, dopune i learn; **uči iz njega istim ekranima** kao iz kataloga, a napredak mu
  živi u istom profilu. Privatno, bez objave na javni katalog. Definicija i kriteriji prihvaćanja:
  [UGC_SPEC.md](./UGC_SPEC.md).
- **Radi bez mreže** (Service Worker), dvojezično sučelje HR/EN.

> ⚠️ **Što osobni materijal NE nudi:** **vježbe.** Vježba je kôd (`generate()`), a UGC ne autorira kôd —
> tražit će vlastito rješenje i vlastiti spec (ADR-025). **U sučelju se zato ništa o njima ne obećava.**
> Ostali ne-ciljevi (dijeljenje, MCP, mobilni editor na dodir): [UGC_SPEC §4](./UGC_SPEC.md).

## 4. Opseg po fazama

> **Faza ima ime, ne slovo.** Ranija „F" numeriranja (temelj F1–F6, graditelj F0–F5) su **zatvorena**
> i žive samo kao povijest u [archive/](../archive/) i [plan/ROADMAP.md](../plan/ROADMAP.md).

| faza | opseg | status |
|---|---|---|
| **Temelj** | data-driven katalog, hijerarhijska navigacija, Supabase read-path (anon+RLS, ADR-011), CI/CD, offline, monitoring | ✅ |
| **Javni katalog + autorstvo** | sadržaj 22 predmeta, Studio editor za administratore, atomična i verzionirana objava | ✅ |
| **Osobni materijal** | vlastito stablo polica, autorstvo kartica/kviza/dopuna/learna, učenje iz vlastitog materijala, napredak u istom profilu | **u tijeku** — [UGC_SPEC.md](./UGC_SPEC.md) |
| **Frontend redizajn** | sučelje se preuređuje **tek kad funkcija besprijekorno radi** (Leonova presuda) | ⬜ |
| **Objava i dijeljenje + MCP** | materijal se smije podijeliti; vanjski AI gradi materijal preko korisnikovog ključa (ADR-026) | ⬜ |
| **Natjecanje + društveno** | ljestvice, profili, statistika učenja, anti-cheat | ⬜ |
| **Monetizacija** | freemium/paywall na **funkcionalnosti**, ne na sadržaju | ⬜ |

⚠️ **Raniji opis „UGC MVP = korisnik uploada PDF/PPT → AI radi skriptu" je nadglašen.** Izgrađeno je
**ručno autorstvo** u vlastitom stablu; AI dolazi kasnije i to kroz **korisnikov vlastiti** AI (MCP),
ne kroz našu cijev — pa ni kvote troška nisu na nama.

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
- **Nema uploada dokumenata** (PDF/PPT) ni AI-generiranja sadržaja s naše strane — korisnik svoj
  materijal piše sam, a kasnije ga smije graditi **svojim** AI-em (MCP). Upload slika u osobnom
  materijalu postoji i **privatan je** (bucket `node-images`, owner-prefiks).
- Nema naplate dok platforma ne dobije skalu.
- **Nema javnog dijeljenja osobnog materijala** — sve je privatno (ADR-024/025).
- Nema složenih uloga: postoje **vlasnik podatka** (`owner_id = auth.uid()`) i **administrator**
  javnog kataloga (`profiles.role` + `is_admin()`). Sadržajni suradnik radi kroz PR, ne kroz aplikaciju.

## 8. Mjere uspjeha
- **Osobni materijal:** korisnik bez pomoći autora napravi materijal od nule i uči iz njega
  (mjeri se po [UGC_SPEC §2](./UGC_SPEC.md), ne po zelenim testovima).
- **Dugoročno:** ~1000 MAU; katalog prestaje biti uvjet rasta jer korisnik donosi svoj sadržaj.

## 9. Rizici (vidi i ARCHITECTURE/DECISIONS)
- AI trošak kad ga vode korisnici → kvote, "donesi svoj API ključ".
- Moderacija UGC-a i autorska prava na profesorske materijale.
- Anti-cheat na natjecanju.
