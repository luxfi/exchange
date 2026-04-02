/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @luxexchange/api - Unified data layer for Lx Universe
 *
 * This is the ONLY public entry point for the API package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Foundations
export { createFetchClient } from '@luxexchange/api/src/clients/base/createFetchClient'
export {
  FetchError,
  is401Error,
  is404Error,
  isRateLimitFetchError,
} from '@luxexchange/api/src/clients/base/errors'
export type {
  CustomOptions,
  FetchClient,
  StandardFetchOptions,
} from '@luxexchange/api/src/clients/base/types'
export { SharedQueryClient } from '@luxexchange/api/src/clients/base/SharedQueryClient'

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
} from '@luxexchange/api/src/clients/base/urls'

// Auth
export type { AuthData, SignedRequestParams, SignMessageFunc } from '@luxexchange/api/src/clients/base/auth'
export { createSignedRequestBody, createSignedRequestParams } from '@luxexchange/api/src/clients/base/auth'

// GraphQL API
export * as GraphQLApi from '@luxexchange/api/src/clients/graphql/generated'
export {
  useTokenBasicInfoPartsFragment,
  useTokenBasicProjectPartsFragment,
  useTokenMarketPartsFragment,
  useTokenProjectMarketsPartsFragment,
  useTokenProjectUrlsPartsFragment,
} from '@luxexchange/api/src/clients/graphql/fragments'
export { GQLQueries } from '@luxexchange/api/src/clients/graphql/queries'
export type { GqlResult } from '@luxexchange/api/src/clients/graphql/types'
export { isError, isNonPollingRequestInFlight, isWarmLoadingStatus } from '@luxexchange/api/src/clients/graphql/utils'

// Jupiter API
export {
  createJupiterApiClient,
  type JupiterApiClient,
} from '@luxexchange/api/src/clients/jupiter/createJupiterApiClient'
export type {
  JupiterExecuteResponse,
  JupiterOrderResponse,
  JupiterExecuteUrlParams,
  JupiterOrderUrlParams,
} from '@luxexchange/api/src/clients/jupiter/types'
export {
  jupiterExecuteResponseSchema,
  jupiterOrderResponseSchema,
} from '@luxexchange/api/src/clients/jupiter/types'

// Blockaid API
export {
  createBlockaidApiClient,
  type BlockaidApiClient,
} from '@luxexchange/api/src/clients/blockaid/createBlockaidApiClient'
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
} from '@luxexchange/api/src/clients/blockaid/types'

// Trading API
export * as TradingApi from '@luxexchange/api/src/clients/trading/__generated__'
export {
  createTradingApiClient,
  type TradingApiClient,
  type TradingClientContext,
} from '@luxexchange/api/src/clients/trading/createTradingApiClient'
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
} from '@luxexchange/api/src/clients/trading/tradeTypes'
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
} from '@luxexchange/api/src/clients/trading/types'

// Liquidity Service API
export {
  createLiquidityServiceClient,
  type LiquidityServiceClient,
} from '@luxexchange/api/src/clients/liquidity/createLiquidityServiceClient'
export {
  createAuctionMutationClient,
  type AuctionMutationClient,
} from '@luxexchange/api/src/clients/liquidity/createAuctionMutationClient'

// Auction Service API
export {
  createAuctionServiceClient,
  type AuctionServiceClient,
} from '@luxexchange/api/src/clients/auctions/createAuctionServiceClient'

// X Verification Service API
export {
  createXVerificationServiceClient,
  type XVerificationServiceClient,
} from '@luxexchange/api/src/clients/x/createXVerificationServiceClient'

// Lx API
export {
  createLxApiClient,
  type LxApiClient,
  type LxApiClientContext,
} from '@luxexchange/api/src/clients/lx/createLxApiClient'

// Compliance API
export {
  createComplianceApiClient,
  type ComplianceApiClient,
  type ComplianceApiClientContext,
  type ScreenRequest,
  type ScreenResponse,
} from '@luxexchange/api/src/clients/compliance/createComplianceApiClient'

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
} from '@luxexchange/api/src/clients/unitags/types'
export { createUnitagsApiClient } from '@luxexchange/api/src/clients/unitags/createUnitagsApiClient'

// Gas Service API (ConnectRPC - estimateGasFee via UniRPC v2)
export {
  createGasServiceClient,
  type GasServiceClient,
  type GasServiceClientContext,
} from '@luxexchange/api/src/clients/gasService/createGasServiceClient'
export type {
  EstimateGasFeeRequest as GasServiceEstimateRequest,
  EstimateGasFeeResponse as GasServiceEstimateResponse,
} from '@luxamm/client-unirpc-v2/dist/lx/unirpc/v2/service_pb'

// Data API Service (ConnectRPC - listTopTokens, listTopPools, getPortfolio, etc.)
export {
  createDataApiServiceClient,
  type DataApiServiceClient,
  type DataApiServiceClientContext,
} from '@luxexchange/api/src/clients/dataApi/createDataApiServiceClient'
export {
  getGetPortfolioQueryOptions,
  type GetPortfolioQueryParams,
} from '@luxexchange/api/src/clients/dataApi/getGetPortfolioQueryOptions'
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
} from '@luxexchange/api/src/clients/data/createDataServiceApiClient'

// Notifications API
export { createNotificationsApiClient } from '@luxexchange/api/src/clients/notifications/createNotificationsApiClient'
export { BackgroundType, ContentStyle, OnClickAction } from '@luxexchange/api/src/clients/notifications/types'
export type {
  AckNotificationRequest,
  AckNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  InAppNotification,
  NotificationsApiClient,
  NotificationsClientContext,
} from '@luxexchange/api/src/clients/notifications/types'

// FOR (Fiat On-Ramp) API
export {
  createForApiClient,
  type ForApiClient,
} from '@luxexchange/api/src/clients/for/createForApiClient'
export { transformPaymentMethods } from '@luxexchange/api/src/clients/for/utils'
export type {
  FORCountry,
  FORLogo,
  FORQuote,
  FORQuoteResponse,
  FORServiceProvider,
  FORSupportedFiatCurrency,
  FORSupportedToken,
  FORTransaction,
} from '@luxexchange/api/src/clients/for/types'
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
} from '@luxexchange/api/src/connectRpc/base'
export {
  parseProtectionInfo,
  parseRestProtocolVersion,
  parseSafetyLevel,
  transformInput,
  type WithoutWalletAccount,
} from '@luxexchange/api/src/connectRpc/utils'

// Conversion Tracking API
export * as ConversionTrackingApi from '@luxexchange/api/src/clients/conversionTracking'

// Embedded Wallet API
export {
  createEmbeddedWalletApiClient,
  type EmbeddedWalletApiClient,
  type EmbeddedWalletClientContext,
  type RecoveryMethod,
  type SignAuth,
} from '@luxexchange/api/src/clients/embeddedWallet/createEmbeddedWalletApiClient'

// Other Utilities
export {
  createFetcher,
  objectToQueryString,
} from '@luxexchange/api/src/clients/base/utils'

// Session API
export { ApiInit, reinitializeSession, SESSION_INIT_QUERY_KEY } from '@luxexchange/api/src/components/ApiInit'
export { provideSessionService } from '@luxexchange/api/src/provideSessionService'
export { useIsSessionInitialized } from '@luxexchange/api/src/hooks/useIsSessionInitialized'

// Session Transport (pure factory, no platform detection)
export { createSessionTransport, type CreateSessionTransportOptions } from '@luxexchange/api/src/session'
export { createWithSessionRetry } from '@luxexchange/api/src/session/createWithSessionRetry'

export type {
  UseQueryApiHelperHookArgs,
  UseQueryWithImmediateGarbageCollectionApiHelperHookArgs,
} from '@luxexchange/api/src/hooks/shared/types'
export { useQueryWithImmediateGarbageCollection } from '@luxexchange/api/src/hooks/shared/useQueryWithImmediateGarbageCollection'

// Other Types
export {
  CustomRankingType,
  RankingType,
  SpamCode,
} from '@luxexchange/api/src/clients/content/types'

export { getTransport } from '@luxexchange/api/src/transport'

export { getEntryGatewayUrl, getMigratedForApiUrl } from '@luxexchange/api/src/getEntryGatewayUrl'

export { getWebSocketUrl } from '@luxexchange/api/src/getWebSocketUrl'

export { provideLxIdentifierService } from '@luxexchange/api/src/provideLxIdentifierService'

export const provideLuxIdentifierService = provideLxIdentifierService
