import { queryOptions } from '@tanstack/react-query'
import { PlatformType } from '@luxamm/client-notification-service/dist/lx/notificationservice/v1/api_pb'
import {
  createFetchClient,
  createNotificationsApiClient,
  getEntryGatewayUrl,
  provideSessionService,
  SharedQueryClient,
} from '@l.x/api'
import { getIsSessionServiceEnabled } from '@l.x/gating'
import {
  createApiNotificationTracker,
  createBaseNotificationProcessor,
  createNotificationService,
  createPollingNotificationDataSource,
  createReactiveDataSource,
  getNotificationQueryOptions,
  type NotificationService,
} from '@l.x/notifications'
import { Appearance } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { MobileState } from 'src/app/mobileReducer'
import { store } from 'src/app/store'
import { createMobileStorageAdapter } from 'src/notification-service/createMobileStorageAdapter'
import { createForceUpgradeNotificationDataSource } from 'src/notification-service/data-sources/createForceUpgradeNotificationDataSource'
import { createMobileLegacyBannersNotificationDataSource } from 'src/notification-service/data-sources/createMobileLegacyBannersNotificationDataSource'
import { createOfflineCondition } from 'src/notification-service/data-sources/reactive/offlineCondition'
import { handleNotificationNavigation } from 'src/notification-service/handleNotificationNavigation'
import { createMobileNotificationRenderer } from 'src/notification-service/notification-renderer/createMobileNotificationRenderer'
import { mobileNotificationStore } from 'src/notification-service/notification-renderer/notificationStore'
import { getNotificationTelemetry } from 'src/notification-service/notification-telemetry/getNotificationTelemetry'
import { createMobileLocalTriggerDataSource } from 'src/notification-service/triggers/createMobileLocalTriggerDataSource'
import { getPortfolioQuery } from '@l.x/lx/src/data/rest/getPortfolio'
import { AppearanceSettingType } from '@l.x/lx/src/features/appearance/slice'
import { mapLocaleToBackendLocale } from '@l.x/lx/src/features/language/constants'
import { getLocale } from '@l.x/lx/src/features/language/navigatorLocale'
import { selectCurrentLanguage } from '@l.x/lx/src/features/settings/selectors'
import { isDevEnv } from '@luxfi/utilities/src/environment/env'
import { REQUEST_SOURCE } from '@luxfi/utilities/src/platform/requestSource'
import { ReactQueryCacheKey } from '@luxfi/utilities/src/reactQuery/cache'
import { type QueryOptionsResult } from '@luxfi/utilities/src/reactQuery/queryOptions'
import { ONE_MINUTE_MS, ONE_SECOND_MS } from '@luxfi/utilities/src/time/time'
import { selectActiveAccountAddress } from '@luxfi/wallet/src/features/wallet/selectors'

/**
 * Creates the notification service with all necessary dependencies
 */
function provideMobileNotificationService(ctx: { getIsApiDataSourceEnabled: () => boolean }): NotificationService {
  const notifApiBaseUrl = getEntryGatewayUrl()

  const fetchClient = createFetchClient({
    baseUrl: notifApiBaseUrl,
    getHeaders: () => {
      const currentLanguage = selectCurrentLanguage(store.getState())
      const locale = getLocale(currentLanguage)
      const backendLocale = mapLocaleToBackendLocale(locale)

      const version = DeviceInfo.getVersion()
      const semver = version.split('.').length === 2 ? `${version}.0` : version

      return {
        'Content-Type': 'application/json',
        'x-request-source': REQUEST_SOURCE,
        'x-lx-locale': backendLocale,
        'x-app-version': semver,
      }
    },
    getSessionService: () =>
      provideSessionService({ getBaseUrl: () => getEntryGatewayUrl(), getIsSessionServiceEnabled }),
  })

  const apiClient = createNotificationsApiClient({
    fetchClient,
    getApiPathPrefix: () => '', // Empty prefix if the full path is in the base URL
  })

  const notificationQueryOptions = getNotificationQueryOptions({
    apiClient,
    getPlatformType: () => PlatformType.MOBILE,
    pollIntervalMs: 2 * ONE_MINUTE_MS,
  })

  const backendDataSource = createPollingNotificationDataSource({
    queryClient: SharedQueryClient,
    queryOptions: notificationQueryOptions,
  })

  const tracker = createApiNotificationTracker({
    notificationsApiClient: apiClient,
    queryClient: SharedQueryClient,
    storage: createMobileStorageAdapter(),
  })

  const bannersDataSource = createMobileLegacyBannersNotificationDataSource({
    tracker,
    pollIntervalMs: 10 * ONE_SECOND_MS,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    getState: (): MobileState => store.getState(),
    getIsDarkMode: (): boolean => {
      const state = store.getState()
      const appearanceSetting = state.appearanceSettings?.selectedAppearanceSettings ?? AppearanceSettingType.System
      if (appearanceSetting === AppearanceSettingType.Dark) {
        return true
      }
      if (appearanceSetting === AppearanceSettingType.Light) {
        return false
      }
      // System theme - check device appearance
      return Appearance.getColorScheme() === 'dark'
    },
  })

  const processor = createBaseNotificationProcessor(tracker)

  const renderer = createMobileNotificationRenderer({
    store: mobileNotificationStore,
  })

  const telemetry = getNotificationTelemetry()

  const forceUpgradeDataSource = createForceUpgradeNotificationDataSource({
    pollIntervalMs: 30000, // Check every 30 seconds
  })

  /**
   * Fetches the portfolio value for the active account.
   * Used by local triggers that need to check portfolio-based conditions.
   */
  const getPortfolioValue = async (): Promise<number> => {
    const state = store.getState()
    const evmAddress = selectActiveAccountAddress(state)

    if (!evmAddress) {
      return 0
    }

    const queryOpts = getPortfolioQuery({ input: { evmAddress } })
    const portfolioData = await SharedQueryClient.fetchQuery(queryOpts)
    return portfolioData?.portfolio?.totalValueUsd ?? 0
  }

  const localTriggersDataSource = createMobileLocalTriggerDataSource({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    getState: (): MobileState => store.getState(),
    dispatch: store.dispatch,
    tracker,
    getPortfolioValue,
    pollIntervalMs: 5000,
  })

  // Reactive data source for offline banner - reacts immediately to network state changes
  // Note: Disabled in __DEV__ mode since the simulator has unreliable network state
  // https://github.com/react-native-netinfo/react-native-netinfo/issues/7
  const offlineDataSource =
    isDevEnv() || __DEV__
      ? undefined
      : createReactiveDataSource({
          condition: createOfflineCondition({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            getState: (): MobileState => store.getState(),
          }),
          tracker,
          source: 'system_alerts',
          logFileTag: 'offlineCondition',
        })

  const dataSources = ctx.getIsApiDataSourceEnabled()
    ? [
        backendDataSource,
        bannersDataSource,
        forceUpgradeDataSource,
        localTriggersDataSource,
        ...(offlineDataSource ? [offlineDataSource] : []),
      ]
    : [
        bannersDataSource,
        forceUpgradeDataSource,
        localTriggersDataSource,
        ...(offlineDataSource ? [offlineDataSource] : []),
      ]

  const notificationService = createNotificationService({
    dataSources,
    tracker,
    processor,
    renderer,
    telemetry,
    onNavigate: handleNotificationNavigation,
  })

  return notificationService
}

/**
 * Query options factory for the notification service
 */
export function getNotificationServiceQueryOptions(ctx: {
  getIsEnabled: () => boolean
  getIsApiDataSourceEnabled: () => boolean
}): QueryOptionsResult<NotificationService, Error, NotificationService, [ReactQueryCacheKey.NotificationService]> {
  return queryOptions({
    queryKey: [ReactQueryCacheKey.NotificationService],
    queryFn: () => provideMobileNotificationService(ctx),
    enabled: ctx.getIsEnabled(),
    staleTime: Infinity, // Never refetch while mounted
    gcTime: 0, // Don't persist in cache - NotificationService has methods that can't be serialized
  })
}
