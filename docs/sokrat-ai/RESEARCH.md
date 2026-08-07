# Sokrat AI — Istraživanje: oklade, metodologija, arhitektura

> Istraživanje ne pokreće ambicija nego **konkretno nezadovoljstvo**.
> Ambicija te dovede do stola; pitanje te drži tamo tri godine.

## 1. Četiri oklade (Leonova odluka 2026-07-24: uzeti nešto iz svake)

### 🅰️ Nekontaminirani model — **primarna oklada**

**Pitanje:** što se dogodi s modelom treniranim **isključivo** na tekstu s dokazanim ljudskim porijeklom?

- Korpus: pred-2022 + akademski (poznat autor/datum) + vlastiti UGC s potpisom autora
- Tvrdnja koju nitko drugi ne može izreći: *„ovaj model nikad nije pojeo AI izlaz."*
- **Mjerljivo:** kolabira li raznolikost sporije? Jesu li repovi distribucije bogatiji?
  Usporedba s kontrolnim modelom treniranim na miješanom (kontaminiranom) korpusu.
- **Zašto je jaka:** znanstveno provjerljiva + medijski/institucionalno razumljiva + naslanja se na
  prednost koju imamo (v. [VISION.md](./VISION.md) §3).

### 🅱️ Morfološki-nativna arhitektura

**Pitanje:** je li tokenizacija hack koji posebno šteti flektivnim jezicima?

- Hrvatski se na BPE tokenizeru lomi besmisleno (padeži, dijakritika, tvorba riječi) — troši 2–3× više tokena
- Živa struja istraživanja pokušava **ukinuti tokenizaciju** (ByT5, MegaByte, byte-level pristupi),
  ali **nitko to nije ozbiljno napao za morfološki bogate jezike**
- **Hipoteza:** morfološki svjesne jedinice → **radikalno veća podatkovna učinkovitost** za slavenske jezike
- **Ovdje ulazi višejezičnost kao ZNANOST, ne kao širenje opsega:**

  | Jezik | Morfološka složenost | Uloga u eksperimentu |
  |---|---|---|
  | hrvatski | vrlo visoka (flektivan) | primarni slučaj |
  | njemački | visoka (složenice, padeži) | srednja točka |
  | talijanski / francuski | srednja | srednja točka |
  | engleski | niska (analitički) | kontrolna točka |

  **Pitanje postaje:** *kako se podatkovna učinkovitost mijenja s morfološkom složenošću jezika?*
  To je pravo istraživačko pitanje — a ne „želim više jezika".

### 🅲 Kurikulum — učiti model kao dijete

**Pitanje:** zašto svi treniraju na **nasumično promiješanim** podacima?

- Nitko ne trenira redoslijedom **kojim se uči**
- Mi imamo **pravi kurikulum**: 1. godina → 2. godina, kolokvij 1 → 2 → ispit; jednostavno → složeno
- **Hipoteza:** uređen kurikulum daje bolji model iz **manje** podataka
- Leonova formulacija: *„prvo da hoda, onda da priča, onda da trči"* — i to vrijedi i za **redoslijed
  eksperimenata** (v. §2: ljestve skaliranja) i za **redoslijed podataka**

### 🅳 Mozak vs. knjižnica — dokle ide?

**Pitanje:** koliko **sićušan** model može biti ako je dohvat (retrieval) savršen?

- Gdje je granica na kojoj model prestaje trebati znanje u težinama jer ga uvijek može pogledati?
- Leonova odluka: **nema unaprijed postavljene granice** — guramo dokle možemo, pa tražimo
  financiranje/partnerstvo za nastavak

---

## 2. Jeftina metodologija testiranja (srce projekta)

> Cilj: **200 eksperimenata godišnje**, ne 3. Brzina petlje > genijalnost jedne ideje.

### ① Ljestve skaliranja — najvažnija tehnika

Ne treniraj jedan model. Treniraj **ljestvicu sićušnih**: 1M → 3M → 10M → 30M parametara.
Mjeri loss, **fitaj krivulju, predvidi** ponašanje na 500M — **bez da ga ikad istreniraš**.

Tako je nastao **Chinchilla** (pravilo ~20 tokena po parametru) i tako veliki labovi *odlučuju* što graditi.
**Ovo je najmoćniji alat siromašnog istraživača** — daje pravo na tvrdnje o velikim modelima iz jeftinih pokusa.

| Model | Optimalno tokena (Chinchilla ~20×) |
|---|---|
| 25M | ~500M |
| **50M** | **~1B** ← naša ciljna skala |
| 100M | ~2B |

### ② Prijenos hiperparametara (μP / μTransfer)

Postoji matematika po kojoj hiperparametri podešeni na **malom** modelu vrijede i za **veliki**.
Podesi jeftino → primijeni skupo. Štedi ogroman broj skupih runova.

### ③ Sintetičke sonde s poznatim odgovorom

Umjesto neizmjerljivog „je li model dobar?", testiraj zadatke gdje **znamo točan odgovor**:
kopiranje, aritmetika, dohvat iz konteksta, **slaganje padeža i roda** (idealno za hrvatski).
Sićušan model → **trenutan, jasan signal**.

### ④ Ablacije — srce eksperimentalne znanosti

Mijenjaj **jednu** stvar; sve ostalo zaključano (isti seed, isti podaci, isti compute).
Bez toga nemamo znanost nego dojam. **Besplatno — samo disciplina.**

### ⑤ LLM-kao-sudac

Jeftin/jak model ocjenjuje izlaze našeg modela na tisućama primjera.
Kalibrira se na ~100 ručnih ocjena, pa se pusti na 10 000.

### ⑥ Speedrun-okvir

Fiksiraj cilj (npr. „loss 3.0") i natječi se **koliko brzo/jeftino** ga dosegneš.
Savršen okvir za usporedbu arhitektonskih ideja.

### ⑦ Agenti u istraživačkoj petlji

Agenti mogu: čistiti i deduplicirati korpus, **pokretati sweepove**, čitati logove i javljati anomalije,
pisati eval-harnese, raditi pregled literature.
**Solo istraživač s dobrim agentskim petljama radi kao mali tim.**

---

## 3. Tehnička arhitektura

### Što pišemo sami, a što ne

| Sloj | Tko | Obrazloženje |
|---|---|---|
| Tenzori, autograd, GPU kerneli | **PyTorch** | Nitko ne prepisuje CUDA; ni nanoGPT ne prepisuje |
| **Arhitektura** (attention/MLP/norm) | **mi** | Ovdje živi originalnost |
| **Tokenizer** (BPE na hrvatskom) | **mi** | Nije vježba — postojeći tokenizeri su loši za hrvatski |
| **Cjevovod podataka** | **mi** | ~80% projekta; ovdje se odlučuje kvaliteta |
| **Trening-petlja, optimizator** | **mi** | Razumijevanje + mjesto za eksperimente |
| **Evaluacija** | **mi** | Bez vlastite evaluacije nema istraživanja |

> Vlastiti autograd je **dodatna vježba za razumijevanje**, ne uvjet poštenja. Odbačen kao obavezan
> (usporio bi skupe runove); može se napraviti odvojeno kao edukativni modul.

### Gdje model živi

```
TRENIRANJE  →  iznajmljen GPU (jednokratno, ~10–20 € po runu)
POKRETANJE  →  Leonov laptop (CPU, kvantizirano) — besplatno, offline, zauvijek
            →  preglednik (WebGPU/wasm) — SAMOSTALNA demo-stranica (NE unutar platforme)
```

**Ključna razlika koju ljudi miješaju:** treniranje traži GPU; **pokretanje malog modela ne traži ništa.**

### Sustav u cjelini

```
Leonov laptop (offline, besplatno)
   ├── 🧠 Sokrat AI  ~20–50M, vlastit, od nule  →  jezik + sokratska vještina
   └── 📚 baza znanja  ← UGC / MCP: gradivo + korisnički materijali
                          (trenutno ažurno, izbrisivo, citira izvor, NEPOVJERLJIV ulaz)

isti model → kvantiziran → 🌐 preglednik na sokratstudy.com
```

⚠️ **Sigurnosno pravilo:** korisnički materijali su **nepovjerljiv ulaz** (prompt injection, trovanje sadržaja).
Idu u **retrieval, nikad u težine**, i uvijek se tretiraju kao nepouzdani.
Isti instinkt kao ADR-018 u glavnom projektu („student uploada PODATKE, nikad KOD").

---

## 4. Prvi konkretni eksperimenti (redoslijed)

1. **Tokenizer-usporedba** (najjeftiniji, najbrži rezultat): koliko tokena troši isti hrvatski tekst
   kroz GPT-2 BPE vs. naš BPE treniran na hrvatskom? → **mjerljiv rezultat u jednom danu**, i odmah
   je materijal za dekana.
2. **Ljestvica sićušnih modela** na malom čistom hrvatskom uzorku → prva krivulja skaliranja.
3. **Sonde za padeže/rod** → mjerimo razumije li model hrvatsku morfologiju.
4. **Kontaminirano vs. nekontaminirano** (oklada A) — kontrolna usporedba na istoj skali.
