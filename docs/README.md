# Sokrat Study — Dokumentacija

Centralno mjesto za vođenje projekta. Profesionalan, progresivan rad: planiramo,
bilježimo napredak, verzioniramo, učimo iz grešaka.

> **Brzi kontekst:** [`../CLAUDE.md`](../CLAUDE.md) (root) se auto-učitava svaku sesiju i sažima
> najbitnije (stack, arhitektura, kritična pravila, stanje). Ovdje su puni detalji.

| Dokument | Svrha |
|----------|-------|
| [PRD.md](PRD.md) | Product Requirements — što gradimo, za koga, opseg i ne-ciljevi |
| [VISION.md](VISION.md) | Dugoročna full-stack vizija (AI tutor, UGC, dijeljenje, natjecanje) + gating-odluke |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tehnička arhitektura, model podataka, razrada po koracima |
| [BACKEND.md](BACKEND.md) | Backend plan: Vercel Functions + Supabase, API, migracija |
| [ROADMAP.md](ROADMAP.md) | Milestones + status (done/next) |
| [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) | Kanonski oblik sadržaja (flashcard/quiz/fill/learn) |
| [CONTENT_GUIDE.md](CONTENT_GUIDE.md) | Kako dodati predmet/lekciju (playbook) |
| [CONTENT_INTAKE.md](CONTENT_INTAKE.md) | Kako slagati profesorske materijale (PDF/JPG) za točnu ekstrakciju |
| [CONTENT_GENERATOR.md](CONTENT_GENERATOR.md) | Generator predmeta (PDF→Sonnet→data/*.js) uz minimalan usage (ADR-010) |
| [EXERCISES_ENGINE.md](EXERCISES_ENGINE.md) | Reusable sustav interaktivnih vježbi (7 tipova) + cigla-po-cigla plan |
| [ACCOUNTING_PLAN.md](ACCOUNTING_PLAN.md) · [STATISTICS_PLAN.md](STATISTICS_PLAN.md) | Plan/analiza izvora za vježbe pojedinih predmeta (povijesno, ✅ done) |
| [TRAFFIC_PLAN.md](TRAFFIC_PLAN.md) | Plan/analiza za Traffic in Tourism (1. god, sem 2) — ✅ done 2026-06-24 |
| [MATH_PLAN.md](MATH_PLAN.md) | Plan za Matematiku (zadnji 1.-god predmet; KaTeX + worked problems) — ✅ LIVE 2026-06-27 |
| [EXERCISES_DB_FIX_PLAN.md](EXERCISES_DB_FIX_PLAN.md) | BUG-012 — randomizirane vježbe iz baze; Opcija A izvedena — ✅ LIVE 2026-06-27 |
| [MONETIZATION.md](MONETIZATION.md) | Naplata/tržište/scenariji (Stripe+NKD djelatnosti, matura tržište, modeli, ideje) — planiranje 2026-06-27 |
| [TESTING.md](TESTING.md) | QA checklista + automatske provjere (verify, validate:content, test:unit, Playwright) |
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
