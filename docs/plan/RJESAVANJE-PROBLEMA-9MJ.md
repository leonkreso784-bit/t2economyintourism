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
| CI, job „Lint + verify + tests" | **19.4 min / 30** (533 testa, 58 spec datoteka) | GitHub Actions |
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

### B5 · `check:i18n`
Zakucani engleski nije bila jedna traka nego **razred** (backlog, 2026-08-24). Brana: nijedan tekst vidljiv korisniku ne smije biti zakucan mimo `js/i18n.js`. Osnovica imenuje zatečeno.

### B6 · CI shardanje
19.4 od 30 min, **533 testa u jednom procesu**. Podizanje granice bilo je jednokratno; ovdje odbrojavanje prestaje. Potez su `workers` ili shardovi, ne veći broj.

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

### D2 · `Content-Security-Policy-Report-Only`
Na preview-deployu, pa **proći sve rute** — poimence editor i Studio, najveći kandidat za
iznenađenje. Report se čita, ne pretpostavlja.

### D3 · Enforce + `check:csp`
Pravi `Content-Security-Policy` tek kad je report čist. Brana: **nijedan `<script>` bez `src`,
nijedan `on*` atribut u `*.html`**. Bez nje se prva iduća inline skripta tiho vrati i CSP počne
lomiti stranicu **korisniku**, ne nama.

⚠️ `vercel.json` **bez komentar-ključeva** (pravilo #7) i Vercel check se gleda odvojeno od Actions.

**Zašto CSP uopće.** Renderiramo sadržaj koji piše korisnik. Ako `SokratBlocks.esc` ikad popusti —
a **jednom već jest**, BUG-025, godinu dana neopaženo — ubačena `<script src="https://tuđe/">`
pročita JWT i piše u bazu kao taj korisnik. SRI kaže *„ova datoteka je točno ta"*; CSP kaže
*„nijedna druga se ne smije ni učitati"*. SRI ne vidi skript koji nikad nije bio u našem HTML-u.

### D4 · Leaked password protection
~30 redaka u `js/auth.js`: HaveIBeenPwned `range` API, k-anonimnost (odlazi **pet** heks-znakova
SHA-1, lozinka nikad ne napusti preglednik), `crypto.subtle` je ugrađen. **0 €** umjesto ~300 €/god.

**Ovdje je jer se veže na D3:** dodaje `api.pwnedpasswords.com` na popis dopuštenih hostova.
Raditi CSP bez toga znači raditi CSP dvaput.

⚠️ Pošteno o dosegu: naša izvedba je **klijentska**, kao i `minlength` — zaustavlja korisnika koji
upiše `password123`, ne onoga tko zaobiđe formu (a taj šteti samo sebi). ~90 % vrijednosti, ne 100 %.

---

## 7 · BLOK E — Sadržaj i proizvod

Zadnji jer je drukčija vrsta posla. **Miješanje sanacije i nove značajke je razlog zašto se cigle
vraćaju** — to isto piše i zapis o ekranu napretka.

### E1 · EDITOR ② — dopune
⚠️ **MINA.** Backlog izričito kaže: razuman prijedlog koji bi, izveden doslovno *„jednom
podvlakom"*, **slomio postojeće gradivo**. Bio je označen 🟢 *„odabrano za sljedeći rad"*
2026-08-25, pa su došle C5a i C5b i nikad nije izveden.

**Cigla počinje analizom, ne kodom.** Prvo izmjeriti što bi se slomilo, pa tek onda predložiti put.

### E2 · M5b — zatezanje
25 jedinstvenih kartica preko 500 znakova (`entrepreneurship` 28 · `traffic` 6 · `food-nutrition` 4
· `sit` 4 · `ebusiness` 2 · `math` 2 · `te2` 2 — brojevi uključuju kopije u `final`) → detalj seli u
`learn` po kartica-standardu, **pa tek onda** `maxLength: 500` u `schema/subject-content.schema.json`.

⚠️ **Obrnut redoslijed = `validate:schema` crven = CI blokiran.** M5a (vođenje u editoru) je na
produkciji od 2026-08-08; ovo je druga polovica.

### E3 · Osam nemigriranih predmeta
`check:final` ih preskače, dakle **trećina kataloga nema jamstvo da je `final == M1⊕M2`**. Svjesno
po ADR-015, ali brojka je veća nego što zvuči. B2 ih imenuje; ovdje se odlučuje migriraju li se ili
se izuzeće trajno zaključava uz obrazloženje.

### E4 · Vježbe — frontend
Pet predmeta (`accounting` · `math` · `statistics` · `academic-writing` · `macroeconomics`) =
**petina kataloga**, a vježbe nemaju **nijedan vizualni gate** i nisu bile ni u jednoj cigli C0–C7.

**Cigla počinje odlukom o opsegu:** je li to prolaz kroz tokene i razmake, ili prepravak interakcije
(unos, provjera, koraci rješenja). ⚠️ **Granica se ne pomiče:** izgled se smije mijenjati,
`generate()` / `answer()` / `type` **ne** (BUG-012, ADR-018).

> **Nije u ovoj fazi:** prelazak vježbi na **recepte** (ADR-018 nasljednik) — to je izgradnja, ne
> sanacija, i po odluci se radi tek nakon cijelog frontenda.

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
- [ ] `check:node`, `check:tokens`, `check:cascade`, `check:i18n`, `check:csp` u preflightu, **svaka s obrnutom provjerom**
- [x] a11y brana sudi po **WCAG razini**, osnovica imenovana — ✅ **B3b+B3c, 2026-08-31** (razina ∪ težina; macro u površinama; 9× `.katex-display` popravljeno; osnovica prazna)
- [x] `check:final` **imenuje** preskočene — ✅ **B2, 2026-08-31** (osnovica: 8 imenovanih)
- [ ] `palette:breakdown` **fatalno 0** · `check:palette` osnovica **0**
- [ ] CSP **enforce** na produkciji uz čist report
- [ ] leaked-password provjera živa
- [ ] E1–E4 riješeni ili **obrazloženo odgođeni** (odgoda je ishod, prešućivanje nije)
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
