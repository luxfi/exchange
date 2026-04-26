// Privy was removed; OAuth redirect routing is a no-op until IAM-backed
// flow is wired up. Keys remain so other modules can still reference them.

export const OAUTH_PENDING_KEY = 'addBackupLogin:oauthProvider'
export const RECOVER_OAUTH_PENDING_KEY = 'recoverWallet:oauthProvider'

export function useOAuthRedirectRouter(): void {
  // no-op
}
