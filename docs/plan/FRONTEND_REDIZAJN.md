# Frontend redizajn — prelazak na Tailwind

**Status:** 🟦 aktivan spec · **Otvoren:** 2026-08-09 · **Odluke:** [ADR-028](../records/DECISIONS.md) (Tailwind, Next.js odbijen) · [ADR-029](../records/DECISIONS.md) (UGC je glavni proizvod)
**Opseg (Leon):** cijela platforma **i** editor · **UGC ide naprijed.**

> **Zašto ovo radimo, zašto baš Tailwind-CLI i zašto NE Next.js, piše u [ADR-028](../records/DECISIONS.md)** —
> mjere, odbačene alternative i tvrde granice. Ovdje stoji samo **što se radi i kojim redom**.

> ### 🔄 Preslagano 2026-08-09 (Leon: *„UGC nam postaje glavna stvar, predmeti su samo jedna stvar"*)
> Editor i vlastiti materijal bili su **zadnji** jer su bili periferni. [ADR-029](../records/DECISIONS.md)
> ruši tu pretpostavku, pa idu **naprijed** — a ispred svega dolazi **C0**, koji ulaz u UGC daje odmah,
> bez ijedne linije Tailwinda.

---

## 1 · Što ova faza jest, a što nije

**Jest:** zamjena jezika stiliziranja. Ista aplikacija, isti tokovi, drugi temelj — plus vizualni
popravci koji su bez tog temelja bili preskupi.

**Nije:**
- **nova funkcionalnost** — objava/dijeljenje i MCP dolaze **poslije** ove faze (sekvenca u [ROADMAP.md](./ROADMAP.md));
- **promjena ponašanja** — ako se usput rodi želja za drugačijim tokom, ide u [BACKLOG.md](../records/BACKLOG.md), ne ovdje;
- **sadržajni rad** — M5b (skraćivanje 25 predugih kartica) ostaje u backlogu, nije preduvjet.

---

## 2 · Kriteriji prihvaćanja — gotovo kad korisnik može…

Faza je gotova kad **korisnik**, ne kad je gate zelen:

0. **…doći do vlastitog materijala bez objašnjenja** — vidi ulaz odmah, iz navigacije i s landinga, bez
   ulaska u profil i bez skrolanja kroz postavke ([ADR-029](../records/DECISIONS.md)).
1. **…proći cijeli tok na telefonu od 320 px** — landing → browse → predmet → sva četiri moda → vježbe →
   profil → editor — **bez horizontalnog scrolla i bez elementa koji strši ili je prekriven.**
2. **…doći tipkovnicom do svake akcije** i u svakom trenutku **vidjeti gdje je fokus**.
3. **…otvoriti BILO KOJI predmet iz kataloga i vlastiti materijal i ne primijetiti da se išta pokvarilo** —
   napredak, boje, KaTeX, slike, tablice i vježbe izgledaju i rade kao prije.
4. **…vidjeti boju stavke na CIJELOJ plohi kartice**, ne samo na rubu
   ([backlog: akcent = cijela kartica](../records/BACKLOG.md)). Lice kartice je danas zasićen indigo
   gradijent, pa akcent mora **zamijeniti** gradijent, a ne se slojevati preko njega.
5. **…na landingu pročitati brojke koje se međusobno slažu** — broj predmeta i broj pitanja moraju
   pokrivati isti doseg ([backlog: broj pitanja pokriva 17 od 22](../records/BACKLOG.md)).

**Tehnički izlazni uvjeti** (nisu zamjena za gornje, nego njihova cijena): nula `!important` u novom
sloju · jedan skup breakpointa · nijedna hex-boja izvan `@theme` · `styles.bundle.css` obrisan.

---

## 3 · Cigle — redom

Svaka cigla je zasebna grana, zasebna provjera, zasebna Leonova potvrda za deploy (pravilo #2/#5).
**Površina je ili cijela nova ili cijela stara** — polovična je jamstvo za rat specifičnosti.

| # | cigla | što nestaje | gotovo kad |
|---|---|---|---|
| **C0** ✅ | **Ulaz u vlastiti materijal** — promaknuće iz pododjeljka profila u ravnopravno odredište. **Bez Tailwinda, bez redizajna.** | ništa | korisnik dođe do svog gradiva **iz navigacije i s landinga**, izravnom rutom, bez ulaska u profil |
| **C1** ✅ | **Temelj** — Tailwind v4 + `@theme` tokeni, `build:css` proširen, drift-gate, `?v=` bump | `styles.css` (manifest) | **stranica izgleda bajt-identično**, a paleta/razmaci/breakpointi postoje kao tokeni |
| **C2** ✅ | **Landing** — koncept odbijen (§7.13) pa prepravljen u četiri cigle: **A** živi prikaz obrisan · **B** tinta na pločicama · **C** katalog (svih 24, tražilica, filtar, grupe, ＋ pločica) + svoje gradivo + četiri načina + MCP „uskoro" · **D** podloga i prostor za znak (§7.15). **A+B na produkciji; C+D čekaju Leonov pogled.** | `landing.css` 1079 → 578 → **380** (A) → ~660 (C+D, tri nove sekcije) | posjetitelj koji prvi put dođe vidi **oboje**: da ima gotovih predmeta **i** da smije napraviti svoje; kriteriji 1, 2, 5 vrijede za tu stranicu |
| **C3** 🔄 | **Vlastito gradivo + editor** — „Moji materijali", Studio, admin-editori. **Tri cigle gotove i na produkciji** (authed a11y-gate · širina + kvar u rendereru · `studio.css` na nuli `!important`); **ostaje Studio na telefonu** — dok stoji, C3 se ne smije proglasiti gotovim (kriterij #1 imenuje editor na 320 px). | `my-materials.css`, `studio.css`, `block-editor.css` | autor napravi materijal od nule i objavi ga |
| **K** 🔄 | **„KOSTUR" — rute i jedna gornja traka** (§8). Ubačena između C3 i C4 (Leon, 2026-08-18) po presedanu C0-a: informacijska arhitektura prije kozmetike. **K1 ✅ rute** (§8.6) · **K2** jedna traka · **K3** brana dohvatljivosti · **K4** materijali u kvaliteti kataloga | tri duplicirana zaglavlja (`browse-`/`lessons-`/`study-header`) | iz **svake** stranice — uključujući `#editor-page` — vodi bar jedan klik drugamo, a svaka stranica ima adresu koja se da podijeliti |
| **C4** | **Browse + lekcije** | `browse.css`, `subject-selector.css` (**49 `!important`**), `pages.css` | student dođe do bilo kojeg predmeta i lekcije |
| **C5a** | **Modovi uvježbavanja** — kartice · kviz · dopune · napredak | `flashcards-`/`quiz-`/`fill-blanks-`/`progress-section.css` | student uvježbava u sva četiri moda; **kriterij 4** vrijedi |
| **C5b** | **Gradivo + vježbe** — sve što ide kroz renderer ili engine | `learn.css`, `learn-blocks.css`, `math.css`, `exercises.css`, `blind-map.css` | student čita gradivo i rješava vježbe; KaTeX, slike i tablice nedirnuti |
| **C6** | **Profil, auth, pravne, consent** | `profile.css`, `auth.css`, `legal.css`, `consent.css` | korisnik se prijavi, uredi profil, obriše račun |
| **C7** | **Gašenje** | `responsive/*` (6 datoteka, 40 `!important`), `components.css`, `variables.css`, `styles.bundle.css`, mrtva tema | u repozitoriju nema starog CSS-a ni mrtvog koda teme |

> ### ✂️ C5 JE RAZBIJEN NA DVIJE CIGLE (Leon, 2026-08-13: *„možemo razbit C5 na dvije cigle"*)
> Bila je **2755 redaka** — najveća i najrizičnija u fazi, i jedina koja bi sama trošila trećinu
> preostalog vremena. Rez **ne ide po veličini nego po ŠAVU**, jer bi rez na pola datoteka ostavio
> dvije polovične površine, a spec §3 to izričito zabranjuje („površina je ili cijela nova ili
> cijela stara").
>
> - **C5a = ono čime student UVJEŽBAVA.** Ta četiri moda dijele `.control-btn`, `.answer-btn` i
>   traku sa statistikom — migriraju se zajedno ili se tuku. Nose i **najveći rizik od BUG-025**:
>   opcije kviza i rečenice dopuna su točno onaj tekst koji nikad nije dolazio do `esc`.
> - **C5b = ono što student ČITA.** Sve ide kroz `renderContentBlocks()` ili kroz engine vježbi —
>   više redaka, ali mehanički ujednačenije, i s jednom tvrdom granicom (`blocks-renderer.js` i
>   engine se **ne diraju**, mijenja se samo CSS oko njih).
>
> **Cijena podjele je jedan dodatni krug gateova** (puna suita + Leonov pogled). Prihvaćeno svjesno:
> jeftinije je od povrata cigle koja je dirala sva četiri moda odjednom.

**C0 ide prvi i ne čeka ništa.** To nije redizajn nego popravak informacijske arhitekture: prije njega
su se „Moji materijali" montirali **unutar profila**, bez vlastite stranice i rute, a landing nav
(`Subjects · How it works · Study modes · About`) glavni proizvod **nije spominjao**. Dok je tako,
nikakav novi izgled ne pomaže — korisnik do njega ne dođe.

> **✅ C0 je ISPUNJEN I NA PRODUKCIJI** (2026-08-10, `00e134b..0e2843a`, Leonov OK: *„mergaj."*).
> Provjereno na živoj stranici, ne samo u CI-u: token `20260810150309` = repo · ulaz prvi u navigaciji ·
> 3 ikone u zaglavljima · 0 JS grešaka. Puna suita prije mergea: **332 / 0 / 18 skip**.
>
> **Što je C0 naučio, a vrijedi za C1–C7:**
> 1. **Ciljani podskup testova ne dokazuje ciglu.** Prvi zapis je tvrdio „41 prošao"; puna suita je rekla
>    **35 palo**. Podskup nije uključivao ni `layout-guard` ni ijedan authed spec.
> 2. **Uzorak širina u gateu je i sam moguća rupa.** Dvije neovisne sesije su istog dana popravile isti bug
>    i **obje prošle vlastiti gate** — jednoj je falio 861px, drugoj 1200px. Sada: svaki CSS-prag + prag±1.
> 3. **CI (Linux) mjeri font ~4px šire od Windowsa.** Rezerva ispod ~5px je crvena na CI-u iako je lokalno
>    zelena. Traži se **mjerena** rezerva, ne „prolazi kod mene".
> 4. **Jedna ikona u traci srušila je pojas od 400px širine** i tražila tri kruga mjerenja. C2 dira cijeli
>    landing — planirati ga kao spor, ne brz.

**Izvedeno u C0:** vlastita stranica `#materials-page` · ruta **`#/materials`** (`#/`-prefiks da se ne
sudari s postojećim sidrenim linkovima landinga) koja **pobjeđuje spremljenu poziciju** · ulaz **prvi u
landing-navu** + ikona u zaglavljima browse/lessons/study · profil zadržao **poveznicu**, ne widget
(dva `#myMaterials` u dokumentu razbila bi `mount()`) · **odjavljen posjetitelj vidi poziv na prijavu, ne
prazan ekran** — to je jedini razlog zašto ulaz smije stajati u navigaciji i prije prijave.

**C1 nema vizualnog učinka i to je namjerno.** Ako se u njemu išta promijeni, znači da smo promijenili
dvije stvari odjednom i ne znamo koja je pukla.

> **✅ C1 JE ISPUNJEN** (2026-08-11, grana `feat/c1-tailwind-temelj`) — **tailwindcss 4.3.3, pinana točna
> verzija** (generirani CSS se commita i čuva ga drift-gate; minorni skok bi obojio CI crveno bez ijedne
> naše izmjene). Dokaz da se izgled nije pomaknuo: **3438 usporedbi izračunatih stilova kroz 3 širine,
> 0 razlika** (`npm run css:diff`) — alat je obrnuto provjeren promjenom `--radius` za 1px, na što je
> pokazao 393 razlike na 71 elementu. Bundle 269 → **216 KB** (Lightning CSS briše komentare).
>
> **Što je izvedeno:**
> - **`css/app.css`** = novi CSS manifest i ulaz za Tailwind CLI; naslijedio je ulogu `styles.css`, koji je
>   **obrisan** (dvije liste modula neizbježno se raziđu). **`css/tokens.css`** = `@theme static`, 31 token.
> - **Preflight (Tailwindov reset) se NE uvozi** — prepisao bi naš reset i naslijeđene stilove naslova/lista.
> - **Tokeni imaju semantička imena** (`surface`/`ink`/`brand`), a **vrijednosti su namjerno današnje**.
>   C1 mijenja jezik, ne izgled: novi identitet mijenja samo VRIJEDNOSTI u `tokens.css` (§7).
> - **`--color-*` · `--shadow-*` · `--font-*` · `--radius-*` obrisani do nule** pa izgrađeni ispočetka.
>   `bg-indigo-500` i `text-slate-400` **više ne postoje** — to je glavna brana protiv klizanja natrag u
>   zadani framework-izgled. Usput je nestala i zamka: Tailwindov `--shadow-lg` sudarao se s našim iz
>   `variables.css`, a `rounded-xl` se generirao kao `border-radius: var(--radius-xl)` — s varijablom koja
>   nije emitirana, dakle pravilo bez vrijednosti.
>
> **Tri nalaza koja mijenjaju kako se piše C2–C7:**
> 1. **Kaskadni slojevi tuku specifičnost, a neuslojeni CSS tuče svaki sloj.** Da su utilityji otišli u
>    `@layer utilities`, `* { margin: 0 }` iz `variables.css` tukao bi `mt-4` i svaka Tailwind klasa za
>    razmak bila bi mrtva. Zato: **sve ostaje neuslojeno, utilityji idu na kraj.** Obrnuta varijanta
>    (legacy u `@layer legacy`) je odbačena jer bi vendorski CSS (KaTeX, Font Awesome — zasebni `<link>`,
>    dakle neuslojeni) počeo tući naše override-e; `css/math.css` postoji upravo zato da tematizira KaTeX.
>    **Cijena:** legacy pravilo veće specifičnosti i dalje tuče utility → površina se migrira CIJELA, a
>    tvrdoglavo pravilo se **briše**, nikad ne nadglašava s `!important`.
> 2. **Tailwind skenira izvor kao TEKST i vadi kandidate iz naših imena.** Izmjereno: iz `modes-grid` →
>    `grid`, iz `lb-table` → `table`, iz `visually-hidden` → `hidden`, a iz JavaScripta `if (!container)` →
>    `!container` (20 redaka mrtvog CSS-a iz operatora negacije). Od 14 generiranih pravila **12 nije
>    pogađalo nijedan element**, a 2 jesu — `hidden` i `text-danger` SU naše legacy klase, pa bi ih
>    Tailwindova inačica (koja stoji zadnja) tiho preuzela. `.text-danger` bi prešao s `var(--danger)` na
>    `var(--color-danger)`: danas ista boja, ali **od C2 nadalje različita, na mjestu koje nitko nije dirao.**
>    Zato C1 završava s **nula generiranih utilityja** i eksplicitnim popisom iznimaka u `css/app.css`.
> 3. **Sudar imena postoji i izvan klasa.** Naš `@keyframes spin` (`responsive/03`) dijeli ime s
>    Tailwindovim ugrađenim `spin`. **Imena animacija su globalna i ne poznaju kaskadne slojeve**, pa su se
>    u izlazu našle obje definicije — a pobjeđuje kasnija, dakle njegova, koja nema `from`. Naša je
>    preimenovana u **`sokratSpin`** (ostale su već bile prefiksirane: `mmSpin`, `studySpin`, `stpop`…).
>    Isti rizik nose `ping`/`pulse`/`bounce`.
> 4. **Statička analiza i mjerenje u pregledniku hvataju različite bugove.** `css-diff` je pokazao 0 razlika
>    baš dok su `hidden`/`text-danger` bili pregaženi — jer ti elementi nastaju tek u runtimeu i na
>    učitanoj stranici ih nema. Isto vrijedi za `spin`: našao ga je **inventar `@keyframes` starog i novog
>    bundlea**, ne preglednik. Obrnuto, gate ne vidi kaskadu.
>    **Cigla nije gotova dok oba puta ne budu zelena.**
>
> **Nova dva alata** (oba obrnuto provjerena — svaka brana je dokazano pala kad je trebala):
> `npm run check:tailwind` (6 provjera, **u preflightu**) · `npm run css:diff` (preglednik + port, **nije**).

**Mrtva tema (C7):** `initTheme()` tvrdo postavlja `dark`, `toggleTheme()` piše `data-theme="light"`,
ali **`[data-theme="light"]` ne postoji nigdje u CSS-u**, a `.theme-toggle` gumb ne postoji u
`index.html` — postoji samo njegov CSS u tri datoteke i JS handler koji ništa ne veže. Briše se, ne seli.

---

## 4 · Tvrde granice (prekršaj = vraćanje cigle)

1. **Tailwind nikad u `data/`.** Gradivo zadržava semantičke klase. Obrazloženje: [ADR-028](../records/DECISIONS.md).
2. **Engine vježbi se ne dira** — sveto pravilo; mijenja se samo CSS oko njega.
3. **`blocks-renderer.js` ostaje jedina sigurnosna granica renderiranja** — i to je **širi zahtjev nego što je bio do BUG-025**. Granica je dotad pokrivala samo **blokove**, a tekst stavki (opcije kviza, rečenice dopuna, nazivi sekcija) do nje nikad nije dolazio. Sada vrijedi: **prikaz blokova ide isključivo kroz `renderContentBlocks()`**, a **svaki tekst iz podataka koji ide u `innerHTML` mora kroz `SokratBlocks.esc`** (ikona kroz `safeIcon`, boja kroz `accentFrom`, URL kroz `safeUrl`).
   ⚠️ **Ovo je za C4/C5 stvaran rizik, ne formalnost:** te cigle prepisuju upravo `quiz`/`learn`/`fill`/`progress` markup, a bug se vraća **tiho** — jedno pitanje u katalogu bilo je zbog njega neodgovorljivo. Brane: `tests/escaping.spec.js` + izvorna brana u `tests/unit/blocks-renderer.test.js`.
4. **Nijedan gate ne slabi** da bi cigla prošla. Ako `axe` ili responsive suite padnu, pada cigla.
5. **Dinamički građene klase su zabranjene.** Tailwind skenira izvor, ne runtime, pa `'bg-' + boja`
   tiho nestane iz izlaza. Naš markup velikim dijelom nastaje u JS-u — **paleta od 8 boja ostaje na CSS
   varijablama**, nikad na sastavljenim imenima klasa.

---

## 5 · Gateovi koji moraju ostati zeleni

`npm run preflight` (uklj. `check:docs`, css drift, `bump:check` i — od C1 — **`check:tailwind`**) ·
`npm run test:responsive` (**304 testa**, 4 iPhone profila) · `npm run test:authed` · axe
**0 serious/critical** na sve četiri stranice · Lighthouse budžeti.
Uz svaku ciglu koja dira CSS ide i **`npm run css:diff`** (nije u preflightu — traži preglednik):
u C1 dokazuje 0 razlika, u C2–C7 da se promijenila **samo** ciljana površina.
Postupak i pragovi: [workflow/TESTING.md](../workflow/TESTING.md).

**Poznata zamka:** dio Playwright-selektora gađa **klase**. Migracija površine i njeni testovi idu u
**istom** commitu — inače suite postane zelen zato što više ništa ne nalazi.

---

## 6 · Rizici

| rizik | zašto boli | protumjera |
|---|---|---|
| Klase koje postoje samo u JS-stringovima | Tailwind ih ne vidi → stil tiho nestane **samo u produkciji** | granica 5 gore; C1 uvodi provjeru da izlaz sadrži očekivane klase |
| Service Worker servira stari CSS | korisnik vidi polurazbijenu stranicu do reinstalacije | `?v=` bump + `SW_VERSION` po svakoj cigli (pravilo #1) |
| KaTeX i vendorani CSS | nisu naši, ne smiju u čišćenje | ostaju zasebne datoteke, izvan Tailwind-izlaza |
| Editor zadnji = najdulje na dvije estetike | vizualni nesklad tjednima | prihvaćeno svjesno: regresija u editoru košta najviše, pa ide kad je postavka dokazana |

---

## 7 · Vizualni identitet — ulaz u C2

> Leon, 2026-08-11: *„mora izgledati potpuno drukčije, profesionalnije, ljepše i bolje… moramo se
> potruditi da ne izgleda kao da je frontend napravljen Claude Codeom."*
> Ovo poglavlje pretvara tu rečenicu u provjerljive odluke. **Ne opisuje ukras nego pravila.**

### 7.1 Dijagnoza — zašto današnji izgled čita kao strojni

Nije stvar ukusa, nego mjerenja. U `css/` je **62 različite hex-boje**, a najčešće su:

| boja | pojava | što je zapravo |
|---|---|---|
| `#6366f1` | 25× | Tailwind `indigo-500`, **zadana vrijednost** |
| `#0f172a` | 9× | Tailwind `slate-900` |
| `#334155` | 13× | Tailwind `slate-700` |
| `#818cf8` | 11× | Tailwind `indigo-400` |

**Nijedna od njih nije izabrana — sve su naslijeđene.** To je prvi i najjači signal: indigo-na-slate
je zadana paleta svakog generiranog sučelja na internetu, pa je oko prepoznaje prije nego pročita ijednu riječ.

Uz nju idu još četiri navike, sve prisutne:
1. **Gradijent kao ukras, ne kao struktura** — tri `gradient-orb` mrlje s `blur(110px)` iza heroja
   plus gradijentni tekst. Potpis generičkog landinga.
2. **Jedan font za sve.** `Space Grotesk` se **već učitava**, a gotovo se ne koristi → nema kontrasta
   između naslova i gradiva; sve je Inter u tri težine.
3. **Jedna zaobljenost svugdje** (12px / 20px) → kartica predmeta, modal, gumb i polje izgledaju kao
   ista stvar u četiri veličine.
4. **Ikona u obojenom kvadratiću × 3 u mreži** — najprepoznatljiviji feature-grid kliše.

### 7.2 Pravila koja iz toga slijede (vrijede za C2–C7)

1. **Boja nosi značenje, ne raspoloženje.** Ovo je alat za učenje: boja mora kodirati **stanje**
   (znam / ne znam / napredak) i **sekciju gradiva**. Zato paleta ostaje uska i prigušena, a **8 boja
   sekcije su jedino stvarno šareno na ekranu** — i vide se na CIJELOJ plohi kartice (kriterij 4).
2. **Tipografija preuzima posao koji danas radi boja.** Hijerarhija kroz veličinu, težinu i razmak,
   nikad kroz gradijentni tekst. `Space Grotesk` dobiva svoj posao (`--font-display`), Inter nosi gradivo.
3. **Ploha, ne svjetlucanje.** Razlika između razina gradi se plohom i razmakom; sjene su dvije
   (`--shadow-e1/e2`) i tu prestaju. Nema glowa, nema stakla.
4. **Gustoća poslije landinga.** Landing smije disati; sve iza njega je radna površina i mora podnijeti
   ozbiljnu količinu informacija bez skrolanja u prazno.
5. **Najviše jedan ukras po ekranu** — i to samo ako nosi značenje.

### 7.3 ⚠️ NADIĐENO — „Ponoć i menta" je pala na živom ekranu (2026-08-12)

> **Ne briši ovaj odjeljak.** Ostaje kao zapis o tome KAKO je odluka pala, jer je pouka
> skuplja od same palete. Aktualno stanje je **§7.4**.

Paleta je izabrana iz tablice heksova i prošla je svaku provjeru koju smo imali — WCAG na tri
plohe, hue-odvojenost, `css:diff`. Zatim je Leon prvi put vidio gotov ekran:
*„apsolutna katastrofa… crna i zelena nikoga ne motivira na učenje."*

**Dvije pouke, obje vrijede za svaku sljedeću vizualnu odluku:**

1. **Paleta se ne bira iz tablice.** Kontrastni brojevi kažu je li nešto ČITLJIVO, ne je li
   dobro. Sve daljnje odluke o izgledu biraju se na živom ekranu — zato prototip
   (`prototypes/landing-v2.html`) ima prekidač koji mijenja paletu uz **nepromijenjenu
   tipografiju i raspored**, da se uspoređuje točno jedna varijabla.
2. **Bježanje od jednog klišea nije isto što i izbor.** Napustili smo indigo-na-slate i sletjeli
   u „tamna podloga + jedan neon akcent" — a to je *isto tako* prepoznatljiv potpis generiranog
   sučelja. Uz to: gotovo svi alati za učenje koji rade (Quizlet, Duolingo, Khan, Notion) su
   **svijetli**; tamno je konvencija editora koda, ne nečega što se čita satima i uči danju.

Vrijednosti koje su tada zapisane žive dalje kao tema **`mint`** — jedna od četiri, ne zadana:

| token | vrijednost | | token | vrijednost |
|---|---|---|---|---|
| `--color-surface-0` | `#0B1A1C` | | `--color-ink-0` | `#E9F3F2` |
| `--color-surface-1` | `#112629` | | `--color-ink-1` | `#C5D8D7` |
| `--color-surface-2` | `#193539` | | `--color-ink-2` | `#88A7A6` |
| `--color-line` | `#1F4247` | | `--color-brand-500` | `#4FC9AB` |

Boje sekcije (jedina zasićenost na ekranu): `#4FC9AB` · `#5AA9E6` · `#E2B53F` · `#E2725F` · `#9B8ADE` · `#3FBFA0`.

**⚠️ Dvije vrijednosti su već ispravljene zbog kontrasta, prije nego što su zapisane.** Izmjereno po
WCAG-u na sve tri plohe: na `surface-0` i `surface-1` cijela paleta prolazi AA s rezervom (najniže 5.11),
ali na najsvjetlijoj plohi `surface-2` prvotni prijedlog pada — prigušen tekst `#7C9B9A` daje **4.36**, a
crvena `#E2725F` **4.23**, oboje ispod praga 4.5. Zato `--color-ink-2` ide na **`#88A7A6`** (5.05), a
crvena za TEKST na **`#E8836F`** (4.91); puna `#E2725F` ostaje za ispune i obrube, gdje vrijedi prag 3.0.
To je isti obrazac koji već imamo (`--danger` vs `--danger-text` u `variables.css`) i razlog zašto
`axe`/Lighthouse gate ne smije biti stvar sreće. Za usporedbu, današnji prigušeni tekst daje 5.71.

---

### 7.4 ✅ AKTUALNO — četiri teme, korisnik bira (Leon, 2026-08-12)

Nakon što je vidio četiri palete uživo, Leon: *„sva četiri mi se sviđaju, možemo li napraviti sva
četiri pa korisnik onda bira."* **Da** — i to je jeftino iz razloga koji je izmjeren, ne pretpostavljen:

> **Tailwind v4 ne upisuje boju u klasu nego REFERENCU** — `.bg-brand-500 { background-color:
> var(--color-brand-500) }`. Zato jedan `[data-theme]` blok koji pregazi varijablu prebaci
> **istovremeno i sve Tailwind klase i svih 992 legacy `var()` poziva** kroz most u
> `css/variables.css`. **Tema je popis vrijednosti, ne druga verzija CSS-a.**

**Četiri teme** (sve u `css/tokens.css`, sve prolaze `npm run check:contrast`):

| id | naziv | svjetloća | marka |
|---|---|---|---|
| `academic` **(ZADANA od 2026-08-13)** | **Akademsko plavo** | svijetlo | plava `#1657D0` + marker `#FFD24A` |
| `paper` | **Papir i marker** | svijetlo | plava `#2C5FD6` + marker `#FFD24A` |
| `chalk` | **Kreda i tabla** | tamno, toplo | kreda-žuta `#F2C14E` |
| `mint` | **Ponoć i menta** | tamno | mentol `#4FC9AB` |

> ### ⚠️ ZADANA TEMA JE PROMIJENJENA — i razlog je važniji od izbora (2026-08-13)
>
> „Kreda i tabla" je bila zadana **osam sati**. Leon ju je vidio na gotovom landingu:
> *„ona boja u frontendu je odvratna, ja nisam nikada vidio nešto odvratnije."*
>
> To je **druga tamna paleta zaredom** odbijena tek na živom ekranu — nakon „Ponoći i mente"
> (§7.3). Dvije nezavisne odbijenice više nisu stvar ukusa nego **obrazac**, i pokazuju da je
> §7.3 zapisao točnu pouku, ali ju je faza svejedno ponovila: *gotovo svi alati za učenje koji
> rade su svijetli; tamno je konvencija editora koda, ne nečega što se čita satima i uči danju.*
> Isto je tvrdio i §7.6 („Appleova podloga za tekst je svijetla"). **Znali smo, i svejedno
> smo dvaput isporučili tamno** — jer je brojka ispod izgledala kao zid.
>
> **⛔ RANIJI UVJET ZA BIRAČ BIO JE NETOČAN, I TO JE GLAVNI NALAZ C2.**
> Ovdje je stajalo: birač i svijetla tema čekaju `check:palette` = **0**, dakle cijeli C3–C7.
> **`npm run palette:breakdown`** pokazuje da je taj broj **tri različita duga zbrojena u
> jedan**, i da samo jedan blokira svijetlu podlogu:
>
> | | što se dogodi na svijetlom |
> |---|---|
> | **zakucan tekst** (`color:#fff`) | ⛔ **NEVIDLJIV** — jedino što stvarno blokira |
> | plohe/rubovi (`rgba(255,255,255,.06)`) | blijedo, ali ispravno |
> | stara paleta (indigo/slate) | neusklađeno, ali čitljivo |
>
> Pri otkriću je omjer bio **46 / 54 / 125**: prepreka je bila **46 pravila u 15 datoteka**,
> ne pet cigli. (Trenutni brojevi ispisuje sam alat — namjerno se ne prepisuju u prozu, ADR-027;
> `-- --list` daje svako pravilo sa selektorom i pozadinom.)
>
> **Agregatna brojka je skrivala odluku:** dok je stajalo „435", svijetla tema je izgledala kao
> kraj faze; kad se razdvojila, ispalo je da je dostupna isti dan. **Pouka za svaki sljedeći
> gate: čegrtaljka mora brojati po POSLJEDICI, ne po uzorku** — inače mjeri točno, a savjetuje
> krivo. Zato je razlaganje ostalo u repozitoriju kao alat, a ne kao jednokratno mjerenje.
>
> **Provjereno na ekranu, ne u tablici:** landing · browse · lekcije · study · learn, svi u
> zadanoj svijetloj temi, 0 JS grešaka. Jedina stvarno slomljena površina bila je **traka za
> kolačiće** — jedini modul koji je namjerno bio „self-contained (explicit colors)", pa je kao
> jedini ostao tamna ploča preko dna svijetle stranice. Prebačena na tokene (9 → 0).
>
> **Preostala fatalna se NE popravljaju u C2.** Pod zadanom (svijetlom) temom su status-boje
> TAMNE, pa je bijeli tekst na njima ispravan; slome se tek pod `chalk`/`mint`, a birač još ne
> postoji. To je posao C3–C7, i sad ima točan popis: **`npm run palette:breakdown -- --list`**.

**Zato je i `check:palette` proširen na zakucanu bijelu/crnu** (prije ih nije gledao: tražio je samo
staru paletu). Brojka je s 300 skočila na 435 — nije poraslo, nego se **vidjelo više**. (C2/3 ju je spustio na 433: `legal.css` je prestao držati vlastitu paletu.)

**Dva nova tokena koja su izašla iz mjerenja:**
- **`--color-on-brand`** — tekst na ispuni marke. Mentol + bijelo = **2.04** (pada), kreda-žuta +
  bijelo = **1.86**; u svijetlim temama je obrnuto (bijelo na plavoj). Stari indigo je podnosio
  bijelo, nove palete ne → to više nije pravilo koje se pamti nego token.
- **`--color-line-strong`** — rub KONTROLE (polje, gumb), odvojen od ukrasnog razdjelnika
  `--color-line`. Izašlo iz lažnog pozitiva `check:contrast`-a: gate je mjerio razdjelnik na 3:1 i
  oborio sve četiri teme. **Provjera je bila kriva, ne palete** — WCAG 1.4.11 traži 3:1 samo za
  granice nužne da se komponenta prepozna, a ukrasni razdjelnik je izuzet. Nalaz je ipak vrijedio:
  razdjelnik i rub polja dijelili su jedan token uz jedan prag.

**Tipografija (Leon je izabrao smjer „serif za naslove + grotesk za gradivo"):** **Inter + Space
Grotesk odlaze.** Oba su na svakom popisu „zadanih" fontova generiranih sučelja — nakon promjene
palete bili su najjači preostali potpis. Zamjena u prototipu: **Literata** (napravljena za čitanje
na ekranu — izbor izlazi iz same stvari, jer je učenje čitanje) + **Instrument Sans**.

**Gradijentni naslov je zamijenjen MARKEROM** — naglašena riječ se podvlači, kao u vlastitoj
skripti. Nosi značenje (ovo je bit rečenice), za razliku od gradijenta koji je čisti ukras.

---

### 7.5 Landing — ideja koja je prošla (2026-08-12)

> **Landing ne opisuje proizvod — landing JEST proizvod.**

Jezgra Sokrata je jedna mehanika: **napišeš pojam i objašnjenje jednom, dobiješ četiri načina
učenja.** Zato hero to ne tvrdi nego **pokazuje**: posjetitelj upiše svoju rečenicu i odmah je vidi
kao karticu, kvizno pitanje, dopunu i gradivo. Bez registracije. Generirani landinzi tvrde; ovaj
dokazuje — i objašnjava proizvod strancu u tri sekunde bez ijedne marketinške rečenice.

**Ulaz je JEDAN** (Leon, 2026-08-12): *„ne znam zašto je My materials na gornjem baru — trebao bi
biti prvi, gdje je Start studying."* → **„Kreni učiti" otvara izbornik čije gradivo** (katalog ili
vlastito), a **editor stoji odmah pokraj**. Tko nema ništa svoje, vodi se ravno u editor.
To **nadilazi mehanizam iz ADR-029** (dva ravnopravna ulaza u navigaciji), ali ne i njegov cilj —
UGC ostaje glavni proizvod. **C0 nije bačen:** stranica i ruta `#/materials` koje je izgradio su
točno ono na što izbornik pokazuje; seli se samo gumb.

**Struktura: 6 sekcija → 3.** Nestaju: 4 `gradient-orb` + `grid-overlay`, gradijentni naslov,
`hero-badge` s pulsirajućom točkom, 4 plutajuće kartice, stats bar, `section-eyebrow` iznad svakog
naslova. **Tekst više ne spominje FMTU ni godine studija** — Leon, 2026-08-12: *„zbog UGC-a
platformu gradimo za sve."*

**Prototip:** `prototypes/landing-v2.html` (samostalan, ne učitava bundle, ne dira gateove).
Briše se kad postane pravi `index.html`.

**⚠️ Logo je otvoren:** `assets/logo.svg` je još indigo (`#6366f1`/`#818cf8`). Jedna fiksna boja ne
može dobro sjesti i na papir i na tamnu ploču.

> **✏️ ISPRAVAK (2026-08-12): inline `<symbol>` + `<use>` NIJE rješenje — datoteka je 45 308 bajtova.**
> Logo je vektoriziran potraceom, dakle tisuće točaka putanje. Inline bi dodao **45 KB u `index.html`**,
> a `index.html` se poslužuje **network-first** (SW) pa se taj teret plaća pri svakom posjetu — dok je
> vanjski `.svg` immutable-cachiran godinu dana. Zamijenili bismo temu za mjerljivo sporije prvo učitavanje.
>
> **Pravo rješenje: CSS maska.** `mask-image: url(assets/logo.svg)` + `background: var(--color-brand-500)`
> → datoteka ostaje vanjska i cachirana, a **boja dolazi iz teme**. Dvije stvari treba provjeriti prije
> izvedbe: ① maska koristi **alfa-kanal**, pa SVG mora biti silueta — ako ima punu pozadinsku plohu,
> maska daje pravokutnik; ② `mask` treba `-webkit-` prefiks za starije Safarije.
>
> **Ako ① padne, logo se ne krpa nego CRTA ISPOČETKA.** 45 KB traženih putanja za znak koji bi trebao
> biti par stotina bajtova je sam po sebi znak da je izvor kriv — a to je dizajnerski posao, ne CSS.
>
> ### ✅ ① JE IZMJERENO I PALO (2026-08-13)
> ```
> assets/logo.svg   1 <path> · 2 <circle> · 4812 decimalnih brojeva
> <circle r="528" fill="url(#g)">   ← NEPROZIRAN disk preko cijelog viewBoxa
> ```
> Maska čita alfa-kanal, a disk je pun → `mask-image` bi dao **puni krug u boji marke**, ne znak.
> Nema CSS-a koji to zaobilazi. **Logo time izlazi iz C2 i postaje dizajnerska odluka.**
> Do nje ostaje `<img>`: nosi vlastitu pozadinu, pa čita na sve četiri teme — indigo je
> off-brand, ali ništa ne lomi. Dvije mjerene opcije za Leona:
> **(a)** izvući samo `<path>` u `assets/logo-mark.svg` → silueta, maska radi, boja dolazi iz teme
> (datoteka ostaje vanjska i immutable-cachirana, pa 45 KB nije problem — problem je bio samo
> *inline*); **(b)** nacrtati znak ispočetka, par stotina bajtova. **(a) mijenja izgled marke**
> (disk nestaje, ostaje figura), pa nije Claudeova odluka.

---

### 7.6 ✅ SMJER IZGLEDA — Apple (Leon, 2026-08-12)

> Leon: *„Apple smjer, naravno, to se podrazumijeva."*

**Ovo nadglašava tipografski dio §7.4** (Literata + Instrument Sans). Paleta i četiri teme iz §7.4 **ostaju** — mijenja se smjer vrijednosti, ne arhitektura.

**Što Apple zapravo radi** (pet stvari, i vrijedi ih razdvojiti jer su četiri besplatne):

| | čime | cijena kod nas |
|---|---|---|
| 1 | **praznina** — jedna ideja po ekranu | traži **brisanje**, ne dodavanje; radi se po površini u svakoj cigli |
| 2 | **tipografija nosi** — 56–96px naslovi, **negativan letter-spacing**, malo veličina | vrijednosti u `tokens.css` |
| 3 | **gotovo monokromatski** — boja dolazi iz **sadržaja**, ne iz sučelja | vrijednosti u `tokens.css` |
| 4 | **materijal umjesto boje** — vlas-crte, velika zaobljenja, jedva vidljive sjene | vrijednosti u `tokens.css` |
| 5 | **pokret vezan uz skrol** | ~30 redaka + `prefers-reduced-motion` |

**⚠️ Ono što nemamo, i to je jedini pravi rizik: Appleova stranica je ~70 % fotografija proizvoda.** Praznina oko naslova radi zato što u sredini stoji predmet. Naš proizvod je **tekst**. Preslikan raspored bez predmeta ne daje Apple nego **praznu stranicu** — tako propada svaka imitacija.

**Naša zamjena za fotografiju proizvoda već postoji i bolja je od slike:** živi demo iz §7.5 (upišeš pojam → odmah ga vidiš kao karticu, kviz, dopunu i gradivo). To je naš „product shot", i s njim se može igrati.

**Zato: uzimamo Appleovu DISCIPLINU, ne Appleov KOSTIM.** Ne kopiramo mutno staklo posvuda, gradijentni hero ni veliku predmetnu fotografiju koju nemamo čime napuniti.

#### Posljedica 1 — tipografija: **serif u naslovima je NADGLAŠEN**

Grotesk svugdje. **SF Pro se ne smije koristiti na webu** (Appleova licenca ga drži na njihovim platformama), ali `-apple-system, system-ui` u stacku **na iPhoneu i Macu razriješi se u pravi San Francisco** — legalno i za **0 KB**. Na Windowsu pada na Segoe. Zamjenski grotesk **ne smije biti Inter ni Space Grotesk** (§7.1: oba su potpis generiranog sučelja).

#### Posljedica 2 — brisanje ostatka palete je BLOKADA SMJERA, ne dug

Appleova karakteristična podloga za tekstualni sadržaj je **svijetla**, a `color: rgba(255,255,255,.9)`
na papiru nije neusklađen nego **nevidljiv**. Zato čišćenje zakucanih boja u C3–C7 nije „sitni dug koji
usput otplaćujemo" nego **put do izgleda koji je Leon izabrao**.

> **✏️ ISPRAVAK (2026-08-13): ovdje je stajalo „svijetla tema je zaključana iza `check:palette` = 0"
> i „do nule zadana tema ostaje tamna". OBOJE JE BILO NETOČNO.**
> Zaključana je bila iza **zakucanog TEKSTA**, a to je bio mali dio te brojke (46 od 435). Zadana tema
> je svijetla **od C2**, a ostatak duga (plohe, stara paleta) se otplaćuje dalje kroz C3–C7 — samo više
> ne blokira smjer. Puno obrazloženje i mjerenje: **§7.4**.

#### Kako se zna da smo u smjeru (mjerljivo, ne na oko)

1. **0 serifnih porodica** u `styles.bundle.css`.
2. **Nijedan `font-size` izvan skale** — svaka veličina dolazi iz `--text-*` tokena.
3. **`check:palette` monotono pada** iz cigle u ciglu (nikad ne raste).
4. **`check:contrast` ostaje zelen** kroz sve četiri teme.
5. **Na landingu nema ukrasnog elementa koji ne nosi značenje** — svaki gradijent, sjena ili linija mora se moći obrazložiti rečenicom, inače se briše.

---

### 7.7 ⚠️ Nalaz C2 — paleta se mijenja u tokenima, ali tekst na njoj živi u 35 pravila

Prva puna suita nakon promjene palete pala je na **axe `color-contrast`**, i to je najvažnija pouka cigle:

> **Promjena marke iz TAMNE u SVIJETLU izvrće što „tekst na marki" uopće znači.**

| | |
|---|---|
| bijelo na staroj marki `#6366f1` | **4.47** — već ispod AA, ali nitko nije primijetio |
| bijelo na novoj marki `#f2c14e` | **1.68** ⛔ |
| bijelo na `--primary-dark` `#d3a233` | **2.34** ⛔ |
| `--on-primary` `#1e1f1c` na marki | **9.87** ✅ |

**35 pravila** držalo je `color: white` na ispuni marke — CTA gumbi, `.answer-btn.selected`,
`.check-btn`, `.start-quiz-btn`, `.ex-btn-primary`, zaglavlja tablica u learnu. Dakle **glavni gumbi u
svakom modu učenja**.

**Zašto to nijedan postojeći gate nije uhvatio:**
- **`check:contrast` ne može.** On dokazuje da je **paleta** ispravna (`--on-brand` na marki = 9.87), ali
  ne zna koristi li je CSS. Ispravna paleta i pogrešna upotreba izgledaju mu jednako.
- **axe je uhvatio 2 od 35.** Vidi samo ono što je na ekranu u trenutku mjerenja; ostala 33 su bila u
  `:hover`, `.active` i `.selected`. **Gate je bio zelen nad 33 slomljena pravila.**

To je nalaz C1 br. 4 u novom ruhu: **statička analiza i preglednik hvataju različite bugove.**

**Brana:** `check:palette` je dobio **tvrdu zabranu** (ne čegrtaljku, jer nije naslijeđeni dug nego kvar
koji se rađa svaki put kad netko napiše novi gumb): nijedno pravilo ne smije imati marku kao pozadinu i
zakucanu bijelu/crnu kao tekst. Obrnuto provjerena.

**⚠️ Za C3–C7:** te cigle prepisuju upravo te površine. Uz zabranu ide i zapamćeno pravilo —
**tekst na ispuni marke uvijek `var(--on-primary)`**, nikad `white`, ma kako „očito" izgledalo na
današnjoj temi.

#### Isti obrazac, drugi token: `--primary-light` NIJE boja teksta (2026-08-13)

Prelazak na svijetlu zadanu temu iznio je **drugi primjerak iste greške**, i vrijedi ga zapisati
odvojeno jer se ne popravlja istim pravilom:

> `--primary-light` = `--color-brand-400` = **svjetlija varijanta marke, za HOVER i ISPUNE.**
> `check:contrast` mjeri `brand-500` kao tekst na sve tri plohe — **`brand-400` ne mjeri nikad.**

Zato je **26 pravila** kroz 7 datoteka (`profile` 8 · `auth` 5 · `legal` 4 · `studio` 4 · `learn` 2 ·
`my-materials` 2 · `block-editor` 1) godinama pisalo tekst bojom koju **nijedan gate ne gleda**. Na
tamnoj podlozi je prolazilo (svjetlije = čitljivije); na svijetloj `#4a82e8` na bijelom daje **~3.2**
→ pada AA. **axe je uhvatio 1 od 26.**

**Pouka je općenitija od oba slučaja:** gate koji provjerava *neke* tokene stvara tihu pretpostavku da
su provjereni **svi**. Sljedeći token koji dobije ulogu („`-strong`", „`-ink`", „`-400`") mora ili ući
u `check:contrast`, ili dobiti zabranu u `check:palette`. **Tvrda zabrana #2**, obrnuto provjerena.

**Usput pronađeno:** tri pravila nosila su komentar *„bijelo na `--primary` je 4.22 (<4.5),
`--primary-dark` = 5.8"*. Brojke su vrijedile za indigo; na kredi je `--primary-dark` s bijelom **2.34**.
Komentar je dakle **dokumentirao netočan razlog za postupak koji više ne pomaže** — obrisan (ADR-027).

---

### 7.8 ✅ C2 JE ISPUNJEN (2026-08-13, grana `feat/c2-landing`)

**Landing više ne opisuje proizvod — pokazuje ga.** Posjetitelj upiše pojam i objašnjenje i
odmah ih vidi kao karticu, kvizno pitanje, dopunu i gradivo. Bez registracije, bez videa.

**Struktura 6 → 3 sekcije.** Nestali: 4 `gradient-orb` · `grid-overlay` · gradijentni naslov ·
`hero-badge` · 4 plutajuće kartice · stats bar · 3 `section-eyebrow` · „How it works" ·
„Study modes" · završni CTA. Tekst više **ne spominje FMTU ni godine studija**.

| mjera | prije | poslije |
|---|---|---|
| `css/landing.css` | 1079 | **578** (−501; 483 redaka koda) |
| `check:palette` | 427 | **339** (−88) |
| `styles.bundle.css` | 224 KB | **210 KB** |
| Google Fonts | 2 obitelji, 11 težina, 2 `preconnect` | **0** |

**Četiri odluke koje su promijenile više od landinga:**

1. **Sistemski grotesk.** Inter i Space Grotesk su otišli (§7.1: najjači preostali potpis
   generiranog sučelja). `-apple-system` daje **pravi San Francisco** na iPhoneu i Macu,
   `Segoe UI Variable Display/Text` na Windowsu 11 — isti razrez po veličini koji Apple radi
   s SF Pro Display/Text, za **0 preuzetih bajtova i 0 FOUT-a**. Usput je nestao i CSP-dug
   iz F3 (inline `onload` na font-linku).
   ⚠️ **Token bez mosta ne radi ništa:** `--font-sans` je postojao od C1, ali ga nitko nije
   čitao — `body` je držao vlastitu listu. Promjena tokena bila bi nevidljiva bez te jedne linije.
2. **Zadana tema → svijetla** (§7.4). Otključano mjerenjem, ne čekanjem.
3. **Ulaz u vlastito gradivo seli iz trake u VRATA** (Leon: *„trebao bi biti prvi, gdje je
   Start studying"*). ADR-029 nije nadglašen — cilj je isti, mjesto drugo; `materials-entry.spec`
   sada čuva **redoslijed u dokumentu** (vrata iznad kataloga), a ne položaj u navigaciji.
4. **Brojka pitanja obrisana s landinga.** *(Brojevi u ovoj točki su mjera iz kolovoza 2026, kad ih je
   bilo 22 — v. upozorenje u §7.13 zašto broj predmeta nikad ne ide u prozu.)* Pokrivala je 17 od 22 predmeta (`compute-stats.js`
   namjerno preskače prijevode), pa je uz „22 predmeta" bila nedosljedna. Kriterij prihvaćanja
   **#5 ispunjen brisanjem**, ne pogađanjem — a `landing.spec` sad **pada ako se vrati**.

**Katalog-traka je ZADRŽANA, protivno prototipu.** §1 zabranjuje promjenu ponašanja u ovoj fazi,
a vitrina je živ put (kartica → lekcija) o kojem ovise tri test-datoteke. Restilizirana i
podređena vratima. Bez nje bi „22 predmeta" bila tvrdnja; s njom je dokaz.

**Sigurnost:** živi prikaz je jedino mjesto na landingu koje prima korisnički unos, pa je
građen **bez ijednog `innerHTML`** — `textContent` + `createElement`. To je **jače od escapea**
i ne može se pokvariti sljedećim editom koji zaboravi omotač. Brana: `landing.spec` gura
`<img src=x onerror=…>` kroz oba polja i tvrdi da element **nije nastao**.

**Čišćenje koje je izašlo iz cigle:** 30 mrtvih pravila iz `responsive/*` (elementi kojih više
nema) + **16 pravila koja selektiraju `[data-theme="dark"]`** — nijedna se tema više tako ne
zove, pa su postala nedostižna. Među obrisanima je bio i jedini `!important` koji je tukao
Tailwind-skalu (`.hero-title { font-size: 2rem !important }`) i tiho zaključavao naslov na
32px na svakom telefonu.

#### Nalaz na kraju cigle: **gate koji ne ispisuje BROJKU tjera na pogađanje**

Puna suita je javila `color-contrast` na `#btnCorrect > span` — i tu stala. Dva neovisna ručna
mjerenja dala su **4.80** i **5.16**, dakle iznad praga; axe je tvrdio suprotno. Otišlo je više
od sata na reprodukciju (isti viewport, pa `isMobile: true`, pa isti UA i `deviceScaleFactor`) —
i svaki put je ručno mjerenje govorilo „čisto".

**Rješenje nije bila bolja reprodukcija nego to da se gate NATJERA da kaže što vidi.** Čim je
`a11y.spec.js` počeo ispisivati axeove vlastite brojke, odgovor je bio u prvom retku:

```
fg #1e8155 / bg #eef1f7 = 4.29 (treba 4.5:1)
```

Token je `#10794a`. `#1e8155` je **ista boja na ~93 % neprozirnosti** — axe je uzorkovao
**usred fade-ina sekcije**. Gate je dakle prijavljivao pad koji na gotovoj stranici ne postoji,
i to **mjesecima je mogao raditi obrnuto** (propustiti pravi pad koji se u tom trenutku još nije
dovršio).

**Dvije trajne promjene:**
1. **`a11y.spec.js` ispisuje `fg / bg = omjer (treba …)`** za svaki `color-contrast` nalaz.
   Selektor kaže GDJE, brojka kaže ZAŠTO — bez druge se prva ne da iskoristiti.
2. **Prije mjerenja se animacije guraju u krajnje stanje** (`document.getAnimations().forEach(a => a.finish())`).
   Determinističko, ne duže čekanje: `waitForTimeout` bi istu utrku samo učinio rjeđom.

**Usput popravljeno:** „Znam" i „Savjet" stajali su na **tinti** (`rgba(34,197,94,.1)`), a
`check:contrast` mjeri samo plohe koje poznaje (`surface-0/1/2`) — tinta je bila **četvrta,
izmišljena ploha koju nitko ne mjeri**. Sada su prozirni, pa značenje nose obrub i boja teksta
(usput bliže Appleovoj disciplini: vlas-crta umjesto ispune).

---

### 7.9 ⚠️ POPRAVAK C2 — prebacivanje teme slomilo je površine koje zakucavaju TAMNU plohu (2026-08-14)

**Nalaz.** C2 je zadanu temu prebacio iz tamne u svijetlu i **provjerio pet površina na ekranu**
— landing, browse, lekcije, study, learn. To su točno one koje vidi **odjavljen** posjetitelj.
Prijavljene površine nitko nije pogledao, a ondje je prebacivanje bilo skupo:

| gdje | ploha | tekst | omjer |
|---|---|---|---|
| `studio` `.st-icard`, `.st-metas .st-m` | `#5f6775` | `--text-muted` | **1.00** |
| `studio` `.st-kv` / `.st-fcard` / `.st-qz` / `.st-edit-item` | `#2f3a4a` | `--text-secondary` | **1.18** |
| `sokrat-confirm` `.sokrat-confirm__card` | `#0f172a` | `--text-primary` | **1.02** |
| `auth` `.auth-modal__card` | `#0f172a` | `--text-secondary` | **1.83** |
| `pages` `.study-loading` | `#28323f` | `--text-secondary` | **1.33** |
| `studio` `.st-topbar` | `#5b6371` | `--text-primary` | 2.89 |
| `studio` `.st-tree`, `.st-crumb`, `.st-row:hover` | — | — | 2.07–3.98 |
| `my-materials` `.mm-tree` | `#a6aab3` | `--text-secondary` | 4.19 |

**1.00 znači doslovno istu boju.** Za usporedbu: bijelo na kredi = 1.68, i to je pokrenulo
tvrdu zabranu #1. Pogođeni su **prijava, dijalozi potvrde, učitavanje gradiva i cijeli editor** —
dakle svaki prijavljeni korisnik, ne rub.

**Zašto to nijedan gate nije vidio — tri neovisna razloga, i svaki je sam po sebi bio razuman:**
1. **`check:palette`** je tamne `rgba()` svrstavao u *„blago — plohe i rubovi, blijedi ali
   ispravni"*. Za `rgba(255,255,255,.06)` na svijetloj temi to je **točno** (problijedi,
   bezopasno). Za `rgba(30,41,59,.92)` vrijedi **obrnuto**. → **Jedna kanta je držala dva
   suprotna kvara, a jedan je fatalan.** Isti oblik greške kao „46 od 435" u §7.4, samo obrnut:
   ondje je agregat **precjenjivao** prepreku, ovdje ju je **sakrio**.
2. **`check:contrast`** dokazuje da je paleta ispravna — a ovo nisu tokeni. Izvan dosega po
   konstrukciji, i to je u redu; problem je što je postojanje tog gatea stvaralo dojam pokrivenosti.
3. **axe** posjećuje `#materials-page`, ali **odjavljen** (stablo se nikad ne iscrta), a do
   `#editor-page` **ne dolazi nikad** — svi studio-testovi su `.authed.spec.js`, koji ne vrte axe.
   → **Prijavljene površine nemaju nijedan vizualni gate.**

**⚠️ Šira pouka (vrijedi za C3–C7):** dok je tema bila JEDNA, `rgba(30,41,59,.92)` je bio
**točan** — nijedan alat i nijedno oko nisu ga mogli razlikovati od ispravnog. Postao je kriv u
trenutku kad je tema postala varijabla. **Prebacivanje teme nije promjena vrijednosti nego
promjena UGOVORA**, i cijenu plaćaju sve površine koje su ugovor dotad smjele ignorirati.

#### Što je izvedeno

- **`studio.css` 81 → 1**, **`block-editor.css` 100 → 0**, **`my-materials.css` 12 → 0**
  (ostatak stare palete po `check:palette`). Ukupno **339 → 126**, osnovica spuštena.
- **`--st-violet` UMIROVLJEN, i to ne zbog teme.** `--on-primary` na `#8b5cf6` daje
  4.23 / 3.91 / 4.21 → **pada AA u svih pet tema**, dakle *primary* gumbi Studija nikad nisu
  prolazili, od U8. `check:contrast` mjeri `on-brand` isključivo na `brand-500`, pa drugi kraj
  gradijenta nitko nije gledao. Ispune su sada **solidne** — jedini par koji gate stvarno mjeri.
- **`--bg-card` je dobio definiciju u mostu.** Postojao je samo u `css/legal.css`, koji
  aplikacija **ne učitava** → u aplikaciji je uvijek gorio fallback `#0f172a`. To je izvor i
  kartice prijave (1.83) i dijaloga potvrde (1.02); jedna definicija gasi oba.
- **Hover više ne mijenja boju ondje gdje bi smjer ovisio o temi** (`.check-btn`,
  `.sokrat-confirm__ok.is-danger`): na svijetlim temama tekst je bijel pa hover mora potamniti,
  na tamnima je taman pa mora posvijetliti. **Jedna fiksna boja ne može oboje — elevacija može.**
  Izmjereno: `--on-primary` na `--danger` prolazi u sve četiri teme (5.30–5.77), a zakucano
  bijelo, koje je ondje stajalo, palo bi na `chalk` (3.12) i `mint` (3.09).
- **`@media (prefers-contrast: high)` je radio suprotno od imena.** Zakucavao je
  `--border: #000` i `--text-secondary: #374151` → na tamnim temama režim za VEĆI kontrast
  kontrast **smanjuje**. Sada tokeni. Usput obrisan `@media (prefers-color-scheme: dark)` koji je
  gazio `--shadow` po **OS-ovom** signalu, iako temu od C2 bira korisnik.

#### Nove brane (obje obrnuto provjerene)

- **TVRDA ZABRANA #3 — zakucana tamna ploha.** Dva kraka: (A) pravilo s tamnom pozadinom koje ne
  zakucava i svoj tekst; (B) modulska varijabla s fiksnom tamnom bojom (`--st-glass`). Iznimke su
  **izričite i s razlogom** (zastori, matiranje medija, platno slijepe karte, pločice ikona) — ne
  „popis da gate prođe". Obrnuta provjera: oba kraka pala, a kontrola (`#e0e7ff` kao zakucan
  svijetao tekst) **nije** — što je i bila poanta, v. ispod.
- **Zakrpana rupa u zabrani #1.** Regex je tražio `var(--primary)` sa **zatvorenom zagradom
  odmah iza imena**, pa `var(--primary, #6366f1)` — isti token s fallbackom — nije bio pogodak.
  `sokrat-confirm.css` je tako držao `color:#fff` na ispuni marke, a gate je javljao čisto.
  Nakon zakrpe odmah su ispala **još dva** skrivena pravila u `profile.css`.

#### ⚠️ Dvije greške u vlastitom mjerenju, obje uhvaćene istog dana

1. **Prvi popis „živih kvarova" imao je dva lažna.** `.nav-btn.active` i `.back-to-subjects-btn`
   zakucavaju **i plohu i tekst** (`#312e81` + `#e0e7ff`) → samodosljedni su i čitljivi. Moja
   provjera „ima li zakucan svijetao tekst" bila je **regex** (`#fff|white|#fXX…`) i `#e0e7ff`
   nije prepoznala. Sada se luminancija **računa**, kao i za plohu — **ista mjera s obje strane,
   nula uzoraka za pamćenje.** Prijavio sam te dvije brojke prije nego što sam ih provjerio.
2. **Obrnuta provjera je dvaput „prošla" iz krivog razloga.** Testna datoteka s `#6366f1` i
   `color:#fff` obarala je **čegrtaljku** (nova datoteka bez osnovice), pa je gate izlazio s 1
   prije nego što je zabrana #1 uopće došla na red. **Izlazni kod 1 nije dokaz da je pao gate koji
   testiraš.** Ispravno: provjera unutar datoteke koja **ima rezervu** u osnovici, i čitanje
   PORUKE, ne samo koda.


---

### 7.10 🧱 C3 · prva cigla — gate PRIJE migracije (2026-08-14, grana `feat/c3-vlastito-gradivo`)

**Redoslijed je odluka, ne slučajnost.** C3 prepisuje `my-materials.css`, `studio.css` i
`block-editor.css` — točno one tri površine za koje je §7.9 dokazao da ih **nijedan vizualni gate
ne posjećuje**. Migrirati ih prije nego gate postoji značilo bi ponoviti C2: promjena bi prošla
zeleno, a kvar bi se vidio tek na Leonovu ekranu. **Zato prva cigla C3-a nije CSS nego brana.**

**Izvedeno:**
- **`tests/a11y.authed.spec.js`** — axe na 7 prijavljenih stanja: Moji materijali sa **stablom**
  (dosad se skeniralo samo odjavljeno stanje, gdje stabla nema) · Studio/stablo · Studio/lekcija ·
  draft-mod · block-editor · izbornik za umetanje · **dijalog potvrde**. Svako stanje kroz
  **svih 5 tema** (zadana + `academic`/`paper`/`chalk`/`mint`) = **35 mjerenja**.
- **`tests/helpers/axe-gate.js`** — gate-logika izvučena iz `a11y.spec.js` u zajednički modul.
  Druga kopija bi se razišla, a „ista provjera na dva mjesta, samo jedno održavano" je upravo
  obrazac koji je pustio §7.9 (ADR-027).
- **Ništa se ne objavljuje** — draft se odbacuje kroz `#stDiscard`, što usput i **jest** put do
  dijaloga potvrde. STAGING-only, kao ostatak authed-suite.

**⚠️ Gate je pao na prvom pokretanju i našao TRI kvara na produkciji, nijedan dosad vidljiv:**

| kvar | težina | gdje |
|---|---|---|
| `aria-required-children` — `role="tree"` bez ijednog `treeitem` | **critical** | `.mm-tree` |
| `listitem` — `<li>` bez liste-roditelja (6 čvorova) | serious | `.mm-row` |
| `label-title-only` — `<input type="color">` samo s `title` (5 čvorova) | serious | `.st-cdot--custom` |

**Prva dva su JEDAN korijenski uzrok, i on je poučan: `role="tree"` na `<ul>` GASI implicitnu
ulogu liste.** `<li>`-jevi su time ostali bez ikakve uloge — stablo bez stavki, stavke bez stabla.
Za čitač ekrana to znači da je **cijela korisnikova polica najavljena kao prazna**. Pola ARIA-e
je bilo **gore od nikakve**: native semantika je uklonjena, a zamjena nije stavljena. Popravak:
`role="treeitem"` + `aria-level` (DOM je plosnat, dubina je vizualna) + `aria-expanded` na retku.
Treći je propust dosljednosti — susjedni gumbi u istom widgetu `aria-label` imaju od početka.

**🔁 Obrnuta provjera (obavezna, i ovdje je bila nužna):** privremeno vraćena zakucana ploha
`rgba(30,41,59,.92)` na `.st-icard` → gate **pada i imenuje pravilo s mjerom**
(`fg #5b6879 / bg #2f394a = 2.05, treba 4.5`). Dakle brana hvata **baš onaj razred kvara zbog
kojeg je nastala**, ne samo ono što je slučajno našla.

**Pouka koja nadživljava ovu ciglu:** tri kvara nisu nastala jučer — `role="tree"` stoji od F2.
Nisu bili nevidljivi zato što su suptilni, nego zato što **na toj plohi nije stajao nijedan
mjerač**. Prije nego neku površinu proglasiš zdravom, provjeri **posjećuje li je išta**.

#### 🎨 Četvrti nalaz — i on je opravdao prolaz kroz TEME

Prvi prolaz je bio na jednoj temi i bio je zelen. Kad je gate proširen na svih 5, ispao je još
jedan kvar — **samo na temi `paper`, i to na svim Studio-plohama odjednom**: aktivni redak u
stablu, `fg #2c5fd6 / bg #d5dae5 = 4.03` (treba 4.5).

Pravilo je glasilo `background: color-mix(… var(--primary) 14% …)` uz `color: var(--primary)` —
dakle **tekst u boji marke na plohi tintanoj istom markom**. To je kvar **po konstrukciji, ne po
vrijednosti**: što je tinta jača, ploha je bliža tekstu, pa razlika nestaje. Na četiri teme je
podloga bila dovoljno svijetla da par prođe; na `paper` nije.

**Zašto ga nijedna postojeća brana nije mogla vidjeti:** ništa nije zakucano (zabrane #1–#3 gledaju
zakucane vrijednosti) · `check:contrast` mjeri **tokene međusobno**, a ovo je par „token na tinti
istog tokena", koji u njegovoj tablici ne postoji · axe bi ga vidio, ali dosad **na tu plohu nije
dolazio**. Trebala su se poklopiti sva tri.

**Popravak ukida razred, ne pomiče prag:** tekst ide na `var(--text-primary)`, a marku nose **rub,
tinta i debljina slova**. Snižavanje postotka bi samo odgodilo isti kvar na sljedeću temu. Usput
stanje „odabrano" prestaje ovisiti **samo o boji** — što je i inače ispravnije.

> **Ovo je izravna potvrda skice iz BACKLOG-a** („prođe kroz sve četiri teme"). Prvi prolaz na
> jednoj temi bio je zelen i djelovao je kao gotov posao. **Gate koji mjeri jednu temu tvrdi nešto
> o jednoj temi** — a mi ih imamo pet.

---

### 7.11 🧱 C3 · druga cigla — širina je druga os iste rupe (2026-08-14)

**Prije nego što se prepiše ijedan redak CSS-a, izmjereno je koliko duga u tri C3 datoteke uopće
ima.** Odgovor je iznenadio: **gotovo nikakav.**

| datoteka | redaka | `!important` | zakucane boje |
|---|---|---|---|
| `my-materials.css` | 361 | 0 | 0 hex · 1 rgba |
| `block-editor.css` | 344 | 0 | **0 · 0** |
| `studio.css` | 423 | 2 pravila (5 deklaracija) | 11 hex — **od toga 10 u komentarima**; jedina prava je `conic-gradient` na birač boje, gdje su boje SADRŽAJ |

Tehnički dug C3-a je, dakle, **pet `!important` i ništa drugo**. C1 (tokeni), popravak C2 (126
pogodaka palete) i prva cigla C3 (a11y) pojeli su ga unaprijed.

**Iz toga je ispala razlika između tablice cigli i onoga što je faza stvarno uspostavila.** Tablica
§3 kaže da u C3 „nestaju" tri datoteke. Ali mjerenje bundlea kaže da su C1 i C2 uspostavili drukčiji
obrazac: **bundle sadrži ukupno 22 Tailwind utilityja** (`mt-*`, `text-*`, `font-*`, `tracking-*` i
dvije semantičke boje), a `landing.css` nakon C2 **i dalje postoji, na 578 redaka** *(mjereno
2026-08-14; nakon cigle A iz §7.14 je 380 — obrazac stoji, brojka se mijenja)*. Migracija u
ovoj fazi nije bila „markup u utility-juhu" nego **brisanje mrtvog + spajanje na `@theme` tokene**.
Nema razloga da C3 izmisli treći obrazac; „nestaje" u tablici valja čitati kao **„prestaje biti
izvor istine za boje i razmake"**, kako je i ispalo za `landing.css`.

#### Prava rupa nije bila boja nego ŠIRINA

Kriterij prihvaćanja #1 glasi: *„…proći cijeli tok na telefonu od **320 px** … → profil → **editor**
— bez horizontalnog scrolla i bez elementa koji strši."* Provjereno što to mjeri:

- `320` se u cijeloj suiti pojavljuje na **jednom** mjestu — `layout-guard.spec.js`, koji gleda
  isključivo CTA u landing-navigaciji;
- `responsive.spec.js` posjećuje `/` i `study`, a **materijale i editor nikad**;
- najmanji iPhone profil je **375 px**.

**Kriterij po kojem se C3 proglašava gotovim nije imao mjerač** — isti oblik kao §7.10, samo na
drugoj osi: ondje boja, ovdje širina. Zato druga cigla, kao i prva, počinje branom:
**`tests/layout.authed.spec.js`** — materijali i Studio kroz **21 širinu** (svaki prag koji dira te
površine s ±1: 374 · 640 · 680 · 767/768 · 1020 · 1024, plus kriterijskih **320**).

#### Detektor je bio kriv dvaput, i drugi put gore

1. **Šum.** Prva izvedba preskakala je element ako je ON `position:fixed`, ali ne i njegovu djecu →
   izvlačna bočna traka prijavila je 6 elemenata na svakoj od 21 širine, na obje površine. **Sve je
   bio šum.** Brana koja viče na svakom pokretanju biva oslabljena ili ignorirana.
2. **Tišina — opasnija.** Popravak je izuzimao sve unutar pretka kojemu je `overflow-x` bio
   `auto`/`scroll`, uz obrazloženje „sadržaj u skrolabilnom spremniku smije biti širi". **Premisa je
   bila kriva:** `.st-canvas`, `.st-tree` i `.st-inspector` imaju `overflow-y:auto`, a po CSS
   specifikaciji **čim je jedna os različita od `visible`, druga se računa kao `auto`** — pa je
   filtar izuzeo cijelu unutrašnjost sva tri panela Studija. Obrnuta provjera je to dokazala:
   `min-width:1200px` na `.st-head h1` **nije oborio gate**. Zeleno je bilo zeleno **jer nije gledalo**.

> **Pouka koja se ponavlja u trećoj cigli zaredom:** obrnuta provjera nije formalnost nego jedini
> način da se razlikuje „nema kvara" od „ne gledam". Ovdje je uhvatila razliku između te dvije
> stvari u mojoj VLASTITOJ brani, sat vremena nakon što sam istu pouku zapisao u §7.10.

Konačni detektor **mjeri umjesto da izuzima**: (a) dokument ne skrola vodoravno · (b) nijedan element
ne strši izvan viewporta (osim podstabla u `position:fixed` — vlastiti koordinatni sustav) · (c)
nijedan skrolabilan spremnik nema vodoravni prelijev. Namjerno skrolabilne plohe idu u
`SMIJE_SKROLATI` **izričito i s razlogom**.

#### Nalaz: kvar je bio u RENDERERU, ne u editoru

Gate je pao s mjerom: **platno Studija skrola vodoravno na 320–414 px i na 681 px, `469 > 320`.**
Sonda je našla uzrok: **`div.lb-legacy > table`** — tablice iz **v1 `legacy-html`** sadržaja. `renderTable`
(v2) svoje tablice **već** omata u `.lb-table-wrap { overflow-x:auto }`; sirovi v1 HTML prolazi kroz
DOMPurify i njegove tablice ostaju gole, a tablica se ne stišće ispod min-content širine (414 px).

**To nije kvar editora nego renderera — dakle i studentov `learn` na svakoj staroj lekciji s
tablicom, na svakom telefonu.** Popravak je u `js/blocks-renderer.js`: `wrapLegacyTables()` omata
svaku tablicu u isti `.lb-table-wrap`.

> **Odbačena alternativa i zašto:** `.lb-legacy table { display:block; overflow-x:auto }` je jedan
> redak i radi — ali `display:block` **uklanja semantiku tablice** za čitače ekrana. Zamijenili
> bismo kvar rasporeda kvarom pristupačnosti, a taj se **ne vidi na ekranu**. Isti razlog zbog kojeg
> je §7.10 ukinuo razred umjesto da pomakne prag.

**Sporedni nalaz iz istog popravka:** `RETURN_DOM` traži DOM, a unit-okruženje ga nema — prva
izvedba je **bacala iznimku**, tj. cijeli blok se ne bi renderirao. Blok koji pukne gori je od
neomotane tablice, pa kod sada provjeri vraćenu vrijednost i tiho se vrati na dosadašnje ponašanje.
Uhvatila su ga dva postojeća unit-testa; **da ih nije bilo, pukao bi u pregledniku.**

#### Ostaje otvoreno

**Skrolabilna ploha mora biti dostupna tipkovnicom** (WCAG 2.1.1; axe `scrollable-region-focusable`).
`.lb-table-wrap` — i onaj iz v2, koji postoji od U7 — **nema `tabindex`**. Gate to nije uhvatio jer
axe u našem a11y specu mjeri na **1280 px**, gdje tablica stane i ploha ne skrola. To je **treći
primjerak istog obrasca u tri cigle** i zapisan je u `BACKLOG.md`, ne popravljen usput.

### 7.12 🧱 C3 · treća cigla — pet `!important` bila su dva puta isti kvar (2026-08-14)

Mjerenje iz §7.11 reklo je da je **cijeli** tehnički dug C3-a pet `!important` deklaracija na dva
mjesta u `studio.css`. Očekivano je bilo pet neovisnih ostataka. Nisu — **oba mjesta su isti oblik:
`:hover` pravilo koje ne izuzima svoju vlastitu iznimku, pa se iznimka morala braniti `!important`-om.**

| mjesto | tko koga tuče | posljedica bez `!important` |
|---|---|---|
| `.st-btn:disabled` (1id+2r) | `.st-btn.primary:hover` (1id+3r) | onemogućen gumb se **podiže** pod mišem |
| `.st-editing` (1id+1r) | `.st-metas .st-m` (1id+2r), a `.st-m:hover` (1id+3r) i **kasnije u datoteci** | oznaka „uređuješ (draft)" **gubi boju upozorenja** pod mišem |

Nijedan nije bio hipotetski: „Spoji svoj AI" (`studio.js`) stoji `disabled` dok MCP ne postoji.

**Rješenje nije izmišljeno nego posuđeno iz susjedne datoteke.** `block-editor.css` isti problem
rješava s `.be-btn:hover:not([disabled])` i ima **0 `!important`** — dakle `studio.css` je bio
iznimka u vlastitoj kući, a ne obrnuto. Iznimka se sad izuzima **na hover-pravilu**, pa ishod ne
ovisi o redoslijedu u datoteci.

#### Zašto je ovdje trebala NOVA brana

**`css:diff` ovu promjenu ne može vidjeti** — on uspoređuje izračunate stilove u **mirnom** stanju,
a cijela promjena živi u `:hover` i `:disabled`. Njegovih „0 razlika kroz 3210 usporedbi" dokazuje
da se mirni izgled nije pomaknuo, i **ništa više od toga**. Zato `tests/cascade.authed.spec.js`:
mjeri isti element prije i poslije prelaska miša.

**Svaka tvrdnja ima obrnutu provjeru, jer „nije se pomaknuo" i „hover se nije registrirao" daju
identičan rezultat.** Kontrola za onemogućen gumb je **taj isti gumb bez atributa `disabled`** —
jedna promijenjena varijabla, pa razliku ne može objasniti ni položaj ni veličina ni stanje.

#### Tri greške u vlastitom mjerenju, sve tri iste vrste

1. **Mjerač je čitao nasred prijelaza.** Mirno stanje se očitavalo 60 ms nakon dodavanja razreda, a
   `.st-m` ima `transition:.15s` → izmjeren je međukorak (`rgb(102,95,79)`) umjesto odredišta
   (`rgb(122,77,0)`), i to je izgledalo kao kvar kaskade. **Mjerač koji ne čeka animaciju mjeri
   animaciju, ne stil.**
2. **Kontrola koja se ne izvrši nije kontrola.** Prvi izbor kontrole bio je `#stPublish` — on je
   `hidden` u pregledu, pa se nije dao prijeći mišem i test je pao na infrastrukturi, ne na tvrdnji.
3. **Brojanje uzorka umjesto posljedice, po treći put.** Nakon popravka `grep -c "!important"` i
   dalje vraća **2** — oba pogotka su **u komentarima koji objašnjavaju zašto `!important` više
   nema**. Isto kao „11 hex, od toga 10 u komentarima" (§7.11) i kao čegrtaljka iz §7.8.

> **Najkorisniji trenutak cigle bio je pad drift-gatea.** Obrnuta provjera zahtijeva privremeno
> vraćanje kvara i **ponovnu izgradnju bundlea**; nakon vraćanja popravka bundle je ostao na
> pokvarenoj verziji. `build:css --check` je to uhvatio u preflightu. Bez njega bi commit sadržavao
> **točno onaj kvar koji je cigla maloprije dokazivala** — a `css:diff` bi i dalje bio zelen, jer
> kvar živi u hoveru. **Obrnuta provjera je radnja koja privremeno kvari repozitorij; gate koji
> mjeri artefakt, a ne izvor, jedini je koji primijeti da čišćenje nije dovršeno.**

### 7.13 ⚠️ LANDING — DRUGA REVIZIJA (Leon na ekranu, 2026-08-14)

**C2 je isporučen i Leon ga je odbio kad ga je vidio:** *„landing mi se uopće ne sviđa… samo uđeš na
landing i vidiš tutorial kako se rade materijali je bez veze."* To nije hir nego **treći put da odluka
o izgledu padne na živom ekranu** nakon što je prošla sve gateove (§7.3 dvije tamne palete, §7.9
prijavljene površine). Zapisuje se kao odluka, ne kao dojam.

**Dijagnoza:** hero je tražio od posjetitelja da **radi** — upiši pojam, upiši objašnjenje — prije
nego što mu je dan razlog da mu je stalo. To je najskuplja moguća prva interakcija. Pritom je pravi
adut (**cijeli katalog gotovog gradiva**) bio nevidljiv na ulazu.

> ⚠️ **BROJ PREDMETA SE NIKAD NE PIŠE RUKOM — ni u ovom specu, ni u markupu** (2026-08-15). Ovaj
> odjeljak je nastao dok ih je bilo **22**; istog dana kad su Sašine dvije HR grane mergeane postalo
> ih je **24**, i svaka rečenica koja je broj nosila u sebi odmah je bila neistinita. Isti razred
> greške već je bio **na produkciji**: landing je pisao „17 predmeta" jer je brojao samo primarni
> program (CHANGELOG 2026-08-09). Broj dolazi iz `allReachableSubjects()`, tekst iz
> `data-meta="subjectCount"`. **Kriterij prihvaćanja: dodaj predmet u `catalog.js` i landing se
> promijeni sam, bez ijedne izmjene u HTML-u ili CSS-u.**

**Novi oblik** (maketa građena i presuđena okom prije ijednog retka u repou):

| dio | što nosi |
|---|---|
| ① hero | naslov koji pokriva OBA izvora + **dvoja ravnopravna vrata** + prava kartica kao objekt |
| ② katalog | **svi predmeti** (broj iz kataloga) u **vlastitim bojama i ikonama** iz `catalog.js`, tražilica, filtar po programu |
| ③ svoje gradivo | punopravna sekcija: tri koraka + polica s gradivom koje **nije s fakulteta** |
| ④ tvoj AI (MCP) | razgovor koji čita napredak i upisuje materijal |
| ⑤ četiri načina | stvarna lekcija iz kataloga, **bez ijednog upisa** |

**Ključni pomak je u NASLOVU, ostalo slijedi iz njega.** „Nađi svoj predmet" je obećanje kataloga —
tko nema predmet u katalogu, odmah je izvan. Novo: **„Bilo koje gradivo. Četiri načina učenja."**
Odakle gradivo dolazi je **detalj nabave, a ne proizvod**; proizvod je pretvorba. Time UGC prestaje
biti dodatak i postaje pola obećanja — što je Leon i tražio (*„ugc je skriven još uvijek… kada ju
otvori bilo tko da vidi da može radit svoj sadržaj tu"*).

**➕ POSLJEDNJA pločica** (ranije zapisana kao „23.", dok ih je bilo 22 — v. upozorenje gore).
Na kraju mreže predmeta stoji isprekidano „**＋ Tvoj predmet**". Puna mreža izgleda **zatvoreno**,
kao popis; ta jedna pločica jedina kaže da platforma nije popis — **bez ijedne riječi marketinga**.
Jeftin element, nesrazmjeran učinak. Renderira se **iza posljednjeg predmeta iz kataloga**, nikad
na fiksnoj poziciji.

**Posljedica za ADR-029:** napetost koju je §7.11 ostavio otvorenom je presuđena — **UGC je
ravnopravan od prvog ekrana, katalog je dokaz da ima sadržaja.** Zapisati kao dopunu ADR-a prije
nego kod krene.

**❌ ISPRAVAK (2026-08-15, izmjereno pri izvedbi): BACKLOG-stavka se NE zatvara.** Ovaj odjeljak je
tvrdio da živi prikaz u herou nosi **240 KB editorskog koda** i da nestankom demoa nestaje i teret.
**Netočno.** Demo je bio čisti `textContent`/`createElement` i nije dodirivao nijednu editorsku
datoteku. Tih **234,2 KB** (`block-editor` · `studio` · `admin` · `admin-editors` ·
`block-editor-media` · `draft-store`) učitavaju **obični `<script src>` na dnu `index.html`**,
bezuvjetno, za svakog posjetitelja — s demoom ili bez njega. Ukupno landing šalje **654 KB u 39
datoteka**, uz vlastiti nikad izgrađen budžet „JS ≤ 200 KB".

> **Pouka koja je važnija od brojke:** pretpostavljena veza između dvije stvari u istoj rečenici
> („demo je razlog zašto…") preživjela je reviziju jer je zvučala uzročno. Provjerila ju je tek
> **jedna naredba** pri izvedbi. Brisanje demoa je i dalje ispravno — ali iz svog razloga, ne zbog
> težine. **Dug ostaje otvoren i traži vlastitu ciglu** (odgoda editorskih skripti do prijave ili
> do ulaska u editor).

#### Boja i ikone već postoje — landing ih nikad nije pokazao

Revizija je pretpostavila da treba **izmisliti** vizualni jezik za predmete. Netočno: **svih 22
predmeta u `data/catalog.js` već ima `color` i `icon`**, a ikone su **Font Awesome imena**
(`fa-plane`, `fa-chart-line`) — dakle monokromne, ne emoji. Isto vrijedi za **svaku sekciju** u
lekciji. ⚠️ **Emoji koje se vide u Studiju su u RUČNO PISANIM naslovima `learn` sadržaja**
(`<h3>📖 Definition</h3>`) — čišćenje sadržaja, ne promjena sustava. Prva procjena („odluka o
emojima blokira CSS-posao") bila je kriva i ispravljena je isti dan.

⚠️ **Vrijednosti su STARA paleta:** `#6366f1` je indigo prije C1, a `#8b5cf6` je točno onaj ljubičasti
koji je umirovljen jer pada AA u svih pet tema. **Struktura je ispravna, vrijednosti treba preugoditi**
— i `check:palette` ih broji.

#### Pravilo za boju koje pomiruje „Apple" i „hoću boje"

Apple koristi puno boje, ali kao **oznaku identiteta**, nikad kao podlogu ispod teksta:

- boja živi u **zasićenoj pločici** i u tankoj traci uz karticu;
- **ploha ostaje neutralna**, pa boja čita kao signal;
- **tekst nikad ne sjedi na tinti** — izvor pola kontrastnih kvarova ove faze (`.st-icard` 1.00,
  aktivni redak Studija 4.03).

#### Podloga: prvi pokušaj odbačen mjerenjem oka

Prva izvedba bila je **aurora od pet boja predmeta**. Renderirana i **odbačena**: ispala je generička
duga preko cijele stranice — točno ono što ima svaki generirani hero. **Boje predmeta pripadaju
pločicama, gdje nešto znače; u pozadini samo galame.**

Ostalo je **materijal na kojem se uči**, u tri sloja: **karirani papir** (dvije skale) · **jedan**
mekan odsjaj u boji teme · **zrno**. Zrno je sastojak koji nosi sve — bez njega je ploha plastika, s
njim je pigment na papiru. Iznad toga plove **pravi pojmovi**, pomiješani: `Forecasting` i
`Opportunity cost` iz kataloga, `Rimsko pravo` i `Njemački B1` **ni iz jednog našeg predmeta** — pa
podloga priča istu priču kao stranica.

#### 🔒 ZNAK JE NEPROMJENJIV (Leon, izričito)

Znak je tri puta prijavljen kao premalen. Dijagnoza je bila da je `assets/logo.svg` **traceana
fotografija biste** (45 KB krivulja) — ilustracija, koja na 32 px nužno postaje mrlja. Nacrtana je
zamjenska silueta i **Leon ju je odbio**: *„ovaj logo je odvratan i sokrat logo je nezamjenjiv."*

**Odluka: znak se NE prepravlja. Dobiva PROSTOR.** Traka 54 → **64 px**, znak 32 → **42 px**,
wordmark 17 → 18,5 px, u herou 72 → **88 px**. Na 42 px se lice vidi.

⚠️ **Posljedica koja se prihvaća svjesno:** znak zadržava **vlastiti indigo kroz sve četiri teme**.
Prije je bojan u temu; sad nije. Na papiru i menti bit će jedina indigo stvar na stranici — to više
nije nedosljednost nego **konstanta marke: znak definira boju marke, ne obrnuto.** Ako to ikad
zasmeta, put je obrnut od prijašnjeg prijedloga — **teme gravitiraju prema znaku**, nikad znak prema
temama.

---

### 7.14 LANDING, CIGLA A+B — obrisan demo, i kvar koji su tri gatea gledala a nijedan vidio

**A · Živi prikaz je obrisan** (`4eeda13`) iz svih šest datoteka u kojima je živio: markup,
`initHeroDemo()`+`landingT()`, 18 `demo.*` poruka, 202 retka CSS-a, poziv u `init.js`, kuka u
`i18n.js`. Naslov sad pokriva oba izvora („Any material / Bilo koje gradivo"). Dva testa nisu
pala nego su **obrisana odlukom**; razlika je zapisana u zaglavlju `landing.spec.js`, jer test koji
padne znači kvar, a test koji nestane znači promjenu opsega. Umjesto njih stoji tvrdnja da hero
**ne traži nikakav unos** — inače bi se demo vratio neopaženo.

**B · Glif na pločici predmeta bio je nečitljiv na 10 od 24 predmeta.** Pločice nose boju iz
`data/catalog.js`, a tinta na njima dolazila je iz `--color-on-brand` — tokena izračunatog za boju
**marke**. U bočnoj traci je čak bila **zakucana bijela**. Izmjereno u zadanoj temi:

| boja | predmeta | prije (bijela) | poslije |
|---|---|---|---|
| `#f59e0b` | 5 | **2.15** | 8.43 |
| `#14b8a6` | 3 | **2.49** | 7.28 |
| `#0ea5e9` | 2 | **2.77** | 6.54 |

**Zašto ga NIJEDAN od tri gatea nije vidio — i to je važnije od brojke:**

1. **`check:palette`** klasificira pravilo po pozadini koju vidi **u CSS-u**. Ova ploha dolazi iz
   podatka kroz inline `style`, pa je gate vidio „nema pozadine" i `color: white` proglasio
   bezopasnim. **Zakucana tinta na plohi obojanoj iz podatka je slijepa točka te brane.**
2. **`check:contrast`** mjeri **tokene**, a boje predmeta nisu tokeni. Isti obrazac kao tvrda
   zabrana #2: *gate koji provjerava NEKE tokene stvara tihu pretpostavku da su provjereni SVI.*
3. **axe** ne mjeri Font Awesome glif — sadržaj dolazi iz `::before`, pa pravilo `color-contrast`
   nema tekst za mjeriti.

**Popravak je PRAVILO, ne ugađanje boja.** Ručno preugoditi 11 boja značilo bi da 25. predmet
donese kvar natrag. Tinta se bira **izračunom luminancije pločice** (`inkForTint()`), iz dva
namjerno **tema-neovisna** tokena (`--color-on-tint-dark/-light`) — neovisna jer je i ploha ispod
njih tema-neovisna; da nisu, tema bi okrenula glif a ploha ostala (tvrda zabrana #3, obrnuto).

⚠️ **Prag je prvi put bio napisan napamet i promašen za 0,013.** Sjecište dviju tinti izvodi se iz
same definicije kontrasta: `L* = √((L_dark+0.05)(L_light+0.05)) − 0.05`. Zato `check:contrast` sad
**preračuna prag iz tokena** i padne ako se raziđe s kodom — uz poruku koja kaže točnu vrijednost.

**Dvije brane, jer hvataju različito:** `check:contrast` dokazuje da je paleta ispravna;
**`tests/tint-ink.spec.js`** čita **izračunatu** boju glifa i **stvarnu** pozadinu u pregledniku,
kroz sve četiri teme i na sve tri površine (landing, bočna traka, browse). Obrnuto provjerena —
s vraćenim `color: white` pada s **2.15**, točno onom brojkom koju daje statičko mjerenje.

> ⚠️ **Obrnuta provjera mi je prvi put lažno prošla** jer sam vratio samo pola popravka: bazno
> pravilo, a ne `[data-ink="dark"]`, koje posao zapravo radi. **Obrnuta provjera mora ukloniti ono
> što djeluje, ne ono što je najlakše vratiti.**

**Otvoreno za sljedeću ciglu:** `css/subject-selector.css` nosi **22 od preostalih 126** pogodaka
`check:palette` — isti obrazac (`color: white` + gradijenti stare palete), na još jednoj površini
s pločicama predmeta.

---

### 7.15 LANDING, CIGLE C i D — katalog, vlastito gradivo, četiri načina, podloga (2026-08-16)

Grana `feat/c3-landing-cd`, iznad mergeanog `main`-a. Landing sad ima šest
dijelova: hero → dvoja vrata → **katalog** → **svoje gradivo** → **četiri načina** →
**tvoj AI (uskoro)** → činjenice → podnožje.

**⚠️ ODSTUPANJE OD §7.13, SVJESNO:** spec redom stavlja MCP kao ④ pa četiri načina kao ⑤;
ovdje su zamijenjeni. Naslov obećava „četiri načina" u prvom retku, pa objašnjenje tog
obećanja ne smije doći IZA sekcije o značajki koja ne postoji. Zamjena je jedan potez.

**MCP je označen kao „USKORO" (Leonova odluka na izravno pitanje).** Značajka ne postoji
(ADR-030 ②: pristup nije presuđen), pa sekcija govori u budućem vremenu, a oznaka stoji
IZNAD naslova gdje se čita prva. U markupu i i18n-u stoji uputa što napraviti kad MCP
proradi — *„uskoro" koje stoji mjesecima čita gore od nepostojanja sekcije.*

#### Pet nalaza — nijedan nije bio na popisu posla

**① Landing je proturječio sam sebi.** `renderLandingMeta()` je brojao SVE dohvatljive
predmete (vrata: 24), a `renderLandingSubjects()` crtao SAMO primarni program (mreža: 17).
Tko prebroji pločice, uhvati stranicu u laži.

**② Popravak brojke stvorio je NOVI kvar koji brojka ne može javiti.** Kad se pojavilo
svih 24, ravna mreža je stavila „Management" uz „Menadžment", „Tourism Economics" uz
„Ekonomika turizma" — **sedam parova**, jer je HR program klon EN-a (ADR-012). Posjetitelj
tad ne vidi 24 predmeta nego 17 i sedam ponavljanja: **točno po brojci, krivo po dojmu.**
Vidjelo se **tek na renderiranoj stranici**. Riješeno tihim naslovom programa.

**③ Boju ZNAKA nosila su četiri predmeta.** `#6366f1` je bio `color` za te2, te2-hr,
management i management-hr. Spec §7.13 kaže da znak zadržava indigo kroz sve teme kao
*konstantu marke* — a konstanta vrijedi samo ako je znak jedina stvar te boje. Uz to je
`#8b5cf6` (umirovljen, pada AA u svih 5 tema) bio na tri, a `#2563eb` na dva unutar
zabranjenog pojasa. **Devet predmeta dobilo je nove boje, izabrane računom.**

Brana (`check:contrast`, provjera c) čita indigo **iz `assets/logo.svg`** — ne prepisuje
ga. Dvije stvari koje brana NAMJERNO ne radi važnije su od onoga što radi:

- **ne mjeri od `--color-brand-500` nego od ZNAKA** — marka se PO TEMI mijenja (`academic`
  plava, `chalk` zlatna), pa bi fiksna boja predmeta bila odvojena u jednoj temi i
  sudarala se u drugoj. Znak je jedina nepomična meta.
- **ne traži MEĐUSOBNU odvojenost predmeta** — zatečena paleta ima `#059669` (161°) i
  `#14b8a6` (173°) na 12°. **Brana koju zatečeno stanje ne može proći nije brana nego
  crveni CI.**

⚠️ **Odbačeno pravilo:** rezerva do sjecišta tinte. Štitilo bi od kvara koji se ne može
dogoditi (`inkForTint` je deterministički), a tražilo bi promjenu boje bez kvara.
Izmišljeno zbog elegancije, ne zbog stvarnog načina kvara.

**④ Gate za ćirilicu nije skenirao `css/` ni korijenske `.html`.** Upisao sam ćirilično
`а` (U+0430) u CSS komentar i gate je šutio — a njegov popis nastavaka **izrijekom navodi
`.css` i `.html`**; `CODE_DIRS` te mape jednostavno nikad nije posjetio. **40 datoteka
dvaju tipova koje popis tvrdi da pokriva.**

**⑤ `--color-mark` nije bio mjeren NI U JEDNOJ temi.** Nosi isticanje u heroju — prvu
stvar koju posjetitelj pročita. Rupa je bila **priznata u kodu**: `sweep()` ima
`if (!fg) continue` uz komentar *„rgba/alpha (npr. `--color-mark`) — ne mjeri se ovako"*.
U `chalk`/`mint` marker JEST alfa pa je preskočen; u `academic`/`paper` je neproziran, ali
nije stajao ni na jednom popisu. Kvara nije bilo (7,05–12,13), ali ni pokrivenosti.
Popravak: `parseColor()` razumije `rgb(R G B / A)`, a alfa se **slaže preko plohe teme**.

> **Pouka koja se u ovoj fazi ponovila PETI put:** *gate koji pokriva NEKA mjesta stvara
> tihu pretpostavku da pokriva SVA.* (Prije: `--primary-light`, tinta na pločicama,
> `var(--primary, #fallback)`, ćirilica.) Uz nju druga, iz `parseColor`: **prazan rezultat
> koji znači „ne mogu pročitati" ne smije se čitati kao „nema što mjeriti".**

#### Cigla D — podloga i prostor za znak

Tri sloja, sve iz tokena kroz `color-mix`, pa prati temu sama: **zrno** (~3,5 %; bez njega
je ploha plastika) · **jedan** odsjaj u boji TEME · **karirani papir** u dvije skale
(64 px + 16 px). Slojevi idu na `.landing-page.active`, **ne** na `::before` sa
`z-index:-1` — taj bi pobjegao iza `body` pozadine jer `.landing-page` ne stvara kontekst
slaganja. Provjereno u pregledniku.

Znak: traka **64**, znak **42**, wordmark **18,5** — izmjereno, ne procijenjeno.

**⚠️ Cigla D se nije dala izmjeriti dok se nije obrisao tuđi `!important`.**
`responsive/06-component-improvements.css` je držao globalno
`.logo-text { font-size: 1.6rem !important }` = 25,6 px. A `.logo-text` postoji **samo na
dva mjesta u projektu**, oba u `index.html` i oba unutar `.landing-logo` — pravilo nije
služilo ničemu osim da pregazi `landing.css`, datoteku koja te elemente posjeduje. Isti
obrazac kao pet `!important` u `studio.css` (§7.12).

#### Dvije MOJE greške, obje zapisane jer se razred ponavlja

**Beskonačna rekurzija.** `renderLandingSubjects()` je zvao `applyTranslations()`, a ona na
kraju zove `renderCatalogPrograms()` i `renderLandingSubjects()` → „Maximum call stack size
exceeded" pri **svakom tipkanju u tražilicu**. Brojke su izgledale ispravno; uhvatilo se
**tek renderiranjem stranice**.

**Krivo pročitan rezultat suite.** Prijavio sam „355 prošlo / 0 palo" na temelju **repa**
izlaza. Izolirani prolaz iste datoteke daje **16 palo / 4 prošlo** — ＋ pločica je
naslijedila klasu `landing-subject-icon` i obarala tint-branu. Aritmetika je to
nagovijestila (355 + 30 skip = 385, a prikuplja se **401**), ali sam brojku prvo pokušao
**objasniti** umjesto **provjeriti**. ⚠️ **Kad se zbroj ne slaže — prvo pokreni, pa tumači.**

Popravljena je BRANA, ne pločica, i to nije izvlačenje: gate provjerava da se tinta bira
IZRAČUNOM iz boje predmeta; ＋ pločica nema boju predmeta (ploha `--color-surface-2`, glif
`--color-ink-2`, oboje TOKENI koje `check:contrast` već mjeri kroz svih 5 tema). Šira
pouka u testu: **selektor po klasi hvata i ono što nije iste vrste.**

#### Gate na kraju cigli C+D

`preflight` **EXIT 0 (13/13)** · `check:contrast` **238 provjera** (bilo 217) ·
`check:palette` 126 (na osnovici) · `tint-ink` **20/20** · `landing`+`i18n` 28/28 ·
`320 px`: `docW=320`, **0 prelijevanja**, 0 `pageerror` · mjereno kroz sve 4 teme.
`css:diff` **namjerno preskočen** — dokazuje da se izgled NIJE promijenio, a ove ga cigle
mijenjaju namjerno.

#### ⛔ Što NIJE napravljeno, i zašto

**Stalna gornja traka (N1) nije započeta.** Dira svih devet stranica, oba mobilna
zaglavlja, Studio i testove; započeta pa prekinuta pred compact bila bi gori ishod od
nezapočete. Leon je istog dana rekao *„možda nije ni vrijeme ni mjesto… moramo ići po
strukturnom pametnom planu"* — pa je zahvat dobio **vlastitu fazu i punu specifikaciju u §8**
ispod (nalaz iz `BACKLOG.md` §N je time razrađen, ne prepisan).
---

## 8 · FAZA „KOSTUR" — rute i jedna gornja traka (Leon, 2026-08-18)

> **Ubacuje se između C3 i C4.** Presedan je **C0**: i on je bio informacijska arhitektura,
> ne redizajn (*„Bez Tailwinda, bez redizajna"*), i također je išao **ispred** cigli koje
> mijenjaju izgled. Razlog je isti: C4 prepisuje `browse` i `lessons` — **baš stranice čija
> su zaglavlja duplikat.** Obrnutim redoslijedom ista se zaglavlja pišu dvaput.

### 8.1 Povod — Leon na živom ekranu

*„navigacija je iskreno dosta loša… kada se uđe u editor i izađe iz njega samo se vrti u
krug moji materijali, editor i tako u krug. Moji materijali moraju imat poseban odjeljak na
stranici… isto kao materijali koji su s FMTU-a. Korisnik treba imati svoje sučelje za
predmete koje uči."*

**Petlja je izmjerena, nije dojam.** [`studio.js:152`](../../js/studio.js#L152) — ljuska
Studija ima **točno dva** navigacijska gumba: `←` → `navigateTo(_node ? 'materials' :
'profile')`, i `⚙` → `admin`. Iz materijala se ulazi u editor. **Dva čvora, jedan brid.**

**Uzrok je širi od Studija — ne postoji nijedna globalna traka.** Devet `-page` sekcija,
nula zajedničkih traka; `browse-header`, `lessons-header` i `study-header` **svaka iznova**
slažu jezik + „Moji materijali" + auth. Zaglavlja žive **UNUTAR** sekcija, pa nestaju s
njima — to je cijeli mehanizam.

### 8.2 ⚠️ NALAZ KOJI JE ODREDIO OPSEG: devet stranica, **jedna** adresa

Mjereno 2026-08-18, [`navigation.js:161`](../../js/navigation.js#L161): jedina ruta u
aplikaciji je **`#/materials`**. Landing, browse, lekcije, učenje, profil, admin i Studio
**nemaju adresu**. Posljedice se već plaćaju: gumb „natrag" odvodi sa stranice · nijedan
predmet ni lekcija se ne dâ podijeliti · Google vidi jednu stranicu (nema ni `sitemap.xml`
ni `robots.txt`) · **dijeljenje materijala — faza odmah iza MCP-a (ADR-030) — nema na što
objesiti token.**

**Zašto je to ipak jeftino.** [`saveCurrentPosition()`](../../js/navigation.js#L4) već
serijalizira `{page, subject, lesson, section, category}` — **potpun opis rute** — samo ga
piše u `localStorage` umjesto u adresu. Komentar u `restoreLastPosition` čak spominje
*„dijeljenog linka"*. **K1 nije nova arhitektura nego preusmjeravanje postojećeg opisa iz
jednog spremnika u drugi.**

> **⚠️ OVO NIJE NOVA ZAMISAO — PROPISANA JE DVAPUT I DVAPUT ODGOĐENA.**
> [`BUGS.md`](../records/BUGS.md) **BUG-019**: *„svaka nova pod-stranica mora ili čuvati tuđi
> slot ili treba **pravi navigacijski stog**. Stog (+ browser History API da i sistemska
> back-gesta radi u SPA-u) = kandidat uz U8."* · **BUG-020**: *„Ista obitelj kao BUG-019
> (nedostatak pravog nav-modela) — **pravi navigacijski stog** = kandidat za U8."*
> **U8 je zatvoren, propis nije izveden.** To je točno obrazac koji **BUG-023** imenuje:
> *„Rečenica u dokumentu ne sprječava ništa — `if` u kodu ili test sprječavaju."* Zato **K3
> nije zadnja nego uvjet isporuke**: bez brane se petlja može vratiti neopaženo, kao što je
> i nastala.

### 8.3 Cigle

| # | cigla | gotovo kad | vizualna promjena |
|---|---|---|---|
| **K1** | **Rute.** Svih 9 stranica dobiva adresu; `saveCurrentPosition` prestaje biti jedini zapis pozicije. History API → sistemska „natrag" gesta radi. | otvoriš `#/predmet/<id>/<lekcija>` u novoj kartici i dobiješ tu lekciju; „natrag" vraća korak, ne izlazi sa stranice | **nikakva** (kao C1) |
| **K2a** | **Jedan model vracanja.** `goBack()` = povijest kad iza nas stoji nas unos, inace **`roditeljOd()`** koji zna OBJE hijerarhije (katalog i policu). Obje rucne jednodubinske povijesti se brisu; cuvar u `navigateTo` sprjecava `node:` na lekcijskoj stranici. | „natrag" iz vlastitog materijala vraca na policu, a ne u katalog; petlja polica <-> editor je mrtva | **nikakva** |
| **K2b** | **Jedna gornja traka.** `<header>` kao **brat** `-page` sekcija, izvan njih. Sadržaj: znak → landing · Predmeti → browse · Moji materijali → materials · jezik · profil/prijava. **Studio je dobiva jednako kao sve ostalo** → petlja pada bez ijedne posebne iznimke. Zaglavlja po stranici zadržavaju samo svoje (natrag, naslov, mrvice). | iz Studija se u jednom kliku dođe na landing, browse i materijale | da |
| **K3** | **Brana dohvatljivosti.** Test tvrdi da je iz **svake** stranice — uključujući `#editor-page` — dohvatljiva bar jedna druga u jednom kliku. Uz nju: ruta preživi reload. | brana pada kad se traka makne (obrnuta provjera) | ne |
| | ⚠️ **KRITERIJ POOSTREN (2026-08-18).** „Bar jedan klik drugamo" mjeri POSTOJANJE izlaza, a Leonova dva kvara imala su izlaz — vodio je na slomljenu stranicu i u petlju, pa bi **oba prosla ovu branu kako je bila napisana**. Dodaje se: izlaz mora voditi na stranicu koja ima smisla (nijedan `node:` na lekcijskoj stranici) i „natrag" nikad ne vraca onamo odakle si upravo dosao. | | |
| **K4** | **Moji materijali u kvaliteti kataloga** (N3). Danas je polica **stablo**, a katalog **vitrina s bojom i ikonom**. Ista komponenta pločice koju K2 ionako izdvaja. | vlastiti materijal izgleda jednako dobro kao FMTU gradivo | da |
| **K5** | **Editor dvojezicno** (Leon, 2026-08-18: *„platforma mora biti na hrvatskom i engleskom i trebat ce editor isto biti na eng jeziku"*). Izmjereno: **30 od 54** niza Studija nema prijevod (pada na hrvatski rezervni), `block-editor` + `block-editor-media` nose **15** zakucanih hrvatskih, `admin-editors` **38** zakucanih engleskih — editor **nije cijel ni na jednom jeziku**. Prekidac jezika je dotad dohvatljiv na **4 od 9** stranica; K2b ga donosi u Studio. | korisnik prebaci jezik i editor je CIJEO na tom jeziku | ne |

**N2 („osobna početna — predmeti koje učim") NIJE u ovoj fazi.** To je nova mogućnost, ne
kvar; ulazi tek kad K1–K4 stoje, jer se oslanja i na rute i na pločicu iz K4.

### 8.4 Tvrde granice

1. **K1 ne smije promijeniti nijedan piksel.** Ako se išta pomakne, promijenili smo dvije
   stvari odjednom i ne znamo koja je kriva (pouka C1). Dokaz: `npm run css:diff`.
2. **URL je NEPOVJERLJIV ULAZ, više nego `localStorage`.** Svaka ruta koja imenuje subjekt
   mora proći kroz [`isSubjectOpenable()`](../../js/navigation.js#L26) — to je popravak
   **BUG-023**, gdje je obnova pozicije gađala `node:` id koji još nije registriran i
   otvarala praznu study-stranicu koja puca pri svakom spremanju. Ruta iz adrese može
   imenovati **tuđi ili obrisan** čvor, dakle rub je širi nego kod localStoragea, ne uži.
3. **Nijedan `<script>` se ne dodaje na kritični put.** Landing već nosi 717 KB u 41
   skripti (mjereno 2026-08-18) uz vlastiti budžet od 200 KB.
4. **Traka poštuje `check:palette` i `check:contrast` kroz sve 4 teme** — nova površina ne
   smije podići osnovicu čegrtaljke.
5. **Znak je nepromjenjiv** (§7.13, Leon izričito): traka mu daje prostor, ne prepravlja ga.
6. **Vlastiti materijali NIKAD ne idu na landing** (Leon, 2026-08-18). Traka smije nositi
   **ulaz**; popis korisnikova gradiva ide na svoje mjesto. Ovo sužava ADR-029 na
   *istaknutost ulaza*, ne na *prikaz sadržaja*.

### 8.5 Što ide odmah iza — i zašto tim redom

| faza | zašto tu | |
|---|---|---|
| **A1 · Google-prijava** | ne dira CSS, ne čeka redizajn, ~1 cigla. Danas [`auth.js`](../../js/auth.js) ima **samo** `signInWithPassword` — nula OAuth-a, a obavezna lozinka je jedini put | [`BACKLOG.md`](../records/BACKLOG.md) §A |
| **C4 → C5a → C5b** | nastavak redizajna, sad na stranicama koje već imaju traku i adresu | §3 |
| **C6** | nosi **tri** odgode koje su tu i zapisane: pitanja pri registraciji (shema → SQL = Leonova ruka) · **CSP** · brisanje `bright-function` | §3 + BACKLOG |
| **C7** | gašenje starog CSS-a | §3 |
| **MCP → objava/dijeljenje** | ADR-030. **Dijeljenje sad ima na što objesiti token, jer rute postoje** | ROADMAP |

**Izvan faza, jer ne ovise ni o čemu i mogu se ubaciti kad god:** RLS-zagrade (13 politika;
**jedini nalaz koji poskupljuje čekanjem**) · birač tema (**24** fatalna pravila, ne 126) ·
JS-budžet landinga kao gate.
### 8.6 ✅ K1 JE ISPUNJEN — devet stranica, devet adresa (2026-08-18)

| adresa | stranica |
|---|---|
| `#/` | landing |
| `#/subjects` | browse |
| `#/subject/<predmet>` | lekcije |
| `#/subject/<predmet>/<lekcija>` | učenje |
| `#/subject/<predmet>/<lekcija>/<mod>` | učenje, točno u tom modu |
| `#/materials` | moji materijali (C0, doslovno zadržana — vanjski linkovi postoje) |

Sve živi u `js/navigation.js`, **bez nove skripte** (granica §8.4 #3: landing već nosi
717 KB u 41 skripti). `saveCurrentPosition` OSTAJE i nije duplikat: on je **pamćenje**
(„gdje sam stao", 24 h), adresa je **identitet** („što gledam"). Kad se razilaze,
**adresa pobjeđuje** — pravilo je postojalo od C0 za jednu rutu, sad vrijedi za sve.

#### Dva kvara koje je našla provjera u pregledniku, a čitanje koda ne bi

1. **`restoreLastPosition` je gazio golo sidro.** Na hladnom startu završi u
   `navigateTo('landing')`, koji je adresu prepisivao u `#/` — pa je `#subjects` nestao i
   preglednik više nije imao kamo skrolati. **Podijeljen link na sekciju landinga tiho bi
   prestao raditi.** Golo sidro je *preciznija* pozicija od `#/` i ne smije se pregaziti.
2. **`replaceState` pojede unos na kojem stojiš.** Za stranice bez rute prva verzija je
   čistila hash `replaceState`-om, uz komentar *„povijest ostaje netaknuta"* — a upravo je
   nije: pojeden je unos s kojeg se došlo, pa je „natrag" iz Studija **preskakao materijale
   i završavao na landingu**. **Komentar je tvrdio suprotno od onoga što je kod radio.**
   Ispravno je `pushState`, uz preskok kad je hash već prazan (inače duplikati u povijesti).

> **Oba su iz istog razreda kao nalaz §7.11 i §7.14: tvrdnja o ponašanju koja zvuči točno
> dok je nitko ne izvrši.** Prvi je uhvaćen dimnom probom, drugi tek testom koji je pisan
> nakon nje — dakle ni proba nije bila dovoljna, trebala je tvrdnja o ISHODU („natrag me
> vraća na materijale"), ne o mehanizmu.

#### Što NAMJERNO nema rutu

`profile`, `admin`, `editor`. Prikaz im ovisi o auth-sesiji i admin-statusu koji na hladnom
startu nisu spremni — isti razlog zbog kojeg ih `saveCurrentPosition` nikad nije spremao, i
točno razred **BUG-023**. Deep-link na `#/admin` pokazao bi prazan admin bilo kome tko zna
adresu. Za njih se hash čisti (`pushState`), pa „natrag" iz Studija vraća na materijale.

⚠️ **To NE ugrožava K2/K3:** zahtjev nije „u Studio se dolazi linkom" nego „iz Studija se
izlazi u jednom kliku". To je posao trake, ne rute.

#### Brana

**`tests/routes.spec.js`** — 6 tvrdnji, sve o **ishodu za korisnika** (što vidi, kamo ga
vodi „natrag"), ne o obliku rute, da preimenovanje segmenta ne obori suitu bez pravog kvara.
Uključuje tvrdnju da **ruta iz adrese ide kroz `isSubjectOpenable()`**: URL je
**nepovjerljiviji ulaz od `localStorage`-a**, ne manje — spremljena pozicija je bar nekad
bila valjana na ovom uređaju, a adresu je netko mogao utipkati ili poslati, pa smije
imenovati tuđi ili obrisan čvor.

**Obrnuta provjera: pada 4 od 6, i to je točan ishod.** Četiri testa tvrde NOVU MOGUĆNOST i
bez rutera moraju pasti; preostala dva čuvaju od **rizika koje uvodi sam ruter** (pregaženo
sidro, protumačena smeće-adresa), pa na starom kodu prolaze po definiciji — prije K1 nije
bilo ničega što bi sidro pregazilo. *Brana koja bi i njih oborila mjerila bi nešto drugo
nego što tvrdi.*

#### Jedan zatečeni test je promijenio tvrdnju, i to nije isto što i pad

`materials-entry.spec.js` je tvrdio `hash === ''` nakon povratka na browse — točno dok je
`#/materials` bila **jedina** ruta, pa su „nije materials" i „nema hasha" bili isto. Od K1
prazan hash značio bi **izgubljenu rutu**, pa je tvrdnja pooštrena na `#/subjects`. Namjera
(adresa opisuje ono što gledaš) nepromijenjena i jače ispunjena. **Test koji padne znači
kvar; test koji promijeni tvrdnju znači promjenu opsega** — razlika je zapisana da se ne
čita kao prikrivanje.

#### Gate

`routes.spec.js` **6/6** · `materials-entry` **6/6** · **`css:diff` 0 razlika / 3498
usporedbi kroz 3 širine** (granica §8.4 #1: K1 ne smije pomaknuti nijedan piksel) ·
`typecheck` 0 · `preflight` EXIT 0.

⚠️ **Zamka u vlastitom mjerenju, treći put ista:** prvi prolaz regresije javio je „exit 0",
a u izlazu je stajalo **1 failed** — jer je naredba išla kroz `| tail`, koji vraća SVOJ
izlazni status. Aritmetika je to odala (88 prikupljeno = 77 + 10 + **1**). **Status iza
pipe-a ne mjeri ono što misliš da mjeri;** izlaz ide u datoteku, pa se čita.

### 8.7 ✅ K2a JE ISPUNJEN — jedan model vraćanja (2026-08-18)

> **Cigla K2 je razbijena na K2a (ponašanje) + K2b (traka), i to nakon mjerenja, ne iz opreza.**
> Leon je prijavio dva kvara sa živog ekrana i **traka nijedan ne bi popravila** — ona premješta
> kontrole, a kvarovi su bili u tome **kamo gumb vodi**. Da je traka išla prva, gumbi natrag bi se
> pisali dvaput.

**Što je Leon našao** (oba zapisana kao **BUG-026** i **BUG-027**):
1. *Moji materijali* → uđeš u materijal da učiš → „natrag" → **lekcijska stranica čvora**
   (`#/subject/node%3A…`, crta „Matematika / **undefined**") → „natrag" → **„Choose your faculty"**.
2. polica → editor (ništa se ne dira) → „natrag" → polica → „natrag" → **opet editor**, u krug.

**Uzrok je jedan i širi od oba: TRI paralelna modela vraćanja.** Tvrdo ožičen roditelj u svakom
gumbu · ručna jednodubinska povijest (`profileReturnPage` / `materialsReturnPage`) · i — od K1 —
prava povijest preglednika. Aplikacija je usput dobila **DVIJE hijerarhije** (katalog
`browse → lessons → study`, vlastito gradivo `polica → study`), a tvrdo ožičeni gumbi poznavali su
samo prvu. **Čim postoji druga hijerarhija, tvrdo ožičen roditelj postaje laž.**

⚠️ **Drugi kvar je bio propušten prijenos, ne previd u novom kodu:** izuzetak koji ga sprječava
stoji **tri retka iznad**, za profil, s komentarom koji se poziva na BUG-019 i petlju profil ⇄ admin.
Materijali su dobili stranicu u C0 i naslijedili obrazac **bez** njegova izuzetka.

**Izvedeno.** `goBack()` je jedini „natrag" u aplikaciji: koristi **povijest** kad iza nas stoji naš
unos, inače **`roditeljOd()`**, koji zna obje hijerarhije. Dubina se čita iz `history.state`, ne iz
brojača — brojač bi `popstate` dekrementirao i pri koraku **naprijed**, pa bi nakon naprijed-natrag
lagao. Obje ručne jednodubinske povijesti su **obrisane**; dva zapisa o istoj stvari i bila su uzrok.
Uz to čuvar u `navigateTo`: `lessons` sa `node:` subjektom vodi na policu — ruta je od K1 **dijeljiva**,
pa čuvar ne smije stajati u gumbu.

⚠️ **PRVA VERZIJA POPRAVKA STVARALA JE PETLJU KOJU JE TREBALA UKLONITI.** Odlazak *gore* gurao je unos
u povijest, pa je sljedeći „natrag" imao kamo natrag — **u dijete iz kojeg smo upravo izašli**
(hladan dolazak na dijeljenu lekciju: study → lessons → **study**). Kretanje gore mora **zamijeniti**
unos, ne gurati ga. Našla ju je proba u pregledniku; čitanje koda nije.

⚠️ **PROBA JE PRITOM DVA PUTA MJERILA STARU DATOTEKU.** Prvo je service worker poslužio asset
(`stale-while-revalidate`), a nakon `npm run bump` — kad je token već bio nov — **keširani `index.html`
i dalje je pokazivao na stari `?v=`**. Token živi *unutar* `index.html`, pa svježa provjera traži da se
**i on** zaobiđe (`?proba=…`). *Lokalna proba može tiho mjeriti prethodnu verziju* — isti razred kao
„status iza pipe-a ne mjeri ono što misliš".

**Gate.** `tests/back-model.spec.js` **5/5** · **obrnuta provjera 3/5 pada** (izmjereno `git stash`-em
na kodu prije K2a; preostala dva ne mjere K2a — jedno čuva rizik koji je K2a **uveo**, drugo je
tekovina K1) · navigacijski specovi **17/17** (back-model + routes + materials-entry) · `preflight`
**EXIT 0**. ⚠️ U zaglavlju testa je brojka obrnute provjere **ispravljena nakon mjerenja** — prvo je
pisalo „4 od 5", napisano napamet. Isti razred greške koji cigla zatvara.

