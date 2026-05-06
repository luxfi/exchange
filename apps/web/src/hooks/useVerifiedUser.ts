// Is the current session marked as KYC-verified?
//
// Upstream-neutral: we don't know or care *how* the tenant determines
// verification. We just look up a single localStorage boolean key (name
// supplied by runtime config). The downstream app (e.g. Liquidity's login
// app at id.*.example.com) is responsible for writing `true` on
// verification success and clearing on sign-out.
//
// Why localStorage and not a cookie: the login app and the swap app
// share an eTLD+1 (`example.com` etc.) and the login app owns the
// session cookie it actually uses for API auth. The verified flag is a
// *UI signal*, not an authorization token — any security-sensitive
// check happens at the API gateway on actual swap submission, not here.
// Treating it as a UI hint keeps us from mis-modeling trust boundaries.
//
// Returns `false` unless all of:
//   - runtime config supplies a key (`verifiedSignalStorageKey`), OR the
//     default `auth.verified` key is set, AND
//   - the localStorage value parses as boolean `true` OR non-empty string.
//
// SSR-safe: returns `false` when `window`/`localStorage` is undefined.

import { useEffect, useState } from 'react'
import { getRuntimeConfig } from '@l.x/config'

const DEFAULT_KEY = 'auth.verified'

function readVerified(key: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return false
    if (raw === 'true' || raw === '1') return true
    // Allow JSON-encoded `true` too — some auth SDKs wrap values.
    try {
      return JSON.parse(raw) === true
    } catch {
      return false
    }
  } catch {
    // Some private-mode browsers throw on localStorage access.
    return false
  }
}

export function useVerifiedUser(): boolean {
  const key = getRuntimeConfig().verifiedSignalStorageKey || DEFAULT_KEY
  const [verified, setVerified] = useState<boolean>(() => readVerified(key))

  useEffect(() => {
    // Re-check on mount (handles redirect-back from onboarding).
    setVerified(readVerified(key))

    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent): void => {
      if (e.key === key) setVerified(readVerified(key))
    }
    // Also re-read when the tab becomes visible — a user that completed
    // verification in another tab should see the new state on return.
    const onVisible = (): void => {
      if (document.visibilityState === 'visible') setVerified(readVerified(key))
    }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [key])

  return verified
}
