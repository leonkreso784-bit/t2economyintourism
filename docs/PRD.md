# PRD — Sokrat Study

**Status:** živi dokument · **Verzija PRD-a:** 0.4 · **Zadnja izmjena:** 2026-07-15

## 1. Vizija
Sokrat Study je platforma za učenje koja studentima pretvara nastavne materijale
(PPT/PDF profesora) u interaktivne skripte: gradivo, flashcards, kvizove i
fill-in-the-blank vježbe. Kreće s jednim fakultetom (FMTU Opatija), širi se na
cijelo sveučilište i druga sveučilišta, te kasnije omogućuje korisnicima da sami
generiraju i dijele skripte te se natječu.

## 2. Korisnici
- **Student (primarni):** uči za kolokvije/ispite; želi brzo, mobilno, besplatno.
- **Admin/autor (ja, Leon):** dodaje predmete i sadržaj, održava kvalitetu.
- **(Faza 1+) Korisnik-autor:** uploada svoj materijal i radi privatne skripte.
- **(Faza 4) Pretplatnik:** plaća premium funkcionalnosti.

## 3. Trenutno stanje (2026-07-15)
- Statički sajt (HTML/CSS/vanilla JS), live na Vercelu (sokratstudy.com). Data-driven katalog + drill-down nav.
- Sadržaj: **2. god HM = 8/8 ✅ + 1. god HM = 9/9 ✅ LIVE** (17 EN + **2 HR live**: business-informatics-hr pilot + **Management HR objavljen 2026-07-15**). ⛔ Intro to Hospitality blokiran (nema PDF-ova). **HR program u tijeku** (Saša, content-suradnik — `docs/TEAM.md`).
- Modovi: Learn, Flashcards, Quiz, Fill, **Exercises** (7 tipova uklj. „napiši citat"), Progress (+ Blind Map). **KaTeX** za kvantitativne.
- **Platforma-first pregradnja (`FOUNDATION_PLAN.md`): F0–F3 KOMPLETNE + LIVE** — F1 reliability rails (CI/CD, gateovi) · F2 reusable jezgra (JSON dual-read, ContentRepository, AppState, Web Components, Sentry) · F3 performanse (Service Worker/offline, CSS bundling, auto-bump). **Auth + cloud-sync** LIVE; read-path Supabase anon+RLS (ADR-011).
- **F4 Admin CRUD — 🚀 DEPLOYAN NA PRODUKCIJU 2026-07-13** (`5d24a96..79f17c7`; studentima nevidljivo — sve iza `is_admin()`): F4.1–F4.4 ✅ (identitet/write-RLS+versioning/viewer/quiz-fill-learn editori) + **draft+editor staza** (`EDITOR_PLAN.md`): ✅ U1 staging · ✅ U2a id-jevi · ✅ U2.5 placement (ADR-022) · ✅ U3 draft-sloj KOMPLETAN (jedini write-put = „Objavi"; živo verificiran na stagingu). **Preslagivanje 2026-07-13 (EDITOR_PLAN §12+§5.1):** nakon U4 → U-UX dizajn-faza (mockupi prije editor-koda); U5 odgođen; osvježenje platforme = zasebna kasnija faza. **✅ U4 publish-RPC (07-13) + ✅ U-UX (07-14: smjer C „Tok" → `EDITOR_UX.md` v0.9)** — oboje 🚀 DEPLOYANO na PROD 2026-07-14 (`79f17c7..056d963`, token `20260714183628`; PROD SQL prije klijenta).
- **Sljedeće (engineering):** **U6 strukturne ops ✅ KOMPLETNE** (2026-07-17, grana `feature/u6-structural-ops`: kategorije + stavke — add/edit/reorder/remove; DB id-resync 16 eng. odrađen → item delete/reorder; živo verificirano authed 11/11) → U7/U8 blokovi/editor → F5 SRS → F6 sigurnost → UGC. Redoslijed = ADR-018. **Živi tracker: `EDITOR_PLAN.md` §12 + `HISTORY.md`.** (Usput 2026-07-15: BUG-020 kviz-curenje popravljen+deployan; management-hr content-rebalans → Saša.)

## 4. Opseg po fazama
- **Faza 0 (✅ GOTOVA + platforma-first pregradnja F0–F3 LIVE):** data-driven katalog (✅ A1–A3) + hijerarhijska navigacija/redizajn (M0.5) +
  backend **Supabase** (read-path anon+RLS, ADR-011; migracija datoteka→baza kroz F4 flip). Hijerarhija fakultet→smjer→godina→semestar→predmet. **Nastavak = F4 CRUD → U-staza (`EDITOR_PLAN.md`) → F5/F6 → UGC.**
- **Faza 1:** UGC MVP — korisnik uploada PDF/PPT → AI radi privatnu skriptu. Kvote troška.
- **Faza 2:** dijeljenje — javna biblioteka, pretraga, kopiranje tuđih skripti.
- **Faza 3:** natjecanje + društveno — ljestvice, profili, statistika učenja, anti-cheat.
- **Faza 4:** monetizacija — freemium/paywall na funkcionalnosti (ne na sadržaju).

## 5. Funkcionalni zahtjevi (Faza 0)
- F0-1: Katalog kao jedinstveni izvor istine za predmete/hijerarhiju.
- F0-2: Postojeći UI radi identično nakon migracije na katalog.
- F0-3: Sadržaj predmeta se učitava lijeno (lazy), ne sve odjednom.
- F0-4: Backend (Supabase) drži katalog + sadržaj; admin može uređivati.
- F0-5: Navigacija prikazuje hijerarhiju smjer/godina/semestar.

## 6. Ne-funkcionalni zahtjevi
- Mobile-first, radi offline za objavljene predmete (PWA).
- Prvo učitavanje brzo i na slabom mobitelu (kritično za skaliranje na 100+ predmeta).
- Trošak blizu nule dok je publika mala.

## 7. Ne-ciljevi (zasad)
- Nema korisničkog uploada do Faze 1.
- Nema naplate do Faze 4 (i tek na skali).
- Nema sustava uloga — jedini autor sam ja.

## 8. Mjere uspjeha
- Faza 0: svih 8 predmeta migrirano, app radi identično, prvo učitavanje brže.
- Dugoročno: ~1000 MAU s kompletnim sadržajem mog fakulteta.

## 9. Rizici (vidi i ARCHITECTURE/DECISIONS)
- AI trošak kad ga vode korisnici → kvote, "donesi svoj API ključ".
- Moderacija UGC-a i autorska prava na profesorske materijale.
- Anti-cheat na natjecanju.
