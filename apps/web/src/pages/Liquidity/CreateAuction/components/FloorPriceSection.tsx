import { type Currency, type CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Input, Text, TouchableArea } from 'ui/src'
import { fonts } from 'ui/src/theme'
import { type UniverseChainId } from 'uniswap/src/features/chains/types'
import { useAppFiatCurrencyInfo } from 'uniswap/src/features/fiatCurrency/hooks'
import { useCurrentLocale } from 'uniswap/src/features/language/hooks'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { useUSDCPrice } from 'uniswap/src/features/transactions/hooks/useUSDCPriceWrapper'
import { NumberType } from 'utilities/src/format/types'
import { RaiseCurrency } from '~/pages/Liquidity/CreateAuction/types'
import { getRaiseCurrencyAsCurrency } from '~/pages/Liquidity/CreateAuction/utils'

// Two independent axes:
//   denomination – what the numeric input represents (floor price per token, or FDV)
//   inputCurrency – the currency the user types in (raise token, or USD fiat)
type Denomination = 'floorPrice' | 'fdv'
type InputCurrency = 'raise' | 'usd'

// ─── Pure helpers (input normalization & floor price math) ───────────────────

function normalizeDecimalInput(value: string, decimalSeparator: string): string | null {
  const normalized = decimalSeparator !== '.' ? value.replace(decimalSeparator, '.') : value
  if (!/^\d*\.?\d*$/.test(normalized)) {
    return null
  }
  return normalized
}

function exceedsDecimalCap(normalized: string, maxDecimals: number): boolean {
  const dotIndex = normalized.indexOf('.')
  return dotIndex !== -1 && normalized.length - dotIndex - 1 > maxDecimals
}

function computeFloorPriceFromLocalInput({
  denomination,
  inputCurrency,
  num,
  usdPriceNum,
  totalSupplyNum,
}: {
  denomination: Denomination
  inputCurrency: InputCurrency
  num: number
  usdPriceNum: number | null
  totalSupplyNum: number
}): string {
  if (denomination === 'floorPrice' && inputCurrency === 'usd') {
    if (!usdPriceNum || usdPriceNum <= 0) {
      return ''
    }
    return (num / usdPriceNum).toString()
  }
  if (denomination === 'fdv' && inputCurrency === 'raise') {
    if (!Number.isFinite(totalSupplyNum) || totalSupplyNum <= 0) {
      return ''
    }
    return (num / totalSupplyNum).toString()
  }
  // fdv + usd
  if (!usdPriceNum || usdPriceNum <= 0 || !Number.isFinite(totalSupplyNum) || totalSupplyNum <= 0) {
    return ''
  }
  return (num / usdPriceNum / totalSupplyNum).toString()
}

function getDisplayValueForMode({
  denomination,
  inputCurrency,
  floorPriceNum,
  totalSupplyNum,
  usdPriceNum,
  hasValidFloorPrice,
}: {
  denomination: Denomination
  inputCurrency: InputCurrency
  floorPriceNum: number
  totalSupplyNum: number
  usdPriceNum: number | null
  hasValidFloorPrice: boolean
}): string {
  if (!hasValidFloorPrice) {
    return ''
  }
  if (denomination === 'floorPrice' && inputCurrency === 'usd') {
    return usdPriceNum !== null ? (floorPriceNum * usdPriceNum).toString() : ''
  }
  if (denomination === 'fdv' && inputCurrency === 'raise') {
    return Number.isFinite(totalSupplyNum) ? (floorPriceNum * totalSupplyNum).toString() : ''
  }
  if (denomination === 'fdv' && inputCurrency === 'usd') {
    return usdPriceNum !== null && Number.isFinite(totalSupplyNum)
      ? (floorPriceNum * totalSupplyNum * usdPriceNum).toString()
      : ''
  }
  // floorPrice + raise: parent-controlled, caller can use floorPrice string directly
  return ''
}

export function FloorPriceSection({
  chainId,
  floorPrice,
  raiseCurrency,
  tokenTotalSupply,
  onFloorPriceChange,
}: {
  chainId: UniverseChainId
  floorPrice: string
  raiseCurrency: RaiseCurrency
  tokenTotalSupply: CurrencyAmount<Currency>
  onFloorPriceChange: (value: string) => void
}) {
  const { t } = useTranslation()
  const mirrorRef = useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = useState<number | null>(null)

  const [denomination, setDenomination] = useState<Denomination>('floorPrice')
  const [inputCurrency, setInputCurrency] = useState<InputCurrency>('raise')
  // Local value (dot-normalized) used in all modes except floorPrice+raise,
  // where the parent's `floorPrice` prop is the direct source of truth.
  const [localValue, setLocalValue] = useState('')

  const { convertFiatAmountFormatted, formatNumberOrString } = useLocalizationContext()
  const { code: fiatCurrencyCode } = useAppFiatCurrencyInfo()
  const locale = useCurrentLocale()

  const raiseCurrencyObj = useMemo(() => getRaiseCurrencyAsCurrency(raiseCurrency, chainId), [raiseCurrency, chainId])

  const { price: raiseCurrencyUsdPrice } = useUSDCPrice(raiseCurrencyObj)

  const decimalSeparator = useMemo(
    () =>
      Intl.NumberFormat(locale)
        .formatToParts(1.1)
        .find((p) => p.type === 'decimal')?.value ?? '.',
    [locale],
  )

  const floorPriceNum = parseFloat(floorPrice)
  const totalSupplyNum = parseFloat(tokenTotalSupply.toExact())
  const hasValidFloorPrice = Number.isFinite(floorPriceNum) && floorPriceNum > 0

  const usdPriceNum = useMemo(() => {
    if (!raiseCurrencyUsdPrice) {
      return null
    }
    try {
      return Number(raiseCurrencyUsdPrice.toSignificant(18))
    } catch {
      return null
    }
  }, [raiseCurrencyUsdPrice])

  // FDV in raise currency, always derived from the canonical floorPrice prop.
  const fdvRaiseNum = hasValidFloorPrice && Number.isFinite(totalSupplyNum) ? floorPriceNum * totalSupplyNum : null

  // In floorPrice+raise mode the parent prop is the source of truth; all other modes use localValue.
  const isParentControlled = denomination === 'floorPrice' && inputCurrency === 'raise'
  const activeDisplayValue = isParentControlled
    ? floorPrice.replace('.', decimalSeparator)
    : localValue.replace('.', decimalSeparator)

  // ─── Derived display strings ──────────────────────────────────────────────

  // Label next to the input: currency + optional "FDV" suffix.
  const inputLabel = useMemo(() => {
    const currencyStr = inputCurrency === 'usd' ? fiatCurrencyCode : raiseCurrency
    return denomination === 'fdv' ? `${currencyStr} ${t('stats.fdv')}` : currencyStr
  }, [inputCurrency, denomination, fiatCurrencyCode, raiseCurrency, t])

  // Pill: always shows the other denomination in raise currency.
  const pillText = useMemo(() => {
    if (denomination === 'floorPrice') {
      const display =
        fdvRaiseNum !== null
          ? formatNumberOrString({ value: fdvRaiseNum.toString(), type: NumberType.TokenNonTx })
          : '0'
      return `${display} ${raiseCurrency} ${t('stats.fdv')}`
    }
    const display = hasValidFloorPrice ? formatNumberOrString({ value: floorPrice, type: NumberType.TokenNonTx }) : '0'
    return `${display} ${raiseCurrency} ${t('toucan.createAuction.step.configureAuction.tokenPrice')}`
  }, [denomination, fdvRaiseNum, hasValidFloorPrice, floorPrice, raiseCurrency, formatNumberOrString, t])

  // Bottom row: shows the other currency representation.
  const bottomText = useMemo(() => {
    if (inputCurrency === 'usd') {
      // Show raise-currency equivalent.
      if (denomination === 'floorPrice') {
        const display = hasValidFloorPrice
          ? formatNumberOrString({ value: floorPrice, type: NumberType.TokenNonTx })
          : '0'
        return `${display} ${raiseCurrency}`
      }
      const display =
        fdvRaiseNum !== null
          ? formatNumberOrString({ value: fdvRaiseNum.toString(), type: NumberType.TokenNonTx })
          : '0'
      return `${display} ${raiseCurrency} ${t('stats.fdv')}`
    }
    // Show fiat equivalent.
    if (!hasValidFloorPrice || usdPriceNum === null) {
      return `${convertFiatAmountFormatted(0, NumberType.FiatTokenPrice)} ${fiatCurrencyCode}`
    }
    const raiseAmount = denomination === 'fdv' && fdvRaiseNum !== null ? fdvRaiseNum : floorPriceNum
    return `${convertFiatAmountFormatted(raiseAmount * usdPriceNum, NumberType.FiatTokenPrice)} ${fiatCurrencyCode}`
  }, [
    inputCurrency,
    denomination,
    hasValidFloorPrice,
    floorPrice,
    floorPriceNum,
    fdvRaiseNum,
    raiseCurrency,
    usdPriceNum,
    convertFiatAmountFormatted,
    fiatCurrencyCode,
    formatNumberOrString,
    t,
  ])

  // ─── Input handler ────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (value: string) => {
      const normalized = normalizeDecimalInput(value, decimalSeparator)
      if (normalized === null) {
        return
      }

      if (isParentControlled) {
        const maxDecimals = raiseCurrencyObj?.decimals
        if (maxDecimals !== undefined && exceedsDecimalCap(normalized, maxDecimals)) {
          return
        }
        onFloorPriceChange(normalized)
        return
      }

      setLocalValue(normalized)

      const num = parseFloat(normalized)
      if (!Number.isFinite(num) || num <= 0) {
        onFloorPriceChange('')
        return
      }

      const floorPriceResult = computeFloorPriceFromLocalInput({
        denomination,
        inputCurrency,
        num,
        usdPriceNum,
        totalSupplyNum,
      })
      onFloorPriceChange(floorPriceResult)
    },
    [
      decimalSeparator,
      isParentControlled,
      denomination,
      inputCurrency,
      raiseCurrencyObj?.decimals,
      usdPriceNum,
      totalSupplyNum,
      onFloorPriceChange,
    ],
  )

  // ─── Toggle handlers ──────────────────────────────────────────────────────

  // Pill: toggle denomination, keeping inputCurrency unchanged.
  const toggleDenomination = useCallback(() => {
    const next: Denomination = denomination === 'floorPrice' ? 'fdv' : 'floorPrice'
    const displayValue = getDisplayValueForMode({
      denomination: next,
      inputCurrency,
      floorPriceNum,
      totalSupplyNum,
      usdPriceNum,
      hasValidFloorPrice,
    })
    setLocalValue(displayValue)
    setDenomination(next)
  }, [denomination, inputCurrency, hasValidFloorPrice, floorPriceNum, totalSupplyNum, usdPriceNum])

  // Bottom row: toggle inputCurrency, keeping denomination unchanged.
  const toggleInputCurrency = useCallback(() => {
    const next: InputCurrency = inputCurrency === 'raise' ? 'usd' : 'raise'
    const displayValue = getDisplayValueForMode({
      denomination,
      inputCurrency: next,
      floorPriceNum,
      totalSupplyNum,
      usdPriceNum,
      hasValidFloorPrice,
    })
    setLocalValue(displayValue)
    setInputCurrency(next)
  }, [inputCurrency, denomination, hasValidFloorPrice, floorPriceNum, totalSupplyNum, usdPriceNum])

  // biome-ignore lint/correctness/useExhaustiveDependencies: active input value is the trigger to re-measure the mirror span after it re-renders
  useLayoutEffect(() => {
    if (mirrorRef.current) {
      setInputWidth(mirrorRef.current.offsetWidth)
    }
  }, [activeDisplayValue])

  return (
    <Flex gap="$spacing8">
      <Flex gap="$spacing4">
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.floorPrice')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.floorPrice.description')}
        </Text>
      </Flex>
      <Flex
        backgroundColor="$surface2"
        borderWidth={1}
        borderColor="$surface3"
        borderRadius="$rounded16"
        p="$spacing16"
        position="relative"
      >
        <Flex gap="$spacing4">
          <Flex row gap="$spacing8" alignItems="center" justifyContent="space-between">
            <Flex row gap="$spacing4" alignItems="center" flex={1} minWidth={0}>
              <Flex
                {...(inputWidth !== null ? { width: inputWidth + 2 } : { flex: 1 })}
                maxWidth="100%"
                flexShrink={1}
                minWidth={0}
                style={{ position: 'relative' }}
              >
                <Input
                  height={fonts.heading3.lineHeight}
                  width="100%"
                  value={activeDisplayValue}
                  onChangeText={handleChange}
                  placeholder={`0${decimalSeparator}00`}
                  placeholderTextColor="$neutral3"
                  keyboardType="decimal-pad"
                  fontSize={fonts.heading3.fontSize}
                  lineHeight={fonts.heading3.lineHeight}
                  fontWeight={fonts.heading3.fontWeight}
                  color="$neutral1"
                  px="$none"
                  backgroundColor="$transparent"
                />
                {/* Mirror span sized to content — measured synchronously in useLayoutEffect before paint */}
                <span
                  ref={mirrorRef}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    whiteSpace: 'pre',
                    pointerEvents: 'none',
                    fontSize: fonts.heading3.fontSize,
                    fontWeight: String(fonts.heading3.fontWeight),
                    lineHeight: `${fonts.heading3.lineHeight}px`,
                  }}
                >
                  {activeDisplayValue || `0${decimalSeparator}00`}
                </span>
              </Flex>
              <Text variant="heading3" color="$neutral2" flexShrink={0}>
                {inputLabel}
              </Text>
            </Flex>
            <TouchableArea onPress={toggleDenomination} flexShrink={0}>
              <Flex backgroundColor="$surface3" borderRadius="$roundedFull" p="$spacing8">
                <Text variant="buttonLabel4" color="$neutral1">
                  {pillText}
                </Text>
              </Flex>
            </TouchableArea>
          </Flex>
          <TouchableArea onPress={toggleInputCurrency}>
            <Text variant="subheading2" color="$neutral2">
              {bottomText}
            </Text>
          </TouchableArea>
        </Flex>
      </Flex>
    </Flex>
  )
}
