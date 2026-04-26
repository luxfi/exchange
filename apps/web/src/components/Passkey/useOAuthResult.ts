// Privy was removed; OAuth-return detection is a no-op until IAM-backed
// flow is wired up.

interface OAuthResult {
  provider: 'google' | 'apple' | null
  providerEmail: string | undefined
  pending: boolean
}

const RESULT: OAuthResult = { provider: null, providerEmail: undefined, pending: false }

export function useOAuthResult(_sessionStorageKey?: string): OAuthResult {
  return RESULT
}
