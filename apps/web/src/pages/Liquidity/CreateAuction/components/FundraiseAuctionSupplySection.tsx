import { type Currency, type CurrencyAmount } from '@luxamm/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@luxfi/ui/src'
import { AuctionSupplyCard } from '~/pages/Liquidity/CreateAuction/components/AuctionSupplyCard'
import { PostAuctionLiquidityCard } from '~/pages/Liquidity/CreateAuction/components/PostAuctionLiquidityCard'
import { TotalRequiredDepositCard } from '~/pages/Liquidity/CreateAuction/components/TotalRequiredDepositCard'

interface FundraiseAuctionSupplySectionProps {
  auctionSupplyPercent: number
  auctionSupplyAmount: CurrencyAmount<Currency>
  tokenTotalSupply: CurrencyAmount<Currency>
  tokenSymbol: string
  /** LP amount as % of *auction* supply (not total supply), e.g. 50 means LP = 50% of auction tokens */
  postAuctionLiquidityPercent: number
  postAuctionLiquidityAmount: CurrencyAmount<Currency>
  onSelectAuctionSupplyPercent: (percent: number) => void
  onSelectPostAuctionLiquidityPercent: (percent: number) => void
}

export function FundraiseAuctionSupplySection({
  auctionSupplyPercent,
  auctionSupplyAmount,
  tokenTotalSupply,
  tokenSymbol,
  postAuctionLiquidityPercent,
  postAuctionLiquidityAmount,
  onSelectAuctionSupplyPercent,
  onSelectPostAuctionLiquidityPercent,
}: FundraiseAuctionSupplySectionProps) {
  const { t } = useTranslation()

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
      <Flex row gap="$spacing8">
        <AuctionSupplyCard
          auctionSupplyPercent={auctionSupplyPercent}
          postAuctionLiquidityPercent={postAuctionLiquidityPercent}
          tokenTotalSupply={tokenTotalSupply}
          onSelectPercent={onSelectAuctionSupplyPercent}
        />
        <PostAuctionLiquidityCard
          postAuctionLiquidityPercent={postAuctionLiquidityPercent}
          onSelectPercent={onSelectPostAuctionLiquidityPercent}
        />
      </Flex>
      <TotalRequiredDepositCard
        auctionSupplyAmount={auctionSupplyAmount}
        postAuctionLiquidityAmount={postAuctionLiquidityAmount}
        tokenTotalSupply={tokenTotalSupply}
        tokenSymbol={tokenSymbol}
      />
    </Flex>
  )
}
