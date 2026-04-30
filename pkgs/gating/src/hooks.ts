// Local-only feature gating. No third-party SDK, no telemetry, no remote
// override fetching. Every call returns the caller's default — gates are off,
// experiments resolve to their default group, dynamic configs return the
// supplied default value. Telemetry and behavioural overrides moved to
// `@hanzo/analytics` + `@hanzo/insights`.

import { type DynamicConfigKeys } from '@l.x/gating/src/configs'
import { type ExperimentProperties, type Experiments } from '@l.x/gating/src/experiments'
import { FeatureFlags } from '@l.x/gating/src/flags'

// Local-only flag overrides. White-label brands can flip a beta capability
// for the current device by writing a sentinel into localStorage; the
// canonical way to gate features is via `@hanzo/insights` but until
// the bridge ships, this lets us keep e.g. the embedded-wallet beta unlock
// modal working without coupling to a third-party SDK.
const LOCAL_FLAG_KEYS: Partial<Record<FeatureFlags, string>> = {
  [FeatureFlags.EmbeddedWallet]: 'lx.embeddedWalletBeta',
}

function isFlagEnabledLocally(flag: FeatureFlags): boolean {
  const key = LOCAL_FLAG_KEYS[flag]
  if (!key) return false
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

export function useFeatureFlag(flag: FeatureFlags): boolean {
  return isFlagEnabledLocally(flag)
}

export function useFeatureFlagWithLoading(flag: FeatureFlags): { value: boolean; isLoading: boolean } {
  return { value: isFlagEnabledLocally(flag), isLoading: false }
}

export function getFeatureFlag(flag: FeatureFlags): boolean {
  return isFlagEnabledLocally(flag)
}

export function useFeatureFlagWithExposureLoggingDisabled(flag: FeatureFlags): boolean {
  return isFlagEnabledLocally(flag)
}

export function getFeatureFlagWithExposureLoggingDisabled(flag: FeatureFlags): boolean {
  return isFlagEnabledLocally(flag)
}

export function useExperimentGroupNameWithLoading(_experiment: Experiments): {
  value: string | null
  isLoading: boolean
} {
  return { value: null, isLoading: false }
}

export function useExperimentGroupName(_experiment: Experiments): string | null {
  return null
}

export function useExperimentValue<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>({
  defaultValue,
}: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function getExperimentValue<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>({
  defaultValue,
}: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function useExperimentValueWithExposureLoggingDisabled<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>({
  defaultValue,
}: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function useDynamicConfigValue<
  Conf extends keyof DynamicConfigKeys,
  Key extends DynamicConfigKeys[Conf],
  ValType,
>({
  defaultValue,
}: {
  config: Conf
  key: Key
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function getDynamicConfigValue<
  Conf extends keyof DynamicConfigKeys,
  Key extends DynamicConfigKeys[Conf],
  ValType,
>({
  defaultValue,
}: {
  config: Conf
  key: Key
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function getExperimentValueFromLayer<Layer extends string, Exp extends keyof ExperimentProperties, ValType>({
  defaultValue,
}: {
  layerName: Layer
  param: ExperimentProperties[Exp]
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}

export function useExperimentValueFromLayer<Layer extends string, Exp extends keyof ExperimentProperties, ValType>({
  defaultValue,
}: {
  layerName: Layer
  param: ExperimentProperties[Exp]
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return defaultValue
}
