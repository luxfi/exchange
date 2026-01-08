import { Experiments, getExperimentValue, WebFORNudgesProperties } from '@luxfi/gating'
import { isWebApp } from 'utilities/src/platform'

export function getIsWebFORNudgeEnabled(): boolean {
  if (!isWebApp) {
    return false
  }

  return getExperimentValue({
    experiment: Experiments.WebFORNudges,
    param: WebFORNudgesProperties.NudgeEnabled,
    defaultValue: false,
  })
}
