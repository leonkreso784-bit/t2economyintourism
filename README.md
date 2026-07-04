# 🎓 Sokrat Study — Interaktivna platforma za učenje

Interaktivna aplikacija za pripremu ispita: gradivo, flashcards, kvizovi i
fill-in-the-blank vježbe. Kreće s fakultetom **FMTU Opatija** (smjer Hospitality
Management) i razvija se u skalabilnu platformu za cijelo sveučilište.

🌐 **Live:** [sokratstudy.com](https://www.sokratstudy.com)

![Version](https://img.shields.io/badge/live-2.x-green.svg)
![Next](https://img.shields.io/badge/u%20izradi-3.0.0-blue.svg)

## 📚 Funkcionalnosti
- **Learn** — kompletno gradivo po temama
- **Flashcards** — kartice s okretanjem
- **Quiz** — pitanja s višestrukim izborom i trenutnom povratnom informacijom
- **Fill-in-the-blank** — vježbe nadopunjavanja
- **Exercises** — interaktivne vježbe s auto-ocjenjivanjem (7 tipova: choice/numeric/ratio/statement/classify/journal/**cite** „napiši citat"); Accounting, Statistics, Macroeconomics, Academic Writing
- **Progress** — praćenje napretka (lokalno + cloud sync uz prijavu)
- **Blind Map** — interaktivna karta (samo Tourism Geography)
- **KaTeX** — formule za kvantitativne predmete (Micro/Macro/Statistics)
- PWA, dark tema, mobile-first, prijava (email+lozinka) + sinkronizacija napretka

## 🎯 Predmeti — FMTU Opatija, Hospitality Management
**2. godina (8):**
- Semestar 1: Tourism Economics, E-Business, Accounting, Entrepreneurship and Innovation
- Semestar 2: Economics in Hospitality, Marketing, Tourism Geography, Food & Nutrition

**1. godina (✅ 9/9 KOMPLETNO):**
- ✅ Gotovo: **Business Informatics, Special Interest Tourism, Management, Microeconomics, Statistics, Macroeconomics, Academic Writing, Traffic in Tourism, Mathematics** (svi K1+K2+Final, svi LIVE)
- ⛔ Intro to Hospitality (blokiran — nema PDF-ova)
- *Academic Writing = prvi predmet izgrađen kroz **generator** (PDF→Sonnet→data/*.js); vidi [CONTENT_GENERATOR.md](docs/CONTENT_GENERATOR.md).*

## 🛠️ Tehnologije
HTML5 · CSS3 · Vanilla JS (ES6+) · Font Awesome · Google Fonts · KaTeX · PWA.
Backend: **Supabase** (Postgres + Auth + Storage) — auth + cloud-sync napretka **LIVE**;
sadržaj se čita **baza → `data/json/*.json` (18/18 predmeta, F2 2A) → `.js` fallback** (anon key + RLS, ADR-011/013); `/api` Vercel funkcije za kasnije (admin/AI).
Dev/test: Node + Playwright (responsive/smoke), unit testovi (`test:unit`), validatori (`validate:content` + `validate:schema` ajv), JSON exporter (`export:json`), `pdf-parse`.

## 📁 Struktura projekta
```
CLAUDE.md               # ★ Ključni kontekst (auto-učitava se svaku sesiju)
index.html              # Glavni HTML (sekcije svih modova)
styles.css / css/       # Stilovi
js/                     # App moduli (config, navigation, quiz, flashcards, ...)
data/catalog.js         # ★ Jedinstveni izvor istine za predmete (hijerarhija)
data/<predmet>/, data-*.js  # Sadržaj predmeta po schemi (+ exercises.js po predmetu) — IZVOR ISTINE
data/json/<predmet>/    # Generirani JSON export study sadržaja (F2 2A; npm run export:json)
schema/                 # subject-content.schema.json — strojni ugovor oblika sadržaja (draft-07)
js/exercises*.js        # Reusable engine za interaktivne vježbe (NIKAD se ne mijenja za sadržaj)
scripts/                # verify-catalog, scaffold, pdf-text, static-server,
                        #   validate-content, validate-json-schema, export-content-json,
                        #   build-topics, generate-subject, assemble-subject (generator),
                        #   migrate-content (data/* → Supabase), rls-check, compute-stats
supabase/schema.sql     # progress + subject_content tablice (RLS)
tests/                  # Playwright (responsive/smoke/…) + tests/unit (graders)
docs/                   # ★ Projektna dokumentacija (vidi niže)
manifest.json, vercel.json
```

## 📖 Dokumentacija
Brzi kontekst je u [CLAUDE.md](CLAUDE.md) (root, auto-učitava se svaku sesiju). Puni docovi su u
[`docs/`](docs/README.md):

| Dokument | Svrha |
|----------|-------|
| [PRD](docs/PRD.md) | Što gradimo, za koga, opseg po fazama |
| [VISION](docs/VISION.md) | Dugoročna full-stack vizija (AI tutor, UGC, dijeljenje, natjecanje) + ključne odluke |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Arhitektura, model baze, razrada po koracima |
| [BACKEND](docs/BACKEND.md) | Vercel Functions + Supabase, API, migracija |
| [ROADMAP](docs/ROADMAP.md) | Milestones + status (done/next) |
| [CONTENT_SCHEMA](docs/CONTENT_SCHEMA.md) · [CONTENT_GUIDE](docs/CONTENT_GUIDE.md) · [CONTENT_INTAKE](docs/CONTENT_INTAKE.md) | Oblik sadržaja, kako dodati predmet, kako slagati materijale |
| [CONTENT_GENERATOR](docs/CONTENT_GENERATOR.md) · [EXERCISES_ENGINE](docs/EXERCISES_ENGINE.md) | Generator predmeta (PDF→Sonnet) · reusable sustav vježbi |
| [MATH_PLAN](docs/MATH_PLAN.md) | Plan za Matematiku (zadnji 1.-god predmet, KaTeX) |
| [TESTING](docs/TESTING.md) | QA + automatske provjere (verify, validate:content, test:unit, Playwright) |
| [CHANGELOG](docs/CHANGELOG.md) · [PROGRESS](docs/PROGRESS.md) | Verzije i dnevnik rada |
| [DECISIONS](docs/DECISIONS.md) · [BUGS](docs/BUGS.md) · [BACKLOG](docs/BACKLOG.md) | Odluke, greške, ideje |

## 🚀 Lokalno pokretanje
```bash
npm start         # npx serve .
# ili otvori index.html u pregledniku
```

## 📄 Licenca
MIT.

## 👤 Autor
**Leon Kreso** — [@leonkreso784-bit](https://github.com/leonkreso784-bit)
