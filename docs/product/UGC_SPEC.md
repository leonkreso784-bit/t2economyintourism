# Osobni materijal — definicija proizvoda

> **Ovo je definicija, ne plan.** Opisuje **što korisnik mora moći**, s kriterijima prihvaćanja.
> Redoslijed izvedbe, cigle i statusi žive u `docs/plan/`, a kronologija u [records/](../records/HISTORY.md).
>
> Postoji jer je jednom bilo moguće proglasiti fazu ispunjenom dok korisnik ne može napraviti
> nijednu karticu — svi su gate-ovi bili zeleni, a proizvod nije radio. Zato ovdje **nijedan
> kriterij ne glasi „test je zelen"**.
>
> Odluke: [ADR-024](../records/DECISIONS.md) (zaseban otok) · [ADR-025](../records/DECISIONS.md) (doseg) ·
> [ADR-026](../records/DECISIONS.md) (rječnik, mobilno) · granice: [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)

---

## 1 · Što je osobni materijal

Prijavljen korisnik slaže **vlastito ugniježđeno stablo** i u njemu gradi gradivo za sebe:
kartice, kviz, dopune i learn. **Privatno** — vidi ga samo on, ne objavljuje se na javni katalog.

Korisnik je **bilo tko** — student bilo kojeg fakulteta, srednjoškolac, samouk. Ništa u modelu
ne pretpostavlja instituciju, smjer ni godinu.

### Rječnik (obvezujuć za sučelje)

| u bazi | hrvatski | engleski | radnje |
|---|---|---|---|
| `kind: 'folder'` | **polica** *(ž. rod)* | folder | stvori · preimenuj · premjesti · obriši |
| `kind: 'study'` | **materijal** | material | **stvori** · **uredi** |

**Polica drži materijale.** Zato ne „mapa" ni „direktorij" — one opisuju datotečni sustav.
Engleski namjerno ostaje `folder`: metafora se lokalizira, konvencija ne.

„**Gradivo**" je rezervirano za **javni katalog** — ono što objavljujemo mi.

---

## 2 · Kriteriji prihvaćanja

Mogućnost je gotova kad korisnik može učiniti sljedeće **rukom**, bez pomoći autora:

1. **Napravim materijal od nule** — na praznoj polici stvorim materijal i u njemu složim
   **karticu, pitanje kviza i dopunu**, bez da išta prije toga postoji.
2. **Učim iz njega** — kartice, kviz, dopune i learn, **istim ekranima** kojima učim iz kataloga.
3. **Napredak se pamti** — rezultati iz vlastitog materijala žive u istom profilu i istoj
   statistici kao oni iz kataloga, i sinkroniziraju se među uređajima.
4. **Bojim ga** — promijenim boju sekcije i vidim je na blokovima i karticama; na pojedinom
   bloku ili kartici je mogu **pregaziti**.
5. **Sučelje mi ne laže** — ne nudi i ne spominje ništa što ne postoji (vježbe, „generiraj AI-em").

---

## 3 · Ugovor boja

Boja ima **dvije uloge**, i one žive u različitim prostorima. Miješanje tih uloga je uzrok
zbrke koju ovaj ugovor zatvara.

| uloga | nositelj | prostor | kako se crta |
|---|---|---|---|
| **tekst** (prednji plan) | `run.color` | **9 kuriranih tokena** | izravna boja slova |
| **akcent** | sekcija · blok · kartica | **slobodni `#rrggbb`** | rub + tinta (`color-mix`, niska zasićenost) |

**Nasljeđivanje:** sekcija → blok → kartica. **Odsutna vrijednost znači *naslijedi*, ne *bez boje*.**

**Zašto akcent smije biti slobodan hex, a tekst ne:** akcent se crta kao rub i tinta niske
zasićenosti, pa je **bilo koji hex čitljiv na bilo kojoj pozadini**. Boja teksta je kontrastno
kritična i slobodan izbor bi lomio čitljivost bez ikakve mogućnosti provjere.

**Sigurnosni uvjet:** prikazivač emitira boju **samo nakon provjere** `^#[0-9a-fA-F]{6}$` —
inače je izostavi. Isti obrazac kojim već emitira širinu slike (validiran broj, uz test protiv
injekcije), jer je `js/blocks-renderer.js` sigurnosna granica.

---

## 4 · Ne-ciljevi

| stavka | zašto ne |
|---|---|
| **Vježbe** | vježba je **kôd** (`generate()`), a UGC ne autorira kôd. Tražit će vlastito rješenje i vlastiti spec; **u sučelju se ništa ne obećava** (ADR-025) |
| **Dijeljenje / objava** | ostaje privatno; model se projektira tako da se dijeljenje doda bez migracije. Zapisana cijena: slike su vezane na vlasnički prefiks, pa ih primatelj ne bi vidio |
| **MCP / autorstvo preko AI-a** | dolazi **poslije**: cijev koja piše kartice u model u kojem se one još ne mogu ni autorirati ni učiti gradi se prema nedovršenom spremniku (ADR-026) |
| **Mobilni editor na dodir** | mobilno autorstvo ide preko korisnikovog AI-a; računalo nosi „brutalan" editor (ADR-026) |
| **Miješanje s javnim katalogom** | bez kopiranja, bez veze na original, bez zajedničkih redaka (ADR-024) |

---

## 5 · Granice koje ova mogućnost ne smije pomaknuti

- **Javni katalog (danas 24 predmeta) i studentski vrući put ostaju nedirnuti.**
- **Svaki upis ide kroz `SECURITY DEFINER` RPC s provjerom vlasništva** (`owner_id = auth.uid()`).
  `anon` nema ništa; `authenticated` ima samo `SELECT`.
- **`js/blocks-renderer.js` ostaje jedini prikazivač** i jedina točka koja odlučuje što se ispisuje.
- **Audit je append-only** — `node_content_versions` se ne briše.
