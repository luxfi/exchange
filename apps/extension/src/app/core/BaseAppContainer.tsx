<<<<<<< HEAD
import { ApiInit, getEntryGatewayUrl, provideSessionService } from '@l.x/api'
=======
import { ApiInit, getEntryGatewayUrl, provideSessionService } from '@universe/api'
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
  type SessionInitializationService,
<<<<<<< HEAD
} from '@l.x/sessions'
=======
} from '@universe/sessions'
>>>>>>> upstream/main
import { PropsWithChildren, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { GraphqlProvider } from 'src/app/apollo'
import { TraceUserProperties } from 'src/app/components/Trace/TraceUserProperties'
import { ExtensionStatsigProvider } from 'src/app/core/StatsigProvider'
import { type DatadogAppNameTag } from 'src/app/datadog'
import { onHashcashSolveCompleted, sessionInitAnalytics } from 'src/app/features/sessions/analytics'
import { useOnCrashAppStateResetter } from 'src/store/appStateResetter'
import { getReduxStore } from 'src/store/store'
<<<<<<< HEAD
import { BlankUrlProvider } from 'lx/src/contexts/UrlContext'
import { useCurrentLanguage } from 'lx/src/features/language/hooks'
import { LocalizationContextProvider } from 'lx/src/features/language/LocalizationContext'
import { getLocale } from 'lx/src/features/language/navigatorLocale'
import Trace from 'lx/src/features/telemetry/Trace'
import i18n, { changeLanguage } from 'lx/src/i18n'
import { getLogger } from '@l.x/utils/src/logger/logger'
import { ErrorBoundary } from '@luxfi/wallet/src/components/ErrorBoundary/ErrorBoundary'
import { StatsigUserIdentifiersUpdater } from '@luxfi/wallet/src/features/gating/StatsigUserIdentifiersUpdater'
import { SharedWalletProvider } from '@luxfi/wallet/src/providers/SharedWalletProvider'
=======
import { BlankUrlProvider } from 'uniswap/src/contexts/UrlContext'
import { useCurrentLanguage } from 'uniswap/src/features/language/hooks'
import { LocalizationContextProvider } from 'uniswap/src/features/language/LocalizationContext'
import { getLocale } from 'uniswap/src/features/language/navigatorLocale'
import Trace from 'uniswap/src/features/telemetry/Trace'
import i18n, { changeLanguage } from 'uniswap/src/i18n'
import { getLogger } from 'utilities/src/logger/logger'
import { ErrorBoundary } from 'wallet/src/components/ErrorBoundary/ErrorBoundary'
import { StatsigUserIdentifiersUpdater } from 'wallet/src/features/gating/StatsigUserIdentifiersUpdater'
import { SharedWalletProvider } from 'wallet/src/providers/SharedWalletProvider'
>>>>>>> upstream/main

const provideSessionInitializationService = (): SessionInitializationService => {
  // Create performance tracker with feature flag control
  const performanceTracker = createPerformanceTracker({
    getIsPerformanceTrackingEnabled: getIsSessionsPerformanceTrackingEnabled,
    getNow: () => performance.now(),
  })

  const solvers = new Map<ChallengeType, ChallengeSolver>()

  if (getIsTurnstileSolverEnabled()) {
    solvers.set(ChallengeType.TURNSTILE, createTurnstileMockSolver())
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
            getWorker: () =>
              new Worker(
<<<<<<< HEAD
                new URL('@l.x/sessions/src/challenge-solvers/hashcash/worker/hashcash.worker.ts', import.meta.url),
=======
                new URL('@universe/sessions/src/challenge-solvers/hashcash/worker/hashcash.worker.ts', import.meta.url),
>>>>>>> upstream/main
                { type: 'module' },
              ),
          }),
        onSolveCompleted: onHashcashSolveCompleted,
        getLogger,
      }),
    )
  } else {
    solvers.set(ChallengeType.HASHCASH, createHashcashMockSolver())
  }

  return createSessionInitializationService({
    getSessionService: () =>
      provideSessionService({
        getBaseUrl: getEntryGatewayUrl,
        getIsSessionServiceEnabled,
      }),
    challengeSolverService: createChallengeSolverService({
      solvers,
    }),
    performanceTracker,
    getIsSessionUpgradeAutoEnabled,
    getLogger,
    analytics: sessionInitAnalytics,
  })
}

/**
 * Inner component that uses hooks requiring Redux context.
 */
function ErrorBoundaryWrapper({ children }: PropsWithChildren): JSX.Element {
  const onCrashAppStateResetter = useOnCrashAppStateResetter()
  return <ErrorBoundary appStateResetter={onCrashAppStateResetter}>{children}</ErrorBoundary>
}

function BaseAppContainerInner({ children }: PropsWithChildren): JSX.Element {
  const isSessionServiceEnabled = useIsSessionServiceEnabled()

  return (
    <I18nextProvider i18n={i18n}>
      <SharedWalletProvider reduxStore={getReduxStore()}>
        <ErrorBoundaryWrapper>
          <LanguageSync />
          <GraphqlProvider>
            <BlankUrlProvider>
              <LocalizationContextProvider>
                <TraceUserProperties />
                <StatsigUserIdentifiersUpdater />
                <ApiInit
                  getSessionInitService={provideSessionInitializationService}
                  isSessionServiceEnabled={isSessionServiceEnabled}
                />
                {children}
              </LocalizationContextProvider>
            </BlankUrlProvider>
          </GraphqlProvider>
        </ErrorBoundaryWrapper>
      </SharedWalletProvider>
    </I18nextProvider>
  )
}

export function BaseAppContainer({
  children,
  appName,
}: PropsWithChildren<{ appName: DatadogAppNameTag }>): JSX.Element {
  return (
    <Trace>
      <ExtensionStatsigProvider appName={appName}>
        <BaseAppContainerInner>{children}</BaseAppContainerInner>
      </ExtensionStatsigProvider>
    </Trace>
  )
}

function LanguageSync(): null {
  const currentLanguage = useCurrentLanguage()

  useEffect(() => {
    changeLanguage(getLocale(currentLanguage)).catch(() => undefined)
  }, [currentLanguage])

  return null
}
