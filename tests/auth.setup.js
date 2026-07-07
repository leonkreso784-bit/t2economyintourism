// Playwright AUTH SETUP — prijavi se kao admin JEDNOM i spremi sesiju (storageState) za
// `authenticated` projekt (playwright.config.js). Pokreće se SAMO kad su TEST_ADMIN_EMAIL/
// TEST_ADMIN_PASSWORD postavljeni (config tada doda ovaj projekt).
//
// Supabase klijent koristi DEFAULT persistenciju (persistSession:true, storage:localStorage) →
// sesija završi u localStorage, a Playwright storageState ga uhvati. Prijavljujemo se kroz
// APLIKACIJIN klijent (SokratAuth.getClient()) → točno isti put kao pravi korisnik.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const AUTH_DIR = path.join(__dirname, '.auth');
const AUTH_FILE = path.join(AUTH_DIR, 'admin.json');

test('authenticate as admin', async ({ page }) => {
  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;

  await page.goto('/');

  // supabase-js CDN se učita async nakon DOMContentLoaded → pričekaj klijent.
  await page.waitForFunction(
    () => typeof SokratAuth !== 'undefined' && typeof SokratAuth.getClient === 'function' && !!SokratAuth.getClient(),
    null,
    { timeout: 25000 }
  );

  const result = await page.evaluate(async ({ email, password }) => {
    const c = SokratAuth.getClient();
    const signIn = await c.auth.signInWithPassword({ email, password });
    if (signIn.error) return { ok: false, error: signIn.error.message };
    const rpc = await c.rpc('is_admin');
    return { ok: true, isAdmin: !!(rpc && rpc.data === true), rpcError: rpc && rpc.error ? rpc.error.message : null };
  }, { email, password });

  expect(result.ok, 'sign-in failed: ' + (result.error || '')).toBeTruthy();
  expect(result.isAdmin, 'signed in but NOT admin — postavi profiles.role=admin za taj account').toBeTruthy();

  // Pričekaj da SDK perzistira sesiju u localStorage prije snimanja.
  await page.waitForFunction(
    () => Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.includes('auth-token')),
    null,
    { timeout: 10000 }
  );

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
