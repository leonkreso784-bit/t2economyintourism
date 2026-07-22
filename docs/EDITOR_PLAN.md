# EDITOR_PLAN.md — dovršetak Admin CRUD-a: draft→objavi + editor (nastavak F4)

> **🎯 ČITAJ PRVO:** ovaj plan = **DOVRŠETAK ADMIN CRUD-a** (nastavak F4, [CRUD_PLAN.md](CRUD_PLAN.md)). U-cigle (U3 draft → U4 publish-RPC → … → U8 editor) su **CRUD cigle**, ne „UGC". Pravi UGC (studenti objavljuju) = **H2 horizont**, dolazi tek IZA F5 SRS + F6 sigurnosti (§2). *(Datoteka se do 2026-07-12 zvala `UGC.md` — preimenovana jer je ime stalno stvaralo zabunu da radimo UGC umjesto CRUD-a.)*
>
> **Status:** ▶ AKTIVNO (napisano 2026-07-09 iz razgovora korisnik+Claude 2026-07-08/09).
> **Što je ovo:** trajni dizajn-dokument za smjer „bogato autorsko sučelje → draft→objavi → (kasnije) UGC → AI".
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

### 4.2 Publish-RPC = jedina točka pisanja (čvor cijele vizije) — ✅ IMPLEMENTIRAN (U4, 2026-07-13; `supabase/u4-publish-rpc.sql`)
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

### 5.1 ⭐ Leonovi proizvodni zahtjevi za editor (2026-07-13) — OBAVEZNI ulaz za `EDITOR_UX.md` i mockupe
> Leon: „za cijeli design edit koji radimo jako je bitno da se ovo napravi." Svaki mockup se mjeri prema ovome.

1. **Struktura-CRUD u sučelju:** admin kroz UI stvara **fakultet → smjer → godinu → pod godinom predmete** („ne mora ići toliko u dubinu — bitno je da mogu kreirati sadržaj"). ⚠️ Arhitektonska implikacija: katalog je danas `data/catalog.js` DATOTEKA (izvor istine) → stvaranje strukture kroz UI traži katalog-kao-podatak (kurikulum-stablo u bazi, §3.5 + ADR-022 placement-tablica; prirodno sjeda uz F4.5/4.6 flip). Dizajn-faza crta tok; implementacija = zasebna cigla NAKON editora stavki.
2. **Izbor modova po skripti („imaš izbore"):** pri kreiranju skripte autor bira ŠTO ona sadrži — samo learn · samo kartice+kviz · sve. Study-UI prikazuje samo odabrane tabove (obrazac već postoji: `features.exercises`/`blindMap`); validator poštuje izbor (prazan mod ≠ greška ako nije odabran).
3. **Learn autorstvo = „+" blok:** klik na **+** otvori blok (kvadratić) s **editabilnim naslovom + tekstom + slikama + grafovima** itd. — ovo je doslovno §3.2 (learn-BLOKOVI) + §5 (blok-editor); **primarni ekran mockupa.** Grafovi = image-blok u v1 (interaktivni grafovi nisu cilj).
4. **Premium (kasnije): „napiši sve → sustav sam napravi ostalo"** — korisnik samo napiše gradivo, a sustav automatski generira flash-kartice kroz learn, kvizove i sve što treba. = **H3 AI-autorstvo (§8/§9) + monetizacijska premium-featura** ([MONETIZATION.md](MONETIZATION.md)); arhitektura već sjeda: AI čita BLOKOVE kao strukturiran kontekst, piše kroz OPOVE (akcijski prostor) i publish-RPC — naš generator-pipeline (ADR-010) izložen u proizvodu. NE gradi se sad; dizajn samo ostavlja mjesto (npr. gumb „Generiraj iz learna" disabled/premium).
5. **Modovi kroz „＋" tab i „✕" (2026-07-14, nakon pregleda mockupa):** uz izbor pri kreiranju (wizard), autor može mod dodati NAKNADNO — zadnji tab je **„＋"** koji nudi preostale modove — **i UKLONITI ga „✕"-om na tabu (kao browser-tab)**; uklanjanje skriva mod studentima, sadržaj se NE briše (vraća se ＋ tabom); barem 1 mod uvijek ostaje. U modelu = features-flagovi + koji modovi imaju sadržaj.
6. **Boja sekcije se NASLJEĐUJE (2026-07-14):** autor oboji naslov/sekciju learna (token-paleta, ne slobodna boja) → **kartice i kviz vezani uz tu sekciju nose istu boju** (crvena sekcija = crvene kartice; druga sekcija plava = plave). Mapira se izravno na postojeći model: **sekcija learna = kategorija, a kategorija VEĆ ima `color`** (§3.2 blokovi + §3.3 tokeni) — čisto UI-posao u U6–U8, bez novog modela.
7. **Tekst i mediji u learnu (2026-07-14):** mijenja se i **boja SAMOG TEKSTA** — plutajuća mini-traka nad označenim tekstom (token-nijanse a11y-sigurne na dark podlozi, obrazac `--danger-text`) + bold/italic + **pretvori-u-link**; learn blok se proširuje **slikama, linkovima, videom i karticama-poveznicama na druge stranice/izvore**. SVE prolazi kroz JEDAN sigurnosni renderer (§6): whitelist tagova/atributa, URL-sanitizacija, `noopener` — editor ne smije proizvesti ništa što renderer ne zna sigurno prikazati.
8. **Resize kvadratića + vizualni standard „čisto i bogato" (2026-07-14):** kvadratić ima **donju liniju-ručku — povuci = veća kućica** (spremljena visina = stil-token bloka); i općenito: editor NE smije izgledati „mršavo" — dubina (sjene/glow), staklo-efekti, gradijenti na primarnim akcijama, mikro-animacije, dot-grid canvas. Mjerilo = mockup C nakon vizualnog redizajna (`design/mockups/editor-c-tok.html`).

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
- ⬜ **DB id-resync (preduvjet U6 delete/reorder):** DB `subject_content` payloadi nemaju `id` po stavci (zrcalo sinkano prije U2a) → idempotentne strukturne ops (delete/reorder) adresiraju po id pa na DB-payloadu ne rade sigurno. Rješenje = re-sync baze iz datoteka (koje imaju U2a id-jeve) preko `scripts/migrate-content.js`; ujedno dovršava U2a zrcalo + unaprijed služi F5 SRS. **PROD data-op** → traži: (1) dokaz „datoteke==baza po sadržaju" prije, (2) Leonov izričit OK, (3) MCP-verifikaciju da re-sync SAMO dodaje id-jeve. `add` ne treba ovo (nova stavka = svjež id).

## 12. Brick-sekvenca (ŽIVA — ažuriraj status ovdje)
> Nastavlja F4 (CRUD_PLAN); „F4.4-kategorije" i F4.5/4.6 se izvode KROZ ovaj slijed (strukturne operacije = unutar draft-moda).
> **Paralelna S-staza (Saša, content — [TEAM.md](TEAM.md) §4):** neovisna o U-stazi (v1-format datoteke; U2-migracija ih obuhvaća).
> Jedina ovisnost: **S7 (MUT/MOR) čeka U2.5.**
>
> **🎨 PRESLAGIVANJE (Leon, 2026-07-13):** admin CRUD Leonu nije cilj za sebe — gradi se KAO TEMELJ UGC-a, a današnji utility-UI (viewer+modali) mu ne odgovara. Odluka: **(1)** nakon U4 ide **U-UX dizajn-faza** (2–3 interaktivna HTML mockupa → Leon presudi → `EDITOR_UX.md`) pa se U6/U7/U8 grade JEDNOM, direktno u tom dizajnu — dizajn PRIJE editor-koda = „pravi trenutak" za editor; **(2)** **U5 (povijest/Vrati UI) ODGOĐEN** iza editora (admin-only kozmetika, UGC-u ne treba odmah); **(3)** **osvježenje CIJELE platforme** (landing/study/browse) = ZASEBNA faza NAKON U-staze — kandidat uz F5 SRS ili pred-UGC lansiranje („u pravom trenutku" — Leon presuđuje kad; ne usred CRUD-a i ne dok Saša gura content-PR-ove, da se izbjegnu masovni CSS konflikti).

| # | Cigla | Status |
|---|---|---|
| U0 | EDITOR_PLAN.md (ovaj dok) + naznaka u VISION | ✅ 2026-07-09 |
| U1 | **Staging Supabase** (2. projekt, SQL sync, rls-check/authed na staging) | ✅ 2026-07-10 (`40dc07b`): `sokrat-staging` + shema + test-admin; test-only override u `js/auth.js` (prod default no-op); test:authed 6/6 + write-verify + rls-check vs staging; PROD audit NETAKNUT |
| U2a | **Schema v2 — stabilni `id` po stavci** (migracija AST-surgical `scripts/add-item-ids.js` + validator prima v1/v2) — id po kartici/quizu/fillu/kategoriji/learn; **čisto aditivno, render netaknut, napredak se NE prevezuje** | ✅ **2026-07-11 (`b490172`)** — rollout na **svih 18** (56 study-datoteka, ~4787 id-jeva; 7 exercises/lib i 5 praznih kompozicija isključeni); content-identical **dokazan** (strip-id === HEAD 56/56); `validate:schema` 54/54; `verify` 0; **smoke test 223/0**. **`schemaVersion` IZBAČEN iz U2a → U2b** (top-level meta-ključ ruši `Object.keys(content)` iteracije u ~9 runtime-mjesta → smoke test to uhvatio) |
| U2b | **`schemaVersion` + runtime meta-filter (`getCategories()` helper) · `style`-tokeni · progress dual-key** — SVJESNO ODGOĐENO (id-jevi „samo leže" = nula rizika; ovo nosi rizik / treba runtime-podršku, čeka razlog: **SRS/F5 ili reorder/U6**). Nije preduvjet za U2.5. Skripta već ima opt-in `--schema-version` flag | ⬜ |
| U2.5 | **ADR-022 catalog identitet (PULL-FORWARD, ADR-023):** placement≠sadržaj, dijeljenje veznih predmeta unutar fakulteta — preduvjet MUT/MOR (S7). **3 tvrda uvjeta:** nakon U1+**U2a** (nikad isprepleteno) · aditivno/dual-mode · puni gate + staging | ✅ **2026-07-11 (`b969892`)** — `placement[]` dual-mode u catalog helperu (legacy XOR placement; legacy = iste reference, ponašanje identično) · `placementsOf()/isInProgram()` · 3 direktna `.programId` potrošača → helper · verify-gate = 4 ADR-022 invarijante (+`CATALOG_PATH` fixture-testovi: gate dokazano PADA na svih 5 prekršaja) · unit 11/11 · smoke 223/0. Napomena: staging nije bio potreban (čisto klijentski/catalog sloj, baza nedirnuta) |
| U3 | **Draft-sloj + ops + edit-mode ljuska**; 4 postojeća editora → pišu opove u draft | ✅ **KOMPLETAN 3/3 (2026-07-12)** — d1 ✅ (`281f5e3`) `js/draft-store.js` (begin/applyOp/discard/commitDone + autosave-restore uz fingerprint; id-prednost + idx-fallback; 16/16) · d2 ✅ (`468e477`) edit-mode ljuska („Uredi lekciju"→traka+brojač+Objavi/Odbaci+beforeunload) + **4 editora → applyOp** (edit-gumbi SAMO u draft-modu; stari RMW/propagate put uklonjen; „Objavi" = working blob + isti opovi na siblinge `applyOpsTo`) + seed-staging (te2, 3 reda); authed **7/7 vs staging** (E2E draft-tok) + smoke 224/0 · **d3 ✅ ŽIVA VERIFIKACIJA OBJAVI-puta na STAGINGU** (privremeni authed spec, obrisan): marker edit → **Objavi** → re-enter draft (SVJEŽI DB fetch) pokazao marker → revert drugom objavom → re-enter pokazao original. **MCP cross-check:** završni md5 sva 3 te2 reda **== baseline** (bit-točan revert) · `content_versions` 0→**4** (#1–2 = snapshoti ORIGINALA prije markera → undo radi; #3–4 = snapshoti S MARKEROM kod reverta → dokaz da je marker bio živ u bazi i propagiran na final) · te2M2 netaknut (sibling-skip točan) · editor = test-admin · **PROD netaknut**. ⚠ base_version = U4 |
| U4 | **Publish-RPC** (atomično: validacija+upis+verzija+final-sync+`base_version`); klijent objavljuje kroz RPC | ✅ **2026-07-13 (grana `feature/u4-publish-rpc`, `1e89f99`+`d251e78` — 🚀 DEPLOYAN NA PROD 2026-07-14 `056d963`)** — `supabase/u4-publish-rpc.sql`: `subject_content.version` (bigint, default 1) + `touch_subject_content` trigger (version bump na SVAKI update, i mimo RPC-a) + **`publish_document(subject, writes[])`** SECURITY DEFINER (is_admin → FOR UPDATE lock → `base_version` usporedba → validacija → SVI redovi lekcije u 1 transakciji; EXECUTE revokean anon/public). Klijent: `begin()` pamti `baseVersion` (uvijek svjež), `_publishDraft` = **1 rpc() poziv** (working + svježi sibling-payloadi s istim opovima), konflikt = poseban toast, `commitDone(newVersion)` re-baseline; propWarn/best-effort put UKLONJEN. **Dokazi:** REST 10/10 (anon-denied 401 · conflict · **atomičnost**: valjan+nevaljan batch = ništa upisano · bad_payload · publish v1→2 · stale-base · revert v2→3) · unit 19/19 · **authed 9/9** uklj. novi TRAJNI `tests/publish-rpc.authed.spec.js` (publish-ciklus kroz UI: marker→Objavi→reload+svjež DB fetch→revert; **konflikt-E2E**: out-of-band bump → RPC odbija, draft preživi, KONFLIKT-tekst ni u auditu) · MCP: md5 sva 3 reda == baseline, M1 v6/Final v3/M2 v1, cv 6→11. Migracija staging + **PROD 2026-07-14 (verificirana 10/10 MCP; redoslijed poštovan — SQL prije klijenta; `79f17c7..056d963`)** | 
| U-UX | **Dizajn-faza: mockupi → presuda → `EDITOR_UX.md`** (umetnuta preslagivanjem 2026-07-13) | ✅ **2026-07-14 (grana `design/u-ux`, `d256506..854a1dd`+docs)** — 3 interaktivna mockupa u `design/mockups/` (A „Studio" · B „Vodič" · **C „Tok" = spoj po Leonovoj ideji: Studio dom + wizard-modal ulaz**); 3 kruga Leonovog feedbacka ugrađena u C (＋/✕ tabovi modova · boje sekcija s nasljeđivanjem na kartice/kviz · boja SAMOG teksta + linkovi/stranice · **resize-ručka kvadratića** · vizualni redizajn „čisto i bogato"); zahtjevi zapisani = **§5.1 točke 1–8**; QA smoke **36/36**. **PRESUDA: smjer C POTVRĐEN** („za sada tek toliko OK" → letvica se diže iterativno kroz U6–U8) → **[`EDITOR_UX.md`](EDITOR_UX.md) v0.9 = dizajn-ugovor** (živi izvor izgleda = mockup C) |
| U5 | **Povijest verzija / Vrati UI** (čita `content_versions`; restore kroz RPC) + čišćenje test-audita (uz OK) | ⬜ ODGOĐEN iza editora (preslagivanje 2026-07-13) |
| U6 | **Strukturne operacije** u draftu (stavke pa kategorije: dodaj/obriši/presloži) | ✅ **KOMPLETAN** (grana `feature/u6-structural-ops`, PREVIEW). **Ops-sloj ✅:** U6a `d9dc764` (add/remove/reorder × flashcards/quiz/fillBlanks) + U6b `8e0538f` (addCategory/removeCategory/reorderCategories/updateCategory) — **IDEMPOTENTNI po konstrukciji** (add=guard po id · remove=no-op ako nema · reorder=apsolutni red · kategorije po ključu) → sibling-sync op-replay (`applyOpsTo`) ostaje ispravan, **publish-put NETAKNUT** (ranija bojazan iz koda razriješena dizajnom). Čisto aditivno na `draft-store.js`; draft-store unit **37/37**. **UI (add) ✅:** U6c-1 `4379edd` (kartica) + U6c-2 `69f9c73` (kviz+fill) + U6c-3 `5c7f450` (prazni modovi vidljivi u draftu → dodavanje prve stavke) — reuse editor-modala u „add" modu; Playwright **234/0** (svi authed admin). **Kategorije-UI ✅ KOMPLETNA (add/edit/reorder/remove):** U6d-1 `211daad` (dodaj/uredi: `adminCatModal` name/icon/color → `addCategory` svjež ključ=id+prazni nizovi / `updateCategory` samo meta) + U6d-2 `b5e8408` (zaglavlje = flex-red naslov+kontrole ↑↓✎🗑; presloži → `reorderCategories`, krajnje strelice disabled; obriši → askConfirm danger → `removeCategory`, poništivo „Odbaci"/content_versions). Ops-sloj U6b nedirnut → publish-put isti; gateovi verify 0 / typecheck 0 / draft-store 37/37 / bump 96 / build:css u sinku. **Živo verificirano (2026-07-16):** `tests/category-ops.authed.spec.js` (trajni authed E2E na staging te2, draft-only: add→edit→reorder→remove kategoriju kroz pravi UI, staging DB netaknut) → **test:authed 10/10 + smoke 234/0**. **Item delete/reorder ✅ KOMPLETAN (U6e, 2026-07-17):** DB id-resync odrađen (preduvjet — DB payloadi bili pre-U2a bez id-jeva): read-only **„datoteke==baza" dokaz 51/51** (strip-id md5) → `scripts/migrate-content.js` za **16 eng. predmeta** (id-jevi u bazi, v3, sadržaj identičan, studentima nevidljivo). U6e-1 `4522644` (🗑 po kartici/kvizu/fillu → askConfirm → `removeCard/Quiz/Fill`) + U6e-2 `579f373` (↑↓ u `.admin-card-ctrls` grupu → `reorderCards/Quiz/Fill`, krajnje strelice disabled). Ops-sloj U6a nedirnut → publish-put isti. **Živo verificirano:** `tests/item-ops.authed.spec.js` (`1d38841`; trajni authed E2E: dodaj 3 kartice → presloži ↑ → obriši, draft-only, staging netaknut) → **test:authed 11/11**. **STRUKTURNE OPS TIME KOMPLETNE** (kategorije + stavke: add/edit/reorder/remove). **Slijedi: C-vizual U8.** (Napomena: `management-hr` datoteke nemaju id-jeve — kreiran nakon U2a; treba `add-item-ids.js` prije nego HR podrži item-ops. Usput 07-17: HR kratko upao u bazu Leonovim no-arg migrateom → obrisan, HR ostaje file-first.) |
| U7 | **Learn-blokovi**: model + JEDAN renderer + `legacy-html` + YouTube-blok (razrada = §12.1) | ✅ **KOMPLETAN** (U7a·b·c·d·e, 2026-07-19/20) — meta-filter + jedan renderer (sigurnosna granica zatvorena) + schema v2/validator + blok-ops u draftu |
| U8 | **Vizualni editor = Studio iz mockupa** (razrada §12.2, **RE-PLAN 2026-07-20**). **U8-prep ✅ 2026-07-18** (rascjep `admin.js`→`admin-editors.js`). **U8a ✅** (`block-editor.js` jezgra; bolt-an na stari admin → „katastrofa" → **ZAOKRET opcija b: Studio-kosti prve, vizual zadnji**). **U8.1 ✅** (Studio-skelet `#editor-page`: topbar/stablo/canvas/mode-tabovi/inspektor). **U8.2 ✅** (blok-editor u learn-pane: „Uredi"→draft, migracija v1→blokovi, add/reorder/remove). **U8.3 ✅ 2026-07-21** (kartice/kviz/fill uredljivi = 100% reuse admin). **U8.4a ✅ 2026-07-22** (inline uređivanje teksta: contenteditable + serijalizator DOM→runs + B/I traka; authed 14/14, unit 32). **U8.4b ✅ 2026-07-22** (boja-swatch-evi + 🔗 link u traci; authed 15/15). **U8.5 ⏳ u tijeku** (a=slika ✅ `576d73b`; slijedi b=video/c=formula/d=tablica/e=resize+callout/f=boje sekcija). **SLIJEDI: U8.5b (video) → … → U8.6 (VIZUAL).** | ⏳ (U8a/U8.1–U8.4b ✅, U8.5a ✅; U8.5b slijedi) |
| U9 | `final` = kompozicija (dual-mode po predmetu) → potом F4.5 export/dry-run + F4.6 flip izvora istine | ⬜ |
| — | dalje: F5 SRS (trivijalan uz ID-jeve) → F6 sigurnost (CSP/DOMPurify formalno) → H2 UGC → H3 AI/MCP | ⬜ |

### 12.1 U7 razrada — learn-blokovi + JEDAN renderer (plan 2026-07-19)

**Cilj (DoD):** learn prelazi sa „sirovi HTML string" na **blok-model** (`learn.blocks[]`), a SAV render learna ide kroz **JEDAN renderer** (study + editor-preview + budući marketplace) = **sigurnosna granica**. Legacy 18 predmeta rade **identično** (v1 = jedan `legacy-html` blok kroz DOMPurify). **Bez DB DDL-a** (blokovi + `schemaVersion` žive u `payload` jsonb → export/dual-read ih nose „besplatno", čisti podaci ≠ vježbe/BUG-012). Aditivno/reverzibilno po cigli; svaka cigla = prod-safe + gate-ovi + smoke; radi se na grani, prod netaknut do izričitog deploy-OK-a.

**Nalaz s terena (2026-07-19):** renderer danas = `learn.js` `renderLearnContent()` → `innerHTML = learn.content` (SIROVI HTML); **DOMPurify i YouTube-builder NE postoje**; **10 mjesta** sirovo iterira `Object.keys(content)` (`flashcards/quiz/fill-blanks/learn/progress×3/admin×2/draft-store`).

| Cigla | Što | Rizik | Provjera |
|---|---|---|---|
| **U7a** ✅ **2026-07-19** | **Meta-safe runtime (bivši U2b — razlog stigao):** `getCategories(content)` helper u `content-loader.js` (global; kategorija = ključ čija je vrijednost OBJEKT-ne-niz → auto-isključuje `schemaVersion`=broj/`composedOf`=niz; prazna `{}` ostaje) → ožičen u **9/10** `Object.keys` mjesta (8 render/collect: flashcards/quiz/fill/learn/progress×3/admin + admin `_moveCategory`). **draft-store `_catAdd` svjesno ostavljen** (node-izoliran IIFE bez browser-globala; već meta-safe: umeće na kraj + `_setKeyOrder` čuva ne-listane ključeve). `schemaVersion` = marker (odsutan/1 = v1 · 2 = blokovi); legacy se NE stampa masovno. **Dokazi:** getCategories unit **8/8** · draft-store 37/37 · verify 0/0 · typecheck 0 · **authed 11/11** · **smoke 236/0** · bump 97. | NIZAK (no-op na sadašnjim podacima) | ✅ unit 8/8 + authed 11/11 + smoke 236/0 |
| **U7b** ✅ **2026-07-20** | **JEDAN renderer (izolirano):** novi `js/blocks-renderer.js` — `renderBlocks(blocks)` → SIGURNI HTML string; 9 tipova (`heading/paragraph/list/callout/image/video/table/formula/legacy-html`) s ESCAPANIM poljima + `renderInline` (runs b/i/boja-token/link) + `safeUrl` (scheme-allowlist) + YouTube facade (validiran 11-znak ID → `youtube-nocookie`, klik-za-učitavanje, **nula YT-poziva prije klika**). `formula` → delimiteri za `renderMath` (js/math.js). `legacy-html` → `window.DOMPurify` **ako postoji**, inače siguran raw-fallback (v1 = naš povjerljiv sadržaj). CSS `css/learn-blocks.css` (27. modul). **⚠ Odstupanje od plana (svjesno):** stvarno UČITAVANJE DOMPurify-a (CDN kao KaTeX) + student-wiring = **U7c** → U7b ostaje **istinski izoliran** (nula CDN/perf-utjecaja, nula student-promjene, nula neprovjerenog CDN-a u ovom koraku). **NIJE ožičen na study** (U7c). **Dokazi:** `blocks-renderer.test.js` **23/23** (svaki tip + **XSS-fixtures**: `<script>`/`onerror`/`javascript:`/`data:svg` neutralizirani · `safeUrl` · YT-ID) · verify 0/0 · typecheck 0 · **smoke 236/0** · bump 99. | SREDNJI (sigurnosno-kritično) | ✅ unit 23/23 + smoke 236/0 |
| **U7c** ✅ **2026-07-20** (Leon „idemo sada") | **Flip sigurnosne granice:** `learn.js` `renderLearnContent()` → dual-mode: v2 (`learn.blocks`) → `renderBlocks`; v1 (`learn.content`) → `renderBlocks([{type:'legacy-html'}])` → **DOMPurify**. SAV learn sad ide kroz sanitizirajući renderer (jedan put za study+editor+marketplace). DOMPurify učitan (CDN **3.2.6**, `defer`, obrazac kao KaTeX; renderer ima siguran fallback ako CDN padne). `renderMath` i dalje na kraju (KaTeX delimiteri = tekst → prežive). | **NAJVEĆI** (živi student learn-put) | **Parity (jsdom nedostupan → statička POKRIVENOST + runtime):** `legacy-html-coverage.test.js` skenirao **468 blokova / 19 predmeta** → allowlist dokazano SUPERSET (23 taga, 7 atributa). **KLJUČNI NALAZ: `style` (331×) nije bio dopušten** (gradijenti/centriranje u `tip-box`) → dodan u config (+`value`); da nije, 331 stil bi nestao = regresija. Runtime `learn-parity.spec.js` (PRAVI DOMPurify): klase+`style`+gradient sačuvani, XSS (`script`/`onclick`/`javascript:`) blokiran. coverage-gate 4/4 · parity-spec ✅ · authed 11/11 · **smoke 240/0** · bump 99 |
| **U7d** ✅ **2026-07-20** | **Schema v2 + validator + round-trip (tooling; runtime NEDIRNUT):** `subject-content.schema.json` — `learn` dual-mode `anyOf` (v1 `content` ILI v2 `blocks`) + `block` (`oneOf` 9 tipova, svaki `additionalProperties:false` + `const` type) + `inline`/`run` (string ILI runs, boja-enum) → ugovor **1:1 prati `blocks-renderer.js`** (nema mrtvih polja). `validate-content.js` learn dual-mode (`validateBlocks`: nepoznat tip = greška; KaTeX-balans na inline prozi; formula.tex/video/legacy izuzeti). **Bez DB DDL** (blokovi + `schemaVersion` u `payload` jsonb → export/dual-read ih nose kao čiste podatke). **Dokazi:** novi `schema-v2-blocks.test.js` **16/16** (① prihvaća v2 svih 9 tipova + v1 back-compat · ② odbija 9 pokvarenih: nepoznat tip/višak polja/nedostaje required/level>4/loš enum/video bez izvora/learn bez sadržaja · ③ round-trip `JSON.stringify→parse` bit-točan + renderer daje IDENTIČAN izlaz) · **validate:schema 57/0** (sav v1 i dalje valjan) · validate:content 0 grešaka · verify 0/0 · typecheck 0 · bump nije trebao (0 served asseta). | NIZAK-SREDNJI (tooling; ne dira runtime) | ✅ schema-v2 16/16 + validate:schema 57/0 + round-trip |
| **U7e** ✅ **2026-07-20** | **Blok-ops u draftu (data-layer za U8):** `addBlock/removeBlock/reorderBlocks/updateLearnBlock` u `draft-store.js`. Blokovi žive na `cat.learn.blocks` = JEDAN nivo dublje od flashcards/quiz/fill → `_dispatch` razrješava ugniježđeni niz (add smije kreirati `learn`+`blocks` — prvi blok u praznom/ v1 modu, `content` ostaje netaknut), pa **reuse-a isti idempotentni `_struct*` mehanizam** (add: guard po id · remove: no-op · reorder: apsolutni red) + `_findIndex`/`_assignPatch` za `updateLearnBlock` (patch po id, null-briše-ključ). **Aditivno na dokazani ops-sloj → publish-put/sibling-replay NETAKNUT.** **Dokazi:** draft-store unit **50/50** (+13: add idempotent/at/KOPIJA · create-learn · no-learn error · remove id+idx+no-op · updateLearnBlock patch/null/not-found · reorder apsolutni/nedestruktivni/idempotent · **dvostruka `applyOpsTo` na sibling = kao jednom**) · verify 0/0 · typecheck 0 · bump `20260720143118` (js dirnut). | NIZAK (aditivno na dokazani ops-sloj) | ✅ draft-store 50/50 |

**Redoslijed/ovisnosti:** a → b → c = lanac (temelj → renderer → flip); d i e relativno neovisni (mogu zamijenjeno) ali logično iza c. Nakon U7 → **U8** (blok-editor ožičuje `renderBlocks` za preview + blok-ops).
**Nedirano u U7:** `final`=kompozicija (§3.4 = U9) · kartice/kviz ostaju ČISTI TEKST (§3.2) · migracija legacy→blokovi = OPCIONALNA, predmet-po-predmet, kasnije (ne blokira U7).
**⚖️ Odluka (cigla U7c) — čeka Leona:** rutirati legacy kroz DOMPurify SAD (**preporuka** — „jedan renderer" je cijela poanta U7-a; 18 kontroliranih predmeta + parity-harness = sigurnije nego retrofit poslije UGC-a) vs. odgoditi (v1 ostaje sirov dok ne stigne UGC). Preporuka = SAD, uz parity-gate kao osigurač. **[RIJEŠENO 2026-07-20: rutirano SAD — U7c ✅.]**

### 12.2 U8 razrada — vizualni editor (Studio iz mockupa) — RE-PLAN 2026-07-20

**⚠️ STRATEŠKI ZAOKRET (Leon, 2026-07-20 — KLJUČNA POUKA za buduće planiranje):** prva verzija U8 (v. „prekriženi pristup" niže) gradila je blok-editor **na stari admin** (lista kartica) i vizual „čisto i bogato" stavila **ZADNJI**. Na živom previewu (U8a `4794498`) Leon presudio: *„ovo je katastrofa, ne vidim razlike od prije"* — jer (1) blok-editor sam **skrio** (gate na v1 kategorijama; accounting = sve v1 → vidi se STARI editor), i (2) bolt-an na **krivu kost** (stari admin ≠ mockup Studio). **ODLUKA (opcija b):** vizual **ostaje zadnji** (funkcija prva = manje bacanja + koherentniji finiš JER je mockup zaključan ugovor), **ALI funkciju gradimo na KOSTIMA MOCKUPA** (Studio: stablo/canvas/paneli/kvadratići), grubo stilizirano i **VIDLJIVO** → zadnji vizualni prolaz = samo CSS-polish, ne prepis. **Pouka: kod editor-UI-ja kreni od strukture CILJNOG dizajna, nikad ne bolt-aj na staru ljusku, i ne skrivaj novu funkciju.**

**Polazište:** `design/mockups/editor-c-tok.html` (644 LOC, QA 36/36) = POTVRĐEN vizual+ponašanje. **U8 = oživjeti Studio** = mockup-struktura + dokazani backend: draft-OPOVE (U7e), JEDAN renderer (U7c), publish-RPC (U4), katalog. Spike biblioteke NIJE potreban (mockup je custom = odluka; §5 uvjet 4 zadovoljen). **Backend (U7) 100% reused — zaokret je SAMO front-end ljuska.**

**Odluke (Leon potvrdio 2026-07-20):** ① Studio = **nova stranica `#editor-page`** (stari `#admin-page` ostaje fallback dok Studio ne bude gotov, pa se **umirovi**). ② Današnja **U8a admin-integracija** (`admin.js` bolt-on blok-editora na staru listu) = kriva-kost → **UMIROVLJUJE se** pri gradnji Studija; **zadržava se `block-editor.js` JEZGRA** (renderEditor/mount/ops-wiring, unit 18/18) → seli u learn-pane Studija (U8.2).

**Sigurnosno (nepregovorljivo):** editor-preview = ISTI `renderBlocks` (granica U7c); izmjene = opovi (U7e) → „Objavi" = publish-RPC (U4). Nula novog write-puta; admin-only + lazy.

**Brick-slijed (RE-PLAN — Studio-kosti prve, vizual zadnji):**
| Cigla | Što | Rizik | Provjera |
|---|---|---|---|
| **U8.1** ✅ | **Studio-skelet (struktura, grubo stilizirano):** nova `#editor-page` (`studio.js`+`studio.css`) — topbar+breadcrumb · **STABLO** (fakultet→…→predmet→skripte, iz kataloga) · canvas (naslov+meta+mode-tabovi + read-only PREVIEW kroz JEDAN renderer) · inspektor-stub; Objavi/Odbaci ožičeni na **JEDAN** draft/publish engine (`SokratAdmin.studioBridge` → U4 RPC). Zamjenjuje „select subject/lesson" dropdowne. Ulaz = admin-only „Studio editor" gumb u profilu (stari „Edit content"→#admin-page koegzistira). | VELIK (nova ljuska) | ✅ live-smoke (stablo 57, 4 taba, 0 err) + unit 130 + admin-regresija 40/40 |
| **U8.2** ✅ | **Learn-pane = blok-editor u canvasu:** `block-editor.js` jezgra montirana u Studio learn-pane (kvadratići), VIDLJIVA, na pravim kostima. „Uredi lekciju" (`studioBridge.enter` → svjež DB payload + base_version) → draft-mod; blok-ops (add/reorder/remove) kroz U7e draft. **SIGURNOST (`learn.js` bira blokove NAD `content`):** editor se montira SAMO na v2/prazne kat.; v1 dobiva poništivu **„Uredi kao blokove"** migraciju (content→`legacy-html` blok, ništa se ne gubi). Kartice/kviz/fill = read-only preview (U8.3). **Usput:** popravljen `.be-bigplus` menu-bug (prva ŽIVA uporaba block-editora — U8a imao samo unit). | SREDNJI | ✅ trajni `studio.authed.spec.js` (Uredi→migracija→dodaj blok→presloži→Odbaci) + authed 12/12 + smoke 10/10 |
| **U8.3** ✅ | **Kartice/kviz/fill = uredljivi u canvasu:** edit-mod panela renderira iste `data-admin-*` kontrole (✎ uredi · ＋ dodaj · 🗑 obriši · ↑↓ presloži) → **100% reuse** admin modal-editora + `document`-listenera + strukturnih ops; novi **re-render hook** `_adminRerender`→`SokratStudio.onDraftChanged()` osvježi Studio canvas nakon svake draft-op; **aktivni tab očuvan** (`_activeMode`) kroz re-render. Prazan mod prikazan u draftu (dodaj prvu stavku). | SREDNJI | ✅ `studio.authed.spec.js` +test (Dodaj→uredi→obriši, tab očuvan) + authed 13/13 + smoke 10/10 |
| **U8.4a** ✅ | **Inline uređivanje teksta (upisivanje + B/I):** tekstualni blokovi (heading/paragraph/callout/list) = `contenteditable` polja; focusout → serijalizacija DOM→`inline runs` (`editableToInline`) → `updateLearnBlock` (BEZ re-crtanja, čuva caret); plutajuća traka B/I (execCommand). **SIGURNOST:** sadržaj se NIKAD ne sprema kao HTML — destilira se u kurirani model `{text,b,i,color,href}` (nepoznato formatiranje curi u čisti tekst); ne-tekstualni blokovi ostaju read-only preview. Serijalizator round-trippa i boju/link (za postojeći v2 sadržaj). | SREDNJI (contenteditable→runs) | ✅ unit 32 (serijalizator round-trip, fake-DOM) + `studio.authed.spec.js` +test (upiši→bold→runs) + authed 14/14 |
| **U8.4b** ✅ **2026-07-22** (`a40799f`) | **Boja + link u traci:** 4 swatch-a (`lb-color-<token>`: indigo/zelena/jantar/crvena) + „ukloni boju" ⊘ + 🔗 (`prompt` za URL, predpopunjen postojećim, prazno=ukloni). **execCommand ne može stvoriti klasu → ručno omatanje** selekcije u `<span class="lb-color-…">`/`<a href>` (skida staru boju/link prije = bez ugnježđivanja). `sanitizeLink` = light-provjera sheme na UNOSU (odbija `javascript:`/`data:`; goli domen→`https://`), `safeUrl` (renderer) granica na PRIKAZU. Serijalizator ih već round-trippa (U8.4a) → cigla = samo UI+apply. | NIZAK (nadogradnja trake) | ✅ block-editor unit 32/0 + `studio.authed.spec.js` +test (swatch→`color:green`; 🔗 prompt→`href`) + **authed 15/15** + css-drift 0 |
| **U8.5** ⏳ | **Media/strukturni blokovi + boje** — dijeli se u pod-korake (obrazac = forma-polja umjesto contenteditable). **U8.5a ✅ 2026-07-22 (`576d73b`):** **slika** = add-tip u ＋ + uredljiva forma (`<input data-be-mfield>` src/alt/caption) + živi preview kroz JEDAN renderer; `change`→patch iz svih polja→`updateLearnBlock`→osvježi samo `.be-media__preview`; unit 35, authed 16/16. **SLIJEDI:** b=video (YouTube facade) · c=formula (KaTeX) · d=tablica (grid) · e=resize-ručka slike + callout-varijanta · f=boje sekcija + nasljeđivanje (§4). | SREDNJI | authed + validate:schema v2 |
| **U8.6** | ⭐ **VIZUAL ZADNJI — „čisto i bogato":** staklo/blur · gradijenti (primarne akcije) · dot-grid · mikro-animacije · breadcrumb-čipovi · inspektor-polish → parity s mockupom C. JEDAN koherentan prolaz preko GOTOVE funkcije. | SREDNJI (CSS-polish, NE prepis) | vizual (Leon presuđuje) + smoke |
| — | struktura-CRUD u stablu (＋ na razinama, §5.1-1) = zasebna cigla NAKON U8 (katalog-kao-podatak, §3.5) · umirovi `#admin-page` · wizard „Nova skripta" (§6) unutar U8.1/kasnije | — | — |

**Otvorene odluke (padaju u ciglama):** upload slika (storage) · undo/redo UI (op-stog postoji) · mobilni layout (inspektor <1020px). Svaka cigla mjerena prema mockupu C; grana `feature/u6-structural-ops`, prod netaknut do izričitog deploy-OK-a.

**~~PREKRIŽENI pristup (07-20, ISPRAVLJEN):~~** ~~U8a learn-blok-editor NA STARI admin → U8b tekst → U8c media → U8d kartice → U8e Studio+vizual ZADNJI.~~ Zamka: vizual-zadnji na krivim kostima = prepis na kraju + skrivena funkcija (Leon: „katastrofa"). Zamijenjeno gornjim (Studio-kosti prve, vizual i dalje zadnji).
**Status cigli:** **U8a ✅** (`4794498`, 07-20; `block-editor.js` jezgra + CSS + admin bolt-on; unit 18/18) → jezgra SE ZADRŽAVA (U8.2), admin-integracija SE UMIROVLJUJE. **U8.1 ✅ 2026-07-20** (`js/studio.js` + `css/studio.css` + `#editor-page` ruta + `SokratAdmin.studioBridge`; live-smoke stablo 57 → canvas 4 taba, 0 grešaka). **U8.2 ✅ 2026-07-20** (`block-editor.js` jezgra u Studio learn-pane; „Uredi"→draft, sigurna v1→blokovi migracija, add/reorder/remove; `.be-bigplus` menu-bug popravljen). **U8.3 ✅ 2026-07-21** (kartice/kviz/fill uredljivi u canvasu: edit-mod renderira `data-admin-*` kontrole → **100% reuse** admin modal-editora/listenera/ops; `_adminRerender`→`onDraftChanged` hook osvježi canvas; `_activeMode` očuva tab; **authed 13/13**). **U8.4a ✅ 2026-07-22** (inline uređivanje teksta: heading/paragraph/callout/list = `contenteditable`; focusout→`editableToInline` [DOM→kurirani runs, sigurnosna granica]→`updateLearnBlock` bez re-crtanja; plutajuća B/I traka; usput mount-lifecycle stabilan; **unit 32** [runs↔DOM round-trip, fake-DOM] + `studio.authed.spec.js` +test [upiši→bold→runs] + **authed 14/14** + smoke 10/10). **U8.4b ✅ 2026-07-22** (`a40799f`; 4 boja-swatch-a + „ukloni boju" ⊘ + 🔗 prompt-link u traci; **ručno omatanje** selekcije u `lb-color`/`<a>` jer execCommand ne može stvoriti klasu; `sanitizeLink` na unosu + `safeUrl` na prikazu = granica; serijalizator VEĆ round-trippa color/href → cigla = samo UI+apply; **authed 15/15**, unit 32). SLIJEDI: **U8.5 (media/strukturni blokovi: slika/video/tablica/formula + boje sekcija).**
