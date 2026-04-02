import { Experiments } from '@luxexchange/gating'
import { LxEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

export function logExperimentQualifyingEvent({ experiment }: { experiment: Experiments }): void {
  sendAnalyticsEvent(LxEventName.ExperimentQualifyingEvent, {
    experiment,
  })
}
