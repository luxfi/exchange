import { Experiments } from '@l.x/gating'
import { LXEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'

export function logExperimentQualifyingEvent({ experiment }: { experiment: Experiments }): void {
  sendAnalyticsEvent(LXEventName.ExperimentQualifyingEvent, {
    experiment,
  })
}
