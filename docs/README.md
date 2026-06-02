# Sokrat Study — Dokumentacija

Centralno mjesto za vođenje projekta. Profesionalan, progresivan rad: planiramo,
bilježimo napredak, verzioniramo, učimo iz grešaka.

> **Brzi kontekst:** [`../CLAUDE.md`](../CLAUDE.md) (root) se auto-učitava svaku sesiju i sažima
> najbitnije (stack, arhitektura, kritična pravila, stanje). Ovdje su puni detalji.

| Dokument | Svrha |
|----------|-------|
| [PRD.md](PRD.md) | Product Requirements — što gradimo, za koga, opseg i ne-ciljevi |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tehnička arhitektura, model podataka, razrada po koracima |
| [BACKEND.md](BACKEND.md) | Backend plan: Vercel Functions + Supabase, API, migracija |
| [ROADMAP.md](ROADMAP.md) | Milestones + status (done/next) |
| [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) | Kanonski oblik sadržaja (flashcard/quiz/fill/learn) |
| [CONTENT_GUIDE.md](CONTENT_GUIDE.md) | Kako dodati predmet/lekciju (playbook) |
| [CONTENT_INTAKE.md](CONTENT_INTAKE.md) | Kako slagati profesorske materijale (PDF/JPG) za točnu ekstrakciju |
| [TESTING.md](TESTING.md) | QA checklista + automatske provjere (verify, Playwright) |
| [CHANGELOG.md](CHANGELOG.md) | Verzije (semver) i što se mijenjalo |
| [PROGRESS.md](PROGRESS.md) | Dnevnik rada — što je napravljeno u svakoj sesiji |
| [BUGS.md](BUGS.md) | Bugovi + lekcije naučene ("učimo iz grešaka") |
| [DECISIONS.md](DECISIONS.md) | Arhitektonske odluke (ADR) i zašto su donesene |
| [BACKLOG.md](BACKLOG.md) | Parkiralište ideja (monetizacija, UGC, funkcionalnosti) |

## Kako radimo (pravila)
1. **Mali koraci** — svaki korak je testabilan zasebno.
2. **Live verzija uvijek radi** — ništa se ne mergea ako ruši produkciju.
3. **Zabilježi** — svaki korak ide u PROGRESS, svaka odluka u DECISIONS, svaki bug u BUGS.
4. **Ne briši dok zamjena nije dokazano ispravna.**
5. **Verzioniraj** — značajne promjene dobivaju unos u CHANGELOG.
