  // oxlint-disable-next-line no-empty-pattern -- fixture file
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
