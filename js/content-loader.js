// ===== SOKRAT STUDY — CONTENT LOADER (lazy loading) =====
//
// Učitava sadržaj predmeta TEK kad zatreba (otvaranje lekcije / study), umjesto da se
// svih ~19 data-*.js učita na startu (~777 KB). Catalog (data/catalog.js) je izvor
// istine za to KOJE datoteke predmet treba (subject.content.scripts).
//
// Ovo je ujedno "šav" prema backendu (Blok B): kad dođe Supabase, loadSubjectContent()
// samo zamijeni injekciju <script> s fetch('/api/subject/...'). Ostatak app-a se NE mijenja.
//
// ⚠ CACHE: data/* su pod immutable cacheom (vercel.json). Pri izmjeni BILO KOJEG
// data/* sadržaja bumpaj CONTENT_VERSION — inače preglednik servira stari cache.

const CONTENT_VERSION = '20260684';

// subjectId -> true (sadržaj učitan) ; subjectId -> Promise (učitavanje u tijeku)
const _contentLoaded = {};
const _contentLoading = {};

// ── BLOK B (read-path): čitaj sadržaj iz Supabasea (public-read), s FALLBACKOM na datoteke. ──
// Dok je false → 100% staro ponašanje (samo datoteke). Flipne se na true TEK kad je
// `supabase/schema.sql` pokrenut u dashboardu I `node scripts/migrate-content.js` napunio
// tablicu `subject_content`. Datoteke ostaju izvor istine + fallback (ako baza padne/prazna).
const CONTENT_FROM_SUPABASE = true;

// Pričekaj da supabase-js klijent bude spreman (CDN se učita async nakon DOMContentLoaded).
function _supabaseClientWhenReady(timeoutMs) {
    return new Promise((resolve) => {
        const t0 = Date.now();
        (function poll() {
            const c = (typeof SokratAuth !== 'undefined' && SokratAuth.getClient) ? SokratAuth.getClient() : null;
            if (c) { resolve(c); return; }
            if (Date.now() - t0 > timeoutMs) { resolve(null); return; }
            setTimeout(poll, 100);
        })();
    });
}

// Pokušaj učitati sadržaj predmeta iz baze → postavi window[var_name] = payload.
// Vrati true ako je uspjelo (red(ovi) nađeni), inače false (→ pozivatelj pada na datoteke).
function _loadSubjectFromSupabase(subjectId) {
    if (!CONTENT_FROM_SUPABASE) return Promise.resolve(false);
    return _supabaseClientWhenReady(2500).then((client) => {
        if (!client) return false;
        return client.from('subject_content').select('var_name,payload').eq('subject_id', subjectId)
            .then(({ data, error }) => {
                if (error || !Array.isArray(data) || !data.length) return false;
                data.forEach((row) => { if (row && row.var_name) window[row.var_name] = row.payload; });
                return true;
            });
    }).catch(() => false); // bilo kakva greška → fallback na datoteke
}

// Je li skripta s ovom putanjom već u dokumentu (statički <script> tag ILI ranije injektirana)?
// Dedup po PUTANJI (bez ?v=) — zato je loader bezopasan i dok statički tagovi još postoje.
function _scriptAlreadyPresent(src) {
    const path = String(src).split('?')[0];
    return Array.from(document.scripts).some((sc) => {
        const scPath = (sc.getAttribute('src') || '').split('?')[0];
        return scPath === path;
    });
}

// Učitaj jednu skriptu (jednom). Ako je već prisutna, odmah resolve.
function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        if (_scriptAlreadyPresent(src)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src + (src.indexOf('?') === -1 ? ('?v=' + CONTENT_VERSION) : '');
        s.async = false; // očuvaj redoslijed izvođenja kad ih ima više
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Content load failed: ' + src));
        document.head.appendChild(s);
    });
}

// Učitaj SAV sadržaj predmeta (sve content.scripts), redom. Keširano + dedup po predmetu.
function loadSubjectContent(subjectId) {
    if (_contentLoaded[subjectId]) return Promise.resolve();
    if (_contentLoading[subjectId]) return _contentLoading[subjectId];

    const subject = (typeof SokratCatalog !== 'undefined') ? SokratCatalog.getSubject(subjectId) : null;
    const scripts = (subject && subject.content && Array.isArray(subject.content.scripts))
        ? subject.content.scripts : [];

    // Prvo proba baza (Blok B); ako vrati false (flag off / prazno / greška) → datoteke.
    const p = _loadSubjectFromSupabase(subjectId).then((fromDb) => {
        if (fromDb) return; // sadržaj postavljen na window iz baze
        // FALLBACK: datoteke (stari put). Sekvencijalno — redoslijed je bitan
        // (npr. final poslije m1+m2; exercises poslije final).
        let chain = Promise.resolve();
        scripts.forEach((src) => { chain = chain.then(() => loadScriptOnce(src)); });
        return chain;
    }).then(() => {
        _contentLoaded[subjectId] = true;
        delete _contentLoading[subjectId];
    }).catch((err) => {
        delete _contentLoading[subjectId];
        throw err;
    });

    _contentLoading[subjectId] = p;
    return p;
}

// Je li sadržaj predmeta već učitan? (za uvjete / testove)
function isSubjectContentLoaded(subjectId) {
    return !!_contentLoaded[subjectId];
}

if (typeof window !== 'undefined') {
    window.CONTENT_VERSION = CONTENT_VERSION;
    window.loadSubjectContent = loadSubjectContent;
    window.loadScriptOnce = loadScriptOnce;
    window.isSubjectContentLoaded = isSubjectContentLoaded;
}
