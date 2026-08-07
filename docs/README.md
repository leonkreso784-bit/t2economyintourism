# Sokrat Study — Dokumentacija

**Ovo je jedini ulaz.** Sve ostalo je u mapama ispod, složeno po **ulozi dokumenta**, ne po temi.

> **Brzi kontekst za sesiju:** [`../CLAUDE.md`](../CLAUDE.md) — auto-učitava se svaki put, sažima stack, pravila i trenutno stanje.
> **Brza povijest:** [records/HISTORY.md](./records/HISTORY.md) — jedan redak po milestone-u.

---

## Kako je ovo složeno

| mapa | uloga | mijenja se |
|---|---|---|
| **`product/`** | **ŠTO** gradimo — definicija proizvoda + kriteriji prihvaćanja | rijetko, uz odluku |
| **`architecture/`** | **KAKO** je građeno — model podataka, granice, ugovori | rijetko |
| **`plan/`** | **ŠTO SADA** — najviše **jedan** aktivni spec + roadmap | stalno |
| **`workflow/`** | **KAKO RADIMO** — testiranje, tim, autorstvo sadržaja | povremeno |
| **`records/`** | **POVIJEST** — dnevnik, changelog, bugovi, odluke | stalno |
| **`subjects/`** | stanje pojedinih predmeta | uz sadržaj |
| **`archive/`** | ispunjeni i napušteni planovi — **referenca, ne istina** | nikad |
| **`sokrat-ai/`** | ⚠️ **zaseban projekt**, ne dira platformu | zasebno |

### Četiri pravila (zato je ovo nastalo)

1. **Jedan aktivni plan.** `plan/` smije imati najviše jedan spec. Ispunjen → `archive/` **isti dan**, s pečatom datuma. Prije ovog čišćenja ondje je stajalo **osam** ispunjenih planova koji su izgledali aktivno.
2. **`product/` nije dnevnik.** Definicija bez kronologije. **Svaka mogućnost ima kriterij prihvaćanja** u obliku *„gotovo kad korisnik može ‹X›"* — nikad „test je zelen". Bez tog pravila je moguće da su svi gate-ovi zeleni, a korisnik ne može napraviti karticu.
3. **`records/` nije izvor istine.** Povijest objašnjava **zašto**, ne **što vrijedi sad**.
4. **Jedno numeriranje faza.** Faza ima ime, ne slovo. (Prije su postojale **tri** različite „F" osi u tri dokumenta.)

**Gate:** `npm run check:docs` (dio `npm run preflight`) pada na mrtvoj poveznici, na drugom aktivnom planu, na dnevniku u `product/` i na dokumentu koji nije naveden ovdje.

---

## `product/` — što gradimo

| Dokument | Svrha |
|---|---|
| [PRD.md](./product/PRD.md) | Product Requirements — što gradimo, za koga, opseg i ne-ciljevi |
| [VISION.md](./product/VISION.md) | Dugoročna vizija (AI tutor, UGC, dijeljenje, natjecanje) + gating-odluke |
| [MONETIZATION.md](./product/MONETIZATION.md) | Naplata, tržište, scenariji (planiranje) |

## `architecture/` — kako je građeno

| Dokument | Svrha |
|---|---|
| [ARCHITECTURE.md](./architecture/ARCHITECTURE.md) | Tehnička arhitektura, model podataka |
| [BACKEND.md](./architecture/BACKEND.md) | Supabase: auth, sync, read-path, osobni UGC-otok, migracije |
| [CATALOG_ARCHITECTURE.md](./architecture/CATALOG_ARCHITECTURE.md) | Identitet predmeta preko programa/fakulteta (placement ≠ sadržaj; ADR-022) |
| [CONTENT_SCHEMA.md](./architecture/CONTENT_SCHEMA.md) | **Kanonski oblik sadržaja** (flashcard/quiz/fill/learn + KaTeX konvencija) |
| [EXERCISES_ENGINE.md](./architecture/EXERCISES_ENGINE.md) | Sustav interaktivnih vježbi (7 tipova) — engine se NE dira za sadržaj |

## `plan/` — što sada

| Dokument | Svrha |
|---|---|
| [ROADMAP.md](./plan/ROADMAP.md) | Milestones + status |

> Aktivnog spec-a trenutno **nema** — slijedi definicija arhitekture i UGC-a (Stage A).

## `workflow/` — kako radimo

| Dokument | Svrha |
|---|---|
| [TESTING.md](./workflow/TESTING.md) | QA checklista + automatske provjere (verify, validatori, unit, Playwright, authed, CI) |
| [TEAM.md](./workflow/TEAM.md) | Uloge, PR-workflow, tvrde granice, least-privilege (ADR-023) |
| [CONTENT_GUIDE.md](./workflow/CONTENT_GUIDE.md) | Kako dodati predmet/lekciju (playbook) |
| [CONTENT_INTAKE.md](./workflow/CONTENT_INTAKE.md) | Kako slagati profesorske materijale (PDF/JPG) za točnu ekstrakciju |
| [CONTENT_GENERATOR.md](./workflow/CONTENT_GENERATOR.md) | Generator predmeta (PDF→Sonnet→data), ADR-010 |

## `records/` — povijest

| Dokument | Svrha |
|---|---|
| [HISTORY.md](./records/HISTORY.md) | Vremenska crta milestone-a (brza orijentacija) |
| [CHANGELOG.md](./records/CHANGELOG.md) | Verzije i što se mijenjalo |
| [PROGRESS.md](./records/PROGRESS.md) | Dnevnik rada po sesijama |
| [DECISIONS.md](./records/DECISIONS.md) | Arhitektonske odluke (ADR-001…024) i zašto |
| [BUGS.md](./records/BUGS.md) | Bugovi + lekcije naučene |
| [BACKLOG.md](./records/BACKLOG.md) | Parkiralište ideja |

## `subjects/` — predmeti

| Dokument | Svrha |
|---|---|
| [subjects/README.md](./subjects/README.md) | **Autoritativna tablica svih predmeta** (status/brojevi/vježbe) |
| [ACCOUNTING_PLAN.md](./subjects/ACCOUNTING_PLAN.md) · [STATISTICS_PLAN.md](./subjects/STATISTICS_PLAN.md) · [TRAFFIC_PLAN.md](./subjects/TRAFFIC_PLAN.md) · [MATH_PLAN.md](./subjects/MATH_PLAN.md) | Planovi pojedinih predmeta (✅ gotovi) |

## `archive/` — ispunjeno i napušteno

> **Referenca, ne istina.** Ovdje se gleda *kako je nešto izvedeno*, nikad *što sada vrijedi*.

| Dokument | Status |
|---|---|
| [CREATE_BACKEND_SPEC.md](./archive/CREATE_BACKEND_SPEC.md) | Osobni UGC-graditelj — **instalacije F0–F5 isporučene** (prod 2026-08-06). ⚠️ Vizija iz §1 (kartice/kviz/fill u vlastitom gradivu) **NIJE dovršena** — v. `product/` |
| [EDITOR_PLAN.md](./archive/EDITOR_PLAN.md) | Editor / admin CRUD — ispunjen 2026-07-28; §12 = povijest cigli U0–U9 |
| [EDITOR_UX.md](./archive/EDITOR_UX.md) | Dizajn-ugovor editora (smjer C „Tok"); mockup `design/mockups/editor-c-tok.html` |
| [EDITOR_F7_SPEC.md](./archive/EDITOR_F7_SPEC.md) | Kvadratić-model K1–K6 — ispunjen |
| [EDITOR_FEEDBACK.md](./archive/EDITOR_FEEDBACK.md) | Leonovih 8 nalaza F1–F8 iz živog pregleda editora |
| [FOUNDATION_PLAN.md](./archive/FOUNDATION_PLAN.md) | Platformski temelj F0–F6; F1–F4 isporučeni, F5/F6 nadglašeni |
| [CRUD_PLAN.md](./archive/CRUD_PLAN.md) | Admin CRUD javnog kataloga — ispunjen kroz EDITOR_PLAN |
| [HRV_PLAN.md](./archive/HRV_PLAN.md) | HRV program (klon-program + UI toggle, ADR-012) — cigle 1–5c ✅, ostatak pauziran |
| [EXERCISES_DB_FIX_PLAN.md](./archive/EXERCISES_DB_FIX_PLAN.md) | BUG-012 fix plan (✅ 2026-06-27) |
| [SONNET_REVIEW_2026-06.md](./archive/SONNET_REVIEW_2026-06.md) | Vanjski review — potrošen input |

## `sokrat-ai/` — zaseban projekt

> ⚠️ **NE implementira se na ovu platformu i nema veze s njom** (Leonova odluka 2026-07-24).
> Platforma ne ovisi o njemu ni u čemu. Prva prezentacija dekanu: 10. mjesec 2026.

| Dokument | Svrha |
|---|---|
| [sokrat-ai/README.md](./sokrat-ai/README.md) | Ulazna točka — što je, temeljne odluke, putanja |
| [VISION.md](./sokrat-ai/VISION.md) | Teza: nekontaminirani ljudski podaci, pozicioniranje |
| [RESEARCH.md](./sokrat-ai/RESEARCH.md) | 4 istraživačke oklade (A–D), metodologija, arhitektura |
| [DATA.md](./sokrat-ai/DATA.md) | Izvori (Hrčak/DABAR/hrWaC/Wikipedia), cjevovod |
| [LEGAL_GDPR.md](./sokrat-ai/LEGAL_GDPR.md) | GDPR + autorsko pravo + TDM iznimka (⚠️ nije pravni savjet) |
| [DEAN_PITCH.md](./sokrat-ai/DEAN_PITCH.md) | Prezentacija dekanu |
