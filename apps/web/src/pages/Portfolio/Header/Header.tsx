import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useNavigate } from 'react-router'
import { Flex, useMedia } from 'ui/src'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { ElementName, InterfacePageName, UniswapEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { useEvent } from 'utilities/src/react/hooks'
import { NetworkFilter } from '~/components/NetworkFilter/NetworkFilter'
import { useActiveAddresses } from '~/features/accounts/store/hooks'
import { useAppHeaderHeight } from '~/hooks/useAppHeaderHeight'
import { useScrollCompact } from '~/hooks/useScrollCompact'
import { usePortfolioRoutes } from '~/pages/Portfolio/Header/hooks/usePortfolioRoutes'
import { PortfolioAddressDisplay } from '~/pages/Portfolio/Header/PortfolioAddressDisplay/PortfolioAddressDisplay'
  const isPnLEnabled = useFeatureFlag(FeatureFlags.ProfitLoss)
  const isCompact = useScrollCompact({ scrollY })
  const headerHeight = useAppHeaderHeight()
  const buttonSize = media.md || isCompact ? 'small' : 'medium'

  const hasConnectedAddresses = Boolean(activeAddresses.evmAddress || activeAddresses.svmAddress)
  const showShareButton = !showDemoView && (isExternalWallet || hasConnectedAddresses)

  const onNetworkPress = useEvent((chainId: UniverseChainId | undefined) => {
    const currentPageName = getPageNameFromTab(tab)
    const selectedChain = chainId ?? ('All' as const)

    sendAnalyticsEvent(UniswapEventName.NetworkFilterSelected, {
      element: ElementName.PortfolioNetworkFilter,
      page: currentPageName,
      chain: selectedChain,
    })

    navigate(buildPortfolioUrl({ tab, chainId, externalAddress: externalAddress?.address }))
  })

  return (
    <Flex
      data-testid={TestID.PortfolioHeader}
      backgroundColor="$surface1"
      marginTop="$spacing8"
      paddingTop="$spacing16"
      zIndex="$header"
      $platform-web={{
        position: 'sticky',
        top: headerHeight,
      }}
      gap={isCompact ? '$gap12' : '$spacing40'}
      transition="gap 200ms ease"
    >
      <Flex gap="$spacing16">
        <Flex row gap="$spacing12" justifyContent="space-between" alignItems="center">
          <PortfolioAddressDisplay isCompact={isCompact} />

          <Flex row gap="$spacing8" alignItems="center">
            {!showDemoView && isPnLEnabled && <PortfolioMoreMenu size={buttonSize} transition={HEADER_TRANSITION} />}
            {showShareButton && (
              <SharePortfolioButton size={buttonSize} showLabel={!media.sm} transition={HEADER_TRANSITION} />
            )}
            <NetworkFilter
              showMultichainOption
              showDisplayName={!media.sm}
              position="right"
              onPress={onNetworkPress}
              currentChainId={currentChainId}
              size={buttonSize}
              transition={HEADER_TRANSITION}
            />
          </Flex>
        </Flex>
      </Flex>

      <PortfolioTabs />
    </Flex>
  )
}
