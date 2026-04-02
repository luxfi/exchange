import { FormattedLxSwapGasFeeInfo, GasFeeResult } from '@luxexchange/api'
import { UniverseChainId } from 'lx/src/features/chains/types'

export type GasInfo = {
  gasFee: GasFeeResult
  fiatPriceFormatted?: string
  lxSwapGasFeeInfo?: FormattedLxSwapGasFeeInfo
  isHighRelativeToValue: boolean
  isLoading: boolean
  chainId: UniverseChainId
}
