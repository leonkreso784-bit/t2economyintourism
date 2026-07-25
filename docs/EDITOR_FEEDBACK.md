# EDITOR_FEEDBACK — Leonov živi review editora (punch-lista)

> **Kontekst (2026-07-25):** Leon je prošao živi editor (preview grana) i dao detaljan feedback.
> Presuda: **„editor je sam po sebi jako ružan i loš — moraš početi razmišljati kao developer
> editora da bude STVARNO dobar, kreativan i lako korištan. Ovo je tek početak."**
> Znači: U8.6 NIJE samo „CSS-polish" — editor treba pravi UX/proizvodni redizajn, ne šminku.
> Ova lista se **zapisuje i rješava**. Referenca za rad: `EDITOR_PLAN.md §12.2`.

## 🎯 Vodeći princip (developer-editora mindset)
Trenutni editor je nastao kao **hrpa nezavisnih blok-tipova bolt-anih zajedno** (heading, paragraph,
list, callout, slika, video, formula, tablica — svaki zaseban). Mockup C (`design/mockups/editor-c-tok.html`)
vizija je **„KVADRATIĆ" = sekcijska kartica** kao GLAVNA jedinica autorstva: numerirana, s NASLOVOM +
bogatim TIJELOM + medijima, obojena, resize-abilna, **drag-abilna**. Editor je odlutao od te vizije.
Cilj U8.6+: **vratiti se kvadratić-modelu + dodati direktnu manipulaciju** (drag, pravi upload,
boja cijelog bloka, bolja add-afordancija, bogatije formatiranje teksta). Etalon: Notion/Photomath
razina — očite afordancije, direktna manipulacija, ugodno i lako.

---

## 📋 Stavke (F1–F8)

### F1 — ＋ za dodavanje bloka je „mršav i ružan"
- **Leon:** „ne sviđa mi se kako je plus pozicioniran, nekako je mršavo i ružno."
- **Analiza:** između-blokovni ＋ je tanka linija + sitni krug (`.be-adder`/`.be-bigplus`). Nema vizualne
  težine ni jasne pozivnice. Add-blok je NAJČEŠĆA radnja → mora biti najuočljivija i ugodna.
- **Rješenje:** redizajn add-afordancije — puno-širinska „＋ Dodaj blok" zona koja se elegantno pojavi na
  hoveru između blokova (jasan pill, ne mršavi krug); donji „veliki ＋" ostaje primarni, s boljim
  paddingom/ikonama/hoverom. Tip-izbornik s lijepim ikonama i mrežom.
- **Tip:** vizual + interakcija · **Prioritet:** VISOK (svaki blok počinje ovdje)

### F2 — Slika: pravi UPLOAD (file-picker), ne URL-paste
- **Leon:** „kada se stavi slika nema opcije da se stisne gumb i otvori se odmah dio s datotekama gdje biraš koju sliku želiš."
- **Analiza:** slika-blok = samo `<input>` „Zalijepi URL slike". Nitko nema URL slike pri ruci → mora se moći
  **odabrati datoteka s diska** (i drag-drop na drop-zonu). = **U8.7 (Supabase Storage upload).**
- **Rješenje:** prominentan drop-zone + „📁 Odaberi sliku" gumb → native file-picker → upload u Supabase
  Storage bucket (admin-write / public-read RLS) → dobiveni URL u `block.src`; progress + drag-drop datoteke;
  URL-paste ostaje kao sekundarna opcija.
- **Tip:** feature (Storage) · **Prioritet:** VISOK (Leon: must-have prije vanjskog pokazivanja)

### F3 — Learn blokovi su „loše napravljeni" (kišobran)
- **Leon:** „learn blokovi su loše napravljeni."
- **Analiza:** općenita presuda; konkretizira se kroz F4/F5/F6/F7 + vizual. Korijen = odmak od kvadratić-modela.
- **Rješenje:** vidi F7 (naslov+tijelo model), F4 (boja cijelog bloka), vizual (kvadratić-kartica tretman).
- **Tip:** kišobran · **Prioritet:** — (rješava se kroz ostale)

### F4 — Boja sekcije mora obojati CIJELI blok (kao kartice)
- **Leon:** „kada se bira boja mora postojati opcija da biraš koju boju želiš da CIJELI BLOK bude — kao isto i s karticama."
- **Analiza:** sad boja = tanka accent-traka lijevo na bloku. Kartice dobiju jaču boju. Blok treba isti tretman:
  cijela kartica tonirana bojom (tintani gradijent + obojeni rub), da „zelena sekcija" jasno čita kao zelena
  kroz learn I kartice I kviz.
- **Rješenje:** primijeni `--st-acc`/`--acc` kao tint cijelog bloka (pozadinski gradijent u boji + rub + glow),
  ne samo traka; paleta izbora boje po sekciji (već postoji `updateCategory{color}` U6b — proširiti vizualni efekt).
- **Tip:** vizual + (moguće) model · **Prioritet:** VISOK

### F5 — DRAG-and-drop premještanje learn blokova
- **Leon:** „mora biti mogućnost da se DRAGA learn blok."
- **Analiza:** sad reorder = samo ↑↓ gumbi (`data-be-act=up/down`→`reorderBlocks`). Moderni editor = povuci-i-ispusti.
- **Rješenje:** drag-ručka na svakom bloku → pointer-based sortable → na ispuštanju `reorderBlocks(order)`;
  ↑↓ ostaju kao a11y-fallback; vizualni indikator mjesta ispuštanja.
- **Tip:** interakcija · **Prioritet:** VISOK

### F6 — Mijenjanje BOJE TEKSTA koji se piše
- **Leon:** „mora postojati mogućnost da se mijenjaju boje teksta koji se piše."
- **Analiza:** POSTOJI (U8.4b: traka na selekciji ima 4 `lb-color` swatcha + ukloni-boju). Ali očito nedovoljno
  vidljivo/bogato → treba jasnija, bogatija paleta boja teksta + bolja discoverability.
- **Rješenje:** proširiti traku (više kuriranih a11y-boja + eventualno „više boja"), učiniti je uočljivijom;
  provjeriti radi li pouzdano na svim tekst-blokovima.
- **Tip:** vizual + interakcija (nadogradnja postojećeg) · **Prioritet:** SREDNJI

### F7 — Learn blok mora imati DIO NASLOV + DIO TEKST (kvadratić-model)
- **Leon:** „u learn blokovima mora biti dio naslov i dio teksta."
- **Analiza:** SADA su heading i paragraph ODVOJENI blokovi. Mockup-kvadratić = JEDNA kartica s naslovom (h2) +
  bogatim tijelom + medijima. Ovo je **najveća strukturna promjena** i srž „loše napravljeni". Realigniranje
  na kvadratić = glavni blok autorstva ima naslov-polje + tijelo-polje zajedno.
- **Rješenje:** uvesti kompozitni „sekcija/kartica" blok (naslov + rich tijelo + mediji + boja + resize + drag) kao
  primarnu jedinicu — točno mockup-kvadratić. Migracija postojećih heading/paragraph → kvadratići (poništivo, bez
  gubitka). Pažljivo prema schemi v2 + renderer + draft-ops.
- **Tip:** STRUKTURA (model) · **Prioritet:** VISOK (srž redizajna) — traži najviše pažnje

### F8 — Lista: izbor REDOSLIJEDA / tipa
- **Leon:** „lista treba imati opcije da biraš kojim redoslijedom ide."
- **Analiza:** model već ima `ordered` (ol/ul; renderer podržava), ali EDITOR ne izlaže toggle ni reorder stavki.
- **Rješenje:** UI-toggle uređena (1,2,3) vs neuređena (•) lista + premještanje stavki liste (drag ili ↑↓).
- **Tip:** interakcija (nadogradnja) · **Prioritet:** SREDNJI

---

## 🗺️ Predložena sekvenca rješavanja (developer-editora)
Grupirano po „koliko podiže osjećaj pravog editora" × rizik. Sve na preview grani, `preflight` prije svakog pusha.

1. **F7 (naslov+tijelo kvadratić-model)** — SRŽ; sve ostalo sjeda na nju. Najveći utjecaj, traži najviše pažnje (schema/renderer/draft/migracija). *Radi se pažljivo, po koracima.*
2. **F4 (boja cijelog bloka)** + **F1 (bolja ＋ afordancija)** — brzi, veliki vizualni skok, nizak rizik.
3. **F5 (drag-drop blokova)** — direktna manipulacija; interakcija.
4. **F6 (bogatija boja teksta)** + **F8 (lista opcije)** — nadogradnje postojećeg.
5. **F2 (pravi upload slike = U8.7, Supabase Storage)** — feature; traži bucket + RLS.

> Redoslijed je prijedlog — Leon presuđuje prioritet. „Ovo je tek početak" → očekuju se daljnji krugovi feedbacka.
