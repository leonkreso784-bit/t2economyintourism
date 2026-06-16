# STATISTICS_PLAN.md — teorija + vježbe (cigla-po-cigla plan)

> **Što je ovo:** trajni radni dokument za dvije nadogradnje predmeta **Statistics**:
> **(A)** obogaćivanje **Learn** sekcija pravom teorijom (sad su preformulne) i
> **(B)** dodavanje **Exercises** (interaktivne, auto-ocjenjive vježbe) — na POSTOJEĆI
> reusable engine (isti kao Accounting), uz mali **statistički kernel**.
>
> **Proces (dogovor s korisnikom, 2026-06-15):** radi se **cigla-po-cigla**. Ja odradim
> **JEDNU ciglu** → provjerim sve (verify + node + Playwright) → **STANEM** → korisnik
> pregleda → tek na „nastavi" idem na sljedeću. Polako, pažljivo, pametno.
>
> **Vezano:** [EXERCISES_ENGINE.md](EXERCISES_ENGINE.md) (engine spec — SVETO PRAVILO: engine se ne dira za sadržaj) ·
> [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) · [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md) (presedan). Datum: 2026-06-15.

---

## 0. Polazno stanje (što već postoji)

- **Statistics study gradivo ✅ gotovo + commitano lokalno** (`216e087`+`20a270f`, NEDEPLOYANO): 3 lekcije
  `first-midterm` (T1–T6, 6 kat) / `second-midterm` (T7–T9, 3 kat) / `final` (hibrid, 10 kat). Subject `statistics`
  (year 1, **sem 1**), KaTeX. Datoteke `data/statistics/{midterm-1,midterm-2,final}.js`.
- **Exercises engine ✅ postoji i dokazan** (Accounting, 41 vježba LIVE): `js/exercises-core.js` (graderi + parse/numEq/
  gradeSet/**pickParams**/**seededRandom**), `js/acc-kernel.js` (double-entry — NE treba nam), `js/exercises.js`
  (WIDGET registry, 6 tipova, 3 moda, randomizacija, napredak), `css/exercises.css`. **Engine se NE mijenja za sadržaj.**
- **Izvori (gitignored, ne commitati):** `tmp-stats/` = T1–T9 deckovi + formula-sheet + **midterm answer-keyevi**
  (`mid1-ans`, `mid2-ans`) → zlato za točne worked-example brojeve. Verifikacija odgovora: ručni izračun + **mathportal
  z-score/statistics kalkulatori** (https://www.mathportal.org/calculators/statistics-calculator/) kao cross-check.

---

## 1. Cilj i načela

### TRACK A — Learn teorija (kvaliteta postojećeg gradiva)
**Problem (korisnik):** „u learn sekciji fali teorijskih detalja, samo su formule nabacane; statistika ima velik teorijski dio."
**Cilj:** svaka od 9+1 kategorija dobiva **pravu teoriju** — definicije svojim riječima, intuicija (zašto/kada),
interpretacija rezultata, tipične zamke — uz postojeće KaTeX formule i worked-example. Ne mijenja se schema, samo `learn.content`.
(flashcards/quiz/fill ostaju; mogu se usput dopuniti ako zatreba, ali fokus = `learn`.)

### TRACK B — Exercises (interaktivne vježbe)
**Cilj:** statistika dobiva „Exercises" tab (isti UX kao Accounting) s auto-ocjenjivim, **randomiziranim** zadacima.

**Reusability (SVETO PRAVILO + arhitektonska odluka 2026-06-15, nakon kritičkog pregleda):**
generički engine (`js/exercises-core.js`, `js/exercises.js`, `css/exercises.css`) se **NE DIRA**. **Statistika je 100% u `data/` sloju:**
- `data/statistics/exercises.js` — content pack (svi zadaci).
- `data/statistics/stat-lib.js` — **MINIMALNA** statistička matematika (samo „teško": `normalCdf`, z/t-kritične tablice;
  elementarna aritmetika — mean/SD/z/CI/slope — ide **inline u `solve(p)`**). `module.exports` + `window.StatLib`, node-testabilno.

➡️ **Zašto NE `js/stat-kernel.js` (ispravak prve verzije plana):** `acc-kernel.js` je u `js/` jer ga **sam engine ZOVE**
(journal widget) → mora biti globalno učitan. Statistička matematika je **konzumira samo content pack** u `solve(p)` →
nije engine, nego sadržaj → pripada `data/` i lazy-loada se s predmetom. Time engine ostaje **doslovno 100% nedodirnut**
(čišća, održivija granica; jača priča za buduće kvant. predmete).

**▶ Buduća reusability (Macro/Math):** ako kasnije zatrebaju iste funkcije (`normalCdf`…), `stat-lib.js` se trivijalno
„promovira" u dijeljeni `data/_shared/quant-lib.js`. **Ne gradimo unaprijed (YAGNI)** — promocija je jeftin refactor kad potreba postane stvarna.

**Tipovi koje koristimo (svi VEĆ postoje u engineu):**
- **`numeric`** — glavni konj (izračunaj mean/SD/z/CI/test-stat/slope/R²…); s **randomizacijom** (`params`+`generate`+`solve`).
- **`choice`** (TF/MC) — koncepti (Type I/II, distribucije, definicije, interpretacija).
- **`ratio`** — izračun s prikazanim „givens" (npr. CI iz x̄,s,n; test-statistika iz zadanih veličina).
- **NE koristimo:** `statement`/`classify`/`journal` (računovodstveni, trebaju acc-kernel).

---

## 2. `data/statistics/stat-lib.js` — statistička matematika (content-layer, MINIMALNA, node-testabilno)

Čiste funkcije (bez DOM-a), `module.exports` + `window.StatLib`. Koristi ih SAMO content pack u `solve(p)` / fiksnim odgovorima.
**Načelo: u lib ide samo ono što je teško/dijeljeno; elementarna aritmetika ostaje inline u `solve(p)`** (manja površina = održivije).

**U LIB (teško / vrijedi dijeliti):**
- `normalCdf(z)` (Abramowitz–Stegun aproks.) — za normalne vjerojatnosti P(Z<z).
- Lookup-tablice: `Z` (1.28/1.645/1.96/2.33/2.58 po razini pouzdanosti) i `T_CRIT` za uobičajene (df, α).
- (po potrebi) `binomialP(n,p,x)`, `poissonP(lambda,x)` — faktorijeli/eksponencijale (sklono greškama → centralizirati + testirati).

**INLINE u `solve(p)` (elementarno, ne treba lib):** `mean`, `variance`/`sd`, `cv`, `zScore=(x−mu)/sigma`, `seMean=sigma/√n`,
CI granice `x̄ ± k·SE`, test-statistika `(x̄−μ0)/(s/√n)`, regresija slope/intercept/R² iz zadanih suma. Randomizirani zadaci
biraju SAMO parametre koji daju **čiste/zaokružive odgovore** (kao accounting: life∈{4,5,10}).

**Verifikacija:** `tests/unit/stat-lib.test.js` (isti mali runner kao `exercises-core.test.js`; preko `npm run test:unit`).
Brojevi cross-checkani s **mathportal** kalkulatorima + midterm answer-keyevima. (`stat-lib.js` se učitava preko
`content.scripts` PRIJE `exercises.js` packa — lazy s predmetom; nije globalni `<script>` jer ga engine ne treba.)

### 2a. ⚠ Rani de-risk: parsiranje brojeva (PRIJE sadržaja)
Engineov `parseAmount`/`numEq` građeni su za **novac**. Statistika ima **negativne** (z = −2.64, slope = −0.4) i **sitne decimale**
(p = 0.0336). **Prva tehnička cigla (B0.5) mora node-testom dokazati** da engine ispravno parsira/ocjenjuje te formate.
Ako ne — to je **generička infrastrukturna** dopuna parsiranja (unatrag-kompatibilna, kao što je accounting dodao givens-tablicu),
**ne** domenski hack. Tek kad je parsiranje sigurno, kreće autoriranje sadržaja (B2.x).

---

## 3. Konvencije (preuzeto iz EXERCISES_ENGINE.md §3)
- U DATA svi iznosi su čisti `Number`. Postoci se unose kao **broj** (npr. `95`, ne `0.95`; `35`, ne `0.35`) — `unit:'%'`.
- `numeric` polje: `{key,label,answer,tol,unit,hint}`. **tol po polju** (z: `0.01`, vjerojatnost: `0.001`, novac/cijeli: `0`).
- **Negativni odgovori** (npr. z = −2.64, slope = −0.4): provjeriti da `parseAmount`/`numEq` ispravno gutaju minus
  (B-T0 zadatak; ako treba, rješavamo u content packu, NE u engineu).
- Randomizacija: `params` (pickParams `{min,max,step}`/`{choices:[…]}`) + `generate(p)`→{prompt,givens?,fields,solution} + odgovori iz `solve(p)`.
- 3 moda (practice/exam/walkthrough) — već u engineu, ništa za raditi.

---

## 4. ✅ CIGLA-PO-CIGLA PLAN (nastavi od prve prazne; svaka cigla = STANI za pregled)

> Legenda: `[ ]` todo · `[x]` gotovo. **Nakon SVAKE cigle:** verify 0/0 + (ako dira kod) node testovi + Playwright →
> bump `?v=`/`CONTENT_VERSION` → commit lokalno → **STANI, čekaj korisnikov pregled.** Deploy SAMO uz izričitu potvrdu.

### CIGLA 0 — ovaj plan
- [ ] **S0** Napisati ovaj `docs/STATISTICS_PLAN.md` + dodati u docs-index (README/CLAUDE.md). *Done-kriterij:* plan postoji, korisnik ga pregledao i odobrio redoslijed. **(← TRENUTNA CIGLA — staje ovdje.)**

### TRACK A — Learn teorija (3 cigle; bez koda, samo `data/statistics/*` learn sadržaj)
- [ ] **A1** Obogati `learn` za **K1 #1–3**: describingDataGraphical, describingDataNumerical, probability. Prava teorija
      (definicije, intuicija, interpretacija, zamke) + zadržati formule/worked-example. *Done:* verify 0/0, Playwright 68/68,
      bump CONTENT_VERSION; vizualni pregled na localhost.
- [ ] **A2** Obogati `learn` za **K1 #4–6**: discreteRandomVariables, continuousRandomVariables, samplingDistributions.
- [ ] **A3** Obogati `learn` za **K2 #1–3** (confidenceIntervals, hypothesisTesting, regression) + finalni `examPractice` roadmap.
      *Done A:* sve 10 learn sekcija imaju teorijsku dubinu; finalni hibrid se i dalje slaže.

### TRACK B — Exercises
#### Faza B0 — žica + de-risk (tab se pojavi, parsiranje dokazano)
- [x] **B0** ✅ (`5101dcb`) `data/statistics/exercises.js` (`window.statisticsExercises = {meta:{lang:'en',currency:'',version:1}, exercises:[]}`)
      + catalog: `features.exercises:true`, `content.exercises:'statisticsExercises'`, script dodan. „Exercises" tab vidljiv (prazno
      stanje preko `emptyState()`); ostali predmeti netaknuti; verify 0/0, smoke 13/0, responsive 8/8.
- [x] **B0.5 ⚠ DE-RISK parsiranje** ✅ `tests/unit/stat-parse.test.js` (28 testova; uvršten u `npm run test:unit`). NALAZ: negativne
      (−2.64/−0.4) i ≠3-decimalne (0.0336/0.05) su radile; **rupa = vodeća nula + TOČNO 3 decimale** (`0.576→576`, `0.025→25`,
      `0.001→1`) jer ih je pravilo „3 znamenke iza = grupiranje tisuća" gutalo kao tisuće. **Generička dopuna** `parseAmount`
      (`js/exercises-core.js`): dio prije separatora prazan/same-nule → decimalni i pri 3 znamenke (grupirani broj nikad ne
      počinje nula-grupom; `120.000`→120000 ostaje). Unatrag-kompatibilno: exercises-core + acc-kernel regresija zelena.

#### Faza B1 — statistička matematika (content-layer)
- [x] **B1** ✅ `data/statistics/stat-lib.js` (`window.StatLib`/`module.exports`): `normalCdf` (Abramowitz-Stegun, |err|<7.5e-8) +
      `normalSf`/`normalBetween` + `zCritical`/`zUpper` + `tCritical` (standardna t-tablica df 1–30, ∞→z). Elementarno ostaje inline u
      solve (NIJE dodano binomialP/poissonP — YAGNI, doći će ako zatreba). `tests/unit/stat-lib.test.js` (25 testova, u `npm run test:unit`):
      cross-check standardna z/t tablica + answer-keyevi (P(>1.83)=0.0336, P(>−2)=0.977, empirijsko 68/95%). Ožičen u
      `content.scripts` PRIJE `exercises.js`. **js/ engine NEPROMIJENJEN, 0 novih datoteka u js/.** verify 0/0, test:unit 0, smoke 13/0.

#### Faza B2 — sadržaj po temi (1 tema = 1 cigla; numeric/choice/ratio; vezano na `lesson` + `chapter`-stil tag)
> Obrazac: par konceptualnih (`choice`) + izračunskih (`numeric`/`ratio`), bar 1 **randomizirana** po temi. Odgovori cijeli/zaokruživi.
- [x] **B2.1 (T1–T2 deskriptiva, `first-midterm`)** ✅ 8 vježbi u `data/statistics/exercises.js`: `choice` (10 koncepata: tipovi
      podataka/skale/grafovi/empirijsko-vs-Chebyshev/CV) + statički `numeric` (mean/median/mode/range; var/SD/CV iz learn-primjera)
      + `ratio` (IQR & range iz 5-broj sažetka) + **4 RANDOMIZIRANE** (SD malog niza, CV iz x̄&s, Chebyshev (1−1/k²), class-width ⌈range/k⌉).
      Node-sanity 98/98 (točni 2dp odgovori zeleni kroz 5 seedova, krivi crveni; parseAmount B0.5 nosi decimale). verify 0/0,
      test:unit 0, smoke 13/0, responsive 8/8. Cache `20260656`.
- [x] **B2.2 (T3 probability, `first-midterm`)** ✅ 7 vježbi: `choice` (9 koncepata: sample space, mutually-exclusive≠independent,
      addition/complement/conditional, combinations) + statički `numeric` (addition+complement+conditional; combinations C(n,k))
      + `ratio` (marginal/joint/conditional iz 2×2 cross-tablice) + **3 RANDOMIZIRANE** (addition+P(A|B); combinations). Vjerojatnosti
      = decimale, tol 0.01 (2dp); kombinacije = cijeli, tol 0. **stat-lib proširen `combinations(n,k)`** (faktorijeli „teško/dijeljeno"
      → lib, reuse u T4 binomnoj) + 8 testova (stat-lib 33/33). **SL-most** u `exercises.js` (`window.StatLib` u pregledniku /
      `require('./stat-lib.js')` u nodeu) → content pack koristi lib u oba okruženja. Verifikacija: 180 999 provjera (neovisni
      izračun + grade-correct kroz pun prostor + diskriminacija). verify 0/0, test:unit 0, smoke 13/0, responsive 8/8. Cache `20260658`.
- [ ] **B2.3 (T4 discrete RV, `first-midterm`):** E(X), binomna (μ=nP, σ²=nP(1−P), P(x)), Poisson (P(x), μ=σ²=λ). Numeric randomiziran.
- [ ] **B2.4 (T5 continuous/normal, `first-midterm`):** **z-score** (mathportal!) + normalna vjerojatnost preko z-tablice
      (`normalCdf`). Numeric randomiziran (x,μ,σ → z; P(Z<z)). Cross-check s mathportal z-score kalkulatorom.
- [ ] **B2.5 (T6 sampling distributions, `first-midterm`):** standard error σ/√n, z za x̄, p̂ i z za proporciju, CLT-koncepti. Numeric.
- [ ] **B2.6 (T7 confidence intervals, `second-midterm`):** CI za μ (z & t), CI za proporciju, ME, width=2·ME. `ratio`/`numeric` randomiziran.
- [ ] **B2.7 (T8 hypothesis testing, `second-midterm`):** test-statistika (z/t), odluka (kritična vrijednost / p-value),
      Type I/II (`choice`), test proporcije. Numeric + choice.
- [ ] **B2.8 (T9 regression, `second-midterm`):** slope b1, intercept b0, predikcija ŷ, SST/SSR/SSE, R². `numeric`/`ratio` randomiziran.

#### Faza B3 — finiš
- [ ] **B3.1** Napredak/Progress kartica radi za statistiku (već data-driven preko `features.exercises` — samo provjeriti).
- [ ] **B3.2** Završna provjera (verify + node + Playwright + ciljani render po tipu), docovi (PROGRESS/CHANGELOG/EXERCISES_ENGINE §6 ref),
      memory. Odluka korisnika: **deploy** (zajedno sa study + Track A).

### (KASNIJE, opcionalno) — interaktivni kalkulator-widget
- [ ] **C1** „Stat calculator" inline (z-score / CI / test-stat) à la mathportal — **NOVI widget = engine dodatak**, radi se
      tek ako korisnik želi i kao zasebna, pažljiva faza (rizik: dira generički engine). Zasad: mathportal = vanjski referentni alat.

---

## 5. Pravila procesa (na SVAKU ciglu) — isto kao EXERCISES_ENGINE §5
1. **Additivno + iza flag-a:** dok nije gotovo, app radi identično za sve ostale predmete (Track B iza `features.exercises`).
2. **Engine se NE dira za sadržaj** (0 novih datoteka u `js/`). Statistički sadržaj → `data/statistics/exercises.js`; matematika → `data/statistics/stat-lib.js` (content-layer, lazy preko `content.scripts`).
3. **Cache bump:** svaka izmjena `js/*`/`css/*`/`data/*` → `?v=` u index.html (+ `@import` u styles.css za CSS) + `CONTENT_VERSION`.
4. **Provjere prije commita:** `npm run verify` (0/0) + `npm run test:unit` (ako dira core/kernel) + `npm run test:responsive`.
5. **Commit lokalno OK; deploy SAMO uz izričitu potvrdu.**
6. **Izvori zaštićeni:** `tmp-stats/` gitignored — nikad ne commitati; brojevi se parafraziraju/izračunavaju u data/kernel.
7. **Nakon svake cigle: STANI** i čekaj korisnikov pregled (dogovor 2026-06-15).

---

## 6. Stanje / recovery nakon compacta
- **▶ STANJE 2026-06-15:** napisan plan (S0). Statistics **study gradivo** gotovo+commitano lokalno (`216e087`+`20a270f`),
  **NEDEPLOYANO**. Sljedeće = korisnikov pregled plana → po odobrenju kreće **A1** (ili redoslijed koji korisnik odredi).
- **Engine = nedodirljiv** (`js/exercises-core.js` + `js/exercises.js` + `css/exercises.css`, **0 novih datoteka u `js/`**);
  statistika je 100% u `data/`: `data/statistics/exercises.js` (content pack) + `data/statistics/stat-lib.js` (minimalna matematika,
  lazy preko `content.scripts`). Tipovi: numeric/choice/ratio. Randomizacija: `params`+`generate`+`solve`.
- **z-score/stat kalkulatori (mathportal)** = referentni alat za verifikaciju odgovora (+ buduća inspiracija za C1 widget).
- Provjere: `npm run verify` (0/0), `npm run test:unit`, `npm run test:responsive`. Cache trenutno `20260650` (statistics study).
