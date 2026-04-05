import { useCallback, useRef, useState, type ComponentRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Input, Text, Tooltip, TouchableArea } from 'ui/src'
import { fonts } from 'ui/src/theme'
import { zIndexes } from 'ui/src/theme/zIndexes'
import { PercentButton } from '~/pages/Liquidity/CreateAuction/components/PercentButton'

type InputRef = ComponentRef<typeof Input>

const MIN_PERCENT = 25
const MAX_PERCENT = 100
const QUICK_SELECT_PERCENTS = [25, 50, 75, 100] as const

interface PostAuctionLiquiditySelectorProps {
  postAuctionLiquidityPercent: number
  onSelectPercent: (percent: number) => void
}

export function PostAuctionLiquiditySelector({
  postAuctionLiquidityPercent,
  onSelectPercent,
}: PostAuctionLiquiditySelectorProps) {
  const { t } = useTranslation()

  const inputRef = useRef<InputRef>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [rawInput, setRawInput] = useState('')
  const [showMinTooltip, setShowMinTooltip] = useState(false)

  // Clamp caret so it never lands on or after the trailing `%` (web: underlying `<input>`)
  const clampCaret = useCallback(() => {
    const el = inputRef.current as unknown as HTMLInputElement | null
    if (!el) {
      return
    }
    const max = el.value.length - 1 // before the `%`
    if ((el.selectionStart ?? 0) > max || (el.selectionEnd ?? 0) > max) {
      el.setSelectionRange(Math.min(el.selectionStart ?? max, max), Math.min(el.selectionEnd ?? max, max))
    }
  }, [])

  const parsedInput = isFocused ? Number(rawInput) : null
  const isInvalid =
    parsedInput !== null &&
    rawInput !== '' &&
    Number.isFinite(parsedInput) &&
    (parsedInput < MIN_PERCENT || parsedInput > MAX_PERCENT)

  const handleChange = useCallback(
    (value: string) => {
      // Only allow digits and dots
      if (!/^[\d.]*$/.test(value)) {
        return
      }
      setRawInput(value)

      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return
      }

      // Show tooltip when typing a value below minimum
      setShowMinTooltip(parsed < MIN_PERCENT)

      // Live-update percent (clamped to valid range for the store)
      onSelectPercent(Math.min(Math.max(parsed, MIN_PERCENT), MAX_PERCENT))
    },
    [onSelectPercent],
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setShowMinTooltip(false)
    const currentValue = String(Math.round(postAuctionLiquidityPercent))
    setRawInput(currentValue === '0' ? '' : currentValue)
  }, [postAuctionLiquidityPercent])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    setShowMinTooltip(false)

    const parsed = Number(rawInput)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return
    }

    // Snap to closest valid value on blur
    onSelectPercent(Math.min(Math.max(parsed, MIN_PERCENT), MAX_PERCENT))
  }, [rawInput, onSelectPercent])

  const handleSelectPercent = useCallback(
    (percent: number) => {
      setIsFocused(false)
      setRawInput('')
      setShowMinTooltip(false)
      onSelectPercent(percent)
    },
    [onSelectPercent],
  )

  const isMinActive = postAuctionLiquidityPercent === MIN_PERCENT

  return (
    <Flex row alignItems="center" gap="$spacing4">
      {/* Left: label + editable value */}
      <Flex flex={1} flexBasis={0} minWidth={0} gap="$spacing4">
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.postAuctionLiquidity')}
        </Text>
        {isFocused ? (
          <Input
            ref={inputRef}
            autoFocus
            height={fonts.heading3.lineHeight}
            value={`${rawInput}%`}
            onChangeText={(value: string) => handleChange(value.replace(/%/g, ''))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSelectionChange={clampCaret}
            placeholder="0%"
            placeholderTextColor="$neutral3"
            fontSize={fonts.heading3.fontSize}
            lineHeight={fonts.heading3.lineHeight}
            fontWeight={fonts.heading3.fontWeight}
            color={isInvalid ? '$statusCritical' : '$neutral1'}
            px="$none"
            backgroundColor="$transparent"
            width="100%"
          />
        ) : (
          <Text variant="heading3" color="$neutral1" cursor="text" onPress={handleFocus}>
            {`${Math.round(postAuctionLiquidityPercent)}%`}
          </Text>
        )}
      </Flex>

      {/* Right: quick selects */}
      <Flex flex={2} flexBasis={0} minWidth={0} gap="$spacing8" alignItems="flex-end">
        <Flex row width="100%" gap="$spacing2">
          {/* 25% button with controlled tooltip */}
          <Tooltip placement="bottom" open={showMinTooltip}>
            <TouchableArea
              flex={1}
              minWidth={0}
              backgroundColor={isMinActive ? '$surface3' : 'transparent'}
              borderWidth="$spacing1"
              borderColor="$surface3"
              borderRadius="$rounded16"
              px="$spacing8"
              py="$spacing6"
              onPress={handleSelectPercent.bind(null, MIN_PERCENT)}
            >
              <Tooltip.Trigger asChild>
                <Flex flex={1} alignItems="center" justifyContent="center">
                  <Text variant="buttonLabel4" color="$neutral1">
                    {`${MIN_PERCENT}%`}
                  </Text>
                </Flex>
              </Tooltip.Trigger>
            </TouchableArea>
            <Tooltip.Content zIndex={zIndexes.overlay}>
              <Tooltip.Arrow />
              <Text variant="body4" color="$neutral1" maxWidth={250}>
                {t('toucan.createAuction.step.configureAuction.postAuctionLiquidity.minTooltip')}
              </Text>
            </Tooltip.Content>
          </Tooltip>

          {QUICK_SELECT_PERCENTS.filter((pct) => pct !== MIN_PERCENT).map((pct) => (
            <PercentButton
              key={pct}
              label={`${pct}%`}
              isActive={postAuctionLiquidityPercent === pct}
              onPress={handleSelectPercent.bind(null, pct)}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
