import type { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { useCallback } from 'react'
import { Flex, Text } from '@l.x/ui/src'
import { spacing } from '@l.x/ui/src/theme/spacing'
import {
  AmountInputPresets,
  PRESET_BUTTON_PROPS,
} from '@l.x/lx/src/components/CurrencyInputPanel/AmountInputPresets/AmountInputPresets'
import { PresetAmountButton } from '@l.x/lx/src/components/CurrencyInputPanel/AmountInputPresets/PresetAmountButton'
import type { PresetPercentage } from '@l.x/lx/src/components/CurrencyInputPanel/AmountInputPresets/types'
import { PRESET_PERCENTAGES } from '@l.x/lx/src/components/CurrencyInputPanel/AmountInputPresets/utils'
import { DefaultTokenOptions } from '@l.x/lx/src/components/CurrencyInputPanel/DefaultTokenOptions/DefaultTokenOptions'
import type { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import { CurrencyField } from '@l.x/lx/src/types/currency'
import { isExtensionApp, isWebAppDesktop, isWebPlatform } from '@l.x/utils/src/platform'

interface CurrencyInputPanelHeaderProps {
  headerLabel?: string
  currencyField: CurrencyField
  currencyBalance: Maybe<CurrencyAmount<Currency>>
  currencyAmount: Maybe<CurrencyAmount<Currency>>
  currencyInfo: Maybe<CurrencyInfo>
  onSetPresetValue: (amount: string, percentage: PresetPercentage) => void
  showDefaultTokenOptions: boolean
  hidePresets?: boolean
}

export function CurrencyInputPanelHeader({
  headerLabel,
  currencyField,
  currencyBalance,
  currencyAmount,
  currencyInfo,
  onSetPresetValue,
  showDefaultTokenOptions,
  hidePresets,
}: CurrencyInputPanelHeaderProps): JSX.Element | null {
  const renderPreset = useCallback(
    (preset: PresetPercentage) => (
      <PresetAmountButton
        percentage={preset}
        currencyAmount={currencyAmount}
        currencyBalance={currencyBalance}
        currencyField={currencyField}
        elementName={ElementName.PresetPercentage}
        buttonProps={PRESET_BUTTON_PROPS}
        onSetPresetValue={onSetPresetValue}
      />
    ),
    [currencyAmount, currencyBalance, currencyField, onSetPresetValue],
  )

  if (!headerLabel && !showDefaultTokenOptions) {
    return null
  }

  const showInputPresets =
    (isWebAppDesktop || isExtensionApp) && !hidePresets && currencyField === CurrencyField.INPUT && currencyBalance

  return (
    <Flex row justifyContent="space-between">
      {/* IMPORTANT: $micro crashes on mobile */}
      <Text color="$neutral2" variant="subheading2" fontSize={isWebPlatform ? '$micro' : '$small'}>
        {headerLabel}
      </Text>
      {showInputPresets && (
        <Flex position="absolute" right={0} top={-spacing.spacing2}>
          <AmountInputPresets presets={PRESET_PERCENTAGES} renderPreset={renderPreset} />
        </Flex>
      )}
      {showDefaultTokenOptions && isWebAppDesktop && (
        <Flex position="absolute" right={0} top={-spacing.spacing6}>
          <DefaultTokenOptions currencyField={CurrencyField.OUTPUT} />
        </Flex>
      )}
    </Flex>
  )
}
