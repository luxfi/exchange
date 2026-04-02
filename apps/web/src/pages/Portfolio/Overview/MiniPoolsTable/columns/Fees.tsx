import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { memo } from 'react'
import { EM_DASH, Text } from '@luxfi/ui/src'
import { PollingInterval } from '@luxexchange/lx/src/constants/misc'
import { useLocalizationContext } from '@luxexchange/lx/src/features/language/LocalizationContext'
import { useUSDCValue } from '@luxexchange/lx/src/features/transactions/hooks/useUSDCPriceWrapper'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { PositionInfo } from '~/components/Liquidity/types'
import { useLpIncentivesFormattedEarnings } from '~/hooks/useLpIncentivesFormattedEarnings'
import { EmptyTableCell } from '~/pages/Portfolio/EmptyTableCell'

// Third column cell component - Fees in USD
export const PoolFeesCell = memo(function PoolFeesCell({ position }: { position: PositionInfo }) {
  const { convertFiatAmountFormatted } = useLocalizationContext()
  const fiatFeeValue0 = useUSDCValue(position.fee0Amount, PollingInterval.Slow)
  const fiatFeeValue1 = useUSDCValue(position.fee1Amount, PollingInterval.Slow)

  const { totalFeesFiatValue } = useLpIncentivesFormattedEarnings({
    liquidityPosition: position,
    fiatFeeValue0,
    fiatFeeValue1,
  })

  // For V2 positions, fees may not be available
  const isV2AndUnavailable = position.version === ProtocolVersion.V2 && !totalFeesFiatValue

  if (isV2AndUnavailable) {
    return (
      <Text variant="body2" color="$neutral2">
        {EM_DASH}
      </Text>
    )
  }

  if (!totalFeesFiatValue) {
    return <EmptyTableCell />
  }

  return (
    <Text variant="body3" color="$neutral1">
      {convertFiatAmountFormatted(totalFeesFiatValue.toExact(), NumberType.FiatRewards)}
    </Text>
  )
})
PoolFeesCell.displayName = 'PoolFeesCell'
