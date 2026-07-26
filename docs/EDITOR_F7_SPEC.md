# EDITOR F7 — KVADRATIĆ-MODEL · Inženjerski spec (korak po korak)

> **Status:** DEFINIRANJE (Leon: „ništa ne gradi dok strukturno kvalitetno ne odredimo svu tehnologiju
> — želim da bude inženjerski savršeno definirano korak po korak"). Ovaj dok je **ugovor prije koda**.
> Kad ga oboje potvrdimo, tek onda kreće gradnja. Referenca: `EDITOR_FEEDBACK.md` (F1–F8), `EDITOR_PLAN.md §12.2`.

## 0. Cilj (jedna rečenica)
Learn-sekcija (kategorija) u edit-modu **postaje prava „kvadratić" kartica** — numerirana, s **uredljivim
NASLOVOM** (naziv sekcije) + **bogatim TIJELOM** (blokovi), tonirana bojom sekcije, spremna za drag —
točno kao mockup C. Rješava F7 (naslov+tijelo) i otvara F1/F4/F5.

## 1. Što F7 JEST i NIJE (opseg)
- **JEST:** redizajn **rendera + edit-UI-ja** learn-kvadratića (`studio.js` + `block-editor.js` + CSS).
- **NIJE:** promjena **sheme** (`subject-content.schema.json`), **draft-ops** (`draft-store.js`), **publish-RPC-a**,
  ili **rendera-granice** (`blocks-renderer.js`). Model ostaje isti → nizak rizik, nula migracije podataka.
- **NE dira** student-view, kartice/kviz/fill logiku, bazu.

## 2. Trenutna arhitektura (izmjereno u kodu — temelj)
**Podatkovni model** (dokument lekcije = objekt kategorija, keyed stabilnim ID-em, poredak = redoslijed ključeva):
```
document = { <catId>: category, … }
category = {
  name:  string,          // naziv sekcije — VIEW ga već crta kao <h2> kvadratića; kartice/kviz ga dijele
  color: "#rrggbb",       // boja sekcije (obavezno u shemi)
  icon?: string,
  flashcards?: [ … ],     // kartice
  quiz?: [ … ], fillBlanks?: [ … ],
  learn?: {
    title?:   string,     // OPCIONALNI podnaslov (view: "name — title"); NIJE glavni naslov
    content?: string,     // v1 legacy HTML  (learnKind = 'v1')
    blocks?:  [ block ]   // v2 blokovi      (learnKind = 'v2')
  }
}
block = { id, type, … }   // heading|paragraph|list|callout|image|video|formula|table|legacy-html
```
**Draft-ops** (`SokratDraft.applyOp`, sve IDEMPOTENTNE, autosave localStorage, replay na siblinge kod publisha):
- `updateCategory {catId, patch}` — patcha SAMO `{name, icon, color, id}` (ALLOWED-obrana) ← **naslov + boja idu ovuda**
- `addBlock / removeBlock / reorderBlocks {catId, …}` — nad `cat.learn.blocks` (add smije kreirati `learn`+`blocks`)
- `updateLearnBlock {catId, id|idx, patch}` — patch jednog bloka (apsolutne vrijednosti; `null` briše ključ)
- `addCategory / removeCategory / reorderCategories` — nad top-level dokumentom

**Render/edit pipeline** (`studio.js`):
- `renderCanvas()` → `renderLearnPane(data, isEd)` → po kategoriji:
  - **VIEW:** `st-kv` kartica = `st-kvhead`(broj + `<h2>` `name [— learn.title]`) + `st-body`(=`renderBlocks`).
  - **EDIT:** `st-learn-cat` = `st-learn-cathead`(**statični** „§ NAME" + colorDots) + `be-mount`(blok-editor).
- `mountLearnEditors()` → `SokratBlockEditor.mount(el, {catId, getBlocks, applyOp})` po kategoriji.
- `onDraftChanged()` (hook iz admina) → re-render canvasa nakon svake op.

**Blok-editor** (`block-editor.js`): `renderEditor(blocks)` → `adder(i)` + `blockCard(block,i,total)`:
- `blockCard` = `be-head`(broj + **tip-labela** „Naslov/Tekst…" + ↑↓✕) + `be-body`(`editableBody`).
- Reorder = ↑↓ (`swappedOrder`→`reorderBlocks`). Add = `adder`/`bigplus`→tip-izbornik→`addBlock`.

**Sigurnosna granica:** sav learn-render kroz `renderBlocks` (jedan renderer, escapano, bez sirovog HTML-a). F7 to NE dira.

## 3. Ciljna arhitektura (kvadratić)
```
EDIT-MOD kvadratić (st-learn-cat POSTAJE kartica):
┌─①─ [Hardware ▏uredljiv naslov] ───────────────── 🎨boja  ⠿drag  🗑 ┐   ← be/st-head kartice
│                                                                     │
│   [ tijelo = be-mount: blokovi teku, chrome stanjen, ⊕ na hover ]   │   ← be-body
│   ⊕ Dodaj u sekciju                                                  │
└──── cijela kartica tonirana --st-acc (boja sekcije) ────────────────┘
```
- **Naslov** = `cat.name`, inline-uredljiv → `updateCategory{name}` (postoji). `learn.title` = odluka D3.
- **Tijelo** = postojeći `be-mount` blok-editor; chrome bloka („1 Naslov ↑↓✕") **stanjen** (F1).
- **Cijela kartica** tonirana `--st-acc` (F4). **Drag** ručka (F5). **🗑** = `removeCategory` (poništivo).
- VIEW-mod `st-kv` već je „kartica" → uskladiti vizual s edit-kvadratićem (isti jezik).

## 4. Tehnologija / KLJUČNE ODLUKE (⟵ ovo određujemo ZAJEDNO)

> Svaka odluka ima **moju preporuku** + alternative. Presudi ili predloži drugačije.

**D1 — Naslov: `contenteditable` vs `<input>`?**
- **Preporuka: `contenteditable` span** (kao mockup `<h2 contenteditable>`) — izgleda kao naslov, ne kao polje;
  `focusout`→`updateCategory{name}` (isti obrazac kao inline tekst U8.4a). Escapano na unosu (plain text, bez HTML-a).
- Alt: `<input>` (jednostavnije, ali „obrazac" osjećaj koji Leon ne želi).

**D2 — Chrome bloka (F1 vezan): koliko stanjiti?**
- **Preporuka:** maknuti tip-labelu („Naslov/Tekst") iz `be-head`; ostaviti **samo broj + kontrole na HOVER**
  (↑↓✕ se pokažu na hover bloka). Blokovi teku kao tijelo, ne kao zasebne kartice. `＋` postaje elegantna
  puno-širinska hover-linija (F1) umjesto mršavog kruga.
- Alt: zadržati tip-labelu (manje čisto).

**D3 — `cat.name` vs `cat.learn.title`: jedan naslov ili dva?**
- **Preporuka: JEDAN vidljivi naslov = `cat.name`.** `learn.title` (rijedak podnaslov) — u edit-modu ga NE
  izlažemo zasebno (izbjegni zbunjujuća dva polja); view-mod nastavlja prikazivati „name — title" ako title postoji
  (bez regresije). Ako ikad zatreba podnaslov-editiranje → zasebna kasnija sitnica.
- Alt: izložiti oba (kompleksnije, zbunjuje autora).

**D4 — DRAG (F5): koja tehnologija?** *(odluka i za blokove i za kvadratiće)*
- **Opcija A (preporuka): ručni pointer-drag** (vanilla `pointerdown/move/up`, kao `imageResizePointerDown` U8.5e) →
  na ispuštanju `reorderBlocks`/`reorderCategories`. Nula ovisnosti, pun nadzor, uklapa se u „no-build/vanilla" etos.
- **Opcija B: vendorati SortableJS** (~45 KB, „biblioteka pod 4 uvjeta": vendorano/adapter/samo-autorska-strana/spike).
  Gotov UX (placeholder animacije), ali ovisnost + veći autorski bundle.
- Preporuka A jer je drag-lista jednostavna i želimo lagano; B ako želiš „gotov" osjećaj odmah.

**D5 — Boja CIJELOG bloka (F4): koliko jako tonirati?**
- **Preporuka:** suptilni tint — pozadinski gradijent kartice dobije primjesu `--st-acc` (npr. 8–14 % preko postojeće
  tamne kartice) + obojeni rub/lijeva traka s glow-om (U8.6a već ima traku-glow). Čitljivost teksta ostaje (WCAG),
  „zelena sekcija" jasno čita kao zelena kroz learn/kartice/kviz. Boje = kuriranih 6 + custom (postoji U8.5f paleta).
- Alt: puna zasićena pozadina (rizik čitljivosti na tamnoj temi).

**D6 — Redoslijed gradnje: F7 čist, pa F1/F4/F5 — ili kvadratić-paket odjednom?**
- **Preporuka:** **F7 kostur prvo** (kartica + uredljivi naslov + stanjeni chrome), pa **F4 boja** → **F1 ＋** → **F5 drag**
  kao zasebni mali koraci (svaki testabilan/commitabilan). Kvadratić se gradi slojevito, ne u jednom velikom PR-u.
- Alt: sve odjednom (veći, teže za review/rollback).

### 4.1 ODLUKE — PRESUĐENE (Leon, 2026-07-25) 🔒
- **D1 = `contenteditable` naslov** (izgleda kao naslov, ne polje; `focusout`→`updateCategory{name}`).
- **D2 = chrome bloka STANJEN** (bez tip-labele; ↑↓✕ samo na hover; blokovi teku kao tijelo).
- **D3 = JEDAN vidljivi naslov = `cat.name`** (`learn.title` se ne izlaže u edit-modu; view nepromijenjen).
- **D4 = VANILLA pointer-drag** (bez SortableJS; `pointerdown/move/up`→`reorderBlocks`/`reorderCategories`; nula ovisnosti).
- **D5 = SUPTILNI tint + rub/glow** (8–14% boje preko tamne kartice; čitljivost WCAG na tamnoj temi).
- **D6 = SLOJEVITO korak-po-korak** (K1→K6, svaki mali/testabilan/commitabilan; ne u jednom zamahu).
→ Sve odluke zaključane → gradnja kreće po planu §6 (K1) uz Leonov „kreni".

## 5. Izmjene po datoteci (kad odluke padnu)
- **`js/studio.js`** — `renderLearnPane` EDIT-grana: `st-learn-cat` → kvadratić-kartica (broj + uredljiv naslov +
  color-dot + drag-ručka + 🗑); ožičiti naslov `focusout`→`updateCategory{name}`; VIEW `st-kv` uskladiti.
- **`js/block-editor.js`** — `blockCard`/`be-head`: maknuti tip-labelu, kontrole na hover; `adder`/`bigplus`: F1 stil.
- **`css/studio.css`** — `.st-learn-cat` kvadratić-kartica (D5 tint, drag-ručka, naslov); uskladiti s `.st-kv`.
- **`css/block-editor.css`** — `.be-head` stanjen, `.be-adder`/`.be-bigplus` F1 redizajn, hover-kontrole.
- **Ops/schema/renderer/DB:** NULA promjena.

## 6. Korak-po-korak build-plan (svaki korak = mali, testabilan, commitabilan)
> Pokreće se TEK nakon potvrde odluka D1–D6. Svaki korak: `preflight` prije pusha + authed studio.

1. **K1 ✅ (2026-07-26) — Uredljiv naslov kvadratića** (D1): `st-learn-cathead` → `contenteditable` `.st-cat-name` →
   commit na focusout → `updateCategory{name}` (plain-text granica; paste=plain; Enter=potvrdi; prazan/no-op se ne sprema;
   bez re-rendera na blur). authed uživo vs staging **2/2** (upiši naslov → draft `name` promijenjen → Odbaci). *Bez vizualnog redizajna još — puni kvadratić = K2.*
2. **K2 ✅ (2026-07-26) — Kvadratić-kartica vizual** (struktura): `st-learn-cat` = kartica (broj-badge `.st-n` + prominentan naslov
   16.5px + `st-learn-body` omotač), gradijent+radius18+`::before` accent = isti card-jezik kao VIEW `st-kv`; v1 više ne ugnježđuje `st-kv`.
   authed 14/14 uživo (0 regresije) + screenshot-review.
3. **K3 ✅ (2026-07-26) — Stanjeni chrome bloka** (D2, dio F1): `be-type` uklonjen (tip=`title` na broju); `.be-block` transparentan bez okvira/accent/lift/pop → blokovi teku kao tijelo, hover=highlight+kontrole; broj suptilan.
   unit 58/0 (3 K3 testa) + authed 14/14 uživo (kontrole rade).
4. **K4 ✅ (2026-07-26) — Boja cijelog bloka** (F4, D5): dijeljeno pravilo → `--st-wash: color-mix(--st-acc 12%, transparent)` kao gornji bg-layer
   na svih 6 Studio-kartica (learn/kv/fcard/qz/fill/edit-item), ispod sadržaja (tekst WCAG); accent-trake ostaju kao rub. authed 14/14 (U8.5f nasljeđivanje) + screenshot.
5. **K5 ✅ (2026-07-26) — ＋ afordancija** (F1): `be-adder` = puno-širinska accent-linija + prsten-＋ (fill na hover) umjesto malog kružića; `bigplus` flex + glow-ring. Čisti CSS. preflight EXIT 0 + add-flow provjeren + screenshot.
6. **K6 — Drag kvadratića + blokova** (F5, D4): pointer-drag → `reorderCategories`/`reorderBlocks`. Podijeljeno na **K6a (blokovi) + K6b (sekcije)**.
   - **K6a ✅ (2026-07-26, `2c6b6d4`) — drag BLOKOVA:** grip ⠿ (`data-be-drag`) u `be-head` → `startBlockDrag` (vanilla `pointerdown`/document-`move`/`up`) → fixed drop-linija → `reorderBlocks` op → `draw()`. Helper `reorderedIds` (clamp). R-C: drag samo s ručke (caret naslova/teksta netaknut). unit 64/0 (+`reorderedIds`) · authed studio 15/15 uživo (pravi mouse-drag → prvi blok = zadnji u draftu).
   - **K6b — drag SEKCIJA:** drag-ručka u `st-learn-cathead` → `reorderCategories {order}`; **full-key merge** (ne-learn kategorije ostaju na apsolutnim mjestima, permutira se samo skup vidljivih learn-cat); R-B: naziv/boja dijeljeni s karticama/kvizom → test da se render ne razbije.
> F6 (text-boja) i F8 (lista) su zasebne stavke NAKON kvadratića; F2 (upload) = U8.7.

## 7. Rizici + mitigacije
- **R-A: v1 legacy kategorije** (learn.content, ne blocks) → NE montiramo blok-editor (postojeći `st-migrate` put ostaje);
  kvadratić-header (naslov/boja/🗑) SMIJE i na v1 (radi nad `cat.name`/`color`, ne nad blokovima). Provjeriti u K1/K2.
- **R-B: kartice/kviz/fill dijele `cat.name`/`color`** → uređivanje naslova/boje u learnu mijenja i njihov `§ NAME`/akcent
  (to je ŽELJENO — jedna istina sekcije), ali test mora potvrditi da se ne razbija njihov render.
- **R-C: drag + contenteditable konflikt** (drag-ručka ne smije otimati caret naslova) → drag SAMO s ručke (`⠿`), ne s naslova.
- **R-D: onDraftChanged re-render gubi caret/fokus** → naslov-edit koristi `focusout`-commit (bez re-crtanja tijekom tipkanja),
  isti obrazac kao U8.4a inline (dokazano radi).
- **R-E: idempotentnost publisha** → koristimo POSTOJEĆE ops (sve idempotentne, sibling-replay dokazan) → publish-put netaknut.

## 8. Testiranje (gate po koraku)
- **Unit** (`block-editor.test.js`): chrome-render bez tip-labele; adder-render; (drag = pomoćnik `reorderBlocks` order).
- **Authed** (`studio.authed.spec.js`): po koraku — naslov→draft; boja→akcent u learn+kartice; drag→redoslijed u draftu; Odbaci čist.
- **Preflight EXIT 0** prije SVAKOG pusha (uklj. `build:css`!). Screenshot-review na vizualnim koracima (K2/K5).

## 9. Definicija gotovosti (F7)
Kvadratić = numerirana kartica s uredljivim naslovom (=`cat.name`) + tijelom (blokovi, stanjen chrome) + bojom cijele
kartice + drag; view/edit isti vizualni jezik; svi authed/unit zeleni; Leon vizualno potvrdi. Tek onda F6/F8/F2.

---
## ✅ ODLUKE D1–D6 PRESUĐENE (§4.1, 2026-07-25). **K1–K5 + K6a ✅ ISPORUČENI (2026-07-26) → SLIJEDI K6b (drag SEKCIJA, `reorderCategories`) = ZADNJI dio F7.**
