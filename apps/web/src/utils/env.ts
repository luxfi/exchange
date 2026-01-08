import { isBetaEnv, isProdEnv } from 'utilities/src/environment/env'

function isAppLuxExchange({ hostname }: { hostname: string }): boolean {
  return hostname === 'lux.exchange' || hostname === 'app.lux.exchange'
}

function isAppLuxStaging({ hostname }: { hostname: string }): boolean {
  return hostname === 'staging.lux.exchange'
}

export function isBrowserRouterEnabled(): boolean {
  if (isProdEnv()) {
    if (
      isAppLuxExchange(window.location) ||
      isAppLuxStaging(window.location) ||
      isLocalhost(window.location) // playwright tests
    ) {
      return true
    }
    return false // production builds *not* served through our domains or localhost, eg IPFS
  }
  return true // local dev builds
}

function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === 'localhost'
}

export function isRemoteReportingEnabled(): boolean {
  // Disable in e2e test environments
  if (isBetaEnv() && !isAppLuxStaging(window.location)) {
    return false
  }
  if (isProdEnv() && !isAppLuxExchange(window.location)) {
    return false
  }
  return process.env.REACT_APP_ANALYTICS_ENABLED === 'true'
}
