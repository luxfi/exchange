import { memo } from 'react'
import { Flex, Text } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { getCurrencyAmount, ValueType } from '@l.x/lx/src/features/tokens/getCurrencyAmount'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { GroupedGasFee } from '@luxfi/wallet/src/features/smartWallet/utils/gasFeeUtils'

interface NetworkFeeDisplayProps {
  symbol: string
  groupedFee: GroupedGasFee
}

export const NetworkFeeDisplay = memo(({ symbol, groupedFee }: NetworkFeeDisplayProps): JSX.Element => {
  const { formatCurrencyAmount } = useLocalizationContext()
  const { totalFeeAmountInWei, chainIds, currency } = groupedFee

  const displayChainId = chainIds.length === 1 ? (chainIds[0] as UniverseChainId) : null

  const currencyAmount = chainIds[0]
    ? getCurrencyAmount({
        value: totalFeeAmountInWei,
        valueType: ValueType.Raw,
        currency,
      })
    : null

  return (
    <Flex row justifyContent="flex-end" gap="$spacing4" alignItems="center">
      <NetworkLogo chainId={displayChainId} size={iconSizes.icon16} />
      <Text color="$neutral1" variant="body3">
        {`${formatCurrencyAmount({
          value: currencyAmount,
          type: NumberType.TokenNonTx,
        })} ${symbol}`}
      </Text>
    </Flex>
  )
})

NetworkFeeDisplay.displayName = 'NetworkFeeDisplay'
