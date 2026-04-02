import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import { RotatableChevron } from '@l.x/ui/src/components/icons'
import { iconSizes } from '@l.x/ui/src/theme'
import { PresetAmountButton } from '@l.x/lx/src/components/CurrencyInputPanel/AmountInputPresets/PresetAmountButton'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { TokenSelectorModal } from '@l.x/lx/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow, TokenSelectorVariation } from '@l.x/lx/src/components/TokenSelector/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { TransactionType } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { CurrencyField } from '@l.x/lx/src/types/currency'
import { NumberType } from '@l.x/utils/src/format/types'
import { useActiveAddresses } from '@luxfi/wallet/src/features/accounts/store/hooks'

interface TokenSelectorPanelProps {
  currencyInfo: Maybe<CurrencyInfo>
  currencyBalance: Maybe<CurrencyAmount<Currency>>
  currencyAmount: Maybe<CurrencyAmount<Currency>>
  showTokenSelector: boolean
  onSelectCurrency: ({
    currency,
    field,
    allowCrossChainPair,
  }: {
    currency: Currency
    field: CurrencyField
    allowCrossChainPair: boolean
  }) => void
  onHideTokenSelector: () => void
  onShowTokenSelector: () => void
  onSetMax: (amount: string) => void
}

export function TokenSelectorPanel({
  currencyInfo,
  currencyBalance,
  currencyAmount,
  onSetMax,
  onSelectCurrency,
  onHideTokenSelector,
  onShowTokenSelector,
  showTokenSelector,
}: TokenSelectorPanelProps): JSX.Element {
  const { t } = useTranslation()
  const addresses = useActiveAddresses()
  const { formatCurrencyAmount } = useLocalizationContext()

  const showMaxButton = currencyBalance && !currencyBalance.equalTo(0)
  const formattedCurrencyBalance = formatCurrencyAmount({
    value: currencyBalance,
    type: NumberType.TokenNonTx,
  })

  return (
    <>
      <Flex fill overflow="hidden">
        <TokenSelectorModal
          addresses={addresses}
          currencyField={CurrencyField.INPUT}
          flow={TokenSelectorFlow.Send}
          isModalOpen={showTokenSelector}
          isSurfaceReady={true}
          variation={TokenSelectorVariation.BalancesOnly}
          onClose={onHideTokenSelector}
          onSelectCurrency={onSelectCurrency}
        />
      </Flex>
      <TouchableArea onPress={onShowTokenSelector}>
        <Flex centered row justifyContent="space-between" p="$spacing16">
          <Flex centered row gap="$spacing12">
            <CurrencyLogo currencyInfo={currencyInfo} size={iconSizes.icon36} />
            <Flex gap="$none">
              <Text color="$neutral1" variant="body2">
                {currencyInfo?.currency.name}
              </Text>
              {currencyInfo && (
                <Text color="$neutral2" variant="body3">
                  {t('send.input.token.balance.title', {
                    balance: formattedCurrencyBalance,
                    symbol: currencyInfo.currency.symbol,
                  })}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex row gap="$spacing12">
            {showMaxButton && (
              <PresetAmountButton
                percentage="max"
                currencyAmount={currencyAmount}
                currencyBalance={currencyBalance}
                currencyField={CurrencyField.INPUT}
                transactionType={TransactionType.Send}
                onSetPresetValue={onSetMax}
              />
            )}
            <RotatableChevron color="$neutral3" direction="down" size="$icon.20" />
          </Flex>
        </Flex>
      </TouchableArea>
    </>
  )
}
