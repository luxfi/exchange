import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.BASE_URL || "http://localhost:3001"

export default defineConfig({
  testDir: "./apps/web/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Only start local dev server when testing locally (not in CI with BASE_URL)
  ...(!process.env.BASE_URL && {
    webServer: {
      command: "pnpm web dev --port 3001",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  }),
})
