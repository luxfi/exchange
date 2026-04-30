import { setupAnalytics } from '~/tracing/analytics'
import { setupInsights } from '~/tracing/insights'
import { isRemoteReportingEnabled } from '~/utils/env'

if (isRemoteReportingEnabled()) {
  // Dump some metadata into the window to allow client verification.
  window.GIT_COMMIT_HASH = process.env.REACT_APP_GIT_COMMIT_HASH
}

// Order matters: Insights is the default analytics driver — wire it first
// so analytics.init() (called inside setupAnalytics) has a driver to
// forward events to.
setupInsights()
setupAnalytics()
