# Bugovi & Lekcije naučene

Pratimo greške i učimo iz njih. Aktivne bugove gore, riješene + lekcije dolje.

## Kako bilježimo
- **ID:** BUG-NNN
- **Status:** 🔴 otvoren · 🟡 u radu · ✅ riješen
- **Težina:** kritičan / visok / srednji / nizak
- Opis · Koraci za reprodukciju · Uzrok · Rješenje · **Lekcija**

> **Opseg:** ovdje idu **bugovi proizvoda/sajta** (ono što korisnik vidi/doživi). *Tooling/proces* problemi
> (npr. generator-skripta, Windows libuv smetnja pri gašenju, lažni KaTeX-checker pozitiv) bilježe se u
> `PROGRESS.md` + `CLAUDE.md`/memoriji jer ne utječu na korisnika. Bugovi su numerirani uzlazno (BUG-001…),
> a u popisu su aktivni gore pa riješeni (najnoviji riješeni na vrhu).

---

## Aktivni

*(trenutno nema aktivnih bugova)*

---

## Riješeni / Lekcije

### BUG-019 — Back-navigacija: petlja profil ⇄ admin (povratak na početnu nemoguć)
- Status: ✅ riješen 2026-07-12 (grana `foundation/f4` = preview; NIJE na produkciji — admin stranica postoji samo na f4) · Težina: srednji (UX, admin tok) · Prijavio: **korisnik** (2026-07-12, živo klikanje).
- **Simptom:** početna → profil → admin → back-strelica vrati na profil ✓, ali back s profila tada vrati **NATRAG U ADMIN** — i tako u krug (profil ⇄ admin); početna stranica postaje nedostižna.
- **Uzrok:** app nema povijest navigacije — samo jedno-slotni `profileReturnPage` (`js/navigation.js`) koji se postavlja pri **svakom** ulasku na profil. Back iz admina ide `navigateTo('profile')` (`js/admin.js` `#backFromAdmin`) → dolazak IZ ADMINA pregazi slot u `{page:'admin'}` → back s profila vodi u admin → admin back opet na profil → beskonačna petlja, izvorni cilj (početna/study) izgubljen.
- **Rješenje:** dolazak **iz admina** NE prepisuje `profileReturnPage` (admin je pod-stranica profila — ulaz i back idu kroz profil, pa profilov back mora preživjeti taj skok). 1 uvjet u `navigateTo()`. Regresijski test u `tests/admin.spec.js` („BUG-019", pravi klikovi na `#backFromAdmin`/`#backFromProfile`, sva 4 profila) — **dokazano PADA bez fixa** (stash-provjera). Cache `20260712180655`.
- **Lekcija:** jedno-slotni „return" pointer se sam pojede čim se pojavi druga razina navigacije — svaka nova pod-stranica mora ili čuvati tuđi slot ili treba **pravi navigacijski stog**. Stog (+ browser History API da i sistemska back-gesta radi u SPA-u) = kandidat uz editor-UX ciglu (U8), ne krpati sad.

### BUG-018 — Admin (F4.3a) se nije detektirao + „Admin" curio na dno; Playwright to NIJE uhvatio
- Status: ✅ riješen 2026-07-06 (grana `foundation/f4` = preview; NIJE bilo na produkciji) · Težina: srednji (admin-only značajka) · Našao: **korisnik živom prijavom** („samo admin dole"), pa potvrđeno login-skriptom.
- **Simptom:** prijavljen kao admin — (a) nije se pojavila admin kartica/„Uredi sadržaj"; (b) na DNU svake stranice pisalo je „Admin"; (c) native `<select>` popup u admin viewer-u bio bijel (ignorira dark temu).
- **Uzrok:** (1) `js/admin.js` referencirao **`window.SokratAuth`**, ali `SokratAuth` je top-level `const` = **globalni leksički binding, NIJE `window` property** → `undefined` → `computeIsAdmin()` uvijek `false` + `onChange` listener se nikad ne registrira. (Svi drugi moduli — profile/cloud-sync — zovu `SokratAuth` **golo**.) (2) nova `.admin-page` klasa nije dodana u `css/variables.css` „hide all pages" grupu (`display:none` default) → `#admin-page` sekcija se prikazivala uvijek, na dnu. (3) `<select>` bez `color-scheme:dark`.
- **Popravak (`45489f7`+`0bc5e41`):** golo `SokratAuth` (typeof-guard) · `.admin-page` dodan u hide+active grupe · `color-scheme:dark` + tamni `option`. Regresijski test: `#admin-page` skriven na landingu.
- **Lekcija:** `admin.spec` je provjeravao samo `isAdmin===false` (točno i dok je detekcija PUKNUTA) pa je bug prošao SVE testove. **Za auth/RLS-gated značajke (CRUD) nužna je PRAVA prijava.** Uz to: **globali deklarirani kao `const` NISU na `window`** — referenciraj ih golo (`typeof X !== 'undefined'`), ne `window.X`. [[live-login-verifies-crud]]
  - **✅ RIJEŠENO (2026-07-08, `d57c5fd`):** Playwright SAD ima login — **storageState** obrazac (`tests/auth.setup.js` se prijavi + spremi sesiju; `authenticated` projekt je reusea). `npm run test:authed` pokriva **pozitivan admin-put** (isAdmin=true + admin vidi edit-gumbe) — točno ono što je nedostajalo. Gate-an na `TEST_ADMIN_*` secret (bez njega default suite nepromijenjen). Vidi `docs/TESTING.md §Authenticated`.

### BUG-017 — a11y gate skenirao samo 4 ekrana → CRITICAL axe violationi prošli na produkciju
- Status: ✅ riješen 2026-07-05 (grana `foundation/f3d`, F3 3E.1; NIJE još deployano) · Težina: srednji (a11y, screen-reader korisnici; flashcards/quiz) · Našao: **dubinski axe audit** (svi impact-levovi, sve sekcije) pri 3E.
- **Simptom:** postojeći `tests/a11y.spec.js` (TVRDI gate iz 1D.2) skenirao je samo **landing/browse/learn/profile**. Interaktivne sekcije **flashcards/quiz/fill/progress bile su IZVAN gate-a** → kroz njih su na produkciju prošli **critical** violationi: `button-name` (flashcard `#btnPrev`/`#btnNext` = samo ikona, bez pristupačnog imena → čitač ekrana ne može imenovati) + `select-name` (quiz 3 selecta bez povezane labele). Uz to je gate skenirao learn **presrano** (`state:'attached'` prije punog renderiranja) → propuštao raširen `color-contrast` na learn sadržaju (h3/tablice/box-naslovi, svi predmeti; npr. `--primary` tekst 3.7:1).
- **Popravak:** `data-i18n-aria` (aria-label za ikone-gumbe) + `<label for>` (quiz) + `--danger-text` token + `--primary`→`--primary-dark`/`--primary-light` (kontrast) + `enhanceLearnTables()` (skrolabilne tablice fokusabilne). **Gate PROŠIREN:** „study page" test skenira SVE sekcije (petlja learn/flashcards/quiz/fill/progress).
- **Lekcija:** **TVRDI gate vrijedi samo koliko pokriva.** Coverage-rupa u a11y (ili bilo kojem) gate-u = tiho propuštanje na produkciju. Pri dodavanju gate-a pokrij SVE relevantne ekrane/stanja, i pazi na **timing skena** (skeniraj nakon punog renderiranja, ne `state:'attached'`). [[foundation-pivot]]

### BUG-016 — Landscape mobitel: flashcard lice strši preko Known/Unknown gumba (tap flipa karticu umjesto klika)
- Status: ✅ riješen 2026-07-02 (lokalno, grana `foundation/f2c`) · Težina: srednji (UX, flashcards na landscape mobitelu, svi predmeti) · Našao: **novi funkcionalni Playwright test** (F2 2C.2b) — klik na `#btnCorrect` presretan
- Opis: na landscape mobitelu (npr. iPhone 15 Pro landscape, 852×393) lice kartice (`.flashcard-front`, raste sa sadržajem) **strši ~130px ispod kartice** i prekriva kontrole → tap na Known/Unknown pogodi karticu (flip) umjesto gumba.
- Reprodukcija (prije fixa): mobitel u landscape → bilo koji predmet → Flashcards → kartica s dužim pitanjem → tap na ✓/✗ gumb → kartica se okrene, gumb ne reagira.
- Uzrok (dvostruki, oba relikti od prije BUG-013 grid-stacka; tada su lica bila `absolute` pa fiksne visine nisu smetale): (1) `responsive/03-modes-a11y-print.css` `@media (max-height:500px) and (orientation:landscape)` → **`.flashcard{height:200px}` FIKSNA**; (2) `responsive/04-mobile-extra.css` `@media (max-width:900px) and (orientation:landscape)` → **`.flashcard{max-height:200px}` CAP**. Grid-stack (BUG-013) ispravno raste `.flashcard-inner` (npr. 327px), ali fiksna/capana kartica ostane 220px → lice vidljivo strši preko elemenata ispod (overflow:visible).
- Rješenje (CSS-only): (1) `03`: `height:200px` → `height:auto`; (2) `04`: `max-height:200px` maknut (min-height 150 ostaje). Cache `styles.css?v=20260703` + `03`/`04` importi `?v=20260703`. Dijagnoza geometrijskim probeom (getBoundingClientRect lanca wrapper/card/inner/front + computed styles) — nakon fixa sva 4 sloja identična (339px), gumb ispod kartice.
- Provjera: `tests/app-state.spec.js` flashcards tijek (klik ✓/✗/prev kao korisnik) **8/8 uklj. landscape** + geometrijski probe (wrapper==front) + puni Playwright gate.
- Lekcija: **fiksni `height`/`max-height` na kontejneru čija djeca rastu sa sadržajem = tempirana bomba** — BUG-013 je popravio `01`/`02`, ali ISTI anti-pattern je ostao u `03`/`04` (landscape media blokovi) jer tadašnji testovi nisu KLIKALI kao korisnik. Funkcionalni testovi (stvarni klik, ne `evaluate`) love klasu bugova koje render-smoke ne vidi; sweep za isti anti-pattern napravi po SVIM responsive datotekama, ne samo gdje je simptom viđen.

### BUG-015 — Landing nav se prepuni na mobitelu nakon dodavanja 🌐 jezik-toggle-a (CTA „Start studyin" rezan)
- Status: ✅ riješen + ✅ LIVE 2026-06-28 (`ac68ab0`) · Težina: srednji (vidljiv UX, svaki mobilni posjet landinga) · Prijavio korisnik: 2026-06-28 (screenshot)
- Opis: nakon dodavanja globalnog 🌐 HR/EN prekidača u nav, na mobitelu se primarni CTA **„Start studying" / „Počni učiti" reže** („Start studyin" / „Poč uči"); na tablet/HR širini se duži anchor-labeli (npr. „Kako funkcionira") lome u **2 reda** → nav viši.
- Reprodukcija (prije fixa): otvori www.sokratstudy.com na mobitelu (~390px) → nav-CTA tekst odrezan; ~768–900px → nav-linkovi u 2 reda + CTA rezan.
- Uzrok (višestruki): 🌐 toggle dodao ~75px (gumb+gap) u već tijesan fiksni nav. (1) `.cta-button` ima `width:100%` na ≤767px (za hero gumbe) → u navu se CTA, kao flex-item s `flex-shrink:1`, **stezao i rezao tekst** umjesto da gura višak van. (2) brand-wordmark „Sokrat Study" (~169px) + 4 anchor-linka + toggle + auth + CTA jednostavno **ne stanu** u jedan red u rasponu ~720–1050px. (3) `.lessons-title` nije imao `min-width:0` → dug HR naslov + toggle strši na 320px.
- Rješenje (CSS-only, cache `?v=20260697` na `styles.css`+`landing.css`+`pages.css`): **(a)** `.cta-button.nav-cta{flex-shrink:0; white-space:nowrap; width:auto}` (specifičnost 0,2,0 nadjača `.cta-button{width:100%}`) → CTA nikad više ne reže tekst; logo/toggle/auth također `flex-shrink:0`. **(b)** brand-wordmark `.logo-text{display:none}` na **≤1060px** (brand = sam Sokrat medaljon) → oslobađa ~125px pa anchor-linkovi **ostaju vidljivi** umjesto da nestanu kroz cijeli tablet raspon. **(c)** anchor-linkovi se skrivaju ispod **≤860px** (bilo ≤720; viši prag jer toggle troši širinu) + `white-space:nowrap` da se ne lome; uži razmaci u ≤900 bandu. **(d)** `.lessons-title{min-width:0}` (kao `.study-title`). Datoteke: `css/landing.css`, `css/pages.css`.
- Provjera: Playwright širinski sweep 320→1440px × {EN,HR} = **0 overflowa, 0 rezanja CTA-a** + header-test (browse/lessons/study) 0 overflowa na 320/360/390 + vizualni screenshot 390px (oba jezika čist jedan red). Puni gate: verify 0/0, `test:responsive` **76/76**.
- Lekcija: kad flex-item ima `width:100%` iz drugog konteksta, `flex-shrink:1` ga „sakrije" rezanjem sadržaja umjesto da prijavi overflow — uvijek `width:auto`+`flex-shrink:0`+`white-space:nowrap` na gumbima koji ne smiju izgubiti tekst. Dodavanje **jednog** nav-elementa (toggle) može srušiti tijesan fiksni nav na više breakpointa → testiraj cijeli širinski raspon, ne samo jednu mobilnu širinu. Brand-wordmark je najjeftinija žrtva (ikona ostaje) prije nego žrtvuješ navigacijske linkove.

### BUG-013 — Flashcard: dug tekst na okrenutoj kartici prekrije strelicu „dalje"
- Status: ✅ riješen + ✅ LIVE 2026-06-28 (`213b067`) · Težina: srednji (UX, svi predmeti, kartice s dugim odgovorom) · Prijavio korisnik: 2026-06-27 · Fix: 2026-06-28
- Opis: kad je odgovor dug, **okrenuta (flipped) kartica naraste preko kontrola** ispod nje → strelica „dalje"/„next" je fizički prekrivena i ne da se kliknuti.
- Reprodukcija (prije fixa): bilo koji predmet → Flashcards → kartica s dugim odgovorom → okreni → strelica „dalje" nedohvatljiva.
- Uzrok (dvostruki): (1) `.flashcard-front`/`.flashcard-back` su bile `position:absolute` → **ne rastežu roditelja** `.flashcard-inner`. (2) **Fiksni `height`** na `.flashcard` po breakpointu (350/340/320/300/280 px u `responsive/01` i `02`) → kartica se nije mogla proširiti, pa duga stražnja strana prelije **preko `.flashcard-controls`** (sljedeći element u toku).
- Rješenje (CSS-only, cache `?v=20260694`): **grid-stack** — `.flashcard-inner{display:grid}` + obje strane `grid-area:1/1; position:relative` (umjesto `absolute`) → grid uzme visinu **viša strana** → wrapper naraste → strelice nikad prekrivene; 3D-flip (`backface-visibility`+`rotateY`) ostaje. Plus **svi fiksni `height` na `.flashcard` → `min-height`** (`responsive/01` ×4, `02` ×1) da kartica može narasti. Datoteke: `css/flashcards-section.css`, `css/responsive/01-up-and-phone-breakpoints.css`, `css/responsive/02-mobile-core.css`.
- Provjera: ciljani Playwright (iPhone SE/13/Pro Max, ubačen dug odgovor) — `.flashcard-controls.top` uvijek **ispod** `.flashcard-inner.bottom`, 0 preklapanja; puni gate verify 0/0 + `test:responsive` **68/68**.
- Lekcija: flip-kartice s `position:absolute` stranama NE rastežu roditelja → `height:auto` „kolabira"; **grid-stack** (obje strane u istoj ćeliji) drži auto-visinu. Ali to nije dovoljno ako bilo koji breakpoint nameće **fiksni `height`** — uvijek koristi `min-height` na kontejneru koji mora rasti sa sadržajem.

### BUG-014 — Fill-in: PRAZAN odgovor + „Provjeri" ispada „Correct!"
- Status: ✅ riješen + ✅ LIVE 2026-06-27 (`7c70e07`; node-test 9/9; live potvrđen) · Težina: **visok** (lažni napredak, svi predmeti) · Prijavio korisnik: 2026-06-27
- Opis: U Fill-in-the-blank kvizu, ako se NIŠTA ne upiše i stisne „Provjeri", prikaže se **„Correct!"** (i broji se kao točno) iako je polje prazno.
- Reprodukcija: bilo koji predmet → Fill in → ostavi polje prazno → „Provjeri" → „Correct!".
- Uzrok: [fill-blanks.js:87](../js/fill-blanks.js#L87) uvjet `correct.includes(input)`. Kad je `input === ''`, `string.includes('')` je u JS-u **uvijek `true`** → prazno prolazi. (Isti uvjet je i inače prelabav: jedno slovo `"data".includes("a")` → true.)
- Rješenje: `isCorrect = input.length > 0 && normFill(input) === normFill(correct)` — **prazan unos nikad nije točan**; uklonjen substring-uvjet; zadržana tolerancija velika/mala slova + razmak↔crtica (`normFill` kolabira `[-\s]+`). Node-test (9 slučajeva: prazno/razmaci/točno/velika slova/jedno slovo/crtica↔razmak/kriva/djelomično) → 9/9. Cache `fill-blanks.js?v=20260691`.
- Lekcija: `str.includes(x)` je **uvijek true za `x===''`** — nikad ne koristi `includes` za provjeru točnosti bez praznog-guarda; za fill/grade radije **eksplicitno podudaranje** (normaliziraj pa `===`), ne substring.

### BUG-012 — Randomizirane vježbe se LOME kad sadržaj dolazi iz Supabasea (live)
- Status: ✅ riješen · Težina: visok (živi regres na produkciji) · Nalaz+fix: 2026-06-27
- Opis: Predmeti s interaktivnim vježbama imaju **randomizirane** vježbe definirane funkcijom `generate(p)` na objektu
  vježbe. Pogođeni (broj randomiziranih): **Statistics 23, Macroeconomics 25, Accounting 8** (svi bili u bazi → živo
  pokvareno). **Academic Writing = 0 randomiziranih → bio siguran. Math 29** (još nije bio u bazi). Iz baze su te vježbe
  dolazile bez generiranih polja/odgovora → razbijene (prazno).
- Reprodukcija (prije fixa): predmet s vježbama dok je `CONTENT_FROM_SUPABASE=true` (default) → Exercises → randomizirana → nema brojeva/inputa.
- Uzrok (dvostruki): (1) **`JSON.stringify` briše funkcije** — `migrate-content.js` je slao `content.exercises` kao JSON,
  pa su `generate()` metode nestale (dokaz iz baze: `statisticsExercises` 56 vježbi, 23 s `params`, **0 s `generate`**).
  (2) **Loader je u DB-modu preskakao SVE `content.scripts`** (`js/content-loader.js`), pa se nisu učitali ni `stat-lib`/
  `math-lib`; engine `js/exercises.js` bez `generate` vrati sirov objekt → razbijeno.
- Rješenje (Opcija A, [EXERCISES_DB_FIX_PLAN.md](archive/EXERCISES_DB_FIX_PLAN.md), cigla-po-cigla, sve LIVE 2026-06-27 `801d9a6`):
  1. **catalog `content.codeScripts`** na 5 predmeta s vježbama (lib+exercises.js) — vježbe = KOD, uvijek iz datoteke.
  2. **`content-loader.js`** u DB-modu: study iz baze, ali `codeScripts` (vježbe+lib) i dalje iz datoteke (`filesToLoad = fromDb ? codeScripts : scripts`). Datoteka pregazi eventualni lossy DB red.
  3. **`migrate-content.js`** više ne šalje `content.exercises` u bazu.
  4. **`verify-catalog.js` čuvar**: predmet s vježbama MORA imati codeScripts koji pokriva exercises var — inače `npm run verify` pukne (dokazano).
  5. **Očišćena baza**: obrisana 4 reda vježbi (`delete ... where var_name like '%Exercises'`). 6. **Math gradivo migrirano** (`mathM1/M2/Final`, bez vježbi) → 51 red / 17 predmeta / 0 redova vježbi. Cache `20260690`.
- Lekcija: payload s **funkcijama** NIJE JSON-migracijski — read-path iz baze smije nositi samo čisto-podatkovne window-varove
  (M1/M2/Final). Vježbe (kod) uvijek iz datoteke. Pri novom „content iz baze" uvijek provjeri i `generate()` put, ne samo 4 osnovna moda.
  Loader je bio „sve-ili-ništa" po predmetu → čišćenje baze mora doći **tek nakon** što je loader-fix LIVE (inače nestanu i statične vježbe).
- **Nadopuna (F2 2A, 2026-07-02):** pravilo VRIJEDI i za novi **JSON dual-read** — exporter (`export-content-json.js`)
  exporta SAMO razriješene lekcijske varove (nikad `content.exercises`), a loader u JSON-modu učita `codeScripts` iz `.js`
  (isti obrazac kao DB-mod). Dokazano testom `dual-read.spec.js` (statistics: study iz JSON-a, `statisticsExercises`+`StatLib` iz `.js`).

### BUG-011 — Exercises: Practice i Exam mod su funkcionalno isti
- Status: ✅ riješen · Težina: srednji · Datum: 2026-06-11 (nalaz i fix isti dan)
- Opis: Prebacivanje Practice ↔ Exam ne mijenja gotovo ništa. Korisnik: „nema nikakve razlike trenutno."
- Uzrok: jedina razlika bila je `showHints = mode !== 'exam'` (numeric/ratio); `checkOpen`/`mark`/feedback nisu primali mod
  → po-stavci zeleno/crveno + točni odgovori bili isti u oba moda.
- Fix (`js/exercises.js`): `checkOpen`/`renderFeedback` sad primaju `currentMode`. **Exam** preskače `widget.mark` (bez po-stavci
  označavanja/otkrivanja) i prikazuje **SAMO rezultat** („Score: X / Y (Z%)"); **Practice** zadržava punu povratnu info + hintove.
  Dodan **opis aktivnog moda** (`MODE_DESC` → `.ex-mode-desc`) ispod mode-bara da je razlika odmah vidljiva. Engine ostao generički.
- Provjera: ciljani Playwright (exam = samo rezultat, 0 `.is-correct`; practice marks; hint practice↔exam) + node 95/95 + 36/36. Cache `?v=20260631`.

### BUG-010 — Exercises lista: nije po poglavlju + stari demoi (uklj. 2 K2) zatrpavaju K1
- Status: ✅ riješen · Težina: srednji · Datum: 2026-06-11 (nalaz i fix isti dan)
- Opis: Popis vježbi „razbacano": redoslijed nije po poglavlju, na vrhu demo-vježbe iz FAZE 1/2; 2 K2 demoa
  (`k2-ratio-restaurant-1` CH9, `k2-numeric-depreciation-1` CH11) virila u K1 popis.
- Uzrok: `renderList` je iscrtavao redoslijedom u nizu (bez sortiranja po `chapter`); sve u jednoj lekciji `accounting-fundamentals`.
- Fix: `renderList` (`js/exercises.js`) **sortira po `ex.chapter`** (uzlazno, stabilno) + **naslovi poglavlja** („Chapter N", `.ex-list-head`);
  kartica više ne nosi „Ch N" tag. **Demoi maknuti** (odluka korisnika = opcija A) iz `data/accounting/exercises.js` — obrisano 7 demoa,
  **zadržan** `k1-statement-bs-1` (pravi Ch4). Sadržaj sad **16 vježbi, čisti K1 (Ch1–6)**. Unit test prebačen na inline fixture
  (ne ovisi o obrisanom demou). Dublji red (K2 vježbe odu u svoju lekciju) doći će s FAZOM 4 (split lekcija).
- Provjera: ciljani Playwright (naslovi „Chapter 1..6" u redu, 16 kartica, 0 demo-ID-eva) + verify 0/0 + 36/36. Cache `?v=20260631`.

### BUG-009 — Entrepreneurship fill-blank se ne renderira (6 umjesto 7 podvlaka)
- Status: ✅ riješen · Težina: nizak (kozmetički, 1 predmet) · Datum: 2026-06-10
- Opis: U `data-entrepreneurship.js` (kategorija `tourism`, fill-blank #0) rečenica je glasila
  „Tourism entrepreneurship requires `______`-term investment." — praznina je imala **6** podvlaka.
- Uzrok: `js/fill-blanks.js` (renderQuestion) radi `q.sentence.replace('_______', …)` — traži **točno
  7-znakovni** token `_______`. Niz od 6 podvlaka se ne podudara → praznina se ne zamijeni span-om.
- Posljedica: korisnik vidi doslovno `______-term` bez polja za upis; pitanje se ne može riješiti.
- Dijagnoza: potpuna content-revizija (audit svih predmeta) — strukturni validator prijavio `badFill:1`
  baš u Entrepreneurshipu; lokaliziran na taj jedan blank.
- Rješenje: 6 → 7 podvlaka (`_______-term`). Re-audit: Entrepreneurship 53 fill / 0 loših; cijeli projekt
  0 loših fill. `CONTENT_VERSION` 20260618→20260619 + bump `content-loader.js?v=20260619`. Verify 0, Playwright 36/36.
- Lekcija: fill-blank token je **fiksnih 7 podvlaka** — bilo koji drugi broj tiho razbije render.
  Strukturni audit (`includes('_______')`) treba pokretati pri svakoj content-izmjeni; sad je dio rutinske revizije.

### BUG-001 — Slomljen CSS: nedovršeno pravilo `.quiz-section, .fill-section,`
- Status: ✅ riješen · Težina: visok · Datum: 2026-06-01
- Opis: U `responsive.css` (landscape blok) stajao je selektor `.quiz-section,
  .fill-section,` bez `{...}` bloka.
- Uzrok: nedovršena/ostavljena izmjena.
- Posljedica: CSS parser u error-recovery "proguta" sljedeći `@media (max-width:767px)`
  blok (pravila koja drže mobilnu navigaciju vidljivom), pa su odbačena.
- Rješenje: uklonjen nevažeći selektor; `@media` se sada uredno zatvara.
- Lekcija: nakon CSS izmjena pokreni brace-balance/parse provjeru; nikad ne ostavljaj
  selektor bez bloka.

### BUG-002 — Slomljen CSS: sirotinjski `.topic-*` blok + višak `}`
- Status: ✅ riješen · Težina: srednji · Datum: 2026-06-01
- Opis: izvan ijednog `@media` stajala su `.topic-*` pravila i jedan višak `}`.
- Uzrok: stara struktura markupa; klase se više ne koriste (mrtav CSS).
- Rješenje: uklonjen mrtav/malformiran blok; zagrade sada balansirane (520/520).
- Lekcija: mrtvi CSS (klase kojih nema u HTML-u) skuplja se i postaje izvor grešaka —
  vrijedi povremeno čistiti.

### BUG-003 — Learn sekcija "viri" / horizontalni overflow na iPhonu
- Status: ✅ riješen i VERIFICIRAN (Playwright) · Težina: visok · Datum: 2026-06-01
- Opis: korisnik prijavio da Learn sekcija nije dobra na modernim iPhonima —
  konkretno sadržaj viri / stranica izgleda odzumirano (horizontalni overflow).
- Dijagnoza (Playwright proba, iPhone 393px): lanac širine pokazao da su `body` i
  `.study-page` ispravno 393px, ali `main.study-content` naraste na **1200px**
  (svoj `max-width`), gurajući cijelu stranicu preko ekrana (page scrollWidth=1200).
- Uzrok: `.study-content` je flex-dijete (`.study-page` je `display:flex`) BEZ
  `min-width:0`. Default `min-width:auto` ne da mu se skupiti ispod min-content
  širine nerazlomljivog sadržaja (npr. `.learn-filter` chip-bar, `white-space:nowrap`,
  `flex-shrink:0`), pa naraste do `max-width:1200px`. Klasični flexbox overflow bug.
- Rješenje: `min-width:0` + eksplicitni `width:100%` na `.study-content`; obrambeni
  `min-width:0` na `#learn`, `.learn-container`, `.learn-content`. Plus raniji
  popravci: dedupliciran donji padding i landscape safe-area inset.
- Verifikacija: `npm run test:responsive` — 4/4 profila (iPhone SE 375, 15 Pro 393,
  Pro Max 430, landscape 852), svih 8 predmeta: `innerWidth==docScrollW==deviceWidth`,
  bez page overflowa. (Filter-chipovi i tablice imaju namjerni interni scroll.)
- Lekcija: flex-djeca s `max-width` i nerazlomljivim sadržajem TREBAJU `min-width:0`,
  inače probiju viewport na mobitelu. Uvijek mjeri širinu LANCA roditelja, ne samo
  `innerWidth` (koji se naduje pri prelijevanju i može sakriti bug).

### BUG-004 — Stari CSS nakon deploya (immutable cache + neverzionirani @import)
- Status: ✅ riješen · Težina: visok · Datum: 2026-06-02
- Opis: `vercel.json` postavlja `Cache-Control: immutable` (1 god.) na sve `.css`, a
  `styles.css` je uvozio `css/*.css` BEZ `?v=`. Nakon deploya preglednik bi i dalje
  servirao stari cache → popravak "nevidljiv".
- Rješenje: dodан `?v=YYYYMMDD` na sve `@import` u `styles.css` + bump `styles.css?v=`
  u `index.html`.
- Lekcija: pri SVAKOJ izmjeni CSS-a bumpaj `?v=` token (komentar je u `styles.css`).
  Inače deploy izgleda kao da "nije prošao".
- **Nadogradnja (F3 3C.1, 2026-07-04, ADR-017):** klasa strukturno zatvorena za *parcijalni* zaborav. `npm run bump` postavlja **sve** `?v=`
  tokene + `CONTENT_VERSION` na isti timestamp odjednom (ručni per-file bump ukinut), a **`npm run bump:check` = TVRDI CI gate** koji pada ako
  tokeni nisu identični. Ostatak („zaboravio pokrenuti bump uopće") zatvara 3C.2 (git-diff freshness / auto-bump na deploy-u).

### BUG-005 — Landing hero "Free exam toolkit" bedž pada pod fiksnu nav-traku (mobitel)
- Status: ✅ riješen i VERIFICIRAN (Playwright) · Težina: srednji · Datum: 2026-06-03
- Opis: Na iPhoneu gornji dio hero sadržaja (bedž "Free exam toolkit", ponekad i naslov)
  bio je djelomično skriven ispod fiksne `.landing-nav` trake.
- Dijagnoza (Playwright, iPhone 393): `padding-top` hero-a računao se na **24px**, a traka je
  visoka ~63px → bedž na y=24, unutar trake. `--nav-h` (72px) je bio definiran, ali se moj
  `calc()` u `landing.css` nije primjenjivao na mobitelu.
- Uzrok: `css/responsive.css` (učitava se ZADNJI, POSLIJE `landing.css`) ima
  `@media (max-width:767px) .landing-hero { padding-top: calc(1.5rem + var(--safe-top)) }` (=24px),
  iz vremena PRIJE fiksne trake. Landing rebuild (sesija 14) dodao je fiksni nav + `padding-top:5rem`
  u `landing.css`, ali stari mobilni override u responsive.css ga je **tiho pregazio** (ista
  specifičnost → kasniji import pobjeđuje). Desktop je radio; svi telefoni (≤767px) ne.
- Rješenje: uveden `--nav-h` (variables.css) kao **jedinstveni izvor**; hero `padding-top`
  (landing.css + mobilni override u responsive.css) i `scroll-margin-top` vezani uz
  `calc(var(--nav-h) + var(--safe-top) + jastuk)`. Logo `white-space:nowrap` + slim nav na ≤480px
  (da traka ostane predvidive visine = `--nav-h`). Bump `?v=20260606`.
- Verifikacija: novi `landing.spec.js` test "hero badge clears the fixed top nav"
  (`badge.top ≥ nav.bottom`) na sva 4 iPhone profila. Suite **36/36**.
- Lekcija: (1) `responsive.css` se učitava ZADNJI i **tiho gazi modul-CSS na mobitelu** — pri
  dodavanju layout pravila u `landing.css`/`pages.css` provjeri postoji li mobilni override u
  `responsive.css`. (2) Vizualni testovi trebaju hvatati i **PREKLAPANJE fiksnih elemenata**, ne
  samo horizontalni overflow. (3) Magični brojevi za offset fiksne trake → vezati uz jednu varijablu.

### BUG-006 — Learn filter-bar reže nazive kategorija ("The Product" → "The")
- Status: ✅ riješen · Težina: nizak (kozmetički) · Datum: 2026-06-06
- Opis: korisnik prijavio (Marketing → Final Exam) da su čipovi u gornjem learn-baru
  nečitljivi/dvosmisleni: "The" (= The Product), "Price" (= The Price), "Segmentati", "Distributi".
- Uzrok: `updateLearnFilters()` u `js/progress.js` namjerno je radio "shortName" =
  PRVA riječ naziva rezana na 10 znakova (uz 2.-riječ fallback na koliziju). Radilo dok su
  nazivi bili kratke jedne riječi (npr. BI "Hardware"); Marketing finalni spaja 13 kategorija s
  višerječnim i "The X" nazivima koje heuristika mrcvari. **NIJE funkcionalni bug** —
  `data-filter` koristi puni ključ kategorije, filtriranje je radilo ispravno.
- Rješenje (Opcija A): čip pokazuje **puni `data.name`**. Bar je već `overflow-x:auto` +
  `white-space:nowrap`, pa dugi nazivi samo skrolaju vodoravno (potvrđeno: 0 page-overflowa).
  Uklonjena `usedNames`/`substring` logika. Bump `progress.js?v=20260609`.
- Verifikacija: ciljani temp-test (4 profila) — čipovi = puni nazivi (npr. "The Product",
  "Segmentation and Positioning", "Exam Practice (All Topics)"), `pageOverflow=false`; suite **36/36**.
- Lekcija: heuristike za skraćivanje teksta su krhke kad se podaci prošire — kad UI već ima
  skrolabilni kontejner, radije pokaži puni tekst nego "pametno" rezanje koje stvara dvosmislenost.

### BUG-007 — Learn filter-bar: čipovi rezani na rubovima + skriveni scroll (svi predmeti)
- Status: ✅ riješen · Težina: srednji (UX) · Prijavljeno+riješeno: 2026-06-06
- Opis: nakon BUG-006 (puni nazivi), bar je rezao čipove na rubovima — lijevo pola čipa, desno
  zadnji odsječen („Promotic…") — i nije bilo naznake da se skrola (skriven scrollbar). Na svim
  predmetima, najgore kod finala (Marketing 13 / BI 11 kategorija).
- Uzrok: (1) **`justify-content: center`** na skrolabilnom `.learn-filter` (`learn.css`, `@media ≥1024px`)
  gurao prve čipove preko lijevog ruba (lijevi overflow nedohvatljiv skrolom) → trajni lijevi rez.
  (2) Skriven scrollbar (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`) → nema afordancije skrola.
- Rješenje (Opcija B — izbor korisnika): u `css/learn.css` — tanak **vidljiv scrollbar** (`scrollbar-width:thin`
  + stilizirani webkit thumb, 6px), **rubni gradijent-fade** preko `mask-image` (klase `.can-scroll-left/right`),
  i `.learn-filter.is-scrollable { justify-content:flex-start }` koji gazi `center` SAMO kad bar prelazi širinu
  (kratke liste i dalje centrirane). U `js/progress.js` dodan `updateLearnFilterScrollHints()` (postavlja
  is-scrollable/can-scroll-* na temelju `scrollLeft`/`scrollWidth`), pozvan iz `updateLearnFilters` + vezan na
  `scroll` i **`ResizeObserver`** (hvata i prijelaz skriveno→vidljivo). Bump `learn.css`+`progress.js` `?v=20260610`
  (+ `styles.css` token).
- Verifikacija: ciljani temp-test (4 iPhone profila + desktop 1280px): na startu `can-scroll-right`, na kraju
  `can-scroll-left`, **prvi čip nije odrezan** (`firstLeftClip=0`), desktop `justify=flex-start`, `pageOverflow=false`;
  puni suite **36/36**.
- Lekcija: `justify-content:center` + `overflow:auto` reže/zaključava rubove — centriraj samo kad NEMA overflowa
  (`is-scrollable` klasa). `ResizeObserver` na skrolabilnom elementu je pouzdan okidač za remjeru kad postane vidljiv.

### BUG-008 — Globalni footer + toast bez baznog CSS-a (goli blokovi lijevo-dolje)
- Status: ✅ riješen · Težina: srednji (UX) · Datum: 2026-06-06
- Opis: korisnik javio da „© 2026 All Rights Reserved by Leon Kreso" stoji ružno lijevo-dolje, preko sadržaja,
  na svim stranicama (a Landing ima i svoj bogati footer → duplikat). Tik iznad njega i toast „ⓘ Message".
- Uzrok: **bazni CSS za `.toast` i `.footer` nije postojao** (u `css/` su ostali samo responsive override-i;
  vjerojatno izgubljeno u ranijem refaktoru). Bez baznog stila: (1) `.toast` (koji `showToast()` u `js/utils.js`
  pokazuje preko `.show`) renderirao se kao stalni goli blok „Message"; (2) globalni `<footer class="footer">`
  (sibling svih stranica u `index.html`) prikazivao se kao goli blok copyrighta na dnu svake stranice.
- Rješenje (`css/pages.css`): dodan bazni `.toast` (fiksan, `opacity:0`/`pointer-events:none`, otkriva se s `.show`)
  i bazni `.footer` (centriran, suptilan, `border-top`, normalan tok). Globalni footer **skriven na Landing/Browse**
  preko `body:has(.landing-page.active) .footer, body:has(.browse-page.active) .footer { display:none }`
  (Landing ima svoj footer; Browse je biranje predmeta). Bump `pages.css`/`styles.css` `?v=20260611`.
- Verifikacija: ciljani temp-test (4 profila) — footer `display`: landing=none, browse=none, **study=block**;
  toast `opacity=0`, `position=fixed`, bez `.show`; puni suite **36/36**.
- Lekcija: pri modularizaciji/refaktoru CSS-a lako se izgubi BAZNO pravilo a ostanu samo override-i u media
  queryjima (koji bez baze ne rade) — provjeri da svaki override ima bazu. `:has()` čisto rješava „sakrij globalni
  element ovisno o aktivnoj stranici" bez JS-a.

---

### Predložak (kopiraj za novi bug)
```
### BUG-001 — <kratak naslov>
- Status: 🔴 otvoren
- Težina: srednji
- Datum: 2026-06-01
- Opis:
- Reprodukcija:
- Uzrok:
- Rješenje:
- Lekcija (kako spriječiti ubuduće):
```
