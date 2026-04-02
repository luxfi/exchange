import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, FlexProps, Text } from '@luxfi/ui/src'
import { useTokenMarketStats } from 'lx/src/features/dataApi/tokenDetails/useTokenDetailsData'
import { useTokenSpotPrice } from 'lx/src/features/dataApi/tokenDetails/useTokenSpotPriceWrapper'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { currencyId } from 'lx/src/utils/currencyId'
import { FiatNumberType, NumberType } from '@luxfi/utilities/src/format/types'
import { TokenQueryData } from '~/appGraphql/data/Token'
import { HEADER_DESCRIPTIONS, TokenSortMethod } from '~/components/Tokens/constants'
import { MouseoverTooltip } from '~/components/Tooltip'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'

const STATS_GAP = '$gap20'

export const StatWrapper = ({
  tableRow = false,
  children,
  ...props
}: { tableRow?: boolean; children: ReactNode } & FlexProps) => (
  <Flex
    tag={tableRow ? 'tr' : 'div'}
    flexBasis="33.33%"
    flexGrow={0}
    flexShrink={0}
    pr="$spacing12"
    $sm={{ flexBasis: '50%' }}
    {...props}
  >
    {children}
  </Flex>
)

export const StatsWrapper = ({ children, ...props }: { children: ReactNode } & FlexProps) => (
  <Flex animation="200ms" animateEnter="fadeIn" gap={STATS_GAP} {...props}>
    {children}
  </Flex>
)

const TokenStatsSection = ({ children }: { children: ReactNode }) => (
  <Flex row flexWrap="wrap" rowGap="$spacing24" tag="table">
    {children}
  </Flex>
)

type NumericStat = number | undefined | null

function Stat({
  testID,
  value,
  title,
  description,
  numberType = NumberType.FiatTokenStats,
}: {
  testID: string
  value: NumericStat
  title: ReactNode
  description?: ReactNode
  numberType?: FiatNumberType
}) {
  const { convertFiatAmountFormatted } = useLocalizationContext()

  return (
    <StatWrapper tableRow data-cy={`${testID}`} data-testid={`${testID}`}>
      <Text variant="body3" color="$neutral2" tag="td">
        <MouseoverTooltip disabled={!description} text={description}>
          {title}
        </MouseoverTooltip>
      </Text>
      <Text
        tag="td"
        mt="$spacing8"
        fontSize={28}
        color="$neutral1"
        fontWeight="$book"
        $platform-web={{
          overflowWrap: 'break-word',
        }}
      >
        {convertFiatAmountFormatted(value, numberType)}
      </Text>
    </StatWrapper>
  )
}

type StatsSectionProps = {
  tokenQueryData: TokenQueryData
}
export function StatsSection({ tokenQueryData }: StatsSectionProps) {
  const { t } = useTranslation()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const currency = useTDPStore((s) => s.currency)!

  // Construct currencyId for shared hooks
  const currencyIdValue = useMemo(() => currencyId(currency), [currency])

  // Live price from centralized provider (feature-flag aware via TokenPriceContext)
  const spotPrice = useTokenSpotPrice(currencyIdValue)

  // When multichain token UX is on, TokenWebQuery returns aggregated market/project data — pass it so the hook uses it for stats.
  const aggregatedInput = useMemo(
    () =>
      isMultichainTokenUx && tokenQueryData
        ? { market: tokenQueryData.market, project: tokenQueryData.project }
        : undefined,
    [isMultichainTokenUx, tokenQueryData],
  )
  const stats = useTokenMarketStats(currencyIdValue, {
    currentPriceOverride: spotPrice,
    aggregatedData: aggregatedInput,
  })

  // Prefer TDP query's 24h volume when available; otherwise use hook (fragment or aggregated)
  const volume = tokenQueryData?.market?.volume24H?.value ?? stats.volume
  const tvl = tokenQueryData?.market?.totalValueLocked?.value
  const { marketCap, fdv, high52w, low52w } = stats

  const hasStats = tvl || fdv || marketCap || volume || high52w || low52w

  if (hasStats) {
    return (
      <StatsWrapper data-testid={TestID.TokenDetailsStats}>
        <Text variant="heading3">{t('common.stats')}</Text>
        <TokenStatsSection>
          <Stat
            testID={TestID.TokenDetailsStatsTvl}
            value={tvl}
            description={t('stats.tvl.description')}
            title={t('common.totalValueLocked')}
          />
          <Stat
            testID={TestID.TokenDetailsStatsMarketCap}
            value={marketCap}
            description={t('stats.marketCap.description')}
            title={t('stats.marketCap')}
          />
          <Stat
            testID={TestID.TokenDetailsStatsFdv}
            value={fdv}
            description={HEADER_DESCRIPTIONS[TokenSortMethod.FULLY_DILUTED_VALUATION]}
            title={t('stats.fdv')}
          />
          <Stat
            testID={TestID.TokenDetailsStatsVolume24h}
            value={volume}
            description={t('stats.volume.1d.description')}
            title={t('stats.volume.1d')}
          />
          <Stat
            testID={TestID.TokenDetailsStats52wHigh}
            value={high52w}
            title={t('token.stats.priceHighYear')}
            numberType={NumberType.FiatTokenDetails}
          />
          <Stat
            testID={TestID.TokenDetailsStats52wLow}
            value={low52w}
            title={t('token.stats.priceLowYear')}
            numberType={NumberType.FiatTokenDetails}
          />
        </TokenStatsSection>
      </StatsWrapper>
    )
  } else {
    return (
      <Text color="$neutral3" pt="$spacing40" data-cy="token-details-no-stats-data">
        {t('stats.noStatsAvailable')}
      </Text>
    )
  }
}
