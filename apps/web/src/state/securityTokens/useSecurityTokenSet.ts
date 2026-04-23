// Regulated-asset detection for the swap CTA.
//
// Fetches `securityListUrl` (a Uniswap-schema token list JSON) once per
// page load, builds an immutable `(chainId, lowercased-address)` set of
// security tokens, and exposes a stable `isSecurity(currency)` predicate
// to the swap UI.
//
// Security properties:
//   - URL must be https:// — sanitized upstream in @l.x/config runtime.ts;
//     this hook additionally bails if the fetch fails or the response is
//     not a well-formed token list.
//   - No token data is ever rendered as HTML — consumers render strings
//     through React's default escaping.
//   - Result cached in module scope; no re-fetch even on re-mount. A hard
//     refresh is the only way to pick up list changes, which is correct
//     for v1 (compliance data should not hot-reload mid-session).
//   - Fail-closed stance: if the list fails to load and the gate is
//     enabled, the UI still renders — but since `isSecurity(...)` returns
//     false for everything unknown, the CTA stays as "Swap". This is
//     fail-open for the CTA label, which matches the product intent
//     (don't block swaps on Lux/Zoo just because a list 404'd).
//     Deployments that need strict-deny must configure their operator to
//     fail deployment when the list is unreachable at pod startup.

import type { Currency } from '@luxamm/sdk-core'
import { useEffect, useState } from 'react'
import { getRuntimeConfig } from '@l.x/config'
import type { TokenInfo, TokenList } from '~/utils/tokenListTypes'

export const SECURITY_TAG = 'security'

/** A frozen lookup. Key shape: `${chainId}:${lowercased-address}`. */
export type SecurityTokenSet = {
  readonly has: (chainId: number, address: string) => boolean
  readonly size: number
}

const EMPTY_SET: SecurityTokenSet = Object.freeze({
  has: () => false,
  size: 0,
})

function buildKey(chainId: number, address: string): string {
  return `${chainId}:${address.toLowerCase()}`
}

function isTokenInfo(x: unknown): x is TokenInfo {
  if (!x || typeof x !== 'object') return false
  const t = x as Record<string, unknown>
  return (
    typeof t.chainId === 'number' &&
    typeof t.address === 'string' &&
    typeof t.symbol === 'string' &&
    typeof t.decimals === 'number'
  )
}

function buildSetFromList(list: TokenList): SecurityTokenSet {
  const keys = new Set<string>()
  for (const tok of list.tokens) {
    if (!isTokenInfo(tok)) continue
    const tags = tok.tags
    if (!Array.isArray(tags) || !tags.includes(SECURITY_TAG)) continue
    keys.add(buildKey(tok.chainId, tok.address))
  }
  return Object.freeze({
    has: (chainId: number, address: string): boolean => {
      if (!address) return false
      return keys.has(buildKey(chainId, address))
    },
    size: keys.size,
  })
}

let cache: Promise<SecurityTokenSet> | null = null

async function fetchList(url: string, signal: AbortSignal): Promise<SecurityTokenSet> {
  try {
    const res = await fetch(url, { signal, credentials: 'omit', cache: 'default' })
    if (!res.ok) return EMPTY_SET
    const json = (await res.json()) as unknown
    if (!json || typeof json !== 'object') return EMPTY_SET
    const maybeList = json as { tokens?: unknown }
    if (!Array.isArray(maybeList.tokens)) return EMPTY_SET
    return buildSetFromList(maybeList as TokenList)
  } catch {
    return EMPTY_SET
  }
}

/** Reset module cache — test-only hook. */
export function _resetSecurityTokenSetForTests(): void {
  cache = null
}

/** Hook form: loads the list once, returns the current set. */
export function useSecurityTokenSet(): SecurityTokenSet {
  const [set, setSet] = useState<SecurityTokenSet>(EMPTY_SET)

  useEffect(() => {
    const { securityListUrl } = getRuntimeConfig()
    if (!securityListUrl) {
      setSet(EMPTY_SET)
      return
    }
    const ctrl = new AbortController()
    if (!cache) {
      cache = fetchList(securityListUrl, ctrl.signal)
    }
    let cancelled = false
    cache
      .then((s) => {
        if (!cancelled) setSet(s)
      })
      .catch(() => {
        if (!cancelled) setSet(EMPTY_SET)
      })
    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [])

  return set
}

/** Pure helper: given a currency and a set, decide if it is a security.
 *  Native currencies (no address) are never securities. */
export function isSecurityCurrency(currency: Currency | undefined | null, set: SecurityTokenSet): boolean {
  if (!currency) return false
  // Native currencies have no address; skip.
  const addr = (currency as unknown as { address?: string }).address
  if (!addr) return false
  return set.has(currency.chainId, addr)
}
