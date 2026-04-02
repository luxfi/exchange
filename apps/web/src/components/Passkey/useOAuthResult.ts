import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { useAssertOAuthRedirectRouter } from '~/components/Passkey/OAuthRedirectContext'

interface OAuthReturnResult {
  provider: 'google' | 'apple' | null
  providerEmail: string | undefined
  pending: boolean
}

const INITIAL_STATE: OAuthReturnResult = { provider: null, providerEmail: undefined, pending: false }

/**
 * Detects an OAuth return after a Privy redirect.
 * Reads the given sessionStorage key and waits for Privy to authenticate,
 * then returns the detected provider and email. Clears sessionStorage once detected.
 */
export function useOAuthResult(sessionStorageKey: string): OAuthReturnResult {
  useAssertOAuthRedirectRouter()

  const { ready, authenticated, user } = usePrivy()
  const [result, setResult] = useState<OAuthReturnResult>(() => {
    const pending = !!sessionStorage.getItem(sessionStorageKey)
    return pending ? { provider: null, providerEmail: undefined, pending: true } : INITIAL_STATE
  })

  useEffect(() => {
    const pendingProvider = sessionStorage.getItem(sessionStorageKey) as 'google' | 'apple' | null
    if (!pendingProvider) {
      return
    }

    if (!ready) {
      return
    }

    // ready && !authenticated means OAuth was abandoned (denied consent, closed popup, etc.)
    // Reset to INITIAL_STATE so consumers see pending: false and can show an appropriate UI.
    if (!authenticated || !user) {
      sessionStorage.removeItem(sessionStorageKey)
      setResult(INITIAL_STATE)
      return
    }

    // Verify the OAuth account was actually linked — not just that the user has an existing session.
    // Without this check, hitting "back" during the OAuth redirect would still advance the flow.
    const linkedAccount = pendingProvider === 'google' ? user.google : user.apple
    if (!linkedAccount) {
      sessionStorage.removeItem(sessionStorageKey)
      setResult(INITIAL_STATE)
      return
    }

    const providerEmail = linkedAccount.email
    sessionStorage.removeItem(sessionStorageKey)
    setResult({ provider: pendingProvider, providerEmail, pending: false })
  }, [sessionStorageKey, ready, authenticated, user])

  return result
}
