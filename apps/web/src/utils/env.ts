import { brand } from '@l.x/config'
import { isBetaEnv, isProdEnv } from '@luxfi/utilities/src/environment/env'

/** Check if we are running on a known production exchange domain */
function isKnownExchangeDomain({ hostname }: { hostname: string }): boolean {
  if (brand.appDomain && hostname === brand.appDomain) {
    return true
  }
  return (
    hostname === 'lux.exchange' ||
    hostname === 'app.lux.exchange' ||
    hostname === 'zoo.exchange' ||
    hostname === 'app.zoo.exchange'
  )
}

function isStagingDomain({ hostname }: { hostname: string }): boolean {
  if (brand.appDomain) {
    return hostname === `staging.${brand.appDomain}`
  }
  return hostname === 'staging.lux.exchange' || hostname === 'staging.zoo.exchange'
}

export function isBrowserRouterEnabled(): boolean {
  if (isProdEnv()) {
    if (
      isKnownExchangeDomain(window.location) ||
      isStagingDomain(window.location) ||
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
  if (isBetaEnv() && !isStagingDomain(window.location)) {
    return false
  }
  if (isProdEnv() && !isKnownExchangeDomain(window.location)) {
    return false
  }
  return process.env.REACT_APP_ANALYTICS_ENABLED === 'true'
}
