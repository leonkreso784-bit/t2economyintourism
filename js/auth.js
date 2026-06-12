// ===== SOKRAT STUDY — AUTH (Supabase magic-link) =====
//
// Backend staza B (ADR-001/008): Auth + cloud sinkronizacija napretka.
// Sadržaj predmeta NE ide kroz ovo — ostaje u data/* fajlovima.
//
// - supabase-js se učitava s CDN-a TEK nakon DOMContentLoaded (ne blokira app);
//   ako CDN ne uspije, cijela funkcionalnost se tiho ugasi — app radi kao prije.
// - Publishable key je javan po dizajnu (RLS u bazi štiti podatke);
//   service key NIKAD ne ide u frontend.
// - Login: email magic-link (signInWithOtp). Google se može dodati kasnije.

const SOKRAT_AUTH_CONFIG = {
    enabled: true,
    url: 'https://naxjubnedhrbhsuasayu.supabase.co',
    publishableKey: 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L',
    cdnSrc: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
};

const SokratAuth = (function () {
    let client = null;
    let currentUser = null;
    const changeListeners = [];

    // ---------- Supabase client ----------

    function loadSdk() {
        return new Promise(function (resolve, reject) {
            if (typeof window.supabase !== 'undefined') { resolve(); return; }
            const s = document.createElement('script');
            s.src = SOKRAT_AUTH_CONFIG.cdnSrc;
            s.async = true;
            s.onload = resolve;
            s.onerror = function () { reject(new Error('supabase-js CDN load failed')); };
            document.head.appendChild(s);
        });
    }

    async function init() {
        if (!SOKRAT_AUTH_CONFIG.enabled) return;
        try {
            await loadSdk();
            client = window.supabase.createClient(
                SOKRAT_AUTH_CONFIG.url,
                SOKRAT_AUTH_CONFIG.publishableKey
            );
        } catch (e) {
            // Bez mreže / CDN blokiran → app nastavlja raditi bez computa.
            console.warn('[auth] disabled:', e.message);
            return;
        }

        injectModal();
        const btn = document.getElementById('authNavBtn');
        if (btn) {
            btn.hidden = false;
            btn.addEventListener('click', openModal);
        }

        // Postojeća sesija (i magic-link redirect — detectSessionInUrl je default).
        client.auth.onAuthStateChange(function (event, session) {
            currentUser = session ? session.user : null;
            updateNavButton();
            renderModalState();
            changeListeners.forEach(function (fn) {
                try { fn(currentUser, event); } catch (err) { console.warn('[auth] listener:', err); }
            });
        });
    }

    // ---------- UI ----------

    function updateNavButton() {
        const label = document.getElementById('authNavLabel');
        const btn = document.getElementById('authNavBtn');
        if (!label || !btn) return;
        if (currentUser) {
            label.textContent = (currentUser.email || 'Account').split('@')[0];
            btn.classList.add('is-signed-in');
        } else {
            label.textContent = 'Sign in';
            btn.classList.remove('is-signed-in');
        }
    }

    function injectModal() {
        if (document.getElementById('authModal')) return;
        const wrap = document.createElement('div');
        wrap.id = 'authModal';
        wrap.className = 'auth-modal';
        wrap.hidden = true;
        wrap.innerHTML =
            '<div class="auth-modal__backdrop" data-auth-close></div>' +
            '<div class="auth-modal__card" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">' +
            '  <button type="button" class="auth-modal__close" data-auth-close aria-label="Close">&times;</button>' +
            '  <div id="authSignedOut">' +
            '    <h3 id="authModalTitle" class="auth-modal__title"><i class="fas fa-cloud"></i> Sync your progress</h3>' +
            '    <p class="auth-modal__text">Sign in with your email to back up your study progress and continue on any device. No password needed &mdash; we send you a magic link.</p>' +
            '    <form id="authForm" class="auth-modal__form">' +
            '      <input type="email" id="authEmail" class="auth-modal__input" placeholder="you@email.com" required autocomplete="email">' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-paper-plane"></i><span>Send magic link</span></button>' +
            '    </form>' +
            '    <p class="auth-modal__status" id="authStatus" hidden></p>' +
            '  </div>' +
            '  <div id="authSignedIn" hidden>' +
            '    <h3 class="auth-modal__title"><i class="fas fa-user-check"></i> Signed in</h3>' +
            '    <p class="auth-modal__text">Signed in as <strong id="authUserEmail"></strong></p>' +
            '    <p class="auth-modal__text auth-modal__sync" id="authSyncInfo">Your progress syncs automatically.</p>' +
            '    <button type="button" id="authSignOutBtn" class="cta-button secondary"><i class="fas fa-sign-out-alt"></i><span>Sign out</span></button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(wrap);

        wrap.addEventListener('click', function (e) {
            if (e.target.closest('[data-auth-close]')) closeModal();
        });
        document.getElementById('authForm').addEventListener('submit', sendMagicLink);
        document.getElementById('authSignOutBtn').addEventListener('click', signOut);
    }

    function openModal() {
        const m = document.getElementById('authModal');
        if (!m) return;
        renderModalState();
        m.hidden = false;
    }

    function closeModal() {
        const m = document.getElementById('authModal');
        if (m) m.hidden = true;
    }

    function renderModalState() {
        const out = document.getElementById('authSignedOut');
        const inn = document.getElementById('authSignedIn');
        if (!out || !inn) return;
        out.hidden = !!currentUser;
        inn.hidden = !currentUser;
        if (currentUser) {
            const el = document.getElementById('authUserEmail');
            if (el) el.textContent = currentUser.email || '';
        }
    }

    function setStatus(msg, isError) {
        const el = document.getElementById('authStatus');
        if (!el) return;
        el.hidden = !msg;
        el.textContent = msg || '';
        el.classList.toggle('is-error', !!isError);
    }

    // ---------- Akcije ----------

    async function sendMagicLink(e) {
        e.preventDefault();
        if (!client) return;
        const email = (document.getElementById('authEmail').value || '').trim();
        if (!email) return;
        setStatus('Sending…');
        const { error } = await client.auth.signInWithOtp({
            email: email,
            options: { emailRedirectTo: window.location.origin + window.location.pathname }
        });
        if (error) {
            setStatus(error.message, true);
        } else {
            setStatus('Check your inbox — we sent you a sign-in link. You can close this window.');
        }
    }

    async function signOut() {
        if (!client) return;
        await client.auth.signOut();
        closeModal();
        if (typeof showToast === 'function') showToast('Signed out. Progress stays on this device.');
    }

    // ---------- Javno API (koristi cloud-sync.js) ----------

    return {
        init: init,
        getClient: function () { return client; },
        getUser: function () { return currentUser; },
        onChange: function (fn) { changeListeners.push(fn); },
        setSyncInfo: function (text) {
            const el = document.getElementById('authSyncInfo');
            if (el) el.textContent = text;
        }
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    SokratAuth.init();
});
