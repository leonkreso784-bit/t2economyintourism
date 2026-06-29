// ===== SOKRAT STUDY — PROFILE PAGE =====
//
// Renderira #profile-page za prijavljenog korisnika: račun, sync status,
// pregled napretka po predmetu (iz localStorage) i GDPR akcije.
// Ulaz: klik na bilo koji .auth-entry gumb kad je korisnik prijavljen (js/auth.js).

// Lokalni i18n helper: t() ako postoji, inače fallback (engleski original).
function pt(key, fb) { return (window.t) ? t(key) : fb; }

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
            '</div>';
        const btn = document.getElementById('profileSignInBtn');
        if (btn) btn.addEventListener('click', function () { SokratAuth.openModal(); });
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
        '<div class="profile-grid">' +

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

        '  <div class="profile-card profile-card--wide profile-card--danger">' +
        '    <h3 class="profile-card-title"><i class="fas fa-triangle-exclamation"></i> ' + pt('profile.privacyData', 'Privacy & data') + '</h3>' +
        '    <p class="profile-meta">' + pt('profile.deleteDesc1', 'Delete all study progress stored in the cloud. Progress saved on this device stays. To delete your entire account, email ') +
        '<a href="mailto:leonkreso784@gmail.com">leonkreso784@gmail.com</a>' + pt('profile.deleteDesc2', '. See our ') +
        '<a href="privacy.html">' + pt('footer.privacy', 'Privacy Policy') + '</a>.</p>' +
        '    <div class="profile-actions">' +
        '      <button type="button" class="profile-danger-btn" id="profileDeleteCloudBtn"><i class="fas fa-trash"></i><span>' + pt('profile.deleteCloud', 'Delete cloud data') + '</span></button>' +
        '    </div>' +
        '  </div>' +

        '</div>';

    renderProfileStats();

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
            '  <span class="profile-stat-subject"><i class="fas ' + (meta.icon || 'fa-book') + '"></i> ' + escapeHtmlProfile(meta.shortName || meta.name) + '</span>' +
            '  <span class="profile-stat-vals">' +
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
        '<div class="profile-stat-totals">' +
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

    if (!confirm(window.t ? t('msg.confirmDeleteCloud') : 'Delete ALL study progress stored in the cloud? Progress on this device is kept, but you will be signed out.')) return;

    const { error } = await client.from('progress').delete().neq('key', '');
    if (error) {
        if (typeof showToast === 'function') showToast((window.t ? t('msg.deleteCloudFail') : 'Could not delete cloud data: ') + error.message);
        return;
    }
    // Odjava odmah gasi sync petlju — inače bi lokalni podaci bili ponovno uploadani.
    await SokratAuth.signOut();
    if (typeof showToast === 'function') showToast(window.t ? t('msg.cloudDataDeleted') : 'Cloud data deleted.');
    navigateTo('landing');
}

function escapeHtmlProfile(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const back = document.getElementById('backFromProfile');
    if (back) {
        back.addEventListener('click', function () {
            const ret = (typeof profileReturnPage !== 'undefined' && profileReturnPage) ? profileReturnPage : null;
            if (ret && ret.page && ret.page !== 'profile') {
                navigateTo(ret.page, ret.data || {});
            } else {
                navigateTo('landing');
            }
        });
    }
});
