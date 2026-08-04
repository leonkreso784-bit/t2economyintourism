# CREATE_BACKEND_SPEC v3 — Osobni UGC-graditelj gradiva „od nule"

> **Status:** v3 · vizija POTVRĐENA (Leon 2026-08-02) · **F0 ✅ · F1 ✅ (staging) · F2 ✅ · F3 ✅ · F4 ✅ (§12 slike + §13 E2E) → SLIJEDI F5 = PROD (traži Leonov izričit OK).**
> **Gdje je kôd:** grana `feature/f3-node-editor` (F2+F3); `main` = `63f898f` (F1 SQL+docs). **PROD netaknut.**
> **Nakon F5:** frontend redizajn (Leon), pa objava/dijeljenje + MCP.
> **Pravilo:** svaka faza staje na checkpoint za Leonov OK; **deploy = uvijek izričit OK**. Implementacija slijedi §6.
> **Povijest odluke:** v1/v2 bili su uokvireni oko „službenih predmeta + objava studentima" → **Leon presudio: to NIJE ono što želi.** v3 = prava vizija.

---

## 1 · Vizija (POTVRĐENA)
Leon (2026-08-02): *„korisnik neće stvarat predmet, radit će bilo šta god hoće… gradi sebi fakultet pa predmete pa godine… nešto unutar nečega… drži sejvano na profilu… nema objavljivanja na stranicu, to još ne radimo."* + *„platforma je za SVE, ne samo FMTU — FMTU je odskočna daska."*

**Gradimo osobni, privatni graditelj gradiva „od nule":**
- Korisnik slaže **VLASTITO ugniježđeno stablo** — svoji folderi, koliko god duboko (fakultet › godina › predmet › tema › …), imena i mjesta **po želji** („nešto unutar nečega").
- U **study-čvorovima** gradi gradivo (kartice / kviz / fill / learn) **POSTOJEĆIM editorom + istim rendererom** (100 % reuse).
- Sve **privatno, spremljeno na profilu**. **BEZ objavljivanja** na javni katalog (to još ne radimo).
- **Zvijezda = UGC.** Platforma za SVE → entitet **institucijski-agnostičan** (FMTU je samo odskočna daska; „fakultet" je samo jedan folder-naziv koji korisnik odabere).
- **Kasnije: MCP** — korisnik kaže vanjskom AI-u (ChatGPT/Claude/Gemini) *„spoji se na Sokrat i pretvori moje PDF-ove u gradivo"* → AI puni to isto stablo kroz isti backend.

**Zašto je ovo SIGURNIJE od v1/v2:** privatno i odvojeno od javnog kataloga → **uopće ne diramo studentski vrući put** ni postojećih 22 predmeta. Gradimo novi kutak, ne prepravljamo temelj. Nestaje najveći rizik (async u sinkroni katalog).

---

## 0 · Sveti invarijanti (ne smiju se slomiti)
1. **Jedan renderer = sigurnosna granica** (`blocks-renderer.js`) — nedirnut; study-čvor renderira kroz isti put.
2. **Jedan write-put** — svaki upis kroz SECURITY DEFINER RPC + **owner-check** (`owner_id = auth.uid()`) + audit. Nikad anon/service_role s klijenta (ADR-011/016).
3. **Postojeći javni katalog (22 predmeta) + studentski vrući put = NETAKNUTI.** Osobni graditelj je zaseban, async, prijavljen-only, na profilu.
4. **Vježbe = KÔD (BUG-012)** — izvan opsega; osobni graditelj radi kartice/kviz/fill/learn, ne vježbe.
5. **Privatnost = tvrda RLS** — čvor i njegov sadržaj čita/piše SAMO vlasnik (`owner_id = auth.uid()`). Ovo su osobni korisnički podaci.
6. **Reuse, ne reinvent** — editor (block-editor/admin-editors), draft-store i renderer se ponovno koriste; nova je SAMO stablo-struktura + owner-scoped upis.

---

## 2 · Model podataka

### 2.1 `nodes` — stablo (self-referencijalno, owner-scoped)
| stupac | tip | značenje |
|---|---|---|
| `id` | uuid PK | |
| `owner_id` | uuid **not null** | vlasnik = `auth.uid()` |
| `parent_id` | uuid **null** | roditelj-čvor; NULL = korijen korisnikova stabla |
| `kind` | text | `'folder'` (organizacija) \| `'study'` (nosi gradivo) |
| `name` | text | korisnik imenuje kako hoće |
| `position` | int | poredak među braćom (drag-reorder) |
| `icon`, `color` | text null | opcionalno |
| `created_at`, `updated_at` | timestamptz | |
| `deleted_at` | timestamptz null | **soft-delete** (recoverable) |

**RLS (tvrda):** `SELECT`/`INSERT`/`UPDATE`/`DELETE` SAMO `owner_id = auth.uid()`. Bez javnog reada. Upis kroz RPC.

### 2.2 Sadržaj study-čvora — reuse postojećeg modela
Study-čvor nosi **jedan payload** = ista struktura koju editor VEĆ uređuje (mapa kategorija → `{flashcards, quiz, fillBlanks, learn}`). Bez M1/M2/Final, bez `final`-kompozicije (osobni čvor = jedan payload, jednostavniji od predmeta).

**Spremište:** `node_content(node_id uuid, payload jsonb, version bigint default 1, updated_at)` — zrcali `subject_content` (touch-trigger bumpa `version`; optimistic concurrency preko `base_version`). RLS owner-only preko join-a na `nodes`.

> Alternativa razmotrena: mapirati study-čvor na `subject_content` (subject_id=node_id, var_name='content'). Zaseban `node_content` je čišći (owner-scoped RLS, nema miješanja s javnim predmetima). Presuđuje F1 na stagingu.

---

## 3 · Backend ugovor (RPC-ovi, owner-scoped)
Svi SECURITY DEFINER + **owner-check** (`owner_id = auth.uid()`); nema `is_admin` (ovo je korisnički, ne admin, alat) — ali admin-publish (`publish_document`) ostaje NEDIRNUT za javne predmete.

- **`create_node(p_parent uuid, p_kind text, p_name text) → uuid`** — validira vlasništvo roditelja (ako nije NULL, `parent.owner_id = auth.uid()`) → INSERT čvor (+prazan `node_content` ako `kind='study'`) → vrati id.
- **`rename_node(id, name)`** · **`move_node(id, new_parent, position)`** (validira da novi roditelj = vlasnikov + spriječi cikluse) · **`reorder_nodes(parent, ordered_ids[])`**.
- **`delete_node(id)`** — **soft** (`deleted_at`), rekurzivno označi podstablo; recoverable.
- **`publish_node(node_id, payload, base_version) → new_version`** — owner-scoped content-write (zrcali `publish_document` logiku: FOR UPDATE + base_version + touch). Editor ga zove umjesto admin-publisha kad je u osobnom čvoru.

---

## 4 · Read / UI-model
```
PROFIL › „Moji materijali":
  tree = SELECT * FROM nodes WHERE owner_id = auth.uid() AND deleted_at IS NULL   (async, prijavljen-only)
  → renderiraj stablo (folderi + study-čvorovi); add/rename/nest/reorder/delete kroz RPC-ove
Study-čvor otvoren → POSTOJEĆI Studio editor vezan na node_content payload → uredi → publish_node
JAVNI katalog (22 predmeta) = NETAKNUT, sinkroni kôd kao i dosad
```
Nema catalog-merge, nema objave, nema diranja studentskog puta. Osobni graditelj je **odvojen otok** na profilu.

---

## 5 · Što OVAJ posao NE radi (izvan opsega)
- **Objavljivanje na javni katalog** — Leon izričito: „to još ne radimo".
- **Vježbe** — ostaju kôd; osobni graditelj ih ne autorira.
- **Dijeljenje / javni UGC / moderacija** — kasnija faza (kad bude objave).
- **MCP** — kasnije; reuse `create_node`/`publish_node` (vanjski AI = još jedna vrata na isti backend).
- **Postojeći javni predmeti + admin editor** — nedirnuti (rade kako rade).

---

## 6 · FAZNI PLAN („poslovni plan" — teče brže, gate-ovi drže)
Tempo = **faza-checkpoint** (Leon Q3): unutar faze tečem kroz cigle (gate na svakoj), **STANEM na kraju faze za OK**, deploy = uvijek izričit OK. **Staging prvo.**

| Faza | Isporuka | Gate / dokaz | Dira prod? |
|---|---|---|---|
| **F0** | ovaj spec v3 + potvrda | čitaš ovo | ne ✅ |
| **F1 · DB temelj** | `nodes` + `node_content` + `node_content_versions` + tvrda owner-RLS + RPC-ovi (create/rename/move/reorder/delete/restore/publish_node) — **STAGING** | **✅ 51/51** — v. §9 | ne (staging) ✅ |
| **F2 · „Moji materijali" UI** | Profil-područje: render stabla + add folder/study + rename/nest/reorder/delete (async, prijavljen-only) | **✅ 5/5 authed + 24 unit** — v. §10 | ne (grana `feature/f2-my-materials`) ✅ |
| **F3 · Editor u čvoru** | Otvori study-čvor → postojeći Studio editor vezan na `node_content` → uredi → `publish_node` | **✅ 9/9 authed** — v. §11 | ne (grana `feature/f3-node-editor`) ✅ |
| **F4 · Polish + E2E** | **✅** — privatne slike (§12) · „obriši sekciju" · puni tok na stagingu (§13) | **✅** storage 8/8 · node-images 4/4 · unit 17/17 · **E2E 2/2** · `test:authed` 52/52 | ne ✅ |
| **F5 · PROD** | migracija (SQL prvo, U4-obrazac: `f1-nodes.sql` **pa** `f4-node-images.sql`) → klijent | Vercel READY (pravilo #7) + live-verified | **DA — samo uz izričit OK** ← **ovdje smo** |

Nakon F5 → **osobni UGC-graditelj radi** → **frontend redizajn** (Leon) → kasnije: objava/dijeljenje + MCP.

---

## 7 · Rizici + gašenje
| Rizik | Gašenje |
|---|---|
| Curenje tuđih podataka | tvrda owner-RLS (`owner_id=auth.uid()`) na `nodes`+`node_content`; F1 dokaz owner-izolacije |
| Editor teško vezati na čvor umjesto na predmet | study-čvor = ISTI payload-oblik koji editor već uređuje → tanka adapter-veza (studioBridge na node_content) |
| `move_node` napravi ciklus | RPC provjera (novi roditelj nije potomak) |
| Regresija na javni katalog/22 | osobni graditelj je ZASEBAN (nova tablica, novi RPC, novi UI); publish_document nedirnut; verify/preflight gate |
| Free-tier sleep | graditelj je prijavljen-only + async → prazno/spinner ako baza spava (kao i sync danas); keep-alive cron pomaže |

---

## 8 · MCP-put (kasnije, bez refaktora)
Vanjski AI (ChatGPT/Claude/Gemini) preko MCP-servera: autentificira korisnika → zove **iste** `create_node` + `publish_node` → puni korisnikovo stablo iz PDF-a. **Isti backend, još jedna vrata.** Ne gradi se sad; shema/RPC-ovi su mu spremni.

---

## 9 · F1 — IZVEDENO (STAGING `czljmvigkgiajzjxtndq`, 2026-08-02)
**Artefakt:** [`supabase/f1-nodes.sql`](../supabase/f1-nodes.sql) — idempotentan, **isti fajl ide na PROD u F5**.
**Otisak dokazan:** md5 tijela svih 13 funkcija u fajlu == deployano na stagingu (13/13) → nema drifta repo↔baza.

**Odluke zaključane u F1 (razlika vs §2/§3 nacrt):**
| Odluka | Obrazloženje |
|---|---|
| `node_content` = **zasebna tablica** (ne reuse `subject_content`) | čista owner-RLS; `publish_document` i javni predmeti ostaju potpuno nedirnuti |
| **+`node_content_versions`** (audit) | spec §0 invarijanta 2 traži audit; zrcali `content_versions`, cascade-briše s čvorom (GDPR) |
| **+`restore_node`** | soft-delete je bez smisla bez povrata; treba ga F4 E2E |
| Dijete smije visjeti **samo o `folder`-u** | study-čvor = list koji nosi gradivo; lakše kasnije popustiti nego stegnuti |
| `anon` = NIŠTA, `authenticated` = **samo SELECT** | svaki upis ide kroz SECURITY DEFINER RPC → klijent ne treba write-grantove; usput zatvara i `TRUNCATE` (na njega se RLS NE primjenjuje) |

**Gate — 51/51:**
| Paket | Rezultat |
|---|---|
| Integritet `nodes` (ciklus/self-parent/kind/ime/cascade) | **7/7** |
| `node_content` (study-only · version-bump · cascade) | **4/4** |
| RPC-ovi strukture (create/rename/reorder/move/delete/restore + tuđi čvor + bez prijave) | **20/20** |
| `publish_node` + audit (base_version konflikt · validacija payloada · folder/tuđi/obrisan) | **12/12** |
| **RLS izolacija** (`set role authenticated`, korisnik A vs B-ovi podaci u bazi) | **10/10** — A ne vidi B-ove čvorove/payload/audit; direktan UPDATE/INSERT/DELETE/**TRUNCATE** blokiran (42501) |
| `anon` (neprijavljen) | **4/4** — SELECT i RPC blokirani (42501) |
| **REST smoke** (pravi JWT kroz PostgREST, isti put kao preglednik) | **11/11** — prijava · create_node · GET /nodes (RLS-filtriran) · publish_node · GET /node_content · stale base odbijen · anon 401 · delete_node |
| Regresija nakon poravnanja funkcija na repo-fajl | **19/19** |

**Advisors (security):** 0 ERROR. Tri WARN-a koja sam uveo (trigger-funkcije izložene kao `/rest/v1/rpc/`) **zatvorena**
revokeom. Preostali WARN-i za 7 novih RPC-ova (`authenticated` ih smije zvati) su **po dizajnu** — to JE write-API,
owner-check je unutra; ista klasa kao postojeći `publish_document`.

**Ostalo netaknuto (provjereno):** `subject_content` 3 retka · `content_versions` 162 · `publish_document` postoji.
Staging očišćen od testnih podataka (`nodes` 0). Testni fixture-korisnik `rls-fixture-b@sokrat.local` ostavljen
na stagingu za buduće RLS-provjere.

**Nalaz za PROD (nije regresija, nije hitno):** Supabase-ov default daje `anon`/`authenticated` **pune** privilegije
(uklj. `TRUNCATE`) na SVE tablice u `public` — na produ vrijedi za sve 4 postojeće tablice. Nije iskoristivo preko
API-ja (PostgREST nema TRUNCATE glagol; anon ključ je PostgREST JWT, ne Postgres lozinka), ali je vrijedno stegnuti
istim revoke-obrascem kad se dira prod. Također: **leaked-password protection** je isključen (jedan toggle u dashboardu).

---

## 10 · F2 — IZVEDENO („Moji materijali" na profilu, 2026-08-03)
**Artefakti:** `js/my-materials.js` (`window.SokratMaterials`) · `css/my-materials.css` (`mm-` modul) ·
kartica u `js/profile.js` (`#myMaterials`) · 29 i18n ključeva (HR+EN) · `tests/unit/my-materials.test.js` ·
`tests/my-materials.authed.spec.js`. Grana: `feature/f2-my-materials` (PROD netaknut).

**Što korisnik sad može:** složiti vlastito stablo (folder u folderu, koliko god duboko), napraviti
gradivo-čvor, preimenovati inline, obrisati uz potvrdu i **vratiti obrisano**, te **povlačenjem** ugnijezditi
u folder ili presložiti među braćom. Stanje otvorenih foldera pamti se u `localStorage`.

**Granice poštovane:** čitanje = direktan `SELECT` (RLS filtrira na vlasnika) · **svaki upis kroz RPC** ·
`anon` ne vidi ništa · javni katalog i studentski put **nedirnuti**.

**Gate:** unit **24/24** (buildTree · flattenVisible · isSelfOrDescendant · humanError) ·
**authed 5/5 uživo vs staging** · **puni `test:authed` 32/32** (0 regresije na 27 postojećih) · **`test:responsive` 261/0/15skip** · preflight EXIT 0 ·
drag-test **6/6 uzastopno** (bez flakea nakon ispravka uzroka).

**Tri PRAVA buga uhvaćena i popravljena (ne test-šminka):**
| Bug | Posljedica | Ispravak |
|---|---|---|
| `_lastDeleted` postavljen **nakon** `refresh()` | gumb „Vrati obrisano" se nikad ne nacrta | postaviti prije `refresh()` |
| `refresh()` brisao stablo i pokazivao „Učitavam…" **prije** mrežnog poziva | korisnik vidi gumb i klikne ga dok posao traje → akcija **tiho ne radi ništa** | skeleton samo pri PRVOM učitavanju (`_loaded`) + **`setBusy()`** koji gasi pointer-evente (`.mm-busy`) dok akcija traje |
| auto-scroll s marginom 70px (viewport 800px) | stranica kliže ispod korisnika dok samo lebdi nad donjim retkom → cilj ispuštanja se pomakne | margina 24px = namjerna gesta uz sam rub |

Usput: `dropTargetAt` je sad **totalan** — ispuštanje u sub-piksel procjep između redaka više ne propada u prazno.

**Naučeno o testiranju pointer-drag UI-a** (zapisano i u `TESTING.md`): fiksni cookie-banner presreće
pointer-evente na dnu stranice → pred-postavi consent; a `scroll-behavior: smooth` (`css/variables.css`)
znači da `scrollIntoView` **animira** → `boundingBox()` izmjeri koordinate usred animacije i sintetički miš
sleti na krivi redak. To je bio korijen „flakea" koji je izgledao kao bug u dragu.

---

## 11 · F3 — IZVEDENO (editor u čvoru, 2026-08-04)
Grana `feature/f3-node-editor`. **Staging only, prod netaknut.**

### Što je isporučeno
| cigla | isporuka |
|---|---|
| **K1 · adapter** | node-mod u `studioBridge`: `setNode`/`nodeCtx`; `_enterDraftMode` čita `node_content`, `_publishDraft` zove `publish_node`. `setLesson` gasi node-mod. |
| **K2 · ulaz** | gumb „Uredi gradivo" na study-retku → `SokratStudio.openNode()` → Studio s crumbom „Moji materijali › «naziv»", panelom čvora umjesto katalog-stabla. |
| **K3 · prazan čvor** | „＋ Nova sekcija" (zaglavlje + prazno stanje) → `addCategory` op → Learn odmah aktivan. |
| **K4 · povratak** | „←" iz Studija vraća na profil (već je bilo tako — sad je i gate-ano). |

### Ključni nalaz: adapter je bio TANJI nego što je spec pretpostavljao
Draft-stroj je **generičan po ključu** (`subjectId::lessonId` = obični string). Čvor koristi
**sintetički ključ `node:<uuid>` / `content`**, pa draft, opovi, autosave, blok-editor, draft-chip,
Uredi/Objavi/Odbaci i `onDraftChanged` rade **bez ijedne izmjene**. Promijenile su se točno dvije
IO-točke (odakle se čita, kamo se piše). `draft-store.js`, `block-editor.js`, `blocks-renderer.js`
i `admin-editors.js` = **0 promjena**.

### Nalazi iz izvedbe
| nalaz | značaj |
|---|---|
| `create_node` svakom study-čvoru odmah upisuje `node_content` s `{}` | prazan payload = legitimno početno stanje → K3 je bio manji rizik nego procijenjeno |
| Studio **nije imao nikakav način da doda sekciju** — `addCategory` op postoji u draft-storeu, ali ga nitko nije zvao | bez K3 je nov čvor slijepa ulica; sad postoji jedina afordancija |
| `learnKind` vraća `'v2'` i za **prazan** `learn.blocks` | nova sekcija odmah prikaže Learn → korisnik ima gdje pisati |
| `publish_node` odbija payload čije top-level vrijednosti nisu objekti | RPC brani shemu (uhvaćeno testom koji je slao `{a:1}`) |

### Gate — `tests/node-editor.authed.spec.js`, 9/9
prazan čvor → draft-mod · uredi → `publish_node` → re-load = sadržaj ostao + verzija 1→2 + audit-redak ·
zastarjeli `base_version` → `publish_version_conflict` (izgubljeni upis odbačen) · klik „Uredi gradivo" →
Studio na čvoru (crumb/naslov/panel/„Uredi" ponuđen) · „←" → profil · **prazan čvor → „＋ Nova sekcija" →
Objavi → sadržaj u bazi** · druga sekcija dobiva nesudarajući ključ · `setLesson` gasi node-mod.

**Regresija: nula.** `test:authed` 46/46 (admin `publish_document` put netaknut) · `test:responsive` 279/0/15skip · `preflight` EXIT 0.

### ⚠️ Dva BLOKATORA za F5 (nađena pregledom Leonovog živog rada 2026-08-04)
Leon je uređivao čvor uživo (verzija 3: preimenovao sekciju, promijenio boju, dodao odlomak **i sliku**).
Upload je uspio **samo zato što je `test-admin` ujedno admin**. Pregled `storage.objects` policyja otkrio je:

| # | nalaz | posljedica | kad se mora riješiti |
|---|---|---|---|
| **S1** | bucket `lesson-images` ima **INSERT/UPDATE/DELETE uz `is_admin()`** | **običan korisnik NE MOŽE uploadati sliku** u svoje osobno gradivo — pada na RLS | **prije F5** (inače je značajka mrtva za prave korisnike) |
| **S2** | isti bucket ima **`public read`** (`bucket_id='lesson-images'`, bez owner-provjere) | slike iz **privatnog** čvora su **javno čitljive po URL-u** — stablo i payload jesu owner-only, ali slika nije | **prije F5** (privatnost je obećanje ovog otoka) |

**→ OBA RIJEŠENA u F4-S (2026-08-04). Vidi §12.**

### Manji nalazi
- **Studio nema „obriši sekciju"** — `removeCategory` op postoji u draft-storeu i **zove ga stari admin-overlay** (`js/admin.js`), ali **Studio ga ne nudi**: ima dodaj/preimenuj/boja/presloži, brisanja nema. Za F4.
- Staging nakuplja **soft-delete debris** (214 obrisanih `nodes` + 97 `node_content` redaka od testova). Bezopasno, ali vrijedi povremeno pomesti.

---

## 12 · F4-S — SLIKE OSOBNOG GRADIVA: S1+S2 RIJEŠENI (2026-08-04)
Grana `feature/f3-node-editor`. **Staging only, prod netaknut.**

### Odluka (Leon, 2026-08-04): **prava privatnost, ne obskurnost**
Ponuđene su bile dvije staze: (a) privatan bucket + potpisani URL-ovi, (b) javan bucket s neprobojnom
(UUID) putanjom. Leon je izabrao **(a)** — slika osobnog gradiva ne smije biti dostupna nikome bez prijave.

### Ključni potez: oznaka u payloadu, potpis tek pri prikazu
Potpisani URL **istječe** — da je u payloadu, objavljeni sadržaj bi „istrunuo", a draft-autosave u
localStorage bi vraćao mrtve linkove. Zato:

| sloj | što nosi |
|---|---|
| `node_content.payload` (baza, draft, autosave) | **stabilna oznaka** `node-img:<uid>/<node_id>/<uuid>.<ext>` |
| prikaz (`renderBlocks`) | **potpisani URL**, razriješen kod POZIVATELJA |

Zbog toga **objava ne treba obrnutu pretvorbu** (`working` cijelo vrijeme drži oznake), a
**`js/blocks-renderer.js` ostaje NEDIRNUT** — razrješavanje radi `js/node-images.js` na 3 pozivna
mjesta (`studio.js` learn-body · `block-editor.js` preview · `admin.js` read-only preview).
Fail-safe: nerazriješena oznaka → `safeUrl` odbija nepoznatu shemu → slika se **izostavi**
(nikad polomljen `<img>`, nikad injektiran URL).

### Isporučeno
| cigla | isporuka |
|---|---|
| **S-A · SQL** | `supabase/f4-node-images.sql` — bucket `node-images` **`public=false`**, 5 MB, raster-MIME; 4 policyja (SELECT/INSERT/UPDATE/DELETE) `to authenticated`, uvjet `(storage.foldername(name))[1] = auth.uid()::text`. **Nijedan `public`/`anon` policy. Nijedan `is_admin()`.** Idempotentno; isti fajl ide na PROD u F5. |
| **S-B · dokaz** | policy-razina (u bazi, pod NE-admin identitetom) + HTTP-razina (`scripts/storage-check.js`) |
| **S-C · upload** | `js/block-editor-media.js`: u node-modu → `node-images` + vlasnička putanja + vraća oznaku. Katalog-mod (`lesson-images`) **nedirnut**. |
| **S-D · prikaz** | `js/node-images.js` (`window.SokratNodeImages`): oznaka↔putanja · `newPath` · `collectPaths` (dubinski) · `prefetch` (batch-potpis) · `resolveBlock(s)` (kopija, original netaknut) · `clear`. Prefetch se čeka u `loadNode()` prije prvog crtanja. |

### Gate
| provjera | rezultat |
|---|---|
| **`npm run test:storage`** (novo; HTTP, staging) | **8/8** — vlastiti upload 200 · tuđi prefiks 400 · javni URL 400 · anon dohvat 400 · anon list 0 stavki · potpis tuđe putanje 400 · **potpisani URL vrati istih 70 B** · brisanje 200 |
| **policy-razina u bazi** (ne-admin identitet, transakcija s rollbackom) | **5/5** — T1 vlastiti upis prošao · T2 tuđi prefiks odbijen · T3 korijen bucketa odbijen · T4 vidi samo svoje · T5 anon vidi 0 |
| **`tests/node-images.authed.spec.js`** (novo) | **4/4** — putanja pod vlasnikom · payload zadrži OZNAKU (bez `token=`) · prikaz razriješi u potpis koji stvarno vrati sliku · **katalog-mod nedirnut** |
| `tests/unit/node-images.test.js` (novo) | **17/17** |
| `test:authed` (puni) | **50/50** (bilo 46 — stari U8.7 upload-test i dalje zelen ⇒ nema regresije na katalogu) |
| `preflight` | **EXIT 0** |

### Nalazi iz izvedbe
| nalaz | značaj |
|---|---|
| `uploadImage` je već bio izložen kroz `window.__beMedia(core)` | test gađa **baš proizvodni kod**, ne zaobilaznicu |
| Sinkroni `test()` u node unit-harnessu bi **async tijelo uvijek prikazao zelenim** | dodan `atest` koji se čeka — inače bi 2 testa bila lažno zelena ([[tests-must-be-data-independent]]) |
| Pisanje u `auth.users` je blokirano (i dobro je tako) | fixture-korisniku se ne može postaviti lozinka → ne-admin dokaz izveden u bazi, ne kroz HTTP |
| Supabase odbija `@…​.local` e-mail pri signupu, a staging traži potvrdu e-maila | drugi HTTP-identitet nije bilo moguće dobiti bez diranja `auth.users` |
| Stari `studio.authed.spec.js` U8.7 test **ne čisti** uploadanu sliku | staging `lesson-images` nakupio 18 objekata. Bezopasno; novi F4 testovi čiste za sobom. |

---

## 13 · F4 — DOVRŠEN (2026-08-04)
Grana `feature/f3-node-editor`. **Staging only, prod netaknut.**

### Zadnje dvije cigle
| cigla | isporuka |
|---|---|
| **S-G · „obriši sekciju"** | 🗑 u zaglavlju sekcije u Studiju (`data-st-catdel`) → potvrda (`askConfirm`, `danger`) → **postojeći `removeCategory` op** → draft. Poništivo „Odbaci"-jem, a nakon objave i kroz append-only audit. **Ispravak ranijeg zapisa:** op NIJE bio „mrtav" — zvao ga je stari admin-overlay (`js/admin.js:859`); **Studio** ga nije nudio. Gumb ide `margin-left:auto` (destruktivna radnja odvojena od naslova/kvadratića), crven tek na hoveru. |
| **S-H · puni E2E** | `tests/f4-e2e.authed.spec.js` — **napravi → ugnijezdi → uredi → objavi → obriši → VRATI** u jednom toku, uz tvrdnju koja se najlakše promaši: **sadržaj i verzija prežive soft-delete + restore**, i gradivo se vrati u ISTI folder. |

### Gate (F4 ukupno)
| provjera | rezultat |
|---|---|
| `tests/f4-e2e.authed.spec.js` (novo) | **2/2** |
| `tests/node-images.authed.spec.js` | **4/4** |
| `tests/unit/node-images.test.js` | **17/17** |
| `npm run test:storage` | **8/8** |
| `test:authed` (puni) | **52/52** (bilo 46 prije F4) |
| `preflight` | **EXIT 0** |

### Nalaz iz izvedbe
- **Test mi je prvo pao na krivoj pretpostavci, ne na bugu:** nakon „Odbaci" brojao sam `.st-learn-cat`
  i dobio 0. Studio crta **`.st-learn-cat` u edit-modu, a `.st-kv` u read-onlyju** — izlazak iz drafta
  znači promjenu selektora. Tvrdnja ispravljena (+ dodana provjera da je draft očišćen).
- **Prolazni pad `auth.setup`** („signed in but NOT admin"): `signInWithPassword` prošao, `is_admin()` RPC
  vratio ne-true. Baza provjerena — `test-admin` JEST admin i funkcija je ispravna; ponovno pokretanje prošlo.
  Zaključak: kratkotrajni hiccup nakon mnogo uzastopnih prijava, **ne** defekt.

### Svjesno ostavljeno (nije blokator za F5)
- **Siročad u Storageu:** brisanje bloka ili čvora ne briše objekt iz `node-images`. Nije sigurnosni
  problem (owner-scoped, privatan bucket), nego otpad. Kandidat: `delete_node` koji pomete i prefiks,
  ili periodično mesenje.
- Stari `studio.authed.spec.js` U8.7 test ne čisti uploadanu sliku (staging `lesson-images` = 18 objekata).

---

## 14 · F5 — RUNBOOK ZA PRODUKCIJU (pripremljeno 2026-08-04; **NIJE izvedeno**)
> **Ništa iz ovog poglavlja ne pokreće se bez Leonova IZRIČITOG OK-a.** Ovo je plan, ne dozvola.
> Napisano tako da se sljedeća sesija ne mora prisjećati redoslijeda.

### 14.0 · Zatečeno stanje (provjereno 2026-08-04)
| stavka | stanje |
|---|---|
| PROD baza `naxjubnedhrbhsuasayu` | **4 tablice**: `content_versions`, `profiles`, `progress`, `subject_content`. **`nodes` NE POSTOJE.** |
| PROD Storage | samo `lesson-images` (javan, admin-only upis). **`node-images` ne postoji.** |
| `origin/main` | `8b99775` |
| lokalni `main` | **2 commita NEPUSHANA**: `e1a8fde` (spec v3 + CLAUDE) · `63f898f` (F1 SQL) |
| grana `feature/f3-node-editor` | **13 commita** ispred lokalnog `main` (F2+F3+F4) |
| klijent koji ide na prod | `js/node-images.js` (nov) · `js/my-materials.js` (nov) · `css/my-materials.css` (nov) + izmjene u `admin/studio/block-editor*/auth/profile/i18n/sokrat-modal/index.html` |

### 14.1 · Redoslijed (SVETI — U4-obrazac: **infra PRVO, klijent POSLIJE**)
**Zašto tim redom:** SQL je čisto additivan i nitko ga ne koristi dok klijent ne stigne → međustanje je bezopasno.
Obrnuto (klijent prvi) značilo bi da prijavljeni korisnici dobiju „Moje materijale" nad tablicama kojih nema.
*(Klijent to doduše podnosi — `humanError` mapira `PGRST205`/`42P01` u „Još nije dostupno na ovom okruženju" —
ali to je sigurnosna mreža, ne plan.)*

| # | korak | tko | provjera |
|---|---|---|---|
| **1** | **`supabase/f1-nodes.sql`** na PROD | Leon (Supabase SQL Editor) — produkcijski DDL gejtira klasifikator | 3 tablice + 7 RPC-ova postoje; `anon` bez EXECUTE; md5-otisak funkcija == fajl |
| **2** | **`supabase/f4-node-images.sql`** na PROD | isto | bucket `node-images` `public=false`; **4 policyja, svi `authenticated`, nijedan `public`, nijedan `is_admin()`**; `lesson-images` nedirnut |
| **3** | Advisors (security) na PROD | Claude (MCP, read-only) | 0 ERROR; WARN-i za nove RPC-ove = po dizajnu (isto kao `publish_document`) |
| **4** | `git merge feature/f3-node-editor` → `main` (`--no-ff`) | **vjerojatno Leon** — merge/push na `main` klasifikator je već 2× odbio | konflikti = očekivano SAMO token-fajlovi (`--ours` + `npm run bump`); 0 markera |
| **5** | `npm run preflight` na `main` | Claude | EXIT 0 (pre-push hook ga ionako vrti) |
| **6** | `git push origin main` (nosi i 2 zaostala commita) | **Leon, izričit OK po pushu** | — |
| **7** | **Vercel check na commitu** (pravilo #7 — Actions NE validira `vercel.json`) | Claude | deployment **READY, target=production** |
| **8** | Živa verifikacija | Leon prijavom + Claude MCP-om | „Moji materijali" se crta · napravi folder+gradivo · uredi · **objavi** · upload slike · obriši+vrati |
| **9** | `npm run test:storage` **NE pokretati protiv PROD-a** | — | skripta to i sama tvrdo odbija (write-test) |

### 14.2 · Rizici i gašenje
| rizik | gašenje |
|---|---|
| DDL pokvari postojeći katalog | SQL je **100 % additivan** — 0 `ALTER` nad postojećim tablicama; `publish_document`, `subject_content`, `content_versions` nedirnuti. Oba fajla dokazana na stagingu i **idempotentna** (ponovno pokretanje bezopasno). |
| Merge pokvari klijent | konflikti su povijesno bili SAMO `?v=` tokeni → `--ours` + re-bump; feature-superset u `index.html` |
| Nešto pođe po zlu nakon deploya | Vercel rollback na `8b99775`. **DB se NE rollbacka** — nove tablice ostaju prazne i neiskorištene (bezopasno). |
| Slike korisnika procure | riješeno u F4 (§12): privatan bucket + owner-prefiks + potpisani URL-ovi; gate `test:storage` 8/8 |

### 14.3 · Nakon F5
**Frontend redizajn** (Leon: *„sve mora savršeno raditi prije nego ga uredimo"*) → tek onda **objava/dijeljenje + MCP**.
Otvoreno, ne blokira F5: siročad u Storageu · „obriši sekciju" postoji ali brisanje **stavki** unutar sekcije ide starim putem.

### 14.4 · ⚠️ Siročad u Storageu — POTVRĐENO U PRAKSI, ne teorijski (2026-08-04)
Na kraju sesije staging `node-images` sadrži **1 objekt od 2,5 MB** pod prefiksom test-admina, u čvoru
**„Njemački B2 — vokabular"** — a payload tog čvora je **prazan `{}` (verzija 1)**. Dakle: slika je uspješno
uploadana kroz **novi privatni put**, ali **nikad objavljena** u sadržaj → visi kao siroče.
(Nije iz automatiziranih testova — oni šalju 1×1 PNG od 70 B i čiste za sobom; ovo je gotovo sigurno
Leonov živi klik na localhostu. **Usput = koristan dokaz da privatni upload radi s pravom fotografijom
kroz pravo sučelje.**)

**Pouka za dizajn:** upload se dogodi **odmah**, a payload se mijenja **tek na „Objavi"** — svaki prekid
između to dvoje (odustane, zatvori tab, odbaci draft) ostavlja siroče. Nije sigurnosni problem
(privatan bucket, owner-scoped), ali kvota nije beskonačna.
**Kandidati:** (a) `delete_node` pomete i `<uid>/<node_id>/` prefiks · (b) periodično mesenje objekata
kojih nema ni u jednom payloadu · (c) „Odbaci" briše ono što je uploadano unutar tog drafta.
**Nije blokator za F5** — ali jest prava stavka za popis odmah nakon.

---
*F4 GOTOV. **SLIJEDI F5 = PROD** po runbooku §14. **Traži Leonov IZRIČIT OK** (produkcijski DDL + deploy).*
