import { StatsigClient } from '@statsig/react-bindings'
import { getConfig } from '@l.x/config'
import { LocalOverrideAdapterWrapper } from '@l.x/gating/src/LocalOverrideAdapterWrapper'
import { isTestEnv } from '@l.x/utils/src/environment/env'

export {
  StatsigClient,
  StatsigContext,
  type StatsigOptions,
  StatsigProvider,
  type StatsigUser,
  Storage,
  type StorageProvider,
  type TypedReturn,
  useClientAsyncInit,
  useDynamicConfig,
  useExperiment,
  useFeatureGate,
  useGateValue,
  useLayer,
  useStatsigClient,
  useStatsigUser,
} from '@statsig/react-bindings'

let localOverrideAdapter: LocalOverrideAdapterWrapper | undefined

function getStatsigApiKeyOrThrow(): string {
  // A dummy key is used in test env b/c the wallet/mobile tests use this file
  // instead of the statsig.native file. White-label builds with no Statsig
  // key configured fall through to the same dummy: the client init fails
  // silently downstream and feature gates default to off, but the app still
  // renders. Throwing here previously broke first-paint on every brand that
  // didn't have a Statsig project provisioned.
  const statsigApiKey = isTestEnv() ? 'dummy-test-key' : getConfig().statsigApiKey

  if (!statsigApiKey) {
    return 'client-statsig-disabled'
  }

  return statsigApiKey
}

export function getOverrideAdapter(): LocalOverrideAdapterWrapper {
  if (!localOverrideAdapter) {
    localOverrideAdapter = new LocalOverrideAdapterWrapper(getStatsigApiKeyOrThrow())
  }
  return localOverrideAdapter
}

export function getStatsigClient(): StatsigClient {
  return StatsigClient.instance(getStatsigApiKeyOrThrow())
}
