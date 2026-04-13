/// <reference types="react" />

import { useEffect, useState } from 'react'
import type { Address, PublicClient } from 'viem'
import { RegulatedProviderClient, decodeReason } from './index'
import type { ProviderConfig } from './config'
import { buildOnboardingUrl } from './config'

export interface EligibilityState {
  loading: boolean
  regulated: boolean           // true if provider handles this symbol
  eligible: boolean            // true if trader can trade it
  reasonCode: number
  reason: string
}

/** React hook that resolves regulated status + trader eligibility. */
export function useEligibility(
  client: RegulatedProviderClient,
  symbol: string,
  trader: Address | undefined,
): EligibilityState {
  const [state, setState] = useState<EligibilityState>({
    loading: true,
    regulated: false,
    eligible: true,
    reasonCode: 0,
    reason: 'ok',
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!client.enabled()) {
        if (alive) setState({ loading: false, regulated: false, eligible: true, reasonCode: 0, reason: 'ok' })
        return
      }
      const handled = await client.handles(symbol)
      if (!handled) {
        if (alive) setState({ loading: false, regulated: false, eligible: true, reasonCode: 0, reason: 'ok' })
        return
      }
      if (!trader) {
        if (alive) setState({ loading: false, regulated: true, eligible: false, reasonCode: 255, reason: 'wallet not connected' })
        return
      }
      const { ok, reasonCode } = await client.isEligible(trader, symbol)
      if (alive) setState({ loading: false, regulated: true, eligible: ok, reasonCode, reason: decodeReason(reasonCode) })
    })().catch(() => {
      if (alive) setState({ loading: false, regulated: true, eligible: false, reasonCode: 255, reason: 'provider unavailable' })
    })
    return () => { alive = false }
  }, [client, symbol, trader])

  return state
}

export interface RegulatedSwapGateProps {
  /** Provider UX config (name, URLs). */
  config: ProviderConfig
  /** Contract client used to resolve eligibility. */
  client: RegulatedProviderClient
  /** Symbol about to be swapped. */
  symbol: string
  /** Connected wallet, if any. */
  trader: Address | undefined
  /** Callback invoked when the user clicks "Connect". */
  onConnect?: () => void
  /** The swap button or preview — rendered only if eligible. */
  children: React.ReactNode
}

/**
 * Drop-in gate for a regulated swap. Wrap the swap button:
 *
 *   <RegulatedSwapGate config={cfg} client={client} symbol={symbol} trader={addr} onConnect={connect}>
 *     <SwapButton ... />
 *   </RegulatedSwapGate>
 *
 * If the symbol is not regulated: renders children as-is.
 * If regulated + eligible: renders children.
 * Otherwise: renders an inline CTA with "Get verified" and "Already
 * verified? Re-check" actions.
 */
export function RegulatedSwapGate({
  config,
  client,
  symbol,
  trader,
  onConnect,
  children,
}: RegulatedSwapGateProps): React.ReactElement {
  const state = useEligibility(client, symbol, trader)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  if (state.loading) return <div className="regulated-gate loading">Checking eligibility…</div> as any
  if (!state.regulated) return <>{children}</> as any
  if (state.eligible) return <>{children}</> as any

  const providerName = config.name ?? 'compliance provider'
  const onboardUrl =
    typeof window !== 'undefined'
      ? buildOnboardingUrl(config, window.location.href, trader)
      : null

  const handleRecheck = async () => {
    if (!trader) { onConnect?.(); return }
    setVerifying(true); setVerifyError(null)
    try {
      const { ok, reasonCode } = await client.isEligible(trader, symbol)
      if (!ok) setVerifyError(decodeReason(reasonCode))
    } catch (e) {
      setVerifyError((e as Error).message)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="regulated-gate" data-reason={state.reason}>
      <div className="regulated-gate__heading">
        {symbol} is a regulated asset
      </div>
      <div className="regulated-gate__reason">
        {!trader ? 'Connect a wallet to check your status.' : `Status: ${state.reason}.`}
      </div>
      <div className="regulated-gate__actions">
        {!trader ? (
          <button type="button" onClick={onConnect}>Connect wallet</button>
        ) : (
          <>
            {onboardUrl && (
              <a
                className="regulated-gate__primary"
                href={onboardUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get verified with {providerName}
              </a>
            )}
            <button
              type="button"
              disabled={verifying}
              onClick={handleRecheck}
            >
              {verifying ? 'Checking…' : 'Already verified? Re-check'}
            </button>
          </>
        )}
      </div>
      {verifyError && <div className="regulated-gate__error">{verifyError}</div>}
    </div>
  ) as any
}

export { decodeReason } from './index'
