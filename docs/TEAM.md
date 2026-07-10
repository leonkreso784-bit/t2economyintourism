# TEAM.md — tim, uloge, workflow i zaštita sustava

> **Status:** ▶ AKTIVNO (2026-07-09; Saša se pridružio 2026-07-08). **Svrha:** jedan dom za „tko što radi,
> kako, i što NIKAD ne dira" — da drugi par ruku UBRZA projekt, a da pritom bude **fizički nemoguće srušiti sustav**
> (granice + CI gateovi + PR review = trostruka brava; ne oslanjamo se na dobru volju nego na mehanizme).
> **Vezano:** [UGC.md](UGC.md) (platformska U-staza) · [HRV_PLAN.md](HRV_PLAN.md) (prijevodi) ·
> [subjects/README.md](subjects/README.md) (statusna ploča) · ADR-023 (ovaj model) · [content/](content/) (autorski alati).

## 1. Tim i uloge

| Tko | Uloga | Radi s | Ovlasti |
|---|---|---|---|
| **Leon Kreso** | vlasnik · product · platforma | svojim Claudeom | **JEDINI mergea u `main` i deploya**; admin GitHub/Supabase/Vercel/Anthropic |
| **Saša Vudrag** | content-suradnik (HR program + FMTU širenje) | svojim Claudeom | grane + PR-ovi; **NIKAD push na `main`**; bez pristupa infri |
| Claude (oba) | izvršitelj pod pravilima vlasnika sesije | — | Leonov Claude → CLAUDE.md; Sašin Claude → **§2 OVDJE (obavezno pročitati prije rada)** |

> **Osobni kontekst po stroju:** za vlastite bilješke/postavke svatko koristi **`CLAUDE.local.md`** (gitignored,
> Claude Code ga auto-učitava SAMO na tom stroju) — NE nove repo-datoteke (odluka: jedan CLAUDE.md + router, bez
> per-osoba fajlova u repou = bez duplih istina/drifta; ADR-023 t.1). Claudeova memorija je ionako per-stroj.

Kontekst o Saši: student programskog inženjerstva (Algebra), ima iskustva s gitom i Claudeom.
Njegovo područje: **sadržaj** — prijevod/izgradnja HR programa „Menadžment u Hotelijerstvu" (pune 2 godine kao EN),
zatim drugi smjerovi FMTU (MUT/MOR, nakon ADR-022). Platformski kod NIJE u opsegu (može doći kasnije, uz zasebnu odluku).

## 2. ⚠️ PRAVILA ZA SAŠU I NJEGOVOG CLAUDEA (tvrde granice)

> **Ako si Claude i `git config user.name` nije "Leon Kreso" → OVO su tvoja pravila. Pročitaj i [content/CONTENT_GUIDE.md](content/CONTENT_GUIDE.md) + [HRV_PLAN.md](HRV_PLAN.md) prije prvog rada.**

### SMIJEŠ (i samo ovo)
- **`data/<subject>-hr/`** — nove HR mape predmeta (midterm-1/2, final, kasnije exercises po §5 fazi S5).
- **`data/json/<subject>-hr/`** — SAMO kroz `npm run export:json <subject>-hr` (nikad ručno).
- **`data/catalog.js`** — SAMO dodavanje novog `-hr` subject-unosa (šablonu ispiše alat / daje se u S2); ništa postojeće se ne mijenja niti briše.
- **`docs/subjects/README.md`** — SAMO svoj redak u „HR statusna ploča" tablici.
- **Cache-bump datoteke** (`index.html`, `*.html`, `manifest.json`, `js/content-loader.js`, `sw.js`) — **ISKLJUČIVO kroz `npm run bump`**, NIKAD ručno (reviewer provjerava da je diff = samo tokeni).
- Pokretanje SVIH skripti/gateova (`translate-subject`, `validate:*`, `verify`, `export:json`, `bump`, `test:responsive`).

### NE SMIJEŠ (tvrdo; PR koji ovo dira se odbija bez rasprave)
- ❌ `js/**`, `css/**`, `sw.js` (osim SW_VERSION kroz bump), `index.html` struktura, `schema/**`, `scripts/**` (kod skripti), `tests/**`, `.github/**`, `vercel.json`, `package.json`, `supabase/**`
- ❌ **EN predmeti** (`data/<subj>/` bez `-hr`) i tuđi HR predmeti — ni slovo
- ❌ `docs/**` osim svog retka u subjects-ploči (PROGRESS/CHANGELOG piše Leon/njegov Claude pri mergeu — sprječava merge-konflikte)
- ❌ push na `main` · merge · deploy · Supabase (bilo što) · brisanje bilo čega postojećeg
- ❌ commit `.env`, ključeva, `_materials/` sadržaja (gitignored ostaje gitignored)

### ZAŠTO su granice ovakve (da ih se razumije, ne samo slijedi)
`main` = produkcija (push = deploy!). Engine (js/css) je „svet" — sadržaj ga NIKAD ne mijenja (dokazano pravilo).
CI gateovi automatski ruše PR koji krši konvencije — granice gore znače da tvoj PR **ne može** stići do stanja u kojem
može nešto slomiti. Sloboda unutar `data/<subj>-hr/` je potpuna — tamo si autor.

## 3. Workflow (obavezan put svake promjene)

```
grana content/<subject-id>-hr  →  rad (prijevod+verifikacija)  →  lokalni gateovi zeleni
→  PR na main (ispunjena checklista §5)  →  CI ZELEN (automatski)  →  review: Leon (ili njegov Claude)
→  MERGE radi SAMO Leon  (⚠️ merge u main = produkcijski deploy → Leon mergea kad je spreman deployati)
```

- **Grane:** `content/<subject-id>-hr` (jedan predmet = jedna grana = jedan PR). Male, pregledive jedinice.
- **CI na PR-u** (već postoji, `.github/workflows/ci.yml`): validate:content · validate:schema · verify · test:unit ·
  typecheck · export:json --check · bump:check · build:css --check · RLS · Playwright. **Crveno = nema mergea, bez iznimke.**
- **Branch protection na `main`** (Leon postavlja u GitHub Settings → Branches): require PR + require status checks;
  Leon kao admin ima bypass za svoj direktni workflow. → Sašin push na main postaje **tehnički nemoguć**, ne samo zabranjen.
- **Dnevnici (anti-konflikt pravilo):** Saša piše SAMO subjects-ploču + PR-opis (njegov radni log).
  PROGRESS/CHANGELOG unos dodaje Leon/Claude pri mergeu. Tako dva pisca nikad ne diraju iste retke.
- **Supabase re-sync** HR sadržaja (read-path) NIJE Sašin posao — radi ga Leon/Claude nakon mergea (traži ključeve).

## 4. Sašina staza (S-cigle; status vodi subjects-ploča)

| # | Cigla | Opis | Preduvjet |
|---|---|---|---|
| S1 | **Onboarding** | pročitati: ovaj doc → [content/CONTENT_GUIDE.md](content/CONTENT_GUIDE.md) → [content/CONTENT_SCHEMA.md](content/CONTENT_SCHEMA.md) → [HRV_PLAN.md](HRV_PLAN.md) → [subjects/README.md](subjects/README.md); lokalni setup (`npm ci`); pokrenuti SVE gateove na netaknutom repou (moraju biti zeleni — to je baseline) | GitHub invite + API ključ |
| S2 | **PILOT: 1 predmet end-to-end** | prijedlog: **Management** (srednji, tekstualan, bez vježbi); cijeli §5 tok kroz PR; svrha = naučiti put, kalibrirati review | S1 |
| S3 | **Batch tekstualni** (~11 predmeta) | ritam ~2–3/tjedan; jedan PR po predmetu | S2 mergean glatko |
| S4 | **Kvantitativni** (micro/macro/stat/math) | KaTeX — alat čuva formule, čovjek provjerava currency-safe/balans (alat to i verificira) | S3 iskustvo |
| S5 | **Vježbe** (accounting/statistics/macro/AW/math) | prevode se SAMO string-polja (`prompt/title/choices/explain`); `generate()/params/answer/type` NEDIRLJIVI | S4 |
| S6 | **examPractice obogaćivanje** | ispitna pitanja (Word→tekst) → nova pitanja u examPractice kategorije HR predmeta | usput od S3 |
| S7 | **MUT/MOR smjerovi** | placementi veznih predmeta + novi smjer-specifični | **ADR-022 implementiran (U2.5)** |

## 5. „Definition of done" za HR predmet (PR checklista — kopira se u svaki PR)

1. ⬜ Prijevod alatom: `node scripts/translate-subject.js …` (konvencije: id `-hr`, storageKey, `…Hr…` varovi — [HRV_PLAN.md](HRV_PLAN.md) §Konvencije)
2. ⬜ **HR MATERIJALI = AUTORITET:** prijevod uspoređen protiv HR skripti/predavanja/ispitnih pitanja tog kolegija; terminologija hotelijerstva ispravljena (prijevod je BAZA, materijali su ISTINA — pouka te2!)
3. ⬜ Ljudski pregled smisla (Saša, izvorni govornik) — alat čuva strukturu, čovjek čuva značenje
4. ⬜ catalog-unos dodan (`-hr` subject; `icon/color/year/semester` = identični EN-u)
5. ⬜ `npm run validate:content <id>-hr` = 0 · `npm run verify` = 0
6. ⬜ `npm run export:json <id>-hr` (ako subject ima `dataFormat:'json'`) · `npm run bump`
7. ⬜ `npm run test:responsive` zeleno lokalno
8. ⬜ PR: opis = što/izvori/posebnosti; subjects-ploča ažurirana; **diff sadrži SAMO dopuštene putanje (§2)**

## 6. Pristupi, ključevi, troškovi (least-privilege)

| Što | Saša dobiva? | Napomena |
|---|---|---|
| GitHub repo | ✅ collaborator Write (`chemp12`, 2026-07-10) | `main` ruleset `protect-main` čuva produkciju |
| Anthropic API ključ | ✅ **VLASTITI** (Saša sam kreira; Leon financira) | ključ se NE dijeli (sigurnije); cap/naplata = §9 (org-invite s spend-limitom ILI refundacija); njegov `.env` drži SAMO taj ključ |
| Supabase (dashboard/ključevi) | ❌ | re-sync radi Leon/Claude |
| `service_role` / TEST_ADMIN / Vercel | ❌ | nema potrebe = nema površine |
| Materijali (skripte/PDF/Word) | ✅ preko Drive-a (izvan repo-a) | `_materials/` ostaje gitignored |

Trošak prijevoda: ~$0.7–1.5/predmet → cijeli HR batch ≈ **$15–30** ukupno. Prije masovnog pokretanja provjeriti kredite ([[generator-api-cost]]).

## 7. Koordinacija s platformskom stazom (tko koga čeka: NITKO)

- **Saša radi v1-format datoteke ODMAH** — ništa ne čeka. Kad U2 (ID-jevi stavki) sleti, migracijska skripta obuhvaća
  i njegove predmete; alati (translate/generator) se bumpaju na v2 tada. Njegov rad se NE baca niti prerađuje.
- **ADR-022 pull-forward (U2.5, odmah iza U2):** preduvjet za S7 (MUT/MOR — vezni predmeti se DIJELE, ne kopiraju).
  Tri tvrda uvjeta: nakon U1+U2 (nikad isprepleteno) · aditivno/dual-mode · puni gate + staging. Detalji: ADR-023 + UGC.md §12.
- **Naše obveze prema Saši:** ⬜ docx→tekst skripta (Word ispitna pitanja; ~pola dana) · ⬜ ADR-022 na vrijeme (prije kraja S3/S4) ·
  review u ~24–48 h · šablona catalog-unosa u S2 · HR statusna ploča (postoji).
- **Očekivani sudar i rješenje:** obojica bumpaju tokene → bump-konflikt u PR-u = trivijalan (rebase + ponovni `npm run bump`).

## 8. Kontinuitet (tko piše što — protiv drifta)

| Zapis | Piše | Kada |
|---|---|---|
| subjects-ploča (HR status) | **Saša** (u PR-u) | svaki PR |
| PR-opis (radni log) | **Saša** | svaki PR |
| PROGRESS/CHANGELOG | **Leon/Claude** | pri mergeu |
| TEAM.md / planovi / ADR-ovi | **Leon/Claude** | po potrebi |
| CLAUDE.md | **Leon/Claude** | po potrebi (Saša nikad) |

## 9. Slotovi (stanje 2026-07-10)
- ✅ **Sašin GitHub:** `chemp12` — dodan kao **collaborator (Write)**; `main` zaštićen rulesetom **`protect-main`** (Active: require PR + 1 approval, restrict deletions, block force pushes; Leon = bypass admin). Status-checkovi se dodaju nakon prvog CI-runa (prava imena iz padajuće liste, ne ručno).
- ✅ **S2 pilot-predmet:** **Management (HR)** — potvrđeno (Sašin prvi end-to-end predmet).
- ✅ **Review-ritam:** PR odgovor u **24–48 h**.
- ⬜ **API ključ:** Saša kreira **VLASTITI** (sigurnije — ključ se NE dijeli). Leon financira; mehanizam = dogovor: **(A)** org-invite u Anthropic + workspace spend-limit (~$15/mj, tvrdi cap, naplata Leonu) **ILI (B)** Sašin zaseban račun + Leon refundira (~$15–30 ukupno). Sašin `.env` drži SAMO taj ključ, nikad se ne commita.
