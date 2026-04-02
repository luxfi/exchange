import { EmbeddedWalletApiClient } from 'lx/src/data/rest/embeddedWallet/requests'
import { storeEncryptedBlob } from 'lx/src/features/passkey/privyBlobStore'
import { encryptAndStoreRecovery } from 'lx/src/features/passkey/recoverySetup'

vi.mock('lx/src/data/rest/embeddedWallet/requests', () => ({
  EmbeddedWalletApiClient: {
    fetchOprfEvaluate: vi.fn(),
  },
}))

vi.mock('lx/src/features/passkey/privyBlobStore', () => ({
  storeEncryptedBlob: vi.fn(),
}))

vi.mock('lx/src/features/passkey/pinCrypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lx/src/features/passkey/pinCrypto')>()
  return {
    ...actual,
    blindPin: vi.fn(),
    finalizeOprf: vi.fn(),
    deriveArgon2InWorker: vi.fn(),
  }
})

const { blindPin, finalizeOprf, deriveArgon2InWorker } = await import('lx/src/features/passkey/pinCrypto')

describe('encryptAndStoreRecovery', () => {
  const params = {
    pin: '8294',
    email: 'test@example.com',
    accessToken: 'access-token',
    privyAppId: 'test-privy-app-id',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('throws when OPRF evaluation fails', async () => {
    vi.mocked(blindPin).mockResolvedValue({
      blindedElement: 'blinded',
      blindState: {} as Parameters<typeof finalizeOprf>[0],
    })
    vi.mocked(EmbeddedWalletApiClient.fetchOprfEvaluate).mockResolvedValue({
      errorMessage: 'rate limited',
    } as never)

    await expect(encryptAndStoreRecovery(params)).rejects.toThrow()
  })

  it('returns publicKey, authMethodId, and encryptedKeyId on success', async () => {
    vi.mocked(blindPin).mockResolvedValue({
      blindedElement: 'blinded',
      blindState: {} as Parameters<typeof finalizeOprf>[0],
    })
    vi.mocked(EmbeddedWalletApiClient.fetchOprfEvaluate).mockResolvedValue({
      evaluatedElement: 'eval',
    } as never)
    vi.mocked(finalizeOprf).mockResolvedValue(crypto.getRandomValues(new Uint8Array(32)))
    vi.mocked(deriveArgon2InWorker).mockResolvedValue(crypto.getRandomValues(new Uint8Array(32)))
    vi.mocked(storeEncryptedBlob).mockResolvedValue({ keyId: 'encrypted-key-id' })

    const result = await encryptAndStoreRecovery(params)
    expect(result.publicKey).toBeDefined()
    expect(result.authMethodId).toBeDefined()
    expect(result.encryptedKeyId).toBe('encrypted-key-id')
  })

  it('calls onProgress with expected steps', async () => {
    const onProgress = vi.fn()
    vi.mocked(blindPin).mockResolvedValue({
      blindedElement: 'blinded',
      blindState: {} as Parameters<typeof finalizeOprf>[0],
    })
    vi.mocked(EmbeddedWalletApiClient.fetchOprfEvaluate).mockResolvedValue({
      evaluatedElement: 'eval',
    } as never)
    vi.mocked(finalizeOprf).mockResolvedValue(crypto.getRandomValues(new Uint8Array(32)))
    vi.mocked(deriveArgon2InWorker).mockResolvedValue(crypto.getRandomValues(new Uint8Array(32)))
    vi.mocked(storeEncryptedBlob).mockResolvedValue({ keyId: 'encrypted-key-id' })

    await encryptAndStoreRecovery({ ...params, onProgress })

    expect(onProgress).toHaveBeenCalledWith('generating_keys')
    expect(onProgress).toHaveBeenCalledWith('oprf')
    expect(onProgress).toHaveBeenCalledWith('deriving')
    expect(onProgress).toHaveBeenCalledWith('encrypting')
    expect(onProgress).toHaveBeenCalledWith('storing')
  })
})
