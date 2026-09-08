# KARTICE NA TELEFONU — Tinder-kadar (F1/12 · F1/13) — ⏸️ PARKIRANO

**Status:** ⏸️ **PARKIRANO 2026-09-08** (Leon: *„makni sve ovo što smo za kartice napravili, arhiviraj,
nije bitno iskreno … kartice ostaju kakve jesu i ovo što smo sada radili možemo arhivirati da u neko
drugo vrijeme dovršimo"*). **Ovo NIJE ispunjen plan** — to je poglavlje koje je svjesno prekinuto
uz rad koji stoji na grani i čeka.

> **Zašto je prekinuto:** poglavlje je pojelo šest sesija i devet popravaka, a zadnji nalaz (skrol
> naličja na iPhoneu) tražio je redizajn, ne zakrpu. Leon je presudio da to ne vrijedi sad — frontend
> profila i vlastitog sadržaja nose više.

---

## 1 · Gdje je kod

| | |
|---|---|
| **grana** | `feat/tinder-kadar`, vrh **`9b7272c`** (pushana) |
| **preview** | `studymaster-git-feat-tinder-kadar-leon-kresos-projects.vercel.app` |
| **produkcija** | **`c53c28c` — NIŠTA od ovoga nije na njoj** |
| pomoćna grana | `fix/kadar-nalicje` — A/B prekidači `?bez=pany,perspektive,transformacije,overflowauto` (sonda za iPhone) |

⚠️ **Na istoj grani parkirana su i dva popravka koja NISU dio poglavlja o karticama:**
**BUG-046** (pilula kategorije — 11 od 20 boja gradiva padalo je AA, najgori 3,31) i **BUG-045**
(Service Worker nikad nije spremao runtime-assete). Oba su gotova i s branama; oba čekaju na grani.
Kad se bude odlučivalo o produkciji, to su dvije stavke koje s karticama nemaju veze.

## 2 · Što je izvedeno i izmjereno

**F1/12 (Tinder-kadar) ⓪–⑨** i **F1/13 (palac lista, gumbi sude)**. Kartica je ekran, ✓ / ✕ pod
palcem, red ← ✕ ✓ →, izbornik kraja špila, gesta odvojena od suda, tablica `AKCIJE` kao izvor.
Puni tijek svake cigle (mjere, hipoteze, odbačene hipoteze) je u
[PROGRESS.md](../records/PROGRESS.md) i [CHANGELOG.md](../records/CHANGELOG.md) pod datumima
**2026-09-06 do 2026-09-08**; nalazi i odluke u [BACKLOG.md](../records/BACKLOG.md).

**Zadnje stanje (⑨, 08.09.):** kartica na dodiru **više nije skroler** — `overflow: visible`, ljuska
`min-height` umjesto `height`, mreža `1fr` umjesto `minmax(0, 1fr)`, tijelo otključano (⑦ povučen),
red ← ✕ ✓ → ljepljiv, izbornik kraja špila vezan za vidljivi pojas. Izmjereno na 393×852 s karticom
od 3357 znakova: kartica 578 → 1495 px, dokument 852 → 1769 (skrola 917), skroler u kartici nula na
obje osi, red nepomičan na 725–789 px kroz cijeli skrol. Kratka kartica: dokument 852 = točno ekran.

**⑨ NIJE prošao Leonov uređaj** — parkirano je prije te presude. Sve tvrdnje o njemu su iz
headless-motora i sonde, ne s iPhonea.

## 3 · Pravila koja NADŽIVLJAVAJU poglavlje

Ovo je jedini dio koji se ne smije izgubiti — svako je plaćeno mjerenjem:

1. **Isti element ne može biti i okomiti skroler i vodoravna gesta.** Preglednik na skroleru zaključa
   os na početku geste i drži je do podizanja prsta; naš JS istovremeno sudi po prevazi. Dva suca,
   jedna gesta. Rješenje je razdvajanje — ili gesta ide s elementa, ili skrol.
2. **CSS sam upali drugu os.** Čim jedna os prestane biti `visible`, druga s `visible` padne na
   `auto`. Naličje je tako bilo vodoravni skroler bez ijednog piksela za skrolati — os koju nitko
   nije napisao i koja se u izvoru ne vidi.
3. **`min-height: auto` ≠ `min-height: 0`.** Nula skida pod, ali gasi i automatski minimum — element
   se onda smije stisnuti ispod sadržaja, a pod `overflow: hidden` je taj višak nevidljiv i nedosežan.
4. **Brisanje pravila nije gašenje pravila.** `overflow-y: auto` stoji i u osnovnom pravilu kartice,
   pa se sve vraćalo na `auto / auto` dok se `visible` nije napisao izričito. Sonda je to uhvatila.
5. **Test skrola koji mjeri samo na DNU ne dokazuje ništa** — ondje je i neljepljiv red na ekranu,
   jer je zadnji element stranice. Mjeri se vrh, sredina i dno.
6. **`touch-action` se čita kroz lanac do PRVOG skrolera.** Dok su lica bila skroleri, pravilo na
   kartici nije značilo ništa; bez skrolera se čita cijeli lanac i gesta je robusnija.
7. **`incomplete` u axe-u nije prolaz** (BUG-046): brana je sudila samo po `violations`, pa je
   nedovoljan kontrast na produkciji bio nevidljiv jer ga je axe prijavljivao kao „nisam siguran".
8. **Presuda pripada uređaju.** Pet popravaka skrola bile su hipoteze na motorima koji kvar ne
   reproduciraju. Prvi koji je pomogao izmjeren je Leonovim iPhoneom kroz `?bez=` prekidače.

## 4 · Što je ostalo ako se poglavlje otvori

| stavka | stanje |
|---|---|
| **⑨ na Leonovom iPhoneu** | neizmjereno — prvo to, prije ijednog novog popravka |
| **F1/14 tutorial** pri prvom ulasku u kartice (poseban za telefon, poseban za komp) | nije počet; `AKCIJE` u `js/flashcards.js` je izvor istine za korake |
| **F1/15 zvjezdica** → špil „Označene", četvrta radnja u izborniku kraja špila | nije počet; dira isti red gumba |
| **miješanje / ispočetka USRED špila** | otvoreno pitanje proizvoda — danas se do toga dolazi tek nakon zadnje kartice (56. sud). Veže se uz F1/15 |
| skrol naličja kao *skroler* (ne kao rast stranice) | **odbačeno mjerenjem** — v. pravilo 1 |

**Kako se nastavlja:** `git checkout feat/tinder-kadar` → `npm run bump` → brane su
`tests/unit/flashcard-kadar.test.js` (73), `tests/unit/flashcard-swipe.test.js` (166),
`tests/flashcard-swipe.spec.js` (41 na četiri iPhone profila), `tests/phone.spec.js` (12).
