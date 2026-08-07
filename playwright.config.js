const { defineConfig } = require('@playwright/test');
// .env (gitignored) donosi TEST_ADMIN_* za authenticated suite. Opcionalno — ako dotenv
// nije instaliran ili .env ne postoji, config i dalje radi (env dolazi iz shella/CI-a).
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const PORT = 5050;

// Custom iPhone-like viewports (Playwright's built-in devices lag behind newest models).
const iphone = (width, height) => ({
  viewport: { width, height },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
    '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
});

// Authenticated (admin) suite runs ONLY when a dedicated test-admin credential is provided
// (locally via .env, in CI via secrets). Without it, the default suite is unchanged and
// deterministic (no network/auth). Vidi docs/workflow/TESTING.md + [[live-login-verifies-crud]].
// Prod creds (TEST_ADMIN_*) ILI staging creds (STAGING_*, U1) → authed suite se aktivira.
// Kad su STAGING_* postavljeni, auth.setup preusmjeri prijavu/testove na staging (prod audit čist).
const AUTHED = !!(
  (process.env.TEST_ADMIN_EMAIL && process.env.TEST_ADMIN_PASSWORD) ||
  (process.env.STAGING_SUPABASE_URL && process.env.STAGING_SUPABASE_ANON &&
   process.env.STAGING_TEST_ADMIN_EMAIL && process.env.STAGING_TEST_ADMIN_PASSWORD)
);

// App-testovi (iPhone profili) NE SMIJU pokupiti:
//   • unit/** (Node testovi s top-level process.exit → prekinuli bi browser run),
//   • auth.setup.js / *.authed.spec.js (traže admin-sesiju; njih vozi `authenticated` projekt).
// NB: per-project testIgnore GAZI globalni → 'unit/**' MORA biti i ovdje.
const APP_TEST_IGNORE = ['unit/**', /auth\.setup\.js$/, /\.authed\.spec\.js$/];

const iphoneProjects = [
  { name: 'iPhone-SE-375',          testIgnore: APP_TEST_IGNORE, use: iphone(375, 667) },
  { name: 'iPhone-15Pro-393',       testIgnore: APP_TEST_IGNORE, use: iphone(393, 852) },
  { name: 'iPhone-15ProMax-430',    testIgnore: APP_TEST_IGNORE, use: iphone(430, 932) },
  { name: 'iPhone-15Pro-landscape', testIgnore: APP_TEST_IGNORE, use: iphone(852, 393) },
];

// Setup se prijavi jednom i spremi storageState; `authenticated` ga reusea za *.authed.spec.js.
const authedProjects = AUTHED ? [
  { name: 'auth-setup', testMatch: /auth\.setup\.js$/ },
  {
    name: 'authenticated',
    testMatch: /\.authed\.spec\.js$/,
    dependencies: ['auth-setup'],
    use: {
      viewport: { width: 1280, height: 800 },
      storageState: 'tests/.auth/admin.json',
    },
  },
] : [];

module.exports = defineConfig({
  testDir: './tests',
  // Node unit tests (tests/unit/*.test.js) run via `npm run test:unit`, NOT Playwright.
  // Without this, Playwright's default testMatch picks up *.test.js, executes its
  // top-level process.exit(), and aborts the whole browser run.
  testIgnore: ['unit/**'],
  // Per-test timeout. Raised 60s→120s: the suite now sweeps 12 subjects and the
  // responsive test takes a fullPage screenshot of each Learn page. Content-rich
  // pages (esp. KaTeX-heavy Microeconomics with many rendered nodes) make those
  // screenshots slow, tipping the sweep past 60s. No functional regression.
  timeout: 120000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: 'only-on-failure',
    // Service Worker (F3 3A) se registrira iz index.html. App-testovi ga BLOKIRAJU da bi
    // logika (npr. dual-read DB→JSON→.js fallback preko page.route) bila deterministička —
    // SW presreće same-origin fetcheve. SW se testira izolirano u sw.spec.js (test.use allow).
    serviceWorkers: 'block',
  },
  webServer: {
    command: 'node scripts/static-server.js',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [...iphoneProjects, ...authedProjects],
});
