/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @l.x/api - Unified data layer for Lx Universe
 *
 * This is the ONLY public entry point for the API package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Foundations
export { createFetchClient } from '@l.x/api/src/clients/base/createFetchClient'
export {
  FetchError,
  is401Error,
  is404Error,
  isRateLimitFetchError,
} from '@l.x/api/src/clients/base/errors'
export type {
  CustomOptions,
  FetchClient,
  StandardFetchOptions,
} from '@l.x/api/src/clients/base/types'
export { SharedQueryClient } from '@l.x/api/src/clients/base/SharedQueryClient'

// Constants and URLs
export {
  createHelpArticleUrl,
  DEV_ENTRY_GATEWAY_API_BASE_URL,
  getCloudflareApiBaseUrl,
  getCloudflarePrefix,
  getServicePrefix,
  helpUrl,
  PROD_ENTRY_GATEWAY_API_BASE_URL,
  STAGING_ENTRY_GATEWAY_API_BASE_URL,
  TrafficFlows,
} from '@l.x/api/src/clients/base/urls'

// Auth
export type { AuthData, SignedRequestParams, SignMessageFunc } from '@l.x/api/src/clients/base/auth'
export { createSignedRequestBody, createSignedRequestParams } from '@l.x/api/src/clients/base/auth'

// GraphQL API
export * as GraphQLApi from '@l.x/api/src/clients/graphql/generated'
export {
  useTokenBasicInfoPartsFragment,
  useTokenBasicProjectPartsFragment,
  useTokenMarketPartsFragment,
  useTokenProjectMarketsPartsFragment,
  useTokenProjectUrlsPartsFragment,
} from '@l.x/api/src/clients/graphql/fragments'
export { GQLQueries } from '@l.x/api/src/clients/graphql/queries'
export type { GqlResult } from '@l.x/api/src/clients/graphql/types'
export { isError, isNonPollingRequestInFlight, isWarmLoadingStatus } from '@l.x/api/src/clients/graphql/utils'

// Jupiter API
export {
  createJupiterApiClient,
  type JupiterApiClient,
} from '@l.x/api/src/clients/jupiter/createJupiterApiClient'
export type {
  JupiterExecuteResponse,
  JupiterOrderResponse,
  JupiterExecuteUrlParams,
  JupiterOrderUrlParams,
} from '@l.x/api/src/clients/jupiter/types'
export {
  jupiterExecuteResponseSchema,
  jupiterOrderResponseSchema,
} from '@l.x/api/src/clients/jupiter/types'

// Blockaid API
export {
  createBlockaidApiClient,
  type BlockaidApiClient,
} from '@l.x/api/src/clients/blockaid/createBlockaidApiClient'
export {
  getBlockaidScanSiteResponseSchema,
  getBlockaidScanTransactionRequestSchema,
  getBlockaidScanTransactionResponseSchema,
  getBlockaidScanJsonRpcRequestSchema,
  DappVerificationStatus,
  type BlockaidScanSiteRequest,
  type BlockaidScanSiteResponse,
  type BlockaidScanSiteHitResponse,
  type BlockaidScanSiteMissResponse,
  type BlockaidScanTransactionRequest,
  type BlockaidScanTransactionResponse,
  type BlockaidScanJsonRpcRequest,
  type BlockaidScanJsonRpcResponse,
} from '@l.x/api/src/clients/blockaid/types'

// Trading API
export * as TradingApi from '@l.x/api/src/clients/trading/__generated__'
export {
  createTradingApiClient,
  type TradingApiClient,
  type TradingClientContext,
} from '@l.x/api/src/clients/trading/createTradingApiClient'
export {
  type BridgeQuoteResponse,
  type ChainedQuoteResponse,
  type ClassicQuoteResponse,
  type DiscriminatedQuoteResponse,
  type DutchQuoteResponse,
  type DutchV3QuoteResponse,
  type ExistingPlanRequest,
  type PriorityQuoteResponse,
  type SwappableTokensParams,
  type UnwrapQuoteResponse,
  type UpdatePlanRequestWithPlanId,
  type WrapQuoteResponse,
} from '@l.x/api/src/clients/trading/tradeTypes'
export {
  FeeType,
  type FormattedLxSwapGasFeeInfo,
  type GasEstimate,
  type GasEstimateEip1559,
  type GasEstimateLegacy,
  type GasFeeResponse,
  type GasFeeResult,
  type GasFeeResultWithoutState,
  type GasStrategy,
  type TransactionEip1559FeeParams,
  type TransactionLegacyFeeParams,
} from '@l.x/api/src/clients/trading/types'

// Liquidity Service API
export {
  createLiquidityServiceClient,
  type LiquidityServiceClient,
} from '@l.x/api/src/clients/liquidity/createLiquidityServiceClient'
export {
  createAuctionMutationClient,
  type AuctionMutationClient,
} from '@l.x/api/src/clients/liquidity/createAuctionMutationClient'

// Auction Service API
export {
  createAuctionServiceClient,
  type AuctionServiceClient,
} from '@l.x/api/src/clients/auctions/createAuctionServiceClient'

// X Verification Service API
export {
  createXVerificationServiceClient,
  type XVerificationServiceClient,
} from '@l.x/api/src/clients/x/createXVerificationServiceClient'

// Lx API
export {
  createLxApiClient,
  type LxApiClient,
  type LxApiClientContext,
} from '@l.x/api/src/clients/lx/createLxApiClient'

// Compliance API
export {
  createComplianceApiClient,
  type ComplianceApiClient,
  type ComplianceApiClientContext,
  type ScreenRequest,
  type ScreenResponse,
} from '@l.x/api/src/clients/compliance/createComplianceApiClient'

// Unitags API
export {
  type ProfileMetadata,
  type UnitagAddressesRequest,
  type UnitagAddressesResponse,
  type UnitagAddressRequest,
  type UnitagAddressResponse,
  type UnitagAvatarUploadCredentials,
  type UnitagChangeUsernameRequestBody,
  type UnitagClaim,
  type UnitagClaimContext,
  type UnitagClaimEligibilityRequest,
  type UnitagClaimEligibilityResponse,
  type UnitagClaimSource,
  type UnitagClaimUsernameRequestBody,
  type UnitagDeleteUsernameRequestBody,
  UnitagErrorCodes,
  type UnitagGetAvatarUploadUrlResponse,
  type UnitagResponse,
  type UnitagUpdateMetadataRequestBody,
  type UnitagUpdateMetadataResponse,
  type UnitagUsernameRequest,
  type UnitagUsernameResponse,
} from '@l.x/api/src/clients/unitags/types'
export { createUnitagsApiClient } from '@l.x/api/src/clients/unitags/createUnitagsApiClient'

// Gas Service API (ConnectRPC - estimateGasFee via UniRPC v2)
export {
  createGasServiceClient,
  type GasServiceClient,
  type GasServiceClientContext,
} from '@l.x/api/src/clients/gasService/createGasServiceClient'
export type {
  EstimateGasFeeRequest as GasServiceEstimateRequest,
  EstimateGasFeeResponse as GasServiceEstimateResponse,
} from '@luxamm/client-unirpc-v2/dist/uniswap/unirpc/v2/service_pb'

// Data API Service (ConnectRPC - listTopTokens, listTopPools, getPortfolio, etc.)
export {
  createDataApiServiceClient,
  type DataApiServiceClient,
  type DataApiServiceClientContext,
} from '@l.x/api/src/clients/dataApi/createDataApiServiceClient'
export {
  getGetPortfolioQueryOptions,
  type GetPortfolioQueryParams,
} from '@l.x/api/src/clients/dataApi/getGetPortfolioQueryOptions'
export {
  TopPoolsOrderBy,
  TokensOrderBy,
  type GetPortfolioRequest,
  type GetPortfolioResponse,
  type ListTopPoolsResponse,
  type ListTokensResponse,
} from '@luxamm/client-data-api/dist/data/v1/api_pb'
export { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
export { type Pool as DataApiPool, type Token as DataApiToken } from '@luxamm/client-data-api/dist/data/v1/types_pb'

// Data Service API
export {
  createDataServiceApiClient,
  type DataServiceApiClient,
  type DataServiceApiClientContext,
  TokenReportEventType,
  ReportAssetType,
} from '@l.x/api/src/clients/data/createDataServiceApiClient'

// Notifications API
export { createNotificationsApiClient } from '@l.x/api/src/clients/notifications/createNotificationsApiClient'
export { BackgroundType, ContentStyle, OnClickAction } from '@l.x/api/src/clients/notifications/types'
export type {
  AckNotificationRequest,
  AckNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  InAppNotification,
  NotificationsApiClient,
  NotificationsClientContext,
} from '@l.x/api/src/clients/notifications/types'

// FOR (Fiat On-Ramp) API
export {
  createForApiClient,
  type ForApiClient,
} from '@l.x/api/src/clients/for/createForApiClient'
export { transformPaymentMethods } from '@l.x/api/src/clients/for/utils'
export type {
  FORCountry,
  FORLogo,
  FORQuote,
  FORQuoteResponse,
  FORServiceProvider,
  FORSupportedFiatCurrency,
  FORSupportedToken,
  FORTransaction,
} from '@l.x/api/src/clients/for/types'
// Re-export FOR protobuf types for consumer packages
export {
  RampDirection,
  TransactionStatus as FORTransactionStatus,
  GetCountryResponse,
  OffRampTransferDetailsRequest,
  OffRampTransferDetailsResponse,
  OffRampWidgetUrlRequest,
  QuoteRequest,
  SupportedCountriesRequest,
  SupportedCountriesResponse,
  SupportedFiatCurrenciesRequest,
  SupportedFiatCurrenciesResponse,
  SupportedTokensRequest,
  SupportedTokensResponse,
  TransactionRequest,
  TransactionResponse,
  TransferServiceProvidersResponse,
  TransferWidgetUrlRequest,
  WidgetUrlRequest,
  WidgetUrlResponse,
} from '@luxamm/client-for/dist/for/v1/api_pb'

// ConnectRPC API
export {
  ALL_NETWORKS_ARG,
  createConnectTransportWithDefaults,
  type ConnectRpcContext,
} from '@l.x/api/src/connectRpc/base'
export {
  parseProtectionInfo,
  parseRestProtocolVersion,
  parseSafetyLevel,
  transformInput,
  type WithoutWalletAccount,
} from '@l.x/api/src/connectRpc/utils'

// Conversion Tracking API
export * as ConversionTrackingApi from '@l.x/api/src/clients/conversionTracking'

// Embedded Wallet API
export {
  createEmbeddedWalletApiClient,
  type EmbeddedWalletApiClient,
  type EmbeddedWalletClientContext,
  type RecoveryMethod,
  type SignAuth,
} from '@l.x/api/src/clients/embeddedWallet/createEmbeddedWalletApiClient'

// Other Utilities
export {
  createFetcher,
  objectToQueryString,
} from '@l.x/api/src/clients/base/utils'

// Session API
export { ApiInit, reinitializeSession, SESSION_INIT_QUERY_KEY } from '@l.x/api/src/components/ApiInit'
export { provideSessionService } from '@l.x/api/src/provideSessionService'
export { useIsSessionInitialized } from '@l.x/api/src/hooks/useIsSessionInitialized'

// Session Transport (pure factory, no platform detection)
export { createSessionTransport, type CreateSessionTransportOptions } from '@l.x/api/src/session'
export { createWithSessionRetry } from '@l.x/api/src/session/createWithSessionRetry'

export type {
  UseQueryApiHelperHookArgs,
  UseQueryWithImmediateGarbageCollectionApiHelperHookArgs,
} from '@l.x/api/src/hooks/shared/types'
export { useQueryWithImmediateGarbageCollection } from '@l.x/api/src/hooks/shared/useQueryWithImmediateGarbageCollection'

// Other Types
export {
  CustomRankingType,
  RankingType,
  SpamCode,
} from '@l.x/api/src/clients/content/types'

export { getTransport } from '@l.x/api/src/transport'

export { getEntryGatewayUrl, getMigratedForApiUrl } from '@l.x/api/src/getEntryGatewayUrl'

export { getWebSocketUrl } from '@l.x/api/src/getWebSocketUrl'

export { provideLxIdentifierService } from '@l.x/api/src/provideLxIdentifierService'

export const provideLuxIdentifierService = provideLxIdentifierService
