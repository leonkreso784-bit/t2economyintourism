# Sokrat AI — Vizija i teza

> Zašto ovaj projekt uopće ima smisla kad postoje Anthropic, OpenAI i xAI.

## 1. Realnost tržišta (bez zavaravanja)

Frontier modeli (Claude, GPT, Grok) traže **stotine milijuna dolara i tisuće GPU-a**. Taj teren je zatvoren
i nema smisla se pretvarati da nije.

**Ali revolucija se ne dobiva veličinom.** Pogledaj tko je stvarno promijenio polje:

| Doprinos | Tko | Utjecaj |
|---|---|---|
| **Flash Attention** | Tri Dao (doktorand) | Koristi ga danas praktički svaki model |
| **LoRA** | mali tim | Cijela industrija fine-tuninga stoji na tome |
| **RWKV** | Bo Peng, uglavnom sam, kroz godine | Ozbiljna ne-transformer alternativa |
| **TinyStories** | 2 istraživača | Dokaz da model od ~10–30M može biti koherentan |

Nitko od njih nije imao Googleov compute. Imali su **konkretno pitanje** i **upornost**.
Veliki labovi su prezauzeti skaliranjem da bi gledali u male, čudne kutove — **to je naš teren.**

## 2. Glavna teza: nekontaminirani ljudski podaci

**Zapažanje (Leon, 2026-07-24):** velik dio današnjeg interneta je AI-generiran. Modeli se sve više
treniraju na izlazu drugih modela.

**Znanost koja to potvrđuje:**

- **„Model collapse"** (Shumailov i sur., *Nature*, 2024): kad se modeli rekurzivno treniraju na
  generiranom sadržaju, **repovi distribucije nestaju** — gubi se rijetko, neobično i kreativno.
  Model postaje sve prosječniji dok ne kolabira.
- **Analogija „low-background steel":** čelik izliven **prije nuklearnih proba 1945.** jedini je
  nekontaminiran radionuklidima i vadi se iz potopljenih brodova za osjetljive instrumente.
  **Tekst nastao prije ~2022. je isto to** — u polju se koristi izraz *„low-background tokens"*.
  Nekontaminiran ljudski jezik postaje **iscrpiv resurs.**

### Ključni preokret

Filtriranje AI-teksta s interneta je **izgubljena bitka** — detekcija AI sadržaja ne radi pouzdano
i vjerojatno nikad neće.

> **Zato ne filtriramo ljudske podatke IZ interneta.**
> **Hvatamo ih NA IZVORU, s dokazivim porijeklom.**

## 3. Naša stvarna prednost (ono što se ne može kupiti)

Model može svatko istrenirati. GPU se iznajmi. **Podaci s dokazanim ljudskim porijeklom ne mogu se kupiti** —
nastaju iz **odnosa i institucije**.

Što imamo, a veliki labovi nemaju:

| Prednost | Zašto je nedostupna drugima |
|---|---|
| **Sveučilište** (FMTU / Rijeka, cilj: šire) | Skripte, radovi, predavanja — **poznat autor, datum, kontekst** |
| **Sokrat Study + UGC/MCP** | Stroj koji **već hvata** ljudski sadržaj s poznatim autorstvom |
| **Hrvatski jezik** | Znatno manje kontaminiran — AI generira neusporedivo manje hrvatskog |
| **Studenti** | Svaki krivi odgovor na kvizu je **ljudski signal** koji nitko drugi nema |
| **Izvorno znanje jezika** | Morfologija hrvatskog se ne razumije iz statistike nego iz govornika |

**Ovo je jedina vrsta prednosti koja se ne skalira novcem.** Anthropic ima 10 000 GPU-a,
ali nema odnos s hrvatskim sveučilištima.

## 4. Pozicioniranje: uskost je strategija, ne skromnost

> **Ambicija bez granica = ispravno. Opseg bez granica na početku = smrt projekta.**

U trenutku kad krenemo na 5 jezika odjednom, prestajemo biti *„jedini koji je ovo napravio za hrvatski"*
i postajemo *„još jedan mali višejezični model"* — utrka protiv ljudi s 1000× više resursa.

**Zato:** hrvatski prvi, savršeno. Pa engleski. Pa ostali — i to **kao znanstveni eksperiment**,
ne kao širenje opsega (v. [RESEARCH.md](./RESEARCH.md), oklada B).

Analogija: Facebook je krenuo s **jednim** sveučilištem. Amazon **samo** s knjigama.
Neograničena ambicija, brutalno ograničen prvi korak.

## 5. Arhitektonska teza: model = vještina, baza = znanje

Današnji modeli pamte sve u težinama: skupo, zastarjelo, nemoguće izbrisati, halucinira.

Naša podjela:

```
🧠 MODEL (od nule, malen, lokalan)     →  jezik + vještina (npr. sokratsko pitanje)
📚 BAZA ZNANJA (UGC / MCP / retrieval) →  činjenice: svježe, izbrisive, citirane
```

**Posljedice:**

1. **Prestaje utrka u veličini** — ne treba 7B da znaš sve; treba 30M koji dobro pita i baza koja pamti.
2. **GDPR-štit** — ono što je u bazi može se **obrisati**; ono što uđe u težine **ne može** (v. [LEGAL_GDPR.md](./LEGAL_GDPR.md)).
3. **Znanje je uvijek svježe** — nema ponovnog treniranja pri svakom novom materijalu.
4. **Provjerljivost** — model citira izvor, pa se halucinacija vidi.

## 6. Vizija ishoda

**Kratkoročno (10. mj 2026.):** malen hrvatski model, treniran na dokazano ljudskim, otvoreno licenciranim
podacima, koji **radi na laptopu i u pregledniku** — pokazan uživo dekanu.

**Srednjoročno:** institucionalno partnerstvo → pristup akademskim materijalima → prvi ozbiljan
**hrvatski nekontaminirani jezični resurs** (korpus + tokenizer + model), otvoren za akademsku zajednicu.

**Dugoročno:** Hrvatska i njeno sveučilište kao **sudionik ove tehnološke smjene, a ne samo potrošač.**
Proširenje na druge jezike i traženje financiranja (EU/nacionalno) kad postoji dokazan rezultat.

## 7. Iskrene granice (da se kasnije ne razočaramo)

- **Ovo neće biti ChatGPT.** Malen model neće voditi razgovor o svemu niti znati činjenice o svijetu.
- **„Wow" je u kontrastu**, ne u apsolutnoj pameti: *„ovo je 30M parametara, košta 0 € po upitu,
  radi offline u pregledniku, i napisao sam ga od nule."*
- **Većina istraživačkih oklada propada.** To je definicija istraživanja, ne neuspjeh.
- **Ovo je maraton** — mjeseci do prvog rezultata, godine do doprinosa.
