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
        const map = readAll();
        map[id] = zapis;
        writeAll(map);
        return zapis;
      }).catch((err) => {
        // Sve-ili-ništa: pospremi za sobom pa proslijedi grešku dalje.
        return Promise.all(napisano.map((u) => cache.delete(u).catch(() => {})))
          .then(() => { throw err; });
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

    const meta = doc.createElement('span');
    meta.className = 'offline-meta';

    red.appendChild(gumb);
    red.appendChild(meta);
    host.appendChild(red);

    let radi = false;

    function crtaj() {
      const zapis = get(id);
      gumb.disabled = radi;
      red.setAttribute('data-offline-state', radi ? 'busy' : (zapis ? 'ready' : 'idle'));

      if (radi) {
        ikona.className = 'fas fa-arrow-down offline-icon offline-icon--busy';
        natpis.textContent = tr('offline.working', 'Downloading…');
        meta.textContent = '';
        return;
      }

      if (zapis) {
        ikona.className = 'fas fa-circle-check offline-icon';
        natpis.textContent = tr('offline.remove', 'Remove from device');
        const dijelovi = [tr('offline.ready', 'Available offline')];
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

    const tile = doc.createElement('div');
    tile.className = 'shelf-tile';
    tile.setAttribute('data-shelf-id', id);

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
    tile.appendChild(ukloni);
    return tile;
  }

  // Jedan delegirani slusac za cijelu policu: redci se re-crtaju, pa slusac po gumbu
  // umire sa svojim retkom.
  if (doc && typeof doc.addEventListener === 'function') {
    doc.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('[data-shelf-remove]') : null;
      if (!t) return;
      const id = t.getAttribute('data-shelf-remove');
      const host = t.closest('#shelfList');
      t.disabled = true;
      remove(id).then(() => {
        mountShelf(host);
        toast(tr('offline.removed', 'Removed from device'));
      }).catch(() => { t.disabled = false; });
    });
  }

  window.SokratOffline = {
    supported: supported,
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
    CACHE: CACHE
  };
})(window);
