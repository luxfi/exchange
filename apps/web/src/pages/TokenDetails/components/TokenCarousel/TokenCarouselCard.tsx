<<<<<<< HEAD
import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { fromGraphQLChain } from '@l.x/lx/src/features/chains/utils'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'
import { NumberType } from '@l.x/utils/src/format/types'
=======
import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { Flex, Text, TouchableArea } from 'ui/src'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { fromGraphQLChain } from 'uniswap/src/features/chains/utils'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { NumberType } from 'utilities/src/format/types'
>>>>>>> upstream/main
import { SparklineMap } from '~/appGraphql/data/types'
import SparklineChart from '~/components/Charts/SparklineChart'
import { DeltaArrow } from '~/components/DeltaArrow/DeltaArrow'
import { useNavigateToTokenDetails } from '~/pages/Portfolio/Tokens/hooks/useNavigateToTokenDetails'
<<<<<<< HEAD
import { TokenStat } from '~/state/explore/types'
=======
import { multichainTokenToDisplayToken } from '~/state/explore/listTokens/utils/multichainTokenToDisplayToken'
import type { TokenStat } from '~/state/explore/types'
>>>>>>> upstream/main

export const TOKEN_CARD_WIDTH = 168

export const CARD_SPACING = 12

<<<<<<< HEAD
export function TokenCarouselCard({ token, sparklines }: { token: TokenStat; sparklines: SparklineMap }) {
  const { formatPercent, convertFiatAmountFormatted } = useLocalizationContext()
  const navigateToTokenDetails = useNavigateToTokenDetails()

  const currencyInfo = useCurrencyInfo(
    buildCurrencyId(fromGraphQLChain(token.chain) ?? UniverseChainId.Mainnet, token.address),
  )

  const delta1d = token.pricePercentChange1Day?.value
=======
export function TokenCarouselCard({ token, sparklines }: { token: MultichainToken; sparklines: SparklineMap }) {
  const displayToken = multichainTokenToDisplayToken(token)
  if (!displayToken) {
    return null
  }
  return <TokenCarouselCardContent displayToken={displayToken} sparklines={sparklines} />
}

interface TokenCarouselCardContentProps {
  displayToken: TokenStat
  sparklines: SparklineMap
}

function TokenCarouselCardContent({ displayToken, sparklines }: TokenCarouselCardContentProps) {
  const { formatPercent, convertFiatAmountFormatted } = useLocalizationContext()
  const navigateToTokenDetails = useNavigateToTokenDetails()
  const currencyInfo = useCurrencyInfo(
    buildCurrencyId(fromGraphQLChain(displayToken.chain) ?? UniverseChainId.Mainnet, displayToken.address),
  )
  const delta1d = displayToken.pricePercentChange1Day?.value
>>>>>>> upstream/main

  return (
    <TouchableArea
      width={TOKEN_CARD_WIDTH}
      gap="$gap12"
      borderRadius="$rounded20"
      borderWidth="$spacing1"
      borderColor="$surface3"
      px={CARD_SPACING}
      py="$spacing16"
      onPress={() => {
        navigateToTokenDetails(currencyInfo?.currency)
      }}
    >
      <Flex row>
        <CurrencyLogo currencyInfo={currencyInfo} size={32} />
        <SparklineChart
          width={64}
          height={32}
<<<<<<< HEAD
          tokenData={token}
          pricePercentChange={token.pricePercentChange1Day?.value}
=======
          tokenData={displayToken}
          pricePercentChange={displayToken.pricePercentChange1Day?.value}
>>>>>>> upstream/main
          sparklineMap={sparklines}
        />
      </Flex>
      <Text numberOfLines={1} variant="body2">
<<<<<<< HEAD
        {token.name}
=======
        {displayToken.name}
>>>>>>> upstream/main
      </Text>
      <Flex gap="$gap4">
        <Flex row gap="$gap4" alignItems="center">
          <Text variant="body3" color="$neutral2">
<<<<<<< HEAD
            {convertFiatAmountFormatted(token.price?.value, NumberType.FiatTokenPrice)}
=======
            {convertFiatAmountFormatted(displayToken.price?.value, NumberType.FiatTokenPrice)}
>>>>>>> upstream/main
          </Text>
        </Flex>
        <Flex row gap="$gap4" alignItems="center">
          <DeltaArrow delta={delta1d} formattedDelta={formatPercent(delta1d)} />
          <Text variant="body3" color="$neutral2">
            {formatPercent(Math.abs(delta1d ?? 0))}
          </Text>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
