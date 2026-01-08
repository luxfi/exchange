import { useMemo } from 'react'
import { nativeOnChain } from 'lx/src/constants/tokens'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { GasFeeResult } from 'lx/src/features/gas/types'
import { hasSufficientFundsIncludingGas } from 'lx/src/features/gas/utils'
import { useOnChainNativeCurrencyBalance } from 'lx/src/features/portfolio/api'
import { getCurrencyAmount, ValueType } from 'lx/src/features/tokens/getCurrencyAmount'

export function useHasSufficientFunds({
  account,
  chainId,
  gasFee,
  value,
}: {
  account?: string
  chainId?: UniverseChainId
  gasFee: GasFeeResult
  value?: string
}): boolean {
  const { defaultChainId } = useEnabledChains()
  const nativeCurrency = nativeOnChain(chainId || defaultChainId)
  const { balance: nativeBalance } = useOnChainNativeCurrencyBalance(chainId ?? defaultChainId, account)

  const hasSufficientFunds = useMemo(() => {
    const transactionAmount =
      getCurrencyAmount({
        value,
        valueType: ValueType.Raw,
        currency: nativeCurrency,
      }) ?? undefined

    return hasSufficientFundsIncludingGas({
      transactionAmount,
      gasFee: gasFee.value,
      nativeCurrencyBalance: nativeBalance,
    })
  }, [value, nativeCurrency, gasFee.value, nativeBalance])

  return hasSufficientFunds
}
