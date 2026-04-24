import { memo } from 'react'
import { Flex, Text, Tooltip, TouchableArea } from '@l.x/ui/src'
import { iconSizes, zIndexes } from '@l.x/ui/src/theme'
import { TokenLogo } from '@l.x/lx/src/components/CurrencyLogo/TokenLogo'
import { TokenOption } from '@l.x/lx/src/components/lists/items/types'
import { OnchainItemSection, OnchainItemSectionName } from '@l.x/lx/src/components/lists/OnchainItemList/types'
import { OnSelectCurrency } from '@l.x/lx/src/components/TokenSelector/types'
import { getChainLabel } from '@l.x/lx/src/features/chains/utils'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'

function _TokenCard({
  onSelectCurrency,
  token,
  index,
  section,
}: {
  onSelectCurrency: OnSelectCurrency
  token: TokenOption
  index: number
  section: OnchainItemSection<TokenOption[]>
}): JSX.Element {
  const { currency, logoUrl } = token.currencyInfo

  const onPress = (): void => {
    onSelectCurrency(token.currencyInfo, section, index)
  }

  const tokenLabel = getSymbolDisplayText(currency.symbol)
  const isBridgingToken = section.sectionKey === OnchainItemSectionName.BridgingTokens
  const chainLabel = getChainLabel(currency.chainId)

  const tokenCard = (
    <TouchableArea
      hoverable
      borderRadius="$roundedFull"
      testID={`token-option-${currency.chainId}-${currency.symbol}`}
      onPress={onPress}
    >
      <Flex
        centered
        backgroundColor="$surface2"
        hoverStyle={{ backgroundColor: '$surface1Hovered' }}
        borderRadius="$rounded16"
        px="$spacing16"
        py="$spacing12"
        gap="$gap4"
      >
        <TokenLogo
          chainId={currency.chainId}
          name={currency.name}
          size={iconSizes.icon24}
          symbol={currency.symbol}
          url={logoUrl}
        />
        <Text color="$neutral1" variant="buttonLabel3">
          {tokenLabel}
        </Text>
      </Flex>
    </TouchableArea>
  )

  // for bridgeable assets, show a tooltip with the chain name
  if (isBridgingToken) {
    return (
      <Tooltip placement="bottom" offset={{ mainAxis: 4 }} delay={{ close: 0, open: 750 }}>
        <Tooltip.Trigger>{tokenCard}</Tooltip.Trigger>
        <Tooltip.Content zIndex={zIndexes.overlay}>
          <Text variant="body3" color="$neutral1">
            {chainLabel}
          </Text>
        </Tooltip.Content>
      </Tooltip>
    )
  }

  return tokenCard
}

export const TokenCard = memo(_TokenCard)
