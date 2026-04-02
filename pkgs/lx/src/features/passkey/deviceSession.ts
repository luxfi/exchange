interface DeviceSession {
  privateKey: CryptoKey // non-extractable, never leaves browser
  policyExpiresAt: number // Unix ms; session lasts 1 minute
  policyId: string
  walletId?: string
  deviceKeyQuorumId?: string // returned by CreateWallet
}

let _deviceSession: DeviceSession | null = null

export function getDeviceSession(): DeviceSession | null {
  if (!_deviceSession) {
    return null
  }
  if (Date.now() >= _deviceSession.policyExpiresAt) {
    _deviceSession = null
    return null
  }
  return _deviceSession
}

export function setDeviceSession(session: DeviceSession): void {
  _deviceSession = session
}

export function clearDeviceSession(): void {
  _deviceSession = null
}

export async function generateDeviceKeyPair(): Promise<{
  privateKey: CryptoKey
  publicKeyBase64: string // SPKI DER, standard base64 (not base64url)
}> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, // extractable: false
    ['sign', 'verify'],
  )
  const spki = await crypto.subtle.exportKey('spki', keyPair.publicKey)
  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(spki)))
  return { privateKey: keyPair.privateKey, publicKeyBase64 }
}

export async function signWithDeviceKey(privateKey: CryptoKey, signingPayloadBase64url: string): Promise<string> {
  const payloadBytes = Uint8Array.from(atob(base64urlToBase64(signingPayloadBase64url)), (c) => c.charCodeAt(0))
  const signatureBuffer = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    privateKey,
    payloadBytes,
  )
  // return as standard base64
  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
}

export function base64urlToBase64(s: string): string {
  return s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
}

export function base64ToBase64url(s: string): string {
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, '')
}

// Simplified JSON canonicalization (sorted keys, no whitespace)
// Used to construct the Privy PATCH key quorum payload for AddAuthenticator
export function canonicalizeJSON(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj)
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']'
  }
  const sorted = Object.keys(obj as Record<string, unknown>).sort()
  return (
    '{' +
    sorted.map((k) => JSON.stringify(k) + ':' + canonicalizeJSON((obj as Record<string, unknown>)[k])).join(',') +
    '}'
  )
}
