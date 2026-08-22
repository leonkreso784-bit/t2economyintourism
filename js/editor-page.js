// ===== SOKRAT STUDY — LJUSKA STRANICE EDITORA (T6) =====
//
// Od T6 editor živi na VLASTITOJ ADRESI (`editor.html`), a ne kao deveta sekcija
// jednostranične aplikacije. Razlog je izmjeren, ne estetski: 244 KiB editorskog koda
// stizalo je SVAKOM posjetitelju — i onome bez računa, koji ga nikad neće otvoriti.
//
// ⚠️ OVA DATOTEKA POSTOJI ZBOG JEDNE STVARI KOJU JE K1 NAMJERNO IZBJEGAO.
// Ruter je editoru uskratio rutu, i obrazloženje i danas stoji u `js/navigation.js`:
// „deep-link na #/admin pokazao bi prazan admin bilo kome tko zna adresu", jer na hladnom
// startu auth-sesija još nije razriješena. Vlastita stranica JEST takva adresa, pa se taj
// problem više ne izbjegava nego RJEŠAVA: dok se identitet ne razriješi, stranica ne
// pokazuje editor nego stanje čekanja, a nerazriješen identitet vodi natrag u aplikaciju.
//
// ⚠️ VLASNIŠTVO SE NE ČITA IZ ADRESE. `?node=` nosi samo ID; ime materijala se dohvaća iz
// baze, gdje ga RLS izda isključivo vlasniku. Da ime stiže URL-om, stranica bi tuđem linku
// vjerovala na riječ i ispisala tuđe ime u vlastito sučelje. Prazan odgovor na taj isti
// upit ujedno je dokaz da materijal nije tvoj — pa je JEDAN upit i identitet i provjera.
//
// ⚠️ NIJE RUTER. Ovdje nema ni traga od K1: stranica ima točno dva stanja (osobni materijal
// i katalog) i oba dolaze iz adrese pri učitavanju. Kad bi ih bilo više, red je proširiti
// ruter u aplikaciji, ne graditi drugi ovdje — dva rutera su dva izvora istine.

(function () {
    'use strict';

    var APP = 'index.html';
    var RUTA_MATERIJALI = APP + '#/materials';
    // Auth se učitava s CDN-a. Ako CDN padne ili je blokiran, `onChange` NIKAD ne okine —
    // a beskonačan vrtuljak je gori od poruke, jer izgleda kao da nešto radi.
    var STRPLJENJE_MS = 12000;

    function byId(id) { return document.getElementById(id); }
    function prevedi(kljuc, rezerva) { return (typeof window.t === 'function') ? window.t(kljuc) : rezerva; }

    // ---------- ŠAVOVI PREMA APLIKACIJI ----------
    // Editorski kod zove `navigateTo`/`goBack` jer je do T6 živio u jednoj stranici s njima.
    // Svi su ti pozivi obranjeni (`typeof … === 'function'`), pa bi stranica radila i bez
    // ovoga — ali „natrag" i „stari editor" ne bi vodili nikamo. Ovo zato nije ljepilo nego
    // PRIJEVOD: unutar dokumenta = zamjena sekcije, izvan njega = prava navigacija.

    // ⚠️ `navigateTo` NIJE BILA NAVIGACIJA NEGO SPOJ: „nacrtaj stranicu" pa „pokaži je"
    // (v. `navigation.js`, slučajevi 'editor' i 'admin' — crtač ide PRVI). Prva izvedba
    // ovog prijevoda uzela je samo drugu polovicu, pa se sekcija palila PRAZNA — dakle
    // točno stanje protiv kojeg čuvar postoji, samo kroz druga vrata. Uhvatila ga je
    // tvrdnja, ne čitanje koda: prijevod koji prenese pola poziva gori je od nijednog,
    // jer pozivatelj misli da je uspio.
    var CRTACI = { editor: 'renderStudioPage', admin: 'renderAdminPage' };

    function pokaziSekciju(ime) {
        var crtac = window[CRTACI[ime]];
        if (typeof crtac === 'function') crtac();
        ['admin', 'editor'].forEach(function (k) {
            var el = byId(k + '-page');
            if (el) el.classList.toggle('active', k === ime);
        });
    }

    window.navigateTo = function (page) {
        if (page === 'editor' || page === 'admin') { pokaziSekciju(page); return; }
        location.href = (page === 'materials') ? RUTA_MATERIJALI : APP;
    };

    window.goBack = function (rezerva) {
        // K2a je „natrag" morao SIMULIRATI jer je devet stranica dijelilo jedan dokument.
        // Ovdje je editor pravi dokument, pa je povijest preglednika stvarna: ako smo došli
        // iz aplikacije, `history.back()` vraća točno ondje odakle se ušlo — uključujući
        // položaj skrola, što nijedna rekonstrukcija ne pogađa.
        var izNase = document.referrer && document.referrer.indexOf(location.origin) === 0;
        if (izNase && history.length > 1) { history.back(); return; }
        location.href = (rezerva === 'profile') ? APP : RUTA_MATERIJALI;
    };

    // ---------- MRVICA ----------
    // Oblik je isti kao u `renderPathbar()` (`.crumb-sep` · `.crumb.crumb-current`), ali je
    // ovo DRUGI dokument: predak više nije gumb koji mijenja stanje nego PRAVA POVEZNICA.
    // Ime ide kroz `textContent`, nikad `innerHTML` — podatak iz baze u markup ulazi jednim
    // putem i taj put ne poznaje HTML (isti razred kao BUG-025).
    function nacrtajMrvicu(ime) {
        var host = byId('crumbs');
        if (!host) return;
        host.textContent = '';

        var natrag = document.createElement('a');
        natrag.className = 'crumb';
        natrag.href = RUTA_MATERIJALI;
        natrag.textContent = prevedi('materials.title', 'Moji materijali');
        host.appendChild(natrag);

        if (!ime) return;
        var sep = document.createElement('span');
        sep.className = 'crumb-sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = '›';
        host.appendChild(sep);

        var ovdje = document.createElement('span');
        ovdje.className = 'crumb crumb-current';
        ovdje.setAttribute('aria-current', 'page');
        ovdje.textContent = ime;
        host.appendChild(ovdje);
        host.scrollLeft = host.scrollWidth;
    }

    // ---------- STANJE ČEKANJA / ODBIJANJA ----------
    function poruka(tekst, sPovratkom) {
        var g = byId('edGuard');
        var m = byId('edGuardMsg');
        // Gumb natrag u drugom redu trake: u aplikaciji ga vezuje initTopbar() iz
        // navigation.js, koji ovdje namjerno ne postoji (v. popis skripti u editor.html).
        var natrag = byId('pathbarBack');
        if (natrag) natrag.addEventListener('click', function () { window.goBack('materials'); });

        var b = byId('edGuardBack');
        if (m) m.textContent = tekst;
        if (b) b.hidden = !sPovratkom;
        if (g) g.hidden = false;
    }

    function sakrijCuvara() {
        var g = byId('edGuard');
        if (g) g.hidden = true;
    }

    function odbij(kljuc, rezerva) {
        poruka(prevedi(kljuc, rezerva), true);
    }

    // ---------- ULAZ ----------
    function nodeIdIzAdrese() {
        try { return new URLSearchParams(location.search).get('node') || ''; }
        catch (e) { return ''; }
    }

    /** Ime materijala IZ BAZE (v. bilješku na vrhu). Prazan odgovor = nije tvoj. */
    async function imeMaterijala(client, id) {
        var res = await client.from('nodes').select('name').eq('id', id).is('deleted_at', null).maybeSingle();
        if (res.error) throw res.error;
        return res.data ? (res.data.name || '') : null;
    }

    async function otvoriOsobni(client, id) {
        var ime;
        try {
            ime = await imeMaterijala(client, id);
        } catch (e) {
            odbij('editor.loadFail', 'Materijal se nije mogao učitati.');
            return;
        }
        if (ime === null) { odbij('editor.notYours', 'Ovaj materijal nije dostupan.'); return; }
        sakrijCuvara();
        nacrtajMrvicu(ime);
        if (window.SokratStudio && typeof SokratStudio.openNode === 'function') SokratStudio.openNode(id, ime);
    }

    async function otvoriKatalog() {
        // Katalog smije uređivati SAMO admin. `refresh()` pita bazu (`is_admin` RPC), ne
        // pamti odgovor iz sesije — a i da laže, RLS ne bi pustio nijedan upis.
        var jesam = false;
        if (window.SokratAdmin && typeof SokratAdmin.refresh === 'function') jesam = await SokratAdmin.refresh();
        if (!jesam) { odbij('editor.adminOnly', 'Uređivanje kataloga je dostupno samo administratoru.'); return; }
        sakrijCuvara();
        nacrtajMrvicu(prevedi('admin.openStudio', 'Studio editor'));
        pokaziSekciju('editor');
    }

    var razrijeseno = false;

    async function razrijesi(user) {
        if (razrijeseno) return;
        razrijeseno = true;
        var client = (typeof SokratAuth !== 'undefined' && typeof SokratAuth.getClient === 'function')
            ? SokratAuth.getClient() : null;
        if (!user || !client) { odbij('editor.signInFirst', 'Za uređivanje se treba prijaviti.'); return; }
        var id = nodeIdIzAdrese();
        if (id) await otvoriOsobni(client, id);
        else await otvoriKatalog();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var b = byId('edGuardBack');
        if (b) b.addEventListener('click', function () { location.href = RUTA_MATERIJALI; });

        if (typeof SokratAuth === 'undefined' || typeof SokratAuth.onChange !== 'function') {
            odbij('editor.signInFirst', 'Za uređivanje se treba prijaviti.');
            return;
        }
        // ⚠️ `onChange` okine i kad sesije NEMA (supabase javlja `INITIAL_SESSION` s `null`),
        // pa se odbijanje ne oslanja na istek strpljenja — istek je mreža ispod mreže.
        SokratAuth.onChange(function (user) { razrijesi(user); });
        setTimeout(function () {
            if (!razrijeseno) { razrijeseno = true; odbij('editor.noAuth', 'Prijava trenutno nije dostupna.'); }
        }, STRPLJENJE_MS);
    });
})();
