import { type Currency, type CurrencyAmount } from '@uniswap/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { AuctionSupplySelector } from '~/pages/Liquidity/CreateAuction/components/AuctionSupplySelector'
import { PostAuctionLiquiditySelector } from '~/pages/Liquidity/CreateAuction/components/PostAuctionLiquiditySelector'
import { TokenDistributionBar } from '~/pages/Liquidity/CreateAuction/components/TokenDistributionBar'
import { amountToPercent } from '~/pages/Liquidity/CreateAuction/utils'

interface AuctionSupplySectionProps {
  auctionSupplyAmount: CurrencyAmount<Currency>
  tokenTotalSupply: CurrencyAmount<Currency>
  tokenSymbol: string
  raiseTokenSymbol: string
  postAuctionLiquidityAmount: CurrencyAmount<Currency>
  onSelectAuctionSupplyPercent: (percent: number) => void
  onAuctionSupplyAmountChange: (amount: CurrencyAmount<Currency>) => void
  onSelectPostAuctionLiquidityPercent: (percent: number) => void
  color?: string
}

export function AuctionSupplySection({
  auctionSupplyAmount,
  tokenTotalSupply,
  tokenSymbol,
  raiseTokenSymbol,
  postAuctionLiquidityAmount,
  onSelectAuctionSupplyPercent,
  onAuctionSupplyAmountChange,
  onSelectPostAuctionLiquidityPercent,
  color,
}: AuctionSupplySectionProps) {
  const { t } = useTranslation()
  const postAuctionLiquidityPercent = amountToPercent(auctionSupplyAmount, postAuctionLiquidityAmount)

  return (
    <Flex gap="$spacing24">
      <Flex gap="$spacing4">
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.fundraiseAuctionSupply')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.fundraiseAuctionSupply.description')}
        </Text>
      </Flex>
      <AuctionSupplySelector
        auctionSupplyAmount={auctionSupplyAmount}
        tokenTotalSupply={tokenTotalSupply}
        tokenSymbol={tokenSymbol}
        onSelectPercent={onSelectAuctionSupplyPercent}
        onAmountChange={onAuctionSupplyAmountChange}
      />
      <PostAuctionLiquiditySelector
        postAuctionLiquidityPercent={postAuctionLiquidityPercent}
        onSelectPercent={onSelectPostAuctionLiquidityPercent}
      />
      <TokenDistributionBar
        label={t('toucan.createAuction.step.configureAuction.distribution')}
        auctionSupplyAmount={auctionSupplyAmount}
        postAuctionLiquidityAmount={postAuctionLiquidityAmount}
        tokenSymbol={tokenSymbol}
        raiseTokenSymbol={raiseTokenSymbol}
        color={color}
      />
    </Flex>
  )
}
