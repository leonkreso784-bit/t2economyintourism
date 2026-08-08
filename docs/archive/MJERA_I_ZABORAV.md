# Faza „Mjera i zaborav" — ✅ ISPUNJENA (arhiva)

> **📌 ZATVORENO 2026-08-08.** Isporučeno na produkciju u `eee6f14` (Vercel `dpl_38mP…`,
> token `20260808055007`). Svih 5 kriterija ispunjeno; Edge Function `delete-account` ACTIVE na
> PROD-u sa sha256 identičnim stagingu. **Ovaj dokument je povijest, ne plan rada** —
> što je isporučeno piše u [records/CHANGELOG.md](../records/CHANGELOG.md).
>
> **Blokada iz §4 je RIJEŠENA:** Leon je dodao `STAGING_SUPABASE_SERVICE_KEY` u `.env` →
> `npm run test:delete-account` prolazi **18/18**, uključujući T4/T5 (stvarno brisanje) i **T6**
> (admin se ne može obrisati sam) — koji je nastao tek nakon što su T4/T5 proradili i otkrili rupu.

> Dogovoreno s Leonom 2026-08-08: prije frontend redizajna zatvaramo dvije
> 🔥 stavke iz [records/BACKLOG.md](../records/BACKLOG.md) — jer Leonovo vlastito pravilo glasi
> *„sve mora savršeno raditi prije nego ga uredimo."*
>
> **Ime:** *mjera* = koliko teksta smije stati u karticu · *zaborav* = pravo korisnika da nestane.
> Dvije stavke, jedna nit: **platforma trenutno obećava oboje, a ne izvršava nijedno.**

---

## 1 · Zašto baš ovo dvoje

| | obećanje | stvarnost danas |
|---|---|---|
| **Mjera** | [CONTENT_SCHEMA.md](../architecture/CONTENT_SCHEMA.md) propisuje kratke definicije **<200 znakova**, detalj ide u learn | ništa to ne provodi → **46,2 % odgovora** je preko 200, 48 preko 500 (max **736**) |
| **Zaborav** | `privacy.html` nudi brisanje računa **mailom autoru** | GDPR čl. 17 na živom proizvodu s EU korisnicima; GA4 i Sentry su aktivni |

Obje su **odluke koje su već pale** — čeka samo izvedba.

---

## 2 · Kriteriji prihvaćanja

Faza je gotova kad Leon **rukom** može sljedeće, bez pomoći autora:

1. **Editor me zaustavi.** Dok tipkam odgovor kartice, vidim koliko sam napisao. Na **200** me žuto
   upozori, ali me pusti. Na **500** gumb „Spremi" **ne radi** i piše mi zašto.
2. **Vrijedi u oba svijeta.** Isto se dogodi kad uređujem predmet iz javnog kataloga i kad uređujem
   vlastiti materijal.
3. **Vidim trend.** `npm run validate:content` mi ispiše raspodjelu duljina po predmetu — **brojku, ne
   crveno** (retroaktivni gate bi srušio pola kataloga).
4. **Mogu se obrisati sam.** Na profilu kliknem „Obriši račun", dvaput potvrdim, i račun nestane —
   bez mailanja ikome.
5. **Ne ostane ništa.** Nakon brisanja od mene u sustavu **nema ni jednog retka ni jedne slike**.

> Nijedan kriterij ne glasi „test je zelen" — svjesno (ADR-027, povod BUG-023).

---

## 3 · Mjera — što je već provjereno

**Editor kartice je JEDAN, ne dva.** Studio ne posjeduje vlastiti editor: `renderPane` u `js/studio.js`
emitira `data-admin-*` atribute, koje hvataju globalni delegati u `js/admin.js`, pa oba svijeta ulaze u
isti `_openCardEditor` / `_saveCard` u **`js/admin-editors.js`**.

**Posljedica:** kriterij 2 („vrijedi u oba svijeta") ispunjava se promjenom na **jednom mjestu**, ne
dupliranjem pravila. Ako se ta pretpostavka ikad prekrši, test iz cigle M2 pada.

### Granice

| prag | ponašanje | zašto |
|---|---|---|
| **200** | žuto upozorenje, **spremanje prolazi** | to je *standard*, ne pravilo — tvrdo bi srušilo 46 % kataloga |
| **500** | **spremanje blokirano**, poruka objašnjava | strop koji je Leon odlučio 2026-08-07 |

**Vrijedi za pitanje I odgovor, isto pravilo.** Nacrt je govorio „mjeri se samo odgovor", ali dva
različita pravila u istom modalu se teže objasne i lakše razidu. Pitanja ga u praksi ne dodiruju
(izmjereno: najdulje 134 znaka na 5379 kartica), pa je jedinstveno pravilo besplatno.

### Cigle

- **M1** — brojač uživo + oba praga u `js/admin-editors.js`; blokada mora biti u `_saveCard`, ne samo
  vizualna (inače je Enter zaobiđe).
- **M1b** — CSS stanja brojača + i18n ključevi HR/EN.
- **M2** — unit testovi granica + authed Playwright koji dokazuje da blokada **stvarno** blokira, i to
  na oba puta (katalog + vlastiti materijal).
- **M3** — `validate:content` dobiva raspodjelu duljina. **Brojka, ne gate.**

**M5b (skraćivanje 25 zatečenih kartica + `maxLength: 500` u shemi) NIJE u ovoj fazi** — obrnut
redoslijed ruši `validate:schema` i blokira CI.

---

## 4 · Zaborav — što je već provjereno

**Baza je već spremna.** Svaki FK prema `auth.users` je provjeren u `supabase/*.sql`:

| tablica | veza | pri brisanju korisnika |
|---|---|---|
| `progress` | `user_id` | **CASCADE** |
| `nodes` → `node_content` → `node_content_versions` | `owner_id` | **CASCADE** (lančano) |
| `profiles` | `user_id` | **CASCADE** |
| `content_versions` | `edited_by` | **SET NULL** |

`SET NULL` na auditu je **ispravno, ne propust**: `content_versions` je append-only (ADR-024) — povijest
izmjena javnog kataloga preživi, a ime autora nestane. Točno ono što GDPR traži.

**Rupa koju kaskada NE pokriva: Storage.** Slike u bucketu `node-images` nose vlasnički prefiks
(`(storage.foldername(name))[1] = auth.uid()::text`) i ostale bi kao siročad bez ijednog vlasnika.
**To je pravi posao Edge Functiona** — sve ostalo baza odradi sama.

**Nalaz iz dokumentacije (2026-08-08) koji to pooštrava:** Supabase **odbija obrisati korisnika koji
je vlasnik ijednog objekta u Storageu.** Čišćenje slika time nije higijena nego **preduvjet** —
obrnut redoslijed ne ostavlja siročad, nego ruši cijelu operaciju. Uz to: brisanje iz `auth.users`
**ne odjavljuje** korisnika (JWT vrijedi do isteka), pa klijent mora odjaviti sam.

### Put: Supabase Edge Function (ADR-016)

`service_role` NIKAD u Vercel ni u klijent → privilegirano ide isključivo u Edge Function, ključ iz
Supabase secreta.

**Obavezno u funkciji:** identitet se čita iz `Authorization: Bearer <JWT>` preko `auth.getUser()`.
**`user_id` iz body-ja se NIKAD ne vjeruje** — to bi bila eskalacija privilegija.

### Cigle

- **G1** — provjeriti ima li Supabase u međuvremenu **nativni self-delete** (backlog to izričito traži).
  Ako ima, cijela G2 otpada.
- **G2** — Edge Function `delete-account`: JWT → `getUser()` → purge `node-images/<uid>/` →
  `auth.admin.deleteUser(uid)`. Redoslijed je bitan: **prvo slike, pa korisnik** — obrnuto bi izgubilo
  `uid` potreban za prefiks.
- **G3** — `js/profile.js`: danger-gumb + dvostruka potvrda (upiši `DELETE`) → `functions.invoke` →
  `signOut` + čišćenje lokalnog napretka → toast → landing.
- **G4** — i18n HR/EN + `privacy.html` (opisati što se briše i da je nepovratno).
- **G5** — test **protiv STAGINGA** (`sokrat-staging`, `npm run test:delete-account`). Hard-delete se
  protiv PROD-a **ne automatizira** ni pod čim. Uz to negativan test: `user_id` iz tijela zahtjeva se
  ne sluša.

**MVP = hard-delete** (doslovno „pravo na zaborav"). Soft-delete s grace-periodom tek ako zatreba.

### ⛔ Što je blokirano i zašto (2026-08-08)

Test je u **dvije razine**, jer nisu obje izvedive istim ključem:

| razina | što dokazuje | stanje |
|---|---|---|
| **T1–T3** — odbijanje neovlaštenog poziva | bez tokena · neispravan token · GET | ✅ **prolazi** protiv deployane funkcije na stagingu |
| **T4–T5** — stvarno brisanje | tuđi `user_id` se ignorira · ne ostane ni redak ni slika | ⛔ **preskočeno** |

**Uzrok blokade:** T4/T5 trebaju **jednokratnog** korisnika — postojeći `test-admin@sokrat.local` se
ne smije obrisati jer o njemu ovise svi ostali authed testovi. A jednokratni se ne može stvoriti:
`signUp` na stagingu šalje potvrdni mail (provjereno — `over_email_send_rate_limit`), pa anon ključem
nema načina doći do upotrebljive sesije.

**Što to odblokira:** `STAGING_SUPABASE_SERVICE_KEY` u `.env` (Supabase → `sokrat-staging` → Settings
→ API → `service_role`). To može dodati **samo Leon**. Skripta dotad graciozno preskače, a T1–T3 i
dalje trče. Ključ ostaje u `.env` (gitignored) — ADR-016 dopušta `service_role` u lokalnim skriptama,
zabranjuje ga u Vercelu i klijentu.

---

## 5 · Granice faze

- **Javni katalog, 22 predmeta i studentski vrući put ostaju nedirnuti.**
- **Ne diramo `publish_document` ni `publish_node`** — nijedna cigla nema razloga.
- **Nema retroaktivnog gate-a na duljinu** — schema `maxLength` dolazi tek u M5b, poslije skraćivanja.
- **Deploy = izričit Leonov OK**, zasebno za Edge Function i za push na `main`.

---

## 6 · Što slijedi nakon ove faze

Zapisano 2026-08-08, da se ne otvara ponovno:

1. **Frontend redizajn** — uključuje odluku „akcent = **cijela** kartica, ne samo rub"
   ([BACKLOG.md](../records/BACKLOG.md)).
2. **Objava i dijeljenje** — doseg je **već presuđen**: *link koji zna samo tko ga ima* (tajni token po
   materijalu, read-only, **bez** javne biblioteke i pretrage u prvoj fazi). Otvoreno pitanje koje ta
   faza mora riješiti: slike su vezane na vlasnički prefiks, pa ih primatelj ne bi vidio
   ([UGC_SPEC.md](../product/UGC_SPEC.md) §4).
3. **MCP** — mobilno autorstvo preko korisnikovog AI-a (ADR-026).
