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

// Mirror Vite alias mappings for @luxdex/* → @lux/* so Playwright can resolve them
const LUXDEX_ALIAS_MAP: Record<string, string> = {
  '@luxdex/sdk-core': '@uniswap/sdk-core',
  '@luxdex/universal-router-sdk': '@uniswap/universal-router-sdk',
  '@luxdex/permit2-sdk': '@uniswap/permit2-sdk',
  '@luxdex/v2-sdk': '@uniswap/v2-sdk',
  '@luxdex/v3-sdk': '@uniswap/v3-sdk',
  '@luxdex/v4-sdk': '@uniswap/v4-sdk',
  '@luxdex/client-platform-service': '@uniswap/client-platform-service',
  '@luxdex/client-notification-service': '@uniswap/client-notification-service',
  '@luxdex/client-data-api': '@uniswap/client-data-api',
  '@luxdex/client-trading': '@uniswap/client-trading',
  '@luxdex/client-for': '@uniswap/client-for',
  '@luxdex/client-liquidity': '@uniswap/client-liquidity',
  '@luxdex/permit': '@uniswap/permit2-sdk',
  '@luxdex/client-explore': '@uniswap/client-explore',
  '@luxdex/client-search': '@uniswap/client-search',
  '@luxdex/analytics-events': '@uniswap/analytics-events',
  '@luxdex/conedison': '@uniswap/analytics',
}

// Override module resolution to handle platform-specific files like Vite does
const originalResolveFilename = Module._resolveFilename
Module._resolveFilename = function (request: string, parent: any) {
  // Resolve @luxdex/* → @lux/* aliases (mirrors vite.config.mts resolve.alias)
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
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:9000',
    reuseExistingServer: !IS_CI,
    timeout: ms('120s'),
  },
})
