# MATH_PLAN.md — Matematika (1. god) — plan razvoja

> **Status (2026-06-26):** 🟡 **K1 + K2 + Final IZGRAĐENI i COMMITANI lokalno (NEdeployano)** — `b481be5` (K1) + `c49422a` (K2+Final+exercises-KaTeX).
> **Math = year 1, SEMESTAR 1** (kao Micro/Statistics; korisnik nije osporio). **K1 = teme 1–5, K2 = teme 6–11** (granica iz silabusa, potvrdio korisnik).
> **PENDING (nakon compacta 2026-06-26):** (a) **K1 learn obogaćivanje** (5 sekcija pretanke, 1654–2790 zn → udžbenička dubina kao K2, [[learn-sections-must-be-rich]]); (b) **Gauss vs Gauss-Jordan nijansa** (Leonova prezentacija uči Gauss/gornje-trokutastu + „samo retci, ne stupci"); (c) korisnikov pregled svih formula; (d) finalni gate + push.

## 0. STVARNO STANJE (što je izgrađeno)
- **`data/math/midterm-1.js` (`mathM1`):** 5 kat (realNumbers, basicEquations, functions, differentiation, extrema) / 48 fc / 44 quiz / 34 fill. KaTeX, learn ⚠️ JOŠ TANAK (treba obogatiti).
- **`data/math/midterm-2.js` (`mathM2`):** 4 kat (integralElasticity, annuities, loans, gaussJordan) / 25 fc / 28 quiz / 24 fill. **Learn OBOGAĆEN** (3000–4787 zn, riješeni primjeri + intuicija + zamke).
- **`data/math/final.js` (`mathFinal`):** hibrid `Object.assign({}, mathM1, mathM2, {examPractice})` (ZADNJI) → 10 kat / 79 fc / 79 quiz / 64 fill.
- **`data/math/exercises.js` (`mathExercises`) + `data/math/math-lib.js` (`MathLib`):** **39 vježbi** (26 K1 + 13 K2) na enginu. **28 randomiziranih brute-force verificirano** (72.173 field-checka, 0 problema); financijske formule točne do centa protiv slajdova. math-lib = mali helper (gcd/quadratic/polyEval/polyDeriv), učitan PRIJE exercises.
- **Catalog:** subject `math` (year 1, sem 1, `fa-square-root-variable`/violet `#8b5cf6`), sve 3 lekcije mapirane, `features.exercises:true`. Cache `20260688`.
- **⚙️ ENGINE PROMJENA (js/exercises.js):** dodani 4 čuvana `renderMath()` poziva nakon mounta → **exercises sad renderiraju KaTeX** (prije: sirovi `\(...\)`). Currency-safe + no-op za tekstualne predmete; Statistics/Accounting verificirano netaknuti. Aditivno, 0 promjena tipova vježbi. [[accounting-exercises-engine]]
- **Pokrivenost lekcija (korisnik javio da su prezentacije PRAVE lekcije, ne seminari):** svih 9 deckova (1–6,8,9,11) + 4 prezentacije-lekcije (Application of derivations, Composite derivations, Integrals Belyaeva, Gauss-Jordan elimination) sadržajno pokriveno. Teme 7,10 ne postoje u folderu.

---
## (izvorni plan — referenca)
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
