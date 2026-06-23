# MATH_PLAN.md — Matematika (1. god) — plan razvoja

> **Status:** ⬜ TODO — **ZADNJI predmet 1. godine** (najveća gustoća formula). Kreće **nakon Traffic in Tourism**.
> Ovo je radni plan; puni cigla-po-cigla raspored se dovršava kad krenemo (kao [STATISTICS_PLAN.md](STATISTICS_PLAN.md)).
> Odluka korisnika (2026-06-24): „posvetit ćemo se ozbiljno matematici, napraviti cijeli math md."

## 1. Materijali (postoje na disku)
Folder: `…/1. godina Hospitality Managament/Math` — **100 JPG + 8 PDF + docx**.
PPT slajdovi (provjereno čitljivi): realni brojevi, funkcije, derivacije, integrali, Gauss-Jordan, ekonomske primjene.
- ⚠️ **JPG-ovi se čitaju vizualno** (Read alat čita slike) → transkripcija formula u LaTeX = glavni rizik → **korisnik OBAVEZNO pregledava matematiku** nakon svake cigle.
- Granica K1/K2 = **iz silabusa** (korisnik javi koje teme idu u koji kolokvij) prije početka.

## 2. Pristup (sve infrastrukture VEĆ postoje)
- **KaTeX (ADR-009) ✅ gotov** — formule kao LaTeX, **currency-safe delimiteri `\( \)` / `\[ \]` / `$$ $$`** (NE jedan `$`). `renderMath()` već zove u sva 4 renderera.
- **Pedagogija = „worked problems"** na postojećim modovima: Learn = teorija + formule + riješeni primjeri korak-po-korak; Flashcards = zadatak→puno rješenje; Quiz = numerički, distraktori = tipične greške; Fill = popuni formulu/korak.
- **Grafovi** (funkcije, tangente, površine ispod krivulje): zasad **croppani slajd / SVG kao slika** u `learn.image` (interaktivni grafovi nisu u schemi).
- **Interaktivne vježbe (opcionalno, kao Statistics/Accounting):** reusable engine (`numeric`/`ratio` + randomizacija `params`+`generate(p)`); matematika ne treba poseban lib osim eventualno malog helpera u `data/math/` (po uzoru na `stat-lib.js`). Engine se NE dira (sveto pravilo).

## 3. Struktura (standard: K1 / K2 / finalni hibrid)
`data/math/` → `midterm-1.js` (`mathM1`) + `midterm-2.js` (`mathM2`) + `final.js` (`mathFinal = Object.assign({}, mathM1, mathM2, {examPractice})`, učitava se ZADNJI). Catalog: novi subject `math` (year 1, semestar = **TBD iz silabusa**), 3 lekcije + scripts + resolve.

## 4. Vjerojatne teme (iz materijala — potvrditi sa silabusom)
Funkcije i grafovi · limesi/neprekidnost · **derivacije** (pravila, primjene: marginalna analiza, ekstremi) · **integrali** (određeni/neodređeni, površina, potrošačev/proizvođačev višak) · **matrice & Gauss-Jordan** (sustavi) · financijska/ekonomska matematika (kamate, anuiteti?) · funkcije više varijabli (ako ima). → Mapiranje na K1/K2 kad korisnik da granicu.

## 5. Gate (kao i ostalo)
`npm run validate:content math` (shema + **KaTeX currency-safe balance**) → `npm run verify` → `npm run test:responsive` (overflow na mobilnom — `.katex-display{overflow-x:auto}`) → (+`test:unit` ako ima vježbi) → **korisnikov činjenični pregled formula**. Cache bump `CONTENT_VERSION` + `?v=`.

## 6. Generator?
Math se može probati i kroz **generator** ([CONTENT_GENERATOR.md](CONTENT_GENERATOR.md)) s `--math` zastavicom (KaTeX upute u promptu), ALI: slike (JPG) generator NE čita (samo PDF/TXT tekst) → ili PDF-verzije, ili ručno. Točnost formula = kritična → bez obzira na put, **ljudski pregled obavezan**. Realno: vjerojatno **hibrid** (generator za teoriju iz PDF-a + ručna transkripcija formula sa slajdova).

---
**▶ Redoslijed do Matha:** Traffic in Tourism (sljedeći) → **Math (zadnji 1. god)**. Intro to Hospitality = nema materijala (blokiran). Vidi [content-roadmap-sequencing] + [ROADMAP.md](ROADMAP.md).
