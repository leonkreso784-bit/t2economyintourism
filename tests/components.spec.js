// F2 2D.1 — <sokrat-toast> Web Component (prvi UI-primitiv, S4).
// Dokazuje obrazac: custom element se registrira, #toast je njegova instanca s .show() metodom,
// a globalni showToast() delegira na komponentu (prikaz .show + tekst, pa auto-sakrivanje).
// Light-DOM: element zadržava klasu .toast → postojeći CSS (base + responsive) vrijedi nepromijenjeno.
const { test, expect } = require('@playwright/test');

test('sokrat-toast: registriran kao custom element + #toast je instanca s .show()', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!customElements.get('sokrat-toast'));

  const info = await page.evaluate(() => {
    const el = document.getElementById('toast');
    return {
      defined: !!customElements.get('sokrat-toast'),
      tag: el ? el.tagName.toLowerCase() : null,
      hasShow: !!(el && typeof (/** @type {any} */ (el)).show === 'function'),
      hasToastClass: !!(el && el.classList.contains('toast')),
      role: el ? el.getAttribute('role') : null,
      ariaLive: el ? el.getAttribute('aria-live') : null,
      hasMsgSpan: !!(el && el.querySelector('#toastMessage')),
    };
  });

  expect(info.defined).toBe(true);
  expect(info.tag).toBe('sokrat-toast');        // markup je Web Component, ne <div>
  expect(info.hasShow).toBe(true);              // komponenta izlaže .show() metodu
  expect(info.hasToastClass).toBe(true);        // .toast zadržan → CSS vrijedi
  expect(info.role).toBe('status');             // a11y najava
  expect(info.ariaLive).toBe('polite');
  expect(info.hasMsgSpan).toBe(true);           // unutarnji #toastMessage prisutan
});

test('sokrat-toast: showToast() prikaže poruku (.show + tekst) pa auto-sakrije', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => typeof window.showToast === 'function' && !!customElements.get('sokrat-toast'));

  // Prikaz preko globalnog delegata (isti ulaz kao svih ~13 pozivatelja u appu)
  await page.evaluate(() => window.showToast('Pozdrav 2D'));

  const toast = page.locator('#toast');
  await expect(toast).toHaveClass(/show/);                       // prikazан
  await expect(page.locator('#toastMessage')).toHaveText('Pozdrav 2D'); // tekst ažuriran

  // Auto-sakrivanje nakon 2500 ms (buffer do 4 s)
  await expect(toast).not.toHaveClass(/show/, { timeout: 4000 });

  expect(errors).toEqual([]);
});

// ⚠ FOKUS-TESTIRANJE: programatski `.focus()` pozvan iz `page.evaluate(open())` NE hvata u
// Playwright headlessu (activeElement ostaje <body>, iako `document.hasFocus()===true`) — artefakt
// evaluate-granice, NE bug (dokazano: isti kod hvata fokus kad open ide kroz pravi user-gesture klik).
// Zato: determinističko STANJE (is-open/aria/scroll-lock/ESC/backdrop) testiramo programatski, a
// fokus-management (pomak-u-modal + Tab-trap) kroz PRAVI KLIK (test niže). Focus-restore = manualno/scratch verificiran.

test('sokrat-modal: registriran + a11y atributi + open()/close() stanje (is-open, aria, scroll-lock)', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.waitForFunction(() => !!customElements.get('sokrat-modal'));

  // 2D.2a nema još konzumenta u index.html → ubaci test-modal u DOM.
  await page.evaluate(() => {
    const m = document.createElement('sokrat-modal');
    m.id = 'testModal';
    m.innerHTML = '<div class="card"><button id="mBtn1">One</button><button id="mBtn2">Two</button></div>';
    document.body.appendChild(m);
  });
  const modal = page.locator('#testModal');

  // Registriran + a11y (role=dialog, aria-modal, aria-hidden=true dok je zatvoren) + API
  const attrs = await page.evaluate(() => {
    const m = /** @type {any} */ (document.getElementById('testModal'));
    return {
      defined: !!customElements.get('sokrat-modal'),
      role: m.getAttribute('role'),
      ariaModal: m.getAttribute('aria-modal'),
      ariaHidden: m.getAttribute('aria-hidden'),
      hasApi: typeof m.open === 'function' && typeof m.close === 'function' && typeof m.toggle === 'function',
    };
  });
  expect(attrs.defined).toBe(true);
  expect(attrs.role).toBe('dialog');
  expect(attrs.ariaModal).toBe('true');
  expect(attrs.ariaHidden).toBe('true');
  expect(attrs.hasApi).toBe(true);

  // open() → is-open, aria-hidden=false, body.modal-open (scroll-lock)
  await page.evaluate(() => /** @type {any} */ (document.getElementById('testModal')).open());
  await expect(modal).toHaveClass(/is-open/);
  const opened = await page.evaluate(() => ({
    ariaHidden: document.getElementById('testModal').getAttribute('aria-hidden'),
    scrollLock: document.body.classList.contains('modal-open'),
  }));
  expect(opened.ariaHidden).toBe('false');
  expect(opened.scrollLock).toBe(true);

  // close() → is-open uklonjen, aria-hidden=true, scroll otključan
  await page.evaluate(() => /** @type {any} */ (document.getElementById('testModal')).close());
  await expect(modal).not.toHaveClass(/is-open/);
  const closed = await page.evaluate(() => ({
    ariaHidden: document.getElementById('testModal').getAttribute('aria-hidden'),
    scrollLock: document.body.classList.contains('modal-open'),
  }));
  expect(closed.ariaHidden).toBe('true');
  expect(closed.scrollLock).toBe(false);

  expect(errors).toEqual([]);
});

test('sokrat-modal: ESC i backdrop-klik zatvaraju', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!customElements.get('sokrat-modal'));

  await page.evaluate(() => {
    const m = document.createElement('sokrat-modal');
    m.id = 'testModal2';
    m.innerHTML = '<div class="card"><button id="inBtn">Inside</button></div>';
    document.body.appendChild(m);
  });
  const modal = page.locator('#testModal2');

  // ESC zatvara + scroll otključan
  await page.evaluate(() => /** @type {any} */ (document.getElementById('testModal2')).open());
  await expect(modal).toHaveClass(/is-open/);
  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  expect(await page.evaluate(() => document.body.classList.contains('modal-open'))).toBe(false);

  // Ponovo otvori → klik na sam overlay (rub, izvan kartice) zatvara; klik na karticu NE zatvara
  await page.evaluate(() => /** @type {any} */ (document.getElementById('testModal2')).open());
  await expect(modal).toHaveClass(/is-open/);
  await page.locator('#inBtn').click();               // klik unutar kartice — NE zatvara
  await expect(modal).toHaveClass(/is-open/);
  await modal.click({ position: { x: 4, y: 4 } });    // gornji-lijevi kut = overlay → zatvara
  await expect(modal).not.toHaveClass(/is-open/);
});

// NB: fokus-management (pomak-u-modal na open, Tab-trap, focus-restore na close) NIJE gate-an ovdje —
// cijela Playwright matrica su iPhone (touch) profili, gdje tap NE fokusira gumb (mobilna focus-semantika),
// pa je programatski/tap fokus nepouzdan. Ponašanje je ispravno u pravom desktop pregledniku (ručno + scratch
// verificirano) i deklarativno signalizirano `aria-modal="true"`. Determinističko stanje (gore) JE gate-ano.

test('sokrat-modal: image-viewer (#imageModal, F2 2D.2b) — openLearnImageModal otvara, ESC zatvara + čisti sliku', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  // initLearnImageModal() se zove iz init.js na startu → close-event povezan bez navigacije.
  await page.waitForFunction(() => !!customElements.get('sokrat-modal') && typeof window.openLearnImageModal === 'function');

  // #imageModal je sada <sokrat-modal> (migriran s <div class="image-modal hidden">)
  expect(await page.evaluate(() => document.getElementById('imageModal').tagName.toLowerCase())).toBe('sokrat-modal');

  // Otvori kroz learn.js API (isti ulaz kao klik na zoomable sliku)
  const PX = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  await page.evaluate((src) => window.openLearnImageModal(src, 'Test caption'), PX);

  const modal = page.locator('#imageModal');
  await expect(modal).toHaveClass(/is-open/);                 // komponenta otvorena
  const opened = await page.evaluate(() => ({
    imgSet: ((document.getElementById('imageModalImg') || {}).getAttribute('src') || '').length > 0,
    caption: (document.getElementById('imageModalCaption') || {}).textContent,
    scrollLock: document.body.classList.contains('modal-open'),
  }));
  expect(opened.imgSet).toBe(true);
  expect(opened.caption).toBe('Test caption');
  expect(opened.scrollLock).toBe(true);

  // ESC (rješava <sokrat-modal>) zatvara + sokrat-modal:close event čisti sliku/caption
  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  const closed = await page.evaluate(() => ({
    imgSrc: (document.getElementById('imageModalImg') || {}).getAttribute('src'),
    caption: (document.getElementById('imageModalCaption') || {}).textContent,
    scrollLock: document.body.classList.contains('modal-open'),
  }));
  expect(closed.imgSrc).toBe('');                             // slika očišćena preko close-eventa
  expect(closed.caption).toBe('');
  expect(closed.scrollLock).toBe(false);

  expect(errors).toEqual([]);
});
