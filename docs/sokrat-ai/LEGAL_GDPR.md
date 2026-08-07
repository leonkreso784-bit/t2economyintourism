# Sokrat AI — Pravni temelj: GDPR i autorsko pravo

> ⚠️ **NIJE PRAVNI SAVJET.** Ovo je inženjerski okvir da znaš *o čemu se radi* i da možeš voditi
> pametan razgovor. **Prije bilo kakvog ugovora sa sveučilištem ili prikupljanja profesorskih materijala
> traži pravnu službu sveučilišta / službenika za zaštitu podataka (DPO) / odvjetnika.**
> Krivo posložen pravni temelj ubija projekt **nakon** što u njega uložiš godine — a to je najgori trenutak.

## 1. Prvo i najvažnije: to su DVIJE odvojene dozvole

Ljudi ovo stalno miješaju. **Uvijek trebaš obje:**

| | **Autorsko pravo** | **GDPR (osobni podaci)** |
|---|---|---|
| Štiti | **djelo** (tekst, skriptu, rad) | **osobu** (identificiranog pojedinca) |
| Nositelj | autor / nakladnik | osoba na koju se podaci odnose |
| Pitanje | „Smijem li **koristiti tekst**?" | „Smijem li **obrađivati podatke o osobi**?" |
| Rješenje | licenca / zakonska iznimka | pravna osnova (npr. privola) |

**Primjer:** profesor ti da skriptu. Time si dobio *autorskopravnu* dozvolu za tekst — ali ako u skripti
ima imena studenata iz studije slučaja, i dalje imaš **GDPR problem**. I obrnuto.

---

## 2. GDPR — osnovni pojmovi (minimum koji moraš znati)

**Osobni podatak** = *svaki* podatak koji se odnosi na **odredivu fizičku osobu** — ime, e-mail, OIB,
studentski broj, ali i **kombinacija** podataka koja nekoga čini prepoznatljivim. Definicija je **vrlo široka**.

**Obrada** = praktički sve što radiš s podacima — prikupljanje, spremanje, analiza, **i treniranje modela.**

**Pravna osnova (čl. 6)** — moraš imati **jednu** od šest. Za nas su realne:
- **Privola** (*consent*) — mora biti dobrovoljna, informirana, **specifična** i **opoziva**
- **Legitimni interes** — moguć, ali traži test ravnoteže i lakše se osporava
- **Javna zadaća / znanstveno istraživanje** — jače kad se radi **kroz instituciju**

**Posebne kategorije (čl. 9)** — zdravlje, vjera, etnička pripadnost, politika… **dodatna zaštita.**
U akademskim radovima se pojavljuju češće nego što misliš (npr. medicinske ili sociološke studije).

**Anonimizacija ≠ pseudonimizacija.** Ako se osoba **može** ponovno identificirati (npr. zamijenio si ime šifrom,
ali imaš tablicu mapiranja) — to je **pseudonimizacija** i **i dalje je osobni podatak**.
Prava anonimizacija (izlazak iz GDPR-a) je teža nego što zvuči.

---

## 3. ⚠️ Središnji problem AI-ja i GDPR-a: pravo na zaborav

**Članak 17 — pravo na brisanje.** Osoba ima pravo tražiti da joj se podaci obrišu.

> **Ako osobni podaci uđu u TEŽINE modela — ne možeš ih izbrisati.**
> Ne postoji „obriši ovu osobu iz modela". Jedina opcija je **ponovno treniranje cijelog modela.**

To je temeljna nekompatibilnost i regulatori su je uočili. **Zato naša arhitektura nije samo tehnička odluka —
to je pravna strategija:**

```
❌ osobni podaci → TEŽINE MODELA   = nepovratno, GDPR problem, neizbrisivo
✅ podaci        → BAZA ZNANJA     = izbrisivo jednim DELETE-om, GDPR u redu
```

**Ovo je najvažnija rečenica u dokumentu:**

> **Podjela „model = vještina, baza = znanje" je istovremeno naš GDPR-štit.**
> Sve što je izbrisivo mora živjeti u bazi. U težine ide samo ono što je **bezlično** —
> jezik, gramatika, vještina postavljanja pitanja.

---

## 4. Praktična pravila za Sokrat AI (operativno)

### 🔴 Nikad u trening (tvrdo pravilo)

- Studentski podaci s platforme: e-mail, ime, napredak, odgovori, ocjene
- Bilo koji identifikator: OIB, matični broj, studentski broj
- Sadržaj koji nije prošao uklanjanje osobnih podataka

### 🟡 Uz oprez

- **Imena autora** — to je osobni podatak. Rješenje: čuvaj autorstvo u **metapodacima korpusa**
  (odvojeno, za dokaz porijekla), a **iz teksta koji ide u trening ukloni** gdje god je moguće.
- **Akademski radovi** — mogu sadržavati intervjue, ankete, studije slučaja s ljudima.
  Treba prolaz kroz filtar osobnih podataka.

### 🟢 Sigurno

- Bezlični stručni tekst (definicije, teorija, gradivo)
- Enciklopedijski sadržaj
- Vlastiti kurirani sadržaj bez osobnih podataka

### Sedam operativnih načela

1. **Razdvoji cjevovode.** Osobni podaci i podaci za trening **nikad ne dijele isti put.** Fizički odvojeno.
2. **Minimizacija.** Ne prikupljaj što ti ne treba. Najbolja zaštita je podatak koji ne posjeduješ.
3. **Uklanjanje osobnih podataka prije treninga**, ne poslije. Automatizirano + uzorkovana ručna provjera.
4. **Privola mora biti specifična.** „Slažem se s korištenjem materijala" **nije dovoljno.**
   Mora pisati *„za treniranje jezičnog modela"* — inače nije informirana.
5. **Privola mora biti opoziva** — i moraš **tehnički moći** izvršiti opoziv (opet: baza, ne težine).
6. **Dokumentiraj sve.** GDPR traži **dokazivu** usklađenost (načelo pouzdanosti, čl. 5(2)).
   Vodi evidenciju: koji izvor, koja licenca, koja osnova, kad, tko je odobrio.
7. **Ne commitaj podatke u git.** Ni uzorke s osobnim podacima. Nikad.

---

## 5. Autorsko pravo — i velika prednost sveučilišta

### Tko što posjeduje

| Materijal | Nositelj prava (u pravilu) |
|---|---|
| **Profesorska skripta / predavanje** | **profesor osobno** (ne sveučilište!) → treba njegova licenca |
| **Studentski diplomski/doktorski rad** | **student** (repozitorij ima pravo objave — *ne nužno* pravo treniranja) |
| **Znanstveni članak** | ovisi o ugovoru s časopisom; otvoreni pristup ≠ bilo koja uporaba |
| **Ispiti, interni materijali** | ustanova |

> ⚠️ **„Otvoreni pristup" znači „smiješ čitati", ne automatski „smiješ trenirati model".**
> Uvijek gledaj **konkretnu licencu** (CC BY, CC BY-SA, CC BY-NC…). Npr. **CC BY-SA** (Wikipedija)
> traži dijeljenje pod istim uvjetima — razmisli što to znači za tvoj model.

### 🎓 TDM iznimka — zašto je sveučilište zlata vrijedno

EU direktiva o autorskom pravu (2019/790, u hrvatskom Zakonu o autorskom pravu) uvodi iznimke za
**rudarenje teksta i podataka** (*text and data mining*):

- **Čl. 3 — za znanstveno istraživanje:** **istraživačke organizacije** (sveučilišta, instituti) smiju
  rudariti djela kojima imaju **zakonit pristup**, u svrhu znanstvenog istraživanja —
  i to se **ne može ugovorno isključiti**.
- **Čl. 4 — općenito:** šira iznimka, ali **nositelj prava se može izuzeti** (opt-out).

**Praktična posljedica koja mijenja strategiju:**

> **Isti posao, rađen *kroz sveučilište* kao znanstveno istraživanje, ima znatno jaču pravnu osnovu
> nego rađen privatno.** Partnerstvo s dekanom nije samo politika i pristup podacima —
> **ono otključava pravnu iznimku koju privatna osoba ili tvrtka ne dobiva.**

To je jak argument **za** institucionalni put i vrijedi ga spomenuti dekanu (v. [DEAN_PITCH.md](./DEAN_PITCH.md)).

---

## 6. Institucionalni put = besplatna pravna zaštita

Kad radiš kroz sveučilište, dobivaš infrastrukturu koju sam ne možeš platiti:

| Resurs | Što ti daje |
|---|---|
| **Službenik za zaštitu podataka (DPO)** | Sveučilišta ga **moraju** imati. Besplatan stručnjak — **koristi ga.** |
| **Etičko povjerenstvo** | Odobrenje = legitimitet i zaštita |
| **Pravna služba** | Sastavljanje licencnih obrazaca i privola |
| **Institucionalni status** | Otključava TDM iznimku iz čl. 3 |

**DPIA (procjena učinka, čl. 35)** — vjerojatno **potrebna** za obradu velikih razmjera / novu tehnologiju.
Zvuči zastrašujuće, ali je zapravo strukturiran dokument: što obrađuješ, zašto, koji su rizici, kako ih ublažavaš.
**Napravi je rano** — pred dekanom i DPO-om djeluje izuzetno ozbiljno.

**Nadzorno tijelo u RH:** AZOP (Agencija za zaštitu osobnih podataka).

---

## 7. Kako pristupiti — redoslijed poteza

1. **Kreni od nespornog** — Wikipedija, javna domena, vlastiti sadržaj, istraživački korpusi.
   **Nula pravnog rizika, a dovoljno za prvi model.** Ne čekaj nikoga.
2. **Prije faze 3 (institucionalni podaci):** razgovor s **DPO-om sveučilišta** — *prije* prikupljanja, ne poslije.
3. **Napravi obrazac privole** (s pravnom službom) koji pokriva **obje** dozvole:
   autorskopravnu licencu **+** GDPR privolu, izričito za treniranje modela, s opozivom.
4. **Vodi registar izvora** — svaki dokument: izvor, licenca, osnova, datum, tko je odobrio.
5. **Tehnički osiguraj opoziv** — arhitektura mora omogućiti brisanje (retrieval baza, ne težine).
6. **Napravi DPIA** prije velikog prikupljanja.

---

## 8. Kontrolna lista prije svakog novog izvora

- [ ] Znam **tko** je nositelj autorskog prava?
- [ ] Imam **licencu ili zakonsku iznimku** koja pokriva **treniranje modela** (ne samo čitanje)?
- [ ] Ima li tekst **osobne podatke**? Jesu li uklonjeni prije treninga?
- [ ] Ima li **posebnih kategorija** (čl. 9)?
- [ ] Mogu li **dokazati porijeklo** (izvor, datum, licenca u metapodacima)?
- [ ] Mogu li **tehnički izbrisati** ovaj sadržaj ako netko opozove privolu?
- [ ] Je li zapisano u **registru izvora**?

**Ako je ijedan odgovor „ne" — izvor ne ulazi u korpus.**
