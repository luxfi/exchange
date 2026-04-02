import { Percent } from '@luxamm/sdk-core'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { TokenProtectionWarning } from '@l.x/lx/src/features/tokens/warnings/types'

export type FoTFeeType = 'buy' | 'sell'

export type FeeOnTransferFeeGroupProps = {
  inputTokenInfo: TokenFeeInfo
  outputTokenInfo: TokenFeeInfo
}

export type TokenFeeInfo = {
  currencyInfo: Maybe<CurrencyInfo>
  tokenSymbol: string
  fee: Percent
  formattedUsdAmount: string
  formattedAmount: string
  isLoading?: boolean
}

export type TokenWarningProps = {
  currencyInfo: Maybe<CurrencyInfo>
  tokenProtectionWarning: TokenProtectionWarning
  severity: WarningSeverity
}
