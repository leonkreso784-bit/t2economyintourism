# Sokrat AI — vlastiti jezični model od nule

> **Status:** 🌱 istraživačka faza (zapis razgovora 2026-07-24) · **Rok za prezentaciju dekanu: 10. mjesec 2026.**
> ⚠️ **ODNOS PREMA SOKRAT STUDY (Leonova izričita odluka 2026-07-24):**
> **Sokrat AI se NE implementira na platformu Sokrat Study i nema veze s njom — to je potpuno ZASEBAN projekt.**
> Ovdje živi samo zato što je zapis nastao u ovom repozitoriju. Platforma ide svojim tempom
> (`docs/EDITOR_PLAN.md`) i **ni na koji način ne ovisi o ovome**. Model se ne ugrađuje u platformu.
> (Sokrat Study se pred dekanom smije *spomenuti* kao dokaz da Leon isporučuje — ali to je sve.)

## Što je ovo

Izgradnja **vlastitog jezičnog modela (LLM) od nule** — vlastita arhitektura, tokenizer, podaci, trening-petlja
i evaluacija — s naglaskom na **hrvatski jezik** i na **podatke dokazano ljudskog porijekla**.

Nije cilj konkurirati frontier modelima (Claude/GPT/Grok). Cilj je **doprinos na mjestu gdje veliki ne gledaju**:
mali modeli, kvaliteta i porijeklo podataka, morfološki bogati jezici, i arhitektura „model = vještina, baza = znanje".

**Vlasnik/istraživač:** Leon Kreso · **Institucija (cilj):** FMTU Opatija / Sveučilište u Rijeci.

## Datoteke

| Dokument | Svrha |
|----------|-------|
| [VISION.md](VISION.md) | **Zašto** — teza o nekontaminiranim ljudskim podacima, pozicioniranje, u čemu je naša prednost |
| [RESEARCH.md](RESEARCH.md) | **Što istražujemo i kako** — 4 oklade (A–D), jeftina metodologija testiranja, tehnička arhitektura |
| [DATA.md](DATA.md) | **Gorivo** — izvori (DABAR, Hrčak, hrWaC, Wikipedia), strategija porijekla, cjevovod podataka |
| [LEGAL_GDPR.md](LEGAL_GDPR.md) | **Pravni temelj** — GDPR, autorsko pravo, TDM iznimka, pristanak; ⚠️ *nije pravni savjet* |
| [DEAN_PITCH.md](DEAN_PITCH.md) | **Prezentacija dekanu (10. mj.)** — što tražimo, što nudimo, plan do roka |

## Temeljne odluke (donesene u razgovoru 2026-07-24)

1. **PyTorch je dopušten** za tenzore, autograd i GPU. Sve iznad toga (arhitektura, tokenizer, podaci,
   trening-petlja, evaluacija) pišemo sami. To je ono što „od nule" znači u praksi — nitko ne prepisuje CUDA kernele.
2. **Lokalno prije svega.** Model mora raditi na Leonovom laptopu (CPU inference), i tek onda u pregledniku.
   Treniranje ide na **iznajmljenom GPU-u** (jednokratno, jeftino); pokretanje je zauvijek besplatno.
3. **Model = vještina, baza = znanje.** Znanje NE ide u težine modela nego u bazu iz koje model čita (retrieval).
   Ovo nije samo arhitektura — to je i **GDPR-štit** (v. LEGAL_GDPR.md) i ono što mali model čini izvedivim.
4. **Hrvatski prvi, ostali jezici kasnije.** Ne iz skromnosti nego iz strategije: uskost je naša prednost.
   Višejezičnost (EN/DE/IT/FR) dolazi kao **znanstveni eksperiment** o morfološkoj složenosti, ne kao širenje opsega.
5. **Mali modeli = laboratorij, ne mala ambicija.** Run od 3 sata i 5 € znači 200 eksperimenata godišnje.
   To je infrastruktura koja višegodišnje istraživanje uopće čini mogućim.
6. **Korisnički materijali (UGC/MCP) idu u bazu znanja, NIKAD u težine.** Nepovjerljiv ulaz, izbrisiv, citiran.

## Gruba putanja do 10. mjeseca

| Faza | Kada | Cilj |
|------|------|------|
| **0 — Temelji** | 8. mj | Razumijevanje + cjevovod: tokenizer (BPE na hrvatskom), sićušni modeli na CPU/besplatnom GPU-u, prvi eksperimenti |
| **1 — Podaci** | 8.–9. mj | Prikupljanje i čišćenje **otvoreno licenciranih** hrvatskih izvora (Hrčak, otvoreni DABAR, Wikipedija, hrWaC) |
| **2 — Prvi pravi model** | 9. mj | Jedan iznajmljen GPU-run: mali hrvatski model (~20–50M) koji radi **lokalno** |
| **3 — Demo + pitch** | 9.–10. mj | **Samostalan** demo (laptop + preglednik, izvan platforme) + prezentacijski materijali + pravni okvir |

> **Načelo:** pred dekana se ne ide s idejom nego s **radećom stvari koja se može pokazati uživo.**

## Pravila rada (ista disciplina kao Sokrat Study)

- **Sve ide u dokumentaciju** — eksperiment koji nije zapisan nije se dogodio.
- **Jedna promjena po eksperimentu** (ablacije), fiksiran seed/podaci/compute — inače nemamo znanost nego dojam.
- **Većina oklada propada** — to je normalno. Pobjeđuje brzina petlje i broj pokušaja, ne genijalnost jedne ideje.
- **Pravni temelj prije podataka** — nikad ne skupljaj ono za što nemaš osnovu (v. LEGAL_GDPR.md).
