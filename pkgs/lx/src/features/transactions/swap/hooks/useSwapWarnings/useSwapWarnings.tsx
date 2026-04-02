import type { TFunction } from 'i18next'
import isEqual from 'lodash/isEqual'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedWarnings, Warning } from '@l.x/lx/src/components/modals/WarningModal/types'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useActiveAddress } from '@l.x/lx/src/features/accounts/store/hooks'
import { useTransactionGasWarning } from '@l.x/lx/src/features/gas/hooks'
import type { LocalizationContextState } from '@l.x/lx/src/features/language/LocalizationContext'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import {
  getNetworkWarning,
  useFormattedWarnings,
} from '@l.x/lx/src/features/transactions/hooks/useParsedTransactionWarnings'
import { getBalanceWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/getBalanceWarning'
import { getFormIncompleteWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/getFormIncompleteWarning'
import { getPriceImpactWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/getPriceImpactWarning'
import { getSwapWarningFromError } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/getSwapWarningFromError'
import { getTokenBlockedWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/getTokenBlockedWarning'
import { useParsedActivePlanWarnings } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/useParsedActivePlanWarnings'
import { activePlanStore } from '@l.x/lx/src/features/transactions/swap/review/stores/activePlan/activePlanStore'
import { useSwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useSwapTxStore } from '@l.x/lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import { getPriceImpact } from '@l.x/lx/src/features/transactions/swap/utils/getPriceImpact'
import { useIsOffline } from 'utilities/src/connection/useIsOffline'
import { useMemoCompare } from 'utilities/src/react/hooks'
import { useStore } from 'zustand'

export function getSwapWarnings({
  t,
  formatPercent,
  derivedSwapInfo,
  offline,
}: {
  t: TFunction
  formatPercent: LocalizationContextState['formatPercent']
  derivedSwapInfo: DerivedSwapInfo
  offline: boolean
}): Warning[] {
  const warnings: Warning[] = []

  if (offline) {
    warnings.push(getNetworkWarning(t))
  }

  const { trade } = derivedSwapInfo

  // token is blocked
  const tokenBlockedWarning = getTokenBlockedWarning(t, derivedSwapInfo.currencies)
  if (tokenBlockedWarning) {
    warnings.push(tokenBlockedWarning)
  }

  // insufficient balance for swap
  const balanceWarning = getBalanceWarning({
    t,
    currencyBalances: derivedSwapInfo.currencyBalances,
    currencyAmounts: derivedSwapInfo.currencyAmounts,
  })
  if (balanceWarning) {
    warnings.push(balanceWarning)
  }

  if (trade.error) {
    warnings.push(getSwapWarningFromError({ error: trade.error, t, derivedSwapInfo }))
  }

  // swap form is missing input, output fields
  const formIncompleteWarning = getFormIncompleteWarning(derivedSwapInfo)
  if (formIncompleteWarning) {
    warnings.push(formIncompleteWarning)
  }

  // price impact warning
  const priceImpact = getPriceImpact(derivedSwapInfo)
  const priceImpactWarning = getPriceImpactWarning({
    t,
    priceImpact,
    formatPercent,
  })
  if (priceImpactWarning) {
    warnings.push(priceImpactWarning)
  }

  return warnings
}

function useSwapWarnings(derivedSwapInfo: DerivedSwapInfo): Warning[] {
  const { t } = useTranslation()
  const { formatPercent } = useLocalizationContext()
  const offline = useIsOffline()

  return useMemoCompare(() => getSwapWarnings({ t, formatPercent, derivedSwapInfo, offline }), isEqual)
}

function useParsedSwapFormWarnings(): ParsedWarnings {
  const derivedSwapInfo = useSwapFormStore((s) => s.derivedSwapInfo)

  const accountAddress = useActiveAddress(derivedSwapInfo.chainId)

  const gasFee = useSwapTxStore((s) => s.gasFee)

  const swapWarnings = useSwapWarnings(derivedSwapInfo)

  // Check if current wallet can pay gas fees in any token
  const { getCanPayGasInAnyToken } = useLuxContext()
  const skipGasCheck = getCanPayGasInAnyToken?.()

  const gasWarning = useTransactionGasWarning({
    accountAddress,
    derivedInfo: derivedSwapInfo,
    gasFee: gasFee.value,
    skipGasCheck,
  })

  const allWarnings = useMemo(() => {
    return !gasWarning ? swapWarnings : [...swapWarnings, gasWarning]
  }, [gasWarning, swapWarnings])

  return useFormattedWarnings(allWarnings)
}

export function useParsedSwapWarnings(): ParsedWarnings {
  const hasActivePlan = useStore(activePlanStore, (s) => !!s.activePlan)

  const formWarnings = useParsedSwapFormWarnings()
  const planWarnings = useParsedActivePlanWarnings()

  return hasActivePlan ? planWarnings : formWarnings
}
