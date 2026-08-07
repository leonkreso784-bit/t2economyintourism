# Faza: „Materijal od nule do učenja" — aktivni plan

> **Ovo je POTROŠAN dokument.** Kad faza padne, ide u `docs/archive/` s pečatom datuma — isti dan.
> Definicija i kriteriji prihvaćanja su u [product/UGC_SPEC.md](../product/UGC_SPEC.md) i **nadživljuju** ovaj plan.
> Ovdje su samo **cigle, redoslijed i status**.

**Cilj:** korisnik na praznoj polici napravi materijal, u njemu sam složi kartice, kviz i dopune,
i **iz njega uči**.

**Potvrđeno:** Leon, 2026-08-07.

---

## Cigle

| # | cigla | status |
|---|---|---|
| **M1** | svi modovi dostupni u praznom materijalu | ✅ |
| **M2** | učenje iz vlastitog materijala | ✅ |
| **M3a** | boja **bloka** (learn) — shema · prikazivač · CSS · editor | ✅ |
| **M3b** | boja **kartice / pitanja / dopune** (+ akcent sekcije na studentskoj strani) | ✅ |
| **M5a** | **duljina kartice** — vođenje u editoru (upozorenje 200 · blokada 500) | ⬜ |
| **M5b** | skratiti 25 zatečenih kartica → tek tada `maxLength` u shemi | ⬜ |
| **M4** | sučelje prestaje obećavati | ✅ |

Redoslijed nije proizvoljan: **M1 otključava autorstvo** (bez nje ostale cigle nemaju što pokazati),
**M2 je pravi posao**, a **M3 ide zadnja jer jedina dira javni katalog**.

### Kriteriji prihvaćanja — **5 od 5**

Mjeri se po [UGC_SPEC §2](../product/UGC_SPEC.md), ne po ovoj tablici cigli.

| | kriterij | |
|---|---|---|
| 1 | napravim materijal od nule (kartica + kviz + dopuna) | ✅ M1 |
| 2 | učim iz njega istim ekranima kao iz kataloga | ✅ M2 |
| 3 | napredak se pamti i sinkronizira | ✅ M2 |
| 4 | boja sekcije se vidi na blokovima i karticama, može se pregaziti | ✅ M3a + M3b |
| 5 | sučelje ne spominje ništa što ne postoji | ✅ M4 |

⚠️ **Kriteriji su ispunjeni u kodu i dokazani testovima, ali NISU verificirani Leonovom živom
prijavom** — sve stoji na grani `docs/stage-a`, ne na produkciji. Faza se **ne proglašava
gotovom** dok Leon ne prođe tokom rukom; točno ta razlika ju je jednom već krivo zatvorila.

**M5 (duljina kartice) ostaje otvoren**, ali NIJE kriterij prihvaćanja ove faze — nov je nalaz
iz Leonovog živog pregleda i vodi se kao zaseban posao.

---

### M1 · Svi modovi dostupni u praznom materijalu

**Problem.** [`presentModes`](../../js/studio.js#L275) označi mod postojećim **samo ako je niz nepraznan**.
Nov materijal ima `flashcards: []` / `quiz: []` / `fillBlanks: []` → tabovi se ne nacrtaju → nema gumba
„＋ Dodaj" → **prva kartica se ne može napraviti nikad.**

**Sve ispod već radi** (provjereno u kodu):
- [`renderPane:647`](../../js/studio.js#L647) preskače prazne nizove **samo u read-onlyju**; u edit-modu crta naslov sekcije i „＋ Dodaj"
- [`addSection`](../../js/studio.js#L389) već sije prazne nizove i `learn: { blocks: [] }`
- delegati u [`admin.js:819`](../../js/admin.js#L819) **ne traže admina** — otvore editor koji piše u draft

→ Uređivači postoje, put upisa postoji, prava su u redu. **Jedini filtar je `presentModes`.**

**Zahvat.** U edit-modu su `cards`/`quiz`/`fill` prisutni čim postoji **barem jedna sekcija**.
Read-only ostaje kakav jest — onome tko uči ne nudimo prazan mod.

**Learn je namjerno izuzet.** [`renderLearnPane:556`](../../js/studio.js#L556) izričito preskače kategoriju
bez `learn`-a (*„dodavanje learn-a praznoj kategoriji = kasnija cigla"* — cigla nikad nije došla).
Forsirati `learn` značilo bi nacrtati tab s praznim panelom i bez ijedne afordancije. Za materijal to
ne smeta jer `addSection` uvijek sije `learn`. **Vidi M1b.**

**Vrijedi i za katalog.** Isti slijepi kraj postoji u javnom katalogu: predmet koji nema nijednu dopunu
ne može dobiti prvu. Cigla popravlja oba svijeta, a postojeće predmete ne dira (imaju neprazne nizove — mode se ionako već nudi).

**Dokaz:** test koji **pada prije** popravka — nov čvor → 4 taba → dodaj karticu, pitanje i dopunu → objavi → prežive.

**Rizik:** nizak. Jedna funkcija, bez promjene sheme, bez promjene puta upisa.

---

### M1b · Prazna kategorija može dobiti learn *(kandidat, ne obavezno u ovoj fazi)*

Ista klasa slijepog kraja kao M1, ali pogađa **samo katalog** (materijal uvijek ima `learn` iz `addSection`).
Odluka nakon M1 — ako je jeftino, ide odmah; ako nije, ostaje zapisano i ne pretvara se u tihi dug.

---

### M2 · Učenje iz vlastitog materijala

**Problem.** [`initStudyPage`](../../js/navigation.js#L547) kreće od `subjectDataMap[subjectId]` = **katalog**;
**13 mjesta** u kodu to pretpostavlja (`storage.js`, `analytics.js`, `profile.js`, `cloud-sync.js`, `progress.js`).

**Zahvat.** Sintetički upis za čvor (`storageKey: 'node:<uuid>'`) — isti obrazac **„šav generičan po ključu"**
koji je već platio kod drafta (`node:<uuid>`) i napretka (`progress` je key-value).

**Četiri ruba koja time NISU pokrivena** — rješavaju se svjesno, ne otkrivaju usput:
1. `SokratContent.loadLesson` ne zna za čvorove
2. `applyFeatureNav` → vježbe i slijepa karta moraju se sakriti **namjerno**, ne slučajno preko `null`
3. `saveCurrentPosition` sprema `{subject, lesson}` → obnova gađa id koji još nije registriran
4. `cloud-sync` i `profile.js` **iteriraju cijeli `subjectDataMap`** → materijali bi procurili u „moje predmete"

**Ulaz u „Uči"** = druga radnja na retku materijala, **privremeno**; konačno mjesto je u vlasništvu
frontend-redizajna (Leon).

**Rizik:** srednji — dira **dijeljeni study-DOM**, gdje već postoji presedan (BUG-020: kviz je curio iz
prošlog predmeta). Reset-blok u `initStudyPage` mora pokriti i ovaj put.

---

### M3 · Boje kao jedan sustav — **M3a ✅ · M3b ✅**

> **M3b — kako je izvedeno.** Tri study-moda **nemaju zajednički prikazivač**: `flashcards.js`,
> `quiz.js` i `fill-blanks.js` pišu `textContent` u **fiksni DOM**, pa ne postoji omot u koji bi se
> boja umetnula kao u M3a. Zato akcent ne izlazi kao niz nego se na spremnik postavi **`--item-acc`**
> (`#flashcard` · `#quizGame .question-card` · `#fill .fill-card`), a CSS ga uzima kroz
> **`var(--item-acc, <zatečena vrijednost>)`** — bez boje se crta točno ono što se crtalo prije,
> pa nema uvjetnih selektora ni rizika za 22 živa predmeta.
>
> **Validacija živi na JEDNOM mjestu** (`SokratBlocks.accentFrom`) i dijeli je blok, sve tri
> study-stavke i Studio-panel. Tri kopije regexa bile bi drift koji smo **već platili** (shema je
> znala 4 boje teksta, editor je deployao 8).
>
> **🕳 Rupa nađena usput:** `--st-acc` se do sada postavljao **isključivo u Studiju** → onaj tko
> **uči** nije vidio boju sekcije u learnu **nigdje**. Blok s vlastitom bojom je radio (emitira
> `--lb-acc`), ali **nasljeđivanje nije — neobojan blok nema omot koji bi se obojao.** Bez toga bi
> tri moda od četiri pokazivala boju sekcije, a learn ne. Popravljeno: `js/learn.js` postavlja
> validiran `--st-acc` na karticu sekcije. **Time kriterij 4 vrijedi na studentskoj strani, ne samo
> u editoru.**

> **Podijeljeno u dvije polovice.** Leon je imenovao *„mijenjanje boja po blokovima nije završeno
> u learnu"* kao rupu, a kartice kao *„trebat će biti"*. **M3a (blokovi) je isporučen**; M3b
> (kartice/pitanja/dopune) traži još 3 definicije sheme i **tri zasebna prikazivača**
> (`flashcards.js` · `quiz.js` · `fill.js`) — druga površina, druga cigla.
>
> **M3a — kako je izvedeno:** `accent` definicija u shemi (jedno mjesto istine) + `color` u svih
> 9 blokova · prikazivač emitira `<div class="lb-tint" style="--lb-acc:#rrggbb">` **samo** nakon
> `^#[0-9a-fA-F]{6}$` · CSS crta rub + `color-mix` tintu · kvadratići u editoru (`data-be-bcolor`).
> **Nasljeđivanje je besplatno:** blok bez boje ne emitira ništa → uzme `--st-acc` sekcije kroz
> CSS-kaskadu. „⊘" šalje `color: null`, a `_assignPatch` već briše ključ → *odsutno = naslijedi*.
>
> **Dvije zamke uhvaćene u izvedbi:** ① `data-be-color` je **već bio zauzet** (boja teksta u
> plutajućoj traci) → akcent koristi `data-be-bcolor`, inače bi klik gađao krivi rukovatelj.
> ② `JSON.stringify` nad shemom preformatira cijeli fajl (**480 izmjena umjesto 19**) → izmjena
> sheme ide **tekstualno**, nikad kroz reparse.

**Problem.** Tri nepovezana mehanizma: `category.color` (`#rrggbb`), `run.color` (9 tokena), a **blok i
kartica nemaju ništa** — i ne mogu dobiti prešutno, jer je svaka definicija `additionalProperties: false`.

**Zahvat.** `blok.color?` i `kartica.color?` u prostoru **`#rrggbb`** (ugovor boja u
[UGC_SPEC §3](../product/UGC_SPEC.md)); odsutno = **naslijedi**. Renderer emitira **samo** nakon
provjere `^#[0-9a-fA-F]{6}$` — isti obrazac kao validirana širina slike.

**Rizik: NAJVEĆI u fazi i jedina cigla koja dira javni katalog.** Mijenja
`schema/subject-content.schema.json` i `js/blocks-renderer.js` — sigurnosnu granicu i jedini prikazivač
za svih 22 živa predmeta. Zato ide zadnja: kad M1 i M2 stoje, ovo je jedina promjena u letu.

---

### M5 · Duljina kartice — ⬜ **NOV NALAZ (Leon, živi pregled 2026-08-07)**

*„trebat ćemo poradit na ograničenju koliko jedna kartica ima teksta"*

**Izmjereno prije odluke** (5379 kartica u `data/json/`):

| | |
|---|---|
| **pitanja** | **0** prelazi 200 znakova (max 134) → **nisu problem** |
| odgovori > 200 | **2487 = 46,2 %** |
| odgovori > 300 | 928 |
| odgovori > 500 | 48 (max **736**) |

Razliveno je **kroz sve predmete** (food-nutrition 295 · entrepreneurship 254 · microeconomics 196…),
što potvrđuje raniji zapis: **standard je platformski problem, ne Sašin.** Sašin noviji sadržaj
standard *poštuje* (max 198/199) jer ga je dobio kao pravilo; naš stariji EN sadržaj mu prethodi.

**Posljedica za dizajn:** tvrdo ograničenje na 200 **srušilo bi gotovo pola kataloga** → ne dolazi u obzir
retroaktivno. Standard mora **voditi pri pisanju**, ne odbijati postojeće.

**ODLUKA (Leon 2026-08-07): tvrdi strop = 500 znakova.** Uz mekano vođenje na 200.

**⚠️ Strop se NE smije uključiti u shemi odmah.** Preko 500 je **25 jedinstvenih kartica**
(48 s kopijama u `final`): `entrepreneurship` 28 · `traffic` 6 · `food-nutrition` 4 · `sit` 4 ·
`ebusiness` 2 · `math` 2 · `te2` 2. Uključi li se `maxLength: 500` prije nego se srede,
**`validate:schema` postaje crven i CI je blokiran.** Zato dva koraka:

**M5a — vođenje u editoru** *(platforma, nula rizika, ide prvo)*
- brojač uživo u editoru kartice; **upozorenje na 200** (žuto, ne blokira — to je standard)
- **tvrda blokada spremanja na 500** → nijedna NOVA ili uređena kartica više ne može prijeći strop
- vrijedi za **oba svijeta**: javni katalog i osobni materijal, isti modal-editor

**M5b — zatezanje** *(sadržaj, ide poslije)*
- skratiti **25 zatečenih** kartica (detalj → learn, po standardu kartice)
- **tek tada** `maxLength: 500` u `schema/subject-content.schema.json` → strop postaje strojno provediv
- `validate:content` dobiva izvještaj o raspodjeli duljina (brojka, ne gate) da se vidi trend

Redoslijed je bitan: **M5a odmah zaustavlja rast problema**, M5b čisti zatečeno. Obrnuto bi značilo
crven CI ili odgođenu korist.

---

### M4 · Sučelje prestaje obećavati

AI-gumb ([`studio.js:235`](../../js/studio.js#L235)) tvrdi *„kartice, kviz i dopuni nastaju automatski"* —
**treća značajka** koju ne gradimo. Tekst prelazi u ono što ADR-026 kaže da gumb jest (ulaz u spajanje
vlastitog AI-a) i ostaje neaktivan dok MCP ne postoji. Vježbe se ne spominju nigdje (ADR-025 §1).

Sitno; može ići uz M1.
