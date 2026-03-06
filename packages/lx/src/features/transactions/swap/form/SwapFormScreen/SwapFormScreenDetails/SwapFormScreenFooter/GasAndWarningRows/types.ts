import { FormattedDEXGasFeeInfo, GasFeeResult } from '@universe/api'
import { UniverseChainId } from 'lx/src/features/chains/types'

export type GasInfo = {
  gasFee: GasFeeResult
  fiatPriceFormatted?: string
  dexGasFeeInfo?: FormattedDEXGasFeeInfo
  isHighRelativeToValue: boolean
  isLoading: boolean
  chainId: UniverseChainId
}
