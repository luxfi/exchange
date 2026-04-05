import { EmbeddedWalletApiClient } from 'uniswap/src/data/rest/embeddedWallet/requests'
import { clearDeviceSession, generateDeviceKeyPair, setDeviceSession } from 'uniswap/src/features/passkey/deviceSession'
import { authenticateWithPasskey, loadPrivyPbModule } from 'uniswap/src/features/passkey/embeddedWallet'
import {
  exportEncryptedSeedPhrase,
  signMessageWithPasskey,
  signTransactionWithPasskey,
  signTypedDataWithPasskey,
} from 'uniswap/src/features/passkey/signing'
import { type MockedFunction, vi } from 'vitest'

vi.mock('uniswap/src/data/rest/embeddedWallet/requests', () => ({
  EmbeddedWalletApiClient: {
    fetchChallengeRequest: vi.fn(),
    fetchSignMessagesRequest: vi.fn(),
    fetchSignTransactionsRequest: vi.fn(),
    fetchSignTypedDataRequest: vi.fn(),
    fetchExportSeedPhraseRequest: vi.fn(),
  },
}))

vi.mock('uniswap/src/features/passkey/embeddedWallet', () => ({
  loadPrivyPbModule: vi.fn(),
  authenticateWithPasskey: vi.fn(),
}))

const mockLoadPrivyPbModule = loadPrivyPbModule as MockedFunction<typeof loadPrivyPbModule>
const mockAuthenticateWithPasskey = authenticateWithPasskey as MockedFunction<typeof authenticateWithPasskey>
const mockFetchChallengeRequest = EmbeddedWalletApiClient.fetchChallengeRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchChallengeRequest
>
const mockFetchSignMessagesRequest = EmbeddedWalletApiClient.fetchSignMessagesRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchSignMessagesRequest
>
const mockFetchSignTransactionsRequest = EmbeddedWalletApiClient.fetchSignTransactionsRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchSignTransactionsRequest
>
const mockFetchSignTypedDataRequest = EmbeddedWalletApiClient.fetchSignTypedDataRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchSignTypedDataRequest
>
const mockFetchExportSeedPhraseRequest = EmbeddedWalletApiClient.fetchExportSeedPhraseRequest as MockedFunction<
  typeof EmbeddedWalletApiClient.fetchExportSeedPhraseRequest
>

const MOCK_ACTION = {
  SIGN_MESSAGE: 1,
  SIGN_TRANSACTION: 2,
  SIGN_TYPED_DATA: 3,
  EXPORT_SEED_PHRASE: 4,
} as const

const MOCK_AUTH_TYPES = {
  PASSKEY_AUTHENTICATION: 1,
} as const

describe('signing', () => {
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
  })

  describe('signWithDeviceSessionOrPasskey fast-path (device session)', () => {
    it('uses device session when available and signingPayload is returned', async () => {
      const { privateKey } = await generateDeviceKeyPair()
      setDeviceSession({
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() + 60_000,
        walletId: 'wallet-1',
      })

      mockFetchChallengeRequest.mockResolvedValue({
        signingPayload: btoa('test-payload').replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, ''),
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchChallengeRequest>>)

      mockFetchSignMessagesRequest.mockResolvedValue({
        signatures: ['0xsig123'],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchSignMessagesRequest>>)

      const result = await signMessageWithPasskey('hello')

      expect(result).toBe('0xsig123')
      expect(mockFetchChallengeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MOCK_AUTH_TYPES.PASSKEY_AUTHENTICATION,
          action: MOCK_ACTION.SIGN_MESSAGE,
          walletId: 'wallet-1',
          message: 'hello',
        }),
      )
      expect(mockFetchSignMessagesRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: ['hello'],
          auth: expect.objectContaining({
            case: 'deviceAuth',
            value: expect.objectContaining({ walletId: 'wallet-1' }),
          }),
        }),
      )
      // Should NOT fall back to passkey
      expect(mockAuthenticateWithPasskey).not.toHaveBeenCalled()
    })
  })

  describe('passkey fallback (no device session)', () => {
    it('falls back to passkey when no device session exists', async () => {
      mockAuthenticateWithPasskey.mockResolvedValue('passkey-credential-123')
      mockFetchSignMessagesRequest.mockResolvedValue({
        signatures: ['0xpasskeysig'],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchSignMessagesRequest>>)

      const result = await signMessageWithPasskey('hello')

      expect(result).toBe('0xpasskeysig')
      expect(mockAuthenticateWithPasskey).toHaveBeenCalledWith(MOCK_ACTION.SIGN_MESSAGE, { message: 'hello' })
      expect(mockFetchSignMessagesRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          auth: { case: 'credential', value: 'passkey-credential-123' },
        }),
      )
    })

    it('falls back to passkey when challenge has no signingPayload', async () => {
      const { privateKey } = await generateDeviceKeyPair()
      setDeviceSession({
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() + 60_000,
        walletId: 'wallet-1',
      })

      mockFetchChallengeRequest.mockResolvedValue({
        signingPayload: undefined,
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchChallengeRequest>>)

      mockAuthenticateWithPasskey.mockResolvedValue('fallback-cred')
      mockFetchSignMessagesRequest.mockResolvedValue({
        signatures: ['0xfallbacksig'],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchSignMessagesRequest>>)

      const result = await signMessageWithPasskey('hello')

      expect(result).toBe('0xfallbacksig')
      expect(mockAuthenticateWithPasskey).toHaveBeenCalled()
    })
  })

  describe('signTransactionWithPasskey', () => {
    it('calls through correctly with passkey fallback', async () => {
      mockAuthenticateWithPasskey.mockResolvedValue('tx-cred')
      mockFetchSignTransactionsRequest.mockResolvedValue({
        signatures: ['0xtxsig'],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchSignTransactionsRequest>>)

      const result = await signTransactionWithPasskey('0xtxdata')

      expect(result).toBe('0xtxsig')
      expect(mockAuthenticateWithPasskey).toHaveBeenCalledWith(MOCK_ACTION.SIGN_TRANSACTION, {
        transaction: '0xtxdata',
      })
      expect(mockFetchSignTransactionsRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          transactions: ['0xtxdata'],
          auth: { case: 'credential', value: 'tx-cred' },
        }),
      )
    })
  })

  describe('signTypedDataWithPasskey', () => {
    it('calls through correctly with passkey fallback', async () => {
      mockAuthenticateWithPasskey.mockResolvedValue('typed-cred')
      mockFetchSignTypedDataRequest.mockResolvedValue({
        signatures: ['0xtypedsig'],
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchSignTypedDataRequest>>)

      const result = await signTypedDataWithPasskey('{"type":"data"}')

      expect(result).toBe('0xtypedsig')
      expect(mockAuthenticateWithPasskey).toHaveBeenCalledWith(MOCK_ACTION.SIGN_TYPED_DATA, {
        typedData: '{"type":"data"}',
      })
      expect(mockFetchSignTypedDataRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          typedDataBatch: ['{"type":"data"}'],
          auth: { case: 'credential', value: 'typed-cred' },
        }),
      )
    })
  })

  describe('exportEncryptedSeedPhrase', () => {
    it('returns encrypted seed phrase on success', async () => {
      mockAuthenticateWithPasskey.mockResolvedValue('export-cred')
      mockFetchExportSeedPhraseRequest.mockResolvedValue({
        encryptedSeedPhrase: 'encrypted-data-123',
      } as unknown as Awaited<ReturnType<typeof EmbeddedWalletApiClient.fetchExportSeedPhraseRequest>>)

      const result = await exportEncryptedSeedPhrase('enc-key-1')

      expect(result).toBe('encrypted-data-123')
      expect(mockAuthenticateWithPasskey).toHaveBeenCalledWith(MOCK_ACTION.EXPORT_SEED_PHRASE, {
        encryptionKey: 'enc-key-1',
      })
    })

    it('returns undefined when no credential', async () => {
      mockAuthenticateWithPasskey.mockResolvedValue(undefined)

      const result = await exportEncryptedSeedPhrase('enc-key-1')

      expect(result).toBeUndefined()
      expect(mockFetchExportSeedPhraseRequest).not.toHaveBeenCalled()
    })
  })
})
