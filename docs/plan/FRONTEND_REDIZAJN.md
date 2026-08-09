# Frontend redizajn — prelazak na Tailwind

**Status:** 🟦 aktivan spec · **Otvoren:** 2026-08-09 · **Odluka:** [ADR-028](../records/DECISIONS.md)
**Opseg (Leon):** cijela platforma **i** editor · **Izvedba kreće od landinga.**

> **Zašto ovo radimo i zašto baš Tailwind-CLI, piše u [ADR-028](../records/DECISIONS.md)** — mjere,
> odbačene alternative i tvrde granice. Ovdje stoji samo **što se radi i kojim redom**.

---

## 1 · Što ova faza jest, a što nije

**Jest:** zamjena jezika stiliziranja. Ista aplikacija, isti tokovi, drugi temelj — plus vizualni
popravci koji su bez tog temelja bili preskupi.

**Nije:**
- **nova funkcionalnost** — objava/dijeljenje i MCP dolaze **poslije** ove faze (sekvenca u [ROADMAP.md](./ROADMAP.md));
- **promjena ponašanja** — ako se usput rodi želja za drugačijim tokom, ide u [BACKLOG.md](../records/BACKLOG.md), ne ovdje;
- **sadržajni rad** — M5b (skraćivanje 25 predugih kartica) ostaje u backlogu, nije preduvjet.

---

## 2 · Kriteriji prihvaćanja — gotovo kad korisnik može…

Faza je gotova kad **korisnik**, ne kad je gate zelen:

1. **…proći cijeli tok na telefonu od 320 px** — landing → browse → predmet → sva četiri moda → vježbe →
   profil → editor — **bez horizontalnog scrolla i bez elementa koji strši ili je prekriven.**
2. **…doći tipkovnicom do svake akcije** i u svakom trenutku **vidjeti gdje je fokus**.
3. **…otvoriti bilo koji od 22 predmeta i vlastiti materijal i ne primijetiti da se išta pokvarilo** —
   napredak, boje, KaTeX, slike, tablice i vježbe izgledaju i rade kao prije.
4. **…vidjeti boju stavke na CIJELOJ plohi kartice**, ne samo na rubu
   ([backlog: akcent = cijela kartica](../records/BACKLOG.md)). Lice kartice je danas zasićen indigo
   gradijent, pa akcent mora **zamijeniti** gradijent, a ne se slojevati preko njega.
5. **…na landingu pročitati brojke koje se međusobno slažu** — broj predmeta i broj pitanja moraju
   pokrivati isti doseg ([backlog: broj pitanja pokriva 17 od 22](../records/BACKLOG.md)).

**Tehnički izlazni uvjeti** (nisu zamjena za gornje, nego njihova cijena): nula `!important` u novom
sloju · jedan skup breakpointa · nijedna hex-boja izvan `@theme` · `styles.bundle.css` obrisan.

---

## 3 · Cigle — redom

Svaka cigla je zasebna grana, zasebna provjera, zasebna Leonova potvrda za deploy (pravilo #2/#5).
**Površina je ili cijela nova ili cijela stara** — polovična je jamstvo za rat specifičnosti.

| # | cigla | što nestaje | gotovo kad |
|---|---|---|---|
| **C1** | **Temelj** — Tailwind v4 + `@theme` tokeni, `build:css` proširen, drift-gate, `?v=` bump | ništa | **stranica izgleda bajt-identično**, a paleta/razmaci/breakpointi postoje kao tokeni |
| **C2** | **Landing** | `landing.css` (1.000) | posjetitelj vidi novi landing; kriteriji 1, 2, 5 vrijede za tu stranicu |
| **C3** | **Browse + lekcije** | `browse.css`, `subject-selector.css` (**49 `!important`**), `pages.css` | student dođe do bilo kojeg predmeta i lekcije |
| **C4** | **Četiri moda + vježbe** | `flashcards-`/`quiz-`/`fill-blanks-`/`progress-section.css`, `learn*.css`, `exercises.css`, `blind-map.css`, `math.css` | student uči u sva 4 moda; kriterij 4 vrijedi |
| **C5** | **Profil, auth, pravne, consent** | `profile.css`, `auth.css`, `legal.css`, `consent.css` | korisnik se prijavi, uredi profil, obriše račun |
| **C6** | **Editor** — Studio, admin-editori, „Moji materijali" | `studio.css`, `block-editor.css`, `my-materials.css` | autor napravi materijal od nule i objavi ga |
| **C7** | **Gašenje** | `responsive/*` (6 datoteka, 40 `!important`), `components.css`, `variables.css`, `styles.bundle.css`, mrtva tema | u repozitoriju nema starog CSS-a ni mrtvog koda teme |

**C1 nema vizualnog učinka i to je namjerno.** Ako se u njemu išta promijeni, znači da smo promijenili
dvije stvari odjednom i ne znamo koja je pukla.

**Mrtva tema (C7):** `initTheme()` tvrdo postavlja `dark`, `toggleTheme()` piše `data-theme="light"`,
ali **`[data-theme="light"]` ne postoji nigdje u CSS-u**, a `.theme-toggle` gumb ne postoji u
`index.html` — postoji samo njegov CSS u tri datoteke i JS handler koji ništa ne veže. Briše se, ne seli.

---

## 4 · Tvrde granice (prekršaj = vraćanje cigle)

1. **Tailwind nikad u `data/`.** Gradivo zadržava semantičke klase. Obrazloženje: [ADR-028](../records/DECISIONS.md).
2. **Engine vježbi se ne dira** — sveto pravilo; mijenja se samo CSS oko njega.
3. **`blocks-renderer.js` ostaje jedina sigurnosna granica renderiranja.**
4. **Nijedan gate ne slabi** da bi cigla prošla. Ako `axe` ili responsive suite padnu, pada cigla.
5. **Dinamički građene klase su zabranjene.** Tailwind skenira izvor, ne runtime, pa `'bg-' + boja`
   tiho nestane iz izlaza. Naš markup velikim dijelom nastaje u JS-u — **paleta od 8 boja ostaje na CSS
   varijablama**, nikad na sastavljenim imenima klasa.

---

## 5 · Gateovi koji moraju ostati zeleni

`npm run preflight` (uklj. `check:docs`, css drift, `bump:check`) · `npm run test:responsive`
(**304 testa**, 4 iPhone profila) · `npm run test:authed` · axe **0 serious/critical** na sve četiri
stranice · Lighthouse budžeti. Postupak i pragovi: [workflow/TESTING.md](../workflow/TESTING.md).

**Poznata zamka:** dio Playwright-selektora gađa **klase**. Migracija površine i njeni testovi idu u
**istom** commitu — inače suite postane zelen zato što više ništa ne nalazi.

---

## 6 · Rizici

| rizik | zašto boli | protumjera |
|---|---|---|
| Klase koje postoje samo u JS-stringovima | Tailwind ih ne vidi → stil tiho nestane **samo u produkciji** | granica 5 gore; C1 uvodi provjeru da izlaz sadrži očekivane klase |
| Service Worker servira stari CSS | korisnik vidi polurazbijenu stranicu do reinstalacije | `?v=` bump + `SW_VERSION` po svakoj cigli (pravilo #1) |
| KaTeX i vendorani CSS | nisu naši, ne smiju u čišćenje | ostaju zasebne datoteke, izvan Tailwind-izlaza |
| Editor zadnji = najdulje na dvije estetike | vizualni nesklad tjednima | prihvaćeno svjesno: regresija u editoru košta najviše, pa ide kad je postavka dokazana |
