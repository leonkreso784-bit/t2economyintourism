> 🗄 **ARHIVIRANO** (2026-08-07) — PAUZIRAN — cigle 1–5c izvedene, ostatak stoji.
>
> **Referenca, ne izvor istine.** Što sada vrijedi → [docs/README.md](../README.md).

# HRV_PLAN — Program „Menadžment u Hotelijerstvu" (hrvatski prijevod)

> Plan za paralelni HRVATSKI program = prijevod SVIH predmeta 1.+2. god HM na hrvatski.
> Cigla po cigla. **Status (2026-06-28): cigle 1–5c ✅ LIVE** (`320d413..4b795c8`) — pilot Business Informatics HR +
> globalni 🌐 HR/EN toggle (study UI + landing + browse). ⬜ Preostaje: long-tail chrome (naš posao) → prijevod ostalih predmeta.
> **👥 2026-07-09 (ADR-023): cigle 6+ (prijevod svih predmeta) preuzeo je content-suradnik** — workflow/granice/definition-of-done: [TEAM.md](./TEAM.md) §4–5; statusna ploča: [subjects/README.md](../subjects/README.md) §HR.
> ⚰️ **Suradnja je OTKAZANA 2026-09-04 (Leon) → cigle 6+ su bez vlasnika.** Ovaj doc = tehnička referenca (konvencije, bijeli-popis, alat).
> Vezano: ADR-012 (`docs/records/DECISIONS.md`), `CLAUDE.md` §Stanje, `ROADMAP.md` §C, [[hrv-program]].

## Cilj
Student bira **jezik programa** na razini smjera: postojeći engleski „Hospitality Management"
ostaje netaknut; **uz njega** dolazi hrvatski „Menadžment u Hotelijerstvu" s istim predmetima,
istim engineom, ali hrvatskim sadržajem i hrvatskim UI-jem.

## Ključna arhitektonska odluka (ODLUČENO)
**Opcija A — KLON programa, NE i18n unutar sadržaja.** Razlozi:
- Sadržaj ostaje „glup" (jedan jezik po datoteci) → engine se NE mijenja (0 promjena rendera).
- Napredak odvojen po jeziku (vlastiti `storageKey`) → student može učiti i EN i HR neovisno.
- Migracijski sigurno (datoteke su izvor istine; Supabase re-sync kasnije kao i za EN).
- Lakša kontrola kvalitete prijevoda (diff EN↔HR po datoteci).

Odbačeno: i18n ključevi u sadržaju (svaki flashcard `{en, hr}`) — zagadilo bi schemu,
zakompliciralo engine i validatore, i otežalo buduće jezike.

## Konvencije imenovanja (OBAVEZNO)
| Stvar | EN (postojeće) | HR (novo) |
|---|---|---|
| Program (catalog) | `hospitality-management` | `hospitality-management-hr` |
| Program naziv | „Hospitality Management" | „Menadžment u Hotelijerstvu" |
| Subject `id` | `business-informatics` | `business-informatics-hr` |
| `storageKey` | `business-informatics-progress` | `business-informatics-hr-progress` |
| Mapa podataka | `data/business-informatics/` | `data/business-informatics-hr/` |
| Window var | `businessInformaticsM1` | `businessInformaticsHrM1` |
| Vježbe var | `…Exercises` | `…HrExercises` |

- **Subject `id` = EN id + `-hr`** (sufiks). `programId` = `hospitality-management-hr`.
- **`icon`, `color`, `iconGradient`, `features`, `year`, `semester` = IDENTIČNI** EN-u (samo jezik se mijenja).
- Lekcije: isti `id`-evi (`first-midterm`/`second-midterm`/`final` ili `midterm-1/2`), **`name`+`description` prevedeni**.
- `content.scripts`/`resolve`/`codeScripts`/`exercises` = isti raspored, ali HR putanje + HR var-imena.

## Što se PREVODI vs ČUVA (po schemi `docs/architecture/CONTENT_SCHEMA.md`)
**PREVODI (string-polja):**
- kategorija `name`
- `flashcards[]`: `question`, `answer`, `explanation`
- `quiz[]`: `question`, `options[]`, `explanation` (ako postoji)
- `fillBlanks[]`: `sentence`, `answer`, `hint`
- `learn.content` (HTML — prevodi se TEKST, ne tagovi)
- catalog: program `name`, subject je već novi, lesson `name`/`description`, subject `description`

**ČUVA (NIKAD ne dira prevoditelj):**
- ključevi kategorija (`systemApproach`, …) — to su programski ključevi, ne tekst
- `icon`, `color`
- **`quiz.correct`** (indeks točnog odgovora — redoslijed opcija MORA ostati isti!)
- **`_______`** token u fill (TOČNO 7 podvlaka — inače BUG-009)
- **HTML tagovi/entiteti** u `learn.content` (`<h3>`, `<ul>`, `&amp;`, …)
- **KaTeX delimiteri i formule** `\( \)` / `\[ \]` / `$$ $$` (matematika je jezično-neutralna; currency-safe pravilo ostaje)
- struktura objekta (broj flashcardova/quizova/fillova = isti)

## Alat: `scripts/translate-subject.js` (Cigla 2)
- **Sonnet preko `.env ANTHROPIC_API_KEY`** (korisnikov ključ; isti obrazac kao generator — `docs/workflow/CONTENT_GENERATOR.md`).
- **`tool_use` structured output** (kao generator) — model vraća JSON objekt s prevedenim string-poljima; sve ne-string ostaje.
- Ulaz: učita EN data-datoteku (vm-shim → uzme window var), **prevede SAMO bijele-popis string-polja**, sve ostalo kopira 1:1.
- Izlaz: `data/<subj>-hr/<file>.js` s preimenovanim const/var (`…Hr…`) i `Object.assign` u final.js (HR varovi).
- **Vježbe (kod) = POSEBNO:** prevode se samo string-polja vježbe (`prompt`, `title`, `choices` tekst, `explain`), a `generate()`/`params`/`answer`/`type`/`chapter` se NE diraju. (Math/Statistics/Accounting/Macro/AW imaju vježbe.)
- **Provjere u alatu (post-prijevod, prije zapisa):**
  - isti broj kategorija/flashcardova/quizova/fillova kao izvor,
  - svaki `quiz.correct` nepromijenjen + `options.length` isti,
  - svaki fill ima točno `_______` (7 podvlaka),
  - KaTeX balans `\(\)`/`\[\]`/`$$` jednak izvoru,
  - HTML tag-balans u learn jednak izvoru.
- **Cijena:** kao generator (~$1–1.5/predmet; prijevod je „lakši" zadatak, ali isti volumen tokena). Provjeriti kredite prije masovnog pokretanja. [[generator-api-cost]]

## UI i18n (Cigla — nakon pilota)
~50 stringova u sučelju (gumbi, nazivi sekcija „Flashcards/Quiz/Fill/Learn/Vježbe", „Provjeri", „Dalje",
landing, browse, profil). Pristup: jednostavan `js/i18n.js` rječnik (`{ en, hr }`) + `data-i18n` atributi ili
helper `t(key)`; jezik se bira iz aktivnog programa (HR program → hrvatski UI). Engine sadržaja ostaje neovisan o jeziku.

## Faze (cigla po cigla)
1. **✅ Cigla 1 — plan** (konvencije + schema bijeli-popis). Commit `9e203de`.
2. **✅ Cigla 2 — `translate-subject.js`** (slot-pristup; **salvage-parser** jer tool_use ČESTO vrati `translations`
   kao ručno-serijaliziran JSON-string s lošim escapeom → regex usidren na `{"i":N,"t":"…"}` granicu). Commit `46acff9`.
3. **✅ Cigla 3 — PILOT: Business Informatics** → `data/business-informatics-hr/` (M1+M2+final, **11 kat / 86 fc / 55 quiz /
   44 fill — strukturno identično EN-u**; 0 vježbi). Trošak ~$0.66. Commit `46acff9`.
4. **✅ Cigla 4 — catalog + UI-izolacija**: HR program + HR subject u catalog; **landing/sidebar/stats filtrirani na
   `PRIMARY_PROGRAM` (EN)** → HR ide kroz Browse, EN nepromijenjen. verify 0/0, Playwright 68/68 (subjects=18). Cache `20260695`.
   ⚠ Poznata privremena rupa (riješiti u Cigli 5): sidebar tijekom učenja HR predmeta i dalje pokazuje EN predmete
   (sidebar se gradi jednom na init); s 1 HR predmetom nevidljivo.
5. **✅ Cigla 5 — UI i18n** (`js/i18n.js`: `{en,hr}` rječnik + `t()` + `applyTranslations()` nad `[data-i18n]`/
   `[data-i18n-placeholder]`; jezik po aktivnom programu). **Cijeli study UI** preveden (nav tabovi, home, learn,
   flashcards, quiz+rezultati, fill+feedback, progress, exercises) — ~90 ključeva. Dinamičke poruke kroz `t()`
   (quiz „Pitanje X/Y" + rezultat, fill „Točno!/Netočno!", home podnaslov). **EN dict-vrijednosti = ORIGINALNI tekst
   → EN bajt-identičan.** Test `tests/i18n.spec.js`. Gate: verify 0/0, Playwright 72/72. Cache `20260695`.
   **5c — GLOBALNI toggle + šira pokrivenost:** ✅ globalni HR/EN prekidač (🌐 u nav-u, `localStorage 'sokrat-ui-lang'`,
   master nad programom; HR program samo „predloži" hrvatski prvi put). ✅ **landing chrome** (hero/sekcije/footer, brojevi
   očuvani pre/post podjelom). ✅ **browse drill-down** (naslovi/introi + kartice kroz `t()`/`getUiLang()`; hrvatski ordinali/
   množina „1. godina"/„Predmeti 1. godine"/„Semestar 1"/„3 lekcije"; `applyTranslations` re-renderira catalog-liste na toggle).
   ⚠ Preostaje (long-tail, niži promet): **profil** stranica + **pravne stranice** (privacy/terms/faq/contact = zasebni HTML) +
   lessons-header breadcrumb + blind-map (geografija-only → s geography-hr).
6. **Cigle 6+ — ostali tekstualni predmeti** (batch, isti alat).
7. **Kvantitativni predmeti** (KaTeX — alat čuva formule; provjeriti currency-safe + balans).
8. **Vježbe** (samo string-polja; engine nedirnut).
9. **Supabase re-sync** HR predmeta (read-path; vježbe iz datoteke — BUG-012 pravilo).

> **🆕 JSON dual-read (F2 2A, 2026-07-02):** `business-informatics-hr` ima `dataFormat:'json'` (kao ostalih 16
> migriranih) → nakon SVAKE (re)translacije koja mijenja `data/<subj>-hr/*.js` obavezno `npm run export:json
> <subj>-hr` (CI drift-gate). Novi HR predmeti iz Cigle 6: alat piše `.js` → rade odmah; flag+export opcionalno.

## Rizici / oprez
- **Engine se NE dira** (sveto, kao i dosad). HR je čisto podatkovni + catalog + tanak UI-i18n sloj.
- **Landing showcase + sidebar** trenutno iteriraju po SVIM predmetima → s dva programa pokazali bi EN+HR pomiješano.
  Riješiti u Cigli 4/5: filtrirati po aktivnom programu (browse drill-down to već radi preko `programsOf`/`subjectsOf`).
- **quiz.correct** je najopasnije mjesto — prijevod NE smije presložiti opcije. Alat to verificira (indeks + duljina).
- **Cache bump** + `CONTENT_VERSION` pri svakom HR data-unosu (kao i za EN).
- Trošak API-ja: ne pokretati masovno bez provjere kredita; `--topic`/`--subject` granularnost da se izbjegne re-run.
