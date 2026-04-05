<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { Fragment } from 'react'
import { Flex, Separator } from '@l.x/ui/src'
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { isMobileWeb } from '@l.x/utils/src/platform'
import { MenuStateVariant, useSetMenuCallback } from '~/components/AccountDrawer/menuState'
import { NoSolanaWalletConnectedView } from '~/components/WalletModal/NoSolanaWalletConnectedView'
import { LXMobileWalletConnectorOption } from '~/components/WalletModal/LXMobileWalletConnectorOption'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { Fragment } from 'react'
import { Flex, Separator } from 'ui/src'
import { CONNECTION_PROVIDER_IDS } from 'uniswap/src/constants/web3'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { isMobileWeb } from 'utilities/src/platform'
import { MenuStateVariant, useSetMenuCallback } from '~/components/AccountDrawer/menuState'
import { NoSolanaWalletConnectedView } from '~/components/WalletModal/NoSolanaWalletConnectedView'
import { UniswapMobileWalletConnectorOption } from '~/components/WalletModal/UniswapMobileWalletConnectorOption'
>>>>>>> upstream/main
import { OtherWalletsOption, WalletConnectorOption } from '~/components/WalletModal/WalletConnectorOption'
import { useRecentConnectorId } from '~/components/Web3Provider/constants'
import { useOrderedWallets } from '~/features/wallet/connection/hooks/useOrderedWalletConnectors'
import { transitions } from '~/theme/styles'

interface WalletOptionsGridProps {
  connectOnPlatform?: Platform | 'any'
  showMobileConnector?: boolean
  showOtherWallets?: boolean
  showSeparators?: boolean
  maxHeight?: string
  opacity?: number
}

export function WalletOptionsGrid({
  connectOnPlatform,
  showMobileConnector = false,
  showOtherWallets = false,
  showSeparators = true,
  maxHeight = '100vh',
  opacity = 1,
}: WalletOptionsGridProps): JSX.Element {
  const showOtherWalletsCallback = useSetMenuCallback(MenuStateVariant.OTHER_WALLETS)
  const wallets = useOrderedWallets({ showSecondaryConnectors: isMobileWeb, platformFilter: connectOnPlatform })
  const recentConnectorId = useRecentConnectorId()
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)

  const shouldShowMobileConnector =
    showMobileConnector &&
<<<<<<< HEAD
    (recentConnectorId === CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID ||
=======
    (recentConnectorId === CONNECTION_PROVIDER_IDS.UNISWAP_WALLET_CONNECT_CONNECTOR_ID ||
>>>>>>> upstream/main
      isMobileWeb ||
      isEmbeddedWalletEnabled)

  if (connectOnPlatform === Platform.SVM && wallets.length === 0) {
    return <NoSolanaWalletConnectedView />
  }

  return (
    <Flex row alignItems="flex-start">
      <Flex
        borderRadius="$rounded16"
        overflow="hidden"
        width="100%"
        maxHeight={maxHeight}
        opacity={opacity}
        transition={`${transitions.duration.medium} ${transitions.timing.inOut}`}
        data-testid="option-grid"
      >
        {shouldShowMobileConnector && (
          <>
<<<<<<< HEAD
            <LXMobileWalletConnectorOption />
=======
            <UniswapMobileWalletConnectorOption />
>>>>>>> upstream/main
            {isEmbeddedWalletEnabled ? <Flex height={2} backgroundColor="$surface1" /> : <Separator />}
          </>
        )}
        {wallets.map((wallet, index) => (
          <Fragment key={wallet.name}>
            <WalletConnectorOption wallet={wallet} connectOnPlatform={connectOnPlatform} />
            {showSeparators &&
              (index < wallets.length - 1 || showOtherWallets) &&
              (isEmbeddedWalletEnabled ? <Flex height={2} backgroundColor="$surface1" /> : <Separator />)}
          </Fragment>
        ))}
        {showOtherWallets && !isMobileWeb && <OtherWalletsOption onPress={showOtherWalletsCallback} />}
      </Flex>
    </Flex>
  )
}
