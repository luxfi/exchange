import { Experiments } from '@l.x/gating'
import { LXEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

export function logExperimentQualifyingEvent({ experiment }: { experiment: Experiments }): void {
  sendAnalyticsEvent(LXEventName.ExperimentQualifyingEvent, {
    experiment,
  })
}
