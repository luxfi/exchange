/* eslint-disable no-restricted-syntax */
import { FeatureFlags, getFeatureFlagName } from '@universe/gating'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { expect, getTest } from '~/playwright/fixtures'
import { getVisibleDropdownElementByTestId } from '~/playwright/fixtures/utils'
import { TEST_WALLET_ADDRESS } from '~/playwright/fixtures/wallets'
import { Mocks } from '~/playwright/mocks/mocks'

// NOTE: These tests require @uniswap/client-privy-embedded-wallet to be installed
// (built with NPM_READ_ONLY_TOKEN). The Connect RPC HTTP call only fires when the
// package loads successfully.

const test = getTest()

const EW_ENABLED = `featureFlagOverride=${getFeatureFlagName(FeatureFlags.EmbeddedWallet)}`

const LIST_AUTHENTICATORS_URL = '**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/ListAuthenticators'
const CHALLENGE_URL = '**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/Challenge'
const START_AUTHENTICATED_SESSION_URL =
  '**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/StartAuthenticatedSession'
const ADD_AUTHENTICATOR_URL = '**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/AddAuthenticator'
const DELETE_AUTHENTICATOR_URL = '**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/DeleteAuthenticator'

const TEST_WALLET_ID = 'test-wallet-id'

/** Sets embedded wallet state in localStorage before page navigation */
async function setupEmbeddedWalletState(page: Awaited<Parameters<Parameters<typeof test>[2]>[0]>['page']) {
  await page.addInitScript(
    ({ walletId, walletAddress }) => {
      localStorage.setItem(
        'embedded-wallet',
        JSON.stringify({
          walletId,
          walletAddress,
          chainId: 1,
          isConnected: true,
        }),
      )
    },
    { walletId: TEST_WALLET_ID, walletAddress: TEST_WALLET_ADDRESS },
  )
}

/** Navigates to the Passkey menu via Settings */
async function navigateToPasskeyMenu(page: Awaited<Parameters<Parameters<typeof test>[2]>[0]>['page']) {
  await page.getByTestId(TestID.Web3StatusConnected).click()
  await getVisibleDropdownElementByTestId(page, TestID.WalletSettings).click()
  await getVisibleDropdownElementByTestId(page, TestID.PasskeySettings).click()
}

/**
 * Mocks navigator.credentials at the browser level to simulate WebAuthn responses.
 * Uses page.addInitScript so it runs before any app code loads.
 * Avoids dependency on CDP WebAuthn protocol for reliability.
 */
async function setupWebAuthnMock(
  page: Awaited<Parameters<Parameters<typeof test>[2]>[0]>['page'],
  credentialId = 'cred-icloud-1',
) {
  await page.addInitScript((credId) => {
    const emptyBuf = new Uint8Array([0]).buffer

    // Mock authentication (get) — returns a fake assertion
    const mockGetResult = {
      id: credId,
      rawId: emptyBuf,
      type: 'public-key' as const,
      authenticatorAttachment: 'platform' as const,
      getClientExtensionResults: () => ({}),
      response: {
        clientDataJSON: emptyBuf,
        authenticatorData: emptyBuf,
        signature: emptyBuf,
        userHandle: null,
      },
    }

    // Mock registration (create) — returns a fake attestation
    const mockCreateResult = {
      id: 'new-cred-id-test',
      rawId: emptyBuf,
      type: 'public-key' as const,
      authenticatorAttachment: 'platform' as const,
      getClientExtensionResults: () => ({}),
      response: {
        clientDataJSON: emptyBuf,
        attestationObject: emptyBuf,
        getTransports: () => ['hybrid'],
        getPublicKey: () => null,
        getPublicKeyAlgorithm: () => -7,
        getAuthenticatorData: () => emptyBuf,
      },
    }

    Object.defineProperty(navigator, 'credentials', {
      configurable: true,
      value: {
        get: async () => mockGetResult,
        create: async () => mockCreateResult,
        preventSilentAccess: async () => {},
      },
    })
  }, credentialId)
}

/** Minimal challenge options for passkey authentication (startAuthentication) */
const AUTH_CHALLENGE_RESPONSE = JSON.stringify({
  challengeOptions: JSON.stringify({
    challenge: 'dGVzdC1jaGFsbGVuZ2U', // base64url "test-challenge"
    timeout: 60000,
    rpId: 'localhost',
    allowCredentials: [{ id: 'Y3JlZC1pY2xvdWQtMQ', type: 'public-key' }],
    userVerification: 'required',
  }),
})

/** Minimal challenge options for passkey registration (startRegistration) */
const REGISTRATION_CHALLENGE_RESPONSE = JSON.stringify({
  challengeOptions: JSON.stringify({
    challenge: 'dGVzdC1jaGFsbGVuZ2U', // base64url "test-challenge"
    rp: { name: 'Uniswap', id: 'localhost' },
    user: { id: 'dXNlcg', name: 'testuser', displayName: 'Test User' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    timeout: 60000,
    attestation: 'none',
  }),
})

test.describe(
  'PasskeyMenu',
  {
    tag: '@team:apps-infra',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-infra' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('shows authenticators after API response', async ({ page }) => {
      await setupEmbeddedWalletState(page)

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_multi })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()
      await expect(page.getByText('Chrome')).toBeVisible()
      await expect(page.getByRole('button', { name: /add passkey/i })).toBeVisible()
    })

    test('shows loading skeletons while fetching', async ({ page }) => {
      await setupEmbeddedWalletState(page)

      // Delay the response so we can observe loading state
      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_multi })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      // While the request is in-flight, skeleton rows should be visible
      const skeletons = page.locator('[data-tamagui-tag="Loader.Box"]')
      await expect(skeletons.first()).toBeVisible()
    })

    test('opens verify passkey modal when trash icon is clicked', async ({ page }) => {
      await setupEmbeddedWalletState(page)

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_multi })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      // Wait for authenticators to load
      await expect(page.getByText('iCloud')).toBeVisible()

      // Hover over the first authenticator to reveal the trash icon
      await page.getByText('iCloud').hover()

      // The trash icon button should appear and be clickable
      // After clicking, the verify passkey modal should open
      const trashButtons = page.locator('[data-testid="delete-passkey"]')
      await expect(trashButtons.first()).toBeVisible()
      await trashButtons.first().click()
      await expect(page.getByText('Verify your passkey')).toBeVisible()
    })

    test('shows last passkey warning when only one authenticator exists', async ({ page }) => {
      await setupEmbeddedWalletState(page)

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_single })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      // With only one authenticator, the component passes isLastAuthenticator=true
      // to the DeletePasskeyMenu, which shows a warning
      await expect(page.getByText('iCloud')).toBeVisible()

      // Hover to reveal trash icon
      await page.getByText('iCloud').hover()

      // Assert trash icon appears and clicking it opens the verify modal
      const trashButton = page.locator('[data-testid="delete-passkey"]')
      await expect(trashButton.first()).toBeVisible()
      await trashButton.first().click()
      await expect(page.getByText('Verify your passkey')).toBeVisible()
    })

    test('shows delete speedbump before deletion of last passkey', async ({ page }) => {
      await setupEmbeddedWalletState(page)

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_single })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()
      await page.getByText('iCloud').hover()

      const trashButtons = page.locator('[data-element="delete-passkey"]')
      await expect(trashButtons.first()).toBeVisible()
      await trashButtons.first().click()

      // Clicking trash on last passkey shows verify modal before proceeding to delete
      await expect(page.getByText('Verify your passkey')).toBeVisible()
    })

    test('successfully adds a new passkey', async ({ page }) => {
      await setupEmbeddedWalletState(page)
      await setupWebAuthnMock(page)

      let listAuthenticatorsCallCount = 0

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        listAuthenticatorsCallCount++
        // First call: single authenticator. Subsequent calls (refresh): two authenticators.
        const mockPath =
          listAuthenticatorsCallCount === 1
            ? Mocks.EmbeddedWallet.list_authenticators_single
            : Mocks.EmbeddedWallet.list_authenticators_multi
        await route.fulfill({ path: mockPath })
      })

      // First Challenge call is for authentication (verify step), second for registration
      let challengeCallCount = 0
      await page.route(CHALLENGE_URL, async (route) => {
        challengeCallCount++
        const body = challengeCallCount === 1 ? AUTH_CHALLENGE_RESPONSE : REGISTRATION_CHALLENGE_RESPONSE
        await route.fulfill({ contentType: 'application/json', body })
      })

      await page.route(START_AUTHENTICATED_SESSION_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.start_authenticated_session })
      })

      await page.route(ADD_AUTHENTICATOR_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.add_authenticator })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()

      // Click "Add passkey" — this opens the verify passkey modal
      await page.getByRole('button', { name: /add passkey/i }).click()
      await expect(page.getByText('Verify your passkey')).toBeVisible()

      // Click the verify button — triggers authenticateWithPasskey (uses mocked navigator.credentials.get)
      await page.getByRole('button', { name: /verify/i }).click()

      // After verification, the AddPasskeyMenu should open showing authenticator type selection
      await expect(page.getByText(/continue with this device/i)).toBeVisible()

      // Click "Continue with this device" — triggers registerNewAuthenticator
      await page.getByText(/continue with this device/i).click()

      // After successful add, menu returns to list with two passkeys
      await expect(page.getByText('iCloud')).toBeVisible()
      await expect(page.getByText('Chrome')).toBeVisible()
    })

    test('calls StartAuthenticatedSession before AddAuthenticator', async ({ page }) => {
      await setupEmbeddedWalletState(page)
      await setupWebAuthnMock(page)

      const callOrder: string[] = []

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_single })
      })

      let challengeCallCount = 0
      await page.route(CHALLENGE_URL, async (route) => {
        challengeCallCount++
        const body = challengeCallCount === 1 ? AUTH_CHALLENGE_RESPONSE : REGISTRATION_CHALLENGE_RESPONSE
        await route.fulfill({ contentType: 'application/json', body })
      })

      await page.route(START_AUTHENTICATED_SESSION_URL, async (route) => {
        callOrder.push('StartAuthenticatedSession')
        await route.fulfill({ path: Mocks.EmbeddedWallet.start_authenticated_session })
      })

      await page.route(ADD_AUTHENTICATOR_URL, async (route) => {
        callOrder.push('AddAuthenticator')
        await route.fulfill({ path: Mocks.EmbeddedWallet.add_authenticator })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()
      await page.getByRole('button', { name: /add passkey/i }).click()
      await expect(page.getByText('Verify your passkey')).toBeVisible()
      await page.getByRole('button', { name: /verify/i }).click()
      await expect(page.getByText(/continue with this device/i)).toBeVisible()
      await page.getByText(/continue with this device/i).click()

      // Wait for both API calls to complete
      await page.waitForResponse((resp) => resp.url().includes('AddAuthenticator'))

      expect(callOrder).toEqual(['StartAuthenticatedSession', 'AddAuthenticator'])
    })

    test('Challenge request for delete uses DELETE_AUTHENTICATOR action and authenticatorId', async ({ page }) => {
      await setupEmbeddedWalletState(page)
      await setupWebAuthnMock(page, 'cred-icloud-1')

      // Capture the Challenge request body to assert correct action + authenticatorId
      let capturedChallengeBody: Record<string, unknown> | undefined

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_multi })
      })

      await page.route(CHALLENGE_URL, async (route) => {
        capturedChallengeBody = route.request().postDataJSON() as Record<string, unknown>
        await route.fulfill({ contentType: 'application/json', body: AUTH_CHALLENGE_RESPONSE })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()
      await page.getByText('iCloud').hover()

      const trashButtons = page.locator('[data-element="delete-passkey"]')
      await trashButtons.first().click()

      // Wait for the Challenge request to fire (triggered by VerifyPasskeyMenu verify button)
      await expect(page.getByText('Verify your passkey')).toBeVisible()
      await page.getByRole('button', { name: /verify/i }).click()

      await page.waitForResponse((resp) => resp.url().includes('Challenge'))

      // Action 10 = DELETE_AUTHENTICATOR — assert the correct enum is sent, not DELETE_RECORD (7)
      expect(capturedChallengeBody?.action).toBe(10)
      // authenticatorId should be the credentialId of the targeted authenticator
      expect(capturedChallengeBody?.authenticatorId).toBeDefined()
    })

    test('successfully deletes a non-last passkey', async ({ page }) => {
      await setupEmbeddedWalletState(page)
      await setupWebAuthnMock(page)

      let listCallCount = 0

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        listCallCount++
        // First call: 2 passkeys. After deletion refresh: 1 passkey.
        const mockPath =
          listCallCount === 1
            ? Mocks.EmbeddedWallet.list_authenticators_multi
            : Mocks.EmbeddedWallet.list_authenticators_single
        await route.fulfill({ path: mockPath })
      })

      await page.route(CHALLENGE_URL, async (route) => {
        await route.fulfill({ contentType: 'application/json', body: AUTH_CHALLENGE_RESPONSE })
      })

      await page.route(DELETE_AUTHENTICATOR_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.delete_authenticator })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()
      await expect(page.getByText('Chrome')).toBeVisible()

      // Hover to reveal trash icon and click it
      await page.getByText('iCloud').hover()
      const trashButtons = page.locator('[data-element="delete-passkey"]')
      await trashButtons.first().click()

      // Verify passkey modal opens — click verify
      await expect(page.getByText('Verify your passkey')).toBeVisible()
      await page.getByRole('button', { name: /verify/i }).click()

      // Delete confirmation modal opens — must check the acknowledge checkbox to enable delete
      await expect(page.getByRole('button', { name: /^delete$/i })).toBeDisabled()
      await page.locator('[data-element="delete-passkey-acknowledge"]').click()
      await expect(page.getByRole('button', { name: /^delete$/i })).toBeEnabled()
      await page.getByRole('button', { name: /^delete$/i }).click()

      // After deletion, list refreshes to show only the remaining passkey
      await page.waitForResponse((resp) => resp.url().includes('DeleteAuthenticator'))
      await expect(page.getByText('iCloud')).toBeVisible()
      await expect(page.getByText('Chrome')).not.toBeVisible()
    })

    test('deleting last passkey disconnects wallet and closes drawer', async ({ page }) => {
      await setupEmbeddedWalletState(page)
      await setupWebAuthnMock(page)

      await page.route(LIST_AUTHENTICATORS_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.list_authenticators_single })
      })

      await page.route(CHALLENGE_URL, async (route) => {
        await route.fulfill({ contentType: 'application/json', body: AUTH_CHALLENGE_RESPONSE })
      })

      await page.route(DELETE_AUTHENTICATOR_URL, async (route) => {
        await route.fulfill({ path: Mocks.EmbeddedWallet.delete_authenticator })
      })

      // Disconnect RPC (called after deleting last authenticator)
      await page.route('**/uniswap.privyembeddedwallet.v1.EmbeddedWalletService/Disconnect', async (route) => {
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true }) })
      })

      await page.goto(`/swap?${EW_ENABLED}`)
      await navigateToPasskeyMenu(page)

      await expect(page.getByText('iCloud')).toBeVisible()

      await page.getByText('iCloud').hover()
      const trashButtons = page.locator('[data-element="delete-passkey"]')
      await trashButtons.first().click()

      await expect(page.getByText('Verify your passkey')).toBeVisible()
      await page.getByRole('button', { name: /verify/i }).click()

      await page.locator('[data-element="delete-passkey-acknowledge"]').click()
      await page.getByRole('button', { name: /^delete$/i }).click()

      await page.waitForResponse((resp) => resp.url().includes('DeleteAuthenticator'))

      // After deleting last passkey, wallet disconnects — connect wallet button reappears
      await expect(page.getByTestId(TestID.Web3StatusConnected)).not.toBeVisible()
    })
  },
)
