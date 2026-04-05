import { logger } from 'utilities/src/logger/logger'
import { isWebApp } from 'utilities/src/platform'

// only disable for this enum
/**
 * Feature flag names.
 * Add in alphabetical order for each section to decrease probability of merge conflicts.
 */
/* oxlint-disable typescript/prefer-enum-initializers -- preserve the order */
export enum FeatureFlags {
  // Shared
  AllowUniswapXOnlyRoutesInSwapSettings,
  ArbitrumDutchV3,
  BlockaidFotLogging,
  CentralizedPrices,
  ChainedActions,
  DisableSwap7702,
  DisableSessionsForPlan,
  EmbeddedWallet,
  EnablePermitMismatchUX,
  ForceDisableWalletGetCapabilities,
  ForcePermitTransactions,
  ForSessionsEnabled,
  ForUrlMigration,
  GasServiceV2,
  HashcashSolverEnabled,
  Linea,
  Monad,
  MultichainTokenUx,
  NetworkFilterV2,
  NoUniswapInterfaceFees,
  PortionFields,
  ProfitLoss,
  SessionsPerformanceTrackingEnabled,
  SessionsServiceEnabled,
  SessionsUpgradeAutoEnabled,
  SmartWallet,
  SmartWalletDisableVideo,
  Solana,
  Soneium,
  Tempo,
  TurnstileSolverEnabled,
  TwoSecondSwapQuotePollingInterval,
  UniquoteEnabled,
  UniswapWrapped2025,
  UniswapX,
  UniswapXPriorityOrdersBase,
  UniswapXPriorityOrdersOptimism,
  UniswapXPriorityOrdersUnichain,
  ViemProviderEnabled,
  XLayer,

  // Wallet
  BottomTabs,
  DisableFiatOnRampKorea,
  Eip5792Methods,
  EnableExportPrivateKeys,
  EnableRestoreSeedPhrase,
  EnableTransactionSpacingForDelegatedAccounts,
  ExpoImage,

  NotificationApiDataSource,
  NotificationOnboardingCard,
  NotificationService,

  PrivateRpc,
  Scantastic,
  SelfReportSpamNFTs,
  SmartWalletSettings,
  UwULink,

  // Web
  AATestWeb,
  AuctionDetailsV2,
  BatchedSwaps,
  CheckApprovalV2,
  ClaimFeesV2,
  CreatePositionV2,
  DecreasePositionV2,
  DummyFlagTest,
  IncreasePositionV2,
  LimitsFees,
  LiquidityBatchedTransactions,
  LpDynamicNativeSlippage,
  LpIncentives,
  NoUniswapInterfaceFeesNotification,
  PortfolioDefiTab,
  PortoWalletConnector,
  SolanaPromo,
  TDPTokenCarousel,
  ToucanAuctionKYC,
  ToucanLaunchAuction,
  TraceJsonRpc,
  UnificationCopy,
  UnirouteEnabled,
  UniversalSwap,
}
/* oxlint-enable typescript/prefer-enum-initializers */

// These names must match the gate name on statsig.
// Add in alphabetical order to decrease probability of merge conflicts.
export const SHARED_FEATURE_FLAG_NAMES = new Map<FeatureFlags, string>([
  [FeatureFlags.AllowUniswapXOnlyRoutesInSwapSettings, 'allow_uniswapx_only_routes_in_swap_settings'],
  [FeatureFlags.ArbitrumDutchV3, 'uniswapx_dutchv3_orders_arbitrum'],
  [FeatureFlags.BlockaidFotLogging, 'blockaid_fot_logging'],
  [FeatureFlags.CentralizedPrices, 'centralized_prices'],
  [FeatureFlags.ChainedActions, 'enable_chained_actions'],
  [FeatureFlags.DisableSessionsForPlan, 'disable_sessions_for_plan'],
  [FeatureFlags.DisableSwap7702, 'disable-swap-7702'],
  [FeatureFlags.EmbeddedWallet, 'embedded_wallet'],
  [FeatureFlags.EnablePermitMismatchUX, 'enable_permit2_mismatch_ux'],
  [FeatureFlags.ForSessionsEnabled, 'for_sessions_enabled'],
  [FeatureFlags.ForUrlMigration, 'for_url_migration'],
  [FeatureFlags.ForceDisableWalletGetCapabilities, 'force_disable_wallet_get_capabilities'],
  [FeatureFlags.ForcePermitTransactions, 'force_permit_transactions'],
  [FeatureFlags.GasServiceV2, 'gas_service_v2'],
  [FeatureFlags.HashcashSolverEnabled, 'sessions_hashcash_solver_enabled'],
  [FeatureFlags.Linea, 'linea'],
  [FeatureFlags.Monad, 'monad'],
  [FeatureFlags.MultichainTokenUx, 'multichain_token_ux'],
  [FeatureFlags.NetworkFilterV2, 'network_filter_v2'],
  [FeatureFlags.NoUniswapInterfaceFees, 'no_uniswap_interface_fees'],
  [FeatureFlags.NotificationApiDataSource, 'notification_api_data_source'],
  [FeatureFlags.PortionFields, 'portion-fields'],
  [FeatureFlags.ProfitLoss, 'profit_loss'],
  [FeatureFlags.SelfReportSpamNFTs, 'self-report-spam-nfts'],
  [FeatureFlags.SessionsPerformanceTrackingEnabled, 'sessions_performance_tracking_enabled'],
  [FeatureFlags.SessionsServiceEnabled, 'sessions_service_enabled'],
  [FeatureFlags.SessionsUpgradeAutoEnabled, 'sessions_upgrade_auto_enabled'],
  [FeatureFlags.SmartWallet, 'smart-wallet'],
  [FeatureFlags.SmartWalletDisableVideo, 'smart_wallet_disable_video'],
  [FeatureFlags.Solana, 'solana'],
  [FeatureFlags.Soneium, 'soneium'],
  [FeatureFlags.Tempo, 'tempo'],
  [FeatureFlags.TurnstileSolverEnabled, 'sessions_turnstile_solver_enabled'],
  [FeatureFlags.TwoSecondSwapQuotePollingInterval, 'two_second_swap_quote_polling_interval'],
  [FeatureFlags.UniquoteEnabled, 'uniquote_enabled'],
  [FeatureFlags.UnirouteEnabled, 'uniroute_rollout'],
  [FeatureFlags.UniswapWrapped2025, 'uniswap_wrapped_2025'],
  [FeatureFlags.UniswapX, 'uniswapx'],
  [FeatureFlags.UniswapXPriorityOrdersBase, 'uniswapx_priority_orders_base'],
  [FeatureFlags.UniswapXPriorityOrdersOptimism, 'uniswapx_priority_orders_optimism'],
  [FeatureFlags.UniswapXPriorityOrdersUnichain, 'uniswapx_priority_orders_unichain'],
  [FeatureFlags.ViemProviderEnabled, 'viem_provider_enabled'],
  [FeatureFlags.XLayer, 'x_layer'],
])

// These names must match the gate name on statsig.
// Add in alphabetical order to decrease probability of merge conflicts.
export const WEB_FEATURE_FLAG_NAMES = new Map<FeatureFlags, string>([
  ...SHARED_FEATURE_FLAG_NAMES,
  [FeatureFlags.AATestWeb, 'aatest_web'],
  [FeatureFlags.AuctionDetailsV2, 'auction_details_v2'],
  [FeatureFlags.BatchedSwaps, 'batched_swaps'],
  [FeatureFlags.CheckApprovalV2, 'check_approval_v2'],
  [FeatureFlags.ClaimFeesV2, 'claim_fees_v2'],
  [FeatureFlags.CreatePositionV2, 'create_position_v2'],
  [FeatureFlags.DecreasePositionV2, 'decrease_position_v2'],
  [FeatureFlags.DummyFlagTest, 'dummy_flag_test'],
  [FeatureFlags.IncreasePositionV2, 'increase_position_v2'],
  [FeatureFlags.LimitsFees, 'limits_fees'],
  [FeatureFlags.LiquidityBatchedTransactions, 'liquidity_batched_transactions'],
  [FeatureFlags.LpDynamicNativeSlippage, 'lp_dynamic_native_slippage'],
  [FeatureFlags.LpIncentives, 'lp_incentives'],
  [FeatureFlags.NoUniswapInterfaceFeesNotification, 'no_uniswap_interface_fees_notification'],
  [FeatureFlags.PortfolioDefiTab, 'portfolio_defi_tab'],
  [FeatureFlags.PortoWalletConnector, 'porto_wallet_connector'],
  [FeatureFlags.SolanaPromo, 'solana_promo'],
  [FeatureFlags.TDPTokenCarousel, 'tdp_token_carousel'],
  [FeatureFlags.ToucanAuctionKYC, 'toucan_auction_kyc'],
  [FeatureFlags.ToucanLaunchAuction, 'toucan_launch_auction'],
  [FeatureFlags.TraceJsonRpc, 'traceJsonRpc'],
  [FeatureFlags.UnificationCopy, 'unification_copy'],
  [FeatureFlags.UniversalSwap, 'universal_swap'],
])

// These names must match the gate name on statsig.
// Add in alphabetical order to decrease probability of merge conflicts.
export const WALLET_FEATURE_FLAG_NAMES = new Map<FeatureFlags, string>([
  ...SHARED_FEATURE_FLAG_NAMES,
  [FeatureFlags.BottomTabs, 'bottom_tabs'],
  [FeatureFlags.DisableFiatOnRampKorea, 'disable-fiat-onramp-korea'],
  [FeatureFlags.Eip5792Methods, 'eip_5792_methods'],
  [FeatureFlags.EnableExportPrivateKeys, 'enable-export-private-keys'],
  [FeatureFlags.EnableRestoreSeedPhrase, 'enable-restore-seed-phrase'],
  [FeatureFlags.EnableTransactionSpacingForDelegatedAccounts, 'enable_transaction_spacing_for_delegated_accounts'],
  [FeatureFlags.ExpoImage, 'expo_image'],

  [FeatureFlags.NotificationOnboardingCard, 'notification_onboarding_card'],
  [FeatureFlags.NotificationService, 'notification_system'],
  [FeatureFlags.PrivateRpc, 'mev-blocker'],
  [FeatureFlags.Scantastic, 'scantastic'],
  [FeatureFlags.SmartWalletSettings, 'smart_wallet_settings'],
  [FeatureFlags.UwULink, 'uwu-link'],
])

export enum FeatureFlagClient {
  Web = 0,
  Wallet = 1,
}

const FEATURE_FLAG_NAMES = {
  [FeatureFlagClient.Web]: WEB_FEATURE_FLAG_NAMES,
  [FeatureFlagClient.Wallet]: WALLET_FEATURE_FLAG_NAMES,
}

export function getFeatureFlagName(flag: FeatureFlags, client?: FeatureFlagClient): string {
  const names =
    client !== undefined
      ? FEATURE_FLAG_NAMES[client]
      : isWebApp
        ? FEATURE_FLAG_NAMES[FeatureFlagClient.Web]
        : FEATURE_FLAG_NAMES[FeatureFlagClient.Wallet]
  const name = names.get(flag)
  if (!name) {
    const err = new Error(`Feature ${FeatureFlags[flag]} does not have a name mapped for this application`)

    logger.error(err, {
      tags: {
        file: 'flags.ts',
        function: 'getFeatureFlagName',
      },
    })

    throw err
  }

  return name
}
