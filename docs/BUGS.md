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

### BUG-013 — Flashcard: dug tekst na okrenutoj kartici prekrije strelicu „dalje"
- Status: ✅ riješen (lokalno; gate zelen, čeka deploy) · Težina: srednji (UX, svi predmeti, kartice s dugim odgovorom) · Prijavio korisnik: 2026-06-27 · Fix: 2026-06-28
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
- Rješenje (Opcija A, [EXERCISES_DB_FIX_PLAN.md](EXERCISES_DB_FIX_PLAN.md), cigla-po-cigla, sve LIVE 2026-06-27 `801d9a6`):
  1. **catalog `content.codeScripts`** na 5 predmeta s vježbama (lib+exercises.js) — vježbe = KOD, uvijek iz datoteke.
  2. **`content-loader.js`** u DB-modu: study iz baze, ali `codeScripts` (vježbe+lib) i dalje iz datoteke (`filesToLoad = fromDb ? codeScripts : scripts`). Datoteka pregazi eventualni lossy DB red.
  3. **`migrate-content.js`** više ne šalje `content.exercises` u bazu.
  4. **`verify-catalog.js` čuvar**: predmet s vježbama MORA imati codeScripts koji pokriva exercises var — inače `npm run verify` pukne (dokazano).
  5. **Očišćena baza**: obrisana 4 reda vježbi (`delete ... where var_name like '%Exercises'`). 6. **Math gradivo migrirano** (`mathM1/M2/Final`, bez vježbi) → 51 red / 17 predmeta / 0 redova vježbi. Cache `20260690`.
- Lekcija: payload s **funkcijama** NIJE JSON-migracijski — read-path iz baze smije nositi samo čisto-podatkovne window-varove
  (M1/M2/Final). Vježbe (kod) uvijek iz datoteke. Pri novom „content iz baze" uvijek provjeri i `generate()` put, ne samo 4 osnovna moda.
  Loader je bio „sve-ili-ništa" po predmetu → čišćenje baze mora doći **tek nakon** što je loader-fix LIVE (inače nestanu i statične vježbe).

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
