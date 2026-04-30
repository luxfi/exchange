import { isDevEnv, isRNDev } from '@l.x/utils/src/environment/env'
import { isMobileApp } from '@l.x/utils/src/platform'

const isVitestRun = !!process.env.VITEST_POOL_ID
// TODO(INFRA-292): remove JEST_WORKER_ID when jest is fully deprecated
export const isTestRun = !!process.env.JEST_WORKER_ID || !!process.env.VITEST_POOL_ID
export const isNonTestDev = !isVitestRun && !isTestRun && (isMobileApp ? isRNDev() : isDevEnv())
/**
 * Legacy flag used to gate the (now-removed) Datadog SDK init in dev mode.
 * Kept (as `false`) because consumers of `@l.x/utils/src/environment/constants`
 * still import this name and the active observability driver is now
 * configured separately via `setObservabilityDriver`.
 */
export const localDevDatadogEnabled = false
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const datadogEnabledBuild = (localDevDatadogEnabled || !isRNDev()) && !isTestRun && !isVitestRun
