import { UniverseChainId } from 'lx/src/features/chains/types'

import { FormattedUniswapXGasFeeInfo, GasFeeResult } from 'lx/src/features/gas/types'

export type GasInfo = {
  gasFee: GasFeeResult
  fiatPriceFormatted?: string
  uniswapXGasFeeInfo?: FormattedUniswapXGasFeeInfo
  isHighRelativeToValue: boolean
  isLoading: boolean
  chainId: UniverseChainId
}
