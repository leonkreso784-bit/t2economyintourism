# ACCOUNTING — Plan razvoja i implementacije

> ## ✅ STATUS: GOTOVO I LIVE (2026-06-12) — POVIJESNI plan / arhiva
> Accounting je 100% kompletan (3 lekcije + **41 interaktivna vježba**) i deployan. Ovaj dokument je zapis
> KAKO je nastao (analiza 43 izvorne datoteke + katalog tipova vježbi). ⚠️ Korisnik je ZASIĆEN računovodstvom —
> ne vraćati se osim izričito. Reusable engine vježbi: [EXERCISES_ENGINE.md](../architecture/EXERCISES_ENGINE.md). Niže = izvorni plan.

> **Svrha:** kompletna priprema za (1) novi **Exercises** odjeljak (pravo računovodstvo, interaktivno
> + auto-ocjenjivanje) i (2) restrukturu predmeta na **K1 / K2 / finalni** standard (kao sem-2 predmeti).
> Nastalo nakon dubinskog pregleda cijelog izvornog foldera (43 datoteke). Status: ~~PRIJEDLOG~~ → **GOTOVO**.
> Datum: 2026-06-10. Predmet: **Accounting** (FMTU, Hospitality Management, 2. god, sem 1).

---

## 1. Činjenice o predmetu (iz silabusa `Basic information on Accounting 2025.pdf`)

- **Nositelj:** Dubravka Vlašić, izv. prof. · **Co-holder:** Anna Kralj (restaurant accounting & financial analysis).
- **Udžbenik:** Cote, R. (2012), *Hotel and Restaurant Accounting*, 7th ed. (AHLEI). **16 poglavlja.**
- **9 ECTS, 5 h/tj = 2 predavanja + 3 seminara/vježbe** → vježbe su praktički **pola predmeta**.
- **Ocjenjivanje:** Course attendance (min 75%), Activity 6%, Key term test 4%, **Assignment 1 (Financial statements) 5%**,
  **Assignment 2 (Exercises) 7%**, **Mid-term 1 24%**, **Mid-term 2 24%**, **Final 30%** (min 35% za izlazak, min 15% za prolaz).
- **Format ispita:** 10 pitanja — multiple choice (jedan/više točnih) + **open type (teorijski + praktični)**.

### Granica kolokvija (EKSPLICITNO, str. 4 silabusa)
| Kolokvij | Poglavlja | Teme |
|---|---|---|
| **MID-TERM 1 (K1)** | **Ch 1–6** | Intro/Management resource · Business formation · Survey of FS · Balance Sheet · Income Statement · Bookkeeping process |
| **MID-TERM 2 (K2)** | **Ch 7–16** | Computerised accounting (7–8) · Restaurant accounting (9) · Hotel accounting (10) · Depreciation & amortization (11) · Analyzing FS (12) · Annual reports (13) · Credit/Debit cards + Budgeting (14) · Internal control of cash (15–16) |

**Dodatna granica (iz `Solutions to recording transactions chapter 6.docx`):** kod **knjiženja**, u **K1** se traže
transakcije **samo s A/L/E** računima; transakcije s **prihodima/rashodima (R/EX)** dolaze tek u **K2**.

---

## 2. Inventar izvora (`…/2. godina Hospitaliy Managament/Accounting`, 43 datoteke)

### 2a. Teorija (PDF, čisti tekstualni izvoz preko `scripts/pdf-text.js`)
`Lesson 1` (Ch1) · `Lesson 2` (Ch2) · `Chapter 3 Survey of Financial Statements` · `chapter 4 Balance sheet and Income statement` ·
`Chapter 5 Income statement` · `Chapter 6 The bookkeeping process` · `chapter 7/8 Computerised` · `chapter 9 Restaurant` ·
`chapter 10 Hotel` · `chapter 11 Depreciation` · `chapter 12 Analyzing FS` · `chapter 13 Annual reports` ·
`Inventory accounting presentation` (FIFO/LIFO/Average) · `Lecture co-holder Anna Kralj …` (3.6 MB).

### 2b. Vježbe i rješenja
- **DOCX (čisti izvoz, vlastiti zip-čitač):** `Bookkeeping accounts - rules` · `Exercise bookkeeping proces (1)` ·
  `Additional exercise … bookkeeping ALE` · `Exercise (ALE+RE)` · `Assignment 1 exercises with solutions` ·
  `Solutions to recording transactions chapter 6` · `2. exercise - solutions`.
- **PDF `Tasks regarding Restaurant accounting and analysis`** — čist izvoz (ratio zadaci).

### 2c. ⚠️ PDF-ovi s custom font encodingom (tekst se NE ekstraktira → riješeno renderiranjem u JPG)
`Exercises 4,5,6,9,10,11,12,13,14,15,16` · `Working papers 1,2` · `wkb 3` · `Exercise bookkeeping solutions` ·
`Exercises bookkeeping process` · `2. exercise - example` · `solutions chapters 2 - 5`.
→ To su **Cote workbook** stranice (zadaci po poglavlju: True/False, multiple-choice, problemi + **riješeni odgovori**).
→ **Konvertirano: 17 PDF-ova → 133 JPG stranice** (`tmp-acc/img/`, gitignored). Renderer: `pdfjs-dist` (legacy build) +
  `@napi-rs/canvas`, bez sistemskih ovisnosti. Skripta `tmp-acc/pdf2img.mjs` (privremena).

---

## 3. Mapa teorije → kategorije (po poglavlju)

### K1 (Ch 1–6) — **u postojećem sadržaju gotovo NE postoji** (vidi §6)
| Ch | Kategorija (prijedlog) | Ključni pojmovi |
|---|---|---|
| 1 | `intro` | Svrha računovodstva, financial vs managerial, **accounting equation A = L + E**, 5 klasifikacija (A/L/E/R/EX), double-entry, GAAP (12 načela), SEC/IRS/FASB/AICPA/HFTP/AH&LA/NRA, accounting vs taxable income, CPA |
| 2 | `businessFormation` | Feasibility study, oblici (proprietorship/partnership/corporation/LLC + prednosti/mane), authorized vs issued stock, par value, common vs preferred, oporezivanje, franšiza |
| 3 | `financialStatements` | 4 izvještaja (income, equity, balance sheet, cash flow), fiscal vs interim, **IS struktura: Revenue − Cost of Sales = Gross Profit − Operating Expenses − Fixed Charges = Net Income**, retained earnings |
| 4 | `balanceSheet` | Current assets (cash, ST investments, AR, inventories, prepaid) · Noncurrent (investments, P&E, other) · Current liabilities (AP, sales tax payable, income tax payable, accrued, advance deposits, current LTD) · Long-term (notes/mortgage/bonds) · Equity (common/preferred stock, APIC, retained earnings, treasury) |
| 5 | `incomeStatement` | Revenue/sales recognition, sales tax kao liability, tips, COS, **perpetual vs periodic inventory**, operating vs fixed expenses, **depreciation expense vs accumulated depreciation** |
| 6 | `bookkeeping` | Double-entry, 3 pitanja, **debit ↑ asset/expense; credit ↑ liability/equity/revenue**, equality of D=C, contra accounts (allowance for doubtful, accumulated depreciation, withdrawals, treasury stock, sales allowances), normal balances |

### K2 (Ch 7–16) — **postojeći sadržaj već dobro pokriva** (treba realign + dopuna Ch11)
| Ch | Kategorija | Izvor u postojećem `data/accounting/` |
|---|---|---|
| 7–8 | `accountingCycle` | `accounting-cycle.js` (cash vs accrual, adjusting/closing, trial balance) |
| 9 | `restaurantAccounting` | dijelom `financial-analysis.js` + NOVO (USAR, food/bev sales, ratios) |
| 10 | `hotelStatements` | `hotel-statements.js` |
| 11 | `depreciation` | **NOVO** (trenutno tanko) — straight-line, DDB, MACRS, amortization |
| 12 | `financialAnalysis` | `financial-analysis.js` (ratios, horizontal/vertical) |
| 13 | `annualReports` | `sec-reports.js` (SEC, Sarbanes-Oxley, 10-K) |
| 14 | `budgeting` | `budgeting.js` (+ credit/debit cards) |
| 15–16 | `cashControl` | `cash-control.js` (internal control of cash) |

---

## 4. Katalog tipova vježbi (iz svih izvora) → 5 engine primitiva

Svi zadaci imaju **determinističko brojčano/diskretno rješenje** → pogodni za auto-ocjenjivanje.

| # | Tip vježbe | Razina | Primjer | → Engine primitiv |
|---|---|---|---|---|
| A | **True/False** | K1+K2 | „A prepaid expense is an asset." (TR/F) | `choice` |
| B | **Multiple choice / matching** | K1+K2 | Part II: 1→B, 2→A … | `choice` |
| C | **Classify accounts (I/D effect)** | K1 (Ch6) | transakcija → račun + klasa (A/L/EQ/R/EX) + efekt (I/D) | `classify` |
| D | **Record transactions (journal/T-account)** | K1 (ALE) / K2 (ALE+RE) | beginning BS → knjiženje debit/credit → ending balance | `journal` |
| E | **Balance sheet build** | K1 | klasificiraj stavke + zbroji + balancing figure (common stock) | `statement` |
| F | **Financial statements** | K1/K2 | iz popisa računa: IS → Retained Earnings → BS (Assignment 1) | `statement` |
| G | **Equity / Retained earnings** | K1 | start + investments + net income − withdrawals = end | `numeric` |
| H | **Depreciation** | K2 (Ch11) | straight-line `(Cost−Salvage)/Life`; DDB; MACRS | `numeric` |
| I | **Inventory valuation** | K2 | FIFO / LIFO / Average → cost of goods sold | `numeric` |
| J | **Food cost of sales** | K2 | perpetual/periodic: issues ± transferi − officers − employee meals | `numeric` |
| K | **Restaurant/hotel ratios** | K2 | average check, seat turnover, avg food sale/seat, bev/food ratio, food/labor cost % | `ratio` |
| L | **Revenue allocation** | K2 | package plan → alokacija po tržišnoj vrijednosti | `numeric` |
| M | **Financial analysis ratios** | K2 (Ch12) | current ratio, horizontal/vertical analiza | `ratio` |

### 5 engine primitiva (svaki neovisno testabilan)
1. **`choice`** — TF / MC / dropdown klasifikacija (tipovi A, B, C). *Najniži rizik.*
2. **`statement`** — predoznačene linije + unos iznosa + provjera zbrojeva + balancing figure (E, F).
3. **`numeric`** — jedno- ili višekoračni brojčani unos s tolerancijom (G, H, I, J, L).
4. **`ratio`** — brojčani unos s jedinicom/tolerancijom (K, M).
5. **`journal`** — debit/credit stavke, provjera Σ D=Σ C, knjiženje u T-račune, ending balance (D). *Najviši rizik → zadnji / fazno.*

---

## 5. Exercises engine — dizajn

### 5.1 Smještaj (zrcali `blindMap` obrazac — provjereno u kodu)
- **Catalog:** `accounting` subject dobiva `features: { exercises: true }`.
- **index.html:** novi nav gumbi `#exercisesNavBtn` (desktop, `.study-nav-btn`) + `#exercisesMobileBtn`
  (`.mobile-nav-btn`), `data-section="exercises"`, `style="display:none"` po defaultu; nova
  `<section id="exercises" class="section">`.
- **js/navigation.js:** u otvaranju predmeta prikazati gumbe kad `subject.features?.exercises`
  (data-driven; usput refaktorirati i blindMap na isti flag). `switchSection('exercises')` → `initExercises()`.
- **js/exercises.js** (novi modul) + **css/exercises.css** (novi, import u `styles.css` s `?v=`).
- **Podaci:** `data/accounting/exercises.js` → `window.accountingExercises`; dodan u `content.scripts` accountinga
  (prije `index.js` svejedno — neovisan objekt). Filtrira se po `currentLesson` (K1/K2/finalni).

### 5.2 Data schema (`data/accounting/exercises.js`)
```js
const accountingExercises = {
  meta: { currency: '$', version: 1 },
  exercises: [
    {
      id: 'k1-classify-ch6-1',     // jedinstveno
      lesson: 'first-midterm',     // veže na K1/K2/finalni (filtrira renderer)
      chapter: 6,
      type: 'classify',            // choice | classify | statement | numeric | ratio | journal
      title: 'Increase/Decrease Effect on Account Classification',
      prompt: 'Za svaku transakciju: naziv računa, klasa (A/L/EQ/R/EX), efekt (I/D).',
      // payload ovisan o type-u (primjeri dolje)
    }
  ]
};
if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
```

**Payload po tipu (skraćeno):**
```js
// choice (TF/MC)
{ type:'choice', items:[ { q:'A prepaid expense is an asset.', kind:'tf', answer:true },
                          { q:'…', kind:'mc', options:['A','B','C','D'], answer:1 } ] }

// classify
{ type:'classify', classes:['A','L','EQ','R','EX'], effects:['I','D'],
  rows:[ { text:'Borrowed $15,000 from a bank',
           entries:[ {account:'Cash', cls:'A', effect:'I'},
                     {account:'Note Payable', cls:'L', effect:'I'} ] } ] }

// statement (balance sheet / IS)
{ type:'statement', sections:[
    { key:'current-assets', label:'Current Assets',
      lines:[ {label:'Cash', answer:120000}, {label:'Accounts receivable', answer:10200} ] } ],
  totals:[ {key:'totalAssets', label:'Total assets', answer:259700},
           {key:'commonStock', label:'Common stock issued', answer:63500, derived:true} ] }

// numeric (depreciation / inventory / food cost)
{ type:'numeric', steps:[
    {key:'dep1', label:'Year-1 straight-line depreciation', answer:10000, tol:0.01, unit:'$',
     hint:'(Cost − Salvage) / Useful life'} ] }

// ratio
{ type:'ratio', givens:{ lunchCovers:55500, lunchSeats:80, days:364 },
  fields:[ {key:'seatTurnover', label:'Lunch seat turnover', answer:1.9, tol:0.1} ] }

// journal
{ type:'journal',
  chartOfAccounts:['Cash','Food inventory','Accounts payable', …],
  beginningBalances:{ Cash:120000, … },
  transactions:[ { text:'Buys food inventory 3,000 on open account (perpetual).',
                   entries:[ {account:'Food inventory', side:'D', amount:3000},
                             {account:'Accounts payable', side:'C', amount:3000} ] } ],
  expectedEndingBalances:{ Cash:…, 'Food inventory':…, … } }
```

### 5.3 Grading util (`js/exercises.js`, čista funkcija — jezgra „bez bugova")
- `parseAmount(str)` → normalizira unos: makni razmake/valutu; **konvencija:** točka/razmak = tisuće, zarez = decimala
  (ili eksplicitno: dopusti samo znamenke + jedan decimalni separator). Vrati `Number` ili `NaN`.
- `numEq(a, b, tol=0.005)` → `Number.isFinite(a) && Math.abs(a-b) <= tol*Math.max(1, Math.abs(b))`.
  Novac: zaokruži na 2 decimale (cente) i usporedi. Ratio: `tol` po polju.
- `gradeSet(expected[], given[])` → **redoslijed-neovisno** (knjiženje/klasifikacija): usporedi kao multiset.
- Svaki widget vraća `{score, max, perField:[{ok, expected, got}]}` → jednolično bodovanje + feedback.

### 5.4 Progress
- Zaseban storage ključ `accounting-exercises-progress` (ne miješa se s kategorijskim napretkom).
- Po vježbi: `{done:bool, best:0..1, lastAttempt:ts}`. Reuse `js/storage.js` get/set obrazac.

### 5.5 Edge-case / rizik registar
| Rizik | Mitigacija |
|---|---|
| **Format brojeva** (`120.000` vs `63.60`) | Jedna konvencija + `parseAmount` normalizacija; podaci u čistim `Number`; nikad string-compare. |
| **Float novac** | Zaokruži na cente prije usporedbe; `numEq` s tolerancijom. |
| **Više valjanih redoslijeda** (D/C stavke) | `gradeSet` multiset usporedba. |
| **Contra računi** (akum. amortizacija ↑ kreditom) | Eksplicitno u `chartOfAccounts` označiti normal-balance; test slučaj. |
| **Perpetual vs periodic** | Tip zadatka nosi `system` flag; rješenje računato za taj sustav. |
| **Mobilni layout** (široke tablice) | `css/exercises.css` responsive (scroll-x kontejneri), Playwright na 4 iPhone profila. |
| **Cache** | Bump `?v=` + `CONTENT_VERSION` na SVAKU izmjenu (BUG-004). |

---

## 6. Stanje postojećeg `data/accounting/` i restruktura K1/K2/finalni

**Nalaz:** postojećih **7 kategorija = gotovo cijeli K2** (Ch7–16). **K1 (Ch1–6) praktički nedostaje** kao zasebne kategorije.
| Postojeća kat. | fc/quiz/fill | Mapira na |
|---|---|---|
| `cashControl` | 22/17/11 | Ch15–16 (K2) |
| `budgeting` | 20/15/10 | Ch14 (K2) |
| `secReports` | 16/15/9 | Ch13 (K2) |
| `accountingCycle` | 18/15/10 | Ch6–8 (most K2) |
| `hotelStatements` | 21/15/10 | Ch10 (K2) |
| `financialAnalysis` | 19/15/10 | Ch9/12 (K2) |
| `finalPractice` | 8/15/10 | mješavina → postaje `examPractice` |

### Ciljna struktura (kao sem-2: 3 lekcije + finalni hibrid)
- **`first-midterm` (K1):** NOVE kategorije `intro`, `businessFormation`, `financialStatements`, `balanceSheet`,
  `incomeStatement`, `bookkeeping` (dio iz `accounting-cycle`).
- **`second-midterm` (K2):** realign postojećih → `accountingCycle`, `restaurantAccounting`, `hotelStatements`,
  `depreciation` (NOVO), `financialAnalysis`, `annualReports`, `budgeting`, `cashControl`.
- **`final`:** `Object.assign({}, K1, K2, { examPractice })` (učitava se ZADNJI; `examPractice` ← bivši `finalPractice`).
- **Catalog:** 3 lekcije + 3 (ili više) scripta + `resolve`. **Napredak očuvan** gdje ključ kategorije ostaje isti.

---

## 7. Fazni plan implementacije (PREPORUKA: „fazni hibrid")

### FAZA 0 — Temelj (engine, bez sadržaja) · ~pola dana
1. `data/accounting/exercises.js` skeleton (`window.accountingExercises`, 1 demo po tipu osim `journal`).
2. `js/exercises.js`: grading utili (`parseAmount`/`numEq`/`gradeSet`) + rendereri `choice`/`classify`/`statement`/`numeric`/`ratio`.
3. `css/exercises.css` (+ import u `styles.css`).
4. index.html: nav gumbi + `#exercises` sekcija. navigation.js: data-driven prikaz (`features.exercises`) + `initExercises()`.
5. catalog.js: `features:{exercises:true}` + dodaj `exercises.js` u scripts. Bump `?v=` + `CONTENT_VERSION`.
6. **Provjere:** `npm run verify` + ručni smoke + Playwright (+ privremeni ciljani spec za Exercises sekciju).

### FAZA 1 — Sadržaj (guided vježbe) · glavni dio
7. Autoriraj vježbe iz `tmp-acc/img/` + docx: TF/MC (svi Ch), classify (Ch6), balance sheet (Ch4),
   financial statements (Assignment 1), equity (Ch3), depreciation (Ch11), inventory (FIFO/LIFO/Avg),
   food cost (perpetual/periodic), ratios (Ch9/10/12), revenue allocation.
8. Veži svaku na `lesson` (K1/K2). Bump cache. Verify + Playwright + ciljani render testovi.

### FAZA 2 — `journal` widget (pravi double-entry) · zasebno, kad su primitivi dokazani
9. Slobodno dodavanje stavki, Σ D=Σ C enforce, auto-posting u T-račune, ending balance, ocjena po saldima.
10. ALE (K1) pa ALE+RE (K2). Najtemeljitije testirati.

### (paralelno/poslije) — restruktura teorije K1/K2/finalni (§6)
11. Dopiši K1 kategorije (Ch1–6), realign K2, izgradi finalni hibrid, catalog 3 lekcije. Verify + Playwright.

---

## 8. Test plan
- `npm run verify` — catalog integritet (0 grešaka) nakon svake catalog izmjene.
- **Node unit** za grading util (`parseAmount`, `numEq`, `gradeSet`) — najjeftinija zaštita „bez bugova".
- `npm run test:responsive` — Playwright 4 iPhone profila (36 baznih).
- **Privremeni ciljani specovi** `tests/_tmp-exercises-*.spec.js` (smoke bira prvu lekciju → Exercises se mora ciljano testirati), brisati nakon.
- Ručni smoke: svaki tip vježbe — točan/netočan unos, feedback, progress spremanje.

## 9. Sigurnost / pravila
- **Izvori (PDF/JPG) su zaštićeni** → `tmp-acc/` u `.gitignore`; nikad ne commitati. Sadržaj se prepisuje/parafrazira u data datoteke.
- **Deploy samo uz izričitu potvrdu.** Cache bump obavezan (BUG-004). Docovi ažurni nakon svake izmjene.

## 10. ⏳ OTVORENE ODLUKE (čeka korisnik)
1. **Engine fidelity:** (a) **Fazni hibrid** [preporuka] · (b) Guided/strukturiran samo · (c) Puni ledger simulator odmah.
2. **Redoslijed:** (a) **Exercises prvo, pa R-B restruktura** [preporuka] · (b) R-B prvo · (c) Brzi R-A split + Exercises paralelno.

---
*Vezano: [CONTENT_SCHEMA.md] · [ARCHITECTURE.md] · [BACKLOG.md] (§ „2. god sem 1 restruktura"). Napredak: [PROGRESS.md].*
