# RASPORED — sve što čeka, razrezano na faze kroz sesije

**Status:** 🟩 AKTIVAN · **Otvoren:** 2026-09-04 (Leon: *„napravi strukturiran plan koji će ići
fazama kroz sesije da ga imamo da riješimo ovu listu kako treba"*)

> **Što ovaj dokument JEST:** **redoslijed i izlazni uvjet.** Odgovara na dva pitanja — *što sada*
> i *kad je faza gotova*.
>
> **Što NIJE:** nije drugi dom za mjerenja, nalaze i obrazloženja. Ta žive u
> [BACKLOG.md](../records/BACKLOG.md) i u zaglavljima skripti (ADR-027: jedna činjenica = jedno
> mjesto). Ovdje su **pointeri**, ne kopije — brojka prepisana ovamo ostarila bi istog dana.
>
> **Zamjenjuje:** `RACUN.md` kao tekući spec. R1 je isporučen i na produkciji; **R2 i R3 nastavljaju
> ovdje kao Faza 2** — spec je otišao u referencu i ondje objašnjava ZAŠTO je R1 izveden odjednom.

---

## 1 · Kako se ovaj raspored vozi

Pravila su Leonova i ne mijenjaju se između faza:

| pravilo | što znači u praksi |
|---|---|
| **Jedna cigla = jedan commit** | Zahvat koji dira zajednički šav se **reže**, ne dovršava u komadu. Signal: ako popravak traži više od par datoteka koje nisu predmet cigle — to više nije jedna cigla, nego serija. |
| **Zastanak na kraju faze** | Unutar faze teče cigla za ciglom (gate na svakoj). Na kraju faze **stani i javi se.** |
| **Deploy = uvijek zaseban izričit OK** | Nijedno ranije odobrenje se ne proteže na sljedeći put. |
| **Uz svako „popravljeno" reci GDJE se vidi** | produkcija / preview / samo lokalno. Bez toga Leon testira stari kod. |
| **Mjeri prije nego popravljaš** | Protučinjenični pokus, pa hipoteza. Alat bez kontrole nije mjera. |
| **Dok Playwright vrti — ne diraj datoteke** | Suita traje ~33 min i čita s diska; izmjena usred vrtnje čini rezultat bezvrijednim. |

**Redoslijed faza nije proizvoljan.** Prve dvije su ono što Leon osjeti na svom uređaju; treća
otvara stranicu drugoj polovici publike; četvrta plaća dug koji koči svaku sljedeću vizualnu ciglu;
peta, šesta i sedma su rast proizvoda. Faza se smije preskočiti Leonovom riječju — ali onda se
preskače svjesno, a ne zaboravom.

---

## 2 · Faze — pregled

| # | faza | zašto baš tu | gotovo kad korisnik… |
|---|---|---|---|
| **F1** | **UREĐAJ** — izgled i glatkoća | Leon to vidi na svom telefonu svaki dan; sve je ili izmjereno ili traži jedno mjerenje | …otvori stranicu na telefonu i zatekne **isto što i u mailu** — crno na tamnom uređaju, svijetlo na svijetlom — bez bljeska, bez trzanja pri skrolanju i bez gumba koji svijetle sami od sebe |
| **F2** | **RAČUN** — profil i obavijesti | nastavak tekućeg bloka; profil je ujedno i najveći komad CSS-duga, pa ide u istom prolazu | …se prijavi s bilo kojeg uređaja i zatekne svoju temu, svoju sliku i svoje ime — i primi mail samo ako je na njega pristao |
| **F3** | **DVOJEZIČNOST** — 421 → 0 | Leonova presuda (ADR-033); četiri stranice nemaju ni mehanizam, a to je pola posla | …prebaci jezik i **nigdje** ne naiđe na engleski ostatak, uključujući pravne stranice i editor |
| **F4** | **ČIŠĆENJE** — CSS dug do nule | ne blokira ništa vidljivo, ali svaka sljedeća vizualna cigla plaća kamatu na njega | …ne primijeti ništa — ovo je faza u kojoj se ne smije promijeniti nijedan piksel |
| **F5** | **VJEŽBE** — recepti pa izgled | jedina velika površina bez ijednog vizualnog gatea; recepti su preduvjet za sve što dolazi poslije | …rješava vježbu koja izgleda kao ostatak platforme, i (nevidljivo za njega) vježba je postala podatak kao i sve drugo |
| **F6** | **MCP** — cjevovod stvaranja | glavni put nastanka gradiva (ADR-030/031); konektor traži OAuth, koji F2 dovršava | …svom AI-ju da materijal kroz chat i dobije nacrt lekcije, kartica i kviza — a da mi tu datoteku nikad ne vidimo |
| **F7** | **OBJAVA** — dijeljenje i povijest | dijeljenje daje smisao povijesti učenja i grafikonima napretka, pa idu zajedno | …podijeli svoj materijal linkom i vidi kad je zadnji put što učio |

---

## 3 · Faze u detalje

### F1 · UREĐAJ

> ### 🔄 FAZA JE PRERASLA SVOJ OPIS (2026-09-04)
> F1/1 je poravnala **svijetlu** temu s mailom — i to stoji. Ali mail ima **dvije palete i mijenja
> se s uređajem**, a ja sam izmjerio samo jednu granu medija-upita. Leonov telefon je u tamnom, pa
> je njemu mail oduvijek crn. **Njegova odluka: stranica prati uređaj, točno kao predložak.**
> Time F1 dobiva tri nove cigle, a stara F1/2 postaje njihova posljedica, ne susjed.
> Mjere, heksovi i zamke: [BACKLOG.md](../records/BACKLOG.md) §CRNA TEMA.

**Redoslijed prvenstva teme — zapisan JEDNOM, jer se inače svaki put izvodi iznova:**

> **račun (F2/1)  >  lokalni izbor u profilu  >  uređaj (`prefers-color-scheme`)  >  `academic`**

| cigla | posao | gotovo kad |
|---|---|---|
| **F1/1** ✅ | ~~**Svijetla tema = svijetla polovica maila.**~~ **Isporučeno 2026-09-04** — `brand-400 #6366f1` (plohe/hover/fokus) · `brand-500 #4f46e5` (tekst i gumbi) · `brand-600 #4338ca` + swatch; `og-cover.png` pregrađen. | …stranica i mail izgledaju kao ista marka; `check:contrast` 292/292 i `check:contrast:live` **0 ispod praga** |
| **F1/2** ✅ | ~~**Crna tema = tamna polovica maila.**~~ **Isporučeno 2026-09-04** — tema `carbon` („Ugljen"), doslovni heksovi predloška, indigo obrnut (500 `#818cf8`, on-brand taman). Živa brana je usput razotkrila da se `brand-600` na ~8 mjesta koristi kao ispuna **u mirovanju** (protiv ugovora tokena) — carbonov 600 zato `#7075f4`, a CSS-zloporaba ide u **F4**. [BACKLOG.md](../records/BACKLOG.md) §CRNA TEMA. | …korisnik ju odabere u profilu i cijela stranica izgleda kao njegov mail; `check:contrast` 358/358, `check:contrast:live` **0 ispod praga** na 4 teme |
| **F1/3** ✅ | ~~**Prvi kadar prati uređaj.**~~ **Isporučeno 2026-09-05** — `boot.js` bez spremljenog izbora čita `prefers-color-scheme` prije prvog crtanja (tamno → `carbon`, svijetlo → `academic`); birač dobio **„Automatski · ‹što uređaj bira›"** kao prvu opciju, aktivan je IZBOR a ne primijenjena tema; `theme.js` prati promjenu uređaja uživo dok je izbor automatski. ⚠️ **Nalaz izvan speca:** produkcija je na SVAKOM učitavanju upisivala `academic` u `sokrat-theme`, pa bez migracije crno ne bi dobio **nitko** tko je stranicu već otvorio — izbor od sada nosi biljeg `sokrat-theme-chosen`; `academic` bez biljega = nije izbor, `chalk`/`mint` bez biljega = jest. Dokaz: `tests/unit/theme-device.test.js` (28 tvrdnji u `vm` sandboxu) · `theme-fouc.spec.js` +4 (emulirani uređaj, stari zapis, izbor pobjeđuje) · `fouc-probe` scenarij `uredjaj-tamni` = **0 ms bljeska** u oba profila. | …Leon otvori stranicu na svom telefonu i **odmah** vidi crno, bez ijednog klika i bez bljeska — ⚠️ ako na tom telefonu nije ranije **birao** Ploču/Mentu (izbor pobjeđuje uređaj; „Automatski" u profilu ga vraća) |
| **F1/4** ✅ | ~~**Zatvori rupu u brani.**~~ **Isporučeno 2026-09-06:** popis tema ima JEDNO mjesto — `scripts/teme.js` čita `:root[data-theme="…"]` blokove iz `tokens.css` (komentari se skidaju; **nula tema = greška, ne prazan niz** — brana koja prođe nula tema i šuti je točno kvar koji se zatvara), a kroz njega idu SVA četiri čitatelja: `check-contrast-live.js` (bio zakucan), `tests/helpers/axe-gate.js` (bio zakucan s mrtvim `paper`, bez `carbon`), `check-contrast.js` i `theme-boot-order.test.js` (imali vlastiti regex). `boot.js` zadržava svoj niz (vrti se prije CSS-a) i test ga čuva protiv modula. Brana `tests/unit/theme-list.test.js` (24 tvrdnje; obrnuto kroz `git worktree` na starom stablu = **9 crvenih**). **Dokaz:** prijavljena a11y-suita **prvi put skenira `carbon`** na 7 ploha — 0 nalaza; `check:contrast:live` 13 ruta × 4 teme *iz tokena*, 0 ispod praga; preflight EXIT 0. Plan je bio: `scripts/check-contrast-live.js:39` ima **zakucan popis tema** — nova tema bez toga prolazi neizmjerena, a brana ostaje zelena. Popis mora doći iz `tokens.css`, kao što ga staticka brana već čita. ⚠️ **Isti razred, nađen u F1/11:** `tests/helpers/axe-gate.js` `TEME` je isto zakucan — nosi `paper` (maknut 2026-09-01) i **nema `carbon`**, pa a11y-suita carbon ne skenira, a `paper` skenira kao zadanu. | …živa brana mjeri svaku temu koja postoji, a ne onu koju je netko upisao rukom |
| **F1/5** ✅ | ~~**Četiri stranice bez teme**~~ **Isporučeno 2026-09-06:** `contact` · `faq` · `privacy` · `terms` dobili `<html data-theme="academic">` + **sinkroni `boot.js`** na vrhu `<body>` (isti mehanizam kao `index.html`, nijedna nova kopija — `tokens.static.css` je sve teme već nosio, `legal.css` je od MREŽE bez ijednog heksa). Brane: `theme-boot-order.test.js` sad traži boot na SVAKOJ stranici, ne samo onima s biračem (obrnuto kroz `git worktree`: 8 crvenih na starom stablu) · `tests/legal.spec.js` +2 mjere ISCRTANO — `prefers-color-scheme: dark` → `carbon`, `light` → `academic`, `color-scheme` na `<html>`, pozadina `<body>` == `--color-surface-0` teme (ne kopija heksa) · `check:contrast:live` dobio 4 pravne rute (4 × 4 teme, 0 ispod praga). Preflight EXIT 0, bump. **Svjesno NE:** `viewport-fit=cover` (legal.css i dalje bez safe-area; sprega u `touch-zoom.test.js` stoji) · **prijevod F3/1 nije uzet** — to je F3, Leonova riječ. **Leon isti dan, gleda produkciju:** *„frontend nije prilagođen, teme ne odgovaraju, taj dio je uvijek bijela tema"* — točno ovo, i točno stanje `c53c28c` (F1/5 je na grani). Plan je bio: `contact` · `faq` · `privacy` · `terms` nemaju ni `data-theme` ni `boot.js`. ⚠️ **Od F1/3 ovo prestaje biti sitnica:** čim stranica prati uređaj, korisnik na tamnom telefonu dobiva crn katalog i **bijela Pravila privatnosti**. Isplati se uzeti i njihov prijevod (F3/1) u istom obilasku. | …korisnik na tamnom uređaju otvori Pravila privatnosti i ne zaboli ga oko |
| **F1/6** ✅ | ~~**Sonda za trzanje pri skrolanju.**~~ **Isporučeno 2026-09-05** — `scripts/jank-probe.js` (mjerni instrument izvan preflighta, kao `fouc-probe`): mobilni profil 393×852 @3x, CPU 4×, **prst** (ručni niz touch-događaja — sintetička CDP gesta u headlessu ne miče stranicu, izmjereno), 3+3 zamaha po ruti; mjeri kadrove kroz rAF, LoAF, `Paint` + prebojanu površinu i `DroppedFrame` iz tracea, layout/recalc/skriptu s glavne niti, i **ispisuje doseg** (ruta × scenarija, gesti, kadrova). **Nalaz (10 ruta, 5 363 kadra):** glavna nit je čista svugdje (median 16,7 ms, najviše 3 kadra od ~540 na 33 ms, 0 layouta tijekom skrola); **jedina ruta koja preboji je landing** — 240 paintova, **533 Mpx** (≈ 70 % ekrana SVAKI kadar), 28–54 ispuštena kadra, dok svih devet ostalih ima **0 paintova i 0 ispuštenih**. **Protučinjenično na landingu** (6 scenarija): bez zamućenja / bez sjena / bez prijelaza = **isto** (240 paintova); **bez `background-attachment: fixed` = 0 paintova, 0 ispuštenih** — jedini izmjereni uzrok. ⚠️ **Instrument je Chromium**: iOS Safari `background-attachment: fixed` ionako crta kao `scroll`, pa je ovo dokaz troška na Androidu i stolnom Chromeu, a Leonov iPhone može trzati iz razloga koji ovaj alat ne vidi (ondje najsumnjivije: `backdrop-filter` na ljepljivoj traci) — zato F1/7 nosi A/B na pravom telefonu. Brojke: [BACKLOG.md](../records/BACKLOG.md) §LEONOVI NALAZI B. | …postoji brojka koja kaže gdje se gube kadrovi — bez nje se ne dira ništa |
| **F1/7** ✅ | ~~**Popravak po nalazu sonde.**~~ **Isporučeno 2026-09-05** u dva commita. **① landing** (`9139d6f`): `background-attachment: fixed, fixed, …` → **`scroll`** u `css/landing.css` — odsjaj putuje s herojem; iOS Safari je `fixed` ionako crtao kao `scroll`, pa iPhone ne mijenja izgled. **Mjera istog dana** (`jank-probe`, landing, kontrola): PRIJE paint **240 / 532,7 Mpx**, ispušteno **94**; POSLIJE paint **0 / 0**, ispušteno **0**. Brana `tests/unit/no-fixed-background.test.js` (bundle + izvor bez komentara; landing zadržava zrno i odsjaj — popravak je `scroll`, ne brisanje; obrnuto: 2 crvene). **② prekidač `?bez=`** za iPhone: `css/bez.css` (novi modul, zadnji u manifestu; `!important` NAMJERAN i imenovan za F4/3) + `js/boot.js` čita `?bez=zamucenja,sjena,prijelaza,pozadine` i PRIJE prvog crtanja upiše `data-bez` na `<html>` (sanirano na `[a-z-]`, nadživi `replaceState`); **sonda više ne nosi vlastitu kopiju zabrana** — popis scenarija čita iz `bez.css` i postavlja isti atribut (ADR-027; `bez-fiksne-pozadine` otpao s ①). Dokazi: `bez-switch.test.js` (26 tvrdnji, obrnuto na HEAD-u 5 crvenih; komentar modula s primjerom `ime` bio je pokupljen kao scenarij → skidanje komentara u testu I sondi) · živa sonda u Chromiumu: zamućenje 5 → 0, sjene 27 → 0, prijelazi 187 → 0, pozadina → `none`, kontrola netaknuta, nepoznato ime inertno · `jank-probe --rute=landing` 5/5 scenarija kroz atribut, paint 0/0 u svima · preflight EXIT 0. ⚠️ **Otvoreno = Leonov A/B na iPhoneu** (preview): `?bez=zamucenja` · `?bez=sjena` · `?bez=prijelaza` · `?bez=pozadine`, pa kombinacija — koji je gladak, taj postaje popravak. Hipoteza je bila, napisana TEK iz F1/6: ① **landing** — dva sloja s `background-attachment: fixed` (zrno + odsjaj) prebojavaju ekran svaki kadar → ili `scroll` (odsjaj putuje s herojem, gdje mu i jest mjesto) ili isti sloj kao `position: fixed` pseudo-element iza sadržaja (kompozitor ga nosi bez paintova); dokaz = `jank-probe` vraća **0 paintova** na landingu. ② **iPhone** — instrument ga ne vidi, pa preview dobiva prekidač `?bez=zamucenja|sjena|prijelaza` (iste `!important` zabrane koje sonda ubrizgava) i Leon na svom telefonu kaže koji je scenarij gladak; tek iz toga popravak. Nijedan „na oko". | …Leon skrola po svom telefonu i kaže da je glatko (on presuđuje, ne brojka) |
| **F1/8** ✅ | ~~**Ljepljivi hover nakon prelaska.**~~ **Isporučeno 2026-09-05** — **② miš:** `pauzirajHover()` (`js/utils.js`) iz `navigateTo` I `browseNaRazinu` (browse-prelazi ne idu kroz `navigateTo` — plan je to previdio, sonda našla), prvi `pointermove` skida; prefiks `:where(:root:not([data-hover-paused]))` na **142/142** selektora u istom `hover-css.js` prolazu, `check:hover` ga traži (obrnuto 134 → 0); `hover-probe --profil=prelaz` **ljepljivo 2/2 → mirno 2/2 + naoružano 2/2**; miš `--usporedi` 0 razlika; css:diff 7 161 usporedbi 0 razlika; `hover-arm.test.js` 28 tvrdnji; BUG-044 zatvoren. **① dodir isporučen 2026-09-05:** `scripts/hover-css.js` u `build:css` (lightningcss **čita** stablo s precima, **tekst** bundlea se prepisuje po `loc` — vraćanje stabla u Rust puca i promijenilo bi svaki bajt) zamata **130 pravila / 142 selektora** u `@media (hover: hover)` na istom mjestu kaskade; liste cijepane (`:focus-visible` ostaje vani), `:hover` u `:not()/:is()` = pad builda; `legal/consent.css` ručno. Brana **`check:hover`** u preflightu (obrnuto: 130 golih na starom bundleu). `scripts/hover-probe.js`: WebKit dodir **ljepljivo 2/2 → mirno 2/2**, miš 38 elemenata **0 razlika** (20 i dalje mijenja izgled), css:diff 0 razlika (2 rute × 3 širine, 7 161 usporedbi). **Leon na iPhoneu (preview `92269c2`): *„Ne svijetli, odlično."*** Nalaz (Leon, 2026-09-05: *„gumb koji je stajao na mjestu starog gumba isto svijetli po rubovima a nije ga se diralo, to je jako naporno"* — *„imamo taj problem od početka"*). **Izmjereno 2026-09-05 na dva motora:** na mišu se reproducira 100 % u oba; na **dodiru ga reproducira WebKit** — motor SVAKOG preglednika na iPhoneu, pa pitanje „koji preglednik" otpada — a Chromium s dodirom ne. Nakon dodira koji mijenja rutu kartica pod točkom odmah nosi `:hover` (rub `brand-500`, −4 px, sjena) i ne prolazi ni nakon 3 s ni nakon idućeg dodira. Fokus nije uzrok: `activeElement` ostaje `BODY`, a 12 pravila golog `:focus` sva su na poljima za unos. **Protučinjenično potvrđeno:** pravilo pod `@media (hover: none)` vraća karticu u mirni izgled u WebKitu s dodirom (emulacija i pravi iOS javljaju `hover: none`), a na mišu ne mijenja ništa. Dodir šalje `mousemove`, ali **ne** `pointermove`; poslije prelaska bez pomaka nijedan motor ne šalje `pointermove` → siguran okidač za miš. CSS: **138 `:hover` pravila** (148 pojava) u 27 datoteka, **66 mijenja rub** (border/box-shadow/outline), 3 zaštićena. **Serija od DVIJE cigle** — treća („`:focus` → `:focus-visible`") otpada, nema što popraviti: ① **dodir** — svaki `:hover` selektor pod `@media (hover: hover)` kroz `build:css` (selektor-lista se **cijepa**: `:focus-visible` iz istog pravila ostaje vani); brana = statička provjera bundlea u preflightu + WebKit-sonda izvan njega · ② **miš** — hover se naoruža tek prvim `pointermove` poslije promjene rute (`data-hover-paused` na `<html>`, prefiks `:where(:root:not([data-hover-paused]))` = nula specifičnosti). Mjere i tablica: [BACKLOG.md](../records/BACKLOG.md) §LEONOVI NALAZI D. | …Leon pritisne gumb, dođe na drugu stranicu i **nijedan** gumb ondje ne svijetli dok ga ne dotakne |
| **F1/9** | **Kartice kao Tinder-špil na telefonu** (Leon, 2026-09-05: *„na mobitelu bi napravio za kartice kao tinder način otvaranja i gledanja"*). Danas: jedna kartica, klik okreće, četiri gumba, **nijedne dodirne geste** u modovima učenja. Zadano dok Leon ne kaže drugačije: dodir okreće · povlačenje desno = znam · lijevo = ne znam · iduće dvije kartice vire ispod · gumbi ostaju (pristupačnost) · stolno zadržava današnji prikaz i tipkovnicu · bez biblioteke (pointer-događaji + `transform`, `prefers-reduced-motion` gasi let). **Jedini put upisa ostaju `markKnown`/`markUnknown`** — gesta ih zove, ne duplicira. Pitanje §6/6. | …Leon na telefonu prolazi špil palcem bez ijednog gumba, a „znam / ne znam" je isto stanje koje vide statistika i cloud-sync |
| **F1/10** ✅ | ~~**Zoom na dodir.**~~ **Isporučeno 2026-09-05** (Leon: *„kada se više puta takne na jedno mjesto može se zoomat, to se mora riješit"*). Dva uzroka, oba u resetu `css/variables.css`: ① **polja ≥ 16 px na dodiru** kroz `@media (pointer: coarse)` — iOS pri fokusu manjeg polja sam zumira. ⚠️ **Zatečeno:** isto je već „štitilo" pravilo iza `@supports (-webkit-touch-callout: none)` s `!important`, a taj upit **ne zadovoljava nijedan motor naših brana** (`CSS.supports` false u Chromiumu i Playwrightovom WebKitu) — nemjerljivo godinu dana; `(pointer: coarse)` je istina u oba (izmjereno) i na iPhoneu, specifičnost 0,2,1 umjesto sile. ② **`touch-action: manipulation` na `*`** (+ `legal.css`) gasi dvostruki dodir, skrol i štipanje ostaju; `user-scalable=no` odbačen — **obrnuto istog dana navečer: ADR-034 → F1/11**. **Brane:** tvrdnja **⑨** `phone-gate`-a u obje suite (sva polja, i skrivena — modal prijave) — obrnuto: stari bundle **11 × 13 × 4 crveno → 0**; `tests/unit/touch-zoom.test.js` (bundle + `legal.css`; obrnuto 6/9 crveno). Sonda u oba motora: točno 11 polja → 16 px, 52 netaknuta. **Usput:** `phone.authed.spec.js` mjerio je telefon bez `hasTouch` (miš) — ⑨ ga razotkrila, popravljen, 12/12. Dvostruki dodir **nemjerljiv u headlessu** → Leon na iPhoneu: **potvrdio 2026-09-05 navečer** (*„više ne, sređeno je"*). Zapis: BUG-043 · [BACKLOG.md](../records/BACKLOG.md) §LEONOVI NALAZI F. | …Leon dodirne polje ili dvaput dodirne tekst i stranica **ostane iste veličine** |
| **F1/11** ✅ | ~~**Bez zuma uopće — stranica ostaje na mjestu.**~~ **Isporučeno 2026-09-05** (Leon ujutro: *„Ovo što mi se dešava je svugdje, nije samo na Safariju, kreni."*) — **meta** `minimum-scale=1.0, maximum-scale=1.0, user-scalable=no` na svih 6 stranica; pravne **bez** `viewport-fit=cover` (`legal.css` nema nijednog safe-area razmaka, cover bi u polegnutom položaju gurnuo tekst pod izrez — sprega meta ⇔ safe-area je tvrdnja u testu) · **reset** `touch-action: manipulation` → **`pan-x pan-y`** u `variables.css` + `legal.css` (skrol ostaje, dvostruki dodir i štipanje otpadaju; iOS-sloj je bio JEDAN redak, ne novi mehanizam — `manipulation` dopušta pinch-zoom, `pan-x pan-y` ne) · **a11y:** `ISKLJUCENO_ODLUKOM` u `tests/helpers/axe-gate.js` — jedno imenovano isključenje s razlogom ADR-034, ne deset redaka osnovice (ona ključa po površini i očekuje da nalaz NESTANE); pravilo se i dalje vrti i ispisuje kao `[a11y-odluka] ISKLJUČENO`. **Obrnuto:** bez isključenja landing pada na `meta-viewport` (moderate/AA); `touch-zoom.test.js` prepisan (35 tvrdnji) i vrćen kroz `git worktree` na starom stablu = **13 crvenih**; `a11y-gate.test.js` +5 (po id-u, ne po razini). Preflight EXIT 0, a11y-suita 7/7. **Leon na iPhoneu (isti dan, kasno navečer):** dodir u polje i dvostruki dodir *„više ne, sređeno je, good job"* ✅ — ali *„sa dva prsta"* i dalje zumira: `pan-x pan-y` Safari za štipanje NE drži (izmjereno na uređaju, jedino mjesto gdje se može). → **② JS-sloj `js/no-zoom.js`** na svih 6 stranica (`defer`; vlastita datoteka, jer pravne nemaju `boot.js` — F1/5 time NIJE preduvjet): `gesturestart` / `gesturechange` + `touchmove` sa `scale !== 1` → `preventDefault()` uz `passive: false`, veže se SAMO gdje `GestureEvent` postoji (Chrome/Android slušaju metu, nepasivan `touchmove` bi im usporio skrol). Brana: `touch-zoom.test.js` ③ — 6 stranica × tag + sandbox (bez `GestureEvent` nula slušača; s njim tri, svi `passive: false`; `scale 2` otkazan, `scale 1` i bez `scale` ne). **Presuda štipanja opet = iPhone.** Plan je bio (Leon, 2026-09-05 poslije deploya `c53c28c`: *„Stranica uopće ne bi trebala imati mogućnost da se nešto povećava ili smanjuje na njoj ikako. Treba ostati na mjestu."* → **ADR-034**, obrće odbijanje `user-scalable=no` iz F1/10). Plan: `maximum-scale=1, user-scalable=no` na svih **6** stranica (4 pravne danas nemaju ni `viewport-fit`) **+ iOS-sloj**, jer Safari od iOS-a 10 **ignorira** `user-scalable=no` za štipanje — kandidati `touch-action: pan-x pan-y` na korijenu i/ili `gesturestart` → `preventDefault()`; što drži, **zna samo iPhone** (headless ne izvodi štipanje, BUG-043). a11y-gate: axe `meta-viewport` je AA → **imenovana iznimka s razlogom ADR-034**, ne šutnja. Tvrdnja ⑨ ostaje (fokus-zoom meta na iOS-u ne gasi). Brana: statički test da svih 6 meta nosi oba atributa i da iOS-sloj postoji (obrnuto: danas crveno); dokaz = Leon na iPhoneu. | …Leon na iPhoneu štipa, dvaput takne i takne polje — stranica se ne poveća, ne smanji i ne pomakne |

**Zamke koje su već poznate:** `perf-probe` ovdje **ne pomaže** — on mjeri prvi kadar, a trzanje je
trošak po kadru. ⚠️ **`theme-color` meta je i dalje statična svijetla** (`#f7f9fc`, F4): na tamnom
telefonu je traka preglednika svijetla iznad crne stranice — jedino što F1/3 nije zacrnio. Popravak
bez druge kopije boje: `boot.js` nakon primjene teme pročita `--color-surface-0` iz izračunatog stila
(sinkrona skripta iza stylesheeta ga već ima) i upiše u `meta.content`. Indigo je u obje teme granični slučaj, i to **na suprotne strane** (na svijetlom
tekst traži tamniji, na crnom svjetliji) — brana to hvata samo ako tema uopće uđe u njezin popis,
zato F1/4 nije uredovanje nego dio posla.

**Što ova faza svjesno NE dira:** `chalk` i `mint` ostaju kakvi jesu, kao izričiti izbori.
Odluka da je **zadana svijetla** (2026-08-13, jer su *„dvije tamne palete zaredom pale na živom
ekranu"*) **ostaje na snazi** — crno dobiva onaj tko ga je uređajem već tražio, ne svaki posjetitelj.

**Izlaz iz faze:** Leon otvori stranicu na svom telefonu i potvrdi petero — crna je, nema bljeska, ništa ne svijetli poslije dodira, **ništa ne zumira** (ni štipanje ni dodir ni polje — ADR-034),
nema trzanja. To je jedini prihvatljiv dokaz; mjera na razvojnom stroju je donja granica.

---

### F2 · RAČUN

Nastavak bloka koji je R1 otvorio. **Profil i `css/profile.css` su ista površina**, pa cigla koja
prepisuje profil nosi i njegov CSS — inače se ista datoteka prepisuje dvaput.

| cigla | posao | gotovo kad |
|---|---|---|
| **F2/1** | **Tema prati račun.** `localStorage` ostaje **prvi kadar** (odluka mora pasti prije crtanja, `boot.js`), račun postaje izvor istine koji ga pri prijavi pregazi i pri promjeni upiše. **Odluka (Leon, 2026-09-06): odjava BRIŠE lokalni izbor** — neprijavljeni posjetitelj na tom uređaju vidi zadano (prati uređaj), *„tuđi izbor ne smije preživjeti odjavu"*; račun izbor čuva za iduću prijavu. ⚠️ **Birač (Leon, 2026-09-06, slika profila):** *„glupo je imati ovu Automatic · Carbon, uopće ne kužim koji je smisao toga"* — gumb „Automatski" nosi sufiks s onim što uređaj trenutno bira (`profile.js`, F1/3: *„inače je gumb obećanje bez sadržaja"*), pa na tamnom telefonu glasi „Automatic · Carbon" i izgleda kao peta tema / duplikat Carbona. Pitanje **§6/7**; birač se ovdje ionako prekraja. | …korisnik postavi temu na jednom uređaju i zatekne ju na drugom čim se prijavi |
| **F2/2** | **Profilna slika** — bucket po obrascu `node-images`: vlasnički prefiks + RLS. | …korisnik stavi svoju sliku i vidi ju odmah, a tuđi prefiks mu je nedostupan |
| **F2/3** | **Uređivanje profila + `css/profile.css`, `auth.css`, `pages.css`, `consent.css`, `legal.css`, `home-section.css`, `sidebar.css`** (bivši C6). | …korisnik promijeni ime i vidi svoj profil onako kako ga vide drugi |
| **F2/4** | **Mail-obavijesti** — Edge Function (ADR-016), pristanak iz upitnika, odjava jednim klikom iz maila, admin-forma. Prvi segment: FMTU. | …primi mail o novom predmetu SAMO ako je pristao, i odjavi se jednim klikom iz samog maila |

**Pitanje za F2/1 odgovoreno (Leon, 2026-09-06): vraća se na zadanu.** Neprijavljeni korisnik na tuđem
uređaju vidi temu uređaja, ne tuđu — odjava briše lokalni izbor, račun ga čuva za iduću prijavu.

**Ne popušta ni ovdje:** identitet isključivo iz JWT-a (`getUser()`) · `service_role` samo u Edge
Functions · RLS i `publish_document` nedirnuti · osobni graditelj ostaje zaseban otok.

**Izlaz iz faze:** cijeli krug računa radi na pravom uređaju — prijava, tema, slika, ime, mail.

---

### F3 · DVOJEZIČNOST

Brana `check:i18n` već postoji i broji po datoteci; **dokaz napretka je spuštanje osnovice**, nikad
procjena. Redoslijed ide po tome gdje je posao najgušći i najizoliraniji.

| cigla | posao | gotovo kad |
|---|---|---|
| **F3/1** | **Četiri pravne stranice** — nemaju ni mehanizam: prvo `js/i18n.js` + `data-i18n`, pa prijevod. Najveći pojedinačni komad. ~~⚠️ Iste stranice dobivaju temu u F1/2 — ako F1 još nije zatvoren, spojiti u jedan obilazak.~~ Tema isporučena F1/5 (2026-09-06). ⚠️ **Dopuna (Leon, 2026-09-06: *„Zapiši: trebamo promijeniti FAQ, about us srediti malo, i srediti da je glavni kontakt sokrat@sokratstudy.com"* — uz *„samo zapiši, nemoj ništa raditi"*): SADRŽAJ PRIJE PRIJEVODA, u istom obilasku** — ① **glavni kontakt `sokrat@sokratstudy.com`** umjesto Gmaila (danas na **8 mjesta**: `contact` · `faq` ×3 · `privacy` ×2 · `terms` · `index.html` about · `README.md`; Porkbun prosljeđivanje na Gmail je uključeno — **isporuku provjeriti PRIJE zamjene**, mail koji nitko ne čita gori je od Gmaila) ② **FAQ — novi tekst** ③ **About us dotjerati** (`#/about` u `index.html`, ne pravna stranica). Redoslijed nije ukras: prijevod tek poslije novog teksta, inače se prevodi dvaput. | …korisnik na hrvatskom otvori Pravila privatnosti i pročita ih na hrvatskom |
| **F3/2** | **Zakucan tekst u datotekama s mehanizmom** — `index.html`, pa redom po težini. | …korisnik prebaci jezik na naslovnici i ne vidi engleski ostatak |
| **F3/3** | **Editor dvojezično (K5)** — ključevi koje kod zove, a rječnik ih nema: `at()` tiho vraća engleski i ništa ne pukne. Smjer je **upisati ih u rječnik**, ne brisati pozive. | …autor uređuje gradivo na hrvatskom sučelju |

**Tvrdo pravilo koje ne pada:** mijenjanje jezika **sučelja** NIKAD ne dira **predmete** — jezik
gradiva je svojstvo programa (ADR-012).

**Izlaz iz faze:** `scripts/i18n-baseline.json` je prazan i brana traži nulu — isti obrazac kojim
je zatvorena faza TELEFON.

---

### F4 · ČIŠĆENJE

Faza u kojoj se **ne smije promijeniti nijedan piksel**. Zato ima najstrožu obrnutu provjeru:
`css:diff` i `blocks:diff` moraju pokazati nulu razlika, a ne „izgleda isto".

| cigla | posao | gotovo kad |
|---|---|---|
| **F4/1** | **Gradivo i vježbe** (bivši C5b) — `learn.css` · `learn-blocks.css` · `math.css` · `exercises.css` · `blind-map.css`. ⚠️ `learn.css` je sagrađen na `#learn`, pa utility ne prolazi dok ID stoji. | …student čita gradivo i rješava vježbe, a KaTeX, slike i tablice su nedirnuti |
| **F4/2** | **Studio na telefonu** (bivši C3, jedini razlog zašto ta cigla nije zatvorena). | …autor uredi lekciju na 320 px bez elementa koji strši ili je prekriven |
| **F4/3** | **Gašenje** (bivši C7) — `responsive/*`, `components.css`, `variables.css`, **`styles.bundle.css` obrisan**, mrtva tema. Nosi i dva nalaza koja mijenjaju prikaz pa nisu smjela ranije: `.reset-btn` bez `font-size` i `.category-bar-info span` koji pogađa dva elementa. | …u repozitoriju nema starog CSS-a, mrtvog koda teme ni ijednog `!important` |
| **F4/4** | **Ekran 568 × 320 ulazi u branu.** Moguće TEK nakon F2/3 (consent banner) i F4/3 (donja traka) — dotad bi cigla platila tuđim crvenilom. Brojke su izmjerene, ne treba mjeriti iznova. | …`phone-gate` mjeri i najmanji polegnuti ekran, s praznom osnovicom |
| **F4/5** | **Crveni test koji nije naš** — `cascade.authed.spec.js` traži token koji je obrisala ranija cigla. Ili se test popravi, ili se token vrati. | …suita je zelena bez ijedne imenovane iznimke |

**Izlaz iz faze:** `npm run css:debt` pokazuje nulu, `styles.bundle.css` više ne postoji, a
`css:diff` kroz sve rute dokazuje da se ništa nije pomaknulo.

---

### F5 · VJEŽBE

Smjer je zaključan i ne otvara se iznova: *„vježbe su kôd"* je **oboreno mjerenjem** — dvije
trećine su čisti podatak, `params` su deklarirani u svih koje imaju funkciju, a kôd je samo
**formula**. Formula seli u imenovanu, verzioniranu **knjižnicu recepata**.

| cigla | posao | gotovo kad |
|---|---|---|
| **F5/1** | **Prebroji recepte.** Jedina brojka koja odlučuje o cijeni cijele faze još nije izmjerena: koliko različitih recepata pokriva sve postojeće generatore? Mjeri se **prije** obveze. | …postoji broj, pa se tek onda odlučuje ide li se dalje |
| **F5/2** | **Knjižnica recepata + migracija.** Migracija je **samoprovjerljiva**: stari generatori ostaju proročište — isti parametri moraju dati identičan izlaz. | …vježba je 100 % podatak → baza, JSON, `publish_document`, skidanje, MCP i editor je nose bez iznimke, a **BUG-012 se umirovljuje** |
| **F5/3** | **Frontend vježbi.** ⚠️ **Opseg čeka Leonovu odluku:** prolaz kroz tokene i razmake, ili prepravak interakcije (unos odgovora, provjera, koraci rješenja)? | …student rješava vježbu koja izgleda i ponaša se kao ostatak platforme |

**Granica koja se ne pomiče:** izgled se smije mijenjati, `generate()` / `answer()` / `type` **ne**.
**Odbačeno i ne vraća se:** evaluator izraza (pokriva manje, a traži vlastiti parser) i sandbox za
korisnički JS (ruši ADR-018 — prava cijena nije sandbox nego to da tuđi kôd odlučuje o ocjeni).

---

### F6 · MCP

Presuđeno je i **što** i **kojim oblikom** (ADR-030/031): MCP je **cjevovod**
`Learn → kartice → dopune/kviz`, ne skup CRUD-alata. Danas postoji samo read-only pokus izvan
repozitorija.

| cigla | posao | gotovo kad |
|---|---|---|
| **F6/1** | **Konektor + OAuth** nad našim MCP poslužiteljem. Preduvjet je F2. | …korisnik jednom doda naš konektor kod svog AI-ja; poslije je gumb u aplikaciji samo prečac |
| **F6/2** | **Cjevovod** — AI prepozna lekcije i sekcije, napiše skriptu, iz nje kartice (pojam → objašnjenje, boja po lekciji), pa dopune i kviz, uz **pokrivenost, ne uzorak**. | …korisnik preda materijal kroz chat i dobije nacrt cijele lekcije |
| **F6/3** | **Četiri tvrde brane u write-putu:** duljina kartice · svaka kartica daje bar jedno pitanje · svaka lekcija dobiva boju · dopuna ima jednoznačan odgovor. | …loš nacrt ne može ući, a kontrola kvalitete živi u write-putu, ne na ekranu |

**Invarijante:** AI je **korisnikov** (mi ne plaćamo tokene → kvalitetu drže brane) · materijal
dolazi kroz chat, datoteku nikad ne vidimo · **sve ide u NACRT** · doseg je **samo vlastito
gradivo**, ni čitanje kataloga · nikad `is_admin()`, nikad `service_role` · **vježbe su izvan MCP-a**.

---

### F7 · OBJAVA

| cigla | posao | gotovo kad |
|---|---|---|
| **F7/1** | **Dijeljenje** — link s tajnim tokenom, **bez javne biblioteke** u prvoj fazi (presuđeno unaprijed). | …autor pošalje link i primatelj uči iz njegova materijala |
| **F7/2** | **Povijest učenja** — plitka izvedba, onako kako je Leon presudio: vrijednost joj raste s količinom materijala, pa je pravo vrijeme tek sada. | …vidi kad je zadnji put učio što |
| **F7/3** | **Kretanje kroz vrijeme na ekranu napretka** — grafikoni. Analitika o karticama se **ne** proširuje (Leonov sud). | …vidi kretanje kroz vrijeme, ne samo trenutni zbroj |

---

## 4 · Stalna traka — sitni dug

Ne čini fazu i ne čeka svoj red; puni praznine kad cigla završi ranije. Ništa odavde ne blokira
ništa, ali ništa ni ne nestaje samo od sebe.

- **Znak i fontovi nikad nisu izmjereni.** `assets/logo.svg` je 45 KB za znak od 32 px, a
  `check:budget` mjeri **samo skripte** — fontovi mu nikad nisu bili u vidnom polju. Nakon što je
  učitavanje po ruti spustilo skripte, oni su vjerojatno najveći preostali teret prvog kadra.
- **Zaštita prijave od nasilnog pogađanja** (rate-limiting na Supabase Authu).
- **Nježna uputa pri prijavi slabom lozinkom** — `data.weakPassword` se danas svjesno ignorira.
- **Sidebar predmeta** — `openSidebar()` nema nijednog pozivatelja. ⚠️ **Produktna odluka čeka
  Leona:** obrisati ili vratiti kao brzi izbornik.
- **Baza i Storage:** siročad u Storageu · staging poravnati sa `supabase/f1-nodes.sql` ·
  `set_updated_at` ima promjenjiv `search_path` (jedini nenamjeran sigurnosni WARN).
  ⚠️ `is_admin()` se **ne smije** revokeati `authenticated`-u — zovu ga RLS politike kao pozivatelja.
- **HR u Supabase** kad HR program bude potpun. Uz to: `management-hr` datoteke nemaju id-jeve →
  `add-item-ids.js` prije nego HR podrži item-ops.
- **Editorski polish** (neobavezno, `archive/EDITOR_PLAN.md` §12): resize + callout · boje sekcija ·
  paste tablice iz Excela · zadnji vizualni prolaz · upload · chart · povijest verzija i „Vrati" ·
  `final` kao kompozicija umjesto kopije · `schemaVersion` u runtimeu.

---

## 5 · Što svjesno NIJE u rasporedu

Zapisano da se ne otvara iznova, ne da se planira.

- **Matura** — Leon: *„neću otvarat maturu."* Blokator je nepotvrđeno pravno pitanje o objavi
  NCVVO materijala. **Vizija** (što bi bila i kad bi se otvorila): [VISION.md](../product/VISION.md) §8 (Leon, 2026-09-05: *„to je vizija"*).
- **Simulacija vođenja hotela** — zaseban proizvod ([ideas/HOTEL_SIM.md](../ideas/HOTEL_SIM.md)),
  posuđuje naše primitive ali nije Sokratova značajka.
- **Spaced repetition** — nije otkazan, samo više nije sljedeći.
- **SEO / prave adrese umjesto hash-ruta** — arhitektonska odluka, ne cigla. Nagrada je manja nego
  zvuči: dijeljenje ide tajnim linkom, pa korisničko gradivo po dizajnu nije javno pronalažljivo.
- **Monetizacija** — Faza 4, tek na skali. Naplaćuje se **funkcionalnost, ne sadržaj**.
- **HR content-staza sa suradnikom** — suradnja otkazana 2026-09-04. Gradivo ostaje; četiri
  kvantitativna HR predmeta su **bez vlasnika**, ne otkazana.
- **Seoba sa Supabasea** — otkazana; Pro se plaća do daljnjeg.

---

## 6 · Što čeka Leonovu riječ

Sedam pitanja koja mijenjaju izvedbu, a ne mogu se razumno pretpostaviti (jedno odgovoreno, šest otvorenih):

1. ~~**Neprijavljen korisnik na tuđem uređaju** — zadnja lokalna tema ili zadana?~~ **Odgovoreno 2026-09-06: zadana** — odjava briše lokalni izbor, *„tuđi izbor ne smije preživjeti odjavu"*. *(F2/1)*
2. **Sidebar predmeta** — obrisati ili vratiti kao brzi izbornik? *(sitni dug)*
3. **Opseg frontenda vježbi** — tokeni i razmaci, ili prepravak interakcije? *(F5/3)*
4. **Facebook prijava** — čeka Metine ključeve; kod se vraća jednom zastavicom. *(F2, ako se vraća)*
5. **Četiri kvantitativna HR predmeta** — radimo ih mi, ili padaju? *(izvan faza)*
6. **Tinder-špil kartica** — zamjenjuje današnji prikaz na telefonu, ili je prekidač uz njega? Nosi li smjer povlačenja značenje (desno = znam)? *(F1/9)* — ~~I za F1/8: koji preglednik na telefonu vidi ljepljivi hover~~ **otpalo 2026-09-05:** na iPhoneu svaki preglednik vrti WebKit, a WebKit s dodirom kvar reproducira (izmjereno, §F1/8).
7. **„Automatic · Carbon" u biraču tema** (Leon, 2026-09-06: *„glupo, ne kužim smisao"*) — gumb postoji jer je Leon tražio da stranica bez izbora prati uređaj *„kao mail"* (F1/3); sufiks „· Carbon" samo kaže što uređaj sad bira. Tri izlaza: **(a) natpis samo „Automatski"** (opis ispod već kaže da prati uređaj) · (b) gumb maknuti — ali tada se jednom napravljen izbor **ne može poništiti**, uređaj se više nikad ne prati · (c) zadržati sufiks, ali kao podnaslov, ne kao ime. Preporuka: **(a)**. *(F2/1)*

---

*Mjere, nalazi i obrazloženja: [BACKLOG.md](../records/BACKLOG.md) · odluke:
[DECISIONS.md](../records/DECISIONS.md) · što je isporučeno:
[CHANGELOG.md](../records/CHANGELOG.md) · zašto brana postoji: zaglavlje njezine skripte.*
