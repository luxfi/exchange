<<<<<<< HEAD
=======
/* oxlint-disable react-hooks/rules-of-hooks -- Playwright fixtures use `use()` which is not a React hook */
>>>>>>> upstream/main
import { type BrowserContext, test as base } from '@playwright/test'
import { createExtensionContext } from 'e2e/fixtures/extension-context'
import { waitForExtensionLoad } from 'e2e/utils/wait-for-extension'

interface ExtensionFixtures {
  context: BrowserContext
  extensionId: string
}

export const freshExtensionTest = base.extend<ExtensionFixtures>({
<<<<<<< HEAD
  // biome-ignore lint/correctness/noEmptyPattern: fixture file
=======
  // oxlint-disable-next-line no-empty-pattern -- fixture file
>>>>>>> upstream/main
  context: async ({}, use) => {
    const context = await createExtensionContext()
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    const { extensionId } = await waitForExtensionLoad(context, { timeout: 10000 })
    await use(extensionId)
  },
})

// Re-export the programmatic onboarded extension test fixture
export { onboardedExtensionTest } from './onboarded-extension.fixture'
