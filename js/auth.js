// ===== SOKRAT STUDY — AUTH (Supabase, email + lozinka) =====
//
// Backend staza B (ADR-001/008): Auth + cloud sinkronizacija napretka.
// Sadržaj predmeta NE ide kroz ovo — ostaje u data/* fajlovima.
//
// - supabase-js se učitava s CDN-a TEK nakon DOMContentLoaded (ne blokira app);
//   ako CDN ne uspije, cijela funkcionalnost se tiho ugasi — app radi kao prije.
// - Publishable key je javan po dizajnu (RLS u bazi štiti podatke);
//   service key NIKAD ne ide u frontend.
// - Login: email + lozinka (signInWithPassword) ILI OAuth Google/Facebook (R1, spec RACUN):
//   signInWithOAuth = puni redirect natrag na istu stranicu (detectSessionInUrl odradi
//   izmjenu koda); provider koji u Supabase dashboardu još NIJE uključen vraća grešku
//   → prevedena poruka u statusu, ništa ne puca (kod smije ispred ključeva).
// - Registracija (signUp) traži potvrdu emaila; ime ide u user_metadata.display_name.
//   UPITNIK (R1): tko si + faks/škola (FMTU se prepoznaje) + mail-pristanak žive u
//   user_metadata — bez nove tablice/RLS-a, a brisanjem računa nestaju i oni (GDPR
//   besplatno). OAuth preskače formu → upitnik se traži pri PRVOJ OAuth-prijavi
//   (app_metadata.provider !== 'email' bez questionnaire_done biljega), i preskočiv je;
//   email-korisnici se POSLIJE prijave nikad ne gnjave (postojeći računi netaknuti).
// - „Forgot password?" → resetPasswordForEmail → PASSWORD_RECOVERY → forma za novu lozinku.

const SOKRAT_AUTH_CONFIG = {
    enabled: true,
    url: 'https://naxjubnedhrbhsuasayu.supabase.co',
    publishableKey: 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L',
    // Supply-chain (risk-sprint #5): TOČAN pin (ne plutajući @2) + SRI hash računat nad
    // stvarnim bajtovima koje jsDelivr servira → mijenja li CDN sadržaj, skripta se ODBIJA
    // (browser SRI enforce). Nadogradnja verzije = svjesna: novi pin + novi hash + re-test.
    //
    // ⚠️ 2026-08-14: putanja je promijenjena `supabase.min.js` → `supabase.js`, i to NIJE kozmetika.
    // `dist/umd/supabase.min.js` **ne postoji u npm paketu** — jsDelivr ga generira VLASTITIM
    // minifierom na zahtjev (dokaz: v1 file-listing paketa nema tu datoteku, a „minificirana"
    // inačica je 208196 B, dakle 292 B VEĆA od objavljene 207904 B). Time je SRI dotad bio pinan
    // na IZVEDEN artefakt tuđeg build-koraka, a ne na izdavačeve bajtove: dan kad jsDelivr
    // promijeni minifier, hash pukne → `onerror` → auth se TIHO ugasi (v. loadSdk niže), tj.
    // prijava umre bez poruke i bez ijednog crvenog gatea. Sad pokazujemo na objavljenu datoteku
    // čiji sha256 je provjeren protiv jsDelivrovog file-listinga → hash se mijenja SAMO s verzijom.
    cdnSrc: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.8/dist/umd/supabase.js',
    cdnIntegrity: 'sha384-M65KxMm/JqBppck6onbmAgPVMBHrmPCf1L17Q+71EcvI9/VVI8j5cqoxQf6lj6h2'
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
    let questMode = false;    // true = pokazujemo upitnik nakon prve OAuth-prijave (R1)
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

        // OAuth povratak s GREŠKOM: GoTrue ne vraća error signInWithOAuth pozivu (taj samo
        // redirecta) nego ga šalje NATRAG u URL-u (#error_description=…). Bez ovoga klik na
        // provider koji u dashboardu još nije uključen izgleda kao „ništa se nije dogodilo".
        const _oauthErr = new URLSearchParams(
            (window.location.hash || '').replace(/^#/, '') + '&' + (window.location.search || '').replace(/^\?/, '')
        ).get('error_description');
        if (_oauthErr) {
            openModal();
            setStatus(authError({ message: _oauthErr }), true);
            // Očisti URL — greška ne smije preživjeti refresh/bookmark.
            history.replaceState(null, '', window.location.pathname);
        }

        // Postojeća sesija + redirecti iz emaila (potvrda registracije, reset
        // lozinke) — detectSessionInUrl je default.
        client.auth.onAuthStateChange(function (event, session) {
            const wasSignedIn = !!currentUser;
            currentUser = session ? session.user : null;
            if (!currentUser) { recoveryMode = false; questMode = false; }
            if (event === 'PASSWORD_RECOVERY') recoveryMode = true;
            updateNavButton();
            renderModalState();
            changeListeners.forEach(function (fn) {
                try { fn(currentUser, event); } catch (err) { console.warn('[auth] listener:', err); }
            });
            if (event === 'SIGNED_IN' && !wasSignedIn && !recoveryMode) {
                if (needsQuestionnaire()) {
                    // Prva OAuth-prijava: preskočila je signup formu → upitnik SAD.
                    // SIGNED_IN se NE pali za obnovljenu sesiju (to je INITIAL_SESSION),
                    // pa ovo hvata samo stvarne prijave — nema gnjavaže na svakom loadu.
                    questMode = true;
                    openModal();
                } else {
                    closeModal();
                    if (typeof showToast === 'function') showToast(window.t ? t('msg.signedInSync') : 'Signed in — your progress now syncs to the cloud.');
                }
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
        // OAuth (R1): Google/FB ne pišu display_name nego full_name/name — bez fallbacka
        // bi prijava Googleom u navu pokazivala prefiks emaila umjesto imena.
        const name = (meta.display_name || meta.full_name || meta.name || '').trim();
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
    // ⚠️ `t()` vraća SAM KLJUČ kad prijevoda nema → bez ove provjere korisnik vidi
    // sirovi ključ umjesto teksta. Isti obrazac kao studio.js/my-materials.js.
    function at(key, fb) {
        if (!window.t) return fb;
        const v = t(key);
        return (v === key) ? fb : v;
    }

    /**
     * Supabase auth-greska -> poruka na korisnikovom jeziku.
     *
     * Zasto postoji: `signUp`/`updateUser` odbijaju lozinku i kad je DUGA --
     * ako je u HaveIBeenPwned popisu. To `minlength` u obrascu ne moze
     * predvidjeti, pa je poruka sa servera JEDINI put do korisnika, a isla je
     * neprevedena. Korisnik koji ne razumije zasto je lozinka odbijena
     * najcesce odustane, a ne pokusa drugu.
     *
     * Primarno se gleda `code` (GoTrue ga salje od 2024-01-01), a regex nad
     * porukom je mreza za starije/rubne odgovore. **Zadnji fallback je SIROVA
     * poruka** -- radije engleska recenica nego prazan crveni okvir ako
     * Supabase uvede kod koji jos ne poznajemo.
     *
     * @param {{code?:string, message?:string, reasons?:string[]}|null} err
     * @returns {string}
     */
    function authError(err) {
        const raw = String((err && err.message) || '');
        const code = String((err && err.code) || '');
        const reasons = (err && Array.isArray(err.reasons)) ? err.reasons : [];

        // Slaba lozinka: "procurjela" i "prekratka" su RAZLICITI savjeti.
        // Uputa "uzmi duzu" je kriva za lozinku odbijenu zbog krade podataka.
        if (code === 'weak_password' || /weak.?password/i.test(raw)) {
            const pwned = reasons.indexOf('pwned') !== -1
                || /pwned|breach|leaked|compromis/i.test(raw);
            return pwned
                ? at('auth.st.weakPwned', 'This password has appeared in a known data breach — please pick a different one.')
                : at('auth.st.weakShort', 'Password is too weak — use at least 8 characters.');
        }
        if (code === 'invalid_credentials' || /invalid login credentials/i.test(raw)) {
            return at('auth.st.wrongCreds', 'Wrong email or password.');
        }
        if (code === 'email_not_confirmed' || /email not confirmed/i.test(raw)) {
            return at('auth.st.confirmFirst', 'Please confirm your email first — check your inbox for the confirmation link.');
        }
        if (code === 'user_already_exists' || code === 'email_exists'
            || /already registered|already exists/i.test(raw)) {
            return at('auth.st.exists', 'An account with this email already exists — switch to Sign in.');
        }
        if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit'
            || /rate limit|too many requests/i.test(raw)) {
            return at('auth.st.rateLimit', 'Too many attempts — please wait a minute and try again.');
        }
        if (code === 'email_address_invalid' || /invalid.*email|email.*invalid/i.test(raw)) {
            return at('auth.st.badEmail', 'That email address does not look valid.');
        }
        if (code === 'same_password' || /should be different from the old/i.test(raw)) {
            return at('auth.st.samePass', 'The new password must be different from the current one.');
        }
        // Provider (Google/FB) postoji u kodu, a u dashboardu još nije uključen — namjerno
        // stanje dok Leon ne upiše ključeve; korisnik dobiva put naprijed, ne sirovu grešku.
        if (/provider is not enabled|unsupported provider/i.test(raw)) {
            return at('auth.st.providerOff', 'This sign-in method is not available yet — please use email for now.');
        }
        // Nepoznato: radije sirova engleska recenica nego prazan crveni okvir.
        return raw || at('auth.st.genericErr', 'Something went wrong. Please try again.');
    }

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
            '    <div class="auth-oauth-wrap" id="authOAuthWrap">' +
            '      <div class="auth-oauth">' +
            '        <button type="button" class="auth-oauth__btn" id="authGoogleBtn"><i class="fab fa-google"></i><span>' + at('auth.oauth.google', 'Continue with Google') + '</span></button>' +
            '        <button type="button" class="auth-oauth__btn" id="authFacebookBtn"><i class="fab fa-facebook-f"></i><span>' + at('auth.oauth.facebook', 'Continue with Facebook') + '</span></button>' +
            '      </div>' +
            '      <div class="auth-divider"><span>' + at('auth.divider.or', 'or') + '</span></div>' +
            '    </div>' +
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
            // Registracija u DVA koraka (R1): 1. podaci računa → 2. upitnik. `signUp` traži
            // SVE u jednom pozivu (options.data), pa se upitnik skuplja PRIJE poziva — nakon
            // signUp-a email-korisnik nema sesiju (čeka potvrdu) i ne bi ga imao gdje predati.
            '    <form id="authSignUpForm" class="auth-modal__form" hidden>' +
            '      <input type="text" id="authSignUpName" class="auth-modal__input" placeholder="' + at('auth.ph.name', 'Your name') + '" required maxlength="60" autocomplete="name">' +
            '      <input type="email" id="authSignUpEmail" class="auth-modal__input" placeholder="you@email.com" required autocomplete="email">' +
            '      <div class="auth-pass-wrap">' +
            '        <input type="password" id="authSignUpPassword" class="auth-modal__input" placeholder="' + at('auth.ph.passwordMin', 'Password (min. 8 characters)') + '" required minlength="8" autocomplete="new-password">' +
            '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
            '      </div>' +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-arrow-right"></i><span>' + at('auth.q.continue', 'Continue') + '</span></button>' +
            '    </form>' +
            '    <form id="authSignUpForm2" class="auth-modal__form" hidden>' +
            '      <p class="auth-modal__text auth-modal__text--tight">' + at('auth.q.text', 'One quick step — it helps us show you the right subjects.') + '</p>' +
            questFieldsHtml('authSignUp') +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-user-plus"></i><span>' + at('auth.tab.signUp', 'Create account') + '</span></button>' +
            '      <button type="button" class="auth-modal__link" id="authSignUpBack">' + at('auth.q.back', '← Back') + '</button>' +
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

            // Upitnik NAKON prijave — samo za prvu OAuth-prijavu (preskočila je signup formu).
            '  <div id="authQuest" hidden>' +
            '    <h3 class="auth-modal__title"><i class="fas fa-graduation-cap"></i> ' + at('auth.q.title', 'Tell us who you are') + '</h3>' +
            '    <p class="auth-modal__text">' + at('auth.q.text', 'One quick step — it helps us show you the right subjects.') + '</p>' +
            '    <form id="authQuestForm" class="auth-modal__form">' +
            questFieldsHtml('authQ') +
            '      <button type="submit" class="cta-button primary auth-modal__submit"><i class="fas fa-check"></i><span>' + at('auth.q.continue', 'Continue') + '</span></button>' +
            '      <button type="button" class="auth-modal__link" id="authQuestSkip">' + at('auth.q.skip', 'Skip for now') + '</button>' +
            '    </form>' +
            '    <p class="auth-modal__status" id="authQuestStatus" hidden></p>' +
            '  </div>' +

            '  <datalist id="authSchoolList"><option value="FMTU — Fakultet za menadžment u turizmu i ugostiteljstvu, Opatija"></option></datalist>' +
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
        document.getElementById('authSignUpForm').addEventListener('submit', handleSignUpStep1);
        document.getElementById('authSignUpForm2').addEventListener('submit', handleSignUp);
        document.getElementById('authSignUpBack').addEventListener('click', function () { showPanel('signup'); });
        document.getElementById('authGoogleBtn').addEventListener('click', function () { handleOAuth('google'); });
        document.getElementById('authFacebookBtn').addEventListener('click', function () { handleOAuth('facebook'); });
        document.getElementById('authForgotForm').addEventListener('submit', handleForgot);
        document.getElementById('authRecoveryForm').addEventListener('submit', handleRecovery);
        document.getElementById('authQuestForm').addEventListener('submit', handleQuest);
        document.getElementById('authQuestSkip').addEventListener('click', skipQuest);
        document.getElementById('authSignOutBtn').addEventListener('click', signOut);
    }

    // Polja upitnika — JEDAN izvor za oba mjesta (signup korak 2 + post-OAuth panel),
    // razlikuje ih samo prefiks id-a. Radio `required` na prvom vrijedi za cijelu grupu.
    function questFieldsHtml(prefix) {
        function role(value, key, fb) {
            return '<label class="auth-role"><input type="radio" name="' + prefix + 'Type" value="' + value + '"' +
                (value === 'student' ? ' required' : '') + '><span>' + at(key, fb) + '</span></label>';
        }
        // id-evi sastavljeni UNAPRIJED — fragment poput `Consent"><span>` u konkatenaciji
        // check:i18n inače vidi kao tekstni čvor (kriva pozitiva, ali brana je s razlogom stroga).
        const schoolId = prefix + 'School';
        const consentId = prefix + 'Consent';
        return '<div class="auth-roles" role="radiogroup" aria-label="' + at('auth.q.rolesLabel', 'Who are you?') + '">' +
            role('student', 'auth.q.student', 'University student') +
            role('pupil', 'auth.q.pupil', 'High school') +
            role('other', 'auth.q.other', 'Other') +
            '</div>' +
            '<input type="text" id="' + schoolId + '" class="auth-modal__input" placeholder="' + at('auth.q.schoolPh', 'Your university or school (optional)') + '" maxlength="120" list="authSchoolList" autocomplete="organization">' +
            '<label class="auth-consent"><input type="checkbox" id="' + consentId + '"><span>' + at('auth.q.consent', 'Email me about new subjects and features.') + '</span></label>';
    }

    // Panel unutar odjavljenog stanja: 'signin' | 'signup' | 'signup2' | 'forgot'
    // (forgot je podvarijanta Sign in taba, pa tab ostaje aktivan; signup2 = upitnik,
    // drugi korak registracije — vrijednosti koraka 1 ostaju u skrivenoj formi).
    function showPanel(name) {
        const signIn = document.getElementById('authSignInForm');
        const signUp = document.getElementById('authSignUpForm');
        const signUp2 = document.getElementById('authSignUpForm2');
        const forgot = document.getElementById('authForgotForm');
        if (!signIn || !signUp || !signUp2 || !forgot) return;
        const isUp = (name === 'signup' || name === 'signup2');
        signIn.hidden = name !== 'signin';
        signUp.hidden = name !== 'signup';
        signUp2.hidden = name !== 'signup2';
        forgot.hidden = name !== 'forgot';
        // OAuth gumbi se miču usred registracije (korak 2) i na forgotu — „Continue with
        // Google" UZ upitnik bi izgledao kao alternativni način da ga se dovrši.
        const oauthWrap = document.getElementById('authOAuthWrap');
        if (oauthWrap) oauthWrap.hidden = (name === 'signup2' || name === 'forgot');
        const tabIn = document.getElementById('authTabSignIn');
        const tabUp = document.getElementById('authTabSignUp');
        tabIn.classList.toggle('is-active', !isUp);
        tabUp.classList.toggle('is-active', isUp);
        tabIn.setAttribute('aria-selected', !isUp ? 'true' : 'false');
        tabUp.setAttribute('aria-selected', isUp ? 'true' : 'false');
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

    // Treba li korisniku upitnik? SAMO OAuth-računi bez biljega — email-put ga skuplja
    // u registraciji, a postojeći email-korisnici bez biljega se NE diraju (spec RACUN §3:
    // „postojeći korisnici se i dalje prijavljuju bez ikakve promjene").
    function needsQuestionnaire() {
        if (!currentUser) return false;
        const provider = (currentUser.app_metadata && currentUser.app_metadata.provider) || 'email';
        if (provider === 'email') return false;
        return !(currentUser.user_metadata && currentUser.user_metadata.questionnaire_done);
    }

    function renderModalState() {
        const out = document.getElementById('authSignedOut');
        const rec = document.getElementById('authRecovery');
        const inn = document.getElementById('authSignedIn');
        const q = document.getElementById('authQuest');
        if (!out || !rec || !inn || !q) return;
        const showRecovery = !!(recoveryMode && currentUser);
        const showQuest = !!(questMode && currentUser && !showRecovery);
        out.hidden = !!currentUser;
        rec.hidden = !showRecovery;
        q.hidden = !showQuest;
        inn.hidden = !currentUser || showRecovery || showQuest;
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

    function setQuestStatus(msg, isError) {
        const el = document.getElementById('authQuestStatus');
        if (!el) return;
        el.hidden = !msg;
        el.textContent = msg || '';
        el.classList.toggle('is-error', !!isError);
    }

    // ---------- Akcije ----------

    /**
     * D4 (MREŽA): provjera procurjele lozinke — HaveIBeenPwned range API, k-anonimnost.
     *
     * Lozinka NIKAD ne napušta preglednik: šalje se SAMO prvih 5 heks znakova njezina
     * SHA-1 sažetka, odgovor je popis ~800-1000 sufiksa, usporedba je lokalna. SHA-1 je
     * ovdje u redu jer ne štiti ništa — služi kao KLJUČ u tuđi javni popis, a k-anonimnost
     * čuva i sam upit. `Add-Padding` izjednačava veličinu odgovora (mrežni promatrač ne
     * može ni iz duljine zaključiti prefiks); padding-redci nose broj 0 pa se odbacuju.
     *
     * FAIL-OPEN, namjerno: mrežna greška NE blokira registraciju — provjera je dodatak,
     * ne vrata. Server-side dvojnik (Supabase Pro) ostaje; ovaj klijentski radi neovisno
     * o planu (⚠️ poslije seobe server-side pada — tada je ovo jedina provjera).
     * Doseg pošteno: zaustavlja korisnika koji upiše procurjelu lozinku, ne napadača
     * koji zaobiđe formu (taj šteti samo sebi) — isti razred kao `minlength`.
     */
    async function isPasswordPwned(password) {
        try {
            const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
            const hex = Array.prototype.map.call(new Uint8Array(buf),
                function (b) { return b.toString(16).padStart(2, '0'); }).join('').toUpperCase();
            const res = await fetch('https://api.pwnedpasswords.com/range/' + hex.slice(0, 5),
                { headers: { 'Add-Padding': 'true' } });
            if (!res.ok) return false;
            const suffix = hex.slice(5);
            const text = await res.text();
            return text.split('\n').some(function (line) {
                const i = line.indexOf(':');
                return i > 0 && line.slice(0, i).trim() === suffix
                    && parseInt(line.slice(i + 1), 10) > 0;
            });
        } catch (e) {
            return false;
        }
    }
    // Na window za profile.js (promjena lozinke) — isti razlog kao refreshAuthNav gore.
    window.checkPwnedPassword = isPasswordPwned;

    // ---------- Upitnik (R1): FMTU prepoznavanje + sastavljanje metapodataka ----------

    // Prepoznaje FMTU u slobodnom tekstu (kratica · Opatija · puni naziv). Namjerno
    // širokogrudno — kriva pozitiva znači samo krivi mail-segment, ne sigurnosni problem.
    const FMTU_RE = /fmtu|opatij|menad\w*\s+.{0,3}turizm|turizm\w*\s+i\s+ugostiteljstv/i;

    function buildQuestData(type, school, consent) {
        const s = (school || '').trim();
        return {
            acct_type: type || 'other',            // 'student' | 'pupil' | 'other'
            school: s,
            is_fmtu: FMTU_RE.test(s),
            mail_consent: !!consent,               // GDPR: default false, izričit klik
            questionnaire_done: true,
            questionnaire_at: new Date().toISOString()
        };
    }

    async function handleOAuth(provider) {
        if (!client) return;
        setStatus(at('auth.st.redirect', 'Opening secure sign-in…'));
        // Puni redirect: preglednik ODLAZI na provider i vraća se na istu stranicu,
        // gdje detectSessionInUrl (default) razmijeni kod → SIGNED_IN event.
        const { error } = await client.auth.signInWithOAuth({
            provider: provider,
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) setStatus(authError(error), true);
    }

    async function handleSignIn(e) {
        e.preventDefault();
        if (!client) return;
        const email = (document.getElementById('authSignInEmail').value || '').trim();
        const password = document.getElementById('authSignInPassword').value;
        if (!email || !password) return;
        setStatus(at('auth.st.signingIn', 'Signing in…'));
        const { error } = await client.auth.signInWithPassword({ email: email, password: password });
        if (error) setStatus(authError(error), true);
        // Uspjeh: onAuthStateChange zatvara modal i javlja toast.
    }

    // Korak 1 registracije: browser je validirao required polja → samo prijeđi na upitnik.
    function handleSignUpStep1(e) {
        e.preventDefault();
        showPanel('signup2');
    }

    async function handleSignUp(e) {
        e.preventDefault();
        if (!client) return;
        const name = (document.getElementById('authSignUpName').value || '').trim();
        const email = (document.getElementById('authSignUpEmail').value || '').trim();
        const password = document.getElementById('authSignUpPassword').value;
        if (!name || !email || !password) { showPanel('signup'); return; }
        const type = (document.querySelector('input[name="authSignUpType"]:checked') || {}).value;
        const school = document.getElementById('authSignUpSchool').value;
        const consent = document.getElementById('authSignUpConsent').checked;
        setStatus(at('auth.st.creating', 'Creating account…'));
        if (await isPasswordPwned(password)) {
            setStatus(at('auth.st.weakPwned', 'This password has appeared in a known data breach — please pick a different one.'), true);
            return;
        }
        const { data, error } = await client.auth.signUp({
            email: email,
            password: password,
            options: {
                data: Object.assign({ display_name: name }, buildQuestData(type, school, consent)),
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) {
            setStatus(authError(error), true);
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
            setStatus(authError(error), true);
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
        if (await isPasswordPwned(password)) {
            setRecoveryStatus(at('auth.st.weakPwned', 'This password has appeared in a known data breach — please pick a different one.'), true);
            return;
        }
        const { error } = await client.auth.updateUser({ password: password });
        if (error) {
            setRecoveryStatus(authError(error), true);
            return;
        }
        recoveryMode = false;
        setRecoveryStatus('');
        document.getElementById('authRecoveryPassword').value = '';
        document.getElementById('authRecoveryPassword2').value = '';
        renderModalState();
        if (typeof showToast === 'function') showToast(window.t ? t('msg.passwordUpdatedSignedIn') : 'Password updated — you are signed in.');
    }

    // Upitnik nakon prve OAuth-prijave: sesija VEĆ postoji → updateUser, ne signUp.
    async function handleQuest(e) {
        e.preventDefault();
        if (!client || !currentUser) return;
        const type = (document.querySelector('input[name="authQType"]:checked') || {}).value;
        const school = document.getElementById('authQSchool').value;
        const consent = document.getElementById('authQConsent').checked;
        setQuestStatus(at('msg.saving', 'Saving…'));
        const { error } = await client.auth.updateUser({ data: buildQuestData(type, school, consent) });
        if (error) { setQuestStatus(authError(error), true); return; }
        questMode = false;
        setQuestStatus('');
        closeModal();
        if (typeof showToast === 'function') showToast(at('auth.q.thanks', 'Thanks — welcome to Sokrat!'));
    }

    // „Preskoči" SVEJEDNO piše biljeg (questionnaire_done, mail_consent:false) — bez njega
    // bi se upitnik vraćao na SVAKOJ OAuth-prijavi, a „ne" na pristanak MORA biti zapamćen.
    async function skipQuest() {
        questMode = false;
        closeModal();
        if (!client || !currentUser) return;
        await client.auth.updateUser({
            data: { questionnaire_done: true, mail_consent: false, questionnaire_at: new Date().toISOString() }
        });
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
        authError: authError,
        // TEST-ŠAV (R1): čista funkcija za Playwright evaluate — FMTU prepoznavanje i
        // oblik metapodataka upitnika se testiraju bez prave prijave.
        buildQuestData: buildQuestData,
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
