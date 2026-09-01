# Rješavanje problema — 9. mjesec 2026

> 🟩 **AKTIVNI SPEC.** [FRONTEND_REDIZAJN.md](./FRONTEND_REDIZAJN.md) je za trajanja ove faze
> **⏸️ PAUZIRAN** — nije ispunjen i ne ide u arhivu, samo ne vrijedi kao „što sada".
> Kad ova faza padne, redizajn se nastavlja od cigle **C5b/2** bez ijedne izgubljene odluke.

**Zašto postoji.** Revizija 2026-08-31 iznijela je dvanaest nalaza, a backlog uz njih drži još osam
živih 🔥 stavki. Leon: *„Ovako nešto se mora riješit prije nego što nastavimo dalje."* Faza je
**sanacija**, ne izgradnja: ništa se novo ne gradi dok se ovo ne prođe.

**Ime faze: MREŽA.** Jer `preflight` je *„zadnja mreža"*, a revizija je pokazala da mreža ima rupe
kroz koje je prošlo **troje od dvanaest** nalaza. Popravljamo mrežu, pa tek onda opet gradimo.

---

## 1 · Kako se ova datoteka koristi

| radnja | gdje |
|---|---|
| **Prijatelji zapisuju što ne valja** | §8 — NALAZI IZVANA. Jedan nalaz = jedan blok po predlošku |
| **Ja triažiram** | svaki nalaz dobiva ciglu ili obrazloženo „ne sada" — **nijedan se ne briše** |
| **Napredak** | ✅/⏳ uz ciglu + brojka iz brane, nikad „mislim da je bolje" |
| **Pouke i mjere** | ostaju **ovdje**, ne sele u `CLAUDE.md` (ADR-027: jedna činjenica, jedno mjesto) |

**Izlazni uvjet cijele faze** stoji u §9. Dok on nije ispunjen, redizajn se ne nastavlja.

---

## 2 · Osnovice — brojke od kojih krećemo

Izmjereno **2026-08-31**. Bez zapisane polazne brojke ne može se dokazati da je išta palo.

| mjera | polazno | naredba |
|---|---|---|
| paleta — čegrtaljka | **93 / 93** | `npm run check:palette` |
| paleta — po posljedici | **10 fatalno · 21 blago · 46 stara** | `npm run palette:breakdown` |
| siročad u CSS-u | **45 / 45** | `npm run check:orphan-css` |
| CSS koji čeka migraciju | **6962 redaka · 34 `!important`** | `npm run css:debt` |
| advisor — performance | **14 WARN** (`auth_rls_initplan`) + 3 INFO | Supabase |
| advisor — security | **15 WARN · 0 ERROR** | Supabase |
| `final == M1⊕M2` | **16 provjereno · 8 preskočeno** | `npm run check:final` |
| budžet posjetitelja | **179.9 KiB / 200 KB** (37 skripti) | `npm run check:budget` |
| CI, job „Lint + verify + tests" | polazno **19.4 min / 30** (533 testa u jednom procesu) → **B6: build 0.4 + 2 sharda 11.2/10.0 min** | GitHub Actions |
| ranjivosti | polazno **runtime 0 · dev 15** (11 high) → **0 / 0** (A2) | `npm audit` |
| Node | polazno **stroj 24.11.1 · `.nvmrc` 22 · CI 22** → **sve 24** (A2) | `npm run check:node` |
| `--border-color` | **11 upotreba · 0 definicija** | — |
| a11y po WCAG **razini** | **nije izmjereno** — to je cigla B3a | — |

> ⚠️ **Ispravak 2026-08-31 (A1):** performance-osnovica je ovdje prvo stajala kao **13 WARN**.
> Prebrojano dvaput i neovisno — advisor i `pg_policies` oboje daju **14**. Nijedna brana ne
> gleda brojku u prozi, pa ju je uhvatilo tek izvođenje cigle. Ista je greška stajala i u
> zaglavlju `supabase/c3-rls-initplan.sql` od 14. kolovoza.

> ⚠️ **93 i 77 nisu ista mjera.** `check:palette` broji **pogotke stare palete** (čegrtaljka),
> `palette:breakdown` razlaže **posljedicu** (10+21+46). Ne zbrajati ih i ne uspoređivati.

---

## 3 · BLOK A — Temelj pod nogama · ne dira **nijedan** CSS

Prvi jer nema nijedno preklapanje s frontend fazom, i jer nosi jedini nalaz koji poskupljuje čekanjem.

### A1 · Migracija baze
- 13 politika `auth.uid()` → `(select auth.uid())` (`nodes`, `node_content`, `progress`, `profiles`, `node_content_versions`)
- 2 indeksa na `content_versions_edited_by` i `node_content_versions_edited_by` — audit-tablice samo rastu
- `REVOKE EXECUTE ... FROM anon, authenticated` na `handle_new_user` i `snapshot_content_version`
  — obje vraćaju `trigger`, provjereno u katalogu, pa okidači nastavljaju raditi (izvršavaju se kao vlasnik tablice, ne kroz GRANT)

⛔ **`is_admin` se NE dira** — zovu ga RLS politike kao pozivatelj.

- **Put:** migracija → **staging** → `npm run test:authed` zelen → **Leonov izričit OK** → prod.
- **Dokaz:** `auth_rls_initplan` 13 → 0 · `anon_security_definer` 3 → 1 (ostaje `is_admin`, namjerno) · `test:authed` zelen s obje strane.
- **Obrnuta provjera:** pozvati `/rest/v1/rpc/handle_new_user` kao `anon` **prije** REVOKE-a i zabilježiti odgovor. Ako već puca, REVOKE gasi WARN a ne rupu — i to se **zapisuje**, ne pretpostavlja.

#### A1 — ISHOD (2026-08-31) · ✅ **staging I PRODUKCIJA**

| mjera | prije | poslije (staging) |
|---|---|---|
| politike bez `(select …)` | **14** | **0** |
| advisor performance | 14 WARN | **0 WARN** (ostaju 3 INFO) |
| advisor security | 15 WARN | **11 WARN** |
| indeksi na `*_edited_by` | 0 | **2** |
| `test:authed` | — | **93/93** |
| `test:storage` | — | **8/8** |

**Produkcija (Leonov OK, 2026-08-31).** Isti SQL, isti redoslijed. Izmjereno POSLIJE:
politike **14 omotane / 0 golih** · advisor performance **0 WARN** · security **11 WARN** ·
indeksi **2** · `is_admin` ACL **nedirnut** · broj redaka nepromijenjen (5 profila · 78
napredaka · 9 čvorova) · `check:final` **16/16** (anon put) · prijavljeni vlasnik čita svih pet
tablica (HTTP 200), `is_admin()` vraća **true**, **anon na `progress` dobiva 0 redaka**.

**Obrnuta provjera je dala odgovor koji plan nije pretpostavljao.** Poziv obiju funkcija kao
`anon` vraća **HTTP 404 / PGRST202** — i na produkciji i na stagingu. PostgREST funkcije koje
vraćaju `trigger` uopće ne drži u schema cacheu, pa ruta koju advisor spominje nikad nije ni
postojala. **REVOKE gasi upozorenje, ne rupu** — i to se zapisuje, kako §1 traži.

⚠️ **Nalaz koji je zamalo učinio ciglu lažno ispunjenom.** Zatečeni ACL je glasio
`{=X/postgres, postgres=…, anon=…, authenticated=…}`. Prvi član bez imena role je **PUBLIC**, i
obje role izvršavanje nasljeđuju i preko njega. Planirano `REVOKE … FROM anon, authenticated`
**ne bi promijenilo ništa**, a advisor bi i dalje javljao — pa bi izgledalo kao da brana laže.
Izvedeno je `FROM public, anon, authenticated`.

✅ **Okidači i dalje rade — izmjereno, ne pročitano.** Nakon REVOKE-a je na stagingu stvoren
korisnik preko admin API-ja i redak u `public.profiles` je nastao. Time je tvrdnja *„okidač se
izvršava kao vlasnik tablice, ne kroz GRANT"* prestala biti citat iz dokumentacije.

**Preostalih 11 sigurnosnih WARN:** `is_admin` ×2 (namjerno — zovu ga RLS politike kao
pozivatelj) · 8 node/publish RPC-ova (namjerno, ADR-024) · **`set_updated_at` ima promjenjiv
`search_path`** — jedino koje nije ni namjerno ni pokriveno ovom ciglom. Nije SECURITY DEFINER,
pa je domet manji; **nije popravljeno da se opseg cigle ne širi bez odluke.** Ako se popravi,
izlazni uvjet u §9 postaje 15 → 10 i mora se ispraviti ondje.

**Datoteke:** `supabase/c3-rls-initplan.sql` (napisana 14. 8., dotad neprimijenjena) +
`supabase/a1-grants-indexes.sql` (nova).

### A2 · Stroj
- **Node 22** na razvojnom stroju + nova brana **`check:node`** u preflightu: major iz `process.versions.node` == `.nvmrc`, pada zatvoreno.
  *Zašto brana a ne samo prebacivanje: bez nje se drift vrati prvom idućom instalacijom. Pravilo #9 postoji da razrješenje ne varira ispod nas — a stroj na kojem se piše kôd bio je drugi major od onoga koji presuđuje.*
- **`@lhci/cli`** — svih 11 high-vulns visi na toj jednoj dev-ovisnosti. Prvo mjerenje *vjerujemo li lighthouse jobu išta*, pa **Leonova odluka**: namjerna nadogradnja uz pun gate, ili brisanje ovisnosti i joba.
- **Mrtva grana** `content/model-demo-management-hr` (1 naprijed, 309 iza, 23 konfliktna mjesta, zadnji commit 2026-07-15) → diff u `docs/archive/`, grana se briše. Demo modela kartica je **ideja**, ne kôd koji se mergea.

---

#### A2 — ISHOD (2026-08-31) · ✅ **GOTOVO** (sve tri odluke donesene)

**✅ `fast-uri` — jedini high koji NE dolazi iz lighthousea.** Osnovica je tvrdila *„11 high, sve
kroz `@lhci/cli`"*. Izmjereno: **10 kroz `@lhci/cli`, 1 kroz `ajv`** (`ajv → fast-uri@3.1.3`,
GHSA-v2hh-gcrm-f6hx + GHSA-7p8r-x3mc-p8w7, CVSS 7.5 oba, popravljeno u **3.1.5**). `ajv` traži
`^3.0.1`, pa je dovoljan **pin kroz `overrides`** — raspon bi smio odlutati, a pravilo #9 to
zabranjuje. **high 11 → 10 · ukupno 15 → 14.** `validate:schema` i dalje zeleno (72 dokumenta).

⚠️ **`check:lockfile` je uhvatio moj vlastiti krivi potez** — `npm install --package-lock-only`
pa `npm install` (npm 11) ostavili su lock koji bi `npm ci` na npm 10 srušio. Brana je pala i
ispisala točan popravak (`npx npm@10 install`), koji je i primijenjen. **Točno onaj scenarij zbog
kojeg brana postoji — samo što ga je ovaj put izazvao onaj tko ju je čitao.**

**✅ Mrtva grana `content/model-demo-management-hr`.** Izmjereno: **1 naprijed / 309 iza**, i od
**12 dirnutih datoteka je 11 samo `?v=` tokena**. Sadržaj je bio u jednoj — i nije otpad nego
**izveden primjer kartica-standarda** (kratka kartica → detalj u `learn`), dakle isto što cigla
**E2** tek treba provesti nad zatečenim gradivom. Arhivirano u
[docs/archive/MODEL_KARTICA_DEMO.md](../archive/MODEL_KARTICA_DEMO.md) s punim diffom.
**Brisanje grane čeka izričit OK** — arhiva je napisana, potez nije napravljen.

**✅ Brana `check:node` — napisana i DOKAZANA, ⏳ namjerno JOŠ NIJE u preflightu.**
Uspoređuje **četiri** izvora, ne dva: `.nvmrc` · `engines.node` · svaki `node-version:` u
`.github/workflows/**` · `process.versions.node`. Ispisuje i **koliko je izvora dotaknula**
(§11 pravilo o mjeraču). Obrnuta provjera živi kao test u `tests/unit/check-node-gate.test.js` i
vrti se u `test:unit`: **6/6**, među njima tri ruba koje naivna brana propušta — CI koji odluta
od `.nvmrc`-a · `engines` kao raspon uz točan major · nedostajući izvor (pada zatvoreno).

⚠️ **ZAŠTO NIJE U PREFLIGHTU: čim uđe, preflight je CRVEN dok se stroj ne prebaci.** Stroj vrti
**24.11.1**, `.nvmrc` i sva tri CI joba **22**. To blokira svaki Leonov push, pa je uvrštenje
**njegova odluka, ne naša nuspojava.** Uz nju ide i drugi nalaz: `engines.node` je **`>=22`**,
dakle **raspon** — istinit je i na Node 24, pa tvrdnja prolazi dok stanje ne valja. Pravilo #9
traži točan pin; `engines` je bio jedino mjesto gdje to nije provedeno.

**ODLUKE (Leon, 2026-08-31) I ŠTO SU DALE:**

**① Node → 24, projekt se diže stroju.** `.nvmrc` 24 · `engines.node` **`"24.x"`** (bio raspon
`>=22`, što pravilo #9 zabranjuje) · sva tri CI joba 24 · `check:node` **u preflightu**, zeleno
na svih 6 izvora. `CLAUDE.md` pravilo #9 ispravljeno (22 → 24).

⚠️ **Nuspojava koju nitko nije tražio, a vrijedi više od same cigle:** `check:lockfile` je
postojao jer su stroj (npm 11) i CI (npm 10) imali **različite razrješivače** — ta je razlika
dvaput oborila CI prije ijednog testa. Poravnanjem Nodea **divergencija nestaje na izvoru**, pa
gate sada vrti jedan npm umjesto dva. To je moralo biti **rečeno naglas u ispisu**: jedan zeleni
redak ondje gdje su prije stajala dva izgleda kao izgubljen prolaz. Gate to sada objašnjava i
ostaje kao osiguranje ako se verzije ikad opet raziđu.

**② `@lhci/cli` izbačen, CLS i TBT preseljeni u Playwright.** Uklonjeni: ovisnost ·
`.lighthouserc.json` · CI job `lighthouse` (22 retka). **`npm audit`: 15 → 0** — dakle i tri
`low` i jedan `moderate` koji su također visjeli ondje; procjena je bila „~4 preostalih", a
ostalo je **nula**.

Zamjena je `tests/web-vitals.spec.js` (vrti se u `test:responsive` i CI-ju). **Izmjereno:
CLS 0.0000 · TBT ~140 ms · 2–3 duga zadatka.** Pragovi nisu prepisani nego postavljeni:
**CLS ≤ 0.05** — *zategnuto ispod* lighthouseovih 0.1, jer je CLS bezdimenzionalan i
determinističan na statičnoj stranici; **TBT ≤ 400** — *zadržano*, jer hardver CI-runnera nije
izmjeren, a prag postavljen na lokalnu brojku bio bi čegrtaljka koja pada zbog tuđeg procesora.
⏳ **Zategnuti TBT nakon prvih CI prolaza.**

⚠️ **Što zamjena NIJE — zapisano u zaglavlju samog speca da ne bi tvrdila više nego mjeri:**
nema prigušivanja (lighthouse mjeri uz simulirani spori CPU/mrežu, ovo ne) → brojke su
optimistične i **nisu usporedive** s lighthouseovima; **TBT je aproksimacija** (pravi se računa
između FCP-a i TTI-ja, ovdje je prozor navigacija → smirena mreža). Hvata **katastrofalne
regresije**, ne fine razlike — a to je i sve što je stari prag `performance ≥ 0.5` hvatao.

**③ Grana `content/model-demo-management-hr` obrisana — ali SAMO LOKALNO.**
⚠️ **Ispravak vlastite tvrdnje:** odluka je zatražena uz opis *„grana je samo lokalna"*, što
**nije bilo točno** — postoji i na `origin`. Lokalna je obrisana (`92a2498`, dohvatljiva kroz
reflog), **udaljena je nedirnuta**, jer je odobrenje dano na krivoj premisi. Brisanje udaljene
grane traži zasebnu riječ.

## 4 · BLOK B — Brane koje ne mjere ono što tvrde

Najvažniji blok. **Troje od dvanaest nalaza nisu bugovi nego rupe u mjerenju** — dok one stoje,
svaki idući popravak vrijedi samo na riječ.

### B1 · `check:tokens`
Svaka `var(--x)` u `css/**` mora imati definiciju. Čegrtaljka s **imenovanom** osnovicom.
- Hvata `--border-color`: 11 upotreba, nula definicija, deset puta s fallbackom `#334155` — dakle **tamna paleta koja se prokrijumčarila na svijetlu temu kroz nedefiniranu varijablu**. `check:palette` to ne vidi jer nije pogodak nego rupa.
- Popravak: token po temi, pa brisanje svih 11 fallbackova.
- **Obrnuta provjera:** `var(--nepostojeci)` → brana pada.

#### B1 — ISHOD (2026-08-31) · ✅ **GOTOVO**

**✅ Popravak PRIJE brane, mjerenjem:** token za rub **već postoji** — `--border` u
`css/variables.css` (po temi kroz `--color-line`). Novi token bi bio drugo ime za istu
činjenicu (ADR-027), pa je svih **11 upotreba preusmjereno na `var(--border)`**, fallbackovi
obrisani: 10× `#334155` u `profile.css` + 1× rgba u `learn-blocks.css` (tablice sad prate temu).
`--border-color` u `css/` = **0**.

**✅ Brana `scripts/check-tokens.js`** — u preflightu, **7 obrnutih provjera**
(`tests/unit/check-tokens-gate.test.js`), među njima i tražena: `var(--nepostojeci)` → pad.
Osnovica (`scripts/tokens-baseline.json`) **imenuje 3** svjesne iznimke: `--danger-bg`
(boja = presuda BLOKA C, ADR-032) · `--font-mono` / `--font-serif` (tipografija = redizajn).
Runtime-imena (`--dot`, `--card-accent`, `--lb-acc`, `--sw`, `--item-acc`, `--st-acc`) brana
prepoznaje iz JS/HTML izvora i **ispisuje odvojeno** — definicija na string-uzorku nije isto
što i definicija u CSS-u, i to se vidi, ne pretpostavlja.

⚠️ **Prvo mjerilo je lažno prijavilo `--card-bg`, `--grad` i `--radius-xl`** — sva tri žive u
KOMENTARIMA (povijest vlastitog popravka). Brana zato skida komentare i stringove prije brojanja,
a obrnuta provjera ⑥ drži da spomen u komentaru nikad ne postane nalaz.

### B2 · `check:final` prestaje šutjeti
Danas kaže „preskočeno 8". Neka ih **imenuje**, i neka popis bude zakucan: pojavi li se deveti, brana pada dok ga netko ne odobri.
*Preskakanje je legitimno; **tiho** preskakanje nije.* Isti obrazac kao `check:orphan-css`.

#### B2 — ISHOD (2026-08-31) · ✅ **GOTOVO**

**✅ Preskočeni su dobili ime, razlog i zakucan popis.** `check-final-drift.js` sada svaki skip
gura u `{ id, razlog }` (razlozi: `ne-3-dijelni` · `nije u bazi` · `nepotpun payload`) i sudi ga
protiv `scripts/final-skip-baseline.json`: **novi preskočeni ILI promijenjen razlog = pad.**
Osnovica danas imenuje **8**: `business-informatics` + `-hr` (ne-3-dijelni) i šest HR predmeta
(file-served, nisu u bazi). Graceful-skip na uspavanu bazu netaknut — osnovica se čita tek kad
podaci stignu, pa brana o bazi koje nema i dalje ne sudi.

**✅ 6 obrnutih provjera** (`tests/unit/check-final-skips.test.js`) — bazu **glumi lokalni HTTP
server** kroz postojeći staging-mehanizam (`SUPABASE_TARGET` + `STAGING_SUPABASE_URL`), katalog
kroz `CATALOG_PATH`; mjeri se ISTA skripta koja gađa produkciju, bez mreže i bez diranja baze.
Pokrivaju: deveti preskočeni pada · promijenjen razlog pada · drift i dalje pada.

⚠️ **Prva verzija provjere pala je svih 6/6 — na vlastitom dizajnu, ne na brani:** `spawnSync`
blokira event-loop procesa u kojem živi lažni server, pa je svako dijete visjelo do 20 s aborta
i „dokazalo" da baza spava. Mjerač je opet bio prvi kvar; popravak je asinkroni `spawn` i
komentar koji to drži zapamćenim.

### B3 · a11y po WCAG **razini**, ne po axe **težini**
`tests/helpers/axe-gate.js` filtrira `['serious','critical']`. Pravilo `scrollable-region-focusable` nosi tagove `wcag2a` + `wcag211` — dakle **razina A** — ali težinu `moderate` *(⚠️ oboreno mjerenjem u B3a: u zakucanom axeu je `serious` — v. ISHOD niže)*. Prag je izabran po *težini*, a WCAG sudi po *razini*: dvije ljestvice, i mi smo ih pobrkali. Zato `.lb-table-wrap` bez `tabindex` stoji u backlogu od 2026-08-14 uz zelenu branu.

- **B3a — samo mjerenje.** Filtar po tagovima, prebroji, **ništa ne popravljaj.** Opseg nije poznat unaprijed i to se ne skriva.
- **B3b — prebacivanje brane** + osnovica koja nalaze **imenuje**.
- **B3c — spuštanje jeftinih.** `.lb-table-wrap` → `tabindex="0"` + `role="region"` + `aria-label`, i ostali koji ne traže odluku o izgledu.

#### B3a — ISHOD MJERENJA (2026-08-31) · ✅ izmjereno, ništa nije popravljano

**Metoda:** `wcagRazina()` u `tests/helpers/axe-gate.js` (razina iz axe tagova; 10 obrnutih
provjera u `tests/unit/wcag-razina.test.js`, uklj. sufiks-zamku `wcag2aa` ≠ A) + mjerni ispis
pod `A11Y_WCAG_MJERENJE=1` kroz POSTOJEĆE a11y specove + ad-hoc sken 4 predmeta na 375 px.

**① Na 46 skeniranih površina (obje brane, sve teme): NULA WCAG prekršaja.** Svih 265 nodeova
je `best-practice` (`region` 232 · `heading-order` 28 · `page-has-heading-one` 5). **Zamjena
ljestvice (težina → razina) na današnjim površinama ne mijenja ništa** — gate-skup je prazan
na obje ljestvice.

**② Rupa NIJE (primarno) ljestvica nego IZBOR POVRŠINA.** `scrollable-region-focusable` se
okida na `macroeconomics` i `entrepreneurship` learn @ 375 px: **9 nodeova, `impact=serious`,
`wcag2a` (razina A)** — a te površine axe uopće ne skenira (STUDY pokriva samo `marketing`).
`serious` bi i POSTOJEĆI gate uhvatio, da ondje gleda. Premisa B3 („težina `moderate`") je
**oborena mjerenjem** — u zakucanom axeu je `serious`; peti krivi broj u prozi ove faze,
i opet nula u kodu.

**③ Prekršitelji nisu tablice nego `.katex-display`** — KaTeX display-formule skrolaju
vodoravno bez `tabindex`. Tablice na 375 px svugdje STANU (`scrollW == clientW`, izmjereno
na marketing/te2/macro/entrepreneurship — 0 preljeva od 9 wrapova), pa je `.lb-table-wrap`
iz backloga (2026-08-14) danas LATENTAN, ne aktivan: `tabindex=null` potvrđen, okinuo bi tek
sa širom tablicom. ⚠️ I backlog je napola kriv: javni a11y spec od faze TELEFON vrti na
**375 px** (skip na svim drugim profilima), ne na 1280 — tvrdnja „mjeri na 1280" vrijedi
samo za authed projekt.

**Posljedica za B3b (dizajn se mijenja):** uz ljestvicu po razini + imenovanu osnovicu,
sken MORA dobiti kvantitativni predmet (macro) u popis površina — inače zamjena ljestvice
zaključava prazan skup. **Za B3c:** jeftini popravci su `.katex-display` (tabindex + role +
label u `renderMath()`/CSS-u — jedan mehanizam za svih 9) i `.lb-table-wrap` (isti recept,
latentni slučaj).

#### B3b — ISHOD (2026-08-31) · ✅ brana sudi po razini, osnovica imenuje, macro u površinama

**Presuda je UNIJA, ne zamjena:** nalaz ulazi u gate ako je WCAG razina **A ili AA** *ili*
axe težina serious/critical — sama zamjena ljestvice izbacila bi serious best-practice
nalaze, tj. **oslabila** branu. AAA se ne gatea (cilj je AA); uđe samo po težini.
**Osnovica `tests/a11y-baseline.json`:** ključ `POVRŠINA::rule-id` + razlog; tolerancija se
NE proteže na isti rule druge površine; riješeni upisi se ispisuju glasno; nedostajuća
datoteka RUŠI. **Piše se rukom** — Playwright vrti paralelne workere pa bi auto-update bio
utrka zapisā, a upis ionako traži razlog. **Macro je ušao u branu** (`STUDY-KVANT/*`, svih
5 sekcija, uz čekanje da KaTeX POSTOJI prije mjerenja). Dokazano obostrano: bez upisa u
osnovici test pada s **istih 9 nodeova** koje je B3a izmjerio (razina A, `.katex-display`);
s imenovanim upisom prolazi uz glasan TOLERIRANO. Ostalih 6 javnih testova zeleno pod novom
ljestvicom — potvrda B3a tvrdnje ①. 13 obrnutih provjera: `tests/unit/a11y-gate.test.js`.

#### B3c — ISHOD (2026-08-31) · ✅ jeftini popravci spušteni; osnovica opet PRAZNA

**Jedan mehanizam za sve formule:** `renderMath()` (js/math.js) nakon KaTeX-a svakom
`.katex-display` daje `tabindex="0"` + `role` + `aria-label` (i18n: `a11y.formula`) — jedno
mjesto kroz koje svaka formula prolazi, pa i svaki budući put renderiranja dobiva popravak
besplatno. **Isti recept za `.lb-table-wrap`** na oba mjesta (v2 `renderTable` + v1
`wrapLegacyTables`), i18n `a11y.table` — latentni slučaj iz backloga zatvoren istom rukom.
**⚠️ `role="group"`, ne `region` iz backloga — presudilo je mjerenje:** region je landmark,
pa je više formula s istim imenom odmah okinulo axeov `landmark-unique` (izmjereno prije
prebacivanja); group daje ime bez landmark-šuma. Rezultat: `scrollable-region-focusable`
**9 → 0** na STUDY-KVANT, svih 7 javnih a11y testova zeleno s **praznom** osnovicom
(riješeni upis je prvo GLASNO javljen, pa uklonjen — puni ciklus čegrtaljke dokazan uživo).

### B4 · `check:cascade`
BUG-039 i BUG-037 su **četiri pojave istog mehanizma**: kasnija datoteka gasi raniju, pa pravilo napisano za 1536 px ili za landscape nikad ne dođe na ekran. Leonova presuda *„nije toliki problem"* stoji.

Zato ovdje **ne odlučujemo širine.** Brana mehanički nalazi selektore koji se pojavljuju u više `responsive/*` datoteka s preklapajućim uvjetima i prijavljuje **tko koga gasi**. Bug time prelazi iz *„postoji negdje"* u **izmjeren popis**, a odluka o izgledu ostaje C7 — samo s punim podacima.

#### B4 — ISHOD (2026-08-31) · ✅ gašenje je IZMJEREN POPIS: 23 zatečena, imenovana

**`scripts/check-cascade.js`** (u preflightu): parsira `responsive/*` (redoslijed čita iz
**manifesta `css/app.css`**, ne abecedno), modelira medijske uvjete (širina/visina kao
intervali; orijentacija/hover/pointer… diskretno; zarez = OR preko kartezijevog produkta)
i prijavljuje parove **isti selektor + isto svojstvo + različita vrijednost + preklopljeni
uvjeti** — kasnija datoteka gasi raniju. Raniji `!important` i ista vrijednost se NE
prijavljuju (tamo kasnija ne pobjeđuje / nema posljedice). **Izmjereno: 6 datoteka ·
165 pravila · 321 deklaracija · 57 kandidat-parova → 23 gašenja**, sva imenovana u
`scripts/cascade-baseline.json` — među njima točno oblici iz BUG-039 (`.categories` s
ISTIM pragovima 01 vs 06; `.hero h1` ljestva iz `01` pod `02 @max-767`) i BUG-037
(landscape-pravila pod kasnijim upitom bez orijentacije). **Odluka o izgledu ostaje C7**
— brana pada samo na NOVOM gašenju. Granice mjere u zaglavlju skripte (doseg SAMO
`responsive/*`: gašenje komponentnih datoteka postoji, ali je dijelom NAMJERNO —
`app.css` learn/editor svjesno stavlja POSLIJE responsivea). 13 obrnutih provjera:
`tests/unit/check-cascade-gate.test.js`.

### B5 · `check:i18n`
Zakucani engleski nije bila jedna traka nego **razred** (backlog, 2026-08-24). Brana: nijedan tekst vidljiv korisniku ne smije biti zakucan mimo `js/i18n.js`. Osnovica imenuje zatečeno.

#### B5 — ISHOD (2026-08-31) · ✅ razred je IZMJEREN: 421 nositelj u 23 datoteke

**`scripts/check-i18n.js`** (u preflightu) sudi trima presudama: ① HTML (korijenske
`*.html`, samo `<body>`) — tekstni čvor sa slovom bez `data-i18n` na vlasniku + atributi
`placeholder`/`aria-label`/`alt`/`title` bez `data-i18n-*` mehanizma; ② JS (`js/**` bez
`i18n.js` — on JE rječnik) — HTML-nosivi literali suđeni istom presudom (`${…}` se
neutralizira pa `t()` prirodno prolazi; konkatenirani ostatak taga sudi se kao ATRIBUTI)
+ poimence nabrojeni sinkovi (`.textContent=`, `showToast(`, `toast(`, `askConfirm(`,
`setAttribute('aria-label'…)`); ③ **ključ bez rječnika** — literalni ključ u
`t(`/`mt(`/`_adminT(` pozivu i svaki `data-i18n*` atribut mora POSTOJATI u DICT-u, jer
`t()` za nepoznat ključ vrati SAM KLJUČ na ekran. Presuda ③ je dodana kad je obrnuta
pat-provjera pokazala da bi bez nje brana PROMAŠILA VLASTITI POVOD: K5 fallbacke
(`mt('materials.newFolder', 'New folder')`) konkatenacija skriva od presuda ①②.
**Izmjereno: 6 html · 42 js · 6454 literala → 421 nositelj bez ključa u 23 datoteke**
(`scripts/i18n-baseline.json`, brojač po datoteci — obrazac `check:palette` po izričitom
zahtjevu backloga): 4 stranice s NULOM ključeva koje i18n ni ne učitavaju
(privacy 96 · terms 40 · faq 34 · contact 26) + K5 razred REPRODUCIRAN presudom ③
(31 `studio.*` + 2 `admin.*` poziva na nepostojeće ključeve — bez ručnog brojanja).
**Presuda prevoditi-ili-gasiti dvojezičnost donesena je 2026-09-01: PREVODI SE (ADR-033);
jezik sučelja nikad ne dira predmete. Sam prijevod nije dio MREŽE.** Granice mjere u zaglavlju skripte (`<head>` je
`check:seo`; `data/**` je jednojezično po ADR-012; dinamički ključevi i stringovi iz
varijabli nevidljivi statici). 20 obrnutih provjera u lažnom stablu
(`tests/unit/check-i18n-gate.test.js`) + crvena strana dokazana uživo na `editor.html`.

### B6 · CI shardanje
19.4 od 30 min, **533 testa u jednom procesu**. Podizanje granice bilo je jednokratno; ovdje odbrojavanje prestaje. Potez su `workers` ili shardovi, ne veći broj.

**✅ ISHOD (2026-09-01).** Playwright je izašao iz `build` joba u **matrix-job s 2 sharda**
(`--shard=i/2`); `workers: 1` unutar svakog sharda ostaje — determinizam zbog kojeg postoji
nije žrtvovan. `needs: build` čuva „fail fast prije preglednika", `fail-fast: false` da pad
jednog sharda ne guta dijagnostiku drugog; rast suite ubuduće apsorbira **novi shard**, nikad
veći timeout (build 15 min · shard 20 min). **Prvi run (= prvi CI run Node 24 ikad):** build
**0.4 min** · shardovi **11.2 / 10.0 min** · zid **11.8 min** umjesto 19.4 — izmjereno je da
je stari job bio 97 % Playwright: brze brane traju sekunde, a fail-fast sada znači presudu u
24 s. **Cigla je uzgred naplatila dva skrivena duga:** ① prvi push je pao na `npm ci` u 5 s —
`@emnapi` bomba iz Kvara 1 (`check-lockfile.js` zaglavlje) opet se sama naoružala
(`core`/`runtime@1.11.3` ispod Tailwindovih `bundleDependencies`); ② `check:lockfile` je to
morao uhvatiti, a nije, jer je preskakao drugi npm kad se **majori** poklapaju — runner nosi
najnoviji **minor** (11.19 vs lokalnih 11.6), a razrješivači se razlikuju već tu. Od sada se
`npx npm@<major>` vrti **uvijek** (Kvar 3, dokumentiran u zaglavlju skripte); crvena strana
dokazana lokalno prije popravka locka.

---

## 5 · BLOK C — Boja, jednom i do kraja

**Redoslijed je ovdje presudan: boja se popravlja PRIJE migracije, ne unutar nje.** Migrirati
pravilo koje se ionako mijenja je posao dvaput. Boja se **ne seli** u kaskadi, samo mijenja
vrijednost, pa pravilo ④ iz [FRONTEND_REDIZAJN.md](./FRONTEND_REDIZAJN.md) §10.3 ovdje ne vrijedi.

⚠️ **Dokaz NIJE `css:diff = 0`** — razlika je namjerna. Prvi put u cijeloj priči da nulta razlika
nije izlazni uvjet, i to se mora reći naglas da mjerač ne bude trinaesti kvar.
Dokaz je `check:contrast` (358 provjera kroz sve teme) + `check:contrast:live` (4 teme × 13 ruta)
+ `palette:breakdown`.

| cigla | opseg | cilj |
|---|---|---|
| **C1** | **fatalno 10 → 0** po ADR-032: puna ispuna ostaje, prilagođava se **tinta** (`--color-on-ok` / `--color-on-danger` po temi, `inkForTint()` za kartice) | nevidljivog teksta nema ni u jednoj temi |
| **C2** | **EDITOR ① — boja kartice = CIJELA kartica, ne samo rub** (backlog, Leon 2026-08-24) | tri moda troše `--item-acc` različito; ovdje se poravnavaju |
| **C3** | **blago 21 → 0** — rgba bijela/crna plohe i rubovi | plohe dolaze iz tokena |
| **C4** | **stara 46 → 0** — indigo/slate ostaci | osnovica `check:palette` **93 → 0** |

**✅ C1 ISHOD (2026-09-01).** Fatalno **10 → 0**, točno mehanizmom iz ADR-032: novi tokeni
`--color-on-ok`/`--color-on-danger` po temi (bijelo u `academic`/`paper`, `#14161a` u
`chalk`/`mint` — isti raspored kao `--color-on-brand`) + legacy aliasi `--on-success`/`--on-danger`
u `variables.css`. Sedam pravila iz ADR-032 klase palo je zamjenom `white`→token; **tri izvan
ADR-032 dobila su odluku s mjerom**, kako je ova sekcija tražila: `category-btn.active small` →
`inherit` (5.65–9.87) · `action-btn.tertiary` → gradijent iz ok-tokena umjesto zakucanog `#059669`
+ `--on-success` (najgori kraj 5.45) · `learn-card-header span` → **puna ispuna `--primary-dark`**
umjesto rgba-pilla, jer bi zadržani poluprozirni pill pao u `paper` na **4.22** (ovako 6.02–9.50).
Usput: `--danger-bg`/`--danger-text` kao pozadine u `profile.css` (var s fallbackom bez definicije
= zakucana vrijednost s ukrasom) zamijenjeni pravom `--danger` ispunom → osnovica `check:tokens`
**3 → 2** imenovane iznimke. Dokaz po specu: `check:contrast` 358 provjera ✅ ·
`check:contrast:live` 0 elemenata ispod praga na 13 ruta × 4 teme ✅ · osnovica `check:palette`
**93 → 77** (usput blago 21 → 20 — pill više nije rgba ploha).

**✅ C2 ISHOD (2026-09-01).** Tri moda više ne troše `--item-acc` različito: kartice (bio SAMO
prsten), kviz i dopune (bio rub + 10 %) sad svi crtaju **PUNU ispunu** (ADR-032 ④), a tintu bira
`SokratBlocks.applyAccent` → `data-ink` → `--color-on-tint-dark/-light` — isti alat kao pločice
predmeta. **`inkForTint` je pritom PRESELJEN** iz `js/navigation.js` u `js/blocks-renderer.js`
(SokratBlocks.inkForTint): od C2 tintu troše i study-modovi i editorov pretpregled, a editor.html
navigation.js ne učitava — navigation drži samo prečac; `check:contrast` prag sada čita iz novog
doma. Bez boje `data-ink` atributa NEMA pa vrijedi zatečeni izgled (fallback-ugovor M3b netaknut).
Sitni rub presuđen svjesno: `currentColor` na prazninama dopuna specifičnošću gazi `is-ok`/`is-bad`
pa je semantika odgovora ponovno izrečena. Novi rub = novi test (ADR-027): `data-ink` u
`blocks-renderer.test.js` (postavljanje, curenje, luminancija). Dokaz: `check:contrast:live`
0 ispod praga, uz **14 mjerenja manje preskočeno** — lica kartica više nisu gradijent, pa ih brana
sad STVARNO mjeri, ne preskače.

**✅ C3 ISHOD (2026-09-01).** Blago **20 → 0**: zakucane bijele/crne plohe, rubovi i sjene su
nestali iz `css/**`. Mehanizam: novi token **`--color-shadow`** — OPAKNA baza sjene/scrima po temi
(academic/paper tamna tinta teme, chalk čista crna, mint `#030c0d`), a prozirnost se izriče **na
mjestu upotrebe** kroz `color-mix`, jer alfe legitimno variraju 0.08–0.62 pa bi jedan zajednički
token ili utopio kartice ili istanjio scrim. Ostale kategorije: „bijelo staklo" auth/confirm/profila
(pisano za staru TAMNU zadanu temu — na svijetlima nevidljivo) → plohe teme (`--bg-tertiary` +
`--border`); chipovi na obojenim ispunama → `color-mix(currentColor N%)` jer od C2 tinta podloge
više nije nužno bijela; lightbox (namjerno fiksno taman) → `--color-on-tint-light` miksovi.
Usput ažuriran zastarjeli komentar u `tokens.css` („jedini broj koji blokira svijetle teme je
FATALNO" — fatalno je na nuli od C1). Osnovica `check:palette` spuštena **77 → 53**. Dokazi:
`palette:breakdown` FATALNO 0 · blago 0 · stara 36 · `check:contrast` 358 ✅ · `check:contrast:live`
0 ispod praga ✅ · preflight EXIT=0 · suite 535/0.

**✅ MEĐUNALAZ IZMEĐU C3 I C4 (2026-09-01) — suite je uhvatio pravu rupu iz C2.** Axe je na
STUDY/fill izmjerio 4.27 na violet-500 ispuni (`#8b5cf6`): na toj boji NI bijela (4.23) NI
`#14161a` (4.28) ne dosežu AA — par tinti je na svom sjecištu davao samo 4.26, ispod praga, i
prošao je dotad samo zato što fill rotira stavke. Sistemski popravak, ne symptomski:
**`--color-on-tint-dark` je otišao na ČISTU CRNU** (`#000`), čime sjecište (izvedeno, ne pogođeno:
√(0.05·1.05)−0.05) pada na **0.1791** i najgori slučaj postaje **4.58 ≥ 4.5 po konstrukciji**;
`TINT_INK_CROSSOVER` ažuriran, `check:contrast` ih drži usklađenima (pao bi da nisu). Drugi dio
istog razreda: `.flip-hint` s `opacity: 0.8` — na obojenoj ispuni prozirnost je porez na kontrast
koji tinta ne može platiti (crna kroz 0.8 na indigu = 4.01), pa na `[data-ink]` karticama hint ide
na punu tintu; legacy kartice zadržavaju prigušeni.

**✅ C4 ISHOD (2026-09-01).** Stara paleta **→ 0 po `check:palette`** — osnovica **53 → 0** (od
uvođenja gatea: 93 → 0), `palette:breakdown` sad glasi **0 · 0 · 0**. Potezi: indigo-sjajevi i
ispune `rgba(99,102,241,α)` → `color-mix(in srgb, var(--primary) α%, transparent)` (efekt sad
prati ŽIVU marku teme, ne zamrznuti indigo); ukrasni fallbackovi `var(--primary, #6366f1)` /
`var(--primary-light, #818cf8)` skinuti (definicije postoje; `--accent` u learn-blocks dolazi
runtime pa fallback OSTAJE, ali kao `var(--primary)`); maske skrola u `learn.css` → `currentColor`
(maska čita samo ALFU — nijansa nije odluka teme); lightbox (namjerno fiksno taman) →
`--color-on-tint-light`/`--color-shadow`; conic-kotač u Studiju → `--color-ink-indigo`. Skidanje
fallbacka je razotkrilo i dva `--primary-light`-kao-TEKST (tvrda zabrana, ~3.2 na svijetloj) →
`var(--primary)`. Zadnji pogodak nije bio hex nego **rgba-oblik slate-400** u `.lb-table th` —
hex-grep ga ne vidi, brana (koja broji i rgb-oblike) jest: pouka da se ostatak broji NJEZINIM
mjerilom, ne vlastitim grepom. Dokaz cijelog bloka: `check:contrast` 358 ✅ · `check:contrast:live`
0 ispod praga (13 ruta × 4 teme) ✅ · `check:palette` **0/0** · preflight EXIT=0 · suite 535/0
nad završnim stablom.

**Zašto sve četiri, a ne samo fatalne.** Kad čegrtaljka padne na nulu, osnovica se zakuca ondje i
**C5b/2, C5b/3, C6 i C7 više nikad ne moraju misliti o boji** — jedna cijela dimenzija ispada iz
svake preostale cigle redizajna.

**Zašto je C2 ovdje.** Backlog kaže da EDITOR ① *„čeka C5a jer C5a prepisuje baš te tri datoteke"*.
C5a je gotova, a C-blok ionako prolazi kroz boju — isti argument, samo obrnut.

Tri fatalna pravila koja ADR-032 ne pokriva dobivaju odluku **u C1, s izmjerenim kontrastima** —
ne prije i ne na oko.

---

## 6 · BLOK D — Sigurnost na rubu

### D1 · Inline van
`gtag` blok → vanjska datoteka (ionako pripada domeni `js/consent.js`) · `onload` atribut na
KaTeX-linku → učitavanje bez atributa. ⚠️ **GA ponašanje se mijenja SAMO u `js/consent.js`.**

**✅ D1 ISHOD (2026-09-01).** Svih 6 `*.html` na **nula inline `<script>` i nula `on*`
atributa** — opseg je bio veći od opisa cigle (uz gtag-blok i KaTeX `onload` još **25 `onclick`**
i inline body-skripta iz K1). Potezi: consent-default push → vrh `js/consent.js` (njegova domena;
redoslijed očuvan jer gtag.js učitava isključivo ta datoteka) · pathbar-odluka + KaTeX
`media`-swap → novi **`js/boot.js`**, jedina sinkrona skripta (blokira parser = isto jamstvo
„prije prvog crtanja" koje je davao inline blok) · `onclick` → `data-action` sa **zatvorenom
bijelom listom** u `navigation.js` (delegat NIJE generički most do `window[ime]` — inače bi
ubačeni atribut u sadržaju postao poziv proizvoljne globalne funkcije, ista klasa rupe kao
BUG-025) · cookie-linkovi → `data-consent-settings` u `consent.js` (pravne stranice učitavaju
samo njega) · `toggleUiLang` → `i18n.js`, jer **editor.html NEMA `navigation.js`** — grep koji
je tvrdio suprotno pogodio je KOMENTAR koji baš to objašnjava; da je gumb vezan na oba mjesta,
klik na indexu bi togglao dvaput = neto ništa. Uhvaćeno klikom u pravom pregledniku, ne mjerom
teksta. Dokazi: svih 15 `data-action` imena razrješava u funkciju + 5 map-gumba nosi `data-arg`
(provjereno na živoj stranici) · klik-dokaz za sva tri delegata · duboka ruta skida `no-pathbar`
prije crtanja, `#/` ga zadržava · KaTeX `media` završi na `all` · preflight EXIT=0 · ciljani
Playwright 66/0.

### D2 · `Content-Security-Policy-Report-Only`
Na preview-deployu, pa **proći sve rute** — poimence editor i Studio, najveći kandidat za
iznenađenje. Report se čita, ne pretpostavlja.

**✅ D2 ISHOD (2026-09-01).** Report-Only header na preview-deployu (20828ec), pa šetnja SVIM
rutama pravim preglednikom uz čitanje konzole (report-only svaku povredu ispiše): landing ·
katalog · math svih 6 tabova (**203 KaTeX formule** = cdnjs skripte+css+fontovi pod policyjem) ·
geography exercises/blind-map/learn · privacy · **editor.html** · materials · about · **Accept
privole** (pali gtag.js + Sentry loader — oba prošla) · Supabase REST read (DB read-path). Nalaz:
**nula povreda iz naše aplikacije.** Sve prijavljene povrede su PREVIEW-infrastruktura koje na
produkciji nema: vercel.live feedback-toolbar i SSO-redirect manifesta (zaštita previewa).
Svjesno nevježbano i zašto je u redu: youtube-nocookie iframe (katalog trenutno nema video-blok
dostupan anonimno; host je na listi) · MathLive lazy-load (admin-gated; jsdelivr host i fontovi
dokazani kroz supabase-js/KaTeX) · Sentry ingest beacon (nije bilo greške; wildcard host).

### D3 · Enforce + `check:csp`
Pravi `Content-Security-Policy` tek kad je report čist. Brana: **nijedan `<script>` bez `src`,
nijedan `on*` atribut u `*.html`**. Bez nje se prva iduća inline skripta tiho vrati i CSP počne
lomiti stranicu **korisniku**, ne nama.

⚠️ `vercel.json` **bez komentar-ključeva** (pravilo #7) i Vercel check se gleda odvojeno od Actions.

**Zašto CSP uopće.** Renderiramo sadržaj koji piše korisnik. Ako `SokratBlocks.esc` ikad popusti —
a **jednom već jest**, BUG-025, godinu dana neopaženo — ubačena `<script src="https://tuđe/">`
pročita JWT i piše u bazu kao taj korisnik. SRI kaže *„ova datoteka je točno ta"*; CSP kaže
*„nijedna druga se ne smije ni učitati"*. SRI ne vidi skript koji nikad nije bio u našem HTML-u.

**✅ D3 ISHOD (2026-09-01).** Header **Report-Only → enforce** (`ac741c2`), pa ista šetnja
preview-em pod BLOKIRAJUĆIM policyjem: math svih 5 modova (KaTeX 203 formule + fontovi s cdnjs),
GA + Sentry učitani nakon privole, Supabase REST read, editor.html, geography blind-map —
**nula `Refused` u konzoli, sve funkcionalno.** Brana `check:csp` na vratima (preflight) tvrdi
tri stvari i pada zatvoreno: 0 inline `<script>` · 0 `on*` atributa u tagovima · vercel.json
šalje ENFORCE header bez `'unsafe-inline'` u script-src (bez treće bi prve dvije čuvale header
koji je netko razvodnio). Iznimka SAMO `application/ld+json` — inertan podatkovni blok koji CSP
ne izvršava (D2 empirijski: landing ga nosi, report čist); komentari se skidaju prije mjerenja
(naš komentar je već jednom ušao u tuđe brojanje kao „37. skripta"); ispisuje dotaknuto
(6 datoteka, 1095 tagova). Obrnuto dokazana: pala na Report-Only stanju i na podmetnutim
inline/`on*` povredama. ⚠️ Nuspojava na PREVIEW-ima: enforce blokira vercel.live
feedback-toolbar (preview-only injekcija) — na produkciji ne postoji, svjesno prihvaćeno.

### D4 · Leaked password protection
~30 redaka u `js/auth.js`: HaveIBeenPwned `range` API, k-anonimnost (odlazi **pet** heks-znakova
SHA-1, lozinka nikad ne napusti preglednik), `crypto.subtle` je ugrađen. **0 €** umjesto ~300 €/god.

**Ovdje je jer se veže na D3:** dodaje `api.pwnedpasswords.com` na popis dopuštenih hostova.
Raditi CSP bez toga znači raditi CSP dvaput.

⚠️ Pošteno o dosegu: naša izvedba je **klijentska**, kao i `minlength` — zaustavlja korisnika koji
upiše `password123`, ne onoga tko zaobiđe formu (a taj šteti samo sebi). ~90 % vrijednosti, ne 100 %.

**✅ D4 ISHOD (2026-09-01).** `isPasswordPwned()` u `js/auth.js` (`f62ef4c`): SHA-1 kroz
`crypto.subtle`, odlazi **samo prvih 5 heks znakova** (range API, k-anonimnost), `Add-Padding`
izjednačava veličinu odgovora, usporedba lokalna — lozinka nikad ne napušta preglednik.
**FAIL-OPEN** namjerno: mrežna greška ne blokira registraciju (provjera je dodatak, ne vrata;
server-side dvojnik na Pro planu ostaje do seobe — poslije nje je ovo jedina). Pozvano na **sva
tri mjesta** gdje se lozinka postavlja: signup · recovery · promjena na profilu
(`window.checkPwnedPassword` + typeof-guard). Poruka = postojeći ključ `auth.st.weakPwned`
(HR prijevod već postojao). `api.pwnedpasswords.com` dodan u `connect-src` — razlog zašto D4
ide uz D3. Dokazi: `password123` → true, jak nasumičan → false (živi API) · UI: signup s
`password123` staje **prije** Supabase poziva (0 novih `/auth/v1/signup` zahtjeva) s prevedenom
porukom · ista provjera radi i na preview-u pod ENFORCE policyjem · preflight EXIT=0.

---

## 7 · BLOK E — Sadržaj i proizvod

Zadnji jer je drukčija vrsta posla. **Miješanje sanacije i nove značajke je razlog zašto se cigle
vraćaju** — to isto piše i zapis o ekranu napretka.

### E1 · EDITOR ② — dopune
⚠️ **MINA.** Backlog izričito kaže: razuman prijedlog koji bi, izveden doslovno *„jednom
podvlakom"*, **slomio postojeće gradivo**. Bio je označen 🟢 *„odabrano za sljedeći rad"*
2026-08-25, pa su došle C5a i C5b i nikad nije izveden.

**Cigla počinje analizom, ne kodom.** Prvo izmjeriti što bi se slomilo, pa tek onda predložiti put.

**✅ E1 ISHOD (2026-09-01) — analiza je pokazala da je mina RAZMINIRANA JOŠ 2026-08-25.**
Rečenica iznad („nikad nije izveden“) bila je kriva već kad je napisana: editorske cigle
`d6d437a` (D1: gumb „Ubaci prazninu“ — označena riječ → praznina+odgovor; normalizacija dira
SAMO 3+ podvlake jer su jedna i dvije LaTeX) i `48565ae` (D2: `answers` u shemi, polja U rečenici,
ocjena PO praznini) na ovoj su grani, backlog nosi ✅ anotacije od 2026-08-25 — spec ih pri
pisanju (2026-08-31) nije provjerio. Dokazi danas: `fill-blank-format.test.js` **20/0** ·
`fill-multi.spec.js` u default suiti · CI na `3a1f374` zelen. Nula novog koda — ishod cigle je
**verifikacija**, i pouka: cigla prepisana iz backloga u plan mora prepisati i njegov STATUS.

### E2 · M5b — zatezanje
25 jedinstvenih kartica preko 500 znakova (`entrepreneurship` 28 · `traffic` 6 · `food-nutrition` 4
· `sit` 4 · `ebusiness` 2 · `math` 2 · `te2` 2 — brojevi uključuju kopije u `final`) → detalj seli u
`learn` po kartica-standardu, **pa tek onda** `maxLength: 500` u `schema/subject-content.schema.json`.

⚠️ **Obrnut redoslijed = `validate:schema` crven = CI blokiran.** M5a (vođenje u editoru) je na
produkciji od 2026-08-08; ovo je druga polovica.

**✅ E2 ISHOD (2026-09-01).** Svih **25 jedinstvenih kartica** (48 s kopijama u `final`; mjeri
`validate:content`) skraćeno na ≤500 uz selidbu detalja — s pravilom: **prije svake selidbe
pročitati learn**. Većina detalja je VEĆ bila ondje (kartica je duplicirala learn), pa je posao
često bio brisanje duplikata; gdje learn detalj nije imao (lifestyle-poduzetništvo, tablica
poduzetnik–menadžer, D&I brojke, 3 oblika migrantskog poduzetništva, primjeri uz Stoneovih 7,
BFA definicija…), dopunjen je istim idiomom (example/tip/formula-box). Zatim `maxLength: 500` na
`question`+`answer` u shemi; **obrnuto dokazano ajv-om** (501 pada s točnom putanjom, 500 prolazi).
Broj 500 sada postoji na dva mjesta → novi unit u `card-limits.test.js` veže shemu na
`SokratCardLimits.HARD` (ADR-027: kopija smije postojati samo s testom koji je drži). Dokazi:
`validate:content` **0 preko stropa** · `validate:schema` 72/72 · `export:json` round-trip 72/72 ·
preflight EXIT 0 · phone-brana 10/10. ⚠️ **Uz deploy ide i re-sync baze** (`diff:db` pa
`migrate-content.js`) — read-path preferira bazu, pa bi PROD inače dalje služio duge kartice.

### E3 · Osam nemigriranih predmeta
`check:final` ih preskače, dakle **trećina kataloga nema jamstvo da je `final == M1⊕M2`**. Svjesno
po ADR-015, ali brojka je veća nego što zvuči. B2 ih imenuje; ovdje se odlučuje migriraju li se ili
se izuzeće trajno zaključava uz obrazloženje.

**✅ E3 ISHOD (2026-09-01) — jedan je bio KRIVO preskočen, sedam je zaključano s obrazloženjem.**
Analiza je oborila premisu za četvrtinu popisa: `business-informatics` (+hr) nije „ne-3-dijelni" —
brana je znala samo jednu od **dvije konvencije imena kolokvija** u katalogu
(`first-midterm`/`second-midterm`, 44 mjesta vs `midterm-1`/`midterm-2`, 25 mjesta) pa je davala
**uvjerljiv krivi razlog** — ista klasa kvara kao mjerač iz §10.3. Resolver sad razumije obje;
EN predmet je u bazi bio cijelo vrijeme i sada se **provjerava (16 → 17)**, čegrtaljka je pad na
promjeni razloga uredno odradila (`--update` uz zapis). **Preostalih 7 = svi HR, „nije u bazi" —
izuzeće TRAJNO ZAKLJUČANO** (obrazloženje u zaglavlju `check-final-drift.js`, ADR-027): file-final
je runtime `Object.assign` pa ne može driftati po konstrukciji · HR ide u Supabase tek s potpunim
HR programom (postojeća odluka) · izuzeće se samo zacjeljuje ulaskom u bazu. Migracija sada radi
brane = rep maše psom. Obrnuti testovi brane 6/6.

### E4 · Vježbe — frontend
Pet predmeta (`accounting` · `math` · `statistics` · `academic-writing` · `macroeconomics`) =
**petina kataloga**, a vježbe nemaju **nijedan vizualni gate** i nisu bile ni u jednoj cigli C0–C7.

**Cigla počinje odlukom o opsegu:** je li to prolaz kroz tokene i razmake, ili prepravak interakcije
(unos, provjera, koraci rješenja). ⚠️ **Granica se ne pomiče:** izgled se smije mijenjati,
`generate()` / `answer()` / `type` **ne** (BUG-012, ADR-018).

> **Nije u ovoj fazi:** prelazak vježbi na **recepte** (ADR-018 nasljednik) — to je izgradnja, ne
> sanacija, i po odluci se radi tek nakon cijelog frontenda.

**✅ E4 ISHOD (2026-09-01) — Leon odabrao MALI OPSEG; mjera dodana, nalaza NULA.** Mjerenja za
odluku: `exercises.css` je zdrav (470 redaka · 0 `!important` · 133 tokena · mobile `@media`),
paleta 0 (C4), `contrast:live` pokriva exercises rutu — ali **phone-brana vježbe nije mjerila**
(`NACINI` = 5 načina; exercises/blind-map su uvjetni tabovi kojih na prvom predmetu
`subjectDataMap` nema). Isporučeno: `NACINI_UVJETNI` u `phone-gate.js` + `idiNa('study@<feature>')`
— predmet se bira IZ KATALOGA po značajci, nikad zakucan; pokrivenost-tvrdnja raste 44 → **52
mjerenja** (4 širine × 13 ekrana). Rezultat: **svih 8 tvrdnji prolazi na oba taba, sve 4 širine,
uz PRAZNU osnovicu** — „čine se ok" je sada brojka. Prepravak interakcije ide u redizajn
(C5b/2+), gdje mu je mjesto (§10 anti-razlijevanje); `generate()`/`answer()`/`type` nedirnuti.

---

## 8 · NALAZI IZVANA — što prijatelji nađu

> **Ova sekcija je sada prazna i to je točno stanje.** Puni se kako nalazi stižu.

**Predložak — jedan nalaz, jedan blok:**

```
### N-001 · <kratak naslov>
- **Tko / kada:** ime · datum
- **Uređaj:** telefon/stolno · model · preglednik · širina ako se zna
- **Ruta:** što je bilo u adresnoj traci (`#/...`)
- **Što je napravio:** korak po korak
- **Što je očekivao / što se dogodilo:**
- **Snimka/slika:** da/ne
- **TRIAŽA (moja):** ⏳ neobrađeno | → cigla <X> | ➖ ne sada + razlog
```

**Pravila triaže:**
1. **Nijedan nalaz se ne briše.** Ni „to je namjerno", ni „ne mogu ponoviti" — oboje se **zapisuje** kao ishod.
2. **Ne mogu ponoviti ≠ nema ga.** Traži se uređaj i širina; ako i dalje ne ide, ostaje otvoren s tom oznakom.
3. **Nalaz koji ruši nešto što brana tvrdi da drži** ima prednost pred svime u ovoj fazi — to je trinaesta rupa u mreži i ide odmah u BLOK B.
4. **Ukus nije bug**, ali se ne odbacuje: ide u [BACKLOG.md](../records/BACKLOG.md) s imenom onoga tko je rekao.
5. Nalaz se zatvara **brojkom ili testom**, ne rečenicom *„sad je bolje"*.

---

## 9 · Izlazni uvjet faze

Faza pada kad **sve** stoji:

- [x] advisor performance **0 WARN** · security **15 → 11** — ✅ **A1, 2026-08-31, na produkciji**
- [ ] `check:node`, `check:tokens`, `check:cascade`, `check:i18n`, `check:csp` u preflightu, **svaka s obrnutom provjerom** — ✅ node (A2) · tokens (B1) · cascade (B4) · i18n (B5, 2026-08-31) · csp (D3, 2026-09-01)
- [x] a11y brana sudi po **WCAG razini**, osnovica imenovana — ✅ **B3b+B3c, 2026-08-31** (razina ∪ težina; macro u površinama; 9× `.katex-display` popravljeno; osnovica prazna)
- [x] `check:final` **imenuje** preskočene — ✅ **B2, 2026-08-31** (osnovica: 8 imenovanih; E3 spustio na 7 — jedan je bio krivo klasificiran i sad se provjerava)
- [x] `palette:breakdown` **fatalno 0** · `check:palette` osnovica **0** — ✅ **C4, 2026-09-01** (osnovica 93 → 0; breakdown 0·0·0; kućica označena u E-prolazu — C4 ju je ispunio a nije označio)
- [ ] CSP **enforce** na produkciji uz čist report
- [x] leaked-password provjera živa (D4, 2026-09-01)
- [x] E1–E4 riješeni ili **obrazloženo odgođeni** — ✅ E1 (verifikacijom) · ✅ E2 · ✅ E3 (16→17; 7 zaključano) · ✅ E4 (mali opseg po Leonovoj odluci: telefon-mjera 44→52, nalaza 0; interakcija → redizajn) — **sve 2026-09-01**
- [ ] svi nalazi iz §8 triažirani
- [ ] `npm run preflight` **EXIT 0**

Tek tada [FRONTEND_REDIZAJN.md](./FRONTEND_REDIZAJN.md) prestaje biti pauziran i nastavlja se od **C5b/2**.

---

## 10 · Što svjesno NIJE u ovoj fazi

Da se opseg ne razlije — a razlijevanje je ovdje najveći rizik:

| stavka | gdje pripada |
|---|---|
| **6962 redaka CSS-a** | C5b/2 · C5b/3 · C6 · C7 — to je **faza, ne kvar**. MREŽA ju smanjuje (B1 briše 11 fallbackova, BLOK C briše pravila usput) |
| **BUG-039 / BUG-037 — širine i landscape** | C7. MREŽA čini mehanizam **vidljivim** (B4), odluku ne donosi |
| **Grafikoni na ekranu napretka** | odobren smjer, ali **ne unutar sanacijske cigle** |
| **Katalog nevidljiv tražilici** (hash-rute) | traži prelazak na prave URL-ove — dira SW i navigaciju. **Odluka, ne popravak**; ne planira se ovdje |
| **Birač tema** | ➖ backlog |
| **MCP** (ADR-030/031) · **recepti za vježbe** | izgradnja, tek nakon frontenda |
| **A1 Google-prijava + A0 dijalog** | tek **nakon seobe** (mijenja redirect URI) |

---

## 11 · Rokovi koji ne čekaju plan

⚠️ **Supabase Pro istječe ~kraj rujna 2026, a seoba je odgođena na ~kraj rujna 2026.** To je isti
tjedan. Istekne li Pro prije seobe: vraća se free-tier spavanje (~7 dana neaktivnosti), a serverska
minimalna duljina lozinke i Supabaseova leaked-password zaštita padaju.

**D4 to djelomično amortizira** (klijentska provjera radi bez obzira na plan), ali ne u cijelosti.
**Odluka je Leonova i traži se prije nego rujan istekne**, ne poslije.
