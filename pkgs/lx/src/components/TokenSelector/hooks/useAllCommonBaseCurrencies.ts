import { GqlResult } from '@l.x/api'
import { useCurrencies } from 'lx/src/components/TokenSelector/hooks/useCurrencies'
import { USDC, USDT, WBTC } from 'lx/src/constants/tokens'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { buildNativeCurrencyId, buildWrappedNativeCurrencyId, currencyId } from 'lx/src/utils/currencyId'

// Use Mainnet base token addresses since TokenProjects query returns each token
// on each network
const baseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.Mainnet),
  buildNativeCurrencyId(UniverseChainId.Polygon),
  buildNativeCurrencyId(UniverseChainId.Bnb),
  buildNativeCurrencyId(UniverseChainId.Celo),
  buildNativeCurrencyId(UniverseChainId.Avalanche),
  buildNativeCurrencyId(UniverseChainId.Solana),
  buildNativeCurrencyId(UniverseChainId.Monad),
  currencyId(USDC),
  currencyId(USDT),
  currencyId(WBTC),
  buildWrappedNativeCurrencyId(UniverseChainId.Mainnet),
]

export function useAllCommonBaseCurrencies(): GqlResult<CurrencyInfo[]> {
  const { isTestnetModeEnabled } = useEnabledChains()
  return useCurrencies(isTestnetModeEnabled ? [] : baseCurrencyIds)
}
