# Backlog — parkiralište ideja

> Ovdje skupljamo ideje da se ne izgube. Nije obaveza — kad ideja sazri, seli se u
> [ROADMAP.md](../plan/ROADMAP.md) kao milestone/korak. Prioritet: 🔥 visok · ➖ srednji · 💤 nekad.

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

## 🔥 Studio na telefonu — dva gumba su IZVAN ekrana i nedostupna — 2026-08-14
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

**Kad:** Leon, 2026-08-14: *„jbg tako je kako je, morat ćemo to popravit kroz vrijeme"* → **ne
blokira isporuku**. Ali kriterij prihvaćanja C3 #1 izričito imenuje editor na 320 px, pa
**C3 se ne smije proglasiti gotovim dok ovo stoji.**

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

## 🔥 Landing šalje 240 KB editorskog koda posjetitelju bez računa — 2026-08-14
**Izmjereno** (profil telefona 390 px, prazan cache, nekomprimirano, lokalni server):
dokument 66 KB · **skripte 821 KB kroz 45 zahtjeva** · stilovi 242 KB · **ukupno 1.173 KB**.
Od skripti je **241 KB (38 %)** editorsko/admin: `studio.js` (50) · `block-editor.js` (53) ·
`block-editor-media.js` (30) · `admin.js` (45) · `admin-editors.js` (35) · `draft-store.js` (18) ·
`node-images.js` (6) · `card-limits.js` (2). Još **119 KB** su modovi i vježbe, kojih na landingu
nema. Svih 38 je **sinkrono**, bez `defer`, u `index.html`.

**Zašto je ovo nalaz, a ne mišljenje:** projekt si je u ovom istom dokumentu (sekcija „Brutalan
bar", #1) zadao budžet **„JS ≤ ~200 KB"** i označio ga 🔥 *„Blokada, ne upozorenje."* Gate nikad
nije izgrađen, pa je stvarnost danas **4× iznad vlastitog praga**. To je **isti obrazac koji je
proizveo §7.9**: pravilo zapisano, mjerač ne postoji. ⚠️ FCP je uredan (**224 ms** toplo) — cijena
nije u prvom pikselu nego u **parsiranju na slabom telefonu i u 45 zahtjeva na mobilnoj mreži**.
*(Prvo mjerenje u istoj sesiji dalo je FCP 2984 ms; to je bio hladan start preglednika, ne stranica.
Zapisano jer je pouka: jedno mjerenje bez ponavljanja nije mjera.)*

**Kad:** uz **C3** — C3 ionako prepisuje površinu tih istih datoteka, pa je odvajanje s kritičnog
puta najjeftinije baš tada. Uz to **budžet kao gate**, da brojka nikad više ne poraste tiho.

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

## 🔥 RUČNO ČEKA LEONA (3 stavke) — pripremljeno 2026-08-10, ostala je samo RADNJA
Sve tri su **istražene, izmjerene i opremljene gateom**; ostao je klik/naredba koje Claude ne smije
izvesti. Nijedna ne ruši produkciju.

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
2. **Re-sync `macroeconomics`:** `node scripts/migrate-content.js macroeconomics`
   (traži `service_role` → klasifikator ga blokira Claudeu; jedna Leonova naredba).
   ✅ **Rizik je uklonjen prije radnje:** `npm run diff:db macroeconomics` pokazuje da se baza i datoteke
   razlikuju u **točno jednom znaku** u `macroeconomicsM1` i `macroeconomicsFinal` — index 207,
   `goodsMarket.flashcards[5].answer`, ćirilično `С` (U+0421) vs latinično `C` (U+0043), duljina ista
   (246). **Nema živih Studio-edita koje bi upsert pregazio** → re-sync je siguran. `macroeconomicsM2` je
   već identičan. Nakon naredbe: `npm run diff:db macroeconomics` mora biti zelen.
3. **Uključiti Leaked Password Protection** — Dashboard → Authentication → Settings → *Leaked password
   protection* (provjera lozinki protiv HaveIBeenPwned). Jedini je od 16 sigurnosnih advisora koji se
   rješava **jednim prekidačem**, a tiče se korisničkih računa. Traži Management API token / dashboard —
   `service_role` ne mijenja konfiguraciju projekta. Provjera nakon: advisori više ne smiju javljati
   `auth_leaked_password_protection`. **Advisori inače: 0 ERROR**, sve WARN (v. §Advisori dolje).

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

## ➖ Broj pitanja na landingu pokriva samo 17 od 22 predmeta — 2026-08-09
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
