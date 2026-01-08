import { useMemo } from 'react'
import { MAX_NUMBER_OF_TOKENS } from 'lx/src/components/CurrencyInputPanel/DefaultTokenOptions/constants'
import { TokenOptionItem } from 'lx/src/components/CurrencyInputPanel/DefaultTokenOptions/TokenOptions/TokenOptionItem/TokenOptionItem'
import { useCommonTokensOptionsWithFallback } from 'lx/src/components/TokenSelector/hooks/useCommonTokensOptionsWithFallback'
import type { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { useSwapFormStoreDerivedSwapInfo } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useWallet } from 'lx/src/features/wallet/hooks/useWallet'
import type { CurrencyField } from 'lx/src/types/currency'

const createKey = (currency: CurrencyInfo['currency']): string =>
  currency.isNative ? `${currency.chainId}-native` : `${currency.chainId}-${currency.address}`

const useCommonTokensOptionsInfo = (): {
  allCurrencyInfos: CurrencyInfo[]
  numberOfCommonTokenOptions: number
} => {
  const wallet = useWallet()
  const chainId = useSwapFormStoreDerivedSwapInfo((s) => s.chainId)

  const { data: commonTokenOptions } = useCommonTokensOptionsWithFallback({
    evmAddress: wallet.evmAccount?.address,
    svmAddress: wallet.svmAccount?.address,
    chainFilter: chainId,
  })

  const numberOfCommonTokenOptions = commonTokenOptions?.length ?? 0

  const allCurrencyInfos: CurrencyInfo[] = useMemo(() => {
    return commonTokenOptions?.slice(0, MAX_NUMBER_OF_TOKENS).map(({ currencyInfo }) => currencyInfo) ?? []
  }, [commonTokenOptions])

  return {
    allCurrencyInfos,
    numberOfCommonTokenOptions,
  }
}

export const TokenOptions = ({ currencyField }: { currencyField: CurrencyField }): JSX.Element => {
  const { allCurrencyInfos, numberOfCommonTokenOptions } = useCommonTokensOptionsInfo()

  return (
    <>
      {allCurrencyInfos.map((currencyInfo, index) => {
        const { currency } = currencyInfo
        const key = createKey(currency)

        return (
          <TokenOptionItem
            key={key}
            currencyField={currencyField}
            currencyInfo={currencyInfo}
            index={index}
            numOptions={numberOfCommonTokenOptions}
          />
        )
      })}
    </>
  )
}
