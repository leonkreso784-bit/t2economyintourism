const { defineConfig } = require('@playwright/test');

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

module.exports = defineConfig({
  testDir: './tests',
  // Node unit tests (tests/unit/*.test.js) run via `npm run test:unit`, NOT Playwright.
  // Without this, Playwright's default testMatch picks up *.test.js, executes its
  // top-level process.exit(), and aborts the whole browser run.
  testIgnore: ['unit/**'],
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node scripts/static-server.js',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    { name: 'iPhone-SE-375',        use: iphone(375, 667) },
    { name: 'iPhone-15Pro-393',     use: iphone(393, 852) },
    { name: 'iPhone-15ProMax-430',  use: iphone(430, 932) },
    { name: 'iPhone-15Pro-landscape', use: iphone(852, 393) },
  ],
});
