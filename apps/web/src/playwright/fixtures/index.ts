// oxlint-disable-next-line no-restricted-imports -- playwright test utilities needed for test fixtures
import { mergeTests } from '@playwright/test'
import { test as analyticsTest } from '~/playwright/fixtures/analytics'
import { test as anvilTest } from '~/playwright/fixtures/anvil'
import { test as dataApiTest } from '~/playwright/fixtures/dataApi'
import { test as graphqlTest } from '~/playwright/fixtures/graphql'
import { test as tradingApiTest } from '~/playwright/fixtures/tradingApi'

/* oxlint-disable no-restricted-imports -- playwright re-export needed for test framework */
// oxlint-disable-next-line no-restricted-syntax
// oxlint-disable-next-line no-restricted-imports -- biome-parity: oxlint is stricter here
export * from '@playwright/test'

/* oxlint-enable no-restricted-imports */

// Configuration interface for test fixtures
interface TestConfig {
  withAnvil?: boolean
}

// Get the merged test types
const getAnvilTest = () => mergeTests(anvilTest, graphqlTest, analyticsTest, tradingApiTest, dataApiTest)
const getBaseTest = () => mergeTests(graphqlTest, analyticsTest, tradingApiTest, dataApiTest)

// Type for test with anvil
type AnvilTest = ReturnType<typeof getAnvilTest>

// Type for test without anvil
type BaseTest = ReturnType<typeof getBaseTest>

// Factory function to get the appropriate test fixture with overloads
export function getTest(config: { withAnvil: true }): AnvilTest
export function getTest(config?: { withAnvil?: false }): BaseTest
export function getTest(config: TestConfig = {}): BaseTest | AnvilTest {
  if (config.withAnvil) {
    // Return test with all fixtures including anvil for blockchain tests
    return getAnvilTest()
  }
  // Return test without anvil for regular e2e tests
  return getBaseTest()
}

export type GetTestResult = ReturnType<typeof getTest>
