import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { ActionSheetDropdown } from 'uniswap/src/components/dropdowns/ActionSheetDropdown'
import { MenuItemProp } from 'uniswap/src/components/modals/ActionSheetModal'
import {
  getProfitLossPeriodLabel,
  getProfitLossSince,
  PROFIT_LOSS_PERIODS,
  ProfitLossPeriod,
} from 'uniswap/src/components/WalletProfitLoss/utils'
import { WalletProfitLoss } from 'uniswap/src/components/WalletProfitLoss/WalletProfitLoss'
import { useGetWalletProfitLossQuery } from 'uniswap/src/data/rest/getWalletProfitLoss'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'

interface PortfolioPerformanceProps {
  evmAddress: string
  chainIds: number[]
  onReport?: () => void
}

export const PortfolioPerformance = memo(function PortfolioPerformance({
  evmAddress,
  chainIds,
  onReport,
}: PortfolioPerformanceProps): JSX.Element | null {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState<ProfitLossPeriod>(ProfitLossPeriod.ALL)

  const since = useMemo(() => getProfitLossSince(selectedPeriod), [selectedPeriod])

  const { data, isPending, isError } = useGetWalletProfitLossQuery({
    input: {
      evmAddress,
      chainIds,
      since,
    },
  })

  const profitLoss = isError ? undefined : data?.profitLoss

  const options = useMemo<MenuItemProp[]>(
    () =>
      PROFIT_LOSS_PERIODS.map((period: ProfitLossPeriod) => ({
        key: period,
        onPress: () => setSelectedPeriod(period),
        render: () => (
          <Flex row alignItems="center" py="$spacing8" px="$spacing4">
            <Text variant="body2" color={period === selectedPeriod ? '$accent1' : '$neutral1'}>
              {getProfitLossPeriodLabel(period, t)}
            </Text>
          </Flex>
        ),
      })),
    [selectedPeriod, t],
  )

  const periodSelector = useMemo(
    () => (
      <ActionSheetDropdown options={options} styles={{ alignment: 'right', buttonPaddingY: 0 }}>
        <Flex
          row
          centered
          gap="$spacing4"
          borderRadius="$roundedFull"
          borderWidth="$spacing1"
          borderColor="$surface3"
          pl="$spacing12"
          pr="$spacing8"
          py="$spacing6"
        >
          <Text variant="buttonLabel4" color="$neutral1">
            {getProfitLossPeriodLabel(selectedPeriod, t)}
          </Text>
          <RotatableChevron color="$neutral2" direction="down" size="$icon.16" />
        </Flex>
      </ActionSheetDropdown>
    ),
    [options, selectedPeriod, t],
  )

  // Hide on error or when initial load returns no data.
  // Don't hide during refetch (period change) — show loading state instead.
  if (isError || (!profitLoss && !isPending)) {
    return null
  }

  return (
    <Flex testID={TestID.PortfolioPerformance} pb="$spacing16">
      <WalletProfitLoss
        unrealizedReturn={profitLoss?.unrealizedReturnUsd}
        unrealizedReturnPercent={profitLoss?.unrealizedReturnPercent}
        realizedReturn={profitLoss?.realizedReturnUsd}
        totalReturn={profitLoss?.totalReturnUsd}
        isLoading={isPending || !profitLoss}
        periodSelector={periodSelector}
      />
      {onReport && (
        <TouchableArea mt="$spacing16" onPress={onReport}>
          <Text variant="buttonLabel4">{t('reporting.portfolio.report.link')}</Text>
        </TouchableArea>
      )}
    </Flex>
  )
})
