import { PropsWithChildren, useCallback } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router'
import { navigateToInterfaceFiatOnRamp } from 'src/app/features/for/utils'
import { AppRoutes, HomeQueryParams, HomeTabs } from 'src/app/navigation/constants'
import { navigate } from 'src/app/navigation/state'
import {
  focusOrCreateTokensExploreTab,
  focusOrCreateLuxInterfaceTab,
  SidebarLocationState,
} from 'src/app/navigation/utils'
import { lxUrls } from '@luxexchange/lx/src/constants/urls'
import { useEnabledChains } from '@luxexchange/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { useNavigateToNftExplorerLink } from '@luxexchange/lx/src/features/nfts/hooks/useNavigateToNftExplorerLink'
import { CopyNotificationType } from '@luxexchange/lx/src/features/notifications/slice/types'
import { WalletEventName } from '@luxexchange/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@luxexchange/lx/src/features/telemetry/send'
import { ShareableEntity } from '@luxexchange/lx/src/types/sharing'
import { getPoolDetailsURL, getPortfolioUrl, getTokenUrl } from '@luxexchange/lx/src/utils/linking'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { escapeRegExp } from '@luxfi/utilities/src/primitives/string'
import { noop } from '@luxfi/utilities/src/react/noop'
import { useCopyToClipboard } from '@luxfi/wallet/src/components/copy/useCopyToClipboard'
import {
  getNavigateToSendFlowArgsInitialState,
  getNavigateToSwapFlowArgsInitialState,
  NavigateToExternalProfileArgs,
  NavigateToFiatOnRampArgs,
  NavigateToSendFlowArgs,
  NavigateToSwapFlowArgs,
  ShareTokenArgs,
  WalletNavigationContextState,
  WalletNavigationProvider,
} from '@luxfi/wallet/src/contexts/WalletNavigationContext'

export function OnboardingNavigationProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <SharedExtensionNavigationProvider
      navigateToAccountActivityList={noop}
      navigateToAccountTokenList={noop}
      navigateToSwapFlow={noop}
    >
      {children}
    </SharedExtensionNavigationProvider>
  )
}

export function SidebarNavigationProvider({ children }: PropsWithChildren): JSX.Element {
  const navigateToAccountActivityList = useNavigateToAccountActivityList()
  const navigateToAccountTokenList = useNavigateToAccountTokenList()
  const navigateToSwapFlow = useNavigateToSwapFlow()

  return (
    <SharedExtensionNavigationProvider
      navigateToAccountActivityList={navigateToAccountActivityList}
      navigateToAccountTokenList={navigateToAccountTokenList}
      navigateToSwapFlow={navigateToSwapFlow}
    >
      {children}
    </SharedExtensionNavigationProvider>
  )
}

function SharedExtensionNavigationProvider({
  children,
  navigateToAccountActivityList,
  navigateToAccountTokenList,
  navigateToSwapFlow,
}: PropsWithChildren<
  Pick<
    WalletNavigationContextState,
    'navigateToAccountActivityList' | 'navigateToAccountTokenList' | 'navigateToSwapFlow'
  >
>): JSX.Element {
  const handleShareToken = useHandleShareToken()
  const navigateToBuyOrReceiveWithEmptyWallet = useNavigateToBuyOrReceiveWithEmptyWallet()
  const navigateToNftDetails = useNavigateToNftExplorerLink()
  const navigateToReceive = useNavigateToReceive()
  const navigateToSend = useNavigateToSend()
  const navigateToTokenDetails = useNavigateToTokenDetails()
  const navigateToFiatOnRamp = useNavigateToFiatOnRamp()
  const navigateToExternalProfile = useCallback(({ address }: NavigateToExternalProfileArgs) => {
    focusOrCreateLuxInterfaceTab({ url: getPortfolioUrl(address) })
  }, [])
  const navigateToPoolDetails = useNavigateToPoolDetails()
  const navigateToAdvancedSettings = useNavigateToAdvancedSettings()

  return (
    <WalletNavigationProvider
      handleShareToken={handleShareToken}
      navigateToAccountActivityList={navigateToAccountActivityList}
      navigateToAccountTokenList={navigateToAccountTokenList}
      navigateToBuyOrReceiveWithEmptyWallet={navigateToBuyOrReceiveWithEmptyWallet}
      navigateToExternalProfile={navigateToExternalProfile}
      navigateToFiatOnRamp={navigateToFiatOnRamp}
      navigateToNftDetails={navigateToNftDetails}
      navigateToPoolDetails={navigateToPoolDetails}
      navigateToReceive={navigateToReceive}
      navigateToSend={navigateToSend}
      navigateToSwapFlow={navigateToSwapFlow}
      navigateToTokenDetails={navigateToTokenDetails}
      navigateToAdvancedSettings={navigateToAdvancedSettings}
    >
      {children}
    </WalletNavigationProvider>
  )
}

function useHandleShareToken(): (args: ShareTokenArgs) => void {
  const copyToClipboard = useCopyToClipboard()

  return useCallback(
    async ({ currencyId }: ShareTokenArgs): Promise<void> => {
      const url = getTokenUrl(currencyId)

      if (!url) {
        logger.error(new Error('Failed to get token URL'), {
          tags: { file: 'providers.tsx', function: 'useHandleShareToken' },
          extra: { currencyId },
        })
        return
      }

      await copyToClipboard({ textToCopy: url, copyType: CopyNotificationType.TokenUrl })

      sendAnalyticsEvent(WalletEventName.ShareButtonClicked, {
        entity: ShareableEntity.Token,
        url,
      })
    },
    [copyToClipboard],
  )
}

function useNavigateToAccountActivityList(): () => void {
  // TODO(EXT-1029): determine why we need useNavigate here
  const navigateFix = useNavigate()

  return useCallback(
    (): void | Promise<void> =>
      navigateFix({
        pathname: AppRoutes.Home,
        search: createSearchParams({
          [HomeQueryParams.Tab]: HomeTabs.Activity,
        }).toString(),
      }),
    [navigateFix],
  )
}

function useNavigateToAccountTokenList(): () => void {
  // TODO(EXT-1029): determine why we need useNavigate here
  const navigateFix = useNavigate()

  return useCallback(
    (): void | Promise<void> =>
      navigateFix({
        pathname: AppRoutes.Home,
        search: createSearchParams({
          [HomeQueryParams.Tab]: HomeTabs.Tokens,
        }).toString(),
      }),
    [navigateFix],
  )
}

function useNavigateToReceive(): () => void {
  return useCallback((): void => navigate(`/${AppRoutes.Receive}`), [])
}

function useNavigateToSend(): (args: NavigateToSendFlowArgs) => void {
  return useCallback((args: NavigateToSendFlowArgs): void => {
    const initialState = getNavigateToSendFlowArgsInitialState(args)

    const state: SidebarLocationState = args ? { initialTransactionState: initialState } : undefined

    navigate(`/${AppRoutes.Send}`, { state })
  }, [])
}

function useNavigateToSwapFlow(): (args: NavigateToSwapFlowArgs) => void {
  const { defaultChainId } = useEnabledChains()
  const location = useLocation()
  return useCallback(
    (args: NavigateToSwapFlowArgs): void => {
      const initialState = getNavigateToSwapFlowArgsInitialState(args, defaultChainId)

      const state: SidebarLocationState = initialState ? { initialTransactionState: initialState } : undefined

      const isCurrentlyOnSwap = location.pathname === `/${AppRoutes.Swap}`
      navigate(`/${AppRoutes.Swap}`, { state, replace: isCurrentlyOnSwap })
    },
    [defaultChainId, location.pathname],
  )
}

function useNavigateToTokenDetails(): (currencyId: string) => void {
  return useCallback(async (currencyId: string): Promise<void> => {
    await focusOrCreateTokensExploreTab({ currencyId })
  }, [])
}

function useNavigateToPoolDetails(): (args: { poolId: Address; chainId: UniverseChainId }) => void {
  return useCallback(async ({ poolId, chainId }: { poolId: Address; chainId: UniverseChainId }): Promise<void> => {
    await focusOrCreateLuxInterfaceTab({
      url: getPoolDetailsURL(poolId, chainId),
      // We want to reuse the active tab only if it's already in any other PDP.
      // eslint-disable-next-line security/detect-non-literal-regexp
      reuseActiveTabIfItMatches: new RegExp(`^${escapeRegExp(lxUrls.webInterfacePoolsUrl)}`),
    })
  }, [])
}

function useNavigateToBuyOrReceiveWithEmptyWallet(): () => void {
  return useCallback((): void => {
    navigateToInterfaceFiatOnRamp()
  }, [])
}

function useNavigateToFiatOnRamp(): (args: NavigateToFiatOnRampArgs) => void {
  return useCallback(({ prefilledCurrency }: NavigateToFiatOnRampArgs): void => {
    navigateToInterfaceFiatOnRamp(prefilledCurrency?.currencyInfo?.currency.chainId)
  }, [])
}

function useNavigateToAdvancedSettings(): () => void {
  return useCallback((): void => {
    navigate(`/${AppRoutes.Settings}`, { state: { openAdvancedSettings: true } })
  }, [])
}
