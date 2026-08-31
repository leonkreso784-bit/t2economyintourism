# Frontend redizajn — prelazak na Tailwind

**Status:** ⏸️ PAUZIRAN · **Otvoren:** 2026-08-09 · **Odluke:** [ADR-028](../records/DECISIONS.md) (Tailwind, Next.js odbijen) · [ADR-029](../records/DECISIONS.md) (UGC je glavni proizvod)
**Opseg (Leon):** cijela platforma **i** editor · **UGC ide naprijed.**

> ### ⏸️ PAUZIRAN 2026-08-31 — vrijedi [RJESAVANJE-PROBLEMA-9MJ.md](./RJESAVANJE-PROBLEMA-9MJ.md)
> Revizija je iznijela dvanaest nalaza, a backlog uz njih osam živih 🔥 stavki. Leon:
> *„Ovako nešto se mora riješit prije nego što nastavimo dalje."* Ovaj spec **nije ispunjen** i ne
> ide u arhivu — samo ne vrijedi kao „što sada". Nastavlja se od cigle **C5b/2** kad faza MREŽA padne.
>
> ⚠️ **Nijedna odluka odavde ne prestaje vrijediti dok traje pauza** — ADR-028/029/032, granica iz
> §12.8, četiri pravila iz §10.3/§11 i sveto pravilo o engineu stoje nepromijenjeni.

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
| **C2** ✅ | **Landing** — koncept odbijen (§7.13) pa prepravljen u četiri cigle: **A** živi prikaz obrisan · **B** tinta na pločicama · **C** katalog (svih 24, tražilica, filtar, grupe, ＋ pločica) + svoje gradivo + četiri načina + MCP „uskoro" · **D** podloga i prostor za znak (§7.15). **Sve četiri na produkciji od 2026-08-24** (A+B od 2026-08-18, C+D s fazom TELEFON). | `landing.css` 1079 → 578 → **380** (A) → ~660 (C+D) → **749** (T5: tip i ritam heroja, §9.12) | posjetitelj koji prvi put dođe vidi **oboje**: da ima gotovih predmeta **i** da smije napraviti svoje; kriteriji 1, 2, 5 vrijede za tu stranicu |
| **C3** 🔄 | **Vlastito gradivo + editor** — „Moji materijali", Studio, admin-editori. **Tri cigle gotove i na produkciji** (authed a11y-gate · širina + kvar u rendereru · `studio.css` na nuli `!important`); **ostaje Studio na telefonu** — dok stoji, C3 se ne smije proglasiti gotovim (kriterij #1 imenuje editor na 320 px). | `my-materials.css`, `studio.css`, `block-editor.css` | autor napravi materijal od nule i objavi ga |
| **K** 🔄 | **„KOSTUR" — rute i jedna gornja traka** (§8). Ubačena između C3 i C4 (Leon, 2026-08-18) po presedanu C0-a: informacijska arhitektura prije kozmetike. **K1 ✅ rute** (§8.6) · **K2** jedna traka · **K3** brana dohvatljivosti · **K4** materijali u kvaliteti kataloga | tri duplicirana zaglavlja (`browse-`/`lessons-`/`study-header`) | iz **svake** stranice — uključujući `#editor-page` — vodi bar jedan klik drugamo, a svaka stranica ima adresu koja se da podijeliti |
| **C4** ✅ | **Browse + lekcije** — zapis: **§10**. **C4a ✅** (mrtva površina obrisana; `subject-selector.css` je **nestala**, ne migrirana) · **C4b ✅** (§10.3) — prva migrirana površina u fazi | `subject-selector.css` (obrisan) · skela browsea i lekcija (u utilityje) · **13 pravila druge ljestve pragova** iz `responsive/05`+`/06` (**brojke: `npm run css:debt`**) | student dođe do bilo kojeg predmeta i lekcije |
| **C5a** ✅ | **Modovi uvježbavanja** — kartice · kviz · dopune · napredak, **i kromo ekrana za učenje** (§10.3: ista površina, pa ide zajedno). Zapis: **§11**. **C5a/1 ✅ kromo** (§11.1) · **C5a/2 ✅ kartice + dopune** (§11.2) · **C5a/3 ✅ kviz** (§11.3) · **C5a/4 ✅ napredak** (§11.4). ⚠️ Mjereno: cigla nosi i **179 pravila iz `responsive/*`** (§11.0), što je red veličine više nego što je ova tablica opisivala | `flashcards-`/`quiz-`/`fill-blanks-`/`progress-section.css` · kromo → **`css/study-chrome.css`** (novo); `pages.css` je time preseljen pod **C6**. ⚠️ „Posljednja dva `!important` izvan C7" **bila su mrtva** — stvarna četiri stajala su u `responsive/04`. Iz /2: `responsive/*` **−528 redaka**, `!important` **41 → 35**, siročad **81 → 67**; iz /3: **−347 redaka**, siročad **67 → 57**, ukupni dug **7238 → 7000**; iz /4: **−160 redaka**, siročad **57 → 46**, ukupni dug **7000 → 6951**, `!important` **35 → 34** | student uvježbava u sva četiri moda; **kriterij 4** vrijedi |
| **C5b** 🔄 | **Gradivo + vježbe** — sve što ide kroz renderer ili engine. ⚠️ **Mjera je napravljena PRIJE koda: §12.** **C5b/0 ✅** (§12.7 — 11 boja gradiva bilo je nevidljivo na zadanoj temi; tokeni `--color-ink-*`, +120 provjera u brani). Slijedi **C5b/1**. Nije isti posao kao C5a — `responsive/*` je ovdje **prazan**, ali `learn.css` je sagrađen na **`#learn`** (102 od 112 pravila), pa **utility ne prolazi dok ID stoji** (izmjereno) | `learn.css`, `learn-blocks.css`, `math.css`, `exercises.css`, `blind-map.css` | student čita gradivo i rješava vježbe; KaTeX, slike i tablice nedirnuti |
| **C6** | **Profil, auth, pravne, consent** ➕ `pages.css` (iz C5a/1) ➕ **`home-section.css` i `sidebar.css`** — bile su u bundleu a **u planu ih nije bilo** (Leon 2026-08-30: *„Ubaci"*); drže **3 od 10** fatalnih pravila koja blokiraju birač tema | `profile.css`, `auth.css`, `legal.css`, `consent.css`, `pages.css`, `home-section.css`, `sidebar.css` | korisnik se prijavi, uredi profil, obriše račun **i smije prebaciti temu** — nakon C6 birač više nije blokiran |
| **C7** | **Gašenje** | `responsive/*`, `components.css`, `variables.css`, `styles.bundle.css`, mrtva tema | u repozitoriju nema starog CSS-a ni mrtvog koda teme |

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
`npm run test:responsive` (iPhone profili) · `npm run test:authed` · axe **0 gateanih prekršaja**
(od MREŽE B3b presuda je **WCAG razina A/AA ∪ težina serious/critical**, uz imenovanu osnovicu
`tests/a11y-baseline.json`) na svaku rutu koju pokriva `tests/a11y.spec.js` · Lighthouse budžeti.
⚠️ **Broj testova se ovdje NE piše** — rastao je sa svakom ciglom (zapisanih „304" bilo je krivo
već pri C4b, gdje je puna suita dala **529 prošlo / 0 palo / 108 preskočeno**), a ispisuje ga sam
Playwright. Isto vrijedi za „četiri stranice": doseg zna spec-datoteka, ne ova proza.
Uz svaku ciglu koja dira CSS ide i **`npm run css:diff`** (nije u preflightu — traži preglednik):
u C1 dokazuje 0 razlika, u C2–C7 da se promijenila **samo** ciljana površina.
⚠️ **Cigla mora predati svoje rute** (`CSS_DIFF_RUTE`) — bez toga alat mjeri samo `/`, gdje ničega
što crta JS nema (nađeno u C4b, §10.3).
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

~~**Skrolabilna ploha mora biti dostupna tipkovnicom**~~ (WCAG 2.1.1; axe
`scrollable-region-focusable`) — **✅ ZATVORENO u fazi MREŽA B3c (2026-08-31):** `tabindex` +
`role="group"` + `aria-label` na `.lb-table-wrap` (oba mjesta) i na aktivnom nositelju
`.katex-display` (kroz `renderMath()`); a11y brana otad sudi po WCAG razini i skenira i
kvantitativni predmet na 375 px. U trenutku zapisa gate je mjerio samo na 1280 px — to je bio
**treći primjerak obrasca „gate koji mjeri jedno stanje tvrdi nešto o jednom stanju"**.

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

~~**Otvoreno za sljedeću ciglu:** `css/subject-selector.css` nosi **22 od preostalih 126** pogodaka~~
✅ **ISPUNJENO u C4a (2026-08-29), ali ne popravkom nego BRISANJEM:** datoteka je stilizirala zaslon
i `about` stranicu kojih markup više nema, pa je otišla cijela — a s njom i sva 22 pogotka.
⚠️ *Redak je ostavljen precrtan jer je bio **nalog sljedećoj sesiji**, a takav zapis, kad ostari,
ne zavarava nego ŠALJE NA POSAO koji je već obavljen.* Spec §10.1.

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

> ✅ **OVAJ ODJELJAK OPISUJE STANJE PRIJE K2b** (dijagnoza koja je fazu i pokrenula).
> Ispravljeno 2026-08-19 — v. **§8.8**: traka i mrvica sada stoje IZVAN `-page` sekcija,
> jezik je dohvatljiv sa svake stranice, a znak je poveznica na dom.

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
| **K2b** | ✅ **ISPUNJEN (2026-08-19, §8.8) — SPAJANJEM, ne slaganjem.** `<header class="topbar">` + `<div class="pathbar">` kao **braca** `-page` sekcija. Red 1 = odredista (znak -> landing, Predmeti, Moji materijali, jezik, racun), red 2 = polozaj (natrag + mrvica iz `roditeljOd()`). ⚠️ **Studio NE dobiva traku IZNAD svoje** — identitet i polozaj SELE u globalnu, Studiju ostaju radnje nad dokumentom. Izmjereno: `.st-topbar` **347 -> 57 px**, canvas **235 -> 326 px**, odrezanih kontrola **2 -> 0**. Slaganje bi canvas spustilo na ~171 px. | iz Studija se u jednom kliku dode na landing, browse i materijale | da |
| **K3** | ✅ **ISPUNJEN (2026-08-19, §8.9).** Brana mjeri **POGODAK, ne postojanje**: `elementFromPoint` na sredini svake kontrole u kromu mora vratiti tu kontrolu, nijedne se dvije ne smiju sjeći, izlaz mora odvesti na stranicu koja se stvarno prikaže, a lanac „natrag" mora završiti na landingu bez ponavljanja. ⚠️ **Cigla je NAŠLA KVAR, nije samo ogradila stanje** — v. **BUG-029**. | brana pada kad se traka makne (obrnuta provjera: **1 od 4**, i to je točan ishod) | da (popravak BUG-029) |
| | ⚠️ **KRITERIJ POOSTREN (2026-08-18).** „Bar jedan klik drugamo" mjeri POSTOJANJE izlaza, a Leonova dva kvara imala su izlaz — vodio je na slomljenu stranicu i u petlju, pa bi **oba prosla ovu branu kako je bila napisana**. Dodaje se: izlaz mora voditi na stranicu koja ima smisla (nijedan `node:` na lekcijskoj stranici) i „natrag" nikad ne vraca onamo odakle si upravo dosao. | | |
| **K4** | **Moji materijali u kvaliteti kataloga** (N3). Danas je polica **stablo**, a katalog **vitrina s bojom i ikonom**. Ista komponenta pločice koju K2 ionako izdvaja. | vlastiti materijal izgleda jednako dobro kao FMTU gradivo | da |
| **K5** | **Editor dvojezicno** (Leon, 2026-08-18: *„platforma mora biti na hrvatskom i engleskom i trebat ce editor isto biti na eng jeziku"*). **Premjereno 2026-08-19** (stara brojka „30 od 54" bila je od 2026-08-18 i vec je ostarjela): `studio.js` trazi **48** jedinstvenih `studio.*` kljuceva, rjecnik ima **20** -> **28 nedostaje** i pada na hrvatski rezervni. ⚠️ Jaci nalaz od brojke: **`block-editor.js`, `block-editor-media.js` i `admin-editors.js` imaju NULA `t()` poziva** — nisu djelomicno prevedeni nego UOPCE nisu spojeni na i18n. Editor zato nije cijel ni na jednom jeziku: `studio.js` pada na hrvatski, `admin-editors` govori engleski, i oboje se vidi na istom ekranu. ✅ Prekidac jezika je od **K2b** dohvatljiv sa svake stranice (bio je na 4 od 9). | korisnik prebaci jezik i editor je CIJEO na tom jeziku | ne |

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
3. **Nijedan `<script>` se ne dodaje na kritični put.** Landing već nosi **728 KiB u 41 skripti** (premjereno 2026-08-19; **38 bez `defer`**, **232 KiB = 31 %
   editorskog koda**) uz vlastiti budžet od 200 KB.
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
| **C6** | nosi **dvije** odgode (bilo tri): pitanja pri registraciji (shema → SQL = Leonova ruka) · **CSP**. ~~brisanje `bright-function`~~ **odrađeno 2026-08-28** | §3 + BACKLOG |
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
728 KiB u 41 skripti, premjereno 2026-08-19). `saveCurrentPosition` OSTAJE i nije duplikat: on je **pamćenje**
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



### 8.8 ✅ K2b JE ISPUNJEN — jedna gornja traka, i to SPAJANJEM (2026-08-19)

> **Leon je presudio „spajanje", ne „slaganje" — i to je bila odluka o kvaru, ne o ukusu.**
> Spec je do danas tvrdio da Studio traži **točno jednu iznimku** (`inset` ispod trake),
> dakle da globalna traka stoji **iznad** njegove. Mjerenje je pokazalo da bi ta izvedba
> **pogoršala** kvar koji na telefonu stoji od U8.

#### Prvo mjerenje, pa kod

Cigla je počela ponavljanjem mjere od 2026-08-14, jer bi inače krenula od brojke stare pet
dana. **Iste brojke** (390×844, staging, Studio s otvorenom lekcijom):

| | prije K2b | poslije K2b |
|---|---|---|
| `.st-topbar` | **347 px — 41 % ekrana** | **57 px — 7 %** |
| `.st-tree` | 263 px | 354 px |
| `.st-canvas` (radna ploha) | **235 px — 28 %** | **326 px — 39 %** |
| kontrole izvan ekrana | `.st-chip` [375…458] · `.st-iconbtn` [470…484] | **nijedna** |

Visinu je dizala **mrvica**: `.st-crumb` ima `flex-wrap:wrap` pa se na 390 px srušila u
stupac **96 px širok i 326 px visok**. Traka pritom `flex-wrap` **nema**, pa je ostatak
izlazio van, a `overflow:hidden` ga je **odrezao umjesto ponudio skrol** — dva gumba nisu
postojala za korisnika telefona.

**Aritmetika slaganja:** 64 (globalna) + 347 (Studio) → canvas pada s 235 na **~171 px**.
Cigla bi oduzela četvrtinu preostale radne plohe i **ne bi popravila ništa**, jer je kvar
bio *vodoravno* odsijecanje, a nova traka je vodoravno ne dira.

**Aritmetika spajanja:** Studijeva traka drži dvije različite stvari — *identitet i položaj*
(natrag, znak „Sokrat STUDIO", mrvica) i *radnje nad dokumentom* (Uredi, chip, Odbaci,
Objavi, ⚙). Prvo je posao globalne trake. Kad ono ode gore, Studiju ostaje pet stavki koje
stanu u jedan red. **Cigla koja je izgledala kao rizik za taj kvar postala je njegov popravak.**

#### Izvedeno

`<header class="topbar">` + `<div class="pathbar">` stoje **izvan** svih `-page` sekcija, kao
njihova braća. *(⚠️ Popis odredišta ispod opisuje traku KAKVA JE BILA NA ISPORUCI K2b.
Leon je 2026-08-19 maknuo „Predmete" — v. `BACKLOG.md` i §8.9; katalog otad vode vrata u
herou i mrvica.)* Red 1 nosi odredišta (znak → landing, Predmeti, Moji materijali, jezik,
račun), red 2 nosi položaj (natrag + mrvica). Visine su **konstante** (`--topbar-h: 64px`,
`--pathbar-h: 44px`), jer šest spremnika ima `min-height:100dvh` i od njih se mora oduzeti
kromo — sadržajna visina ne bi se dala oduzeti unaprijed.

**Mrvica se penje kroz `roditeljOd()`** — istu funkciju koja pogoni „natrag" (K2a). To nije
ušteda koda nego jedina brana protiv razilaženja: put koji mrvica **pokazuje** i put kojim
gumb **vodi** ne mogu se raziĆi ako su isti izraz.

⚠️ **Pritom je ispao propust K2a:** `roditeljOd()` nije znao roditelja **editora** — Studio
ga je prosljeđivao ručno (`goBack('materials' | 'profile')`). Dok je „natrag" bio jedini
čitatelj, to je prolazilo. Sada Studio upisuje kontekst u `AppState.nav.editorNode`, a
hijerarhija stoji na **jednom** mjestu. *Ručno proslijeđen argument je drugi zapis o istoj
stvari, i čeka drugog čitatelja da se razotkrije.*

**Mrvica ne ide kroz `innerHTML`.** Nazivi materijala su korisnički tekst, a mrvica je nova
površina koja ga prikazuje; umjesto oslanjanja na escape (granica #3, BUG-025) grade se
čvorovi i piše u `textContent` — tekst tad ne može biti markup.

**Landing je izgubio vlastitu traku** (Leon: traka bez gumba „Moji materijali", jer su ondje
ulaz **vrata u herou**). Mjere iz §7.13 su prenesene, ne izgubljene: **traka 64 px, znak
42 px** — globalna traka od 56/32 px poništila bi odluku donesenu na živom ekranu.

**Obrisano jer je postalo drugi zapis o istoj stvari:** trojac (jezik + materijali + račun)
iz **tri** zaglavlja · pet gumba natrag · `#stCrumb` · `#studyBreadcrumb` · `.landing-nav`
(6 CSS blokova) · `.st-logo`/`.st-ed`/`.st-crumb`. Načelo reza: **položaj STRANICE nosi
globalni drugi red, položaj UNUTAR stranice nosi sama stranica** — zato browse zadržava
dubinu drill-downa, a Studio naslov canvasa.

`goBack()` je usput naučio da **dubina unutar stranice ide prije dubine među stranicama**:
browse drill-down ne stvara unose u povijesti, pa bi globalni „natrag" s razine „predmeti"
izletio s browsea i preskočio tri razine kroz koje je korisnik upravo prošao.

#### Tri nalaza koje je našla tek regresija

1. **Cookie-banner je činio izbornik blokova neklikabilnim.** `.be-menu` je računao
   okretanje prema `window.innerHeight` — točno za *viewport*, ali ne i za ono što je u
   njemu **zauzeto**. Banner je `position:fixed` na dnu sa `z-index: 2147483000` i
   **presreće pokazivač**. Dok je Studio počinjao na vrhu, izbornik je slučajno padao
   iznad njega; čim ga je K2b spustio za visinu trake, počeo je padati **u** njega.
   Popravak: `--bottom-inset`, koji objavljuje `js/consent.js`. *„Stane li u ekran" nije
   isto što i „vidi li se".* **Kvar je bio latentan i nije ga uveo K2b** — samo ga je otkrio.
2. **Regex-brisanje grupiranih selektora ostavilo je dva VISJEĆA SELEKTORA** bez bloka
   (`.landing-nav .lang-toggle,`). To je točno razred **BUG-001/BUG-002** — nedovršeno
   pravilo proguta sljedeće. Uhvaćeno provjerom balansa vitičastih, ne okom.
3. **Isti regex zamalo je odnio `.landing-logo`**, koji **podnožje i dalje koristi**.
   Vraćeno iz gita i suženo na stvarno mrtvo. *Brisanje po uzorku imena briše i ono što
   uzorak slučajno pogađa.*

⚠️ **Jedna tvrdnja je PROMIJENJENA, i to nije isto što i pad.** `materials-entry.spec.js` je
tražio ikonu ulaza **u svakom** od tri zaglavlja — to je bio opis kvara koji cigla uklanja,
ne svojstvo koje štitimo. Nova tvrdnja je jača: ulaz mora biti dohvatljiv sa sve tri
stranice **i** nositi ga točno jedan element u kromu. ⚠️ Prva verzija te tvrdnje brojala je
`[data-goto-materials]` u **cijelom dokumentu** i pala na 5 — landing legitimno ima više
ulaza (vrata, ➕ pločica, CTA, podnožje). *Mjerila je točno, a tvrdila krivo.*

#### Nova brana

**`tests/studio-chrome.authed.spec.js`** — Studio na 390 px: nijedna kontrola u traci nije
odrezana · ljuska ne jede ekran (traka ≤ 96 px, ukupan kromo < 347 px, canvas ≥ 280 px).
Pragovi su postavljeni da uhvate **povratak mrvice ili znaka**, ne sitno ugađanje.
**Obrnuta provjera: 2/2 pada** na kodu prije K2b (`git stash`).

#### Gate

`preflight` **EXIT 0** · zadana suita **83 prošlo / 0 palo / 10 preskočeno** ·
`test:authed` **74/74** · `check:palette` **126/126** (traka nije podigla osnovicu) ·
`check:contrast` **5 tema · 238 provjera** · obrnuta provjera nove brane **2/2 pada**.

⚠️ `check:tailwind` je pao jednom, i to na **prozi**: komentar u `js/studio.js` objašnjava
zašto je mrvica dizala traku i pritom doslovno piše `flex-wrap:wrap` — skener čita izvor kao
tekst i izvukao je kandidat `.flex-wrap`. Isti razred kao `.\!container` iz `if (!container)`,
samo što je izvor ovaj put bilo **objašnjenje**.

⚠️ **Prijava je jednom pala sa `JWT issued at future`.** Nije kod: lokalni sat je bio točan
(< 1 s), a isti token je kroz direktan HTTP prošao (`is_admin` = `true`, 200). Sub-sekundna
utrka između sata koji `iat` **izdaje** (GoTrue) i onoga koji ga **provjerava** (PostgREST);
3/3 ponovljene prijave prošle. Zapisano da sljedeća sesija ne traži uzrok u vlastitom kodu.

#### Što OVA cigla NIJE popravila

`.st-tree` je i dalje `display:flex` na telefonu (**354 px**) iako `studio.css` traži
`display:none` ispod 680 px — medijski upit ne dodaje specifičnost, a bazno `display:flex`
stoji **ispod** njega. To je **zapisano kao svjesno neriješeno** u BACKLOG-u: Studio nema
mobilni izbornik za stablo, pa bi „ispravno" ponašanje ostavilo telefon **bez ijednog načina
da se odabere lekcija**. Traži odluku o dizajnu (K4), ne zakrpu.

> ⚠️ **ISPRAVAK (2026-08-19, Leon uz snimku): gornja tvrdnja pokriva DVA MODA, a vrijedi
> samo za jedan.** U **katalog-modu** (`_node == null`) `.st-tree` jest navigator i skrivanje
> bi doista oduzelo jedini način odabira lekcije. U **čvor-modu** — onome koji vidi svaki
> običan korisnik — panel nije navigator nego prikaz **jednog jedinog** materijala, čije
> ime na istom ekranu telefona već piše **dvaput** (globalna mrvica + `H1` canvasa). Ondje
> se briše **bez zamjene**. *Jedna tvrdnja pokrivala je dva moda i zato je pola vremena bila
> kriva* — isti razred kao izuzeće u `layout.authed` čija premisa ne vrijedi. Detalji i rez:
> `BACKLOG.md` § „Panel čvora u Studiju je na telefonu čista redundancija".

### 8.9 ✅ K3 JE ISPUNJEN — dohvatljivost se mjeri POGOTKOM (2026-08-19)

> Cigla je planirana kao **ograda oko onoga što K2b već isporučuje**. Prvo mjerenje ju je
> pretvorilo u **popravak**: brana je pala na kodu koji je istog jutra prošao pun preflight.

#### Prvo mjerenje, pa kod — i opet se isplatilo

Prije nego što je napisan ijedan `expect`, sonda je prošla **9 stranica × 2 širine** u pravom
pregledniku i pitala samo jedno: *pogodi li klik na sredinu kontrole baš tu kontrolu?*
Odgovor je bio „ne" na jednom mjestu, i to na najvažnijem — **na landingu, na 320 px**:

```
en 320px  browse=[74…111]  lang=[90…146]   POGODAK = KRIVO → topbar-lang
hr 320px  browse=[74…111]  lang=[104…162]  POGODAK = OK
```

Klik na „Predmeti" **nije otvarao katalog nego prebacivao jezik**. Nije izostao izlaz —
**izvršila se kriva radnja**, što je gore od nedostupnog gumba, jer korisnik dobije povratnu
informaciju da je nešto uspjelo. Puni opis: **BUG-029**.

#### Zašto ovo nije vidio nijedan od desetak postojećih gateova

| gate | zašto je bio slijep |
|---|---|
| detektori prelijeva | `overflow: visible`, `scrollWidth == clientWidth == 320` — **prelijeva nema** |
| `studio-chrome.authed` | mjeri odrezanost, i to samo u **Studijevoj** traci |
| `layout.authed` | ne posjećuje landing; mjeri vodoravni skrol dokumenta |
| axe (5 tema × 12 stanja) | mjeri uloge i kontrast, ne geometriju |
| Playwright profili | najuži je **375 px**, kvar živi na **320** |

⚠️ **Kriterij prihvaćanja §2 imenuje 320 px od prvog dana.** Ta je širina do K3 postojala u
**jednom jedinom testu** (CTA landinga). *Broj zapisan u kriteriju, a nemjeren nigdje, nije
kriterij nego želja.*

#### Tri mehanizma, jedno mjerenje

Ovo je **treći oblik iste obitelji u tri uzastopne cigle**:

| cigla | mehanizam | kako izgleda | što ga ne vidi |
|---|---|---|---|
| K2b | **odrezano** | `overflow:hidden` na fiksnoj ljusci | detektor prelijeva |
| BUG-028 | **prekriveno** | fiksni banner, `z-index: 2147483000` | i prelijev i odrezanost |
| **BUG-029** | **preklopljeno** | `flex-shrink` do širine 0 | **sva tri** |

Tri različita uzroka, jedna posljedica: **kontrola koju korisnik vidi, a ne može
upotrijebiti.** Zato brana ne broji gumbe nego pita `elementFromPoint`. *Postojanje se dade
provjeriti selektorom; dohvatljivost samo pogotkom.*

#### Izvedeno

**K3a — popravak, i to u dva odvojena dijela.** *Da stane*: ispod 360 px CTA odlazi iz trake
landinga (Leon, 2026-08-19) — ista odluka koja je odande maknula „Moje materijale", jer su
ulaz **vrata u herou**; landing ima **tri** `.start-trigger`-a, pa se ne gubi nijedan put.
*Da se ne može ponoviti tiho*: `.topbar-nav` dobiva `flex-shrink: 0` umjesto `min-width: 0`,
koji je stiskanje ispod širine sadržaja izričito **dopuštao**. Odredišta nisu ono što u traci
smije popustiti; kad ponestane mjesta, neka se traka **prelije** (to gate vidi) umjesto da se
**preklopi** (to ne vidi nitko).

⚠️ **Struktura je odmah zaradila svoje mjesto.** Čim je `flex-shrink: 0` uveden,
`layout-guard` je pao na **560 px** (dokument 574). Nije regresija nego **isti kvar na
drugoj širini**, dotad također skriven preklapanjem: na 560 px prestaje `max-width: 559px`
pa iskoče **i oznake i wordmark**, `topbarHome` skoči **42 → 146 px**, a najgori slučaj
(HR, „Predmeti") traži **632 px** — pojas **560–639 px** nikad nije stao. Popravak nije
guranje praga nego **razdvajanje dvaju**: oznake ostaju na 560, wordmark (sam **+104 px**)
dobiva vlastiti prag na 640. *Kad jedan prag pali dvije stvari različite cijene, mjeri ih
odvojeno.*

**K3b — brana**, četiri tvrdnje umjesto jedne, jer bi jedna propustila baš Leonove kvarove:

| | tvrdnja | čuva od |
|---|---|---|
| ① | pogodak na sredini svake kontrole u kromu | K2b · BUG-028 · BUG-029 |
| ② | nijedne dvije kontrole u kromu se ne sijeku | preklop koji središte preživi (na 344 px ih je 5 px) |
| ③ | izlaz vodi na stranicu koja se **prikaže**, bez `pageerror`, nikad `node:` na lekcijskoj | BUG-023 · BUG-026 |
| ④ | lanac „natrag" završi na landingu i **nikad ne ponovi čvor** | BUG-027 |

Stranice se **nabrajaju iz aplikacije** (`section[id$="-page"]`, katalog za predmet/lekciju),
ne iz prepisanog popisa — pa K4 i N2 ulaze pod branu same od sebe. Presedan je `applyRoute`,
koji sekciju provjerava po **tipki koja postoji**, ne po popisu koji bi se razišao.

⚠️ **Mjeri se VIDLJIVI pravokutnik, ne `getBoundingClientRect()`.** Mrvica živi u `.crumbs` s
`overflow-x:auto`; odskrolana, njezin se rect i dalje proteže ispod susjeda. Bez presjeka s
pretcima koji režu, brana bi prijavljivala sudare kojih nema — *a lažan nalaz je gori od
rupe, jer se gate tad isključi.* Isti razred kao izuzeće u `layout.authed` čija premisa ne
vrijedi (druga os s `overflow` postaje `auto` po specifikaciji).

#### Gate

`preflight` **EXIT 0** · zadana suita **424 prošlo / 0 palo / 42 preskočeno** (18,0 min) ·
`test:authed` **77/77** (bilo 74 + 3 nove) · nove brane **7/7** (4 odjavljeno + 3 prijavljeno).

⚠️ **Brojka prošlih je PALA s 434 na 424, i to je točan ishod, ne gubitak pokrića.** Prije je
`reachability` išao kroz sva četiri iPhone profila, a spec sam postavlja širine — 4 testa × 3
suvišna profila = **točno 12 ponovljenih mjerenja** koja su sad preskočena (30 → 42
preskočenih). Aritmetika se zatvara: 436 izvršenih prije (434 + 2 pala) − 12 = 424.

⚠️ **`css:diff` prijavljuje 3 razlike, i sve tri su isto pravilo** (`flex-shrink` na
`.topbar-nav`), uz **0 pregaženih tokena**. Ali vrijedi zapisati što **NE** vidi: uzorkuje
375 · 768 · 1280 px, a **obje nove medijske upite žive IZMEĐU** tih uzoraka (≤ 359 i
560–639). *Alat koji uzorkuje tri širine ne može posvjedočiti o četvrtoj* — zato pojasove
čuvaju `layout-guard` (33 širine) i `reachability` (4 širine od 320), a ne `css:diff`.

**Obrnuta provjera: pada 1 od 4**, s točnom porukom
(`320px landing · preklop: topbarBrowse × topbar-btn (21×40 px)`). Tvrdnje ③ i ④ prolaze i
prije popravka — one čuvaju model vraćanja iz K2a/K2b, koji K3 ne mijenja. **Brana koja bi i
njih oborila mjerila bi nešto drugo nego što tvrdi.**

#### Što OVA cigla NIJE popravila

Ruta **preživi reload** je iz opisa K3 ostala kod K1: `routes.spec.js` to već tvrdi hladnim
startom na dijeljenu adresu, a `restore-position.spec.js` čuva obnovu. Duplikat bi bio drugi
zapis o istoj stvari (ADR-027).

### 8.10 ✅ K4a — Studio na telefonu prestaje biti neupotrebljiv (2026-08-19)

> Leon, uz snimku: *„treba se toga riješiti na neki način da se ništa ne sjebe. Pa zbog toga
> **ne možeš ništa raditi na telefonu u editoru, apsolutno ništa**."*

#### Mjera prije koda

| 390×844 | prije | poslije |
|---|---|---|
| traka + putanja + `.st-topbar` + stablo | **522–540 px = 62–64 % ekrana** | **165 px = 20 %** (čvor-mod) |
| `.st-canvas` | **304–323 px** | **679 px** |

#### Rez ide po MODU, a ne po širini — i to je cijela poanta

`.st-tree` nosi **dvije različite stvari**, i to se iz CSS-a ne vidi:

- **čvor-mod** → **PRIKAZ** jednog materijala. Ime mu na istom ekranu telefona već piše
  **dvaput** (globalna mrvica + `H1` canvasa) → **briše se bez zamjene**, ništa se ne gubi.
- **katalog-mod** → **NAVIGATOR**, jedini način da se odabere lekcija → **seli u ladicu**
  (`position:absolute`, kvaka 🗂️ u `.st-topbar`, zatvara se sama nakon odabira).

⚠️ Zato je `.st-tree` dobio modifikator (`st-tree--node` / `st-tree--catalog`): razlika
postoji u JS-u, a CSS je do sada nije mogao vidjeti. **Jedna tvrdnja o „stablu na telefonu"
pokrivala je oba moda i zato je pola vremena bila kriva** (v. ispravak uz §8.8).

#### Zašto pravilo dosad nije radilo iako je postojalo

`@media(max-width:680px){ … .st-tree{ display:none } }` i bazno
`#editor-page .st-tree{ display:flex }` imaju **istu specifičnost** (1 id + 1 klasa), a bazno
dolazi **niže u datoteci** — pa je pobjeđivalo. *Medijski upit ne dodaje specifičnost.* Nova
pravila zato nose **dvije klase**, pa su jača neovisno o redoslijedu.

⚠️ **Istu sam grešku ponovio u samom popravku.** Kvaka ladice je prvo napisana kao
`#editor-page .st-treetoggle{ display:flex }` unutar medijskog upita, uz bazno
`display:none` **ispod** njega — i gumb je bio nevidljiv na **svim** širinama, tri odlomka
ispod objašnjenja zašto se to događa. Uhvatila ju je sonda, ne oko. *Zapisano pravilo ne
sprječava ponavljanje; sprječava ga mjerenje.*

#### Rubovi koje je popravak morao zatvoriti

- **Zatvorena ladica ne smije biti samo pomaknuta.** Sam `transform` ostavlja panel u
  **stablu pristupačnosti i u tab-redu** — čitač ekrana bi čitao zatvorenu ladicu, a
  tipkovnica u nju ulazila naslijepo. Dodan `visibility:hidden` sa **stepenastim** prijelazom
  (gasi se tek kad klizanje završi).
- **`position:relative` na `.st-layout`**, ne na `#editor-page`: potonji je fiksni
  puni-viewport, pa bi se ladica sidrila preko trake s radnjama nad dokumentom.
- **Ladica prekriva, ne gura** — inače bi vratila točno onaj kvar koji uklanja.

#### Gate

`preflight` **EXIT 0** · **puna suita 427 prošlo / 0 palo / 42 preskočeno** (19,2 min) ·
`test:authed` **80/80** (bilo 77 + 3 nove) · nova brana `studio-mobile.authed` **3/3** ·
`a11y.authed`, `reachability.authed`, `studio-chrome.authed`, `cascade.authed` **13/13 zajedno**.
**Obrnuta provjera: 3/3 pada.** ⚠️ Pošteno: dva testa padaju jer je kvar bio prisutan, a
**treći (stolno računalo) pada mehanički** — `#stTreeAside` je id koji uvodi baš ova cigla,
pa na starijem kodu ne može proći. On čuva od regresije koju bih *ja* mogao uvesti, ne od
zatečenog kvara.

---

## 9 · CRVENI ALARM — „TELEFON" i „POLICA" (Leon na iPhoneu 16, 2026-08-19/20)

> ## ✅ FAZA „TELEFON" (T0–T6) JE ISPORUČENA NA PRODUKCIJU — 2026-08-24
> `2e9fff9..82f8560`, 45 commita, verifikacija posluženim sadržajem = zadnji **🚀** redak u
> `docs/records/CHANGELOG.md`. **Rollback: `2e9fff9`.** Uz nju su izišli i **KOSTUR (K1–K4a)**,
> **BUG-032** i **landing C+D**. ~~Faza „POLICA" (P1–P4) NIJE napravljena~~ → **POLICA je
> ISPUNJENA 2026-08-28** (§9.17–9.21), ali **nije deployana** — živi na grani `feat/polica`.
>
> ⚠️ **Odluka ① niže je POTROŠENA, ne ukinuta.** Leon je 2026-08-24 sam odobrio merge
> (*„moze merge na main"*) iako C4–C7 i POLICA nisu gotovi — obrazloženje koje je stajalo iza
> odluke prestalo je vrijediti, jer je prepreka bio telefon, a on je riješen. **Sljedeći deploy
> opet traži izričit OK** (pravilo #2). Odluka ② stoji netaknuta.


> **Leon je zaustavio tempo cigli:** *„puca mi kurac za cigla po ciglu u ovoj sesiji, ovo je
> crveni alarm koji se treba rijesiti."* Uz to dvije tvrde odluke koje vrijede od sada:
> **① ništa ne ide na produkciju dok cijeli frontend ne bude riješen** · **② broj commita
> izvan produkcije NIJE nalaz i ne spominje se** (*„ZNAM KADA ZELIM PUSTIT NESTO NA
> PRODUKCIJU"*; povod je raniji deploy koji se nije trebao dogoditi).
>
> Ova sekcija **ne poništava §8** — K1, K2a, K2b, K3 i K4a su isporučeni i stoje. Mijenja se
> **što dolazi iza njih**: prije C4 ulaze dvije nove faze, a K4 se u jednu od njih utapa.

### 9.1 Mjerenje — produkcija naspram grane, iPhone 16 (393 × 852)

Mjereno u pravom Chromiumu, obje mete istim skriptom, isti dan.

| mjera | **produkcija** | grana |
|---|---|---|
| zaglavlje kataloga (`.browse-header`) | **270 px** | 102 px |
| naziv fakulteta (65 znakova) lomi se u | **14 redaka**, stupac 103 px | 3 retka |
| naslov „Choose your program" | odrezan na **34 od 205 px** → „C…" | cijel |
| pomak kad `--safe-top` = 59 px | **0 px — ništa se ne pomakne** | sve za 59 |
| „Start studying" | **y = 18 px** (otok je ~59) | ispod trake |
| kromo prije prvog sadržaja | 270 px = **32 %** ekrana | 210 px = **25 %** |
| cookie-banner | **~490 px = 24 %** ekrana pri prvom posjetu | isto |

⚠️ **Metoda vrijedi i ubuduće:** `env(safe-area-inset-top)` se u Chromiumu ne da simulirati,
ali `--safe-top` je **naša varijabla iznad njega** — postavi je na 59 px i **što se ne pomakne,
to na pravom telefonu stoji ispod otoka.** Ovo je prvi put da smo sigurnu zonu uopće izmjerili.

### 9.2 Dijagnoza — nisu četiri kvara nego jedan korijen

**① Naziv fakulteta.** Mrvica ispisuje **puno pravno ime** („FMTU – Fakultet za menadžment u
turizmu i ugostiteljstvu, Opatija") u flex-dijete s `min-width: 0`, **bez `nowrap` i bez
kraćenja**. Susjedni naslov `nowrap + ellipsis` **ima**. Oba su pravila sama po sebi ispravna —
**kvar je u kombinaciji**: ime naraste u stupac, naslov se zbije u „C…". → **BUG-030**.

**② Sigurna zona.** `viewport-fit=cover` **jest** postavljen, dakle stranica se **namjerno**
crta ispod otoka — a `css/landing.css` spominje `env(safe-area-inset-*)` **nula puta**. Ušli
smo u nesigurnu zonu i nismo je nadoknadili. → **BUG-031**.

**③ Grana je ① popravila slučajno, ne namjerno.** 102 px umjesto 270 samo zato što je K2b
maknuo gumbe iz tog zaglavlja. Korijen stoji netaknut, a usput je nastao **duplikat: mrvica
gore piše „Subjects", zaglavlje ispod ponavlja fakultet** — dva naslova na jednom ekranu.

#### ⚠️ Zašto je svih desetak gateova zeleno

Ovo je najvažniji nalaz sekcije, jer objašnjava kako je stanje postalo ovakvo neopaženo:

- **axe mjeri na 1280 px.** Telefon ne posjeti.
- **`css:diff` uspoređuje nas sa samima sobom.** Hvata *promjenu*, ne *lošoću* — ravnomjerno
  loše stanje mu je savršeno stabilno.
- **K3 i K4a mjere KROMO** (trake, dohvatljivost kontrola), **ne stranicu**.

Dakle stranica smije biti neupotrebljiva na 393 px, a nijedan gate to **po konstrukciji** ne
može reći. Isti obrazac koji je projekt već zapisao tri puta (§7.9 boja · §7.10 teme · §7.11
širina), samo na četvrtoj osi. **Telefon kao STRANICA nikad nije bio mjerena površina.**

### 9.3 Faza „TELEFON" — cigle

**Kriterij faze: na iPhoneu 16 aplikacija radi kako treba.**

| # | cigla | gotovo kad korisnik… |
|---|---|---|
| **T0** | **Mjerač — prvi, i sve visi o njemu.** Brana koja mjeri **stranicu**, ne kromo: 320 / 393 / 430 px, s otokom simuliranim na 59 px. Pet tvrdnji: ① ništa interaktivno u gornjih 59 px · ② kromo ≤ 20 % ekrana · ③ nijedan tekst u flex-retku se ne lomi preko 2 retka **dok mu susjed ima kraćenje** · ④ bar jedan upotrebljiv element vidljiv bez skrola · ⑤ nijedno zaglavlje razine preko jednog retka. **Obilazi i četiri načina učenja** — Leon ih je ocijenio kao „čine se ok", pa brana to pretvara u brojku bez ijedne dodatne cigle. | …na telefonu ne naiđe ni na jedan ekran koji brana ne posjećuje; brana **crveni na zatečenom stanju** (dokazano: tvrdnje ①③⑤ padaju s izmjerenim brojkama) |
| **T1** | **Sigurna zona kao pravilo** — svih devet stranica, obje orijentacije. Danas to poštuje 7 datoteka, landing nijedna. | …drži iPhone s otokom i nijedan gumb ni slovo ne stoji ispod njega |
| **T2** | **Jedan naslov po ekranu.** Fakultet dobiva **kratko ime** u `catalog.js` (puno pravno ime nije mrvica); zaglavlje kataloga se **spaja s mrvicom** jer govore isto; kraćenje u flex-retku postaje pravilo, ne pojedinačna zakrpa. Ovdje izlazi i **`#topbarMaterials`** iz trake (v. 9.6). | …na 393 px pročita naziv razine u cijelosti, a zaglavlje mu ne pojede ekran |
| **T3** | **Vertikalni budžet kroma ≤ 20 %** | …na telefonu vidi sadržaj, a ne tri trake |
| **T4** | **Cookie-banner na telefonu** — danas 24 % ekrana | …pri prvom posjetu vidi i ponudu i stranicu |
| **T5** | **Tipografija i prostor na telefonu** — naslov danas lomi žuti isticaj nasred fraze („four" na kraju retka, „ways" na početku sljedećeg), podnaslov je 5 redaka, prije skrola se vide **jedna** vrata | …na prvom ekranu dobije razlog, ne samo naslov |
| **T6 ✅** | **Editor s posjetiteljeva puta — ISPORUČENO 2026-08-23 (§9.13): vlastita stranica, 234 → 164 KiB mrežom, 7 → 0 editorskih datoteka, `check:budget` kao brana.** Izvorna bilješka: Izmjereno: **744,6 KiB u 41 skripti, 38 bez `defer`**, od toga **238,2 KiB (32 %) editorsko** u 6 datoteka. Vlastiti budžet projekta je 200 KB → **3,7×**. Uvjetno učitavanje + budžet kao gate. | …bez računa otvori landing i ne preuzme editor koji nikad neće vidjeti |

> **T6 nije čišćenje nego preduvjet faze „POLICA"** — offline ljuska ne smije nositi editor
> koji offline student nikad ne otvori. Zato je zadnji u TELEFONU, a ne izdvojen „kad god".

### 9.4 Faza „POLICA" — skini što učiš (Leon, 2026-08-20)

Leon: *„ja bi stavio da korisnik moze birat sta zeli skinut od sadrzaja za ucenje i onda mu
bude u posebnom sucelju spremljeno da moze uciti."*

**Kreativna jezgra nije u mehanici nego u tome gdje to sjeda: ne gradimo novu površinu nego
punimo onu koja je već planirana i prazna.** U `BACKLOG.md` stoji **N2 „osobna početna —
predmeti koje učim"**, zapisana kao želja i nikad dizajnirana. Skidanje je točno njezin sadržaj.

Korisnikov prostor time ima **dvije vrste stvari: što je napisao i što je skinuo**, a skidanje
je jedna rečenica: *„stavi mi na policu i drži dostupnim bez mreže."* „Moji materijali" prestaju
biti mapa s tuđim imenom i postaju **ono što učim** — što je usput pravi odgovor na Leonovu
raniju primjedbu o vrtnji u krug između police i editora.

| # | cigla | gotovo kad korisnik… |
|---|---|---|
| **P1** | **Što se skida.** Podatak: lekcije su JSON. ⚠️ Predmet s vježbama mora povući **i pack i svoju biblioteku** (`stat-lib.js`), inače se skine predmet koji offline ne radi cijel. Po predmetu: veličina, datum, „ukloni". | …vidi koliko predmet zauzima prije nego ga skine i može ga ukloniti |
| **P2** | **Gdje živi.** Jedna polica, dva izvora (moje / skinuto), isti prikaz pločice s napretkom. **Ovdje se utapa K4** (v. 9.6). | …na jednom mjestu vidi sve što uči, bez obzira odakle je došlo |
| **P3** | **Pravilo u SW-u.** Skinuti predmet ide **cache-first**, odvojeno od općeg stale-while-revalidate. Danas SW precachea točno 4 datoteke (`/`, `index.html`, bundle, manifest) — „editor je u offlineu" zapravo znači da `index.html` povuče sve. | …u zrakoplovnom načinu otvori skinuti predmet i on se otvori |
| **P4** | **Napredak.** **Već radi** offline-first (`cloud-sync`, unija/max) — ne gradi se iznova, samo se dokazuje testom. | …uči offline i po povratku mreže mu se napredak spoji bez gubitka |

**Kriterij faze:** korisnik u zrakoplovnom načinu otvori skinuti predmet, odradi sva četiri
načina, i po povratku mreže se napredak spoji bez gubitka.

### 9.5 Vježbe — smjer „RECEPTI" (zapisano 2026-08-20, **radi se TEK nakon frontenda**)

Leon: *„ja bi excercises zavrsio nakon sta cijeli frontend popravimo i da pripremimo sve
savrseno."* Dakle ovdje se **ne planira cigla nego se zaključava smjer**, da se sljedeća sesija
ne vrati na početak.

#### ⚠️ Tvrdnja koju je mjerenje oborilo

Projekt je nosio — u memoriji i u obrazloženju ADR-018 — rečenicu *„vježbe su KÔD, nisu
UGC-abilne."* Izmjereno učitavanjem svih pet packova:

```
234 vježbe ukupno
  151  (65 %)  čisti PODATAK — nijedne funkcije
   83  (35 %)  imaju točno JEDNU funkciju: generate(p)
```

A tih 83 nisu raznorodna: **67 (81 %)** je sama aritmetika nad parametrima + sastavljanje
teksta, **4 (5 %)** ima petlju/`reduce`, **12 (14 %)** zove `StatLib` (z/t tablice,
kombinatorika). Svaka je **čista funkcija** — primi brojeve, vrati `{prompt, fields}`. Nema
DOM-a, stanja ni I/O, i **nema nijedne druge vrste funkcije u cijelom katalogu.**

**Presudni nalaz:** randomizirana vježba ima **deset ključeva, od kojih je devet već podatak**:

```
id · lesson · chapter · type · title · prompt · difficulty · params · solution   ← PODATAK
generate                                                                        ← KÔD
```

`params` su **već deklarirani kao podatak, u svih 83 bez ijedne iznimke**
(`{a:{min:2,max:18,step:1}, …}`). **Shema je od prvog dana bila deklarativna i nitko to nije
primijetio.** Jedino što je kôd je **formula**.

#### Smjer: kôd se ne briše i ne prevodi — SELI iz vježbe u knjižnicu

Formule su per-vježba, ali ono što računaju **nije**: „prosjek, varijanca i SD od pet brojeva"
je **oblik zadatka**, ne svojstvo vježbe. Zato:

```
// bilo (83 puta, svaka svoju kopiju)
{ id:'t2-sd-random', params:{…}, generate(p){ …aritmetika… } }

// biva
{ id:'t2-sd-random', params:{…}, recipe:'sample-sd' }
```

| zašto je to bolje od alternativa | |
|---|---|
| **Vježba postaje 100 % podatak** — ne 65 %, ne 93 % | ide u bazu, JSON, kroz `publish_document`, u skidanje, u MCP, u editor — **bez ijedne iznimke i bez drugog puta**. **BUG-012 se time smije umiroviti**: stvar koja nije preživljavala serijalizaciju više ne postoji. |
| **Nema novog jezika** | odbačena je ideja evaluatora izraza (parser koji bih morao napisati i osigurati). Recepti su **naš obični JavaScript**, napisan i testiran **jednom**, umjesto 83 kopije aritmetike. |
| **Pokriva 100 %, ne 93 %** | onih 12 sa `StatLib` i 4 s petljama bile su iznimka samo dok je kôd morao stati u vježbu. Recept **smije** zvati `StatLib` — on je naš. |
| **Migracija se sama provjerava** | starih 83 generatora ostaju **proročište**: stari `generate` i novi `recipe` preko istih parametara kroz N seedova moraju dati **identičan izlaz**. Mehanički dokaz, ne pregled okom. |
| **Za korisnika je izbornik, ne programiranje** | autor bira oblik zadatka i upiše raspone; njegov AI kroz MCP isto — **a proizvodi podatak, ne kôd**. |

#### Posljedica za ADR-030 (zapisati kad se smjer izvede, ne prije)

ADR-030 kaže **„vježbe izvan MCP-a"**, a taj je zid podignut **jer je vježba bila kôd**.
Prestane li biti, zid se smije pomaknuti **bez ijednog popuštanja u ADR-018** (student i dalje
šalje podatak, nikad kôd). To je odluka za onaj trenutak, ne za sada.

#### ⚠️ Dvije stvari protiv, obje moraju u dizajn od prvog dana

1. **Recept je DIJELJENA ovisnost.** Promijeniš recept — promijenio si svaku vježbu koja ga
   koristi, uključujući tuđe. Danas je svaka vježba sama svoja, pa te vrste rizika nema.
   Pravilo: recepti su **imenovani i verzionirani, i ne mijenjaju se nego dodaju.**
2. **Ne zna se koliko ih ima.** 83 generatora → možda 20, možda 40 recepata. **To je jedina
   brojka koja odlučuje o cijeni** i mjeri se grupiranjem po tome što računaju — **prije**
   nego se itko obveže na opseg.

**Ostaje netaknuto:** engine (7 tipova) se ne mijenja za sadržaj · vježbe ostaju admin-domena
dok se recepti ne izvedu · `journal` (2 vježbe, dvojno knjigovodstvo) je najizgledniji kandidat
da ostane iznimka.

### 9.6 Odluke ove sesije koje mijenjaju zatečeni plan

1. **`#topbarMaterials` izlazi iz trake** (Leon: *„taj gumb je na landingu i na profilu i to je
   DOVOLJNO"*, pogotovo na telefonu). Ostaje **5 ulaza**: landing ×4 (vrata, `own-cta`,
   podnožje, ＋ pločica) + profil ×1. ⚠️ **Cijena koja mora biti izrečena:** iz *unutrašnjosti*
   aplikacije (katalog, lekcija, učenje, editor) tada nema ulaza u vlastite materijale — ide se
   preko landinga ili profila. Isti kompromis kao kod „Predmeta".
2. **K4 se ne radi zasebno — utapa se u P2.** „Moji materijali u kvaliteti kataloga" i „jedna
   polica, dva izvora" su isti ekran; raditi ih odvojeno znači isti prikaz napisati dvaput.
3. **K5 (editor dvojezično) ostaje u redu čekanja** — nije telefonski i ne blokira ništa.
   Premjereno stanje stoji u §8.3 i nije se promijenilo.
4. **A1+A0 (Google-prijava + prepravak dijaloga) — redoslijed još nije presuđen** (Leon:
   *„ne znam jos, to cemo se dogovorit"*). Ne planirati ga ni prije ni poslije dok ne kaže.
5. **Vježbe idu TEK nakon cijelog frontenda** — v. 9.5.


### 9.7 ✅ T0 JE ISPUNJEN — telefon je od danas mjerena površina (2026-08-21)

Brana: **`tests/phone.spec.js`** (odjavljen) + **`tests/phone.authed.spec.js`** (polica,
profil, Studio), zajednička mjera u **`tests/helpers/phone-gate.js`**. Tri širine
(**320 · 393 · 430**) × stvarne visine tih uređaja, otok simuliran na **59 px**, i
**četiri načina učenja na pravoj lekciji** — Leon ih je ocijenio kao „čine se ok", pa je
to sada brojka, a ne dojam. Ukupno **30 javnih + 9 prijavljenih ekrana** po prolazu;
javni prolaz traje **2,1 min**, prijavljeni **43 s**.

#### Obrnuta provjera — puštena na PRODUKCIJU prije nego je napisana ijedna tvrdnja

Ovo je jedini način da se zna mjeri li brana stranicu ili sebe. Produkcija kvar dokazano
ima; svih pet tvrdnji je ondje palo, na brojkama koje se poklapaju sa zapisom u BUGS.md:

| | nalaz na produkciji |
|---|---|
| ① otok | `a.landing-logo` y=20…52 · `button.nav-cta` („Start studying") **y=18…53** · `button.lang-toggle` y=14…58 · `button#authNavBtn` · `button#backFromAbout` y=16…60 |
| ② kromo | browse-dubina **31 %** · lessons 25 % · study 23 % upotrebljive visine |
| ③ sukob | `.browse-title › #browseBreadcrumb` = **5 redaka** dok susjedni naslov krati |
| ④ prvi ekran | 320 px landing / lessons / study: **nijedna** sadržajna kontrola dohvatljiva |
| ⑤ zaglavlje | `h1#browseHeading` odrezan na **34 od 187 px (18 %)** → korisnik vidi „C…" |

**19 od 30 ekrana produkcije ima bar jedan kvar.**

#### ⚠️ NALAZ KOJI MIJENJA CIGLU T2: zapisani uzrok BUG-030 nije uzrok

BUGS.md je tvrdio da mrvica bez kraćenja **pojede** susjedni naslov. Izmjereno na
produkciji, 393 px, `.browse-header` (flex-redak, šestero djece):

```
natrag 44 + [.browse-title] + 🌐 59 + mape 44 + korisnik 44 + znak 40
= 231 px kontrola + 80 px razmaka = 311 od 345 px raspoloživih
→ .browse-title dobiva  34 px  (flex:1 1 0%, min-width:0)
```

**Naslov nije pojela mrvica nego pet kontrola u istom retku.** Mrvica i naslov su
uloženi u `display:block` spremnik — kao braća u stupcu **ne mogu** utjecati na širinu
jedno drugom. Mrvica objašnjava **visinu** (lomi se u taj 34-px stupac i digne zaglavlje
na 224 px), a ne **uskost**.

**Posljedica za T2, izrečena prije nego se počne:** kratko ime fakulteta samo po sebi
**ne bi popravilo naslov** — pet kontrola bi i dalje pojelo redak. Grana to već mjeri
kao 102 px upravo zato što je **K2b te kontrole odselio u globalnu traku**, što je i
mehanički dokaz da su one bile uzrok. T2 zato mora spojiti zaglavlje s mrvicom, a ne
samo skratiti tekst.

*Pouka:* opis uzroka koji zvuči uzročno preživi reviziju. Isti razred kao „brisanjem
demoa nestaje 240 KB editorskog koda" (§7.14) — i ondje je tvrdnja bila zapisana,
uvjerljiva i netočna, i pala je tek kad ju je netko izmjerio umjesto pročitao.

#### Što brana nalazi na GRANI (radni popis za T1–T5)

| tvrdnja | grana | što to znači |
|---|---|---|
| ① otok | ✅ 0 | K2b-ova globalna traka poštuje `--safe-top`; produkcija ga nema |
| ② kromo | **25 ekrana** | 320 px: browse **49 %**, lessons 45 %, study 44 %, about 21 % · 393 px: 28–31 % · 430 px: 26–28 % |
| ③ sukob | ✅ 0 | K2b je kontrole odselio iz zaglavlja; korijen na produkciji stoji |
| ④ prvi ekran | **15 ekrana** | na 320 px kromo 282–307 + banner 197 = **479–504 od 568 px (84–89 % ekrana)** |
| ⑤ zaglavlje | **5 ekrana** | `span.crumb` „First Midterm" odrezan na **30 od 99 px (30 %)** |
| prijavljeno | **4 ekrana** | polica / profil / admin / Studio na 320 px = 21 % (108 od 509 px); ostalo ✅ — K4a drži |

**Kromo je na grani TRI trake u nizu** (traka 64 + putanja 44 + zaglavlje stranice
115–140). To je T3, i sada ima brojku umjesto dojma.

> ⚠️ **Brojka koju T3 mora znati unaprijed:** na iPhoneu SE (320 × 568) je upotrebljiva
> visina **509 px**, pa je budžet od 20 % točno **102 px**. Same dvije globalne trake su
> **108 px** (64 + 44) — dakle **stranica `about`, koja nema nikakvo zaglavlje razine,
> probija budžet za 6 px**. To znači da T3 **nije ugađanje zaglavlja nego odluka o
> trakama**: ispod nekog praga se putanja i traka moraju **spojiti u jedan red** (ili se
> putanja skriva), inače je cilj nedostižan bez obzira koliko se zaglavlje stisne.
> *Prag koji nijedna kombinacija ne može zadovoljiti nije budžet nego želja* — a to se
> vidjelo tek kad je netko izmjerio najmanji uređaj, ne najčešći.

#### ⚠️ Mjerač je i sam bio kriv — tri puta, i svaki put ga je uhvatila obrnuta provjera

Ovo se zapisuje jer je metoda, ne anegdota. Svaka od tri greške izgledala je kao nalaz:

1. **Bočna traka kao kromo od 100 %.** `.subjects-sidebar` je `position:fixed` preko
   cijele visine, ali je `translateX(100%)` drži **izvan ekrana**. Mjera nije presijecala
   s ekranom po X. → presjek + zahtjev da traka bude široka ≥ 60 % **nakon** presjeka.
2. **Gumb zatvorenog dijaloga u otoku.** `offsetParent`-provjera fiksne elemente
   propušta, a zatvoren `<sokrat-modal>` je `visibility:hidden`. → vidljivost se
   **računa** (`visibility` · stvarna neprozirnost kroz pretke · `pointer-events`).
3. **③ nije okinuo ondje gdje kvar postoji.** Tražio je sukob samo u flex-**retku**, a
   na produkciji su mrvica i naslov u `display:block` spremniku. → sukob se traži u
   **svakom** spremniku, ali **samo unutar kroma i zaglavlja razine** (kartica sadržaja
   smije imati kratki naslov i troredni opis — bez tog reza brana proizvodi šum, a gate
   koji prijavljuje šum se isključi).

Sve tri je otkrilo puštanje mjerača na stanje za koje se **zna** da je pokvareno.
*Detektor koji nije obrnuto provjeren mjeri sebe, ne stranicu.*

#### ⚠️ Poznata rupa, zapisana namjerno — **✅ ZATVORENA ciglom T1, v. §9.8**

*(Zapis stoji kao povijest; nalog je izvršen i ne izvršava se ponovno.)*

Mjerač je u T0 simulirao **samo `--safe-top` i samo portret**. `--safe-bottom` / `-left` /
`-right` i landscape (gdje izrez ide ustranu) ostali su **nemjereni** — svjesno, ali kao rupa
koju **T1 mora proširiti**, a ne pretpostaviti da zelena brana već nešto tvrdi o donjem rubu;
projekt je taj razred greške već platio (`check:contrast`, tvrda zabrana #2: *gate koji
provjerava NEKE tokene stvara tihu pretpostavku da su provjereni SVI*). **T1 je to i učinio:**
⑥ donji rub, ⑦ bočni rub, ⑦b/⑦c spremnik, + četvrti profil **852 × 393**.

#### ⚠️ Brana traži OSNOVICU, ne nulu — i to je odluka, ne popuštanje

Prva verzija je tražila nulu i time obojila `npm run test:responsive` u crveno. Zvučalo
je pošteno i bilo je krivo: nalazi T0-a **planom su dodijeljeni ciglama T1–T5**, pa bi
suita bila crvena kroz **pet** cigli — a tada „je li suita zelena?" prestaje biti
upotrebljivo pitanje i **prava regresija u ostalih 400+ testova nestane u šumu**.

Projekt taj razred problema ima riješen i zapisan (`check:palette`: *„ne traži nulu nego
samo da broj nikad ne poraste"*), pa T0 koristi isti obrazac. **`tests/phone-baseline.json`**
drži poznate kvarove **imenovane doslovno** (javno 45, prijavljeno 4); brana pada **samo
na kvaru kojeg ondje nema**, dakle na NOVOM. Riješeni se ispisuju glasno, jer bi
zastarjela osnovica tiho pokrivala kvar koji se vratio. Spuštanje je izričita radnja:

```
PHONE_BASELINE_UPDATE=1 npx playwright test tests/phone.spec.js --project=iPhone-SE-375
```

**Obrnuta provjera čegrtaljke** (dvaput, s različitim upisom): makni **jedan** redak iz
osnovice → brana pocrveni i imenuje **točno taj** ekran, ništa drugo.

#### ⚠️ Brana je treperila, i uzrok nije bio u mjeri nego u ČEKANJU

Vrijedi zapisati jer je protuintuitivno: **mjera je bila savršeno determinističa** — tri
uzastopna prolaza dala su **bajt-identičnu** osnovicu — a brana je svejedno jednom pala
pa sljedeći put prošla. Uzrok je bila **navigacija na fiksno vrijeme**: pod opterećenjem
klik ne stigne prerenderati razinu, `browse:dubina` ostane **plići**, izmjeri se **drugi
ekran**, i njegov nalaz nije u osnovici → lažno crveno. *Fiksno čekanje mjeri vrijeme;
tvrdnja treba stanje* — isto što je `studio.authed` platio na drag-testu (K6b).

Prelazak na čekanje-po-stanju iznio je **još dva prava kvara u brani**, oba vrijedna:

1. **`#studyLoading` prijavljen kao kromo od 100 %.** Uvjet čekanja je sadržavao
   `l.offsetParent === null` — a `.study-loading` je **`position:fixed`**, čemu je
   `offsetParent` **uvijek `null`**, pa je uvjet prolazio odmah i mjerio se **zastor**.
   Ista zamka koju ova datoteka na drugom mjestu već upozorava da izbjegava.
2. **Petlja spuštanja je izlazila iz kataloga.** Hijerarhija je
   `faculties → programs → years → subjects`, a klik **na razini `subjects`** vodi na
   lekcijsku stranicu — brojanje klikova je mjerilo `lessons` misleći da mjeri katalog.
   Uvjet zaustavljanja je sada **razina**, ne broj klikova.
3. **Čekanje ne smije pretpostaviti ishod mjerenja.** Načini učenja crtaju sadržaj nakon
   što sekcija postane aktivna, pa je „aktivna + ima visinu" bilo prerano (④ je skočila
   15 → 21). Ispravno je čekati da se **crtanje smiri**, a **ne** da se „pojavi kontrola" —
   potonje je baš ono što ④ mjeri, pa tvrdnja ne bi mogla pasti nikad. Nakon ispravka je
   brojka natrag na **15, ali dobivena stanjem umjesto srećom**, i prolaz je **13 s
   umjesto 32**.
4. **A onda je isti kvar došao na drugom ekranu, jer popravak nije bio generaliziran.**
   Smirivanje je isprva ugrađeno **samo u načine učenja** — i `admin` je zatim jednom
   prijavio „nijedna dohvatljiva kontrola", a drugi put ne, jer se puni asinkrono.
   Smirivanje sada vrijedi za **svaku** navigaciju. *Popravak koji nije generaliziran je
   popravak koji čeka drugu priliku* (BUG-027) — osmi put u ovoj fazi da mehanizam pokrije
   NEKA mjesta i time stvori pretpostavku da pokriva SVA.

**Stabilnost nakon svega: 3/3 javno + 3/3 prijavljeno, i puna suita 439 prošlo / 0 palo.**

#### Stanje suite

**`npm run test:responsive` je ZELEN** (brana radi protiv osnovice, v. gore), a
**`npm run preflight` je EXIT 0** — T0 ne dira nijedan izvršni redak aplikacije, samo
`tests/`, pa **`npm run bump` nije bio potreban**.

### 9.8 ✅ T1 JE ISPUNJEN — sigurna zona je od danas PRAVILO, a ne navika (2026-08-21)

**Kriterij:** *korisnik drži iPhone s otokom i nijedan gumb ni slovo ne stoji ispod njega* —
u obje orijentacije, na svih devet stranica. Ispunjeno: tvrdnje ⑥, ⑦ i ⑦b su na **nuli**.

| tvrdnja | prije | poslije |
|---|---|---|
| ⑥ donji rub (na dnu skrola) | **183** | **0** |
| ⑦ bočni rub (landscape) | **16** | **0** |
| ⑦b spremnik sadržaja poštuje zonu | **16** | **0** |

> ⚠️ **Sitnica koja je zamalo ušla u zapis kao brojka: Playwrightov `Received + N` NIJE broj
> nalaza.** U toj razlici su i dva retka same strukture (`Array [` i `]`), pa je „+185"
> zapravo **183**, a „+18" **16**. Prvo su bili prepisani doslovno; ispravljeni su tek kad je
> popis prebrojan po elementima (90 + 40 + 40 + 10 + 3 = **183**). *Broj pročitan iz tuđeg
> ispisa treba jednom provjeriti vlastitim brojanjem* — isti razred kao zbroj u TESTING.md koji
> je dvaput bio kriv jer ga nitko nije zbrojio.

#### ⚠️ NALAZ KOJI JE ODREDIO OBLIK CIGLE: pravilo napisano golim `env()` je nemjerljivo

T0 je zapisao da `env()` u Chromiumu nije simulabilan, a da je `--safe-top` **naša**
varijabla iznad njega. T1 je iz toga izvukao posljedicu koju T0 nije: sve što je napisano
**izravno** s `env(safe-area-inset-*)` naša zamjena **ne dohvaća** — ostaje 0 i u pregledniku
i u brani. Takvo pravilo nijedan test ne može ni potvrditi ni oboriti.

Zatečeno stanje je imalo **dvije liste iste činjenice**: naš token (`--safe-*`, **39 mjesta u 9 datoteka**) i
goli `env()` (**18 mjesta u 5 datoteka**). Posljedice su bile točno one koje se od dvije liste
očekuju, i obje su izmjerene:

- **`.mobile-nav`** — `css/responsive/03-modes-a11y-print.css` je unutar `@supports` bloka
  prepisivao ispravno pravilo iz `components.css` inačicom s golim `env()`. Na uređaju radi
  isto; **u mjeri ne postoji**, pa je brana prijavila **90 od 183** nalaza na donjem rubu koji
  na pravom iPhoneu nisu kvar. *Detektor nije bio kriv — kôd je bio nemjerljiv.*
- **`.landing-footer`** — imao je ISPRAVAN `padding-bottom` sa `env()`, i to je bio jedini
  razlog zašto se činilo da podnožje sigurnu zonu poštuje. Nije se dalo dokazati.

Zato T1 uvodi **`npm run check:safearea`** (u preflightu): `env(safe-area-inset-*)` smije
stajati **samo u `css/variables.css`**, svugdje drugdje ide `var(--safe-*)`. Druga provjera
istog gatea traži da ta četiri tokena ondje **stvarno postoje** — bez nje bi nula golih
`env()` bila savršena ocjena i za stranicu koja sigurnu zonu uopće ne poznaje.

> ⚠️ **Brana je prvo prijavila vlastiti komentar.** Skener je čitao datoteku kao goli tekst,
> pa je pogodio objašnjenje *zašto* je goli `env()` maknut. Komentar nije pravilo: ne izvršava
> se i ne može ništa pregaziti — a mora se smjeti napisati, inače objašnjenje ne može stajati
> ondje gdje pripada. Rješenje je brisanje komentara **uz očuvanje brojeva redaka**. Isti
> razred kao `check:tailwind` §šum, gdje je skener klasu izvukao iz proze: *skener vidi tekst,
> ne pravila.*

#### Što je stvarno bilo pokvareno (nakon što se oduzme nemjerljivost)

| kvar | mjera | zašto ga ⑥/⑦ prije nisu vidjeli |
|---|---|---|
| **cookie-traka** (80 nalaza) | oba gumba **20 px** pod home-indikatorom na SVAKOJ stranici; u landscapeu „Prihvaćam" **43 px** pod bočnim izrezom | `position:fixed` — nijedan spremnik je ne može uvući, a T0 je mjerio samo gornji rub |
| **`.browse-content`** (3) | zadnja kartica **14 px** pod indikatorom **na dnu skrola**, odakle se ne da izvući | kratica `padding:` u `@media (max-width:600px)` je BRISALA `padding-bottom: calc(2rem + var(--safe-bottom))` iz baznog pravila — i to točno na širinama gdje sigurna zona jedina postoji |
| **bočni rub, sve stranice** (18) | kartice kataloga počinju na **24 px**, poveznice podnožja na **34**, uz sigurnu granicu od 59 | landscape nije bio profil ni u jednoj brani |
| **`#stCanvas`** (Studio) | `padding-bottom: 0`, a ljuska seže **do ruba ekrana** | v. ⑦c niže — kvar koji se ne vidi dok sadržaj nije dovoljno dug |

#### Pravilo za vodoravnu os: padding ide na SEKCIJU

```css
section[id$="-page"] { padding-left: var(--safe-left); padding-right: var(--safe-right); }
```

Jedno pravilo za svih devet stranica. Tri odbačene inačice i razlog:

- **`margin` na `<main>`** — `.browse-content` ima `margin: 0 auto` za centriranje; pravilo bi
  ga pregazilo i sadržaj bi **na desktopu skočio ulijevo**, gdje su rubovi ionako 0.
- **`padding-inline` na `<main>`** — tražilo bi da pravilo poznaje svaki postojeći razmak
  (16 px, 24 px, `clamp()`…), dakle popis koji se raziđe s prvim novim ekranom.
- **`padding` na `body`** — fiksni namještaj ga ne vidi, a sekcijske pozadine bi se uvukle i
  ispod izreza bi ostala pruga tuđe boje.

Padding na sekciji radi jer se **pozadina crta i ispod paddinga**: ploha ostaje preko cijelog
ekrana, uvlači se samo sadržaj. Selektor je **atributni, a ne popis klasa** koji u
`variables.css` već postoji: taj popis ima osam imena i ne poznaje `#editor-page`. Adresa
`-page` je ugovor iz K1 i po njoj već idu `reach-gate` i `phone-gate` — deveta stranica time
dobiva sigurnu zonu **jer postoji**, a ne jer se netko sjetio dopisati je.

**Donji rub NIJE ušao u to pravilo**, iako bi simetrija bila lijepa: `.study-page` nosi vlastiti
`padding-bottom` zbog donje trake učenja, a zajedničko pravilo veće specifičnosti bi ga
obrisalo i sadržaj bi nestao **iza** trake. Donji rub je zato **mjeren** (⑥), ne nametnut.

#### ⚠️ `max()` umjesto zbrajanja — odluka koju je iznjedrila osnovica, ne ukus

Prva inačica cookie-trake je pisala `padding-bottom: calc(16px + var(--safe-bottom))`. Brana je
odmah pokazala cijenu: traka je narasla **za punih 34 px** i time gurnula **još jedan ekran**
(393 px, način „kartice") u stanje *„bez skrola se ne da ništa"* — dakle **popravak sigurne zone
pogoršao bi tvrdnju ④**. Sa `max(16px, var(--safe-bottom))` sigurni rub **pojede** razmak
umjesto da mu se doda: sadržaj sjeda točno na granicu zone, traka raste 20 px umjesto 34, ispod
indikatora i dalje nema ničega, a onaj ekran ispada iz nalaza.

Pravilo koje iz toga slijedi: **fiksni namještaj → `max()`** (vertikalni prostor je skup, a
pojas je ionako vizualno rezerviran) · **skrolabilni sadržaj → `calc()`** (zadnja kartica treba
i zraka, ne samo da ne bude ispod indikatora).

#### ⚠️ ⑦c — razlika između PRAVILA i SLUČAJA, i kvar koji je našla

Tvrdnja ⑥ pada samo ako u pojasu **stvarno stoji** kontrola. Ljuska s kratkim sadržajem zato
prolazi **slučajno**, a kvar izlazi kod korisnika čim sadržaj naraste. Studio je točno takav:
`position:fixed; inset: var(--chrome-h) 0 0 0`, dno mu je rub ekrana, i **fiksni element ne zna
za padding svojih predaka**. Izmjereno: `.st-canvas` = `padding-bottom: 0`, `.st-tree` = 14,
`.st-inspector` = 16, uz rub od 34.

Zato ⑦c mjeri **svojstvo** spremnika: skroler koji seže do dna ekrana mora rezervirati donji rub.

> ⚠️ **Prva izvedba te tvrdnje nije mogla puknuti.** Tražila je da spremnik *trenutno* prelijeva
> (`scrollHeight > clientHeight`) — a u testu je Studio otvoren s praznim dokumentom, pa je
> kandidata bilo **nula**. Brana bi ostala zelena sve dok netko ne napiše dovoljno dug materijal.
> Uvjet je maknut: rezervacija ruba je svojstvo spremnika, ne posljedica trenutnog sadržaja.
> **Otkriveno ispisom kandidata, ne čitanjem koda** — a zatim obrnuto provjereno: s vraćenim
> kvarom (`padding-bottom: 0`) brana imenuje `main#stCanvas`, bez njega šuti.

#### Cijena koja se izriče, a ne skriva

- **Cookie-traka je viša za 20 px** (197 → 217 px na 320 px ekrana, 38 % umjesto 35 %). To je
  neizbježno: gumbi su prije bili djelomično pod indikatorom. **T4 je i dalje ta cigla.**
- **Osnovica je narasla za landscape**: `kromo` 25 → 34 (javno) i 4 → 8 (prijavljeno),
  `prviEkran` 15 → 20. **Nijedan od tih nalaza nije T1** — landscape je novi profil, a njegov
  kromo (48 % na katalogu, 27 % i na goloj `about`) je posao **T3**.
- **Nemjereno ostaje** ono što se u testu ne otvara: bočna traka predmeta i ladica stabla
  (K4a) mjere se samo dok su zatvorene. Zapisano kao rupa, ne kao pokrivenost.
- **Pravne stranice (`privacy`/`terms`/`faq`/`contact`) namjerno OSTAJU izvan.** One nemaju
  `viewport-fit=cover`, dakle **nisu se ni prijavile** za crtanje ispod izreza — sustav im sam
  ostavlja sigurni okvir. Dodati im ga „radi dosljednosti" značilo bi **stvoriti obvezu koja
  danas ne postoji**, pa se to ne radi. (Isto vrijedi za `--safe-*`: kad rub nije 0, `max()` i
  `calc()` u `tokens.static.css` ionako nemaju što uvlačiti jer se te stranice ne crtaju ispod.)

#### Stanje gateova

`check:safearea` **EXIT 0** (37 datoteka; obrnuto provjeren — ubačen goli `env()` ga obara i
imenuje točan redak) · `css:diff` **0 razlika / 3408 usporedbi** (očekivano: rubovi su u
Chromiumu 0, pa promjena ne smije pomaknuti nijedan piksel) · `preflight` **EXIT 0** ·
phone-brana **9/9 javno, 10/10 prijavljeno**. Dirano je 8 CSS datoteka → **`npm run bump`
pokrenut** (81 token).

> ✅ **ANOTACIJA 2026-08-29 (ALAT-1):** doseg opisan niže vrijedio je **do tada**. Alat sada
> referencu vadi u `git worktree` i poslužuje **cijelo stablo**, pa je i `css/consent.css`
> **od tada pokriven** — upravo rupa koju ovaj odlomak imenuje. Zapis ostaje jer objašnjava
> **zašto se doseg gate-a mora izreći**, a to pravilo nije prestalo vrijediti.
>
> ⚠️ **Doseg `css:diff`-a mora se izreći, jer inače tvrdi više nego što mjeri.** Ta usporedba
> zamjenjuje **samo `styles.bundle.css`** (radno stablo vs `HEAD:styles.bundle.css`), a
> **`css/consent.css` NIJE u bundleu** — `index.html` ga učitava vlastitim `<link>`-om. Znači
> da promjena cookie-trake u tih 3408 usporedbi **uopće nije sudjelovala**: ista je datoteka na
> obje strane. Da je ondje bio drift, gate bi šutio. Nedrift se za nju dokazuje drukčije, i to
> se dade dokazati: `max(16px, var(--safe-left))` uz rub **0** daje točno `16px`, dakle
> identično zatečenoj kratici `padding: 16px`; a phone-brana to i mjeri geometrijski (banner je
> 197 px dok je rub 0, a 217 px tek kad se rub postavi na 34). **`check:safearea` jest doseže
> `consent.css`** (skenira cijeli `css/`), pa jedan izvor vrijedi i ondje.

### 9.9 ✅ T2 JE ISPUNJEN — jedan naslov po ekranu. BUG-030 zatvoren (2026-08-21)

**Kriterij:** *na 393 px korisnik pročita naziv razine u cijelosti, a zaglavlje mu ne pojede
ekran.* Ispunjeno na obje strane te rečenice, i to mjereno.

| | prije | poslije |
|---|---|---|
| kromo na katalogu (320 px) | 307 px = **54 %** | 167 px = **29 %** |
| kromo na katalogu (393 px) | 307 px = 36 % | 167 px = **20 %** |
| kromo na lekcijama / učenju | 286 / 282 px | **167 px** |
| trenutna mrvica na 320 px | „First Midterm" **30 od 99 px** | **99 od 99** |
| tvrdnja ⑤ (naslov razine) | 5 ekrana | **0** |
| osnovica, javno (ukupno) | 59 | **31** |

#### Mjerenje je odredilo rez — i pokazalo da tri zaglavlja NISU ista stvar

Sonda je prije ijedne izmjene ispisala što svako zaglavlje sadrži i što od toga već piše
u mrvici:

```
browse   140 px   #browseBreadcrumb „HOSPITALITY MANAGEMENT · YEAR 1"   ← POLOŽAJ
                  h1#browseHeading  „Year 1 subjects"                   ← UPUTA
lessons  119 px   h1#currentSubjectTitle „Tourism Economics"            ← duplikat mrvice
study    115 px   h1#currentLessonTitle  „First Midterm"                ← duplikat mrvice
```

**Lekcije i učenje su bili čisti duplikat** — h1 je pisao doslovno ono što piše zadnja
mrvica. **Katalog nije**: ondje je zaglavlje nosilo dubinu drill-downa koju mrvica **nije
pokazivala** (mrvica je imala samo korijen „Predmeti"). Dakle nisu tri iste zakrpe nego dva
različita kvara, i rez ide po tome:

- **identitet → mrvica**, i to cijeli lanac: `Predmeti › FMTU › Hospitality Management › Year 1`;
- **uputa → sadržaj** (`h1.browse-heading` u `main`), gdje se smije odskrolati;
- **duplikat → `visually-hidden`**: naslov stranice mora postojati za čitač ekrana, ali ne
  mora stajati na ekranu dvaput. Id-evi su zadržani jer ih pišu `navigation.js` i četiri testa.

*Da je rez išao „makni zaglavlje" bez tog razlikovanja, katalog bi ostao bez ijednog prikaza
dubine — korisnik bi vidio samo „Predmeti" i ne bi znao u kojem je smjeru ni godini.*

#### ⚠️ Pravi kvar iza BUG-030 bio je PRIORITET KRAĆENJA, i bio je postavljen naopako

```css
.crumb          { flex-shrink: 0; }   /* preci — držali su PUNU širinu */
.crumb-current  { flex-shrink: 1; }   /* gdje jesi — JEDINI se stiskao */
```

Na 320 px je zato „First Midterm" dobio **30 od 99 px**, dok su „Subjects" (63) i „Tourism
Economics" (129) stajali netaknuti. **Stiskalo se jedino što odgovara na pitanje „gdje sam?",
a preci — koji su uvijek izvedivi iz konteksta — nisu popuštali ni piksel.** Isti razred kao
sam BUG-030 (dva pravila ispravna svako za sebe, kvar tek u kombinaciji), samo unutar trake.

Novo pravilo: **preci se stišću** (uz `min-width`, da kraćenje ne ode u besmisao), **trenutna
razina se ne stišće**, a `renderPathbar()` usto pomiče lanac na kraj — pa je trenutna razina
vidljiva i kad lanac prelijeva.

#### ⚠️ Brana je morala naučiti razliku, i to je bilo izmjeriti-pa-odlučiti, ne popustiti

Tvrdnja ⑤ je kraćenje ispod 60 % tretirala jednako za sve mrvice. Nakon T2 bi zato prijavila
**pretke** — točno ono ponašanje koje cigla namjerno uvodi. Rez: ⑤ mjeri **odgovor na „gdje
sam?"** (trenutna razina + zaglavlje razine), a preci su **navigacija** i smiju se kratiti;
za njih i dalje vrijedi da se ne smiju **lomiti**, a dohvatljivost im mjeri `reachability`
pogotkom. Zapisano je i u samoj brani, jer je komentar uz prag to predvidio: *„ako T2 ostavi
legitimno kraćenje ispod 60 %, prag se pomiče uz zapis zašto, ne prešutno."*

#### Traka je ostala bez ijednog odredišta — i to je druga polovica odluke

`#topbarMaterials` je izašao (§9.6, Leonova odluka), pa gornji red sada nosi **samo** znak,
jezik, prijavu i CTA. Cijena je izrečena: iz *unutrašnjosti* aplikacije u vlastite materijale
se ide preko landinga ili profila (pet ulaza), kao i kod „Predmeta". Uz to je obrisano
označavanje `aria-current` u traci — bilo je vezano uz gumbe kojih više nema; položaj sada
nosi isključivo mrvica.

**Kratko ime fakulteta** (`shortName: 'FMTU'`) dodano je u `catalog.js` — ali kao *posljedica*,
ne kao lijek: T0 je dokazao da naslov jedu kontrole, ne znakovi. Puni pravni naziv ostaje u
`name` i dalje stoji na kartici fakulteta.

#### Jedan ulaz za promjenu razine kataloga

Dubina drill-downa sada se vidi u traci, pa svaka promjena razine mora osvježiti **i** prikaz
**i** mrvicu. Da se to ne bi oslanjalo na dogovor, uveden je `browseNaRazinu()` kroz koji idu
i „natrag" i klik na karticu i klik na mrvicu. Isti obrazac kao K2b: *put koji se pokazuje i
put kojim se ide ne mogu se raziĆi ako su isti izraz.*

#### Što je ostalo, i čije je

Kromo je sada **točno dvije trake: 64 + 44 = 108 px**. Na iPhoneu SE je to **21 %** uz budžet
od 20 % — dakle **probijanje je palo s 29 postotnih bodova na jedan**, i preostalo je točno
ono što je §9.7 najavio kao aritmetiku koju **T3 mora znati unaprijed**: dvije globalne trake
same po sebi ne stanu u budžet, pa T3 nije ugađanje zaglavlja nego **odluka o trakama**.
Tvrdnja ④ je pala s 20 na 13 ekrana; ostatak je **cookie-banner** (T4).

#### ⚠️ Dva testa su pala — i pala su na PRAVOM mjestu

Puna suita je prijavila **8 padova**, ali su to bila **dva testa × četiri profila**, oba u
`tests/materials-entry.spec.js`, i oba su tvrdila **staru** odluku: *„ulaz u materijale je
dohvatljiv s browse/lessons/study — iz JEDNE trake"*. Točno to je Leon ukinuo (§9.6). Testovi
su zato **promijenjeni odlukom, ne popravljeni da budu zeleni** — po presedanu cigle A
landinga, gdje je zapisano da je razlika **odluka**, a ne pad.

Novi test čuva **baš cijenu te odluke**, da se ne plati slučajno i nezapisano: traka ne smije
imati ulaz **ni na jednoj** od tri unutrašnje stranice (inače se odluka tiho vraća, a s njom i
kromo), a landing ga mora imati **više puta** (inače je odluka tiho pojela jedini put do
vlastitog gradiva). Drugi test je zadržao svoj scenarij — vozilo (klik na gumb) je zamijenjeno
istim pozivom koji je gumb ionako zvao, jer svojstvo koje čuva nije bilo vozilo nego **model
vraćanja**.

> ⚠️ **Pouka je o mojoj metodi, ne o kodu.** Prije prepisivanja sam **grepao** tko spominje
> `#topbarMaterials`, vidio u `materials-entry.spec.js` samo `.doors [data-goto-materials]` i
> zaključio da taj spec ne dira traku. Ispis je bio **skraćen `head`-om** — redci 85 i 112+
> nisu bili u njemu. Zatim sam ciljano vrtio „navigacijske" specove **koje sam sam odabrao po
> osjećaju**, i taj spec nije bio među njima; pao je tek u punoj suiti. *Kad cigla briše
> kontrolu, popis specova koji je moraju provjeriti nije stvar procjene nego pretrage — a
> pretraga se ne smije čitati skraćena.* Isti razred kao brojka pročitana iz tuđeg ispisa
> (v. napomenu o Playwrightovu `Received + N` u §9.8).

#### Stanje gateova

`preflight` **EXIT 0** · `css:diff` **6 razlika, sve na `.browse-heading`** (novi naslov u
sadržaju dobio je tipografiju umjesto zadane h1 od 32 px) · phone-brana **9/9 javno, 10/10
prijavljeno** · `a11y` 5/5 · navigacijski specovi (browse, landing, sidebar, routes,
reachability, layout-guard) **19/19** · puna suita **437 prošlo / 8 palo**, a nakon promjene ta
dva testa **`materials-entry` 24/24 na sva četiri profila**. ⚠️ Ostatak suite se **nije
ponavljao, i to je izrečeno**: nakon njezina prolaza promijenjena je **isključivo**
`tests/materials-entry.spec.js`, dakle nijedan izvršni redak aplikacije — pa onih 437 prolaza
i dalje opisuje **ovo** stablo.

> ✅ **ANOTACIJA 2026-08-29 (ALAT-1):** i ovo je opis alata **prije** popravka. Od tada premota
> cijelo stablo, pa o obrisanom markupu **kaže**. Pouka ispod svejedno stoji: *gate koji nije
> mogao vidjeti promjenu nije je ni odobrio.*
>
> ⚠️ **Isti doseg-oprez kao u T1, sad s druge strane:** `css:diff` mijenja **samo bundle**, a
> DOM drži iz radnog stabla — dakle o **obrisanom markupu** ne kaže ništa i ne može. Zato su
> tri obrisana zaglavlja dokazana brojkom iz phone-brane (kromo 307 → 167), a ne odsutnošću
> razlika. *Gate koji nije mogao vidjeti promjenu nije je ni odobrio.*

---

### 9.10 ✅ T3 JE ISPUNJEN — budžet kroma ≤ 20 %, i to DVAMA pravilima (2026-08-21)

**Kriterij cigle:** *korisnik na telefonu vidi sadržaj, a ne tri trake.*

| mjera | prije | poslije |
|---|---|---|
| 320 × 568 (portret) | 108 od 509 = **21 %** | **100 = 19,6 %** |
| 393 × 852 (portret) | 108 od 793 = 14 % | 108 = 14 % *(nije se ni diralo — već je prolazilo)* |
| 852 × 393 (polegnut) | 108 od 393 = **27 %** | **56 = 14 %** |
| osnovica `phone` — javno | 31 | **13** |
| osnovica `phone` — prijavljeno | 8 | **0** |

#### ⚠️ Sonda je pokazala da problem nije KOLIČINA kroma nego RASPODJELA

Mjereno prije ijedne izmjene, unutar aplikacije na 320 px:

```
.topbar    64 px visine   nosi 134 px sadržaja   →  146 px širine PRAZNO
.pathbar   44 px visine   mrvica ŽELI 377 px     →  dobiva 252   ⚠ kraćeno
```

Cijeli red od 64 px troši se na znak i dva ikon-gumba, dok red kojem širina **treba** gladuje.
Na 852 × 393 je obrnuto: `.topbar` ima **393 px** slobodne širine, `.pathbar` **601 px** — obje
poluprazne, a nedostaje **visina**.

**To je oborilo prvu skicu rješenja** („spoji trake u jedan red"). Jedan red na 320 px: znak 42 +
natrag 36 + akcije 92 + razmak 32 + tri zazora 24 = **226 fiksno → mrvici ostaje 94 px** umjesto
252. Provjereno i bez znaka: **244**, i dalje manje nego danas. **Nijedan raspored u jednom redu
na 320 px ne daje mrvici širinu koju već ima** — spajanje bi poništilo T2, koji je baš tu mrvicu
vratio s 30 na 99 px.

> **Pravilo koje iz toga ostaje: prije nego se dvije stvari spoje, izmjeri ima li ona koja gubi
> prostor odakle ga dati.** Portret i landscape imaju **suprotnu oskudicu**, pa jedan rez ne može
> biti točan za oboje. *Dva pravila ovdje nisu nedostatak jedinstva nego posljedica mjerenja.*

#### ① Nizak prozor → traka se stisne na ono što joj treba (`max-height: 700px`)

`body:not(.on-landing) { --topbar-h: 56px }`. **64 px postoji zbog LANDINGA**, gdje traka nosi znak
i CTA i sama je cijela navigacija (§7.13). Unutar aplikacije nosi znak i dva ikon-gumba — i nema
pravo na landingovu visinu. 56 = **znak 42 + 7 px zraka gore i dolje**.

⚠️ **Znak ostaje 42 px** — mijenja se samo zrak oko njega. Leonova odluka (*„znak je tri puta
prijavljen kao premalen"*) je time netaknuta, i to je bio uvjet, ne sretna okolnost.

#### ② Prozor niži od 520 px → JEDAN RED (`max-height: 519px`)

Ovdje spajanje **jest** odgovor, jer je oskudica obrnuta. Redoslijed je namjerno obrnut
(`order: -1`): **položaj ide lijevo**, gdje gumb „natrag" i pripada, a marka i alati desno.
Mrvica u najdubljoj razini traži 377, dobiva **341** → kraćenje pada na **pretke**, nikad na
trenutnu razinu (pravilo T2 vrijedi dalje jer ga nosi `.crumb` vs `.crumb-current`, ne raspored).

#### ⚠️ Ljepljivost je morala preseliti — i to je bio jedini način

Do T3 su obje trake bile `position: sticky` svaka za sebe, a `.pathbar` je svoj `top` računao iz
visine `.topbar`. To radi dok su **jedna ispod druge**. Čim se moraju složiti **jedna pored
druge**, treba im zajednički flex-roditelj — a **sticky se ne može zalijepiti izvan svog
roditelja**: omotač visok 108 px pustio bi traku da mu iscuri iz kutije i odskrola. Zato je
`position: sticky` + `z-index: 1300` preselio na novi `<div class="chrome">`, a trake su unutra
statične.

**Dokazano skrolom, ne čitanjem:** prva provjera je „prošla" na `browse` u portretu — gdje je
`scrollY` bio **0**. *Prolaz zbog kratkog sadržaja nije prolaz* (ista pouka kao tvrdnja ⑦c u T1).
Ponovljeno na stranicama koje stvarno skrolaju: landing **4980 px**, učenje **773**, na 320 px
**5522** i **1118** — traka u sva četiri slučaja ostaje na `top = 0`.

#### 🐞 Kvar koji je UVELA OVA CIGLA, i našla ga je sonda — ne oko

U stupcu **svaka traka nosi vlastitu pozadinu preko cijele širine** i to je točno. U retku
`.topbar` postaje `flex: 0 0 auto` i pokriva **samo svoj dio** — izmjereno: **341 od 852 px**
(x = 452…793) — dok putanja lijevo od nje ostaje `rgba(0, 0, 0, 0)`. Posljedica bi bila da se
**sadržaj vidi kako klizi iza mrvice**, a donji rub prekriva samo desnu trećinu trake.

Popravak: u retku plohu, zamućenje i razdjelnik nosi **omotač**, a traka ih se odriče. Provjereno
mjerenjem u oba načina: ploha pokriva **852 od 852** u retku i **393 od 393** u stupcu.

> ⚠️ **A onda je taj popravak imao vlastitu cijenu od jednog piksela — i uhvatila ju je osnovica
> brane, ne oko.** Razdjelnik je prvo bio `border-bottom`, a `.chrome` u retku **nema zadanu
> visinu**, pa mu se rub **dodaje** na sadržaj: kromo je narastao **56 → 57** i **64 → 65 px**, i
> time se **razišao s `--chrome-h`** (koji i dalje računa 56) → sekcije bi dobile piksel previše.
> U stupcu se to ne događa jer trake **imaju** zadanu visinu uz `box-sizing: border-box`, pa je
> rub *unutar* nje. Rješenje: **`box-shadow: 0 1px 0`** — isti razdjelnik, **nula raspored**.
> *Rub troši visinu; razdjelnik koji to ne smije je sjena.* Invarijanta je nakon toga ponovno
> izmjerena i drži **9/9** (3 profila × 3 stranice), a kromo je opet **točno** 56 · 64 · 123 ·
> 159 · 167 px.

> ⚠️ **Ovo je razlog zašto se puna suita PREKINULA i pokrenula iznova.** Kvar je nađen dok je
> suita već tekla; da sam CSS promijenio u hodu, njezin rezultat ne bi opisivao nijedno stablo —
> ni staro ni novo. *Prekid je jeftiniji od dvosmislenog zelenog.* (Ista odluka kao dvaput u T2.)

#### 🐞 Usput ispravljen TIŠI I STARIJI kvar: `--chrome-h` nije pratio `body`

`--chrome-h: calc(var(--topbar-h) + var(--pathbar-h) + var(--safe-top))` stajao je na `:root`. Ali
**`var()` se supstituira ondje gdje je deklariran** — pa je `--chrome-h` već „zapekao" vrijednosti
iz `:root`-a i **nijedan override na `body` ga nije mijenjao**. Posljedica je starija od T3: na
landingu `body.no-pathbar` spušta `--pathbar-h` na 0, ali je `--chrome-h` i dalje računao s 44 px
→ sekcije su od `100dvh` oduzimale **red koji ondje ne postoji**. Nije se vidjelo jer je landing
dulji od ekrana.

Popravak je jedna deklaracija na `body`. **Provjeren invarijantom, ne pregledom:** na 3 širine ×
5 stranica `min-height` aktivne sekcije mora biti **točno `vh − stvarna visina omotača`** —
15/15 OK, uključujući landscape gdje kromo pada na 56.

#### ⚠️ Zašto `css:diff` ovaj put ima 225 razlika, i zašto to nije alarm

Dvije klase, obje očekivane i obje provjerene drugim putem:

1. **`position: sticky → static`, `top`, `z-index`** na `.topbar`/`.pathbar` — ljepljivost je
   preselila na omotač. Vizualni ishod je identičan, što dokazuje skrol-provjera gore.
2. **`min-height` sekcija +44 px** — to je **ispravak** iz prethodnog odjeljka. `css:diff` ne vrti
   navigaciju, pa mu `body` ostaje `no-pathbar` sa landinga i sve sekcije izgledaju kao da putanje
   nema; referenca je pokazivala **staru, krivu** brojku.

> ⚠️ **Alat ispisuje 8 od 15 elemenata po širini**, pa se ostatak ne da pročitati iz izvještaja.
> Umjesto nabrajanja, provjerena je **invarijanta koja ih sve pokriva** (`min-height == vh −
> kromo`). *Kad gate ne može pokazati sve, tvrdnja se dokazuje svojstvom, ne uzorkom.*

#### Što je ostalo, i čije je

Kromo više **ne probija budžet ni na jednom profilu**. Osnovica javno je pala **31 → 13**, i svih
preostalih 13 su tvrdnja ④ (*„bar jedna kontrola bez skrola"*). Prijavljene stranice su na **0**.

> ⚠️ **ISPRAVAK (T4, 2026-08-22): ovdje je stajalo „svi do jednog zbog cookie-bannera".**
> Mjerenje u T4 je pokazalo da je traka uzrok na **3** ekrana, a ne na 13. Tvrdnja je bila
> prepisana iz FORMATA PORUKE — nalaz ispisuje visinu trake kad god traka postoji, ne kad je
> ona kriva. *Nalaz koji nešto imenuje nije time i optužio to.* Razlaganje je u §9.11.

---

### 9.11 T4 — cookie-traka (isporučeno 2026-08-22)

**Kriterij (§9.3):** *„…pri prvom posjetu vidi i ponudu i stranicu."*

#### ⚠️ Prvo mjerenje je oborilo premisu cigle, i to prije ijednog retka koda

Ova sekcija je do danas tvrdila da su **svih 13** preostalih nalaza tvrdnje ④ *„svi do jednog
zbog cookie-bannera"* (§9.10). To je **netočno**, i način na koji je nastalo vrijedi zapisati:
poruka nalaza ispisuje visinu trake **kad god traka postoji**, a ne kad je traka **uzrok**.
Rečenica je dakle prepisana iz formata poruke, ne iz mjerenja. *Nalaz koji imenuje nešto nije
time i optužio to.*

Izmjereno (svaki ekran dvaput: sa zatečenom trakom i s `display:none` na traci):

| ekrana | zašto ④ pada | čije je |
|---|---|---|
| **3** — 320 px `study:home`, `study:flashcards`, `study:fill` | traka pokriva **cijelu donju navigaciju** | **T4** ✅ |
| **4** — `lessons` na 320/393/430/852 | stranica **nema nijednu sadržajnu kontrolu**: `div.lesson-card` nosi `click`-slušatelja, a nije ni gumb ni poveznica ni `role`/`tabindex` | **BUG-032** (nova) |
| **4** — `about` na 320/393/430/852 | stranica ima **točno jednu** kontrolu (`a.email-link`) i ona je na `y ≈ 1500` | otvoreno pitanje dizajna (§9.11.4) |
| **2** — `landing` na 320 i 852 | prva vrata počinju na `y = 567` od 568 px (portret), odnosno `y = 425` od 393 (polegnut) — hero ih gura ispod pregiba | **T5** |

Dakle: **T4 pojede 3 od 13, a ne 13 od 13.** Ostatak nije nestao nego je dobio pravo ime.

#### Pravi kvar iza trake nije bila VISINA nego POKRIVANJE

`.study-mobile-nav` (promjena načina učenja na telefonu) je `position: fixed; bottom: 0;
z-index: 9999`. Cookie-traka je `z-index: 2147483000`. Na **prvom posjetu** je zato traka
pokrivala **svih šest gumba** — dakle student koji prvi put otvori lekciju na telefonu ne može
promijeniti način učenja **dok ne odgovori na pitanje o kolačićima**.

Dvije varijante popravka razdvojene su na **svježoj stranici po varijanti** (kumulativno
mjerenje bi ovo sakrilo — i u prvom pokušaju jest):

```
320 px, study:home              traka   vrh    ④
  A  zatečeno                    217    351     0
  B  SAMO stisnuta               127    441     0     ← vrh je i dalje IZNAD navigacije (475)
  C  SAMO podignuta              217    258     6
  D  oboje                       127    348     6
```

**Stiskanje ne popravlja ništa** — 127 px trake i dalje počinje 34 px iznad navigacije.
Popravlja tek **podizanje**. Stiskanje ostaje u cigli, ali kao udobnost, ne kao ispravak.

#### Pravilo: traka se povlači pred trajnim donjim namještajem

`bottom: var(--bottom-furniture-h, 0px)`, a vrijednost **objavljuje `js/consent.js`
mjerenjem** — isti obrazac kao `--bottom-inset`, samo u suprotnom smjeru (ondje traka javlja
svoju visinu izbornicima, ovdje njoj javljaju koliko je dno već zauzeto).

⚠️ **Zašto mjerenje, a ne konstanta.** Visina navigacije nastaje iz nekoliko pravila
(`min-height` gumba + razmaci + sigurni rub) i **razlikuje se po širini**: izmjereno **93 px na
320** i **97 px na 393**. Svaka konstanta upisana u CSS bila bi drugi izvor iste istine i točno
bi jednom bila kriva. (Isti razlog zbog kojeg T3 nije smio spojiti trake „na oko".)

⚠️ **Sigurni rub se ODUZIMA za ono što je već ispod trake:**
`padding-bottom: max(12px, calc(var(--safe-bottom) - var(--bottom-furniture-h)))`. Kad traka
sjedne iznad navigacije, ispod nje nema izreza — njega je već pojela navigacija; bez oduzimanja
bi traka nosila **34 px prazne visine usred ekrana**. Kad namještaja nema, izraz se svede na
staro ponašanje. **`max()`, nikad zbrajanje** — isti rez kao T1.

⚠️ **Cijena koja se izriče:** `js/consent.js` sad drži `MutationObserver` nad sekcijama —
namještaj se pojavljuje s navigacijom, pa se prati promjena klase `.active`. Promatrač živi
**samo dok traka postoji**, dakle do prvog pristanka i nikad više.

#### Nova tvrdnja ⑧ — jer ④ nije mogla reći što je slomljeno

Tvrdnji ④ je dovoljna **bilo koja** dohvatljiva kontrola. Zato su `study:quiz` i `study:learn`
**prolazili** dok im je cijela donja navigacija bila pod trakom (imali su gumb u sadržaju), a
`study:home`/`flashcards`/`fill` padali — **jedan uzrok, pet ishoda, i nijedan nije imenovao
pravu stvar.** Tvrdnja ⑧ mjeri imenovano: *trajnu donju traku ništa ne smije prekrivati*,
pogotkom (`elementFromPoint`), uz imenovanje pokrivača.

**Obrnuta provjera** (vraćen `bottom: 0`): ⑧ prijavljuje **17 ekrana** oblika
`nav.mobile-nav: 6 od 6 kontrola prekriveno`, dok ih je ④ vidjela **3**. Brana koja mjeri
posljedicu vidjela je **18 %** kvara.

#### Mjere

| | prije | poslije |
|---|---|---|
| traka na 320 px (bez donje navigacije) | 217 px = **38 %** | 129 px = **23 %** |
| traka na 320 px **na učenju** (podignuta) | 217 px | **105 px** |
| traka na 393 px | 195 px = 23 % | 129 px = **15 %** |
| traka na 430 px | 174 px = 19 % | 129 px = **14 %** |
| traka polegnuto (852 × 393) | 103 px = 26 % | 73 px = **19 %** |
| osnovica `prviEkran` (javno) | 13 | **10** |
| osnovica `namjestaj` | — | **0** |

Tekst je pritom skraćen sa **171 na 100 znakova** i **prvi put preveden** — traka je do danas
bila jedina površina sa zakucanim engleskim, a to je pravni tekst, ne ukras.
⚠️ **Ta je tvrdnja OBORENA 2026-08-24** (cigla `about`, §9.14): traka nije bila jedina nego
samo prva nađena — cijela stranica „O nama" imala je **nula `data-i18n`**. *Pouka zapisana kao
anegdota o jednoj površini ne broji ostale.* Otud BACKLOG-stavka za `check:i18n`
(ispunjena 2026-08-31, MREŽA B5 — brana je u preflightu, razred izmjeren: 421/23).
Izostavljeno je
obrazloženje („kako bismo razumjeli kako posjetitelji koriste…") koje u cijelosti stoji u
Pravilima privatnosti, na koja traka vodi. Gumbi ostaju **36 px** visoki — visina se rezala na
tekstu i razmacima, nikad na metama za prst.

#### ⚠️ Usput: osnovica prijavljenih je pokušala progutati TUĐE STANJE

Pri spuštanju osnovice pojavila su se **četiri nova `dno` nalaza** (`button.mm-act` 14 px u
pojasu, 320 px, polica). Ponovljena mjera istog koda ih **nije reproducirala** — dvaput. Uzrok:
**polica je PODATAK**, a test-račun je u tom prolazu imao materijale, a poslije nijedan (sonda
to potvrđuje: `mm-act` = 0 i nakon 6 s čekanja, prazno stanje).

Da su ostali u osnovici, upisali bismo **trenutno stanje tuđeg računa kao našu poznatu manu**.
Zato su maknuti, a kvar je riješen **pravilom** — `.profile-content` rezervira donji rub
(`max(1.5rem, var(--safe-bottom))`, izmjereno 16 → 34 px). To je izravna primjena pouke T1 ⑦c:
*rezervacija ruba je SVOJSTVO spremnika, ne posljedica trenutnog sadržaja.*

**Pošteno se izriče:** da pravilo uklanja baš onaj nalaz iz osnovice **nije dokazano** — to
stanje se nije dalo reproducirati (ubačeni retci ne padnu na isto mjesto). Dokazano je da
pravilo **vrijedi**; da je nalaz bio ovisan o podacima; i da bi njegovo upisivanje u osnovicu
bilo pogrešno u svakom slučaju.

#### ⚠️ `check:tailwind` je pao na `.visible` — četvrti put isti razred, nova podvrsta

Dosad su kandidati dolazili iz **negacije u kodu** (`if (!container)` → `.\!container`) i iz
**proze** (`flex-wrap`, `sticky`). Ovaj put izvor je **ime CSS vrijednosti u usporedbi niza**:
`cs.visibility !== 'visible'` u novom mjeraču namještaja. Kad se obrazac imenuje, vidi se da
`fixed` i `hidden` na popisu isključenja stoje **iz istog razloga** — i oni su vrijednosti koje
kod uspoređuje kao tekst. *Skener ne zna razliku između vrijednosti i klase; vidi tekst.*

#### ⚠️ Funkcionalna sonda je našla ono što nijedna mjera izgleda nije mogla

Cigla je prepisala markup trake (`innerHTML` → DOM API) i dodala i18n — dakle točno one izmjene
koje mogu **tiho slomiti pristanak**, a da svaka mjera piksela ostane zelena. Zato je uz mjeru
napisana i sonda koja provjerava **ponašanje**: jezik, „Prihvaćam", „Odbijam", položaj iznad
navigacije. Našla je dvije stvari, i razlikovati ih je bilo važnije od popravljanja.

**① Prva je bila u samoj sondi.** Prebacivanje jezika nije radilo jer je sonda tražila
`#langToggle`, a prekidač zove `toggleUiLang()`. *Kad tvrdnja padne, prvo pitanje je mjeri li
uopće ono što misli da mjeri.*

**② Druga je bila prava, ali NIJE produkcijska — i to se izriče.** Traka je sjedila **34 px
predubok**o (objavljeno 63 px umjesto 97) i pokrivala **gornju trećinu navigacije, dakle ikone**.
Uzrok: u sondi se `--safe-bottom` postavlja **nakon** što se navigacija pojavi, pa je objavljena
vrijednost bila izmjerena prije nego je navigacija narasla. **Na pravom telefonu se to ne
događa** — `env()` se razriješi pri prvom crtanju, prije ijedne navigacije.

Ali je otkrilo **stvarnu rupu u mjeraču**: dodan `ResizeObserver` **nije okidao**, jer
`ResizeObserver` po zadanom prati **content-box**, a visina navigacije raste **isključivo
razmakom** (`padding-bottom: calc(.5rem + var(--safe-bottom))`). *Promatrač koji gleda krivu
kutiju je promatrač koji ne gleda.* Popravak je `{ box: 'border-box' }`; realan slučaj (rotacija
telefona) pokrivali su i dosad `resize`/`orientationchange`, pa je ovo pojas uz naramenice.

**③ I dalo je bolju tvrdnju.** ⑧ je gadala **središta** kontrola, a *pogodak u sredinu ne
dokazuje da je kontrola cijela vidljiva*: pri preklopu od 34 px središta gumba ostaju ispod
pokrivača. Izmjereno na oba profila s vraćenim kvarom — na **393 px je mjera središta šutjela, a
mjera gornjeg ruba prijavila `3 od 3 točke`**. Zato ⑧ sada uzorkuje i **gornji rub** namještaja.

#### Stanje gateova

`preflight` **EXIT 0** · **puna suita 447 prošlo / 0 palo / 72 preskočeno (21,5 min)** · `css:diff` **0 razlika / 3378 usporedbi** (očekivano: `consent.css`
nije u bundleu, a `--safe-bottom` je u Chromiumu 0 pa `max(1.5rem, 0)` = 1.5rem) ·
phone-brana **10/10 javno, 11/11 prijavljeno** · obrnuta provjera ⑧ **pada s 17 nalaza**.

#### 9.11.4 Što ostaje, i čije je

- **BUG-032** — `lessons` nema nijednu kontrolu za tipkovnicu ni čitač ekrana. **Nije samo
  telefonski kvar**: to je jedini put u svaku lekciju kataloga. Zapisan, nije popravljen ovdje.
- **`about` na sva četiri profila** — stranica bez ijedne kontrole u prvom ekranu. Prije
  popravka treba **odluka**: je li to kvar (stranica bez izlaza) ili proza koja se čita?
  Tvrdnja ④ ju danas broji kao kvar, pa ili stranica dobiva ulaz (npr. vrata natrag na
  gradivo), ili tvrdnja dobiva izuzeće **uz zapis zašto**.
- **`landing` na 320 i 852** — ✅ **riješeno ciglom T5** (§9.12). Brojka je bila:
  vrata počinju na 567 od 568 px (portret), odnosno 425 od 393 (polegnut).

### 9.12 T5 — tipografija i prostor (isporučeno 2026-08-22)

**Kriterij (§9.3):** *„…na prvom ekranu dobije razlog, ne samo naslov."*

#### Mjerenje prije koda — trošak je bio konstanta, a prostor varijabla

Hero (od vrha nadnaslova do vrha vrata) košta **jednako 444 px na svakom telefonu**:

| profil | upotrebljivi pojas (kromo → vrh trake) | hero | ishod |
|---|---|---|---|
| 430 × 932 | 803 px | 444 px | u redu |
| 393 × 852 | 723 px | 444 px | u redu |
| **320 × 568** | **316 px** | **444 px** | **140 % pojasa** |
| **852 × 393** | **256 px** | 361 px | **141 % pojasa** |

To je **isti razred kao T3**: ondje problem nije bila količina kroma nego raspodjela, ovdje
nije veličina heroja nego to što se **ne mijenja s ekranom**. Utility-ljestvica
(`text-4xl md:text-5xl lg:text-6xl`) mijenja se **stepenasto po ŠIRINI**, a oskudica na
telefonu je u **VISINI** — polegnut telefon je po širini „desktop" (852 px → `md:` prag), pa
je dobivao **60 px naslova na ekranu koji za cijeli hero ima 256 px**.

#### Zašto su tip i ritam morali izaći iz markupa — jedina iznimka od C1/C2

`.hero-title` (0,1,0) i `.text-4xl` (0,1,0) imaju **istu specifičnost**, a utilityji stoje
**na kraju** bundlea (app.css §„zašto su utilityji zadnji") → pravilo u `landing.css` bi
uvijek izgubilo. Ostale bi dvije mogućnosti, i obje su odbačene:

- **`.landing-page .hero-title`** (0,2,0) — dobiti nad utilityjem specifičnošću je isti smjer
  kao `!important`, a `app.css` izričito propisuje obrnuto: *„ako neko pravilo tuče utility,
  rješenje je OBRISATI pravilo"*.
- **prag u markupu** (`text-3xl xs:text-4xl …`) — rješava portret, **ne rješava polegnut**:
  širinski prag ne zna da je ekran nizak.

Zato veličine i ritam heroja stoje u `css/landing.css`, s **pragovima koji na ≥ 768 px vraćaju
TOČNO današnje tokene** (`--text-5xl`, `--text-6xl`, `4rem`) i **gornjim granicama `clamp()`-a
jednakima današnjim vrijednostima** (`3rem` = stari `text-4xl`, `3rem` = stari `mt-12`) — pa je
prijelaz bešavan, a desktop se ne pomiče ni za piksel. To je uvjet cigle, ne sretna okolnost:
**T5 je cigla o telefonu.**

Drugo pravilo je za **nizak ekran** (`max-height: 519px`, isti prag kao T3): naslov na
`--text-3xl`, `<br>` sakriven i **strop mjere podignut** — jer u polegnutom telefonu red od 33
znaka stane u jedan redak, a forsirani prelom ondje troši 12 % ekrana ni za što.

#### ⚠️ Prvi ekran je istu stvar govorio TRI puta

Naslov imenuje četiri načina · podnaslov ih **nabraja** · sekcija niže ih **pokazuje na pravoj
lekciji**. Uz to je prva polovica podnaslova (*„uzmi gotovo iz kataloga ili napiši svoje"*)
stajala **doslovno u opisu prvih vrata**, tri centimetra niže. Podnaslov je zato skraćen sa
**135 na 72 znaka** — ostalo je ono što nigdje drugdje ne piše: **da se ništa ne priprema
ručno**. To je isti rez kao T2 (*identitet u mrvicu, uputa u sadržaj*), samo na jednom ekranu.

⚠️ **Ovo je promjena TEKSTA na površini koju Leon pregledava** i zato se izriče, a ne skriva u
mjere: `hero.sub` u oba jezika. Struktura landinga iz §7.13 (naslov pokriva oba izvora → dvoja
ravnopravna vrata) **ostaje netaknuta** — oba izvora i dalje pokrivaju naslov i vrata, samo ih
podnaslov više ne ponavlja.

#### ⚠️ Odakle je kvar došao: C2 je obrisao pravilo koje je SLUČAJNO radilo pravu stvar

Nađeno u reviziji pred compact, i mijenja priču o uzroku. §7.8 bilježi da je C2 obrisao *„jedini
`!important` koji je tukao Tailwind-skalu — `.hero-title { font-size: 2rem !important }`, koji je
tiho zaključavao naslov na 32 px na svakom telefonu"*. **Tih 32 px je točno ono na što ga T5
sada vraća.**

Brisanje je ipak bilo ispravno, i razlika je cijela poanta: staro pravilo je imalo **pravu
vrijednost bez ijednog razloga** — `!important` bez praga, bez gornje granice, bez ikakvog
znanja o visini ekrana; primjenjivalo se na *svakom* telefonu jednako i tuklo je skalu umjesto
da je izrazi. Novo pravilo daje istu brojku na 320 px, ali **kao funkciju dviju osi**, s
pragovima koji desktop ostavljaju netaknutim i s tvrdnjom koja ga čuva.

*Pravilo koje slučajno pogađa točan broj nije isto što i pravilo koje zna zašto ga pogađa —
prvo nestane pri prvom čišćenju i nitko ne primijeti da je nešto nosilo.* Ovdje se dade i
datirati: kvar je ušao s C2 (2026-08-18 na produkciji), a **mjerena površina ga je uhvatila
tri dana kasnije** — što je točno ono zbog čega T0 postoji.

#### 🐞 Dva pravila koja sam napisao zvučala su kao ispravak, a nisu bila — oba je oborila obrnuta provjera

Ovo je najkorisniji dio cigle i zato stoji prije mjera:

1. **`.hero-title br { display: none }` u niskom ekranu.** Sonda: naslov ostaje **2 retka i 79 px**
   sa sakrivenim `<br>`-om i bez njega — jer ga strop od `22ch` (455 px) svejedno lomi.
   **Napisao sam bio pola pravila**, a pola pravila mjeri se kao mrtvo slovo. Tek sa stropom
   (`max-width: none`) naslov je **1 redak, 40 px**, a vrata **263 → 223 px**.
2. **`white-space: nowrap` na `.hero-mark`.** Spec je kvar imenovao točno („potez se lomi nasred
   fraze"), pa je `nowrap` zvučao kao njegov ispravak. Obrnuta provjera: **s maknutim `nowrap`-om
   fraza ostaje cijela na svim mjerenim širinama i u oba jezika** — drži je **naslov sveden na
   stupac**, ne to pravilo. Uz to je bio **lošiji**: fraza dulja od stupca se s njim ne bi
   prelomila nego **prelila**, a prelom `box-decoration-break: clone` ionako crta ispravno.
   Obrisan.

**Pouka: pravilo koje zvuči kao ispravak nije ispravak dok obrnuta provjera ne pokaže da bez
njega pada.** Nosiva je bila **veličina**, i to je provjereno: vrati li se naslov na 48 px na
telefonu, nova tvrdnja pada.

#### ⚠️ `css:diff` ovu ciglu NE MOŽE izmjeriti — i to je nalaz o alatu, ne o cigli

`css:diff` presreće **samo stylesheet**, a HTML uzima iz radnog stabla. Kad cigla premjesti
vrijednost **iz markupa u CSS**, njegova „referenca" je stranica koja **nikad nije postojala**:
novi markup + stari CSS. Otud izvještaj *„naslov 32 px"* — to je gola `h1` bez ijedne veličine,
i to na **sve tri** širine (46 razlika, uključujući 768 i 1280, gdje se ništa nije promijenilo).

Dokaz je zato izveden **pravim A/B-om**: HEAD je poslužen iz zasebnog `git worktree`-a na
drugom portu, obje verzije sa **svojim** markupom i **svojim** CSS-om, pa su uspoređeni
izračunati stilovi heroja na 375 / 768 / 1280:

```
375 × 812    22 razlike  — sve do jedne su namjera cigle (tip, ritam, vrata 479 → 290)
768 × 1024    0 razlika
1280 × 900    0 razlika
```

⚠️ **Ovo će se ponoviti u svakoj cigli koja seli markup na utilityje (C4–C7).** Zapisano kao
otvorena stavka u `BACKLOG.md`: dok se `css:diff` ne nauči poslužiti i **markup** iz reference,
cigle tog oblika dokazuju se A/B-om, a ne njegovim izlazom. *Gate koji mijenja samo jednu
polovicu stranice mjeri stranicu koja ne postoji.*

#### Mjere

| | prije | poslije |
|---|---|---|
| vrata **320 × 568** | y = 567 (od 568) | **y = 338**, pojas do 439 |
| vrata **393 × 852** | y = 538 | **y = 353** |
| vrata **430 × 932** | y = 457 | **y = 362** |
| vrata **852 × 393** | y = 425 (od 393) | **y = 200** |
| naslov na 320 px | 48 px · 3 retka · 158 px | **32 px · 2 retka · 70 px** |
| naslov polegnuto | 60 px · 2 retka · 126 px | **36 px · 1 redak · 40 px** |
| podnaslov na 320 px | 18 px · **5 redaka** · 144 px | **16 px · 2 retka · 51 px** |
| potez preko fraze | **2 retka** (320 i 393 px) | **1 redak** (sve širine, oba jezika) |
| osnovica brane, javno | 10 | **8** |

#### Nova tvrdnja — u `landing.spec.js`, ne u phone-brani

Potez preko fraze mjeri se ondje gdje žive istine landinga, jer je **specifičan za jednu
površinu**; phone-brana ostaje generička. Tvrdnja mjeri **ishod, ne mehanizam** (broj redaka i
širinu), u **oba jezika** (hrvatsko „četiri načina" je 13 znakova naspram engleskih 9) i
**izričito na 320 px**.

⚠️ **To zadnje je našla obrnuta provjera:** projekti ove suite počinju na **375 px**, a kriterij
prihvaćanja (§2) imenuje **320**. S namjerno pokvarenim CSS-om tvrdnja je na 375 px **prošla**.
*Brana koja ne posjeti najuži ekran ne čuva najuži ekran* — isti razred kao BUG-029, gdje je
najuži profil bio 375 dok je kriterij govorio 320.

#### Stanje gateova

`preflight` **EXIT 0** · `css:diff` **46 razlika, sve iz gornje rupe alata** · A/B protiv HEAD-a
**0 razlika na 768 i 1280**, 22 na 375 (sve namjera) · phone-brana **8/8 javno, 11/11
prijavljeno** · obrnuta provjera nove tvrdnje **pada s vraćenim naslovom od 48 px**.

#### 9.12.1 Što ostaje, i čije je

Preostalih **8** nalaza tvrdnje ④ nema više nijedan na landingu:

- **4 × `lessons`** — stranica nema nijednu sadržajnu kontrolu jer je kartica lekcije `div` s
  klikom → **BUG-032**, vlastita cigla.
- **4 × `about`** — jedna kontrola, na `y ≈ 1500`. *(Tada je čekalo Leonovu odluku; presudio
  je 2026-08-22 da je **kvar**, i pala su s ciglom `about` — **§9.14**. Mjerenje je ondje
  pokazalo da kontrola nije bila na `y ≈ 1500` nego na **y = 1411**, i da je jedina na cijeloj
  stranici.)*

---

### 9.13 T6 — editor s posjetiteljeva puta (isporučeno 2026-08-24)

> ✅ **STANJE:** puna suita **437 / 0 palo / 72 preskočeno (23,5 min)**, `preflight` EXIT 0.
> Sedam padova iz prvog prolaza bilo je u **testnoj instalaciji**, ne u proizvodu; popravak je
> otišao u **helpere** (`publishSections` otvara editor, `rmNode` se vraća u aplikaciju), ne u
> pojedine testove. Brojka se poklapa: 430 + 7 = **437**.

**Zadnja cigla faze TELEFON.** Leonova odluka (2026-08-22) bila je najveća od ponuđenih:
editor ne dobiva lijeno učitavanje nego **vlastitu stranicu**.

#### Isporuka, u brojkama

| | prije | poslije |
|---|---|---|
| posjetiteljev put, mrežom (gzip) | **234 KiB** | **164 KiB** ✅ ispod budžeta od 200 |
| posjetiteljev put, sirovo | 755 KiB | 519 KiB |
| skripti u `index.html` | 41 | **36** |
| editorskih datoteka na putu | 7 | **0** |
| stranica editora | — | 27 skripti · 152 KiB mrežom (plaća ju tko u nju uđe) |

#### ⚠️ Nalaz koji je promijenio mjeru: „3,7× preko budžeta" bilo je u krivoj jedinici

Plan (§9.3) je T6 opisao brojkom *„744,6 KiB … vlastiti budžet 200 KB → 3,7×"*. Ta je brojka
izmjerena na **sirovim** bajtovima, a budžet dolazi iz Lighthouse-postavke iz F1, koja mjeri
**prenesene** bajtove — dakle komprimirane. U ispravnoj jedinici zatečeno stanje nije bilo
3,7× nego **1,17×**, a sam izlazak editora spušta ga **ispod** budžeta.

*Brojka može biti točna i svejedno savjetovati krivo ako je u krivoj jedinici* — isti razred
greške kao `palette:breakdown` (ondje je agregat mjerio točno, a preporučivao pet cigli umjesto
jednog popodneva). Zato `check:budget` mjeri **prijenos**, a sirovo i dalje **ispisuje**: ono
mjeri koliko preglednik mora parsirati, ali ne odlučuje.

#### Rez nije išao po datoteci nego KROZ nju

Sonda je oborila pretpostavku „sedam editorskih datoteka" **prije ijednog retka koda**:

- **`admin.js` se nije dao preseliti cijel.** U njemu je, uz uređivanje, živjelo i „jesi li ti
  admin" — a to aplikacija treba i kad editora nema, jer o tome ovisi otkrivanje jedine
  `.admin-only` kartice (`js/profile.js`). Rez je zato prošao kroz datoteku: **`js/admin-reveal.js`
  (3,2 KiB) ostaje, `js/admin.js` (42,8 KiB) seli.**
- **`js/node-images.js` ostaje u aplikaciji** — traži ga `js/blocks-renderer.js` (potpisani URL-ovi
  slika u vlastitom materijalu), dakle **studentov put učenja**, ne editor.
- **`initTheme()` je izašao iz `js/init.js`** u `js/theme.js`: `init.js` nije „boot" nego **boot
  aplikacije** (dvanaest inicijalizatora landinga, browsea i rutera), a editoru treba tema, ne
  aplikacija. Kopija bi se razišla pri prvoj sljedećoj temi.

*Dokaz da se pri cijepanju ništa nije izgubilo bio je brojanje kodnih redaka (bez komentara)
stare datoteke protiv zbroja dviju novih: **700 prije, 700 poslije**, s točno jednom
namjeravanom razlikom.*

#### ⚠️ Stranica editora rješava problem koji je K1 NAMJERNO izbjegao

`js/navigation.js` i danas nosi obrazloženje zašto editor **nema rutu**: *„deep-link na `#/admin`
pokazao bi prazan admin bilo kome tko zna adresu"*, jer na hladnom startu sesija još nije
razriješena. Vlastita stranica **jest** takva adresa — pa se problem više ne izbjegava nego se
rješava: `js/editor-page.js` ne pokazuje editor dok identitet nije poznat, a nerazriješen
identitet vodi natrag u aplikaciju.

**Vlasništvo se NE čita iz adrese.** `?node=` nosi samo ID; ime materijala dohvaća se iz baze,
gdje ga RLS izda isključivo vlasniku — pa je **jedan upit ujedno i identitet i provjera**, a
prazan odgovor je odgovor *„nije tvoj"*. Da ime stiže URL-om, stranica bi tuđem linku vjerovala
na riječ i ispisala tuđi tekst u vlastito sučelje.

#### 🐞 Tri kvara koja je našla TVRDNJA, ne čitanje koda

1. **`navigateTo` nije bila navigacija nego SPOJ** — „nacrtaj stranicu" pa „pokaži je"
   (`navigation.js`, crtač ide prvi). Prvi prijevod na novoj stranici uzeo je samo drugu
   polovicu, pa se sekcija palila **prazna** — dakle točno stanje protiv kojeg čuvar postoji,
   samo kroz druga vrata. *Prijevod koji prenese pola poziva gori je od nijednog: pozivatelj
   misli da je uspio.*
2. **Gumb „natrag" bio je vezan unutar `poruka()`** — dakle **samo kad čuvar odbije**. Sidro
   `var b = byId('edGuardBack')` postoji dvaput, a skripta koja ga je tražila nije provjeravala
   jedinstvenost. Posljedica je bila tiha: slušač postoji, ali u grani koja se na uspješnom
   putu nikad ne izvrši. Našla ga je sonda mjerenjem *„je li `goBack` uopće pozvan"*, jer je u
   kodu izgledao točno.
3. **Rani `return` u mjeraču telefona** preskočio je `smiriPrikaz()`, pa je brana prijavila
   `320px admin · nijedna dohvatljiva kontrola` za stranicu koja je posve u redu. Bilješka
   nekoliko redaka niže to je **doslovno predvidjela**: *„popravak koji nije generaliziran je
   popravak koji čeka drugu priliku."*

#### ⚠️ Dva gatea nisu vidjela novu stranicu — i to je bio nalaz veći od cigle

Preflight je bio zelen, ali:

| gate | rupa |
|---|---|
| `check:cdn` | **ručni popis stranica** → 5 vanjskih podresursa na `editor.html` (Font Awesome, KaTeX ×2, DOMPurify) stajalo je **neprovjereno**, uz uredno *„svi vanjski podresursi pinani i pod SRI"*. Popis je pritom nosio **vlastito upozorenje** da će zastarjeti. |
| `check:tailwind` | `BUNDLE_PAGES = ['index.html']` → stranica preskočena u dvije provjere; utility napisan ondje Tailwind **ne bi ni generirao** (`@source`). |

Popravak **ne dodaje ime u popis nego briše popis**: obje se liste čitaju s diska
(*bundle-stranica je ona koja bundle doista učitava*). **Brana koja ovisi o tome da se netko
sjeti nije brana nego bilješka.**

#### ⚠️ Prolazna obavijest nije stranica

Brana telefona prijavila je novi nalaz na admin-pregledniku (320 px). Uzrok nije bila nova
stranica nego **`<sokrat-toast>`**: nakon obnove sesije auth javi „prijavljen si", toast na
2,5 s sjedne preko sredine ekrana, a ondje je bila **jedina omogućena** kontrola. Mjerač zato
čeka da obavijest ode — **ali samo do roka**: ostane li vidljiva, mjeri se s njom, jer trajni
pokrivač **jest** kvar (isto načelo kao tvrdnja ⑧ iz T4).

#### Testovi: 19 datoteka, i dvije koje ni na jednom popisu nisu bile

Popis „tko dira editor" napravljen je po selektorima stranice (17 datoteka). Mjerenje je našlo
**još dvije** (`material-authoring`, `node-images`) koje stranicu ne spominju, ali **čekaju
njezine globale** (`window.SokratDraft`) — pa test ne padne s porukom nego **visi do isteka od
dvije minute**. *Ovisnost nije samo „tko spominje" nego i „tko čeka".*

Znanje o tome **gdje editor živi** sada je na jednom mjestu: `tests/helpers/studio-entry.js`
(+ `idiNa()` u oba mjerača). Dotad je isti ulaz bio prepisan sedamnaest puta.

**`tests/admin.spec.js` je prepolovljen ODLUKOM, ne padom** (256 → 81 redak). Pet tvrdnji
počivalo je na premisi *„viewer se renderira i bez admin-sesije"*; otkad se do preglednika
dolazi kroz čuvara, ta premisa **ne postoji po dizajnu**. To je **strože** ponašanje: dotad je
svatko mogao pozvati `navigateTo('admin')` iz konzole i dobiti nacrtan preglednik (upis je i
tada branio RLS — mijenja se dubina obrane, ne granica). Gdje je pokrivenost otišla, piše u
zaglavlju same datoteke. Tvrdnja „#admin-page je skriven" zamijenjena je **jačom**: *aplikacija
ga uopće nema*.

#### Brana koja ovo drži: `npm run check:budget`

Dvije provjere, i prva postoji zato što je druga brojka: ① **nijedna editorska datoteka nije na
posjetiteljevu putu** (tvrdnja o **sastavu**) · ② ukupni prijenos ≤ 200 KB (tvrdnja o **težini**).
Bez ①, budžet bi se dao ispuniti i minifikacijom editora — a cigla nije bila „smanji bajtove"
nego *„alat koji posjetitelj nikad ne otvori ne smije mu ni stići"*. U preflightu.

**`sw.js` nosi bilješku zašto `editor.html` NIJE u predmemoriji**: offline ljuska je ono što
student nosi sa sobom, a editor offline ionako ne radi (traži Supabase). Precachirati ga značilo
bi vratiti ga svima kroz druga vrata — i to je ujedno preduvjet faze POLICA (*u ljusku ide
SADRŽAJ, ne alat*).

#### Što je time zatvoreno

**Faza TELEFON je ispunjena** (T0–T6). Usput pada i BACKLOG-stavka *„landing šalje editorski kod
posjetitelju bez računa"*, otvorena od C3 — s tom razlikom da sada ima **gate**, pa se ne može
tiho vratiti.

---

### 9.14 `about` — izlaz sa stranice (isporučeno 2026-08-24)

Zadnja cigla koju je faza TELEFON ostavila za sobom, i jedina koju nije planirao spec nego
**mjerenje**: nakon T6 su u phone-osnovici stajala još **4 nalaza, sva četiri na `about`**.
Leon ih je 2026-08-22 presudio kao **kvar, ne prozu**: *stranica bez ijedne kontrole u prvom
ekranu čita se kao slijepa ulica.*

#### ⚠️ Mjerenje je presudu POOŠTRILO, a zapisani uzrok oborilo

Sonda prije ijednog retka popravka, na 320 / 393 / 430 / 852 px, u **oba** stanja privole:

```
cijela stranica  =  1 kontrola  ·  `mailto:` na  y = 1411 px
dohvatljivih bez skrola: 0  —  na sve četiri širine, s trakom i bez nje
```

Dakle nije bilo „nema kontrole u prvom ekranu" nego **nema kontrole, točka** — jedina je bila
`mailto:` dva i pol ekrana niže, i vodila je IZ aplikacije, ne u nju.

**Zatečeni nalaz je pritom optuživao krivoga.** Poruke u osnovici glasile su
`320px about · kromo 159 px + banner 129 px (23 %)`, pa su se čitale kao problem KROMA i
cookie-trake. Mjerenje s već odbijenom privolom daje **istih 0**. To je isti razred greške koji
je T4 već platio i zapisao: *nalaz koji nešto imenuje nije time i optužio to* — format poruke
ispisuje visinu trake kad god traka postoji, ne kad je kriva.

#### ⚠️ Drugi kvar nije bio zapisan nigdje: stranica nije imala JEZIK

`about` je imala **nula `data-i18n` atributa**. Cijeli tekst — misija, „Created by students, for
students", opis platforme — bio je zakucan engleski, pa je korisnik s prekidačem na 🇭🇷 dobivao
englesku stranicu.

T4 je **isti kvar** našao na cookie-traci i zapisao pouku („zakucani engleski je dug koji se
plaća kasnije"), ali ju je zapisao kao **anegdotu o jednoj traci**. Nitko nije prebrojao ostale
površine, pa je druga čekala pet dana. Zato tvrdnja ③ nove brane ne mjeri prijevod nego
**SASTAV**: svaki element koji nosi vlastiti tekst mora imati ključ, uz izričit i kratak popis
izuzetaka (vlastito ime, e-adresa). Prijevod je ishod; sastav je svojstvo.

#### Treći: zadnje preživjelo zaglavlje razine

`header.about-header` bio je jedini koji je preživio K2b — i bio je isti čisti duplikat koji je
T2 uklonio drugdje (mrvica „O nama", h1 ispod nje „O platformi Sokrat Study"). S njim je otišla
i mrtva protuteža `<div style="width: 44px">`, razmak za gumb „natrag" kojeg K2b nema — usput
**jedini inline `style` na stranici**, dakle jedna prepreka manje za CSP u C6. Naslov ostaje
`visually-hidden`: stranica ga mora imati za čitač ekrana, ne mora dvaput na ekranu.

#### Kako je izveden izlaz

**Dvoja vrata, ravnopravno (ADR-029), na POSTOJEĆIM kukama.** `.start-trigger` veže `init.js`,
`[data-goto-materials]` je delegiran u `navigation.js`, a tekst dolazi iz **istih ključeva** kao
vrata na landingu (`door.study.t` / `door.make.t`). **Nula redaka novog JS-a i nijedan drugi
izvor istine** — da su vrata dobila vlastite rukovatelje, `about` i landing bi se razišli isti
dan kad se promijeni odredište (K2a je tu cijenu već platio).

⚠️ **Slaganje je namjerno DETERMINISTIČKO, ne „lijepo".** `flex-basis: 12rem` znači da dva gumba
traže 394 px, a `.about-content` ih na telefonu ima najviše 382 → u portretu je **stupac**, u
polegnutom **red**, bez ijednog medijskog upita. Pri basisu od 10rem bi na 393 px preostalo
**15 px = 4 % širine**, a projekt je već platio pouku da tvrdnja s ~4 % rezerve mjeri **sreću**,
ne ispravnost (Linux crta ista slova ~4 px šire od Windowsa).

⚠️ **Znak je opet bio KONSTANTA na varijabilnom prostoru** — točno kvar iz T5. Ljestvica veličine
znaka mijenja se stepenasto po **ŠIRINI**, pa je 852 × 393 po širini „desktop" i dobivao je znak
od **150 px na ekranu koji za cijeli prvi ekran ima 274 px**. Rez je `@media (max-height: 700px)`
(isti prag koji T3 već koristi za `--topbar-h`) → 72 px. **Selektor nosi `#about-page` namjerno:
medijski upit ne dodaje specifičnost** (K4a), a pravila u `responsive/06` gađaju golu klasu — bez
id-a bi ovo bilo mrtvo slovo na svakom ekranu širem od 768 px, dakle točno ondje gdje treba.

#### 🐞 Nalaz VEĆI od cigle: dokument nije deklarirao jezik kojim je pisan (**BUG-033**)

Funkcionalna sonda (postoji jer tvrdnja ③ mjeri sastav, ne ishod) pokazala je hrvatski tekst pod
`<html lang="en">`. Uzrok: pri **učitavanju** se zvao goli `applyTranslations()`, a atribut
postavlja jedino `setUiLang`, koju boot nije zvao. Posljedica nije bila lokalna za `about` nego
**globalna**: tko je jednom odabrao 🇭🇷 dobivao je hrvatski tekst pod engleskom deklaracijom na
**svakoj stranici i pri svakom posjetu**, dok god ponovno ne pritisne prekidač. Čitač ekrana tada
hrvatske rečenice izgovara engleskim glasovima (WCAG 3.1.1).

⚠️ **Zašto to nijedan gate nije mogao vidjeti:** axe provjerava da `lang` **postoji** i da je
**valjan** jezični kod. `en` je oboje — samo nije istina. Isti razred kao tinta na pločicama
(cigla B): pravilo je bilo ispravno, ali ga nijedna mjera nije uspoređivala sa **stanjem**.
Popravak je u bootu (`setUiLang(uiLang, false)`); tvrdnja je u `tests/i18n.spec.js` jer je
činjenica app-wide, a ne o stranici `about`, i obrnuto je provjerena (`Expected "hr",
Received "en"`).

#### 🐞 Greška koju sam napravio u samoj brani, i koju je uhvatila obrnuta provjera

Prva verzija helpera `otvori()` čekala je `.about-actions` — dakle **točno ono što tvrdnja ①
mjeri**. Protiv zatečenog stanja je zbog toga padala na `TimeoutError` umjesto na „0 dohvatljivih
kontrola": crveno **jest** bilo, ali je govorilo o brani, ne o stranici. To je doslovno pouka
zbog koje T0 postoji — *čekanje ne smije pretpostaviti ishod mjerenja* — i ponovljena je pet
cigli kasnije. Nakon prelaska na čekanje-da-se-crtanje-smiri obrnuta provjera govori brojkama:
`Received: 0` za ①, `+ Received + 14` za ③.

Iz istog razloga tvrdnja ② sada **tvrdi postojanje vrata prije nego ih klikne**: bez toga bi
njihov nestanak izašao kao `page.click: Test timeout` nakon dvije minute.

#### Mjere

| | prije | poslije |
|---|---|---|
| kontrola na stranici | 1 (`mailto:`, y = 1411 px) | 3 |
| **dohvatljivih bez skrola** | **0** na sve 4 širine × oba stanja privole | **2** na sve 4 × oba |
| `data-i18n` na stranici | **0** | 15 |
| inline `style` | 1 | 0 |
| naslov | dvaput na ekranu | jednom (mrvica) + `visually-hidden` h1 |
| `check:palette` | 126 | **125** (indigo glow → `--shadow-e2`) |
| **phone-osnovica** | 4 | **0 — i time PRVI PUT PRAZNA** |

`css:diff` prijavljuje 27 razlika i **sve do jedne sjede na `#about-page`** (te na `body`, jer je
stranica narasla). To je odgovor na jedino pitanje koje alat ovdje može odgovoriti — *je li CSS
procurio drugamo* — dok su same razlike na `about` neupotrebljive iz razloga koji je zapisao T5:
alat presreće **samo stylesheet**, a HTML uzima iz radnog stabla, pa je referenca stranica koja
nikad nije postojala (novi gumbi pod starim CSS-om = goli gumbi preglednika).

#### Nova brana

**`tests/about.spec.js`** — pet tvrdnji: ① izlaz bez skrola na **320 px**, u oba stanja privole ·
② vrata stvarno vode u katalog i u vlastito gradivo · ③ nijedan tekst nije zakucan · ④ naslov
postoji za čitač ekrana ali ne stoji dvaput (T2) · ⑤ obrnuta provjera. Vrti se na 320 px
izričito, jer projekti suite počinju na 375 i projekt je to već dvaput platio (BUG-029, T5).

#### Što je ostalo, i namjerno nije dirano

Tekst stranice opisuje platformu kao mjesto koje **dijeli gotovo gradivo**, bez ijedne rečenice o
tome da korisnik smije napraviti svoje — što se s ADR-029 („UGC je glavni proizvod") ne slaže.
To je **Leonova površina i njegova odluka**, ne nusprodukt cigle; zapisano u `BACKLOG.md`.

---

### 9.15 Predstavljanje — jedna priča na tri mjesta, i SEO-temelji (isporučeno 2026-08-24)

Nastavak §9.14, i to na Leonov nalaz: *„tekst koji predstavlja stranicu se definitivno mora
promijeniti… mislim da bi trebali napravit dobar sem i seo da bude više uočljiva."*

#### ⚠️ Dvije Leonove primjedbe bile su ISTA stvar

Cigla `about` je popravila tekst **na stranici**. Ali isti opis živi i u `<head>`-u, i ondje je
bio gori — ovo je `meta description` koji je Google **stvarno čitao**:

> „Free interactive exam prep for **FMTU Opatija — Hospitality Management**…"

Isto u `og:description` i `twitter:description`. Dakle **cijela stranica** — ne samo `about` —
govorila je tražilicama da je skripta za jedan smjer jednog fakulteta, dok ADR-029 kaže da je
UGC glavni proizvod. *Proizvod je otišao naprijed, a opis je ostao.* Isti kvar u četiri sloja.

#### Leonova odluka o smjeru

Ponuđena su tri smjera s gotovim tekstom. Izabrano:

- **B — „Oboje, ravnopravno"**, koji prati ADR-029 kakav danas stoji: gotovo gradivo i vlastito,
  u istoj rečenici, bez obećanja koje proizvod ne pokriva.
- **Javni opis ostaje ENGLESKI** (kao dotad), iako je stvarna publika hrvatska. Zapisano kao
  Leonova odluka, ne kao previd — hrvatski opis bi bolje pogađao hrvatske upite.

#### Što je izvedeno

| | prije | poslije |
|---|---|---|
| `<title>` / `description` / OG / Twitter | tri **različita** teksta, svi FMTU-only | jedan tekst, mehanički provjeren |
| `og:image` | `icon-512.png` — **kvadratna ikona 512×512** | `og-cover.png`, **1200×630**, generirana |
| `robots.txt` | **ne postoji** | postoji, imenuje sitemap |
| `sitemap.xml` | **ne postoji** | **generiran s diska** (5 indeksabilnih stranica) |
| JSON-LD | **0** | `EducationalOrganization`, minimalan i istinit |
| `meta keywords` | FMTU popis | **obrisan** |
| brana nad `<head>`-om | **nijedna** | `npm run check:seo`, u preflightu |

⚠️ **`meta keywords` je OBRISAN, ne ažuriran.** Google ga ignorira od 2009., a zatečeni je
nabrajao FMTU predmete — dakle polje koje nitko ne čita, a govori krivo. Zadržati ga značilo bi
peto mjesto koje se mora sinkronizirati bez ijedne koristi.

⚠️ **Popis stranica u sitemapu se ČITA S DISKA.** Ručni popis bi prva nova stranica pregazila —
projekt je to pravilo već platio dvaput u T6 (`check:cdn` i `check:tailwind` nisu vidjeli
`editor.html`). *Brana koja ovisi o tome da se netko sjeti nije brana nego bilješka.* Iz istog
razloga `editor.html` **ne ulazi** u sitemap: skener ga izuzima jer nosi `noindex`.

⚠️ **`robots.txt` NAMJERNO ne zabranjuje `editor.html`**, iako bi to zvučalo opreznije.
`Disallow` zabranjuje **obilazak**, pa robot nikad ne pročita `noindex` — i stranica može ostati
u indeksu. *Zabrana obilaska i zabrana indeksiranja tuku se*; brana to izričito provjerava.

#### Kartica se GENERIRA, ne crta

`scripts/build-og-image.js` renderira 1200 × 630 u Chromiumu koji ionako imamo za testove, a
boje čita iz `css/tokens.static.css` i tekst iz `js/i18n.js`. Ručno nacrtana slika bila bi
**četvrta kopija palete i peto mjesto s tekstom**, i razišla bi se prvi put kad se promijeni
tema. ⚠️ PNG je ipak **zamrznut u trenutku generiranja** (font se ne ugrađuje → na Windowsu
Segoe UI, na macOS-u SF), pa se **commita**: posjetitelj vidi bajtove iz repozitorija.
Traži preglednik → **nije u preflightu**; to da je kartica ispravnih dimenzija mjeri
`check:seo` nad **datotekom**. *Gate mjeri artefakt, ne alat koji ga radi.*

#### 🐞 Dvije greške koje sam napravio, obje uhvaćene gledanjem, ne čitanjem

1. **Podnožje kartice bilo je `position: absolute`** → kad se podnaslov prelomio u tri retka,
   **prošao je kroz njega**. Apsolutni element ne sudjeluje u rasporedu, dakle ne može ni biti
   odgurnut. *Kvar se ne bi vidio da nisam otvorio samu sliku* — kod je izgledao ispravno.
2. **Backtick unutar template-literala.** Komentar u CSS-u je sadržavao `` ` `` i zatvorio
   literal. Ista obitelj greške koju projekt već ima zapisanu za shell-nizove; ovdje je bila u JS-u.

#### ⚠️ Mina koju je trebalo izbjeći

**Nijedna nova rečenica ne smije nositi broj predmeta.** Jedini ručno pisan broj u projektu je
statični fallback u vratima landinga i njega čuva `npm run verify` (§7.13); svaki drugi bi tiho
ostario — landing je taj razred greške već imao **na produkciji** (pisao 17 kad ih je bilo 22).
Zato tekst kaže „ready subjects across several programmes", a ne brojku.

#### Što NIJE napravljeno, i zašto — bez toga je popis nepošten

- **Prave adrese umjesto hash-ruta.** Danas je indeksabilno **5 stranica**, a 24 predmeta žive
  iza `#/subject/…`, što tražilica ne indeksira kao zasebne stranice. To je **arhitektonska
  odluka**, ne cigla. ⚠️ I dio te rasprave je **već presuđen**: ADR-028 kaže da je glavni
  argument za SSR bio dijeljeni materijal, ali da je doseg dijeljenja presuđen kao **link s
  tajnim tokenom, bez javne biblioteke** — dakle korisničko gradivo **po dizajnu nije javno
  pronalažljivo**. SEO time može doseći samo katalog i marketinške stranice, što nagradu čini
  bitno manjom nego što zvuči.
- **SEM (plaćeno oglašavanje).** Odluka o budžetu, ne o kodu, i ide zadnja: frontend je
  nedovršen (C4–C7, POLICA), pa bi plaćeni promet dolazio na gradilište.
- **`Course` shema po predmetu.** Traži da predmet ima vlastiti URL — dakle čeka gornju odluku.
  Namjerno izostavljena, uz komentar u `index.html`, umjesto da se doda shema koja opisuje
  stranice koje ne postoje.

#### Nova brana

**`npm run check:seo`** (u preflightu, bez mreže i bez preglednika) — sedam provjera: sitemap se
poklapa s diskom · robots imenuje sitemap i ne zabranjuje `noindex` stranicu · `<head>` ima pun
set · duljine naslova i opisa · **`og:title` == `<title>`** i **`twitter:description` ==
`description`** · `og:image` postoji i jest 1200×630 · JSON-LD **parsira**.
`--write` regenerira sitemap (obrazac `check:palette --update`).

Tvrdnja o „jednoj priči" postoji jer je zatečeno stanje imalo **tri različita opisa** koji su se
pri svakoj izmjeni razilazili još malo. Provjera da JSON-LD **parsira** (a ne samo da postoji)
postoji jer tražilica neispravan blok **tiho odbaci** — pa bi „ima ga" prolazilo i nad pokvarenim.
Obrnuto provjerena: podmetnuti `icon-512.png`, razići `og:title` i pokvariti JSON-LD → sve tri
padnu s točnom porukom.

---

### 9.16 Priprema za ono što dolazi — zatečeno stanje i tri zamke (2026-08-25)

> Sesija u kojoj je pisano ovo nije radila ni jednu ciglu proizvoda: Leon ju je posvetio
> **dokumentaciji za daljnji rad**. Ovaj odjeljak postoji da sljedeća cigla ne počne od
> brojki starijih od tri tjedna.

#### Brojke se od danas MJERE, ne prepisuju

Tablica §3 je nosila *„`subject-selector.css` (**49 `!important`**)"* i *„`responsive/*`
(6 datoteka, **40 `!important`**)"*. Izmjereno danas: **47** i **35**. Nijedna nije bila kriva
kad je napisana — promijenile su ih C1–C3, a proza se ne održava sama.

**→ `npm run css:debt`** ispisuje po cigli: koje datoteke, koliko redaka, koliko `!important`
(izvan komentara). Read-only, **nije gate** — brojka koja se smije mijenjati u oba smjera je
mjera, ne tvrdnja.

**Zatečeno na dan pisanja: 8 032 retka i 106 `!important`** u metama C4–C7.

#### ⚠️ Zamka 1 — dug NIJE ondje gdje ga tablica sugerira

Mjerenje mijenja redoslijed rizika: **C5a, C5b i C6 imaju NULA `!important`.** Cijeli taj dug
sjedi na **tri mjesta**: `subject-selector.css` (47), `css/responsive/*` (35) i
`components.css` (21). Dakle:

> ⚠️ **AŽURIRANO 2026-08-29 (C4a):** prvo od ta tri mjesta **više ne postoji** —
> `subject-selector.css` je obrisan, pa je s njim otišlo **47 od tadašnjih 106** `!important`.
> Zaključak ispod — da je **C4 jedina cigla kojoj je rat specifičnosti stvaran problem** —
> time **prestaje vrijediti**: C4 ih danas ima **2**, a gotovo sav preostali dug je u **C7**.
> Brojke mjeri `npm run css:debt`, ne ova proza.

- **C4 je jedina cigla kojoj je rat specifičnosti stvaran problem**;
- za C5a/C5b/C6 rizik nije kaskada nego **paleta i markup** (`check:palette`,
  `palette:breakdown`, tvrde zabrane iz §7.7/§7.9);
- **C7 je najveći komad** i to ne zbog `!important` nego zbog **2 330 redaka u `responsive/*`**.

*Cigla se ne planira po imenu duga nego po njegovoj mjeri.*

#### ⚠️ Zamka 2 — `css:diff` je slijep za ono što C4–C7 rade

Presreće **samo stylesheet**, a HTML uzima iz radnog stabla. Cigla koja seli vrijednost **iz
markupa u CSS** (a to je definicija ovih cigli) dobiva referencu koja **nikad nije postojala**:
novi markup + stari CSS. T5 je zbog toga vidio **46 razlika** i na širinama gdje se ništa nije
promijenilo.

**Dok alat ne dobije `--ref`, dokaz se izvodi pravim A/B-om:** `HEAD` poslužen iz zasebnog
`git worktree`-a na drugom portu, obje verzije sa **svojim** markupom i **svojim** CSS-om.
U T5 je to dalo **0 razlika na 768 i 1280 px**, a 22 na 375 — i sve namjera.

#### ⚠️ Zamka 3 — brane su strože nego kad je faza počela

Cigla koja to ne zna izgubit će sat vremena na „neobjašnjiv" crveni gate:

- **phone-osnovica je PRAZNA** — brana traži **nulu**, a ne „ne gore nego jučer".
- **`check:budget`** mjeri posjetiteljev put: **nijedna editorska datoteka** + ≤ 200 KB
  prenesenih skripti. Novi `<script>` na `index.html` pada ovdje, ne u pregledu koda.
- **`check:safearea`** zabranjuje goli `env()` izvan `css/variables.css`.
- **`check:docs`** od danas ima i **budžet `CLAUDE.md`-a** i **duh-datoteke**.
- **`check:seo`** traži da `<title>`/`og:`/`twitter:` ostanu **jedan tekst** — cigla koja dira
  landing mora promijeniti **sva četiri mjesta ili nijedno**.

#### ➕ Što je C5a naslijedila poslije (2026-08-25)

Cigle **D1/D2** (dopune) su u `css/fill-blanks-section.css` ostavile **polje U REČENICI**
(`.fill-blank-input`, isprekidana crta u akcentu, `is-ok`/`is-bad`). C5a to **prepisuje zajedno s
ostatkom** — ne kao zaseban posao. Uz to ondje i dalje čeka **① boja mijenja samo rub**
(`BACKLOG.md` §EDITOR): tinta je 10 %, kod kartica ispune **nema**, a alat za čitljiv tekst na
punoj tinti (`--color-on-tint-*` + `tests/tint-ink.spec.js`) **već postoji**.

#### Što je odlučeno, a što nije

**Odlučeno:** redoslijed **POLICA (P1–P4) → C4 → C5a → C5b → C6 → C7**; K4 se utapa u P2;
K5 čeka i ne blokira.
**Nije odlučeno i ne planira se prešutno:** birač tema, OAuth (A0+A1), self-host Supabase,
prave adrese umjesto hash-ruta, SEM. Popis s izmjerenim brojkama je u `CLAUDE.md` §Otvoreno
i u `BACKLOG.md`.

> ⚠️ **TRI OD PET SU PRESUĐENE 2026-08-30** — ovaj odlomak ostaje kao zapis stanja tog dana:
> **① self-host Supabase** → radi se **odmah**, i to **samo backend** (Vercel ostaje).
> ⚠️ **Ispravak istog dana:** prvo je zapisano da se faza *„pauzira nakon C5a/2"*; Leon je to
> poslijepodne ukinuo (*„krenimo sa daljnjom C radnjom za frontend… VPS ću ja sutra setupat"*).
> **Seoba i cigle teku USPOREDO** — ne dijele nijednu datoteku. **② birač tema** → ide s
> ciglama, najranije **nakon C6** (10 fatalnih pravila — od C5b/0; razlaganje u `BACKLOG.md`).
> **③ A0+A1** → **poslije seobe**, jer je auth Supabase-konfiguracija. Ostaje neodlučeno:
> **treba li OAuth uopće**, i prave adrese/SEM.

### 9.17 ✅ FAZA „POLICA" JE OTVORENA — mjerenje joj je promijenilo prvu ciglu (2026-08-26)

Leon je presudio redoslijed: **POLICA (P1–P4) prije C4**. Do te riječi je zapis proturječio
sam sebi — §9.16 je tvrdio da je redoslijed odlučen, `CLAUDE.md` da nije. Rečenica u
`CLAUDE.md`-u bila je zastarjela i ispravljena je.

#### Zašto POLICA, a ne C4 — tri mjere

**① Na landingu već stoji obećanje koje ne isporučujemo.** [`index.html:460`](../../index.html#L460)
piše *„Radi offline"*. Izmjereno u `sw.js`:

- `activate` briše **svaki** keš čije se ime ne poklapa s trenutnim `sokrat-cache-<SW_VERSION>`;
- `SW_VERSION` se mijenja na **svaki** `npm run bump`, dakle svaki deploy;
- URL gradiva nosi `?v=CONTENT_VERSION`, koji se bumpa **istim potezom**.

Keširano gradivo time promašuje **dvaput** — obrisan keš *i* drugi ključ — i to na svaki
deploy. Precache je točno **4** datoteke (`/`, `index.html`, bundle, manifest), pa ostane
ljuska bez gradiva. *Offline danas radi za predmet koji si već otvorio, i to do sljedećeg
deploya.* To nije rupa u planu nego točno ono što P3 opisuje — sad ima mjeru.

**② POLICA ne ovisi o C4.** Provjerena je (i pala) pretpostavka da bi P2 „ista pločica"
morala čekati katalog: `js/my-materials.js` koristi `mm-*` imena i ima **nula** pojava
`subject-card`/`subject-btn`. Polica i katalog su **već odvojeni sustavi**, pa se P2 gradi
na već migriranoj polici. *Ovisnost koja se ne izmjeri postane izgovor za redoslijed.*

**③ Skidanje je jeftino.** Cijeli `data/json` = **6,5 MB** za svih 24 predmeta; najveći
pojedinačni (`accounting`) = **532 KB**. `check:budget` ima **31,6 KiB** zalihe za modul.

#### Što je mjerenje reklo o SADRŽAJU skidanja

Svih **24** predmeta ima `dataFormat: 'json'`, a u `data/json/**` je **nula** vanjskih
(`http`) slika. Skinuti predmet je time **samodostatan**: JSON-ovi study-sadržaja + sve iz
`content.codeScripts` (vježbe i lib).
⚠️ **Za osobni materijal to NE vrijedi** — njegove slike žive u Storage bucketu `node-images`
i cross-origin su, pa ih SW uopće ne presreće (`url.origin !== self.location.origin` → izlaz).
Kad P2 spoji dva izvora, to je razlika koja se mora izreći korisniku, ne prešutjeti.

#### Odluka o mjestu keša — i cijena koja ide s njom

Skinuto ide u **`sokrat-offline`**, keš **bez verzije u imenu**. Nije stilski izbor:
`activate` briše po prefiksu `sokrat-cache-`, pa neverzionirano ime **preživi deploy samo po
sebi**, bez ijedne izmjene u brisaču — dakle bez dodirivanja SW-a u P1.

Cijena je obrnuta i mora biti izrečena: takav keš **ne zastarijeva sam**. Zato P1 uz svaki
predmet pamti `CONTENT_VERSION` s kojim je skinut, a **P3 odlučuje što s neslaganjem**
(osvježiti tiho ili ponuditi). Bez tog zapisa bi P3 morao pogađati.

⚠️ **P3 dira Service Worker i vozi se ZADNJI.** Loš SW zna zaključati stranicu u polju;
kill-switch je `__swKill()`. **P1 i P2 ne diraju `sw.js` ni jednim retkom.**

### 9.18 ✅ P1 + P2 SU ISPUNJENI — polica ima dva izvora (2026-08-26)

**P1 — što se skida.** `js/offline-store.js` (`window.SokratOffline`) + kontrola na stranici
predmeta. Skida se **cijeli** predmet: study-JSON-ovi **i** `content.codeScripts` (vježbe + lib),
jer predmet s vježbama bez njih offline ne radi cijel (BUG-012).

**P2 — gdje živi.** `#materials-page` dobiva **drugi izvor**: pločice skinutih predmeta, ime iz
kataloga, veličina, stanje učenja, poveznica na **pravu adresu** (`#/subject/<id>`) i uklanjanje.
**Ovime je K4 potrošen** — „materijali u kvaliteti kataloga" i „jedna polica, dva izvora" su isti
ekran, i sad ga ima.

#### ⚠️ Odluka koju je P2 morao donijeti, a spec ju nije predvidio

Do P2 je `#materials-page` **odjavljenom pokazivala isključivo poziv na prijavu**
([`my-materials.js:801`](../../js/my-materials.js#L801)) — što je za vlastito gradivo ispravno
(ono živi u bazi, iza RLS-a). **Ali skinuto je stvar UREĐAJA, ne računa.** Polica koja bi ga
sakrila iza prijave lagala bi o tome čije je.

Zato od P2 stranica nosi **dvije plohe s različitim uvjetom**: polica se crta **uvijek**, poziv na
prijavu i dalje stoji uz **vlastito gradivo**. To je najvažnija tvrdnja u `tests/shelf.spec.js` —
ostale mjere izgled, ova mjeri **čije je što**.

#### Tri odluke o izvedbi, s razlogom

- **Kôd P2 je u `offline-store.js`, ne u novoj datoteci.** `check:budget` mjeri posjetiteljev put,
  a zaliha je bila 26,8 KiB; nova skripta plaća se zahtjevom, ne samo bajtovima.
- **Pločica ne posuđuje ni `mm-*` ni `subject-card`.** Prvo je stablo s vlastitim ponašanjem,
  drugo je meta cigle C4 s **47 `!important`**. *Posuditi bilo koje značilo bi vezati novu površinu
  za tuđi dug — a §3 traži da površina bude cijela nova ili cijela stara.*
- **Napredak se NE prikazuje kao postotak.** Čita se isti zapis koji piše `js/storage.js`
  (`storageKey` iz kataloga), ali nazivnika nema — koliko kartica predmet „ima" ovisi o lekciji i
  modu. Pločica zato kaže **„Zadnje učenje …"** ili **„Još nedirnuto"**.
  *Izmišljen postotak je gori od nijednog.*

#### Što P2 NIJE dirao

`sw.js` — ni jednim retkom. Kriterij faze („otvori skinuti predmet u zrakoplovnom načinu") pripada
**P3**, koja je jedina cigla s pravom na Service Worker i zato ide **zadnja**.

### 9.19 📋 P3 — SPECIFIKACIJA PRIJE GRADNJE (pripremljeno 2026-08-28)

P3 je **jedina cigla faze koja dira `sw.js`**, a to je datoteka koja jedina može **zaključati
stranicu u polju**. Zato joj odluke stoje ovdje **prije** nego se napiše ijedan redak — da se u
sesiji gradi, a ne odlučuje.

#### Zatečeno (izmjereno, ne pretpostavljeno)

- `sw.js` `fetch`: navigacija → network-first; **sve ostalo same-origin GET → stale-while-revalidate**
  preko `caches.match(req)`. Taj poziv pretražuje **SVE keševe**, pa se skinuta datoteka
  **već danas** posluži offline — ali **samo ako se `?v=` točno poklopi**.
- `activate` briše svaki keš osim `sokrat-cache-<SW_VERSION>`; **`sokrat-offline` preživi**
  (P1, namjerno).
- `SW_VERSION` i `CONTENT_VERSION` postavlja **isti** `npm run bump` → u `sw.js` je token kojim
  stranica traži sadržaj **dostupan bez ikakvog dodatnog knjigovodstva**.
- Oprema za dokaz **već postoji**: `tests/sw.spec.js` ima `test.use({ serviceWorkers: 'allow' })`,
  čekanje na `navigator.serviceWorker.controller` i `context.setOffline(true)`.
  *P3 se nakalemljuje na dokazan obrazac, ne gradi harness.*

#### ⚠️ Jedina otvorena odluka — i njezino razrješenje

Poslije deploya stranica traži `…json?v=<novi>`, a u kešu leži `…json?v=<stari>`. Bez odgovora na
to, skinut predmet postane **nevidljiv** — točno kvar zbog kojeg P1 postoji.

**Odluka: dvorazinsko poklapanje u kešu `sokrat-offline`, prije općeg puta.**

| slučaj | ponašanje | zašto |
|---|---|---|
| **točno poklapanje** (`?v=` isti) | **cache-first**, bez mreže | skinuto je aktualno — instant, bez podatkovnog troška |
| **poklapanje samo uz `ignoreSearch`** (drugi `?v=`) | **network-first, pa pad na tu kopiju** | online dobiješ ispravno, offline dobiješ **staro umjesto ničega** |
| **nema poklapanja** | zatečeni stale-while-revalidate | ništa se ne mijenja |

Druga vrsta je cijela poanta: **staro gradivo je bolje od praznog ekrana, ali samo kad mreže
nema.** Odbačena je varijanta „uvijek posluži iz keša": tiho bi servirala zastarjelo gradivo
korisniku koji ima mrežu, i to bez ijednog znaka.

⚠️ **Cijena koja mora na ekran, ne samo u kôd:** zapis svakog predmeta nosi `v` (P1). Kad se
razlikuje od tekućeg, **polica to mora reći** („zastarjelo · osvježi"), inače korisnik ne zna da
uči staru verziju. **To je dio P3, ne dodatak.**

⚠️ **Skriveni rizik koji treba imenovati:** `codeScripts` (vježbe + lib) su **kôd**. Zastarjeli
pack + osvježeni engine = drift koji se ne vidi kao greška nego kao **kriv rezultat**. Zato
`?v=`-neslaganje kod njih ide network-first jednako kao i kod JSON-a — nikad tiho staro.

#### Tvrde granice

1. **`activate` se NE dira.** Brisač po prefiksu `sokrat-cache-` je ono što `sokrat-offline` drži
   živim. Jedna promjena ondje briše svima sve skinuto.
2. **Navigacijski put se NE dira** — ostaje network-first + offline shell.
3. **`/sw.js` mora ostati `max-age=0, must-revalidate`** (`vercel.json`). Bez toga se novi SW ne
   može isporučiti, pa ni ova cigla ni bilo koja buduća. *Ovo je bio i razlog zašto bi seoba
   frontenda tražila header-ugovor prije, ne poslije.*
   ✅ **NEAKTUALNO od 2026-08-30:** seli se **samo Supabase**; **hosting ostaje na Vercelu**, pa
   ovaj ugovor ostaje na snazi neizmijenjen. Zapis: `BACKLOG.md` §SELF-HOST.

#### Kako se dokazuje

- **Postojeći test ne smije puknuti:** `tests/sw.spec.js` (registracija · app-shell offline ·
  update-flow s toastom).
- **Novi test, isti obrazac:** skini predmet → `context.setOffline(true)` → otvori ga → gradivo se
  učita i sva četiri načina rade. **To je kriterij cijele faze POLICA**, i P3 ga jedini može ispuniti.
- **Obrnuta provjera (obavezna):** predmet koji **nije** skinut mora offline **pasti**. Bez toga
  test ne mjeri policu nego opći keš.
- **Mreža za spašavanje:** `__swKill()` postoji. Prije mergea provjeriti da radi **s novim SW-om**.

#### Što P3 NIJE

Ne dira policu kao prikaz (to je P2), ne dira napredak (P4), i **ne uvodi automatsko osvježavanje
skinutog** — to bi trošilo tuđi podatkovni promet bez pitanja. Osvježava se **na dodir**.

### 9.20 ✅ P3 JE ISPUNJEN — skinut predmet preživi deploy (2026-08-28)

Izvedeno **točno po §9.19**: dvorazinsko poklapanje u kešu `sokrat-offline`, prije općeg
puta. Tvrde granice ispoštovane doslovno — **`activate` nije dirnut** (brisač po prefiksu
`sokrat-cache-` je ono što policu drži živom) i **navigacijski put nije dirnut**.

#### Mjera koja je promijenila razumijevanje testa

Prva verzija dokaza tvrdila je *„skinut predmet se offline otvori"* — i **prolazila bi i bez
cigle**. `caches.match(req)` bez `cacheName` pretražuje **sve** keševe, pa se skinuta datoteka
posluži sama od sebe **dok se `?v=` poklapa**. Tek prvi deploy to razbije.

Zato je dodan test koji simulira deploy (ista datoteka, drugi token) i **mutacijski je
provjeren**: uklanjanjem razine ② pada **samo on**, ostalih pet prolazi. *To je jedini test
koji mjeri baš P3, i tako je i zapisano u samom specu.*

#### Dva prava kvara koja su testovi našli — nijedan se nije vidio na ekranu

**① Neuspjelo osvježavanje ostavljalo je manifest koji LAŽE.** `download()` prvo obriše stari
komplet (`ocistiStare`) pa skida novi; padne li novi, rollback počisti keš **ali ne i zapis** →
uređaj prazan, a manifest i dalje tvrdi „dostupno offline". Predmet bi pao **tek u zrakoplovnom
načinu** — točno kvar zbog kojeg P1 postoji, vraćen na mala vrata.
⚠️ **Do P3 nije bio dohvatljiv** (skidalo se samo kad zapisa nema); **osvježavanje ga je
otvorilo**. Komentar u kodu je čak već obećavao *„korisniku ostaje čist uređaj i jasna poruka"* —
poruka nije bila jasna nego lažna. Popravak: rollback briše i zapis.

**② Gumb „Osvježi" bio bi vidljiv UVIJEK.** Zajedničko pravilo daje mu `display: inline-flex`, a
eksplicitan `display` **gazi** UA-pravilo `[hidden] { display: none }`. Atribut je bio postavljen
ispravno i kôd je izgledao točno. Uhvatio test, ne oko.

#### Cijena je na ekranu, ne samo u kodu

`isStale()` sudi po `v` iz manifesta (P1). Oprez ide u **oba** smjera: bez `v` ili bez tekuće
verzije **ne tvrdi se ništa** — lažno „zastarjelo" tjera korisnika da bez razloga potroši mobilni
promet. Stanje se vidi na **oba** mjesta (stranica predmeta + polica), a **osvježavanje je na
dodir, nikad automatsko**.

#### Dokazi

- `tests/offline-study.spec.js` — **6 testova**: kriterij faze (sva četiri načina offline) ·
  **obrnuta provjera** (neskinut predmet offline **padne**) · **poslije deploya** · zastarjelost
  na kontroli · zastarjelost na polici · **nula mrežnih poziva** za skinuto.
- `tests/unit/offline-store.test.js` — **26** (bilo 18): `isStale` u pet rubova, osvježavanje
  poslije deploya, i **neuspjelo** osvježavanje.
- Zatečeno nedirnuto: `sw.spec.js` · `offline-download.spec.js` · `shelf.spec.js` = **12/12**.
  Puna suita na jednom profilu: **99/99**. Preflight **EXIT 0**.

⚠️ **Što P3 NIJE napravio:** ne dira `activate`, ne uvodi automatsko osvježavanje, i **ne
dokazuje se do kraja bez pravog deploya** — lokalno se „deploy" simulira promjenom tokena, što
pokriva logiku ali ne i stvarno isporučen SW.

### 9.21 ✅ P4 JE ISPUNJEN — faza POLICA je ZATVORENA (2026-08-28)

P4 je bio jedini u fazi koji **ne gradi nego dokazuje**: sinkronizacija je offline-first od
F-faze i radi. Ali obećanje faze — *„uči bez mreže"* — ima naličje koje dotad **nitko nije
mjerio**: što se s tim napretkom dogodi kad se mreža vrati.

#### Dva načina da napredak nestane, i oba su tiha

| kvar | posljedica | tvrdnja koja ga hvata |
|---|---|---|
| spajanje preferira **udaljeno** | sve naučeno offline nestane pri prvoj prijavi | ⛔ BEZ GUBITKA · ⛔ OBRNUTO |
| **push** se označi kao obavljen iako je pao | promjena se nikad ne pošalje na drugi uređaj | ⛔ PAD SLANJA |

Nijedan se **ne vidi kao greška**. Korisnik samo jednog dana ima manje nego jučer.

#### Metoda: tvrdnja o SVOJSTVU, ne o rezultatu

Ključni test ne pita *„vraća li spajanje točno ovo"* nego *„može li se išta izgubiti"* — nijedan
brojač ne smije pasti ispod nijedne strane, nijedan naučeni id ne smije ispariti, **i u oba
smjera** (lokalno⊕udaljeno i udaljeno⊕lokalno). Tvrdnja o rezultatu ostari s podacima; tvrdnja o
svojstvu vrijedi za svaki ulaz.

**Mutacijski provjereno**, tri puta: spajanje koje preferira udaljeno obara **5 od 10**; unija
zamijenjena „zadnji pobjeđuje" obara **4**; pomak `snapshot`-a bez uspješnog upserta obara
**točno jedan** — baš onaj koji ga tvrdi.

#### Dvije stvari koje su pale usput

**① Prva verzija testa slanja mjerila je tuđi poziv.** `pullAndMerge()` pri prijavi **sam
postavi `snapshot`** i **sam pošalje** razliku — pa poslije prijave nema „promijenjenog" ključa i
`pushNow()` ne radi ništa. Test je izgledao kao da prolazi kroz put slanja, a nije ga ni takao.
Popravak: napredak raste **poslije** prijave, a klijent ima prekidač umjesto liste odgovora
(redoslijed bi tiho iskliznuo za jedan).

**② Jedini PRAVI dodir u specu je visio.** Na telefonskom profilu je bočni izbornik s predmetima
**dio rasporeda** i prekriva studijski stupac, pa Playwrightova provjera izvedivosti nikad ne
prođe. Klik ide kroz `evaluate`, i to je **zapisano u testu s razlogom**: dohvatljivost kontrola
na telefonu mjeri **phone-gate** (osnovica prazna) — ovdje bi bila **druga kopija iste činjenice**
(ADR-027).

#### Dokazi

- `tests/unit/cloud-sync.test.js` — **10 tvrdnji** (pravila spajanja · svojstvo bez gubitka ·
  pad slanja · povratak mreže ne pregazi lokalno). `mergeValues` je izložen **po istom razlogu
  kao `watchedKeys`**: tvrdnja se iz ponašanja ne vidi bez računa, mreže i čekanja intervala.
- `tests/offline-study.spec.js` — **7** (bilo 6): dodan dokaz da se napredak stečen **bez mreže**
  stvarno zapiše na uređaj. Bez toga bi spajanje bilo besprijekorno nad **ničim**.
- Puna suita **100/100**, preflight **EXIT 0**.

#### ✅ Faza POLICA je zatvorena

P1 skida · P2 pokazuje · P3 poslužuje po pravilu i preživi deploy · P4 dokazuje da se stečeno ne
gubi. **Kriterij faze je ispunjen i mjeren, ne tvrdnjom nego testom.**
⚠️ **Ostaje N2 (pola):** polica pokazuje **skinuto**, a ne uniju skinutog i onoga što se uči.
To nije dug ove faze nego zasebna stavka u `BACKLOG.md`.

---

## 10 · C4 — BROWSE + LEKCIJE

Tablica §3 daje C4 tri datoteke: `browse.css` (327), `subject-selector.css` (495),
`pages.css` (655) — **1477 redaka i 47 od 49 preostalih `!important`**. Mjerenje prije
koda promijenilo je redoslijed posla: **najveći dio te površine nije trebalo migrirati
nego OBRISATI**, pa C4 počinje ciglom koja ne dodaje ništa novo.

### 10.1 ✅ C4a JE ISPUNJEN — mrtva površina odlazi, i vodila je pravu ikonu u nevidljivost (2026-08-29)

#### Mjera prije koda

Pitanje nije bilo „kako ovo migrirati" nego **„koristi li se ovo uopće"**. Mjereno je
koliko klasa iz `css/**` markup, JS, gradivo ili ijedan test **ikad spomene**:

```
    144 od 1068 klasa u cijelom CSS-u ne spominje nitko
    css/subject-selector.css:  39 od 44   ← najgušća koncentracija u repozitoriju
```

Datoteka je nosila **zaslon s dvije ponude predmeta** (`te2`/`ent`, ostatak iz doba kad
je platforma imala dva predmeta) i **STARU `about` stranicu** — markup je i jedno i
drugo izgubio davno prije, `about` još u §9.14.

#### ⚠️ NALAZ KOJI JE PROMIJENIO TEŽINU CIGLE: mrtva datoteka je GAZILA živu

Da je ostalo na mrtvom teretu, ovo bi bilo čišćenje. Nije ostalo. Preostalih **pet**
živih klasa **dupliralo** je `pages.css` (novi `about`, §9.14) — a `css/app.css` je
mrtvu datoteku uvozio **POSLIJE** njega. Specifičnost je jednaka, pa odlučuje
redoslijed: **pobjeđivala je mrtva.**

Posljedica nije bila kozmetička. `.about-card-icon` je iz mrtvog pravila dobivao
`color: white`, a **ispunu koja je tu bjelinu nosila** (`.mission-card .about-card-icon`)
markup više nije imao. Izmjereno u pregledniku, sve četiri teme:

| tema | prije | poslije |
|---|---|---|
| **academic** (zadana) | **1.13** ⛔ | **5.60** |
| **paper** | **1.16** ⛔ | 4.87 |
| chalk | 12.21 | 7.27 |
| mint | 13.05 | 6.38 |

Prag za ne-tekstualni element je **3.0**. **Tri ikone na `about`-u bile su nevidljive u
obje svijetle teme — a zadana tema je svijetla.** Ikona je usput dobila i namjeravanu
veličinu (60 → **45 px**) i boju teme umjesto zakucane bjeline.

#### Zašto ovo nije vidjela nijedna postojeća brana

Nije previd nego **doseg**, i svaki od njih je bio u pravu za ono što mjeri:

- **`check:contrast`** čita **parove tokena** iz `css/tokens.css`. Ovdje bjelina nije
  bila token nego **zakucana vrijednost u modulu** — izvan njegova vidokruga.
- **`check:palette`** traži vrijednosti **stare palete** (indigo/slate). `#ffffff` to nije.
- **`axe`** ukrasnoj ikoni bez teksta **ne mjeri** kontrast — i to je ispravno ponašanje.
- **`css:diff`** uspoređuje granu s `HEAD`-om: kvar je bio **jednak na obje strane**, pa
  razlike nije bilo. *Alat koji mjeri PROMJENU ne vidi zatečeno stanje.*

Jedina mjera koja bi ovo prijavila jest **mrtav CSS** — i prijavila bi ga tjednima prije
nego što je itko pogledao stranicu.

#### Izvedeno

- **`css/subject-selector.css` je OBRISAN**, ne migriran (−495 redaka, **−47 `!important`**).
- **31 pravilo drugdje** koje je gađalo istu mrtvu površinu: `responsive/01` (3),
  `responsive/02` (15), `responsive/03` (1), `responsive/05` (5 + jedan rez selektora iz
  skupine `.subject-card, .lesson-card, .flashcard, .quiz-container`), `browse.css` (2),
  `pages.css` (4) — ukupno **−181 redak**.
- **`#subject-selector.active { display: flex !important }`** iz `components.css`.
- **`.browse-card.is-soon`** (×3) — „coming soon" na browse-kartici **ne postoji**; stanje
  živi isključivo na lekciji kao `lesson-card--soon`, a `.is-soon` je ostatak imena od
  prije preimenovanja.
- **`.lang-toggle` / `.header-lang-toggle`** — gađali su prekidač jezika u tri zaglavlja
  koja je **K2b** spojio u jednu traku.

#### Dokaz da se nije pomaknulo ništa osim namjeravanog

`css:diff` (popravljen u ALAT-1, dakle premota **cijelo stablo**) daje **79 razlika** — i
sve do jedne su unutar `#about-page`, uz `body`/`html` čija se visina mijenja kao
posljedica. Nula razlika na landingu, browseu, lekcijama, učenju, profilu i editoru.

⚠️ **Ta se tvrdnja nije dala izreći postojećim alatom.** `css:diff` je ispisivao **prvih
osam** promijenjenih elemenata i „… i još 19" — dovoljno dok se lovi *nenamjerna* razlika,
ali cigla koja **migrira** površinu mijenja desetke elemenata namjerno, i tada je upravo
taj rep ono što se mora pročitati. Granica je zato postala podesiva: **`CSS_DIFF_ALL=1`**.
Bez toga bi „sve razlike su na `about`-u" bila **procjena, ne mjera**.

#### Nova brana: `npm run check:orphan-css` (čegrtaljka, u preflightu)

Mjeri jedno: **klasu u `css/**` koju ne spominje ni markup, ni JS, ni gradivo, ni test.**
Osnovica `scripts/orphan-css-baseline.json` **imenuje** siročad po datoteci; broj smije
samo padati (`--update`).

**Zašto čegrtaljka, a ne tvrda zabrana:** dio siročadi je legitiman i ne smije se
popraviti brisanjem — `katex-display` dolazi iz KaTeX-a, a `lb-color-*` **sastavlja
`js/block-editor.js` u runtimeu** (`'lb-color-' + token`). Osnovica ih **imenuje**, pa
iznimka postaje vidljiva umjesto da bude nevidljiva.

**Obrnuta provjera (mutacija):** vraćena `.browse-card.is-soon` i `.te2-title` → brana
pada s **izlazom 1** i imenuje točno ta dva imena.

#### ⛔ Brana koja je RAZMATRANA i odbačena MJERENJEM

Kvar je nastao od „ista klasa u dva modula", pa se ta mjera nametala sama. Izmjerena je
prije nego je napisana: **29 pogodaka, od kojih je 28 legitimno** — `.about-page` u
`topbar.css` zbog rasporeda, `.is-error` u dva neovisna modula, `.correct`/`.wrong` u
četiri načina učenja. *Brana koja 28 puta viče krivo nauči te da ju ignoriraš*, pa je
umjesto nje ostala ona koja bi **isti kvar** uhvatila bez ijednog lažnog poziva.

#### Usputni dobitak, jer je dug bio koncentriran

| mjera | prije | poslije |
|---|---|---|
| `css:debt` C4 | 1477 redaka, 49 `!important` | **905 redaka, 2 `!important`** (na dan C4a; živu brojku zna `npm run css:debt`) |
| `check:palette` ukupno | 125 | **103** |
| `palette:breakdown` **FATALNO** | 24 | **18** (pa **11** nakon §10.2 — v. ondje) |
| siročad u cijelom CSS-u | 144 | **81** |

FATALNO je jedini broj koji stvarno blokira **birač tema na landingu** (§ Otvoreno) —
pao je za **četvrtinu** kao nuspojava, bez ijedne odluke o izgledu.

#### 🧭 Tri greške u vlastitom mjerenju, sve zapisane jer se razred ponavlja

1. **Prvi detektor je lagao u 8 od 12 provjerenih slučajeva.** Gradio je granicu riječi
   regexom, a **heredoc kroz alat pojede jednu razinu obrnutih kosih crta** — `\\s` je
   stigao kao `\s`, što u JS-nizu postane obični `s`, pa je **razmak ispao iz
   razdjelnika**. Popravak nije bio bolji regex nego **druga mjera**: izvor se razlomi na
   tokene po svemu što ne može biti dio imena klase, i pitanje postane pripadnost skupu.
2. **`grep -w` je lažno POTVRDIO živu klasu.** Crtica mu je granica riječi, pa
   `landing-subject-card` potvrđuje `subject-card` — a to su dvije različite klase. *Alat
   koji provjerava mjeru mora biti stroži od nje, ne labaviji.*
3. **Složeni selektor nije skupina.** Analizator je znao da `.a, .b` odlazi tek kad su oba
   mrtva, ali je isto pravilo primijenio i na `.lesson-card.is-soon` — a taj je mrtav ako
   je **bilo koji** njegov dio mrtav. Tri pravila su zato preživjela prvi prolaz i našla
   ih je tek nova brana. *Brana je uhvatila propust alata koji ju je trebao učiniti
   nepotrebnom* — što je i cijeli razlog zašto se piše.

#### ⛔ Što C4a NAMJERNO nije napravio

**Nijedan Tailwind utility nije napisan.** C4a samo miče ono što ne smije sudjelovati u
migraciji — po istom presedanu po kojem je **C3 počeo gateom prije migracije** (§7.10).
Prava migracija browsea i lekcija je **C4b** i radi se nad površinom koja je od danas
manja za trećinu i bez ijednog `!important`-a osim dva u `pages.css`.

### 10.2 ✅ POTRAGA ZA KVAROVIMA KOJI SE NE VIDE — jer je prvi nađen SLUČAJNO (2026-08-29)

Kvar iz §10.1 nije našao nijedan gate ni pogled na ekran — ispao je usput, dok se tražilo
nešto drugo. To pitanje se ne smije ostaviti otvoreno: **koliko ih još ima?** Leon je od
tri ponuđena smjera izabrao upravo taj.

#### Dvije mjere, jer je svaka slijepa ondje gdje druga vidi

| mjera | što gleda | što NE može |
|---|---|---|
| **preglednik** (`check:contrast:live`) | izračunate stilove, **4 teme × 11 ruta**, tekst i glif | ne vidi ništa **iza gradijenta** — kontrast se ondje ne da svesti na dva broja |
| **statika** (`check:palette` zabrana #4) | ispunu marke i zakucanu boju u **različitim pravilima** | ne zna što je stvarno na ekranu |

To nije podjela posla nego **nužda, izmjerena**: od devet mjesta s istim kvarom, **sedam**
ih preglednik nije mogao vidjeti jer sjede na gradijentu. *Statička analiza i preglednik
hvataju različite bugove* — nalaz C1 br. 4, treći put potvrđen.

#### 🎯 Razred kvara ima ime: **ispuna i boja teksta odlučuju se na RAZLIČITIM mjestima**

U §10.1 su to bile **dvije datoteke**. Ovdje su **dva pravila**, i to jedno ispod drugoga:

```css
.study-nav-btn.active   { background: var(--primary); color: var(--on-primary); }  /* ispravno */
.study-nav-btn.active span,
.study-nav-btn.active i { color: white; }                                          /* poništava */
```

Ispravno pravilo **postoji** i stoji odmah iznad — pa ga sljedeće poništi na djetetu. Zabrana
#1 to nije mogla vidjeti jer traži ispunu i zakucanu boju **u istom bloku**.

Izmjereno na temi `chalk` (marka je ondje amber `#f2c14e`): **kontrast 1.68** na prekidaču
načina učenja, dakle na najkorištenijem ekranu u aplikaciji.

⚠️ **Ovo je bio LATENTAN kvar, ne živ** — i tu razliku treba držati čistom. Birač tema
**ne postoji u markupu** (`js/init.js` veže klik na `[data-set-theme]`, ali takve kontrole
nema), pa je zadana `academic` jedina dohvatljiva tema, a u njoj je marka plava i bijeli
tekst na njoj prolazi. Kvar iz §10.1 je bio **živ u zadanoj temi**; ovaj postaje živ onog
dana kad birač izađe — a to je opisano kao *posao od jednog popodneva*.

#### Izvedeno — devet mjesta, jedan potez

`color: white` → **`color: inherit`** (dijete preuzima roditeljevu odluku) u
`home-section.css` (2) · `learn.css` (4) · `pages.css` (2); u `quiz-section.css` (1) ide
**`var(--on-primary)`**, jer `.score-circle` **nema vlastiti `color`** pa bi nasljeđivanje
uzelo boju okolnog teksta umjesto boje na ispuni.

**Dokaz da je popravak točno onoliko velik koliko treba:** `css:diff` daje **3393 usporedbe
kroz 3 širine i 0 razlika**. U zadanoj temi se **ne mijenja ništa** — što je i potpis
latentnog kvara: da je bilo razlike, popravak bi bio prevelik.

#### Dvije nove brane, obje obrnuto provjerene

- **`check:palette` zabrana #4** — zakucana boja teksta na **potomku** ispune marke.
  Smije biti **tvrda**, a ne čegrtaljka, jer je izmjereno **0 lažnih pogodaka** na cijelom
  repozitoriju. Mutacija: vraćena bijela → **izlaz 1**, oba selektora imenovana.
- **`npm run check:contrast:live`** — izračunati kontrast u pregledniku, 4 teme × 11 ruta.
  Nije u preflightu (traži preglednik i poslužitelj) — stoji uz `css:diff` i `check:cdn:live`.
  Mutacija: pušten na stanje **prije** §10.1 → **izlaz 1**, i to točno na `1.13`.

#### Usputni dobitak: birač tema je danas prepolovljeno blizu

`palette:breakdown` → **FATALNO** (jedini broj koji stvarno blokira birač tema na landingu):
**24 ujutro → 18 nakon C4a → 11 nakon ovih devet popravaka.** Manje od pola, i to bez ijedne
odluke o izgledu — jer je devet od tih pravila bilo upravo zakucana bjelina na temiranoj ispuni.
⚠️ Brojku mjeri alat; **ova je proza ostarila dvaput u jednom danu** i zato nosi datume.

#### 🧭 Dvije greške u vlastitoj mjeri, obje uhvaćene prije nego su nekoga zavele

1. **Prvo mjerenje je dalo 18 nalaza; sedamnaest ih je bio artefakt.** Promjena teme pokreće
   **prijelaze boje**, a mjerilo se 120 ms poslije — dakle **na pola prijelaza**, pa je
   sonda prijavljivala „sivo na sivom" u temi koja te boje uopće nema. Ista zamka koju je
   **ALAT-1** već platio u `css:diff`: prijelaz se mora **dovršiti**, ne dočekati na sreću.
   *Da je nalaz otišao dalje kakav je bio, potrošili bismo dan na kvarove kojih nema.*
2. **Sonda je lažno optužila `.crumb-sep`** (razmaknicu `›` u mrvici). Taj element **već
   nosi `aria-hidden="true"`** — dakle izričito je proglašen ukrasnim, a WCAG ukrasnom
   sadržaju kontrast **ne mjeri**. Popravak je otišao u **mjeru**, ne u kod.

#### ⛔ Što se NAMJERNO ne tvrdi

- **Oko 530 mjerenja iza gradijenta ili slike je preskočeno** (broj se mijenja s markupom, pa se
  ne prepisuje kao tvrdnja — ispisuje ga sama brana). To je poznata rupa i pokriva ju
  zabrana #4 — ali samo za **ispunu marke**.
- **Semantičke ispune nisu pokrivene, i ondje isti kvar POSTOJI.** Izmjereno na `chalk`:
  bijelo na `--success` = **2.14**, na `--danger` = **3.12**, na `--secondary` = **3.00**
  (prag za tekst je 4.5). Popravak traži **nove tokene** (`--on-success`, `--on-danger`),
  dakle odluku o paleti — ne mehaničku izmjenu. **Leonova odluka**, vodi se u `BACKLOG.md`.
- **Jedna imenovana iznimka** (`scripts/contrast-live-allow.json`): ikona kategorije u
  napretku, **2.15–2.80**. Njezina boja **ne dolazi iz CSS-a nego iz SADRŽAJA**
  (`js/progress.js` stavlja `data.color` inline na glif) — isti razred koji je za **ispune**
  već riješen s `inkForTint()` (BUG-024), a za **tekst na svijetloj plohi** ekvivalent još
  ne postoji. Glif stoji uz `<strong>` naziv kategorije, pa nije jedini nositelj značenja.
  Rješava se u **C5a**, čija je to površina.
  ⚠️ Iznimka je **imenovana, ne prešućena** — i popis je kratak namjerno: čim naraste,
  prestaje biti iznimka i postaje tepih.

### 10.3 ✅ C4b JE ISPUNJEN — prva migrirana površina, i dvije ljestve pragova koje su se tukle (2026-08-29)

C4b je **prva cigla u fazi koja stvarno piše Tailwind utilityje na površinu**. C1 je namjerno
završio s **nula** generiranih (§3), T5 ih je uveo samo za ritam heroja (§9.12). Sve dosad je
bila priprema; ovdje se prvi put migrira.

#### Mjera prije koda — i promijenila je i OPSEG i OBLIK cigle

| pitanje | mjera | posljedica |
|---|---|---|
| je li `pages.css` jedna površina? | **nije**: lekcije **114** · kromo učenja **192** · `about` **236** · toast **42** · footer **27** | C4 je vlasnik **samo prvog** |
| koliko je toga utility-izrazivo? | `browse.css` **142/147** deklaracija · `pages.css` **301/317** | migracija je moguća, ostatak je pseudoelement i `-webkit-` |
| tko odlučuje raspored lekcija? | **dvije** ljestve pragova, u `responsive/05` i `/06` | ishod na svakoj širini = redoslijed uvoza |
| koliko `browse` ovisi o `responsive/*`? | **nula pravila** | browse je čista površina, lekcije nose sav rizik |
| donosi li cigla dobitak paleti? | `browse.css` **0/0/0**, `pages.css` **0** FATALNO | **ne** — i to se ne tvrdi |

#### ⚠️ NALAZ 1 — `min-height` ljuske je MRTAV, i ne smije postati utility

`css/topbar.css` bezuvjetno gazi `min-height` za **svih osam ljuski stranica**
(`calc(100dvh - var(--chrome-h))`), stoji kasnije u bundleu, specifičnost je jednaka.
Izmjereno na browse/lessons/about: **792 px u prozoru od 900** — dakle deklaracija u
`browse.css` i `pages.css` nikad ništa nije radila.

Važnije od toga što je mrtva je **što bi bila da je preseljena**:

> Utilityji stoje **zadnji i neuslojeni**. Pravilo koje je netko namjerno GAZIO, pretvoreno
> u utility, počinje **pobjeđivati** — i to na svim stranicama odjednom.

Da je `min-height` otišao u markup, svaka bi stranica postala viša od ekrana za visinu kroma.
To je **obrnuta strana pouke C1 br. 1**: ondje legacy pravilo veće specifičnosti tuče utility
i rješenje je *obrisati pravilo*; ovdje utility **oživljava** pravilo koje je trebalo gubiti.
Zato je obrisan, ne preseljen — a pravilo koje iz toga slijedi za C5–C7:

**Prije nego pravilo postane utility, provjeri TUČE LI GA netko danas. Ako da, utility je
promjena ponašanja, ne migracija.**

#### ⚠️ NALAZ 2 — raspored lekcija odlučivale su DVIJE ljestve, i tri su rulja bila mrtva

`responsive/05-device-sizes.css` je nosio ljestvu 600 / 768 / 1024 / 1280 / 1536, a
`06-component-improvements.css` posve drugu — 768 / 1024. `06` se uvozi **poslije**, pa je na
svakoj širini pobjeđivala mješavina koju nijedna od dvije nije opisivala. Mjereno u pregledniku,
ne pročitano iz koda:

- **600–767 px:** `grid-template-columns: repeat(2, 1fr)` stajao je **na `flex` spremniku**
  (`.lessons-grid` je bio `display:flex`). Deklaracija je inertna → **mjereno: 1 kartica po
  retku, identično kao na 599.** Pravilo koje se čita kao „dva stupca na malom tabletu"
  nije radilo **ništa**, i to od dana kad je napisano.
- **≥1536 px:** `.lessons-grid { max-width: 1200px }` — roditelj `.lessons-content` staje na
  **1000**, pa mreža nikad nije mogla biti šira od **936**. Mrtvo.
- **768–1023 px:** `05` je tražio `padding: 20px`, `06` `1.5rem`. Pobjeđivao je `06`; prvo
  pravilo je bilo mrtvo slovo.

#### ⚠️ NALAZ 3 — stupac sadržaja nije sebe mjerio, nego SVOJE DIJETE

Zašto je uklanjanje `max-width: 700px` s **mreže** promijenilo širinu **stupca**? Jer
`.lessons-page.active` je `display: flex; flex-direction: column`, a `.lessons-content` ima
`margin: 0 auto` — **auto margine u poprečnoj osi gase `stretch`**, pa se stavka smanjuje na
sadržaj. Stupac je bio 764 px = mreža 700 + padding 64. Dakle širina stranice je dolazila
odozdo, iz najšireg djeteta, umjesto odozgo iz vlastite mjere.

Popravak je `w-full`: stupac od sada **kaže koliko je širok**, umjesto da ga izmjeri dijete.
Nađeno tek kad je razlika od 4 px odbila biti objašnjena čitanjem CSS-a — **treći put ove
sesije da instrumentacija odgovori iz prve ondje gdje je nagađanje otišlo u krug.**

#### Rez ide po ELEMENTU, ne po datoteci

§3 traži da je „površina ili cijela nova ili cijela stara". Doslovno po datoteci to je
neizvedivo: kartica nosi `::before` s `color-mix` gradijentom, akcent-varijablu iz kataloga i
varijante po `data-ink` — u utilityjima nečitljivo, a ništa se ne dobiva. Zato je pravilo
izrečeno preciznije, onako kako i glasi njegov razlog (rat specifičnosti):

> **Nijedno svojstvo se ne odlučuje na dva mjesta.** Polovična površina koju §3 zabranjuje je
> ona gdje se dva sustava tuku oko **istog elementa** — ne datoteka s dva stanara.

- **Skela** (ljuska · stupac · naslov razine · uvod · mreža · naslov semestra · prazno stanje)
  → **utilityji**, u `index.html` i u **dvije imenovane konstante** u `js/navigation.js`.
- **Komponenta** (kartica i njena djeca) → **CSS**, prepisan na `@theme` tokene.

Konstante su nužne, ne stilske: isti raspored crtaju **četiri renderera**, pa bi utility-niz
inače bio pet kopija koje se raziđu prvom izmjenom. Nizovi su **doslovni** — sastavljeno ime
Tailwind ne vidi (ADR-028, granica #5).

#### Zašto komponente idu na tokene, iako paleta od toga nema koristi

`browse.css` je već imao **0** pogodaka `check:palette`. Zamjena `--bg-secondary` →
`--color-surface-1` dakle **ne popravlja ništa danas**; radi se jer **`variables.css` umire u
C7**, a svaki alias koji dotad preživi mora se tada ionako prepisati — samo pod pritiskom i u
cigli koja već diže sve ostalo. **Mjere (10px, 14px, 1.05rem) se NE diraju:** snap na
`--radius-md` bio bi redizajn, a ova cigla mijenja jezik, ne izgled (§1).

#### Jedan skup pragova — izmjereno na obje strane

Ad-hoc pragovi (375 · 600 · 1280 · 1536) umiru s površinom koja ih je koristila; ostaje
`xs/sm/md/lg/xl/2xl` iz `tokens.css`. Usporedba starog i novog stabla na 14 širina —
**broj kartica u retku je NEPROMIJENJEN na svakoj**, mijenjaju se samo mjere koje je druga
ljestva proizvoljno kapirala:

| širina | staro | novo | što se promijenilo |
|---|---|---|---|
| 320 · 374 | kartica 272/326, padding **12** | isti, padding **20** | iznimka `<375 px` obrisana |
| 375–767 | — | — | **ništa** |
| 768–1023 | mreža **700**, kartica 338 | mreža 704–736, kartica 340–356 | mreža više nije kapirana na 700 |
| **1024–1279** | mreža **800**, kartica **251** | mreža **936**, kartica **296** | **poravnato s 1280+** |
| 1280 · 1536 | — | — | **ništa** |

Nigdje nema vodoravnog prelijevanja. Pojas 1024–1279 je i bio anomalija: bio je **uži** od
onoga što isti raspored daje na 1280, iz jedinog razloga što su ga dvije ljestve različito
kapirale.

⚠️ **Izrečeno, ne prešućeno:** browse u pojasu **601–639 px** od sada dobiva telefonsku
obradu (jedan stupac, uži padding) umjesto tabletne — jer je prag 600 zamijenjen s `sm` (640).
Ispod 497 i iznad 640 nema promjene.

#### Dokaz da se nije pomaknulo ništa izvan površine

`css:diff` (rute `#/subjects` i `#/subject/te2`, 3 širine): **21 razlika na browseu, sve na
skeli** — i **nijedan `.browse-card*` element**, čime je zamjena alias → token dokazana kao
bajt-identična. Na lekcijama **21 razlika**, sve na stupcu, mreži i karticama, i svaka
objašnjena tablicom iznad.

Namjerne razlike na browseu: naslov razine 20 → **22 px** (`text-xl`), uvod 15.2 → **16 px**
(`text-base`, prored `normal` → 1.6), razmak mreže 13.6 → 14 px ispod 640.

#### 🔧 Alat: `css:diff` nije mjerio ništa što crta JavaScript

Alat je gledao **isključivo `/`**. `COLLECT` nasilno pali svaku `*-page` sekciju, pa je nastao
dojam da su sve stranice pokrivene — a pokriven je bio samo njihov **markup iz `index.html`**.
Kartice kataloga, popis lekcija i polica na `/` **ne postoje**, pa se nikad nisu ni
uspoređivale. To je **„Zamka 2" iz §9.16**, a C4b je prva cigla koja u nju stvarno upada.

Dodan `CSS_DIFF_RUTE` (zadano ostaje `/`, da ostale cigle ne postanu trostruko sporije), a
ispis **uvijek imenuje što je mjereno** — šutnja o dosegu je ono što je zamku i održalo.
**C5a, C5b, C6 i C7 moraju predati svoje rute**, inače mjere prazan ekran.

#### 🔧 Dvije izmjene u brani `check:tailwind`, obje obrnuto provjerene

1. **Provjera #1 je čitala KOMENTARE.** Bilješka koja objašnjava zašto je sastavljanje imena
   zabranjeno — i pritom pokazuje kako izgleda — prijavljena je kao prekršaj. **Peti put isti
   razred u projektu** („skener ne razlikuje objašnjenje od klase": `.\!container` iz koda,
   `flex-wrap` i `sticky` iz proze, `visible` iz usporedbe niza), ali **prvi put je
   pogriješila naša brana, ne Tailwind.** Blok-komentari i redci koji **jesu** komentar sada
   se skidaju uz očuvan broj redaka; `//` usred retka se ne dira, jer ondje živi `https://`.
2. **Provjera #5 nije znala za IMENOVANU KONSTANTU.** Niz utilityja u `const`, korišten kao
   `class="${X}"`, prijavljen je kao „šum". Brana sada prati **pokazivač** do definicije u
   istoj datoteci — i time se **ne labavi**: čitaju se samo nizovi stvarno upotrijebljeni kao
   vrijednost `class` atributa, ne svi nizovi u datoteci.

**Mutacije:** dinamičko ime u komentaru → **zeleno** (to je popravak) · isto u kodu →
**izlaz 1**, s točnim retkom · konstanta izvan dosega pokazivača → **izlaz 1** na „šum".

#### Izvedeno

> ⚠️ Brojke redaka ispod su po **`npm run css:debt`** — to je jedini brojač na koji dokumentacija
> upućuje, a razlikuje se od `wc -l` za jedan redak. Prva verzija ovog zapisa je miješala oba, pa
> je ista datoteka u specu i CHANGELOG-u imala dvije „točne" vrijednosti.

- `css/browse.css` **294 → 208** redaka (skela otišla, ostala kartica na tokenima).
- **`css/lessons.css` (novo, 114 redaka)** — kartica lekcije. Uvezen **točno ondje gdje je ta
  sekcija bila unutar `pages.css`**, pa se kaskada ne mijenja ni za jedno pravilo.
- `css/pages.css` **616 → 508** — bez lekcija; preostala tri stanara **imenovana s vlasnikom**
  (kromo → C5a · `about` → C6 · toast i footer → C7).
- `responsive/05` **−8 pravila**, `responsive/06` **−5 pravila**: druga ljestva pragova više ne
  postoji.
- `css/app.css`: `grid` skinut s popisa isključenih imena — prvi put ga je netko stvarno
  napisao kao klasu.

#### ⛔ Što C4b NAMJERNO nije napravio

- **`pages.css` nije obrisan**, iako ga tablica §3 vodi pod „što nestaje". Ta je tablica
  pisana prije nego se izmjerilo da datoteka ima četiri stanara; **brišu ga C5a, C6 i C7**,
  svaki svoj dio. Isto vrijedi za `landing.css`, koji je C2 preživio iz istog razloga.
- **Kromo učenja (`.study-nav`, `.study-mobile-nav`) nije dirano** — to je isti ekran kao
  četiri načina učenja, pa bi migracija samo trake bila upravo polovična površina koju §3
  zabranjuje. Ide s **C5a** (isporučeno: §11.1), zajedno s dva preostala `!important` u projektu
  izvan C7. ⚠️ **Ta brojka „dva" je poslije oborena** — bila su **mrtva**, a stvarna četiri stajala
  su u `responsive/04` (v. redak C5a u §3). Ostavljeno kako je zapisano, s ispravkom uz sebe.
- **Pravilo `prefers-contrast: high` za `.lesson-card` ostavljeno je u `responsive/05`**
  svjesno: skupni je selektor s `.flashcard` i `.quiz-container`, dakle a11y-način koji po
  naravi živi izvan komponente, a cijeli je taj blok duplikat koji ionako umire u C7.

---

## 11 · C5a — modovi uvježbavanja i kromo ekrana za učenje

C5a je prva cigla u fazi kojoj mjerenje nije samo promijenilo oblik nego i **veličinu**.
Tablica §3 je opisuje kao pet CSS datoteka; izmjereno, površina ima i **179 pravila u
`css/responsive/*`**, a to je red veličine drukčiji posao (C4b ih je imao 13, browse **nula**).

### 11.0 Mjera prije koda — i zašto je C5a druga vrsta cigle

| pitanje | C4b (browse) | C4b (lekcije) | **C5a** |
|---|---|---|---|
| pravila u `responsive/*` koja diraju površinu | **0** | 13 | **179** |
| (selektor, svojstvo) parova o kojima odlučuje ≥ 2 datoteke | 0 | 2 ljestve | **101** |
| ljestve pragova koje se natječu | — | 2 | **5** |

Pragovi zatečeni na toj površini: `374 · 375–413 · 390–427 · 414–479 · 428–767 · 480 ·
480–599 · 500 · 501–900 · 600–767 · 767 · 768 · 768–1023 · 900 · 1024 · 1024–1279 ·
1280–1535 · 1536`.

**Mjereno u pregledniku, ne pročitano:** `.flashcard { min-height }` deklarira se na **22
mjesta u 6 datoteka**, a iscrtavaju se četiri vrijednosti — 200 px do 480, 380 do 767, 400
do 1023, pa 420/450/500 iznad — **ali samo ako je prozor viši od 900 px**; inače landscape-
pravilo daje 300 px i `max-width: 70%`. Na običnom laptopu (1440 × ~810) desktop-ljestva iz
`responsive/05` dakle **nikad ne dođe na red**.

> ⚠️ **Vlastita greška u tom mjerenju, uhvaćena isti čas:** prvi prolaz je mjerio na visini
> 900 i dao 300 px na 1024/1280/1536, iz čega bi slijedio zaključak da je cijela desktop-
> ljestva mrtva. Bila je moja **visina prozora**, ne CSS. Otud dva prolaza i otud pravilo:
> *kad mjeriš širinu, visina je isto varijabla.*

**Dvije tvrdnje iz §3 koje je mjerenje ispravilo:**

1. *„Četiri moda dijele `.control-btn`/`.answer-btn` — migriraju se zajedno ili se tuku."*
   Sprega je stvarna ali **mala i imenovana**: u `responsive/*` samo **2 pravila** spajaju
   dvije skupine (oba skupni selektori koji ionako umiru u C7), a među datotekama modova
   dijele se `.control-btn` (kartice ↔ dopune) i `.wrong`/`.correct`. Cigla se zato smije
   izvesti kao **četiri commita na jednoj grani**, ne kao jedan zahvat.
2. *„C5a nosi najveći rizik od BUG-025."* **Već je namiren.** Kviz (`qEsc`), dopune (`fEsc`
   + `esc` po dijelovima rečenice) i napredak (`pEsc`) idu kroz `SokratBlocks.esc`; kartice
   `innerHTML` uopće ne koriste, samo `textContent`. Zatvorile su to cigle D; spec to nije
   povukao.

### 11.1 ✅ C5a/1 — kromo ekrana za učenje (2026-08-30)

Prvi commit uzima ljusku, tabove, `<main>` i donju traku. **Rez je ovdje morao biti stroži
nego u C4b:** ondje je vrijedilo „skela u utilityje, komponenta u CSS", a to ovdje nije
dovoljno — utilityji stoje **zadnji i neuslojeni**, pa svojstvo koje neki preživjeli medijski
upit još mijenja **ne smije** u utility. Pravilo je zato:

> **Rez ide po SVOJSTVU, ne po elementu.** U utility ide ono što nijedan preživjeli upit ne
> dira (`display` gdje je slobodno, `position`, `inset`, `z-index`, boje, rub, `max-width`,
> `margin`, `width`); u CSS ostaje `padding` svih triju ploha (mijenjaju ga `@media print` i
> dva landscape-upita) i cijela komponenta gumba.

#### 🐞 Tri nalaza, i sva tri su oborila nešto što sam bio napisao

**① Pravilo koje sam proglasio mrtvim nije bilo.** `responsive/02` je s
`.mobile-nav { padding: 0.25rem 0 }` (ista specifičnost, kasnije u bundleu) tiho pobjeđivao
`pages.css`, a donji rub je dolazio iz **bezuvjetnog** `.mobile-nav { padding-bottom:
var(--safe-bottom) }` na kraju `responsive`-a. Prepisao sam vrijednosti iz `pages.css` kao da
su istina i traka je narasla **63 → 75 px**. Oborio to `css:diff`, ne čitanje koda.
*Treći put u fazi da statička analiza kaskade promaši — i svaki put ju je ispravio preglednik.*

**② `hidden` je u ovom projektu ZAUZETO IME.** `css/responsive/01` drži
`.hidden { display: none !important }`, a `js/fill-blanks.js` ga koristi kao stanje. Utility
`hidden md:flex` je izgubio od tog `!important`-a i **tabovi su nestali i na desktopu**. Ime
je zato i na popisu isključenih (`@source not inline`) — ali isključenje sprječava GENERIRANJE,
ne PISANJE. Vidljivost tabova je zato ostala u CSS-u, na istom pragu (48rem).

**③ Mrtvo pravilo nas je ŠTITILO — i to je obrnuto od C4b/NALAZ-1.** `pages.css` je traci
davao `z-index: 9999`, ali živjela je s **1000** (iz `components.css`). Da je 9999 otišao u
utility, donja bi traka na telefonu stajala **iznad toasta (2000) i modala (3000)**. U C4b je
utility oživio pravilo koje je trebalo gubiti; ovdje bi oživio pravilo koje **nikad nije
smjelo pobijediti**. Zajedničko im je jedno: *prije nego pravilo postane utility, izmjeri
tuče li ga danas netko — i tko pobjeđuje.*

#### 🔧 Alat: `css:diff` je na ovim rutama mjerio PROMIJEŠAN sadržaj

Rute načina učenja su prve koje alat gleda, a njihov se sadržaj miješa (`shuffleArray` +
`Math.random`). Referenca i radno stablo dobivali su **različite kartice**, pa je alat
prijavljivao razlike u boji akcenta — a ta boja dolazi iz `data/catalog.js`, ne iz CSS-a.
Na jednoj kombinaciji je razlika narasla na **690 elemenata**, dakle nalaz koji ne znači
ništa. `Math.random` se sada zamrzava prije učitavanja (`addInitScript`, trivijalan LCG):
oba stabla dobiju isti niz. *Nalaz koji ovisi o kocki nije nalaz.*

#### Izvedeno

- **`css/study-chrome.css` (novo, 292 retka)** — uvezen **poslije `responsive/*` i poslije
  `components.css`**, i to je jedini razlog zašto ne stoji uz ostale komponente: traka nosi i
  klasu `.mobile-nav`, koju `components.css` gasi. Ta se bitka dosad dobivala `!important`-om;
  sada ju dobiva **redoslijed**.
- **`css/pages.css` 508 → 322** — kromo je otišlo; datoteka je time **preseljena pod C6**
  (`about` je najveći preostali stanar; toast i podnožje su C7).
- **`!important` u projektu 47 → 41.** ⚠️ Nalaz: **dva „posljednja izvan C7" bila su MRTVA**
  (mutacija ih je maknula bez ijedne promjene u prikazu), a stvarna četiri na toj površini
  stajala su u `responsive/04` — ondje ih tablica §3 nije ni tražila.
- **`responsive/*` −99 redaka**, 11 blokova: 6 mrtvih (nadglašeni specifičnijim selektorom),
  4 preseljena, 1 **prazan medijski blok** koji je ondje stajao bez ijednog pravila.
- **`css/app.css`: `fixed` skinut s popisa isključenih imena** — istim putem kao `grid` u C4b,
  uz prethodnu provjeru da u `css/**` nema pravila `.fixed`.
- **BUG-036** (v. `BUGS.md`): kratica `padding` u landscapeu je brisala sigurni rub.

#### Dokaz

`css:diff` na **tri rute × tri širine**: 768 i 1280 **bez ijedne razlike**, na 375 **jedna** —
`.study-content max-width: 1200px → none`, dakle uklonjeno mrtvo pravilo (ispod 768 je prozor
uvijek uži od 1200, iznad vrijede `md:max-w-[900px]` / `lg:max-w-[1100px]`). Ciljano mjerenje
visine trake: **59 / 63 / 63 / 63 px** na 320/393/430/767 — identično osnovici.
`phone.spec.js` **10 prošlo, 0 palo**. `preflight` **EXIT 0**.

> ⚠️ **`check:palette` je uhvatio moju grešku i bio je u pravu.** Prepisao sam zakucanu sjenu
> (`rgba(0,0,0,0.1)`) iz `components.css` u novu datoteku „radi potpunosti". Zbroj nije narastao
> (103/103), ali je zakucana crna stigla u datoteku koje nema u osnovici. Popravak je bio
> **brisanje duplikata**, ne spuštanje osnovice: *preseliti zakucanu vrijednost znači potpisati je.*

#### ⛔ Što C5a/1 NAMJERNO nije napravio

- **`components.css` nije diran**, iako je njegov `.mobile-nav*` blok u cijelosti zasjenjen.
  Otkad je komponenta trake pod `@media (width < 48rem)`, taj blok je legitiman **≥ md
  fallback za skriven element** — i upravo on drži `css:diff` čistim na 768 i 1280. Briše ga C7.
- **Četiri načina uvježbavanja nisu dirana** — idu u C5a/2 (kartice + dopune, dijele
  `.control-btn`), C5a/3 (kviz) i C5a/4 (napredak + kontrastna iznimka).
- **Ad-hoc pragovi trake (≤ 374, landscape ≤ 900) preseljeni su NEPROMIJENJENI.** Ova cigla
  mijenja jezik, ne izgled; njihovu sudbinu presuđuje C7 zajedno s `responsive/*`.

#### Što ostaje, i čije je

- **`progress` nije u `phone-gate`-u** (`NACINI = ['learn','flashcards','quiz','fill']`) — jedina
  C5a površina bez mjere na telefonu. Dodaje ju **C5a/4**, zajedno s kontrastnom iznimkom za
  ikonu kategorije.
- **Landscape ispod 768 px nije mjeren ni na jednom ekranu** (v. BUG-036). Odluka o tome je li
  to vrijedno novog ekrana u brani ide uz C5a/4, s izmjerenim brojkama, ne prije.

### 11.2 ✅ C5a/2 — kartice i dopune (2026-08-30)

Drugi commit uzima dva načina uvježbavanja odjednom, jer dijele `.control-btn` i `.wrong`/
`.correct`. Mjera je i ovdje promijenila posao prije nego je napisan redak koda: **82 od 179
pravila** cijele cigle padaju na te dvije površine (46 % pravila na trećini datoteka), a o **38
parova (selektor, svojstvo)** odlučuju dvije ili više datoteka. O jednom jedinom svojstvu —
`.flashcard { min-height }` — odlučuje **šest datoteka kroz 22 deklaracije**.

#### Ljestva koja se pokazala DVOSTRUKO manjom nego što izgleda

Izmjereno u pregledniku kroz **svaki prag i prag ± 1**, u dva režima pokazivača i na dvije
visine prozora. Ono što se stvarno iscrta:

| širina | miš | dodir (`hover:none` + `pointer:coarse`) |
|---|---|---|
| ≤ 480 | **200** | **200** |
| 481–599 | **350** | **280** |
| 600–767 | **380** | **280** |
| 768–1023 | **400** | **400** |
| 1024–1279 | **420** | 420 |
| 1280–1535 | **450** | 450 |
| ≥ 1536 | **500** | 500 |

Dakle **12 od 22 deklaracije je mrtvo** — među njima cijela ljestva ispod 480 px (`01` i `05`
zajedno pišu 280/300/320 na pragovima 374/375/414, a `06` sve to gasi jednim `@media
(max-width: 480px) { min-height: 200px }`).

> ⚠️ **Visina prozora je i dalje varijabla.** Na prozoru visine 900 px desktop-ljestva od
> 1023 px nadalje **uopće ne dođe na red** — ondje presuđuje
> `(max-height: 900px) and (orientation: landscape)` s 300 px i `max-width: 70%`. Tablica gore
> je mjerena na visini 1200. Ista zamka kao u §11.0, druga brojka.

#### 🐞 Nalazi

**① Četrnaest imena bez ijednog elementa.** `flashcards-header` · `flashcards-controls` ·
`flashcards-section` · `flashcard-navigation` · `flashcard-content` · `flashcard-nav` ·
`fill-section` · `fill-header` · `fill-info` · `fill-content` · `fill-question` · `fill-text` ·
`fill-blank` · `fill-navigation` — nula pojava u `*.html`, `js/**`, `data/**` i `tests/**`, i
nula elemenata u pregledniku na obje rute. Sva su bila **imenovana u osnovici**
`check:orphan-css`, dakle zapisan dug, ne iznenađenje: **81 → 67**.

**② `.fill-stats` nije imao NIJEDNO pravilo — BUG-038.** Isti blok brojača stoji na oba ekrana,
a crtao se različito: na karticama `flex`, centrirano, zeleno/crveno i podebljano; na dopunama
kao dva `block`-a jedan ispod drugoga, u zadanoj tinti. Uzrok je selektor vezan uz spremnik
(`.flashcard-stats .stat…`), koji drugi spremnik ne može dohvatiti. **Nijedna naša brana to ne
može vidjeti:** `check:orphan-css` traži klasu bez elementa, a ovo je **element bez pravila** —
suprotan smjer; `css:diff` ga ne vidi jer su obje verzije jednako nestilizirane. Popravljeno:
raspored u markup (isti na oba mjesta), u CSS-u ostaje samo značenje boje, pod `.stat.correct` /
`.stat.wrong`.

**③ Dva pravila pisana protiv preljeva u landscapeu su mrtva — BUG-037.** Na 568 × 320 kartica
traži 280 px u pojasu od 205 px. `responsive/04` (`max-width:900px` + landscape → 150 px, uz
komentar o BUG-016) i `responsive/05` (`max-height:500px` + landscape → 220 px) oba tuče kasniji
`responsive/06` (`max-width:767px` + `hover:none` + `pointer:coarse` → 280 px), koji o
orijentaciji ne zna ništa. **Namjerno NIJE popravljeno ovdje:** ispravak nije jednoznačan
(150 ili 220) i mijenja razmjere ekrana koji nijedna brana ne mjeri. Brojke su upravo ono što je
§11.1 tražio da se pribavi prije odluke — ide uz **C5a/4**.

**④ Tri pravila koja postoje i ne rade ništa.** `.fill-controls { grid-template-columns:
repeat(3, 1fr) }` iznad 768 px — isti spremnik ondje postaje `display: flex`, pa tri stupca
nikad ne nastanu. `.flashcard { max-width: 700/800/900 }` iznad 1024 px — roditelj je ograničen
na 600 px. I `@media (prefers-reduced-motion) { .flashcard-inner { transition: none } }` u
**dvije** datoteke, dok `responsive/03` ionako drži `* { transition-duration: 0.01ms !important }`,
koji tuče obje.

> **Prvo je obrisano, drugo nije — i razlika je pravilo, ne ukus.** Brisanje mrtvog pravila
> koje NE mijenja izračunati stil je čisto; brisanje onoga koje ga mijenja bez ijedne promjene
> na ekranu (`max-width` pod ograničenim roditeljem) unosi razliku u `css:diff` za ništa. Zato
> `max-width` seli **nepromijenjen**, uz zapis da C7 ne mora ponovno mjeriti.

#### Izvedeno

- **`css/responsive/*` 2060 → 1532 retka (−528, mjeri `npm run css:debt`).** Sam
  `04-mobile-extra.css` **507 → 341**.
- Ljestva je preseljena u `flashcards-section.css` / `fill-blanks-section.css`, **u istom
  redoslijedu** (`01` → `06`) — te se ljestve tuku istom specifičnošću, pa je poredak jedina
  stvar koja ih razlikuje. Datoteke ostaju na svom mjestu u `app.css`: provjereno je da između
  njih i `responsive/*` **nitko ne deklarira te selektore**, pa premještanje uvoza nije trebalo.
- **`!important` u projektu 41 → 35.** Pet iz `06` (`@max-width: 480px`) nije trebalo — pravilo
  je i bez njih posljednje koje se poklapa; šesti je bio duplikat pod `prefers-reduced-motion`.
- **Tri prazna medijska upita** obrisana iz `06` (dva su ostatak C4b).
- U utilityje su otišla samo svojstva koja nijedan preživjeli upit ne dira: `max-width`,
  `margin`, `text-align` spremnika kartica, `margin-bottom` naslova i trake napretka, te
  cijeli raspored oba bloka brojača. **`.fill-container` je pritom ostao u CSS-u** iako je
  „isti" element — njegov `max-width` mijenjaju dva upita. *Rez ide po svojstvu, pa ista dva
  elementa smiju završiti različito.*

#### Dokaz — dvije neovisne provjere, jer nijedna sama ne pokriva površinu

**① `css:diff` kroz svaki prag i prag ± 1.** **62 mjerenja** (31 kombinacija širine i visine ×
2 rute), uz `CSS_DIFF_SIRINE` i `CSS_DIFF_RUTE`. **Nijedno ne prijavljuje razliku u markupu**
(0/0 kroz svih 62). Kroz svih 62 mjerenja razlikuje se ukupno **14 različitih elemenata**, i
svaki je objašnjen:

| element(i) | koliko mjerenja | zašto |
|---|---|---|
| `.fill-stats` + dva `.stat` + njihove ikone i po dva `<span>` (**9**) | svih 62 | **popravak BUG-038** |
| `.fill-container` · `.section` · `.study-content` · `.study-page` · `body` · jedan `.visually-hidden` (**5**) | 31 (samo `fill`-ruta) | visina im je pala za **21 px** jer su brojači iz dva reda prešli u jedan |
| `.fill-controls` (**1**) | 22 (samo ≥ 768 px) | `grid-template-columns: repeat(3,1fr) → repeat(2,1fr)` — **bez ijedne promjene na ekranu**, jer je spremnik ondje `display: flex` |

Dakle: ništa izvan popravka se nije pomaknulo, a jedina „razlika" koja nije popravak je ona koju
je cigla unaprijed predvidjela kao bezučinkovitu.

**② Inventar deklaracija, HEAD naspram radnog stabla.** `css:diff` **ne emulira dodir**, a
upravo je pravilo pod `(hover: none) and (pointer: coarse)` ono koje je cigla preselila — ono što
preglednik ne može potvrditi, mora potvrditi popis. Deklaracija na površini: **433 → 331**.

| nestalo (109) | |
|---|---|
| pravila za **klase kojih nema** (14 imena) | **49** |
| preseljeno u **utilityje** (markup) | **17** |
| **`!important`** zamijenjen običnom deklaracijom ili obrisan | **6** |
| **nadglašeno** — mrtvo, potvrđeno u pregledniku | **37** |

**Novo je točno 7**, i svih 7 je namjerno: dvije boje `.stat` (rescope iz BUG-038) i pet
deklaracija koje su izgubile `!important`. *Kriva prepisana vrijednost pojavila bi se ovdje kao
jedno „nestalo" i jedno „novo" — pa je i to pokriveno, bez ijednog dodatnog testa.*

**Ostale brane:** `phone.spec.js` **10 prošlo / 0 palo** · **`preflight` EXIT 0** ·
`check:palette` 103 → **102** · `check:orphan-css` 81 → **67** · `check:tailwind` 6/6 ·
`check:contrast` 238 provjera kroz 5 tema · `check:budget` 179,3 KiB od 200 · `check:seo` ·
`check:docs` · `check:state`.

> ⚠️ **Ograničenje alata otkriveno usput:** `css:diff` se **ne smije pokretati u dvije
> istovremene instance** — druga padne na podizanju poslužitelja. Zapisano u `CLAUDE.md`.

#### 🔧 Alat: dvije rupe u `css:diff`-u, i druga je bila ozbiljna

**① `CSS_DIFF_SIRINE`.** Tri zadane širine ne mogu dokazati ljestvu od jedanaest pragova —
375/768/1280 pogađaju **tri stepenice** i o ostalih deset ne kažu ništa. To je doslovno pouka
**C0/2** („uzorak širina u gateu je i sam moguća rupa"), samo ovaj put na alatu umjesto na
brani. Cigla sada predaje svoje širine, kao što od C4b predaje svoje rute.

**② Alat je mjerio stranicu USRED CRTANJA — i to je bio prvi „nalaz" ove cigle.** Prvi puni
prolaz je prijavio **298 razlika** i **420 elemenata koji postoje samo u radnom stablu**.
Nijedna nije bila naša: `measure()` je nakon `load` čekao **fiksnih 700 ms** („pusti `defer`
skripte da sagrade markup"). Za landing i katalog je to bilo dovoljno; rute načina učenja su
prve na kojima nije, jer gradivo dolazi **lijeno** (DB → JSON → `.js`) iza zastora
`#studyLoading`. Referenca i radno stablo su se tako mjerili u dva različita trenutka.

Zamijenjeno **uvjetom umjesto roka**: čeka se da zastor nestane, pa da se broj elemenata i
visina dokumenta prestanu mijenjati kroz dvije uzastopne provjere. Uvjet je namjerno neovisan o
onome što se mjeri — *čekanje koje pretpostavi ishod ne može pasti* (isti razlog kao u
`phone-gate`-ovom `smiriPrikaz`, odakle je metoda i preuzeta).

> **Ista brojka, dvije priče: 108 razlika prije popravka alata, 9 poslije — i tih 9 je točno
> `​.fill-stats`.** *Mjerenje koje ovisi o brzini mreže nije mjerenje* — isti rod nalaza kao
> zamrzavanje `Math.random` u C5a/1, samo na osi vremena umjesto na osi slučaja. Dvije cigle
> zaredom je alat, a ne cigla, bio prvi kvar koji treba popraviti.

### 11.3 ✅ C5a/3 — kviz (2026-08-30)

Treći commit uzima jednu površinu, ali najgušću: **57 pravila iz `responsive/*`** dira selektore
ekrana za kviz, a o **38 parova (selektor, svojstvo)** odlučuju dvije ili više datoteka. Nakon
migracije `css/responsive/*` je **1532 → 1185 redaka** (−347), `quiz-section.css` **313 → 422**,
ukupni dug **7238 → 7000**, siročad **67 → 57**.

#### 🐞 Nalaz koji nosi cijelu ciglu: ljestva `.quiz-container` NIKAD NIJE RADILA

`responsive/05` piše četverostupanjsku ljestvu širine — 600 → 700 → 800 → 900 px kroz pragove
768/1024/1280/1536 — i **nijedna prečka se nikad nije iscrtala.** `responsive/06` dolazi POSLIJE
i jednim jedinim pravilom `@media (min-width: 768px) { max-width: 650px }` gasi sve četiri.
Medijski upit ne nosi specifičnost; presuđuje **redoslijed izvora**, a `06` je zadnji.

Ono što se stvarno iscrtava:

| širina | `max-width` | odakle |
|---|---|---|
| < 480 | **800 px** | osnovno pravilo |
| 480–767 | **500 px** | `06 @min-480` |
| ≥ 768 | **650 px** | `06 @min-768` |
| 768–1023 landscape | **70 %** | `06`, zadnji upit u datoteci |

Dakle na monitoru od 1920 px kviz je širok 650 px, iako je netko napisao 900. **Nije popravljeno
ovdje** — ispravak je odluka o izgledu, a ova je cigla migracija; brojke idu u **BUG-039**.

#### 🐞 Isti mehanizam, drugi kraj ljestve: dva pravila za male telefone

`01 @max-374` piše `.answer-btn { padding: 0.75rem; font-size: 0.85rem }` i
`.question-card h2 { font-size: 1rem }`. Oba tuče `02 @max-767`, koji je **širi i kasniji**. Na
telefonu od 320 px gumbi odgovora stoga imaju iste razmjere kao na 767 px. Isti razred kao
BUG-037: *pravilo napisano za uži slučaj gubi od kasnijeg šireg.* Također **BUG-039**.

#### 🐞 Cijeli mobilni blok za DOM koji ne postoji

`responsive/04` drži blok „QUIZ SECTION MOBILE" s jedanaest pravila za `.quiz-section` ·
`.quiz-info` · `.quiz-content` · `.quiz-question` · `.question-text` · `.quiz-option` ·
`.quiz-navigation` · `.quiz-navigation .btn` · `.results-score` · `.results-message` ·
`.results-actions .btn` — **nula pojava** u `*.html`, `js/**`, `data/**` i `tests/**`. Uz njih i
`.quiz-header h2` (u `.quiz-header` nema `h2`) te `.quiz-option` u `05` i u `04 @max-374`.
Markup je nekad izgledao drukčije; CSS to nije pratio. Obrisano — otud **−10 siročadi**.

#### Što je otišlo u markup, a što je ostalo

U utilityje su otišla **dva cijela pravila** (`.quiz-progress`, `.quiz-nav-buttons`) — nijedan ih
upit nije dirao — i pojedina svojstva sa šest drugih elemenata (`text-center` na `.quiz-setup` i
`.results-card`, `flex`/`flex-col` na `.answers`, `flex`/`justify-center` na `.quiz-score`,
`flex flex-col items-center` na tri `.result-stat`, `text-left my-6` na `.wrong-answers-review`).

**Ostalo je u CSS-u, i to s razlogom zapisanim uz pravilo:**

- `.quiz-options` — od 480 px naviše **prestaje biti flex i postaje grid**; nijedno svojstvo nije
  nedirnuto.
- `.results-stats` — `flex-direction` i `gap` mijenja upit ≤ 767, a `flex-wrap` se **ne smije
  napisati** kao klasa: stoji na popisu `@source not inline` (ušao ondje iz komentara u
  `js/studio.js`). Rastaviti pravilo na tri mjesta bilo bi skuplje od cjeline.
- `.quiz-container`, `.results-actions`, `.answers { gap }`, `.quiz-score { gap }` — sve po
  pravilu ②: rez ide po svojstvu.

#### ⚠️ Zamka koju je ova cigla morala provjeriti PRIJE reza

Seljenje pravila iz `responsive/*` u `quiz-section.css` **pomiče ga UNAPRIJED u kaskadi** (redak
83 umjesto 91–96). Pravilo koje je dosad pobjeđivalo zato može izgubiti. Uvjet ispravnosti je
dakle: *ili se sele SVA pravila za taj selektor, ili nijedno* — i **nijedna datoteka iza
`quiz-section.css` ne smije dirati te selektore.** Provjereno mjerenjem: petnaest kasnijih
datoteka (`fill-blanks`, `blind-map`, `exercises`, `studio`, `topbar`, …) nema **nijedno** pravilo
na ovim selektorima; `.correct`/`.wrong` u njima uvijek su spojeni s vlastitom komponentom
(`.fill-feedback.correct`, `.ex-opt.is-correct`), pa ne dohvaćaju `.answer-btn`.

Dva pravila su bila **grupna** i zato se nisu smjela obrisati nego samo skratiti:
`.answer-btn, .control-btn, .action-btn, …` u `06` i `.lesson-card, .flashcard, .quiz-container`
u `05` (visoki kontrast). `.control-btn` i `.flashcard` u njima su tuđi stanari iz C5a/2.

#### ⚠️ Usput nađeno: `.text-success` je siguran samo slučajno

`.text-danger` je na popisu `@source not inline` jer bi ga Tailwind generirao iz tokena
`--color-danger` i — stojeći zadnji — pobijedio naše pravilo. `.text-success` na popisu **nije**,
i ne treba biti, ali samo zato što se naš token zove **`--color-ok`, a ne `--color-success`**.
Preimenuje li ga C7, klasa istog imena nastaje sama i tiho preuzima boju. Zapisano uz sam par
pravila u `css/quiz-section.css`, jer ondje se odluka o preimenovanju i mora sudariti s njom.

#### ⛔ Što C5a/3 NAMJERNO nije napravila — i to nije previd nego OVISNOST

`palette:breakdown` pripisuje `quiz-section.css` **2 od 11 fatalnih pravila**, a tablica u
`BACKLOG.md` ih je dodijelila baš ovoj cigli. **Nisu dirana, i ne mogu biti.** Riječ je o
`.answer-btn.correct` i `.answer-btn.wrong`, koji pišu **`color: white` na ispuni
`var(--success)` / `var(--danger)`**. Ispravak traži tokene `--on-success` / `--on-danger`,
**kojih nema** — postoji samo `--on-primary`. A treba li ih uopće, ovisi o Leonovoj otvorenoj
stavci: **smiju li zelena i crvena uopće biti ISPUNA, ili samo obrub i tekst.** Ako je odgovor
„samo obrub i tekst", ispuna nestaje i token ne treba nikad.

*Cigla ne može ugasiti pravilo čiji ispravak čeka odluku o izgledu.* Zapisano i u `BACKLOG.md`,
uz sam redak tablice koji je to obećao — jer je ondje obećanje i nastalo.

#### Dokaz

**`css:diff`, 20 viewporta × ruta kviza = 31 120 usporedbi, `0 razlika u prikazu`.** Širine su
birane po pragovima i prag ± 1 (320 · 374 · 375 · 393 · 430 · 479 · 480 · 599 · 600 · 767 · 768 ·
1023 · 1024 · 1280 · 1440 · 1536 · 1920) plus tri landscape mjere (900 × 600 · 852 × 393 ·
568 × 320) — dakle svaka prečka i s jedne i s druge strane.

> ⚠️ **Granica tog dokaza, poštena:** `.quiz-game` i `.quiz-results` su iza klase `hidden`, pa ih
> preglednik ne raspoređuje. Njihova izračunata svojstva se i dalje uspoređuju (i jednaka su), ali
> **postotci i `auto` se ne razrješavaju**. Za te ekrane drugi dokaz nosi `tests/phone.spec.js`,
> koji kviz otvara kao NAČIN UČENJA na tri širine: **10 prošlo / 0 palo.**

#### 🧭 Pouka o metodi — peta zaredom o alatu, ali ovaj put o VLASTITOM

Skripta za rez pala je iz prve, i to zatvoreno: *„očekivano 1, nađeno 0"*. Uzrok — **komentar
iznad pravila završio je u „glavi" selektora**, jer je parser čitao izvor bez brisanja komentara.
Popravak nije bio maknuti komentare nego ih **zabijeliti čuvajući duljinu**, jer se rez radi po
spanovima u izvornom tekstu. Druga pogreška istog kruga: u `05` je zadnji `.quiz-container` bio
**član grupnog selektora**, pa ga traženje po točnom imenu nije našlo — brojka 7 iz inventara i
brojka 6 iz reza razlikovale su se **za točno taj jedan**.

*Obje je uhvatila ista stvar: skripta koja pada kad meta nije nađena točno onoliko puta koliko je
najavljeno.* Da je bila napisana da „zamijeni ako nađe", oba bi promašaja prošla tiho.

### 11.4 ✅ C5a/4 — napredak (2026-08-30)

Četvrta i zadnja cigla C5a-a uzima površinu napretka: **25 pravila iz `responsive/*`** dira
njezine selektore, a o **14 parova (selektor, svojstvo)** odlučuju dvije ili više datoteka.
Nakon migracije `css/responsive/*` je **1185 → 1025 redaka** (−160), `progress-section.css`
**183 → 294**, ukupni dug **7000 → 6951**, `!important` **35 → 34**, siročad **57 → 46**.

> Cigla je izvedena u **DVA commita**: prvi je migracija (izlazni uvjet: `css:diff` s nula razlika),
> drugi nosi ono što prikaz **namjerno mijenja ili mjeri** — `progress` u `phone-gate`,
> kontrastnu iznimku za ikonu kategorije i izmjerenu odluku o landscapeu ispod 768 px. Dvoje se
> ne miješa u isti commit jer bi dokaz „nula razlika" prestao nešto značiti.

Iz `responsive/*` je otišlo **32 pravila** — 25 koja gađaju selektore napretka plus sedam koja
su s njima dijelila blok. Ovo je najmanja od četiri C5a površine po broju pravila i najveća po
**udjelu mrtvog: 12 od 32 pravila nije imalo nikakav učinak** — brisanje im ne mijenja nijednu
izračunatu vrijednost.

#### 🐞 Ljestva `.progress-overview` iz `01` nikad se nije iscrtala — četvrta pojava BUG-039

`responsive/01` piše dvije prečke za mrežu kartica napretka (`@768: 1fr 1fr` i
`@1024: 1fr 1fr 1fr`, uz `gap: 1.5rem`). **Nijedna se ne iscrtava.** `responsive/06` dolazi
POSLIJE i nosi vlastitu, potpuniju ljestvu (`@480` 2 stupca, `@768` **3**, `@1024` **4**, uz
`gap: 1rem`), koja gasi svaku prečku iz `01` — i onu na istom pragu i onu na širem.

Izmjereno u pregledniku (ne pročitano), `grid-template-columns` na `.progress-overview`:

| širina | stupaca | odakle |
|---|---|---|
| < 480 | — (flex, stupac) | osnovno pravilo |
| 480–767 | **2** | `06 @min-480` |
| 768–1023 | **3** | `06 @min-768` — a `01` je za isti prag napisao **2** |
| ≥ 1024 | **4** | `06 @min-1024` — a `01` je napisao **3** |

`gap` je pritom **16 px na svakoj širini**: `01` je tražio 24, i nikad ga nije dobio.

Isti mehanizam kao u C5a/3, samo drugi selektor: *uži upit ne pobjeđuje širi — kasniji
pobjeđuje ranijeg.* Ovdje čak ni „uži" nije bio u igri; `01` i `06` imaju **isti prag**, pa je
presudio isključivo redoslijed datoteka. Mrtva su pravila **obrisana** (brisanje ne mijenja
izračunati stil), a nalaz je pribrojen **BUG-039**.

#### 🐞 Osam pravila za DOM koji ne postoji — i jedan `!important` među njima

`responsive/04` drži blok „ANALYTICS/PROGRESS SECTION MOBILE" s deset pravila, od kojih
**osam gađa selektore kojih nema.** Selektori
`.analytics-section` · `.analytics-header` · `.analytics-grid` · `.analytics-card` ·
`.chart-container` · `.progress-section` · `.progress-header` · `.progress-grid` ·
`.progress-item` · `.progress-label` · `.progress-value` imaju **nula pojava** u `*.html`,
`js/**`, `data/**` i `tests/**`. Odjeljak napretka je `<section id="progress" class="section">`
— klasa `progress-section` nikad nije postojala.

Od preostala dva, **jedna polovica jednog pravila je bila živa**
(`.analytics-card h3, .progress-card h3 { font-size: 1rem }`) i preselila se; druga
(`.analytics-card, .progress-card { padding: 1rem }`) je bila **doslovan duplikat** pravila iz
`02` na istom pragu i s istom vrijednošću. Blok je time nestao u cijelosti — s njim i
`grid-template-columns: 1fr !important`, jedan od trinaest preostalih `!important`-a u
`responsive/*`.

#### Što je otišlo u markup, a što je ostalo

U utilityje su otišla **tri cijela pravila** (`.progress-container h1`, `.progress-card.main`,
`.category-bar-info`) i pojedina svojstva s osam drugih elemenata: `mb-8` na
`.progress-overview`, `relative` na `.big-progress-circle`, `w-full h-full` na njegov `<svg>`,
`flex items-center gap-2 mb-2` na pet `<h3>`, `h-1.5 rounded-[10px] overflow-hidden mt-2` na
`.mini-progress` (u markupu **i** u `js/progress.js`), `flex items-center gap-3` na
`.category-bar`, `mt-6` na `.study-history`, `w-full mt-6` na `.reset-btn`.

**Ostalo je u CSS-u, i to s razlogom zapisanim uz pravilo:**

- `.progress-overview` i `.category-bars` — obje od nekog praga **prestaju biti flex i postaju
  grid**, a `gap` mijenja isti upit; nijedno svojstvo nije nedirnuto. Isti oblik kao
  `.quiz-options` u /3.
- `.progress-card h3 { font-size }`, `.big-progress-circle { width, height }`,
  `.big-progress-circle span { font-size }`, `.progress-card { padding }`,
  `.category-bar { padding }`, `.progress-container { max-width, margin }` — sve po pravilu ②:
  rez ide po svojstvu.
- **`.category-bar-info span` ostaje zbog DOSEGA, ne zbog upita** — v. nalaz niže.

#### 🐞 Tri nalaza koje cigla NIJE ispravila, jer nisu o jeziku nego o izgledu

1. **`.category-bar-info span` pogađa DVA elementa.** Selektor je pisan za vanjski redak
   (naziv + postotak), ali `<span>NN%</span>` živi **unutar** njega, pa i on dobiva
   `display: flex`, `justify-content: space-between` i `margin-bottom: 0.35rem`. Zato pravilo
   nije moglo u markup: klase bi dobio samo vanjski. Da je pisano `> span`, ovdje bi ga danas
   nestalo. Sužavanje selektora mijenja prikaz → odluka, ne migracija.
2. **`#historyList` nitko nikad ne popuni.** Markup obećava `<!-- Generated by JS -->`, a u
   `js/**` ne postoji **nijedan** zapis koji u taj element išta piše (provjereno i kroz
   `git log -S`: od podjele `app.js` na module nikad nije ni postojao). „Povijest učenja" je
   zato naslov iznad praznine na svakom otvaranju stranice napretka. Tri pravila
   (`.history-item`, `:last-child`, `.date`) su mrtva — **nisu obrisana**, jer brisanje stila ne
   rješava prazan odjeljak, a buduću izvedbu bi ostavilo tiho neoblikovanom.
3. **`.reset-btn` nema `font-size`.** Nasljeđuje `font-family`, ali ne i veličinu, pa se natpis
   iscrtava u **13.33 px** — zadanoj veličini `<button>`-a, sitnije od svega oko sebe. Nitko ga
   nije smanjio; nikad nije ni bio postavljen.

Sva tri su zapisana u `BACKLOG.md`; ① i ③ su kandidati za C7, ② je proizvodna odluka
(izvesti povijest učenja ili maknuti odjeljak).

#### Dokaz

**`css:diff`, 20 viewporta × ruta napretka = 31 120 usporedbi, `0 razlika u prikazu`** — i to
**dvaput**: jednom nakon seobe ljestve, jednom nakon seobe svojstava u markup. Širine su iste
kao u /3 (svaki prag i prag ± 1, plus tri landscape mjere). Uz to **19 638 usporedbi na pet
drugih ruta** (`/`, browse, lekcije, kartice), jer brisanje mrtvog bloka iz `04` dira datoteku
koju čita cijela aplikacija.

Neovisna potvrda: isti mjerni skript prije i poslije daje **znak po znak jednake** izračunate
vrijednosti na 13 širina za 12 elemenata — uključujući onu koja je nalaz i izrodila
(`gap: 16px` na svakoj širini).

> ⚠️ **Granica dokaza, poštena:** `.history-item` **ne postoji ni u jednom stablu** (v. nalaz 2),
> pa njegova tri pravila nijedan `css:diff` ne može usporediti. To je ujedno i razlog zašto su
> ostavljena: neizmjerljiva su dok odjeljak stoji prazan.

#### 🧭 Pouka o metodi — mjerač je lagao i ovaj put, ali tiho

Prvi prolaz mjerio je `.progress-card` s `document.querySelector` i dobio **24 px razmaka na
svakoj širini** — iz čega bi slijedilo da upit ≤ 767 px ne radi. Nije: `querySelector` je
uhvatio **prvu** karticu, a prva je `.progress-card.main`, koja ima vlastito pravilo veće
težine. Traženi je element bio `.progress-card:not(.main)`.

*Peti put u ovoj fazi (C4b · C5a/1 · /2 · /3 · /4), i četvrti zaredom, prvi je kvar bio u
mjeraču a ne u cigli* — ali za razliku od /3, ovaj put mjerač nije pao nego je **vratio
uvjerljiv krivi broj**. Skripta koja pada zatvoreno štiti od promašaja
u traženju; od promašaja u **odabiru uzorka** ne štiti ništa osim provjere da mjeriš element o
kojem govoriš.

#### ✅ Druga polovica cigle — mjera, kontrast i jedna namjerna promjena prikaza

Prvi commit nije smio promijeniti nijedan piksel; ovaj smije, ali samo ondje gdje je promjena
**izmjerena i imenovana**. Tri stavke koje su C5a/1 i §11.1 ostavile ovoj cigli:

**① `progress` je ušao u `phone-gate` — bio je jedina C5a površina bez mjere na telefonu.**
`NACINI` je s četiri narastao na pet, pa brana sada obilazi **44 ekrana** umjesto 40
(4 uređaja × (5 javnih + `study:home` + 5 načina)). Prošlo **10 / palo 0**, uz praznu osnovicu
— dakle bez ijednog ustupka. Nije „samo još jedan tab": napredak nosi **jedini SVG koji se
skalira** (`.big-progress-circle`, tri veličine kroz dva praga) i **jedini popis koji JavaScript
crta iz sadržaja** (`.category-bar`, boja iz kataloga).

**② Kontrastna iznimka je UGAŠENA, ne prešućena.** `scripts/contrast-live-allow.json` je od
2026-08-29 imenovao jedan element: `#categoryBars > .category-bar > i.fas`, izmjereno
**2.15–2.80** uz prag 3.0 u temama `academic` i `paper`. Uzrok nije bio stil nego to da
**sadržaj bira boju TEKSTA** — `js/progress.js` je stavljao `data.color` inline kao `color:`
na glif.

Ispravak ne izmišlja ništa novo: **ista boja postaje ISPUNA, a tinta se računa** iz njezine
luminancije (`inkForTint()`) — točno kao na tri već migrirane površine (`.subject-item-icon`,
`.browse-card-icon`, `.landing-subject-icon`). Razred je za ispune riješen još u BUG-024; ovdje
je samo primijenjen na četvrtu površinu.

Izmjereno **neovisno o brani** (vlastita skripta, WCAG formula, sve četiri teme):

| tema | čipova | tinte u upotrebi | najgori kontrast | ispod praga 3.0 |
|---|---|---|---|---|
| `academic` | 5 | dark + light | **4.47** | **0** |
| `paper` | 5 | dark + light | **4.47** | **0** |
| `chalk` | 5 | dark + light | **4.47** | **0** |
| `mint` | 5 | dark + light | **4.47** | **0** |

Brojka je ista u sve četiri teme **i to je točno** — boja čipa dolazi iz kataloga, ne iz teme,
pa se s temom ne smije ni mijenjati. `check:contrast:live` od sada javlja **nula imenovanih
iznimaka**; datoteka dopuštenja je prazna (`{}`).

> ⚠️ **Obje tinte se navode IZRIČITO** (`[data-ink="light"]` **i** `[data-ink="dark"]`). Da se
> navela samo jedna, kategorija s drugom luminancijom naslijedila bi `--color-on-brand` — token
> izračunat za boju MARKE, koji na plohi iz podatka nitko nije mjerio. Ta ista pogreška je
> 2026-08-15 stajala `.subject-item-icon`.

**Doseg promjene je izmjeren, ne procijenjen:** `css:diff` na ruti napretka daje **20 razlika na
375 px** — 5 kategorija × 4 elementa (sam čip + tri potomka kojima je stupac uži za 4 px, jer je
čip 34 px umjesto ranijih 30 px). **Nijedan element izvan `#categoryBars` nije promijenjen**, a
ni sam redak `.category-bar` — visina i razmaci ostaju.

**③ Landscape ispod 768 px: IZMJERENO, pa ODLUČENO da NE ulazi u branu — zasad.**
Pokusno je u `EKRANI` dodan **568 × 320** (iPhone SE polegnut) i brana je pala s **22 nalaza**.
Ni jedan nije na površini napretka ni na ijednoj C5a površini:

| nalaz | koliko | čije je |
|---|---|---|
| kromo **53 %** (170 od 261 px) na svih 6 study-ekrana — `#chrome` 56 px **+ `#cookieBanner` 114 px** | 6 | consent (**C6**) |
| prvi ekran: kromo 56–64 px + banner 123 px = **38 %** od 320 px, na landingu/browseu/aboutu | 4 | consent (**C6**) |
| **`.mobile-nav-btn` stoji ispod bočnog izreza** (59 px u pojasu `[0,245…95,295]` i desno) | 12 | donja traka (**C7**/T-razred) |

Dvije trećine nalaza otpada na **pristanak na kolačiće**: banner od 123 px na ekranu visokom
320 px pojede 38 %, i nijedna cigla ovog plana to ne mijenja. Treći nalaz je **pravi kvar** —
isti razred koji je faza TELEFON zatvorila za druge veličine, samo nikad izmjeren na 568.

Osnovica `phone-baseline.json` je **prazna i to je njezina vrijednost**. Dodati ekran znači ili
obojiti branu crveno za tuđi posao, ili napuniti osnovicu i izgubiti svojstvo „traži nulu".
**Zato ekran NE ulazi sada**, nego kad se riješi banner (C6) i donja traka (C7) — a brojke stoje
ovdje i u `BACKLOG.md`, pa ne treba mjeriti iznova. *Cigla ne smije platiti tuđim crvenilom.*

#### 🔥 Usput izmjereno: JEDNA Leonova odluka gasi 7 od 11 fatalnih pravila palete

`palette:breakdown -- --list` nabraja 11 fatalnih pravila (zakucan tekst na ispuni). Nakon što je
lista pročitana redak po redak, ispada da ih **sedam dijeli isti uzrok**: `white`/`#fff` na
ispuni `var(--danger)` (#1 `blind-map`, #6 i #7 `profile`, #8 `progress`, #10 `quiz`,
#11 `sidebar`) ili `var(--success)` (#9 `quiz`).

Nijedno se ne može popraviti bez tokena `--on-danger` / `--on-success`, **kojih nema** — a
trebaju li uopće, ovisi o otvorenom pitanju **smiju li zelena i crvena biti ISPUNA ili samo
obrub i tekst.** Dotad ta pravila nose **C5a/3, C5a/4, C6 i C7 zajedno**, i nijedna ih cigla ne
može ugasiti sama. Zapisano ovako imenovano jer je dosad izgledalo kao sedam odvojenih dugova
raspoređenih po pet datoteka.

---

## 12 · C5b — gradivo i vježbe (mjera napravljena, cigla NIJE započeta)

> **Ovo je mjera prije koda, ne izvještaj.** Napisana je na kraju C5a/4 (2026-08-30) da sljedeća
> sesija ne počne s pretpostavkom. Sve brojke su izmjerene, ne procijenjene; gdje je mjereno u
> pregledniku, to je rečeno. **Nijedna datoteka C5b-a još nije dirana.**

Opseg (§3): `learn.css` · `learn-blocks.css` · `math.css` · `exercises.css` · `blind-map.css` —
**1876 redaka, 336 pravila, 0 `!important`**.

### 12.0 C5b NIJE isti posao kao C5a — mjera to kaže odmah

| pitanje | C5a (modovi) | **C5b (gradivo + vježbe)** |
|---|---|---|
| pravila u `responsive/*` koja diraju površinu | **179** | **0** (v. niže) |
| pragovi razasuti po tuđim datotekama | 18 | **nijedan** |
| pravila UNUTAR vlastitih datoteka | — | **336**, od toga **68 u `@media`** |
| `!important` | 0 | **0** |
| **pravila sa ID-selektorom** | ~0 | **102 od 112 u `learn.css`** |

C5a je bila *„skupi razasutu ljestvu uz komponentu"*. **C5b je nešto drugo: prvo razoružati
specifičnost, pa tek onda migrirati.**

### 12.1 🔴 GLAVNI NALAZ: `learn.css` je sagrađen na `#learn`, a utility to NE MOŽE pobijediti

Zaglavlje datoteke to i priznaje, riječ po riječ:

> *„This file is loaded LAST to override any conflicts from responsive.css. **Uses #learn prefix
> for specificity.**"*

`#learn` se u datoteci pojavljuje **153 puta**; **102 od 112 pravila** nosi ID u selektoru.
Specifičnost takvog pravila je **1-1-0**, a Tailwind utility je **0-1-0** — i to što utilityji
stoje **zadnji i neuslojeni** tu ne pomaže, jer redoslijed odlučuje tek kad je specifičnost
jednaka.

**Izmjereno u pregledniku, na pravoj stranici, s kontrolom:**

| meta | pravilo koje danas vrijedi | dodana klasa | ishod |
|---|---|---|---|
| `#learn .learn-container` | `padding: 14px` (+ upit ≥768 → 28px) | `p-6` (24px) | **28 px → 28 px** ⛔ utility ne prolazi |
| **kontrola:** `.progress-card:not(.main)` | `padding: 1.25rem` (0-1-0) | `p-6` | **20 px → 24 px** ✅ utility prolazi |

Kontrola je bitna: bez nje bi „utility ne prolazi" moglo značiti i da klasa nije generirana.
Prolazi — samo ne kroz ID.

> ⚠️ **Prva verzija ove mjere imala je pokvarenu kontrolu:** uzela je `.progress-card`, a prva
> takva kartica je `.main`, koja **od C5a/4 već nosi `p-6`** — pa je „nije prošao" ispalo iz
> posve drugog razloga. Šesti put u fazi da mjerač zavara prije nego cigla pukne. *Kontrola koja
> ne bi pokazala razliku ni da je tvrdnja lažna nije kontrola.*

**Posljedica za redoslijed rada:** dok `#learn` stoji, **nema smisla pisati nijedan utility na
toj površini** — Tailwind bi ga generirao, klasa bi stajala u markupu, a prikaz se ne bi
promijenio. Isti razred tihog promašaja kao `@source not inline` (isključenje sprječava
generiranje, ne pisanje), samo s druge strane.

### 12.2 ✅ OBRNUTI RIZIK je NULA — a prva verzija ovog odjeljka tvrdila je „dva"

`#learn` je napisan **da bi tukao `responsive.css`**. Makne li se, pravila koja godinama gube
mogu početi pobjeđivati. Zato je prvo pitanje C5b-a bilo: **koja?**

**Prvi odgovor (2026-08-30, analiza PO SELEKTORU) glasio je „dva".** Iz živog DOM-a pokupljene su
**32 klase koje stvarno postoje unutar `#learn`**, pa je provjereno koja bi ih pravila iz
`css/responsive/*` tada dohvatila. Ispala su dva, oba preko `.filter-btn`, oba na telefonu:

| datoteka | red u `app.css` | upit | kandidat |
|---|---|---|---|
| `responsive/04` | 94 | `@media (max-width: 374px)` | `.filter-btn { padding: .5rem .75rem; font-size: .75rem; min-height: 40px }` |
| `responsive/06` | 96 | `@media (max-width: 767px) and (hover: none) and (pointer: coarse)` | `.control-btn, .action-btn, .filter-btn, .category-btn { min-height: 48px }` |

**Ta je tvrdnja OBORENA mjerom (2026-08-30, isti dan).** Analiza po selektoru gleda samo tko
selektira — a kad skidanje ID-a **izjednači** specifičnosti (0-1-0 vs 0-1-0), odlučuje ono što ta
analiza uopće nije pitala: **redoslijed u snopu.** `learn.css` je u `css/app.css` na **105**,
dakle **KASNIJI od oba kandidata** (94 i 96). Learn i dalje pobjeđuje — samo sada zato što je
zadnji, a ne zato što ima ID. I svako je svojstvo pokriveno: bazno `.filter-btn` u `learn.css`
nosi `min-height: 44px`, a `@max-380` blok nosi i `padding` i `font-size`.

**Mjereno u pravom Chromiumu**, prepisivanjem selektora u CSSOM-u (pravilo ostaje na **istom
mjestu u kaskadi**, mijenja mu se samo specifičnost — 101 pravilo prepisano):

| kontekst | `min-height` | visina | `padding-top` | `font-size` |
|---|---|---|---|---|
| dodir (coarse), 360 px | 44 → **44** | 44 → **44** | 6 → **6** | 12.48 → **12.48** |
| dodir (coarse), 320 px | 44 → **44** | 44 → **44** | 6 → **6** | 12.48 → **12.48** |
| miš, 360 px | 44 → **44** | 44 → **44** | 6 → **6** | 12.48 → **12.48** |
| miš, 320 px | 44 → **44** | 44 → **44** | 6 → **6** | 12.48 → **12.48** |

⇒ **Skidanje `#learn` ne mijenja ništa — ni na filter-gumbima.** Obrnuti rizik je **nula, ne dva**,
i prije/poslije mjera na 320/374/375 px više nije uvjet nego rutinska potvrda.
⚠️ Ono što iz prve verzije **ostaje točno**: ta dva pravila **ne rade ništa ni danas** — pa ako se
netko oslanjao na 48 px dodirnu metu filter-gumba u učenju, **nikad je nije imao.** Learn ima
svojih **44 px** (Appleov minimum, WCAG 2.5.5 AAA), pa nedostatak nije fatalan — ali `responsive/06`
je pisan s namjerom da na dodir bude 48, i ta namjera **nikad nije stigla do učenja.**

> ⚠️ **DVIJE POUKE, obje o mjeraču — sedma i osma u fazi.**
> **① Prazan `CSSRuleList` je truthy.** Prva verzija ovog mjerača hodala je stablom s
> `if (r.cssRules) { rekurzija; continue; }`. Otkad postoji ugniježđeni CSS, **i `CSSStyleRule`
> ima `cssRules`** — prazan, ali truthy — pa je svako obično pravilo završilo kao „spremnik" i
> preskočilo obradu. Ispis je bio **`prepisanih pravila: 0`** uz uredna četiri „bez promjene".
> Da nije ispisivao **koliko** je prepisao, taj bi nalaz prošao kao potvrda.
> **② Kontrola je uhvatila ono što brojač ne bi.** „Bez promjene" smije značiti „nema
> natjecatelja" samo ako je ID **doista** pao. Dokaz je izravan: `.learn-container` + `p-6`
> **10 px → 24 px** ✅ — dok ID stoji, isti utility ne prolazi (§12.1). *Mjerač koji ne izvještava
> o vlastitom opsegu nije mjerač nego mišljenje.*

### 12.3 Ljestva C5b-a je već uz komponentu — ali ima SVOJE pragove

`responsive/*` ne sadrži nijedno pravilo za ovu površinu. (Tri naizgled pogotka su tuđa:
`.toast.show` — `show` je generičko stanje koje `blind-map.css` koristi za nešto drugo — i dva
gornja `.filter-btn`, koja gube od `learn.css` **i s ID-om i bez njega** — §12.2.) To je ista
situacija kao browse u C4b, i
**dobra vijest: nema seobe ljestve, pa nema ni zamke pomicanja u kaskadi (pravilo ④).**

Loša vijest je što su pragovi **vlastiti i drukčiji od svih ostalih**:

| prag | pravila | gdje |
|---|---|---|
| `screen and (min-width: 768px)` | 13 | `learn.css` |
| `screen and (max-width: 380px)` | 12 | `learn.css` |
| `(max-width: 640px)` | 11 | `learn.css` |
| `screen and (min-width: 1024px)` | 9 | `learn.css` |
| `screen and (max-width: 430px)` | 4 | `learn.css` |
| `screen and (max-width: 767px)` | 3 | `learn.css` |
| `(prefers-contrast: high)` · `(max-width: 767px)` · `(min-width: 768px)` · `(orientation: landscape)` · `(prefers-reduced-motion)` | 2+2+2+1+1 | `blind-map`, `exercises`, `math`, `learn-blocks` |

**`380`, `430` i `640` ne postoje nigdje drugdje u projektu.** Tehnički izlazni uvjet faze glasi
*„jedan skup breakpointa"* (§2), pa ih C5b mora ili opravdati ili spustiti na zajedničke — a to je
promjena prikaza i traži mjeru, ne pretpostavku. Uz to su ovdje `screen and (…)`, dok je ostatak
projekta u golom obliku; za medij `screen` to je isto, ali **nije isti tekst**, pa svako traženje
po uzorku mora računati na oba oblika.

### 12.4 Kako je posao raspoređen po datotekama

| datoteka | redaka | pravila | u `@media` | ID-selektora | težina |
|---|---|---|---|---|---|
| `learn.css` | 845 | 112 | 47 | **102** | 🔴 najteža — cijela cigla je zapravo ona |
| `exercises.css` | 510 | 119 | **3** | 0 | 🟢 gotovo ravna; najviše pravila, najmanje uvjeta |
| `blind-map.css` | 308 | 56 | 15 | 0 | 🟡 4 upita + dva `@keyframes` |
| `learn-blocks.css` | 177 | 44 | 1 | 0 | 🟢 |
| `math.css` | 36 | 5 | 2 | 0 | 🟢 najmanja |

**Predložena podjela na commite** (nije naredba, nego ono što mjera nosi): **/1** `exercises.css`
+ `math.css` + `learn-blocks.css` (ravno, bez ID-a, nosi 1 fatalno pravilo palete) · **/2**
`blind-map.css` · **/3** `learn.css`, i to u dva koraka — **prvo skidanje `#learn` uz dokaz
`css:diff` = 0**, pa tek onda migracija.

### 12.5 Tvrde granice koje C5b NE SMIJE prijeći

- **`js/blocks-renderer.js` i engine vježbi se NE DIRAJU** (§3). Mijenja se CSS oko njih.
  Prikaz blokova ide isključivo kroz `renderContentBlocks()`; svaki tekst iz podataka i dalje
  mora kroz `SokratBlocks.esc` (BUG-024/025).
- **Tailwind NIKAD u `data/`** (ADR-028) — gradivo zadržava semantičke klase. Ovo je jedina C5b
  površina gdje je ta granica blizu: `learn-blocks.css` stilizira ono što renderer crta **iz
  podatka**, pa se klase moraju mijenjati u CSS-u i rendereru, nikad u gradivu.
- **`lb-color-*` nastaje u runtimeu** — zato je u osnovici `check:orphan-css`. Ne brisati kao
  siroče.
- **KaTeX** (`math.css`, 36 redaka): `.katex-display` je također imenovano siroče. KaTeX-ov
  vlastiti CSS nije naš i ne migrira se.
- C5b je nosio **3 od 11 fatalnih pravila palete**; **od C5b/0 su to 2 od 10** (§12.7):
  ~~`learn-blocks.css` `.lb-video__icon`~~ **ugašeno** · `learn.css` `#learn .learn-card-header
  span` (poluprozirno bijelo na poluprozirnom bijelom) → **C5b/3** · `blind-map.css`
  `.map-clear-btn:hover` (bijelo na `--danger`) → **C5b/2**.
  ⚠️ **Zadnje je jedno od sedam koja gasi ADR-032** (semantičke ispune) i C5b ga ne rješava
  sam nego po tom receptu: ispuna ostaje puna, prilagođava se tinta.

### 12.6 Rute koje C5b mora predati mjeračima

`css:diff` i `check:contrast:live` mjere prazan ekran ako im se ne preda ruta (§ „C5a, C5b, C6 i
C7 moraju predati svoje rute"). Za C5b su to:

```
CSS_DIFF_RUTE="#/subject/te2/first-midterm/learn,#/subject/statistics/first-midterm/exercises,#/subject/geography/first-midterm/blind-map"
```

⚠️ **`exercises` i `blind-map` su UVJETNI tabovi — ne postoje na svakom predmetu**, pa ruta mora
imenovati predmet koji ih ima. Izmjereno iz kataloga (2026-08-30):

| značajka | predmeti |
|---|---|
| `features.exercises` | `math` · `statistics` · `accounting` · `academic-writing` · `macroeconomics` |
| `features.blindMap` | `geography` (jedini) |

**`te2` nema ni jedno ni drugo.** Mjerač koji to ne provjeri uspoređivat će prazan ekran i
mirno javiti „0 razlika" — isti razred kao granica dokaza u §11.3 (`.quiz-game` iza `hidden`) i
§11.4 (`.history-item` kojeg nema). *Nula razlika na ekranu kojeg nema nije dokaz.*

### 12.7 ✅ C5b/0 — boje gradiva, PRIJE nego se gradivo migrira (2026-08-31)

Cigla koju mjera nije predvidjela. Priprema za C5b/1 krenula je od tvrdnje `palette-breakdown`-a
da su zakucane boje u ovim datotekama *„stara = neusklađeno, ali **čitljivo**"*. Ta tvrdnja
**nije bila točna**, i to se vidjelo tek kad ih se izmjerilo naspram ploha:

| boja | gdje | na bijelom (`academic`, ZADANA) |
|---|---|---|
| `.lb-color-amber` `#fbbf24` | `learn-blocks.css` | **1.67** |
| `.lb-color-cyan` `#22d3ee` | `learn-blocks.css` | 1.81 |
| `.lb-color-green` `#34d399` | `learn-blocks.css` | 1.92 |
| `.ex-tacc-dr` `#93c5fd` | `exercises.css` | 1.80 |
| `.katex-error` `#ff6b6b` | `math.css` | 2.78 |

**165 usporedbi (11 boja × 3 plohe × 5 blokova tema), 103 ispod AA.** Svih 11 pisano je za tamnu
podlogu i u `chalk`/`mint` prolazi (4.4–10.7) — datoteke su starije od odluke da zadana tema bude
svijetla.

#### 🔴 Zašto to nijedna brana nije vidjela — tri odvojene rupe

**① `check:palette` prepoznaje fatalno samo kad su boja i pozadina u ISTOM pravilu.** Tekst bez
vlastite pozadine nasljeđuje plohu, pa ga klasifikator ne može upariti — i svrsta ga u „stara".
Slijepa točka mu je time **najčešći slučaj koji postoji: obojen tekst.**

**② `check:contrast` mjeri VRIJEDNOSTI tokena, ne njihovu upotrebu.** Sve četiri teme godinama
prolaze AA, a pravila su čitala zakucani hex — token je bio posve nevažan.

**③ `check:contrast:live` mjeri ekran, ali je obilazio SAMO `te2`** — predmet koji nema ni
`exercises` ni `blind-map`. Te dvije plohe brana **nikad nije izmjerila.** Čim su rute dodane
(11 → 13), odmah je pao nalaz koji ondje stoji: `.map-diff-btn` ima
`background: var(--card-bg, #fff)`, a **`--card-bg` nije definiran nigdje u `css/`** → u
`chalk`/`mint` svijetla tinta na bijeloj plohi, **1.43**.

> ⚠️ **`var()` S FALLBACKOM IZGLEDA KAO TEMATIZIRANOST, A BEZ DEFINICIJE JE ZAKUCANA VRIJEDNOST
> S UKRASOM.** Prebrojano: tri varijable se koriste a **nijedna ne postoji** — `--card-bg`
> (1 upotreba, dala nevidljiv tekst), `--grad` (1, dala jedno od 11 fatalnih pravila palete) i
> **`--border-color` (11 upotreba)**. Prve dvije su popravljene; treća je imenovana i ostavljena
> C5b-u. **✅ Riješena u fazi MREŽA B1 (2026-08-31)** — preusmjerena na postojeći `var(--border)`;
> usput izmjereno da je „poluproziran fallback" vrijedio za 1 od 11 (10× je bio pun `#334155`).
> Brana `check:tokens` sad čuva cijeli razred.

#### 🔧 Što je izvedeno

- **8 tinti autora postalo je tokeni** `--color-ink-<ton>` u svih 5 blokova tema. Vrijednosti su
  **izračunate, ne odabrane okom**: zadržan ton, pomaknuta samo svjetloća do ≥ 5.0:1 na najgoroj
  plohi (margina nad AA 4.5), uz **zasićenost ≤ 75 % na svijetlim temama** — bez tog ograničenja
  ispadaju neonske (`#ce0a0a`) i ne pripadaju uz `--color-danger: #c0332b`. Tamne teme se jedva
  miču (0–5 točaka svjetloće): boje su i bile pisane za njih.
- **Ime klase je ostalo netaknuto.** `lb-color-<ton>` se serijalizira u model bloka i round-trippa
  kroz editor — to je **ugovor, ne stil**. Mijenja se vrijednost, ne ime.
- **`check:contrast` ih je dobio u `AS_TEXT`: 238 → 358 provjera** (+120 = 8 × 3 plohe × 5 tema).
  ⚠️ Tokeni se NE smiju pisati kao `var(--color-danger-ink)`: brana **parsira** `tokens.css` i
  `var()` joj nije hex → token bi tiho ispao iz mjerenja.
- **Uzorci boja u traci editora čitaju iste tokene** (`TB_COLORS`). Dotad su ondje stajale
  zakucane hex-vrijednosti — druga kopija istoga — pa je uzorak pokazivao boju za tamnu temu i
  kad je autor na svijetloj.
- **`.lb-video__icon`**: `var(--grad, …)` + `color:#fff` → puna ispuna `--color-brand-500` +
  `--color-on-brand` (ADR-032: ispuna ostaje puna, prilagođava se tinta).
- **`.lb-video`**: zakucani tamni radijal (`#1e293b → #0f172a`) → isti radijal iz tokena.
- **Paleta: `learn-blocks.css` 15 → 7**, ukupno **102 → 94**; **fatalnih 11 → 10**.

#### 🧪 Dokaz — i zašto je trebao NOVI test

`learn-blocks.css` se **ne da dokazati kataloškom rutom.** Izmjereno na četiri predmeta (`te2`,
`statistics`, `geography`, `accounting`): na `…/learn` se iscrtavaju **samo `.lb-legacy` i
`.lb-table-wrap`** — gradivo je v1 HTML kroz DOMPurify. Od 44 pravila datoteke katalog dodiruje
**dva**; ostala 42 žive u editoru i u korisnikovim materijalima. **Ruta iz §12.6 dakle ne pokriva
datoteku kojoj je namijenjena** — da je cigla išla po njoj, `css:diff` bi javio „0 razlika" za 42
od 44 pravila i to bi prošlo kao dokaz.

Zato **`tests/learn-blocks-contrast.spec.js`**: crta blokove kroz `window.renderBlocks` (isti ulaz
koji koristi `tests/learn-parity.spec.js`, dostupan bez prijave) i mjeri iscrtano kroz sve četiri
teme — 8 tonova × 4 teme.

> ⚠️ **KONTROLA: tvrdnja GRIZE.** Sa starim vrijednostima nametnutima preko tokena, **16 od 32**
> mjerenja pada — i to točno na dvije svijetle teme (`paper`, `academic`), dok `chalk`/`mint`
> prolaze. Test koji ne bi pao ni da je tvrdnja lažna nije test.

#### 🐞 Mjerač je bio prvi kvar — deveti put u fazi

**`css:diff` je dobio rute s vodećom kosom crtom** (`/#/subject/…`), a alat sam dodaje `/`
(redak 413) → `http://…//#/…`, dakle prazna stranica. Ispis: **„5 elemenata, 0 razlika"** kroz
svih 9 kombinacija, uz uredan zeleni zaključak. Uhvaćeno **samo zato što alat ispisuje broj
dotaknutih elemenata** — u C5a je na ovakvim rutama mjerio tisuće. Spec §12.6 rutu piše ispravno
(bez `/`); greška je nastala pri prepisivanju.

Uz to su **dva mjerača pala naglas**, i to je uspjeh a ne šteta: prvi je plohe tražio s
`css.indexOf('[data-theme')` i pogodio **komentar** ~1450 znakova prije prve definicije; drugi je
imao `\s` u JS **string-literalu** (gdje je to samo slovo `s`), pa je regex tražio `surface-0:s*`.
Oba puta je ispis opsega (`dotaknuto: 0`) spriječio da izmišljotina prođe kao nalaz.

> *Mjerač koji ne izvještava o vlastitom opsegu nije mjerač nego mišljenje.* Pravilo ③ iz
> `CLAUDE.md` bilo je u ovoj sesiji **triput** jedina obrana.

#### ⛔ Što C5b/0 NAMJERNO nije napravio

- **Nijedna datoteka nije migrirana na Tailwind.** To je i dalje C5b/1–/3; ova cigla samo miče
  minu koja bi se pri migraciji prenijela dalje.
- **`--border-color` (11 upotreba) nije dirano** — fallback je poluproziran, dakle blijed a ne
  nevidljiv; pripada ciglama koje te datoteke ionako otvaraju.
- **`.map-clear-btn:hover`** (bijelo na `--danger`) ostaje: to je jedno od sedam pravila koja gasi
  **ADR-032**, ne ova cigla.

### 12.8 ⚠️ MJERA JE OBORILA REDOSLIJED CIGLI — vlasništvo markupa nije bilo mjereno (2026-08-31)

§12.4 je posao razdijelio po **broju pravila, medijskih upita i ID-selektora**. Ta je podjela
propustila os koja o migraciji odlučuje više od svih triju: **tko smije pisati markup.** Metoda
ove faze je *„utility u markup, pravilo obriši"* — a u projektu je **nula `@apply`**, pa datoteka
čiji markup ne smijemo dirati **nema čime migrirati**.

**Izmjereno** (za svako pravilo: koji izvori spominju bar jednu njegovu klasu):

| datoteka | pravila | naša | ⛔ engine / renderer | vlasnik većine |
|---|---|---|---|---|
| `exercises.css` | 119 | **6** | **108** | `js/exercises.js` |
| `learn-blocks.css` | 44 | 1 (+10 runtime `lb-color-*`) | **33** | `js/blocks-renderer.js` |
| `math.css` | 5 | 2 | — (3 su KaTeX-ove, ne migriraju se) | KaTeX |
| `blind-map.css` | 51 | **35** | ~9 | `index.html` |
| `learn.css` | 112 | **96** | ~10 | `js/learn.js` + `index.html` |

⚠️ **C5b/1 je time bio NAJMANJE migrabilna cigla od tri, a stajao je prvi.** C5b/2 i /3 su
obrnuto — gotovo posve naši. *Brojanje pravila mjeri koliko posla ima; vlasništvo markupa mjeri
smije li se posao uopće obaviti.*

> ⚠️ Mjera je gruba u jednom smjeru i to je namjerno rečeno: pravilo se pripisuje svakom izvoru
> koji spominje **bar jednu** njegovu klasu, pa generička imena (`show`, `active`) napuhuju
> **miješane** stupce. Jednovlasnički stupci — 108, 33, 35, 96 — su pouzdani i nose zaključak.

#### ✅ ODLUKA (Leon, 2026-08-31): granica se otvara USKO

`js/exercises.js` i `js/blocks-renderer.js` smiju primiti **isključivo prezentacijske klase** —
**nula izmjena logike, ocjenjivanja, `esc`-a i sadržaja.** Obrazloženje je da granica ovako
postavljena ne odgađa problem nego ga čini **nerješivim**: izlazni uvjet C7 (*„u repozitoriju
nema starog CSS-a"*) za te dvije datoteke ne bi mogao biti ispunjen nikada.

**Što granica i dalje znači** (nepromijenjeno): engine se **ne mijenja za sadržaj**
(`EXERCISES_ENGINE.md` §Slojevi, ADR-018) · prikaz blokova ide isključivo kroz
`renderContentBlocks()`, a svaki tekst iz podatka kroz `SokratBlocks.esc` (BUG-024/025) ·
**Tailwind nikad u `data/`** (ADR-028).

**Brane koje tu odluku čuvaju:** `tests/unit/blocks-renderer.test.js` +
`tests/unit/legacy-html-coverage.test.js` (renderer) · `test:unit` graderi (engine) ·
`css:diff = 0` na rutama iz §12.6 · `check:tailwind` (dinamička imena klasa ostaju zabranjena).

#### Rez po SVOJSTVU — što ostaje u CSS-u (pravilo ② iz §11.1)

Izmjereno, jer utilityji stoje zadnji i neuslojeni pa svojstvo koje preživjeli upit još mijenja
ne smije u utility:

| datoteka | preživjeli upit | selektori | svojstva koja NE idu u utility |
|---|---|---|---|
| `exercises.css` | **jedan** — `(max-width: 640px)` | `.ex-container` · `.ex-header h1` · `.ex-actions .ex-btn` | `padding` · `font-size` · `flex` |
| `math.css` | `(max-width: 767px)` | `.katex` · `.katex-display` | `font-size` |
| `learn-blocks.css` | **nijedan** | — | — (sve je slobodno) |

⚠️ **`640` nije ad-hoc prag nego točno Tailwindov `sm`** (§12.3 ga je vodio kao „ne postoji
nigdje drugdje" jer je gledao samo `css/`, ne i ljestvicu tokena). Prelazak `max-width: 640px` →
mobile-first `sm:` **pomiče granicu za 1 px**: staro pravilo vrijedi **na** 640, `sm:` vrijedi
**od** 640. To je promjena prikaza, koliko god sitna — pa se mjeri na širini **640**, a ne samo
na 375/768/1280.

### 12.9 ✅ C5b/1a — `exercises.css`, i tri mjerača koja su lagala prije nego je pravilo palo (2026-08-31)

Prva migrirana površina iza otvorene granice (§12.8). **Rez ide po SVOJSTVU** (pravilo ② iz
§11.1): 12 mjesta u `js/exercises.js` i `index.html` dobilo je skelu kao utilityje, komponenta je
ostala u CSS-u.

**Dva svojstva su NAMJERNO ostala u CSS-u**, i oba iz istog razloga — nešto ih još dira:

| svojstvo | tko ga dira | zašto ne u utility |
|---|---|---|
| `padding` na `.ex-container` | `@media (max-width: 640px)` | utilityji stoje zadnji i neuslojeni |
| `margin-bottom` na `.ex-modes` | `.ex-modes:has(+ .ex-mode-desc)` | pravilo ② ne pita **tko pobjeđuje** (`:has` je 0-2-0 i dobio bi) nego **dira li svojstvo itko drugi** |

Usput su nestala **dva inline `style` atributa** (`.ex-actions`, `.ex-card-title`) — inline stil
je specifičnost koju ni utility ni CSS ne mogu pregaziti, pa je svaki od njih bio tiha iznimka.

#### 🐞 Tri nalaza, i sva tri je uhvatio preglednik, ne čitanje

**① `flex-wrap` je bio ISKLJUČEN, i to tiho.** Ime je na popis `@source not inline` ušlo u K2b
kao **šum iz proze** — bilješka u `js/studio.js` doslovno piše `flex-wrap:wrap`. Od ove cigle ga
vježbe **stvarno pišu kao klasu**, pa isključenje više nije gasilo šum nego živo pravilo.
⚠️ Kvar je bio nevidljiv svakoj statičkoj brani: `check:tailwind` je javio **„6/6 čisto"**, jer
isključenje je legitiman unos — a `.flex-wrap` se jednostavno nije generirao. Uhvatio ga je
`css:diff`: **35 elemenata × 4 širine = 140 razlika, sve isto svojstvo.** Micanje s popisa slijedi
put `grid` (C4b) i `fixed` (C5a), uz istu prethodnu provjeru: u `css/**` nema pravila `.flex-wrap`.
*Rečenica iz zaglavlja tog popisa vrijedi treći put: popis se mijenja u ISTOM koraku u kojem se
piše klasa, nikad poslije.*

**② Vodeća kosa crta, jedanaesti put mjerač kao prvi kvar.** Prvi `css:diff` javio je uredno
zeleno na **1131 elemenata** — MSYS je rutu pretvorio u `#C:/Program Files/Git/subject/…`.
Ispravna ruta ima **8041**. Spasio je isključivo **brojač opsega u ispisu**; bez njega bi „0
razlika" na krivoj stranici prošlo kao dokaz. Lijek je `MSYS_NO_PATHCONV=1`, ne druga ruta.

**③ „Nula razlika" je bila tvrdnja o ekranu kojeg nema.** Od 12 migriranih mjesta njih **7**
postoji tek kad se vježba **otvori** — `.ex-fields`, `.ex-field`, `.ex-choice`,
`.ex-choice-options`, `.ex-actions`, `.ex-modes`, `.ex-table-wrap` — a `css:diff` je dotad mjerio
isključivo početno stanje rute.

#### 🔧 Alat: `css:diff` je dobio `CSS_DIFF_KLIK`

Selektor na koji se klikne **nakon učitavanja, na obje strane**, pa se mjeri stanje. Ako
selektora nema, mjerenje **pada glasno** umjesto da tiho izmjeri neotvorenu stranicu — isti
zahtjev koji ta skripta već postavlja sebi ispisom opsega. Trebat će ga i C5b/2 (`blind-map`) i
C5b/3, i svaka buduća cigla s uvjetnom površinom.

#### Dokaz

**Prije** mjerenja provjereno zasebnom sondom da je svih **13** migriranih klasa doista bilo na
ekranu (`statistics`, `accounting`, `math`; do 6 vježbi po predmetu) — *`FALI: (ništa)`*. Bez toga
bi „0 razlika" bila tvrdnja o nenacrtanom ekranu, dakle točno kvar ③.

| stanje | širine | usporedbi | razlika |
|---|---|---|---|
| popis vježbi | 375 · 640 · 768 · 1280 | 32 164 | **0** |
| otvorena vježba (`.ex-card`) | 375 · 640 · 768 · 1280 | 31 440 | **0** |
| `ex-choice` (`t1-2-concepts`) | 375 · 640 · 1280 | 23 580 | **0** |
| `ex-table-wrap` (`t2-iqr-1`) | 375 · 640 · 1280 | 23 499 | **0** |

⚠️ **640 je u popisu širina namjerno:** `max-width: 640px` je točno Tailwindov `sm`, pa prelazak
na mobile-first pomiče granicu za 1 px (staro vrijedi **na** 640, `sm:` **od** 640). Izmjereno —
razlike nema, ali brojka nije smjela ostati nepokrivena.

Puna suita **533 prošlo / 0 palo** · `preflight` **EXIT 0** · `check:tailwind` **114 utilityja,
svi namjerni** · `check:palette` **93** (osnovica spuštena s 94 — pad je iz C5b/0, `blind-map`).

#### ⛔ Što C5b/1a namjerno nije napravio

- **`learn-blocks.css` i `math.css` ostaju za C5b/1b** — i to nije podjela po veličini nego po
  **DOKAZU**: katalog od `learn-blocks.css` iscrtava **2 od 44 pravila** (gradivo je v1 HTML kroz
  DOMPurify), pa `css:diff` na kataloškoj ruti mjeri **prazno**. Dokaz mora ići kroz
  `window.renderBlocks`, kao u `tests/learn-blocks-contrast.spec.js`. Miješati te dvije vrste
  dokaza u jedan commit značilo bi da polovica commita nema nijedan.
- **Komponente vježbi nisu dirane** (`.ex-card`, `.ex-btn`, `.ex-opt`, `.ex-input`, T-konta,
  journal) — one su vizualni jezik, ne skela; njihova sudbina ide s C7.
- **`.lb-imath` ostaje u CSS-u** iako je `display: inline` skela: `inline` je na popisu
  isključenih imena i ne vrijedi ga skidati zbog jednog pravila.

### 12.10 ✅ C5b/1b — `learn-blocks.css`, i `math.css` koji je iz opsega izašao MJEROM (2026-08-31)

Druga polovica C5b/1. Odvojena od /1a **po dokazu, ne po veličini**: kataloška ruta od ove
datoteke iscrtava **2 od 44 pravila**, pa ondje `css:diff` mjeri prazno.

#### `math.css` NE MIGRIRA — i to nije preskakanje nego nalaz

Sva tri selektora (`.katex`, `.katex-display`, `.katex-error`) su **KaTeX-ov vlastiti izlaz**.
Mi te elemente ne emitiramo ni na jednom mjestu, pa **nema markupa u koji bi utility išao** — i
oba `@media` pravila gađaju isto to. Od 5 pravila migrabilnih je **0**. §12.5 je to već tvrdio
(*„KaTeX-ov vlastiti CSS nije naš"*); ovdje je prvi put i izmjereno.

#### Izvedeno u `learn-blocks.css`

Skela je otišla u `js/blocks-renderer.js` (**7 mjesta, isključivo klase**): `.lb-figure`,
`.lb-figure__img`, `.lb-video`, `.lb-video__play`, `.lb-table-wrap` (**dva puta** — `renderTable`
i runtime-omot legacy tablica), `.lb-table`, `.lb-formula`. Tri pravila su time ostala prazna i
**obrisana** (`.lb-figure`, `.lb-video__frame`\*, `.lb-table-wrap`).

**Dva svojstva su NAMJERNO ostala u CSS-u:**

| svojstvo | zašto |
|---|---|
| `margin` na `.lb-formula` | pregazuje ga `.lb-formula--inline`; utility bi tu bitku **dobio** (ista specifičnost, kasnije u bundleu) i slomio inline formule |
| `display: block` na `.lb-video__frame` | `block` je na popisu isključenih imena → utility se **ne generira** |

#### 🐞 Mjerač je bio prvi kvar DVANAESTI put — i napisao sam ga ja

Prva verzija usporedbe gradila je ključ elementa od **imena klasa**, a cigla mijenja upravo
klase. Ishod: **138 „razlika"** koje su bile isti element uspoređen sam sa sobom pod drugim
imenom. Ključ mora biti **strukturni položaj** (`tag[index]`). *Mjerač ne smije ovisiti o onome
što se mijenja.*

#### 🐞 Dva prava nalaza koja je to mjerenje onda izbacilo

**① `display: block` se nije generirao.** Isti razred kao `flex-wrap` u /1a: `block` je na
popisu `@source not inline`, pa je iframe videa pao na `inline`. Ovdje popis **nije diran** —
`block` je pregeneričko ime u skupnoj zabrani i ne vrijedi ju raspetljavati zbog jednog pravila.
*Drugi put u jednoj cigli da tiho isključenje pojede živo pravilo; obje je uhvatio preglednik.*

**② Vlastiti argument oboren mjerenjem.** Bilo je zapisano da `text-align` i `overflow-x` na
inline `<span>`-u „nemaju učinka", pa su utilityji dani samo blok-varijanti formule. Izmjereno:
izračunata vrijednost se **mijenja** (`auto → visible`, `center → start`). Staro pravilo je
vrijedilo za **obje** varijante, pa ih obje i dobivaju. *Kad se tvrdnja da izmjeriti, ne brani se
argumentom.*

#### Dokaz

Mjeri se ono što renderer **stvarno nacrta**, kroz `window.renderBlocks` (isti put kao
`tests/learn-parity.spec.js`), radno stablo vs `git worktree` reference, 36 svojstava po
elementu:

| | |
|---|---|
| pokrivenost | **9 od 9** migriranih klasa nacrtano (`FALI: (ništa)`) — mjereno **prije** klika na fasadu videa i **poslije** njega, jer klik fasadu zamijeni iframeom |
| usporedbe | 58 elemenata × 3 širine (375 · 768 · 1280) = **174** |
| razlika | **0** |

⚠️ **Dva unit-testa renderera su pala i to je bilo ispravno.**
`tests/unit/blocks-renderer.test.js` **pina točan markup** (slika, formula), pa je promjena klasa
tražila ručnu potvrdu — što je i smisao te brane nad datotekom koja je sigurnosna granica.
Ažuriran je isključivo dio s klasama; tvrdnje o `esc`/`safeUrl` su netaknute.

`preflight` **EXIT 0** · siročad **46 → 45** · `check:tailwind` **122 utilityja, svi namjerni**.

#### Time je C5b/1 zatvoren

Ostaje **C5b/2** (`blind-map.css` — 35 od 51 pravila je naše, `index.html`) pa **C5b/3**
(`learn.css` — prvo skidanje `#learn` uz `css:diff` = 0, pa migracija).

\* `.lb-video__frame` je obrisan kao pravilo pa **vraćen sa samo `display: block`** — v. tablicu gore.

### 12.11 ✅ TRI RUPE IZ C5b/1 ZATVORENE — jedna od njih je bila propust, ne odgoda (2026-08-31)

Revizija na Leonov upit *„je li sve od ovoga riješeno"*. Od svega što je cigla iznijela, tri
stvari nisu bile zatvorene — i prva nije bila odgoda nego **greška u postupku**.

**① Vodeća kosa crta u `css:diff` dobila je BRANU, dvije cigle prekasno.** Taj je kvar bio
**deveta** pojava „mjerač je prvi kvar" (C5b/0) i tada je uredno zapisan u spec, `CLAUDE.md` i
memoriju. U C5b/1a se **ponovio istoj osobi koja je zapis napisala** — alat je javio zeleno na
1131 elemenata umjesto 8041. ADR-027 traži da rub koji prepoznaš **isti čas dobije test**; ovaj
je dobio samo prozu, dvaput, i dvaput nije upalio. *Proza ne izvršava ništa.*
Sada `provjeriRute()` pada na: vodeću crtu · putanju od MSYS-a (`:` ili `Program Files`, uz
uputu `MSYS_NO_PATHCONV=1`) · rutu koja ne počinje s `#/`. Obrnuta provjera: sve tri krive rute
padnu, ispravna prođe.

**② `npm run blocks:diff` — dokaz za blokove gradiva postao je ALAT, ne jednokratna sonda.**
Dokaz iz C5b/1b živio je u scratchpadu, dakle nitko ga nije mogao ponoviti, a sljedeći bi ga
gradio ispočetka — vjerojatno s istim kvarom (ključ od imena klasa). Skripta nosi oba pravila
zapisana u zaglavlju: **ključ je strukturni položaj, nikad ime klase** (izmjereno: 138 lažnih
razlika) i **pokrivenost se dokazuje prije razlike**.

**③ Pokrivenost više nije ad-hoc.** Alat prvo provjeri da je svaka od **20** klasa iz `META`
doista u DOM-u i **padne ako nije** — uključujući `.lb-video__play` (postoji samo PRIJE klika na
fasadu) i `.lb-video__frame` (samo POSLIJE). Obrnuta provjera: umetnuta nepostojeća klasa obori
mjerenje (`NIJE NACRTANO: lb-NE-POSTOJI`, izlaz 1).

Izmjereno nakon uvođenja: **20/20 klasa nacrtano, 174 usporedbe × 36 svojstava, 0 razlika.**

⚠️ **Ostaje svjesno otvoreno:** ~~`--border-color`~~ (**✅ riješen u MREŽI B1, 2026-08-31** —
`var(--border)` + brana `check:tokens`) · kolačić-traka je ~280 ms ispod AA **dok ulazi**
(WCAG sudi konačno stanje, `prefers-reduced-motion` to gasi — čeka Leonovu odluku).
