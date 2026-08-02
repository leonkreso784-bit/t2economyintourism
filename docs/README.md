# Sokrat Study — Dokumentacija

Centralno mjesto za vođenje projekta. Profesionalan, progresivan rad: planiramo,
bilježimo napredak, verzioniramo, učimo iz grešaka.

> **Brzi kontekst:** [`../CLAUDE.md`](../CLAUDE.md) (root) se auto-učitava svaku sesiju i sažima
> najbitnije (stack, arhitektura, kritična pravila, TRENUTNO stanje). Ovdje su puni detalji.
> **Brza povijest:** [HISTORY.md](HISTORY.md) (vremenska crta milestone-a, 1 red po milestone-u).

## ▶ Aktivni planovi
| Dokument | Svrha |
|----------|-------|
| [TEAM.md](TEAM.md) | **Tim: uloge, workflow, zaštita sustava** — Leon (platforma) + Saša (content, S-cigle); PR+CI, tvrde granice, least-privilege (ADR-023) |
| [FOUNDATION_PLAN.md](FOUNDATION_PLAN.md) | **Platforma-first temelj** — misije/faze F0–F6, reusable podsistemi, brick-liste (ADR-013/014) |
| [EDITOR_PLAN.md](EDITOR_PLAN.md) | **▶ AKTIVNO — dovršetak Admin CRUD-a: draft→objavi + editor (nastavak F4; bivši UGC.md)** — model sadržaja (ID+blokovi+tokeni), publish-RPC, editor, sigurnost; brick-slijed U0–U9; §5.1 = Leonovi zahtjevi 1–8; UGC/AI = kasniji horizonti H2/H3 |
| [EDITOR_UX.md](EDITOR_UX.md) | **Dizajn-ugovor editora (U-UX presuda 2026-07-14: smjer C „Tok")** — Studio+wizard, kvadratići, boje-tokeni s nasljeđivanjem, vizualni standard; živi izgled = `design/mockups/editor-c-tok.html` |
| [CREATE_BACKEND_SPEC.md](CREATE_BACKEND_SPEC.md) | **▶ AKTIVNO (v3, vizija POTVRĐENA) — osobni PRIVATNI UGC-graditelj gradiva „od nule"** — korisnik slaže vlastito ugniježđeno stablo (`nodes`) i u study-čvorovima gradi gradivo (`node_content`) postojećim editorom; tvrda owner-RLS, upis samo kroz RPC-ove; **F1 ✅ izveden na stagingu (§9, gate 51/51)**, slijedi F2 „Moji materijali"; odluka = ADR-024 |
| [CRUD_PLAN.md](CRUD_PLAN.md) | **F4 Admin CRUD** — brick-slijed F4.1–F4.6; ADR-021; F4.1–4.4 (quiz/fill/learn) ✅ živo verificirano; nastavak KROZ EDITOR_PLAN.md U-slijed |
| [CATALOG_ARCHITECTURE.md](CATALOG_ARCHITECTURE.md) | Identitet predmeta preko programa/fakulteta (placement≠sadržaj; ADR-022) — **✅ mehanizam implementiran (U2.5)**; stvarni MUT/MOR programi = S7 |
| [HRV_PLAN.md](HRV_PLAN.md) | HRV program „Menadžment u Hotelijerstvu" (klon-program + UI toggle, ADR-012) — cigle 1–5c ✅; ostatak pauziran |

## Temelji i referenca
| Dokument | Svrha |
|----------|-------|
| [PRD.md](PRD.md) | Product Requirements — što gradimo, za koga, opseg i ne-ciljevi |
| [VISION.md](VISION.md) | Dugoročna full-stack vizija (AI tutor, UGC, dijeljenje, natjecanje) + gating-odluke |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tehnička arhitektura, model podataka, razrada po koracima |
| [BACKEND.md](BACKEND.md) | Backend: Supabase (auth/sync/content read-path), staza B, migracije |
| [ROADMAP.md](ROADMAP.md) | Milestones + status (done/next) |
| [TESTING.md](TESTING.md) | QA checklista + automatske provjere (verify, validatori, test:unit, Playwright, test:authed, CI) |
| [MONETIZATION.md](MONETIZATION.md) | Naplata/tržište/scenariji (planiranje) |

## Sadržaj (autorstvo) — `content/`
| Dokument | Svrha |
|----------|-------|
| [content/CONTENT_SCHEMA.md](content/CONTENT_SCHEMA.md) | Kanonski oblik sadržaja (flashcard/quiz/fill/learn + KaTeX konvencija) |
| [content/CONTENT_GUIDE.md](content/CONTENT_GUIDE.md) | Kako dodati predmet/lekciju (playbook) |
| [content/CONTENT_INTAKE.md](content/CONTENT_INTAKE.md) | Kako slagati profesorske materijale (PDF/JPG) za točnu ekstrakciju |
| [content/CONTENT_GENERATOR.md](content/CONTENT_GENERATOR.md) | Generator predmeta (PDF→Sonnet→data) uz minimalan usage (ADR-010) |
| [content/EXERCISES_ENGINE.md](content/EXERCISES_ENGINE.md) | Reusable sustav interaktivnih vježbi (7 tipova) — engine se NE dira za sadržaj |

## Predmeti — `subjects/`
| Dokument | Svrha |
|----------|-------|
| [subjects/README.md](subjects/README.md) | **Autoritativna tablica svih predmeta** (status/brojevi/vježbe/napomene) |
| [subjects/ACCOUNTING_PLAN.md](subjects/ACCOUNTING_PLAN.md) · [subjects/STATISTICS_PLAN.md](subjects/STATISTICS_PLAN.md) · [subjects/TRAFFIC_PLAN.md](subjects/TRAFFIC_PLAN.md) · [subjects/MATH_PLAN.md](subjects/MATH_PLAN.md) | Detaljni planovi pojedinih predmeta (✅ done) |

## Sokrat AI (vlastiti jezični model) — `sokrat-ai/`
> ⚠️ **POTPUNO ZASEBAN PROJEKT — NE implementira se na ovu platformu i nema veze s njom**
> (Leonova izričita odluka 2026-07-24). Ovdje samo živi zapis. Platforma ne ovisi o njemu ni u čemu.
> Rok prve prezentacije dekanu: **10. mjesec 2026.**

| Dokument | Svrha |
|----------|-------|
| [sokrat-ai/README.md](sokrat-ai/README.md) | **Ulazna točka** — što je, temeljne odluke, putanja do 10. mj |
| [sokrat-ai/VISION.md](sokrat-ai/VISION.md) | Teza: nekontaminirani ljudski podaci, pozicioniranje, naša prednost |
| [sokrat-ai/RESEARCH.md](sokrat-ai/RESEARCH.md) | 4 istraživačke oklade (A–D), jeftina metodologija, tehnička arhitektura |
| [sokrat-ai/DATA.md](sokrat-ai/DATA.md) | Izvori (Hrčak/DABAR/hrWaC/Wikipedia), porijeklo, cjevovod podataka |
| [sokrat-ai/LEGAL_GDPR.md](sokrat-ai/LEGAL_GDPR.md) | **GDPR + autorsko pravo + TDM iznimka** (⚠️ nije pravni savjet) |
| [sokrat-ai/DEAN_PITCH.md](sokrat-ai/DEAN_PITCH.md) | Prezentacija dekanu: što tražimo/nudimo, plan i kontrolna lista |

## Živi zapisnici
| Dokument | Svrha |
|----------|-------|
| [HISTORY.md](HISTORY.md) | Vremenska crta milestone-a (brza orijentacija) |
| [CHANGELOG.md](CHANGELOG.md) | Verzije i što se mijenjalo |
| [PROGRESS.md](PROGRESS.md) | Dnevnik rada po sesijama |
| [DECISIONS.md](DECISIONS.md) | Arhitektonske odluke (ADR-001…023) i zašto |
| [BUGS.md](BUGS.md) | Bugovi + lekcije naučene |
| [BACKLOG.md](BACKLOG.md) | Parkiralište ideja |

## Arhiva — `archive/`
| Dokument | Svrha |
|----------|-------|
| [archive/EXERCISES_DB_FIX_PLAN.md](archive/EXERCISES_DB_FIX_PLAN.md) | BUG-012 fix plan (✅ izvedeno 2026-06-27) |
| [archive/SONNET_REVIEW_2026-06.md](archive/SONNET_REVIEW_2026-06.md) | Vanjski review (Sonnet 4.6) — input za F1 hardening (potrošeno; prijedlozi, ne istina) |

## Kako radimo (pravila)
1. **Mali koraci** — svaki korak je testabilan zasebno.
2. **Live verzija uvijek radi** — ništa se ne mergea ako ruši produkciju.
3. **Zabilježi** — svaki korak ide u PROGRESS, svaka odluka u DECISIONS, svaki bug u BUGS.
4. **Ne briši dok zamjena nije dokazano ispravna.**
5. **Verzioniraj** — značajne promjene dobivaju unos u CHANGELOG.
