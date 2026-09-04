// ===== SOKRAT STUDY — PROFILE PAGE =====
//
// Renderira #profile-page za prijavljenog korisnika: račun, sync status,
// pregled napretka po predmetu (iz localStorage) i GDPR akcije.
// Ulaz: klik na bilo koji .auth-entry gumb kad je korisnik prijavljen (js/auth.js).

// Lokalni i18n helper: t() ako postoji, inače fallback (engleski original).
// ⚠️ `t()` vraća SAM KLJUČ kad prijevoda nema → bez ove provjere korisnik vidi
// sirovo „admin.openStudio". Isti obrazac kao studio.js/my-materials.js.
function pt(key, fb) {
    if (!window.t) return fb;
    const v = t(key);
    return (v === key) ? fb : v;
}

// ── BIRAČ TEMA (Leon, 2026-09-01: „u profilu") ──────────────────────────────
// Tema je svojstvo UREĐAJA (localStorage, js/theme.js) — zato se kartica crta
// i neprijavljenom korisniku, a izbor ne ide ni u kakav profil na serveru.
function themeCardHtml() {
    const cur = document.documentElement.getAttribute('data-theme');
    const imena = {
        academic: pt('profile.themeAcademic', 'Academic blue'),
        chalk: pt('profile.themeChalk', 'Chalkboard'),
        mint: pt('profile.themeMint', 'Mint'),
        carbon: pt('profile.themeCarbon', 'Carbon')
    };
    // Imena klasa DOSLOVNO, ne sastavljena ('--' + ime): skener siročadi (check:orphan-css)
    // čita izvor, ne runtime — ista logika zbog koje ADR-028 zabranjuje dinamičke klase.
    const swatch = {
        academic: 'theme-option-swatch--academic',
        chalk: 'theme-option-swatch--chalk',
        mint: 'theme-option-swatch--mint',
        carbon: 'theme-option-swatch--carbon'
    };
    const teme = window.SOKRAT_THEMES || ['academic', 'chalk', 'mint'];
    let gumbi = '';
    for (let i = 0; i < teme.length; i++) {
        const ime = teme[i];
        gumbi += '<button type="button" class="theme-option" data-theme-pick="' + ime + '"' +
            ' aria-pressed="' + (ime === cur ? 'true' : 'false') + '">' +
            '<span class="theme-option-swatch ' + (swatch[ime] || '') + '" aria-hidden="true"></span>' +
            '<span>' + (imena[ime] || ime) + '</span></button>';
    }
    return '<div class="profile-card profile-card--wide">' +
        '<h3 class="profile-card-title"><i class="fas fa-palette"></i> ' + pt('profile.appearance', 'Appearance') + '</h3>' +
        '<p class="profile-meta">' + pt('profile.appearanceDesc', 'Pick a theme — it is saved on this device.') + '</p>' +
        '<div class="theme-picker">' + gumbi + '</div>' +
        '</div>';
}

function wireThemePicker(root) {
    root.querySelectorAll('[data-theme-pick]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!window.setTheme || !setTheme(btn.dataset.themePick)) return;
            root.querySelectorAll('[data-theme-pick]').forEach(function (b) {
                b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
            });
        });
    });
}

function renderProfilePage() {
    const root = document.getElementById('profileContent');
    if (!root) return;

    const user = (typeof SokratAuth !== 'undefined') ? SokratAuth.getUser() : null;

    if (!user) {
        root.innerHTML =
            '<div class="profile-card profile-card--center">' +
            '  <div class="profile-empty-icon"><i class="fas fa-user-lock"></i></div>' +
            '  <h2>' + pt('profile.notSignedIn', 'You are not signed in') + '</h2>' +
            '  <p>' + pt('profile.signInToBackup', 'Sign in to back up your progress and study on any device.') + '</p>' +
            '  <button type="button" class="cta-button primary" id="profileSignInBtn"><i class="fas fa-user"></i><span>' + pt('auth.signIn', 'Sign in') + '</span></button>' +
            '</div>' +
            themeCardHtml();
        const btn = document.getElementById('profileSignInBtn');
        if (btn) btn.addEventListener('click', function () { SokratAuth.openModal(); });
        wireThemePicker(root);
        return;
    }

    const created = user.created_at ? new Date(user.created_at) : null;
    const memberSince = created
        ? created.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';
    // Ime iz registracije (user_metadata.display_name); stariji računi ga nemaju → email kao naslov.
    const displayName = (user.user_metadata && user.user_metadata.display_name)
        ? String(user.user_metadata.display_name).trim() : '';

    root.innerHTML =
        '<div class="profile-grid grid gap-4">' +

        '  <div class="profile-card">' +
        '    <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>' +
        '    <h2 class="profile-email">' + escapeHtmlProfile(displayName || user.email || '') + '</h2>' +
        (displayName ? '    <p class="profile-meta profile-meta--sub">' + escapeHtmlProfile(user.email || '') + '</p>' : '') +
        '    <p class="profile-meta">' + pt('profile.memberSince', 'Member since ') + memberSince + '</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="cta-button secondary" id="profileChangePassBtn"><i class="fas fa-key"></i><span>' + pt('profile.changePassword', 'Change password') + '</span></button>' +
        '      <button type="button" class="cta-button secondary" id="profileSignOutBtn"><i class="fas fa-sign-out-alt"></i><span>' + pt('profile.signOut', 'Sign out') + '</span></button>' +
        '    </div>' +
        '    <form id="profileChangePassForm" class="profile-pass-form" hidden>' +
        '      <div class="auth-pass-wrap">' +
        '        <input type="password" id="profileNewPassword" class="auth-modal__input" placeholder="' + pt('profile.newPassPlaceholder', 'New password (min. 8 characters)') + '" required minlength="8" autocomplete="new-password">' +
        '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
        '      </div>' +
        '      <div class="auth-pass-wrap">' +
        '        <input type="password" id="profileNewPassword2" class="auth-modal__input" placeholder="' + pt('profile.repeatNewPass', 'Repeat new password') + '" required minlength="8" autocomplete="new-password">' +
        '        <button type="button" class="auth-pass-toggle" aria-label="Show password"><i class="fas fa-eye"></i></button>' +
        '      </div>' +
        '      <button type="submit" class="cta-button primary"><i class="fas fa-check"></i><span>' + pt('profile.saveNewPass', 'Save new password') + '</span></button>' +
        '      <p class="profile-pass-status" id="profilePassStatus" hidden></p>' +
        '    </form>' +
        '  </div>' +

        // Admin (F4) — renderira se skriveno; SokratAdmin.refresh() ga otkrije samo adminu.
        '  <div class="profile-card profile-card--wide admin-only" style="display:none">' +
        '    <h3 class="profile-card-title"><i class="fas fa-user-shield"></i> ' + pt('admin.title', 'Admin') + '</h3>' +
        '    <p class="profile-meta">' + pt('admin.desc', 'Edit study content directly. Every change is versioned and can be undone.') + '</p>' +
        '    <div class="profile-actions">' +
        // T6: editor je VLASTITI DOKUMENT (`editor.html`), pa ulaz više nije gumb koji mijenja
        // sekciju nego POVEZNICA. Time se ne dobiva samo ispravna semantika: poveznica se smije
        // otvoriti u novoj kartici, kopirati i vidjeti prije klika — gumb ništa od toga ne nudi.
        '      <a class="cta-button primary" href="editor.html"><i class="fas fa-wand-magic-sparkles"></i><span>' + pt('admin.openStudio', 'Studio editor') + '</span></a>' +
        '      <a class="cta-button secondary" href="editor.html?view=admin"><i class="fas fa-pen-to-square"></i><span>' + pt('admin.editContent', 'Edit content') + '</span></a>' +
        '    </div>' +
        '  </div>' +

        // Moji materijali (C0 / ADR-029) — stablo je preseljeno na VLASTITU stranicu `#materials-page`,
        // jer je vlastiti materijal glavni proizvod, a ne pododjeljak postavki. Ovdje ostaje samo
        // poveznica: stari put (profil → materijali) i dalje radi, a `#myMaterials` postoji SAMO
        // na jednom mjestu u dokumentu — dva bi čvora s istim id-em razbila `mount()`.
        '  <div class="profile-card profile-card--wide">' +
        '    <h3 class="profile-card-title"><i class="fas fa-folder-tree"></i> ' + pt('materials.title', 'My materials') + '</h3>' +
        '    <p class="profile-meta">' + pt('materials.desc', 'Build your own study material — organise it in folders however you like. Private to you.') + '</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="cta-button primary" data-goto-materials><i class="fas fa-folder-tree"></i><span>' + pt('materials.openPage', 'Open my materials') + '</span></button>' +
        '    </div>' +
        '  </div>' +

        '  <div class="profile-card">' +
        '    <h3 class="profile-card-title"><i class="fas fa-cloud"></i> ' + pt('profile.cloudSync', 'Cloud sync') + '</h3>' +
        '    <p class="profile-meta" id="profileSyncStatus">' + pt('profile.syncAuto', 'Your progress is backed up automatically while you study.') + '</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="cta-button secondary" id="profileSyncNowBtn"><i class="fas fa-rotate"></i><span>' + pt('profile.syncNow', 'Sync now') + '</span></button>' +
        '    </div>' +
        '  </div>' +

        '  <div class="profile-card profile-card--wide">' +
        '    <h3 class="profile-card-title"><i class="fas fa-chart-line"></i> ' + pt('profile.progressOverview', 'Progress overview') + '</h3>' +
        '    <div class="profile-stats" id="profileStats"></div>' +
        '  </div>' +

        themeCardHtml() +

        '  <div class="profile-card profile-card--wide profile-card--danger">' +
        '    <h3 class="profile-card-title"><i class="fas fa-triangle-exclamation"></i> ' + pt('profile.privacyData', 'Privacy & data') + '</h3>' +
        '    <p class="profile-meta">' + pt('profile.deleteDesc', 'Delete all study progress stored in the cloud — progress saved on this device stays.') +
        ' <a href="privacy.html">' + pt('footer.privacy', 'Privacy Policy') + '</a>.</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="profile-danger-btn" id="profileDeleteCloudBtn"><i class="fas fa-trash"></i><span>' + pt('profile.deleteCloud', 'Delete cloud data') + '</span></button>' +
        '    </div>' +
        // GDPR čl. 17 — brisanje računa je NEPOVRATNO, pa ima vlastiti odjeljak i vlastiti tijek.
        '    <hr class="profile-danger-sep">' +
        '    <p class="profile-meta">' + pt('profile.deleteAccountDesc', 'Delete your account permanently. Everything goes: your progress, your materials and their images. This cannot be undone.') + '</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="profile-danger-btn profile-danger-btn--hard" id="profileDeleteAccountBtn"><i class="fas fa-user-slash"></i><span>' + pt('profile.deleteAccount', 'Delete account') + '</span></button>' +
        '    </div>' +
        '    <form class="profile-delete-form" id="profileDeleteAccountForm" hidden>' +
        '      <input type="text" id="profileDeleteConfirm" class="auth-modal__input" autocomplete="off" spellcheck="false"' +
        '        placeholder="' + pt('profile.deleteAccountType', 'Type DELETE to confirm') + '"' +
        '        aria-label="' + pt('profile.deleteAccountType', 'Type DELETE to confirm') + '">' +
        '      <p class="profile-delete-status" id="profileDeleteStatus" hidden></p>' +
        '      <button type="submit" class="profile-danger-btn profile-danger-btn--hard" id="profileDeleteAccountGo">' + pt('profile.deleteAccountGo', 'Delete my account forever') + '</button>' +
        '    </form>' +
        '  </div>' +

        '</div>';

    renderProfileStats();
    wireThemePicker(root);
    // Otkrij admin karticu samo adminu (RLS je prava zaštita; ovo je UX). Async re-check.
    if (window.SokratAdmin) SokratAdmin.refresh();
    // Moji materijali se od C0 montiraju na `#materials-page` (renderMaterialsPage), ne ovdje.

    document.getElementById('profileSignOutBtn').addEventListener('click', function () {
        SokratAuth.signOut();
    });
    document.getElementById('profileChangePassBtn').addEventListener('click', function () {
        const form = document.getElementById('profileChangePassForm');
        form.hidden = !form.hidden;
        if (!form.hidden) document.getElementById('profileNewPassword').focus();
    });
    document.getElementById('profileChangePassForm').addEventListener('submit', changePassword);
    document.getElementById('profileSyncNowBtn').addEventListener('click', async function () {
        if (typeof CloudSync !== 'undefined') await CloudSync.pushNow();
        const el = document.getElementById('profileSyncStatus');
        if (el) el.textContent = window.t ? t('msg.syncedJustNow') : 'Synced just now — everything is backed up.';
        if (typeof showToast === 'function') showToast(window.t ? t('msg.progressSynced') : 'Progress synced to cloud');
    });
    document.getElementById('profileDeleteCloudBtn').addEventListener('click', deleteCloudData);
    document.getElementById('profileDeleteAccountBtn').addEventListener('click', function () {
        const form = document.getElementById('profileDeleteAccountForm');
        form.hidden = !form.hidden;
        if (!form.hidden) document.getElementById('profileDeleteConfirm').focus();
    });
    document.getElementById('profileDeleteAccountForm').addEventListener('submit', deleteAccount);
}

function renderProfileStats() {
    const holder = document.getElementById('profileStats');
    if (!holder || typeof subjectDataMap === 'undefined') return;

    let rows = '';
    let totalCards = 0, totalQuizzes = 0, totalFill = 0;

    Object.keys(subjectDataMap).forEach(function (id) {
        const meta = subjectDataMap[id];
        if (!meta.storageKey) return;
        let p = null;
        try { p = JSON.parse(localStorage.getItem(meta.storageKey) || 'null'); } catch (e) { p = null; }
        if (!p) return;

        const cards = Array.isArray(p.flashcardsLearned) ? p.flashcardsLearned.length : 0;
        const quizzes = Array.isArray(p.quizScores) ? p.quizScores.length : 0;
        const avg = quizzes > 0 ? Math.round(p.quizScores.reduce(function (a, b) { return a + b; }, 0) / quizzes) : null;
        const fill = p.fillSolved || 0;
        if (cards === 0 && quizzes === 0 && fill === 0) return;

        totalCards += cards; totalQuizzes += quizzes; totalFill += fill;

        rows +=
            '<div class="profile-stat-row">' +
            // BUG-025: ikona osobnog materijala dolazi iz korisnikovog retka → provjeri je (ide u
            // `class`, gdje escape nije dovoljan). Naziv je već escapan.
            '  <span class="profile-stat-subject"><i class="fas ' + profileIcon(meta.icon) + '"></i> ' + escapeHtmlProfile(meta.shortName || meta.name) + '</span>' +
            '  <span class="profile-stat-vals flex flex-wrap text-[0.85rem] text-ink-1">' +
            '    <span title="' + pt('profile.tip.cards', 'Flashcards learned') + '"><i class="fas fa-clone"></i> ' + cards + '</span>' +
            '    <span title="' + pt('profile.tip.quizzes', 'Quizzes taken') + '"><i class="fas fa-question-circle"></i> ' + quizzes + (avg !== null ? ' (' + pt('profile.avg', 'avg') + ' ' + avg + '%)' : '') + '</span>' +
            '    <span title="' + pt('profile.tip.fill', 'Fill-in exercises solved') + '"><i class="fas fa-pen"></i> ' + fill + '</span>' +
            '  </span>' +
            '</div>';
    });

    if (!rows) {
        holder.innerHTML = '<p class="profile-meta">' + pt('profile.noActivity', 'No study activity yet — open a subject and start learning!') + '</p>';
        return;
    }

    holder.innerHTML =
        '<div class="profile-stat-totals flex flex-wrap gap-4 mb-4">' +
        '  <div class="profile-total"><strong>' + totalCards + '</strong><span>' + pt('profile.cardsLearned', 'cards learned') + '</span></div>' +
        '  <div class="profile-total"><strong>' + totalQuizzes + '</strong><span>' + pt('profile.quizzesTaken', 'quizzes taken') + '</span></div>' +
        '  <div class="profile-total"><strong>' + totalFill + '</strong><span>' + pt('profile.fillSolved', 'fill-ins solved') + '</span></div>' +
        '</div>' + rows;
}

async function changePassword(e) {
    e.preventDefault();
    const client = (typeof SokratAuth !== 'undefined') ? SokratAuth.getClient() : null;
    if (!client) return;
    const input = document.getElementById('profileNewPassword');
    const repeat = document.getElementById('profileNewPassword2');
    const status = document.getElementById('profilePassStatus');
    if (!input || !repeat || !status) return;
    status.hidden = false;
    if (input.value !== repeat.value) {
        status.classList.add('is-error');
        status.textContent = window.t ? t('msg.passwordsNoMatch') : 'Passwords do not match.';
        return;
    }
    status.classList.remove('is-error');
    status.textContent = window.t ? t('msg.saving') : 'Saving…';
    // D4: procurjela lozinka se odbija i ovdje — ista provjera kao signup/recovery
    // (živi u auth.js: k-anonimnost, fail-open; typeof-guard za slučaj da auth nije učitan).
    if (typeof window.checkPwnedPassword === 'function' && await window.checkPwnedPassword(input.value)) {
        status.classList.add('is-error');
        status.textContent = window.t ? t('auth.st.weakPwned') : 'This password has appeared in a known data breach — please pick a different one.';
        return;
    }
    const { error } = await client.auth.updateUser({ password: input.value });
    if (error) {
        status.classList.add('is-error');
        status.textContent = error.message;
        return;
    }
    status.hidden = true;
    input.value = '';
    repeat.value = '';
    document.getElementById('profileChangePassForm').hidden = true;
    if (typeof showToast === 'function') showToast(window.t ? t('msg.passwordUpdated') : 'Password updated.');
}

async function deleteCloudData() {
    const user = SokratAuth.getUser();
    const client = SokratAuth.getClient();
    if (!user || !client) return;

    const ok = await askConfirm({
        message: window.t ? t('msg.confirmDeleteCloud') : 'Delete ALL study progress stored in the cloud? Progress on this device is kept, but you will be signed out.',
        danger: true
    });
    if (!ok) return;

    // U2 (R1-UX): brisanje ide KROZ CloudSync.wipeAll — cloud + lokalno + snapshot, bez
    // odjave. Stara verzija je brisala samo cloud i odjavila korisnika, a union-merge je
    // pri sljedećoj prijavi sve vratio: brisanje koje se samo poništi (Leon, 2026-09-02).
    if (typeof CloudSync === 'undefined' || !CloudSync.wipeAll) return;
    const res = await CloudSync.wipeAll();
    if (!res.ok) {
        if (typeof showToast === 'function') showToast((window.t ? t('msg.deleteCloudFail') : 'Could not delete study history: ') + res.reason);
        return;
    }
    if (typeof showToast === 'function') showToast(window.t ? t('msg.cloudDataDeleted') : 'Study history deleted.');
    // Korisnik OSTAJE prijavljen; profil se osvježi da odmah pokaže prazno stanje.
    if (typeof renderProfilePage === 'function') renderProfilePage();
}

// ===== GDPR čl. 17 — self-service brisanje računa =====
//
// Do 2026-08-08 je ovdje pisalo „za brisanje računa pošalji mail" — na živom proizvodu s EU
// korisnicima to nije dovoljno. Privilegirani dio (`service_role`) NIKAD ne smije u klijent
// (ADR-016) → posao radi Edge Function `delete-account`, a ovdje je samo tijek pristanka.
//
// Dvostruka potvrda je namjerna i NIJE ista radnja dvaput: prvo se upiše riječ (obara slučajan
// klik i „samo sam htio vidjeti što je ovo"), pa tek onda ide danger-dijalog.

/** Riječ potvrde. NAMJERNO neprevedena — mora značiti isto na svakom jeziku sučelja. */
const DELETE_TOKEN = 'DELETE';

/**
 * Ključevi koji PREŽIVE brisanje računa: postavke uređaja, ne podaci o osobi.
 * Consent se čuva jer je i sam GDPR-artefakt (dokaz pristanka), a `sokrat-supabase-override`
 * je test-prekidač — brisanje bi razvalilo staging-sesiju usred testa.
 */
const KEEP_LOCAL_KEYS = ['sokrat-theme', 'sokrat-ui-lang', 'sokrat-cookie-consent', 'sokrat-supabase-override'];

/**
 * Počisti SVE lokalne tragove korisnika. Allow-lista (a ne popis za brisanje) je namjerna:
 * napredak živi pod slobodnim ključevima (`<predmet>-progress`, `node:<uuid>`, `sokrat-draft:…`),
 * pa bi popis za brisanje neizbježno nešto propustio čim se doda nov ključ.
 */
function purgeLocalAccountData() {
    try {
        Object.keys(localStorage)
            .filter(function (k) { return KEEP_LOCAL_KEYS.indexOf(k) === -1; })
            .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) { /* private mode — nema što čistiti */ }
}

/**
 * Pravi razlog neuspjeha Edge Functiona.
 * `functions.invoke` na svaki ne-2xx vraća SAMO „Edge Function returned a non-2xx status code" —
 * tijelo s razlogom visi na `error.context` (Response). Bez ovoga bi admin koji pokuša obrisati
 * račun vidio tehničku besmislicu umjesto „administrator posjeduje slike javnog kataloga".
 */
async function _fnErrorReason(err) {
    const KNOWN = {
        admin_cannot_self_delete: pt('profile.deleteAccountAdmin',
            'An administrator cannot delete their own account — the public catalogue images belong to it.'),
        storage_purge_failed: pt('profile.deleteAccountStorage', 'Your images could not be removed. Nothing was deleted.'),
        missing_token: pt('profile.deleteAccountAuth', 'You are not signed in.'),
        unauthorized: pt('profile.deleteAccountAuth', 'You are not signed in.')
    };
    try {
        const ctx = err && err.context;
        if (ctx && typeof ctx.json === 'function') {
            const body = await ctx.clone().json();
            if (body && body.error && KNOWN[body.error]) return KNOWN[body.error];
            if (body && body.detail) return String(body.detail);
            if (body && body.error) return String(body.error);
        }
    } catch (e) { /* tijelo nije JSON — padni na poruku ispod */ }
    return (err && err.message) ? err.message : String(err);
}

function _deleteStatus(msg, isErr) {
    const el = document.getElementById('profileDeleteStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
    el.classList.toggle('is-error', !!isErr);
}

async function deleteAccount(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const client = (typeof SokratAuth !== 'undefined') ? SokratAuth.getClient() : null;
    const user = (typeof SokratAuth !== 'undefined') ? SokratAuth.getUser() : null;
    if (!client || !user) return;

    const typed = (document.getElementById('profileDeleteConfirm').value || '').trim().toUpperCase();
    if (typed !== DELETE_TOKEN) {
        _deleteStatus(pt('profile.deleteAccountMismatch', 'Type DELETE exactly to confirm.').replace('DELETE', DELETE_TOKEN), true);
        return;
    }

    const ok = await askConfirm({
        title: pt('profile.deleteAccountTitle', 'Delete account permanently?'),
        message: pt('profile.deleteAccountConfirm', 'Your account, progress, materials and images will be deleted for good. This cannot be undone.'),
        confirmText: pt('profile.deleteAccount', 'Delete account'),
        danger: true
    });
    if (!ok) return;

    const btn = document.getElementById('profileDeleteAccountGo');
    if (btn) btn.disabled = true;
    _deleteStatus(pt('profile.deleteAccountWorking', 'Deleting your account…'), false);

    let res;
    try {
        res = await client.functions.invoke('delete-account', { method: 'POST' });
    } catch (err) {
        res = { error: err };
    }
    if (res && res.error) {
        if (btn) btn.disabled = false;
        _deleteStatus(pt('profile.deleteAccountFail', 'Could not delete the account: ') +
            await _fnErrorReason(res.error), true);
        return;
    }

    // Račun je obrisan, ali JWT vrijedi do isteka — Supabase NE odjavljuje pri brisanju.
    // Zato odjava ide prije čišćenja: dok sesija traje, cloud-sync bi vratio lokalni napredak.
    try { await SokratAuth.signOut(); } catch (err) { /* sesija je ionako mrtva */ }
    purgeLocalAccountData();
    if (typeof showToast === 'function') showToast(pt('profile.deleteAccountDone', 'Your account has been deleted.'));
    navigateTo('landing');
}

function escapeHtmlProfile(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

/** BUG-025: ikona ide u `class` → provjera oblika, ne escape. Jedna definicija (blocks-renderer). */
function profileIcon(icon) {
    return (window.SokratBlocks && typeof SokratBlocks.safeIcon === 'function')
        ? SokratBlocks.safeIcon(icon) : 'fa-book';
}

function vezeProfila() {
    const back = document.getElementById('backFromProfile');
    if (back && !back.dataset.bound) {
        back.dataset.bound = '1';
        // K2a: jedan model vracanja za cijelu aplikaciju (js/navigation.js).
        back.addEventListener('click', function () {
            if (typeof goBack === 'function') goBack();
        });
    }
}
// ⚠️ NE SAMO `DOMContentLoaded`. Od učitavanja po ruti ova skripta stiže s paketom `profile`,
// dakle NAKON tog događaja — a slušač koji čeka nešto što se već dogodilo ne okine se nikad.
// Posljedica bi bila gumb „natrag" koji na profilu ne radi ništa.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vezeProfila);
} else {
    vezeProfila();
}
