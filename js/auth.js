// ===== SOKRAT STUDY — AUTH (Supabase, email + lozinka) =====
//
// Backend staza B (ADR-001/008): Auth + cloud sinkronizacija napretka.
// Sadržaj predmeta NE ide kroz ovo — ostaje u data/* fajlovima.
//
// - supabase-js se učitava s CDN-a TEK nakon DOMContentLoaded (ne blokira app);
//   ako CDN ne uspije, cijela funkcionalnost se tiho ugasi — app radi kao prije.
// - Publishable key je javan po dizajnu (RLS u bazi štiti podatke);
//   service key NIKAD ne ide u frontend.
// - Login: email + lozinka (signInWithPassword). Registracija (signUp) traži
//   potvrdu emaila; ime ide u user_metadata.display_name. „Forgot password?"
//   → resetPasswordForEmail → PASSWORD_RECOVERY event → forma za novu lozinku.
//   Google login se može dodati kasnije.

const SOKRAT_AUTH_CONFIG = {
    enabled: true,
    url: 'https://naxjubnedhrbhsuasayu.supabase.co',
    publishableKey: 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L',
    // Supply-chain (risk-sprint #5): TOČAN pin (ne plutajući @2) + SRI hash računat nad
    // stvarnim bajtovima koje jsDelivr servira → mijenja li CDN sadržaj, skripta se ODBIJA
    // (browser SRI enforce). Nadogradnja verzije = svjesna: novi pin + novi hash + re-test.
    cdnSrc: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.8/dist/umd/supabase.min.js',
    cdnIntegrity: 'sha384-Tve8O+C6PBzsIMK/IRCwHbi8fyEzXIlIs6OfVBZHubplwYhaQF/4Mzxqgg+pp/oy'
};

// TEST-ONLY seam (U1): dopusti automatiziranim testovima (Playwright) da preusmjere Supabase
// na STAGING projekt — BEZ diranja produkcijskog defaulta gore. Pravi korisnici NIKAD ne
// postavljaju ovaj global/localStorage ključ → u produkciji je ovo tvrdi no-op (vraća null).
// Izvori (redom): window.__SOKRAT_SUPABASE__ (addInitScript, za auth.setup) →
// localStorage 'sokrat-supabase-override' (preživi Playwright storageState → *.authed.spec).
function _readSupabaseOverride() {
    try {
        if (typeof window !== 'undefined' && window.__SOKRAT_SUPABASE__
            && window.__SOKRAT_SUPABASE__.url && window.__SOKRAT_SUPABASE__.publishableKey) {
            return window.__SOKRAT_SUPABASE__;
        }
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem('sokrat-supabase-override');
            if (raw) {
                const o = JSON.parse(raw);
                if (o && o.url && o.publishableKey) return o;
            }
        }
    } catch (e) { /* bilo kakva greška → nema overridea (prod default) */ }
    return null;
}

const SokratAuth = (function () {
    let client = null;
    let currentUser = null;
    let recoveryMode = false; // true nakon PASSWORD_RECOVERY (link iz reset emaila)
    const changeListeners = [];

    // ---------- Supabase client ----------

    function loadSdk() {
        return new Promise(function (resolve, reject) {
            if (typeof window.supabase !== 'undefined') { resolve(); return; }
            const s = document.createElement('script');
            s.src = SOKRAT_AUTH_CONFIG.cdnSrc;
            // SRI (#5): integrity + crossOrigin='anonymous' obavezni za enforce na cross-origin
            // skripti. jsDelivr šalje CORS (ACAO:*) → radi. Kriv/promijenjen bajt → onerror → auth
            // se tiho ugasi (isti graceful put kao CDN-nedostupan), app nastavlja bez computa.
            if (SOKRAT_AUTH_CONFIG.cdnIntegrity) {
                s.integrity = SOKRAT_AUTH_CONFIG.cdnIntegrity;
                s.crossOrigin = 'anonymous';
            }
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
            const _ovr = _readSupabaseOverride();
            const _url = (_ovr && _ovr.url) || SOKRAT_AUTH_CONFIG.url;
            const _key = (_ovr && _ovr.publishableKey) || SOKRAT_AUTH_CONFIG.publishableKey;
            if (_ovr && typeof console !== 'undefined') console.warn('[auth] TEST override → Supabase = ' + _url);
            client = window.supabase.createClient(_url, _key);
        } catch (e) {
            // Bez mreže / CDN blokiran → app nastavlja raditi bez computa.
            console.warn('[auth] disabled:', e.message);
            return;
        }

        injectModal();
        // Svi ulazi u auth (landing nav + headeri browse/lessons/study):
        // odjavljen → modal za prijavu; prijavljen → Profile stranica.
        document.querySelectorAll('.auth-entry').forEach(function (btn) {
            btn.hidden = false;
            btn.addEventListener('click', function () {
                if (currentUser) {
                    if (typeof navigateTo === 'function') navigateTo('profile');
                } else {
                    openModal();
                }
            });
        });

        // Postojeća sesija + redirecti iz emaila (potvrda registracije, reset
        // lozinke) — detectSessionInUrl je default.
        client.auth.onAuthStateChange(function (event, session) {
            const wasSignedIn = !!currentUser;
            currentUser = session ? session.user : null;
            if (!currentUser) recoveryMode = false;
            if (event === 'PASSWORD_RECOVERY') recoveryMode = true;
            updateNavButton();
            renderModalState();
            changeListeners.forEach(function (fn) {
                try { fn(currentUser, event); } catch (err) { console.warn('[auth] listener:', err); }
            });
            if (event === 'SIGNED_IN' && !wasSignedIn && !recoveryMode) {
                closeModal();
                if (typeof showToast === 'function') showToast(window.t ? t('msg.signedInSync') : 'Signed in — your progress now syncs to the cloud.');
            }
            if (event === 'PASSWORD_RECOVERY') openModal();
            // Ako je Profile otvoren, osvježi ga (ili makni ako se korisnik odjavio).
            if (typeof AppState !== 'undefined' && AppState.nav.page === 'profile') {
                if (currentUser && typeof renderProfilePage === 'function') renderProfilePage();
                if (!currentUser && typeof navigateTo === 'function') navigateTo('landing');
            }
        });
    }

    // ---------- UI ----------

    function getDisplayName() {
        if (!currentUser) return null;
        const meta = currentUser.user_metadata || {};
        const name = (meta.display_name || '').trim();
        return name || null;
    }

    function updateNavButton() {
        const short = currentUser
            ? (getDisplayName() || (currentUser.email || 'Account').split('@')[0]).split(/\s+/)[0]
            : (typeof t === 'function' ? t('auth.signIn') : 'Sign in');
        document.querySelectorAll('.auth-entry-label').forEach(function (label) {
            label.textContent = short;
        });
        document.querySelectorAll('.auth-entry').forEach(function (btn) {
            btn.classList.toggle('is-signed-in', !!currentUser);
            btn.setAttribute('aria-label', currentUser ? 'My profile' : 'Sign in');
        });
    }
    // i18n: na promjenu jezika sučelja ponovno iscrtaj nav-gumb (prevede „Sign in", čuva ime kad je prijavljen)
    window.refreshAuthNav = updateNavButton;

    // i18n helper: t() ako postoji, inače fallback (engleski original).
    function at(key, fb) { return (window.t) ? t(key) : fb; }

    function injectModal() {
        if (document.getElementById('authModal')) return;
        // F2 2D.2c: modal je sada Web Component <sokrat-modal> (S4 primitiv) — komponenta vodi
        // overlay/ESC/backdrop-klik/scroll-lock/fokus/Tab-trap. Ovdje ostaje samo sadržaj kartice.
        // Komponenta je sam dialog (role=dialog + aria-modal iz connectedCallback) → kartica NEMA
        // duplirani role=dialog (izbjegnut ugniježđeni dialog); aria-labelledby ide na komponentu.
        // Zaseban `.auth-modal__backdrop` div je maknut — backdrop je sama komponenta.
        const wrap = document.createElement('sokrat-modal');
        wrap.id = 'authModal';
        wrap.className = 'auth-modal';
        wrap.setAttribute('aria-labelledby', 'authModalTitle');
        wrap.innerHTML =
            '<div class="auth-modal__card">' +
            '  <button type="button" class="auth-modal__close" data-auth-close aria-label="Close">&times;</button>' +

            '  <div id="authSignedOut">' +
            '    <h3 id="authModalTitle" class="auth-modal__title"><i class="fas fa-cloud"></i> ' + at('auth.m.title', 'Sync your progress') + '</h3>' +
            '    <p class="auth-modal__text">' + at('auth.m.text', 'Back up your study progress and continue on any device with a free account.') + '</p>' +
            '    <div class="auth-modal__tabs" role="tablist">' +
            '      <button type="button" class="auth-modal__tab is-active" id="authTabSignIn" role="tab" aria-selected="true">' + at('auth.signIn', 'Sign in') + '</button>' +
            '      <button type="button" class="auth-modal__tab" id="authTabSignUp" role="tab" aria-selected="false">' + at('auth.tab.signUp', 'Create account') + '</button>' +
            '    </div>' +
            '    <form id="authSignInForm" class="auth-modal__form">' +
            '      <input type="email" id="authSignInEmail" class="auth-modal__input" placeholder="you@email.com" required autocomplete="email">' +
            '      <div class="auth-pass-wrap">' +
            '        <input type="password" id="authSignInPassword" class="auth-modal__input" placeholder="' + at('auth.ph.password', 'Password') + '" required autocomplete="current-password">' +
            '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
            '      </div>' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-right-to-bracket"></i><span>' + at('auth.signIn', 'Sign in') + '</span></button>' +
            '      <button type="button" class="auth-modal__link" id="authForgotLink">' + at('auth.forgot', 'Forgot password?') + '</button>' +
            '    </form>' +
            '    <form id="authSignUpForm" class="auth-modal__form" hidden>' +
            '      <input type="text" id="authSignUpName" class="auth-modal__input" placeholder="' + at('auth.ph.name', 'Your name') + '" required maxlength="60" autocomplete="name">' +
            '      <input type="email" id="authSignUpEmail" class="auth-modal__input" placeholder="you@email.com" required autocomplete="email">' +
            '      <div class="auth-pass-wrap">' +
            '        <input type="password" id="authSignUpPassword" class="auth-modal__input" placeholder="' + at('auth.ph.passwordMin', 'Password (min. 8 characters)') + '" required minlength="8" autocomplete="new-password">' +
            '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
            '      </div>' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-user-plus"></i><span>' + at('auth.tab.signUp', 'Create account') + '</span></button>' +
            '    </form>' +
            '    <form id="authForgotForm" class="auth-modal__form" hidden>' +
            '      <p class="auth-modal__text auth-modal__text--tight">' + at('auth.forgot.text', 'Enter your email and we will send you a link to reset your password.') + '</p>' +
            '      <input type="email" id="authForgotEmail" class="auth-modal__input" placeholder="you@email.com" required autocomplete="email">' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-envelope"></i><span>' + at('auth.btn.sendReset', 'Send reset link') + '</span></button>' +
            '      <button type="button" class="auth-modal__link" id="authBackToSignIn">' + at('auth.backToSignIn', '← Back to sign in') + '</button>' +
            '    </form>' +
            '    <p class="auth-modal__status" id="authStatus" hidden></p>' +
            '    <p class="auth-modal__terms">' + at('auth.terms.pre', 'By signing in or creating an account you agree to our ') + '<a href="terms.html">' + at('footer.terms', 'Terms of Use') + '</a>' + at('auth.terms.mid', ' and ') + '<a href="privacy.html">' + at('footer.privacy', 'Privacy Policy') + '</a>.</p>' +
            '  </div>' +

            '  <div id="authRecovery" hidden>' +
            '    <h3 class="auth-modal__title"><i class="fas fa-key"></i> ' + at('auth.recovery.title', 'Set a new password') + '</h3>' +
            '    <p class="auth-modal__text">' + at('auth.recovery.textPre', 'Choose a new password for ') + '<strong id="authRecoveryEmail"></strong>.</p>' +
            '    <form id="authRecoveryForm" class="auth-modal__form">' +
            '      <div class="auth-pass-wrap">' +
            '        <input type="password" id="authRecoveryPassword" class="auth-modal__input" placeholder="' + at('profile.newPassPlaceholder', 'New password (min. 8 characters)') + '" required minlength="8" autocomplete="new-password">' +
            '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
            '      </div>' +
            '      <div class="auth-pass-wrap">' +
            '        <input type="password" id="authRecoveryPassword2" class="auth-modal__input" placeholder="' + at('profile.repeatNewPass', 'Repeat new password') + '" required minlength="8" autocomplete="new-password">' +
            '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
            '      </div>' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-check"></i><span>' + at('profile.saveNewPass', 'Save new password') + '</span></button>' +
            '    </form>' +
            '    <p class="auth-modal__status" id="authRecoveryStatus" hidden></p>' +
            '  </div>' +

            '  <div id="authSignedIn" hidden>' +
            '    <h3 class="auth-modal__title"><i class="fas fa-user-check"></i> ' + at('auth.signedIn.title', 'Signed in') + '</h3>' +
            '    <p class="auth-modal__text">' + at('auth.signedInAs', 'Signed in as ') + '<strong id="authUserEmail"></strong></p>' +
            '    <p class="auth-modal__text auth-modal__sync" id="authSyncInfo">' + at('auth.syncAuto', 'Your progress syncs automatically.') + '</p>' +
            '    <button type="button" id="authSignOutBtn" class="cta-button secondary"><i class="fas fa-sign-out-alt"></i><span>' + at('profile.signOut', 'Sign out') + '</span></button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(wrap);

        wrap.addEventListener('click', function (e) {
            if (e.target.closest('[data-auth-close]')) closeModal();
        });
        document.getElementById('authTabSignIn').addEventListener('click', function () { showPanel('signin'); });
        document.getElementById('authTabSignUp').addEventListener('click', function () { showPanel('signup'); });
        document.getElementById('authForgotLink').addEventListener('click', function () {
            const email = document.getElementById('authSignInEmail').value;
            if (email) document.getElementById('authForgotEmail').value = email;
            showPanel('forgot');
        });
        document.getElementById('authBackToSignIn').addEventListener('click', function () { showPanel('signin'); });
        document.getElementById('authSignInForm').addEventListener('submit', handleSignIn);
        document.getElementById('authSignUpForm').addEventListener('submit', handleSignUp);
        document.getElementById('authForgotForm').addEventListener('submit', handleForgot);
        document.getElementById('authRecoveryForm').addEventListener('submit', handleRecovery);
        document.getElementById('authSignOutBtn').addEventListener('click', signOut);
    }

    // Panel unutar odjavljenog stanja: 'signin' | 'signup' | 'forgot'
    // (forgot je podvarijanta Sign in taba, pa tab ostaje aktivan).
    function showPanel(name) {
        const signIn = document.getElementById('authSignInForm');
        const signUp = document.getElementById('authSignUpForm');
        const forgot = document.getElementById('authForgotForm');
        if (!signIn || !signUp || !forgot) return;
        signIn.hidden = name !== 'signin';
        signUp.hidden = name !== 'signup';
        forgot.hidden = name !== 'forgot';
        const tabIn = document.getElementById('authTabSignIn');
        const tabUp = document.getElementById('authTabSignUp');
        tabIn.classList.toggle('is-active', name !== 'signup');
        tabUp.classList.toggle('is-active', name === 'signup');
        tabIn.setAttribute('aria-selected', name !== 'signup' ? 'true' : 'false');
        tabUp.setAttribute('aria-selected', name === 'signup' ? 'true' : 'false');
        setStatus('');
    }

    function openModal() {
        const m = document.getElementById('authModal');
        if (!m) return;
        renderModalState();
        if (!currentUser) showPanel('signin');
        // <sokrat-modal>: open() vodi prikaz/scroll-lock/fokus. Fallback ako element nije upgrade-an.
        if (typeof m.open === 'function') m.open();
        else { m.setAttribute('aria-hidden', 'false'); m.classList.add('is-open'); }
    }

    function closeModal() {
        const m = document.getElementById('authModal');
        if (!m) return;
        if (typeof m.close === 'function') m.close();
        else { m.setAttribute('aria-hidden', 'true'); m.classList.remove('is-open'); }
    }

    function renderModalState() {
        const out = document.getElementById('authSignedOut');
        const rec = document.getElementById('authRecovery');
        const inn = document.getElementById('authSignedIn');
        if (!out || !rec || !inn) return;
        const showRecovery = !!(recoveryMode && currentUser);
        out.hidden = !!currentUser;
        rec.hidden = !showRecovery;
        inn.hidden = !currentUser || showRecovery;
        if (currentUser) {
            const el = document.getElementById('authUserEmail');
            if (el) el.textContent = currentUser.email || '';
            const rel = document.getElementById('authRecoveryEmail');
            if (rel) rel.textContent = currentUser.email || '';
        }
    }

    function setStatus(msg, isError) {
        const el = document.getElementById('authStatus');
        if (!el) return;
        el.hidden = !msg;
        el.textContent = msg || '';
        el.classList.toggle('is-error', !!isError);
    }

    function setRecoveryStatus(msg, isError) {
        const el = document.getElementById('authRecoveryStatus');
        if (!el) return;
        el.hidden = !msg;
        el.textContent = msg || '';
        el.classList.toggle('is-error', !!isError);
    }

    // ---------- Akcije ----------

    async function handleSignIn(e) {
        e.preventDefault();
        if (!client) return;
        const email = (document.getElementById('authSignInEmail').value || '').trim();
        const password = document.getElementById('authSignInPassword').value;
        if (!email || !password) return;
        setStatus(at('auth.st.signingIn', 'Signing in…'));
        const { error } = await client.auth.signInWithPassword({ email: email, password: password });
        if (error) {
            const msg = /invalid login credentials/i.test(error.message)
                ? at('auth.st.wrongCreds', 'Wrong email or password.')
                : /email not confirmed/i.test(error.message)
                    ? at('auth.st.confirmFirst', 'Please confirm your email first — check your inbox for the confirmation link.')
                    : error.message;
            setStatus(msg, true);
        }
        // Uspjeh: onAuthStateChange zatvara modal i javlja toast.
    }

    async function handleSignUp(e) {
        e.preventDefault();
        if (!client) return;
        const name = (document.getElementById('authSignUpName').value || '').trim();
        const email = (document.getElementById('authSignUpEmail').value || '').trim();
        const password = document.getElementById('authSignUpPassword').value;
        if (!name || !email || !password) return;
        setStatus(at('auth.st.creating', 'Creating account…'));
        const { data, error } = await client.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { display_name: name },
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) {
            setStatus(error.message, true);
            return;
        }
        // Uz uključenu potvrdu emaila Supabase za već registriran email vrati
        // „lažnog" usera bez identities (anti-enumeration) — prepoznaj i uputi na login.
        if (data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
            setStatus(at('auth.st.exists', 'An account with this email already exists — switch to Sign in.'), true);
            return;
        }
        if (data && data.session) return; // potvrda isključena → odmah prijavljen (onAuthStateChange)
        setStatus(at('auth.st.created', 'Account created! Check your inbox and click the confirmation link, then sign in.'));
    }

    async function handleForgot(e) {
        e.preventDefault();
        if (!client) return;
        const email = (document.getElementById('authForgotEmail').value || '').trim();
        if (!email) return;
        setStatus(at('auth.st.sending', 'Sending…'));
        const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname
        });
        if (error) {
            setStatus(error.message, true);
        } else {
            setStatus(at('auth.st.resetSent', 'If an account exists for that email, a reset link is on its way — check your inbox.'));
        }
    }

    async function handleRecovery(e) {
        e.preventDefault();
        if (!client) return;
        const password = document.getElementById('authRecoveryPassword').value;
        const repeat = document.getElementById('authRecoveryPassword2').value;
        if (!password) return;
        if (password !== repeat) {
            setRecoveryStatus(at('msg.passwordsNoMatch', 'Passwords do not match.'), true);
            return;
        }
        setRecoveryStatus(at('msg.saving', 'Saving…'));
        const { error } = await client.auth.updateUser({ password: password });
        if (error) {
            setRecoveryStatus(error.message, true);
            return;
        }
        recoveryMode = false;
        setRecoveryStatus('');
        document.getElementById('authRecoveryPassword').value = '';
        document.getElementById('authRecoveryPassword2').value = '';
        renderModalState();
        if (typeof showToast === 'function') showToast(window.t ? t('msg.passwordUpdatedSignedIn') : 'Password updated — you are signed in.');
    }

    async function signOut() {
        if (!client) return;
        await client.auth.signOut();
        closeModal();
        if (typeof showToast === 'function') showToast(window.t ? t('msg.signedOut') : 'Signed out. Progress stays on this device.');
    }

    // ---------- Javno API (koriste cloud-sync.js i profile.js) ----------

    return {
        init: init,
        getClient: function () { return client; },
        getUser: function () { return currentUser; },
        getDisplayName: getDisplayName,
        onChange: function (fn) { changeListeners.push(fn); },
        openModal: openModal,
        signOut: signOut,
        setSyncInfo: function (text) {
            const el = document.getElementById('authSyncInfo');
            if (el) el.textContent = text;
            const p = document.getElementById('profileSyncStatus');
            if (p) p.textContent = text;
        }
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    SokratAuth.init();
});

// Gumb-oko za prikaz/sakrivanje lozinke — delegirano na document jer se
// password polja renderiraju dinamički (auth modal + profil Change password).
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.auth-pass-toggle');
    if (!btn) return;
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    const icon = btn.querySelector('i');
    if (icon) icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
});
