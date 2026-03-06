import { Experiments } from '@luxfi/gating'
import { LuxEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

export function logExperimentQualifyingEvent({ experiment }: { experiment: Experiments }): void {
  sendAnalyticsEvent(LuxEventName.ExperimentQualifyingEvent, {
    experiment,
  })
}
