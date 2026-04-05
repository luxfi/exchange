import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { iconSizes } from '@l.x/ui/src/theme/iconSizes'
import { SplitLogo } from '@l.x/lx/src/components/CurrencyLogo/SplitLogo'
import { TokenLogo } from '@l.x/lx/src/components/CurrencyLogo/TokenLogo'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { TransactionDetails } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'
=======
import { iconSizes } from 'ui/src/theme/iconSizes'
import { SplitLogo } from 'uniswap/src/components/CurrencyLogo/SplitLogo'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { TransactionDetails } from 'uniswap/src/features/transactions/types/transactionDetails'
import { getSymbolDisplayText } from 'uniswap/src/utils/currency'
>>>>>>> upstream/main
import { buildActivityRowFragments } from '~/pages/Portfolio/Activity/ActivityTable/registry'
import { getTransactionTypeFilterOptions } from '~/pages/Portfolio/Activity/Filters/utils'

const COMPACT_TOKEN_LOGO_SIZE = iconSizes.icon24

export function formatAmountWithSymbol(amount: string | undefined, symbol: string | undefined): string | null {
  return amount ? `${amount} ${getSymbolDisplayText(symbol)}` : null
}

export function getUsdValue(value: string | undefined): string | null {
  return value !== '-' ? (value ?? null) : null
}

// Helper to get transaction type display label
export function getTransactionTypeLabel(
  transaction: TransactionDetails,
  t: ReturnType<typeof useTranslation>['t'],
): string {
  const fragments = buildActivityRowFragments(transaction)
  const { typeLabel } = fragments

  const transactionTypeOptions = getTransactionTypeFilterOptions(t)
  const typeOption = typeLabel?.baseGroup ? transactionTypeOptions[typeLabel.baseGroup] : null

  return typeLabel?.overrideLabelKey ? t(typeLabel.overrideLabelKey) : (typeOption?.label ?? 'Transaction')
}

// Helper to create TokenLogo for compact variant
export function createTokenLogo(currencyInfo: CurrencyInfo | null | undefined): React.ReactNode {
  if (!currencyInfo) {
    return null
  }

  return (
    <TokenLogo
      chainId={currencyInfo.currency.chainId}
      name={currencyInfo.currency.name}
      symbol={currencyInfo.currency.symbol}
      size={COMPACT_TOKEN_LOGO_SIZE}
      url={currencyInfo.logoUrl}
    />
  )
}

// Helper to create SplitLogo for compact variant
export function createSplitLogo({
  chainId,
  inputCurrencyInfo,
  outputCurrencyInfo,
}: {
  chainId: number
  inputCurrencyInfo: CurrencyInfo | null | undefined
  outputCurrencyInfo: CurrencyInfo | null | undefined
}): React.ReactNode {
  if (!inputCurrencyInfo || !outputCurrencyInfo) {
    return null
  }

  return (
    <SplitLogo
      chainId={chainId}
      inputCurrencyInfo={inputCurrencyInfo}
      outputCurrencyInfo={outputCurrencyInfo}
      size={COMPACT_TOKEN_LOGO_SIZE}
    />
  )
}

// Helper to format compact amount text with separator
export function formatCompactAmountText({
  inputAmount,
  inputSymbol,
  outputAmount,
  outputSymbol,
  separator = '→',
}: {
  inputAmount: string | undefined
  inputSymbol: string | undefined
  outputAmount: string | undefined
  outputSymbol: string | undefined
  separator?: string
}): string | null {
<<<<<<< HEAD
  if (!inputAmount || !outputAmount || !inputSymbol || !outputSymbol) {
    return null
  }

  return `${inputAmount} ${inputSymbol} ${separator} ${outputAmount} ${outputSymbol}`
=======
  const left = inputAmount && inputSymbol ? `${inputAmount} ${getSymbolDisplayText(inputSymbol)}` : null
  const right = outputAmount && outputSymbol ? `${outputAmount} ${getSymbolDisplayText(outputSymbol)}` : null
  if (!left && !right) {
    return null
  }
  if (left && right) {
    return `${left} ${separator} ${right}`
  }
  return left ?? right
>>>>>>> upstream/main
}

// Helper to format single token compact amount text
export function formatSingleCompactAmountText(amount: string | undefined, symbol: string | undefined): string | null {
  if (!amount || !symbol) {
    return null
  }

  return `${amount} ${symbol}`
}
