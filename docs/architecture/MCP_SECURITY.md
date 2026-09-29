# MCP — sigurnost: prijetnje, invarijante, nalazi, uvjeti puštanja

> **Cilj:** korisnikov AI stvara i uređuje **isključivo njegove nacrte**; **korisnik** pregledava i objavljuje.
> Kako je sustav građen: [MCP.md](./MCP.md) · redoslijed popravaka: [plan/MCP.md](../plan/MCP.md) ·
> kako se mjeri: [workflow/MCP_TESTING.md](../workflow/MCP_TESTING.md).
>
> **Pravilo ovog dokumenta:** nalaz je ono što je **izmjereno ili pročitano u kodu s retkom**. Pretpostavka
> ostaje u §5 dok se ne izmjeri. Upute modelu nikad nisu sigurnosna granica — granica je ono što provodi
> baza, poslužitelj ili preglednik neovisno o ponašanju modela.

## 1 · Granice povjerenja

| sloj | vjerujemo mu? | zašto |
|---|---|---|
| model (Claude / ChatGPT) | **ne** | čita korisnikov materijal, a materijal može nositi upute (prompt injection) |
| broker koji drži token | djelomično | token je pun korisnički JWT + `client_id`; tko ga drži, dolazi i mimo naših alata |
| MCP poslužitelj (naša Edge Function) | da, ali nije jedina linija | RPC-ovi su dohvatljivi i izravno kroz PostgREST s istim tokenom |
| baza (GRANT · RLS · RPC) | **da — ovdje je granica** | provodi se neovisno o tome tko zove |
| korisnikov preglednik | granica za prikaz | sadržaj koji je napisao AI ondje se izvršava s **punom** sesijom korisnika |

## 2 · Od koga se branimo

- **P1 · zlonamjeran izvor** — PDF ili tekst s uputama koje model posluša.
- **P2 · drugi korisnik** — pogađa tuđe id-eve ili pokušava čitati tuđe.
- **P3 · lažna aplikacija** — DCR je otvoren, ime klijenta je tuđi tekst.
- **P4 · onaj tko drži token** — broker, curenje, zadržan token nakon prekida veze.
- **P5 · sadržaj nacrta u pregledniku** — ono što AI napiše korisnik gleda u pregledu i poslije učenja.
- **P6 · preopterećenje** — automatizirani upisi, ponavljanja, rast povijesti.

## 3 · Invarijante

| # | tvrdnja | tko je provodi | dokaz / stanje |
|---|---|---|---|
| I1 | AI piše **samo u vlastiti nacrt**, nikad u živo gradivo | baza: GRANT samo za `mcp_*` + vlasnik iz tokena | ✅ `mcp:nacrt` 34/0, `mcp:brava` 46/0, mutacije 4/4 |
| I2 | AI ne čita tuđe gradivo ni javni katalog | baza: GRANT + RLS | ✅ `mcp:brava` (iscrpna REST-proba svake tablice izvan popisa) |
| I3 | AI-tokenom nema nepovratne radnje (brisanje računa, mail, lozinka, e-mail) | `_shared/token-guard.ts` · postavke Auth API-ja | ✅ `mcp:brava`; metapodaci korisnika imenovano otvoreni |
| I4 | objava = **samo obična sesija**, poslije pregleda | baza: Prihvati nije dan `mcp_klijent` | ⏳ plan ②/4 |
| I5 | sadržaj koji napiše AI **ne izvršava kod** u pregledniku, ni kad sanitizator nije učitan | renderer + CSP | ❌ otvoreno — N1, N2 → plan ②/0c–e |
| I6 | pravila sadržaja provodi **baza** na svakom putu upisa, ne samo poslužitelj | validator u bazi | ❌ otvoreno — N4, N5 → plan ②/0a–b |
| I7 | ponovljen zahtjev ne duplicira; paralelna izmjena se ne prepisuje | ključ ponavljanja · polazna verzija | ❌ izmjereno S-B — N7, N8 → plan ②/1b |
| I8 | opoziv veze zaustavlja AI | Auth (`revokeGrant`) | ⚠️ izmjereno S-B: obnova odbijena odmah (400), a postojeća propusnica **i dalje piše u nacrt** (200) do isteka, najviše 3600 s — korisniku rečeno; trenutni opoziv = odluka |
| I9 | administratorov konektor nema ni jedno pravo više od običnog | hook: svaki token s `client_id` = `mcp_klijent`, neovisno o ulozi korisnika | ✅ izmjereno S-B (11 tvrdnji, s kontrolom) |
| I10 | tok prijave: PKCE obavezan, redirect točan, kod jednokratan i vezan na klijent, potpis tokena provjeren | Supabase Auth + PostgREST | ✅ izmjereno S-B (9 tvrdnji) |

## 4 · Nalazi

Oznake: **potvrđeno** = izmjereno ili pročitano s retkom · **dokazano izvršavanje** = pokus u pravom pregledniku
s kontrolom · prioritet je za **puštanje korisnicima**, ne za današnji staging.

### N2 · sirovi HTML kad DOMPurify nije učitan — ⛔ VISOK (prije ②/4)

- **Gdje:** `js/blocks-renderer.js` `renderLegacyHtml` (redci 226–229) vraća HTML netaknut ako `window.DOMPurify`
  ne postoji; DOMPurify se u `js/loader.js` (redak 70) učitava kao **neobavezan** s cdnjs-a. Isto u krajnjem
  fallbacku `js/learn.js` (redak 57, `learn.content`).
- **Dokazano izvršavanje (lokalni pokus, Chromium + WebKit, s kontrolom):** sirovi HTML s `<iframe srcdoc>` učita
  skriptu s domene koju `script-src` dopušta i **pročita sesiju roditeljske stranice uz produkcijski CSP**. CSP ne
  pomaže jer dopušta **cijele** hostove `cdn.jsdelivr.net` i `cdnjs.cloudflare.com`, a jsdelivr poslužuje bilo koju
  javnu datoteku s GitHuba. CDN je u pokusu glumljen lokalnim poslužiteljem; pravi CDN nije diran. `onerror` i
  inline skripte CSP blokira.
- **Uvjeti:** sadržaj nosi `legacy-html` ili `learn.content` (danas ga `publish_node` i nacrt primaju) **i**
  DOMPurify se nije učitao (pad CDN-a, blokada mreže, izvanmrežni rad).
- **Posljedica danas:** samo vlasnik vidi svoj materijal → napad na samog sebe. **S MCP-om:** P1 → AI → nacrt →
  pregled/Prihvati → korisnikov preglednik s punom sesijom (preuzimanje računa).
- **Popravak:** plan ②/0a (MCP profil bez `legacy-html`/`learn.content`) + ②/0d (bez sanitizatora = tekst) +
  ②/0e (uži `script-src`). **Test:** isti pokus kao regresijska brana, s kontrolom.

### N1 · `safeUrl` propušta kontrolne znakove — 🟠 SREDNJI (rupa u provjeri, izvršavanje nije dokazano)

- **Gdje:** `js/blocks-renderer.js` `safeUrl` (redci 29–39): shema se traži regexom nad nizom koji još nosi
  kontrolne znakove, a preglednik ih pri parsiranju adrese izbacuje.
- **Potvrđeno:** 7 oblika prolazi i postaje `javascript:`/`data:` — TAB, LF, CR unutar sheme; `\x00`, `\x01`, `\x1f`
  na početku; TAB u `data:`. Obični `javascript:` je odbijen.
- **Izvršavanje NIJE dokazano:** renderer poveznice piše s `target="_blank"` — takva se ne izvrši **ni bez CSP-a**
  (oba preglednika). Poveznica u istom prozoru bez CSP-a se izvrši, s produkcijskim CSP-om ne.
- **Popravak:** plan ②/0c. **Test:** unit sa svih 7 oblika + kontrola da `https:` prolazi.

### N3 · `style`, `class` i vanjske slike — 🟡 NIZAK/SREDNJI

- Uz učitan DOMPurify `legacy-html` zadržava `style` i `class` (`DOMPURIFY_CFG`, redci 92–98) → sloj preko ekrana,
  lažni gumb, poveznica van (izvodljivo, **nije mjereno**). `img-src https:` dopušta bilo koju vanjsku sliku → otkriva
  IP i trenutak čitanja trećoj strani.
- **Popravak:** MCP profil bez `legacy-html` i bez vanjskih slika (samo vlastiti upload) — plan ②/0a.

### N4 · `publish_node` provjerava samo oblik — 🟠 SREDNJI (⛔ prije ②/4, jer Prihvati ide tim putem)

- **Gdje:** `supabase/f1-nodes.sql` redci 340–346: payload mora biti ne-prazan objekt objekata. Nema granice
  veličine, tipova blokova, duljina, broja stavki ni shema adresa; svaka objava sprema i punu kopiju u
  `node_content_versions` (rast povijesti → S-C).
- `schema/subject-content.schema.json` postoji (zabranjuje nepoznata polja, provjerava boje), ali se vrti **samo u
  CI-ju nad datotekama kataloga** i dopušta `legacy-html`. `js/card-limits.js` postoji samo u pregledniku.
- **S-B:** stvarna definicija na stagingu (`pg_get_functiondef`) je **istovjetna** datoteci; EXECUTE ima `authenticated`,
  **nema** `mcp_klijent` (AI-token admina → 403, izmjereno).
- **Popravak:** plan ②/0a–b. `pg_jsonschema` 0.3.3 je **dostupan** na stagingu (nije instaliran); produkcija nije
  provjeravana — provjerava se prije ②/0a.

### N5 · nacrt: pravila samo u poslužitelju — 🟠 SREDNJI

- `mcp_upisi_nacrt` (`supabase/f6-nacrt.sql` redci 157–162) provjerava samo objekt i 1 MB. Po ADR-038 brane kvalitete
  žive u poslužitelju, ali **isti token RPC zove i izravno** (P4) — tada brane ne vrijede. Vlasništvo i kvota i dalje drže.
- ADR-038 to već predviđa („ponavljaju se pri Prihvati"); nalaz je da **sigurnosna** pravila (zabrana HTML-a i
  opasnih adresa) moraju biti u bazi već pri upisu nacrta, jer korisnik nacrt **gleda** prije Prihvati.
- **Potvrđeno na stagingu (S-B), pravim AI-tokenom:** `mcp_upisi_nacrt` prima **svih 8** zlonamjernih oblika — `legacy-html`
  s `iframe srcdoc`, `learn.content` sa slojem preko ekrana, `java<TAB>script:` poveznicu, vanjsku sliku, nepoznat tip
  bloka i polje, karticu od 5 000 znakova, 6 000 kartica (~0,9 MB; upis 1,5 s) i gniježđenje dubine 3 000 (upis 2 s).
  Naziv nacrta s HTML-om sprema se doslovno (ispravno — escape je posao prikaza u ②/4, brana tamo).
- **Popravak:** plan ②/0a.

### N7 · usporedni upisi istog nacrta: tihi gubitak — 🟠 SREDNJI

- `mcp_upisi_nacrt` zamjenjuje cijeli payload bez polazne verzije. **Izmjereno (S-B):** dva usporedna upisa istog
  nacrta → oba HTTP 200, preživio samo drugi; nijedna strana ne dozna da je prva izgubljena.
- **Uvjet:** AI (ili dva AI-ja istog korisnika, npr. Claude i ChatGPT) pišu isti nacrt usporedo, ili se ponovi upis iz
  starijeg stanja. **Posljedica:** gubitak dijela nacrta, ne tuđih podataka.
- **Popravak:** plan ②/1b — `mcp_upisi_nacrt` prima polaznu vremensku oznaku / verziju i odbija ako se promijenila.

### N8 · ponovljen početak stvara duplikat — 🟡 NIZAK/SREDNJI

- **Izmjereno (S-B):** `mcp_zapocni_nacrt` dvaput s istim nazivom → dva nacrta (dva id-a). Ponovljena predaja je ispravno
  odbijena. Kvota ograničava štetu na 3 u izradi.
- **Popravak:** plan ②/1b — ključ ponavljanja (klijent ga šalje, baza ga pamti po vlasniku) na svakom pozivu koji stvara.

### N9 · odbijanja kvote i stanja dolaze kao HTTP 500 — 🟢 NIZAK

- Kvota (`53400`) i „već predan" (`55000`) izlaze iz PostgREST-a kao **500**. Nije propust, ali AI ne može razlikovati
  „pokušaj kasnije" od kvara → plan ②/2: alat prevodi kod u jasnu poruku.

### N6 · `mcp-admin` (lokalni pokus) — 🟢 NIZAK

- Izvan repozitorija (untracked u glavnom stablu), nije na grani F6, lokalni stdio, bez ključeva.
- **Potvrđeno pokusom na bezopasnim datotekama:** izlazak iz `data/json` preko `..` (vraća imena ključeva bilo kojeg
  JSON-a) · greška za ne-JSON datoteku otkriva prvih ~10 znakova · shema argumenata se ne provjerava · ulazni
  međuspremnik bez granice.
- Na javnom poslužitelju isti kod bio bi visok rizik; ovdje je napadač samo zaveden lokalni model.
- **Ništa se ne prenosi** (F6 poslužitelj koristi službeni SDK; admin doseg je protiv ADR-030/031). Odluka: obrisati ili
  arhivirati.

## 5 · Sumnje koje još čekaju mjerenje

| područje | što se mjeri | cigla |
|---|---|---|
| 1 ovlasti | **istekao** token (traži čekanje 1 h; potpis i `alg` su izmjereni) | ⑤ |
| 5 injection | ponašanje pravog modela sa zlonamjernim izvorom — **granica je izmjerena** (§5a), model nije | ⑤ |
| 6 limiti | učestalost, veličina odgovora, paralelni poslovi, timeouti, rast verzija, gašenje konektora | S-C |
| 7 privatnost | pokriće `scripts/backup-db.js` (nacrti, identitet, verzije, Storage) · brisanje nacrta i veza s računom · tokeni i gradivo u logovima/analitici · lokalni cache pri promjeni korisnika | S-C |

### 5a · Prompt injection — što zaveden model MOŽE (izmjereno i pročitano, S-B)

Pretpostavka: model posluša svaku uputu iz izvora. Doseg mu je ono što token i alati dopuštaju, ne ono što mu kažemo:

| pokušaj | ishod | zašto |
|---|---|---|
| mijenjati materijal izvan nacrta · objaviti · obrisati | **ne može** | `publish_node`, 7 RPC-ova čvorova, `node_content` → 403 za `mcp_klijent` (i za admina) |
| čitati tuđe ili katalog | **ne može** | GRANT + RLS; `subject_content`, `profiles`, `content_versions` → 403 |
| obrisati račun, poslati mail, promijeniti lozinku/e-mail | **ne može** | `token-guard` (403) · postavke Auth API-ja (`mcp:brava`) |
| proizvoljan HTTP, SQL, datoteke, izvršavanje kôda **kroz naš poslužitelj** | **ne može** | poslužitelj nema takav alat: jedini alat čita `nodes` pod korisnikovim tokenom; nema `fetch` prema van, SQL-a iz argumenata ni pristupa disku |
| upisati zlonamjeran sadržaj u **vlastiti nacrt** | **može danas** | N5 → zatvara ②/0a; do tada štiti samo to što Prihvati i pregled ne postoje |
| odnijeti korisnikov materijal kroz **drugi** alat u istom chatu (npr. pretraživanje weba) | izvan našeg dosega | mi vraćamo najmanje moguće (imena i id-evi) i nikad tuđe; ostalo je granica klijenta |
| „zatrovati" vlastiti nacrt uputama za sljedeći razgovor | može, ograničeno | šteta ostaje u nacrtu koji korisnik pregleda; alati ②/2 vraćaju sadržaj nacrta kao **podatak**, uz napomenu u opisu alata |

**Pravilo za ②/2:** nijedan alat ne dobiva slobodan URL, SQL ni putanju; argumenti su tipizirani i provjereni u
poslužitelju **i** u bazi; nijedan alat ne vraća ništa što korisnik nije sam napisao.

## 6 · Matrica testova (obavezne dimenzije)

| dimenzija | danas izmjereno | nedostaje |
|---|---|---|
| dva različita korisnika | `mcp:nacrt` ② (tuđi nacrt × 4, isti odgovor kao nepostojeći) · S-B: kod izdan klijentu X ne vrijedi za Y | Prihvati tuđeg nacrta (②/4) |
| administratorov konektor | `mcp:brava` · **S-B: 11 tvrdnji** (uloga, 5 RPC-ova, 5 tablica, kontrola običnom admin sesijom) | — |
| izravni pozivi mimo MCP-a | `mcp:brava` (PostgREST, Storage, Edge Functions, Auth API) · S-B: obična sesija ne ulazi u `mcp_*` | nacrt s zabranjenim sadržajem izravnim RPC-om → Prihvati odbija (③/6) |
| opozvan / pogrešan token | ①/5 · **S-B:** izmijenjen teret (401) · `alg=none` (401) · anon ključ (401) · opoziv: obnova 400, propusnica i dalje piše · PKCE, redirect, jednokratni kod | istekao (⑤) |
| paralelne izmjene | **S-B:** 8 usporednih početaka → točno 3 (kvota drži) · usporedni upisi → **N7** | polazna verzija (②/1b); Prihvati uz izmjenu materijala (②/4) |
| ponovljeni zahtjevi | **S-B:** ponovljena predaja odbijena · ponovljen početak → **N8** | ključ ponavljanja (②/1b); dvostruki Prihvati (②/4) |
| zlonamjeran sadržaj | N1, N2 lokalno · **S-B: 8 oblika primljeno u nacrt (N5)** | validator (②/0a); pregled (②/4); pravi AI sa zlonamjernim PDF-om (⑤) |

Mjerne skripte dionica A i B nisu u repozitoriju (scratchpad sesije); u ②/0 i ②/1b postaju brane u
`scripts/mcp-nacrt-check.js` i unitima, uz mutacije.

## 7 · Uvjeti puštanja korisnicima (ulaz u fazu ⑥)

Svaki redak mora biti **zelen i izmjeren**, ne pretpostavljen:

1. I1–I3 i dalje zelene na stagingu (`mcp:brava`, `mcp:nacrt`), nakon svih cigli ② i ③.
2. **N2 zatvoren** s regresijskim pokusom u pregledniku; **N1 zatvoren** unitom.
3. Validator u bazi (②/0a) na **sva tri** puta upisa; MCP profil bez `legacy-html`, `learn.content` i vanjskih slika.
4. Prihvati: samo obična sesija · polazna verzija · idempotentan · nacrt ubačen mimo poslužitelja ne prolazi.
   Upis nacrta: polazna verzija i ključ ponavljanja (N7, N8 zatvoreni).
5. Limiti iz S-C postavljeni i izmjereni; postoji način da se jedan konektor ugasi.
6. Backup i brisanje računa pokrivaju nacrte i veze (S-C).
7. Pravi AI (Claude + ChatGPT) na ne-admin računu prošao cjevovod i scenarij zlonamjernog PDF-a (⑤).
8. Postavke Auth-a na produkciji jednake stagingu (tri imenovana koraka iz ①).
