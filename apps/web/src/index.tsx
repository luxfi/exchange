// Ordering is intentional and must be preserved: sideEffects followed by functionality.
import '~/sideEffects'

import { ApolloProvider } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import { ApiInit, getEntryGatewayUrl, provideSessionService } from '@l.x/api'
import {
  getIsHashcashSolverEnabled,
  getIsSessionServiceEnabled,
  getIsSessionsPerformanceTrackingEnabled,
  getIsSessionUpgradeAutoEnabled,
  getIsTurnstileSolverEnabled,
  useIsSessionServiceEnabled,
} from '@l.x/gating'
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
} from '@l.x/sessions'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import type { PropsWithChildren } from 'react'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async/lib/index'
import { I18nextProvider } from 'react-i18next'
// eslint-disable-next-line no-restricted-imports -- configures Reanimated logger to suppress dev warnings while shared packages still use Reanimated
import { configureReanimatedLogger } from 'react-native-reanimated'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter, useLocation } from 'react-router'
import { PortalProvider } from '@l.x/ui/src'
import { ReactRouterUrlProvider } from '@l.x/lx/src/contexts/UrlContext'
import { initializePortfolioQueryOverrides } from '@l.x/lx/src/data/rest/portfolioBalanceOverrides'
import { LocalizationContextProvider } from '@l.x/lx/src/features/language/LocalizationContext'
import { TokenPriceProvider } from '@l.x/lx/src/features/prices/TokenPriceContext'
import i18n from '@l.x/lx/src/i18n'
import { initializeDatadog } from '@l.x/lx/src/utils/datadog'
import { localDevDatadogEnabled } from '@l.x/utils/src/environment/constants'
import { isDevEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { getLogger } from '@l.x/utils/src/logger/logger'
// biome-ignore lint/style/noRestrictedImports: custom useAccount hook requires statsig
import { useAccount } from 'wagmi'
import { AssetActivityProvider } from '~/appGraphql/data/apollo/AssetActivityProvider'
import { apolloClient } from '~/appGraphql/data/apollo/client'
import { TokenBalancesProvider } from '~/appGraphql/data/apollo/TokenBalancesProvider'
import { QueryClientPersistProvider } from '~/components/PersistQueryClient'
import { createWeb3Provider, WalletCapabilitiesEffects } from '~/components/Web3Provider/createWeb3Provider'
import { WebLuxProvider } from '~/components/Web3Provider/WebLuxContext'
import { initWagmiConfig, wagmiConfig } from '~/components/Web3Provider/wagmiConfig'
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
import { GuiProvider } from '~/theme/guiProvider'
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
                new URL('@l.x/sessions/src/challenge-solvers/hashcash/worker/hashcash.worker.ts', import.meta.url),
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

// Web3Provider is created lazily after brand config loads (see loadBrandConfig below).
// This ensures wagmi sees the correct default chain from config.json.
let Web3Provider: ReturnType<typeof createWeb3Provider>

function GraphqlProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AssetActivityProvider>
        <TokenBalancesProvider>{children}</TokenBalancesProvider>
      </AssetActivityProvider>
    </ApolloProvider>
  )
}
function TelemetryProvider({ children }: PropsWithChildren) {
  const account = useAccount()

  // Datadog gets the connection metadata that used to be a Statsig user
  // property. Gating is now local-only — no SDK init, no provider wrapper.
  useEffect(() => {
    datadogRum.setUserProperty('connection', {
      type: account.connector?.type,
      name: account.connector?.name,
      rdns: account.connector?.id,
      address: account.address,
      status: account.status,
    })
  }, [account])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!isDevEnv() || localDevDatadogEnabled) {
      initializeDatadog('web').catch(() => undefined)
    }
  }, [])

  return <>{children}</>
}

const container = document.getElementById('root') as HTMLElement

const Router = isBrowserRouterEnabled() ? BrowserRouter : HashRouter

const RootApp = (): JSX.Element => {
  return (
    <StrictMode>
      <HelmetProvider>
        <ReactRouterUrlProvider>
          <Provider store={store}>
            <QueryClientPersistProvider>
              <NuqsAdapter>
                <Router>
                  <>
                    <I18nextProvider i18n={i18n}>
                      <LanguageProvider>
                        <Web3Provider>
                          <TelemetryProvider>
                            <WalletCapabilitiesEffects />
                            <ExternalWalletProvider>
                              <ConnectWalletMutationProvider>
                                <WebAccountsStoreProvider>
                                  <WebLuxProvider>
                                    <TokenPriceProvider>
                                      <GraphqlProviders>
                                        <LivePricesProvider>
                                          <LocalizationContextProvider>
                                            <BlockNumberProvider>
                                              <Updaters />
                                              <ThemeProvider>
                                                <GuiProvider>
                                                  <PortalProvider>
                                                    <WebNotificationServiceManager />
                                                    <ThemedGlobalStyle />
                                                    <App />
                                                  </PortalProvider>
                                                </GuiProvider>
                                              </ThemeProvider>
                                            </BlockNumberProvider>
                                          </LocalizationContextProvider>
                                        </LivePricesProvider>
                                      </GraphqlProviders>
                                    </TokenPriceProvider>
                                  </WebLuxProvider>
                                </WebAccountsStoreProvider>
                              </ConnectWalletMutationProvider>
                            </ExternalWalletProvider>
                          </TelemetryProvider>
                        </Web3Provider>
                      </LanguageProvider>
                    </I18nextProvider>
                  </>
                </Router>
              </NuqsAdapter>
            </QueryClientPersistProvider>
          </Provider>
        </ReactRouterUrlProvider>
      </HelmetProvider>
    </StrictMode>
  )
}

// Load runtime brand + deployment config before rendering.
// loadBrandConfig fetches /brand.json (static, per-brand).
// loadRuntimeConfig fetches /config.json (per-deployment, templated by
// hanzoai/spa from SPA_* env vars at pod startup).
import { brand, loadBrandConfig, loadRuntimeConfig } from '@l.x/config'
import { brandThemeOverlay } from '@l.x/ui/src/theme'

Promise.all([loadBrandConfig(), loadRuntimeConfig()]).then(() => {
  // Apply brand color tokens (accent1, surface1, neutral1, etc.) over the
  // default Tamagui themes so any code that reads themes via JS sees the
  // brand-overridden values. CSS variables are already set by loadBrandConfig.
  brandThemeOverlay(brand.theme)

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

// We once had a ServiceWorker, and users who have not visited since then may still have it registered.
// This ensures it is truly gone.
unregisterServiceWorker()
