# CREATE_BACKEND_SPEC v3 — Osobni UGC-graditelj gradiva „od nule"

> **Status:** DRAFT v3 · ugovor PRIJE koda · **vizija POTVRĐENA (Leon 2026-08-02)**.
> **Sljedeći korak nakon ovoga:** frontend redizajn (Leon).
> **Pravilo:** NULA koda dok Leon ne kaže „idemo F1". Implementacija slijedi §6 fazni plan.
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
| **F0** | ovaj spec v3 + potvrda | čitaš ovo | ne ← **ovdje smo** |
| **F1 · DB temelj** | `nodes` + `node_content` + tvrda owner-RLS + RPC-ovi (create/rename/move/reorder/delete/publish_node) — **STAGING** (Supabase skill/MCP) | `list_tables` + RLS (owner-izolacija dokazana) + REST smoke; PROD netaknut | ne (staging) |
| **F2 · „Moji materijali" UI** | Profil-područje: render stabla + add folder/study + rename/nest/reorder/delete (async, prijavljen-only) | `test:authed` vs staging: složi stablo, provjeri owner-izolaciju | ne (grana/preview) |
| **F3 · Editor u čvoru** | Otvori study-čvor → postojeći Studio editor vezan na `node_content` → uredi → `publish_node` | authed: uredi čvor → publish → re-load = sadržaj ostao | ne |
| **F4 · Polish + E2E** | drag-nest, breadcrumb, prazna stanja; puni tok na stagingu | authed E2E: create→nest→uredi→publish→delete→restore | ne |
| **F5 · PROD** | migracija (SQL prvo, U4-obrazac) → klijent | Vercel READY (pravilo #7) + live-verified | **DA — samo uz izričit OK** |

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
*F0 checkpoint: čeka Leonov „idemo F1". Zatim F1 = `nodes`/`node_content` + RLS + RPC-ovi na STAGINGU. Nula koda/deploya do tada.*
