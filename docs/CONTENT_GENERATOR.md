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
| 2 | Tekst → `tmp/<subj>/topics.json` (tema + tekst + K1/K2 oznaka) | `build-topics.js` | skripta, polu-ručno mapiranje | ⏳ |
| 3 | Po temi → kategorija (flashcards/quiz/fill/learn) po shemi | `generate-subject.js` | **Sonnet API (korisnikov ključ)** | ⏳ |
| 4 | Validacija sheme (hard-fail) | `validate-content.js` | skripta, 0 troška | ✅ **brick 1 (gotovo, `0c3dc8e`)** |
| 5 | JSON → `data/<subj>/{midterm-1,2,final}.js` + catalog unos + cache bump | `assemble-subject.js` | skripta | ⏳ |
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

## Sljedeće cigle
- **Brick 2** `build-topics.js` — chunkanje ekstrahiranog teksta u `topics.json` (tema/tekst/kolokvij).
- **Brick 3** `generate-subject.js` — Sonnet API po temi, strogi schema-prompt + few-shot iz postojećeg dobrog
  predmeta; izlaz JSON; retry na schema-fail.
- **Brick 4** `assemble-subject.js` — JSON → data datoteke (`window.<var>`+`module.exports`) + final hibrid
  (`Object.assign`) + catalog unos + `CONTENT_VERSION` bump.
- **Gate:** `validate:content` → `verify` → Playwright → Opus spot-check.

## Pravila (kao i dosad)
- Cigla po cigla: jedna → test → commit lokalno → STANI za pregled → „nastavi".
- Validatori su zaštitari; generator NE smije zaobići `validate:content`.
- Pouka (te2/Entrepreneurship): generirani sadržaj VERIFICIRATI protiv predavanja (Opus spot-check).
