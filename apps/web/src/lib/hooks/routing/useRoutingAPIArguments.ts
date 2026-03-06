import { SkipToken, skipToken } from '@reduxjs/toolkit/query/react'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import { useIsMismatchAccountQuery } from 'lx/src/features/smartWallet/mismatch/hooks'
import { useDEXPriorityOrderFlag } from 'lx/src/features/transactions/swap/utils/protocols'
import { useIsDEXSupportedChain } from '~/hooks/useIsDEXSupportedChain'
import {
  createGetRoutingAPIArguments,
  type RoutingAPIInput,
  validateRoutingAPIInput,
} from '~/lib/hooks/routing/createGetRoutingAPIArguments'
import { GetQuoteArgs } from '~/state/routing/types'

/**
 * Returns query arguments for the Routing API query or undefined if the
 * query should be skipped. Input arguments do not need to be memoized, as they will
 * be destructured.
 */
export function useRoutingAPIArguments(input: RoutingAPIInput): GetQuoteArgs | SkipToken {
  const isDEXSupportedChain = useIsDEXSupportedChain(input.tokenIn?.chainId)
  const isPriorityOrdersEnabled = useDEXPriorityOrderFlag(input.tokenIn?.chainId)
  const isDutchV3Enabled = useFeatureFlag(FeatureFlags.ArbitrumDutchV3)
  const { data: isDelegationMismatch } = useIsMismatchAccountQuery({ chainId: input.tokenIn?.chainId })
  // if there is a mismatched account, we want to disable dex
  const canUseDEX = isDEXSupportedChain && !isDelegationMismatch

  const getRoutingAPIArguments = useMemo(
    () =>
      createGetRoutingAPIArguments({
        canUseDEX,
        isPriorityOrdersEnabled,
        isDutchV3Enabled,
      }),
    [canUseDEX, isPriorityOrdersEnabled, isDutchV3Enabled],
  )

  const { tokenIn, tokenOut, amount, account, routerPreference, protocolPreferences, tradeType } = input

  const inputValidated = validateRoutingAPIInput(input)

  return useMemo(() => {
    if (!inputValidated) {
      return skipToken
    }
    return getRoutingAPIArguments({
      account,
      tokenIn,
      tokenOut,
      amount,
      tradeType,
      routerPreference,
      protocolPreferences,
    })
  }, [
    getRoutingAPIArguments,
    tokenIn,
    tokenOut,
    amount,
    account,
    routerPreference,
    protocolPreferences,
    tradeType,
    inputValidated,
  ])
}
