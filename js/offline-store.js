/* =====================================================================
 * SokratOffline — što je skinuto na uređaj  ·  cigla P1 (faza POLICA)
 * =====================================================================
 * Landing od C2 obećava „Radi offline". Do P1 je to vrijedilo samo za predmet
 * koji si već otvorio, i to DO SLJEDEĆEG DEPLOYA: `sw.js` u `activate` briše
 * svaki keš koji se ne zove `sokrat-cache-<SW_VERSION>`, a token se bumpa sa
 * svakim deployom — pa keširano gradivo promaši dvaput (obrisan keš I drugi
 * ključ, jer URL nosi `?v=CONTENT_VERSION`).
 *
 * ── ZAŠTO JE IME KEŠA BEZ VERZIJE ────────────────────────────────────
 * `sokrat-offline` NIJE stilski izbor. Brisač u `activate` gađa prefiks
 * `sokrat-cache-`, pa neverzionirano ime preživi deploy SAMO PO SEBI — dakle
 * P1 ne mora dirati `sw.js` ni jednim retkom (SW je najskuplja stvar za
 * pogriješiti: loš SW zaključa stranicu u polju).
 * Cijena je obrnuta i zato ovdje stoji: takav keš NE ZASTARIJEVA SAM. Zato uz
 * svaki predmet pamtimo `v` (CONTENT_VERSION s kojim je skinut) — P3 na temelju
 * toga odlučuje što s neslaganjem. Bez tog zapisa bi P3 morao pogađati.
 *
 * ── P3: ZAŠTO SE ZASTARJELOST VIDI, A NE POPRAVLJA SAMA ──────────────
 * `sw.js` poslije deploya posluži staru kopiju SAMO kad mreže nema (network-first
 * na `?v=`-neslaganje). Online korisnik dakle uvijek dobije ispravno — ali onaj
 * koji uči u zrakoplovu uči STARU verziju, i to mora znati. Zato `isStale()`
 * postoji i zato pločica nosi vidljivo stanje.
 * ⚠️ Osvježavanje je NA DODIR, nikad automatsko: tiho ponovno skidanje trošilo bi
 * tuđi podatkovni promet bez pitanja, a mobilni podaci nisu naši da ih trošimo.
 *
 * ── ZAŠTO SVE-ILI-NIŠTA ──────────────────────────────────────────────
 * Predmet s vježbama nije samo JSON: `content.codeScripts` nosi `generate()`
 * funkcije i lib (BUG-012 — one ne prežive serializaciju, pa nikad ne idu u
 * bazu ni u JSON). Polovično skinut predmet je GORI od neskinutog: obeća
 * offline, pa u zrakoplovnom načinu padne na dijelu koji fali. Zato promašaj
 * bilo koje datoteke poništava cijelo skidanje (rollback), a manifest se piše
 * TEK kad su sve na uređaju.
 *
 * Klasična skripta (bez modula): window.SokratOffline.
 * ===================================================================== */
'use strict';

(function (window) {
  const CACHE = 'sokrat-offline';        // BEZ verzije — v. zaglavlje
  const LS_KEY = 'sokrat-offline-v1';    // manifest: što je na uređaju

  const doc = window.document;

  // Skidanje traži Cache Storage; on ne postoji u nesigurnom kontekstu ni u
  // starijim preglednicima. Tada modul ne laže nego se ne nudi (UI se ne montira).
  const supported = (typeof window.caches !== 'undefined' && !!window.caches);

  function version() {
    return String(window.CONTENT_VERSION || '');
  }

  function tr(key, fallback) {
    if (typeof window.t === 'function') {
      const v = window.t(key);
      if (v && v !== key) return v;
    }
    return fallback;
  }

  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }

  // ── MANIFEST ────────────────────────────────────────────────────────
  // localStorage, ne keš: pitanje „što je skinuto" mora imati odgovor SINKRONO
  // (UI se crta prije nego bilo koji `await` prođe), a Cache Storage je async.
  // Keš je istina o BAJTOVIMA, manifest je istina o NAMJERI — i zato se pri
  // uklanjanju briše manifest ZADNJI (v. remove()).
  function readAll() {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      const obj = raw ? JSON.parse(raw) : null;
      return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
    } catch (e) { return {}; }
  }

  function writeAll(map) {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch (e) { /* pun disk → tiho */ }
  }

  function get(subjectId) {
    const e = readAll()[String(subjectId)];
    return e && typeof e === 'object' ? e : null;
  }

  function list() {
    const map = readAll();
    return Object.keys(map).map((k) => map[k]).filter((e) => e && e.id);
  }

  // ── ŠTO SE SKIDA ────────────────────────────────────────────────────
  // Isti izvor istine koji čita `content-loader.js`: study iz `data/json/<id>/<var>.json`
  // (jedinstvena imena iz `content.resolve`), kod iz `content.codeScripts`.
  // Predmet koji NIJE `dataFormat: 'json'` pada na pune `content.scripts` — danas
  // ih nema (svih 24 su json), ali pravilo ne smije ovisiti o tome da tako ostane.
  function plan(subjectId) {
    const id = String(subjectId);
    const subject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(id) : null;
    const c = (subject && subject.content) || {};
    const ver = version();
    const tok = ver ? ('?v=' + ver) : '';
    const urls = [];

    if (c.dataFormat === 'json') {
      const vars = Array.from(new Set(Object.values(c.resolve || {})));
      vars.forEach((v) => urls.push('data/json/' + id + '/' + v + '.json' + tok));
    } else if (Array.isArray(c.scripts)) {
      c.scripts.forEach((src) => urls.push(src + tok));
    }
    if (Array.isArray(c.codeScripts)) c.codeScripts.forEach((src) => urls.push(src + tok));

    return urls;
  }

  // ── KOLIKO ZAUZIMA ──────────────────────────────────────────────────
  // Mjeri se PRIJE skidanja (kriterij P1), pa se broj mora dati bez skidanja:
  // HEAD po datoteci → `content-length`. HEAD nije GET, pa ga `sw.js` propušta
  // ravno na mrežu (izlazi na `req.method !== 'GET'`) — mjerimo dakle bajtove
  // KOJE ĆE KORISNIK PLATITI, a to je isti broj koji poslije stoji uz predmet
  // (GET vraća isto zaglavlje). Jedna definicija u oba stanja.
  const _estCache = {};

  function estimate(subjectId) {
    const id = String(subjectId);
    if (_estCache[id]) return _estCache[id];
    const urls = plan(id);
    if (!urls.length) return Promise.resolve(null);

    const p = Promise.all(urls.map((u) => window.fetch(u, { method: 'HEAD' }).then((res) => {
      if (!res || !res.ok) throw new Error('HEAD ' + (res && res.status) + ' @ ' + u);
      const len = parseInt(res.headers.get('content-length') || '', 10);
      return isFinite(len) ? len : 0;
    }))).then((sizes) => sizes.reduce((a, b) => a + b, 0));

    // Neuspjeh (offline, 404) se NE kešira — inače bi jedan let bez mreže trajno
    // zaključao prikaz na „nepoznato".
    _estCache[id] = p.catch((err) => { delete _estCache[id]; throw err; });
    return _estCache[id];
  }

  // Je li skinuto zastarjelo — zapis je nastao s DRUGIM CONTENT_VERSION-om.
  // Oprez u oba smjera: bez `v` (stariji zapis) ili bez tekuće verzije NE tvrdimo
  // ništa. Lažno „zastarjelo" tjera korisnika da bez potrebe potroši promet, a to
  // je gore od šutnje.
  function isStale(zapis) {
    const sad = version();
    return !!(zapis && zapis.v && sad && String(zapis.v) !== sad);
  }

  // Adrese koje su STVARNO upisane (manifest = činjenica). Stariji zapisi nemaju
  // `urls` — za njih je plan jedina raspoloživa pretpostavka, i to je u redu jer su
  // nastali s tada važećim tokenom.
  function upisaneAdrese(id) {
    const zapis = get(id);
    return (zapis && Array.isArray(zapis.urls) && zapis.urls.length) ? zapis.urls : plan(id);
  }

  function ocistiStare(cache, id) {
    const stare = upisaneAdrese(id);
    if (!stare.length) return Promise.resolve();
    return Promise.all(stare.map((u) => cache.delete(u).catch(() => {}))).then(() => {});
  }

  /**
   * Uz GRADIVO treba i KOD kojim se ono uči.
   *
   * ⚠️ Do učitavanja po ruti (`js/loader.js`) ovo se dogadjalo samo od sebe: sve su skripte
   * stajale u `index.html`, pa ih je prvi posjet provukao kroz Service Worker. Sada stižu
   * tek s otvorenom lekcijom — a predmet se skida s POPISA LEKCIJA, dakle korak PRIJE toga.
   * Bez ovoga bi skinut predmet u zrakoplovnom načinu otvorio praznu ljusku.
   *
   * NE ulazi u `plan()` i NE upisuje se u `urls`: te adrese briše `remove(predmet)`, a
   * skripte aplikacije su ZAJEDNIČKE — uklanjanje jednog predmeta ne smije ubiti offline
   * za ostale. Zagrijavanje je best-effort i namjerno ne utječe na ishod skidanja.
   */
  function zagrijNacineUcenja(id) {
    const L = window.SokratLoad;
    if (!L || typeof L.zagrij !== 'function') return Promise.resolve();
    const s = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(id) : null;
    const f = (s && s.features) || {};
    const imena = ['study'];
    if (f.blindMap) imena.push('blind-map');
    if (f.exercises) imena.push('exercises');
    // ⚠️ BUG-045: vraća se PROMISE i `download()` ga ČEKA prije nego napiše „ready". Do popravka
    // je poziv bio fire-and-forget, pa je potvrda „Saved to device" stizala dok su se skripte
    // načina učenja još skidale — korisnik koji odmah uključi zrakoplovni način dobio bi gradivo
    // bez ijednog načina učenja. I dalje best-effort (CDN se preskače, pad ne ruši skidanje).
    return Promise.all(imena.map((ime) => {
      try { return Promise.resolve(L.zagrij(ime)).catch(() => false); } catch (e) { return Promise.resolve(false); }
    }));
  }

  // ── POSLIJE DEPLOYA: NOVI SW = PRAZAN RUNTIME KEŠ ─────────────────────────────
  // `sw.js` u `activate` briše stari `sokrat-cache-*`; polica (`sokrat-offline`) preživi, ali
  // paket načina učenja NE — on živi u runtime kešu. Korisnik koji poslije deploya otvori
  // aplikaciju online (naslovnica) i ode u zrakoplovni način bi opet dobio prazan predmet (BUG-045,
  // drugi put). Zato se pri startu, JEDNOM po verziji, za sve predmete s police ponovno zagrije
  // paket. Biljeg verzije stoji u localStorage: bez njega bi svaki start slao ~100 KB kroz
  // stale-while-revalidate (koji u pozadini uvijek ide na mrežu) — dakle trošio tuđi promet.
  const WARM_KEY = 'sokrat-offline-warm-v';
  function zagrijPoslijeDeploya() {
    try {
      const ver = version();
      if (!ver) return Promise.resolve(false);
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve(false);
      const zapisi = list();
      if (!zapisi.length) return Promise.resolve(false);
      if (window.localStorage.getItem(WARM_KEY) === ver) return Promise.resolve(false);
      return Promise.all(zapisi.map((z) => zagrijNacineUcenja(z.id))).then(() => {
        try { window.localStorage.setItem(WARM_KEY, ver); } catch (e) { /* kvota */ }
        return true;
      });
    } catch (e) { return Promise.resolve(false); }
  }

  // ── SKIDANJE ────────────────────────────────────────────────────────
  function download(subjectId, onProgress) {
    const id = String(subjectId);
    if (!supported) return Promise.reject(new Error('Cache Storage nije dostupan'));

    const urls = plan(id);
    if (!urls.length) return Promise.reject(new Error('nema što skinuti za ' + id));

    const napisano = [];   // za rollback: samo ono što je stvarno ušlo u keš
    let bytes = 0;
    let gotovo = 0;

    return window.caches.open(CACHE).then((cache) => {
      // Ponovno skidanje poslije deploya: stari komplet ima DRUGE adrese (drugi `?v=`),
      // pa bi bez ovog koraka ostao ležati pored novoga. Briše se prije, ne poslije —
      // padne li novo skidanje, korisniku ostaje čist uređaj i jasna poruka.
      let lanac = ocistiStare(cache, id);
      urls.forEach((u) => {
        lanac = lanac.then(() => window.fetch(u).then((res) => {
          if (!res || !res.ok) throw new Error('GET ' + (res && res.status) + ' @ ' + u);
          // `content-length` je PRVI izvor, ali ne jedini: poslužitelj koji odgovara u
          // komadima (chunked) ga izostavi, i tad bi predmet dobio veličinu 0 — dakle
          // brojku koja LAŽE, a ne nedostaje. Rezerva je stvarno tijelo odgovora.
          // ⚠️ Dvije definicije se razlikuju (zaglavlje = prenesenih bajtova, tijelo =
          // raspakiranih). Namjerno: „približno" je bolje od „nula".
          const len = parseInt(res.headers.get('content-length') || '', 10);
          const izmjeri = isFinite(len) && len > 0
            ? Promise.resolve(len)
            : res.clone().blob().then((b) => b.size, () => 0);
          return izmjeri.then((n) => {
            bytes += n;
            return cache.put(u, res.clone());
          }).then(() => {
            napisano.push(u);
            gotovo += 1;
            if (typeof onProgress === 'function') onProgress(gotovo, urls.length);
          });
        }));
      });

      return lanac.then(() => {
        // `urls` se PAMTI, a ne izvodi iz plana pri uklanjanju: plan ovisi o
        // CONTENT_VERSION-u, koji se mijenja svakim deployom. Bez ovog zapisa bi
        // `remove()` poslije deploya brisao po DRUGIM adresama — obrisao bi zapis, a
        // bajtove ostavio na uređaju zauvijek (nedosežne, jer ih više ništa ne imenuje).
        const zapis = { id: id, bytes: bytes, files: urls.length, at: new Date().toISOString(), v: version(), urls: urls };
        // gradivo bez načina učenja je prazna ljuska → „ready" TEK kad je paket zagrijan (BUG-045)
        return zagrijNacineUcenja(id).then(() => {
          const map = readAll();
          map[id] = zapis;
          writeAll(map);
          return zapis;
        });
      }).catch((err) => {
        // Sve-ili-ništa: pospremi za sobom pa proslijedi grešku dalje.
        //
        // ⚠️ Briše se I ZAPIS, ne samo bajtovi. Do P3 ovaj put nije bio dohvatljiv
        // (skidalo se samo kad zapisa nema), pa se nije vidjelo: OSVJEŽAVANJE počne
        // s `ocistiStare()`, dakle stari komplet je već otišao. Ostavi li se zapis,
        // uređaj je prazan a manifest i dalje tvrdi „dostupno offline" — pa predmet
        // padne tek u zrakoplovnom načinu, što je točno kvar zbog kojeg P1 postoji.
        // Nadjeno testom osvježavanja, ne na ekranu.
        return Promise.all(napisano.map((u) => cache.delete(u).catch(() => {})))
          .then(() => {
            const map = readAll();
            delete map[id];
            writeAll(map);
            throw err;
          });
      });
    });
  }

  // ── UKLANJANJE ──────────────────────────────────────────────────────
  // Manifest se briše ZADNJI. Padne li brisanje keša na pola, korisnik i dalje
  // vidi „skinuto" i može pokušati opet; obrnuti redoslijed bi ostavio bajtove
  // na uređaju bez ijednog puta da ih itko ukloni.
  function remove(subjectId) {
    const id = String(subjectId);
    const zapisani = get(id);
    const p = supported
      ? window.caches.open(CACHE).then((cache) => ocistiStare(cache, id))
      : Promise.resolve();

    return p.then(() => {
      const map = readAll();
      delete map[id];
      writeAll(map);
      return zapisani;
    });
  }

  // ── PRIKAZ VELIČINE ─────────────────────────────────────────────────
  // Bez `toLocaleString` s jezikom: broj mora biti isti u testu i na ekranu.
  function human(bytes) {
    const n = Number(bytes);
    if (!isFinite(n) || n <= 0) return '';
    if (n < 1024) return n + ' B';
    const kb = n / 1024;
    if (kb < 1024) return Math.round(kb) + ' KB';
    return (Math.round((kb / 1024) * 10) / 10) + ' MB';
  }

  function datum(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + d.getFullYear() + '.';
  }

  // ── KONTROLA NA STRANICI LEKCIJA ────────────────────────────────────
  // Sav tekst ide kroz `textContent` / `createElement`. To je jače od escapea:
  // opasnost se ne može pojaviti, umjesto da se na nju mora sjetiti (BUG-025).
  function mount(host, subjectId) {
    if (!host) return;
    host.textContent = '';
    if (!supported) return;               // ne nudi ono što uređaj ne može

    const id = String(subjectId);
    const red = doc.createElement('div');
    red.className = 'offline-row';

    const gumb = doc.createElement('button');
    gumb.type = 'button';
    gumb.className = 'offline-btn';

    const ikona = doc.createElement('i');
    ikona.setAttribute('aria-hidden', 'true');

    const natpis = doc.createElement('span');
    gumb.appendChild(ikona);
    gumb.appendChild(natpis);

    // Zaseban gumb, a ne pregaženo značenje glavnoga: „Ukloni" i „Osvježi" su
    // suprotne namjere i ne smiju dijeliti istu metu na dodir.
    const osvjezi = doc.createElement('button');
    osvjezi.type = 'button';
    // Vlastita klasa, ne varijanta `offline-btn`: dvije mete pod istim imenom cine
    // svaki upit dvosmislenim (i testu i citacu ekrana). Izgled dijele kroz CSS.
    osvjezi.className = 'offline-refresh';
    osvjezi.hidden = true;
    const osvIkona = doc.createElement('i');
    osvIkona.className = 'fas fa-rotate offline-icon';
    osvIkona.setAttribute('aria-hidden', 'true');
    const osvNatpis = doc.createElement('span');
    osvNatpis.textContent = tr('offline.refresh', 'Refresh');
    osvjezi.appendChild(osvIkona);
    osvjezi.appendChild(osvNatpis);

    const meta = doc.createElement('span');
    meta.className = 'offline-meta';

    red.appendChild(gumb);
    red.appendChild(osvjezi);
    red.appendChild(meta);
    host.appendChild(red);

    let radi = false;

    function crtaj() {
      const zapis = get(id);
      const staro = isStale(zapis);
      gumb.disabled = radi;
      osvjezi.disabled = radi;
      osvjezi.hidden = radi || !staro;
      red.setAttribute('data-offline-state',
        radi ? 'busy' : (zapis ? (staro ? 'stale' : 'ready') : 'idle'));

      if (radi) {
        ikona.className = 'fas fa-arrow-down offline-icon offline-icon--busy';
        natpis.textContent = tr('offline.working', 'Downloading…');
        meta.textContent = '';
        return;
      }

      if (zapis) {
        ikona.className = staro
          ? 'fas fa-triangle-exclamation offline-icon'
          : 'fas fa-circle-check offline-icon';
        natpis.textContent = tr('offline.remove', 'Remove from device');
        const dijelovi = [staro
          ? tr('offline.stale', 'Outdated version on device')
          : tr('offline.ready', 'Available offline')];
        if (zapis.bytes) dijelovi.push(human(zapis.bytes));
        if (zapis.at) dijelovi.push(datum(zapis.at));
        meta.textContent = dijelovi.join(' · ');
        return;
      }

      ikona.className = 'fas fa-arrow-down offline-icon';
      natpis.textContent = tr('offline.download', 'Download for offline');
      meta.textContent = '';
      // Procjena stiže poslije crtanja i samo dopunjuje — gumb je upotrebljiv i bez nje.
      estimate(id).then((b) => {
        if (get(id) || radi || !b) return;
        meta.textContent = '~' + human(b);
      }).catch(() => { /* bez mreže nema procjene; gumb ostaje */ });
    }

    // Osvježavanje je isto skidanje: `download()` prvo obriše STARE adrese (one iz
    // manifesta), pa se dva kompleta ne mogu nakupiti na uređaju.
    osvjezi.addEventListener('click', () => {
      if (radi || !get(id)) return;
      radi = true; crtaj();
      download(id).then(() => {
        radi = false; crtaj();
        toast(tr('offline.refreshed', 'Updated to the latest version'));
      }).catch(() => {
        radi = false; crtaj();
        toast(tr('offline.failed', 'Download failed — nothing was saved'));
      });
    });

    gumb.addEventListener('click', () => {
      if (radi) return;
      if (get(id)) {
        radi = true; crtaj();
        remove(id).then(() => { radi = false; crtaj(); toast(tr('offline.removed', 'Removed from device')); })
          .catch(() => { radi = false; crtaj(); });
        return;
      }
      radi = true; crtaj();
      download(id).then(() => {
        radi = false; crtaj();
        toast(tr('offline.done', 'Saved to device'));
      }).catch(() => {
        radi = false; crtaj();
        toast(tr('offline.failed', 'Download failed — nothing was saved'));
      });
    });

    crtaj();
  }

  // ── NAPREDAK SKINUTOG PREDMETA ──────────────────────────────────────
  // Cita se ISTI zapis koji pise `js/storage.js` (`storageKey` iz kataloga), a ne
  // vlastita kopija — inace bi polica pokazivala jedan broj, a stranica ucenja drugi.
  // Namjerno se NE racuna postotak: nema iskrenog nazivnika (koliko kartica predmet
  // „ima" ovisi o lekciji i modu), a izmisljen postotak je gori od nijednog.
  function progressOf(subjectId) {
    const subject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(String(subjectId)) : null;
    const kljuc = subject && subject.storageKey;
    if (!kljuc) return null;
    let zapis = null;
    try { zapis = JSON.parse(window.localStorage.getItem(kljuc) || 'null'); } catch (e) { zapis = null; }
    if (!zapis || typeof zapis !== 'object') return null;
    const broj = (v) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);
    const ukupno = broj(zapis.cardsStudied) + broj(zapis.quizzesTaken) + broj(zapis.fillSolved);
    if (!ukupno && !zapis.lastStudy) return null;   // skinut, ali jos nedirnut
    return { ukupno: ukupno, lastStudy: zapis.lastStudy || null };
  }

  // Ikona dolazi iz NASEG kataloga, ali kroz `innerHTML`-ov susjedstvo ipak ne prolazi
  // gola: propusta se samo oblik `fa-<ime>`. Granica se postavlja na ULAZU, ne na
  // pretpostavci o izvoru — BUG-025 se dogodio tocno ondje gdje je izvor izgledao pitomo.
  function sigurnaIkona(ime) {
    return /^fa-[a-z0-9-]+$/.test(String(ime || '')) ? String(ime) : 'fa-book';
  }

  // ── POLICA: skinuti predmeti kao plocice ────────────────────────────
  // Drugi izvor iste police (prvi je vlastito gradivo). Radi i BEZ prijave: skinuto je
  // stvar UREDAJA, ne racuna — pa polica ne smije biti iza „prijavi se ili nista".
  function mountShelf(host) {
    if (!host) return;
    host.textContent = '';
    const zapisi = supported ? list() : [];

    if (!zapisi.length) {
      const prazno = doc.createElement('p');
      prazno.className = 'profile-meta shelf-empty';
      prazno.textContent = tr('shelf.empty', 'Nothing downloaded yet. Open a subject and choose “Download for offline”.');
      host.appendChild(prazno);
      return;
    }

    // Najsvjeze skinuto prvo — polica se cita odozgo, a zadnje skinuto je ono koje
    // korisnik trazi. Stabilno i bez datuma (stari zapisi): `at` fali → na dno.
    zapisi.slice().sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')))
      .forEach((zapis) => host.appendChild(shelfTile(zapis)));
  }

  function shelfTile(zapis) {
    const id = String(zapis.id);
    const subject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(id) : null;

    const staro = isStale(zapis);

    const tile = doc.createElement('div');
    tile.className = 'shelf-tile';
    tile.setAttribute('data-shelf-id', id);
    if (staro) tile.setAttribute('data-shelf-stale', '1');

    const ikona = doc.createElement('i');
    ikona.className = 'fas ' + sigurnaIkona(subject && subject.icon) + ' shelf-tile__icon';
    ikona.setAttribute('aria-hidden', 'true');

    const tijelo = doc.createElement('div');
    tijelo.className = 'shelf-tile__body';

    // Otvaranje je POVEZNICA s pravom adresom (K1) — dijeljiva i otvoriva u novoj kartici.
    const veza = doc.createElement('a');
    veza.className = 'shelf-tile__name';
    veza.href = '#/subject/' + encodeURIComponent(id);
    veza.textContent = (subject && subject.name) || id;

    const meta = doc.createElement('p');
    meta.className = 'shelf-tile__meta';
    const dijelovi = [];
    // Zastarjelost ide PRVA: to je jedino što mijenja ono što korisnik vidi u gradivu.
    if (staro) dijelovi.push(tr('offline.stale', 'Outdated version on device'));
    if (zapis.bytes) dijelovi.push(human(zapis.bytes));
    const nap = progressOf(id);
    if (nap && nap.lastStudy) {
      dijelovi.push(tr('shelf.lastStudy', 'Last studied') + ' ' + datum(nap.lastStudy));
    } else {
      dijelovi.push(tr('shelf.notStarted', 'Not started yet'));
    }
    meta.textContent = dijelovi.join(' · ');

    tijelo.appendChild(veza);
    tijelo.appendChild(meta);

    let osv = null;
    if (staro) {
      osv = doc.createElement('button');
      osv.type = 'button';
      osv.className = 'shelf-tile__refresh';
      osv.setAttribute('data-shelf-refresh', id);
      // Kao i kod uklanjanja: ime kontrole nosi NA ČEMU djeluje — pet „Osvježi"
      // gumba u popisu je za čitač ekrana pet istih kontrola.
      osv.setAttribute('aria-label', tr('offline.refresh', 'Refresh') + ' — ' + ((subject && subject.name) || id));
      const r = doc.createElement('i');
      r.className = 'fas fa-rotate';
      r.setAttribute('aria-hidden', 'true');
      osv.appendChild(r);
    }

    const ukloni = doc.createElement('button');
    ukloni.type = 'button';
    ukloni.className = 'shelf-tile__remove';
    ukloni.setAttribute('data-shelf-remove', id);
    // Ime kontrole mora nositi NA CEMU djeluje: pet „Ukloni" gumba u popisu je za
    // citac ekrana pet istih kontrola.
    ukloni.setAttribute('aria-label', tr('offline.remove', 'Remove from device') + ' — ' + ((subject && subject.name) || id));
    const x = doc.createElement('i');
    x.className = 'fas fa-trash-can';
    x.setAttribute('aria-hidden', 'true');
    ukloni.appendChild(x);

    tile.appendChild(ikona);
    tile.appendChild(tijelo);
    if (osv) tile.appendChild(osv);
    tile.appendChild(ukloni);
    return tile;
  }

  // Jedan delegirani slusac za cijelu policu: redci se re-crtaju, pa slusac po gumbu
  // umire sa svojim retkom.
  if (doc && typeof doc.addEventListener === 'function') {
    doc.addEventListener('click', (e) => {
      const t = e.target && e.target.closest
        ? e.target.closest('[data-shelf-remove], [data-shelf-refresh]')
        : null;
      if (!t) return;
      const osvjezava = t.hasAttribute('data-shelf-refresh');
      const id = t.getAttribute(osvjezava ? 'data-shelf-refresh' : 'data-shelf-remove');
      const host = t.closest('#shelfList');
      t.disabled = true;
      (osvjezava ? download(id) : remove(id)).then(() => {
        mountShelf(host);
        toast(osvjezava
          ? tr('offline.refreshed', 'Updated to the latest version')
          : tr('offline.removed', 'Removed from device'));
      }).catch(() => {
        // Neuspjeh osvježavanja je sve-ili-ništa (download radi rollback): na uređaju
        // ostaje STARI komplet, pa se pločica ne smije prekrižiti nego samo oživjeti.
        t.disabled = false;
        if (osvjezava) toast(tr('offline.failed', 'Download failed — nothing was saved'));
      });
    });
  }

  // BUG-045: poslije deploya zagrij paket načina učenja za sve s police (jednom po verziji).
  if (supported) zagrijPoslijeDeploya();

  window.SokratOffline = {
    supported: supported,
    zagrijPoslijeDeploya: zagrijPoslijeDeploya,
    WARM_KEY: WARM_KEY,
    plan: plan,
    estimate: estimate,
    download: download,
    remove: remove,
    get: get,
    list: list,
    human: human,
    mount: mount,
    mountShelf: mountShelf,
    progressOf: progressOf,
    isStale: isStale,
    CACHE: CACHE
  };
})(window);
