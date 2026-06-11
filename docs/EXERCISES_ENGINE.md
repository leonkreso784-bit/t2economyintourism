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
- [x] **B0.9** Commit lokalno ✅: `feat(exercises): engine scaffold + accounting feature flag (no content)` (`3324e72`, 15 datoteka). **NEDEPLOYANO** (push čeka izričitu potvrdu). → **FAZA 0 KOMPLETNA.**

### FAZA 1 — Generički tipovi widgeta (1 cigla = 1 tip; svaki s demo vježbom + node testom grader-a)
- [x] **B1.1** `choice` (TF + MC): čisti grader `gradeChoice` u jezgri (node) + DOM widget (render/collect/mark) + **WIDGET REGISTRY** obrazac (render+collect+grader-ime+mark) + check-flow (skupi→grader→feedback→napredak) + 1 demo (`k1-choice-intro-1`, 5 stavki) + CSS. *Done ✅:* node 67/67; ciljani Playwright 8/8 (otvori→svi točni→„Correct" + napredak `done`; 1 krivi→„4/5" + označen točan). **Cache bump odgođen na B1.9** (ništa deployano).
- [x] **B1.2** `numeric`: čisti `gradeNumeric` (jezgra, `parseAmount`+`numEq` po polju, tol po polju) + DOM widget (polja/jedinice/hint/mark) + demo (`k1-numeric-equity-1`, 2 polja). *Done ✅:* node 73/73; Playwright 8/8 (grouping unos „103,000" točan; 1 krivi→„1/2" + polje označeno).
- [x] **B1.3** `ratio`: renderer (givens tablica + polja) + grader (reuse `gradeNumeric`, isti field-numEq) + demo (`k2-ratio-restaurant-1`, avg check + seat turnover) + test. *Done ✅:* node 74/74; Playwright 8/8 (givens 513,000 prikazan; tol poštovan).
- [x] **B1.4** `statement`: `statementCells` (stabilni ključevi, dijele grader+widget) + `gradeStatement` (`numEqMoney` po liniji/totalu) + DOM widget (sekcije/linije/totali/balancing) + demo (`k1-statement-bs-1`, Balance Sheet, common stock = balancing). *Done ✅:* node 79/79; Playwright 8/8 (svi točni→„Correct"; kriv balancing→„9/10" + označen). **Test-fix:** `'10200.004'` (string, 3 znamenke iza) je ISPRAVNO grupiranje → cents-safety testiran na *float*.
- [x] **B1.5** `classify`: `gradeClassify` (po-slotu: zadani račun + odabir klase i efekta; cls&effect oboje točni) + DOM widget (account label + 2 dropdowna) + demo (`k1-classify-ch6-1`, 3 transakcije). *Napomena:* račun je ZADAN u slotu → per-slot jednakost (čišći feedback); `gradeSet` (redoslijed-neovisno) rezerviran za `journal` (FAZA 2) gdje student sam dodaje linije.
- [x] **B1.6** **3 moda** (practice/exam/walkthrough) u zajedničkom widget shell-u (mode-bar) + render `solution[]` (walkthrough = bez unosa/Check; exam = bez hintova; feedback s %). *Done ✅:* Playwright 12/12 (numeric hint vidljiv→skriven→solution; choice walkthrough; novi otvor reset na practice).
- [x] **B1.7** **Randomizacija** (`params`+`generate(p)`) za `numeric`/`ratio` + gumb „New numbers" (novi seed). `resolveExercise` spaja generirani payload (prompt/fields/odgovori) preko definicije; demo `k2-numeric-depreciation-1` (straight-line). *Done ✅:* node determinizam (isti seed→isti odgovor; answer=(cost−salvage)/life za 40 seedova) + Playwright 12/12 (prikazani brojevi se ocijene točno; „New numbers" mijenja zadatak; odsutan za nerandomizirane).
- [x] **B1.8** **Napredak**: `<subject>-exercises-progress` (done/best/attempts/lastTs; piše `saveProgress` na Check, čita lista + Progress) + kartica „Exercises: done/total, attempts, avg best%" na Progress stranici (data-driven preko `features.exercises`). *Done ✅:* Playwright 8/8 (napredak preživi reload; skriven za te2).
- [x] **B1.9** Provjere Faze 1: verify **0/0** + node **86/86** + Playwright **36/36** (smoke 9 predmeta, 0 problema/errora). Cache bump `?v=20260623` (exercises-core/exercises/progress.js, exercises.css @import, CONTENT_VERSION+content-loader). Temp specovi obrisani. Commit lokalno. → **FAZA 1 KOMPLETNA.**

### FAZA 2 — `journal` tip (pravi double-entry; najtemeljitije testirati)
- [x] **B2.1** `js/acc-kernel.js`: `isBalanced`, `sumSide`, `postEntries`/`deriveEndingBalances`, `classifyTotals` (+ `cents`/`round2`,
      `normalOf`/`sectionOf`) — čisto, bez DOM, samostalno (bez ovisnosti). `chartOfAccounts:[{name,normal,section}]`. *Done ✅:*
      `tests/unit/acc-kernel.test.js` **8/8** na poznatom uravnoteženom nalogu (A=L+E: 65.000=15.000+50.000); `test:unit` sad pokreće oba (86+8). Još NE u index.html (žica se u B2.2). NEDEPLOYANO.
- [x] **B2.2** `journal` guided (fiksne linije po transakciji) + `gradeJournal` (jezgra: `gradeSet` multiset po transakciji + balance Σd=Σc) + DOM widget (account/side dropdown + amount; per-transakcija status) + ALE demo (`k1-journal-ale-1`). *Done ✅:* node 92/92; Playwright 12/12 (svi točni→„Correct"; zamijenjene strane→„Balanced, but not right"; nebalansirano→„Debits ≠ Credits").
- [x] **B2.3** `journal` free mode (`ex.free`): dodaj/ukloni linije (account picker iz `chartOfAccounts`) + **auto-posting u T-račune** (live, `AccKernel.tAccounts`) + ocjena po ending saldima (`AccKernel.gradeEndingBalances` + `tAccounts`, node 13/13). Widget podržava `widget.grade` (free) uz imenovani grader (guided); demo `k1-journal-free-1`. *Done ✅:* Playwright 12/12 (dodaj→6 linija→točan nalog→„Correct"; live T-konta; nebalansirano→odbijeno; remove radi).
- [x] **B2.4** Živa **Σdebit=Σcredit** + **A = L + E** traka u T-panelu (iz tekućih salda preko `classifyTotals`). *Done ✅:* Playwright 4/4 (jednadžba se prebacuje balanced↔unbalanced uživo).
- [x] **B2.5** Provjere Faze 2: verify **0/0** + node **92/92 + 13/13** + Playwright **36/36** (smoke 9 predmeta 0 errora). Cache `?v=20260624` (exercises-core/exercises/acc-kernel, exercises.css, CONTENT_VERSION+content-loader). Temp specovi obrisani. Commit lokalno. → **FAZA 2 KOMPLETNA (journal/double-entry).**

### FAZA 3 — Sadržaj (vertikalni rez po poglavlju; bulk autoriranje iz `tmp-acc/img` + docx)
> Obrazac po poglavlju: teorija-kategorija (ako fali, vidi Fazu 4) + vježbe svih relevantnih tipova, vezano na `lesson`.
- [x] **B3.1 (K1 Ch4 — Balance Sheet):** iz izvora (Cote workbook Assignment 4-1, rješenja provjerena na `tmp-acc/img/solutions-chapters-2-5`):
      `k1-ch4-tf` (15 TF), `k1-ch4-terms` (8 MC pojmovi), `k1-ch4-classify` (20 računa → bilančna kategorija) + postojeći `k1-statement-bs-1`.
      **Engine generalizacija (mala, unatrag-kompatibilna):** `classify` effect-dropdown je sad OPCIONALAN (`ex.effects` izostavljen → jednoosna klasifikacija); `gradeClassify` ocjenjuje samo klasu. *Done ✅:* node 95/95 + 13/13; Playwright 36/36 + ciljani 8/8 (20 računa točno → „Correct"; jedan dropdown po retku). Cache `?v=20260625`.
- [x] **B3.2 (K1 Ch5 — Income Statement):** iz izvora (Cote workbook Exercises-5; rješenja provjerena na `tmp-acc/img/solutions-chapters-2-5`):
      `k1-ch5-tf` (10 True/False), `k1-ch5-classify` (30 računa → **5-osna** klasifikacija Asset/Liability/Equity/Revenue/Expense, koristi jednoosni `classify` iz B3.1),
      `k1-ch5-foodcost` (`ratio`: Beginning+Direct+Storeroom→**Cost of Food Available** 35.445; −Ending→**Cost of Food Used** 25.385). **Engine nepromijenjen** (samo sadržaj).
      *Done ✅:* node 95/95 + 13/13; Playwright 36/36 + ciljani 2/2 (food cost računica → „Correct"; 30 računa točno → „Correct"). Cache `?v=20260626`.
- [x] **B3.3 (K1 Ch6 — Bookkeeping):** iz izvora (Cote workbook Assignment 6-2 + profesorski worked example „Bookkeeping process"):
      `k1-ch6-classify` (10 transakcija → **dvoosno** klasa Asset/Liability/Equity/Revenue/Expense **+ I/D efekt**; koristi `effects` granu iz B1.5),
      `k1-ch6-journal` (guided journal, **6 ALE transakcija**, perpetual; nastavlja otvoreni ledger preko `beginningBalances`; završni saldi provjereni kernelom — Cash 148.200, Food Inv 16.000, AP 4.200, CSI 178.500, APIC 10.000; 3-linijski entry kod izdavanja dionica iznad pari). **Engine nepromijenjen.**
      *Done ✅:* node 95/95 + 13/13; verify 0/0; Playwright 36/36 + ciljani 2/2 (classify 26 linija točno → „Correct"; journal 6 tx → „Correct"). Cache `?v=20260627`.
- [x] **B3.4 (K1 Ch3 — Survey FS):** iz izvora (Cote workbook Assignments 3-1/3-2/3-3; **rješenja provjerena** na `solutions-chapters-2-5` pp. 2–4):
      `k1-ch3-tf` (14 T/F), `k1-ch3-terms` (10 pojmova → MC), `k1-ch3-isbs` (`classify` jednoosno: stavka → Income Statement / Balance Sheet),
      `k1-ch3-capital` (`ratio`: owner’s capital roll-forward 40k+5k+20k−14k = **51.000**, s distraktorima AP/AR koje treba ignorirati),
      `k1-ch3-income-statement` (`statement`: puni Income Statement „Annie’s Restaurant" — 16 linija + 9 kaskadnih totala; **Net Income 57.000**; svi totali provjereni). **Engine nepromijenjen.**
      *Done ✅:* node 95/95 + 13/13; verify 0/0; Playwright 36/36 + ciljani 5/5. Cache `?v=20260628`.
- [x] **B3.5 (K1 Ch1–2):** konceptualna teorija (workbook nema numerički set za Ch1–2): `k1-ch1-concepts` (11 TF/MC — računovodstvena
      jednadžba, 4 izvještaja, GAAP: business entity/going concern/cost/accrual/matching/monetary unit/conservatism),
      `k1-ch2-business-forms` (13 TF/MC — proprietorship/partnership/corporation, limited vs unlimited liability, stock: par vs market,
      authorized≥issued≥outstanding, treasury, APIC, owner’s capital). **Engine nepromijenjen.** *Done ✅:* node 95/95 + 13/13; verify 0/0;
      Playwright 36/36 + ciljani 2/2. Cache `?v=20260629`. → **K1 SADRŽAJ KOMPLETAN (Ch1–6).**
- [x] **Review-fix (statement givens):** `statement` „build" vježbe nisu prikazivale izvorne brojeve (samo prazna polja) → student nije imao iz čega graditi.
      **Mala generička engine dopuna** (2. nakon B3.1 classify): `statement` widget sad renderira **givens tablicu** ako vježba ima `ex.givens` (isti
      mehanizam kao `ratio`; izdvojen helper `givensTableHtml`, oba widgeta dijele). Dodani izvorni saldi u `k1-statement-bs-1` (6) i `k1-ch3-income-statement` (17).
      Unatrag-kompatibilno (bez `givens` → ništa se ne mijenja). *Done ✅:* verify 0/0; node 95/95 + 13/13; Playwright 36/36 + ciljani 3/3 (BS/IS prikazuju brojeve i ocjenjuju „Correct"; ratio bez regresije). Cache `?v=20260630` (exercises.js + content-loader + CONTENT_VERSION).

> #### 🔎 Review-nalazi (2026-06-11, korisnički pregled lokalno) — ✅ RIJEŠENO (commit lokalno, NEDEPLOYANO)
> Dva prava nalaza iz proklikavanja K1 vježbi (BUG-010/011). Korisnik odlučio (2026-06-11): demoi = **opcija A (makni sve)**; nakon RV-1+RV-2 = **stani za pregled**.
>
> - [x] **RV-1 (BUG-010) — Lista po poglavlju + demoi maknuti.** `renderList` (`js/exercises.js`) sad **sortira po `ex.chapter`**
>   (uzlazno, stabilno; bez broja → „Other") i ubacuje **naslove poglavlja** („Chapter N", `.ex-list-head`). Kartica više ne nosi „Ch N" tag
>   (naslov to pokriva). **Demoi maknuti** iz `data/accounting/exercises.js` (opcija A): obrisani `k1-choice-intro-1`, `k1-numeric-equity-1`,
>   `k2-ratio-restaurant-1`, `k1-classify-ch6-1`, `k2-numeric-depreciation-1`, `k1-journal-ale-1`, `k1-journal-free-1`; **zadržan**
>   `k1-statement-bs-1` (pravi Ch4 statement). Sadržaj sad **16 vježbi, čisti K1 (Ch1–6)**. Unit test (`exercises-core.test.js`) više ne ovisi o
>   obrisanom demou → randomizacija se testira na **inline fixtureu** (engine-svojstvo, ne content). CSS: `.ex-list-head` + `.ex-mode-desc`.
> - [x] **RV-2 (BUG-011) — Practice ≠ Exam.** `checkOpen`/`renderFeedback` sad primaju `currentMode`. **Exam**: na „Check" **preskače markiranje**
>   (`widget.mark`) i feedback prikazuje **SAMO rezultat** („Score: X / Y (Z%)"), bez otkrivanja točnih i bez po-stavci zeleno/crveno; hintovi i dalje
>   skriveni. **Practice**: puna povratna info (markiranje + „Review the highlighted" + hintovi). Dodan **opis aktivnog moda** ispod mode-bara
>   (`MODE_DESC` → `.ex-mode-desc`) da je razlika odmah vidljiva. Engine ostao generički (mod je već postojao; samo proširen tok).
>
> **Provjere:** verify 0/0 · node **95/95 + 13/13** · Playwright **36/36** + ciljani **3/3** (sortiranje+naslovi+nema demoa; exam=samo rezultat bez markiranja; hint practice↔exam). Cache `?v=20260631`.
> **Nastavak (čeka korisnika nakon pregleda):** odluka **deploy** (push 13+1 commitova) / **FAZA 4** (split K1/K2/finalni) / **K2 sadržaj** (B3.6–B3.11).

- [ ] **B3.6 (K2 Ch11 — Depreciation):** `numeric` randomiziran (straight-line/DDB/MACRS).
- [ ] **B3.7 (K2 Inventory):** `numeric` (FIFO/LIFO/Average COGS).
- [ ] **B3.8 (K2 Ch9/10 — Restaurant/Hotel ratios):** `ratio` (avg check, seat turnover, food/labor cost %, RevPAR…).
- [ ] **B3.9 (K2 Ch12 — Analyzing FS):** `ratio` (current ratio, horizontal/vertical) + `numeric`.
- [ ] **B3.10 (K2 ALE+RE):** `journal` s prihodima/rashodima + amortizacijom + profit + ending BS.
- [ ] **B3.11 (K2 Ch7/8/13/14/15-16):** TF/MC + po koji `numeric` (food cost, revenue allocation, budgeting).
- [ ] **B3.x** Nakon svakog poglavlja: bump cache, verify, Playwright, ciljani render test, commit lokalno.

### FAZA 4 — Restruktura teorije K1/K2/finalni ✅ GOTOVO + **DEPLOYANO** (push `a72d648`, 2026-06-11; commits B4.1 `421322f`, B4.2+B4.3 `9e5ba15`, B4.4+B4.5 `a72d648`)
- [x] **B4.1** K1 kategorije (Ch1–6) → `data/accounting/midterm-1.js` (`window.accountingM1`): `intro`, `businessFormation`,
      `financialStatements`, `balanceSheet`, `incomeStatement`, `bookkeeping`. **NOVI sadržaj** (predmet je prije imao samo ~K2).
      Autorirano iz Cote Ch1–6 + verificiranog znanja iz K1 vježbi. **87 fc / 74 quiz / 57 fill / 6 learn.** Commit `421322f`.
- [x] **B4.2** K2 realign → `midterm-2.js` (`window.accountingM2`, 8 kat.): referencira postojeće module (cross-env: browser globali /
      node require) `accountingCycle`, `hotelStatements`, `financialAnalysis`, `budgeting`, `cashControl` + **preimenovan** `secReports`→`annualReports`
      + **2 NOVE** kategorije `restaurantAccounting` (Ch9, 12/11/9) i `depreciation` (Ch11, 12/12/9). Commit `9e5ba15`.
- [x] **B4.3** Finalni hibrid `final.js` (`window.accountingFinal`) = `Object.assign({}, M1, M2, { examPractice: finalPracticeData })` =
      **15 kat.** (6 K1 + 8 K2 + examPractice). Učitava se ZADNJI. Commit `9e5ba15`.
- [x] **B4.4** `catalog.js`: accounting → **3 lekcije** (`first-midterm`/`second-midterm`/`final`) + scripts (category moduli PRVO, pa
      midterm-1/2, pa final ZADNJI; `index.js` maknut iz scripts → sad neiskorišten) + `resolve` (M1/M2/Final). **Vježbe retagane**
      `accounting-fundamentals`→`first-midterm` (svih 16 = K1). Cache `?v=20260632` (catalog.js + content-loader.js + CONTENT_VERSION).
- [x] **B4.5** Provjere: verify **0/0** (3-lekcija resolve), node **95/95 + 13/13**, Playwright **36/36** + ciljani **3/3**
      (K1: 6 kat + learn + 16 vježbi + naslovi poglavlja; K2: 8 kat incl. nove; Final: 15 kat incl. examPractice).
      **Napredak:** ključevi K2 kategorija isti (osim `secReports`→`annualReports`); lekcijski ID se mijenja (`accounting-fundamentals`
      više ne postoji) → stari napredak pod tom lekcijom se re-buketira (očekivano kod restrukture; predmet je sem-1 staro gradivo).

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
- **▶ STANJE 2026-06-11 (DEPLOYANO, `origin/main` @ `2ab7bd5`):** GOTOVO i LIVE → **engine (FAZA 0–2)** + **K1 vježbe (FAZA 3 B3.1–B3.5, Ch1–6)** + **review-fixevi RV-1/RV-2** (lista po poglavlju, demoi maknuti, Practice≠Exam) + **FAZA 4** (Accounting → 3 lekcije `first-midterm`/`second-midterm`/`final` + novo K1 study gradivo: `data/accounting/midterm-1.js`/`midterm-2.js`/`final.js`). Cache `?v=20260632`.
- **▶ SLJEDEĆE — otvori §6, prva prazna cigla = `B3.6` (K2 vježbe).** Trenutno **K2 INTERAKTIVNE VJEŽBE NE POSTOJE** → na Midtermu 2 je „Exercises" tab prazan (očekivano; Midterm 2 ima pun *study* sadržaj, 8 kat). Plan B3.6–B3.11: depreciation (Ch11), inventory FIFO/LIFO (Ch?), Restaurant/Hotel ratios (Ch9/10), Analyzing FS (Ch12), K2 journal ALE+RE, te TF/MC za Ch7/8/13/14/15-16. Izvori = `tmp-acc/img/` (Exercises-9..16, gitignored). Sve nove vježbe `lesson:'second-midterm'` (ili `'final'` za examPractice-stil). Alternativa umjesto B3.6: restruktura sljedećeg sem-1 predmeta (Entrepreneurship/E-Business) po istom FAZA-4 obrascu.
- Provjere: `npm run test:unit` (**92/92 exercises-core + 13/13 acc-kernel**), `npm run verify` (0/0), `npm run test:responsive` (**36/36**). Engine = `js/exercises-core.js` (graderi choice/numeric/statement/classify/journal + parse/numEq/gradeSet/pickParams) + `js/acc-kernel.js` (double-entry) + `js/exercises.js` (WIDGET registry, 6 tipova, 3 moda, randomizacija, napredak, free journal+T-konta) + `css/exercises.css`. Content pack = `data/accounting/exercises.js` (`window.accountingExercises`, **8 demo vježbi**).
- **Obrazac za novi tip:** grader `gradeX(ex, answers)` u jezgri (+ node test) → `WIDGETS.x = {render, collect, mark, grader|grade}` u exercises.js → demo u data → temp Playwright → obriši.
- **Obrazac za novu VJEŽBU:** dodaj u `data/accounting/exercises.js` s `lesson:` = `'first-midterm'` (K1) / `'second-midterm'` (K2) / `'final'` (examPractice-stil) + `chapter:N` (sortira listu) → bump `CONTENT_VERSION` → verify + Playwright. NULA izmjena enginea. (Nakon FAZE 4 lekcije su podijeljene; vježbe se filtriraju po `currentLesson`.)
- Izvori: `tmp-acc/img/` (133 JPG, gitignored) + docx (`…/Accounting/`). Renderer: `tmp-acc/pdf2img.mjs`.
- Analiza/katalog: [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md). Odluke zaključane: **engine = kernel + generic + parametrizirano + 3 moda; redoslijed = vertikalni rez po poglavlju, K1 prvo.**
