import { defineConfig, devices } from '@playwright/test'

/**
 * Explore page e2e test config.
 *
 * Usage:
 *   # Test against production
 *   BASE_URL=https://lux.exchange npx playwright test -c playwright.explore.config.ts
 *
 *   # Test against local dev server
 *   BASE_URL=http://localhost:3000 npx playwright test -c playwright.explore.config.ts
 *
 *   # Default: https://lux.exchange
 *   npx playwright test -c playwright.explore.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'explore.spec.ts',
  workers: 1,
  fullyParallel: false,
  retries: 1,
  reporter: 'list',
  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://lux.exchange',
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
