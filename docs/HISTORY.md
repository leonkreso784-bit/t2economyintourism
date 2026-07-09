# HISTORY — vremenska crta milestone-a

> **Jedan red po milestone-u** — brza orijentacija „što je sve živo i kad". Detalji: [PROGRESS.md](PROGRESS.md) (dnevnik po sesijama) i [CHANGELOG.md](CHANGELOG.md). Stanje predmeta: [subjects/README.md](subjects/README.md).

## Platforma (Foundation, 2026-06-29 → )
| Datum | Milestone | Ref |
|---|---|---|
| 2026-07-09 | **👥 TIM: +Saša Vudrag** (content-suradnik; TEAM.md, ADR-023) · **ADR-022 pull-forward = U2.5** | `b8e58a3` |
| 2026-07-09 | **UGC.md north-star** (draft→objavi, blokovi+ID-jevi, publish-RPC, U0–U9) + **doc-reorg** (content/subjects/archive + HISTORY + CLAUDE.md dijeta 463→94) | `08ab604`+`0d17689`+`aefb1a4` |
| 2026-07-08 | **F4.4 quiz+fill+learn CRUD** — edit svih tipova kroz admin, živo verificirano (preview, grana `foundation/f4`) | `9c2c979`+`c75b08f`+`c65606a` |
| 2026-07-08 | **F4.3c edit kartice end-to-end + Playwright LOGIN** (storageState, `test:authed`) + CI authed job | `7d1368a`+`d57c5fd`+`f208eef` |
| 2026-07-06 | **F4.1–4.3b**: admin identitet (`profiles`+`is_admin`) · write-RLS + `content_versions` audit · admin UI viewer (3 buga nađena ŽIVOM prijavom) | `5ee749e`..`0bc5e41` |
| 2026-07-06 | **F3 KOMPLETNA NA PRODUKCIJI** — 3D slike (blind-map −98%) + 3D.2 async CSS + 3E a11y (0 axe violationa) | `e39eb1d..b19a641` |
| 2026-07-05 | **F3 jezgra**: auto-bump (`npm run bump`, ADR-017) · CSS bundle · **Service Worker** (offline; Fable 3A.3, ADR-019) | `c115a5d..868dc9f` |
| 2026-07-04 | **F2 KOMPLETNA**: `<sokrat-toast>`/`<sokrat-modal>`/`<sokrat-confirm>` + auth modal migriran | `d2b1e48..df67766` |
| 2026-07-03 | **2C AppState** (svi mutable globali) + BUG-016 · **2A dovršena 18/18** (accounting→JSON, ADR-015) | `f54048a`+`d2b1e48` |
| 2026-07-02 | **2A JSON dual-read 17/18** — schema-ugovor, exporter, dual-read loader, migracija | `661dbc8` |
| 2026-07-01 | **2B ContentRepository (S1) + 2E Sentry** (consent-gated, EU) | `164dc11..57f449a` |
| 2026-06-30 | **F1 reliability rails**: CI/CD · typecheck · hardening · a11y+layout+Lighthouse gateovi · RLS-check | `c874627..69ce466` |
| 2026-06-29 | **STRATEŠKI ZAOKRET: platforma-first** (FOUNDATION_PLAN; ADR-013/014) — sadržaj pauziran | — |

## Backend (staza B, 2026-06-12 → )
| Datum | Milestone | Ref |
|---|---|---|
| 2026-06-27 | **BUG-012 fix**: `content.codeScripts` — vježbe (kod) UVIJEK iz datoteke; baza očišćena (51 red/17 predmeta) | `801d9a6` |
| 2026-06-23 | **Blok B read-path**: sadržaj iz Supabasea (anon+RLS, ADR-011) + file-fallback; migracija `migrate-content.js` | `077d375` |
| 2026-06-14 | Fix email-potvrde (Supabase Redirect URLs, dashboard-only) | `06c96a8` |
| 2026-06-13 | **Auth email+lozinka** (magic-link uklonjen) + Profile + pravne stranice (privacy/terms/faq/contact) + **GA4 + GDPR consent** | `51e4e7b` |
| 2026-06-12/13 | **Staza B start**: Supabase (tablica `progress`, RLS) · cloud-sync (offline-first merge) · auth modal | — |

## Sadržaj (2026-06 → pauza 2026-06-29; detalji po predmetu: subjects/README.md)
| Datum | Milestone | Ref |
|---|---|---|
| 2026-06-28 | **HRV pilot**: program-klon (ADR-012) + Poslovna informatika HR + globalni 🌐 HR/EN toggle (i18n) | `320d413..4b795c8` |
| 2026-06-28 | **Logo redizajn** (vektorizacija originala, potrace; glava ispunjava krug) | `19f07db` |
| 2026-06-27 | **Math LIVE = 1. GODINA 9/9 KOMPLETNA** → sadržajna staza 1.+2. god GOTOVA (Intro blokiran) | `31be03f` |
| 2026-06-25 | Traffic in Tourism (ručno, 13 PDF) | `62a4119` |
| 2026-06-22/23 | **Generator predmeta** (Sonnet tool_use, ADR-010) + **pilot Academic Writing** + novi exercise tip `cite` | `569e608`+`ada5b99` |
| 2026-06-16/22 | Statistics nadogradnja (Learn + 56 vježbi) · Macroeconomics vježbe B1–B12 (~81) | `d97ee0b`+`28fcb7e` |
| 2026-06-14/16 | **KaTeX cigla** (ADR-009) → Microeconomics → Statistics (prvi kvantitativni predmeti) | `236e303` |
| 2026-06-14 | SIT + Management (1. god) | `e0e9ca7`+`06c96a8` |
| 2026-06-12/13 | **Restrukture sem-1**: Accounting (+ **Exercises engine**, 41 vj.) · te2 REBUILD · E-Business · Entrepreneurship → **2. god 8/8** | `a6b6fb0`..`8a37404` |
| 2026-06-06/10 | Marketing · Econ Hospitality · Geography · Food & Nutrition (sem-2 kompletni) | `822d788`..`05cb0af` |
| ranije | M0 Blok A (catalog SSOT · config-iz-catalog · sidebar) · M0.5 drill-down browse · landing rebuild · lazy-load (A4) | — |

## Ključne trajne odluke (puni tekst: [DECISIONS.md](DECISIONS.md))
ADR-009 KaTeX currency-safe · ADR-011 read-path anon+RLS bez `/api` · ADR-012 HR=klon · ADR-013 podatak≠ponašanje (JSON⟂JS) · ADR-014 engineering standardi · ADR-015 tech-debt triage „briše li ga F4" · ADR-016 `service_role`→Edge Functions · ADR-017 uniformni cache-token · ADR-018 platforma-first do UGC-a · ADR-019 rizične cigle na Fable · ADR-020 dvo-ključni content-verifier · ADR-021 CRUD odluke · ADR-022 placement≠sadržaj (multi-program).
