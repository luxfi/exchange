import { expect } from '@playwright/test'
import { onboardedExtensionTest as test } from 'e2e/fixtures/extension.fixture'
import { waitForBackgroundReady } from 'e2e/utils/extension-helpers'

<<<<<<< HEAD
test.describe('Wallet Connection to Lux', () => {
  test('extension is detected by Lux app', async ({ context }) => {
    // Ensure background script is ready
    await waitForBackgroundReady(context)

    // Open Lux app in a new tab
    const luxPage = await context.newPage()
    await luxPage.goto('https://app.lux.org', { waitUntil: 'domcontentloaded' })

    // Wait a bit for the ethereum provider to be injected
    await luxPage.waitForTimeout(3000)

    // Check that window.ethereum exists
    const hasEthereumProvider = await luxPage.evaluate(() => {
=======
test.describe('Wallet Connection to Uniswap', () => {
  test('extension is detected by Uniswap app', async ({ context }) => {
    // Ensure background script is ready
    await waitForBackgroundReady(context)

    // Open Uniswap app in a new tab
    const uniswapPage = await context.newPage()
    await uniswapPage.goto('https://app.uniswap.org', { waitUntil: 'domcontentloaded' })

    // Wait a bit for the ethereum provider to be injected
    await uniswapPage.waitForTimeout(3000)

    // Check that window.ethereum exists
    const hasEthereumProvider = await uniswapPage.evaluate(() => {
>>>>>>> upstream/main
      return typeof window.ethereum !== 'undefined'
    })
    expect(hasEthereumProvider).toBe(true)

    // Check if the provider is properly injected and functional
<<<<<<< HEAD
    const providerInfo = await luxPage.evaluate(() => {
=======
    const providerInfo = await uniswapPage.evaluate(() => {
>>>>>>> upstream/main
      if (!window.ethereum) {
        return null
      }
      return {
        hasRequest: typeof (window.ethereum as any).request === 'function',
        hasOn: typeof (window.ethereum as any).on === 'function',
        isMetaMask: (window.ethereum as any).isMetaMask || false,
        // Get all properties for debugging
        properties: Object.getOwnPropertyNames(window.ethereum).sort(),
      }
    })

    expect(providerInfo).not.toBeNull()
    expect(providerInfo?.hasRequest).toBe(true)
    expect(providerInfo?.hasOn).toBe(true)

<<<<<<< HEAD
    // The Lux extension presents itself as MetaMask-compatible
=======
    // The Uniswap extension presents itself as MetaMask-compatible
>>>>>>> upstream/main
    expect(providerInfo?.isMetaMask).toBe(true)
  })
})
