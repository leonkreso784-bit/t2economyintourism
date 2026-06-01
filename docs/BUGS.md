# Bugovi & Lekcije naučene

Pratimo greške i učimo iz njih. Aktivne bugove gore, riješene + lekcije dolje.

## Kako bilježimo
- **ID:** BUG-NNN
- **Status:** 🔴 otvoren · 🟡 u radu · ✅ riješen
- **Težina:** kritičan / visok / srednji / nizak
- Opis · Koraci za reprodukciju · Uzrok · Rješenje · **Lekcija**

---

## Aktivni
- ⏳ Čeka vizualnu potvrdu: Learn sekcija na modernim iPhonima — primijenjeni
  popravci (BUG-003), ali treba screenshot/potvrda da je doživljaj sada "savršen".

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

### BUG-003 — Learn sekcija: loša responzivnost na telefonu (iPhone)
- Status: ✅ popravljeno (čeka vizualnu potvrdu) · Težina: visok · Datum: 2026-06-01
- Opis: korisnik prijavio da Learn sekcija nije dobra na modernim iPhonima.
- Uzroci (nađeni pregledom): (a) trostruko nagomilan donji padding (learn-container
  90px + study-content ~86px + study-page 80px) → velik prazan prostor; (b) nedostaje
  bočni safe-area inset u landscape → notch/Dynamic Island prekriva sadržaj.
- Rješenje: learn-container donji padding 90px→24px (klirens daje study-content);
  dodan `@media (orientation: landscape)` safe-area L/R za learn-container (svi widthovi).
- Lekcija: na modernim iPhonima OBAVEZNO safe-area insets i u landscape (ne samo top);
  izbjegavaj gomilanje paddinga kroz ugniježđene kontejnere.
- TODO: vizualna potvrda (screenshot iPhone 15/16, portret + landscape).

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
