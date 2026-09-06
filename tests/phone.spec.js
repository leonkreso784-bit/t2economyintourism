// T0 · MJERAČ TELEFONA — odjavljen posjetitelj (faza „TELEFON", spec §9.3 i §9.7).
//
// ── ZAŠTO JE PRVA CIGLA FAZE BRANA, A NE POPRAVAK ────────────────────────────────
// Leon je na iPhoneu 16 zatekao produkciju u stanju koje je opisao kao „apsolutno DNO
// DNA", dok je **svih desetak gateova bilo zeleno**. Nijedan nije lagao — nijedan
// jednostavno nije mjerio telefon kao STRANICU: axe mjeri na 1280 px, `css:diff`
// uspoređuje nas sa samima sobom (ravnomjerno loše stanje mu je savršeno stabilno), a
// K3/K4a mjere KROMO. Popravljati prije nego što se dobije brojka značilo bi popravljati
// naslijepo, pa faza počinje mjerom.
//
// ── OBRNUTA PROVJERA (izmjereno PRIJE nego je napisana ijedna tvrdnja) ───────────
// Mjerač je pušten na **produkciju**, koja kvar dokazano ima. Sve tvrdnje su ondje
// pale, i to na brojkama koje se poklapaju sa zapisom u BUGS.md:
//
//   ①  landing: `a.landing-logo` y=20…52 · `button.nav-cta` („Start studying") y=18…53
//   ②  browse dubina 31 % · lessons 25 % · study 23 % upotrebljive visine
//   ③  `.browse-title › #browseBreadcrumb` = 5 redaka dok susjedni naslov krati
//   ④  landing/lessons/study: NIJEDNA sadržajna kontrola nije dohvatljiva bez skrola
//   ⑤  `h1#browseHeading` odrezan na **34 od 187 px** (18 %) → korisnik vidi „C…"
//
// 19 od 30 ekrana produkcije ima bar jedan kvar. Brana time nije teorijska.
//
// ⚠️ **Brana je i sama bila kriva, tri puta, i to je dio njezine vrijednosti.** Prva mjera
// je bočnu traku (`translateX(100%)`, dakle IZVAN ekrana) brojala kao kromo od 100 %, a
// gumb zatvorenog dijaloga (`visibility:hidden`) kao sadržaj u otoku. Treća je tražila
// sukob samo u flex-RETKU — i zato **nije okinula na produkciji**, gdje su mrvica i
// naslov uloženi u `display:block` spremniku. Sve tri je otkrilo puštanje mjere na stanje
// za koje se ZNA da je pokvareno. *Detektor koji nije obrnuto provjeren mjeri sebe, ne
// stranicu.*
//
// ── ⚠️ OSNOVICA, NE NULA ─────────────────────────────────────────────────────────
// Nalazi ove brane dodijeljeni su ciglama **T1–T5**, pa bi traženje nule držalo cijelu
// suitu crvenom kroz pet cigli — a tad prava regresija u ostalih 400+ testova nestane u
// šumu. Zato vrijedi obrazac `check:palette`: **pada se samo na kvaru kojeg u
// `tests/phone-baseline.json` NEMA.** Spuštanje osnovice je izričita radnja:
//
//     PHONE_BASELINE_UPDATE=1 npx playwright test tests/phone.spec.js --project=iPhone-SE-375
const { test, expect } = require('@playwright/test');
const G = require('./helpers/phone-gate');

test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'iPhone-SE-375',
        'brana sama postavlja tri širine → vrti se jednom, ne po profilu');
});

/** Jedan obilazak puni ovo; sedam tvrdnji ga onda samo čita. Mjerenje je skupo
 *  (4 profila × 10 ekrana ≈ 3 min), pa se ne ponavlja po tvrdnji. */
const NALAZI = {
    otok: [], kromo: [], sukob: [], prviEkran: [], zaglavlje: [],
    dno: [], bocno: [], spremnik: [], namjestaj: [], polja: [], kadar: []
};
let izmjerenoEkrana = 0;

/* ── ⑩ TINDER-KADAR: PRAG I NJEGOVA JEDINA IMENOVANA IZNIMKA (F1/12) ─────────────
   Kriterij cigle (RASPORED §F1/12): kartica ≥ **60 % dostupnog** i ≥ **90 % širine**, a
   stranica u modu kartica **ne skrola**. Prag stoji OVDJE, a ne u mjeraču: `phone-gate.js`
   vraća brojke, sud je u brani (isti rez kao `KROMO_BUDZET_PCT`).

   ⚠️ **POLEGNUT TELEFON JE IMENOVANA IZNIMKA, NE POPUŠTANJE — i to je izmjereno.**
   Na 852 × 393 je `.study-mobile-nav` skrivena (`md:hidden`), pa promjenu načina učenja
   ondje nosi traka tabova `.study-nav` — a ona je U TOKU stranice, dakle **unutar** pojasa
   koji ova tvrdnja zove „dostupnim" (mjeri se od dna FIKSNOG/LJEPLJIVOG kroma). Račun na
   izmjerenom: dostupno 316 px − traka tabova ≈ 68 − razmak sadržaja 8 − traka napretka 20
   − razmak 8 − red gumba 76 = **≈ 136 px za karticu, dakle najviše ≈ 43 %**. Šezdeset posto
   ondje ne postoji ni uz najtanji mogući kromo — tražiti ga značilo bi tražiti od cigle da
   makne jedini preklopnik načina učenja koji polegnut telefon ima.
   Zato polegnuti profil ima **vlastiti prag (35 %)**, dovoljno visok da uhvati regresiju
   (danas je ondje 43 %, prije cigle 83 % uz stranicu koja skrola), a ostala dva kriterija
   — širina i „ne skrola" — vrijede ondje **jednako kao u portretu**.
   Presudu o polegnutom telefonu (je li 43 % dovoljno ili red gumba ondje ide USTRANU)
   donosi Leon na svom uređaju; do tada je ovo mjera, ne dizajn. */
const KADAR_MIN_UDIO = 0.60;
const KADAR_MIN_UDIO_POLEGNUT = 0.35;
const KADAR_MIN_SIRINA = 0.90;

test.beforeAll(async ({ browser }, testInfo) => {
    // ⚠️ `beforeEach`-preskok NE zaustavlja `beforeAll` — bez ove straže bi se cijelo
    // mjerenje (3 širine × 10 ekrana) vrtjelo **četiri puta**, jednom po iPhone profilu,
    // a rezultat bi se svaki put bacio. Straža mora stajati na OBA mjesta.
    if (testInfo.project.name !== 'iPhone-SE-375') return;

    // ⚠️ Port se NE prepisuje ovdje — dolazi iz `playwright.config.js`. Vlastiti kontekst
    // treba jer svaka širina ima i svoju VISINU (kromo se mjeri kao udio ekrana, pa bi
    // zajednička izmišljena visina dala krivi postotak), a `setViewportSize` ne mijenja
    // `deviceScaleFactor`/`isMobile`.
    const baseURL = testInfo.project.use.baseURL;
    const snimka = [];

    for (const e of G.EKRANI) {
        const ctx = await browser.newContext({
            viewport: { width: e.w, height: e.h },
            deviceScaleFactor: 3, isMobile: true, hasTouch: true,
            baseURL
        });
        const page = await ctx.newPage();
        await page.goto('/');
        await G.spreman(page);
        await page.waitForTimeout(800);

        for (const ekran of G.EKRANI_JAVNI) {
            await G.idiNa(page, ekran, e.rub);
            const m = await G.mjeriStranicu(page, e.rub);
            snimka.push({ e, ekran, m, r: await G.mjeriRubove(page, e.rub) });
        }

        // Četiri načina učenja na PRAVOJ lekciji. Leon ih je ocijenio kao „čine se ok" —
        // brana to pretvara u brojku, bez ijedne dodatne cigle.
        await G.idiNa(page, 'study', e.rub);
        snimka.push({
            e, ekran: 'study:home',
            m: await G.mjeriStranicu(page, e.rub), r: await G.mjeriRubove(page, e.rub)
        });
        for (const n of G.NACINI) {
            await G.otvoriNacin(page, n, e.rub);
            snimka.push({
                e, ekran: 'study:' + n,
                m: await G.mjeriStranicu(page, e.rub), r: await G.mjeriRubove(page, e.rub)
            });
        }

        // MREZA-E4: uvjetni tabovi (exercises · blind-map) — na predmetu koji ih IMA,
        // biranom iz kataloga po značajci. Do E4 jedina dva načina učenja bez mjere.
        for (const u of G.NACINI_UVJETNI) {
            await G.idiNa(page, u.ruta, e.rub);
            await G.otvoriNacin(page, u.tab, e.rub);
            snimka.push({
                e, ekran: 'study:' + u.tab,
                m: await G.mjeriStranicu(page, e.rub), r: await G.mjeriRubove(page, e.rub)
            });
        }

        await ctx.close();
    }

    izmjerenoEkrana = snimka.length;
    /** `320px browse:dubina` — jedna oznaka za sve poruke, da se nalaz da naći bez traženja. */
    const gdje = (r) => r.e.w + 'px ' + r.ekran;

    snimka.forEach((r) => {
        const m = r.m;
        m.uOtoku.forEach((x) => NALAZI.otok.push(gdje(r) + ' · ' + x));
        if (m.kromoPct > G.KROMO_BUDZET_PCT) {
            NALAZI.kromo.push(gdje(r) + ' · ' + m.kromoPct + ' % (' + m.nasKromo + ' od '
                + (m.vh - G.OTOK) + ' px) · ' + m.trake.join(' + '));
        }
        m.sudari.forEach((x) => NALAZI.sukob.push(gdje(r) + ' · ' + x));
        if (m.upotrebljivih === 0) {
            NALAZI.prviEkran.push(gdje(r) + ' · kromo ' + m.kromoPx + ' px'
                + (m.bannerPx ? ' + banner ' + m.bannerPx + ' px (' + m.bannerPct + ' %)' : '')
                + ' od ' + m.vh + ' px');
        }
        if (m.kadar) {
            const k = m.kadar;
            const polegnut = r.e.w > r.e.h;
            const minUdio = polegnut ? KADAR_MIN_UDIO_POLEGNUT : KADAR_MIN_UDIO;
            const udio = k.dostupnoH > 0 ? k.karticaH / k.dostupnoH : 0;
            const sirina = k.sigurnaW > 0 ? k.karticaW / k.sigurnaW : 0;
            // ⚠️ Postotak s DECIMALOM, i to nije uljepšavanje: 353 od 393 px je 89,8 %, što
            // zaokruženo daje poruku „90 %, traži se 90 %" — nalaz koji izgleda kao greška brane.
            const pct = (x) => (x * 100).toFixed(1).replace('.', ',');
            if (udio < minUdio) {
                NALAZI.kadar.push(gdje(r) + ' · kartica ' + k.karticaH + ' od ' + k.dostupnoH
                    + ' px dostupnog = ' + pct(udio) + ' %, traži se ' + pct(minUdio)
                    + ' % (kromo do ' + k.kromoDno + ', traka od ' + k.navVrh + ')');
            }
            if (sirina < KADAR_MIN_SIRINA) {
                NALAZI.kadar.push(gdje(r) + ' · kartica ' + k.karticaW + ' od ' + k.sigurnaW
                    + ' px sigurne širine = ' + pct(sirina) + ' %, traži se ' + pct(KADAR_MIN_SIRINA) + ' %');
            }
            if (k.skrola) {
                NALAZI.kadar.push(gdje(r) + ' · stranica u modu kartica SKROLA: dokument '
                    + k.docH + ' px, ekran ' + m.vh + ' px');
            }
        }
        m.namjestaj.forEach((x) => NALAZI.namjestaj.push(gdje(r) + ' · ' + x));
        m.zaglavlja.forEach((x) => NALAZI.zaglavlje.push(gdje(r) + ' · ' + x));
        m.sitnaPolja.forEach((x) => NALAZI.polja.push(gdje(r) + ' · ' + x));
        r.r.dno.forEach((x) => NALAZI.dno.push(gdje(r) + ' · ' + x));
        r.r.bocno.forEach((x) => NALAZI.bocno.push(gdje(r) + ' · ' + x));
        r.r.spremnik.forEach((x) => NALAZI.spremnik.push(gdje(r) + ' · ' + x));
    });

    // ⚠️ Mjerač mora ispisati i ŠTO je izmjerio, ne samo je li pao: kadar je jedina tvrdnja
    // ove brane koja ima ciljni broj, pa se bez ispisa ne vidi ide li stanje gore ili dolje
    // između dvije zelene brane. (Isti razlog kao „doseg" u unit-branama.)
    const kadri = snimka.filter((r) => r.m.kadar).map((r) => {
        const k = r.m.kadar;
        return gdje(r) + ' ' + k.karticaW + '×' + k.karticaH + ' px · '
            + Math.round(k.karticaH / (k.dostupnoH || 1) * 100) + ' % od ' + k.dostupnoH + ' dostupnog · '
            + Math.round(k.karticaW / (k.sigurnaW || 1) * 100) + ' % sigurne širine · dokument ' + k.docH;
    });
    if (kadri.length) console.log('  · kadar (F1/12): ' + kadri.join('\n                   '));

    if (G.spremiOsnovicu('javno', NALAZI)) {
        console.log('⚠️  phone-baseline.json PREPISAN (javno) — provjeri diff prije commita.');
    }
});

/** Padne samo na NOVOM kvaru; riješene poznate ispiše glasno (zastarjela osnovica krije). */
function protivOsnovice(kljuc, poruka) {
    const { novi, rijeseni } = G.usporediSOsnovicom('javno', kljuc, NALAZI[kljuc]);
    if (rijeseni.length) {
        console.log('\n✅ RIJEŠENO (' + kljuc + ', ' + rijeseni.length + ') — spusti osnovicu:\n   '
            + rijeseni.join('\n   ') + '\n');
    }
    expect(novi, poruka).toEqual([]);
}

test('① otok: ništa interaktivno ne stoji u gornjih 59 px', async () => {
    // `viewport-fit=cover` NIJE postavka nego obveza: njime se stranica izričito
    // prijavljuje za crtanje ispod izreza, pa je od tog trenutka svaki nenadoknađeni
    // `env()` regresija. Podloga ondje smije biti; gumb i slovo ne smiju.
    protivOsnovice('otok', 'NOVE kontrole ispod Dynamic Islanda (BUG-031)');
});

test('② kromo: naše trake troše najviše 20 % upotrebljive visine', async () => {
    // Otok se ne broji — uređaj ga uzima svakome i nije naš trošak. Mjeri se koliko od
    // onoga što IMAMO trošimo na trake. Popis poznatih probijanja = radni popis cigle T3.
    protivOsnovice('kromo', 'NOVE trake koje pojedu ekran (cigla T3)');
});

test('③ jedan krati, drugi se lomi: sukob koji je dao naslov „C…"', async () => {
    // Mehanizam BUG-030. Dva ispravna pravila u istom spremniku daju kvar koji nema
    // nijedno od njih: ono što se lomi određuje visinu, ono što krati ne određuje ništa.
    protivOsnovice('sukob', 'NOV susjed pojeden susjedom koji se lomi (BUG-030)');
});

test('④ prvi ekran: bar jedna sadržajna kontrola dohvatljiva bez skrola', async () => {
    // Dohvatljivost, ne postojanje: cookie-banner je `position:fixed` sa
    // `z-index: 2147483000`, pa gumb ispod njega ima savršen pravokutnik i nikakvu
    // upotrebljivost. Zato `elementFromPoint`, kao u K3.
    protivOsnovice('prviEkran', 'NOVI ekrani na kojima se bez skrola ne da ništa napraviti');
});

test('⑧ trajni donji namještaj nije prekriven (cigla T4)', async () => {
    // Tvrdnja ④ ovo NIJE mogla reći: ondje je dovoljna bilo koja dohvatljiva kontrola, pa
    // je stranica na kojoj je cijela donja navigacija pod cookie-trakom prolazila čim je
    // imala neki gumb u sadržaju (`study:quiz`, `study:learn`). Ista traka je istovremeno
    // obarala `study:home`, `study:flashcards` i `study:fill` — jedan uzrok, pet ishoda,
    // i nijedan nije imenovao pravu stvar. Ova tvrdnja imenuje.
    protivOsnovice('namjestaj', 'NOVO prekriven donji namještaj (promjena načina učenja)');
});

test('⑤ zaglavlje razine je čitljivo: jedan redak i nije odrezano', async () => {
    // Dvije mjere iste stvari — „znam li gdje sam?". Preko jednog retka znači da je
    // naziv razine narastao u stupac; odrezan ispod 60 % znači da ga je netko drugi
    // pojeo. Hero-naslov landinga NIJE ovdje: on smije omotati (tipografija, T5).
    protivOsnovice('zaglavlje', 'NOVI naslovi razine koje korisnik ne može pročitati (BUG-030)');
});

test('⑥ donji rub: na dnu skrola ništa se ne krije ispod home-indikatora', async () => {
    // Mjeri se NA DNU jer je samo ondje kvar trajan: dok se skrola, sadržaj kroz pojas
    // prolazi i to je normalno. Ostaje ono što iz njega ne može izaći — fiksni namještaj
    // (cookie-banner, donja traka učenja) i sam kraj dokumenta.
    protivOsnovice('dno', 'NOVE kontrole ispod home-indikatora (BUG-031)');
});

test('⑦ bočni rub: u landscapeu ništa ne stoji ispod izreza sa strane', async () => {
    // U portretu su bočni rubovi 0, pa ova tvrdnja govori o POLEGNUTOM telefonu — jedinoj
    // orijentaciji koju kriterij T1 imenuje, a koju do T1 nije mjerio nitko.
    protivOsnovice('bocno', 'NOVE kontrole ispod bočnog izreza (BUG-031)');
});

test('⑦b spremnik sadržaja poštuje sigurnu zonu i kad u njoj nema gumba', async () => {
    // Razlika između PRAVILA i SLUČAJA. Da se traži samo „nijedna kontrola nije u
    // pojasu", stranica koja slučajno nema gumb uz rub prošla bi bez ijednog pravila o
    // sigurnoj zoni — i kvar bi se vratio čim netko doda gumb. Zato se mjeri i gdje
    // počinje sam spremnik sadržaja.
    protivOsnovice('spremnik', 'NOVI spremnici sadržaja koji ulaze u sigurnu zonu (BUG-031)');
});

test('⑨ dodir ne zumira: nijedno tekstualno polje ispod 16 px (F1/10)', async () => {
    // iOS zumira pri fokusu polja s fontom < 16 px i ne vraća se. Mjeri se IZRAČUNATI font,
    // ne izvor: pravilo koje ga diže mora pogoditi polje kroz kaskadu (specifičnost), a to se
    // vidi samo na stranici. Do F1/10 je pravilo bilo iza njuškanja motora koje nijedan naš
    // motor ne zadovoljava — pa je brana koja bi ga mjerila bila nemoguća, ne samo odsutna.
    protivOsnovice('polja', 'NOVA polja ispod 16 px — iOS na dodir zumira (F1/10)');
});

test('⑩ u modu kartica kartica je EKRAN, a stranica ne skrola (F1/12)', async () => {
    // Tri mjere jedne stvari — „je li kartica kadar?": koliko dostupnog pojasa uzima, koliko
    // širine, i skrola li stranica ispod nje. Nijedna sama ne bi bila dovoljna: kartica preko
    // cijele širine koja je visoka 200 px je traka, a kartica koja ispunjava ekran ali gura
    // stranicu u skrol znači da kadra nema — samo je pomaknut ispod ruba.
    //
    // ⚠️ Obrnuta provjera (2026-09-06, prije ijedne izmjene CSS-a): na stanju `a9e10c1` je ova
    // tvrdnja dala **9 nalaza** na 4 profila — **sva četiri profila skrolaju** (1069 / 1045 /
    // 1081 / 1065 px dokumenta), 393 i 430 su ispod praga udjela (34 % i 30 %), a širinu
    // probijaju 320 (88 %), 393 (89,8 %) i polegnuti (52 %). Detektor koji nije viđen crven
    // mjeri sebe, ne stranicu.
    //
    // ⚠️ Zašto 320 i polegnuti NISU pali na udjelu iako je kartica ondje 200 odn. 280 px: na
    // 320 je dostupno svega 333 px (kartica = 60,1 %, taman iznad praga), a polegnuti nema donju
    // traku pa mu je „dostupno" 337 px uz karticu od 280 (83 %). Oba prolaze udio, a padaju na
    // ono što udio ne vidi — širinu i skrol. Tri mjere, jer nijedna sama ne opisuje kadar.
    protivOsnovice('kadar', 'kartica na telefonu NIJE kadar (F1/12): premala, preuska ili stranica skrola');
});

test('⓪ pokrivenost: mjerač je stvarno obišao sve ekrane i sve širine', async () => {
    // Brana koja tiho preskoči ekran tvrdi nešto o njemu, a nije ga vidjela. Ovo je
    // izravna pouka BUG-017 („tvrdi gate vrijedi samo koliko pokriva") i K3
    // („broj u kriteriju koji nijedan test ne mjeri nije kriterij nego želja").
    const ocekivano = G.EKRANI.length
        * (G.EKRANI_JAVNI.length + 1 + G.NACINI.length + G.NACINI_UVJETNI.length);
    expect(izmjerenoEkrana, 'izmjerenih ekrana').toBe(ocekivano);
});
