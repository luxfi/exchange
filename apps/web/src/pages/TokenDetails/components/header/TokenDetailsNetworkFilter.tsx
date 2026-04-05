import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { NetworkLogo } from 'uniswap/src/components/CurrencyLogo/NetworkLogo'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import type { UniverseChainId } from 'uniswap/src/features/chains/types'
import { HEADER_TRANSITION } from '~/components/Explore/stickyHeader/constants'
import { NetworkFilter } from '~/components/NetworkFilter/NetworkFilter'

interface TokenDetailsNetworkFilterProps {
  chainIds: UniverseChainId[]
  selectedChainId: UniverseChainId | undefined
  setSelectedChainId: (chainId: UniverseChainId | undefined) => void
  showAddressCopy: boolean
}

export function TokenDetailsNetworkFilter({
  chainIds,
  showAddressCopy,
  selectedChainId,
  setSelectedChainId,
}: TokenDetailsNetworkFilterProps) {
  const { t } = useTranslation()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  if (!isMultichainTokenUx || chainIds.length <= 1) {
    return null
  }

  return (
    <Flex row alignItems="stretch">
      <Flex alignSelf="center">
        <NetworkFilter
          networks={chainIds}
          currentChainId={selectedChainId}
          size="xsmall"
          transition={HEADER_TRANSITION}
          isTriggerStyled={false}
          customTrigger={
            <Flex row alignItems="center" gap="$spacing6">
              <NetworkLogo chainId={selectedChainId ?? null} size={iconSizes.icon16} transition={HEADER_TRANSITION} />
              <Text variant="buttonLabel3" color="$neutral2" transition={HEADER_TRANSITION}>
                {selectedChainId ? getChainInfo(selectedChainId).label : t('transaction.network.all')}
              </Text>
            </Flex>
          }
          onPress={setSelectedChainId}
        />
      </Flex>
      {showAddressCopy && <Flex width={1} backgroundColor="$surface3" mx="$spacing12" />}
    </Flex>
  )
}
