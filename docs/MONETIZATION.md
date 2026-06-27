# MONETIZATION.md — naplata, tržište, scenariji (hipotetski)

> Živi strateški dokument (sažeto iz razgovora 2026-06-27). Brojevi su **hipoteze s pretpostavkama**, ne
> predviđanja. Povezano: [VISION.md](VISION.md) §Monetizacija/§Gating, [ROADMAP.md](ROADMAP.md), [PRD.md](PRD.md).
> **Status: planiranje** — naplata nije implementirana; AI tutor (F1/F6) još nije izgrađen.

## Pravno / setup (Stripe, djelatnost, firma)
- **Stripe traži poslovni subjekt** (obrt ili d.o.o.): naziv+OIB+adresa+MBS, opis djelatnosti, IBAN (isplate),
  identitet vlasnika, PDV status, **živa web-stranica s cijenama + Terms/Privacy/Refund/Kontakt** (✅ već imamo legal stranice).
- **Djelatnosti (NKD, sve „slobodne" — bez licence):** glavne **62.01 Računalno programiranje** + **63.12 Internetski portali**;
  korisne **85.59 Ostalo obrazovanje d.n.**, **58.29 Izdavanje ostalog softvera**, **63.11 Obrada podataka/hosting**; (reklame: **73.12**).
  d.o.o. općenito smije nereguliranu djelatnost; obrt mora upisati kodove. Točan naziv potvrđuje knjigovođa/bilježnik (NKD 2007→2025).
- **Firma tate (Waterfront, Omišalj, Bojan Kreso):** moguće raditi pod njom AKO (1) djelatnost pokriva softver/portal/edukaciju
  (provjeri u **sudreg.pravosudje.hr**), (2) prihod/PDV/računi idu pod njegov OIB i njegov knjigovođa to vodi, (3) on pristane.
  Alternativa: **vlastiti paušalni obrt**. ⚠️ Nisam istraživao privatnu firmu — provjeriti u registru / kod knjigovođe.
- **PDV (najveća komplikacija):** prodaja digitalne usluge građanima EU → OSS/PDV po zemlji kupca. Olakšica:
  **Merchant-of-Record (Lemon Squeezy / Paddle)** = oni su prodavač, oni rješavaju EU PDV i račune. Preporuka za solo/studenta.
- **Redoslijed:** **F6 „donesi svoj ključ" PRVO** (korisnik plaća svoj AI → NULA Stripea/PDV-a za nas), Stripe/MoR tek kad se naplaćuju jedinice/pretplata.

## Tržište — matura (HR)
- Državnoj maturi: **~30.000–40.000 pristupnika/god**; platežno (gimnazije + ambiciozni strukovci, 3.–4. razred) **~20–25.000** u sezoni.
- **Roditelji plaćaju** (kao instrukcije 15–20 €/h); tržište **sezonsko** (vrhunac sij–svi). Red veličine veće od FMTU niše.

## Modeli naplate
| Model | Napomena |
|---|---|
| Freemium pretplata | standard edtech |
| **Sezonska „Matura Sprint" propusnica** ⭐ | jednokratno 30–40 €/sezona; rok = pritisak = veća konverzija; zaključa prihod prije odljeva nakon mature |
| Po predmetu / bundle | obavezni (Hrv/Mat/strani) + izborni; sidrenje cijene |
| AI tutor (premium / „tvoj ključ") | najveća platežna volja blizu ispita; mjeri „jedinice" za kontrolu troška |
| Reklame (free) | nizak ARPU; promet velik u proljeće |
| **B2B: škole / instrukcijski centri** | jedan ugovor = stotine korisnika, predvidiv prihod |

## Scenariji prihoda (pretpostavka ~30 €/god po platežnom; konverzija 2–8 %)
| Scenarij | Free reg. | Konverzija | Platežnih | Pretplata/god | + ads/B2B |
|---|---|---|---|---|---|
| Oprezni (g.1–2) | 5.000 | 3 % | 150 | ~4.500 € | +~0,5k |
| Realan (g.2–3) | 15.000 | 5 % | 750 | ~22.500 € | +3–5k |
| Optimističan (g.3–4) | 40.000 | 8 % | 3.200 | ~96.000 € | +20–40k |
| „Lider niše" | 60.000 | 10 % | 6.000 | ~180.000 € | + bitno više |
> Najjače poluge: **konverzija** i **ARPU**.

## Ideje za maksimiziranje profita (matura-fokus)
1. **Engine prošlih matura** (NCVVO ispiti su javni) → interaktivni, auto-ocjenjivi zadaci + objašnjenja. Killer feature + SEO + legalno.
2. **AI tutor „objasni mi zadatak"** — vrhunac platežne volje tjedan prije ispita; „tvoj ključ" za napredne.
3. **Sezonska propusnica > mjesečna** (sezonski ispit).
4. **Ciljaj roditelje** — sidrenje: cijela godina < 2 sata instrukcija.
5. **B2B na škole/instrukcijske centre** — niski CAC, predvidiv prihod.
6. **Procjena ocjene na maturi** — sticky premium značajka.
7. **Gamifikacija + ljestvice + streak + „pozovi 3 frenda"** — viralno u školama, CAC≈0.
8. **UGC uz moderaciju** — jeftino skaliranje sadržaja (sadržajni „moat").
9. **Affiliate/upisi-lijevak** — partneri faksovi/pripreme.

## Unit economics
- Statički sadržaj = trošak ≈ 0 → **bruto marža 80–90 %**. Jedini varijabilni trošak = **AI** (kontrola: jeftin model/Haiku + keširanje + kvote + „tvoj ključ").
- Naplata ~5 % (Stripe/MoR) + PDV (MoR riješi).

## Predloženi redoslijed uvođenja naplate
**F6 „tvoj ključ" → sezonska Matura propusnica → AI jedinice → B2B škole.** (Veže se na [ROADMAP.md](ROADMAP.md) §DALJE i VISION Faze 1–4.)
