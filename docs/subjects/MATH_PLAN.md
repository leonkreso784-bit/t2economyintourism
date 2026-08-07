# MATH_PLAN.md — Matematika (1. god) — plan razvoja

> **Status (2026-06-27):** ✅ **K1 + K2 + Final KOMPLETNI i ✅ LIVE (deployano `89fd669..31be03f`)** — `b481be5` (K1) + `c49422a` (K2+Final+exercises-KaTeX) + `4eeccf1` (K1 learn obogaćen + Gauss nijansa) + `31be03f` (docovi).
> **Math = year 1, SEMESTAR 1** (kao Micro/Statistics). **K1 = teme 1–5, K2 = teme 6–11** (granica iz silabusa, potvrdio korisnik). **→ time je 1. GODINA HM 9/9 KOMPLETNA (uz Intro to Hospitality blokiran — nema PDF-ova).**
> **✅ SVE RIJEŠENO (2026-06-27):** (a) **K1 learn obogaćen** — svih 5 sekcija na K2 dubinu (realNumbers 4798 / basicEquations 3907 / functions 4197 / differentiation 3520 / extrema 3184 zn; [[learn-sections-must-be-rich]]); (b) **Gauss vs Gauss-Jordan nijansa** dodana u `gaussJordan` (Gauss = gornji trokut + supstitucija unatrag vs Gauss-Jordan = puna jedinična; „samo retci, ne stupci"; +2 fc/+3 quiz/+3 fill + learn-podsekcija; naziv → „Gauss & Gauss-Jordan Method"); (c) korisnik pregledao formule („sve izgleda odlično"); (d) gate zelen (validate/verify 0/0, test:unit 33/33, Playwright 68/68, KaTeX balans OK) → **pushano/deployano**.
> **✅ Supabase re-sync Math NAPRAVLJEN (2026-06-27, `801d9a6`):** Math gradivo (`mathM1/M2/Final`) je u bazi (čita se iz baze kao ostali predmeti); **vježbe se učitaju iz datoteke** (BUG-012 fix — vježbe = KOD, nikad u bazu).

## 0. STVARNO STANJE (što je izgrađeno)
- **`data/math/midterm-1.js` (`mathM1`):** 5 kat (realNumbers, basicEquations, functions, differentiation, extrema) / 48 fc / 44 quiz / 34 fill. KaTeX, **Learn OBOGAĆEN** (3184–4798 zn, riješeni primjeri + intuicija + zamke; 2026-06-27).
- **`data/math/midterm-2.js` (`mathM2`):** 4 kat (integralElasticity, annuities, loans, **„Gauss & Gauss-Jordan Method"**) / **27 fc / 31 quiz / 27 fill** (Gauss nijansa dodana 2026-06-27). **Learn OBOGAĆEN** (3000–4787 zn, riješeni primjeri + intuicija + zamke).
- **`data/math/final.js` (`mathFinal`):** hibrid `Object.assign({}, mathM1, mathM2, {examPractice})` (ZADNJI) → 10 kat / 79 fc / 79 quiz / 64 fill.
- **`data/math/exercises.js` (`mathExercises`) + `data/math/math-lib.js` (`MathLib`):** **39 vježbi** (26 K1 + 13 K2) na enginu. **28 randomiziranih brute-force verificirano** (72.173 field-checka, 0 problema); financijske formule točne do centa protiv slajdova. math-lib = mali helper (gcd/quadratic/polyEval/polyDeriv), učitan PRIJE exercises.
- **Catalog:** subject `math` (year 1, sem 1, `fa-square-root-variable`/violet `#8b5cf6`), sve 3 lekcije mapirane, `features.exercises:true`. Cache `20260689`.
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
Math se može probati i kroz **generator** ([CONTENT_GENERATOR.md](../workflow/CONTENT_GENERATOR.md)) s `--math` zastavicom (KaTeX upute u promptu), ALI: slike (JPG) generator NE čita (samo PDF/TXT tekst) → ili PDF-verzije, ili ručno. Točnost formula = kritična → bez obzira na put, **ljudski pregled obavezan**. Realno: vjerojatno **hibrid** (generator za teoriju iz PDF-a + ručna transkripcija formula sa slajdova).

---
**▶ Redoslijed (završen):** Traffic in Tourism ✅ → **Math ✅ LIVE 2026-06-27 (zadnji 1. god)** → **1. GODINA HM 9/9 KOMPLETNA**. Intro to Hospitality = nema materijala (blokiran). Vidi [content-roadmap-sequencing] + [ROADMAP.md](../plan/ROADMAP.md).
