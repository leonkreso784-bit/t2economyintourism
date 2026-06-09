# ROADMAP — Milestones

Legenda statusa: ⬜ todo · 🟦 u tijeku · ✅ gotovo

## 📍 STANJE (2026-06-09)
**Napravljeno:** M0 Blok A (A1–A3) gotov i **LIVE** (data-driven katalog, `config.js` i sidebar iz
catalog-a) · Learn responsive/overflow fix live · sadržajni alati (template, scaffold, `verify`,
`pdf-text`, Playwright suite) · **Business Informatics (1. god, sem 1) KOMPLETAN** (K1+K2+Final, 11
kategorija) · **M0.5: puni drill-down navigacija (`#browse-page`) + „čisto i bogato" redizajn ✅** ·
**Landing rebuild u punu „pravu stranicu" ✅** (nav, subjects showcase iz catalog-a, How it works,
5 modova, CTA, strukturiran footer) + **SEO meta popravljen** · **Lazy-loading sadržaja ✅ (A4)**
(`content-loader.js`; ~777 KB se više ne učitava na startu, nego po predmetu) · **VISION.md** zapisan.
**Odluka smjera (2026-06-05):** prvo **kompletirati sadržaj** (1. i 2. godina) PA Blok B — autorstvo u
datotekama je migracijski sigurno (ADR-006), migracija ide JEDNOM na punom katalogu. Tier 2 (Privacy/FAQ/
Contact) ostaje brzi „quick win" kad zatreba za Google Ads.
**Kvantitativni predmeti (Math/Micro/Macro/Statistika):** poseban tretman — **KaTeX** rendering formula +
„worked problems" konvencija + grafovi-kao-slike (**ADR-009**). KaTeX = zasebna cigla PRIJE prvog takvog
predmeta; čista Matematika ZADNJA. Inventar materijala 1. god: [CONTENT_INTAKE.md](CONTENT_INTAKE.md).
**Sadržaj:** 2. god = 8 predmeta ✅ · **Marketing KOMPLETAN** (K1+K2+Finalni, 13 kat.) · **Economics in Hospitality
KOMPLETAN** (K1 Unit 1–5 + K2 Unit 6–10 + Finalni hibrid, 11 kat. / 162 fc) · preostala 2 fale 2. kolokvij:
**geography** (+ tekst za popravak), **food-nutrition** · 1. god = Business Informatics ✅, ostalih 10 ⬜
(Math/Macro/Mgmt/SIT imaju materijale; Stat/Acad-writing/Intro-hosp/Traffic PRAZNO).
**Deploy:** sve LIVE na `origin/main` → Vercel. **2026-06-09 deployano (`24f2b6f`):** cijeli Economics in Hospitality
(K1+K2+finalni) + fix BUG-008 + Entrepreneurship→sem 1. (Ranije `822d788`, 2026-06-06: Marketing + responsive split +
fixevi BUG-005/006/007.) Radno stablo čisto, ništa lokalno nedeployano.

## M0 — Temelj: data-driven + backend (Faza 0)  🟦
Cilj: ukloniti hardkodiranje i postaviti skalabilan backend bez rušenja live verzije.

**Blok A — Frontend data-driven (lokalno, bez backenda)**
- ✅ A1 — `data/catalog.js` (jedinstveni izvor istine, hijerarhija FMTU→HM→2.god)
- ✅ A2 — `js/config.js` čita iz catalog-a (subjectDataMap + getSubjectData);
  svi data-*.js izloženi na `window`; verificirano `scripts/verify-catalog.js` (0 grešaka)
- ✅ A3 — sidebar render iz catalog-a (`renderSubjectsSidebar()`); uklonjen ručni
  HTML; `iconGradient` u catalogu; verificirano Playwrightom (sidebar.spec.js)
- ✅ A4 — **lazy loading** (`js/content-loader.js`: `loadSubjectContent()` učita sadržaj predmeta
  tek na otvaranje; statički `data-*.js` maknuti iz `index.html`). Šav prema `/api` (Blok B). Test `lazy-load.spec.js`.
- ✅ A5 — UI hijerarhije = **puni drill-down nav** (`#browse-page`, M0.5, ADR-007); test `browse.spec.js`

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
uglađen „čisto i bogato" frontend, spremno za ~19+ predmeta. Logo se zadržava.

- Sadržajni alati: ✅ struktura+template+scaffold (K1); ✅ coming-soon iz catalog-a (K2,
  `isLessonComingSoon`); ⬜ validator sadržaja (K3); ✅ **lazy-load seam (K4)** = `js/content-loader.js`;
  ⬜ **KaTeX math rendering (K5)** = `renderMath()` + LaTeX konvencija za kvantitativne predmete (ADR-009)
- ✅ Pilot sadržaja: **Business Informatics** (Ch1–11, K1+K2+Final) — dokaz da content pipeline radi
- ⬜ Catalog: dodati ostalih 10 predmeta 1. godine + semestar mapping (čeka materijale)
- ✅ Hijerarhijska navigacija: Start → Fakulteti → Smjerovi → Godine → Predmeti (po semestru) +
  breadcrumbs (`#browse-page`, `renderBrowse()`; test `browse.spec.js`)
- ✅ Frontend redesign (browse + landing): „čisto i bogato", dosljedne kartice (gradijent-ikone,
  napredak), responzivno (Playwright zeleno, 4 iPhone profila). Logo nepromijenjen.
- ✅ **Landing rebuild** u punu višesekcijsku „pravu stranicu": fixed nav, subjects showcase (iz catalog-a),
  How it works, 5 modova, završni CTA, strukturiran footer + **SEO meta**. Test `landing.spec.js`.
  Preostaje: redizajn study/lessons unutarnjih ekrana (kasnije po potrebi).
- ⬜ **Tier 2 (povjerenje / priprema za Google Ads):** Privacy Policy + Contact + FAQ stranica/sekcija
- ⬜ Intake materijala: `_materials/` + [CONTENT_INTAKE.md](CONTENT_INTAKE.md)
- **DoD:** uđeš → fakultet → smjer → godina → predmeti po semestru; izgled uglađen; sve responzivno
  (Playwright zeleno); dodavanje predmeta = catalog + scaffold. **(Navigacija + redizajn browse/landing: ispunjeno ✅)**

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
