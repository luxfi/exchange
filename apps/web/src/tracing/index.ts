import { brand } from '@l.x/config'
import { getInsights } from '@l.x/gating'
import { isRemoteReportingEnabled } from '~/utils/env'

if (isRemoteReportingEnabled()) {
  // Dump some metadata into the window to allow client verification.
  window.GIT_COMMIT_HASH = process.env.REACT_APP_GIT_COMMIT_HASH
}

// Warm the insights singleton + register app-level super properties.
try {
  const insights = getInsights()
  const appSlug = brand.appDomain?.replace(/\./g, '-') || 'lux-exchange'
  insights.register({
    app: appSlug,
    app_version: process.env.REACT_APP_GIT_COMMIT_HASH || 'unknown',
    platform: 'web',
  })
} catch {
  /* INSIGHTS_API_KEY not configured — events disabled */
}
