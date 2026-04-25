import {
  useFeatureFlagEnabled as useInsightsFlagEnabled,
  useFeatureFlagPayload as useInsightsFlagPayload,
  useFeatureFlagVariantKey as useInsightsFlagVariantKey,
} from '@hanzo/insights-react'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { DynamicConfigKeys } from '@l.x/gating/src/configs'
import { ExperimentProperties } from '@l.x/gating/src/experiments'
import { FeatureFlags, getFeatureFlagName } from '@l.x/gating/src/flags'
import { getInsights } from '@l.x/gating/src/insights'
import {
  getConfigOverride,
  getExperimentOverride,
  getGateOverride,
  getOverrides as getRawOverrides,
} from '@l.x/gating/src/overrides'
import { logger } from '@l.x/utils/src/logger/logger'

function subscribeToOverrides(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener('l.x:gating:overrides:changed', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('l.x:gating:overrides:changed', cb)
    window.removeEventListener('storage', cb)
  }
}

function useOverrideRev(): number {
  return useSyncExternalStore(
    subscribeToOverrides,
    () => getRawOverrides() as unknown as number,
    () => 0,
  ) as unknown as number
}

export function useFeatureFlag(flag: FeatureFlags): boolean {
  useOverrideRev()
  const name = getFeatureFlagName(flag)
  const override = getGateOverride(name)
  const remote = useInsightsFlagEnabled(name)
  return override ?? remote ?? false
}

export function useFeatureFlagWithLoading(flag: FeatureFlags): { value: boolean; isLoading: boolean } {
  const { isInsightsLoading } = useInsightsStatus()
  const name = getFeatureFlagName(flag)
  const override = getGateOverride(name)
  const remote = useInsightsFlagEnabled(name)
  return { value: override ?? remote ?? false, isLoading: isInsightsLoading }
}

export function getFeatureFlag(flag: FeatureFlags): boolean {
  try {
    const name = getFeatureFlagName(flag)
    const override = getGateOverride(name)
    if (override !== undefined) return override
    return getInsights().isFeatureEnabled(name) ?? false
  } catch (e) {
    logger.debug('gating/hooks.ts', 'getFeatureFlag', JSON.stringify({ e }))
    return false
  }
}

export function useFeatureFlagWithExposureLoggingDisabled(flag: FeatureFlags): boolean {
  return useFeatureFlag(flag)
}

export function getFeatureFlagWithExposureLoggingDisabled(flag: FeatureFlags): boolean {
  return getFeatureFlag(flag)
}

export function useExperimentGroupNameWithLoading(experiment: string): {
  value: string | null
  isLoading: boolean
} {
  const { isInsightsLoading } = useInsightsStatus()
  const variant = useInsightsFlagVariantKey(experiment)
  const value = typeof variant === 'string' ? variant : null
  return { value, isLoading: isInsightsLoading }
}

export function useExperimentGroupName(experiment: string): string | null {
  const variant = useInsightsFlagVariantKey(experiment)
  return typeof variant === 'string' ? variant : null
}

export function useExperimentValue<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>({
  experiment,
  param,
  defaultValue,
  customTypeGuard,
}: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  useOverrideRev()
  const override = getExperimentOverride(experiment as string)
  const payload = useInsightsFlagPayload(experiment as string)
  const source = (override ?? payload) as Record<string, unknown> | undefined
  const value = source?.[param as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

export function getExperimentValue<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>({
  experiment,
  param,
  defaultValue,
  customTypeGuard,
}: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  const override = getExperimentOverride(experiment as string)
  const payload = override ?? (getInsights().getFeatureFlagPayload(experiment as string) as Record<string, unknown> | undefined)
  const value = payload?.[param as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

export function useExperimentValueWithExposureLoggingDisabled<
  Exp extends keyof ExperimentProperties,
  Param extends ExperimentProperties[Exp],
  ValType,
>(args: {
  experiment: Exp
  param: Param
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  return useExperimentValue(args)
}

export function useDynamicConfigValue<
  Conf extends keyof DynamicConfigKeys,
  Key extends DynamicConfigKeys[Conf],
  ValType,
>({
  config,
  key,
  defaultValue,
  customTypeGuard,
}: {
  config: Conf
  key: Key
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  useOverrideRev()
  const override = getConfigOverride(config as string)
  const payload = useInsightsFlagPayload(config as string)
  const source = (override ?? payload) as Record<string, unknown> | undefined
  const value = source?.[key as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

export function getDynamicConfigValue<
  Conf extends keyof DynamicConfigKeys,
  Key extends DynamicConfigKeys[Conf],
  ValType,
>({
  config,
  key,
  defaultValue,
  customTypeGuard,
}: {
  config: Conf
  key: Key
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  const override = getConfigOverride(config as string)
  const payload = override ?? (getInsights().getFeatureFlagPayload(config as string) as Record<string, unknown> | undefined)
  const value = payload?.[key as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

// On Insights, "layers" collapse to "flags": layerName == flagName, params are payload keys.
export function getExperimentValueFromLayer<Layer extends string, Exp extends keyof ExperimentProperties, ValType>({
  layerName,
  param,
  defaultValue,
  customTypeGuard,
}: {
  layerName: Layer
  param: ExperimentProperties[Exp]
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  const payload = getInsights().getFeatureFlagPayload(layerName) as Record<string, unknown> | undefined
  const value = payload?.[param as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

export function useExperimentValueFromLayer<Layer extends string, Exp extends keyof ExperimentProperties, ValType>({
  layerName,
  param,
  defaultValue,
  customTypeGuard,
}: {
  layerName: Layer
  param: ExperimentProperties[Exp]
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  const payload = useInsightsFlagPayload(layerName as string)
  const value = (payload as Record<string, unknown> | undefined)?.[param as string]
  return checkTypeGuard({ value, defaultValue, customTypeGuard })
}

export function checkTypeGuard<ValType>({
  value,
  defaultValue,
  customTypeGuard,
}: {
  value: unknown
  defaultValue: ValType
  customTypeGuard?: (x: unknown) => x is ValType
}): ValType {
  const isOfDefaultValueType = (val: unknown): val is ValType => typeof val === typeof defaultValue
  if (customTypeGuard?.(value) || isOfDefaultValueType(value)) {
    return value
  }
  return defaultValue
}

export function useInsightsStatus(): {
  isInsightsLoading: boolean
  isInsightsReady: boolean
} {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const insights = getInsights()
    const off = insights.onFeatureFlags(() => setReady(true))
    return off
  }, [])
  return useMemo(
    () => ({
      isInsightsLoading: !ready,
      isInsightsReady: ready,
    }),
    [ready],
  )
}
