// ===== SOKRAT STUDY — admin-forma „Pošalji obavijest" (F2/4; Leon, anketa 15.09.) =====
//
// Prozor u `<sokrat-modal>` (ESC, pozadina, fokus-zamka — kao izrez slike), otvara ga gumb u
// admin-kartici profila. Sve odluke donosi poslužitelj (`send-notification`): tko je admin, tko je
// primatelj, je li poruka valjana. Ovdje je samo redoslijed koji štiti od nepovratne greške:
//   ① BROJ PRIMATELJA se vidi odmah i nakon svake promjene segmenta (`mode: 'count'`, ništa ne šalje);
//   ② „Pošalji probu meni" — jedan mail, samo adminu (bez ključa protiv ponavljanja: druga proba
//      mora stvarno otići);
//   ③ „Pošalji" traži POTVRDU s brojem primatelja, i nosi ključ protiv ponavljanja koji vrijedi
//      JEDAN otvoreni prozor — ponovni pokušaj poslije djelomičnog pada ne ponavlja ono što je otišlo.
// Tekst iz forme nikad ne ide u `innerHTML`; stanje se piše kroz `textContent`.

(function (window) {
  'use strict';

  const doc = window.document;
  function mt(key, fb) {
    if (!window.t) return fb;
    const v = window.t(key);
    return (v === key) ? fb : v;
  }

  // Kodovi poslužitelja → ljudska poruka (prijevod, nikad autorizacija).
  const PORUKE = {
    mail_bad_subject: ['mail.errSubject', 'A subject is required (up to 120 characters).'],
    mail_bad_text: ['mail.errText', 'A message is required (up to 5000 characters).'],
    mail_bad_url: ['mail.errUrl', 'The link must be https:// on sokratstudy.com.'],
    not_admin: ['mail.errNotAdmin', 'Only an administrator can send.'],
    mail_not_configured: ['mail.errConfig', 'Sending is not set up on this server yet.'],
    resend_failed: ['mail.errSend', 'Sending failed — part of it may have gone out. Sending again with the same form will not repeat what already went.']
  };
  function poruka(kod) {
    const p = PORUKE[kod];
    return p ? mt(p[0], p[1]) : mt('mail.errGeneric', 'Something went wrong. Please try again.');
  }

  let modal = null;
  let kljuc = '';          // protiv dvostrukog slanja: jedan po otvorenom prozoru
  let broj = null;         // zadnji izbrojani primatelji za odabrani segment
  let radi = false;
  let brojanje = 0;        // kasni odgovor starijeg brojanja se odbacuje

  function el(id) { return modal && modal.querySelector('#' + id); }

  function ensureModal() {
    if (modal) return modal;
    modal = doc.createElement('sokrat-modal');
    modal.id = 'mailAdminModal';
    modal.className = 'mail-admin';
    modal.setAttribute('aria-labelledby', 'mailAdminTitle');
    // Statičan kostur (samo naši ključevi) — korisnički tekst ovdje ne ulazi.
    modal.innerHTML =
      '<form class="mail-admin__card" id="mailAdminForm" novalidate>' +
      '  <h3 class="mail-admin__title" id="mailAdminTitle"></h3>' +
      '  <fieldset class="mail-admin__seg"><legend id="mailSegLegend"></legend>' +
      '    <label><input type="radio" name="mailSeg" value="fmtu" checked> <span id="mailSegFmtu"></span></label>' +
      '    <label><input type="radio" name="mailSeg" value="all"> <span id="mailSegAll"></span></label>' +
      '  </fieldset>' +
      '  <label class="mail-admin__field"><span id="mailSubjectLabel"></span>' +
      '    <input type="text" id="mailSubject" class="auth-modal__input" maxlength="120" autocomplete="off"></label>' +
      '  <label class="mail-admin__field"><span id="mailTextLabel"></span>' +
      '    <textarea id="mailText" class="auth-modal__input" maxlength="5000" rows="7"></textarea></label>' +
      '  <label class="mail-admin__field"><span id="mailUrlLabel"></span>' +
      '    <input type="url" id="mailUrl" class="auth-modal__input" inputmode="url" autocomplete="off" placeholder="https://www.sokratstudy.com/#/subject/…"></label>' +
      '  <p class="mail-admin__count"><span id="mailCountLabel"></span> <strong id="mailCount">–</strong></p>' +
      '  <p class="mail-admin__status" id="mailStatus" role="status" aria-live="polite"></p>' +
      '  <div class="mail-admin__actions">' +
      '    <button type="button" class="cta-button secondary" id="mailCancel"></button>' +
      '    <button type="button" class="cta-button secondary" id="mailTest"></button>' +
      '    <button type="submit" class="cta-button primary" id="mailSend"></button>' +
      '  </div>' +
      '</form>';
    doc.body.appendChild(modal);

    modal.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'mailSeg') prebroji();
    });
    modal.addEventListener('click', function (e) {
      if (e.target.closest('#mailCancel')) { modal.close(); return; }
      if (e.target.closest('#mailTest')) proba();
    });
    modal.addEventListener('submit', function (e) { e.preventDefault(); posalji(); });
    return modal;
  }

  function oznake() {
    el('mailAdminTitle').textContent = mt('mail.adminTitle', 'Notification by email');
    el('mailSegLegend').textContent = mt('mail.segment', 'Who gets it');
    el('mailSegFmtu').textContent = mt('mail.segFmtu', 'FMTU (opted in)');
    el('mailSegAll').textContent = mt('mail.segAll', 'Everyone who opted in');
    el('mailSubjectLabel').textContent = mt('mail.subject', 'Subject');
    el('mailTextLabel').textContent = mt('mail.text', 'Message');
    el('mailUrlLabel').textContent = mt('mail.url', 'Link (optional, sokratstudy.com only)');
    el('mailCountLabel').textContent = mt('mail.countLabel', 'Recipients:');
    el('mailCancel').textContent = mt('profile.editCancel', 'Cancel');
    el('mailTest').textContent = mt('mail.test', 'Send a test to me');
    oznaciSlanje();
  }

  function oznaciSlanje() {
    const b = el('mailSend');
    b.textContent = mt('mail.send', 'Send') + (typeof broj === 'number' ? ' (' + broj + ')' : '');
    b.disabled = radi || !broj;
    el('mailTest').disabled = radi;
  }

  function status(tekst, greska) {
    const s = el('mailStatus');
    s.textContent = tekst || '';
    s.classList.toggle('is-error', !!greska);
  }

  function segment() {
    const r = modal.querySelector('input[name="mailSeg"]:checked');
    return r ? r.value : 'fmtu';
  }

  function sadrzaj() {
    return { subject: el('mailSubject').value, text: el('mailText').value, url: el('mailUrl').value };
  }

  async function pozovi(body) {
    const c = (typeof SokratAuth !== 'undefined' && typeof SokratAuth.getClient === 'function') ? SokratAuth.getClient() : null;
    if (!c) throw new Error('mail_failed');
    const r = await c.functions.invoke('send-notification', { body: body });
    if (r.error) {
      let kod = 'mail_failed';
      try {
        const ctx = r.error.context;
        if (ctx && typeof ctx.json === 'function') { const j = await ctx.json(); if (j && j.error) kod = j.error; }
      } catch (e) { /* tijelo nije JSON */ }
      throw new Error(kod);
    }
    return r.data || {};
  }

  async function prebroji() {
    const moj = ++brojanje;
    broj = null;
    el('mailCount').textContent = mt('mail.countLoading', 'counting…');
    oznaciSlanje();
    try {
      const d = await pozovi({ mode: 'count', segment: segment() });
      if (moj !== brojanje) return;
      broj = typeof d.recipients === 'number' ? d.recipients : null;
      el('mailCount').textContent = broj === null ? '–' : String(broj);
      if (broj === 0) status(mt('mail.none', 'Nobody in this group has opted in — nothing to send.'), false);
    } catch (e) {
      if (moj !== brojanje) return;
      el('mailCount').textContent = '–';
      status(poruka(e.message), true);
    }
    oznaciSlanje();
  }

  async function proba() {
    if (radi) return;
    radi = true; oznaciSlanje(); status('', false);
    try {
      const d = await pozovi(Object.assign({ mode: 'test', segment: segment() }, sadrzaj()));
      status(mt('mail.sentTest', 'Test sent to your address.') + (d.redirected ? ' ' + mt('mail.redirected', '(staging: every email went to the test address)') : ''), false);
    } catch (e) {
      status(poruka(e.message), true);
    } finally {
      radi = false; oznaciSlanje();
    }
  }

  async function posalji() {
    if (radi || !broj) return;
    const n = broj;
    if (typeof window.askConfirm === 'function') {
      const naslov = mt('mail.confirmTitle', 'Send this email?');
      const tekst = mt('mail.confirmMsg', 'Recipients: {n}. A sent email cannot be taken back.').replace('{n}', String(n));
      const potvrda = mt('mail.send', 'Send');
      const ok = await window.askConfirm({ title: naslov, message: tekst, confirmText: potvrda });
      if (!ok) return;
    }
    radi = true; oznaciSlanje(); status('', false);
    try {
      const d = await pozovi(Object.assign({ mode: 'send', segment: segment(), idempotency: kljuc }, sadrzaj()));
      status(mt('mail.sent', 'Sent: {n}.').replace('{n}', String(d.sent || 0)) + (d.redirected ? ' ' + mt('mail.redirected', '(staging: every email went to the test address)') : ''), false);
    } catch (e) {
      status(poruka(e.message), true);
    } finally {
      radi = false; oznaciSlanje();
    }
  }

  function noviKljuc() {
    const c = window.crypto;
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function open() {
    ensureModal();
    kljuc = noviKljuc();
    broj = null;
    radi = false;
    oznake();
    status('', false);
    modal.open();
    prebroji();
  }

  window.SokratMailAdmin = { open: open };
})(window);
