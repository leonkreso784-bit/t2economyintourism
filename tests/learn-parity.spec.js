// U7c runtime parity + sigurnost: STVARNI DOMPurify (iz CDN-a) u pregledniku.
// Node unit (blocks-renderer.test.js) mockira DOMPurify; ovdje dokazujemo da PRAVI DOMPurify
// (a) ČUVA naš legacy stil (class + inline style + gradient = parity živog learn-a), i
// (b) i dalje UKLANJA opasni sadržaj (script/onclick/javascript:). Renderira se kroz window.renderBlocks
// (isti put kao study nakon U7c flipa). Pokreće se u default (iphone) projektima = dio smoke suite.
const { test, expect } = require('@playwright/test');
const { ucitajPakete } = require('./helpers/paketi');

test('U7c: pravi DOMPurify čuva legacy stil (parity) + blokira XSS', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('/');
  // Renderer i DOMPurify od učitavanja po ruti stižu s paketom `study` (v. js/loader.js).
  await ucitajPakete(page, ['study']);
  // renderer + PRAVI DOMPurify moraju biti dostupni (oboje dolazi s paketom, DOMPurify s CDN-a)
  await page.waitForFunction(
    () => typeof window.renderBlocks === 'function' && window.DOMPurify && typeof window.DOMPurify.sanitize === 'function',
    null, { timeout: 15000 }
  );

  // (a) PARITY: klase + inline style + gradijent PREŽIVLJAVAJU (inače nestaje 331× stilova u v1)
  const styled = await page.evaluate(() => {
    const html = '<div class="tip-box" style="text-align: center; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0));">' +
      '<h4 style="font-size:1.2rem;">Naslov</h4><p style="margin:0;">Tekst &amp; <strong>bold</strong></p></div>';
    return window.renderBlocks([{ type: 'legacy-html', html }]);
  });
  expect(styled).toContain('class="tip-box"');
  expect(styled).toContain('style=');
  expect(styled).toContain('linear-gradient');
  expect(styled).toContain('<strong>bold</strong>');

  // (b) SIGURNOST: opasan sadržaj uklonjen i s PRAVIM DOMPurify-em
  const xss = await page.evaluate(() =>
    window.renderBlocks([{ type: 'legacy-html', html: '<p onclick="alert(1)">x</p><script>alert(2)</script><a href="javascript:alert(3)">l</a>' }]));
  expect(xss).not.toContain('<script>');
  expect(xss).not.toContain('onclick');
  expect(xss).not.toContain('javascript:');
  expect(xss).toContain('x'); // tekst sadržaja ostaje

  expect(errors, 'nema JS grešaka pri renderu blokova').toEqual([]);
});
