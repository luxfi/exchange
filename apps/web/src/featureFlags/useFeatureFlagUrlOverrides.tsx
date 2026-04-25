import { setConfigOverride, setExperimentOverride, setGateOverride, useInsightsStatus } from '@luxfi/gating'
import { useEffect } from 'react'
import { useUrlContext } from '@l.x/lx/src/contexts/UrlContext'
import { isProdEnv } from '@l.x/utils/src/environment/env'

export function useFeatureFlagUrlOverrides() {
  const { useParsedQueryString } = useUrlContext()
  const { isInsightsReady } = useInsightsStatus()
  const parsedQs = useParsedQueryString()
  const isProduction = isProdEnv() && window.location.hostname !== 'localhost'

  useEffect(() => {
    const featureFlagOverrides =
      typeof parsedQs.featureFlagOverride === 'string' ? parsedQs.featureFlagOverride.split(',') : []
    const featureFlagOverridesOff =
      typeof parsedQs.featureFlagOverrideOff === 'string' ? parsedQs.featureFlagOverrideOff.split(',') : []

    const experimentOverrides =
      typeof parsedQs.experimentOverride === 'string' ? parsedQs.experimentOverride.split(',') : []

    const layerOverrides = typeof parsedQs.layerOverride === 'string' ? parsedQs.layerOverride.split(',') : []
    const layerOverridesOff = typeof parsedQs.layerOverrideOff === 'string' ? parsedQs.layerOverrideOff.split(',') : []

    if (isInsightsReady && !isProduction) {
      featureFlagOverrides.forEach((gate) => setGateOverride(gate, true))
      featureFlagOverridesOff.forEach((gate) => setGateOverride(gate, false))
      experimentOverrides.forEach((experiment) => {
        const [experimentName, groupName] = experiment.split(':')
        setExperimentOverride(experimentName, { group: groupName })
      })
      layerOverrides.forEach((layer) => {
        const [layerName, groupName] = layer.split(':')
        setConfigOverride(layerName, { [groupName]: true })
      })
      layerOverridesOff.forEach((layer) => {
        const [layerName, groupName] = layer.split(':')
        setConfigOverride(layerName, { [groupName]: false })
      })
    }
  }, [parsedQs, isProduction, isInsightsReady])
}
