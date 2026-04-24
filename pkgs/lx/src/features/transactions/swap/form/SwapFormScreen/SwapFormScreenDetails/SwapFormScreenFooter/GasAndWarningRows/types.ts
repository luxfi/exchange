import { FormattedLXGasFeeInfo, GasFeeResult } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

export type GasInfo = {
  gasFee: GasFeeResult
  fiatPriceFormatted?: string
  lxOrderGasFeeInfo?: FormattedLXGasFeeInfo
  isHighRelativeToValue: boolean
  isLoading: boolean
  chainId: UniverseChainId
}
