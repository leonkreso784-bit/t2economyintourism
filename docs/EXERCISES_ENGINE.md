# EXERCISES ENGINE — sustav vježbi (reusable platform spec + cigla-po-cigla plan)

> **Što je ovo:** trajni radni dokument za izgradnju **generičkog Exercises sustava** (interaktivne, auto-ocjenjive
> vježbe) i njegovog prvog korisnika — **Accounting**. Pisano da **preživi compaction**: §6 je
> checklist s kvačicama — nakon compacta otvori OVAJ fajl i nastavi od prve nezacrtane cigle.
>
> **Vezano:** [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md) (analiza izvora + katalog vježbi) · [ARCHITECTURE.md](ARCHITECTURE.md) ·
> [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md). Datum: 2026-06-10.

---

## 0. Cilj i NEPROMJENJIVO načelo (reusability)

Sustav mora omogućiti da se **kasnije lako dodaju nove vježbe** za:
- isti predmet na **hrvatskom** jeziku,
- **druge predmete** (Matematika, Mikro/Makro, Statistika — kvantitativni, uz KaTeX ADR-009),
- **druge fakultete / smjerove**.

➡️ **Načelo razdvajanja (sveto pravilo):**

| Sloj | Sadrži | Mijenja se kad dodajemo novi sadržaj? |
|---|---|---|
| **ENGINE** (`js/exercises*.js`, `css/exercises.css`) | č​ista mehanika: render tipova vježbi, ocjenjivanje, napredak, UI chrome | **NE** (nikad) |
| **CONTENT PACK** (`data/<subject>/exercises.js`) | svi domenski + jezični podaci: tekstovi, računi, brojevi, rješenja, hintovi, `lang` | **DA** (samo ovdje) |

**Posljedice koje engine MORA poštovati:**
1. **Nula hardkodiranih domenskih stringova** u engineu (nema engl. naziva računa, klasa, tema). Sve iz `data`.
2. **Jezik UI chromea** (gumbi „Check / New numbers / Show solution", feedback) ide kroz mali `I18N` mapper
   ključan po `lang` (default `'en'`; kasnije `'hr'`). `lang` dolazi iz content packa.
3. **Dodavanje novog packa = 3 koraka, 0 koda:** (a) nova `data/<subject>/exercises.js`, (b) catalog unos
   (`features.exercises:true` + `content.exercises:'<var>'` + script), (c) bump `?v=`/`CONTENT_VERSION`.

---

## 1. Arhitektura (datoteke i tok)

```
ENGINE (subject-agnostic)
  js/exercises-core.js   — ČISTE funkcije, bez DOM-a (node-testabilno):
                           parseAmount, formatAmount, numEq, numEqMoney, gradeSet, seededRandom, pickParams
  js/acc-kernel.js       — ČISTI double-entry kernel (za 'journal' tip): postEntries, isBalanced,
                           deriveEndingBalances, classifyTotals  (node-testabilno)
  js/exercises.js        — DOM/UI: initExercises(), render liste, dispatch po type-u, 3 moda, progress
  css/exercises.css      — stilovi (import u styles.css s ?v=)

CONTENT PACK (po predmetu)
  data/<subject>/exercises.js  →  window.<subject>Exercises = { meta:{lang,currency,version}, exercises:[...] }

POVEZIVANJE (data-driven)
  data/catalog.js: subject.features.exercises = true
                   subject.content.exercises   = '<subject>Exercises'   (ime window varijable)
                   subject.content.scripts     += 'data/<subject>/exercises.js'
  js/navigation.js: ako subject.features?.exercises → prikaži #exercisesNavBtn/#exercisesMobileBtn;
                    switchSection('exercises') → initExercises()
  index.html: <section id="exercises"> + 2 nav gumba (data-section="exercises", hidden po defaultu)
```

**Tok izvođenja:** otvoriš predmet → ako ima `features.exercises`, vidiš tab „Exercises" → `initExercises()` pročita
`window[catalog.content.exercises]`, filtrira `exercises[]` po `currentLesson` (K1/K2/finalni), renderira kartice; klik
→ widget po `type` → unos → grader (čista funkcija) → feedback + spremi napredak.

---

## 2. Tipovi vježbi — SCHEMA (ugovor za autoriranje budućih packova)

Svaki tip = **renderer + grader** u engineu. Content pack samo puni podatke. Svi `label/prompt/account/hint` su
slobodan tekst (→ jezik je stvar podataka). Brojevi su čisti `Number` (vidi §3).

```js
// ZAJEDNIČKA omotnica svake vježbe
{ id:'k1-bs-ch4-1', lesson:'first-midterm', chapter:4, type:'statement',
  title:'…', prompt:'…', difficulty:1,
  solution:[ 'korak 1…', 'korak 2…' ],   // za 'walkthrough' mod (parafraza, NE slika)
  /* …payload ovisan o type-u… */ }
```

| type | payload (skraćeno) | pravilo ocjenjivanja |
|---|---|---|
| **`choice`** | `items:[{q, kind:'tf'\|'mc', options?, answer}]` | točan odgovor po stavci (TF: bool; MC: index) |
| **`numeric`** | `fields:[{key,label,answer,tol,unit,hint}]` · *(opcionalno randomizacija →)* `params, generate(p), solve(p)` | `numEq(got, answer, tol)` po polju |
| **`ratio`** | `givens:{…}, fields:[{key,label,answer,tol,unit}]` (+ randomizacija kao numeric) | `numEq` po polju |
| **`statement`** | `sections:[{key,label,lines:[{label,answer}]}], totals:[{key,label,answer,derived?}]` | `numEqMoney` po liniji i totalu |
| **`classify`** | `classes:[…], effects:[…], rows:[{text, entries:[{account,cls,effect}]}]` | `gradeSet` po retku (redoslijed-neovisno), svako polje točno |
| **`journal`** | `chartOfAccounts:[{name,normal:'D'\|'C',section}], beginningBalances?, transactions:[{text, entries:[{account,side,amount}]}], expectedEndingBalances?` | po transakciji: `gradeSet` stavki + Σdebit=Σcredit; opc. ending saldi preko `acc-kernel` |

**Randomizacija (parametrizirane vježbe):** ako vježba ima `generate`/`solve`, engine pri otvaranju pozove
`p = pickParams(params, seed)`, prikaže `generate(p)` (tekst/brojevi), a točan odgovor je `solve(p)`. Gumb
„New numbers" → novi seed. (Funkcije smiju biti u data datoteci — to su NAŠE JS datoteke, ne korisnički unos.)
Primjenjivo prvo na `numeric`/`ratio` (čista formula, nizak rizik).

**3 moda (isti podaci):** `practice` (polja + hintovi + provjera po polju), `exam` (prazno, ocjena na kraju po
stvarnim %), `walkthrough` (prikaže `solution[]` korak-po-korak).

---

## 3. Konvencije brojeva i ocjenjivanja (jezgra „bez bugova")

- **U DATA:** svi iznosi su čisti `Number` (npr. `120000`, `63.60`). Nikad string brojevi.
- **`parseAmount(str)`:** makni razmake/valutu; **konvencija unosa:** dopusti znamenke + **jedan** decimalni
  separator (`.` ili `,`), ostali razmaci/točke = grupiranje tisuća → makni. Vrati `Number` ili `NaN`.
- **`numEqMoney(a,b)`:** zaokruži oba na 2 decimale (cente), usporedi kao cijele cente. (novac)
- **`numEq(a,b,tol)`:** `Number.isFinite(a) && Math.abs(a-b) <= tol` (default `tol=0.005`). (ratio/postoci `tol` po polju)
- **`gradeSet(expected[], got[])`:** multiset usporedba (redoslijed-neovisno) — za knjiženje/klasifikaciju.
- Grader UVIJEK vraća `{score, max, perField:[{key, ok, expected, got}]}` → jednolično bodovanje + feedback.
- **NIKAD** string-compare brojeva; **NIKAD** `==` na floatove.

---

## 4. Napredak (storage)
- Zaseban ključ po predmetu: `<subject>-exercises-progress` (ne miješa se s kategorijskim napretkom).
- Po vježbi: `{ done:bool, best:0..1, attempts:int, lastTs }`. Reuse obrasca iz `js/storage.js`.
- Progress stranica: dodati mali blok „Exercises: X/Y completed" kad subject ima `features.exercises`.

---

## 5. Pravila procesa (na SVAKU ciglu)
1. **Additivno + iza flag-a:** dok tip/sadržaj nije gotov, app mora raditi identično za sve ostale predmete.
2. **Cache bump:** svaka izmjena `js/*`, `css/*`, `data/*` → bump `?v=` u `index.html` (+ `@import` token u `styles.css`)
   i `CONTENT_VERSION` u `content-loader.js`. (BUG-004 — inače deploy nevidljiv.)
3. **Provjere prije commita:** `npm run verify` (0 grešaka) + node testovi za core/kernel + `npm run test:responsive`
   (+ privremeni `tests/_tmp-exercises-*.spec.js`, briše se nakon).
4. **Commit lokalno OK; deploy SAMO uz izričitu potvrdu korisnika.**
5. **Docovi:** ažuriraj checklist (§6) + PROGRESS/CHANGELOG nakon svake veće cigle.
6. **Izvori zaštićeni:** `tmp-acc/` (JPG-ovi + renderer) je gitignored — nikad ne commitati; sadržaj se parafrazira u data.

---

## 6. ✅ CIGLA-PO-CIGLA PLAN (checklist — nastavi od prve prazne)

> Legenda: `[ ]` todo · `[x]` gotovo. Svaka cigla ima **done-kriterij**. Drži app zelenim na svakoj.

### FAZA 0 — Engine temelj (ništa vidljivo korisnicima dok flag nije upaljen)
- [x] **B0.1** `js/exercises-core.js`: `parseAmount, formatAmount, numEq, numEqMoney, gradeSet` (+ `canonicalKey`, `toCents`) + `module.exports` i `window.ExercisesCore`.
      *Done ✅:* `tests/unit/exercises-core.test.js` (mali runner, bez frameworka) — **51/51 prolazi** (EU/US format, zagrade=neg, cente, 1.005 rub, multiset/redoslijed-neovisno). Pokreni: **`npm run test:unit`**.
- [x] **B0.2** `js/exercises-core.js`: `seededRandom(seed)` (mulberry32) + `pickParams(spec, seed)` (deterministički; spec: `{min,max,step}` / `{choices:[…]}` / literal).
      *Done ✅:* isti seed → isti parametri; raspon/step/choices poštovani — **60/60** (`npm run test:unit`).
- [x] **B0.3** `css/exercises.css` (kostur: kontejner, mode-tabovi, kartice, polja, feedback, prazno stanje, mobilni scroll-x; sve `ex-`-prefiks) + `@import` u `styles.css` (`?v=20260622`) + `styles.css?v=20260622` u index.html.
      *Done ✅:* import učitan; nula `.ex-*` markupa zasad → nema vizualne regresije drugih sekcija.
- [x] **B0.4** `index.html`: `<section id="exercises" class="section">` (prazno stanje, `#exercisesContent`) + 2 nav gumba
      (`#exercisesNavBtn` desktop, `#exercisesMobileBtn` mobile, `data-section="exercises"`, `style="display:none"`). *Done ✅:* markup postoji, skriven.
- [x] **B0.5** `js/navigation.js`: novi `applyFeatureNav(subjectId)` (data-driven preko `SokratCatalog.getSubject().features`) prikazuje exercises gumbe kad `features.exercises`; **blindMap refaktoriran** s hardkodiranog `subjectId==='geography'` na isti `features.blindMap`. `switchSection('exercises')` → `initExercises()` (guarded). `navigation.js?v=20260622`. *Done ✅:* tab se pojavi samo za predmete s flagom (geography map i dalje radi).
- [x] **B0.6** `js/exercises.js`: `initExercises()` — pročita `window[subject.content.exercises]`, filtrira po `currentLesson`,
      renderira LISTU kartica (naslov + status + tagovi tip/poglavlje), prazno stanje ako nema vježbi; delegirani click → `openExercise()` shell. Statički `<script>` (exercises-core.js + exercises.js, `?v=20260622`) prije `init.js`.
      *Done ✅:* lista/prazno stanje se renderira; klik otvara shell (rendereri po tipu = FAZA 1).
- [x] **B0.7** `data/catalog.js`: accounting → `features:{blindMap:false, exercises:true}`, `content.exercises:'accountingExercises'`,
      `'data/accounting/exercises.js'` dodan u `scripts` (prije index.js). `data/accounting/exercises.js`: `accountingExercises={meta:{lang:'en',currency:'$',version:1},exercises:[]}` + window/module export. Bump `CONTENT_VERSION=20260622` + catalog.js/content-loader.js `?v=`.
      *Done ✅:* `npm run verify` **0 grešaka / 0 upozorenja** (9 predmeta); data pack parsira u node.
- [x] **B0.8** Provjere Faze 0: verify (0/0) + node unit (60/60) + Playwright **44/44** (36 bazni + 8 temp: accounting tab+prazno
      stanje, te2 nema tab, geography zadržava Map). **Usput popravljeno:** Playwright je `testMatch`-om hvatao `tests/unit/*.test.js`
      i `process.exit()` je rušio cijeli run → dodan `testIgnore:['unit/**']` u `playwright.config.js`. Temp spec obrisan. *Done ✅.*
- [ ] **B0.9** Commit lokalno: `feat(exercises): engine scaffold + accounting feature flag (no content)`.

### FAZA 1 — Generički tipovi widgeta (1 cigla = 1 tip; svaki s demo vježbom + node testom grader-a)
- [ ] **B1.1** `choice` (TF + MC): renderer + grader + 1 demo + node test. *Done:* točan/netočan unos → ispravan feedback.
- [ ] **B1.2** `numeric`: renderer (1+ polja, jedinice, hint) + grader (`numEq`) + demo + test.
- [ ] **B1.3** `ratio`: renderer (givens + polja) + grader + demo + test.
- [ ] **B1.4** `statement`: renderer (sekcije, linije, totali, balancing figure) + grader (`numEqMoney`) + demo + test.
- [ ] **B1.5** `classify`: renderer (account+class+effect dropdowni) + grader (`gradeSet`, redoslijed-neovisno) + demo + test.
- [ ] **B1.6** **3 moda** (practice/exam/walkthrough) u zajedničkom widget shell-u + render `solution[]`. *Done:* prebacivanje moda radi na svim tipovima.
- [ ] **B1.7** **Randomizacija** (`params/generate/solve`) za `numeric`+`ratio` + gumb „New numbers". *Done:* determinizam po seedu (test).
- [ ] **B1.8** **Napredak**: `accounting-exercises-progress` (done/best/attempts) + blok na Progress stranici. *Done:* napredak preživi reload.
- [ ] **B1.9** Provjere Faze 1: verify + svi node testovi + Playwright (+ temp spec po tipu). Commit lokalno.

### FAZA 2 — `journal` tip (pravi double-entry; najtemeljitije testirati)
- [ ] **B2.1** `js/acc-kernel.js`: `postEntries(begBalances, entries)`, `isBalanced(entries)`, `deriveEndingBalances`,
      `classifyTotals` — čisto, bez DOM. *Done:* node test na poznatoj vježbi (Exercise 3 → aktiva=pasiva=259.700).
- [ ] **B2.2** `journal` guided (fiksne linije po transakciji) + grader (`gradeSet` + balance check) + ALE demo + test.
- [ ] **B2.3** `journal` free mode (dodaj/ukloni linije, account picker iz `chartOfAccounts`) + **auto-posting u T-račune** (vizual) + ocjena po ending saldima. *Done:* posting točan; nebalansirano se odbije.
- [ ] **B2.4** Živa **A = L + E** / Σdebit=Σcredit traka. *Done:* uživo signalizira (ne)ravnotežu.
- [ ] **B2.5** Provjere Faze 2: verify + kernel testovi + Playwright. Commit lokalno.

### FAZA 3 — Sadržaj (vertikalni rez po poglavlju; bulk autoriranje iz `tmp-acc/img` + docx)
> Obrazac po poglavlju: teorija-kategorija (ako fali, vidi Fazu 4) + vježbe svih relevantnih tipova, vezano na `lesson`.
- [ ] **B3.1 (K1 Ch4 — Balance Sheet):** TF/MC + `classify` + `statement` (balance sheet build). Bump cache. verify+test.
- [ ] **B3.2 (K1 Ch5 — Income Statement):** TF/MC + `numeric` (COS, perpetual/periodic) + `statement` (IS). 
- [ ] **B3.3 (K1 Ch6 — Bookkeeping):** `classify` (I/D effect, Assignment 6-2) + `journal` ALE (A/L/E samo).
- [ ] **B3.4 (K1 Ch3 — Survey FS):** `numeric` (equity/retained earnings) + TF/MC + `statement` (3 izvještaja, Assignment 1).
- [ ] **B3.5 (K1 Ch1–2):** TF/MC (intro, GAAP, oblici poslovanja, stock). *(uglavnom choice — teorijski)*
- [ ] **B3.6 (K2 Ch11 — Depreciation):** `numeric` randomiziran (straight-line/DDB/MACRS).
- [ ] **B3.7 (K2 Inventory):** `numeric` (FIFO/LIFO/Average COGS).
- [ ] **B3.8 (K2 Ch9/10 — Restaurant/Hotel ratios):** `ratio` (avg check, seat turnover, food/labor cost %, RevPAR…).
- [ ] **B3.9 (K2 Ch12 — Analyzing FS):** `ratio` (current ratio, horizontal/vertical) + `numeric`.
- [ ] **B3.10 (K2 ALE+RE):** `journal` s prihodima/rashodima + amortizacijom + profit + ending BS.
- [ ] **B3.11 (K2 Ch7/8/13/14/15-16):** TF/MC + po koji `numeric` (food cost, revenue allocation, budgeting).
- [ ] **B3.x** Nakon svakog poglavlja: bump cache, verify, Playwright, ciljani render test, commit lokalno.

### FAZA 4 — Restruktura teorije K1/K2/finalni (može se prepletati s Fazom 3; detalji §6 ACCOUNTING_PLAN)
- [ ] **B4.1** Dopiši K1 kategorije (Ch1–6): `intro, businessFormation, financialStatements, balanceSheet, incomeStatement, bookkeeping` → `data/accounting/midterm-1.js`.
- [ ] **B4.2** Realign K2 iz postojećih modula → `midterm-2.js` (+ NOVO `depreciation`, `restaurantAccounting`).
- [ ] **B4.3** Finalni hibrid `final.js` = `Object.assign({}, K1, K2, { examPractice })` (bivši `finalPractice`); učitava ZADNJI.
- [ ] **B4.4** `catalog.js`: accounting → 3 lekcije (`first-midterm`/`second-midterm`/`final`) + scripts + resolve. Bump cache.
- [ ] **B4.5** Provjere: verify (mapiranja!) + Playwright + ciljani K2/finalni render. Napredak očuvan gdje ključ isti.

### FAZA 5 — Capstone (KASNIJE, ne sad — da ne napušemo opseg)
- [ ] **B5.1** Exam simulator (tempiran, MC+praktično, ocjena po stvarnim %).
- [ ] **B5.2** T-account vizual polish, dodatne statistike/gamifikacija (veza na natjecanje, M3).

---

## 7. Kako dodati NOVI content pack (payoff — buduće: hrvatski / drugi fakulteti)
1. Kreiraj `data/<subject>/exercises.js` → `window.<subject>Exercises = { meta:{lang:'hr', currency:'€', version:1}, exercises:[...] }`
   (svi tekstovi/računi/hintovi na željenom jeziku; tipovi vježbi isti).
2. `data/catalog.js`: kod tog predmeta dodaj `features:{exercises:true}`, `content.exercises:'<subject>Exercises'`,
   i `'data/<subject>/exercises.js'` u `content.scripts`.
3. Bump `?v=`/`CONTENT_VERSION`. `npm run verify` + Playwright. **Gotovo — nula izmjena enginea.**
4. (Ako jezik nije `en`) provjeri da `I18N['hr']` postoji u `js/exercises.js` (samo UI chrome stringovi).

---

## 8. Stanje / recovery nakon compacta
- **Prije izrade ničega:** otvori §6, nastavi od prve `[ ]` cigle. Trenutno: **sve `[ ]` (kreće B0.1).**
- Izvori: `tmp-acc/img/` (133 JPG, gitignored) + docx (`…/Accounting/`). Renderer: `tmp-acc/pdf2img.mjs`.
- Analiza/katalog: [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md). Odluke zaključane: **engine = kernel + generic + parametrizirano + 3 moda; redoslijed = vertikalni rez po poglavlju, K1 prvo.**
