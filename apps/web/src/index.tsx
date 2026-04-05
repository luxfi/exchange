// Ordering is intentional and must be preserved: sideEffects followed by functionality.
import '~/sideEffects'
<<<<<<< HEAD

import { getDeviceId } from '@amplitude/analytics-browser'
import { ApolloProvider } from '@apollo/client'
import { InsightsProvider } from '@hanzo/insights-react'
import { datadogRum } from '@datadog/browser-rum'
import { PrivyProvider } from '@privy-io/react-auth'
import { ApiInit, getEntryGatewayUrl, provideSessionService } from '@l.x/api'
import type { StatsigUser } from '@l.x/gating'
=======
import { getDeviceId } from '@amplitude/analytics-browser'
import { ApolloProvider } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import { PrivyProvider } from '@privy-io/react-auth'
import { ApiInit, getEntryGatewayUrl, provideSessionService } from '@universe/api'
import type { StatsigUser } from '@universe/gating'
>>>>>>> upstream/main
import {
  getIsHashcashSolverEnabled,
  getIsSessionServiceEnabled,
  getIsSessionsPerformanceTrackingEnabled,
  getIsSessionUpgradeAutoEnabled,
  getIsTurnstileSolverEnabled,
  useIsSessionServiceEnabled,
<<<<<<< HEAD
} from '@l.x/gating'
=======
} from '@universe/gating'
>>>>>>> upstream/main
import {
  type ChallengeSolver,
  ChallengeType,
  createChallengeSolverService,
  createHashcashMockSolver,
  createHashcashSolver,
  createHashcashWorkerChannel,
  createPerformanceTracker,
  createSessionInitializationService,
  createTurnstileMockSolver,
  createTurnstileSolver,
<<<<<<< HEAD
} from '@l.x/sessions'
=======
} from '@universe/sessions'
>>>>>>> upstream/main
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import type { PropsWithChildren, ReactNode } from 'react'
import { StrictMode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async/lib/index'
import { I18nextProvider } from 'react-i18next'
<<<<<<< HEAD
// eslint-disable-next-line no-restricted-imports -- configures Reanimated logger to suppress dev warnings while shared packages still use Reanimated
import { configureReanimatedLogger } from 'react-native-reanimated'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter, useLocation } from 'react-router'
import { PortalProvider } from '@l.x/ui/src'
import { ReactRouterUrlProvider } from '@l.x/lx/src/contexts/UrlContext'
import { initializePortfolioQueryOverrides } from '@l.x/lx/src/data/rest/portfolioBalanceOverrides'
import { StatsigProviderWrapper } from '@l.x/lx/src/features/gating/StatsigProviderWrapper'
import { LocalizationContextProvider } from '@l.x/lx/src/features/language/LocalizationContext'
import { TokenPriceProvider } from '@l.x/lx/src/features/prices/TokenPriceContext'
import i18n from '@l.x/lx/src/i18n'
import { initializeDatadog } from '@l.x/lx/src/utils/datadog'
import { localDevDatadogEnabled } from '@l.x/utils/src/environment/constants'
import { isDevEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { getLogger } from '@l.x/utils/src/logger/logger'
// biome-ignore lint/style/noRestrictedImports: custom useAccount hook requires statsig
=======
// oxlint-disable-next-line no-restricted-imports -- configures Reanimated logger to suppress dev warnings while shared packages still use Reanimated
import { configureReanimatedLogger } from 'react-native-reanimated'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter, useLocation } from 'react-router'
import { PortalProvider } from 'ui/src'
import { ReactRouterUrlProvider } from 'uniswap/src/contexts/UrlContext'
import { initializePortfolioQueryOverrides } from 'uniswap/src/data/rest/portfolioBalanceOverrides'
import { StatsigProviderWrapper } from 'uniswap/src/features/gating/StatsigProviderWrapper'
import { LocalizationContextProvider } from 'uniswap/src/features/language/LocalizationContext'
import { TokenPriceProvider } from 'uniswap/src/features/prices/TokenPriceContext'
import i18n from 'uniswap/src/i18n'
import { initializeDatadog } from 'uniswap/src/utils/datadog'
import { localDevDatadogEnabled } from 'utilities/src/environment/constants'
import { isDevEnv, isTestEnv } from 'utilities/src/environment/env'
import { getLogger } from 'utilities/src/logger/logger'
// oxlint-disable-next-line no-restricted-imports -- custom useAccount hook requires statsig
>>>>>>> upstream/main
import { useAccount } from 'wagmi'
import { AssetActivityProvider } from '~/appGraphql/data/apollo/AssetActivityProvider'
import { apolloClient } from '~/appGraphql/data/apollo/client'
import { TokenBalancesProvider } from '~/appGraphql/data/apollo/TokenBalancesProvider'
import { QueryClientPersistProvider } from '~/components/PersistQueryClient'
import { createWeb3Provider, WalletCapabilitiesEffects } from '~/components/Web3Provider/createWeb3Provider'
<<<<<<< HEAD
import { WebLuxProvider } from '~/components/Web3Provider/WebLuxContext'
import { initWagmiConfig, wagmiConfig } from '~/components/Web3Provider/wagmiConfig'
=======
import { wagmiConfig } from '~/components/Web3Provider/wagmiConfig'
import { WebUniswapProvider } from '~/components/Web3Provider/WebUniswapContext'
>>>>>>> upstream/main
import { AccountsStoreDevTool } from '~/features/accounts/store/devtools'
import { WebAccountsStoreProvider } from '~/features/accounts/store/provider'
import { ConnectWalletMutationProvider } from '~/features/wallet/connection/hooks/useConnectWalletMutation'
import { ExternalWalletProvider } from '~/features/wallet/providers/ExternalWalletProvider'
import { useDeferredComponent } from '~/hooks/useDeferredComponent'
import { LanguageProvider } from '~/i18n/LanguageProvider'
import { BlockNumberProvider } from '~/lib/hooks/useBlockNumber'
import { WebNotificationServiceManager } from '~/notification-service/WebNotificationService'
import App from '~/pages/App'
import { onHashcashSolveCompleted, onTurnstileSolveCompleted, sessionInitAnalytics } from '~/sessions/analytics'
import store from '~/state'
import { LivePricesProvider } from '~/state/livePrices/LivePricesProvider'
import { ThemedGlobalStyle, ThemeProvider } from '~/theme'
<<<<<<< HEAD
import { GuiProvider } from '~/theme/guiProvider'
=======
import { TamaguiProvider } from '~/theme/tamaguiProvider'
>>>>>>> upstream/main
import { isBrowserRouterEnabled } from '~/utils/env'
import { unregister as unregisterServiceWorker } from '~/utils/serviceWorker'
import { getCanonicalUrl } from '~/utils/urlRoutes'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

if (__DEV__ && !isTestEnv()) {
  configureReanimatedLogger({
    strict: false,
  })
}

initializePortfolioQueryOverrides({ store })

const loadListsUpdater = () => import('~/state/lists/updater')
const loadApplicationUpdater = () => import('~/state/application/updater')
const loadActivityStateUpdater = () =>
  import('~/state/activity/updater').then((m) => ({ default: m.ActivityStateUpdater }))
const loadLogsUpdater = () => import('~/state/logs/updater')
const loadFiatOnRampTransactionsUpdater = () => import('~/state/fiatOnRampTransactions/updater')
const loadWebAccountsStoreUpdater = () =>
  import('~/features/accounts/store/updater').then((m) => ({ default: m.WebAccountsStoreUpdater }))

const provideSessionInitService = () => {
  // Create performance tracker with feature flag control
  // Platform-specific: uses web's performance.now() API
  const performanceTracker = createPerformanceTracker({
    getIsPerformanceTrackingEnabled: getIsSessionsPerformanceTrackingEnabled,
    getNow: () => performance.now(),
  })

  // Build solvers map based on feature flags
  const solvers = new Map<ChallengeType, ChallengeSolver>()

  if (getIsTurnstileSolverEnabled()) {
    solvers.set(
      ChallengeType.TURNSTILE,
      createTurnstileSolver({ performanceTracker, getLogger, onSolveCompleted: onTurnstileSolveCompleted }),
    )
  } else {
    solvers.set(ChallengeType.TURNSTILE, createTurnstileMockSolver())
  }
  if (getIsHashcashSolverEnabled()) {
    solvers.set(
      ChallengeType.HASHCASH,
      createHashcashSolver({
        performanceTracker,
        getWorkerChannel: () =>
          createHashcashWorkerChannel({
            getWorker: () => {
              return new Worker(
<<<<<<< HEAD
                new URL('@l.x/sessions/src/challenge-solvers/hashcash/worker/hashcash.worker.ts', import.meta.url),
=======
                new URL('@universe/sessions/src/challenge-solvers/hashcash/worker/hashcash.worker.ts', import.meta.url),
>>>>>>> upstream/main
                { type: 'module' },
              )
            },
          }),
        onSolveCompleted: onHashcashSolveCompleted,
        getLogger,
      }),
    )
  } else {
    solvers.set(ChallengeType.HASHCASH, createHashcashMockSolver())
  }

  return createSessionInitializationService({
    performanceTracker,
    getSessionService: () =>
      provideSessionService({
        getBaseUrl: getEntryGatewayUrl,
        getIsSessionServiceEnabled,
        getLogger,
      }),
    challengeSolverService: createChallengeSolverService({
      solvers,
      getLogger,
    }),
    getIsSessionUpgradeAutoEnabled,
    getLogger,
    analytics: sessionInitAnalytics,
  })
}

function Updaters() {
  const location = useLocation()
  const isSessionServiceEnabled = useIsSessionServiceEnabled()

  const ListsUpdater = useDeferredComponent(loadListsUpdater)
  const ApplicationUpdater = useDeferredComponent(loadApplicationUpdater)
  const ActivityStateUpdater = useDeferredComponent(loadActivityStateUpdater)
  const LogsUpdater = useDeferredComponent(loadLogsUpdater)
  const FiatOnRampTransactionsUpdater = useDeferredComponent(loadFiatOnRampTransactionsUpdater)
  const WebAccountsStoreUpdater = useDeferredComponent(loadWebAccountsStoreUpdater)

  return (
    <>
      <Helmet>
        <link rel="canonical" href={getCanonicalUrl(location.pathname)} />
      </Helmet>
      {ListsUpdater && <ListsUpdater />}
      {ApplicationUpdater && <ApplicationUpdater />}
      {ActivityStateUpdater && <ActivityStateUpdater />}
      {LogsUpdater && <LogsUpdater />}
      {FiatOnRampTransactionsUpdater && <FiatOnRampTransactionsUpdater />}
      {WebAccountsStoreUpdater && <WebAccountsStoreUpdater />}
      <AccountsStoreDevTool />
      <ApiInit getSessionInitService={provideSessionInitService} isSessionServiceEnabled={isSessionServiceEnabled} />
    </>
  )
}

<<<<<<< HEAD
// Web3Provider is created lazily after brand config loads (see loadBrandConfig below).
// This ensures wagmi sees the correct default chain from config.json.
let Web3Provider: ReturnType<typeof createWeb3Provider>
=======
// Production Web3Provider – always reconnects on mount and runs capability effects.
const Web3Provider = createWeb3Provider({ wagmiConfig })
>>>>>>> upstream/main

function GraphqlProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AssetActivityProvider>
        <TokenBalancesProvider>{children}</TokenBalancesProvider>
      </AssetActivityProvider>
    </ApolloProvider>
  )
}
function StatsigProvider({ children }: PropsWithChildren) {
  const account = useAccount()

  const statsigUser: StatsigUser = useMemo(
    () => ({
      userID: getDeviceId(),
      customIDs: { address: account.address ?? '' },
<<<<<<< HEAD
=======
      custom: {
        appVersion: process.env.REACT_APP_VERSION_TAG ?? 'unknown',
      },
>>>>>>> upstream/main
    }),
    [account.address],
  )

  useEffect(() => {
    datadogRum.setUserProperty('connection', {
      type: account.connector?.type,
      name: account.connector?.name,
      rdns: account.connector?.id,
      address: account.address,
      status: account.status,
    })
  }, [account])

  const onStatsigInit = () => {
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
    // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
    if (!isDevEnv() || localDevDatadogEnabled) {
      initializeDatadog('web').catch(() => undefined)
    }
  }

  return (
    <StatsigProviderWrapper user={statsigUser} onInit={onStatsigInit}>
      {children}
    </StatsigProviderWrapper>
  )
}

const PRIVY_APP_ID = process.env.PRIVY_APP_ID

function MaybePrivyProvider({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    return <>{children}</>
  }
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={{ loginMethods: ['email', 'google', 'apple'] }}>
      {children}
    </PrivyProvider>
  )
}

const container = document.getElementById('root') as HTMLElement

const Router = isBrowserRouterEnabled() ? BrowserRouter : HashRouter

const RootApp = (): JSX.Element => {
  return (
    <StrictMode>
<<<<<<< HEAD
      <InsightsProvider
        apiKey={process.env.REACT_APP_INSIGHTS_API_KEY || 'hi_a5316882b930d11c9183007d70c3955b'}
        options={{
          api_host: process.env.REACT_APP_INSIGHTS_HOST || 'https://insights.hanzo.ai',
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: true,
          loaded: (hi: any) => {
            const slug = brand.appDomain?.replace(/\./g, '-') || 'lux-exchange'
            const org = brand.name?.split(' ')[0]?.toLowerCase() || 'lux'
            hi.register({ app: slug, org })
          },
        }}
      >
=======
>>>>>>> upstream/main
      <HelmetProvider>
        <ReactRouterUrlProvider>
          <Provider store={store}>
            <QueryClientPersistProvider>
              <NuqsAdapter>
                <Router>
                  <MaybePrivyProvider>
                    <I18nextProvider i18n={i18n}>
                      <LanguageProvider>
                        <Web3Provider>
                          <StatsigProvider>
                            <WalletCapabilitiesEffects />
                            <ExternalWalletProvider>
                              <ConnectWalletMutationProvider>
                                <WebAccountsStoreProvider>
<<<<<<< HEAD
                                  <WebLuxProvider>
=======
                                  <WebUniswapProvider>
>>>>>>> upstream/main
                                    <TokenPriceProvider>
                                      <GraphqlProviders>
                                        <LivePricesProvider>
                                          <LocalizationContextProvider>
                                            <BlockNumberProvider>
                                              <Updaters />
                                              <ThemeProvider>
<<<<<<< HEAD
                                                <GuiProvider>
=======
                                                <TamaguiProvider>
>>>>>>> upstream/main
                                                  <PortalProvider>
                                                    <WebNotificationServiceManager />
                                                    <ThemedGlobalStyle />
                                                    <App />
                                                  </PortalProvider>
<<<<<<< HEAD
                                                </GuiProvider>
=======
                                                </TamaguiProvider>
>>>>>>> upstream/main
                                              </ThemeProvider>
                                            </BlockNumberProvider>
                                          </LocalizationContextProvider>
                                        </LivePricesProvider>
                                      </GraphqlProviders>
                                    </TokenPriceProvider>
<<<<<<< HEAD
                                  </WebLuxProvider>
=======
                                  </WebUniswapProvider>
>>>>>>> upstream/main
                                </WebAccountsStoreProvider>
                              </ConnectWalletMutationProvider>
                            </ExternalWalletProvider>
                          </StatsigProvider>
                        </Web3Provider>
                      </LanguageProvider>
                    </I18nextProvider>
                  </MaybePrivyProvider>
                </Router>
              </NuqsAdapter>
            </QueryClientPersistProvider>
          </Provider>
        </ReactRouterUrlProvider>
      </HelmetProvider>
<<<<<<< HEAD
      </InsightsProvider>
=======
>>>>>>> upstream/main
    </StrictMode>
  )
}

<<<<<<< HEAD
// Load runtime brand config before rendering (fetches /config.json)
import { brand, loadBrandConfig } from '@l.x/config'

loadBrandConfig().then(() => {
  // Inject brand values as i18n interpolation defaults so {{brandName}} etc. work in translations
  const brandVars = {
    brandName: brand.name,
    brandTitle: brand.title,
    brandShort: brand.shortName,
    labsName: brand.labsName,
    legalEntity: brand.legalEntity,
    walletName: brand.walletName,
    protocolName: brand.protocolName,
    copyrightHolder: brand.copyrightHolder,
    appDomain: brand.appDomain,
  }
  // Set on i18n options (for future reference)
  i18n.options.interpolation = { ...i18n.options.interpolation, defaultVariables: brandVars }
  // Also set on the Interpolator instance directly (i18next caches its own copy)
  const interpolator = (i18n.services as any)?.interpolator
  if (interpolator?.options) {
    interpolator.options.defaultVariables = brandVars
  }

  // Initialize the ONE wagmi config with the brand's default chain.
  // No wagmi config exists until this point — the Proxy export throws if
  // accessed before this, ensuring nothing uses a stale default chain.
  const brandWagmiConfig = initWagmiConfig(brand.defaultChainId)
  Web3Provider = createWeb3Provider({ wagmiConfig: brandWagmiConfig })

  createRoot(container).render(<RootApp />)
})
=======
createRoot(container).render(<RootApp />)
>>>>>>> upstream/main

// We once had a ServiceWorker, and users who have not visited since then may still have it registered.
// This ensures it is truly gone.
unregisterServiceWorker()
