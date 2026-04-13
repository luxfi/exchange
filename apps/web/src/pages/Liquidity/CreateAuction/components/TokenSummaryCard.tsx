import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Separator, Text } from 'ui/src'
import { Edit } from 'ui/src/components/icons/Edit'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { useCreateAuctionStore } from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { TokenMode } from '~/pages/Liquidity/CreateAuction/types'

const TOKEN_LOGO_SIZE = 60

interface AuctionSummary {
  auctionSupplyText: string
  launchText: string
  onEdit: () => void
}

interface TokenSummaryCardProps {
  name: string
  symbol: string
  logoNode: ReactNode
  onEdit: () => void
  auctionSummary?: AuctionSummary
}

export function useTokenSummaryCardProps(): Omit<TokenSummaryCardProps, 'onEdit' | 'auctionSummary'> {
  const tokenForm = useCreateAuctionStore((state) => state.tokenForm)

  const name =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.name
      : (tokenForm.existingTokenCurrencyInfo?.currency.name ?? '')

  const symbol =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.symbol
      : (tokenForm.existingTokenCurrencyInfo?.currency.symbol ?? '')

  const logoNode =
    tokenForm.mode === TokenMode.CREATE_NEW ? (
      <TokenLogo
        url={tokenForm.imageUrl || null}
        symbol={tokenForm.symbol}
        name={tokenForm.name}
        chainId={tokenForm.network}
        size={TOKEN_LOGO_SIZE}
      />
    ) : (
      <CurrencyLogo currencyInfo={tokenForm.existingTokenCurrencyInfo ?? null} size={TOKEN_LOGO_SIZE} />
    )

  return { name, symbol, logoNode }
}

export function TokenSummaryCard({ name, symbol, logoNode, onEdit, auctionSummary }: TokenSummaryCardProps) {
  const { t } = useTranslation()
  return (
    <Flex
      backgroundColor="$surface1"
      borderWidth="$spacing1"
      borderColor="$surface3"
      borderRadius="$rounded20"
      px="$spacing24"
      py="$spacing16"
      gap="$spacing16"
    >
      <Flex row alignItems="center" py="$spacing8" gap="$spacing16">
        <Flex flexShrink={0}>{logoNode}</Flex>
        <Flex flex={1} gap="$spacing2">
          <Text variant="heading3" color="$neutral1">
            {name}
          </Text>
          <Text variant="body2" color="$neutral2">
            {symbol}
          </Text>
        </Flex>
        <Button fill={false} emphasis="secondary" size="small" icon={<Edit />} onPress={onEdit}>
          {t('common.button.edit')}
        </Button>
      </Flex>

      {auctionSummary && (
        <>
          <Separator />
          <Flex row alignItems="center" py="$spacing8" gap="$spacing16">
            <Flex flex={1}>
              <Text variant="body2" color="$neutral1">
                {auctionSummary.auctionSupplyText}
              </Text>
              <Text variant="body2" color="$neutral2">
                {auctionSummary.launchText}
              </Text>
            </Flex>
            <Button fill={false} emphasis="secondary" size="small" icon={<Edit />} onPress={auctionSummary.onEdit}>
              {t('common.button.edit')}
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  )
}
