# MATURA — pilot (Matematika A)

**Status:** 🗄️ ARHIVIRAN 2026-09-12 — matura je **vizija, ne projekt** ([VISION.md §8](../product/VISION.md)); ovaj dokument je referenca za skicu v1 · **Otvoren:** 2026-09-01 · **Odluke:** Leon, sesija 2026-09-01
**Vezano:** [BACKLOG.md §MATURA SE VRAĆA](../records/BACKLOG.md) · [MONETIZATION.md](../product/MONETIZATION.md) · [DECISIONS.md](../records/DECISIONS.md) (ADR-022 placement · ADR-024 otok+owner-RLS · ADR-031 AI je korisnikov · ADR-033 dvojezičnost)

> **Zašto PAUZIRAN, a ne aktivan:** tekuća faza je **MREŽA**, a `check:docs` traži točno jedan
> aktivni plan. Leon je 2026-09-01 presudio: **„samo spec sad, izvedba se odlučuje kasnije"** —
> ništa iz ovog dokumenta ne konkurira MREŽI niti počinje bez novog izričitog OK-a.

---

## 1 · Što je ovo i zašto postoji

Priprema za državnu maturu na temelju **objavljenih NCVVO ispita**. Besplatno. Vlastita stranica,
izbor predmeta, unutar predmeta ispitni rokovi po godinama.

`BACKLOG.md` je 2026-08-22 ovo parkirao s dva imenovana preduvjeta — **recepti** i **ADR-020
verifier**. Sesija 2026-09-01 je oba preispitala **mjerenjem** i oba su pala, iz različitih razloga
(§3, §5). Zato spec postoji: premisa reza više ne vrijedi. Kalendar je nepromijenjen — vrhunac
korištenja je **2.–5. mjesec**, i to je jedini prirodni rok koji ovaj smjer ima.

---

## 2 · Odluke (Leon, 2026-09-01)

| # | pitanje | odluka |
|---|---|---|
| 1 | Jesu li recepti preduvjet? | **Ne.** Prošli ispit je **fiksan** → čisti podatak, bez `generate()`. Recepti su **v2** (beskonačno vježbanje). |
| 2 | Opseg v1 | **Matematika A, 3 godine × 2 roka.** |
| 3 | Gdje matura živi | **`matura.html`** = vlastita stranica; studij u postojećem `#study-page`. |
| 4 | Model podataka | **`exam` kao treći način smještaja** (uz legacy i `placement[]`). |
| 5 | Exam mode + statistika | **v1 = exam mode + PRIVATNA statistika.** Objava/ljestvica = zaseban dizajn kasnije. |
| 6 | Raspored | **Samo spec sad.** Izvedba se odlučuje nakon MREŽE. |
| 7 | Izolacija cjevovoda | **Susjedni direktorij + vlastiti git repo.** |

### Što svjesno NIJE u v1

- **Hrvatski i engleski** — a s njima i **esej/lektire**. Engine nema tip koji ocjenjuje esej, a
  „engine se ne mijenja za sadržaj" je sveto pravilo. Esej je zaseban dizajn, ne detalj.
- **Recepti / parametrizirane maturalne vježbe** (odluka 1).
- **Objava rezultata i ljestvice** (odluka 5; obrazloženje u §6.3).
- **Naplata.** Presuđeno drugdje i ovdje se ne otvara: `MONETIZATION.md` kaže *„donesi svoj ključ
  PRVO → NULA Stripea/PDV-a za nas"*, a Stripe ionako traži obrt ili d.o.o.

---

## 3 · Model podataka — `exam` os

Maturalni predmeti stoje u **istom `subjects` nizu**, ali nose `exam` umjesto `programId`/`placement[]`:

```js
{
  id: 'matura-matematika-a',
  exam: { ispit: 'matura', predmet: 'matematika', razina: 'A' },
  storageKey: 'matura-mat-a-progress',
  lessons: [ { id: '2024-ljetni', … }, { id: '2024-jesenski', … } ],
  content: { scripts: [ … ], resolve: { '2024-ljetni': 'maturaMatA2024L', … } }
}
```

**Zašto ovo, a ne pseudo-fakultet ni zaseban katalog** — tri mjerenja:

1. **Sloj sadržaja je već institucijski-agnostičan.** `subject_content` je
   `(subject_id, var_name, payload jsonb)`. `content-loader`, `progress`, `admin`, `export:json` i
   `migrate-content` ključe **samo na `subject_id`** → **nula promjena sheme baze**.
2. **Postojeća navigacija ignorira maturu po konstrukciji.** `placementsOf()` vraća `[]` kad nema
   ni `programId` ni `placement[]`, a `subjectsOf()` takav predmet preskoči → **matura ne može
   procuriti u FMTU stablo**. Ne treba filtar; treba ne dodati koordinatu.
3. **Oblik `subject → lessons` je već traženi oblik.** Predmet = *Matematika A*, lekcija = *ispitni
   rok*, isto kao `first-midterm`/`second-midterm`/`final`. Jedan `storageKey` → napredak kroz sve
   godine. Engine, modovi i napredak rade **bez izmjene**.

**Zašto NE zaseban katalog (otok):** presedan `nodes` (ADR-024) ne prenosi. Ondje je otok jer je
riječ o **korisničkom vlasničkom podatku s owner-RLS** — drugi sigurnosni model. Maturalni sadržaj
je **naš i javno čitljiv**, isti model kao katalog. Otok bi tražio dupliciranje šest potrošača.

**Cijena:** `verify-catalog.js` §3 s dual- na **tri-mode** · ograničiti `content-repo.all()` da
matura ne curi u S1 šav · **novi ADR**.

**Ispit je LEKCIJA, ne „vježba"** → ide u bazu. `export-content-json.js:11` isključuje vježbe jer
*„sadrže `generate()` koje JSON briše (BUG-012)"*; maturalni zadaci ih nemaju (odluka 1), dakle
serijalizabilni su. Time je ispunjeno Leonovo *„nakrcat u bazu"*.

---

## 4 · Mjesto i granice

| površina | uloga | dodiruje li redizajn |
|---|---|---|
| **`matura.html`** (novo) | landing + kućice predmeta + godine unutar kućice | ❌ nova ploha, vlastiti `css/matura.css` |
| **`index.html`** | studij: 5 modova + **exam mode**, kroz `#study-page` | ➕ **samo aditivno**: ruta + jedan link. **Nula izmjena na `#landing-page`** |
| **baza / engine / napredak / admin** | — | ❌ nedirnuti |

**Zašto prava stranica, a ne hash-ruta:** hash nije zaseban URL za tražilicu. `MONETIZATION.md`
izrijekom računa na SEO (*„killer feature + SEO"*), pa `matura.html` dobiva vlastiti `<title>`,
`og:image` i redak u `sitemap.xml` — sve mjerivo kroz `check:seo`.

**Zašto NE sve u `matura.html`:** duplicirao bi ruter, auth, i18n, SW, content-loader i engine.

**Obveze:** sučelje dvojezično kroz `js/i18n.js` (**ADR-033** — jezik sučelja ne dira predmete, pa
sadržaj ostaje hrvatski) · slijedi obrazac statičnih stranica (`css/tokens.static.css` postoji
upravo za stranice bez bundlea).

---

## 5 · Cjevovod unosa — zaseban repozitorij

### 5.1 Izmjereno 2026-09-01 (pravi ispit: MAT A, 2024./2025., 1. rok)

Nabava radi: `MATA25prvi_b.zip` (15 MB) sadrži **`MAT A D-S072.pdf`** (ispit), **`Kljuc za
odgovore.pdf`** (ključ) i **`MAT A_Bodovanje_….pdf`** (bodovanje + postupci). Arhiva ide do
**2020./2021.**, dva roka godišnje → **~11 rokova dostupno** (v1 traži 6).

| kanal | rezultat |
|---|---|
| **Ključ za MC (1–20)** | ✅ savršen, strojno čitljiv (`1. B`, `2. C` …) |
| **Riječ-problemi kroz `pdf-text.js`** | ✅ doslovno upotrebljivi |
| **Formule kroz `pdf-text.js`** | ❌ **razmrvljene** — `g x x x ( ) = − − ( ) + ( ) 2 3 5` |
| **Grafovi kao odgovori (zad. 9)** | ❌ opcije prazne — grafovi su slike, tekst ih ne vidi |
| **Render (pdfjs-dist + Playwright) + vid** | ✅ **sve gore točno**: `g(x) = −2(x−3)(x+5)`, tablice, četiri grafa čitljiva |

**Posljedica:** glavni kanal je **render + vid**, ne ekstrakcija teksta. Renderiranje traži **nula
novih ovisnosti** — `pdfjs-dist@5.4.296` i Playwright već postoje. (ImageMagick otpada: traži
Ghostscript kojeg nema.)

**Ispravak ranijih brojki:** **~40 zadataka po roku** (20 MC + 19 kratkih + produženi), ne ~30 →
v1 je **~240 zadataka, ne 180**.

### 5.2 Tro-strana provjera

`BACKLOG` traži da ADR-020 dođe **prije** mature: *„krivi ključ u pripremi za državnu maturu je
šteta"*. Ovdje se to izvodi **mehanički**, jer je ključ objavljen — ne treba Opusova prosudba:

| što se provjerava | kanal 1 | kanal 2 |
|---|---|---|
| **tekst pitanja** | `pdf-text.js` | vid nad renderom |
| **točan odgovor** | naš izvedeni | `Kljuc za odgovore.pdf` |
| **postupak** | — | `Bodovanje….pdf` → `solution[]` |

Neslaganje = **zastavica za čovjeka**, nikad tiho preuzimanje. 20 od ~40 zadataka time je
provjereno **bez ijedne prosudbe**.

⚠️ Ovo je nastalo iz ispravka: dvo-prolazni ključ provjerava **odgovor, ne pitanje** — krivo
rekonstruirana formula dala bi zadatak koji pita drugo, a čiji se „točan" odgovor i dalje slaže s
ključem, pa bi brana pokazala **zeleno**. To je BUG-024/025 ponovno. Drugi kanal za *pitanje*
zatvara rupu.

**Besplatna dobit:** engine već ima `walkthrough` mod (`solution[]` korak po korak) → službeni
postupci iz `Bodovanje` daju „objašnjenja" **bez novog koda**.

### 5.3 Izolacija — generator ≠ integrator

Cjevovod živi u **susjednom direktoriju s vlastitim gitom i vlastitim `package.json`**. Nema put
pisanja u repozitorij: ne „pazimo", nego **ne može** — drugo stablo, upisi ograničeni na `out/`.

```
matura-pipeline/
  _materials/   ncvvo zipovi     src/  01-fetch → 02-render → 03-extract → 04-read (AI)
  out/          JEDINI izlaz           → 05-key → 06-crop → 07-reconcile → 08-emit
  report/       po roku: prošlo / označeno / DOTAKNUTO
```

| jamstvo | kako |
|---|---|
| ne dira ovisnosti projekta | vlastiti lockfile → `check:lockfile` i pravilo #9 netaknuti |
| ne ruši nijednu branu | datoteke nisu u stablu → `check:i18n` / `orphan-css` / `budget` / `docs` ih ne vide |
| ne sudara se s MREŽOM | drugi direktorij → nema `checkout` pod rukom, nema sudara na `bump` |
| iz projekta čita samo `schema/*.json` | jednosmjerno, read-only, za validaciju izlaza |

Cjevovod ne zna za `main`, `bump`, deploy ni Supabase. **Uvoz u projekt je izričit, ručno pokrenut korak.**

**AI korak (04)** ide na **naš** Sonnet ključ iz `.env`, kao `translate-subject.js` danas. Ne kosi
se s ADR-031 (*„AI je KORISNIKOV"*) — taj govori o **proizvodu**; ovo je **alat za autorstvo**.

⚠️ **Izvještaj mora ispisati i koliko je zadataka DOTAKNUO**, ne samo koliko je prošlo. Povod:
mjerač je u fazi redizajna bio prvi kvar **12×** i dvaput vratio uvjerljiv krivi broj umjesto da padne.

---

## 6 · Exam mode i statistika

### 6.1 Exam mode

Mješoviti ispit: MC + kratki odgovor + zadaci, **bez kartica**, ocjena na kraju. Nije dodatak nego
**najautentičniji oblik** — maturalni ispit *jest* mješovit skup, pa je za maturu exam mode
primarni mod, a kartice i learn pomoćni.

### 6.2 `exam_attempts` — zašto NOVA tablica

Postojeći napredak se **ne može** iskoristiti. `js/cloud-sync.js` spaja *„brojevi → **max**, polja
stringova → **unija**"*, i to namjerno — *„čuvaju napredak, nikad ne brišu naučeno"*. Ispitni
rezultat je suprotan oblik podatka: 80 % pa 40 % dalo bi **80 %**. **Sustav strukturno ne može
zabilježiti da je išlo lošije** — a to je pola tražene statistike.

→ **append-only** zapisi (pokušaj, vrijeme, trajanje, po-zadatku točno/netočno), **owner-RLS**,
upis kroz **`SECURITY DEFINER` RPC** — obrazac koji ADR-024 već propisuje.

**Nusprodukt:** `css/progress-section.css:158` bilježi da su `.history-item*` **namjerno mrtva**
(`#historyList` nitko ne puni), a `CLAUDE.md` da *„povijest učenja OSTAJE, ali plitko"*. Ispitni
pokušaji su točno ono što tu rupu popunjava — **mrtva UI oživi bez novog dizajna**.

### 6.3 Zašto objava NIJE u v1

Dva tvrda problema, oba stvarna:

- **Ocjenjivanje je u pregledniku.** `numEq`, `gradeSet`, `gradeCite` su čiste funkcije u klijentu,
  a odgovori se šalju korisniku jer ih `practice` mod treba. Objavljen rezultat je dakle
  **samo-prijavljen i trivijalno se falsificira**. Popravak = ocjenjivanje u Edge Function +
  ispitni payload **bez odgovora**; to je zaseban podsustav, ne postavka.
- **Korisnici su maturanti, velik dio maloljetan.** Natjecateljska objava izvedbe traži minimalno:
  opt-in ugašen po zadanom, **pseudonim a ne ime**, brisanje na zahtjev, dopunu `privacy.html`.

Privatna statistika daje ~90 % vrijednosti uz ~30 % cijene i nula te površine.

---

## 7 · Brane i testovi (ADR-027: rub koji prepoznaš isti čas dobiva test)

| brana | što tvrdi |
|---|---|
| `verify` (prošireno) | tri-mode smještaj: legacy XOR `placement[]` XOR `exam` — nikad dva, nikad nijedan |
| **`check:matura`** (novo) | **nijedan zadatak bez odgovora potvrđenog protiv `Kljuc za odgovore.pdf`**; nepotvrđeni moraju biti izrijekom označeni |
| `validate:schema` | maturalni zadatak zadovoljava kanonski oblik |
| KaTeX gate | **nikad goli `$`** (valutni `$NN`) — vrijedi i za rekonstruirane formule |
| `check:seo` | `matura.html` u sitemapu, `og:image` 1200×630, jedan tekst u `<title>`/`og:` |
| `check:i18n` | nula zakucanog teksta na `matura.html` |
| `check:contrast` + phone gate | `matura.html` je mjerena površina kao i svaka druga |
| test (novo) | ocjenjivanje exam moda — jedinični; `exam_attempts` RLS — tuđi red nedostupan (obrazac `test:storage`) |

---

## 8 · Cigle

| # | cigla | strana |
|---|---|---|
| **M0** | kostur cjevovoda + **mjerenje jednog roka** (koliko čisto, koliko traži sliku, koliko dotaknuto) | pipeline |
| **M1** | parser ključa + `07-reconcile` (tro-strana) | pipeline |
| **M2** | `04-read` — vid → strukturirani zadaci | pipeline |
| **M3** | `06-crop` — grafovi → slike | pipeline |
| **M4** | `08-emit` + validacija protiv `schema/*.json` | pipeline |
| **M5** | `exam` os u katalogu + `verify` tri-mode + ADR | projekt |
| **M6** | `matura.html` — landing + izbor predmeta/godina | projekt |
| **M7** | exam mode u `#study-page` | projekt |
| **M8** | `exam_attempts` + RLS + RPC + povijest u UI | projekt |
| **M9** | sadržaj: 6 rokova kroz cjevovod + triaža označenih | sadržaj |
| **M10** | brane, testovi, SEO, i18n, telefon | projekt |

**M0–M4 ne diraju projekt uopće** (zaseban repozitorij, §5.3) → **tehnički** mogu teći usporedo s
MREŽOM, bez sudara na `bump`, granama ili branama. To je tvrdnja o **izvedivosti, ne dopuštenje**:
ni jedna cigla ne počinje bez Leonova izričitog OK-a (odluka 6). **M5–M10 čekaju kraj MREŽE.**

---

## 9 · Otvoreno

- ⛔ **BLOKATOR — pravno.** Na stranici roka 2024./2025. stoji naznaka **„isključivo besplatno u
  cilju kvalitetnije pripreme"**, ali **doslovan tekst nije potvrđen**: na stranici 2023./2024. ga
  nema, a u ispitnom katalogu (28 str., grepano `autorsk` / `umnožav` / `dopušt` / `zabranj`) ga
  nema uopće. **Naznaka je povoljna, ali nije utvrđeno pokriva li objavu na tuđoj platformi.**
  Provjeru vodi čovjek. **Blokira M9 (unos), ne blokira M0–M8.**
- **Razine hrvatskoga** — provjeriti protiv aktualnog ispitnog kataloga prije nego hrvatski uđe u
  opseg; ako ima dvije razine, sadržajni posao raste za cijelu razinu.
- **Sezona 2027** — ako ikad postane cilj, v1 mora biti živ prije **2. mjeseca**. Danas nije cilj.

---

## 10 · Izlazni uvjet

**Gotovo kad učenik može:** otvoriti `matura.html`, izabrati *Matematika A → Ljetni rok 2024*,
riješiti **cijeli ispit u exam modu**, dobiti ocjenu s objašnjenjima iz službenog bodovanja, i
vidjeti **vlastitu povijest pokušaja kroz sve rokove** — pri čemu je svaki odgovor u sustavu
**potvrđen protiv objavljenog NCVVO ključa**.
