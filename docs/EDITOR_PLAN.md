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
| U6 | **Strukturne operacije** u draftu (stavke pa kategorije: dodaj/obriši/presloži) | ⬜ |
| U7 | **Learn-blokovi**: model + JEDAN renderer + `legacy-html` + YouTube-blok | ⬜ |
| U8 | **Editor-spike** → odluka biblioteke → **blok-editor** + custom UI-jevi (kartica-flip, quiz-builder, fill-marker, boje) | ⬜ |
| U9 | `final` = kompozicija (dual-mode po predmetu) → potом F4.5 export/dry-run + F4.6 flip izvora istine | ⬜ |
| — | dalje: F5 SRS (trivijalan uz ID-jeve) → F6 sigurnost (CSP/DOMPurify formalno) → H2 UGC → H3 AI/MCP | ⬜ |
