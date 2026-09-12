# MONETIZATION.md — model prihoda

> **Status: MODEL ODLUČEN** (Leon, 2026-09-07) — [ADR-036](../records/DECISIONS.md). Naplata još nije
> implementirana; ovdje stoji **što se naplaćuje, kome i kojim redom**, a ne obećanje datuma.
> Definicija proizvoda iz koje sve ovo slijedi: [ADR-035](../records/DECISIONS.md).
> Povezano: [VISION.md](./VISION.md) · [PRD.md](./PRD.md) · [ROADMAP.md](../plan/ROADMAP.md) · [BACKLOG.md](../records/BACKLOG.md).
>
> ⚠️ **Prethodna verzija ovog dokumenta (2026-06-27) pretpostavljala je maturu kao tržište i „donesi
> svoj ključ" kao prvi korak naplate.** Matura ostaje **hipoteza** (§12), a „tvoj ključ" je nadglašen —
> korisnikov AI se plaća sam kroz MCP, pa to više nije proizvod nego pretpostavka arhitekture.

## 1. Pravilo koje se ne krši

**Naplaćuje se funkcionalnost i pristup organizacije — nikad tuđe gradivo.**

Ovo nije etika nego pravna nužnost: gradivo pišu korisnici, često izvedeno iz materijala svojih
profesora. Onog trena kad **mi** naplatimo pristup tom gradivu, mi ga preprodajemo. Zato naplaćujemo
alat, radni prostor organizacije i pravo prodaje — a kad se gradivo ipak prodaje, prodaje ga **njegov
vlasnik**, ne mi (§6).

## 2. Što je besplatno zauvijek

Osnovno učenje — **kartice, kviz, dopune, skripta**. Učenje **bilo čijeg** javnog materijala. Vlastita
polica. I **objava bez ograničenja broja**.

Razlog je računica, ne velikodušnost:

- **Naplatiti objavu znači naplatiti jedino čega nemamo.** Tržište gradiva umire od prazne police, a
  ne od viška ponude. Ograničiti broj objava besplatnom korisniku je gušenje vlastite zalihe.
- **Zaključan tuđi rad izgleda pokvareno.** Ako posjetitelj ne može otvoriti objavljeni materijal bez
  plaćanja, kriv ispada autor — pa autor prestane objavljivati. Time pada i ponuda i usmena predaja.
- Limit ne filtrira smeće. Spamer plati ako mu se spam isplati; limit izbaci samo studenta bez novca.
  **Smeće se rješava moderacijom, ne cijenom.**

## 3. Pet platiša

| # | platiša | što zapravo kupuje | oblik |
|---|---|---|---|
| ① | **Firma** | uštedu seniorovog vremena na onboardingu + **dokaz da je zaposlenik prošao gradivo** | mjesečna pretplata po odjeljku |
| ② | **Ustanova** (fakultet, škola) | gradivo kolegija na jednom mjestu, **statistiku tko zaostaje**, kontinuitet kad profesor ode | godišnja licenca (po studentu ili po odjelu) |
| ③ | **Učenik** | naprednije učenje: raspoređeno ponavljanje, dublja statistika, sezonska propusnica pred ispit | pretplata ili sezonska propusnica |
| ④ | **Autor koji prodaje** | **pravo prodaje** + alate uz njega (statistika prolaznosti, profil, vidljivost) | pretplata |
| ⑤ | **Kupac tuđeg rada** | konkretan materijal | jednokratno; nama ide provizija |

## 4. Četiri toka prihoda

| tok | izvor | narav |
|---|---|---|
| **A** | pretplate organizacija (① + ②) | **kičma** — predvidivo, ne ovisi o rastu publike |
| **B** | potrošačka pretplata (③) | nestalno, sezonski, raste s masom |
| **C** | provizija na prodaju (⑤) | raste sam kad tržište proradi |
| **D** | autorska pretplata (④) | malo, ali veže autora uz platformu |

**Redoslijed pouzdanosti je točno taj.** A hrani sve dok C ne postane stvaran; B i D nemaju smisla dok
publika ne postoji.

**Kako se noge hrane međusobno:** organizacije plaćaju → besplatni sloj ostaje stvarno besplatan →
besplatni sloj stvara publiku i gradivo → publika čini tržište vrijednim za prodavače → provizija plaća
rast. **Nijedna noga ne čeka drugu da bi imala smisla** — jedini razlog zašto ovo može krenuti bez
investicije.

## 5. Organizacija kao najam

Najam nije „ustanova" nego **organizacija: firma · fakultet · škola.** Jedan model, tri tržišta, jedna
izgradnja.

**Firma je najlakši kupac, najbrža isporuka i najmanji rizik**, pa ide prva: vlasnik odluči i plati u
jednom razgovoru, bez nabave, dekana i akademskog ciklusa. Ustanova kupuje po akademskim ciklusima —
pismo namjere u jesen znači ugovor za sljedeću godinu.

**Što firma stvarno kupuje.** Ne alat za učenje, nego dvije stvari: novi čovjek prestaje trošiti tjedne
nekog seniora, i vlasnik dobiva **zapis** da je gradivo prođeno. U Hrvatskoj je taj zapis dijelom
**zakonska obveza** — zaštita na radu, procedure, HACCP u ugostiteljstvu. Ispis „ime, test, datum,
rezultat, trajanje" nije ukras nego papir koji poslodavcu treba, i to je ulaz u svaku malu firmu, ne
samo u prijateljsku.

**Što ustanova stvarno kupuje.** Gradivo kolegija na jednom mjestu pod svojom kontrolom, **rano
upozorenje tko zaostaje prije nego padne ispit** (prolaznost je brojka po kojoj se ustanova mjeri), i
to da materijal preživi profesora koji ode.

**Organizacija bira po kolegiju:** privatno samo za svoje · javno besplatno · javno naplatno. **Zadano
je privatno** — nitko ne mora ništa objaviti da bi platio licencu.

### ⚠️ Višenajmnost NIJE osobni otok

Organizacija traži **entitet, članove, uloge (voditelj/profesor vs polaznik), gradivo u vlasništvu
organizacije i statistiku ograničenu na nju**. To **nije** model iz [ADR-024](../records/DECISIONS.md), gdje je sve vezano uz
jednog vlasnika (`owner_id = auth.uid()`). Ako se to ne projektira unaprijed, gradi se dvaput.

**Kriterij prihvaćanja:** gotovo kad vlasnik firme doda zaposlenika, dodijeli mu gradivo i vidi njegov
napredak — a taj zaposlenik ne vidi ništa izvan svoje organizacije.

## 6. Tko smije prodavati — prvo organizacije, pojedinci kasnije

**Ovo je najvažnija odluka u modelu i lako se previdi.**

Čim **pojedinac** proda svoj rad, mi smo posrednik koji isplaćuje stotine fizičkih osoba: porezi,
doprinosi, PDV po zemlji kupca, računi. To je administrativna mašina koja može progutati cijelu firmu
prije nego zaradi.

**Organizacija ima OIB, izdaje račun i ima knjigovođu.** Isplata prema firmi ili ustanovi je obična
B2B transakcija.

Zato: **u prvoj verziji prodaju samo organizacije.** Pojedinac do tada objavljuje besplatno — i to mu je
i dalje vrijedno, jer gradi ime i statistiku prolaznosti. Pojedinačna prodaja dolazi tek kad postoji
infrastruktura za isplate (§10).

**Dvije stvari moraju biti riješene prije nego se upali gumb za prodaju:**

1. **Autorstvo.** Ako ustanova prodaje materijal svog profesora bez njegova pristanka, mi smo uvučeni u
   spor kao platforma. **Ugovorno: organizacija jamči da ima prava na ono što objavljuje.**
2. **Smije li javna ustanova prodavati.** Fakulteti imaju tržišnu djelatnost, ali ona ide kroz njihovo
   računovodstvo i pravila; dekan ne može samo početi prodavati na tuđoj platformi. Zato je prodaja
   **opcija, ne uvjet** — tko ne želi tu gnjavažu, plaća licencu i koristi privatno.

**Provizija: 15–20 %.** Niže od uobičajenih 30 % jer organizacija s imenom ima pregovaračku moć, a naš
cilj je da objavi — ne da se cjenka.

## 7. Exam modul

Namjera je stara ([VISION §8](./VISION.md)); ovdje dobiva oblik jer je **razlog zbog kojeg firma uopće plaća**.

Platforma se **zaključa u ispit**: bez navigacije, bez drugih načina učenja, jedan pokušaj, sat teče,
predaja na kraju ili istekom vremena. **Vrijeme i ocjena se računaju na poslužitelju, nikad iz
preglednika** — isto pravilo koje već vrijedi za natjecanje ([VISION §4](./VISION.md)).

⚠️ **Iskrena granica, i kupcu se kaže prije nego je sam otkrije:** preglednik ne može spriječiti drugi
uređaj ni pitanje kolegi. **Nijedan web-ispit to ne može.** Za onboarding i zakonsku evidenciju je to
prihvatljivo — dokazuje se da je čovjek prošao gradivo i položio, ne da je bio sam u sobi. Za maturu ili
pravi kolokvij nije, i ondje se rješava nadzorom, ne kodom.

**Isti modul poslije služi trima tržištima** — evidencija u firmi, kolokviji na ustanovi, matura kad na
nju dođe red. Gradi se jednom.

**Kriterij prihvaćanja:** gotovo kad voditelj pošalje ispit, polaznik ga riješi pod satom, a voditelj
dobije zapis s imenom, rezultatom, datumom i trajanjem koji smije ispisati.

## 8. Paketi i cijene — **hipoteze, ne cjenik**

| paket | prijedlog | napomena |
|---|---|---|
| **Firma — pilot** | ~30 €/mj do 20 ljudi (ili 300 €/god) | namjerno jeftino: cilj pilota je **potpis, preporuka i citat**, ne prihod. Prava cijena se postavlja na četvrtom kupcu |
| **Ustanova** | po studentu godišnje ili paušal po odjelu | **brojku postavlja odgovor s FMTU-a** o tome što danas plaćaju za simulacije i alate — ne izmišlja se |
| **Provizija** | 15–20 % | §6 |
| **Učenik** | 3–4 €/mj ili ~25 € po sezoni | iznad toga hrvatski student otkazuje u drugom mjesecu; sezonska propusnica prati ispitni kalendar |
| **Autor** | mala mjesečna | pravo prodaje + statistika + profil |

**Tržišno sidro (provjereno 2026-09-07):** Cesim Hospitality i HOTS prodaju se **isključivo na upit**,
bez javnog cjenika — što samo po sebi znači skupo i bez sidra na koje se kupac može pozvati. Jedini
vidljiv broj u blizini je **~£950** za srodnu simulaciju; Cesim navodi **preko 1000 visokoškolskih
ustanova** kao korisnike, dakle kategorija je velika i stvarna. Vezano: [HOTEL_SIM.md](../ideas/HOTEL_SIM.md).

## 9. Unit economics

Marginalni trošak je praktički **nula**: statički frontend, **korisnik plaća svoj AI** (MCP,
[ADR-031](../records/DECISIONS.md)), gradivo pišu drugi.

Fiksni trošak infrastrukture: **Supabase Pro + Vercel Pro ≈ 45 USD mjesečno.**

➡️ **Dvije male firme po 30 € i infrastruktura je plaćena. Sve iznad je marža.**

To je i najjača rečenica pred komisijom inkubatora: profitabilan na **drugom** kupcu. (Ne računa
Leonovo vrijeme — svjesno, jer ga u ovoj fazi nitko ne plaća.)

## 10. Faze naplate

Vezano uz **šestomjesečni** program Startup inkubatora Rijeka (skraćen s osam kod 17. generacije).

| kada | što se naplaćuje | zašto tada |
|---|---|---|
| **sad → listopad 2026** | **ništa** | mjeri se aktivacija i povratak; naplata prije toga mjeri pogrešnu stvar |
| **listopad → ožujak** (inkubator) | **firme** (tok A) | vlasnik odlučuje sam; exam modul i evidencija su ono što se prodaje |
| **nakon osnivanja firme** | ustanove + potrošački paketi | prije toga nema subjekta koji izdaje račun |
| **kad polica bude puna** | provizija — **organizacije kao prodavači** | §6 |
| **zadnje** | pojedinci prodaju svoj rad | traži infrastrukturu za isplate |

⚠️ **Naplata bez firme.** Inkubator prima **samo fizičke osobe bez registriranog subjekta u trenutku
prijave**, a nagrada (15/7/3 tisuće €) je namijenjena **osnivanju** poduzeća. Zato se u programu ne
izdaju računi nego se potpisuje **pismo namjere ili predugovor** — pred komisijom vrijedi gotovo isto
kao račun, jer dokazuje da netko pristaje platiti. Alternativa je **ugovor o djelu** (isplatitelj
obračunava poreze i doprinose; za trajnu uslugu porezna to zna prekvalificirati — potvrđuje knjigovođa).
Rad pod tuđom firmom (§11) je zadnja opcija: prihod i obveze idu pod tuđi OIB.

## 11. Pravno i porezno — što se mora riješiti prije prvog eura

- **Stripe traži poslovni subjekt** (obrt ili d.o.o.): naziv+OIB+adresa+MBS, opis djelatnosti, IBAN,
  identitet vlasnika, PDV status, **živa stranica s cijenama + Terms/Privacy/Refund/Kontakt** (✅ pravne
  stranice već postoje).
- **Djelatnosti (NKD, sve slobodne):** glavne **62.01 Računalno programiranje** + **63.12 Internetski
  portali**; korisne **85.59 Ostalo obrazovanje d.n.**, **58.29 Izdavanje ostalog softvera**,
  **63.11 Obrada podataka/hosting**. d.o.o. smije nereguliranu djelatnost; obrt mora upisati kodove.
  Točan naziv potvrđuje knjigovođa (NKD 2007→2025).
- **⚠️ Tržište te pretvara u POSREDNIKA.** Dok prodajemo svoju uslugu, mi smo obični trgovac. Čim novac
  ide **između dva korisnika**, trebaju isplate prodavačima, **Stripe Connect ili MoR koji podnosi
  marketplace**, PDV na prodavačevoj strani i računi. **Ovo je bitno teže od obične pretplate** i zato
  provizija dolazi kasno u §10.
- **PDV:** prodaja digitalne usluge građanima EU → OSS/PDV po zemlji kupca. Olakšica:
  **Merchant-of-Record** (Lemon Squeezy / Paddle) — oni su prodavač, oni rješavaju PDV i račune.
  Preporuka za solo osnivača.
- **Firma tate** (Waterfront, Omišalj): moguće AKO (1) djelatnost pokriva softver/portal/edukaciju
  (provjeriti u **sudreg.pravosudje.hr**), (2) prihod/PDV/računi idu pod njegov OIB i njegov knjigovođa
  to vodi, (3) on pristane. Alternativa: vlastiti paušalni obrt — **ali ne prije prijave na inkubator**.

## 12. Matura — tržišna HIPOTEZA, ne posao u planu

Ostaje kao procjena tržišta, ne kao staza rada ([VISION §8](./VISION.md) drži uvjete pod kojima bi se uopće otvorila).

- Državnoj maturi pristupa **~30.000–40.000** ljudi godišnje; platežno **~20–25.000** u sezoni.
- **Roditelji plaćaju** (kao instrukcije 15–20 €/h); tržište je **sezonsko** (vrhunac siječanj–svibanj).
- **Sezonska propusnica** (30–40 €) pristaje sezonskom ispitu bolje od mjesečne pretplate.
- Ako se ikad otvori: engine prošlih ispita (NCVVO su javni) + exam modul iz §7 — **isti modul, treće
  tržište**.

**Scenariji za potrošački tok B** (pretpostavka ~30 €/god po platežnom):

| scenarij | besplatnih | konverzija | platežnih | godišnje |
|---|---|---|---|---|
| oprezni | 5.000 | 3 % | 150 | ~4.500 € |
| realan | 15.000 | 5 % | 750 | ~22.500 € |
| optimističan | 40.000 | 8 % | 3.200 | ~96.000 € |

⚠️ **Konverzija 3–8 % je optimistična** — freemium edtech realno vozi **1–3 %**. Brojke drži kao gornju
granicu, ne kao plan. **Najjače poluge su konverzija i ARPU**, a ne broj registriranih.

## 13. Otvoreno — odlučuje se mjerenjem, ne sad

1. **Koji točno načini učenja idu iza potrošačkog paywalla.** Odlučuje se **tek kad se vidi što ljudi
   stvarno koriste** u prvom valu, ne napamet. Osnovna petlja (§2) ostaje besplatna u svakom slučaju.
2. **Cijena za ustanove** — čeka onu jednu brojku s FMTU-a (§8).
3. **Je li exam modul dio osnovne pretplate firme ili dodatak.** Preporuka: **dio osnovne**, jer je on
   razlog zbog kojeg firma plaća.
4. **Hoće li itko objaviti gradivo za druge.** Cijeli tok C stoji na toj pretpostavci, a ona još nijednom
   nije potvrđena. **Testira se s desetak ljudi u prvom valu, prije ijedne cigle naplate** — jeftinije je
   saznati za dva tjedna nego za pola godine.
