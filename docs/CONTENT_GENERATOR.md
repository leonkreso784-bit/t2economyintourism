# Content Generator — pipeline za dodavanje predmeta uz minimalan Opus-usage

> Cilj: korisnik dodaje predmet uz **djelić** dosadašnjeg usagea. Težak posao (pisanje
> stotina kartica) seli s Opusa na jeftin skriptirani korak; **deterministički validatori**
> nose teret točnosti besplatno; Opus radi samo laki činjenični review-gate.
>
> Odluka (2026-06-22): **Generator PRVO, pa Blok B** (sadržaj→baza + `/api`). Izlaz generatora
> je catalog-kompatibilan (iste `data/<subj>/*.js` datoteke) → **migracijski siguran**: kasniji
> Blok B uvozi taj isti format u Supabase. Generator engine (korak 3) = **Anthropic API, korisnikov
> ključ, model Sonnet** (bolji draft → manje review-a). Vidi [[content-generator-pipeline]].

## Šav prema backendu
`js/content-loader.js` (`loadSubjectContent`) danas injektira `content.scripts`, sutra `fetch('/api/...')`.
Generator i Blok B gledaju u isti šav → ništa se ne radi dvaput.

## Cijevovod (sve u `scripts/`)

| # | Korak | Datoteka | Tko/čime | Status |
|---|-------|----------|----------|--------|
| 1 | Ekstrakcija teksta iz PDF-a | `pdf-text.js` | skripta | ✅ postoji |
| 2 | Materijali → `tmp/<subj>/topics.json` (tema + tekst + K1/K2 oznaka) | `build-topics.js` | skripta | ✅ **brick 2 (`a06b07e`)** |
| 3 | Po temi → kategorija (flashcards/quiz/fill/learn) po shemi | `generate-subject.js` | **Sonnet API (korisnikov ključ)** | ✅ **brick 3 (`cac9135`)** |
| 4 | Validacija sheme (hard-fail) | `validate-content.js` | skripta, 0 troška | ✅ **brick 1 (`0c3dc8e`)** |
| 5 | JSON → `data/<subj>/{midterm-1,2,final}.js` + catalog unos + cache bump | `assemble-subject.js` | skripta | ⏳ **brick 4 (sljedeće)** |
| 6 | Završni gate | `npm run verify` + Playwright + Opus činjenični spot-check | postoji + Opus | po predmetu |

## Brick 1 — `validate-content.js` ✅ (gotovo)
`npm run validate:content [subjectId]`. Učita data preko **vm window-shima** (radi za stare root
`data-*.js` SAMO-`window` i nove `data/<subj>/*.js` `window`+`module.exports`). Validira svaku kategoriju:
- `name`/`icon`(fa-)/`color`(#rrggbb) obavezni
- flashcard: `question`+`answer`; quiz: `options` 2–6 + valjan `correct` indeks; fillBlank: `_______` + `answer`
- `learn.content` neprazan HTML; `image` opcionalan (`null`/`''`/undefined = nema slike)
- **KaTeX currency-safe:** uravnoteženi `\(`/`\)`, `\[`/`\]`, paran `$$`. **⚠ Negative-lookbehind `(?<!\\)`**
  da `\\[2pt]` (LaTeX prijelom retka u `aligned`) NE broji kao display-delimiter `\[` (ulovljen bug pri izradi).

Pokrenut na svih 14 živih predmeta → **0/0** (4000+ stavki).

## Brick 2 — `build-topics.js` ✅ (`a06b07e`)
`node scripts/build-topics.js <subjectId> <materialsDir>`. Skenira PDF (pdf-parse) / TXT / MD, jedan fajl = jedna tema;
kolokvij iz imena podmape (`midterm-1|k1`→first-midterm, `midterm-2|k2`→second-midterm, `final/` preskočen). Izlaz
`tmp/<subj>/topics.json` = `{id,title,lesson,source,chars,text}`. `tmp/` gitignored (zaštićeni tekst).

## Brick 3 — `generate-subject.js` ✅ (`cac9135`)
`node scripts/generate-subject.js <subjectId> [--topic id] [--limit N] [--math] [--dry]`. Po temi zove Anthropic API
(model iz `.env GENERATOR_MODEL`, default `claude-sonnet-4-6`) sa strogim schema-promptom + few-shot. Model vraća SAMO
sadržaj; skripta dodaje `name`/`icon`/`color` (paleta po indeksu) i sprema `tmp/<subj>/draft.json`. Fence-tolerantni JSON
parse + 1 retry; `--dry` ispiše prompt bez poziva; `--math` ubaci KaTeX upute (currency-safe). Ugrađeni `.env` loader (bez
ovisnosti), native `fetch`. Test: 1 tema → 14fc/10quiz/10fill, 0 problema, ~$0.037.

## Sljedeće cigle
- **Brick 4** `assemble-subject.js` — `draft.json` → `data/<subj>/{midterm-1,2}.js` (`window.<var>`+`module.exports`) +
  final hibrid (`Object.assign`) + catalog unos + `CONTENT_VERSION` bump.
- **Gate:** `validate:content` → `verify` → Playwright → Opus spot-check.

## Pravila (kao i dosad)
- Cigla po cigla: jedna → test → commit lokalno → STANI za pregled → „nastavi".
- Validatori su zaštitari; generator NE smije zaobići `validate:content`.
- Pouka (te2/Entrepreneurship): generirani sadržaj VERIFICIRATI protiv predavanja (Opus spot-check).
