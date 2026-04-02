import type { Currency, CurrencyAmount, Price } from '@luxamm/sdk-core'
import { FeatureFlags, useFeatureFlag } from '@luxexchange/gating'
import { createContext, type ReactNode, useContext } from 'react'
import type { PollingInterval } from '@luxexchange/lx/src/constants/misc'
import { useTokenSpotPrice as useTokenSpotPriceLegacy } from '@luxexchange/lx/src/features/dataApi/tokenDetails/useTokenDetailsData'
import { useTokenSpotPriceCentralized } from '@luxexchange/lx/src/features/dataApi/tokenDetails/useTokenSpotPriceCentralized'
import {
  useUSDCPrice as useUSDCPriceLegacy,
  useUSDCValue as useUSDCValueLegacy,
  useUSDCValueWithStatus as useUSDCValueWithStatusLegacy,
} from '@luxexchange/lx/src/features/transactions/hooks/useUSDCPrice'
import {
  useUSDCPriceCentralized,
  useUSDCValueCentralized,
  useUSDCValueWithStatusCentralized,
} from '@luxexchange/lx/src/features/transactions/hooks/useUSDCPriceCentralized'
import type { CurrencyId } from '@luxexchange/lx/src/types/currency'

export interface TokenPriceHooks {
  useUSDCPrice: (
    currency?: Currency,
    pollInterval?: PollingInterval,
  ) => { price: Price<Currency, Currency> | undefined; isLoading: boolean }

  useUSDCValue: (
    currencyAmount: CurrencyAmount<Currency> | undefined | null,
    pollInterval?: PollingInterval,
  ) => CurrencyAmount<Currency> | null

  useUSDCValueWithStatus: (
    currencyAmount: CurrencyAmount<Currency> | undefined | null,
    pollInterval?: PollingInterval,
  ) => {
    value: CurrencyAmount<Currency> | null
    isLoading: boolean
  }

  useTokenSpotPrice: (currencyId: CurrencyId | undefined) => number | undefined
}

const LEGACY_HOOKS: TokenPriceHooks = {
  useUSDCPrice: useUSDCPriceLegacy,
  useUSDCValue: useUSDCValueLegacy,
  useUSDCValueWithStatus: useUSDCValueWithStatusLegacy,
  useTokenSpotPrice: useTokenSpotPriceLegacy,
}

const CENTRALIZED_HOOKS: TokenPriceHooks = {
  useUSDCPrice: useUSDCPriceCentralized,
  useUSDCValue: useUSDCValueCentralized,
  useUSDCValueWithStatus: useUSDCValueWithStatusCentralized,
  useTokenSpotPrice: useTokenSpotPriceCentralized,
}

const TokenPriceContext = createContext<TokenPriceHooks>(LEGACY_HOOKS)

export function TokenPriceProvider({ children }: { children: ReactNode }): JSX.Element {
  const useCentralized = useFeatureFlag(FeatureFlags.CentralizedPrices)
  const hooks = useCentralized ? CENTRALIZED_HOOKS : LEGACY_HOOKS
  return <TokenPriceContext.Provider value={hooks}>{children}</TokenPriceContext.Provider>
}

export function useTokenPriceHooks(): TokenPriceHooks {
  return useContext(TokenPriceContext)
}
