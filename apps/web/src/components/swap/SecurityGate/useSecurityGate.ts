// Observes the swap form store, decides whether the selected pair
// triggers the regulated-asset gate, and returns a stable
// `swapRedirectCallback` + button text for `<SwapFlow>` to consume.
//
// Decision table:
//
//   gateEnabled   listLoaded   pairHasSecurity   verified   → action
//   ───────────   ──────────   ───────────────   ────────     ──────
//   false         —            —                 —            passthrough (normal Swap)
//   true          false        —                 —            passthrough (fail-safe: do not
//                                                              block the UI when the list
//                                                              hasn't loaded; the final
//                                                              trust boundary is the API
//                                                              gateway on submit)
//   true          true         false             —            passthrough
//   true          true         true              true         passthrough (user cleared KYC)
//   true          true         true              false        redirect to `${idHost}/signup`
//                                                              with return URL carrying the
//                                                              swap state query params
//
// The returned object is referentially stable across renders when the
// decision does not change, so it won't thrash downstream memos.

import type { Currency } from '@luxamm/sdk-core'
import { useCallback, useMemo } from 'react'
import { getRuntimeConfig } from '@l.x/config'
import type { SwapRedirectFn } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { CurrencyField } from '@l.x/lx/src/types/currency'
import { useSwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useVerifiedUser } from '~/hooks/useVerifiedUser'
import { isSecurityCurrency, useSecurityTokenSet } from '~/state/securityTokens'

type InputOutputCurrencies = {
  input: Currency | undefined
  output: Currency | undefined
}

function selectCurrencies(state: {
  derivedSwapInfo: { currencies: { [CurrencyField.INPUT]?: { currency?: Currency } | null; [CurrencyField.OUTPUT]?: { currency?: Currency } | null } }
}): InputOutputCurrencies {
  const ci = state.derivedSwapInfo.currencies
  return {
    input: ci[CurrencyField.INPUT]?.currency,
    output: ci[CurrencyField.OUTPUT]?.currency,
  }
}

function buildReturnUrl(
  idHost: string,
  currentHref: string,
  args: {
    inputCurrency?: Currency
    outputCurrency?: Currency
    typedValue?: string
  },
): string {
  // Preserve swap state across the onboarding round-trip so the user
  // lands back on the same pair + amount without re-selecting.
  const url = new URL(currentHref)
  // Clear any prior `from`/`to`/`amount` to avoid duplicates.
  url.searchParams.delete('from')
  url.searchParams.delete('to')
  url.searchParams.delete('amount')
  const fromAddr = (args.inputCurrency as unknown as { address?: string } | undefined)?.address
  const toAddr = (args.outputCurrency as unknown as { address?: string } | undefined)?.address
  if (fromAddr) url.searchParams.set('from', fromAddr)
  if (toAddr) url.searchParams.set('to', toAddr)
  if (args.typedValue) url.searchParams.set('amount', args.typedValue)
  const ret = url.toString()
  return `${idHost}/signup?return=${encodeURIComponent(ret)}`
}

export type SecurityGateResult = {
  /** True when the gate is active and the user must verify before swapping. */
  readonly active: boolean
  /** Pass to `<SwapFlow>` when active, or `undefined` otherwise. */
  readonly swapRedirectCallback: SwapRedirectFn | undefined
  /** Button label while the gate is active. `undefined` → default "Get started". */
  readonly swapRedirectButtonText: string | undefined
}

const INERT: SecurityGateResult = Object.freeze({
  active: false,
  swapRedirectCallback: undefined,
  swapRedirectButtonText: undefined,
})

export function useSecurityGate(): SecurityGateResult {
  const runtime = getRuntimeConfig()
  const gateEnabled = runtime.securityGateEnabled === true
  const idHost = runtime.idHost
  const set = useSecurityTokenSet()
  const verified = useVerifiedUser()

  const { input, output } = useSwapFormStore(selectCurrencies)

  const pairHasSecurity = useMemo(
    () => isSecurityCurrency(input, set) || isSecurityCurrency(output, set),
    [input, output, set],
  )

  const active = gateEnabled && pairHasSecurity && !verified

  const callback = useCallback<SwapRedirectFn>(
    ({ inputCurrency, outputCurrency, typedValue }) => {
      if (!idHost) return
      if (typeof window === 'undefined') return
      window.location.href = buildReturnUrl(idHost, window.location.href, {
        inputCurrency,
        outputCurrency,
        typedValue,
      })
    },
    [idHost],
  )

  return useMemo<SecurityGateResult>(() => {
    if (!active) return INERT
    // If the gate is active but `idHost` is missing, the deployment is
    // misconfigured. We still return a callback so the button is labelled
    // "Verify ID" (not "Swap") — clicking it will be a no-op rather than
    // letting an unverified user hit the swap path. This is the safe
    // failure mode: degraded UX > compliance bypass.
    return {
      active: true,
      swapRedirectCallback: callback,
      swapRedirectButtonText: 'Verify ID to trade',
    }
  }, [active, callback])
}
