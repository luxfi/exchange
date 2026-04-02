import { useTranslation } from 'react-i18next'
import { Flex, FlexProps, Text } from '@luxfi/ui/src'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'
import LPIncentiveFeeStatTooltip from '~/components/Liquidity/LPIncentives/LPIncentiveFeeStatTooltip'
import { LP_INCENTIVES_CHAIN_ID, LP_INCENTIVES_REWARD_TOKEN } from '~/components/LpIncentives/constants'
import { MouseoverTooltip, TooltipSize } from '~/components/Tooltip'
import { ClickableGuiStyle } from '~/theme/components/styles'

interface LpIncentiveAprTooltipProps {
  currency0Info?: Maybe<CurrencyInfo>
  currency1Info?: Maybe<CurrencyInfo>
  poolApr?: number
  totalApr?: number
}

interface LpIncentiveAprDisplayProps extends FlexProps {
  lpIncentiveRewardApr: number
  isSmall?: boolean
  hideBackground?: boolean
  showTokenSymbol?: boolean
  tooltipProps?: LpIncentiveAprTooltipProps
}

export function LpIncentivesAprDisplay({
  lpIncentiveRewardApr,
  isSmall,
  hideBackground,
  showTokenSymbol,
  tooltipProps,
  ...rest
}: LpIncentiveAprDisplayProps): JSX.Element | null {
  const { t } = useTranslation()
  const { formatPercent } = useLocalizationContext()

  const rewardCurrencyInfo = useCurrencyInfo(
    buildCurrencyId(LP_INCENTIVES_CHAIN_ID, LP_INCENTIVES_REWARD_TOKEN.address),
  )

  const content = (
    <Flex
      row
      backgroundColor={hideBackground ? undefined : '$accent2'}
      px={hideBackground ? undefined : '$spacing6'}
      borderRadius={hideBackground ? undefined : '$rounded6'}
      gap="$spacing6"
      alignItems="center"
      width="fit-content"
      {...(tooltipProps ? ClickableGuiStyle : {})}
      {...rest}
    >
      <CurrencyLogo currencyInfo={rewardCurrencyInfo} size={isSmall ? 12 : 16} />
      <Text variant={isSmall ? 'body4' : 'body3'} color="$accent1">
        {showTokenSymbol
          ? `${formatPercent(lpIncentiveRewardApr)} ${LP_INCENTIVES_REWARD_TOKEN.symbol}`
          : t('pool.rewardAPR.percent', { pct: formatPercent(lpIncentiveRewardApr) })}
      </Text>
    </Flex>
  )

  if (tooltipProps) {
    return (
      <MouseoverTooltip
        padding={0}
        text={
          <LPIncentiveFeeStatTooltip
            currency0Info={tooltipProps.currency0Info}
            currency1Info={tooltipProps.currency1Info}
            chainId={LP_INCENTIVES_CHAIN_ID}
            poolApr={tooltipProps.poolApr}
            lpIncentiveRewardApr={lpIncentiveRewardApr}
            totalApr={tooltipProps.totalApr}
          />
        }
        size={TooltipSize.Small}
        placement="top"
      >
        {content}
      </MouseoverTooltip>
    )
  }

  return content
}
