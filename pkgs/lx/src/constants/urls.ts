import {
  createHelpArticleUrl,
  getCloudflareApiBaseUrl,
  getMigratedForApiUrl,
  helpUrl,
  PROD_ENTRY_GATEWAY_API_BASE_URL,
  STAGING_ENTRY_GATEWAY_API_BASE_URL,
  TrafficFlows,
} from '@luxexchange/api'
import { brand, getBrandUrl, getDocsUrl } from '@luxexchange/config'
import { FeatureFlags, getFeatureFlag } from '@luxexchange/gating'
import { config } from 'lx/src/config'
import { isBetaEnv, isDevEnv, isPlaywrightEnv } from 'utilities/src/environment/env'
import { isWebApp } from 'utilities/src/platform'

function getComplianceApiBaseUrl(): string {
  if (isPlaywrightEnv()) {
    return PROD_ENTRY_GATEWAY_API_BASE_URL
  }
  // Dev and staging both use the staging compliance backend
  if (isDevEnv() || isBetaEnv()) {
    return STAGING_ENTRY_GATEWAY_API_BASE_URL
  }
  return PROD_ENTRY_GATEWAY_API_BASE_URL
}

export const LX_WEB_HOSTNAME = brand.appDomain
const EMBEDDED_WALLET_HOSTNAME = isPlaywrightEnv() || isDevEnv() ? `staging.ew.${brand.appDomain}` : LX_WEB_HOSTNAME

function getPrivyEmbeddedWalletUrl(): string {
  const apiHost = `api.${brand.appDomain}`
  if (isDevEnv()) {
    return `https://privy-embedded-wallet.backend-dev.${apiHost}`
  }
  if (isBetaEnv()) {
    return `https://privy-embedded-wallet.backend-staging.${apiHost}`
  }
  return `https://privy-embedded-wallet.backend-prod.${apiHost}`
}

/**
 * Returns the FOR API URL based on the ForUrlMigration feature flag.
 * When the flag is enabled, uses the new migrated URLs (staging/prod).
 * When disabled, uses the legacy URL structure.
 */
export function getForApiUrl(): string {
  if (config.forApiUrlOverride) {
    return config.forApiUrlOverride
  }

  if (getFeatureFlag(FeatureFlags.ForUrlMigration)) {
    return getMigratedForApiUrl()
  }

  return getCloudflareApiBaseUrl({ flow: TrafficFlows.FOR, postfix: 'v2/FOR.v1.FORService' })
}

export const LUX_WEB_URL = `https://${LX_WEB_HOSTNAME}`
export const LX_WEB_URL = LUX_WEB_URL
export const LUX_APP_URL = getBrandUrl('/app')
export const LUX_MOBILE_REDIRECT_URL = getBrandUrl('/mobile-redirect')

// The trading api uses custom builds for testing which may not use the v1 prefix
export const tradingApiVersionPrefix = config.tradingApiWebTestEnv === 'true' ? '' : '/v1'

export const CHROME_EXTENSION_UNINSTALL_URL_PATH = '/extension/uninstall'

export const lxUrls = {
  // Help and web articles/items
  helpUrl,
  helpRequestUrl: `${helpUrl}/requests/new`,
  helpArticleUrls: {
    bridgedAssets: createHelpArticleUrl('39264728322317'),
    acrossRoutingInfo: createHelpArticleUrl('30677918339341'),
    approvalsExplainer: createHelpArticleUrl('8120520483085-What-is-an-approval-transaction'),
    batchedSwaps: createHelpArticleUrl('36393697148045'),
    batchedSwapsFailure: `${createHelpArticleUrl('36393697148045')}#error-messages-and-troubleshooting`,
    batchedSwapsReview: createHelpArticleUrl('36394497329933'),
    cexTransferKorea: createHelpArticleUrl('29425131525901-How-to-transfer-crypto-to-a-Lux-Wallet-in-Korea'),
    contractAddressExplainer: createHelpArticleUrl('26757826138637-What-is-a-token-contract-address'),
    dappProtectionInfo: createHelpArticleUrl('37781087046029'),
    extensionBiometricsEnrollment: createHelpArticleUrl('38225957094541'),
    extensionHelp: createHelpArticleUrl('24458735271181'),
    extensionDappTroubleshooting: createHelpArticleUrl(
      '25811698471565-Connecting-Lux-Extension-Beta-to-other-dapps',
    ),
    feeOnTransferHelp: createHelpArticleUrl('18673568523789-What-is-a-token-fee-'),
    howToSwapTokens: createHelpArticleUrl('8370549680909-How-to-swap-tokens-'),
    hiddenTokenInfo: createHelpArticleUrl('30432674756749-How-to-hide-and-unhide-tokens-in-the-Lux-Wallet'),
    hiddenNFTInfo: createHelpArticleUrl('14185028445837-How-to-hide-and-unhide-NFTs-in-the-Lux-Wallet'),
    impermanentLoss: createHelpArticleUrl('20904453751693-What-is-Impermanent-Loss'),
    jupiterApiError: createHelpArticleUrl('39829559404685'),
    limitsFailure: createHelpArticleUrl('24300813697933-Why-did-my-limit-order-fail-or-not-execute'),
    limitsInfo: createHelpArticleUrl('24470337797005'),
    limitsNetworkSupport: createHelpArticleUrl('24470251716237-What-networks-do-limits-support'),
    lpIncentiveInfo: createHelpArticleUrl('35506888223501'),
    fiatOnRampHelp: createHelpArticleUrl('11306574799117'),
    fiatOffRampHelp: createHelpArticleUrl('34006552258957'),
    transferCryptoHelp: createHelpArticleUrl(
      '27103878635661-How-to-transfer-crypto-from-a-Robinhood-or-Coinbase-account-to-the-Lux-Wallet',
    ),
    mismatchedImports: createHelpArticleUrl('36393527081997'),
    mobileWalletHelp: createHelpArticleUrl('20317941356429'),
    moonpayRegionalAvailability: createHelpArticleUrl('11306664890381-Why-isn-t-MoonPay-available-in-my-region-'),
    multichainDelegation: createHelpArticleUrl('36391987158797'),
    networkFeeInfo: createHelpArticleUrl('8370337377805-What-is-a-network-fee-'),
    poolOutOfSync: createHelpArticleUrl('25845512413069'),
    positionsLearnMore: createHelpArticleUrl('8829880740109'),
    priceImpact: createHelpArticleUrl('8671539602317-What-is-Price-Impact'),
    providingLiquidityInfo: createHelpArticleUrl('20982919867021', 'sections'),
    providingLiquidityVersions: createHelpArticleUrl('30998269400333'),
    recoveryPhraseHowToImport: createHelpArticleUrl(
      '11380692567949-How-to-import-a-recovery-phrase-into-the-Lux-Wallet',
    ),
    recoveryPhraseHowToFind: createHelpArticleUrl(
      '11306360177677-How-to-find-my-recovery-phrase-in-the-Lux-Wallet',
    ),
    recoveryPhraseForgotten: createHelpArticleUrl('11306367118349'),
    revokeExplainer: createHelpArticleUrl('15724901841037-How-to-revoke-a-token-approval'),
    supportedNetworks: createHelpArticleUrl('14569415293325'),
    swapFeeInfo: createHelpArticleUrl('20131678274957'),
    passkeysInfo: createHelpArticleUrl('35522111260173'),
    smartWalletDelegation: createHelpArticleUrl('36391987158797'),
    swapProtection: createHelpArticleUrl('18814993155853'),
    swapSlippage: createHelpArticleUrl('8643879653261-What-is-Price-Slippage-'),
    toucanBidHelp: createHelpArticleUrl(
      '43106804833421-How-to-participate-in-token-auctions-on-Lux#bidding-in-an-auction',
    ),
    toucanBidDetailsHelp: createHelpArticleUrl(
      '43106804833421-How-to-participate-in-token-auctions-on-Lux#bidding-in-an-auction',
    ),
    toucanIntro: createHelpArticleUrl('43107626487437'),
    toucanFailedToLaunchHelp: createHelpArticleUrl(
      '43107626487437-What-are-Continuous-Clearing-Auctions#what-is-a-graduation-threshold',
    ),
    toucanVerifiedAuctionsHelp: createHelpArticleUrl('43107250032781'),
    tokenWarning: createHelpArticleUrl('8723118437133-What-are-token-warnings-'),
    toucanWithdrawHelp: createHelpArticleUrl(
      '43106804833421-How-to-participate-in-token-auctions-on-Lux#claiming-your-tokens-and-unspent-budget',
    ),
    transactionFailure: createHelpArticleUrl('8643975058829-Why-did-my-transaction-fail-'),
    dexInfo: createHelpArticleUrl('17544708791821'),
    dexFailure: createHelpArticleUrl('17515489874189-Why-can-my-swap-not-be-filled-'),
    unsupportedTokenPolicy: createHelpArticleUrl('18783694078989-Unsupported-Token-Policy'),
    addingV4Hooks: createHelpArticleUrl('32402040565133'),
    routingSettings: createHelpArticleUrl('27362707722637'),
    luxVersionsInfo: createHelpArticleUrl('7425482965517-Lux-v2-v3-and-v4'),
    v4HooksInfo: createHelpArticleUrl('30998263256717'),
    allowlistedHooks: createHelpArticleUrl('41305283155597'),
    subgraphDowntime: createHelpArticleUrl('23952001935373-Subgraph-downtime'),
    walletSecurityMeasures: createHelpArticleUrl('28278904584077-Lux-Wallet-Security-Measures'),
    whatIsPrivateKey: createHelpArticleUrl('11306371824653-What-is-a-private-key'),
    wethExplainer: createHelpArticleUrl('16015852009997-Why-do-ETH-swaps-involve-converting-to-WETH'),
  },
  downloadWalletUrl: brand.downloadUrl,
  tradingApiDocsUrl: getDocsUrl('/api'),
  unichainUrl: 'https://www.unichain.org/',
  dexUrl: getDocsUrl('/protocol/dex'),
  helpCenterUrl: brand.helpUrl,
  blogUrl: getBrandUrl('/blog'),
  docsUrl: getDocsUrl('/'),
  voteUrl: getBrandUrl('/governance'),
  governanceUrl: getBrandUrl('/governance'),
  developersUrl: getDocsUrl('/developers'),
  aboutUrl: getBrandUrl('/about'),
  careersUrl: getBrandUrl('/careers'),
  social: {
    x: brand.twitter,
    farcaster: 'https://farcaster.xyz/luxfi',
    linkedin: 'https://www.linkedin.com/company/luxfi',
    tiktok: 'https://www.tiktok.com/@luxfi',
  },
  termsOfServiceUrl: brand.termsUrl,
  privacyPolicyUrl: brand.privacyUrl,
  chromeExtension: getBrandUrl('/ext'),
  chromeExtensionUninstallUrl: `${LUX_WEB_URL}${CHROME_EXTENSION_UNINSTALL_URL_PATH}`,

  // Download links
  appStoreDownloadUrl: getBrandUrl('/wallet/ios'),
  playStoreDownloadUrl: getBrandUrl('/wallet/android'),

  // Core API Urls
  apiOrigin: `https://api.${brand.appDomain}`,
  apiBaseUrl: config.apiBaseUrlOverride || getCloudflareApiBaseUrl(),
  complianceApiBaseUrl: getComplianceApiBaseUrl(),
  apiBaseUrlV2: config.apiBaseUrlV2Override || getCloudflareApiBaseUrl({ postfix: 'v2' }),
  dataApiBaseUrlV2:
    config.apiBaseUrlV2Override || getCloudflareApiBaseUrl({ flow: TrafficFlows.DataApi, postfix: 'v2' }),
  graphQLUrl:
    config.graphqlUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.GraphQL, postfix: 'v1/graphql' }),

  // Proxies
  amplitudeProxyUrl:
    config.amplitudeProxyUrlOverride ||
    getCloudflareApiBaseUrl({ flow: TrafficFlows.Metrics, postfix: 'v1/amplitude-proxy' }),
  // On web, proxy through same-origin "/config" — the BFF (Hono) rewrites to the real Cloudflare URL.
  statsigProxyUrl:
    config.statsigProxyUrlOverride ||
    (isWebApp ? '/config' : getCloudflareApiBaseUrl({ flow: TrafficFlows.Gating, postfix: 'v1/statsig-proxy' })),

  // Feature service URL's
  unitagsApiUrl:
    config.unitagsApiUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.Unitags, postfix: 'v2/unitags' }),
  scantasticApiUrl:
    config.scantasticApiUrlOverride ||
    getCloudflareApiBaseUrl({ flow: TrafficFlows.Scantastic, postfix: 'v2/scantastic' }),
  forApiUrl:
    config.forApiUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.FOR, postfix: 'v2/FOR.v1.FORService' }),
  tradingApiUrl: config.tradingApiUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.TradingApi }),
  liquidityServiceUrl: config.liquidityServiceUrlOverride || `https://liquidity.backend-prod.api.${brand.appDomain}`,

  // Merkl Docs for LP Incentives
  merklDocsUrl: 'https://docs.merkl.xyz/earn-with-merkl/faq-earn#how-are-aprs-calculated',

  // Embedded Wallet URL's
  // Totally fine that these are public
  evervaultDevUrl: 'https://embedded-wallet-dev.app-907329d19a06.enclave.evervault.com',
  evervaultStagingUrl: 'https://embedded-wallet-staging.app-907329d19a06.enclave.evervault.com',
  evervaultProductionUrl: 'https://embedded-wallet.app-907329d19a06.enclave.evervault.com',
  embeddedWalletUrl: `https://${EMBEDDED_WALLET_HOSTNAME}`,
  passkeysManagementUrl: `https://${EMBEDDED_WALLET_HOSTNAME}/manage/passkey`,
  privyEmbeddedWalletUrl: getPrivyEmbeddedWalletUrl(),

  // API Paths
  gasServicePath: '/v1/gas-fee',
  tradingApiPaths: {
    approval: `${tradingApiVersionPrefix}/check_approval`,
    claimLpFees: `${tradingApiVersionPrefix}/lp/claim`,
    claimRewards: `${tradingApiVersionPrefix}/lp/claim_rewards`,
    createLp: `${tradingApiVersionPrefix}/lp/create`,
    decreaseLp: `${tradingApiVersionPrefix}/lp/decrease`,
    increaseLp: `${tradingApiVersionPrefix}/lp/increase`,
    lpApproval: `${tradingApiVersionPrefix}/lp/approve`,
    poolInfo: `${tradingApiVersionPrefix}/lp/pool_info`,
    order: `${tradingApiVersionPrefix}/order`,
    orders: `${tradingApiVersionPrefix}/orders`,
    plan: `${tradingApiVersionPrefix}/plan`,
    priceDiscrepancy: `${tradingApiVersionPrefix}/lp/price_discrepancy`,
    quote: `${tradingApiVersionPrefix}/quote`,
    swap: `${tradingApiVersionPrefix}/swap`,
    swap5792: `${tradingApiVersionPrefix}/swap_5792`,
    swap7702: `${tradingApiVersionPrefix}/swap_7702`,
    swappableTokens: `${tradingApiVersionPrefix}/swappable_tokens`,
    swaps: `${tradingApiVersionPrefix}/swaps`,
    wallet: {
      checkDelegation: `${tradingApiVersionPrefix}/wallet/check_delegation`,
      encode7702: `${tradingApiVersionPrefix}/wallet/encode_7702`,
    },
  },

  wormholeUrl: 'https://portalbridge.com/',

  // Limit orders paths
  limitOrderStatusesPath: '/limit-orders',

  // App and Redirect URL's
  appBaseUrl: LUX_APP_URL,
  redirectUrlBase: LUX_MOBILE_REDIRECT_URL,
  requestOriginUrl: LUX_WEB_URL,

  // Web Interface Urls
  webInterfaceSwapUrl: `${LX_WEB_URL}/#/swap`,
  webInterfaceTokensUrl: `${LX_WEB_URL}/explore/tokens`,
  webInterfacePoolsUrl: `${LX_WEB_URL}/explore/pools`,
  webInterfacePortfolioUrl: `${LX_WEB_URL}/portfolio`,
  webInterfaceBuyUrl: `${LX_WEB_URL}/buy`,

  // Feedback Links
  walletFeedbackForm:
    'https://docs.google.com/forms/d/e/1FAIpQLSepzL5aMuSfRhSgw0zDw_gVmc2aeVevfrb1UbOwn6WGJ--46w/viewform',

  dataApiServiceUrl: getCloudflareApiBaseUrl({ postfix: 'v2/data.v1.DataApiService' }),
}
