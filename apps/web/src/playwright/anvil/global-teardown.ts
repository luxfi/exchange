import { getAnvilManager } from '~/playwright/anvil/anvil-manager'

/**
 * Global teardown function for Playwright tests using Anvil.
 * Ensures Anvil is cleanly stopped after all tests complete.
 */
// this is used in playwright.config.ts
<<<<<<< HEAD
// eslint-disable-next-line import/no-unused-modules
=======
// oxlint-disable-next-line import/no-unused-modules
>>>>>>> upstream/main
export default async function globalTeardown() {
  console.log('Stopping Anvil after all tests...')
  await getAnvilManager().stop()
}
