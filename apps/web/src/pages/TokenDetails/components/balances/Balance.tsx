import { Currency } from '@uniswap/sdk-core'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { getChainLabel } from 'uniswap/src/features/chains/utils'
import { PortfolioBalance } from 'uniswap/src/features/dataApi/types'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { ChainLogo } from '~/components/Logo/ChainLogo'
import { MouseoverTooltip, TooltipSize } from '~/components/Tooltip'

export function Balance({
  currency,
  chainId = UniverseChainId.Mainnet,
  fetchedBalance,
  onClick,
  showChainLogoOnly = false,
  isAggregate = false,
  isMultichainBalance = false,
}: {
  currency?: Currency
  chainId?: UniverseChainId
  fetchedBalance?: PortfolioBalance
  onClick?: () => void
  showChainLogoOnly?: boolean
  isAggregate?: boolean
  isMultichainBalance?: boolean
}): JSX.Element {
  const { t } = useTranslation()
  const isMultichainUxEnabled = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const { convertFiatAmountFormatted, formatNumberOrString } = useLocalizationContext()

  const formattedBalance = formatNumberOrString({
    value: fetchedBalance?.quantity,
    type: NumberType.TokenNonTx,
  })
  const formattedUsdValue = convertFiatAmountFormatted(fetchedBalance?.balanceUSD, NumberType.PortfolioBalance)
  const tokenSymbol = currency?.symbol
  const tokenName = currency?.name

  if (isAggregate) {
    return (
      <Flex row alignItems="center">
        <CurrencyLogo
          currencyInfo={fetchedBalance?.currencyInfo}
          size={iconSizes.icon32}
          hideNetworkLogo={isMultichainUxEnabled && isMultichainBalance}
        />
        <Flex shrink row width="100%" justifyContent="space-between" alignItems="center" ml="$spacing12">
          <Flex>
            <Text variant="body2" color="$neutral1">
              {tokenName}
            </Text>
            {isMultichainUxEnabled && (
              <Text variant="body3" color="$neutral2">
                {t('transaction.network.all')}
              </Text>
            )}
          </Flex>
          <Flex alignItems="flex-end">
            <Text variant="body2" color="$neutral1">
              {formattedUsdValue}
            </Text>
            <Text variant="body3" color="$neutral2">
              {formattedBalance} {tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    )
  }

  const chainName = getChainLabel(chainId)

  return (
    <TouchableArea disabled={!onClick} onPress={onClick} opacity={1}>
      <Flex my="$spacing8" row alignItems="center">
        {showChainLogoOnly ? (
          <MouseoverTooltip
            placement="left"
            size={TooltipSize.Max}
            text={<Text variant="body3">{chainName}</Text>}
            offsetX={0}
          >
            <ChainLogo chainId={chainId} size={24} borderRadius={6} />
          </MouseoverTooltip>
        ) : (
          <CurrencyLogo
            currencyInfo={fetchedBalance?.currencyInfo}
            size={iconSizes.icon32}
            hideNetworkLogo={isMultichainUxEnabled && isMultichainBalance}
          />
        )}
        <Flex shrink row width="100%" justifyContent="space-between" alignItems="center" ml="$spacing12">
          <Flex>
            <Text variant="subheading2" color="$neutral1">
              {formattedUsdValue}
            </Text>
          </Flex>
          <Flex>
            <Text variant="body3" color="$neutral2">
              {formattedBalance} {tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
