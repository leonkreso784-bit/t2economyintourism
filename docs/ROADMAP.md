# ROADMAP — Milestones

Legenda statusa: ⬜ todo · 🟦 u tijeku · ✅ gotovo

## 📍 STANJE (2026-06-02)
**Napravljeno:** M0 Blok A (A1–A3) gotov i **LIVE** (data-driven katalog, `config.js` i sidebar iz
catalog-a) · Learn responsive/overflow fix live · sadržajni alati (template, scaffold, `verify`,
`pdf-text`, Playwright suite) · **Business Informatics (1. god, sem 1) KOMPLETAN** (K1+K2+Final, 11
kategorija) — pilot manualnog content pipelinea uspješan.
**Sljedeće:** M0.5 = minimalistički **redizajn + puni drill-down nav** (ADR-007) → ostali predmeti
1. godine (10 kom., kad stignu materijali) → **Blok B** (Vercel Functions + Supabase; migracija JEDNOM).
**Sadržaj:** 2. god = 8 predmeta ✅ · 1. god = Business Informatics ✅, ostalih 10 ⬜.
**Deploy:** zadnji live = A3 + fiksevi; BI sadržaj je commitan ali **NIJE deployan** (čeka potvrdu).

## M0 — Temelj: data-driven + backend (Faza 0)  🟦
Cilj: ukloniti hardkodiranje i postaviti skalabilan backend bez rušenja live verzije.

**Blok A — Frontend data-driven (lokalno, bez backenda)**
- ✅ A1 — `data/catalog.js` (jedinstveni izvor istine, hijerarhija FMTU→HM→2.god)
- ✅ A2 — `js/config.js` čita iz catalog-a (subjectDataMap + getSubjectData);
  svi data-*.js izloženi na `window`; verificirano `scripts/verify-catalog.js` (0 grešaka)
- ✅ A3 — sidebar render iz catalog-a (`renderSubjectsSidebar()`); uklonjen ručni
  HTML; `iconGradient` u catalogu; verificirano Playwrightom (sidebar.spec.js)
- ⬜ A4 — lazy loading → **spojeno u M0.5 (K4) / Blok B** (DB fetch je inherentno lazy)
- ⬜ A5 — UI hijerarhije → **= puni drill-down nav u M0.5** (ADR-007)

**Blok B — Backend: Vercel Functions + Supabase** (ADR-008, [BACKEND.md](BACKEND.md))
- ⬜ B6 — Supabase projekt + schema (tablice)
- ⬜ B7 — migracijska skripta: catalog + `data/*` → baza (JEDNOM, kad je sadržaj unutra)
- ⬜ B8 — `/api/catalog` + `/api/subject` (Vercel Functions); frontend `loadSubjectContent` → `/api`
- ⬜ B9 — admin login (Supabase Auth, samo ja)
- ⬜ B10 — admin CRUD (hijerarhija + sadržaj)
- Napomena: sadržaj se NE migrira sad — datoteke ostaju izvor do Bloka B.

**Definicija gotovog (M0):** svih 8 predmeta dolazi iz baze, app radi identično,
prvo učitavanje brže, mogu dodati novi predmet kroz admin bez diranja koda.

## M0.5 — Spremnost za sadržaj: hijerarhija + redesign (PRIJE masovnog unosa)  🟦
Cilj: stranica strukturirana Fakultet → Smjer → Godina → (Semestar) → Predmet, i
uglađen minimalistički frontend, spremno za ~19+ predmeta. Logo se zadržava.

- Sadržajni alati: ✅ struktura+template+scaffold (K1); ⬜ coming-soon iz catalog-a (K2);
  ⬜ validator sadržaja (K3); ⬜ lazy-load seam (K4)
- ✅ Pilot sadržaja: **Business Informatics** (Ch1–11, K1+K2+Final) — dokaz da content pipeline radi
- ⬜ Catalog: dodati ostalih 10 predmeta 1. godine + semestar mapping (čeka materijale)
- ⬜ Hijerarhijska navigacija: Start → Smjerovi → Godine → Predmeti (po semestru) +
  breadcrumbs; dosljedno na svim ekranima
- ⬜ Frontend redesign: minimalistički, dosljedan sustav (tipografija, razmaci, kartice),
  responzivno (čuva ga Playwright). Logo nepromijenjen.
- ⬜ Intake materijala: `_materials/` + [CONTENT_INTAKE.md](CONTENT_INTAKE.md)
- **DoD:** uđeš → smjer → godina → predmeti po semestru; izgled uglađen; sve responzivno
  (Playwright zeleno); dodavanje predmeta = catalog + scaffold.

## M1 — UGC MVP (Faza 1)  ⬜
Upload PDF/PPT → ekstrakcija → Claude generira skriptu → privatno učenje.
Kvote troška od prvog dana. Ljudski pregled prije objave.

## M2 — Dijeljenje (Faza 2)  ⬜
Javna biblioteka skripti, pretraga, kopiranje/fork tuđih, prijava sadržaja.

## M3 — Natjecanje + društveno (Faza 3)  ⬜
Ljestvice, profili, statistika učenja, anti-cheat.

## M4 — Monetizacija (Faza 4)  ⬜
Freemium/paywall na funkcionalnosti, "donesi svoj API ključ", lokalno sponzorstvo.

---
*Detalji koraka i obrazloženja: [ARCHITECTURE.md](ARCHITECTURE.md). Napredak: [PROGRESS.md](PROGRESS.md).*
