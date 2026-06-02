# ROADMAP — Milestones

Legenda statusa: ⬜ todo · 🟦 u tijeku · ✅ gotovo

## M0 — Temelj: data-driven + backend (Faza 0)  🟦
Cilj: ukloniti hardkodiranje i postaviti skalabilan backend bez rušenja live verzije.

**Blok A — Frontend data-driven (lokalno, bez backenda)**
- ✅ A1 — `data/catalog.js` (jedinstveni izvor istine, hijerarhija FMTU→HM→2.god)
- ✅ A2 — `js/config.js` čita iz catalog-a (subjectDataMap + getSubjectData);
  svi data-*.js izloženi na `window`; verificirano `scripts/verify-catalog.js` (0 grešaka)
- ✅ A3 — sidebar render iz catalog-a (`renderSubjectsSidebar()`); uklonjen ručni
  HTML; `iconGradient` u catalogu; verificirano Playwrightom (sidebar.spec.js)
- 🟦 A4 — lazy loading sadržaja (data-*.js tek na otvaranje predmeta)
- ⬜ A5 — UI hijerarhije (smjer/godina/semestar)

**Blok B — Supabase backend**
- ⬜ B6 — Supabase projekt + schema (tablice)
- ⬜ B7 — migracijska skripta catalog + 8 predmeta → baza
- ⬜ B8 — data-access sloj (dohvat iz Supabasea + lokalni fallback/keš)
- ⬜ B9 — admin login (samo ja)
- ⬜ B10 — admin CRUD (hijerarhija + sadržaj)

**Definicija gotovog (M0):** svih 8 predmeta dolazi iz baze, app radi identično,
prvo učitavanje brže, mogu dodati novi predmet kroz admin bez diranja koda.

## M0.5 — Spremnost za sadržaj: hijerarhija + redesign (PRIJE masovnog unosa)  🟦
Cilj: stranica strukturirana Fakultet → Smjer → Godina → (Semestar) → Predmet, i
uglađen minimalistički frontend, spremno za ~19+ predmeta. Logo se zadržava.

- ⬜ Sadržajni alati: ✅ struktura+template+scaffold (K1); ⬜ coming-soon iz catalog-a
  (K2); ⬜ validator sadržaja (K3); ⬜ lazy-load seam (K4)
- ⬜ Catalog: dodati 1. godinu (11 predmeta) kao stubove (coming-soon) + semestar mapping
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
