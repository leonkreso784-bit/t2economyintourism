// T6 — STRANICA EDITORA PRED NEPRIJAVLJENIM POSJETITELJEM (spec §9.13).
//
// Editor je od T6 dobio VLASTITU ADRESU, a K1 mu je rutu bio namjerno uskratio, i to s
// obrazloženjem koje i danas stoji u `js/navigation.js`: „deep-link na #/admin pokazao bi
// prazan admin bilo kome tko zna adresu", jer na hladnom startu sesija još nije razriješena.
// Ova tvrdnja postoji da to obrazloženje ostane ISTINITO i sad kad je adresa prava.
//
// ⚠️ Vozi se na ČETIRI telefonska profila (default projekti), i to nije slučajno: T6 je
// cigla faze TELEFON, pa je čuvar prvi ekran koji netko na telefonu ondje uopće vidi.
//
// ⚠️ ČEKA SE STANJE, NE VRIJEME. Gumb povratka postane vidljiv tek kad odluka PADNE, pa je
// on sam signal; fiksno čekanje bi mjerilo brzinu mreže (isti kvar kao u T0 i K6b).
const { test, expect } = require('@playwright/test');

// Traka privole bi prekrila donji dio ekrana i pomiješala se s mjerenjem čuvara (T4).
async function bezTrake(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('sokrat-cookie-consent', 'denied'); } catch (e) { /* privatni način */ }
  });
}

test.describe('T6 — editor.html odbija neprijavljenog', () => {
  test('čuvar stoji, Studio se NE renderira, i postoji izlaz', async ({ page }) => {
    const greske = [];
    page.on('pageerror', (e) => greske.push(e.message));

    await bezTrake(page);
    await page.goto('/editor.html');
    await page.waitForSelector('#edGuardBack:visible', { timeout: 30000 });

    const stanje = await page.evaluate(() => {
      const ed = document.getElementById('editor-page');
      const g = document.getElementById('edGuard');
      return {
        cuvar: !!(g && !g.hidden && getComputedStyle(g).display !== 'none'),
        poruka: (document.getElementById('edGuardMsg') || {}).textContent.trim(),
        editorAktivan: !!(ed && ed.classList.contains('active')),
        editorSadrzaj: ed ? ed.innerHTML.trim().length : -1
      };
    });

    expect(stanje.cuvar, 'čuvar nije vidljiv → neprijavljeni gleda editor').toBe(true);
    expect(stanje.editorAktivan, 'Studio je AKTIVAN bez prijave').toBe(false);
    // Prazan editor je točno ono čega se K1 bojao: ljuska bez sadržaja, ali s adresom.
    expect(stanje.editorSadrzaj, 'Studio je nešto nacrtao bez prijave').toBe(0);

    // Poruka mora biti PREVEDENA: `t()` na nepoznat ključ vraća sam ključ, pa bi
    // „editor.signInFirst" na ekranu bio tihi kvar rječnika koji nitko ne bi prijavio.
    expect(stanje.poruka.length, 'čuvar šuti').toBeGreaterThan(0);
    expect(stanje.poruka, 'na ekranu je i18n KLJUČ, ne prijevod').not.toMatch(/^editor\./);

    expect(greske, 'stranica se podiže s greškama: ' + greske.join(' · ')).toHaveLength(0);
  });

  test('gumb povratka vodi u vlastite materijale, ne u prazno', async ({ page }) => {
    await bezTrake(page);
    await page.goto('/editor.html');
    await page.waitForSelector('#edGuardBack:visible', { timeout: 30000 });

    await page.click('#edGuardBack');
    await page.waitForURL(/#\/materials$/, { timeout: 15000 });
    await page.waitForSelector('#materials-page.active', { timeout: 15000 });
  });
});
