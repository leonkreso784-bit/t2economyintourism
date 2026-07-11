# UGC.md — Autorstvo, draft→objavi i put do UGC-a (north-star dizajn-dok)

> **Status:** ▶ AKTIVNO (napisano 2026-07-09 iz razgovora korisnik+Claude 2026-07-08/09).
> **Što je ovo:** trajni dizajn-dokument za smjer „bogato autorsko sučelje → draft→objavi → UGC → AI".
> Sekcije 3–6 su **duboke** (skupo ih je kasnije mijenjati — model sadržaja, write-put, editor, sigurnost);
> sekcije 7–9 su **skice** (daleko; dovoljno da arhitektura ostane koherentna). Brick-plan na dnu je ŽIV (mijenja se usput).
> **Vezano:** [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) (F4–F6) · [CRUD_PLAN.md](CRUD_PLAN.md) (F4 dosad) · ADR-013/016/018/021 · [VISION.md](VISION.md).

## 0. Središnji uvid: sve je Dokument
Platforma ima jedan središnji objekt: **dokument sadržaja** (lekcija/deck). Editor ga proizvodi, study-modovi ga čitaju,
marketplace ga dijeli, AI ga konzumira i mutira, verzioniranje ga čuva. Savršena arhitektura =
**jedan model · jedan write-put · jedan read-put · jedna sigurnosna granica.** Svako dupliciranje jednog od ta četiri = budući problem.

## 1. Vizija i principi
- **User-friendly autorstvo kao proizvod:** admin (mi) i kasnije student rade sadržaj kroz LIJEPO sučelje —
  flashcard = prava kartica koju okrećeš i pišeš; quiz-builder; fill = „označi prazninu"; learn = bogati dokument-editor.
  Autorsko sučelje koje gradimo SAD je **sjeme UGC alata** — zato ga vrijedi napraviti kvalitetno odmah.
- **„Sloboda unutar sustava" (Canva-filozofija, NE Canva-canvas):** korisnik je kreativan (boje kartica, boje/highlight
  u learn i fill, slike, video) — ali kroz **kurirane tokene i blokove**, ne sirovi HTML/fontove. Čitljivost, dark-tema i
  sigurnost ostaju očuvani po konstrukciji. Slobodni dizajn-canvas (Canva-stil) je eksplicitno IZVAN cilja.
- **Draft→objavi svugdje:** ništa ne ide živo dok autor ne stisne „Objavi". Uređivanje (uklj. brisanje/preslagivanje)
  je bezopasno jer dira samo radnu kopiju.
- **Brisanje = poništivo, ne zabranjeno:** `content_versions` snima staro stanje PRIJE svakog upisa → i objavljeno
  brisanje je oporavljivo. Pravi odgovor na „kako sigurno brisati" = **„Povijest verzija / Vrati" UI**, ne izbjegavanje.

## 2. Tri horizonta (tajming)
| Horizont | Što | Gate |
|---|---|---|
| **H1 — SAD** | draft→objavi + bogato autorsko sučelje za nas (admin) | F4 u tijeku; ovo je nastavak F4 |
| **H2 — UGC** | per-user server-draftovi · publish pod vlastitim računom · marketplace tuđih objava | **F6 sigurnost** (ADR-018: student-upload NIKAD prije F6) |
| **H3 — AI/MCP** | AI-tutor „donesi svoj ključ" · vanjski AI (ChatGPT/Claude) stvara sadržaj kroz naš API/MCP | H2 + auth za strojeve (PAT/OAuth) |

## 3. Model sadržaja (DUBOKO — najskuplje mijenjati)
### 3.1 Stabilni ID-jevi + schemaVersion (PRVA promjena, prije svega ostalog)
- **Svaka stavka** (flashcard, quiz pitanje, fill rečenica, learn-blok, kategorija) dobiva **stabilni `id`**
  (kratki random, dodijeljen jednom, NE hash sadržaja — hash bi se mijenjao s editom).
- **Zašto prije svega:** (catId, indeks) adresiranje se raspada kod brisanja/preslagivanja; ID-jevi su preduvjet za
  reorder/delete · propagaciju po ID-u · **SRS/F5** (napredak vezan uz indeks pukne pri editu!) · undo · AI-alate
  („uredi karticu X") · marketplace-atribuciju · rješavanje konflikata. Retrofit poslije editora = sve diramo dvaput.
- **Svaki dokument** nosi **`schemaVersion`** → migracije formata su uopće moguće; validator prima v1 i v2 tijekom prijelaza.
- **Napredak korisnika:** čitanje **dual-key** (stari indeks-ključevi se prihvaćaju i mapiraju na ID pri učitavanju;
  piše se novo) — NIKAD destruktivno prepisivanje; cloud-sync merge (unija/max) ostaje.

### 3.2 Learn = BLOKOVI (umjesto sirovog HTML-a)
`learn.content` (string HTML-a) → `learn.blocks: [{id, type, ...}]`. Tipovi (kurirani, proširivi):
`heading · paragraph · list · callout(info/warning/tip) · image · video(youtube) · table · formula(KaTeX) · legacy-html`.
- **Zašto blokovi:** (a) **sanitizacija po konstrukciji** — renderira se samo poznati tip s escapanim poljima, korisnik
  nikad ne piše HTML; (b) **blok-editor je DALEKO lakši** od punog rich-texta; (c) **AI dobiva strukturiran kontekst**;
  (d) prijevod/i18n pipeline dobiva čiste slotove (isti obrazac kao `translate-subject.js`).
- **Legacy:** postojećih 18 predmeta NE prepisujemo — njihov learn postaje jedan `legacy-html` blok koji ide kroz
  DOMPurify (strogi whitelist). Novo autorstvo proizvodi SAMO blokove. Prepisivanje staroga = opcionalno, predmet-po-predmet.
- **YouTube blok:** autor zalijepi link → mi validiramo **video-ID** i sami gradimo iframe (**`youtube-nocookie`**,
  klik-za-učitavanje, vezano na postojeći cookie-consent). Autor NIKAD ne unosi iframe/HTML. Prvi primjer kuriranog embeda.
- **Kartice/kviz/fill ostaju ČISTI TEKST** (+ `style` metapodatak) — bogato formatiranje SAMO u learn.
  (Odluka radi sigurnosti i prikaza u study-modovima; eventualno kasnije bold/slika na karticama = svjesna nadogradnja.)

### 3.3 Stil = TOKENI, ne slobodne vrijednosti
- `style: { color: <token> }` na kartici/kategoriji/bloku — **kurirana paleta** (mapira se na CSS varijable →
  preživi dark-temu i redizajn; kontrast se auto-čuva uparivanjem teksta).
- Pokriva korisnikovu želju: boje flash-kartica, boje/highlight u learn i fill — kreativno, ali čitljivo i konzistentno.

### 3.4 `final` = KOMPOZICIJA, ne kopija (ubija propagaciju kao klasu problema)
- Danas: `final` = spljoštena kopija M1+M2 (+examPractice) → svaki write mora propagirati (`_propagateToSiblings`).
- Cilj: final-red drži SAMO `examPractice` + manifest **`composedOf: [M1, M2]`**; **ContentRepository materijalizira**
  spojeni pogled pri čitanju. Jedan izvor istine po kategoriji; publish piše JEDAN red.
- Prijelaz: **dual-mode po predmetu** (ako red ima `composedOf` → materijaliziraj; inače legacy flat) — isti playbook
  kao JSON dual-read (dokazan 18/18).

### 3.5 Dokument-metapodaci (aditivno, spremno za H2)
`id · ownerId · visibility (private|unlisted|public) · status (draft|published) · schemaVersion · forkedFrom?` —
današnji `subject_content` redovi su „dokumenti u nastajanju"; kolone se dodaju aditivno. Katalog (ADR-022) postaje
kurikulum-stablo koje **referencira** dokumente; marketplace = upit nad dokumentima.
**Nepovredivo:** vježbe = JS moduli, NIKAD u bazu (BUG-012); UGC autor uploada PODATKE, NIKAD KOD (ADR-018).

## 4. Draft → objavi (DUBOKO — jedini write-put)
### 4.1 Slojevi
- **DraftStore:** `{original (netaknuto iz baze), working (kopija), dirty}` po **lekciji/dokumentu**. Ulaz u edit-mode =
  deep-copy; „Odbaci" = baci kopiju. **Autosave u `localStorage`** po dokumentu (preživi refresh/crash). H2: draftovi
  sele u server-tablicu `content_drafts` (user_id, document_id, payload; RLS owner-only) — **isto sučelje**, editori se ne mijenjaju.
- **Mutacije = imenovane OPERACIJE (ops):** editori zovu `applyOp(working, {type:'updateCard', id, …})` umjesto direktnog
  čačkanja. Tipovi: `updateCard/addCard/removeCard/reorderCards · updateQuiz/... · updateFill/... · updateLearnBlock/
  addBlock/removeBlock/reorderBlocks · setStyle · renameCategory/addCategory/removeCategory/reorderCategories`.
  **Dobitak:** undo/redo besplatno (stog opova) · AI-alati su već definirani (opovi = akcijski prostor) · audit čitljiv ·
  rebase kod konflikata moguć. Jeftin tanki sloj sad; vrlo skup retrofit.
- **Validacija na objavi:** JSON Schema (v2) + content-validator u pregledniku PRIJE objave — draft smije biti privremeno
  nevaljan, **objavljeni sadržaj nikad**. Validatori = dijeljeni moduli (isti kod u CI-ju, pregledniku i RPC gateu).
- **UI ljuska:** „Uredi lekciju" (admin-only) → edit-mode indikator + „nespremljene promjene" → **Objavi / Odbaci** +
  upozorenje pri izlasku. Ne-admin i dalje vidi samo read-only viewer.

### 4.2 Publish-RPC = jedina točka pisanja (čvor cijele vizije)
Postgres funkcija **`publish_document(...)`** (SECURITY DEFINER):
1. autorizacija (`is_admin()` sad; H2: vlasništvo+moderacija),
2. **`base_version` optimistic concurrency** — ako se sadržaj u međuvremenu promijenio → odbij (klijent: „promijenjeno drugdje, reload"); trivijalno sad, nemoguće čisto dograditi kasnije,
3. validacija, upis, **verzija (F4.2 trigger)**, **sync finala server-side** (dok kompozicija §3.4 ne stigne) — sve **atomično u jednoj transakciji** (rješava današnji best-effort 2-write problem),
4. kasnije se ovdje kače: rate-limit, kvote, moderacijski red, UGC publish, **MCP/API** — jedan kanal, postupno otvaran.
Restore stare verzije = publish starog payloada kroz ISTU RPC (→ i restore je verzioniran).

## 5. Editor (DUBOKO — zahtjevi + odluka biblioteka)
- **Cilj: bogati DOKUMENT-editor** (Notion-lite osjećaj), NE slobodni canvas. Kartice/kviz/fill = **custom form-UI-jevi
  koje gradimo sami** (nijedna biblioteka to ne nudi; jednostavni su): kartica koju okrećeš i upisuješ + „+" za novu;
  quiz s redovima opcija i radio „točan"; fill s „označi riječ = praznina"; picker boja (tokeni).
- **Biblioteka za learn blok-editor — DA, pod 4 ne-pregovorljiva uvjeta:**
  1. **Naša shema je kanonska** — adapter na granici (editor-output ↔ naši blokovi) → biblioteka ZAMJENJIVA, sadržaj naš zauvijek;
  2. **Vendorana + pinnana** (statična kopija u repou, običan `<script>` — bez build-koraka; isti obrazac kao supabase-js/KaTeX preko CDN-a: etos je *nema bundlera*, ne *nema ovisnosti*);
  3. **Samo autorska strana** — studentima renderira NAŠ jedan sigurni renderer; lazy-load editora samo za admina/autora (0 utjecaja na perf studenata);
  4. **Spike prije obveze** — prototip s pravim sadržajem: mobitel, paste iz Worda/Docsa, mapiranje na shemu → tek onda commit odluke (kriteriji ovdje, rezultat se upiše).
- Kandidati za spike: blok-editor s JSON outputom, CDN/IIFE loadable (npr. Editor.js klasa rješenja) vs Quill (dokument-stil, Delta JSON). Ručni editor = fallback ako spike padne (blokovi ga čine izvedivim, ali contenteditable rat ne želimo bez potrebe).

## 6. Sigurnost (DUBOKO — dizajnira se s editorom od 1. dana, formalizira u F6)
- **INVARIJANTA:** *jedini put do `innerHTML` je JEDAN blok-renderer; renderira samo whitelistane tipove blokova s
  escapanim poljima; ISTI renderer u editor-previewu, study-modu i marketplaceu.* Editor po konstrukciji ne može
  proizvesti ništa što renderer ne zna sigurno prikazati („editor smije samo ono što sanitizer dopušta").
- `legacy-html` blok → **DOMPurify** strogi whitelist. Embedi → samo naš kod gradi iframe iz validiranog ID-a
  (youtube-nocookie + consent). **CSP** (F6) zaključava; inline-onload hack s landinga (3D.2) tada → nonce/JS-flip.
- **Property/fuzz testovi:** generiraj nasumična blok-stabla → assert da renderer ne izbaci ne-whitelistan tag/atribut
  (ista brute-force kultura kao vježbe). Sanitizer+validator = dijeljeni moduli.
- **RLS za H2:** `documents` policyji — owner CRUD svoj; svi čitaju `published+public`; admin moderacija; publish = flip
  statusa kroz RPC (moderacijski red se tu kači). **AI ključevi korisnika NIKAD plaintext u našoj bazi** (proxy Edge
  Function po ADR-016, ili svjesno klijentski uz upozorenje).

## 7. Marketplace (SKICA — H2, iza F6)
Knjižnica objavljenih dokumenata: pretraga/filtriranje (fakultet/godina/predmet), autorstvo+atribucija, „koristi ovaj deck"
(dodaje u moj studij), fork (`forkedFrom`), prijava sadržaja + moderacija. Frontend surface + RLS upiti; katalog ostaje
kurirani „službeni" sloj iznad istog dokument-modela.

## 8. AI-tutor „donesi svoj ključ" (SKICA — H2/H3)
Korisnik spremi SVOJ API ključ → chat uz learn/study; AI dobiva **strukturiran dokument (blokove!)** kao kontekst →
radi „čisto iz njega". Kasnije: function-calling alati = naši **opovi** + provjere znanja (generiraj pitanje, ocijeni odgovor).
Sigurnost ključa: proxy Edge Function (ključ se ne izlaže) ili eksplicitno klijentski; trošak na korisniku.

## 9. AI/MCP autorstvo (SKICA — H3; „ChatGPT mi napravi learning iz PDF-a i da link")
Izvedivo: (1) **autentificirani API** = publish-RPC + drafts (već postoji kao jedini write-put!), (2) **MCP server** s
alatima `create_document/update_document/publish` → vrati URL. PDF čita AI na svojoj strani; naš API prima strukturiran
sadržaj koji MORA proći našu JSON Schemu (već postoji). Teški dijelovi: auth za strojeve (PAT/OAuth), sanitizacija (F6 gate),
rate-limit/zloupotreba. = naš generator-pipeline izložen kao „donesi svoj AI".

## 10. Rizici i mehanizmi snižavanja
| Rizik | Mehanizam |
|---|---|
| write-testovi prljaju prod audit (22 reda te2) | **STAGING Supabase projekt** (2. free; SQL fajlovi u repou idempotentni → primijene se na oba) → write-testovi automatizirani u CI, prod čist |
| svaka rizična promjena formata/ponašanja | **dual-mode + per-subject flip + kill-switch flag** (dokazani playbook: JSON dual-read 18/18) |
| katastrofa u bazi | **datoteke = izvor istine do F4.6 flipa** → najgori slučaj re-migracija iz gita; `export:json` = grubi restore-pointi |
| ID-migracija dira napredak | dual-key čitanje, nikad destruktivno; merge unija/max ostaje |
| editor-biblioteka | 4 uvjeta iz §5 + spike prije obveze |
| skupa odluka naslijepo | **spike-cigla** prije svake (editor, ID dry-run, RPC contract-test na stagingu) |
| dva pisca istovremeno | `base_version` u RPC ugovoru od 1. dana |

## 11. Otvorene odluke (upisati kad padnu)
- ⬜ izbor editor-biblioteke (nakon spike-a; kriteriji §5)
- ⬜ localStorage autosave drafta — default ON? (preporuka: da)
- ⬜ opseg stil-tokena v1 (koliko boja u paleti; custom hex uz kontrast-check da/ne)
- ⬜ točan trenutak čišćenja 22 test-audit-reda (uz „Povijest/Vrati" ciglu; traži izričit OK korisnika)
- ⬜ bold/slika na karticama (kasnija svjesna nadogradnja ili nikad)

## 12. Brick-sekvenca (ŽIVA — ažuriraj status ovdje)
> Nastavlja F4 (CRUD_PLAN); „F4.4-kategorije" i F4.5/4.6 se izvode KROZ ovaj slijed (strukturne operacije = unutar draft-moda).
> **Paralelna S-staza (Saša, content — [TEAM.md](TEAM.md) §4):** neovisna o U-stazi (v1-format datoteke; U2-migracija ih obuhvaća).
> Jedina ovisnost: **S7 (MUT/MOR) čeka U2.5.**

| # | Cigla | Status |
|---|---|---|
| U0 | UGC.md (ovaj dok) + naznaka u VISION | ✅ 2026-07-09 |
| U1 | **Staging Supabase** (2. projekt, SQL sync, rls-check/authed na staging) | ✅ 2026-07-10 (`40dc07b`): `sokrat-staging` + shema + test-admin; test-only override u `js/auth.js` (prod default no-op); test:authed 6/6 + write-verify + rls-check vs staging; PROD audit NETAKNUT |
| U2a | **Schema v2 — stabilni `id` po stavci** (migracija AST-surgical `scripts/add-item-ids.js` + validator prima v1/v2) — id po kartici/quizu/fillu/kategoriji/learn; **čisto aditivno, render netaknut, napredak se NE prevezuje** | ✅ **2026-07-11 (`b490172`)** — rollout na **svih 18** (56 study-datoteka, ~4787 id-jeva; 7 exercises/lib i 5 praznih kompozicija isključeni); content-identical **dokazan** (strip-id === HEAD 56/56); `validate:schema` 54/54; `verify` 0; **smoke test 223/0**. **`schemaVersion` IZBAČEN iz U2a → U2b** (top-level meta-ključ ruši `Object.keys(content)` iteracije u ~9 runtime-mjesta → smoke test to uhvatio) |
| U2b | **`schemaVersion` + runtime meta-filter (`getCategories()` helper) · `style`-tokeni · progress dual-key** — SVJESNO ODGOĐENO (id-jevi „samo leže" = nula rizika; ovo nosi rizik / treba runtime-podršku, čeka razlog: **SRS/F5 ili reorder/U6**). Nije preduvjet za U2.5. Skripta već ima opt-in `--schema-version` flag | ⬜ |
| U2.5 | **ADR-022 catalog identitet (PULL-FORWARD, ADR-023):** placement≠sadržaj, dijeljenje veznih predmeta unutar fakulteta — preduvjet MUT/MOR (S7). **3 tvrda uvjeta:** nakon U1+**U2a** (nikad isprepleteno) · aditivno/dual-mode · puni gate + staging | ⬜ |
| U3 | **Draft-sloj + ops + edit-mode ljuska**; 4 postojeća editora → pišu opove u draft | ⬜ |
| U4 | **Publish-RPC** (atomično: validacija+upis+verzija+final-sync+`base_version`); klijent objavljuje kroz RPC | ⬜ |
| U5 | **Povijest verzija / Vrati UI** (čita `content_versions`; restore kroz RPC) + čišćenje test-audita (uz OK) | ⬜ |
| U6 | **Strukturne operacije** u draftu (stavke pa kategorije: dodaj/obriši/presloži) | ⬜ |
| U7 | **Learn-blokovi**: model + JEDAN renderer + `legacy-html` + YouTube-blok | ⬜ |
| U8 | **Editor-spike** → odluka biblioteke → **blok-editor** + custom UI-jevi (kartica-flip, quiz-builder, fill-marker, boje) | ⬜ |
| U9 | `final` = kompozicija (dual-mode po predmetu) → potом F4.5 export/dry-run + F4.6 flip izvora istine | ⬜ |
| — | dalje: F5 SRS (trivijalan uz ID-jeve) → F6 sigurnost (CSP/DOMPurify formalno) → H2 UGC → H3 AI/MCP | ⬜ |
