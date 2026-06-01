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
