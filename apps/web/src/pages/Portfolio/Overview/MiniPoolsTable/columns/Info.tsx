import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@luxfi/ui/src'
import { iconSizes } from '@luxfi/ui/src/theme/iconSizes'
import { SplitLogo } from '@l.x/lx/src/components/CurrencyLogo/SplitLogo'
import { V2_DEFAULT_FEE_TIER } from '@l.x/lx/src/constants/pools'
import { useCurrencyInfos } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { currencyId } from '@l.x/lx/src/utils/currencyId'
import { PositionInfo } from '~/components/Liquidity/types'
import { BIPS_BASE } from '~/constants/misc'

// Helper function to get fee label from position
function getFeeLabel(position: PositionInfo, t: ReturnType<typeof useTranslation>['t']): string {
  if (position.version === ProtocolVersion.V2) {
    return `${V2_DEFAULT_FEE_TIER / BIPS_BASE}%`
  }
  const feeTier = 'feeTier' in position ? position.feeTier : undefined
  if (feeTier) {
    if (feeTier.isDynamic) {
      return t('common.dynamic')
    }
    return `${feeTier.feeAmount / BIPS_BASE}%`
  }
  return `${V2_DEFAULT_FEE_TIER / BIPS_BASE}%`
}

// First column cell component - Pool info with SplitLogo, symbols, percent and version
export const PoolInfoCell = memo(function PoolInfoCell({ position }: { position: PositionInfo }) {
  const { t } = useTranslation()
  const [currency0Info, currency1Info] = useCurrencyInfos([
    currencyId(position.currency0Amount.currency),
    currencyId(position.currency1Amount.currency),
  ])

  if (!currency0Info || !currency1Info) {
    return null
  }

  const getVersionText = () => {
    return ProtocolVersion[position.version].toLowerCase()
  }

  return (
    <Flex row alignItems="center" gap="$gap8">
      <SplitLogo
        inputCurrencyInfo={currency0Info}
        outputCurrencyInfo={currency1Info}
        size={iconSizes.icon32}
        chainId={position.chainId}
      />
      <Flex>
        <Text variant="body3" color="$neutral1">
          {currency0Info.currency.symbol} / {currency1Info.currency.symbol}
        </Text>
        <Text variant="body4" color="$neutral2">
          {getFeeLabel(position, t)} • {getVersionText()}
        </Text>
      </Flex>
    </Flex>
  )
})
PoolInfoCell.displayName = 'PoolInfoCell'
