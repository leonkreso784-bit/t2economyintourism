# Moduli — zašto nam trebaju i zašto ih možemo imati BEZ build-koraka

> **Status: IDEJA, nije projekt.** Zabilježeno 2026-08-25. Ništa se ne dira dok frontend
> redizajn (C4–C7) nije gotov — ovo je **argument i mjera**, ne cigla u redu čekanja.
> Kad sazri → spec u `plan/` i milestone u [ROADMAP.md](../plan/ROADMAP.md); ako ne sazri →
> briše se bez žaljenja.

## Tvrdnja u jednoj rečenici

Cijeli `js/` sloj nema modula — **nula** `import`/`export` u 42 datoteke — pa je ovisnost
između datoteka **nevidljiva, neprovjerljiva i održavana rukom u HTML-u**; a razlog zbog kojeg
to trpimo (*„nemamo build-korak"*) **nije istinit od 2018.**

## ⚠️ Zabluda koja ovo drži otvorenim

Projekt je zaključio *„statički, vanilla JS, BEZ build-koraka"* (CLAUDE.md → Stack) i iz toga
izveo *„dakle sve je globalno"*. **Drugi dio ne slijedi iz prvog.**

`<script type="module">` je nativan u svim preglednicima koje ciljamo. Daje prave `import` /
`export`, `'use strict'` po defaultu, vlastiti doseg i **deklariran graf ovisnosti** — uz
**nula** build-koraka, nula alata, nula `node_modules` u isporuci. Isti statički hosting, isti
Vercel, isti `.js` na disku.

Nismo birali između „modula" i „bez builda". **Birali smo između modula i globala, i toga
nismo bili svjesni.**

---

## Što je izmjereno (2026-08-25, radno stablo `feat/about`)

| mjera | vrijednost |
|---|---|
| datoteka s `import` / `export` | **0** od 42 |
| gole globalne funkcije | **242** |
| različitih `window.X =` izvoza | **92** |
| `typeof X !== 'undefined'` obrana | **132** u **30** datoteka |
| `<script src="js/…">` u HTML-u | **34** (index) · **26** (editor) |
| od toga **ručno duplicirano** u obje stranice | **18** |
| unit testova koji grade lažni `window` | **11** od **16** |
| `tsconfig.include` pokriva | **6** od **42** datoteke (14 %) |
| `check:budget` zaliha do budžeta | **31,6 KiB** |

Brojke se ponavljaju naredbama u §„Kriterij prihvaćanja"; **ne prepisivati ih rukom drugdje**
(ADR-027) — ovaj dokument je jedino mjesto gdje stoje.

---

## Što nas nepostojanje modula konkretno košta

### 1. Ovisnosti se održavaju rukom, u dvije datoteke, bez brane

`index.html` i `editor.html` nose **ručno napisan popis** skripti; **18 ih je u oba**. Nijedan
gate ne provjerava je li popis potpun ni je li redoslijed točan. Doda li cigla novu ovisnost i
zaboravi je upisati na **jednu** od dvije stranice, to se ne vidi u `verify`, ni u `typecheck`,
ni u `test:unit` — **vidi se tek kad korisnik otvori tu stranicu.**

S modulima taj popis **nestaje**: `import` je ovisnost, i preglednik je razrješava sam.

### 2. Redoslijed učitavanja je nepisani ugovor

`js/app-state.js` mora doći prije `js/navigation.js`; `js/i18n.js` prije svega što zove `t()`.
To nigdje ne piše i ništa to ne provjerava — **stoji u redoslijedu redaka u HTML-u.**

Odatle i gotcha zapisana u CLAUDE.md:

> ⚠️ `SokratAuth` / `SokratCatalog` su top-level `const` → referenciraj **GOLO**, NE `window.X`

To **nije neobičnost JavaScripta.** To je posljedica toga što `const` na vrhu klasične skripte
ide u leksički doseg a ne na `window`, dok `function` i `var` idu na `window`. S modulima
razlika prestaje postojati: sve se izvozi eksplicitno, ništa nije na `window`, **pravilo se
briše umjesto da se pamti.**

### 3. **132 obrambena `typeof`-a** su porez na nesigurnost

```js
const M = (typeof window !== 'undefined') ? window.SokratMaterials : null;
if (!M || typeof M.ensureRegistered !== 'function') return false;
```
— [js/navigation.js:32-33](../../js/navigation.js#L32-L33)

Ovaj obrazac postoji **jer se ne zna je li ovisnost učitana**. S `import { ensureRegistered }`
pitanje ne postoji: ili se modul razriješio, ili stranica nije krenula. **132 grane koda koje
danas nitko ne testira jednostavno nestaju.**

### 4. Datoteke rastu jer ih se ne može razbiti

[js/navigation.js](../../js/navigation.js) ima **1580 redaka** i radi rutiranje, mrvice,
pathbar, sidebar, obnovu pozicije i ulaze u materijale. Razbiti je danas znači **dodati još
script tagova u dvije HTML datoteke i pogoditi redoslijed** — dakle povećati problem iz §1 i §2.
Zato ne rastu funkcije nego datoteke.

S modulima je razbijanje `export` / `import` i ništa više.

### 5. Testovi rekonstruiraju preglednik umjesto da uvezu kod

**11 od 16** unit testova radi ovo:

```js
const code = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'card-limits.js'), 'utf8');
const win = {};
new Function('window', code)(win);
const L = win.SokratCardLimits;
```
— [tests/unit/card-limits.test.js:22-25](../../tests/unit/card-limits.test.js#L22-L25)

Test **ne uvozi modul nego ga eval-a u lažni `window`**. Posljedica: testirati se realno može
samo ono što nema ovisnosti. **A to točno objašnjava koji su moduli netestirani** — `auth`,
`cloud-sync`, `content-loader`, `navigation`, `progress`: svi stateful, svi s ovisnostima.

> **Ovo je najskuplja stavka na popisu.** Ne košta nas eleganciju nego **pokrivenost testovima
> na najrizičnijem kodu.** [js/cloud-sync.js:57](../../js/cloud-sync.js#L57) spaja korisnikov
> napredak i **nema nijedan test.**

### 6. `typecheck` ne može narasti

`tsconfig.include` pokriva **6 od 42** datoteke. Širiti ga danas znači tipizirati kod koji
komunicira preko `window` i golih globala — tsc ondje ne vidi graf, pa treba `types/globals.d.ts`
kao **ručno održavanu kopiju istine**. S modulima tsc čita `import` i zaključuje sam.
**Moduli su preduvjet da typecheck uopće ima kamo rasti.**

### 7. Posjetitelj plaća kod koji nikad ne otvori

`check:budget` mjeri **36 skripti · 168,4 KiB mrežom · zaliha 31,6 KiB**. Sve se učitava
**odmah**, jer klasična skripta nema odgodu — nema `import()`.

Izmjereno, ovo landing **ne treba** pri prvom crtanju:

| datoteka | gzip |
|---|---|
| `js/my-materials.js` | 14 046 B |
| `js/exercises.js` | 10 281 B |
| `js/exercises-core.js` | 6 963 B |
| `js/profile.js` | 6 880 B |
| `js/blind-map.js` | 4 279 B |
| `js/cloud-sync.js` | 2 971 B |
| `js/acc-kernel.js` | 1 964 B |
| **ukupno** | **47 384 B ≈ 46 KiB** |

**46 KiB naprema 31,6 KiB zalihe** — dinamički `import()` bi zalihu **više nego udvostručio**,
bez ijednog obrisanog retka. Danas ta poluga ne postoji.

---

## Zašto ovo NE traži build-korak — i ne dira `bump`

Jedini stvarni prigovor je cache-busting: `import`-i žive u JS-u, a
[`bump`](../../scripts/bump-version.js) prepisuje `?v=` **samo u `*.html` i `manifest.json`**.
Da specifikatori odu u JS, bump bi morao prepisivati i JS — **to bi bila regresija arhitekture
(ADR-017), ne nuspojava.**

**Rješava se import mapom.** Mapa stoji u HTML-u, dakle točno ondje gdje bump već piše:

```html
<script type="importmap">
{ "imports": {
    "@/app-state.js": "/js/app-state.js?v=20260825062257",
    "@/i18n.js":      "/js/i18n.js?v=20260825062257"
} }
</script>
<script type="module" src="/js/init.js?v=20260825062257"></script>
```

Moduli tada uvoze **golim imenom** (`import { t } from '@/i18n.js'`), token nikad ne ulazi u
JS, a `bump` i `bump:check` rade **nepromijenjeni**.

### Dvije stvari koje NISU provjerene — ne pretpostavljati ih

1. **Prag preglednika.** `type="module"` je star (Safari 11+, 2017), ali **import mape traže
   Safari/iOS 16.4+** (ožujak 2023). Projekt **nema `browserslist`** — dakle nema deklariranu
   podršku pa se ni ne može reći da je prag ispunjen. Playwright vrti iOS 17 profil
   ([playwright.config.js:15](../../playwright.config.js#L15)), što je iznad praga, ali **jedan
   testni profil nije politika podrške.** Prije spec-a: ili zapisati `browserslist`, ili
   svjesno odlučiti da je iOS 16.4 pod.
2. **Service Worker.** Ponaša li se [`sw.js`](../../sw.js) (stale-while-revalidate za assete)
   jednako prema `type="module"` zahtjevima — **izmjeriti, ne pretpostaviti.**

---

## Cijena — pošteno

| trošak | težina | napomena |
|---|---|---|
| **34+26 script tagova → 1 ulaz + import mapa** | srednja | mehanički, ali dira obje HTML stranice |
| **242 gole funkcije dobivaju `export`** | **velika** | najveći dio posla; datoteka po datoteka |
| **Novi vodopad zahtjeva** | mala | mapa je plosnata; `modulepreload` za vrući put |
| **SW ponašanje + prag preglednika** | **nepoznata** | dvije neprovjerene stvari (gore) |
| **`types/globals.d.ts` postaje suvišan** | negativna | **manje** koda za održavati |
| **11 testova gubi shim** | negativna | postaju `import`, **kraći i jači** |

⚠️ **Ovo se NE radi u jednom potezu.** Mora ići datoteka po datoteka, s `verify` + `test:unit`
+ `test:responsive` zelenim na svakom koraku — inače je to prepisivanje 14 649 redaka bez
mreže ispod. Redoslijed koji se sam nameće: **listovi prvo** (`utils`, `math`, `card-limits`,
`blocks-renderer` — već su IIFE i nemaju ovisnosti), **`navigation` i `init` zadnji.**

## Što ovo NE mijenja

- **Bez build-koraka. Bez frameworka.** `.js` na disku je `.js` koji preglednik izvršava.
- **`data/` ostaje netaknut.** Gradivo nije kod (ADR-018), vježbe ostaju `codeScripts` (BUG-012).
- **`bump` i ADR-017** rade nepromijenjeni — token ostaje u HTML-u.
- **`publish_document`, RLS, Edge Functions** — nula dodira. Ovo je klijentski sloj.
- **Nijedna sigurnosna granica se ne pomiče.** `renderContentBlocks()` ostaje jedini put
  ([blocks-renderer.js](../../js/blocks-renderer.js)); mijenja se **kako se uvozi**, ne što radi.

## Kriterij prihvaćanja

> **Gotovo je kad developer može dodati novu `js/` datoteku i koristiti je, a da NE dira
> nijednu `.html` datoteku** — i kad `npm run typecheck` pokriva sve `js/` bez ijednog retka
> u `types/globals.d.ts`.

Mjerljivi pratitelji, svaki s naredbom koja ga vraća:

| pratitelj | danas | cilj | naredba |
|---|---|---|---|
| obrambeni `typeof` | 132 | ~0 | `grep -ro "typeof .* [!=]== *'undefined'" js/ \| wc -l` |
| ručno dupliciranih script-redaka | 18 | 0 | `comm -12` nad popisima iz obje `.html` |
| testova sa `new Function('window')` | 11 | 0 | `grep -l "new Function('window'" tests/unit/ \| wc -l` |
| zaliha `check:budget` | 31,6 KiB | 75+ KiB | `npm run check:budget` |

## Kada

**Ne sada.** Frontend redizajn (C4–C7) dira `index.html` i cijeli CSS sloj; seoba na module
dira **istu** datoteku. Raditi oboje istovremeno znači spajati dva velika zahvata u istom
markupu.

**Prirodno mjesto je odmah NAKON C7**, prije MCP-a (ADR-030) — jer MCP traži da
`js/card-limits.js` bude **treći čitatelj jedne politike, nikad treća kopija**, a to je lakše
jamčiti s `import`-om nego s `window`-om.

---

**Povezano:** [DECISIONS.md](../records/DECISIONS.md) — ADR-017 (cache-busting) ·
ADR-027 (znanje u kod) · ADR-028 (Tailwind samo preko CLI-ja — **isti obrazac**: alat da, u
pregledniku ne) · ADR-030 (MCP kao treći čitatelj).
