# EDITOR_UX.md — dizajn-ugovor za autorski editor (U-UX faza)

**Status:** v0.9 — **smjer POTVRĐEN (Leon, 2026-07-14): varijanta C „Tok"**, uz ocjenu *„za sada tek toliko OK"* →
vizualna letvica se **dalje diže iterativno** tijekom U6–U8 (Leon presuđuje na svakoj cigli; „mršavo" = bug).
**Živi izvor istine za izgled i ponašanje: [`design/mockups/editor-c-tok.html`](../design/mockups/editor-c-tok.html)** (interaktivan;
QA smoke 36/36). Zahtjevi-ugovor: **[EDITOR_PLAN.md §5.1](EDITOR_PLAN.md) točke 1–8.** Varijante A (Studio) i B (Vodič) ostaju
u `design/mockups/` kao referenca — C ih spaja.

## 1. Temeljna filozofija (presuda)
- **Studio = dom, Vodič = ulaz.** Puni radni prostor (stablo + canvas + inspektor) je stalno sučelje; **„＋ Nova skripta"
  otvara wizard kao MODAL preko Studija** (1. Gdje? → 2. Što sadrži?) i „✨ Kreni pisati" **ispusti autora natrag u Studio**
  (tabovi = točno odabrani modovi; canvas dočeka sa starter-kvadratićem; novi predmet upisan u stablo).
- Kreiranje je rijedak trenutak → vođeno; uređivanje je 95 % vremena → moćno. **Korisnik nikad ne bira između
  „jednostavno" i „moćno".** (Canva/Notion obrazac.)

## 2. Regije ekrana (Studio)
| Regija | Sadržaj | Ključna interakcija |
|---|---|---|
| **Topbar** (staklo+blur) | logo s glowom · breadcrumb-čipovi (FMTU › smjer › god › skripta) · draft-čip „✏️ N izmjena" · Odbaci · **Objavi** (gradijent+glow) | Objavi = publish-RPC (atomično, verzija, konflikt-toast) |
| **Stablo** (lijevo) | „＋ Nova skripta" CTA (gradijent) · struktura fakultet→smjer→godina→predmet→skripte | **＋ na SVAKOJ razini** (struktura-CRUD kroz UI, §5.1-1); aktivna stavka = gradijent-pill s akcent-rubom |
| **Canvas** (sredina, dot-grid podloga) | editabilni naslov + meta-čipovi (izvor · zadnja objava · verzija · „studenti vide N modova") · **pill-tabovi modova** · pane aktivnog moda | tabovi: aktivni = gradijent-pilula; **＋ tab dodaje mod, ✕ na tabu (hover) uklanja** (sadržaj se NE briše; min 1 mod) |
| **Inspektor** (desno; skriva se <1020px) | kartice: 🎨 boje sekcija (tokeni) · ⬆ publish-info · ✨ **premium AI kutija (shimmer, gumb disabled)** | boje SAMO iz token-palete |

## 3. Learn = kvadratići (primarni ekran)
**Anatomija kvadratića:** lijevi akcent-rub u boji sekcije (s glowom) · broj-badge · **color-dot** (klik → paleta 6 tokena)
· editabilni naslov · editabilni body · media-red na hover (🖼️ Slika · 📈 Graf — slika u v1 · ▶️ Video/YouTube ·
🔗 **Link/stranica** = kartica-poveznica) · ✕ ukloni (hover) · **donja linija-ručka: povuci = veća kućica** (§5.1-8;
spremljena visina = stil-token bloka).
**Dodavanje:** mali **＋ između kvadratića** (gradijent-linija na hover → izbornik vizualnih pločica: Tekst/Naslov/Slika/YouTube)
**i** veliki **„＋ Dodaj kvadratić"** na dnu. Novi blok ulazi s pop-animacijom i fokusira naslov.
**Tekst-traka (plutajuća, na selekciji):** B · I · **5 boja TEKSTA** (a11y nijanse za dark: `#f1f5f9 #818cf8 #34d399 #fbbf24 #f87171`,
obrazac `--danger-text`) · 🔗 pretvori-u-link (URL input, Enter; Escape zatvara).

## 4. Boje = tokeni + nasljeđivanje (§5.1-6)
- **Paleta sekcija (6):** `#6366f1 #10b981 #f59e0b #ef4444 #06b6d4 #a855f7` — NIKAD slobodni color-picker (čitljivost na dark + konzistencija; paleta se smije proširiti).
- **Nasljeđivanje:** boja postavljena na sekciji learna (= kategoriji) automatski oboji **kartice i kviz te sekcije**
  (obojena gornja traka kartice / lijevi rub kviza + „§N naziv" oznaka s točkicom).
- Mapiranje na model: **sekcija learna = kategorija; kategorija VEĆ ima `color`** — nasljeđivanje je čisti UI-posao.

## 5. Kartice i kviz (custom form-UI, gradimo sami — EDITOR_PLAN §5)
- **Kartica:** 3D-hover, klik = flip (pitanje ⇄ odgovor, „↻ okreni" indikator), tekst direktno editabilan, „＋ Nova kartica" dashed-kartica.
- **Kviz:** pitanje editabilno · redovi opcija s radio „točan" · točan red = zeleni glass + „TOČAN" badge · ＋ opcija/pitanje.
- **Fill:** isti obrazac („označi riječ = praznina") — **UI još NIJE mockan → odluka u U8.**

## 6. Wizard (modal preko Studija)
Numerirani koraci s konektorima (1 Gdje? · 2 Što sadrži? · ✨ Piši) · korak 1 = kaskadni izbor s **„＋ Dodaj novi…" na svakoj
razini** + naziv skripte · korak 2 = velike mode-kartice (Samo Learn / Kartice+Kviz / Sve) s glowom na odabiru + premium-teaser
(disabled „Uskoro") · „✨ Kreni pisati" → slijetanje u Studio (vidi §1).

## 7. Vizualni standard („čisto i bogato" — mjerilo je mockup C)
Dubina (sjene + glow na akcentima) · staklo (blur na topbaru/modalima/toastu) · gradijenti SAMO na primarnim akcijama
(`--grad: 135deg #6366f1→#8b5cf6`) · dot-grid canvas · mikro-animacije (pop .2s na ulazu blokova/menija, rise na toastu,
hover-elevacija) · Space Grotesk za naslove / Inter za tekst · Sokrat tokeni iz `css/variables.css`.
⚠️ Poznati gotcha: `backdrop-filter` stvara stacking context → dropdownovi u tim kontejnerima trebaju `z-index` na KONTEJNERU.

## 8. Sigurnosne invarijante vezane uz dizajn (→ EDITOR_PLAN §6)
Jedan renderer za sve (editor-preview = study = budući marketplace) · whitelist tagova/atributa · URL-sanitizacija + `noopener`
na SVE linkove/embede · YouTube kroz naš iframe-builder (nocookie+consent) · stilovi SAMO tokeni (nema proizvoljnog CSS-a od autora).

## 9. Mapiranje na arhitekturu (ništa novo ne treba)
| UX element | Model/mehanizam |
|---|---|
| sekcija + boja | kategorija.`color` (postoji) |
| modovi ＋/✕ | features-flagovi + koji modovi imaju sadržaj (prazan ≠ greška ako nije odabran) |
| resize visina kućice | stil-token na learn-bloku (schema v2, U7) |
| svaka izmjena | **op** u draftu (`SokratDraft`) → „Objavi" = `publish_document` RPC (U4 ✅) |
| struktura-CRUD u stablu | katalog→baza (kurikulum-stablo) = **zasebna cigla NAKON editora stavki** (§5.1-1 implikacija) |

## 10. Što mockup NE pokriva (odluke padaju u ciglama)
Fill-editor UI (U8) · reorder/drag kvadratića i stavki (U6 — dizajn: drag-handle postoji vizualno) · mobilni editor-layout
(inspektor <1020px skriven — što s njim na mobitelu?) · undo/redo UI (op-stog postoji u draftu) · upload slika (storage odluka).

## 11. Build-slijed u ovom dizajnu
**U6 strukturne operacije** (dodaj/obriši/presloži stavke i kategorije — u ovom UI-ju) → **U7 learn-BLOKOVI + jedan renderer**
(model iz §3.2 EDITOR_PLAN-a; kvadratić = blok-grupa) → **U8 editor-spike** (biblioteka pod 4 uvjeta vs. custom; tekst-traka,
linkovi, resize) → dalje po EDITOR_PLAN §12. Svaka cigla se vizualno mjeri prema mockupu C — i diže letvicu (Leon: „tek toliko OK").
