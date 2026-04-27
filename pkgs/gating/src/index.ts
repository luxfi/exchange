// Local-only gating. Telemetry and remote feature flags moved to
// `@hanzo/analytics` + `@hanzo/insights`. This package is the seam consumers
// import from — every hook returns the caller's default value so gates are
// off and experiments resolve to their default branch.

export type {
  DatadogIgnoredErrorsValType,
  DatadogSessionSampleRateValType,
  DynamicConfigKeys,
  ForceUpgradeStatus,
  ForceUpgradeTranslations,
  GasStrategies,
  GasStrategyType,
  GasStrategyWithConditions,
  UwULinkAllowlist,
  UwULinkAllowlistItem,
} from '@l.x/gating/src/configs'
export {
  AllowedV4WethHookAddressesConfigKey,
  BlockedAsyncSubmissionChainIdsConfigKey,
  ChainsConfigKey,
  CreateAuctionConfigKey,
  DatadogIgnoredErrorsConfigKey,
  DatadogSessionSampleRateKey,
  DynamicConfigs,
  EmbeddedWalletBetaPassphrasesKey,
  EmbeddedWalletConfigKey,
  ExtensionBiometricUnlockConfigKey,
  ExternallyConnectableExtensionConfigKey,
  ForceUpgradeConfigKey,
  HomeScreenExploreTokensConfigKey,
  LPConfigKey,
  NetworkRequestsConfigKey,
  OnDeviceRecoveryConfigKey,
  OutageBannerChainIdConfigKey,
  SwapConfigKey,
  SyncTransactionSubmissionChainIdsConfigKey,
  UwuLinkConfigKey,
  VerifiedAuctionsConfigKey,
} from '@l.x/gating/src/configs'
export type { ExperimentProperties } from '@l.x/gating/src/experiments'
export {
  EthAsErc20DEXProperties,
  EthAsErc20DEXProperties as EthAsErc20UniswapXProperties,
  Experiments,
  ExploreBackendSortingProperties,
  LayerProperties,
  Layers,
  NativeTokenPercentageBufferProperties,
  PrivateRpcProperties,
  UnichainFlashblocksProperties,
} from '@l.x/gating/src/experiments'
export {
  FeatureFlagClient,
  FeatureFlags,
  getFeatureFlagName,
  WALLET_FEATURE_FLAG_NAMES,
  WEB_FEATURE_FLAG_NAMES,
} from '@l.x/gating/src/flags'
export { getIsHashcashSolverEnabled, useIsHashcashSolverEnabled } from '@l.x/gating/src/getIsHashcashSolverEnabled'
export {
  getIsSessionsPerformanceTrackingEnabled,
  useIsSessionsPerformanceTrackingEnabled,
} from '@l.x/gating/src/getIsPerformanceTrackingEnabled'
export { getIsSessionServiceEnabled, useIsSessionServiceEnabled } from '@l.x/gating/src/getIsSessionServiceEnabled'
export { getIsSessionUpgradeAutoEnabled } from '@l.x/gating/src/getIsSessionUpgradeAutoEnabled'
export {
  getIsTurnstileSolverEnabled,
  useIsTurnstileSolverEnabled,
} from '@l.x/gating/src/getIsTurnstileSolverEnabled'
export {
  getDynamicConfigValue,
  getExperimentValue,
  getExperimentValueFromLayer,
  getFeatureFlag,
  useDynamicConfigValue,
  useExperimentValue,
  useExperimentValueFromLayer,
  useExperimentValueWithExposureLoggingDisabled,
  useFeatureFlag,
  useFeatureFlagWithExposureLoggingDisabled,
  useFeatureFlagWithLoading,
} from '@l.x/gating/src/hooks'
