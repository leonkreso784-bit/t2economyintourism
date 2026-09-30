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
| **Sigurnosna analiza** | A ✅ (renderer · validacija · `mcp-admin`) · B ✅ (ovlasti · nacrt · injection) · C ✅ (limiti · backup · brisanje · logovi) — nalazi N1–N16 u [MCP_SECURITY §4](../architecture/MCP_SECURITY.md) |
| **Ⓗ H1** ✅ | **N10** zatvoren 30.09.: SQL na PROD-u (provjeren), `main` = `42a13b3`, T5 objavljuje materijal (BUG-052) |
| **②/0 sigurnosni temelj** | ✅ STAGING 30.09. — a · b · c · d · e, svaka s crvenim na starom kodu i `brana-revizor`om; N1, N2, N4, N5 zatvoreni na stagingu |
| **②/1b** | ✅ STAGING 30.09. — N7 i N8 zatvoreni; brana dopunjena po revizoru (8 usporednih upisa, HTTP 409 i < 5 s, `mcp:brava` po punom potpisu), svaka dopuna crvena pod mutacijom; ⚠️ drift staging-SQL ↔ `f6-nacrt.sql` nitko ne mjeri (brana prije ⑥); N9 prijevod napisan, **neožičen** (ožičava ②/2) |

## 2 · Redoslijed

### Ⓢ Sigurnosna analiza (prije ②/0 — nalazi određuju što ②/0 mora zatvoriti)

| cigla | posao | uvjet završetka |
|---|---|---|
| **S-A** ✅ | područja 3 · 4 · 8 (čitanje koda, lokalni pokusi) | nalazi upisani u MCP_SECURITY §4 |
| **S-B** ✅ | područja 1 · 2 · 5 na STAGINGU (43 tvrdnje, jednokratni korisnici, staging poslije čist): admin konektor, token, opoziv, OAuth tok **drže**; nalazi **N7** (tihi gubitak pri usporednom upisu) · **N8** (duplikat pri ponovljenom početku) · **N9** (odbijanja kao 500) · N5 potvrđen uživo (8 oblika). `publish_node` u bazi = datoteka; `pg_jsonschema` 0.3.3 dostupan na stagingu | ✅ matrica MCP_SECURITY §6 ima ishod za sva tri područja; ostatak imenovan (istekao token → ⑤) |
| **S-C** ✅ | područja 6 · 7 na STAGINGU (jednokratni korisnik, poslije nula redaka): nalazi **N10** (brisanje računa puca uz objavljen materijal) · **N11** (nema granice učestalosti; DCR bez čišćenja) · **N12** (alat tiho reže na 1 000) · **N13** (objava 5 MB prolazi; meko obrisano zauvijek) · **N14** (backup bez UGC-a, nešifriran, bez roka) · N15 (lokalni nacrt nakon odjave) · N16 (`mcp_klijent` bez timeouta). Drži: nacrti i OAuth veze nestaju s računom; logovi bez tokena i tijela | ✅ [završni izvještaj](https://claude.ai/artifact/AQYadWjTpQnVxeBcRyGjhs) objavljen (privatan); ovaj plan dopunjen (Ⓗ, ④) |

### Ⓗ Hitni popravak izvan F6 (Leon, anketa 29.09.: *zasebno, odmah*)

Vlastita grana od `main`-a, ne `feat/f6-mcp`; F6 ga samo citira. Produkcijski korak = Leonov izričit OK.

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **H1** ✅ brisanje računa | `node_content_versions.edited_by` → `on delete set null` (kalup `content_versions`); SQL u `supabase/` + staging, pa PROD u SQL Editoru · `delete-account-check` T5 **objavi** materijal (i ima nacrt od AI-ja) prije brisanja · prije: upit na PROD koliko je korisnika pogođeno | T5 s objavom danas 409 i poluobrisan račun → poslije 200 i nula redaka u svim tablicama |

### ②/0 Sigurnosni temelj ✅ STAGING (30.09.) — ishodi i dokazi: PROGRESS 30.09., MCP_SECURITY §4

Odluke (Leon, anketa 30.09.): **pg_jsonschema** (shema u `schema/ugc-content.schema.json`, SQL generiran) · **JEDAN
strogi profil** za Studio i AI (umjesto „MCP profil stroži") · DOMPurify **s naše domene** + tekst · `script-src`
**točne datoteke** · nacrt u **obliku gradiva** (②/3 time postaje gotovo identitet) · boja lekcije u bazi = oblik
`#rrggbb` (Studio ima slobodan birač, ADR-025); kurirana paleta za AI ostaje ③/4.

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **②/0a** validator u bazi | **jedna** funkcija provjere sadržaja koju zovu `mcp_upisi_nacrt`, Prihvati (②/4) i `publish_node`: dopuštena polja i tipovi blokova · duljine · broj stavki · dubina · jedinstveni id-evi · valjane reference · boje iz kurirane palete · sheme adresa. **MCP profil je stroži:** bez `legacy-html`, bez `learn.content` (sirovi HTML), bez vanjskih slika. Kandidat: `pg_jsonschema` + MCP profil `schema/subject-content.schema.json` (S-B mjeri dostupnost) | payload s `legacy-html` / 501 znakom / 10 000 kartica / `javascript:` adresom prolazi `mcp_upisi_nacrt` i `publish_node` danas → poslije svaki od njih pada s imenovanom greškom |
| **②/0b** granica `publish_node` | veličina (isti 1 MB kao nacrt) + validator iz ②/0a — Prihvati ide ovim putem | payload od 5 MB danas prolazi |
| **②/0c** `safeUrl` | kontrolni znakovi i razmaci se uklanjaju prije provjere sheme (ili odluka preko URL parsera s popisom dopuštenih shema) | 7 oblika iz nalaza N1 danas prolazi → unit ih odbija |
| **②/0d** prikaz bez sanitizatora | kad DOMPurify nije učitan, `legacy-html` i `learn.content` se prikazuju kao **tekst**, nikad kao HTML; isto u krajnjem fallbacku `js/learn.js` | pokus N2 (srcdoc + skripta s dopuštenog CDN-a čita sesiju uz produkcijski CSP) → poslije ne izvrši ništa, s kontrolom |
| **②/0e** CSP | `script-src` sužen s cijelih CDN hostova na točne putanje s verzijom (ili vlastito posluživanje) | isti pokus N2 s oslabljenim ②/0d → CSP ga i dalje blokira |
| **②/1b** usporedno i ponovljeno | `mcp_upisi_nacrt` prima polaznu oznaku (`updated_at` ili brojač) i odbija ako se promijenila · pozivi koji stvaraju primaju **ključ ponavljanja** (isti ključ = isti nacrt) · alat prevodi kodove odbijanja u jasne poruke (N9) | S-B pokus: dva usporedna upisa → danas oba 200 i jedan tiho izgubljen → poslije drugi dobiva sukob · dva ista početka → danas dva nacrta → poslije jedan |

### ② Cjevovod u nacrt

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **②/2** alati | `procitaj_materijale` → `zapocni_nacrt` (lekcije s bojom) → `napisi_learn` → `dodaj_kartice` (pada bez Learna) → `dodaj_pitanja` (pada bez kartice) → `predaj_nacrt` · `procitaj_nacrt`; upute cjevovoda u `instructions` poslužitelja. **Alati po lekciji** (ne 200 kartica u jednom pozivu) · svaki poziv koji piše nosi **ključ ponavljanja** | unit nad modulom alata + e2e: Node MCP klijent s pravim tokenom prođe cjevovod na stagingu · isti poziv poslan dvaput ne duplicira lekciju · **N9:** unit traži da svaki `rpc(...)` u alatima ide kroz `prevediOdbijanje` i pada kad takvih poziva nema |
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

### ④ Limiti, čišćenje, backup (iz S-C; brojke = Leon, anketa 29.09.: *umjeren paket*)

Mjerna osnova: pravi cjevovod za 30 lekcija (alati po lekciji) ≈ 92 upisa kroz nekoliko minuta; izmjereno ~16
upisa/s uzastopno i 60 usporednih bez odbijanja (N11). Sve granice žive **u bazi** (isti token zove RPC i mimo
poslužitelja, N5) i svaka ima obrnutu provjeru.

| cigla | posao | crveno na starom kodu |
|---|---|---|
| **④/1** učestalost | brojač u bazi po korisniku **i** po `client_id`: **60 upisa/min, 1 000/dan**; prekoračenje = imenovan kod koji alat prevodi u „pokušaj za N s" (N9) | 61. upis u minuti danas 200 → poslije odbijen; 60. prolazi |
| **④/2** paginacija i kvota | `procitaj_materijale`: izričit raspon, **najviše 500 stavki** + `skraceno: true` i ukupan broj · `create_node`: **najviše 2 000** živih čvorova po korisniku | 1 200 polica danas → AI vidi 1 000 bez znaka (N12) · 2 001. čvor danas prolazi |
| **④/3** veličina i vrijeme | objava ≤ 1 MB (= ②/0b) · `mcp_klijent`: `statement_timeout = 5s` · odgovor alata ≤ 1 MB | objava 5 MB danas 200 (N13) · `pg_roles` bez postavke (N16) |
| **④/4** gašenje jednog konektora + opoziv | tablica blokiranih `client_id`-eva: hook ne izdaje token, a `_nacrt_pozivatelj()` odbija **odmah** (i živu propusnicu) · ista provjera gleda postoji li još korisnikov pristanak → opoziv zaustavlja **upis** odmah, čitanje do isteka | blokiran klijent i opozvan pristanak danas pišu do 3600 s (I8) |
| **④/5** `pg_cron` (Leon: da) | jedan noćni posao: istekli nacrti · meko obrisani čvorovi stariji od **30 dana** (s verzijama i slikama) · DCR klijenti bez ijednog pristanka stariji od 30 dana. Verzije **bez roka** (Leon) | nacrt star 8 dana i čvor obrisan prije 31 dan danas postoje → poslije posla nema ih; kontrola: 29 dana ostaje |
| **④/6** backup (Leon: sva tri) | `backup-db.js` + `nodes`, `node_content`, `node_content_versions`, `profile_identity` (nacrti NE) · **AES-GCM** ključem iz `.env` · **rok 8 tjedana** (starije se briše) · `--verify` dešifrira i uspoređuje sha256 | snimka danas bez UGC-a i čitljiva bez ključa (N14) → poslije obrnuto; snimka od 9 tjedana nestaje |
| **④/7** preglednik | odjava briše `sokrat-draft:node:*` (uz upozorenje ako ima nespremljenog) · Sentry `beforeSend` briše fragment i upit iz adrese | N15: ključ ostaje nakon odjave → poslije nema ga |

Rizik: pogrešno postavljena granica ④/1 obori pravi cjevovod → ⑤ mora proći cijeli materijal ispod granice.

### ⑤ Pravi AI

Claude.ai i ChatGPT (Leon ima Plus) na **ne-admin** računima: cijeli cjevovod na stvarnom materijalu · zlonamjeran PDF
s uputama (MCP_SECURITY §2) · agent-napadač na brave. Uvjet: svaki scenarij iz [MCP_TESTING §5](../workflow/MCP_TESTING.md)
ima zapisan ishod.

### ⑥ Produkcija — zadnje, svaki korak uz Leonov izričit OK

SQL u SQL Editoru → OAuth poslužitelj + hook u dashboardu → funkcija → klijent. Uz to tri imenovana koraka iz ①
([archive/MCP_KONEKTOR.md](../archive/MCP_KONEKTOR.md), kraj): `Require current password` na PROD-u · razlika postavki
staging/prod · `MCP_RESOURCE_URL` na kanonsku adresu. **Uvjet ulaska u ⑥:** svi uvjeti iz
[MCP_SECURITY §7](../architecture/MCP_SECURITY.md) zeleni.
**Prije SQL-a na PROD (revizor ②/1b, N2):** brana koja uspoređuje tijela funkcija na stagingu (`pg_get_functiondef`
bez komentara) sa `supabase/f6-*.sql` — danas se mjeri staging, a na PROD ide datoteka; 30.09. su se razlikovali u
komentarima (`mcp_zapocni_nacrt` i dalje).

## 3 · Otvoreno za Leonovu riječ

- ~~`pg_cron`~~ → **da** (anketa 29.09.), ④/5. ~~Limiti~~ → umjeren paket, ④/1–④/3. ~~Backup~~ → gradivo +
  šifriranje + rok 8 tjedana, ④/6. Zadržavanje verzija: **bez roka** (nije odabrano).
- Trenutan opoziv **čitanja** (provjera na svakom čitanju = vrući put) — upis se zaustavlja odmah kroz ④/4.
- ~~`pg_jsonschema` vs. ručni validator~~ → **pg_jsonschema** (anketa 30.09.; na PROD-u dostupan 0.3.3, nije instaliran).
- **Prije ⑥:** administratorov testni materijal na PROD-u ima karticu od 1 819 znakova → nakon ②/0b se ne da ponovno
  objaviti dok se kartica ne skrati (ostala 3 PROD materijala prolaze).
- **N17** (GTM/Sentry u `script-src` kao hostovi): suziti tek nakon mjerenja što loaderi učitavaju.
- `mcp-admin/` (lokalni pokus izvan repozitorija): obrisati ili arhivirati (nalaz N6).

Rizici: beta OAuth poslužitelj, mlad `@supabase/server` · **greška u hooku = nitko se ne prijavi** (izlaz: isključiti
hook u dashboardu) · ograničeno CPU vrijeme Edge Functiona · besplatni Claude = jedan konektor.
