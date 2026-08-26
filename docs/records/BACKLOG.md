# Backlog — parkiralište ideja

> Ovdje skupljamo ideje da se ne izgube. Nije obaveza — kad ideja sazri, seli se u
> [ROADMAP.md](../plan/ROADMAP.md) kao milestone/korak. Prioritet: 🔥 visok · ➖ srednji · 💤 nekad.

## ✅ RIJEŠENO 2026-08-25 — `TESTING.md` je prestao biti inventar

> **Izvedena je druga opcija (skupine).** Odluku je potvrdilo mjerenje: **52 od 53 speca već
> nosi vlastito zaglavlje**, a od 51 pojma koji je dokument imao „viška" **nijedan nije
> postojao samo ondje** — dakle nije se imalo što izgubiti. Dokument je **41 142 → 12 988
> znakova**. Brojka „46" iz naslova ispod bila je usput i **sama zastarjela: datoteka ih je 53**.
> Nova brana: **7. provjera u `check:docs` — duh-datoteka** (imenovana datoteka mora postojati),
> i ona mjeri **samo dokumente koji tvrde kako JEST** (`workflow/`, `architecture/`, `CLAUDE.md`);
> `records/` je povijest, a `plan/`/`subjects/` imenuju hipoteze — prva verzija je to kaznila i
> **7 od 7 njezinih nalaza bili su lažni**.

<details><summary>izvorni zapis stavke</summary>

### `TESTING.md` nabraja specove rukom — 18 od 46 nedostaje (izmjereno 2026-08-24)

> Nađeno revizijom na Leonovo pitanje *„jesi siguran da je sve dobro zapisano"* — dakle ne
> gateom, nego time što je netko pitao. To je samo po sebi nalaz.

`docs/workflow/TESTING.md` imenuje pojedine spec-datoteke u prozi. Prebrojano: **46 datoteka
`tests/*.spec.js`, imenovano 28, nedostaje 18** — među njima `routes.spec.js`, `escaping.spec.js`,
`i18n.spec.js`, `tint-ink.spec.js`, cijeli `*.authed` niz. Uz to je isti dokument tvrdio
**„21 predmet = 17 EN + 4 HR"** dok ih je **24 = 17 + 7**.

⚠️ **Ne rješava se dopisivanjem 18 imena** — to obnavlja isti dug s novim datumom. ADR-027
kaže da proza nosi **zašto**, a inventar živi u kodu. Dvije opcije:

- **Generirati** odjeljak iz `npx playwright test --list` (kao što `check:seo` generira
  sitemap s diska), pa ga gate uspoređuje.
- **Svesti na skupine** („brane rasporeda", „brane pristupačnosti", „authed put") i imenovati
  samo one koje traže objašnjenje ZAŠTO postoje — ostalo prepustiti `tests/`.

Preporuka je druga: popis od 46 imena nitko ne čita, a ono što se doista treba zapisati je
zašto neka brana postoji — a to već stoji u zaglavlju svakog speca.

</details>

## ➖ Katalog je tražilici NEVIDLJIV — hash-rute nisu URL-ovi (izmjereno 2026-08-24)

> Izašlo iz Leonova pitanja o SEO-u. **Nije cigla nego arhitektonska odluka**, i namjerno stoji
> ovdje umjesto u planu — da se ne izvede prije nego je odlučena.

**Izmjereno:**

| | |
|---|---|
| indeksabilnih stranica | **5** (`index`, privacy, terms, faq, contact) |
| predmeta iza `#/subject/…` | **24** |
| lekcija koje tražilica vidi | **nijedna** |

K1 je devet stranica dobilo devet adresa — ali **za preglednik, ne za tražilicu**: fragment
(`#/…`) nije zaseban URL i Google ga ne indeksira kao stranicu.

**⚠️ Nagrada je manja nego što zvuči, i to je već presuđeno.** ADR-028 kaže da je glavni argument
za SSR bio **dijeljeni materijal**, ali da je doseg dijeljenja presuđen kao **link s tajnim
tokenom, bez javne biblioteke** — dakle korisničko gradivo **po dizajnu NIJE javno pronalažljivo**.
SEO time može doseći samo **katalog** i marketinške stranice. Tko ovo bude vagao, neka to uzme
u obzir prije nego procijeni isplativost.

**Što bi tehnički trebalo:** `history.pushState` umjesto hasha u `navigateTo`/`parseRoute` ·
Vercel rewrite (`/(.*) → /index.html`) · dodir u `sw.js` (navigacija je network-first, ali
opseg se mijenja) · `sitemap.xml` bi tek tada imao što nabrajati · `Course` JSON-LD po predmetu
(danas namjerno izostavljen, uz komentar u `index.html`).

**⚠️ Otvoreno pitanje koje se ne smije preskočiti:** i s pravim adresama sadržaj crta **JS iz
`data/*.js`**. Google to renderira, ali sporije i manje pouzdano. Pouzdan odgovor je
**pred-renderirani HTML po lekciji**, dakle build-korak — a to je već pitanje na koje je ADR-028
odgovorio „ne kroz redizajn, nego kao svjesna migracija na vlastite zasluge".

**SEM (plaćeno oglašavanje) je odvojeno i ide POSLIJE:** odluka o budžetu, ne o kodu. Dok su
C4–C7 i POLICA nedovršeni, plaćeni promet dolazi na gradilište.

## ➖ Zakucan engleski nije bio JEDNA traka nego RAZRED — treba `check:i18n` (2026-08-24)

> Nađeno pri cigli `about`: cijela stranica „O nama" imala je **nula `data-i18n`** atributa,
> dakle zakucan engleski tekst od naslova do zadnje kartice. T4 je **isti kvar** našao pet dana
> ranije na cookie-traci i zapisao pouku — ali kao **anegdotu o toj traci** („bila je jedina
> površina sa zakucanim engleskim"). Ta rečenica je bila **neistinita u trenutku pisanja**, a
> nitko ju nije provjerio jer je zvučala kao zaključak.

**Prijedlog:** gate koji broji **nositelje teksta bez ključa** kroz sve stranice, po uzoru na
tvrdnju ③ u `tests/about.spec.js` (ondje je izvedba već napisana i radi): element koji ima
vlastiti tekstni čvor, a nema `data-i18n`, uz **izričit i kratak** popis izuzetaka (vlastita
imena, e-adrese, brojevi). **Osnovica, ne nula** — obrazac `check:palette` / phone-brane, jer je
očekivano da zatečenih pogodaka ima puno i ne smiju držati suitu crvenom.

⚠️ **Zašto ovo nije nusprodukt nego zasebna cigla:** brojka je danas **nepoznata**. Prije nego se
odluči hoće li se prevoditi ili gasiti dvojezičnost, treba je izmjeriti — ista pouka kao
`palette:breakdown` (agregat koji mjeri točno, a savjetuje krivo).

⚠️ **Nije isto što i K5** (editor dvojezično). K5 je mjeren i zna svoju brojku (28 od 48
`studio.*` ključeva nedostaje, `block-editor.js` i `admin-editors.js` imaju **nula** `t()`
poziva). Ovo je brana koja bi K5 uopće **našla** bez ručnog prebrojavanja.

## ✅ ~~Tekst stranice `about` ne spominje UGC~~ — RIJEŠENO ISTI DAN (2026-08-24, spec §9.15)

> Leon je izabrao smjer **B — oboje ravnopravno**, i tekst je promijenjen **na četiri mjesta
> odjednom**: `about`, `meta description`, `og:` i `twitter:`. Ispalo je da problem nije bio
> samo na stranici — ista FMTU-only rečenica stajala je i u `<head>`-u, gdje ju je **Google
> stvarno čitao**, a tri opisa su bila i **međusobno različita**. Brana `check:seo` od tada
> traži da ostanu jedan tekst. Zapis ostaje jer objašnjava ZAŠTO tekst danas izgleda ovako.

<details><summary>izvorni zapis</summary>

## ➖ Tekst stranice `about` ne spominje UGC — a UGC je glavni proizvod (2026-08-24)

> **Leonova odluka, ne nusprodukt cigle.** Cigla `about` je stranici dala izlaz i jezik, ali
> **tekst nije dirala** — mijenjati Leonovu prozu o vlastitom projektu nije posao brane.

Stanje: stranica opisuje platformu kao mjesto koje **dijeli gotovo gradivo** („helps learners
prepare for exams by sharing high-quality study materials, summaries, and scripts"). Nijedna
rečenica ne kaže da korisnik smije **napraviti svoje**. To se s **ADR-029** („UGC je GLAVNI
proizvod, javni katalog je jedan izvor gradiva") ne slaže — a od ove cigle na stranici stoje
**dvoja ravnopravna vrata**, od kojih jedna vode u vlastito gradivo koje tekst ne spominje.

Uz to, kartica „Contribute" traži da se gradivo **pošalje e-mailom** — mehanika iz vremena prije
graditelja. Danas korisnik gradivo napravi sam, u pregledniku.

**Odluka koju traži Leon:** ostaviti kako jest · dopisati rečenicu o vlastitom gradivu ·
ili prepisati stranicu. Treće je najveće i nije hitno.


</details>

## ➖ Stablo Studija ima isti kvar kao BUG-032 — `.st-row` je `div` s klikom (2026-08-24)

> Nađeno skeniranjem **pri popravku BUG-032**, ne posebnim traženjem: `js/studio.js:82` crta
> redak stabla kataloga kao `<div class="st-row" data-subj=… data-lesson=…>` s delegiranim
> klikom. Nema `tabindex`, nema uloge → **stablo kataloga u Studiju nije upotrebljivo
> tipkovnicom**.

Zašto NIJE popravljeno zajedno s BUG-032: to je **editor** (admin-only, živi na `editor.html`
od T6), a BUG-032 je bio na studentskom putu — svaki predmet, svaki korisnik. ADR-030 uz to
kaže da se editor smije **pojednostaviti**, pa ovo ima smisla riješiti kad se stablo ionako
dira (K5 je već u redu čekanja).

Popravak je poznat i mali: isti obrazac kao `renderLessonsPage` — `<button>` za redak koji
nešto otvara, `aria-expanded` za redak koji grana stablo.

⚠️ **Ostalih pet kandidata iz istog skeniranja su PROVJERENI i nisu kvar:** `.browse-card` je
već `<button>`; `.ex-choice-item` i `.ex-card` su **omoti oko pravih `<button class="ex-opt">`**;
`.profile-card` i `.admin-quiz-optrow` su u editoru i nose kontrole unutar sebe. *Skener nađe
obrazac, ne kvar — razlika se vidi tek čitanjem.*

## 🔥 EDITOR — boja kartice i dopune (Leon, 2026-08-24; izmjereno isti dan)

> Dvije Leonove primjedbe na editor, obje potvrđene mjerenjem; jedna od njih je **mina** —
> razuman prijedlog koji bi, izveden doslovno, slomio postojeće gradivo.
>
> **🟢 ODABRANO ZA SLJEDEĆI RAD (Leon, 2026-08-25).** ⚠️ Ali samo **② (dopune)**: ① je po
> **ovdje već zapisanoj analizi** posao cigle **C5a**, koja ionako prepisuje baš te tri
> datoteke — raditi ga sada znači raditi ga dvaput. *Odabir zadatka ne poništava mjerenje koje
> je taj zadatak smjestilo.* Dakle: **② se radi, ① čeka C5a.**

### ① Boja mijenja samo rub, a treba obojiti CIJELU karticu

Boja se svugdje postavlja isto (`SokratBlocks.applyAccent` → `--item-acc`), ali je **tri moda
troše različito**, i to nitko dosad nije primijetio jer se gleda mod po mod:

| mod | što `--item-acc` zapravo radi | datoteka |
|---|---|---|
| kartice | `box-shadow: inset … 3px` — **samo prsten, nikakve ispune** | `css/flashcards-section.css:93` |
| kviz | `border-left: 4px` + tinta **10 %** | `css/quiz-section.css:92` |
| dopune | `border-left: 4px` + tinta **10 %** | `css/fill-blanks-section.css:18` |

Kod kartica ispune **doslovno nema**; kod kviza i dopuna je 10 %, što se na ekranu čita kao
„samo rub". Leonov dojam je točan opis koda, ne dojam.

**Mjesto: C5a (modovi uvježbavanja)** — ta cigla ionako prepisuje baš te tri datoteke, pa bi
raditi to sada značilo raditi dvaput. **Teški dio je već riješen:** izbor tinte po luminanciji iz
dva tema-neovisna tokena (`--color-on-tint-dark/-light`) napravljen je za pločice landinga, s
branom `tests/tint-ink.spec.js` — dakle puna, zasićena boja s čitljivim tekstom kroz sve 4 teme
nije nov problem nego **postojeći alat**. ⚠️ Vrijede tvrde zabrane iz `check:palette`: tekst na
ispuni ide kroz token, nikad `color: white`.

### ② Dopune — ⛔ NE rješavati jednom podvlakom (ovo je mina)

> **✅ ISPORUČENO 2026-08-25 (D1 + D2).** Nalaz ispod ostaje jer objašnjava **zašto je izvedeno
> baš tako**, a ne kako je predloženo. Tekst je pisan dok je stanje još bilo zatečeno.

Editor je do D1 tražio **točno 7 podvlaka** (`_______`) da prepozna prazninu. Leon: nije user-friendly,
neka bude dovoljna jedna `_`, ili neka praznina bude vidljiv element koji se povlači i u koji se
upiše odgovor; i neka ih se može staviti više.

**Prijedlog „jedna podvlaka" se NE SMIJE izvesti doslovno.** U LaTeX-u je `_` operator indeksa, a
rečenice s dopunom renderiraju matematiku (ADR-009, `js/fill-blanks.js:80`). Izmjereno u `data/`:
**1005 rečenica s dopunom, 5 ih sadrži KaTeX**, i jedna je ovo:

```
At the market-clearing price, quantity demanded equals quantity _______ (\(Q_d = Q_s\)).
```

`Q_d` i `Q_s` postali bi praznine → **mikroekonomija bi se raspala**. Zato: ili token koji se ne
može sudariti s LaTeX-om, ili — bolje — **marker uopće ne živi u tekstu**.

**Pravi korijen: podvlaka je format POHRANE koji je procurio u sučelje.** Editor traži od autora
da utipka ono što baza sprema. Leonova druga ideja (označi riječ / ubaci prazninu gumbom) briše
to pitanje: koliko je podvlaka postaje nevažno.

**Više praznina po rečenici je danas blokirano na četiri mjesta**, i zadnje je odlučujuće:

- `_FILL_BLANK = '_______'` — `js/admin-editors.js:508`
- validacija odbija rečenicu bez tog niza — `js/admin-editors.js:595`
- shema traži isti uzorak — `schema/subject-content.schema.json:66`
- renderer radi `.replace('_______', …)` — `js/fill-blanks.js:77`; `replace` sa **stringom**
  mijenja **samo prvo** pojavljivanje
- ⚠️ **model podataka: `answer` je JEDAN string** (`schema:67`) — i da se sve gore popravi, nema
  gdje spremiti drugi odgovor

**Migracije nema:** izmjereno je **0 od 1005** rečenica s više praznina (jer je nemoguće), pa
`answer` ostaje za jednu prazninu, a `answers` se doda za više. Ocjenjivanje (`normFill`,
`js/fill-blanks.js:94`) mora tada usporediti **po praznini**, ne po rečenici.

**Rez: dvije cigle, ne jedna.** ① autorstvo praznine (sučelje editora, malo) · ② više praznina
(shema + ocjenjivanje + renderer, vlastita cigla).

> **✅ ① ISPORUČENO 2026-08-25 (cigla D1)** — gumb „Ubaci prazninu" (označena riječ → praznina +
> odgovor), tolerancija za 3+ ručno utipkane podvlake, i **odbijanje druge praznine** koja se
> dosad dala spremiti a nije radila. Granica **3+** je namjerna: jedna i dvije podvlake su LaTeX.
> Brana: `tests/unit/fill-blank-format.test.js` (mjeri pravu KaTeX-rečenicu iz kataloga).
> **✅ ② ISPORUČENO 2026-08-25 (cigla D2)** — `answers` (2+) u shemi uz `answer` (koji ostaje
> obavezan i drži prvi odgovor, radi stare keširane skripte), polja **u rečenici** od druge
> praznine, ocjena **po praznini**, editor gradi polja za odgovor prema broju praznina.
> Brane: `tests/unit/fill-blank-format.test.js` + `tests/fill-multi.spec.js`.
> **Time je cijela stavka zatvorena osim ①-boje, koja ostaje u C5a.**

## ✅ TELEFON JE ISPORUČEN · ➖ POLICA OSTAJE — (Leon na iPhoneu 16, 2026-08-19/20)

> **STATUS 2026-08-25:** faza **„TELEFON" (T0–T6) je gotova i NA PRODUKCIJI** od 2026-08-24,
> zajedno s BUG-030/031/032; phone-osnovica je **prazna**, pa brana od tada traži **nulu**.
> **Faza „POLICA" (P1–P4) NIJE počela** i ostaje sljedeći ponuđeni posao. Nalaz ispod ostaje
> jer objašnjava **zašto su brane takve kakve jesu**.

> **📐 RAZRAĐENO U DVIJE FAZE — radna specifikacija je
> [`FRONTEND_REDIZAJN.md` §9](../plan/FRONTEND_REDIZAJN.md): faza „TELEFON" (T0–T6) i faza
> „POLICA" (P1–P4), obje PRIJE C4.** Ovdje ostaje samo nalaz; što se radi piše u specu.

Leon: *„cijeli frontend na produkciji je apsolutno DNO DNA… puca mi kurac za cigla po ciglu,
ovo je crveni alarm."* Izmjereno na 393 × 852: zaglavlje kataloga **270 px**, naziv fakulteta
u **14 redaka**, naslov odrezan na **34 od 205 px**, „Start studying" na **y = 18 px** (ispod
otoka), kromo **32 %** ekrana, cookie-banner još **24 %**. → **BUG-030**, **BUG-031**.

**Zašto je svih desetak gateova zeleno:** axe mjeri na **1280 px**, `css:diff` uspoređuje nas
sa samima sobom (drift, ne lošoća), a K3/K4a mjere **kromo, ne stranicu**. **Telefon kao
STRANICA nikad nije bio mjerena površina** — zato faza počinje mjeračem (T0), ne popravkom.

**Dvije trajne Leonove odluke iz iste sesije:**
1. ~~**Ništa ne ide na produkciju dok cijeli frontend ne bude riješen.**~~
   ⚠️ **POTROŠENA 2026-08-24 — Leon je tu odluku sam promijenio** i odobrio merge iako C4–C7 i
   POLICA nisu gotovi (*„moze merge na main"*). Obrazloženje je prestalo vrijediti: prepreka je
   bio telefon, a on je riješen. **Potrošena, ne ukinuta — sljedeći deploy opet traži izričit OK.**
2. **Broj commita izvan produkcije NIJE nalaz i ne spominje se** (*„ZNAM KADA ZELIM PUSTIT
   NESTO NA PRODUKCIJU"*; povod: raniji deploy koji se nije trebao dogoditi).

**❓ OTVORENO PITANJE IZ T4 (2026-08-22) — traži ODLUKU, ne izvedbu.** Stranica `about` na **sva četiri profila** nema **nijednu** kontrolu u prvom ekranu: cijela ima **jednu** (`a.email-link`) i ona je na `y ≈ 1500`. Tvrdnja ④ phone-brane to danas broji kao kvar i to su **4 od 10** preostalih nalaza u osnovici. Dvije mogućnosti, i obje su legitimne: ① `about` je proza koja se čita, pa tvrdnja dobiva **izuzeće uz zapis zašto** · ② stranica bez ijednog izlaza je kvar, pa dobiva **ulaz** (vrata natrag na gradivo ili na vlastiti materijal). *Ne popravljati dok se ne odluči — popravak bez odluke ovdje znači izmišljanje sadržaja.*

---

## ✅ NAVIGACIJA RIJEŠENA (K1–K4a) · ➖ OSOBNI PROSTOR OSTAJE — (Leon, 2026-08-18)

> **STATUS 2026-08-25:** **K1–K4a su gotovi i na produkciji** — devet stranica ima devet
> dijeljivih adresa, „natrag" ima jedan model, gornja traka je jedna, Studio je upotrebljiv na
> telefonu. **Petlja opisana ispod više ne postoji.** Ostaje **N2 („ono što učim")**, a ono se
> **utapa u P2** faze POLICA — ne planirati ga zasebno.
>
> **✅ DOPUNA 2026-08-26: P2 je isporučen** (grana `feat/polica`, **nije deployano**), pa je i
> **K4 potrošen** — polica ima dva izvora. ⚠️ Time je i rečenica „N2 ulazi tek kad K1–K4 stoje“
> ispod **ispunjena, ne otkazana**: uvjet je bio točan i dogodio se tim redom.

> **📐 RAZRAĐENO U FAZU 2026-08-18 — radna specifikacija je
> [`FRONTEND_REDIZAJN.md` §8](../plan/FRONTEND_REDIZAJN.md) („KOSTUR": K1 rute · K2 traka ·
> K3 brana · K4 materijali), ubačena između C3 i C4.** Ovaj odjeljak ostaje kao **nalaz i
> obrazloženje**; što se radi i kojim redom piše u specu. ⚠️ Ondje je i mjerenje koje ovdje
> nije bilo: **devet stranica dijeli jednu jedinu adresu** (`#/materials`), pa se traka bez
> ruta mora pisati dvaput. **N2 nije u fazi** — ulazi tek kad K1–K4 stoje.

Leon: *„navigacija je iskreno dosta loša… kada se uđe u editor i izađe iz njega samo se
vrti u krug moji materijali, editor i tako u krug. Moji materijali moraju imat poseban
odjeljak na stranici… isto kao materijali koji su s FMTU-a. Korisnik treba imati svoje
sučelje za predmete koje uči."*

**⚠️ PETLJA JE IZMJERENA, NIJE DOJAM.** [`js/studio.js:152`](../../js/studio.js#L152) —
ljuska Studija ima **točno dva gumba**: `←` i „stari editor". `←` vodi `navigateTo(_node
? 'materials' : 'profile')`. Iz materijala se ulazi u editor. **Dva čvora, jedan brid** —
graf iz kojeg doslovno nema izlaza osim natrag. Isto i za admina.

**Uzrok je širi od Studija: NE POSTOJI NIJEDNA GLOBALNA TRAKA.** Izmjereno:

| površina | gdje živi |
|---|---|
| `landing-nav` | samo landing |
| `study-nav` + `mobile-nav` (8+8 gumba) | samo study-stranica (to su MODOVI, ne navigacija aplikacije) |
| `browse-header` · `lessons-header` · `study-header` | svaka stranica **iznova** slaže jezik, materijale, auth i znak |
| `st-topbar` (Studio) | ništa od navedenog |

Devet stranica, nula zajedničkih traka. Zato se svaki ekran čita kao zaseban proizvod.

### N1 · Stalna gornja traka — razrađena u ciglu **K2** (spec §8; K1 rute su isporučene)
- **jedan** `<header>` kao brat svih `-page` sekcija, izvan njih (danas su zaglavlja
  UNUTAR sekcija, pa nestaju s njima — to je cijeli uzrok)
- sadržaj: znak → landing · **Predmeti** → browse · **Moji materijali** → materials ·
  jezik · profil/prijava
- **Studio je dobiva jednako kao i sve ostalo** → petlja pada bez ijedne posebne iznimke
- zaglavlja po stranici zadržavaju SAMO ono što im je vlastito (natrag, naslov, mrvice);
  duplirani jezik/materijali/auth gumbi odlaze
- ⚠️ **brana:** test koji tvrdi da je iz **svake** stranice (uključujući `#editor-page`)
  dohvatljiva bar jedna druga odredišna stranica u jednom kliku. Bez toga se petlja
  može vratiti neopaženo — kao što je i nastala.

### N2 · Osobna početna — „predmeti koje učim" → **✅ ISPORUČENO 2026-08-26 (cigla P2)**
Katalog-predmeti s napretkom **i** vlastiti materijali na jednom mjestu.

> **✅ Stranica postoji od cigle P2** (grana `feat/polica`, **nije deployano**):
> `#materials-page` nosi **dva izvora** — skinute predmete iz kataloga (pločica s imenom,
> veličinom, stanjem učenja i pravom adresom) i vlastito gradivo ispod. Tekst ispod ostaje jer
> objašnjava **odakle je N2 dobio sadržaj**, a ne kakvo je stanje.
> ⚠️ **Napredak se prikazuje kao „Zadnje učenje …" / „Još nedirnuto", NE kao postotak** — nema
> iskrenog nazivnika (koliko kartica predmet „ima" ovisi o lekciji i modu).

> **Dobila je sadržaj koji joj je nedostajao.** Leon je 2026-08-20 tražio da korisnik **bira
> što će skinuti** za učenje offline — a to je točno ono što N2 prikazuje. Polica time ima
> **dvije vrste stvari: što je korisnik napisao i što je skinuo.** Ne gradi se nova površina
> nego se puni ona koja je bila planirana i prazna. Cigle P1–P4 u
> [`FRONTEND_REDIZAJN.md` §9.4](../plan/FRONTEND_REDIZAJN.md); **K4 se u P2 utapa** (ista
> pločica, isti ekran — odvojeno bi se pisalo dvaput).

### N3 · Moji materijali u prikazu kvalitete kataloga — **➖ RIJEŠENO SAMO ZA SKINUTO**

> **P2 je pokrio jednu polovicu:** skinuti **katalog**-predmeti imaju pločicu s ikonom, imenom i
> stanjem učenja. **Vlastito gradivo je i dalje stablo** (`mm-*`) i N3 za njega stoji otvoren.
> Ne voditi ovo kao ispunjeno.
Danas je polica **stablo**, a katalog **vitrina s bojom i ikonom**. Leon traži da vlastito
gradivo izgleda jednako dobro kao FMTU gradivo.

**🔒 PRAVILO KOJE JE IZ OVOGA IZAŠLO (Leon, izričito):** *sučelje za vlastite materijale
NIKAD ne ide na landing* — nego na posebno mjesto, eventualno profil. Landing smije imati
**ulaz** (vrata, ＋ pločica) i **objašnjenje**, nikad **popis korisnikovih materijala**.
Ovo sužava ADR-029: „ravnopravno u herou" vrijedi za **istaknutost ulaza**, ne za prikaz
sadržaja.

---

## 🔥 A — PRIJAVA I REGISTRACIJA (Leon, 2026-08-18)

Leon: *„preko potrebno da postoji mogućnost prijave s Googleom, Appleom, jer jako puno
korisnika se zapravo tako registrira."* Uz to bogatija registracija: **student / učenik /
profesor / vanjski korisnik**.

**Brojka koja to opravdava: 5 registriranih korisnika ukupno** (mjereno na produkciji
2026-08-16; 3 prijave u 30 dana, 1 u 7). Obavezan e-mail + lozinka je prepreka, a danas
je to **jedini** put — `js/auth.js` ima samo `signInWithPassword`, nijedan OAuth provider.

| korak | što | zašto tim redom |
|---|---|---|
| **A1** | **Google** | besplatno, ne dira CSS, **ne mora čekati redizajn** — najveći učinak po jedinici posla |
| **A2** | **Sign in with ChatGPT** | OpenAI ga je pokrenuo **2026-08-02** (OAuth 2.0), Supabase je launch-partner. ⚠️ **POTVRĐENO SAMO za prijavu na Supabaseov vlastiti dashboard** — treba provjeriti nudi li se kao provider za APLIKACIJE. Ne obećavati dok se ne provjeri. |
| **A3** | **Apple** | traži Apple Developer ~99 $/god; nije hitno bez iOS aplikacije |
| **B** | **pitanja pri registraciji** | traži izmjenu sheme (`profiles`) → **SQL na produkciji = Leonova ruka**; dira profil → ide **s C6**, ne prije |

**🎨 A0 · DIJALOG PRIJAVE SE PREPRAVLJA ZAJEDNO S A1 (Leon, 2026-08-19, uz snimku):**
*„kada budemo dodavali mogućnost za prijavu preko Googla, Applea i drugih pizdarija morat
ćemo popravit gumb za sign in i sign up."* Današnji `#authModal` je građen za **jedan**
put: dva taba („Sign in" / „Create account") pa polje e-maila i lozinke odmah ispod. Čim
dođu OAuth-gumbi, taj oblik puca — davatelji su **primarni** put i moraju stajati **iznad**
e-maila, s razdjelnicom („ili e-mailom"), a tabovi tad postaju šum jer Google-prijava i
Google-registracija nisu dvije radnje nego jedna.

**Zato ovo NIJE zaseban posao nego dio A1** — prvo dodavanje davatelja mora doći s novim
rasporedom dijaloga, inače se gumbi zalijepe na oblik koji ih ne podnosi i prepravljamo
dvaput. ⚠️ Vrijedi i granica iz C2: **tekst na ispuni marke ide kroz `--on-primary`**, a
Google/Apple gumbi imaju **propisane** boje i logotipe (brand guidelines) — to su prve
površine u projektu čija boja NIJE naša odluka, pa moraju ući u `check:palette` kao
**imenovana iznimka**, ne kao tiho odstupanje.

**⛔ GODINE SE NE PITAJU (Leon presudio 2026-08-18, na moj prigovor).** Ako pitamo dob i
netko upiše 14, mi **znamo** da je dijete — GDPR čl. 8 tad traži roditeljski pristanak
(prag 16, države ga smiju spustiti). Kategorija „učenik" to već implicira. Time bismo
uveli pravnu obavezu koju danas nemamo, za podatak s kojim ne bismo ništa radili.
**Prilagodbu sadržaja bolje daje pitanje „što učiš" nego „koliko imaš godina".**
Uloga (student/učenik/profesor/vanjski) je korisna i bezopasna — ona ostaje.

---

## 🔥 Leaked password protection — **rješivo BESPLATNO; Supabase naplaćuje integraciju, ne provjeru** (2026-08-21)

**Premisa je bila kriva 11 dana.** Stavka „RUČNO ČEKA LEONA" je od 10. 8. tvrdila da je ovo *„jedini
od 16 advisora koji se rješava jednim prekidačem"*. Prekidač je **iza Pro plana** (org
`pfbkisxynphwxdbqmmtt` = **free**), pa ga u Dashboardu nema. Advisor ga svejedno prijavljuje jer ne
gleda plan. *Zapisano jer je pouka o klasi: „ostala je samo radnja" je tvrdnja koja se mora
provjeriti prije nego se nekoga pošalje da tu radnju izvrši.*

**Ono što Supabase naplaćuje NIJE provjera nego njihova integracija.** HaveIBeenPwned ima
**besplatan javni API bez ključa**: `GET api.pwnedpasswords.com/range/{prvih 5 znakova SHA-1}`
vrati ~500 sufiksa, usporedba je lokalna. **Lozinka nikad ne napusti preglednik** — odlazi pet
heksadecimalnih znakova (k-anonimnost, ista tehnika koju Supabase koristi iznutra). `crypto.subtle`
je ugrađen. **~30 redaka u `js/auth.js`.**

⚠️ **Pošteno o dosegu:** naša izvedba je **klijentska**, kao i `minlength` — zaustavlja korisnika
koji upiše `password123` (a to jest prava prijetnja), ali ne i onoga tko namjerno zaobiđe formu, a
taj šteti **samo sebi**. Supabaseova je serverska i time jača. **~90 % vrijednosti za 0 €** umjesto
100 % za ~300 €/god. Registracija ide izravno na Supabase Auth, ne kroz naš kod, pa se serverska
provedba **ne može** dobiti bez proxyja — to nije propust izvedbe nego svojstvo puta.

**Veže se na CSP (C6):** dodaje `api.pwnedpasswords.com` na popis vanjskih hostova.

### Uz to: dvije susjedne stavke koje je isto istraživanje iznijelo

1. **`minlength="8"` je obećanje preglednika, ne pravilo servera.** Forma traži 8
   (`js/auth.js:206`), Supabaseov serverski minimum je zadanih **6** → tko pošalje zahtjev mimo
   forme, registrira se sa šest znakova. **Popravak je besplatan i dostupan na free planu:**
   Dashboard → Authentication → Sign In / Providers → **Minimum password length 6 → 8**.
   ⚠️ **Polje „Password Requirements" NE dirati** — traženje velikih slova/brojki/simbola server bi
   provodio, a **naša forma to nigdje ne piše**; bila bi to ista greška okrenuta naopako (server
   stroži od sučelja). *Mijenja se isključivo ono što UI već obećava.*
2. **`WeakPasswordError` se u `js/auth.js:343` krivo tretira.** Postojeći korisnik s prekratkom
   lozinkom se **uspješno prijavi**, ali Supabase uz sesiju vrati i `error` → naš `if (error)`
   pokaže **crvenu poruku** iako je prijava prošla. Nije zaključavanje, jest zbunjivanje.
   **Mora se popraviti PRIJE nego se serverski minimum digne** (ili barem u istoj isporuci).
   Koliko je pogođenih: **nemjerljivo** — duljina lozinke se ne pohranjuje, samo hash. Vjerojatno
   nula (forma traži 8 od početka), ali „vjerojatno nula" nije mjera i tako se i vodi.

---

## 🧭 SELF-HOST SUPABASE — **odlučeno: ide, ali TEK POSLIJE frontenda** (Leon, 2026-08-21)

Povod je bio bijes na Pro-gating (*„ja ovim supcima neću meda dat"*), ali odluka stoji i bez njega.
Supabase je **open source** → self-host na VPS-u (~5 €/mj) otključava **sve Pro značajke**, uz
**isti kod, istu shemu i isti `supabase-js`**. To je jedina opcija koja **ne traži prepisivanje**.

**Odbačeno i zašto:** **PocketBase** (SQLite, vlastiti model pravila) i **Firebase / Cloudflare D1**
traže da se RLS i svih 10 `SECURITY DEFINER` RPC-ova napišu ispočetka — to nije seoba nego **rewrite
backenda**.

**Što je danas vezano za Supabase** (mjera cijene seobe, da se ne procjenjuje napamet):

| što | koliko |
|---|---|
| RLS politike | ~13, uz owner-check na svakoj tablici |
| `SECURITY DEFINER` RPC-ovi | 10 (`publish_document`, `publish_node`, `create_node`, `move_node`, …) |
| Edge Functions | 1 živa (`delete-account`) + 2 stranca za brisanje |
| Storage buckets s vlasničkim prefiksom | 2 (`node-images`, `lesson-images`) |
| Sadržaj u bazi | 51 red / 17 predmeta |
| Naši alati koji govore Supabaseu | `check:final` · `diff:db` · `check:functions` · `test:storage` · `test:delete-account` · `backup` · `migrate-content` |

**Zašto ne sada:** usred smo crvenog alarma za telefon koji je Leon sam proglasio prioritetom, i
ništa ne ide na produkciju dok to nije gotovo. Seoba backenda bi zamrznula **jedino što korisnicima
trenutno smeta**.

**Argument koji vrijedi neovisno o bijesu — i zbog kojeg ovo nije samo osveta:** self-host gasi i
**uspavljivanje baze nakon ~7 dana neaktivnosti**, koje nas već grize (app tad pada na datoteke,
prijava i sync ne rade). **Cijena koja se mora izreći: postajemo sami sebi DBA** — backupi,
nadogradnje, sigurnosne zakrpe, uptime. Za jednog autora usred redizajna to je stvarni trošak
vremena, i zato ovo čeka. Kad dođe red → **ADR**, ne usputna odluka.

---

## ➖ `css:diff` mjeri samo POLA stranice — izmjereno u T5 (2026-08-22)

**Što je nađeno.** `scripts/css-diff.js` presreće **stylesheet**, a HTML uzima iz **radnog
stabla**. Dok cigla mijenja samo CSS, to je točno. Čim cigla premjesti vrijednost **iz markupa u
CSS** (T5: dvoosna veličina heroja se utilityjem ne da napisati, jer utilityji stoje zadnji pa
pravilo iste specifičnosti uvijek gubi), njegova „referenca" postaje stranica koja **nikad nije
postojala**: **novi markup + stari CSS**.

**Mjera.** T5 je prijavio **46 razlika**, i to na **sve tri** širine — uključujući 768 i 1280 px,
gdje se dokazano **ništa** nije promijenilo. Izvještaj je tvrdio „naslov 32 px" — a to je gola
`h1` bez ijedne veličine, jer referentni bundle ne poznaje pravilo koje ju daje.

**Zašto to nije sitnica.** Ovo je **oblik cijele faze C4–C7**: svaka od tih cigli migrira
površinu na utilityje, dakle **svaka mijenja markup i CSS istovremeno**. Alat koji je za C1 dao
3438 usporedbi / 0 razlika za C4+ daje šum u kojem se prava regresija ne vidi. *Gate koji mijenja
samo jednu polovicu stranice mjeri stranicu koja ne postoji.*

**Kako se dotad dokazuje** (izvedeno u T5, radi): HEAD se posluži iz zasebnog **`git worktree`-a**
na drugom portu, pa se izračunati stilovi uspoređuju između **dvije stvarne verzije stranice** —
obje sa svojim markupom i svojim CSS-om. T5: **0 razlika na 768 i 1280 px**, 22 na 375 i sve do
jedne namjera cigle.

**Prijedlog (nije odlučeno):** `css:diff` dobiva `--ref <git-ref>` koji poslužuje **cijelo**
stablo te reference (worktree ili `git archive`), a ne samo bundle; današnje ponašanje ostaje
zadano. Cijena: sporije (dva servera) i traži čist `git worktree`. **Kriterij prihvaćanja:**
*cigla koja premjesti vrijednost iz markupa u CSS dobije 0 razlika na širinama koje nije dirala.*

⚠️ **Ne raditi usred faze TELEFON** — T6 je zadnja cigla i ne dira markup na taj način. Prirodno
mjesto je **pred C4**, jer ondje počinje niz cigli koje bi bez toga sve morale ručno dokazivati.

---

## ➖ Birač tema je bliže nego što spec tvrdi — 24 pravila, ne 126 (2026-08-18)

Leon je pitao kad dolaze druge boje cijele stranice. `npm run palette:breakdown`:

```
FATALNO (tekst nevidljiv na svijetlom)   24   ← JEDINO ovo blokira birač
plohe/rubovi (blijedo, ali ispravno)     28
stara paleta (neusklađeno, čitljivo)     61
```

Koncentrirano: `subject-selector` 6 · `learn` 4 · `home-section` 4 · `quiz-section` 3 ·
`profile` 2, ostatak pojedinačno. **Birač NE ČEKA C4–C7 nego 24 pravila** — posao od
jednog popodneva, izdvojiv u vlastitu ciglu kad god. Ovo je drugi put da ista čegrtaljka
zavara: agregatna brojka mjeri točno, a savjetuje krivo.

---

## ✅ ~~`a11y.authed` (Studio) nije doveden do zelenog~~ — POTVRĐENO OKRUŽENJE, ZATVORENO 2026-08-16

**Ponovljeno na odmornom stroju: 3 prošla / 0 palo, Studio u 46,2 s** (`auth-setup` 5,7 s ·
„Moji materijali" 5,9 s · Studio 46,2 s; ukupno 1,0 min). Isti commit, isti helper, **bez ijedne
izmjene** — samo neopterećen stroj. Puna suita iza toga: **371 prošlo / 0 palo / 30 preskočeno**.

> 📏 **NORMALA TRAJANJA (nova navika, 2026-08-16; premjereno 2026-08-22): puna suita = 21,7 min ·
> `a11y.authed` = 1,0 min** (`workers: 1`, `fullyParallel: false`, **451 test + 72 preskočena** kroz
> 6 projekata — sve sekvencijalno). ⚠️ **Broj testova raste sa svakom ciglom** (bio je ~401 u
> kolovozu; T0–T5 su dodali branu telefona i tvrdnju landinga), pa se uz vrijeme uvijek bilježi i
> broj — inače „sporije nego prošli put" ne razlikuje **sporiji stroj** od **veće suite**.
> **Povod:** dnevnici su dosad bilježili KOLIKO je testova prošlo, ali nikad KOLIKO JE TRAJALO — pa
> se jučerašnje pitanje *„je li test pokvaren ili je stroj spor?"* nije dalo odgovoriti bez punog
> kontrolnog prolaza s izvornim kodom. **Broj bez normale ne može posvjedočiti o brzini.** Ubuduće
> uz svaki suite-rezultat ide i vrijeme.

**Time je hipoteza dokazana, a ne samo uvjerljiva:** ono što je jučer probijalo 300 s danas staje u
46 s, dakle **usporenje NIJE bilo regresija** nego iscrpljeno okruženje. Budžet od 300 s ostaje
(pet punih axe-analiza nad najtežom stranicom je stvarno skupo), ali sad je rezerva, ne potreba.

**Pouka koja preživljava stavku:** *„test pada" i „test ne stigne završiti" su dvije različite
tvrdnje.* Prva se rješava kodom, druga mjerenjem okoline — i razlikuju se samo kontrolnim prolazom
s **izvornim** kodom. Da taj kontrolni prolaz nije napravljen, popravak `smiri()` bio bi proglašen
neuspjelim i vjerojatno prepravljen još jednom, bez potrebe.

<details><summary>izvorni zapis (2026-08-15)</summary>

Puna suita nakon landing-cigle B: **370 prošlo / 1 palo**. Pad je bio **artefakt mjerenja**, ne kvar:
axe je uhvatio `#toastMessage` **usred fade-a** (`fg #868584 / bg #fdfcfb = 3.59`). Da je riječ o
prozirnosti a ne o boji dokazuje aritmetika — za `--color-ink-0` preko plohe izmjerena boja daje alfu
**0.527 · 0.527 · 0.522**, istu na sva tri kanala; toast je bio na ~53 % neprozirnosti, a prava boja
daje ~14:1. `smiri()` je **taj razred kvara već jednom popravljao, nepotpuno** (`finish()` se zvao
jednom, prije čekanja od 250 ms, a toast se skriva sam na tajmeru).

**Popravak je napisan i commitan** (`82e384f`): animacije se guraju u krajnje stanje u petlji **i još
jednom neposredno prije mjerenja**, uz izuzimanje **beskonačnih** animacija (spinnere `finish()` po
definiciji odbija → prva verzija petlje ih je čekala vječno i otjerala test iz 51 s u timeout).

⚠️ **Što NIJE dokazano:** test u okruženju te sesije **nije doveden do zelenog**. Prelazi 120 s, pa i
300 s. **Kontrolni prolaz s IZVORNIM `smiri()` — bez ijedne izmjene — premašio je 10 minuta**, pa
usporenje **nije regresija** nego iscrpljen stroj (ista datoteka je ranije istog dana trajala 2,6 min).
Testu je zato dan vlastiti budžet od 300 s, s obrazloženjem: pet punih axe-analiza nad najtežom
stranicom u aplikaciji.

**Kad:** prvo što treba napraviti u sljedećoj sesiji, **prije mergea C3 u `main`**. Ako i na odmornom
stroju pada — tek tada je nalaz, a ne okruženje.

</details>

---

## ➖ `css/subject-selector.css` — 22 pogotka `check:palette` — 2026-08-15

> ⚠️ Naslov je do 2026-08-24 pisao „22 od preostalih **126**"; osnovica je od tada **125**
> (cigla §9.15 zamijenila indigo glow tokenom). **Ukupan broj ovdje više ne stoji** — zna ga
> `npm run check:palette`; brojka 22 je o OVOJ datoteci i nju gate ne prepisuje.

Isplivalo pri popravku tinte na pločicama predmeta (spec §7.14). Isti obrazac koji je ondje popravljen
na tri površine: `color: white` + gradijenti **stare palete** (`#6366f1`, `#8b5cf6`) zakucani u CSS-u.
Najveći pojedinačni ostatak u čegrtaljci — **22 od 126**.

⚠️ **Ovdje je pozadina zapisana U CSS-u**, pa ju je `check:palette` i vidio; to je razlika u odnosu na
pločice, gdje je ploha dolazila iz podatka kroz inline `style` i gate ju je proglasio bezopasnom.

**Kad:** uz **C4** (Browse + lekcije), gdje ta datoteka ionako dolazi na red.

---

## ✅ ~~Objediniti PRED-OBRADU prije `renderBlocks`~~ — ISPUNJENO 2026-08-10

Zatvoreno popravkom [BUG-024](./BUGS.md) (`5f77a88`): `renderContentBlocks()` je sad **jedini ulaz za prikaz**
sadržaja, a **izvorna brana** u `tests/unit/blocks-renderer.test.js` pada ako itko opet zove `renderBlocks(`
izravno. Ista revizija je iznijela i [BUG-025](./BUGS.md) (`779f26b`) — tekst stavki uopće nije dolazio do
sigurnosne granice. **Ostatak zamisli je odrađen:** prijeđeni su svi tipovi blokova (slika ✅ · KaTeX ✅ —
admin-pregled ga nije tipografirao · tablica/video/legacy-html: bez pred-obrade po konstrukciji).

---

## ✅ ~~Prijavljene površine nemaju NIJEDAN vizualni gate~~ — ZATVORENO 2026-08-14 (C3, spec §7.10)
**Riješeno prvom ciglom C3-a, PRIJE ijedne CSS-izmjene.** `tests/a11y.authed.spec.js` skenira
7 prijavljenih stanja × 5 tema = **35 mjerenja**; gate-logika je zajednička s odjavljenim
gateom (`tests/helpers/axe-gate.js`, ADR-027). **Pao je na prvom pokretanju i našao tri kvara**
(`role="tree"` bez `treeitem` = critical · `<li>` bez liste = serious · color-input samo s
`title` = serious), svi popravljeni. Obrnuto provjeren vraćanjem zakucane tamne plohe.
Skica ispod je izvorni zapis duga i ostaje kao obrazloženje.

<details><summary>izvorni zapis duga (2026-08-14)</summary>

**Nalaz (popravak C2, spec §7.9):** kad je zadana tema postala svijetla, Studio i „Moji materijali"
postali su **nečitljivi** (`.st-icard` = **1.00**, doslovno ista boja teksta i plohe), a **sva tri
postojeća gatea su šutjela**. Statičke brane su popravljene istog dana (tvrda zabrana #3), ali
**rupa u dinamičkoj provjeri ostaje otvorena**:

- **axe (`tests/a11y.spec.js`)** posjećuje `#materials-page` — ali **odjavljen**, gdje se vidi
  poziv na prijavu, a stablo se nikad ne iscrta. Do **`#editor-page` ne dolazi nikad.**
- Svi studio/editor testovi su **`.authed.spec.js`** i **ne vrte axe** — provjeravaju ponašanje,
  ne izgled.
- Posljedica: **sve iza prijave je vizualno neprovjereno.** To je površina cijelog C3 (editor,
  materijali) i dijela C6 (profil), dakle upravo ono što slijedi.

**Zašto ovo nije „dodaj još testova":** statička zabrana #3 hvata **zakucane** plohe, ali ne i
kvar koji nastane iz **kombinacije tokena** (npr. tinta preko tinte, ili token uveden bez
provjere — v. `--primary-light`, zabrana #2). Za to treba mjerenje u pregledniku, na prijavljenoj
stranici.

**Skica:** proširiti `test:authed` jednim spec-om koji nakon prijave otvori `#materials-page` i
`#editor-page`, **prođe kroz sve četiri teme** (`data-theme` se postavlja iz JS-a) i pusti axe na
`color-contrast`. Traži `TEST_ADMIN_*` iz `.env` i gađa STAGING, kao ostatak authed-suite.
⚠️ **Prije mjerenja gurnuti animacije u krajnje stanje** (`getAnimations().finish()`) — inače se
ponavlja lov na duha iz §7.8.

**Kad:** uz **C3**, jer C3 ionako prepisuje te površine i bez ovog gatea nema kako dokazati da ih
nije razbio. **Veže se na** [FRONTEND_REDIZAJN §7.9](../plan/FRONTEND_REDIZAJN.md).

</details>

---

## ✅ ~~Vanjske skripte bez SRI i bez pina~~ — ZATVORENO 2026-08-14 (`check:cdn`)

**Nalaz je bio o PRAVILU, ne o pet nedostajućih atributa.** Projekt ima tvrdu politiku točnog
pinanja (`save-exact=true`, `.nvmrc`, `check:lockfile`), nastalu jer je raspon `^` pustio da
upstream objava razidje razrješenje ispod nas. Ta je politika pokrivala `package.json` — dakle
**alat, koji nikad ne dođe do korisnika.** Šest datoteka koje se doista izvršavaju u korisnikovu
pregledniku nije pokrivalo ništa: Font Awesome, KaTeX (CSS ×2 + JS + auto-render) i DOMPurify bez
SRI, a MathLive s **golog `npm/mathlive`** = „uvijek najnovija". Brana je čuvala ono što ne može
nauditi i nije čuvala ono što može. Komentar iznad MathLivea je pritom tvrdio da je uvjet
ispunjen (*„vendorana/CDN kao KaTeX"*) — a KaTeX **jest** bio pinan; kod je kršio vlastiti
zapisani uvjet dok je proza tvrdila suprotno, što je gore od nezapisanog duga.

**Drugi, suptilniji nalaz — jedini koji je već imao SRI.** `supabase.min.js` **ne postoji u npm
paketu**: jsDelivr ga generira vlastitim minifierom na zahtjev (dokaz: nema ga u file-listingu, a
„minificirana" inačica je 208.196 B = **292 B veća** od objavljene 207.904 B). SRI je time bio
pinan na **izveden artefakt tuđeg build-koraka**. Dan kad jsDelivr promijeni minifier, hash pukne
→ `onerror` → po komentaru u `auth.js` *„auth se tiho ugasi"*, tj. **prijava umire bez poruke i
bez ijednog crvenog gatea**. Sad se pokazuje na objavljenu `supabase.js` (manju!), čiji je sha256
provjeren protiv jsDelivrovog listinga → hash se mijenja **samo s verzijom**.

**Isporučeno:** SRI + `crossorigin` na svih 5 tagova · MathLive pinan na **0.110.0** (bajt-identično
onome što je goli URL posluživao) · supabase preusmjeren na izdavačevu datoteku · **`npm run
check:cdn` u preflightu** (3 lokalne provjere) + `check:cdn:live` (mrežna, 4. provjera).
Svih 7 hasheva **unakrsno provjereno protiv izdavačevih objava** prije upisa — SRI izračunat iz
kompromitiranog preuzimanja pinao bi kompromitaciju. Obrnuto provjereno: gate pada na svaki od
tri načina, a provjera „izvedene datoteke" okida **i kad je SRI točan**.

**Pouka (ista kao kod `check:contrast`):** *gate koji provjerava NEKE ovisnosti stvara tihu
pretpostavku da su provjerene SVE.* Politika je postojala godinu dana; nedostajala je samo
rečenica koja kaže **na što se odnosi**.

---

## 🔥 Vježbe nemaju svoj frontend — 2026-08-14
**Leon:** *„trebat ćemo napraviti i exercises dobro u frontendu kasnije."*

Engine vježbi (7 tipova) je **funkcionalno gotov i svet** — ne mijenja se za sadržaj (BUG-012,
ADR-018). Ono što nedostaje je **prikaz**: vježbe su jedina velika površina koju redizajn dosad
nijednom nije spomenuo — nisu u tablici cigli C0–C7 i nemaju ni jedan vizualni gate.

**Pet predmeta ih ima** (`accounting` · `math` · `statistics` · `academic-writing` ·
`macroeconomics`), dakle to nije rub nego petina kataloga.

**Kad:** **C5b** (gradivo i vježbe) — ondje se ionako dira put renderiranja. **Prije toga treba
odlučiti opseg**, jer je danas neodređen: je li to prolaz kroz tokene i razmake, ili prepravak
interakcije (unos odgovora, provjera, koraci rješenja). ⚠️ **Granica se ne pomiče:** izgled se smije
mijenjati, `generate()`/`answer()`/`type` **ne**.

> ### ⚠️ 2026-08-20 — „VJEŽBE SU KÔD" JE OBORENO MJERENJEM (smjer: **RECEPTI**)
>
> Puni zapis: [`FRONTEND_REDIZAJN.md` §9.5](../plan/FRONTEND_REDIZAJN.md). **Radi se TEK nakon
> cijelog frontenda** (Leon, 2026-08-20) — ovdje stoji samo da se sljedeća sesija ne vrati na
> početak.
>
> Učitano svih pet packova: **234 vježbe — 151 (65 %) je čisti PODATAK**, samo **83 (35 %)**
> ima funkciju, i to **uvijek istu jednu: `generate(p)`**. Presudno: **`params` su već
> deklarirani kao podatak u svih 83, bez iznimke** — od deset ključeva vježbe **devet je već
> shema**, kôd je samo **formula**. *Shema je od prvog dana bila deklarativna i nitko to nije
> primijetio.*
>
> **Smjer:** formula ne briše se i ne prevodi u novi jezik nego **seli iz vježbe u imenovanu,
> verzioniranu knjižnicu recepata** (`recipe: 'sample-sd'`). Time vježba postaje **100 %
> podatak** → baza, JSON, `publish_document`, skidanje, MCP, editor — **bez ijedne iznimke**, a
> **BUG-012 se smije umiroviti**. Migracija je **samoprovjerljiva**: starih 83 generatora
> ostaju proročište (isti parametri → identičan izlaz).
>
> **Odbačeno i zašto:** evaluator izraza (traži da napišem i osiguram parser, a pokriva 93 %
> umjesto 100 %) · sandbox za korisnički JS (ruši ADR-018 u korijenu; prava cijena nije sandbox
> nego to da **tuđi `generate` odlučuje o ocjeni**).
>
> **Dvije stvari protiv, obje u dizajn od prvog dana:** recept je **dijeljena ovisnost** (mijenja
> sve vježbe koje ga koriste → imenovan, verzioniran, dodaje se a ne mijenja) · **ne zna se
> koliko ih je** (83 generatora → 20? 40?) — **to je jedina brojka koja odlučuje o cijeni** i
> mjeri se prije obveze.
>
> **Pouka (treći put ista):** *agregatna brojka mjeri točno, a savjetuje krivo.* „Vježbe su kôd"
> bilo je istinito za **7 %**, a blokiralo je odluku o svih 100 %.

---

## ➖ „Akademsko plavo" i „Papir" izgledaju isto — tema nije temperatura sivih — 2026-08-14
**Leon:** *„akademsko plavo i papir su isti kurac."* **Izmjereno i potvrđeno:** razlikuju se u
**18 od 21 tokena**, ali sve su razlike mikroskopske, a presudna je ova:

| token | academic | paper |
|---|---|---|
| ploha | `#f7f9fc` | `#faf9f6` |
| tinta | `#0e1a2b` | `#1b1a17` |
| **marka** | `#1657d0` **plava** | `#2c5fd6` **plava** |

**Marka im je ista boja.** Dijeli ih samo temperatura neutrala → to nisu dvije teme nego **jedna
tema s klizačem za balans bijele**.

**Pravilo koje iz toga slijedi:** *identitet teme nosi AKCENT, ne toplina sivih.* Prijedlog (prošao
kroz maketu, **nije** kroz `check:contrast`): **academic** plava · **paper** **sepija** `#7a4b1f` ·
**chalk** kredasto žuta · **mint** tirkiz.

⚠️ **Zašto sepija, a ne crvena ili zelena:** crvena se sudara s `--color-danger`, zelena s
`--color-ok`. **Znak teme ne smije značiti isto što i status.** Sepija je uz to boja koju papir
prirodno nosi.

**Prije primjene:** `check:contrast` mora presuditi (AA po temi + hue-odvojenost „točno" od marke
≥25°). Tirkiz je najtješnji slučaj — provjeriti razmak prema `--color-ok`.

---

## ✅ ~~Studio na telefonu — dva gumba su IZVAN ekrana i nedostupna~~ — ZATVORENO 2026-08-19 (K2b, spec §8.8)
**Izmjereno** (390 × 844, otvorena lekcija, staging):

| mjera | vrijednost |
|---|---|
| topbar | **347 px od 844** — 41 % ekrana |
| mrvica (`.st-crumb`) | stupac **96 px širok, 326 px visok** |
| stvarni sadržaj (`.st-canvas`) | **235 px** (28 %) |
| `.st-btn.ghost` („Uredi") | `[335…402]` — strši **12 px** |
| `.st-chip` („objavljeno") | `[414…497]` — **posve izvan** |
| `.st-iconbtn` (postavke) | `[509…523]` — **posve izvan** |

**Zašto se ne vidi kao skrol:** `#editor-page.studio-page.active` je `position:fixed; inset:0` uz
`overflow:hidden` — sadržaj se ne prelije nego **odreže**. Nema skrola jer nema kamo; gumbi su
naprosto nedostupni. Kvar stoji **od U8**, nije regresija ove faze.

**⚠️ Zašto je `layout.authed.spec.js` zelen — rupa je u MOJOJ brani.** Detektor izuzima podstabla u
`position:fixed`, uz obrazloženje *„vlastiti koordinatni sustav, ne može uzrokovati skrol dokumenta,
a (a) to ionako mjeri"*. **Premisa ne vrijedi kad fiksna ljuska ima `overflow:hidden`:** provjera (a)
nikad ne okine, pa je izuzeta **cijela površina Studija**. To je **treći put** da isti detektor
griješi na isti način — izuzeće čija premisa ne vrijedi (§7.11 ①,②). **Prvi korak popravka je brana,
ne CSS:** fiksna podstabla se moraju mjeriti prema *viewportu* (mogu biti odrezana i nedostupna),
samo ne prema skrolu dokumenta.

**Drugi, neovisan nalaz na istoj površini:** [`studio.css:90`](../../css/studio.css#L90) traži
`.st-tree{ display:none }` ispod 680 px i **nikad nije radilo** — medijski upit ne dodaje
specifičnost, a bazno `display:flex` (l. 96) stoji **ispod** njega pa pobjeđuje redoslijedom.
Susjedni `.st-inspector` u istom bloku radi **samo** zato što njegovo bazno pravilo uopće ne
deklarira `display`. ⚠️ **Ne popravljati mehanički:** Studio nema mobilni izbornik za stablo, pa bi
„ispravno" ponašanje ostavilo telefon **bez ijednog načina da se odabere lekcija**. Slučajni kvar
danas drži funkciju živom → traži **odluku o dizajnu** (izbornik vs. složeni raspored), ne zakrpu.

**✅ ZATVORENO K2b-om (2026-08-19), i to kao NUSPOJAVA, ne kao zaseban posao.** Leon je presudio da
globalna traka Studija **spoji** s postojećom umjesto da se složi iznad nje: identitet i položaj
(natrag, znak „Sokrat STUDIO“, mrvica) otišli su gore, Studiju su ostale radnje nad dokumentom.
Izmjereno poslije, isti uređaj (390×844): `.st-topbar` **347 → 57 px**, canvas **235 → 326 px**,
kontrola izvan ekrana **2 → 0**. ⚠️ Da je traka išla IZNAD (kako je spec dotad tvrdio), canvas bi pao
na **~171 px** — cigla bi kvar **pogoršala**. Brana: `tests/studio-chrome.authed.spec.js`
(obrnuta provjera **2/2 pada**).

**⛔ OSTAJE OTVOREN drugi, neovisan nalaz iz istog odjeljka:** `.st-tree` je i dalje `display:flex`
na telefonu (**354 px** nakon K2b) jer medijski upit ne dodaje specifičnost. Ne popravljati mehanički
— Studio nema mobilni izbornik za stablo, pa bi „ispravno“ ponašanje ostavilo telefon bez ijednog
načina da se odabere lekcija. Traži **odluku o dizajnu**.

> ⚠️ **ISPRAVAK 2026-08-26 — ovdje je pisalo „→ K4“, a taj pokazivač je od P2 prazan.** K4 je
> **potrošen** (utopio se u P2: ista pločica, isti ekran), ali P2 je dirao **policu**, ne
> **Studio** — ovaj nalaz stoji netaknut. *Zastarjeli pokazivač je gori od zastarjele činjenice:
> upućuje sljedeću sesiju da je nešto riješeno.* Odluka o Studiju na telefonu je **neraspoređena**
> i ne pripada nijednoj otvorenoj cigli.

---

## ✅ ~~Panel čvora u Studiju je na telefonu ČISTA REDUNDANCIJA~~ — RIJEŠENO 2026-08-19 (K4a, spec §8.10)

> **Riješeno isti dan.** Leon: *„treba se toga riješiti na neki način da se ništa ne sjebe. Pa
> zbog toga ne možeš ništa raditi na telefonu u editoru, apsolutno ništa."* Izmjereno prije
> popravka (390×844): ljuska **522–540 px = 62–64 % ekrana**, canvas **304–323 px**. Poslije:
> canvas **679 px**, ljuska u čvor-modu **165 px = 20 %**. Rez je išao po modu — čvor-mod je
> panel izgubio bez zamjene, katalog-mod ga je dobio kao **ladicu** s kvakom u traci. Brana:
> `tests/studio-mobile.authed.spec.js` (3 testa, uklj. tvrdnju da je **stolno računalo
> nedirnuto**). Zapis ispod ostaje kao dijagnoza.

## 🔥 ~~Panel čvora u Studiju je na telefonu ČISTA REDUNDANCIJA~~ — 2026-08-19 (Leon, uz snimku)

Leon: *„ovo smeće u editoru koje se mora maknut na telefonu, ne kužim koja je ovo pička
materina nepotrebna."*

**Što je to točno.** [`js/studio.js:136`](../../js/studio.js#L136) — `.st-tree` u **čvor-modu**
(`_node` postoji) crta naslov „📁 Moji materijali", karticu s **imenom materijala** i
podnaslov „Osobni materijal — vidiš ga samo ti".

**Zašto je to redundancija, a ne ukras.** Na istom ekranu telefona ime materijala piše
**tri puta**: u globalnoj mrvici (`Moji materijali › Matematika`), u toj kartici, i u `H1`
canvasa odmah ispod. Panel pritom troši visinu na uređaju gdje je visina najskuplja —
mjereno u K2b, `.st-tree` je **354 px**.

**⚠️ OVO RAZRJEŠAVA BLOKADU K4, I TO ISPRAVLJA MOJU RANIJU TVRDNJU.** Do sada je ovdje i u
specu stajalo da se `.st-tree` ne smije sakriti na telefonu jer bi *„telefon ostao bez
ijednog načina da se odabere lekcija"*. To je **točno za KATALOG-mod** (`_node == null`,
admin bira predmet i lekciju iz stabla) i **netočno za ČVOR-mod**, gdje panel nije
navigator nego prikaz **jednog jedinog** elementa koji je već imenovan dvaput iznad.
*Jedna tvrdnja pokrivala je dva različita moda i zato je pola vremena bila kriva.*

**Iz toga slijedi rez:** čvor-mod → panel se na telefonu **briše bez zamjene** (ništa se ne
gubi). Katalog-mod → i dalje traži odluku o dizajnu (mobilni izbornik za stablo), ali to je
**admin-put na telefonu**, dakle mnogo rjeđi slučaj i ne blokira K4.

⚠️ Uz to: `display:none` ispod 680 px u `studio.css` **nikad nije radio** — medijski upit ne
dodaje specifičnost, a bazno `display:flex` stoji ispod njega. Popravak mora to uzeti u
obzir, inače „makni na telefonu" opet neće ništa napraviti.

---

## 🔥 Skrolabilna ploha bez `tabindex` — `.lb-table-wrap` nije dostupan tipkovnicom — 2026-08-14
**WCAG 2.1.1:** ploha koja skrola mora biti operabilna tipkovnicom, inače korisnik koji ne rabi miš
ne može doći do desnog dijela tablice. axe to pokriva pravilom `scrollable-region-focusable`
(**serious**). `.lb-table-wrap` — i onaj iz v2, koji postoji **od U7** — nema `tabindex="0"`.

**Zašto nijedan gate nije pisnuo:** axe u `a11y.spec.js`/`a11y.authed.spec.js` mjeri na **1280 px**,
gdje tablica stane i ploha **ne skrola** — a pravilo se okida tek kad prelijev stvarno postoji.
Novi `layout.authed.spec.js` mjeri prave širine, ali on ne vrti axe.
**To je treći primjerak istog obrasca u tri cigle zaredom** (§7.9 boja · §7.10 teme · §7.11 širina):
**gate koji mjeri jedno stanje tvrdi nešto o jednom stanju.**

**Popravak** nije samo `tabindex="0"` — traži i pristupačno ime (`role="region"` + `aria-label`),
inače čitač ekrana najavi „regija" bez ičega. I treba biti **uvjetan**: `tabindex` na svaku tablicu
koja NE skrola dodaje beskorisne zaustavne točke tipkovnice. Dakle mali runtime-prolaz, ne CSS.

**Kad:** **C5b** (gradivo i vježbe) — tamo se ionako dira `learn-blocks.css` i put renderiranja.
**Prije toga:** proširiti a11y gate barem jednom uskom širinom, inače se popravak ne može dokazati.

---

## ✅ ~~Landing šalje 240 KB editorskog koda posjetitelju bez računa~~ — ZATVORENO 2026-08-24 (T6)

> **✅ ISPUNJENO ciglom T6** (spec §9.13): editor je dobio **vlastitu stranicu** (`editor.html`),
> pa posjetitelj bez računa više ne dobiva nijednu editorsku datoteku. Mjereno: **mrežom
> 234 → 164 KiB** (ispod zadanog budžeta od 200), **sirovo 755 → 519 KiB**, **41 → 36 skripti**,
> editorskih datoteka na putu **7 → 0**.
>
> ⚠️ **Brojka „3,7× preko budžeta" iz ove stavke bila je u KRIVOJ JEDINICI** — računata je na
> sirovim bajtovima, a budžet dolazi iz Lighthouse-postavke, koja mjeri **prenesene**. U
> ispravnoj jedinici zatečeno stanje bilo je **1,17×**, ne 3,7×. Stavka je dakle bila **točna u
> smjeru, kriva u mjeri**; ostavlja se zapisana jer je pouka općenita: *agregat u krivoj jedinici
> može mjeriti točno i savjetovati krivo* (isti razred kao `palette:breakdown`).
>
> **Najvažnije: sada postoji GATE.** `npm run check:budget` (u preflightu) čuva **sastav**
> (nijedna editorska datoteka na posjetiteljevu putu) **i težinu** (≤ 200 KB prijenosa). Ova je
> stavka devet dana rasla upravo zato što ga nije bilo — *stavka bez gatea ne stoji na mjestu
> nego klizi*, i to je zapisano niže, u njezinoj vlastitoj povijesti.

<details><summary>Povijest mjerenja (zadržana — pokazuje kako je brojka rasla)</summary>

**Izmjereno** (profil telefona 390 px, prazan cache, nekomprimirano, lokalni server):
dokument 66 KB · **skripte 821 KB kroz 45 zahtjeva** · stilovi 242 KB · **ukupno 1.173 KB**.
Od skripti je **241 KB (38 %)** editorsko/admin: `studio.js` (50) · `block-editor.js` (53) ·
`block-editor-media.js` (30) · `admin.js` (45) · `admin-editors.js` (35) · `draft-store.js` (18) ·
`node-images.js` (6) · `card-limits.js` (2). Još **119 KB** su modovi i vježbe, kojih na landingu
nema. Svih 38 je **sinkrono**, bez `defer`, u `index.html`.

**📏 PREMJERENO 2026-08-19 (K2b):** **728 KiB u 41 lokalnoj skripti**, od toga **232 KiB = 31 %**
editorsko (`studio` · `block-editor` · `block-editor-media` · `admin` · `admin-editors` · `draft-store`),
**38 bez `defer`**. ⚠️ **Brojka je NARASLA otkad je stavka otvorena** — `main` nosi 691 KiB, grana 728 KiB.
Nijedna cigla je nije pogoršala namjerno; rasla je kao nusprodukt K1/K2a/K2b i cigli landinga.
*Stavka bez gatea ne stoji na mjestu nego klizi* — zato je „JS-budžet landinga kao gate" u §8.5
zapisan kao posao koji ne ovisi ni o jednoj cigli i može se ubaciti kad god.

**📏 PREMJERENO PONOVNO 2026-08-20: 744,6 KiB u 41 skripti · 38 bez `defer` · 238,2 KiB (32 %)
editorsko u 6 datoteka.** Putanja je time **691 → 728 → 744,6** — brojka **nijednom nije pala**,
i to bez ijedne namjerne izmjene. Budžet koji si je projekt sam zadao je 200 KB → **3,7×**.
**Dobila je mjesto: cigla T6** ([§9.3](../plan/FRONTEND_REDIZAJN.md)), i ondje **nije čišćenje
nego preduvjet faze „POLICA"** — offline ljuska ne smije nositi editor koji offline student
nikad ne otvori.

**Zašto je ovo nalaz, a ne mišljenje:** projekt si je u ovom istom dokumentu (sekcija „Brutalan
bar", #1) zadao budžet **„JS ≤ ~200 KB"** i označio ga 🔥 *„Blokada, ne upozorenje."* Gate nikad
nije izgrađen, pa je stvarnost danas **4× iznad vlastitog praga**. To je **isti obrazac koji je
proizveo §7.9**: pravilo zapisano, mjerač ne postoji. ⚠️ FCP je uredan (**224 ms** toplo) — cijena
nije u prvom pikselu nego u **parsiranju na slabom telefonu i u 45 zahtjeva na mobilnoj mreži**.
*(Prvo mjerenje u istoj sesiji dalo je FCP 2984 ms; to je bio hladan start preglednika, ne stranica.
Zapisano jer je pouka: jedno mjerenje bez ponavljanja nije mjera.)*

**Kad:** uz **C3** — C3 ionako prepisuje površinu tih istih datoteka, pa je odvajanje s kritičnog
puta najjeftinije baš tada. Uz to **budžet kao gate**, da brojka nikad više ne poraste tiho.

</details>

> ⚠️ **STAVKA OSTAJE OTVORENA — 2026-08-15.** Spec §7.13 je tvrdio da se zatvara sama, jer da živi
> prikaz u herou nosi taj teret. **Izmjereno pri brisanju demoa: ne nosi ga.** Demo je bio čisti
> `textContent`/`createElement` i nije dodirivao nijednu editorsku datoteku; tih **234,2 KB**
> učitavaju obični `<script src>` na dnu `index.html`, bezuvjetno, i danas ih je jednako mnogo kao
> jučer (landing = **654 KB u 39 js-datoteka**). **Pretpostavljena uzročnost preživjela je reviziju
> jer je zvučala uzročno; oborila ju je jedna naredba.** Ako netko ovu stavku opet pokuša zatvoriti
> „usput", traži mjerenje prije i poslije.

---

## 🔥 CSP je odgođen „do UGC-a" — a UGC je na produkciji — 2026-08-14
Zapis u ovom dokumentu (sekcija „Hardening v1") glasi: *„CSP + DOMPurify — tek uz UGC (Faza 6),
ne prije (**sadržaj autorski/trustiran**)."* DOMPurify je isporučen, ali **CSP nije**, a uvjet pod
kojim je odgoda dana **više ne vrijedi**: osobni graditelj („Moji materijali") je na produkciji,
korisnik piše sadržaj koji renderira `blocks-renderer.js`, i sadržaj **nije više autorski**.
Odgoda je istekla sama od sebe i nitko je nije podigao jer je stajala označena 💤.

`vercel.json` danas ima `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` i
`Permissions-Policy` — **CSP je jedina koja fali**, i jedina koja bi ograničila štetu ako escape
negdje popusti (v. BUG-025, gdje granica **jest** popustila godinu dana neopaženo).
⚠️ Nije trivijalno: inline `onload` na KaTeX-linku, inline `gtag` blok i tri CDN-a (cdnjs,
jsdelivr) traže ili `nonce` ili preseljenje.

**Ažurirano 2026-08-14:** SRI je isporučen (v. zatvorenu stavku gore), pa je **jedan od tri
problema riješen**: `script-src` više ne mora vjerovati hostu na riječ — svih 7 podresursa je
pinano i hash-provjereno, a `check:cdn` drži da tako ostane. Preostaju **inline `gtag` blok** i
**inline `onload` na KaTeX-linku**. SRI i CSP se **ne zamjenjuju**: SRI kaže „ova datoteka je
točno ta", CSP kaže „nijedna druga se ne smije učitati". Bez CSP-a injektirana `<script>` s
posve drugog hosta i dalje prolazi.

**Kad:** **C6** (profil/auth/pravne/consent) — tamo se ionako dira `consent.js` i inline gtag.

---

## 🔥 M5 — duljina kartice: vođenje u editoru + strop 500 — 2026-08-07
**Nalaz (Leon, živi pregled):** *„trebat ćemo poradit na ograničenju koliko jedna kartica ima teksta."*
Nije bio kriterij faze „Materijal od nule do učenja" pa je preživio njeno zatvaranje — **odluka je već pala,
samo izvedba čeka.**

**Izmjereno prije odluke** (5379 kartica u `data/json/`): pitanja **0** preko 200 znakova (max 134) → nisu
problem · odgovori **2487 = 46,2 %** preko 200 · 928 preko 300 · **48 preko 500** (max 736; **25 jedinstvenih**,
ostalo su kopije u `final`). Razliveno kroz **sve** predmete → **standard je platformski problem, ne Sašin.**
**Posljedica: tvrdo ograničenje na 200 srušilo bi gotovo pola kataloga** → ne dolazi u obzir retroaktivno.

**ODLUKA (Leon 2026-08-07): tvrdi strop = 500 znakova**, uz mekano vođenje na 200. U **dva koraka**, i
redoslijed je bitan:
- ~~**M5a — vođenje u editoru**~~ ✅ **NA PRODUKCIJI od 2026-08-08** (faza „Mjera i zaborav",
  `eee6f14`). Brojač uživo · upozorenje 200 · tvrda blokada 500 ·
  vrijedi u oba svijeta jednom promjenom (Studio nema vlastiti editor kartica). Politika = `js/card-limits.js`
  (jedna definicija za editor i validator). `validate:content` dobio raspodjelu duljina. Detalji:
  [archive/MJERA_I_ZABORAV.md](../archive/MJERA_I_ZABORAV.md).
- **M5b — zatezanje** *(sadržaj, poslije)*: skratiti **25 zatečenih** kartica (detalj → learn, po standardu
  kartice: `entrepreneurship` 28 · `traffic` 6 · `food-nutrition` 4 · `sit` 4 · `ebusiness` 2 · `math` 2 ·
  `te2` 2) → **tek tada** `maxLength: 500` u `schema/subject-content.schema.json`.
  ⚠️ **Obrnut redoslijed = `validate:schema` crven = CI blokiran.**
- Uz to: `validate:content` dobiva izvještaj o raspodjeli duljina (brojka, ne gate) da se vidi trend.

**Veže se na:** kartica-standard u [architecture/CONTENT_SCHEMA.md](../architecture/CONTENT_SCHEMA.md)
(kratke definicije <200 znak., detalj → learn). [[content-model-standard]]

## 🔥 RUČNO ČEKA LEONA (2 stavke) — pripremljeno 2026-08-10, ostala je samo RADNJA
Obje su **istražene, izmjerene i opremljene gateom**; ostao je klik/naredba koje Claude ne smije
izvesti. Nijedna ne ruši produkciju. **Treća (re-sync `macroeconomics`) je izvršena 2026-08-21** —
v. ispod.

1. **Obrisati `bright-function` i `quick-api`** — Supabase Dashboard → Edge Functions → `<ime>` → Delete.
   **Nalaz je ozbiljniji nego što je zapisano 2026-08-09:** `bright-function` ima **sha256 `49363e4b…`,
   identičan `delete-account`-u** → to je **drugi, nezapisani endpoint koji nepovratno briše račun i sve
   podatke**, aktivan na `/functions/v1/bright-function`. Sam po sebi nije rupa (identitet i ondje ide
   isključivo iz JWT-a, `verify_jwt: true`), ali je **stara kopija destruktivnog koda**: sljedeći guard
   koji dobije `delete-account` — kao što je `eee6f14` dodao zaštitu da se admin ne obriše sam — kopija
   **neće dobiti**, a i dalje će raditi. Zato ovo nije kozmetika nego dug s rokom trajanja.
   ✅ **Gate postoji:** `npm run check:functions` (bez ijednog ključa; 401 = postoji, 404 = obrisano).
   Danas je **crven** i pokazuje obje; pozelenit će čim se obrišu, i ubuduće hvata svakog novog stranca.
   Claude nema alat za brisanje Edge Functiona (MCP ima samo deploy/get/list).

   > **📅 ODGOĐENO DO C6 — svjesno, uz uvjet (Leon, 2026-08-13).** Leon: *„to u nekoj drugoj fazi, tipa
   > kada budemo gotovi sa 75 % frontend razvoja."* **Odgoda se dala provjeriti, zato je prihvaćena:**
   > jedini stvarni rizik čekanja je **divergencija** (da `delete-account` dobije guard koji ne stigne do
   > kopije), a kroz C3–C7 nijedna cigla ne dira Edge Functione — mijenja se CSS oko sučelja. Rizik
   > odgode je tijekom frontend faze **nula**.
   > **Vezano uz C6, ne uz postotak:** C6 je *profil, auth, pravne, consent* — cigla koja ionako radi na
   > površini brisanja računa (≈ 8. od 9 cigli ≈ 78 %, dakle Leonova brojka, ali s povodom).
   > **⚠️ UVJET KOJI PONIŠTAVA ODGODU:** dirne li itko `supabase/functions/delete-account/` prije C6 —
   > briše se **odmah**, jer tad divergencija prestaje biti hipotetska.
   > **Nije otvorena rupa i to je izmjereno, ne pretpostavljeno:** gate radi **bez ijednog ključa**, pa
   > je njegov vlastiti **401** dokaz da funkcija traži JWT; identitet i ondje ide iz `getUser()`.
   > Pozivatelj može obrisati **samo vlastiti račun** — što može i kroz sučelje.
   >
   > **⚠️ PRIJE BRISANJA (nije u izvornom zapisu, dodano 2026-08-13):** provjeriti **je li ih itko ikad
   > pozvao** (`query_logs`, read-only, minuta). Backlog je dosad govorio samo „obriši", a nula poziva
   > pretvara pretpostavku „zaboravljena kopija" u činjenicu; ne-nula mijenja priču, a brisanje uklanja
   > i trag. Uz to pročitati tijela obje funkcije (`get_edge_function`) — o `quick-api` znamo najmanje.
   >
   > **🔧 Klasa, ne slučaj:** ovo je sjedilo danima jer `check:functions` **nikad ne trči sam** (mrežni,
   > izvan preflighta). A gate **ne treba nijedan ključ** → nema razloga da ne bude zaseban CI job
   > (nightly ili na push na `main`). Tad bi bilo crveno u Actionsima isti dan. ~1 h posla, rješava klasu.
2. ✅ ~~**Re-sync `macroeconomics`**~~ — **IZVRŠENO 2026-08-21** (Leon pokrenuo
   `node scripts/migrate-content.js macroeconomics`; skripta traži `service_role`, a taj put je
   Claudeu blokiran).
   **Što je bilo:** baza i datoteke razlikovale su se u **točno jednom znaku** u `macroeconomicsM1` i
   `macroeconomicsFinal` — index 207, `goodsMarket.flashcards[5].answer`, ćirilično `С` (U+0421) vs
   latinično `C` (U+0043), duljina ista (246); `macroeconomicsM2` je već bio identičan. Oku nevidljivo,
   ali pretraga po „MPC" tu karticu nije nalazila, a `diff:db` je trajno šumio.
   **Rezultat:** `diff:db macroeconomics` **3/3 identično, 0 razlika** · `check:final` **16/16**
   (`final == M1 ⊕ M2 (+examPractice)` drži i dalje).
   > ⚠️ **Pouka o redoslijedu, ne o znaku.** `migrate-content.js` radi **upsert = piše preko baze**, a
   > admin kroz Studio smije uređivati živi sadržaj → re-sync naslijepo može pojesti tuđu izmjenu, a
   > `content_versions` je **audit, ne undo**. Zato je radnja imala tri koraka i samo je treći pisao:
   > `diff:db` (dokaz da nema živih edita — razlika **ista kao 11 dana ranije**) → `--dry` (dokaz da
   > su brojke očekivane) → prava naredba. **Provjera prije upisa je bila jeftinija od bilo kakvog
   > oporavka poslije njega.** Isto vrijedi za svaki sljedeći re-sync bilo kojeg predmeta.
   >
   > **Ništa se nije commitalo ni deployalo, i to nije previd:** poravnata je **baza**, datoteke su
   > izvor istine i već su bile ispravne. Bez `npm run bump`, bez commita — produkcija ostaje
   > netaknuta.
3. ⛔ ~~**Uključiti Leaked Password Protection**~~ — **NIJE STAVKA ZA RUKU. Provjereno 2026-08-21:
   to je Pro značajka**, a organizacija (`pfbkisxynphwxdbqmmtt`) je na **free** planu → prekidača u
   Dashboardu **nema**. Advisor ga svejedno prijavljuje jer ne gleda plan. **Premisa je stajala
   ovdje 11 dana i poslala bi Leona da traži kontrolu koja ne postoji.**
   **Zamijenjena je radnjom koja JEST izvediva na free planu:** Dashboard → Authentication →
   Sign In / Providers → **Minimum password length 6 → 8** (forma traži 8, ali `minlength` je
   pravilo **preglednika**; serverski minimum je zadanih 6). ⚠️ Polje *Password Requirements* **ne
   dirati**, i **prije toga popraviti `WeakPasswordError`** — v. zasebnu stavku „Leaked password
   protection — rješivo BESPLATNO" gore, gdje stoji i HIBP izvedba u našem kodu.
   **Advisori: 0 ERROR**, sve WARN (v. §Advisori dolje).

## ➖ Sigurnosni advisori na PROD-u — 0 ERROR, 16 WARN (snimljeno 2026-08-10)
Ostavljeno svjesno, ali zapisano da se ne izgubi:
- **`snapshot_content_version` i `handle_new_user` dostupni `anon`-u.** Oboje su **trigger-funkcije** —
  izravan RPC poziv im nema smisla, ali su u izloženoj shemi. Popravak = `REVOKE EXECUTE … FROM anon`;
  **ne dira trigger** (okida se pravima vlasnika tablice, ne pozivateljevim).
  ⚠️ **`is_admin()` se NE smije revokeati `authenticated`-u** — RLS politike ga zovu kao pozivatelj, pa bi
  gubitak EXECUTE-a slomio admin-upis. Za `anon` treba provjeriti gazi li ijedna politika nad javno
  čitljivim tablicama kroz `is_admin()` prije nego se dira.
- **`set_updated_at` bez fiksnog `search_path`** — standardno kaljenje (`SET search_path = ''`).
- Ostali WARN-ovi su naši owner-scoped `SECURITY DEFINER` RPC-ovi koje `authenticated` **mora** moći zvati
  (ADR-024: jedini put upisa) → očekivano, ne popravlja se.

## 🔥 RLS ponovno računa `auth.uid()` za SVAKI redak — 13 politika — 2026-08-14
**Nalaz iz Supabaseovog PERFORMANCE-advisora**, koji dotad nitko nije pogledao — svi dosadašnji
zapisi (§Advisori gore) tiču se **security**-advisora. Trinaest politika zove `auth.uid()`
**po retku** umjesto `(select auth.uid())`, čime Postgres gubi mogućnost da poziv izračuna
jednom po upitu (`initPlan`):

| tablica | politike |
|---|---|
| `nodes` | select · insert · update · delete |
| `node_content` | select · insert · update · delete |
| `progress` | select · insert · update · delete |
| `profiles` | select |
| `node_content_versions` | select |

**Zašto je to baš SAD važno:** cijena se mjeri **brojem korisnikovih redaka**, a ADR-029 je UGC
proglasio glavnim proizvodom. Danas, s malo čvorova po korisniku, razlika je nemjerljiva —
korisnik s 500 čvorova plaća 500 evaluacija po upitu. **Ovo je jedini nalaz u reviziji koji
postaje SKUPLJI što se duže čeka**, i jedini koji `load-probe` ne bi otkrio, jer probe mjeri
prazne račune.

Popravak je **jedna zagrada po politici** i ne mijenja semantiku (`(select auth.uid())` vraća
istu vrijednost). Uz to: dva **neindeksirana strana ključa** (`content_versions_edited_by`,
`node_content_versions_edited_by`) — sitno, ali audit-tablice samo rastu, nikad se ne prazne.

**Blokirano na:** SQL na PRODUKCIJI traži Leonov izričit OK (klasifikator blokira `apply_migration`).
Migracija se piše i vrti **prvo na `sokrat-staging`**, pa tek onda na prod.
**Provjera nakon:** advisor više ne javlja `auth_rls_initplan`; `npm run test:authed` zelen
(politike se ne smiju promijeniti u ponašanju, samo u planu izvršavanja).

## ➖ Broj pitanja na landingu ne pokriva sve predmete — 2026-08-09

> **PREMJERENO 2026-08-25:** stavka je i dalje otvorena, ali su joj brojke ostarile — predmeta
> je **24**, ne 22. `data/landing-stats.js` sam to i priznaje: `subjectsCounted: 17`. Dakle
> raskorak je **veći** nego kad je stavka pisana, a ne manji.
**Nalaz (uz popravak broja predmeta):** landing sad točno piše **22 predmeta**, ali „**5.700+ pitanja**"
dolazi iz `scripts/compute-stats.js` koji **namjerno broji samo primarni (EN) program** — da prijevode
ne broji dvaput. Dok je i broj predmeta bio 17, to je bilo dosljedno; sad više nije.

**Dvije opcije, obje imaju cijenu:**
- **Ostaviti** — brojka podcjenjuje, ali nikoga ne obmanjuje. *(preporuka; „22 predmeta / 5.700 pitanja"
  samo izgleda nespretno.)*
- **Brojati sve** (~7.000+) — dosljedno s brojem predmeta, ali **dvaput broji isto gradivo** na dva jezika.

Pravo rješenje je vjerojatno treće: brojati pitanja **po programu** i prikazivati ono koje odgovara
jeziku sučelja. To traži da `compute-stats.js` emitira mapu po programu umjesto jednog broja — nije
veliko, ali nije ni jednoredno. **Veže se na frontend redizajn**, gdje se ionako presuđuje što hero piše.

## ➖ Akcent kartice = CIJELA kartica u boji, ne samo rub — 2026-08-07
**Nalaz (Leon, živi pregled M3b):** *„mislio sam da cijela kartica bude crvena a ne samo rubovi ali nema veze."*
Odgodio je izričito („nema veze"), ali je **očekivanje jasno i vrijedi ga zapisati dok je svježe**:
boja stavke bi trebala **obojati plohu**, ne samo je obrubiti.

**Zašto je izvedeno kao rub.** M3b je posudio jezik od `.lb-tint` (rub + tinta 10 %), koji je nastao za
**learn-blokove** — ondje blok teče unutar teksta pa puna ploha ne dolazi u obzir. Kartica je **samostalan
objekt** i podnijela bi punu boju; kviz i dopuna vjerojatno ostaju na rubu, jer su gušće složeni.

**Prepreka koju treba riješiti prije izvedbe:** lice kartice je **zasićen indigo gradijent**
(`linear-gradient(135deg, var(--primary), var(--primary-dark))`). Puna boja ondje znači **zamijeniti**
gradijent akcentom (npr. gradijent izveden iz `--item-acc`), a ne slojevati preko njega — inače se boje
sudaraju. To dira izgled svih 22 predmeta, pa traži Leonovu presudu o smjeru, ne samo CSS.

**Veže se na:** ugovor boja [UGC_SPEC §3](../product/UGC_SPEC.md) (trebao bi reći **kako** se akcent crta,
ne samo da postoji) i na **frontend redizajn**, gdje se ionako presuđuje izgled kartice.

## ✅ Brisanje računa — self-service „Obriši račun" (GDPR pravo na zaborav) — 2026-07-04

> **NA PRODUKCIJI od 2026-08-08** (`eee6f14`; Edge Function `delete-account` ACTIVE na PROD-u).
> Izvedba slijedi skicu ispod, uz **tri ispravke koje je stvarnost nametnula**:
> ① kaskadno brisanje se **ne piše ručno** — svi FK-ovi prema `auth.users` su već `on delete cascade`,
> pa je jedini pravi posao Storage; ② Supabase **odbija obrisati vlasnika objekata u Storageu**, pa
> „slike prije korisnika" nije redoslijed radi urednosti nego preduvjet; ③ **admin se ne može obrisati
> sam** — posjeduje `lesson-images`, pa bi mu `deleteUser` pao **nakon** brisanja osobnih slika i ostavio
> poluobrisan račun; guard zato stoji prije ijednog brisanja (sve-ili-ništa). Nativni self-delete RPC
> (točka ⚠️ na dnu) **ne postoji** — provjereno u dokumentaciji 2026-08-08.
> Detalji: [archive/MJERA_I_ZABORAV.md](../archive/MJERA_I_ZABORAV.md).

**Izvorni nalaz i dizajn-skica (2026-07-04), zadržano radi obrazloženja:**
**Nalaz (korisnik, 2026-07-04):** app NEMA self-service brisanje računa. Postoji samo (a) „Delete cloud data" gumb
(`js/profile.js:deleteCloudData` — briše `progress` retke preko anon+RLS, odjavi) i (b) tekst „za brisanje računa
pošalji mail". To je nedovoljno za live proizvod s EU korisnicima (GA/Sentry aktivni). **Ne radi se sad** (korisnikova
odluka), ali je prava planirana stavka.
**Odlučeni put:** **Supabase Edge Function** (ADR-016 — `service_role` NIKAD u Vercel; pravilo: privilegirano → Edge Function).
**Dizajn-skica (kad uđemo u to):**
1. **Edge Function `delete-account`** (Deno, na Supabaseu). `service_role` iz Supabase secrets (`supabase secrets set`), nikad u gitu/frontendu.
2. **Verifikacija identiteta u funkciji:** iz `Authorization: Bearer <JWT>` (šalje `supabase.functions.invoke`) → klijent s tim JWT-om → `auth.getUser()` → **provjeren** `user.id`. **NIKAD ne vjeruj `user_id` iz body-ja** (eskalacija privilegija).
3. **Kaskadno brisanje:** prvo `progress` (i buduće UGC tablice) za taj `user.id`, pa `auth.admin.deleteUser(user.id)`. Redoslijed: podaci → auth (orphan-safe). Razmotriti DB `ON DELETE CASCADE` na FK prema `auth.users`.
4. **Frontend (`js/profile.js`):** „Delete account" (danger) gumb → dvostruka potvrda (upiši email ili „DELETE") → `functions.invoke('delete-account')` → uspjeh: lokalni `signOut` + očisti localStorage napredak + toast + redirect na landing.
5. **GDPR tekst:** `privacy.html` — opisati self-service brisanje (što se briše, nepovratno). Odlučiti o mail-fallbacku.
6. **Soft- vs hard-delete:** MVP = **hard-delete** (doslovno „pravo na zaborav"); soft-delete (grace period) tek ako zatreba.
7. **Test:** RLS-test proširiti (ne-vlasnik ne briše tuđe); ručni E2E na test-računu. ⚠️ Ne u iPhone-touch Playwright matrici (pravi auth se preskače) → ručno + scratch.
**⚠️ Provjeriti pri gradnji:** ima li Supabase do tada **nativni „delete self" RPC** (tada ni Edge Function ne treba `service_role`).
**Gdje pripada:** uz **F4** (prvi backend-privilegij + `/api`/Edge šav) ili kao zaseban „compliance" zadatak koji možda vrijedi gurnuti ranije (live je s pravim korisnicima). [[foundation-pivot]]

## ➖ Supabase Auth — rate-limiting / brute-force zaštita prijava — 2026-07-10
**Nalaz (korisnik, 2026-07-10):** spriječiti da netko udara login endpoint (npr. 10.000 pokušaja prijave).
**Put (dashboard-only, bez koda):** Supabase Auth (GoTrue) ima ugrađene rate-limite → **Auth → Rate Limits** (po IP-u/satu za login/signup/reset/token-refresh) — provjeriti i pojačati po potrebi. Opcionalno **Bot/CAPTCHA zaštita** (hCaptcha/Turnstile) u Auth settings za signup/login. Primijeniti na **PROD i staging**.
**Kad:** ne sad (nema napada, baza mala); planirano prije šireg rasta / uz **F6 sigurnost** (CSP/DOMPurify/UGC). Sitno, brzo — čim bude prometa vrijedno uključiti.
**+ Leaked Password Protection (advisor-nalaz, 2026-07-12):** Supabase Auth provjera lozinki protiv HaveIBeenPwned je ISKLJUČENA (WARN na oba projekta) → uključiti u istom dashboard-prolazu (Auth → Password security), PROD i staging.

## 🧱 Hardening v1 + perf (2026-06-29) — sad u [FOUNDATION_PLAN.md](../archive/FOUNDATION_PLAN.md) Faza 1/3
Nalazi iz `archive/SONNET_REVIEW_2026-06.md` (vanjski review; **provjereni protiv koda** — #7 display=swap je bio NETOČAN, već postoji).
Tretiraj `archive/SONNET_REVIEW_2026-06.md` kao prijedloge za provjeru, ne istinu. Konkretne stavke (Faza 1C / 3 u FOUNDATION_PLAN):
> **✅ STATUS: F1 1C stavke ISPORUČENE + LIVE (2026-06-30):** sigurnosni headeri, „Works offline"→„No install needed", `loadProgress` schema-merge (u `storage.js`, ne analytics), „400+"→dinamičan (`compute-stats.js`), mrtav `lessonCategoryMap`→`{}`. Preostaju 💤 (CSP/DOMPurify/CSS-bundling/PWA-ikona/SW = Faza 3/6).
- 🔥 **Sigurnosni headeri** (`vercel.json`): makni deprecated `X-XSS-Protection`; dodaj `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- ✅ **„Works offline" copy** — RIJEŠENO + ✅ **DEPLOYANO NA PRODUKCIJU 2026-07-05** (F3 3A, main `868dc9f`): Service Worker (`sw.js` offline app-shell) + 3A.3 update-flow (Fable, ADR-019) → copy „Works offline"/„Radi offline" LIVE.
- ➖ **`loadProgress` schema-merge** (`js/analytics.js`): `{ ...defaultProgress, ...JSON.parse(saved) }` — otpornost na pokvaren/stari localStorage.
- ➖ **„400+" dinamički** (`index.html` ×3): izračun `questionCount` iz kataloga (kao `subjectCount`).
- ➖ **Mrtav `lessonCategoryMap` entry** (`js/config.js`) — vidi nalaz 2026-06-18 niže (PAZI: objekt JE referenciran u `navigation.js:545`).
- 💤 **CSP** + **DOMPurify** — tek uz UGC (Faza 6), ne prije (sadržaj autorski/trustiran).
- ✅ **CSS bundling** (26 `@import` → 1 `styles.bundle.css`, `build-css.js`) + **auto version-bump** (`bump-version.js`) — ISPORUČENO (F3 3B/3C.1, 2026-07-05, grana `foundation/f3`). ⬜ Ostaje 3C.2 (auto-bump na Vercel deploy-u).
- 💤 **PWA maskable ikona** — odvojena ikona sa safe-zone paddingom (sonnet #15).

### „Brutalan bar" — 5 nadogradnji (2026-06-29, korisnik: „ne zdrav nego jeben i brutalan"; FOUNDATION_PLAN §7)
Iznad „zdravog" temelja — ono što ga čini elitnim. Sve u postojeće faze, trošak alata 0 €:
- 🔥 **TVRDI CI gateovi (#1)** — Lighthouse budžeti (Perf≥0.95/A11y≥0.95/LCP≤2s/JS≤~200KB) + axe-core (0 serious) + Playwright `toHaveScreenshot` baseline. **Blokada, ne upozorenje.** [F1 1D, pojačano F3]. BUG-015 bi ovo ulovilo.
  - ✅ **axe a11y gate** (`tests/a11y.spec.js`) — GOTOVO 1D.2 (popravljen 1 serious: sidebar tabindex).
  - ✅ **layout-regression guard** (`tests/layout-guard.spec.js`, deterministička geometrija, 13 širina × 2 jezika) — GOTOVO 1D.3, hvata BUG-015 klasu, platform-neovisno.
  - ⬜ **Pixel `toHaveScreenshot`** — ODGOĐEN: baseline ovisi o platformi (Win lokalno ≠ Linux CI), nema Dockera/CI-token pristupa za Linux-baseline ovu sesiju. Plan kad bude moguće: (a) Playwright Docker image lokalno, ILI (b) `workflow_dispatch` job `--update-snapshots` koji commita `-linux` baseline (GITHUB_TOKEN write). Determinističke provjere (a11y+layout-guard+postojeći overflow sweep) dotad pokrivaju regresije.
- ✅ **Sentry + release-tracking (#2)** — GOTOVO + LIVE (2026-07-01, F2 2E): `js/monitoring.js`→`window.SokratMonitor`, consent-gated, Loader EU/DE, samo hvatanje grešaka (Tracing/Replay/Logs off), `sendDefaultPii:false`, release `sokrat-study@…`; uživo verificiran. ⬜ opc.: mail-alert prag na dashboardu.
- ✅ **RLS test (#3)** — GOTOVO 1E: `scripts/rls-check.js` read-only protiv POSTOJEĆE baze (besplatno). ⬜ **Ephemeral Supabase branch** (izolirani test + migracije na branchu) ODGOĐEN: **traži Pro plan $25/mj** (provjereno; org je free, branch compute $0.01344/h tek nakon Pro) → kad/ako Pro.
- 💤 **CRUD versioning + audit-log + dry-run diff (#4)** — undo/povijest/kočnica za source-of-truth flip. [F4 4E].
- 💤 **SRS dizajn-dok PRIJE koda + FSRS (#5)** — `docs/SRS_PLAN.md`; 2024+ algoritam, ne nabacani SM-2. [F5 5.0].

## ➖ Accounting → JSON format migracija (F2 2A ostatak; 2026-07-02)
Jedini predmet koji NIJE na JSON dual-readu (17/18 migrirano, LIVE). **Svjesno odgođen** — korisnik zasićen
računovodstvom (pravilo: ne dirati Accounting osim izričito). Postupak kad dođe red (čisto mehanički, ~5 min):
`npm run export:json accounting` → u `data/catalog.js` accountingu dodaj `dataFormat: 'json'` (iza `resolve`,
PRIJE `codeScripts`) → bump `catalog.js?v=` u index.html → gate (verify/validate:schema/export-check/Playwright).
Vježbe (41, `data/accounting/exercises.js`) ostaju `.js` — codeScripts već postavljen (BUG-012).

## ➖ Code-review nalazi (2026-06-18) — čišćenje, ništa kritično
Pregled cijelog koda (korisnik tražio): stanje vrlo dobro, bez bugova. Sitni dug za počistiti kad zgodno:
- ➖ **Mrtav `lessonCategoryMap`** (`js/config.js`): referencira `entrepreneurship` lekcije `second-exam-prep`/`final-exam-prep`
  koje više ne postoje (catalog je na `first-midterm`/`second-midterm`/`final`). Bezopasno — `js/navigation.js` pada na „sve kategorije".
  **Akcija:** obrisati entry (par redaka) ili cijeli `lessonCategoryMap` ako ga ništa drugo ne koristi.
- 💤 **`resolveExercise` robustnost** (`js/exercises.js:~489`): ako randomizirani `generate()` baci, vraća bazni `ex` (bez `fields`) →
  vježba bi se prikazala prazna. Idealno: sakriti/označiti. Trenutno netriggerirano (naši `generate` su čista aritmetika).
- 💤 **Stari root `data-*.js`** (12 sem-2 datoteka) nisu lazy-splitani po lekcijama kao noviji predmeti — namjerno (ADR-006), migracija u Bloku B.
- 💤 **cloud-sync „broj→max"** (`js/cloud-sync.js:60`) pretpostavlja monotone brojače; ispravno za sad, ali pažnja pri budućim ne-monotonim numeričkim poljima.

## ✅ GOTOVO (2026-06-13) — Auth prelazak na email+lozinku
**Implementirano po dogovoru od 2026-06-12** (detalji: `docs/records/PROGRESS.md` 2026-06-13 + `docs/architecture/BACKEND.md` §Staza B):
email+lozinka (signUp/signInWithPassword), email potvrda obavezna, magic-link UKLONJEN, ime pri registraciji
(`display_name`, na profilu i nav gumbu), Forgot/Change password, pravne stranice ažurirane. Baza nepromijenjena.
**Ručni korak korisnika:** Supabase dashboard → Auth → Providers → Email → min duljina lozinke 8.
**✅ LIVE — deployano 2026-06-13 (`ca06158..51e4e7b`, uz izričito odobrenje korisnika); deploy gate ispunjen.**

**Ostaje za kasnije:**
- **Google login** (uz lozinku; treba korisnikov OAuth client u Google Cloud Consoleu).
- **Onboarding anketa pri ulasku u sustav** — korisnikova ideja (2026-06-12); veže se na budući backend za izradu
  sadržaja iz PDF prezentacija (admin/ingest alati).

## ✅ ZAVRŠENO — Sadržaj 2. god (sem 1): restruktura na K1 / K2 / finalni → CIJELA 2. GODINA 8/8
**Status (2026-06-13):** semestar 2 = **4/4 KOMPLETNO**, semestar 1 = **4/4 KOMPLETNO** → **2. godina HM = 8/8 predmeta.**
**Accounting ✅** (3 lekcije + reusable Exercises sustav, 41 vježba; `docs/architecture/EXERCISES_ENGINE.md`), **Tourism Economics `te2` ✅**
(restrukturiran + rebuild iz PDF-ova, LIVE), **E-Business ✅** (split + obogaćivanje iz 14 PDF-ova; finalni 15 kat/152 fc; **LIVE `51e4e7b`**),
**Entrepreneurship ✅** (2026-06-13: split + 4 nove kategorije + obogaćivanje iz 11 PDF predavanja; finalni **15 kat / 175 fc / 134 quiz /
80 fill** — najveći predmet; **LIVE `8a37404`**). **▶ Dalje = 1. GODINA** (vidi [[content-roadmap-sequencing]]).
**⚠️ Korisnik je ZASIĆEN računovodstvom (2026-06-12) — ne vraćati se na Accounting (ni Final-tab ni USAR/USALI klasifikaciju) osim izričito.**

**Obrazac (kao Marketing/Geo/F&N):** po predmetu — utvrditi K1/K2 granicu iz silabusa/materijala → sadržaj podijeliti
na `first-midterm` (K1) + `second-midterm` (K2) → **finalni = hibrid** `Object.assign({}, K1, K2, { examPractice })`
(učitava se ZADNJI). Catalog: 3 lekcije + 3 scripta + `resolve`. Bump `CONTENT_VERSION` + `catalog.js`/`content-loader.js`
`?v=`. Verify + strukturni validator + Playwright (+ ciljani render testovi K2/finalni). **Treba: izvorni materijali +
silabus po predmetu.** (Napomena: ADR-006 „ne preslagivati stare root-predmete do Bloka B" — ova odluka to nadjačava
za sadržajno upotpunjavanje; migracija u bazu i dalje ide JEDNOM u Bloku B.)

| Predmet | sem | Trenutno (lekcije → podaci, kategorija/flashcards) | Što treba |
|---|---|---|---|
| ~~**Tourism Economics** (`te2`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** `first-midterm`/`second-midterm`/`final` (`data/te2/`, te2M1/te2M2/te2Final); finalni **11 kat / 135 fc / 94 quiz / 66 fill** | ✅ Restrukturirano + **REBUILD iz 10 PDF predavanja** (2026-06-12): K1=Units 1–6 (5 kat, +nova `forecasting`), K2=Units 7–12 (5 kat) + `examPractice`. Ispravljena činjenica (price = najkritičnija). ✅ LIVE (`ca06158`) |
| ~~**Entrepreneurship** (`entrepreneurship`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`entrepreneurshipM1`/`entrepreneurshipM2`/`entrepreneurshipFinal`, `data/entrepreneurship/`); finalni **15 kat / 175 fc / 134 quiz / 80 fill** | ✅ Split (stari točan ali tanak) + **4 nove kat.** (creativity W3, financing W5, franchising W6, developing W13) + obogaćen iz 11 PDF-ova (2026-06-13). K1=Weeks 2–7, K2=Weeks 9–13. **LIVE 2026-06-13 (`8a37404`)** |
| ~~**Accounting** (`accounting`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`accountingM1`/`accountingM2`/`accountingFinal`) + **41 interaktivna vježba** (`data/accounting/exercises.js`) | ✅ Restrukturirano + Exercises sustav (2026-06-12, LIVE `a6b6fb0`). Opcionalno: Final exercises-tab, USAR/USALI klasifikacija (treba answer-key) |
| ~~**E-Business** (`ebusiness`)~~ ✅ **GOTOVO** | 1 | **3 lekcije** (`ebusinessM1`/`ebusinessM2`/`ebusinessFinal`, `data/ebusiness/`); finalni **15 kat / 152 fc / 124 quiz / 75 fill** | ✅ Split (stari sadržaj VJERAN predavanjima — iznimka od te2-pouke) + obogaćen iz 14 PDF-ova (+23 fc; SEO 3→4 fix). K1=Units 1–7, K2=Units 8–15. **LIVE 2026-06-13 (`51e4e7b`)** |

**⚠️ Pouka iz te2 (2026-06-12):** puki **SPLIT postojećeg** tankog sadržaja daje premalo (te2 split = 72 fc → korisnik
javio da je premalo i staro). Zato je te2 **rebuildan IZ PROFESORSKIH PREDAVANJA** (10 PDF-ova → 135 fc, + ispravljena
činjenična greška u starom sadržaju). **Za Entrepreneurship/E-Business isto: raditi iz materijala, ne preslagivati stari
tanki blok.** Stoga **OBA trebaju izvorne PDF-ove/silabus od korisnika** (folderi su trenutno prazni) prije početka.

## 🧭 Strateški smjerovi (korisnik, 2026-06-24) — veće mogućnosti, timing TBD
- 🔥 **Priprema za MATURU** — novi proizvodni smjer: srednjoškolci, priprema za maturu (širenje izvan fakulteta). Dolazi nakon admin CRUD + AI tutor.
- 🔥 **Novi program „Menadžment u ugostiteljstvu" (HRV)** — vrlo vjerojatno **prijevod cijelog Hospitality Managementa na hrvatski**. Catalog već podržava više programa (ADR-002/003) → novi `program` + prevedeni `data/*`. **Aktivira potrebu za i18n (HR/EN).**
- ➖ **3. godina HM** — doći će, timing neodlučen.
- ➖ **Studentski UGC za 3./4. godinu** — studenti uploadaju sadržaj i grade više godine (HM i/ili Menadžment u ugostiteljstvu); jezik (HR/EN) neodlučen. Veže se na Fazu 1–2 (upload→AI→pregled→dijeljenje) + moderacija/autorska prava ([VISION.md](../product/VISION.md) §4 gating-odluke).
- ~~**Prioritet nakon sadržaja (korisnik):** (1) Admin CRUD → (2) AI tutor → (3) Matura prep.~~ **⚠️ NADGLAŠENO 2026-08-02 (Leon).** Admin CRUD = ✅ gotov; **matura IZBAČENA iz build-plana** (ostaje samo kao tržišna hipoteza u [MONETIZATION.md](../product/MONETIZATION.md), ne kao posao). Aktualni redoslijed: **osobni UGC-graditelj ([CREATE_BACKEND_SPEC.md](../archive/CREATE_BACKEND_SPEC.md) F0–F5) → frontend redizajn → objava/dijeljenje + MCP.** [[follow-recorded-plan-dont-reopen]]

## 🔁 MATURA SE VRAĆA — kao IDEJA, ne kao plan (Leon, 2026-08-22)

Gornji precrtani redak (**„matura IZBAČENA iz build-plana", 2026-08-02**) i dalje točno opisuje
**plan**: matura nije cigla i ne ulazi u red čekanja. Ali premisa iz tog reza — *„širenje izvan
fakulteta ide kroz UGC, srednjoškolac gradi vlastiti materijal kao i svi ostali"* — **ne pokriva
ono što je Leon sad rekao:**

> *„pripreme za maturu će se poviše bazirati na **exercises**"*

I to je bitna razlika, jer **vježbu srednjoškolac ne može autorirati.** Kartice, kviz i dopunu
može (to je podatak). Vježba je danas **kôd** — `generate()` funkcija u `data/<subj>/exercises.js`,
koju BUG-012 drži izvan baze i JSON-a, a ADR-018 zabranjuje da korisnik uploada kôd. Dakle:

**➡️ Matura ne prolazi kroz UGC. Matura prolazi kroz RECEPTE.**

Time smjer „vježbe = imenovana, verzionirana knjižnica recepata" (v. `CLAUDE.md` §9.5 —
151 od 234 vježbi je već čisti podatak, `params` su deklarirani u svih 83, kôd je samo formula)
prestaje biti čišćenje duga i postaje **preduvjet**. Bez recepata matura znači ručno pisanje
stotina `generate()` funkcija u `.js`, po predmetu, zauvijek.

**Druga posljedica — točnost prestaje biti neugodnost i postaje odgovornost.**
[ADR-020](./DECISIONS.md) (dvo-ključni verifier) danas stoji kao *„gradi se u fazi sadržaja, ne
sad"*, a 18 predmeta je *„spot-checkano, NE iscrpno"*. Krivi ključ u fakultetskoj kartici je
neugodan. **Krivi ključ u pripremi za državnu maturu je šteta** — dijete uči za ispit koji mu
određuje upis, i vjeruje nam. Ako matura ikad krene, ADR-020 kreće **prije** nje, ne s njom.

**Kalendar (Leon, 2026-08-22):** vrhunac korištenja platforme nije rujan nego **pripreme za
maturu, otprilike 2.–5. mjesec**. To je jedini prirodni rok koji ovaj smjer ima.

**Status: parkirano.** Ne planirati, ne procjenjivati, ne otvarati prije nego frontend bude
gotov. Zabilježeno da se ne izgubi i da se zna **koji preduvjet nosi**.

## 🏨 Simulacija vođenja hotela — zaseban proizvod, razrađen drugdje (2026-08-22)

Poslovna igra za FMTU: student vodi virtualni hotel kroz sezonu (cijene po segmentu, RevPAR,
kadrovi, sezonalnost), cijela generacija igra istu sezonu i natječe se. Konkurencija su plaćene
strane licence (HOTS, Cesim, Shadow Manager).

**Puni zapis: [`docs/ideas/HOTEL_SIM.md`](../ideas/HOTEL_SIM.md)** — ovdje namjerno stoji samo
pokazivač, jer **nije Sokratova značajka nego drugi proizvod** (posuđuje primitive: seed-
determinizam iz enginea vježbi, auth/RLS, sync napretka, i18n). Ne gradi se dok frontend nije
gotov; služi kao materijal za prijedlog dekanu i kandidat za diplomski.

## Monetizacija (Faza 4 — tek na skali)
- 🔥 Freemium pretplata (~2–3 €/mj): neograničeni kvizovi, exam mode, bez reklama, analitika.
- 🔥 AI tutor kao premium ("objasni mi / ispitaj me") — koristi isti Claude pipeline.
- ➖ Lokalno sponzorstvo (kafići, student housing) — bolji prinos od ads na maloj skali.
- ➖ Affiliate (udžbenici, online tečajevi).
- 💤 White-label za druge fakultete/udruge (najveći dugoročni potencijal).
- 💤 Donacije / "Buy me a coffee".
- ⚠️ Naplaćivati FUNKCIONALNOST, ne sadržaj (autorska prava na profesorske materijale).

## Funkcionalnosti — učenje
- ➖ Spaced repetition za flashcards (pamti što ne znaš, vraća češće).
- ➖ "Exam mode" — vremenski ograničen, miješane kategorije, ocjena na kraju.
- ➖ Izvoz skripte u PDF.
- 💤 Audio/TTS čitanje gradiva.

## UGC & društveno (Faza 1–3)
- 🔥 Upload PDF/PPT → AI generira privatnu skriptu (Faza 1).
- 🔥 "Donesi svoj API ključ" za AI generaciju (kontrola troška).
- ➖ Javna biblioteka + pretraga + fork tuđih skripti (Faza 2).
- ➖ Ljestvice po kvizu + profili + statistika učenja (Faza 3).
- ➖ Anti-cheat za natjecanje.
- ➖ Moderacija/prijava UGC sadržaja.

## Tehničko / infra
- ✅ **Automatski testovi — uglavnom GOTOVO:** Playwright (responsive/smoke/…), `npm run test:unit` (graderi vježbi), `npm run validate:content` (shema sadržaja). Ostaje 💤 širi coverage po želji.
- ✅ **Analitika posjeta — GOTOVO (2026-06-13):** Google Analytics GA4 (`G-ME0V58NJ1Z`) uz GDPR cookie-consent
  (Consent Mode v2, učita se tek na pristanak); vidi `js/consent.js`. Time je i **priprema za Google Ads** korak dalje.
- 💤 i18n (hrvatski/engleski prebacivanje).
