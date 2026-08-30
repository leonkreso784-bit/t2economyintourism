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

### BUG-039 — Ljestva širine kviza i dva pravila za male telefone su MRTVI: kasniji širi upit gasi raniji uži

- Status: 🔴 **otvoren** — svjesno odgođen, jer ispravak je **odluka o izgledu**, a našao ga je
  migracijski korak (C5a/3, spec §11.3) · Težina: **nizak** — sve je upotrebljivo, samo nije ono
  što je napisano · Našao: **mjerenje pred migraciju C5a/3**, ne prijava.

- **Opis / izmjereno** (Chromium, ruta `#/subject/te2/first-midterm/quiz`):

  | širina prozora | `.quiz-container` `max-width` **stvarno** | što je NAPISANO |
  |---|---|---|
  | 768–1023 | **650 px** | `05` → 600 px |
  | 1024–1279 | **650 px** | `05` → 700 px |
  | 1280–1535 | **650 px** | `05` → 800 px |
  | ≥ 1536 | **650 px** | `05` → 900 px |

  Na monitoru od 1920 px kviz je dakle širok 650 px. Isti mehanizam na drugom kraju ljestve:
  `01 @max-374` piše `.answer-btn { padding: 0.75rem; font-size: 0.85rem }` i
  `.question-card h2 { font-size: 1rem }`, pa na telefonu od 320 px ništa od toga ne vrijedi —
  gumbi odgovora imaju iste razmjere kao na 767 px.

- **Uzrok:** medijski upit **ne nosi specifičnost**. Kad dva pravila imaju isti selektor,
  presuđuje **redoslijed izvora**, a ne to koje je „preciznije". `responsive/06` je zadnja
  datoteka u nizu, pa njezin `@media (min-width: 768px) { max-width: 650px }` gasi četiri
  uža upita iz `05`; `responsive/02` (`max-width: 767px`) iz istog razloga gasi `01`
  (`max-width: 374px`). **Ista mehanika kao BUG-037**, samo na širini umjesto na orijentaciji —
  a to je već treći put da se pojavi, pa je riječ o obrascu, ne o slučaju.

- **➕ ČETVRTA POJAVA (C5a/4, 2026-08-30) — `.progress-overview`:** `responsive/01` piše dvije
  prečke za mrežu kartica napretka (`@768: 1fr 1fr`, `@1024: 1fr 1fr 1fr`, uz `gap: 1.5rem`).
  Iscrtava se **nijedna**: `responsive/06` nosi vlastitu ljestvu na ISTIM pragovima (`@480` 2
  stupca, `@768` **3**, `@1024` **4**, `gap: 1rem`) i, budući da je zadnja datoteka, uzima sve.
  Izmjereno: `gap` je **16 px na svakoj širini**, a stupaca je 2/3/4 ondje gdje je `01` tražio
  −/2/3. Ovdje ni „uži upit" nije bio u igri — pragovi su **isti**, pa je presudio isključivo
  redoslijed datoteka. To je najčišći oblik ovog buga koji smo dosad vidjeli.

  Uz to je u istoj cigli nađen i **cijeli mrtvi blok** u `responsive/04` („ANALYTICS/PROGRESS
  SECTION MOBILE", deset pravila, osam za selektore kojih nema nigdje u `*.html`/`js/**`).
  To NIJE isti razred — nije redoslijed nego markup koji se promijenio bez CSS-a — ali je
  nađeno istim mjerenjem, pa stoji ovdje da se ne izgubi.

- **Zašto NIJE popravljeno u C5a/3:** cigla je migracija i njezin je izlazni uvjet `css:diff`
  s nula razlika. „Popravak" bi značio odlučiti **koliko širok kviz treba biti na velikom
  monitoru** i **koliko sitan na 320 px** — dvije odluke o izgledu koje nijedna brana ne mjeri.
  Mrtva pravila su zato **obrisana** (brisanje ne mijenja izračunati stil), a namjera je
  zapisana ovdje s brojkama.

- **Rješenje (kad se radi):** odlučiti ciljne širine i napisati ih **na jednom mjestu** —
  u `css/quiz-section.css`, gdje ljestva sada i živi, pa redoslijed datoteka više ne može
  presuditi umjesto autora. Prirodno mjesto: **C5a/4 ili C7**, zajedno s BUG-037.

- **Lekcija:** *uži upit ne pobjeđuje širi — kasniji pobjeđuje raniji.* Dokle god su pragovi
  razasuti po šest datoteka, „napisao sam pravilo za 1536 px" ne znači da će se ono iscrtati.
  Zato cigle ove faze sabiru ljestvu **uz komponentu**: ne radi urednosti nego zato da autor
  vidi cijelu ljestvu odjednom i da redoslijed prestane biti nevidljiv.

---

### BUG-037 — Kartica u landscapeu telefona traži 280 px visine u pojasu od 205 px, a dva pravila pisana protiv toga su mrtva

- Status: 🔴 **otvoren** — ⚠️ **preusmjeren 2026-08-30 (C5a/4)**: landscape ispod 768 px JEST
  izmjeren u toj cigli, ali ekran **nije ušao u branu** — 22 nalaza na 568 × 320 pripadaju
  consentu (banner od 123 px na ekranu visokom 320) i donjoj traci (gumb ispod bočnog izreza),
  dakle **C6 i C7**, a osnovica `phone-baseline.json` je prazna i to joj je vrijednost.
  Brojke i obrazloženje: `BACKLOG.md` §TELEFON POLEGNUT + spec §11.4. **Ovaj bug time čeka C7**,
  zajedno s BUG-039 · Težina: **nizak** — ekran je upotrebljiv, traži skrol · Našao:
  **mjerenje pred migraciju C5a/2**, ne prijava.

- **Opis / izmjereno** (Chromium, `hover:none` + `pointer:coarse`):

  | ekran | `min-height` kartice | visina kartice | slobodno između gornje trake i donje |
  |---|---|---|---|
  | 568 × 320 | 280 px | 280 px | **205 px** |
  | 667 × 375 | 280 px | 280 px | **260 px** |
  | 736 × 414 | 280 px | 280 px | 299 px (stane) |

  Kartica time strši ispod donje trake, a gumbi „Znam / Ne znam" dolaze tek iza nje.

- **Uzrok:** DVA pravila napisana baš protiv toga su **mrtva**:
  `responsive/04` → `@media (max-width:900px) and (orientation:landscape) { .flashcard { min-height:150px } }`
  (nosilo je i komentar o BUG-016, dakle netko je na to već jednom mislio) i
  `responsive/05` → `@media (max-height:500px) and (orientation:landscape) { … 220px }`.
  Oba tuče **kasniji** `responsive/06` →
  `@media (max-width:767px) and (hover:none) and (pointer:coarse) { .flashcard { min-height:280px } }`,
  koji o orijentaciji ne zna ništa i nikad nije ni namjeravao presuditi landscape.

- **Zašto se NE popravlja u C5a/2:** ispravak nije jednoznačan (150 ili 220?) i mijenja razmjere
  ekrana koji **nijedna brana ne mjeri** — `phone-gate` landscape mjeri na 852 px, gdje donja
  traka ne postoji. Migracijska cigla seli jezik, ne izgled. Brojke iz ove tablice su upravo ono
  što je spec §11.1 tražio da se pribavi „s izmjerenim brojkama, ne prije".

- **✅ LEONOVA PRESUDA (2026-08-30): *„Oke nije toliki problem"*.** Ostaje otvoren **svjesno**, ne
  zaboravljeno. Ne popravlja se ni u C5a/2 ni prije C5a/4; brojke iz tablice gore su ono što je
  spec §11.1 tražio da postoji **prije** odluke, i sada postoje.

- **Lekcija (ista obitelj kao C5a/1 ③):** **pravilo koje ne zna za tuđu os tiho presuđuje i o
  njoj.** Upit po ŠIRINI i vrsti pokazivača pobijedio je dva upita po ORIJENTACIJI samo zato što
  je napisan kasnije. Redoslijed datoteka je time postao skrivena politika.


---

## Riješeni / Lekcije

### BUG-038 — Brojači na ekranu dopuna nisu imali NIJEDNO pravilo, a isti blok na karticama jest

- Status: ✅ **riješen** (2026-08-30, cigla C5a/2) · Težina: **nizak** (kozmetika, ništa se ne
  gubi) · Našao: **mjerenje pred migraciju** — `.fill-stats` se pojavio u markupu, a u CSS-u ga
  nema nigdje.

- **Opis:** ista dva brojača („Correct" / „Wrong") stoje na oba ekrana i imaju isti markup, ali
  su se crtali različito:

  | | ekran kartica | ekran dopuna |
  |---|---|---|
  | spremnik | `flex`, centrirano, razmak 48 px | `block` — brojači jedan ISPOD drugoga |
  | brojka | zelena/crvena, `font-weight: 600`, ikona uz tekst | zadana tinta, 400, ikona iznad |

- **Reprodukcija:** otvori lekciju → način **Dopune** → pogledaj dno ekrana. Usporedi s načinom
  **Kartice**.

- **Uzrok:** `css/flashcards-section.css` je pravila pisao kroz **`.flashcard-stats .stat…`** —
  selektor vezan uz spremnik kartica. Kad je isti blok kasnije dodan na ekran dopuna pod imenom
  `.fill-stats`, pravila ga nisu mogla dohvatiti, a nitko nije napisao njihov parnjak. Nijedna
  brana to ne vidi: `check:orphan-css` traži klase BEZ elementa, a ovdje je obrnuto — **element
  bez pravila**, što nijedan naš gate ne mjeri.

- **Rješenje (C5a/2):** raspored je otišao u markup, jednak na oba mjesta
  (`flex justify-center gap-12` na spremniku, `flex items-center gap-2 font-semibold` na
  brojaču), a u CSS-u je ostalo samo **značenje boje**, prepisano s
  `.flashcard-stats .stat.correct` na **`.stat.correct`**. Provjereno da `.stat` u dokumentu
  postoji isključivo na ta dva mjesta — kviz koristi `.result-stat`.

- **✅ LEON JE PROMJENU VIDIO I ODOBRIO (2026-08-30): *„Jesi nema problema i svaka čast"*.**
  Zapisano jer je ovo **jedina vidljiva promjena izgleda** koju je cigla C5a/2 napravila — bez ove
  rečenice sljedeća sesija čita da je izgled promijenjen na svoju ruku.
  ➕ Uz to je rekao i **što ekran napretka NIJE** (analitika o karticama ga ne zanima, grafikoni
  dolaze kasnije) — zapisano u `BACKLOG.md`, jer to mijenja ciglu **C5a/4**.

- **Lekcija:** **selektor vezan uz spremnik je obećanje da će se drugi spremnik zaboraviti.**
  `.flashcard-stats .stat` je izgledao urednije od `.stat`, a značio je da drugi ekran s istim
  blokom tiho ostaje bez stila. I: **nemamo branu za element bez pravila.** Ovaj se našao samo
  zato što je cigla čitala CSS i markup jedno uz drugo — `css:diff` ga ne vidi (obje verzije
  jednako nestilizirane), `check:orphan-css` gleda drugi smjer.

---

### BUG-036 — Donja traka učenja u landscapeu sjeda U pojas kućnog indikatora (sigurni rub pojela KRATICA)

- Status: ✅ **riješen** (2026-08-30, cigla C5a/1) · Težina: **nizak** — i to se izriče pošteno:
  pogađa samo uređaje **uže od 768 px U LANDSCAPEU** koji uz to imaju donji izrez, a današnji
  iPhonei su u landscapeu svi širi od 768 px, gdje je traka ionako skrivena. Nije se dakle
  događalo Leonu na iPhoneu 16 · Našao: **mjerenje pred migraciju**, ne prijava.

- **Opis:** `.study-mobile-nav` je u landscapeu dobivao `padding-bottom: 4px` uz sigurni rub od
  **21 px** — donjih ~17 px trake, zajedno s dnom gumba, završavalo je ispod kućnog indikatora.
  Izmjereno na 568 × 320 uz `--safe-bottom: 21px`.

- **Reprodukcija:** otvori bilo koju lekciju na uređaju užem od 768 px u landscapeu, s donjim
  izrezom. Donji rub gumba u traci ulazi u pojas indikatora.

- **Uzrok — i to je cijela lekcija:** pravilo u `css/responsive/04-mobile-extra.css` glasilo je

  ```css
  @media (max-width: 900px) and (orientation: landscape) {
      .study-mobile-nav { padding: 0.25rem 0; }
  }
  ```

  **Kratica `padding` piše sve četiri strane.** Namjera je bila „stisni gornji i donji rub jer je
  ekran nizak", a učinak je bio i **brisanje `padding-bottom: var(--safe-bottom)`** koje je
  dolazilo iz bezuvjetnog pravila na kraju `responsive`-a. Sigurni rub nigdje nije bio pogrešno
  izračunat — bio je **pregažen kraticom koja o njemu ne zna**.

- **Rješenje:** kromo je u C5a preseljen u `css/study-chrome.css`, gdje ploha ima JEDNO pravilo
  za `padding`, a landscape mijenja samo donju stranu (`calc(0.25rem + var(--safe-bottom))`).
  Popravak je najmanji mogući: gornji rub ostaje 0.25rem, donji dobiva natrag ono što mu je uzeto.
  Izmjereno poslije: 568 × 320 → `padding-bottom` **4 → 25 px**, portret nepromijenjen.

- **Zašto ga nije vidjela nijedna brana** — i opet nije previd nego **doseg**:
  `check:safearea` provjerava da se goli `env()` ne piše izvan `css/variables.css`, a ovo pravilo
  `env()` uopće ne spominje — ono ga **briše**. *Brana mjeri gdje se sigurna zona DEFINIRA, ne
  gdje se POJEDE.* `phone-gate` landscape mjeri na **852 × 393**, dakle na širini na kojoj traka
  ne postoji, pa do nje nikad nije ni došao.

- **Lekcija:** razred kvara je **„kratica gazi svojstvo koje netko drugi izračunava"** i rođak je
  BUG-035 („ispuna i tekst se odlučuju na dva mjesta"). Pravilo koje iz toga slijedi i vrijedi za
  ostatak faze: **na plohi koja nosi sigurni rub ne piše se kratica `padding`** — piše se strana
  koja se stvarno mijenja. Druga je lekcija o brani, ne o kodu: mjerni raspon phone-gatea u
  landscapeu (852 px) **širi je od praga na kojem mjerena traka uopće postoji** (768 px), pa
  jedna cijela površina u toj orijentaciji nije bila pokrivena ni na jednom ekranu.

### BUG-035 — Tri ikone na `about`-u nevidljive u ZADANOJ temi (kontrast 1.13)

- Status: ✅ **riješen** (2026-08-29, cigle C4a i §10.2) · Težina: **visok** (sadržaj koji
  korisnik ne vidi, u zadanoj temi, na stranici koja objašnjava proizvod) · Našao: **slučajno** —
  ispao je usput dok se mjerilo koliko je CSS-a mrtvo pred C4. **To je samo po sebi nalaz.**

- **Opis:** ikone na tri kartice stranice `about` (`.about-card-icon > i.fas`) crtale su se
  **bijelo na `#edf1f7`**. Izmjeren kontrast **1.13** (tema `academic`, zadana) i **1.16**
  (`paper`); prag za ne-tekstualni element je **3.0**. U tamnim temama (`chalk`, `mint`) su bile
  vidljive, pa se kvar nije dao primijetiti ako se gledala kriva tema.

- **Reprodukcija:** otvori `#/about` u zadanoj temi. Ikone su na svojim mjestima (pločica
  `--bg-tertiary` se vidi), ali glif u njima nije.

- **Uzrok:** `css/subject-selector.css` je bio **mrtva datoteka koja je gazila živu**. Nosio je
  STARU `about` stranicu (39 od 44 klase nije spominjao nitko), a preostalih pet klasa
  **dupliralo** je `pages.css` — novu `about` stranicu iz §9.14. `css/app.css` je mrtvu datoteku
  uvozio **POSLIJE** žive, pa je pri jednakoj specifičnosti pobjeđivala mrtva:
  `.about-card-icon` je otud dobivao `color: white`. **Ispuna koja je tu bjelinu nosila**
  (`.mission-card .about-card-icon`, gradijent marke) živjela je na klasama kojih markup više
  nema — pa je ostala bjelina bez svoje podloge.

- **Rješenje:** `css/subject-selector.css` **obrisan cijel** (−495 redaka, −47 `!important`),
  zajedno s 31 pravilom iste mrtve površine drugdje. Poslije: **5.60 / 4.87 / 7.27 / 6.38** u
  četiri teme, i ikona je dobila namjeravanu veličinu (60 → 45 px).

- **Zašto ga nije vidjela nijedna brana** — nije previd nego **doseg**, i svaka je
  bio u pravu za ono što mjeri: `check:contrast` čita **parove tokena** (bjelina je bila zakucana
  u modulu), `check:palette` traži vrijednosti **stare palete** (`#ffffff` to nije), `axe`
  ukrasnoj ikoni bez teksta **ne mjeri** kontrast, a `css:diff` uspoređuje granu s `HEAD`-om — pa
  je kvar bio **jednak na obje strane**. *Alat koji mjeri PROMJENU ne vidi zatečeno stanje.*

- **Lekcija (kako spriječiti ubuduće):** razred kvara je **„ispuna i boja teksta odlučuju se na
  RAZLIČITIM mjestima"** — ovdje dvije datoteke, u §10.2 dva pravila. Tri nove brane:
  **`check:orphan-css`** (mrtav CSS bi ovu datoteku prijavljivao tjednima prije nego je itko
  pogledao stranicu), **`check:palette` zabrana #4** (zakucana boja na POTOMKU ispune marke) i
  **`npm run check:contrast:live`** (izračunati kontrast, 4 teme × 11 ruta). Sve tri su obrnuto
  provjerene mutacijom; zadnja je puštena na stanje **prije** popravka i uhvatila točno `1.13`.
  ⚠️ **Druga lekcija je o traženju, ne o kodu:** kvar je nađen slučajno, pa je isti razred zatim
  potražen **sustavno** — i našao je još **9 mjesta** (latentnih, jer birač tema nije izložen).
  *Kad kvar nađeš slučajno, pitanje „koliko ih još ima" mora dobiti mjeru, ne procjenu.*

### BUG-034 — Brana za ćirilicu nije skenirala korijen: 23 datoteke, od toga 12 sa SADRŽAJEM

- Status: ✅ **riješen** (2026-08-24) · Težina: **srednji** (brana koja tvrdi da pokriva, a ne
  pokriva) · Našao: **revizija na Leonovo pitanje** *„jesi siguran da je sve dobro zapisano"*.

**Simptom.** `npm run check:docs` sadrži provjeru koja tvrdi da u kodu i sadržaju **nema
ćiriličnih znakova** (postoji jer hrvatski i ćirilica dijele izgled slova `а о е с р`, pa
kopiranje tiho unosi znak koji izgleda isto a nije isto — povod joj je bilo ćirilično `С` u
**odgovoru kartice**, zbog čega pretraga po „MPC" tu karticu nije nalazila). Provjera je bila
zelena, a **ćirilično `а` (U+0430) ležalo je u `sw.js` na produkciji.**

**Uzrok.** Mape se obilaze rekurzivno (`CODE_DIRS`), ali korijenske datoteke ne leže ni u jednoj
od njih, pa su bile nabrojane **ručno**:

```js
const ROOT_FILES = ['index.html', 'privacy.html', 'terms.html', 'faq.html', 'contact.html'];
```

Prebrojano: taj popis **propušta 23 korijenske datoteke**, i to nisu sitnice —

| propušteno | zašto boli |
|---|---|
| **12 × `data-*.js`** | **SADRŽAJ** — četiri stara sem-2 predmeta koje ADR-015 svjesno drži u korijenu. To je točno ono zbog čega provjera postoji. |
| `sw.js` | kod koji se izvršava kod **svakog** posjetitelja; ondje je znak i bio |
| `editor.html` | stranica koju je stvorio T6 |
| `manifest.json`, `vercel.json`, `playwright.config.js`, … | konfiguracija |

**⚠️ Ovo je TREĆI put ista greška u tri tjedna.** T6 je zatekao **ručne popise stranica** u
`check:cdn` i `check:tailwind` i oba su propustila `editor.html`; pouka je tada zapisana kao
*„brana koja ovisi o tome da se netko sjeti nije brana nego bilješka"*, a popravak je bio
**BRISANJE popisa**. Ista bolest je istog dana ležala i ovdje, u trećoj brani, i nitko je nije
potražio. *Kad se jedna brana pokaže bolesnom, pretraži ostale za istom bolešću — pouka se ne
primjenjuje sama.*

**Popravak.** Korijen se **čita s diska** (`fs.readdirSync` + filtar po nastavku), uz jednu
izričitu iznimku: `package-lock.json` (generiran, golem, i ćirilica u njemu bila bi tuđa).
Znak u `sw.js` ispravljen.

**Obrnuta provjera.** Popravljena brana je **odmah pala na zatečenom stanju** — prijavila je
`sw.js` s ćiriličnim znakom — i prošla tek nakon ispravka. Dakle mjera stvarno vidi kvar, a ne
samo današnje zeleno.

⚠️ **Usput, o samom ovom zapisu — pao sam na njemu DVAPUT.** `.md` provjera prije mjerenja makne
blokove i **inline** kod, pa se ćirilica smije citirati, ali samo pod dva uvjeta koja sam oba
prekršio: ① citat mora biti **u backtickovima** (prvi put sam ga stavio u hrvatske navodnike,
gdje ga strip ne vidi) i ② mora stati **u jedan redak** (izraz namjerno ne prelazi redak).
*Najsigurnije je znak uopće ne pisati nego ga imenovati kodnom točkom* — zato u ovom zapisu
stoji `U+0430`, a ne sam znak.

**Pouka.** *Gate koji nabraja ono što štiti štiti samo ono što je netko zapamtio.* Popis se
briše, disk se čita — i to vrijedi za svaku sljedeću branu koja ima „popis datoteka" u sebi.

### BUG-033 — Hrvatsko sučelje se poslužuje pod `<html lang="en">` (na svakoj stranici, pri svakom posjetu)

- Status: ✅ **riješen** (2026-08-24) · Težina: **srednji** (produkcija, svaka stranica, svaki
  korisnik koji je izabrao 🇭🇷) · Našao: **funkcionalna sonda cigle `about`**, usput.

**Simptom.** Korisnik jednom pritisne 🌐 i izabere hrvatski. Izbor se pamti i tekst je uredno
hrvatski — ali `<html lang>` ostaje `en`, na **svakoj** stranici i pri **svakom** sljedećem
posjetu, sve dok ponovno ne pritisne prekidač u toj sesiji. Čitač ekrana tada hrvatske rečenice
izgovara **engleskim glasovima** (WCAG 3.1.1 „Language of Page"); pogađa i automatske prijevode
te indeksiranje.

**Izmjereno** (Chromium, 320 px, `localStorage['sokrat-ui-lang'] = 'hr'`, obično učitavanje):

```
tekst:  „O platformi Sokrat Study" · „Napravili studenti, za studente" · „Kreni učiti"
html lang:  en
```

**Uzrok.** `js/i18n.js` — atribut postavlja **jedino** `setUiLang()`. Boot je na kraju modula
zvao **goli `applyTranslations()`**, koji prevodi tekst, ali atribut ne dira. Prekidač zove
`setUiLang`, pa je pri ručnom prebacivanju sve izgledalo ispravno — kvar se vidio **samo na
putu kojim dolazi povratnik**, a taj put nitko nije mjerio.

**⚠️ Zašto ovo nije uhvatio nijedan gate.** `tests/a11y.spec.js` vrti axe, a axe ima pravilo
`html-has-lang` (postoji li) i `html-lang-valid` (je li valjan kod). `en` prolazi oba — **samo
nije istina**. *Gate koji provjerava da atribut POSTOJI ne provjerava da je ISTINIT.* Isti razred
kao tinta na pločicama predmeta (cigla B): pravilo je bilo ispravno napisano, ali ga nijedna
mjera nije uspoređivala sa **stanjem**.

Postojeći `tests/i18n.spec.js` je pritom imao **dva** testa o jeziku i oba su prolazila — jer su
mjerila `getUiLang()` i prevedene natpise, dakle **naš vlastiti pojam jezika**, a ne ono što
dokument kaže o sebi vanjskom svijetu.

**Popravak.** Boot ide kroz `setUiLang(uiLang, false)` (`persist: false` — ovo nije korisnikov
izbor nego primjena već zapamćenog). Jedan redak.

**Brana.** Nova tvrdnja u `tests/i18n.spec.js`: `<html lang>` prati odabrani jezik **pri običnom
učitavanju, bez ijednog dodira prekidača**, i to u oba smjera (da ne prođe zato što je atribut
zaglavio na jednoj vrijednosti). Obrnuto provjerena protiv zatečenog koda: `Expected "hr",
Received "en"`.

**Pouka.** *Tvrdnja o vlastitom stanju nije tvrdnja o tome kako se proizvod predstavlja vani.*
Kad postoji atribut koji nešto **objavljuje** (lang, `aria-*`, `<meta>`), mjeri se **atribut**,
ne interna varijabla koja ga navodno postavlja.


### BUG-032 — Popis lekcija nije upotrebljiv tipkovnicom ni čitačem ekrana (`div` s klikom)

- Status: ✅ **riješen** (2026-08-24) · Težina: **visok** (produkcija, svaki predmet, jedini put u lekciju) · Našao: **mjerač telefona (T4), 2026-08-22**, mjerenjem tvrdnje ④.

**Simptom.** Stranica `lessons` — popis lekcija predmeta — **nema nijednu sadržajnu kontrolu**.
Miš i prst rade; tipkovnica i čitač ekrana ne. Za korisnika koji ne pokazuje prstom, katalog
od 24 predmeta završava na popisu lekcija.

**Izmjereno** (Chromium, brana `tests/phone.spec.js`, 4 profila):

```
320 / 393 / 430 / 852 px  ·  lessons
  interaktivnih elemenata u sadržaju: 0
  vidljivo u prvom ekranu: p#subjectDescription, div.lesson-card, h3, p …
```

**Uzrok.** `js/navigation.js:1304` — `renderLessonsPage()` gradi karticu kao
`document.createElement('div')` s `class="lesson-card"` i vješa `click`-slušatelja. Nema
`role`, nema `tabindex`, nema `keydown`. Za pristupačno stablo to je **obična kutija s
tekstom**.

**⚠️ Zašto ovo nije uhvatio nijedan gate — tri neovisna razloga:**
- **axe** ne prijavljuje `div` s `click`-slušateljem: slušatelj nije u DOM-u kao atribut i
  nijedno WCAG pravilo se ne da automatski provjeriti bez njega. (Da je stajalo
  `role="button"` bez `tabindex`, axe bi pao — kvar je *ispod* praga koji alat vidi.)
- **`reachability.spec.js` (K3)** mjeri **pogodak na kontrolama koje postoje** — element koji
  se ne kvalificira kao kontrola nema što promašiti.
- **`css:diff`/`check:palette`** mjere izgled, a izgled je ispravan.

Kvar je izašao tek kad je T0 uveo tvrdnju koja pita *„može li korisnik ovdje išta učiniti?"* —
i onda je T4 morao razlagati zašto ④ pada, jer je zapisani uzrok („cookie-traka") bio kriv.

**Rješenje (izvedeno 2026-08-24).** ⚠️ **Element slijedi POSLJEDICU, ne izgled:** lekcija koja
se da otvoriti je `<a href>` — adresu joj je K1 već dao, pa je usput postala dijeljiva i
otvoriva u novoj kartici — a lekcija „uskoro" **nije poveznica nego `<button>`**: ne vodi
nikamo, nego objašnjava zašto. *Zapisano rješenje je predlagalo `<button>` za oboje; mjerenje
je pokazalo da bi to jednoj od dvije vrste dalo krivu semantiku.* Klik se presreće (isti
presedan kao logo u traci), jer `navigateTo` mora ostati jedini upisivač povijesti — inače
`dubinaPovijesti` iz K2a prestane vrijediti.

⚠️ **Escape iz BUG-025 ovdje NIJE dodan — jer nije potreban.** Tekst iz podataka ide kroz
`textContent`, ne kroz `innerHTML`, pa se opasnost **ne može pojaviti**. To je jača obrana od
ispravnog escapea, koji vrijedi samo dok ga se netko sjeti pozvati. (Provjereno usput: taj
redak ionako nije bio dohvatljiv korisničkim tekstom — K2a preusmjeri `node:` s lekcijske
stranice, pa je do `innerHTML`-a dolazio samo naš `catalog.js`.)

⚠️ **Ispravan obrazac je već postojao 400 redaka iznad, u istoj datoteci:** `renderBrowsePage`
crta `<button class="browse-card">`. Kvar nije bio nepoznavanje pravila nego **jedno mjesto
koje ga nije slijedilo** — zato nova brana mjeri OBJE stranice kataloga, ne samo popravljenu.

🐞 **Usput ispravljena tiša nedosljednost:** `routeFor()` je `subject` i `lesson` čitao prvo iz
podataka, a `section` **isključivo iz `AppState`-a** — pa bi poveznica sagrađena s lekcijske
stranice ponijela zadnju otvorenu sekciju (npr. `/quiz`), dakle adresu koja ne opisuje kamo
vodi. Sada sve tri idu istim redom.

**Mjereno poslije:** phone-osnovica **8 → 4 nalaza** — brana je sama javila
`✅ RIJEŠENO (prviEkran, 4)` za sve četiri širine `lessons`. Preostala 4 su `about` (sljedeće).

**Brana:** `tests/lesson-card.spec.js` — sastav · tipkovnica (Enter, ne `element.click()`, jer
`click()` prolazi i nad `div`-om, dakle nad kvarom) · ime kontrole · **obrnuta provjera** koja
rekonstruira stari `div` u DOM-u i traži da ista mjera padne.

**⚠️ Isti kvar postoji još na JEDNOM mjestu i NIJE popravljen ovdje:** `.st-row` — stablo
kataloga u Studiju (`js/studio.js:82`) je `div` s `data-lesson` i delegiranim klikom. To je
editor (admin-only, `editor.html`), pa ide u `BACKLOG.md`, ne u ovu ciglu. Provjereno je i
ostalih pet kandidata: `.ex-choice-item` / `.ex-card` su **omoti oko pravih `<button>`-a**,
dakle lažni pogodak skenera.

**Lekcija.** *Gate koji provjerava kontrole ne vidi kvar u kojem kontrola NE POSTOJI.* Sve tri
postojeće brane pretpostavljale su da je element kontrola i onda mjerile njegovo ponašanje;
nijedna nije pitala postoji li uopće. Isti razred kao „telefon kao stranica nikad nije bio
mjerena površina" — mjeri se ono što se zna imenovati.

**Druga lekcija, iz popravka:** *kvar u jednini je često obrazac u množini — ali tek nakon
provjere.* Skener je našao šest kandidata; **jedan** je bio stvaran (`.st-row`), **dva** su
bila omoti oko pravih kontrola, a **jedan** (`.browse-card`) je bio već ispravan i time dokaz
da pravilo u kući postoji. Da sam popis prijavio bez provjere, četiri od šest bila bi lažna
uzbuna.

---

### BUG-030 — Puni naziv fakulteta ruši zaglavlje kataloga na telefonu (naslov postane „C…")

- Status: ✅ **riješen** (cigla T2, 2026-08-21) · Težina: **visok** (produkcija, svaki telefon, ulazni ekran kataloga) · Našao: **Leon na iPhoneu 16**, uz snimku.

**Simptom.** Na 393 px se naziv fakulteta rasporedi u uski stupac, jedna riječ po retku, a
naslov razine pored njega se skvrči u **„C…"**. Kontrole zaglavlja plutaju nasred tog stupca.

**Izmjereno** (pravi Chromium, 393 × 852, produkcija):

| | |
|---|---|
| `.browse-header` visina | **270 px** (32 % ekrana) |
| mrvica („FMTU – Fakultet za menadžment u turizmu i ugostiteljstvu, Opatija", 65 znakova) | **14 redaka**, stupac **103 px** širok, **205 px** visok |
| naslov „Choose your program" | `clientWidth` **34 px** naspram `scrollWidth` **205 px** → odrezan |

**⚠️ UZROK JE ISPRAVLJEN 2026-08-21 (T0) — prvi zapis je bio kriv.** Ovdje je stajalo da
mrvica bez kraćenja **pojede** susjedni naslov. To se ne može dogoditi: mrvica i naslov su
uloženi u `div.browse-title`, koji ima **`display: block`** — kao braća u stupcu ne utječu
jedno drugom na širinu. Izmjereno na produkciji, 393 px, `header.browse-header` (flex-redak,
**šestero** djece):

```
natrag 44 + [.browse-title] + 🌐 59 + mape 44 + korisnik 44 + znak 40
= 231 px kontrola + 80 px razmaka = 311 od 345 px raspoloživih
→ .browse-title dobiva  34 px   (flex: 1 1 0%, min-width: 0)
```

**Uzroka su dva, u istom retku, i razdvajaju se:**
- **naslov je uzak** jer je **pet kontrola + razmaci** pojelo 311 od 345 px — `min-width:0`
  im to samo dopušta;
- **zaglavlje je visoko** jer se mrvica onda lomi u taj 34-px stupac (5 redaka na 393, 14 na
  produkcijskoj razini fakulteta sa 65-znakovnim imenom).

**Posljedica za popravak (T2):** kratko ime fakulteta samo po sebi **ne bi popravilo naslov**.
Da su kontrole uzrok, dokazuje grana: K2b ih je odselio u globalnu traku i zaglavlje je palo
na 102 px **bez ijedne izmjene teksta**. T2 zato spaja zaglavlje s mrvicom, a ne samo krati.

**Zašto ga nijedan gate nije vidio.** axe mjeri na 1280 px, gdje ime stane u jedan redak;
`css:diff` uspoređuje nas sa samima sobom pa mu je ravnomjerno loše stanje stabilno; K3/K4a
mjere **kromo**, ne stranicu. Detaljno: [FRONTEND_REDIZAJN §9.2](../plan/FRONTEND_REDIZAJN.md).

**Rješenje (cigla T2, isporučeno).** Zaglavlje razine je **obrisano na sve tri stranice**, ali
ne istim rezom — jer mjerenje je pokazalo da to nisu bila tri ista kvara:

1. **Lekcije i učenje su bili čisti duplikat** (h1 je pisao doslovno ono što piše zadnja
   mrvica). Naslov ostaje kao `visually-hidden` — stranica ga mora imati za čitač ekrana, ne
   mora ga imati **dvaput na ekranu**. Ušteda 119 i 115 px.
2. **Katalog nije bio duplikat**: ondje je zaglavlje nosilo dubinu (`fakultet › smjer ›
   godina`) koju mrvica **nije pokazivala**. Zato je dubina **preselila u mrvicu**, a uputa
   („Odaberi smjer") u **sadržaj**, gdje se smije odskrolati. Ušteda 140 px.
3. **Pravi kvar iza simptoma bio je PRIORITET KRAĆENJA, i bio je naopak:** preci su imali
   `flex-shrink: 0`, a `.crumb-current` `flex-shrink: 1` — stiskalo se **jedino što govori
   gdje si** (30 od 99 px na 320), dok su preci držali punu širinu. Sada je obrnuto, uz
   `min-width` na precima i pomak lanca na kraj.
4. **Kratko ime fakulteta** (`shortName: 'FMTU'`) dodano je, ali kao **posljedica, ne lijek** —
   T0 je dokazao da naslov jedu kontrole, ne znakovi.

**Izmjereno poslije:** kromo kataloga **307 → 167 px** (54 % → **29 %** na 320 px, 36 % →
**20 %** na 393) · trenutna mrvica **30/99 → 99/99** · tvrdnja ⑤ **5 ekrana → 0**.

**⚠️ Grana je ovo bila ublažila slučajno, ne namjerno** — 102 px i 3 retka umjesto 270 i 14,
samo zato što je K2b maknuo gumbe iz tog zaglavlja. Korijen je stajao netaknut do T2.

**Brana (od T0, 2026-08-21).** `tests/phone.spec.js` tvrdnje ③ i ⑤ + `helpers/phone-gate.js`.
Obrnuto provjerene na produkciji: ③ prijavljuje `.browse-title › #browseBreadcrumb = 5 redaka,
a susjed krati`, ⑤ prijavljuje `h1#browseHeading: odrezan na 34 od 187 px (18 %)`.

**Lekcija (dvije, i druga je nastala tek pri mjerenju).**
1. *Dva ispravna CSS pravila u istom spremniku mogu dati kvar koji nema nijedno od njih.* Ono
   što se slobodno lomi **određuje visinu**, a ono što krati **ne određuje ništa**.
2. *Uvjerljiv opis uzroka preživi reviziju.* Prvi zapis ovog buga bio je napisan gledanjem
   ekrana i CSS-a, zvučao je mehanički i bio je netočan — pao je tek kad je netko izmjerio
   širine djece umjesto da ih pročita. Isti razred kao „brisanjem demoa nestaje 240 KB
   editorskog koda" (spec §7.14).
3. *Preci u mrvici smiju se kratiti, trenutna razina ne smije.* Kad se u nizu nešto mora
   stisnuti, stisne se ono što je **izvedivo iz konteksta**, a ne ono što je **jedini odgovor
   na pitanje gdje si**. Prvi zapis tog CSS-a je izabrao obrnuto i djelovao je razumno.

---

### BUG-031 — Sadržaj stoji ispod Dynamic Islanda (sigurna zona nije nadoknađena)

- Status: ✅ **riješen** (cigla T1, 2026-08-21) · Težina: **visok** (produkcija, svaki iPhone s otokom) · Našao: **Leon na iPhoneu 16**.

**Simptom.** Gornja traka sa znakom i gumb „Start studying" stoje **ispod** Dynamic Islanda.

**Izmjereno.** `.start-trigger` je na **y = 18 px**, a otok zauzima ~59 px. Postavljanjem
`--safe-top` na 59 px u pregledniku **na produkciji se ne pomakne NIŠTA** — svih sedam
mjerenih elemenata ostaje na 0 px pomaka. Na grani se pomakne sve za 59.

**Uzrok.** `viewport-fit=cover` **jest** postavljen — dakle stranica se **namjerno** crta ispod
otoka — ali `css/landing.css` spominje `env(safe-area-inset-*)` **nula puta**. Ušli smo u
nesigurnu zonu i onda je nismo nadoknadili. Na grani to slučajno radi jer je K2b donio globalnu
traku koja `var(--safe-top)` **ima**; nijedno pravilo to ne jamči.

**Rješenje (cigla T1, isporučeno).** Sigurna zona ima od sada **jedan izvor i jedno pravilo**:

1. **Jedan izvor** — `env(safe-area-inset-*)` smije stajati samo u `css/variables.css`; 18
   mjesta u 5 datoteka prevedeno je na `var(--safe-*)`, a brana **`npm run check:safearea`**
   (u preflightu) drži to tako. Razlog nije urednost: pravilo napisano golim `env()` naša
   zamjena u pregledniku **ne dohvaća**, pa ga nijedan test ne može ni potvrditi ni oboriti.
2. **Vodoravna os, jedno pravilo za svih devet stranica** —
   `section[id$="-page"] { padding-left: var(--safe-left); padding-right: var(--safe-right) }`.
   Padding ide na SEKCIJU jer se pozadina crta i ispod njega: ploha ostaje preko cijelog
   ekrana, uvlači se samo sadržaj. Selektor je atributni (ugovor `-page` iz K1), pa deveta
   stranica sigurnu zonu dobiva **time što postoji**.
3. **Fiksni namještaj sam sebe uvlači** — cookie-traka i tri panela Studija; njima padding
   predaka ne pomaže. Fiksno ide kroz **`max()`** (rub pojede razmak, traka raste 20 px
   umjesto 34), skrolabilni sadržaj kroz **`calc()`** (zadnjoj kartici treba i zraka).

**Izmjereno poslije:** ⑥ **183 → 0** · ⑦ **16 → 0** · ⑦b **16 → 0**; `css:diff` 0/3408
(rubovi su u Chromiumu 0, pa se prikaz ne smije pomaknuti ni za piksel).

**⚠️ Metoda mjerenja, jer je bila nova.** `env()` se u Chromiumu ne da simulirati — ali
`--safe-top` je **naša varijabla iznad njega**. Postavi je na 59 px: **što se ne pomakne, na
pravom telefonu stoji ispod otoka.** Prije ovoga sigurna zona nikad nije bila izmjerena.

**Brana.** `tests/phone.spec.js` + `tests/phone.authed.spec.js`, mjera u
`tests/helpers/phone-gate.js`. T0 je donio tvrdnju ① (gornji rub, portret) i obrnuto je
provjerio na produkciji: `a.landing-logo y=20…52`, `button.nav-cta` („Start studying")
**`y=18…53`**, uz otok od 59. **T1 je dodao ⑥ (donji rub, mjeren NA DNU SKROLA), ⑦ (bočni rub,
landscape) i ⑦b/⑦c (spremnik sadržaja poštuje zonu i kad u njoj slučajno nema gumba)** te
**četvrti profil, 852 × 393**.

**Lekcija (tri, i sve tri su o mjerljivosti).**

1. *`viewport-fit=cover` nije postavka nego obveza.* Njime se izričito prijavljuješ za crtanje
   ispod izreza — od tog trenutka je svaki neispunjeni rub regresija, a ne propuštena ljepota.
2. *Pravilo napisano golim `env()` je pravilo koje nijedan test ne može ni potvrditi ni
   oboriti.* Dvije liste iste činjenice (`--safe-*` i `env()`) razišle su se točno onako kako
   se dvije liste razilaze: `.mobile-nav` je ispravno pravilo iz `components.css` prepisivao
   nemjerljivom inačicom (**90 od 183** nalaza), a `.landing-footer` je „radio" na način koji
   se nije dao dokazati.
3. *Prolaz zbog kratkog sadržaja nije prolaz.* Tvrdnja koja pada tek kad u pojasu stvarno
   nešto stoji propušta ljusku koja je danas prazna — Studio je imao `padding-bottom: 0` na
   platnu koje seže do ruba ekrana. Ispravnost mora biti **svojstvo spremnika**, ne ishod
   trenutnog sadržaja. Prva izvedba te tvrdnje to nije bila i zato **nije mogla puknuti**;
   otkriveno je ispisom kandidata, ne čitanjem koda.

---

### BUG-029 — „Predmeti" na 320 px PREBACUJU JEZIK umjesto da otvore katalog

- Status: ✅ **riješen** (K3a) · Težina: **srednji** (samo ≤ 344 px i samo na engleskom — ali je to zadani jezik, a 320 px je donja granica iz kriterija prihvaćanja) · Našao: **sonda pisana PRIJE brane K3**, ne korisnik.

**Simptom.** Posjetitelj na uskom telefonu (320 px) otvori landing i tapne „Predmeti".
Katalog se ne otvori — **sučelje se prebaci na hrvatski.** Nije izostao izlaz nego se
izvršila **kriva radnja**, što je gore od nedostupnog gumba: korisnik dobije povratnu
informaciju da je nešto uspjelo, pa ne pokuša ponovno.

**Uzrok.** `.topbar-nav` je imao `min-width: 0`, što flex-djetetu izričito **dopušta**
stiskanje ispod širine sadržaja. Na landingu — jedinoj stranici gdje traka nosi CTA
(`body.on-landing`) — zbroj kontrola premašuje 320 px, pa se nav stisnuo na **širinu 0**
(`scrollWidth` 37), a gumb „Predmeti" isplivao **ispod** prekidača jezika.

⚠️ **Kvar je ovisio o JEZIKU, i zato ga je bilo lako promašiti okom.** Engleski
„Start studying" je **126 px**, hrvatski „Počni učiti" **103** — razlika 23 px, a preklop
je bio **21**. Na hrvatskom sučelju kvara nema. Engleski je zadani.

**Zašto nijedan gate nije pisnuo — i to je važnije od samog kvara.** `overflow` je
`visible`, a `scrollWidth == clientWidth == 320`: **prelijeva doslovno nema**, pa su svi
detektori prelijeva u pravu kad šute. Nijedna kontrola nije izvan ekrana, pa provjera
odrezanosti prolazi. Axe mjeri uloge i kontrast, ne geometriju. A najuži Playwright profil
je **375 px** — kvar živi na 320, širini koju kriterij prihvaćanja imenuje od prvog dana, a
koja je do K3 postojala u **jednom jedinom testu**.

**Popravak** (dva odvojena dijela, namjerno): *da stane* — ispod 360 px CTA odlazi iz trake
landinga (ulaz su vrata u herou; landing ima tri `.start-trigger`-a). *Da se ne ponovi tiho*
— `.topbar-nav` dobiva `flex-shrink: 0`: kad ponestane mjesta, traka se **prelije** umjesto
da se **preklopi**, a prelijev gate vidi.

**⚠️ DRUGI NALAZ — struktura je odmah odradila posao zbog kojeg postoji.** Čim je
`flex-shrink: 0` uveden, `layout-guard` je pao na **560 px** (dokument 574 umjesto 560).
To nije bila regresija nego **isti kvar na drugoj širini, koji je dotad također bio skriven
preklapanjem**. Mjerenje: na 560 px prestaje `max-width: 559px`, pa odjednom iskoče **i
oznake odredišta i wordmark** — `topbarHome` skoči **42 → 146 px**. Najgori slučaj
(hrvatski, stranica „Predmeti") traži **632 px**, a uključivao se na 560: cijeli pojas
**560–639 px** nikad nije stao.

Popravak nije guranje jednog praga gore nego **razdvajanje dvaju**: oznake odredišta su
jeftine i funkcionalne (imenuju kamo vode) pa ostaju na 560; **wordmark nosi +104 px i
sam** pa dobiva vlastiti prag na 640. Znak (42 px slika) je vidljiv uvijek — konstanta
marke. *Kad jedan prag pali dvije stvari različite cijene, mjeri ih odvojeno.*

**Lekcija:** *postojanje se dade provjeriti selektorom, dohvatljivost samo pogotkom.* Ovo je
**treći mehanizam istog kvara u tri uzastopne cigle** — K2b odrezano (`overflow:hidden`),
BUG-028 prekriveno (fiksni banner), BUG-029 preklopljeno (`flex-shrink`) — a jedina provjera
koja hvata sva tri je `elementFromPoint` na sredini kontrole. **Druga lekcija:** broj zapisan
u kriteriju prihvaćanja, a nemjeren nijednim testom, nije kriterij nego želja.

**Brana:** `tests/reachability.spec.js` + `tests/reachability.authed.spec.js`
(`helpers/reach-gate.js`), 4 širine od **320** px. Obrnuta provjera: **pada 1 od 4**, s
porukom `320px landing · preklop: topbarBrowse × topbar-btn (21×40 px)`.

⚠️ **Ta se obrnuta provjera više NE DA reproducirati doslovno:** isti dan je Leon izbacio
gumb „Predmeti" iz trake, pa `#topbarBrowse` više ne postoji. Poruka gore je **zapis onoga
što je gate ispisao 2026-08-19**, ne recept za ponavljanje. Brana i dalje vrijedi — mjeri
sve kontrole u kromu, ne tu jednu — ali sljedeća sesija neka ne traži gumb koji je obrisan.


### BUG-028 — Izbornik blokova je NEKLIKABILAN kad stoji cookie-banner (editor)

- Status: ✅ **riješen** (K2b, `508b2ff`) · Težina: **srednji** (osobni materijal + admin editor; katalog nedirnut) · Našao: **`test:authed`**, pri regresiji K2b.

**Simptom.** U editoru se otvori ＋ izbornik za novi blok, izbornik se **vidi**, ali klik na njegove
stavke ne radi ništa. Pogađa samo posjetitelja koji **još nije odgovorio na pitanje o kolačićima**.

**Uzrok.** `.be-menu` je računao treba li se okrenuti prema gore ovako:
`if (top + mh > window.innerHeight - 8)`. To je točno za **viewport**, ali ne i za ono što je u
njemu **zauzeto**. Cookie-banner je `position:fixed` na dnu sa `z-index: 2147483000` (namjerno
iznad svega, da ga ne prekrije nijedan modal) i **presreće pokazivač** nad donjih ~70 px.

⚠️ **Kvar je bio LATENTAN, K2b ga nije uveo nego otkrio.** Dok je Studio počinjao na vrhu ekrana,
izbornik je slučajno padao **iznad** bannera. Čim ga je globalna traka spustila za 108 px, počeo je
padati **u** njega. *Slučajna geometrija je držala kvar nevidljivim, pa je izgledao kao regresija.*

**Popravak.** `js/consent.js` objavljuje `--bottom-inset` (visina bannera dok stoji, 0 kad ga nema),
a `posMenu()` od te vrijednosti računa stvarni donji rub. Rješenje je namjerno **općenito**: svako
buduće trajno dno (traka za akcije, obavijest) samo postavi istu varijablu.

**Lekcija:** *„stane li u ekran" nije isto što i „vidi li se".* Provjera prelijeva mjeri **viewport**,
a korisnik gleda **ono što je u njemu ostalo slobodno**. Isti razred kao izuzeće u `layout.authed`
čija premisa ne vrijedi kad fiksna ljuska ima `overflow:hidden`.

**Brana:** `tests/auth.setup.js` upisuje pristanak prije prvog učitavanja (prijavljen admin ga je
donio davno), pa authed-suita mjeri ono što tvrdi, a ne banner. Sama kolizija je popravljena u kodu.


### BUG-027 — Petlja „Moji materijali ⇄ Studio": izlazak iz editora vraća u editor

**Simptom** (Leon, 2026-08-18): polica → *uredi materijal* → editor (ništa se ne dira) → „natrag" →
polica → „natrag" → **opet editor**, i tako u krug.

**Uzrok.** `materialsReturnPage` je pamtio stranicu s koje si došao i izuzimao **samo** dolazak iz
samih materijala. Dolazak **iz editora** se pamtio, pa je „natrag" s police vraćao onamo odakle si
upravo izašao.

⚠️ **Popravak je već postojao — nije bio prenesen.** Isti izuzetak stoji **tri retka iznad**, za
`profileReturnPage` (`!== 'admin' && !== 'editor'`), a njegov komentar se izričito poziva na
**BUG-019** i petlju profil ⇄ admin. Materijali su dobili vlastitu stranicu u **C0**, tjednima
kasnije — i naslijedili obrazac bez njegova izuzetka.

**Popravak (K2a).** Ručna jednodubinska povijest je **obrisana** (oba `*ReturnPage`); ostaje jedan
model — `goBack()`.

**Pouka:** *popravak koji nije generaliziran je popravak koji čeka drugu priliku.* Već sedmi put u
ovoj fazi da mehanizam pokriva NEKA mjesta i time stvori pretpostavku da pokriva SVA.

**Brana:** `tests/back-model.spec.js` („petlja polica ⇄ editor je mrtva").

### BUG-026 — „Natrag" iz vlastitog materijala vodi u katalog fakulteta

**Simptom** (Leon, 2026-08-18, uz dva screenshota): *Moji materijali* → uđeš u materijal da učiš →
„natrag" → **lekcijska stranica čvora** (`#/subject/node%3A…`) koja crta „Matematika / **undefined**"
→ još jedan „natrag" → **„Choose your faculty"**. Dvije stranice na kojima korisnik nikad nije bio.

**Uzrok.** Aplikacija ima **DVIJE hijerarhije** — katalog (`browse → lessons → study`) i vlastito
gradivo (`polica → study`) — a gumbi natrag poznavali su **samo prvu**, tvrdo ožičeni na roditelja.
Osobni materijal se uči kao **sintetički predmet** `node:<uuid>` (`registerStudySubject`), pa je
`backToLessons` doslovno tražio lekcijsku stranicu čvora koji lekcije **nema**.

**Popravak (K2a).** Jedan model vraćanja: `goBack()` koristi **povijest** kad iza nas stoji naš unos,
inače `roditeljOd()`, koji zna **obje** hijerarhije. Uz to čuvar u `navigateTo`: `lessons` sa
`node:` subjektom preusmjerava na policu — ruta je od **K1 dijeljiva**, pa se do te stranice može
doći i utipkavanjem, dakle čuvar ne smije stajati u gumbu.

⚠️ **Prva verzija popravka stvarala je petlju koju je trebala ukloniti:** odlazak *gore* gurao je
unos u povijest, pa je sljedeći „natrag" imao kamo natrag — **u dijete iz kojeg smo upravo izašli**.
Kretanje gore mora **zamijeniti** unos. Našla ga je proba u pregledniku, ne čitanje koda.

**Pouka:** *čim se pojavi druga hijerarhija, tvrdo ožičen roditelj postaje laž.* Nije bilo dovoljno
dodati UGC kao sintetički predmet — navigacija je ostala kataloška.

**Brana:** `tests/back-model.spec.js` (čvor nikad na lekcijskoj stranici · hladan dolazak penje
hijerarhiju).

### BUG-025 — Sadržaj sa znakom `<` se GUBIO u kvizu, learnu i dopunama (kviz-pitanje bilo neodgovorljivo)
- Status: ✅ **riješen** (`779f26b` + `6b02354`, grana `fix/bug-024-slika-u-learnu`) · Težina: **visok** (javni katalog **jest** pogođen) · Našao: **Claude**, pri reviziji BUG-024.
- **Simptom (katalog, na produkciji):** u `statistics` je kviz o Z-tablici imao tri ponuđena odgovora koja su se prikazivala **skraćeno i nečitljivo** — `\(P(Z` · `\(1-P(Z` · `\(2P(Z`. **Pitanje se nije moglo riješiti**, jer se opcije nisu razlikovale u onome što student vidi. Isto pitanje je bilo krnje i u pregledu netočnih odgovora.
- **Uzrok:** tekst stavke išao je **sirov u `innerHTML`**. Preglednik `<z)\)` pročita kao **početak taga** i pojede sve do prvog `>`. **Šest mjesta u pet datoteka:** [quiz.js](../../js/quiz.js) (opcije + pregled netočnih) · [fill-blanks.js](../../js/fill-blanks.js) (rečenica) · [learn.js](../../js/learn.js) (naziv i ikona sekcije, zaglavna slika) · [progress.js](../../js/progress.js) (gumbi kategorija **i** trake napretka — ondje i **boja u `style`**) · [profile.js](../../js/profile.js) (ikona u statistici).
- **⚠️ Ikona i boja se ne rješavaju escapeom.** Ikona ide u **`class`**, gdje bi i escapan navodnik (`&quot;`) prošao kao **razdjelnik imena klasa** → autor bi si mogao pridružiti bilo koju klasu. Boja ide u **`style`**. Zato: `SokratBlocks.safeIcon()` **provjerava oblik** (`^fa-[a-z0-9-]+$`, sve ostalo → default), a boja ide kroz **postojeći `accentFrom`** (isti `#rrggbb` filtar koji već čuva akcente stavki) — nevaljana boja znači **izostavljen stil**, ne proizvoljan sadržaj u atributu.
- **Druga polovica istog propusta je SIGURNOSNA:** u osobnom materijalu te tekstove **tipka korisnik**. Naziv sekcije `<img src=x onerror=…>` izvršio bi se pri učenju. Danas je to self-XSS (vlastiti privatni sadržaj), ali **objava/dijeljenje je sljedeća faza** — do tada je moralo biti zatvoreno. Renderer blokova je cijelo vrijeme bio ispravan; rupa je bila u tekstu **oko** njega.
- **Mjereno, ne pretpostavljeno:** svih **27.132** stringova iz `data/json` koji idu kroz `innerHTML` provučeno je kroz **pravi preglednik** i uspoređen `textContent` s originalom → **8 oštećenih**, sva u `statistics`. Time je i utvrđeno da escape **ništa ne kvari**: u katalogu nema nijednog namjernog HTML-taga u tim poljima (0 od 27.132), a 77 polja s `&` (`P&L`, `A&G`) prikazuje se identično i prije i poslije.
- **Rješenje:** `blocks-renderer.js` izvozi `esc` i `safeUrl` → **jedna definicija za cijelu platformu** (ADR-027); sva četiri mjesta idu kroz nju. Ikona se ne escapa nego **provjerava** (`^fa-[a-z0-9-]+$`) jer ide u `class`, gdje bi i escapan navodnik prošao kao razdjelnik. **KaTeX ostaje netaknut:** `&lt;` se u DOM-u vrati kao tekst `<`, a `renderMath()` radi nad tekstom i trči poslije umetanja.
- **Usput (isti propust, drugi tip bloka):** admin-pregled learna **nikad nije tipografirao KaTeX** → formula je ondje ostajala sirovi LaTeX. Popravljeno, scope-ano na read-only kartice (u `contenteditable` bi `editableToInline` KaTeX-markup pročitao natrag u model).
- **Test:** [tests/escaping.spec.js](../../tests/escaping.spec.js) vozi **pravi put prikaza** u sva tri moda s podmetnutim podacima (ne ovisi o katalogu). Provjereno obrnuto: **sva tri testa padnu** kad se popravak makne.
- **LEKCIJA:** *„jedan renderer = sigurnosna granica"* je bilo **točno, ali nepotpuno** — granica je pokrivala **blokove**, a polovica onoga što student čita (opcije kviza, rečenice dopuna, nazivi sekcija) do nje **nikad nije ni došla**. Druga: bug je nađen jer se BUG-024 **nije popravio na najkraći način** nego se pitalo *„gdje još ista pretpostavka može biti pogrešna"* — a nađen je **mjerenjem nad svim podacima**, ne čitanjem koda.

### BUG-024 — Slika iz osobnog materijala se NE vidi u Learn modu (vidi se u editoru)
- Status: ✅ **riješen** (`5f77a88`, grana `fix/bug-024-slika-u-learnu`) · Težina: **visok** (osobni materijal; javni katalog NIJE pogađen) · Prijavio: **Leon**, 2026-08-10.
- **Simptom:** slika ubaciš u editoru, u Studiju/pregledu se vidi — a kad iz tog materijala **učiš** (Learn), slike nema. Tekst oko nje je uredan.
- **Reprodukcija:** „Moji materijali" → otvori materijal → Uredi → ubaci sliku → Objavi → „Learn". Slika nedostaje.
- **Uzrok (nađen, NIJE još popravljen — ostavljeno za sljedeću sesiju po Leonovoj odluci):**
  Privatne slike osobnog materijala **ne žive kao URL nego kao OZNAKA** — potpisani URL istječe, pa u bazu smije samo oznaka
  (bucket `node-images` je privatan; vidi F4 zapis u CHANGELOG-u). Svaki put prikaza mora oznaku razriješiti u potpisani URL preko
  `window.SokratNodeImages.resolveBlocks()`. **Tri od četiri puta to rade, Četvrti ne:**
  - [js/admin.js:361](../../js/admin.js#L361) → `resolveBlocks` ✅
  - [js/block-editor.js:33](../../js/block-editor.js#L33) → `resolveBlock` ✅
  - [js/studio.js:678](../../js/studio.js#L678) → `resolveBlocks` + `prefetch` na 835 ✅
  - **[js/learn.js:36](../../js/learn.js#L36) → `renderBlocks(data.learn.blocks)` IZRAVNO, bez razrješavanja ❌**
  Zato se slika vidi svugdje gdje se **uređuje**, a nestaje ondje gdje se **uči**.
  ⚠️ **`prefetch` i `resolve` nisu upareni** — revidirano 2026-08-10: `studio.js` radi **oboje** (prefetch:835 + resolve:678),
  a `admin.js` i `block-editor.js` rade **samo resolve** i tiho se oslanjaju na to da je Studio već napunio predmemoriju potpisa.
  Znači: popravak koji u `learn.js` doda samo `resolveBlocks()` **može raditi dok se došlo preko Studija, a pasti pri izravnom
  ulasku u Learn** (npr. deep-link ili osvježena stranica). Learn treba **oba** koraka.
- **✅ IZVEDENO (2026-08-10) — sva tri sloja, redom kako su i zapisana:**
  1. **`prefetch` na šavu** — [my-materials.js `loadNodeContent()`](../../js/my-materials.js) sad potpiše slike prije nego ih itko pokuša prikazati; pokriva **sva četiri moda** jednim pozivom.
  2. **`renderContentBlocks()`** u [blocks-renderer.js](../../js/blocks-renderer.js) = **jedini ulaz za prikaz** (resolve + render). Sva četiri pozivatelja (`learn` · `studio` · `admin` · `block-editor`) idu kroz njega, pa odluka **više ne živi u programerovoj glavi**. Nerazriješena oznaka sad **glasno upozorava** u konzoli.
  3. **Testovi:** unit za omotač · **izvorna brana** (nijedna datoteka osim renderera ne smije zvati `renderBlocks(` izravno — pada s imenom datoteke i retka) · **E2E u Learnu** s ispražnjenim cacheom (hladan ulaz, inače bi test prošao i s bugom). Provjereno obrnuto: **vraćanjem buga oba testa pocrvene.**
- **Nastavak:** ista revizija („gdje još je ista pretpostavka pogrešna?") iznijela je **BUG-025** — v. gore.
- **RJEŠENJE (kako je bilo razrađeno prije izvedbe; tri sloja, i samo je prvi „popravak buga“):**
  1. **`prefetch` na ŠAVU, ne u rendereru.** [js/my-materials.js:446](../../js/my-materials.js#L446) `loadNodeContent()` je
     **jedino mjesto** kroz koje sadržaj osobnog materijala ulazi u učenje (vlastiti komentar: *„`initStudyPage` ga traži preko
     ovog šava"*). Već je `async`. Jedan `await SokratNodeImages.prefetch(payload)` ondje pokriva **sva četiri moda odjednom**.
     ⚠️ **Popraviti samo `learn.js` znači popraviti simptom** — kartice/kviz/dopune nose iste blokove i imale bi istu rupu.
  2. **`resolve` kroz JEDNU funkciju, bezuvjetno.** `resolveBlocks()` vraća **isti niz** kad nema što mijenjati → za kataloški
     sadržaj je besplatan → smije se zvati **uvijek**. Zato: jedan `renderContentBlocks()` koji radi resolve+render, i sva
     četiri poziva idu kroz njega. Time odluka **nestaje iz programerove glave**, a to je pravi uzrok.
  3. **Test koji pukne ako netko opet zaboravi.** (a) E2E u **Learnu**: objavi sliku → otvori Learn → `<img>` ima **potpisani**
     `src` koji stvarno vraća bajtove. (b) **Izvorna brana:** nijedna datoteka ne smije zvati `renderBlocks(` izravno osim
     omotača. Bug nije „`learn.js` ima grešku“ nego „pravilo živi u glavama“ (ADR-027).
- **⚠️ Zašto se nije primijetilo:** renderer ima **fail-safe** — `safeUrl` odbije nepoznatu shemu i sliku **tiho izostavi**
  (nikad polomljen `<img>`). Odlično za sigurnost, **grozno za primjećivanje**. Uz popravak dodati **glasno upozorenje u konzolu**
  kad `node-img:` označa stigne do renderera nerazriješena — tihi kvar postaje bučan.
- **🚫 Zamka koju NE smiješ uzeti kao prečac:** spremiti potpisani URL u payload. Potpis istječe (8 h) → objavljeni sadržaj bi
  „istrunuo“, a draft-autosave u localStorage vratio mrtve linkove. Modul to izričito zabranjuje ([node-images.js](../../js/node-images.js) §ZAŠTO).
- **Stari smjer (nadjačan gornjim):** Learn mora proići isti put — `prefetch(_data)` pa `resolveBlocks()` prije `renderBlocks()`. ⚠️ Potpis **istječe**, pa
  razrješavanje ide **pri prikazu**, nikad u spremljeni payload (to je invarijanta F4 i ne smije se prekršiti da bi slika „radila").
- **LEKCIJA (dvije):**
  1. **Jedan renderer nije isto što i jedan put prikaza.** Renderer je bio jedan i ispravan, ali **pred-obrada oko njega bila je prepisana na četiri mjesta** — a takva se odluka ne pamti, nego se zaboravi. Popravak nije bio „dodaj i u `learn.js`" (to je peti pozivatelj koji čeka svoj red) nego **ukloniti mjesto na kojem se odluka uopće donosi**.
  2. **Tihi fail-safe je dobar za sigurnost i loš za primjećivanje.** `safeUrl` je sliku uredno izostavio i nitko ništa nije saznao dok korisnik nije naletio. Sigurnosno ponašanje ostaje, ali **uz glasno upozorenje** — inače gate nikad ne dobije priliku pocrvenjeti.

### BUG-023 — Povratak u vlastiti materijal otvarao praznu study-stranicu koja puca pri svakom spremanju
- Status: ✅ riješen · Težina: **visok** za osobni materijal (katalog nedirnut) · Prijavio: **Sentry** (`JAVASCRIPT-3`), Leon proslijedio.
- **Simptom:** `TypeError: Cannot read properties of undefined (reading 'storageKey')` u `saveAnalytics` ← `trackQuizAnswer` ← `selectAnswer`. Jedna greška **po svakom kliku na odgovor**.
- **Reprodukcija:** uči iz osobnog materijala → zatvori karticu → vrati se unutar 24 h. Study-stranica se **prikaže prazna**, a svako spremanje napretka/analitike baca.
- **Uzrok (dvije stvari, obje potrebne):**
  1. **Odgođena registracija.** Katalog-subjekti su u `subjectDataMap` od učitavanja skripte. Osobni materijali su **sintetički** subjekti (`node:<uuid>`) koje `SokratMaterials` upiše u mapu **tek kad se otvori profil**. `restoreLastPosition` čita zadnju poziciju **sinkrono** i odmah navigira → `AppState.nav.subject` postoji, u mapi ga nema. Dodatno: `refresh()` odustane ako kartica profila nije montirana, pa na hladnom startu registracije **nije ni moglo biti**.
  2. **Guard koji čuva krivu stvar.** Pet mjesta je pisalo `if (!AppState.nav.subject) return;` pa `subjectDataMap[...].storageKey`. To provjerava **postoji li id**, ne **postoji li subjekt u mapi**. Razlika godinu dana nije značila ništa jer je svaki subjekt dolazio iz kataloga.
- **Rješenje (dva sloja):** ① **korijen** — `isSubjectOpenable()` u `navigation.js`: prije navigacije provjeri je li subjekt poznat, a za `node:` pokušaj `SokratMaterials.ensureRegistered()` (nova, **DOM-free** registracija); ako ne uspije → **ne otvaraj stranicu**. ② **obrana u dubini** — `currentSubjectMeta()`/`currentStorageKey()` u `config.js` kao **jedno mjesto istine**; svih pet čitanja ide kroz njih i na `null` **tiho ne radi ništa**.
- **Zašto ga gate nije uhvatio:** nijedan test nije radio **reload** s node-pozicijom. Testovi su materijal uvijek otvarali **kroz profil**, gdje je registracija već obavljena — pa je jedini put koji ruši bio i jedini neispitani.
- **LEKCIJA (dvije, i druga je teža):**
  1. **Pomoćna funkcija za spremanje ne smije bacati.** `saveProgress`/`saveAnalytics` nemaju pravo srušiti stranicu ni za jedan ulaz; „ne znam kamo pisati" je **no-op**, ne iznimka.
  2. **Rizik je bio ZAPISAN i svejedno isporučen.** Plan faze ([archive/MATERIJAL_FAZA.md](../archive/MATERIJAL_FAZA.md), M2, „četiri ruba koja NISU pokrivena") doslovno kaže: *„`saveCurrentPosition` sprema `{subject, lesson}` → obnova gađa id koji još nije registriran"*. **Rečenica u dokumentu ne sprječava ništa — `if` u kodu ili test sprječavaju.** Kad se rub prepozna, isti čas mu treba napisati test, inače je zapis samo uredno dokumentiran propust. Ovo je izravan povod za **ADR-027**.

### BUG-022 — U vlastitom materijalu se NIJE mogla napraviti nijedna kartica, kviz ni dopuna
- Status: ✅ riješen (`74d460a`, grana `docs/stage-a`, cigla M1) · Težina: **kritičan** za osobni materijal · Prijavio: **korisnik** (Leon, živo).
- **Simptom:** nov materijal nudi samo tab **Learn**. Nema Kartica, Kviza ni Dopuna — dakle ni gumba „＋ Dodaj". Zaglavlje pokaže „👁 1 moda".
- **Koraci:** Profil → Moji materijali → novi materijal → Uredi → „＋ Nova sekcija" → gledaj tabove.
- **Uzrok:** [`presentModes`](../../js/studio.js#L275) označi mod postojećim **samo ako je niz NEPRAZAN**. Nov materijal ima `flashcards: []` / `quiz: []` / `fillBlanks: []` → mod „ne postoji" → tab se ne nacrta → `renderPane` se **nikad ne pozove** → nema afordancije za prvu stavku. **Slijepa ulica po konstrukciji: prva kartica se nije mogla dodati nikad.**
- **Zašto je promaklo:** logika je pisana za **katalog**, gdje svaki predmet dolazi s punim nizovima, pa se prazno stanje nikad nije pojavilo. Uređivači kartica/kviza/dopuna, put upisa i prava su cijelo vrijeme **radili** — bili su samo **nedostupni**. Zato se u kodu ništa nije doimalo pokvarenim.
- **Rješenje:** u edit-modu su `cards`/`quiz`/`fill` prisutni čim postoji barem jedna sekcija (`if (isEd && cats(data).length)`). Read-only ostaje nepromijenjen — onome tko uči ne nudimo prazan mod. `learn` je namjerno izuzet (`renderLearnPane` preskače kategoriju bez `learn`-a → forsiran tab bio bi prazan panel; zapisano kao M1b). **Isti slijepi kraj postojao je i u javnom katalogu** — predmet bez ijedne dopune nije mogao dobiti prvu.
- **Lekcija:** ovo je uhvatio **korisnik, ne gate.** Faza je bila proglašena gotovom po **odčekiranoj tablici cigli**, a nitko nije pokušao napraviti karticu od nule. Odatle pravilo: **svaka mogućnost ima kriterij prihvaćanja u obliku „gotovo kad korisnik može X"**, nikad „test je zelen" ([UGC_SPEC §2](../product/UGC_SPEC.md)). Druga polovica lekcije: kad se logika piše nad podacima koji su **uvijek popunjeni**, prazno stanje je neispitani put — a za UGC je prazno stanje **početno** stanje.

### BUG-021 — KaTeX formule ostaju sirovi LaTeX u Studiju (u osobnom gradivu ZAUVIJEK)
- Status: ✅ riješen (`39e5d09`, grana `fix/studio-katex`) · Težina: **visok** za osobno gradivo, srednji za katalog · Prijavio: **korisnik** (Leon, živo na produkciji, screenshot).
- **Simptom:** u Studiju se formula prikaže kao kod — `\[\sqrt{55}\pm(\frac{154}{85})\]` — umjesto tipografirano. Slika i tablica u istom bloku rade normalno.
- **Koraci:** osobno gradivo → „Uredi gradivo" → dodaj Formula blok → upiši LaTeX → Objavi → pogledaj u pregledu.
- **Uzrok:** `js/blocks-renderer.js` **namjerno** ispljune `\[tex\]` kao **tekst** — renderer je sigurnosna granica i ništa ne izvršava. Ugovor je da **pozivatelj** nakon umetanja pozove `renderMath()`. `js/learn.js:88` to radi za studentsku stranicu, `js/exercises.js`/`quiz.js`/`fill-blanks.js`/`flashcards.js` za svoje panele — ali **`js/studio.js` nikad nije bio na tom popisu**. Promaklo je jer je Studio od početka gledan kao „pregled admina", a ne kao **jedini** prikaz nekog sadržaja.
- **Zašto je za osobno gradivo teže:** čvor (`nodes`) se gleda **isključivo u Studiju** — nema studentske stranice koja bi spasila prikaz. Formula se tamo nije tipografirala **nikad**: ni u pregledu, ni nakon objave. Kod kataloga je bug bio „samo" u admin-pregledu.
- **Rješenje:** jedan poziv `window.renderMath(canvas)` u `renderCanvas()`, **isključivo u read-only modu**. U edit-modu se NE smije zvati: tekst živi u `contenteditable`, a `editableToInline` bi pri sljedećem focusoutu pročitao KaTeX-markup natrag u model i **trajno pojeo formulu** (formula-blokove u editu tipografira `typesetFormulas` iz block-editora, scope = `.be-media--formula`). Regresija: `tests/studio-math.authed.spec.js` — prvi test dokazano **pada bez fixa** (0 `.katex`), drugi čuva da KaTeX ne uđe u `contenteditable`.
- **Lekcija:** kad renderer namjerno prebaci dio posla na pozivatelja, taj ugovor mora imati **popis svih pozivatelja i test po pozivatelju** — inače svaki novi prikaz (Studio, pa sutra dijeljenje/objava) tiho ispada iz njega. Ista obitelj kao BUG-020: dijeljeni mehanizam + implicitna obveza na strani pozivatelja.

### BUG-020 — Kviz procuri između predmeta/lekcija (stari kviz ostane pri promjeni predmeta)
- Status: ✅ riješen + 🚀 **LIVE 2026-07-15** (`25bba1e`, token `20260715004951`; live-verified: `resetQuiz` u serviranom `quiz.js` + poziv u `navigation.js`) · Težina: **visok** (pogađao SVE studente uživo — netočan kviz, mogao upisati krivi rezultat) · Prijavio: **korisnik** (Leon, živo).
- **Simptom:** započneš kviz u predmetu A i NE završiš ga → odeš na drugi predmet (ili drugu lekciju istog predmeta) → otvoriš Quiz tab i **još je uvijek kviz iz predmeta A** (stara pitanja, stari napredak).
- **Koraci:** predmet A → Quiz → *Start* (odgovori par pitanja, ne završi) → natrag → predmet B → Quiz tab → vidiš kviz predmeta A.
- **Uzrok (sistemski — „navigacija"):** study-stranica je **JEDAN dijeljeni DOM** za sve lekcije (isti `#quizSetup`/`#quizGame`/`#quizResults` + globalni `AppState.quiz`). `initStudyPage()` na učitavanju nove lekcije **potpuno resetira flashcards i fill** (`initFlashcards()`/`initFill()` čiste stanje+prikaz), ali za kviz zove **SAMO `updateQuizCategories()`** (napuni dropdown) — **nikad ne resetira `AppState.quiz` ni vidljivi panel**. Kviz je bio JEDINI mod bez reseta → in-progress panel + stara pitanja procure u sljedeću lekciju.
- **Rješenje (`fix/quiz-state-leak`):** nova `resetQuiz()` (`js/quiz.js`) čisti `AppState.quiz` + vrati panel na setup (`showQuizSetup()`); pozvana u `initStudyPage()` uz ostale resete, **pod eksplicitnim komentarom** „RESET SVIH STUDY POD-MODOVA — svaki novi mod OBAVEZNO dodaje svoj reset ovdje". Regresijski test `tests/quiz-reset.spec.js` (A→Start→B→Quiz mora biti SETUP + `questions=0`) — **dokazano PADA bez fixa** (privremeno-isključen-reset run: `setupVisible=false`). Smoke 19/0, typecheck 0, verify 0/0.
- **Lekcija:** kod **dijeljenog DOM-a + globalnog stanja**, učitavanje novog konteksta mora **potpuno resetirati SVAKI** pod-prikaz; ad-hoc reset raspršen po mjestima znači da će se novi/zaboravljeni mod tiho „zalijepiti". Centralizirano, imenovano mjesto reseta (s komentarom-ugovorom) sprječava ponavljanje klase. Ista obitelj kao BUG-019 (nedostatak pravog nav-modela) — **pravi navigacijski stog + čist per-lekcija lifecycle = kandidat za U8** (ne krpati širenje sad). [[live-login-verifies-crud]]
  - **📌 DOPUNA 2026-08-18:** v. dopunu uz BUG-019 gore — propis je raspoređen u fazu „KOSTUR" (K1 rute, K3 brana). **Da su dva buga propisala isto rješenje i oba ga odgodila na istu oznaku koja se u međuvremenu zatvorila, nitko nije primijetio pet tjedana** (2026-07-15 → 2026-08-18) — jer nijedan gate ne čita `BUGS.md`. **Odgoda zapisana u prozu nema rok.**

### BUG-019 — Back-navigacija: petlja profil ⇄ admin (povratak na početnu nemoguć)
- Status: ✅ riješen 2026-07-12 + ✅ **LIVE 2026-07-13** (deployano s F4; bug NIKAD nije bio na produkciji — admin stranica je do deploya postojala samo na f4) · Težina: srednji (UX, admin tok) · Prijavio: **korisnik** (2026-07-12, živo klikanje).
- **Simptom:** početna → profil → admin → back-strelica vrati na profil ✓, ali back s profila tada vrati **NATRAG U ADMIN** — i tako u krug (profil ⇄ admin); početna stranica postaje nedostižna.
- **Uzrok:** app nema povijest navigacije — samo jedno-slotni `profileReturnPage` (`js/navigation.js`) koji se postavlja pri **svakom** ulasku na profil. Back iz admina ide `navigateTo('profile')` (`js/admin.js` `#backFromAdmin`) → dolazak IZ ADMINA pregazi slot u `{page:'admin'}` → back s profila vodi u admin → admin back opet na profil → beskonačna petlja, izvorni cilj (početna/study) izgubljen.
- **Rješenje:** dolazak **iz admina** NE prepisuje `profileReturnPage` (admin je pod-stranica profila — ulaz i back idu kroz profil, pa profilov back mora preživjeti taj skok). 1 uvjet u `navigateTo()`. Regresijski test u `tests/admin.spec.js` („BUG-019", pravi klikovi na `#backFromAdmin`/`#backFromProfile`, sva 4 profila) — **dokazano PADA bez fixa** (stash-provjera). Cache `20260712180655`.
- **Lekcija:** jedno-slotni „return" pointer se sam pojede čim se pojavi druga razina navigacije — svaka nova pod-stranica mora ili čuvati tuđi slot ili treba **pravi navigacijski stog**. Stog (+ browser History API da i sistemska back-gesta radi u SPA-u) = kandidat uz editor-UX ciglu (U8), ne krpati sad.
  - **📌 DOPUNA 2026-08-18 — propis je RASPOREĐEN, nakon što je dvaput promašio svoj rok.** „Kandidat uz U8" nikad nije izveden, a **U8 je zatvoren**; isti propis ponovio je i BUG-020 (tri dana kasnije) i također ostao neizveden. Danas je to **faza „KOSTUR", cigla K1** ([FRONTEND_REDIZAJN.md §8](../plan/FRONTEND_REDIZAJN.md)) — s branom, jer je upravo ovo obrazac koji BUG-023 imenuje: *rečenica u dokumentu ne sprječava ništa.* Mjereno pri raspoređivanju: aplikacija je imala **devet stranica i jednu adresu** (`#/materials`), a `saveCurrentPosition` je **već serijalizirao potpun opis rute** — samo u `localStorage` umjesto u adresu.
  - **✅ ISPORUČENO ISTI DAN (2026-08-18):** K1 je gotov (spec §8.6) — devet stranica ima devet adresa, „natrag" vraća korak, dijeljen link otvara točno tu lekciju. Brana je **`tests/routes.spec.js`**, obrnuto provjerena. **Propis je time zatvoren nakon pet tjedana i dvije promašene oznake.** ⚠️ Sistemska back-gesta radi kroz `popstate`, ali `profile`/`admin`/`editor` **namjerno nemaju adresu** — deep-link bi im pokazao praznu stranicu, što je razred ovog istog BUG-a 023.

### BUG-018 — Admin (F4.3a) se nije detektirao + „Admin" curio na dno; Playwright to NIJE uhvatio
- Status: ✅ riješen 2026-07-06 (grana `foundation/f4` = preview; NIJE bilo na produkciji) · Težina: srednji (admin-only značajka) · Našao: **korisnik živom prijavom** („samo admin dole"), pa potvrđeno login-skriptom.
- **Simptom:** prijavljen kao admin — (a) nije se pojavila admin kartica/„Uredi sadržaj"; (b) na DNU svake stranice pisalo je „Admin"; (c) native `<select>` popup u admin viewer-u bio bijel (ignorira dark temu).
- **Uzrok:** (1) `js/admin.js` referencirao **`window.SokratAuth`**, ali `SokratAuth` je top-level `const` = **globalni leksički binding, NIJE `window` property** → `undefined` → `computeIsAdmin()` uvijek `false` + `onChange` listener se nikad ne registrira. (Svi drugi moduli — profile/cloud-sync — zovu `SokratAuth` **golo**.) (2) nova `.admin-page` klasa nije dodana u `css/variables.css` „hide all pages" grupu (`display:none` default) → `#admin-page` sekcija se prikazivala uvijek, na dnu. (3) `<select>` bez `color-scheme:dark`.
- **Popravak (`45489f7`+`0bc5e41`):** golo `SokratAuth` (typeof-guard) · `.admin-page` dodan u hide+active grupe · `color-scheme:dark` + tamni `option`. Regresijski test: `#admin-page` skriven na landingu.
- **Lekcija:** `admin.spec` je provjeravao samo `isAdmin===false` (točno i dok je detekcija PUKNUTA) pa je bug prošao SVE testove. **Za auth/RLS-gated značajke (CRUD) nužna je PRAVA prijava.** Uz to: **globali deklarirani kao `const` NISU na `window`** — referenciraj ih golo (`typeof X !== 'undefined'`), ne `window.X`. [[live-login-verifies-crud]]
  - **✅ RIJEŠENO (2026-07-08, `d57c5fd`):** Playwright SAD ima login — **storageState** obrazac (`tests/auth.setup.js` se prijavi + spremi sesiju; `authenticated` projekt je reusea). `npm run test:authed` pokriva **pozitivan admin-put** (isAdmin=true + admin vidi edit-gumbe) — točno ono što je nedostajalo. Gate-an na `TEST_ADMIN_*` secret (bez njega default suite nepromijenjen). Vidi `docs/workflow/TESTING.md §Authenticated`.

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
- Rješenje (Opcija A, [EXERCISES_DB_FIX_PLAN.md](../archive/EXERCISES_DB_FIX_PLAN.md), cigla-po-cigla, sve LIVE 2026-06-27 `801d9a6`):
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
- **➕ 2026-08-25 (D1): razred greške je zatvoren, ali na DVA različita mjesta** — jer postoje dva
  puta do podatka. **Iz editora** je nemoguć: praznina se ubacuje gumbom, a ručno utipkan niz od
  **3+ podvlake** se poravnava na 7 (jedna i dvije se ne diraju — LaTeX indeks). **Iz ručno pisane
  `data/*.js`** i dalje je moguć, ali ga hvata `npm run validate:schema` (`pattern: "_______"`).
  *Popravak u sučelju ne pokriva put koji sučelje zaobilazi.*

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
- Rješenje: dodan `?v=YYYYMMDD` na sve `@import` u `styles.css` + bump `styles.css?v=`
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
