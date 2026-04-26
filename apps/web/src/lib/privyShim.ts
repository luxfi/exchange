// Privy shim. Privy was removed; Hanzo IAM is the auth provider.
// These stubs keep call sites compiling while the embedded-wallet flows are
// migrated to IAM. They are no-ops at runtime: Privy code paths are dormant
// because PRIVY_APP_ID is never set in any current deployment.

type Provider = 'google' | 'apple'

interface PrivyUser {
  id: string
  google?: { email?: string }
  apple?: { email?: string }
}

interface UsePrivyReturn {
  ready: boolean
  authenticated: boolean
  user: PrivyUser | null
  getAccessToken: () => Promise<string | null>
  logout: () => Promise<void>
}

export function usePrivy(): UsePrivyReturn {
  return {
    ready: false,
    authenticated: false,
    user: null,
    getAccessToken: async () => null,
    logout: async () => undefined,
  }
}

interface UseLoginWithOAuthOptions {
  onError?: (error: Error) => void
}

interface UseLoginWithOAuthReturn {
  initOAuth: (args: { provider: Provider }) => Promise<void>
  loading: boolean
}

export function useLoginWithOAuth(options?: UseLoginWithOAuthOptions): UseLoginWithOAuthReturn {
  return {
    initOAuth: async () => {
      options?.onError?.(new Error('OAuth login is not available — Privy has been removed'))
    },
    loading: false,
  }
}

interface UseLoginWithEmailReturn {
  sendCode: (args: { email: string }) => Promise<void>
  loginWithCode: (args: { code: string }) => Promise<void>
}

export function useLoginWithEmail(): UseLoginWithEmailReturn {
  return {
    sendCode: async () => {
      throw new Error('Email login is not available — Privy has been removed')
    },
    loginWithCode: async () => {
      throw new Error('Email login is not available — Privy has been removed')
    },
  }
}

interface UseAuthorizationSignatureReturn {
  generateAuthorizationSignature: (payload: object) => Promise<{ signature: string }>
}

export function useAuthorizationSignature(): UseAuthorizationSignatureReturn {
  return {
    generateAuthorizationSignature: async () => {
      throw new Error('Authorization signature is not available — Privy has been removed')
    },
  }
}
