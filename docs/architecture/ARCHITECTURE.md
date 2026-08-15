# ARCHITECTURE — kako je Sokrat Study stvarno građen

> **Ovaj dokument opisuje sustav KAKAV JEST, ne kakav bi trebao biti.**
> Sve u njemu je provjereno protiv produkcijske baze i koda 2026-08-07. Ako nešto ovdje piše, a ne
> postoji — to je bug u dokumentu i ispravlja se odmah.
>
> **Prethodna verzija je opisivala normalizirani model (`institutions → faculties → … → content_items`)
> koji NIKAD NIJE IZGRAĐEN**, i nije znala za polovicu proizvoda. Zato je prepisana od nule.
>
> Kronologija → [records/HISTORY.md](../records/HISTORY.md) · odluke → [records/DECISIONS.md](../records/DECISIONS.md)
> · oblik sadržaja → [CONTENT_SCHEMA.md](./CONTENT_SCHEMA.md) · backend-detalji → [BACKEND.md](./BACKEND.md)

---

## 1 · Sustav u jednoj rečenici

Statička stranica bez build-koraka (vanilla JS, Vercel) koja čita i piše **izravno u Supabase**
preko korisnikovog JWT-a i RLS-a — **bez vlastitog poslužitelja** i bez `/api` sloja (ADR-011).

---

## 2 · DVA SVIJETA — središnja činjenica

Sve ostalo slijedi iz ovoga. Sustav nosi **dva odvojena sadržajna svijeta** koji dijele
**isti prikazivač i isti editor**, ali imaju različito vlasništvo, različita prava i različit put upisa.

| | **Javni katalog** | **Osobno gradivo** |
|---|---|---|
| što je | gradivo koje objavljujemo mi | gradivo koje korisnik gradi sam, od nule |
| tko čita | **svi**, i neprijavljeni | **samo vlasnik** |
| tko piše | **admin** (`is_admin()`) | **vlasnik** (`owner_id = auth.uid()`) |
| tablice | `subject_content` (+ audit `content_versions`) | `nodes` · `node_content` (+ audit `node_content_versions`) |
| struktura | fiksna: fakultet → smjer → godina → semestar → predmet → lekcija | **slobodno stablo** koje korisnik sam slaže |
| izvor strukture | `data/catalog.js` (datoteka) | baza (`nodes`, self-referencijalno) |
| put upisa | `publish_document()` | `publish_node()` |
| slike | bucket `lesson-images` (javan) | bucket `node-images` (**privatan**) |

**Odluka: svjetovi se NE miješaju** (ADR-024 + Leon 2026-08-07). Nema kopiranja kataloga u osobno
gradivo, nema veze na original, nema zajedničkih redaka. Jedina dodirna točka je **kôd** — isti
prikazivač, isti editor, isti draft-stroj.

> **Zašto to nije slučajnost nego zaštita:** javni katalog koristi **sve predmete iz `data/catalog.js`** (danas 24) i studentski „vrući put".
> Da su svjetovi spojeni, svaka greška u osobnom graditelju mogla bi srušiti učenje svima.

---

## 3 · Model podataka — **stvaran** (produkcija, 7 tablica)

Sve tablice imaju uključen RLS.

```
── JAVNI KATALOG ────────────────────────────────────────────────────────
subject_content        (subject_id text, var_name text, payload jsonb,
                        updated_at timestamptz, version bigint)
      1 red = 1 „window var" (npr. te2 / midterm-1) → cijeli objekt kategorija kao jsonb
content_versions       (id bigint, subject_id text, var_name text, payload jsonb,
                        op text, edited_by uuid, edited_at timestamptz)
      APPEND-ONLY audit: staro stanje PRIJE svakog upisa

── OSOBNO GRADIVO ───────────────────────────────────────────────────────
nodes                  (id uuid, owner_id uuid→auth.users ON DELETE CASCADE,
                        parent_id uuid→nodes ON DELETE CASCADE,
                        kind text ['folder'|'study'], name text, position int,
                        icon text, color text,
                        created_at, updated_at, deleted_at)   ← soft-delete
node_content           (node_id uuid→nodes PK, payload jsonb, version bigint, updated_at)
node_content_versions  (id bigint, node_id uuid, payload jsonb, op text,
                        edited_by uuid, edited_at)            ← APPEND-ONLY audit

── KORISNIK ─────────────────────────────────────────────────────────────
profiles               (user_id uuid, role text, created_at)  ← role='admin' → is_admin()
progress               (user_id uuid, key text, data jsonb, updated_at)
```

### Tri stvari koje treba znati o ovom modelu

1. **`payload jsonb` čuva postojeći oblik sadržaja** (kategorije s `flashcards`/`quiz`/`fillBlanks`/`learn`).
   Zbog toga su oba svijeta **čitljiva istim prikazivačem** i migracija nikad nije mijenjala UI.
   Kanonski oblik: [CONTENT_SCHEMA.md](./CONTENT_SCHEMA.md).
2. **`progress` je generički key-value.** Nije vezan na katalog — ključ je običan tekst. Zato osobno
   gradivo koristi isti prostor (`node:<uuid>`) i **ne treba nikakvu promjenu sheme**, uključujući
   cloud-sync (spajanje unijom/max).
3. **Integritet stabla čuva trigger, ne aplikacija.** `nodes_validate` na svakom upisu provjerava:
   roditelj postoji · isti je vlasnik · roditelj je **folder** · **nema ciklusa** (rekurzivni CTE).
   Vrijedi i za izravan SQL, ne samo za RPC.

---

## 4 · Putovi ČITANJA

**Javni katalog — „dual-read", tri razine (`js/content-loader.js`):**

```
Supabase (subject_content)  →  data/json/<id>/*.json  →  data/<id>/*.js
        primarno                    CDN fallback            zadnja mreža
```
Lijeno po predmetu. Šav prema ostatku aplikacije je **`window.SokratContent`**
(`js/content-repo.js`): `listSubjects` / `getSubject` / `loadLesson`.
Datoteke su i dalje izvor istine; baza je zrcalo (re-sync `scripts/migrate-content.js`).

**Osobno gradivo — izravan `SELECT` uz RLS.** Nema fallbacka i ne treba ga: gradivo postoji samo u
bazi. Ako baza spava ili korisnik nije prijavljen, područje se pošteno prikaže kao nedostupno.

**Vježbe se NIKAD ne čitaju iz baze.** Vidi §6.

---

## 5 · Putovi PISANJA — samo dva, oba kroz RPC

Klijent **nikad ne piše izravno u sadržajne tablice.** Grantovi su namjerno oduzeti; svaki upis ide
kroz `SECURITY DEFINER` funkciju koja sama provjerava tko smije.

| RPC | tko smije | što radi |
|---|---|---|
| `publish_document(subject_id, writes)` | **admin** | atomična objava kataloga + zapis u `content_versions` |
| `publish_node(node_id, payload, base_version)` | **vlasnik** | atomična objava osobnog gradiva + audit; `base_version` odbija izgubljeni upis |
| `create_node` · `rename_node` · `move_node` · `reorder_nodes` · `delete_node` · `restore_node` | **vlasnik** | struktura stabla |

**Prava na produkciji (provjereno):** `anon` nema `EXECUTE` ni na jednom od tih RPC-ova;
`authenticated` ima, a vlasništvo presuđuje **unutar** funkcije. Nad `nodes`/`node_content`/
`node_content_versions` `anon` nema ništa, a `authenticated` ima **samo `SELECT`** — čime je usput
zatvoren i `TRUNCATE` (na njega se RLS ne primjenjuje).

**Zašto dva publish-puta, a ne jedan:** admin objavljuje **tuđim** korisnicima, vlasnik **sebi**.
Spajanje bi značilo jednu funkciju s dvije potpuno različite provjere prava — svjesno su odvojeni (ADR-024).

---

## 6 · Sigurnosne granice — dirati samo uz razumijevanje

1. **`js/blocks-renderer.js` = JEDINI prikazivač sadržaja.** Escapira sve, izvršava ništa.
   Namjerno **ne tipografira matematiku**: emitira `\(tex\)` kao **tekst**, a `renderMath()` ga
   obradi *poslije umetanja*. **Svaki pozivatelj mora to dovršiti** — propust je uzrokovao BUG-021.
2. **Vježbe su KÔD, ne podatak.** Sadrže `generate()` funkcije koje serijalizacija uništava, pa se
   učitavaju isključivo iz `.js` preko `content.codeScripts` (BUG-012). **Nikad u bazu ni JSON.**
3. **`editableToInline` (`js/block-editor.js`) = destilacija DOM → kurirani model.** Iz uređivanog
   HTML-a izvlači samo dopuštena polja. Zato se u `contenteditable` **ne smije** ubaciti tipografirana
   matematika — serijalizator bi je pročitao natrag i trajno pojeo formulu.
4. **`service_role` ključ ide SAMO u Supabase Edge Functions i lokalne `.env` skripte** (ADR-016).
   Nikad u preglednik, Vercel ili GitHub Secrets.
5. **Audit tablice su append-only.** `content_versions` i `node_content_versions` se ne brišu.
6. **Slike osobnog gradiva:** payload nosi **stabilnu oznaku** `node-img:<uid>/<node>/<uuid>`, a
   potpisani URL se traži **tek pri prikazu, kod pozivatelja**. Time potpis koji istječe nikad ne
   uđe u bazu ni u autosave, a prikazivač ostaje nedirnut.

---

## 7 · Klijent — moduli i ŠAVOVI

Bez frameworka i bez build-koraka. Globalno stanje = `window.AppState`.
UI-primitivci = light-DOM Web Components (`<sokrat-toast>`, `<sokrat-modal>`, `<sokrat-confirm>`).

**Tri šava nose cijelu ponovnu upotrebu — i objašnjavaju zašto je osobni graditelj bio jeftin:**

| šav | gdje | zašto je važan |
|---|---|---|
| **`SokratContent`** | `js/content-repo.js` | sakriva dual-read; pozivatelj ne zna odakle je sadržaj |
| **`SokratAdmin.studioBridge`** | `js/admin.js` | **jedina** točka spajanja Studija na backend. Osobni graditelj je promijenio samo 3 IO-metode (`setNode`/`enter`/`publish`) |
| **`SokratDraft`** | `js/draft-store.js` | draft je **generičan po tekstualnom ključu**. Katalog koristi `subjectId::lessonId`, čvor sintetički `node:<uuid>` → autosave, opovi i blok-editor rade **bez ijedne izmjene** |

> **Pouka koja se ponovila dvaput:** kad je šav generičan po ključu (`draft-store`, `progress`),
> novi svijet se dodaje bez promjene sheme. Kad nije (slike vezane na vlasnički prefiks), dodavanje
> novog slučaja košta. To je najbolji dostupan kriterij pri projektiranju sljedeće značajke.

---

## 8 · Storage — dva bucketa, namjerno različita

| bucket | javan | tko piše | putanja |
|---|---|---|---|
| `lesson-images` | **da** (`public read`) | admin (`is_admin()`) | slobodna |
| `node-images` | **ne** (`public=false`) | vlasnik | **`<auth.uid()>/<node_id>/<uuid>.<ext>`** |

Sva četiri policyja na `node-images` traže da je **prvi segment putanje === `auth.uid()`**.
Nijedan ne spominje `is_admin()` i nijedan ne vrijedi za `anon`.

---

## 9 · Boje — ugovor koji TEK TREBA izvesti

Odluka (Leon 2026-08-07): **boja se nasljeđuje od sekcije i smije se pregaziti.**

```
sekcija.color (#rrggbb)        ← postoji danas, izvor
     ↓ nasljeđuje
blok.color?                    ← NE POSTOJI — treba dodati
kartica/pitanje.color?         ← NE POSTOJI — treba dodati
     ↓
tekst (run.color)              ← postoji: 8 kuriranih tokena
```
Odsutna vrijednost znači **naslijedi**, ne „bez boje". Danas su to tri nepovezana mehanizma s dvije
rupe; ujednačavanje traži proširenje sheme, prikazivača i editora.

---

## 10 · Poznati dugovi i otvoreni problemi

| stavka | narav | status |
|---|---|---|
| **Vježbe u osobnom gradivu** | vježba je kôd; UGC ne može autorirati kôd | **Odgođeno** (Leon 2026-08-07): *„morat ćemo osmislit potpuno poseban način"*. Traži **vlastiti spec**, nije proširenje sadašnjeg engine-a. Ništa se ne obećava u sučelju. |
| **Dijeljenje osobnog gradiva** | model je spreman (jedan predikat + RPC-only upis) | **⚠️ jedina stavka koja NIJE besplatna: slike.** Policy veže čitanje na vlasnički prefiks putanje → primatelj podijeljenog gradiva **ne bi vidio slike**. Rješenje traži potpisivanje kroz funkciju ili promjenu policyja. |
| **Siročad u Storageu** | upload se dogodi odmah, payload tek na „Objavi" | svaki prekid ostavlja neupotrijebljen objekt. Nije sigurnosni problem (privatan bucket), ali kvota nije beskonačna. |
| **Kvote** | nema ih | Leonova odluka: **granicu zapisati sad, provesti kasnije**. Danas postoji samo 5 MB po datoteci. |
| **Opseg stabla** | nepoznat | projektirati da izdrži rast: pretraga i lijeno učitavanje grana **planirati, ne graditi**; ograničenja mjeriti. |
| **Zatečena prava** | `handle_new_user`, `is_admin`, `snapshot_content_version`, `set_updated_at`, `touch_subject_content` su izvršive **anonu** | naslijeđeno iz starije sheme. Nove `*_node` funkcije su zatvorene ispravno; stare treba stegnuti istim obrascem. |
| **`ARCHITECTURE` je bio fikcija 6 tjedana** | proces, ne kôd | dokument se pisao kao namjera i nikad prepisao nakon isporuke → uveden gate `npm run check:docs` i pravilo da `product/` nosi kriterije prihvaćanja |

---

## 11 · NE-ciljevi (izričito)

- **Vlastiti poslužitelj / `/api` sloj** — čitanje i pisanje idu izravno u Supabase (ADR-011).
- **Build-korak, framework, bundler** — vanilla ostaje (ADR-014).
- **Normalizirani katalog** (`institutions/faculties/…`) — planiran 2026-06, **nikad izgrađen i ne gradi se**.
- **Miješanje dvaju svjetova** — bez kopiranja kataloga u osobno gradivo (Leon 2026-08-07).
- **Vježbe u osobnom gradivu** — za sada ne; vidi §10.
