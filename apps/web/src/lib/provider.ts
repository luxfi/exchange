// Provider wiring for the web app. White-label operators configure this
// via env vars; the rest of the UI consumes `providerClient` /
// `providerConfig` through the hooks in `@l.x/provider/react`.
//
// In pure-DeFi mode (no env), `client.enabled()` returns false and
// `RegulatedSwapGate` becomes a transparent pass-through.

import { createPublicClient, http } from 'viem'
import { RegulatedProviderClient } from '@l.x/provider'
import { readProviderConfig } from '@l.x/provider/config'

const env = typeof process !== 'undefined' && process.env ? process.env : {}

export const providerConfig = readProviderConfig({
  LIQUIDITY_PROVIDER_ADAPTER:         env.NEXT_PUBLIC_LIQUIDITY_PROVIDER_ADAPTER,
  LIQUIDITY_PROVIDER_ROUTER:          env.NEXT_PUBLIC_LIQUIDITY_PROVIDER_ROUTER,
  LIQUIDITY_PROVIDER_NAME:            env.NEXT_PUBLIC_LIQUIDITY_PROVIDER_NAME,
  LIQUIDITY_PROVIDER_ONBOARDING_URL:  env.NEXT_PUBLIC_LIQUIDITY_PROVIDER_ONBOARDING_URL,
  LIQUIDITY_PROVIDER_VERIFY_URL:      env.NEXT_PUBLIC_LIQUIDITY_PROVIDER_VERIFY_URL,
})

const rpc = env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'

export const providerClient = new RegulatedProviderClient(
  { adapter: providerConfig.adapter, router: providerConfig.router ?? '0x0000000000000000000000000000000000000000' as `0x${string}` },
  createPublicClient({ transport: http(rpc) }),
)
