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
- **Progress** — praćenje napretka (lokalno spremanje)
- **Blind Map** — interaktivna karta (samo Tourism Geography)
- PWA, dark tema, mobile-first

## 🎯 Predmeti — FMTU Opatija, Hospitality Management
**2. godina (8):**
- Semestar 1: Tourism Economics, E-Business, Accounting
- Semestar 2: Business Entrepreneurship, Economics in Hospitality, Marketing, Tourism Geography, Food & Nutrition

**1. godina (u izradi):**
- Semestar 1: **Business Informatics ✅** (Midterm 1 + Midterm 2 + Final) — ostalih 10 predmeta slijedi

## 🛠️ Tehnologije
HTML5 · CSS3 · Vanilla JS (ES6+) · Font Awesome · Google Fonts · PWA.
Backend (u izradi): **Vercel Functions (`/api`) + Supabase** (Postgres + Auth + Storage).
Dev/test: Node + Playwright (responsive/smoke testovi), `pdf-parse` (čitanje materijala).

## 📁 Struktura projekta
```
CLAUDE.md               # ★ Ključni kontekst (auto-učitava se svaku sesiju)
index.html              # Glavni HTML (sekcije svih modova)
styles.css / css/       # Stilovi
js/                     # App moduli (config, navigation, quiz, flashcards, ...)
data/catalog.js         # ★ Jedinstveni izvor istine za predmete (hijerarhija)
data/<predmet>/, data-*.js  # Sadržaj predmeta po schemi
scripts/                # verify-catalog, scaffold-subject, pdf-text, static-server
tests/                  # Playwright (responsive, smoke, sidebar)
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
| [TESTING](docs/TESTING.md) | QA + automatske provjere |
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
