import { TradingApi } from '@l.x/api'
import {
  Experiments,
  FeatureFlags,
  getExperimentValueFromLayer,
  getFeatureFlag,
  Layers,
  UnichainFlashblocksProperties,
  useExperimentValueFromLayer,
  useFeatureFlag,
} from '@l.x/gating'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { shouldShowFlashblocksUI } from '@l.x/lx/src/features/transactions/swap/components/UnichainInstantBalanceModal/utils'
import { isWebApp } from '@l.x/utils/src/platform'

/**
 * Core logic to determine if Flashblocks modal should be enabled.
 * Returns true only when:
 * 1. The UnichainFlashblocks feature flag is enabled
 * 2. The user is allocated to the UnichainFlashblocksModal experiment in the SwapPage layer (web only)
 * 3. The flashblocksModalEnabled parameter is true for that experiment
 * 4. The current chain is Unichain mainnet or Unichain sepolia
 */
function isFlashblocksModalEnabledForChain({
  flashblocksFlagEnabled,
  flashblocksModalEnabled,
  chainId,
}: {
  flashblocksFlagEnabled: boolean
  flashblocksModalEnabled: boolean
  chainId?: UniverseChainId
}): boolean {
  // Check feature flag on all platforms
  if (!flashblocksFlagEnabled) {
    return false
  }

  // Only check experiment on the web app
  if (isWebApp && !flashblocksModalEnabled) {
    return false
  }

  return chainId === UniverseChainId.Unichain || chainId === UniverseChainId.UnichainSepolia
}

/**
 * Hook to determine if the Flashblocks modal should be enabled.
 * Uses React hooks to read feature flags and experiments.
 */
export function useIsUnichainFlashblocksEnabled(chainId?: UniverseChainId): boolean {
  const flashblocksFlagEnabled = useFeatureFlag(FeatureFlags.UnichainFlashblocks)

  const flashblocksModalEnabled = useExperimentValueFromLayer<
    Layers.SwapPage,
    Experiments.UnichainFlashblocksModal,
    boolean
  >({
    layerName: Layers.SwapPage,
    param: UnichainFlashblocksProperties.FlashblocksModalEnabled,
    defaultValue: false,
  })

  return isFlashblocksModalEnabledForChain({ flashblocksFlagEnabled, flashblocksModalEnabled, chainId })
}

/**
 * Sync function to determine if the Flashblocks modal should be enabled.
 * Uses direct getters to read feature flags and experiments.
 */
export function getIsFlashblocksEnabled(chainId?: UniverseChainId): boolean {
  const flashblocksFlagEnabled = getFeatureFlag(FeatureFlags.UnichainFlashblocks)

  const flashblocksModalEnabled = getExperimentValueFromLayer<
    Layers.SwapPage,
    Experiments.UnichainFlashblocksModal,
    boolean
  >({
    layerName: Layers.SwapPage,
    param: UnichainFlashblocksProperties.FlashblocksModalEnabled,
    defaultValue: false,
  })

  return isFlashblocksModalEnabledForChain({ flashblocksFlagEnabled, flashblocksModalEnabled, chainId })
}

export function getFlashblocksExperimentStatus({
  chainId,
  routing,
}: {
  chainId?: UniverseChainId
  routing?: TradingApi.Routing
}): {
  /** Whether to log a qualifying event (swap is eligible) */
  shouldLogQualifyingEvent: boolean
  /** Whether to show the flashblocks modal (treatment variant) */
  shouldShowModal: boolean
} {
  // Skip routes are not part of the experiment
  if (!shouldShowFlashblocksUI(routing)) {
    return { shouldLogQualifyingEvent: false, shouldShowModal: false }
  }

  const flashblocksFlagEnabled = getFeatureFlag(FeatureFlags.UnichainFlashblocks)
  const isUnichainChain = chainId === UniverseChainId.Unichain || chainId === UniverseChainId.UnichainSepolia

  if (!flashblocksFlagEnabled || !isUnichainChain) {
    return { shouldLogQualifyingEvent: false, shouldShowModal: false }
  }

  // Mobile/Extension: no experiment, feature flag controls behavior
  if (!isWebApp) {
    return { shouldLogQualifyingEvent: false, shouldShowModal: true }
  }

  // Web: experiment controls behavior
  const flashblocksModalEnabled = getExperimentValueFromLayer<
    Layers.SwapPage,
    Experiments.UnichainFlashblocksModal,
    boolean
  >({
    layerName: Layers.SwapPage,
    param: UnichainFlashblocksProperties.FlashblocksModalEnabled,
    defaultValue: false,
  })

  return {
    // TRUE for all users that reach this point, even if they're not part of the experiment.
    // Hanzo Insights filters out non-allocated users via auto-exposure: only users that
    // triggered this event *after* being exposed to the experiment are counted.
    shouldLogQualifyingEvent: true,
    // TRUE for treatment variant or forced override
    shouldShowModal: flashblocksModalEnabled === true,
  }
}
