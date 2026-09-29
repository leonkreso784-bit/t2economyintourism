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
| I7 | ponovljen zahtjev ne duplicira; paralelna izmjena se ne prepisuje | ključ ponavljanja · polazna verzija | ⏳ plan ②/2, ②/4 · S-B mjeri |
| I8 | opoziv veze zaustavlja AI | Auth (`revokeGrant`) | ⚠️ obnova odmah, propusnica do 3600 s — korisniku rečeno; trenutni opoziv = odluka |

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
- ⚠️ Stvarna definicija u bazi još nije uspoređena s datotekom → S-B.
- **Popravak:** plan ②/0a–b.

### N5 · nacrt: pravila samo u poslužitelju — 🟠 SREDNJI

- `mcp_upisi_nacrt` (`supabase/f6-nacrt.sql` redci 157–162) provjerava samo objekt i 1 MB. Po ADR-038 brane kvalitete
  žive u poslužitelju, ali **isti token RPC zove i izravno** (P4) — tada brane ne vrijede. Vlasništvo i kvota i dalje drže.
- ADR-038 to već predviđa („ponavljaju se pri Prihvati"); nalaz je da **sigurnosna** pravila (zabrana HTML-a i
  opasnih adresa) moraju biti u bazi već pri upisu nacrta, jer korisnik nacrt **gleda** prije Prihvati.
- **Popravak:** plan ②/0a.

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
| 1 ovlasti | admin konektor ne dobiva ništa više · opozvan/istekao/tuđi/krivotvoren token · `publish_node`, brisanje materijala, profil, `delete-account` izravno AI-tokenom | S-B |
| 2 nacrt/objava | paralelni `mcp_upisi_nacrt` (zadnji pobjeđuje?) · ponovljen `zapocni` nakon prekida (duplikat?) · kvota pod usporedbom | S-B |
| 5 injection | što model **može** kad posluša izvor: doseg alata = vlastiti nacrt; nema HTTP-a, SQL-a, datoteka ni izvršavanja | S-B + ⑤ |
| 6 limiti | učestalost, veličina odgovora, paralelni poslovi, timeouti, rast verzija, gašenje konektora | S-C |
| 7 privatnost | pokriće `scripts/backup-db.js` (nacrti, identitet, verzije, Storage) · brisanje nacrta i veza s računom · tokeni i gradivo u logovima/analitici · lokalni cache pri promjeni korisnika | S-C |

## 6 · Matrica testova (obavezne dimenzije)

| dimenzija | danas izmjereno | nedostaje |
|---|---|---|
| dva različita korisnika | `mcp:nacrt` ② (tuđi nacrt × 4, isti odgovor kao nepostojeći) | Prihvati tuđeg nacrta (②/4) |
| administratorov konektor | `mcp:brava` (admin-vrata `send-notification`, `is_admin()`) | pun prolaz s test-admin računom kroz sve RPC-ove (S-B) |
| izravni pozivi mimo MCP-a | `mcp:brava` (PostgREST, Storage, Edge Functions, Auth API) | nacrt s zabranjenim sadržajem izravnim RPC-om → Prihvati odbija (③/6) |
| opozvan / pogrešan token | ①/5 (obnova odbijena odmah, propusnica 3600 s) · `bad_jwt` 403 | istekao, krivotvoren potpis, token drugog projekta (S-B) |
| paralelne izmjene | kvota pod bravom (mutacija M2) | usporedni upisi istog nacrta; Prihvati uz izmjenu materijala (S-B, ②/4) |
| ponovljeni zahtjevi | — | ključ ponavljanja u alatima (②/2); dvostruki Prihvati (②/4) |
| zlonamjeran sadržaj | N1, N2 lokalno | kroz pravi tok nacrt → pregled (S-B), pravi AI sa zlonamjernim PDF-om (⑤) |

## 7 · Uvjeti puštanja korisnicima (ulaz u fazu ⑥)

Svaki redak mora biti **zelen i izmjeren**, ne pretpostavljen:

1. I1–I3 i dalje zelene na stagingu (`mcp:brava`, `mcp:nacrt`), nakon svih cigli ② i ③.
2. **N2 zatvoren** s regresijskim pokusom u pregledniku; **N1 zatvoren** unitom.
3. Validator u bazi (②/0a) na **sva tri** puta upisa; MCP profil bez `legacy-html`, `learn.content` i vanjskih slika.
4. Prihvati: samo obična sesija · polazna verzija · idempotentan · nacrt ubačen mimo poslužitelja ne prolazi.
5. Limiti iz S-C postavljeni i izmjereni; postoji način da se jedan konektor ugasi.
6. Backup i brisanje računa pokrivaju nacrte i veze (S-C).
7. Pravi AI (Claude + ChatGPT) na ne-admin računu prošao cjevovod i scenarij zlonamjernog PDF-a (⑤).
8. Postavke Auth-a na produkciji jednake stagingu (tri imenovana koraka iz ①).
