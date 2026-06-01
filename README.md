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

## 🎯 Predmeti (8) — Hospitality Management, 2. godina
- **Semestar 1:** Tourism Economics, E-Business, Accounting
- **Semestar 2:** Business Entrepreneurship, Economics in Hospitality, Marketing,
  Tourism Geography, Food & Nutrition

## 🛠️ Tehnologije
HTML5 · CSS3 · Vanilla JS (ES6+) · Font Awesome · Google Fonts · PWA.
Backend (u izradi): Supabase (Postgres + Auth + Storage).

## 📁 Struktura projekta
```
index.html              # Glavni HTML (sekcije svih modova)
styles.css / css/       # Stilovi
js/                     # App moduli (config, navigation, quiz, flashcards, ...)
data/catalog.js         # ★ Jedinstveni izvor istine za predmete (hijerarhija)
data-*.js, data/        # Sadržaj predmeta po schemi
docs/                   # ★ Projektna dokumentacija (vidi niže)
manifest.json, vercel.json
```

## 📖 Dokumentacija (`docs/`)
Projekt se vodi profesionalno i progresivno. Počni od [docs/README.md](docs/README.md):

| Dokument | Svrha |
|----------|-------|
| [PRD](docs/PRD.md) | Što gradimo, za koga, opseg po fazama |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Arhitektura, model baze, razrada po koracima |
| [ROADMAP](docs/ROADMAP.md) | Milestones M0–M4 |
| [CONTENT_SCHEMA](docs/CONTENT_SCHEMA.md) | Kanonski oblik sadržaja |
| [CONTENT_GUIDE](docs/CONTENT_GUIDE.md) | Kako dodati predmet/lekciju |
| [TESTING](docs/TESTING.md) | Ručna QA checklista |
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
