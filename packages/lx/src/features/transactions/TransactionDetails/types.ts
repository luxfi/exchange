import { Percent } from '@luxamm/sdk-core'
import { WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { TokenProtectionWarning } from 'lx/src/features/tokens/warnings/types'

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
}

export type TokenWarningProps = {
  currencyInfo: Maybe<CurrencyInfo>
  tokenProtectionWarning: TokenProtectionWarning
  severity: WarningSeverity
}
