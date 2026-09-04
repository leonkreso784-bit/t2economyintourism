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
| **F1** | **UREĐAJ** — izgled i glatkoća | Leon to vidi na svom telefonu svaki dan; sve je ili izmjereno ili traži jedno mjerenje | …otvori stranicu na telefonu i ne vidi ni bljesak tuđe teme ni trzanje pri skrolanju, a boja stranice je ista kao boja maila |
| **F2** | **RAČUN** — profil i obavijesti | nastavak tekućeg bloka; profil je ujedno i najveći komad CSS-duga, pa ide u istom prolazu | …se prijavi s bilo kojeg uređaja i zatekne svoju temu, svoju sliku i svoje ime — i primi mail samo ako je na njega pristao |
| **F3** | **DVOJEZIČNOST** — 421 → 0 | Leonova presuda (ADR-033); četiri stranice nemaju ni mehanizam, a to je pola posla | …prebaci jezik i **nigdje** ne naiđe na engleski ostatak, uključujući pravne stranice i editor |
| **F4** | **ČIŠĆENJE** — CSS dug do nule | ne blokira ništa vidljivo, ali svaka sljedeća vizualna cigla plaća kamatu na njega | …ne primijeti ništa — ovo je faza u kojoj se ne smije promijeniti nijedan piksel |
| **F5** | **VJEŽBE** — recepti pa izgled | jedina velika površina bez ijednog vizualnog gatea; recepti su preduvjet za sve što dolazi poslije | …rješava vježbu koja izgleda kao ostatak platforme, i (nevidljivo za njega) vježba je postala podatak kao i sve drugo |
| **F6** | **MCP** — cjevovod stvaranja | glavni put nastanka gradiva (ADR-030/031); konektor traži OAuth, koji F2 dovršava | …svom AI-ju da materijal kroz chat i dobije nacrt lekcije, kartica i kviza — a da mi tu datoteku nikad ne vidimo |
| **F7** | **OBJAVA** — dijeljenje i povijest | dijeljenje daje smisao povijesti učenja i grafikonima napretka, pa idu zajedno | …podijeli svoj materijal linkom i vidi kad je zadnji put što učio |

---

## 3 · Faze u detalje

### F1 · UREĐAJ

Najkraća faza. Tri cigle su izmjerene i čekaju izvedbu, jedna traži da se prvo napravi mjerilo.

| cigla | posao | gotovo kad |
|---|---|---|
| **F1/1** ✅ | ~~**Tema stranice = izgled maila.**~~ **Isporučeno 2026-09-04** — `brand-400 #6366f1` (plohe/hover/fokus) · `brand-500 #4f46e5` (tekst i gumbi) · `brand-600 #4338ca` + swatch; `og-cover.png` pregrađen. Brojke i **nalaz o hoveru koji je cigla usput našla**: [BACKLOG.md](../records/BACKLOG.md). | …stranica i mail izgledaju kao ista marka; `check:contrast` 292/292 i `check:contrast:live` **0 ispod praga** |
| **F1/2** | **Četiri stranice bez teme** — `contact` · `faq` · `privacy` · `terms` nemaju `data-theme` ni `boot.js`. | …korisnik na tamnoj temi otvori Pravila privatnosti i dobije tamnu stranicu |
| **F1/3** | **Sonda za trzanje pri skrolanju.** Isporuka je **mjera, ne popravak**: kadrovi kroz skriptirani skrol, duge zadaće, koliko je piksela prebojano. | …postoji brojka koja kaže gdje se gube kadrovi — bez nje se ne dira ništa |
| **F1/4** | **Popravak po nalazu sonde.** Hipoteza se piše TEK nakon F1/3. | …Leon skrola po svom telefonu i kaže da je glatko (on presuđuje, ne brojka) |

**Zamke koje su već poznate:** `perf-probe` ovdje **ne pomaže** — on mjeri prvi kadar, a trzanje je
trošak po kadru. Kontrast indiga je granični slučaj i brana će ga uhvatiti ako se pobrka ploha s
tekstom. Mjere i heksovi: [BACKLOG.md](../records/BACKLOG.md) §U TIJEKU i §LEONOVI NALAZI.

**Izlaz iz faze:** Leon otvori stranicu na svom telefonu i potvrdi oboje — nema bljeska, nema
trzanja. To je jedini prihvatljiv dokaz; mjera na razvojnom stroju je donja granica, ne stvarnost.

---

### F2 · RAČUN

Nastavak bloka koji je R1 otvorio. **Profil i `css/profile.css` su ista površina**, pa cigla koja
prepisuje profil nosi i njegov CSS — inače se ista datoteka prepisuje dvaput.

| cigla | posao | gotovo kad |
|---|---|---|
| **F2/1** | **Tema prati račun.** `localStorage` ostaje **prvi kadar** (odluka mora pasti prije crtanja, `boot.js`), račun postaje izvor istine koji ga pri prijavi pregazi i pri promjeni upiše. | …korisnik postavi temu na jednom uređaju i zatekne ju na drugom čim se prijavi |
| **F2/2** | **Profilna slika** — bucket po obrascu `node-images`: vlasnički prefiks + RLS. | …korisnik stavi svoju sliku i vidi ju odmah, a tuđi prefiks mu je nedostupan |
| **F2/3** | **Uređivanje profila + `css/profile.css`, `auth.css`, `pages.css`, `consent.css`, `legal.css`, `home-section.css`, `sidebar.css`** (bivši C6). | …korisnik promijeni ime i vidi svoj profil onako kako ga vide drugi |
| **F2/4** | **Mail-obavijesti** — Edge Function (ADR-016), pristanak iz upitnika, odjava jednim klikom iz maila, admin-forma. Prvi segment: FMTU. | …primi mail o novom predmetu SAMO ako je pristao, i odjavi se jednim klikom iz samog maila |

**Otvoreno pitanje za F2/1 (čeka Leona):** što s **neprijavljenim** korisnikom na tuđem uređaju —
ostaje li mu zadnja lokalna tema ili se vraća na zadanu? Bez odgovora se cigla može izvesti, ali s
pretpostavkom koja se poslije mijenja teško.

**Ne popušta ni ovdje:** identitet isključivo iz JWT-a (`getUser()`) · `service_role` samo u Edge
Functions · RLS i `publish_document` nedirnuti · osobni graditelj ostaje zaseban otok.

**Izlaz iz faze:** cijeli krug računa radi na pravom uređaju — prijava, tema, slika, ime, mail.

---

### F3 · DVOJEZIČNOST

Brana `check:i18n` već postoji i broji po datoteci; **dokaz napretka je spuštanje osnovice**, nikad
procjena. Redoslijed ide po tome gdje je posao najgušći i najizoliraniji.

| cigla | posao | gotovo kad |
|---|---|---|
| **F3/1** | **Četiri pravne stranice** — nemaju ni mehanizam: prvo `js/i18n.js` + `data-i18n`, pa prijevod. Najveći pojedinačni komad. ⚠️ **Iste stranice dobivaju temu u F1/2** — ako F1 još nije zatvoren, spojiti u jedan obilazak. | …korisnik na hrvatskom otvori Pravila privatnosti i pročita ih na hrvatskom |
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
  NCVVO materijala.
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

Pet pitanja koja mijenjaju izvedbu, a ne mogu se razumno pretpostaviti:

1. **Neprijavljen korisnik na tuđem uređaju** — zadnja lokalna tema ili zadana? *(F2/1)*
2. **Sidebar predmeta** — obrisati ili vratiti kao brzi izbornik? *(sitni dug)*
3. **Opseg frontenda vježbi** — tokeni i razmaci, ili prepravak interakcije? *(F5/3)*
4. **Facebook prijava** — čeka Metine ključeve; kod se vraća jednom zastavicom. *(F2, ako se vraća)*
5. **Četiri kvantitativna HR predmeta** — radimo ih mi, ili padaju? *(izvan faza)*

---

*Mjere, nalazi i obrazloženja: [BACKLOG.md](../records/BACKLOG.md) · odluke:
[DECISIONS.md](../records/DECISIONS.md) · što je isporučeno:
[CHANGELOG.md](../records/CHANGELOG.md) · zašto brana postoji: zaglavlje njezine skripte.*
