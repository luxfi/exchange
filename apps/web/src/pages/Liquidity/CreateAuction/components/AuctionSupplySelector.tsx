import { type Currency, type CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Input, Text } from 'ui/src'
import { fonts } from 'ui/src/theme'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import tryParseCurrencyAmount from '~/lib/utils/tryParseCurrencyAmount'
import { PercentButton } from '~/pages/Liquidity/CreateAuction/components/PercentButton'
import { percentOfAmount } from '~/pages/Liquidity/CreateAuction/utils'

const QUICK_SELECT_PERCENTS = [2, 5, 10] as const

const SUFFIX_EXPONENTS: Record<'k' | 'm' | 'b' | 't', number> = {
  k: 3,
  m: 6,
  b: 9,
  t: 12,
}

/**
 * Expands a suffixed numeric string into a plain decimal string using
 * integer arithmetic (no floating-point) to avoid rounding errors.
 *
 * Examples: "3.33b" → "3330000000", "500k" → "500000", "1.5m" → "1500000"
 */
function expandSuffix(input: string): string | null {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) {
    return null
  }

  const lastChar = trimmed[trimmed.length - 1]
  const exponent =
    lastChar in SUFFIX_EXPONENTS ? SUFFIX_EXPONENTS[lastChar as keyof typeof SUFFIX_EXPONENTS] : undefined

  // No suffix — return as-is (plain number)
  if (exponent === undefined) {
    return /^\d*\.?\d+$/.test(trimmed) ? trimmed : null
  }

  const numStr = trimmed.slice(0, -1)
  if (!numStr || !/^\d*\.?\d+$/.test(numStr)) {
    return null
  }

  // Shift the decimal point right by `exponent` places using string ops
  const dotIndex = numStr.indexOf('.')
  if (dotIndex === -1) {
    // Integer: just append zeros
    return numStr + '0'.repeat(exponent)
  }

  const intPart = numStr.slice(0, dotIndex)
  const fracPart = numStr.slice(dotIndex + 1)

  if (fracPart.length <= exponent) {
    // Fractional digits fit within the shift — result is an integer
    return intPart + fracPart + '0'.repeat(exponent - fracPart.length)
  }

  // More fractional digits than the exponent — insert a new decimal point
  const newIntPart = intPart + fracPart.slice(0, exponent)
  const newFracPart = fracPart.slice(exponent)
  return newIntPart + '.' + newFracPart
}

/**
 * Parses a suffixed input string into a CurrencyAmount with exact precision.
 */
function parseSuffixedAmount(input: string, currency: Currency): CurrencyAmount<Currency> | null {
  const expanded = expandSuffix(input)
  if (!expanded) {
    return null
  }
  return tryParseCurrencyAmount(expanded, currency) ?? null
}

function isAllowedInput(value: string): boolean {
  return /^(\d*\.?\d*)[kmbt]?$/i.test(value)
}

interface AuctionSupplySelectorProps {
  auctionSupplyAmount: CurrencyAmount<Currency>
  tokenTotalSupply: CurrencyAmount<Currency>
  tokenSymbol: string
  onSelectPercent: (percent: number) => void
  onAmountChange: (amount: CurrencyAmount<Currency>) => void
}

export function AuctionSupplySelector({
  auctionSupplyAmount,
  tokenTotalSupply,
  tokenSymbol,
  onSelectPercent,
  onAmountChange,
}: AuctionSupplySelectorProps) {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()

  const [isFocused, setIsFocused] = useState(false)
  const [rawInput, setRawInput] = useState('')

  const currency = tokenTotalSupply.currency

  const formatAmount = (amount: CurrencyAmount<Currency>): string =>
    formatNumberOrString({
      value: amount.toExact(),
      type: NumberType.TokenQuantityStats,
      placeholder: '0',
    })

  const displayValue = formatAmount(auctionSupplyAmount)
  const totalSupplyFormatted = formatAmount(tokenTotalSupply)

  // While focused, parse typed value into a CurrencyAmount for exact comparison
  const parsedAmount = useMemo(
    () => (isFocused ? parseSuffixedAmount(rawInput, currency) : null),
    [isFocused, rawInput, currency],
  )
  const exceedsTotalSupply = parsedAmount !== null && parsedAmount.greaterThan(tokenTotalSupply)

  const handleChange = useCallback(
    (value: string) => {
      if (!isAllowedInput(value)) {
        return
      }
      setRawInput(value)

      const parsed = parseSuffixedAmount(value, currency)
      if (!parsed) {
        return
      }

      // Live-update with exact amount; cap to total supply so the store stays valid
      const capped = parsed.greaterThan(tokenTotalSupply) ? tokenTotalSupply : parsed
      onAmountChange(capped)
    },
    [currency, tokenTotalSupply, onAmountChange],
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    // Seed the input with the current raw numeric value (unformatted)
    const exactValue = auctionSupplyAmount.toExact()
    setRawInput(exactValue === '0' ? '' : exactValue)
  }, [auctionSupplyAmount])

  const handleBlur = useCallback(() => {
    setIsFocused(false)

    const parsed = parseSuffixedAmount(rawInput, currency)
    if (!parsed) {
      return
    }

    // Cap to total supply on blur
    const capped = parsed.greaterThan(tokenTotalSupply) ? tokenTotalSupply : parsed
    onAmountChange(capped)
  }, [rawInput, currency, tokenTotalSupply, onAmountChange])

  const handleSelectPercent = useCallback(
    (percent: number) => {
      setIsFocused(false)
      setRawInput('')
      onSelectPercent(percent)
    },
    [onSelectPercent],
  )

  return (
    <Flex row alignItems="flex-start" gap="$spacing4">
      {/* Left: label + editable amount */}
      <Flex flex={1} flexBasis={0} minWidth={0} gap="$spacing4">
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.auctionSupply')}
        </Text>
        {isFocused ? (
          <Input
            autoFocus
            height={fonts.heading3.lineHeight}
            width="100%"
            value={rawInput}
            onChangeText={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            placeholderTextColor="$neutral3"
            fontSize={fonts.heading3.fontSize}
            lineHeight={fonts.heading3.lineHeight}
            fontWeight={fonts.heading3.fontWeight}
            color={exceedsTotalSupply ? '$statusCritical' : '$neutral1'}
            px="$none"
            backgroundColor="$transparent"
          />
        ) : (
          <Text variant="heading3" color="$neutral1" cursor="text" onPress={handleFocus}>
            {displayValue}
          </Text>
        )}
      </Flex>

      {/* Right: total supply label + quick select pills */}
      <Flex flex={2} flexBasis={0} minWidth={0} gap="$spacing8" alignItems="flex-end">
        <Text variant="body3" color="$neutral2">
          {t('toucan.auction.totalSupply')}: {totalSupplyFormatted} {tokenSymbol}
        </Text>
        <Flex row width="100%" gap="$spacing2">
          {QUICK_SELECT_PERCENTS.map((pillPercent) => (
            <PercentButton
              key={pillPercent}
              label={`${pillPercent}%`}
              isActive={auctionSupplyAmount.equalTo(percentOfAmount(tokenTotalSupply, pillPercent))}
              onPress={handleSelectPercent.bind(null, pillPercent)}
            />
          ))}
          <PercentButton
            label={t('common.max')}
            isActive={auctionSupplyAmount.equalTo(tokenTotalSupply)}
            onPress={handleSelectPercent.bind(null, 100)}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
