import type { Config } from '@l.x/config/src/config-types'
import {
  ALCHEMY_API_KEY,
  ANALYTICS_PROXY_URL_OVERRIDE,
  API_BASE_URL_OVERRIDE,
  API_BASE_URL_V2_OVERRIDE,
  APPSFLYER_API_KEY,
  APPSFLYER_APP_ID,
  BLOCKAID_PROXY_URL,
  BOOTNODE_RPC_URL_OVERRIDE,
  ENABLE_ENTRY_GATEWAY_PROXY,
  ENABLE_SESSION_SERVICE,
  ENABLE_SESSION_UPGRADE_AUTO,
  ENTRY_GATEWAY_API_URL_OVERRIDE,
  FOR_API_URL_OVERRIDE,
  GRAPHQL_URL_OVERRIDE,
  INCLUDE_PROTOTYPE_FEATURES,
  INFURA_KEY,
  IS_E2E_TEST,
  JUPITER_PROXY_URL,
  LIQUIDITY_SERVICE_URL_OVERRIDE,
  ONESIGNAL_APP_ID,
  SCANTASTIC_API_URL_OVERRIDE,
  STATSIG_API_KEY,
  STATSIG_PROXY_URL_OVERRIDE,
  TRADING_API_KEY,
  TRADING_API_URL_OVERRIDE,
  LX_API_KEY,
  LX_NOTIF_API_BASE_URL_OVERRIDE,
  UNITAGS_API_URL_OVERRIDE,
  WALLETCONNECT_PROJECT_ID,
  WALLETCONNECT_PROJECT_ID_BETA,
  WALLETCONNECT_PROJECT_ID_DEV,
} from 'react-native-dotenv'
import { isNonTestDev } from '@l.x/utils/src/environment/constants'

// Module-level cache for config to avoid recomputing on every call
let cachedConfig: Config | undefined

// eslint-disable-next-line complexity
export const getConfig = (): Config => {
  // Return cached config if already computed
  if (cachedConfig !== undefined) {
    return cachedConfig
  }

  const config: Config = {
    alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY || ALCHEMY_API_KEY,
    analyticsProxyUrlOverride: process.env.ANALYTICS_PROXY_URL_OVERRIDE || ANALYTICS_PROXY_URL_OVERRIDE,
    apiBaseUrlOverride: process.env.API_BASE_URL_OVERRIDE || API_BASE_URL_OVERRIDE,
    apiBaseUrlV2Override: process.env.API_BASE_URL_V2_OVERRIDE || API_BASE_URL_V2_OVERRIDE,
    appsflyerApiKey: process.env.APPSFLYER_API_KEY || APPSFLYER_API_KEY,
    appsflyerAppId: process.env.APPSFLYER_APP_ID || APPSFLYER_APP_ID,
    blockaidProxyUrl: process.env.BLOCKAID_PROXY_URL || BLOCKAID_PROXY_URL,
    bootnodeRpcUrlOverride: process.env.BOOTNODE_RPC_URL_OVERRIDE || BOOTNODE_RPC_URL_OVERRIDE,
    enableEntryGatewayProxy: process.env.ENABLE_ENTRY_GATEWAY_PROXY === 'true' || ENABLE_ENTRY_GATEWAY_PROXY === 'true',
    enableSessionService: process.env.ENABLE_SESSION_SERVICE === 'true' || ENABLE_SESSION_SERVICE === 'true',
    enableSessionUpgradeAuto:
      process.env.ENABLE_SESSION_UPGRADE_AUTO === 'true' || ENABLE_SESSION_UPGRADE_AUTO === 'true',
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    isE2ETest: process.env.IS_E2E_TEST?.toLowerCase() === 'true' || IS_E2E_TEST?.toLowerCase() === 'true',
    forApiUrlOverride: process.env.FOR_API_URL_OVERRIDE || FOR_API_URL_OVERRIDE,
    graphqlUrlOverride: process.env.GRAPHQL_URL_OVERRIDE || GRAPHQL_URL_OVERRIDE,
    infuraKey: process.env.REACT_APP_INFURA_KEY || INFURA_KEY,
    includePrototypeFeatures: process.env.INCLUDE_PROTOTYPE_FEATURES || INCLUDE_PROTOTYPE_FEATURES,
    isVercelEnvironment: false,
    jupiterProxyUrl: process.env.JUPITER_PROXY_URL || JUPITER_PROXY_URL,
    onesignalAppId: process.env.ONESIGNAL_APP_ID || ONESIGNAL_APP_ID,
    scantasticApiUrlOverride: process.env.SCANTASTIC_API_URL_OVERRIDE || SCANTASTIC_API_URL_OVERRIDE,
    statsigApiKey: process.env.REACT_APP_STATSIG_API_KEY || process.env.STATSIG_API_KEY || STATSIG_API_KEY,
    statsigProxyUrlOverride: process.env.STATSIG_PROXY_URL_OVERRIDE || STATSIG_PROXY_URL_OVERRIDE,
    tradingApiKey: process.env.REACT_APP_TRADING_API_KEY || process.env.TRADING_API_KEY || TRADING_API_KEY,
    tradingApiUrlOverride:
      process.env.REACT_APP_TRADING_API_URL_OVERRIDE ||
      process.env.TRADING_API_URL_OVERRIDE ||
      TRADING_API_URL_OVERRIDE,
    tradingApiWebTestEnv: process.env.REACT_APP_TRADING_API_TEST_ENV || '',
    liquidityServiceUrlOverride:
      process.env.REACT_APP_LIQUIDITY_SERVICE_URL_OVERRIDE ||
      process.env.LIQUIDITY_SERVICE_URL_OVERRIDE ||
      LIQUIDITY_SERVICE_URL_OVERRIDE,
    lxApiKey: process.env.LX_API_KEY || LX_API_KEY,
    unitagsApiUrlOverride: process.env.UNITAGS_API_URL_OVERRIDE || UNITAGS_API_URL_OVERRIDE,
    lxNotifApiBaseUrlOverride:
      process.env.LX_NOTIF_API_BASE_URL_OVERRIDE || LX_NOTIF_API_BASE_URL_OVERRIDE,
    entryGatewayApiUrlOverride: process.env.ENTRY_GATEWAY_API_URL_OVERRIDE || ENTRY_GATEWAY_API_URL_OVERRIDE,
    walletConnectProjectId:
      process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ||
      process.env.WALLETCONNECT_PROJECT_ID ||
      WALLETCONNECT_PROJECT_ID,
    walletConnectProjectIdBeta: process.env.WALLETCONNECT_PROJECT_ID_BETA || WALLETCONNECT_PROJECT_ID_BETA,
    walletConnectProjectIdDev: process.env.WALLETCONNECT_PROJECT_ID_DEV || WALLETCONNECT_PROJECT_ID_DEV,
  }

  if (isNonTestDev) {
    // biome-ignore lint/suspicious/noConsole: Cannot use logger here, causes error from circular dep
    console.debug('Using app config:', config)
  }

  cachedConfig = Object.freeze(config)
  return cachedConfig
}
