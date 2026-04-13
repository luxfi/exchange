import type { Address } from 'viem'

/**
 * Full provider configuration including UX hints.
 *
 * `adapter` and `router` are read by the contract client.
 * `name` / `onboardingUrl` / `verifyUrl` are read by the UI to render
 * white-label-branded onboarding and verification flows.
 *
 * Any field may be null/undefined. A null `adapter` runs in pure-DeFi
 * mode; the UI hides regulated-asset controls entirely in that case.
 */
export interface ProviderConfig {
  adapter: Address | null
  router: Address | null
  name: string | null
  onboardingUrl: string | null
  verifyUrl: string | null
}

export const NULL_PROVIDER: ProviderConfig = {
  adapter: null,
  router: null,
  name: null,
  onboardingUrl: null,
  verifyUrl: null,
}

/** Read provider config from a white-label fork's environment variables.
 *  The `LIQUIDITY_PROVIDER_*` naming follows the generic finance term
 *  "liquidity provider" (market maker / regulated venue) — it is not a
 *  reference to any specific brand. */
export function readProviderConfig(env: Record<string, string | undefined>): ProviderConfig {
  const adapter = (env.LIQUIDITY_PROVIDER_ADAPTER || '') as Address
  const router  = (env.LIQUIDITY_PROVIDER_ROUTER  || '') as Address
  return {
    adapter: adapter.length ? adapter : null,
    router:  router.length  ? router  : null,
    name:           env.LIQUIDITY_PROVIDER_NAME           ?? null,
    onboardingUrl:  env.LIQUIDITY_PROVIDER_ONBOARDING_URL ?? null,
    verifyUrl:      env.LIQUIDITY_PROVIDER_VERIFY_URL     ?? null,
  }
}

/** Build the onboarding URL with a return callback so the provider can
 *  send the user back to the swap page after KYC completes. */
export function buildOnboardingUrl(cfg: ProviderConfig, returnUrl: string, traderAddress?: string): string | null {
  if (!cfg.onboardingUrl) return null
  const url = new URL(cfg.onboardingUrl)
  url.searchParams.set('return', returnUrl)
  if (traderAddress) url.searchParams.set('address', traderAddress)
  return url.toString()
}
