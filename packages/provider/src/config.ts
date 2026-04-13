import type { Address } from 'viem'

/**
 * Provider configuration.
 *
 * `adapter` and `router` are read by the contract client.
 * `name` / `onboardingUrl` / `verifyUrl` are read by the UI to render
 * branded onboarding and verification flows.
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

/**
 * Read provider config from environment variables.
 *
 * Env key convention (Vite-native):
 *   VITE_LIQUIDITY_ADAPTER         adapter address (IRegulatedProvider)
 *   VITE_LIQUIDITY_ROUTER          Lux ProviderRouter address
 *   VITE_LIQUIDITY_NAME            human-readable provider name
 *   VITE_LIQUIDITY_ONBOARDING_URL  URL to the provider's KYC flow
 *   VITE_LIQUIDITY_VERIFY_URL      URL to the provider's verification page
 *
 * Pass `import.meta.env` from a Vite app. Any missing key → that field
 * is null; the `RegulatedSwapGate` falls back to pass-through.
 */
export function readProviderConfig(env: Record<string, string | undefined>): ProviderConfig {
  const adapter = (env.VITE_LIQUIDITY_ADAPTER || '') as Address
  const router  = (env.VITE_LIQUIDITY_ROUTER  || '') as Address
  return {
    adapter: adapter.length ? adapter : null,
    router:  router.length  ? router  : null,
    name:           env.VITE_LIQUIDITY_NAME           ?? null,
    onboardingUrl:  env.VITE_LIQUIDITY_ONBOARDING_URL ?? null,
    verifyUrl:      env.VITE_LIQUIDITY_VERIFY_URL     ?? null,
  }
}

/**
 * Build the onboarding URL with a return callback so the provider can
 * send the user back to the swap page after KYC completes.
 */
export function buildOnboardingUrl(cfg: ProviderConfig, returnUrl: string, traderAddress?: string): string | null {
  if (!cfg.onboardingUrl) return null
  const url = new URL(cfg.onboardingUrl)
  url.searchParams.set('return', returnUrl)
  if (traderAddress) url.searchParams.set('address', traderAddress)
  return url.toString()
}
