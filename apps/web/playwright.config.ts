import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import ms from 'ms'
import path from 'path'

// Load environment variables from .env file
// This ensures the VSCode Playwright extension has access to env vars
config({ path: path.resolve(__dirname, '.env') })

const IS_CI = process.env.CI === 'true'

// Handle asset files and platform-specific imports for Node.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Module = require('module')

// Mirror Vite alias mappings for @luxamm/* → @lux/* so Playwright can resolve them
const LUXDEX_ALIAS_MAP: Record<string, string> = {
  '@luxamm/sdk-core': '@luxamm/sdk-core',
  '@luxamm/universal-router-sdk': '@luxamm/universal-router-sdk',
  '@luxamm/permit2-sdk': '@luxamm/permit2-sdk',
  '@luxamm/v2-sdk': '@luxamm/v2-sdk',
  '@luxamm/v3-sdk': '@luxamm/v3-sdk',
  '@luxamm/v4-sdk': '@luxamm/v4-sdk',
  '@luxamm/client-platform-service': '@luxamm/client-platform-service',
  '@luxamm/client-notification-service': '@luxamm/client-notification-service',
  '@luxamm/client-data-api': '@luxamm/client-data-api',
  '@luxamm/client-trading': '@luxamm/client-trading',
  '@luxamm/client-for': '@luxamm/client-for',
  '@luxamm/client-liquidity': '@luxamm/client-liquidity',
  '@luxamm/permit': '@luxamm/permit2-sdk',
  '@luxamm/client-explore': '@luxamm/client-explore',
  '@luxamm/client-search': '@luxamm/client-search',
  '@luxamm/analytics-events': '@luxamm/analytics-events',
  '@luxamm/conedison': '@luxamm/analytics',
}

// Override module resolution to handle platform-specific files like Vite does
const originalResolveFilename = Module._resolveFilename
Module._resolveFilename = function (request: string, parent: any) {
  // Resolve @luxamm/* → @lux/* aliases (mirrors vite.config.mts resolve.alias)
  for (const [prefix, target] of Object.entries(LUXDEX_ALIAS_MAP)) {
    if (request === prefix || request.startsWith(prefix + '/')) {
      request = request.replace(prefix, target)
      break
    }
  }

  // For getConfig imports, try .web variant first (mimics Vite behavior)
  // Use precise matching to avoid false positives with modules containing 'getConfig' as substring
  if (request.endsWith('/getConfig') || request.endsWith('\\getConfig') || request === 'getConfig') {
    // Try different .web patterns to match how Vite resolves extensions
    const webVariants = [
      `${request}.web`,
      request.endsWith('.js') ? request.replace(/\.js$/, '.web.js') : `${request}.web.js`,
    ]

    for (const webVariant of webVariants) {
      try {
        return originalResolveFilename.call(this, webVariant, parent)
      } catch {
        // Continue trying other variants
      }
    }
  }

  return originalResolveFilename.call(this, request, parent)
}

const originalLoad = Module._load
Module._load = function (...args: any[]) {
  const [request] = args
  if (request.match(/\.(png|svg|mp4)$/)) {
    return `mock-${path.basename(request)}`
  }
  return originalLoad.apply(this, args)
}

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.test.ts',
  globalTeardown: './src/playwright/anvil/global-teardown.ts',
  workers: 1, // this is manually configured in the github action depending on type of tests
  fullyParallel: false,
  maxFailures: IS_CI ? 10 : undefined,
  retries: IS_CI ? 3 : 0,
  reporter: IS_CI && process.env.REPORT_TO_SLACK ? [['blob'], ['list']] : 'list',
  timeout: ms('120s'),
  expect: {
    timeout: ms('15s'),
  },
  use: {
    actionTimeout: ms('30s'),
    screenshot: 'off',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://localhost:9000',
    headless: true,
    extraHTTPHeaders: {
      origin: process.env.BASE_URL || 'http://localhost:9000',
    },
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: './test-results',
  // Only start local dev server when BASE_URL is not set (testing locally)
  ...(process.env.BASE_URL ? {} : {
    webServer: {
      command: 'pnpm dev',
      url: 'http://localhost:9000',
      reuseExistingServer: true,
      timeout: ms('120s'),
    },
  }),
})
