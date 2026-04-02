import { defineConfig, devices } from '@playwright/test'

/**
 * Production e2e test config for critical path tests.
 * Tests against the live exchange.lux.network deployment.
 *
 * Usage:
 *   npx playwright test -c playwright.prod.config.ts
 *   BASE_URL=http://localhost:3000 npx playwright test -c playwright.prod.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: ['advanced.spec.ts', 'lux-explore.spec.ts', 'explore.spec.ts'],
  workers: 1,
  fullyParallel: false,
  retries: 2,
  reporter: 'list',
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://exchange.lux.network',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: './test-results',
})
