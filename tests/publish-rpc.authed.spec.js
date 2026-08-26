// U4 — PUBLISH-RPC E2E (STAGING): jedini write-put kroz pravi UI.
// Trajni regresijski spec (pravilo #8: write/draft tokovi se automatiziraju vs STAGING) —
// pokreće se SAMO u `authenticated` projektu sa STAGING_* env (staging seedan: seed-staging.js te2).
//
// Test 1 = puni ciklus: marker-edit → „Objavi" (publish_document RPC) → reload + re-enter
//          (svjež DB fetch dokazuje da je objava ŽIVA) → revert drugom objavom → original.
//          Staging na kraju sadržajno == početno stanje (verzije rastu — to je i smisao).
// Test 2 = konflikt: tuđa izmjena (out-of-band write bumpa version) između ulaska u draft
//          i objave → RPC odbija, NIŠTA nije upisano, draft (rad korisnika) preživi.
const { test, expect } = require('@playwright/test');
// T6: editor ima vlastitu adresu — gdje točno, zna helper (jedno mjesto, ne sedamnaest).
const { otvoriAdminPreglednik } = require('./helpers/studio-entry');

const MARKER = 'U4-E2E-MARKER pitanje (publish-RPC, smije se obrisati)';
const KONFLIKT = 'U4-KONFLIKT tekst (ne smije nikad završiti u bazi)';

/** Otvori admin → te2 + prva lekcija → uđi u draft-mod (kopija helpera iz admin-detect speca). */
async function openLessonInDraftMode(page) {
  await otvoriAdminPreglednik(page);
  await page.waitForSelector('#admin-page.active #adminSubjectSel');
  await page.evaluate(() => {
    const sel = document.getElementById('adminSubjectSel');
    const te2 = sel.querySelector('option[value="te2"]');
    sel.value = te2 ? 'te2' : sel.querySelector('option[value]:not([value=""])').value;
    sel.dispatchEvent(new Event('change'));
  });
  await page.waitForFunction(() => {
    const l = document.getElementById('adminLessonSel');
    return l && !l.disabled && !!l.querySelector('option[value]:not([value=""]):not([disabled])');
  });
  await page.evaluate(() => {
    const l = document.getElementById('adminLessonSel');
    l.value = l.querySelector('option[value]:not([value=""]):not([disabled])').value;
    l.dispatchEvent(new Event('change'));
  });
  await page.waitForSelector('#adminDraftBtn', { timeout: 20000 });
  await page.click('#adminDraftBtn');
  await page.waitForSelector('#adminCards .admin-edit-btn', { timeout: 20000 });
}

/** Otvori editor prve kartice i vrati trenutno pitanje (za marker/revert). */
async function openFirstCardEditor(page) {
  await page.locator('#adminCards [data-admin-edit][data-type="flashcard"]').first().click();
  await page.waitForSelector('#adminEditModal #adminEditQ');
  return page.inputValue('#adminEditQ');
}

/** Spremi otvoreni editor u draft pa „Objavi"; čeka izlaz iz draft-moda (= RPC uspio). */
async function saveAndPublish(page) {
  await page.click('#adminEditSave');
  await page.waitForSelector('.admin-editbar__count');
  await page.click('#adminPublishBtn');
  await page.waitForSelector('#adminDraftBtn', { timeout: 20000 }); // draft-mod zatvoren = objava OK
}

test('U4 — publish-ciklus kroz UI: marker → Objavi (RPC) → svjež DB dokaz → revert → original', async ({ page }) => {
  await openLessonInDraftMode(page);

  // 1) Marker-edit → Objavi (kroz publish_document; izlaz iz draft-moda = uspjeh).
  const original = await openFirstCardEditor(page);
  expect(original).not.toContain('U4-E2E-MARKER'); // preduvjet: čisto početno stanje
  await page.fill('#adminEditQ', MARKER);
  await saveAndPublish(page);

  // 2) Dokaz da je objava ŽIVA: reload ubija in-memory draft i window-varove →
  //    re-enter radi SVJEŽ DB fetch (SokratDraft.begin) → marker mora doći iz baze.
  await page.reload();
  await openLessonInDraftMode(page);
  const fresh = await openFirstCardEditor(page);
  expect(fresh).toBe(MARKER);

  // 3) Revert drugom objavom (ista staza) → nakon reloada baza opet vraća original.
  await page.fill('#adminEditQ', original);
  await saveAndPublish(page);
  await page.reload();
  await openLessonInDraftMode(page);
  const reverted = await openFirstCardEditor(page);
  expect(reverted).toBe(original);

  // izađi uredno (ništa dirty — Odbaci bez potvrde ne treba; zatvori editor + draft)
  await page.evaluate(() => { const m = document.getElementById('adminEditModal'); if (m && m.close) m.close(); });
});

test('U4 — konflikt: tuđa izmjena između drafta i objave → RPC odbija, draft preživi, ništa u bazi', async ({ page }) => {
  await openLessonInDraftMode(page);

  // 1) Lokalni edit u draft (autosave usput zapisuje varName — javna površina za korak 2).
  await openFirstCardEditor(page);
  await page.fill('#adminEditQ', KONFLIKT);
  await page.click('#adminEditSave');
  await page.waitForSelector('.admin-editbar__count');

  // 2) „Drugi admin": out-of-band write ISTOG reda (identičan payload — touch trigger svejedno
  //    bumpa version). SokratAuth je GOLI leksički global (CLAUDE.md gotcha), ne window.SokratAuth.
  const bumped = await page.evaluate(async () => {
    const k = Object.keys(localStorage).find((x) => x.indexOf('sokrat-draft:') === 0);
    const varName = JSON.parse(localStorage.getItem(k)).varName;
    const client = SokratAuth.getClient();
    const sel = await client.from('subject_content').select('payload,version')
      .eq('subject_id', 'te2').eq('var_name', varName).single();
    if (sel.error) return { ok: false, err: sel.error.message };
    const upd = await client.from('subject_content').update({ payload: sel.data.payload })
      .eq('subject_id', 'te2').eq('var_name', varName);
    return { ok: !upd.error, before: sel.data.version, err: upd.error && upd.error.message };
  });
  expect(bumped.ok).toBe(true);

  // 3) Objavi → publish_version_conflict: konflikt-toast, draft-mod OSTAJE (rad nije izgubljen),
  //    gumb se re-enable-a za idući pokušaj.
  await page.click('#adminPublishBtn');
  await page.waitForFunction(() => document.body.innerText.indexOf('changed elsewhere') !== -1, null, { timeout: 20000 });
  await expect(page.locator('.admin-editbar.is-active')).toBeVisible();
  expect(await page.locator('.admin-editbar__count').textContent()).toBe('1');
  await page.waitForFunction(() => !document.getElementById('adminPublishBtn').disabled);

  // 4) Konflikt-tekst NIJE u bazi (svjež read mimo drafta).
  const inDb = await page.evaluate(async () => {
    const k = Object.keys(localStorage).find((x) => x.indexOf('sokrat-draft:') === 0);
    const varName = JSON.parse(localStorage.getItem(k)).varName;
    const client = SokratAuth.getClient();
    const sel = await client.from('subject_content').select('payload')
      .eq('subject_id', 'te2').eq('var_name', varName).single();
    return JSON.stringify(sel.data.payload).indexOf('U4-KONFLIKT') !== -1;
  });
  expect(inDb).toBe(false);

  // 5) Pospremi: Odbaci (potvrda) → draft i autosave čisti.
  await page.click('#adminDiscardBtn');
  await page.waitForSelector('sokrat-confirm .sokrat-confirm__ok', { state: 'visible' });
  await page.click('sokrat-confirm .sokrat-confirm__ok');
  await page.waitForSelector('#adminDraftBtn');
});
