/* eslint-disable no-console */
// ===== F6 ①/2b — POLJE „TRENUTNA LOZINKA" =====
// Pokreni: node tests/unit/lozinka-polje.test.js  (uključeno u `npm run test:unit`)
//
// ── ZAŠTO POSTOJI ────────────────────────────────────────────────────────────────────────────
// Cigla postoji zbog REDOSLIJEDA: postavka „traži trenutnu lozinku" bez ovog polja srušila bi
// promjenu lozinke SVIMA. Brana zato čuva dvije stvari koje se lako tiho izgube:
//   ① da se `current_password` STVARNO šalje poslužitelju — a ne da samo stoji u formi.
//      ⚠️ To se NE smije mjeriti regexom nad izvorom: polje koje se ne pošalje izgleda
//      identično ispravnom. Zato se `changePassword()` ovdje STVARNO IZVRŠAVA u `vm` sandboxu
//      s lažnim DOM-om i lažnim `SokratAuth`, pa se gleda objekt koji je došao do `updateUser`.
//   ② da polje NE dobije korisnik koji lozinku nema (Google) — inače mu zatvorimo jedini put
//      do lozinke, što je isti razred kvara koji cigla sprječava.
//
// ⚠️ IZMJERENO PRIJE KODA (21.09., zato test izgleda ovako):
//   • zakucani `supabase-js@2.110.8` `current_password` ne spominje NIJEDNOM, ali `updateUser`
//     cijeli objekt atributa šalje kao tijelo → ime polja je jedino što vrijedi;
//   • `identities`/`app_metadata.providers` NE razlikuju račun bez lozinke od onoga s njom
//     (oba `["email"]`), pa je ovo provjera „je li ovo e-mail put", a ne „ima li hash".
//
// Živi WIRE (da tijelo PUT-a stvarno nosi polje) mjeri `tests/profile-jezik.authed.spec.js` ③
// protiv STAGINGA. Ovaj test namjerno NE traži tajne — inače bi jedina brana cigle bila ona
// koja se bez `.env` tiho preskoči.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const PROFIL = fs.readFileSync(path.join(KORIJEN, 'js', 'profile.js'), 'utf8');
const I18N = fs.readFileSync(path.join(KORIJEN, 'js', 'i18n.js'), 'utf8');

let pao = 0;
let dotaknuto = 0;
const tvrdi = (uvjet, ime, detalj) => {
    dotaknuto++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  → ' + JSON.stringify(detalj) : '')); }
};

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Sandbox: `js/profile.js` je skripta za preglednik i čita globale kojih ovdje nema. `Proxy` s
// `has: () => true` čini da nepoznat identifikator bude `undefined` umjesto `ReferenceError`-a,
// pa se datoteka učita cijela, a mi podmećemo samo ono što mjerimo.
// ─────────────────────────────────────────────────────────────────────────────────────────────
function ucitajProfil(podmetni) {
    const stvarno = Object.assign({ console }, podmetni);
    const ctx = vm.createContext(new Proxy(stvarno, {
        has: () => true,
        get: (cilj, k) => {
            if (k === Symbol.unscopables) return undefined;
            if (k in cilj) return cilj[k];
            // ⚠️ `has: () => true` proguta i UGRAĐENE globale (`Array`, `JSON`…) — bez ovog
            // povratka na stvarni realm `Array.isArray` u profile.js puca. `isArray` radi i
            // preko realma (provjera je na oznaci objekta, ne na identitetu konstruktora).
            return globalThis[k];
        },
        set: (cilj, k, v) => { cilj[k] = v; return true; },
    }));
    vm.runInContext(PROFIL, ctx, { filename: 'profile.js' });
    return stvarno;
}

/** Najmanji lažni DOM: samo elementi koje `changePassword()` traži po id-u. */
function lazniDom(polja) {
    const el = {};
    Object.keys(polja).forEach((id) => {
        el[id] = {
            id, value: polja[id], hidden: false, type: 'password', textContent: '',
            classList: { add() {}, remove() {} }, focus() {},
        };
    });
    return { getElementById: (id) => el[id] || null, querySelectorAll: () => [], addEventListener() {}, _el: el };
}

/** Pusti `changePassword()` s podmetnutim poljima; vrati što je došlo do `updateUser`. */
async function stoSalje(polja) {
    let primljeno = null;
    let pozvan = 0;
    // `profileChangePassForm` postoji uvijek — uspjeh ga zatvara.
    const document = lazniDom(Object.assign({ profileChangePassForm: '' }, polja));
    const g = ucitajProfil({
        document,
        window: {},
        SokratAuth: {
            getClient: () => ({ auth: { updateUser: async (a) => { pozvan++; primljeno = a; return { error: null }; } } }),
            authError: (e) => String(e && e.message),
        },
        showToast: () => {},
    });
    await g.changePassword({ preventDefault() {} });
    return { primljeno, pozvan, document };
}

(async () => {
    console.log('\nF6 ①/2b — polje „Trenutna lozinka"');

    // ── ① imaLozinku: IZVRŠENA, ne pročitana ─────────────────────────────────────────────────
    console.log('\n① tko smije dobiti polje (funkcija se poziva)');
    const { imaLozinku } = ucitajProfil({ window: {}, document: lazniDom({}) });
    tvrdi(typeof imaLozinku === 'function', 'imaLozinku postoji');
    [
        ['e-mail račun', { identities: [{ provider: 'email' }] }, true],
        ['samo Google', { identities: [{ provider: 'google' }] }, false],
        ['Google + e-mail (povezani)', { identities: [{ provider: 'google' }, { provider: 'email' }] }, true],
        ['bez identities, providers=email', { app_metadata: { providers: ['email'] } }, true],
        ['bez identities, providers=google', { app_metadata: { providers: ['google'] } }, false],
        ['bez identities, provider=email', { app_metadata: { provider: 'email' } }, true],
        ['prazan objekt', {}, false],
        ['null', null, false],
    ].forEach(([ime, user, ocekivano]) => {
        tvrdi(imaLozinku(user) === ocekivano, '   ' + ime + ' → ' + ocekivano);
    });

    // ── ② changePassword STVARNO šalje current_password ──────────────────────────────────────
    console.log('\n② što stigne do updateUser (poziva se prava funkcija)');
    const sTrenutnom = await stoSalje({
        profileCurrentPassword: 'stara-lozinka-123',
        profileNewPassword: 'nova-lozinka-456',
        profileNewPassword2: 'nova-lozinka-456',
        profilePassStatus: '',
    });
    tvrdi(sTrenutnom.pozvan === 1, 'updateUser je stvarno pozvan (inače tvrdnje ispod mjere prazno)',
        { pozvan: sTrenutnom.pozvan });
    tvrdi(!!sTrenutnom.primljeno && sTrenutnom.primljeno.password === 'nova-lozinka-456',
        'nova lozinka ide u `password`', sTrenutnom.primljeno);
    tvrdi(!!sTrenutnom.primljeno && sTrenutnom.primljeno.current_password === 'stara-lozinka-123',
        'TRENUTNA lozinka ide u `current_password` (bez toga postavka ruši promjenu)', sTrenutnom.primljeno);
    tvrdi(sTrenutnom.document._el.profileCurrentPassword.value === '',
        'polje se nakon uspjeha isprazni (lozinka ne ostaje u DOM-u)');

    // Korisnik bez lozinke (Google): polja NEMA → `current_password` se ne smije poslati ni
    // prazan, inače bi mu poslužitelj s uključenom postavkom odbio i ono što danas smije.
    const bezPolja = await stoSalje({
        profileNewPassword: 'nova-lozinka-456',
        profileNewPassword2: 'nova-lozinka-456',
        profilePassStatus: '',
    });
    tvrdi(bezPolja.pozvan === 1 && bezPolja.primljeno.password === 'nova-lozinka-456',
        'korisnik bez polja i dalje mijenja lozinku', bezPolja.primljeno);
    tvrdi(!!bezPolja.primljeno && !('current_password' in bezPolja.primljeno),
        '…i `current_password` se NE šalje ni kao prazan string', bezPolja.primljeno);

    // ── ③ markup: redoslijed i autocomplete ──────────────────────────────────────────────────
    console.log('\n③ oblik polja u formi');
    const iTrenutna = PROFIL.indexOf('id="profileCurrentPassword"');
    const iNova = PROFIL.indexOf('id="profileNewPassword"');
    tvrdi(iTrenutna !== -1, 'polje `profileCurrentPassword` postoji u formi');
    tvrdi(iTrenutna !== -1 && iNova !== -1 && iTrenutna < iNova, 'stoji PRIJE nove lozinke', { iTrenutna, iNova });
    const blok = PROFIL.slice(Math.max(0, iTrenutna - 200), iTrenutna + 220);
    tvrdi(/autocomplete="current-password"/.test(blok),
        'ima `autocomplete="current-password"` (inače upravitelj lozinki nudi NOVU)');
    tvrdi(!/minlength=/.test(blok), 'NEMA `minlength` — zatečena lozinka smije biti kraća od današnjeg praga');
    tvrdi(/imaLozinku\(user\)/.test(PROFIL), 'polje je uvjetovano `imaLozinku(user)`, ne crta se svima');

    // ── ④ oba jezika, nabrojana IZ IZVORA ────────────────────────────────────────────────────
    // `check:i18n` gleda POSTOJI li ključ, ne ima li oba jezika — s obrisanim `hr:` ostaje
    // zelen (dokazano u ①/3). Zato se popis ne piše rukom nego čita iz same forme.
    console.log('\n④ prijevodi (popis se nabraja iz forme, ne piše rukom)');
    const kljucevi = new Set();
    for (const m of PROFIL.matchAll(/pt\('(profile\.[a-zA-Z0-9_.]*[Pp]ass[a-zA-Z0-9_.]*)'/g)) kljucevi.add(m[1]);
    tvrdi(kljucevi.size >= 3, 'popis se stvarno napunio iz izvora (ne mjeri se prazan skup)', [...kljucevi]);
    tvrdi(kljucevi.has('profile.currentPassPlaceholder'), 'novi ključ je u tom popisu', [...kljucevi]);
    const bezObaJezika = [...kljucevi].filter((k) => {
        const tijelo = new RegExp("'" + k.replace(/\./g, '\\.') + "':\\s*\\{([^}]*)\\}").exec(I18N);
        return !tijelo || !/\ben:/.test(tijelo[1]) || !/\bhr:/.test(tijelo[1]);
    });
    tvrdi(bezObaJezika.length === 0, 'svaki ključ lozinke ima EN i HR (' + kljucevi.size + ' ključeva)', bezObaJezika);

    // ── ⑤ fokus ne pretpostavlja polje kojeg možda nema ──────────────────────────────────────
    console.log('\n⑤ fokus pri otvaranju forme');
    tvrdi(/getElementById\('profileCurrentPassword'\) \|\| document\.getElementById\('profileNewPassword'\)/
        .test(PROFIL.replace(/\s+/g, ' ')),
    'fokus pada na prvo polje koje forma IMA (Google korisnik „Trenutnu lozinku" nema)');

    console.log('\n  dotaknuto: ' + dotaknuto + ' tvrdnji, palo: ' + pao);
    console.log(pao ? '✗ PALO\n' : '✅ sve prošlo\n');
    process.exit(pao ? 1 : 0);
})().catch((e) => { console.log('✗ test je pukao: ' + e.stack); process.exit(1); });
