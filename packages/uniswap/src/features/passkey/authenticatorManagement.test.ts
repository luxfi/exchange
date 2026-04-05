import { EmbeddedWalletApiClient } from 'uniswap/src/data/rest/embeddedWallet/requests'
import {
  deleteAuthenticator,
  listAuthenticators,
  registerNewAuthenticator,
  startAddAuthenticatorSession,
} from 'uniswap/src/features/passkey/authenticatorManagement'
import {
  clearDeviceSession,
  generateDeviceKeyPair,
  getDeviceSession,
  setDeviceSession,
} from 'uniswap/src/features/passkey/deviceSession'
import { loadPrivyPbModule } from 'uniswap/src/features/passkey/embeddedWallet'
import { authenticatePasskey, registerPasskey } from 'uniswap/src/features/passkey/passkey'
import { type MockedFunction, vi } from 'vitest'

vi.mock('uniswap/src/data/rest/embeddedWallet/requests', () => ({
  EmbeddedWalletApiClient: {
    fetchListAuthenticatorsRequest: vi.fn(),
    fetchChallengeRequest: vi.fn(),
    fetchStartAuthenticatedSessionRequest: vi.fn(),
    fetchAddAuthenticatorRequest: vi.fn(),
    fetchDeleteAuthenticatorRequest: vi.fn(),
  },
}))

vi.mock('uniswap/src/features/passkey/embeddedWallet', () => ({
  loadPrivyPbModule: vi.fn(),
}))

vi.mock('uniswap/src/features/passkey/passkey', () => ({
  authenticatePasskey: vi.fn(),
  registerPasskey: vi.fn(),
}))

const mockLoadPrivyPbModule = loadPrivyPbModule as MockedFunction<typeof loadPrivyPbModule>
const mockAuthenticatePasskey = authenticatePasskey as MockedFunction<typeof authenticatePasskey>
const mockRegisterPasskey = registerPasskey as MockedFunction<typeof registerPasskey>

const mockFetchChallengeRequest = EmbeddedWalletApiClient.fetchChallengeRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchChallengeRequest
>
const mockFetchStartAuthenticatedSessionRequest =
  EmbeddedWalletApiClient.fetchStartAuthenticatedSessionRequest as MockedFunction<
    typeof EmbeddedWalletApiClient.fetchStartAuthenticatedSessionRequest
  >
const mockFetchListAuthenticatorsRequest = EmbeddedWalletApiClient.fetchListAuthenticatorsRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchListAuthenticatorsRequest
>
const mockFetchAddAuthenticatorRequest = EmbeddedWalletApiClient.fetchAddAuthenticatorRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchAddAuthenticatorRequest
>
const mockFetchDeleteAuthenticatorRequest = EmbeddedWalletApiClient.fetchDeleteAuthenticatorRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchDeleteAuthenticatorRequest
>

const MOCK_ACTION = {
  REGISTER_NEW_AUTHENTICATION_TYPES: 5,
} as const

const MOCK_AUTH_TYPES = {
  PASSKEY_AUTHENTICATION: 1,
  PASSKEY_REGISTRATION: 2,
} as const

describe('authenticatorManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearDeviceSession()
    mockLoadPrivyPbModule.mockResolvedValue({
      Action: MOCK_ACTION,
      AuthenticationTypes: MOCK_AUTH_TYPES,
    } as unknown as Awaited<ReturnType<typeof loadPrivyPbModule>>)
  })

  afterEach(() => {
    clearDeviceSession()
    delete process.env['PRIVY_APP_ID']
  })

  describe('listAuthenticators', () => {
    it('returns authenticators from the API', async () => {
      const mockAuthenticators = [{ credentialId: 'cred-1' }, { credentialId: 'cred-2' }]
      mockFetchListAuthenticatorsRequest.mockResolvedValue({
        authenticators: mockAuthenticators,
        recoveryMethods: [],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchListAuthenticatorsRequest>>)

      const result = await listAuthenticators('wallet-1')

      expect(result.authenticators).toEqual(mockAuthenticators)
      expect(result.recoveryMethods).toEqual([])
      expect(mockFetchListAuthenticatorsRequest).toHaveBeenCalledWith({ walletId: 'wallet-1' })
    })
  })

  describe('startAddAuthenticatorSession', () => {
    it('sets device session on success', async () => {
      mockFetchChallengeRequest.mockResolvedValue({
        challengeOptions: 'challenge-json',
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchChallengeRequest>>)

      mockAuthenticatePasskey.mockResolvedValue('existing-credential-123')

      mockFetchStartAuthenticatedSessionRequest.mockResolvedValue({
        policyId: 'policy-abc',
        policyExpiresAt: BigInt(Date.now() + 60_000),
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchStartAuthenticatedSessionRequest>>)

      const result = await startAddAuthenticatorSession('wallet-1')

      expect(result).toBe('existing-credential-123')
      expect(mockAuthenticatePasskey).toHaveBeenCalledWith('challenge-json')
      // Device session should now be set
      expect(getDeviceSession()).not.toBeNull()
      expect(getDeviceSession()?.policyId).toBe('policy-abc')
    })

    it('throws when no challenge options', async () => {
      mockFetchChallengeRequest.mockResolvedValue({
        challengeOptions: undefined,
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchChallengeRequest>>)

      await expect(startAddAuthenticatorSession()).rejects.toThrow('No challenge options returned')
    })
  })

  describe('registerNewAuthenticator', () => {
    it('throws if no active device session', async () => {
      await expect(
        registerNewAuthenticator({
          authenticatorAttachment: 0 as unknown as Parameters<
            typeof registerNewAuthenticator
          >[0]['authenticatorAttachment'],
        }),
      ).rejects.toThrow('No active device session')
    })

    it('constructs canonical payload and signs with device key', async () => {
      process.env['PRIVY_APP_ID'] = 'test-app-id'
      const { privateKey } = await generateDeviceKeyPair()
      setDeviceSession({
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() + 60_000,
        walletId: 'wallet-1',
      })

      // Mock the registration challenge
      mockFetchChallengeRequest.mockResolvedValue({
        challengeOptions: 'reg-challenge-json',
        existingPublicKeys: ['existingKey1=='],
        keyQuorumId: 'kq-123',
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchChallengeRequest>>)

      // registerPasskey returns JSON with a publicKey in base64url
      const mockCredentialResponse = JSON.stringify({
        response: {
          publicKey: 'dGVzdC1wdWJsaWMta2V5', // base64url encoded
        },
      })
      mockRegisterPasskey.mockResolvedValue(mockCredentialResponse)
      mockFetchAddAuthenticatorRequest.mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchAddAuthenticatorRequest>>,
      )

      await registerNewAuthenticator({
        authenticatorAttachment: 0 as unknown as Parameters<
          typeof registerNewAuthenticator
        >[0]['authenticatorAttachment'],
        username: 'testuser',
        walletId: 'wallet-1',
      })

      expect(mockRegisterPasskey).toHaveBeenCalledWith('reg-challenge-json')
      expect(mockFetchAddAuthenticatorRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          newCredential: mockCredentialResponse,
          deviceSignature: expect.any(String),
        }),
      )
    })
  })

  describe('deleteAuthenticator', () => {
    it('returns false when no credential provided', async () => {
      const result = await deleteAuthenticator({
        authenticator: { credentialId: 'cred-1' } as unknown as Parameters<
          typeof deleteAuthenticator
        >[0]['authenticator'],
      })

      expect(result).toBe(false)
      expect(mockFetchDeleteAuthenticatorRequest).not.toHaveBeenCalled()
    })

    it('returns true on successful deletion', async () => {
      mockFetchDeleteAuthenticatorRequest.mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchDeleteAuthenticatorRequest>>,
      )

      const result = await deleteAuthenticator({
        authenticator: { credentialId: 'cred-1' } as unknown as Parameters<
          typeof deleteAuthenticator
        >[0]['authenticator'],
        credential: 'auth-credential',
      })

      expect(result).toBe(true)
      expect(mockFetchDeleteAuthenticatorRequest).toHaveBeenCalledWith({
        credential: 'auth-credential',
        authenticatorId: 'cred-1',
      })
    })
  })
})
