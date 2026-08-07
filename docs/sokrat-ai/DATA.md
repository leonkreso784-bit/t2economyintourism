# Sokrat AI — Podaci: izvori, porijeklo, cjevovod

> **Cjevovod podataka JE projekt.** ~80% posla i mjesto gdje se odlučuje je li model dobar ili smeće.
> Pouka TinyStories/phi: **čista milijarda >> prljavih pet milijardi.**

## 1. Načelo porijekla (provenance-first)

Ne filtriramo AI-tekst iz interneta (izgubljena bitka — detekcija ne radi pouzdano).
**Hvatamo ljudski tekst na izvoru, s dokazom.** Svaki dokument u korpusu nosi metapodatke:

| Polje | Zašto |
|---|---|
| `izvor` | odakle (repozitorij, časopis, platforma) |
| `autor` | dokaz ljudskog autorstva (⚠️ osobni podatak — v. [LEGAL_GDPR.md](./LEGAL_GDPR.md)) |
| `datum` | pred-2022 = „low-background"; kasnije = provjeriti |
| `licenca` | pravna osnova korištenja — **bez ovoga dokument ne ulazi** |
| `jezik` | hr / en / de / it / fr |
| `tip` | znanstveni rad, diplomski, skripta, enciklopedija, UGC |

**Pravilo:** dokument bez poznate licence i porijekla **ne ulazi u korpus.** Nikad.

## 2. Hrvatski izvori — blago koje već postoji

Hrvatska već ima nacionalnu infrastrukturu upravo takvih podataka. **Ovo mijenja razgovor s dekanom
iz „dajte mi podatke" u „evo što kao država već imamo, evo što radim s tim".**

| Izvor | Što je | Status | Vrijednost |
|---|---|---|---|
| **Hrčak** (hrcak.srce.hr) | Portal hrvatskih znanstvenih časopisa | velik dio **otvoreni pristup** | ⭐⭐⭐ recenzirano, stručno, atribuirano |
| **DABAR** (dabar.srce.hr) | Nacionalni sustav akademskih repozitorija (SRCE) | velik dio **otvoren** | ⭐⭐⭐ diplomski/doktorski radovi **svih** sveučilišta |
| **hrWaC** | Hrvatski web-korpus (akademski) | besplatan, istraživački | ⭐⭐ ~1.4 mlrd tokena, već očišćen |
| **CLASSLA** | Infrastruktura za južnoslavenske jezike | besplatna | ⭐⭐ alati + korpusi + zajednica |
| **Wikipedija (hr)** | Enciklopedija | CC BY-SA | ⭐⭐ čisto, ali pazi na licencu (dijeljenje pod istim uvjetima) |
| **Javna domena** | Starija hrvatska književnost | slobodno | ⭐ malo, ali savršeno „low-background" |
| **Sokrat Study (vlastito)** | 21 predmet, kuriran sadržaj | naše | ⭐⭐⭐ potpuno naše, poznat autor |
| **UGC / MCP (budući)** | Korisnički materijali | uz pristanak | ⭐⭐ raste s platformom |

> ⚠️ **Provjeriti licencu svakog izvora prije preuzimanja.** „Otvoreni pristup" (čitanje) **nije isto**
> što i „dopušteno strojno učenje". Detalji: [LEGAL_GDPR.md](./LEGAL_GDPR.md).

## 3. Redoslijed prikupljanja (od najsigurnijeg prema najosjetljivijem)

1. **Faza 1 — nesporno otvoreno** *(kreni ovdje, bez ikakvih dozvola)*
   Wikipedija · javna domena · hrWaC/CLASSLA (istraživačka uporaba) · vlastiti Sokrat sadržaj
2. **Faza 2 — otvoreni akademski** *(provjeri licencu po zapisu)*
   Hrčak (otvoreni radovi) · otvoreni dio DABAR-a
3. **Faza 3 — institucionalno** *(traži prezentaciju dekanu + pravni okvir)*
   Sveučilišni materijali, profesorske skripte — **samo uz izričit pristanak autora**
4. **Faza 4 — korisnički (UGC)** *(uz pristanak, i samo u retrieval bazu)*

**Nikad ne preskači fazu.** Faza 3 bez pravnog temelja može ubiti cijeli projekt *nakon* godina rada.

## 4. Ciljne količine

Prema Chinchilla pravilu (~20 tokena/parametru):

| Model | Tokena | Izvedivo iz? |
|---|---|---|
| 10M (vježba) | ~200M | Wikipedija hr + vlastito ✅ |
| **50M (cilj)** | **~1B** | hrWaC + Hrčak + DABAR + Wikipedija ✅ |
| 100M+ | 2B+ | traži institucionalni pristup (faza 3) |

**Leonova milijarda tokena nije megalomanija — to je točno uravnotežen broj za model od ~50M.**
I to gorivo **postoji besplatno** na hrvatskom.

## 5. Cjevovod obrade (gdje se odlučuje kvaliteta)

```
preuzimanje → ekstrakcija teksta (PDF/HTML→txt) → normalizacija (Unicode, dijakritika)
   → detekcija jezika → uklanjanje šablona (headeri, navigacija, reference)
   → DEDUPLIKACIJA (near-dup, MinHash) → filtri kvalitete → uklanjanje osobnih podataka
   → metapodaci o porijeklu → tokenizacija → shardovi za trening
```

**Koraci koji najviše nose kvalitetu:**

- **Deduplikacija** — web-korpusi imaju ogromno ponavljanje; duplikati kvare model i troše compute
- **Filtri kvalitete** — izbaci strojni prijevod, spam, generirano, izlomljeni OCR
- **Uklanjanje osobnih podataka** — imena, e-mailovi, OIB, adrese, matični brojevi → **prije** treninga
  (v. [LEGAL_GDPR.md](./LEGAL_GDPR.md) §4)
- **Datumska oznaka** — omogućuje kasniju „pred-2022 vs. poslije" analizu (oklada A)

## 6. Sintetički podaci — gdje smiju, a gdje ne

**Kontradikcija koje moramo biti svjesni:** teza projekta je „nekontaminirani ljudski podaci",
a sinteza podataka pomoću velikog modela je **AI-generirani tekst**.

**Pravilo koje rješava sukob:**

| Namjena | Sintetika dopuštena? |
|---|---|
| **Predtrening** (učenje jezika) | ❌ **NE** — to bi poništilo cijelu tezu oklade A |
| **Fino podešavanje formata zadatka** (npr. „kontekst → sokratsko pitanje") | ✅ da, uz **jasnu oznaku** |
| **Evaluacija / suđenje** | ✅ da |

I uvijek **označeno u metapodacima** (`tip: sintetički`) da se svaki eksperiment može ponoviti
i da se može mjeriti utjecaj sintetike odvojeno.

## 7. Higijena i reproducibilnost

- **Sve verzionirano** — svaki korpus ima verziju; eksperiment bilježi na kojoj je verziji rađen
- **Nikad ne mijenjaj korpus u mjestu** — novi korpus = nova verzija (inače eksperimenti nisu usporedivi)
- **Zapiši statistiku svakog korpusa** — broj dokumenata, tokena, raspodjela izvora/datuma/jezika
- **Sirovi podaci se čuvaju odvojeno od obrađenih** — da se cjevovod može ponovno pokrenuti
- **Podaci se NE commitaju u git** (veliki, i često licencno osjetljivi) — samo skripte, metapodaci i statistika
