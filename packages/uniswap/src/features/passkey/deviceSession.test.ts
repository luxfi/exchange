import {
  canonicalizeJSON,
  clearDeviceSession,
  generateDeviceKeyPair,
  getDeviceSession,
  setDeviceSession,
  signWithDeviceKey,
} from 'uniswap/src/features/passkey/deviceSession'

describe('deviceSession', () => {
  afterEach(() => {
    clearDeviceSession()
  })

  describe('getDeviceSession', () => {
    it('returns null when no session is set', () => {
      expect(getDeviceSession()).toBeNull()
    })

    it('returns null when session has expired', async () => {
      const { privateKey } = await generateDeviceKeyPair()
      setDeviceSession({
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() - 1000, // expired 1 second ago
        walletId: 'wallet-1',
      })
      expect(getDeviceSession()).toBeNull()
    })

    it('returns session within expiry window', async () => {
      const { privateKey } = await generateDeviceKeyPair()
      const session = {
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() + 60_000, // expires in 1 minute
        walletId: 'wallet-1',
      }
      setDeviceSession(session)
      expect(getDeviceSession()).toEqual(session)
    })
  })

  describe('setDeviceSession / clearDeviceSession lifecycle', () => {
    it('sets and clears a session', async () => {
      const { privateKey } = await generateDeviceKeyPair()
      setDeviceSession({
        privateKey,
        policyId: 'policy-1',
        policyExpiresAt: Date.now() + 60_000,
        walletId: 'wallet-1',
      })
      expect(getDeviceSession()).not.toBeNull()

      clearDeviceSession()
      expect(getDeviceSession()).toBeNull()
    })
  })

  describe('generateDeviceKeyPair', () => {
    it('produces a valid P-256 key pair', async () => {
      const { privateKey, publicKeyBase64 } = await generateDeviceKeyPair()

      // Private key is a CryptoKey
      expect(privateKey).toBeInstanceOf(CryptoKey)
      expect(privateKey.type).toBe('private')
      expect(privateKey.algorithm).toMatchObject({ name: 'ECDSA', namedCurve: 'P-256' })
      expect(privateKey.extractable).toBe(false)
      expect(privateKey.usages).toContain('sign')

      // Public key is standard base64 (SPKI DER)
      expect(publicKeyBase64).toBeTruthy()
      // Should be decodable as base64
      expect(() => atob(publicKeyBase64)).not.toThrow()
    })

    it('generates unique key pairs on each call', async () => {
      const pair1 = await generateDeviceKeyPair()
      const pair2 = await generateDeviceKeyPair()
      expect(pair1.publicKeyBase64).not.toBe(pair2.publicKeyBase64)
    })
  })

  describe('signWithDeviceKey', () => {
    it('produces a valid ECDSA signature that can be verified', async () => {
      const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify'])

      const payload = 'hello world'
      const payloadBase64url = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, '')

      const signatureBase64 = await signWithDeviceKey(keyPair.privateKey, payloadBase64url)

      // Signature should be non-empty standard base64
      expect(signatureBase64).toBeTruthy()
      expect(() => atob(signatureBase64)).not.toThrow()

      // Verify the signature with the public key
      const sigBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0))
      const payloadBytes = new TextEncoder().encode(payload)
      const isValid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        keyPair.publicKey,
        sigBytes,
        payloadBytes,
      )
      expect(isValid).toBe(true)
    })

    it('handles base64url padding correctly', async () => {
      const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify'])

      // Create payloads of varying lengths to test different padding scenarios
      for (const payload of ['a', 'ab', 'abc', 'abcd']) {
        const b64 = btoa(payload)
        const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, '')
        const sig = await signWithDeviceKey(keyPair.privateKey, b64url)
        expect(sig).toBeTruthy()
      }
    })
  })

  describe('canonicalizeJSON', () => {
    it('sorts keys alphabetically', () => {
      expect(canonicalizeJSON({ b: 1, a: 2 })).toBe('{"a":2,"b":1}')
    })

    it('handles nested objects', () => {
      expect(canonicalizeJSON({ z: { b: 1, a: 2 }, a: 3 })).toBe('{"a":3,"z":{"a":2,"b":1}}')
    })

    it('handles arrays (preserves order)', () => {
      expect(canonicalizeJSON([3, 1, 2])).toBe('[3,1,2]')
    })

    it('handles null', () => {
      expect(canonicalizeJSON(null)).toBe('null')
    })

    it('handles primitives', () => {
      expect(canonicalizeJSON(42)).toBe('42')
      expect(canonicalizeJSON('hello')).toBe('"hello"')
      expect(canonicalizeJSON(true)).toBe('true')
    })

    it('handles mixed nested structures', () => {
      const input = {
        method: 'PATCH',
        body: { public_keys: ['key1', 'key2'] },
        headers: { 'privy-app-id': 'abc123' },
        url: 'https://api.privy.io/v1/key_quorums/123',
        version: 1,
      }
      const result = canonicalizeJSON(input)
      // Keys at each level should be sorted
      expect(result).toBe(
        '{"body":{"public_keys":["key1","key2"]},"headers":{"privy-app-id":"abc123"},"method":"PATCH","url":"https://api.privy.io/v1/key_quorums/123","version":1}',
      )
    })

    it('handles empty objects and arrays', () => {
      expect(canonicalizeJSON({})).toBe('{}')
      expect(canonicalizeJSON([])).toBe('[]')
    })
  })
})
