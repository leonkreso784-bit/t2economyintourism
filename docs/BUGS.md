# Bugovi & Lekcije naučene

Pratimo greške i učimo iz njih. Aktivne bugove gore, riješene + lekcije dolje.

## Kako bilježimo
- **ID:** BUG-NNN
- **Status:** 🔴 otvoren · 🟡 u radu · ✅ riješen
- **Težina:** kritičan / visok / srednji / nizak
- Opis · Koraci za reprodukciju · Uzrok · Rješenje · **Lekcija**

---

## Aktivni
*(nema)*

---

## Riješeni / Lekcije

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
