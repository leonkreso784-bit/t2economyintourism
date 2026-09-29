# MCP — plan razvoja (F6)

**Status:** 🟩 AKTIVAN · **Otvoren:** 2026-09-29 (Leon: *„uhvatio bi se sada jako ozbiljno na razvoj"*) ·
**Zamjenjuje:** `RASPORED.md` §F6 (raspored je za to vrijeme ⏸️ pauziran, nastavlja se s F7).

> **Cilj (Leon, sigurnosni zahtjev 29.09.):** siguran MCP kroz koji korisnikov AI stvara i uređuje
> **isključivo njegove nacrte**, a **korisnik** pregledava promjene i objavljuje gradivo.
>
> **Što ovaj dokument JEST:** redoslijed cigli i **uvjet završetka** svake, uključujući sigurnosni.
> **Što NIJE:** mjesto za mjerenja i obrazloženja. Ona žive ovdje:
>
> | pitanje | dokument |
> |---|---|
> | što korisnik dobiva, kad je gotovo | [product/MCP.md](../product/MCP.md) |
> | kako je građeno (OAuth, uloga, nacrt, alati) | [architecture/MCP.md](../architecture/MCP.md) |
> | od čega se branimo, što je zaštićeno, otvoreni nalazi | [architecture/MCP_SECURITY.md](../architecture/MCP_SECURITY.md) |
> | kako se mjeri (računi, naredbe, mutacije, pravi AI) | [workflow/MCP_TESTING.md](../workflow/MCP_TESTING.md) |
> | kako su izvedeni ①, S1 i S2 | [archive/MCP_KONEKTOR.md](../archive/MCP_KONEKTOR.md) |
> | zašto baš tako | ADR-030 · ADR-031 · [ADR-038](../records/DECISIONS.md#adr-038) |

---

## 0 · Pravila vožnje

- **Jedna cigla = jedan commit**, gate na svakoj; „crveno" = provjera koja **pada na starom kodu** (obrnuta provjera
  ili mutacija). Brana koja ne pada na starom kodu = cigla **nije gotova** (Leon, 18.09.).
- **Sve prvo na STAGINGU.** Produkcija i `main` se u F6 ne diraju do faze ⑥, i ondje svaki korak traži izričit OK.
- **`brana-revizor` se pušta na svaku sigurnosnu ciglu** — u fazi ① vratio je ciglu više puta, uvijek s pravom.
- **Zastanak na kraju faze** (①…⑥); unutar faze cigle teku.

## 1 · Gdje smo

| faza | stanje |
|---|---|
| **① konektor + OAuth** | ✅ STAGING — Claude.ai spojen i čita vlastite materijale; brava `mcp_klijent`; odobrenje; Povezani AI-jevi; rewrite `/mcp`. Povijest: [archive/MCP_KONEKTOR.md](../archive/MCP_KONEKTOR.md) |
| **S1 · S2** (CI mjeri žicu · `test:unit` se nabraja sam) | ✅ |
| **②/1 nacrt** | ✅ STAGING — `node_drafts` + pet `mcp_*` RPC-ova; `mcp:nacrt` 34/0, `mcp:brava` 46/0, mutacije 4/4 |
| **②/1a test-računi** | ✅ `npm run staging:racuni` |
| **Sigurnosna analiza** | A ✅ (renderer · validacija · `mcp-admin`) · **B i C na redu** |

## 2 · Redoslijed

### Ⓢ Sigurnosna analiza (prije ②/0 — nalazi određuju što ②/0 mora zatvoriti)

| cigla | posao | uvjet završetka |
|---|---|---|
| **S-A** ✅ | područja 3 · 4 · 8 (čitanje koda, lokalni pokusi) | nalazi upisani u MCP_SECURITY §4 |
| **S-B** | područja 1 · 2 · 5 na STAGINGU: dva korisnika · admin konektor · izravni pozivi mimo MCP-a · opozvan/pogrešan token · paralelne izmjene · ponovljeni zahtjevi · zlonamjeran sadržaj; stvarna definicija `publish_node` u bazi; dostupnost `pg_jsonschema` | svaka stavka matrice MCP_SECURITY §6 za ta područja ima ishod (izmjereno / netočna pretpostavka / odgođeno s razlogom) |
| **S-C** | područja 6 · 7 (limiti, troškovi, backup, brisanje, logovi) + završni izvještaj objavljen kao dokument | izvještaj objavljen; ovaj plan dopunjen uvjetima iz B i C |

### ②/0 Sigurnosni temelj (NOVO — prije ijednog alata koji piše)

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **②/0a** validator u bazi | **jedna** funkcija provjere sadržaja koju zovu `mcp_upisi_nacrt`, Prihvati (②/4) i `publish_node`: dopuštena polja i tipovi blokova · duljine · broj stavki · dubina · jedinstveni id-evi · valjane reference · boje iz kurirane palete · sheme adresa. **MCP profil je stroži:** bez `legacy-html`, bez `learn.content` (sirovi HTML), bez vanjskih slika. Kandidat: `pg_jsonschema` + MCP profil `schema/subject-content.schema.json` (S-B mjeri dostupnost) | payload s `legacy-html` / 501 znakom / 10 000 kartica / `javascript:` adresom prolazi `mcp_upisi_nacrt` i `publish_node` danas → poslije svaki od njih pada s imenovanom greškom |
| **②/0b** granica `publish_node` | veličina (isti 1 MB kao nacrt) + validator iz ②/0a — Prihvati ide ovim putem | payload od 5 MB danas prolazi |
| **②/0c** `safeUrl` | kontrolni znakovi i razmaci se uklanjaju prije provjere sheme (ili odluka preko URL parsera s popisom dopuštenih shema) | 7 oblika iz nalaza N1 danas prolazi → unit ih odbija |
| **②/0d** prikaz bez sanitizatora | kad DOMPurify nije učitan, `legacy-html` i `learn.content` se prikazuju kao **tekst**, nikad kao HTML; isto u krajnjem fallbacku `js/learn.js` | pokus N2 (srcdoc + skripta s dopuštenog CDN-a čita sesiju uz produkcijski CSP) → poslije ne izvrši ništa, s kontrolom |
| **②/0e** CSP | `script-src` sužen s cijelih CDN hostova na točne putanje s verzijom (ili vlastito posluživanje) | isti pokus N2 s oslabljenim ②/0d → CSP ga i dalje blokira |

### ② Cjevovod u nacrt

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **②/2** alati | `procitaj_materijale` → `zapocni_nacrt` (lekcije s bojom) → `napisi_learn` → `dodaj_kartice` (pada bez Learna) → `dodaj_pitanja` (pada bez kartice) → `predaj_nacrt` · `procitaj_nacrt`; upute cjevovoda u `instructions` poslužitelja. **Alati po lekciji** (ne 200 kartica u jednom pozivu) · svaki poziv koji piše nosi **ključ ponavljanja** | unit nad modulom alata + e2e: Node MCP klijent s pravim tokenom prođe cjevovod na stagingu · isti poziv poslan dvaput ne duplicira lekciju |
| **②/3** oblik materijala | nacrt → payload (kategorija po lekciji, v2 id-evi, bez slika i videa u prvom izdanju); veza kartica→pitanje = opcionalno polje `card` u shemi (aditivno) | `validate:schema` + validator ②/0a nad izlazom |
| **②/4** pregled i prihvat | „Nacrti od AI-ja" u Mojim materijalima, **isti renderer** (s ②/0c–d) · **Prihvati** = jedna transakcija, **samo obična sesija**, validator ②/0a ponovno, polazna verzija gradiva (sukob = odbij, ne prepiši) · **Odbaci** · prihvat istog nacrta dvaput = jedan materijal | nacrt → prihvat → materijal se uči · OAuth token ne može prihvatiti · nacrt ubačen izravnim RPC-om mimo poslužitelja ne prolazi prihvat · paralelna izmjena materijala → prihvat odbija |
| **②/5** ulaz | „Spoji svoj AI" (ADR-026: jedna radnja, dva ulaza) → upute + kopiraj URL; lažni tekst `studio.js:235` nestaje | spec |

### ③ Četiri brane (ADR-031) — u poslužitelju, iz istih modula koje čita preglednik, i ponovno pri Prihvati

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **③/0** mjerenje | katalog: duljina odgovora dopune, nalazi li se odgovor u kartici → prag brane ④ | — (brojke se upisuju ovdje) |
| **③/1** jedan izvor | `card-limits.js`, paleta i `normFill` u Deno-u: uvoz izvan `supabase/functions/` ili generirana kopija s drift-branom (kalup `build:css`); `KURIRANE_BOJE` i `normFill` u male module po kalupu `card-limits.js` | drift-brana pada na razlici |
| **③/2** duljina | 501 odbija s mjestom; 201–500 prolazi uz upozorenje AI-ju | 500 prolazi, 501 pada |
| **③/3** pitanje po kartici | `predaj_nacrt` pada ako kartica nema ni kviz ni dopunu | unit + e2e |
| **③/4** boja | svaka lekcija ima boju iz kurirane palete | unit |
| **③/5** dopuna | praznine = odgovori · neprazan poslije `normFill` · bez HTML-a i LaTeX-a (razred BUG-024/025) · kratak (prag iz ③/0) · nalazi se u izvornoj kartici · nije već napisan u rečenici. ⚠️ **Jednoznačnost se strojno NE dokazuje** — ovo je oblik, ne istina | unit po obliku (danas prolazi 2 praznine uz 1 odgovor) |
| **③/6** druga linija | iste brane pri **Prihvati** (kroz ②/0a) | nacrt ubačen izravnim RPC-om s karticom od 501 znaka → prihvat odbija |

Rizik: prestrog prag ④ → AI zapne; zato ③/0 ide prvo.

### ④ Limiti i opoziv (sadržaj određuje S-C)

Učestalost po korisniku i konektoru · veličina zahtjeva i odgovora · paralelni poslovi · rast `node_content_versions` ·
periodično čišćenje isteklih nacrta (`pg_cron`, Leon: odluka uz sigurnosnu analizu) · privremeno gašenje jednog
konektora · trenutan opoziv (danas izdana propusnica živi do 3600 s). Cigle se upisuju poslije S-C.

### ⑤ Pravi AI

Claude.ai i ChatGPT (Leon ima Plus) na **ne-admin** računima: cijeli cjevovod na stvarnom materijalu · zlonamjeran PDF
s uputama (MCP_SECURITY §2) · agent-napadač na brave. Uvjet: svaki scenarij iz [MCP_TESTING §5](../workflow/MCP_TESTING.md)
ima zapisan ishod.

### ⑥ Produkcija — zadnje, svaki korak uz Leonov izričit OK

SQL u SQL Editoru → OAuth poslužitelj + hook u dashboardu → funkcija → klijent. Uz to tri imenovana koraka iz ①
([archive/MCP_KONEKTOR.md](../archive/MCP_KONEKTOR.md), kraj): `Require current password` na PROD-u · razlika postavki
staging/prod · `MCP_RESOURCE_URL` na kanonsku adresu. **Uvjet ulaska u ⑥:** svi uvjeti iz
[MCP_SECURITY §7](../architecture/MCP_SECURITY.md) zeleni.

## 3 · Otvoreno za Leonovu riječ

- `pg_cron` za periodično čišćenje nacrta (nova infrastruktura i na PROD-u).
- Trenutan opoziv AI-ja (provjera na svakom čitanju = vrući put) ili istina „do 60 minuta" kao danas.
- `pg_jsonschema` vs. ručni validator u plpgsql (ovisi o S-B).
- `mcp-admin/` (lokalni pokus izvan repozitorija): obrisati ili arhivirati (nalaz N6).

Rizici: beta OAuth poslužitelj, mlad `@supabase/server` · **greška u hooku = nitko se ne prijavi** (izlaz: isključiti
hook u dashboardu) · ograničeno CPU vrijeme Edge Functiona · besplatni Claude = jedan konektor.
