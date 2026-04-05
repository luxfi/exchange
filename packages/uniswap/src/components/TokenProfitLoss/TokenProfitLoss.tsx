import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { ProfitLossRow } from 'uniswap/src/components/ProfitLoss/ProfitLossRow'

interface TokenProfitLossProps {
  averageCost?: number
  oneDayReturn?: number
  oneDayReturnPercent?: number
  unrealizedReturn?: number
  unrealizedReturnPercent?: number
  realizedReturn?: number
  realizedReturnPercent?: number
  isLoading?: boolean
}

export function TokenProfitLoss({
  averageCost,
  oneDayReturn,
  oneDayReturnPercent,
  unrealizedReturn,
  unrealizedReturnPercent,
  realizedReturn,
  realizedReturnPercent,
  isLoading,
}: TokenProfitLossProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <Flex gap="$gap16" width="100%">
      <Text variant="body3" color="$neutral2">
        {t('pnl.title')}
      </Text>
      <Flex gap="$gap12">
        <ProfitLossRow label={t('pnl.averageCost')} value={averageCost} isLoading={isLoading} />
        <ProfitLossRow
          showArrow
          label={t('pnl.oneDayReturn')}
          value={oneDayReturn}
          percent={oneDayReturnPercent}
          isLoading={isLoading}
        />
        <ProfitLossRow
          showArrow
          label={t('pnl.unrealizedReturn')}
          value={unrealizedReturn}
          percent={unrealizedReturnPercent}
          isLoading={isLoading}
        />
        <ProfitLossRow
          showArrow
          label={t('pnl.realizedReturn')}
          value={realizedReturn}
          percent={realizedReturnPercent}
          isLoading={isLoading}
        />
      </Flex>
    </Flex>
  )
}
